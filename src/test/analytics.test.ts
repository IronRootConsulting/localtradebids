import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { shouldLoadBeacon, beaconConfig } from "@/lib/analytics";

describe("Cloudflare Web Analytics beacon", () => {
  it("loads on normal pages", () => {
    for (const p of ["/", "/pricing/", "/florida/collier/", "/privacy/", "/coming-soon/"]) {
      expect(shouldLoadBeacon(p)).toBe(true);
    }
  });
  it("never loads on the signup step or thank-you page", () => {
    for (const p of ["/signup", "/signup/", "/thank-you", "/thank-you/", "/signup/?plan=county"]) {
      expect(shouldLoadBeacon(p)).toBe(false);
    }
  });
  it("uses Andrew's token", () => {
    expect(JSON.parse(beaconConfig())).toEqual({ token: "e7f6d1677ea94e93b250059483f5bdc6" });
  });
  it("header signup links do a full page load so the beacon cannot follow into /signup/", () => {
    const src = readFileSync("src/components/site/Layout.tsx", "utf8");
    const links = src.match(/<Link to="\/signup"[^>]*>/g) ?? [];
    expect(links.length).toBeGreaterThan(0);
    for (const l of links) expect(l).toContain("reloadDocument");
  });
});
