import { describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import { SITE } from "@/config/site";
import { planHref, preferencesHref, PLANS } from "@/components/site/PricingCards";
import { SIGNUP_COPY, fillCopy } from "@/data/signupCopy";
import { STATES_FILE, defaultStateCode, regionsForState, countiesForState } from "@/data/states";
import { TRADES } from "@/data/ltb";
import { parseSignupPrefill } from "@/lib/signupPrefill";
import {
  PICKS_FORM,
  PICKS_SCHEMA,
  buildCheckoutUrl,
  buildPicksPayload,
  generateRef,
  isValidEmail,
  isValidRef,
  joinTrades,
  normalizeEmail,
  normalizeName,
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

  it("buildCheckoutUrl appends prefilled_email when an email is provided", () => {
    const ref = "ltb_abc123xyz789";
    const url = buildCheckoutUrl("county", ref, "Name@Company.com");
    expect(url).toContain(`client_reference_id=${ref}`);
    expect(url).toContain("prefilled_email=Name%40Company.com");
    expect(buildCheckoutUrl("county", ref)).not.toContain("prefilled_email");
  });
});

describe("preferences step: contact normalization", () => {
  it("trims name and business, and lowercases email", () => {
    expect(normalizeName("  Jane Doe  ")).toBe("Jane Doe");
    expect(normalizeEmail("  Name@Company.com  ")).toBe("name@company.com");
  });

  it("accepts a basic email and rejects incomplete ones", () => {
    expect(isValidEmail("name@company.com")).toBe(true);
    expect(isValidEmail("  Name@Company.com  ")).toBe(true);
    expect(isValidEmail("")).toBe(false);
    expect(isValidEmail("name@")).toBe(false);
    expect(isValidEmail("name@company")).toBe(false);
    expect(isValidEmail("not-an-email")).toBe(false);
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
    page_url: "https://example.test/signup/?plan=county",
    ts: "2026-11-17T16:00:00.000Z",
    name: "Ada Lovelace",
    business: "Analytical Engines",
    email: "ada@engines.example",
  };

  it("buildPicksPayload uses schema v2, contact fields, and the live entry ids", () => {
    const body = buildPicksPayload(picks);
    expect(body.get(PICKS_FORM.entries.ref)).toBe(picks.ref);
    expect(body.get(PICKS_FORM.entries.schema)).toBe("v2");
    expect(body.get(PICKS_FORM.entries.plan)).toBe("county");
    expect(body.get(PICKS_FORM.entries.state)).toBe("FL");
    expect(body.get(PICKS_FORM.entries.area)).toBe("miami-dade");
    expect(body.get(PICKS_FORM.entries.trades)).toBe("roofing,electrical");
    expect(body.get(PICKS_FORM.entries.delivery)).toBe("daily");
    expect(body.get(PICKS_FORM.entries.page_url)).toBe(picks.page_url);
    expect(body.get(PICKS_FORM.entries.ts)).toBe(picks.ts);
    expect(body.get(PICKS_FORM.entries.name)).toBe("Ada Lovelace");
    expect(body.get(PICKS_FORM.entries.business)).toBe("Analytical Engines");
    expect(body.get(PICKS_FORM.entries.email)).toBe("ada@engines.example");
    expect(PICKS_FORM.entries.name).toBe("entry.241923616");
    expect(PICKS_FORM.entries.business).toBe("entry.1884443749");
    expect(PICKS_FORM.entries.email).toBe("entry.537479107");
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
    expect(init.referrerPolicy).toBe("no-referrer");
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
      "Tell us who you are, then pick your coverage, your trades, and how often you want your email.",
    );
    expect(SIGNUP_COPY.detailsHeading).toBe("Your details");
    expect(SIGNUP_COPY.nameLabel).toBe("Name");
    expect(SIGNUP_COPY.namePlaceholder).toBe("First and last name");
    expect(SIGNUP_COPY.businessLabel).toBe("Business name");
    expect(SIGNUP_COPY.businessHelper).toBe("The company you bid as.");
    expect(SIGNUP_COPY.emailLabel).toBe("Email");
    expect(SIGNUP_COPY.emailHelper).toBe(
      "Your bid alerts go to this address. We'll fill it in for you at checkout.",
    );
    expect(SIGNUP_COPY.errorName).toBe("Enter your name to continue.");
    expect(SIGNUP_COPY.errorBusiness).toBe("Enter your business name to continue.");
    expect(SIGNUP_COPY.errorEmail).toBe(
      "Enter a valid email address, like name@company.com.",
    );
    expect(SIGNUP_COPY.detailsNotice).toBe(
      "We use these details to set up your subscription and send your bid emails. If you don't finish checkout, we may send you one reminder, and we delete your details after 90 days. See our Privacy Policy.",
    );
    expect(SIGNUP_COPY.detailsNoticeLink).toBe("Privacy Policy");
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
    expect(form).toContain('variant="short"');
    expect(form).toContain("preview-notice-compact");
    expect(form).not.toContain('variant="long"');
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

describe("preferences step: resume prefill from the URL", () => {
  it("applies a full prefill of plan, state, area, trades, and delivery", () => {
    const full = parseSignupPrefill({
      plan: "county",
      state: "FL",
      area: "collier",
      trades: "roofing,electrical",
      delivery: "daily",
    });
    expect(full).toEqual({
      plan: "county",
      state: "FL",
      county: "collier",
      region: "",
      trades: ["roofing", "electrical"],
      delivery: "daily",
    });

    const region = parseSignupPrefill(
      new URLSearchParams("plan=region&state=FL&area=fl-southwest&trades=sitework-heavy-civil&delivery=weekly"),
    );
    expect(region).toEqual({
      plan: "region",
      state: "FL",
      county: "",
      region: "fl-southwest",
      trades: ["sitework-heavy-civil"],
      delivery: "weekly",
    });
  });

  it("applies a partial prefill and leaves the rest empty or default", () => {
    const partial = parseSignupPrefill({ plan: "statewide", trades: "roofing,painting" });
    expect(partial.plan).toBe("statewide");
    expect(partial.state).toBe("");
    expect(partial.county).toBe("");
    expect(partial.region).toBe("");
    expect(partial.trades).toEqual(["roofing", "painting"]);
    expect(partial.delivery).toBe("");
  });

  it("ignores unknown or invalid values quietly and keeps the rest", () => {
    const mixed = parseSignupPrefill({
      plan: "county",
      state: "ZZ",
      area: "not-a-county",
      trades: "roofing,not-a-trade,electrical,roofing",
      delivery: "yearly",
    });
    expect(mixed.plan).toBe("county");
    expect(mixed.state).toBe("");
    expect(mixed.county).toBe("");
    expect(mixed.region).toBe("");
    expect(mixed.trades).toEqual(["roofing", "electrical"]);
    expect(mixed.delivery).toBe("");

    const mismatch = parseSignupPrefill({ plan: "region", area: "collier", delivery: "daily" });
    expect(mismatch.plan).toBe("region");
    expect(mismatch.region).toBe("");
    expect(mismatch.county).toBe("");
    expect(mismatch.delivery).toBe("daily");

    const badPlan = parseSignupPrefill({ plan: "national", area: "collier", trades: "roofing" });
    expect(badPlan.plan).toBe("statewide");
    expect(badPlan.county).toBe("");
    expect(badPlan.trades).toEqual(["roofing"]);

    const missing = parseSignupPrefill({});
    expect(missing.plan).toBe("statewide");
    expect(missing.county).toBe("");
    expect(missing.region).toBe("");
    expect(missing.delivery).toBe("");
  });

  it("never reads name, business, or email from the URL", () => {
    const sneaky = parseSignupPrefill({
      plan: "county",
      area: "collier",
      name: "From the URL",
      business: "URL Construction",
      email: "stolen@example.com",
      trades: "roofing",
      delivery: "weekly",
    });
    expect(sneaky).toEqual({
      plan: "county",
      state: "",
      county: "collier",
      region: "",
      trades: ["roofing"],
      delivery: "weekly",
    });
    expect(JSON.stringify(sneaky)).not.toMatch(/stolen@example\.com|From the URL|URL Construction/);
    const src = readFileSync(new URL("../lib/signupPrefill.ts", import.meta.url), "utf8");
    expect(src).not.toMatch(/readParam\(search,\s*["']name["']\)/);
    expect(src).not.toMatch(/readParam\(search,\s*["']business["']\)/);
    expect(src).not.toMatch(/readParam\(search,\s*["']email["']\)/);
    const form = readFileSync(new URL("../components/site/PreferencesForm.tsx", import.meta.url), "utf8");
    expect(form).toContain('useState("")');
    expect(form).toContain("parseSignupPrefill");
  });
});

describe("privacy policy: unfinished sign-ups and Google row", () => {
  const SUBSCRIBE_BULLET =
    "- When you subscribe: before checkout, our site asks for your name, business name and email, plus your coverage area, trades and delivery schedule, and gives your answers a random reference number. We send that reference and your email to Stripe when you go to checkout, so we can match your answers to your payment. Your email is included in the checkout link, so it may appear in your browser history. At Stripe checkout you enter your billing details, and Stripe may also collect your name and email. If you don't finish checkout, we keep what you entered for 90 days and then delete it. During that time we may send you one email reminding you to finish signing up, with a link to unsubscribe. We don't send any other marketing to unfinished sign-ups.";
  const GOOGLE_TD =
    "Receives the sign-up and preference forms on our site and stores the responses in a private spreadsheet only we can access. Responses include your name, business name and email address, your email choices, a record of any consent you gave, and the subscription choices you make before checkout (coverage area, trades and delivery schedule) with their reference number. Google also receives your IP address and browser information when a form is sent. https://policies.google.com/privacy";

  it("includes More's section 1 subscribe bullet and section 3 Google row verbatim", async () => {
    const { PRIVACY_HTML } = await import("@/routes/privacy");
    expect(PRIVACY_HTML).toContain(SUBSCRIBE_BULLET);
    expect(PRIVACY_HTML).toContain(GOOGLE_TD);
    const privacy = readFileSync(new URL("../routes/privacy.tsx", import.meta.url), "utf8");
    expect(privacy).toContain(SUBSCRIBE_BULLET);
    expect(privacy).toContain(GOOGLE_TD);
    expect(privacy).toContain(
      "Unfinished sign-ups (details entered on our sign-up step without completing checkout): 90 days, then deleted. We keep only your email address, the date of any reminder we sent and any unsubscribe request, so we never send a second reminder or email you after you've opted out.",
    );
  });
});

describe("signup page: referrer policy in the built HTML", () => {
  it("includes <meta name=\"referrer\" content=\"no-referrer\"> in the prerendered signup page", () => {
    const html = readFileSync(new URL("../../.output/public/signup/index.html", import.meta.url), "utf8");
    expect(html).toMatch(/<meta\s+name="referrer"\s+content="no-referrer"\s*\/?>/i);
  });
});

describe("preferences step: no sessionStorage stash", () => {
  it("does not write picks to sessionStorage", () => {
    const src = readFileSync(new URL("../lib/submitPicks.ts", import.meta.url), "utf8");
    const form = readFileSync(new URL("../components/site/PreferencesForm.tsx", import.meta.url), "utf8");
    expect(src).not.toContain("stashPicks");
    expect(src).not.toContain("PICKS_STORAGE_KEY");
    expect(src).not.toContain("sessionStorage");
    expect(form).not.toContain("stashPicks");
    expect(form).not.toContain("sessionStorage");
  });
});


describe("home hero CTA wiring", () => {
  it("keeps the home headline and sample link unchanged", () => {
    const src = readFileSync(new URL("../routes/index.tsx", import.meta.url), "utf8");
    expect(src).toContain("<HomeHeroCta />");
    expect(src).toContain("Government bids for your trade, in your county.");
    expect(src).toContain('href="#sample-band"');
    expect(src).toContain("Get the free weekly sample");
    expect(src).not.toContain('href="#search" className="btn-primary"');
  });
});

describe("signup prerender defaults to Statewide", () => {
  it("checks the statewide coverage radio in the prerendered /signup/ HTML", () => {
    const html = readFileSync(new URL("../../.output/public/signup/index.html", import.meta.url), "utf8");
    expect(html).toMatch(/id="coverage-statewide"[^>]*checked/);
    expect(html).not.toMatch(/id="coverage-county"[^>]*checked/);
    expect(html).not.toMatch(/id="coverage-region"[^>]*checked/);
  });
});
