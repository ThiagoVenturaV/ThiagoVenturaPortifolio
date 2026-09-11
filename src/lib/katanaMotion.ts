export const clamp = (value: number, min = 0, max = 1) => Math.max(min, Math.min(max, value));
const mix = (from: number, to: number, t: number) => from + (to - from) * t;
const ease = (t: number) => { const x = clamp(t); return x * x * (3 - 2 * x); };
const phase = (p: number, start: number, end: number) => ease((p - start) / (end - start));

export interface KatanaPose {
  x: number; y: number; rx: number; ry: number; rz: number; scale: number;
  bladeX: number; bladeY: number; bladeZ: number;
  sayaX: number; sayaY: number; sayaOpacity: number;
}

// Rotate around the curvature centre instead of dragging a curved blade
// straight through the side of the saya. Coordinates precede the hero rig.
export function withdrawal(amount: number) {
  const angle = clamp(amount) * 0.18;
  return { x: 20 * (1 - Math.cos(angle)) + Math.sin(angle),
    y: 1 - Math.cos(angle) - 20 * Math.sin(angle), angle };
}

// Clamp section anchors so the final closed pose remains reachable on short pages.
export function sectionProgress(scrollY: number, sectionTops: number[], maxScroll: number) {
  if (maxScroll <= 0 || sectionTops.length < 2) return 0;
  const y = clamp(scrollY, 0, maxScroll);
  const tops = sectionTops.map((top) => clamp(top, 0, maxScroll));
  if (y >= tops[tops.length - 1]) return tops.length - 1;
  for (let i = 0; i < tops.length - 1; i++) {
    if (y < tops[i + 1]) return i + clamp((y - tops[i]) / Math.max(1, tops[i + 1] - tops[i]));
  }
  return 0;
}

export function katanaPose(progress: number, viewportWidth: number, mobile: boolean): KatanaPose {
  const p = clamp(Number.isFinite(progress) ? progress : 0, 0, 4);
  const heroScale = Math.min(mobile ? 0.45 : 0.65, viewportWidth * 0.84 / 4.9);
  const baseScale = Math.min(mobile ? 0.35 : 0.6, viewportWidth * 0.84 / 4.9);
  const drawScale = Math.min(heroScale, viewportWidth * 0.84 / 8.5);
  const centre = mobile ? heroScale * 0.96 : 0.6;
  const right = Math.min(mobile ? 0.8 : 3.2, viewportWidth / 2 - 0.26);
  // Contact: occupy the right-hand column marked in the visual brief.
  // Tip points down inside the saya, handle up; centre the closed silhouette.
  const dockScale = mobile ? 0.3 : 0.6;
  const dockX = viewportWidth * (mobile ? 0.455 : 0.405);
  const dockY = 0.9 * dockScale + 0.05;
  const out = withdrawal(1);
  const pose: KatanaPose = {
    x: centre, y: 0.8, rx: 0.05, ry: 0.2, rz: Math.PI / 2, scale: heroScale,
    bladeX: 0, bladeY: 0, bladeZ: 0, sayaX: 0, sayaY: 0, sayaOpacity: 1,
  };
  if (p <= 0.72) {
    const t = phase(p, 0.08, 0.72);
    const draw = withdrawal(t);
    pose.scale = mix(heroScale, drawScale, t);
    pose.x = mix(centre, -0.7 * drawScale, t);
    pose.bladeX = draw.x; pose.bladeY = draw.y; pose.bladeZ = draw.angle;
  } else if (p <= 1) {
    const t = phase(p, 0.72, 1);
    pose.x = mix(-0.7 * drawScale, right, t); pose.y = mix(0.8, -0.6, t);
    pose.rx = mix(0.05, 0, t); pose.ry = mix(0.2, -0.1, t); pose.rz = mix(Math.PI / 2, 0, t);
    pose.scale = mix(drawScale, baseScale, t);
    pose.bladeX = out.x * (1 - t); pose.bladeY = out.y * (1 - t); pose.bladeZ = out.angle * (1 - t);
    // Send the empty saya beyond the tip before restoring the sword pivot.
    pose.sayaY = 6 * t; pose.sayaX = -1.5 * t;
    pose.sayaOpacity = 1 - phase(p, 0.72, 0.94);
  } else if (p <= 2) {
    const t = ease(p - 1);
    pose.x = right; pose.y = mix(-0.6, 0.6, t);
    pose.rx = Math.sin(t * Math.PI) * 0.2; pose.ry = mix(-0.1, 0.1, t); pose.rz = Math.PI * t;
    // Reserve room for the handle as the sword sweeps horizontally.
    pose.x = Math.min(right, viewportWidth / 2 - baseScale * (1.5 * Math.abs(Math.sin(pose.rz)) + 0.2) - 0.12);
    pose.scale = baseScale; pose.sayaOpacity = 0; pose.sayaX = -1.5; pose.sayaY = 6;
  } else if (p <= 3) {
    const t = ease(p - 2);
    pose.x = mix(right, centre, t); pose.y = mix(0.6, 1.1, t);
    pose.rx = 0; pose.ry = mix(0.1, 0.2, t); pose.rz = mix(Math.PI, Math.PI / 2, t);
    pose.scale = baseScale; pose.sayaOpacity = 0; pose.sayaX = -1.5; pose.sayaY = 6;
  } else if (p <= 3.4) {
    const t = phase(p, 3, 3.4);
    pose.x = mix(centre, dockX, t); pose.y = mix(1.1, dockY, t);
    pose.rx = 0; pose.ry = mix(0.2, -0.12, t); pose.rz = mix(Math.PI / 2, Math.PI, t);
    pose.scale = mix(baseScale, dockScale, t);
    pose.bladeX = out.x * t; pose.bladeY = out.y * t; pose.bladeZ = out.angle * t;
    pose.sayaX = -1.5 * (1 - t); pose.sayaY = 6 * (1 - t);
    pose.sayaOpacity = phase(p, 3.12, 3.4);
  } else {
    // The saya has arrived and waits still. Seat the blade, then hold closed.
    const draw = withdrawal(1 - phase(p, 3.52, 3.97));
    pose.x = dockX; pose.y = dockY; pose.scale = dockScale;
    pose.rx = 0; pose.ry = -0.12; pose.rz = Math.PI;
    pose.bladeX = draw.x; pose.bladeY = draw.y; pose.bladeZ = draw.angle;
  }
  return pose;
}
