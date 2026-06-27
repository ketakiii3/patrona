# 09 — App Store Listing Copy & Submission Pack

**Patrona** · Everything you paste into App Store Connect.
Version 1.0 · June 2026

> Character limits are Apple's hard caps. Counts below are approximate — verify in App Store Connect before saving.

---

## App name (30 chars max)

**Primary:** `Patrona: Walk Home Safe` *(23)*
**Alternates:**
- `Patrona — Safe Walk Home` *(24)*
- `Patrona: Safety Companion` *(25)*

## Subtitle (30 chars max)

**Primary:** `Your voice companion home` *(25)*
**Alternates:**
- `Never walk home alone` *(21)*
- `A calm voice walks you home` *(27)*

## Promotional text (170 chars max — editable anytime without review)

> A warm AI voice keeps you company on the walk home — hands-free. If you go quiet or say your safe word, Patrona quietly alerts your people with your live location.
*(~165)*

## Description (4000 chars max)

```
Patrona isn't another panic button. It's a calm voice that walks you home.

Most safety apps wait for the worst moment — a button to press once you're already scared. Patrona is built for the twenty quiet minutes before that, so that moment never arrives. A natural AI voice rides along on a live call, talking WITH you, keeping you company and your eyes up on your surroundings.

And in the background, Patrona is watching out for you.

— A REAL VOICE ON THE LINE —
Powered by ElevenLabs conversational AI, Patrona holds a natural, two-way conversation the whole way home. Hands-free. No menus, no screens to stare at. You look occupied and connected — not alone.

— IT NOTICES IF YOU GO QUIET —
If you stop responding, Patrona gently checks in. If you still don't answer, it escalates on its own — no button to press, no app to open. Safety that works even when you can't ask for it.

— A SAFE WORD ONLY YOU KNOW —
Set a secret word or phrase. Say it naturally in conversation and Patrona silently alerts your emergency contacts — with no sign on your screen — so anyone near you never knows.

— YOUR PEOPLE, WITH CONTEXT —
When it matters, Patrona texts the contacts you chose with your name, what triggered the alert, your approximate street address, and a live tracking link they can open without installing anything. Plus a one-tap path to call 911.

— HOME SAFE —
Live location the whole way and a simple "I'm home safe" check-in to close the loop — peace of mind for you and the people who love you.

— PRIVACY BY DESIGN —
Your conversations are streamed live and are NOT recorded or stored. Your microphone is only active during a walk. Your location is shared only with the contacts you choose.

IMPORTANT: Patrona is a companion app and does not replace emergency services. In a real emergency, always call 911 directly. Alerts depend on your phone, signal, and third-party services and are not guaranteed.

Walk home with someone. Never walk alone.
```
*(~1,750 chars — well under the cap; trim/expand as needed)*

## Keywords (100 chars max, comma-separated, no spaces after commas)

```
safety,walk,home,night,companion,voice,women,emergency,SOS,location,share,contacts,alert,security,solo
```
*(~96 — count in App Store Connect; drop the weakest if over.)*
**Tips:** don't repeat words already in the app name/subtitle (Apple indexes those separately), don't use competitor names, singular forms cover plurals.

## Support URL (required)

`https://patrona.app/support` *(or a simple Notion/landing page with a contact email)*

## Marketing URL (optional)

`https://patrona.app`

## Privacy Policy URL (required)

`https://patrona.app/privacy` *(see [Privacy Policy](08_Privacy_Policy.md))*

---

## App Store privacy labels ("Data the app collects")

Declare these to match the [Privacy Policy](08_Privacy_Policy.md) and iOS Privacy Manifest:

| Data type | Linked to identity? | Used for tracking? | Purpose |
| :---- | :---- | :---- | :---- |
| **Precise Location** | Yes | No | App Functionality |
| **Contact Info — phone numbers** (of contacts the user adds) | Yes | No | App Functionality |
| **Contact Info — name** | Yes | No | App Functionality |
| **Audio Data** (microphone) | No | No | App Functionality — *not stored* |
| **Identifiers / Account** (via Clerk) | Yes | No | App Functionality |
| **Diagnostics / Usage** (if any) | No | No | App Functionality |

> **No tracking, no third-party advertising, no data sale.** Make sure the labels say so.

## Age rating

Likely **12+** or **17+** depending on how the emergency/safety content is classified during the questionnaire. Answer honestly (infrequent/mild references to violence or emergencies). Confirm against the children's age in the Privacy Policy.

## Category

- **Primary:** Health & Fitness (or Lifestyle) — *companion/wellbeing framing.*
- **Secondary:** Navigation or Utilities.
> Avoid implying it's an official emergency/medical service.

## Screenshots (required — per device size)

Design 5–10 clean screens (Figma) for each required display size. Suggested sequence + caption overlay:

1. **Home / Start a walk** — "Start a walk. You're not alone."
2. **Walk screen with voice waveform** — "A real voice keeps you company."
3. **Silence check-in** — "If you go quiet, it notices."
4. **Safe word (Settings)** — "A secret word that silently calls for help."
5. **Alert + contacts/911** — "Your people get your location instantly."
6. **Live tracking page** — "They can watch you get home safe."
7. **Arrived / home safe** — "Home safe. Loop closed."

> Keep the calm, sage-toned aesthetic (see [UI/UX Brief](04_UIUX_Design_Brief.md)). Caption text large and legible; include the disclaimer subtly on at least one frame.

## App preview video (optional, boosts conversion)

15–30s: night street → start walk → waveform talking → quiet → gentle check-in → contact gets the link → "home safe." Calm music, no alarmist tone.

## "What's New" (release notes for v1.0.0)

```
First release of Patrona — your calm voice companion for getting home safe.
• Two-way AI voice companion for your whole walk
• Automatic silence check-ins
• Silent safe-word alerts to your emergency contacts
• Live location sharing + one-tap 911
• "Home safe" check-in
We'd love your feedback: [SUPPORT EMAIL]
```

## Build / version (App Store Connect)

- Version: `1.0.0` · Build: increments each upload (start `1`).
- Bundle ID: `com.patrona.app`.

---

## Pre-submission checklist
- [ ] App name + subtitle within 30 chars each.
- [ ] Description includes the **companion-not-emergency disclaimer** ([Safety Disclaimer](07_Safety_Disclaimer.md) §1).
- [ ] Keywords ≤ 100 chars, no competitor names.
- [ ] Support URL + Privacy Policy URL live and reachable.
- [ ] Privacy labels match the Privacy Policy + iOS Privacy Manifest.
- [ ] Screenshots for every required device size.
- [ ] **Reviewer note** added ([Safety Disclaimer](07_Safety_Disclaimer.md) §6) explaining mic + safe word + 911 path.
- [ ] Age rating questionnaire completed.

---

*Related: [PRD](01_PRD.md) · [Safety Disclaimer](07_Safety_Disclaimer.md) · [Privacy Policy](08_Privacy_Policy.md) · [Implementation Plan](06_Implementation_Plan.md) Phase 13*
