# 02 — TRD · Technical Requirements Document

**Patrona** · The technical blueprint. What we build with, and how the pieces fit.
Version 1.0 · June 2026 · Reflects the **actual** shipped codebase + the iOS path.

---

## Stack summary


| Layer                   | Technology                                                                              | Notes                                                                                                                       |
| ----------------------- | --------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| **Frontend**            | React 18 + Vite 6, JavaScript (JSX, no TypeScript)                                      | ES modules (`"type": "module"`). State-based screen switching — **no React Router**.                                        |
| **Styling**             | Custom CSS design system (`src/index.css`) with CSS variables + inline styles           | Tailwind v4 + `@tailwindcss/vite` present in devDeps but UI is mostly custom CSS. Fonts: DM Sans (UI), Lora (brand italic). |
| **Mobile wrapper (v1)** | **Capacitor** (`@capacitor/core`, `@capacitor/ios`)                                     | Wraps the existing web build in a native WKWebView iOS shell. React code stays untouched.                                   |
| **Backend (prod)**      | Vercel Serverless Functions (`/api/`*)                                                  | Same API surface re-implemented for local dev as an Express server.                                                         |
| **Backend (local dev)** | Node.js + Express 4 (`server/`) on port 3001                                            | Vite proxies `/api` → `localhost:3001` in `npm run dev`.                                                                    |
| **Database**            | Supabase (PostgreSQL) via `@supabase/supabase-js`                                       | 3 tables, RLS enabled. See [Backend Schema](05_Backend_Schema.md).                                                          |
| **Auth**                | Clerk (`@clerk/clerk-react` frontend, `@clerk/backend` JWT verification on API)         |                                                                                                                             |
| **Voice AI**            | ElevenLabs Conversational AI (`@elevenlabs/client`, WebRTC)                             | `Conversation.startSession()` + `getUserMedia`.                                                                             |
| **SMS**                 | Textbelt                                                                                | `twilio` is in `package.json` but **unused** — Textbelt is the live path. Twilio reserved for scale (v2).                   |
| **Maps / geocoding**    | Google Maps JS API (`places`, `geometry`) + OpenStreetMap Nominatim (reverse geocoding) |                                                                                                                             |
| **Hosting**             | Vercel (static SPA + `/api/`* functions)                                                | `vercel.json` handles SPA fallback + API rewrites.                                                                          |
| **OTA updates (v2)**    | Capgo (planned)                                                                         | Push JS/CSS fixes without an App Review cycle.                                                                              |




## Frontend architecture

```
src/
├── main.jsx              # App entry — wraps App in ClerkProvider
├── App.jsx               # Auth gate → onboarding gate → main app; routes by tab + walkState
├── index.css             # Design system: tokens, themes, keyframes, components
├── components/
│   ├── Onboarding.jsx     # 3-step setup (profile → contacts → safe word)
│   ├── HomeScreen.jsx     # Start-a-walk entry point
│   ├── WalkScreen.jsx     # Active walk: voice + GPS + safety monitor
│   ├── AlertScreen.jsx    # Escalation UI: I'm safe / end walk / 911
│   ├── ArrivedScreen.jsx  # Safe-arrival check-in + all-clear
│   ├── HistoryScreen.jsx  # Past walks
│   ├── SettingsScreen.jsx # Profile, contacts, safe word, theme
│   ├── TrackingPage.jsx   # PUBLIC live-location page for contacts (no auth)
│   └── BottomNav.jsx      # home | history | settings tab bar
├── hooks/
│   ├── useVoiceSession.js # ElevenLabs WebRTC session lifecycle
│   ├── useGPS.js          # navigator.geolocation.watchPosition + ping upload
│   └── useSafetyMonitor.js# Silence tiers + safe-word scan
└── utils/
    ├── alerts.js          # Calls /api/alert, /api/alert-clear (reads VITE_API_URL)
    ├── userApi.js         # Load/save user profile + contacts to cloud
    ├── maps.js            # Google Maps load, route calc, distance, reverse geocode
    └── storage.js         # localStorage (theme, user cache, walk history), user-scoped
```

**Routing model:** there is no router. `App.jsx` decides what renders from `walkState` (`idle | walking | alert | arrived`) and `tab` (`home | history | settings`), plus auth/onboarding gates. The public tracking page is detected by URL (`/track` or a `?tracking` param) and bypasses auth entirely.

**Browser/device APIs used:** `getUserMedia` (mic), `geolocation.watchPosition` (GPS), WebRTC (via `@elevenlabs/client`), `crypto.randomUUID()` (session IDs), `localStorage`. **For native:** `navigator.wakeLock` (screen wake during a walk — to be added per Build Guide B.4).

## Backend architecture

Two implementations of one API surface:


| Endpoint                      | Method(s) | Purpose                                                                              | Auth        |
| ----------------------------- | --------- | ------------------------------------------------------------------------------------ | ----------- |
| `api/alert.js`                | POST      | Fire emergency SMS to contacts (reverse-geocodes coords, builds tracking URL)        | Clerk JWT   |
| `api/alert-clear.js`          | POST      | Send "all clear" SMS                                                                 | Clerk JWT   |
| `api/ping.js`                 | POST      | Store a GPS ping for a walk session                                                  | Clerk JWT   |
| `api/location/[sessionId].js` | GET       | Fetch latest location for a session (used by public tracking page)                   | Public read |
| `api/user.js`                 | GET/POST  | User profile + emergency contacts CRUD                                               | Clerk JWT   |
| `api/health.js`               | GET       | Health check                                                                         | Public      |
| `api/_lib/*`                  | —         | Shared: `auth.js`, `cors.js`, `rateLimit.js`, `sms.js`, `supabase.js`, `validate.js` | —           |


**Shared lib responsibilities (**`api/_lib/`**):**

- `auth.js` — verifies the Clerk Bearer token, resolves the Clerk user ID (`isAuthorized()`, `getClerkUserId()`).
- `cors.js` — `setCorsHeaders()` against an allow-list (the most-connected node in the graph — central to every handler). **Must add** `capacitor://localhost` **and** `https://localhost` **for the native app.**
- `rateLimit.js` — IP-based limiter (`isRateLimited()`, `getClientIp()`), e.g. 5 alerts / 15-min window.
- `validate.js` — phone E.164, coordinate bounds, trigger-type enum, 10 KB body cap.
- `sms.js` — Textbelt dispatch with the formatted message.
- `supabase.js` — Supabase client (service/anon key).



## Third-party services


| Service           | Purpose                               | Tier                                   | Keys                                             |
| ----------------- | ------------------------------------- | -------------------------------------- | ------------------------------------------------ |
| **Clerk**         | Auth (sign-in, sessions, JWT)         | Free dev tier                          | `VITE_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY` |
| **ElevenLabs**    | Conversational voice AI               | Hackathon credits ($5k)                | `VITE_ELEVENLABS_AGENT_ID`                       |
| **Supabase**      | PostgreSQL DB                         | Free tier                              | `SUPABASE_URL`, `SUPABASE_ANON_KEY`              |
| **Textbelt**      | SMS alerts                            | Pay-per-text (`textbelt_test` for dev) | `TEXTBELT_KEY`                                   |
| **Google Maps**   | Maps, geocoding, directions           | Pay-as-you-go w/ free credit           | `VITE_GOOGLE_MAPS_API_KEY`                       |
| **OSM Nominatim** | Reverse geocoding (lat/lng → address) | Free (usage policy applies)            | none                                             |
| **Vercel**        | Hosting + serverless                  | Free/Pro                               | —                                                |




## Environment variables

**Frontend (**`VITE_`***, exposed to client):**

- `VITE_ELEVENLABS_AGENT_ID`
- `VITE_GOOGLE_MAPS_API_KEY`
- `VITE_CLERK_PUBLISHABLE_KEY`
- `VITE_API_URL` — empty = same origin (web). **Native build MUST set this to the live Vercel URL** (`.env.production`), or `/api/`* calls 404 against `capacitor://localhost` (Build Guide B.1).

**Backend (server only, never bundled):**

- `CLERK_SECRET_KEY`
- `TEXTBELT_KEY`
- `SUPABASE_URL` + `SUPABASE_ANON_KEY` (or `SUPABASE_SERVICE_KEY`)
- `FRONTEND_URL` — used in SMS tracking links + CORS allow-list.



## Key libraries


| Library                                               | Role                        |
| ----------------------------------------------------- | --------------------------- |
| `@clerk/clerk-react`, `@clerk/backend`                | Auth UI + JWT verification  |
| `@elevenlabs/client`                                  | Voice session / WebRTC      |
| `@supabase/supabase-js`                               | DB client                   |
| `react`, `react-dom` (18.3)                           | UI                          |
| `vite` (6), `@vitejs/plugin-react`                    | Build/dev                   |
| `tailwindcss` v4, `@tailwindcss/vite`                 | (present; minimal use)      |
| `express`, `cors`, `express-rate-limit`, `dotenv`     | Local dev API               |
| `@capacitor/core`, `@capacitor/ios`, `@capacitor/cli` | **To add** — native wrapper |




## Native (iOS) technical requirements

Wrapping the web app with Capacitor (full detail in [Build Guide](Patrona%20Build%20Guide.md)):

- **Bundle ID:** `com.patrona.app` · **App name:** Patrona · **webDir:** `dist`.
- `capacitor.config.ts` with `server.allowNavigation` for Clerk domains + the Vercel backend; `iosScheme: 'https'`; SplashScreen config.
- **CORS:** add `capacitor://localhost` + `https://localhost` to `api/_lib/cors.js` (or enable `CapacitorHttp` to bypass CORS).
- **Info.plist usage strings:** `NSMicrophoneUsageDescription`, `NSLocationWhenInUseUsageDescription`, `NSLocationAlwaysAndWhenInUseUsageDescription`.
- **Privacy manifest** (`PrivacyInfo.xcprivacy`): microphone, precise location, phone numbers — all "app functionality."
- **WebView audio:** allow media autoplay so ElevenLabs audio doesn't require a tap (`mediaTypesRequiringUserActionForPlayback = []` if config-level doesn't suffice).
- **Wake lock** during walks; optional `UIBackgroundModes` (audio, location) for screen-locked operation (extra review scrutiny).



## Constraints & non-functional requirements

- **Must work hands-free on a real iPhone** — simulator does not faithfully test mic/GPS/WebRTC. Real-device testing is mandatory before TestFlight.
- **Voice reliability is the #1 technical risk** — must survive 10+ min walks and brief backgrounding (ElevenLabs Swift SDK is the fallback if WebRTC proves unworkable).
- **Clerk session persistence** across app restarts is the #2 risk — must not escape to Safari on OAuth.
- **Free/low-cost tiers** where possible; the only hard paid requirement is the **$99/yr Apple Developer account** (required for any TestFlight/App Store upload — no workaround).
- **Security:** Clerk JWT on protected routes, IP rate limiting, CORS allow-list, security headers (`X-Content-Type-Options`, `X-Frame-Options`), input validation, 10 KB body cap.
- **Privacy:** location pings are publicly readable by `session_id` (for the tracking page) — session IDs are unguessable UUIDs; no addresses stored on the user record beyond home address; sensitive escalation data is transient.
- **No CI/CD and no test framework** currently in the repo — both are recommended additions before scale (see [Implementation Plan](06_Implementation_Plan.md)).



## Database choice

**Keep Supabase for v1.** PostgreSQL is proven for the relational data (users, contacts, pings), RLS is already configured, and it's open-source / no lock-in. Evaluate **Convex** only for v2 if a real-time contact dashboard becomes a priority — migration is a full rewrite of queries + `/api/`* and not worth doing right before launch. 

---

*Related: [PRD](01_PRD.md) · [App Flow](03_App_Flow.md) · [Backend Schema](05_Backend_Schema.md) · [Implementation Plan](06_Implementation_Plan.md) · [TECH_STACK](TECH_STACK.md) · [Build Guide*](Patrona%20Build%20Guide.md)