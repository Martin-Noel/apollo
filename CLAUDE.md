# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start the Vite dev server
- `npm run build` — production build (outputs to `dist/`)
- `npm run preview` — preview the production build
- `npm run lint` — ESLint over `src` (`--max-warnings 0`, fails on any warning)

There is no test suite, no test framework configured, and no TypeScript/typecheck step (despite `@types/react`/`@types/react-dom` being installed, the codebase is plain JS/JSX — no `.ts`/`.tsx` files exist). Package manager is npm (only `package-lock.json` is present).

## Architecture

React 18 + Vite app rendering an interactive 3D solar system with `three` / `@react-three/fiber` / `@react-three/drei`. `src/index.jsx` → `src/App.jsx` → `src/pages/Scene.jsx` directly — there is no client-side routing (`react-router-dom` was removed as a dead dependency; nothing imported it) and no Redux (the only thing it drove was a welcome-overlay toggle; both the overlay and Redux were removed entirely, see below).

**`@react-three/drei` is deliberately pinned to `^9.65.4`, do not bump it casually.** Any drei version past 9.75.x drags in a `three-mesh-bvh`/`@monogrid/gainmap-js` chain that requires `three >= 0.151`/`>= 0.159`, but this project is pinned to `three@0.148` — bumping drei alone produces an invalid peer-dependency tree and an unresolved `BatchedMesh` import warning at build time. `npm audit` will suggest fixing a `lodash.pick` vuln in drei via `npm audit fix` and claim it's non-breaking — it isn't; it silently jumps drei into that incompatible range. Fixing it for real means upgrading `three` (and likely `@react-three/fiber`) together, a bigger task requiring real testing, not a routine audit fix.

**Data is served locally, not from the original external API.** The app used to fetch everything from `https://apollo-api.martinnoel.fr/solar-system/solar-system` — that host is now dead (DNS fails). `src/pages/Scene.jsx` fetches `/assets/bodies.json` once and passes the resulting `objects` array down as a prop to `Navbar` (which no longer fetches on its own) — map `bodies[]` by `bodyType` to one generic `<Sun>`/`<Planet>`/`<Moon>` component; there's no per-planet component (no `Mars.jsx`, etc.). Both the `<Canvas>` body list in `Scene.jsx` and the list in `Navbar.jsx` are wrapped in `<Suspense fallback={null}>` since `useGLTF` suspends during load — without it, one missing/slow `.glb` can crash the whole scene instead of just not rendering.

**`public/assets/` is the local data source.** It holds per-body JSON files under `planets/`, `moons/`, `stars/` (each restored from a backup of the original API, one file per body, keyed by French id — e.g. `planets/earth`, `moons/moon`), each folder's `3d/*.glb` and `images/*.png`, and a generated `public/assets/bodies.json` — the combined array Scene.jsx/Navbar.jsx actually fetch. `bodies.json` was built by merging all per-body files, renaming their `3dModel` key to the `model3d` key the components expect, and rewriting `image`/`model3d` URLs from `https://apollo-api.martinnoel.fr/solar-system/...` to local `/assets/...` paths. Note there's also a raw upstream `public/assets/solar-system` file (287 bodies straight from the original open-data API, no `image`/`model3d` fields) — that one isn't fetched by the app; don't confuse it with `bodies.json`. If you need to regenerate `bodies.json` (e.g. after updating a per-body file), redo that same merge/rewrite over all files in `planets/`, `moons/`, and `stars/sun`.

**All state is local, there's no global store.** Redux, the `Home` welcome overlay, and the header's info icon that toggled it were removed entirely (dead weight — Redux only ever drove that one overlay). Selected body (`indexObject`), grouped `moons`, `clicked` (info card open/closed), `isLoading` all live as `useState` in `Scene.jsx`, threaded down via props through `Navbar` → `NavbarItem` → `TurnPlanet`, which bubbles selection back up via callback props.

**Camera focus** (`src/components/Objects/Planet.jsx`) uses two concurrent update mechanisms inside a single `useFrame`: a GSAP tween of `camera.position` toward the selected planet, plus a per-frame `camera.lookAt` recompute. **Orbital motion is a cosmetic approximation, not physics** — rotation/revolution/scale all take real API values (`sideralRotation`, `sideralOrbit`, `meanRadius`, `aphelion`) and divide them by hand-tuned magic-number constants purely to make the scene look right at an arbitrary 3D scale.

**Arrival animation** — `Scene.jsx`'s local `CameraIntro` component (rendered inside `<Canvas>`, next to `<PerspectiveCamera>`) tweens the camera from `START_POSITION` (far outside the solar system) to `DEFAULT_POSITION` (the normal starting view, `[-70, 70, 70]`) once on mount via `useThree()` + `gsap.to(camera.position, ...)`. `OrbitControls` keeps auto-updating its look-at toward the origin every frame regardless of where the tween puts the camera, so no manual `lookAt` call is needed here (unlike the per-planet focus tween above).

**`npm run lint` is clean (0 errors)** — PropTypes were added to every component that lacked them, `.eslintrc.cjs` gained a `react/no-unknown-property` ignore list for react-three-fiber's intrinsic props (`position`, `intensity`, `castShadow`, `object`), and dead code (unused vars, a stray `console.log`) was removed. One real bug was fixed along the way: `Planet.jsx`'s `isFocus` state was never actually set, so the GSAP camera-tween re-fired every frame instead of once per selection — the user has flagged that there are likely more interaction bugs like this (imprecise selection/focus behavior) scattered through the app, worth another pass if reported.

The Create-React-App leftovers (`public/index.html`, `public/manifest.json`, `public/logo192.png`, `public/logo512.png`, `public/robots.txt`, the `react-scripts` dependency) have been removed — Vite serves the root `index.html` → `src/index.jsx`, and `react-scripts` was pulling in ~75 of the ~83 `npm audit` findings (old webpack/jest/jsdom toolchain) despite never being invoked by any script. `react-router-dom` and `react-spinners` were removed too (both installed but never imported — `spinners-react` is the one actually used, in `Scene.jsx`).
