import type {Config} from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        headline: ['Plus Jakarta Sans', 'sans-serif'],
        body: ['Manrope', 'sans-serif'],
        label: ['Plus Jakarta Sans', 'sans-serif'],
      },
      colors: {
        background: '#131315',
        foreground: '#e5e1e4',
        primary: {
          DEFAULT: '#ffb1c3',
          container: '#ff5a8f',
          fixed: '#ffd9e0',
          'on-fixed': '#3f0019',
        },
        secondary: {
          DEFAULT: '#cdbdff',
          container: '#5203d5',
        },
        tertiary: {
          DEFAULT: '#00daf3',
          container: '#00a5b8',
          'fixed-dim': '#00daf3',
        },
        surface: {
          DEFAULT: '#131315',
          bright: '#39393b',
          dim: '#131315',
          container: {
            low: '#1b1b1d',
            DEFAULT: '#201f21',
            high: '#2a2a2c',
            highest: '#353437',
            lowest: '#0e0e10',
          },
          variant: '#353437',
        },
        'on-surface': {
          DEFAULT: '#e5e1e4',
          variant: '#dfbec4',
        },
        border: 'rgba(255, 255, 255, 0.1)',
      },
      borderRadius: {
        DEFAULT: '1rem',
        lg: '2rem',
        xl: '3rem',
        full: '9999px',
      },
      keyframes: {
        'floating-3d': {
          '0%, 100%': { transform: 'translateY(0) rotate(0)' },
          '50%': { transform: 'translateY(-20px) rotate(2deg)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.5', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.05)' },
        }
      },
      animation: {
        'floating-3d': 'floating-3d 4s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;
