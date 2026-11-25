// ============================================================================
// ATLAS CEREBRAL COMPARTIDO
// Todas las regiones y redes que aparecen en el temario. Cualquier tema nuevo
// (percepción, memoria…) debe AÑADIR aquí sus regiones/redes en vez de
// duplicarlas. Coordenadas en el viewBox 600×400 de brain-geo.js
// (polo frontal a la derecha).
//   vista: 'lateral' | 'medial'   profundo: true = estructura no visible en
//   superficie (se dibuja con borde discontinuo).
// ============================================================================

export const REDES = {
  alerta:   { nombre: 'Red de alerta',               color: 'var(--alerta)',  corto: 'Alerta' },
  orient:   { nombre: 'Red de orientación',          color: 'var(--orient)',  corto: 'Orientación' },
  control:  { nombre: 'Red de control ejecutivo',    color: 'var(--control)', corto: 'Control' },
  dorsal:   { nombre: 'Red dorsal (Corbetta y Shulman)',  color: '#2E5BA6', corto: 'Dorsal' },
  ventral:  { nombre: 'Red ventral (Corbetta y Shulman)', color: '#1FA1B8', corto: 'Ventral' },
  dmn:      { nombre: 'Red por defecto (RND / DMN)', color: 'var(--dmn)',     corto: 'Por defecto' },
  sal:      { nombre: 'Red de saliencia',            color: 'var(--sal)',     corto: 'Saliencia' },
  gnw:      { nombre: 'Espacio neuronal global (GNW)', color: 'var(--consc)', corto: 'GNW' },
  posterior:{ nombre: '"Zona posterior caliente"',   color: '#9A5FD0',        corto: 'Posterior' },
};

export const REGIONES = {
  // ---------------- Vista lateral ----------------
  fef: {
    nombre: 'Campos oculares frontales', aka: 'FEF · frontal eye fields', vista: 'lateral', x: 395, y: 104,
    lugar: 'Corteza frontal, área premotora',
    funcion: 'Planifican e inician los movimientos sacádicos de los ojos y desplazan la atención SIN mover los ojos (atención encubierta). Nodo de la red dorsal.',
    lesion: 'Peor preparación de sacadas y de desplazamientos del foco.',
    redes: ['orient', 'dorsal'],
  },
  dlpfc: {
    nombre: 'Corteza prefrontal lateral (dorsolateral)', aka: 'CPF lateral · dlPFC', vista: 'lateral', x: 472, y: 150,
    lugar: 'Lóbulo frontal, cara lateral, por delante de áreas motoras y premotoras',
    funcion: 'Configura y reconfigura la regla que gobierna la conducta; mantiene el set de tarea. En alerta, las regiones frontales evalúan las demandas momento a momento y ajustan el nivel de alerta (más peso cuando la alerta es endógena). Centro de conexión del GNW.',
    lesion: 'Perseveración, más interferencia y dificultad para cambiar de regla.',
    redes: ['control', 'alerta', 'gnw'],
  },
  vlpfc: {
    nombre: 'Corteza frontal inferior derecha', aka: 'CPF ventrolateral · giro frontal inferior', vista: 'lateral', x: 470, y: 236,
    lugar: 'Lóbulo frontal, parte inferior, hemisferio derecho',
    funcion: 'Junto a la TPJ forma la red ventral: reorientación ante eventos inesperados. También forma parte del eje fronto-parietal lateral del control ejecutivo y de las áreas frontales derechas de la alerta.',
    lesion: 'Problemas de control y de reorientación ante lo inesperado.',
    redes: ['ventral', 'control', 'alerta'],
  },
  spl: {
    nombre: 'Lóbulo parietal superior', aka: 'LPS · SPL', vista: 'lateral', x: 250, y: 86,
    lugar: 'Lóbulo parietal, parte superior',
    funcion: 'Nodo de la red dorsal: orientación guiada por metas (endógena) y "mapa de prioridad". En alerta, las regiones parietales sostienen una preparación de base y la distribuyen espacialmente (más peso cuando la alerta es exógena).',
    lesion: 'Dificultad para desplazar y mantener el foco hacia donde marca la meta.',
    redes: ['orient', 'dorsal', 'alerta', 'control', 'gnw'],
  },
  ipl: {
    nombre: 'Parietal inferior · giro angular', aka: 'LPI · corteza parietal posterior', vista: 'lateral', x: 198, y: 176,
    lugar: 'Lóbulo parietal, parte inferior y posterior',
    funcion: 'Parietal posterior (sobre todo derecho): asociado al DESENGANCHE de la atención. El giro angular es nodo de la red por defecto. Parte del circuito fronto-parietal de alerta y del eje posterior que construye contenidos conscientes.',
    lesion: 'Lesión derecha → heminegligencia del lado izquierdo (fallo de desenganche).',
    redes: ['orient', 'alerta', 'dmn', 'posterior', 'control'],
  },
  tpj: {
    nombre: 'Unión temporoparietal', aka: 'TPJ · temporo-parietal junction', vista: 'lateral', x: 258, y: 230,
    lugar: 'Donde se unen lóbulo temporal y parietal (hemisferio derecho)',
    funcion: 'Núcleo de la red ventral: detecta lo saliente y lo no previsto y manda la señal de "soltar" el foco actual (desenganche ante señales relevantes no previstas). Incluida en la región parietal posterior del desenganche.',
    lesion: 'Heminegligencia (sobre todo lesión derecha): omisión sistemática del hemicampo contralateral.',
    redes: ['orient', 'ventral', 'posterior'],
  },
  insula: {
    nombre: 'Ínsula anterior', aka: 'corteza insular', vista: 'lateral', x: 380, y: 262, profundo: true,
    lugar: 'Escondida bajo la cisura lateral (Silvio)',
    funcion: 'Con la corteza cingulada anterior detecta conflicto, error y carga, e indica que hace falta más control. Núcleo de la red de saliencia: conmutador entre modos internos (RND) y externos (redes de tarea).',
    lesion: 'Pobre detección de errores y ajustes insuficientes tras el conflicto.',
    redes: ['control', 'sal'],
  },
  occ: {
    nombre: 'Corteza occipital (visual)', aka: 'cortezas posteriores', vista: 'lateral', x: 112, y: 210,
    lugar: 'Lóbulo occipital',
    funcion: 'Construye los detalles específicos de lo que vemos. Parte de la "zona posterior caliente": el contenido perceptivo consciente requiere bucles recurrentes en estas áreas.',
    lesion: '—',
    redes: ['posterior'],
  },
  octemp: {
    nombre: 'Corteza occipitotemporal', aka: 'vía ventral · temporal inferior', vista: 'lateral', x: 210, y: 300,
    lugar: 'Cara inferior entre lóbulo occipital y temporal',
    funcion: 'Codifica rasgos y objetos (color, forma). En el GNW, la primera condición para la consciencia es que existan representaciones activas aquí (p. ej., neuronas occipitotemporales que codifican el objeto).',
    lesion: '—',
    redes: ['posterior'],
  },

  // ---------------- Vista medial ----------------
  acc: {
    nombre: 'Corteza cingulada anterior', aka: 'CCA · ACC', vista: 'medial', x: 418, y: 140,
    lugar: 'Cara medial del frontal, encima del cuerpo calloso',
    funcion: 'Monitorización: detecta conflicto, error y carga, y avisa de que hace falta más control (eje cingulado-insular, mantenimiento del set). Nodo de la red de saliencia y centro de conexión del GNW.',
    lesion: 'Pobre detección de errores y ajustes insuficientes tras el conflicto.',
    redes: ['control', 'sal', 'gnw'],
  },
  presma: {
    nombre: 'Área presuplementaria motora', aka: 'pre-SMA', vista: 'medial', x: 362, y: 88,
    lugar: 'Cara medial del frontal, delante del área motora suplementaria',
    funcion: 'Forma parte del eje cingulado-insular (CCA/pre-SMA + ínsula anterior): mantenimiento del set y vigilancia del rendimiento.',
    lesion: '—',
    redes: ['control'],
  },
  mpfc: {
    nombre: 'Corteza prefrontal medial', aka: 'CPFm', vista: 'medial', x: 494, y: 196,
    lugar: 'Cara medial del lóbulo frontal',
    funcion: 'Nodo principal de la red por defecto: autorreferencia, recuerdo autobiográfico, prospección y "divagación".',
    lesion: '—',
    redes: ['dmn'],
  },
  pcc: {
    nombre: 'Cingulado posterior / precúneo', aka: 'CCP · precuneus', vista: 'medial', x: 222, y: 132,
    lugar: 'Cara medial del parietal',
    funcion: 'Nodo principal de la red por defecto (más activa en reposo y procesos dirigidos internamente).',
    lesion: '—',
    redes: ['dmn'],
  },
  tal: {
    nombre: 'Tálamo', aka: 'núcleos intralaminares · núcleo reticular', vista: 'medial', x: 312, y: 208, profundo: true,
    lugar: 'Diencéfalo, en el centro del cerebro',
    funcion: 'Mucho más que un relevo: organiza la conectividad efectiva entre cortezas y sincroniza la comunicación entre nodos. Alerta: actividad anticipatoria ante señales de aviso (pulvinar e intralaminares). Control: sincroniza nodos y estabiliza la coordinación con sistemas sensoriales y motores. Consciencia: sistema talamocortical (núcleo reticular regulador).',
    lesion: 'Enlentecimiento, variabilidad excesiva y desorganización del set atencional.',
    redes: ['alerta', 'control', 'gnw'],
  },
  pulv: {
    nombre: 'Pulvinar (tálamo)', aka: 'tálamo posterior', vista: 'medial', x: 278, y: 222, profundo: true,
    lugar: 'Parte posterior del tálamo',
    funcion: 'REENGANCHE: estabiliza el foco en la nueva localización y eleva su prioridad, acoplando cortezas visuales y redes fronto-parietales. También papel destacado en la alerta, y conmutador/sincronizador de rutas en el GNW.',
    lesion: 'Selección inestable: cuesta mantener la prioridad del objetivo y filtrar distractores cercanos → más TR y errores.',
    redes: ['orient', 'alerta', 'gnw'],
  },
  bg: {
    nombre: 'Ganglios basales', aka: 'estriado', vista: 'medial', x: 356, y: 210, profundo: true,
    lugar: 'Núcleos profundos (más laterales que el tálamo)',
    funcion: 'Abren o bloquean la compuerta de acceso a la memoria de trabajo y pueden aplicar un freno global para aplazar o detener la respuesta.',
    lesion: 'Impulsividad o fallos al detener respuestas ya iniciadas.',
    redes: ['control'],
  },
  bfcol: {
    nombre: 'Prosencéfalo basal colinérgico', aka: 'sistema colinérgico basal', vista: 'medial', x: 392, y: 236, profundo: true,
    lugar: 'Base del prosencéfalo',
    funcion: 'Subsistema neuromodulador de la alerta (acetilcolina): priorización sensorial. Se coordina con el sistema noradrenérgico.',
    lesion: '—',
    redes: ['alerta'],
  },
  sc: {
    nombre: 'Colículo superior', aka: 'mesencéfalo', vista: 'medial', x: 270, y: 252,
    lugar: 'Techo del mesencéfalo (tronco encefálico)',
    funcion: 'DESPLAZAMIENTO: integra señales sensoriales y programas de orientación; programación rápida de cambios de mirada y de foco.',
    lesion: 'Empeora tanto la iniciación de sacadas como la orientación encubierta.',
    redes: ['orient'],
  },
  lc: {
    nombre: 'Locus coeruleus', aka: 'sistema noradrenérgico · LC–NA', vista: 'medial', x: 296, y: 290,
    lugar: 'Tronco encefálico (protuberancia)',
    funcion: 'Libera noradrenalina y ajusta la GANANCIA de los circuitos. Actividad fásica (por señal de aviso o meta interna) → pico de preparación y TR más cortos. Actividad tónica → mantiene la vigilancia en el tiempo.',
    lesion: 'Nivel demasiado bajo → lapsos. Nivel demasiado alto → impulsividad.',
    redes: ['alerta'],
  },
  rf: {
    nombre: 'Formación reticular', aka: 'sistema reticular activador', vista: 'medial', x: 300, y: 338,
    lugar: 'Núcleo del tronco encefálico',
    funcion: 'Moruzzi y Magoun (1949): su estimulación aumentaba la activación (arousal). Hoy la idea de un "centro" único se ha sustituido por varios subsistemas neuromoduladores.',
    lesion: '—',
    redes: ['alerta'],
  },
  hipp: {
    nombre: 'Hipocampo', aka: 'lóbulo temporal medial', vista: 'medial', x: 352, y: 284, profundo: true,
    lugar: 'Cara medial del lóbulo temporal',
    funcion: 'Estructura relacionada con la memoria que contribuye a la red por defecto.',
    lesion: '—',
    redes: ['dmn'],
  },
};

// Recorridos "cómo viaja la señal" que el cerebro puede animar
export const RUTAS = {
  orientacion: {
    titulo: 'Orientar la atención',
    red: 'orient',
    pasos: [
      { r: 'tpj', t: 'Desenganche', d: 'La corteza parietal posterior derecha (incluida la TPJ) retira la prioridad del lugar que estabas atendiendo.' },
      { r: 'fef', t: 'Desplazamiento (1)', d: 'Los campos oculares frontales preparan el movimiento del foco (con o sin mover los ojos).' },
      { r: 'sc', t: 'Desplazamiento (2)', d: 'El colículo superior programa rápido el cambio de mirada y de foco. Eje fronto-parietal–colicular.' },
      { r: 'pulv', t: 'Reenganche', d: 'El pulvinar estabiliza el foco en el nuevo sitio y le da prioridad frente a la competencia.' },
    ],
  },
  alerta: {
    titulo: 'Señal de aviso → respuesta más rápida',
    red: 'alerta',
    pasos: [
      { r: 'lc', t: 'Descarga fásica', d: 'El pitido de aviso dispara el locus coeruleus: liberación de noradrenalina.' },
      { r: 'tal', t: 'Tálamo anticipa', d: 'Aumento anticipatorio de la actividad en el tálamo (pulvinar, intralaminares).' },
      { r: 'ipl', t: 'Parietal prepara', d: 'Las regiones parietales sostienen la preparación de base y la distribuyen en el espacio.' },
      { r: 'dlpfc', t: 'Frontal ajusta', d: 'Las regiones frontales evalúan la demanda y ajustan el nivel de alerta → tiempos de reacción más cortos.' },
    ],
  },
  control: {
    titulo: 'Resolver un conflicto (p. ej., Stroop)',
    red: 'control',
    pasos: [
      { r: 'acc', t: 'Detecta el conflicto', d: 'La cingulada anterior (con la ínsula anterior) detecta conflicto o error: "¡hace falta más control!".' },
      { r: 'dlpfc', t: 'Refuerza la regla', d: 'La prefrontal lateral aumenta la ganancia de la regla correcta ("nombra el color").' },
      { r: 'bg', t: 'Compuerta y freno', d: 'Los ganglios basales abren/cierran el paso a la memoria de trabajo y frenan la respuesta inadecuada.' },
      { r: 'tal', t: 'Sincroniza', d: 'El tálamo sincroniza los nodos y los coordina con sistemas sensoriales y motores.' },
    ],
  },
};
