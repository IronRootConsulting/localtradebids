/** @vitest-environment jsdom */
// SAM.gov badge Option A (Andrew, 6:19 AM ET Nov 25, 2026, via Bernard): site support for
// Bede's two unlisted-location labels. Labels must match gov-contracts-alert
// lib/launch_filter.py (FEDERAL_LOCATION_NOT_LISTED, COUNTY_NOT_LISTED) exactly.
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

// jsdom environment: resolve files from the repo root (vitest cwd), not import.meta.url.
const ROOT = process.cwd();

vi.mock("@tanstack/react-router", () => ({
  Link: ({ to, children, className }: { to: string; children: React.ReactNode; className?: string }) => (
    <a href={typeof to === "string" ? to : "/"} className={className}>{children}</a>
  ),
}));

import {
  COUNTY_NOT_LISTED,
  FEDERAL_LOCATION_NOT_LISTED,
  UNLISTED_LABELS,
  isStatewideLabel,
  isUnlistedLabel,
  locationBadge,
} from "@/data/locationLabels";
import { FLORIDA_COUNTIES, PUBLIC_PAGES, type PublicPage, type PublicRow } from "@/data/ltb";
import { getPageSample, pageSampleFromTuple, pageTypeOf, rowToBid } from "@/data/helpers";
import { BidTable } from "@/components/site/ui";

afterEach(cleanup);

const row = (title: string, county: string, id: string, trade = "electrical"): PublicRow =>
  [title, "Agency " + id, county, trade, "2026-12-15", "https://example.gov/notice/" + id, id];
const LOCAL = row("Local job", "Leon", "l1");
const SW = row("Florida-wide job", "Statewide", "s1");
const FED = row("Federal job", FEDERAL_LOCATION_NOT_LISTED, "f1");
const FLU = row("FDOT job", COUNTY_NOT_LISTED, "u1");

describe("location labels", () => {
  it("uses Bede's exact strings", () => {
    expect(FEDERAL_LOCATION_NOT_LISTED).toBe("Federal, location not listed");
    expect(COUNTY_NOT_LISTED).toBe("Florida (county not listed)");
    expect(UNLISTED_LABELS).toEqual(["Florida (county not listed)", "Federal, location not listed"]);
  });

  it("classifies labels; Statewide is not unlisted and a county is neither", () => {
    expect(isUnlistedLabel(FEDERAL_LOCATION_NOT_LISTED)).toBe(true);
    expect(isUnlistedLabel(` ${COUNTY_NOT_LISTED} `)).toBe(true);
    expect(isUnlistedLabel("Statewide")).toBe(false);
    expect(isUnlistedLabel("Leon")).toBe(false);
    expect(isUnlistedLabel("")).toBe(false);
    expect(isStatewideLabel("Statewide")).toBe(true);
    expect(locationBadge("Leon")).toBe("");
    expect(locationBadge("Orange/Osceola")).toBe("");
    expect(locationBadge("Statewide")).toBe("Statewide");
    expect(locationBadge(FEDERAL_LOCATION_NOT_LISTED)).toBe(FEDERAL_LOCATION_NOT_LISTED);
  });

  it("no unlisted label is a Florida county, so it never gets a county slug, link or page", () => {
    for (const label of UNLISTED_LABELS) {
      expect(FLORIDA_COUNTIES.some((c) => c.name === label)).toBe(false);
      expect(rowToBid(row("x", label, "z")).countySlug).toBe("");
    }
  });
});

describe("export tuples with an unlisted section", () => {
  it("reads a 9-element page: local, then statewide, then unlisted rows; counts add up", () => {
    const page: PublicPage = [40, 4, 36, [LOCAL, SW, FED, FLU], 3, 30, 1, 1, 7];
    const s = pageSampleFromTuple(page);
    expect([s.openCount, s.shownCount, s.moreCount]).toEqual([40, 4, 36]);
    expect([s.localCount, s.statewideCount, s.unlistedCount]).toEqual([30, 3, 7]);
    expect(s.localCount + s.statewideCount + s.unlistedCount).toBe(s.openCount);
    expect(s.localRows.map((b) => b.id)).toEqual(["l1"]);
    expect(s.statewideRows.map((b) => b.id)).toEqual(["s1"]);
    expect(s.unlistedRows.map((b) => b.id)).toEqual(["f1", "u1"]);
    expect(s.unlistedRows.every((b) => b.countySlug === "")).toBe(true);
  });

  it("reads a legacy 7-element page as before (no unlisted rows)", () => {
    const s = pageSampleFromTuple([10, 2, 8, [LOCAL, SW], 4, 6, 1]);
    expect([s.localCount, s.statewideCount, s.unlistedCount]).toEqual([6, 4, 0]);
    expect(s.statewideRows.map((b) => b.id)).toEqual(["s1"]);
    expect(s.unlistedRows).toEqual([]);
  });

  it("defaults local_count to open - statewide - unlisted when absent", () => {
    const page = [12, 1, 11, [FED], 2] as unknown as PublicPage;
    const s = pageSampleFromTuple(page);
    expect(s.localCount).toBe(10);
  });

  it("live data: unlisted rows only on home and statewide trade pages, never on county pages", () => {
    for (const k of Object.keys(PUBLIC_PAGES)) {
      const s = getPageSample(k);
      const t = pageTypeOf(k);
      if (t === "county" || t === "county_trade") {
        expect(s.unlistedCount, k).toBe(0);
        expect(s.rows.some((b) => isUnlistedLabel(b.county)), k).toBe(false);
      }
      expect(s.localCount + s.statewideCount + s.unlistedCount, k).toBe(s.openCount);
      expect(s.unlistedRows.every((b) => isUnlistedLabel(b.county)), k).toBe(true);
      expect(s.statewideRows.every((b) => b.county === "Statewide"), k).toBe(true);
    }
  });

  it("no page key is a label or its slug", () => {
    const slugs = UNLISTED_LABELS.map((l) => l.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""));
    for (const k of Object.keys(PUBLIC_PAGES)) {
      for (const part of k.split("/")) {
        expect(UNLISTED_LABELS.includes(part)).toBe(false);
        expect(slugs.includes(part)).toBe(false);
        expect(/not-listed|federal/.test(part), k).toBe(false);
      }
    }
  });
});

describe("BidTable renders the labels (desktop table and phone cards share this markup)", () => {
  const bids = [LOCAL, SW, FED, FLU].map(rowToBid);

  it("home / statewide trade view: the label is the County cell, wrapping allowed, no extra badge", () => {
    const { container } = render(<BidTable bids={bids} cols="home" />);
    const cells = [...container.querySelectorAll('td[data-label="County"]')].map((td) => td.textContent);
    expect(cells).toEqual(["Leon", "Statewide", FEDERAL_LOCATION_NOT_LISTED, COUNTY_NOT_LISTED]);
    const unlistedCells = container.querySelectorAll("td.bid-unlisted-cell");
    expect([...unlistedCells].map((td) => td.textContent)).toEqual([FEDERAL_LOCATION_NOT_LISTED, COUNTY_NOT_LISTED]);
    expect(container.querySelectorAll(".bid-statewide")).toHaveLength(0);
    expect(screen.getByRole("columnheader", { name: "County" })).toBeTruthy();
  });

  it("views without a County column: Statewide and both unlisted labels show as badges, local bids none", () => {
    const { container } = render(<BidTable bids={bids} cols="trade" />);
    const titles = [...container.querySelectorAll("td.bid-title")];
    expect(titles[0]!.querySelector(".bid-statewide")).toBeNull();
    expect(titles[1]!.querySelector(".bid-statewide")?.textContent).toBe("Statewide");
    expect(titles[1]!.querySelector(".bid-unlisted")).toBeNull();
    expect(within(titles[2] as HTMLElement).getByText(FEDERAL_LOCATION_NOT_LISTED).className).toBe("bid-statewide bid-unlisted");
    expect(within(titles[3] as HTMLElement).getByText(COUNTY_NOT_LISTED).className).toBe("bid-statewide bid-unlisted");
    expect(container.textContent).not.toMatch(/Federal, location not listed.*Statewide|Statewide.*Florida \(county not listed\)Statewide/);
  });

  it("CSS lets the long labels wrap in the desktop County cell and on phone cards", () => {
    const css = readFileSync(join(ROOT, "src/styles.css"), "utf8");
    expect(css).toMatch(/\.bid-table td\.bid-field\.bid-unlisted-cell\s*\{[^}]*white-space:\s*normal/);
    expect(css).toMatch(/\.bid-statewide\.bid-unlisted\s*\{[^}]*white-space:\s*normal/);
  });
});

describe("built site: no county page or sitemap URL for an unlisted label", () => {
  const out = join(ROOT, ".output/public");
  it.runIf(existsSync(out))("no /florida/<label> directory and no such URL in sitemap.xml", () => {
    const dirs = readdirSync(join(out, "florida"));
    expect(dirs.some((d) => /not-listed|federal|county-not/.test(d))).toBe(false);
    const sm = readFileSync(join(out, "sitemap.xml"), "utf8");
    expect(sm).not.toMatch(/not-listed|federal-location|county-not-listed/i);
  });
});
