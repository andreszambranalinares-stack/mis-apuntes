---
name: anadir-temario
description: Añade un nuevo tema o bloque de temario a la web "Mis Apuntes" a partir de un PDF o texto de apuntes. Úsala cuando digan "añade este tema", "añade este bloque", "mete estos apuntes", "nuevo PDF de la asignatura" o similar.
---

# Añadir temario a Mis Apuntes

Lee primero `CLAUDE.md` (reglas, tipos de bloque, interactivos, colores). Toma como modelo
de calidad y de nivel de detalle `content/apm/b1/t3/`.

## 1. Leer el material completo
- Copia el PDF a la carpeta de pruebas, extrae el texto (`pdftotext -layout`) y **léelo entero**.
  Mira también las imágenes (`pymupdf`) para saber qué esquemas tenía la profesora.
- Identifica: asignatura, bloque (número romano + nombre), número de tema y título.
- Haz una **lista de cobertura**: cada epígrafe del índice del PDF, sus tablas, definiciones,
  autores con año, cifras (ms, %, años), clasificaciones, ejemplos y lo marcado como
  "no entra en examen".
- El PDF **no se sube nunca**: déjalo fuera del repo o en `fuentes/` (ignorado).

## 2. Decidir la estructura
- Una sección por epígrafe del índice, más una intro si hace falta (`parte: '0'`).
- Agrupa en `partes` (I, II…) como en el PDF.
- Asigna a cada sección un `red`/color del código de colores; si la materia es nueva
  (percepción, memoria…) añade tokens nuevos en `base.css` (claro y oscuro) y documéntalos
  en `CLAUDE.md`.

## 3. Elegir la forma de cada contenido
| En el PDF hay… | Bloque |
|---|---|
| Definición | `concepto` |
| Dos cosas que se contraponen | `pares` |
| Tabla o varias dimensiones | `tabla` |
| Etapas o secuencias | `proceso` |
| Listas de funciones u operaciones | `operaciones` |
| Vocabulario | `glosario` |
| Autor + aportación | `autores` |
| Regiones cerebrales | `viz` → `brain` (añade las regiones o redes que falten en `content/atlas.js`, con coordenadas en el viewBox 600×400, frontal a la derecha) |
| Un experimento o paradigma | un interactivo jugable (reutiliza uno de los que hay o crea uno nuevo) |
| Un modelo o diagrama | un interactivo animado (en `modelos.js` o `diagramas.js`) |
| Confusiones típicas | `trampa` |
| Lo que no entra | `noexamen` |
Cada sección acaba con `esencial`. Al menos un interactivo por sección cuando el contenido
lo permita. Prioriza lo visual: si hay cerebro, que se vea dónde; si hay flujo, que se mueva.

## 4. Crear los archivos
1. `content/<asig>/<bloqueId>/<temaId>/parte-*.js`, `tarjetas.js`, `test.js` y `tema.js`
   (copia la forma de `t3`).
2. Regístralo en `content/indice.js` (crea la asignatura o el bloque si no existe).
3. Tarjetas con `id` únicos con prefijo del tema (`t4-…`) y `region` cuando haya zona cerebral.
4. Preguntas propias con explicación, repartidas por secciones.
5. Interactivos nuevos: registro en `assets/js/viz/index.js` + lista en `CLAUDE.md`.

## 5. Verificar (obligatorio)
- `node --input-type=module --check < archivo.js` para cada archivo nuevo.
- Servidor local (`.claude/launch.json` → `mis-apuntes`) y recorrer todas las secciones
  nuevas con scroll hasta abajo: ningún `.viz-err`, ninguna excepción en consola.
- A 390 px de ancho: sin scroll horizontal. A 820 px y a 1280 px se ve bien.
- Ejecuta el agente `revisor-cobertura` con el PDF y la carpeta del tema y corrige lo que falte.

## 6. Publicar
- `git add` (comprueba que no entra ningún PDF ni ningún nombre propio), commit en español,
  `git push`. Pages se actualiza solo en uno o dos minutos.
- Di qué secciones, interactivos, tarjetas y preguntas se añadieron, y el enlace.
