import { MD3LightTheme } from 'react-native-paper';

export const appTheme = {
  ...MD3LightTheme,
  roundness: 14,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#2563EB',
    secondary: '#F97316',
    background: '#EEF3FF',
    surface: '#FFFFFF',
    surfaceVariant: '#E0E7FF',
    outlineVariant: '#C7D2FE',
    error: '#C0392B',
  },
};
