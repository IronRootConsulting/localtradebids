import { createFileRoute, Link } from "@tanstack/react-router";
import { pageHead } from "@/lib/seo";
import { SITE } from "@/config/site";

type Search = {
  from?: string;
  list?: string;
  email?: string;
  state?: string;
  plan?: string;
  price?: string;
};

export const Route = createFileRoute("/thank-you")({
  validateSearch: (s: Record<string, unknown>): Search => {
    const str = (k: string) => (typeof s[k] === "string" ? s[k] : undefined);
    const out: Search = {};
    const from = str("from");
    const list = str("list");
    const email = str("email");
    const state = str("state");
    const plan = str("plan");
    const price = str("price");
    if (from) out.from = from;
    if (list) out.list = list;
    if (email) out.email = email;
    if (state) out.state = state;
    if (plan) out.plan = plan;
    if (price) out.price = price;
    return out;
  },
  head: () =>
    pageHead({
      title: "Thanks | LocalTradeBids",
      description: "Thanks for signing up with LocalTradeBids.",
      path: "/thank-you",
      noindex: true,
    }),
  component: Page,
});

function Page() {
  const s = Route.useSearch();
  const paid = s.from === "paid" && SITE.checkoutLive;
  const waitlist = s.list === "state" || s.from === "state";
  const email = s.email ?? "{email}";
  const state = s.state ?? "{State}";
  const plan = s.plan ?? "[Plan]";
  const price = s.price ?? "[price]";

  return (
    <div className="mx-auto max-w-2xl">
      {paid ? (
        <>
          <h1 className="text-3xl font-bold tracking-tight text-brand">You're in</h1>
          <p className="mt-4 text-slate">
            Thanks for subscribing. Your {plan} plan is ${price} per month, billed
            monthly, and renews automatically every month at this price until you
            cancel. Cancel anytime online from Manage billing at the bottom of any
            page. Cancellation takes effect at the end of the month you've paid for,
            and you won't be charged again.
          </p>
          <p className="mt-4 text-slate">
            Next, set your trades and coverage so we can match bids to you.
            [CONFIRM: preferences form link] Your [Daily/Weekly] digest arrives
            [every weekday (Monday to Friday) around 7:30 AM ET / every Monday around
            7:30 AM ET, or Tuesday when Monday is a federal holiday]. To switch, email
            support@localtradebids.com and we'll change it within 2 business days.
          </p>
          <p className="mt-4">
            <a className="btn-primary" href="[CONFIRM: preferences form link]">
              Set my preferences
            </a>
          </p>
          <p className="mt-3">
            {SITE.billingPortalUrl ? (
              <a href={SITE.billingPortalUrl} className="link" rel="noopener">
                Manage billing
              </a>
            ) : (
              <Link to="/manage" className="link">Manage billing</Link>
            )}
          </p>
        </>
      ) : waitlist ? (
        <>
          <h1 className="text-3xl font-bold tracking-tight text-brand">You're on the list</h1>
          <p className="mt-4 text-slate">
            We'll email {email} when LocalTradeBids opens in {state}.
          </p>
          <p className="mt-6">
            <Link to="/" className="btn-primary">Back to home</Link>
          </p>
        </>
      ) : (
        <>
          <h1 className="text-3xl font-bold tracking-tight text-brand">
            You're signed up for the weekly sample
          </h1>
          <p className="mt-4 text-slate">
            Your first sample arrives Monday, around 7:30 AM ET, at {email}, with up to
            10 of the newest open bids statewide. Add bids@localtradebids.com to your
            contacts so it doesn't land in spam.
          </p>
          <p className="mt-6">
            <Link to="/pricing" className="btn-primary">See plans</Link>
          </p>
        </>
      )}
      <p className="mt-8 text-slate">Questions? Email support@localtradebids.com.</p>
    </div>
  );
}
