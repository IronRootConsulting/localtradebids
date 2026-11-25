import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SITE } from "@/config/site";
import { pageHead } from "@/lib/seo";
import { PageIntro } from "@/components/site/ui";
import { readUnsubToken, submitUnsubscribe, type UnsubOutcome } from "@/lib/unsubscribe";

// [IGNATIUS] Placeholder copy, minimal and neutral. Ignatius owns the final wording;
// replace these strings only with his approved text. Nothing else on the page is copy.
export const UNSUB_COPY = {
  title: "Unsubscribe",
  intro: "Confirm to stop the free weekly sample emails.",
  button: "Unsubscribe",
  working: "Working…",
  paidNote:
    "This doesn't cancel a paid plan. To cancel a paid plan, use Manage billing.",
  unsubscribed: "You're unsubscribed from the free weekly sample emails.",
  already: "You're already unsubscribed from the free weekly sample emails.",
  invalid: "This unsubscribe link isn't valid.",
  expired: "This unsubscribe link has expired.",
  error: "We couldn't confirm your request right now.",
  fallback: "To unsubscribe, email",
  fallbackSubject: "Unsubscribe",
} as const;

export const Route = createFileRoute("/unsubscribe")({
  head: () => {
    const h = pageHead({
      title: "Unsubscribe | LocalTradeBids",
      description: "Unsubscribe from LocalTradeBids sample emails.",
      path: "/unsubscribe",
      noindex: true,
    });
    // The URL carries the token: never send it as a Referer.
    return { ...h, meta: [...(h.meta ?? []), { name: "referrer", content: "no-referrer" }] };
  },
  component: Page,
});

type View = "loading" | "confirm" | "working" | "missing" | UnsubOutcome;

function Fallback() {
  const href = `mailto:${SITE.contactEmail}?subject=${encodeURIComponent(UNSUB_COPY.fallbackSubject)}`;
  return (
    <p className="mt-3">
      {UNSUB_COPY.fallback}{" "}
      <a className="link" href={href}>
        {SITE.contactEmail}
      </a>
      .
    </p>
  );
}

function Page() {
  const [token, setToken] = useState<string | null>(null);
  const [view, setView] = useState<View>("loading");

  // Client only: read the token after hydration. A GET never unsubscribes.
  useEffect(() => {
    const t = readUnsubToken(window.location.search, window.location.hash);
    setToken(t);
    setView(t ? (SITE.unsubscribeEndpoint ? "confirm" : "not_configured") : "missing");
  }, []);

  async function confirm() {
    if (!token) return;
    setView("working");
    setView(await submitUnsubscribe(token));
  }

  return (
    <>
      <PageIntro title={UNSUB_COPY.title} />
      <section className="card max-w-2xl p-6 text-slate" data-unsub-view={view} data-copy-owner="ignatius">
        {(view === "confirm" || view === "working") && (
          <>
            <p>{UNSUB_COPY.intro}</p>
            <p className="mt-4">
              <button type="button" className="btn-primary" onClick={confirm} disabled={view === "working"}>
                {view === "working" ? UNSUB_COPY.working : UNSUB_COPY.button}
              </button>
            </p>
          </>
        )}
        {view === "unsubscribed" && <p>{UNSUB_COPY.unsubscribed}</p>}
        {view === "already_unsubscribed" && <p>{UNSUB_COPY.already}</p>}
        {(view === "missing" || view === "invalid_token") && (
          <>
            <p>{UNSUB_COPY.invalid}</p>
            <Fallback />
          </>
        )}
        {view === "expired" && (
          <>
            <p>{UNSUB_COPY.expired}</p>
            <Fallback />
          </>
        )}
        {(view === "error" || view === "not_configured") && (
          <>
            {view === "error" && <p>{UNSUB_COPY.error}</p>}
            <Fallback />
          </>
        )}
        <p className="mt-6 text-sm">
          {UNSUB_COPY.paidNote} <Link to="/manage" className="link">Manage billing</Link>
        </p>
      </section>
    </>
  );
}
