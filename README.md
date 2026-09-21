# Apollo 🌍

An interactive 3D solar system planetarium built with React, Three.js, and React Three Fiber.

**Live:** https://apollo.martinnoel.fr

## Features

- **Interactive 3D visualization** of the solar system with accurate orbital mechanics (cosmetic scale)
- **Camera navigation** — orbit, zoom, and focus on any planet or moon with smooth GSAP transitions
- **Arrival animation** — camera starts far outside the solar system and zooms in on page load
- **Responsive info cards** — click planets/moons to see details and associated satellites
- **Bottom navbar** — quick preview of all planets and the Sun for navigation
- **Live clock** — displays current time in French locale

## Quick Start

### Requirements

- Node.js 16+
- npm 8+

### Development

```bash
npm install
npm run dev
```

Opens at http://localhost:5173 (Vite default port)

### Production Build

```bash
npm run build       # outputs to dist/
npm run preview     # preview the production build locally
```

### Linting

```bash
npm run lint        # ESLint (0-error strict mode)
```

## Architecture

**Stack**: React 18 + Vite + Three.js + React Three Fiber + Drei + GSAP

### Data Flow

1. `src/pages/Scene.jsx` fetches `/assets/bodies.json` (25 celestial bodies: 1 Star, 9 Planets, 15 Moons)
2. Passes `objects` array to `Navbar` (no redundant fetches)
3. Maps each body by `bodyType` → generic `<Sun>` / `<Planet>` / `<Moon>` components
4. 3D models and textures loaded via `useGLTF()` from local `/assets/planets/3d/*.glb` and `/assets/*/images/*.png`

### State Management

- **No global store** — Redux removed (was only used for Home overlay toggle, now deleted)
- **Local state** in `Scene.jsx` → threaded via props through `Navbar` → `NavbarItem` → `TurnPlanet`
- Selected body (`indexObject`), moons, card open/closed, loading flag all live as `useState`

### Key Components

| Component | Path                                | Role                                              |
| --------- | ----------------------------------- | ------------------------------------------------- |
| `Scene`   | `src/pages/Scene.jsx`               | Main canvas, data fetch, state orchestration      |
| `Sun`     | `src/components/Objects/Sun.jsx`    | Renders the Sun (useGLTF)                         |
| `Planet`  | `src/components/Objects/Planet.jsx` | Renders planets + their moons, camera focus tween |
| `Moon`    | `src/components/Objects/Moon.jsx`   | Renders moons (as children of planets)            |
| `Navbar`  | `src/components/Navbar/Navbar.jsx`  | Bottom navigation bar (Stars + Planets only)      |
| `Card`    | `src/components/Card/Card.jsx`      | Info panel for clicked body                       |

### Camera & Animation

- **Arrival animation**: `CameraIntro` component tweens camera from far space (`[-2000, 2000, 2000]`) to normal view (`[-70, 70, 70]`) over 4 seconds on mount
- **Planet focus**: When clicking a planet, `Planet.jsx` tweens camera closer + uses `camera.lookAt()` each frame
- **Free navigation**: `OrbitControls` lets users orbit/zoom/pan at any time

## Deployment

The app is deployed to a homelab server (`root@caddy.home`) via Caddy + Cloudflare Tunnel.

### Deploy Script

```bash
./deploy/deploy.sh
```

This:

1. Runs `npm run build`
2. Rsyncs `dist/` to `/var/www/apollo/` on the server
3. Caddy serves it as `apollo.martinnoel.fr`

**Note:** See `deploy/Caddyfile` for the Caddy configuration block.

## Known Limitations

- **Orbital mechanics are cosmetic**, not physically accurate — sizes and distances use hand-tuned divisors for visual appeal, not real scale
- **No routing** — single-page app (`react-router-dom` is not used, was removed as dead dep)
- **Limited error handling** — missing `.glb` files can crash the scene (wrapped in `<Suspense>` to mitigate)
- **Interaction bugs** — imprecise selection/focus behavior in some edge cases (flagged for future pass)

## Code Quality

- **Lint**: `npm run lint` passes with 0 errors (strict ESLint config)
- **PropTypes**: All components have full PropTypes validation
- **Suspense**: `useGLTF` calls wrapped in `<Suspense>` boundaries to prevent scene crashes on slow loads
- **No external API dependency**: All data is local (`public/assets/bodies.json`); original `apollo-api.martinnoel.fr` is no longer needed

## Project Structure

```
src/
  pages/
    Scene.jsx          # Main canvas + data fetch
    Scene.css
  components/
    Objects/
      Sun.jsx, Planet.jsx, Moon.jsx
    Navbar/
      Navbar.jsx, NavbarItem.jsx, TurnPlanet.jsx
    Header/
      Header.jsx, Logo.jsx, Clock.jsx
    Card.jsx
  index.jsx
  App.jsx
public/
  assets/
    bodies.json        # Main data file (25 bodies)
    planets/           # 9 planets
      3d/*.glb
      images/*.png
    moons/             # 15 moons
      3d/*.glb
    stars/             # Sun
      3d/*.glb
      images/*.png
```

## Future Improvements

- Implement a shared data-fetching hook to avoid redundant fetches in `Navbar` and `Scene`
- Add a real physics/N-body simulation option (toggle between cosmetic and accurate)
- Improve interaction precision (selection/focus bugs)
- Add orbit trails or trajectory visualization
- Support touch controls for mobile devices

## Credits

Built as a Wild Code School bootcamp project.

Data sourced from [le-systeme-solaire.net API](https://api.le-systeme-solaire.net).

---

For detailed architecture notes, see [CLAUDE.md](./CLAUDE.md).
