/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        brand: {
          50:  '#eef2ff',
          100: '#e0e7ff',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
        },
        slate: {
          850: '#0f172a',
          900: '#0b1120',
          950: '#060b17',
        },
      },
      animation: {
        'fade-up':    'fadeUp .4s ease both',
        'fade-in':    'fadeIn .3s ease both',
        'pulse-slow': 'pulse 2.5s cubic-bezier(.4,0,.6,1) infinite',
        'spin-slow':  'spin 1.5s linear infinite',
        'blob':       'blob 8s ease-in-out infinite',
      },
      keyframes: {
        fadeUp:  { from: { opacity: 0, transform: 'translateY(14px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        fadeIn:  { from: { opacity: 0 }, to: { opacity: 1 } },
        blob:    { '0%,100%': { borderRadius: '60% 40% 30% 70%/60% 30% 70% 40%' }, '50%': { borderRadius: '30% 60% 70% 40%/50% 60% 30% 60%' } },
      },
      boxShadow: {
        'glow-brand': '0 0 0 1px rgba(99,102,241,.3), 0 4px 24px rgba(99,102,241,.15)',
        'glow-green': '0 0 0 1px rgba(34,197,94,.3), 0 4px 16px rgba(34,197,94,.12)',
        'card':       '0 1px 3px rgba(0,0,0,.4), 0 8px 32px rgba(0,0,0,.3)',
      },
    },
  },
  plugins: [],
}
