import { describe, it, expect } from "vitest";
import { pageUrlWithState } from "@/routes/coming-soon";

describe("coming-soon state on consent log", () => {
  it("adds the state to the logged page URL", () => {
    expect(pageUrlWithState("GA", "https://localtradebids.com/coming-soon/")).toBe(
      "https://localtradebids.com/coming-soon/?state=GA",
    );
  });
  it("replaces an existing state param", () => {
    expect(pageUrlWithState("TX", "https://localtradebids.com/coming-soon/?state=GA")).toBe(
      "https://localtradebids.com/coming-soon/?state=TX",
    );
  });
});
