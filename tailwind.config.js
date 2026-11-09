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
        // 首頁與 /i8 的設計系統色票（數值定義在 src/index.css 的 :root）
        ef: {
          ink: 'var(--ef-ink)',
          body: 'var(--ef-body)',
          text: 'var(--ef-text)',
          muted: 'var(--ef-muted)',
          line: 'var(--ef-line)',
          paper: 'var(--ef-paper)',
          warm: 'var(--ef-warm)',
          cream: 'var(--ef-cream)',
          sage: 'var(--ef-sage)',
          mint: 'var(--ef-mint)',
          stone: 'var(--ef-stone)',
          sand: 'var(--ef-sand)',
          card: 'var(--ef-card)',
          tag: 'var(--ef-tag)',
        },
        i8: {
          deep: 'var(--i8-deep)',
          accent: 'var(--i8-accent)',
          mist: 'var(--i8-mist)',
          tint: 'var(--i8-tint)',
          bg: 'var(--i8-bg)',
          card: 'var(--i8-card)',
          soft: 'var(--i8-soft)',
        },
      },
      fontSize: {
        // 字級系統：區塊標題、卡片標題、導言段落，依螢幕寬度平滑縮放
        'ef-display': ['clamp(2.125rem, 1.4rem + 2.9vw, 3.75rem)', { lineHeight: '1.38', letterSpacing: '-0.01em' }],
        'ef-section': ['clamp(1.875rem, 1.3rem + 2.1vw, 3.25rem)', { lineHeight: '1.32', letterSpacing: '-0.01em' }],
        'ef-statement': ['clamp(1.375rem, 1.05rem + 1.3vw, 2.25rem)', { lineHeight: '1.75' }],
        'ef-title': ['clamp(1.1875rem, 1.1rem + 0.35vw, 1.375rem)', { lineHeight: '1.5' }],
        'ef-lead': ['clamp(1.0625rem, 1rem + 0.3vw, 1.1875rem)', { lineHeight: '1.95' }],
        'ef-copy': ['1rem', { lineHeight: '1.95' }],
        'ef-small': ['0.875rem', { lineHeight: '1.8' }],
      },
      spacing: {
        'ef-section': 'var(--ef-section-pad)',
      },
      borderRadius: {
        'ef-card': 'var(--ef-radius-card)',
        'ef-control': 'var(--ef-radius-control)',
      },
      fontFamily: {
        sans: ['"Noto Sans TC"', '"PingFang TC"', '"Microsoft JhengHei"', 'sans-serif'],
        display: ['Sora', '"Noto Sans TC"', 'sans-serif'],
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
