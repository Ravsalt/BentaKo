import type { ThemeType } from './theme';

export const darkTheme: ThemeType = {
  colors: {
    primary: '#4a90e2',
    primaryDark: '#3a7bc8',
    success: '#68d391', // Brighter green
    warning: '#f6e05e', // Brighter yellow
    error: '#f56565',   // Brighter red
    text: '#ffffff',       // White text
    textLight: '#a0aec0',  // Lighter gray
    background: '#1a202c', // Dark blue-gray background
    white: '#2d3748',     // Lighter surface color
  },
  borderRadius: '8px',
  shadows: {
    small: '0 2px 4px rgba(0, 0, 0, 0.3)',
    medium: '0 4px 8px rgba(0, 0, 0, 0.4)',
  },
};