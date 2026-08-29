import { createFileRoute } from "@tanstack/react-router";
import { AuthBrand, AuthCard, AuthShell } from "@/components/auth/AuthShell";

const title = "Reset Your Password — ResQBD";
const description =
  "Password recovery for ResQBD accounts will let you reset access using your registered email or phone number.";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  return (
    <AuthShell>
      <AuthCard>
        <AuthBrand />
        <h1 className="mt-6 text-center text-2xl font-bold tracking-tight">
          Reset your password
        </h1>
        <p className="mt-3 text-center text-sm text-[var(--color-text-secondary)]">
          Password recovery will be available with account services.
        </p>
        <p className="mt-6 text-center text-sm">
          <a
            href="/signin"
            className="font-bold text-[var(--color-brand)] transition-colors duration-150 hover:text-[var(--color-brand-dark)]"
          >
            Back to Sign In
          </a>
        </p>
      </AuthCard>
    </AuthShell>
  );
}
