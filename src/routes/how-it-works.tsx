import { createFileRoute, Link } from "@tanstack/react-router";
import { pageHead } from "@/lib/seo";
import { countiesInRegion, regionsByNumber } from "@/data/helpers";
import { PLAN_CHANGES_TEXT } from "@/routes/manage";

// LTB copy v5.3 HIW Coverage body (More, 9:51 AM ET). Swap this one line for a later version.
export const COVERAGE_LINE =
  "We cover Florida at launch, with public bids from agency sources we've cleared across the state. Some counties won't have open bids on a given day.";

import { PageIntro, SampleBand, SampleConditions, TradeScopeList } from "@/components/site/ui";

export const Route = createFileRoute("/how-it-works")({
  head: () =>
    pageHead({
      title: "How LocalTradeBids Works | Florida Bid Alerts by Email",
      description:
        "How LocalTradeBids finds public construction and property-services bids from Florida government agencies and sends you the ones that fit your trade.",
      path: "/how-it-works",
    }),
  component: Page,
});

function Page() {
  return (
    <>
      <PageIntro title="How LocalTradeBids works">
        We find public construction and property-services bids, sort them by trade
        and county, and email you the ones that fit.
      </PageIntro>

      <section className="mt-10 max-w-3xl text-slate">
        <h2 className="text-xl font-bold text-brand">Where the bids come from</h2>
        <p className="mt-3">
          We collect public bid notices that government agencies post on their own
          public websites, plus federal postings on SAM.gov with a Florida place of
          performance. That includes state, county, city, school-district and
          special-district postings, only from sources we've cleared. We add a
          source only after checking that its terms let us list it.
        </p>
        <p className="mt-3">
          We list basic facts, such as the title, agency, county and due date, and
          link to the agency's official notice. We don't copy or host bid documents.
          Plans, specs, addenda and submissions stay on the agency's site.
        </p>
      </section>

      <section className="mt-10 max-w-3xl text-slate">
        <h2 className="text-xl font-bold text-brand">Seven trades at launch</h2>
        <TradeScopeList />
        <p className="mt-3">
          Every plan includes all seven trades. Pick the ones you want in your email.
        </p>
      </section>

      <section className="mt-10 max-w-3xl text-slate">
        <h2 className="text-xl font-bold text-brand">Your bid email: daily or weekly</h2>
        <p className="mt-3">
          One email on the schedule you choose, daily or weekly, with the open bids
          that match your trades and area. Daily comes every weekday (Monday to
          Friday) around 7:30 AM ET. Weekly comes every Monday around 7:30 AM ET, or
          Tuesday when Monday is a federal holiday. Bids added since your last email
          are marked "New". Each bid shows the agency, title, county, due date and a
          link. Email only. No texts or sales calls.
        </p>
        <p className="mt-3">
          You get the email even when there are no new bids. Your open bids are
          listed under a "No new bids today" note (daily) or a "No new bids this
          week" note (weekly).
        </p>
        <p className="mt-3">
          No email on federal holidays. Weekly emails move to Tuesday when Monday is
          a federal holiday.
        </p>
        <p className="mt-3">
          Your weekly email lists every bid added since your last one, newest first,
          followed by the other bids still open.
        </p>
      </section>

      <section id="coverage" className="mt-10 max-w-3xl text-slate">
        <h2 className="text-xl font-bold text-brand">Coverage</h2>
        <p className="mt-3">{COVERAGE_LINE} Choose your coverage when you sign up:</p>
        <ul className="mt-3 list-disc pl-5">
          <li><strong>County:</strong> one Florida county.</li>
          <li>
            <strong>Region:</strong> one of Florida's regional planning council
            areas, a group of neighboring counties.
          </li>
          <li><strong>Statewide:</strong> all of Florida.</li>
        </ul>
        <div className="mt-6 space-y-3">
          {regionsByNumber().map((region) => (
            <p key={region.id}>
              <strong>{region.name}:</strong>{" "}
              {countiesInRegion(region).map((c) => c.name).join(", ")}
            </p>
          ))}
        </div>
        <h3 className="mt-6 font-semibold text-ink">Changing your area later</h3>
        <p className="mt-2">{PLAN_CHANGES_TEXT}</p>
      </section>

      <section className="mt-10 max-w-3xl text-slate">
        <h2 className="text-xl font-bold text-brand">Good to know</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5">
          <li>
            We're not a government agency or an official bid portal, and no agency
            endorses us.
          </li>
          <li>
            We don't submit bids for you or hold bid documents. You still register
            and bid on the agency's own system when it requires it.
          </li>
          <li>
            We can't promise we'll catch every posting, and agencies can change or
            cancel a bid at any time. Always confirm details on the agency's official
            notice.
          </li>
        </ul>
      </section>

      <div className="mt-8 flex flex-wrap items-start gap-4">
        <Link to="/pricing" className="btn-primary">See plans</Link>
        <div>
          <Link to="/" hash="sample-band" className="link">Get the free weekly sample</Link>
          <SampleConditions />
        </div>
      </div>
      <SampleBand />
    </>
  );
}
