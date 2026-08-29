# ResQBD: Your Lifeline

PROJECT

Build "ResQBD — Smart Emergency Response Network", tagline "Report. Respond. Resolve." — a web platform for Bangladesh where citizens report emergencies, the system automatically calculates a transparent priority score, and automatically matches the nearest available volunteer or relevant emergency service (Fire, Police, Ambulance — currently a demo directory). Everything is tracked live. This is Step 1 of a multi-step build — set up the project foundation properly, then build ONLY the Home page. Do not build any other page yet.

ICONS AND IMAGES — READ CAREFULLY

Do not use any icon library (no Font Awesome, Material Icons, Heroicons, Lucide, or any other package).

Every icon must be a custom-built inline SVG that you design yourself, in a simple, single-color line-icon style, consistent stroke width across all icons. Build them as small reusable icon components.

Do not use any stock photo, placeholder image, or auto-generated generic image.

If a real photo is genuinely useful somewhere (e.g. a future team photo), leave a clearly labeled placeholder block instead — I will supply a real image myself if one is needed. Otherwise, design your own simple original graphic/illustration for that spot.

Do not insert any instructional or meta text as visible page content — only the actual copy specified below.

COLOR SYSTEM — set these up as CSS variables, use throughout

css

--color-bg: #FFFFFF;
--color-surface: #F7F7F7;
--color-border: #E2E2E2;
--color-text-primary: #111111;
--color-text-secondary: #555555;
--color-brand: #E85D04;
--color-brand-dark: #C24C03;
--color-brand-light: #FFE8D6;
--color-priority-critical: #D7263D;
--color-priority-high: #F4A100;
--color-priority-medium: #F6C90E;
--color-priority-low: #2E8B57;
--color-success: #2E8B57;
--color-danger: #D7263D;
--color-info: #3B7DD8;

Base feel: white background, near-black text, orange as the single accent color for buttons/CTAs/links — calm, high-contrast, trustworthy tone (not playful or pastel). Red (--color-priority-critical) is reserved exclusively for marking "Critical" priority incidents elsewhere in the app — never use it decoratively or as a general UI color, and it does not appear on this Home page at all. Typography: a clean high-contrast sans-serif, bold weight for headings, regular for body text, never thin/light weights.

SPACING SYSTEM — set up as a consistent scale, use everywhere

Section vertical padding: 96px top/bottom on desktop, 56px on mobile — the same value for every section so gaps feel uniform

Card internal padding: minimum 32px all sides desktop, 24px mobile

Gap between cards in a row: 24px

Max content width: 1200px centered, 24px side padding on mobile

COMPONENT STRUCTURE — set this up now, reuse for every future page

src/
  components/
    icons/        <- all custom SVG icons as individual components
    layout/        <- Navbar, Footer
    home/          <- Hero, HowItWorks, StatsStrip, WhyResQBD, DualCTA
  pages/
    Home.jsx       <- imports and arranges the components above, no inline markup
  styles/
    tokens.css     <- the color variables above

NAVBAR (reusable component)

Logo (custom SVG shield icon) + "ResQBD" wordmark | Home | About Us | How It Works | Technology | Get Involved | Contact | Login (outline button) | Report Emergency (solid orange button, always visible) Sticky on scroll, white background, subtle bottom border, comfortable height (72px). Mobile: collapses into a hamburger menu using a custom SVG icon. Add proper hover states on all nav links and buttons (color transition, 150-200ms).

HOME PAGE SECTIONS

1. Hero

Small pill badge: "REPORT. RESPOND. RESOLVE."

Bold headline, 2 lines, last word in --color-brand: "Smart Emergency Response." (at least 56px desktop, 36px mobile — the largest text on the page)

Subheadline: "Report emergencies instantly, get automatically matched with the nearest available volunteer or emergency service — transparently and fast."

Two buttons: solid orange "Report an Emergency", outline dark "Join as Volunteer"

Right side: a custom SVG graphic — a centered map pin with 2-3 soft concentric circles radiating outward as a background, and 4-5 small pin markers that randomly fade in/out at different positions and with a randomly chosen color each time from the priority color set (critical/high/medium/low) — the number of pins visible at once should vary naturally (sometimes 1, sometimes several). Keep the motion slow, calm, and subtle — not distracting or alarm-like. Central pin and background rings stay static; only the small pins animate.

Two-column layout desktop (text left, graphic right), stacks on mobile.

2. How It Works (3 steps)

Three equal-height cards in a row (stack on mobile), each with a custom SVG icon in a circular --color-brand-light badge, a bold title, one-line description:

Report — citizen submits incident with location and details

Score — system calculates priority instantly and transparently

Match — nearest available volunteer or emergency service is notified automatically

3. Live Stats Strip

--color-surface background band. Three stat blocks: large bold number + small uppercase label — "0 Incidents Resolved", "0 Active Volunteers", "0 Avg. Response Time" (static placeholder numbers for now).

4. Why ResQBD

Three cards, same visual style as section 2: Transparent Scoring (open algorithm, not black-box AI), Automatic Matching (intelligent geo-fencing connects helpers instantly), Community-Deployable (lightweight infrastructure built for Bangladesh's needs).

5. Dual CTA

Bordered container split into two halves (vertical divider desktop, stacked mobile): "Need Help?" + orange "Report an Emergency" button; "Want to Help?" + outline "Join as Volunteer" button.

6. Footer (reusable component)

Logo + tagline, repeated nav links, custom SVG social icons, and a disclaimer line: "ResQBD is a community coordination tool and does not replace calling 999 in a life-threatening emergency."

QUALITY CHECKLIST — verify before finishing

Every section uses the same vertical spacing rhythm, no section feels cramped or oversized next to its neighbors

No element overlaps another at any screen width

All cards in a row have identical height and padding

Hero graphic is clearly visible, detailed, and animated as described — not sparse

Fully responsive with no horizontal scroll on mobile

No red anywhere on this page except within the hero's animated priority pins (their defined purpose)

OUTPUT

Set up the full project foundation (colors, spacing, icon components, folder structure, Navbar, Footer) and build ONLY the Home page using it. Do not create any other route yet — I will provide the next page in a separate step.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/d8ecebf0-295a-4aea-9a12-5a3e24668177).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
