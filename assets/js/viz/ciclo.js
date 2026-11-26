// Interactivos de Ciclo vital (Tema 5: adultez media)
// Solo tokens CSS; todo con <button>/<input> para que funcione con toque y teclado.
import { esc, shuffle, clamp } from '../util.js';

const seg = (opts, cur, attr = 'data-k') => `<div class="seg" role="group">${opts.map(([k, l]) => `<button type="button" ${attr}="${k}" aria-pressed="${k === cur}">${l}</button>`).join('')}</div>`;
const press = (el, attr, k) => el.querySelectorAll(`[${attr}]`).forEach(b => b.setAttribute('aria-pressed', String(b.getAttribute(attr) === k)));
const nota = t => `<p style="font-size:.8rem;color:var(--muted);margin:10px 0 0">${t}</p>`;

// ------------------------------------------------------------ ¿Cuándo es la edad media?
export function rangos(el) {
  const R = {
    def: { l: 'Definición', d: [40, 65], c: 'var(--base)', t: '<b>40–65 años</b>: la definición cronológica de adultez media. Es <b>arbitraria</b>: no hay hechos biológicos o sociales que marquen sus límites.' },
    boom: { l: 'Baby boomers', d: [35, 54], c: 'var(--fisico)', t: 'En el año 2000, los <b>baby boomers</b> (nacidos en 1946–1964) tenían <b>35–54 años</b> y eran el <b>30 %</b> de la población de EE. UU. Han cambiado la imagen de la mitad de la vida.' },
    midus: { l: 'MIDUS', d: [25, 75], c: 'var(--salud)', t: 'El <b>MIDUS</b> estudió a 7 189 adultos de <b>25 a 75 años</b>: así puede comparar la mitad de la vida con lo que va antes y después.' },
    subj: { l: 'Límite subjetivo', d: [70, 79], c: 'var(--repro)', t: 'Con la salud y la longevidad, el <b>límite superior subjetivo sube</b>: un tercio de los estadounidenses en sus <b>setenta</b> se consideran de edad media.' },
  };
  let sel = 'def';
  el.innerHTML = `<div class="viz-body">${seg(Object.entries(R).map(([k, v]) => [k, v.l]), sel)}
    <svg viewBox="0 0 600 170" class="chart" role="img" aria-label="Franjas de edad"><g id="g"></g></svg>
    <div class="results"><div class="insight" id="t"></div></div></div>`;
  const X = a => 30 + (a - 20) / 65 * 540;
  const draw = () => {
    const rows = Object.entries(R).map(([k, v], i) => {
      const y = 22 + i * 30, on = k === sel;
      return `<rect x="${X(v.d[0])}" y="${y}" width="${X(v.d[1]) - X(v.d[0])}" height="20" rx="6" fill="${v.c}" opacity="${on ? 1 : .22}"/>
        <text x="${X(v.d[0]) + 8}" y="${y + 14}" style="fill:${on ? '#fff' : 'var(--ink-2)'};font:700 12px var(--f-body)">${v.l}</text>`;
    }).join('');
    const ticks = [20, 30, 40, 50, 60, 70, 80].map(a => `<line x1="${X(a)}" y1="14" x2="${X(a)}" y2="146" class="gridl"/><text x="${X(a)}" y="162" text-anchor="middle">${a}</text>`).join('');
    el.querySelector('#g').innerHTML = ticks + rows;
    el.querySelector('#t').innerHTML = R[sel].t;
  };
  el.addEventListener('click', e => { const b = e.target.closest('[data-k]'); if (b) { sel = b.dataset.k; press(el, 'data-k', sel); draw(); } });
  draw();
}

// ------------------------------------------------------------ Reloj del cuerpo
const RELOJ = [
  { g: 'sentidos', n: 'Vista de cerca', ev: [[40, 'Empieza a notarse la <b>presbicia</b>: cuesta enfocar de cerca y hace falta ~<b>1/3 más de luz</b>.'], [60, 'La presbicia está <b>prácticamente completa</b>.']] },
  { g: 'sentidos', n: 'Oído', ev: [[50, 'La <b>presbiacusia</b> (agudos) se hace evidente y se acelera después de los 55; el <b>doble de rápida en hombres</b>.']] },
  { g: 'sentidos', n: 'Gusto y olfato', ev: [[40, 'Empiezan a perder sensibilidad (papilas, células olfativas): la comida sabe más sosa. Las mujeres los conservan mejor.']] },
  { g: 'sentidos', n: 'Fuerza', ev: [[30, 'Ya en declive gradual desde el máximo de los veinte.'], [45, 'Se nota <b>alguna pérdida de fuerza</b> muscular.'], [60, 'Se ha perdido el <b>10–15 %</b> de la fuerza máxima (fibras → grasa).']] },
  { g: 'sentidos', n: 'Destreza manual', ev: [[35, 'Suele empezar a <b>deteriorarse</b>.']] },
  { g: 'sentidos', n: 'Metabolismo basal', ev: [[40, 'Disminuye la energía necesaria en reposo: <b>más fácil ganar peso</b> y se pierde resistencia.']] },
  { g: 'sentidos', n: 'Tiempo de reacción', ev: [[30, 'El TR <b>simple</b> apenas cambia; el de <b>elección</b> se enlentece poco a poco.'], [50, 'Acaba el periodo en que el TR simple apenas cambiaba; el de elección sigue enlenteciéndose.']] },
  { g: 'cuerpo', n: 'Huesos', ev: [[30, 'La densidad ósea ya pasó su <b>máximo</b> (20–30): se absorbe más calcio del que se repone.'], [50, 'La pérdida ósea se <b>acelera</b> (50–60), el <b>doble de rápida en mujeres</b>.']] },
  { g: 'cuerpo', n: 'Piel y pelo', ev: [[40, 'Quinta o sexta década: la piel pierde tersura (colágeno, elastina); el pelo se adelgaza y encanece (melanina).']] },
  { g: 'cuerpo', n: 'Pulmones', ev: [[40, 'Empieza a bajar la <b>capacidad vital</b>.'], [70, 'Se ha perdido hasta el <b>40 %</b> de la capacidad vital.']] },
  { g: 'cuerpo', n: 'Corazón', ev: [[48, 'Finales de los 40: las <b>enfermedades cardiacas</b> se vuelven comunes.'], [55, 'Mediados de los 50: en algunas personas bombea <b>más lento e irregular</b>; arterias más rígidas.'], [65, 'Puede haberse perdido hasta el <b>40 %</b> de la potencia aeróbica.']] },
  { g: 'cuerpo', n: 'Hormonas', ev: [[30, 'Hombres: la testosterona baja ~<b>1 % al año</b>.'], [35, 'Mujeres: puede empezar la <b>transición menopáusica</b> (35–45; dura 3–5 años).'], [50, 'Edad media de la <b>menopausia</b>: 50–52 (la mayoría, 45–55).']] },
];
export function relojEdad(el, props = {}) {
  const items = RELOJ.filter(r => !props.grupo || props.grupo === 'todo' || r.g === props.grupo);
  const A0 = 30, A1 = 75;
  el.innerHTML = `<div class="viz-body">
    <div class="ctrls"><div class="slider"><label for="age">Edad <output id="ao"></output></label><input id="age" type="range" min="${A0}" max="${A1}" value="45"><div class="ends"><span>${A0}</span><span>${A1}</span></div></div></div>
    <div id="rows" style="display:grid;gap:10px"></div>
    ${nota('Las marcas son aproximadas: las edades exactas están en el texto (p. ej., «a la mitad de la vida» se ha colocado en los 40; «desde los veinte», al inicio). La línea vertical es la edad elegida. Recuerda: hay grandes diferencias individuales y el estilo de vida adelanta o retrasa los cambios.')}</div>`;
  const pct = a => (a - A0) / (A1 - A0) * 100;
  const draw = () => {
    const age = +el.querySelector('#age').value;
    el.querySelector('#ao').textContent = age + ' años';
    el.querySelector('#rows').innerHTML = items.map(r => {
      const past = r.ev.filter(([a]) => a <= age), cur = past[past.length - 1];
      return `<div style="display:grid;gap:4px">
        <div style="display:flex;justify-content:space-between;gap:8px;font-weight:700;font-size:.9rem"><span>${r.n}</span><span style="color:${cur ? 'var(--accent-ink)' : 'var(--muted)'};font:600 .72rem var(--f-mono)">${cur ? 'desde los ' + cur[0] : 'sin cambios marcados'}</span></div>
        <div style="position:relative;height:10px;border-radius:99px;background:var(--paper-3);overflow:hidden" aria-hidden="true">
          <div style="position:absolute;inset:0 auto 0 0;width:${pct(age)}%;background:var(--accent-tint)"></div>
          ${r.ev.map(([a]) => `<span style="position:absolute;left:calc(${pct(a)}% - 5px);top:0;width:10px;height:10px;border-radius:50%;background:${a <= age ? 'var(--accent)' : 'var(--line-2)'}"></span>`).join('')}
          <span style="position:absolute;left:${pct(age)}%;top:0;bottom:0;width:2px;background:var(--ink)"></span>
        </div>
        <div style="font-size:.86rem;color:var(--ink-2);min-height:1.2em">${cur ? cur[1] : '—'}</div></div>`;
    }).join('');
  };
  el.querySelector('#age').addEventListener('input', draw);
  draw();
}

// ------------------------------------------------------------ Simulador de sentidos
export function sentidos(el) {
  let modo = 'vista', ctx = null, hombre = false, gafas = false, perfil = { salado: 1, dulce: 1, amargo: 1, acido: 1 };
  el.innerHTML = `<div class="viz-body">${seg([['vista', '👓 Vista'], ['oido', '👂 Oído'], ['gusto', '👅 Gusto']], modo)}<div id="p" style="margin-top:14px"></div></div>`;
  let P = el.querySelector('#p');
  const vista = () => {
    P.innerHTML = `<div class="ctrls"><div class="slider"><label for="ve">Edad <output id="veo"></output></label><input id="ve" type="range" min="35" max="65" value="50"><div class="ends"><span>35</span><span>65</span></div></div>
      <div class="slider"><label for="vl">Luz <output id="vlo"></output></label><input id="vl" type="range" min="0" max="100" value="30"><div class="ends"><span>Penumbra</span><span>Luz brillante</span></div></div>
      <button type="button" class="btn sm" id="vg" aria-pressed="${gafas}">Gafas de lectura</button></div>
      <div style="margin-top:14px;padding:16px;border-radius:12px;border:1px solid var(--line);background:var(--card)"><p id="vt" style="margin:0;font-size:.95rem;line-height:1.5">Prospecto: tomar un comprimido cada ocho horas con un vaso de agua. No superar la dosis indicada. Conservar en lugar fresco y seco, fuera del alcance de los niños.</p></div>
      <div class="results"><div class="insight" id="vi"></div></div>${nota('Simulación ilustrativa: el desenfoque no corresponde a una medida real.')}`;
    const upd = () => {
      const e = +P.querySelector('#ve').value, l = +P.querySelector('#vl').value / 100;
      P.querySelector('#veo').textContent = e + ' años'; P.querySelector('#vlo').textContent = Math.round(l * 100) + '%';
      const presb = clamp((e - 40) / 20, 0, 1);
      const blur = gafas ? 0 : presb * 3.2 * (1 - l * .45);
      const vt = P.querySelector('#vt'); vt.style.filter = `blur(${blur.toFixed(2)}px)`; vt.style.opacity = String(.45 + .55 * Math.max(l, .2) + (e < 40 ? .3 : 0));
      P.querySelector('#vg').setAttribute('aria-pressed', String(gafas));
      P.querySelector('#vi').innerHTML = gafas ? 'Con <b>gafas de lectura</b> (o bifocales/trifocales) el ojo vuelve a enfocar de cerca.'
        : e < 41 ? 'Antes de la edad media los cambios son casi imperceptibles.'
        : e >= 60 ? 'Hacia los <b>60</b> la presbicia está prácticamente completa: sin gafas, el texto cercano no se enfoca.'
        : `<b>Presbicia</b> en marcha: el cristalino pierde elasticidad. ${l < .6 ? 'Sube la luz: desde los 40 hace falta ~<b>un tercio más</b> de luminosidad.' : 'Con luz brillante se compensa algo la luz que no llega a la retina.'}`;
    };
    P.querySelector('#ve').addEventListener('input', upd); P.querySelector('#vl').addEventListener('input', upd);
    P.querySelector('#vg').addEventListener('click', () => { gafas = !gafas; upd(); });
    upd();
  };
  const BANDAS = ['muy grave', 'grave', 'medio', 'medio-agudo', 'agudo', 'muy agudo'];
  const FREQ = [250, 500, 1000, 2000, 4000, 8000];
  const oido = () => {
    P.innerHTML = `<div class="ctrls"><div class="slider"><label for="oe">Edad <output id="oeo"></output></label><input id="oe" type="range" min="35" max="70" value="55"><div class="ends"><span>35</span><span>70</span></div></div>
      ${seg([['m', 'Mujer'], ['h', 'Hombre']], hombre ? 'h' : 'm', 'data-sx')}</div>
      <div id="ob" style="display:grid;grid-template-columns:repeat(6,1fr);gap:6px;align-items:end;height:150px;margin-top:14px"></div>
      <div style="display:grid;grid-template-columns:repeat(6,1fr);gap:6px;margin-top:6px">${BANDAS.map((b, i) => `<button type="button" class="btn sm" data-f="${i}" style="padding:0 2px;font-size:.7rem;min-height:40px">${b}<br>▶</button>`).join('')}</div>
      <div class="results"><div class="insight" id="oi"></div></div>${nota('Barras ilustrativas de cuánto se oye cada tono. Pulsa ▶ para escuchar (volumen bajo); el tono suena más flojo cuanto más se haya perdido.')}`;
    const loss = (e, i) => { const k = clamp((e - 45) / 25, 0, 1) * (hombre ? 1 : .5); return clamp(1 - k * Math.max(0, i - 2) * .32, .05, 1); };
    const upd = () => {
      const e = +P.querySelector('#oe').value; P.querySelector('#oeo').textContent = e + ' años';
      P.querySelector('#ob').innerHTML = BANDAS.map((b, i) => `<div style="height:${loss(e, i) * 100}%;border-radius:8px 8px 3px 3px;background:${i > 2 ? 'var(--accent)' : 'var(--line-2)'};transition:height .3s" title="${b}"></div>`).join('');
      P.querySelector('#oi').innerHTML = e < 50 ? 'La pérdida es <b>apenas perceptible</b> todavía.' : `La <b>presbiacusia</b> afecta sobre todo a los <b>agudos</b>, más altos que los sonidos del habla: por eso molesta menos de lo que podría. ${hombre ? 'En los <b>hombres</b> avanza el <b>doble de rápido</b>.' : 'Cambia a "Hombre": la pérdida es el doble de rápida.'} Parte de la sordera de los 45–64 es <b>prevenible</b> (ruido: protectores).`;
    };
    P.querySelector('#oe').addEventListener('input', upd);
    P.addEventListener('click', e => {
      const sx = e.target.closest('[data-sx]'); if (sx) { hombre = sx.dataset.sx === 'h'; press(P, 'data-sx', sx.dataset.sx); upd(); return; }
      const f = e.target.closest('[data-f]'); if (!f) return;
      try {
        ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
        const i = +f.dataset.f, o = ctx.createOscillator(), g = ctx.createGain(), t = ctx.currentTime;
        o.frequency.value = FREQ[i]; o.connect(g); g.connect(ctx.destination);
        const v = .06 * loss(+P.querySelector('#oe').value, i) ** 2;
        g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(v, t + .05); g.gain.linearRampToValueAtTime(0, t + .7);
        o.start(t); o.stop(t + .75);
      } catch { /* sin audio */ }
    });
    upd();
  };
  const SAB = [['salado', 'Salado'], ['dulce', 'Dulce'], ['amargo', 'Amargo'], ['acido', 'Ácido']];
  const gusto = () => {
    P.innerHTML = `<div class="ctrls"><button type="button" class="btn sm accent" id="gn">🎲 Otra persona de 55 años</button><button type="button" class="btn sm" id="gr">Persona de 30 años</button></div>
      <div id="gb" style="display:grid;gap:8px;margin-top:14px"></div><div class="results"><div class="insight" id="gi"></div></div>${nota('Perfiles inventados para ilustrar las diferencias individuales; no son datos.')}`;
    const upd = (msg) => {
      P.querySelector('#gb').innerHTML = SAB.map(([k, l]) => `<div style="display:grid;grid-template-columns:70px 1fr;gap:8px;align-items:center;font-weight:700;font-size:.88rem"><span>${l}</span><div style="height:16px;border-radius:99px;background:var(--paper-3)"><div style="height:100%;width:${perfil[k] * 100}%;border-radius:99px;background:var(--accent);transition:width .3s"></div></div></div>`).join('');
      P.querySelector('#gi').innerHTML = msg;
    };
    P.querySelector('#gn').addEventListener('click', () => { SAB.forEach(([k]) => { perfil[k] = .35 + Math.random() * .6; }); upd('Desde la mitad de la vida las papilas pierden sensibilidad y hay menos células olfativas. Pero <b>cada persona pierde distinto</b>: una, lo salado; otra, lo dulce, amargo o ácido. Pulsa otra vez para ver otra persona.'); });
    P.querySelector('#gr').addEventListener('click', () => { SAB.forEach(([k]) => { perfil[k] = 1; }); upd('Antes de la mitad de la vida, la sensibilidad se mantiene. Las <b>mujeres</b> conservan el gusto y el olfato más que los hombres.'); });
    upd('Pulsa "Otra persona de 55 años" para ver cómo cambian los perfiles.');
  };
  const show = () => { const n = P.cloneNode(false); P.replaceWith(n); P = n; ({ vista, oido, gusto })[modo](); };
  el.addEventListener('click', e => { const b = e.target.closest('[data-k]'); if (b && !b.closest('#p')) { modo = b.dataset.k; press(el, 'data-k', modo); show(); } });
  show();
  return () => { try { ctx?.close(); } catch { /* nada */ } };
}

// ------------------------------------------------------------ Mielina y velocidad
export function mielina(el) {
  let raf = 0;
  el.innerHTML = `<div class="viz-body">
    <div class="ctrls"><div class="slider"><label for="md">Deterioro de la mielina <output id="mdo"></output></label><input id="md" type="range" min="0" max="100" value="60"><div class="ends"><span>Intacta</span><span>Muy deteriorada</span></div></div>
      <button type="button" class="btn accent" id="mg">⚡ Lanzar impulso</button></div>
    <svg viewBox="0 0 600 200" class="chart" role="img" aria-label="Dos axones con distinta mielina"><g id="g"></g></svg>
    <div class="results"><div class="insight" id="mi">Lanza un impulso y compara cuál llega antes.</div></div>
    ${nota('Esquema ilustrativo: la velocidad no está a escala.')}</div>`;
  const g = el.querySelector('#g');
  const axon = (y, d, p, label) => {
    const segs = []; for (let i = 0; i < 9; i++) { const x = 70 + i * 54; const gone = (i * 37 % 100) < d; segs.push(`<rect x="${x}" y="${y - 12}" width="44" height="24" rx="12" fill="var(--accent)" opacity="${gone ? .12 : .8}"/>`); }
    const x = 70 + p * 480;
    return `<text x="20" y="${y - 22}" class="ttl">${label}</text><line x1="60" y1="${y}" x2="560" y2="${y}" stroke="var(--ink-2)" stroke-width="3"/>${segs.join('')}
      <circle cx="${x}" cy="${y}" r="9" fill="var(--alerta)" stroke="var(--card)" stroke-width="2.5" opacity="${p > 0 ? 1 : 0}"/><text x="575" y="${y + 4}" style="font-size:16px">🎯</text>`;
  };
  const draw = (pa = 0, pb = 0) => {
    const d = +el.querySelector('#md').value;
    el.querySelector('#mdo').textContent = d + '%';
    g.innerHTML = axon(60, 0, pa, 'Mielina intacta') + axon(150, d, pb, 'Mielina deteriorada');
  };
  el.querySelector('#md').addEventListener('input', () => draw());
  el.querySelector('#mg').addEventListener('click', () => {
    cancelAnimationFrame(raf);
    const d = +el.querySelector('#md').value / 100, t0 = performance.now(), vA = 1 / 900, vB = vA / (1 + d * 1.6);
    const step = now => {
      const t = now - t0, pa = Math.min(1, t * vA), pb = Math.min(1, t * vB);
      draw(pa, pb);
      if (pb < 1) raf = requestAnimationFrame(step);
      else el.querySelector('#mi').innerHTML = d < .1 ? 'Con la mielina intacta, los dos impulsos llegan casi a la vez.' : 'Con la mielina deteriorada el impulso <b>tarda más</b> en llegar: así se explica en parte que la <b>velocidad de procesamiento</b> sea más lenta con la edad (Bartzokis et al., 2008).';
    };
    raf = requestAnimationFrame(step);
  });
  draw();
  return () => cancelAnimationFrame(raf);
}

// ------------------------------------------------------------ Transición menopáusica
export function menopausia(el) {
  const F = {
    inicio: { l: 'Inicio transición', a: [35, 45], t: '<b>Empieza la transición menopáusica</b> (con la perimenopausia), por lo general entre los <b>35 y los 45 años</b>. Puede durar de <b>3 a 5 años</b>.' },
    peri: { l: 'Perimenopausia', a: [42, 51], t: '<b>Perimenopausia o climaterio</b>: baja la producción de óvulos maduros y los ovarios fabrican menos <b>estrógeno</b>. La regla se vuelve <b>irregular</b>, con menos flujo y más tiempo entre periodos. Aparecen síntomas como los <b>bochornos</b>.' },
    ultima: { l: 'Última regla', a: [50, 50], t: '<b>Último periodo menstrual</b>. Todavía no se puede decir que haya llegado la menopausia: hay que esperar un año.' },
    meno: { l: 'Menopausia', a: [51, 51], t: '<b>Menopausia</b>: un año sin regla. Media <b>50–52 años</b>; la mayoría entre los <b>45 y 55</b>. La perimenopausia incluye este primer año tras la última regla.' },
    post: { l: 'Después', a: [51, 60], t: '<b>Posmenopausia</b>: la pérdida ósea se acelera los primeros <b>5–10 años</b> (riesgo de osteoporosis), y aumentan los riesgos de cáncer de mama y enfermedad cardiaca.' },
  };
  let sel = 'peri';
  el.innerHTML = `<div class="viz-body">${seg(Object.entries(F).map(([k, v]) => [k, v.l]), sel)}
    <svg viewBox="0 0 600 190" class="chart" role="img" aria-label="Línea temporal de la transición menopáusica"><g id="g"></g></svg>
    <div class="results"><div class="insight" id="t"></div></div>
    ${nota('Ejemplo de una mujer con la última regla a los 50. La curva de estrógeno es un esquema, no un dato.')}</div>`;
  const X = a => 40 + (a - 32) / 30 * 520;
  const draw = () => {
    const est = []; for (let a = 32; a <= 62; a += .5) { const v = a < 42 ? 1 : a < 52 ? 1 - (a - 42) / 10 * .75 + Math.sin(a * 3) * .06 : .25 - (a - 52) * .005; est.push(`${X(a)} ${140 - v * 90}`); }
    const f = F[sel];
    el.querySelector('#g').innerHTML = `
      <rect x="${X(45)}" y="22" width="${X(55) - X(45)}" height="126" fill="var(--repro)" opacity=".07"/><text x="${X(50)}" y="16" text-anchor="middle">rango habitual 45–55</text>
      ${[35, 40, 45, 50, 55, 60].map(a => `<text x="${X(a)}" y="172" text-anchor="middle">${a}</text>`).join('')}
      <line x1="40" y1="150" x2="560" y2="150" class="axis"/>
      <path d="M ${est.join(' L ')}" fill="none" stroke="var(--repro)" stroke-width="3" opacity=".55"/><text x="${X(33)}" y="42" class="ttl" style="fill:var(--repro-ink)">estrógeno</text>
      ${f.a[0] === f.a[1] ? `<line x1="${X(f.a[0])}" y1="24" x2="${X(f.a[0])}" y2="150" stroke="var(--ink)" stroke-width="3"/><circle cx="${X(f.a[0])}" cy="150" r="7" fill="var(--ink)"/>`
        : `<rect x="${X(f.a[0])}" y="128" width="${X(f.a[1]) - X(f.a[0])}" height="22" rx="6" fill="var(--ink)" opacity=".85"/>`}
      <line x1="${X(50)}" y1="150" x2="${X(51)}" y2="150" stroke="var(--repro)" stroke-width="6"/><text x="${X(50.5)}" y="186" text-anchor="middle" style="fill:var(--repro-ink);font-weight:700">+1 año</text>`;
    el.querySelector('#t').innerHTML = f.t;
  };
  el.addEventListener('click', e => { const b = e.target.closest('[data-k]'); if (b) { sel = b.dataset.k; press(el, 'data-k', sel); draw(); } });
  draw();
}

// ------------------------------------------------------------ Barras con datos del tema
const BARRAS = {
  lock: { u: '%', fuente: 'Lock, 1994', sets: [
    { l: 'Últimas 2 semanas', b: [['Japón', 10, 'menos del'], ['Canadá', 40, 'casi el'], ['EE. UU.', 35]], t: 'Entre mujeres con la regla ya irregular, <b>menos del 10 %</b> de las japonesas refería bochornos en las dos semanas previas, frente a casi el 40 % de las canadienses y el 35 % de las estadounidenses.' },
    { l: 'Alguna vez', b: [['Japón', 20, 'menos del'], ['Canadá', 65]], t: 'Menos del <b>20 %</b> de las japonesas había tenido bochornos alguna vez, frente al <b>65 %</b> de las canadienses. Y la mayoría de las japonesas que los tuvo apenas sintió molestias.' },
    { l: 'Sudoración nocturna', b: [['Japón', 3]], t: 'Solo el <b>3 %</b> de las japonesas refirió sudoración nocturna. En Japón no hay una palabra específica para "bochorno" y la menopausia no se ve como condición médica.' },
  ] },
  de: { u: '%', fuente: 'Feldman et al., 1994; Goldstein et al., 1998', sets: [
    { l: 'Por edad', b: [['40 años', 39], ['70 años', 67]], t: 'Se calcula que el <b>39 %</b> de los hombres de 40 años y el <b>67 %</b> de los de 70 sufren disfunción eréctil, al menos ocasional.' },
  ] },
  midusSexo: { u: '%', fuente: 'Rossi, 2004 (MIDUS)', sets: [
    { l: 'Sexo 1 vez/semana o más', b: [['Premenopáusicas', 61], ['Posmenopáusicas', 41]], t: 'La diferencia <b>no se relacionó con la menopausia</b>, sino con la <b>edad</b> y la <b>condición física</b>.' },
  ] },
  limitaciones: { u: '%', fuente: 'NCHS, 2006; Holmes et al., 2009', sets: [
    { l: 'Por enfermedad crónica', b: [['45–54', 12.5], ['55–64', 20]], t: 'Limitan sus actividades por condiciones crónicas (sobre todo <b>artritis y trastornos circulatorios</b>): aumenta con la edad.' },
    { l: 'Limitaciones físicas', b: [['50–59', 16, 'alrededor del'], ['final de los 60', 23, 'casi el']], t: 'Las limitaciones físicas crecen con la edad, con un efecto más marcado en <b>afroamericanos y mujeres</b>.' },
  ] },
  peso: { u: '%', fuente: 'Flegal et al., 2010', sets: [
    { l: 'Sobrepeso', b: [['Hispanos', 84.2], ['Negros no hispanos', 76], ['Blancos no hispanos', 70.8]], t: 'En <b>sobrepeso</b>, la prevalencia más alta es la de los <b>hispanos</b>.' },
    { l: 'Obesidad', b: [['Negros no hispanos', 52.9], ['Hispanos', 42], ['Blancos no hispanos', 34.9]], t: 'En <b>obesidad</b>, la más alta es la de los <b>negros no hispanos</b>; el riesgo es menor en blancos no hispanos.' },
  ] },
  brecha: { u: ' años', max: 10, fuente: 'Kung et al., 2007; NCHS, 2004', sets: [
    { l: 'Ventaja de las mujeres', b: [['1970', 7.6], ['2005', 5.2]], t: 'La brecha se estrecha, sobre todo porque <b>aumentan los ataques cardiacos en mujeres</b> (más obesidad y diabetes, y menos control médico del riesgo en ellas).' },
  ] },
  estres: { u: '%', fuente: 'American Psychological Association, 2007', sets: [
    { l: 'Por edad', b: [['18–34', 29], ['35–54', 39], ['55 o más', 25]], t: 'El comienzo de la edad media (<b>35–54</b>) es el grupo con más estrés agudo: el 39 % lo siente alrededor del 25 % de su tiempo.' },
    { l: 'Por sexo', b: [['Mujeres', 35], ['Hombres', 28]], t: 'Las <b>mujeres</b> refieren estrés más extremo y se preocupan más por él.' },
  ] },
};
export function barras(el, props = {}) {
  const D = BARRAS[props.set] || BARRAS.estres;
  let i = 0;
  const max = D.max || 100;
  el.innerHTML = `<div class="viz-body">${D.sets.length > 1 ? seg(D.sets.map((s, k) => [k, s.l]), 0) : ''}
    <div id="b" style="display:grid;gap:10px;margin-top:${D.sets.length > 1 ? 14 : 0}px"></div>
    <div class="results"><div class="insight" id="t"></div></div>${nota('Fuente: ' + esc(D.fuente) + '.')}</div>`;
  const fmt = v => String(v).replace('.', ',') + D.u;
  const draw = () => {
    const s = D.sets[i], top = Math.max(...s.b.map(x => x[1]));
    el.querySelector('#b').innerHTML = s.b.map(([l, v, pre]) => `<div style="display:grid;gap:3px">
      <div style="display:flex;justify-content:space-between;gap:8px;font-size:.88rem;font-weight:700"><span>${esc(l)}</span><span style="font-family:var(--f-mono)">${pre ? esc(pre) + ' ' : ''}${fmt(v)}</span></div>
      <div style="height:22px;border-radius:7px;background:var(--paper-3);overflow:hidden"><div style="height:100%;width:${v / max * 100}%;background:var(--accent);opacity:${v === top ? 1 : .55};border-radius:7px;transition:width .4s var(--ease)"></div></div></div>`).join('');
    el.querySelector('#t').innerHTML = s.t;
  };
  el.addEventListener('click', e => { const b = e.target.closest('[data-k]'); if (b) { i = +b.dataset.k; press(el, 'data-k', b.dataset.k); draw(); } });
  draw();
}

// ------------------------------------------------------------ Clasificar (juego)
const CLASIF = {
  sintomas: { cats: ['Pruebas sólidas: lo causa la transición', 'Hace falta más investigación'], items: [
    ['Bochornos', 0, 'Hay pruebas sólidas: cambios hormonales erráticos afectan a los centros cerebrales de control de la temperatura.'],
    ['Sudoración nocturna', 0, 'Va con los bochornos: pruebas sólidas de que la causa la transición.'],
    ['Irritabilidad', 1, 'Las alteraciones del ánimo requieren más investigación para entender su relación con la menopausia.'],
    ['Depresión', 1, 'Igual que el resto de alteraciones del ánimo: relación no aclarada.'],
    ['Nerviosismo y tensión', 1, 'Alteraciones del ánimo: hace falta más investigación. Algunos supuestos síntomas podrían deberse a otros cambios del envejecimiento.'],
  ] },
  diabetes: { cats: ['Tipo 1 (juvenil)', 'Tipo 2 (madurez)'], items: [
    ['El cuerpo no produce suficiente insulina', 0, 'Así es la diabetes juvenil o insulinodependiente.'],
    ['Insulinodependiente', 0, 'Es el otro nombre de la tipo 1.'],
    ['Las células pierden la capacidad de aprovechar la insulina', 1, 'Es el mecanismo de la diabetes de inicio en la madurez.'],
    ['El cuerpo acaba produciendo demasiada insulina', 1, 'Intenta compensar que las células no la aprovechan.'],
    ['Aparece después de los 30 y aumenta con la edad', 1, 'Es la de inicio en la madurez.'],
    ['Es el tipo más común', 1, 'La tipo 2 es la más frecuente.'],
  ] },
  social: { cats: ['Protege la salud', 'Pone en riesgo la salud'], items: [
    ['Calidad de las relaciones sociales', 0, 'Influencia protectora incluso en posición socioeconómica baja.'],
    ['Religiosidad desde la niñez', 0, 'Otra influencia protectora (Ryff et al., 2004).'],
    ['Sentido de control sobre lo que te pasa', 0, 'Más habitual en posición alta: estilos de vida más sanos.'],
    ['Entornos más tensos', 1, 'Parte de la explicación psicosocial de la peor salud en posición baja.'],
    ['Emociones e ideas negativas', 1, 'Más frecuentes en posición baja (Gallo y Matthews, 2003).'],
    ['Soledad en la adultez media', 1, 'Predice descensos en la actividad física.'],
    ['No tener seguro médico', 1, 'Ligado a la pobreza: menos acceso a la atención y a la prevención.'],
  ] },
  emociones: { cats: ['Mejor salud', 'Peor salud'], items: [
    ['Esperanza', 0, 'Emoción positiva: menos hipertensión, diabetes y enfermedades respiratorias (Richman et al., 2005).'],
    ['Curiosidad', 0, 'La otra emoción positiva del estudio de Richman et al.'],
    ['Optimismo', 0, 'Rasgo asociado a mejor salud y longevidad; menos enfermedad coronaria en posmenopáusicas.'],
    ['Escrupulosidad', 0, 'Rasgo asociado a mejor salud y longevidad.'],
    ['Ansiedad', 1, 'Emoción negativa: peor salud física y mental.'],
    ['Desesperación', 1, 'Emoción negativa: peor salud física y mental.'],
    ['Neuroticismo', 1, 'Rasgo asociado a enfermedades graves y vida más corta.'],
    ['Hostilidad', 1, 'Rasgo asociado a enfermedad grave y vida más corta (y a más hipertensión).'],
  ] },
};
export function clasifica(el, props = {}) {
  const D = CLASIF[props.set] || CLASIF.emociones;
  let order, idx, ok, log;
  el.innerHTML = `<div class="viz-body"><div id="c"></div></div>`;
  const C = el.querySelector('#c');
  const reset = () => { order = shuffle(D.items); idx = 0; ok = 0; log = []; draw(); };
  const draw = (fb) => {
    if (idx >= order.length) {
      C.innerHTML = `<div class="readout"><div><div class="v">${ok}<small style="font-size:.9rem">/${order.length}</small></div><div class="l">aciertos</div></div></div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:14px">${D.cats.map((c, k) => `<div class="axis-card" style="--c:var(--accent)"><h5>${esc(c)}</h5><ul style="margin:6px 0 0;padding-left:1.1em;font-size:.88rem">${D.items.filter(x => x[1] === k).map(x => `<li>${esc(x[0])}</li>`).join('')}</ul></div>`).join('')}</div>
        <div class="ctrls" style="margin-top:14px"><button type="button" class="btn" id="again">Otra vez</button></div>`;
      C.querySelector('#again').addEventListener('click', reset);
      return;
    }
    const it = order[idx];
    C.innerHTML = `<div style="font:600 .72rem var(--f-mono);color:var(--muted)">${idx + 1} / ${order.length} · aciertos: ${ok}</div>
      <div style="margin:10px 0 14px;padding:18px;border-radius:12px;background:var(--paper-2);font:700 1.15rem/1.3 var(--f-display);text-align:center">${esc(it[0])}</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">${D.cats.map((c, k) => `<button type="button" class="btn" data-c="${k}" ${fb ? 'disabled' : ''} style="white-space:normal;line-height:1.2;padding:8px 10px">${esc(c)}</button>`).join('')}</div>
      ${fb ? `<div class="results"><div class="insight">${fb}</div></div><div class="ctrls" style="margin-top:10px"><button type="button" class="btn accent" id="next">Siguiente →</button></div>` : ''}`;
    if (fb) { const n = C.querySelector('#next'); n.addEventListener('click', () => { idx++; draw(); }); n.focus(); }
  };
  C.addEventListener('click', e => {
    const b = e.target.closest('[data-c]'); if (!b || b.disabled) return;
    const it = order[idx], right = +b.dataset.c === it[1];
    if (right) ok++;
    log.push(right);
    draw(`${right ? '✅ <b>¡Bien!</b>' : `❌ <b>Era: ${esc(D.cats[it[1]])}.</b>`} ${it[2]}`);
  });
  reset();
}

// ------------------------------------------------------------ Hábitos de salud
export function habitos(el) {
  const SANO = [['nofuma', '🚭 No fumar'], ['ejer', '🏃 Hacer ejercicio'], ['alc', '🍷 Alcohol con moderación'], ['fruta', '🥦 Mucha fruta y verdura']];
  const RIESGO = [['fuma', '🚬 Fumar'], ['peso', '⚖️ Sobrepeso'], ['hta', '🩺 Hipertensión'], ['azucar', '🍬 Azúcar alto en sangre']];
  let modo = 'sano'; const on = new Set();
  el.innerHTML = `<div class="viz-body">${seg([['sano', 'Conductas sanas'], ['riesgo', 'Factores de riesgo']], modo)}
    <div id="h" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:8px;margin-top:14px"></div>
    <div style="margin-top:14px;height:14px;border-radius:99px;background:var(--paper-3);overflow:hidden"><div id="m" style="height:100%;width:0;background:var(--accent);transition:width .3s"></div></div>
    <div class="results"><div class="insight" id="t"></div></div>
    ${nota('El tema solo da el resultado con las cuatro conductas (Khaw et al., 2008) o los cuatro factores juntos (Danaei et al., 2010); la barra solo cuenta cuántas marcas.')}</div>`;
  const draw = () => {
    const L = modo === 'sano' ? SANO : RIESGO;
    el.querySelector('#h').innerHTML = L.map(([k, l]) => `<button type="button" class="netchip" data-h="${k}" aria-pressed="${on.has(k)}" style="--c:var(--accent);justify-content:center;min-height:44px">${l}</button>`).join('');
    const n = L.filter(([k]) => on.has(k)).length;
    el.querySelector('#m').style.width = n / 4 * 100 + '%';
    el.querySelector('#t').innerHTML = modo === 'sano'
      ? (n === 4 ? 'Con las <b>cuatro conductas</b>, el riesgo de morir en la mitad de la vida y la vejez es <b>cuatro veces menor</b> que sin ellas (Khaw et al., 2008). Y quien se cuida tiene <b>menos años de discapacidad</b> al final de la vida.' : `Llevas ${n} de 4. El estudio comparó a quienes seguían <b>las cuatro</b> conductas con quienes no las seguían.`)
      : (n === 4 ? 'Fumar, sobrepeso, hipertensión y azúcar alto juntos pueden <b>restar unos cuatro años</b> de esperanza de vida (Danaei et al., 2010). ¡Ojo! Cambiar tarde también ayuda: dejar de fumar reduce el riesgo cardiaco y de apoplejía.' : `Llevas ${n} de 4 factores de riesgo. Marca los cuatro para ver el dato del tema.`);
  };
  el.addEventListener('click', e => {
    const m = e.target.closest('[data-k]'); if (m) { modo = m.dataset.k; on.clear(); press(el, 'data-k', modo); draw(); return; }
    const b = e.target.closest('[data-h]'); if (b) { const k = b.dataset.h; on.has(k) ? on.delete(k) : on.add(k); draw(); el.querySelector(`[data-h="${k}"]`)?.focus(); }
  });
  draw();
}

// ------------------------------------------------------------ Balanza del tratamiento hormonal
export function balanzaTH(el) {
  const ITEMS = [
    ['+', 'Alivia los síntomas de la menopausia (bochornos)'],
    ['+', 'Previene o detiene la pérdida ósea (si se mantiene ≥ 5 años)'],
    ['+', 'Puede prevenir fracturas de cadera y otros huesos'],
    ['+', 'Reduce obstrucciones coronarias en mujeres de 50 recién menopáusicas'],
    ['+', 'Mejoró la calidad de vida relacionada con la salud (Welton et al., 2008)'],
    ['-', 'WHI: más cáncer de mama'],
    ['-', 'WHI: más ataques cardiacos'],
    ['-', 'WHI: más apoplejías y coágulos'],
    ['-', 'Estrógeno solo: más cáncer uterino'],
    ['-', 'Uso prolongado: cáncer de ovario y enfermedad de vesícula'],
    ['-', 'Tras los 65: más riesgo de demencia o deterioro cognitivo'],
    ['-', 'Al dejarlo, la pérdida ósea vuelve en tres años'],
  ];
  const on = new Set();
  el.innerHTML = `<div class="viz-body">
    <svg viewBox="0 0 600 190" class="chart" role="img" aria-label="Balanza de beneficios y riesgos"><g id="g"></g></svg>
    <div id="l" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:6px;margin-top:10px"></div>
    <div class="ctrls" style="margin-top:12px"><button type="button" class="btn sm" id="all">Ponerlo todo</button><button type="button" class="btn sm" id="none">Vaciar</button></div>
    <div class="results"><div class="insight" id="t"></div></div>
    ${nota('La inclinación solo cuenta cuántos hallazgos hay en cada platillo; no pesa su importancia clínica.')}</div>`;
  const draw = () => {
    const p = ITEMS.filter((x, i) => on.has(i) && x[0] === '+').length, m = ITEMS.filter((x, i) => on.has(i) && x[0] === '-').length;
    const ang = clamp((m - p) * 3, -16, 16), r = ang * Math.PI / 180, L = 200;
    const lx = 300 - L * Math.cos(r), ly = 70 - L * Math.sin(r), rx = 300 + L * Math.cos(r), ry = 70 + L * Math.sin(r);
    const pan = (x, y, c, n, lab) => `<line x1="${x}" y1="${y}" x2="${x - 40}" y2="${y + 50}" stroke="var(--ink-2)"/><line x1="${x}" y1="${y}" x2="${x + 40}" y2="${y + 50}" stroke="var(--ink-2)"/>
      <path d="M${x - 55} ${y + 50} Q ${x} ${y + 80} ${x + 55} ${y + 50} Z" fill="${c}" opacity=".85"/><text x="${x}" y="${y + 66}" text-anchor="middle" style="fill:#fff;font:800 15px var(--f-display)">${n}</text>
      <text x="${x}" y="${y + 96}" text-anchor="middle" class="ttl">${lab}</text>`;
    el.querySelector('#g').innerHTML = `<path d="M300 70 L 280 180 L 320 180 Z" fill="var(--line-2)"/><line x1="${lx}" y1="${ly}" x2="${rx}" y2="${ry}" stroke="var(--ink)" stroke-width="5" stroke-linecap="round"/><circle cx="300" cy="70" r="7" fill="var(--ink)"/>
      ${pan(lx, ly, 'var(--ok)', p, 'Beneficios')}${pan(rx, ry, 'var(--bad)', m, 'Riesgos')}`;
    el.querySelector('#l').innerHTML = ITEMS.map(([s, t], i) => `<button type="button" class="btn sm" data-i="${i}" aria-pressed="${on.has(i)}" style="justify-content:flex-start;text-align:left;white-space:normal;line-height:1.25;padding:6px 10px;${on.has(i) ? `background:${s === '+' ? 'var(--ok-tint)' : 'var(--bad-tint)'};border-color:${s === '+' ? 'var(--ok)' : 'var(--bad)'}` : ''}">${s === '+' ? '➕' : '➖'} ${esc(t)}</button>`).join('');
    el.querySelector('#t').innerHTML = !on.size ? 'Toca cada hallazgo para ponerlo en su platillo.'
      : on.size === ITEMS.length ? 'Con todo sobre la mesa: por eso la <b>American Heart Association se opone</b> al TH, aunque la decisión debe tomarse <b>con el médico</b>. Para prevenir la cardiopatía son más prudentes los cambios de estilo de vida (bajar de peso, dejar de fumar) y los fármacos para el colesterol y la tensión. Ojo: la <b>edad de inicio</b> parece importar.'
      : 'Sigue añadiendo hallazgos. Recuerda que los primeros estudios <b>correlacionales</b> sugerían beneficios cardiacos que los ensayos <b>aleatorizados</b> no confirmaron.';
  };
  el.addEventListener('click', e => {
    const b = e.target.closest('[data-i]');
    if (b) { const i = +b.dataset.i; on.has(i) ? on.delete(i) : on.add(i); draw(); el.querySelector(`[data-i="${i}"]`)?.focus(); return; }
    if (e.target.closest('#all')) { ITEMS.forEach((_, i) => on.add(i)); draw(); }
    if (e.target.closest('#none')) { on.clear(); draw(); }
  });
  draw();
}

// ------------------------------------------------------------ Calculadora de unidades de cambio vital
export function ucv(el) {
  const EV = [
    ['Muerte del cónyuge', 100, 80], ['Muerte de un familiar', 63, 70], ['Divorcio', 73, 66], ['Separación', 65, 66],
    ['Cese o despido del trabajo', 47, 62], ['Nacimiento de un hijo o embarazo', 40, 60], ['Muerte de un amigo', 37, 58],
    ['Matrimonio', 50, 50], ['Jubilación', 45, 49], ['Reconciliación marital', 45, 48], ['Cambio de ámbito de trabajo', 36, 47], ['Un hijo se va de casa', 29, 43],
  ];
  const on = new Set();
  el.innerHTML = `<div class="viz-body">
    <div id="l" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:6px"></div>
    <div id="b" style="display:grid;gap:10px;margin-top:16px"></div>
    <div class="results"><div class="insight" id="t"></div></div>
    ${nota('UCV de la tabla 15.3. En 2007 "divorcio o separación" tiene un único valor (66). Los métodos de 1967 y 2007 varían: compáralos como relativos y direccionales.')}</div>`;
  const draw = () => {
    const s67 = EV.reduce((n, e, i) => n + (on.has(i) ? e[1] : 0), 0), s07 = EV.reduce((n, e, i) => n + (on.has(i) ? e[2] : 0), 0);
    el.querySelector('#l').innerHTML = EV.map(([n, a, b], i) => `<button type="button" class="btn sm" data-i="${i}" aria-pressed="${on.has(i)}" style="justify-content:space-between;white-space:normal;text-align:left;line-height:1.2;padding:6px 10px;${on.has(i) ? 'background:var(--accent-tint);border-color:var(--accent)' : ''}"><span>${on.has(i) ? '☑' : '☐'} ${esc(n)}</span><span style="font:600 .72rem var(--f-mono);color:var(--muted)">${a}→${b}</span></button>`).join('');
    const mx = Math.max(s67, s07, 1);
    el.querySelector('#b').innerHTML = [['1967', s67], ['2007', s07]].map(([l, v]) => `<div style="display:grid;grid-template-columns:52px 1fr 52px;gap:8px;align-items:center;font-weight:700"><span>${l}</span><div style="height:22px;border-radius:7px;background:var(--paper-3)"><div style="height:100%;width:${v / mx * 100}%;border-radius:7px;background:var(--accent);opacity:${l === '2007' ? 1 : .55};transition:width .3s"></div></div><span style="font-family:var(--f-mono);text-align:right">${v}</span></div>`).join('');
    const pos = [5, 7, 9].some(i => on.has(i));
    el.querySelector('#t').innerHTML = !on.size ? 'Marca los cambios de un año imaginario.'
      : `Total: <b>${s67}</b> UCV con la escala de 1967 y <b>${s07}</b> con la de 2007. ${s07 > s67 ? 'Los mismos cambios <b>pesan más</b> hoy: el estrés de ajustarse a la vida ha aumentado.' : s07 < s67 ? `Aquí suma más la escala de 1967 porque has marcado eventos que bajan en 2007: ${EV.filter((e, i) => on.has(i) && e[2] < e[1]).map(e => `${e[0].toLowerCase()} (${e[1]} → ${e[2]})`).join(', ')}.` : ''} ${pos ? 'Fíjate: también cuentan cambios <b>positivos</b> (un hijo, casarse, reconciliarse).' : ''} Según Holmes y Rahe, cuanto más estrés por cambios, más probabilidad de enfermedad grave en uno o dos años.`;
  };
  el.addEventListener('click', e => { const b = e.target.closest('[data-i]'); if (b) { const i = +b.dataset.i; on.has(i) ? on.delete(i) : on.add(i); draw(); el.querySelector(`[data-i="${i}"]`)?.focus(); } });
  draw();
}

// ------------------------------------------------------------ Estrés agudo frente a crónico
export function agudoCronico(el) {
  let apoyo = false;
  el.innerHTML = `<div class="viz-body">
    <div class="ctrls"><div class="slider"><label for="du">Duración del estrés <output id="duo"></output></label><input id="du" type="range" min="0" max="100" value="10"><div class="ends"><span>Un examen</span><span>Años (pobreza, discapacidad)</span></div></div>
      <button type="button" class="btn sm" id="ap" aria-pressed="false">🤝 Apoyo social</button></div>
    <svg viewBox="0 0 600 220" class="chart" role="img" aria-label="Defensas a lo largo del tiempo"><g id="g"></g></svg>
    <div class="results"><div class="insight" id="t"></div></div>
    ${nota('Curva esquemática para recordar la idea del tema; no son datos.')}</div>`;
  const X = t => 50 + t * 520, Y = v => 110 - v * 70;
  const draw = () => {
    const d = +el.querySelector('#du').value / 100, end = .1 + d * .85;
    const f = t => {
      if (t < .08) return 0;
      if (t < end) { const k = (t - .08) / Math.max(.02, end - .08); const boost = .55 * Math.exp(-k * (2 + d * 6)) * Math.min(1, k * 8); const wear = d > .3 ? -(d - .3) * 1.3 * k * (apoyo ? .55 : 1) : 0; return boost + wear; }
      const at = f(end - 1e-6); return at * Math.exp(-(t - end) * 9);
    };
    const pts = []; for (let t = 0; t <= 1.0001; t += .01) pts.push(`${X(t)} ${Y(clamp(f(t), -1.3, 1.3))}`);
    el.querySelector('#duo').textContent = d < .2 ? 'breve' : d < .5 ? 'semanas' : d < .8 ? 'meses' : 'años';
    el.querySelector('#g').innerHTML = `<line x1="50" y1="${Y(0)}" x2="570" y2="${Y(0)}" class="axis"/><text x="54" y="24" class="ttl">defensas ↑</text><text x="54" y="208" class="ttl">defensas ↓</text>
      <rect x="${X(.08)}" y="16" width="${X(end) - X(.08)}" height="190" fill="var(--accent)" opacity=".08"/><text x="${(X(.08) + X(end)) / 2}" y="${Y(0) - 74}" text-anchor="middle">estrés</text>
      <path d="M ${pts.join(' L ')}" fill="none" stroke="var(--accent)" stroke-width="3.5" stroke-linecap="round"/>
      <text x="570" y="${Y(0) + 16}" text-anchor="end">tiempo →</text>`;
    el.querySelector('#ap').setAttribute('aria-pressed', String(apoyo));
    el.querySelector('#t').innerHTML = d < .3 ? '<b>Estrés agudo</b>: por lo general <b>fortalece el sistema inmune</b>; el cuerpo responde y se recupera rápido y con eficiencia (Segerstrom y Miller, 2004; Sapolsky, 1992).'
      : `<b>Estrés intenso o prolongado</b>: puede <b>debilitar el cuerpo</b> y hacerlo más susceptible a enfermar; el estrés crónico lleva a <b>inflamación persistente</b>. ${apoyo ? 'Las <b>relaciones de apoyo</b> amortiguan el golpe: ante un trauma grave, la reacción más común es la <b>resiliencia</b> (Bonanno).' : 'Prueba a añadir apoyo social.'}`;
  };
  el.querySelector('#du').addEventListener('input', draw);
  el.querySelector('#ap').addEventListener('click', () => { apoyo = !apoyo; draw(); });
  draw();
}
