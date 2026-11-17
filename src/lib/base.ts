/** Vite base path, always with a trailing slash (e.g. "/"). */
export const BASE_PATH: string = import.meta.env.BASE_URL || "/";

/** Prefix an in-app path with the site base so it resolves on GitHub Pages. */
export function withBase(path: string = "/"): string {
  const base = BASE_PATH.endsWith("/") ? BASE_PATH : `${BASE_PATH}/`;
  if (!path || path === "/") return base;
  return base + path.replace(/^\//, "");
}
