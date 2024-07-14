/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: (theme) => ({
        "hero-bg": "url('../assets/Hero.jpg')",
      }),
      spacing: {
        150: "150px",
      },
      fontFamily: {
        montserrat: ["Montserrat", "sans-serif"],
        lato: ["Lato", "sans-serif"],
      },
      colors: {
        navy: "#3F497F",
        navyHover: "#37406F",
        yellow: "#F7C04A",
        black: "#282828",
        white: "#F9FAFB",
        bg: "#F4F5F7",
        blueBg: "#C8D1DA",
        gray: "#868484",
        lightGray: "#DEE1EC",
      },
    },
  },
  plugins: [],
};
