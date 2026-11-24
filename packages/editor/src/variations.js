import { vary } from "@mondrian/matrix";

export const VARIATIONS = [
  { id: "original", label: "Original" },
  { id: "mirror-h", label: "Mirror horizontal" },
  { id: "mirror-v", label: "Mirror vertical" },
  { id: "rotate-180", label: "Rotate 180°" },
];

export function normalizeVariation(id) {
  return VARIATIONS.some((entry) => entry.id === id) ? id : "original";
}

export function readVariation(search) {
  return normalizeVariation(new URLSearchParams(search).get("var"));
}

export function variationSearch(search, id) {
  const q = new URLSearchParams(search);
  q.set("var", normalizeVariation(id));
  return "?" + q.toString();
}

// Always start from the measured source, never a previously transformed work.
export function variationWork(work, id) {
  return vary(work, normalizeVariation(id));
}
