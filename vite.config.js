import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
    // server: {
    //     host: '192.168.1.78',
    //     port: 5173,
    // },
    plugins: [
        laravel({
            // input: 'resources/js/app.jsx',
            input: ['resources/js/app.jsx', 'resources/css/app.css'],
            refresh: true,
        }),
        react(),
    ],
    resolve: {
        alias: {
            '@ziggy': path.resolve(__dirname, 'vendor/tightenco/ziggy'),
        },
    },
});
