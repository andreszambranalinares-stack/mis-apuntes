# Mis Apuntes — guía del proyecto

Web estática (GitHub Pages, sin compilación) para estudiar temario universitario de forma
visual: contenido completo + interactivos + tarjetas Leitner + test tipo examen.

## Reglas que no se rompen
- **Privacidad:** nunca escribir el nombre de la persona que estudia, ni de nadie, en el repo,
  en commits o en la web. El nombre del sitio es "Mis Apuntes".
- **Los PDF no se suben** (`.gitignore` ignora `*.pdf` y `fuentes/`). El contenido se
  reescribe con nuestras palabras, completo y fiel al PDF.
- **Cobertura completa:** todo lo que está en el PDF y entra en examen debe estar en la web.
  Lo que el PDF marca como "no entra en examen" va en un bloque `noexamen`.
- **Nada inventado:** si se añade un ejemplo o una pista visual que no está en el PDF, debe
  ser coherente con él y no introducir datos que se puedan preguntar (números, autores…).
- Español de España, tono cercano y claro. Términos en inglés entre `<i class="en">…</i>`.

## Estructura
```
index.html                 armazón (menú, barra superior, buscador, barra móvil)
favicon.svg
assets/css/base.css        tokens de color, layout responsive, menú, buscador
assets/css/blocks.css      bloques de contenido y páginas
assets/css/viz.css         interactivos
assets/css/study.css       tarjetas, test
assets/js/app.js           router (#/…), menú lateral, búsqueda, tema claro/oscuro
assets/js/pages.js         inicio, mapa de tema, sección, atlas
assets/js/study.js         tarjetas (Leitner) y test
assets/js/render.js        bloques → HTML (+ montaje perezoso de interactivos)
assets/js/viz/index.js     REGISTRO de interactivos (id → módulo)
assets/js/viz/*.js         interactivos (cerebro, gráficas, juegos, modelos…)
content/indice.js          REGISTRO del temario (asignaturas → bloques → temas)
content/atlas.js           regiones cerebrales y redes COMPARTIDAS por todos los temas
content/<asig>/<bloque>/<tema>/
    tema.js                metadatos + orden de secciones + referencias
    parte-*.js             secciones (bloques de contenido)
    tarjetas.js            tarjetas de repaso
    test.js                preguntas tipo test
```

Rutas: `#/` · `#/tema/<key>` · `#/tema/<key>/<seccion>` · `#/tarjetas[/<key>[/<sec>]]` ·
`#/test[/<key>[/<sec>]]` · `#/atlas`. `key` = `<asig>-<bloque>-<tema>` (p. ej. `apm-b1-t3`).

## Código de color (fijo en toda la web)
| Red/área | Token | Uso |
|---|---|---|
| Alerta | `alerta` (ámbar) | `red: 'alerta'` |
| Orientación | `orient` (azul cobalto) | `red: 'orient'` |
| Control ejecutivo | `control` (coral) | `red: 'control'` |
| Consciencia | `consc` (violeta) | `red: 'consc'` |
| Marco general / intro | `base` (aguamarina) | `red: 'base'` |
Para temas nuevos de otra materia (percepción, memoria…) se pueden añadir tokens en
`base.css` (`:root` + modo oscuro) y en el selector `[data-red="…"]`.

## Sección
```js
{ id: 'alerta', num: '1.1', parte: 'I', red: 'alerta',
  titulo: 'Red de alerta', tituloHtml: 'Red de <em>alerta</em>',
  lead: 'Una o dos frases que resumen la sección.',
  minutos: 12, viz: ['Etiquetas cortas de sus interactivos'],
  bloques: [ … ] }
```
Cada sección debe terminar con un bloque `esencial`. Usa `trampa` para confusiones típicas.

## Tipos de bloque (`t`)
| t | Campos | Para qué |
|---|---|---|
| `p` | `html` | párrafo |
| `h` | `html` | apartado (entra en el índice lateral) |
| `h3` | `html` | subapartado |
| `lista` | `items[]`, `ordenada?` | lista |
| `concepto` | `tab, titulo, def, extra?, ej?, red?` | ficha de definición |
| `pares` | `a:{tag,titulo,texto,items?,ej?}, b:{…}` | A vs B |
| `tabla` | `titulo, nota?, cols:[{n,red?}], filas:[[dim, …]]` | comparativa (en móvil se elige columna) |
| `proceso` | `pasos:[{titulo,texto,donde?}]` | secuencia/etapas |
| `operaciones` | `items:[{titulo,texto,tareas?}]` | lista numerada grande |
| `glosario` | `items:[[término, definición]]` | vocabulario |
| `autores` | `items:[{quien, anio?, idea}]` | quién dijo qué |
| `clave` | `html, pie?` | frase para recordar |
| `ejemplo` | `emoji, titulo, texto` | ejemplo cotidiano |
| `trampa` | `items[]` | trampas de examen (post-it) |
| `esencial` | `items[]` | resumen final obligatorio |
| `noexamen` | `items[]` | lo que no entra |
| `check` | `q, a` | autoevaluación desplegable |
| `recurso` | `tipo:'link'|'video', titulo, url|null, desc` | enlace externo |
| `viz` | `id, k, titulo, desc, icon, props?` | interactivo (ver abajo) |

## Interactivos disponibles (`viz.id`)
- `brain` — cerebro con redes. `props: { redes:[…], activa?, ruta?, vistas? }`. Las redes y
  regiones salen de `content/atlas.js`; las rutas animadas también (`RUTAS`).
- Genéricos: `escalas`, `tdsMatrix`, `dosEjes`, `vertientes`, `rasgos`, `redesTres`,
  `corbetta`, `redesSwitch`, `proactivo`.
- Gráficas: `tonicaFasica`, `sdt`, `uInvertida`, `soaCurve`.
- Juegos: `mackworth`, `posner`, `busqueda`, `conjuncion`, `stroop`, `gonogo`.
- Modelos: `negligencia`, `normanShallice`, `inhibicionLateral`, `teatro`, `reentrante`,
  `gnw`, `cnc`.

Nuevo interactivo: función `export function nombre(el, props) { …; return cleanup }` en
`assets/js/viz/`, registrarla en `viz/index.js`. Debe: funcionar con toque y teclado, usar
solo tokens CSS (claro/oscuro), no desbordar a 390 px, y liberar timers en el cleanup.

## Tarjetas y test
- Tarjeta: `{ id, sec, frente, dorso, region? }`. **`id` estable y único** (guarda el
  progreso). `region` = id de `content/atlas.js` para dibujar el mini-cerebro.
- Pregunta: `{ id, sec, q, o:[4 opciones], c: índiceCorrecta, e: explicación }`.
  Las opciones se barajan solas. Preguntas propias, nunca copiadas de exámenes reales.
- Orientativo: 5–10 tarjetas y 3–6 preguntas por sección.

## Verificar (siempre, antes de publicar)
1. `node tools/check.mjs` → debe decir "Todo correcto" (ids, referencias, tablas,
   respuestas del test, interactivos registrados, regiones del atlas…).
2. Sintaxis: `node --input-type=module --check < archivo.js`.
3. Servidor local sin caché: `python .claude/serve.py 5173` (o la configuración
   `mis-apuntes` de `.claude/launch.json`). Con `python -m http.server` el navegador puede
   quedarse con versiones viejas de los módulos y engañarte.
4. Recorrer todas las secciones nuevas con scroll (los interactivos cargan al verse),
   pulsar sus botones y mover sus deslizadores: sin errores en consola, sin `.viz-err`,
   sin scroll horizontal a 390 px, y probar el buscador con términos del tema nuevo.

## Errores ya vistos (no repetirlos)
- Toda entrada del índice de búsqueda se normaliza en `buildIndex()`; no añadir entradas
  después ni de forma asíncrona.
- En las tablas, la primera celda de cada fila es la cabecera de fila: `cols` NO la incluye.
- Las teclas de los juegos solo hacen `preventDefault` si el juego las ha usado (devuelven
  `true`); si no, Espacio deja de desplazar la página.
- En los SVG con texto, evitar etiquetas largas: en móvil se ven a ~60 % del tamaño.
  Las etiquetas de los selectores de escenas deben ser cortas (campo `corto`).
- Contadores (interactivos, tarjetas…) se calculan de los datos, no de listas a mano.
