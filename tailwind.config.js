module.exports = {
  prefix: "tw-",
  content: ["./src/**/*.js"],
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {},
  },
  plugins: [],
  safelist: [{ pattern: /^tw-/ }],
};
