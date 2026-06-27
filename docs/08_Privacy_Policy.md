# 08 — Privacy Policy

**Patrona** · Required (a live Privacy Policy URL is mandatory for App Store submission).
Draft v1.0 · **Effective date: [DATE — set on publish]** · Last updated: 27 June 2026

> **Before publishing:** replace every `[BRACKETED]` placeholder, have it reviewed by a qualified attorney (this is a solid drafting starting point, **not** legal advice), and host it at a stable public URL (e.g. `https://patrona.app/privacy`). That URL goes in App Store Connect and in the in-app Settings + onboarding.

---

## Who we are

This Privacy Policy explains how **[LEGAL ENTITY NAME] ("Patrona", "we", "us")** collects, uses, and protects your information when you use the Patrona mobile app and related services (the "Service"). If you have questions, contact us at **[SUPPORT EMAIL — e.g. privacy@patrona.app]**.

Patrona is a personal-safety *companion* app. It does not replace emergency services — see our in-app disclaimer.

## What we collect

We collect only what's needed to keep you company and to alert your people if something goes wrong.

| Data | What it is | Why we collect it |
| :---- | :---- | :---- |
| **Account info** | Authentication handled by **Clerk** (e.g. email and/or the sign-in method you choose). | To create and secure your account. |
| **Profile** | Your first name, home address, and your chosen **safe word**. | To personalize the companion, set your route context, and detect your covert distress cue. |
| **Emergency contacts** | The name, phone number, and (optional) relationship of contacts **you** add. | To send them SMS alerts and a live-location link if you go silent or use your safe word. |
| **Location** | Precise GPS location during an active walk ("location pings"). | To share your live position with your own emergency contacts and to include an approximate street address in alerts. |
| **Microphone audio** | Live audio during an active walk. | To power the AI voice companion and to detect prolonged silence or your safe word. **Audio is streamed in real time and is not recorded or stored by Patrona.** |
| **Walk history** | Records of your past walks. | Stored **locally on your device**; used to show your history. |
| **Device/technical** | IP address and basic request metadata at our API. | Security, rate-limiting, and abuse prevention. |

**We do not collect** payment information, and we do **not** sell your personal data.

## How we use your information

- To provide the companion voice experience during a walk.
- To detect prolonged silence or your safe word and trigger the alert flow you configured.
- To send SMS alerts to **your** emergency contacts containing your name, the trigger reason, an approximate (reverse-geocoded) street address, and a link to a live location page.
- To show your contacts your live location on a public tracking page (see "The tracking page" below).
- To secure the Service (authentication, rate-limiting, validation).

We do **not** use your data for advertising or sell it to third parties.

## The tracking page (important)

When an alert is sent, your contacts receive a link to a public web page that shows your live location for that walk. To make this work **without** requiring your contacts to log in, the location data for a walk is readable by anyone who has the link. **The link contains a long, random, unguessable session ID** — it is not listed or searchable anywhere. Treat the link like a key: anyone you forward it to can view that walk's location while it's active. Location data for a walk is intended to be temporary.

## Microphone & voice

Your conversation with the AI companion is processed in real time by our voice provider (**ElevenLabs**) to generate the spoken responses and to monitor for silence and your safe word. **Patrona does not record, save, or replay your conversations.** The microphone is only active during an active walk.

## Who we share data with (service providers / sub-processors)

We share the minimum necessary with the providers that operate the Service:

| Provider | Role | Data involved |
| :---- | :---- | :---- |
| **Clerk** | Authentication | Account/sign-in data |
| **Supabase** | Database hosting | Profile, contacts, location pings |
| **ElevenLabs** | Conversational voice AI | Live microphone audio (not stored by Patrona) |
| **Textbelt** | SMS delivery | Your name, alert reason, location/link; contact phone numbers |
| **Google Maps** & **OpenStreetMap (Nominatim)** | Maps & reverse geocoding | Coordinates → approximate address |
| **Vercel** | App & API hosting | Request data (incl. IP) |

Each provider processes data under its own terms and privacy policy. We do not control, and are not responsible for, their independent practices.

We may also disclose information if required by law, to protect rights and safety, or in connection with a business transfer.

## Data retention

- **Profile & emergency contacts:** kept until you delete them or your account.
- **Location pings:** intended to be short-lived; we delete or purge stale location data on a periodic basis.
- **Microphone audio:** not retained by Patrona.
- **Walk history:** stored locally on your device and removed when you clear it or uninstall the app.
- Provider-side retention is governed by each provider's policy.

## Your choices & rights

- **Permissions:** you can deny or revoke microphone and location access in your device Settings at any time (this will disable the corresponding features).
- **Edit/delete:** update or remove your profile, safe word, and emergency contacts in-app at any time.
- **Account deletion:** request deletion of your account and associated data by emailing **[SUPPORT EMAIL]**; we will delete it within [30] days, subject to legal retention requirements.
- Depending on where you live (e.g. EEA/UK, California), you may have rights to access, correct, delete, or port your data, and to object to certain processing. Contact us to exercise them.

## Children

Patrona is not directed to children under **[13 / 16 — confirm with the chosen age rating]** and we do not knowingly collect data from them. If you believe a child has provided us data, contact us and we will delete it.

## Security

We use authentication (Clerk JWT), transport encryption (HTTPS), input validation, rate-limiting, and access controls to protect your data. No method of transmission or storage is 100% secure, and we cannot guarantee absolute security.

## International users

Your data may be processed in the United States and other countries where we or our providers operate. By using the Service you consent to this transfer.

## Changes to this policy

We may update this policy. Material changes will be reflected by updating the "Last updated" date and, where appropriate, an in-app notice.

## Contact

**[LEGAL ENTITY NAME]**
Email: **[SUPPORT EMAIL]**
[Optional mailing address]

---

### Publish checklist
- [ ] Fill all `[BRACKETED]` placeholders (entity, email, dates, age, retention window).
- [ ] Attorney review.
- [ ] Host at a stable public URL.
- [ ] Add the URL to App Store Connect, in-app Settings, and onboarding.
- [ ] Keep consistent with the data declared in your **iOS Privacy Manifest** and **App Store privacy labels** (mic, precise location, contact phone numbers).

*Related: [Safety Disclaimer](07_Safety_Disclaimer.md) · [Backend Schema](05_Backend_Schema.md) · [App Store Listing](09_App_Store_Listing.md)*
