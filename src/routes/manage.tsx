import { createFileRoute } from "@tanstack/react-router";
import { SITE } from "@/config/site";
import { pageHead } from "@/lib/seo";
import { PageIntro, PlaceholderBox } from "@/components/site/ui";

export const PLAN_CHANGES_TEXT =
  "You can switch plans anytime in Manage billing. Upgrades take effect " +
  "right away, and Stripe charges the prorated difference for the rest of " +
  "the current month. Downgrades take effect on your next billing date. You " +
  "keep your current plan until then, and no credit or refund is given for " +
  "the change. To change your trades or counties within your plan, use the " +
  "preferences link in any digest email. [PLACEHOLDER: preferences form link]";

export const CANCEL_FALLBACK_TEXT =
  "If you can't use Manage billing, email support@localtradebids.com with " +
  '"Cancel" in the subject from the email you subscribed with. We\'ll cancel ' +
  "within 2 business days and email you a confirmation. Your cancellation " +
  "counts from the day we receive your email: if a renewal charge goes " +
  "through after that, we'll refund it.";

export const CANCEL_STEPS_TEXT =
  "To cancel: 1) Click Manage billing at the bottom of any page. 2) Enter " +
  "the email you subscribed with, and Stripe will email you a sign-in link. " +
  "3) Open the link and click Cancel subscription. Your cancellation takes " +
  "effect at the end of the month you've paid for, and you won't be charged " +
  "again. We'll email you a confirmation.";

export const Route = createFileRoute("/manage")({
  head: () =>
    pageHead({
      title: "Manage billing | LocalTradeBids",
      description: "Update or cancel your LocalTradeBids subscription.",
      path: "/manage",
      noindex: true,
    }),
  component: Page,
});

function Page() {
  return (
    <>
      <PageIntro title="Manage billing" />
      {SITE.billingPortalUrl ? (
        <p className="text-slate">
          <a href={SITE.billingPortalUrl} className="btn-primary" rel="noopener">
            Manage billing
          </a>
        </p>
      ) : (
        <PlaceholderBox>
          [PLACEHOLDER: Stripe customer portal login URL] — plan changes and
          cancellation happen in the Stripe customer portal.
        </PlaceholderBox>
      )}
      <section className="mt-8 max-w-3xl text-slate">
        <h2 className="text-xl font-bold text-brand">Plan changes</h2>
        <p className="mt-3">{PLAN_CHANGES_TEXT}</p>
        <h2 className="mt-8 text-xl font-bold text-brand">Cancel</h2>
        <p className="mt-3">{CANCEL_STEPS_TEXT}</p>
        <p className="mt-3">{CANCEL_FALLBACK_TEXT}</p>
      </section>
    </>
  );
}
