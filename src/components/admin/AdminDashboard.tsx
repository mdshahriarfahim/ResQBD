import { useState } from "react";
import { ShieldIcon, FireIcon } from "@/components/icons";

type Priority = "critical" | "high" | "medium" | "low";

const priorityColor: Record<Priority, string> = {
  critical: "#D7263D",
  high: "#F4A100",
  medium: "#F6C90E",
  low: "#2E8B57",
};

type Incident = {
  id: string;
  type: string;
  location: string;
  priority: Priority;
  distance: string;
  status: string;
  x: number;
  y: number;
  breakdown: { label: string; value: number; max: number }[];
  finalScore: number;
};

const incidents: Incident[] = [
  {
    id: "RQ-2041",
    type: "Fire",
    location: "Sheikh Rd",
    priority: "critical",
    distance: "0.8 km",
    status: "Matched",
    x: 22,
    y: 22,
    breakdown: [
      { label: "Incident type", value: 2.8, max: 3.15 },
      { label: "Severity", value: 1.9, max: 3 },
      { label: "Time elapsed", value: 0.6, max: 2 },
      { label: "Area density", value: 0.8, max: 1.8 },
    ],
    finalScore: 8.1,
  },
  {
    id: "RQ-2038",
    type: "Road Accident",
    location: "Mirpur",
    priority: "high",
    distance: "1.4 km",
    status: "En route",
    x: 55,
    y: 35,
    breakdown: [
      { label: "Incident type", value: 2.1, max: 3.15 },
      { label: "Severity", value: 1.6, max: 3 },
      { label: "Time elapsed", value: 1.1, max: 2 },
      { label: "Area density", value: 0.9, max: 1.8 },
    ],
    finalScore: 6.4,
  },
  {
    id: "RQ-2035",
    type: "Flood",
    location: "Jatrabari",
    priority: "medium",
    distance: "2.1 km",
    status: "Assigned",
    x: 70,
    y: 20,
    breakdown: [
      { label: "Incident type", value: 1.8, max: 3.15 },
      { label: "Severity", value: 1.2, max: 3 },
      { label: "Time elapsed", value: 0.8, max: 2 },
      { label: "Area density", value: 0.6, max: 1.8 },
    ],
    finalScore: 4.9,
  },
  {
    id: "RQ-2029",
    type: "Medical",
    location: "Dhanmondi",
    priority: "low",
    distance: "0.5 km",
    status: "En route",
    x: 35,
    y: 58,
    breakdown: [
      { label: "Incident type", value: 1.2, max: 3.15 },
      { label: "Severity", value: 0.8, max: 3 },
      { label: "Time elapsed", value: 0.4, max: 2 },
      { label: "Area density", value: 0.5, max: 1.8 },
    ],
    finalScore: 3.2,
  },
  {
    id: "RQ-2044",
    type: "Fire",
    location: "Uttara",
    priority: "high",
    distance: "3.0 km",
    status: "Matched",
    x: 80,
    y: 60,
    breakdown: [
      { label: "Incident type", value: 2.6, max: 3.15 },
      { label: "Severity", value: 1.7, max: 3 },
      { label: "Time elapsed", value: 0.5, max: 2 },
      { label: "Area density", value: 0.7, max: 1.8 },
    ],
    finalScore: 6.9,
  },
  {
    id: "RQ-2050",
    type: "Building Collapse",
    location: "Old Dhaka",
    priority: "critical",
    distance: "1.1 km",
    status: "Matched",
    x: 65,
    y: 72,
    breakdown: [
      { label: "Incident type", value: 2.9, max: 3.15 },
      { label: "Severity", value: 2.2, max: 3 },
      { label: "Time elapsed", value: 1.0, max: 2 },
      { label: "Area density", value: 1.0, max: 1.8 },
    ],
    finalScore: 8.4,
  },
];

const volunteers = [
  { name: "Rahim U.", status: "En route", color: "#2E8B57" },
  { name: "Karim H.", status: "Available", color: "#2E8B57" },
  { name: "Nasrin A.", status: "On scene", color: "#F4A100" },
  { name: "Jasim K.", status: "Offline", color: "#5A5F6A" },
];

const activityFeed = [
  { text: "Rahim accepted Fire — Sheikh Rd", time: "12s ago" },
  { text: "Incident #RQ-2033 marked Resolved", time: "1m ago" },
  { text: "New report: Flood — Jatrabari", time: "2m ago" },
];

const typeCounts = [
  { label: "Fire", value: 70, color: "#D7263D" },
  { label: "Flood", value: 45, color: "#F4A100" },
  { label: "Accident", value: 55, color: "#F6C90E" },
  { label: "Medical", value: 30, color: "#2E8B57" },
];

const filterOptions = ["All types", "Fire", "Flood", "Accident", "Medical"];

function WarningPin({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 24 24" width={18} height={18}>
      <path d="M12 3 L21 19 H3 Z" fill="none" stroke={color} strokeWidth={1.8} />
      <line x1="12" y1="9" x2="12" y2="14" stroke={color} strokeWidth={1.8} />
      <circle cx="12" cy="17" r="0.9" fill={color} />
    </svg>
  );
}

export default function AdminDashboard() {
  const [filter, setFilter] = useState("All types");
  const [selectedId, setSelectedId] = useState(incidents[0].id);
  const [layers, setLayers] = useState({
    volunteers: true,
    fire: false,
    ambulance: false,
  });

  const visibleIncidents =
    filter === "All types"
      ? incidents
      : incidents.filter((i) => i.type.toLowerCase().includes(filter.toLowerCase()));

  const selected = incidents.find((i) => i.id === selectedId) ?? incidents[0];
  const criticalCount = incidents.filter((i) => i.priority === "critical").length;

  return (
    <div
      className="min-h-screen"
      style={{ background: "#14181F", color: "#E8E6DD", fontFamily: "inherit" }}
    >
      <div
        className="flex items-center justify-between px-6 py-3 text-xs"
        style={{ borderBottom: "1px solid #262B35", color: "#8A8F9C" }}
      >
        <div className="flex items-center gap-2 text-sm font-bold text-white">
          <ShieldIcon size={18} />
          ResQBD <span style={{ color: "#8A8F9C", fontWeight: 500 }}>— Admin</span>
        </div>
        <div>{volunteers.filter((v) => v.status !== "Offline").length} volunteers online</div>
      </div>

      <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-5 px-6 py-6 lg:grid-cols-[220px_1fr_220px]">
        <div>
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-lg p-3 text-center" style={{ background: "#1C212B" }}>
              <p className="text-lg font-bold text-white">{incidents.length}</p>
              <p className="text-[9px] uppercase tracking-wide" style={{ color: "#8A8F9C" }}>
                Active
              </p>
            </div>
            <div
              className="rounded-lg p-3 text-center"
              style={{ background: "#1C212B", border: "1px solid #5A2020" }}
            >
              <p className="text-lg font-bold" style={{ color: "#F0787C" }}>
                {criticalCount}
              </p>
              <p className="text-[9px] uppercase tracking-wide" style={{ color: "#8A8F9C" }}>
                Critical
              </p>
            </div>
          </div>

          <p className="mb-2 mt-4 text-[9px] font-bold uppercase tracking-wide" style={{ color: "#8A8F9C" }}>
            Filter
          </p>
          <div className="flex flex-col gap-1">
            {filterOptions.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className="rounded-md px-3 py-1.5 text-left text-xs font-semibold transition-colors duration-150"
                style={
                  filter === f
                    ? { background: "#3A2113", color: "#F4A100", border: "1px solid #5A3319" }
                    : { background: "#1C212B", color: "#B8BAC2", border: "1px solid transparent" }
                }
              >
                {f}
              </button>
            ))}
          </div>

          <p className="mb-2 mt-4 text-[9px] font-bold uppercase tracking-wide" style={{ color: "#8A8F9C" }}>
            Layers
          </p>
          {(
            [
              ["volunteers", "Volunteers"],
              ["fire", "Fire stations"],
              ["ambulance", "Ambulance"],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setLayers((l) => ({ ...l, [key]: !l[key] }))}
              className="mb-1 flex w-full items-center justify-between rounded-md px-3 py-1.5 text-xs font-semibold"
              style={{ background: "#1C212B", color: "#B8BAC2" }}
            >
              {label}
              <span
                className="relative h-3 w-5 rounded-full transition-colors duration-150"
                style={{ background: layers[key] ? "#2E8B57" : "#3A3F4A" }}
              >
                <span
                  className="absolute top-[1.5px] h-2 w-2 rounded-full bg-white transition-all duration-150"
                  style={{ left: layers[key] ? "10px" : "1.5px" }}
                />
              </span>
            </button>
          ))}

          <div className="mt-4 rounded-lg p-3" style={{ background: "#1C212B" }}>
            <p className="mb-2 text-[9px] uppercase tracking-wide" style={{ color: "#8A8F9C" }}>
              Incidents by type
            </p>
            {typeCounts.map((t) => (
              <div key={t.label} className="mb-1.5 flex items-center gap-2">
                <span className="w-11 text-[9px]" style={{ color: "#B8BAC2" }}>
                  {t.label}
                </span>
                <span className="h-1.5 flex-1 overflow-hidden rounded" style={{ background: "#262B35" }}>
                  <span
                    className="block h-full"
                    style={{ width: `${t.value}%`, background: t.color }}
                  />
                </span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div
            className="relative h-[280px] overflow-hidden rounded-lg"
            style={{ background: "#1A1E27" }}
          >
            <svg className="absolute inset-0 h-full w-full" style={{ opacity: 0.5 }} viewBox="0 0 450 280">
              <path d="M0 70 L450 100" stroke="#2A2F3B" strokeWidth="4" fill="none" />
              <path d="M40 0 L120 280" stroke="#2A2F3B" strokeWidth="4" fill="none" />
              <path d="M0 180 L450 150" stroke="#2A2F3B" strokeWidth="3" fill="none" />
              <path d="M300 0 L260 280" stroke="#2A2F3B" strokeWidth="3" fill="none" />
            </svg>
            {visibleIncidents.map((inc) => (
              <button
                key={inc.id}
                type="button"
                onClick={() => setSelectedId(inc.id)}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${inc.x}%`, top: `${inc.y}%` }}
                aria-label={`${inc.type} at ${inc.location}`}
              >
                {inc.priority === "critical" && (
                  <span
                    className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full"
                    style={{
                      background: priorityColor[inc.priority],
                      animation: "resqbd-pulse 1.8s infinite",
                    }}
                  />
                )}
                <WarningPin color={priorityColor[inc.priority]} />
              </button>
            ))}
            {layers.volunteers && (
              <>
                <span className="absolute h-2.5 w-2.5 rounded-full" style={{ left: "30%", top: "40%", background: "#3B7DD8", border: "1.5px solid #14181F" }} />
                <span className="absolute h-2.5 w-2.5 rounded-full" style={{ left: "60%", top: "55%", background: "#3B7DD8", border: "1.5px solid #14181F" }} />
              </>
            )}
          </div>

          <div className="mt-3 max-h-[70px] overflow-hidden rounded-lg px-4 py-2" style={{ background: "#1C212B" }}>
            {activityFeed.map((f) => (
              <p key={f.text} className="py-0.5 text-[11px]" style={{ color: "#8A8F9C" }}>
                <span style={{ color: "#E8E6DD", fontWeight: 600 }}>{f.text.split(" ")[0]}</span>
                {" " + f.text.split(" ").slice(1).join(" ")} &middot; {f.time}
              </p>
            ))}
          </div>

          <div className="mt-4 rounded-lg p-4" style={{ background: "#1C212B" }}>
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-sm font-bold text-white">
                <FireIcon size={16} />
                {selected.type} — {selected.location}
              </h2>
              <span
                className="rounded-full px-2.5 py-1 text-[10px] font-bold uppercase"
                style={{
                  background: `${priorityColor[selected.priority]}22`,
                  color: priorityColor[selected.priority],
                }}
              >
                {selected.priority}
              </span>
            </div>
            <div className="mt-3">
              {selected.breakdown.map((b) => (
                <div key={b.label} className="mb-2 flex items-center gap-2">
                  <span className="w-24 text-[10px]" style={{ color: "#8A8F9C" }}>
                    {b.label}
                  </span>
                  <span className="h-1.5 flex-1 overflow-hidden rounded" style={{ background: "#262B35" }}>
                    <span
                      className="block h-full"
                      style={{
                        width: `${(b.value / b.max) * 100}%`,
                        background: "#E85D04",
                      }}
                    />
                  </span>
                  <span className="w-8 text-right text-[10px] font-bold" style={{ color: "#E8E6DD" }}>
                    {b.value.toFixed(1)}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-3 flex items-center justify-between rounded-md p-2.5" style={{ background: "#14181F" }}>
              <span className="text-[10px]" style={{ color: "#8A8F9C" }}>
                Final priority score
              </span>
              <span className="text-lg font-extrabold" style={{ color: priorityColor[selected.priority] }}>
                {selected.finalScore.toFixed(1)}
              </span>
            </div>
          </div>
        </div>

        <div>
          <p className="mb-2 text-[9px] font-bold uppercase tracking-wide" style={{ color: "#8A8F9C" }}>
            Active list
          </p>
          <div className="flex flex-col gap-1.5">
            {visibleIncidents.map((inc) => (
              <button
                key={inc.id}
                type="button"
                onClick={() => setSelectedId(inc.id)}
                className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-left text-[11px]"
                style={{
                  background: selectedId === inc.id ? "#231A12" : "#1C212B",
                  border: selectedId === inc.id ? "1px solid #E85D04" : "1px solid transparent",
                  color: "#E8E6DD",
                }}
              >
                <span
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{ background: priorityColor[inc.priority] }}
                />
                <span className="flex-1">
                  {inc.type} — {inc.location}
                  <br />
                  <span style={{ color: "#8A8F9C" }}>
                    {inc.distance} &middot; {inc.status}
                  </span>
                </span>
              </button>
            ))}
          </div>

          <p className="mb-2 mt-5 text-[9px] font-bold uppercase tracking-wide" style={{ color: "#8A8F9C" }}>
            Volunteers
          </p>
          <div className="flex flex-col gap-1">
            {volunteers.map((v) => (
              <div key={v.name} className="flex items-center gap-2 py-1.5">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: v.color }} />
                <div>
                  <p className="text-[11px]" style={{ color: "#E8E6DD" }}>
                    {v.name}
                  </p>
                  <p className="text-[9px]" style={{ color: "#8A8F9C" }}>
                    {v.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes resqbd-pulse {
          0% { box-shadow: 0 0 0 0 rgba(215,38,61,0.4); }
          100% { box-shadow: 0 0 0 14px rgba(215,38,61,0); }
        }
      `}</style>
    </div>
  );
}