# LTB sample-list unsubscribe endpoint: deploy notes

Status: PREPARED ONLY. Nothing here is deployed. Deploy needs Andrew's own-words go.
Contract: /workspace/vincent/ltb-unsub-contract.md (box). Owner/runner after deploy: Bede.
Cost: $0 (Apps Script and Sheets are included in Google Workspace; no Cloudflare, no DNS change).

## Files
- `Code.gs` – the web app (doPost = unsubscribe, doGet = never unsubscribes). No secrets.
- `appsscript.json` – manifest: V8, America/New_York, scope `spreadsheets.currentonly`,
  web app "Execute as: me", "Who has access: Anyone" (anonymous; required for one-click).
- `sign-token.mjs` – reference token signer (key from env only). Bede may port it (Python
  version in the contract).

## One-time setup (Andrew's Google account, with Bede)
1. Open Bede's suppression-ledger spreadsheet (or a new "LTB unsubscribe ledger" Sheet owned by
   the agreed account), Extensions > Apps Script. The script must be BOUND to that Sheet.
2. Paste `Code.gs`; Project Settings > "Show appsscript.json" and paste `appsscript.json`.
3. Generate the key OUTSIDE the repo: `openssl rand -base64 32`. Project Settings >
   Script properties > add `UNSUB_HMAC_K1` = that value. Give the same value to Bede's signer
   store (never chat, email, Drive docs, or the repo).
4. Optional: Script property `LEDGER_TAB` (default `unsubscribes`; created on first write).
5. Deploy > New deployment > Web app > Execute as: Me; Who has access: Anyone. Authorize
   the one scope (this spreadsheet only). Copy the `/exec` URL.
   - Workspace admin check: if "Anyone" is missing, Admin console > Apps > Google Workspace >
     Drive and Docs > sharing must allow sharing outside the domain for this account's OU.
6. Protect the `unsubscribes` tab (only the owner edits); rows are add-only.

## Site side (repo IronRootConsulting/localtradebids, branch sample-unsub)
- Set `unsubscribeEndpoint` in `src/config/site.ts` to the `/exec` URL (not a secret).
  Until then /unsubscribe/ shows only the email-us fallback.
- Push/merge to main only on Andrew's go (fast-forward only); Pages deploys as usual.

## Post-deploy checks (with a TEST hash, then delete nothing: test rows are marked)
Use a token for a dummy hash (e.g. sha256 of "ltb-unsub-selftest") signed with K1:
- `curl -s "<exec>?health=1"` → `{"ok":true,"service":"ltb-unsub",...}`
- `curl -s -L "<exec>?t=<token>"` (GET) → HTML link only; ledger unchanged.
- `curl -s -L -X POST -d "List-Unsubscribe=One-Click" "<exec>?t=<token>"` →
  `{"ok":true,"status":"unsubscribed"}`; repeat → `already_unsubscribed`; one row.
- Confirm the row was written even WITHOUT following the redirect:
  `curl -s -o /dev/null -w "%{http_code}" -X POST -d "List-Unsubscribe=One-Click" "<exec>?t=<token2>"`
  prints 302 and the row for token2 exists (this is what a mailbox provider's POST does).
- Open https://localtradebids.com/unsubscribe/?t=<token3> → button → confirmation.
- Send one real sample to an internal Gmail address and check "Show original":
  List-Unsubscribe + List-Unsubscribe-Post present AND covered by the DKIM `h=` list; Gmail
  shows the "Unsubscribe" link next to the sender.
Who runs these and which rows count as test rows is Bede's call (he excludes them from
suppression counts, e.g. by the known self-test hash).

## Rotation
Add `UNSUB_HMAC_K2`, switch Bede's signer to `k: "k2"`, keep K1 until 400 days after the last
K1-signed send (tokens live up to 365 days), then delete K1.
