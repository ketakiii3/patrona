# 03 — App Flow · Navigation & User Journey Map

**Patrona** · Every screen, every state, every path — mapped to the real code.
Version 1.0 · June 2026

> **Important:** Patrona has **no URL router**. Navigation is driven by React state in `src/App.jsx`:
> - `tab` ∈ `home | history | settings` (bottom nav, only when not on a walk)
> - `walkState` ∈ `idle | walking | alert | arrived` (takes over the whole screen during a walk)
> - plus two gates: **auth** (Clerk) and **onboarding**.
> The single exception is the **public tracking page**, detected by URL (`/track` or `?tracking`), which bypasses all auth.

---

## Screens / pages

| Screen | Component | When it shows |
| :---- | :---- | :---- |
| **Tracking page** (public) | `TrackingPage.jsx` | URL is `/track` or has `?tracking` — **no auth**. For emergency contacts. |
| **Sign in** | Clerk `<SignIn />` | Signed out. |
| **Onboarding** (3 steps) | `Onboarding.jsx` | Signed in, profile not yet set up. |
| **Home** | `HomeScreen.jsx` | `tab=home`, `walkState=idle`. Start-a-walk entry point. |
| **Walk** | `WalkScreen.jsx` | `walkState=walking`. Live voice + GPS + safety monitor. |
| **Alert** | `AlertScreen.jsx` | `walkState=alert`. Escalation UI. (WalkScreen stays mounted underneath to keep the voice session alive.) |
| **Arrived** | `ArrivedScreen.jsx` | `walkState=arrived`. Safe-arrival check-in / all-clear. |
| **History** | `HistoryScreen.jsx` | `tab=history`, `walkState=idle`. Past walks. |
| **Settings** | `SettingsScreen.jsx` | `tab=settings`, `walkState=idle`. Profile, contacts, safe word, theme. |
| **Bottom nav** | `BottomNav.jsx` | Visible only when `walkState=idle` (hidden during a walk for focus). |

## Navigation structure

- **Bottom tab bar** (mobile-native pattern): Home · History · Settings. Present only when idle.
- **During a walk**, the bottom nav disappears — the walk experience is full-screen and uninterruptible by accident. Transitions between walk states are driven by in-screen actions, not tabs.

## First-run sequence (cold start, brand-new user)

```
App loads
  │
  ├─ Is URL /track or ?tracking?  ──yes──► TrackingPage (public, stop here)
  │
  ├─ Clerk still loading?  ──yes──► render nothing (brief)
  │
  ├─ Signed in?  ──no──► <SignIn /> (Clerk)  ──success──► continue
  │
  ├─ Onboarded?  ──no──► Onboarding
  │        Step 1 of 3 — "Let's get you set up"  → first name + home address
  │        Step 2 of 3 — "Emergency contacts"    → 1–3 contacts (name, phone, relationship)
  │        Step 3 of 3 — "Your safe word"        → safe word/phrase (min 2 chars)
  │        Finish → saves locally + fire-and-forget to cloud (Clerk-scoped)
  │
  └─ Main app ─► Home tab (walkState=idle)
```

On every authed load, `App.jsx` scopes storage to the Clerk user ID, then tries to load the profile from the cloud (`loadUserFromCloud`); if found it caches locally and marks onboarded, otherwise it falls back to `localStorage`.

## Auth flow

`Sign in (Clerk) → [if no profile] Onboarding (3 steps) → Home`

- Signed out at any time → storage scope cleared, state reset, back to `<SignIn />`.
- **Native caveat (iOS):** Clerk allowed origins must include `capacitor://localhost`, `https://localhost`, `com.patrona.app://`, and OAuth must stay in-app (not escape to Safari). See [Build Guide](Patrona%20Build%20Guide.md) §D.2.

## Core user journey 1 — The walk (the heart of the product)

```
Home  ──"Start walk"──►  WalkScreen (walkState: idle → walking)
   • generates sessionId (crypto.randomUUID), startTime
   • useVoiceSession: ElevenLabs WebRTC session starts → voice companion talking
   • useGPS: watchPosition begins → POST /api/ping (pings to Supabase)
   • useSafetyMonitor: silence timer + safe-word scan running

During the walk, two things can escalate:
   (a) SILENCE
        90s quiet  → Tier 1: gentle audio check-in ("Hey, you still there?")
        110s quiet → Tier 2: firmer prompt ("I need to hear from you.")
        140s quiet → Tier 3: AUTO emergency alert  → walkState: alert
   (b) SAFE WORD spoken in conversation
        → SILENT alert fired immediately (no UI/audio tell) → walkState: alert
   Any voice activity before Tier 3 resets the silence timer back to Tier 0.

AlertScreen (walkState: alert)  ── WalkScreen stays mounted (voice alive) ──
   • POST /api/alert → Textbelt SMS to contacts (name + reason + reverse-geocoded address + tracking link)
   • options:  "I'm safe" → back to walking   |   "End walk" → arrived   |   one-tap 911

Arrival
   WalkScreen detects arrival OR user ends → ArrivedScreen (walkState: arrived)
   • safe-arrival check-in / all-clear (POST /api/alert-clear)
   • "Done" → resets session, walkState: idle, tab: home
```

## Core user journey 2 — The emergency contact (no app, no login)

```
Contact receives SMS  ─►  taps tracking link (/track?session=…)
   │
   ▼
TrackingPage (public)
   • GET /api/location/[sessionId] → latest lat/lng for that walk
   • renders live, updating map of the walker's position
   • shows context (who, the trigger reason, last-seen time)
```
This is the only unauthenticated surface. Location pings are publicly readable **by session ID only** (unguessable UUID) — see [Backend Schema](05_Backend_Schema.md).

## Core user journey 3 — Setup & maintenance

```
Settings tab
   • edit profile (name, home address)
   • manage emergency contacts (1–3)
   • change safe word
   • toggle dark / light theme  (persisted to localStorage as sw_theme)
```

## States to design for

| State type | Where | What to show |
| :---- | :---- | :---- |
| **Loading** | App boot (Clerk), GPS acquiring, voice connecting | Spinner / "connecting…" — never a blank dead screen beyond the brief Clerk init. |
| **Empty** | History with no walks; onboarding before any contact added | Friendly empty state ("No walks yet — start your first one"). |
| **Permission denied** | Mic or location denied | Clear recovery copy + how to re-enable in iOS Settings. Voice/GPS are core — degrade gracefully and tell the user. |
| **Error** | SMS send fails, network down, voice session drops mid-walk | Surface failure honestly; offer retry; never silently swallow a failed alert. |
| **Alert (silent)** | Safe-word fired | **No visible change** by design — the screen must look normal to an onlooker. |
| **Alert (active)** | Tier 3 / triggered | AlertScreen with I'm safe / end / 911. |

## Redirect / transition logic

- After **sign-in** → onboarding (if new) → Home.
- After **sign-out** → `<SignIn />`.
- After **finishing onboarding** → Home.
- **Start walk** → WalkScreen; **bottom nav hidden** for the duration.
- **Tier 3 silence or safe word** → Alert (WalkScreen kept mounted so voice survives).
- **"I'm safe"** → back to walking; **"End walk" / arrival** → Arrived; **"Done"** → Home (idle).
- **URL `/track` or `?tracking`** → TrackingPage, always, regardless of auth.

---

*Related: [PRD](01_PRD.md) · [TRD](02_TRD.md) · [UI/UX Brief](04_UIUX_Design_Brief.md) · [Implementation Plan](06_Implementation_Plan.md)*
