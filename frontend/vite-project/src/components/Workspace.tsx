import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FileText, LogOut, Menu, Plus, Trash2, X } from "lucide-react";
import { api } from "../api";
import type { Note } from "../api";
import { ChecklistEditor } from "./ChecklistEditor";
import { ChecklistRow } from "./ChecklistRow";
import { ChecklistPage } from "./ChecklistPage";
import { NoteEditor } from "./NoteEditor";
import { buttonClass, iconButtonClass, miniButtonClass } from "./styles";
import { CollectionState, DeleteConfirmationModal, ErrorNotice } from "./ui";

const sectionHeadingClass =
  "flex items-center justify-between px-2 pb-2 text-[11px] font-extrabold uppercase tracking-[0.14em] text-subtle";

export function Workspace({ onLoggedOut }: { onLoggedOut: () => void }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedNoteId, setSelectedNoteId] = useState<string>();
  const [selectedChecklistId, setSelectedChecklistId] = useState<string>();
  const [creatingNote, setCreatingNote] = useState(false);
  const [creatingChecklist, setCreatingChecklist] = useState(false);
  const [navigationOpen, setNavigationOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState<{ noteId: string; title: string } | null>(null);
  const [deleteChecklistConfirm, setDeleteChecklistConfirm] = useState<{ checklistId: string; title: string } | null>(null);
  const notes = useQuery({ queryKey: ["notes"], queryFn: api.notes });
  const checklists = useQuery({
    queryKey: ["checklists"],
    queryFn: api.checklists,
  });
  const selectedNote = notes.data?.find((note) => note.id === selectedNoteId);
  const selectedChecklist = checklists.data?.find(
    (checklist) => checklist.id === selectedChecklistId
  );
  const logout = useMutation({
    mutationFn: api.logout,
    onSettled: () => {
      queryClient.clear();
      onLoggedOut();
      navigate("/login", { replace: true });
    },
  });
  const deleteNote = useMutation({
    mutationFn: (noteId: string) => api.deleteNote(noteId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["notes"] });
      setDeleteConfirm(null);
      if (selectedNoteId === deleteConfirm?.noteId) {
        setSelectedNoteId(undefined);
      }
    },
  });
  const deleteChecklist = useMutation({
    mutationFn: (checklistId: string) => api.deleteChecklist(checklistId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["checklists"] });
      setDeleteChecklistConfirm(null);
      if (selectedChecklistId === deleteChecklistConfirm?.checklistId) {
        setSelectedChecklistId(undefined);
      }
    },
  });
  const startNote = () => {
    setSelectedNoteId(undefined);
    setCreatingNote(true);
    setNavigationOpen(false);
  };
  const startChecklist = () => {
    setSelectedNoteId(undefined);
    setCreatingNote(false);
    setSelectedChecklistId(undefined);
    setCreatingChecklist(true);
    setNavigationOpen(false);
  };
  const closeEditor = () => {
    setSelectedNoteId(undefined);
    setCreatingNote(false);
  };
  const closeChecklistEditor = () => {
    setCreatingChecklist(false);
  };
  const closeChecklist = () => {
    setSelectedChecklistId(undefined);
  };

  return (
    <div className="min-h-screen bg-canvas text-fg">
      <header className="sticky top-0 z-10 flex h-[50px] items-center justify-between border-b border-border bg-surface px-[18px] sm:px-7">
        <button
          className={iconButtonClass}
          onClick={() => {
            if (window.innerWidth >= 768) {
              setSidebarOpen((open) => !open);
            } else {
              setNavigationOpen((open) => !open);
            }
          }}
          aria-label={
            sidebarOpen || navigationOpen
              ? "Close notes and checklists"
              : "Open notes and checklists"
          }
          aria-expanded={sidebarOpen || navigationOpen}
          aria-controls="workspace-navigation"
        >
          {sidebarOpen || navigationOpen ? (
            <X size={20} aria-hidden="true" />
          ) : (
            <Menu size={20} aria-hidden="true" />
          )}
        </button>
        <Link
          to="/app"
          className="font-serif text-[25px] font-semibold text-fg no-underline"
        >
          yada yada<span className="text-accent">.</span>
        </Link>
        <button
          className={iconButtonClass}
          onClick={() => logout.mutate()}
          aria-label="Log out"
          title="Log out"
          disabled={logout.isPending}
        >
          <LogOut size={18} aria-hidden="true" />
        </button>
      </header>
      <div className="relative min-h-[calc(100vh-68px)] flex flex-col md:flex-row">
        <aside
          id="workspace-navigation"
          className={`border-b border-border bg-surface p-6 md:border-b-0 md:border-r md:px-4 md:w-80 md:flex-shrink-0 md:overflow-y-auto ${navigationOpen ? "block" : "hidden"} md:block ${!sidebarOpen ? "md:hidden" : ""}`}
          aria-label="Notes and checklists"
        >
          <div className="mb-4 flex items-center justify-between">
            <div className={`${sectionHeadingClass} md:hidden`}>
              <span className="text-sm">Notes & Checklists</span>
            </div>
          </div>
          <div className={sectionHeadingClass}>
            <span className="text-sm">Notes</span>
            <button
              className={miniButtonClass}
              onClick={startNote}
              aria-label="Create note"
            >
              <Plus size={16} aria-hidden="true" />
            </button>
          </div>
          {notes.isLoading && <CollectionState>Loading notes…</CollectionState>}
          {notes.isError && <ErrorNotice error={notes.error} />}
          {notes.data?.length === 0 && (
            <CollectionState>
              No notes yet. Create one with the plus button.
            </CollectionState>
          )}
          {notes.data?.map((note: Note) => (
            <div
              key={note.id}
              className={`group grid min-h-11 w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2.5 rounded-xl px-2.5 transition ${selectedNoteId === note.id ? "bg-surface-muted text-fg" : "bg-transparent text-muted hover:bg-surface-muted"}`}
            >
              <button
                className="col-span-2 flex items-center gap-2.5 rounded-xl border-0 text-left"
                onClick={() => {
                  setSelectedNoteId(note.id);
                  setCreatingNote(false);
                  setNavigationOpen(false);
                }}
              >
                <FileText size={16} aria-hidden="true" />
                <span className="overflow-hidden text-ellipsis whitespace-nowrap">{note.title}</span>
              </button>
              <button
                className={`${iconButtonClass} opacity-0 transition group-hover:opacity-100`}
                onClick={() => setDeleteConfirm({ noteId: note.id, title: note.title })}
                aria-label="Delete note"
              >
                <Trash2 size={16} aria-hidden="true" />
              </button>
            </div>
          ))}
          <div className={`${sectionHeadingClass} mt-7`}>
            <button
              className={miniButtonClass}
              type="button"
              onClick={startChecklist}
              aria-label="Create checklist"
            >
              <Plus size={16} aria-hidden="true" />
            </button>
            <span className="text-sm">Checklists</span>
          </div>
          {checklists.isLoading && (
            <CollectionState>Loading checklists…</CollectionState>
          )}
          {checklists.isError && <ErrorNotice error={checklists.error} />}
          {checklists.data?.length === 0 && (
            <CollectionState>
              No checklists yet. Create one with the plus button.
            </CollectionState>
          )}
          {checklists.data?.map((checklist) => (
            <ChecklistRow
              key={checklist.id}
              checklist={checklist}
              isSelected={selectedChecklistId === checklist.id}
              onSelect={() => {
                setSelectedChecklistId(checklist.id);
                setCreatingNote(false);
                setNavigationOpen(false);
              }}
              onDeleteRequest={() =>
                setDeleteChecklistConfirm({
                  checklistId: checklist.id,
                  title: checklist.title,
                })
              }
            />
          ))}
        </aside>
        <section
          className="bg-canvas p-5 sm:p-[clamp(24px,6vw,84px)] flex-1"
          aria-label="Note editor"
        >
          {creatingNote || selectedNote ? (
            <NoteEditor
              key={selectedNote?.id ?? "new-note"}
              note={selectedNote}
              onDone={closeEditor}
              onDeleted={closeEditor}
            />
          ) : creatingChecklist ? (
            <ChecklistEditor
              onCancel={closeChecklistEditor}
              onCreated={(checklist) => {
                setCreatingChecklist(false);
                setSelectedChecklistId(checklist.id);
                setNavigationOpen(false);
              }}
            />
          ) : selectedChecklist ? (
            <ChecklistPage
              key={selectedChecklist.id}
              checklist={selectedChecklist}
              onDone={closeChecklist}
            />
          ) : (
            <div className="flex min-h-[40vh] flex-col items-center justify-center text-center md:min-h-[55vh]">
              <div className="grid size-[58px] place-items-center rounded-[18px] bg-accent-soft text-accent-soft-foreground">
                <FileText size={28} aria-hidden="true" />
              </div>
              <h2 className="mb-2 mt-5 font-serif text-[30px] font-semibold text-fg">
                Your thoughts, in one place.
              </h2>
              <p className="text-muted">
                Choose a note or create a new one to begin.
              </p>
              <button className={`${buttonClass} mt-6`} onClick={startNote}>
                <Plus size={16} aria-hidden="true" /> New note
              </button>
            </div>
          )}
        </section>
      </div>
      <DeleteConfirmationModal
        isOpen={deleteConfirm !== null}
        title={deleteConfirm?.title ?? ""}
        onConfirm={() => {
          if (deleteConfirm) deleteNote.mutate(deleteConfirm.noteId);
        }}
        onCancel={() => setDeleteConfirm(null)}
        isPending={deleteNote.isPending}
      />
      <DeleteConfirmationModal
        isOpen={deleteChecklistConfirm !== null}
        title={deleteChecklistConfirm?.title ?? ""}
        onConfirm={() => {
          if (deleteChecklistConfirm) {
            deleteChecklist.mutate(deleteChecklistConfirm.checklistId);
          }
        }}
        onCancel={() => setDeleteChecklistConfirm(null)}
        isPending={deleteChecklist.isPending}
      />
    </div>
  );
}
