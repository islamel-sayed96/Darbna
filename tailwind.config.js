import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Cairo', 'Figtree', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                // Darbna brand palette — a deep teal, distinct from other
                // Arabic learning platforms' green/red identities.
                brand: {
                    50: '#eefcfb',
                    100: '#d5f5f2',
                    200: '#aeeae5',
                    300: '#79d9d1',
                    400: '#42bdb3',
                    500: '#279f98',
                    600: '#1c7f7a',
                    700: '#1a6663',
                    800: '#1a5250',
                    900: '#194544',
                    950: '#092827',
                },
            },
        },
    },

    plugins: [forms],
};
