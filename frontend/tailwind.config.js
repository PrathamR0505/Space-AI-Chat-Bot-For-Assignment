/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        space: {
          dark: '#080B18',        // Main background
          secondary: '#101629',   // Secondary background
          card: '#151D35',        // Card background
          'card-hover': '#1B2442',
          border: 'rgba(118, 103, 255, 0.18)',
          'border-bright': 'rgba(39, 197, 245, 0.35)',
        },
        accent: {
          primary: '#7667FF',     // Primary accent
          cyan: '#27C5F5',        // Secondary accent
          purple: '#B78AFF',      // Highlight
          glow: 'rgba(118, 103, 255, 0.4)',
        },
        text: {
          primary: '#F5F7FF',     // Primary text
          secondary: '#9CA9C8',   // Secondary text
          muted: '#627193',
        }
      },
      fontFamily: {
        space: ['"Space Grotesk"', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'pulse-glow': 'pulseGlow 4s ease-in-out infinite',
        'orbit-slow': 'orbit 20s linear infinite',
        'float-slow': 'float 6s ease-in-out infinite',
        'twinkle': 'twinkle 3s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.05)' },
        },
        orbit: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        twinkle: {
          '0%, 100%': { opacity: '0.3', transform: 'scale(0.8)' },
          '50%': { opacity: '1', transform: 'scale(1.2)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        }
      },
      boxShadow: {
        'cosmic': '0 0 25px -5px rgba(118, 103, 255, 0.25)',
        'cosmic-cyan': '0 0 25px -5px rgba(39, 197, 245, 0.25)',
        'cosmic-lg': '0 0 50px -10px rgba(118, 103, 255, 0.35)',
        'card-glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
