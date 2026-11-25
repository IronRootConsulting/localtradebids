/*
 * Location labels carried in the county field of Bede's public page export.
 *
 * "Statewide": a real Florida-wide bid (shown under "Open statewide" on county pages).
 * The two "not listed" labels are SAM.gov badge Option A (Andrew, 6:19 AM ET Nov 25, 2026,
 * via Bernard; SAM label wording Andrew 2:08 PM ET Nov 18; More/Bernard Nov 18 rule):
 *   - FEDERAL_LOCATION_NOT_LISTED: SAM.gov bids with no place of performance.
 *   - COUNTY_NOT_LISTED: other Florida bids with no county we could map.
 * Bede's export puts both in section "unlisted". They appear only on all-Florida
 * views (home and the statewide trade pages), never on county or county+trade pages,
 * never under "Open statewide", and never as a county page, link or sitemap URL.
 * The strings must match Bede's lib/launch_filter.py exactly.
 */
export const STATEWIDE_LABEL = "Statewide";
export const FEDERAL_LOCATION_NOT_LISTED = "Federal, location not listed";
export const COUNTY_NOT_LISTED = "Florida (county not listed)";
export const UNLISTED_LABELS: readonly string[] = [COUNTY_NOT_LISTED, FEDERAL_LOCATION_NOT_LISTED];

export const isStatewideLabel = (county: string) => (county || "").trim() === STATEWIDE_LABEL;
export const isUnlistedLabel = (county: string) => UNLISTED_LABELS.includes((county || "").trim());

/** Badge next to a bid title where there is no County column: the label, or "" for a county-local bid. */
export const locationBadge = (county: string) =>
  isStatewideLabel(county) || isUnlistedLabel(county) ? (county || "").trim() : "";
