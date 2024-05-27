/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors');

module.exports = {
  content: ['./src/**/*.{html,js,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: colors.blue[100],
        textPrimary: colors.green[800],
        error: colors.pink[500],

        secondary: colors.purple[100],
        textSecondary: colors.purple[900],

        darkPrimary: colors.blue[900],
        darkTextPrimary: colors.blue[100],

        darkSecondary: colors.purple[900],
        darkTextSecondary: colors.purple[100]
      },
      gridTemplateRows: {
        // Simple 50 column grid
        50: 'repeat(50, minmax(0, 1fr))'
      },
      gridTemplateColumns: {
        // Simple 50 column grid
        50: 'repeat(50, minmax(0, 1fr))'
      }
    }
  },
  plugins: []
};
