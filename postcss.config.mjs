// postcss.config.mjs (ou .js)
export default {
  plugins: {
    tailwindcss: {}, // C'est la clé ici ! Pas @tailwindcss/postcss
    autoprefixer: {},
  },
};