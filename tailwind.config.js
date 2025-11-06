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
      colors: {
        primary: "var(--color-primary)",
        secondary: "var(--color-secondary)",
        background: "var(--color-background)",
        "background-secondary": "var(--color-background-secondary)",
        "background-third": "var(--color-background-third)",
        border: "var(--color-border)",
        neutral: "var(--color-neutral)",
        gray: "var(--color-gray)",
      },
    },
  },
  plugins: [],
};
