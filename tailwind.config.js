module.exports = {
  purge: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      spacing: {
        main: "calc(100vh - 3rem - 4rem)", //minus header and footer height
        chatShrink: "calc(50vh - 3rem - 4rem)", // minus header and footer height
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
    extend: {},
  },
  plugins: [],
};
