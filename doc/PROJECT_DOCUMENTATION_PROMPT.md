# Prompt: Generate Project Documentation for FarmDirect

Use this prompt with an AI assistant (or your coding agent) to generate a complete
`PROJECT_DOCUMENTATION.md` for the **FarmDirect** project. Copy everything below the
line into a fresh conversation alongside the project source code.

---

## Context (start of prompt)

You are a technical writer. Write complete, accurate, production-quality project
documentation for the repository you have access to. Base every claim on the actual
source code — do not invent features, endpoints, or setup steps.

### Project overview

**FarmDirect** is a farm-to-customer e-commerce platform. Customers browse fresh
produce from local farmers, add items to a cart, and check out with either
cash-on-delivery (COD) or **eSewa** (Nepal's digital wallet) payment. Farmers manage
their products, stock, and orders from a dashboard. An admin can approve/reject all
products and view all orders. The app supports customer reviews, product ratings,
password reset (demo mode), and a contact page.

### Tech stack

- **Next.js 16** (App Router, Turbopack, React 19 server components, TypeScript)
- **Prisma ORM + PostgreSQL** (Neon on Vercel)
- **Tailwind CSS 4** — styling
- **eSewa ePay v2** — sandbox payment (redirect flow with signed payload + status verification)
- **Vercel Blob** — product image uploads in production (local `public/uploads/products/` in dev)
- **bcryptjs** — password hashing
- **Edge-safe Web Crypto** signed session tokens (see `src/lib/session.ts`, `src/lib/session-cookies.ts`)

### Key facts to reflect

- Prices and order totals are stored in **cents (Int)** to avoid floating-point errors.
- Database models in `prisma/schema.prisma`: `User` (roles CUSTOMER/FARMER/ADMIN),
  `Category`, `Product`, `CartItem`, `Order` (statuses PENDING/CONFIRMED/SHIPPED/DELIVERED/CANCELLED),
  `OrderItem`, `ContactMessage`, `Review`, `ProductImage`.
- Demo accounts (password `changeme123`): customer `demo@farmdirect.in`,
  farmers `ramesh@farmdirect.in` / `sunita@farmdirect.in`, admin `admin@farmdirect.in`.
- eSewa sandbox test credentials are configured via `.env` (`ESEWA_MERCHANT_CODE=EPAYTEST`,
  `ESEWA_SECRET_KEY=8gBm/:&EnhH.1/q`, `ESEWA_TEST_MODE=true`).
- Password reset runs in demo mode: no email service, the reset link is logged to the
  server console and shown inline on the page; links expire after 1 hour.
- `vercel.json` build command runs `prisma migrate deploy && prisma db seed` before building.

### Documentation requirements

Produce `PROJECT_DOCUMENTATION.md` covering all of the following sections. Be specific,
reference actual file paths and route paths, and include code snippets only where they
genuinely help (env variables, example API responses, Prisma schema excerpts).

1. **Overview & goals** — what the platform does and whom it serves.
2. **Tech stack & architecture** — framework, DB, payments, image storage, and how the
   pieces fit together (server components, route handlers under `src/app/api/`,
   helper modules in `src/lib/`).
3. **Getting started / local setup** — prerequisites (Node 20+, a PostgreSQL connection
   string), install, `.env` setup, running Prisma migrations and seed, and starting the
   dev server. Include the full list of required environment variables.
4. **Data model** — describe each Prisma model and the relationships between them; note
   the cents convention and role/status enums.
5. **Authentication & sessions** — login/signup, role-based access, how sessions are
   signed and stored, and the password-reset flow.
6. **User flows** — customer browse/search → product detail → review → cart → checkout
   (COD and eSewa redirect + verification) → order history; farmer dashboard workflows;
   admin workflows.
7. **API reference** — every route handler under `src/app/api/` (auth, products, cart,
   orders, reviews, contact, product-images, admin), with method, path, auth required,
   request/response shape, and error behavior.
8. **Payments (eSewa)** — how payload signing, redirect, and status verification work;
   sandbox test steps and how to switch to live mode.
9. **Image uploads** — Vercel Blob vs local filesystem behavior and where uploads go.
10. **Deployment** — deploying to Vercel, environment variables, and how `vercel.json`
    handles migrations/seed on build.
11. **Project structure** — a tree of the important directories/files with one-line
    descriptions.
12. **Scripts & maintenance** — `npm run dev/build/start/lint`, adding/editing Prisma
    migrations, and known caveats (e.g. eSewa CAPTCHA cannot be removed, dev uploads not
    bundled).
13. **Security notes** — password hashing, session secret handling, and best practices
    for production.

### Style guidelines

- Markdown with a table of contents at the top.
- Use tables for env variables, roles/accounts, and API endpoints.
- Keep tone neutral and technical; no marketing fluff.
- Mark anything environment-dependent or credential-related with a
  `<YOUR_VALUE_HERE>` placeholder — never hardcode real secrets.
- Where behavior differs between development and production, call it out explicitly.
- Verify commands and filenames against the repository before writing them down.

Write the full document to `PROJECT_DOCUMENTATION.md` at the repository root (or the
location I specify), then briefly summarize (max 5 bullet points) what you documented
and any assumptions you made.