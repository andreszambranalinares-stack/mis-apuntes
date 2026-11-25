// Simulador de heminegligencia (lesión parietal derecha → se ignora la izquierda)
import { rand } from '../util.js';

export default function mount(el) {
  let mode = 'espacio';
  const lines = Array.from({ length: 42 }, (_, i) => ({ x: 40 + (i % 7) * 76 + rand(-14, 14), y: 40 + Math.floor(i / 7) * 40 + rand(-8, 8), a: rand(-40, 40), crossed: false }));
  el.innerHTML = `<div class="viz-body">
    <div class="ctrls"><div class="seg" role="group" aria-label="Modo">
      <button data-m="normal">Visión normal</button><button data-m="espacio" aria-pressed="true">Espacio-centrada</button><button data-m="objeto">Objeto-centrada</button><button data-m="reloj">Dibujar un reloj</button><button data-m="tachado">Test de tachado</button></div></div>
    <div id="sc"></div><div class="results"><div class="insight" id="t"></div></div></div>`;
  const id = 'ng' + Math.random().toString(36).slice(2, 6);
  const objs = [
    (x) => `<g transform="translate(${x},0)"><rect x="-34" y="120" width="68" height="60" fill="#C9780F"/><path d="M-44 120 L0 82 L44 120Z" fill="#CF4E35"/><rect x="-10" y="148" width="20" height="32" fill="#463F36"/><rect x="-28" y="132" width="14" height="14" fill="#DAE4F4"/><rect x="14" y="132" width="14" height="14" fill="#DAE4F4"/></g>`,
    (x) => `<g transform="translate(${x},0)"><line x1="0" y1="180" x2="0" y2="120" stroke="#2F7D4A" stroke-width="5"/>${[0, 72, 144, 216, 288].map(a => `<ellipse cx="${Math.cos(a * Math.PI / 180) * 16}" cy="${108 + Math.sin(a * Math.PI / 180) * 16}" rx="12" ry="8" transform="rotate(${a} ${Math.cos(a * Math.PI / 180) * 16} ${108 + Math.sin(a * Math.PI / 180) * 16})" fill="#B0336F"/>`).join('')}<circle cx="0" cy="108" r="9" fill="#E3B417"/></g>`,
    (x) => `<g transform="translate(${x},0)"><circle cx="0" cy="140" r="38" fill="#FBF8F2" stroke="#463F36" stroke-width="4"/><circle cx="-14" cy="140" r="7" fill="#CF4E35"/><circle cx="14" cy="132" r="6" fill="#2F7D4A"/><circle cx="6" cy="154" r="6" fill="#E3B417"/><circle cx="-6" cy="124" r="5" fill="#2E5BA6"/></g>`,
    (x) => `<g transform="translate(${x},0)"><rect x="-26" y="100" width="52" height="80" rx="6" fill="#7448AE"/><rect x="-18" y="110" width="36" height="20" fill="#E6DCF3"/><circle cx="-8" cy="150" r="5" fill="#E6DCF3"/><circle cx="8" cy="150" r="5" fill="#E6DCF3"/><circle cx="-8" cy="166" r="5" fill="#E6DCF3"/><circle cx="8" cy="166" r="5" fill="#E6DCF3"/></g>`,
  ];
  const xs = [80, 230, 380, 520];
  function scene() {
    if (mode === 'reloj') {
      const nums = Array.from({ length: 12 }, (_, i) => i + 1);
      const normal = nums.map(n => { const a = (n / 12) * Math.PI * 2 - Math.PI / 2; return `<text x="${150 + Math.cos(a) * 78}" y="${135 + Math.sin(a) * 78 + 6}" text-anchor="middle" style="font:700 17px var(--f-body);fill:var(--ink)">${n}</text>`; }).join('');
      const pat = nums.map((n, i) => { const a = (i / 11) * Math.PI - Math.PI / 2; return `<text x="${450 + Math.cos(a) * 78}" y="${135 + Math.sin(a) * 78 + 6}" text-anchor="middle" style="font:700 15px var(--f-body);fill:var(--ink)">${n}</text>`; }).join('');
      return `<svg viewBox="0 0 600 280" class="neg-grid"><circle cx="150" cy="135" r="100" fill="none" stroke="var(--ink-2)" stroke-width="3"/>${normal}<line x1="150" y1="135" x2="150" y2="80" stroke="var(--ink)" stroke-width="4"/><line x1="150" y1="135" x2="195" y2="135" stroke="var(--ink)" stroke-width="3"/>
        <path d="M450 35 A100 100 0 0 1 450 235" fill="none" stroke="var(--ink-2)" stroke-width="3"/><path d="M450 35 A100 100 0 0 0 420 232" fill="none" stroke="var(--ink-2)" stroke-width="1.5" stroke-dasharray="3 6" opacity=".5"/>${pat}<line x1="450" y1="135" x2="490" y2="100" stroke="var(--ink)" stroke-width="4"/>
        <text x="150" y="268" text-anchor="middle" class="svgmono">Sin lesión</text><text x="450" y="268" text-anchor="middle" class="svgmono">Con heminegligencia izquierda</text></svg>`;
    }
    if (mode === 'tachado') {
      return `<svg viewBox="0 0 600 300" class="neg-grid" style="cursor:pointer">${lines.map((l, i) => `<g data-l="${i}"><rect x="${l.x - 22}" y="${l.y - 16}" width="44" height="32" fill="transparent"/><line x1="${l.x - 14}" y1="${l.y}" x2="${l.x + 14}" y2="${l.y}" stroke="var(--ink)" stroke-width="3" transform="rotate(${l.a} ${l.x} ${l.y})"/>${l.crossed ? `<line x1="${l.x - 9}" y1="${l.y - 12}" x2="${l.x + 9}" y2="${l.y + 12}" stroke="var(--bad)" stroke-width="3.5"/>` : ''}</g>`).join('')}<line x1="300" y1="6" x2="300" y2="294" stroke="var(--line-2)" stroke-dasharray="4 5"/></svg>
        <div class="study-links" style="margin-top:10px"><button class="btn sm" data-pat>Ver cómo lo haría el paciente</button><button class="btn sm" data-reset>Borrar</button></div>`;
    }
    const clipObj = mode === 'objeto';
    return `<svg viewBox="0 0 600 220" class="neg-grid">
      <defs><linearGradient id="${id}g" x1="0" x2="1"><stop offset="0" stop-color="var(--paper-2)" stop-opacity="1"/><stop offset=".45" stop-color="var(--paper-2)" stop-opacity="1"/><stop offset=".56" stop-color="var(--paper-2)" stop-opacity="0"/></linearGradient>
        ${xs.map((x, i) => `<clipPath id="${id}c${i}"><rect x="${x}" y="0" width="80" height="220"/></clipPath>`).join('')}</defs>
      <line x1="0" y1="182" x2="600" y2="182" stroke="var(--line-2)" stroke-width="2"/>
      ${objs.map((o, i) => clipObj ? `<g clip-path="url(#${id}c${i})">${o(xs[i])}</g><g opacity=".1">${o(xs[i])}</g>` : o(xs[i])).join('')}
      ${mode === 'espacio' ? `<rect x="0" y="0" width="600" height="220" fill="url(#${id}g)"/>` : ''}
      <circle cx="300" cy="18" r="5" fill="var(--ink)"/><text x="310" y="22" class="svgmono">punto de mirada</text></svg>`;
  }
  const TX = {
    normal: 'Así ve la escena una persona sin lesión: casa, flor, plato y teléfono.',
    espacio: '<b>Espacio-centrada:</b> tras una lesión parietal <b>derecha</b>, se ignora la mitad <b>izquierda del espacio</b>. Los ojos funcionan (agudeza conservada): el fallo es <b>atencional</b>, no logra orientar hacia ese lado.',
    objeto: '<b>Objeto-centrada:</b> se ignora la mitad izquierda <b>de cada objeto</b>, esté donde esté. Prueba de que el desenganche y la reorientación usan <b>varios marcos de referencia</b> (escena y objeto).',
    reloj: 'Al pedirle que dibuje un reloj, el paciente coloca <b>todos los números en el lado derecho</b>: el lado izquierdo "no existe" para su atención.',
    tachado: 'Tacha tú todas las líneas tocándolas. Después mira cómo lo haría alguien con heminegligencia: solo tacha las del lado <b>derecho</b> (contralateral a la lesión = izquierdo ignorado).',
  };
  const draw = () => {
    el.querySelector('#sc').innerHTML = scene(); el.querySelector('#t').innerHTML = TX[mode];
    el.querySelectorAll('[data-m]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.m === mode)));
  };
  el.addEventListener('click', e => {
    const m = e.target.closest('[data-m]'); if (m) { mode = m.dataset.m; draw(); return; }
    const l = e.target.closest('[data-l]'); if (l) { lines[+l.dataset.l].crossed = true; draw(); return; }
    if (e.target.closest('[data-pat]')) { lines.forEach(x => (x.crossed = x.x > 300)); draw(); el.querySelector('#t').innerHTML = '<b>Así lo haría el paciente:</b> solo las de la derecha. Las de la izquierda ni las "ve" como pendientes, aunque estén ahí y su vista esté bien.'; }
    if (e.target.closest('[data-reset]')) { lines.forEach(x => (x.crossed = false)); draw(); }
  });
  draw();
}
