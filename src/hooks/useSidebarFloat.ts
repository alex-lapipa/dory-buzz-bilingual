import { useState, useCallback, useRef } from 'react';

const STORAGE_KEY = 'mochi_admin_sidebar_pinned';

export const useSidebarFloat = () => {
  const [pinned, setPinned] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  });
  const [hovered, setHovered] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  const expanded = pinned || hovered;

  const togglePin = useCallback(() => {
    setPinned((prev) => {
      const next = !prev;
      try { localStorage.setItem(STORAGE_KEY, String(next)); } catch {}
      return next;
    });
  }, []);

  const onMouseEnter = useCallback(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setHovered(true);
  }, []);

  const onMouseLeave = useCallback(() => {
    debounceRef.current = setTimeout(() => setHovered(false), 200);
  }, []);

  const toggleMobile = useCallback(() => setMobileOpen((p) => !p), []);
  const closeMobile = useCallback(() => setMobileOpen(false), []);

  return {
    pinned,
    expanded,
    togglePin,
    onMouseEnter,
    onMouseLeave,
    mobileOpen,
    toggleMobile,
    closeMobile,
  };
};
