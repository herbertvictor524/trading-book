@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

:root {
  --bg: #08111f;
  --bg-strong: #111827;
  --panel: rgba(15, 23, 42, 0.85);
  --panel-alt: rgba(15, 23, 42, 0.75);
  --card: rgba(21, 32, 52, 0.9);
  --text: #e2e8f0;
  --muted: #94a3b8;
  --line: rgba(148, 163, 184, 0.18);
  --success: #34d399;
  --danger: #f87171;
  --warning: #fbbf24;
  --accent: #5eead4;
  --shadow: rgba(15, 23, 42, 0.35);
}

body[data-theme='forest'] {
  --bg: #071a14;
  --bg-strong: #0b1d1a;
  --panel: rgba(12, 37, 31, 0.88);
  --panel-alt: rgba(8, 31, 25, 0.78);
  --card: rgba(16, 50, 42, 0.9);
  --text: #e8fff3;
  --muted: #9cc8b0;
  --line: rgba(156, 200, 176, 0.22);
  --accent: #6ee7b7;
}

body[data-theme='sunset'] {
  --bg: #1b1016;
  --bg-strong: #2a1221;
  --panel: rgba(41, 18, 30, 0.86);
  --panel-alt: rgba(51, 20, 35, 0.78);
  --card: rgba(70, 30, 48, 0.9);
  --text: #fdf2f8;
  --muted: #f9a8d4;
  --line: rgba(249, 168, 212, 0.2);
  --accent: #f9a8d4;
}

body[data-density='compact'] {
  --space: 0.75rem;
  --panel-pad: 0.8rem;
  --font-size: 0.92rem;
}

body[data-density='comfortable'] {
  --space: 1rem;
  --panel-pad: 1.1rem;
  --font-size: 1rem;
}

* {
  box-sizing: border-box;
}

html, body {
  margin: 0;
  min-height: 100%;
  font-family: 'Inter', sans-serif;
  background: radial-gradient(circle at top, rgba(94, 234, 212, 0.18), transparent 25%), var(--bg);
  color: var(--text);
  font-size: var(--font-size);
}

body {
  padding: 24px;
}

button, select, input {
  font: inherit;
}

.app-shell {
  max-width: 1380px;
  margin: 0 auto;
}

.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.25rem;
  padding: 1rem 1.2rem;
  background: rgba(15, 23, 42, 0.64);
  border: 1px solid var(--line);
  border-radius: 18px;
  box-shadow: 0 20px 45px var(--shadow);
  backdrop-filter: blur(12px);
}

.eyebrow {
  margin: 0;
  color: var(--accent);
  text-transform: uppercase;
  font-weight: 700;
  letter-spacing: 0.12em;
  font-size: 0.7rem;
}

h1 {
  margin: 0.1rem 0 0;
  font-size: clamp(1.8rem, 3vw, 2.5rem);
}

.topbar-controls {
  display: flex;
  flex-wrap: wrap;
  align-items: end;
  gap: 0.85rem;
}

.topbar-controls label {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  color: var(--muted);
  font-size: 0.75rem;
}

select, input[type='color'] {
  border: 1px solid var(--line);
  border-radius: 10px;
  padding: 0.5rem 0.7rem;
  background: rgba(15, 23, 42, 0.7);
  color: var(--text);
}

input[type='color'] {
  width: 52px;
  height: 40px;
  padding: 0.2rem;
  cursor: pointer;
}

.dashboard {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1rem;
}

.panel {
  background: linear-gradient(180deg, var(--panel), var(--panel-alt));
  border: 1px solid var(--line);
  border-radius: 18px;
  padding: var(--panel-pad);
  box-shadow: 0 18px 35px var(--shadow);
}

.panel-wide {
  grid-column: span 2;
}

.stats-grid {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1rem;
}

.stat-card {
  padding: 1rem;
  border-radius: 16px;
  background: linear-gradient(180deg, rgba(15, 23, 42, 0.85), rgba(15, 23, 42, 0.65));
  border: 1px solid var(--line);
}

.stat-card .label {
  color: var(--muted);
  font-size: 0.74rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.stat-card .value {
  margin-top: 0.6rem;
  font-size: clamp(1.5rem, 2vw, 2.2rem);
  font-weight: 800;
}

.stat-card .meta {
  margin-top: 0.45rem;
  color: var(--muted);
  font-size: 0.8rem;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.8rem;
}

.panel-header h2 {
  margin: 0;
  font-size: 1.02rem;
}

.chip {
  display: inline-flex;
  align-items: center;
  background: rgba(52, 211, 153, 0.12);
  color: var(--success);
  border: 1px solid rgba(52, 211, 153, 0.3);
  border-radius: 999px;
  padding: 0.38rem 0.6rem;
  font-size: 0.75rem;
  font-weight: 700;
}

.table-wrap {
  overflow: auto;
}

 table {
  width: 100%;
  border-collapse: collapse;
}

 th, td {
  padding: 0.75rem 0.5rem;
  border-bottom: 1px solid var(--line);
  text-align: left;
}

 th {
  color: var(--muted);
  font-size: 0.72rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

 td strong {
  font-weight: 700;
 }

 .positive { color: var(--success); }
 .negative { color: var(--danger); }
 .neutral { color: var(--warning); }

 .suggestions-list,
 .notes-list,
 .trade-list {
  display: grid;
  gap: 0.85rem;
}

.suggestion-card,
.note-card,
.trade-item {
  padding: 0.9rem 0.95rem;
  background: rgba(15, 23, 42, 0.54);
  border: 1px solid var(--line);
  border-radius: 14px;
}

.suggestion-card h3,
.note-card h3,
.trade-item h3 {
  margin: 0 0 0.35rem;
  font-size: 0.98rem;
}

.suggestion-card p,
.note-card p,
.trade-item p {
  margin: 0;
  color: var(--muted);
  line-height: 1.5;
}

.trade-item {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 12px;
}

.trade-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 52px;
  height: 52px;
  border-radius: 12px;
  font-weight: 800;
  background: rgba(94, 234, 212, 0.12);
  color: var(--accent);
}

.trade-item.win .trade-badge {
  background: rgba(52, 211, 153, 0.12);
  color: var(--success);
}

.trade-item.loss .trade-badge {
  background: rgba(248, 113, 113, 0.12);
  color: var(--danger);
}

.trade-metric {
  font-size: 1.1rem;
  font-weight: 800;
}

canvas {
  max-height: 330px;
  width: 100%;
}

@media (max-width: 980px) {
  .dashboard {
    grid-template-columns: 1fr 1fr;
  }

  .panel-wide {
    grid-column: span 2;
  }
}

@media (max-width: 640px) {
  body {
    padding: 16px;
  }

  .topbar {
    flex-direction: column;
    align-items: stretch;
  }

  .dashboard,
  .stats-grid {
    grid-template-columns: 1fr;
  }

  .panel-wide {
    grid-column: span 1;
  }
}
