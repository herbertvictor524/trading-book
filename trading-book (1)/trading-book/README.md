# Trading Book

A simple trading journal that runs in the browser. No build step, no API key.

- **Win rate and stats**: log trades and see win rate, net P/L, average win and average loss.
- **Highest 24h yield**: the top movers from a list of 10 major crypto pairs.
- **Trade ideas**: simple momentum rules based on 24h change and where price sits in the daily range.
- **Plain-language feedback**: a short read of how your results look.
- **Live chart**: 1-minute prices, refreshed every 5 seconds, from Binance's public market data.
- **Customizable UI**: light or dark theme, accent color and text size, saved in your browser.

Trades are stored in your browser's localStorage. Nothing is sent anywhere.

## Run it

Open `index.html` in a browser, or serve the folder:

```
npm start        # then visit http://localhost:8000
```

## Test

Needs Node 18 or newer.

```
npm test
```

## Customize

- Assets: edit the `SYMBOLS` list at the top of `app.js` (use Binance pair names such as `BTCUSDT`).
- Colors and spacing: edit the variables at the top of `style.css`.
- Suggestion rules and coach messages: edit `stats.js`.

## Deploy with GitHub Pages

In your repo, go to Settings > Pages, choose "Deploy from a branch", select `main` and `/ (root)`. Your site will be at `https://<your-username>.github.io/trading-book/`.

## Disclaimer

Trade ideas are simple rules, not financial advice. Markets carry risk.
