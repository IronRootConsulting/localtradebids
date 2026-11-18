import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { CARD_RENEWAL_LINE, autorenewHtml } from "@/components/site/PricingCards";

const read = (p: string) => readFileSync(new URL(p, import.meta.url), "utf8");

describe("renewal text placement (Andrew 9:35 PM ET Nov 17, 2026)", () => {
  it("uses the exact short card line", () => {
    expect(CARD_RENEWAL_LINE).toBe(
      "Renews monthly until you cancel. Cancel anytime online. Full terms on the next step.",
    );
  });
  it("cards and hero show the short line, not the full block", () => {
    const cards = read("../components/site/PricingCards.tsx");
    const cardsJsx = cards.slice(cards.indexOf("export function PricingCards"));
    expect(cardsJsx).toContain("{CARD_RENEWAL_LINE}");
    expect(cardsJsx).not.toContain("<AutorenewDisclosure");
    expect(read("../components/site/HomeHeroCta.tsx")).toContain("{CARD_RENEWAL_LINE}");
  });
  it("signup puts the full block directly above Continue", () => {
    const form = read("../components/site/PreferencesForm.tsx");
    const block = form.indexOf("<AutorenewDisclosure");
    const button = form.indexOf('<button type="submit"');
    expect(block).toBeGreaterThan(0);
    expect(button).toBeGreaterThan(block);
    expect(form.slice(block, button)).not.toMatch(/<(p|div|span|a|Link)\b/);
  });
  it("full block text is exact", () => {
    const text = autorenewHtml(89).replace(/<[^>]+>/g, "");
    expect(text).toBe(
      "$89 per month, billed monthly. Renews automatically every month at this price until you cancel. We'll email you at least 30 days before any price change. Cancel online anytime from Manage billing at the bottom of any page. Cancellation takes effect at the end of the month you've paid for, and you won't be charged again. No refunds except billing errors, or a renewal you dispute within 7 days of the charge. By subscribing you agree to our Terms of Service and Refund Policy.",
    );
    expect(autorenewHtml(89)).toMatch(/^<strong>\$89 per month[\s\S]*price change\.<\/strong>/);
  });
});
