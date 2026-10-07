const API = 'https://data-api.binance.vision/api/v3'; // public market data, no key needed
const SYMBOLS = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT', 'XRPUSDT', 'ADAUSDT', 'DOGEUSDT', 'AVAXUSDT', 'LINKUSDT', 'TRXUSDT'];

const $ = id => document.getElementById(id);
const load = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } };
const save = (key, value) => { try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* storage unavailable */ } };
const fmt = n => n.toLocaleString(undefined, { maximumFractionDigits: Math.abs(n) < 1 ? 5 : 2 });
const pct = n => `${n > 0 ? '+' : ''}${n.toFixed(2)}%`;
const cls = n => (n > 0 ? 'gain' : n < 0 ? 'loss' : '');
const esc = s => s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

let trades = load('tb.trades', []);
let prefs = { theme: 'dark', accent: '#4c8dff', size: '16', ...load('tb.prefs', {}) };
let symbol = load('tb.symbol', 'BTCUSDT');
let candles = [];

/* ---------- Preferences ---------- */
function applyPrefs() {
  const root = document.documentElement;
  root.dataset.theme = prefs.theme;
  root.style.setProperty('--accent', prefs.accent);
  root.style.fontSize = prefs.size + 'px';
  $('theme').value = prefs.theme;
  $('accent').value = prefs.accent;
  $('size').value = prefs.size;
  drawChart();
}
for (const id of ['theme', 'accent', 'size']) {
  $(id).addEventListener('input', e => { prefs[id] = e.target.value; save('tb.prefs', prefs); applyPrefs(); });
}

/* ---------- Trade book ---------- */
function renderBook() {
  const s = Stats.summarize(trades);
  $('winRate').textContent = s.count ? Math.round(s.winRate) + '%' : '–';
  $('ring').style.setProperty('--rate', s.winRate);
  $('count').textContent = s.count;
  const net = $('pnl');
  net.textContent = fmt(s.totalPnl);
  net.className = cls(s.totalPnl);
  $('avgWin').textContent = s.avgWin === null ? '–' : fmt(s.avgWin);
  $('avgLoss').textContent = s.avgLoss === null ? '–' : fmt(s.avgLoss);
  $('coach').textContent = Stats.coachMessage(s);
  $('empty').hidden = trades.length > 0;
  $('rows').innerHTML = trades.map(t => {
    const p = Stats.pnl(t);
    return `<tr><td data-label="Asset">${esc(t.asset)}</td><td data-label="Side">${t.side}</td>` +
      `<td data-label="Entry">${fmt(t.entry)}</td><td data-label="Exit">${fmt(t.exit)}</td>` +
      `<td data-label="Size">${fmt(t.size)}</td><td data-label="P/L" class="${cls(p)}">${fmt(p)}</td>` +
      `<td><button type="button" data-del="${t.id}" aria-label="Delete trade">Delete</button></td></tr>`;
  }).join('');
}

$('tradeForm').addEventListener('submit', e => {
  e.preventDefault();
  const f = new FormData(e.target);
  const t = {
    id: Date.now(), asset: String(f.get('asset')).trim().toUpperCase(), side: f.get('side'),
    entry: Number(f.get('entry')), exit: Number(f.get('exit')), size: Number(f.get('size')),
  };
  if (!t.asset || !(t.entry > 0) || !(t.exit > 0) || !(t.size > 0)) return;
  trades.unshift(t);
  save('tb.trades', trades);
  e.target.reset();
  renderBook();
});

$('rows').addEventListener('click', e => {
  const id = e.target.dataset.del;
  if (!id) return;
  trades = trades.filter(t => String(t.id) !== id);
  save('tb.trades', trades);
  renderBook();
});

/* ---------- Live data ---------- */
async function get(path) {
  const res = await fetch(API + path);
  if (!res.ok) throw new Error('HTTP ' + res.status);
  return res.json();
}

function drawChart() {
  const c = $('chart');
  const ctx = c.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const w = c.clientWidth, h = c.clientHeight;
  c.width = w * dpr; c.height = h * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, w, h);
  if (candles.length < 2) return;

  const styles = getComputedStyle(document.documentElement);
  const muted = styles.getPropertyValue('--muted').trim();
  const grid = styles.getPropertyValue('--line').trim();
  const closes = candles.map(k => Number(k[4]));
  const min = Math.min(...closes), max = Math.max(...closes);
  const up = closes[closes.length - 1] >= closes[0];
  const accent = styles.getPropertyValue(up ? '--gain' : '--loss').trim();
  const padX = 8, padY = 22;
  const x = i => padX + (i * (w - padX * 2)) / (closes.length - 1);
  const y = v => h - padY - ((v - min) / (max - min || 1)) * (h - padY * 2);

  ctx.strokeStyle = grid; ctx.lineWidth = 1;
  for (let i = 0; i < 4; i++) {
    const gy = padY + (i * (h - padY * 2)) / 3;
    ctx.beginPath(); ctx.moveTo(padX, gy); ctx.lineTo(w - padX, gy); ctx.stroke();
  }
  ctx.beginPath();
  closes.forEach((v, i) => (i ? ctx.lineTo(x(i), y(v)) : ctx.moveTo(x(i), y(v))));
  ctx.strokeStyle = accent; ctx.lineWidth = 2; ctx.lineJoin = 'round'; ctx.stroke();
  ctx.lineTo(x(closes.length - 1), h - padY); ctx.lineTo(x(0), h - padY); ctx.closePath();
  ctx.globalAlpha = 0.12; ctx.fillStyle = accent; ctx.fill(); ctx.globalAlpha = 1;
  ctx.beginPath(); ctx.arc(x(closes.length - 1), y(closes[closes.length - 1]), 4, 0, Math.PI * 2); ctx.fillStyle = accent; ctx.fill();

  ctx.fillStyle = muted; ctx.font = '12px system-ui, sans-serif';
  ctx.textBaseline = 'top'; ctx.fillText(fmt(max), padX, 2);
  ctx.textBaseline = 'bottom'; ctx.fillText(fmt(min), padX, h - 2);
}

async function refreshChart() {
  if (document.hidden) return;
  try {
    candles = await get(`/klines?symbol=${symbol}&interval=1m&limit=120`);
    $('price').textContent = fmt(Number(candles[candles.length - 1][4]));
    $('status').textContent = 'Live. Updates every 5 seconds.';
    drawChart();
  } catch {
    $('status').textContent = "Can't reach the market data right now. Retrying.";
  }
}

async function refreshMarket() {
  if (document.hidden) return;
  try {
    const raw = await get('/ticker/24hr?symbols=' + encodeURIComponent(JSON.stringify(SYMBOLS)));
    const rows = raw.map(x => ({
      symbol: x.symbol, price: Number(x.lastPrice), change: Number(x.priceChangePercent),
      high: Number(x.highPrice), low: Number(x.lowPrice),
    }));

    $('yield').innerHTML = Stats.topYield(rows, 5).map(r =>
      `<li><button type="button" class="row sym" data-symbol="${r.symbol}">${r.symbol}</button>` +
      `<span class="why">${fmt(r.price)}</span><span class="end ${cls(r.change)}">${pct(r.change)}</span></li>`
    ).join('');

    const ideas = rows.map(r => ({ ...r, ...Stats.suggest(r) })).filter(r => r.action !== 'No clear edge');
    $('ideas').innerHTML = ideas.length
      ? ideas.slice(0, 5).map(r =>
          `<li><span class="sym">${r.symbol}</span><span><strong>${r.action}</strong><br><span class="why">${r.reason}</span></span>` +
          `<span class="end ${cls(r.change)}">${pct(r.change)}</span></li>`).join('')
      : '<li class="muted">No clear setups right now. Check back soon.</li>';
  } catch {
    $('yield').innerHTML = '<li class="muted">Market data is unavailable. Retrying.</li>';
  }
}

$('yield').addEventListener('click', e => {
  const s = e.target.dataset.symbol;
  if (s) { $('symbol').value = s; $('symbol').dispatchEvent(new Event('change')); }
});

$('symbol').innerHTML = SYMBOLS.map(s => `<option>${s}</option>`).join('');
$('assets').innerHTML = SYMBOLS.map(s => `<option value="${s}">`).join('');
if (!SYMBOLS.includes(symbol)) symbol = 'BTCUSDT';
$('symbol').value = symbol;
$('symbol').addEventListener('change', e => {
  symbol = e.target.value; save('tb.symbol', symbol);
  candles = []; $('price').textContent = '–'; refreshChart();
});

window.addEventListener('resize', drawChart);
applyPrefs();
renderBook();
refreshChart();
refreshMarket();
setInterval(refreshChart, 5000);
setInterval(refreshMarket, 15000);
