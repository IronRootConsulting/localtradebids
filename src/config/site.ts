export const SITE = {
  name: "LocalTradeBids",
  url: "https://localtradebids.com",
  draft: true,
  contactEmail: "support@localtradebids.com",
  operator: "IronRoot Consulting LLC",
  address: "5052 Pope John Paul II Blvd, Suite 108-23, Ave Maria, FL 34142",
  waitlistUrl:
    "https://docs.google.com/forms/d/e/1FAIpQLScRsTCBMK718Mqs-U_QHfmgHh6zLhuGg6v-riqU-4Hqy8GtTw/viewform",
  // Preview-only plan signup form (Bernard option B, Nov 17, 2026). Private to Andrew.
  // The live waitlist form above is unchanged; switching live is a launch step.
  planSignupUrl:
    "https://docs.google.com/forms/d/e/1FAIpQLSc9QoRjor-T3Z0662TWX04YsWhZWIAvoErqVtofDYx9jXWeIA/" +
    "viewform",
  planSignupPlanEntry: "entry.1289881317",
  planSignupPlanValues: {
    county: "County ($39/mo)",
    region: "Region ($89/mo)",
    statewide: "Statewide ($139/mo)",
  },
  billingPortalUrl: "",
  // checkoutLive=false: plan buttons go to waitlistUrl (Google Form).
  // Set true and fill paymentLinks after Andrew approves Stripe and the name filing.
  checkoutLive: false,
  paymentLinks: {
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
};

export function buildConsentLogPayload(input: ConsentLogInput): URLSearchParams {
  const e = SITE.consentLogEntries;
  const body = new URLSearchParams();
  body.set(e.email, input.email);
  body.set(e.marketingOptIn, input.marketingChecked ? "checked" : "unchecked");
  body.set(e.checkboxText, input.checkboxText);
  body.set(e.textVersion, input.textVersion);
  body.set(e.formName, input.formName);
  body.set(e.pageUrl, input.pageUrl);
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
