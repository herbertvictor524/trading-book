const test = require('node:test');
const assert = require('node:assert/strict');
const S = require('../stats.js');

const trade = (side, entry, exit, size = 1) => ({ side, entry, exit, size });

test('pnl: long profits when price rises, short when it falls', () => {
  assert.equal(S.pnl(trade('long', 100, 110, 2)), 20);
  assert.equal(S.pnl(trade('short', 100, 90)), 10);
  assert.equal(S.pnl(trade('short', 100, 110)), -10);
});

test('summarize: empty book has zeroed stats and null averages', () => {
  const s = S.summarize([]);
  assert.equal(s.count, 0);
  assert.equal(s.winRate, 0);
  assert.equal(s.avgWin, null);
  assert.equal(s.avgLoss, null);
});

test('summarize: win rate, totals and averages', () => {
  const s = S.summarize([trade('long', 10, 15), trade('long', 10, 8), trade('short', 10, 6)]);
  assert.equal(s.wins, 2);
  assert.equal(s.losses, 1);
  assert.ok(Math.abs(s.winRate - 66.666) < 0.01);
  assert.equal(s.totalPnl, 7);
  assert.equal(s.avgWin, 4.5);
  assert.equal(s.avgLoss, -2);
});

test('summarize: a breakeven trade is neither a win nor a loss', () => {
  const s = S.summarize([trade('long', 10, 10), trade('long', 10, 12)]);
  assert.equal(s.wins, 1);
  assert.equal(s.losses, 0);
  assert.equal(s.winRate, 50);
});

test('topYield: sorts best first, limits count, does not mutate input', () => {
  const rows = [{ change: 1 }, { change: 9 }, { change: -4 }, { change: 5 }];
  assert.deepEqual(S.topYield(rows, 2).map(r => r.change), [9, 5]);
  assert.equal(rows[0].change, 1);
});

test('suggest: covers each branch', () => {
  assert.equal(S.suggest({ change: 5, price: 90, low: 80, high: 100 }).action, 'Look to buy');
  assert.equal(S.suggest({ change: 5, price: 99, low: 80, high: 100 }).action, 'Wait for a pullback');
  assert.equal(S.suggest({ change: -5, price: 81, low: 80, high: 100 }).action, 'Watch for a bounce');
  assert.equal(S.suggest({ change: -5, price: 95, low: 80, high: 100 }).action, 'Stay out');
  assert.equal(S.suggest({ change: 1, price: 90, low: 80, high: 100 }).action, 'No clear edge');
});

test('suggest: flat daily range does not divide by zero', () => {
  assert.equal(S.suggest({ change: 4, price: 50, low: 50, high: 50 }).action, 'Look to buy');
});

test('coachMessage: empty book, small sample, and strong results', () => {
  assert.match(S.coachMessage(S.summarize([])), /empty/);
  assert.match(S.coachMessage(S.summarize([trade('long', 1, 2)])), /too few/);
  const good = Array.from({ length: 5 }, () => trade('long', 10, 14));
  assert.match(S.coachMessage(S.summarize(good)), /100%/);
});
