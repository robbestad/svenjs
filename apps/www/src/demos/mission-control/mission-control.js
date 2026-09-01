export function createMissionControl({ create, createStore, html }) {
  const UNIT_COUNT = 100;
  const HISTORY_LENGTH = 42;
  const STORAGE_THEME = "svenjs-mission-theme";
  const STORAGE_FLEET = "svenjs-mission-fleet";
  const SECTORS = ["AURORA", "BOREAL", "CIRRUS", "DELTA", "ECHO"];
  const STATUS_ORDER = { critical: 0, watch: 1, nominal: 2 };

  const MISSION_CSS = `
.mission-console{--mc-bg:#10100e;--mc-surface:#181713;--mc-surface-2:#201e19;--mc-ink:#f3eee6;--mc-muted:#aaa194;--mc-rule:#38342c;--mc-accent:#ed7d3a;--mc-accent-ink:#211b15;--mc-accent-soft:#f0b27a;--mc-ok:#70c9a5;--mc-warn:#e5b65b;--mc-info:#74abc1;--mc-critical:#ff8a80;--mc-log-height:29rem;color-scheme:dark;color:var(--mc-ink);background:var(--mc-bg);border:1px solid var(--mc-rule);border-radius:16px;overflow:hidden;font:14px/1.45 var(--font-ui,system-ui,sans-serif);box-shadow:0 24px 70px rgb(0 0 0/.2);position:relative}
.mission-console[data-mission-theme="paper"]{--mc-bg:#f2ede4;--mc-surface:#fffaf2;--mc-surface-2:#e8e0d4;--mc-ink:#211b15;--mc-muted:#6d6256;--mc-rule:#cfc3b3;--mc-accent:#b94f18;--mc-accent-ink:#fffaf2;--mc-accent-soft:#8d4a24;--mc-ok:#24735b;--mc-warn:#8a5c08;--mc-info:#32667c;--mc-critical:#b42318;color-scheme:light;box-shadow:0 24px 70px rgb(55 40 25/.12)}
.mission-console:before{content:"";position:absolute;inset:0;pointer-events:none;opacity:.22;background-image:linear-gradient(var(--mc-rule) 1px,transparent 1px),linear-gradient(90deg,var(--mc-rule) 1px,transparent 1px);background-size:32px 32px;mask-image:linear-gradient(to bottom,transparent,black 12rem,transparent 80%)}
.mission-console *{box-sizing:border-box}
.mission-console button,.mission-console input,.mission-console select{font:inherit}
.mission-command{position:relative;display:grid;grid-template-columns:minmax(15rem,1fr) auto auto;gap:1rem;align-items:center;padding:1.15rem 1.25rem;border-bottom:1px solid var(--mc-rule);background:color-mix(in srgb,var(--mc-surface) 94%,transparent)}
.mission-eyebrow,.mission-section-label,.mission-clock,.mission-shortcut,.mission-status,.mission-number,.mission-table td:not(:first-child),.mission-table th,.mission-meta,.mission-footnote{font-family:var(--font-mono,ui-monospace,monospace);font-variant-numeric:tabular-nums}
.mission-eyebrow,.mission-section-label{margin:0 0 .25rem;color:var(--mc-accent);font-size:.68rem;letter-spacing:.14em;text-transform:uppercase}
.mission-command h1{margin:0;font:650 clamp(1.65rem,3vw,2.35rem)/1 var(--font-display,Georgia,serif);letter-spacing:-.025em}
.mission-command h1 span{color:var(--mc-muted);font-weight:400}
.mission-command-state{display:flex;align-items:center;gap:.7rem;justify-content:flex-end}
.mission-live-dot{width:.6rem;height:.6rem;border-radius:50%;background:var(--mc-muted);box-shadow:0 0 0 3px color-mix(in srgb,var(--mc-muted) 16%,transparent)}
.mission-live-dot[data-live="true"]{background:var(--mc-ok);box-shadow:0 0 0 4px color-mix(in srgb,var(--mc-ok) 18%,transparent)}
.mission-status{font-size:.72rem;letter-spacing:.08em}
.mission-status strong{display:block;color:var(--mc-ink)}
.mission-status span{color:var(--mc-muted)}
.mission-clock{text-align:right;color:var(--mc-muted);font-size:.72rem;min-width:8rem}
.mission-clock strong{display:block;color:var(--mc-ink);font-size:.82rem}
.mission-actions{grid-column:1/-1;display:flex;gap:.5rem;align-items:center;flex-wrap:wrap;padding-top:.2rem}
.mission-actions button,.mission-actions a,.mission-filter-row button,.mission-alert button,.mission-tabs button,.mission-callsign{min-height:2.5rem;border:1px solid var(--mc-rule);border-radius:7px;background:var(--mc-surface-2);color:var(--mc-ink);padding:.45rem .75rem;text-decoration:none;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:.45rem}
.mission-actions button:hover,.mission-actions a:hover,.mission-filter-row button:hover,.mission-alert button:hover,.mission-tabs button:hover,.mission-callsign:hover{border-color:var(--mc-accent);color:var(--mc-ink)}
.mission-actions .mission-primary{background:var(--mc-accent);border-color:var(--mc-accent);color:var(--mc-accent-ink);font-weight:650}
.mission-actions .mission-primary:hover{color:var(--mc-accent-ink);filter:brightness(1.06)}
.mission-shortcut{font-size:.62rem;opacity:.7}
.mission-metrics{position:relative;display:grid;grid-template-columns:repeat(4,1fr);border-bottom:1px solid var(--mc-rule);background:var(--mc-surface)}
.mission-metric{padding:.9rem 1.1rem;border-right:1px solid var(--mc-rule)}
.mission-metric:last-child{border-right:0}
.mission-metric span{display:block;color:var(--mc-muted);font-size:.72rem;text-transform:uppercase;letter-spacing:.08em}
.mission-metric strong{display:block;margin-top:.15rem;font:650 1.3rem/1.2 var(--font-mono,ui-monospace,monospace);font-variant-numeric:tabular-nums}
.mission-metric small{color:var(--mc-muted)}
.mission-workspace{position:relative;display:grid;grid-template-columns:minmax(0,1.75fr) minmax(18rem,.75fr)}
.mission-primary-column{min-width:0;border-right:1px solid var(--mc-rule)}
.mission-panel{background:color-mix(in srgb,var(--mc-surface) 92%,transparent)}
.mission-panel-head{display:flex;align-items:flex-end;justify-content:space-between;gap:1rem;padding:.85rem 1rem;border-bottom:1px solid var(--mc-rule)}
.mission-panel-head h2,.mission-panel-head h3{margin:0;font-size:.95rem;letter-spacing:.01em}
.mission-panel-head p{margin:.15rem 0 0;color:var(--mc-muted);font-size:.75rem}
.mission-channel-switch{display:flex;gap:.25rem;flex-wrap:wrap}
.mission-channel-switch button{border:0;background:transparent;color:var(--mc-muted);padding:.25rem .45rem;border-radius:5px;cursor:pointer;font:inherit}
.mission-channel-switch button[aria-pressed="true"]{background:var(--mc-surface-2);color:var(--mc-ink)}
.mission-chart-wrap{padding:.75rem 1rem 1rem}
.mission-chart{display:block;width:100%;height:auto;aspect-ratio:16/6;color:var(--mc-accent);overflow:visible}
.mission-chart-grid{stroke:var(--mc-rule);stroke-width:1}
.mission-chart-area{fill:color-mix(in srgb,var(--mc-accent) 12%,transparent)}
.mission-chart-line{fill:none;stroke:var(--mc-accent);stroke-width:2.2;stroke-linejoin:round;stroke-linecap:round}
.mission-chart-compare{fill:none;stroke:var(--mc-info);stroke-width:1.3;stroke-dasharray:5 5;opacity:.75}
.mission-chart-marker{fill:var(--mc-bg);stroke:var(--mc-accent);stroke-width:3}
.mission-axis{fill:var(--mc-muted);font:10px var(--font-mono,ui-monospace,monospace)}
.mission-chart-legend{display:flex;justify-content:space-between;gap:1rem;color:var(--mc-muted);font-family:var(--font-mono,ui-monospace,monospace);font-size:.7rem}
.mission-chart-legend strong{color:var(--mc-ink)}
.mission-fleet{border-top:1px solid var(--mc-rule)}
.mission-filter-row{display:grid;grid-template-columns:minmax(12rem,1fr) auto auto;gap:.55rem;padding:.75rem 1rem;border-bottom:1px solid var(--mc-rule);align-items:end}
.mission-field{display:grid;gap:.25rem}
.mission-field label,.mission-field>span{color:var(--mc-muted);font-size:.7rem;text-transform:uppercase;letter-spacing:.07em}
.mission-field input,.mission-field select{min-height:2.5rem;width:100%;border:1px solid var(--mc-rule);border-radius:7px;background:var(--mc-bg);color:var(--mc-ink);padding:.45rem .65rem}
.mission-table-wrap{overflow:auto;max-height:var(--mc-log-height)}
.mission-table{width:100%;border-collapse:collapse;min-width:42rem}
.mission-table th{position:sticky;top:0;z-index:2;background:var(--mc-surface-2);color:var(--mc-muted);font-size:.65rem;text-transform:uppercase;letter-spacing:.07em;text-align:right;border-bottom:1px solid var(--mc-rule);padding:.5rem .7rem}
.mission-table th:first-child,.mission-table td:first-child{text-align:left;position:sticky;left:0}
.mission-table th:first-child{z-index:3}
.mission-table td:first-child{background:var(--mc-surface)}
.mission-table th button{appearance:none;border:0;background:transparent;color:inherit;font:inherit;text-transform:inherit;letter-spacing:inherit;padding:0;cursor:pointer}
.mission-table th button:hover{color:var(--mc-ink)}
.mission-table td{padding:.42rem .7rem;border-bottom:1px solid color-mix(in srgb,var(--mc-rule) 72%,transparent);text-align:right;white-space:nowrap}
.mission-table tr:hover td{background:color-mix(in srgb,var(--mc-accent) 5%,var(--mc-surface))}
.mission-table tr:hover td:first-child{background:color-mix(in srgb,var(--mc-accent) 7%,var(--mc-surface))}
.mission-callsign{min-height:2rem;padding:.2rem .4rem;border:0;background:transparent;color:var(--mc-ink);font-family:var(--font-mono,ui-monospace,monospace);font-weight:650}
.mission-callsign small{display:block;color:var(--mc-muted);font-size:.62rem;font-weight:400}
.mission-badge{display:inline-flex;align-items:center;gap:.35rem;font-size:.65rem;letter-spacing:.06em;text-transform:uppercase}
.mission-badge:before{content:"";width:.45rem;height:.45rem;border-radius:50%;background:currentColor}
.mission-badge[data-status="nominal"]{color:var(--mc-ok)}
.mission-badge[data-status="watch"]{color:var(--mc-warn)}
.mission-badge[data-status="critical"]{color:var(--mc-critical)}
.mission-table-empty{padding:2rem;text-align:center;color:var(--mc-muted)}
.mission-rail{min-width:0;background:var(--mc-surface)}
.mission-detail,.mission-detail-empty,.mission-alerts{border-bottom:1px solid var(--mc-rule)}
.mission-detail-empty{padding:1.1rem;color:var(--mc-muted);min-height:15rem;display:grid;align-content:center}
.mission-detail-empty strong{color:var(--mc-ink)}
.mission-detail-body{padding:1rem}
.mission-detail-title{display:flex;justify-content:space-between;gap:1rem;align-items:start}
.mission-detail-title h2{margin:0;font:650 1.55rem/1 var(--font-display,Georgia,serif)}
.mission-close{border:1px solid var(--mc-rule);background:var(--mc-surface-2);color:var(--mc-ink);width:2.5rem;height:2.5rem;border-radius:7px;cursor:pointer}
.mission-detail dl{display:grid;grid-template-columns:1fr auto;gap:.45rem 1rem;margin:1rem 0}
.mission-detail dt{color:var(--mc-muted)}
.mission-detail dd{margin:0;font-family:var(--font-mono,ui-monospace,monospace);font-variant-numeric:tabular-nums}
.mission-mini-chart{display:block;width:100%;height:4.5rem;color:var(--mc-info)}
.mission-mini-chart polyline{fill:none;stroke:currentColor;stroke-width:2}
.mission-tabs{display:flex;gap:.3rem;margin-top:.8rem}
.mission-tabs button{min-height:2rem;padding:.25rem .55rem}
.mission-tabs button[aria-pressed="true"]{border-color:var(--mc-accent);color:var(--mc-accent)}
.mission-tab-copy{min-height:3.5rem;color:var(--mc-muted);font-size:.8rem}
.mission-alert-tools{display:flex;gap:.5rem;padding:.7rem 1rem;border-bottom:1px solid var(--mc-rule)}
.mission-alert-tools select{min-height:2.25rem;border:1px solid var(--mc-rule);border-radius:6px;background:var(--mc-bg);color:var(--mc-ink);padding:.3rem .5rem}
.mission-alert-list{list-style:none;margin:0;padding:0;max-height:var(--mc-log-height);overflow:auto;overscroll-behavior:contain}
.mission-alert{padding:.72rem 1rem;border-bottom:1px solid color-mix(in srgb,var(--mc-rule) 72%,transparent)}
.mission-alert:last-child{border-bottom:0}
.mission-alert[data-acknowledged="true"]{opacity:.58}
.mission-alert-top{display:flex;justify-content:space-between;gap:.5rem;align-items:start}
.mission-alert strong{font-size:.78rem}
.mission-alert p{margin:.25rem 0;color:var(--mc-muted);font-size:.74rem}
.mission-alert-actions{display:flex;gap:.4rem;align-items:center}
.mission-alert button{min-height:1.9rem;border:0;background:transparent;padding:.15rem .25rem;color:var(--mc-muted);font-size:.7rem}
.mission-alert button:hover{color:var(--mc-accent)}
.mission-alert button[aria-disabled="true"]{cursor:default;color:var(--mc-muted)}
.mission-meta{color:var(--mc-muted);font-size:.65rem}
.mission-footnote{position:relative;display:flex;justify-content:space-between;gap:1rem;flex-wrap:wrap;padding:.75rem 1rem;border-top:1px solid var(--mc-rule);color:var(--mc-muted);font-size:.65rem;background:var(--mc-surface)}
.mission-announcement{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
@media(max-width:860px){.mission-command{grid-template-columns:1fr auto}.mission-clock{grid-column:1/-1;text-align:left}.mission-metrics{grid-template-columns:repeat(2,1fr)}.mission-metric:nth-child(2){border-right:0}.mission-metric:nth-child(-n+2){border-bottom:1px solid var(--mc-rule)}.mission-workspace{grid-template-columns:1fr}.mission-primary-column{border-right:0}.mission-rail{display:grid;grid-template-columns:1fr 1fr;border-top:1px solid var(--mc-rule)}.mission-detail,.mission-detail-empty{border-right:1px solid var(--mc-rule)}}
@media(max-width:640px){.mission-console{--mc-log-height:32rem}.mission-command{display:flex;align-items:flex-start;flex-wrap:wrap}.mission-command-state{margin-left:auto}.mission-clock{width:100%}.mission-actions{width:100%}.mission-actions button,.mission-actions a{min-height:2.75rem;flex:1}.mission-filter-row{grid-template-columns:1fr 1fr}.mission-filter-row .mission-field:first-child{grid-column:1/-1}.mission-rail{grid-template-columns:1fr}.mission-detail,.mission-detail-empty{border-right:0}.mission-chart{aspect-ratio:4/2.2}.mission-chart-legend{flex-wrap:wrap}.mission-footnote{display:block}.mission-footnote span{display:block;margin:.2rem 0}}
@media(prefers-reduced-motion:reduce){.mission-console *{scroll-behavior:auto!important}}
`;

  function round(value, digits = 0) {
    const power = 10 ** digits;
    return Math.round(value * power) / power;
  }

  function wave(index, tick, phase) {
    return Math.sin((tick + index * 3 + phase) / 8) + Math.cos((tick * 1.7 + index + phase) / 13);
  }

  function makeUnit(index, tick) {
    const anomaly = index % 23 === 0;
    const watch = !anomaly && index % 11 === 0;
    const power = round(82 + wave(index, tick, 2) * 5 - (watch ? 6 : 0), 1);
    const signal = round(91 + wave(index, tick, 9) * 4 - (anomaly ? 20 : watch ? 9 : 0), 1);
    const thermal = round(42 + wave(index, tick, 17) * 5 + (anomaly ? 15 : watch ? 8 : 0), 1);
    const latency = Math.max(12, Math.round(28 + wave(index, tick, 25) * 12 + (anomaly ? 55 : watch ? 24 : 0)));
    const status = signal < 76 || thermal > 58 || latency > 78
      ? "critical"
      : signal < 84 || thermal > 52 || latency > 58
        ? "watch"
        : "nominal";
    return {
      index,
      id: `SV-${String(index + 1).padStart(3, "0")}`,
      sector: SECTORS[index % SECTORS.length],
      status,
      power,
      signal,
      thermal,
      latency,
      packets: Math.max(2, Math.round(7 + signal / 13 + wave(index, tick, 31))),
    };
  }

  function sampleAt(tick) {
    return {
      tick,
      packets: Math.round(810 + Math.sin(tick / 4) * 42 + Math.cos(tick / 11) * 21),
      power: round(81 + Math.sin(tick / 9) * 4 + Math.cos(tick / 17) * 1.5, 1),
      signal: round(88 + Math.cos(tick / 7) * 3.5 + Math.sin(tick / 15), 1),
    };
  }

  function makeHistory() {
    return Array.from({ length: HISTORY_LENGTH }, (_, index) => sampleAt(index - HISTORY_LENGTH + 1));
  }

  function alertFor(unit, tick, serial) {
    const thermal = unit.thermal > 58;
    return {
      id: `ALT-${String(serial).padStart(4, "0")}`,
      unitId: unit.id,
      severity: unit.status === "critical" ? "critical" : "watch",
      title: thermal ? "Thermal envelope" : unit.signal < 80 ? "Signal degradation" : "Latency excursion",
      detail: thermal
        ? `${unit.thermal.toFixed(1)} °C reported in ${unit.sector}`
        : unit.signal < 80
          ? `${unit.signal.toFixed(1)}% link quality`
          : `${unit.latency} ms relay latency`,
      tick,
      acknowledged: false,
    };
  }

  function makeInitialState() {
    const units = Array.from({ length: UNIT_COUNT }, (_, index) => makeUnit(index, 0));
    const flagged = units.filter((unit) => unit.status !== "nominal").slice(0, 4);
    return {
      tick: 0,
      running: false,
      selectedId: "SV-024",
      units,
      series: makeHistory(),
      packets: sampleAt(0).packets,
      alerts: flagged.map((unit, index) => alertFor(unit, 0, index + 1)),
      alertSerial: flagged.length,
    };
  }

  function readStorage(key) {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  }

  function writeStorage(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch {
      // The sandboxed playground intentionally has no storage origin.
    }
  }

  function formatMet(tick) {
    const seconds = Math.floor(tick / 8);
    const hours = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const rest = String(seconds % 60).padStart(2, "0");
    return `${hours}:${minutes}:${rest}`;
  }

  function formatClock() {
    return new Date().toISOString().slice(11, 19);
  }

  function summarize(state) {
    const counts = { nominal: 0, watch: 0, critical: 0 };
    for (const unit of state.units) counts[unit.status] += 1;
    return {
      ...counts,
      openAlerts: state.alerts.filter((alert) => !alert.acknowledged).length,
    };
  }

  function advance(store) {
    store.set((state) => {
      if (!state.running) return state;
      const tick = state.tick + 1;
      const units = state.units.map((unit) => makeUnit(unit.index, tick));
      const sample = sampleAt(tick);
      let alerts = state.alerts;
      let alertSerial = state.alertSerial;
      if (tick % 40 === 0) {
        const candidates = units.filter((unit) => unit.status !== "nominal");
        const unit = candidates[(tick / 40) % candidates.length | 0];
        alertSerial += 1;
        alerts = [alertFor(unit, tick, alertSerial), ...alerts].slice(0, 16);
      }
      return {
        ...state,
        tick,
        units,
        packets: sample.packets,
        series: [...state.series, sample].slice(-HISTORY_LENGTH),
        alerts,
        alertSerial,
      };
    });
  }

  function setRunning(store, running) {
    store.set((state) => (state.running === running ? state : { ...state, running }));
  }

  function resetMission(store) {
    store.set(makeInitialState());
  }

  function acknowledge(store, alertId) {
    store.set((state) => ({
      ...state,
      alerts: state.alerts.map((alert) =>
        alert.id === alertId ? { ...alert, acknowledged: true } : alert,
      ),
    }));
  }

  function selectUnit(store, unitId) {
    store.set((state) => (state.selectedId === unitId ? state : { ...state, selectedId: unitId }));
  }



  const DataStream = create({
    onMount() {
      this._timer = setInterval(() => advance(this.props.store), 125);
    },
    onDestroy() {
      clearInterval(this._timer);
    },
    render() {
      return null;
    },
  });

  const CommandBar = create({
    initialState: { clock: "SYNC PENDING" },
    onMount() {
      this.observe(this.props.store);
      const sync = () => this.setState({ ...this.state, clock: formatClock() });
      sync();
      this._clock = setInterval(sync, 1000);
    },
    onDestroy() {
      clearInterval(this._clock);
    },
    render() {
      const state = this.props.store.get();
      return html`
        <header class="mission-command" data-mission-tick=${state.tick}>
          <div>
            <p class="mission-eyebrow">SvenJS / Flight director</p>
            <h1>Mission Control <span>/ NORD-1</span></h1>
          </div>
          <div class="mission-command-state">
            <span class="mission-live-dot" data-live=${state.running} aria-hidden="true"></span>
            <span class="mission-status">
              <strong>${state.running ? "LIVE STREAM" : "READY"}</strong>
              <span>${state.running ? "8 Hz synthetic feed" : "Telemetry paused"}</span>
            </span>
          </div>
          <div class="mission-clock">
            <strong>${this.state.clock} UTC</strong>
            <span>MET ${formatMet(state.tick)}</span>
          </div>
          <div class="mission-actions">
            <button
              type="button"
              class="mission-primary"
              aria-pressed=${state.running}
              onClick=${() => setRunning(this.props.store, !state.running)}
            >
              ${state.running ? "Pause stream" : "Start stream"}
              <span class="mission-shortcut">Alt+S</span>
            </button>
            <button type="button" onClick=${() => resetMission(this.props.store)}>Reset</button>
            <button type="button" onClick=${this.props.onTheme}>
              ${this.props.theme === "night" ? "Paper console" : "Night console"}
            </button>
            ${this.props.standalone
              ? html`<span class="mission-meta">ONE FILE / LOCAL</span>`
              : html`<a href="/play/?example=mission">Open & export</a>`}
          </div>
        </header>
      `;
    },
  });

  const MetricStrip = create({
    onMount() {
      this.observe(this.props.store);
    },
    render() {
      const state = this.props.store.get();
      const summary = summarize(state);
      return html`
        <section class="mission-metrics" aria-label="Fleet summary">
          <div class="mission-metric">
            <span>Fleet online</span>
            <strong>${state.units.length}</strong>
            <small>synthetic units</small>
          </div>
          <div class="mission-metric">
            <span>Nominal</span>
            <strong>${summary.nominal}</strong>
            <small>${summary.watch} watch / ${summary.critical} critical</small>
          </div>
          <div class="mission-metric">
            <span>Packets / second</span>
            <strong>${state.packets}</strong>
            <small>aggregate relay traffic</small>
          </div>
          <div class="mission-metric">
            <span>Open alerts</span>
            <strong>${summary.openAlerts}</strong>
            <small>${state.alerts.length} retained</small>
          </div>
        </section>
      `;
    },
  });

  function plot(values) {
    const min = Math.min(...values);
    const max = Math.max(...values);
    const span = max - min || 1;
    const points = values.map((value, index) => {
      const x = 42 + (index / Math.max(1, values.length - 1)) * 716;
      const y = 218 - ((value - min) / span) * 170;
      return [round(x, 1), round(y, 1)];
    });
    return {
      min,
      max,
      points: points.map((point) => point.join(",")).join(" "),
      area: `M ${points[0][0]} 230 L ${points.map((point) => point.join(" ")).join(" L ")} L ${points.at(-1)[0]} 230 Z`,
      last: points.at(-1),
    };
  }

  const TelemetryPlot = create({
    initialState: { metric: "packets" },
    onMount() {
      this.observe(this.props.store);
    },
    render() {
      const state = this.props.store.get();
      const channels = {
        packets: { label: "Packets / second", suffix: " pkt/s" },
        power: { label: "Fleet power", suffix: "%" },
        signal: { label: "Signal quality", suffix: "%" },
      };
      const metric = this.state.metric;
      const channel = channels[metric];
      const values = state.series.map((sample) => sample[metric]);
      const comparisonMetric = metric === "signal" ? "power" : "signal";
      const comparison = state.series.map((sample) => sample[comparisonMetric]);
      const primary = plot(values);
      const secondary = plot(comparison);
      const current = values.at(-1);
      return html`
        <section class="mission-panel mission-telemetry">
          <div class="mission-panel-head">
            <div>
              <p class="mission-section-label">Constellation telemetry</p>
              <h2>${channel.label}</h2>
            </div>
            <div class="mission-channel-switch" aria-label="Telemetry channel">
              ${Object.entries(channels).map(([key, item]) => html`
                <button
                  type="button"
                  aria-pressed=${metric === key}
                  onClick=${() => this.setState({ ...this.state, metric: key })}
                >${item.label.replace("Fleet ", "")}</button>
              `)}
            </div>
          </div>
          <div class="mission-chart-wrap">
            <svg
              class="mission-chart"
              viewBox="0 0 800 250"
              role="img"
              aria-label="Fleet telemetry"
            >
              <title>${channel.label}: ${current}${channel.suffix}</title>
              <desc>Live synthetic telemetry. Minimum ${round(primary.min, 1)}, maximum ${round(primary.max, 1)}.</desc>
              ${[48, 90, 132, 174, 218].map((y) => html`
                <line class="mission-chart-grid" x1="42" x2="758" y1=${y} y2=${y} vector-effect="non-scaling-stroke"></line>
              `)}
              ${[42, 221, 400, 579, 758].map((x) => html`
                <line class="mission-chart-grid" x1=${x} x2=${x} y1="48" y2="218" vector-effect="non-scaling-stroke"></line>
              `)}
              <path class="mission-chart-area" d=${primary.area}></path>
              <polyline class="mission-chart-compare" points=${secondary.points} vector-effect="non-scaling-stroke"></polyline>
              <polyline class="mission-chart-line" points=${primary.points} vector-effect="non-scaling-stroke"></polyline>
              <circle class="mission-chart-marker" cx=${primary.last[0]} cy=${primary.last[1]} r="4" vector-effect="non-scaling-stroke"></circle>
              <text class="mission-axis" x="42" y="242">−5.2 SEC</text>
              <text class="mission-axis" x="712" y="242">NOW</text>
            </svg>
            <div class="mission-chart-legend">
              <span><strong>${current}${channel.suffix}</strong> current</span>
              <span>${round(primary.min, 1)} min / ${round(primary.max, 1)} max</span>
              <span>comparison: ${channels[comparisonMetric].label}</span>
            </div>
          </div>
        </section>
      `;
    },
  });

  const FleetLedger = create({
    initialState: {
      query: "",
      status: "all",
      sort: "status",
      direction: "ascending",
    },
    captureFilter(element) {
      this._filter = element;
    },
    readPreferences() {
      const raw = readStorage(STORAGE_FLEET);
      if (!raw) return;
      try {
        const prefs = JSON.parse(raw);
        const next = {
          ...this.state,
          status: ["all", "nominal", "watch", "critical"].includes(prefs.status) ? prefs.status : "all",
          sort: ["id", "status", "power", "signal", "thermal", "latency"].includes(prefs.sort) ? prefs.sort : "status",
          direction: prefs.direction === "descending" ? "descending" : "ascending",
        };
        this.setState(next);
      } catch {
        // Ignore invalid local preferences.
      }
    },
    persist(next) {
      writeStorage(STORAGE_FLEET, JSON.stringify({
        status: next.status,
        sort: next.sort,
        direction: next.direction,
      }));
    },
    update(patch) {
      const next = { ...this.state, ...patch };
      this.persist(next);
      this.setState(next);
    },
    sortBy(key) {
      const direction = this.state.sort === key && this.state.direction === "ascending"
        ? "descending"
        : "ascending";
      this.update({ sort: key, direction });
    },
    onMount() {
      this.observe(this.props.store);
      this._focus = () => this._filter?.focus();
      window.addEventListener("mission:focus-filter", this._focus);
      this.readPreferences();
    },
    onDestroy() {
      window.removeEventListener("mission:focus-filter", this._focus);
    },
    render() {
      const state = this.props.store.get();
      const needle = this.state.query.trim().toLowerCase();
      const visible = state.units
        .filter((unit) => this.state.status === "all" || unit.status === this.state.status)
        .filter((unit) => !needle || unit.id.toLowerCase().includes(needle) || unit.sector.toLowerCase().includes(needle));
      const direction = this.state.direction === "ascending" ? 1 : -1;
      const sorted = [...visible].sort((left, right) => {
        const a = this.state.sort === "status" ? STATUS_ORDER[left.status] : left[this.state.sort];
        const b = this.state.sort === "status" ? STATUS_ORDER[right.status] : right[this.state.sort];
        return (typeof a === "string" ? a.localeCompare(b) : a - b) * direction;
      });
      const ariaSort = (key) => this.state.sort === key ? this.state.direction : "none";
      return html`
        <section class="mission-panel mission-fleet">
          <div class="mission-panel-head">
            <div>
              <p class="mission-section-label">Fleet ledger</p>
              <h2>Orbital assets</h2>
            </div>
            <p>${sorted.length} / ${state.units.length} visible</p>
          </div>
          <div class="mission-filter-row">
            <div class="mission-field">
              <label for="mission-filter">Filter callsign or sector</label>
              <input
                id="mission-filter"
                ref=${this.captureFilter}
                value=${this.state.query}
                placeholder="SV-024 or Aurora"
                onInput=${(event) => this.setState({ ...this.state, query: event.target.value })}
              />
            </div>
            <div class="mission-field">
              <label for="mission-status-filter">Status</label>
              <select
                id="mission-status-filter"
                value=${this.state.status}
                onChange=${(event) => this.update({ status: event.target.value })}
              >
                <option value="all">All states</option>
                <option value="critical">Critical</option>
                <option value="watch">Watch</option>
                <option value="nominal">Nominal</option>
              </select>
            </div>
            <button type="button" onClick=${() => this.setState({ ...this.state, query: "" })}>Clear filter</button>
          </div>
          <div class="mission-table-wrap">
            <table class="mission-table">
              <thead>
                <tr>
                  <th scope="col" aria-sort=${ariaSort("id")}><button type="button" onClick=${() => this.sortBy("id")}>Callsign</button></th>
                  <th scope="col" aria-sort=${ariaSort("status")}><button type="button" onClick=${() => this.sortBy("status")}>State</button></th>
                  <th scope="col" aria-sort=${ariaSort("power")}><button type="button" onClick=${() => this.sortBy("power")}>Power</button></th>
                  <th scope="col" aria-sort=${ariaSort("signal")}><button type="button" onClick=${() => this.sortBy("signal")}>Signal</button></th>
                  <th scope="col" aria-sort=${ariaSort("thermal")}><button type="button" onClick=${() => this.sortBy("thermal")}>Thermal</button></th>
                  <th scope="col" aria-sort=${ariaSort("latency")}><button type="button" onClick=${() => this.sortBy("latency")}>Latency</button></th>
                </tr>
              </thead>
              <tbody>
                ${sorted.map((unit) => html`
                  <tr key=${unit.id} data-unit-id=${unit.id} data-reading=${unit.signal}>
                    <td>
                      <button
                        type="button"
                        class="mission-callsign"
                        aria-label=${`Inspect ${unit.id}`}
                        onClick=${(event) => this.props.onSelect(unit.id, event.currentTarget)}
                      >
                        ${unit.id}<small>${unit.sector}</small>
                      </button>
                    </td>
                    <td><span class="mission-badge" data-status=${unit.status}>${unit.status}</span></td>
                    <td>${unit.power.toFixed(1)}%</td>
                    <td>${unit.signal.toFixed(1)}%</td>
                    <td>${unit.thermal.toFixed(1)} °C</td>
                    <td>${unit.latency} ms</td>
                  </tr>
                `)}
              </tbody>
            </table>
            ${sorted.length === 0 ? html`<div class="mission-table-empty">No assets match this filter.</div>` : null}
          </div>
        </section>
      `;
    },
  });

  function miniPoints(values) {
    const min = Math.min(...values);
    const max = Math.max(...values);
    const span = max - min || 1;
    return values.map((value, index) => {
      const x = 4 + (index / Math.max(1, values.length - 1)) * 252;
      const y = 54 - ((value - min) / span) * 44;
      return `${round(x, 1)},${round(y, 1)}`;
    }).join(" ");
  }

  function signalHistory(unitIndex, tick) {
    return Array.from(
      { length: 24 },
      (_, index) => makeUnit(unitIndex, tick + index - 23).signal,
    );
  }

  const DetailPanel = create({
    initialState(props) {
      const state = props.store.get();
      const unit = state.units.find((item) => item.id === props.unitId);
      return {
        tab: "telemetry",
        sampledTick: state.tick,
        history: signalHistory(unit.index, state.tick),
      };
    },
    onKeyDown(event) {
      if (event.key === "Escape") this.props.onClose();
    },
    onMount() {
      this._off = this.props.store.subscribe((state) => {
        const unit = state.units.find((item) => item.id === this.props.unitId);
        if (!unit || state.tick === this.state.sampledTick) return;
        const elapsed = state.tick - this.state.sampledTick;
        const history = elapsed < 1 || elapsed >= 24
          ? signalHistory(unit.index, state.tick)
          : [
              ...this.state.history,
              ...Array.from(
                { length: elapsed },
                (_, index) => makeUnit(unit.index, this.state.sampledTick + index + 1).signal,
              ),
            ].slice(-24);
        this.setState({
          ...this.state,
          sampledTick: state.tick,
          history,
        });
      });
      window.addEventListener("keydown", this.onKeyDown);
    },
    onDestroy() {
      this._off?.();
      window.removeEventListener("keydown", this.onKeyDown);
    },
    render() {
      const unit = this.props.store.get().units.find((item) => item.id === this.props.unitId);
      if (!unit) return null;
      return html`
        <section class="mission-detail" aria-labelledby="mission-detail-title">
          <div class="mission-detail-body">
            <div class="mission-detail-title">
              <div>
                <p class="mission-section-label">Selected asset / subscribed</p>
                <h2 id="mission-detail-title">${unit.id}</h2>
                <span class="mission-badge" data-status=${unit.status}>${unit.status}</span>
              </div>
              <button type="button" class="mission-close" aria-label="Close details" onClick=${this.props.onClose}>×</button>
            </div>
            <dl>
              <dt>Sector</dt><dd>${unit.sector}</dd>
              <dt>Power</dt><dd>${unit.power.toFixed(1)}%</dd>
              <dt>Signal</dt><dd>${unit.signal.toFixed(1)}%</dd>
              <dt>Thermal</dt><dd>${unit.thermal.toFixed(1)} °C</dd>
              <dt>Latency</dt><dd>${unit.latency} ms</dd>
            </dl>
            <svg class="mission-mini-chart" viewBox="0 0 260 64" role="img" aria-label=${`${unit.id} signal history`}>
              <polyline points=${miniPoints(this.state.history)} vector-effect="non-scaling-stroke"></polyline>
            </svg>
            <div class="mission-tabs" role="group" aria-label="Asset detail view">
              <button type="button" aria-pressed=${this.state.tab === "telemetry"} onClick=${() => this.setState({ ...this.state, tab: "telemetry" })}>Telemetry</button>
              <button type="button" aria-pressed=${this.state.tab === "orbit"} onClick=${() => this.setState({ ...this.state, tab: "orbit" })}>Orbit</button>
            </div>
            <p class="mission-tab-copy">
              ${this.state.tab === "telemetry"
                ? `Live relay subscription active. ${unit.packets} packets received in the latest frame.`
                : `${unit.id} is holding its synthetic ${unit.sector} corridor. No external ephemeris is used.`}
            </p>
          </div>
        </section>
      `;
    },
  });

  const AlertCenter = create({
    initialState: { severity: "all", expanded: false },
    onMount() {
      this.observe(this.props.store);
    },
    render() {
      const state = this.props.store.get();
      const filtered = state.alerts.filter((alert) =>
        this.state.severity === "all" || alert.severity === this.state.severity,
      );
      const shown = this.state.expanded ? filtered : filtered.slice(0, 6);
      return html`
        <section class="mission-alerts" aria-labelledby="mission-alert-title">
          <div class="mission-panel-head">
            <div>
              <p class="mission-section-label">Alert log</p>
              <h2 id="mission-alert-title">Priority events</h2>
            </div>
            <p>${filtered.filter((alert) => !alert.acknowledged).length} open</p>
          </div>
          <div class="mission-alert-tools">
            <label class="mission-field">
              <span>Severity</span>
              <select value=${this.state.severity} onChange=${(event) => this.setState({ ...this.state, severity: event.target.value })}>
                <option value="all">All</option>
                <option value="critical">Critical</option>
                <option value="watch">Watch</option>
              </select>
            </label>
          </div>
          <ul class="mission-alert-list">
            ${shown.map((alert) => html`
              <li key=${alert.id} class="mission-alert" data-acknowledged=${alert.acknowledged}>
                <div class="mission-alert-top">
                  <span class="mission-badge" data-status=${alert.severity}>${alert.severity}</span>
                  <span class="mission-meta">MET ${formatMet(alert.tick)}</span>
                </div>
                <strong>${alert.title}</strong>
                <p>${alert.detail}</p>
                <div class="mission-alert-actions">
                  <button type="button" onClick=${(event) => this.props.onSelect(alert.unitId, event.currentTarget)}>${alert.unitId}</button>
                  <button
                    type="button"
                    aria-disabled=${alert.acknowledged}
                    onClick=${() => {
                      if (!alert.acknowledged) acknowledge(this.props.store, alert.id);
                    }}
                  >${alert.acknowledged ? "Acknowledged" : "Acknowledge"}</button>
                </div>
              </li>
            `)}
          </ul>
          ${filtered.length > 6
            ? html`<div class="mission-alert-tools"><button type="button" onClick=${() => this.setState({ ...this.state, expanded: !this.state.expanded })}>${this.state.expanded ? "Show latest" : "Show all alerts"}</button></div>`
            : null}
        </section>
      `;
    },
  });

  const MissionControl = create({
    initialState: {
      running: false,
      selectedId: "SV-024",
      theme: "night",
      announcement: "Mission Control ready. Telemetry is paused.",
    },
    onBeforeMount() {
      this._store = createStore({ state: makeInitialState() });
    },
    toggleTheme() {
      const theme = this.state.theme === "night" ? "paper" : "night";
      writeStorage(STORAGE_THEME, theme);
      this.setState({ ...this.state, theme, announcement: `${theme === "night" ? "Night" : "Paper"} console active.` });
    },
    select(unitId, trigger) {
      this._returnFocus = trigger;
      selectUnit(this._store, unitId);
    },
    closeDetails() {
      const selectedId = this._store.get().selectedId;
      const returnFocus = this._returnFocus;
      selectUnit(this._store, null);
      queueMicrotask(() => {
        const callsign = selectedId
          ? this._root?.querySelector(`[data-unit-id="${selectedId}"] .mission-callsign`)
          : null;
        const target = returnFocus?.isConnected
          ? returnFocus
          : callsign || this._root?.querySelector("#mission-filter");
        target?.focus();
        this._returnFocus = null;
      });
    },
    captureRoot(element) {
      this._root = element;
    },
    onShortcut(event) {
      const target = event.target;
      if (target?.closest?.("input, select, textarea")) return;
      const key = String(event.key).toLowerCase();
      if (event.altKey && (event.code === "KeyS" || key === "s")) {
        event.preventDefault();
        setRunning(this._store, !this._store.get().running);
      }
      if (event.altKey && (event.code === "KeyK" || key === "k")) {
        event.preventDefault();
        window.dispatchEvent(new CustomEvent("mission:focus-filter"));
      }
    },
    onMount() {
      const storedTheme = readStorage(STORAGE_THEME);
      if (storedTheme === "paper" || storedTheme === "night") {
        this.setState({ ...this.state, theme: storedTheme });
      }
      this._off = this._store.subscribe((state) => {
        const runningChanged = state.running !== this.state.running;
        const selectionChanged = state.selectedId !== this.state.selectedId;
        if (!runningChanged && !selectionChanged) return;
        const summary = summarize(state);
        const announcement = runningChanged
          ? state.running
            ? `Telemetry started. ${summary.critical} critical units.`
            : "Telemetry paused."
          : state.selectedId
            ? `Details opened for ${state.selectedId}.`
            : "Asset details closed.";
        this.setState({
          ...this.state,
          running: state.running,
          selectedId: state.selectedId,
          announcement,
        });
      });
      window.addEventListener("keydown", this.onShortcut);
    },
    onDestroy() {
      this._off?.();
      window.removeEventListener("keydown", this.onShortcut);
      setRunning(this._store, false);
    },
    render() {
      const store = this._store;
      return [
        html`<style dangerouslySetInnerHTML=${{ __html: MISSION_CSS }}></style>`,
        html`
          <section
            ref=${this.captureRoot}
            class="mission-console"
            data-mission-control
            data-mission-theme=${this.state.theme}
            data-running=${this.state.running}
            aria-label="SvenJS Mission Control"
          >
            <${CommandBar}
              store=${store}
              standalone=${this.props.standalone}
              theme=${this.state.theme}
              onTheme=${this.toggleTheme}
            />
            <${MetricStrip} store=${store} />
            ${this.state.running ? html`<${DataStream} store=${store} />` : null}
            <div class="mission-workspace">
              <div class="mission-primary-column">
                <${TelemetryPlot} store=${store} />
                <${FleetLedger} store=${store} onSelect=${this.select} />
              </div>
              <aside class="mission-rail" aria-label="Mission details and alerts">
                ${this.state.selectedId
                  ? html`<${DetailPanel} key=${this.state.selectedId} store=${store} unitId=${this.state.selectedId} onClose=${this.closeDetails} />`
                  : html`
                    <section class="mission-detail-empty">
                      <p class="mission-section-label">Selected asset</p>
                      <strong>No asset selected</strong>
                      <span>Choose a callsign in the fleet ledger. Alt+K focuses the filter.</span>
                    </section>
                  `}
                <${AlertCenter} store=${store} onSelect=${this.select} />
              </aside>
            </div>
            <footer class="mission-footnote">
              <span>100 deterministic units · synthetic telemetry · no backend</span>
              <span>Alt+S stream · Alt+K fleet filter · Esc close detail</span>
            </footer>
            <p class="mission-announcement" aria-live="polite">${this.state.announcement}</p>
          </section>
        `,
      ];
    },
  });

  return MissionControl;
}
