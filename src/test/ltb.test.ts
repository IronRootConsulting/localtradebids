import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import {
  countiesWithBids,
  isOpenBid,
  statewideTradePath,
  tradesWithBidsIn,
  tradesWithStatewideBids,
  buildDateISO,
  regionForCounty,
  regionsByNumber,
  countyPageKey,
  HOME_PAGE_KEY,
  countyTradePageKey,
  getPageSample,
  hasPublicPage,
  pageTypeOf,
  tradePageKey,
} from "@/data/helpers";
import {
  FLORIDA_COUNTIES,
  PUBLIC_PAGES,
  PUBLIC_PAGES_AS_OF,
  REGIONS,
  TRADES,
  type Bid,
} from "@/data/ltb";
import {
  PLANS,
  STATE_A_BUTTON_HELPER,
  STATE_A_PLANS_OPEN_SOON,
  STATE_B_BUTTON_HELPER,
  autorenewHtml,
} from "@/components/site/PricingCards";
import {
  MARKETING_OPT_IN_DEFAULT_CHECKED,
  MARKETING_OPT_IN_TEXT,
  MARKETING_OPT_IN_VERSION,
  SAMPLE_CONDITIONS,
  SAMPLE_CONSENT_OPT_IN,
  SAMPLE_DETAILS,
  SAMPLE_SUCCESS,
  HOME_PANEL_LINE,
  MoreForSubscribers,
  countLineText,
  noOpenBidsText,
  moreForSubscribersText,
} from "@/components/site/ui";
import { FOOTER_AFFILIATION } from "@/components/site/Layout";
import {
  countyTitle,
  countyTradeMeta,
  countyTradeTitle,
  countyMeta,
  fitTitle,
  META_MAX,
  TITLE_MAX,
  statewideTradeTitle,
  statewideTradeMeta,
  robotsContent,
} from "@/lib/seo";
import { SITE, buildConsentLogPayload } from "@/config/site";
import { CANCEL_FALLBACK_TEXT, CANCEL_STEPS_TEXT, PLAN_CHANGES_TEXT } from "@/routes/manage";
import { PRIVACY_HTML } from "@/routes/privacy";
import { COVERAGE_LINE } from "@/routes/how-it-works";
import { DELIVERY_LINE } from "@/components/site/PricingCards";
import { REFUND_HTML, TERMS_HTML } from "@/routes/terms";

describe("trades and prices", () => {
  it("has the seven approved trades and slugs", () => {
    expect(TRADES.map((t) => t.slug)).toEqual([
      "roofing",
      "electrical",
      "plumbing-hvac",
      "sitework-heavy-civil",
      "commercial-general-contracting",
      "landscaping",
      "painting",
    ]);
    expect(TRADES.map((t) => t.name)).toEqual([
      "Roofing",
      "Electrical",
      "Plumbing & HVAC",
      "Sitework & Heavy Civil",
      "Commercial General Contracting",
      "Landscaping",
      "Painting",
    ]);
  });

  it("has no General Construction slug or name", () => {
    const blob = JSON.stringify(TRADES) + JSON.stringify(PUBLIC_PAGES);
    expect(blob).not.toMatch(/general-construction/i);
    expect(blob).not.toMatch(/General Construction/);
  });

  it("has approved prices 39/89/139 and no PROPOSED flag on plans", () => {
    expect(PLANS.map((p) => p.price)).toEqual([39, 89, 139]);
    expect(JSON.stringify(PLANS)).not.toMatch(/PROPOSED/);
  });

  it("lists all 67 Florida counties", () => {
    expect(FLORIDA_COUNTIES).toHaveLength(67);
  });
});

describe("regions (Bede map)", () => {
  it("has 10 regions covering every Florida county once", () => {
    expect(REGIONS).toHaveLength(10);
    expect(regionsByNumber().map((r) => r.number)).toEqual([
      1, 2, 3, 4, 6, 7, 8, 9, 10, 11,
    ]);
    const slugs = REGIONS.flatMap((r) => r.countySlugs);
    expect(slugs).toHaveLength(67);
    expect(new Set(slugs).size).toBe(67);
    expect(regionForCounty("collier")?.name).toBe(
      "Southwest Florida Regional Planning Council",
    );
  });
});

describe("bid gate", () => {
  it("treats today or later as open, and hides past-due rows", () => {
    const today = "2026-11-17";
    const bid = (due: string): Bid => ({
      id: "x",
      title: "t",
      agency: "a",
      county: "Collier",
      countySlug: "collier",
      trade: "roofing",
      dueDate: due,
      dueDateISO: due,
      sourceUrl: "https://example.com",
    });
    expect(isOpenBid(bid("2026-11-17"), today)).toBe(true);
    expect(isOpenBid(bid("2026-11-18"), today)).toBe(true);
    expect(isOpenBid(bid("2026-11-16"), today)).toBe(false);
  });

  it("builds statewide trade paths without ?trade=", () => {
    expect(statewideTradePath("roofing")).toBe("/florida/trade/roofing");
    expect(statewideTradePath("landscaping")).toBe("/florida/trade/landscaping");
  });
});

describe("SEO titles and metas", () => {
  it("fits titles to 60 characters for every county and trade", () => {
    for (const c of FLORIDA_COUNTIES) {
      expect(countyTitle(c.name).length).toBeLessThanOrEqual(TITLE_MAX);
      expect(countyTitle(c.name)).not.toMatch(/Official/i);
      expect(countyMeta(c.name).length).toBeLessThanOrEqual(META_MAX);
      for (const t of TRADES) {
        const title = countyTradeTitle(t, c.name);
        expect(title.length).toBeLessThanOrEqual(TITLE_MAX);
        expect(title).not.toMatch(/Official/i);
        expect(countyTradeMeta(t, c.name).length).toBeLessThanOrEqual(META_MAX);
      }
    }
    for (const t of TRADES) {
      expect(statewideTradeTitle(t).length).toBeLessThanOrEqual(TITLE_MAX);
      expect(statewideTradeMeta(t).length).toBeLessThanOrEqual(META_MAX);
    }
  });

  it("drops the brand when a county+trade title still exceeds 60", () => {
    const trade = TRADES.find((t) => t.slug === "plumbing-hvac")!;
    const title = countyTradeTitle(trade, "Hillsborough");
    expect(title).toBe("Plumbing & HVAC Bids in Hillsborough County, FL");
    expect(title.length).toBeLessThanOrEqual(60);
  });

  it("returns noindex, follow for zero-bid pages when the site is not in draft", () => {
    const prev = SITE.draft;
    SITE.draft = false;
    expect(robotsContent(true)).toBe("noindex, follow");
    expect(robotsContent(false)).toBe("index, follow");
    SITE.draft = true;
    expect(robotsContent(true)).toBe("noindex, nofollow");
    SITE.draft = prev;
  });
});

describe("v5 copy strings (verbatim)", () => {
  it("matches sample-band lines from copy v5", () => {
    expect(SAMPLE_CONDITIONS).toBe(
      "No card needed, and it never turns into a paid plan. " +
        "Sample emails also include information about our paid plans.",
    );
    expect(SAMPLE_CONSENT_OPT_IN).toBe(
      "By signing up, you agree to get the free weekly sample by email. " +
        "Unsubscribe anytime with the link in any email. See our Privacy Policy.",
    );
    expect(SAMPLE_DETAILS).toBe(
      "Every Monday, around 7:30 AM ET: up to 10 of the newest open bids statewide, " +
        "across all seven trades. Only bids from sources we've cleared, and never " +
        "past-due bids. Free, with no purchase needed. Every sample email has an " +
        "unsubscribe link and our mailing address.",
    );
    expect(SAMPLE_SUCCESS).toBe(
      "You're signed up. Your first sample arrives Monday, around 7:30 AM ET.",
    );
    expect(MARKETING_OPT_IN_TEXT).toBe(
      "Also email me occasional news and plan updates from LocalTradeBids. " +
        "Optional. Unsubscribe anytime.",
    );
    expect(MARKETING_OPT_IN_VERSION).toBe("more-rev2-marketing-optin-v1");
  });

  it("matches the v3 footer non-affiliation line", () => {
    expect(FOOTER_AFFILIATION).toBe(
      "LocalTradeBids is an independent service of IronRoot Consulting LLC d/b/a " +
        "LocalTradeBids [subject to fictitious-name registration]. We are not a " +
        "government agency or an official bid portal, and we are not affiliated with " +
        "or endorsed by any agency we list. Agency names identify the source of each " +
        "notice and belong to their owners.",
    );
  });

  it("matches More rev2 State A prices line, A1, and Stripe helper", () => {
    expect(STATE_A_PLANS_OPEN_SOON).toBe(
      "County $39, Region $89 and Statewide $139 per month, billed monthly. Plans renew automatically every month until you cancel. This site is a preview: checkout runs in Stripe's test mode, so nothing is charged and no subscription starts. Please don't enter real card or bank details. Paid plans aren't open yet.",
    );
    expect(STATE_B_BUTTON_HELPER).toBe(
      "You'll check out on a page hosted by Stripe.",
    );
    expect(autorenewHtml(39)).toContain("$39 per month, billed monthly.");
    expect(autorenewHtml(89)).toContain("$89 per month, billed monthly.");
    expect(autorenewHtml(139)).toContain(
      "Renews automatically every month at this price until you cancel.",
    );
    expect(autorenewHtml(39)).not.toContain("$[39 / 89 / 139]");
  });

  it("keeps unfilled plan-change and cancel wording from More rev2 / v3", () => {
    expect(PLAN_CHANGES_TEXT).toContain("Upgrades take effect right away");
    expect(PLAN_CHANGES_TEXT).toContain(
      "Downgrades take effect on your next billing date",
    );
    expect(PLAN_CHANGES_TEXT).toContain("no credit or refund is given for the change");
    expect(PLAN_CHANGES_TEXT).toContain("[PLACEHOLDER: preferences form link]");
    expect(PLAN_CHANGES_TEXT).not.toContain("[PENDING Andrew: downgrade credits]");
    expect(CANCEL_STEPS_TEXT).toContain(
      "Open the link and click Cancel subscription.",
    );
    expect(CANCEL_FALLBACK_TEXT).toContain("We'll cancel within 2 business days");
  });

  it("keeps checkout off and payment link slots empty", () => {
    expect(SITE.checkoutLive).toBe(false);
    expect(SITE.paymentLinks.county).toBe("");
    expect(SITE.paymentLinks.region).toBe("");
    expect(SITE.paymentLinks.statewide).toBe("");
    expect(SITE.billingPortalUrl).toBe("");
  });
});

describe("fitTitle helper", () => {
  it("prefers the full title when it already fits", () => {
    const s = "Short title | LocalTradeBids";
    expect(fitTitle(s, "X | LocalTradeBids")).toBe(s);
  });
});

describe("build date", () => {
  it("formats YYYY-MM-DD in America/New_York", () => {
    expect(buildDateISO(new Date("2026-11-17T12:00:00-05:00"))).toBe("2026-11-17");
  });
});

describe("consent log", () => {
  it("builds a payload with all 6 Google Form entry fields", () => {
    const body = buildConsentLogPayload({
      email: "you@company.com",
      marketingChecked: false,
      checkboxText: MARKETING_OPT_IN_TEXT,
      textVersion: MARKETING_OPT_IN_VERSION,
      formName: "sample-band",
      pageUrl: "https://localtradebids.com/",
    });
    const ids = SITE.consentLogEntries;
    expect(body.get(ids.email)).toBe("you@company.com");
    expect(body.get(ids.marketingOptIn)).toBe("unchecked");
    expect(body.get(ids.checkboxText)).toBe(MARKETING_OPT_IN_TEXT);
    expect(body.get(ids.textVersion)).toBe(MARKETING_OPT_IN_VERSION);
    expect(body.get(ids.formName)).toBe("sample-band");
    expect(body.get(ids.pageUrl)).toBe("https://localtradebids.com/");
    expect([...body.keys()].sort()).toEqual(
      Object.values(ids).slice().sort(),
    );
    expect([...body.keys()]).toHaveLength(6);
    const checked = buildConsentLogPayload({
      email: "you@company.com",
      marketingChecked: true,
      checkboxText: MARKETING_OPT_IN_TEXT,
      textVersion: MARKETING_OPT_IN_VERSION,
      formName: "coming-soon-waitlist",
      pageUrl: "https://localtradebids.com/coming-soon",
    });
    expect(checked.get(ids.marketingOptIn)).toBe("checked");
  });

  it("keeps the marketing checkbox unchecked by default", () => {
    expect(MARKETING_OPT_IN_DEFAULT_CHECKED).toBe(false);
  });
});

describe("trade scope lines", () => {
  it("has a v5 scope line for every trade", () => {
    expect(TRADES.every((tr) => tr.scope.length > 0)).toBe(true);
    expect(TRADES.find((tr) => tr.slug === "landscaping")?.scope).toContain(
      "Not landscape architecture or design",
    );
    expect(TRADES.find((tr) => tr.slug === "painting")?.scope).toContain(
      "pressure washing",
    );
  });
});

describe("public pages render Bede's export as-is (2026-11-17, commit 069d6c5)", () => {
  const keys = Object.keys(PUBLIC_PAGES);
  const countySlugs = new Set(FLORIDA_COUNTIES.map((c) => c.slug));
  const tradeSlugs = new Set(TRADES.map((t) => t.slug));
  const more = (n?: number) => MoreForSubscribers({ more: n });

  it("has 201 pages (incl. home) and 348 rows as of the export date", () => {
    expect(PUBLIC_PAGES_AS_OF).toBe("2026-11-17");
    expect(keys).toHaveLength(201);
    expect(keys.reduce((n, k) => n + getPageSample(k).rows.length, 0)).toBe(348);
  });

  it("page keys match route slugs", () => {
    for (const k of keys) {
      const t = pageTypeOf(k);
      if (t === "home") expect(k).toBe("home");
      if (t === "county") expect(countySlugs.has(k)).toBe(true);
      if (t === "trade") expect(tradeSlugs.has(k)).toBe(true);
      if (t === "county_trade") {
        const [c, tr] = k.split("/");
        expect(countySlugs.has(c ?? "")).toBe(true);
        expect(tradeSlugs.has(tr ?? "")).toBe(true);
      }
    }
  });

  it("every page shows shown_count rows and more = open - shown", () => {
    for (const k of keys) {
      const s = getPageSample(k);
      expect(s.rows).toHaveLength(s.shownCount);
      expect(s.moreCount).toBe(s.openCount - s.shownCount);
      expect(s.shownCount).toBe(Math.min(3, Math.max(1, Math.floor(s.openCount / 2))));
      if (s.moreCount > 0) {
        expect(more(s.moreCount)).not.toBeNull();
        expect(moreForSubscribersText(s.moreCount)).toBe(
          `+${s.moreCount} more open bids for subscribers.`,
        );
      } else {
        expect(more(s.moreCount)).toBeNull();
      }
    }
  });

  it("Brevard renders 7 open, 3 shown in Bede's order, +4 more open bids for subscribers", () => {
    const s = getPageSample(countyPageKey("brevard"));
    expect([s.openCount, s.shownCount, s.moreCount]).toEqual([7, 3, 4]);
    expect(s.rows.map((r) => r.id)).toEqual([
      "7d4c60615b592486",
      "4a0eccb90854566c",
      "788911130f8c6658",
    ]);
    expect(s.rows[2]?.dueDateISO).toBe("");
    expect(moreForSubscribersText(s.moreCount)).toBe("+4 more open bids for subscribers.");
    expect(more(s.moreCount)).not.toBeNull();
  });

  it("a 1-of-1 page shows its row and no more line", () => {
    const s = getPageSample(countyPageKey("desoto"));
    expect([s.openCount, s.shownCount, s.moreCount]).toEqual([1, 1, 0]);
    expect(s.rows).toHaveLength(1);
    expect(more(s.moreCount)).toBeNull();
  });

  it("a page missing from the export has 0 open bids (no-bids text path)", () => {
    expect(hasPublicPage("leon")).toBe(false);
    expect(getPageSample(countyPageKey("leon"))).toEqual({
      rows: [],
      openCount: 0,
      shownCount: 0,
      moreCount: 0,
    });
    expect(getPageSample(countyTradePageKey("brevard", "painting")).openCount).toBe(0);
  });

  it("trade-only pages are available for the statewide trade view", () => {
    expect(tradesWithStatewideBids()).toHaveLength(7);
    expect(getPageSample(tradePageKey("roofing")).openCount).toBe(20);
  });

  it("county trade links and county list come from the export", () => {
    expect(tradesWithBidsIn("brevard").map((t) => t.slug).sort()).toEqual([
      "commercial-general-contracting",
      "sitework-heavy-civil",
    ]);
    expect(countiesWithBids()).toHaveLength(49);
  });
});

describe("count line grammar", () => {
  const u = "November 17, 2026, ET";
  it("uses singular bid for a count of 1", () => {
    expect(countLineText(1, u)).toBe("1 open bid listed as of November 17, 2026, ET.");
    expect(countLineText(1, u, "roofing")).toBe("1 open roofing bid as of November 17, 2026, ET.");
  });
  it("keeps plural for other counts", () => {
    expect(countLineText(2, u)).toBe("2 open bids listed as of November 17, 2026, ET.");
    expect(countLineText(7, u)).toBe("7 open bids listed as of November 17, 2026, ET.");
    expect(countLineText(20, u, "roofing")).toBe("20 open roofing bids as of November 17, 2026, ET.");
  });
  it("DeSoto (1 of 1) reads 1 open bid", () => {
    const s = getPageSample(countyPageKey("desoto"));
    expect(countLineText(s.openCount, u)).toBe("1 open bid listed as of November 17, 2026, ET.");
  });
});

describe("legal pages: More rev3.6 Daily/Weekly sections", () => {
  it("Terms 2.1 has daily/weekly and the switching sentence", () => {
    expect(TERMS_HTML).toContain("daily or weekly, at the same price");
    expect(TERMS_HTML).toContain("Switching doesn't change your price or billing date.");
    expect(TERMS_HTML).not.toContain("there's no lower-frequency option");
    expect(TERMS_HTML).not.toContain("past 7 days");
  });
  it("Privacy 4 has weekly delivery and no single schedule", () => {
    expect(PRIVACY_HTML).toContain("<strong>weekly</strong>, every Monday at around 7:30 AM Eastern Time");
    expect(PRIVACY_HTML).not.toContain("There's one delivery schedule for all plans.");
    expect(PRIVACY_HTML).toContain("Google LLC (Google Forms and Google Sheets)");
  });
  it("Refund 2 no longer says weekday digest", () => {
    expect(REFUND_HTML).toContain("Agencies decide when to post, and you still get your digest.");
    expect(REFUND_HTML).not.toContain("weekday digest");
  });
});

describe("LTB copy v5.3 + Home export record", () => {
  it("Home renders Bede's home record: 662 open, 3 shown, +659", () => {
    const s = getPageSample(HOME_PAGE_KEY);
    expect([s.openCount, s.shownCount, s.moreCount]).toEqual([662, 3, 659]);
    expect(s.rows.map((r) => r.agency)).toEqual([
      "City of Ocala",
      "Florida School for the Deaf and the Blind (FSDB)",
      "Lake County",
    ]);
    expect(s.rows[0]?.sourceUrl).toBe("https://florida.prorfx.com/Listings.aspx");
    expect(moreForSubscribersText(s.moreCount)).toBe("+659 more open bids for subscribers.");
  });

  it("no-bids text for county, county+trade and Home search", () => {
    expect(noOpenBidsText("Leon")).toBe(
      "No open bids are listed for Leon County right now. Get the free weekly sample, or check a nearby county.",
    );
    expect(noOpenBidsText("Brevard", "painting")).toBe(
      "No open painting bids are listed for Brevard County right now. Get the free weekly sample, or check a nearby county.",
    );
    expect(noOpenBidsText("Brevard", "Painting")).toContain("No open Painting bids are listed");
  });

  it("coverage and delivery lines are isolated constants", () => {
    expect(COVERAGE_LINE).toBe(
      "We cover Florida at launch, with public bids from agency sources we've cleared across the state. Some counties won't have open bids on a given day.",
    );
    expect(COVERAGE_LINE).not.toMatch(/67/);
    expect(DELIVERY_LINE).toMatch(/^Choose daily or weekly delivery at the same price\./);
  });
});

describe("LTB copy v5.4", () => {
  const home = readFileSync(new URL("../routes/index.tsx", import.meta.url), "utf8");
  const county = readFileSync(new URL("../routes/florida.$county.index.tsx", import.meta.url), "utf8");
  const trade = readFileSync(new URL("../routes/florida.$county.$trade.tsx", import.meta.url), "utf8");

  it("Home shows no open count; the more line is its only number", () => {
    expect(home).not.toMatch(/CountLine|countLineText|openCount/);
    expect(home).toContain("<MoreForSubscribers more={sample.moreCount} />");
  });

  it("Home panel line is v5.4 wording", () => {
    expect(HOME_PANEL_LINE).toBe(
      "Get open bids for your trades and your county or region in one daily or weekly email. Plans start at $39/mo.",
    );
  });

  it("same more line on Home, county, county+trade and statewide trade", () => {
    expect(home.match(/<MoreForSubscribers more=\{sample\.moreCount\} \/>/g)).toHaveLength(1);
    expect(county.match(/<MoreForSubscribers more=\{sample\.moreCount\} \/>/g)).toHaveLength(1);
    expect(trade.match(/<MoreForSubscribers more=\{sample\.moreCount\} \/>/g)).toHaveLength(2);
    for (const k of ["home", "brevard", "brevard/sitework-heavy-civil", "roofing"]) {
      const s = getPageSample(k);
      expect(s.moreCount).toBeGreaterThan(0);
      expect(moreForSubscribersText(s.moreCount)).toMatch(/^\+\d+ more open bids for subscribers\.$/);
    }
  });

  it("more line hidden when N is 0 or unknown", () => {
    expect(MoreForSubscribers({ more: 0 })).toBeNull();
    expect(MoreForSubscribers({})).toBeNull();
    expect(MoreForSubscribers({ more: Number.NaN })).toBeNull();
  });

  it("county search, all trades, no bids", () => {
    expect(noOpenBidsText("Leon")).toBe(
      "No open bids are listed for Leon County right now. Get the free weekly sample, or check a nearby county.",
    );
  });
});

describe("legal pages: More's public rev3.6 text (preview)", () => {
  const all = PRIVACY_HTML + TERMS_HTML + REFUND_HTML;
  it("has no internal notes or citations", () => {
    for (const bad of ["per Andrew", "relayed", "More's wording", "rev3"]) {
      expect(all).not.toContain(bad);
    }
  });
  it("keeps More's placeholders and both Last updated lines unfilled", () => {
    for (const h of [PRIVACY_HTML, TERMS_HTML, REFUND_HTML]) {
      expect(h).toContain("Last updated: [DATE OF PUBLICATION]");
      expect(h).toContain("[PLACEHOLDER: publish date]");
    }
    expect(PRIVACY_HTML).toContain("<strong>Last updated:</strong> [PLACEHOLDER: publish date]");
    expect(TERMS_HTML).toContain("<strong>Last updated:</strong> [PLACEHOLDER: publish date]");
  });
});

import { planCta as __planCta, PLANS as __PLANS } from "@/components/site/PricingCards";
describe("plan buttons (Andrew 5:46 PM Nov 17)", () => {
  it("use the approved Subscribe labels in preview", () => {
    const labels = __PLANS.map((p) => __planCta(p));
    expect(labels).toEqual(expect.arrayContaining([
      "Subscribe: County, $39/month",
      "Subscribe: Region, $89/month",
      "Subscribe: Statewide, $139/month",
    ]));
    expect(labels.join(" ")).not.toMatch(/waitlist/i);
  });
});


describe("More preview wording (Andrew 5:52 PM ET Nov 17)", () => {
  const BUTTON_HELPER =
    "Preview: checkout runs in Stripe's test mode, so nothing is charged and no subscription starts. Paid plans aren't open yet.";
  const PLANS_OPEN_SOON =
    "County $39, Region $89 and Statewide $139 per month, billed monthly. Plans renew automatically every month until you cancel. This site is a preview: checkout runs in Stripe's test mode, so nothing is charged and no subscription starts. Please don't enter real card or bank details. Paid plans aren't open yet.";
  const TERMS_42 =
    "4.2 <strong>Before paid plans open (preview).</strong> Until paid plans open, our site is a preview. The plan buttons lead to our sign-up step and then to a Stripe checkout running in test mode. <strong>A test checkout doesn't charge you, take real payment information or create a subscription.</strong> Please don't enter real card or bank details. You subscribe only by completing a live Stripe checkout after paid plans open. We don't offer founders' or other introductory discounts.";
  const SIGNUP_USE =
    "If you use our sign-up step: to set up your subscription and match your choices to your payment. If you don't finish checkout, we may send you one reminder to finish signing up (see section 6). During our preview, checkout runs in test mode, so using the sign-up step doesn't charge you or start a subscription.";
  const WAITLIST_USE =
    "If you join a waitlist, for example for a state we don't cover yet: to tell you when it opens. Joining a waitlist doesn't charge you or sign you up for a paid plan.";
  const COOKIES =
    "<p><strong>Cookies.</strong> Our own site sets no cookies. Our sign-up step and other forms on our pages send your entries straight to Google without loading Google cookies or scripts on our pages. When you use Stripe's checkout page (opened after our sign-up step), Stripe sets cookies it needs for payments and fraud prevention (https://stripe.com/cookie-settings). You can block or delete cookies in your browser, but checkout may not work without Stripe's necessary cookies.</p>";
  const CUT_WAITLIST_FORM =
    "The Florida plan waitlist form opens on Google's own site, where Google's privacy policy and cookies apply (https://policies.google.com/privacy).";
  const FAQ_COMBINED =
    "County $39/month, Region $89/month, Statewide $139/month. " + PLANS_OPEN_SOON;

  it("uses More's preview strings verbatim", () => {
    expect(STATE_A_BUTTON_HELPER).toBe(BUTTON_HELPER);
    expect(STATE_A_PLANS_OPEN_SOON).toBe(PLANS_OPEN_SOON);
    expect(TERMS_HTML).toContain(TERMS_42);
    expect(PRIVACY_HTML).toContain("<li>" + SIGNUP_USE + "</li>");
    expect(PRIVACY_HTML).toContain("<li>" + WAITLIST_USE + "</li>");
    expect(PRIVACY_HTML).toContain(COOKIES);
  });

  it("removes the old waitlist wording from those spots and cuts the Google-hosted waitlist cookie sentence", () => {
    expect(STATE_A_BUTTON_HELPER).not.toContain("Join the waitlist");
    expect(STATE_A_BUTTON_HELPER).not.toContain("Subscriptions open soon");
    expect(STATE_A_PLANS_OPEN_SOON).not.toContain("Plans open soon:");
    expect(STATE_A_PLANS_OPEN_SOON).not.toContain("Join the waitlist");
    expect(TERMS_HTML).not.toContain("the plan buttons on our site lead to a waitlist");
    expect(TERMS_HTML).not.toContain("Joining the waitlist is free, takes no payment information, and doesn't create a subscription.");
    expect(TERMS_HTML).not.toContain("We'll email waitlist members when plans open.");
    expect(TERMS_HTML).not.toContain("4.2 <strong>Before paid plans open.</strong> Until paid plans open, the plan buttons on our site lead to a waitlist.");
    expect(PRIVACY_HTML).not.toContain(
      "If you join the waitlist: to tell you when paid plans open. Joining the waitlist doesn't charge you or sign you up for a paid plan.",
    );
    expect(PRIVACY_HTML).not.toContain(CUT_WAITLIST_FORM);
    expect(PRIVACY_HTML).not.toContain("[PLACEHOLDER: Vincent to confirm that the background post of preference picks to Google loads no Google scripts or cookies; delete this note once confirmed]");
  });

  it("keeps the short PreviewCheckoutNotice under each plan button alongside the new State A helper", () => {
    const cards = readFileSync(new URL("../components/site/PricingCards.tsx", import.meta.url), "utf8");
    expect(cards).toContain('variant="short"');
    expect(cards).toContain("{STATE_A_BUTTON_HELPER}");
    expect(cards).toContain("{STATE_B_BUTTON_HELPER}");
    expect(cards).toContain("SITE.checkoutLive");
  });

  it("leaves the FAQ price sentence in place, so the combined How much does it cost? answer is verbatim", () => {
    const faq = readFileSync(new URL("../routes/faq.tsx", import.meta.url), "utf8");
    expect(faq).toContain("County $39/month, Region $89/month, Statewide $139/month.");
    expect(faq).toContain('!SITE.checkoutLive ? " " + STATE_A_PLANS_OPEN_SOON : ""');
    expect(FAQ_COMBINED).toBe(
      "County $39/month, Region $89/month, Statewide $139/month. County $39, Region $89 and Statewide $139 per month, billed monthly. Plans renew automatically every month until you cancel. This site is a preview: checkout runs in Stripe's test mode, so nothing is charged and no subscription starts. Please don't enter real card or bank details. Paid plans aren't open yet.",
    );
  });
});
