import { createFileRoute } from "@tanstack/react-router";
import { pageHead } from "@/lib/seo";
import { PageIntro } from "@/components/site/ui";
import { PreviewCheckoutNotice } from "@/components/site/PreviewCheckoutNotice";
import { PreferencesForm } from "@/components/site/PreferencesForm";
import { SIGNUP_COPY } from "@/data/signupCopy";

type SignupSearch = {
  plan?: string;
  state?: string;
  area?: string;
  trades?: string;
  delivery?: string;
};

export const Route = createFileRoute("/signup")({
  validateSearch: (s: Record<string, unknown>): SignupSearch => {
    const str = (k: string) => (typeof s[k] === "string" && s[k].trim() ? s[k] : undefined);
    const out: SignupSearch = {};
    const plan = str("plan");
    const state = str("state");
    const area = str("area");
    const trades = str("trades");
    const delivery = str("delivery");
    if (plan) out.plan = plan;
    if (state) out.state = state;
    if (area) out.area = area;
    if (trades) out.trades = trades;
    if (delivery) out.delivery = delivery;
    return out;
  },
  head: () => {
    const head = pageHead({
      title: "Set up your bid alerts | LocalTradeBids",
      description:
        "Pick your coverage, your trades, and how often you want your LocalTradeBids email, then continue to checkout.",
      path: "/signup",
    });
    return {
      ...head,
      // Checkout URL includes prefilled_email; do not leak it via Referer.
      meta: [...head.meta, { name: "referrer", content: "no-referrer" }],
    };
  },
  component: Page,
});

function Page() {
  return (
    <div className="signup-page mx-auto w-full max-w-3xl">
      <PageIntro title={SIGNUP_COPY.heading}>{SIGNUP_COPY.intro}</PageIntro>
      <PreviewCheckoutNotice variant="long" className="mb-6" />
      <PreferencesForm />
    </div>
  );
}
