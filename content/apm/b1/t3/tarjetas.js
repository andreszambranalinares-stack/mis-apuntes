// Tarjetas del Tema 3. id único y estable (no cambiarlo: guarda el progreso Leitner).
// sec = id de la sección; region = id de content/atlas.js (pinta el mini-cerebro).
export default [
  // Intro
  { id: 't3-esc-1', sec: 'intro', frente: 'Las 3 escalas del estudio del cerebro y su pregunta', dorso: '<b>Espacial</b> (dónde ocurre), <b>topológica</b> (cómo está conectada) y <b>temporal</b> (cuándo ocurre).' },
  { id: 't3-esc-2', sec: 'intro', frente: 'Niveles de la escala topológica', dorso: 'Conectividad <b>local</b> (microcircuitos) → <b>mesoescala</b> (módulos) → escala <b>global</b> (grandes redes como la red por defecto o la de control ejecutivo).' },
  { id: 't3-esc-3', sec: 'intro', frente: 'Niveles de la escala temporal', dorso: 'Procesos <b>instantáneos</b> (segundos; EEG, fMRI) → <b>desarrollo a lo largo de la vida</b> → escala <b>evolutiva</b> (comparación entre especies).' },

  // Posner
  { id: 't3-pos-1', sec: 'posner', frente: 'Las 3 redes atencionales de Posner y Petersen', dorso: '<b>Alerta</b>, <b>orientación</b> y <b>control ejecutivo</b>.' },
  { id: 't3-pos-2', sec: 'posner', frente: '¿Qué significa que las redes atencionales son "supramodales"?', dorso: 'La misma operación actúa <b>por encima de una modalidad sensorial</b>: regula visión, audición o memoria de trabajo según la tarea.' },
  { id: 't3-pos-3', sec: 'posner', frente: 'Otro nombre de la red de control ejecutivo', dorso: '<b>Sistema atencional anterior</b> (también "sistema atencional de control").' },
  { id: 't3-pos-4', sec: 'posner', frente: 'Prueba para medir por separado alerta, orientación y control', dorso: 'La <b>Prueba de Redes Atencionales</b> (Attention Network Test, <b>ANT</b>).' },
  { id: 't3-pos-5', sec: 'posner', frente: 'Conectividad estructural, funcional y efectiva', dorso: '<b>Estructural</b>: vías de sustancia blanca. <b>Funcional</b>: sincronía/covariación temporal. <b>Efectiva</b>: influencia dirigida o causal entre nodos.' },
  { id: 't3-pos-6', sec: 'posner', frente: 'Nodos de la Red del Modo por Defecto', region: 'pcc', dorso: '<b>Corteza prefrontal medial</b>, <b>cingulada posterior/precúneo</b> y parietal inferior (<b>giro angular</b>), con contribución del <b>hipocampo</b>.' },
  { id: 't3-pos-7', sec: 'posner', frente: '¿Cuándo está más activa la red por defecto?', dorso: 'En <b>reposo</b> y procesos <b>dirigidos internamente</b> (autorreferencia, recuerdo autobiográfico, prospección, divagación). Baja con tareas externas sostenidas.' },
  { id: 't3-pos-8', sec: 'posner', frente: 'Orientación endógena vs exógena (sinónimos)', dorso: '<b>Endógena</b> = metas internas = top-down = de arriba abajo. <b>Exógena</b> = estímulos salientes = bottom-up = de abajo arriba.' },
  { id: 't3-pos-9', sec: 'posner', frente: 'Del modelo de capacidad de Kahneman, ¿qué es la atención?', dorso: 'Un <b>sistema de control que distribuye recursos limitados</b> según la demanda.' },

  // Alerta
  { id: 't3-ale-1', sec: 'alerta', frente: 'Moruzzi y Magoun (1949)', region: 'rf', dorso: 'Descubren que la <b>formación reticular</b> del tronco encefálico, al estimularse, aumenta la activación (arousal).' },
  { id: 't3-ale-2', sec: 'alerta', frente: 'Subsistemas neuromoduladores de la alerta', dorso: '<b>Noradrenérgico (locus coeruleus, el central)</b>, colinérgico basal, dopaminérgico y serotoninérgico.' },
  { id: 't3-ale-3', sec: 'alerta', frente: 'Alerta tónica', dorso: 'Nivel <b>basal</b> de preparación sostenido en el tiempo. Varía con cansancio, ritmos circadianos y contexto. Se estudia con <b>tareas de vigilancia</b>.' },
  { id: 't3-ale-4', sec: 'alerta', frente: 'Alerta fásica', dorso: 'Incremento <b>transitorio</b> de preparación tras una <b>señal de aviso</b>. Se estudia con señales de advertencia <b>no informativas</b> (&lt; 1 s).' },
  { id: 't3-ale-5', sec: 'alerta', frente: '¿Qué es una señal de advertencia "no informativa"?', dorso: 'Indica <b>cuándo</b> llegará el estímulo, pero no <b>qué</b> ni <b>dónde</b>.' },
  { id: 't3-ale-6', sec: 'alerta', frente: 'Pupilometría y alerta', dorso: 'Pupila <b>basal</b> más grande → más alerta <b>tónica</b>. <b>Dilataciones transitorias</b> alrededor de la señal → cambios <b>fásicos</b>.' },
  { id: 't3-ale-7', sec: 'alerta', frente: 'Riesgos de alerta tónica demasiado baja / excesiva', dorso: 'Baja: <b>lapsos y omisiones</b>. Excesiva: <b>fatiga y variabilidad</b>.' },
  { id: 't3-ale-8', sec: 'alerta', frente: 'Riesgos de alerta fásica deficiente / excesiva', dorso: 'Deficiente: <b>no se aprovechan las señales</b>. Excesiva: <b>impulsividad o falsas alarmas</b>.' },
  { id: 't3-ale-9', sec: 'alerta', frente: 'Ejemplo cotidiano de alerta tónica y fásica', dorso: 'Tónica: <b>conductor en autopista</b> en un trayecto largo. Fásica: <b>tono antes del semáforo verde</b>.' },

  // Vigilancia
  { id: 't3-vig-1', sec: 'vigilancia', frente: 'Prueba del Reloj de Mackworth', dorso: 'Un puntero avanza como un segundero y a veces da un <b>salto doble</b> que hay que detectar durante periodos largos.' },
  { id: 't3-vig-2', sec: 'vigilancia', frente: 'Resultado clásico en tareas de vigilancia', dorso: 'Con el <b>tiempo en tarea</b> aumentan los fallos de detección; caída <b>rápida al inicio</b>, peor con más demanda perceptiva.' },
  { id: 't3-vig-3', sec: 'vigilancia', frente: 'Sensibilidad vs criterio (TDS)', dorso: '<b>Sensibilidad</b>: capacidad de diferenciar señal y ruido. <b>Criterio</b>: umbral interno para decidir "hay señal".' },
  { id: 't3-vig-4', sec: 'vigilancia', frente: '¿Qué pasa con el criterio cuando las señales son raras?', dorso: 'Se vuelve <b>conservador</b> (estricto) → aumentan las <b>omisiones</b>.' },
  { id: 't3-vig-5', sec: 'vigilancia', frente: 'Omisión', dorso: 'No responder cuando <b>sí</b> había señal = <b>falso negativo</b>.' },
  { id: 't3-vig-6', sec: 'vigilancia', frente: 'Falsa alarma', dorso: 'Responder cuando <b>no</b> había señal = <b>falso positivo</b>.' },
  { id: 't3-vig-7', sec: 'vigilancia', frente: 'Acierto y rechazo correcto', dorso: '<b>Acierto</b>: responder cuando hay señal (verdadero positivo). <b>Rechazo correcto</b>: no responder cuando no hay (verdadero negativo).' },
  { id: 't3-vig-8', sec: 'vigilancia', frente: 'Factores de primer orden en vigilancia', dorso: 'Propiedades <b>físicas</b> de la señal y del entorno: intensidad, contraste, tamaño, duración, relación señal–ruido, distractores.' },
  { id: 't3-vig-9', sec: 'vigilancia', frente: 'Factores de segundo orden en vigilancia', dorso: 'Derivan de la <b>experiencia</b> con la tarea y de la <b>incertidumbre</b> sobre cuándo y dónde aparecerá la señal.' },
  { id: 't3-vig-10', sec: 'vigilancia', frente: '¿Qué tipo de alerta cargan las tareas de vigilancia?', dorso: 'Sobre todo la alerta <b>tónica</b>.' },

  // Alerta mecanismos
  { id: 't3-alm-1', sec: 'alerta-mecanismos', frente: '4 líneas de evidencia sobre la red de alerta', dorso: '<b>Neurología de la lesión</b>, <b>farmacología</b>, <b>neuroimagen</b> e <b>índices fisiológicos</b> (pupilometría, electrofisiología).' },
  { id: 't3-alm-2', sec: 'alerta-mecanismos', frente: 'Locus coeruleus: qué hace la noradrenalina', region: 'lc', dorso: 'Ajusta la <b>ganancia</b> de los circuitos. Fásica → pico de preparación y TR cortos; tónica → vigilancia sostenida.' },
  { id: 't3-alm-3', sec: 'alerta-mecanismos', frente: 'Noradrenalina demasiado baja / demasiado alta', region: 'lc', dorso: 'Baja → <b>lapsos</b>. Alta → <b>impulsividad</b>.' },
  { id: 't3-alm-4', sec: 'alerta-mecanismos', frente: 'Circuito anatómico de la alerta', region: 'tal', dorso: '<b>Fronto-parietal derecho</b> (CPF lateral, áreas frontales dchas., parietal sup. e inf.) + <b>tálamo</b> (pulvinar, intralaminares) + sustancia blanca.' },
  { id: 't3-alm-5', sec: 'alerta-mecanismos', frente: 'Papel parietal vs frontal en la alerta', dorso: '<b>Parietal</b>: preparación de base y distribución espacial. <b>Frontal</b>: evalúa demandas y ajusta el nivel de alerta.' },
  { id: 't3-alm-6', sec: 'alerta-mecanismos', frente: 'Alerta endógena vs exógena: qué región gana peso', dorso: '<b>Endógena</b> (metas) → más <b>frontal</b>. <b>Exógena</b> (señales externas) → más <b>parietal</b>.' },
  { id: 't3-alm-7', sec: 'alerta-mecanismos', frente: '¿Por qué combinar fMRI con EEG?', dorso: 'La fMRI tiene <b>resolución temporal limitada</b>; el EEG es rápido y capta la preparación anticipatoria.' },

  // Orientación
  { id: 't3-ori-1', sec: 'orientacion', frente: 'Atención manifiesta vs encubierta', dorso: '<b>Manifiesta (overt)</b>: con movimiento ocular. <b>Encubierta (covert)</b>: sin mover los ojos.' },
  { id: 't3-ori-2', sec: 'orientacion', frente: 'Pista central', dorso: 'En el <b>centro</b>, no coincide con el objetivo, <b>simbólica</b> (flecha), requiere decodificación → orientación <b>endógena</b>, lenta y sostenida.' },
  { id: 't3-ori-3', sec: 'orientacion', frente: 'Pista periférica', dorso: 'En (o cerca de) la <b>futura ubicación</b> del objetivo → captura <b>rápida y transitoria</b> → orientación <b>exógena</b>.' },
  { id: 't3-ori-4', sec: 'orientacion', frente: 'Las 3 operaciones de la red de orientación', dorso: '<b>Desenganche</b> → <b>desplazamiento</b> → <b>reenganche</b>.' },
  { id: 't3-ori-5', sec: 'orientacion', frente: 'Inhibición del retorno', dorso: 'Tras orientar a un lugar, se tarda más en volver allí: <b>20–50 ms</b> más lento. Favorece la exploración eficiente.' },
  { id: 't3-ori-6', sec: 'orientacion', frente: '¿Cuándo aparece el beneficio de la orientación exógena?', dorso: 'A los <b>~100–150 ms</b> tras la pista, y decae pronto.' },
  { id: 't3-ori-7', sec: 'orientacion', frente: 'Búsqueda por rasgo simple', dorso: '<b>Pop-out</b>: el objetivo salta a la vista; el TR <b>apenas cambia</b> con el tamaño del conjunto.' },
  { id: 't3-ori-8', sec: 'orientacion', frente: 'Búsqueda por conjunción', dorso: 'TR <b>aumenta casi linealmente</b> con el tamaño del conjunto; <b>más pendiente</b> cuando el objetivo está <b>ausente</b>.' },
  { id: 't3-ori-9', sec: 'orientacion', frente: 'Plantilla de objetivo', dorso: 'Representación interna de los rasgos buscados; combina señales <b>de abajo arriba</b> (saliencia) y <b>de arriba abajo</b> (metas).' },
  { id: 't3-ori-10', sec: 'orientacion', frente: 'Teoría de la Integración de Características (Treisman)', dorso: 'Rasgos en <b>mapas distribuidos</b>; la atención espacial actúa como <b>"mapa maestro"</b> que une (binding) los rasgos de una posición.' },
  { id: 't3-ori-11', sec: 'orientacion', frente: 'Conjunción ilusoria', dorso: 'Percibir combinaciones de rasgos de <b>objetos distintos</b> (ver "A roja" con A verde y B roja). Con atención dividida, exposición breve o carga alta.' },
  { id: 't3-ori-12', sec: 'orientacion', frente: 'Mapeo consistente vs variable en búsqueda', dorso: '<b>Consistente</b> → automatización. <b>Variable</b> → no se automatiza; se sigue necesitando control voluntario.' },

  // Orientación mecanismos
  { id: 't3-orm-1', sec: 'orientacion-mecanismos', frente: 'Estructura del desenganche', region: 'tpj', dorso: '<b>Corteza parietal posterior</b>, sobre todo <b>derecha</b> (incluida la región temporoparietal).' },
  { id: 't3-orm-2', sec: 'orientacion-mecanismos', frente: 'Heminegligencia', region: 'tpj', dorso: 'Omisión <b>sistemática</b> del hemicampo <b>contralateral</b> a la lesión, con agudeza visual conservada. Déficit <b>atencional</b>.' },
  { id: 't3-orm-3', sec: 'orientacion-mecanismos', frente: 'Negligencia espacio-centrada vs objeto-centrada', dorso: '<b>Espacio-centrada</b>: ignora una mitad del espacio. <b>Objeto-centrada</b>: ignora la mitad de cada objeto, esté donde esté.' },
  { id: 't3-orm-4', sec: 'orientacion-mecanismos', frente: 'Pacientes con negligencia en la tarea de pistas', dorso: 'Beneficios válidos <b>preservados</b>; costes inválidos <b>muy grandes</b> cuando la pista va al lado <b>ipsilesional</b> y el objetivo al <b>contralesional</b>.' },
  { id: 't3-orm-5', sec: 'orientacion-mecanismos', frente: 'Estructuras del desplazamiento', region: 'fef', dorso: '<b>Campos oculares frontales (FEF)</b>, regiones premotoras y <b>colículos superiores</b> (eje fronto-parietal–colicular).' },
  { id: 't3-orm-6', sec: 'orientacion-mecanismos', frente: 'Colículo superior', region: 'sc', dorso: 'Mesencéfalo. Integra señales sensoriales y programas de orientación; programa rápido cambios de mirada y foco.' },
  { id: 't3-orm-7', sec: 'orientacion-mecanismos', frente: 'Estructura del reenganche', region: 'pulv', dorso: '<b>Tálamo: pulvinar</b>. Si falla → selección inestable, mal filtrado de distractores cercanos.' },
  { id: 't3-orm-8', sec: 'orientacion-mecanismos', frente: 'Red dorsal (Corbetta y Shulman)', region: 'spl', dorso: '<b>Lóbulo parietal superior + FEF</b>. Orientación <b>endógena</b>; "mapa de prioridad".' },
  { id: 't3-orm-9', sec: 'orientacion-mecanismos', frente: 'Red ventral (Corbetta y Shulman)', region: 'tpj', dorso: '<b>TPJ + corteza frontal inferior derecha</b>. Reorientación <b>exógena</b> ante lo inesperado; interrupción y redirección.' },
  { id: 't3-orm-10', sec: 'orientacion-mecanismos', frente: 'Relación entre Corbetta y Shulman y Posner', dorso: '<b>No lo sustituye</b>: lo <b>reformula</b> a nivel de organización de red (dos modos de control que interactúan).' },

  // Control
  { id: 't3-con-1', sec: 'control', frente: 'Problema del homúnculo', dorso: 'Postular un "pequeño director" que lo explica todo <b>sin explicar nada</b>. Se supera descomponiendo el control en funciones medibles ligadas a circuitos.' },
  { id: 't3-con-2', sec: 'control', frente: 'Control sostenido vs transitorio', dorso: '<b>Sostenido</b>: mantiene el set (metas, reglas, umbrales) y vigila. <b>Transitorio</b>: ajustes puntuales ante conflicto, error o cambio.' },
  { id: 't3-con-3', sec: 'control', frente: 'Las 5 operaciones del control ejecutivo', dorso: 'Selección bajo conflicto, inhibición de respuestas, cambio de tarea/regla, actualización y mantenimiento en MT, monitorización y ajuste del esfuerzo.' },
  { id: 't3-con-4', sec: 'control', frente: 'Tareas de selección bajo conflicto', dorso: '<b>Stroop</b> y <b>flanker</b>.' },
  { id: 't3-con-5', sec: 'control', frente: 'Tareas de inhibición de respuestas', dorso: '<b>Go/No-Go</b> (no responder a señales raras) y <b>Stop-Signal</b> (detener una respuesta ya iniciada).' },
  { id: 't3-con-6', sec: 'control', frente: 'Tareas de cambio de tarea o de regla', dorso: 'Tareas de cambio y <b>Wisconsin Card Sorting Test</b>. Suelen mostrar <b>coste de cambio</b>.' },
  { id: 't3-con-7', sec: 'control', frente: 'Tarea típica de actualización en memoria de trabajo', dorso: '<b>N-back</b> (y tareas de recodificación/actualización). Usa mecanismos de <b>compuerta</b>.' },
  { id: 't3-con-8', sec: 'control', frente: 'Control proactivo vs reactivo', dorso: '<b>Proactivo</b>: se anticipa, preconfigura la regla (señales regulares). <b>Reactivo</b>: corrige tras el conflicto (incertidumbre).' },
  { id: 't3-con-9', sec: 'control', frente: 'Papel del control ejecutivo entre las redes', dorso: 'Es la <b>bisagra entre alerta y orientación</b>.' },

  // Norman Shallice
  { id: 't3-ns-1', sec: 'norman-shallice', frente: 'Los 2 niveles de control de Norman y Shallice', dorso: '<b>Competencia entre esquemas</b> (programación por contención, rutinas) y <b>Sistema Atencional Supervisor</b> (SAS).' },
  { id: 't3-ns-2', sec: 'norman-shallice', frente: 'Esquema (Norman y Shallice)', dorso: 'Unidad de acción/procesamiento <b>aprendida y relativamente automática</b>, con fuerza y umbrales, organizada <b>jerárquicamente</b>.' },
  { id: 't3-ns-3', sec: 'norman-shallice', frente: '¿Cuándo interviene el SAS?', dorso: 'Situaciones <b>nuevas o complejas</b>, <b>conflicto</b> entre respuestas, <b>corrección de errores</b>, <b>cambio de regla</b>, decisiones bajo <b>incertidumbre</b>.' },
  { id: 't3-ns-4', sec: 'norman-shallice', frente: 'Sistema de Activación Motivacional', dorso: 'Aporta señales de <b>valor y urgencia</b> (hambre, amenaza, incentivo) que ajustan el "tono" de la competición.' },
  { id: 't3-ns-5', sec: 'norman-shallice', frente: '¿El SAS controla de forma permanente?', dorso: 'No: es un <b>sesgo temporal y específico de la tarea</b>. Cuando todo vuelve a ser predecible, mandan los esquemas.' },

  // Control mecanismos
  { id: 't3-cm-1', sec: 'control-mecanismos', frente: 'CPF lateral + parietal en el control', region: 'dlpfc', dorso: 'Configuran y reconfiguran la <b>regla</b> que gobierna la conducta.' },
  { id: 't3-cm-2', sec: 'control-mecanismos', frente: 'Cingulada anterior + ínsula anterior en el control', region: 'acc', dorso: 'Detectan <b>conflicto, error y carga</b>; indican que hace falta más control.' },
  { id: 't3-cm-3', sec: 'control-mecanismos', frente: 'Ganglios basales en el control', region: 'bg', dorso: '<b>Compuerta</b> de acceso a la memoria de trabajo y <b>freno global</b> de la respuesta.' },
  { id: 't3-cm-4', sec: 'control-mecanismos', frente: 'Eje fronto-parietal lateral vs cingulado-insular', dorso: '<b>Fronto-parietal lateral</b>: ajustes momento a momento. <b>Cingulado-insular</b> (CCA/pre-SMA + ínsula): mantenimiento del set y vigilancia.' },
  { id: 't3-cm-5', sec: 'control-mecanismos', frente: '¿Apaga el SAS los esquemas erróneos?', dorso: 'No: <b>refuerza el adecuado</b> y la <b>inhibición lateral</b> debilita los antagonistas.' },
  { id: 't3-cm-6', sec: 'control-mecanismos', frente: 'Lesión de corteza prefrontal lateral', region: 'dlpfc', dorso: '<b>Perseveración</b>, más interferencia, dificultad para cambiar de regla.' },
  { id: 't3-cm-7', sec: 'control-mecanismos', frente: 'Lesión de cingulada anterior / ínsula anterior', region: 'acc', dorso: 'Pobre <b>detección de errores</b> y ajustes insuficientes tras el conflicto.' },
  { id: 't3-cm-8', sec: 'control-mecanismos', frente: 'Lesión de ganglios basales', region: 'bg', dorso: '<b>Impulsividad</b> o fallos al detener respuestas ya iniciadas.' },
  { id: 't3-cm-9', sec: 'control-mecanismos', frente: 'Lesión del tálamo (control)', region: 'tal', dorso: '<b>Enlentecimiento</b>, variabilidad excesiva y desorganización del set atencional.' },

  // Consciencia
  { id: 't3-cs-1', sec: 'consciencia', frente: '¿Por qué "consciencia" con s?', dorso: 'Traduce <i>consciousness</i> (estado, contenido, autoconsciencia) y evita confundirla con <b>conciencia ético-moral</b>.' },
  { id: 't3-cs-2', sec: 'consciencia', frente: 'Las 3 vertientes de la consciencia', dorso: '<b>Estado</b> (vigilia/reactividad), <b>contenido o acceso</b> (lo reportable) y <b>autoconsciencia</b> (representación de uno mismo).' },
  { id: 't3-cs-3', sec: 'consciencia', frente: 'Wundt y la consciencia', dorso: 'Solo lo consciente es psíquico; el foco consciente funcionaba de forma análoga a la <b>atención</b> (un "haz").' },
  { id: 't3-cs-4', sec: 'consciencia', frente: 'Metarrepresentación', dorso: '<b>Pensar sobre los propios contenidos mentales</b>; forma sofisticada de autoconsciencia en humanos.' },

  // Estructura
  { id: 't3-est-1', sec: 'consciencia-estructura', frente: 'Los 4 rasgos nucleares de la consciencia', dorso: '<b>Unidad</b>, <b>subjetividad</b>, <b>intencionalidad</b> y <b>cualidad</b>.' },
  { id: 't3-est-2', sec: 'consciencia-estructura', frente: 'Unidad y problema de la unión', dorso: 'La experiencia aparece integrada; el <b>binding problem</b> pregunta cómo se combinan color, forma, movimiento… en una representación.' },
  { id: 't3-est-3', sec: 'consciencia-estructura', frente: 'Subjetividad', dorso: 'Toda consciencia es <b>de alguien y para alguien</b>. Obliga a combinar medidas en <b>1.ª persona</b> (informe) y <b>3.ª persona</b> (conducta, fisiología).' },
  { id: 't3-est-4', sec: 'consciencia-estructura', frente: 'Intencionalidad vs intención', dorso: '<b>Intencionalidad</b>: "estar acerca de" algo (direccionalidad). <b>Intención</b>: propósito concreto ("quiero comer").' },
  { id: 't3-est-5', sec: 'consciencia-estructura', frente: 'Qualia', dorso: 'Aspectos cualitativos de la experiencia: <b>"cómo-es-para-mí"</b> (rasgo de cualidad).' },

  // Teorías
  { id: 't3-teo-1', sec: 'consciencia-teorias', frente: 'Problema duro de la consciencia', dorso: '(<b>Chalmers</b>) Explicar por qué y cómo procesos físicos dan lugar al carácter fenomenológico (qualia).' },
  { id: 't3-teo-2', sec: 'consciencia-teorias', frente: 'Problemas manejables', dorso: 'Qué <b>mecanismos</b> hacen disponible una información para el <b>informe y el control</b>. Donde trabaja la ciencia.' },
  { id: 't3-teo-3', sec: 'consciencia-teorias', frente: 'Teatro cartesiano y su problema', dorso: 'Escenario central + audiencia interna. Problema: el <b>homúnculo</b> → <b>regreso al infinito</b>.' },
  { id: 't3-teo-4', sec: 'consciencia-teorias', frente: 'Teoría de las versiones múltiples', dorso: '(<b>Dennett</b>) Múltiples <b>borradores en paralelo</b>; algunos ganan <b>"fama en el cerebro"</b> y se vuelven reportables.' },
  { id: 't3-teo-5', sec: 'consciencia-teorias', frente: 'Propuesta metateórica', dorso: 'Marco que habla <b>sobre las teorías</b>: cómo formularlas y evaluarlas, sin comprometerse con un mecanismo concreto.' },
  { id: 't3-teo-6', sec: 'consciencia-teorias', frente: '3 hechos que explican las versiones múltiples', dorso: '<b>Revisión temporal</b> de la experiencia, <b>selectividad dependiente de tarea</b>, <b>disociación registro sensorial–acceso</b>.' },

  // Reentrante
  { id: 't3-ree-1', sec: 'nucleo-reentrante', frente: 'Núcleo dinámico reentrante (autores e idea)', region: 'tal', dorso: '<b>Edelman y Tononi</b>: coalición <b>talamocortical</b> transitoria (cientos de ms), <b>integrada y diferenciada</b>.' },
  { id: 't3-ree-2', sec: 'nucleo-reentrante', frente: 'Reentrada', dorso: 'Circulación <b>recíproca y continua</b> de señales entre áreas conectadas en ambos sentidos.' },
  { id: 't3-ree-3', sec: 'nucleo-reentrante', frente: '¿Por qué el núcleo es "dinámico"?', dorso: 'Su composición y frontera <b>cambian con la tarea</b>: es un patrón de acoplamiento, no un lugar fijo.' },
  { id: 't3-ree-4', sec: 'nucleo-reentrante', frente: 'Darwinismo neuronal', dorso: '(<b>Edelman</b>) Selección de grupos neuronales: <b>repertorios primarios</b> → reentrada → <b>sistemas de valor</b> (NA, DA).' },
  { id: 't3-ree-5', sec: 'nucleo-reentrante', frente: 'Teoría de la integración de la información', dorso: '(<b>Tononi</b>) Importa la <b>complejidad causal</b> (organización), no el número de conexiones: integración + diferenciación.' },
  { id: 't3-ree-6', sec: 'nucleo-reentrante', frente: 'Críticas a la teoría del núcleo reentrante', dorso: 'Faltan criterios de <b>umbral</b> y de <b>localización funcional</b>; no separa bien estado, contenido y autoconsciencia.' },

  // GNW
  { id: 't3-gnw-1', sec: 'gnw', frente: 'Espacio neuronal global de trabajo (origen)', dorso: 'Traslada al cerebro el <b>"espacio de trabajo" de Baars</b> (tablón común) con circuitería de <b>largo alcance</b>.' },
  { id: 't3-gnw-2', sec: 'gnw', frente: 'Ignición', region: 'dlpfc', dorso: 'Aumento <b>súbito y sostenido</b> de actividad recíproca entre regiones lejanas que amplifica y difunde el contenido.' },
  { id: 't3-gnw-3', sec: 'gnw', frente: 'Procesamiento implícito vs acceso explícito (GNW)', dorso: '<b>Implícito</b>: local, eficiente, no reportable. <b>Explícito</b>: entra en el espacio global y se difunde.' },
  { id: 't3-gnw-4', sec: 'gnw', frente: '3 condiciones del GNW para la consciencia de contenido', dorso: 'Representación sensorial activa + bucles con <b>neuronas de largo alcance</b> + <b>capacidad libre</b> en el espacio.' },
  { id: 't3-gnw-5', sec: 'gnw', frente: 'Atención y consciencia en el GNW', dorso: 'La atención <b>facilita pero no garantiza</b> el acceso; <b>ajusta los umbrales</b> de ignición.' },
  { id: 't3-gnw-6', sec: 'gnw', frente: 'Papel del tálamo en el GNW', region: 'pulv', dorso: '<b>Conmutador y sincronizador</b> de rutas, sobre todo a través del <b>pulvinar</b>.' },

  // Fundamentos
  { id: 't3-fun-1', sec: 'fundamentos', frente: 'Correlato neuronal de la consciencia (CNC)', dorso: 'Conjunto <b>mínimo</b> de eventos y estructuras neurales <b>suficientes</b> para que un contenido sea consciente.' },
  { id: 't3-fun-2', sec: 'fundamentos', frente: 'Previo, constitutivo y consecuente', dorso: '<b>Previo</b>: requisitos (vigilia). <b>Constitutivo</b>: lo que forma la experiencia. <b>Consecuente</b>: preparar el habla, fijar en memoria.' },
  { id: 't3-fun-3', sec: 'fundamentos', frente: 'Tipos de núcleos talámicos', region: 'tal', dorso: '<b>Primer orden</b> (sentidos → cortezas primarias), <b>orden superior</b> (córtico-corticales), <b>no específicos</b> (señales de estado).' },
  { id: 't3-fun-4', sec: 'fundamentos', frente: '"Zona posterior caliente"', region: 'occ', dorso: 'Cortezas <b>posteriores</b> (occipital, temporal, parietal) con bucles recurrentes: construyen el <b>qué</b> del contenido.' },
  { id: 't3-fun-5', sec: 'fundamentos', frente: 'Red de saliencia', region: 'insula', dorso: '<b>Ínsula anterior + cíngulo anterior</b>. Conmutador entre modos internos (RND) y externos (dorsal y ejecutiva).' },
  { id: 't3-fun-6', sec: 'fundamentos', frente: 'Las 3 piezas de los fundamentos neuronales', dorso: '<b>Mecanismos de estado</b> (ascendentes y talámicos) + <b>circuitos posteriores</b> (contenidos) + <b>redes de acceso y control</b>.' },
];
