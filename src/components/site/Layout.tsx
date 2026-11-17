import { useLayoutEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { SITE } from "@/config/site";
import { LogoMark } from "./ui";

export const FOOTER_OPERATED_BY =
  "Operated by IronRoot Consulting LLC d/b/a LocalTradeBids " +
  "[subject to fictitious-name registration].";

export const FOOTER_AFFILIATION =
  "LocalTradeBids is an independent service of IronRoot Consulting LLC d/b/a " +
  "LocalTradeBids [subject to fictitious-name registration]. We are not a " +
  "government agency or an official bid portal, and we are not affiliated with " +
  "or endorsed by any agency we list. Agency names identify the source of each " +
  "notice and belong to their owners.";

export const FOOTER_COPYRIGHT =
  "\u00A9 2026 IronRoot Consulting LLC d/b/a LocalTradeBids " +
  "[subject to fictitious-name registration]";

const NAV = [
  { to: "/how-it-works", label: "How it works" },
  { to: "/pricing", label: "Pricing" },
  { to: "/florida", label: "Florida" },
  { to: "/faq", label: "FAQ" },
] as const;

export function Header() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [menuOpen, setMenuOpen] = useState(false);

  useLayoutEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <header className="site-header">
      <div className="container-site flex h-16 items-center justify-between gap-4">
        <Link
          to="/"
          className="flex items-center gap-2 font-bold text-brand"
          aria-label="LocalTradeBids home"
        >
          <LogoMark />
          <span className="text-lg">LocalTradeBids</span>
        </Link>
        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="nav-link"
              activeProps={{ "aria-current": "page" }}
            >
              {n.label}
            </Link>
          ))}
          <Link to="/signup" className="btn-primary ml-2">Get bid alerts</Link>
        </nav>
        <details className="mobile-menu md:hidden" open={menuOpen}>
          <summary
            className="btn-outline"
            onClick={(event) => {
              event.preventDefault();
              setMenuOpen((open) => !open);
            }}
          >
            Menu
          </summary>
          <nav
            aria-label="Mobile"
            className="mobile-panel"
            onClick={(event) => {
              if ((event.target as Element).closest("a")) setMenuOpen(false);
            }}
          >
            {NAV.map((n) => (
              <Link key={n.to} to={n.to} className="nav-link block">{n.label}</Link>
            ))}
            <Link to="/signup" className="btn-primary mt-2 w-full">Get bid alerts</Link>
          </nav>
        </details>
      </div>
    </header>
  );
}

function BillingLink() {
  // Hidden until checkout is live (Bernard, Nov 17, 2026). Once live it shows
  // on every page, per More 04 A3.
  if (!SITE.checkoutLive) return null;
  if (SITE.billingPortalUrl) {
    return (
      <a href={SITE.billingPortalUrl} className="link" rel="noopener">
        Manage billing
      </a>
    );
  }
  return <Link to="/manage" className="link">Manage billing</Link>;
}

export function Footer() {
  return (
    <footer className="mt-16 border-t border-border bg-card">
      <div className="container-site grid gap-4 py-10 text-sm text-slate">
        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            <li><Link to="/how-it-works" className="link">How it works</Link></li>
            <li><Link to="/pricing" className="link">Pricing</Link></li>
            <li><Link to="/faq" className="link">FAQ</Link></li>
            <li><Link to="/coming-soon" className="link">Other states</Link></li>
            <li><Link to="/terms" className="link">Terms of Service</Link></li>
            <li><Link to="/privacy" className="link">Privacy Policy</Link></li>
            <li>
              <Link to="/terms" hash="refund-policy" className="link">
                Refunds & Cancellation
              </Link>
            </li>
            {SITE.checkoutLive && <li><BillingLink /></li>}
          </ul>
        </nav>
        <p>{FOOTER_OPERATED_BY}</p>
        <p>{SITE.address}</p>
        <p>
          <a className="link" href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a>
        </p>
        <p>{FOOTER_AFFILIATION}</p>
        <p>{FOOTER_COPYRIGHT}</p>
      </div>
    </footer>
  );
}
