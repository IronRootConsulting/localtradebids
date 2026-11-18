import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { PUBLIC_PAGES_AS_OF, type Trade } from "@/data/ltb";
import type { County } from "@/data/ltb";
import {
  formatUpdated,
  getCounty,
  getTrade,
  nearbyCounties,
  countyTradePageKey,
  getPageSample,
  type PageSample,
} from "@/data/helpers";
import {
  breadcrumbLd,
  countyTradeMeta,
  countyTradeTitle,
  pageHead,
} from "@/lib/seo";
import {
  BidTable,
  Breadcrumbs,
  CountLine,
  EmailPanel,
  LISTINGS_CAPTION,
  MoreForSubscribers,
  NoOpenBids,
  StatewideEmailPanel,
} from "@/components/site/ui";

/** Used by this file (paste set) and by florida.trade.$trade.tsx (NEW-FILES). */
export function StatewideTradeView({ trade, sample }: { trade: Trade; sample: PageSample }) {
  const updated = formatUpdated(PUBLIC_PAGES_AS_OF);
  return (
    <>
      <Breadcrumbs
        items={[
          { name: "Home", to: <Link to="/" className="link">Home</Link> },
          { name: "Florida", to: <Link to="/florida" className="link">Florida</Link> },
          { name: trade.name },
        ]}
      />
      <h1 className="text-3xl font-bold tracking-tight text-brand">
        {trade.name} bids across Florida
      </h1>
      <p className="mt-3 max-w-3xl text-slate">
        Public {trade.lc} bids from government agencies in Florida, listed by county.
      </p>
      <p className="mt-2 text-slate">{trade.scope}</p>
      <CountLine count={sample.openCount} updated={updated} qualifier={trade.lc} />
      {sample.openCount > 0 ? (
        <div className="mt-6">
          <BidTable bids={sample.rows} cols="home" caption={LISTINGS_CAPTION} />
          <MoreForSubscribers more={sample.moreCount} />
        </div>
      ) : null}
      <StatewideEmailPanel tradeLc={trade.lc} />
    </>
  );
}

export function CountyTradeView({
  county,
  trade,
  sample,
}: {
  county: County;
  trade: Trade;
  sample: PageSample;
}) {
  const updated = formatUpdated(PUBLIC_PAGES_AS_OF);
  return (
    <>
      <Breadcrumbs
        items={[
          { name: "Home", to: <Link to="/" className="link">Home</Link> },
          { name: "Florida", to: <Link to="/florida" className="link">Florida</Link> },
          {
            name: `${county.name} County`,
            to: (
              <Link to="/florida/$county" params={{ county: county.slug }} className="link">
                {county.name} County
              </Link>
            ),
          },
          { name: trade.name },
        ]}
      />
      <h1 className="text-3xl font-bold tracking-tight text-brand">
        {trade.name} bids in {county.name} County, Florida
      </h1>
      <p className="mt-3 max-w-3xl text-slate">
        {sample.statewideCount > 0
          ? `Public ${trade.lc} bids from government agencies in ${county.name} County, plus statewide ${trade.lc} bids, labeled Statewide.`
          : `Public ${trade.lc} bids from government agencies in ${county.name} County.`}{" "}
        We list the facts and link to the agency's notice.
      </p>
      <p className="mt-2 text-slate">{trade.scope}</p>
      <CountLine count={sample.openCount} updated={updated} qualifier={trade.lc} statewide={sample.statewideCount} />
      {sample.openCount === 0 ? (
        <NoOpenBids countyName={county.name} tradeName={trade.lc} />
      ) : (
        <div className="mt-6">
          <BidTable bids={sample.rows} cols="trade" caption={LISTINGS_CAPTION} />
          <MoreForSubscribers more={sample.moreCount} />
        </div>
      )}
      <EmailPanel countyName={county.name} tradeLc={trade.lc} />
      <NearbyTradeLinks countySlug={county.slug} trade={trade} />
    </>
  );
}

function NearbyTradeLinks({
  countySlug,
  trade,
}: {
  countySlug: string;
  trade: Trade;
}) {
  const nearby = nearbyCounties(countySlug, trade.slug);
  if (nearby.length === 0) return null;
  return (
    <p className="mt-6 text-slate">
      {trade.name} bids in{" "}
      {nearby.map((c, i) => (
        <span key={c.slug}>
          {i > 0 ? ", " : ""}
          <Link
            to="/florida/$county/$trade"
            params={{ county: c.slug, trade: trade.slug }}
            className="link"
          >
            {c.name} County
          </Link>
        </span>
      ))}
    </p>
  );
}

export const Route = createFileRoute("/florida/$county/$trade")({
  loader: ({ params }) => {
    const trade = getTrade(params.trade);
    if (!trade) throw notFound();
    const county = getCounty(params.county);
    if (!county) throw notFound();
    return {
      county,
      trade,
      sample: getPageSample(countyTradePageKey(county.slug, trade.slug)),
    };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return pageHead({ title: "Not found", description: "", path: "/florida", noindex: true });
    }
    const { county, trade, sample } = loaderData;
    const path = `/florida/${county.slug}/${trade.slug}`;
    return pageHead({
      title: countyTradeTitle(trade, county.name),
      description: countyTradeMeta(trade, county.name, sample.statewideCount > 0),
      path,
      noindex: sample.openCount === 0,
      jsonLd: [
        breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Florida", path: "/florida" },
          { name: `${county.name} County`, path: `/florida/${county.slug}` },
          { name: trade.name, path },
        ]),
      ],
    });
  },
  component: Page,
});

function Page() {
  const { county, trade, sample } = Route.useLoaderData();
  return <CountyTradeView county={county} trade={trade} sample={sample} />;
}
