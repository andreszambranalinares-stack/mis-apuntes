// Cerebro interactivo: redes que se iluminan, regiones con ficha, y rutas
// animadas de "cómo viaja la señal".
import { brainSVG } from './brain-geo.js';
import { REGIONES, REDES, RUTAS } from '../../../content/atlas.js';
import { h, esc } from '../util.js';

export default function mount(el, props = {}) {
  const redes = props.redes || Object.keys(REDES);
  const vistas = props.vistas || ['lateral', 'medial'];
  const ruta = props.ruta ? RUTAS[props.ruta] : null;
  let activa = props.activa || null;
  let sel = props.seleccion || null;
  let timer = null;

  const regsFor = v => Object.entries(REGIONES).filter(([, r]) => r.vista === v);
  const regMarkup = v => regsFor(v).map(([id, r]) => `
    <g class="reg${r.profundo ? ' deepreg' : ''}" data-id="${id}" tabindex="0" role="button" aria-label="${esc(r.nombre)}">
      <circle class="hit" cx="${r.x}" cy="${r.y}" r="20"/>
      <circle class="halo" cx="${r.x}" cy="${r.y}" r="20"/>
      <circle class="core" cx="${r.x}" cy="${r.y}" r="7.5"/>
      <text class="lbl" x="${r.x}" y="${r.y - 15}" text-anchor="middle">${esc(shortName(r.nombre))}</text>
    </g>`).join('');

  el.innerHTML = `
    <div class="brain-ctrl">
      <div class="ctrls">
        <div class="netchips" role="group" aria-label="Elegir red">
          ${redes.map(k => `<button class="netchip" data-net="${k}" style="--c:${REDES[k].color}" aria-pressed="false"><i></i>${REDES[k].corto}</button>`).join('')}
        </div>
        ${ruta ? `<button class="btn sm accent" data-play><svg viewBox="0 0 24 24"><path d="M7 5l12 7-12 7z"/></svg>Ver cómo viaja la señal</button>` : ''}
      </div>
    </div>
    <div class="brain-wrap">
      <div class="brain-views">
        ${vistas.map(v => `<div class="brain-view" data-view="${v}"><span class="vlabel">${v === 'lateral' ? 'Vista lateral · hemisferio derecho' : 'Vista medial · corte sagital'}</span>${brainSVG(v, { inner: `<g class="flow"></g>${regMarkup(v)}` })}</div>`).join('')}
      </div>
      <div class="brain-info" aria-live="polite"></div>
    </div>`;

  const info = el.querySelector('.brain-info');
  const regEls = [...el.querySelectorAll('.reg')];

  function paint() {
    el.querySelectorAll('.netchip').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.net === activa)));
    regEls.forEach(g => {
      const r = REGIONES[g.dataset.id];
      const inNet = activa && r.redes.includes(activa);
      g.classList.toggle('on', !!inNet);
      g.classList.toggle('dim', !!activa && !inNet);
      g.classList.toggle('sel', g.dataset.id === sel);
      g.style.setProperty('--rc', activa ? REDES[activa].color : 'var(--accent)');
    });
    renderInfo();
  }

  function renderInfo(step) {
    if (step) {
      info.innerHTML = `<div class="where">${esc(ruta.titulo)} · paso ${step.i + 1}/${ruta.pasos.length}</div>
        <h4>${esc(step.t)}</h4><p>${esc(step.d)}</p>
        <div class="aka">${esc(REGIONES[step.r].nombre)}</div>`;
      return;
    }
    if (!sel) {
      const net = activa ? REDES[activa] : null;
      const list = activa ? Object.entries(REGIONES).filter(([, r]) => r.redes.includes(activa)) : [];
      info.innerHTML = net
        ? `<div class="where">Red seleccionada</div><h4 style="color:${net.color}">${esc(net.nombre)}</h4>
           <p>Toca cualquier punto iluminado para ver qué hace.</p>
           <div class="nets">${list.map(([id, r]) => `<span style="--c:${net.color};cursor:pointer" data-goto="${id}">${esc(shortName(r.nombre))}</span>`).join('')}</div>`
        : `<div class="empty"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><circle cx="12" cy="12" r="8"/></svg>Elige una red arriba o toca un punto del cerebro.<br><small>Los puntos con borde discontinuo son estructuras profundas.</small></div>`;
      return;
    }
    const r = REGIONES[sel];
    info.innerHTML = `
      <div class="where">${esc(r.lugar)}${r.profundo ? ' · profunda' : ''}</div>
      <div><h4>${esc(r.nombre)}</h4><div class="aka">${esc(r.aka || '')}</div></div>
      <p>${esc(r.funcion)}</p>
      ${r.lesion && r.lesion !== '—' ? `<div class="les"><b>Si se lesiona</b>${esc(r.lesion)}</div>` : ''}
      <div class="nets">${r.redes.map(k => `<span style="--c:${REDES[k].color}">${REDES[k].corto}</span>`).join('')}</div>`;
  }

  el.addEventListener('click', e => {
    const chip = e.target.closest('.netchip');
    if (chip) { stop(); activa = activa === chip.dataset.net ? null : chip.dataset.net; sel = null; paint(); return; }
    const go = e.target.closest('[data-goto]');
    if (go) { sel = go.dataset.goto; paint(); return; }
    const reg = e.target.closest('.reg');
    if (reg) { stop(); sel = sel === reg.dataset.id ? null : reg.dataset.id; paint(); return; }
    if (e.target.closest('[data-play]')) play();
  });
  el.addEventListener('keydown', e => {
    const reg = e.target.closest('.reg');
    if (reg && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); reg.dispatchEvent(new MouseEvent('click', { bubbles: true })); }
  });

  function clearFlow() { el.querySelectorAll('.flow').forEach(g => (g.innerHTML = '')); }
  function stop() { clearTimeout(timer); timer = null; clearFlow(); }

  function play() {
    stop();
    activa = ruta.red; sel = null; paint();
    let i = 0;
    const tick = () => {
      if (i >= ruta.pasos.length) { timer = setTimeout(() => { clearFlow(); sel = null; paint(); }, 2600); return; }
      const p = ruta.pasos[i];
      sel = p.r; paint(); renderInfo({ ...p, i });
      const prev = ruta.pasos[i - 1];
      if (prev && REGIONES[prev.r].vista === REGIONES[p.r].vista) drawHop(REGIONES[prev.r], REGIONES[p.r]);
      i++;
      timer = setTimeout(tick, 2400);
    };
    tick();
  }

  function drawHop(a, b) {
    const g = el.querySelector(`.brain-view[data-view="${a.vista}"] .flow`);
    if (!g) return;
    const mx = (a.x + b.x) / 2, my = Math.min(a.y, b.y) - 40;
    const d = `M ${a.x} ${a.y} Q ${mx} ${my} ${b.x} ${b.y}`;
    const id = 'p' + Math.random().toString(36).slice(2, 7);
    g.insertAdjacentHTML('beforeend', `<path id="${id}" class="flowpath" d="${d}"/>
      <circle class="packet" r="6"><animateMotion dur="1.1s" repeatCount="indefinite"><mpath href="#${id}"/></animateMotion></circle>`);
  }

  paint();
  return () => stop();
}

function shortName(n) {
  return n.replace(/\s*\(.*?\)/g, '').replace('Corteza ', '').replace('Campos oculares frontales', 'FEF').replace('Unión temporoparietal', 'TPJ').split(' · ')[0].split(' / ')[0];
}

export { shortName };
