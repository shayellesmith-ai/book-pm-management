import { createTheme } from '@mui/material/styles';

/**
 * Groups-page-only theme.
 *
 * The rest of the app (Dashboard, History, Log, Summary, Nav) uses the default
 * theme in ./theme.js, which renders the Pulse brand. The groups feature is the
 * York U Fitness classroom variant, so it gets its own theme + token set here
 * and its own ThemeProvider in GroupsView. Nothing outside the groups feature
 * imports from this file, so the other pages are untouched.
 */

// York U Fitness palette — York Red primary, teal secondary, light neutrals.
const ACCENT = '#E11837';
const ACCENT_BRIGHT = '#FF3B54';
const ACCENT_RGB = '225,24,55';
const ACCENT_BRIGHT_RGB = '255,59,84';
const TEAL = '#0DC9AD';
const TEAL_RGB = '13,201,173';
const BG_SOFT = '#F2F2F2';
const BG_BORDER = '#E1DEDB';

const groupsTheme = createTheme({
  palette: {
    mode: 'light',
    background: {
      default: BG_SOFT,
      paper: '#FFFFFF',
    },
    primary: {
      main: ACCENT,
      light: ACCENT_BRIGHT,
    },
    text: {
      primary: '#20252B',
      secondary: '#5F6872',
    },
    divider: BG_BORDER,
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontFamily: '"Space Grotesk", sans-serif', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em' },
    h2: { fontFamily: '"Space Grotesk", sans-serif', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em' },
    h3: { fontFamily: '"Space Grotesk", sans-serif', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em' },
    h4: { fontFamily: '"Space Grotesk", sans-serif', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em' },
    h5: { fontFamily: '"Space Grotesk", sans-serif', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em' },
    h6: { fontFamily: '"Space Grotesk", sans-serif', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em' },
    subtitle1: { fontFamily: '"Space Grotesk", sans-serif', fontWeight: 500, letterSpacing: '0.06em' },
    button: { fontFamily: '"Space Grotesk", sans-serif', fontWeight: 600, letterSpacing: '0.08em' },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: BG_SOFT,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          border: `1px solid ${BG_BORDER}`,
          borderRadius: 12,
          boxShadow: '0 4px 16px rgba(32,37,43,0.08)',
          transition: 'box-shadow 0.3s ease, border-color 0.3s ease',
          '&:hover': {
            boxShadow: '0 6px 20px rgba(32,37,43,0.12)',
            borderColor: ACCENT,
          },
        },
      },
    },
    MuiPaper: { styleOverrides: { root: { backgroundImage: 'none' } } },
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 10, textTransform: 'uppercase', letterSpacing: '0.08em' },
        contained: {
          boxShadow: `0 0 16px rgba(${ACCENT_BRIGHT_RGB},0.20)`,
          '&:hover': { boxShadow: `0 0 24px rgba(${ACCENT_BRIGHT_RGB},0.35)` },
        },
        outlined: {
          borderColor: BG_BORDER,
          '&:hover': {
            borderColor: ACCENT,
            backgroundColor: `rgba(${ACCENT_RGB},0.08)`,
          },
        },
      },
    },
    MuiBottomNavigation: {
      styleOverrides: { root: { backgroundColor: '#FFFFFF', borderTop: `1px solid ${BG_BORDER}` } },
    },
    MuiBottomNavigationAction: {
      styleOverrides: {
        root: {
          color: '#5F6872',
          '&.Mui-selected': { color: ACCENT_BRIGHT },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          fontFamily: '"Space Grotesk", sans-serif',
          fontWeight: 600,
          letterSpacing: '0.10em',
          textTransform: 'uppercase',
          color: '#5F6872',
          '&.Mui-selected': { color: ACCENT_BRIGHT },
        },
      },
    },
    MuiTabs: {
      styleOverrides: { indicator: { backgroundColor: ACCENT_BRIGHT, height: 3, borderRadius: '3px 3px 0 0' } },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': { borderColor: BG_BORDER },
            '&:hover fieldset': { borderColor: ACCENT },
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: { paper: { backgroundColor: '#FFFFFF', border: `1px solid ${BG_BORDER}` } },
    },
  },
});

export const groupsTokens = {
  violet: ACCENT,
  violetBright: ACCENT_BRIGHT,
  borderViolet: BG_BORDER,
  glowViolet: `rgba(${ACCENT_BRIGHT_RGB},0.10)`,
  accentRGB: ACCENT_RGB,
  accentBrightRGB: ACCENT_BRIGHT_RGB,
  accentDim08: `rgba(${ACCENT_RGB},0.08)`,
  accentDim12: `rgba(${ACCENT_RGB},0.12)`,
  accentDim15: `rgba(${ACCENT_RGB},0.15)`,
  accentBorder40: `rgba(${ACCENT_RGB},0.40)`,
  surfaceRaised: '#FFFFFF',
  chartGrid: 'rgba(32,37,43,0.10)',
  chartGradientStart: `rgba(${ACCENT_BRIGHT_RGB},0.35)`,
  chartGradientEnd: `rgba(${ACCENT_BRIGHT_RGB},0)`,
  teal: TEAL,
  tealDim12: `rgba(${TEAL_RGB},0.12)`,
  tealBorder40: `rgba(${TEAL_RGB},0.40)`,
  bgSoft: BG_SOFT,
  bgBorder: BG_BORDER,
};

export default groupsTheme;
