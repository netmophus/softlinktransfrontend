import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2' // Couleur primaire
    },
    secondary: {
      main: '#dc004e' // Couleur secondaire
    }
  },
  typography: {
    fontFamily: 'Roboto, sans-serif'
  }
});

export default theme;
