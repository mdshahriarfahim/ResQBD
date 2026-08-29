import { useEffect, useState } from "react";

const PRIORITY = [
  "var(--color-priority-critical)",
  "var(--color-priority-high)",
  "var(--color-priority-medium)",
  "var(--color-priority-low)",
];

const SPOTS = [
  { x: 88, y: 96 },
  { x: 306, y: 118 },
  { x: 132, y: 292 },
  { x: 292, y: 286 },
  { x: 200, y: 66 },
  { x: 70, y: 214 },
  { x: 330, y: 216 },
];

type PinState = { visible: boolean; color: string };

const pick = (i: number) => PRIORITY[i % PRIORITY.length] as string;

function Pin({ x, y, state }: { x: number; y: number; state: PinState }) {
  return (
    <g
      transform={`translate(${x} ${y})`}
      style={{
        opacity: state.visible ? 1 : 0,
        transition: "opacity 1800ms ease-in-out",
      }}
    >
      <path
        d="M0 14c0 0 7-6.6 7-11A7 7 0 0 0-7 3c0 4.4 7 11 7 11Z"
        fill={state.color}
        opacity="0.18"
      />
      <path
        d="M0 14c0 0 7-6.6 7-11A7 7 0 0 0-7 3c0 4.4 7 11 7 11Z"
        fill="none"
        stroke={state.color}
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <circle cx="0" cy="3" r="2.4" fill={state.color} />
    </g>
  );
}

export default function HeroGraphic() {
  const [pins, setPins] = useState<PinState[]>(() =>
    SPOTS.map((_, i) => ({ visible: i % 3 === 0, color: pick(i) })),
  );

  useEffect(() => {
    const id = window.setInterval(() => {
      setPins((prev) => {
        const next = prev.slice();
        const i = Math.floor(Math.random() * next.length);
        const current = next[i] as PinState;
        const nowVisible = !current.visible;
        next[i] = {
          visible: nowVisible,
          color: nowVisible
            ? pick(Math.floor(Math.random() * PRIORITY.length))
            : current.color,
        };
        return next;
      });
    }, 1400);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="w-full">
      <svg
        viewBox="0 0 400 400"
        className="mx-auto h-auto w-full max-w-[520px]"
        role="img"
        aria-label="Map with a central location pin and nearby incident markers"
      >
        <circle cx="200" cy="200" r="170" fill="var(--color-surface)" />
        <circle
          cx="200"
          cy="200"
          r="170"
          fill="none"
          stroke="var(--color-border)"
        />
        <circle
          cx="200"
          cy="200"
          r="120"
          fill="var(--color-brand-light)"
          opacity="0.7"
        />
        <circle
          cx="200"
          cy="200"
          r="120"
          fill="none"
          stroke="var(--color-border)"
        />
        <circle cx="200" cy="200" r="70" fill="var(--color-brand-light)" />
        <circle
          cx="200"
          cy="200"
          r="70"
          fill="none"
          stroke="var(--color-brand)"
          strokeOpacity="0.35"
        />

        <g
          stroke="var(--color-border)"
          strokeWidth="1"
          opacity="0.9"
        >
          <path d="M30 140h340M30 260h340M140 30v340M260 30v340" />
        </g>

        <g transform="translate(200 200)">
          <path
            d="M0 44c0 0 26-24.5 26-41A26 26 0 0 0-26 3C-26 19.5 0 44 0 44Z"
            fill="var(--color-brand)"
          />
          <circle cx="0" cy="2" r="9" fill="var(--color-bg)" />
        </g>

        {SPOTS.map((s, i) => (
          <Pin key={i} x={s.x} y={s.y} state={pins[i] as PinState} />
        ))}
      </svg>
    </div>
  );
}
