// src/app/admin/page.tsx
import prisma from "@/lib/prisma";
import { FeedbackTable } from "@/components/feedback-table";
import { RefreshButton } from "@/components/refresh-button";

const SENTIMENT_ORDER = ["Good", "Neutral", "Bad"] as const;
type Sentiment = (typeof SENTIMENT_ORDER)[number];

const SENTIMENT_META: Record<
  Sentiment,
  { label: string; description: string; accent: string }
> = {
  Good: {
    label: "Good",
    description: "Positive",
    accent: "text-emerald-600",
  },
  Neutral: {
    label: "Neutral",
    description: "Mixed",
    accent: "text-slate-600",
  },
  Bad: {
    label: "Bad",
    description: "Negative",
    accent: "text-rose-600",
  },
};

export default async function AdminPage() {
  const [entries, grouped] = await Promise.all([
    prisma.feedback.findMany({
      orderBy: { createdAt: "desc" },
    }),
    prisma.feedback.groupBy({
      by: ["sentiment"],
      _count: { _all: true },
    }),
  ]);

  const counts: Record<Sentiment, number> = {
    Good: 0,
    Neutral: 0,
    Bad: 0,
  };

  grouped.forEach((group) => {
    const sentimentKey = group.sentiment as Sentiment;
    if (sentimentKey in counts) {
      counts[sentimentKey] = group._count._all;
    }
  });

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-10 text-slate-900 sm:px-8">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
              Admin dashboard
            </p>
            <h1 className="mt-3 text-3xl font-semibold">
              Feedback sentiment overview
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Review every submission and spot trends instantly. Data refreshes
              on demand.
            </p>
          </div>
          <RefreshButton />
        </section>

        <section className="grid gap-4 sm:grid-cols-3">
          {SENTIMENT_ORDER.map((sentiment) => (
            <StatCard
              key={sentiment}
              title={SENTIMENT_META[sentiment].label}
              subtitle={SENTIMENT_META[sentiment].description}
              value={counts[sentiment]}
              accentClass={SENTIMENT_META[sentiment].accent}
            />
          ))}
        </section>

        <FeedbackTable entries={entries} />
      </div>
    </div>
  );
}

type StatCardProps = {
  title: string;
  subtitle: string;
  value: number;
  accentClass: string;
};

function StatCard({ title, subtitle, value, accentClass }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className={`text-sm font-medium ${accentClass}`}>{subtitle}</p>
      <p className="mt-1 text-lg font-semibold text-slate-900">{title}</p>
      <p className="mt-4 text-3xl font-semibold">{value}</p>
    </div>
  );
}

