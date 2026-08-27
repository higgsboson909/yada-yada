import { useState, type FormEvent } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CheckSquare } from "lucide-react";
import { api } from "../api";
import type { Checklist } from "../api";
import { buttonClass } from "./styles";
import { ErrorNotice } from "./ui";

export function ChecklistEditor({
  onCancel,
  onCreated,
}: {
  onCancel: () => void;
  onCreated: (checklist: Checklist) => void;
}) {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const createChecklist = useMutation({
    mutationFn: (nextTitle: string) => api.createChecklist(nextTitle),
    onSuccess: async (checklist) => {
      await queryClient.invalidateQueries({ queryKey: ["checklists"] });
      onCreated(checklist);
    },
  });

  const submitChecklist = (event: FormEvent) => {
    event.preventDefault();
    const nextTitle = title.trim();
    if (nextTitle && !createChecklist.isPending) {
      createChecklist.mutate(nextTitle);
    }
  };

  return (
    <form
      className="mx-auto flex min-h-[65vh] max-w-190 flex-col"
      onSubmit={submitChecklist}
    >
      <div className="mb-3 flex items-center gap-3">
        <div className="grid size-12 place-items-center rounded-[14px] bg-accent-soft text-accent-soft-foreground">
          <CheckSquare size={24} aria-hidden="true" />
        </div>
        <div className="flex-1">
          <h1 className="font-serif text-[40px] font-semibold text-fg">
            New checklist
          </h1>
          <p className="text-sm text-muted">Give it a title to get started.</p>
        </div>
      </div>

      <label className="sr-only" htmlFor="checklist-title">
        Checklist title
      </label>
      <input
        id="checklist-title"
        autoFocus
        className="mt-4 bg-transparent font-serif text-[clamp(34px,5vw,52px)] font-semibold text-fg outline-none"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="Untitled checklist"
        aria-invalid={false}
      />
      <p className="mt-3 text-sm text-muted">You can add items after creating it.</p>

      {createChecklist.error && <ErrorNotice error={createChecklist.error} />}

      <div className="mt-6 flex gap-2 border-t border-border pt-4">
        <div className="flex-1" />
        <button
          type="button"
          className="min-h-11 rounded-xl px-4 py-3 text-muted transition hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-50"
          onClick={onCancel}
          disabled={createChecklist.isPending}
        >
          Cancel
        </button>
        <button className={buttonClass} disabled={!title.trim() || createChecklist.isPending}>
          {createChecklist.isPending ? "Creating…" : "Create checklist"}
        </button>
      </div>
    </form>
  );
}
