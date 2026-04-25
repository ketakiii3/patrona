<p align="center">
  <img src="public/logo.png" alt="Patrona Logo" width="200" />
</p>

<h1 align="center">Patrona</h1>

<p align="center">
  <b>Your AI voice companion for getting home safe at night.</b>
</p>

<p align="center">
  🏆 <b>1st Place Winner — Columbia AI for Good Hackathon 2026</b> 🏆<br/>
  <i>Awarded $5,000 in ElevenLabs credits to accelerate development.</i>
</p>

---

## 📖 Overview

73% of women in America report feeling afraid to walk alone at night. Traditional safety apps require users to actively look at screens, navigate menus, or hold down buttons — actions that are often impossible when a person is in actual distress.

**Patrona** completely removes the screen from the safety equation. It is a full-stack, voice-first safety companion that walks you home. Utilizing low-latency WebRTC, Patrona converses with you naturally, acting as a virtual friend. In the background, it runs a sophisticated multi-tier silence detection and NLP safe-word monitor. If danger is detected, it silently reverse-geocodes your coordinates and dispatches emergency SMS alerts to your loved ones.

---

## ✨ Core Features & Technical Architecture

### 🗣️ Conversational Voice Engine

Powered by the **ElevenLabs Conversational AI SDK** and streamed via **WebRTC**, Patrona maintains a natural, low-latency dialogue. It actively listens to your responses and generates context-aware replies to keep you engaged and alert during your walk.

---

### ⏱️ Multi-Tier Silence Escalation (`useSafetyMonitor.js`)

Instead of relying on a panic button, Patrona monitors your responsiveness. If you stop talking, the system automatically escalates through three distinct tiers:

| Tier | Trigger | Action |
|------|---------|--------|
| **Tier 1** | 90 seconds of silence | Gentle audio check-in (e.g., *"Hey, you still there?"*) |
| **Tier 2** | +20 seconds (110s total) | Firmer, more urgent audio prompt (e.g., *"I need to hear from you."*) |
| **Tier 3** | +30 seconds (140s total) | Automatically triggers the emergency alert protocol — no physical input required |

---

### 🤫 NLP Safe-Word Detection

Users can set a custom safe word. The `useSafetyMonitor` hook continuously scans the real-time transcript. If the safe word is spoken naturally in conversation, the app triggers a **silent alert** — no UI or audio indication that an alert was fired, ensuring an aggressor remains unaware while Patrona keeps chatting normally.

---

### 📍 Real-Time Location & Geocoding Pipeline (`api/alert.js`)

When an alert is triggered (via silence, safe-word, or route deviation):

1. The frontend dispatches raw GPS coordinates to the Vercel serverless backend.
2. `api/alert.js` uses the **OpenStreetMap (Nominatim) API** to reverse-geocode the exact latitude/longitude into a human-readable street address.
3. The system generates a live tracking URL.

---

### 💬 Emergency SMS Dispatch (`api/_lib/sms.js`)

The backend securely interfaces with the **Textbelt API** to text pre-set emergency contacts. Each message includes:

- The user's name
- The specific trigger reason (Safe Word, Silence, or Route Deviation)
- The human-readable street address (e.g., *Near 116th and Broadway*)
- A fallback link to Google Maps coordinates

---

## 🛠️ Tech Stack

**Frontend**
- React 18 + Vite
- Tailwind CSS
- Clerk (User Authentication)
- ElevenLabs Client SDK (`@elevenlabs/client`)

**Backend & Infrastructure**
- Vercel Serverless Functions (`/api` routes)
- Supabase (Real-time DB for location pings and user data)
- Textbelt (SMS Dispatching) *(Twilio available as an alternative in dependencies)*
- OpenStreetMap Nominatim API (Reverse Geocoding)

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- API keys for: Clerk, Supabase, ElevenLabs, and Textbelt

### Installation

**1. Clone the repository:**
```bash
git clone https://github.com/ketakiii3/patrona.git
cd patrona
```

**2. Install dependencies:**
```bash
npm install
```

**3. Set up environment variables:**

Create a `.env` file in the root directory based on `.env.example`:
```env
VITE_API_URL=http://localhost:3000
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key
CLERK_SECRET_KEY=your_clerk_secret
TEXTBELT_KEY=your_textbelt_key
# Add your Supabase and ElevenLabs keys here
```

**4. Run the development server:**
```bash
npm run dev
```

---

## 🔐 Security & Rate Limiting

| Layer | Implementation |
|-------|---------------|
| **CORS & Auth Validation** | All `/api/alert` requests must pass Clerk Bearer token validation (`api/_lib/auth.js`) |
| **Rate Limiting** | IP-based limiting: 5 emergency alerts per 15-minute window (`api/_lib/rateLimit.js`) |
| **Payload Validation** | Strict byte-size limits and body schema validation prevent malformed requests (`api/_lib/validate.js`) |

---

## 👩‍💻 The Team

Built in 36 hours from scratch by **Ketaki** and **Sahiti**.
