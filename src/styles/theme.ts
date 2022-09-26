import { createTheme, responsiveFontSizes } from '@mui/material/styles';

export const theme = responsiveFontSizes(
  createTheme({
    components: {
      MuiTypography: {
        defaultProps: {
          variantMapping: {
            h2: 'h1',
            h3: 'h2',
          },
        },
      },
    },
  })
);
