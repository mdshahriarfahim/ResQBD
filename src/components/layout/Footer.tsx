import {
  ShieldIcon,
  FacebookIcon,
  XIcon,
  MailIcon,
} from "@/components/icons";

const links = [
  "Home",
  "About Us",
  "How It Works",
  "Get Involved",
  "Contact",
];

export default function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-bg)]">
      <div className="mx-auto max-w-[var(--content-max)] px-6 py-[var(--section-y)]">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="flex items-center gap-2 text-[var(--color-text-primary)]">
              <span className="text-[var(--color-brand)]">
                <ShieldIcon size={28} />
              </span>
              <span className="text-lg font-bold tracking-tight">ResQBD</span>
            </div>
            <p className="mt-3 text-sm text-[var(--color-text-secondary)]">
              Report. Respond. Resolve.
            </p>
          </div>

          <nav className="grid grid-cols-2 gap-x-10 gap-y-2 sm:grid-cols-3">
            {links.map((l) => (
              <a
                key={l}
                href="#"
                className="text-sm font-medium text-[var(--color-text-secondary)] transition-colors duration-150 hover:text-[var(--color-brand)]"
              >
                {l}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <a
              href="#"
              aria-label="Facebook"
              className="text-[var(--color-text-secondary)] transition-colors duration-150 hover:text-[var(--color-brand)]"
            >
              <FacebookIcon />
            </a>
            <a
              href="#"
              aria-label="X"
              className="text-[var(--color-text-secondary)] transition-colors duration-150 hover:text-[var(--color-brand)]"
            >
              <XIcon />
            </a>
            <a
              href="#"
              aria-label="Email"
              className="text-[var(--color-text-secondary)] transition-colors duration-150 hover:text-[var(--color-brand)]"
            >
              <MailIcon />
            </a>
          </div>
        </div>

        <p className="mt-10 border-t border-[var(--color-border)] pt-6 text-sm text-[var(--color-text-secondary)]">
          ResQBD is a community coordination tool and does not replace calling 999
          in a life-threatening emergency.
        </p>
      </div>
    </footer>
  );
}
