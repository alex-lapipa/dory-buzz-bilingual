import React from 'react';

interface IconProps {
  size?: number;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

type IconCategory = 'bee' | 'flower' | 'leaf' | 'butterfly' | 'pollen';

const cn = (...classes: (string | undefined)[]) => classes.filter(Boolean).join(' ');

const defaults = (props: IconProps, category: IconCategory = 'flower') => ({
  width: props.size || 24,
  height: props.size || 24,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: props.color || 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  className: cn(`bee-icon-${category}`, props.className),
  style: props.style,
});

/* ───── NAVIGATION ───── */

/** 3 hexagons arranged as a honeycomb — replaces Menu/hamburger */
export const HoneycombMenu: React.FC<IconProps> = (props) => (
  <svg {...defaults(props, 'bee')}>
    <path d="M12 2l4 2.5v5L12 12 8 9.5v-5L12 2z" />
    <path d="M4 9.5l4 2.5v5L4 19.5 0 17v-5l4-2.5z" opacity=".7" />
    <path d="M20 9.5l4 2.5v5L20 19.5 16 17v-5l4-2.5z" opacity=".7" />
  </svg>
);

/** Bee flying away — replaces LogOut */
export const BeeFlying: React.FC<IconProps> = (props) => (
  <svg {...defaults(props, 'bee')}>
    <ellipse cx="10" cy="12" rx="4" ry="5" />
    <path d="M10 7c-2-3-5-4-5-4" />
    <path d="M10 7c2-3 5-4 5-4" />
    <line x1="6" y1="11" x2="14" y2="11" />
    <line x1="6" y1="13" x2="14" y2="13" />
    <path d="M14 12c1 0 3-.5 5-2" />
    <path d="M14 12c1 0 3 .5 5 2" />
    <circle cx="19" cy="10" r=".5" fill="currentColor" />
    <circle cx="19" cy="14" r=".5" fill="currentColor" />
  </svg>
);

/** Friendly bee face — replaces User */
export const BeeFace: React.FC<IconProps> = (props) => (
  <svg {...defaults(props, 'bee')}>
    <circle cx="12" cy="13" r="7" />
    <circle cx="9.5" cy="12" r="1" fill="currentColor" stroke="none" />
    <circle cx="14.5" cy="12" r="1" fill="currentColor" stroke="none" />
    <path d="M10 15.5c.8.8 3.2.8 4 0" />
    <path d="M9 6c-1.5-2.5-3-3-3-3" />
    <path d="M15 6c1.5-2.5 3-3 3-3" />
    <circle cx="6" cy="3" r="1" fill="currentColor" stroke="none" />
    <circle cx="18" cy="3" r="1" fill="currentColor" stroke="none" />
  </svg>
);

/** Butterfly taking flight — replaces ExternalLink */
export const ButterflyLink: React.FC<IconProps> = (props) => (
  <svg {...defaults(props, 'butterfly')}>
    <path d="M12 12c-3-5-8-5-8-1s5 4 8 1z" />
    <path d="M12 12c3-5 8-5 8-1s-5 4-8 1z" />
    <path d="M12 12c-2 3-5 7-2 7s3-4 2-7z" opacity=".7" />
    <path d="M12 12c2 3 5 7 2 7s-3-4-2-7z" opacity=".7" />
    <line x1="12" y1="6" x2="12" y2="19" />
  </svg>
);

/* ───── ACTIONS ───── */

/** Flower with heart center — replaces Heart */
export const FlowerHeart: React.FC<IconProps> = (props) => (
  <svg {...defaults(props)}>
    <circle cx="12" cy="8" r="3" opacity=".6" />
    <circle cx="8" cy="12" r="3" opacity=".6" />
    <circle cx="16" cy="12" r="3" opacity=".6" />
    <circle cx="12" cy="16" r="3" opacity=".6" />
    <path d="M12 10.5c-.5-.8-1.5-1-2-.5s-.3 1.5.5 2.2l1.5 1.3 1.5-1.3c.8-.7 1-1.7.5-2.2s-1.5-.3-2 .5z" fill="currentColor" stroke="none" />
  </svg>
);

/** Sunflower — replaces Star */
export const SunflowerStar: React.FC<IconProps> = (props) => (
  <svg {...defaults(props, 'flower')}>
    <circle cx="12" cy="12" r="3" fill="currentColor" stroke="none" opacity=".5" />
    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
      <ellipse
        key={angle}
        cx="12"
        cy="5"
        rx="2"
        ry="3.5"
        transform={`rotate(${angle} 12 12)`}
        opacity=".7"
      />
    ))}
  </svg>
);

/** Beehive — replaces Shield / Lock */
export const BeehiveSafe: React.FC<IconProps> = (props) => (
  <svg {...defaults(props, 'bee')}>
    <path d="M12 2C8 2 5 5 5 8v6c0 3 2 6 7 8 5-2 7-5 7-8V8c0-3-3-6-7-6z" />
    <path d="M8 10h8" />
    <path d="M9 13h6" />
    <circle cx="12" cy="16" r="1" fill="currentColor" stroke="none" />
  </svg>
);

/** Open leaf — replaces BookOpen */
export const LeafBook: React.FC<IconProps> = (props) => (
  <svg {...defaults(props, 'leaf')}>
    <path d="M12 20V8" />
    <path d="M12 8C9 4 4 3 2 4c0 4 2 10 10 12" />
    <path d="M12 8c3-4 8-5 10-4 0 4-2 10-10 12" />
    <path d="M5 9c2 1 4 3 5 5" opacity=".5" />
    <path d="M19 9c-2 1-4 3-5 5" opacity=".5" />
  </svg>
);

/** Speech bubble with tiny bee wing — replaces MessageCircle */
export const BeeChat: React.FC<IconProps> = (props) => (
  <svg {...defaults(props, 'bee')}>
    <path d="M21 12c0 4-4 7-9 7-1.5 0-3-.3-4.2-.8L3 20l1.5-3.5C3.5 15.2 3 13.7 3 12c0-4 4-7 9-7s9 3 9 7z" />
    <path d="M17 7c1-2 2.5-3 2.5-3" opacity=".5" />
    <path d="M18.5 5.5c.5-1.5 1.5-2 1.5-2" opacity=".5" />
  </svg>
);

/** Pollen sparkle — replaces Sparkles / Zap */
export const PollenSparkle: React.FC<IconProps> = (props) => (
  <svg {...defaults(props, 'pollen')}>
    <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" />
    <line x1="12" y1="2" x2="12" y2="7" />
    <line x1="12" y1="17" x2="12" y2="22" />
    <line x1="2" y1="12" x2="7" y2="12" />
    <line x1="17" y1="12" x2="22" y2="12" />
    <line x1="5" y1="5" x2="8.5" y2="8.5" />
    <line x1="15.5" y1="15.5" x2="19" y2="19" />
    <line x1="5" y1="19" x2="8.5" y2="15.5" />
    <line x1="15.5" y1="8.5" x2="19" y2="5" />
  </svg>
);

/** Growing seedling chart — replaces BarChart3 */
export const SeedlingChart: React.FC<IconProps> = (props) => (
  <svg {...defaults(props, 'leaf')}>
    <line x1="3" y1="21" x2="21" y2="21" />
    <path d="M7 21v-4" />
    <path d="M7 17c-1-2 0-4 0-4s1 2 0 4z" fill="currentColor" stroke="none" opacity=".4" />
    <path d="M12 21v-8" />
    <path d="M12 13c-2-3 0-5 0-5s2 2 0 5z" fill="currentColor" stroke="none" opacity=".5" />
    <path d="M17 21v-12" />
    <path d="M17 9c-2-4 0-7 0-7s2 3 0 7z" fill="currentColor" stroke="none" opacity=".6" />
    <path d="M14 11c2-1 4 0 4 0" opacity=".5" />
  </svg>
);

/** Musical flower — replaces Music */
export const MusicalFlower: React.FC<IconProps> = (props) => (
  <svg {...defaults(props, 'flower')}>
    <path d="M12 22v-12" />
    <circle cx="8" cy="20" r="3" opacity=".6" />
    <path d="M12 10c2-4 6-5 8-4" />
    <circle cx="20" cy="6" r="2" opacity=".5" />
    <circle cx="12" cy="7" r="2" opacity=".6" />
    <path d="M10 5c-.5-1.5-2-2-2-2" opacity=".5" />
    <path d="M14 5c.5-1.5 2-2 2-2" opacity=".5" />
  </svg>
);

/** Closed flower bud — replaces X / Close */
export const FlowerBudClose: React.FC<IconProps> = (props) => (
  <svg {...defaults(props, 'flower')}>
    <path d="M12 22v-8" />
    <path d="M12 14c-2-3-1-7 0-9 1 2 2 6 0 9z" />
    <path d="M12 10c-3-2-6-1-7 0 2 1 5 1 7 0z" opacity=".7" />
    <path d="M12 10c3-2 6-1 7 0-2 1-5 1-7 0z" opacity=".7" />
    <path d="M9 18c1 1 5 1 6 0" opacity=".5" />
  </svg>
);

/** Flower play button — replaces Play */
export const FlowerPlay: React.FC<IconProps> = (props) => (
  <svg {...defaults(props, 'flower')}>
    <circle cx="12" cy="12" r="9" />
    <path d="M10 8l6 4-6 4V8z" fill="currentColor" stroke="none" opacity=".7" />
  </svg>
);

/** Flower pause — replaces Pause */
export const FlowerPause: React.FC<IconProps> = (props) => (
  <svg {...defaults(props, 'flower')}>
    <circle cx="12" cy="12" r="9" />
    <line x1="10" y1="8" x2="10" y2="16" strokeWidth="2.5" />
    <line x1="14" y1="8" x2="14" y2="16" strokeWidth="2.5" />
  </svg>
);

/** Golden honeycomb trophy — replaces Trophy */
export const HoneycombTrophy: React.FC<IconProps> = (props) => (
  <svg {...defaults(props, 'bee')}>
    <path d="M8 2h8v8c0 3-2 5-4 5s-4-2-4-5V2z" />
    <path d="M8 4H5c0 3 1 5 3 5" />
    <path d="M16 4h3c0 3-1 5-3 5" />
    <line x1="12" y1="15" x2="12" y2="19" />
    <path d="M8 21h8" />
    <path d="M8 19h8" />
    <path d="M10 5h4" opacity=".4" />
    <path d="M10 8h4" opacity=".4" />
  </svg>
);

/** Bee antenna — replaces Mic */
export const BeeAntenna: React.FC<IconProps> = (props) => (
  <svg {...defaults(props, 'bee')}>
    <path d="M12 22v-8" />
    <circle cx="12" cy="12" r="3" />
    <path d="M9 9c-2-3-1-6 0-7" />
    <path d="M15 9c2-3 1-6 0-7" />
    <circle cx="9" cy="2" r="1.5" fill="currentColor" stroke="none" opacity=".6" />
    <circle cx="15" cy="2" r="1.5" fill="currentColor" stroke="none" opacity=".6" />
    <path d="M9 15v3" opacity=".5" />
    <path d="M15 15v3" opacity=".5" />
  </svg>
);

/** Spinning dandelion — replaces RefreshCw / Loader2 */
export const DandelionSpin: React.FC<IconProps> = (props) => (
  <svg {...defaults(props)}>
    <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" opacity=".5" />
    {[0, 60, 120, 180, 240, 300].map((angle) => (
      <line
        key={angle}
        x1="12"
        y1="12"
        x2="12"
        y2="4"
        transform={`rotate(${angle} 12 12)`}
        opacity=".6"
      />
    ))}
    {[0, 60, 120, 180, 240, 300].map((angle) => (
      <circle
        key={`dot-${angle}`}
        cx="12"
        cy="3"
        r="1"
        transform={`rotate(${angle} 12 12)`}
        opacity=".4"
      />
    ))}
  </svg>
);

/** Leaf envelope — replaces Mail */
export const LeafEnvelope: React.FC<IconProps> = (props) => (
  <svg {...defaults(props)}>
    <rect x="3" y="6" width="18" height="13" rx="2" />
    <path d="M3 6l9 7 9-7" />
    <path d="M18 6c1-2 0-4-2-3" opacity=".5" />
    <path d="M20 6c1-2 0-4-2-3" opacity=".4" />
  </svg>
);

/** Sundial flower — replaces Clock */
export const SundialFlower: React.FC<IconProps> = (props) => (
  <svg {...defaults(props)}>
    <circle cx="12" cy="12" r="8" />
    <line x1="12" y1="12" x2="12" y2="7" />
    <line x1="12" y1="12" x2="16" y2="12" />
    <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
    {[0, 90, 180, 270].map((a) => (
      <circle key={a} cx="12" cy="3" r=".8" transform={`rotate(${a} 12 12)`} fill="currentColor" stroke="none" opacity=".4" />
    ))}
  </svg>
);

/** Ladybug info — replaces Info */
export const LadybugInfo: React.FC<IconProps> = (props) => (
  <svg {...defaults(props)}>
    <circle cx="12" cy="13" r="8" />
    <line x1="12" y1="3" x2="12" y2="21" />
    <circle cx="9" cy="10" r="1.2" fill="currentColor" stroke="none" opacity=".4" />
    <circle cx="15" cy="10" r="1.2" fill="currentColor" stroke="none" opacity=".4" />
    <circle cx="9" cy="16" r="1" fill="currentColor" stroke="none" opacity=".3" />
    <circle cx="15" cy="16" r="1" fill="currentColor" stroke="none" opacity=".3" />
    <path d="M10 5c-1-2 0-3 0-3" />
    <path d="M14 5c1-2 0-3 0-3" />
  </svg>
);

/** Earth with vine — replaces Globe */
export const EarthVine: React.FC<IconProps> = (props) => (
  <svg {...defaults(props)}>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18" opacity=".4" />
    <ellipse cx="12" cy="12" rx="4" ry="9" opacity=".4" />
    <path d="M17 6c2 2 3 5 1 7s-4 1-5 3" fill="none" opacity=".6" />
    <circle cx="18" cy="5" r="1" fill="currentColor" stroke="none" opacity=".5" />
  </svg>
);

/** Two leaves — replaces Copy */
export const TwoLeaves: React.FC<IconProps> = (props) => (
  <svg {...defaults(props)}>
    <path d="M8 16c-4-2-6-8-4-12 4 0 8 4 8 8" />
    <path d="M4 4c2 3 4 6 8 8" opacity=".5" />
    <path d="M16 16c4-2 6-8 4-12-4 0-8 4-8 8" />
    <path d="M20 4c-2 3-4 6-8 8" opacity=".5" />
    <path d="M12 12v10" />
  </svg>
);

/** Blooming checkmark — replaces CheckCircle */
export const BloomingCheck: React.FC<IconProps> = (props) => (
  <svg {...defaults(props)}>
    <circle cx="12" cy="12" r="9" />
    <path d="M8 12l3 3 5-6" />
    <path d="M12 3c0-1 .5-2 .5-2" opacity=".4" />
    <path d="M17 5c1-.5 1.5-1.5 1.5-1.5" opacity=".4" />
    <path d="M7 5c-1-.5-1.5-1.5-1.5-1.5" opacity=".4" />
  </svg>
);

/** Wilting flower — replaces AlertCircle (gentle warning) */
export const WiltingFlower: React.FC<IconProps> = (props) => (
  <svg {...defaults(props)}>
    <path d="M12 22v-8" />
    <path d="M12 14c-1-2-3-4-5-3 0 2 2 4 5 3z" />
    <path d="M12 14c1-2 3-4 5-3 0 2-2 4-5 3z" />
    <path d="M12 10c-1-2 0-5 0-5s1 3 0 5z" />
    <path d="M10 8c-2-1-4 0-4 0s2 2 4 0z" opacity=".6" />
    <path d="M14 8c2-1 4 0 4 0s-2 2-4 0z" opacity=".6" />
    <path d="M8 18c2 2 6 2 8 0" opacity=".4" />
  </svg>
);

/** Sprouting seed — replaces Plus */
export const SproutingSeed: React.FC<IconProps> = (props) => (
  <svg {...defaults(props)}>
    <ellipse cx="12" cy="18" rx="4" ry="3" />
    <path d="M12 15V9" />
    <path d="M12 12c-3-1-5 0-5 2" opacity=".6" />
    <path d="M12 9c2-2 5-1 5 1" opacity=".6" />
  </svg>
);

/** Garden trowel — replaces Settings / Gear */
export const GardenTools: React.FC<IconProps> = (props) => (
  <svg {...defaults(props)}>
    <path d="M14 4c2-2 6-2 7 0s-1 5-3 7l-8 8-4-4 8-8c.5-.5 0-2.5 0-3z" />
    <path d="M10 19l-4-4" />
    <circle cx="6" cy="21" r="1.5" />
  </svg>
);

/** Butterfly search — replaces Search */
export const ButterflySearch: React.FC<IconProps> = (props) => (
  <svg {...defaults(props)}>
    <circle cx="11" cy="11" r="7" />
    <line x1="16" y1="16" x2="21" y2="21" />
    <path d="M9 8c-1.5-2-.5-4 1-4s2 2 1 4" opacity=".5" fill="currentColor" stroke="none" />
    <path d="M13 8c1.5-2 .5-4-1-4s-2 2-1 4" opacity=".5" fill="currentColor" stroke="none" />
  </svg>
);

/** Open flower — replaces Eye */
export const FlowerEye: React.FC<IconProps> = (props) => (
  <svg {...defaults(props)}>
    <path d="M12 5c-7 0-10 7-10 7s3 7 10 7 10-7 10-7-3-7-10-7z" />
    <circle cx="12" cy="12" r="3" />
    <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
  </svg>
);

/** Firefly — replaces Brain / Lightbulb */
export const Firefly: React.FC<IconProps> = (props) => (
  <svg {...defaults(props)}>
    <ellipse cx="12" cy="14" rx="4" ry="5" />
    <path d="M12 9c0-2 1-4 1-4" />
    <path d="M12 9c0-2-1-4-1-4" />
    <circle cx="11" cy="5" r="1" fill="currentColor" stroke="none" opacity=".5" />
    <circle cx="13" cy="5" r="1" fill="currentColor" stroke="none" opacity=".5" />
    <circle cx="12" cy="12" r="2.5" fill="currentColor" stroke="none" opacity=".3" />
    <line x1="8" y1="12" x2="5" y2="10" opacity=".4" />
    <line x1="16" y1="12" x2="19" y2="10" opacity=".4" />
    <line x1="8" y1="15" x2="5" y2="17" opacity=".4" />
    <line x1="16" y1="15" x2="19" y2="17" opacity=".4" />
  </svg>
);

/** Butterfly frame — replaces Camera / Image */
export const ButterflyFrame: React.FC<IconProps> = (props) => (
  <svg {...defaults(props)}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="M12 12c-2-3-5-3-5 0s3 3 5 0z" opacity=".6" />
    <path d="M12 12c2-3 5-3 5 0s-3 3-5 0z" opacity=".6" />
    <line x1="12" y1="9" x2="12" y2="16" opacity=".4" />
  </svg>
);

/** Bee carrying pollen up — replaces Upload */
export const BeeUpload: React.FC<IconProps> = (props) => (
  <svg {...defaults(props)}>
    <path d="M12 18V6" />
    <path d="M8 10l4-4 4 4" />
    <circle cx="12" cy="4" r="2" fill="currentColor" stroke="none" opacity=".4" />
    <line x1="3" y1="21" x2="21" y2="21" />
  </svg>
);

/** Bee carrying pollen down — replaces Download */
export const BeeDownload: React.FC<IconProps> = (props) => (
  <svg {...defaults(props)}>
    <path d="M12 4v12" />
    <path d="M8 12l4 4 4-4" />
    <circle cx="12" cy="18" r="2" fill="currentColor" stroke="none" opacity=".4" />
    <line x1="3" y1="21" x2="21" y2="21" />
  </svg>
);

/** Shrink — replaces Shrink (keep same shape but nature-styled) */
export const GardenShrink: React.FC<IconProps> = (props) => (
  <svg {...defaults(props)}>
    <path d="M4 14h6v6" />
    <path d="M20 10h-6V4" />
    <line x1="4" y1="20" x2="10" y2="14" />
    <line x1="14" y1="10" x2="20" y2="4" />
  </svg>
);

/** Expand — replaces Expand (keep same shape but nature-styled) */
export const GardenExpand: React.FC<IconProps> = (props) => (
  <svg {...defaults(props)}>
    <path d="M14 4h6v6" />
    <path d="M10 20H4v-6" />
    <line x1="20" y1="4" x2="14" y2="10" />
    <line x1="4" y1="20" x2="10" y2="14" />
  </svg>
);

/** Graduation bee — replaces GraduationCap */
export const GraduationBee: React.FC<IconProps> = (props) => (
  <svg {...defaults(props)}>
    <path d="M2 10l10-5 10 5-10 5z" />
    <path d="M6 12v5c0 2 3 4 6 4s6-2 6-4v-5" />
    <line x1="22" y1="10" x2="22" y2="17" />
    <circle cx="22" cy="18" r="1" fill="currentColor" stroke="none" opacity=".4" />
  </svg>
);

/** Leaf / nature — keeps Leaf concept */
export const NatureLeaf: React.FC<IconProps> = (props) => (
  <svg {...defaults(props)}>
    <path d="M12 22c-4-4-8-10-4-16 6 0 12 4 12 8s-4 8-8 8z" />
    <path d="M8 6c2 4 4 8 4 16" opacity=".5" />
  </svg>
);

/** Gamepad flower — replaces Gamepad2 */
export const GamepadFlower: React.FC<IconProps> = (props) => (
  <svg {...defaults(props)}>
    <rect x="2" y="8" width="20" height="10" rx="4" />
    <line x1="8" y1="11" x2="8" y2="15" />
    <line x1="6" y1="13" x2="10" y2="13" />
    <circle cx="16" cy="11" r="1" fill="currentColor" stroke="none" />
    <circle cx="18" cy="13" r="1" fill="currentColor" stroke="none" />
    <path d="M10 8c0-2 1-4 2-4s2 2 2 4" opacity=".5" />
    <circle cx="12" cy="3.5" r="1" fill="currentColor" stroke="none" opacity=".4" />
  </svg>
);

/** Volume flower — replaces Volume2 */
export const VolumeFlower: React.FC<IconProps> = (props) => (
  <svg {...defaults(props)}>
    <path d="M11 5L6 9H2v6h4l5 4V5z" />
    <path d="M15.5 8.5c1 1.5 1 5.5 0 7" opacity=".6" />
    <path d="M18 6c2 3 2 9 0 12" opacity=".4" />
  </svg>
);

/** Lock (nature-styled) — replaces Lock */
export const GardenLock: React.FC<IconProps> = (props) => (
  <svg {...defaults(props)}>
    <rect x="5" y="11" width="14" height="10" rx="2" />
    <path d="M8 11V7c0-2.2 1.8-4 4-4s4 1.8 4 4v4" />
    <circle cx="12" cy="16" r="1.5" fill="currentColor" stroke="none" opacity=".5" />
  </svg>
);

/** Wifi flower — replaces Wifi */
export const WifiFlower: React.FC<IconProps> = (props) => (
  <svg {...defaults(props)}>
    <path d="M2 8.5c3-3 7-5 10-5s7 2 10 5" opacity=".4" />
    <path d="M5 12c2-2 4-3.5 7-3.5s5 1.5 7 3.5" opacity=".6" />
    <path d="M8.5 15.5c1-1 2.2-1.5 3.5-1.5s2.5.5 3.5 1.5" opacity=".8" />
    <circle cx="12" cy="19" r="1" fill="currentColor" stroke="none" />
  </svg>
);

/** Database hive — replaces Database */
export const HiveDatabase: React.FC<IconProps> = (props) => (
  <svg {...defaults(props)}>
    <ellipse cx="12" cy="5" rx="8" ry="3" />
    <path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5" />
    <path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" />
  </svg>
);

/** Activity vine — replaces Activity */
export const ActivityVine: React.FC<IconProps> = (props) => (
  <svg {...defaults(props)}>
    <polyline points="22 12 18 12 15 18 9 6 6 12 2 12" />
  </svg>
);

/** Trending vine — replaces TrendingUp */
export const TrendingVine: React.FC<IconProps> = (props) => (
  <svg {...defaults(props)}>
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
    <polyline points="16 7 22 7 22 13" />
    <circle cx="13.5" cy="15.5" r="1" fill="currentColor" stroke="none" opacity=".4" />
  </svg>
);

/** Arrow right as bee trail */
export const BeeTrailRight: React.FC<IconProps> = (props) => (
  <svg {...defaults(props)}>
    <path d="M5 12c3-2 5 2 7 0s3-2 7 0" />
    <polyline points="17 8 21 12 17 16" />
  </svg>
);

/** Rotate back — replaces RotateCcw */
export const DandelionBack: React.FC<IconProps> = (props) => (
  <svg {...defaults(props)}>
    <path d="M3 12a9 9 0 1 0 3-7" />
    <polyline points="3 3 3 8 8 8" />
  </svg>
);

/** Video flower — replaces Video */
export const VideoFlower: React.FC<IconProps> = (props) => (
  <svg {...defaults(props)}>
    <rect x="2" y="6" width="14" height="12" rx="2" />
    <path d="M16 9l5-3v12l-5-3V9z" />
  </svg>
);

/** Code vine — replaces Code */
export const CodeVine: React.FC<IconProps> = (props) => (
  <svg {...defaults(props)}>
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </svg>
);

/** Share blossom — replaces Share2 */
export const ShareBlossom: React.FC<IconProps> = (props) => (
  <svg {...defaults(props)}>
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <line x1="8.6" y1="13.5" x2="15.4" y2="17.5" />
    <line x1="15.4" y1="6.5" x2="8.6" y2="10.5" />
  </svg>
);

/** Users / community — as bee colony */
export const BeeColony: React.FC<IconProps> = (props) => (
  <svg {...defaults(props)}>
    <circle cx="9" cy="7" r="3" />
    <circle cx="17" cy="7" r="3" />
    <path d="M5 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
    <path d="M7 4c-.5-1-1.5-2-1.5-2" opacity=".4" />
    <path d="M11 4c.5-1 1.5-2 1.5-2" opacity=".4" />
  </svg>
);

/** Instagram flower — replaces Instagram */
export const InstagramFlower: React.FC<IconProps> = (props) => (
  <svg {...defaults(props)}>
    <rect x="2" y="2" width="20" height="20" rx="5" />
    <circle cx="12" cy="12" r="5" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
);

/** Expand contract — replaces Shrink/Expand alternate */
export const FlowerShrink: React.FC<IconProps> = (props) => (
  <svg {...defaults(props)}>
    <path d="M4 14h6v6" />
    <path d="M20 10h-6V4" />
    <line x1="4" y1="20" x2="10" y2="14" />
    <line x1="14" y1="10" x2="20" y2="4" />
  </svg>
);

/** Key/credential — replaces Key */
export const GardenKey: React.FC<IconProps> = (props) => (
  <svg {...defaults(props)}>
    <circle cx="8" cy="8" r="5" />
    <path d="M12.5 11.5l8 8" />
    <path d="M17 16l3 3" />
    <path d="M15 18l3 3" />
    <circle cx="8" cy="8" r="2" fill="currentColor" stroke="none" opacity=".3" />
  </svg>
);

/** Cloud flower — replaces Cloud */
export const CloudFlower: React.FC<IconProps> = (props) => (
  <svg {...defaults(props)}>
    <path d="M18 10h-1a6 6 0 0 0-11.1-2A4.5 4.5 0 0 0 2 12.5 4.5 4.5 0 0 0 6.5 17h11a4 4 0 0 0 .5-8z" />
  </svg>
);

/** Bot bee — replaces Bot */
export const BotBee: React.FC<IconProps> = (props) => (
  <svg {...defaults(props)}>
    <rect x="5" y="8" width="14" height="11" rx="3" />
    <circle cx="9.5" cy="13" r="1.5" fill="currentColor" stroke="none" opacity=".5" />
    <circle cx="14.5" cy="13" r="1.5" fill="currentColor" stroke="none" opacity=".5" />
    <path d="M10 17c.8.5 3.2.5 4 0" />
    <path d="M12 8V5" />
    <path d="M9 5c-1-2 0-3 0-3" />
    <path d="M15 5c1-2 0-3 0-3" />
  </svg>
);

/** X mark (for errors/close in non-flower contexts) */
export const GardenX: React.FC<IconProps> = (props) => (
  <svg {...defaults(props)}>
    <line x1="6" y1="6" x2="18" y2="18" />
    <line x1="18" y1="6" x2="6" y2="18" />
  </svg>
);

/** Wifi Off — garden version */
export const WifiOffFlower: React.FC<IconProps> = (props) => (
  <svg {...defaults(props)}>
    <path d="M2 8.5c3-3 7-5 10-5s7 2 10 5" opacity=".2" />
    <path d="M5 12c2-2 4-3.5 7-3.5s5 1.5 7 3.5" opacity=".3" />
    <circle cx="12" cy="19" r="1" fill="currentColor" stroke="none" opacity=".4" />
    <line x1="2" y1="2" x2="22" y2="22" />
  </svg>
);

/** XCircle replacement */
export const WiltingCircle: React.FC<IconProps> = (props) => (
  <svg {...defaults(props)}>
    <circle cx="12" cy="12" r="9" />
    <line x1="9" y1="9" x2="15" y2="15" />
    <line x1="15" y1="9" x2="9" y2="15" />
  </svg>
);

/** AlertTriangle → gentle nature warning */
export const NatureWarning: React.FC<IconProps> = (props) => (
  <svg {...defaults(props)}>
    <path d="M12 2L2 20h20L12 2z" />
    <line x1="12" y1="9" x2="12" y2="14" />
    <circle cx="12" cy="17" r="1" fill="currentColor" stroke="none" />
  </svg>
);

/** MessageSquare replacement */
export const BeeChatSquare: React.FC<IconProps> = (props) => (
  <svg {...defaults(props)}>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10z" />
  </svg>
);

/** Calendar — nature calendar */
export const GardenCalendar: React.FC<IconProps> = (props) => (
  <svg {...defaults(props)}>
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
    <circle cx="12" cy="15" r="1.5" fill="currentColor" stroke="none" opacity=".4" />
  </svg>
);

/** VolumeX — muted flower */
export const VolumeMuted: React.FC<IconProps> = (props) => (
  <svg {...defaults(props)}>
    <path d="M11 5L6 9H2v6h4l5 4V5z" />
    <line x1="16" y1="9" x2="22" y2="15" opacity=".6" />
    <line x1="22" y1="9" x2="16" y2="15" opacity=".6" />
  </svg>
);
