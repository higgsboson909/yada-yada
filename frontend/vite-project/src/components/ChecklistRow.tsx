import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CheckSquare, Trash2 } from "lucide-react";
import { api } from "../api";
import type { Checklist } from "../api";
import { iconButtonClass } from "./styles";

export function ChecklistRow({
  checklist,
  isSelected,
  onSelect,
}: {
  checklist: Checklist;
  isSelected?: boolean;
  onSelect?: () => void;
}) {
  const queryClient = useQueryClient();
  const deleteChecklist = useMutation({
    mutationFn: () => api.deleteChecklist(checklist.id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["checklists"] }),
  });

  const requestDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Delete "${checklist.title}" and all of its items?`))
      deleteChecklist.mutate();
  };

  return (
    <button
      className={`grid min-h-11 w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2.5 rounded-xl border-0 px-2.5 text-left transition ${
        isSelected
          ? "bg-surface-muted text-fg"
          : "bg-transparent text-muted hover:bg-surface-muted"
      }`}
      onClick={onSelect}
    >
      <CheckSquare size={16} aria-hidden="true" />
      <span className="overflow-hidden text-ellipsis whitespace-nowrap">
        {checklist.title}
      </span>
      <button
        className={`${iconButtonClass}`}
        onClick={requestDelete}
        aria-label={`Delete ${checklist.title} checklist`}
        disabled={deleteChecklist.isPending}
      >
        <Trash2 size={16} aria-hidden="true" />
      </button>
    </button>
  );
}
