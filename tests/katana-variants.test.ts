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
