import { createFileRoute, Link } from "@tanstack/react-router";
import { pageHead } from "@/lib/seo";
import { SITE } from "@/config/site";
import { CANCEL_FALLBACK_TEXT, CANCEL_STEPS_TEXT, PLAN_CHANGES_TEXT } from "@/routes/manage";
import { PageIntro, SampleBand, TradeScopeList } from "@/components/site/ui";
import { STATE_A_PLANS_OPEN_SOON } from "@/components/site/PricingCards";

export const Route = createFileRoute("/faq")({
  head: () =>
    pageHead({
      title: "FAQ | LocalTradeBids",
      description:
        "Answers about LocalTradeBids: where bids come from, trades and coverage, the daily or weekly email, the free weekly sample, and plans.",
      path: "/faq",
    }),
  component: Page,
});

function Page() {
  return (
    <>
      <PageIntro title="Questions and answers" />
      <div className="mx-auto max-w-3xl space-y-6 text-slate">
        <section>
          <h2 className="text-lg font-semibold text-ink">What is LocalTradeBids?</h2>
          <p className="mt-2">
            A daily or weekly email of public government bids for construction and
            property-services trades, matched to your trades and the area you cover.
            We start in Florida.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-ink">Where do the bids come from?</h2>
          <p className="mt-2">
            From public bid notices that government agencies post: federal postings
            for work in Florida, and state and local agency postings whose terms
            let us list them. Each listing links to the agency's official notice.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-ink">
            Are you a government agency or bid portal?
          </h2>
          <p className="mt-2">
            No. LocalTradeBids is an independent service of IronRoot Consulting LLC
            d/b/a LocalTradeBids [subject to fictitious-name registration]. We're
            not affiliated with or endorsed by any government agency. To get bid
            documents, register as a vendor or submit a bid, use the agency's own
            website.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-ink">Do you list every bid in Florida?</h2>
          <p className="mt-2">
            No. We can't promise we'll list every bid, and a listing can be
            incomplete or out of date. We add sources over time. Always check the
            agency's official notice. If an agency you bid with is missing, email
            support@localtradebids.com.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-ink">Which trades do you cover?</h2>
          <p className="mt-2">Seven trades, and every plan includes all seven:</p>
          <TradeScopeList />
        </section>
        <section>
          <h2 className="text-lg font-semibold text-ink">What's a "Region"?</h2>
          <p className="mt-2">
            One of Florida's regional planning council areas, a group of neighboring
            counties. See the full list on the{" "}
            <Link to="/how-it-works" hash="coverage" className="link">coverage page</Link>.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-ink">When does the email arrive?</h2>
          <p className="mt-2">
            It depends on the delivery you chose. Daily comes every weekday (Monday to
            Friday) around 7:30 AM ET, with no email on federal holidays. Weekly comes
            every Monday around 7:30 AM ET, or Tuesday when Monday is a federal
            holiday. Both cost the same. To switch, email support@localtradebids.com
            and we'll change it within 2 business days. Bids added since your last
            email are marked "New". When there are no new bids you still get the
            email, with your open bids listed under a "No new bids today" note
            (daily) or a "No new bids this week" note (weekly).
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-ink">What's in the weekly email?</h2>
          <p className="mt-2">
            Your weekly email lists every bid added since your last one, newest first,
            followed by the other bids still open. It covers your trades and area, and
            it's part of your paid plan. It's separate from the free weekly sample,
            which shows up to 10 of the newest open bids statewide.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-ink">What's in each bid listing?</h2>
          <p className="mt-2">
            Basic facts, such as the title, agency, county and due date (when the
            agency lists one), and a link to the official notice.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-ink">What's the free weekly sample?</h2>
          <p className="mt-2">
            A weekly email with a sample of the newest open Florida public
            construction and property-services bids, so you can see what we send.
            It comes every Monday, around 7:30 AM ET, with up to 10 of the newest
            open bids: only from sources we've cleared, never past due, and across
            all seven trades. It's not the full digest. No card is needed.
            It's free, it never turns into a paid plan, and you can unsubscribe from
            any sample email in one click. Sample emails also include information
            about our paid plans.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-ink">
            Do you send texts or make sales calls?
          </h2>
          <p className="mt-2">No. Email only. No texts or sales calls.</p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-ink">How much does it cost?</h2>
          <p className="mt-2">
            {SITE.checkoutLive
              ? "County $39/month, Region $89/month, Statewide $139/month."
              : STATE_A_PLANS_OPEN_SOON}
          </p>
        </section>
        {SITE.checkoutLive ? (
          <>
            <section>
              <h2 className="text-lg font-semibold text-ink">
                Can I cancel? Is there a refund? Does it renew automatically?
              </h2>
              <p className="mt-2">
                Yes. Your plan renews automatically every month at the plan price
                until you cancel. {CANCEL_STEPS_TEXT} {CANCEL_FALLBACK_TEXT} Monthly payments aren't
                refundable, except for billing errors or a renewal you dispute
                within 7 days of the charge. See our{" "}
                <Link to="/terms" hash="refund-policy" className="link">Refund Policy</Link>.
              </p>
              <p className="mt-2">
                Example: if you subscribed on the 21st of a month and cancel on the
                25th, your access runs until the next 21st (your next billing date),
                and you won't be charged again. There's no refund for the remaining
                days.
              </p>
            </section>
            <section>
              <h2 className="text-lg font-semibold text-ink">
                Can I change my county, region or trades?
              </h2>
              <p className="mt-2">{PLAN_CHANGES_TEXT}</p>
            </section>
          </>
        ) : null}
        <section>
          <h2 className="text-lg font-semibold text-ink">Do you cover other states?</h2>
          <p className="mt-2">
            Not yet. <Link to="/coming-soon" className="link">Join the list</Link>
            {" "}and we'll tell you when your state opens.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-ink">
            How do I unsubscribe from the sample or waitlist emails?
          </h2>
          <p className="mt-2">
            Click <strong>Unsubscribe</strong> at the bottom of any sample or
            waitlist email, or email support@localtradebids.com. We'll stop within
            10 business days, usually much sooner. Unsubscribing from these emails
            doesn't cancel a paid subscription. To stop the paid digest,
            cancel from <strong>Manage billing</strong>.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-ink">How do I reach you?</h2>
          <p className="mt-2">Email support@localtradebids.com.</p>
        </section>
      </div>
      <SampleBand />
    </>
  );
}
