import type { ReactNode } from 'react'

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'The request could not be completed.'
}

export function ErrorNotice({ error }: { error: unknown }) {
  return (
    <div
      className="m-2 rounded-xl border border-danger-border bg-danger-surface px-3 py-2.5 text-[13px] leading-snug text-danger-foreground"
      role="alert"
    >
      {getErrorMessage(error)}
    </div>
  )
}

export function CollectionState({ children }: { children: ReactNode }) {
  return <p className="mx-2 mb-3 mt-1 text-xs leading-relaxed text-muted">{children}</p>
}

export function DeleteConfirmationModal({
  isOpen,
  title,
  onConfirm,
  onCancel,
  isPending,
}: {
  isOpen: boolean
  title: string
  onConfirm: () => void
  onCancel: () => void
  isPending?: boolean
}) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" role="dialog" aria-modal="true" aria-labelledby="delete-modal-title">
      <div className="w-full max-w-sm rounded-xl border border-border bg-surface p-6 shadow-lg">
        <h2 id="delete-modal-title" className="font-serif text-lg font-semibold text-fg">
          Delete "{title}"?
        </h2>
        <p className="mt-2 text-sm text-muted">This action cannot be undone.</p>
        <div className="mt-6 flex justify-between gap-2">
          <button
            onClick={onCancel}
            disabled={isPending}
            className="flex rounded-xl border border-border px-4 py-2.5 text-fg transition hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isPending}
            className="inline-flex min-h-11 border border-border items-center gap-2 rounded-xl px-4 py-2.5 text-danger transition hover:bg-danger-surface disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  )
}
