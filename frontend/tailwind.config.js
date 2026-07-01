/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      animation: {
        'spin-slow': 'spin 16s linear infinite',
        'rain-fast': 'epicRainFast 0.5s linear infinite',
        'rain-medium': 'epicRainMedium 0.8s linear infinite',
        'snow-swirl': 'epicSnowSwirl 6s ease-in-out infinite',
        'mist-breathe': 'epicMist 25s ease-in-out infinite',
        'lightning-flash': 'epicLightning 6s ease-in-out infinite',
        'solar-pulse': 'epicSolar 12s ease-in-out infinite',
      },
      keyframes: {
        epicRainFast: {
          '0%': { transform: 'translateY(-120vh) translateX(0px) rotate(12deg)' },
          '100%': { transform: 'translateY(120vh) translateX(-80px) rotate(12deg)' }
        },
        epicRainMedium: {
          '0%': { transform: 'translateY(-120vh) translateX(0px) rotate(10deg)' },
          '100%': { transform: 'translateY(120vh) translateX(-50px) rotate(10deg)' }
        },
        epicSnowSwirl: {
          '0%': { transform: 'translateY(-10vh) translateX(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(50vh) translateX(40px) rotate(180deg)' },
          '100%': { transform: 'translateY(110vh) translateX(-20px) rotate(360deg)' }
        },
        epicMist: {
          '0%, 100%': { transform: 'translateX(-10%) translateY(0px) scale(1)' },
          '50%': { transform: 'translateX(10%) translateY(20px) scale(1.05)' }
        },
        epicLightning: {
          '0%, 94%, 96%, 98%, 100%': { opacity: 0, filter: 'blur(0px)' },
          '95%': { opacity: 0.35, backgroundColor: '#f0f9ff', filter: 'blur(2px)' },
          '97%': { opacity: 0.55, backgroundColor: '#e0f2fe', filter: 'blur(0px)' }
        },
        epicSolar: {
          '0%, 100%': { opacity: 0.12, transform: 'scale(1) translate(0px, 0px)' },
          '50%': { opacity: 0.28, transform: 'scale(1.2) translate(30px, 15px)' }
        }
      }
    },
  },
  plugins: [],
}