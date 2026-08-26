// Shared Tailwind class recipes built on the design-system tokens
// defined in src/index.css. Components import these instead of
// repeating utility strings, so control styling stays consistent.

export const inputClass =
  'w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-fg outline-none transition placeholder:text-subtle focus:border-accent focus:ring-4 focus:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-55'
export const buttonClass =
  'inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50'
export const iconButtonClass =
  'grid size-11 place-items-center rounded-xl border-0 bg-transparent text-muted transition hover:bg-surface-muted hover:text-fg disabled:cursor-not-allowed disabled:opacity-50'
export const miniButtonClass = iconButtonClass
