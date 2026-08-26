export type User = { name: string; email: string }
export type Note = { id: string; title: string; content: string }
export type Checklist = { id: string; title: string }
export type ChecklistItem = {
  id: string
  checklist_id: string
  title: string
  is_done: boolean
}

type RequestOptions = RequestInit & { json?: unknown }
type ErrorPayload = { detail?: unknown; message?: unknown }

export const AUTH_TOKEN_KEY = 'yada_token'
export const UNAUTHORIZED_EVENT = 'yada:unauthorized'

const API_URL = import.meta.env.VITE_API_URL ?? ''

function errorMessage(payload: ErrorPayload | null): string {
  if (typeof payload?.detail === 'string') return payload.detail
  if (typeof payload?.message === 'string') return payload.message
  return 'The request could not be completed.'
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const token = localStorage.getItem(AUTH_TOKEN_KEY)
  const headers = new Headers(options.headers)
  let body = options.body

  if (options.json !== undefined) {
    headers.set('Content-Type', 'application/json')
    body = JSON.stringify(options.json)
  }
  if (token) headers.set('Authorization', `Bearer ${token}`)

  const response = await fetch(`${API_URL}${path}`, { ...options, body, headers })

  if (!response.ok) {
    if (response.status === 401 && token) {
      localStorage.removeItem(AUTH_TOKEN_KEY)
      window.dispatchEvent(new Event(UNAUTHORIZED_EVENT))
    }

    const payload = (await response.json().catch(() => null)) as ErrorPayload | null
    throw new Error(errorMessage(payload))
  }

  if (response.status === 204) return undefined as T
  return response.json() as Promise<T>
}

export const api = {
  signup: (user: { name: string; email: string; password: string }) =>
    request<User>('/user/signup', { method: 'POST', json: user }),
  login: (email: string, password: string) => {
    const form = new URLSearchParams({ username: email, password })
    return request<{ access_token: string; type: string }>('/user/token', {
      method: 'POST',
      body: form,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    })
  },
  logout: () => request<string>('/user/logout', { method: 'POST' }),
  notes: () => request<Note[]>('/notes/'),
  createNote: (note: Omit<Note, 'id'>) =>
    request<Note>('/notes/create/', { method: 'POST', json: note }),
  updateNote: (id: string, note: Partial<Omit<Note, 'id'>>) =>
    request<Note>(`/notes/${id}`, { method: 'PATCH', json: note }),
  deleteNote: (id: string) => request<Note>(`/notes/${id}`, { method: 'DELETE' }),
  checklists: () => request<Checklist[]>('/checklists/'),
  createChecklist: (title: string) =>
    request<Checklist>('/checklists/create', { method: 'POST', json: { title } }),
  deleteChecklist: (id: string) =>
    request<Checklist>(`/checklists/${id}`, { method: 'DELETE' }),
  items: (checklistId: string) =>
    request<ChecklistItem[]>(`/checklist_items/${checklistId}`),
  createItem: (checklistId: string, title: string) =>
    request<ChecklistItem>(`/checklist_items/${checklistId}/create`, {
      method: 'POST',
      json: { title, is_done: false },
    }),
  updateItem: (itemId: string, item: Partial<ChecklistItem>) =>
    request<ChecklistItem>(`/checklist_items/${itemId}`, { method: 'PATCH', json: item }),
}
