import { SITE, type PlanKey } from "@/config/site";

export const PICKS_SCHEMA = "v1" as const;
export const SUBMIT_PICKS_TIMEOUT_MS = 1500;
export const PICKS_STORAGE_KEY = "ltb_signup_picks";
export const REF_PREFIX = "ltb_";
export const REF_LENGTH = 12;

/** Google Form that receives preference picks. Empty URL skips the POST. */
export const PICKS_FORM = {
  formResponseUrl:
    "https://docs.google.com/forms/d/e/1FAIpQLSdIaxnBWh6b6OW4Z4zdyAbIyOBH1FIBeF-uLV2AaIrMJL_YIQ/formResponse",
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
  },
} as const;

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
  };
  (Object.keys(e) as (keyof typeof e)[]).forEach((key) => {
    const entryId = e[key];
    if (entryId) body.set(entryId, values[key]);
  });
  return body;
}

export function stashPicks(picks: Picks, storage: Storage = sessionStorage): void {
  storage.setItem(PICKS_STORAGE_KEY, JSON.stringify(picks));
}

/** Append client_reference_id to a test Payment Link. Never uses live paymentLinks. */
export function buildCheckoutUrl(plan: PlanKey, ref: string): string {
  const base = SITE.testPaymentLinks[plan];
  if (!base) {
    throw new Error(`Missing test payment link for plan ${plan}`);
  }
  const url = new URL(base);
  url.searchParams.set("client_reference_id", ref);
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
