import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

describe("mobile overflow: bid tables and legal tables stay in their wraps", () => {
  it("constrains bid-table-wrap and legal-table-wrap so wide tables do not expand the page", () => {
    const css = readFileSync(new URL("../styles.css", import.meta.url), "utf8");
    const wrapBlock = css.slice(css.indexOf(".bid-table-wrap"), css.indexOf(".bid-table th"));
    expect(wrapBlock).toContain("overflow-x: auto");
    expect(wrapBlock).toContain("max-width: 100%");
    expect(wrapBlock).toContain("min-width: 0");
    expect(css).toContain(".legal-table-wrap");
    expect(css).toMatch(/\.legal-table-wrap\s*\{[^}]*overflow-x:\s*auto/);
    expect(css).toMatch(/\.legal-doc th,\s*\.legal-doc td\s*\{[^}]*overflow-wrap:\s*anywhere/);
    expect(css).toMatch(/\.bid-table \{[\s\S]*?max-width:\s*100%/);
    expect(css).toMatch(/\.legal-doc table \{[\s\S]*?max-width:\s*100%/);
    expect(css).toMatch(/\.bid-table th,\s*\.bid-table td\s*\{[^}]*overflow-wrap:\s*anywhere/);
  });

  it("wraps LegalDoc tables without changing the table copy", () => {
    const src = readFileSync(new URL("../components/site/ui.tsx", import.meta.url), "utf8");
    expect(src).toContain("legal-table-wrap");
    expect(src).toContain("wrapLegalTables");
    expect(src).toContain("dangerouslySetInnerHTML={{ __html: wrapLegalTables(html) }}");
  });
});
