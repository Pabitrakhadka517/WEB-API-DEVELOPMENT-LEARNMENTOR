# LearnMentor UI Style Guide

## Color Palette

### Primary Colors
| Token | Hex | Usage |
|-------|-----|-------|
| `--primary` | `#2563eb` (blue-600) | Primary buttons, links, active states |
| `--primary-hover` | `#1d4ed8` (blue-700) | Button hover states |
| `--primary-light` | `#dbeafe` (blue-100) | Selected/active backgrounds |
| `--primary-lighter` | `#eff6ff` (blue-50) | Subtle highlight areas |

### Neutral Colors
| Token | Hex | Usage |
|-------|-----|-------|
| `--background` | `#ffffff` | Page backgrounds |
| `--surface` | `#f8fafc` (slate-50) | Sidebar, card backgrounds |
| `--surface-alt` | `#f1f5f9` (slate-100) | Alternating rows, subtle sections |
| `--border` | `#e2e8f0` (slate-200) | Card/section borders |
| `--border-strong` | `#cbd5e1` (slate-300) | Emphasized borders |

### Text Colors
| Token | Hex | Usage |
|-------|-----|-------|
| `--text-primary` | `#0f172a` (slate-900) | Headings, primary text |
| `--text-secondary` | `#475569` (slate-600) | Body text, descriptions |
| `--text-muted` | `#94a3b8` (slate-400) | Placeholders, hints |
| `--text-on-primary` | `#ffffff` | Text on primary-colored backgrounds |

### Status Colors
| Token | Hex | Usage |
|-------|-----|-------|
| `--success` | `#16a34a` (green-600) | Success states, verified badges |
| `--warning` | `#d97706` (amber-600) | Warning states, pending |
| `--error` | `#dc2626` (red-600) | Error states, destructive actions |
| `--info` | `#2563eb` (blue-600) | Info states, tips |

### Gradient
- **Hero gradient:** `from-blue-50 to-white`
- **Primary button gradient:** `from-blue-600 to-blue-700`
- **Accent cards:** `from-blue-600 to-indigo-700`

---

## Typography

### Font Family
- **Sans:** `Geist Sans` (system fallback: Inter, -apple-system, sans-serif)
- **Mono:** `Geist Mono` (system fallback: JetBrains Mono, monospace)

### Font Sizes & Weights
| Element | Size | Weight | Color |
|---------|------|--------|-------|
| Page Title (h1) | `text-3xl` / `text-4xl` | `font-bold` | `text-slate-900` |
| Section Title (h2) | `text-2xl` | `font-semibold` | `text-slate-800` |
| Card Title (h3) | `text-lg` | `font-semibold` | `text-slate-800` |
| Body | `text-base` | `font-normal` | `text-slate-600` |
| Caption/Label | `text-xs` / `text-sm` | `font-medium` | `text-slate-500` |
| Overline | `text-[10px]` | `font-semibold tracking-widest uppercase` | `text-blue-600` |

---

## Component Styles

### Buttons
- **Primary:** `bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6 py-3 font-semibold shadow-sm`
- **Secondary:** `bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl px-6 py-3 font-semibold`
- **Ghost:** `hover:bg-slate-100 text-slate-600 rounded-xl px-4 py-2 font-medium`
- **Destructive:** `bg-red-600 hover:bg-red-700 text-white rounded-xl px-6 py-3 font-semibold`

### Cards
- **Standard:** `bg-white border border-slate-200 rounded-2xl p-6 shadow-sm`
- **Elevated:** `bg-white border border-slate-200 rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow`
- **Interactive:** `bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:border-blue-300 hover:shadow-md transition-all`

### Inputs
- `bg-white border border-slate-300 rounded-xl px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500`

### Sidebar
- Background: `bg-white` or `bg-slate-50` with `border-r border-slate-200`
- Active item: `bg-blue-50 text-blue-700 border-l-2 border-blue-600`
- Inactive item: `text-slate-600 hover:bg-slate-100 hover:text-slate-900`

### Badges/Tags
- **Default:** `bg-slate-100 text-slate-600 rounded-full px-3 py-1 text-xs font-medium`
- **Primary:** `bg-blue-100 text-blue-700 rounded-full px-3 py-1 text-xs font-medium`
- **Success:** `bg-green-100 text-green-700 rounded-full px-3 py-1 text-xs font-medium`
- **Warning:** `bg-amber-100 text-amber-700 rounded-full px-3 py-1 text-xs font-medium`

---

## Spacing System
- Card padding: `p-6`
- Section gap: `space-y-8`
- Card grid gap: `gap-6`
- Page padding: `p-6 lg:p-10`

---

## Shadows
- `shadow-sm` — Minimal elevation (cards, inputs)
- `shadow-md` — Medium elevation (dropdowns, hover states)
- `shadow-lg` — High elevation (modals, overlays)

---

## Border Radius
- Buttons: `rounded-xl` (12px)
- Cards: `rounded-2xl` (16px)
- Inputs: `rounded-xl` (12px)
- Avatars: `rounded-full`
- Tags/Badges: `rounded-full`

---

## Responsive Breakpoints
- Mobile: `< 640px` (default)
- Tablet: `sm:` (640px+)
- Desktop: `lg:` (1024px+)
- Wide: `xl:` (1280px+)

## Dark Mode
Dark mode support is preserved via `.dark` class with `slate` tones:
- Background: `dark:bg-slate-900`
- Surface: `dark:bg-slate-800`
- Border: `dark:border-slate-700`
- Text: `dark:text-slate-100` / `dark:text-slate-400`
- Primary: unchanged (`blue-600`)
