import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { PUBLIC_PAGES_AS_OF, TRADES } from "@/data/ltb";
import {
  formatUpdated,
  getCounty,
  regionForCounty,
  countyPageKey,
  getPageSample,
  tradesWithBidsIn,
} from "@/data/helpers";
import { breadcrumbLd, countyMeta, countyTitle, pageHead } from "@/lib/seo";
import {
  BidTable,
  Breadcrumbs,
  CountLine,
  EmailPanel,
  LISTINGS_CAPTION,
  MoreForSubscribers,
  NoOpenBids,
} from "@/components/site/ui";

export const Route = createFileRoute("/florida/$county/")({
  loader: ({ params }) => {
    const county = getCounty(params.county);
    if (!county) throw notFound();
    const sample = getPageSample(countyPageKey(county.slug));
    return { county, sample };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return pageHead({ title: "Not found", description: "", path: "/florida", noindex: true });
    const { county, sample } = loaderData;
    const path = `/florida/${county.slug}`;
    return pageHead({
      title: countyTitle(county.name),
      description: countyMeta(county.name),
      path,
      noindex: sample.openCount === 0,
      jsonLd: [
        breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Florida", path: "/florida" },
          { name: `${county.name} County`, path },
        ]),
      ],
    });
  },
  component: Page,
});

function RegionLine({ countyName, countySlug }: { countyName: string; countySlug: string }) {
  const region = regionForCounty(countySlug);
  if (!region) return null;
  return (
    <p className="mt-3 text-slate">
      {countyName} is part of the {region.name} region.{" "}
      <Link to="/how-it-works" hash="coverage" className="link">See region coverage</Link>
    </p>
  );
}

function Page() {
  const { county, sample } = Route.useLoaderData();
  const updated = formatUpdated(PUBLIC_PAGES_AS_OF);
  return (
    <>
      <Breadcrumbs
        items={[
          { name: "Home", to: <Link to="/" className="link">Home</Link> },
          { name: "Florida", to: <Link to="/florida" className="link">Florida</Link> },
          { name: `${county.name} County` },
        ]}
      />
      <h1 className="text-3xl font-bold tracking-tight text-brand">
        Government bids in {county.name} County, Florida
      </h1>
      <p className="mt-3 max-w-3xl text-slate">
        Public bid postings from agencies in {county.name} County, sorted by trade.
        Each one links to the official notice.
      </p>
      <CountLine count={sample.openCount} updated={updated} />
      <RegionLine countyName={county.name} countySlug={county.slug} />
      <p className="mt-4 text-sm font-medium text-ink">Show bids for:</p>
      <ul className="mt-2 flex flex-wrap gap-3">
        <li><span className="font-semibold">All trades</span></li>
        {tradesWithBidsIn(county.slug).map((t) => (
          <li key={t.slug}>
            <Link
              to="/florida/$county/$trade"
              params={{ county: county.slug, trade: t.slug }}
              className="link"
            >
              {(t.slug === "commercial-general-contracting" ? t.shortName : t.name) +
                " bids in " +
                county.name +
                " County"}
            </Link>
          </li>
        ))}
      </ul>
      {sample.openCount === 0 ? (
        <NoOpenBids countyName={county.name} />
      ) : (
        <div className="mt-6">
          <BidTable bids={sample.rows} cols="county" caption={LISTINGS_CAPTION} />
          <MoreForSubscribers more={sample.moreCount} />
        </div>
      )}
      <EmailPanel countyName={county.name} />
    </>
  );
}
