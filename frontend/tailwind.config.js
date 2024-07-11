/** @type {import('
 * tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      backgroundImage: {
        authcover: "url('/bg.png')",
        profile: "url('/profile.png')",
      },
      colors: {
        green: {
          50: '#EDF9DD',
          100: '#D2F0A8',
          200: '#BEE981',
          300: '#AEE463',
          400: '#9ADD3C',
          500: '#8FD926',
          600: '#71A824',
          700: '#557E1B',
          800: '#3B5813',
          900: '#223409',
        },
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
