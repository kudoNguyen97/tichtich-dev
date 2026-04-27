import { defineConfig } from 'vite';
import { devtools } from '@tanstack/devtools-vite';
// import contentCollections from '@content-collections/vite';
import tsconfigPaths from 'vite-tsconfig-paths';

import { tanstackRouter } from '@tanstack/router-plugin/vite';

import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';
import svgr from 'vite-plugin-svgr';

const config = defineConfig({
    plugins: [
        devtools(),
        svgr(),
        // contentCollections(),
        tsconfigPaths({ projects: ['./tsconfig.json'] }),
        tailwindcss(),
        tanstackRouter({
            target: 'react',
            autoCodeSplitting: true,
            routesDirectory: './src/routes',
            generatedRouteTree: './src/routeTree.gen.ts',
        }),
        react(),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
});

export default config;
