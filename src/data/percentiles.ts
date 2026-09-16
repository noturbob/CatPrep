/**
 * Score -> percentile anchors, interpolated linearly between points.
 *
 * These are ESTIMATES built from published CAT score-vs-percentile reports
 * across recent years, not official data — CAT normalises across slots and
 * never publishes a raw mapping. Good enough for a mock trend line; the UI
 * labels every number produced from this as an estimate.
 */
export const PERCENTILE_ANCHORS: Record<string, [number, number][]> = {
  // QA — max 66
  QA: [
    [0, 20], [3, 32], [6, 45], [9, 57], [12, 68], [15, 76], [18, 83],
    [21, 88], [24, 91], [27, 93.5], [30, 95.3], [33, 96.8], [36, 97.8],
    [39, 98.5], [42, 99.0], [45, 99.3], [48, 99.6], [54, 99.85],
    [60, 99.95], [66, 100],
  ],
  // DILR — max 66
  DILR: [
    [0, 18], [3, 35], [6, 50], [9, 63], [12, 73], [15, 81], [18, 87],
    [21, 91], [24, 93.8], [27, 95.6], [30, 97], [33, 98], [36, 98.7],
    [39, 99.2], [42, 99.5], [45, 99.7], [51, 99.9], [57, 99.97], [66, 100],
  ],
  // VARC — max 72
  VARC: [
    [0, 15], [6, 32], [12, 48], [18, 62], [24, 73], [30, 82], [36, 88],
    [42, 92.5], [45, 94], [48, 95.4], [51, 96.6], [54, 97.5], [57, 98.3],
    [60, 98.9], [63, 99.3], [66, 99.6], [69, 99.8], [72, 100],
  ],
  // Overall — max 204
  OVERALL: [
    [0, 10], [20, 30], [30, 42], [40, 54], [50, 65], [60, 74], [70, 81],
    [80, 86.5], [90, 91], [100, 94], [105, 95.2], [110, 96.2], [115, 97],
    [120, 97.7], [130, 98.7], [140, 99.2], [150, 99.6], [160, 99.8],
    [180, 99.96], [204, 100],
  ],
};

/** Linear interpolation between the nearest two anchors. */
export function estimatePercentile(scope: string, score: number): number {
  const a = PERCENTILE_ANCHORS[scope];
  if (!a) return 0;
  if (score <= a[0][0]) return a[0][1];
  if (score >= a[a.length - 1][0]) return a[a.length - 1][1];
  for (let i = 0; i < a.length - 1; i++) {
    const [x0, y0] = a[i];
    const [x1, y1] = a[i + 1];
    if (score >= x0 && score <= x1) {
      const t = (score - x0) / (x1 - x0);
      return Math.round((y0 + t * (y1 - y0)) * 100) / 100;
    }
  }
  return 0;
}

/** Raw score needed to hit a target percentile — used by the QA goal tile. */
export function scoreForPercentile(scope: string, pct: number): number {
  const a = PERCENTILE_ANCHORS[scope];
  if (!a) return 0;
  for (let i = 0; i < a.length - 1; i++) {
    const [x0, y0] = a[i];
    const [x1, y1] = a[i + 1];
    if (pct >= y0 && pct <= y1) {
      const t = (pct - y0) / (y1 - y0);
      return Math.round(x0 + t * (x1 - x0));
    }
  }
  return a[a.length - 1][0];
}
