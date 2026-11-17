import { createFileRoute, Link } from "@tanstack/react-router";
import { pageHead } from "@/lib/seo";
import { PageIntro, SampleBand, SampleConditions } from "@/components/site/ui";

export const Route = createFileRoute("/signup")({
  head: () =>
    pageHead({
      title: "Sign up | LocalTradeBids",
      description:
        "Get the free weekly sample of Florida public construction bids, or see LocalTradeBids plans.",
      path: "/signup",
    }),
  component: Page,
});

function Page() {
  return (
    <>
      <PageIntro title="Sign up" />
      <div className="flex flex-wrap items-start gap-4">
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
