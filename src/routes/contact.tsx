import { createFileRoute } from "@tanstack/react-router";
import { SITE } from "@/config/site";
import { pageHead } from "@/lib/seo";
import { PageIntro } from "@/components/site/ui";

export const Route = createFileRoute("/contact")({
  head: () => pageHead({ title: "Contact | LocalTradeBids", description: "Contact LocalTradeBids by email. Operated by IronRoot Consulting LLC in Ave Maria, Florida.", path: "/contact" }),
  component: () => (
    <>
      <PageIntro title="Contact" />
      <div className="card grid gap-2 p-6 text-slate">
        <p>Email: <a className="link" href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a></p>
        <p>Operator: {SITE.operator}</p>
        <p>{SITE.address}</p>
      </div>
    </>
  ),
});
