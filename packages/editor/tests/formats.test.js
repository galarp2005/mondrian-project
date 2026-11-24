import { describe, it, expect } from "vitest";
import { surfaceFromPreset, printableArea } from "@mondrian/matrix";
import { FORMATS, formatFrame, readFormat, formatSearch, liquidFillSvg } from "../src/formats.js";

const work = { canvas: { width: 120, height: 100 } };

describe("format chips", () => {
  for (const preset of ["sticker-50", "sticker-70", "sticker-100x70", "a4"]) {
    for (const format of FORMATS) {
      it(`${preset}: ${format.label} maximizes and preserves physical aspect`, () => {
        const surface = surfaceFromPreset(preset);
        const area = printableArea(surface);
        const { frame, aspect, formatId } = formatFrame(work, format.id, surface);
        expect(formatId).toBe(format.id);
        expect(aspect).toBeCloseTo(format.aspect ?? 1.2);
        expect(frame.width * surface.width / (frame.height * surface.height)).toBeCloseTo(aspect);
        expect(frame.x).toBeGreaterThanOrEqual(area.x - 1e-9);
        expect(frame.y).toBeGreaterThanOrEqual(area.y - 1e-9);
        expect(frame.x + frame.width).toBeLessThanOrEqual(area.x + area.width + 1e-9);
        expect(frame.y + frame.height).toBeLessThanOrEqual(area.y + area.height + 1e-9);
        expect(Math.max(frame.width / area.width, frame.height / area.height)).toBeCloseTo(1);
        expect(frame.x + frame.width / 2).toBeCloseTo(area.x + area.width / 2);
        expect(frame.y + frame.height / 2).toBeCloseTo(area.y + area.height / 2);
      });
    }
  }
  it("falls back for missing, invalid and not-yet-supported custom formats", () => {
    for (const query of ["", "?fmt=wrong", "?fmt=custom", "?fmt=toString"]) expect(readFormat(query)).toBe("original");
    expect(formatFrame(work, "wrong").aspect).toBeCloseTo(1.2);
  });
  it("updates fmt and frame, preserves unrelated query fields, restores on reload", () => {
    const state = formatFrame(work, "16-9");
    const search = formatSearch("?theta=42&format=square&fw=0.1", state);
    const q = new URLSearchParams(search);
    expect(readFormat(search)).toBe("16-9");
    expect(q.get("theta")).toBe("42");
    expect(q.get("format")).toBe("square");
    expect(Number(q.get("fw"))).toBeCloseTo(state.frame.width);
    expect(Number(q.get("fh"))).toBeCloseTo(state.frame.height);
  });
  it("does not mutate source and restores native ratio", () => {
    const original = structuredClone(work);
    formatFrame(work, "9-16");
    expect(formatFrame(work, "original").aspect).toBeCloseTo(1.2);
    expect(work).toEqual(original);
  });
  it("liquid-fills normalized SVG without modifying its geometry", () => {
    const svg = '<svg viewBox="0 0 1 1"><rect x="0.2" width="0.5"/></svg>';
    expect(liquidFillSvg(svg)).toBe('<svg preserveAspectRatio="none" viewBox="0 0 1 1"><rect x="0.2" width="0.5"/></svg>');
  });
});
