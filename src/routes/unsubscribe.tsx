import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SITE } from "@/config/site";
import { pageHead } from "@/lib/seo";
import { PageIntro } from "@/components/site/ui";
import { UNSUB_COPY, UNSUB_PAID_LINE } from "@/config/unsubscribeCopy";
import { readUnsubToken, submitUnsubscribe, type UnsubOutcome } from "@/lib/unsubscribe";

// All page copy lives in src/config/unsubscribeCopy.ts (one-file swap for Ignatius's next version).
export { UNSUB_COPY, UNSUB_PAID_LINE };

const LINK_RE = /(bids@localtradebids\.com|https:\/\/localtradebids\.com\/manage\/)/;

/** Renders a copy string unchanged, turning the email address into a mailto link and the URL into a link. */
export function CopyText({ text }: { text: string }) {
  return (
    <>
      {text.split(LINK_RE).map((part, i) =>
        part === "bids@localtradebids.com" ? (
          <a key={i} className="link" href={`mailto:${part}`}>
            {part}
          </a>
        ) : part === "https://localtradebids.com/manage/" ? (
          <a key={i} className="link" href={part}>
            {part}
          </a>
        ) : (
          part
        ),
      )}
    </>
  );
}

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

/**
 * State -> copy slot:
 *   loading (prerendered HTML, before JS) : intro + disabled button; <noscript> shows no-token copy
 *   confirm / working                     : intro + button (disabled while working)
 *   unsubscribed / already_unsubscribed   : success
 *   invalid_token / expired / error       : error + button (the copy says "Try the button again")
 *   not_configured (no endpoint set)      : error, no button (unreachable while unsubscribeEndpoint is set)
 *   missing (no or malformed token)       : no-token
 *   every state                           : paid line (UNSUB_PAID_LINE; omitted when "")
 */
export function UnsubView({ view, onConfirm }: { view: View; onConfirm?: () => void }) {
  const button = (disabled: boolean) => (
    <p className="mt-4">
      <button type="button" className="btn-primary" onClick={onConfirm} disabled={disabled}>
        {UNSUB_COPY.button}
      </button>
    </p>
  );
  const retry = view === "invalid_token" || view === "expired" || view === "error";
  return (
    <section className="card max-w-2xl p-6 text-slate" data-unsub-view={view}>
      {(view === "loading" || view === "confirm" || view === "working") && (
        <>
          <p data-slot="intro">{UNSUB_COPY.intro}</p>
          {button(view !== "confirm")}
          {view === "loading" && (
            <noscript>
              <p data-slot="no-token-noscript">
                <CopyText text={UNSUB_COPY.noToken} />
              </p>
            </noscript>
          )}
        </>
      )}
      {(view === "unsubscribed" || view === "already_unsubscribed") && <p data-slot="success">{UNSUB_COPY.success}</p>}
      {(retry || view === "not_configured") && (
        <>
          <p data-slot="error">
            <CopyText text={UNSUB_COPY.error} />
          </p>
          {retry && button(false)}
        </>
      )}
      {view === "missing" && (
        <p data-slot="no-token">
          <CopyText text={UNSUB_COPY.noToken} />
        </p>
      )}
      {UNSUB_PAID_LINE && (
        <p className="mt-6 text-sm" data-slot="paid">
          <CopyText text={UNSUB_PAID_LINE} />
        </p>
      )}
    </section>
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
      <UnsubView view={view} onConfirm={confirm} />
    </>
  );
}
