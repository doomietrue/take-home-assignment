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
Create a `.env.local` file (or configure the variables in Vercel) and paste the credentials that I shared with you privately. At minimum you need:

```
DATABASE_URL="postgresql://<user>:<password>@<host>/<db>?sslmode=require"
```

If I provided extra `NEON_*` keys, add them to `.env.local` as well—they are optional but handy for tooling. Never commit this file.

### Tech Stack
- Next.js 16 (App Router, TypeScript)
- Tailwind CSS via `@tailwindcss/postcss`
- Prisma ORM 5 + Neon Postgres
- `sentiment` npm package for on-device sentiment classification
