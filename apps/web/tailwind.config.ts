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
  plugins: [forms],
} satisfies Config;
