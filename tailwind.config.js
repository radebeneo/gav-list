/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#1D3F31",
        accent: "#1D3F31",
        background: "#F7F4EC",
        foreground: "#1D3F31",
        card: "#FFFFFF",
        muted: "#EEEAE0",
        "muted-foreground": "#817B70",
        border: "#E8E3D9",
        white: {
          DEFAULT: "#ffffff",
          100: "#fafafa",
          200: "#E8E3D9",
        },
        gray: {
          100: "#817B70",
          200: "#817B70",
        },
        dark: {
          100: "#1D3F31",
        },
        error: "#B5473A",
        success: "#2F7657",
      },
      fontFamily: {
        sans: ["Poppins-Regular", "sans-serif"],
        "sans-light": ["Poppins-Light", "sans-serif"],
        "sans-medium": ["Poppins-Medium", "sans-serif"],
        "sans-semibold": ["Poppins-SemiBold", "sans-serif"],
        "sans-bold": ["Poppins-Bold", "sans-serif"],
        "sans-extrabold": ["Poppins-Bold", "sans-serif"],
        poppins: ["Poppins-Regular", "sans-serif"],
        "poppins-bold": ["Poppins-Bold", "sans-serif"],
        "poppins-semibold": ["Poppins-SemiBold", "sans-serif"],
        "poppins-light": ["Poppins-Light", "sans-serif"],
        "poppins-medium": ["Poppins-Medium", "sans-serif"],
      },
    },
  },
  plugins: [],
};