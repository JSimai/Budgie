import { StyleSheet } from 'react-native';

export const colors = {
  primary: '#BE3730',
  primary2: '#A32019',
  primary3: '#8D1009',
  primary4: '#730600',
  primary5: '#5B0400',
  success: '#3EB6AE',
  danger: '#D6D454',
  background: {
    light: '#EEEEEE',
    dark: '#202020',
  },
  text: {
    light: '#202020',
    dark: '#EEEEEE',
  },
  secondaryText: {
    light: '#5D5D5D',
    dark: '#A0A0A0',
  },
  border: {
    light: '#E5E5EA',
    dark: '#38383A',
  },

};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const typography = StyleSheet.create({
  title1: {
    fontSize: 28,
    fontWeight: 'bold',
    letterSpacing: 0.35,
  },
  title2: {
    fontSize: 22,
    fontWeight: '600',
    letterSpacing: 0.35,
  },
  title3: {
    fontSize: 20,
    fontWeight: '600',
    letterSpacing: 0.35,
  },
  body: {
    fontSize: 16,
    letterSpacing: -0.24,
  },
  caption1: {
    fontSize: 12,
    letterSpacing: 0,
  },
  caption2: {
    fontSize: 11,
    letterSpacing: 0.07,
  },
  discount: {
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
}); 