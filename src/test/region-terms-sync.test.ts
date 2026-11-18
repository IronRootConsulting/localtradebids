import { describe, expect, it } from "vitest";
import { TERMS_HTML } from "@/routes/terms";
import { regionsForState, regionCountyNames } from "@/data/states";

// More (Nov 18, 2026): the picker's "Counties: ..." lists must stay identical to the Terms Region lists.
// A county move or region rename is a dated Terms change that needs Andrew; this test fails if they drift.
describe("Region picker counties match the Terms Region list", () => {
  const terms = new Map<string, string[]>();
  for (const m of TERMS_HTML.matchAll(/<li><strong>([^<]+?):<\/strong>\s*([^<]+)<\/li>/g)) {
    if (/Council$/.test(m[1])) terms.set(m[1], m[2].split(",").map((s) => s.trim()));
  }
  it("same regions, same counties, same order", () => {
    const regions = regionsForState("FL");
    expect(terms.size).toBe(10);
    expect(regions.map((r) => r.name).sort()).toEqual([...terms.keys()].sort());
    for (const r of regions) expect(regionCountyNames("FL", r)).toEqual(terms.get(r.name));
  });
});
