import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { FLORIDA_COUNTIES, PUBLIC_PAGES_AS_OF, TRADES } from "@/data/ltb";
import {
  countyPageKey,
  countyTradePageKey,
  formatUpdated,
  getPageSample,
  hasPublicPage,
  HOME_PAGE_KEY,
} from "@/data/helpers";
import { pageHead } from "@/lib/seo";
import {
  DeliveryNote,
  PricingCards,
  PlansOpenSoonNote,
} from "@/components/site/PricingCards";
import {
  BidTable,
  HomeEmailPanel,
  MoreForSubscribers,
  noOpenBidsText,
  SampleBand,
  SampleConditions,
} from "@/components/site/ui";
import { HowSteps } from "@/components/site/HowSteps";

export const Route = createFileRoute("/")({
  loader: () => ({ sample: getPageSample(HOME_PAGE_KEY) }),
  head: () =>
    pageHead({
      title: "LocalTradeBids | Government Bids for Your Trade, by Email",
      description:
        "Public construction and property-services bids from Florida government agencies, matched to your trade and county and emailed to you daily or weekly.",
      path: "/",
    }),
  component: Home,
});

function SearchCard() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [trade, setTrade] = useState("");
  const [message, setMessage] = useState("");

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (!q) {
      setMessage("Type a county name to search.");
      return;
    }
    const lower = q.toLowerCase().replace(/\s+county$/, "");
    const county = FLORIDA_COUNTIES.find(
      (c) => c.name.toLowerCase() === lower || c.slug === lower.replace(/\s+/g, "-"),
    );
    if (!county) {
      if (/,/.test(q) || /\b(al|ak|az|ga|tx|ny|ca)\b/i.test(q)) {
        setMessage("out-of-state");
        return;
      }
      setMessage(`We couldn't find "${q}". Check the spelling or pick a county from the list.`);
      return;
    }
    setMessage("");
    const key = trade ? countyTradePageKey(county.slug, trade) : countyPageKey(county.slug);
    if (!hasPublicPage(key)) {
      const tradeName = TRADES.find((t) => t.slug === trade)?.name;
      setMessage("no-bids:" + noOpenBidsText(county.name, tradeName));
      return;
    }
    if (trade) {
      return navigate({
        to: "/florida/$county/$trade",
        params: { county: county.slug, trade },
      });
    }
    return navigate({ to: "/florida/$county", params: { county: county.slug } });
  }

  return (
    <form
      onSubmit={onSubmit}
      className="card mt-8 grid gap-4 p-5 sm:grid-cols-3 sm:items-end"
      aria-label="Find bids near you"
    >
      <label className="grid gap-1 text-sm font-medium text-ink">
        Find bids near you
        <input
          className="field"
          list="county-list"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Type a Florida county, e.g. Collier"
        />
        <datalist id="county-list">
          {FLORIDA_COUNTIES.map((c) => (
            <option key={c.slug} value={c.name} />
          ))}
        </datalist>
      </label>
      <label className="grid gap-1 text-sm font-medium text-ink">
        Trade (optional)
        <select className="field" value={trade} onChange={(e) => setTrade(e.target.value)}>
          <option value="">All seven trades</option>
          {TRADES.map((t) => (
            <option key={t.slug} value={t.slug}>{t.name}</option>
          ))}
        </select>
      </label>
      <button type="submit" className="btn-primary h-12">Search</button>
      <p className="sm:col-span-3 text-sm text-slate">
        Florida counties only for now. Other states are coming.
      </p>
      {message === "out-of-state" ? (
        <p className="sm:col-span-3 text-sm text-ink">
          We cover Florida right now.{" "}
          <Link to="/coming-soon" className="link">Join the waitlist</Link>
          {" "}and we'll tell you when your state opens.
        </p>
      ) : message.startsWith("no-bids:") ? (
        <div className="sm:col-span-3 text-sm text-ink">
          <p>{message.slice("no-bids:".length)}</p>
          <p className="mt-1">
            <a href="#sample-band" className="link">Get the free weekly sample</a>
          </p>
          <SampleConditions />
        </div>
      ) : message ? (
        <p className="sm:col-span-3 text-sm text-ink">{message}</p>
      ) : null}
    </form>
  );
}

function Home() {
  const { sample } = Route.useLoaderData();
  const updated = formatUpdated(PUBLIC_PAGES_AS_OF);
  return (
    <>
      <section className="py-6 sm:py-10">
        <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-brand sm:text-5xl">
          Government bids for your trade, in your county.
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-slate">
          LocalTradeBids checks public bid postings from government agencies in
          Florida and sends you the ones that match your trade and coverage area.
          One email, daily or weekly, your choice.
        </p>
        <div className="mt-6 flex flex-wrap items-start gap-4">
          <a href="#search" className="btn-primary">See bids in my county</a>
          <div>
            <a href="#sample-band" className="link">Get the free weekly sample</a>
            <SampleConditions />
          </div>
        </div>
        <div id="search">
          <SearchCard />
        </div>
      </section>

      <section className="mt-12" aria-labelledby="how">
        <h2 id="how" className="text-2xl font-bold text-brand">How it works</h2>
        <HowSteps />
        <p className="mt-4">
          <Link to="/how-it-works" className="link">More about how it works &rarr;</Link>
        </p>
      </section>

      <section className="mt-14" aria-labelledby="pricing">
        <h2 id="pricing" className="mb-4 text-2xl font-bold text-brand">Simple monthly plans</h2>
        <p className="mb-6 text-slate">
          Pay for the coverage you need: one county, a region, or all of Florida.
        </p>
        <PricingCards />
        <PlansOpenSoonNote />
        <DeliveryNote />
        <p className="mt-6">
          <Link to="/pricing" className="btn-primary">Compare plans</Link>
        </p>
      </section>

      <section className="mt-14" aria-labelledby="sample">
        <h2 id="sample" className="mb-4 text-2xl font-bold text-brand">A look at three recent bids</h2>
        <p className="mb-4 text-slate">
          Real public postings, shown as facts and a link. Open the agency's page
          for full documents and to bid.
        </p>
        {sample.shownCount > 0 ? (
          <BidTable
            bids={sample.rows}
            cols="home"
            caption={
              <>
                Sample bids as of {updated}. Listings summarize public agency
                notices and link to the source. LocalTradeBids is not affiliated
                with any agency. Bids may close or change, so always check the
                agency's official notice.
              </>
            }
          />
        ) : null}
        <MoreForSubscribers more={sample.moreCount} />
        <HomeEmailPanel />
      </section>

      <SampleBand />
    </>
  );
}
