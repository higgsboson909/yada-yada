import { CheckSquare, Trash2 } from "lucide-react";
import type { Checklist } from "../api";
import { iconButtonClass } from "./styles";

export function ChecklistRow({
  checklist,
  isSelected,
  onSelect,
  onDeleteRequest,
}: {
  checklist: Checklist;
  isSelected?: boolean;
  onSelect?: () => void;
  onDeleteRequest: () => void;
}) {
  return (
    <div
      className={`group grid min-h-11 w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2.5 rounded-xl px-2.5 transition ${
        isSelected
          ? "bg-surface-muted text-fg"
          : "bg-transparent text-muted hover:bg-surface-muted"
      }`}
    >
      <button
        type="button"
        className="col-span-2 flex items-center gap-2.5 rounded-xl border-0 text-left"
        onClick={onSelect}
      >
        <CheckSquare size={16} aria-hidden="true" />
        <span className="overflow-hidden text-ellipsis whitespace-nowrap">
          {checklist.title}
        </span>
      </button>
      <button
        type="button"
        className={`${iconButtonClass} opacity-0 transition group-hover:opacity-100`}
        onClick={onDeleteRequest}
        aria-label={`Delete ${checklist.title} checklist`}
      >
        <Trash2 size={16} aria-hidden="true" />
      </button>
    </div>
  );
}
