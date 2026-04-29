# Design System

A reference for the visual language, motion, and patterns used across this portfolio.

## Principles

- **Soft glassmorphism over flat surfaces** — translucent cards, blurred backdrops, layered depth.
- **Generous space, refined density** — large vertical rhythm; granular type sizing for UI hierarchy.
- **Motion as polish, not decoration** — scroll-triggered reveals, micro-lifts on hover, custom cursor that responds to context.
- **Editorial × product** — serif display paired with neutral sans for an editorial tone over a product surface.

## Typography

Loaded from Google Fonts in [index.html:22](index.html:22).

| Role | Family | Weights |
|---|---|---|
| Display / headings | **Playfair Display** (serif) | 400, 700 |
| Body / UI | **Inter** (sans) | 400, 500, 600 |

CSS variables: `--font-serif`, `--font-sans` ([src/index.css:4](src/index.css:4)).

**Scale**
- Hero: `text-3xl` → `text-[3.25rem]`, `leading-[1.15]`, `tracking-tight`
- Section title: `text-2xl` → `text-4xl lg:`
- Body: `text-base` / `text-[13px]`, `leading-relaxed`
- Labels: `text-[10–13px]`, often `tracking-widest` (0.2em) uppercase

Font smoothing: antialiased / grayscale globally.

## Color

**Page gradient** ([src/components/Layout.jsx:3](src/components/Layout.jsx:3))
`#f5e6f0 → #f0dce8 → #e8d5e0` — soft mauve/pink wash.

**Surfaces**
- White: Case Studies, Playground, Recommendations
- Mauve gradient: Hero, About fade, Footer

**Text**
- Primary `text-gray-900`
- Secondary `text-gray-500`
- Tertiary `text-gray-400`
- Hover accents `text-gray-800`, `text-pink-500`

**Brand accents**
- Lime `#c4ff00` — tag highlights
- Telus purple `#4b286d`

**Glass tokens** (defined in [src/index.css:32](src/index.css:32))
- `.glass-nav` — `rgba(255,255,255,0.06)`, blur, white border
- `.glass-nav-dark` — `rgba(255,255,255,0.5)` for nav over white sections
- `.glass-card` — `rgba(255,255,255,0.55)`, `backdrop-filter: blur(30px)`, soft drop shadow
- `.glass-tag` — `rgba(200,200,210,0.15)` with white border

The navbar swaps between light and dark glass treatments based on scroll position ([src/components/GlassNavBar.jsx:36](src/components/GlassNavBar.jsx:36)).

## Layout & Spacing

- **Max widths**: `max-w-[1400px]` (case studies), `max-w-[1200px]` (about/text-heavy)
- **Section padding**: `px-6 md:px-8` to `px-8 md:px-12`; vertical `py-16` / `py-20` / `pt-32` / `pb-24`
- **Card padding**: `p-6` / `p-10`
- **Grid gaps**: `gap-14` (case-study grid), `gap-8`/`12`/`20` (flex), `gap-1.5`/`2`/`3` (icon+text)
- **Scroll snap**: `scroll-snap-type: y proximity` on `<html>`; sections use `scroll-snap-align: start` ([src/index.css:19](src/index.css:19))
- Hero and major sections use `min-h-screen`

## Components & Patterns

| Pattern | File |
|---|---|
| Hero w/ video + canvas ripple + animated text | [src/components/HeroSection.jsx](src/components/HeroSection.jsx) |
| Featured case-study card (image + text + floating glass label + stats) | [src/components/CaseStudiesSection.jsx:133](src/components/CaseStudiesSection.jsx:133) |
| Project grid card (4:3 media + blurred bottom label, lift on hover) | [src/components/CaseStudiesSection.jsx:426](src/components/CaseStudiesSection.jsx:426) |
| Floating overlay card (`glass-overlay-card`, scroll-revealed) | [src/components/CaseStudiesSection.jsx:244](src/components/CaseStudiesSection.jsx:244) |
| Glass nav (theme-adaptive) | [src/components/GlassNavBar.jsx](src/components/GlassNavBar.jsx) |
| About: Finder-style folders, macOS modal chrome, photo viewer | [src/components/AboutSection.jsx](src/components/AboutSection.jsx) |
| Recommendations carousel (320 → 500px expand on click) | [src/components/RecommendationsSection.jsx](src/components/RecommendationsSection.jsx) |
| Playground w/ side scroll-dot indicator | [src/components/PlaygroundSection.jsx](src/components/PlaygroundSection.jsx) |
| Custom cursor (12 → 60px, color per context) | [src/components/CustomCursor.jsx](src/components/CustomCursor.jsx) |

## Imagery

- **Radii**: `rounded-2xl` / `rounded-[24px]` (large), `rounded-xl` / `rounded-[16px]` (media), `rounded-full` (avatars, cursor)
- **Shadows**: `shadow-sm`/`md` for cards, `shadow-2xl` for modals, `0 6px 30px rgba(0,0,0,.08)` for glass
- **Aspect ratios**: 4:3 (project cards), 16:9 (brand slideshow), 1:1 (folder thumbs)
- **Fit**: `object-cover` default; `object-contain` for logos/mockups
- **Filters**: `drop-shadow(0 12px ...)` on floating product images; `blur(20px)` on backdrops
- **Video**: autoplay, muted, loop, playsInline

## Motion

**Durations**
- 300ms — hover states
- 500ms — nav theme + card reveals
- 700ms — section fades
- 1000ms+ — text entrance

**Easing**
- `cubic-bezier(0.23, 1, 0.32, 1)` (iOS spring) for fluid interactions

**Techniques**
- IntersectionObserver-driven fade + translateY on most sections (threshold 0.1–0.3)
- Canvas ripple on hero (1200ms cubic-out, mix-blend overlay)
- Custom cursor scales and recolors per card type
- Subtle `hover:-translate-y-1` lift on grid cards
- Keyframed loops: `emojiFloat` (3–4s), Forma button "breathing" (6s scale)

No animation library — all motion is CSS, Canvas, or `requestAnimationFrame`.

## Tech

- **Vite + React 19** ([package.json](package.json))
- **Tailwind CSS 4** via `@tailwindcss/vite`; theme + custom utilities defined inline in [src/index.css](src/index.css)
- **react-router-dom 7** — case study routes at `/case-study/:name` ([src/App.jsx:91](src/App.jsx:91))
- CSS features: `backdrop-filter`, `mix-blend-mode`, `mask-image` (hero blur feather), CSS custom properties

## Information Architecture

1. **Hero** (`#hero`)
2. **Case Studies** (`#case-studies`) — Telus, Viewer, Sonaphi, Spaces + Other Projects grid
3. **Playground** (`#playground`) — design experiments
4. **About** (`#about`) — interactive folder narrative
5. **Footer** — Email, LinkedIn, GitHub

Sticky glass navbar with smooth-scroll links; per-section dot indicators in Case Studies and Playground.
