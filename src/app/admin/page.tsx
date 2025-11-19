// src/app/admin/page.tsx
import Link from "next/link";

import { FeedbackTable } from "@/components/feedback-table";
import { RefreshButton } from "@/components/refresh-button";
import prisma from "@/lib/prisma";

const SENTIMENT_ORDER = ["Good", "Neutral", "Bad"] as const;
type Sentiment = (typeof SENTIMENT_ORDER)[number];
const PAGE_SIZE = 10;

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

type PageProps = {
  searchParams?: {
    page?: string;
  };
};

export default async function AdminPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const requestedPage = Number(resolvedSearchParams?.page ?? "1");
  const currentPage =
    Number.isFinite(requestedPage) && requestedPage > 0 ? requestedPage : 1;

  const [grouped, totalCount] = await Promise.all([
    prisma.feedback.groupBy({
      by: ["sentiment"],
      _count: { _all: true },
    }),
    prisma.feedback.count(),
  ]);

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const page = Math.min(currentPage, totalPages);
  const skip = (page - 1) * PAGE_SIZE;

  const entries = await prisma.feedback.findMany({
    orderBy: { createdAt: "desc" },
    skip,
    take: PAGE_SIZE,
  });

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

        {totalPages > 1 && (
          <PaginationControls
            currentPage={page}
            totalPages={totalPages}
            pageSize={PAGE_SIZE}
            totalEntries={totalCount}
            currentCount={entries.length}
          />
        )}
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

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalEntries: number;
  currentCount: number;
};

function PaginationControls({
  currentPage,
  totalPages,
  pageSize,
  totalEntries,
  currentCount,
}: PaginationProps) {
  const start = totalEntries === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const end = (currentPage - 1) * pageSize + currentCount;
  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;

  const linkForPage = (page: number) =>
    page === 1 ? "/admin" : `/admin?page=${page}`;

  return (
    <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-6 py-4 text-sm text-slate-600 shadow-sm sm:flex-row">
      <p>
        Showing <span className="font-semibold text-slate-900">{start}</span>-
        <span className="font-semibold text-slate-900">{end}</span> of{" "}
        <span className="font-semibold text-slate-900">{totalEntries}</span>{" "}
        feedback entries
      </p>
      <div className="flex items-center gap-3">
        {hasPrev ? (
          <Link
            href={linkForPage(currentPage - 1)}
            className="rounded-lg border border-slate-200 px-3 py-2 font-medium text-slate-900 transition hover:bg-slate-50"
          >
            Previous
          </Link>
        ) : (
          <span className="rounded-lg border border-slate-100 px-3 py-2 font-medium text-slate-400">
            Previous
          </span>
        )}
        <span className="text-slate-500">
          Page {currentPage} / {totalPages}
        </span>
        {hasNext ? (
          <Link
            href={linkForPage(currentPage + 1)}
            className="rounded-lg border border-slate-200 px-3 py-2 font-medium text-slate-900 transition hover:bg-slate-50"
          >
            Next
          </Link>
        ) : (
          <span className="rounded-lg border border-slate-100 px-3 py-2 font-medium text-slate-400">
            Next
          </span>
        )}
      </div>
    </div>
  );
}

