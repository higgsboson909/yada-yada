import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Trash2 } from 'lucide-react'
import { api } from '../api'
import type { Note } from '../api'
import { buttonClass } from './styles'
import { ErrorNotice } from './ui'

const noteSchema = z.object({
  title: z.string().trim().min(1, 'Give your note a title'),
  content: z.string().trim().min(1, 'Write something first'),
})
type NoteForm = z.infer<typeof noteSchema>

type NoteEditorProps = {
  note?: Note
  onDone: () => void
  onDeleted: () => void
}

export function NoteEditor({ note, onDone, onDeleted }: NoteEditorProps) {
  const queryClient = useQueryClient()
  const { register, handleSubmit, formState: { errors } } = useForm<NoteForm>({
    resolver: zodResolver(noteSchema),
    defaultValues: { title: note?.title ?? '', content: note?.content ?? '' },
  })
  const saveNote = useMutation({
    mutationFn: (form: NoteForm) => note ? api.updateNote(note.id, form) : api.createNote(form),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['notes'] })
      onDone()
    },
  })
  const deleteNote = useMutation({
    mutationFn: () => api.deleteNote(note!.id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['notes'] })
      onDeleted()
    },
  })
  const pending = saveNote.isPending || deleteNote.isPending
  const requestDelete = () => {
    if (note && window.confirm(`Delete “${note.title}”? This cannot be undone.`)) deleteNote.mutate()
  }

  return (
    <form className="mx-auto flex min-h-[65vh] max-w-[760px] flex-col" onSubmit={handleSubmit((form) => saveNote.mutate(form))}>
      <label className="sr-only" htmlFor="note-title">Note title</label>
      <input id="note-title" className="bg-transparent font-serif text-[clamp(34px,5vw,52px)] font-bold text-stone-800 outline-none dark:text-stone-50" {...register('title')} placeholder="Untitled note" aria-invalid={Boolean(errors.title)} aria-describedby={errors.title ? 'note-title-error' : undefined} />
      {errors.title && <small id="note-title-error" className="text-red-700">{String(errors.title.message)}</small>}
      <label className="sr-only" htmlFor="note-content">Note content</label>
      <textarea id="note-content" className="mt-6 min-h-[420px] flex-1 resize-none bg-transparent font-serif text-lg leading-relaxed text-stone-700 outline-none dark:text-stone-200" {...register('content')} placeholder="Start writing…" aria-invalid={Boolean(errors.content)} aria-describedby={errors.content ? 'note-content-error' : undefined} />
      {errors.content && <small id="note-content-error" className="text-red-700">{String(errors.content.message)}</small>}
      {(saveNote.error || deleteNote.error) && <ErrorNotice error={saveNote.error ?? deleteNote.error} />}
      <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-stone-200 pt-5 dark:border-stone-700">
        {note && <button type="button" className="inline-flex min-h-11 items-center gap-2 rounded-xl px-4 py-3 text-red-700 transition hover:bg-red-50 dark:text-red-300 dark:hover:bg-red-950/50 disabled:cursor-not-allowed disabled:opacity-50" onClick={requestDelete} disabled={pending}><Trash2 size={16} aria-hidden="true" /> Delete note</button>}
        <span className="flex-1" />
        <button type="button" className="min-h-11 rounded-xl px-4 py-3 text-stone-600 transition hover:bg-stone-200 dark:text-stone-300 dark:hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-50" onClick={onDone} disabled={pending}>Cancel</button>
        <button className={buttonClass} disabled={pending}>{saveNote.isPending ? 'Saving…' : note ? 'Save changes' : 'Save note'}</button>
      </div>
    </form>
  )
}
