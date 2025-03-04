/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'slideDownFade': 'slideDownFade 0.2s ease-out',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        slideDownFade: {
          '0%': { 
            opacity: '0',
            transform: 'translateY(10px)'
          },
          '100%': { 
            opacity: '1',
            transform: 'translateY(0)'
          },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' }
        },
      },
      colors: {
        primary: {
          DEFAULT: "#4f46e5", // Indigo-600 to match your existing theme
          foreground: "#ffffff",
        }
      }
    },
  },
  variants: {
    extend: {
      appearance: ['hover', 'focus'],
    },
  },
  safelist: [
    'touch-none'
  ],
  plugins: [
    require('@tailwindcss/forms'),
  ],
}