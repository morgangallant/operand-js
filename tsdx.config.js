const postcss = require('rollup-plugin-postcss');
const autoprefixer = require('autoprefixer');
const tailwindcss = require('tailwindcss');
module.exports = {
  rollup(config, options) {
    config.plugins.push(
      postcss({
        plugins: [
          tailwindcss({
            mode: 'jit',
            content: ['./src/*.{ts,tsx,js,jsx}', './src/**/*.{ts,tsx,js,jsx}'],
            darkMode: 'media',
            theme: {
              extend: {},
            },
            variants: {
              extend: {},
            },
            plugins: [require('tailwind-scrollbar-hide')],
          }),
          autoprefixer(),
        ],
        inject: true,
        // only write out CSS for the first bundle (avoids pointless extra files):
        extract: !!options.writeMeta,
      })
    );
    return config;
  },
};
