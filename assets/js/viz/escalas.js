// Las tres escalas del estudio del cerebro (espacial, topológica, temporal)
import { esc } from '../util.js';

const AX = [
  { id: 'esp', nombre: 'Espacial', q: '¿Dónde ocurre?', c: '#D2453B', niveles: [
    ['Celular', 'Neuronas individuales y sus sinapsis.'],
    ['Poblaciones', 'Ensamblajes neuronales que se activan de forma coordinada para procesar información.'],
    ['Regiones', 'Áreas cerebrales con funciones específicas, como la corteza visual o la motora.'],
  ] },
  { id: 'top', nombre: 'Topológica', q: '¿Cómo está conectada?', c: '#1C9C8E', niveles: [
    ['Local', 'Conectividad entre neuronas o microcircuitos cercanos.'],
    ['Mesoescala', 'Conjuntos o módulos de neuronas interconectadas.'],
    ['Global', 'Grandes redes funcionales que comunican todas las áreas (p. ej., red por defecto, control ejecutivo).'],
  ] },
  { id: 'tmp', nombre: 'Temporal', q: '¿Cuándo ocurre?', c: '#7B4FB3', niveles: [
    ['Instantánea', 'Procesos en segundos, observables con EEG o fMRI (cambios de activación durante una tarea).'],
    ['Vida', 'Desarrollo a lo largo de la vida: cómo cambian las redes con la madurez o el envejecimiento.'],
    ['Evolutiva', 'Comparación de la organización cerebral entre especies.'],
  ] },
];

export default function mount(el) {
  let sel = { ax: 'top', lv: 2 };
  // geometría: origen (90,300); espacial ↑, topológica →, temporal ↗ (perspectiva)
  const O = [90, 300];
  const dir = { esp: [0, -230], top: [300, 0], tmp: [170, -120] };
  const pt = (ax, t) => [O[0] + dir[ax][0] * t, O[1] + dir[ax][1] * t];

  el.innerHTML = `<div class="viz-body"><div class="split">
      <svg viewBox="0 0 440 340" class="chart" role="img" aria-label="Tres ejes: espacial, topológico y temporal"><g class="axes"></g></svg>
      <div class="axes-legend"></div></div></div>`;
  const g = el.querySelector('.axes'), leg = el.querySelector('.axes-legend');

  function draw() {
    g.innerHTML = AX.map(a => {
      const [x2, y2] = pt(a.id, 1.06);
      const on = sel.ax === a.id;
      const ticks = a.niveles.map((n, i) => {
        const [x, y] = pt(a.id, (i + 1) / 3.2);
        const act = on && sel.lv === i;
        const lx = a.id === 'esp' ? x - 12 : x, ly = a.id === 'esp' ? y + 4 : a.id === 'top' ? y + 22 : y - 12;
        return `<g style="cursor:pointer" data-ax="${a.id}" data-lv="${i}">
          <circle cx="${x}" cy="${y}" r="${act ? 11 : 7}" fill="${act ? a.c : 'var(--card)'}" stroke="${a.c}" stroke-width="2.5"/>
          <text x="${lx}" y="${ly}" text-anchor="${a.id === 'esp' ? 'end' : 'middle'}" style="font:700 11.5px var(--f-body);fill:${act ? a.c : 'var(--ink-2)'}">${n[0]}</text></g>`;
      }).join('');
      return `<line x1="${O[0]}" y1="${O[1]}" x2="${x2}" y2="${y2}" stroke="${a.c}" stroke-width="${on ? 5 : 3}" stroke-linecap="round" opacity="${on ? 1 : .55}"/>
        <path d="M ${x2} ${y2} l ${a.id === 'esp' ? '-7 12 14 0' : a.id === 'top' ? '-12 -7 0 14' : '-14 0 6 12'} z" fill="${a.c}"/>
        <text x="${x2 + (a.id === 'top' ? -10 : 8)}" y="${y2 + (a.id === 'top' ? -14 : a.id === 'esp' ? 2 : -8)}" text-anchor="${a.id === 'top' ? 'end' : 'start'}" style="font:800 13px var(--f-display);fill:${a.c}">${a.nombre.toUpperCase()}</text>${ticks}`;
    }).join('') + `<circle cx="${O[0]}" cy="${O[1]}" r="5" fill="var(--ink)"/>`;
    leg.innerHTML = AX.map(a => `<div class="axis-card" style="--c:${a.c}">
      <h5>${a.nombre} · ${a.q}</h5>
      <p>${sel.ax === a.id ? esc(a.niveles[sel.lv][1]) : 'Toca un nivel para verlo.'}</p>
      <div class="levels">${a.niveles.map((n, i) => `<button data-ax="${a.id}" data-lv="${i}" aria-pressed="${sel.ax === a.id && sel.lv === i}">${i + 1}. ${n[0]}</button>`).join('')}</div></div>`).join('');
  }
  el.addEventListener('click', e => {
    const t = e.target.closest('[data-ax]'); if (!t) return;
    sel = { ax: t.dataset.ax, lv: +t.dataset.lv }; draw();
  });
  draw();
}
