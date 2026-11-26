// ============================================================================
// ÍNDICE DEL TEMARIO — punto único de registro.
// Para añadir un tema: crea su carpeta en content/<asig>/<bloque>/<tema>/,
// impórtalo aquí y colócalo en su bloque. Un tema "proximamente: true" sin
// contenido aparece en el menú como hueco reservado.
// ============================================================================
import t3 from './apm/b1/t3/tema.js';
import cv5 from './cv/b1/t5/tema.js';

export const ASIGNATURAS = [
  {
    id: 'apm',
    nombre: 'Atención, percepción y memoria',
    corto: 'APM',
    colores: [['alerta', 'Alerta'], ['orient', 'Orientación'], ['control', 'Control ejecutivo'], ['consc', 'Consciencia'], ['base', 'Marco general']],
    bloques: [
      {
        id: 'b1', num: 'I', nombre: 'Atención', red: 'orient',
        temas: [t3],
      },
    ],
  },
  {
    id: 'cv',
    nombre: 'Ciclo vital',
    corto: 'CV',
    colores: [['base', 'Marco general'], ['fisico', 'Cambios físicos'], ['repro', 'Sexualidad y reproducción'], ['salud', 'Salud'], ['estres', 'Estrés y emociones']],
    bloques: [
      {
        id: 'b1', num: 'I', nombre: 'Adultez media', red: 'salud',
        temas: [cv5],
      },
    ],
  },
];

// Lista plana de temas con su ruta y contexto
export const TEMAS = ASIGNATURAS.flatMap(a => a.bloques.flatMap(b => b.temas.map(t => ({ ...t, key: `${a.id}-${b.id}-${t.id}`, asig: a, bloque: b }))));
export const temaByKey = k => TEMAS.find(t => t.key === k);
