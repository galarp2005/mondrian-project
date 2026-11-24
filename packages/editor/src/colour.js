import { wrapTheta, clampLineWeightScale, maxLineWeightScale, computedFill } from "@mondrian/matrix";

export const HUE_PRESETS = [0, 90, 180, 270];
export const WEIGHT_PRESETS = [0.5, 1, 1.5];

function numberOr(value, fallback) {
  if (value == null || String(value).trim() === "") return fallback;
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

export function colourState(work, raw = {}) {
  return {
    theta: wrapTheta(numberOr(raw.theta, 0)),
    paletteMode: raw.paletteMode === "inverted" ? "inverted" : "direct",
    lineWeightScale: clampLineWeightScale(work, numberOr(raw.lineWeightScale, 1)),
  };
}

export function readColour(work, search) {
  const q = new URLSearchParams(search);
  return colourState(work, { theta: q.get("theta"), paletteMode: q.get("pal"), lineWeightScale: q.get("lw") });
}

export function colourSearch(search, state) {
  const q = new URLSearchParams(search);
  q.set("theta", String(state.theta));
  q.set("pal", state.paletteMode);
  q.set("lw", String(state.lineWeightScale));
  return "?" + q.toString();
}

export function togglePalette(mode) {
  return mode === "inverted" ? "direct" : "inverted";
}

export function lineWeightMax(work) {
  return maxLineWeightScale(work);
}

// Matrix CSS defines these neutral source colours (#111, #f7f7f7, #9a9a9a).
// Explicit HSL fallback for browsers lacking relative colour syntax.
const NEUTRALS = { black: { h: 0, s: 0, l: 100 * 17 / 255 }, white: { h: 0, s: 0, l: 100 * 247 / 255 }, gray: { h: 0, s: 0, l: 100 * 154 / 255 } };

export function invertedNeutral(role) {
  return computedFill(role, NEUTRALS[role], 0, "inverted");
}
