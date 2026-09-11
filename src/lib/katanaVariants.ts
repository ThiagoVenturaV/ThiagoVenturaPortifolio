export interface WithdrawalArc { radius: number; centerY: number; angle: number }

const modelScale = 4.9 / 1.102;
export const KATANA_VARIANTS = [
  { id: 'original', name: 'Katana original', url: '/katana-sheathed.glb',
    arc: { radius: 20, centerY: 1, angle: 0.18 } },
  { id: 'wado', name: 'Wadō Ichimonji', url: '/katanas/wado.glb',
    arc: { radius: 4.25 * modelScale, centerY: -0.10, angle: 0.83 / 4.25 } },
  { id: 'sandai', name: 'Sandai Kitetsu', url: '/katanas/sandai.glb',
    arc: { radius: 3.85 * modelScale, centerY: -0.10, angle: 0.83 / 3.85 } },
  { id: 'enma', name: 'Enma', url: '/katanas/enma.glb',
    arc: { radius: 3.60 * modelScale, centerY: -0.10, angle: 0.83 / 3.60 } },
] as const;

export type KatanaVariant = typeof KATANA_VARIANTS[number];
export const KATANA_STORAGE_KEY = 'portfolio:last-katana:v1';

export function chooseKatana(previous: string | null, random = Math.random): KatanaVariant {
  const options = KATANA_VARIANTS.filter((variant) => variant.id !== previous);
  const sample = random();
  const index = Number.isFinite(sample) ? Math.max(0, Math.min(options.length - 1, Math.floor(sample * options.length))) : 0;
  return options[index];
}

let visitVariant: KatanaVariant | undefined;
// A document gets one selection, even with StrictMode, Suspense retries or resize.
export function katanaForVisit(): KatanaVariant {
  if (visitVariant) return visitVariant;
  let previous: string | null = null;
  try { previous = window.localStorage.getItem(KATANA_STORAGE_KEY); } catch { /* Storage may be unavailable. */ }
  visitVariant = chooseKatana(previous);
  try { window.localStorage.setItem(KATANA_STORAGE_KEY, visitVariant.id); } catch { /* Random selection still works. */ }
  return visitVariant;
}
