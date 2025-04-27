/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#6d28d9',
          DEFAULT: '#5b21b6',
          dark: '#4c1d95',
        },
        secondary: {
          light: '#2563eb',
          DEFAULT: '#1d4ed8',
          dark: '#1e40af',
        },
        background: {
          light: '#f8fafc',
          DEFAULT: '#f1f5f9',
          dark: '#e2e8f0',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'toast-in': 'toastIn 0.3s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.8s ease-out forwards', // 👈 added
      },
      keyframes: {
        toastIn: {
          '0%': { opacity: 0, transform: 'translateY(20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        fadeInUp: { // 👈 added
          '0%': { opacity: 0, transform: 'translateY(20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
