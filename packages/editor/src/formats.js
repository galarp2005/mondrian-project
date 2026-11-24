import { maximizeFrame, printableArea, surfaceFromPreset } from "@mondrian/matrix";

export const FORMATS = [
  { id: "original", label: "Original" },
  { id: "1-1", label: "1:1", aspect: 1 },
  { id: "5-4", label: "5:4", aspect: 5 / 4 },
  { id: "4-5", label: "4:5", aspect: 4 / 5 },
  { id: "16-9", label: "16:9", aspect: 16 / 9 },
  { id: "9-16", label: "9:16", aspect: 9 / 16 },
];

export function readFormat(search) {
  const id = new URLSearchParams(search).get("fmt");
  return FORMATS.some((format) => format.id === id) ? id : "original";
}

// Matrix coordinates are normalized to the surface; convert physical aspect
// to normalized aspect before maximizing, so non-square surfaces also work.
export function formatFrame(work, id, surface = surfaceFromPreset("sticker-50")) {
  const format = FORMATS.find((entry) => entry.id === id) ?? FORMATS[0];
  const aspect = format.aspect ?? work.canvas.width / work.canvas.height;
  const frame = maximizeFrame(aspect * surface.height / surface.width, printableArea(surface));
  return { formatId: format.id, frame, aspect };
}

// Preserve query fields owned by other interactions. Frame fields describe
// the newly maximized frame, not stale geometry from a previous format.
export function formatSearch(search, state) {
  const q = new URLSearchParams(search);
  q.set("fmt", state.formatId);
  for (const [key, value] of Object.entries(state.frame)) {
    q.set({ x: "fx", y: "fy", width: "fw", height: "fh" }[key], String(value));
  }
  return "?" + q.toString();
}

// The shared renderer uses a normalized square viewBox. Liquid-fill maps
// both axes independently into the frame without changing source geometry.
export function liquidFillSvg(svg) {
  return svg.replace("<svg ", '<svg preserveAspectRatio="none" ');
}
