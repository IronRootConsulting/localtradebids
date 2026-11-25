#!/usr/bin/env node
// Reference signer for LocalTradeBids unsubscribe tokens (contract v1). For Bede / tests.
// The key is read from the environment only; it is never written to the repo.
//   LTB_UNSUB_KEY_K1=<base64 32 bytes> node apps-script/unsubscribe/sign-token.mjs <email_hash_hex> [list] [days]
import { createHmac } from "node:crypto";
import { fileURLToPath } from "node:url";

const b64url = (buf) => Buffer.from(buf).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

/** claims: {k, l, h, i, e}; keyB64: base64 key. Returns "v1.<payload>.<sig>". */
export function signToken(claims, keyB64) {
  const payload = b64url(Buffer.from(JSON.stringify({ k: claims.k, l: claims.l, h: claims.h, i: claims.i, e: claims.e }), "utf8"));
  const sig = b64url(createHmac("sha256", Buffer.from(keyB64, "base64")).update("v1." + payload, "utf8").digest());
  return `v1.${payload}.${sig}`;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const [h, list = "sample", days = "365"] = process.argv.slice(2);
  const key = process.env.LTB_UNSUB_KEY_K1;
  if (!key || !/^[0-9a-f]{64}$/.test(h || "")) {
    console.error("usage: LTB_UNSUB_KEY_K1=<base64> sign-token.mjs <64-hex email_hash> [list] [days>=30]");
    process.exit(2);
  }
  const i = Math.floor(Date.now() / 1000);
  const e = i + Math.max(30, Number(days)) * 86400;
  console.log(signToken({ k: "k1", l: list, h, i, e }, key));
}
