import { CARD_RENEWAL_LINE, PLANS, preferencesHref } from "@/components/site/PricingCards";
import { SITE } from "@/config/site";

const statewidePlan = PLANS.find((plan) => plan.key === "statewide");
if (!statewidePlan) throw new Error("Missing statewide plan");

/** Ignatius hero CTA label. Built from the statewide plan so the price stays in sync. */
export const HOME_HERO_CTA_LABEL = `Subscribe: ${statewidePlan.name}, $${statewidePlan.price}/month`;

export function HomeHeroCta() {
  return (
    <div className="grid max-w-full min-w-0 gap-2">
      <a
        href={preferencesHref("statewide")}
        className="btn-primary w-fit max-w-full min-w-0 whitespace-normal text-center"
      >
        {HOME_HERO_CTA_LABEL}
      </a>
      {SITE.checkoutLive ? <p className="max-w-xs text-slate">{CARD_RENEWAL_LINE}</p> : null}
    </div>
  );
}
