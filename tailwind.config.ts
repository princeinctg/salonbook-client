import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        roseGold: {
          DEFAULT: "#C98573",
          50: "#FAF3F1",
          100: "#F4E5E1",
          200: "#E9CCC4",
          300: "#DEAFAF",
          400: "#D39788",
          500: "#C98573",
          600: "#B86B57",
          700: "#995341",
          800: "#7A4234",
          900: "#5D3227",
        },
        champagne: {
          DEFAULT: "#E8C5A8",
          50: "#FAF6F2",
          100: "#F4ECE3",
          200: "#ECDAC8",
          300: "#E8C5A8",
          400: "#DCB08B",
          500: "#D09B6E",
          600: "#B67F4F",
          700: "#8F623C",
          800: "#68472B",
          900: "#432E1C",
        },
        ivory: {
          DEFAULT: "#F8F1E8",
          100: "#FFFFFF",
          200: "#FAF6F1",
          300: "#F8F1E8",
          400: "#EFE3D5",
          500: "#E3D3C1",
        },
        charcoal: {
          DEFAULT: "#201C1B",
          50: "#4D4644",
          100: "#413B39",
          200: "#342F2E",
          300: "#292423",
          400: "#201C1B",
          500: "#161312",
        },
        deepBrown: {
          DEFAULT: "#302522",
          50: "#6D554F",
          100: "#5E4943",
          200: "#4E3C37",
          300: "#3F302C",
          400: "#302522",
          500: "#221A18",
        },
        warmBg: "#F7F3EE",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        serif: ["var(--font-playfair)", "serif"],
      },
    },
  },
  plugins: [],
};
export default config;
