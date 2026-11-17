import { createFileRoute } from "@tanstack/react-router";
import { pageHead } from "@/lib/seo";
import { PageIntro } from "@/components/site/ui";
import { PreferencesForm } from "@/components/site/PreferencesForm";
import { SIGNUP_COPY } from "@/data/signupCopy";

export const Route = createFileRoute("/signup")({
  head: () =>
    pageHead({
      title: "Set up your bid alerts | LocalTradeBids",
      description:
        "Pick your coverage, your trades, and how often you want your LocalTradeBids email, then continue to checkout.",
      path: "/signup",
    }),
  component: Page,
});

function Page() {
  return (
    <>
      <PageIntro title={SIGNUP_COPY.heading}>{SIGNUP_COPY.intro}</PageIntro>
      <PreferencesForm />
    </>
  );
}
