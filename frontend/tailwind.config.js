/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'ios-gray': '#F5F5F7',
        'ios-blue': '#007AFF',
        'ios-purple': '#5856D6',
        'ios-text': '#1D1D1F',
        'ios-secondary': '#86868B',
      },
      fontFamily: {
        'sf': ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'Inter', 'sans-serif'],
      },
      borderRadius: {
        'ios': '16px',
      },
      boxShadow: {
        'ios': '0 10px 40px rgba(0, 0, 0, 0.1)',
        'ios-sm': '0 4px 20px rgba(0, 0, 0, 0.08)',
      }
    },
  },
  plugins: [],
}
