/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
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
        slack: {
          purple: '#4a154b',
          darkPurple: '#3f0e40',
          activeBg: '#1164a3'
        },
        jira: {
          blue: '#0052cc',
          todo: '#dfe1e6',
          inProgress: '#0052cc',
          review: '#ffab00',
          done: '#36b37e',
          blocked: '#ff5630'
        }
      }
    }
  },
  plugins: []
};
