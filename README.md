# StockFlow MVP

A modern, scope-reduced **SaaS Inventory Management MVP** built with Next.js App Router, NextAuth, Prisma, and Tailwind (shadcn-style UI components).

## Features (MVP)

- Authentication
  - Email/password signup
  - Organization created during signup
  - Login with protected app routes
- Multi-tenant data isolation
  - Products and settings are scoped to organization (`orgId`)
- Product management
  - Create, list, search, update, and delete products
  - Fields: name, SKU, description, quantity, cost price, selling price, low-stock threshold
- Dashboard
  - Total products
  - Total quantity on hand
  - Low-stock list
- Settings
  - Default low-stock threshold per organization

## Tech Stack

- **Frontend:** Next.js 16, React 19, Tailwind CSS v4
- **UI:** shadcn-inspired local component kit (`components/ui/*`)
- **Auth:** NextAuth (credentials)
- **Validation:** Zod
- **Database:** PostgreSQL + Prisma ORM

## Project Structure

- `app/` – Pages and API routes
- `components/ui/` – Reusable UI primitives (button, input, card, etc.)
- `lib/` – Shared server utilities (auth, prisma, tenant)
- `prisma/` – Schema + migrations

## Local Development

### 1) Install

```bash
npm install
```

### 2) Configure environment

Create `.env`:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DB_NAME"
NEXTAUTH_SECRET="replace-with-a-long-random-secret"
NEXTAUTH_URL="http://localhost:3000"
```

### 3) Apply migrations

```bash
npm run db:deploy
```

### 4) Run app

```bash
npm run dev
```

Open `http://localhost:3000`.

## Production Build

```bash
npm run build
npm run start
```

`postinstall` automatically runs `prisma generate`.

## Deployment Notes

- Set `DATABASE_URL` (preferred), `NEXTAUTH_SECRET`, and `NEXTAUTH_URL` in your hosting platform.
  - Backward-compatible env names `DATABASEURL` and `databaseurl` are also supported at runtime.
- Run `npm run db:deploy` during release/deploy phase.
- Protected routes are handled by `proxy.ts`.



## Operational Checks

Use these checks after deployment to confirm frontend, backend, and DB are all healthy:

1. Frontend page loads:
```bash
curl -I https://<your-domain>/login
```

2. Backend DB connectivity:
```bash
curl https://<your-domain>/api/health/db
```

Expected success response:
```json
{ "ok": true, "message": "Database connection successful" }
```

If this fails, verify `DATABASE_URL` and Neon network access/SSL settings first.

## Neon Database Notes

Use your Neon pooled connection string in `DATABASE_URL` (with SSL enabled), for example:

```env
DATABASE_URL="postgresql://<user>:<password>@<endpoint>/<db>?sslmode=require&pgbouncer=true&connect_timeout=15"
```

If signup fails, the API now returns explicit errors (duplicate email vs DB connection issue), which helps diagnose Neon config quickly.

To verify user creation in Neon directly:

```sql
select id, email, "orgId" from "User" order by id desc limit 20;
```

## License

MIT – see [LICENSE](./LICENSE).
