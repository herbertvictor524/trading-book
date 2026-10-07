import { useMemo, useState } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { AccentMode, ThemeMode, Trade, TradeFormState } from './types';

const STORAGE_KEY = 'trading-book-trades';
const THEME_KEY = 'trading-book-theme';
const ACCENT_KEY = 'trading-book-accent';

const initialTrades: Trade[] = [
  {
    id: '1',
    asset: 'BTC/USD',
    side: 'Long',
    entry: 61200,
    exit: 67250,
    quantity: 0.7,
    date: '2026-09-18',
    notes: 'Breakout above weekly resistance with strong momentum.',
  },
  {
    id: '2',
    asset: 'ETH/USD',
    side: 'Long',
    entry: 3410,
    exit: 3290,
    quantity: 2.5,
    date: '2026-09-17',
    notes: 'Quick fade after a late-session rejection — stay disciplined.',
  },
  {
    id: '3',
    asset: 'NVDA',
    side: 'Long',
    entry: 118,
    exit: 126.4,
    quantity: 85,
    date: '2026-09-14',
    notes: 'Trend continuation after earnings drift and volume expansion.',
  },
  {
    id: '4',
    asset: 'AAPL',
    side: 'Short',
    entry: 215,
    exit: 206,
    quantity: 40,
    date: '2026-09-10',
    notes: 'Failed breakout and rejection near the prior high.',
  },
  {
    id: '5',
    asset: 'SOL/USD',
    side: 'Long',
    entry: 142,
    exit: 158,
    quantity: 10,
    date: '2026-09-09',
    notes: 'Strong reclaim of support zone and higher lows.',
  },
];

const initialForm: TradeFormState = {
  asset: 'BTC/USD',
  side: 'Long',
  entry: '100',
  exit: '110',
  quantity: '1',
  date: new Date().toISOString().slice(0, 10),
  notes: '',
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: value >= 1000 ? 0 : 2,
  }).format(value);

const getPercentReturn = (trade: Trade) => {
  const base = trade.entry === 0 ? 0 : (trade.exit - trade.entry) / trade.entry;
  return trade.side === 'Long' ? base * 100 : -base * 100;
};

const getPnl = (trade: Trade) => {
  const diff = trade.side === 'Long' ? trade.exit - trade.entry : trade.entry - trade.exit;
  return diff * trade.quantity;
};

const getSuggestionScore = (asset: string, trades: Trade[]) => {
  const items = trades.filter((trade) => trade.asset === asset);
  const winRate = items.length
    ? (items.filter((trade) => getPnl(trade) > 0).length / items.length) * 100
    : 0;
  const avgReturn = items.length
    ? items.reduce((sum, trade) => sum + getPercentReturn(trade), 0) / items.length
    : 0;
  const recency = items.length ? Math.min(10, items.length) : 0;
  return winRate * 0.65 + avgReturn * 1.2 + recency * 2;
};

const sortTradesByDate = (a: Trade, b: Trade) => new Date(b.date).getTime() - new Date(a.date).getTime();

function StatCard({
  label,
  value,
  subtext,
}: {
  label: string;
  value: string;
  subtext: string;
}) {
  return (
    <div className="stat-card">
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
      <div className="stat-subtext">{subtext}</div>
    </div>
  );
}

function TradeForm({
  form,
  onChange,
  onSubmit,
}: {
  form: TradeFormState;
  onChange: (field: keyof TradeFormState, value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <form className="panel form-panel" onSubmit={onSubmit}>
      <div className="panel-header">
        <h3>Log a trade</h3>
      </div>

      <div className="fields-grid">
        <label>
          Asset
          <input
            value={form.asset}
            onChange={(event) => onChange('asset', event.target.value)}
            placeholder="BTC/USD"
          />
        </label>

        <label>
          Side
          <select value={form.side} onChange={(event) => onChange('side', event.target.value)}>
            <option value="Long">Long</option>
            <option value="Short">Short</option>
          </select>
        </label>

        <label>
          Entry
          <input
            type="number"
            min="0"
            step="0.01"
            value={form.entry}
            onChange={(event) => onChange('entry', event.target.value)}
          />
        </label>

        <label>
          Exit
          <input
            type="number"
            min="0"
            step="0.01"
            value={form.exit}
            onChange={(event) => onChange('exit', event.target.value)}
          />
        </label>

        <label>
          Quantity
          <input
            type="number"
            min="0"
            step="0.01"
            value={form.quantity}
            onChange={(event) => onChange('quantity', event.target.value)}
          />
        </label>

        <label>
          Date
          <input type="date" value={form.date} onChange={(event) => onChange('date', event.target.value)} />
        </label>
      </div>

      <label>
        Journal / human response
        <textarea
          rows={4}
          value={form.notes}
          onChange={(event) => onChange('notes', event.target.value)}
          placeholder="What was the setup? What did you feel? What did you learn?"
        />
      </label>

      <button type="submit" className="primary-button">
        Save trade
      </button>
    </form>
  );
}

function App() {
  const [trades, setTrades] = useState<Trade[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : initialTrades;
  });

  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem(THEME_KEY) as ThemeMode | null;
    return saved ?? 'dark';
  });

  const [accent, setAccent] = useState<AccentMode>(() => {
    const saved = localStorage.getItem(ACCENT_KEY) as AccentMode | null;
    return saved ?? 'cyan';
  });

  const [form, setForm] = useState<TradeFormState>(initialForm);

  const aggregate = useMemo(() => {
    const totalTrades = trades.length;
    const winners = trades.filter((trade) => getPnl(trade) > 0).length;
    const winRate = totalTrades ? (winners / totalTrades) * 100 : 0;
    const netPnl = trades.reduce((sum, trade) => sum + getPnl(trade), 0);
    const avgReturn =
      totalTrades > 0
        ? trades.reduce((sum, trade) => sum + getPercentReturn(trade), 0) / totalTrades
        : 0;

    return { totalTrades, winners, winRate, netPnl, avgReturn };
  }, [trades]);

  const assetStats = useMemo(() => {
    const map = new Map<string, Trade[]>();

    trades.forEach((trade) => {
      const existing = map.get(trade.asset) ?? [];
      existing.push(trade);
      map.set(trade.asset, existing);
    });

    return Array.from(map.entries())
      .map(([asset, assetTrades]) => {
        const pnl = assetTrades.reduce((sum, trade) => sum + getPnl(trade), 0);
        const avgPct =
          assetTrades.reduce((sum, trade) => sum + getPercentReturn(trade), 0) / assetTrades.length;
        const wins = assetTrades.filter((trade) => getPnl(trade) > 0).length;
        const winRate = (wins / assetTrades.length) * 100;

        return { asset, pnl, avgPct, wins, winRate, trades: assetTrades.length };
      })
      .sort((a, b) => b.avgPct - a.avgPct)
      .slice(0, 5);
  }, [trades]);

  const suggestions = useMemo(() => {
    const uniqueAssets = [...new Set(trades.map((trade) => trade.asset))];

    return uniqueAssets
      .map((asset) => {
        const score = getSuggestionScore(asset, trades);
        const assetTrades = trades.filter((trade) => trade.asset === asset);
        const avgReturn =
          assetTrades.reduce((sum, trade) => sum + getPercentReturn(trade), 0) / assetTrades.length;
        const winRate =
          (assetTrades.filter((trade) => getPnl(trade) > 0).length / assetTrades.length) * 100;

        return { asset, score, avgReturn, winRate, count: assetTrades.length };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  }, [trades]);

  const chartData = useMemo(() => {
    const sorted = [...trades].sort(sortTradesByDate);
    let cumulative = 0;

    return sorted.map((trade) => {
      cumulative += getPercentReturn(trade);
      return {
        label: trade.asset,
        date: trade.date,
        cumulative,
        pnl: getPnl(trade),
      };
    });
  }, [trades]);

  const recentNotes = useMemo(
    () => [...trades].sort(sortTradesByDate).slice(0, 3),
    [trades],
  );

  const handleFieldChange = (field: keyof TradeFormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextTrade: Trade = {
      id: `${Date.now()}`,
      asset: form.asset.trim() || 'UNKNOWN',
      side: form.side,
      entry: Number(form.entry) || 0,
      exit: Number(form.exit) || 0,
      quantity: Number(form.quantity) || 0,
      date: form.date || new Date().toISOString().slice(0, 10),
      notes: form.notes.trim(),
    };

    const updated = [nextTrade, ...trades];
    setTrades(updated);
    setForm(initialForm);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const handleDelete = (id: string) => {
    const updated = trades.filter((trade) => trade.id !== id);
    setTrades(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  useMemo(() => {
    localStorage.setItem(THEME_KEY, theme);
    localStorage.setItem(ACCENT_KEY, accent);
  }, [theme, accent]);

  return (
    <div className={`app ${theme} accent-${accent}`}>
      <div className="topbar">
        <div>
          <p className="eyebrow">Portfolio journal</p>
          <h1>Trading Book</h1>
        </div>

        <div className="toolbar">
          <label>
            Theme
            <select value={theme} onChange={(event) => setTheme(event.target.value as ThemeMode)}>
              <option value="dark">Dark</option>
              <option value="light">Light</option>
            </select>
          </label>

          <label>
            Accent
            <select value={accent} onChange={(event) => setAccent(event.target.value as AccentMode)}>
              <option value="cyan">Cyan</option>
              <option value="gold">Gold</option>
              <option value="purple">Purple</option>
            </select>
          </label>
        </div>
      </div>

      <main className="dashboard">
        <section className="stats-grid">
          <StatCard
            label="Net P&L"
            value={formatCurrency(aggregate.netPnl)}
            subtext={aggregate.netPnl >= 0 ? 'Positive momentum' : 'Risk still active'}
          />
          <StatCard
            label="Win rate"
            value={`${aggregate.winRate.toFixed(1)}%`}
            subtext={`${aggregate.winners}/${aggregate.totalTrades} winning trades`}
          />
          <StatCard
            label="Average return"
            value={`${aggregate.avgReturn.toFixed(1)}%`}
            subtext="Per trade return"
          />
          <StatCard
            label="Tracked assets"
            value={`${new Set(trades.map((trade) => trade.asset)).size}`}
            subtext="Unique symbols"
          />
        </section>

        <section className="content-grid">
          <TradeForm form={form} onChange={handleFieldChange} onSubmit={handleSubmit} />

          <div className="panel chart-panel">
            <div className="panel-header">
              <h3>Portfolio curve</h3>
              <span className="pill">Live style</span>
            </div>

            <div className="chart-wrap">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 20, right: 8, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="curveFill" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="var(--accent)" stopOpacity={0.55} />
                      <stop offset="100%" stopColor="var(--accent)" stopOpacity={0.04} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="var(--grid)" strokeDasharray="4 4" />
                  <XAxis dataKey="date" tick={{ fill: 'var(--muted)' }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fill: 'var(--muted)' }} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      background: 'var(--panel-strong)',
                      border: '1px solid var(--border)',
                      borderRadius: 12,
                    }}
                  />
                  <Area type="monotone" dataKey="cumulative" stroke="var(--accent)" fill="url(#curveFill)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        <section className="bottom-grid">
          <div className="panel">
            <div className="panel-header">
              <h3>Top assets by yield</h3>
            </div>

            <div className="asset-list">
              {assetStats.map((item) => (
                <div key={item.asset} className="asset-row">
                  <div>
                    <div className="asset-name">{item.asset}</div>
                    <div className="asset-meta">{item.trades} trades · {item.winRate.toFixed(0)}% win rate</div>
                  </div>
                  <div className="asset-values">
                    <strong>{item.avgPct.toFixed(1)}%</strong>
                    <span>{formatCurrency(item.pnl)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="panel">
            <div className="panel-header">
              <h3>Suggested trades</h3>
            </div>

            <div className="suggestions-list">
              {suggestions.map((item) => (
                <div key={item.asset} className="suggestion-card">
                  <div className="suggestion-head">
                    <strong>{item.asset}</strong>
                    <span>{item.winRate.toFixed(0)}% win rate</span>
                  </div>
                  <p>
                    {item.avgReturn >= 0
                      ? `Strong setup with ${item.avgReturn.toFixed(1)}% average return across ${item.count} trades.`
                      : `Caution: recent results are mixed, but the setup still has a tradeable edge.`}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="panel">
            <div className="panel-header">
              <h3>Human responses</h3>
            </div>

            <div className="notes-list">
              {recentNotes.map((note) => (
                <div key={note.id} className="note-item">
                  <div className="note-header">
                    <strong>{note.asset}</strong>
                    <span>{note.date}</span>
                  </div>
                  <p>{note.notes || 'No reflection recorded yet.'}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="panel ledger-panel">
          <div className="panel-header">
            <h3>Trade ledger</h3>
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Asset</th>
                  <th>Side</th>
                  <th>Entry</th>
                  <th>Exit</th>
                  <th>Qty</th>
                  <th>P/L</th>
                  <th>Ret.</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {trades.map((trade) => (
                  <tr key={trade.id}>
                    <td>{trade.asset}</td>
                    <td>{trade.side}</td>
                    <td>{trade.entry}</td>
                    <td>{trade.exit}</td>
                    <td>{trade.quantity}</td>
                    <td className={getPnl(trade) >= 0 ? 'positive' : 'negative'}>
                      {formatCurrency(getPnl(trade))}
                    </td>
                    <td className={getPercentReturn(trade) >= 0 ? 'positive' : 'negative'}>
                      {getPercentReturn(trade).toFixed(1)}%
                    </td>
                    <td>
                      <button className="delete-button" onClick={() => handleDelete(trade.id)}>
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
