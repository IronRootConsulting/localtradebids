import { type FormEvent, useLayoutEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { PreviewCheckoutNotice } from "@/components/site/PreviewCheckoutNotice";
import type { PlanKey } from "@/config/site";
import { PLANS } from "@/components/site/PricingCards";
import { TRADES } from "@/data/ltb";
import { SIGNUP_COPY, fillCopy } from "@/data/signupCopy";
import {
  USPS_STATES,
  countiesForState,
  defaultStateCode,
  getCounty,
  getRegion,
  isStateEnabled,
  regionsForState,
  stateName,
} from "@/data/states";
import { parseSignupPrefill } from "@/lib/signupPrefill";
import {
  FIELD_MAX,
  PICKS_SCHEMA,
  type DeliveryKey,
  type Picks,
  buildCheckoutUrl,
  generateRef,
  isValidEmail,
  joinTrades,
  normalizeEmail,
  normalizeName,
  submitPicks,
} from "@/lib/submitPicks";

const PLAN_KEYS: PlanKey[] = ["statewide", "region", "county"];

function planPrice(key: PlanKey): number {
  return PLANS.find((p) => p.key === key)?.price ?? 0;
}

function coverageParts(key: PlanKey, stateLabel: string, price: number) {
  const full = fillCopy(
    key === "statewide"
      ? SIGNUP_COPY.coverageStatewide
      : key === "region"
        ? SIGNUP_COPY.coverageRegion
        : SIGNUP_COPY.coverageCounty,
    { stateName: stateLabel, price },
  );
  if (key === "statewide") {
    return { name: "Statewide", priceLabel: `$${price}/mo`, line: `all of ${stateLabel}`, full };
  }
  if (key === "region") {
    return { name: "Region", priceLabel: `$${price}/mo`, line: "a group of neighboring counties", full };
  }
  return { name: "County", priceLabel: `$${price}/mo`, line: "one county", full };
}

export type PreferencesFormProps = {
  initialSearch?: Record<string, string | null | undefined>;
  submitPicksFn?: typeof submitPicks;
  generateRefFn?: typeof generateRef;
  redirectTo?: (url: string) => void;
  now?: () => string;
};

type FormErrors = {
  name?: string;
  business?: string;
  email?: string;
  coverage?: string;
  county?: string;
  region?: string;
  trades?: string;
  delivery?: string;
};

const ERROR_FOCUS_IDS: { key: keyof FormErrors; id: string }[] = [
  { key: "name", id: "prefs-name" },
  { key: "business", id: "prefs-business" },
  { key: "email", id: "prefs-email" },
  { key: "coverage", id: "coverage-statewide" },
  { key: "county", id: "prefs-county" },
  { key: "region", id: "prefs-region" },
  { key: "trades", id: "trade-roofing" },
  { key: "delivery", id: "delivery-daily" },
];

export function PreferencesForm({
  initialSearch,
  submitPicksFn = submitPicks,
  generateRefFn = generateRef,
  redirectTo,
  now,
}: PreferencesFormProps = {}) {
  const [plan, setPlan] = useState<PlanKey>("statewide");
  const [state, setState] = useState(defaultStateCode());
  const [county, setCounty] = useState("");
  const [region, setRegion] = useState("");
  const [trades, setTrades] = useState<string[]>([]);
  const [delivery, setDelivery] = useState<DeliveryKey | "">("");
  const [fullName, setFullName] = useState("");
  const [business, setBusiness] = useState("");
  const [email, setEmail] = useState("");
  const [attempted, setAttempted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useLayoutEffect(() => {
    const prefill = parseSignupPrefill(
      initialSearch ?? (typeof window === "undefined" ? {} : new URLSearchParams(window.location.search)),
    );
    if (prefill.plan) setPlan(prefill.plan);
    if (prefill.state) setState(prefill.state);
    if (prefill.county) setCounty(prefill.county);
    if (prefill.region) setRegion(prefill.region);
    if (prefill.trades.length > 0) setTrades(prefill.trades);
    if (prefill.delivery) setDelivery(prefill.delivery);
  }, [initialSearch]);

  const placeName = stateName(state);
  const counties = countiesForState(state);
  const regions = regionsForState(state);
  const allTradeSlugs = TRADES.map((t) => t.slug);
  const allTradesSelected =
    allTradeSlugs.length > 0 && allTradeSlugs.every((slug) => trades.includes(slug));

  const errors = useMemo((): FormErrors => {
    const next: FormErrors = {};
    if (!normalizeName(fullName)) next.name = SIGNUP_COPY.errorName;
    if (!normalizeName(business)) next.business = SIGNUP_COPY.errorBusiness;
    if (!isValidEmail(email)) next.email = SIGNUP_COPY.errorEmail;
    if (!plan) next.coverage = SIGNUP_COPY.errorCoverage;
    if (plan === "county" && !county) next.county = SIGNUP_COPY.errorCounty;
    if (plan === "region" && !region) next.region = SIGNUP_COPY.errorRegion;
    if (trades.length === 0) next.trades = SIGNUP_COPY.errorTrades;
    if (delivery !== "daily" && delivery !== "weekly") next.delivery = SIGNUP_COPY.errorDelivery;
    return next;
  }, [fullName, business, email, plan, county, region, trades, delivery]);

  const show = attempted;

  function toggleTrade(slug: string) {
    setTrades((current) =>
      current.includes(slug) ? current.filter((s) => s !== slug) : [...current, slug],
    );
  }

  function toggleAllTrades() {
    setTrades(allTradesSelected ? [] : [...allTradeSlugs]);
  }

  function focusFirstError(next: FormErrors) {
    const target = ERROR_FOCUS_IDS.find((item) => next[item.key]);
    if (!target) return;
    const el = document.getElementById(target.id);
    if (el instanceof HTMLElement) el.focus();
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAttempted(true);
    if (Object.keys(errors).length > 0 || !plan || (delivery !== "daily" && delivery !== "weekly")) {
      focusFirstError(errors);
      return;
    }

    const area =
      plan === "county"
        ? (getCounty(state, county)?.slug ?? "")
        : plan === "region"
          ? (getRegion(state, region)?.id ?? "")
          : "";

    const picks: Picks = {
      ref: generateRefFn(),
      schema: PICKS_SCHEMA,
      plan,
      state,
      area,
      trades: joinTrades(trades),
      delivery,
      page_url: typeof window !== "undefined" ? window.location.href : "",
      ts: (now ?? (() => new Date().toISOString()))(),
      name: normalizeName(fullName),
      business: normalizeName(business),
      email: normalizeEmail(email),
    };

    setSubmitting(true);
    try {
      await submitPicksFn(picks);
      const href = buildCheckoutUrl(plan, picks.ref, picks.email);
      if (redirectTo) redirectTo(href);
      else window.location.assign(href);
    } finally {
      setSubmitting(false);
    }
  }

  const detailsNotice = SIGNUP_COPY.detailsNotice;
  const linkText = SIGNUP_COPY.detailsNoticeLink;
  const linkAt = detailsNotice.lastIndexOf(linkText);

  return (
    <form className="prefs-form card grid gap-8 p-5 sm:p-8" onSubmit={onSubmit} noValidate>
      <fieldset className="prefs-section" aria-describedby="details-notice">
        <legend className="prefs-legend">{SIGNUP_COPY.detailsHeading}</legend>
        <div className="grid gap-4">
          <div>
            <label className="grid gap-1 text-sm font-medium text-ink" htmlFor="prefs-name">
              {SIGNUP_COPY.nameLabel}
            </label>
            <input
              id="prefs-name"
              className="field"
              type="text"
              name="name"
              autoComplete="name"
              maxLength={FIELD_MAX}
              placeholder={SIGNUP_COPY.namePlaceholder}
              value={fullName}
              aria-invalid={show && errors.name ? true : undefined}
              aria-describedby={show && errors.name ? "name-error" : undefined}
              onChange={(e) => setFullName(e.target.value)}
            />
            {show && errors.name ? (
              <p id="name-error" className="field-error" role="alert">
                {errors.name}
              </p>
            ) : null}
          </div>
          <div>
            <label className="grid gap-1 text-sm font-medium text-ink" htmlFor="prefs-business">
              {SIGNUP_COPY.businessLabel}
            </label>
            <input
              id="prefs-business"
              className="field"
              type="text"
              name="business"
              autoComplete="organization"
              maxLength={FIELD_MAX}
              value={business}
              aria-invalid={show && errors.business ? true : undefined}
              aria-describedby={
                show && errors.business ? "business-error" : "business-helper"
              }
              onChange={(e) => setBusiness(e.target.value)}
            />
            <p id="business-helper" className="field-help">
              {SIGNUP_COPY.businessHelper}
            </p>
            {show && errors.business ? (
              <p id="business-error" className="field-error" role="alert">
                {errors.business}
              </p>
            ) : null}
          </div>
          <div>
            <label className="grid gap-1 text-sm font-medium text-ink" htmlFor="prefs-email">
              {SIGNUP_COPY.emailLabel}
            </label>
            <input
              id="prefs-email"
              className="field"
              type="email"
              name="email"
              autoComplete="email"
              maxLength={FIELD_MAX}
              value={email}
              aria-invalid={show && errors.email ? true : undefined}
              aria-describedby={show && errors.email ? "email-error" : "email-helper"}
              onChange={(e) => setEmail(e.target.value)}
            />
            <p id="email-helper" className="field-help">
              {SIGNUP_COPY.emailHelper}
            </p>
            {show && errors.email ? (
              <p id="email-error" className="field-error" role="alert">
                {errors.email}
              </p>
            ) : null}
          </div>
          <p id="details-notice" className="field-help">
            {linkAt === -1 ? (
              detailsNotice
            ) : (
              <>
                {detailsNotice.slice(0, linkAt)}
                <Link to="/privacy" className="link">
                  {linkText}
                </Link>
                {detailsNotice.slice(linkAt + linkText.length)}
              </>
            )}
          </p>
        </div>
      </fieldset>

      <fieldset className="prefs-section" aria-describedby="coverage-helper coverage-error">
        <legend className="prefs-legend">{SIGNUP_COPY.coverageLabel}</legend>
        <p id="coverage-helper" className="field-help">
          {SIGNUP_COPY.coverageHelper}
        </p>
        <div className="coverage-tiles mt-3" role="radiogroup" aria-label={SIGNUP_COPY.coverageLabel}>
          {PLAN_KEYS.map((key) => {
            const parts = coverageParts(key, placeName, planPrice(key));
            const selected = plan === key;
            return (
              <label
                key={key}
                className="coverage-tile"
                data-selected={selected ? "true" : "false"}
                aria-label={parts.full}
              >
                <input
                  id={`coverage-${key}`}
                  type="radio"
                  name="coverage"
                  value={key}
                  checked={selected}
                  onChange={() => setPlan(key)}
                />
                <span className="coverage-tile-name">{parts.name}</span>
                <span className="coverage-tile-price">{parts.priceLabel}</span>
                <span className="coverage-tile-line">{parts.line}</span>
              </label>
            );
          })}
        </div>
        {show && errors.coverage ? (
          <p id="coverage-error" className="field-error" role="alert">
            {errors.coverage}
          </p>
        ) : null}
      </fieldset>

      <fieldset className="prefs-section">
        <legend className="prefs-legend">{SIGNUP_COPY.areaHeading}</legend>
        <div className="grid gap-4">
          <div>
            <label className="grid gap-1 text-sm font-medium text-ink" htmlFor="prefs-state">
              {SIGNUP_COPY.stateLabel}
            </label>
            <select
              id="prefs-state"
              className="field"
              name="state"
              value={state}
              aria-describedby="state-helper"
              onChange={(e) => {
                const next = e.target.value;
                if (!isStateEnabled(next)) return;
                setState(next);
                setCounty("");
                setRegion("");
              }}
            >
              {USPS_STATES.map((s) => (
                <option key={s.code} value={s.code} disabled={!isStateEnabled(s.code)}>
                  {s.name}
                </option>
              ))}
            </select>
            <p id="state-helper" className="field-help">
              {fillCopy(SIGNUP_COPY.stateHelper, { stateName: placeName })}
            </p>
          </div>

          {plan === "county" ? (
            <div>
              <label className="grid gap-1 text-sm font-medium text-ink" htmlFor="prefs-county">
                {SIGNUP_COPY.countyLabel}
              </label>
              <select
                id="prefs-county"
                className="field"
                name="county"
                value={county}
                aria-invalid={show && errors.county ? true : undefined}
                aria-describedby={show && errors.county ? "county-error" : undefined}
                onChange={(e) => setCounty(e.target.value)}
              >
                <option value="">{SIGNUP_COPY.countyPlaceholder}</option>
                {counties.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
              {show && errors.county ? (
                <p id="county-error" className="field-error" role="alert">
                  {errors.county}
                </p>
              ) : null}
            </div>
          ) : null}

          {plan === "region" ? (
            <div>
              <label className="grid gap-1 text-sm font-medium text-ink" htmlFor="prefs-region">
                {SIGNUP_COPY.regionLabel}
              </label>
              <select
                id="prefs-region"
                className="field"
                name="region"
                value={region}
                aria-invalid={show && errors.region ? true : undefined}
                aria-describedby={show && errors.region ? "region-error" : undefined}
                onChange={(e) => setRegion(e.target.value)}
              >
                <option value="">{SIGNUP_COPY.regionPlaceholder}</option>
                {regions.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
              {show && errors.region ? (
                <p id="region-error" className="field-error" role="alert">
                  {errors.region}
                </p>
              ) : null}
            </div>
          ) : null}

          {plan === "statewide" ? (
            <p className="text-slate">{fillCopy(SIGNUP_COPY.statewideNote, { stateName: placeName })}</p>
          ) : null}
        </div>
      </fieldset>

      <fieldset className="prefs-section" aria-describedby="trades-helper trades-error">
        <legend className="prefs-legend">{SIGNUP_COPY.tradesLabel}</legend>
        <p id="trades-helper" className="field-help">
          {SIGNUP_COPY.tradesHelper}
        </p>
        <div className="mt-3 grid gap-2">
          <label className="option-row">
            <input
              type="checkbox"
              name="trades-all"
              checked={allTradesSelected}
              onChange={toggleAllTrades}
            />
            <span>{SIGNUP_COPY.tradesSelectAll}</span>
          </label>
          <div className="trade-grid">
            {TRADES.map((trade) => (
              <label key={trade.slug} className="option-row">
                <input
                  id={`trade-${trade.slug}`}
                  type="checkbox"
                  name="trades"
                  value={trade.slug}
                  checked={trades.includes(trade.slug)}
                  onChange={() => toggleTrade(trade.slug)}
                />
                <span>{trade.name}</span>
              </label>
            ))}
          </div>
        </div>
        {show && errors.trades ? (
          <p id="trades-error" className="field-error" role="alert">
            {errors.trades}
          </p>
        ) : null}
      </fieldset>

      <fieldset
        className="prefs-section"
        aria-describedby={show && errors.delivery ? "delivery-error" : undefined}
      >
        <legend className="prefs-legend">{SIGNUP_COPY.deliveryLabel}</legend>
        <div className="option-list mt-2" role="radiogroup" aria-label={SIGNUP_COPY.deliveryLabel}>
          <label className="option-row">
            <input
              id="delivery-daily"
              type="radio"
              name="delivery"
              value="daily"
              checked={delivery === "daily"}
              onChange={() => setDelivery("daily")}
            />
            <span>{SIGNUP_COPY.deliveryDaily}</span>
          </label>
          <label className="option-row">
            <input
              id="delivery-weekly"
              type="radio"
              name="delivery"
              value="weekly"
              checked={delivery === "weekly"}
              onChange={() => setDelivery("weekly")}
            />
            <span>{SIGNUP_COPY.deliveryWeekly}</span>
          </label>
        </div>
        {show && errors.delivery ? (
          <p id="delivery-error" className="field-error" role="alert">
            {errors.delivery}
          </p>
        ) : null}
      </fieldset>

      <div className="grid gap-3">
        <PreviewCheckoutNotice variant="short" className="preview-notice-compact" />
        <button type="submit" className="btn-primary w-fit" disabled={submitting}>
          {SIGNUP_COPY.submit}
        </button>
        <p className="text-sm text-slate">{SIGNUP_COPY.smallPrint}</p>
        <Link to="/pricing" className="link w-fit">
          {SIGNUP_COPY.changePlan}
        </Link>
      </div>
    </form>
  );
}

