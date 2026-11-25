// Mis Apuntes — arranque, router por hash y armazón (menú, búsqueda, tema).
import { ASIGNATURAS, TEMAS } from '../../content/indice.js';
import { REDES, REGIONES } from '../../content/atlas.js';
import * as store from './store.js';
import { esc, norm, plain, $, $$ } from './util.js';
import { pageHome, pageTema, pageSeccion, pageAtlas } from './pages.js';
import { pageTarjetas, pageTest } from './study.js';

const main = $('#main');
let cleanups = [];

// ---------------------------------------------------------------- router
const routes = [
  [/^\/?$/, () => pageHome()],
  [/^\/tema\/([^/]+)\/?$/, (k) => pageTema(k)],
  [/^\/tema\/([^/]+)\/([^/]+)\/?$/, (k, s) => pageSeccion(k, s)],
  [/^\/tarjetas(?:\/([^/]+))?(?:\/([^/]+))?\/?$/, (k, s) => pageTarjetas(k, s)],
  [/^\/test(?:\/([^/]+))?(?:\/([^/]+))?\/?$/, (k, s) => pageTest(k, s)],
  [/^\/atlas\/?$/, () => pageAtlas()],
];

function route() {
  cleanups.forEach(f => { try { f(); } catch { } });
  cleanups = [];
  const full = decodeURIComponent(location.hash.replace(/^#/, '') || '/');
  const path = full.split('?')[0];
  let view = null;
  for (const [re, fn] of routes) { const m = path.match(re); if (m) { view = fn(...m.slice(1)); break; } }
  if (!view) view = { html: `<div class="page"><div class="page-wide"><h1 class="h-sec">Página no encontrada</h1><p><a href="#/">Volver al inicio</a></p></div></div>`, crumbs: [] };

  document.documentElement.dataset.red = view.red || '';
  main.innerHTML = view.html;
  document.title = view.title ? `${view.title} · Mis Apuntes` : 'Mis Apuntes';
  renderCrumbs(view.crumbs || []);
  view.mount?.(main, cleanups);
  setActiveNav(path);
  closeDrawer();
  const anchor = full.split('?a=')[1];
  window.scrollTo(0, 0);
  if (anchor) setTimeout(() => document.getElementById(anchor)?.scrollIntoView({ behavior: 'smooth' }), 80);
  main.focus({ preventScroll: true });
}
window.addEventListener('hashchange', route);

// ---------------------------------------------------------------- menú lateral
export function renderNav() {
  const nav = $('#sbNav');
  const done = store.get('done', {});
  const open = store.get('navOpen', {});
  const svg = p => `<svg class="ico" viewBox="0 0 24 24" aria-hidden="true">${p}</svg>`;
  let html = `
    <a class="sb-link" href="#/">${svg('<path d="M4 11l8-6 8 6v8a1 1 0 01-1 1h-4v-6h-6v6H5a1 1 0 01-1-1z"/>')}<span class="lbl">Inicio</span></a>
    <a class="sb-link" href="#/tarjetas">${svg('<rect x="3" y="7" width="14" height="12" rx="1.5"/><path d="M7 4h12.5A1.5 1.5 0 0121 5.5V16"/>')}<span class="lbl">Tarjetas de repaso</span></a>
    <a class="sb-link" href="#/test">${svg('<path d="M9 11l2.5 2.5L16 9"/><rect x="4" y="4" width="16" height="16" rx="2"/>')}<span class="lbl">Test tipo examen</span></a>
    <a class="sb-link" href="#/atlas">${svg('<path d="M8 5c-3 0-5 2.5-5 5.5S5 17 8 17c.5 2 2.2 3 4 3s3.5-1 4-3c3 0 5-2.5 5-6.5S19 5 16 5c-1-1.3-2.4-2-4-2S9 3.7 8 5z"/><path d="M12 3v17"/>')}<span class="lbl">Atlas cerebral</span></a>`;
  for (const a of ASIGNATURAS) {
    html += `<div class="sb-asig">${esc(a.nombre)}</div>`;
    for (const b of a.bloques) {
      const bKey = `${a.id}-${b.id}`;
      html += `<details class="sb-group" data-red="${b.red}" data-key="${bKey}"${open[bKey] !== false ? ' open' : ''}>
        <summary><span class="sb-badge ghost">${b.num}</span><span class="lbl" style="flex:1">Bloque ${b.num} · ${esc(b.nombre)}</span><svg class="chev" viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg></summary>
        <div class="sb-sub">`;
      for (const t of b.temas) {
        const key = `${a.id}-${b.id}-${t.id}`;
        const prog = store.temaProgress({ ...t, id: key });
        const tOpen = open[key] !== false;
        html += `<details class="sb-group" data-key="${key}"${tOpen ? ' open' : ''}>
          <summary><span class="sb-badge" style="background:var(--ink);color:var(--paper)">${t.num}</span><span class="lbl" style="flex:1">Tema ${t.num} · ${esc(t.corto)}</span><svg class="chev" viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg></summary>
          <div class="sb-meter" title="${prog.n}/${prog.total} secciones estudiadas"><span style="width:${prog.pct * 100}%"></span></div>
          <a class="sb-link sb-sec" href="#/tema/${key}" data-red="base"><span class="num">◆</span><span class="lbl">Mapa del tema</span></a>`;
        let lastParte = null;
        for (const s of t.secciones) {
          if (s.parte !== lastParte && s.parte !== '0') { html += `<div class="sb-part">Parte ${s.parte} · ${esc(t.partes[s.parte].titulo)}</div>`; }
          lastParte = s.parte;
          const isDone = done[`${key}/${s.id}`];
          html += `<a class="sb-link sb-sec${isDone ? ' done' : ''}" data-red="${s.red}" href="#/tema/${key}/${s.id}" title="${esc(s.titulo)}"><span class="dot" aria-hidden="true"></span><span class="num">${s.num}</span><span class="lbl">${esc(s.titulo)}</span>${isDone ? '<span class="sr-only">(estudiada)</span>' : ''}</a>`;
        }
        html += `</details>`;
      }
      html += `</div></details>`;
    }
  }
  nav.innerHTML = html;
  nav.querySelectorAll('details[data-key]').forEach(d => d.addEventListener('toggle', () => {
    const o = store.get('navOpen', {}); o[d.dataset.key] = d.open; store.set('navOpen', o);
  }));
  setActiveNav(decodeURIComponent(location.hash.replace(/^#/, '') || '/'));
}

function setActiveNav(path) {
  $$('#sbNav a').forEach(a => {
    const href = a.getAttribute('href').replace(/^#/, '');
    const on = href === path.split('?')[0];
    if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
  });
  $$('.tabbar [data-tab]').forEach(t => {
    const tab = t.dataset.tab;
    const on = (tab === 'inicio' && (path === '/' || path === '')) || (tab === 'tarjetas' && path.startsWith('/tarjetas')) || (tab === 'test' && path.startsWith('/test')) || (tab === 'atlas' && path.startsWith('/atlas')) || (tab === 'temario' && path.startsWith('/tema'));
    if (on) t.setAttribute('aria-current', 'page'); else t.removeAttribute('aria-current');
  });
  const cur = $('#sbNav a[aria-current="page"]');
  if (cur && !isMobile()) cur.scrollIntoView({ block: 'nearest' });
}

function renderCrumbs(c) {
  $('#crumbs').innerHTML = c.map((x, i) => i === c.length - 1 ? `<span class="here">${esc(x.t)}</span>` : `<a href="${x.h}">${esc(x.t)}</a><span class="sep">/</span>`).join('');
}

// ---------------------------------------------------------------- cajón móvil / rail
const isMobile = () => matchMedia('(max-width: 1023px)').matches;
function openDrawer() { document.body.classList.add('sb-open'); $('#scrim').hidden = false; $('#sbOpen').setAttribute('aria-expanded', 'true'); setTimeout(() => $('#sbNav a[aria-current]')?.scrollIntoView({ block: 'center' }), 50); }
function closeDrawer() { document.body.classList.remove('sb-open'); $('#scrim').hidden = true; $('#sbOpen').setAttribute('aria-expanded', 'false'); }
$('#sbOpen').addEventListener('click', openDrawer);
$('#tabTemario').addEventListener('click', () => document.body.classList.contains('sb-open') ? closeDrawer() : openDrawer());
$('#sbClose').addEventListener('click', closeDrawer);
$('#scrim').addEventListener('click', closeDrawer);
$('#sidebar').addEventListener('click', e => { if (e.target.closest('a') && isMobile()) closeDrawer(); });
function toggleRail() {
  const on = document.documentElement.classList.toggle('rail');
  try { localStorage.setItem('ma:rail', on ? '1' : '0'); } catch { }
  $('#railToggle').setAttribute('aria-label', on ? 'Desplegar menú' : 'Plegar menú');
}
$('#railToggle').addEventListener('click', toggleRail);

// gesto: deslizar desde el borde izquierdo abre el menú en táctil
let tx = null;
addEventListener('touchstart', e => { const t = e.touches[0]; tx = (t.clientX < 24 && isMobile()) ? t.clientX : (document.body.classList.contains('sb-open') ? -t.clientX : null); }, { passive: true });
addEventListener('touchend', e => {
  if (tx == null) return; const x = e.changedTouches[0].clientX;
  if (tx >= 0 && x - tx > 60) openDrawer();
  if (tx < 0 && -tx - x > 60) closeDrawer();
  tx = null;
}, { passive: true });

// ---------------------------------------------------------------- tema claro/oscuro
function currentTheme() { return document.documentElement.dataset.theme || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'); }
$('#themeToggle').addEventListener('click', () => {
  const next = currentTheme() === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = next;
  try { localStorage.setItem('ma:theme', next); } catch { }
});

// ---------------------------------------------------------------- barra de lectura
addEventListener('scroll', () => {
  const h = document.documentElement;
  const max = h.scrollHeight - h.clientHeight;
  $('#readbar span').style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + '%';
}, { passive: true });

// ---------------------------------------------------------------- búsqueda
let INDEX = null;
const slugH = html => html.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/<[^>]+>/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60);

// Texto plano de cualquier bloque (para buscar dentro del contenido)
function blockText(b) {
  const j = a => (a || []).join(' · ');
  switch (b.t) {
    case 'p': case 'h3': case 'clave': return b.html;
    case 'lista': case 'trampa': case 'esencial': case 'noexamen': return b.items ? j(b.items) : b.html;
    case 'operaciones': return b.items.map(o => `${o.titulo}: ${o.texto} ${j(o.tareas)}`).join(' · ');
    case 'proceso': return b.pasos.map(p => `${p.titulo}: ${p.texto} ${p.donde || ''}`).join(' · ');
    case 'tabla': return b.titulo + ' · ' + b.filas.map(f => f.join(' ')).join(' · ');
    case 'concepto': return `${b.extra || ''} ${b.ej || ''}`;
    case 'pares': return [b.a, b.b].map(p => `${p.ej || ''} ${j(p.items)}`).join(' ');
    case 'ejemplo': return `${b.titulo}: ${b.texto}`;
    case 'check': return `${b.q} ${b.a}`;
    case 'recurso': return `${b.titulo} ${b.desc || ''}`;
    default: return '';
  }
}

function buildIndex() {
  INDEX = [];
  const add = e => INDEX.push(e);
  for (const t of TEMAS) {
    add({ kind: 'Tema', t: `Tema ${t.num} · ${t.titulo}`, s: t.resumen, href: `#/tema/${t.key}`, red: 'base' });
    for (const s of t.secciones) {
      const base = `#/tema/${t.key}/${s.id}`;
      add({ kind: 'Sección', t: `${s.num} · ${s.titulo}`, s: s.lead, href: base, red: s.red });
      let curH = null, curHT = '';
      for (const b of s.bloques) {
        if (b.t === 'h') { curH = b.id || slugH(b.html); curHT = plain(b.html); }
        const href = base + (curH ? `?a=${curH}` : '');
        const where = `${s.num} · ${s.titulo}${curHT ? ' › ' + curHT : ''}`;
        if (b.t === 'concepto') add({ kind: 'Concepto', t: b.titulo, s: b.def, href, red: b.red || s.red });
        if (b.t === 'glosario') b.items.forEach(([term, d]) => add({ kind: 'Término', t: term, s: d, href, red: s.red }));
        if (b.t === 'pares') [b.a, b.b].forEach(p => add({ kind: 'Concepto', t: p.titulo, s: p.texto || (p.items || []).join(' '), href, red: s.red }));
        if (b.t === 'autores') b.items.forEach(a => add({ kind: 'Autor', t: a.quien + (a.anio ? ` (${a.anio})` : ''), s: a.idea, href, red: s.red }));
        if (b.t === 'viz') add({ kind: 'Interactivo', t: b.titulo, s: b.desc || '', href, red: s.red });
        if (b.t === 'h') add({ kind: 'Apartado', t: b.html, s: s.titulo, href, red: s.red });
        const txt = blockText(b);
        if (txt) add({ kind: 'Texto', t: where, s: txt, href, red: b.red || s.red });
      }
    }
    for (const c of t.tarjetas) add({ kind: 'Tarjeta', t: c.frente, s: c.dorso, href: `#/tarjetas/${t.key}/${c.sec}`, red: t.secciones.find(s => s.id === c.sec)?.red });
    for (const q of t.test) add({ kind: 'Pregunta', t: q.q, s: `${q.o[q.c]}. ${q.e}`, href: `#/test/${t.key}/${q.sec}`, red: t.secciones.find(s => s.id === q.sec)?.red });
  }
  for (const [id, r] of Object.entries(REGIONES)) add({ kind: 'Región', t: r.nombre, s: `${r.aka || ''} · ${r.funcion}`, href: `#/atlas?r=${id}`, red: 'base' });
  for (const i of INDEX) { i.t = plain(i.t); i.s = plain(i.s || ''); i.nt = norm(i.t); i.n = i.nt + ' ' + norm(i.s); }
}

const sBox = $('#search'), sIn = $('#searchInput'), sRes = $('#searchResults');
let sSel = 0, sItems = [], lastFocus = null;
function openSearch() {
  if (!INDEX) buildIndex();
  lastFocus = document.activeElement;
  sBox.hidden = false; sIn.value = ''; doSearch(); setTimeout(() => sIn.focus(), 10);
}
function closeSearch() { if (sBox.hidden) return; sBox.hidden = true; if (lastFocus && document.contains(lastFocus)) lastFocus.focus?.({ preventScroll: true }); }

// Resalta las palabras buscadas (norm() conserva las posiciones del texto original)
function hl(text, words) {
  if (!words.length) return esc(text);
  const n = norm(text); const marks = [];
  words.forEach(w => { let i = n.indexOf(w); while (i >= 0) { marks.push([i, i + w.length]); i = n.indexOf(w, i + w.length); } });
  if (!marks.length) return esc(text);
  marks.sort((a, b) => a[0] - b[0]);
  let res = '', last = 0;
  for (const [a, b] of marks) { if (a < last) continue; res += esc(text.slice(last, a)) + '<mark>' + esc(text.slice(a, b)) + '</mark>'; last = b; }
  return res + esc(text.slice(last));
}
// Trozo del texto alrededor de la primera coincidencia
function snippet(text, words) {
  const n = norm(text);
  let i = Math.min(...words.map(w => { const k = n.indexOf(w); return k < 0 ? Infinity : k; }));
  if (!isFinite(i)) i = 0;
  const from = Math.max(0, i - 50), to = Math.min(text.length, i + 110);
  return (from > 0 ? '…' : '') + text.slice(from, to) + (to < text.length ? '…' : '');
}
const KIND_SCORE = { Concepto: 8, Término: 8, Región: 7, Autor: 7, Apartado: 6, Sección: 5, Interactivo: 4, Tema: 3, Tarjeta: 2, Pregunta: 1, Texto: 0 };
function doSearch() {
  const q = norm(sIn.value).trim();
  const words = q.split(/\s+/).filter(Boolean);
  if (!words.length) {
    sItems = INDEX.filter(i => i.kind === 'Sección');
  } else {
    const seen = new Set();
    sItems = INDEX.map(i => {
      if (!words.every(w => i.n.includes(w))) return null;
      let sc = KIND_SCORE[i.kind] || 0;
      words.forEach(w => { if (i.nt.includes(w)) sc += 10; if (i.nt.startsWith(w)) sc += 4; });
      if (i.nt === q) sc += 15;
      return { ...i, sc };
    }).filter(Boolean).sort((a, b) => b.sc - a.sc)
      // un solo resultado "en el texto" por apartado
      .filter(i => { if (i.kind !== 'Texto') return true; if (seen.has(i.href)) return false; seen.add(i.href); return true; })
      .slice(0, 40);
  }
  sSel = 0;
  const hw = words.filter(w => w.length > 1);
  sRes.innerHTML = sItems.length
    ? sItems.map((i, k) => `<li><a href="${i.href}" data-red="${i.red || 'base'}" role="option" aria-selected="${k === 0}"><span class="kind">${i.kind === 'Texto' ? 'En el texto' : i.kind}</span><span><span class="t">${hl(i.t, hw)}</span><span class="s">${hl(hw.length ? snippet(i.s, hw) : i.s.slice(0, 140), hw)}</span></span></a></li>`).join('')
    : `<li class="empty">Nada encontrado para "${esc(sIn.value)}". Prueba con otra palabra.</li>`;
}
function goTo(href) {
  closeSearch();
  if (href === location.hash) route(); else location.hash = href;
}
sIn.addEventListener('input', doSearch);
sIn.addEventListener('keydown', e => {
  const links = $$('a', sRes);
  if ((e.key === 'ArrowDown' || e.key === 'ArrowUp') && links.length) {
    e.preventDefault(); sSel = (sSel + (e.key === 'ArrowDown' ? 1 : -1) + links.length) % links.length;
    links.forEach((a, k) => a.setAttribute('aria-selected', String(k === sSel))); links[sSel]?.scrollIntoView({ block: 'nearest' });
  }
  if (e.key === 'Enter' && links[sSel]) { e.preventDefault(); goTo(links[sSel].getAttribute('href')); }
});
sRes.addEventListener('click', e => { const a = e.target.closest('a'); if (a) { e.preventDefault(); goTo(a.getAttribute('href')); } });
sBox.addEventListener('click', e => { if (e.target === sBox) closeSearch(); });
$('#searchClose').addEventListener('click', closeSearch);
$$('[data-open-search]').forEach(b => b.addEventListener('click', openSearch));

// ---------------------------------------------------------------- atajos
addEventListener('keydown', e => {
  const typing = /INPUT|TEXTAREA|SELECT/.test(document.activeElement?.tagName);
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); sBox.hidden ? openSearch() : closeSearch(); return; }
  if (e.key === 'Escape') { if (!sBox.hidden) closeSearch(); closeDrawer(); }
  if (typing || e.ctrlKey || e.metaKey || e.altKey) return;
  if (e.key === '/') { e.preventDefault(); openSearch(); }
  // "b" pliega el menú, salvo donde la tecla ya significa otra cosa (respuesta B del test, juegos, tarjetas)
  if (e.key.toLowerCase() === 'b' && !isMobile() && !document.querySelector('.fcard, .arena, .q-card')) toggleRail();
});

// Con el menú plegado, tocar un bloque o tema lo despliega en vez de abrir un grupo invisible
$('#sbNav').addEventListener('click', e => {
  const sum = e.target.closest('summary');
  if (sum && document.documentElement.classList.contains('rail') && !isMobile()) {
    e.preventDefault(); toggleRail(); sum.parentElement.open = true;
  }
});

// ---------------------------------------------------------------- toast
let toastT;
export function toast(msg) { const t = $('#toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('show'), 2200); }

// ---------------------------------------------------------------- arranque
renderNav();
route();
export { REDES };
