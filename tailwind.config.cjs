/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        medical: {
          50: "#f0f9ff",
          100: "#e0f2fe",
          200: "#bae6fd",
          500: "#0ea5e9",
          600: "#0284c7",
          900: "#0c4a6e",
        },
        danger: {
          500: "#ef4444",
        },
        success: {
          500: "#10b981",
        },
      },
    },
  },
  plugins: [],
};
