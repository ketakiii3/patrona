# 06 — Implementation Plan · Step-by-Step Build & Launch Sequence

**Patrona** · The exact order from "working web app" to "live on the App Store."
Version 1.0 · June 2026

> **Where we are:** Phases 1–6 (the product itself) are **already built and working** as a React SPA on Vercel. This plan records what exists *and* lays out the remaining phases (7–13) to ship it as a native iOS app. It mirrors and sequences the detailed [Build Guide](Patrona%20Build%20Guide.md).
>
> **The one rule that orders everything:** *Test the ElevenLabs voice on a real iPhone before building anything else native.* Everything flows from that working.

---

## ✅ Phase 1 — Project setup *(done)*
React 18 + Vite 6 SPA, ES modules, custom CSS design system, `.env`/`.env.example`, Vercel hosting + `vercel.json`, local Express dev server with Vite proxy.
**Done criteria:** `npm run dev` runs the app + local API; `npm run build` produces `dist/`.

## ✅ Phase 2 — Database & schema *(done)*
Supabase with `users`, `emergency_contacts`, `location_pings`; indexes; RLS enabled (`supabase-schema.sql`).
**Done criteria:** profiles, contacts, and pings persist; tracking page reads pings.

## ✅ Phase 3 — Auth *(done)*
Clerk sign-in, JWT verification on protected API routes, user-scoped localStorage, auth + onboarding gates in `App.jsx`.
**Done criteria:** sign in → onboard → main app; signed-out state resets cleanly.

## ✅ Phase 4 — Voice companion *(done)*
ElevenLabs Conversational AI over WebRTC (`useVoiceSession.js`); two-way dialogue for the walk.
**Done criteria:** voice session starts and converses in the browser.

## ✅ Phase 5 — Safety monitor & escalation *(done)*
`useSafetyMonitor.js`: multi-tier silence (90s / 110s / 140s) + NLP safe-word scan (silent alert). `useGPS.js` live pings. `api/alert.js` → reverse-geocode (OSM) → Textbelt SMS with address + tracking link. AlertScreen (I'm safe / end / 911).
**Done criteria:** silence and safe word both fire alerts; contacts receive SMS with correct address.

## ✅ Phase 6 — Core UI & tracking *(done)*
Home, Walk, Alert, Arrived, History, Settings, Onboarding, BottomNav, and the public TrackingPage; dark/light theme.
**Done criteria:** all flows in [App Flow](03_App_Flow.md) work end-to-end in a mobile browser.

---

## ▶ Phase 7 — Accounts & prerequisites *(do this FIRST — it has lead time)*
- Enroll in the **Apple Developer Program** ($99/yr) — approval takes **24–48h**, so start now.
- Confirm a **Mac + Xcode** (latest, ~15GB) and a **physical iPhone** are available.
- Create the app record in **App Store Connect** (Apps → +).
**Done criteria:** Developer account active; Xcode installed; app record exists.

## ▶ Phase 8 — Capacitor wrap
- `npm install @capacitor/core @capacitor/ios` + `-D @capacitor/cli`.
- `npx cap init Patrona com.patrona.app --web-dir dist`.
- Add `capacitor.config.ts` (appId, appName, webDir, `server.allowNavigation` for Clerk + Vercel, `iosScheme: 'https'`, SplashScreen).
- `npm run build` → `npx cap add ios` → commit the `/ios` folder.
- Memorize the loop: **`npm run build` → `npx cap sync` → `npx cap open ios`**.
**Done criteria:** the app launches in the iOS simulator from Xcode.

## ▶ Phase 9 — Native code fixes *(mandatory — app breaks without these)*
- **API URL:** set `VITE_API_URL=https://<your-app>.vercel.app` in `.env.production` (native origin is `capacitor://localhost`, so relative `/api` 404s).
- **CORS:** add `capacitor://localhost` + `https://localhost` to `api/_lib/cors.js` `ALLOWED_ORIGINS`; redeploy Vercel. (Fallback: enable `CapacitorHttp` to bypass CORS.)
- **Clerk:** add `capacitor://localhost`, `https://localhost`, `com.patrona.app://` to Clerk allowed origins.
- **Wake lock:** request `navigator.wakeLock` when a walk starts, release on end (`useGPS.js`/`useSafetyMonitor.js`).
**Done criteria:** authed API calls succeed from the native shell; no CORS errors.

## ▶ Phase 10 — iOS native configuration (Xcode)
- **Signing:** set Team + Bundle ID `com.patrona.app`; auto-manage signing.
- **Info.plist:** `NSMicrophoneUsageDescription`, `NSLocationWhenInUseUsageDescription`, `NSLocationAlwaysAndWhenInUseUsageDescription` (+ optional `UIBackgroundModes` audio/location for screen-locked walks — extra review scrutiny).
- **Privacy manifest** (`PrivacyInfo.xcprivacy`): microphone, precise location, phone numbers — all "app functionality." *(Upload is rejected without it.)*
- **WebView audio:** allow media autoplay so ElevenLabs doesn't require a tap.
**Done criteria:** build compiles signed; permission prompts appear on launch.

## ▶ Phase 11 — De-risk the two make-or-break items *(on a REAL iPhone)*
> Do not proceed to polish until both pass.
- **D.1 Voice (highest risk):** start a session, walk 10+ min, lock the screen — does it keep going without stutter/drop? Fixes in order: `UIBackgroundModes: audio` → `mediaTypesRequiringUserActionForPlayback = []` → wake lock. **Fallback:** ElevenLabs native Swift SDK bridged via Capacitor (only if WebRTC is unworkable).
- **D.2 Clerk persistence:** sign in → kill app → reopen → still logged in? OAuth must not escape to Safari. Fallback: store tokens via `@capacitor/preferences`.
**Done criteria:** voice survives a 10-min locked-screen walk; session persists across restart.

## ▶ Phase 12 — Polish & full device test
- **App icon** (1024×1024) + **splash** via `@capacitor/assets` — **re-skin to the sage/warm palette** (current splash `#5B4FCF` is off-brand; see [UI/UX Brief](04_UIUX_Design_Brief.md)).
- **Safe-area insets** (`env(safe-area-inset-*)`) — no notch/Dynamic Island clipping.
- **Status bar** style matched to theme (`@capacitor/status-bar`).
- Run the **full device test checklist** (Build Guide §F): voice, auth, GPS/SMS/911, polish — all on a real iPhone.
**Done criteria:** every checklist item passes; no crashes on main flows.

## ▶ Phase 13 — TestFlight → feedback → App Store launch
- **TestFlight:** set version `1.0.0` / build `1`; target *Any iOS Device (arm64)*; **Product → Archive** → **Distribute → App Store Connect → Upload**. Internal testers instant; external testers need a quick Beta App Review (<24h).
- **Early feedback (Phase H):** invite first cohort, feedback form, watch crashes, fix top 3 friction points.
- **App Store listing:** screenshots (per device size), description, subtitle (30 chars), keywords (100 chars), **support URL**, **privacy policy URL**, optional preview video.
- **App Review readiness (safety apps get extra scrutiny):**
  - Visible in-app disclaimer: *"Patrona is a companion app and does not replace emergency services."*
  - 911 must **not** be the only emergency path.
  - Live support email + privacy policy.
  - Reviewer note explaining the safe word and always-on mic.
  - Privacy labels: microphone, precise location, contact phone numbers. Age rating likely 12+/17+.
**Done criteria:** app approved and live; beta validated; disclaimer + privacy policy live.

---

## Cross-cutting hardening (before/around launch)
- **Tighten RLS** on Supabase (service-role-only writes; scope/expire public ping reads) — see [Backend Schema](05_Backend_Schema.md).
- **Cleanup job** for stale `location_pings`.
- **Add a test framework + CI** (none exist today) — at minimum smoke-test the alert + auth paths before each release.
- **OTA updates (v2):** set up **Capgo** once a stable binary is approved, to ship JS/CSS fixes without re-review.

## Overall "done" criteria (v1 launch)
A user can download Patrona from the App Store, sign in, set up in ~1 minute, start a walk with a reliable voice companion, have silence/safe-word escalation reach their contacts with an accurate location + live tracking link, reach 911 in one tap, and mark themselves home safe — all hands-free on a real iPhone, with a visible safety disclaimer, live privacy policy, and crash-free sessions.

---

*Related: [PRD](01_PRD.md) · [TRD](02_TRD.md) · [App Flow](03_App_Flow.md) · [UI/UX Brief](04_UIUX_Design_Brief.md) · [Backend Schema](05_Backend_Schema.md) · [Build Guide](Patrona%20Build%20Guide.md)*
