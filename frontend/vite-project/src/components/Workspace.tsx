import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { FileText, LogOut, Menu, Plus, X } from 'lucide-react'
import { api } from '../api'
import type { Note } from '../api'
import { ChecklistRow } from './ChecklistRow'
import { NoteEditor } from './NoteEditor'
import { buttonClass, iconButtonClass, miniButtonClass } from './styles'
import { CollectionState, ErrorNotice } from './ui'

export function Workspace({ onLoggedOut }: { onLoggedOut: () => void }) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [selectedNoteId, setSelectedNoteId] = useState<string>()
  const [creatingNote, setCreatingNote] = useState(false)
  const [navigationOpen, setNavigationOpen] = useState(false)
  const [newChecklist, setNewChecklist] = useState('')
  const notes = useQuery({ queryKey: ['notes'], queryFn: api.notes })
  const checklists = useQuery({ queryKey: ['checklists'], queryFn: api.checklists })
  const selectedNote = notes.data?.find((note) => note.id === selectedNoteId)
  const logout = useMutation({
    mutationFn: api.logout,
    onSettled: () => { queryClient.clear(); onLoggedOut(); navigate('/login', { replace: true }) },
  })
  const createChecklist = useMutation({
    mutationFn: api.createChecklist,
    onSuccess: async () => { setNewChecklist(''); await queryClient.invalidateQueries({ queryKey: ['checklists'] }) },
  })
  const submitChecklist = (event: FormEvent) => {
    event.preventDefault()
    const title = newChecklist.trim()
    if (title && !createChecklist.isPending) createChecklist.mutate(title)
  }
  const startNote = () => { setSelectedNoteId(undefined); setCreatingNote(true); setNavigationOpen(false) }
  const closeEditor = () => { setSelectedNoteId(undefined); setCreatingNote(false) }

  return (
    <div className="min-h-screen bg-stone-50 text-stone-800 dark:bg-stone-950 dark:text-stone-100">
      <header className="sticky top-0 z-10 flex h-[68px] items-center justify-between border-b border-stone-200 bg-white px-[18px] dark:border-stone-800 dark:bg-stone-950 sm:px-7">
        <button className={`${iconButtonClass} md:hidden`} onClick={() => setNavigationOpen((open) => !open)} aria-label={navigationOpen ? 'Close notes and checklists' : 'Open notes and checklists'} aria-expanded={navigationOpen} aria-controls="workspace-navigation">
          {navigationOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
        </button>
        <Link to="/app" className="font-serif text-[25px] font-bold text-stone-800 no-underline dark:text-stone-50">yada yada<span className="text-amber-600 dark:text-amber-400">.</span></Link>
        <button className={iconButtonClass} onClick={() => logout.mutate()} aria-label="Log out" title="Log out" disabled={logout.isPending}><LogOut size={18} aria-hidden="true" /></button>
      </header>
      <div className="grid min-h-[calc(100vh-68px)] md:grid-cols-[320px_1fr]">
        <aside id="workspace-navigation" className={`${navigationOpen ? 'block' : 'hidden'} border-b border-stone-200 bg-white p-6 dark:border-stone-800 dark:bg-stone-900 md:block md:border-b-0 md:border-r md:px-4`} aria-label="Notes and checklists">
          <div className="flex items-center justify-between px-2 pb-2 text-[11px] font-extrabold tracking-[0.14em] text-stone-600 uppercase dark:text-stone-400"><span>Notes</span><button className={miniButtonClass} onClick={startNote} aria-label="Create note"><Plus size={16} aria-hidden="true" /></button></div>
          {notes.isLoading && <CollectionState>Loading notes…</CollectionState>}
          {notes.isError && <ErrorNotice error={notes.error} />}
          {notes.data?.length === 0 && <CollectionState>No notes yet. Create one with the plus button.</CollectionState>}
          {notes.data?.map((note: Note) => <button className={`grid min-h-11 w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2.5 rounded-xl border-0 px-2.5 text-left text-stone-700 transition hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-stone-800 ${selectedNoteId === note.id ? 'bg-stone-100 text-stone-900 dark:bg-stone-800 dark:text-white' : 'bg-transparent'}`} key={note.id} onClick={() => { setSelectedNoteId(note.id); setCreatingNote(false); setNavigationOpen(false) }}><FileText size={16} aria-hidden="true" /><span className="overflow-hidden text-ellipsis whitespace-nowrap">{note.title}</span></button>)}
          <div className="mb-2 mt-7 px-2 pb-2 text-[11px] font-extrabold tracking-[0.14em] text-stone-600 uppercase dark:text-stone-400">Checklists</div>
          {checklists.isLoading && <CollectionState>Loading checklists…</CollectionState>}
          {checklists.isError && <ErrorNotice error={checklists.error} />}
          {checklists.data?.length === 0 && <CollectionState>No checklists yet. Name one below.</CollectionState>}
          {checklists.data?.map((checklist) => <ChecklistRow key={checklist.id} checklist={checklist} />)}
          <form className="mt-2.5 grid grid-cols-[1fr_auto] gap-1.5 rounded-xl border border-dashed border-stone-400 p-2 pl-3 dark:border-stone-600" onSubmit={submitChecklist}>
            <label className="sr-only" htmlFor="new-checklist">New checklist name</label>
            <input id="new-checklist" className="w-full bg-transparent text-base text-stone-700 outline-none placeholder:text-stone-500 dark:text-stone-100 dark:placeholder:text-stone-400" value={newChecklist} onChange={(event) => setNewChecklist(event.target.value)} placeholder="New checklist" disabled={createChecklist.isPending} />
            <button className={miniButtonClass} aria-label="Create checklist" disabled={!newChecklist.trim() || createChecklist.isPending}><Plus size={16} aria-hidden="true" /></button>
          </form>
          {createChecklist.error && <ErrorNotice error={createChecklist.error} />}
        </aside>
        <section className="bg-stone-50 p-5 dark:bg-stone-950 sm:p-[clamp(24px,6vw,84px)]" aria-label="Note editor">
          {creatingNote || selectedNote ? (
            <NoteEditor key={selectedNote?.id ?? 'new-note'} note={selectedNote} onDone={closeEditor} onDeleted={closeEditor} />
          ) : (
            <div className="flex min-h-[40vh] flex-col items-center justify-center text-center md:min-h-[55vh]">
              <div className="grid size-[58px] place-items-center rounded-[18px] bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                <FileText size={28} aria-hidden="true" />
              </div>
              <h2 className="mb-2 mt-5 font-serif text-[30px] font-bold text-stone-800 dark:text-stone-50">
                Your thoughts, in one place.
              </h2>
              <p className="text-stone-600 dark:text-stone-300">Choose a note or create a new one to begin.</p>
              <button className={`${buttonClass} mt-6`} onClick={startNote}>
                <Plus size={16} aria-hidden="true" /> New note
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
