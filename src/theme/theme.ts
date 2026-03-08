import { MD3LightTheme, configureFonts } from 'react-native-paper';

const fontConfig = {
  fontFamily: 'System',
  letterSpacing: 0,
};

export const appTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#4338CA', // Indigo Primary
    primaryContainer: '#EEF2FF',
    secondary: '#10B981', // Emerald Secondary (Great for complete tasks)
    secondaryContainer: '#D1FAE5',
    tertiary: '#F59E0B', // Amber
    error: '#EF4444',
    background: '#F8FAFC', // Slate 50 background
    surface: '#FFFFFF',
    surfaceVariant: '#F1F5F9', // Light gray for cards/search
    onPrimary: '#FFFFFF',
    onSecondary: '#FFFFFF',
    onBackground: '#0F172A',
    onSurface: '#1E293B',
    onSurfaceVariant: '#475569',
    outline: '#E2E8F0',
    elevation: {
      level0: 'transparent',
      level1: '#f8fafc',
      level2: '#f1f5f9',
      level3: '#e2e8f0',
      level4: '#cbd5e1',
      level5: '#94a3b8',
    },
  },
  roundness: 12, // More modern squircle look
  fonts: configureFonts({config: fontConfig}),
};
