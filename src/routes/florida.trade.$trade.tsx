import { createFileRoute, notFound } from "@tanstack/react-router";
import { getTrade, getPageSample, tradePageKey } from "@/data/helpers";
import {
  breadcrumbLd,
  pageHead,
  statewideTradeMeta,
  statewideTradeTitle,
} from "@/lib/seo";
import { StatewideTradeView } from "@/routes/florida.$county.$trade";

export const Route = createFileRoute("/florida/trade/$trade")({
  loader: ({ params }) => {
    const trade = getTrade(params.trade);
    if (!trade) throw notFound();
    return { trade, sample: getPageSample(tradePageKey(trade.slug)) };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return pageHead({
        title: "Not found",
        description: "",
        path: "/florida",
        noindex: true,
      });
    }
    const { trade, sample } = loaderData;
    const path = `/florida/trade/${trade.slug}`;
    return pageHead({
      title: statewideTradeTitle(trade),
      description: statewideTradeMeta(trade),
      path,
      noindex: sample.openCount === 0,
      jsonLd: [
        breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Florida", path: "/florida" },
          { name: trade.name, path },
        ]),
      ],
    });
  },
  component: TradePage,
});

function TradePage() {
  const { trade, sample } = Route.useLoaderData();
  return <StatewideTradeView trade={trade} sample={sample} />;
}
