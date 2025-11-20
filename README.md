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
cp .env.example .env   # replace password with the one I shared
npm run setup                # prisma generate + db push
npm run dev                  # start the Next.js dev server
```

Open `http://localhost:3000` for the public form and `http://localhost:3000/admin` for the dashboard.

### Environment
Copy `.env.example` to `.env` and replace `REPLACE_WITH_PASSWORD` with the actual Neon password I shared privately.

### Admin Credentials
Run `npm run seed` once to insert demo users. The default accounts are:

- `admin@demo.com` / `admin123` (can delete feedback)
- `reviewer@demo.com` / `reviewer123` (read-only access)

### Testing
Unit tests cover the critical auth helpers. Run them with:

```bash
npm run test
```

### Tech Stack
- Next.js 16 (App Router, TypeScript)
- Tailwind CSS via `@tailwindcss/postcss`
- Prisma ORM 5 + Neon Postgres
- `sentiment` npm package for on-device sentiment classification
