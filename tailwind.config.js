module.exports = {
  purge: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      spacing: {
        main: "calc(var(--vh, 1vh) * 100 - 3rem - 4rem)", //minus header and footer height
        newMain: "calc(var(--vh, 1vh) * 100 - 3rem - 3rem - 4rem)",
        half: "50vh",
        messageCard: "6rem",
      },
      colors: {
        brand: {
          twitter: "#1da1f2",
          google: "#ea4335",
          github: "#333",
        },
        backdrop: "#ffffff55",
      },
    },
  },
  variants: {
    extend: {
      opacity: ["disabled"],
    },
  },
  plugins: [],
};
