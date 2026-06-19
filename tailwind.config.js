/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Be Vietnam Pro"', 'sans-serif'],
      },
      colors: {
        secondary: '#4a5568',
        unilever: {
          50: '#e6f0fa',
          100: '#cce0f5',
          200: '#99c2eb',
          300: '#66a3e0',
          400: '#3385d6',
          500: '#0066cc',
          600: '#004d99',
          700: '#003a73',
          800: '#00274d',
          900: '#001326',
        },
        ink: '#1a1a2e',
        muted: '#718096',
        tertiary: '#a0aec0',
        line: '#e2e8f0',
        sand: '#f7f9fc',
        cream: '#f0f4f8',
      },
      keyframes: {
        'scan-spin': {
          to: { transform: 'rotate(360deg)' },
        },
        'scan-dot': {
          '0%, 100%': { opacity: '0', transform: 'scale(0.5)' },
          '50%': { opacity: '0.9', transform: 'scale(1.4)' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
      },
      animation: {
        'scan-spin': 'scan-spin 1.8s linear infinite',
        'scan-dot': 'scan-dot 5s ease-in-out infinite',
        'fade-in': 'fade-in 0.5s ease-out forwards',
      },
    },
  },
  plugins: [],
}
