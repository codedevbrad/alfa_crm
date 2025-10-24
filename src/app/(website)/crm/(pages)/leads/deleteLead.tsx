"use client";

import { useTransition } from "react";
import { deleteLead } from "./actions";

export function DeleteLeadButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      className="inline-flex h-8 items-center rounded-md border px-3 text-xs text-rose-700 hover:bg-rose-50"
      disabled={isPending}
      onClick={() => {
        if (!confirm("Delete this NEW lead?")) return;
        startTransition(async () => {
          try {
            await deleteLead(id);
          } catch (e: any) {
            alert(e?.message ?? "Failed to delete lead");
          }
        });
      }}
      title="Delete lead"
    >
      {isPending ? "Deleting…" : "Delete"}
    </button>
  );
}
