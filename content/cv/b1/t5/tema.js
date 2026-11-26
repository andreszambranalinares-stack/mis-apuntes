import { intro, sentidos, cerebro, estructura, menopausia, masculino } from './parte-1.js';
import { panorama, conducta, desigualdad, genero, posmeno, estres, emociones, efectoEstres } from './parte-2.js';
import tarjetas from './tarjetas.js';
import test from './test.js';

export default {
  id: 't5',
  num: 5,
  titulo: 'Desarrollo físico y salud en la adultez media',
  corto: 'Adultez media: físico y salud',
  resumen: 'La edad media como constructo social, los cambios sensoriales, cerebrales, corporales y reproductivos (menopausia), y la salud física y mental: hábitos, desigualdades, género y estrés.',
  redes: ['base', 'fisico', 'repro', 'salud', 'estres'],
  partes: {
    '0': { titulo: 'Para empezar', red: 'base' },
    I: { titulo: 'Cambios físicos', red: 'fisico', desc: 'Sentidos y psicomotricidad, cerebro, estructuras y sistemas, y sexualidad y reproducción.' },
    II: { titulo: 'Salud física y mental', red: 'salud', desc: 'Tendencias de salud, conducta, desigualdades, género, riesgos tras la menopausia y estrés.' },
  },
  // Nodos del mapa conceptual del tema (pages.js → mapaTema)
  mapa: {
    centro: ['Adultez media', '40–65 AÑOS · CAP. 15'],
    nodos: [
      { label: 'Constructo social', red: 'base', sec: 'intro' },
      { label: 'Sentidos y cuerpo', red: 'fisico', sec: 'sentidos' },
      { label: 'Menopausia', red: 'repro', sec: 'menopausia' },
      { label: 'Salud', red: 'salud', sec: 'panorama' },
      { label: 'Estrés', red: 'estres', sec: 'estres' },
    ],
  },
  secciones: [intro, sentidos, cerebro, estructura, menopausia, masculino, panorama, conducta, desigualdad, genero, posmeno, estres, emociones, efectoEstres],
  tarjetas,
  test,
  referencias: [
    { t: 'Papalia, D. E. y Martorell, G. Desarrollo humano. McGraw-Hill. Capítulo 15: Desarrollo físico y cognoscitivo en la adultez media.', main: true, nota: 'Material del tema: apartados "Edad media: un constructo social", "Cambios físicos" y "Salud física y mental".' },
  ],
};
