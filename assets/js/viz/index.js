// Registro de interactivos: id usado en el contenido → [módulo, export].
// Para añadir uno nuevo: crea la función mount(el, props) en un módulo de esta
// carpeta y regístrala aquí. Ver CLAUDE.md → "Interactivos".
const REG = {
  brain: ['./brain.js', 'default'],
  escalas: ['./escalas.js', 'default'],

  redesTres: ['./diagramas.js', 'redesTres'],
  tdsMatrix: ['./diagramas.js', 'tdsMatrix'],
  dosEjes: ['./diagramas.js', 'dosEjes'],
  vertientes: ['./diagramas.js', 'vertientes'],
  rasgos: ['./diagramas.js', 'rasgos'],
  corbetta: ['./diagramas.js', 'corbetta'],
  redesSwitch: ['./diagramas.js', 'redesSwitch'],
  proactivo: ['./diagramas.js', 'proactivo'],

  tonicaFasica: ['./charts.js', 'tonicaFasica'],
  sdt: ['./charts.js', 'sdt'],
  uInvertida: ['./charts.js', 'uInvertida'],
  soaCurve: ['./charts.js', 'soaCurve'],

  mackworth: ['./juegos.js', 'mackworth'],
  posner: ['./juegos.js', 'posner'],
  busqueda: ['./juegos.js', 'busqueda'],
  conjuncion: ['./juegos.js', 'conjuncion'],
  stroop: ['./juegos.js', 'stroop'],
  gonogo: ['./juegos.js', 'gonogo'],

  negligencia: ['./negligencia.js', 'default'],

  normanShallice: ['./modelos.js', 'normanShallice'],
  inhibicionLateral: ['./modelos.js', 'inhibicionLateral'],
  teatro: ['./modelos.js', 'teatro'],
  reentrante: ['./modelos.js', 'reentrante'],
  gnw: ['./modelos.js', 'gnw'],
  cnc: ['./modelos.js', 'cnc'],
};

export const VIZ_IDS = Object.keys(REG);

export async function loadViz(id) {
  const r = REG[id];
  if (!r) throw new Error('Interactivo no registrado: ' + id);
  const mod = await import(r[0]);
  const fn = mod[r[1]];
  if (typeof fn !== 'function') throw new Error('Export no encontrado: ' + r.join('#'));
  return fn;
}
