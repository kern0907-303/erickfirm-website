/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        background: '#FFFFFF', // Pure White
        surface: '#F8FAFC',    // Slate 50 (Medical Grey)
        primary: '#0F172A',    // Slate 900 (Deep Navy)
        secondary: '#3B82F6',  // Blue 500 (Quantum Blue)
        accent: '#D4AF37',     // Champagne Gold (Wealth Frequency)
        text: '#334155',       // Slate 700 (Comfort Grey)
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'serif'], // Elegant headers
      },
      boxShadow: {
        'soft': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)', // Medical clean look
      }
    },
  },
  plugins: [require("daisyui")],
  daisyui: { themes: ["light"] },
      },
    ],
  },
}