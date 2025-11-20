// src/components/logout-button.tsx
"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      await fetch("/api/logout", { method: "POST" });
      router.replace("/login");
      router.refresh();
    });
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={isPending}
      className="text-sm font-medium text-slate-600 transition hover:text-slate-900 disabled:opacity-60 cursor-pointer"
    >
      {isPending ? "Signing out..." : "Sign out"}
    </button>
  );
}

