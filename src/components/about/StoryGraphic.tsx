export default function StoryGraphic() {
  return (
    <div className="w-full">
      <svg
        viewBox="0 0 400 400"
        className="mx-auto h-auto w-full max-w-[420px]"
        role="img"
        aria-label="Simplified map with a central signal point and radiating connection waves"
      >
        <circle cx="200" cy="200" r="170" fill="var(--color-surface)" />
        <circle
          cx="200"
          cy="200"
          r="170"
          fill="none"
          stroke="var(--color-border)"
        />

        <g stroke="var(--color-border)" strokeWidth="1" opacity="0.9">
          <path d="M30 140h340M30 260h340M140 30v340M260 30v340" />
        </g>

        <circle
          cx="200"
          cy="200"
          r="90"
          fill="var(--color-brand-light)"
          opacity="0.5"
        />
        <circle
          cx="200"
          cy="200"
          r="90"
          fill="none"
          stroke="var(--color-brand)"
          strokeOpacity="0.25"
        />

        <g fill="none" stroke="var(--color-brand)" strokeWidth="2" strokeLinecap="round">
          <path d="M70 200c0-72 58-130 130-130" />
          <path d="M100 200c0-55 45-100 100-100" />
          <path d="M130 200c0-39 31-70 70-70" />
        </g>

        <g transform="translate(200 200)">
          <path
            d="M0 44c0 0 26-24.5 26-41A26 26 0 0 0-26 3C-26 19.5 0 44 0 44Z"
            fill="var(--color-brand)"
          />
          <circle cx="0" cy="2" r="9" fill="var(--color-bg)" />
        </g>

        <circle cx="320" cy="120" r="8" fill="var(--color-brand-light)" stroke="var(--color-brand)" strokeWidth="1.5" />
        <circle cx="80" cy="300" r="8" fill="var(--color-brand-light)" stroke="var(--color-brand)" strokeWidth="1.5" />
        <circle cx="340" cy="280" r="8" fill="var(--color-brand-light)" stroke="var(--color-brand)" strokeWidth="1.5" />
      </svg>
    </div>
  );
}
