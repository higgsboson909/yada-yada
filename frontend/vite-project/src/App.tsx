import { useEffect, useState, type FormEvent, type ReactNode } from 'react'
import { BrowserRouter, Link, Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Check,
  CheckSquare,
  ChevronRight,
  FileText,
  LogOut,
  Menu,
  Plus,
  Trash2,
  X,
} from 'lucide-react'
import { api, AUTH_TOKEN_KEY, UNAUTHORIZED_EVENT } from './api'
import type { Checklist, ChecklistItem, Note } from './api'
import './App.css'

const inputClass =
  'w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-amber-500 focus:ring-4 focus:ring-amber-100'
const buttonClass =
  'rounded-xl bg-stone-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-stone-700 disabled:cursor-not-allowed disabled:opacity-50'
const noteSchema = z.object({
  title: z.string().trim().min(1, 'Give your note a title'),
  content: z.string().trim().min(1, 'Write something first'),
})
const authSchema = z.object({
  name: z.string().optional(),
  email: z.email('Enter a valid email'),
  password: z.string().min(6, 'Use at least 6 characters'),
})

type NoteForm = z.infer<typeof noteSchema>
type AuthForm = z.infer<typeof authSchema>

type AuthProps = {
  signup?: boolean
  onAuthenticated: (token: string) => void
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'The request could not be completed.'
}

function ErrorNotice({ error }: { error: unknown }) {
  return (
    <div className="error" role="alert">
      {getErrorMessage(error)}
    </div>
  )
}

function CollectionState({ children }: { children: ReactNode }) {
  return <p className="collection-state">{children}</p>
}

function Auth({ signup = false, onAuthenticated }: AuthProps) {
  const navigate = useNavigate()
  const [submitError, setSubmitError] = useState<unknown>()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AuthForm>({
    resolver: zodResolver(authSchema),
    defaultValues: { name: '', email: '', password: '' },
  })

  const submit = async (form: AuthForm) => {
    try {
      setSubmitError(undefined)
      if (signup) {
        await api.signup({
          name: form.name?.trim() || 'Yada Yada user',
          email: form.email,
          password: form.password,
        })
        navigate('/login', { replace: true })
        return
      }

      const session = await api.login(form.email, form.password)
      onAuthenticated(session.access_token)
      navigate('/app', { replace: true })
    } catch (error) {
      setSubmitError(error)
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-card">
        <div className="brand-mark" aria-hidden="true">Y</div>
        <p className="eyebrow">YADA YADA</p>
        <h1>{signup ? 'Make space for your thoughts.' : 'Welcome back.'}</h1>
        <p className="muted">
          {signup
            ? 'Keep notes and checklists together without losing your train of thought.'
            : 'Pick up where you left off.'}
        </p>

        <form onSubmit={handleSubmit(submit)} className="stack" noValidate>
          {signup && (
            <label htmlFor="name">
              Name
              <input
                id="name"
                className={inputClass}
                {...register('name')}
                autoComplete="name"
                placeholder="Your name"
              />
            </label>
          )}
          <label htmlFor="email">
            Email
            <input
              id="email"
              className={inputClass}
              {...register('email')}
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? 'email-error' : undefined}
            />
            {errors.email && <small id="email-error">{String(errors.email.message)}</small>}
          </label>
          <label htmlFor="password">
            Password
            <input
              id="password"
              className={inputClass}
              type="password"
              {...register('password')}
              autoComplete={signup ? 'new-password' : 'current-password'}
              placeholder="••••••••"
              aria-invalid={Boolean(errors.password)}
              aria-describedby={errors.password ? 'password-error' : undefined}
            />
            {errors.password && <small id="password-error">{String(errors.password.message)}</small>}
          </label>
          {submitError !== undefined && <ErrorNotice error={submitError} />}
          <button className={buttonClass} disabled={isSubmitting}>
            {isSubmitting ? 'Please wait…' : signup ? 'Create account' : 'Log in'}
          </button>
        </form>

        <p className="auth-switch">
          {signup ? 'Already have an account?' : 'New to Yada Yada?'}{' '}
          <Link to={signup ? '/login' : '/signup'}>
            {signup ? 'Log in' : 'Create an account'}
          </Link>
        </p>
      </div>
    </main>
  )
}

type NoteEditorProps = {
  note?: Note
  onDone: () => void
  onDeleted: () => void
}

function NoteEditor({ note, onDone, onDeleted }: NoteEditorProps) {
  const queryClient = useQueryClient()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NoteForm>({
    resolver: zodResolver(noteSchema),
    defaultValues: { title: note?.title ?? '', content: note?.content ?? '' },
  })

  const saveNote = useMutation({
    mutationFn: (form: NoteForm) =>
      note ? api.updateNote(note.id, form) : api.createNote(form),
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
    if (note && window.confirm(`Delete “${note.title}”? This cannot be undone.`)) {
      deleteNote.mutate()
    }
  }

  return (
    <form className="editor" onSubmit={handleSubmit((form) => saveNote.mutate(form))}>
      <label className="sr-only" htmlFor="note-title">Note title</label>
      <input
        id="note-title"
        className="editor-title"
        {...register('title')}
        placeholder="Untitled note"
        aria-invalid={Boolean(errors.title)}
        aria-describedby={errors.title ? 'note-title-error' : undefined}
      />
      {errors.title && <small id="note-title-error">{String(errors.title.message)}</small>}

      <label className="sr-only" htmlFor="note-content">Note content</label>
      <textarea
        id="note-content"
        className="editor-body"
        {...register('content')}
        placeholder="Start writing…"
        aria-invalid={Boolean(errors.content)}
        aria-describedby={errors.content ? 'note-content-error' : undefined}
      />
      {errors.content && <small id="note-content-error">{String(errors.content.message)}</small>}

      {(saveNote.error || deleteNote.error) && (
        <ErrorNotice error={saveNote.error ?? deleteNote.error} />
      )}
      <div className="editor-actions">
        {note && (
          <button
            type="button"
            className="danger-button"
            onClick={requestDelete}
            disabled={pending}
          >
            <Trash2 size={16} aria-hidden="true" /> Delete note
          </button>
        )}
        <span className="action-spacer" />
        <button type="button" className="ghost" onClick={onDone} disabled={pending}>
          Cancel
        </button>
        <button className={buttonClass} disabled={pending}>
          {saveNote.isPending ? 'Saving…' : note ? 'Save changes' : 'Save note'}
        </button>
      </div>
    </form>
  )
}

type WorkspaceProps = {
  onLoggedOut: () => void
}

function Workspace({ onLoggedOut }: WorkspaceProps) {
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
    onSettled: () => {
      queryClient.clear()
      onLoggedOut()
      navigate('/login', { replace: true })
    },
  })
  const createChecklist = useMutation({
    mutationFn: api.createChecklist,
    onSuccess: async () => {
      setNewChecklist('')
      await queryClient.invalidateQueries({ queryKey: ['checklists'] })
    },
  })

  const submitChecklist = (event: FormEvent) => {
    event.preventDefault()
    const title = newChecklist.trim()
    if (title && !createChecklist.isPending) createChecklist.mutate(title)
  }

  const startNote = () => {
    setSelectedNoteId(undefined)
    setCreatingNote(true)
    setNavigationOpen(false)
  }
  const closeEditor = () => {
    setSelectedNoteId(undefined)
    setCreatingNote(false)
  }

  return (
    <div className="workspace">
      <header className="topbar">
        <button
          className="icon-button navigation-toggle"
          onClick={() => setNavigationOpen((open) => !open)}
          aria-label={navigationOpen ? 'Close notes and checklists' : 'Open notes and checklists'}
          aria-expanded={navigationOpen}
          aria-controls="workspace-navigation"
        >
          {navigationOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
        </button>
        <Link to="/app" className="logo">yada yada<span>.</span></Link>
        <button
          className="icon-button"
          onClick={() => logout.mutate()}
          aria-label="Log out"
          title="Log out"
          disabled={logout.isPending}
        >
          <LogOut size={18} aria-hidden="true" />
        </button>
      </header>

      <div className="content">
        <aside
          id="workspace-navigation"
          className={navigationOpen ? 'navigation-open' : ''}
          aria-label="Notes and checklists"
        >
          <div className="section-heading">
            <span>Notes</span>
            <button className="mini-button" onClick={startNote} aria-label="Create note">
              <Plus size={16} aria-hidden="true" />
            </button>
          </div>

          {notes.isLoading && <CollectionState>Loading notes…</CollectionState>}
          {notes.isError && <ErrorNotice error={notes.error} />}
          {notes.data?.length === 0 && (
            <CollectionState>No notes yet. Create one with the plus button.</CollectionState>
          )}
          {notes.data?.map((note) => (
            <button
              className={`list-row ${selectedNoteId === note.id ? 'active' : ''}`}
              key={note.id}
              onClick={() => {
                setSelectedNoteId(note.id)
                setCreatingNote(false)
                setNavigationOpen(false)
              }}
            >
              <FileText size={16} aria-hidden="true" />
              <span>{note.title}</span>
              <ChevronRight size={14} aria-hidden="true" />
            </button>
          ))}

          <div className="section-heading checklist-heading"><span>Checklists</span></div>
          {checklists.isLoading && <CollectionState>Loading checklists…</CollectionState>}
          {checklists.isError && <ErrorNotice error={checklists.error} />}
          {checklists.data?.length === 0 && (
            <CollectionState>No checklists yet. Name one below.</CollectionState>
          )}
          {checklists.data?.map((checklist) => (
            <ChecklistRow key={checklist.id} checklist={checklist} />
          ))}

          <form className="new-list" onSubmit={submitChecklist}>
            <label className="sr-only" htmlFor="new-checklist">New checklist name</label>
            <input
              id="new-checklist"
              value={newChecklist}
              onChange={(event) => setNewChecklist(event.target.value)}
              placeholder="New checklist"
              disabled={createChecklist.isPending}
            />
            <button
              className="mini-button"
              aria-label="Create checklist"
              disabled={!newChecklist.trim() || createChecklist.isPending}
            >
              <Plus size={16} aria-hidden="true" />
            </button>
          </form>
          {createChecklist.error && <ErrorNotice error={createChecklist.error} />}
        </aside>

        <section className="main-panel" aria-label="Note editor">
          {creatingNote || selectedNote ? (
            <NoteEditor
              key={selectedNote?.id ?? 'new-note'}
              note={selectedNote}
              onDone={closeEditor}
              onDeleted={closeEditor}
            />
          ) : (
            <div className="empty-state">
              <div className="empty-icon"><FileText size={28} aria-hidden="true" /></div>
              <h2>Your thoughts, in one place.</h2>
              <p className="muted">Choose a note or create a new one to begin.</p>
              <button className={buttonClass} onClick={startNote}>
                <Plus size={16} aria-hidden="true" /> New note
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

function ChecklistRow({ checklist }: { checklist: Checklist }) {
  const queryClient = useQueryClient()
  const [newItem, setNewItem] = useState('')
  const items = useQuery({
    queryKey: ['items', checklist.id],
    queryFn: () => api.items(checklist.id),
  })
  const addItem = useMutation({
    mutationFn: (title: string) => api.createItem(checklist.id, title),
    onSuccess: async () => {
      setNewItem('')
      await queryClient.invalidateQueries({ queryKey: ['items', checklist.id] })
    },
  })
  const toggleItem = useMutation({
    mutationFn: (checklistItem: ChecklistItem) =>
      api.updateItem(checklistItem.id, { is_done: !checklistItem.is_done }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['items', checklist.id] }),
  })
  const deleteChecklist = useMutation({
    mutationFn: () => api.deleteChecklist(checklist.id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['checklists'] }),
  })

  const submitItem = (event: FormEvent) => {
    event.preventDefault()
    const title = newItem.trim()
    if (title && !addItem.isPending) addItem.mutate(title)
  }
  const requestDelete = () => {
    if (window.confirm(`Delete “${checklist.title}” and all of its items?`)) {
      deleteChecklist.mutate()
    }
  }

  return (
    <div className="checklist">
      <div className="checklist-title">
        <CheckSquare size={16} aria-hidden="true" />
        <strong>{checklist.title}</strong>
        <button
          className="checklist-delete"
          onClick={requestDelete}
          aria-label={`Delete ${checklist.title} checklist`}
          disabled={deleteChecklist.isPending}
        >
          <Trash2 size={14} aria-hidden="true" />
        </button>
      </div>

      {items.isLoading && <CollectionState>Loading items…</CollectionState>}
      {items.isError && <ErrorNotice error={items.error} />}
      {items.data?.length === 0 && <CollectionState>No items yet.</CollectionState>}
      {items.data?.map((checklistItem) => (
        <button
          className="item"
          key={checklistItem.id}
          onClick={() => toggleItem.mutate(checklistItem)}
          disabled={toggleItem.isPending}
          aria-pressed={checklistItem.is_done}
        >
          <span className={`checkbox ${checklistItem.is_done ? 'done' : ''}`} aria-hidden="true">
            {checklistItem.is_done && <Check size={12} />}
          </span>
          <span className={checklistItem.is_done ? 'completed' : ''}>{checklistItem.title}</span>
        </button>
      ))}

      <form className="item-add" onSubmit={submitItem}>
        <label className="sr-only" htmlFor={`new-item-${checklist.id}`}>
          Add item to {checklist.title}
        </label>
        <input
          id={`new-item-${checklist.id}`}
          value={newItem}
          onChange={(event) => setNewItem(event.target.value)}
          placeholder="Add item…"
          disabled={addItem.isPending}
        />
      </form>
      {(addItem.error || toggleItem.error || deleteChecklist.error) && (
        <ErrorNotice error={addItem.error ?? toggleItem.error ?? deleteChecklist.error} />
      )}
    </div>
  )
}

function AppRoutes() {
  const [token, setToken] = useState(() => localStorage.getItem(AUTH_TOKEN_KEY))

  useEffect(() => {
    const clearAuthentication = () => setToken(null)
    window.addEventListener(UNAUTHORIZED_EVENT, clearAuthentication)
    return () => window.removeEventListener(UNAUTHORIZED_EVENT, clearAuthentication)
  }, [])

  const authenticate = (accessToken: string) => {
    localStorage.setItem(AUTH_TOKEN_KEY, accessToken)
    setToken(accessToken)
  }
  const clearAuthentication = () => {
    localStorage.removeItem(AUTH_TOKEN_KEY)
    setToken(null)
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to={token ? '/app' : '/login'} replace />} />
      <Route
        path="/login"
        element={token ? <Navigate to="/app" replace /> : <Auth onAuthenticated={authenticate} />}
      />
      <Route
        path="/signup"
        element={
          token ? <Navigate to="/app" replace /> : <Auth signup onAuthenticated={authenticate} />
        }
      />
      <Route
        path="/app"
        element={token ? <Workspace onLoggedOut={clearAuthentication} /> : <Navigate to="/login" replace />}
      />
      <Route path="*" element={<Navigate to={token ? '/app' : '/login'} replace />} />
    </Routes>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}

export default App
