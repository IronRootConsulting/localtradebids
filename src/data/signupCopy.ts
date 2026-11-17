/** All user-facing strings for the on-site plan preferences step.
 *  Ignatius ltb-preferences-step-v1.md sha256 a053c614edd18a1ae64479d2cf195f696f64b7b15f1b01f38ad7c4cc928ac130
 *  Strings that mention a state name or price use {stateName} / {price} so FL renders byte-identical to that file.
 */
export type SignupCopyVars = {
  stateName?: string;
  price?: number;
};

export const SIGNUP_COPY = {
  heading: "Set up your bid alerts",
  intro: "Pick your coverage, your trades, and how often you want your email.",
  stateLabel: "State",
  stateHelper: "{stateName} only at launch.",
  countyLabel: "County",
  countyPlaceholder: "Choose a county",
  regionLabel: "Region",
  regionPlaceholder: "Choose a region",
  statewideNote: "Your plan covers all of {stateName}, so there's no area to pick.",
  tradesLabel: "Trades",
  tradesHelper: "Pick all that apply.",
  tradesSelectAll: "Select all seven trades",
  deliveryLabel: "Email delivery",
  deliveryDaily: "Daily (weekdays, around 7:30 AM ET)",
  deliveryWeekly: "Weekly (Mondays, around 7:30 AM ET)",
  errorCounty: "Choose a county to continue.",
  errorRegion: "Choose a region to continue.",
  errorTrades: "Pick at least one trade to continue.",
  errorCoverage: "Choose your coverage to continue.",
  errorDelivery: "Choose daily or weekly to continue.",
  submit: "Continue to checkout",
  smallPrint:
    "You'll pay on a checkout page hosted by Stripe. To switch between daily and weekly later, email us and we'll change it within 2 business days.",
  changePlan: "Change plan",
  coverageLabel: "Coverage",
  coverageHelper: "This sets your plan and monthly price.",
  coverageStatewide: "Statewide, all of {stateName}, ${price}/mo",
  coverageRegion: "Region, a group of neighboring counties, ${price}/mo",
  coverageCounty: "County, one county, ${price}/mo",
  // Preview-only notices. Remove both in the same change that sets checkoutLive to true.
  previewCheckoutShort:
    "Preview only: test checkout. No charge, and no subscription starts.",
  previewCheckoutLong:
    "This is a preview. Checkout runs in Stripe's test mode, so nothing is charged and no subscription starts. Please don't enter real card or bank details; use Stripe's test card instead. Paid plans aren't open yet.",
} as const;

export function fillCopy(template: string, vars: SignupCopyVars = {}): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => {
    if (key === "stateName" && vars.stateName !== undefined) return vars.stateName;
    if (key === "price" && vars.price !== undefined) return String(vars.price);
    return match;
  });
}
