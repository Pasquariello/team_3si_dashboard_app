// src/theme.ts
import { createTheme } from '@mui/material/styles';

// Extend MUI's theme types
declare module '@mui/material/styles' {
  interface Palette {
    cusp_orange: Palette['primary'];
    cusp_iron: Palette['primary'];
    cusp_woodsmoke: Palette['primary'];
  }
  interface PaletteOptions {
    cusp_orange?: PaletteOptions['primary'];
    cusp_iron?: PaletteOptions['primary'];
    cusp_woodsmoke?: Palette['primary'];
  }
}

const theme = createTheme({
  palette: {
    primary: {
      main: '#18181B',
      light: '#2C2C30',
      dark: '#0F0F10',
      contrastText: '#FFFFFF',
    },
    cusp_orange: {
      main: '#F59E0B',
    },
    cusp_iron: {
      main: '#E4E4E7',
      contrastText: '#71717A',
    },
    cusp_woodsmoke: {
      main: '#18181B',
      light: '#2C2C30',
      dark: '#0F0F10',
      contrastText: '#FFFFFF',
    },
  },
});

export default theme;
