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
        sofa: "url('../assets/sofa.png')",
        lamp: "url('../assets/Lamp-Collection.png')",
        cups: "url('../assets/cups.png')",
        banner: "url('../assets/banner.png')",
      }),
      spacing: {
        150: "150px",
        75: "75px",
      },
      screens: {
        lg: "940px",
        xl: "1140px",
        md: "880px",
        sm: "520px",
      },
      fontFamily: {
        montserrat: "var(--font-mont)",
        lato: "var(--font-lato)",
      },
      colors: {
        navy: "#3F497F",
        navyHover: "#37406F",
        yellow: "#F7C04A",
        black: "#282828",
        white: "#F9FAFB",
        bg: "#F4F5F7",
        blueBg: "#C8D1DA",
        gray: "#BBBCBE",
        grayHover: "#B6B7B9",
        lightGray: "#DEE1EC",
        beige: "#F3F3F3",
        input: "#ECEDEF",
      },
      gridTemplateColumns: {
        18: "repeat(18, minmax(0, 1fr))",
      },
    },
  },
  plugins: [],
};