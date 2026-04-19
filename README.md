<<<<<<< HEAD
# SwiftSeat – Premium Bus‑Booking Platform

A modern, full‑stack web application that lets users search for bus routes, select seats, and complete bookings with a sleek, glass‑morphism UI and smooth micro‑animations. The project showcases a premium, production‑ready codebase built with a curated tech stack, best‑in‑class development workflows, and comprehensive documentation.

---

## 📚 Tech Stack

| Layer | Technologies | Why We Chose It |
|-------|--------------|-----------------|
| **Frontend** | • **React (Vite)** – lightning‑fast dev server & HMR<br>• **Tailwind CSS** – utility‑first styling for rapid UI iteration (custom design tokens for vibrant gradients & dark mode)<br>• **Google Fonts – Inter & Outfit** – modern, readable typography<br>• **React Router** – declarative routing for pages (search, seat selection, checkout, confirmation) | Gives a performant SPA with crisp, responsive UI and zero‑config build. |
| **Backend** | • **Node.js (v20+)**<br>• **Express** – lightweight routing & middleware<br>• **MongoDB (via Mongoose)** – flexible schema for routes, bookings, users<br>• **JWT + Bcrypt** – secure auth & password hashing<br>• **Helmet & CORS** – security hardening | Keeps the server lean, scalable, and easy to extend (e.g., add admin dashboards). |
| **DevOps / CI** | • **GitHub Actions** – lint, unit‑test, and build pipelines on every PR<br>• **Prettier & ESLint** – consistent code style across client & server<br>• **dotenv** – environment‑variable management | Automates quality checks and prevents regressions. |
| **Testing** | • **Jest & React Testing Library** – unit & component tests<br>• **Supertest** – API route testing | Guarantees reliability of critical booking flows. |
| **Packaging & Tooling** | • **npm scripts** – `dev`, `build`, `test`, `lint`<br>• **Vite** – fast bundling, automatic code‑splitting<br>• **PostCSS** – Tailwind processing and autoprefixing | Streamlines developer experience, enabling hot‑reload and instant feedback. |

---

## 🔄 Development Workflow

1. **Clone & Install**
   ```bash
   git clone https://github.com/AbhirajSinghRajput005/SwiftSeat.git
   cd SwiftSeat
   npm install   # installs both client and server deps (workspace root)
   ```

2. **Run Locally**
   - **Frontend**: `npm run dev --workspace client` → Vite dev server (http://localhost:5173)
   - **Backend**: `npm run dev --workspace server` → Express server (http://localhost:5000)

3. **Branching Model**
   - `main` – always deployable (GitHub Actions runs production build).
   - `feature/<name>` – for new UI components, routes, or API endpoints.
   - `bugfix/<name>` – quick fixes.
   - Pull requests must pass **lint**, **test**, and **build** jobs before merging.

4. **Commit Standards**
   - Use **Conventional Commits** (`feat:`, `fix:`, `docs:`, `chore:`) for automatic changelog generation.

5. **Testing**
   - Run `npm test` to execute all Jest suites.
   - Front‑end components: `npm test --workspace client`
   - API routes: `npm test --workspace server`

6. **CI Pipeline (GitHub Actions)**
   - **Lint** → `eslint` + `stylelint`
   - **Test** → Jest + Supertest with coverage report.
   - **Build** → Vite production bundle + Node build (transpiled with Babel).
   - **Deploy** (optional): On push to `main`, the workflow can trigger a Vercel/Netlify deployment for the client and a Docker push for the server.

7. **Release Process**
   1. Create a **release branch** from `main`.
   2. Bump the version in `package.json` (`npm version patch|minor|major`).
   3. Merge back to `main` (GitHub Actions automatically tags and publishes a release).

---

## 🚀 Getting Started Quickly

```bash
# 1. Install dependencies (once)
npm i

# 2. Start both client & server concurrently (dev convenience)
npm run dev   # uses npm‑run‑all or concurrently under the hood
```

You should now see the **SwiftSeat** landing page, be able to search for routes, pick seats, and finish a booking—all with a polished UI and secure backend.

---

## 📌 Future Enhancements

- **Dockerization** – containerize the server and optionally the client for easy deployment.
- **OAuth Integration** – enable Google/Facebook login for a smoother UX.
- **Admin Dashboard** – manage routes, buses, and bookings in a protected area.
- **Analytics** – track conversion funnels and popular routes using a lightweight analytics service.

---

*Happy coding!*
=======
# SwiftSeat
SwiftSeat – Premium Bus‑Booking Platform
>>>>>>> 0a9e053e2bf3f6ba7d157e0299aa4ed6db425fdc
