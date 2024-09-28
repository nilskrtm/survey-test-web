import defaultTheme from 'tailwindcss/defaultTheme';
import tailwindForms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    container: {
      center: true,
      padding: '15px'
    },
    screens: {
      '2xl': { max: '1535px' },
      // => @media (max-width: 1535px) { ... }
      xl: { max: '1279px' },
      // => @media (max-width: 1279px) { ... }
      lg: { max: '1023px' },
      // => @media (max-width: 1023px) { ... }
      md: { max: '767px' },
      // => @media (max-width: 767px) { ... }
      sm: { max: '639px' },
      ...defaultTheme.screens
    },
    extend: {
      backgroundImage: {
        'input-checked': "url('../resources/icons/input_faCheckSolid.svg')",
        'input-crossed': "url('../resources/icons/input_faCrossSolid.svg')"
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif']
      }
    }
  },
  plugins: [
    tailwindForms({
      /* strategy: 'base', */ // -> only generate global styles
      strategy: 'class' // only generate classes
    }),
    function ({ addComponents }) {
      addComponents({
        '.container': {
          maxWidth: '100%',
          '@screen sm': {
            maxWidth: '576px'
          },
          '@screen md': {
            maxWidth: '720px'
          },
          '@screen lg': {
            maxWidth: '960px'
          },
          '@screen xl': {
            maxWidth: '1140px'
          },
          '@screen 2xl': {
            maxWidth: '1140px'
          }
        },
        '.modal': {
          maxWidth: '300px',
          '@screen sm': {
            maxWidth: '300px'
          },
          '@screen md': {
            maxWidth: '500px'
          },
          '@screen lg': {
            maxWidth: '800px'
          },
          '@screen xl': {
            maxWidth: '1140px'
          },
          '@screen 2xl': {
            maxWidth: '1140px'
          }
        }
      });
    }
  ]
};
