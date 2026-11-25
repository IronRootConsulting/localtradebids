export const SITE = {
  name: "LocalTradeBids",
  url: "https://localtradebids.com",
  // go-live branch: draft off removes the DRAFT banner and the site-wide noindex.
  draft: false,
  contactEmail: "support@localtradebids.com",
  operator: "IronRoot Consulting LLC",
  address: "5052 Pope John Paul II Blvd, Suite 108-23, Ave Maria, FL 34142",
  waitlistUrl:
    "https://docs.google.com/forms/d/e/1FAIpQLScRsTCBMK718Mqs-U_QHfmgHh6zLhuGg6v-riqU-4Hqy8GtTw/viewform",
  // The old preview-only plan signup Google Form (Bernard option B) is unused and
  // removed on the go-live branch so its id never ships in the live build.
  // Stripe customer portal login URL. Empty: /manage/ shows a placeholder box and
  // the footer/thank-you "Manage billing" links go to /manage/. Bernard sends the
  // live URL; set it here and every Manage billing link points straight at it.
  // Live Stripe customer portal (config bpc_1UcwG7Rz7lWavGOpcKSbDbxB), created on
  // Andrew's approval 6:57 PM ET Nov 17, 2026 (via Bernard).
  billingPortalUrl: "https://billing.stripe.com/p/login/eVqdRbctF1OJ4jma5N0kE00",
  // Cloudflare Web Analytics (cookieless JS beacon; Andrew's token, sent by Bernard
  // 6:52 PM ET Nov 17, 2026; public site token, not a secret). Empty = no beacon.
  cloudflareBeaconToken: "e7f6d1677ea94e93b250059483f5bdc6",
  // Pages that never load the beacon (signup step, post-checkout page, and the
  // unsubscribe page, whose URL carries the unsubscribe token).
  cloudflareBeaconExcludedPaths: ["/signup", "/thank-you", "/unsubscribe"],
  // Sample-list unsubscribe endpoint: the Google Apps Script web app /exec URL that
  // Bede deploys (contract: /workspace/vincent/ltb-unsub-contract.md). Not a secret.
  // [PLACEHOLDER: Apps Script /exec URL, set at deploy] Empty = /unsubscribe/ shows
  // the email-us fallback instead of the confirm button.
  unsubscribeEndpoint: "",
  // go-live branch (held; flips only on Andrew's own go). checkoutLive=true:
  // plan buttons still go to the on-site preferences step (/signup/), which
  // posts picks to LIVE_PICKS_FORM (src/lib/submitPicks.ts) and then sends the
  // buyer to the LIVE Payment Link below with ?client_reference_id=&prefilled_email=.
  checkoutLive: true,
  // LIVE Stripe Payment Links. The live IDs do NOT map to plans the same way as
  // the test IDs. Mapping per Bernard/Andrew, Nov 17, 2026:
  // live eVqd…00 = County $39/mo; live 14A14p…01 = Region $89/mo; live 3cI00l…02 = Statewide $139/mo.
  paymentLinks: {
    county: "https://buy.stripe.com/eVqdRbctF1OJ4jma5N0kE00",
    region: "https://buy.stripe.com/14A14p51d50V3fi0vd0kE01",
    statewide: "https://buy.stripe.com/3cI00l1P11OJ8zCb9R0kE02",
  },
  // Preview-only Stripe test Payment Links: emptied on the go-live branch so no
  // test-mode link ships in the live build (main keeps the test links).
  testPaymentLinks: {
    county: "",
    region: "",
    statewide: "",
  },
  consentLogEnabled: true,
  consentLogUrl:
    "https://docs.google.com/forms/d/e/1FAIpQLSftJ3Rz2pG1KOgAlse4IF8XRLQSaZ8MjAm4jHj4tfqBMFA77Q/" +
    "formResponse",
  consentLogEntries: {
    email: "entry.1815272170",
    marketingOptIn: "entry.539084169",
    checkboxText: "entry.1958210437",
    textVersion: "entry.1376231362",
    formName: "entry.692823903",
    pageUrl: "entry.1057969194",
    // Added Nov 17, 2026 (free weekly sample, Andrew 9:50 PM ET via Bernard; format agreed with Bede).
    state: "entry.453038927",
    county: "entry.282808761",
    trades: "entry.929925252",
    schema: "entry.151158185",
  },
};

export type PlanKey = keyof typeof SITE.paymentLinks;

export type ConsentLogInput = {
  email: string;
  marketingChecked: boolean;
  checkboxText: string;
  textVersion: string;
  formName: string;
  pageUrl: string;
  /** USPS code: always "FL" on sample-band rows; the chosen state on waitlist rows. */
  state?: string;
  /** County slug or "any" (sample-band); blank on waitlist rows. */
  county?: string;
  /** One trade slug or "all" (sample-band); blank on waitlist rows. */
  trades?: string;
};

export const CONSENT_LOG_SCHEMA = "v2";

/** Sample-band values per Bede: blank dropdowns become the "all"/"any" sentinels. */
export function sampleFilters(trade: string, county: string) {
  return { state: "FL", trades: trade || "all", county: county || "any" };
}

export function buildConsentLogPayload(input: ConsentLogInput): URLSearchParams {
  const e = SITE.consentLogEntries;
  const body = new URLSearchParams();
  body.set(e.email, input.email);
  body.set(e.marketingOptIn, input.marketingChecked ? "checked" : "unchecked");
  body.set(e.checkboxText, input.checkboxText);
  body.set(e.textVersion, input.textVersion);
  body.set(e.formName, input.formName);
  body.set(e.pageUrl, input.pageUrl);
  body.set(e.state, input.state ?? "");
  body.set(e.county, input.county ?? "");
  body.set(e.trades, input.trades ?? "");
  body.set(e.schema, CONSENT_LOG_SCHEMA);
  return body;
}

export function submitConsentLog(input: ConsentLogInput): void {
  if (!SITE.consentLogEnabled) return;
  void fetch(SITE.consentLogUrl, {
    method: "POST",
    mode: "no-cors",
    credentials: "omit",
    body: buildConsentLogPayload(input),
  });
}
