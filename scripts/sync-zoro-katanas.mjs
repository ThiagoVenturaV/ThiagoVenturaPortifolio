// Publish the authored GLBs verbatim. Orientation/scale belong to the runtime rig.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const base = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const source = resolve(process.argv[2] ?? resolve(base, '../zoro-katanas/models'));
const output = resolve(base, 'public/katanas');
mkdirSync(output, { recursive: true });
const report = [];
for (const id of ['wado', 'sandai', 'enma']) {
  const bytes = readFileSync(resolve(source, `${id}.glb`));
  const data = JSON.parse(bytes.subarray(20, 20 + bytes.readUInt32LE(12)).toString());
  const root = data.nodes.find((node) => node.name.endsWith('.ROOT'));
  const radius = root.extras.curvature_radius_m;
  const scale = 4.9 / 1.102;
  const triangles = data.nodes.reduce((total, node) => total + (node.mesh === undefined ? 0 :
    data.meshes[node.mesh].primitives.reduce((sum, primitive) => sum +
      data.accessors[primitive.indices ?? primitive.attributes.POSITION].count / 3, 0)), 0);
  writeFileSync(resolve(output, `${id}.glb`), bytes);
  report.push({ id, source: 'authored-master', source_sha256: createHash('sha256').update(bytes).digest('hex'),
    bytes: bytes.length, triangles, scale, withdrawal: { radius: radius * scale, centerY: -0.1, angle: 0.83 / radius } });
}
writeFileSync(resolve(output, 'manifest.json'), `${JSON.stringify(report, null, 2)}\n`);
console.log(report);
