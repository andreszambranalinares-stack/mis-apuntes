// Convierte los bloques de contenido (content/**) en HTML.
// Cada tipo de bloque está documentado en CLAUDE.md.
import { esc, icon } from './util.js';
import { loadViz } from './viz/index.js';

let hCount = 0;
export const slug = s => String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/<[^>]+>/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60);

const R = {
  p: b => `<p>${b.html}</p>`,
  h: b => { hCount++; const id = b.id || slug(b.html); return `<h2 id="${id}" data-toc><span class="h-num">${String(hCount).padStart(2, '0')}</span><span>${b.html}</span></h2>`; },
  h3: b => `<h3>${b.html}</h3>`,
  lista: b => { const tag = b.ordenada ? 'ol' : 'ul'; return `<${tag}>${b.items.map(i => `<li>${i}</li>`).join('')}</${tag}>`; },

  concepto: b => `<div class="blk concepto"${red(b)} data-tab="${esc(b.tab || 'Concepto')}">
      <h3>${b.titulo}</h3><p class="def">${b.def}</p>
      ${b.extra ? `<p class="extra">${b.extra}</p>` : ''}${b.ej ? `<div class="ej"><span>${b.ej}</span></div>` : ''}</div>`,

  pares: b => `<div class="blk pares"${red(b)}>${par(b.a, 'a')}<div class="vs" aria-hidden="true">vs</div>${par(b.b, 'b')}</div>`,

  esencial: b => `<div class="blk esencial"><div class="blk-label">${icon('check')}Lo esencial · repaso exprés</div>
      <h3>${b.titulo || 'Si solo recuerdas esto…'}</h3><ol>${b.items.map(i => `<li><span>${i}</span></li>`).join('')}</ol></div>`,

  trampa: b => `<div class="blk trampa"><div class="blk-label">${icon('alert')}Trampa de examen</div>
      ${b.items ? `<ul>${b.items.map(i => `<li>${i}</li>`).join('')}</ul>` : `<p>${b.html}</p>`}</div>`,

  ejemplo: b => `<div class="blk ejemplo"${red(b)}><div class="em" aria-hidden="true">${b.emoji || '💡'}</div><div><h4>${b.titulo}</h4><p>${b.texto}</p></div></div>`,

  tabla: b => {
    const id = 'cmp' + Math.random().toString(36).slice(2, 7);
    const many = b.cols.length > 1;
    return `<div class="blk comparativa"${red(b)} id="${id}">
      <div class="cmp-title"><span>${b.titulo}</span>${b.nota ? `<small>${b.nota}</small>` : ''}
        ${many ? `<div class="cmp-seg" role="group" aria-label="Elegir columna">${b.cols.map((c, i) => `<button data-col="${i}" aria-pressed="${i === 0}">${c.n}</button>`).join('')}</div>` : ''}</div>
      <div style="overflow-x:auto"><table class="cmp-table">
        <thead><tr><th scope="col"></th>${b.cols.map(c => `<th scope="col">${c.red ? `<span class="sw" style="background:var(--accent)"></span>` : ''}${c.n}</th>`).join('')}</tr></thead>
        <tbody>${b.filas.map(f => `<tr><th scope="row">${f[0]}</th>${f.slice(1).map((v, i) => `<td data-col="${i}"${i === 0 || !many ? ' class="on"' : ''}>${v}</td>`).join('')}</tr>`).join('')}</tbody>
      </table></div></div>`;
  },

  proceso: b => `<div class="blk proceso"${red(b)}><ol>${b.pasos.map(p => `<li><div class="bar"></div><h4>${p.titulo}</h4><p>${p.texto}</p>${p.donde ? `<span class="where">${p.donde}</span>` : ''}</li>`).join('')}</ol></div>`,

  operaciones: b => `<div class="blk operaciones"${red(b)}>${b.items.map((o, i) => `<div class="op"><div class="n">${i + 1}</div><div><h4>${o.titulo}</h4><p>${o.texto}</p>${o.tareas ? `<div class="tasks">${o.tareas.map(t => `<span>${t}</span>`).join('')}</div>` : ''}</div></div>`).join('')}</div>`,

  glosario: b => `<dl class="blk glosario"${red(b)}>${b.items.map(([t, d]) => `<div><dt>${t}</dt><dd>${d}</dd></div>`).join('')}</dl>`,

  autores: b => `<div class="blk autores"${red(b)}><div class="blk-label">${icon('bulb')}Quién dijo qué</div>${b.items.map(a => `<div class="autor"><div class="who">${a.quien}${a.anio ? `<small>${a.anio}</small>` : ''}</div><p>${a.idea}</p></div>`).join('')}</div>`,

  clave: b => `<blockquote class="blk clave"${red(b)}>${b.html}${b.pie ? `<small>${b.pie}</small>` : ''}</blockquote>`,

  noexamen: b => `<div class="blk noexamen">${b.items ? `<ul>${b.items.map(i => `<li>${i}</li>`).join('')}</ul>` : `<p>${b.html}</p>`}</div>`,

  check: b => `<details class="blk check"${red(b)}><summary><span class="q">${b.q}</span><span class="r">Ver respuesta</span></summary><div class="a">${b.a}</div></details>`,

  recurso: b => {
    const inner = `<span class="ri">${icon(b.tipo === 'video' ? 'video' : 'link')}</span><span><b>${b.titulo}</b><small>${b.desc || ''}</small></span>`;
    return b.url ? `<a class="blk recurso" href="${esc(b.url)}" target="_blank" rel="noopener">${inner}</a>` : `<div class="blk recurso">${inner}</div>`;
  },

  viz: b => `<section class="blk viz"${red(b)} aria-label="${esc(b.titulo)}">
      <header class="viz-head"><span class="vi">${icon(b.icon || 'flask')}</span><div><span class="k">${b.k || 'Interactivo'}</span><h3>${b.titulo}</h3>${b.desc ? `<p>${b.desc}</p>` : ''}</div></header>
      <div class="viz-body${b.id === 'brain' ? ' flush' : ''}" data-viz="${b.id}" data-props='${esc(JSON.stringify(b.props || {}))}'><div class="viz-loading">Cargando interactivo…</div></div>
    </section>`,
};

function red(b) { return b.red ? ` data-red="${b.red}"` : ''; }
function par(p, cls) {
  return `<div class="par ${cls}"><span class="tag">${p.tag || ''}</span><h4>${p.titulo}</h4>${p.texto ? `<p>${p.texto}</p>` : ''}
    ${p.items ? `<ul>${p.items.map(i => `<li>${i}</li>`).join('')}</ul>` : ''}${p.ej ? `<div class="ej">${p.ej}</div>` : ''}</div>`;
}

export function renderBlocks(blocks) {
  hCount = 0;
  return blocks.map(b => {
    const fn = R[b.t];
    if (!fn) { console.warn('Bloque desconocido', b); return ''; }
    return fn(b);
  }).join('\n');
}

// Monta los interactivos de forma perezosa cuando entran en pantalla
export function hydrate(root, cleanups) {
  root.querySelectorAll('.cmp-seg').forEach(seg => seg.addEventListener('click', e => {
    const btn = e.target.closest('button'); if (!btn) return;
    const box = seg.closest('.comparativa');
    seg.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(b === btn)));
    box.querySelectorAll('td[data-col]').forEach(td => td.classList.toggle('on', td.dataset.col === btn.dataset.col));
  }));

  const els = [...root.querySelectorAll('[data-viz]')];
  const mount = async el => {
    if (el.dataset.mounted) return; el.dataset.mounted = '1';
    try {
      const fn = await loadViz(el.dataset.viz);
      el.innerHTML = '';
      const props = JSON.parse(el.dataset.props || '{}');
      const off = fn(el, props);
      if (typeof off === 'function') cleanups.push(off);
    } catch (err) {
      console.error(err);
      el.innerHTML = `<div class="viz-err">No se pudo cargar este interactivo (${esc(el.dataset.viz)}).</div>`;
    }
  };
  if (!('IntersectionObserver' in window)) { els.forEach(mount); return; }
  const io = new IntersectionObserver(entries => entries.forEach(en => { if (en.isIntersecting) { io.unobserve(en.target); mount(en.target); } }), { rootMargin: '400px 0px' });
  els.forEach(el => io.observe(el));
  cleanups.push(() => io.disconnect());
}
