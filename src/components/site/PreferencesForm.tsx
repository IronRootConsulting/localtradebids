import { type FormEvent, useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
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
import {
  PICKS_SCHEMA,
  type DeliveryKey,
  type Picks,
  buildCheckoutUrl,
  generateRef,
  joinTrades,
  stashPicks,
  submitPicks,
} from "@/lib/submitPicks";

const PLAN_KEYS: PlanKey[] = ["statewide", "region", "county"];

function parsePlan(value: string | null | undefined): PlanKey | "" {
  if (value === "county" || value === "region" || value === "statewide") return value;
  return "";
}

function planPrice(key: PlanKey): number {
  return PLANS.find((p) => p.key === key)?.price ?? 0;
}

function readPlanFromLocation(): PlanKey | "" {
  if (typeof window === "undefined") return "";
  return parsePlan(new URLSearchParams(window.location.search).get("plan"));
}

export type PreferencesFormProps = {
  /** Used in tests. In the browser the plan is read from the query string. */
  initialPlan?: PlanKey | "";
  submitPicksFn?: typeof submitPicks;
  generateRefFn?: typeof generateRef;
  redirectTo?: (url: string) => void;
  now?: () => string;
};

export function PreferencesForm({
  initialPlan,
  submitPicksFn = submitPicks,
  generateRefFn = generateRef,
  redirectTo,
  now,
}: PreferencesFormProps = {}) {
  const [plan, setPlan] = useState<PlanKey | "">(initialPlan ?? "");
  const [state, setState] = useState(defaultStateCode());
  const [county, setCounty] = useState("");
  const [region, setRegion] = useState("");
  const [trades, setTrades] = useState<string[]>([]);
  const [delivery, setDelivery] = useState<DeliveryKey>("daily");
  const [attempted, setAttempted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialPlan !== undefined) return;
    setPlan(readPlanFromLocation());
  }, [initialPlan]);

  const name = stateName(state);
  const counties = countiesForState(state);
  const regions = regionsForState(state);
  const allTradeSlugs = TRADES.map((t) => t.slug);
  const allTradesSelected =
    allTradeSlugs.length > 0 && allTradeSlugs.every((slug) => trades.includes(slug));

  const errors = useMemo(() => {
    const next: { coverage?: string; county?: string; region?: string; trades?: string; delivery?: string } = {};
    if (!plan) next.coverage = SIGNUP_COPY.errorCoverage;
    if (plan === "county" && !county) next.county = SIGNUP_COPY.errorCounty;
    if (plan === "region" && !region) next.region = SIGNUP_COPY.errorRegion;
    if (trades.length === 0) next.trades = SIGNUP_COPY.errorTrades;
    if (delivery !== "daily" && delivery !== "weekly") next.delivery = SIGNUP_COPY.errorDelivery;
    return next;
  }, [plan, county, region, trades, delivery]);

  const show = attempted;

  function toggleTrade(slug: string) {
    setTrades((current) =>
      current.includes(slug) ? current.filter((s) => s !== slug) : [...current, slug],
    );
  }

  function toggleAllTrades() {
    setTrades(allTradesSelected ? [] : [...allTradeSlugs]);
  }

  function onPlanChange(next: PlanKey) {
    setPlan(next);
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAttempted(true);
    if (Object.keys(errors).length > 0 || !plan) return;

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
    };

    setSubmitting(true);
    try {
      stashPicks(picks);
      await submitPicksFn(picks);
      const href = buildCheckoutUrl(plan, picks.ref);
      if (redirectTo) redirectTo(href);
      else window.location.assign(href);
    } finally {
      setSubmitting(false);
    }
  }

  const coverageOptions: { key: PlanKey; label: string }[] = PLAN_KEYS.map((key) => ({
    key,
    label: fillCopy(
      key === "statewide"
        ? SIGNUP_COPY.coverageStatewide
        : key === "region"
          ? SIGNUP_COPY.coverageRegion
          : SIGNUP_COPY.coverageCounty,
      { stateName: name, price: planPrice(key) },
    ),
  }));

  return (
    <form className="prefs-form card grid gap-6 p-5 sm:p-6" onSubmit={onSubmit} noValidate>
      <fieldset aria-describedby="coverage-helper coverage-error">
        <legend className="text-sm font-medium text-ink">{SIGNUP_COPY.coverageLabel}</legend>
        <p id="coverage-helper" className="field-help">
          {SIGNUP_COPY.coverageHelper}
        </p>
        <div className="option-list mt-2" role="radiogroup" aria-labelledby="coverage-legend" aria-invalid={show && errors.coverage ? true : undefined} aria-describedby={show && errors.coverage ? "coverage-error" : undefined}>
          <span id="coverage-legend" className="sr-only">
            {SIGNUP_COPY.coverageLabel}
          </span>
          {coverageOptions.map((opt) => (
            <label key={opt.key} className="option-row">
              <input
                type="radio"
                name="coverage"
                value={opt.key}
                checked={plan === opt.key}
                onChange={() => onPlanChange(opt.key)}
              />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
        {show && errors.coverage ? (
          <p id="coverage-error" className="field-error" role="alert">
            {errors.coverage}
          </p>
        ) : null}
      </fieldset>

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
          {fillCopy(SIGNUP_COPY.stateHelper, { stateName: name })}
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
        <p className="text-slate">{fillCopy(SIGNUP_COPY.statewideNote, { stateName: name })}</p>
      ) : null}

      <fieldset aria-describedby="trades-helper trades-error">
        <legend className="text-sm font-medium text-ink">{SIGNUP_COPY.tradesLabel}</legend>
        <p id="trades-helper" className="field-help">
          {SIGNUP_COPY.tradesHelper}
        </p>
        <div className="option-list mt-2">
          <label className="option-row">
            <input
              type="checkbox"
              name="trades-all"
              checked={allTradesSelected}
              onChange={toggleAllTrades}
            />
            <span>{SIGNUP_COPY.tradesSelectAll}</span>
          </label>
          {TRADES.map((trade) => (
            <label key={trade.slug} className="option-row">
              <input
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
        {show && errors.trades ? (
          <p id="trades-error" className="field-error" role="alert">
            {errors.trades}
          </p>
        ) : null}
      </fieldset>

      <fieldset aria-describedby={show && errors.delivery ? "delivery-error" : undefined}>
        <legend className="text-sm font-medium text-ink">{SIGNUP_COPY.deliveryLabel}</legend>
        <div className="option-list mt-2" role="radiogroup" aria-label={SIGNUP_COPY.deliveryLabel}>
          <label className="option-row">
            <input
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
