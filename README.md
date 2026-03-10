# StockFlow Backend (Express + Drizzle-ready)

This project has been simplified to a Node.js backend using Express and Neon PostgreSQL connectivity.

## Stack

- Node.js
- Express.js
- Drizzle ORM (installed for ORM migration)
- Neon serverless driver

## Environment

Create `.env` with:

```env
DATABASE_URL='postgresql://neondb_owner:npg_Xupht4yGci5v@ep-super-resonance-a46ct7iu-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
```

## Run

```bash
npm install
npm start
```

Server starts at `http://localhost:3000` and returns the PostgreSQL version.
