/** @vitest-environment jsdom */
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { SIGNUP_COPY } from "@/data/signupCopy";
import type { Picks } from "@/lib/submitPicks";

vi.mock("@tanstack/react-router", () => ({
  Link: ({
    to,
    children,
    className,
  }: {
    to: string;
    children: React.ReactNode;
    className?: string;
  }) => (
    <a href={typeof to === "string" ? to : "/"} className={className}>
      {children}
    </a>
  ),
}));

import { PreferencesForm } from "@/components/site/PreferencesForm";

afterEach(() => cleanup());

function inputValue(label: string | RegExp) {
  return (screen.getByLabelText(label) as HTMLInputElement).value;
}

function isChecked(locator: HTMLElement) {
  return (locator as HTMLInputElement).checked;
}

describe("PR-01 Select all eight trades (Ignatius v2.1, Andrew 8:09 AM ET Nov 18)", () => {
  it("shows the exact label, unchecked by default, with Fire & Life Safety last", () => {
    render(<PreferencesForm />);
    const all = screen.getByRole("checkbox", { name: "Select all eight trades" });
    expect(isChecked(all)).toBe(false);
    const fls = screen.getByRole("checkbox", { name: "Fire & Life Safety" });
    expect(isChecked(fls)).toBe(false);
    const names = screen
      .getAllByRole("checkbox")
      .filter((el) => (el as HTMLInputElement).name === "trades")
      .map((el) => (el as HTMLInputElement).value);
    expect(names).toHaveLength(8);
    expect(names.at(-1)).toBe("fire-life-safety");
    expect(names.at(-2)).toBe("painting");
  });
  it("a seven-trade resume prefill leaves Fire & Life Safety and select-all unchecked", () => {
    render(
      <PreferencesForm
        initialSearch={{
          plan: "statewide",
          trades:
            "roofing,electrical,plumbing-hvac,sitework-heavy-civil,commercial-general-contracting,landscaping,painting",
        }}
      />,
    );
    expect(isChecked(screen.getByRole("checkbox", { name: "Painting" }))).toBe(true);
    expect(isChecked(screen.getByRole("checkbox", { name: "Fire & Life Safety" }))).toBe(false);
    expect(isChecked(screen.getByRole("checkbox", { name: "Select all eight trades" }))).toBe(false);
  });
});

describe("PreferencesForm resume prefill", () => {
  it("preselects Statewide when the URL has no plan or an invalid plan", () => {
    const { unmount } = render(<PreferencesForm />);
    expect(isChecked(screen.getByRole("radio", { name: "Statewide, all of Florida, $139/mo" }))).toBe(true);
    expect(screen.queryByLabelText("County")).toBeNull();
    expect(screen.queryByLabelText("Region")).toBeNull();
    unmount();

    render(<PreferencesForm initialSearch={{ plan: "national", trades: "roofing" }} />);
    expect(isChecked(screen.getByRole("radio", { name: "Statewide, all of Florida, $139/mo" }))).toBe(true);
    expect(isChecked(screen.getByRole("checkbox", { name: "Roofing" }))).toBe(true);
    expect(isChecked(screen.getByRole("radio", { name: "County, one county, $39/mo" }))).toBe(false);
  });

  it("preselects a full set of plan, area, trades, and delivery after hydration", () => {
    render(
      <PreferencesForm
        initialSearch={{
          plan: "county",
          state: "FL",
          area: "collier",
          trades: "roofing,electrical",
          delivery: "daily",
        }}
      />,
    );
    expect(isChecked(screen.getByRole("radio", { name: "County, one county, $39/mo" }))).toBe(true);
    expect((screen.getByLabelText("County") as HTMLSelectElement).value).toBe("collier");
    expect((screen.getByLabelText("State") as HTMLSelectElement).value).toBe("FL");
    expect(isChecked(screen.getByRole("checkbox", { name: "Roofing" }))).toBe(true);
    expect(isChecked(screen.getByRole("checkbox", { name: "Electrical" }))).toBe(true);
    expect(isChecked(screen.getByRole("checkbox", { name: "Painting" }))).toBe(false);
    expect(isChecked(screen.getByRole("radio", { name: SIGNUP_COPY.deliveryDaily }))).toBe(true);
    expect(isChecked(screen.getByRole("radio", { name: SIGNUP_COPY.deliveryWeekly }))).toBe(false);
  });

  it("applies a partial prefill and leaves other fields empty", () => {
    render(
      <PreferencesForm initialSearch={{ plan: "region", delivery: "weekly" }} />,
    );
    expect(
      isChecked(screen.getByRole("radio", { name: "Region, a group of neighboring counties, $89/mo" })),
    ).toBe(true);
    expect((screen.getByLabelText("Region") as HTMLSelectElement).value).toBe("");
    expect(isChecked(screen.getByRole("checkbox", { name: "Roofing" }))).toBe(false);
    expect(isChecked(screen.getByRole("radio", { name: SIGNUP_COPY.deliveryWeekly }))).toBe(true);
    expect(isChecked(screen.getByRole("radio", { name: SIGNUP_COPY.deliveryDaily }))).toBe(false);
    expect(inputValue("Name")).toBe("");
    expect(inputValue("Business name")).toBe("");
    expect(inputValue("Email")).toBe("");
  });

  it("ignores a bad area, trade, and delivery value and keeps the valid ones", () => {
    render(
      <PreferencesForm
        initialSearch={{
          plan: "county",
          area: "atlantis",
          trades: "roofing,wizardry,electrical",
          delivery: "monthly",
        }}
      />,
    );
    expect(isChecked(screen.getByRole("radio", { name: "County, one county, $39/mo" }))).toBe(true);
    expect((screen.getByLabelText("County") as HTMLSelectElement).value).toBe("");
    expect(isChecked(screen.getByRole("checkbox", { name: "Roofing" }))).toBe(true);
    expect(isChecked(screen.getByRole("checkbox", { name: "Electrical" }))).toBe(true);
    expect(isChecked(screen.getByRole("radio", { name: SIGNUP_COPY.deliveryDaily }))).toBe(false);
    expect(isChecked(screen.getByRole("radio", { name: SIGNUP_COPY.deliveryWeekly }))).toBe(false);
  });

  it("never fills name, business, or email from the URL", () => {
    render(
      <PreferencesForm
        initialSearch={{
          plan: "statewide",
          name: "From the URL",
          business: "URL Construction",
          email: "stolen@example.com",
          trades: "painting",
        }}
      />,
    );
    expect(inputValue("Name")).toBe("");
    expect(inputValue("Business name")).toBe("");
    expect(inputValue("Email")).toBe("");
    expect(isChecked(screen.getByRole("checkbox", { name: "Painting" }))).toBe(true);
  });

  it("shows contact errors first on an empty submit and does not POST", async () => {
    const submitPicksFn = vi.fn(async () => {});
    const redirectTo = vi.fn();
    render(<PreferencesForm submitPicksFn={submitPicksFn} redirectTo={redirectTo} />);
    fireEvent.click(screen.getByRole("button", { name: SIGNUP_COPY.submit }));
    const alerts = screen.getAllByRole("alert").map((el) => el.textContent);
    expect(alerts).toContain(SIGNUP_COPY.errorName);
    expect(alerts).toContain(SIGNUP_COPY.errorBusiness);
    expect(alerts).toContain(SIGNUP_COPY.errorEmail);
    expect(alerts).not.toContain(SIGNUP_COPY.errorCoverage);
    expect(alerts).toContain(SIGNUP_COPY.errorTrades);
    expect(alerts).toContain(SIGNUP_COPY.errorDelivery);
    expect(submitPicksFn).not.toHaveBeenCalled();
    expect(redirectTo).not.toHaveBeenCalled();
    expect(document.activeElement?.id).toBe("prefs-name");
  });

  it("submits v2 picks, generates a new ref, and adds prefilled_email to the LIVE checkout URL", async () => {
    const posted: Picks[] = [];
    const redirects: string[] = [];
    const generateRefFn = vi.fn(() => "ltb_newref000001");
    const setItem = vi.spyOn(window.sessionStorage, "setItem");
    render(
      <PreferencesForm
        initialSearch={{
          plan: "county",
          area: "collier",
          trades: "roofing",
          delivery: "daily",
          ref: "ltb_fromurlxxxx",
          email: "url@evil.test",
        }}
        generateRefFn={generateRefFn}
        submitPicksFn={async (picks) => {
          posted.push(picks);
        }}
        redirectTo={(url) => redirects.push(url)}
        now={() => "2026-11-17T21:49:00.000Z"}
      />,
    );
    fireEvent.change(screen.getByLabelText("Name"), { target: { value: "  Jane Doe  " } });
    fireEvent.change(screen.getByLabelText("Business name"), { target: { value: " Doe Roofing " } });
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: " Jane@DoeRoofing.com " } });
    fireEvent.click(screen.getByRole("button", { name: SIGNUP_COPY.submit }));
    await vi.waitFor(() => expect(posted).toHaveLength(1));
    expect(generateRefFn).toHaveBeenCalledTimes(1);
    expect(posted[0]?.ref).toBe("ltb_newref000001");
    expect(posted[0]?.schema).toBe("v2");
    expect(posted[0]?.plan).toBe("county");
    expect(posted[0]?.state).toBe("FL");
    expect(posted[0]?.area).toBe("collier");
    expect(posted[0]?.trades).toBe("roofing");
    expect(posted[0]?.delivery).toBe("daily");
    expect(posted[0]?.name).toBe("Jane Doe");
    expect(posted[0]?.business).toBe("Doe Roofing");
    expect(posted[0]?.email).toBe("jane@doeroofing.com");
    expect(redirects[0]).toContain("https://buy.stripe.com/eVqdRbctF1OJ4jma5N0kE00?");
    expect(redirects[0]).not.toContain("test_");
    expect(redirects[0]).toContain("client_reference_id=ltb_newref000001");
    expect(redirects[0]).toContain("prefilled_email=jane%40doeroofing.com");
    expect(redirects[0]).not.toContain("url@evil.test");
    expect(setItem).not.toHaveBeenCalled();
  });
});
