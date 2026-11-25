// Geometría del cerebro dibujada a mano (viewBox 600×400).
// Ambas vistas con el polo FRONTAL A LA DERECHA para que sean comparables.
// lateral = cara externa del hemisferio derecho · medial = corte sagital.

export const VB = '0 0 600 400';

const CORTEX = 'M 95 250 C 70 190, 100 120, 170 85 C 240 45, 350 40, 430 70 C 500 95, 545 150, 540 215 C 537 255, 515 280, 480 290 C 455 296, 440 300, 425 305 C 430 330, 415 360, 380 365 C 320 372, 250 360, 200 335 C 170 320, 140 300, 120 285 C 105 275, 98 262, 95 250 Z';

export const lateral = {
  cortex: CORTEX,
  behind: [
    { cls: 'cereb', d: 'M 105 318 C 100 290, 150 285, 200 300 C 245 312, 265 330, 255 352 C 240 378, 175 380, 135 365 C 115 357, 107 338, 105 318 Z' },
    { cls: 'deep', d: 'M 262 335 C 265 360, 270 385, 272 400 L 305 400 C 305 380, 310 355, 318 338 Z' },
  ],
  lobes: [
    { cls: 'lf', d: 'M 335 0 L 600 0 L 600 310 L 425 300 L 340 258 L 305 250 L 322 160 L 330 90 L 335 46 Z', lbl: 'Frontal', x: 470, y: 112 },
    { cls: 'lp', d: 'M 160 0 L 335 0 L 335 46 L 330 90 L 322 160 L 305 250 L 268 248 L 228 225 L 175 200 L 140 150 L 160 92 Z', lbl: 'Parietal', x: 238, y: 122 },
    { cls: 'lo', d: 'M 0 0 L 160 0 L 160 92 L 140 150 L 175 200 L 120 300 L 0 300 Z', lbl: 'Occipital', x: 92, y: 172 },
    { cls: 'lt', d: 'M 120 300 L 175 200 L 228 225 L 268 248 L 340 258 L 425 300 L 440 400 L 100 400 Z', lbl: 'Temporal', x: 300, y: 330 },
  ],
  sulci: [
    'M 425 298 C 380 268, 320 252, 268 248 C 248 246, 236 238, 228 225', // cisura lateral (Silvio)
    'M 335 46 C 325 85, 345 120, 322 160 C 308 190, 322 215, 305 250',     // surco central
  ],
  gyri: [
    'M 382 58 C 372 95, 392 130, 368 170 C 356 200, 368 225, 352 258',
    'M 292 52 C 282 90, 300 120, 280 155 C 268 180, 280 205, 268 238',
    'M 400 322 C 350 300, 300 290, 250 280 C 225 275, 205 262, 190 250',
    'M 522 152 C 482 140, 440 142, 400 132',
    'M 528 208 C 488 202, 452 206, 396 200',
    'M 282 150 C 247 140, 212 146, 176 170',
    'M 160 92 C 150 115, 150 135, 140 150',
    'M 130 322 C 160 330, 200 340, 240 340', 'M 118 340 C 150 352, 200 360, 238 356',
  ],
  dirs: [{ x: 548, y: 30, t: 'FRONTAL →' }, { x: 52, y: 30, t: '← OCCIPITAL' }],
};

export const medial = {
  cortex: CORTEX,
  behind: [
    { cls: 'cereb', d: 'M 125 330 C 120 298, 165 290, 215 300 C 250 308, 268 325, 262 350 C 250 378, 190 382, 152 368 C 134 360, 126 346, 125 330 Z' },
  ],
  lobes: [],
  deep: [
    // cuerpo calloso
    { cls: 'deep', d: 'M 205 190 C 230 150, 330 128, 420 160 C 440 168, 445 185, 428 192 C 410 196, 400 182, 380 176 C 320 160, 250 175, 228 200 C 222 210, 205 208, 205 190 Z', lbl: 'cuerpo calloso', x: 318, y: 150 },
    // tálamo
    { cls: 'deep', d: 'M 268 214 C 268 198, 290 192, 312 194 C 334 196, 344 206, 340 220 C 336 232, 300 236, 282 232 C 272 229, 268 222, 268 214 Z' },
    // tronco
    { cls: 'deep', d: 'M 262 238 C 258 268, 268 290, 270 310 C 272 340, 278 370, 282 400 L 318 400 C 318 370, 322 345, 330 320 C 342 296, 332 262, 322 238 Z' },
    { cls: 'deep', d: 'M 300 278 C 330 272, 348 290, 346 306 C 344 324, 322 332, 304 326 Z' },
  ],
  sulci: [
    'M 458 142 C 405 102, 300 92, 205 140',       // surco del cíngulo
    'M 172 108 C 178 140, 166 170, 152 192',     // parieto-occipital
    'M 100 238 C 128 228, 152 214, 168 198',     // calcarina
  ],
  gyri: [
    'M 150 335 C 175 330, 205 330, 240 338', 'M 140 350 C 170 352, 205 356, 238 352', 'M 158 318 C 185 312, 215 314, 245 324',
    'M 500 160 C 470 140, 440 128, 410 120',
  ],
  dirs: [{ x: 548, y: 30, t: 'FRONTAL →' }, { x: 52, y: 30, t: '← OCCIPITAL' }],
};

export const VIEWS = { lateral, medial };

export function brainSVG(view, { inner = '', cls = 'brain-svg', label = '' } = {}) {
  const g = VIEWS[view];
  const id = 'cx' + Math.random().toString(36).slice(2, 8);
  const lobeFill = { lf: 'var(--lobe-f)', lp: 'var(--lobe-p)', lt: 'var(--lobe-t)', lo: 'var(--lobe-o)' };
  return `<svg class="${cls}" viewBox="${VB}" role="img" aria-label="${label || 'Cerebro, vista ' + view}">
    <defs><clipPath id="${id}"><path d="${g.cortex}"/></clipPath></defs>
    ${g.behind.map(p => `<path class="${p.cls}" d="${p.d}"/>`).join('')}
    <path class="cortex" d="${g.cortex}"/>
    <g clip-path="url(#${id})">
      ${g.lobes.map(l => `<path class="lobe" d="${l.d}" style="fill:${lobeFill[l.cls]}"/>`).join('')}
      ${g.gyri.map(d => `<path class="gyri" d="${d}"/>`).join('')}
    </g>
    <path class="cortex" d="${g.cortex}" style="fill:none"/>
    ${(g.deep || []).map(p => `<path class="${p.cls}" d="${p.d}"/>`).join('')}
    ${g.sulci.map(d => `<path class="sulcus" d="${d}"/>`).join('')}
    ${g.lobes.map(l => `<text class="lobe-lbl" x="${l.x}" y="${l.y}" text-anchor="middle">${l.lbl}</text>`).join('')}
    ${g.dirs.map(t => `<text class="dir" x="${t.x}" y="${t.y}" text-anchor="middle">${t.t}</text>`).join('')}
    ${inner}
  </svg>`;
}
