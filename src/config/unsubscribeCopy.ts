// /unsubscribe/ page copy: the ONLY place its wording lives. To ship a new version from Ignatius,
// replace the strings below (keep the keys); src/routes/unsubscribe.tsx maps keys to page states.
// Links: any "bids@localtradebids.com" renders as a mailto link and
// "https://localtradebids.com/manage/" as a normal link (CopyText in src/routes/unsubscribe.tsx).
//
// Ignatius's final copy v3, byte-exact from /workspace/ignatius/ltb-unsubscribe-page-copy-v3.md
// (sha256 6b1fde8f4ef7ab7e4f6064a8fadd547c452f4374110fec379521351dd5161d0d; St. Thomas More edits to
// (5) and (6)), More-reviewed, pending Andrew OK. Don't edit wording here; changes come from Ignatius.
export const UNSUB_COPY = {
  // (1) Confirm state
  title: "Stop sample and marketing emails",
  intro: "Tap the button below and we'll stop sending free sample emails and other marketing emails to this address.",
  // (2) Button label
  button: "Stop these emails",
  // (3) Success
  success: "Done. You won't get any more sample or marketing emails from LocalTradeBids at this address.",
  // (4) Error (expired/invalid link or network failure)
  error:
    "We couldn't confirm your request. The link may have expired, or the connection dropped. Try the button again, or open the unsubscribe link in your latest sample email. If it still doesn't work, email bids@localtradebids.com from the address you want removed, and we'll remove it.",
  // (5) No-token state
  noToken:
    "To stop sample and marketing emails, open the unsubscribe link at the bottom of any sample email we sent you. If you can't find one, email bids@localtradebids.com from the address you want removed.",
} as const;

// (6) Paid subscribers (optional line). Kept separate so it can change or be dropped on its own.
// Set to "" to drop it; the page then renders no paid line.
export const UNSUB_PAID_LINE: string =
  "This page stops sample and marketing emails only. It doesn't change a paid plan or its bid emails. To change or cancel a paid plan, go to https://localtradebids.com/manage/.";
