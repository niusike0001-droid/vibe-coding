# Vibe Coding — Design System Assistant

A mobile-first PWA for managing design tokens, exporting code, and deploying style systems. Designed with Google Stitch using the "Paper and Ink" brutalist/minimalist philosophy.

## Project Structure

```
stitch-app/
├── index.html              # Main SPA shell
├── manifest.json           # PWA manifest
├── sw.js                   # Service Worker (offline caching)
├── css/
│   └── style.css           # Design system CSS
├── js/
│   ├── app.js              # Router, state, persistence
│   └── screens/
│       ├── dashboard.js    # Dashboard screen
│       ├── tokens.js       # Design tokens screen
│       ├── code.js         # Code export screen
│       ├── deploy.js       # Deploy screen
│       └── settings.js     # Settings screen
├── assets/icons/
│   └── icon.svg            # PWA icon
├── backend/
│   ├── server.js           # Express API server
│   └── package.json        # Backend dependencies
└── DESIGN.md               # Original Stitch design spec
```

## Quick Start (Frontend)

```bash
# Serve locally
npx serve .

# Or with Python
python -m http.server 8080
```

Open http://localhost:8080 on your phone or browser.

## Backend API

```bash
cd backend
npm install
npm run dev
```

### API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/tokens` | Get all design tokens |
| GET | `/api/tokens/:category` | Get token category |
| PUT | `/api/tokens/:category` | Update token category |
| POST | `/api/generate/css` | Generate CSS from tokens |
| POST | `/api/generate/bundle` | Generate full HTML bundle |
| GET | `/api/exports` | Export history |
| POST | `/api/projects` | Create project |
| GET | `/api/projects` | List projects |

## Deploy to GitHub Pages

1. Push to GitHub
2. Settings → Pages → Source: "GitHub Actions" or "Deploy from branch (main)"
3. Your app will be live at `https://<username>.github.io/<repo>/`

## Backend Deployment

Deploy the backend separately on Railway, Render, or Fly.io:

```bash
cd backend
# Railway
railway up

# Render
# Connect repo and set build command: cd backend && npm install
# Start command: cd backend && node server.js
```

Then update the API URL in the app's Settings screen.
