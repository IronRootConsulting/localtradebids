// GitHub Pages static export. Serves under /localtradebids/
// (https://ironrootconsulting.github.io/localtradebids/).
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

const BASE = "/localtradebids/";

export default defineConfig({
  vite: {
    base: BASE,
  },
  // github_pages/static nitro preset fights TanStack Start prerender
  // (it only crawls / and /404.html, then fails the nitro SSR step).
  // Default Lovable/Nitro build plus Start prerender writes HTML into
  // .output/public, which the Pages workflow uploads.
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    server: { entry: "server" },
    router: { basepath: "/localtradebids" },
    prerender: { enabled: true, crawlLinks: false, autoSubfolderIndex: true },
    pages: [
      { path: "/" }, { path: "/coming-soon" }, { path: "/contact" }, { path: "/faq" }, { path: "/florida" }, { path: "/how-it-works" }, { path: "/pricing" }, { path: "/privacy" },
      { path: "/signup" }, { path: "/terms" }, { path: "/thank-you" }, { path: "/manage" }, { path: "/florida/alachua" }, { path: "/florida/baker" }, { path: "/florida/bay" },
      { path: "/florida/bradford" }, { path: "/florida/brevard" }, { path: "/florida/broward" }, { path: "/florida/calhoun" }, { path: "/florida/charlotte" }, { path: "/florida/citrus" },
      { path: "/florida/clay" }, { path: "/florida/collier" }, { path: "/florida/columbia" }, { path: "/florida/desoto" }, { path: "/florida/dixie" }, { path: "/florida/duval" },
      { path: "/florida/escambia" }, { path: "/florida/flagler" }, { path: "/florida/franklin" }, { path: "/florida/gadsden" }, { path: "/florida/gilchrist" }, { path: "/florida/glades" },
      { path: "/florida/gulf" }, { path: "/florida/hamilton" }, { path: "/florida/hardee" }, { path: "/florida/hendry" }, { path: "/florida/hernando" }, { path: "/florida/highlands" },
      { path: "/florida/hillsborough" }, { path: "/florida/holmes" }, { path: "/florida/indian-river" }, { path: "/florida/jackson" }, { path: "/florida/jefferson" }, { path: "/florida/lafayette" },
      { path: "/florida/lake" }, { path: "/florida/lee" }, { path: "/florida/leon" }, { path: "/florida/levy" }, { path: "/florida/liberty" }, { path: "/florida/madison" },
      { path: "/florida/manatee" }, { path: "/florida/marion" }, { path: "/florida/martin" }, { path: "/florida/miami-dade" }, { path: "/florida/monroe" }, { path: "/florida/nassau" },
      { path: "/florida/okaloosa" }, { path: "/florida/okeechobee" }, { path: "/florida/orange" }, { path: "/florida/osceola" }, { path: "/florida/palm-beach" }, { path: "/florida/pasco" },
      { path: "/florida/pinellas" }, { path: "/florida/polk" }, { path: "/florida/putnam" }, { path: "/florida/st-johns" }, { path: "/florida/st-lucie" }, { path: "/florida/santa-rosa" },
      { path: "/florida/sarasota" }, { path: "/florida/seminole" }, { path: "/florida/sumter" }, { path: "/florida/suwannee" }, { path: "/florida/taylor" }, { path: "/florida/union" },
      { path: "/florida/volusia" }, { path: "/florida/wakulla" }, { path: "/florida/walton" }, { path: "/florida/washington" }, { path: "/florida/alachua/electrical" },
      { path: "/florida/bay/commercial-general-contracting" }, { path: "/florida/bay/sitework-heavy-civil" }, { path: "/florida/brevard/commercial-general-contracting" },
      { path: "/florida/brevard/sitework-heavy-civil" }, { path: "/florida/broward/sitework-heavy-civil" }, { path: "/florida/charlotte/commercial-general-contracting" },
      { path: "/florida/charlotte/electrical" }, { path: "/florida/charlotte/roofing" }, { path: "/florida/columbia/sitework-heavy-civil" }, { path: "/florida/escambia/electrical" },
      { path: "/florida/hernando/commercial-general-contracting" }, { path: "/florida/hillsborough/commercial-general-contracting" }, { path: "/florida/lake/sitework-heavy-civil" },
      { path: "/florida/miami-dade/commercial-general-contracting" }, { path: "/florida/miami-dade/sitework-heavy-civil" }, { path: "/florida/monroe/sitework-heavy-civil" },
      { path: "/florida/nassau/commercial-general-contracting" }, { path: "/florida/nassau/sitework-heavy-civil" }, { path: "/florida/orange/sitework-heavy-civil" },
      { path: "/florida/palm-beach/roofing" }, { path: "/florida/pinellas/electrical" }, { path: "/florida/polk/plumbing-hvac" }, { path: "/florida/polk/sitework-heavy-civil" },
      { path: "/florida/santa-rosa/sitework-heavy-civil" }, { path: "/florida/st-johns/sitework-heavy-civil" }, { path: "/florida/trade/roofing" }, { path: "/florida/trade/electrical" },
      { path: "/florida/trade/plumbing-hvac" }, { path: "/florida/trade/sitework-heavy-civil" }, { path: "/florida/trade/commercial-general-contracting" }, { path: "/florida/trade/landscaping" },
      { path: "/florida/trade/painting" },
    ]
  },
});
