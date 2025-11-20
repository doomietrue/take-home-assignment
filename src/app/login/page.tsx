// src/app/login/page.tsx
import Link from "next/link";
import { redirect } from "next/navigation";

import { LoginForm } from "@/components/login-form";
import { getCurrentUser } from "@/lib/auth";

export default async function LoginPage() {
  const user = await getCurrentUser();

  if (user) {
    redirect("/admin");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
        <div className="space-y-2 text-center">
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-slate-500">
            Admin Portal
          </p>
          <h1 className="text-2xl font-semibold text-slate-900">
            Sign in to continue
          </h1>
          <p className="text-sm text-slate-500">
            Use the demo credentials shared in the README.
          </p>
        </div>
        <div className="mt-6">
          <LoginForm />
        </div>
        <p className="mt-6 text-center text-sm text-slate-500">
          Need the public form?{" "}
          <Link href="/" className="text-slate-900 underline">
            Go back home
          </Link>
        </p>
      </div>
    </div>
  );
}

