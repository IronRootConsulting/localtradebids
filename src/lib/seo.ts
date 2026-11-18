import { SITE } from "@/config/site";
import type { Trade } from "@/data/ltb";

export const TITLE_MAX = 60;

type HeadOpts = {
  title: string;
  description: string;
  path: string;
  type?: string;
  noindex?: boolean;
  jsonLd?: object[];
};

export function robotsContent(noindex?: boolean) {
  if (SITE.draft) return "noindex, nofollow";
  return noindex ? "noindex, follow" : "index, follow";
}

export function pageHead({
  title,
  description,
  path,
  type = "website",
  noindex,
  jsonLd = [],
}: HeadOpts) {
  const url = SITE.url + path;
  return {
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: robotsContent(noindex) },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: type },
      { property: "og:url", content: url },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: url }],
    scripts: jsonLd.map((d) => ({ type: "application/ld+json", children: JSON.stringify(d) })),
  };
}

export function breadcrumbLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: SITE.url + it.path,
    })),
  };
}

export const orgLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE.name,
  url: SITE.url,
  email: SITE.contactEmail,
  parentOrganization: { "@type": "Organization", name: SITE.operator },
  address: {
    "@type": "PostalAddress",
    streetAddress: "5052 Pope John Paul II Blvd, Suite 108-23",
    addressLocality: "Ave Maria",
    addressRegion: "FL",
    postalCode: "34142",
    addressCountry: "US",
  },
};

export const websiteLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE.name,
  url: SITE.url,
};

/** Fit an SEO title to 60 characters: try full, then a short form, then drop the suffix. */
export function fitTitle(fullWithSuffix: string, shortWithSuffix?: string): string {
  if (fullWithSuffix.length <= TITLE_MAX) return fullWithSuffix;
  if (shortWithSuffix && shortWithSuffix.length <= TITLE_MAX) return shortWithSuffix;
  const suffix = " | LocalTradeBids";
  const drop = (s: string) => (s.endsWith(suffix) ? s.slice(0, -suffix.length) : s);
  const shortPlain = shortWithSuffix ? drop(shortWithSuffix) : undefined;
  if (shortPlain && shortPlain.length <= TITLE_MAX) return shortPlain;
  const fullPlain = drop(fullWithSuffix);
  if (fullPlain.length <= TITLE_MAX) return fullPlain;
  return (shortPlain ?? fullPlain).slice(0, TITLE_MAX);
}

export function countyTitle(countyName: string): string {
  return fitTitle(`${countyName} County, FL Government Bids | LocalTradeBids`);
}

export function countyTradeTitle(trade: Trade, countyName: string): string {
  // More (Nov 18, 2026): titles must not say bids are "in <County>", since statewide bids are included.
  const head = `${countyName} County, FL `;
  const tail = " Bids | LocalTradeBids";
  return fitTitle(head + trade.name + tail, head + trade.shortName + tail);
}

export function statewideTradeTitle(trade: Trade): string {
  const tail = " Bids by County | LocalTradeBids";
  return fitTitle(`Florida ${trade.name}${tail}`, `Florida ${trade.shortName}${tail}`);
}

export function countyMeta(countyName: string, hasStatewide = false): string {
  if (!hasStatewide) {
    return (
      `Public construction and property-services bids from government agencies in ` +
      `${countyName} County, FL, sorted by trade, with due dates and official links.`
    );
  }
  // More (Nov 18, 2026): say statewide bids are included, so the list isn't presented as all local.
  return fitMeta(
    `Public construction and property-services bids from government agencies in ` +
      `${countyName} County, FL, plus statewide bids, sorted by trade, with official links.`,
    `Construction and property-services bids from agencies in ${countyName} County, FL, ` +
      `plus statewide bids, sorted by trade.`,
  );
}

export const META_MAX = 155;

function fitMeta(full: string, shortForm?: string): string {
  if (full.length <= META_MAX) return full;
  if (shortForm && shortForm.length <= META_MAX) return shortForm;
  return full;
}

export function countyTradeMeta(trade: Trade, countyName: string, hasStatewide = false): string {
  if (hasStatewide) {
    // More (Nov 18, 2026): statewide bids are included on county pages and must not read as local.
    const mid = ` bids from public agencies in ${countyName} County, FL, plus statewide `;
    const end = " bids, with due dates and links to the official notice.";
    return fitMeta(
      "Open " + trade.lc + mid + trade.lc + end,
      "Open " + trade.lcShort + mid + trade.lcShort + " bids, with links to the official notice.",
    );
  }
  const tail =
    ` bids from public agencies in ${countyName} County, FL, ` +
    "with due dates and links to the official notice. Emailed daily or weekly.";
  return fitMeta("Open " + trade.lc + tail, "Open " + trade.lcShort + tail);
}

export function statewideTradeMeta(trade: Trade): string {
  const tail =
    " bids from government agencies across Florida, " +
    "listed by county with due dates and official links. Get a daily or weekly email.";
  return fitMeta("Public " + trade.lc + tail, "Public " + trade.lcShort + tail);
}
