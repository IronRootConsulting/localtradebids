// Build-output guards for the generated sitemap and trailing-slash URLs
// (Andrew, 2:09 PM ET Nov 18, 2026, via Bernard: gaps 1 and 4). Run after `npm run build`.
// Data-independent on purpose: the weekday data refresh changes which county+trade pages
// are noindex (0 open bids), so nothing here hardcodes data-driven page lists.
import { describe, expect, it } from "vitest";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { PUBLIC_PAGES_AS_OF } from "@/data/ltb";
import { pageHead, breadcrumbLd, pageUrl } from "@/lib/seo";

const SITE = "https://localtradebids.com";
const OUT = fileURLToPath(new URL("../../.output/public/", import.meta.url));

function htmlFiles(dir: string, acc: string[] = []): string[] {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) htmlFiles(p, acc);
    else if (e.name.endsWith(".html")) acc.push(p);
  }
  return acc;
}
const served = (f: string) => {
  const rel = relative(OUT, f).split(sep).join("/");
  return SITE + "/" + (rel === "index.html" ? "" : rel.replace(/index\.html$/, ""));
};
const pages = htmlFiles(OUT).map((f) => {
  const html = readFileSync(f, "utf8");
  const robots = html.match(/<meta name="robots" content="([^"]*)"/)?.[1] ?? "";
  return {
    url: served(f),
    html,
    noindex: /noindex/.test(robots),
    canonical: html.match(/<link rel="canonical" href="([^"]*)"/)?.[1],
    ogUrl: html.match(/<meta property="og:url" content="([^"]*)"/)?.[1],
  };
});
const sitemap = readFileSync(join(OUT, "sitemap.xml"), "utf8");
const entries = [...sitemap.matchAll(/<url><loc>([^<]+)<\/loc>(?:<lastmod>([^<]+)<\/lastmod>)?<\/url>/g)].map(
  (m) => ({ loc: m[1], lastmod: m[2] }),
);

describe("generated sitemap.xml", () => {
  it("is not a committed file (generated into the build output only)", () => {
    expect(existsSync(new URL("../../public/sitemap.xml", import.meta.url))).toBe(false);
    const pkg = JSON.parse(readFileSync(new URL("../../package.json", import.meta.url), "utf8"));
    expect(pkg.scripts.build).toBe("vite build && node scripts/gen-sitemap.mjs");
  });
  it("is a well-formed urlset whose every <url> parsed", () => {
    expect(sitemap.startsWith('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')).toBe(true);
    expect(sitemap.trim().endsWith("</urlset>")).toBe(true);
    expect((sitemap.match(/<url>/g) ?? []).length).toBe(entries.length);
  });
  it("lists exactly the indexable built pages, each once, by its served trailing-slash URL", () => {
    const indexable = pages.filter((p) => !p.noindex).map((p) => p.url).sort();
    const locs = entries.map((e) => e.loc);
    expect(new Set(locs).size).toBe(locs.length);
    expect([...locs].sort()).toEqual(indexable);
    expect(locs[0]).toBe(SITE + "/");
    for (const l of locs) expect(l).toMatch(/^https:\/\/localtradebids\.com\/([a-z0-9-]+\/)*$/);
  });
  it("leaves out every noindex page", () => {
    const noindex = pages.filter((p) => p.noindex).map((p) => p.url);
    for (const p of ["/manage/", "/thank-you/", "/404.html"]) expect(noindex).toContain(SITE + p);
    const locs = new Set(entries.map((e) => e.loc));
    for (const u of noindex) expect(locs.has(u)).toBe(false);
  });
  it("uses the data export date as lastmod on data pages and none on static pages", () => {
    expect(PUBLIC_PAGES_AS_OF).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    for (const e of entries) {
      const data = e.loc === SITE + "/" || e.loc.startsWith(SITE + "/florida/");
      expect(e.lastmod).toBe(data ? PUBLIC_PAGES_AS_OF : undefined);
    }
  });
  it("is listed in robots.txt", () => {
    expect(readFileSync(join(OUT, "robots.txt"), "utf8")).toContain("Sitemap: https://localtradebids.com/sitemap.xml");
  });
});

describe("trailing-slash canonical, og:url, and breadcrumb URLs", () => {
  it("pageUrl adds a trailing slash to every non-root path; home stays /", () => {
    expect(pageUrl("/")).toBe(SITE + "/");
    expect(pageUrl("/pricing")).toBe(SITE + "/pricing/");
    expect(pageUrl("/florida/leon/")).toBe(SITE + "/florida/leon/");
    const h = pageHead({ title: "t", description: "d", path: "/florida/leon/roofing" });
    expect(h.links[0].href).toBe(SITE + "/florida/leon/roofing/");
    expect(h.meta.find((m) => "property" in m && m.property === "og:url")).toMatchObject({ content: SITE + "/florida/leon/roofing/" });
    const b = breadcrumbLd([{ name: "Home", path: "/" }, { name: "Florida", path: "/florida" }]);
    expect(b.itemListElement.map((i) => i.item)).toEqual([SITE + "/", SITE + "/florida/"]);
  });
  it("every indexable built page has canonical = og:url = its served URL", () => {
    for (const p of pages.filter((x) => !x.noindex)) {
      expect(p.canonical, p.url).toBe(p.url);
      expect(p.ogUrl, p.url).toBe(p.url);
    }
  });
  it("every canonical, og:url, and BreadcrumbList item on any built page ends with /", () => {
    let crumbs = 0;
    for (const p of pages) {
      for (const u of [p.canonical, p.ogUrl]) if (u) expect(u, p.url).toMatch(/\/$/);
      for (const m of p.html.matchAll(/"@type":"ListItem","position":\d+,"name":"[^"]*","item":"([^"]+)"/g)) {
        crumbs++;
        expect(m[1], p.url).toMatch(/^https:\/\/localtradebids\.com\/([a-z0-9-]+\/)*$/);
      }
    }
    expect(crumbs).toBeGreaterThan(0);
  });
});
