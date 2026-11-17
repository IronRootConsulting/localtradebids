import { SITE, type PlanKey } from "@/config/site";

export const PICKS_SCHEMA = "v2" as const;
export const FIELD_MAX = 200;
export const SUBMIT_PICKS_TIMEOUT_MS = 1500;
export const REF_PREFIX = "ltb_";
export const REF_LENGTH = 12;

/**
 * ===================== LIVE SIGNUP FORM (go-live) =====================
 * The ONE place for the live preferences Google Form: its formResponse URL and
 * all 12 entry ids (Nov 17, 2026; entry ids match the preview form's).
 * The test "go-live posts only to the LIVE responder" checks this block, and
 * that the preview form id never appears in source or the built site.
 * Never put the preview form here.
 * =====================================================================
 */
export const LIVE_FORM_ID = "1FAIpQLSfGpq5_JW6dvdp3gZDGPHH_suwkm4Q25HoVVzcxg629I_WXFA";

export const LIVE_PICKS_FORM = {
  formResponseUrl: `https://docs.google.com/forms/d/e/${LIVE_FORM_ID}/formResponse`,
  entries: {
    ref: "entry.2014708544",
    schema: "entry.1909228968",
    plan: "entry.1219267651",
    state: "entry.1725167983",
    area: "entry.848654876",
    trades: "entry.2076805814",
    delivery: "entry.994699508",
    page_url: "entry.1112194196",
    ts: "entry.774732596",
    name: "entry.241923616",
    business: "entry.1884443749",
    email: "entry.537479107",
  },
} as const;

/** Google Form that receives preference picks (the live form on this branch). */
export const PICKS_FORM = LIVE_PICKS_FORM;

export type DeliveryKey = "daily" | "weekly";

export type Picks = {
  ref: string;
  schema: typeof PICKS_SCHEMA;
  plan: PlanKey;
  state: string;
  area: string;
  trades: string;
  delivery: DeliveryKey;
  page_url: string;
  ts: string;
  name: string;
  business: string;
  email: string;
};

const BASE36 = "0123456789abcdefghijklmnopqrstuvwxyz";

export function generateRef(
  getRandomValues: (arr: Uint8Array) => Uint8Array = (arr) => crypto.getRandomValues(arr),
): string {
  const out: string[] = [];
  const buf = new Uint8Array(REF_LENGTH);
  while (out.length < REF_LENGTH) {
    getRandomValues(buf);
    for (const byte of buf) {
      if (out.length >= REF_LENGTH) break;
      // 252 is the largest multiple of 36 that fits in a byte, avoiding bias.
      if (byte < 252) out.push(BASE36[byte % 36] ?? "0");
    }
  }
  return REF_PREFIX + out.join("");
}

export function isValidRef(ref: string): boolean {
  return new RegExp(`^${REF_PREFIX}[0-9a-z]{${REF_LENGTH}}$`).test(ref);
}

export function joinTrades(slugs: string[]): string {
  return slugs.join(",");
}

export function normalizeName(value: string): string {
  return value.trim().slice(0, FIELD_MAX);
}

export function normalizeEmail(value: string): string {
  return value.trim().toLowerCase().slice(0, FIELD_MAX);
}

/** Basic email syntax: one @, local and domain parts, a dot in the domain. */
export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizeEmail(value));
}

export function buildPicksPayload(picks: Picks): URLSearchParams {
  const e = PICKS_FORM.entries;
  const body = new URLSearchParams();
  const values: Record<keyof typeof e, string> = {
    ref: picks.ref,
    schema: picks.schema,
    plan: picks.plan,
    state: picks.state,
    area: picks.area,
    trades: picks.trades,
    delivery: picks.delivery,
    page_url: picks.page_url,
    ts: picks.ts,
    name: picks.name,
    business: picks.business,
    email: picks.email,
  };
  (Object.keys(e) as (keyof typeof e)[]).forEach((key) => {
    const entryId = e[key];
    if (entryId) body.set(entryId, values[key]);
  });
  return body;
}

/** Append client_reference_id and prefilled_email to the plan's Payment Link:
 *  the LIVE link when SITE.checkoutLive is true, otherwise the test link. */
export function buildCheckoutUrl(plan: PlanKey, ref: string, email?: string): string {
  const base = SITE.checkoutLive ? SITE.paymentLinks[plan] : SITE.testPaymentLinks[plan];
  if (!base) {
    throw new Error(
      `Missing ${SITE.checkoutLive ? "live" : "test"} payment link for plan ${plan}`,
    );
  }
  const url = new URL(base);
  url.searchParams.set("client_reference_id", ref);
  if (email) url.searchParams.set("prefilled_email", email);
  return url.toString();
}

export type SubmitPicksOptions = {
  form?: { formResponseUrl: string; entries: Record<string, string> };
  fetchImpl?: typeof fetch;
  timeoutMs?: number;
  now?: () => number;
};

export async function submitPicks(
  picks: Picks,
  options: SubmitPicksOptions = {},
): Promise<void> {
  const form = options.form ?? PICKS_FORM;
  if (!form.formResponseUrl) return;

  const fetchImpl = options.fetchImpl ?? fetch;
  const timeoutMs = options.timeoutMs ?? SUBMIT_PICKS_TIMEOUT_MS;
  const body = buildPicksPayload(picks);

  const posted = fetchImpl(form.formResponseUrl, {
    method: "POST",
    mode: "no-cors",
    credentials: "omit",
    referrerPolicy: "no-referrer",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  }).then(
    () => undefined,
    () => undefined,
  );

  await Promise.race([
    posted,
    new Promise<void>((resolve) => {
      setTimeout(resolve, timeoutMs);
    }),
  ]);
}
