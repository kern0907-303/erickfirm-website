/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#FFFFFF', // Pure White
        surface: '#F4F9FA',    // Tiffany Grey/Off-white
        primary: '#002A54',    // BCG Deep Navy
        secondary: '#00509D',  // Consulting Blue
        accent: '#00C2C2',     // Tiffany Blue
        text: '#1E293B',       // Slate 800 (Comfort Grey)
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Lora', 'Playfair Display', 'serif'], // Elegant headers
      },
      boxShadow: {
        'soft': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)', // Medical clean look
      }
    },
  },
  plugins: [require("daisyui")],
  daisyui: { 
    themes: ["light"] 
  },
}
