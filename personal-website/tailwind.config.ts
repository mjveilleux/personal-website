import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", ...fontFamily.sans],
      },
      animation: {
        'gradient-x': 'gradient-x 3s ease infinite',
        'float': 'float 1s ease-out forwards',
      },
      keyframes: {
        'gradient-x': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'float': {
          '0%': { opacity: '0', transform: 'translate(0, 0)' },
          '50%': { opacity: '1', transform: 'translate(var(--tw-translate-x, 0), -10px) scale(1.5)' },
          '100%': { opacity: '0', transform: 'translate(var(--tw-translate-x, 0), -20px) scale(0)' },
        }
      },
      backgroundSize: {
        '200%': '200% 200%',
      },
    },
  },
  plugins: [],
} as Config;