# 04 — UI/UX Design Brief · Visual & Interaction Guide

**Patrona** · So the app *feels* like calm company, not a panic tool.
Version 1.0 · June 2026 · Tokens reflect the live system in `src/index.css`.

---

## Aesthetic direction

**Calm by design.** Patrona's competitive position is *peace of mind, not alarm* — and the visual language has to carry that. The system is **warm, minimal, muted, and quiet**: low-contrast earthy tones, generous space, soft motion, and a sage-green accent instead of the red-alarm palette every other safety app reaches for. The named design system in the code is literally *"QUIET WALK — Minimalist Design System."*

Think: the warmth of a lamp-lit street and a friend on the phone — not a dashboard of sirens. The brand motif is **guidance and illumination** (a streetlamp casting light). Reference feel: the restraint of Linear/Things, the calm of a meditation app, but warmer and more human.

### Color strategy: sage primary + blush secondary (matching the logo)

The Patrona logo is **blush pink + teal/sage** (a navy panel with teal glow rings, a cream lamp on a pink-tinted post, all on a rose background). The app's sage accent already echoes the logo's teal glow — but the logo's **pink** was previously absent from the UI. We bring it in deliberately as a **soft secondary accent**, so the app finally matches its own logo, *without* becoming a "pink app."

- **Sage stays primary** — CTAs, active states, the core calm tone. (Pink as the dominant theme is avoided: it risks the "pink = women's app" cliché and dilutes the premium, serious-safety feel that differentiates Patrona.)
- **Blush pink is secondary/warmth** — the brand wordmark, the voice waveform glow, success/arrived moments, and subtle accents. It signals *warmth and companionship*, not alarm.
- **Light theme leans warm** — a faint blush-tinted "warm paper" background is where pink reads as calming rather than loud.

This also resolves a brand-consistency gap: previously the app (sage), the splash (`#5B4FCF` purple), and the logo (pink+teal) told three different color stories. Aligning everything to the **logo's pink + sage** makes the brand coherent end to end.

## Color palette (from `src/index.css` design tokens)

**Dark theme (default):**

| Token | Hex | Role |
| :---- | :---- | :---- |
| `--bg` | `#111110` | App background (near-black, warm) |
| `--surface` | `#1c1b18` | Cards / panels |
| `--surface2` | `#242320` | Raised surface |
| `--accent` | `#87a696` | **Primary accent — sage green** (CTAs, active states) |
| `--accent-2` | `#e0a6b0` | **Secondary accent — blush pink** (wordmark, waveform glow, soft highlights) — *new, from the logo* |
| `--text` | `#e8e4dd` | Primary text (warm off-white) |
| `--text-2` | `#8c8680` | Secondary text |
| `--text-3` | `#4a4642` | Muted / tertiary text |
| `--border` | `rgba(255,255,255,0.07)` | Hairline borders |
| `--alert` | `#c08060` | Alert / escalation accent (warm terracotta, **not** red) |
| `--green` | `#7aab8f` | Success / safe-arrival |

**Light theme:**

| Token | Hex | Role |
| :---- | :---- | :---- |
| `--bg` | `#faf3f2` | Background (warm blush-tinted paper — leans into the logo's rose) |
| `--surface` | `#f1e8e7` | Cards / panels |
| `--accent` | `#4e7d6a` | Primary accent (deeper sage) |
| `--accent-2` | `#c77f8d` | Secondary accent — blush pink (deeper for light-mode contrast) |
| `--text` | `#1e1c1a` | Primary text |
| `--text-2` | `#706a62` | Secondary text |
| `--text-3` | `#b0a89e` | Muted text |
| `--alert` | `#a05c35` | Alert accent |
| `--green` | `#3d7a5c` | Success |

> **Note:** the light-theme `--bg`/`--surface` above are revised toward a warm blush tone (was `#f7f5f2`/`#edebe6`). This is the "pink as calm warmth" move — verify AA contrast for `--text` on the new background before shipping.

**Deliberate choice:** even the *alert* color is a warm terracotta, never an aggressive red. Escalation should feel firm and reassuring, not panic-inducing — consistent with "calm by design."

**Where blush pink (`--accent-2`) is used — and where it isn't.** Use it for *warmth*, sparingly: the "patrona" wordmark, the voice-waveform glow (so the companion feels warm/alive), the arrived/success moment, and the occasional soft highlight or gradient on Home. **Do not** use it for primary CTAs (those stay sage), for alerts/escalation (terracotta), or as a full background fill in dark mode. Rule of thumb: sage carries function, pink carries feeling.

## Typography

- **UI font:** **DM Sans** (weights 300/400/500/600) — clean, friendly, highly legible at small sizes.
- **Brand / accent font:** **Lora** *italic* — used for the wordmark ("patrona") and emotive moments, giving a warm editorial feel.
- Loaded via Google Fonts in `index.html`; fallback `system-ui, sans-serif`.
- Antialiased (`-webkit-font-smoothing: antialiased`).
- Hierarchy: light weights for large/quiet copy, 500–600 for labels and CTAs; small letter-spaced uppercase micro-labels (`.label-xs`) for form fields and step counters.

## Component style

- **Corners:** soft, rounded (cards and buttons) — nothing sharp or clinical.
- **Surfaces:** flat with hairline borders and subtle elevation via `--surface`/`--surface2`; **no heavy drop shadows**.
- **Buttons:** full-width primary CTAs in sage accent; quiet secondary/ghost styles for low-stakes actions.
- **Forms:** spacious, one concept at a time (onboarding is 3 calm steps, "X of 3").
- **No colored gradients** in the main app shell (an explicit choice in `App.jsx` — "Subtle ambient layer — no colored gradients").

## Motion

Restrained and purposeful — only five keyframes exist, by design:

| Animation | Use |
| :---- | :---- |
| `fadeInUp` | Screen entrance (gentle opacity) |
| `waveBar` | Voice waveform — the visual "someone is here, talking" signal |
| `pulseDot` | Active-session indicator (a slow, breathing pulse) |
| `scalePop` | Arrived / success moments |
| `spin` | Loading spinner |

The **waveform + pulse dot** are the emotional core of the walk screen: they make the companion feel alive and present without demanding attention.

## Dark / light mode

- **Dark mode is the default** (night-walk context). Light mode fully supported and toggleable.
- Persisted in `localStorage` as `sw_theme`; applied via `data-theme` on `<html>`.
- Toggle available on Home and in Settings.

## Mobile & native considerations

- **Mobile-first, full-bleed** — the app is designed as a single phone-sized surface (`html, body, #root` are 100% height, `overflow: hidden`).
- **Bottom tab navigation** (thumb-reachable) when idle; full-screen immersive walk experience otherwise.
- **Safe-area insets:** must use `env(safe-area-inset-*)` so headers/footers clear the notch and Dynamic Island in the native shell (Build Guide §E.3).
- **Status bar:** `black-translucent` set in `index.html`; match the native status bar style to the theme so text stays readable (`@capacitor/status-bar`).
- **Splash:** background `#5B4FCF` configured in the Capacitor splash (Build Guide A.5) — *fix required:* this purple predates the brand and matches neither the app nor the logo. **Re-skin the splash to the logo palette before App Store submission** — recommend the logo's navy panel (`#1f2a33`-ish) or warm blush (`#faf3f2`) background with the sage/cream lamp mark — so splash, app, icon, and logo finally tell one color story.

## Accessibility

- Maintain WCAG-AA contrast for primary text on `--bg`/`--surface` in both themes (verify the muted `--text-3` tier is used only for non-essential text).
- Large, unmissable touch targets for the few high-stakes actions (Start walk, I'm safe, 911).
- The product is **voice-first and hands-free by intent** — the biggest accessibility win is that core safety doesn't require looking at or touching the screen.
- Respect reduced-motion preferences for the waveform/pulse where possible.
- Copy is plain, calm, and reassuring — never alarming or jargon-heavy.

## Interaction principles (the vibe rules)

1. **Calm over urgent.** Warm tones, soft motion, terracotta not red. Nothing should spike anxiety.
2. **Presence over controls.** The waveform/pulse and the voice are the UI; buttons are minimal.
3. **Eyes up.** Design assumes the user is walking and scanning their surroundings, not staring at the screen.
4. **Silent when it must be.** The safe-word alert produces **zero visible/audible change** — the screen looks completely normal to an onlooker.
5. **Honest in failure.** A failed alert or dropped voice session is surfaced clearly, never hidden.

## Reference apps (feel, not feature)

Linear / Things (restraint & polish) · Calm/Headspace (warmth & reassurance) · a good lamp-lit street at night (the brand metaphor).

---

*Related: [PRD](01_PRD.md) · [App Flow](03_App_Flow.md) · [Implementation Plan](06_Implementation_Plan.md) · Logo/branding nodes in [GRAPH_REPORT](../graphify-out/GRAPH_REPORT.md)*
