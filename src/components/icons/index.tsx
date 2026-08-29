import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function Base({ size = 24, children, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {children}
    </svg>
  );
}

export function ShieldIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M12 3 20 6v6c0 4.2-3.2 7.7-8 9-4.8-1.3-8-4.8-8-9V6l8-3Z" />
      <path d="M12 9v6M9 12h6" />
    </Base>
  );
}

export function ReportIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M6 3h9l4 4v14H6z" />
      <path d="M15 3v4h4" />
      <path d="M12 10v4M12 17h.01" />
    </Base>
  );
}

export function ScoreIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M4 18a8 8 0 1 1 16 0" />
      <path d="M12 14l4-4" />
      <path d="M4 18h4M16 18h4" />
    </Base>
  );
}

export function MatchIcon(props: IconProps) {
  return (
    <Base {...props}>
      <circle cx="6" cy="12" r="2.5" />
      <circle cx="18" cy="6" r="2.5" />
      <circle cx="18" cy="18" r="2.5" />
      <path d="M8.4 10.9 15.6 7.1M8.4 13.1l7.2 3.8" />
    </Base>
  );
}

export function TransparencyIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M2 12s3.6-6 10-6 10 6 10 6-3.6 6-10 6-10-6-10-6Z" />
      <circle cx="12" cy="12" r="2.5" />
    </Base>
  );
}

export function GeoIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M12 21s6.5-5.6 6.5-10.2A6.5 6.5 0 0 0 5.5 10.8C5.5 15.4 12 21 12 21Z" />
      <circle cx="12" cy="10.5" r="2.4" />
    </Base>
  );
}

export function CommunityIcon(props: IconProps) {
  return (
    <Base {...props}>
      <circle cx="9" cy="8" r="3" />
      <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
      <path d="M16 6.2a3 3 0 0 1 0 5.6M18 20c0-2.1-.8-4-2.1-5.3" />
    </Base>
  );
}

export function MenuIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </Base>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M6 6l12 12M18 6 6 18" />
    </Base>
  );
}

export function FacebookIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M15 3h-2.5A3.5 3.5 0 0 0 9 6.5V9H7v3h2v9h3v-9h2.2l.8-3H12V6.8c0-.5.4-.8.9-.8H15V3Z" />
    </Base>
  );
}

export function XIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M4 4l16 16M20 4 4 20" />
    </Base>
  );
}

export function MailIcon(props: IconProps) {
  return (
    <Base {...props}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3.5 7 8.5 6 8.5-6" />
    </Base>
  );
}

export function FormulaIcon(props: IconProps) {
  return (
    <Base {...props}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18M3 15h18M9 3v18M15 3v18" />
      <path d="M7 13l2-2 2 3 4-5" />
    </Base>
  );
}

export function AutomationIcon(props: IconProps) {
  return (
    <Base {...props}>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </Base>
  );
}

export function DeployIcon(props: IconProps) {
  return (
    <Base {...props}>
      <rect x="4" y="4" width="16" height="6" rx="1" />
      <rect x="4" y="12" width="16" height="6" rx="1" />
      <circle cx="7" cy="7" r="1" />
      <circle cx="7" cy="15" r="1" />
      <path d="M10 7h7M10 15h7" />
    </Base>
  );
}

export function ResolveIcon(props: IconProps) {
  return (
    <Base {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="m8 12.5 2.5 2.5L16 9.5" />
    </Base>
  );
}

export function FireIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M12 3c1 3-4 5-4 9a4 4 0 0 0 8 0c0-2-1-3.5-2-4.5-.5 1-1 1.5-2 2 .5-2.5 1-4.5 0-6.5Z" />
      <path d="M9.5 21a6 6 0 0 1-2-.9M14.5 21a6 6 0 0 0 2-.9" />
    </Base>
  );
}

export function PoliceIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M12 2 20 5v6c0 4.6-3.4 8.4-8 10-4.6-1.6-8-5.4-8-10V5l8-3Z" />
      <path d="m12 8 1.2 2.4 2.6.4-1.9 1.9.4 2.6L12 14l-2.3 1.3.4-2.6-1.9-1.9 2.6-.4L12 8Z" />
    </Base>
  );
}

export function AmbulanceIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M3 7h11v9H3zM14 10h4l3 3v3h-7" />
      <circle cx="7" cy="18" r="1.75" />
      <circle cx="17.5" cy="18" r="1.75" />
      <path d="M8.5 9.5v4M6.5 11.5h4" />
    </Base>
  );
}

export function DashboardIcon(props: IconProps) {
  return (
    <Base {...props}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18M9 9v12" />
      <path d="M13 13h4M13 17h4M5.5 13.5h1M5.5 17h1" />
    </Base>
  );
}

export function PersonIcon(props: IconProps) {
  return (
    <Base {...props}>
      <circle cx="12" cy="8" r="4" />
      <path d="M5 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
    </Base>
  );
}

export function BuildingIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M3 21h18M5 21V10l7-4 7 4v11" />
      <path d="M12 11h.01M8 14h.01M12 14h.01M16 14h.01M8 17h.01M12 17h.01M16 17h.01" />
    </Base>
  );
}

export function ChevronDownIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="m6 9 6 6 6-6" />
    </Base>
  );
}

export function ChevronUpIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="m18 15-6-6-6 6" />
    </Base>
  );
}


export function CitizenIcon(props: IconProps) {
  return (
    <Base {...props}>
      <circle cx="12" cy="7" r="3.5" />
      <path d="M5.5 21v-1.5A6.5 6.5 0 0 1 12 13a6.5 6.5 0 0 1 6.5 6.5V21" />
      <path d="M3 21h18" />
    </Base>
  );
}

export function VolunteerIcon(props: IconProps) {
  return (
    <Base {...props}>
      <circle cx="8.5" cy="6.5" r="3" />
      <path d="M3 20v-1a5.5 5.5 0 0 1 5.5-5.5A5.5 5.5 0 0 1 14 19v1" />
      <path d="M18 6.2c1.2-1.2 3-.4 3 1.1 0 1.6-2 3-3 3.9-1-.9-3-2.3-3-3.9 0-1.5 1.8-2.3 3-1.1Z" />
    </Base>
  );
}

export function LockIcon(props: IconProps) {
  return (
    <Base {...props}>
      <rect x="4" y="10" width="16" height="10" rx="2" />
      <path d="M8 10V7.5a4 4 0 0 1 8 0V10M12 14v2" />
    </Base>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="m5 12.5 4.5 4.5L19 7" />
    </Base>
  );
}

export function FloodIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M3 16c1.5-1.5 3-1.5 4.5 0s3 1.5 4.5 0 3-1.5 4.5 0 3 1.5 4.5 0" />
      <path d="M3 20c1.5-1.5 3-1.5 4.5 0s3 1.5 4.5 0 3-1.5 4.5 0 3 1.5 4.5 0" />
      <path d="M12 3c1.8 2.5 3 4.6 3 6.3a3 3 0 1 1-6 0C9 7.6 10.2 5.5 12 3Z" />
    </Base>
  );
}

export function AccidentIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M4 16v-3l2-5h12l2 5v3" />
      <path d="M4 16h16M6 16v2M18 16v2" />
      <circle cx="7.5" cy="16" r="1.4" />
      <circle cx="16.5" cy="16" r="1.4" />
      <path d="M8 8h8" />
    </Base>
  );
}

export function MedicalIcon(props: IconProps) {
  return (
    <Base {...props}>
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M3 7V5.5A1.5 1.5 0 0 1 4.5 4h3A1.5 1.5 0 0 1 9 5.5V7M15 7V5.5A1.5 1.5 0 0 1 16.5 4h0" />
      <path d="M12 10.5v6M9 13.5h6" />
    </Base>
  );
}

export function CollapseIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M4 21V9l8-5 8 5v12" />
      <path d="M9 21v-6h2M13 21v-4h2M9 11h.01M14 11h.01" />
      <path d="m4 21 4-3M20 21l-4-3" />
    </Base>
  );
}

export function DrowningIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M3 15c1.5-1.5 3-1.5 4.5 0s3 1.5 4.5 0 3-1.5 4.5 0 3 1.5 4.5 0" />
      <path d="M3 19c1.5-1.5 3-1.5 4.5 0s3 1.5 4.5 0 3-1.5 4.5 0 3 1.5 4.5 0" />
      <circle cx="12" cy="7" r="2" />
      <path d="M12 9v4l-2 2" />
    </Base>
  );
}

export function StormIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M6.5 14a4 4 0 0 1 .5-8 5 5 0 0 1 9.5 1.5A3.5 3.5 0 0 1 16 14H6.5Z" />
      <path d="m13 16-2 3h3l-2 3" />
    </Base>
  );
}

export function OtherIcon(props: IconProps) {
  return (
    <Base {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 16h.01" />
      <path d="M9.5 9.5a2.5 2.5 0 0 1 4.9.7c0 1.7-2.4 1.9-2.4 3.3" />
    </Base>
  );
}

export function CameraIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M4 8h3l1.5-2h7L17 8h3v11H4Z" />
      <circle cx="12" cy="13.5" r="3.2" />
    </Base>
  );
}

export function NavigationIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="m12 3 8 17-8-4-8 4Z" />
    </Base>
  );
}

export function RetakeIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M3 12a9 9 0 0 1 15.4-6.4M21 12a9 9 0 0 1-15.4 6.4" />
      <path d="M18 3v4h-4M6 21v-4h4" />
    </Base>
  );
}

export function SpinnerIcon({ size = 20, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      aria-hidden="true"
      focusable="false"
      className="animate-spin"
      {...rest}
    >
      <circle cx="12" cy="12" r="9" opacity="0.25" />
      <path d="M21 12a9 9 0 0 0-9-9" />
    </svg>
  );
}