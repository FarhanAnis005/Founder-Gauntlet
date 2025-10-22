// File: frontend/tailwind.config.ts

import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-bg': '#121212',
        'surface-bg': '#1E1E1E',
        'accent': '#007BFF',
        'accent-glow': 'rgba(0, 123, 255, 0.75)',
        'main-text': '#FFFFFF',
        'body-text': '#EAEAEA',
        // -- Add these two new colors for the glass effect --
        'glass-bg': 'rgba(255, 255, 255, 0.05)',
        'glass-border': 'rgba(255, 255, 255, 0.20)',
      },
      animation: {
        flicker: 'flicker 1.5s infinite alternate',
        'pulse-glow': 'pulse-glow 3s infinite ease-in-out',
      },
      keyframes: {
        flicker: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        'pulse-glow': {
            '0%, 100%': { transform: 'scale(1)', opacity: '0.7' },
            '50%': { transform: 'scale(1.1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
export default config;