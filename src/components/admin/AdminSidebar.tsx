import React from 'react';
import {
  Settings, Activity, BarChart3, BookOpen, Flower2, TreeDeciduous, MessageCircle,
  Palette, Layers, Globe, ExternalLink, Wrench, HeartPulse, Shield, Lock,
  Accessibility, Cog, Download, Pin, PinOff, ChevronDown, Music, Moon, Zap
} from '@/components/icons/lucide-compat';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

export type AdminSection =
  | 'control' | 'production' | 'analytics'
  | 'beeducation' | 'bee-basics' | 'garden-basics' | 'chat'
  | 'brand' | 'design' | 'audio-sound'
  | 'google-ecosystem'
  | 'technical' | 'system-health' | 'edge-functions'
  | 'privacy' | 'accessibility'
  | 'settings' | 'lunar-calendar';

interface NavItem {
  id: AdminSection;
  label: string;
  icon: React.ElementType;
  external?: string;
}

interface NavGroup {
  label: string;
  items: NavItem[];
  defaultOpen?: boolean;
}

const NAV_GROUPS: NavGroup[] = [
  {
    label: 'Dashboard',
    defaultOpen: true,
    items: [
      { id: 'control', label: 'Control Panel', icon: Settings },
      { id: 'production', label: 'Production', icon: Activity },
      { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    ],
  },
  {
    label: 'Content & Learning',
    items: [
      { id: 'beeducation', label: 'Beeducation', icon: BookOpen },
      { id: 'bee-basics', label: 'Bee Basics', icon: Flower2 },
      { id: 'garden-basics', label: 'Garden Basics', icon: TreeDeciduous },
      { id: 'chat', label: 'Chat', icon: MessageCircle },
      { id: 'lunar-calendar', label: 'Lunar Calendar', icon: Moon },
    ],
  },
  {
    label: 'Brand & Design',
    items: [
      { id: 'brand', label: 'Brand Book', icon: Palette },
      { id: 'design', label: 'Design System', icon: Layers },
      { id: 'audio-sound', label: 'Audio & Sound', icon: Music },
    ],
  },
  {
    label: 'Google Ecosystem',
    items: [
      { id: 'google-ecosystem', label: 'Google Services', icon: Globe },
    ],
  },
  {
    label: 'Technical',
    items: [
      { id: 'technical', label: 'Technical Details', icon: Wrench },
      { id: 'system-health', label: 'System Health', icon: HeartPulse },
      { id: 'edge-functions', label: 'Edge Functions', icon: Zap },
    ],
  },
  {
    label: 'Privacy & Security',
    items: [
      { id: 'privacy', label: 'GDPR Consent', icon: Shield },
      { id: 'accessibility', label: 'Accessibility', icon: Accessibility },
    ],
  },
  {
    label: 'Configuration',
    items: [
      { id: 'settings', label: 'Settings', icon: Cog },
    ],
  },
];

const ECOSYSTEM_LINKS = [
  { label: 'idiomas.io', url: 'https://idiomas.io' },
  { label: 'lawtonx.com', url: 'https://lawtonx.com' },
  { label: 'MiraMonte', url: 'https://miramonte.app' },
  { label: 'alexlawton.io', url: 'https://alexlawton.io' },
];

interface AdminSidebarProps {
  activeSection: AdminSection;
  onSectionChange: (section: AdminSection) => void;
  expanded: boolean;
  pinned: boolean;
  togglePin: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  isMobile?: boolean;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeSection,
  onSectionChange,
  expanded,
  pinned,
  togglePin,
  onMouseEnter,
  onMouseLeave,
  isMobile = false,
}) => {
  return (
    <nav
      onMouseEnter={isMobile ? undefined : onMouseEnter}
      onMouseLeave={isMobile ? undefined : onMouseLeave}
      className={cn(
        'flex flex-col h-full bg-card/95 backdrop-blur-md border-r border-border overflow-y-auto overflow-x-hidden',
        isMobile ? 'w-full' : 'transition-[width] duration-300 ease-in-out',
        !isMobile && (expanded ? 'w-64' : 'w-16'),
      )}
    >
      {/* Logo header */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-border min-h-[64px]">
        <span className="text-2xl flex-shrink-0">🐝</span>
        <span
          className={cn(
            'font-bold text-primary whitespace-nowrap transition-opacity duration-200',
            expanded ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden',
          )}
        >
          Admin
        </span>
      </div>

      {/* Nav groups */}
      <div className="flex-1 py-2 space-y-1">
        {NAV_GROUPS.map((group) => (
          <SidebarGroup
            key={group.label}
            group={group}
            expanded={expanded}
            activeSection={activeSection}
            onSectionChange={onSectionChange}
          />
        ))}

        {/* Ecosystem links */}
        {expanded && (
          <div className="px-3 pt-3">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground px-2 mb-1">
              Ecosystem
            </p>
            {ECOSYSTEM_LINKS.map((link) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-2 py-1.5 rounded-md text-xs text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
              >
                <ExternalLink className="h-3 w-3 flex-shrink-0" />
                {link.label}
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Pin button (desktop only) */}
      {!isMobile && (
        <button
          onClick={togglePin}
          className="flex items-center justify-center gap-2 px-4 py-3 border-t border-border text-xs text-muted-foreground hover:text-foreground transition-colors"
          title={pinned ? 'Unpin sidebar' : 'Pin sidebar'}
        >
          {pinned ? <PinOff className="h-4 w-4" /> : <Pin className="h-4 w-4" />}
          {expanded && <span>{pinned ? 'Unpin' : 'Pin'}</span>}
        </button>
      )}
    </nav>
  );
};

/* ── Collapsible nav group ── */
const SidebarGroup: React.FC<{
  group: NavGroup;
  expanded: boolean;
  activeSection: AdminSection;
  onSectionChange: (s: AdminSection) => void;
}> = ({ group, expanded, activeSection, onSectionChange }) => {
  const hasActive = group.items.some((i) => i.id === activeSection);

  return (
    <Collapsible defaultOpen={group.defaultOpen || hasActive}>
      {expanded ? (
        <CollapsibleTrigger className="flex items-center justify-between w-full px-4 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors">
          {group.label}
          <ChevronDown className="h-3 w-3 transition-transform [[data-state=open]>&]:rotate-180" />
        </CollapsibleTrigger>
      ) : (
        <div className="h-px bg-border mx-3 my-1" />
      )}

      <CollapsibleContent>
        <div className="space-y-0.5 px-2">
          {group.items.map((item) => (
            <SidebarItem
              key={item.id}
              item={item}
              active={activeSection === item.id}
              expanded={expanded}
              onClick={() => onSectionChange(item.id)}
            />
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

/* ── Single nav item ── */
const SidebarItem: React.FC<{
  item: NavItem;
  active: boolean;
  expanded: boolean;
  onClick: () => void;
}> = ({ item, active, expanded, onClick }) => {
  const Icon = item.icon;

  const button = (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center gap-3 w-full rounded-lg px-3 py-2 text-sm transition-colors',
        active
          ? 'bg-primary/15 text-primary font-medium'
          : 'text-muted-foreground hover:text-foreground hover:bg-accent/50',
      )}
    >
      <Icon className="h-4 w-4 flex-shrink-0" />
      {expanded && <span className="whitespace-nowrap">{item.label}</span>}
    </button>
  );

  if (!expanded) {
    return (
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>{button}</TooltipTrigger>
        <TooltipContent side="right" sideOffset={8}>
          {item.label}
        </TooltipContent>
      </Tooltip>
    );
  }

  return button;
};
