# AGENTS.md

This file provides guidance to AI coding agents (Claude Code, Codex, etc.) when working with code in this repository.

# เขียนโปรแกรมเป็นเป็น html เท่านั้น

(Project rule: write programs as HTML only — front-end pages are plain HTML/CSS/JS; no frameworks or build step.)

## Commands

- `npm start` — run the Express server (`node --no-warnings server/index.js`)
- `npm run dev` — same, with `--watch` auto-restart
- No build, lint, or test tooling exists. Static pages can also be opened directly, but cart checkout and payments need the server.
- Server reads `.env` (copy from `.env.example`). `PORT` defaults to 3000 in code and `.env.example`, though `task.md` mentions 4000 — trust `.env`/code.

## Architecture

**Static multi-page site + small API.** Each page (`index`, `menu`, `gallery`, `reservation`, `checkout`, `mock-payment`, `payment-result`) is a standalone `.html` file in the repo root with its own `css/<page>.css` and `js/<page>.js`. Shared styling lives in `css/variables.css`, `base.css`, `components.css`; shared behaviour in `js/main.js`, `navbar.js`, `animations.js`.

`server/index.js` (Express) serves the repo root statically and mounts `/api/payments` (`server/routes/payments.js` → `server/services/payment.js`). Persistence is SQLite via the built-in `node:sqlite` (needs a recent Node), schema in `server/db/schema.sql`, DB file in `data/mindcafe.db`.

**Client state is all `localStorage`; there are no accounts** (see `CONTEXT.md` — a visitor is a "Guest").
- Favourites: `js/favourites.js`, key `mindcafe_favourites`. Identified by the menu card's `h3.menu-card__name` text, not an ID (ADR `docs/adr/0001`). Renaming a Menu Item orphans its favourite.
- Cart: `js/cart.js`, key `mindcafe_cart`, navbar badge on every page.

**Menu data is duplicated in three places** that must stay in sync when adding/changing items: the cards in `menu.html`, `js/menu-data.js` (powers the detail drawer with ingredients), and `server/catalog.js`.

**Payments (2C2P, currently mock mode).** `PAYMENT_MODE=mock|sandbox|production`. Flow: `checkout.html` → `POST /api/payments/create` → `mock-payment.html` → `POST /api/payments/mock/{complete,cancel}` → `payment-result.html` (polls `GET /api/payments/:orderId/status`). `server/catalog.js` is the authoritative price source — totals are computed server-side and client prices are never trusted. Complete/cancel on a non-PENDING order returns 409. `POST /api/payments/2c2p/callback` is a stub; sandbox/production are TODO.

Constraints from `2C2P_COFFEE_PAYMENT_SPEC.md` (Thai): this shares a merchant account with another system (Pastopia) — never touch its code/DB/portal return URLs, never put 2C2P keys in code/logs/git, and don't use production keys without explicit permission.

## Domain language

Use the terms in `CONTEXT.md` (e.g. **Guest**, **Menu Item**, **Favourite**, **Favourite Store**) and avoid the listed alternatives. `task.md` tracks feature status derived from it.
