# My V0 Project

## What this project is (my analysis)

This is a modern Next.js application using the app/ directory (Next 13+ app router). It’s written in TypeScript and uses pnpm as the package manager (there's a `pnpm-lock.yaml`). The project includes a design/system-like collection of UI primitives under `components/ui`, a small set of page routes under `app/` (including `admin`, `dashboard`, `resources`, `schedule`, `support-group`), and a few top-level utilities/hooks in `hooks/` and `lib/`.

Key observations:
- Next.js (version 16) + React 19 are declared in `package.json`.
- TailwindCSS + PostCSS are configured (presence of `postcss.config.mjs` and `tailwindcss` devDependency). Styles live under `styles/` and `app/globals.css`.
- A large set of Radix UI primitives and other UI helpers (lucide-react, sonner, class-variance-authority, etc.) are used — the project contains a component-library-style folder `components/ui/` with many primitives.
- Auth and data contexts exist in `lib/` (`auth-context.tsx`, `data-context.tsx`) which indicates client-side context providers are used for authentication and data.
- The app is scaffolded around route pages in the `app/` directory rather than the legacy `pages/` directory.

Assumptions I made (based on repository layout):
- Use `pnpm` to install and run. Node 18+ is recommended for Next 16 / React 19.
- There are no automated tests present in the workspace (no `test` script in `package.json`).


## Tech stack

- Next.js 16 (app router)
- React 19
- TypeScript
- TailwindCSS + PostCSS
- Radix UI primitives and other UI libraries (lucide-react, sonner, recharts, etc.)
- pnpm (lockfile present)


## Project structure (high level)

- app/
  - layout.tsx, page.tsx (root)
  - admin/, dashboard/, resources/, schedule/, support-group/ (route pages)
  - globals.css
- components/
  - navbar.tsx, theme-provider.tsx
  - ui/ — many UI primitives (button, input, dialog, toast, table, etc.)
- hooks/
  - use-mobile.ts, use-toast.ts
- lib/
  - auth-context.tsx, data-context.tsx, utils.ts
- public/
- styles/
  - globals.css
- package.json, pnpm-lock.yaml, tsconfig.json, postcss.config.mjs, next.config.mjs


## Scripts (from package.json)

- dev: `next dev`
- build: `next build`
- start: `next start`
- lint: `eslint .`


## How to run (Windows PowerShell)

Open a PowerShell terminal in the project root and run:

```powershell
# install dependencies (pnpm is recommended since pnpm-lock.yaml is present)
pnpm install

# start dev server
pnpm dev
```

By default Next will run on http://localhost:3000 unless configured otherwise.

Build for production:

```powershell
pnpm build
pnpm start
```

Run the linter:

```powershell
pnpm lint
```

Run TypeScript type checks (not present as a script; run manually):

```powershell
pnpm dlx tsc --noEmit
```

(If you prefer, you can add a `type-check` script to `package.json`: `tsc --noEmit`.)


## Developer notes & recommendations

- Add a small `.env.example` listing required env vars (if the app expects runtime secrets). Keep secrets out of source.
- Add a `type-check` script to `package.json` and a `format` script if you use Prettier.
- Add basic CI (GitHub Actions) to run `pnpm install`, `pnpm lint`, `pnpm build`, and `pnpm dlx tsc --noEmit` on push.
- If you plan to publish the component primitives as a separate package, consider moving `components/ui/` into its own package or workspace.
- Add unit/integration tests when components have logic (Jest/Testing Library or Vitest) — currently there’s no `test` script.


## Contributing

- Follow existing TypeScript and code style.
- Run `pnpm lint` before committing.
- Open PRs against `main` (or your chosen default branch) and include a short description and testing steps.


## License

Add a `LICENSE` file to declare a license for the project. None is included in the repository snapshot I analyzed.


---

If you'd like, I can:
- add a `type-check` script to `package.json` and commit it,
- add a minimal `.github/workflows/ci.yml` to validate builds and lint on PRs,
- or generate a short `.env.example` if you tell me what env vars the app expects.

