import { createFileRoute, Link } from "@tanstack/react-router";
import { pageHead } from "@/lib/seo";
import { SITE } from "@/config/site";
import {
  CANCEL_FALLBACK_TEXT,
  CANCEL_STEPS_TEXT,
  PLAN_CHANGES_TEXT,
} from "@/routes/manage";
import {
  DeliveryNote,
  PricingCards,
  PlansOpenSoonNote,
} from "@/components/site/PricingCards";
import { PageIntro, SampleBand, SampleConditions, TradeScopeList } from "@/components/site/ui";

export const Route = createFileRoute("/pricing")({
  head: () =>
    pageHead({
      title: "Pricing | LocalTradeBids Florida Bid Alerts",
      description:
        "LocalTradeBids plans for one county, a region, or all of Florida. Monthly pricing for a daily or weekly email of public bids for eight trades.",
      path: "/pricing",
    }),
  component: Page,
});

function Page() {
  return (
    <>
      <PageIntro title="Plans for every size of coverage">
        Pick one county, a region, or the whole state. Every plan includes the
        daily or weekly email digest and all eight trades.
      </PageIntro>
      <PricingCards />
      <PlansOpenSoonNote />
      <DeliveryNote />
      <section className="mt-10 max-w-3xl" aria-labelledby="seven-trades">
        <h2 id="seven-trades" className="text-xl font-bold text-brand">
          What the eight trades cover
        </h2>
        <TradeScopeList />
      </section>
      <section className="mt-12" aria-labelledby="not-ready">
        <h2 id="not-ready" className="text-2xl font-bold text-brand">
          Not ready to pay?
        </h2>
        <p className="mt-2 text-slate">
          Get the free weekly sample first and see the kind of bids we send.
        </p>
        <SampleConditions />
      </section>
      <SampleBand />
      <section className="mt-12 max-w-3xl" aria-labelledby="pricing-faq">
        <h2 id="pricing-faq" className="text-2xl font-bold text-brand">
          Pricing questions
        </h2>
        {SITE.checkoutLive ? (
          <>
            <h3 className="mt-6 font-semibold text-ink">Can I change plans?</h3>
            <p className="mt-2 text-slate">{PLAN_CHANGES_TEXT}</p>
            <h3 className="mt-6 font-semibold text-ink">How do I cancel?</h3>
            <p className="mt-2 text-slate">{CANCEL_STEPS_TEXT}</p>
            <p className="mt-2 text-slate">{CANCEL_FALLBACK_TEXT}</p>
            <h3 className="mt-6 font-semibold text-ink">Do you offer refunds?</h3>
            <p className="mt-2 text-slate">
              No. We don't give refunds, including for days left in a month after
              you cancel. The only exceptions are billing errors and a renewal
              charge you dispute within 7 days of that charge. Then we refund that
              renewal and cancel your plan. Details are in our{" "}
              <Link to="/terms" hash="refund-policy" className="link">Refund Policy</Link>.
            </p>
          </>
        ) : null}
      </section>
    </>
  );
}
