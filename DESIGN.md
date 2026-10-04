# Inkstep — Design System

The single source of truth for every visual decision on inkstep.site.
All values live in `src/styles/tokens.css`. No other stylesheet may contain a
raw color, a font name or a `px` value (outside `@media` queries) —
`npm run lint:tokens` fails the build if one appears.

## 1. Brand idea

Ink on paper, one step at a time. A handwritten wordmark, a single pen stroke
that climbs in steps, and an **orange dot** used as a signature full stop.
Layout borrows the confidence of award-showcase sites: oversized type, hard
rules, alternating light and inverse bands, a grid of cards, a ticker.

## 2. Color

| Token | Light | Dark | Use |
|---|---|---|---|
| `--color-paper` | `#F6F1E7` | `#161513` | Page ground |
| `--color-paper-2` | `#EDE5D6` | `#201E1B` | Hover wash, quiet surfaces |
| `--color-ink` | `#1C1B19` | `#EFE8DA` | Text, strokes, primary buttons |
| `--color-ink-2` | `#5A554C` | `#A79F90` | Secondary text (≥ 4.5:1 on paper) |
| `--color-line` | `#D8CFBF` | `#34312C` | Hairline rules, card borders |
| `--color-dot` | `#E2621B` | `#F07A2E` | Signature dot only — never text, never large fills |
| `--color-inverse-bg` | `#1C1B19` | `#0E0D0C` | Inverse bands (featured, join) |
| `--color-inverse-fg` | `#F6F1E7` | `#EFE8DA` | Text on inverse bands |
| `--color-inverse-2` | `#B9B1A2` | `#A79F90` | Secondary text on inverse bands |
| `--color-inverse-line` | `#3A3733` | `#2A2825` | Rules on inverse bands |
| `--ink-rgb` | `28 27 25` | `239 232 218` | Canvas ink blots (JS reads it) |

Rules: the dot appears at most once per viewport-height of content (hero
headline, featured preview, process end, footer wordmark). Status is never
shown by color alone.

## 3. Typography

| Token | Family | Use |
|---|---|---|
| `--font-mark` | Caveat 700 | The word "inkstep" only (no Vietnamese glyphs) |
| `--font-hand` | Patrick Hand | Handwritten notes and Vietnamese labels |
| `--font-sans` | Be Vietnam Pro 400/500/700/800 | Everything else |
| `--font-mono` | JetBrains Mono 500 | Labels, indices, meta |

Scale (fluid): `--text-xs` 12 · `--text-sm` 14 · `--text-md` 17 ·
`--text-lg` 20 · `--text-xl` 28 · `--text-2xl` 32→56 · `--text-3xl` 44→112 ·
`--text-display` 64→208. Display uses weight 800 and `--tracking-tight`.
Uppercase mono labels use `--tracking-wide`.

## 4. Space, size, shape

- Spacing: `--space-1…10` = 4, 8, 12, 16, 24, 32, 48, 64, 96, 128 px.
- Gutter: `--gutter` (16→64 px fluid). Max content width `--max-w` 1280 px.
- Measure: `--measure` 62ch for running text.
- Radius: `--radius-0` (cards, bands), `--radius-sm` 6 px (inputs), `--radius-pill` (buttons, chips).
- Rules: `--rule-hair` 1 px, `--rule-ink` 2 px, `--rule-stroke` 7 px (logo stroke).
- Touch target: `--size-touch` 48 px minimum.

## 5. Motion

`--dur-fast` 150 ms · `--dur-med` 400 ms · `--dur-slow` 900 ms ·
`--ease-out` · `--ease-spring`. One orchestrated moment per section.
Everything is disabled under `prefers-reduced-motion: reduce`, and content is
fully visible without JavaScript.

## 6. Breakpoints

`720px` (phone → tablet) and `1024px` (tablet → desktop). These two literals
are the only `px` allowed outside `tokens.css`, and only inside `@media`.

## 7. Components (atomic)

- **Atoms**: Button (solid / ghost / inverse), Chip (toggle), Label (mono),
  Dot, Wordmark, InkStroke, Icon.
- **Molecules**: StatTile, TeamCard, EventRow (accordion), StepItem, FilterBar.
- **Organisms**: SiteHeader, Hero, Ticker, FeaturedProject, TeamsGrid,
  ProcessTrack, EventsList, JoinBand, SiteFooter.

Components are pure functions `(props) → SafeHtml`. They never read the DOM,
the store or the network. Behavior lives in `src/client/`, state in
`src/state/`.

## 8. Accessibility (WCAG 2.1 AA)

Contrast ≥ 4.5:1 for text, 3:1 for UI and large text. Every control is a real
`<button>` or `<a>`, toggles expose `aria-pressed` / `aria-expanded`, focus is
always visible (`--color-dot` outline), there is a skip link, and nothing
depends on hover or on the custom cursor.
