import { describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import { SITE } from "@/config/site";
import { planHref, preferencesHref, PLANS } from "@/components/site/PricingCards";
import { SIGNUP_COPY, fillCopy } from "@/data/signupCopy";
import { STATES_FILE, defaultStateCode, regionsForState, countiesForState } from "@/data/states";
import { TRADES } from "@/data/ltb";
import {
  PICKS_FORM,
  PICKS_SCHEMA,
  buildCheckoutUrl,
  buildPicksPayload,
  generateRef,
  isValidRef,
  joinTrades,
  submitPicks,
  type Picks,
} from "@/lib/submitPicks";

const FL_VARS = { stateName: "Florida", price: 139 };

describe("preferences step: ref and checkout URL", () => {
  it("generateRef returns ltb_ plus 12 base36 chars from getRandomValues", () => {
    const bytes = Uint8Array.from({ length: 12 }, (_, i) => i);
    const ref = generateRef((arr) => {
      arr.set(bytes);
      return arr;
    });
    expect(ref).toMatch(/^ltb_[0-9a-z]{12}$/);
    expect(isValidRef(ref)).toBe(true);
    expect(ref.startsWith("ltb_")).toBe(true);
    expect(ref).toHaveLength(16);
  });

  it("generateRef is unique across many draws", () => {
    const seen = new Set<string>();
    for (let i = 0; i < 50; i++) seen.add(generateRef());
    expect(seen.size).toBe(50);
  });

  it("buildCheckoutUrl appends client_reference_id to the TEST link only", () => {
    const ref = "ltb_abc123xyz789";
    const url = buildCheckoutUrl("county", ref);
    expect(url).toBe(
      `${SITE.testPaymentLinks.county}?client_reference_id=${ref}`,
    );
    expect(url).toContain("buy.stripe.com/test_");
    expect(url).not.toMatch(/buy\.stripe\.com\/(?!test_)/);
    expect(buildCheckoutUrl("county", ref)).toContain("test_3cI00l");
    expect(buildCheckoutUrl("region", ref)).toContain("test_14A14p");
    expect(buildCheckoutUrl("statewide", ref)).toContain("test_eVqd");
  });
});

describe("preferences step: picks payload and submit", () => {
  const picks: Picks = {
    ref: "ltb_abcdefghijkl",
    schema: PICKS_SCHEMA,
    plan: "county",
    state: "FL",
    area: "miami-dade",
    trades: joinTrades(["roofing", "electrical"]),
    delivery: "daily",
    page_url: "https://example.test/localtradebids/signup/?plan=county",
    ts: "2026-11-17T16:00:00.000Z",
  };

  it("buildPicksPayload uses Bede's v1 fields and the live entry ids", () => {
    const body = buildPicksPayload(picks);
    expect(body.get(PICKS_FORM.entries.ref)).toBe(picks.ref);
    expect(body.get(PICKS_FORM.entries.schema)).toBe("v1");
    expect(body.get(PICKS_FORM.entries.plan)).toBe("county");
    expect(body.get(PICKS_FORM.entries.state)).toBe("FL");
    expect(body.get(PICKS_FORM.entries.area)).toBe("miami-dade");
    expect(body.get(PICKS_FORM.entries.trades)).toBe("roofing,electrical");
    expect(body.get(PICKS_FORM.entries.delivery)).toBe("daily");
    expect(body.get(PICKS_FORM.entries.page_url)).toBe(picks.page_url);
    expect(body.get(PICKS_FORM.entries.ts)).toBe(picks.ts);
  });

  it("maps region area to region_id and statewide area to blank", () => {
    const region = buildPicksPayload({ ...picks, plan: "region", area: "fl-southwest" });
    expect(region.get(PICKS_FORM.entries.area)).toBe("fl-southwest");
    const state = buildPicksPayload({ ...picks, plan: "statewide", area: "" });
    expect(state.get(PICKS_FORM.entries.area)).toBe("");
  });

  it("skips the POST when the form URL is empty", async () => {
    const fetchImpl = vi.fn();
    await submitPicks(picks, { form: { formResponseUrl: "", entries: {} }, fetchImpl });
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("POSTs form-urlencoded no-cors and does not wait longer than the timeout", async () => {
    const fetchImpl = vi.fn(() => new Promise<Response>(() => {}));
    const started = Date.now();
    await submitPicks(picks, { fetchImpl: fetchImpl as unknown as typeof fetch, timeoutMs: 20 });
    expect(Date.now() - started).toBeLessThan(500);
    expect(fetchImpl).toHaveBeenCalledTimes(1);
    const [url, init] = fetchImpl.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe(PICKS_FORM.formResponseUrl);
    expect(init.method).toBe("POST");
    expect(init.mode).toBe("no-cors");
    expect(String(init.headers && (init.headers as Record<string, string>)["Content-Type"])).toBe(
      "application/x-www-form-urlencoded",
    );
    expect(init.body).toBeInstanceOf(URLSearchParams);
  });
});

describe("preferences step: plan CTAs and live checkout stay off", () => {
  it("keeps checkoutLive false and live payment link slots empty", () => {
    expect(SITE.checkoutLive).toBe(false);
    expect(SITE.paymentLinks.county).toBe("");
    expect(SITE.paymentLinks.region).toBe("");
    expect(SITE.paymentLinks.statewide).toBe("");
  });

  it("points plan cards at the on-site preferences step, not the Google Form", () => {
    expect(planHref("county")).toBe(preferencesHref("county"));
    expect(planHref("county")).toContain("signup/?plan=county");
    expect(planHref("region")).toContain("signup/?plan=region");
    expect(planHref("statewide")).toContain("signup/?plan=statewide");
    expect(planHref("county")).not.toContain("docs.google.com");
    expect(SITE.planSignupUrl).toContain("docs.google.com/forms");
  });

  it("test Payment Links are test-mode only", () => {
    for (const key of ["county", "region", "statewide"] as const) {
      expect(SITE.testPaymentLinks[key]).toMatch(/^https:\/\/buy\.stripe\.com\/test_/);
    }
  });
});

describe("preferences step: Ignatius copy and Bede data", () => {
  it("fills Florida templates byte-identical to the approved copy", () => {
    expect(fillCopy(SIGNUP_COPY.stateHelper, FL_VARS)).toBe("Florida only at launch.");
    expect(fillCopy(SIGNUP_COPY.statewideNote, FL_VARS)).toBe(
      "Your plan covers all of Florida, so there's no area to pick.",
    );
    expect(fillCopy(SIGNUP_COPY.coverageStatewide, FL_VARS)).toBe(
      "Statewide, all of Florida, $139/mo",
    );
    expect(fillCopy(SIGNUP_COPY.coverageRegion, { stateName: "Florida", price: 89 })).toBe(
      "Region, a group of neighboring counties, $89/mo",
    );
    expect(fillCopy(SIGNUP_COPY.coverageCounty, { stateName: "Florida", price: 39 })).toBe(
      "County, one county, $39/mo",
    );
    expect(SIGNUP_COPY.heading).toBe("Set up your bid alerts");
    expect(SIGNUP_COPY.intro).toBe(
      "Pick your coverage, your trades, and how often you want your email.",
    );
    expect(SIGNUP_COPY.tradesSelectAll).toBe("Select all seven trades");
    expect(SIGNUP_COPY.errorDelivery).toBe(
      "Choose daily or weekly to continue.",
    );
  });

  it("uses plan config prices that match the coverage labels", () => {
    expect(PLANS.map((p) => [p.key, p.price])).toEqual([
      ["county", 39],
      ["region", 89],
      ["statewide", 139],
    ]);
  });

  it("has exactly seven trades, matching the select-all copy", () => {
    expect(TRADES).toHaveLength(7);
  });

  it("loads Bede states.json: FL enabled, 10 regions, 67 counties", () => {
    expect(STATES_FILE.schema).toBe("v1");
    expect(defaultStateCode()).toBe("FL");
    expect(regionsForState("FL")).toHaveLength(10);
    expect(countiesForState("FL")).toHaveLength(67);
    expect(regionsForState("FL").map((r) => r.id).sort()).toEqual([
      "fl-apalachee",
      "fl-central",
      "fl-east-central",
      "fl-emerald-coast",
      "fl-north-central",
      "fl-northeast",
      "fl-south",
      "fl-southwest",
      "fl-tampa-bay",
      "fl-treasure-coast",
    ]);
    expect(countiesForState("FL").find((c) => c.slug === "miami-dade")?.regionId).toBe("fl-south");
    expect(countiesForState("FL").find((c) => c.slug === "st-johns")?.regionId).toBe("fl-northeast");
    expect(countiesForState("FL").find((c) => c.slug === "collier")?.regionId).toBe("fl-southwest");
  });
});

describe("preferences step: delivery starts unselected", () => {
  it("PreferencesForm does not preselect daily or weekly", () => {
    const src = readFileSync(new URL("../components/site/PreferencesForm.tsx", import.meta.url), "utf8");
    expect(src).toContain('useState<DeliveryKey | "">("")');
    expect(src).not.toMatch(/useState<DeliveryKey>\("daily"\)/);
    expect(SIGNUP_COPY.errorDelivery).toBe("Choose daily or weekly to continue.");
  });
});

describe("preferences step: preview checkout notice", () => {
  it("uses Ignatius/More #17 preview notices only while checkout is off", () => {
    const copySrc = readFileSync(new URL("../data/signupCopy.ts", import.meta.url), "utf8");
    expect(copySrc).not.toContain("TODO-IGNATIUS");
    expect(copySrc).toContain("Remove both in the same change that sets checkoutLive to true");
    expect(SIGNUP_COPY.previewCheckoutShort).toBe(
      "Preview only: test checkout. No charge, and no subscription starts.",
    );
    expect(SIGNUP_COPY.previewCheckoutLong).toBe(
      "This is a preview. Checkout runs in Stripe's test mode, so nothing is charged and no subscription starts. Please don't enter real card or bank details; use Stripe's test card instead. Paid plans aren't open yet.",
    );
    expect(SITE.checkoutLive).toBe(false);
    const notice = readFileSync(new URL("../components/site/PreviewCheckoutNotice.tsx", import.meta.url), "utf8");
    expect(notice).toContain("if (SITE.checkoutLive) return null");
    expect(notice).toContain("Remove in the same change that sets checkoutLive to true");
    const cards = readFileSync(new URL("../components/site/PricingCards.tsx", import.meta.url), "utf8");
    expect(cards).toContain('variant="short"');
    const signup = readFileSync(new URL("../routes/signup.tsx", import.meta.url), "utf8");
    expect(signup).toContain('variant="long"');
    const form = readFileSync(new URL("../components/site/PreferencesForm.tsx", import.meta.url), "utf8");
    expect(form).toContain('variant="long"');
  });
});

describe("canonical, og, and sitemap URLs", () => {
  it("use https://localtradebids.com without a /localtradebids/ path prefix", () => {
    expect(SITE.url).toBe("https://localtradebids.com");
    expect(new URL(SITE.url).pathname).toBe("/");
    const sitemap = readFileSync(new URL("../../public/sitemap.xml", import.meta.url), "utf8");
    expect(sitemap).toContain("https://localtradebids.com/pricing");
    expect(sitemap).not.toContain("localtradebids.com/localtradebids");
    const seo = readFileSync(new URL("../lib/seo.ts", import.meta.url), "utf8");
    expect(seo).toContain("const url = SITE.url + path");
    expect(seo).toContain('property: "og:url"');
    expect(seo).toContain('rel: "canonical"');
  });
});
