import { Link } from "@tanstack/react-router";
import { useState, type FormEvent, type ReactNode } from "react";
import { SITE, sampleFilters, submitConsentLog } from "@/config/site";
import { formatDue } from "@/data/helpers";
import { FLORIDA_COUNTIES, TRADES, type Bid } from "@/data/ltb";
import { isUnlistedLabel, locationBadge } from "@/data/locationLabels";

export const SAMPLE_CONDITIONS =
  "No card needed, and it never turns into a paid plan. " +
  "Sample emails also include information about our paid plans.";

export const LISTINGS_CAPTION =
  "Listings summarize public agency notices and link to the source. " +
  "LocalTradeBids is not affiliated with any agency. Always confirm details " +
  "on the agency's official notice.";

export const SAMPLE_CONSENT_OPT_IN =
  "By signing up, you agree to get the free weekly sample by email. " +
  "Unsubscribe anytime with the link in any email. See our Privacy Policy.";

export const SAMPLE_DETAILS =
  "Every Monday, around 7:30 AM ET: up to 10 of the newest open bids statewide, " +
  "across all eight trades. Only bids from sources we've cleared, and never " +
  "past-due bids. Free, with no purchase needed. Every sample email has an " +
  "unsubscribe link and our mailing address.";

export const SAMPLE_SUCCESS =
  "You're signed up. Your first sample arrives Monday, around 7:30 AM ET.";

/** More rev2 marketing opt-in (claims review / v3). Unchecked, not required. */
export const MARKETING_OPT_IN_TEXT =
  "Also email me occasional news and plan updates from LocalTradeBids. " +
  "Optional. Unsubscribe anytime.";

export const MARKETING_OPT_IN_VERSION = "more-rev2-marketing-optin-v1";
export const MARKETING_OPT_IN_DEFAULT_CHECKED = false;

export function MarketingOptIn({ formId }: { formId: string }) {
  return (
    <label
      className="flex items-start gap-2 text-sm text-slate"
      data-marketing-opt-in="true"
      data-consent-text-version={MARKETING_OPT_IN_VERSION}
      data-form-id={formId}
    >
      <input
        type="checkbox"
        name="marketing_opt_in"
        className="mt-1 h-4 w-4"
        defaultChecked={MARKETING_OPT_IN_DEFAULT_CHECKED}
      />
      <span>{MARKETING_OPT_IN_TEXT}</span>
      <input type="hidden" name="marketing_text_version" value={MARKETING_OPT_IN_VERSION} />
      <input type="hidden" name="form_id" value={formId} />
    </label>
  );
}

export function TradeScopeList() {
  return (
    <ul className="mt-3 list-disc space-y-2 pl-5 text-slate">
      {TRADES.map((tr) => (
        <li key={tr.slug}>
          <strong>{tr.name}:</strong> {tr.scope}
        </li>
      ))}
    </ul>
  );
}

export function Placeholder() {
  return <span className="tag-placeholder">[PLACEHOLDER]</span>;
}

export function LogoMark({ size = 32 }: { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      width={size}
      height={size}
      aria-hidden="true"
    >
      <rect width="32" height="32" rx="7" fill="#0f2742" />
      <path d="M8 23V9h3v11h6v3zM15 9h10v3h-3.5v11h-3V12H15z" fill="#fff" />
    </svg>
  );
}

export function PlaceholderBox({ children }: { children: ReactNode }) {
  return <div className="placeholder-box">{children}</div>;
}

export function PageIntro({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <header className="mb-8">
      <h1 className="text-3xl font-bold tracking-tight text-brand sm:text-4xl">{title}</h1>
      {children && <div className="mt-3 max-w-2xl text-lg text-slate">{children}</div>}
    </header>
  );
}

export function ExternalWaitlist({ className = "btn-outline" }: { className?: string }) {
  return (
    <a href={SITE.waitlistUrl} target="_blank" rel="noopener" className={className}>
      Join the waitlist
    </a>
  );
}

export function SampleConditions() {
  return <p className="mt-1 text-sm text-slate">{SAMPLE_CONDITIONS}</p>;
}

const LEGAL_DOC_CLASS = [
  "legal-doc max-w-3xl text-slate leading-7",
  "[&_h1]:mb-4 [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:text-brand",
  "[&_h2]:mt-10 [&_h2]:mb-3 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-brand",
  "[&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-ink",
  "[&_h4]:mt-4 [&_h4]:mb-2 [&_h4]:text-base [&_h4]:font-semibold [&_h4]:text-ink",
  "[&_p]:mt-3 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-6",
  "[&_ol]:mt-3 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:mt-1",
  "[&_blockquote]:mt-4 [&_blockquote]:rounded-md [&_blockquote]:border-l-4",
  "[&_blockquote]:border-amber-400 [&_blockquote]:bg-amber-50 [&_blockquote]:p-4",
  "[&_blockquote]:text-ink [&_table]:mt-4 [&_table]:w-full [&_table]:border-collapse",
  "[&_table]:text-sm [&_th]:border [&_th]:border-border [&_th]:p-2 [&_th]:text-left",
  "[&_td]:border [&_td]:border-border [&_td]:p-2 [&_td]:align-top",
  "[&_hr]:my-8 [&_strong]:text-ink",
].join(" ");

function wrapLegalTables(html: string): string {
  return html.replace(/<table\b[\s\S]*?<\/table>/gi, (table) => `<div class="legal-table-wrap">${table}</div>`);
}

export function LegalDoc({ html, id }: { html: string; id?: string }) {
  return (
    <article
      id={id}
      className={LEGAL_DOC_CLASS}
      dangerouslySetInnerHTML={{ __html: wrapLegalTables(html) }}
    />
  );
}

export function DraftNotice() {
  return (
    <p className="mb-6 inline-block rounded-md border border-amber-300 bg-amber-50 px-3 py-1 text-sm font-semibold text-amber-900">
      DRAFT &mdash; not final. Under review.
    </p>
  );
}

export type BidTableCols = "home" | "county" | "trade";

/**
 * County and county+trade pages: "In your area" first, then "Open statewide" (same order as the digests).
 * A section with no shown rows is left out. Statewide rows keep their Statewide label.
 */
export function SectionedBidTables({
  localRows,
  statewideRows,
  cols,
}: {
  localRows: Bid[];
  statewideRows: Bid[];
  cols: BidTableCols;
}) {
  return (
    <>
      {localRows.length > 0 ? (
        <section aria-labelledby="bids-local">
          <h2 id="bids-local" className="bid-section-heading">In your area</h2>
          <BidTable bids={localRows} cols={cols} caption={LISTINGS_CAPTION} />
        </section>
      ) : null}
      {statewideRows.length > 0 ? (
        <section aria-labelledby="bids-statewide" className={localRows.length > 0 ? "mt-6" : undefined}>
          <h2 id="bids-statewide" className="bid-section-heading">Open statewide</h2>
          <BidTable
            bids={statewideRows}
            cols={cols}
            caption={localRows.length > 0 ? undefined : LISTINGS_CAPTION}
          />
        </section>
      ) : null}
    </>
  );
}

export function BidTable({
  bids,
  cols,
  caption,
}: {
  bids: Bid[];
  cols: BidTableCols;
  caption?: ReactNode;
}) {
  return (
    <div className="bid-table-wrap">
      <table className="bid-table">
        {caption ? <caption className="bid-caption">{caption}</caption> : null}
        <thead>
          <tr>
            <th scope="col">Agency</th>
            <th scope="col">Title</th>
            {cols === "home" ? <th scope="col">County</th> : null}
            {cols === "county" ? <th scope="col">Trade</th> : null}
            <th scope="col">Due date</th>
            <th scope="col">Official notice</th>
          </tr>
        </thead>
        <tbody>
          {bids.map((b) => {
            const trade = TRADES.find((t) => t.slug === b.trade);
            return (
              <tr key={b.id}>
                <td className="bid-agency">{b.agency}</td>
                <td className="bid-title">
                  {b.title}
                  {cols !== "home" && locationBadge(b.county) ? (
                    <span className={isUnlistedLabel(b.county) ? "bid-statewide bid-unlisted" : "bid-statewide"}>
                      {locationBadge(b.county)}
                    </span>
                  ) : null}
                </td>
                {cols === "home" ? (
                  <td
                    className={isUnlistedLabel(b.county) ? "bid-field bid-unlisted-cell" : "bid-field"}
                    data-label="County"
                  >
                    {b.county}
                  </td>
                ) : null}
                {cols === "county" ? <td className="bid-field" data-label="Trade">{trade?.name ?? b.trade}</td> : null}
                <td className="bid-field" data-label="Due date">{b.dueDateISO ? formatDue(b.dueDateISO) : b.dueDate || "Not listed"}</td>
                <td className="bid-notice">
                  <a
                    href={b.sourceUrl}
                    target="_blank"
                    rel="noopener nofollow"
                    className="link bid-notice-link"
                  >
                    View official notice
                    <span className="sr-only">: {b.title}</span>
                  </a>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export function CountLine({
  count,
  updated,
  qualifier,
  statewide,
}: {
  count: number;
  updated: string;
  qualifier?: string;
  /** County and county+trade pages: Statewide bids included in count (Andrew 2:01 AM ET Nov 18). */
  statewide?: number;
}) {
  if (count <= 0 || !updated) return null;
  const sw = statewideIncludedText(statewide);
  return (
    <p className="mt-2 text-slate">
      {countLineText(count, updated, qualifier)}
      {sw ? ` ${sw}` : null}
    </p>
  );
}

/** Honest-count note: the open count above includes N Statewide bids. */
export function statewideIncludedText(statewide?: number): string {
  if (typeof statewide !== "number" || !(statewide > 0)) return "";
  return statewide === 1
    ? "This includes 1 statewide bid, labeled Statewide."
    : `This includes ${statewide} statewide bids, labeled Statewide.`;
}

/** Count line text; "bid" is singular when count is 1. */
export function countLineText(count: number, updated: string, qualifier?: string): string {
  const noun = count === 1 ? "bid" : "bids";
  return qualifier
    ? `${count} open ${qualifier} ${noun} as of ${updated}.`
    : `${count} open ${noun} listed as of ${updated}.`;
}

/** LTB copy v5.4: one more line on every page type, hidden when N is 0 or unknown. */
export const moreForSubscribersText = (more: number) => `+${more} more open bids for subscribers.`;

export function MoreForSubscribers({ more }: { more?: number | undefined }) {
  if (typeof more !== "number" || !(more > 0)) return null;
  return (
    <p className="mt-3 font-medium text-ink">
      {moreForSubscribersText(more)}{" "}
      <Link to="/pricing" className="link">See plans</Link>
    </p>
  );
}

export function SampleBand() {
  const [status, setStatus] = useState<"idle" | "invalid" | "ok">("idle");

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement | null)?.value ?? "";
    if (!email.includes("@")) {
      setStatus("invalid");
      return;
    }
    const box = form.elements.namedItem("marketing_opt_in") as HTMLInputElement | null;
    submitConsentLog({
      email,
      marketingChecked: box?.checked === true,
      checkboxText: MARKETING_OPT_IN_TEXT,
      textVersion: MARKETING_OPT_IN_VERSION,
      formName: "sample-band",
      pageUrl: typeof location !== "undefined" ? location.href : "",
      // Andrew Nov 18, 1:48 AM ET: no Trade/County fields; the sample is the
      // newest statewide bids across all trades. Columns I-L still record
      // state FL, county any, trades all, schema v2.
      ...sampleFilters("", ""),
    });
    setStatus("ok");
  }

  return (
    <section className="sample-band mt-14" aria-labelledby="sample-band">
      <h2 id="sample-band" className="text-2xl font-bold text-brand">See it before you pay</h2>
      <p className="mt-2 text-slate">
        Get a free weekly sample of the newest open Florida public construction and
        property-services bids across all eight trades, by email. It's a sample, not
        the full digest. No card needed, and it never turns into a paid plan.
      </p>
      <p className="mt-2 text-slate">{SAMPLE_DETAILS}</p>
      <SampleConditions />
      <form className="mt-4 grid gap-3" onSubmit={onSubmit} noValidate>
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
        <button type="submit" className="btn-primary justify-self-start">Send me the sample</button>
        <p className="text-sm text-slate">
          By signing up, you agree to get the free weekly sample by email.
          Unsubscribe anytime with the link in any email. See our{" "}
          <Link to="/privacy" className="link">Privacy Policy</Link>.
        </p>
        <MarketingOptIn formId="sample-band" />
      </form>
      {status === "invalid" ? (
        <p className="mt-2 text-sm text-ink">Please enter a valid email address.</p>
      ) : null}
      {status === "ok" ? <p className="mt-2 text-sm text-ink">{SAMPLE_SUCCESS}</p> : null}
    </section>
  );
}

export function DigestMockup({ bids }: { bids: Bid[] }) {
  const rows = bids.slice(0, 4);
  const open = bids.slice(0, 3);
  return (
    <section className="digest-mockup mt-14" aria-labelledby="digest-mockup">
      <h2 id="digest-mockup" className="text-2xl font-bold text-brand">
        Your bid email: daily or weekly
      </h2>
      <p className="mt-2 text-slate">
        One email on the schedule you choose, daily or weekly, with the new bids
        that match your trades and area. Daily comes around 7:30 AM ET on weekdays
        (Monday to Friday) when we've found new bids for you. Weekly comes every
        Monday around 7:30 AM ET, or Tuesday when Monday is a federal holiday. Your
        first email lists matching open bids we found in the past week, or tells
        you if there weren't any. After that, each email lists only the new bids
        we've found since your last one, marked "New". Each bid shows the agency,
        title, county, due date and a link. Email only. No texts or sales calls.
      </p>
      <p className="mt-2 text-slate">
        No new bids? There's no daily email that day, except your first email,
        which always goes out and tells you if we didn't find any matching bids.
        The weekly email always comes, with a "No new bids this week" note when
        there's nothing new.
      </p>
      <p className="mt-2 text-slate">
        No email on federal holidays. Weekly emails move to Tuesday when Monday is
        a federal holiday.
      </p>
      <p className="mt-2 text-slate">
        Your weekly email lists the new bids we've found since your last weekly
        email, newest first.
      </p>
      <div className="email-frame mt-4">
        <ul className="grid gap-2">
          {rows.map((b, i) => (
            <li key={b.id} className="flex flex-wrap items-baseline gap-2">
              {i < 2 ? <span className="badge">New</span> : null}
              <span className="font-medium text-ink">{b.title}</span>
              <span className="text-sm text-slate">
                {b.agency} &middot; {b.county} &middot; Due {formatDue(b.dueDateISO)}
              </span>
            </li>
          ))}
        </ul>
      </div>
      <div className="email-frame mt-4">
        <p className="font-semibold text-ink">No new bids today</p>
        <ul className="mt-2 grid gap-2">
          {open.map((b) => (
            <li key={`open-${b.id}`} className="text-slate">
              <span className="font-medium text-ink">{b.title}</span>
              {" \u00b7 "}{b.agency} &middot; {b.county} &middot; Due {formatDue(b.dueDateISO)}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function EmailPanel({ tradeLc, countyName }: { tradeLc?: string; countyName: string }) {
  return (
    <section className="card mt-8 p-6" aria-labelledby="email-panel">
      <h2 id="email-panel" className="text-xl font-bold text-brand">Get these by email</h2>
      <p className="mt-2 text-slate">
        {tradeLc
          ? `Get ${countyName} County ${tradeLc} bids in your daily or weekly email.`
          : `Get ${countyName} County bids in your daily or weekly email. County plan $39/mo.`}
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <Link to="/pricing" className="btn-primary">See plans</Link>
        {tradeLc ? (
          <span>
            <Link to="/" hash="sample-band" className="link">Get the free weekly sample</Link>
            <SampleConditions />
          </span>
        ) : null}
      </div>
    </section>
  );
}

/** LTB copy v5.2/v5.3 no-bids line (4A/4B pages pass trade_lc; Home search passes the Trade name). */
export function noOpenBidsText(countyName: string, trade?: string): string {
  return trade
    ? `No open ${trade} bids are listed for ${countyName} County right now. ` +
        "Get the free weekly sample, or check a nearby county."
    : `No open bids are listed for ${countyName} County right now. ` +
        "Get the free weekly sample, or check a nearby county.";
}

/** LTB copy v5.2/v5.3 4C: statewide trade page "Get these by email" panel. */
export function StatewideEmailPanel({ tradeLc }: { tradeLc: string }) {
  return (
    <section className="card mt-8 p-6" aria-labelledby="email-panel">
      <h2 id="email-panel" className="text-xl font-bold text-brand">
        Get {tradeLc} bids by email
      </h2>
      <p className="mt-2 text-slate">
        Get Florida {tradeLc} bids in your daily or weekly email. Statewide plan $139/mo, or
        pick one county or a region.
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <Link to="/pricing" className="btn-primary">See plans</Link>
        <span>
          <Link to="/" hash="sample-band" className="link">Get the free weekly sample</Link>
          <SampleConditions />
        </span>
      </div>
    </section>
  );
}

/** LTB copy v5.4 Home "Get these by email" panel. */
export const HOME_PANEL_LINE =
  "Get open bids for your trades and your county or region in one daily or weekly email. " +
  "Plans start at $39/mo.";

export function HomeEmailPanel() {
  return (
    <section className="card mt-8 p-6" aria-labelledby="email-panel">
      <h2 id="email-panel" className="text-xl font-bold text-brand">Get these by email</h2>
      <p className="mt-2 text-slate">{HOME_PANEL_LINE}</p>
      <div className="mt-4 flex flex-wrap gap-3">
        <Link to="/pricing" className="btn-primary">See plans</Link>
      </div>
    </section>
  );
}

export function NoOpenBids({
  countyName,
  tradeName,
}: {
  countyName: string;
  tradeName?: string;
}) {
  return (
    <div className="mt-6 text-slate">
      <p>{noOpenBidsText(countyName, tradeName)}</p>
      <p className="mt-2">
        <Link to="/" hash="sample-band" className="link">Get the free weekly sample</Link>
      </p>
      <SampleConditions />
    </div>
  );
}

export function Breadcrumbs({ items }: { items: { name: string; to?: ReactNode }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6 text-sm text-slate">
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((it, i) => (
          <li key={i} className="flex items-center gap-1">
            {i > 0 && <span aria-hidden="true">&rsaquo;</span>}
            {it.to ?? <span aria-current="page">{it.name}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
