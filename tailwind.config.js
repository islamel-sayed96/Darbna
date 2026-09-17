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
                // Warm accent for the personal-portfolio pages — used
                // sparingly against the teal brand for CTA contrast.
                accent: {
                    50: '#fff8ec',
                    100: '#ffedc7',
                    200: '#ffd98a',
                    300: '#ffbe4d',
                    400: '#ffa521',
                    500: '#f98307',
                    600: '#dd6002',
                    700: '#b74206',
                    800: '#94330c',
                    900: '#7a2b0d',
                },
            },
            keyframes: {
                blob: {
                    '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
                    '33%': { transform: 'translate(30px, -40px) scale(1.1)' },
                    '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-14px)' },
                },
                marquee: {
                    '0%': { transform: 'translateX(0)' },
                    '100%': { transform: 'translateX(-50%)' },
                },
            },
            animation: {
                blob: 'blob 12s infinite ease-in-out',
                float: 'float 5s infinite ease-in-out',
                marquee: 'marquee 28s linear infinite',
            },
        },
    },

    plugins: [forms],
};
