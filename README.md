# trading-book

A simple trading journal and market dashboard for tracking trades, measuring win rate, analyzing asset performance, and getting actionable trade suggestions.

## Features
- Trade journal with wins/losses and profit percentages
- Win rate tracking
- Asset performance leaderboard by percentage yield
- AI-like suggestion cards for what to watch next
- Human notes / response area for trade reflections
- Live-updating charts with customizable UI

## Run locally
Open `index.html` directly in a browser, or serve the folder:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## Project structure
- `index.html` — app shell and panels
- `style.css` — theme and layout styling
- `app.js` — journal logic, analytics, charts, and suggestions

## Notes
This version is intentionally lightweight and dependency-free so it works immediately in a browser while still covering the core trading-book concept.
