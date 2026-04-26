/**
 * useActiveRoute — small utility hook for "you are here" navigation feedback.
 *
 * Returns helpers that components can use to:
 *   - Get the current pathname
 *   - Test whether a path is currently active (with optional exact match)
 *   - Generate the right aria-current value for a nav link
 *
 * Pure read-only over react-router's useLocation. No side effects.
 *
 * Usage:
 *   const { isActive, ariaCurrent } = useActiveRoute();
 *   <Button aria-current={ariaCurrent('/buzzy-bees')}
 *           className={isActive('/buzzy-bees') ? 'nav-item-active' : ''}>
 */
import { useLocation } from 'react-router-dom';

export interface UseActiveRouteResult {
  pathname: string;
  isActive: (path: string, opts?: { exact?: boolean }) => boolean;
  ariaCurrent: (path: string, opts?: { exact?: boolean }) => 'page' | undefined;
}

export function useActiveRoute(): UseActiveRouteResult {
  const { pathname } = useLocation();

  const isActive = (path: string, opts: { exact?: boolean } = {}): boolean => {
    if (opts.exact) return pathname === path;
    if (path === '/') return pathname === '/';
    return pathname === path || pathname.startsWith(path + '/');
  };

  const ariaCurrent = (path: string, opts: { exact?: boolean } = {}): 'page' | undefined =>
    isActive(path, opts) ? 'page' : undefined;

  return { pathname, isActive, ariaCurrent };
}
