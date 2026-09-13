import { Environment, Lightformer } from '@react-three/drei';
import { BackSide } from 'three';

export default function KatanaLighting({ master }: { master: boolean }) {
  if (!master) return <>
    <Environment preset="night" />
    <ambientLight intensity={0.3} />
    <directionalLight position={[5, 5, 5]} intensity={1.5} />
    <pointLight position={[-3, 2, 2]} intensity={0.8} color="#c9a84c" />
    <spotLight position={[0, 5, 0]} angle={0.3} penumbra={1} intensity={0.6} color="#c9a84c" />
  </>;

  return <>
    {/* Low neutral fill preserves pigment and fabric detail. Narrow side panels
        keep steel readable as the rig turns without whitening the lacquer. */}
    <Environment resolution={256} frames={1}>
      <mesh>
        <sphereGeometry args={[30, 32, 16]} />
        <meshBasicMaterial color="#74777d" side={BackSide} toneMapped={false} />
      </mesh>
      <Lightformer position={[0, 1, 8]} target={[0, 0, 0]} scale={[10, 4, 1]} intensity={1.2} />
      <Lightformer position={[-5, 3, 4]} target={[0, 0, 0]} scale={[2, 7, 1]} intensity={2.4} />
      <Lightformer position={[5, 1, 2]} target={[0, 0, 0]} scale={[2, 8, 1]} intensity={0.8} />
      <Lightformer position={[0, 5, -6]} target={[0, 0, 0]} scale={[10, 1.2, 1]} intensity={1.6} />
      <Lightformer position={[0, -6, 1]} target={[0, 0, 0]} scale={[6, 2, 1]} intensity={0.3} />
    </Environment>
    <ambientLight intensity={0.2} />
    <directionalLight position={[-3, 5, 8]} intensity={1.2} />
    <directionalLight position={[5, -1, -4]} intensity={0.35} />
  </>;
}
