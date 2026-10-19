import { createTheme } from '@mui/material/styles';
import { brand } from './brand';

/**
 * Design tokens for the Pulse dark-violet theme.
 * This is the default look for the book and the deployed site.
 */

const VIOLET = brand.accent;
const VIOLET_BRIGHT = brand.accentBright;
const BORDER_VIOLET = brand.bgBorder || '#2A2A3A';
const GLOW_VIOLET = `rgba(${brand.accentBrightRGB},0.25)`;

const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: brand.bgSoft || '#0A0A0F',
      paper: '#14141C',
    },
    primary: {
      main: VIOLET,
      light: VIOLET_BRIGHT,
    },
    text: {
      primary: '#F5F5FA',
      secondary: '#8E8EA0',
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
          backgroundColor: brand.bgSoft || '#0A0A0F',
          backgroundImage: `radial-gradient(ellipse at 0% 100%, ${GLOW_VIOLET} 0%, transparent 50%)`,
          backgroundAttachment: 'fixed',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#14141C',
          border: `1px solid ${BORDER_VIOLET}`,
          borderRadius: 12,
          boxShadow: '0 4px 24px rgba(0,0,0,0.35)',
          transition: 'box-shadow 0.3s ease, border-color 0.3s ease',
          '&:hover': {
            boxShadow: '0 6px 32px rgba(0,0,0,0.45)',
            borderColor: VIOLET,
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
          boxShadow: `0 0 16px rgba(${brand.accentBrightRGB},0.30)`,
          '&:hover': {
            boxShadow: `0 0 24px rgba(${brand.accentBrightRGB},0.45)`,
          },
        },
        outlined: {
          borderColor: BORDER_VIOLET,
          '&:hover': {
            borderColor: VIOLET,
            backgroundColor: `rgba(${brand.accentRGB},0.12)`,
          },
        },
      },
    },
    MuiBottomNavigation: {
      styleOverrides: {
        root: {
          backgroundColor: '#14141C',
          borderTop: `1px solid ${BORDER_VIOLET}`,
        },
      },
    },
    MuiBottomNavigationAction: {
      styleOverrides: {
        root: {
          color: '#8E8EA0',
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
          color: '#8E8EA0',
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
          backgroundColor: '#14141C',
          border: `1px solid ${BORDER_VIOLET}`,
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: '#14141C',
          border: `1px solid ${BORDER_VIOLET}`,
          color: '#F5F5FA',
        },
      },
    },
  },
});

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
  chartGrid: 'rgba(255,255,255,0.06)',
  chartGradientStart: `rgba(${brand.accentBrightRGB},0.35)`,
  chartGradientEnd: `rgba(${brand.accentBrightRGB},0)`,
  teal: brand.accent2 || null,
  tealDim12: brand.accent2RGB ? `rgba(${brand.accent2RGB},0.12)` : null,
  tealBorder40: brand.accent2RGB ? `rgba(${brand.accent2RGB},0.40)` : null,
  bgSoft: brand.bgSoft || null,
  bgBorder: brand.bgBorder || null,
};

export default theme;
