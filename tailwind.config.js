module.exports = {
  mode: 'jit',
  content: ['./src/*.{ts,tsx,js,jsx}', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {},
  },
  plugins: [require('tailwind-scrollbar-hide')],
};
