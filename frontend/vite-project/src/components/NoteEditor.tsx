import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { api } from "../api";
import type { Note } from "../api";
import { buttonClass } from "./styles";
import { DeleteConfirmationModal, ErrorNotice } from "./ui";

const noteSchema = z.object({
  title: z.string().trim().min(1, "Give your note a title"),
  content: z.string().trim().min(1, "Write something first"),
});
type NoteForm = z.infer<typeof noteSchema>;

type NoteEditorProps = {
  note?: Note;
  onDone: () => void;
  onDeleted: () => void;
};

export function NoteEditor({ note, onDone, onDeleted }: NoteEditorProps) {
  const queryClient = useQueryClient();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NoteForm>({
    resolver: zodResolver(noteSchema),
    defaultValues: { title: note?.title ?? "", content: note?.content ?? "" },
  });
  const saveNote = useMutation({
    mutationFn: (form: NoteForm) =>
      note ? api.updateNote(note.id, form) : api.createNote(form),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["notes"] });
      onDone();
    },
  });
  const deleteNote = useMutation({
    mutationFn: () => api.deleteNote(note!.id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["notes"] });
      onDeleted();
    },
  });
  const pending = saveNote.isPending || deleteNote.isPending;
  const requestDelete = () => {
    setShowDeleteConfirm(true);
  };

  return (
    <form
      className="mx-auto flex min-h-[65vh] max-w-[760px] flex-col"
      onSubmit={handleSubmit((form) => saveNote.mutate(form))}
    >
      <label className="sr-only" htmlFor="note-title">
        Note title
      </label>
      <input
        id="note-title"
        className="bg-transparent font-serif text-[clamp(34px,5vw,52px)] font-semibold text-fg outline-none"
        {...register("title")}
        placeholder="Untitled note"
        aria-invalid={Boolean(errors.title)}
        aria-describedby={errors.title ? "note-title-error" : undefined}
      />
      {errors.title && (
        <small id="note-title-error" className="text-danger">
          {String(errors.title.message)}
        </small>
      )}
      <label className="sr-only" htmlFor="note-content">
        Note content
      </label>
      <textarea
        id="note-content"
        className="mt-6 min-h-[420px] flex-1 resize-none bg-transparent font-serif text-lg leading-relaxed text-fg outline-none"
        {...register("content")}
        placeholder="Start writing…"
        aria-invalid={Boolean(errors.content)}
        aria-describedby={errors.content ? "note-content-error" : undefined}
      />
      {errors.content && (
        <small id="note-content-error" className="text-danger">
          {String(errors.content.message)}
        </small>
      )}
      {(saveNote.error || deleteNote.error) && (
        <ErrorNotice error={saveNote.error ?? deleteNote.error} />
      )}
      <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-border pt-5">
        {note && (
          <button
            type="button"
            className="inline-flex min-h-11 items-center gap-2 rounded-xl px-4 py-3 text-danger transition hover:bg-danger-surface disabled:cursor-not-allowed disabled:opacity-50"
            onClick={requestDelete}
            disabled={pending}
          >
            <Trash2 size={16} aria-hidden="true" /> Delete note
          </button>
        )}
        <span className="flex-1" />
        <button
          type="button"
          className="min-h-11 rounded-xl px-4 py-3 text-muted transition hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-50"
          onClick={onDone}
          disabled={pending}
        >
          Cancel
        </button>
        <button className={buttonClass} disabled={pending}>
          {saveNote.isPending ? "Saving…" : note ? "Save changes" : "Save note"}
        </button>
      </div>
      <DeleteConfirmationModal
        isOpen={showDeleteConfirm && !!note}
        title={note?.title ?? ""}
        onConfirm={() => {
          setShowDeleteConfirm(false);
          deleteNote.mutate();
        }}
        onCancel={() => setShowDeleteConfirm(false)}
        isPending={deleteNote.isPending}
      />
    </form>
  );
}
