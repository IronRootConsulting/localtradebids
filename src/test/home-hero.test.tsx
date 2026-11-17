/** @vitest-environment jsdom */
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { HOME_HERO_CTA_LABEL, HomeHeroCta } from "@/components/site/HomeHeroCta";
import { preferencesHref } from "@/components/site/PricingCards";

afterEach(() => cleanup());

describe("home hero CTA", () => {
  it("renders Ignatius's statewide subscribe label and links to /signup/?plan=statewide", () => {
    expect(HOME_HERO_CTA_LABEL).toBe("Subscribe: Statewide, $139/month");
    render(<HomeHeroCta />);
    const link = screen.getByRole("link", { name: "Subscribe: Statewide, $139/month" });
    expect(link.textContent).toBe("Subscribe: Statewide, $139/month");
    expect(link.getAttribute("href")).toBe("/signup/?plan=statewide");
    expect(link.getAttribute("href")).toBe(preferencesHref("statewide"));
  });
});
