import type { Config } from 'tailwindcss';
import forms from '@tailwindcss/forms';

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    screens: {
      'tablet': '768px',
      'desktop': '1200px',
    },
    extend: {
      colors: {
        brand: {
          DEFAULT: '#7C3AED',
          light: '#A855F7',
          dark: '#5B21B6',
          50: '#f5f3ff', 100: '#ede9fe', 200: '#ddd6fe',
          300: '#c4b5fd', 400: '#a78bfa', 500: '#7C3AED',
          600: '#7C3AED', 700: '#5B21B6', 800: '#4c1d95',
          900: '#3b0764', 950: '#2e1065',
        },
        'accent-gold': '#FFD700',
        'accent-pink': '#EC4899',
        'vault-color': { DEFAULT: '#10B981', light: '#34D399' },
        'quest-color': { DEFAULT: '#7C3AED', light: '#C084FC' },
        navy: { DEFAULT: '#2B3442', light: '#3d4a5c', dark: '#1a2332' },
        sky: {
          deep: '#87CEEB', mid: '#A8D5FF', light: '#B8DEFF',
          pale: '#D0EAFF', faint: '#E8F4FD', mist: '#E0F0FF', soft: '#D6EDFF',
        },
        surface: {
          DEFAULT: '#FAF8FF', dark: '#0f172a',
          'dark-1': '#0C0818', 'dark-2': '#110D20', 'dark-3': '#150F28',
          light: '#FAF8FF', 'light-card': '#FFFFFF',
          card: 'rgba(255, 255, 255, 0.8)',
          'card-dark': 'rgba(30, 41, 59, 0.5)',
        },
      },
      fontFamily: {
        sans: ['Pretendard', 'Noto Sans KR', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Nunito', 'Pretendard', 'sans-serif'],
        'display-deco': ['Nunito', 'Pretendard', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.04)',
        'card-hover': '0 4px 12px rgba(0,0,0,0.1), 0 8px 32px rgba(0,0,0,0.08)',
        glass: '0 8px 32px rgba(0,0,0,0.12)',
        'glass-lg': '0 16px 48px rgba(0,0,0,0.2)',
        glow: '0 0 20px rgba(124,58,237,0.3)',
        'glow-gold': '0 0 20px rgba(255,215,0,0.2)',
      },
      backdropBlur: { glass: '16px' },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
        'float': 'float 6s ease-in-out infinite',
        'twinkle': 'twinkle 4s ease-in-out infinite',
        'scroll-pulse': 'scrollPulse 2s ease-in-out infinite',
        'cloud-drift': 'cloudDrift 20s ease-in-out infinite',
        'cloud-drift-slow': 'cloudDriftSlow 30s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } },
        twinkle: { '0%, 100%': { opacity: '0.2' }, '50%': { opacity: '1' } },
        scrollPulse: {
          '0%, 100%': { opacity: '0.4', transform: 'translateY(0)' },
          '50%': { opacity: '1', transform: 'translateY(6px)' },
        },
        cloudDrift: { '0%': { transform: 'translateX(0)' }, '50%': { transform: 'translateX(30px)' }, '100%': { transform: 'translateX(0)' } },
        cloudDriftSlow: { '0%': { transform: 'translateX(0)' }, '50%': { transform: 'translateX(15px)' }, '100%': { transform: 'translateX(0)' } },
      },
    },
  },
  plugins: [forms],
};

export default config;
