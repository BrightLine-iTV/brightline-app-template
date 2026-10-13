/**
 * Resolves a path to a static asset in the `public/` folder against the app's
 * configured base URL (Vite `base`), so assets load correctly whether the app
 * is served from the root, a sub-path, or a CDN.
 *
 * Accepts paths with or without a leading slash and avoids producing a double
 * slash when joined with the base (which itself always ends in `/`).
 */
export function assetUrl(path: string): string {
    const base = import.meta.env.BASE_URL;
    return `${base}${path.replace(/^\//, '')}`;
}
