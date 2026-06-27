# 01 — PRD · Product Requirements Document

**Patrona** · *The calm voice that walks you home.*
Source of truth for what we're building and for whom. Everything else flows from this.
Version 1.0 · June 2026

---

## At a glance

| Field | Value |
| :---- | :---- |
| **App Name** | Patrona |
| **Tagline** | Never walk alone — a warm AI voice companion that walks you home and quietly escalates if something goes wrong. |
| **Category** | Personal safety / Health & wellness (companion-first) |
| **Platform (v1 launch)** | iOS native app (Capacitor wrapper over the existing React web app), distributed via TestFlight → App Store |
| **Status today** | Working React SPA live on Vercel; all core features functional in mobile browser |

---

## Problem

73% of women in America report feeling afraid to walk alone at night. The walk home is twenty quiet, tense minutes — and almost every safety product on the market is built for the *single bad moment* (the panic button, the crime alert, the dispatch call), not for those twenty minutes.

Three problems repeat across the entire category:

1. **They are reactive** — they help *after* you've already decided you're in danger.
2. **They require active interaction** in the worst possible moment — looking at a screen, navigating a menu, holding a button.
3. **They treat safety as a tool, not a presence** — a dot on a map or a siren, never company.

The pain is felt most acutely by women, students, late-shift workers, and anyone who regularly walks, commutes, or travels alone at night and wants to feel accompanied — not surveilled, and not on edge.

## Core value proposition

Patrona is the only product whose *primary job* is to make the walk **feel** safe, with escalation as the quiet backstop. A natural ElevenLabs voice rides along on a live, hands-free call — talking *with* you, not at you — while a silent monitor watches for trouble (you going quiet, a covert distress word) and escalates to your contacts and a one-tap 911 path *with location and context* only if it has to.

> **The shift in one line:** Others give you a button to press when it's *already bad*. Patrona gives you a presence so it doesn't get there.

**What makes it different (the moat is execution, not the idea):**
- A real two-way voice on the line — genuine conversation, not a scripted fake call or a recording.
- Silence detection that notices when you can't speak up — multi-tier, automatic, no input required.
- A covert distress cue (your safe word) that fires a **silent** alert without tipping off anyone near you.
- Escalation with context — contacts get your name, the trigger reason, a human-readable street address, and a live tracking link.
- You look occupied and connected on a call, not alone and afraid — and you keep your eyes up on your surroundings.

## Target user

**Primary — "Maya," 24, urban commuter.** Walks 15–25 minutes home from a subway stop or late shift several nights a week. Has a phone in her hand already. Doesn't want to call a friend every night or hold a panic button the whole way; she wants to feel like someone is with her, and she wants her people reachable instantly if it goes wrong. Tech-comfortable, privacy-conscious, will not carry extra hardware.

**Secondary personas:** university students walking across or off campus at night; late-shift/healthcare/hospitality workers; solo travelers in unfamiliar cities; and the **emergency contacts** themselves (parents, roommates, partners) who want a live tracking link and a "made it home safe" signal without installing anything.

## Core features (Must Have — shipped in v1)

- **Conversational voice companion** — low-latency two-way dialogue via ElevenLabs Conversational AI over WebRTC, active for the whole walk.
- **Multi-tier silence escalation** — if you stop responding: Tier 1 gentle check-in at 90s, Tier 2 firmer prompt at 110s, Tier 3 automatic emergency alert at 140s. (See [TRD](02_TRD.md) / `src/hooks/useSafetyMonitor.js`.)
- **NLP safe-word detection** — a custom word/phrase spoken naturally in conversation fires a **silent** alert; no UI or audio tell.
- **Live GPS tracking** — continuous location pings during a walk, viewable by contacts on a public tracking page (no install, no login required for them).
- **Emergency SMS escalation** — texts pre-set contacts with name, trigger reason, reverse-geocoded street address, and a live tracking link (via Textbelt + OSM Nominatim).
- **One-tap 911 path** — a clearly-presented call button on the alert screen (not the only emergency path; see App Store review notes in [Implementation Plan](06_Implementation_Plan.md)).
- **Safe-arrival check-in** — an "arrived" flow that closes the loop and can send an all-clear.
- **Auth & profile** — Clerk sign-in; onboarding captures name, home address, 1–3 emergency contacts, and safe word.
- **Walk history** — past walks recorded locally.
- **Dark/light theme** — calm-by-design visual system (see [UI/UX Brief](04_UIUX_Design_Brief.md)).

## Nice to have (v2 / if time allows)

- True background operation with screen locked (`UIBackgroundModes` audio + location; needs extra App Review justification).
- Route deviation detection (alert if you stray significantly from the expected path home).
- Real-time companion dashboard for contacts (live, auto-updating — candidate reason to evaluate Convex).
- Over-the-air updates via Capgo (ship JS/CSS fixes without an App Review cycle).
- Android build (Capacitor already supports it).
- Selectable voices/accents; scheduled "I'm leaving now" notifications to contacts.
- Apple Watch companion / Live Activities.

## Out of scope (v1 explicitly does NOT do)

- It does **not** replace emergency services or guarantee a response — Patrona is a companion app (this disclaimer must be visible in-app per App Store requirements).
- No certified human dispatch center (unlike Noonlight) — escalation is to your own contacts + 911.
- No crime-feed / situational-awareness stream (unlike Citizen).
- No family-fleet location dashboard or driving reports (unlike Life360).
- No hardware wearable, no fake-call-only mode.
- No web/desktop product surface for the *user* (the public tracking page is the only unauthenticated web surface).
- No in-app payments/subscription in v1 (monetization deferred).

## User stories

- As a **walker**, I want a friendly voice to talk with the whole way home, so that I feel accompanied and look occupied instead of alone.
- As a **walker**, I want the app to notice if I go silent and check on me, so that I'm covered even if I can't ask for help.
- As a **walker in danger**, I want to say a normal-sounding safe word to silently alert my people, so that an aggressor near me doesn't realize I've called for help.
- As a **walker**, I want my contacts to automatically get my exact location and the reason for the alert, so that help arrives informed and fast.
- As an **emergency contact**, I want to open a link and watch the walker's live location, so that I can act without installing anything.
- As a **walker**, I want a one-tap way to reach 911 if it escalates, so that I'm never more than a tap from real help.
- As a **new user**, I want a one-minute setup (name, contacts, safe word), so that I can start using it tonight.
- As a **walker**, I want to mark myself "home safe," so that the loop closes and my people stop worrying.

## Success metrics

**Activation & retention**
- 100+ TestFlight installs in the first 2 weeks of beta; ≥ 60% complete onboarding.
- ≥ 40% of beta testers start at least one real walk; ≥ 25% start a second walk (proof of repeat use).

**Reliability (the trust moat)**
- Voice session sustains 10+ minutes on a real iPhone without dropping in ≥ 95% of walks.
- Sign-in persists across app restart in 100% of test cases (no Safari escape, no re-login).
- Emergency SMS delivered with correct address in ≥ 99% of triggered alerts.

**Outcome / sentiment**
- ≥ 80% of surveyed testers say the walk *felt safer* with Patrona.
- ≥ 70% say they would use it again.
- Crash-free session rate ≥ 99% (App Store Connect).

**Launch**
- App Store approval on first or second submission.
- A live privacy policy, support email, and in-app safety disclaimer before public launch.

---

*Related: [TRD](02_TRD.md) · [App Flow](03_App_Flow.md) · [UI/UX Brief](04_UIUX_Design_Brief.md) · [Backend Schema](05_Backend_Schema.md) · [Implementation Plan](06_Implementation_Plan.md) · [Build Guide](Patrona%20Build%20Guide.md) · [Market Research](Patrona_Market_Research.md)*
