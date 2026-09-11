import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { katanaPose, sectionProgress, withdrawal } from '../src/lib/katanaMotion.ts';

test('starts horizontal and ends seated vertically on the right, with visible saya', () => {
  for (const mobile of [false, true]) {
    for (const p of [0, 4]) {
      const pose = katanaPose(p, mobile ? 1.92 : 7.36, mobile);
      assert.equal(pose.bladeX, 0); assert.equal(pose.bladeY, 0); assert.equal(pose.bladeZ, 0);
      assert.equal(pose.sayaOpacity, 1);
      assert.equal(pose.rz, p === 0 ? Math.PI / 2 : Math.PI);
      if (p === 4) assert.ok(pose.x > (mobile ? 1.92 : 7.36) * 0.4);
    }
  }
});

test('blade clears the mouth before the saya departs', () => {
  const pose = katanaPose(0.72, 7.36, false);
  const tipY = Math.sin(pose.bladeZ) * 0.15 + Math.cos(pose.bladeZ) * 3.3 + pose.bladeY;
  assert.ok(tipY < 0.05, `tip must be outside the mouth: ${tipY}`);
  assert.equal(pose.sayaOpacity, 1);
  assert.equal(katanaPose(1.5, 7.36, false).sayaOpacity, 0);
});

test('saya waits motionless while the blade returns', () => {
  const waiting = katanaPose(3.4, 7.36, false);
  for (const p of [3.5, 3.6, 3.8, 3.97, 4]) {
    const pose = katanaPose(p, 7.36, false);
    for (const key of ['x', 'y', 'rx', 'ry', 'rz', 'scale', 'sayaX', 'sayaY', 'sayaOpacity'] as const) {
      assert.ok(Math.abs(pose[key] - waiting[key]) < 1e-12, `${key} moved at ${p}`);
    }
  }
});

test('all choreography boundaries are continuous, in both scroll directions', () => {
  for (const width of [1.6, 1.92, 3.8, 7.36]) {
    for (const boundary of [0.08, 0.72, 1, 2, 3, 3.12, 3.4, 3.52, 3.97]) {
      const before = katanaPose(boundary - 1e-6, width, width < 3);
      const after = katanaPose(boundary + 1e-6, width, width < 3);
      for (const key of Object.keys(before) as (keyof typeof before)[]) {
        assert.ok(Math.abs(before[key] - after[key]) < 0.0001, `${key} jumps at ${boundary}`);
      }
    }
  }
});

test('section anchors support restored scroll and short final sections', () => {
  assert.equal(sectionProgress(0, [0, 800, 1600, 2400, 3200], 3400), 0);
  assert.equal(sectionProgress(1200, [0, 800, 1600, 2400, 3200], 3400), 1.5);
  assert.equal(sectionProgress(2800, [0, 800, 1600, 2400, 3200], 2800), 4);
  assert.equal(sectionProgress(0, [0, 0, 0, 0, 0], 0), 0);
});

test('horizontal sweep leaves space for the handle on narrow screens', () => {
  for (const width of [1.6, 1.92, 7.36]) {
    const pose = katanaPose(1.5, width, width < 3);
    assert.ok(pose.x + pose.scale * 1.5 < width / 2 - 0.1);
  }
});

test('assembled GLB preserves original geometry and independent fitted nodes', () => {
  const original = readFileSync(new URL('../public/katana.glb', import.meta.url));
  const fitted = readFileSync(new URL('../public/katana-sheathed.glb', import.meta.url));
  assert.equal(fitted.readUInt32LE(8), fitted.length);
  const json = JSON.parse(fitted.subarray(20, 20 + fitted.readUInt32LE(12)).toString());
  assert.ok(json.nodes.some((node: {name: string}) => node.name === 'Saya'));
  assert.ok(json.nodes.some((node: {name: string}) => node.name === 'Katana'));
  assert.deepEqual(fitted.subarray(20 + fitted.readUInt32LE(12)), original.subarray(20 + original.readUInt32LE(12)));
  assert.ok(withdrawal(1).y < -3.5);
});
