# Welcome to your Lovable project

## Project info

# FitFest Robo — Robot Cloud App

FitFest Robo is a web-based Robot Cloud App for visualizing, tele‑operating, and managing fleets of service robots. It combines a lightweight React + TypeScript frontend with responsive SVG visualizations and UI primitives to deliver diagnostics, kinematics, simulation controls, OTA/update management, and integrations for robot telemetry and fleet orchestration.

This README explains how the app is organized, how to run it locally, and where to extend functionality for telemetry, backend integrations, and deployment.

---

**Table of contents**

- Project overview
- Key features
- Tech stack
- Folder layout
- Local development (Windows PowerShell)
- Build & production
- Configuration & environment
- Extending the app (telemetry, backend, persistence)
- Contributing
- License

---

## Project overview

This repository contains the FitFest Robo frontend application built with Vite, TypeScript and Tailwind CSS. The UI is componentized using the shadcn-style primitives and Radix components. Charts and diagnostics use small, dependency-free SVG widgets so the app stays lightweight and easily themed.

Core pages and features:

- Home dashboard: Vitals, Motion, Alerts, Energy visualizations and a large responsive Robot visual.
- Kinematics: Pathing tab with top-down XY path visualization, speed-coded segments, arrows, obstacles, and kinematics metrics.
- Settings: Full settings UI with sections for User Profile, Fleet Defaults, Tele-operation & Safety, Alerts, OTA/Updates, API keys, Simulator options and About.
- Self-Heal: Interactive robot view with selectable zones and controls.

This repository is intended to be the frontend for a Robot Cloud stack. It can work with simulated data out of the box; add a backend or telemetry provider to make it live.

---

## Key features

- Responsive, minimal design with a muted monochrome palette and colored accents for states
- Top-down pathing visualization with speed-coded segments and directional arrows
- Metrics derived from path data: total distance, avg/max speed, avg acceleration, stops, smoothness, efficiency
- Settings UI ready to be wired to a backend or localStorage
- Modular components: `Card`, `Button`, `Input`, `Switch`, `Slider`, `Select`, `Toast`, etc.
- Lightweight inline SVG charts — no heavy charting library required

---

## Tech stack

- Vite (dev server + build)
- React (TypeScript)
- Tailwind CSS + shadcn-ui style primitives
- @tanstack/react-query (used in app for data handling)
- lucide-react icons

---

## Folder layout (high level)

- `src/`
	- `main.tsx` — app bootstrap
	- `App.tsx` — routes and top-level wiring
	- `pages/` — page-level components (Home, Kinematics, Settings, SelfHeal, etc.)
	- `components/` — shared UI components (Layout, NavLink) and feature components (home, kinematics, self-heal, activity)
	- `hooks/` — small React hooks (e.g., `use-mobile`, `use-toast`)
	- `lib/` — utilities
	- `assets/` — static assets (images, svgs)

Files you will likely edit often:

- `src/components/kinematics/PathingTab.tsx` — Pathing visuals and computed metrics
- `src/pages/Settings.tsx` — Settings UI and save handlers
- `src/components/home/HealthMetrics.tsx` — Vitals / Motion / Alerts / Energy panels
- `src/components/home/RobotVisual.tsx` — Robot visual that appears on the dashboard

---

## Local development (Windows PowerShell)

Prerequisites:

- Node.js (16+ recommended)
- npm (bundled with Node) or pnpm/yarn if you prefer

Clone and run:

```powershell
# clone (if you haven't already)
# git clone <repo-url>
cd "C:/Users/MPR1HYD/OneDrive - Bosch Group/Desktop/Fitfest-2/FitFest_Robo"

# install
npm install

# start dev server
npm run dev
```

Open the URL printed by Vite (usually http://localhost:5173 or http://localhost:8080) in your browser. Navigate to the `Kinematics` page to preview the Pathing tab and use the `Today/7d/30d` time-range buttons to toggle datasets and see metrics update.

Notes:
- Use PowerShell (v5.1) if you follow the above commands on Windows. When chaining commands in one line, use `;` to separate them.

---

## Build & production

To build a production bundle:

```powershell
npm run build
# serve the `dist` directory with any static file server (e.g. `serve`, `http-server`) or deploy to your hosting platform
npx serve -s dist
```

---

## Configuration & environment

This frontend expects any runtime configuration to be provided at build-time or via an API. Typical configuration points you might add:

- API base URL for telemetry/fleet control (inject via `.env` and Vite define)
- OAuth client IDs / keys (do not commit secrets to the repo)
- Feature flags (simulator mode, debug telemetry replay)

Example Vite env variable (create `.env.local`):

```
VITE_API_BASE_URL=https://api.your-robot-cloud.local
VITE_APP_VERSION=1.0.0
```

Access in code via `import.meta.env.VITE_API_BASE_URL`.

---

## Extending the app

Telemetry / Backend
- Implement a small backend that exposes robot telemetry and commands (WebSocket / SSE for live telemetry; REST for control / persistence).
- On the frontend, use `@tanstack/react-query` to fetch lists of robots and to send control commands.
- Replace the simulated data generators in `PathingTab.tsx` with real telemetry arrays; map timestamps to x/y coordinates according to your robot's localization.

Persisting Settings
- Right now `Settings` has local state; add API calls to persist settings to a user profile service or store locally with `localStorage`.

Animations & Interaction
- Add hover tooltips to nodes, a timeline scrub to animate the robot along the path, and click-to-inspect events to open a detail panel.

---

## Contributing

- Create a branch from `main` for your feature or bugfix: `git checkout -b feat/your-feature`
- Open a PR with a short summary and link to screenshots if the change is visual
- Keep changes scoped and add tests if you add complicated logic

---

## License

This repository contains code with the existing LICENSE file in the project root. Check `LICENSE` for the project's license information.

---

If you'd like, I can also:

- Add a `README` badge matrix (build status, license, version)
- Add example `.env.local` and a small `telemetry-mock` script to run a local websocket server with simulated robot telemetry for end-to-end testing
- Add documentation pages for the Kinematics metrics formulas and how they're computed

Tell me which of those you'd like next and I'll add them.
