import { SITE } from "@/config/site";
import { SIGNUP_COPY } from "@/data/signupCopy";

/** Preview-only test-checkout notice. Remove in the same change that sets checkoutLive to true. */
export function PreviewCheckoutNotice({
  variant,
  className = "",
}: {
  variant: "short" | "long";
  className?: string;
}) {
  if (SITE.checkoutLive) return null;
  const text =
    variant === "short" ? SIGNUP_COPY.previewCheckoutShort : SIGNUP_COPY.previewCheckoutLong;
  return (
    <p className={["preview-notice", className].filter(Boolean).join(" ")} role="note">
      {text}
    </p>
  );
}
