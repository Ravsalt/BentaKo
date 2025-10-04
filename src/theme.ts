// theme.ts
export interface ThemeType {
  colors: {
    primary: string;
    primaryDark: string;
    success: string;
    warning: string;
    error: string;
    text: string;
    textLight: string;
    background: string;
    white: string;
  };
  borderRadius: string;
  shadows: {
    small: string;
    medium: string;
  };
}

export const theme: ThemeType = {
  colors: {
    primary: '#4a90e2',
    primaryDark: '#3a7bc8',
    success: '#4caf50',
    warning: '#ff9800',
    error: '#f44336',
    text: '#333',
    textLight: '#666',
    background: '#f5f5f5',
    white: '#fff',
  },
  borderRadius: '8px',
  shadows: {
    small: '0 2px 4px rgba(0, 0, 0, 0.1)',
    medium: '0 4px 8px rgba(0, 0, 0, 0.15)',
  },
};

// This is a type declaration for styled-components
declare module 'styled-components' {
  export interface DefaultTheme extends ThemeType {}
}
