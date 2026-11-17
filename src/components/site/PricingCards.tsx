import { SITE, type PlanKey } from "@/config/site";
import { PreviewCheckoutNotice } from "@/components/site/PreviewCheckoutNotice";
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

// More preview wording (Andrew approved 5:52 PM ET Nov 17, 2026). Under the cards on home and /pricing/, and in the FAQ price answer.
export const STATE_A_PLANS_OPEN_SOON =
  "County $39, Region $89 and Statewide $139 per month, billed monthly. Plans renew automatically every month until you cancel. This site is a preview: checkout runs in Stripe's test mode, so nothing is charged and no subscription starts. Please don't enter real card or bank details. Paid plans aren't open yet.";

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
  "Preview: checkout runs in Stripe's test mode, so nothing is charged and no subscription starts. Paid plans aren't open yet.";

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

export function preferencesHref(key: PlanKey): string {
  return withBase(`signup/?plan=${encodeURIComponent(key)}`);
}

export function planHref(key: PlanKey): string {
  if (SITE.checkoutLive) {
    const link = SITE.paymentLinks[key];
    if (link) return link;
  }
  return preferencesHref(key);
}

export function planCta(plan: (typeof PLANS)[number]): string {
  // Andrew 5:46 PM ET Nov 17, 2026: plan buttons use the approved Subscribe label in preview too.
  return `Subscribe: ${plan.name}, $${plan.price}/month`;
}

export function PlanButton({ plan }: { plan: (typeof PLANS)[number] }) {
  const href = planHref(plan.key);
  const external = /^https?:\/\//.test(href);
  return (
    <a
      href={href}
      className="btn-primary mt-6"
      target={external ? "_blank" : undefined}
      rel={external ? "noopener" : undefined}
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
          {/* Text block grows so every card's button block starts at the same height. */}
          <div className="flex-1">
          <h3 className="text-xl font-bold text-brand">{p.name}</h3>
          <p className="mt-2 text-3xl font-bold text-ink">
            ${p.price}<span className="text-base font-medium text-slate"> / month</span>
          </p>
          <p className="mt-4 text-slate">{p.coverage}.</p>
          <p className="mt-2 text-sm text-slate">{p.bestFor}</p>
          <p className="mt-2 text-sm text-slate">
            Email delivery: Daily (weekdays) or Weekly (Mondays). All seven trades.
          </p>
          </div>
          <PlanButton plan={p} />
          <PreviewCheckoutNotice variant="short" className="mt-3" />
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
