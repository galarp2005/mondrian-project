import { clampFrame, printableArea, surfaceFromPreset } from "@mondrian/matrix";
import { formatFrame, readFormat } from "./formats.js";

export const CORNERS = ["nw", "ne", "sw", "se"];
export const MIN_FRACTION = 0.1;
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

export function resizeCorner(frame, corner, dx, dy, area) {
  if (!CORNERS.includes(corner) || !Number.isFinite(dx) || !Number.isFinite(dy)) return { ...frame };
  let left = frame.x, right = frame.x + frame.width;
  let top = frame.y, bottom = frame.y + frame.height;
  const minW = area.width * MIN_FRACTION;
  const minH = area.height * MIN_FRACTION;
  if (corner.endsWith("w")) left = clamp(left + dx, area.x, right - minW);
  else right = clamp(right + dx, left + minW, area.x + area.width);
  if (corner.startsWith("n")) top = clamp(top + dy, area.y, bottom - minH);
  else bottom = clamp(bottom + dy, top + minH, area.y + area.height);
  return { x: left, y: top, width: right - left, height: bottom - top };
}

export function customSelection(frame, surface) {
  return { formatId: "custom", frame, aspect: frame.width * surface.width / (frame.height * surface.height) };
}

export function restoreSelection(work, search, surface = surfaceFromPreset("sticker-50")) {
  const q = new URLSearchParams(search);
  if (q.get("fmt") !== "custom") return formatFrame(work, readFormat(search), surface);
  const values = ["fx", "fy", "fw", "fh"].map(key => q.get(key));
  if (values.some(v => v === null || v.trim() === "" || !Number.isFinite(Number(v)))) return formatFrame(work, "original", surface);
  const [x, y, width, height] = values.map(Number);
  const area = printableArea(surface);
  return customSelection(clampFrame({
    x, y, width: Math.max(width, area.width * MIN_FRACTION),
    height: Math.max(height, area.height * MIN_FRACTION)
  }, surface), surface);
}
