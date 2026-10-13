# BrightLine app: conventions for Claude

This repo started from `brightline-app-template`. Follow these rules in every
change. They match the lint/TS config, so `npm run lint` and `npm run build`
must pass before you call a task done.

## Commands

- `npm install` · `npm run dev` · `npm run build` (runs `tsc -b` then Vite) ·
  `npm run lint` · `npm run format`
- Node 20+ (`.nvmrc`). Verify with `npm run lint && npm run build`; there is no test runner yet.

## Stack (don't swap these out)

React 19 + TypeScript 5.9 + Vite 8 · Tailwind CSS 4 (`@tailwindcss/vite`) ·
Heroicons · Zustand 5 · React Router 7 · Inter Variable font.
Add a dependency only when the stack above can't do the job, and say why.

## TypeScript

- `strict`, `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`.
- `verbatimModuleSyntax`: type-only imports use `import type` / `type X` inline.
- `erasableSyntaxOnly`: **no `enum`, no `namespace`, no constructor parameter
  properties.** Use string-literal unions (`type Tone = 'a' | 'b'`) and `as const` objects.
- No `any`. Prefer `unknown` + narrowing. No non-null `!` except for `document.getElementById('root')`.
- Function components only, declared as `function Name(props): ReactElement`
  with an explicit `Props` type. `ref` is a normal prop (React 19): no `forwardRef`.
- Variant props are typed unions backed by a `Record<Variant, string>` class map
  (see `components/UIPrimitives/Button.tsx`).
- One default export per component file, named exports for hooks/utilities, and
  an `index.ts` barrel per component folder.

## Styling: Tailwind 4

- Tokens live in **`src/styles/theme.css`** (`@theme`). There is no
  `tailwind.config.js` or PostCSS config; don't add one.
- The default Tailwind palette is disabled. Only these colors exist:
  `primary`, `secondary`, `tertiary`, `success`, `error`, `warning`, `neutral`
  (steps 10–90; bare name = the default step), plus `white`, `black`, `scrim`,
  `canvas`. Example: `bg-primary-50 text-neutral-90 border-neutral-30`.
- Use the type scale (`text-3xs` … `text-xl`), shadows (`shadow-hairline|toolbar|popover|dialog`)
  and animations (`animate-fade-in|dialog-in|popover-in|toast-in`) from the theme.
- **No arbitrary values** (`text-[13px]`, `bg-[#123456]`, `w-[317px]`). If a value
  is missing, add a token to `theme.css` instead.
- No inline `style` for static looks, no CSS modules, no styled-components.
- Class order is automatic (`prettier-plugin-tailwindcss`): run `npm run format`.

## Icons

- `@heroicons/react`: `24/outline` for buttons and navigation, `20/solid` for
  dense UI (menus, selects). Size with `size-4` / `size-5`.
- An icon Heroicons lacks: add an `.svg` under `components/UIPrimitives/icons/`
  (colors = `currentColor`) and export it with `?react` (see that folder's `index.ts`).
- Icons are decorative: don't add visible labels via icons alone; give the
  button an accessible name (`IconButton` requires `label`).

## UI components

- **Reuse `components/UIPrimitives` before writing new UI**: Button, IconButton,
  Badge, Modal, Select, SegmentedControl, AnchoredPopover, `toast`/`<Toaster />`.
  Import from the barrel: `import { Button } from '../../components/UIPrimitives'`.
- Need a new shared primitive? Add it there, with the same shape: typed variants,
  `className` passthrough, focus ring, `aria-*`, exported from `index.ts`.
- Accessibility baseline: real `<button>`/`<a>`, visible focus
  (`focus-visible:ring-2 focus-visible:ring-primary-50/40`), dialogs via `Modal`.

## Structure

```
src/
  pages/<name>/        route-level screens: index.ts + <Name>Page.tsx (lazy-loaded in App.tsx)
  components/<Area>/   feature components, grouped by feature
  components/UIPrimitives/   shared design-system pieces
  store/               Zustand stores: use<Name>Store.ts, re-exported from index.ts
  styles/theme.css     design tokens
  utils/               pure helpers (assetUrl.ts for public/ assets)
  types/               shared types and ambient declarations
```

- State: local `useState` first; Zustand for state shared across distant
  components. Select slices (`useXStore((s) => s.x)`), never the whole store.
- Static files in `public/` are referenced with `assetUrl('img/logo.png')`,
  never a hard-coded absolute `/img/...` path (the app may be served under a sub-path).
- Routes go in `App.tsx`; every page is `lazy()`-loaded.

## Formatting

Prettier decides: 4 spaces, single quotes, semicolons, 80 columns, ES5 trailing
commas. ESLint extends `typescript-eslint` recommended, `react-hooks`,
`react-refresh`, `tailwindcss`. Don't disable rules inline without a comment saying why.

## Deploy

Push to `main` → `.github/workflows/deploy.yml` builds and uploads `dist` to S3
through the shared `frontend-analytics-configs` workflow (needs the
`AWS_S3_BUCKET` variable and `WH_PRIVATE_KEY` secret). The app is served from `/` by default;
for a sub-path set `APP_BASE` once in `vite.config.ts`.

## First things to do in a new app

1. Set `APP_BASE` in `vite.config.ts` only if deploying under a sub-path; set the `name` in `package.json`; update `<title>` in `index.html`.
2. Replace `pages/home` and delete `store/useCounterStore.ts`.
3. Delete the `/api` proxy in `vite.config.ts` if there is no backend.
4. Edit this file: replace this section with notes on what the app does.
