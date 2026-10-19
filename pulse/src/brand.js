/**
 * Brand configuration for the app.
 *
 * `pulse` is the DEFAULT and must stay the standard look for the book and the
 * deployed site (gorvis.github.io/book-pm-management/pulse/). `yorku` is an
 * opt-in classroom variant selected at build time with Vite mode `yorku`:
 *
 *   npm run dev:yorku      npm run build:yorku
 *
 * which loads `.env.yorku` (VITE_BRAND=yorku). A plain `npm run dev` / `build`
 * has no VITE_BRAND set and therefore renders Pulse, unchanged.
 *
 * Only branding differs between the two — colors and the product name. There
 * are no feature or data differences. The localStorage key is intentionally
 * shared (see useEntries.js) and is NOT branded.
 */

const BRANDS = {
  pulse: {
    name: 'Pulse',
    accent: '#E11837',
    accentBright: '#E11837',
    accentRGB: '225,24,55',
    accentBrightRGB: '225,24,55',
    surfaceRaised: '#FFFFFF',
    accent2: '#0DC9AD',
    accent2RGB: '13,201,173',
    bgSoft: '#F2F2F2',
    bgBorder: '#E1DEDB',
  },
  yorku: {
    name: 'York U Fitness',
    accent: '#E11837',        // York Red per course brand guide
    accentBright: '#E11837',
    accentRGB: '225,24,55',
    accentBrightRGB: '255,59,84',
    surfaceRaised: '#1C1B27',
    // York U Fitness secondary palette (only present on the yorku brand)
    accent2: '#0DC9AD',           // teal accent
    accent2RGB: '13,201,173',
    bgSoft: '#F2F2F2',            // light grey background
    bgBorder: '#E1DEDB',          // light grey border
  },
};

// The Vite mode is checked too, so `--mode yorku` selects York U Fitness even
// in environments that don't load .env files (some browser IDEs skip them).
const key =
  import.meta.env.VITE_BRAND === 'yorku' || import.meta.env.MODE === 'yorku'
    ? 'yorku'
    : 'pulse';

export const brand = BRANDS[key];
export default brand;
