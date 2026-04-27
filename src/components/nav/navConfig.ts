/**
 * Navigation configuration — single source of truth for all top-level routes.
 *
 * Used by:
 *   - AppHeader's "Discover" desktop popover
 *   - HamburgerMenu's mobile section list
 *   - Footer (where appropriate)
 *
 * Bilingual: each entry has `labelEn` and `labelEs` so consumers can pick
 * via useLanguage() at render time.
 *
 * Pure additive: no existing nav code is required to use this. Each consumer
 * imports just the slice it needs.
 */

export interface NavItem {
  path: string;
  labelEn: string;
  labelEs: string;
  emoji?: string;
  /** Optional badge text (e.g. "New", "Beta") */
  badgeEn?: string;
  badgeEs?: string;
  descriptionEn?: string;
  descriptionEs?: string;
}

export interface NavSection {
  titleEn: string;
  titleEs: string;
  items: NavItem[];
}

/**
 * Primary nav — always visible (desktop top buttons, mobile primary list).
 *
 * Round 14: Buzzy Bees was removed from here. The /buzzy-bees route still
 * exists (App.tsx still mounts it; backward-compat for bookmarks), but the
 * 4 sing-along songs that lived there have been merged into the unified
 * /kids-songs grid which lives under Discover ▾ → Songs.
 */
export const PRIMARY_NAV: NavItem[] = [
  {
    path: '/',
    labelEn: 'Beeducation',
    labelEs: 'Beeducación',
    emoji: '🐝',
  },
];

/**
 * Sections shown in the Discover popover (desktop) and the expanded mobile menu.
 * Grouped by audience for clarity.
 */
export const DISCOVER_SECTIONS: NavSection[] = [
  {
    titleEn: 'For Kids',
    titleEs: 'Para Niños',
    items: [
      {
        path: '/kids-songs',
        labelEn: 'Songs',
        labelEs: 'Canciones',
        emoji: '🎶',
        descriptionEn: '15 bilingual sing-along songs',
        descriptionEs: '15 canciones bilingües para cantar',
      },
      {
        path: '/kids-stories',
        labelEn: 'Stories',
        labelEs: 'Cuentos',
        emoji: '📖',
        descriptionEn: 'Illustrated bee adventures',
        descriptionEs: 'Aventuras ilustradas de abejas',
      },
      {
        path: '/kids-games',
        labelEn: 'Games',
        labelEs: 'Juegos',
        emoji: '🎮',
        descriptionEn: 'Interactive learning games',
        descriptionEs: 'Juegos interactivos de aprendizaje',
      },
    ],
  },
  {
    titleEn: 'Learn More',
    titleEs: 'Aprende Más',
    items: [
      {
        path: '/learning/bee-basics',
        labelEn: 'Bee Basics',
        labelEs: 'Básicos de Abejas',
        emoji: '🐝',
        descriptionEn: 'Start here — bee biology fundamentals',
        descriptionEs: 'Empieza aquí — biología básica',
      },
      {
        path: '/learning/garden-basics',
        labelEn: 'Garden Basics',
        labelEs: 'Básicos de Jardín',
        emoji: '🌻',
        descriptionEn: 'Plants, pollinators & permaculture',
        descriptionEs: 'Plantas, polinizadores y permacultura',
      },
      {
        path: '/chat',
        labelEn: 'Chat with Mochi',
        labelEs: 'Chatea con Mochi',
        emoji: '💬',
        descriptionEn: 'Ask questions in any language',
        descriptionEs: 'Pregunta en cualquier idioma',
      },
    ],
  },
  {
    titleEn: 'About',
    titleEs: 'Acerca de',
    items: [
      {
        path: '/status',
        labelEn: 'System Status',
        labelEs: 'Estado del Sistema',
        emoji: '🟢',
        descriptionEn: 'Live operational dashboard',
        descriptionEs: 'Panel operativo en vivo',
      },
      {
        path: '/sitemap',
        labelEn: 'Sitemap',
        labelEs: 'Mapa del sitio',
        emoji: '🗺️',
      },
    ],
  },
];

/**
 * Helper: get a flat list of all reachable routes (for sitemap generation,
 * link checking, or comprehensive navigation tests).
 */
export const allNavPaths = (): string[] => [
  ...PRIMARY_NAV.map((item) => item.path),
  ...DISCOVER_SECTIONS.flatMap((section) => section.items.map((item) => item.path)),
];
