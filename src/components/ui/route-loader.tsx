import React from 'react';

/**
 * Polished loading placeholder for lazy-loaded routes.
 * Uses .skeleton-2026 (defined in src/styles/design-system-2026.css)
 * which respects prefers-reduced-motion (animation disabled there).
 *
 * Drop-in replacement for the previous inline "Loading..." text fallback.
 */
interface RouteLoaderProps {
  /** Match the original "h-48" sizing by default; pass null for fluid */
  className?: string;
  /** Number of skeleton rows to render */
  rows?: number;
  /** Optional accessible label for screen readers */
  label?: string;
}

export const RouteLoader: React.FC<RouteLoaderProps> = ({
  className = 'h-48',
  rows = 3,
  label = 'Loading',
}) => {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label={label}
      className={`flex items-center justify-center ${className}`}
    >
      <div className="flex flex-col gap-3 w-full max-w-md px-6">
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            className="skeleton-2026 h-3"
            style={{ width: `${[88, 65, 76][i % 3]}%` }}
          />
        ))}
      </div>
      <span className="sr-only">{label}…</span>
    </div>
  );
};

export default RouteLoader;
