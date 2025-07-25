// src/theme.ts
import { createTheme } from '@mui/material/styles';

// Extend MUI's theme types
declare module '@mui/material/styles' {
  interface Palette {
    cusp_orange: Palette['primary'];
    cusp_iron: Palette['primary'];

  }
  interface PaletteOptions {
    cusp_orange?: PaletteOptions['primary'];
    cusp_iron?: PaletteOptions['primary'];
  }
}

const theme = createTheme({
  palette: {
    cusp_orange: {
        main: '#F59E0B'
    },
    cusp_iron: {
        main: '#E4E4E7'
    }
  },

});

export default theme;
