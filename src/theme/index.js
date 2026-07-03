import { Platform } from 'react-native';

export const colors = {
  ink900: '#0F172A',
  ink800: '#18253D',
  ink700: '#233454',
  slate500: '#64748B',
  slate300: '#CBD5E1',
  slate200: '#E2E8F0',
  slate100: '#F1F5F9',
  paper: '#FFFDF8',
  background: '#F6F2E8',
  surface: '#FFF9EE',
  surfaceStrong: '#F9F0DE',
  teal700: '#0F766E',
  teal600: '#0D9488',
  teal500: '#14B8A6',
  amber600: '#D97706',
  amber500: '#F59E0B',
  coral500: '#F97316',
  red500: '#DC2626',
  green500: '#16A34A',
  white: '#FFFFFF',
  black: '#000000',
  overlay: 'rgba(15, 23, 42, 0.55)',
};

export const spacing = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
};

export const radius = {
  sm: 12,
  md: 18,
  lg: 24,
  pill: 999,
};

export const shadow = Platform.select({
  ios: {
    shadowColor: colors.ink900,
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
  },
  android: {
    elevation: 4,
  },
  default: {},
});

export const fonts = {
  heading: Platform.select({ ios: 'Georgia', android: 'serif', default: 'serif' }),
  body: Platform.select({ ios: 'System', android: 'sans-serif', default: 'sans-serif' }),
};
