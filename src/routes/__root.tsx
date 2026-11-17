import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Footer, Header } from "@/components/site/Layout";
import { orgLd, robotsContent, websiteLd } from "@/lib/seo";
import { withBase } from "@/lib/base";
import { beaconConfig, shouldLoadBeacon } from "@/lib/analytics";

function NotFoundComponent() {
  return (
    <div className="container-site py-20 text-center">
      <h1 className="text-5xl font-bold text-brand">Page not found</h1>
      <p className="mt-4 text-slate">That page doesn't exist or has moved.</p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link to="/" className="btn-primary">Go home</Link>
        <Link to="/florida" className="btn-outline">See Florida bids</Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return (
    <div className="container-site py-20 text-center">
      <h1 className="text-xl font-semibold text-brand">This page didn't load</h1>
      <p className="mt-2 text-sm text-slate">Something went wrong. Try again or head back home.</p>
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        <button onClick={() => { router.invalidate(); reset(); }} className="btn-primary">Try again</button>
        <a href={withBase("/")} className="btn-outline">Go home</a>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "LocalTradeBids" },
      { name: "description", content: "Daily email alerts of government construction bids for contractors." },
      { name: "robots", content: robotsContent() },
      { property: "og:site_name", content: "LocalTradeBids" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/svg+xml", href: withBase("favicon.svg") },
    ],
    scripts: [
      { type: "application/ld+json", children: JSON.stringify(orgLd) },
      { type: "application/ld+json", children: JSON.stringify(websiteLd) },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const beacon = shouldLoadBeacon(pathname);
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <a href="#main" className="skip-link btn-primary">Skip to content</a>
        <Header />
        <main id="main" className="container-site py-10">{children}</main>
        <Footer />
        <Scripts />
        {/* Cloudflare Web Analytics (cookieless; Andrew chose this Nov 17, 2026).
            Snippet as Cloudflare issued it. Never on /signup/ or /thank-you/. */}
        {beacon ? (
          <script
            type="module"
            src="https://static.cloudflareinsights.com/beacon.min.js"
            data-cf-beacon={beaconConfig()}
          />
        ) : null}
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  );
}
