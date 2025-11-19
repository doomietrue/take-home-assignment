## Customer Feedback System (POC)

This repository hosts a proof-of-concept customer feedback workflow built with Next.js (App Router), Tailwind CSS, Prisma, and Neon Postgres. Shoppers submit qualitative feedback, the backend stores each entry, and sentiment is determined locally using the `sentiment` npm package.

### Features
- Public form with validation, live character count, and success/error messaging.
- REST API (`/api/feedback`) that analyzes sentiment (`Good`, `Neutral`, `Bad`) before persisting via Prisma.
- Admin dashboard (`/admin`) with sentiment summary cards, refresh control, and a detailed feedback table.
- Neon Postgres backing store so deployments on Vercel stay persistent.

### Getting Started
```bash
npm install
npx prisma db push   # syncs the Neon/Postgres schema (DATABASE_URL required)
npm run dev
```

Open `http://localhost:3000` for the public form and `http://localhost:3000/admin` for the dashboard.

### Environment
Copy `.env` to `.env.local` (or set environment variables in Vercel) and provide your Neon connection string:

```
DATABASE_URL="postgresql://user:password@host/neondb?sslmode=require"
```

### Prisma/Next.js compatibility
This project pins Prisma ORM to the latest 5.x release because Prisma 7’s new “client” engine requires database adapters that aren’t yet available for SQLite. Prisma 5 uses the mature binary engine and works seamlessly with Next.js 16.

### Tech Stack
- Next.js 16 (App Router, TypeScript)
- Tailwind CSS via `@tailwindcss/postcss`
- Prisma ORM 5 + Neon Postgres
- `sentiment` npm package for on-device sentiment classification
