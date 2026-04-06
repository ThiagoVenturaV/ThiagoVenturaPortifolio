import { useRef, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, Environment } from '@react-three/drei';
import * as THREE from 'three';

function clamp(v: number, lo: number, hi: number) {
  return v < lo ? lo : v > hi ? hi : v;
}
const L = THREE.MathUtils.lerp;

const scrollStore = { target: 0 };

// ─────────────────────────────────────────────────────────────
//  COORDINATE NOTES (important for understanding posX/posY):
//
//  The blade node has a baked 90° Z quaternion, so local X
//  maps to world Y. Blade tip (kissaki) is at local X=+3.37,
//  handle (tsuka) at local X=-1.44.
//
//  GROUP rotZ:
//   PI/2  → horizontal, handle RIGHT tip LEFT
//   0     → vertical, tip UP   handle DOWN
//   PI    → vertical, tip DOWN handle UP
//
//  Centering corrections:
//   Horizontal: visual center offset = -(3.37-1.44)/2 × scl
//               ≈ -0.627 from group posX → set posX ≈ +0.6
//   Vertical tip-UP  (rotZ=0):  center at +0.579 → posY ≈ -0.6
//   Vertical tip-DOWN (rotZ=PI): center at -0.579 → posY ≈ +0.6
// ─────────────────────────────────────────────────────────────

export default function KatanaModel() {
  const groupRef = useRef<THREE.Group>(null);
  const idle     = useRef(0);
  const smooth   = useRef(0);

  const gltf = useGLTF('/katana.glb');

  // Only the blade node — saya never enters the scene
  const bladeNode = useMemo(() => {
    const node = gltf.scene.getObjectByName('Katana');
    if (!node) return null;
    node.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.frustumCulled = false;
        if (child.material) {
          const mat = child.material as THREE.MeshStandardMaterial;
          mat.envMapIntensity = 3.0;
          mat.needsUpdate     = true;
          child.castShadow    = true;
          child.receiveShadow = true;
        }
      }
    });
    return node;
  }, [gltf]);

  // Scroll → progress 0–4  (hero=0, about=1, skills=2, projects=3, contact=4)
  useEffect(() => {
    const calc = () => {
      const ids  = ['hero', 'about', 'skills', 'projects', 'contact'];
      const tops = ids.map(id => document.getElementById(id)?.offsetTop ?? 0);
      const y    = window.scrollY;
      
      // Prevent division by zero if layout isn't fully ready yet
      if (tops[tops.length - 1] === 0) return 0;

      for (let i = 0; i < tops.length - 1; i++) {
        const diff = tops[i + 1] - tops[i];
        if (diff > 0 && y < tops[i + 1]) {
          return i + clamp((y - tops[i]) / diff, 0, 1);
        }
      }
      return 4;
    };
    const onScroll = () => { scrollStore.target = calc(); };
    onScroll();
    
    // Fallback recalculations because DOM layout might take a few ms to stabilize:
    const t1 = setTimeout(onScroll, 300);
    const t2 = setTimeout(onScroll, 2500);

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  useFrame((_, dt) => {
    if (!groupRef.current) return;

    if (Number.isNaN(scrollStore.target)) scrollStore.target = 0;
    if (Number.isNaN(smooth.current)) smooth.current = 0;

    idle.current   += dt;
    smooth.current += (scrollStore.target - smooth.current) * 0.06;
    const p = smooth.current;

    const bob    = Math.sin(idle.current * 0.80) * 0.025;
    const wobble = Math.sin(idle.current * 0.55) * 0.012;

    let px: number, py: number;
    let rx = 0, ry = 0, rz: number;
    let scl: number;

    const isMobile = window.innerWidth < 768;
    // On small screens, frustum width is much smaller. Values adjusted to fit nicely.
    const xBaseCenter = isMobile ? 0.3  : 0.6;
    const xRight      = isMobile ? 0.8  : 3.2;   // keep closer to the center to not overflow screen bounds
    const xLeft       = isMobile ? -0.8 : -3.2;
    const sclBase     = isMobile ? 0.35 : 0.60;
    const sclHero     = isMobile ? 0.45 : 0.65;

    // ── 0→1  Hero → Sobre ─────────────────────────────────
    // Horizontal centered → Vertical right, tip up
    if (p <= 1) {
      const t = p;
      px  = L( xBaseCenter, xRight, t);
      py  = L( 0.8, -0.6, t);
      rz  = L(Math.PI / 2, 0, t);
      ry  = L( 0.2, -0.1, t);
      rx  = L( 0.05, 0.0, t);
      scl = L( sclHero, sclBase, t);

    // ── 1→2  Sobre → Habilidades  (slash: tip-up → tip-down) ─
    } else if (p <= 2) {
      const t = p - 1;
      px  = xRight;
      py  = L(-0.6,  0.6, t);   // compensates visual center flip
      rz  = t * Math.PI;         // 0 → π
      ry  = L(-0.1,  0.1, t);
      rx  = Math.sin(t * Math.PI) * 0.2;
      scl = sclBase;

    // ── 2→3  Habilidades → Projetos ───────────────────────
    // Vertical right tip-down → Horizontal centered near title
    } else if (p <= 3) {
      const t = p - 2;
      px  = L( xRight, xBaseCenter, t);
      py  = L( 0.6,  1.1, t);
      rz  = L(Math.PI, Math.PI / 2, t);   // tip-down → horizontal
      ry  = L( 0.1,  0.2, t);
      rx  = 0;
      scl = sclBase;

    // ── 3→4  Projetos → Contato ───────────────────────────
    // Horizontal centered → Vertical LEFT, tip down
    } else {
      const t = p - 3;
      px  = L( xBaseCenter, xLeft, t);
      py  = L( 1.1,  0.6, t);
      rz  = L(Math.PI / 2, Math.PI, t);   // horizontal → tip-down
      ry  = L( 0.2, -0.1, t);
      rx  = 0;
      scl = sclBase;
    }

    groupRef.current.position.set(px, py + bob, 0);
    groupRef.current.rotation.set(rx + wobble * 0.3, ry + wobble, rz);
    groupRef.current.scale.setScalar(scl);
  });

  if (!bladeNode) return null;

  return (
    <>
      <Environment preset="night" />
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={1.5} castShadow />
      <pointLight position={[-3, 2, 2]} intensity={0.8} color="#c9a84c" />
      <spotLight position={[0, 5, 0]} angle={0.3} penumbra={1} intensity={0.6} color="#c9a84c" castShadow />

      <group
        ref={groupRef}
        position={[0.6, 0.8, 0]}
        rotation={[0.05, 0.2, Math.PI / 2]}
        scale={0.65}
      >
        <primitive object={bladeNode} />
      </group>
    </>
  );
}

useGLTF.preload('/katana.glb');
