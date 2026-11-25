// Persistencia local (solo en este navegador). Todo va envuelto en try/catch:
// en modo privado o con almacenamiento bloqueado la web sigue funcionando.
const P = 'ma:';
const mem = {};

export function get(key, fallback) {
  try { const v = localStorage.getItem(P + key); return v == null ? fallback : JSON.parse(v); }
  catch { return key in mem ? mem[key] : fallback; }
}
export function set(key, val) {
  mem[key] = val;
  try { localStorage.setItem(P + key, JSON.stringify(val)); } catch { /* sin almacenamiento */ }
}

// ---- Progreso de lectura ----
export const isDone = (temaId, secId) => !!get('done', {})[`${temaId}/${secId}`];
export function toggleDone(temaId, secId) {
  const d = get('done', {}); const k = `${temaId}/${secId}`;
  if (d[k]) delete d[k]; else d[k] = Date.now();
  set('done', d); return !!d[k];
}
export function temaProgress(tema) {
  const d = get('done', {});
  const n = tema.secciones.filter(s => d[`${tema.id}/${s.id}`]).length;
  return { n, total: tema.secciones.length, pct: tema.secciones.length ? n / tema.secciones.length : 0 };
}

// ---- Tarjetas: sistema Leitner (cajas 1–5) ----
// caja 1: cada sesión · 2: 1 día · 3: 3 días · 4: 7 días · 5: 16 días
const INTERVAL_DAYS = [0, 0, 1, 3, 7, 16];
export function cardState(id) { return get('cards', {})[id] || { box: 0, due: 0 }; }
export function gradeCard(id, grade) {
  const all = get('cards', {});
  const cur = all[id] || { box: 0, due: 0 };
  let box = cur.box || 1;
  if (grade === 3) box = Math.min(5, box + 1);
  else if (grade === 2) box = Math.max(1, box);
  else box = 1;
  const due = Date.now() + INTERVAL_DAYS[box] * 864e5 + (grade === 1 ? 0 : 1);
  all[id] = { box, due, seen: (cur.seen || 0) + 1 };
  set('cards', all);
  return all[id];
}
export function isDue(id) { const s = cardState(id); return !s.box || s.due <= Date.now(); }

// ---- Test ----
export function saveQuiz(key, score, total) {
  const q = get('quiz', {});
  const prev = q[key] || { best: 0, tries: 0 };
  q[key] = { best: Math.max(prev.best, score / total), last: score / total, tries: prev.tries + 1, at: Date.now() };
  set('quiz', q);
}
export const quizStats = key => get('quiz', {})[key];
