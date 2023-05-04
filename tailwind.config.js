module.exports = {
  mode: 'jit',
  purge: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: '#00AA13',
      },
    },
  },
  variants: {},
  plugins: [
    require('daisyui')
  ],
}
