import { useState } from "react";
import { ShieldIcon, MenuIcon, CloseIcon } from "@/components/icons";

const links = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "Get Involved", href: "/get-involved" },
  { label: "Contact", href: "/contact" },
];


export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-[var(--color-bg)]">
      <div className="mx-auto flex h-[var(--navbar-h)] max-w-[var(--content-max)] items-center justify-between px-6">
        <a href="/" className="flex items-center gap-2 text-[var(--color-text-primary)]">
          <span className="text-[var(--color-brand)]">
            <ShieldIcon size={28} />
          </span>
          <span className="text-lg font-bold tracking-tight">ResQBD</span>
        </a>

        <nav className="hidden items-center gap-7 lg:flex">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="text-sm font-medium text-[var(--color-text-secondary)] transition-colors duration-150 hover:text-[var(--color-brand)]"
            >
              {l.label}
            </a>
          ))}

        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <a
            href="/signin"
            className="rounded-md border border-[var(--color-text-primary)] px-4 py-2 text-sm font-semibold text-[var(--color-text-primary)] transition-colors duration-200 hover:bg-[var(--color-text-primary)] hover:text-white"
          >
            Login
          </a>
          <a
            href="/report"
            className="rounded-md bg-[var(--color-brand)] px-4 py-2 text-sm font-semibold text-white transition-colors duration-200 hover:bg-[var(--color-brand-dark)]"
          >
            Report Emergency
          </a>
        </div>

        <div className="flex items-center gap-3 lg:hidden">
          <a
            href="/report"
            className="rounded-md bg-[var(--color-brand)] px-3 py-2 text-xs font-semibold text-white transition-colors duration-200 hover:bg-[var(--color-brand-dark)]"
          >
            Report Emergency
          </a>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="text-[var(--color-text-primary)] transition-colors duration-150 hover:text-[var(--color-brand)]"
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-[var(--color-border)] bg-[var(--color-bg)] lg:hidden">
          <nav className="mx-auto flex max-w-[var(--content-max)] flex-col gap-1 px-6 py-4">
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="py-2 text-sm font-medium text-[var(--color-text-secondary)] transition-colors duration-150 hover:text-[var(--color-brand)]"
              >
                {l.label}
              </a>
            ))}

            <a
              href="/signin"
              className="mt-2 rounded-md border border-[var(--color-text-primary)] px-4 py-2 text-center text-sm font-semibold text-[var(--color-text-primary)] transition-colors duration-200 hover:bg-[var(--color-text-primary)] hover:text-white"
            >
              Login
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}