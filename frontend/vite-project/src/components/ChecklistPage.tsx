import { useState, type FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckSquare, Plus } from "lucide-react";
import { api } from "../api";
import type { Checklist } from "../api";
import { ChecklistItemComponent } from "./ChecklistItem";
import { miniButtonClass } from "./styles";
import { CollectionState, ErrorNotice } from "./ui";

export function ChecklistPage({
  checklist,
  onDone,
}: {
  checklist: Checklist;
  onDone: () => void;
}) {
  const queryClient = useQueryClient();
  const [newItem, setNewItem] = useState("");
  const items = useQuery({
    queryKey: ["items", checklist.id],
    queryFn: () => api.items(checklist.id),
  });
  const addItem = useMutation({
    mutationFn: (title: string) => api.createItem(checklist.id, title),
    onSuccess: async () => {
      setNewItem("");
      await queryClient.invalidateQueries({
        queryKey: ["items", checklist.id],
      });
    },
  });

  const submitItem = (event: FormEvent) => {
    event.preventDefault();
    const title = newItem.trim();
    if (title && !addItem.isPending) addItem.mutate(title);
  };

  const completedCount = items.data?.filter((item) => item.is_done).length ?? 0;
  const totalCount = items.data?.length ?? 0;

  return (
    <div className="mx-auto flex min-h-[65vh] max-w-[760px] flex-col">
      <div className="mb-3 flex items-center gap-3">
        <div className="grid size-[48px] place-items-center rounded-[14px] bg-accent-soft text-accent-soft-foreground">
          <CheckSquare size={24} aria-hidden="true" />
        </div>
        <div className="flex-1">
          <h1 className="font-serif text-[40px] font-semibold text-fg">
            {checklist.title}
          </h1>
          {totalCount > 0 && (
            <p className="text-sm text-muted">
              {completedCount} of {totalCount} completed
            </p>
          )}
        </div>
      </div>

      <div className="mb-6 h-1 rounded-full bg-border">
        <div
          className="h-full rounded-full bg-accent transition-all"
          style={{
            width: totalCount > 0 ? `${(completedCount / totalCount) * 100}%` : "0%",
          }}
        />
      </div>

      <div className="flex-1">
        {items.isLoading && (
          <CollectionState>Loading items…</CollectionState>
        )}
        {items.isError && <ErrorNotice error={items.error} />}
        {items.data?.length === 0 && !items.isLoading && (
          <CollectionState>
            No items yet. Add one to get started.
          </CollectionState>
        )}
        {items.data?.map((item) => (
          <ChecklistItemComponent
            key={item.id}
            item={item}
            checklistId={checklist.id}
          />
        ))}
      </div>

      <form
        className="mt-6 grid grid-cols-[1fr_auto] gap-2.5 rounded-xl border border-dashed border-border-strong p-3"
        onSubmit={submitItem}
      >
        <label className="sr-only" htmlFor="new-item">
          Add new item
        </label>
        <input
          id="new-item"
          className="w-full bg-transparent text-base text-fg outline-none placeholder:text-subtle"
          value={newItem}
          onChange={(event) => setNewItem(event.target.value)}
          placeholder="Add item…"
          disabled={addItem.isPending}
        />
        <button
          className={miniButtonClass}
          aria-label="Add item"
          disabled={!newItem.trim() || addItem.isPending}
        >
          <Plus size={16} aria-hidden="true" />
        </button>
      </form>
      {addItem.error && <ErrorNotice error={addItem.error} />}

      <div className="mt-6 flex gap-2 border-t border-border pt-4">
        <div className="flex-1" />
        <button
          className="min-h-11 rounded-xl px-4 py-3 text-muted transition hover:bg-surface-muted"
          onClick={onDone}
        >
          Done
        </button>
      </div>
    </div>
  );
}
