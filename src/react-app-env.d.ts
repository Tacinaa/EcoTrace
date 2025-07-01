/// <reference types="react-scripts" />

import '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    primaryLight?: Palette['primary'];
    successLight?: Palette['primary'];
  }
  interface PaletteOptions {
    primaryLight?: PaletteOptions['primary'];
    successLight?: PaletteOptions['primary'];
  }
}

// Si vous utilisez les couleurs directement sur les composants Button, par exemple :
// declare module '@mui/material/Button' {
//   interface ButtonPropsColorOverrides {
//     primaryLight: true;
//     successLight: true;
//   }
// }
