import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Check } from "lucide-react";
import { api } from "../api";
import type { ChecklistItem } from "../api";

export function ChecklistItemComponent({
  item,
  checklistId,
}: {
  item: ChecklistItem;
  checklistId: string;
}) {
  const queryClient = useQueryClient();
  const toggleItem = useMutation({
    mutationFn: () =>
      api.updateItem(item.id, { is_done: !item.is_done }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["items", checklistId] }),
  });

  return (
    <button
      className="flex min-h-11 w-full items-center gap-3 rounded-xl border-0 bg-transparent px-3 py-2 text-left transition hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-50"
      onClick={() => toggleItem.mutate()}
      disabled={toggleItem.isPending}
      aria-pressed={item.is_done}
    >
      <span
        className={`grid size-5 flex-shrink-0 place-items-center rounded-[6px] border-2 transition ${
          item.is_done
            ? "border-accent bg-accent text-accent-foreground"
            : "border-border-strong"
        }`}
        aria-hidden="true"
      >
        {item.is_done && <Check size={14} />}
      </span>
      <span
        className={`leading-relaxed ${
          item.is_done ? "text-subtle line-through" : "text-fg"
        }`}
      >
        {item.title}
      </span>
    </button>
  );
}
