// ============================================================================
// ÍNDICE DEL TEMARIO — punto único de registro.
// Para añadir un tema: crea su carpeta en content/<asig>/<bloque>/<tema>/,
// impórtalo aquí y colócalo en su bloque. Un tema "proximamente: true" sin
// contenido aparece en el menú como hueco reservado.
// ============================================================================
import t3 from './apm/b1/t3/tema.js';

export const ASIGNATURAS = [
  {
    id: 'apm',
    nombre: 'Atención, percepción y memoria',
    corto: 'APM',
    bloques: [
      {
        id: 'b1', num: 'I', nombre: 'Atención', red: 'orient',
        temas: [t3],
      },
    ],
  },
];

// Lista plana de temas con su ruta y contexto
export const TEMAS = ASIGNATURAS.flatMap(a => a.bloques.flatMap(b => b.temas.map(t => ({ ...t, key: `${a.id}-${b.id}-${t.id}`, asig: a, bloque: b }))));
export const temaByKey = k => TEMAS.find(t => t.key === k);
