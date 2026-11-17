import { SITE, type PlanKey } from "@/config/site";
import { withBase } from "@/lib/base";

// More rev3.2 doc 04 A1, per-plan (hidden while SITE.checkoutLive is false).
// sha256 3f24e628f5aa4220ec45adc499f4c6d6cceddbe3734d8966e6d4469ab1fd873d
export function autorenewHtml(price: number): string {
  return (
    "<strong>$" +
    String(price) +
    " per month, billed monthly. Renews automatically every month at this " +
    "price until you cancel.</strong> Cancel online anytime from " +
    "<strong>Manage billing</strong> at the bottom of any page. Cancellation " +
    "takes effect at the end of the month you've paid for, and you won't be " +
    "charged again. No refunds except billing errors, or a renewal you " +
    "dispute within 7 days of the charge. By subscribing you agree to our " +
    '<a class="link" href="' + withBase("terms") + '">Terms of Service</a> and ' +
    '<a class="link" href="' + withBase("terms") + '#refund-policy">Refund Policy</a.'
  );
}

// More rev3.2 doc 04 A1 State A line (under the cards). Joining is free is More's text.
export const STATE_A_PLANS_OPEN_SOON =
  "Plans open soon: County $39, Region $89 and Statewide $139 per month, " +
  "billed monthly. Join the waitlist and we'll email you when you can " +
  "subscribe. Joining is free, and no payment is taken.";

// More rev3.3 delivery line (LTB copy v5.1, Home mini-cards + Pricing table).
export const DELIVERY_LINE =
  "Choose daily or weekly delivery at the same price. Daily comes every weekday " +
  "(Monday to Friday) around 7:30 AM ET. Weekly comes every Monday around 7:30 AM ET, " +
  "or Tuesday when Monday is a federal holiday. To switch, email us and we'll change it " +
  "within 2 business days.";

// LTB copy v5.1 "Email delivery" helper. State A: it is the Google Form field
// description. State B: shown on the plan card next to the button (Stripe dropdowns
// have no helper text).
export const EMAIL_DELIVERY_HELPER =
  "Same price either way. If we don't have your choice, you'll get the daily email. " +
  "To switch later, email support@localtradebids.com.";

export const STATE_A_BUTTON_HELPER =
  "Subscriptions open soon. Join the waitlist and we'll email you when you can sign up.";

// More rev3.2 doc 04 A1 helper under each Subscribe button (State B).
export const STATE_B_BUTTON_HELPER =
  "You'll check out on a page hosted by Stripe.";

export const PLANS: {
  key: PlanKey;
  name: string;
  price: number;
  coverage: string;
  bestFor: string;
}[] = [
  {
    key: "county",
    name: "County",
    price: 39,
    coverage: "One Florida county",
    bestFor: "Crews that work close to home",
  },
  {
    key: "region",
    name: "Region",
    price: 89,
    coverage: "One Florida regional planning council area",
    bestFor: "Firms that travel a few counties",
  },
  {
    key: "statewide",
    name: "Statewide",
    price: 139,
    coverage: "All of Florida",
    bestFor: "Firms that bid across the state",
  },
];

export function planHref(key: PlanKey): string {
  if (SITE.checkoutLive) {
    const link = SITE.paymentLinks[key];
    if (link) return link;
  }
  const params = new URLSearchParams({
    usp: "pp_url",
    [SITE.planSignupPlanEntry]: SITE.planSignupPlanValues[key],
  });
  return `${SITE.planSignupUrl}?${params.toString()}`;
}

export function planCta(plan: (typeof PLANS)[number]): string {
  if (SITE.checkoutLive) return `Subscribe: ${plan.name}, $${plan.price}/month`;
  return `Join the waitlist: ${plan.name}`;
}

export function PlanButton({ plan }: { plan: (typeof PLANS)[number] }) {
  return (
    <a
      href={planHref(plan.key)}
      className="btn-primary mt-6"
      target={SITE.checkoutLive ? undefined : "_blank"}
      rel={SITE.checkoutLive ? undefined : "noopener"}
    >
      {planCta(plan)}
    </a>
  );
}

export function AutorenewDisclosure({ price }: { price: number }) {
  return (
    <div className="autorenew-box">
      <p dangerouslySetInnerHTML={{ __html: autorenewHtml(price) }} />
    </div>
  );
}

/** Payment Links collect terms consent on Stripe's page (More rev2 doc 04 A2). */
export function TermsCheckbox() {
  return null;
}

export function PricingCards() {
  return (
    <ul className="grid gap-4 md:grid-cols-3">
      {PLANS.map((p) => (
        <li key={p.key} className="card flex flex-col p-6">
          <h3 className="text-xl font-bold text-brand">{p.name}</h3>
          <p className="mt-2 text-3xl font-bold text-ink">
            ${p.price}<span className="text-base font-medium text-slate"> / month</span>
          </p>
          <p className="mt-4 text-slate">{p.coverage}.</p>
          <p className="mt-2 text-sm text-slate">{p.bestFor}</p>
          <p className="mt-2 text-sm text-slate">
            Email delivery: Daily (weekdays) or Weekly (Mondays). All seven trades.
          </p>
          <PlanButton plan={p} />
          {SITE.checkoutLive ? (
            <>
              <div className="mt-4">
                <AutorenewDisclosure price={p.price} />
              </div>
              <p className="mt-2 text-sm text-slate">{EMAIL_DELIVERY_HELPER}</p>
              <p className="mt-2 text-sm text-slate">{STATE_B_BUTTON_HELPER}</p>
            </>
          ) : (
            <p className="mt-2 text-sm text-slate">{STATE_A_BUTTON_HELPER}</p>
          )}
        </li>
      ))}
    </ul>
  );
}

export function DeliveryNote() {
  return <p className="mt-4 text-slate">{DELIVERY_LINE}</p>;
}

export function PlansOpenSoonNote() {
  if (SITE.checkoutLive) return null;
  return <p className="mt-4 text-slate">{STATE_A_PLANS_OPEN_SOON}</p>;
}
