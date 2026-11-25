/** @vitest-environment jsdom */
// /unsubscribe/ page: every UI state renders its copy slot verbatim from src/config/unsubscribeCopy.ts,
// with bids@ as a mailto link and the /manage/ URL as a normal link. No network.
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render } from "@testing-library/react";
import { UnsubView } from "@/routes/unsubscribe";
import { UNSUB_COPY, UNSUB_PAID_LINE } from "@/config/unsubscribeCopy";

afterEach(() => cleanup());

type V = Parameters<typeof UnsubView>[0]["view"];
const slot = (c: HTMLElement, name: string) => c.querySelector(`[data-slot="${name}"]`) as HTMLElement | null;
const buttons = (c: HTMLElement) => [...c.querySelectorAll("button")];

function view(v: V) {
  return render(<UnsubView view={v} onConfirm={() => {}} />).container;
}

describe("/unsubscribe/ copy slots by state", () => {
  it("confirm: intro + enabled button", () => {
    const c = view("confirm");
    expect(slot(c, "intro")?.textContent).toBe(UNSUB_COPY.intro);
    expect(buttons(c).map((b) => [b.textContent, b.disabled])).toEqual([[UNSUB_COPY.button, false]]);
    expect(slot(c, "success") ?? slot(c, "error") ?? slot(c, "no-token")).toBeNull();
  });

  it("working: same intro, button disabled with the same label", () => {
    const c = view("working");
    expect(slot(c, "intro")?.textContent).toBe(UNSUB_COPY.intro);
    expect(buttons(c).map((b) => [b.textContent, b.disabled])).toEqual([[UNSUB_COPY.button, true]]);
  });

  it("success (and already unsubscribed): success copy, no button", () => {
    for (const v of ["unsubscribed", "already_unsubscribed"] as const) {
      const c = view(v);
      expect(slot(c, "success")?.textContent).toBe(UNSUB_COPY.success);
      expect(buttons(c)).toHaveLength(0);
      cleanup();
    }
  });

  it("error (invalid, expired, network): error copy with mailto link + retry button", () => {
    for (const v of ["invalid_token", "expired", "error"] as const) {
      const c = view(v);
      const p = slot(c, "error")!;
      expect(p.textContent).toBe(UNSUB_COPY.error);
      const a = [...p.querySelectorAll("a")];
      expect(a.map((x) => [x.textContent, x.getAttribute("href")])).toEqual([
        ["bids@localtradebids.com", "mailto:bids@localtradebids.com"],
      ]);
      expect(buttons(c).map((b) => b.textContent)).toEqual([UNSUB_COPY.button]);
      cleanup();
    }
  });

  it("no token: no-token copy with mailto link, no button", () => {
    const c = view("missing");
    const p = slot(c, "no-token")!;
    expect(p.textContent).toBe(UNSUB_COPY.noToken);
    expect(p.querySelector("a")?.getAttribute("href")).toBe("mailto:bids@localtradebids.com");
    expect(buttons(c)).toHaveLength(0);
  });

  it("paid line on every state, /manage/ URL as a normal link", () => {
    for (const v of ["loading", "confirm", "unsubscribed", "error", "missing"] as const) {
      const c = view(v);
      const p = slot(c, "paid")!;
      expect(p.textContent).toBe(UNSUB_PAID_LINE);
      const a = p.querySelector("a")!;
      expect([a.textContent, a.getAttribute("href")]).toEqual([
        "https://localtradebids.com/manage/",
        "https://localtradebids.com/manage/",
      ]);
      cleanup();
    }
  });

  it("copy keeps the link targets the page turns into links", () => {
    expect(UNSUB_COPY.error).toContain("bids@localtradebids.com");
    expect(UNSUB_COPY.noToken).toContain("bids@localtradebids.com");
    expect(UNSUB_PAID_LINE === "" || UNSUB_PAID_LINE.includes("https://localtradebids.com/manage/")).toBe(true);
  });
});
