/** @type {import('tailwindcss').Config} */
import { colors } from "./src/utils/colors.js";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: colors,
    },
  },
  plugins: [],
};
