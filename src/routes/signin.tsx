import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  AuthBrand,
  AuthCard,
  AuthShell,
  Field,
} from "@/components/auth/AuthShell";
import { SubmitButton } from "@/components/auth/SubmitButton";
import { SuccessNote } from "@/components/auth/SuccessNote";

const title = "Sign In — ResQBD";
const description =
  "Sign in to ResQBD to report emergencies, respond to nearby incidents and track live incident status.";

export const Route = createFileRoute("/signin")({
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
  component: SignInPage,
});

type Errors = { identifier: string; password: string };

function SignInPage() {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Errors>({ identifier: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const next: Errors = { identifier: "", password: "" };
    const value = identifier.trim();
    if (!value) next.identifier = "Email or phone number is required.";
    else {
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
      const isPhone = /^[0-9+\-\s]{6,20}$/.test(value);
      if (!isEmail && !isPhone)
        next.identifier = "Enter a valid email address or phone number.";
    }
    if (!password) next.password = "Password is required.";
    else if (password.length < 8)
      next.password = "Password must be at least 8 characters.";
    setErrors(next);
    if (next.identifier || next.password) return;
    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      window.setTimeout(() => navigate({ to: "/dashboard" }), 1200);
    }, 1200);
  }

  return (
    <AuthShell>
      <AuthCard>
        <AuthBrand />
        <h1 className="mt-6 text-center text-2xl font-bold tracking-tight md:text-3xl">
          Sign in to ResQBD
        </h1>
        <p className="mt-3 text-center text-sm text-[var(--color-text-secondary)]">
          Use the email or phone number linked to your account.
        </p>

        <form onSubmit={onSubmit} noValidate className="mt-6 flex flex-col gap-5">
          <Field
            id="identifier"
            label="Email or Phone"
            value={identifier}
            error={errors.identifier}
            autoComplete="username"
            onChange={(v) => {
              setIdentifier(v);
              setErrors((e) => ({ ...e, identifier: "" }));
            }}
          />
          <Field
            id="password"
            label="Password"
            type="password"
            value={password}
            error={errors.password}
            autoComplete="current-password"
            onChange={(v) => {
              setPassword(v);
              setErrors((e) => ({ ...e, password: "" }));
            }}
          />

          <p className="text-sm">
            <a
              href="/forgot-password"
              className="font-bold text-[var(--color-brand)] transition-colors duration-150 hover:text-[var(--color-brand-dark)]"
            >
              Forgot password?
            </a>
          </p>

          {success ? <SuccessNote message="Signed in — redirecting..." /> : null}

          <SubmitButton label="Sign In" loading={loading} />
        </form>

        <p className="mt-6 text-center text-sm text-[var(--color-text-secondary)]">
          New here?{" "}
          <a
            href="/signup"
            className="font-bold text-[var(--color-brand)] transition-colors duration-150 hover:text-[var(--color-brand-dark)]"
          >
            Create an account
          </a>
        </p>
      </AuthCard>

      <p className="mx-auto mt-6 max-w-[440px] text-center text-xs text-[var(--color-text-secondary)]">
        ResQBD is a community coordination platform and does not replace calling
        999 in a life-threatening emergency.
      </p>
    </AuthShell>
  );
}