import { SITE } from "@/config/site";

/** Strip the GitHub Pages base and trailing slash so "/signup/" and "/signup" match. */
function normalize(pathname: string): string {
  const p = (pathname || "/").split(/[?#]/)[0].replace(/\/+$/, "");
  return p === "" ? "/" : p;
}

export function shouldLoadBeacon(pathname: string): boolean {
  if (!SITE.cloudflareBeaconToken) return false;
  const p = normalize(pathname);
  return !SITE.cloudflareBeaconExcludedPaths.some((x) => p === x || p.startsWith(x + "/"));
}

export function beaconConfig(): string {
  return JSON.stringify({ token: SITE.cloudflareBeaconToken });
}
