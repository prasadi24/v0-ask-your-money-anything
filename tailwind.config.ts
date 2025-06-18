import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        brand: {
          gold: "hsl(45, 93%, 47%)",
          indigo: "hsl(231, 48%, 20%)",
          lightgold: "hsl(45, 93%, 85%)",
          darkindigo: "hsl(231, 48%, 15%)",
        },
        artha: {
          50: "hsl(45, 93%, 97%)",
          100: "hsl(45, 93%, 94%)",
          200: "hsl(45, 93%, 87%)",
          300: "hsl(45, 93%, 78%)",
          400: "hsl(45, 93%, 67%)",
          500: "hsl(45, 93%, 47%)", // Primary gold
          600: "hsl(45, 93%, 38%)",
          700: "hsl(45, 93%, 29%)",
          800: "hsl(45, 93%, 20%)",
          900: "hsl(45, 93%, 12%)",
        },
        indigo: {
          50: "hsl(231, 48%, 97%)",
          100: "hsl(231, 48%, 94%)",
          200: "hsl(231, 48%, 87%)",
          300: "hsl(231, 48%, 78%)",
          400: "hsl(231, 48%, 67%)",
          500: "hsl(231, 48%, 50%)",
          600: "hsl(231, 48%, 40%)",
          700: "hsl(231, 48%, 30%)",
          800: "hsl(231, 48%, 20%)", // Primary indigo
          900: "hsl(231, 48%, 12%)",
        },
        navy: {
          50: "hsl(217, 91%, 97%)",
          100: "hsl(217, 91%, 94%)",
          200: "hsl(217, 91%, 87%)",
          300: "hsl(217, 91%, 78%)",
          400: "hsl(217, 91%, 67%)",
          500: "hsl(217, 91%, 60%)",
          600: "hsl(217, 91%, 48%)",
          700: "hsl(217, 91%, 36%)",
          800: "hsl(217, 91%, 24%)",
          900: "hsl(217, 91%, 12%)",
        },
        financial: {
          primary: "hsl(217, 91%, 24%)", // Navy blue
          secondary: "hsl(217, 91%, 60%)", // Blue
          accent: "hsl(173, 58%, 39%)", // Teal
          gold: "hsl(45, 93%, 47%)", // Gold accent
          success: "hsl(142, 76%, 36%)", // Green
          warning: "hsl(45, 93%, 47%)", // Gold
          danger: "hsl(0, 84%, 60%)", // Red
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
export default config
