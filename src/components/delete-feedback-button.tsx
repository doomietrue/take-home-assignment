// src/components/delete-feedback-button.tsx
"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

type Props = {
  id: number;
};

export function DeleteFeedbackButton({ id }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (isPending) return;
    const confirmed = window.confirm(
      "Are you sure you want to permanently delete this feedback?",
    );
    if (!confirmed) return;

    startTransition(async () => {
      const response = await fetch(`/api/feedback/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as
          | { error?: string }
          | null;
        alert(data?.error ?? "Failed to delete feedback.");
        return;
      }

      router.refresh();
    });
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      className="text-sm font-medium text-rose-600 hover:text-rose-500 disabled:cursor-not-allowed disabled:opacity-60"
      disabled={isPending}
    >
      {isPending ? "Deleting..." : "Delete"}
    </button>
  );
}

