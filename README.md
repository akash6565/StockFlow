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

- Set `DATABASE_URL`, `NEXTAUTH_SECRET`, and `NEXTAUTH_URL` in your hosting platform.
- Run `npm run db:deploy` during release/deploy phase.
- Protected routes are handled by `proxy.ts`.

## License

MIT – see [LICENSE](./LICENSE).
