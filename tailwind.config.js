/** @type {import('tailwindcss').Config} */
export default {
  important: true,
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        sm: '480px',
        md: '768px',
        lg: '976px',
        xl: '1440px',
      },
      textColor: {
      'blue': '#004F9F',
      'blue-light': '#e8f7ff',
      'green': 'rgba(101, 196, 47, 1)',
      'black': 'rgba(32, 32, 32, 1)',
    },
      colors: {
        black: '#000000',
        blue: '#004F9F', // Assuming a specific shade of blue from the button
        green: 'rgba(101, 196, 47, 1)', // Assuming a specific shade of green
        'navy-blue': '#0C1A2A', // Assuming the navbar background color
        'light-gray': '#F0F4F8', // Assuming the background color
        'header-blue': '#E6F0FA', // Assuming a light blue background color for header
        'btn-blue': '#007BFF', // Assuming button blue color
        'link-color': 'rgba(0, 61, 130, 1)', // Custom link color
        'link-hover': '#004F9F', // Custom link hover color
      },
      fontFamily: {
        'frutiger': ['Frutiger Neue LT Pro', 'sans-serif'],
      },
      extend: {
        spacing: {
          '128': '32rem',
          '144': '36rem',
        },
        borderRadius: {
          '4xl': '2rem',
        }
      },
    },
  },
  plugins: [],
}