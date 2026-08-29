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
import { CitizenIcon, VolunteerIcon } from "@/components/icons";

const title = "Create Your Account — ResQBD";
const description =
  "Sign up for ResQBD as a citizen or volunteer to report emergencies and get matched with the nearest available responder.";

export const Route = createFileRoute("/signup")({
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
  component: SignUpPage,
});

type Role = "citizen" | "volunteer";
type FieldKey = "name" | "phone" | "email" | "password" | "confirm" | "area";
type Errors = { [K in FieldKey]?: string };

function SignUpPage() {
  const navigate = useNavigate();
  const [role, setRole] = useState<Role>("citizen");
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    confirm: "",
    area: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const set = (key: keyof typeof form) => (value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  function validate(): Errors {
    const next: Errors = {};
    if (!form.name.trim()) next.name = "Full name is required.";
    if (!form.phone.trim()) next.phone = "Phone number is required.";
    else if (!/^[0-9+\-\s]{6,20}$/.test(form.phone.trim()))
      next.phone = "Enter a valid phone number.";
    if (!form.email.trim()) next.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim()))
      next.email = "Enter a valid email address.";
    if (!form.password) next.password = "Password is required.";
    else if (form.password.length < 8)
      next.password = "Password must be at least 8 characters.";
    if (!form.confirm) next.confirm = "Please confirm your password.";
    else if (form.confirm !== form.password)
      next.confirm = "Passwords do not match.";
    if (role === "volunteer" && !form.area.trim())
      next.area = "Area or location is required for volunteers.";
    return next;
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length > 0) return;
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
          Create your account
        </h1>
        <p className="mt-3 text-center text-sm text-[var(--color-text-secondary)]">
          Choose how you want to take part in the response network.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-[var(--card-gap)] sm:grid-cols-2">
          <RoleCard
            label="I'm a Citizen"
            note="Report emergencies near me"
            selected={role === "citizen"}
            onSelect={() => setRole("citizen")}
            icon={<CitizenIcon size={28} />}
          />
          <RoleCard
            label="I want to Volunteer"
            note="Respond to nearby incidents"
            selected={role === "volunteer"}
            onSelect={() => setRole("volunteer")}
            icon={<VolunteerIcon size={28} />}
          />
        </div>

        <form onSubmit={onSubmit} noValidate className="mt-6 flex flex-col gap-5">
          <Field
            id="name"
            label="Full Name"
            value={form.name}
            error={errors.name}
            autoComplete="name"
            onChange={set("name")}
          />
          <Field
            id="phone"
            label="Phone Number"
            type="tel"
            value={form.phone}
            error={errors.phone}
            autoComplete="tel"
            onChange={set("phone")}
          />
          <Field
            id="email"
            label="Email"
            type="email"
            value={form.email}
            error={errors.email}
            autoComplete="email"
            onChange={set("email")}
          />
          <Field
            id="password"
            label="Password"
            type="password"
            value={form.password}
            error={errors.password}
            autoComplete="new-password"
            onChange={set("password")}
          />
          <Field
            id="confirm"
            label="Confirm Password"
            type="password"
            value={form.confirm}
            error={errors.confirm}
            autoComplete="new-password"
            onChange={set("confirm")}
          />
          {role === "volunteer" ? (
            <Field
              id="area"
              label="Area / Location"
              value={form.area}
              error={errors.area}
              onChange={set("area")}
            />
          ) : null}

          {success ? (
            <SuccessNote message="Account created — redirecting..." />
          ) : null}

          <SubmitButton label="Create Account" loading={loading} />
        </form>

        <p className="mt-6 text-center text-sm text-[var(--color-text-secondary)]">
          Already have an account?{" "}
          <a
            href="/signin"
            className="font-bold text-[var(--color-brand)] transition-colors duration-150 hover:text-[var(--color-brand-dark)]"
          >
            Sign In
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

function RoleCard({
  label,
  note,
  selected,
  onSelect,
  icon,
}: {
  label: string;
  note: string;
  selected: boolean;
  onSelect: () => void;
  icon: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`flex h-full flex-col items-start gap-3 rounded-xl border p-5 text-left transition-colors duration-150 ${
        selected
          ? "border-[var(--color-brand)] bg-[var(--color-brand-light)]"
          : "border-[var(--color-border)] bg-[var(--color-bg)] hover:border-[var(--color-brand)]"
      }`}
    >
      <span className="text-[var(--color-brand)]">{icon}</span>
      <span className="text-base font-bold text-[var(--color-text-primary)]">
        {label}
      </span>
      <span className="text-sm text-[var(--color-text-secondary)]">{note}</span>
    </button>
  );
}
