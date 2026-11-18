import {
  FLORIDA_COUNTIES, PUBLIC_PAGES, REGIONS, STATES, TRADES,
  type Bid, type PublicRow, type Region,
} from "./ltb";

export const getCounty = (slug: string) => FLORIDA_COUNTIES.find((c) => c.slug === slug);
export const getTrade = (slug: string) => TRADES.find((t) => t.slug === slug);
export const getState = (slug: string) => STATES.find((s) => s.slug === slug);
export const countyLabel = (name: string) => `${name} County`;

/** Calendar date in America/New_York at build / module-eval time (YYYY-MM-DD). */
export function buildDateISO(now = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const y = parts.find((p) => p.type === "year")?.value;
  const m = parts.find((p) => p.type === "month")?.value;
  const d = parts.find((p) => p.type === "day")?.value;
  return `${y}-${m}-${d}`;
}

export const BUILD_DATE_ISO = buildDateISO();

export const isOpenBid = (bid: Bid, asOf: string = BUILD_DATE_ISO) =>
  bid.dueDateISO >= asOf;

export const sortByDue = (bids: Bid[]) =>
  [...bids].sort(
    (a, b) => a.dueDateISO.localeCompare(b.dueDateISO) || a.title.localeCompare(b.title),
  );

export const openBids = (bids: Bid[], asOf: string = BUILD_DATE_ISO) =>
  sortByDue(bids.filter((b) => isOpenBid(b, asOf)));

/* Public listing pages render Bede's export (PUBLIC_PAGES in ltb.ts) as-is. */

export type PageType = "home" | "county" | "trade" | "county_trade";
export type PageSample = { rows: Bid[]; openCount: number; shownCount: number; moreCount: number; statewideCount: number };

export const HOME_PAGE_KEY = "home";
export const countyPageKey = (countySlug: string) => countySlug;
export const tradePageKey = (tradeSlug: string) => tradeSlug;
export const countyTradePageKey = (countySlug: string, tradeSlug: string) =>
  `${countySlug}/${tradeSlug}`;

export function pageTypeOf(pageKey: string): PageType {
  if (pageKey === HOME_PAGE_KEY) return "home";
  if (pageKey.includes("/")) return "county_trade";
  return TRADES.some((t) => t.slug === pageKey) ? "trade" : "county";
}

export const hasPublicPage = (pageKey: string) =>
  Object.prototype.hasOwnProperty.call(PUBLIC_PAGES, pageKey);

function rowToBid(r: PublicRow): Bid {
  const [title, agency, county, trade, due, url, id] = r;
  const iso = /^\d{4}-\d{2}-\d{2}$/.test(due) ? due : "";
  const c = FLORIDA_COUNTIES.find((x) => x.name === county);
  return {
    id,
    title,
    agency,
    county,
    countySlug: c ? c.slug : "",
    trade,
    dueDate: due,
    dueDateISO: iso,
    sourceUrl: url,
  };
}

/**
 * Lookup into Bede's export. Rows keep Bede's order. A page missing from the export
 * has 0 open bids.
 */
export function getPageSample(pageKey: string): PageSample {
  const page = hasPublicPage(pageKey) ? PUBLIC_PAGES[pageKey] : undefined;
  if (!page) return { rows: [], openCount: 0, shownCount: 0, moreCount: 0, statewideCount: 0 };
  const [openCount, shownCount, moreCount, rows, statewideCount = 0] = page;
  return { rows: rows.map(rowToBid), openCount, shownCount, moreCount, statewideCount };
}

export const countiesWithBids = () =>
  FLORIDA_COUNTIES.filter((c) => hasPublicPage(countyPageKey(c.slug)));

export const tradesWithBidsIn = (countySlug: string) =>
  TRADES.filter((t) => hasPublicPage(countyTradePageKey(countySlug, t.slug)));

export const tradesWithStatewideBids = () =>
  TRADES.filter((t) => hasPublicPage(tradePageKey(t.slug)));

/** Path for a statewide trade page, served by /florida/trade/$trade. */
export const statewideTradePath = (tradeSlug: string) => `/florida/trade/${tradeSlug}`;

export const statewideTradeParams = (tradeSlug: string) =>
  ({ county: "trade", trade: tradeSlug }) as const;

export function formatDue(iso: string): string {
  const [y, m, d] = iso.split("-");
  if (!y || !m || !d) return "Not listed";
  return `${m}/${d}/${y}`;
}

export function formatUpdated(iso: string): string {
  const [y, m, d] = iso.split("-");
  if (!y || !m || !d) return "";
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  const month = months[Number(m) - 1];
  if (!month) return "";
  return `${month} ${Number(d)}, ${y}, ET`;
}

export const regionForCounty = (countySlug: string): Region | undefined =>
  REGIONS.find((r) => r.countySlugs.includes(countySlug));

export const countiesInRegion = (region: Region) =>
  region.countySlugs
    .map((slug) => FLORIDA_COUNTIES.find((c) => c.slug === slug))
    .filter((c): c is NonNullable<typeof c> => Boolean(c));

/** Up to 4 other counties in the same region with a public page (for a trade if given). */
export function nearbyCounties(countySlug: string, tradeSlug?: string, limit = 4) {
  const region = regionForCounty(countySlug);
  if (!region) return [];
  const others = region.countySlugs.filter((s) => s !== countySlug);
  const withBids = others.filter((s) =>
    hasPublicPage(tradeSlug ? countyTradePageKey(s, tradeSlug) : countyPageKey(s)),
  );
  return withBids
    .slice(0, limit)
    .map((slug) => FLORIDA_COUNTIES.find((c) => c.slug === slug))
    .filter((c): c is NonNullable<typeof c> => Boolean(c));
}


export const regionsByNumber = () =>
  [...REGIONS].sort((a, b) => a.number - b.number);
