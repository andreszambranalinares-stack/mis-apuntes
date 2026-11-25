// Diagramas conceptuales interactivos
import { brainSVG } from './brain-geo.js';
import { REGIONES } from '../../../content/atlas.js';
import { esc } from '../util.js';

const seg = (opts, cur, attr = 'data-k') => `<div class="seg" role="group">${opts.map(([k, l]) => `<button ${attr}="${k}" aria-pressed="${k === cur}">${l}</button>`).join('')}</div>`;

// ------------------------------------------------------------ 3 redes de Posner
export function redesTres(el) {
  const N = {
    alerta: { n: 'Alerta', c: 'var(--alerta)', x: 110, y: 230, que: 'Mantener la vigilancia y preparar la respuesta ante señales de aviso.', comp: ['Tónica: nivel basal sostenido', 'Fásica: pico breve tras una señal'], ej: 'Un pitido justo antes del semáforo verde te hace arrancar antes.', donde: 'Locus coeruleus (noradrenalina), tálamo, circuito fronto-parietal derecho', sec: 'alerta' },
    orient: { n: 'Orientación', c: 'var(--orient)', x: 390, y: 230, que: 'Priorizar dónde y qué atender: desenganchar, desplazar y reenganchar el foco.', comp: ['Endógena: por metas (top-down)', 'Exógena: capturada por el estímulo (bottom-up)'], ej: 'Giras la cabeza cuando alguien dice tu nombre.', donde: 'Parietal posterior/TPJ, FEF, colículo superior, pulvinar', sec: 'orientacion' },
    control: { n: 'Control ejecutivo', c: 'var(--control)', x: 250, y: 70, que: 'Selección e inhibición bajo conflicto, mantener objetivos y monitorizar el rendimiento.', comp: ['Sistema atencional anterior', 'Proactivo y reactivo'], ej: 'En Stroop, dices "rojo" aunque ponga AZUL.', donde: 'Cingulada anterior, CPF lateral, ínsula, ganglios basales, tálamo', sec: 'control' },
  };
  let sel = 'alerta';
  el.innerHTML = `<div class="viz-body"><div class="split" style="align-items:center">
    <svg viewBox="0 0 500 300" class="chart" role="img" aria-label="Las tres redes y sus relaciones">
      <defs><marker id="ar3" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="var(--ink-2)"/></marker></defs>
      <path d="M162 232 L 330 232" stroke="var(--ink-2)" stroke-width="2" marker-end="url(#ar3)"/>
      <text x="246" y="258" text-anchor="middle" class="svgmono" style="font-size:10px">la alerta potencia</text>
      <text x="246" y="272" text-anchor="middle" class="svgmono" style="font-size:10px">la orientación</text>
      <path d="M215 105 L 140 190" stroke="var(--ink-2)" stroke-width="2" marker-end="url(#ar3)" stroke-dasharray="5 4"/>
      <path d="M285 105 L 360 190" stroke="var(--ink-2)" stroke-width="2" marker-end="url(#ar3)" stroke-dasharray="5 4"/>
      <text x="250" y="168" text-anchor="middle" class="svgmono" style="font-size:10px">el control reajusta</text>
      <text x="250" y="182" text-anchor="middle" class="svgmono" style="font-size:10px">el peso de cada red</text>
      <g id="nodes"></g>
    </svg>
    <div id="det"></div></div></div>`;
  const draw = () => {
    el.querySelector('#nodes').innerHTML = Object.entries(N).map(([k, v]) => `<g data-n="${k}" style="cursor:pointer" tabindex="0" role="button" aria-label="${v.n}">
      <circle cx="${v.x}" cy="${v.y}" r="${sel === k ? 56 : 48}" fill="${v.c}" opacity="${sel === k ? .2 : .1}"/>
      <circle cx="${v.x}" cy="${v.y}" r="40" fill="${sel === k ? v.c : 'var(--card)'}" stroke="${v.c}" stroke-width="3"/>
      <text x="${v.x}" y="${v.y + 5}" text-anchor="middle" style="font:800 ${k === 'control' ? 12 : 14}px var(--f-display);fill:${sel === k ? '#fff' : 'var(--ink)'}">${k === 'control' ? 'Control' : v.n}</text></g>`).join('');
    const v = N[sel];
    el.querySelector('#det').innerHTML = `<div class="axis-card" style="--c:${v.c}"><h5 style="font-size:1.25rem">${v.n}</h5><p style="font-size:.98rem;color:var(--ink)">${v.que}</p>
      <ul style="margin:10px 0;padding-left:1.1em;font-size:.92rem">${v.comp.map(c => `<li>${c}</li>`).join('')}</ul>
      <p><b>Ejemplo:</b> ${v.ej}</p><p style="margin-top:6px"><b>Dónde:</b> ${v.donde}</p>
      <p style="margin-top:10px"><a href="${location.hash.split('/').slice(0, 3).join('/')}/${v.sec}">Ir a la sección →</a></p></div>`;
  };
  el.addEventListener('click', e => { const g = e.target.closest('[data-n]'); if (g) { sel = g.dataset.n; draw(); } });
  el.addEventListener('keydown', e => { const g = e.target.closest('[data-n]'); if (g && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); sel = g.dataset.n; draw(); el.querySelector(`[data-n="${sel}"]`)?.focus(); } });
  draw();
}

// ------------------------------------------------------------ Matriz TDS
export function tdsMatrix(el) {
  const C = {
    hit: ['Acierto', 'Verdadero positivo', 'ok', 'Hay luz roja en la vía y el maquinista frena.'],
    miss: ['Omisión', 'Falso negativo', 'bad', 'Hay luz roja y el maquinista no la ve. Crece con el tiempo en tarea y con un criterio conservador.'],
    fa: ['Falsa alarma', 'Falso positivo', 'bad', 'No hay luz roja, pero el maquinista frena "por si acaso". Crece con un criterio liberal.'],
    cr: ['Rechazo correcto', 'Verdadero negativo', 'ok', 'No hay luz roja y el maquinista sigue. Lo más frecuente en vigilancia (las señales son raras).'],
  };
  let sel = 'miss';
  el.innerHTML = `<div class="viz-body"><div class="tds-matrix" id="m"></div><div class="results"><div class="insight" id="ex"></div></div></div>`;
  const draw = () => {
    const cell = k => `<button class="c ${C[k][2]}" data-c="${k}" style="border:${sel === k ? '3px solid currentColor' : '3px solid transparent'};cursor:pointer;text-align:left;font:inherit"><b>${C[k][0]}</b><small>${C[k][1]}</small></button>`;
    el.querySelector('#m').innerHTML = `<div></div><div class="h">Responde "¡sí, hay señal!"</div><div class="h">No responde</div>
      <div class="h">Hay señal<br>(señal + ruido)</div>${cell('hit')}${cell('miss')}
      <div class="h">No hay señal<br>(solo ruido)</div>${cell('fa')}${cell('cr')}`;
    el.querySelector('#ex').innerHTML = `<b>${C[sel][0]} · ${C[sel][1]}.</b> ${C[sel][3]}`;
  };
  el.addEventListener('click', e => { const b = e.target.closest('[data-c]'); if (b) { sel = b.dataset.c; draw(); } });
  draw();
}

// ------------------------------------------------------------ Atención × consciencia
export function dosEjes(el) {
  const Q = {
    ac: ['Atendido y consciente', 'Lees esta frase con atención y podrías contarla: está en tu experiencia y es reportable.'],
    an: ['Atendido, no consciente', 'Se puede atender a algo sin llegar a reportarlo claramente (p. ej., un estímulo muy débil en el lugar al que atiendes: se procesa, pero no llega a informarse).'],
    nc: ['No atendido, consciente', 'Algunos contenidos acceden con atención mínima si son muy salientes o hay predicciones muy fuertes (p. ej., un estallido inesperado).'],
    nn: ['Ni atendido ni consciente', 'Se puede procesar información sin consciencia explícita: los analizadores locales trabajan aunque no lo notes.'],
  };
  let sel = 'an';
  el.innerHTML = `<div class="viz-body"><div class="split" style="align-items:center">
    <svg viewBox="0 0 320 300" class="chart" role="img" aria-label="Plano de atención por consciencia"><g id="q"></g>
      <text x="170" y="292" text-anchor="middle" class="ttl">ATENCIÓN →</text><text x="14" y="140" text-anchor="middle" class="ttl" transform="rotate(-90 14 140)">CONSCIENCIA →</text></svg>
    <div class="results" style="margin:0"><div class="insight" id="d"></div><p style="margin:0;font-size:.9rem;color:var(--muted)">Wundt los veía casi como lo mismo; hoy se separan en dos ejes distintos.</p></div></div></div>`;
  const pos = { nc: [30, 10], ac: [170, 10], nn: [30, 140], an: [170, 140] };
  const LBL = { ac: ['Atendido', 'y consciente'], an: ['Atendido', 'no consciente'], nc: ['No atendido', 'pero consciente'], nn: ['Ni atendido', 'ni consciente'] };
  const draw = () => {
    el.querySelector('#q').innerHTML = Object.entries(pos).map(([k, [x, y]]) => `<g data-q="${k}" style="cursor:pointer" tabindex="0" role="button" aria-label="${Q[k][0]}"><rect x="${x}" y="${y}" width="135" height="125" rx="12" fill="${sel === k ? 'var(--consc)' : 'var(--paper-2)'}" stroke="var(--line-2)"/>
      <text x="${x + 67}" y="${y + 60}" text-anchor="middle" style="font:700 12px var(--f-body);fill:${sel === k ? '#fff' : 'var(--ink)'}">${LBL[k][0]}</text>
      <text x="${x + 67}" y="${y + 78}" text-anchor="middle" style="font:400 11px var(--f-body);fill:${sel === k ? '#fff' : 'var(--muted)'}">${LBL[k][1]}</text></g>`).join('');
    el.querySelector('#d').innerHTML = `<b>${Q[sel][0]}.</b> ${Q[sel][1]}`;
  };
  el.addEventListener('click', e => { const g = e.target.closest('[data-q]'); if (g) { sel = g.dataset.q; draw(); } });
  draw();
}

// ------------------------------------------------------------ 3 vertientes
export function vertientes(el) {
  el.innerHTML = `<div class="viz-body">
    <div class="ctrls"><div class="slider"><label for="vig">Nivel de vigilia (consciencia como estado) <output id="vo"></output></label><input id="vig" type="range" min="0" max="100" value="80"><div class="ends"><span>Coma</span><span>Sueño profundo</span><span>Somnolencia</span><span>Vigilia alerta</span></div></div></div>
    <div class="split" style="align-items:center">
      <svg viewBox="0 0 320 260" class="chart" role="img" aria-label="Estado, contenido y autoconsciencia"><g id="g"></g></svg>
      <div class="readout" id="r"></div></div></div>`;
  const items = ['esta palabra', 'un tono', 'el frío', 'tu nombre', 'un recuerdo', 'el reloj', 'la luz', 'una idea'];
  const draw = () => {
    const v = +el.querySelector('#vig').value;
    el.querySelector('#vo').textContent = v < 15 ? 'coma' : v < 40 ? 'sueño profundo' : v < 65 ? 'somnolencia' : 'vigilia alerta';
    const nIn = Math.round((v / 100) ** 1.4 * items.length);
    const self = v > 70;
    const g = el.querySelector('#g');
    g.innerHTML = `<circle cx="160" cy="130" r="118" fill="var(--consc)" opacity="${.05 + v / 400}"/><circle cx="160" cy="130" r="118" fill="none" stroke="var(--consc)" stroke-width="2"/>
      <text x="160" y="28" text-anchor="middle" style="font:600 10px var(--f-mono);fill:var(--consc-ink)">ESTADO</text>
      <circle cx="160" cy="135" r="${nIn ? 70 + nIn * 4.5 : 26}" fill="var(--card)" stroke="var(--consc)" stroke-dasharray="4 3" style="transition:r .4s"/>
      ${items.map((w, i) => { const a = (i / items.length) * Math.PI * 2 - Math.PI / 2; const inside = i < nIn; const rr = inside ? 52 + nIn * 3.5 : 106; return `<text x="${160 + Math.cos(a) * rr}" y="${138 + Math.sin(a) * rr * .8}" text-anchor="middle" style="font:700 10.5px var(--f-body);fill:${inside ? 'var(--ink)' : 'var(--muted)'};opacity:${inside ? 1 : .45};transition:all .4s">${w}</text>`; }).join('')}
      <circle cx="160" cy="135" r="${self ? 16 : 0}" fill="var(--consc)" style="transition:r .4s"/><text x="160" y="139" text-anchor="middle" style="font:800 11px var(--f-display);fill:#fff;opacity:${self ? 1 : 0}">YO</text>`;
    el.querySelector('#r').innerHTML = `<div><div class="v">${v}%</div><div class="l">Estado · vigilia</div></div>
      <div><div class="v">${nIn}/${items.length}</div><div class="l">Contenidos con acceso</div></div>
      <div><div class="v">${self ? 'Sí' : 'No'}</div><div class="l">Autoconsciencia ("yo soy quien ve")</div></div>
      <div style="grid-column:1/-1;background:var(--consc-tint)"><div class="l" style="font-size:.85rem;color:var(--ink)">El <b>estado condiciona el acceso</b>: con baja vigilia entra menos en la experiencia. Y el <b>acceso alimenta la autoconsciencia</b>: sin contenidos disponibles no hay sobre qué reflexionar.</div></div>`;
  };
  el.querySelector('#vig').addEventListener('input', draw);
  draw();
}

// ------------------------------------------------------------ 4 rasgos
export function rasgos(el) {
  let tab = 'unidad', bound = false, ctx = 0;
  const T = [['unidad', 'Unidad'], ['subj', 'Subjetividad'], ['intenc', 'Intencionalidad'], ['cual', 'Cualidad']];
  el.innerHTML = `<div class="viz-body"><div class="ctrls">${seg(T, tab, 'data-t')}</div><div id="c"></div></div>`;
  const C = el.querySelector('#c');
  const draw = () => {
    el.querySelectorAll('[data-t]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.t === tab)));
    if (tab === 'unidad') {
      C.innerHTML = `<div class="split" style="align-items:center"><svg viewBox="0 0 320 200" class="chart">
        <style>.fly{transition:transform .9s cubic-bezier(.2,.7,.2,1),opacity .6s}</style>
        <g class="fly" style="transform:${bound ? 'translate(105px,40px)' : 'translate(0,0)'}"><rect x="30" y="40" width="50" height="50" rx="6" fill="#D2453B" opacity="${bound ? 0 : 1}"/><text x="55" y="110" text-anchor="middle" class="svgmono" opacity="${bound ? 0 : 1}">color</text></g>
        <g class="fly" style="transform:${bound ? 'translate(0,40px)' : 'translate(0,0)'}"><circle cx="160" cy="65" r="26" fill="none" stroke="var(--ink)" stroke-width="3" opacity="${bound ? 0 : 1}"/><text x="160" y="110" text-anchor="middle" class="svgmono" opacity="${bound ? 0 : 1}">forma</text></g>
        <g class="fly" style="transform:${bound ? 'translate(-105px,40px)' : 'translate(0,0)'}"><path d="M240 65 h40 m-10 -8 l10 8 -10 8" stroke="var(--ink)" stroke-width="3" fill="none" opacity="${bound ? 0 : 1}"/><text x="262" y="110" text-anchor="middle" class="svgmono" opacity="${bound ? 0 : 1}">movimiento</text></g>
        <g opacity="${bound ? 1 : 0}" style="transition:opacity .6s .5s"><circle cx="160" cy="105" r="28" fill="#D2453B"><animate attributeName="cx" values="130;190;130" dur="2.4s" repeatCount="indefinite"/></circle><text x="160" y="170" text-anchor="middle" style="font:700 12px var(--f-body);fill:var(--ink)">"una pelota roja que se mueve"</text></g>
      </svg><div><p><b>El cerebro procesa color, forma y movimiento por vías distintas</b>, pero tú vives <b>una</b> escena. ¿Cómo se juntan? Eso es el <b>problema de la unión</b> (binding problem).</p>
      <button class="btn accent" data-bind style="margin-top:12px">${bound ? 'Separar los rasgos' : 'Unir los rasgos'}</button></div></div>`;
    } else if (tab === 'subj') {
      C.innerHTML = `<div class="pares"><div class="par a"><span class="tag">Persona A</span><h4>🌅 El atardecer</h4><p>"Me recuerda a los veranos en el pueblo: me da paz."</p></div><div class="vs">≠</div><div class="par b"><span class="tag">Persona B</span><h4>🌅 El mismo atardecer</h4><p>"Me pone triste: es cuando se acaba el día."</p></div></div>
      <p style="margin-top:14px">Mismo <b>contenido objetivo</b>, distinto <b>modo subjetivo</b>. Toda consciencia es <b>de alguien y para alguien</b>. Por eso se combinan medidas en <b>1.ª persona</b> (informe, confianza) y en <b>3.ª persona</b> (conducta, fisiología).</p>`;
    } else if (tab === 'intenc') {
      C.innerHTML = `<div class="pares"><div class="par b"><span class="tag">Intencionalidad</span><h4>"Estar acerca de" algo</h4><p>La mente siempre apunta a un objeto, propiedad o idea: pensar <b>en</b> un número, atender <b>a</b> una palabra.</p><div class="ej">Es la estructura de la experiencia.</div></div><div class="vs">≠</div><div class="par a"><span class="tag">Intención</span><h4>Un propósito</h4><p>Querer hacer algo concreto.</p><div class="ej">"Quiero comer ahora."</div></div></div>
      <p style="margin-top:14px">En investigación se mide por la <b>selectividad y el acceso</b>: los contenidos intencionales aceleran respuestas, sesgan decisiones y se pueden reportar.</p>`;
    } else {
      const bgs = ['#1b1b1b', '#f2f2f2', '#2E5BA6', '#E39A2D'];
      C.innerHTML = `<div class="split" style="align-items:center"><svg viewBox="0 0 320 180" class="chart">${bgs.map((b, i) => `<rect x="${i * 80}" y="0" width="80" height="140" fill="${b}"/><rect x="${i * 80 + 25}" y="45" width="30" height="50" fill="#8a8a8a"/>`).join('')}<text x="160" y="165" text-anchor="middle" class="svgmono">los 4 cuadrados grises son idénticos</text></svg>
      <div><p>La <b>cualidad</b> (qualia, "cómo-es-para-mí") cambia con las <b>condiciones</b>: el mismo gris "parece" distinto según el contexto cromático.</p><p style="margin-top:8px">La psicología no postula una "sustancia" aparte: estudia qué condiciones de <b>estímulo, estado y red</b> dan lugar a cada cualidad.</p></div></div>`;
    }
  };
  el.addEventListener('click', e => {
    const t = e.target.closest('[data-t]'); if (t) { tab = t.dataset.t; draw(); }
    if (e.target.closest('[data-bind]')) { bound = !bound; draw(); }
  });
  draw();
}

// ------------------------------------------------------------ Corbetta y Shulman
export function corbetta(el) {
  const S = {
    buscar: { corto: 'Buscar a alguien', t: 'Buscas a tu amiga del abrigo rojo en la estación', pasos: [
      ['dorsal', 'Red dorsal al mando: tu meta ("abrigo rojo") crea un mapa de prioridad y eleva por adelantado lo rojo.'],
      ['dorsal', 'El foco se desplaza y se mantiene donde "debe" estar según la tarea (parietal superior + FEF).'],
    ] },
    portazo: { corto: 'Un portazo', t: 'Estás leyendo y suena un portazo a tu izquierda', pasos: [
      ['dorsal', 'Leyendo: la red dorsal mantiene el foco en el texto.'],
      ['ventral', '¡PUM! La red ventral (TPJ + frontal inferior derecha) detecta lo saliente e inesperado e interrumpe: "suelta el foco".'],
      ['dorsal', 'La red dorsal reorienta el foco hacia la puerta. Las dos redes cooperan.'],
    ] },
    nombre: { corto: 'Dicen tu nombre', t: 'En una cafetería ruidosa alguien dice tu nombre', pasos: [
      ['dorsal', 'Atiendes a tu conversación (red dorsal).'],
      ['ventral', 'Tu nombre es muy relevante y no previsto: la red ventral dispara la reorientación.'],
      ['dorsal', 'Giras la atención (y quizá la mirada) hacia quien te nombra.'],
    ] },
  };
  let sc = 'portazo', step = 0, timer = null;
  const nodes = { dorsal: ['spl', 'fef'], ventral: ['tpj', 'vlpfc'] };
  const col = { dorsal: '#2E5BA6', ventral: '#1FA1B8' };
  el.innerHTML = `<div class="viz-body"><div class="ctrls">${seg(Object.entries(S).map(([k, v]) => [k, v.corto]), sc, 'data-s')}<button class="btn sm accent" data-replay>▶ Reproducir</button></div>
    <div class="split" style="align-items:center"><div id="b"></div><div><h4 id="tt" style="font-family:var(--f-display);margin:0 0 8px"></h4><div class="flow-step"><span class="n" id="sn"></span><p id="st"></p></div>
    <div class="legend" style="margin-top:12px"><span><i style="background:${col.dorsal}"></i>Dorsal: parietal sup. + FEF (metas)</span><span><i style="background:${col.ventral}"></i>Ventral: TPJ + frontal inf. dcho. (lo inesperado)</span></div></div></div></div>`;
  const draw = () => {
    const [act, txt] = S[sc].pasos[step];
    const dots = Object.entries(nodes).map(([net, ids]) => ids.map(id => { const r = REGIONES[id]; const on = net === act; return `<circle cx="${r.x}" cy="${r.y}" r="${on ? 30 : 16}" fill="${col[net]}" opacity="${on ? .25 : .1}" style="transition:all .5s"/><circle cx="${r.x}" cy="${r.y}" r="${on ? 13 : 8}" fill="${on ? col[net] : 'var(--card)'}" stroke="${col[net]}" stroke-width="2.5" style="transition:all .5s"/>`; }).join('')).join('');
    const link = `<path d="M ${REGIONES.spl.x} ${REGIONES.spl.y} Q 330 60 ${REGIONES.fef.x} ${REGIONES.fef.y}" stroke="${col.dorsal}" stroke-width="${act === 'dorsal' ? 4 : 1.5}" fill="none" opacity=".7"/><path d="M ${REGIONES.tpj.x} ${REGIONES.tpj.y} Q 370 280 ${REGIONES.vlpfc.x} ${REGIONES.vlpfc.y}" stroke="${col.ventral}" stroke-width="${act === 'ventral' ? 4 : 1.5}" fill="none" opacity=".7"/>`;
    el.querySelector('#b').innerHTML = brainSVG('lateral', { inner: link + dots });
    el.querySelector('#tt').textContent = S[sc].t;
    el.querySelector('#sn').textContent = step + 1;
    el.querySelector('#st').innerHTML = `<b style="color:${col[act]}">Red ${act}</b>${esc(txt)}`;
    el.querySelectorAll('[data-s]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.s === sc)));
  };
  const play = () => { clearTimeout(timer); step = 0; draw(); const go = () => { if (step < S[sc].pasos.length - 1) { timer = setTimeout(() => { step++; draw(); go(); }, 2600); } }; go(); };
  el.addEventListener('click', e => { const b = e.target.closest('[data-s]'); if (b) { sc = b.dataset.s; play(); } if (e.target.closest('[data-replay]')) play(); });
  play();
  return () => clearTimeout(timer);
}

// ------------------------------------------------------------ Saliencia como interruptor
export function redesSwitch(el) {
  const S = {
    sofa: ['Estás tumbada en el sofá sin hacer nada', 'int', 'La red por defecto domina: pensamiento autobiográfico, divagación, planes para el finde.', 'En el sofá'],
    movil: ['De repente vibra el móvil con un mensaje', 'ext', 'La red de saliencia detecta el cambio de relevancia y conmuta al modo externo: entran la red dorsal (¿dónde está el móvil?) y la ejecutiva (leer y responder).', 'Vibra el móvil'],
    recuerdo: ['El mensaje te hace recordar las vacaciones', 'int', 'La saliencia vuelve a conmutar: el contenido interno gana relevancia y la red por defecto recupera recursos.', 'Un recuerdo'],
    examen: ['Estás resolviendo un problema de examen', 'ext', 'Modo externo sostenido: red dorsal (priorizar) y ejecutiva (reglas, conflicto). La red por defecto no se apaga: cede recursos.', 'Un examen'],
  };
  let sc = 'sofa';
  el.innerHTML = `<div class="viz-body"><div class="ctrls">${seg(Object.entries(S).map(([k, v]) => [k, v[3]]), sc, 'data-s')}</div>
    <svg viewBox="0 0 560 220" class="chart" role="img" aria-label="La red de saliencia como interruptor"><g id="g"></g></svg>
    <div class="results"><div class="insight" id="t"></div></div></div>`;
  const draw = () => {
    const [, mode, txt] = S[sc];
    const int = mode === 'int';
    const ang = int ? -28 : 28;
    el.querySelector('#g').innerHTML = `
      <g opacity="${int ? 1 : .35}" style="transition:opacity .5s"><rect x="10" y="50" width="170" height="120" rx="16" fill="var(--dmn)" opacity=".15"/><rect x="10" y="50" width="170" height="120" rx="16" fill="none" stroke="var(--dmn)" stroke-width="${int ? 3 : 1.5}"/>
        <text x="95" y="95" text-anchor="middle" style="font:800 14px var(--f-display);fill:var(--ink)">Red por defecto</text><text x="95" y="115" text-anchor="middle" class="svgmono">MODO INTERNO</text><text x="95" y="138" text-anchor="middle" style="font:400 11px var(--f-body);fill:var(--muted)">mPFC · cíngulo</text><text x="95" y="153" text-anchor="middle" style="font:400 11px var(--f-body);fill:var(--muted)">precúneo · parietal</text></g>
      <g opacity="${int ? .35 : 1}" style="transition:opacity .5s"><rect x="380" y="50" width="170" height="120" rx="16" fill="var(--orient)" opacity=".15"/><rect x="380" y="50" width="170" height="120" rx="16" fill="none" stroke="var(--orient)" stroke-width="${int ? 1.5 : 3}"/>
        <text x="465" y="90" text-anchor="middle" style="font:800 14px var(--f-display);fill:var(--ink)">Dorsal + Ejecutiva</text><text x="465" y="110" text-anchor="middle" class="svgmono">MODO EXTERNO</text><text x="465" y="133" text-anchor="middle" style="font:400 11px var(--f-body);fill:var(--muted)">parietal sup. · FEF</text><text x="465" y="148" text-anchor="middle" style="font:400 11px var(--f-body);fill:var(--muted)">fronto-parietal</text></g>
      <circle cx="280" cy="110" r="46" fill="var(--sal)" opacity=".14"/><circle cx="280" cy="110" r="10" fill="var(--sal)"/>
      <line x1="280" y1="110" x2="280" y2="52" stroke="var(--sal)" stroke-width="7" stroke-linecap="round" style="transform-origin:280px 110px;transform:rotate(${ang}deg);transition:transform .6s cubic-bezier(.3,1.6,.5,1)"/>
      <path d="M200 110 H 232" stroke="var(--line-2)" stroke-width="3"/><path d="M328 110 H 378" stroke="var(--line-2)" stroke-width="3"/>
      <text x="280" y="185" text-anchor="middle" style="font:800 13px var(--f-display);fill:var(--sal)">Red de saliencia</text><text x="280" y="202" text-anchor="middle" class="svgmono">ínsula anterior + cíngulo anterior</text>`;
    el.querySelector('#t').innerHTML = `<b>${S[sc][0]}.</b> ${txt}`;
    el.querySelectorAll('[data-s]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.s === sc)));
  };
  el.addEventListener('click', e => { const b = e.target.closest('[data-s]'); if (b) { sc = b.dataset.s; draw(); } });
  draw();
}

// ------------------------------------------------------------ Proactivo vs reactivo
export function proactivo(el) {
  let mode = 'pro', raf = null, t0 = 0;
  el.innerHTML = `<div class="viz-body"><div class="ctrls">${seg([['pro', 'Proactivo'], ['re', 'Reactivo']], mode, 'data-m')}<button class="btn sm" data-play>▶ Reproducir</button></div>
    <svg viewBox="0 0 600 220" class="chart" role="img" aria-label="Línea temporal del control"><g id="g"></g></svg>
    <div class="results"><div class="insight" id="t"></div></div></div>`;
  const X = s => 40 + s * 520; // s en [0,1]
  const draw = (p = 1) => {
    const pro = mode === 'pro';
    // curva de control a lo largo del tiempo
    const pts = []; for (let i = 0; i <= 100; i++) { const s = i / 100; let v;
      if (pro) v = s < .15 ? .1 : s < .45 ? .1 + (s - .15) / .3 * .6 : .7 - Math.max(0, s - .6) * .6;
      else v = s < .55 ? .1 : .1 + Math.exp(-((s - .65) ** 2) / .004) * .8;
      pts.push([X(s), 170 - v * 130]); }
    const shown = pts.slice(0, Math.max(2, Math.round(p * pts.length)));
    const cursor = X(Math.min(1, p));
    el.querySelector('#g').innerHTML = `
      <line x1="40" y1="170" x2="560" y2="170" class="axis"/>
      ${[['.12', 'Pista/contexto'], ['.55', 'Estímulo conflictivo'], ['.72', 'Respuesta']].map(([s, l]) => `<line x1="${X(+s)}" y1="30" x2="${X(+s)}" y2="170" class="gridl"/><text x="${X(+s)}" y="188" text-anchor="middle">${l}</text>`).join('')}
      <rect x="${X(.55)}" y="30" width="${X(.62) - X(.55)}" height="140" fill="var(--bad)" opacity=".08"/>
      <path d="M ${shown.map(q => q.join(' ')).join(' L ')}" fill="none" stroke="var(--control)" stroke-width="3.5" stroke-linecap="round"/>
      <line x1="${cursor}" y1="26" x2="${cursor}" y2="172" stroke="var(--ink)" stroke-width="1" opacity=".4"/>
      <text x="44" y="24" class="ttl">nivel de control →</text>
      <text x="${pro ? X(.32) : X(.7)}" y="${pro ? 60 : 38}" text-anchor="middle" style="font:700 12px var(--f-body);fill:var(--control-ink)">${pro ? 'se prepara ANTES' : 'corrige DESPUÉS'}</text>`;
    el.querySelector('#t').innerHTML = pro
      ? '<b>Control proactivo:</b> se anticipa al conflicto, preconfigura la regla y ajusta criterios por adelantado. Lo favorecen las <b>señales regulares</b> del contexto.'
      : '<b>Control reactivo:</b> espera a que aparezca el conflicto o el error y entonces aplica una corrección transitoria. Lo favorece la <b>incertidumbre</b>.';
    el.querySelectorAll('[data-m]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.m === mode)));
  };
  const play = () => { cancelAnimationFrame(raf); t0 = performance.now(); const f = now => { const p = Math.min(1, (now - t0) / 2600); draw(p); if (p < 1) raf = requestAnimationFrame(f); }; raf = requestAnimationFrame(f); };
  el.addEventListener('click', e => { const b = e.target.closest('[data-m]'); if (b) { mode = b.dataset.m; play(); } if (e.target.closest('[data-play]')) play(); });
  play();
  return () => cancelAnimationFrame(raf);
}
