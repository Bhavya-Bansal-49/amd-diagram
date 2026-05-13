import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        amd: {
          red: '#ed1c24',
          orange: '#ff8a1f',
          gold: '#ffc857',
          cyan: '#35d5ff',
          panel: '#11151c',
          block: '#1c222d',
          muted: '#8b97aa',
        },
      },
      boxShadow: {
        glow: '0 0 36px rgba(237, 28, 36, 0.28)',
        cyan: '0 0 28px rgba(53, 213, 255, 0.26)',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'SFMono-Regular', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
} satisfies Config;
