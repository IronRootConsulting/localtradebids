#!/usr/bin/env node
// Build-time sitemap for the prerendered static site (runs after `vite build`).
// Andrew, 2:09 PM ET Nov 18, 2026 (via Bernard): auto-generated sitemap (gap 1).
//
// Source of truth = the built HTML in .output/public, the same files GitHub Pages serves:
//   - every *.html page whose robots meta does NOT contain "noindex" is listed;
//   - its <loc> is its canonical URL, which must equal the URL GitHub Pages serves
//     for that file (dir/index.html -> https://localtradebids.com/dir/), so no loc 301s;
//   - noindex pages (zero-bid county+trade pages, /manage/, /thank-you/, 404) are left out.
// lastmod = PUBLIC_PAGES_AS_OF from src/data/ltb.ts (the data export date) for the
// data-driven pages (home and everything under /florida/). Static pages (pricing, faq,
// legal, ...) carry no lastmod, since the export date says nothing about them.
// Nothing here is committed: sitemap.xml exists only in the build output, so the weekday
// data refresh (which changes only src/data/ltb.ts) regenerates it on every deploy.
// Any mismatch fails the build (exit 1), which stops the Pages workflow before upload.
import { readFileSync, readdirSync, writeFileSync, existsSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

export const SITE_URL = "https://localtradebids.com";

function walk(dir, out = []) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (e.isFile() && e.name.endsWith(".html")) out.push(p);
  }
  return out;
}

/** URL GitHub Pages serves (200, no redirect) for a built HTML file. */
export function servedUrl(outDir, file) {
  const rel = relative(outDir, file).split(sep).join("/");
  if (rel === "index.html") return SITE_URL + "/";
  if (rel.endsWith("/index.html")) return SITE_URL + "/" + rel.slice(0, -"index.html".length);
  return SITE_URL + "/" + rel;
}

function attr(tag, name) {
  const m = tag.match(new RegExp(`\\s${name}="([^"]*)"`, "i"));
  return m ? m[1].replace(/&amp;/g, "&") : null;
}

export function scanPages(outDir) {
  const pages = [];
  const errors = [];
  for (const file of walk(outDir).sort()) {
    const html = readFileSync(file, "utf8");
    const robotsTags = html.match(/<meta[^>]*\sname="robots"[^>]*>/gi) ?? [];
    const robots = robotsTags.map((t) => (attr(t, "content") ?? "").toLowerCase()).join(",");
    const noindex = robots.includes("noindex") || robots.includes("none");
    const served = servedUrl(outDir, file);
    if (noindex) {
      pages.push({ file, served, indexable: false });
      continue;
    }
    const canon = (html.match(/<link[^>]*\srel="canonical"[^>]*>/gi) ?? []).map((t) => attr(t, "href"));
    if (canon.length !== 1) errors.push(`${served}: indexable page has ${canon.length} canonical tags`);
    else if (canon[0] !== served) errors.push(`${served}: canonical ${canon[0]} is not the served URL`);
    pages.push({ file, served, canonical: canon[0], indexable: true });
  }
  return { pages, errors };
}

export function readDataAsOf(ltbTsPath) {
  const src = readFileSync(ltbTsPath, "utf8");
  const m = src.match(/export const PUBLIC_PAGES_AS_OF = "(\d{4}-\d{2}-\d{2})";/);
  if (!m) throw new Error(`PUBLIC_PAGES_AS_OF not found in ${ltbTsPath}`);
  return m[1];
}

export function isDataPage(loc) {
  return loc === SITE_URL + "/" || loc.startsWith(SITE_URL + "/florida/");
}

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export function buildSitemapXml(locs, dataAsOf) {
  const lines = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'];
  for (const loc of locs) {
    const lm = isDataPage(loc) ? `<lastmod>${dataAsOf}</lastmod>` : "";
    lines.push(`  <url><loc>${esc(loc)}</loc>${lm}</url>`);
  }
  lines.push("</urlset>", "");
  return lines.join("\n");
}

function main() {
  const root = fileURLToPath(new URL("..", import.meta.url));
  const outDir = process.argv[2] ?? join(root, ".output", "public");
  const ltbTs = join(root, "src", "data", "ltb.ts");
  const fail = (msg) => {
    console.error(`gen-sitemap: FAILED: ${msg}`);
    process.exit(1);
  };
  if (!existsSync(join(outDir, "index.html"))) fail(`no prerendered site at ${outDir}`);
  const robotsTxt = existsSync(join(outDir, "robots.txt")) ? readFileSync(join(outDir, "robots.txt"), "utf8") : "";
  if (!robotsTxt.includes(`Sitemap: ${SITE_URL}/sitemap.xml`)) fail("robots.txt does not list the sitemap");
  const { pages, errors } = scanPages(outDir);
  if (errors.length) fail(errors.slice(0, 20).join("; "));
  const locs = pages.filter((p) => p.indexable).map((p) => p.canonical);
  const home = SITE_URL + "/";
  locs.sort((a, b) => (a === home ? -1 : b === home ? 1 : a < b ? -1 : a > b ? 1 : 0));
  if (new Set(locs).size !== locs.length) fail("duplicate locs");
  if (!locs.includes(home)) fail("home page is not indexable");
  for (const l of locs) if (!l.startsWith(SITE_URL + "/") || !l.endsWith("/")) fail(`bad loc ${l}`);
  if (locs.length > 50000) fail("more than 50,000 URLs; split into a sitemap index");
  const dataAsOf = readDataAsOf(ltbTs);
  writeFileSync(join(outDir, "sitemap.xml"), buildSitemapXml(locs, dataAsOf));
  const skipped = pages.filter((p) => !p.indexable).map((p) => p.served.slice(SITE_URL.length));
  console.log(
    `gen-sitemap: ${locs.length} URLs (lastmod ${dataAsOf} on ${locs.filter(isDataPage).length} data pages); ` +
      `${skipped.length} noindex pages left out: ${skipped.join(" ")}`,
  );
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) main();
