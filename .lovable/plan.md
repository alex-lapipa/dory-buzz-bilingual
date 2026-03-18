

## Remove "Learn" Tab from Navigation

Remove the 🌿 Learn navigation item from both desktop and mobile menus, leaving only **Beeducation** (all audiences) and **Buzzy Bees** (ages 3-6).

### Changes

**1. `src/components/AppHeader.tsx`** — Delete lines 63-70 (the Learn button in desktop nav)

**2. `src/components/HamburgerMenu.tsx`** — Delete lines 62-65 (the Learn button in mobile menu)

The `/learning` route remains accessible via direct URL for anyone who has it bookmarked — we're just removing it from visible navigation.

