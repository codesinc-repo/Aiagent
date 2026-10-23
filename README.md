# RALU Guide: demo for Recognize & Level Up

A working demo for Bishop Luis Melendez's ministry: a bilingual (EN/ES) Next.js website with an AI assistant that
answers questions, helps visitors choose a service, collects minimal contact details, and books Virtual Drop-In
appointments. A private team dashboard shows everything the assistant captures.

## Run it (2 minutes)

```bash
npm install
cp .env.example .env.local      # then paste your free key from https://console.groq.com/keys
npm run dev                     # http://localhost:3000
```

- Website + chat: `http://localhost:3000`
- Team dashboard: `http://localhost:3000/team` (set `TEAM_PASSCODE` in `.env.local` to protect it)

Production check: `npm run build && npm start`.

## What it does

| Feature | Where |
|---|---|
| Landing page, bilingual, brand style from the RALU logo | `components/Landing.tsx`, `app/globals.css`, `lib/i18n.ts` |
| Chat assistant (Groq, tool calling, up to 4 tool rounds) | `lib/agent.ts`, `app/api/chat/route.ts` |
| Live appointment slots in Puerto Rico time (AST), no double booking | `lib/slots.ts`, `lib/store.ts` |
| Tappable time slots, booking confirmation card, "Add to calendar" (.ics) | `components/ChatWidget.tsx` |
| Street outreach / referral / volunteer / donation-interest requests | tools in `lib/agent.ts` |
| Team dashboard (live, auto-refresh, filters, urgent alerts) | `components/TeamBoard.tsx` |
| Rate limiting to protect the free API key | `app/api/chat/route.ts` |

## Safety design (important for this audience)

- **Crisis messages never depend on the AI.** `lib/crisis.ts` checks every message (English and Spanish) *before* the
  model runs. A match returns a fixed reply with 911, 988, Línea PAS (Puerto Rico) and SAMHSA, shows call buttons, and
  adds an urgent alert to the dashboard. The message text itself is not stored.
- The model's prompt forbids medical/detox advice, asking about substances or criminal history, promising
  confidentiality, or claiming RALU is a licensed treatment provider.
- The AI can only *propose*; the server validates every booking (real slot, not taken, name and contact present).
- Confirmation is shown only after the server confirms the save.

## Before showing it to the client as final

1. **Answer the pending facts** in `lib/knowledge.ts` (cost, hours, service area, contact details, confidentiality
   wording, donation method). Until then the assistant says the team will confirm; it will not invent them.
2. **Set real availability** in `lib/slots.ts` (`HOURS_AST`, days ahead). Demo hours are 10:00, 14:00, 16:00, 19:00 AST.
3. **Verify the crisis numbers** in `lib/crisis.ts` and `lib/agent.ts` with the ministry (988, 1-800-981-0023 Línea PAS,
   1-800-662-4357 SAMHSA).
4. **Logo:** the header uses a typographic wordmark. Put the real logo at `public/logo.png` and edit
   `components/Wordmark.tsx`.
5. **Service descriptions** in `lib/i18n.ts` are placeholder copy based on the service names; have Bishop Luis approve them.

## Going live

- **Storage:** demo data is saved to `.data/store.json`. Serverless hosts (Vercel) have no persistent disk, so for a real
  launch replace `lib/store.ts` with a database (Supabase/Postgres/Airtable) and send email/WhatsApp alerts to the team.
- **Calendar/meeting links:** bookings currently create a record and an .ics download. Next step is Google Calendar +
  automatic Meet links.
- **Auth:** replace the passcode with real login before storing real people's contact details.
- **Privacy/legal:** this collects contact details of people seeking help. Add a privacy notice and consent text.
- **Model:** `GROQ_MODEL` defaults to `llama-3.3-70b-versatile`. Swap it in `.env.local` if Groq retires or renames it.

## Tests that were run on this build

`next build` and TypeScript pass. 17 end-to-end checks passed against a mock of Groq's OpenAI-compatible API (tool
calls, booking, double-booking rejection, invalid slot rejection, crisis EN/ES, no false positives, passcode,
validation), and the UI was driven in headless Chromium on desktop and mobile with no console errors.
The live Groq API itself was not available in the build environment, so do one real conversation with your key first.
