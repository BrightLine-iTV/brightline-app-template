# brightline-app-template

Starting point for BrightLine front-end apps: React 19, TypeScript, Vite 8,
Tailwind 4 with the BrightLine design tokens, shared UI primitives, ESLint +
Prettier, and the S3 deploy workflow.

## Start a new app

On GitHub: **Use this template → Create a new repository**, or locally:

```bash
npx degit BrightLine-iTV/brightline-app-template my-new-app
cd my-new-app && git init
npm install
npm run dev
```

Then follow "First things to do in a new app" at the bottom of `CLAUDE.md`
(rename the package, drop the demo page, set `APP_BASE` only if deploying under a sub-path).

## What's inside

| Path                           | Purpose                                                                               |
| ------------------------------ | ------------------------------------------------------------------------------------- |
| `src/styles/theme.css`         | Design tokens (palette, type scale, shadows, motion). Edit here, never in components. |
| `src/components/UIPrimitives`  | Button, IconButton, Badge, Modal, Select, SegmentedControl, AnchoredPopover, toasts   |
| `src/pages/home`               | Demo page showing every primitive, replace it                                         |
| `src/store`                    | Example Zustand store                                                                 |
| `vite.config.ts`               | `APP_BASE` (defaults to `/`), svgr icons, dev `/api` proxy                            |
| `.github/workflows/deploy.yml` | Build on push to `main`, upload to S3                                                 |
| `CLAUDE.md`                    | Rules Claude Code follows in this repo                                                |

## Working with Claude

`CLAUDE.md` is loaded automatically by Claude Code, so generated code follows
the stack, TypeScript, Tailwind and component rules. Keep it current as the
app grows: it is the single source of truth for conventions.

## Scripts

`npm run dev` · `build` · `lint` · `format` · `preview`
