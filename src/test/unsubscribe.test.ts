// Sample-list unsubscribe: static page helpers + the Apps Script endpoint logic, run locally
// in a vm with mocked Apps Script services. No network, no live endpoint, no form submissions.
import { describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import { createHash, createHmac, randomBytes } from "node:crypto";
import vm from "node:vm";
import { fileURLToPath } from "node:url";
import { SITE } from "@/config/site";
import { buildUnsubBody, readUnsubToken, submitUnsubscribe } from "@/lib/unsubscribe";
import { shouldLoadBeacon } from "@/lib/analytics";
// @ts-expect-error plain .mjs reference signer
import { signToken } from "../../apps-script/unsubscribe/sign-token.mjs";

const GS = readFileSync(fileURLToPath(new URL("../../apps-script/unsubscribe/Code.gs", import.meta.url)), "utf8");
const KEY = randomBytes(32).toString("base64"); // test-only key, generated per run
const H = createHash("sha256").update("test-hash-input").digest("hex");
const NOW = 1_795_000_000; // fixed unix seconds
const DAY = 86400;

const toInt8 = (b: Buffer) => Array.from(new Int8Array(b.buffer, b.byteOffset, b.length));
const fromBytes = (a: number[]) => Buffer.from(Int8Array.from(a).buffer);

function loadGs(opts: { keys?: Record<string, string> } = {}) {
  const header = ["received_at_utc"]; // row 1 = headers, as ledgerSheet_ creates it
  const all: unknown[][] = [header];
  const sheet = {
    appendRow: (r: unknown[]) => all.push(r),
    getLastRow: () => all.length,
    getRange: (row: number, col: number, n: number, w: number) => ({
      getValues: () => all.slice(row - 1, row - 1 + n).map((r) => r.slice(col - 1, col - 1 + w)),
    }),
    setFrozenRows: () => {},
  };
  const props: Record<string, string> = opts.keys ?? { UNSUB_HMAC_K1: KEY };
  const ctx: Record<string, unknown> = {
    console,
    Utilities: {
      base64DecodeWebSafe: (s: string) => toInt8(Buffer.from(s.replace(/-/g, "+").replace(/_/g, "/"), "base64")),
      base64EncodeWebSafe: (a: number[]) => fromBytes(a).toString("base64").replace(/\+/g, "-").replace(/\//g, "_"),
      base64Decode: (s: string) => toInt8(Buffer.from(s, "base64")),
      base64Encode: (a: number[]) => fromBytes(a).toString("base64"),
      newBlob: (x: string | number[]) => ({
        getBytes: () => toInt8(Buffer.from(x as string, "utf8")),
        getDataAsString: () => fromBytes(x as number[]).toString("utf8"),
      }),
      computeHmacSha256Signature: (v: number[], k: number[]) =>
        toInt8(createHmac("sha256", fromBytes(k)).update(fromBytes(v)).digest()),
      computeDigest: (_a: unknown, s: string) => toInt8(createHash("sha256").update(s, "utf8").digest()),
      DigestAlgorithm: { SHA_256: "SHA_256" },
      Charset: { UTF_8: "UTF_8" },
      formatDate: (d: Date) => d.toISOString() + " ET",
    },
    PropertiesService: {
      getScriptProperties: () => ({ getProperties: () => props, getProperty: (k: string) => props[k] ?? null }),
    },
    SpreadsheetApp: { getActiveSpreadsheet: () => ({ getSheetByName: () => sheet }) },
    LockService: { getScriptLock: () => ({ tryLock: () => true, releaseLock: () => {} }) },
    ContentService: {
      MimeType: { JSON: "json" },
      createTextOutput: (s: string) => ({ body: s, setMimeType() { return this; } }),
    },
    HtmlService: { createHtmlOutput: (s: string) => ({ body: s, setTitle() { return this; } }) },
  };
  vm.createContext(ctx);
  vm.runInContext(GS, ctx);
  const deps = {
    now: () => new Date(NOW * 1000),
    keys: ctx.loadKeys_ as () => unknown,
    sheet: () => sheet,
    lock: () => ({ tryLock: () => true, releaseLock: () => {} }),
  };
  const post = (parameter: Record<string, string>) =>
    (ctx.handlePost_ as (e: unknown, d: unknown) => { ok: boolean; status: string })({ parameter }, deps);
  return {
    ctx,
    post,
    get rows() {
      return all.slice(1);
    },
  };
}

const tok = (over: Partial<{ k: string; l: string; h: string; i: number; e: number }> = {}, key = KEY) =>
  signToken({ k: "k1", l: "sample", h: H, i: NOW - DAY, e: NOW - DAY + 365 * DAY, ...over }, key);

describe("unsubscribe endpoint (Apps Script Code.gs, local vm)", () => {
  it("RFC 8058 one-click POST (token in URL, List-Unsubscribe=One-Click body) writes one ledger row", () => {
    const g = loadGs();
    const t = tok();
    expect(g.post({ t, "List-Unsubscribe": "One-Click" })).toMatchObject({ ok: true, status: "unsubscribed" });
    expect(g.rows).toHaveLength(1);
    const r = g.rows[0];
    expect(r[2]).toBe("sample");
    expect(r[3]).toBe(H);
    expect(r[4]).toBe("one_click_post");
    expect(r[7]).toBe("k1");
    expect(r[8]).toBe(createHash("sha256").update(t).digest("hex"));
    expect(JSON.stringify(r)).not.toContain("@"); // no plaintext email anywhere in the row
  });

  it("is idempotent per (list, email_hash): repeat or landing POST adds no row", () => {
    const g = loadGs();
    g.post({ t: tok(), "List-Unsubscribe": "One-Click" });
    expect(g.post({ t: tok({ i: NOW - 2 * DAY }), src: "landing" })).toMatchObject({ ok: true, status: "already_unsubscribed" });
    expect(g.rows).toHaveLength(1);
  });

  it("landing-page POST is recorded as landing_post", () => {
    const g = loadGs();
    g.post({ t: tok(), src: "landing" });
    expect(g.rows[0][4]).toBe("landing_post");
  });

  it("rejects bad signatures, wrong key ids, tampered claims and unknown lists", () => {
    const g = loadGs();
    const other = randomBytes(32).toString("base64");
    expect(g.post({ t: tok({}, other) }).status).toBe("invalid_token");
    expect(g.post({ t: tok({ k: "k9" }) }).status).toBe("invalid_token");
    expect(g.post({ t: tok({ l: "paid" }) }).status).toBe("invalid_token");
    expect(g.post({ t: tok({ h: "not-a-hash" }) }).status).toBe("invalid_token");
    const [v, p, s] = tok().split(".");
    const tampered = Buffer.from(Buffer.from(p, "base64url").toString().replace(H, "f".repeat(64))).toString("base64url");
    expect(g.post({ t: `${v}.${tampered}.${s}` }).status).toBe("invalid_token");
    expect(g.post({}).status).toBe("invalid_token");
    expect(g.post({ t: "x".repeat(2000) }).status).toBe("invalid_token");
    expect(g.rows).toHaveLength(0);
  });

  it("honors a token at least 30 days after issue even if e is shorter; expires after max(e, i+30d)", () => {
    const g = loadGs();
    expect(g.post({ t: tok({ i: NOW - 29 * DAY, e: NOW - 28 * DAY }) }).status).toBe("unsubscribed");
    const g2 = loadGs();
    expect(g2.post({ t: tok({ i: NOW - 31 * DAY, e: NOW - 28 * DAY }) }).status).toBe("expired");
    const g3 = loadGs();
    expect(g3.post({ t: tok({ i: NOW - 400 * DAY, e: NOW - 35 * DAY }) }).status).toBe("expired");
    expect(g3.rows).toHaveLength(0);
  });

  it("rejects tokens issued more than a day in the future", () => {
    expect(loadGs().post({ t: tok({ i: NOW + 2 * DAY, e: NOW + 400 * DAY }) }).status).toBe("invalid_token");
  });

  it("supports key rotation (K1 and K2 both accepted)", () => {
    const k2 = randomBytes(32).toString("base64");
    const g = loadGs({ keys: { UNSUB_HMAC_K1: KEY, UNSUB_HMAC_K2: k2 } });
    expect(g.post({ t: tok({ k: "k2" }, k2) }).status).toBe("unsubscribed");
  });

  it("GET never unsubscribes: it only links to the confirm page", () => {
    const g = loadGs();
    const t = tok();
    const out = (g.ctx.doGet as (e: unknown) => { body: string })({ parameter: { t } });
    expect(out.body).toContain(`https://localtradebids.com/unsubscribe/?t=${t}`);
    expect(g.rows).toHaveLength(0);
    const evil = (g.ctx.doGet as (e: unknown) => { body: string })({ parameter: { t: '"><script>x</script>' } });
    expect(evil.body).not.toContain("<script>");
  });

  it("source holds no secrets and asks only for the bound-sheet scope", () => {
    expect(GS).not.toMatch(/UNSUB_HMAC_K\d+\s*[:=]\s*["'][A-Za-z0-9+/]{20,}/);
    const manifest = JSON.parse(readFileSync(fileURLToPath(new URL("../../apps-script/unsubscribe/appsscript.json", import.meta.url)), "utf8"));
    expect(manifest.oauthScopes).toEqual(["https://www.googleapis.com/auth/spreadsheets.currentonly"]);
    expect(manifest.webapp).toEqual({ executeAs: "USER_DEPLOYING", access: "ANYONE_ANONYMOUS" });
  });
});

describe("/unsubscribe/ static page helpers", () => {
  it("reads the token from ?t= or #t= and rejects malformed values", () => {
    const t = tok();
    expect(readUnsubToken(`?t=${t}`)).toBe(t);
    expect(readUnsubToken("", `#t=${t}`)).toBe(t);
    expect(readUnsubToken("?t=abc")).toBeNull();
    expect(readUnsubToken("")).toBeNull();
  });

  it("posts form-encoded t + src=landing without cookies or referrer, and maps statuses", async () => {
    const t = tok();
    const f = vi.fn(async () => ({ json: async () => ({ ok: true, status: "unsubscribed" }) }) as unknown as Response);
    expect(await submitUnsubscribe(t, "https://script.google.com/macros/s/TEST/exec", f as unknown as typeof fetch)).toBe("unsubscribed");
    const [, init] = f.mock.calls[0] as unknown as [string, RequestInit];
    expect(init.method).toBe("POST");
    expect(init.credentials).toBe("omit");
    expect(init.referrerPolicy).toBe("no-referrer");
    expect(String(init.body)).toBe(buildUnsubBody(t).toString());
    const bad = vi.fn(async () => { throw new Error("offline"); });
    expect(await submitUnsubscribe(t, "https://x.invalid/exec", bad as unknown as typeof fetch)).toBe("error");
    const odd = vi.fn(async () => ({ json: async () => ({ status: "weird" }) }) as unknown as Response);
    expect(await submitUnsubscribe(t, "https://x.invalid/exec", odd as unknown as typeof fetch)).toBe("error");
  });

  it("does not call anything until the endpoint is configured (placeholder, no fake URL)", async () => {
    expect(SITE.unsubscribeEndpoint).toBe("");
    const f = vi.fn();
    expect(await submitUnsubscribe(tok(), "", f as unknown as typeof fetch)).toBe("not_configured");
    expect(f).not.toHaveBeenCalled();
  });

  it("the unsubscribe page never loads the analytics beacon (its URL carries the token)", () => {
    expect(shouldLoadBeacon("/unsubscribe/")).toBe(false);
    expect(shouldLoadBeacon("/unsubscribe/?t=v1.x.y")).toBe(false);
  });
});

describe("Manage billing", () => {
  it("/manage/ points at the live Stripe portal login link (config bpc_1UcwG7Rz7lWavGOpcKSbDbxB), not a placeholder", () => {
    expect(SITE.billingPortalUrl).toMatch(/^https:\/\/billing\.stripe\.com\/p\/login\/[A-Za-z0-9]+$/);
  });
});
