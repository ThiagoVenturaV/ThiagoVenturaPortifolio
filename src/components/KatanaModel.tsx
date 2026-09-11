import { useRef, useEffect, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useGLTF, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { katanaPose, sectionProgress } from '../lib/katanaMotion';

const MODEL_URL = '/katana-sheathed.glb';
const SECTION_IDS = ['hero', 'about', 'skills', 'projects', 'contact'];

export default function KatanaModel() {
  const rig = useRef<THREE.Group>(null);
  const sword = useRef<THREE.Group>(null);
  const saya = useRef<THREE.Group>(null);
  const motion = useRef({ target: 0, smooth: 0, reduced: false, initialized: false });
  const { viewport, size } = useThree();
  const gltf = useGLTF(MODEL_URL);

  const parts = useMemo(() => {
    const blade = gltf.scene.getObjectByName('Katana')?.clone(true);
    const sheath = gltf.scene.getObjectByName('Saya')?.clone(true);
    const materials: THREE.MeshStandardMaterial[] = [];
    const sheathMaterials: THREE.MeshStandardMaterial[] = [];
    for (const part of [blade, sheath]) {
      part?.traverse((child) => {
        if (!(child instanceof THREE.Mesh)) return;
        const originals = Array.isArray(child.material) ? child.material : [child.material];
        const copies = originals.map((material: THREE.MeshStandardMaterial) => {
          const copy = material.clone();
          copy.envMapIntensity = 3;
          if (part === sheath) {
            copy.transparent = true;
            sheathMaterials.push(copy);
          }
          materials.push(copy);
          return copy;
        });
        child.material = Array.isArray(child.material) ? copies : copies[0];
      });
    }
    return { blade, sheath, materials, sheathMaterials };
  }, [gltf]);

  useEffect(() => () => parts.materials.forEach((material) => material.dispose()), [parts]);

  useEffect(() => {
    const state = motion.current;
    let tops: number[] = [];
    let maxScroll = 0;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onPreference = () => { state.reduced = preference.matches; };
    const onScroll = () => {
      state.target = sectionProgress(window.scrollY, tops, maxScroll);
      if (!state.initialized) {
        state.smooth = state.target;
        state.initialized = true;
      }
    };
    const measure = () => {
      tops = SECTION_IDS.map((id) => {
        const element = document.getElementById(id);
        return element ? element.getBoundingClientRect().top + window.scrollY : 0;
      });
      maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
      onScroll();
    };
    onPreference();
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(document.body);
    SECTION_IDS.forEach((id) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });
    const frame = requestAnimationFrame(measure);
    preference.addEventListener('change', onPreference);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', measure, { passive: true });
    window.addEventListener('load', measure);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      preference.removeEventListener('change', onPreference);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', measure);
      window.removeEventListener('load', measure);
    };
  }, []);

  useFrame((_, delta) => {
    if (!rig.current || !sword.current || !saya.current || document.hidden) return;
    const state = motion.current;
    // Frame-rate independent smoothing, without a time-driven idle loop.
    state.smooth = THREE.MathUtils.damp(state.smooth, state.target, 9, Math.min(delta, 0.1));
    const pose = katanaPose(state.reduced ? 0 : state.smooth, viewport.width, size.width < 768);
    rig.current.position.set(pose.x, pose.y, 0);
    rig.current.rotation.set(pose.rx, pose.ry, pose.rz);
    rig.current.scale.setScalar(pose.scale);
    // Reduced motion keeps the sheathed hero still and hides it past the hero.
    rig.current.visible = !state.reduced || state.target < 0.15;
    sword.current.position.set(pose.bladeX, pose.bladeY, 0);
    sword.current.rotation.z = pose.bladeZ;
    saya.current.position.set(pose.sayaX, pose.sayaY, 0);
    saya.current.visible = pose.sayaOpacity > 0.001;
    parts.sheathMaterials.forEach((material) => {
      material.opacity = pose.sayaOpacity;
      material.depthWrite = pose.sayaOpacity > 0.98;
    });
  });

  if (!parts.blade || !parts.sheath) return null;
  return (
    <>
      <Environment preset="night" />
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={1.5} />
      <pointLight position={[-3, 2, 2]} intensity={0.8} color="#c9a84c" />
      <spotLight position={[0, 5, 0]} angle={0.3} penumbra={1} intensity={0.6} color="#c9a84c" />
      <group ref={rig} position={[0.6, 0.8, 0]} rotation={[0.05, 0.2, Math.PI / 2]} scale={0.65}>
        <group ref={sword}><primitive object={parts.blade} /></group>
        <group ref={saya}><primitive object={parts.sheath} /></group>
      </group>
    </>
  );
}

useGLTF.preload(MODEL_URL);
