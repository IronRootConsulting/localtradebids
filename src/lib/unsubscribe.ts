// Client side of the sample-list unsubscribe (contract: /workspace/vincent/ltb-unsub-contract.md).
// The static page never verifies tokens (no secret in the browser or the repo); it only
// checks the shape and POSTs the token to SITE.unsubscribeEndpoint (Bede's Apps Script).
import { SITE } from "@/config/site";

const TOKEN_RE = /^v1\.[A-Za-z0-9_-]{10,900}\.[A-Za-z0-9_-]{43}$/;

/** Token from ?t= (preferred) or #t= ; null when missing or malformed. */
export function readUnsubToken(search: string, hash = ""): string | null {
  for (const raw of [search, hash]) {
    const t = new URLSearchParams(raw.replace(/^[?#]/, "")).get("t");
    if (t && TOKEN_RE.test(t)) return t;
  }
  return null;
}

export type UnsubOutcome =
  | "unsubscribed"
  | "already_unsubscribed"
  | "invalid_token"
  | "expired"
  | "not_configured"
  | "error";

/** Body the landing page sends: t=<token>&src=landing (form-encoded: a CORS "simple" request, no preflight). */
export function buildUnsubBody(token: string): URLSearchParams {
  return new URLSearchParams({ t: token, src: "landing" });
}

export async function submitUnsubscribe(
  token: string,
  endpoint: string = SITE.unsubscribeEndpoint,
  fetchImpl: typeof fetch = fetch,
): Promise<UnsubOutcome> {
  if (!endpoint) return "not_configured";
  try {
    const res = await fetchImpl(endpoint, {
      method: "POST",
      body: buildUnsubBody(token),
      credentials: "omit",
      referrerPolicy: "no-referrer",
      redirect: "follow",
    });
    const data = (await res.json()) as { ok?: boolean; status?: string };
    const s = data?.status;
    if (s === "unsubscribed" || s === "already_unsubscribed" || s === "invalid_token" || s === "expired") return s;
    return "error";
  } catch {
    return "error";
  }
}
