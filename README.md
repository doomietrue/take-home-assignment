## Customer Feedback System (POC)

This repository hosts a proof-of-concept customer feedback workflow built with Next.js (App Router), Tailwind CSS, Prisma, and SQLite. Shoppers submit qualitative feedback, the backend stores each entry, and sentiment is determined locally using the `sentiment` npm package.

### Features
- Public form with validation, live character count, and success/error messaging.
- REST API (`/api/feedback`) that analyzes sentiment (`Good`, `Neutral`, `Bad`) before persisting via Prisma.
- Admin dashboard (`/admin`) with sentiment summary cards, refresh control, and a detailed feedback table.
- Zero external services—everything runs locally with SQLite.

### Getting Started
```bash
npm install
npx prisma db push   # creates prisma/dev.db locally
npm run dev
```

Open `http://localhost:3000` for the public form and `http://localhost:3000/admin` for the dashboard.

### Environment
The default `.env` already points Prisma at `file:./prisma/dev.db`. Update `DATABASE_URL` if you need a different path or database.

### Prisma/Next.js compatibility
This project pins Prisma ORM to the latest 5.x release because Prisma 7’s new “client” engine requires database adapters that aren’t yet available for SQLite. Prisma 5 uses the mature binary engine and works seamlessly with Next.js 16.

### Tech Stack
- Next.js 16 (App Router, TypeScript)
- Tailwind CSS via `@tailwindcss/postcss`
- Prisma ORM 5 + SQLite
- `sentiment` npm package for on-device sentiment classification
