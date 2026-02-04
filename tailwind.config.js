/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./layout/**/*.liquid",
    "./templates/**/*.liquid",
    "./sections/**/*.liquid",
    "./snippets/**/*.liquid",
    "./assets/**/*.js",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Gotham", "system-ui", "-apple-system", "Segoe UI", "Roboto", "Arial", "sans-serif"],
      },
      colors: {
        primary: "rgb(var(--color-primary-rgb) / <alpha-value>)",
        secondary: "rgb(var(--color-secondary-rgb) / <alpha-value>)",
        background: "rgb(var(--color-background-rgb) / <alpha-value>)",
        "background-secondary": "rgb(var(--color-background-secondary-rgb) / <alpha-value>)",
        "background-third": "rgb(var(--color-background-third-rgb) / <alpha-value>)",
        border: "rgb(var(--color-border-rgb) / <alpha-value>)",
        neutral: "rgb(var(--color-neutral-rgb) / <alpha-value>)",
        gray: "rgb(var(--color-gray-rgb) / <alpha-value>)",
      },
    },
  },
  plugins: [],
};
