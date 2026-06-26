// src/constants/theme.js
const theme = {
  colors: {
    primary: '#6B2D8C',
    primaryDark: '#4A1F61',
    accent: '#D4AF37',
    background: '#13111A',
    surface: '#1F1B2B',
    surfaceElevated: '#2A2438',
    mist: '#A89FB5',
    textPrimary: '#F5F2FA',
    textSecondary: '#B8AFC9',
    success: '#3FAE7A',
    danger: '#D65A5A',
    border: '#332C45',
  },
  typography: {
    h1: { fontSize: 28, fontWeight: '700', letterSpacing: -0.5 },
    h2: { fontSize: 22, fontWeight: '600' },
    body: { fontSize: 15, fontWeight: '400' },
    bodyBold: { fontSize: 15, fontWeight: '600' },
    eyebrow: {
      fontSize: 12,
      fontWeight: '600',
      letterSpacing: 1,
      textTransform: 'uppercase',
    },
    caption: { fontSize: 12, fontWeight: '400' },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  radius: {
    sm: 8,
    md: 12,
    lg: 20,
    full: 999,
  },
};

export default theme;
