# Yada Yada frontend design system

All color and font decisions live as **tokens** in `src/index.css` and are
consumed across the app as Tailwind utilities. Components never hard-code
`stone-*` / `amber-*` / hex values — they reference semantic roles, so changing
a token restyles the whole app and light/dark stay in sync.

## Fonts

Loaded in `index.html` (Google Fonts, `display=swap`) and wired through
`@theme` font tokens:

| Token | Utility | Face | Role |
|---|---|---|---|
| `--font-serif` | `font-serif` | Newsreader | Display / headings / editor text (editorial voice) |
| `--font-sans` | `font-sans` (body default) | Public Sans | UI, labels, controls |

`font-synthesis: none` + metric fallbacks keep text readable before the web
fonts load.

## Color tokens

Defined once as theme-switching variables (`--ds-*`) with a light default and a
`prefers-color-scheme: dark` override, then exposed to Tailwind via
`@theme inline` so utilities like `bg-surface` automatically follow the theme
(no `dark:` variants needed in components).

| Token | Utilities | Role |
|---|---|---|
| `canvas` | `bg-canvas` | Page background |
| `surface` | `bg-surface` | Cards, header, sidebar, inputs |
| `surface-muted` | `bg-surface-muted` | Subtle fills, hover, active rows |
| `border` | `border-border` | Default separators |
| `border-strong` | `border-border-strong` | Dashed / emphasized borders |
| `fg` | `text-fg` | Primary text |
| `muted` | `text-muted` | Secondary text (contrast-checked) |
| `subtle` | `text-subtle` | Metadata, section labels, completed items |
| `primary` / `primary-foreground` / `primary-hover` | `bg-primary`, `text-primary-foreground`, `hover:bg-primary-hover` | Primary action buttons + brand mark |
| `accent` / `accent-foreground` | `text-accent`, `bg-accent`, `text-accent-foreground` | Amber brand accent, links, checked state |
| `accent-soft` / `accent-soft-foreground` | `bg-accent-soft`, `text-accent-soft-foreground` | Soft badges (empty-state icon) |
| `ring` | `focus:ring-ring`, focus outline | Focus indicator |
| `danger` / `danger-foreground` / `danger-surface` / `danger-border` | `text-danger`, `bg-danger-surface`, ... | Errors and destructive actions |

## Shared class recipes

Repeated control styling lives in `src/components/styles.ts`
(`inputClass`, `buttonClass`, `iconButtonClass`) so buttons and inputs stay
consistent without duplicating utility strings.

## Rules

- Add a new token in `index.css` (both light and the dark block) before using
  it; never introduce raw palette colors in components.
- Keep global CSS limited to tokens, resets, base typography, and a11y
  primitives (focus ring, reduced motion). All component styling stays in the
  components via Tailwind utilities.
