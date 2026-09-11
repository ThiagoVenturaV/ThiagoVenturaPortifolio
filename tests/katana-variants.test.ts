import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { KATANA_VARIANTS, chooseKatana } from '../src/lib/katanaVariants.ts';
import { katanaPose, withdrawal } from '../src/lib/katanaMotion.ts';

test('all four can be drawn; reloads exclude the preceding model without fixing an order', () => {
  assert.deepEqual([.01, .26, .51, .99].map((n) => chooseKatana(null, () => n).id), ['original', 'wado', 'sandai', 'enma']);
  for (const previous of KATANA_VARIANTS) {
    const next = [0, .4, .99].map((n) => chooseKatana(previous.id, () => n).id);
    assert.equal(new Set(next).size, 3);
    assert.ok(!next.includes(previous.id));
  }
  assert.equal(chooseKatana('old-invalid-id', () => .99).id, 'enma');
});

test('every model shares choreography, section timing, reverse scroll and closed endpoints', () => {
  for (const variant of KATANA_VARIANTS) {
    for (const width of [1.92, 7.36]) {
      for (const progress of [0, .4, .72, 1, 1.5, 2, 3, 3.4, 3.52, 3.97, 4]) {
        const actual = katanaPose(progress, width, width < 3, variant.arc);
        const original = katanaPose(progress, width, width < 3);
        for (const key of ['x','y','rx','ry','rz','scale','sayaX','sayaY','sayaOpacity'] as const) {
          assert.equal(actual[key], original[key], `${variant.id} changed ${key} at ${progress}`);
        }
        if (progress === 0 || progress >= 3.97) {
          assert.ok(Math.abs(actual.bladeX) < 1e-12); assert.ok(Math.abs(actual.bladeY) < 1e-12); assert.ok(Math.abs(actual.bladeZ) < 1e-12);
        }
      }
    }
    // A withdrawal must preserve the blade's curvature circle, including in reverse.
    const c = variant.arc;
    for (const amount of [0, .25, .5, .75, 1, .75, .5, .25, 0]) {
      const draw = withdrawal(amount, c);
      const tip = { x: c.radius * (1 - Math.cos(.755 / (c.radius / (4.9 / 1.102)))), y: 3.257 };
      const x = Math.cos(draw.angle) * c.radius - Math.sin(draw.angle) * c.centerY + draw.x;
      const y = Math.sin(draw.angle) * c.radius + Math.cos(draw.angle) * c.centerY + draw.y;
      assert.ok(Math.abs(x-c.radius)<1e-10 && Math.abs(y-c.centerY)<1e-10);
      if (variant.id !== 'original' && amount === 1) {
        assert.ok(Math.sin(draw.angle)*tip.x + Math.cos(draw.angle)*tip.y + draw.y < 0);
      }
    }
  }
});

test('browser models are self-contained, lightweight, with the two canonical animation groups', () => {
  for (const variant of KATANA_VARIANTS) {
    const bytes = readFileSync(new URL(`../public${variant.url}`, import.meta.url));
    assert.equal(bytes.readUInt32LE(8),bytes.length);
    const data = JSON.parse(bytes.subarray(20,20+bytes.readUInt32LE(12)).toString());
    assert.ok(bytes.length < 12_000_000, `${variant.id} exceeds transfer budget`);
    for (const name of ['Katana','Saya']) assert.ok(data.nodes.some((n: {name:string}) => n.name===name));
    assert.ok(data.images.every((i: {bufferView?:number}) => typeof i.bufferView === 'number'));
    if (variant.id !== 'original') assert.ok(!data.animations?.length, 'the page owns animation timing');
  }
});

test('exported blades form one closed surface, with no missing faces after optimization', () => {
  for (const variant of KATANA_VARIANTS.filter((v) => v.id !== 'original')) {
    const bytes = readFileSync(new URL(`../public${variant.url}`, import.meta.url));
    const jsonLength = bytes.readUInt32LE(12);
    const data = JSON.parse(bytes.subarray(20, 20 + jsonLength).toString());
    const binaryStart = 28 + jsonLength;
    const node = data.nodes.find((n: { name: string }) => n.name.endsWith('.Blade'));
    assert.ok(node, `${variant.id}: missing blade`);
    const primitive = data.meshes[node.mesh].primitives[0];
    const readAccessor = (index: number) => {
      const accessor = data.accessors[index];
      const view = data.bufferViews[accessor.bufferView];
      const components = accessor.type === 'VEC3' ? 3 : 1;
      const size = accessor.componentType === 5123 ? 2 : 4;
      const offset = binaryStart + (view.byteOffset ?? 0) + (accessor.byteOffset ?? 0);
      return Array.from({ length: accessor.count }, (_, i) =>
        Array.from({ length: components }, (_, j) => {
          const at = offset + i * (view.byteStride ?? components * size) + j * size;
          if (accessor.componentType === 5126) return bytes.readFloatLE(at);
          if (accessor.componentType === 5123) return bytes.readUInt16LE(at);
          assert.equal(accessor.componentType, 5125);
          return bytes.readUInt32LE(at);
        }));
    };
    // glTF duplicates vertices at UV seams and sharp normals. Weld positions
    // for the topology check, leaving the actual shading/UV data untouched.
    const positions = readAccessor(primitive.attributes.POSITION);
    const indices = readAccessor(primitive.indices).flat();
    const vertices = new Map<string, number>();
    const welded = positions.map((p) => {
      assert.ok(p.every(Number.isFinite));
      const key = p.map((n) => Math.round(n * 1e7)).join(',');
      if (!vertices.has(key)) vertices.set(key, vertices.size);
      return vertices.get(key)!;
    });
    const edges = new Map<string, number>();
    const neighbors = new Map<number, Set<number>>();
    for (let i = 0; i < indices.length; i += 3) {
      const triangle = indices.slice(i, i + 3).map((n) => welded[n]);
      assert.equal(new Set(triangle).size, 3, `${variant.id}: collapsed blade triangle`);
      for (let j = 0; j < 3; j++) {
        const a = triangle[j], b = triangle[(j + 1) % 3];
        const key = a < b ? `${a},${b}` : `${b},${a}`;
        edges.set(key, (edges.get(key) ?? 0) + 1);
        if (!neighbors.has(a)) neighbors.set(a, new Set());
        neighbors.get(a)!.add(b);
      }
    }
    const openEdges = [...edges.values()].filter((count) => count !== 2).length;
    assert.equal(openEdges, 0, `${variant.id}: ${openEdges} open or non-manifold blade edges`);
    const visited = new Set<number>();
    const pending = [welded[indices[0]]];
    while (pending.length) {
      const vertex = pending.pop()!;
      if (visited.has(vertex)) continue;
      visited.add(vertex);
      pending.push(...neighbors.get(vertex)!);
    }
    assert.equal(visited.size, neighbors.size, `${variant.id}: disconnected blade fragments`);
  }
});
