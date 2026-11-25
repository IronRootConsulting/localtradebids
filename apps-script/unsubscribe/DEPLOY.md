# LTB sample-list unsubscribe endpoint: deploy notes

Status: PREPARED ONLY. Nothing here is deployed. Deploy needs Andrew's own-words go.
Contract: /workspace/vincent/ltb-unsub-contract.md (box). Owner/runner after deploy: Bede.
Owner account: andrew@ironrootstrategy.com. The script binds to the NEW LTB unsubscribe ledger
Sheet that Andrew creates in that account and Aquinas files (Andrew 6:20 AM ET Nov 25).
Sheet ID: [TO COME].

Dec 7 scope (Andrew 6:23 AM ET Nov 25): the sample carries the unsubscribe link in the BODY ONLY.
No List-Unsubscribe / List-Unsubscribe-Post headers, no Gmail API/OAuth sending. The
/unsubscribe/ page is the ONLY unsubscribe path. The script's one-click POST handling stays in
the code, unused for now.
Cost: $0 (Apps Script and Sheets are included in Google Workspace; no Cloudflare, no DNS change).

## Files
- `Code.gs` – the web app (doPost = unsubscribe, doGet = never unsubscribes). No secrets.
- `appsscript.json` – manifest: V8, America/New_York, scope `spreadsheets.currentonly`,
  web app "Execute as: me", "Who has access: Anyone" (anonymous; required for the /unsubscribe/ page's POST).
- `sign-token.mjs` – reference token signer (key from env only). Bede may port it (Python
  version in the contract).

## One-time setup (Andrew's Google account, with Bede)
1. Signed in as andrew@ironrootstrategy.com, open the new LTB unsubscribe ledger Sheet (ID to
   come; Andrew creates it, Aquinas files it), Extensions > Apps Script. The script must be
   BOUND to that Sheet.
2. Paste `Code.gs`; Project Settings > "Show appsscript.json" and paste `appsscript.json`.
3. Generate the key OUTSIDE the repo: `openssl rand -base64 32`. Project Settings >
   Script properties > add `UNSUB_HMAC_K1` = that value. Give the same value to Bede's signer
   store (never chat, email, Drive docs, or the repo).
4. Optional: Script property `LEDGER_TAB` (default `unsubscribes`; created on first write).
5. Deploy > New deployment > Web app > Execute as: Me; Who has access: Anyone (anonymous;
   required for the /unsubscribe/ page's POST, which comes from visitors with no Google
   sign-in). Authorize
   the one scope (this spreadsheet only). Copy the `/exec` URL.
   - Workspace admin check: if "Anyone" is missing, Admin console > Apps > Google Workspace >
     Drive and Docs > sharing must allow sharing outside the domain for this account's OU.
6. Protect the `unsubscribes` tab (only the owner edits); rows are add-only.

## Site side (repo IronRootConsulting/localtradebids, branch sample-unsub)
- Set `unsubscribeEndpoint` in `src/config/site.ts` to the `/exec` URL (not a secret).
  Until then /unsubscribe/ shows only the email-us fallback.
- Push/merge to main only on Andrew's go (fast-forward only); Pages deploys as usual.

## Post-deploy checks (with a TEST hash, then delete nothing: test rows are marked)
Use tokens for a dummy hash (e.g. sha256 of "ltb-unsub-selftest") signed with K1. The
/unsubscribe/ page is the only unsubscribe path for Dec 7, so these checks cover that path.
- `curl -s "<exec>?health=1"` → `{"ok":true,"service":"ltb-unsub",...}`
- `curl -s -L "<exec>?t=<token>"` (GET) → HTML link only; ledger unchanged.
- PRIMARY: `curl -s -L -X POST -d "t=<token>&src=landing" "<exec>"` →
  `{"ok":true,"status":"unsubscribed","list":"sample"}` and one `landing_post` row; repeat →
  `already_unsubscribed`, still one row.
- Real browser (Chrome, DevTools Network tab open), after the site push with
  `unsubscribeEndpoint` set: open https://localtradebids.com/unsubscribe/?t=<token2>, click the
  button, and check that:
  1. the page's fetch POST to `<exec>` gets a 302 to `script.googleusercontent.com` and follows it;
  2. the JSON reaches the page (no CORS error in the Console; the page shows the confirmation,
     not the email fallback);
  3. one `landing_post` row for token2's hash is written.
- Real test sample: send one real sample (from the normal sender) to an internal address. Its
  BODY link opens `/unsubscribe/?t=<token>`; Confirm writes one `landing_post` row; a second
  click (or reload + Confirm) shows already-unsubscribed and writes no row.
- OPTIONAL (one-click handling kept in the code but not used on Dec 7):
  `curl -s -L -X POST -d "List-Unsubscribe=One-Click" "<exec>?t=<token3>"` → `unsubscribed`;
  `curl -s -o /dev/null -w "%{http_code}" -X POST -d "List-Unsubscribe=One-Click" "<exec>?t=<token4>"`
  prints 302 and token4's row exists (write happens before the redirect).
Who runs these and which rows count as test rows is Bede's call (he excludes them from
suppression counts, e.g. by the known self-test hash).

## Rotation
Add `UNSUB_HMAC_K2`, switch Bede's signer to `k: "k2"`, keep K1 until 400 days after the last
K1-signed send (tokens live up to 365 days), then delete K1.
