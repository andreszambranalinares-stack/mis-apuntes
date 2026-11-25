// Modelos animados: Norman-Shallice, inhibición lateral, teatro vs borradores,
// núcleo reentrante, espacio de trabajo global (GNW) y clasificador CNC.
import { clamp, shuffle, rand } from '../util.js';

const seg = (opts, cur, attr) => `<div class="seg" role="group">${opts.map(([k, l]) => `<button ${attr}="${k}" aria-pressed="${k === cur}">${l}</button>`).join('')}</div>`;

// ============================================================ NORMAN Y SHALLICE
export function normanShallice(el) {
  const S = {
    rutina: { t: 'Rutina: semáforo en rojo', sch: [['Frenar', .85], ['Acelerar', .2], ['Mirar el móvil', .12]], sas: false, mot: false,
      pasos: ['El rojo entra por los sentidos y activa el esquema "frenar".', 'No hay conflicto: "frenar" supera el umbral claramente.', 'El SAS NO interviene: la competencia por contención basta.', 'Gana "frenar" e inhibe lateralmente a los incompatibles.'], final: [.9, .1, .05] },
    stroop: { t: 'Stroop: la palabra ROJO escrita en azul', sch: [['Leer la palabra', .8], ['Nombrar el color', .62], ['Otra respuesta', .1]], sas: true, mot: false,
      pasos: ['La palabra activa "leer" (muy practicado) y el color activa "nombrar".', '¡Conflicto! Dos esquemas compiten por el mismo contexto.', 'El SAS inyecta el objetivo "nombra el color, no leas" y sube su prioridad.', '"Nombrar" gana; la inhibición lateral debilita "leer". Luego el SAS se retira.'], final: [.28, .95, .05] },
    nueva: { t: 'Situación nueva: tu calle está cortada', sch: [['Ruta habitual', .76], ['Buscar un desvío', .32], ['Parar y preguntar', .2]], sas: true, mot: false,
      pasos: ['El contexto ("voy a casa") activa con fuerza la ruta de siempre.', 'Pero no sirve: situación nueva. Riesgo de "desliz" de acción.', 'El SAS bloquea la respuesta prepotente y reconfigura la secuencia.', 'Gana "buscar un desvío".'], final: [.2, .9, .3] },
    hambre: { t: 'Llevas horas estudiando y tienes hambre', sch: [['Seguir estudiando', .62], ['Ir a la nevera', .5], ['Mirar el móvil', .3]], sas: false, mot: true,
      pasos: ['Dos esquemas compiten casi empatados.', 'El Sistema de Activación Motivacional aporta valor y urgencia (hambre).', 'Cambia el "tono" de la competición: sube "ir a la nevera".', 'Gana la nevera… sin control deliberado.'], final: [.4, .85, .2] },
  };
  let sc = 'stroop', step = 0, timer = null;
  el.innerHTML = `<div class="viz-body">
    <div class="ctrls">${seg(Object.entries(S).map(([k, v]) => [k, v.t.split(':')[0]]), sc, 'data-s')}<button class="btn sm accent" data-play>▶ Reproducir</button></div>
    <svg viewBox="0 0 640 250" class="chart flow-svg" role="img" aria-label="Diagrama del modelo de Norman y Shallice"><g id="d"></g></svg>
    <h4 id="tt" style="font-family:var(--f-display);margin:12px 0 8px"></h4>
    <div class="ns-bars" id="bars"></div>
    <div class="flow-step"><span class="n" id="sn"></span><p id="st"></p></div></div>`;
  function diagram(sasOn, motOn, active) {
    const box = (x, y, w, h, t, s, on, col = 'var(--control)') => `<g class="flow-node${on ? ' on' : ''}" style="--accent:${col}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10"/><text x="${x + w / 2}" y="${y + h / 2 + (s ? -2 : 5)}" text-anchor="middle">${t}</text>${s ? `<text class="sub" x="${x + w / 2}" y="${y + h / 2 + 14}" text-anchor="middle">${s}</text>` : ''}</g>`;
    const arr = (x1, y1, x2, y2, on) => `<path class="flow-edge${on ? ' on' : ''}" d="M${x1} ${y1} L${x2} ${y2}" marker-end="url(#nsA)"/>`;
    return `<defs><marker id="nsA" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10z" fill="var(--ink-2)"/></marker></defs>
      ${box(10, 170, 110, 56, 'Entrada', 'sensorial', active >= 0)}${arr(120, 198, 150, 198, active >= 0)}
      ${box(150, 170, 120, 56, 'Análisis', 'perceptual', active >= 0)}${arr(270, 198, 300, 198, active >= 0)}
      ${box(300, 170, 150, 56, 'Programador', 'de esquemas (contención)', active >= 1)}${arr(450, 198, 480, 198, active >= 3)}
      ${box(480, 170, 150, 56, 'Acción', 'externa o interna', active >= 3)}
      ${box(250, 20, 250, 58, 'Sistema Atencional Supervisor', sasOn ? 'INTERVIENE: sesga la competición' : 'en reposo', sasOn && active >= 2, 'var(--control)')}
      ${box(10, 20, 220, 58, 'Activación Motivacional', motOn ? 'aporta valor y urgencia' : '—', motOn && active >= 1, 'var(--alerta)')}
      ${arr(375, 78, 375, 168, sasOn && active >= 2)}${arr(150, 78, 330, 168, motOn && active >= 1)}`;
  }
  function draw() {
    const s = S[sc];
    const vals = step >= 3 || (step >= 2 && (s.sas || s.mot)) ? s.final : s.sch.map(x => x[1]);
    const win = vals.indexOf(Math.max(...vals));
    el.querySelector('#d').innerHTML = diagram(s.sas, s.mot, step);
    el.querySelector('#tt').textContent = s.t;
    el.querySelector('#bars').innerHTML = s.sch.map(([n], i) => `<div class="ns-bar${step >= 3 && i === win ? ' win' : ''}"><span>${n}</span><div class="track"><div class="fill" style="width:${vals[i] * 100}%"></div><div class="thr" style="left:70%"></div></div><span class="val">${Math.round(vals[i] * 100)}</span></div>`).join('') + `<div style="font-size:.75rem;color:var(--muted);text-align:right">│ = umbral de activación</div>`;
    el.querySelector('#sn').textContent = step + 1;
    el.querySelector('#st').textContent = s.pasos[step];
    el.querySelectorAll('[data-s]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.s === sc)));
  }
  const play = () => { clearTimeout(timer); step = 0; draw(); const go = () => { if (step < 3) timer = setTimeout(() => { step++; draw(); go(); }, 2300); }; go(); };
  el.addEventListener('click', e => { const b = e.target.closest('[data-s]'); if (b) { sc = b.dataset.s; play(); } if (e.target.closest('[data-play]')) play(); });
  play();
  return () => clearTimeout(timer);
}

// ============================================================ INHIBICIÓN LATERAL
export function inhibicionLateral(el) {
  let a = 0, b = 0, sas = false, raf = null, hist = [];
  el.innerHTML = `<div class="viz-body">
    <div class="ctrls"><button class="btn accent" data-run="0">Stroop incongruente SIN SAS</button><button class="btn primary" data-run="1">Con SAS: refuerza "nombrar color"</button></div>
    <div class="split" style="align-items:center">
      <svg viewBox="0 0 300 200" class="chart"><g id="n"></g></svg>
      <svg viewBox="0 0 300 200" class="chart"><g id="c"></g></svg></div>
    <div class="results"><div class="insight" id="t">Elige una opción para ver la dinámica.</div></div></div>`;
  function nodes() {
    el.querySelector('#n').innerHTML = `<defs><marker id="ilA" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10z" fill="var(--ink-2)"/></marker></defs>
      <circle cx="80" cy="110" r="${26 + a * 22}" fill="var(--control)" opacity="${.25 + a * .6}"/><text x="80" y="114" text-anchor="middle" style="font:700 12px var(--f-body);fill:var(--ink)">Nombrar</text>
      <circle cx="220" cy="110" r="${26 + b * 22}" fill="var(--ink-2)" opacity="${.2 + b * .6}"/><text x="220" y="114" text-anchor="middle" style="font:700 12px var(--f-body);fill:var(--ink)">Leer</text>
      <path d="M115 95 Q150 75 185 95" stroke="var(--bad)" stroke-width="2.5" fill="none"/><path d="M185 125 Q150 145 115 125" stroke="var(--bad)" stroke-width="2.5" fill="none"/>
      <line x1="181" y1="88" x2="189" y2="102" stroke="var(--bad)" stroke-width="3"/><line x1="111" y1="118" x2="119" y2="132" stroke="var(--bad)" stroke-width="3"/>
      <text x="150" y="70" text-anchor="middle" class="svgmono">inhibición lateral</text>
      ${sas ? `<rect x="40" y="10" width="80" height="28" rx="8" fill="var(--control)"/><text x="80" y="29" text-anchor="middle" style="font:800 12px var(--f-display);fill:#fff">SAS</text><path d="M80 38 L80 ${78 - a * 18}" stroke="var(--control)" stroke-width="3" marker-end="url(#ilA)"/>` : ''}`;
  }
  function chart() {
    const X = i => 30 + i / 120 * 260, Y = v => 170 - v * 140;
    const pa = hist.map((h, i) => `${X(i)} ${Y(h[0])}`), pb = hist.map((h, i) => `${X(i)} ${Y(h[1])}`);
    el.querySelector('#c').innerHTML = `<line x1="30" y1="170" x2="290" y2="170" class="axis"/><line x1="30" y1="25" x2="30" y2="170" class="axis"/><text x="34" y="20" class="ttl">activación</text><text x="290" y="188" text-anchor="end">tiempo →</text>
      <line x1="30" y1="${Y(.7)}" x2="290" y2="${Y(.7)}" class="gridl"/><text x="288" y="${Y(.7) - 4}" text-anchor="end">umbral</text>
      ${pa.length > 1 ? `<path d="M ${pa.join(' L ')}" fill="none" stroke="var(--control)" stroke-width="3"/><path d="M ${pb.join(' L ')}" fill="none" stroke="var(--ink-2)" stroke-width="3" stroke-dasharray="5 4"/>` : ''}`;
  }
  function run(withSas) {
    cancelAnimationFrame(raf); a = 0; b = 0; hist = []; sas = false;
    let i = 0;
    const f = () => {
      sas = withSas && i > 30;
      const inA = .45 + (sas ? .55 : 0), inB = .62; // leer está más practicado
      const da = (inA - 1.1 * b - a * .9) * .08, db = (inB - 1.1 * a - b * .9) * .08;
      a = clamp(a + da, 0, 1); b = clamp(b + db, 0, 1); hist.push([a, b]); nodes(); chart();
      if (++i < 120) raf = requestAnimationFrame(f);
      else el.querySelector('#t').innerHTML = withSas
        ? 'El SAS <b>solo refuerza</b> "nombrar el color". La caída de "leer" no la provoca el SAS directamente: la provoca la <b>inhibición lateral</b> de un esquema ganador sobre su rival. Elevar lo correcto y dejar que la competencia suprima lo incorrecto.'
        : 'Sin SAS gana el esquema más practicado ("leer"): dices la palabra en vez del color. Es el error típico del Stroop incongruente.';
    };
    f();
  }
  el.addEventListener('click', e => { const b2 = e.target.closest('[data-run]'); if (b2) run(b2.dataset.run === '1'); });
  nodes(); chart();
  return () => cancelAnimationFrame(raf);
}

// ============================================================ TEATRO vs BORRADORES
export function teatro(el) {
  let mode = 'teatro', depth = 1, raf = null;
  el.innerHTML = `<div class="viz-body"><div class="ctrls">${seg([['teatro', 'Teatro cartesiano'], ['drafts', 'Versiones múltiples (Dennett)']], mode, 'data-m')}<span id="extra"></span></div>
    <svg viewBox="0 0 600 300" class="chart" role="img" aria-label="Comparación de modelos"><g id="g"></g></svg>
    <div class="results"><div class="insight" id="t"></div></div></div>`;
  const g = el.querySelector('#g');
  const homun = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><circle cx="0" cy="-22" r="10" fill="var(--consc)"/><path d="M-12 12 L0 -10 L12 12 M0 -10 L0 2" stroke="var(--consc)" stroke-width="5" stroke-linecap="round" fill="none"/><circle cx="-4" cy="-24" r="2" fill="#fff"/><circle cx="4" cy="-24" r="2" fill="#fff"/></g>`;
  function teatroDraw() {
    cancelAnimationFrame(raf);
    const mods = [['color', 70, 60], ['forma', 70, 240], ['sonido', 530, 60], ['memoria', 530, 240]];
    let nest = ''; let s = 1, x = 300, y = 210;
    for (let i = 0; i < depth; i++) { nest += homun(x, y, s) + (i < depth - 1 ? `<path d="M${x} ${y - 40 * s} q 0 -20 ${30 * s} -26" stroke="var(--consc)" fill="none" stroke-dasharray="3 3"/>` : ''); x += 34 * s; y -= 44 * s; s *= .6; }
    g.innerHTML = `${mods.map(([n, mx, my]) => `<rect x="${mx - 50}" y="${my - 20}" width="100" height="40" rx="10" fill="var(--paper-2)" stroke="var(--line-2)"/><text x="${mx}" y="${my + 5}" text-anchor="middle" style="font:700 12px var(--f-body);fill:var(--ink)">${n}</text><path d="M${mx} ${my} L 300 120" stroke="var(--ink-2)" stroke-width="2" stroke-dasharray="6 5" class="flowpath" style="stroke:var(--ink-2)"/>`).join('')}
      <rect x="220" y="85" width="160" height="70" rx="6" fill="var(--consc)" opacity=".15" stroke="var(--consc)"/><text x="300" y="115" text-anchor="middle" style="font:800 14px var(--f-display);fill:var(--consc-ink)">ESCENARIO</text><text x="300" y="133" text-anchor="middle" class="svgmono">"aquí se hace consciente"</text>
      ${nest}<text x="300" y="290" text-anchor="middle" class="svgmono">audiencia interna${depth > 1 ? ' … ¿y quién mira a esta?' : ''}</text>`;
    el.querySelector('#extra').innerHTML = `<button class="btn sm" data-deeper>¿Y quién mira al que mira?</button>`;
    el.querySelector('#t').innerHTML = depth > 2 ? '<b>Regreso al infinito:</b> cada observador interno necesita otro que lo observe. El homúnculo no explica nada, solo aplaza el problema. Además, no hay un lugar ni un momento fijos donde todo "llegue".'
      : '<b>Teatro cartesiano:</b> toda la información llegaría a un escenario central donde una audiencia interna la haría consciente. Pulsa el botón para ver el problema.';
  }
  function draftsDraw() {
    el.querySelector('#extra').innerHTML = `<button class="btn sm" data-new>Nuevo estímulo</button>`;
    const D = Array.from({ length: 7 }, (_, i) => ({ y: 40 + i * 34, grow: rand(.3, 1.2), fame: false, v: 0 }));
    const champ = Math.floor(rand(0, 7)); D[champ].grow = 2.2;
    const t0 = performance.now();
    const outs = [['informe', 70], ['memoria de trabajo', 150], ['decisión', 230]];
    const f = now => {
      const t = (now - t0) / 1000;
      D.forEach((d, i) => { d.v = i === champ ? clamp(t * .45, 0, 1) : clamp(Math.sin(Math.min(t * d.grow, Math.PI)) * .55 * d.grow / 1.2, 0, .6); d.fame = d.v > .85; });
      g.innerHTML = `<text x="40" y="22" class="ttl">borradores en paralelo</text><text x="470" y="22" class="ttl">sistemas de uso amplio</text>
        ${D.map((d, i) => `<rect x="40" y="${d.y}" width="300" height="20" rx="10" fill="var(--paper-2)"/><rect x="40" y="${d.y}" width="${300 * d.v}" height="20" rx="10" fill="var(--consc)" opacity="${.35 + d.v * .65}"/><text x="48" y="${d.y + 14}" style="font:600 10px var(--f-mono);fill:${d.v > .3 ? '#fff' : 'var(--muted)'}">versión ${i + 1}${d.fame ? ' · ¡FAMA!' : ''}</text>`).join('')}
        ${outs.map(([n, y]) => `<rect x="430" y="${y}" width="150" height="40" rx="10" fill="${D[champ].fame ? 'var(--consc)' : 'var(--paper-2)'}" stroke="var(--line-2)"/><text x="505" y="${y + 25}" text-anchor="middle" style="font:700 12px var(--f-body);fill:${D[champ].fame ? '#fff' : 'var(--ink)'}">${n}</text>${D[champ].fame ? `<path d="M${40 + 300} ${D[champ].y + 10} C 390 ${D[champ].y + 10}, 390 ${y + 20}, 430 ${y + 20}" stroke="var(--consc)" stroke-width="3" fill="none" class="flowpath" style="stroke:var(--consc)"/>` : ''}`).join('')}`;
      if (t < 3) raf = requestAnimationFrame(f);
    };
    cancelAnimationFrame(raf); raf = requestAnimationFrame(f);
    el.querySelector('#t').innerHTML = '<b>Versiones múltiples:</b> el cerebro elabora muchos borradores a la vez. No hay escenario: la mayoría se quedan locales y se desvanecen; uno gana <b>"fama en el cerebro"</b> y pasa a influir en el informe, la memoria de trabajo y las decisiones. Eso es lo que llamamos consciente.';
  }
  const draw = () => { el.querySelectorAll('[data-m]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.m === mode))); mode === 'teatro' ? teatroDraw() : draftsDraw(); };
  el.addEventListener('click', e => {
    const m = e.target.closest('[data-m]'); if (m) { mode = m.dataset.m; depth = 1; draw(); }
    if (e.target.closest('[data-deeper]')) { depth = depth >= 5 ? 1 : depth + 1; teatroDraw(); }
    if (e.target.closest('[data-new]')) draftsDraw();
  });
  draw();
  return () => cancelAnimationFrame(raf);
}

// ============================================================ NÚCLEO REENTRANTE
export function reentrante(el) {
  let I = .3, D = .7, raf = null;
  el.innerHTML = `<div class="viz-body">
    <div class="ctrls">
      <div class="slider"><label for="ri">Reentrada / integración <output id="io"></output></label><input id="ri" type="range" min="0" max="1" step=".01" value=".3"><div class="ends"><span>Partes aisladas</span><span>Muy acopladas</span></div></div>
      <div class="slider"><label for="rd">Diferenciación <output id="dO"></output></label><input id="rd" type="range" min="0" max="1" step=".01" value=".7"><div class="ends"><span>Siempre el mismo patrón</span><span>Muchos estados</span></div></div></div>
    <div class="split" style="align-items:center"><svg viewBox="0 0 320 260" class="chart"><g id="net"></g></svg><svg viewBox="0 0 260 260" class="chart"><g id="q"></g></svg></div>
    <div class="results"><div class="insight" id="t"></div></div></div>`;
  const N = [['Color', 'occipitotemporal', 60, 60], ['Forma', 'áreas ventrales', 260, 60], ['Lugar', 'parietal', 60, 200], ['Tálamo', 'núcleo reticular', 260, 200]];
  const pairs = [[0, 1], [0, 2], [0, 3], [1, 2], [1, 3], [2, 3]];
  const t0 = performance.now();
  function frame(now) {
    const t = (now - t0) / 1000;
    const core = I > .6 && D > .6;
    const net = el.querySelector('#net');
    net.innerHTML = (core ? `<ellipse cx="160" cy="130" rx="150" ry="115" fill="var(--consc)" opacity="${.08 + .06 * Math.sin(t * 3)}"/>` : '') +
      pairs.map(([a, b], k) => {
        const A = N[a], B = N[b];
        const ph = (t * 0.8 + k * .17) % 1, ph2 = (t * 0.8 + k * .17 + .5) % 1;
        return `<line x1="${A[2]}" y1="${A[3]}" x2="${B[2]}" y2="${B[3]}" stroke="var(--consc)" stroke-width="${1 + I * 5}" opacity="${.15 + I * .7}"/>
          ${I > .15 ? `<circle cx="${A[2] + (B[2] - A[2]) * ph}" cy="${A[3] + (B[3] - A[3]) * ph}" r="4" fill="var(--consc)" opacity="${I}"/><circle cx="${B[2] + (A[2] - B[2]) * ph2}" cy="${B[3] + (A[3] - B[3]) * ph2}" r="4" fill="var(--consc-ink)" opacity="${I}"/>` : ''}`;
      }).join('') +
      N.map(([n, s, x, y], i) => {
        const hue = D > .05 ? (Math.sin(t * (1 + i * .7) * D * 2 + i) * .5 + .5) : .5;
        return `<circle cx="${x}" cy="${y}" r="30" fill="var(--card)" stroke="var(--consc)" stroke-width="2.5"/>
          <circle cx="${x}" cy="${y}" r="${10 + hue * 14 * D + 4}" fill="var(--consc)" opacity="${.25 + hue * .5}"/>
          <text x="${x}" y="${y + 4}" text-anchor="middle" style="font:800 11px var(--f-display);fill:var(--ink)">${n}</text><text x="${x}" y="${y + 46}" text-anchor="middle" class="svgmono" style="font-size:9px">${s}</text>`;
      }).join('');
    raf = requestAnimationFrame(frame);
  }
  function quad() {
    el.querySelector('#io').textContent = Math.round(I * 100) + '%'; el.querySelector('#dO').textContent = Math.round(D * 100) + '%';
    const X = v => 30 + v * 210, Y = v => 230 - v * 200;
    el.querySelector('#q').innerHTML = `<rect x="${X(.6)}" y="${Y(1)}" width="${X(1) - X(.6)}" height="${Y(.6) - Y(1)}" fill="var(--consc)" opacity=".15"/>
      <line x1="30" y1="230" x2="245" y2="230" class="axis"/><line x1="30" y1="25" x2="30" y2="230" class="axis"/>
      <text x="240" y="248" text-anchor="end">integración →</text><text x="34" y="22" class="ttl">diferenciación ↑</text>
      <text x="${X(.8)}" y="${Y(.8)}" text-anchor="middle" style="font:700 11px var(--f-body);fill:var(--consc-ink)">núcleo</text><text x="${X(.8)}" y="${Y(.8) + 14}" text-anchor="middle" style="font:700 11px var(--f-body);fill:var(--consc-ink)">dinámico</text>
      <circle cx="${X(I)}" cy="${Y(D)}" r="9" fill="var(--consc)" stroke="var(--card)" stroke-width="3"/>`;
    el.querySelector('#t').innerHTML = I > .6 && D > .6 ? '<b>¡Núcleo dinámico!</b> Las áreas se co-determinan por reentrada (integración) y el sistema puede adoptar muchos estados distintos (diferenciación). Según Edelman y Tononi, un contenido es consciente cuando entra en esta coalición talamocortical.'
      : I > .6 ? '<b>Mucha integración, poca diferenciación:</b> todo está muy acoplado, pero el sistema repite siempre el mismo patrón. Sin riqueza de estados no hay consciencia según la teoría.'
      : D > .6 ? '<b>Mucha diferenciación, poca integración:</b> cada área va por su lado. Si "partes" el sistema no se pierde nada: no hay un estado conjunto, así que tampoco hay núcleo.'
      : '<b>Poca integración y poca diferenciación.</b> Sube las dos para formar el núcleo.';
  }
  el.querySelector('#ri').addEventListener('input', e => { I = +e.target.value; quad(); });
  el.querySelector('#rd').addEventListener('input', e => { D = +e.target.value; quad(); });
  quad(); raf = requestAnimationFrame(frame);
  return () => cancelAnimationFrame(raf);
}

// ============================================================ GNW: IGNICIÓN
export function gnw(el) {
  let raf = null;
  el.innerHTML = `<div class="viz-body">
    <div class="ctrls">
      <div class="slider"><label for="gs">Fuerza / saliencia del estímulo <output id="gso"></output></label><input id="gs" type="range" min="0" max="1" step=".01" value=".55"></div>
      <div class="slider"><label for="ga">Atención dirigida al estímulo <output id="gao"></output></label><input id="ga" type="range" min="0" max="1" step=".01" value=".5"><div class="ends"><span>Ninguna</span><span>Toda</span></div></div></div>
    <div class="ctrls"><label class="chip" style="cursor:pointer"><input type="checkbox" id="busy" style="accent-color:var(--consc)"> El espacio ya está ocupado por otro contenido</label><button class="btn accent" data-go>▶ Presentar estímulo</button></div>
    <div class="split" style="align-items:center"><svg viewBox="0 0 340 260" class="chart"><g id="br"></g></svg><svg viewBox="0 0 300 260" class="chart"><g id="ch"></g></svg></div>
    <div class="results"><div class="insight" id="t">Ajusta los controles y presenta el estímulo.</div></div></div>`;
  const outs = [['Informe verbal', 250, 30], ['Decisión', 300, 100], ['Memoria de trabajo', 300, 170], ['Acción', 250, 235]];
  function scene(local, global, lit) {
    el.querySelector('#br').innerHTML = `
      <rect x="10" y="95" width="110" height="70" rx="12" fill="var(--consc)" opacity="${.1 + local * .6}" stroke="var(--consc)"/><text x="65" y="126" text-anchor="middle" style="font:700 12px var(--f-body);fill:var(--ink)">Área sensorial</text><text x="65" y="142" text-anchor="middle" class="svgmono" style="font-size:9px">procesamiento local</text>
      <circle cx="170" cy="130" r="${30 + global * 18}" fill="var(--consc)" opacity="${.08 + global * .5}"/><circle cx="170" cy="130" r="30" fill="var(--card)" stroke="var(--consc)" stroke-width="2"/>
      <text x="170" y="127" text-anchor="middle" style="font:800 11px var(--f-display);fill:var(--ink)">Espacio</text><text x="170" y="141" text-anchor="middle" style="font:800 11px var(--f-display);fill:var(--ink)">global</text>
      <path d="M120 130 L 140 130" stroke="var(--consc)" stroke-width="${1 + local * 4}"/>
      ${outs.map(([n, x, y]) => `<path d="M200 130 L ${x - 40} ${y}" stroke="var(--consc)" stroke-width="${lit ? 3 : 1}" opacity="${lit ? 1 : .25}" ${lit ? 'class="flowpath" style="stroke:var(--consc)"' : ''}/><rect x="${x - 40}" y="${y - 14}" width="${n.length * 6.4 + 12}" height="28" rx="8" fill="${lit ? 'var(--consc)' : 'var(--paper-2)'}"/><text x="${x - 34}" y="${y + 4}" style="font:700 11px var(--f-body);fill:${lit ? '#fff' : 'var(--muted)'}">${n}</text>`).join('')}`;
  }
  function chart(hl, hg, thr) {
    const X = i => 30 + i / 100 * 260, Y = v => 220 - v * 190;
    el.querySelector('#ch').innerHTML = `<line x1="30" y1="220" x2="290" y2="220" class="axis"/><line x1="30" y1="25" x2="30" y2="220" class="axis"/><text x="34" y="20" class="ttl">actividad</text><text x="290" y="238" text-anchor="end">tiempo →</text>
      <line x1="30" y1="${Y(thr)}" x2="290" y2="${Y(thr)}" stroke="var(--bad)" stroke-dasharray="5 4"/><text x="288" y="${Y(thr) - 5}" text-anchor="end" style="fill:var(--bad)">umbral de ignición</text>
      ${hl.length > 1 ? `<path d="M ${hl.map((v, i) => `${X(i)} ${Y(v)}`).join(' L ')}" fill="none" stroke="var(--ink-2)" stroke-width="2.5" stroke-dasharray="4 3"/>` : ''}
      ${hg.length > 1 ? `<path d="M ${hg.map((v, i) => `${X(i)} ${Y(v)}`).join(' L ')}" fill="none" stroke="var(--consc)" stroke-width="3.5"/>` : ''}
      <text x="40" y="44" style="fill:var(--ink-2)">– – local</text><text x="40" y="58" style="fill:var(--consc-ink)">—— global</text>`;
  }
  function go() {
    cancelAnimationFrame(raf);
    const s = +el.querySelector('#gs').value, att = +el.querySelector('#ga').value, busy = el.querySelector('#busy').checked;
    const thr = clamp(.75 - att * .35 + (busy ? .25 : 0), .2, .98);
    const hl = [], hg = []; let i = 0, ignited = false;
    const f = () => {
      const tt = i / 100;
      const local = tt < .15 ? 0 : s * (1 - Math.exp(-(tt - .15) * 10)) * (ignited ? 1 : Math.exp(-Math.max(0, tt - .5) * 2.5));
      if (!ignited && local > thr) ignited = true;
      const global = ignited ? clamp((hg[hg.length - 1] || 0) + .06, 0, .95) : local * .25;
      hl.push(local); hg.push(global);
      scene(local, global, ignited && global > .6); chart(hl, hg, thr);
      if (++i <= 100) raf = requestAnimationFrame(f);
      else el.querySelector('#t').innerHTML = ignited
        ? '<b>¡Ignición!</b> La actividad superó el umbral y se encendió una coalición de neuronas de <b>largo alcance</b> (prefrontal, parietal, cíngulo). El contenido se <b>difunde</b>: ahora puedes informar de él, decidir, mantenerlo en memoria de trabajo y actuar. <b>Acceso consciente.</b>'
        : `<b>Sin ignición:</b> el área sensorial procesó el estímulo, pero de forma <b>local</b>: no se comparte ni se puede reportar (procesamiento implícito, no consciente). ${busy ? 'El espacio estaba ocupado: es <b>competitivo y de capacidad limitada</b>.' : att < .3 ? 'Prueba a darle más atención: la atención <b>baja el umbral</b> (facilita, pero no garantiza).' : 'Prueba con un estímulo más fuerte o saliente.'}`;
    };
    f();
  }
  const labels = () => { el.querySelector('#gso').textContent = Math.round(+el.querySelector('#gs').value * 100) + '%'; el.querySelector('#gao').textContent = Math.round(+el.querySelector('#ga').value * 100) + '%'; };
  el.querySelectorAll('input').forEach(i => i.addEventListener('input', labels));
  el.addEventListener('click', e => { if (e.target.closest('[data-go]')) go(); });
  labels(); scene(0, 0, false); chart([], [], .57);
  return () => cancelAnimationFrame(raf);
}

// ============================================================ CNC: clasificador
export function cnc(el) {
  const ITEMS = [
    ['Estar despierta (vigilia)', 'previo'], ['Un nivel de arousal adecuado', 'previo'], ['Mecanismos ascendentes y talámicos que sostienen el estado', 'previo'],
    ['Bucles recurrentes en cortezas posteriores que forman el contenido', 'const'], ['Integrar color y forma en una sola representación', 'const'],
    ['Preparar el habla para informar de lo que ves', 'cons'], ['Fijar el contenido en la memoria', 'cons'],
  ];
  const BINS = { previo: ['Requisito previo', 'lo que "enciende" el sistema'], const: ['Constitutivo', 'lo que forma la experiencia (el CNC)'], cons: ['Consecuente', 'lo que permite usarla o reportarla'] };
  let items = shuffle(ITEMS.map(([t, b], i) => ({ i, t, b, done: false }))), sel = null, errors = 0;
  el.innerHTML = `<div class="viz-body"><div class="sorter-pool" id="pool"></div><div class="sorter-bins" id="bins"></div><div class="results"><div class="insight" id="t">Toca una tarjeta y después la caja donde crees que va.</div></div></div>`;
  function draw() {
    el.querySelector('#pool').innerHTML = items.filter(x => !x.done).map(x => `<button class="sort-item" data-i="${x.i}" aria-pressed="${sel === x.i}">${x.t}</button>`).join('') || '<span style="color:var(--muted)">¡Todo clasificado!</span>';
    el.querySelector('#bins').innerHTML = Object.entries(BINS).map(([k, [n, d]]) => `<button class="bin${sel != null ? ' armed' : ''}" data-b="${k}"><h5>${n}</h5><small>${d}</small>${items.filter(x => x.done && x.b === k).map(x => `<span class="sort-item ok">${x.t}</span>`).join('')}</button>`).join('');
  }
  el.addEventListener('click', e => {
    const it = e.target.closest('[data-i]'); if (it) { sel = +it.dataset.i; draw(); return; }
    const bin = e.target.closest('[data-b]'); if (bin && sel != null) {
      const x = items.find(y => y.i === sel);
      if (x.b === bin.dataset.b) { x.done = true; sel = null; draw(); if (items.every(y => y.done)) el.querySelector('#t').innerHTML = `<b>¡Completado${errors ? ` con ${errors} fallo${errors > 1 ? 's' : ''}` : ' sin fallos'}!</b> Distinguir previo, constitutivo y consecuente evita confundir lo que enciende el sistema con lo que forma la experiencia o con lo que permite reportarla.`; }
      else { errors++; const b = el.querySelector(`[data-i="${sel}"]`); b?.classList.add('bad'); setTimeout(() => b?.classList.remove('bad'), 400); el.querySelector('#t').innerHTML = `No va ahí. Pista: ${x.b === 'previo' ? 'esto es una condición <b>antes</b> de que haya experiencia.' : x.b === 'const' ? 'esto <b>es</b> la experiencia formándose.' : 'esto ocurre <b>después</b>, para usar o reportar el contenido.'}`; }
    }
  });
  draw();
}
