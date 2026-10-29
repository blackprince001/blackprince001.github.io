// Figures for the polling-backoff post. Plain DOM + SVG, mounted by thin React islands
// (BackoffFigures.tsx). Every colour comes from CSS custom properties in backoff-figures.css,
// so the charts follow the site's light/dark theme without re-rendering.

/* ---------- helpers ---------- */
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
function mulberry32(a) { return function () { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
function gauss(rng) { let u = 0; while (u === 0) u = rng(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * rng()); }
function fmtT(s) {
  if (!isFinite(s)) return "—";
  if (s < 60) return (s < 10 ? s.toFixed(1) : Math.round(s)) + "s";
  const m = Math.floor(s / 60), r = Math.round(s % 60);
  return r === 60 ? (m + 1) + ":00" : m + ":" + String(r).padStart(2, "0");
}
const fmtAxis = (s) => (s < 60 ? s + "s" : s % 60 === 0 ? s / 60 + "m" : fmtT(s));
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");
function quantile(sorted, q) { if (!sorted.length) return NaN; return sorted[Math.min(sorted.length - 1, Math.max(0, Math.round(q * (sorted.length - 1))))]; }
function niceStep(max, count) { const raw = max / count, p = Math.pow(10, Math.floor(Math.log10(raw))), m = raw / p; return (m <= 1 ? 1 : m <= 2 ? 2 : m <= 2.5 ? 2.5 : m <= 5 ? 5 : 10) * p; }
function timeTicks(H, count) { const opts = [1, 2, 5, 10, 15, 30, 60, 120, 300, 600, 900, 1800]; const step = opts.find((o) => H / o <= count) || 3600; const out = []; for (let t = 0; t <= H + 1e-9; t += step) out.push(t); return out; }
const firstAtOrAfter = (arr, t) => { let lo = 0, hi = arr.length; while (lo < hi) { const m = (lo + hi) >> 1; if (arr[m] < t) lo = m + 1; else hi = m; } return lo; };
const swatch = (color) => `<span class="bk-sw" style="background:var(${color})"></span>`;

/* ---------- schedules, as in the app's tracker.ts ---------- */
const SOFT = 120, HARD = 900;
const SCHEDULE = [[30, 1], [120, 2], [300, 5], [900, 15], [3600, 30]];
const pollDelay = (age) => { for (const [upTo, every] of SCHEDULE) if (age < upTo) return every; return 120; };

const VERSIONS = {
  v0: { name: "Before", color: "--c-orange", wait: (t, a, dl) => (dl ? 30 : ([2, 3, 5, 8, 13][a] ?? 15)) },
  v1: { name: "76cd188", color: "--c-magenta", wait: (t, a, dl) => (dl ? 15 : ([1.5, 2, 3, 3, 4][a] ?? 5)) },
  v2: { name: "a74b69e", color: "--c-red", wait: (t, a, dl) => (dl ? 5 : ([1, 1][a] ?? 2)) },
  v3: { name: "Now", color: "--c-blue", wait: (t) => pollDelay(t) },
};
const VKEYS = ["v0", "v1", "v2", "v3"];
const CLASSIC = {
  fixed: { name: "Fixed 5s", color: "--c-violet", wait: () => 5 },
  linear: { name: "Linear +1s", color: "--c-aqua", wait: (t, a) => Math.min(30, a) },
  exp: { name: "Exponential ×2", color: "--c-yellow", wait: (t, a) => Math.min(60, 2 ** (a - 1)) },
  v0: { ...VERSIONS.v0, name: "Our old ramp" },
  v3: { ...VERSIONS.v3, name: "Our new schedule" },
};

/** Request times for one payment: ask at 0, then wait by attempt/age, like tracker.ts. */
function checkTimes(v, H, rng, jitter) {
  const out = [0];
  let t = 0, attempt = 1, dl = false;
  for (;;) {
    if (!dl && t > SOFT) dl = true;
    if (t > HARD) break;
    let w = v.wait(t, attempt, dl);
    if (jitter) w *= 0.8 + 0.4 * rng();
    t += w; attempt++;
    if (t > H) break;
    out.push(t);
  }
  return out;
}

/* ---------- modelled settle times (not production data) ---------- */
const WORKLOADS = {
  typical: { label: "Typical day", parts: [[0.55, 2.5, 0.6], [0.35, 20, 0.5], [0.08, 90, 0.7], [0.02, null]] },
  momo: { label: "Mostly MoMo prompts", parts: [[0.25, 2.5, 0.6], [0.6, 22, 0.5], [0.12, 100, 0.7], [0.03, null]] },
  slow: { label: "Slow network day", parts: [[0.45, 6, 0.6], [0.35, 35, 0.5], [0.16, 180, 0.8], [0.04, null]] },
};
function sampleSettle(w, rng) {
  let u = rng();
  for (const [p, med, sd] of w.parts) { if (u < p) return med === null ? 900 + rng() * 2700 : Math.exp(Math.log(med) + sd * gauss(rng)); u -= p; }
  return Infinity;
}
const lognormPdf = (t, med, sd) => { if (t <= 0) return 0; const z = (Math.log(t) - Math.log(med)) / sd; return Math.exp(-0.5 * z * z) / (t * sd * Math.sqrt(2 * Math.PI)); };

function buildPopulation(n, seed, push, workload = "typical") {
  const rng = mulberry32(seed), w = WORKLOADS[workload], out = [];
  for (let i = 0; i < n; i++) {
    const settle = sampleSettle(w, rng);
    const pushAt = push && rng() < 0.6 ? settle + 1 + 3 * rng() : Infinity;
    const checks = {};
    for (const k of VKEYS) checks[k] = checkTimes(VERSIONS[k], HARD + 1, rng, true);
    out.push({ settle, pushAt, checks });
  }
  return out;
}
/** When the screen flips for this payment under version k, and how many requests it took. */
function outcome(p, k) {
  const c = p.checks[k], i = firstAtOrAfter(c, p.settle);
  const byPoll = i < c.length ? c[i] : Infinity;
  const det = Math.min(byPoll, p.pushAt);
  return { det, asks: det === Infinity ? c.length : firstAtOrAfter(c, det) + 1 };
}

/* ---------- stacked chart: shared time axis, panels of ticks or lines ---------- */
function stackChart(el, cfg) {
  const state = { cfg, hoverT: null };
  function render() {
    const c = state.cfg;
    if (!c.panels.length) return;
    const W = Math.max(300, el.clientWidth - 8), narrow = W < 560;
    const ml = narrow ? 40 : c.labelW || 52, mr = 14;
    const x = (t) => ml + (t / c.H) * (W - ml - mr);
    let y = 0, s = "";
    for (const p of c.panels) {
      if (p.title) { s += `<text x="${ml}" y="${y + 15}" font-size="13.5" style="fill:var(--fg)">${esc(p.title)}</text>`; y += 24; }
      const top = y;
      if (p.kind === "ticks") {
        const rowH = 18;
        p.rows.forEach((r, i) => {
          const ry = top + i * rowH;
          if (!narrow) s += `<text x="${ml - 8}" y="${ry + 13}" font-size="11.5" text-anchor="end" style="fill:var(--muted)">${esc(r.label)}</text>`;
          s += `<line x1="${ml}" x2="${W - mr}" y1="${ry + 9}" y2="${ry + 9}" style="stroke:var(--grid)" />`;
          let d = "";
          for (const t of r.times) if (t <= c.H) d += `M${x(t).toFixed(1)} ${ry + 3}v12`;
          s += `<path d="${d}" style="stroke:var(${r.color});stroke-width:1.5" />`;
        });
        y = top + p.rows.length * rowH + 6;
      } else {
        const h = p.h || 120, yMax = p.yMax, yy = (v) => top + h - (Math.min(v, yMax) / yMax) * h;
        const step = niceStep(yMax, 3);
        for (let v = 0; v <= yMax + 1e-9; v += step) {
          s += `<line x1="${ml}" x2="${W - mr}" y1="${yy(v)}" y2="${yy(v)}" style="stroke:var(--grid)" />`;
          s += `<text x="${ml - 8}" y="${yy(v) + 4}" font-size="11.5" text-anchor="end" style="fill:var(--muted)">${p.yFmt ? p.yFmt(v) : v}</text>`;
        }
        if (p.band) for (const [a, b] of p.band) s += `<rect x="${x(a)}" y="${top}" width="${Math.max(0, x(Math.min(b, c.H)) - x(a))}" height="${h}" style="fill:var(--shade)" />`;
        for (const sr of p.series) {
          if (!sr.pts.length) continue;
          let d = "";
          sr.pts.forEach(([t, v], i) => {
            if (t > c.H) return;
            const px = x(t).toFixed(1), py = yy(v).toFixed(1);
            if (i === 0) d += `M${px} ${py}`;
            else if (sr.step) d += `H${px}V${py}`;
            else d += `L${px} ${py}`;
          });
          if (sr.step) d += `H${x(c.H).toFixed(1)}`;
          if (sr.fill) s += `<path d="${d}L${x(Math.min(c.H, sr.pts[sr.pts.length - 1][0])).toFixed(1)} ${yy(0)}L${x(sr.pts[0][0]).toFixed(1)} ${yy(0)}Z" style="fill:var(${sr.color});opacity:0.18" />`;
          s += `<path d="${d}" style="fill:none;stroke:var(${sr.color});stroke-width:2;stroke-linejoin:round" />`;
        }
        y = top + h + 10;
      }
    }
    for (const t of timeTicks(c.H, narrow ? 5 : 9)) s += `<text x="${x(t)}" y="${y + 12}" font-size="11.5" text-anchor="middle" style="fill:var(--muted)">${fmtAxis(t)}</text>`;
    const H = y + 20;
    s += `<line data-x x1="0" x2="0" y1="0" y2="${y}" style="stroke:var(--fg);stroke-width:1;opacity:0" />`;
    s += `<rect data-hit x="${ml}" y="0" width="${W - ml - mr}" height="${H}" style="fill:transparent;cursor:crosshair" />`;
    el.innerHTML = `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${esc(c.label || "")}">${s}</svg>`;
    const line = $("[data-x]", el), hit = $("[data-hit]", el), svg = $("svg", el);
    const toT = (ev) => { const r = svg.getBoundingClientRect(); const px = ((ev.clientX - r.left) / r.width) * W; return Math.max(0, Math.min(c.H, ((px - ml) / (W - ml - mr)) * c.H)); };
    const show = (t) => { state.hoverT = t; line.setAttribute("x1", x(t)); line.setAttribute("x2", x(t)); line.style.opacity = 0.5; if (c.onHover) c.onHover(t); };
    hit.addEventListener("pointermove", (ev) => show(toT(ev)));
    hit.addEventListener("pointerdown", (ev) => show(toT(ev)));
    if (state.hoverT != null) show(Math.min(state.hoverT, c.H)); else if (c.onHover) show(c.defaultT ?? c.H * 0.1);
  }
  state.update = (next) => { state.cfg = { ...state.cfg, ...next }; render(); };
  state.observer = new ResizeObserver(() => render());
  state.observer.observe(el);
  return state;
}

const chips = (items, attr, active) => items.map(([v, label]) => `<button class="bk-chip" type="button" data-${attr}="${v}" aria-pressed="${v === active}">${label}</button>`).join("");
const pressOnly = (root, sel, b) => $$(sel, root).forEach((c) => c.setAttribute("aria-pressed", c === b));
const rowHtml = (color, html) => `<div class="bk-row">${swatch(color)}<span>${html}</span></div>`;

/* ---------- Figure: five classic schedules ---------- */
export function mountClassic(root) {
  root.innerHTML = `
    <div class="bk-head">
      <div class="bk-title">Five schedules over the same stretch of time</div>
      <div class="bk-chips" data-role="range"></div>
      <button class="bk-chip" type="button" data-role="jitter" aria-pressed="false">±20% jitter</button>
    </div>
    <div class="bk-chips" data-role="series"></div>
    <div class="bk-chart" data-role="chart"></div>
    <div class="bk-readout" data-role="readout"></div>
    <p class="bk-note">Hover or drag across the chart. Each tick is one request. The gap after a tick is the longest a change could go unnoticed if it happened right then.</p>`;
  let H = 300, jitter = false, data = {};
  const on = { fixed: true, linear: true, exp: true, v0: true, v3: true };
  const compute = () => { const rng = mulberry32(7); data = {}; for (const k in CLASSIC) data[k] = checkTimes(CLASSIC[k], 900, rng, jitter); };
  compute();
  $("[data-role=range]", root).innerHTML = chips([[60, "1 min"], [300, "5 min"], [900, "15 min"]], "v", H);
  $("[data-role=series]", root).innerHTML = Object.entries(CLASSIC).map(([k, v]) => `<button class="bk-chip" type="button" data-k="${k}" aria-pressed="true">${swatch(v.color)}${v.name}</button>`).join("");
  const chart = stackChart($("[data-role=chart]", root), { H, label: "Request times, wait between requests, and requests so far for five schedules", defaultT: 20, panels: [], labelW: 120 });
  const readout = (t) => {
    $("[data-role=readout]", root).innerHTML = `<div class="bk-lead">At <b>${fmtT(t)}</b>, if the answer landed right now:</div>` + Object.keys(CLASSIC).filter((k) => on[k]).map((k) => {
      const c = data[k], i = firstAtOrAfter(c, t + 1e-9), next = c[i];
      return rowHtml(CLASSIC[k].color, `<b>${CLASSIC[k].name}</b>: ${i} asks so far, next in <b>${isFinite(next) ? fmtT(next - t) : "none before 15 min"}</b>`);
    }).join("");
  };
  const draw = () => {
    const keys = Object.keys(CLASSIC).filter((k) => on[k]);
    let maxAsks = 1; for (const k of keys) maxAsks = Math.max(maxAsks, firstAtOrAfter(data[k], H + 1e-9));
    const st = niceStep(maxAsks, 3);
    chart.update({ H, onHover: readout, panels: [
      { title: "Requests", kind: "ticks", rows: keys.map((k) => ({ label: CLASSIC[k].name, color: CLASSIC[k].color, times: data[k] })) },
      { title: "Wait before the next request (seconds)", h: 120, yMax: H <= 60 ? 30 : 60, series: keys.map((k) => ({ color: CLASSIC[k].color, step: true, pts: data[k].slice(0, -1).map((t, i) => [t, data[k][i + 1] - t]) })) },
      { title: "Requests so far", h: 120, yMax: Math.ceil(maxAsks / st) * st, series: keys.map((k) => ({ color: CLASSIC[k].color, step: true, pts: data[k].map((t, i) => [t, i + 1]) })) },
    ] });
  };
  root.addEventListener("click", (e) => {
    const b = e.target.closest("button"); if (!b) return;
    if (b.dataset.v) { H = +b.dataset.v; pressOnly(root, "[data-role=range] .bk-chip", b); }
    else if (b.dataset.k) { on[b.dataset.k] = !on[b.dataset.k]; if (!Object.values(on).some(Boolean)) on[b.dataset.k] = true; b.setAttribute("aria-pressed", on[b.dataset.k]); }
    else if (b.dataset.role === "jitter") { jitter = !jitter; b.setAttribute("aria-pressed", jitter); compute(); }
    draw();
  });
  draw();
  return () => chart.observer.disconnect();
}

/* ---------- Figure: when payments settle, and when each version asks ---------- */
export function mountPayments(root) {
  root.innerHTML = `
    <div class="bk-head">
      <div class="bk-title">When payments settle, and when each version asks</div>
      <label class="bk-inline">Workload <select data-role="workload">${Object.entries(WORKLOADS).map(([k, w]) => `<option value="${k}">${w.label}</option>`).join("")}</select></label>
      <div class="bk-chips" data-role="range"></div>
    </div>
    <div class="bk-chart" data-role="chart"></div>
    <div class="bk-readout" data-role="readout"></div>
    <p class="bk-note">Settle times are modelled, not production data: near-instant wallet payments, MoMo prompts that settle in 10–40 seconds, slow ones over minutes, and a few that get stuck.</p>`;
  let H = 180, workload = "typical", sorted = [];
  $("[data-role=range]", root).innerHTML = chips([[60, "1 min"], [180, "3 min"], [900, "15 min"]], "v", H);
  const base = {}; { const rng = mulberry32(3); for (const k of VKEYS) base[k] = checkTimes(VERSIONS[k], HARD + 1, rng, false); }
  const chart = stackChart($("[data-role=chart]", root), { H, defaultT: 12, label: "Share of payments settled over time, with request times for each version", panels: [], labelW: 80 });
  const cdfAt = (t) => firstAtOrAfter(sorted, t + 1e-9) / sorted.length;
  const readout = (t) => {
    $("[data-role=readout]", root).innerHTML = `<div class="bk-lead">By <b>${fmtT(t)}</b>, <b>${Math.round(cdfAt(t) * 100)}%</b> of payments have settled. One settling right now:</div>` + VKEYS.map((k) => {
      const c = base[k], next = c[firstAtOrAfter(c, t)];
      return rowHtml(VERSIONS[k].color, `<b>${VERSIONS[k].name}</b> shows it after <b>${isFinite(next) ? fmtT(next - t) : "hand-over"}</b>`);
    }).join("");
  };
  const draw = () => {
    const rng = mulberry32(11), w = WORKLOADS[workload];
    sorted = Array.from({ length: 20000 }, () => sampleSettle(w, rng)).sort((a, b) => a - b);
    const pts = []; for (let i = 0; i <= 240; i++) { const t = (i / 240) * H; pts.push([t, cdfAt(t) * 100]); }
    chart.update({ H, onHover: readout, panels: [
      { title: "Payments settled so far", h: 130, yMax: 100, yFmt: (v) => v + "%", series: [{ color: "--muted", fill: true, pts }] },
      { title: "Requests (no jitter)", kind: "ticks", rows: VKEYS.map((k) => ({ label: VERSIONS[k].name, color: VERSIONS[k].color, times: base[k] })) },
    ] });
  };
  $("[data-role=workload]", root).addEventListener("change", (e) => { workload = e.target.value; draw(); });
  root.addEventListener("click", (e) => { const b = e.target.closest("button[data-v]"); if (!b) return; H = +b.dataset.v; pressOnly(root, "[data-role=range] .bk-chip", b); draw(); });
  draw();
  return () => chart.observer.disconnect();
}

/* ---------- Figure: lag after settling, over 20,000 payments ---------- */
export function mountLag(root) {
  root.innerHTML = `
    <div class="bk-head">
      <div class="bk-title">Settled payments already showing as done, by seconds after they settled</div>
      <label class="bk-inline"><input type="checkbox" data-role="push"> Push arrives for 60% of payments</label>
    </div>
    <div class="bk-chart" data-role="chart"></div>
    <div class="bk-readout" data-role="readout"></div>
    <div class="bk-tablewrap"><table class="bk-table"><thead><tr><th>Version</th><th class="num">Median wait</th><th class="num">95th pct</th><th class="num">Asks per payment</th><th class="num">Asks if stuck 15 min</th></tr></thead><tbody data-role="table"></tbody></table></div>`;
  const chart = stackChart($("[data-role=chart]", root), { H: 20, defaultT: 1, label: "Cumulative share of settled payments shown, by seconds after settling", panels: [], labelW: 52 });
  const draw = () => {
    const pop = buildPopulation(20000, 99, $("[data-role=push]", root).checked), res = {};
    for (const k of VKEYS) {
      const lags = [], asks = [];
      for (const p of pop) { const o = outcome(p, k); asks.push(o.asks); if (o.det !== Infinity && p.settle < HARD) lags.push(o.det - p.settle); }
      lags.sort((a, b) => a - b);
      res[k] = { lags, asks: asks.reduce((a, b) => a + b, 0) / asks.length, stuck: firstAtOrAfter(checkTimes(VERSIONS[k], HARD + 1, null, false), HARD + 1e-9) };
    }
    $("[data-role=table]", root).innerHTML = VKEYS.map((k) => { const r = res[k]; return `<tr><td>${swatch(VERSIONS[k].color)} <b>${VERSIONS[k].name}</b></td><td class="num">${fmtT(quantile(r.lags, 0.5))}</td><td class="num">${fmtT(quantile(r.lags, 0.95))}</td><td class="num">${r.asks.toFixed(1)}</td><td class="num">${r.stuck}</td></tr>`; }).join("");
    const share = (k, t) => (firstAtOrAfter(res[k].lags, t + 1e-9) / res[k].lags.length) * 100;
    chart.update({
      onHover: (t) => { $("[data-role=readout]", root).innerHTML = `<div class="bk-lead">Within <b>${fmtT(t)}</b> of settling, the screen already shows done for:</div>` + VKEYS.map((k) => rowHtml(VERSIONS[k].color, `<b>${VERSIONS[k].name}</b>: ${share(k, t).toFixed(0)}%`)).join(""); },
      panels: [{ h: 180, yMax: 100, yFmt: (v) => v + "%", series: VKEYS.map((k) => ({ color: VERSIONS[k].color, pts: Array.from({ length: 201 }, (_, i) => { const t = (i / 200) * 20; return [t, share(k, t)]; }) })) }],
    });
  };
  $("[data-role=push]", root).addEventListener("change", draw);
  draw();
  return () => chart.observer.disconnect();
}

/* ---------- Figure: load from a crowd of phones ---------- */
export function mountLoad(root) {
  root.innerHTML = `
    <div class="bk-head"><div class="bk-title">Requests per second from 1,000 phones that start paying within the same 10 seconds</div></div>
    <div class="bk-chart" data-role="chart"></div>
    <div class="bk-readout" data-role="readout"></div>
    <p class="bk-note">Same modelled payments, ±20% jitter as in the app, no push.</p>`;
  const crowd = buildPopulation(1000, 5, false), start = mulberry32(8), L = 180, per = {};
  const offsets = crowd.map(() => start() * 10);
  for (const k of ["v0", "v3"]) {
    const b = new Array(L).fill(0);
    crowd.forEach((p, i) => { const o = outcome(p, k); for (const t of p.checks[k]) { if (t > o.det) break; const at = Math.floor(t + offsets[i]); if (at < L) b[at]++; } });
    per[k] = b;
  }
  const smooth = (b) => b.map((_, i) => { let s = 0, n = 0; for (let j = Math.max(0, i - 2); j <= Math.min(b.length - 1, i + 2); j++) { s += b[j]; n++; } return s / n; });
  const sm = { v0: smooth(per.v0), v3: smooth(per.v3) };
  const peak = Math.max(...sm.v0, ...sm.v3), st = niceStep(peak, 3);
  const totals = { v0: per.v0.reduce((a, b) => a + b, 0), v3: per.v3.reduce((a, b) => a + b, 0) };
  const chart = stackChart($("[data-role=chart]", root), {
    H: L, defaultT: 15, labelW: 52, label: "Requests per second over time from 1,000 phones",
    onHover: (t) => { const i = Math.min(L - 1, Math.floor(t)); $("[data-role=readout]", root).innerHTML = `<div class="bk-lead">Around <b>${fmtT(t)}</b> (5-second average):</div>` + ["v0", "v3"].map((k) => rowHtml(VERSIONS[k].color, `<b>${VERSIONS[k].name}</b>: ${Math.round(sm[k][i])} requests/s · ${totals[k].toLocaleString()} in the first 3 min`)).join(""); },
    panels: [{ h: 170, yMax: Math.ceil(peak / st) * st, series: ["v0", "v3"].map((k) => ({ color: VERSIONS[k].color, pts: sm[k].map((v, i) => [i + 0.5, v]) })) }],
  });
  return () => chart.observer.disconnect();
}

/* ---------- Figure: where the hard part goes ---------- */
const SCEN = {
  early: { label: "Settles early", H: 180, text: "Our payments: most answers in the first half minute, a long thin tail after.",
    pdf: (t) => 0.55 * lognormPdf(t, 2.5, 0.6) + 0.35 * lognormPdf(t, 20, 0.5) + 0.08 * lognormPdf(t, 90, 0.7) + 0.02 / 180 },
  deadline: { label: "Answer at a deadline", H: 120, text: "A MoMo prompt: a third approve within about 15 seconds; the rest ignore it, and the failure lands when the prompt times out near a minute.",
    pdf: (t) => 0.35 * lognormPdf(t, 12, 0.5) + (0.6 * Math.exp(-0.5 * ((t - 62) / 2.5) ** 2)) / (2.5 * Math.sqrt(2 * Math.PI)) + 0.05 / 120 },
  signal: { label: "Right after a signal", H: 240, signals: [45, 150], text: "Signals at 0:45 (the customer taps “I’ve approved”) and 2:30 (a push). The answer usually follows within a few seconds of one.",
    pdf: (t) => { const e = (s) => (t >= s ? 0.25 * Math.exp(-0.25 * (t - s)) : 0); return 0.5 * e(45) + 0.4 * e(150) + 0.1 / 240; } },
  batch: { label: "In batches", H: 960, batches: [300, 600, 900], text: "An upstream that settles every 5 minutes. Answers cluster just after each batch; almost nothing lands between them.",
    pdf: (t) => { let s = 0; for (const b of [300, 600, 900]) s += Math.exp(-0.5 * ((t - b - 8) / 4) ** 2) / (4 * Math.sqrt(2 * Math.PI)); return (0.95 * s) / 3 + 0.05 / 960; } },
};
const SCHEMES = { even: { name: "Evenly spaced", color: "--c-violet" }, front: { name: "Front-loaded (×g)", color: "--c-yellow" }, matched: { name: "Matched (√ rule)", color: "--c-green" } };

function shapeSchedules(s, N) {
  const H = s.H, M = 6000, dt = H / M, f = new Float64Array(M);
  let tot = 0; for (let i = 0; i < M; i++) { f[i] = s.pdf((i + 0.5) * dt); tot += f[i]; }
  for (let i = 0; i < M; i++) f[i] /= tot;
  const even = Array.from({ length: N }, (_, i) => ((i + 1) * H) / N);
  let front = even;
  if (N < H) {
    let lo = 1 + 1e-9, hi = 50;
    for (let it = 0; it < 80; it++) { const g = (lo + hi) / 2; if ((g ** N - 1) / (g - 1) > H) hi = g; else lo = g; }
    const g = (lo + hi) / 2; front = []; let t = 0, w = 1;
    for (let i = 0; i < N; i++) { t += w; w *= g; front.push(Math.min(H, t)); }
    front[N - 1] = H;
  }
  const G = new Float64Array(M + 1); for (let i = 0; i < M; i++) G[i + 1] = G[i] + Math.sqrt(f[i]);
  const matched = []; let j = 0;
  for (let k = 1; k <= N; k++) { const target = (k / N) * G[M]; while (j < M && G[j + 1] < target - 1e-12) j++; matched.push(Math.min(H, (j + 1) * dt)); }
  matched[N - 1] = H;
  const lag = (c) => { let e = 0, p = 0; for (let i = 0; i < M; i++) { const t = (i + 0.5) * dt; while (p < c.length && c[p] < t) p++; e += f[i] * ((p < c.length ? c[p] : H) - t); } return e; };
  return { f, dt, M, even, front, matched, lags: { even: lag(even), front: lag(front), matched: lag(matched) } };
}

export function mountShapes(root) {
  root.innerHTML = `
    <div class="bk-head">
      <div class="bk-chips" data-role="scenario"></div>
      <label class="bk-inline bk-push">Asks <input type="range" data-role="budget" min="8" max="80" value="30"> <span class="bk-mono" data-role="budget-v">30</span></label>
    </div>
    <p class="bk-note bk-scenario" data-role="text"></p>
    <div class="bk-chart" data-role="chart"></div>
    <div class="bk-readout" data-role="readout"></div>
    <div class="bk-tablewrap"><table class="bk-table"><thead><tr><th>Same budget, spent as</th><th class="num">Average wait after the answer lands</th></tr></thead><tbody data-role="table"></tbody></table></div>`;
  let scen = "early", N = 30;
  $("[data-role=scenario]", root).innerHTML = chips(Object.entries(SCEN).map(([k, s]) => [k, s.label]), "s", scen);
  const chart = stackChart($("[data-role=chart]", root), { H: 180, label: "Chance the answer lands over time, with three schedules using the same number of requests", panels: [], labelW: 120 });
  const draw = () => {
    const s = SCEN[scen], r = shapeSchedules(s, N);
    $("[data-role=text]", root).textContent = s.text;
    const pts = []; let peak = 0;
    for (let i = 0; i < r.M; i += 20) peak = Math.max(peak, r.f[i] / r.dt);
    for (let i = 0; i < r.M; i += 20) pts.push([(i + 0.5) * r.dt, ((r.f[i] / r.dt) / peak) * 100]);
    const cum = (t) => { let c = 0; const n = Math.min(r.M, Math.floor(t / r.dt)); for (let i = 0; i < n; i++) c += r.f[i]; return c; };
    const band = (s.signals || s.batches || []).map((a) => [a, a + (s.batches ? 20 : 12)]);
    chart.update({ H: s.H, defaultT: s.signals ? 47 : s.batches ? 305 : scen === "deadline" ? 60 : 8, onHover: (t) => {
      $("[data-role=readout]", root).innerHTML = `<div class="bk-lead">At <b>${fmtT(t)}</b>, ${Math.round(cum(t) * 100)}% of answers have landed.</div>` + Object.keys(SCHEMES).map((k) => { const c = r[k], nx = c[firstAtOrAfter(c, t)]; return rowHtml(SCHEMES[k].color, `<b>${SCHEMES[k].name}</b>: next ask in ${fmtT((nx ?? s.H) - t)}`); }).join("");
    }, panels: [
      { title: "Chance the answer lands at each moment", h: 110, yMax: 100, yFmt: () => "", band, series: [{ color: "--muted", fill: true, pts }] },
      { title: `Requests, ${N} each`, kind: "ticks", rows: Object.keys(SCHEMES).map((k) => ({ label: SCHEMES[k].name, color: SCHEMES[k].color, times: r[k] })) },
    ] });
    const best = Math.min(...Object.values(r.lags));
    $("[data-role=table]", root).innerHTML = Object.keys(SCHEMES).map((k) => `<tr><td>${swatch(SCHEMES[k].color)} ${SCHEMES[k].name}</td><td class="num">${r.lags[k] === best ? "<b>" + fmtT(r.lags[k]) + "</b>" : fmtT(r.lags[k])}</td></tr>`).join("");
  };
  root.addEventListener("click", (e) => { const b = e.target.closest("button[data-s]"); if (!b) return; scen = b.dataset.s; pressOnly(root, "[data-role=scenario] .bk-chip", b); draw(); });
  $("[data-role=budget]", root).addEventListener("input", (e) => { N = +e.target.value; $("[data-role=budget-v]", root).textContent = N; draw(); });
  draw();
  return () => chart.observer.disconnect();
}
