import { createTheme } from '@mui/material/styles';
import { brand } from './brand';

/**
 * Design tokens for the warm, encouraging York U Fitness experience.
 */

const VIOLET = brand.accent;
const VIOLET_BRIGHT = brand.accentBright;
const BORDER_VIOLET = brand.bgBorder || '#E1DEDB';
const GLOW_VIOLET = `rgba(${brand.accentBrightRGB},0.10)`;

// York U Fitness secondary palette — only defined for the yorku brand.
const TEAL = brand.accent2 || null;
const TEAL_RGB = brand.accent2RGB || null;

const theme = createTheme({
  palette: {
    mode: 'light',
    background: {
      default: brand.bgSoft || '#F2F2F2',
      paper: '#FFFFFF',
    },
    primary: {
      main: VIOLET,
      light: VIOLET_BRIGHT,
    },
    text: {
      primary: '#20252B',
      secondary: '#5F6872',
    },
    divider: BORDER_VIOLET,
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontFamily: '"Space Grotesk", sans-serif',
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: '0.12em',
    },
    h2: {
      fontFamily: '"Space Grotesk", sans-serif',
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: '0.12em',
    },
    h3: {
      fontFamily: '"Space Grotesk", sans-serif',
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.12em',
    },
    h4: {
      fontFamily: '"Space Grotesk", sans-serif',
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.12em',
    },
    h5: {
      fontFamily: '"Space Grotesk", sans-serif',
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.12em',
    },
    h6: {
      fontFamily: '"Space Grotesk", sans-serif',
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.12em',
    },
    subtitle1: {
      fontFamily: '"Space Grotesk", sans-serif',
      fontWeight: 500,
      letterSpacing: '0.06em',
    },
    button: {
      fontFamily: '"Space Grotesk", sans-serif',
      fontWeight: 600,
      letterSpacing: '0.08em',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: brand.bgSoft || '#F2F2F2',
          backgroundImage: `radial-gradient(ellipse at 0% 100%, ${GLOW_VIOLET} 0%, transparent 50%)`,
          backgroundAttachment: 'fixed',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          border: `1px solid ${BORDER_VIOLET}`,
          borderRadius: 12,
          boxShadow: '0 4px 16px rgba(32,37,43,0.08)',
          transition: 'box-shadow 0.3s ease, border-color 0.3s ease',
          '&:hover': {
            boxShadow: '0 6px 20px rgba(32,37,43,0.12)',
            borderColor: brand.accent,
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
        },
        contained: {
          boxShadow: `0 0 16px rgba(${brand.accentBrightRGB},0.20)`,
          '&:hover': {
            boxShadow: `0 0 24px rgba(${brand.accentBrightRGB},0.35)`,
          },
        },
        outlined: {
          borderColor: BORDER_VIOLET,
          '&:hover': {
            borderColor: VIOLET,
            backgroundColor: `rgba(${brand.accentRGB},0.08)`,
          },
        },
      },
    },
    MuiBottomNavigation: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          borderTop: `1px solid ${BORDER_VIOLET}`,
        },
      },
    },
    MuiBottomNavigationAction: {
      styleOverrides: {
        root: {
          color: '#5F6872',
          '&.Mui-selected': {
            color: VIOLET_BRIGHT,
          },
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
          '&.Mui-selected': {
            color: VIOLET_BRIGHT,
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          backgroundColor: VIOLET_BRIGHT,
          height: 3,
          borderRadius: '3px 3px 0 0',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: BORDER_VIOLET,
            },
            '&:hover fieldset': {
              borderColor: VIOLET,
            },
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: '#FFFFFF',
          border: `1px solid ${BORDER_VIOLET}`,
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: '#FFFFFF',
          border: `1px solid ${BORDER_VIOLET}`,
          color: '#FFFFFF',
        },
      },
    },
  },
});

// Export design tokens for use in components (e.g. Recharts)
export const tokens = {
  violet: VIOLET,
  violetBright: VIOLET_BRIGHT,
  borderViolet: BORDER_VIOLET,
  glowViolet: GLOW_VIOLET,
  accentRGB: brand.accentRGB,
  accentBrightRGB: brand.accentBrightRGB,
  accentDim08: `rgba(${brand.accentRGB},0.08)`,
  accentDim12: `rgba(${brand.accentRGB},0.12)`,
  accentDim15: `rgba(${brand.accentRGB},0.15)`,
  accentBorder40: `rgba(${brand.accentRGB},0.40)`,
  surfaceRaised: brand.surfaceRaised,
  chartGrid: 'rgba(32,37,43,0.10)',
  chartGradientStart: `rgba(${brand.accentBrightRGB},0.35)`,
  chartGradientEnd: `rgba(${brand.accentBrightRGB},0)`,
  // York U Fitness extras — undefined on the default Pulse brand.
  teal: TEAL,
  tealDim12: TEAL_RGB ? `rgba(${TEAL_RGB},0.12)` : null,
  tealBorder40: TEAL_RGB ? `rgba(${TEAL_RGB},0.40)` : null,
  bgSoft: brand.bgSoft || null,
  bgBorder: brand.bgBorder || null,
};

export default theme;
