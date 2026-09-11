// Preserve the original mesh/texture buffers; assemble its two exported parts.
import { readFileSync, writeFileSync } from 'node:fs';

const source = readFileSync(new URL('../public/katana.glb', import.meta.url));
const jsonLength = source.readUInt32LE(12);
const gltf = JSON.parse(source.subarray(20, 20 + jsonLength).toString());
const blade = gltf.nodes.find((node) => node.name === 'Katana');
const saya = gltf.nodes.find((node) => node.name === 'Katana.002');
if (!blade || !saya) throw new Error('The original Katana and saya meshes are required.');

// Both meshes use the same baked +90° Z rotation. In mesh space the saya
// was displayed alongside the blade, offset by 0.549 along Y.
saya.name = 'Saya';
saya.rotation = [...blade.rotation];
saya.translation = [blade.translation[0] + 0.549, blade.translation[1], blade.translation[2] + 0.00185];
gltf.asset.extras = { ...gltf.asset.extras, assembly: 'White katana with fitted saya; independent Katana and Saya nodes.' };
const json = Buffer.from(JSON.stringify(gltf));
const padded = Buffer.alloc(Math.ceil(json.length / 4) * 4, 0x20);
json.copy(padded);
const remainingChunks = source.subarray(20 + jsonLength);
const header = Buffer.from(source.subarray(0, 20));
header.writeUInt32LE(20 + padded.length + remainingChunks.length, 8);
header.writeUInt32LE(padded.length, 12);
const output = Buffer.concat([header, padded, remainingChunks]);
writeFileSync(new URL('../public/katana-sheathed.glb', import.meta.url), output);
console.log(`Assembled katana-sheathed.glb (${output.length} bytes); original preserved.`);
