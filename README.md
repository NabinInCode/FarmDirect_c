# FarmDirect

A farm-to-customer e-commerce platform. Customers can browse fresh produce from local
farmers, order with cash-on-delivery or **eSewa** (Nepal's digital wallet) payment,
and farmers can manage their products and orders from their dashboard.

## Tech Stack

- **Next.js 16 (App Router, Turbopack)** — React 19, server components
- **Prisma + PostgreSQL** — ORM and database (works on Vercel serverless)
- **Tailwind CSS 4** — styling
- **eSewa ePay v2** — sandbox payment integration (redirect flow)
- **Vercel Blob** — product image uploads (local filesystem in dev)
- **bcryptjs** — password hashing

## Database (required: PostgreSQL)

Vercel functions have an ephemeral filesystem, so SQLite cannot be used in production.
The app requires a hosted PostgreSQL database. The easiest free option is **Neon**
(also available under Vercel → Storage → "Neon").

1. Create a free Neon project and copy the connection string (with `?sslmode=require`).
2. Put it in `.env`:

   ```bash
   DATABASE_URL="postgresql://USER:PASSWORD@ep-XXXX.region.aws.neon.tech/farmdirect?sslmode=require"
   ```

## Getting Started

Prerequisites: Node.js 20+ and a PostgreSQL connection string.

```bash
# 1. Install dependencies
npm install

# 2. Copy the env template and set DATABASE_URL
cp .env.example .env        # Windows: copy .env.example .env

# 3. Apply migrations + seed demo data
npx prisma migrate deploy
npx prisma db seed

# 4. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Demo Accounts

All accounts share the password `changeme123`.

| Role     | Email                  | What you can do                                   |
| -------- | ---------------------- | ------------------------------------------------ |
| Customer | `demo@farmdirect.in`   | Browse, review, cart, checkout (COD or eSewa)    |
| Farmer   | `ramesh@farmdirect.in` | Dashboard: manage products, orders, messages     |
| Farmer   | `sunita@farmdirect.in` | Second farmer (multi-vendor demo)                |
| Admin    | `admin@farmdirect.in`  | Admin dashboard: approve/all products, all orders |

## eSewa Sandbox (test payments)

The app runs in **eSewa test mode** by default (see `.env`). Config:

```bash
ESEWA_MERCHANT_CODE=EPAYTEST
ESEWA_SECRET_KEY=8gBm/:&EnhH.1/q
ESEWA_TEST_MODE=true
```

To complete a sandbox payment at checkout:

1. Choose **eSewa** at checkout — you'll be redirected to the sandbox.
2. Log in with any test user, e.g. ID `9806800001`, password `Nepal@123`.
3. Enter MPIN `1122` and the SMS/verification token `123456`.
4. Complete the payment and you'll be redirected back; the order is marked CONFIRMED
   once FarmDirect verifies the transaction with eSewa's status API.

Note: the eSewa login page is hosted by eSewa, so its CAPTCHA cannot be removed.

## Forgot Password (demo mode)

No email service is configured, so the reset link is **logged to the server console**
(and shown inline on the page). Visit `/forgot-password`, enter your email, click the
generated link, and set a new password. Links expire after 1 hour.

## Deploy on Vercel

1. Push this repository to GitHub.
2. In Vercel → **New Project**, import the repo (framework is auto-detected as Next.js).
3. Add the environment variables under **Settings → Environment Variables**:
   - `DATABASE_URL` — your Neon/Postgres connection string
   - `SESSION_SECRET` — long random string (`node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)
   - `ESEWA_MERCHANT_CODE=EPAYTEST`, `ESEWA_SECRET_KEY=8gBm/:&EnhH.1/q`, `ESEWA_TEST_MODE=true`
   - `BLOB_READ_WRITE_TOKEN` — create a **Blob store** under Vercel → Storage and copy its token (so dashboard product-image uploads work)
4. Deploy. The build command in `vercel.json` automatically runs
   `prisma migrate deploy` (creates tables) and `prisma db seed` (demo data)
   before building, so the first deploy is immediately ready.

## Project Structure

```
prisma/
  schema.prisma          # Data model (User, Product, Order, Review, ...)
  migrations/            # Baseline Postgres migration (applied by vercel.json build)
  seed.ts                # Demo data
src/
  app/
    api/                 # Route handlers (auth, products, cart, orders, eSewa, upload, ...)
    (pages)              # App Router pages
    components/          # Reusable + auth + product components
  lib/
    session.ts           # Signed session tokens (Edge-safe Web Crypto)
    esewa.ts             # eSewa signature/payload/verify helpers
    prisma.ts            # Prisma client singleton
public/
  uploads/products/      # Dev-only: dashboard-uploaded images (prod uses Vercel Blob)
```

## Scripts

```bash
npm run dev        # Start in development
npm run build      # prisma generate + production build
npm run start      # Serve the production build
npm run lint       # ESLint
```

## Notes

- Seeded demo products show colored placeholders. To add a picture to any product,
  use the Farmer dashboard → Products → Edit → "Choose an image from your computer".
- Dashboard-uploaded images go to **Vercel Blob** when
  `BLOB_READ_WRITE_TOKEN` is set (i.e. on Vercel), otherwise to
  `public/uploads/products/` locally — they are never bundled into the app.
- Switch `ESEWA_TEST_MODE=false` and use real merchant credentials for live payments.
- Always use a strong random `SESSION_SECRET` in production.