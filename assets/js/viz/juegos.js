// Experimentos jugables. Todos funcionan con teclado y con toque.
import { mean, shuffle, sleep, pick, rand } from '../util.js';

function keys(map, cleanups) {
  const on = e => {
    if (/INPUT|SELECT|TEXTAREA/.test(document.activeElement?.tagName)) return;
    // solo se "come" la tecla si el juego la ha usado (si no, Espacio/flechas siguen desplazando la página)
    const f = map[e.key] || map[e.code]; if (f && f() === true) e.preventDefault();
  };
  addEventListener('keydown', on); cleanups.push(() => removeEventListener('keydown', on));
}
const bar = (label, v, max, color) => `<div class="ns-bar"><span>${label}</span><div class="track"><div class="fill" style="width:${Math.min(100, v / max * 100)}%;background:${color}"></div></div><span class="val">${Math.round(v)}</span></div>`;

// ============================================================ MACKWORTH
export function mackworth(el) {
  const C = []; let running = false, timer = null;
  el.innerHTML = `<div class="viz-body">
    <div class="ctrls"><div class="seg" role="group" aria-label="Duración"><button data-d="30" aria-pressed="true">30 s</button><button data-d="60" aria-pressed="false">60 s</button><button data-d="120" aria-pressed="false">2 min (de verdad)</button></div></div>
    <div class="arena" id="ar"></div>
    <div class="respond" style="grid-template-columns:1fr"><button data-hit>¡Salto doble! <kbd>Espacio</kbd></button></div>
    <div class="tds-matrix" id="m" style="margin-top:12px"></div>
    <div class="results" id="res"></div></div>`;
  let dur = 30;
  const ar = el.querySelector('#ar');
  const intro = () => { ar.innerHTML = `<div class="msg"><h4>Reloj de Mackworth</h4><p>El puntero avanza un paso cada poco. De vez en cuando dará un <b>salto doble</b>. Pulsa en cuanto lo veas. Es aburrido a propósito: así se mide la vigilancia.</p><button class="btn" data-start>Empezar</button></div>`; };
  intro();
  const N = 48; let pos = 0, steps = 0, pendingTarget = null, stats, perHalf;
  const clockSVG = () => `<svg viewBox="0 0 300 300" style="width:min(78%,340px);height:auto">
      <circle cx="150" cy="150" r="128" fill="none" stroke="#f4eee2" stroke-opacity=".25" stroke-width="2"/>
      ${Array.from({ length: N }, (_, i) => { const a = i / N * Math.PI * 2 - Math.PI / 2; return `<circle cx="${150 + Math.cos(a) * 128}" cy="${150 + Math.sin(a) * 128}" r="${i % 4 ? 2 : 3.5}" fill="#f4eee2" opacity=".55"/>`; }).join('')}
      <line id="hand" x1="150" y1="150" x2="150" y2="34" stroke="#E39A2D" stroke-width="5" stroke-linecap="round" style="transform-origin:150px 150px"/>
      <circle cx="150" cy="150" r="8" fill="#E39A2D"/></svg><div class="hud"><span id="tl"></span><span>salto doble = pulsa</span></div>`;
  function paintMatrix() {
    const s = stats || { hit: 0, miss: 0, fa: 0, cr: 0 };
    const c = (cls, t, v) => `<div class="c ${cls}"><b>${t}</b><span class="pct">${v}</span></div>`;
    el.querySelector('#m').innerHTML = `<div></div><div class="h">Pulsaste</div><div class="h">No pulsaste</div><div class="h">Salto doble</div>${c('ok', 'Aciertos', s.hit)}${c('bad', 'Omisiones', s.miss)}<div class="h">Paso normal</div>${c('bad', 'Falsas alarmas', s.fa)}${c('ok', 'Rechazos correctos', s.cr)}`;
  }
  paintMatrix();
  function start() {
    running = true; pos = 0; steps = 0; pendingTarget = null; stats = { hit: 0, miss: 0, fa: 0, cr: 0 }; perHalf = [{ t: 0, h: 0 }, { t: 0, h: 0 }];
    ar.innerHTML = clockSVG(); paintMatrix(); el.querySelector('#res').innerHTML = '';
    const total = Math.round(dur * 1000 / 650); const t0 = performance.now();
    let responded = true; // ¿hubo respuesta durante el paso anterior?
    const tick = () => {
      if (!running) return;
      // cerrar el paso anterior
      if (steps > 0) {
        if (pendingTarget && !pendingTarget.answered) stats.miss++;
        else if (!pendingTarget && !responded) stats.cr++;
      }
      const isTarget = steps > 3 && Math.random() < .09;
      pos = (pos + (isTarget ? 2 : 1)) % N;
      pendingTarget = isTarget ? { answered: false, half: performance.now() - t0 < dur * 500 ? 0 : 1 } : null;
      if (isTarget) perHalf[pendingTarget.half].t++;
      responded = false;
      const hand = ar.querySelector('#hand'); if (hand) hand.style.transform = `rotate(${pos / N * 360}deg)`;
      ar.querySelector('#tl').textContent = Math.max(0, Math.ceil(dur - (performance.now() - t0) / 1000)) + ' s';
      paintMatrix();
      steps++;
      if (steps >= total) { timer = setTimeout(finish, 650); return; }
      timer = setTimeout(tick, 650);
    };
    respond.mark = () => { responded = true; };
    tick();
  }
  function respond() {
    if (!running) return;
    respond.mark?.();
    if (pendingTarget && !pendingTarget.answered) { pendingTarget.answered = true; stats.hit++; perHalf[pendingTarget.half].h++; ar.classList.remove('flashok'); void ar.offsetWidth; ar.classList.add('flashok'); }
    else { stats.fa++; ar.classList.remove('flashbad'); void ar.offsetWidth; ar.classList.add('flashbad'); }
    paintMatrix();
  }
  function finish() {
    running = false;
    if (pendingTarget && !pendingTarget.answered) stats.miss++;
    paintMatrix();
    const r1 = perHalf[0].t ? perHalf[0].h / perHalf[0].t : null, r2 = perHalf[1].t ? perHalf[1].h / perHalf[1].t : null;
    ar.innerHTML = `<div class="msg"><h4>Fin de la guardia</h4><p>Saltos detectados: ${stats.hit} de ${stats.hit + stats.miss}.</p><button class="btn" data-start>Repetir</button></div>`;
    el.querySelector('#res').innerHTML = `<div class="insight">${r1 != null && r2 != null ? `Primera mitad: <b>${Math.round(r1 * 100)}%</b> detectados · segunda mitad: <b>${Math.round(r2 * 100)}%</b>. ` : ''}
      En vigilancia real (horas), las <b>omisiones crecen con el tiempo en tarea</b>: cae la alerta tónica y el criterio se vuelve más conservador. ${stats.fa > stats.miss ? 'Has tenido más falsas alarmas que omisiones: tu criterio ha sido <b>liberal</b>.' : stats.miss > 0 ? 'Has tenido omisiones: así se ve el <b>decremento de la vigilancia</b>.' : '¡Guardia perfecta! Prueba la versión de 2 minutos.'}</div>`;
  }
  const cleanups = [];
  el.addEventListener('click', e => {
    if (e.target.closest('[data-start]')) start();
    if (e.target.closest('[data-hit]')) respond();
    const d = e.target.closest('[data-d]'); if (d && !running) { dur = +d.dataset.d; el.querySelectorAll('[data-d]').forEach(b => b.setAttribute('aria-pressed', String(b === d))); }
  });
  ar.addEventListener('pointerdown', () => running && respond());
  const sp = () => { if (!running) return false; respond(); return true; };
  keys({ ' ': sp }, cleanups);
  return () => { running = false; clearTimeout(timer); cleanups.forEach(f => f()); };
}

// ============================================================ POSNER
export function posner(el) {
  let mode = 'periferica', running = false, data = { periferica: { v: [], i: [] }, central: { v: [], i: [] } }, cur = null;
  const cleanups = [];
  el.innerHTML = `<div class="viz-body">
    <div class="ctrls"><div class="seg" role="group" aria-label="Tipo de pista"><button data-m="periferica" aria-pressed="true">Pista periférica (exógena)</button><button data-m="central" aria-pressed="false">Pista central (endógena)</button></div></div>
    <div class="arena" id="ar"></div>
    <div class="respond"><button data-r="L">◀ Izquierda <kbd>←</kbd></button><button data-r="R">Derecha ▶ <kbd>→</kbd></button></div>
    <div class="results" id="res"></div></div>`;
  const ar = el.querySelector('#ar');
  const intro = () => ar.innerHTML = `<div class="msg"><h4>Mira siempre la cruz del centro</h4><p>Aparecerá una pista y después una estrella ★ en una caja. Pulsa el lado de la estrella lo más rápido que puedas. La pista acierta el 75 % de las veces.</p><button class="btn" data-start>Empezar (20 ensayos)</button></div>`;
  intro();
  const scene = (cue, target) => `<svg viewBox="0 0 600 300" style="width:100%;height:100%">
    <rect x="70" y="100" width="100" height="100" rx="10" fill="none" stroke="#f4eee2" stroke-width="${cue === 'pL' ? 8 : 2}" opacity="${cue === 'pL' ? 1 : .5}"/>
    <rect x="430" y="100" width="100" height="100" rx="10" fill="none" stroke="#f4eee2" stroke-width="${cue === 'pR' ? 8 : 2}" opacity="${cue === 'pR' ? 1 : .5}"/>
    ${cue === 'cL' ? `<text x="300" y="166" text-anchor="middle" style="font:700 56px var(--f-mono);fill:#E39A2D">◀</text>` : cue === 'cR' ? `<text x="300" y="166" text-anchor="middle" style="font:700 56px var(--f-mono);fill:#E39A2D">▶</text>` : `<text x="300" y="164" text-anchor="middle" style="font:400 40px var(--f-mono);fill:#f4eee2">+</text>`}
    ${target ? `<text x="${target === 'L' ? 120 : 480}" y="166" text-anchor="middle" style="font:700 52px var(--f-body);fill:#E39A2D">★</text>` : ''}</svg>`;
  async function start() {
    if (running) return; running = true;
    el.querySelector('#res').innerHTML = '';
    const trials = shuffle(Array.from({ length: 20 }, (_, k) => ({ valid: k < 15, side: k % 2 ? 'L' : 'R' })));
    for (let n = 0; n < trials.length && running; n++) {
      const tr = trials[n];
      const cueSide = tr.valid ? tr.side : (tr.side === 'L' ? 'R' : 'L');
      ar.innerHTML = scene(null) + `<div class="hud"><span>${n + 1}/20</span><span>${mode === 'central' ? 'flecha central' : 'destello periférico'}</span></div>`;
      await sleep(rand(600, 1000)); if (!running) return;
      ar.firstElementChild.outerHTML = scene((mode === 'central' ? 'c' : 'p') + cueSide);
      const soa = mode === 'central' ? 500 : 120;
      if (mode === 'periferica') { await sleep(80); ar.firstElementChild.outerHTML = scene(null); await sleep(soa - 80); } else await sleep(soa);
      if (!running) return;
      ar.firstElementChild.outerHTML = scene(mode === 'central' ? 'c' + cueSide : null, tr.side);
      const t0 = performance.now();
      const resp = await new Promise(res => { cur = res; setTimeout(() => res(null), 1500); });
      cur = null;
      const rt = performance.now() - t0;
      if (resp === tr.side) data[mode][tr.valid ? 'v' : 'i'].push(rt);
      ar.classList.remove('flashok', 'flashbad'); void ar.offsetWidth; ar.classList.add(resp === tr.side ? 'flashok' : 'flashbad');
      await sleep(300);
    }
    running = false; finish();
  }
  function finish() {
    const d = data[mode]; const v = mean(d.v), i = mean(d.i);
    ar.innerHTML = `<div class="msg"><h4>¡Hecho!</h4><p>Prueba ahora el otro tipo de pista y compara.</p><button class="btn" data-start>Otra ronda</button></div>`;
    const rows = ['periferica', 'central'].filter(m => data[m].v.length).map(m => {
      const vv = mean(data[m].v), ii = mean(data[m].i);
      return `<div><b style="font-family:var(--f-display)">${m === 'central' ? 'Pista central' : 'Pista periférica'}</b>${bar('Pista válida', vv, 800, 'var(--ok)')}${bar('Pista inválida', ii || 0, 800, 'var(--bad)')}</div>`;
    }).join('');
    el.querySelector('#res').innerHTML = `<div class="ns-bars">${rows}</div>
      <div class="insight">${d.i.length ? `Con la pista <b>válida</b> respondiste en ~${Math.round(v)} ms; con la <b>inválida</b>, en ~${Math.round(i)} ms. Esa diferencia (${Math.round(i - v)} ms) es el <b>coste</b> de tener que <b>desenganchar</b>, desplazar y reenganchar el foco en el otro lado. ` : ''}Fíjate: <b>no has movido los ojos</b> de la cruz. Has orientado la atención de forma <b>encubierta</b>.</div>`;
  }
  const answer = s => { if (!cur) return false; cur(s); return true; };
  el.addEventListener('click', e => {
    if (e.target.closest('[data-start]')) start();
    const r = e.target.closest('[data-r]'); if (r) answer(r.dataset.r);
    const m = e.target.closest('[data-m]'); if (m && !running) { mode = m.dataset.m; el.querySelectorAll('[data-m]').forEach(b => b.setAttribute('aria-pressed', String(b === m))); intro(); }
  });
  keys({ ArrowLeft: () => answer('L'), ArrowRight: () => answer('R') }, cleanups);
  return () => { running = false; cleanups.forEach(f => f()); };
}

// ============================================================ BÚSQUEDA VISUAL
export function busqueda(el) {
  let mode = 'rasgo', running = false, cur = null;
  const data = []; // {mode, n, present, rt}
  const cleanups = [];
  el.innerHTML = `<div class="viz-body">
    <div class="ctrls"><div class="seg" role="group" aria-label="Tipo de búsqueda"><button data-m="rasgo" aria-pressed="true">Rasgo simple</button><button data-m="conj" aria-pressed="false">Conjunción</button></div>
      <span style="font-size:.88rem;color:var(--muted)">Objetivo: <b style="color:#D2453B">● círculo rojo</b></span></div>
    <div class="arena light" id="ar"></div>
    <div class="respond"><button data-r="1">Está <kbd>F</kbd></button><button data-r="0">No está <kbd>J</kbd></button></div>
    <svg viewBox="0 0 600 240" class="chart" style="margin-top:14px" id="ch"></svg>
    <div class="legend"><span><i style="background:var(--orient)"></i>Rasgo simple</span><span><i style="background:var(--control)"></i>Conjunción · presente</span><span><i style="background:var(--control);opacity:.45"></i>Conjunción · ausente</span></div>
    <div class="results" id="res"></div></div>`;
  const ar = el.querySelector('#ar');
  const intro = () => ar.innerHTML = `<div class="msg"><h4>¿Hay un círculo rojo?</h4><p>Responde lo más rápido posible. Haz una ronda de cada tipo y mira la gráfica: ahí está la diferencia entre <b>pop-out</b> y <b>búsqueda serial</b>.</p><button class="btn" data-start>Empezar (16 ensayos)</button></div>`;
  intro();
  function display(n, present) {
    const cells = shuffle(Array.from({ length: 48 }, (_, k) => k)).slice(0, n);
    const items = cells.map((c, k) => {
      const x = 40 + (c % 8) * 72 + rand(-10, 10), y = 34 + Math.floor(c / 8) * 46 + rand(-6, 6);
      let kind;
      if (present && k === 0) kind = 'tr';
      else if (mode === 'rasgo') kind = 'dg';
      else kind = Math.random() < .5 ? 'dg' : 'sr';
      return kind === 'tr' ? `<circle cx="${x}" cy="${y}" r="13" fill="#D2453B"/>` : kind === 'dg' ? `<circle cx="${x}" cy="${y}" r="13" fill="#2F8F4E"/>` : `<rect x="${x - 12}" y="${y - 12}" width="24" height="24" fill="#D2453B"/>`;
    }).join('');
    return `<svg viewBox="0 0 600 300" style="width:100%;height:100%">${items}</svg>`;
  }
  async function start() {
    if (running) return; running = true;
    const sizes = shuffle([4, 8, 16, 24, 4, 8, 16, 24, 4, 8, 16, 24, 4, 8, 16, 24]);
    for (let k = 0; k < sizes.length && running; k++) {
      const present = Math.random() < .5;
      ar.innerHTML = `<div class="fix">+</div>`;
      await sleep(rand(450, 750)); if (!running) return;
      ar.innerHTML = display(sizes[k], present) + `<div class="hud" style="color:var(--ink)"><span>${k + 1}/16 · ${sizes[k]} elementos</span></div>`;
      const t0 = performance.now();
      const r = await new Promise(res => { cur = res; setTimeout(() => res(null), 4000); }); cur = null;
      const rt = performance.now() - t0;
      const ok = r === (present ? 1 : 0);
      if (ok) data.push({ mode, n: sizes[k], present, rt });
      ar.classList.remove('flashok', 'flashbad'); void ar.offsetWidth; ar.classList.add(ok ? 'flashok' : 'flashbad');
    }
    running = false;
    ar.innerHTML = `<div class="msg"><h4>Ronda terminada</h4><p>${mode === 'rasgo' ? 'Ahora prueba la búsqueda por conjunción.' : 'Mira las pendientes en la gráfica.'}</p><button class="btn" data-start>Otra ronda</button></div>`;
    chart();
  }
  function chart() {
    const ch = el.querySelector('#ch');
    const X = n => 70 + (n - 4) / 20 * 480, Y = rt => 200 - Math.min(rt, 2400) / 2400 * 170;
    const series = [['rasgo', null, 'var(--orient)', 1], ['conj', true, 'var(--control)', 1], ['conj', false, 'var(--control)', .45]];
    const lines = series.map(([m, p, col, op]) => {
      const pts = [4, 8, 16, 24].map(n => { const v = data.filter(d => d.mode === m && d.n === n && (p == null || d.present === p)).map(d => d.rt); return v.length ? [X(n), Y(mean(v))] : null; }).filter(Boolean);
      return pts.length ? `<path d="M ${pts.map(q => q.join(' ')).join(' L ')}" fill="none" stroke="${col}" stroke-width="3.5" opacity="${op}"/>${pts.map(q => `<circle cx="${q[0]}" cy="${q[1]}" r="5" fill="${col}" opacity="${op}"/>`).join('')}` : '';
    }).join('');
    ch.innerHTML = `<line x1="70" y1="200" x2="560" y2="200" class="axis"/><line x1="70" y1="25" x2="70" y2="200" class="axis"/>
      ${[4, 8, 16, 24].map(n => `<text x="${X(n)}" y="218" text-anchor="middle">${n}</text>`).join('')}${[0, 800, 1600, 2400].map(v => `<text x="62" y="${Y(v) + 4}" text-anchor="end">${v}</text>`).join('')}
      <text x="74" y="20" class="ttl">tiempo de reacción (ms)</text><text x="560" y="236" text-anchor="end" class="ttl">tamaño del conjunto</text>${lines || `<text x="315" y="115" text-anchor="middle">Aquí aparecerán tus tiempos</text>`}`;
    const slope = (m, p) => { const a = data.filter(d => d.mode === m && (p == null || d.present === p)); const s4 = mean(a.filter(d => d.n <= 8).map(d => d.rt)), s24 = mean(a.filter(d => d.n >= 16).map(d => d.rt)); return a.length > 3 && s4 && s24 ? s24 - s4 : null; };
    const sr = slope('rasgo'), sc = slope('conj');
    el.querySelector('#res').innerHTML = (sr != null || sc != null) ? `<div class="insight">${sr != null ? `Rasgo simple: pasar de pocos a muchos elementos te costó <b>${Math.round(sr)} ms</b> (casi plano: <b>pop-out</b>). ` : ''}${sc != null ? `Conjunción: <b>${Math.round(sc)} ms</b> más con conjuntos grandes (búsqueda que crece con el tamaño). ` : ''}Según Treisman, en la conjunción la atención tiene que ir <b>posición a posición</b> uniendo color y forma.</div>` : '';
  }
  chart();
  const answer = v => { if (!cur) return false; cur(v); return true; };
  el.addEventListener('click', e => {
    if (e.target.closest('[data-start]')) start();
    const r = e.target.closest('[data-r]'); if (r) answer(+r.dataset.r);
    const m = e.target.closest('[data-m]'); if (m && !running) { mode = m.dataset.m; el.querySelectorAll('[data-m]').forEach(b => b.setAttribute('aria-pressed', String(b === m))); intro(); }
  });
  keys({ f: () => answer(1), F: () => answer(1), j: () => answer(0), J: () => answer(0) }, cleanups);
  return () => { running = false; cleanups.forEach(f => f()); };
}

// ============================================================ CONJUNCIONES ILUSORIAS
export function conjuncion(el) {
  const COL = { rojo: '#D2453B', verde: '#2F8F4E', azul: '#2E5BA6' };
  const LET = ['X', 'T', 'O', 'S', 'K'];
  let state = null, totals = { ill: 0, real: 0, rounds: 0 };
  el.innerHTML = `<div class="viz-body"><div class="arena" id="ar"></div><div id="q"></div><div class="results" id="res"></div></div>`;
  const ar = el.querySelector('#ar');
  ar.innerHTML = `<div class="msg"><h4>Destello de 0,2 segundos</h4><p>Verás dos <b>números</b> en los extremos y tres <b>letras de colores</b> en el centro. Primero di la suma de los números y luego qué letras viste. (Los números dividen tu atención).</p><button class="btn" data-start>Mostrar</button></div>`;
  async function round() {
    const cols = shuffle(Object.keys(COL)), lets = shuffle(LET).slice(0, 3);
    const a = Math.floor(rand(1, 9)), b = Math.floor(rand(1, 9));
    const real = lets.map((l, i) => ({ l, c: cols[i] }));
    const ill = [{ l: lets[0], c: cols[1] }, { l: lets[2], c: cols[0] }];
    state = { real, ill, sum: a + b };
    ar.innerHTML = `<div class="fix">+</div>`; await sleep(700);
    ar.innerHTML = `<svg viewBox="0 0 600 300" style="width:100%;height:100%"><text x="60" y="166" style="font:700 46px var(--f-mono);fill:#f4eee2">${a}</text><text x="540" y="166" text-anchor="end" style="font:700 46px var(--f-mono);fill:#f4eee2">${b}</text>
      ${real.map((r, i) => `<text x="${220 + i * 80}" y="170" text-anchor="middle" style="font:800 64px var(--f-body);fill:${COL[r.c]}">${r.l}</text>`).join('')}</svg>`;
    await sleep(200);
    ar.innerHTML = `<svg viewBox="0 0 600 300" style="width:100%;height:100%">${Array.from({ length: 70 }, () => `<rect x="${rand(140, 460)}" y="${rand(100, 200)}" width="${rand(8, 30)}" height="${rand(8, 30)}" fill="${pick(Object.values(COL))}" opacity=".85"/>`).join('')}</svg>`;
    await sleep(250);
    ar.innerHTML = `<div class="msg"><h4>¿Cuánto suman los números?</h4></div>`;
    const opts = shuffle([...real.slice(0, 2), ...ill]);
    el.querySelector('#q').innerHTML = `<div class="respond three" style="margin-top:12px">${shuffle([state.sum, state.sum + 1, state.sum - 1, state.sum + 2]).map(v => `<button data-sum="${v}">${v}</button>`).join('')}</div>`;
    state.opts = opts;
  }
  function askLetters() {
    ar.innerHTML = `<div class="msg"><h4>¿Cuáles de estas viste? (marca todas)</h4></div>`;
    el.querySelector('#q').innerHTML = `<div class="sorter-pool" style="justify-content:center;margin-top:12px">${state.opts.map((o, i) => `<button class="sort-item" data-o="${i}" aria-pressed="false" style="font-size:1.6rem;min-width:64px;color:${COL[o.c]}">${o.l}</button>`).join('')}</div><div style="text-align:center;margin-top:12px"><button class="btn primary" data-check>Comprobar</button></div>`;
  }
  function check() {
    const picked = [...el.querySelectorAll('[data-o][aria-pressed="true"]')].map(b => state.opts[+b.dataset.o]);
    const isIll = o => state.ill.some(x => x.l === o.l && x.c === o.c);
    const nIll = picked.filter(isIll).length;
    totals.ill += nIll; totals.real += picked.length - nIll; totals.rounds++;
    el.querySelectorAll('[data-o]').forEach(b => { const o = state.opts[+b.dataset.o]; b.classList.add(isIll(o) ? 'bad' : 'ok'); b.disabled = true; b.insertAdjacentHTML('beforeend', `<small style="display:block;font-size:.65rem;color:var(--ink)">${isIll(o) ? 'no estaba' : 'real'}</small>`); });
    el.querySelector('[data-check]').outerHTML = `<button class="btn primary" data-start>Otra vez</button>`;
    ar.innerHTML = `<div class="msg"><h4>${nIll ? '¡Conjunción ilusoria!' : 'Sin ilusiones esta vez'}</h4><p>Las letras reales eran: ${state.real.map(r => `<b style="color:${COL[r.c]}">${r.l}</b>`).join(' ')}</p></div>`;
    el.querySelector('#res').innerHTML = `<div class="insight">${nIll ? `Has "visto" ${nIll} combinación${nIll > 1 ? 'es' : ''} que <b>no existía${nIll > 1 ? 'n' : ''}</b>: la letra era real y el color también, pero de <b>objetos distintos</b>. ` : ''}Con la atención <b>dividida</b> (los números) y una exposición <b>muy breve</b>, la atención espacial no puede actuar de "mapa maestro" y los rasgos se unen mal. Total: ${totals.ill} ilusorias en ${totals.rounds} ronda${totals.rounds > 1 ? 's' : ''}.</div>`;
  }
  el.addEventListener('click', e => {
    if (e.target.closest('[data-start]')) { el.querySelector('#q').innerHTML = ''; round(); }
    if (e.target.closest('[data-sum]')) askLetters();
    const o = e.target.closest('[data-o]'); if (o && !o.disabled) o.setAttribute('aria-pressed', String(o.getAttribute('aria-pressed') !== 'true'));
    if (e.target.closest('[data-check]')) check();
  });
}

// ============================================================ STROOP
export function stroop(el) {
  const C = [['ROJO', '#D2453B', 'r'], ['AZUL', '#2E5BA6', 'a'], ['VERDE', '#2F8F4E', 'v'], ['AMARILLO', '#E2B417', 'm']];
  let running = false, cur = null; const cleanups = [];
  el.innerHTML = `<div class="viz-body"><div class="arena light" id="ar"></div>
    <div class="respond three">${C.map((c, i) => `<button data-c="${i}" style="border-color:${c[1]}"><span style="display:inline-block;width:14px;height:14px;border-radius:50%;background:${c[1]};vertical-align:-2px;margin-right:6px"></span>${c[0].toLowerCase()} <kbd>${i + 1}</kbd></button>`).join('')}</div>
    <div class="results" id="res"></div></div>`;
  const ar = el.querySelector('#ar');
  ar.innerHTML = `<div class="msg"><h4>Responde el COLOR de la tinta</h4><p>No leas la palabra. Pulsa el botón del color en que está escrita (o las teclas 1–4).</p><button class="btn" data-start>Empezar (20 palabras)</button></div>`;
  async function start() {
    if (running) return; running = true;
    const trials = shuffle(Array.from({ length: 20 }, (_, k) => ({ cong: k < 10 })));
    const res = { cong: [], inc: [], err: 0 };
    for (let n = 0; n < trials.length && running; n++) {
      const ink = Math.floor(Math.random() * 4);
      const word = trials[n].cong ? ink : (ink + 1 + Math.floor(Math.random() * 3)) % 4;
      ar.innerHTML = `<div class="fix">+</div>`; await sleep(450); if (!running) return;
      ar.innerHTML = `<div style="font:800 clamp(2.4rem,8vw,4.4rem)/1 var(--f-body);color:${C[ink][1]};letter-spacing:.02em">${C[word][0]}</div><div class="hud" style="color:var(--ink)"><span>${n + 1}/20</span></div>`;
      const t0 = performance.now();
      const r = await new Promise(rs => { cur = rs; setTimeout(() => rs(null), 3000); }); cur = null;
      const rt = performance.now() - t0;
      if (r === ink) res[trials[n].cong ? 'cong' : 'inc'].push(rt); else res.err++;
      ar.classList.remove('flashok', 'flashbad'); void ar.offsetWidth; ar.classList.add(r === ink ? 'flashok' : 'flashbad');
    }
    running = false;
    const a = mean(res.cong), b = mean(res.inc);
    ar.innerHTML = `<div class="msg"><h4>Efecto Stroop</h4><p>Interferencia: <b>${Math.round(b - a)} ms</b></p><button class="btn" data-start>Repetir</button></div>`;
    el.querySelector('#res').innerHTML = `<div class="ns-bars">${bar('Congruente (ROJO en rojo)', a, 1500, 'var(--ok)')}${bar('Incongruente (ROJO en azul)', b, 1500, 'var(--control)')}</div>
      <div class="insight">Leer es un <b>esquema automático</b> muy fuerte. En las incongruentes compiten "leer la palabra" y "nombrar el color": es la <b>selección bajo conflicto</b>. La cingulada anterior detecta el conflicto y la prefrontal lateral refuerza la regla "nombra el color" (el SAS de Norman y Shallice). Errores: ${res.err}.</div>`;
  }
  const answer = i => { if (!cur) return false; cur(i); return true; };
  el.addEventListener('click', e => { if (e.target.closest('[data-start]')) start(); const b = e.target.closest('[data-c]'); if (b) answer(+b.dataset.c); });
  keys({ 1: () => answer(0), 2: () => answer(1), 3: () => answer(2), 4: () => answer(3) }, cleanups);
  return () => { running = false; cleanups.forEach(f => f()); };
}

// ============================================================ GO / NO-GO
export function gonogo(el) {
  let running = false, pressed = false; const cleanups = [];
  el.innerHTML = `<div class="viz-body"><div class="arena" id="ar"></div>
    <div class="respond" style="grid-template-columns:1fr"><button data-go>¡Ya! <kbd>Espacio</kbd></button></div>
    <div class="results" id="res"></div></div>`;
  const ar = el.querySelector('#ar');
  ar.innerHTML = `<div class="msg"><h4>Verde = pulsa · Rojo = ¡quieto!</h4><p>Saldrán círculos muy rápido. Casi todos verdes. Cuando salga uno <b>rojo</b>, no pulses.</p><button class="btn" data-start>Empezar (30)</button></div>`;
  async function start() {
    if (running) return; running = true;
    const s = { hit: 0, om: 0, fa: 0, cr: 0, rts: [] };
    const trials = shuffle(Array.from({ length: 30 }, (_, k) => k < 24));
    for (let n = 0; n < trials.length && running; n++) {
      const go = trials[n];
      ar.innerHTML = `<div class="fix">+</div><div class="hud"><span>${n + 1}/30</span></div>`;
      await sleep(rand(350, 600)); if (!running) return;
      pressed = false;
      ar.innerHTML = `<svg viewBox="0 0 200 200" style="width:38%;max-width:200px"><circle cx="100" cy="100" r="80" fill="${go ? '#2F8F4E' : '#D2453B'}"/></svg><div class="hud"><span>${n + 1}/30</span></div>`;
      const t0 = performance.now();
      await new Promise(rs => { const iv = setInterval(() => { if (pressed || performance.now() - t0 > 550) { clearInterval(iv); rs(); } }, 10); });
      const rt = performance.now() - t0;
      if (go) { if (pressed) { s.hit++; s.rts.push(rt); } else s.om++; } else { if (pressed) s.fa++; else s.cr++; }
      const ok = go === pressed;
      ar.classList.remove('flashok', 'flashbad'); void ar.offsetWidth; ar.classList.add(ok ? 'flashok' : 'flashbad');
      await sleep(Math.max(0, 550 - rt) + 100);
    }
    running = false;
    ar.innerHTML = `<div class="msg"><h4>Resultado</h4><p>Te frenaste en ${s.cr} de ${s.cr + s.fa} rojos.</p><button class="btn" data-start>Repetir</button></div>`;
    el.querySelector('#res').innerHTML = `<div class="readout"><div><div class="v">${s.hit}</div><div class="l">Aciertos (verde)</div></div><div><div class="v">${s.fa}</div><div class="l">Falsas alarmas (pulsaste en rojo)</div></div><div><div class="v">${s.om}</div><div class="l">Omisiones</div></div><div><div class="v">${Math.round(mean(s.rts))}</div><div class="l">TR medio (ms)</div></div></div>
      <div class="insight">Al ser casi todo verde, "pulsar" se vuelve una <b>respuesta prepotente</b>. Frenarla ante el rojo es <b>inhibición de respuestas</b>. Un control eficaz da <b>menos falsas alarmas</b>. En el cerebro, los <b>ganglios basales</b> aplican ese freno; su disfunción se expresa como impulsividad.</div>`;
  }
  const press = () => { if (!running) return false; pressed = true; return true; };
  el.addEventListener('click', e => { if (e.target.closest('[data-start]')) start(); if (e.target.closest('[data-go]')) press(); });
  ar.addEventListener('pointerdown', e => { if (!e.target.closest('[data-start]')) press(); });
  keys({ ' ': press }, cleanups);
  return () => { running = false; cleanups.forEach(f => f()); };
}
