import { PLANS, preferencesHref } from "@/components/site/PricingCards";

const statewidePlan = PLANS.find((plan) => plan.key === "statewide");
if (!statewidePlan) throw new Error("Missing statewide plan");

/** Ignatius hero CTA label. Built from the statewide plan so the price stays in sync. */
export const HOME_HERO_CTA_LABEL = `Subscribe: ${statewidePlan.name}, $${statewidePlan.price}/month`;

export function HomeHeroCta() {
  return (
    <a
      href={preferencesHref("statewide")}
      className="btn-primary max-w-full min-w-0 whitespace-normal text-center"
    >
      {HOME_HERO_CTA_LABEL}
    </a>
  );
}
