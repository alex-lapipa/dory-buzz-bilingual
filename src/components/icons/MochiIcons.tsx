import React from "react";

/**
 * MochiIcons · v1.0
 * ─────────────────────────────────────────────────────────
 * 12 custom hand-drawn icons in a unified style:
 *   - 24×24 viewBox
 *   - stroke-width: 1.5
 *   - stroke-linecap: round
 *   - stroke-linejoin: round
 *   - color via `currentColor` (set with CSS or className)
 *
 * ADDITIVE: this file lives alongside BeeIcons.tsx. Existing
 * imports of the old icons keep working untouched.
 *
 * Usage:
 *   import { IcHive, IcMochi } from "@/components/icons/MochiIcons";
 *   <IcHive className="h-6 w-6 text-amber-700" />
 */

type IconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
};

const base = (props: IconProps): React.SVGProps<SVGSVGElement> => ({
  width: props.size ?? 24,
  height: props.size ?? 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": "true",
  focusable: "false",
  ...props,
});

export const IcHive: React.FC<IconProps> = (props) => (
  <svg {...base(props)}>
    <path d="M5 8h14M4 12h16M5 16h14M3 20h18" />
    <path d="M6 8c.5-2.5 2-5 6-5s5.5 2.5 6 5" />
    <path d="M3 20V8a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v12" />
    <circle cx="9" cy="14" r=".6" fill="currentColor" stroke="none" />
    <circle cx="15" cy="10" r=".6" fill="currentColor" stroke="none" />
  </svg>
);

export const IcMochi: React.FC<IconProps> = (props) => (
  <svg {...base(props)}>
    <ellipse cx="12" cy="14" rx="6" ry="5.5" />
    <path d="M7 12h10M7 16h10" />
    <ellipse cx="6" cy="9" rx="3" ry="2" />
    <ellipse cx="18" cy="9" rx="3" ry="2" />
    <circle cx="10.5" cy="13.5" r=".75" fill="currentColor" stroke="none" />
    <circle cx="13.5" cy="13.5" r=".75" fill="currentColor" stroke="none" />
    <path d="M10 4l2 1.5L14 4" />
  </svg>
);

export const IcFlower: React.FC<IconProps> = (props) => (
  <svg {...base(props)}>
    <circle cx="12" cy="12" r="2.5" />
    <path d="M12 4c2 1.5 2 4 0 5.5C10 8 10 5.5 12 4Z" />
    <path d="M20 12c-1.5 2-4 2-5.5 0C16 10 18.5 10 20 12Z" />
    <path d="M12 20c-2-1.5-2-4 0-5.5C14 16 14 18.5 12 20Z" />
    <path d="M4 12c1.5-2 4-2 5.5 0C8 14 5.5 14 4 12Z" />
    <path d="M12 12v8" />
  </svg>
);

export const IcHoneyJar: React.FC<IconProps> = (props) => (
  <svg {...base(props)}>
    <path d="M7 7h10M7 7v-2a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v2" />
    <path d="M6 7h12l-1 12a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L6 7Z" />
    <path d="M14 11l-3.5 4 2 .5L11 18" />
  </svg>
);

export const IcLeaf: React.FC<IconProps> = (props) => (
  <svg {...base(props)}>
    <path d="M5 19c0-9 6-14 15-14-1 9-6 14-15 14Z" />
    <path d="M5 19c4-4 8-8 13-13" />
  </svg>
);

export const IcSeed: React.FC<IconProps> = (props) => (
  <svg {...base(props)}>
    <ellipse cx="12" cy="14" rx="4" ry="6" />
    <path d="M12 8c0-2 1-4 3-4-.5 2.5-1.5 4-3 4Z" fill="currentColor" opacity=".15" stroke="none" />
    <path d="M12 14v4" />
  </svg>
);

export const IcTomato: React.FC<IconProps> = (props) => (
  <svg {...base(props)}>
    <circle cx="12" cy="14" r="6.5" />
    <path d="M8 8c.5-1 1-2 2-2.5M16 8c-.5-1-1-2-2-2.5M12 7v1" />
    <path d="M9 6.5c.5-1.5 2-2.5 3-2.5s2.5 1 3 2.5c-1 1-2 1.5-3 1.5s-2-.5-3-1.5Z" />
  </svg>
);

export const IcNotebook: React.FC<IconProps> = (props) => (
  <svg {...base(props)}>
    <rect x="5" y="3" width="14" height="18" rx="1.5" />
    <path d="M5 7h14M9 11h7M9 15h5" />
    <path d="M5 3v18" strokeWidth={2} />
  </svg>
);

export const IcMic: React.FC<IconProps> = (props) => (
  <svg {...base(props)}>
    <rect x="9" y="3" width="6" height="12" rx="3" />
    <path d="M5 11a7 7 0 0 0 14 0" />
    <path d="M12 18v3" />
  </svg>
);

export const IcVoice: React.FC<IconProps> = (props) => (
  <svg {...base(props)}>
    <path d="M5 9h3l5-4v14l-5-4H5Z" />
    <path d="M16 9c1.5 1 1.5 5 0 6" />
    <path d="M19 6c3 2 3 10 0 12" />
  </svg>
);

export const IcSun: React.FC<IconProps> = (props) => (
  <svg {...base(props)}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4l1.4-1.4M17 7l1.4-1.4" />
  </svg>
);

export const IcCare: React.FC<IconProps> = (props) => (
  <svg {...base(props)}>
    <path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10Z" />
    <path d="M12 12c-1-1-1-3 0-4 1 1 1 3 0 4Z" fill="currentColor" opacity=".15" stroke="none" />
  </svg>
);

/* Brand mark — used in headers, separate style from the icon set */
export const MochiBrandMark: React.FC<IconProps> = (props) => (
  <svg
    width={props.size ?? 40}
    height={props.size ?? 40}
    viewBox="0 0 40 40"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.6}
    strokeLinecap="round"
    aria-hidden="true"
    focusable="false"
    {...props}
  >
    <ellipse cx="20" cy="22" rx="12" ry="11" fill="hsl(40 92% 56%)" stroke="hsl(30 25% 12%)" />
    <path d="M9 18 Q20 16 31 18" stroke="hsl(30 25% 12%)" strokeWidth={2.4} fill="none" />
    <path d="M9 26 Q20 28 31 26" stroke="hsl(30 25% 12%)" strokeWidth={2.4} fill="none" />
    <ellipse cx="11" cy="13" rx="5" ry="3" fill="hsl(45 92% 92%)" stroke="hsl(30 25% 12%)" opacity=".85" />
    <ellipse cx="29" cy="13" rx="5" ry="3" fill="hsl(45 92% 92%)" stroke="hsl(30 25% 12%)" opacity=".85" />
    <circle cx="16" cy="22" r="1.6" fill="hsl(30 25% 12%)" stroke="none" />
    <circle cx="24" cy="22" r="1.6" fill="hsl(30 25% 12%)" stroke="none" />
  </svg>
);

/* Convenience: ordered list for icon galleries */
export const MOCHI_ICONS = [
  { Icon: IcHive,     name: "Hive",       id: "ic-hive" },
  { Icon: IcMochi,    name: "Mochi",      id: "ic-bee" },
  { Icon: IcFlower,   name: "Bloom",      id: "ic-flower" },
  { Icon: IcHoneyJar, name: "Honey",      id: "ic-honey-jar" },
  { Icon: IcLeaf,     name: "Leaf",       id: "ic-leaf" },
  { Icon: IcSeed,     name: "Seed",       id: "ic-seed" },
  { Icon: IcTomato,   name: "Tomato",     id: "ic-tomato" },
  { Icon: IcNotebook, name: "Notebook",   id: "ic-notebook" },
  { Icon: IcMic,      name: "Microphone", id: "ic-mic" },
  { Icon: IcVoice,    name: "Voice",      id: "ic-voice" },
  { Icon: IcSun,      name: "Sun",        id: "ic-sun" },
  { Icon: IcCare,     name: "Care",       id: "ic-heart-petal" },
] as const;
