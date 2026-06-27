# Patrona — Complete Build & Launch Guide

**Never Walk Alone** From web app → native iOS app → TestFlight → App Store Internal working document · June 2026

---

## Table of Contents

1. [Where We Are](#1-where-we-are)  
2. [The Big Picture](#2-the-big-picture)  
3. [Prerequisites & Accounts](#3-prerequisites--accounts)  
4. [Phase A — Capacitor Setup](#4-phase-a--capacitor-setup)  
5. [Phase B — Fix the Code for Native](#5-phase-b--fix-the-code-for-native)  
6. [Phase C — iOS Native Configuration](#6-phase-c--ios-native-configuration)  
7. [Phase D — The Two Big Risks (Test First)](#7-phase-d--the-two-big-risks-test-first)  
8. [Phase E — App Polish](#8-phase-e--app-polish)  
9. [Phase F — Device Testing](#9-phase-f--device-testing)  
10. [Phase G — TestFlight Submission](#10-phase-g--testflight-submission)  
11. [Phase H — Early Users & Feedback](#11-phase-h--early-users--feedback)  
12. [Phase I — App Store Launch](#12-phase-i--app-store-launch)  
13. [Database Decision: Supabase vs Convex](#13-database-decision-supabase-vs-convex)  
14. [Stack Alternatives](#14-stack-alternatives)  
15. [Recommended Stack Summary](#15-recommended-stack-summary)

---

## 1\. Where We Are

Patrona is a **working React SPA** deployed on Vercel. It is **not** a native mobile app — it runs in a mobile browser. All core features work:

- ElevenLabs voice companion (WebRTC)  
- GPS tracking  
- Safe word detection  
- Emergency SMS via Textbelt  
- Live tracking page for contacts

**Current stack:**

| Layer | Tech |
| :---- | :---- |
| Frontend | React 18 \+ Vite |
| Backend | Vercel Serverless Functions (`/api/*`) |
| Database | Supabase (PostgreSQL) |
| Auth | Clerk |
| Voice | ElevenLabs Conversational AI (WebRTC) |
| SMS | Textbelt |
| Maps | Google Maps JS API \+ OSM Nominatim |
| Hosting | Vercel |

The goal: turn this into a real iOS app people download and use.

---

## 2\. The Big Picture

Web App (now)

   │

   ▼

Wrap in Capacitor  ──────►  Native iOS shell (WKWebView)

   │

   ▼

Test on real iPhone  ─────►  Verify voice \+ auth work natively

   │

   ▼

TestFlight  ──────────────►  Beta distribution to early users (needs $99 Apple Dev account)

   │

   ▼

App Store  ───────────────►  Public launch (same binary, more paperwork)

**Key truth:** TestFlight is **not** free of the Apple Developer account. You need the **$99/year** account to upload *any* build — beta or public. There is no workaround. The $99 covers both TestFlight and App Store.

---

## 3\. Prerequisites & Accounts

Before any code:

| Item | Where | Cost | Notes |
| :---- | :---- | :---- | :---- |
| **A Mac** | — | — | Xcode only runs on macOS. Required, non-negotiable for iOS builds. |
| **Xcode** | Mac App Store | Free | Latest version. \~15GB download. |
| **Apple Developer Account** | [developer.apple.com/programs](https://developer.apple.com/programs) | $99/yr | Required for TestFlight \+ App Store. No student discount. |
| **Node.js** | [nodejs.org](https://nodejs.org) | Free | You already have this. |
| **A physical iPhone** | — | — | Simulator does NOT accurately test mic/GPS/WebRTC. |
| **Apple ID** | — | Free | For signing into Xcode \+ App Store Connect. |

⚠️ **Apple Developer enrollment can take 24–48 hours to approve.** Start this *first* so it's ready when you need it.

---

## 4\. Phase A — Capacitor Setup

Capacitor wraps your existing React app in a native iOS shell. Your React code stays untouched — Capacitor just gives it native API access and packages it as an `.ipa`.

### A.1 — Install Capacitor

In the root of the Patrona repo:

npm install @capacitor/core @capacitor/ios

npm install \-D @capacitor/cli

### A.2 — Initialize Capacitor

npx cap init Patrona com.patrona.app \--web-dir dist

- `Patrona` \= app name  
- `com.patrona.app` \= bundle identifier (reverse-DNS, must be unique)  
- `dist` \= where Vite builds to

### A.3 — Add the iOS Platform

npm run build        \# build React app to /dist first

npx cap add ios      \# creates the /ios Xcode project

This creates an `/ios` folder — a complete Xcode project. Commit this to git.

### A.4 — The Core Workflow (memorize this)

Every time you change the React code:

npm run build        \# rebuild React → /dist

npx cap sync         \# copy /dist into the iOS project \+ update native deps

npx cap open ios     \# open Xcode to run/archive

### A.5 — capacitor.config.ts

Create `capacitor.config.ts` at the repo root:

import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig \= {

  appId: 'com.patrona.app',

  appName: 'Patrona',

  webDir: 'dist',

  server: {

    iosScheme: 'https',          // serve assets over https:// scheme

    allowNavigation: \[

      '\*.clerk.accounts.dev',    // allow Clerk auth navigation

      '\*.clerk.com',

      'your-app.vercel.app',     // your backend

    \],

  },

  ios: {

    contentInset: 'always',      // respect safe areas

  },

  plugins: {

    SplashScreen: {

      launchShowDuration: 1500,

      backgroundColor: '\#5B4FCF',

    },

  },

};

export default config;

---

## 5\. Phase B — Fix the Code for Native

These are **mandatory code changes** — the app will break without them.

### B.1 — Fix the API URL (CRITICAL)

**Problem:** API calls default to a relative URL (`fetch('/api/ping')`). In the native shell, the origin is `capacitor://localhost` — there's no server there, so calls 404\.

**Fix:** Set `VITE_API_URL` to your live Vercel URL for production builds.

Create or edit `.env.production`:

VITE\_API\_URL=https://your-app.vercel.app

Verify your code reads it (it does, per `src/utils/alerts.js`):

const API\_URL \= import.meta.env.VITE\_API\_URL || '';

Then **always** build with the production env:

npm run build   \# picks up .env.production automatically in Vite

### B.2 — Fix CORS (CRITICAL)

**Problem:** Your API only allows `FRONTEND_URL` and `localhost:5173`. The native app's origin (`capacitor://localhost` / `https://localhost`) is blocked.

**Fix:** Edit `api/_lib/cors.js`:

const ALLOWED\_ORIGINS \= \[

  process.env.FRONTEND\_URL,

  'http://localhost:5173',

  'capacitor://localhost',   // ← add

  'https://localhost',       // ← add

\].filter(Boolean);

Then redeploy Vercel (`git push` triggers it).

### B.3 — Alternative: Use CapacitorHttp (bypass CORS entirely)

If CORS keeps fighting you, route requests natively, which skips the browser CORS layer:

npm install @capacitor/core

// capacitor.config.ts

plugins: {

  CapacitorHttp: { enabled: true }

}

This patches `fetch` to go through the native HTTP layer — no preflight, no CORS. Useful fallback.

### B.4 — Add a Screen Wake Lock (safety gap)

**Problem:** Today's code has no screen-lock handling. If a user locks their phone mid-walk, GPS pings and the voice session die.

**Fix (short-term):** Request a wake lock when a walk starts. In `useGPS.js` or `useSafetyMonitor.js`:

let wakeLock \= null;

async function requestWakeLock() {

  try {

    wakeLock \= await navigator.wakeLock.request('screen');

  } catch (err) {

    console.warn('Wake lock failed:', err);

  }

}

// call requestWakeLock() when walk starts

// call wakeLock?.release() when walk ends

Note: `navigator.wakeLock` keeps the **screen on**. True background operation (screen off) needs `UIBackgroundModes` in Info.plist (see C.2) and more App Review justification.

---

## 6\. Phase C — iOS Native Configuration

Done in Xcode after `npx cap open ios`.

### C.1 — Signing

1. Click the **App** target in Xcode's left sidebar.  
2. Go to **Signing & Capabilities**.  
3. Set **Team** to your Apple Developer account.  
4. Set **Bundle Identifier** to `com.patrona.app` (must match `capacitor.config.ts`).  
5. Check **Automatically manage signing**.

### C.2 — Info.plist Permission Strings

Open `ios/App/App/Info.plist`. Add these keys (Xcode rejects builds without them, and features silently fail):

| Key | Value |
| :---- | :---- |
| `NSMicrophoneUsageDescription` | "Patrona uses your microphone to keep you company on walks and to listen for your safe word." |
| `NSLocationWhenInUseUsageDescription` | "Patrona uses your location to share your position with emergency contacts." |
| `NSLocationAlwaysAndWhenInUseUsageDescription` | "Patrona keeps tracking your location during a walk even if your screen is off, for your safety." |

For **background operation** (walk continues with screen locked), also add:

\<key\>UIBackgroundModes\</key\>

\<array\>

  \<string\>audio\</string\>

  \<string\>location\</string\>

\</array\>

⚠️ Background modes trigger extra App Review scrutiny. For v1, foreground \+ wake lock may be enough. Decide based on testing.

### C.3 — Privacy Manifest (required since 2024\)

Apple requires a `PrivacyInfo.xcprivacy` file declaring data collection.

1. In Xcode: **File → New → File → App Privacy** (or "Privacy" in the template search).  
2. Declare:  
   - Microphone — purpose: app functionality  
   - Precise location — purpose: app functionality  
   - Phone number (emergency contacts) — purpose: app functionality  
3. Save it in `ios/App/App/`.

Without this, your upload is **rejected**.

### C.4 — WebView Audio Config (for ElevenLabs)

To prevent iOS requiring a user tap before audio plays, set this in the native config. Edit `ios/App/App/AppDelegate.swift` or use a Capacitor config — try the config-level setting first:

// capacitor.config.ts

ios: {

  contentInset: 'always',

  // allows media to autoplay without a user gesture

}

If audio still requires a tap, you'll set `mediaTypesRequiringUserActionForPlayback = []` on the `WKWebViewConfiguration` in the native layer.

---

## 7\. Phase D — The Two Big Risks (Test First)

**Do not build anything else until these two pass on a real iPhone.** They are the make-or-break items.

### D.1 — ElevenLabs WebRTC Voice (Highest Risk)

ElevenLabs uses WebRTC via `getUserMedia` \+ `Conversation.startSession()`. WKWebView supports WebRTC (iOS 14.3+), but there are known issues:

**Known problems:**

- Audio stutters/cuts on first init while `AVAudioSession` initializes.  
- Screen lock or backgrounding can suspend JS timers → voice session dies.  
- WKWebView runs audio in a separate process → possible session conflicts.

**Fixes to try, in order:**

1. Add `UIBackgroundModes: audio` to Info.plist.  
2. Set `mediaTypesRequiringUserActionForPlayback = []`.  
3. Add a screen wake lock during the voice session.

**Fallback (if WebRTC is unworkable):** ElevenLabs has a **native Swift SDK**. You'd handle voice natively and bridge to your React app via Capacitor. More work, fully reliable. **Don't assume you'll need this — test the WebRTC path first.**

**Test:** Start a voice session on a real iPhone. Walk around for 10+ minutes. Lock the screen. Does it keep going?

### D.2 — Clerk Session Persistence (Second Risk)

Clerk works in WKWebView in dev/simulator. Production TestFlight builds have known issues with:

- Session/cookie persistence across app restarts.  
- OAuth redirects escaping to Safari instead of staying in-app.

**Fixes:**

1. In **Clerk Dashboard → Paths / Allowed Origins**, add:  
   - `capacitor://localhost`  
   - `https://localhost`  
   - `com.patrona.app://`  
2. In `capacitor.config.ts`, add Clerk domains to `server.allowNavigation` (see A.5).  
3. If sessions still don't persist, store tokens via `@capacitor/preferences` or look at a native Clerk bridge.

**Test:** Sign in → kill the app → reopen. Are you still logged in?

---

## 8\. Phase E — App Polish

### E.1 — App Icon

npm install \-g @capacitor/assets

\# place a 1024x1024 icon.png in ./assets/

npx capacitor-assets generate \--ios

This generates all required icon sizes automatically.

### E.2 — Splash Screen

Place a splash image in `./assets/` (e.g. `splash.png`, 2732x2732). The same `capacitor-assets generate` command produces all splash sizes. Configure color/duration in `capacitor.config.ts` (see A.5).

### E.3 — Safe Area Insets

Verify your CSS uses `env(safe-area-inset-*)` so UI isn't clipped by the notch / Dynamic Island:

.app-header {

  padding-top: env(safe-area-inset-top);

}

.app-footer {

  padding-bottom: env(safe-area-inset-bottom);

}

### E.4 — Status Bar

npm install @capacitor/status-bar

Set the style to match your theme so the status bar text is readable.

---

## 9\. Phase F — Device Testing

**Test everything on a real iPhone before TestFlight.** The simulator lies about mic/GPS/WebRTC.

### Voice (highest priority)

- [ ] Voice session starts without stutter on first open  
- [ ] Voice runs 10+ minutes without dropping  
- [ ] Safe word is detected mid-conversation  
- [ ] Voice survives brief backgrounding \+ foregrounding  
- [ ] Mic permission prompt appears correctly on first launch

### Auth

- [ ] Sign-up completes without redirecting to Safari  
- [ ] Kill app, reopen → still logged in  
- [ ] Sign out / sign back in works

### GPS & Safety

- [ ] Location permission prompt appears  
- [ ] GPS pings land in Supabase during a walk  
- [ ] Tracking page shows live, updating location  
- [ ] Emergency SMS sends with correct location  
- [ ] 911 button opens the dialer (`tel:911`)  
- [ ] Screen wake lock keeps display on during a walk

### Polish

- [ ] App icon shows correctly (not blank/generic)  
- [ ] Splash screen appears \+ transitions cleanly  
- [ ] No UI clipping on notch/Dynamic Island  
- [ ] No crashes on any main flow

---

## 10\. Phase G — TestFlight Submission

1. **Enroll** in Apple Developer Program (do this early — takes 24–48h).  
2. In Xcode: set **Team** \+ **Bundle ID** (Phase C.1).  
3. Set **version** (start `1.0.0`) and **build number** (`1`, increment every upload).  
4. Select **Any iOS Device (arm64)** as the build target (not a simulator).  
5. Menu: **Product → Archive**.  
6. When the **Organizer** opens: **Distribute App → App Store Connect → Upload**.  
7. Wait for processing (10–30 min) at [appstoreconnect.apple.com](https://appstoreconnect.apple.com).  
8. Go to your app → **TestFlight** tab.  
9. **Internal testers** (up to 100, your team): instant, no review.  
10. **External testers** (up to 10,000): needs a quick Beta App Review (usually \<24h).  
11. Add testers by email → they get a TestFlight invite → install via the TestFlight app.

💡 You'll need an `App Store Connect` listing created (just the app record) before you can upload — do this at appstoreconnect.apple.com → Apps → \+.

---

## 11\. Phase H — Early Users & Feedback

The point of TestFlight is **real feedback before public launch.**

- Invite your first cohort (LinkedIn early-access list, campus contacts).  
- Set up a feedback form (Google Form / Typeform). Ask:  
  - What did you use it for?  
  - Did the voice feel reliable?  
  - Did anything break or confuse you?  
  - Would you use it again? Why / why not?  
- Watch crash reports in App Store Connect → TestFlight → Crashes.  
- Track which testers actually opened it (TestFlight shows session counts).  
- Fix the top 3 friction points before App Store submission.

---

## 12\. Phase I — App Store Launch

Once you have a stable build \+ some validation:

### Listing assets you'll need

- 5–10 screenshots (per device size — use Figma to design clean ones)  
- App description (long \+ short)  
- Subtitle (30 chars)  
- Keywords (100 chars, comma-separated)  
- Support URL (a simple page or Notion)  
- Privacy Policy URL (required)  
- App preview video (optional but boosts conversion)

### App Review (safety apps get extra scrutiny)

- **Disclaimer required:** clear in-app text — "Patrona is a companion app and does not replace emergency services."  
- Don't make `tel:911` the *only* emergency path — Apple may flag it.  
- Have a real support email \+ privacy policy live before submitting.  
- Write a reviewer note explaining the safe word and why the mic is always-on.

### Privacy labels

Declare on your listing: microphone use, precise location, contact phone numbers.

### Age rating

Likely 12+ or 17+ depending on how emergency content is classified.

---

## 13\. Database Decision: Supabase vs Convex

**Verdict: Keep Supabase now. Evaluate Convex for v2.**

### Supabase (current — keep it)

- ✅ Already set up and working  
- ✅ PostgreSQL \= proven, reliable, great for relational data (users, contacts, pings)  
- ✅ Row Level Security already configured (public read for tracking page)  
- ✅ Fully open-source, self-hostable, no lock-in

### Convex (the alternative you heard about)

- ✅ Real-time reactivity is automatic (every query auto-subscribes to changes)  
- ✅ End-to-end TypeScript, no SQL/ORM  
- ✅ Convex functions replace both DB queries AND serverless functions (one less layer)  
- ❌ Migration \= rewrite all queries, schema, and `/api/*` functions (a week+ for zero new features)  
- ❌ No SQL — document model only  
- ❌ Self-hosting is new (open-sourced early 2025), not yet mature

### When to actually consider Convex

- You're building a live companion dashboard (someone watching a walk in real time)  
- You're rebuilding the backend from scratch for v2 anyway  
- Real-time sync latency becomes a visible UX problem

**Bottom line:** Don't migrate databases right before launch. Supabase is not a weakness. Ship first, optimize later.

---

## 14\. Stack Alternatives

| Option | Best for | Verdict for Patrona |
| :---- | :---- | :---- |
| **Capacitor** ✅ | Wrapping an existing web app | **Recommended.** Lowest effort, keeps your React code. |
| React Native \+ Expo | Mobile-first apps from scratch | Would require full UI rewrite. Not worth it. |
| PWA | Quick install without App Store | iOS Safari WebRTC is flaky, no push, no App Store presence. Fine for internal only. |
| Expo \+ web export | One codebase web \+ app | Still a UI rewrite. Skip. |
| Tauri Mobile | Rust-based native perf | Too new, weak WebRTC/audio ecosystem. Not viable yet. |

---

## 15\. Recommended Stack Summary

| Layer | Now (keep) | Later / Consider |
| :---- | :---- | :---- |
| Mobile wrapper | **Capacitor** | React Native only if a full rebuild happens |
| Frontend | React 18 \+ Vite | No change |
| Auth | Clerk (fix Capacitor config) | Native Clerk SDK if sessions break |
| Database | **Supabase** | Convex for v2 if real-time is a priority |
| Backend API | Vercel Serverless Functions | Convex functions (if migrating DB) |
| Voice AI | ElevenLabs (WebRTC) | ElevenLabs Swift SDK if WebRTC is flaky |
| SMS | Textbelt | Twilio at scale (already in package.json) |
| Maps | Google Maps \+ OSM | No change |
| Hosting | Vercel | No change |
| OTA updates | Not set up | **Capgo** — push JS/CSS fixes without App Review |

### What is Capgo?

An over-the-air update service for Capacitor. After the App Store approves your binary, Capgo lets you push JS/CSS/asset changes **without** another App Review cycle (each takes 1–3 days). Huge for shipping fixes same-day. Set it up once you have a stable build.

---

**The product is ready. The work now is engineering, not ideation.** **Test the voice on a real iPhone first. Everything flows from that.**

*Never Walk Alone.*  
