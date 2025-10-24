"use client";

import { useTransition } from "react";
import { deleteAllNewLeads } from "./actions";

export function DeleteAllNewButton() {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      className="h-10 rounded-md border px-4 text-sm text-rose-700 hover:bg-rose-50"
      disabled={isPending}
      onClick={() => {
        if (!confirm("Delete ALL NEW leads? This cannot be undone.")) return;
        startTransition(async () => {
          try {
            await deleteAllNewLeads ();
          } catch (e: any) {
            alert(e?.message ?? "Failed to delete NEW leads");
          }
        });
      }}
      title="Delete all NEW leads"
    >
      {isPending ? "Deleting…" : "Delete all NEW"}
    </button>
  );
}
