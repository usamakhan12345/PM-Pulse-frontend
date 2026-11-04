/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/lib/**/*.{js,ts,jsx,tsx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f7ff',
          100: '#e0effe',
          500: '#0052cc',
          600: '#0043a8',
          700: '#003585'
        },
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' }
        },
        'glow-pulse': {
          '0%, 100%': { opacity: '0.7' },
          '50%': { opacity: '1' }
        },
        'word-in': {
          '0%': { opacity: '0', transform: 'translateY(0.7em) scale(0.94)', filter: 'blur(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)', filter: 'blur(0)' }
        },
        'fade-only': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' }
        },
        shine: {
          '0%': { transform: 'translateX(-130%) skewX(-20deg)' },
          '55%, 100%': { transform: 'translateX(230%) skewX(-20deg)' }
        },
        'gradient-x': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' }
        },
        'ring-out': {
          '0%': { transform: 'scale(1)', opacity: '0.5' },
          '100%': { transform: 'scale(1.9)', opacity: '0' }
        }
      },
      animation: {
        'fade-up': 'fade-up 0.7s ease-out both',
        float: 'float 8s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 7s ease-in-out infinite',
        'word-in': 'word-in 0.9s cubic-bezier(0.22, 1, 0.36, 1) both',
        'fade-only': 'fade-only 0.9s ease-out both',
        marquee: 'marquee 40s linear infinite',
        shine: 'shine 4.5s ease-in-out infinite',
        'gradient-x': 'gradient-x 6s ease infinite',
        'spin-slow': 'spin 9s linear infinite',
        'ring-out': 'ring-out 2.8s ease-out infinite'
      }
    }
  },
  plugins: []
};
