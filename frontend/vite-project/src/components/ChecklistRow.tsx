import { useState, type FormEvent } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Check, CheckSquare, Trash2 } from 'lucide-react'
import { api } from '../api'
import type { Checklist, ChecklistItem } from '../api'
import { CollectionState, ErrorNotice } from './ui'

export function ChecklistRow({ checklist }: { checklist: Checklist }) {
  const queryClient = useQueryClient()
  const [newItem, setNewItem] = useState('')
  const items = useQuery({ queryKey: ['items', checklist.id], queryFn: () => api.items(checklist.id) })
  const addItem = useMutation({
    mutationFn: (title: string) => api.createItem(checklist.id, title),
    onSuccess: async () => { setNewItem(''); await queryClient.invalidateQueries({ queryKey: ['items', checklist.id] }) },
  })
  const toggleItem = useMutation({
    mutationFn: (item: ChecklistItem) => api.updateItem(item.id, { is_done: !item.is_done }),
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
    if (window.confirm(`Delete “${checklist.title}” and all of its items?`)) deleteChecklist.mutate()
  }

  return (
    <div className="mb-3 rounded-xl bg-stone-100 p-2.5 dark:bg-stone-800/70">
      <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 text-[13px]">
        <CheckSquare size={16} aria-hidden="true" />
        <strong className="min-w-0 overflow-wrap-anywhere leading-relaxed">{checklist.title}</strong>
        <button className="grid size-11 place-items-center rounded-xl border-0 bg-transparent text-stone-600 transition hover:bg-stone-200 hover:text-red-700 dark:text-stone-300 dark:hover:bg-stone-700 dark:hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-50" onClick={requestDelete} aria-label={`Delete ${checklist.title} checklist`} disabled={deleteChecklist.isPending}><Trash2 size={14} aria-hidden="true" /></button>
      </div>
      {items.isLoading && <CollectionState>Loading items…</CollectionState>}
      {items.isError && <ErrorNotice error={items.error} />}
      {items.data?.length === 0 && <CollectionState>No items yet.</CollectionState>}
      {items.data?.map((item) => (
        <button className="flex min-h-11 w-full items-center gap-2 border-0 bg-transparent pl-6 text-left text-[13px] text-stone-700 dark:text-stone-200" key={item.id} onClick={() => toggleItem.mutate(item)} disabled={toggleItem.isPending} aria-pressed={item.is_done}>
          <span className={`grid size-4 shrink-0 place-items-center rounded-[5px] border ${item.is_done ? 'border-amber-600 bg-amber-600 text-white dark:border-amber-400 dark:bg-amber-400 dark:text-amber-950' : 'border-stone-300 dark:border-stone-600'}`} aria-hidden="true">{item.is_done && <Check size={12} />}</span>
          <span className={`min-w-0 overflow-wrap-anywhere leading-relaxed ${item.is_done ? 'text-stone-500 line-through dark:text-stone-400' : ''}`}>{item.title}</span>
        </button>
      ))}
      <form className="flex min-h-11 items-center pl-6 pt-2" onSubmit={submitItem}>
        <label className="sr-only" htmlFor={`new-item-${checklist.id}`}>Add item to {checklist.title}</label>
        <input id={`new-item-${checklist.id}`} className="w-full bg-transparent text-base text-stone-700 outline-none" value={newItem} onChange={(event) => setNewItem(event.target.value)} placeholder="Add item…" disabled={addItem.isPending} />
      </form>
      {(addItem.error || toggleItem.error || deleteChecklist.error) && <ErrorNotice error={addItem.error ?? toggleItem.error ?? deleteChecklist.error} />}
    </div>
  )
}
