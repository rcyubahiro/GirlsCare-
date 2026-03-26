/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#0E8A84',
        secondary: '#F9736B',
        bg: '#FFF9F3',
        textBase: '#14213D',
      },
      fontFamily: {
        heading: ['Sora', 'sans-serif'],
        body: ['Nunito', 'sans-serif'],
      },
      boxShadow: {
        card: '0 20px 45px rgba(20, 33, 61, 0.10)',
        soft: '0 10px 25px rgba(14, 138, 132, 0.16)',
      },
      borderRadius: {
        card: '16px',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-16px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        spin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        fadeInUp: 'fadeInUp 0.4s ease-out both',
        floatSlow: 'floatSlow 6s ease-in-out infinite',
        slideInLeft: 'slideInLeft 0.5s ease-out both',
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        spin: 'spin 1s linear infinite',
      },
    },
  },
  plugins: [],
};
