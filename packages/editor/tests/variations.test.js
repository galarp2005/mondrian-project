import { describe, it, expect } from "vitest";
import { deriveRenderPlan, renderSvg } from "@mondrian/matrix";
import { VARIATIONS, normalizeVariation, readVariation, variationSearch, variationWork } from "../src/variations.js";
import { formatFrame, formatSearch, liquidFillSvg } from "../src/formats.js";
import { customSelection, restoreSelection } from "../src/resize.js";
import { surfaceFromPreset } from "@mondrian/matrix";

const work = {
  id: "test-work",
  canvas: { width: 100, height: 100 },
  geometry: {
    points: {
      x: [{ id: "x0", position: 0 }, { id: "x1", position: 0.3 }, { id: "x2", position: 1 }],
      y: [{ id: "y0", position: 0 }, { id: "y1", position: 0.6 }, { id: "y2", position: 1 }],
    },
    rectangles: [{ id: "red-plane", role: "red", x: ["x0", "x1"], y: ["y0", "y1"] }],
    lines: [{ id: "line", orientation: "v", center: "x1", extent: ["y0", "y1"], thickness: 0.02 }],
  },
};

describe("geometric variation selection", () => {
  const cases = [
    ["original", 0, 0.3, 0, 0.6],
    ["mirror-h", 0.7, 1, 0, 0.6],
    ["mirror-v", 0, 0.3, 0.4, 1],
    ["rotate-180", 0.7, 1, 0.4, 1],
  ];
  for (const [id, x0, x1, y0, y1] of cases) {
    it(id + " transforms plane geometry with Matrix", () => {
      const plan = deriveRenderPlan(variationWork(work, id));
      const plane = plan.items.find((item) => item.id === "red-plane");
      expect(plane.x0).toBeCloseTo(x0);
      expect(plane.x1).toBeCloseTo(x1);
      expect(plane.y0).toBeCloseTo(y0);
      expect(plane.y1).toBeCloseTo(y1);
      expect(plane.role).toBe("red");
      const line = plan.items.find((item) => item.id === "line");
      expect((line.x0 + line.x1) / 2).toBeCloseTo(id === "mirror-h" || id === "rotate-180" ? 0.7 : 0.3);
      expect(line.y0).toBeCloseTo(y0);
      expect(line.y1).toBeCloseTo(y1);
      expect(liquidFillSvg(renderSvg(plan))).toContain('preserveAspectRatio="none"');
    });
  }
  it("never mutates the measured work or accumulates prior selections", () => {
    const initial = structuredClone(work);
    const expected = variationWork(work, "mirror-v");
    variationWork(work, "mirror-h");
    variationWork(work, "rotate-180");
    expect(variationWork(work, "mirror-v")).toEqual(expected);
    expect(variationWork(work, "original")).toEqual(initial);
    expect(work).toEqual(initial);
  });
  it("falls back for missing or unsupported variation IDs", () => {
    for (const id of [null, "", "unknown", "toString", "invert-contrast", "equalize"]) {
      expect(normalizeVariation(id)).toBe("original");
      expect(variationWork(work, id)).toEqual(work);
    }
    expect(readVariation("")).toBe("original");
  });
  for (const { id } of VARIATIONS) {
    it(id + " round-trips in URL and preserves other fields", () => {
      const search = variationSearch("?fmt=custom&fx=0.1&fy=0.2&fw=0.4&fh=0.5&theta=42", id);
      const q = new URLSearchParams(search);
      expect(readVariation(search)).toBe(id);
      expect(q.get("fmt")).toBe("custom");
      expect(q.get("fx")).toBe("0.1");
      expect(q.get("fy")).toBe("0.2");
      expect(q.get("fw")).toBe("0.4");
      expect(q.get("fh")).toBe("0.5");
      expect(q.get("theta")).toBe("42");
    });
  }
  it("preserves custom frame across variation changes and URL restoration", () => {
    const surface = surfaceFromPreset("sticker-50");
    const frame = { x: 0.1, y: 0.2, width: 0.4, height: 0.5 };
    const search = formatSearch("", customSelection(frame, surface));
    expect(restoreSelection(work, variationSearch(search, "rotate-180"), surface).frame).toEqual(frame);
  });
  it("format changes preserve the selected variation", () => {
    const search = formatSearch("?var=mirror-h", formatFrame(work, "16-9"));
    expect(readVariation(search)).toBe("mirror-h");
  });
});
