/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fff1f0',
          100: '#ffe1de',
          200: '#ffc7c2',
          300: '#ff9f96',
          400: '#ff695c',
          500: '#ff4d3d', // Primary Coral
          600: '#e64537',
          700: '#bf3a2e',
          800: '#992e25',
          900: '#7d261e',
        },
        accent: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#1565C0',
          600: '#1256A3',
          700: '#0f4786',
          800: '#0c3869',
          900: '#09294c',
        },
        surface: {
          50: '#FFFFFF',
          100: '#F8F9FA',
          200: '#F5F7FA',
          300: '#EEF1F6',
          400: '#E2E8F0',
          500: '#CBD5E1',
          600: '#94A3B8',
          700: '#64748B',
          800: '#475569',
          900: '#1A1D23',
        },
        success: {
          light: '#d4edda',
          DEFAULT: '#27AE60',
          dark: '#1e8449',
        },
        warning: {
          light: '#fff3cd',
          DEFAULT: '#F39C12',
          dark: '#d68910',
        },
        error: {
          light: '#f8d7da',
          DEFAULT: '#E74C3C',
          dark: '#c0392b',
        },
      },
      fontFamily: {
        heading: ['Outfit', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 8px 24px rgba(0, 0, 0, 0.12)',
        'elevated': '0 4px 16px rgba(0, 0, 0, 0.1)',
        'navbar': '0 1px 4px rgba(0, 0, 0, 0.06)',
        'button': '0 2px 4px rgba(214, 48, 49, 0.3)',
        'button-hover': '0 4px 12px rgba(214, 48, 49, 0.4)',
      },
      borderRadius: {
        'card': '12px',
        'button': '10px',
        'input': '8px',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.5s ease-out forwards',
        'slide-in-right': 'slideInRight 0.4s ease-out forwards',
        'scale-in': 'scaleIn 0.3s ease-out forwards',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'bounce-soft': 'bounceSoft 0.6s ease-out',
        'spin-slow': 'spin 3s linear infinite',
        'shimmer': 'shimmer 1.5s ease-in-out infinite',
        'confetti': 'confetti 0.8s ease-out forwards',
        'counter': 'counter 2s ease-out forwards',
        'check-mark': 'checkMark 0.5s ease-out forwards',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        bounceSoft: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        confetti: {
          '0%': { transform: 'translateY(0) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateY(-100px) rotate(720deg)', opacity: '0' },
        },
        checkMark: {
          '0%': { transform: 'scale(0)', opacity: '0' },
          '50%': { transform: 'scale(1.2)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      screens: {
        'xs': '475px',
      },
    },
  },
  plugins: [],
}
