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
            colors: {
                mainD: '#5F1415',
                main: '#741D20',
                high: '#F0C519',
                highHover: '#F5D93C',
            },
            fontFamily: {
                copperplate: [
                    'CopperplateGothicRegular',
                    'Arial',
                    'sans-serif',
                ],
                times: ['Times New Roman', 'serif'],
                oldenglish: ['OldEnglish', 'serif'],
            },
        },
    },

    plugins: [forms],
};
