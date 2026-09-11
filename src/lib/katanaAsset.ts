import { Group, Matrix4, Object3D } from 'three';

export const MASTER_MODEL_SCALE = 4.9 / 1.102;

// Master glTF: +X length, -Z curvature, +Y thickness. Match the existing
// portfolio rig through a rigid transform and uniform scale, preserving meshes.
export function masterToPortfolio(): Matrix4 {
  const s = MASTER_MODEL_SCALE;
  return new Matrix4().set(0, 0, -s, 0, s, 0, 0, -0.1, 0, -s, 0, 0, 0, 0, 0, 1);
}

export function katanaAssetParts(scene: Object3D, master: boolean) {
  scene.updateMatrixWorld(true);
  const part = (label: 'Katana' | 'Saya', suffix: string) => {
    let source: Object3D | undefined;
    scene.traverse((node) => {
      if (master ? node.name.endsWith(suffix) : node.name === label) source = node;
    });
    if (!source) throw new Error(`Missing ${label} in katana asset`);
    const clone = source.clone(true);
    if (!master) return clone;
    source.matrixWorld.decompose(clone.position, clone.quaternion, clone.scale);
    const wrapper = new Group();
    wrapper.name = label;
    wrapper.applyMatrix4(masterToPortfolio());
    wrapper.add(clone);
    return wrapper;
  };
  return { blade: part('Katana', 'Sword_CTRL'), sheath: part('Saya', 'Saya_CTRL') };
}
