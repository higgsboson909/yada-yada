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
