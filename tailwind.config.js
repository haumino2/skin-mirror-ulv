/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Be Vietnam Pro"', 'system-ui', 'sans-serif'],
        serif: ['Lora', 'Georgia', 'serif'],
      },
      colors: {
        ink: '#1A1A1A',
        muted: '#6B7F75',
        tertiary: '#888780',
        cream: '#FAFAF7',
        sand: '#F1EFE8',
        line: '#E5E5E5',
        unilever: {
          50: '#E8EDFC',
          100: '#C4D0F8',
          400: '#5774DC',
          600: '#1F36C7',
          800: '#172994',
          900: '#0A1F70',
        },
      },
      keyframes: {
        'scan-spin': {
          to: { transform: 'rotate(360deg)' },
        },
        'scan-dot': {
          '0%, 100%': { opacity: '0', transform: 'scale(0.5)' },
          '50%': { opacity: '0.9', transform: 'scale(1.4)' },
        },
      },
      animation: {
        'scan-spin': 'scan-spin 1.8s linear infinite',
        'scan-dot': 'scan-dot 5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}