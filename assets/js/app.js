// Mis Apuntes — arranque, router por hash y armazón (menú, búsqueda, tema).
import { ASIGNATURAS, TEMAS } from '../../content/indice.js';
import { REDES } from '../../content/atlas.js';
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
function buildIndex() {
  INDEX = [];
  for (const t of TEMAS) {
    INDEX.push({ kind: 'Tema', t: `Tema ${t.num} · ${t.titulo}`, s: t.resumen, href: `#/tema/${t.key}`, red: 'base' });
    for (const s of t.secciones) {
      INDEX.push({ kind: 'Sección', t: `${s.num} · ${s.titulo}`, s: s.lead, href: `#/tema/${t.key}/${s.id}`, red: s.red });
      let curH = null;
      for (const b of s.bloques) {
        if (b.t === 'h') curH = b.id || b.html.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/<[^>]+>/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60);
        const anchor = curH ? `?a=${curH}` : '';
        if (b.t === 'concepto') INDEX.push({ kind: 'Concepto', t: plain(b.titulo), s: plain(b.def), href: `#/tema/${t.key}/${s.id}${anchor}`, red: b.red || s.red });
        if (b.t === 'glosario') b.items.forEach(([term, d]) => INDEX.push({ kind: 'Término', t: plain(term), s: plain(d), href: `#/tema/${t.key}/${s.id}${anchor}`, red: s.red }));
        if (b.t === 'pares') [b.a, b.b].forEach(p => INDEX.push({ kind: 'Concepto', t: plain(p.titulo), s: plain(p.texto || (p.items || []).join(' ')), href: `#/tema/${t.key}/${s.id}${anchor}`, red: s.red }));
        if (b.t === 'autores') b.items.forEach(a => INDEX.push({ kind: 'Autor', t: plain(a.quien), s: plain(a.idea), href: `#/tema/${t.key}/${s.id}${anchor}`, red: s.red }));
        if (b.t === 'viz') INDEX.push({ kind: 'Interactivo', t: plain(b.titulo), s: plain(b.desc), href: `#/tema/${t.key}/${s.id}${anchor}`, red: s.red });
        if (b.t === 'h') INDEX.push({ kind: 'Apartado', t: plain(b.html), s: s.titulo, href: `#/tema/${t.key}/${s.id}${anchor}`, red: s.red });
      }
    }
    for (const c of t.tarjetas) INDEX.push({ kind: 'Tarjeta', t: plain(c.frente), s: plain(c.dorso), href: `#/tarjetas/${t.key}/${c.sec}`, red: t.secciones.find(s => s.id === c.sec)?.red });
  }
  import('../../content/atlas.js').then(({ REGIONES }) => Object.values(REGIONES).forEach(r => INDEX.push({ kind: 'Región', t: r.nombre, s: r.aka + ' · ' + r.funcion, href: '#/atlas', red: 'base' })));
  INDEX.forEach(i => (i.n = norm(i.t + ' ' + i.s), i.nt = norm(i.t)));
}

const sBox = $('#search'), sIn = $('#searchInput'), sRes = $('#searchResults');
let sSel = 0, sItems = [];
function openSearch() { if (!INDEX) buildIndex(); sBox.hidden = false; sIn.value = ''; doSearch(); setTimeout(() => sIn.focus(), 10); }
function closeSearch() { sBox.hidden = true; }
function hl(text, q) {
  const words = q.split(/\s+/).filter(w => w.length > 1); let out = esc(text);
  if (!words.length) return out;
  const n = norm(text); const marks = [];
  words.forEach(w => { let i = n.indexOf(w); if (i >= 0) marks.push([i, i + w.length]); });
  if (!marks.length) return out;
  marks.sort((a, b) => a[0] - b[0]);
  let res = '', last = 0;
  for (const [a, b] of marks) { if (a < last) continue; res += esc(text.slice(last, a)) + '<mark>' + esc(text.slice(a, b)) + '</mark>'; last = b; }
  return res + esc(text.slice(last));
}
function doSearch() {
  const q = norm(sIn.value);
  if (!q) {
    sItems = INDEX.filter(i => i.kind === 'Sección').slice(0, 30);
  } else {
    const words = q.split(/\s+/).filter(Boolean);
    sItems = INDEX.map(i => {
      if (!words.every(w => i.n.includes(w))) return null;
      let sc = 0; words.forEach(w => { if (i.nt.includes(w)) sc += 10; if (i.nt.startsWith(w)) sc += 5; });
      sc += { Concepto: 6, Término: 6, Sección: 5, Autor: 5, Región: 4, Apartado: 3, Interactivo: 3, Tarjeta: 1, Tema: 2 }[i.kind] || 0;
      return { ...i, sc };
    }).filter(Boolean).sort((a, b) => b.sc - a.sc).slice(0, 40);
  }
  sSel = 0;
  sRes.innerHTML = sItems.length ? sItems.map((i, k) => `<li><a href="${i.href}" data-red="${i.red || 'base'}" role="option" aria-selected="${k === 0}"><span class="kind">${i.kind}</span><span><span class="t">${hl(i.t, q)}</span><span class="s">${hl(i.s.slice(0, 140), q)}</span></span></a></li>`).join('')
    : `<li class="empty">Nada encontrado para "${esc(sIn.value)}".</li>`;
}
sIn.addEventListener('input', doSearch);
sIn.addEventListener('keydown', e => {
  const links = $$('a', sRes);
  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
    e.preventDefault(); sSel = (sSel + (e.key === 'ArrowDown' ? 1 : -1) + links.length) % links.length;
    links.forEach((a, k) => a.setAttribute('aria-selected', String(k === sSel))); links[sSel]?.scrollIntoView({ block: 'nearest' });
  }
  if (e.key === 'Enter' && links[sSel]) { location.hash = links[sSel].getAttribute('href'); closeSearch(); }
});
sRes.addEventListener('click', e => { if (e.target.closest('a')) closeSearch(); });
sBox.addEventListener('click', e => { if (e.target === sBox) closeSearch(); });
$$('[data-open-search]').forEach(b => b.addEventListener('click', openSearch));

// ---------------------------------------------------------------- atajos
addEventListener('keydown', e => {
  const typing = /INPUT|TEXTAREA|SELECT/.test(document.activeElement?.tagName);
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); sBox.hidden ? openSearch() : closeSearch(); return; }
  if (e.key === 'Escape') { if (!sBox.hidden) closeSearch(); closeDrawer(); }
  if (typing || e.ctrlKey || e.metaKey || e.altKey) return;
  if (e.key === '/') { e.preventDefault(); openSearch(); }
  if (e.key.toLowerCase() === 'b' && !isMobile() && !document.querySelector('.fcard, .arena')) toggleRail();
});

// ---------------------------------------------------------------- toast
let toastT;
export function toast(msg) { const t = $('#toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('show'), 2200); }

// ---------------------------------------------------------------- arranque
renderNav();
route();
export { REDES };
