import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';

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
            typography: ({ theme }) => ({
                DEFAULT: {
                    css: {
                        '--tw-prose-links': theme('colors.brand[600]'),
                        '--tw-prose-bold': theme('colors.gray[900]'),
                        '--tw-prose-quotes': theme('colors.brand[700]'),
                        '--tw-prose-quote-borders': theme('colors.brand[300]'),
                        '--tw-prose-bullets': theme('colors.brand[500]'),
                        '--tw-prose-counters': theme('colors.brand[600]'),
                        'img': {
                            borderRadius: theme('borderRadius.lg'),
                            boxShadow: theme('boxShadow.md'),
                        },
                        'blockquote': {
                            backgroundColor: theme('colors.brand[50]'),
                            borderInlineStartWidth: '4px',
                            padding: '0.75rem 1rem',
                            borderRadius: theme('borderRadius.md'),
                            fontStyle: 'normal',
                        },
                    },
                },
                invert: {
                    css: {
                        '--tw-prose-invert-links': theme('colors.brand[400]'),
                        '--tw-prose-invert-bold': theme('colors.gray[100]'),
                        '--tw-prose-invert-quotes': theme('colors.brand[300]'),
                        '--tw-prose-invert-quote-borders': theme('colors.brand[700]'),
                        '--tw-prose-invert-bullets': theme('colors.brand[400]'),
                        '--tw-prose-invert-counters': theme('colors.brand[400]'),
                        'blockquote': {
                            backgroundColor: 'rgb(28 127 122 / 0.15)',
                        },
                    },
                },
            }),
        },
    },

    plugins: [forms, typography],
};
