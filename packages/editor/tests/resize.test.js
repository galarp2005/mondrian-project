import { describe, it, expect } from "vitest";
import { printableArea, surfaceFromPreset } from "@mondrian/matrix";
import { CORNERS, MIN_FRACTION, resizeCorner, customSelection, restoreSelection } from "../src/resize.js";
import { formatFrame, formatSearch } from "../src/formats.js";

const surface = surfaceFromPreset("sticker-50");
const area = printableArea(surface);
const work = { canvas: { width: 120, height: 100 } };
const frame = { x: 0.2, y: 0.2, width: 0.5, height: 0.5 };

describe("free corner resize", () => {
  for (const corner of CORNERS) {
    it(corner + " preserves opposite corner and changes aspect", () => {
      const next = resizeCorner(frame, corner, 0.05, 0.1, area);
      expect(corner.endsWith("w") ? next.x + next.width : next.x).toBeCloseTo(corner.endsWith("w") ? frame.x + frame.width : frame.x);
      expect(corner.startsWith("n") ? next.y + next.height : next.y).toBeCloseTo(corner.startsWith("n") ? frame.y + frame.height : frame.y);
      expect(next.width / next.height).not.toBeCloseTo(1);
      expect(frame).toEqual({ x: 0.2, y: 0.2, width: 0.5, height: 0.5 });
    });
    for (const delta of [-10, 10]) {
      it(corner + " clamps extreme movement " + delta, () => {
        const next = resizeCorner(frame, corner, delta, delta, area);
        expect(next.x).toBeGreaterThanOrEqual(area.x - 1e-9);
        expect(next.y).toBeGreaterThanOrEqual(area.y - 1e-9);
        expect(next.x + next.width).toBeLessThanOrEqual(area.x + area.width + 1e-9);
        expect(next.y + next.height).toBeLessThanOrEqual(area.y + area.height + 1e-9);
        expect(next.width).toBeGreaterThanOrEqual(area.width * MIN_FRACTION - 1e-9);
        expect(next.height).toBeGreaterThanOrEqual(area.height * MIN_FRACTION - 1e-9);
      });
    }
  }
  it("ignores invalid corner and nonfinite movement", () => {
    expect(resizeCorner(frame, "middle", 1, 1, area)).toEqual(frame);
    expect(resizeCorner(frame, "nw", NaN, 1, area)).toEqual(frame);
  });
  it("round-trips custom geometry and preserves unrelated fields", () => {
    const state = customSelection(resizeCorner(frame, "se", 0.1, 0.05, area), surface);
    const search = formatSearch("?theta=42", state);
    expect(restoreSelection(work, search)).toEqual(state);
    expect(new URLSearchParams(search).get("theta")).toBe("42");
  });
  it("falls back to original for incomplete or malformed custom recipe", () => {
    for (const search of ["?fmt=custom", "?fmt=custom&fx=0&fy=0&fw=abc&fh=1", "?fmt=custom&fx=&fy=0&fw=1&fh=1"]) {
      expect(restoreSelection(work, search)).toEqual(formatFrame(work, "original"));
    }
  });
  it("clamps custom URL bounds and minimum", () => {
    const next = restoreSelection(work, "?fmt=custom&fx=-2&fy=2&fw=0&fh=9");
    expect(next.frame.x).toBeCloseTo(area.x);
    expect(next.frame.y).toBeCloseTo(area.y);
    expect(next.frame.width).toBeCloseTo(area.width * MIN_FRACTION);
    expect(next.frame.height).toBeCloseTo(area.height);
  });
  it("preset selection restores maximal centered frame", () => {
    expect(restoreSelection(work, "?fmt=16-9&fx=.2&fy=.2&fw=.1&fh=.1")).toEqual(formatFrame(work, "16-9"));
  });
});
