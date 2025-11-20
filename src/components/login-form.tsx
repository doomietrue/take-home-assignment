// src/components/login-form.tsx
"use client";

import { useState, FormEvent, useTransition } from "react";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    startTransition(async () => {
      try {
        const response = await fetch("/api/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
          const data = (await response.json().catch(() => null)) as
            | { error?: string }
            | null;
          setError(data?.error ?? "Invalid credentials.");
          return;
        }

        router.replace("/admin");
        router.refresh();
      } catch (err) {
        console.error(err);
        setError("Unable to log in. Please try again.");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium text-slate-700">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-base text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="password"
          className="text-sm font-medium text-slate-700"
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-base text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
        />
      </div>

      {error && (
        <div className="rounded-xl border border-rose-100 bg-rose-50 px-4 py-2 text-sm text-rose-600">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-xl bg-slate-900 px-4 py-3 text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
      >
        {isPending ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}

