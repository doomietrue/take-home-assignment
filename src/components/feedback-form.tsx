// src/components/feedback-form.tsx
"use client";

import { FormEvent, useMemo, useState } from "react";

const MAX_FEEDBACK_LENGTH = 1000;

type SubmissionState = "idle" | "loading" | "success" | "error";

export function FeedbackForm() {
  const [text, setText] = useState("");
  const [state, setState] = useState<SubmissionState>("idle");
  const [error, setError] = useState<string | null>(null);

  const trimmed = useMemo(() => text.trim(), [text]);
  const remaining = MAX_FEEDBACK_LENGTH - text.length;
  const isOverLimit = remaining < 0;
  const canSubmit =
    trimmed.length > 0 &&
    !isOverLimit &&
    (state === "idle" || state === "success" || state === "error");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!canSubmit) return;

    setState("loading");
    setError(null);

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: trimmed }),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as
          | { error?: string }
          | null;
        throw new Error(data?.error ?? "Something went wrong");
      }

      setText("");
      setState("success");
    } catch (err) {
      setState("error");
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setTimeout(() => {
        setState((previous) => (previous === "success" ? "idle" : previous));
      }, 2000);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"
    >
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">
          Share your product feedback
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Your feedback helps us improve. Max {MAX_FEEDBACK_LENGTH} characters.
        </p>
      </div>

      <div className="space-y-2">
        <label htmlFor="feedback" className="text-sm font-medium text-slate-700">
          Feedback
        </label>
        <textarea
          id="feedback"
          name="feedback"
          value={text}
          onChange={(event) => setText(event.target.value)}
          maxLength={MAX_FEEDBACK_LENGTH}
          rows={6}
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-900 shadow-inner outline-none transition-all placeholder:text-slate-400 focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
          placeholder="Tell us what you loved or what could be better..."
        />
        <div className="flex items-center justify-between text-sm">
          <span className={isOverLimit ? "text-red-500" : "text-slate-500"}>
            {remaining} characters left
          </span>
          {trimmed.length === 0 && (
            <span className="text-slate-500">
              Add some details before submitting.
            </span>
          )}
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-2 text-sm text-red-600">
          {error}
        </div>
      )}

      {state === "success" && (
        <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-2 text-sm text-emerald-700">
          Thank you for your feedback!
        </div>
      )}

      <button
        type="submit"
        disabled={!canSubmit || state === "loading"}
        className="w-full rounded-xl bg-slate-900 px-4 py-3 text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
      >
        {state === "loading" ? "Submitting..." : "Submit feedback"}
      </button>
    </form>
  );
}

