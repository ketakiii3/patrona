# 07 — In-App Safety Disclaimer Copy

**Patrona** · Required for App Review (safety apps get extra scrutiny). Ship this copy in-app **and** in the listing.
Version 1.0 · June 2026

> **Why this exists:** Apple flags safety/emergency apps that imply they replace emergency services. Patrona must clearly state it is a *companion*, not a 911 dispatch service, and 911 must not be the *only* emergency path. Place the short form where users see it during normal use; show the long form once at onboarding with an explicit acknowledgement.

---

## 1. Primary disclaimer (the one Apple wants — use verbatim)

> **Patrona is a companion app and does not replace emergency services.**
> In a real emergency, always call 911 (or your local emergency number) directly. Patrona depends on your phone, your network connection, GPS accuracy, and third-party services, any of which can fail or be delayed. Do not rely on Patrona as your only means of getting help.

## 2. Onboarding acknowledgement (show once, require a tap)

Display on a dedicated onboarding step (or just before the first walk). User must tap **"I understand"** to continue; store the acknowledgement.

> **Before you start**
>
> Patrona keeps you company on your walk and can alert your emergency contacts if you go silent or say your safe word. It is **not** a replacement for emergency services.
>
> - In a real emergency, **call 911 directly** — Patrona gives you a one-tap button, but you should never wait on the app alone.
> - Alerts are sent by SMS to the contacts you set up. Delivery depends on cellular/network conditions and is **not guaranteed**.
> - Location sharing depends on GPS and can be inaccurate or delayed indoors or in poor-signal areas.
> - Patrona does **not** contact police, fire, or medical services on your behalf.
>
> By continuing, you understand Patrona is a companion tool that supports — but does not replace — calling for help yourself.
>
> **[ I understand ]**

## 3. Persistent micro-disclaimer (on the Walk + Alert screens)

Small, always-visible line so it's present in the exact moment a user might over-rely on the app.

> *Companion app — not a substitute for 911.*

And on the **Alert screen**, directly beside the 911 button:

> *If you're in danger, call 911 now. Alerting your contacts does not contact emergency services.*

## 4. Microphone / always-listening notice (set expectations + help App Review)

Show near the mic permission prompt and in Settings.

> **Why Patrona listens**
> Patrona uses your microphone so it can talk with you and quietly notice if you go silent or say your safe word. Your conversation is **streamed live and is not recorded or stored** by Patrona. The microphone is only active during an active walk.

## 5. Safe-word notice (Settings + onboarding step 3)

> **Your safe word**
> If you say your safe word naturally during a walk, Patrona silently alerts your emergency contacts — with no on-screen or audible sign — so anyone near you won't know. Choose a word or phrase you'd only say on purpose.

## 6. Reviewer note (paste into App Store Connect → App Review notes — not user-facing)

> Patrona is a personal-safety *companion*. During a walk, an AI voice (ElevenLabs) keeps the user company over a live audio session; the microphone is therefore active for the duration of a walk so the app can (a) converse and (b) detect prolonged silence or a user-chosen "safe word." The audio is streamed in real time and is **not recorded or persisted**. If silence or the safe word is detected, the app sends an SMS (via Textbelt) to user-configured emergency contacts containing a reverse-geocoded approximate address and a link to a live location page; it also surfaces a one-tap dial to 911. **911 is not the only emergency path** and the app shows a clear disclaimer that it does not replace emergency services. Location (precise, foreground; optional background) is used to share the user's position with their own contacts. Phone numbers of contacts are stored to send those SMS alerts. A privacy policy is available at [PRIVACY_POLICY_URL].

## Placement checklist

- [ ] Disclaimer §1 visible in the App Store description.
- [ ] Onboarding acknowledgement §2 with stored "I understand" tap.
- [ ] Micro-disclaimer §3 on Walk and Alert screens.
- [ ] Mic notice §4 at permission prompt + Settings.
- [ ] Safe-word notice §5 at onboarding step 3 + Settings.
- [ ] Reviewer note §6 in App Store Connect.

---

*Related: [Implementation Plan](06_Implementation_Plan.md) Phase 13 · [Privacy Policy](08_Privacy_Policy.md) · [App Store Listing](09_App_Store_Listing.md)*
