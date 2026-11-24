import { describe, it, expect } from "vitest";
import { applyTheta, invertHsl, deriveRenderPlan } from "@mondrian/matrix";
import { colourState, readColour, colourSearch, togglePalette, lineWeightMax, invertedNeutral } from "../src/colour.js";
import { variationWork, variationSearch } from "../src/variations.js";
const work = {
  canvas: { width: 100, height: 100 },
  geometry: {
    points: {
      x: [{id:"x0",position:0},{id:"x1",position:0.1},{id:"x2",position:1}],
      y: [{id:"y0",position:0},{id:"y1",position:1}]
    },
    rectangles: [{id:"red",role:"red",x:["x0","x1"],y:["y0","y1"]}],
    lines: [{id:"v",orientation:"v",center:"x1",extent:["y0","y1"],thickness:0.15}]
  }
};
describe("colour controls", () => {
  it("defaults to original colour and weight", () => {
    expect(readColour(work, "")).toEqual({theta:0,paletteMode:"direct",lineWeightScale:1});
  });
  it.each([[-10,350],[360,0],[720,0],[95,95]])("wraps theta %s", (theta, expected) => {
    expect(colourState(work,{theta}).theta).toBe(expected);
  });
  it("rejects malformed and blank fields", () => {
    expect(readColour(work,"?theta=bad&pal=other&lw=")).toEqual({theta:0,paletteMode:"direct",lineWeightScale:1});
  });
  it("uses the work-specific maximum", () => {
    expect(lineWeightMax(work)).toBeCloseTo(4/3);
    expect(colourState(work,{lineWeightScale:99}).lineWeightScale).toBeCloseTo(4/3);
  });
  it("clamps minimum line weight", () => {
    expect(colourState(work,{lineWeightScale:-1}).lineWeightScale).toBe(0.25);
  });
  it("regenerates geometry using the applied scale", () => {
    const s=colourState(work,{lineWeightScale:99});
    const plan=deriveRenderPlan(work,s.lineWeightScale);
    const line=plan.items.find(i=>i.id==="v");
    expect(line.x1-line.x0).toBeCloseTo(0.15*s.lineWeightScale);
    expect(line.x0).toBeGreaterThanOrEqual(-1e-9);
  });
  it("preserves hue relationships and neutral swatches", () => {
    const red={h:10,s:80,l:50}, blue={h:220,s:70,l:40};
    const a=applyTheta(red,"red",90), b=applyTheta(blue,"blue",90);
    expect((b.h-a.h+360)%360).toBe(210);
    expect(applyTheta(red,"black",90)).toEqual(red);
  });
  it("inversion is an involution", () => {
    const swatch={h:30,s:60,l:45};
    expect(invertHsl(invertHsl(swatch))).toEqual(swatch);
    expect(togglePalette(togglePalette("direct"))).toBe("direct");
  });
  it("explicit neutral inversion has complementary lightness", () => {
    for(const [role,channel] of [["black",17],["white",247],["gray",154]]) {
      const value=Number(invertedNeutral(role).match(/ ([\d.]+)%\)$/)[1]);
      expect(value).toBeCloseTo(100-100*channel/255);
    }
  });
  it("round trips and preserves frame and variation fields", () => {
    const state=colourState(work,{theta:90,paletteMode:"inverted",lineWeightScale:0.5});
    const search=colourSearch("?fmt=custom&fw=0.4&var=mirror-h",state);
    expect(readColour(work,search)).toEqual(state);
    const q=new URLSearchParams(search);
    expect(q.get("fw")).toBe("0.4");
    expect(q.get("fmt")).toBe("custom");
    expect(q.get("var")).toBe("mirror-h");
    expect(readColour(work,variationSearch(search,"rotate-180"))).toEqual(state);
  });
  it("mirror preserves safe line limits and does not mutate work", () => {
    const before=structuredClone(work);
    expect(lineWeightMax(variationWork(work,"mirror-h"))).toBeCloseTo(lineWeightMax(work));
    expect(work).toEqual(before);
  });
});
