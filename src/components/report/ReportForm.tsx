import { useEffect, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  FireIcon,
  FloodIcon,
  AccidentIcon,
  MedicalIcon,
  CollapseIcon,
  DrowningIcon,
  StormIcon,
  OtherIcon,
  CameraIcon,
  RetakeIcon,
  GeoIcon,
  CheckIcon,
  SpinnerIcon,
} from "@/components/icons";

type IncidentType =
  | "fire"
  | "flood"
  | "accident"
  | "medical"
  | "collapse"
  | "drowning"
  | "storm"
  | "other";

const INCIDENT_TYPES: { key: IncidentType; label: string; icon: React.ReactNode }[] = [
  { key: "fire", label: "Fire", icon: <FireIcon size={22} /> },
  { key: "flood", label: "Flood", icon: <FloodIcon size={22} /> },
  { key: "accident", label: "Road Accident", icon: <AccidentIcon size={22} /> },
  { key: "medical", label: "Medical Emergency", icon: <MedicalIcon size={22} /> },
  { key: "collapse", label: "Building Collapse", icon: <CollapseIcon size={22} /> },
  { key: "drowning", label: "Drowning", icon: <DrowningIcon size={22} /> },
  { key: "storm", label: "Cyclone / Storm", icon: <StormIcon size={22} /> },
  { key: "other", label: "Other", icon: <OtherIcon size={22} /> },
];

type LocationState =
  | { status: "idle" }
  | { status: "requesting" }
  | { status: "granted"; lat: number; lng: number }
  | { status: "denied" };

function StepProgress({ step }: { step: 1 | 2 | 3 }) {
  return (
    <div className="mb-6 flex gap-2">
      {[1, 2, 3].map((n) => (
        <div
          key={n}
          className={`h-1 flex-1 rounded-full transition-colors duration-150 ${
            n <= step ? "bg-[var(--color-brand)]" : "bg-[var(--color-border)]"
          }`}
        />
      ))}
    </div>
  );
}

export default function ReportForm() {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Step 1 state
  const [incidentType, setIncidentType] = useState<IncidentType | null>(null);
  const [severity, setSeverity] = useState<number>(3);

  // Step 2 state
  const [location, setLocation] = useState<LocationState>({ status: "idle" });
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [step2Errors, setStep2Errors] = useState<{ name?: string; phone?: string }>({});

  // Step 3 state
  const [photo, setPhoto] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [trackingCode] = useState(
    () => `RQ-${Math.floor(1000 + Math.random() * 9000)}`,
  );

  // Auto-trigger geolocation as soon as step 2 loads
  useEffect(() => {
    if (step !== 2 || location.status !== "idle") return;
    if (!("geolocation" in navigator)) {
      setLocation({ status: "denied" });
      return;
    }
    setLocation({ status: "requesting" });
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        setLocation({
          status: "granted",
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        }),
      () => setLocation({ status: "denied" }),
      { enableHighAccuracy: true, timeout: 8000 },
    );
  }, [step, location.status]);

  function goStep2() {
    if (!incidentType) return;
    setStep(2);
  }

  function validateStep2() {
    const next: { name?: string; phone?: string } = {};
    if (!name.trim()) next.name = "Your name is required.";
    if (!phone.trim()) next.phone = "Phone number is required.";
    else if (!/^[0-9+\-\s]{6,20}$/.test(phone.trim()))
      next.phone = "Enter a valid phone number.";
    setStep2Errors(next);
    return Object.keys(next).length === 0;
  }

  function goStep3() {
    if (!validateStep2()) return;
    setStep(3);
  }

  function onCapture(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPhoto(reader.result as string);
    reader.readAsDataURL(file);
  }

  function submit() {
    if (!photo) return;
    setSubmitting(true);
    window.setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 1400);
  }

  const selectedType = INCIDENT_TYPES.find((t) => t.key === incidentType);

  if (submitted) {
    return (
      <div className="mx-auto max-w-[520px] rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] p-[var(--card-pad)] text-center shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-brand-light)] text-[var(--color-brand)]">
          <CheckIcon size={32} />
        </div>
        <h2 className="mt-5 text-2xl font-bold tracking-tight">Report sent</h2>
        <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
          Your tracking code
        </p>
        <p className="mt-1 text-3xl font-extrabold tracking-tight text-[var(--color-brand)]">
          {trackingCode}
        </p>
        <p className="mt-4 text-sm text-[var(--color-text-secondary)]">
          Note this code for your records. Your report is being matched to the
          nearest available responder now.
        </p>
        <button
          type="button"
          onClick={() => navigate({ to: "/track", search: { code: trackingCode } })}
          className="mt-6 h-12 w-full rounded-lg bg-[var(--color-brand)] text-base font-bold text-[var(--color-bg)] transition-colors duration-150 hover:bg-[var(--color-brand-dark)]"
        >
          Track this report
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[640px] rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] p-[var(--card-pad)] shadow-sm">
      <span className="inline-block rounded-full bg-[var(--color-brand-light)] px-3 py-1 text-xs font-bold uppercase tracking-wide text-[var(--color-brand-dark)]">
        Report an Emergency
      </span>

      <StepProgress step={step} />

      {step === 1 ? (
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-[28px]">
            Tell us what&apos;s happening
          </h1>
          <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
            This takes about a minute. No account needed.
          </p>

          <p className="mt-6 text-sm font-bold text-[var(--color-text-primary)]">
            Incident type
          </p>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {INCIDENT_TYPES.map((t) => {
              const selected = incidentType === t.key;
              return (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setIncidentType(t.key)}
                  aria-pressed={selected}
                  className={`flex min-h-[88px] flex-col items-center justify-center gap-2 rounded-xl border p-3 text-center transition-colors duration-150 ${
                    selected
                      ? "border-[var(--color-brand)] bg-[var(--color-brand-light)]"
                      : "border-[var(--color-border)] bg-[var(--color-bg)] hover:border-[var(--color-brand)]"
                  }`}
                >
                  <span className="text-[var(--color-brand)]">{t.icon}</span>
                  <span className="text-xs font-bold leading-tight text-[var(--color-text-primary)]">
                    {t.label}
                  </span>
                </button>
              );
            })}
          </div>

          <p className="mt-6 text-sm font-bold text-[var(--color-text-primary)]">
            Severity
          </p>
          <div className="mt-3 flex gap-2">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setSeverity(n)}
                aria-pressed={severity === n}
                className={`h-12 flex-1 rounded-lg border text-sm font-bold transition-colors duration-150 ${
                  severity === n
                    ? "border-[var(--color-brand)] bg-[var(--color-brand)] text-[var(--color-bg)]"
                    : "border-[var(--color-border)] text-[var(--color-text-primary)] hover:border-[var(--color-brand)]"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
          <div className="mt-1 flex justify-between text-xs text-[var(--color-text-secondary)]">
            <span>Minor</span>
            <span>Life-threatening</span>
          </div>

          <button
            type="button"
            disabled={!incidentType}
            onClick={goStep2}
            className="mt-8 h-12 w-full rounded-lg bg-[var(--color-brand)] text-base font-bold text-[var(--color-bg)] transition-colors duration-150 hover:bg-[var(--color-brand-dark)] disabled:cursor-not-allowed disabled:bg-[var(--color-brand-light)] disabled:text-[var(--color-brand-dark)]"
          >
            Next
          </button>
        </div>
      ) : null}

      {step === 2 ? (
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-[28px]">
            Where and who
          </h1>

          <p className="mt-6 text-sm font-bold text-[var(--color-text-primary)]">
            Location
          </p>
          <div className="mt-3 flex h-28 items-center justify-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-text-secondary)]">
            {location.status === "requesting" ? (
              <>
                <SpinnerIcon size={18} />
                Detecting your location...
              </>
            ) : location.status === "granted" ? (
              <>
                <span className="text-[var(--color-brand)]">
                  <GeoIcon size={20} />
                </span>
                Location detected ({location.lat.toFixed(4)}, {location.lng.toFixed(4)})
              </>
            ) : location.status === "denied" ? (
              <span className="px-4 text-center">
                Location access denied — tap the map to set your location
                manually.
              </span>
            ) : (
              "Map preview"
            )}
          </div>

          <label className="mt-6 block text-sm font-bold text-[var(--color-text-primary)]">
            Description (optional)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. Fire on the 2nd floor, people trapped inside"
            rows={3}
            className="mt-2 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] p-4 text-base text-[var(--color-text-primary)] outline-none transition-colors duration-150 focus:border-[var(--color-brand)] focus:ring-2 focus:ring-[var(--color-brand)]"
          />

          <label className="mt-5 block text-sm font-bold text-[var(--color-text-primary)]">
            Your name
          </label>
          <input
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setStep2Errors((er) => ({ ...er, name: undefined }));
            }}
            className={`mt-2 h-12 w-full rounded-lg border bg-[var(--color-bg)] px-4 text-base text-[var(--color-text-primary)] outline-none transition-colors duration-150 focus:border-[var(--color-brand)] focus:ring-2 focus:ring-[var(--color-brand)] ${
              step2Errors.name ? "border-[var(--color-danger)]" : "border-[var(--color-border)]"
            }`}
          />
          {step2Errors.name ? (
            <p className="mt-1 text-sm font-medium text-[var(--color-danger)]">
              {step2Errors.name}
            </p>
          ) : null}

          <label className="mt-5 block text-sm font-bold text-[var(--color-text-primary)]">
            Phone number
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              setStep2Errors((er) => ({ ...er, phone: undefined }));
            }}
            className={`mt-2 h-12 w-full rounded-lg border bg-[var(--color-bg)] px-4 text-base text-[var(--color-text-primary)] outline-none transition-colors duration-150 focus:border-[var(--color-brand)] focus:ring-2 focus:ring-[var(--color-brand)] ${
              step2Errors.phone ? "border-[var(--color-danger)]" : "border-[var(--color-border)]"
            }`}
          />
          {step2Errors.phone ? (
            <p className="mt-1 text-sm font-medium text-[var(--color-danger)]">
              {step2Errors.phone}
            </p>
          ) : null}

          <div className="mt-8 flex gap-3">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="h-12 flex-1 rounded-lg border border-[var(--color-text-primary)] text-base font-bold text-[var(--color-text-primary)] transition-colors duration-150 hover:bg-[var(--color-surface)]"
            >
              Back
            </button>
            <button
              type="button"
              onClick={goStep3}
              className="h-12 flex-[2] rounded-lg bg-[var(--color-brand)] text-base font-bold text-[var(--color-bg)] transition-colors duration-150 hover:bg-[var(--color-brand-dark)]"
            >
              Next
            </button>
          </div>
        </div>
      ) : null}

      {step === 3 ? (
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-[28px]">
            Live photo &amp; submit
          </h1>

          <p className="mt-6 text-sm font-bold text-[var(--color-text-primary)]">
            Live photo (required)
          </p>

          {photo ? (
            <div className="mt-3">
              <img
                src={photo}
                alt="Captured incident"
                className="h-48 w-full rounded-xl border border-[var(--color-border)] object-cover"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-[var(--color-border)] text-sm font-bold text-[var(--color-text-primary)] transition-colors duration-150 hover:bg-[var(--color-surface)]"
              >
                <RetakeIcon size={18} />
                Retake
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="mt-3 flex h-40 w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[var(--color-brand)] bg-[var(--color-brand-light)] text-[var(--color-brand-dark)] transition-colors duration-150 hover:bg-[var(--color-brand)] hover:text-[var(--color-bg)]"
            >
              <CameraIcon size={28} />
              <span className="text-sm font-bold">Tap to open camera</span>
            </button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={onCapture}
            className="hidden"
          />
          <p className="mt-2 text-center text-xs text-[var(--color-text-secondary)]">
            Gallery uploads aren&apos;t accepted — live photo helps verify the
            report.
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {selectedType ? (
              <span className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1 text-xs font-bold text-[var(--color-text-secondary)]">
                {selectedType.label}
              </span>
            ) : null}
            <span className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1 text-xs font-bold text-[var(--color-text-secondary)]">
              Severity {severity}/5
            </span>
            <span className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1 text-xs font-bold text-[var(--color-text-secondary)]">
              {location.status === "granted" ? "Location detected" : "Manual location"}
            </span>
          </div>

          <button
            type="button"
            disabled={!photo || submitting}
            onClick={submit}
            className="mt-8 flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[var(--color-brand)] text-base font-bold text-[var(--color-bg)] transition-colors duration-150 hover:bg-[var(--color-brand-dark)] disabled:cursor-not-allowed disabled:bg-[var(--color-brand-light)] disabled:text-[var(--color-brand-dark)]"
          >
            {submitting ? <SpinnerIcon size={20} /> : null}
            {submitting ? "Sending..." : "Send report"}
          </button>
          <p className="mt-3 text-center text-xs text-[var(--color-text-secondary)]">
            Your report is sent immediately and matched to the nearest
            available responder.
          </p>

          <button
            type="button"
            onClick={() => setStep(2)}
            className="mt-3 h-11 w-full rounded-lg border border-[var(--color-text-primary)] text-sm font-bold text-[var(--color-text-primary)] transition-colors duration-150 hover:bg-[var(--color-surface)]"
          >
            Back
          </button>
        </div>
      ) : null}
    </div>
  );
}