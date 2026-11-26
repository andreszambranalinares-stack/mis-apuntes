import { intro, posner, alerta, vigilancia, alertaMec, orientacion, orientacionMec, control, normanShallice, controlMec } from './parte-1.js';
import { consciencia, estructura, teorias, reentrante, gnw, fundamentos } from './parte-2.js';
import tarjetas from './tarjetas.js';
import test from './test.js';

export default {
  id: 't3',
  num: 3,
  titulo: 'Enfoques recientes sobre la atención y su relación con la consciencia',
  corto: 'Atención y consciencia',
  resumen: 'El modelo de redes de Posner y Petersen (alerta, orientación y control ejecutivo) y las grandes teorías de la consciencia.',
  redes: ['alerta', 'orient', 'control', 'consc'],
  mapa: 'posner',
  partes: {
    '0': { titulo: 'Para empezar', red: 'base' },
    I: { titulo: 'El modelo de atención de Posner y Petersen', red: 'orient', desc: 'Tres redes con circuitos propios: alerta, orientación y control ejecutivo.' },
    II: { titulo: 'La consciencia humana', red: 'consc', desc: 'Qué es, cómo se organiza, qué teorías la explican y en qué se apoya en el cerebro.' },
  },
  secciones: [intro, posner, alerta, vigilancia, alertaMec, orientacion, orientacionMec, control, normanShallice, controlMec, consciencia, estructura, teorias, reentrante, gnw, fundamentos],
  tarjetas,
  test,
  referencias: [
    { t: 'Bajo Molina, T., Fuentes Melero, L. J., Lupiáñez Castillo, J. y Rueda Cuerva, C. (Coords.) (2016). Mente y cerebro. De la Psicología experimental a la Neurociencia cognitiva. Alianza Editorial.', main: true, nota: 'Lectura principal: capítulos 1, 8, 9 y 10.' },
    { t: '3D brain (s. f.). BrainFacts.org.' },
    { t: 'Fan, J. y Posner, M. (2004). Human attentional networks. Psychiatrische Praxis, 31(S 2), 210-214.' },
    { t: 'Graner, J., Oakes, T. R., French, L. M. y Riedy, G. (2013). Functional MRI in the investigation of blast-related traumatic brain injury. Frontiers in Neurology, 4, 16.' },
    { t: 'León-Domínguez, U. y León-Carrión, J. (2019). Modelo neurofuncional de la consciencia: bases neurofisiológicas y cognitivas. Revista de Neurología, 69, 159-66.' },
    { t: 'Posner, M. I. (2012). Attentional networks and consciousness. Frontiers in Psychology, 3, 64.' },
    { t: 'Santiago de Torres, J. (2006). Procesos psicológicos básicos (2.ª ed.). McGraw-Hill.' },
    { t: 'Searle, J. (2009). La conciencia. Filosofía y ciencias de la vida, 60.' },
    { t: 'Tudela, P. (2015). Percepción y atención. Ediciones CEF.' },
  ],
};
