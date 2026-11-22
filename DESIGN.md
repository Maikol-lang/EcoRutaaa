# EcoRuta Design System — Editorial Contemporary Redesign

## Project Context
EcoRuta is a waste management application for Girardot, Colombia. The redesign transforms the visual language from dark/neon cyberpunk to **editorial contemporary + warm elegant minimalism + modern SaaS with technological personality** while preserving all functionality.

---

## Color Palette

### Core Neutrals (Light Mode)
| Token | Hex | Usage |
|-------|-----|-------|
| `--color-ivory` | `#FAF9F6` | Primary background |
| `--color-white` | `#FFFFFF` | Card surfaces, modals |
| `--color-stone-50` | `#F8F7F4` | Subtle section alternates |
| `--color-stone-100` | `#F0EDE8` | Borders, dividers |
| `--color-stone-200` | `#E2DED5` | Input borders, subtle lines |
| `--color-stone-300` | `#D1CDC0` | Disabled states |
| `--color-stone-500` | `#A8A296` | Placeholder text, secondary icons |
| `--color-stone-700` | `#787165` | Secondary text |
| `--color-charcoal-900` | `#1C1B18` | Primary text, headings |
| `--color-charcoal-950` | `#0F0E0D` | Highest emphasis text |

### Brand Colors — Natural Greens
| Token | Hex | Usage |
|-------|-----|-------|
| `--color-sage-50` | `#F0F5F0` | Green-tinted backgrounds |
| `--color-sage-100` | `#DCE8DC` | Light green accents |
| `--color-sage-500` | `#6B8E6B` | Secondary actions, badges |
| `--color-sage-600` | `#5A7A5A` | Hover states |
| `--color-forest-600` | `#2D5A2D` | Primary brand, CTAs |
| `--color-forest-700` | `#244724` | Primary hover |
| `--color-forest-800` | `#1B351B` | Primary active |

### Brand Colors — Sky Blues
| Token | Hex | Usage |
|-------|-----|-------|
| `--color-sky-50` | `#EFF6FF` | Blue-tinted backgrounds |
| `--color-sky-100` | `#D6E9F8` | Light blue accents |
| `--color-sky-500` | `#3B82F6` | Info states, links |
| `--color-sky-600` | `#2563EB` | Interactive hover |

### Strategic Accents (Sparing)
| Token | Hex | Usage |
|-------|-----|-------|
| `--color-amber-500` | `#F59E0B` | Warnings, pending states |
| `--color-amber-100` | `#FEF3C7` | Warning backgrounds |
| `--color-coral-500` | `#F97316` | Destructive actions, errors |
| `--color-coral-100` | `#FFEDD5` | Error backgrounds |
| `--color-violet-500` | `#8B5CF6` | Premium/achievement highlights |

### Semantic Aliases (for components)
```css
--color-bg-primary: var(--color-ivory);
--color-bg-secondary: var(--color-white);
--color-bg-tertiary: var(--color-stone-50);
--color-border-subtle: var(--color-stone-200);
--color-border-default: var(--color-stone-300);
--color-text-primary: var(--color-charcoal-900);
--color-text-secondary: var(--color-stone-700);
--color-text-muted: var(--color-stone-500);
--color-brand-primary: var(--color-forest-600);
--color-brand-primary-hover: var(--color-forest-700);
--color-brand-secondary: var(--color-sky-600);
--color-success: var(--color-forest-600);
--color-warning: var(--color-amber-500);
--color-error: var(--color-coral-500);
--color-focus: var(--color-sky-500);
```

---

## Typography

### Font Families
| Role | Font | Source |
|------|------|--------|
| **Display** | `Fraunces` (serif, variable) | Google Fonts |
| **UI / Body** | `DM Sans` (sans, variable) | Google Fonts |
| **Mono** | `JetBrains Mono` | Google Fonts |

### Type Scale (Fluid, clamp-based)
| Token | Mobile | Desktop | Weight | Line Height | Letter Spacing |
|-------|--------|---------|--------|-------------|----------------|
| `--text-display-xl` | `clamp(2.5rem, 5vw, 4.5rem)` | 72px | 700 | 1.05 | -0.02em |
| `--text-display-lg` | `clamp(2rem, 4vw, 3.5rem)` | 56px | 600 | 1.1 | -0.015em |
| `--text-display-md` | `clamp(1.75rem, 3vw, 2.5rem)` | 40px | 600 | 1.15 | -0.01em |
| `--text-h1` | `clamp(1.5rem, 2.5vw, 2.25rem)` | 36px | 700 | 1.2 | -0.01em |
| `--text-h2` | `clamp(1.25rem, 2vw, 1.75rem)` | 28px | 600 | 1.25 | 0 |
| `--text-h3` | `clamp(1.125rem, 1.5vw, 1.375rem)` | 22px | 600 | 1.3 | 0 |
| `--text-h4` | `1.125rem` | 18px | 600 | 1.35 | 0 |
| `--text-lg` | `1.125rem` | 18px | 400 | 1.6 | 0 |
| `--text-base` | `1rem` | 16px | 400 | 1.6 | 0 |
| `--text-sm` | `0.875rem` | 14px | 400 | 1.5 | 0 |
| `--text-xs` | `0.75rem` | 12px | 500 | 1.4 | 0.02em |
| `--text-mono` | `0.875rem` | 14px | 400 | 1.5 | 0 |

### Font Feature Settings
```css
--font-display: 'Fraunces', serif;
--font-ui: 'DM Sans', sans-serif;
--font-mono: 'JetBrains Mono', monospace;

--font-feature-display: "cv02" "cv03" "cv04" "cv11" "ss01" "ss02" "ss03";
--font-feature-ui: "cv02" "cv03" "cv04" "cv11";
```

---

## Spacing & Layout

### Space Scale (8px base)
| Token | Value |
|-------|-------|
| `--space-1` | 4px |
| `--space-2` | 8px |
| `--space-3` | 12px |
| `--space-4` | 16px |
| `--space-5` | 20px |
| `--space-6` | 24px |
| `--space-8` | 32px |
| `--space-10` | 40px |
| `--space-12` | 48px |
| `--space-16` | 64px |
| `--space-20` | 80px |
| `--space-24` | 96px |
| `--space-32` | 128px |

### Container Widths
| Token | Value |
|-------|-------|
| `--container-sm` | 640px |
| `--container-md` | 768px |
| `--container-lg` | 1024px |
| `--container-xl` | 1280px |
| `--container-2xl` | 1440px |

### Border Radius Scale
| Token | Value | Usage |
|-------|-------|-------|
| `--radius-none` | 0 | Sharp elements |
| `--radius-sm` | 4px | Badges, tags |
| `--radius-md` | 8px | Buttons, inputs |
| `--radius-lg` | 12px | Cards, panels |
| `--radius-xl` | 16px | Modals, elevated surfaces |
| `--radius-2xl` | 24px | Hero images, featured cards |
| `--radius-full` | 9999px | Pills, avatars |

### Shadow Scale (Layered, warm)
| Token | Value |
|-------|-------|
| `--shadow-xs` | `0 1px 2px rgb(28 27 24 / 0.04)` |
| `--shadow-sm` | `0 1px 3px rgb(28 27 24 / 0.06), 0 1px 2px rgb(28 27 24 / 0.04)` |
| `--shadow-md` | `0 4px 6px -1px rgb(28 27 24 / 0.06), 0 2px 4px -2px rgb(28 27 24 / 0.04)` |
| `--shadow-lg` | `0 10px 15px -3px rgb(28 27 24 / 0.08), 0 4px 6px -4px rgb(28 27 24 / 0.04)` |
| `--shadow-xl` | `0 20px 25px -5px rgb(28 27 24 / 0.1), 0 8px 10px -6px rgb(28 27 24 / 0.04)` |
| `--shadow-2xl` | `0 25px 50px -12px rgb(28 27 24 / 0.15)` |

---

## Component Styles

### Buttons
```css
.btn {
  --btn-height: 44px;
  --btn-padding-x: 24px;
  --btn-radius: var(--radius-md);
  --btn-font: var(--font-ui);
  --btn-font-size: var(--text-sm);
  --btn-font-weight: 500;
  --btn-transition: transform 120ms ease-out, box-shadow 120ms ease-out, background-color 120ms ease-out, border-color 120ms ease-out;
}

.btn:active { transform: scale(0.97); }
@media (hover: hover) { .btn:hover { transform: translateY(-1px); } }

/* Primary — Forest green, high contrast */
.btn-primary {
  background: var(--color-brand-primary);
  color: white;
  border: none;
  box-shadow: var(--shadow-sm);
}
.btn-primary:hover { background: var(--color-brand-primary-hover); box-shadow: var(--shadow-md); }
.btn-primary:focus-visible { outline: 2px solid var(--color-focus); outline-offset: 2px; }

/* Secondary — Outlined, stone border */
.btn-secondary {
  background: transparent;
  color: var(--color-text-primary);
  border: 1px solid var(--color-border-default);
}
.btn-secondary:hover { background: var(--color-stone-50); border-color: var(--color-stone-400); }

/* Ghost — Minimal, text only */
.btn-ghost {
  background: transparent;
  color: var(--color-text-secondary);
  border: none;
  padding: 8px 12px;
}
.btn-ghost:hover { color: var(--color-text-primary); background: var(--color-stone-100); }

/* Destructive */
.btn-destructive {
  background: var(--color-error);
  color: white;
  border: none;
}
.btn-destructive:hover { background: #E85D0D; }
```

### Form Inputs
```css
.input {
  width: 100%;
  height: 48px;
  padding: 0 16px;
  background: var(--color-white);
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-md);
  color: var(--color-text-primary);
  font: var(--text-base) var(--font-ui);
  transition: border-color 120ms ease-out, box-shadow 120ms ease-out;
}
.input::placeholder { color: var(--color-text-muted); }
.input:hover { border-color: var(--color-stone-400); }
.input:focus { outline: none; border-color: var(--color-focus); box-shadow: 0 0 0 3px var(--color-sky-100); }
.input:disabled { background: var(--color-stone-50); color: var(--color-text-muted); cursor: not-allowed; }
```

### Cards
```css
.card {
  background: var(--color-white);
  border: 1px solid var(--color-border-subtle);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xs);
  transition: box-shadow 200ms ease-out, border-color 200ms ease-out, transform 200ms ease-out;
}
.card:hover { box-shadow: var(--shadow-md); border-color: var(--color-border-default); }
.card:active { transform: scale(0.99); }

.card-elevated {
  box-shadow: var(--shadow-lg);
  border-color: transparent;
}

.card-interactive:hover { transform: translateY(-2px); box-shadow: var(--shadow-lg); }
```

### Badges / Tags
```css
.badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  font: var(--text-xs) var(--font-ui);
  border-radius: var(--radius-full);
  border: 1px solid transparent;
}

.badge-default { background: var(--color-stone-100); color: var(--color-text-secondary); border-color: var(--color-stone-200); }
.badge-success { background: var(--color-sage-50); color: var(--color-forest-700); border-color: var(--color-sage-100); }
.badge-warning { background: var(--color-amber-100); color: #92400E; border-color: var(--color-amber-200); }
.badge-error { background: var(--color-coral-100); color: #9A2E0A; border-color: #FED3C5; }
.badge-info { background: var(--color-sky-50); color: var(--color-sky-700); border-color: var(--color-sky-100); }
.badge-premium { background: linear-gradient(135deg, var(--color-violet-500), #A855F7); color: white; }
```

---

## Section Personalities (Unique Visual Identity per Route)

| Route | Personality | Visual Treatment |
|-------|-------------|------------------|
| **Landing** | Editorial Hero | Large Fraunces display, generous whitespace, asymmetric layout, scroll-reveal moments |
| **CitizenApp (Dashboard)** | SaaS Command Center | Dense but breathable, data-first, subtle grid, monospace for metrics |
| **MapView** | Technical Explorer | Full-bleed map, floating glass panels, precise iconography, sky-blue accents |
| **WasteGuide** | Educational Reference | Card-based encyclopedia, sage-green system, clear hierarchy, search-forward |
| **CleanPoints** | Community Directory | Warm cards, location photography, amber accents for "visit" actions |
| **Rewards** | Achievement Gallery | Violet premium accents, progress rings, card loops on hover |
| **Notifications** | Information Feed | Clean list, priority color coding, swipe actions |
| **Profile** | Personal Canvas | Asymmetric avatar, sage/sky split, editorial typography for stats |
| **AdminPanel** | Control Room | Dense tables, monospace data, forest primary, coral for alerts |
| **Login/Register** | Gateway | Centered, minimal, single Fraunces headline, generous padding |

---

## Animation Principles (Emil Kowalski Philosophy)

### Decision Framework (applied to every animation)
1. **Frequency** — How often seen? High frequency = no animation or <100ms
2. **Purpose** — Spatial consistency, state indication, explanation, feedback, preventing jarring changes
3. **Easing** — Enter/exit = ease-out (custom cubic-bezier); on-screen movement = ease-in-out; hover = ease
4. **Duration** — Button press: 100-160ms; Tooltips: 125-200ms; Dropdowns: 150-250ms; Modals: 200-400ms

### Custom Easing Curves
```css
--ease-out: cubic-bezier(0.23, 1, 0.32, 1);      /* Strong ease-out for UI */
--ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);  /* Natural movement */
--ease-drawer: cubic-bezier(0.32, 0.72, 0, 1);   /* iOS-like sheets */
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1); /* Subtle bounce for delight */
```

### GSAP-Specific Patterns
- **Context**: Always use `gsap.context()` for React component cleanup
- **ScrollTrigger**: Only for explanatory/scroll-linked moments (not every section)
- **Reduced Motion**: Respect `prefers-reduced-motion` — disable transform animations, keep opacity/color
- **Stagger**: 30-80ms between items, never block interaction
- **Transforms only**: Animate `x`, `y`, `scale`, `rotation`, `opacity` — never layout properties

### Animation Inventory (What Gets Animated)
| Element | Animation | Duration | Easing | Trigger |
|---------|-----------|----------|--------|---------|
| Hero entrance | Fade + slide up (staggered) | 800ms | ease-out | Load (once) |
| Button press | Scale 0.97 | 100ms | ease-out | Active |
| Button hover | TranslateY(-1px) + shadow | 120ms | ease-out | Hover |
| Card hover (interactive) | TranslateY(-2px) + shadow | 200ms | ease-out | Hover |
| Card enter (lists) | Fade + slide up stagger | 400ms | ease-out | IntersectionObserver |
| Modal/Drawer enter | Scale 0.95→1 + fade | 250ms | ease-out | Open |
| Toast enter | Slide from right + fade | 300ms | ease-out | Mount |
| Tab indicator | Slide + width morph | 200ms | ease-in-out | Tab change |
| Progress rings | Stroke dasharray | 600ms | ease-spring | Visible |
| Map markers | Scale pulse (subtle) | 2000ms | ease-in-out | Loop (reduced motion: off) |
| Counter numbers | Count up | 1200ms | ease-out | Scroll into view |

### What Does NOT Animate
- Keyboard navigation (focus rings only)
- High-frequency toggles (sidebar, command palette)
- Table row hover (too frequent)
- Every section on scroll (only hero + 1-2 dealt moments)
- Parallax on text

---

## Responsive Breakpoints (Mobile-First)
| Breakpoint | Token | Target |
|------------|-------|--------|
| Mobile | `--bp-sm` | 390px |
| Mobile Large | `--bp-md` | 768px |
| Tablet | `--bp-lg` | 1024px |
| Desktop | `--bp-xl` | 1280px |
| Wide | `--bp-2xl` | 1440px |

### Layout Principles
- Single column ≤ 768px
- Two-column grid 768px–1024px
- Three-column + sidebar ≥ 1024px
- Touch targets: minimum 44×44px
- No horizontal scroll at 320px

---

## Iconography
- **Primary**: Lucide React (consistent, clean)
- **Style**: 2px stroke, 24×24 default, 20×20 compact
- **Color**: Inherit `currentColor` for seamless text integration
- **Real icons**: For external services (Leaflet, auth providers) — use actual brand icons

---

## Accessibility Checklist
- [ ] Contrast ratio ≥ 4.5:1 for text, 3:1 for UI elements
- [ ] Focus visible on all interactive elements (2px solid focus ring, offset 2px)
- [ ] Reduced motion respected (disable transforms, keep opacity)
- [ ] Semantic HTML (heading hierarchy, landmarks, labels)
- [ ] Touch targets ≥ 44×44px
- [ ] No color-only information (icons + text for status)
- [ ] ARIA labels where needed
- [ ] Skip link at page top

---

## Dark Mode (Future)
Not in scope for initial redesign. Architecture supports it via CSS custom properties.

---

## Implementation Order
1. **Design tokens** → `src/index.css` (CSS custom properties + Tailwind config)
2. **Shared components** → Layout, Hero, Button, Card, Input, Badge
3. **Landing page** → Hero, sections, scroll moments
4. **CitizenApp** → Dashboard, stats, tabs
5. **MapView** → Map integration, floating panels
6. **WasteGuide** → Search, category cards, expandable details
7. **CleanPoints** → Filterable list, expandable cards
8. **Rewards** → Catalog, levels, achievements, progress rings
9. **Notifications** → List, filters, expandable items
10. **Profile** → Tabs, stats, settings
11. **AdminPanel** → Tables, tabs, stats grid
12. **Auth pages** → Login, Register forms
13. **Cross-cutting** → Animations polish, reduced motion, accessibility audit

---

## Quality Gates
- `npm run build` — no errors
- `npm run lint` — no warnings
- Lighthouse: Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 90
- Visual regression at 390, 768, 1024, 1440
- Reduced motion test: all transform animations disabled
- Keyboard navigation: full app traversable