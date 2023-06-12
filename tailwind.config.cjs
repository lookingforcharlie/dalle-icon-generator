// @ts-nocheck
/** @type {import('tailwindcss').Config} */
const config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    // colors: {
    //   primary: "#1D373D",
    //   secondary: "#EDCEAD",
    //   // ...
    // },
    fontFamily: {
      sans: ["Inter", "sans-serif"],
    },
    extend: {},
  },
  plugins: [],
  // plugins: [require("flowbite/plugin")],
};

module.exports = config;
