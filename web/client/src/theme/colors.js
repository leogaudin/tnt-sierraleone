import { alpha } from '@mui/material/styles';

const withAlphas = (color) => {
  return {
    ...color,
    alpha4: alpha(color.main, 0.04),
    alpha8: alpha(color.main, 0.08),
    alpha12: alpha(color.main, 0.12),
    alpha30: alpha(color.main, 0.30),
    alpha50: alpha(color.main, 0.50)
  };
};

export const neutral = {
  50: '#F8F9FA',
  100: '#F3F4F6',
  200: '#E5E7EB',
  300: '#D2D6DB',
  400: '#9DA4AE',
  500: '#6C737F',
  600: '#4D5761',
  700: '#2F3746',
  800: '#1C2536',
  900: '#111927'
};

export const blue = withAlphas({
  lightest: '#F5FAFF',
  light: '#EBF0FE',
  main: '#0949FF',
  dark: '#0033C0',
  darkest: '#00268E',
  contrastText: '#FFFFFF'
});

export const green = withAlphas({
  lightest: '#E6FBE9',
  light: '#CAF6D2',
  main: '#1eb53a',
  dark: '#126D23',
  darkest: '#093310',
  contrastText: '#FFFFFF'
});

export const red = withAlphas({
  lightest: '#F8D1D2',
  light: '#EC7679',
  main: '#D01C1F',
  dark: '#8E1315',
  darkest: '#40090A',
});

export const success = withAlphas({
  lightest: '#ADFFD4',
  light: '#3FC79A',
  main: '#10B981',
  dark: '#0B815A',
  darkest: '#134E48',
  contrastText: '#FFFFFF'
});

export const info = withAlphas({
  lightest: '#ECFDFF',
  light: '#CFF9FE',
  main: '#06AED4',
  dark: '#0E7090',
  darkest: '#164C63',
  contrastText: '#FFFFFF'
});

export const warning = withAlphas({
  lightest: '#FFFAEB',
  light: '#FEF0C7',
  main: '#F79009',
  dark: '#B54708',
  darkest: '#7A2E0E',
  contrastText: '#FFFFFF'
});

export const error = withAlphas({
  lightest: '#FEF3F2',
  light: '#FEE4E2',
  main: '#F04438',
  dark: '#B42318',
  darkest: '#7A271A',
  contrastText: '#FFFFFF'
});
