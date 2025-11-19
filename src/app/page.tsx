// src/app/page.tsx
import { FeedbackForm } from "@/components/feedback-form";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center gap-10 px-4 py-12 sm:px-8">
        <header className="space-y-4 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            Customer Feedback System
          </p>
          <h1 className="text-4xl font-semibold text-slate-900">
            Capture what shoppers really think
          </h1>
          <p className="text-base text-slate-500">
            Share this form with customers after purchase and triage sentiment in
            seconds. Every submission is stored securely and analyzed
            automatically.
          </p>
        </header>

        <FeedbackForm />
      </div>
    </div>
  );
}
