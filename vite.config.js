import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'

export default defineConfig({
    build: {
        minify: 'terser',
        terserOptions: {
            ecma: 5,
            enclose: true,
            ie8: true,
            safari10: true,
            format: {
                comments: false,
            },
        },
        rollupOptions: {
            "output": {
                entryFileNames: `assets/[name].js`,
                assetFileNames: `assets/[name].[ext]`,
            }
        },
        cssCodeSplit: true
    },
    plugins: [
        laravel({
            input: [
                'resources/js/app.js',
                'resources/css/app.css',
            ],
            refresh: true,
        }),
        cssInjectedByJsPlugin()
    ],
});
