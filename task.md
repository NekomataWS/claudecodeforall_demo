# Mind Cafe — Task List

Derived from [`CONTEXT.md`](./CONTEXT.md).

---

## Core Site

> "The site lets Guests browse the menu, view the space, and make reservations."

- [x] Home page (`index.html`) — hero, about, featured menu, gallery preview, location
- [x] Menu page (`menu.html`) — full Menu Item listing for Guests to browse
- [x] Gallery page (`gallery.html`) — let Guests view the space and atmosphere
- [x] Reservation page (`reservation.html`) — let Guests make a table reservation
- [ ] Replace placeholder images (picsum.photos) with real photos (Classic Espresso, Flat White done; 18 remaining)
- [x] Reservation form — validate and handle submission

---

## Menu Items

> "A drink or food offered for sale at Mind Cafe. Has a name, category, description, and price."

- [x] Display each Menu Item with name, category, description, and price
- [x] Filter Menu Items by category (Espresso, Cold Brew, Non-Coffee, Snacks)
- [x] Empty state when a filtered category has no items

---

## Favourites

> "A Menu Item a Guest has marked for personal reference. Persisted in the Guest's browser across visits."

- [x] Bookmark button on each Menu Item card (overlay on image)
- [x] Toggle saved/unsaved state with scale animation
- [x] Persist Favourites in Favourite Store (`localStorage` key: `mindcafe_favourites`)
- [x] Restore Favourite state on page load
- [x] "Favourites" filter tab in menu filter bar
- [x] Badge showing count of saved Favourites on the tab
- [x] Empty state: "No favourites yet — bookmark a drink to save it here."
- [x] Clear all Favourites button

---

## Members

> Stored in Supabase project "Mind Cafe" (`profiles` table, RLS: own row only).

- [x] `register.html` — sign up with name, email, phone, password, marketing opt-in
- [x] `login.html` — sign in via Supabase Auth
- [x] `account.html` — view/edit profile, sign out
- [x] Navbar "Sign In" / "Account" link on all pages (`js/member-nav.js`)
- [ ] Configure Supabase Auth: Site URL / redirect URLs, email templates (confirmation email is on by default)
- [ ] Link orders and Favourites to Members

---

## Payment (2C2P) — Mock Mode

> See `2C2P_COFFEE_PAYMENT_SPEC.md` for full spec.

- [x] Backend: Node.js/Express server (`server/`) at port 4000 — run `npm start`
- [x] Database: SQLite via `node:sqlite` built-in — `data/mindcafe.db`
- [x] Cart: `js/cart.js` + localStorage key `mindcafe_cart` + badge in navbar all pages
- [x] `checkout.html` — cart review + Proceed to Payment
- [x] `POST /api/payments/create` — validates items, calculates total server-side, creates PENDING order
- [x] `GET /api/payments/:orderId/status` — returns order status
- [x] `mock-payment.html` — simulated 2C2P payment page (mock mode only)
- [x] `POST /api/payments/mock/complete` — simulates successful payment → PAID
- [x] `POST /api/payments/mock/cancel` — simulates cancelled payment → CANCELLED
- [x] `payment-result.html` — polls status API, shows PAID/PENDING/FAILED/CANCELLED states
- [x] `POST /api/payments/2c2p/callback` — endpoint stub (mock: no-op; sandbox/prod: TODO)
- [x] Idempotency: duplicate complete/cancel on non-PENDING order returns 409
- [x] Server-side price validation — client amounts never trusted
- [x] `.env.example` — template (no real credentials)

### Pending before sandbox/production

- [ ] Confirm with 2C2P: MID approved for coffee shop website?
- [ ] Confirm per-transaction `frontendReturnUrl`/`backendReturnUrl` override is supported
- [ ] Obtain Sandbox MID + Secret Key from 2C2P
- [ ] Implement 2C2P signature validation in `/api/payments/2c2p/callback`
- [ ] Add HTTPS and domain whitelisting
- [ ] Regression test: verify no impact on Pastopia
