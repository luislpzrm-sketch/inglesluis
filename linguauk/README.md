# LinguaUK — Deployment Guide

## Install on iPhone (PWA) in 10 minutes

### Step 1 — Deploy to Vercel (free, 2 minutes)

1. Go to https://vercel.com and sign up with your GitHub account (free)
2. Click "Add New Project"
3. Drag and drop the `linguauk` folder, OR connect your GitHub repo
4. Click Deploy — Vercel builds it in ~30 seconds
5. You get a URL like: `https://linguauk.vercel.app`

### Step 2 — Install on your iPhone

1. Open Safari on your iPhone (must be Safari, not Chrome)
2. Go to your Vercel URL
3. Tap the Share button (the square with an arrow pointing up)
4. Scroll down and tap "Add to Home Screen"
5. Name it "LinguaUK" → tap Add
6. Done — the app appears on your home screen like a native app

### Step 3 — Use on PC

Simply open the same Vercel URL in any browser on your PC.
The app is fully responsive and works perfectly on desktop too.

---

## Alternative: Deploy with Netlify

1. Go to https://netlify.com
2. Drag and drop the `linguauk` folder to the deploy area
3. Get your URL instantly
4. Same iPhone install process as above

---

## AI Features (Role play & Writing feedback)

The AI features (Role play and Writing feedback) call the Anthropic Claude API.
These work automatically when you access the app through claude.ai.

If you deploy standalone, you'll need to add your Anthropic API key.
Options:
- Use a Vercel serverless function as a proxy (keeps your key secure)
- Or simply use the app through the claude.ai artifact for AI features

---

## What works offline (after first load)

- All vocabulary cards
- Grammar exercises  
- Speaking exercises (listen + record)
- US → UK module
- Your progress and streak (stored locally)

Requires internet:
- AI Role play
- Writing feedback

---

## Files structure

```
linguauk/
├── index.html          Main app
├── manifest.json       PWA config (name, icon, display mode)
├── sw.js               Service Worker (offline cache)
├── css/
│   └── app.css         All styles
├── js/
│   ├── data.js         All content (vocab, grammar, scenarios)
│   ├── app.js          Navigation & core logic
│   ├── modules.js      All exercise modules
│   └── ai.js           Claude API integration
└── icons/
    ├── icon-192.png    App icon
    └── icon-512.png    App icon (large)
```

## Customisation

To add more vocabulary cards: edit `js/data.js` → `vocabCards` array
To add grammar questions: edit `js/data.js` → `grammarQuestions` array  
To add roleplay scenarios: edit `js/data.js` → `roleplayScenarios` array
