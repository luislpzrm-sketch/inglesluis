# LinguaUK v2 — Deployment Guide

## Install on iPhone in 10 minutes

### Step 1 — Deploy to Vercel

**Option A — Drag & drop (easiest):**
1. Go to vercel.com → sign up free
2. Click "Add New Project" → "Browse" or drag the `linguauk2` folder
3. Deploy → get your URL (e.g. linguauk.vercel.app)

**Option B — From GitHub:**
1. Push this folder to a GitHub repo
2. Import repo in Vercel

### Step 2 — Add your Anthropic API key (for AI features)

In Vercel dashboard → your project → Settings → Environment Variables:
- Name: `ANTHROPIC_API_KEY`
- Value: your key from console.anthropic.com
- Click Save → Redeploy

### Step 3 — Install on iPhone

1. Open your Vercel URL in **Safari** (must be Safari)
2. Tap Share button → "Add to Home Screen"
3. Tap Add → app appears on home screen

### Step 4 — Use on PC

Same URL works in any browser on desktop. Fully responsive.

---

## What works without API key (offline)
- All vocabulary cards (spaced repetition)
- Grammar exercises
- Speaking (listen + record)
- US → UK module
- Progress tracking (stored locally)

## What needs API key
- AI Role play (all tracks)
- Writing feedback
- Protocol check (Veterinary)
- Tech interview practice

---

## Project structure
```
linguauk2/
├── index.html          App (track-first navigation)
├── manifest.json       PWA config
├── sw.js               Service Worker (offline)
├── vercel.json         Vercel config
├── api/
│   └── claude.js       Serverless proxy (keeps API key secure)
├── css/
│   └── app.css         All styles
├── js/
│   ├── data.js         All content
│   ├── app.js          Navigation
│   ├── modules.js      Exercise modules
│   └── ai.js           AI integration
└── icons/
```

## Adding content
- Vocabulary: `js/data.js` → `vocab.everyday/vet/tech`
- Grammar: `js/data.js` → `grammar.everyday/vet/tech`
- Speaking phrases: `js/data.js` → `speaking.everyday/vet/tech`
- Role play scenarios: `js/data.js` → `roleplay` array
- US→UK pairs: `js/data.js` → `usuk` array
