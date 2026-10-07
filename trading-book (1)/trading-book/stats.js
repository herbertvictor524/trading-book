(function (root) {
  // Profit or loss of one trade. Shorts profit when price falls.
  function pnl(t) {
    const dir = t.side === 'short' ? -1 : 1;
    return (t.exit - t.entry) * t.size * dir;
  }

  function summarize(trades) {
    const results = trades.map(pnl);
    const wins = results.filter(r => r > 0);
    const losses = results.filter(r => r < 0);
    const sum = a => a.reduce((x, y) => x + y, 0);
    return {
      count: trades.length,
      wins: wins.length,
      losses: losses.length,
      winRate: trades.length ? (wins.length / trades.length) * 100 : 0,
      totalPnl: sum(results),
      avgWin: wins.length ? sum(wins) / wins.length : null,
      avgLoss: losses.length ? sum(losses) / losses.length : null,
    };
  }

  // Assets with the highest 24h percentage change, best first.
  function topYield(rows, n) {
    return rows.slice().sort((a, b) => b.change - a.change).slice(0, n);
  }

  // Simple momentum rule: 24h change plus where price sits in the 24h range.
  function suggest(r) {
    const range = r.high - r.low;
    const pos = range > 0 ? (r.price - r.low) / range : 0.5;
    if (r.change >= 3) {
      return pos < 0.85
        ? { action: 'Look to buy', reason: 'Rising, with room left below the daily high.' }
        : { action: 'Wait for a pullback', reason: 'Rising, but already near the daily high.' };
    }
    if (r.change <= -3) {
      return pos <= 0.2
        ? { action: 'Watch for a bounce', reason: 'Down sharply and sitting near the daily low.' }
        : { action: 'Stay out', reason: 'Falling and not yet at the daily low.' };
    }
    return { action: 'No clear edge', reason: 'Price is moving sideways.' };
  }

  // Plain-language read of the trader's results.
  function coachMessage(s) {
    if (!s.count) return "Your book is empty. Log a trade and I'll start keeping score.";
    const rate = Math.round(s.winRate);
    const parts = [];
    if (s.count < 5) {
      parts.push(`${s.count} trade${s.count > 1 ? 's' : ''} logged so far. That's too few to judge, so keep logging.`);
    } else if (s.winRate >= 60) {
      parts.push(`You're winning ${rate}% of your trades. That's a solid edge.`);
    } else if (s.winRate >= 45) {
      parts.push(`You're winning ${rate}% of your trades, close to even. What you make on winners versus lose on losers decides the outcome.`);
    } else {
      parts.push(`You're winning ${rate}% of your trades, under half. Look at what your losing trades have in common.`);
    }
    if (s.avgWin !== null && s.avgLoss !== null) {
      parts.push(s.avgWin > Math.abs(s.avgLoss)
        ? 'Your average win is bigger than your average loss, which helps a lot.'
        : 'Your average loss is bigger than your average win. Try tighter stops or let winners run.');
    }
    return parts.join(' ');
  }

  const api = { pnl, summarize, topYield, suggest, coachMessage };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.Stats = api;
})(this);
