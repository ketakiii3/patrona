# Graph Report - .  (2026-06-15)

## Corpus Check
- Corpus is ~13,772 words - fits in a single context window. You may not need a graph.

## Summary
- 179 nodes · 296 edges · 14 communities (12 shown, 2 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 8 edges (avg confidence: 0.82)
- Token cost: 36,207 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_React UI Screens|React UI Screens]]
- [[_COMMUNITY_Serverless API Handlers|Serverless API Handlers]]
- [[_COMMUNITY_Frontend Build & Dependencies|Frontend Build & Dependencies]]
- [[_COMMUNITY_Safety Escalation & Architecture|Safety Escalation & Architecture]]
- [[_COMMUNITY_Walk Session Hooks|Walk Session Hooks]]
- [[_COMMUNITY_Express Local Dev Server|Express Local Dev Server]]
- [[_COMMUNITY_Express Server Config|Express Server Config]]
- [[_COMMUNITY_Maps & Live Tracking|Maps & Live Tracking]]
- [[_COMMUNITY_PWA App Shell|PWA App Shell]]
- [[_COMMUNITY_Voice Companion|Voice Companion]]
- [[_COMMUNITY_Logo & Branding|Logo & Branding]]
- [[_COMMUNITY_Vercel Routing|Vercel Routing]]
- [[_COMMUNITY_Google Maps API|Google Maps API]]

## God Nodes (most connected - your core abstractions)
1. `setCorsHeaders()` - 13 edges
2. `isAuthorized()` - 10 edges
3. `isRateLimited()` - 10 edges
4. `getClientIp()` - 9 edges
5. `handler()` - 7 edges
6. `handler()` - 6 edges
7. `handler()` - 6 edges
8. `WalkScreen()` - 6 edges
9. `userKey()` - 6 edges
10. `Vercel Serverless Functions` - 6 edges

## Surprising Connections (you probably didn't know these)
- `useSafetyMonitor Hook` --implements--> `Silence Detection Monitoring`  [INFERRED]
  TECH_STACK.md → README.md
- `useSafetyMonitor Hook` --implements--> `Multi-Tier Escalation System`  [INFERRED]
  TECH_STACK.md → README.md
- `Emergency SMS Alert` --references--> `OpenStreetMap Nominatim`  [EXTRACTED]
  README.md → TECH_STACK.md
- `Emergency SMS Alert` --implements--> `Textbelt SMS`  [EXTRACTED]
  README.md → TECH_STACK.md
- `main.jsx Module Entry` --implements--> `React 18 Frontend`  [INFERRED]
  index.html → TECH_STACK.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Safety Escalation Flow** — readme_silence_detection, readme_escalation_system, tech_stack_safety_monitor, readme_emergency_sms, readme_safe_word [INFERRED 0.85]
- **Location Sharing Flow** — tech_stack_gps_hook, tech_stack_location_pings, tech_stack_supabase, tech_stack_tracking_page [INFERRED 0.85]
- **Voice Walk Session** — readme_voice_companion, tech_stack_voice_session, tech_stack_elevenlabs, tech_stack_webrtc [INFERRED 0.85]

## Communities (14 total, 2 thin omitted)

### Community 0 - "React UI Screens"
Cohesion: 0.10
Nodes (23): AlertScreen(), useElapsed(), ArrivedScreen(), BottomNav(), HistoryScreen(), HomeScreen(), Onboarding(), STEP_META (+15 more)

### Community 1 - "Serverless API Handlers"
Cohesion: 0.18
Nodes (20): handler(), handler(), reverseGeocode(), handler(), handler(), handler(), getClerkUserId(), isAuthorized() (+12 more)

### Community 2 - "Frontend Build & Dependencies"
Cohesion: 0.09
Nodes (21): dependencies, @clerk/backend, @clerk/clerk-react, @elevenlabs/client, react, react-dom, @supabase/supabase-js, twilio (+13 more)

### Community 3 - "Safety Escalation & Architecture"
Cohesion: 0.12
Nodes (20): Call 911 Button, Emergency Contacts, Emergency SMS Alert, Multi-Tier Escalation System, Safe Word Silent Alert, Silence Detection Monitoring, Clerk Auth, Dual Backend Architecture (+12 more)

### Community 4 - "Walk Session Hooks"
Cohesion: 0.27
Nodes (9): useElapsed(), WalkScreen(), useGPS(), useSafetyMonitor(), useVoiceSession(), authHeaders(), pingLocation(), sendAllClear() (+1 more)

### Community 5 - "Express Local Dev Server"
Cohesion: 0.14
Nodes (7): alertLimiter, allowedOrigins, app, clearLimiter, locationStore, pingLimiter, VALID_TRIGGER_TYPES

### Community 6 - "Express Server Config"
Cohesion: 0.17
Nodes (11): dependencies, cors, dotenv, express, express-rate-limit, name, scripts, dev (+3 more)

### Community 7 - "Maps & Live Tracking"
Cohesion: 0.39
Nodes (6): TrackingPage(), calculateRoute(), getDistanceMeters(), isNearDestination(), loadGoogleMaps(), reverseGeocode()

### Community 8 - "PWA App Shell"
Cohesion: 0.50
Nodes (5): index.html SPA Entry, main.jsx Module Entry, Progressive Web App, React 18 Frontend, Vite 6 Bundler

### Community 9 - "Voice Companion"
Cohesion: 0.40
Nodes (5): Patrona, Voice Companion, ElevenLabs Conversational AI, useVoiceSession Hook, WebRTC Voice Transport

### Community 10 - "Logo & Branding"
Cohesion: 1.00
Nodes (3): Guidance and Illumination Branding Concept, Patrona App Logo, Streetlamp Casting Light Motif

## Knowledge Gaps
- **49 isolated node(s):** `ALLOWED_ORIGINS`, `store`, `VALID_TRIGGER_TYPES`, `name`, `private` (+44 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What connects `ALLOWED_ORIGINS`, `store`, `VALID_TRIGGER_TYPES` to the rest of the system?**
  _50 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `React UI Screens` be split into smaller, more focused modules?**
  _Cohesion score 0.1039136302294197 - nodes in this community are weakly interconnected._
- **Should `Frontend Build & Dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.09090909090909091 - nodes in this community are weakly interconnected._
- **Should `Safety Escalation & Architecture` be split into smaller, more focused modules?**
  _Cohesion score 0.11578947368421053 - nodes in this community are weakly interconnected._
- **Should `Express Local Dev Server` be split into smaller, more focused modules?**
  _Cohesion score 0.14285714285714285 - nodes in this community are weakly interconnected._