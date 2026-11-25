// Simuladores con gráficas
import { clamp, mean, rand } from '../util.js';

// Normal estándar
const phi = x => Math.exp(-x * x / 2) / Math.sqrt(2 * Math.PI);
function Phi(x) { // CDF (aprox. Abramowitz–Stegun)
  const t = 1 / (1 + .2316419 * Math.abs(x));
  const d = .3989423 * Math.exp(-x * x / 2);
  const p = d * t * (.3193815 + t * (-.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  return x > 0 ? 1 - p : p;
}
const pct = v => Math.round(v * 100) + '%';

// ------------------------------------------------------------ Tónica vs fásica
export function tonicaFasica(el) {
  const hist = { con: [], sin: [] };
  let anim = null;
  el.innerHTML = `<div class="viz-body">
    <div class="ctrls"><div class="slider"><label for="fat">Fatiga / monotonía / final del día <output id="fo"></output></label><input id="fat" type="range" min="0" max="100" value="20"><div class="ends"><span>Descansada</span><span>Agotada</span></div></div>
      <div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn accent" data-t="con">🔔 Ensayo con aviso</button><button class="btn" data-t="sin">Ensayo sin aviso</button></div></div>
    <svg viewBox="0 0 600 230" class="chart" role="img" aria-label="Nivel de preparación a lo largo del ensayo"><g id="g"></g></svg>
    <div class="readout" id="r"></div>
    <div class="results"><div class="insight" id="ins">Lanza varios ensayos con y sin aviso. Luego sube la fatiga y repite.</div></div></div>`;
  const g = el.querySelector('#g');
  const X = t => 50 + t / 2000 * 520, Y = v => 190 - v * 150;
  const fat = () => +el.querySelector('#fat').value / 100;

  function frame(kind, p, rt) {
    const ton = .62 - fat() * .42;
    const pts = [];
    const phasic = t => kind === 'con' && t > 500 ? .32 * ((t - 500) / 380) * Math.exp(1 - (t - 500) / 380) : 0;
    const T = 2000 * p;
    for (let t = 0; t <= T; t += 20) pts.push([X(t), Y(clamp(ton + phasic(t) + Math.sin(t / 90) * .01, 0, 1))]);
    const stim = 1000;
    g.innerHTML = `<line x1="50" y1="190" x2="570" y2="190" class="axis"/><line x1="50" y1="30" x2="50" y2="190" class="axis"/>
      <text x="44" y="24" class="ttl">preparación</text><text x="570" y="210" text-anchor="end">tiempo (ms)</text>
      ${[0, 500, 1000, 1500, 2000].map(t => `<text x="${X(t)}" y="206" text-anchor="middle">${t}</text>`).join('')}
      <line x1="50" y1="${Y(ton)}" x2="570" y2="${Y(ton)}" stroke="var(--alerta)" stroke-dasharray="5 5" opacity=".6"/>
      <text x="566" y="${Y(ton) - 6}" text-anchor="end" style="fill:var(--alerta-ink);font-weight:700">nivel TÓNICO</text>
      ${kind === 'con' ? `<line x1="${X(500)}" y1="30" x2="${X(500)}" y2="190" stroke="var(--ink-2)" stroke-dasharray="2 3"/><text x="${X(500)}" y="44" text-anchor="middle" style="fill:var(--ink);font-weight:700">🔔 aviso</text>` : ''}
      <line x1="${X(stim)}" y1="30" x2="${X(stim)}" y2="190" stroke="var(--ink)" stroke-width="1.5"/><text x="${X(stim)}" y="58" text-anchor="middle" style="fill:var(--ink);font-weight:700">● estímulo</text>
      ${pts.length > 1 ? `<path d="M ${pts.map(q => q.join(' ')).join(' L ')}" fill="none" stroke="var(--alerta)" stroke-width="3.5" stroke-linecap="round"/>` : ''}
      ${kind === 'con' && p > .55 ? `<text x="${X(880)}" y="${Y(ton + .34)}" text-anchor="middle" style="fill:var(--alerta-ink);font-weight:700">pico FÁSICO</text>` : ''}
      ${rt && p >= 1 ? `<rect x="${X(stim)}" y="168" width="${X(stim + Math.min(rt, 990)) - X(stim)}" height="14" rx="3" fill="var(--ink)" opacity=".75"/><text x="${X(stim) + 6}" y="179" style="fill:var(--paper);font-weight:700">TR ${rt > 900 ? 'LAPSO' : rt + ' ms'}</text>` : ''}`;
  }
  function trial(kind) {
    cancelAnimationFrame(anim);
    const f = fat();
    const lapse = Math.random() < f * f * .35;
    let rt = Math.round(330 + f * 120 + rand(-1, 1) * (25 + f * 110) - (kind === 'con' ? 55 - f * 15 : 0));
    if (lapse) rt = 950;
    const t0 = performance.now();
    const step = now => { const p = Math.min(1, (now - t0) / 1400); frame(kind, p, rt); if (p < 1) anim = requestAnimationFrame(step); else done(kind, rt); };
    anim = requestAnimationFrame(step);
  }
  function done(kind, rt) {
    hist[kind].push(rt);
    const valid = a => a.filter(x => x < 900);
    const mc = mean(valid(hist.con)), ms = mean(valid(hist.sin));
    const lap = [...hist.con, ...hist.sin].filter(x => x >= 900).length;
    el.querySelector('#r').innerHTML = `<div><div class="v">${hist.con.length ? Math.round(mc) : '—'}<small style="font-size:.9rem"> ms</small></div><div class="l">TR medio con aviso</div></div>
      <div><div class="v">${hist.sin.length ? Math.round(ms) : '—'}<small style="font-size:.9rem"> ms</small></div><div class="l">TR medio sin aviso</div></div>
      <div><div class="v">${hist.con.length && hist.sin.length ? Math.round(ms - mc) : '—'}</div><div class="l">Beneficio fásico (ms)</div></div>
      <div><div class="v">${lap}</div><div class="l">Lapsos</div></div>`;
    const f = fat();
    el.querySelector('#ins').innerHTML = f > .6
      ? '<b>Con mucha fatiga</b> baja el nivel tónico: los TR son más lentos y variables y aparecen <b>lapsos</b> (omisiones). Así cae la alerta tónica al final del día o en tareas monótonas.'
      : hist.con.length && hist.sin.length ? `El aviso dispara un <b>pico fásico</b> justo antes del estímulo: por eso respondes unos <b>${Math.max(0, Math.round(ms - mc))} ms</b> antes. El aviso es <b>no informativo</b>: dice <i>cuándo</i>, no <i>dónde</i>.` : 'Haz al menos un ensayo de cada tipo para comparar.';
  }
  el.querySelector('#fat').addEventListener('input', () => { el.querySelector('#fo').textContent = el.querySelector('#fat').value + '%'; frame('sin', 0); hist.con = []; hist.sin = []; });
  el.addEventListener('click', e => { const b = e.target.closest('[data-t]'); if (b) trial(b.dataset.t); });
  el.querySelector('#fo').textContent = '20%';
  frame('con', 1, null);
  return () => cancelAnimationFrame(anim);
}

// ------------------------------------------------------------ Teoría de Detección de Señales
export function sdt(el) {
  let d = 1.5, c = 0.75;
  el.innerHTML = `<div class="viz-body">
    <div class="ctrls"><div class="seg" role="group" aria-label="Situaciones">
      <button data-p="cons">Señales raras → conservador</button><button data-p="lib">Criterio liberal</button><button data-p="fat">Fatiga: ↓ sensibilidad</button><button data-p="good">Buena señal (1.er orden)</button></div></div>
    <div class="ctrls">
      <div class="slider"><label for="cc">Criterio <output id="co"></output></label><input id="cc" type="range" min="-1.5" max="4" step=".05"><div class="ends"><span>Liberal (dice "sí" fácil)</span><span>Conservador</span></div></div>
      <div class="slider"><label for="dd">Sensibilidad (d′) <output id="do"></output></label><input id="dd" type="range" min="0" max="3.5" step=".05"><div class="ends"><span>Señal y ruido se confunden</span><span>Fáciles de distinguir</span></div></div>
    </div>
    <svg viewBox="0 0 600 240" class="chart" role="img" aria-label="Distribuciones de ruido y señal más ruido con el criterio"><g id="g"></g></svg>
    <div class="tds-matrix" id="m" style="margin-top:12px"></div>
    <div class="results"><div class="insight" id="ins"></div></div></div>`;
  const xs = v => 50 + (v + 3) / 9.5 * 520, ys = v => 200 - v * 355;
  const curve = (mu, from, to) => { const pts = []; for (let v = from; v <= to + 1e-9; v += .05) pts.push(`${xs(v).toFixed(1)} ${ys(phi(v - mu)).toFixed(1)}`); return pts; };
  const area = (mu, from, to) => { const p = curve(mu, from, to); return `M ${xs(from)} 200 L ${p.join(' L ')} L ${xs(to)} 200 Z`; };
  function draw() {
    el.querySelector('#cc').value = c; el.querySelector('#dd').value = d;
    el.querySelector('#co').textContent = c.toFixed(2); el.querySelector('#do').textContent = d.toFixed(2);
    const L = -3, Rr = 6.5;
    const H = 1 - Phi(c - d), M = Phi(c - d), FA = 1 - Phi(c), CR = Phi(c);
    el.querySelector('#g').innerHTML = `
      <path d="${area(0, L, c)}" fill="var(--ok)" opacity=".16"/><path d="${area(0, c, Rr)}" fill="var(--bad)" opacity=".28"/>
      <path d="${area(d, L, c)}" fill="var(--bad)" opacity=".16"/><path d="${area(d, c, Rr)}" fill="var(--ok)" opacity=".32"/>
      <path d="M ${curve(0, L, Rr).join(' L ')}" fill="none" stroke="var(--ink-2)" stroke-width="2.5"/>
      <path d="M ${curve(d, L, Rr).join(' L ')}" fill="none" stroke="var(--alerta)" stroke-width="3"/>
      <line x1="50" y1="200" x2="570" y2="200" class="axis"/>
      <text x="${xs(0)}" y="${ys(phi(0)) - 8}" text-anchor="middle" class="ttl">Solo ruido</text>
      <text x="${xs(d)}" y="${ys(phi(0)) - (d < .6 ? 24 : 8)}" text-anchor="middle" class="ttl" style="fill:var(--alerta-ink)">Señal + ruido</text>
      <line x1="${xs(c)}" y1="20" x2="${xs(c)}" y2="205" stroke="var(--ink)" stroke-width="2.5"/>
      <rect x="${xs(c) - 44}" y="8" width="88" height="20" rx="6" fill="var(--ink)"/><text x="${xs(c)}" y="22" text-anchor="middle" style="fill:var(--paper);font-weight:700">CRITERIO</text>
      <text x="${xs(c) - 8}" y="222" text-anchor="end">← "no hay señal"</text><text x="${xs(c) + 8}" y="222">"¡hay señal!" →</text>`;
    const cell = (cls, t, s, v) => `<div class="c ${cls}"><b>${t}</b><small>${s}</small><span class="pct">${pct(v)}</span></div>`;
    el.querySelector('#m').innerHTML = `<div></div><div class="h">Dice "sí"</div><div class="h">Dice "no"</div>
      <div class="h">Hay señal</div>${cell('ok', 'Aciertos', 'verdadero positivo', H)}${cell('bad', 'Omisiones', 'falso negativo', M)}
      <div class="h">No hay señal</div>${cell('bad', 'Falsas alarmas', 'falso positivo', FA)}${cell('ok', 'Rechazos correctos', 'verdadero negativo', CR)}`;
    el.querySelector('#ins').innerHTML = c > 1.4 ? '<b>Criterio conservador:</b> exiges mucha evidencia. Casi no das falsas alarmas, pero se disparan las <b>omisiones</b>. Es lo que pasa con señales raras en tareas de vigilancia.'
      : c < .3 ? '<b>Criterio liberal:</b> respondes ante indicios débiles. Bajan las omisiones, pero suben las <b>falsas alarmas</b>.'
      : d < .9 ? '<b>Sensibilidad baja:</b> las curvas se solapan mucho (fatiga, somnolencia, monotonía o mala señal). Muevas como muevas el criterio, fallarás más: es un cambio <b>real</b> de capacidad, no de decisión.'
      : 'Mover el <b>criterio</b> cambia tu <b>decisión</b> (cuánta evidencia pides). Mover la <b>sensibilidad</b> cambia tu <b>capacidad</b> de separar señal y ruido.';
  }
  el.querySelector('#cc').addEventListener('input', e => { c = +e.target.value; draw(); });
  el.querySelector('#dd').addEventListener('input', e => { d = +e.target.value; draw(); });
  el.addEventListener('click', e => {
    const b = e.target.closest('[data-p]'); if (!b) return;
    ({ cons: () => { c = 2.2; d = 1.5; }, lib: () => { c = -.2; d = 1.5; }, fat: () => { d = .6; c = 1; }, good: () => { d = 3; c = 1.5; } })[b.dataset.p]();
    el.querySelectorAll('[data-p]').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    draw();
  });
  draw();
}

// ------------------------------------------------------------ Noradrenalina: ni poco ni demasiado
export function uInvertida(el) {
  el.innerHTML = `<div class="viz-body">
    <div class="ctrls"><div class="slider"><label for="na">Nivel de noradrenalina (locus coeruleus) <output id="no"></output></label><input id="na" type="range" min="0" max="100" value="50"><div class="ends"><span>Muy bajo</span><span>Muy alto</span></div></div></div>
    <svg viewBox="0 0 600 220" class="chart" role="img" aria-label="Rendimiento según el nivel de noradrenalina"><g id="g"></g></svg>
    <div class="results"><div class="insight" id="t"></div></div>
    <p style="font-size:.8rem;color:var(--muted);margin:8px 0 0">Esquema visual para recordar que el tema dice: nivel demasiado bajo → lapsos; demasiado alto → impulsividad.</p></div>`;
  const X = v => 50 + v / 100 * 520, perf = v => Math.exp(-((v - 50) ** 2) / 900), Y = p => 190 - p * 150;
  const draw = () => {
    const v = +el.querySelector('#na').value;
    const pts = []; for (let i = 0; i <= 100; i += 2) pts.push(`${X(i)} ${Y(perf(i))}`);
    el.querySelector('#g').innerHTML = `<line x1="50" y1="190" x2="570" y2="190" class="axis"/><line x1="50" y1="30" x2="50" y2="190" class="axis"/>
      <rect x="50" y="30" width="${X(28) - 50}" height="160" fill="var(--bad)" opacity=".07"/><rect x="${X(72)}" y="30" width="${570 - X(72)}" height="160" fill="var(--bad)" opacity=".07"/>
      <text x="${X(12)}" y="50" text-anchor="middle" style="fill:var(--bad);font-weight:700">LAPSOS</text><text x="${X(88)}" y="50" text-anchor="middle" style="fill:var(--bad);font-weight:700">IMPULSIVIDAD</text>
      <text x="${X(50)}" y="24" text-anchor="middle" style="fill:var(--ok);font-weight:700">ajuste óptimo</text>
      <path d="M ${pts.join(' L ')}" fill="none" stroke="var(--alerta)" stroke-width="3.5"/>
      <circle cx="${X(v)}" cy="${Y(perf(v))}" r="10" fill="var(--alerta)" stroke="var(--card)" stroke-width="3"/>
      <text x="44" y="24" class="ttl">rendimiento</text><text x="570" y="208" text-anchor="end">noradrenalina →</text>`;
    el.querySelector('#no').textContent = v < 28 ? 'bajo' : v > 72 ? 'alto' : 'adecuado';
    el.querySelector('#t').innerHTML = v < 28 ? '<b>Demasiado bajo:</b> aparecen <b>lapsos</b>, breves fallos de respuesta o respuestas muy tardías que cortan el flujo de actuación.'
      : v > 72 ? '<b>Demasiado alto:</b> se favorece la <b>impulsividad</b> (en la alerta fásica: falsas alarmas).'
      : '<b>Nivel ajustado:</b> la noradrenalina sube la <b>ganancia</b> de los circuitos (responden con más intensidad ante la misma entrada): TR más cortos, menos variabilidad y menos lapsos.';
  };
  el.querySelector('#na').addEventListener('input', draw);
  draw();
}

// ------------------------------------------------------------ Intervalo pista–objetivo
export function soaCurve(el) {
  el.innerHTML = `<div class="viz-body">
    <div class="ctrls"><div class="slider"><label for="soa">Intervalo entre pista y objetivo <output id="so"></output></label><input id="soa" type="range" min="0" max="800" step="10" value="120"><div class="ends"><span>0 ms</span><span>800 ms</span></div></div></div>
    <svg viewBox="0 0 600 250" class="chart" role="img" aria-label="Efecto de la pista según el intervalo"><g id="g"></g></svg>
    <div class="legend"><span><i style="background:var(--orient)"></i>Pista periférica (exógena)</span><span><i style="background:var(--control)"></i>Pista central (endógena)</span></div>
    <div class="results"><div class="insight" id="t"></div></div>
    <p style="font-size:.8rem;color:var(--muted);margin:8px 0 0">Curvas ilustrativas. Datos del tema: beneficio exógeno a los ~100–150 ms que decae pronto; endógena más lenta y sostenida; inhibición del retorno de 20–50 ms con intervalos algo mayores.</p></div>`;
  const X = t => 60 + t / 800 * 500, Y = v => 125 - v * 1.7;
  const exo = t => t < 30 ? 0 : 42 * Math.exp(-((t - 130) ** 2) / 4200) - (t > 220 ? Math.min(35, (t - 220) * .22) * Math.exp(-(t - 220) / 900) : 0);
  const endo = t => 40 / (1 + Math.exp(-(t - 260) / 55));
  const draw = () => {
    const s = +el.querySelector('#soa').value;
    const path = f => { const p = []; for (let t = 0; t <= 800; t += 10) p.push(`${X(t)} ${Y(f(t))}`); return 'M ' + p.join(' L '); };
    const e = exo(s), n = endo(s);
    el.querySelector('#g').innerHTML = `<line x1="60" y1="${Y(0)}" x2="560" y2="${Y(0)}" class="axis"/><line x1="60" y1="20" x2="60" y2="230" class="axis"/>
      <text x="64" y="30" class="ttl">beneficio (ms) ↑</text><text x="64" y="226" class="ttl">coste ↓</text><text x="560" y="${Y(0) - 6}" text-anchor="end">intervalo (ms)</text>
      ${[0, 200, 400, 600, 800].map(t => `<text x="${X(t)}" y="${Y(0) + 16}" text-anchor="middle">${t}</text>`).join('')}
      <rect x="${X(100)}" y="20" width="${X(150) - X(100)}" height="210" fill="var(--orient)" opacity=".08"/>
      <path d="${path(exo)}" fill="none" stroke="var(--orient)" stroke-width="3.5"/><path d="${path(endo)}" fill="none" stroke="var(--control)" stroke-width="3.5"/>
      <text x="${X(560)}" y="${Y(-22)}" style="fill:var(--orient-ink);font-weight:700">inhibición del retorno</text>
      <line x1="${X(s)}" y1="20" x2="${X(s)}" y2="230" stroke="var(--ink)" stroke-width="1.5"/>
      <circle cx="${X(s)}" cy="${Y(e)}" r="7" fill="var(--orient)" stroke="var(--card)" stroke-width="2"/><circle cx="${X(s)}" cy="${Y(n)}" r="7" fill="var(--control)" stroke="var(--card)" stroke-width="2"/>`;
    el.querySelector('#so').textContent = s + ' ms';
    el.querySelector('#t').innerHTML = s < 60 ? 'Demasiado pronto: ninguna pista ha tenido tiempo de mover el foco.'
      : s <= 180 ? '<b>Zona exógena:</b> la pista periférica captura el foco rápido (~100–150 ms). La central todavía se está decodificando.'
      : e < -4 ? '<b>Inhibición del retorno:</b> la pista periférica ya no ayuda, ¡estorba! El sistema tarda más en volver al lugar recién atendido (favorece explorar sitios nuevos). La pista central, en cambio, mantiene su beneficio: es <b>sostenida</b>.'
      : '<b>Transición:</b> el beneficio exógeno decae y la orientación endógena, más lenta, va ganando.';
  };
  el.querySelector('#soa').addEventListener('input', draw);
  draw();
}
