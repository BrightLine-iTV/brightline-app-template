import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import svgr from 'vite-plugin-svgr';

/**
 * Where the app is served from. "/" serves at the root (http://localhost:5173/).
 *
 * TODO(new app): if it is deployed under a sub-path, e.g. "/bcl-builder/" for
 * https://tools.brightline.tv/bcl-builder/, set it here (must start and end
 * with "/"). This is the ONLY place to change it: the router basename
 * (src/main.tsx) and asset URLs (src/utils/assetUrl.ts) read it back through
 * `import.meta.env.BASE_URL`.
 *
 * It is a path, not an absolute URL, so the same build works on
 * tools.brightline.tv and on the S3 bucket without rebuilding per host.
 */
const APP_BASE = '/';

export default defineConfig({
    base: APP_BASE,
    plugins: [
        react(),
        tailwindcss(),
        // `import Icon from "./icon.svg?react"` yields a React component; plain
        // .svg imports still resolve to a URL. Icons are decorative (aria-hidden).
        svgr({ svgrOptions: { svgProps: { 'aria-hidden': 'true' } } }),
    ],
    server: {
        proxy: {
            // Remove if the app has no backend.
            '/api': {
                target: 'http://localhost:3001',
                changeOrigin: true,
            },
        },
    },
});
