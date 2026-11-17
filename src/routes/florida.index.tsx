import { createFileRoute, Link } from "@tanstack/react-router";
import { FLORIDA_COUNTIES, TRADES } from "@/data/ltb";
import { breadcrumbLd, pageHead } from "@/lib/seo";
import { Breadcrumbs, PageIntro } from "@/components/site/ui";

export const Route = createFileRoute("/florida/")({
  head: () =>
    pageHead({
      title: "Florida Government Bids | LocalTradeBids",
      description:
        "Public construction and property-services bids from government agencies in Florida, listed by county and trade, with links to the official notice.",
      path: "/florida",
      jsonLd: [breadcrumbLd([{ name: "Home", path: "/" }, { name: "Florida", path: "/florida" }])],
    }),
  component: Page,
});

function Page() {
  return (
    <>
      <Breadcrumbs
        items={[
          { name: "Home", to: <Link to="/" className="link">Home</Link> },
          { name: "Florida" },
        ]}
      />
      <PageIntro title="Government bids in Florida">
        Browse by county or trade. Each listing links to the official notice.
      </PageIntro>
      <section className="mt-8" aria-labelledby="trades">
        <h2 id="trades" className="text-xl font-bold text-brand">By trade</h2>
        <ul className="mt-3 flex flex-wrap gap-3">
          {TRADES.map((t) => (
            <li key={t.slug}>
              <Link
                to="/florida/trade/$trade"
                params={{ trade: t.slug }}
                className="link"
              >
                {t.name} bids across Florida
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <section className="mt-10" aria-labelledby="counties">
        <h2 id="counties" className="text-xl font-bold text-brand">By county</h2>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2 md:grid-cols-3">
          {FLORIDA_COUNTIES.map((c) => (
            <li key={c.slug}>
              <Link to="/florida/$county" params={{ county: c.slug }} className="link">
                {c.name} County
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
