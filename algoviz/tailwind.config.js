/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Syne"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
        body: ['"DM Sans"', 'sans-serif'],
      },
      colors: {
        bg: '#080C14',
        surface: '#0D1320',
        card: '#111827',
        border: '#1E2D40',
        accent: '#00D9FF',
        accent2: '#7C3AED',
        accent3: '#F59E0B',
        muted: '#4B5563',
        text: '#E2E8F0',
        dim: '#94A3B8',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease forwards',
        'slide-up': 'slideUp 0.5s ease forwards',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(20px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        glow: {
          from: { boxShadow: '0 0 10px rgba(0,217,255,0.3)' },
          to: { boxShadow: '0 0 30px rgba(0,217,255,0.7)' },
        },
      },
    },
  },
  plugins: [],
}
