/**
 * DiscoverPopover — desktop nav popover that surfaces all secondary routes
 * grouped by audience (For Kids, Learn More, About).
 *
 * Rendered inside AppHeader alongside the existing primary buttons.
 * Bilingual via useLanguage. Uses existing shadcn/ui Popover primitive
 * + the new design-system-2026 utilities (.surface-glass, .badge-new-2026).
 *
 * A11y:
 *   - Trigger has aria-haspopup, aria-expanded
 *   - Each item gets aria-current=page when matching the current route
 *   - Keyboard navigable (inherited from Radix Popover)
 *   - Items are real <Link> elements so right-click "open in new tab" works
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useLanguage } from '@/contexts/LanguageContext';
import { useActiveRoute } from '@/hooks/useActiveRoute';
import { DISCOVER_SECTIONS } from './navConfig';

export const DiscoverPopover: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { language } = useLanguage();
  const { isActive, ariaCurrent } = useActiveRoute();
  const [open, setOpen] = React.useState(false);

  const isEs = language === 'es';

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          aria-haspopup="menu"
          aria-expanded={open}
          className={`text-sm hover:text-primary flex items-center gap-1.5 ${className}`}
        >
          <Sparkles className="h-3.5 w-3.5" />
          {isEs ? 'Descubrir' : 'Discover'}
          <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-[min(92vw,420px)] p-4 surface-glass has-grain border-primary/20"
      >
        <div className="space-y-4">
          {DISCOVER_SECTIONS.map((section) => (
            <div key={section.titleEn}>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-readable-muted mb-2 px-2">
                {isEs ? section.titleEs : section.titleEn}
              </h3>
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const active = isActive(item.path, { exact: item.path === '/' });
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setOpen(false)}
                      aria-current={ariaCurrent(item.path, { exact: item.path === '/' })}
                      className={`
                        flex items-start gap-3 px-2 py-2 rounded-2026-sm
                        hover:bg-primary/5 transition-colors duration-200
                        ${active ? 'bg-primary/10' : ''}
                      `.replace(/\s+/g, ' ').trim()}
                    >
                      {item.emoji && (
                        <span aria-hidden="true" className="text-lg leading-none mt-0.5 shrink-0">
                          {item.emoji}
                        </span>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-sm ${active ? 'font-semibold text-primary-strong' : 'font-medium text-readable'}`}>
                            {isEs ? item.labelEs : item.labelEn}
                          </span>
                          {item.badgeEn && (
                            <span className="badge-new-2026">
                              {isEs ? (item.badgeEs ?? item.badgeEn) : item.badgeEn}
                            </span>
                          )}
                        </div>
                        {item.descriptionEn && (
                          <p className="text-xs text-readable-muted leading-snug mt-0.5">
                            {isEs ? (item.descriptionEs ?? item.descriptionEn) : item.descriptionEn}
                          </p>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default DiscoverPopover;
