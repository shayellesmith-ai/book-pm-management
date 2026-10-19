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
    accent: '#A855F7',
    accentBright: '#C084FC',
    accentRGB: '168,85,247',
    accentBrightRGB: '192,132,252',
    surfaceRaised: '#1C1B27',
    accent2: null,
    accent2RGB: null,
    bgSoft: '#0A0A0F',
    bgBorder: '#2A2A3A',
  },
  yorku: {
    name: 'York U Fitness',
    accent: '#E11837',
    accentBright: '#FF3B54',
    accentRGB: '225,24,55',
    accentBrightRGB: '255,59,84',
    surfaceRaised: '#1C1B27',
    accent2: '#0DC9AD',
    accent2RGB: '13,201,173',
    bgSoft: '#F2F2F2',
    bgBorder: '#E1DEDB',
  },
};

const key =
  import.meta.env.VITE_BRAND === 'yorku' || import.meta.env.MODE === 'yorku'
    ? 'yorku'
    : 'pulse';

export const brand = BRANDS[key];
export default brand;
