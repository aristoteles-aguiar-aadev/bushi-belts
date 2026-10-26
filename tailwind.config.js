/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "SF Pro Display",
          "system-ui",
          "sans-serif",
        ],
      },
      colors: {
        apple: {
          bg: "#000000",
          surface: "#1c1c1e",
          elevated: "#2c2c2e",
          separator: "rgba(255, 255, 255, 0.08)",
          "separator-strong": "rgba(255, 255, 255, 0.15)",
          text: "#ffffff",
          secondary: "#8e8e93",
          tertiary: "#636366",
          quaternary: "#48484a",
          accent: "#ffb800",
          "accent-hover": "#ffc933",
          "accent-subtle": "rgba(255, 184, 0, 0.12)",
          "accent-border": "rgba(255, 184, 0, 0.25)",
          success: "#30d158",
          error: "#ff453a",
          warning: "#ffd60a",
        },
      },
      borderRadius: {
        apple: "12px",
        "apple-md": "16px",
        "apple-lg": "20px",
        "apple-xl": "24px",
      },
      boxShadow: {
        apple: "0 2px 8px rgba(0, 0, 0, 0.4)",
        "apple-md": "0 4px 16px rgba(0, 0, 0, 0.5)",
        "apple-lg": "0 8px 32px rgba(0, 0, 0, 0.6)",
        "apple-xl": "0 16px 64px rgba(0, 0, 0, 0.7)",
      },
      transitionTimingFunction: {
        apple: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};
