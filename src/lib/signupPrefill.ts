import type { PlanKey } from "@/config/site";
import { TRADES } from "@/data/ltb";
import {
  defaultStateCode,
  getCounty,
  getRegion,
  isStateEnabled,
} from "@/data/states";
import type { DeliveryKey } from "@/lib/submitPicks";

export const PREFILL_PARAMS = ["plan", "state", "area", "trades", "delivery"] as const;

export type SignupPrefill = {
  plan: PlanKey | "";
  state: string;
  county: string;
  region: string;
  trades: string[];
  delivery: DeliveryKey | "";
};

const PLAN_VALUES: PlanKey[] = ["county", "region", "statewide"];
const DELIVERY_VALUES: DeliveryKey[] = ["daily", "weekly"];
const TRADE_SLUGS = new Set(TRADES.map((t) => t.slug));

function readParam(
  search: URLSearchParams | Record<string, string | null | undefined>,
  key: string,
): string {
  if (search instanceof URLSearchParams) return (search.get(key) ?? "").trim();
  const raw = search[key];
  return (raw ?? "").trim();
}

export function parsePlanParam(value: string | null | undefined): PlanKey | "" {
  const v = (value ?? "").trim();
  return PLAN_VALUES.includes(v as PlanKey) ? (v as PlanKey) : "";
}

/** Parse resume-prefill params. Never reads name, business, or email. */
export function parseSignupPrefill(
  search: URLSearchParams | Record<string, string | null | undefined>,
): SignupPrefill {
  const result: SignupPrefill = {
    plan: "statewide",
    state: "",
    county: "",
    region: "",
    trades: [],
    delivery: "",
  };

  result.plan = parsePlanParam(readParam(search, "plan")) || "statewide";

  const stateRaw = readParam(search, "state").toUpperCase();
  if (stateRaw && isStateEnabled(stateRaw)) result.state = stateRaw;

  const areaState = result.state || defaultStateCode();
  const area = readParam(search, "area").toLowerCase();
  if (area && result.plan === "county" && getCounty(areaState, area)) {
    result.county = area;
  } else if (area && result.plan === "region" && getRegion(areaState, area)) {
    result.region = area;
  }

  const tradesRaw = readParam(search, "trades");
  if (tradesRaw) {
    const seen = new Set<string>();
    for (const part of tradesRaw.split(",")) {
      const slug = part.trim();
      if (TRADE_SLUGS.has(slug) && !seen.has(slug)) {
        seen.add(slug);
        result.trades.push(slug);
      }
    }
  }

  const delivery = readParam(search, "delivery");
  if (DELIVERY_VALUES.includes(delivery as DeliveryKey)) {
    result.delivery = delivery as DeliveryKey;
  }

  return result;
}

export function readPrefillFromLocation(): SignupPrefill {
  if (typeof window === "undefined") {
    return { plan: "statewide", state: "", county: "", region: "", trades: [], delivery: "" };
  }
  return parseSignupPrefill(new URLSearchParams(window.location.search));
}
