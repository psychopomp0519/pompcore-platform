/**
 * @file Shared Nebula theme Tailwind preset
 * @description Apps extend this preset and add their own accent color.
 *
 * Usage in apps:
 *   import nebulaPreset from '@pompcore/ui/tailwind-preset';
 *   export default { presets: [nebulaPreset], ... }
 */
import type { Config } from 'tailwindcss';

const nebulaPreset: Partial<Config> = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'app-accent': 'rgb(var(--color-app-accent) / <alpha-value>)',
        brand: { DEFAULT: '#7C3AED', 50: '#F5F0FF', 100: '#EDE5FF', 200: '#D4BBFF', 300: '#B794F4', 400: '#9F67FF', 500: '#7C3AED', 600: '#6D28D9', 700: '#5B21B6', 800: '#4C1D95', 900: '#3B0764' },
        'accent-gold': { DEFAULT: '#FFD700', light: '#FFEC80', dark: '#B8960F' },
        'accent-pink': { DEFAULT: '#EC4899', light: '#F9A8D4', dark: '#BE185D' },
        navy: { DEFAULT: '#2B3442', light: '#3E4C5E', dark: '#1A202C' },
        sky: { deep: '#87CEEB', mid: '#B0D4E8', light: '#D1E9F6', pale: '#E3F0F9', faint: '#EDF5FA', mist: '#F5F9FD', soft: '#F8FBFE' },
        surface: {
          DEFAULT: '#FAF8FF', light: '#FAF8FF', dark: '#0C0818',
          'dark-1': '#0C0818', 'dark-2': '#110D20', 'dark-3': '#150F28',
          card: 'rgba(255,255,255,0.8)', 'card-light': 'rgba(255,255,255,0.8)', 'card-dark': 'rgba(30,41,59,0.5)',
        },
      },
      fontFamily: {
        sans: ['Pretendard', 'Noto Sans KR', 'system-ui', 'sans-serif'],
        display: ['Nunito', 'Pretendard', 'sans-serif'],
      },
      screens: {
        tablet: '768px',
        desktop: '1200px',
      },
      boxShadow: {
        card: '0 2px 12px rgba(0,0,0,0.08)',
        'card-hover': '0 8px 24px rgba(0,0,0,0.12)',
        glass: '0 4px 16px rgba(0,0,0,0.06)',
        'glass-lg': '0 8px 32px rgba(0,0,0,0.1)',
        glow: '0 0 20px rgba(124,58,237,0.3)',
        'glow-gold': '0 0 20px rgba(255,215,0,0.3)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        float: 'float 3s ease-in-out infinite',
        twinkle: 'twinkle 2s ease-in-out infinite',
        'scroll-pulse': 'scrollPulse 2s ease-in-out infinite',
        'cloud-drift': 'cloudDrift 30s linear infinite',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { opacity: '0', transform: 'translateY(20px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        float: { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } },
        twinkle: { '0%, 100%': { opacity: '0.3' }, '50%': { opacity: '1' } },
        scrollPulse: { '0%, 100%': { transform: 'translateY(0)', opacity: '0.6' }, '50%': { transform: 'translateY(8px)', opacity: '1' } },
        cloudDrift: { '0%': { transform: 'translateX(-100%)' }, '100%': { transform: 'translateX(100vw)' } },
      },
    },
  },
};

export default nebulaPreset;
