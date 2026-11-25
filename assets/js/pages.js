// Páginas: inicio, mapa de tema, sección y atlas
import { ASIGNATURAS, TEMAS, temaByKey } from '../../content/indice.js';
import { REGIONES, REDES } from '../../content/atlas.js';
import { renderBlocks, hydrate } from './render.js';
import { brainSVG } from './viz/brain-geo.js';
import * as store from './store.js';
import { esc, icon, $$ } from './util.js';
import { renderNav, toast } from './app.js';

const notFound = () => ({ html: `<div class="page"><div class="page-wide"><h1 class="h-sec">No encuentro esa página</h1><p><a href="#/">Volver al inicio</a></p></div></div>` });

// ============================================================ INICIO
export function pageHome() {
  const done = store.get('done', {});
  const allSecs = TEMAS.reduce((n, t) => n + t.secciones.length, 0);
  const nDone = TEMAS.reduce((n, t) => n + t.secciones.filter(s => done[`${t.key}/${s.id}`]).length, 0);
  const cards = TEMAS.flatMap(t => t.tarjetas);
  const mastered = cards.filter(c => store.cardState(c.id).box >= 4).length;
  const due = cards.filter(c => store.isDue(c.id)).length;
  const last = store.get('last', null);
  const lastT = last && temaByKey(last.key);
  const lastS = lastT && lastT.secciones.find(s => s.id === last.sec);

  // Ilustración: las tres redes atencionales sobre el cerebro
  const spots = [['dlpfc', 'control'], ['acc', 'control'], ['fef', 'orient'], ['spl', 'orient'], ['tpj', 'orient'], ['ipl', 'alerta'], ['vlpfc', 'control'], ['insula', 'control']]
    .map(([id, r]) => { const g = REGIONES[id]; return `<circle cx="${g.x}" cy="${g.y}" r="22" fill="${REDES[r].color}" opacity=".18"><animate attributeName="r" values="16;26;16" dur="${2 + Math.random() * 1.5}s" repeatCount="indefinite"/></circle><circle cx="${g.x}" cy="${g.y}" r="8" fill="${REDES[r].color}" stroke="var(--card)" stroke-width="2.5"/>`; }).join('');
  const links = `<path d="M395 104 Q 320 60 250 86 M250 86 Q 240 160 258 230 M472 150 Q 440 120 395 104 M198 176 Q 330 200 470 236" fill="none" stroke="var(--ink-2)" stroke-width="1.4" stroke-dasharray="4 5" opacity=".5"/>`;
  const art = brainSVG('lateral', { inner: links + spots, label: 'Cerebro con las redes atencionales iluminadas' });

  const html = `<div class="page"><div class="page-wide">
    <section class="home-hero">
      <div>
        <div class="eyebrow"><span class="pill" style="background:var(--ink);color:var(--paper)">Cuaderno de estudio</span> ${ASIGNATURAS.map(a => esc(a.nombre)).join(' · ')}</div>
        <h1>Mis <em>Apuntes</em></h1>
        <p>Todo el temario, pero contado con el cerebro delante: redes que se iluminan, experimentos que puedes jugar, tarjetas que se repasan solas y tests tipo examen.</p>
        <div class="cta">
          ${lastS ? `<a class="btn primary" href="#/tema/${lastT.key}/${lastS.id}">${icon('play')}Seguir: ${esc(lastS.titulo)}</a>` : `<a class="btn primary" href="#/tema/${TEMAS[0].key}/${TEMAS[0].secciones[0].id}">${icon('play')}Empezar por el principio</a>`}
          <a class="btn" href="#/tarjetas">${due} tarjetas para hoy</a>
        </div>
      </div>
      <div class="home-art">${art}</div>
    </section>

    <div class="stats">
      <div class="stat"><div class="v">${nDone}<small>/${allSecs}</small></div><div class="l">secciones estudiadas</div></div>
      <div class="stat"><div class="v">${mastered}<small>/${cards.length}</small></div><div class="l">tarjetas dominadas</div></div>
      <div class="stat"><div class="v">${due}</div><div class="l">tarjetas pendientes hoy</div></div>
      <div class="stat"><div class="v">${bestQuiz()}</div><div class="l">mejor nota en test</div></div>
    </div>

    <h2 class="h-sec">El temario <small>por bloques</small></h2>
    <div class="bloques">
      ${ASIGNATURAS.map(a => a.bloques.map(b => `
        <div>
          <div class="bloque-head"><span class="roman">${b.num}</span><h3>Bloque ${b.num} · ${esc(b.nombre)}</h3></div>
          <div class="temas">
            ${b.temas.map(t => temaCard(TEMAS.find(x => x.id === t.id && x.bloque.id === b.id))).join('')}
            <div class="tema-card soon" aria-hidden="true"><div class="spine"><b>+</b><i>Próximamente</i><div class="bands"></div></div><div class="body"><h4>Siguiente tema</h4><p>Cuando haya nuevo temario aparecerá aquí, con el mismo formato.</p></div></div>
          </div>
        </div>`).join('')).join('')}
    </div>

    <h2 class="h-sec">Código de colores <small>es el mismo en toda la web</small></h2>
    <div class="leyenda">
      <span><i style="background:var(--alerta)"></i>Alerta</span>
      <span><i style="background:var(--orient)"></i>Orientación</span>
      <span><i style="background:var(--control)"></i>Control ejecutivo</span>
      <span><i style="background:var(--consc)"></i>Consciencia</span>
      <span><i style="background:var(--base)"></i>Marco general</span>
    </div>
  </div></div>`;
  return { html, title: '', crumbs: [{ t: 'Inicio' }] };
}

function bestQuiz() {
  const q = store.get('quiz', {}); const v = Object.values(q).map(x => x.best);
  return v.length ? Math.round(Math.max(...v) * 10 * 10) / 10 + '<small>/10</small>' : '—';
}

function temaCard(t) {
  const p = store.temaProgress({ ...t, id: t.key });
  return `<a class="tema-card" href="#/tema/${t.key}">
    <div class="spine"><b>${t.num}</b><i>Tema ${t.num}</i><div class="bands">${t.redes.map(r => `<span style="background:var(--${r})"></span>`).join('')}</div></div>
    <div class="body"><h4>${esc(t.titulo)}</h4><p>${esc(t.resumen)}</p>
      <div class="prog"><div class="m"><span style="width:${p.pct * 100}%"></span></div>${p.n}/${p.total}</div></div></a>`;
}

// ============================================================ MAPA DEL TEMA
export function pageTema(key) {
  const t = temaByKey(key); if (!t) return notFound();
  const done = store.get('done', {});
  const partes = Object.entries(t.partes);
  const html = `<div class="page"><div class="page-wide">
    <section class="tema-hero" data-red="base">
      <div>
        <div class="eyebrow"><span class="pill">Bloque ${t.bloque.num} · Tema ${t.num}</span>${esc(t.asig.nombre)}</div>
        <h1>${esc(t.titulo)}</h1>
        <p>${esc(t.resumen)}</p>
        <div class="meta">
          <span class="chip">${icon('clock')}${t.secciones.reduce((n, s) => n + (s.minutos || 0), 0)} min de lectura</span>
          <span class="chip">${icon('layers')}${t.secciones.length} secciones</span>
          <span class="chip">${icon('flask')}${t.secciones.reduce((n, s) => n + s.bloques.filter(b => b.t === 'viz').length, 0)} interactivos</span>
          <span class="chip">${t.tarjetas.length} tarjetas · ${t.test.length} preguntas</span>
        </div>
        <div class="study-links" style="margin-top:18px">
          <a class="btn primary" href="#/tema/${key}/${t.secciones[0].id}">${icon('play')}Empezar</a>
          <a class="btn" href="#/tarjetas/${key}">Repasar tarjetas</a>
          <a class="btn" href="#/test/${key}">Hacer el test</a>
        </div>
      </div>
      <div>${mapaTema(t)}</div>
    </section>

    <div class="ruta">
      ${partes.map(([pk, p], i) => {
        const secs = t.secciones.filter(s => s.parte === pk);
        return `<section class="parte" data-red="${p.red}">
          <h2><span class="roman">${pk === '0' ? '·' : pk}</span>${esc(p.titulo)}</h2>${p.desc ? `<p>${esc(p.desc)}</p>` : ''}
          <ol class="secs">${secs.map(s => `<li data-red="${s.red}"><a href="#/tema/${key}/${s.id}">
            <span class="n"><span>${s.num}</span>${done[`${key}/${s.id}`] ? '<span class="ok">✓ estudiada</span>' : `<span>${s.minutos} min</span>`}</span>
            <h3>${esc(s.titulo)}</h3><p>${esc(s.lead)}</p>
            ${s.viz?.length ? `<span class="viz-tags">${s.viz.map(v => `<span>${esc(v)}</span>`).join('')}</span>` : ''}
          </a></li>`).join('')}</ol></section>`;
      }).join('')}
    </div>

    <details class="blk check" data-red="base" style="margin-top:48px">
      <summary><span class="q">Repaso exprés de todo el tema (todos los "Lo esencial")</span><span class="r">Abrir</span></summary>
      <div class="a">${t.secciones.map(s => { const e = s.bloques.find(b => b.t === 'esencial'); return e ? `<h4 style="font-family:var(--f-display);margin:18px 0 6px">${s.num} · ${esc(s.titulo)}</h4><ul>${e.items.map(i => `<li>${i}</li>`).join('')}</ul>` : ''; }).join('')}</div>
    </details>

    <h2 class="h-sec">Referencias del tema</h2>
    <ul class="refs">${t.referencias.map(r => `<li class="${r.main ? 'main' : ''}">${esc(r.t)}${r.nota ? ` <em>(${esc(r.nota)})</em>` : ''}</li>`).join('')}</ul>
  </div></div>`;
  return { html, title: `Tema ${t.num}`, crumbs: [{ t: 'Inicio', h: '#/' }, { t: `Tema ${t.num}` }] };
}

// Mini mapa conceptual del tema (SVG)
function mapaTema(t) {
  const W = 420, H = 300;
  const I = t.secciones.filter(s => s.parte === 'I'), II = t.secciones.filter(s => s.parte === 'II');
  const node = (x, y, label, color, href, r = 30) => `<a href="${href}"><g><circle cx="${x}" cy="${y}" r="${r}" fill="${color}" opacity=".14"/><circle cx="${x}" cy="${y}" r="${r * .55}" fill="${color}"/><text x="${x}" y="${y + r + 14}" text-anchor="middle" class="svgtext" style="font:700 11.5px var(--f-body)">${label}</text></g></a>`;
  const k = t.key;
  return `<svg viewBox="0 0 ${W} ${H}" class="chart" role="img" aria-label="Mapa conceptual del tema">
    <path d="M210 40 L 80 140 M210 40 L 210 140 M210 40 L 340 140 M210 40 L 210 250" stroke="var(--line-2)" stroke-width="2" fill="none"/>
    <path d="M80 140 Q 145 110 210 140 Q 275 110 340 140" stroke="var(--line-2)" stroke-width="1.5" stroke-dasharray="4 4" fill="none"/>
    <path d="M210 160 L 210 230" stroke="var(--consc)" stroke-width="2" stroke-dasharray="3 4" fill="none"/>
    <rect x="132" y="16" width="156" height="44" rx="12" fill="var(--ink)"/><text x="210" y="36" text-anchor="middle" style="font:800 13px var(--f-display);fill:var(--paper)">Posner y Petersen</text><text x="210" y="51" text-anchor="middle" style="font:600 9.5px var(--f-mono);fill:var(--paper);opacity:.7">3 REDES · PARTE I</text>
    ${node(80, 140, 'Alerta', 'var(--alerta)', `#/tema/${k}/alerta`)}
    ${node(210, 140, 'Orientación', 'var(--orient)', `#/tema/${k}/orientacion`)}
    ${node(340, 140, 'Control', 'var(--control)', `#/tema/${k}/control`)}
    ${node(210, 252, 'Consciencia · Parte II', 'var(--consc)', `#/tema/${k}/consciencia`, 26)}
    <text x="220" y="205" text-anchor="start" class="svgmono" style="font-size:9.5px">atención ≠ consciencia</text>
  </svg>`;
}

// ============================================================ SECCIÓN
export function pageSeccion(key, secId) {
  const t = temaByKey(key); if (!t) return notFound();
  const i = t.secciones.findIndex(s => s.id === secId); if (i < 0) return notFound();
  const s = t.secciones[i], prev = t.secciones[i - 1], next = t.secciones[i + 1];
  store.set('last', { key, sec: secId });
  const done = store.isDone(key, secId);
  const nCards = t.tarjetas.filter(c => c.sec === secId).length;
  const nQ = t.test.filter(q => q.sec === secId).length;
  const parte = t.partes[s.parte];
  const body = renderBlocks(s.bloques);

  const html = `<div class="page" data-red="${s.red}"><div class="page-grid">
    <article class="content">
      <header class="sec-hero">
        <span class="sec-num" aria-hidden="true">${s.num}</span>
        <div class="eyebrow"><span class="pill">${s.num === '0' ? 'Intro' : s.num}</span>Tema ${t.num}${s.parte !== '0' ? ` · Parte ${s.parte}: ${esc(parte.titulo)}` : ''}</div>
        <h1>${s.tituloHtml || esc(s.titulo)}</h1>
        <p class="lead">${esc(s.lead)}</p>
        <div class="meta">
          <span class="chip">${icon('clock')}${s.minutos} min</span>
          ${s.viz?.length ? `<span class="chip">${icon('flask')}${s.viz.length} interactivo${s.viz.length > 1 ? 's' : ''}</span>` : ''}
          ${nCards ? `<a class="chip" href="#/tarjetas/${key}/${secId}" style="text-decoration:none">${nCards} tarjetas</a>` : ''}
          ${done ? `<span class="chip" style="color:var(--ok)">✓ Estudiada</span>` : ''}
        </div>
      </header>
      <div class="prose">${body}</div>
      <footer class="sec-end">
        <button class="done-btn" data-done aria-pressed="${done}">${icon('check')}<span>${done ? 'Sección estudiada' : 'Marcar como estudiada'}</span></button>
        <div class="study-links">
          ${nCards ? `<a class="btn" href="#/tarjetas/${key}/${secId}">Repasar sus ${nCards} tarjetas</a>` : ''}
          ${nQ ? `<a class="btn" href="#/test/${key}/${secId}">Test de esta sección (${nQ})</a>` : ''}
        </div>
        <nav class="pager" aria-label="Secciones">
          ${prev ? `<a class="prev" href="#/tema/${key}/${prev.id}" data-red="${prev.red}"><small>← Anterior · ${prev.num}</small><span>${esc(prev.titulo)}</span></a>` : '<span></span>'}
          ${next ? `<a class="next" href="#/tema/${key}/${next.id}" data-red="${next.red}"><small>Siguiente · ${next.num} →</small><span>${esc(next.titulo)}</span></a>` : `<a class="next" href="#/test/${key}"><small>Fin del tema →</small><span>Hacer el test completo</span></a>`}
        </nav>
      </footer>
    </article>
    <aside class="toc" aria-label="En esta sección"><h2>En esta sección</h2><ol id="tocList"></ol>
      <div class="toc-actions">
        ${nCards ? `<a class="btn sm" href="#/tarjetas/${key}/${secId}">Tarjetas</a>` : ''}
        <button class="btn sm" data-print>Imprimir / PDF</button>
      </div>
    </aside>
  </div></div>`;

  return {
    html, red: s.red, title: s.titulo,
    crumbs: [{ t: 'Inicio', h: '#/' }, { t: `Tema ${t.num}`, h: `#/tema/${key}` }, { t: `${s.num} ${s.titulo}` }],
    mount(root, cleanups) {
      hydrate(root, cleanups);
      // índice lateral + scrollspy
      const hs = $$('[data-toc]', root);
      const list = root.querySelector('#tocList');
      list.innerHTML = hs.map(h => `<li><a href="#/tema/${key}/${secId}?a=${h.id}" data-id="${h.id}">${h.textContent.replace(/^\d+/, '')}</a></li>`).join('');
      list.addEventListener('click', e => { const a = e.target.closest('a'); if (!a) return; e.preventDefault(); document.getElementById(a.dataset.id)?.scrollIntoView({ behavior: 'smooth' }); history.replaceState(null, '', a.getAttribute('href')); });
      if ('IntersectionObserver' in window && hs.length) {
        const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) list.querySelectorAll('a').forEach(a => a.classList.toggle('on', a.dataset.id === en.target.id)); }), { rootMargin: '-20% 0px -70% 0px' });
        hs.forEach(h => io.observe(h)); cleanups.push(() => io.disconnect());
      }
      root.querySelector('[data-done]').addEventListener('click', e => {
        const on = store.toggleDone(key, secId);
        const b = e.currentTarget; b.setAttribute('aria-pressed', String(on));
        b.querySelector('span').textContent = on ? 'Sección estudiada' : 'Marcar como estudiada';
        renderNav();
        toast(on ? '¡Sección marcada como estudiada!' : 'Marca quitada');
      });
      root.querySelector('[data-print]')?.addEventListener('click', () => print());
      // atajos [ y ] para moverse entre secciones
      const onKey = e => {
        if (/INPUT|TEXTAREA/.test(document.activeElement?.tagName) || e.ctrlKey || e.metaKey) return;
        if (e.key === ']' && next) location.hash = `#/tema/${key}/${next.id}`;
        if (e.key === '[' && prev) location.hash = `#/tema/${key}/${prev.id}`;
      };
      addEventListener('keydown', onKey); cleanups.push(() => removeEventListener('keydown', onKey));
    },
  };
}

// ============================================================ ATLAS
export function pageAtlas() {
  const html = `<div class="page"><div class="page-wide">
    <header class="sec-hero" data-red="base">
      <div class="eyebrow"><span class="pill">Atlas</span>Todas las regiones del temario</div>
      <h1>Atlas <em>cerebral</em></h1>
      <p class="lead">Las regiones y redes que salen en los apuntes, en un solo mapa. Activa una red para iluminar sus nodos, o toca un punto para ver qué hace y qué pasa si se lesiona.</p>
    </header>
    <section class="viz" data-red="base"><div class="viz-body flush" data-viz="brain" data-props='${esc(JSON.stringify({ redes: Object.keys(REDES) }))}'></div></section>
    <h2 class="h-sec">Todas las regiones <small>${Object.keys(REGIONES).length}</small></h2>
    <div class="glosario">${Object.entries(REGIONES).map(([, r]) => `<div style="border-left-color:${REDES[r.redes[0]].color}"><dt>${esc(r.nombre)}</dt><dd><b style="background:none">${esc(r.lugar)}.</b> ${esc(r.funcion)}</dd></div>`).join('')}</div>
  </div></div>`;
  return { html, title: 'Atlas cerebral', crumbs: [{ t: 'Inicio', h: '#/' }, { t: 'Atlas' }], mount: (root, c) => hydrate(root, c) };
}
