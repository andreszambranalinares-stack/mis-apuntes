// Comprobación automática del temario: node tools/check.mjs
// Revisa que los datos sean coherentes (ids, referencias, respuestas, interactivos…).
import { readFileSync } from 'node:fs';
import { TEMAS } from '../content/indice.js';
import { REGIONES, REDES, RUTAS } from '../content/atlas.js';

const vizSrc = readFileSync(new URL('../assets/js/viz/index.js', import.meta.url), 'utf8');
const VIZ = new Set([...vizSrc.matchAll(/^\s+(\w+): \['/gm)].map(m => m[1]));
const TIPOS = new Set(['p', 'h', 'h3', 'lista', 'concepto', 'pares', 'esencial', 'trampa', 'ejemplo', 'tabla', 'proceso', 'operaciones', 'glosario', 'autores', 'clave', 'noexamen', 'check', 'recurso', 'viz']);
const errors = [], warns = [];
const err = m => errors.push(m), warn = m => warns.push(m);
const slug = s => String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/<[^>]+>/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60);

for (const [id, r] of Object.entries(REGIONES)) {
  if (!['lateral', 'medial'].includes(r.vista)) err(`Región ${id}: vista inválida`);
  if (!(r.x >= 0 && r.x <= 600 && r.y >= 0 && r.y <= 400)) err(`Región ${id}: coordenadas fuera del dibujo`);
  r.redes.forEach(k => { if (!REDES[k]) err(`Región ${id}: red desconocida ${k}`); });
}
for (const [id, ru] of Object.entries(RUTAS)) ru.pasos.forEach(p => { if (!REGIONES[p.r]) err(`Ruta ${id}: región desconocida ${p.r}`); });

const allCardIds = new Set();
for (const t of TEMAS) {
  const where = `Tema ${t.key}`;
  const secIds = new Set();
  for (const s of t.secciones) {
    if (secIds.has(s.id)) err(`${where}: sección duplicada ${s.id}`); secIds.add(s.id);
    if (!t.partes[s.parte]) err(`${where}/${s.id}: parte ${s.parte} no definida`);
    if (!s.bloques.some(b => b.t === 'esencial')) warn(`${where}/${s.id}: sin bloque "esencial"`);
    const hIds = new Set();
    for (const b of s.bloques) {
      if (!TIPOS.has(b.t)) err(`${where}/${s.id}: tipo de bloque desconocido "${b.t}"`);
      if (b.t === 'h') { const id = b.id || slug(b.html); if (hIds.has(id)) err(`${where}/${s.id}: apartado repetido "${id}"`); hIds.add(id); }
      if (b.t === 'viz') {
        if (!VIZ.has(b.id)) err(`${where}/${s.id}: interactivo no registrado "${b.id}"`);
        if (b.id === 'brain') {
          (b.props?.redes || []).forEach(k => { if (!REDES[k]) err(`${where}/${s.id}: red desconocida ${k}`); });
          if (b.props?.ruta && !RUTAS[b.props.ruta]) err(`${where}/${s.id}: ruta desconocida ${b.props.ruta}`);
        }
      }
      if (b.t === 'tabla') b.filas.forEach((f, i) => { if (f.length !== b.cols.length + 1) err(`${where}/${s.id}: tabla "${b.titulo}" fila ${i + 1} con ${f.length - 1} celdas (esperadas ${b.cols.length})`); });
      if (b.t === 'recurso' && b.url === '#') err(`${where}/${s.id}: recurso con url "#"`);
    }
  }
  const nCards = {};
  for (const c of t.tarjetas) {
    if (allCardIds.has(c.id)) err(`Tarjeta duplicada ${c.id}`); allCardIds.add(c.id);
    if (!secIds.has(c.sec)) err(`Tarjeta ${c.id}: sección desconocida ${c.sec}`);
    if (c.region && !REGIONES[c.region]) err(`Tarjeta ${c.id}: región desconocida ${c.region}`);
    if (!c.frente || !c.dorso) err(`Tarjeta ${c.id}: vacía`);
    nCards[c.sec] = (nCards[c.sec] || 0) + 1;
  }
  const qIds = new Set(), nQ = {};
  for (const q of t.test) {
    if (qIds.has(q.id)) err(`${where}: pregunta duplicada ${q.id}`); qIds.add(q.id);
    if (!secIds.has(q.sec)) err(`Pregunta ${q.id}: sección desconocida ${q.sec}`);
    if (!Array.isArray(q.o) || q.o.length < 2) err(`Pregunta ${q.id}: opciones insuficientes`);
    if (!(q.c >= 0 && q.c < q.o.length)) err(`Pregunta ${q.id}: índice de respuesta correcta fuera de rango`);
    if (new Set(q.o).size !== q.o.length) err(`Pregunta ${q.id}: opciones repetidas`);
    if (!q.e) warn(`Pregunta ${q.id}: sin explicación`);
    nQ[q.sec] = (nQ[q.sec] || 0) + 1;
  }
  for (const s of t.secciones) {
    if (!nCards[s.id]) warn(`${where}/${s.id}: sin tarjetas`);
    if (!nQ[s.id] && s.parte !== '0') warn(`${where}/${s.id}: sin preguntas de test`);
  }
  console.log(`${where}: ${t.secciones.length} secciones, ${t.tarjetas.length} tarjetas, ${t.test.length} preguntas, ${t.secciones.reduce((n, s) => n + s.bloques.filter(b => b.t === 'viz').length, 0)} interactivos`);
}
warns.forEach(w => console.log('  aviso:', w));
errors.forEach(e => console.log('  ERROR:', e));
console.log(errors.length ? `\n${errors.length} error(es)` : '\nTodo correcto');
process.exit(errors.length ? 1 : 0);
