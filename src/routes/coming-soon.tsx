import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { pageHead } from "@/lib/seo";
import { STATES } from "@/data/ltb";
import { submitConsentLog } from "@/config/site";
import {
  MARKETING_OPT_IN_TEXT,
  MARKETING_OPT_IN_VERSION,
  MarketingOptIn,
  PageIntro,
  SampleConditions,
} from "@/components/site/ui";

export const Route = createFileRoute("/coming-soon")({
  head: () =>
    pageHead({
      title: "Other States Coming Soon | LocalTradeBids",
      description:
        "LocalTradeBids covers Florida today. Join the list to hear when public construction bid alerts open in your state.",
      path: "/coming-soon",
    }),
  component: Page,
});

const OTHER_STATES = STATES.filter((s) => s.code !== "FL");

// Andrew 6:19 PM ET Nov 17, 2026: save the chosen state with each waitlist signup.
// The consent-log form has no state field, so the state rides on the logged page URL as ?state=XX.
export function pageUrlWithState(state: string, href?: string): string {
  const base = href ?? (typeof location !== "undefined" ? location.href : "");
  if (!base) return "";
  try {
    const u = new URL(base);
    u.searchParams.set("state", state);
    return u.toString();
  } catch {
    return base;
  }
}

function Page() {
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");
  const [florida, setFlorida] = useState(false);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const state = (form.elements.namedItem("state") as HTMLSelectElement).value;
    setFlorida(false);
    setOk("");
    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!state) {
      setError("Please choose a state.");
      return;
    }
    if (state === "FL") {
      setError("");
      setFlorida(true);
      return;
    }
    const name = OTHER_STATES.find((s) => s.code === state)?.name ?? state;
    const box = form.elements.namedItem("marketing_opt_in") as HTMLInputElement | null;
    submitConsentLog({
      email,
      marketingChecked: box?.checked === true,
      checkboxText: MARKETING_OPT_IN_TEXT,
      textVersion: MARKETING_OPT_IN_VERSION,
      formName: "coming-soon-waitlist",
      pageUrl: pageUrlWithState(state),
    });
    setError("");
    setOk(`Thanks. You're on the list for ${name}.`);
  }

  return (
    <>
      <PageIntro title="More states are on the way">
        We cover Florida today. Tell us where you work and we'll email you when
        your state opens.
      </PageIntro>
      <form className="card mt-8 grid max-w-xl gap-4 p-5" onSubmit={onSubmit} noValidate>
        <label className="grid gap-1 text-sm font-medium text-ink">
          Work email
          <input
            className="field"
            type="email"
            name="email"
            placeholder="you@company.com"
            autoComplete="email"
            required
          />
        </label>
        <label className="grid gap-1 text-sm font-medium text-ink">
          Your state
          <select className="field" name="state" required defaultValue="">
            <option value="" disabled>
              Select your state
            </option>
            {OTHER_STATES.map((s) => (
              <option key={s.code} value={s.code}>
                {s.name}
              </option>
            ))}
          </select>
        </label>
        <button type="submit" className="btn-primary w-fit">Add me to the list</button>
        <p className="text-sm text-slate">
          We'll email you when LocalTradeBids opens in your state, plus occasional
          updates about our launch. Unsubscribe anytime with the link in any email.
          See our <Link to="/privacy" className="link">Privacy Policy</Link>.
        </p>
        <MarketingOptIn formId="coming-soon-waitlist" />
      </form>
      {error ? <p className="mt-3 text-sm text-ink">{error}</p> : null}
      {ok ? <p className="mt-3 text-sm text-ink">{ok}</p> : null}
      {florida ? (
        <div className="mt-3 text-sm text-ink">
          <p>
            Good news: we already cover Florida.{" "}
            <Link to="/pricing" className="link">See plans</Link>
            {" or "}
            <Link to="/" hash="sample-band" className="link">Get the free weekly sample</Link>.
          </p>
          <SampleConditions />
        </div>
      ) : null}
      <p className="mt-2 text-xs text-muted-foreground">
        Form not connected in this preview.
      </p>
    </>
  );
}
