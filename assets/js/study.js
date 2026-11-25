// Tarjetas (sistema Leitner) y test tipo examen
import { TEMAS, temaByKey } from '../../content/indice.js';
import { REGIONES } from '../../content/atlas.js';
import { VIEWS, VB } from './viz/brain-geo.js';
import * as store from './store.js';
import { esc, shuffle, icon } from './util.js';

const secOf = (t, id) => t.secciones.find(s => s.id === id);
const BOX_COLORS = ['var(--bad)', 'var(--alerta)', 'var(--orient)', 'var(--consc)', 'var(--ok)'];

function scopeSelect(kind, key, secId) {
  const opts = [`<option value="#/${kind}">Todo el temario</option>`];
  for (const t of TEMAS) {
    opts.push(`<option value="#/${kind}/${t.key}" ${key === t.key && !secId ? 'selected' : ''}>Tema ${t.num} completo</option>`);
    for (const s of t.secciones) {
      const n = kind === 'tarjetas' ? t.tarjetas.filter(c => c.sec === s.id).length : t.test.filter(q => q.sec === s.id).length;
      if (n) opts.push(`<option value="#/${kind}/${t.key}/${s.id}" ${key === t.key && secId === s.id ? 'selected' : ''}>&nbsp;&nbsp;${s.num} · ${esc(s.titulo)} (${n})</option>`);
    }
  }
  return `<label class="slider" style="flex:1 1 280px;min-width:0;max-width:460px"><span class="sr-only">Qué estudiar</span>
    <select data-scope style="width:100%;text-overflow:ellipsis;min-height:44px;border-radius:11px;border:1.5px solid var(--line-2);background:var(--card);color:var(--ink);padding:0 12px;font:inherit;font-weight:700">${opts.join('')}</select></label>`;
}

function miniBrain(regionId) {
  const r = REGIONES[regionId]; if (!r) return '';
  const g = VIEWS[r.vista];
  return `<svg class="mini-brain" viewBox="${VB}" aria-hidden="true"><path class="cortex" d="${g.cortex}"/>${g.sulci.map(d => `<path class="sulcus" d="${d}"/>`).join('')}${(g.deep || []).map(p => `<path class="sulcus" d="${p.d}"/>`).join('')}
    <circle class="ring" cx="${r.x}" cy="${r.y}" r="34"/><circle class="spot" cx="${r.x}" cy="${r.y}" r="15"/></svg>`;
}

// ============================================================ TARJETAS
export function pageTarjetas(key, secId) {
  const temas = key ? [temaByKey(key)].filter(Boolean) : TEMAS;
  let cards = temas.flatMap(t => t.tarjetas.filter(c => !secId || c.sec === secId).map(c => ({ ...c, tema: t, s: secOf(t, c.sec) })));
  const t0 = temas[0];
  const scopeName = secId ? `${secOf(t0, secId)?.num} · ${secOf(t0, secId)?.titulo}` : key ? `Tema ${t0?.num}` : 'Todo el temario';

  const html = `<div class="page"><div class="page-wide" style="max-width:900px">
    <header class="sec-hero" data-red="base">
      <div class="eyebrow"><span class="pill">Tarjetas</span>Repetición espaciada</div>
      <h1>Fichas de <em>repaso</em></h1>
      <p class="lead">Mira la pregunta, intenta responder en voz alta y gira la ficha. Según lo que contestes, la tarjeta vuelve antes o más tarde: lo que te cuesta lo verás más a menudo.</p>
    </header>
    <div class="study-bar">${scopeSelect('tarjetas', key, secId)}
      <div class="seg" role="group" aria-label="Modo"><button data-mode="due" aria-pressed="true">Pendientes</button><button data-mode="all" aria-pressed="false">Todas</button><button data-mode="list" aria-pressed="false">Lista</button></div>
    </div>
    <div class="boxes" id="boxes"></div>
    <div id="deckArea"></div>
  </div></div>`;

  return {
    html, title: 'Tarjetas', crumbs: [{ t: 'Inicio', h: '#/' }, { t: 'Tarjetas' }, { t: scopeName }],
    mount(root, cleanups) {
      root.querySelector('[data-scope]').addEventListener('change', e => (location.hash = e.target.value));
      let mode = 'due';
      const area = root.querySelector('#deckArea');
      const boxesEl = root.querySelector('#boxes');
      const paintBoxes = () => {
        const counts = [0, 0, 0, 0, 0, 0];
        cards.forEach(c => counts[store.cardState(c.id).box || 0]++);
        const labels = ['Sin ver', 'Caja 1', 'Caja 2', 'Caja 3', 'Caja 4', 'Dominadas'];
        boxesEl.innerHTML = [0, 1, 2, 3, 4, 5].filter(i => i !== 0).map(i => `<div class="box" style="--bc:${BOX_COLORS[i - 1]}"><div class="v">${counts[i] + (i === 1 ? counts[0] : 0)}</div><div class="l">${i === 1 ? 'Nuevas + caja 1' : labels[i]}</div></div>`).join('');
      };
      root.querySelectorAll('[data-mode]').forEach(b => b.addEventListener('click', () => {
        mode = b.dataset.mode; root.querySelectorAll('[data-mode]').forEach(x => x.setAttribute('aria-pressed', String(x === b))); start();
      }));

      let queue = [], idx = 0, flipped = false, stats = { ok: 0, mid: 0, bad: 0 };
      function start() {
        paintBoxes();
        if (mode === 'list') return renderList();
        queue = mode === 'due' ? cards.filter(c => store.isDue(c.id)) : [...cards];
        queue = shuffle(queue).sort((a, b) => (store.cardState(a.id).box || 0) - (store.cardState(b.id).box || 0));
        idx = 0; stats = { ok: 0, mid: 0, bad: 0 };
        renderCard();
      }
      function renderList() {
        area.innerHTML = `<div class="cardlist">${cards.map(c => `<details data-red="${c.s?.red || 'base'}"><summary><span>${c.frente}</span><span class="lv">${store.cardState(c.id).box ? 'caja ' + store.cardState(c.id).box : 'nueva'}</span></summary><div class="a">${c.dorso}</div></details>`).join('')}</div>`;
      }
      function renderCard() {
        flipped = false;
        if (idx >= queue.length) {
          const total = stats.ok + stats.mid + stats.bad;
          area.innerHTML = `<div class="deck"><div class="deck-done"><div class="big">${total ? '🎉' : '✅'}</div>
            <h3>${total ? '¡Sesión terminada!' : 'No hay tarjetas pendientes'}</h3>
            <p>${total ? `${stats.ok} sabidas · ${stats.mid} dudosas · ${stats.bad} por repasar` : 'Vuelve más tarde o repasa todas igualmente.'}</p>
            <div class="study-links" style="justify-content:center"><button class="btn primary" data-again>${icon('play')}Repasar todas</button><a class="btn" href="#/test${key ? '/' + key : ''}${secId ? '/' + secId : ''}">Ir al test</a></div></div></div>`;
          area.querySelector('[data-again]').addEventListener('click', () => { mode = 'all'; root.querySelectorAll('[data-mode]').forEach(x => x.setAttribute('aria-pressed', String(x.dataset.mode === 'all'))); start(); });
          paintBoxes();
          return;
        }
        const c = queue[idx];
        const tab = `${c.s?.num || ''} · ${c.s?.titulo || ''}`;
        const mb = c.region ? miniBrain(c.region) : '';
        area.innerHTML = `<div class="deck" data-red="${c.s?.red || 'base'}">
          <div class="deck-count">${idx + 1} / ${queue.length}</div>
          <div class="fcard" tabindex="0" role="button" aria-label="Tarjeta. Pulsa para girar">
            <div class="inner">
              <div class="face front" data-tab="${esc(tab)}"><div class="lines"></div><div class="redline"></div>
                <div class="fc-body${mb ? '' : ' solo'}"><div><div class="term">${c.frente}</div><div class="hint">Piensa la respuesta y gira la ficha</div></div>${mb}</div>
                <span class="turn">toca para girar ↻</span></div>
              <div class="face back" data-tab="Respuesta"><div class="lines"></div><div class="redline"></div>
                <div class="fc-body solo"><div class="ans">${c.dorso}</div></div>
                <span class="turn">¿qué tal?</span></div>
            </div>
          </div>
          <div class="grade" role="group" aria-label="¿La sabías?">
            <button class="g1" data-g="1" disabled>No me la sé<small>vuelve hoy</small></button>
            <button class="g2" data-g="2" disabled>Dudosa<small>repítela pronto</small></button>
            <button class="g3" data-g="3" disabled>Me la sé<small>más tarde</small></button>
          </div>
          <div class="keys-help"><span><kbd>Espacio</kbd> girar</span><span><kbd>1</kbd><kbd>2</kbd><kbd>3</kbd> calificar</span></div>
        </div>`;
        const fc = area.querySelector('.fcard');
        fc.addEventListener('click', flip);
        area.querySelectorAll('[data-g]').forEach(b => b.addEventListener('click', () => grade(+b.dataset.g)));
        fc.focus({ preventScroll: true });
      }
      function flip() {
        const fc = area.querySelector('.fcard'); if (!fc) return;
        flipped = !flipped; fc.classList.toggle('flipped', flipped);
        area.querySelectorAll('[data-g]').forEach(b => (b.disabled = !flipped));
      }
      function grade(g) {
        if (!flipped) return;
        const c = queue[idx];
        store.gradeCard(c.id, g);
        stats[g === 3 ? 'ok' : g === 2 ? 'mid' : 'bad']++;
        if (g === 1) queue.push(c); // vuelve al final de la sesión
        idx++; paintBoxes(); renderCard();
      }
      const onKey = e => {
        if (mode === 'list' || /INPUT|SELECT|TEXTAREA/.test(document.activeElement?.tagName)) return;
        if (e.key === ' ' || e.key === 'Enter') { if (document.activeElement?.closest('button,a,select')) return; e.preventDefault(); flip(); }
        if (['1', '2', '3'].includes(e.key)) grade(+e.key);
      };
      addEventListener('keydown', onKey); cleanups.push(() => removeEventListener('keydown', onKey));
      // deslizar en la tarjeta: derecha = me la sé, izquierda = no
      let sx = null;
      area.addEventListener('touchstart', e => { if (e.target.closest('.fcard')) sx = e.touches[0].clientX; }, { passive: true });
      area.addEventListener('touchend', e => { if (sx == null || !flipped) { sx = null; return; } const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 80) grade(dx > 0 ? 3 : 1); sx = null; }, { passive: true });
      start();
    },
  };
}

// ============================================================ TEST
export function pageTest(key, secId) {
  const temas = key ? [temaByKey(key)].filter(Boolean) : TEMAS;
  const pool = temas.flatMap(t => t.test.filter(q => !secId || q.sec === secId).map(q => ({ ...q, tema: t, s: secOf(t, q.sec) })));
  const qKey = `${key || 'all'}/${secId || 'all'}`;
  const prevStats = store.quizStats(qKey);
  const t0 = temas[0];
  const scopeName = secId ? `${secOf(t0, secId)?.num} · ${secOf(t0, secId)?.titulo}` : key ? `Tema ${t0?.num}` : 'Todo el temario';

  const html = `<div class="page"><div class="page-wide" style="max-width:900px">
    <header class="sec-hero" data-red="base">
      <div class="eyebrow"><span class="pill">Test</span>Tipo examen · ${pool.length} preguntas</div>
      <h1>Ponte a <em>prueba</em></h1>
      <p class="lead">Preguntas de opción múltiple con explicación inmediata. Los fallos se guardan al final para que los repases. ${prevStats ? `Tu mejor nota aquí: <b>${(prevStats.best * 10).toFixed(1)}</b>/10.` : ''}</p>
    </header>
    <div class="study-bar">${scopeSelect('test', key, secId)}
      <div class="seg" role="group" aria-label="Número de preguntas"><button data-n="10" aria-pressed="true">10</button><button data-n="20" aria-pressed="false">20</button><button data-n="999" aria-pressed="false">Todas</button></div>
    </div>
    <div class="quiz" id="quiz"></div>
  </div></div>`;

  return {
    html, title: 'Test', crumbs: [{ t: 'Inicio', h: '#/' }, { t: 'Test' }, { t: scopeName }],
    mount(root, cleanups) {
      root.querySelector('[data-scope]').addEventListener('change', e => (location.hash = e.target.value));
      const box = root.querySelector('#quiz');
      let n = 10, qs = [], i = 0, results = [];
      root.querySelectorAll('[data-n]').forEach(b => b.addEventListener('click', () => { n = +b.dataset.n; root.querySelectorAll('[data-n]').forEach(x => x.setAttribute('aria-pressed', String(x === b))); start(); }));
      function start() {
        qs = shuffle(pool).slice(0, Math.min(n, pool.length)).map(q => {
          const order = shuffle(q.o.map((_, k) => k));
          return { ...q, opts: order.map(k => q.o[k]), correct: order.indexOf(q.c) };
        });
        i = 0; results = []; render();
      }
      function progress() { return `<div class="q-progress" aria-hidden="true">${qs.map((_, k) => `<span class="${results[k] === true ? 'ok' : results[k] === false ? 'bad' : k === i ? 'cur' : ''}"></span>`).join('')}</div>`; }
      function render() {
        if (!qs.length) { box.innerHTML = `<p>No hay preguntas en este apartado.</p>`; return; }
        if (i >= qs.length) return finish();
        const q = qs[i];
        box.innerHTML = `${progress()}<div class="q-card" data-red="${q.s?.red || 'base'}">
          <div class="q-meta"><span>Pregunta ${i + 1} de ${qs.length}</span><a href="#/tema/${q.tema.key}/${q.sec}">${q.s?.num} · ${esc(q.s?.titulo)}</a></div>
          <div class="q-text">${q.q}</div>
          <div class="q-opts" role="group">${q.opts.map((o, k) => `<button class="q-opt" data-k="${k}"><span class="L">${'ABCD'[k]}</span><span>${o}</span></button>`).join('')}</div>
          <div id="qExpl"></div>
          <div class="q-nav"><span></span><button class="btn primary" data-next hidden>${i + 1 < qs.length ? 'Siguiente' : 'Ver resultado'} →</button></div></div>`;
        box.querySelectorAll('.q-opt').forEach(b => b.addEventListener('click', () => answer(+b.dataset.k)));
      }
      function answer(k) {
        const q = qs[i]; if (results[i] !== undefined) return;
        const ok = k === q.correct; results[i] = ok;
        box.querySelectorAll('.q-opt').forEach(b => { const kk = +b.dataset.k; b.disabled = true; if (kk === q.correct) b.classList.add('ok'); else if (kk === k) b.classList.add('bad'); });
        box.querySelector('#qExpl').innerHTML = `<div class="q-expl${ok ? '' : ' badx'}"><b class="t">${ok ? '✓ ¡Correcto!' : '✗ No es esa'}</b>${q.e}</div>`;
        const nx = box.querySelector('[data-next]'); nx.hidden = false; nx.focus(); nx.addEventListener('click', () => { i++; render(); });
        box.querySelector('.q-progress').outerHTML = progress();
      }
      function finish() {
        const ok = results.filter(Boolean).length, total = qs.length;
        store.saveQuiz(qKey, ok, total);
        const nota = (ok / total) * 10;
        const R = 66, C = 2 * Math.PI * R;
        const wrong = qs.filter((_, k) => !results[k]);
        box.innerHTML = `<div class="q-score">
          <svg class="ring" viewBox="0 0 160 160"><circle cx="80" cy="80" r="${R}" fill="none" stroke="var(--line)" stroke-width="12"/>
            <circle cx="80" cy="80" r="${R}" fill="none" stroke="${nota >= 5 ? 'var(--ok)' : 'var(--bad)'}" stroke-width="12" stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${C * (1 - ok / total)}" transform="rotate(-90 80 80)" style="transition:stroke-dashoffset 1s"/>
            <text x="80" y="86" text-anchor="middle" style="font:800 34px var(--f-display);fill:var(--ink)">${nota.toFixed(1)}</text><text x="80" y="108" text-anchor="middle" class="svgmono" style="font-size:11px">sobre 10</text></svg>
          <h3>${nota >= 9 ? '¡Bordado!' : nota >= 7 ? '¡Muy bien!' : nota >= 5 ? 'Aprobado, a pulir' : 'Toca repasar'}</h3>
          <p>${ok} de ${total} correctas.</p>
          <div class="study-links" style="justify-content:center;margin-top:16px"><button class="btn primary" data-again>${icon('play')}Otro intento</button><a class="btn" href="#/tarjetas${key ? '/' + key : ''}${secId ? '/' + secId : ''}">Repasar tarjetas</a></div>
          ${wrong.length ? `<div class="q-review"><h4 style="font-family:var(--f-display);margin:0">Para repasar</h4>${wrong.map(q => `<div><b>${q.q}</b>Correcta: ${q.o[q.c]}. ${q.e} <a href="#/tema/${q.tema.key}/${q.sec}">Ir a ${q.s?.num}</a></div>`).join('')}</div>` : ''}
        </div>`;
        box.querySelector('[data-again]').addEventListener('click', start);
      }
      const onKey = e => {
        if (/INPUT|SELECT|TEXTAREA/.test(document.activeElement?.tagName)) return;
        const k = 'abcd'.indexOf(e.key.toLowerCase()); if (k >= 0 && qs[i] && results[i] === undefined && k < qs[i].opts.length) answer(k);
      };
      addEventListener('keydown', onKey); cleanups.push(() => removeEventListener('keydown', onKey));
      start();
    },
  };
}
