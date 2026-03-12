import type { Config } from 'tailwindcss';
import nebulaPreset from '@pompcore/ui/tailwind-preset';
import forms from '@tailwindcss/forms';

export default {
  presets: [nebulaPreset],
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
    '../../packages/ui/src/**/*.{ts,tsx}',
    '../../packages/auth/src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'vault-color': {
          DEFAULT: 'rgb(var(--color-app-accent) / <alpha-value>)',
          light: '#34D399',
        },
      },
    },
  },
  plugins: [forms],
} satisfies Config;
