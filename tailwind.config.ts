import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        'progress': '#fe2c55',
      },
      animation: {
        'zoom-in': 'zoomIn 0.5s ease-in-out',
        'zoom-out': 'zoomOut 0.5s ease-in-out',
        'zoom-in-out': 'zoomInOut 1.5s ease-in-out infinite',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
      },
      keyframes: {
        zoomIn: {
          '0%': {
            transform: 'scale(0.5)',
          },
          '100%': {
            transform: 'scale(1)',
          },
        },
        zoomOut: {
          '0%': {
            transform: 'scale(1)',
          },
          '100%': {
            transform: 'scale(0.5)',
          },
        },
        zoomInOut: {
          '0%': {
            transform: 'scale(1)',   // Bắt đầu ở kích thước bình thường
          },
          '50%': {
            transform: 'scale(1.1)', // Phóng to 20% tại giữa chu kỳ
          },
          '100%': {
            transform: 'scale(1)',   // Quay lại kích thước ban đầu
          },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0' }, // Bắt đầu từ dưới và mờ đi
          '100%': { transform: 'translateY(0)', opacity: '1' },    // Cuối cùng là ở vị trí gốc và hiện lên
        },
        slideDown: {
          '0%': { transform: 'translateY(0%)', opacity: '1' }, // Bắt đầu từ dưới và mờ đi
          '100%': { transform: 'translateY(-100)', opacity: '0' },    // Cuối cùng là ở vị trí gốc và hiện lên
        },
      },
    },
  },
  plugins: [],
}
export default config
