# Maison Camy

Back-office CRM for Camy Luxury (`@camyluxury`) — a private personal shopper service for a Moroccan luxury clientele.

## Product notes

- **Architecture:** package- and trip-first. The mobile capture flow is the critical path.
- **Locale:** French copy, EUR currency formatting.
- **No dark mode** — single light theme by design.

## Design system

- **Palette:** warm ivory background, rose primary, gold accent.
- **Typography:** Cormorant Garamond (display) + DM Sans (body).
- **Aesthetic:** soft, feminine, luxury.

## Stack

Vite + React 18 + TypeScript, Tailwind, shadcn/ui (Radix), TanStack Query, React Router, Supabase, Playwright + Vitest.

## Development

```bash
npm install
npm run dev          # http://localhost:8080
npm run build
npm run lint
npm test             # vitest
```

Environment variables go in `.env` (see existing `VITE_SUPABASE_*` keys).
