// src/components/feedback-table.tsx
import { Feedback } from "@prisma/client";

type Props = {
  entries: Feedback[];
};

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
});

export function FeedbackTable({ entries }: Props) {
  if (entries.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center text-slate-500">
        No feedback yet. Share the public form to start collecting insights.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full table-auto divide-y divide-slate-100">
        <thead className="bg-slate-50 text-left text-sm font-semibold text-slate-600">
          <tr>
            <th className="px-6 py-4">Feedback</th>
            <th className="px-6 py-4">Sentiment</th>
            <th className="px-6 py-4">Submitted</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {entries.map((entry) => (
            <tr key={entry.id} className="align-top text-sm text-slate-700">
              <td className="px-6 py-4 text-slate-900">
                <p className="whitespace-pre-line">{entry.text}</p>
              </td>
              <td className="px-6 py-4">
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                    entry.sentiment === "Good"
                      ? "bg-emerald-50 text-emerald-700"
                      : entry.sentiment === "Bad"
                        ? "bg-rose-50 text-rose-700"
                        : "bg-slate-100 text-slate-700"
                  }`}
                >
                  {entry.sentiment}
                </span>
              </td>
              <td className="px-6 py-4 text-slate-500">
                {dateFormatter.format(new Date(entry.createdAt))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

