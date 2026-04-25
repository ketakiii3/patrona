<p align="center">
  <img src="public/logo.png" alt="Patrona Logo" width="200" />
</p>

<h1 align="center">Patrona</h1>

<p align="center">
  <strong>Your AI voice companion for getting home safe at night.</strong>
</p>

<p align="center">
  🏆 <strong>1st Place Winner — Columbia AI for Good Hackathon 2026</strong> 🏆  
  <br/>
  <em>Awarded $5,000 in ElevenLabs credits to accelerate development.</em>
</p>

---

## 📖 Overview

**73% of women in America report feeling afraid to walk alone at night.**  
Traditional safety apps require users to look at screens, navigate menus, or hold buttons — actions that often fail in real danger.

**Patrona removes the screen entirely.**

It is a full-stack, voice-first safety companion that walks you home. Using low-latency WebRTC, Patrona talks to you like a real person while silently running:

- Multi-tier silence detection  
- NLP-based safe-word monitoring  
- Real-time emergency escalation  

If danger is detected, it reverse-geocodes your location and alerts your trusted contacts instantly.

---

## ✨ Core Features & Technical Architecture

### 🗣️ Conversational Voice Engine

Powered by **ElevenLabs Conversational AI SDK** and **WebRTC**, Patrona maintains natural, low-latency conversations.

- Real-time voice interaction  
- Context-aware responses  
- Keeps users engaged and alert  

---

### ⏱️ Multi-Tier Silence Escalation (`useSafetyMonitor.js`)

No panic button needed.

Patrona monitors responsiveness and escalates automatically:

- **Tier 1 (90s silence):**  
  Gentle check-in  
  _"Hey, you still there?"_

- **Tier 2 (110s total):**  
  Urgent prompt  
  _"I need to hear from you."_

- **Tier 3 (140s total):**  
  🚨 Automatic emergency alert triggered  

---

### 🤫 NLP Safe-Word Detection

Users define a custom safe word.

- Continuous real-time transcript scanning  
- Detects natural speech usage  
- Triggers **silent alert** (no UI, no sound)

The aggressor never knows. Patrona keeps talking like nothing happened.

---

### 📍 Real-Time Location & Geocoding (`api/alert.js`)

When triggered:

1. Frontend sends raw GPS coordinates  
2. Backend reverse-geocodes using **OpenStreetMap (Nominatim)**  
3. Generates a live tracking link  

---

### 💬 Emergency SMS Dispatch (`api/_lib/sms.js`)

Powered by **Textbelt API**

Each alert includes:

- User’s name  
- Trigger reason (Safe word / Silence / Route deviation)  
- Human-readable location  
- Google Maps fallback link  

---

## 🛠️ Tech Stack

### Frontend
- React 18 + Vite  
- Tailwind CSS  
- Clerk (Authentication)  
- ElevenLabs Client SDK (`@elevenlabs/client`)  

### Backend & Infrastructure
- Vercel Serverless Functions (`/api`)  
- Supabase (real-time DB)  
- Textbelt (SMS)  
- OpenStreetMap Nominatim API  

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)  
- API keys:
  - Clerk  
  - Supabase  
  - ElevenLabs  
  - Textbelt  

---

### Installation

```bash
git clone https://github.com/ketakiii3/patrona.git
cd patrona
npm install

