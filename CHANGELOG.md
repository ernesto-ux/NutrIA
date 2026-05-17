# Changelog - NutrIA

## [V3.0 — Major refactor: 13 tabs → 6 unified tabs in English] - 17 mayo 2026
### Restructured (BREAKING UX)
**13 tabs colapsadas a 6 con sub-tabs internos. Todo en inglés.**

| Antes (13) | Después (6) | Sub-tabs internos |
|---|---|---|
| 🍽️ Meals + 📷 Journal | 🍽️ **Journal** | Today / Photos |
| 🎬 Recap + 📅 Historial + 💰 Finanzas | ✨ **Insights** | Recap / History / Finances |
| 📊 Informes | 📊 **Reports** | (single page) |
| 🤖 Coach | 🤖 **Coach** | (single page) |
| 🏃 Actividad + 🏥 Salud | 🏋️ **Health** | Activity / Body |
| 🥗 Nutricion + 📚 Library + 🏠 Hogar + 🛠️ Tools | 🛠️ **Tools** | Settings / Food Library / Foods Editor / Pantry |

### Header layout fix
- **Top bar now full-width** (no more cut-off at sidebar)
- **Sidebar starts BELOW top bar** (`top: 64px` instead of `top: 0`)
- **Removed duplicate otter** (sidebar-brand at left top + brand on right was awkward)
- Top bar contains: brand logo + date nav + user switcher (E/A)

### Implementation details
- New state: `journalSubTab` `insightsSubTab` `healthSubTab` `toolsSubTab`
- Helper `setSubTab(tab, sub)` triggers re-render
- Reusable `subTabBar(tab, options, current)` for the sub-tab selector UI (toggle pills)
- Backward-compat: legacy period names (`hoy`, `historial`, `informes`, `finanzas`, `hogar`, `actividad`, `salud`, `fotos`, `library`, `recap`) still route to original renderers as aliases. Default fallback = renderDay()
- `navigateDay()` / `goToDate()` now bring user back to `journal` tab with `meals` sub-tab
- Drag-and-drop only initialized when in journal/meals view

### Razón del cambio (UX)
- **13 tabs verticales abrumaban** (sidebar saturada con icons pequeños)
- Apps profesionales (Apple Health, MyFitnessPal) usan **4-6 secciones** con sub-tabs
- **Mobile mejorado**: 6 buttons caben en una fila sin scroll
- **Coherencia semántica**: cada tab tiene una narrativa (Journal=diario, Insights=análisis, Reports=números formales, Coach=AI, Health=cuerpo, Tools=gestión)

## [V2.5 — Recap tab + Health multi-user + Heatmap 365d Informes + UI fixes] - 17 mayo 2026
### Borrado / Limpieza
- **3 fotos del Dom 3 May eliminadas** (mal identificadas por usuario) tanto de `local-photos.json` como del filesystem
- **32 autoasociaciones mealId limpiadas**: fotos backfilled sin AI analysis ya no claim text-match (evita errores visuales). Si el usuario quiere asociar, lo hace después o vía Claude vision

### Fixed (UI)
- **Balance Energético Diario invertido**: más reciente arriba. Sum totales no cambia (orden-independent)
- **Resumen 7 bloques responsive**: cambio de `repeat(6,1fr)` a `repeat(auto-fit,minmax(120px,1fr))` → cabe en 1 fila pantalla ancha, doble fila estrecho, mobile en columna
- **Day strip iOS**: quitado icono 📷 (irritante visual). El dot de color sigue (verde óptimo / azul déficit / amarillo atención / rojo exceso) con tooltip explicativo
- **Health multi-user**: `getUserWeightLog()` filtra WEIGHT_LOG por currentUser (Adriana ya no ve datos de Ernesto). Si sin data → empty state explicativo. Aplicado a 6 usos de WEIGHT_LOG

### Agregado
- **Botón "📊 All time"** en Informes: extiende rango desde 29/03/2026 hasta hoy. Útil para análisis global
- **Pestaña 🎬 Recap** (entre Journal e Historial):
  - Hero card con avg kcal/día, avg proteína, días en target, días con registro
  - Targets semanales con progress bars + colores (verde ≥100%, amarillo ≥75%, rojo <75%):
    - 🏋️ Gym: meta **4 sesiones/semana**
    - 🚶 Pasos: meta **70k semana / 10k día**
    - Conteo de días con ≥10k pasos
  - Day-by-day strip 7 cards (Lun-Dom) con kcal/prot/markers gym+10k
  - Embed Stories legacy (movido desde Tools)
- **Heatmap 365 días en Informes** (además del 90d en Insights):
  - Helper `renderAdherenceHeatmap(daysCount, title)` reusable
  - Cell size auto-ajustado (10px para 365d, 14px para 90d)
  - Sin overlays emoji en vista anual (demasiado denso)
  - Stats: % adherencia + días en target

### Movido
- **🧮 Calculadora Metabólica**: de Salud → Tools. Encima de Claude Vision + Apple Health. Función extraída a `renderCalculadoraMetabolica()` reusable
- **NutrIA Stories**: de Tools → Recap (mejor contexto temático)

### Sidebar reorganizado
Orden nuevo (sidebar + mobile): **Meals · Journal · Recap · Historial · Informes · Finanzas · Hogar · Coach · Nutricion · Actividad · Salud · Library · Tools**

(Eliminado: tab Insights duplicaba contenido con Coach + Recap. El heatmap 90d sigue accesible via Recap.)

## [V2.4.1 — HOTFIX Photo Journal crash] - 16 mayo 2026
### Fixed (CRÍTICO)
- **Photo Journal mostraba página en blanco**: `renderPhotoJournal()` llamaba `getMeals()` que no existe → `ReferenceError` silencioso → page crash con HTML vacío. Fix: reemplazado por `getAllMeals()` (la función correcta que merge MEAL_LOG legacy + local-meals.json + filtra por currentUser). 3 ocurrencias reemplazadas en photo journal + photo strips + analyzePhotoVsText.
- Esto explicaba por qué clicar 📷 Journal "no hacía nada" — el render fallaba antes de generar HTML.

### Verificado (datos están presentes pese a reporte usuario)
- Ernesto 29/03 → 15/05: **48/49 días con data** (solo 16/05 sin loggear)
- May 1: 4 meals, 2074 kcal ✓
- May 2: 6 meals, 1916 kcal ✓
- May 4: 4 meals, 1769 kcal ✓
- May 11: 4 meals, 2550 kcal ✓ (desayuno hotel + almuerzo The Jgo Toulouse + snack religieuse + cena pan pumpernickel)

El usuario probablemente no veía los datos porque el render crasheaba en cuanto pasaba por Photo Journal.

## [V2.4 — Food image library + Library tab + Photo thumbnails embebidos + goToDate fix] - 16 mayo 2026
### Fixed (críticos)
- **Day strip click no funcionaba**: faltaba `window.goToDate(ymd)`. Solo respondían las flechas izquierda/derecha del header. Ahora click en cualquier celda del strip salta al día + scroll top
- **Photo Journal vacío en producción**: las photos en `photos/ernesto/*.jpg` no se mostraban porque las URLs relativas requieren servidor HTTP. Solución: regenerado `local-photos.json` con thumbnails base64 embebidos (380px max, JPEG quality 60, ~28KB cada uno, ~1.4MB total). Ahora las fotos cargan SIN dependencia de servidor

### Agregado
- **Food image library**: nuevo mapa `FOOD_IMAGE_MAP` con ~140 URLs de Unsplash (240px, quality 70) para los alimentos más comunes: proteínas, lácteos, frutas, verduras, carbs, pizza, fast food, pastry, charcuterie, snacks, bebidas, platos cocinados, suplementos, condimentos
- Helper `window.getFoodImageUrl(food)` con prioridad: `food.imageUrl` (custom per-entry) → `FOOD_IMAGE_MAP[food.id]` → null (fallback a emoji)
- **Nueva pestaña 📚 Library** (entre Nutrición y Actividad en sidebar/mobile nav):
  - Catálogo browseable con grid de cards 140px minWidth
  - Cada card: imagen 1:1 (URL real o emoji placeholder), nombre, marca, 4 macro chips coloridos, precio €/100g si disponible, source badge, indicador 📷 si tiene imagen
  - Hover effect: lift + shadow expanded
  - Click → editFoodDB (modal de edición existente)
  - **Búsqueda en vivo** por nombre/marca/id (sin recargar grid completo)
  - **Filtros por categoría**: 13 botones coloreados, sólo se muestran las que tienen items
  - **Ordenamiento**: A-Z · Kcal ↑ · Kcal ↓ · Proteína ↓ · Recientes
  - **Filtro por fuente**: Todas · Recetario · Verificadas · USDA · User · Web
  - Header stats: total alimentos + cobertura % con imagen
- Photo thumbnails: base64 embebidos en local-photos.json (380px, q60). Cobertura: 38/38 fotos (100%)

### Implementación
- `getStoredPhotos()` prioriza `base64Thumb` (embebido) sobre `path` (URL servidor) — robusto sin server
- `local-photos.json`: 1.4MB total con 38 thumbnails embebidos
- Photos full-size siguen en `photos/{user}/*.jpg` para click → fullsize cuando servidor disponible
- Library tab states (search, category, sort, sourceFilter) en globals para mantener estado entre re-renders

### Roadmap completado V2.0
✅ libheif-js (V2.1) — HEIC decode
✅ Food card redesign Virtuagym (V2.1)
✅ Claude vision integration (V2.1)
✅ Photo backfill (V2.1)
✅ Piecewise targets (V2.1, V2.2)
✅ Photo Journal page (V2.2)
✅ Heatmaps de patrones (V2.2)
✅ Day strip navigator (V2.3)
✅ Insights tab (V2.3)
✅ Photo timeline (V2.3)
✅ Bulk import (V2.3)
✅ Food image library (V2.4)
✅ Library tab (V2.4)

## [V2.3 — Day strip + Insights tab + Photo timeline + Bulk import + Diagnostics] - 16 mayo 2026
### Agregado
- **🗓️ Day strip navigator iOS-style** (top de Meals tab):
  - Strip horizontal scrollable de 14 días (-10 a +3 desde currentDate)
  - Cada cell: día de semana (DOM-SÁB) + número grande + dot de status
  - Dot color por % vs target: verde optimal, azul deficit, amarillo warn, rojo exceso
  - Cell activa con gradient naranja (`#F97316→#EA580C`) + sombra
  - Cell "hoy" con border teal cuando no es la activa
  - Indicador 📷 superior derecho si hay fotos ese día
  - Click → `window.goToDate(ymd)` cambia currentDate
  - Tooltip con fecha legible al hover

- **✨ Nueva pestaña Insights** (entre Journal e Historial):
  - **Card naranja Racha actual**: 3 contadores grandes — días en target consecutivos, días proteína OK, semanas con 3+ gym
  - **Stats grid** (5 KPIs): días registrados, % adherencia, sesiones gym, pasos totales (k), kcal activas (k)
  - **📆 Mapa de adherencia 90 días**: heatmap cells 14×14px coloreadas por % vs target (6 niveles: azul fuerte <70%, azul claro 70-85%, verde target ±10%, amarillo +25%, naranja +50%, rojo crítico). Emojis 🏋️🚶 superpuestos por día. Click → `goToDate()`
  - **🏅 Logros**: 10 milestones desbloqueables (rachas 3/7/14/30, 2+ semanas con gym, 500k pasos, 70% adherencia, 30/60 días registrados). Cards desbloqueadas en gradient amarillo, locked en gris dashed con conteo "X días más"
  - **📊 Resumen semanal**: últimas 12 semanas con avg kcal, prot, % target, sesiones gym + kcal gym

- **📅 Timeline view** en Photo Journal (toggle Cards/Timeline):
  - Vista alternativa: grid denso de thumbnails 72×72 agrupados por mes
  - Border verde si meal text-matched, naranja si standalone
  - Día número superpuesto en esquina inferior izquierda
  - Click → fullsize en nueva pestaña
  - Vista 'cards' original sigue siendo default

- **📂 Bulk import** desde carpeta en Photo Journal modal:
  - Botón "📂 Importar carpeta" (gradient morado) en el empty state
  - Usa `webkitdirectory` + `directory` attributes en `<input type="file">`
  - Filtro automático a imágenes: `.jpg/.jpeg/.heic/.heif/.png/.webp`
  - Si folder tiene archivos no-imagen, los descarta silenciosamente
  - Mensaje "(filtradas de N archivos)" si aplicó filtro
  - Attrs limpiados después del select para que el botón normal funcione bien

- **🔍 Diagnostic mejorado** en Photo Journal empty state:
  - Muestra contadores: backfill cargado vs localStorage del navegador
  - Hint si backfill = 0: "URL no puede acceder a local-photos.json (404)"
  - Útil para debugging cuando la pestaña aparece vacía

### Fixed
- Photo Journal: filter input ahora acepta archivos múltiples + folders correctamente
- onPhotoJournalSelect filtra extensiones de imagen automáticamente

### Roadmap restante (próximas sesiones)
- Food image library con URLs reales (Unsplash API o map manual de top foods)
- Library tab navegable (catálogo browseable FOOD_DATABASE con imágenes)

## [V2.2 — Photo Journal tab + Heatmaps de patrones + Piecewise targets historial] - 16 mayo 2026
### Agregado (Photo Journal navegable)
- **Nueva pestaña "📷 Journal"** en sidebar + mobile nav (entre Meals e Historial)
- `renderPhotoJournal()`: grid cards 200px min-width, agrupadas por día DESC
- Cada card por foto: imagen + horario + meal type + items (truncated 3+más) + macro chips coloridos + triple check (✓P ✓F si cumple) + AI badge si analizado
- Click en imagen: abre en nueva pestaña (full size). Click en AI badge: modal con análisis Claude completo
- Border verde si match con texto loggeado, naranja si standalone (sin texto)
- Stats header naranja: total fotos · días con foto · matches con texto · analizadas IA
- Botón "🤖 Analizar" inline si Claude key configurada y foto no analizada

### Agregado (Heatmaps de patrones)
- **🌡️ Mapa de comportamiento** (en Coach tab): tabla de promedios por tipo de día × métricas (kcal/prot/carbs/fat) con código de colores
  - Categorías: 🏋️ Día gym (>200kcal), 🚶 Día caminata (>10k pasos sin gym), 😴 Día descanso (<5k pasos), 🎉 Findes, 💼 Días de semana
  - Color gradient por % vs target: verde (excelente <85%), verde claro (óptimo), amarillo (atención), naranja (exceso), rojo (crítico)
  - Columna final Δ vs target kcal
- **📅 Patrón semanal**: 7 cards (Lun-Dom) con avg kcal/prot por DOW. Marcadores 🏋️ si >30% días con gym ese DOW, 🚶 si avg >8k pasos
  - Color de fondo = kcal vs target del día

### Fixed (Piecewise target line historial)
- Bug: línea punteada del chart Historial (Calorías / Proteína / Carbs / Grasas) era una sola horizontal fija al `currentMetric` target, ignoraba cambios en `targetsHistory`
- Ahora: por cada métrica activa, computa target per-day, agrupa segmentos contiguos, renderiza líneas separadas
- Cada segmento muestra su valor target con unidades (kcal/g) centrado encima
- Aplica a TODAS las métricas (no solo kcal). Ej: si cambias proteína target el 11/05, la línea se ajusta cuando seleccionas "Proteína" en metric pills

### Roadmap aún pendiente
- Day strip navigator iOS-style
- Food image library (auto-fetch URL real)
- Insights tab dedicado (separado de Coach)
- Library tab (browseable foods)
- Bulk import desde UI carpeta
- Photo timeline view (cronológico)

## [V2.1 — HEIC decode + Food cards Virtuagym + Claude vision + Photo backfill] - 16 mayo 2026
### Agregado (Roadmap V2.0 entregado)
- **HEIC browser decode** vía heic2any (libheif wrapper, CDN cdnjs ~1.5MB): tus fotos iPhone se ven directo sin convertir a JPG. Fallback al placeholder 📱 si la decodificación falla
- **Food card redesign estilo Virtuagym**: cada card ahora con icon prominente 44×44 categoría (gradient color por categoría) + nombre + chips de macros coloridos (kcal amarillo, P rosa, C azul, F naranja, € verde). Layout horizontal flex en lugar de stacked
- **Claude AI Vision integration**:
  - Card en Tools tab "🤖 Claude AI Vision" para configurar API key (sk-ant-...). LocalStorage scoped. Link directo a console.anthropic.com
  - Botón "🤖 Analizar" aparece en photo strip de meal cards cuando hay key + foto con preview
  - Llama claude-sonnet-4-6 con `anthropic-dangerous-direct-browser-access: true` (no proxy)
  - Prompt estructurado pide: 1) descripción visual, 2) alineación alta/media/baja, 3) discrepancias concretas, 4) score 0-100
  - Resultado en modal con preview foto + texto formato markdown
  - aiAnalysis se guarda en photo entry para historial
- **Photo backfill desde Downloads** (`local-photos.json`):
  - Script extrajo 43 HEIC files de ~/Downloads, filtró por rango Apr-May 2026 (38 fotos)
  - sips convertir a JPEG 1200px max → carpeta `photos/ernesto/{date}_{filename}.jpg`
  - EXIF date via `mdls kMDItemContentCreationDate`
  - Inferencia mealType por hora + match a entries existentes en local-meals.json
  - Resultado: **32 fotos linkeadas a meals, 6 unmatched** (rango Apr 18-19 sin meal entries)
  - Storage: `local-photos.json` en server-side (vs localStorage browser-side). Dashboard merge automático
- **Piecewise target line en CALORIAS DIARIAS chart**: cuando hay cambios en `targetsHistory` (e.g. Ernesto cambió de 1770 → 1686 el 2026-05-11), la línea punteada de objetivo ahora se ajusta visualmente con segmentos. Cada segmento muestra el kcal target específico vigente para ese rango de días

### Implementación técnica
- Nuevos files: `local-photos.json`, `photos/{user}/` directory
- Nuevas funciones: loadHeic2Any, convertHeicToJpeg, callClaudeVision, analyzePhotoVsText, saveAnthropicKey, clearAnthropicKey, renderPiecewiseTargetLine
- _backfillPhotos global merged con localStorage via getStoredPhotos() (server-side has priority for backfill_ ids)
- Architecture multi-user preservada: backfill filtra por `(p.user || 'ernesto') === currentUser`
- CSS: nuevas clases `.food-icon`, `.food-body`, chips coloreados `.macro-chip.{kcal,prot,carbs,fat,price}`

### Roadmap pendiente (próximas sesiones)
- Day strip navigator iOS-style (barra horizontal Dom-Lun-Mar... en lugar de date picker)
- Food image library (auto-fetch URL de imagen real per food del DB, no solo emoji)
- Insights tab (streaks, weekly digest, achievements)
- Library tab (catálogo browseable foods con imágenes)
- Bulk photo import directo desde ~/Downloads/ vía UI (botón "Importar carpeta")
- Photo timeline view (grid por día/semana de todas las fotos)

## [V2.0 — Photo journal + vertical sidebar + visual refresh] - 16 mayo 2026
### Agregado (Major UX evolution — inspirado en Virtuagym + iOS food log)
- **Vertical sidebar desktop**: nav lateral fija 88px con gradient teal, iconos grandes (22px) + labels (9px uppercase), barra activa lateral blanca. Adiós a las pills horizontales arriba (overflow-scroll → vertical permanente).
- **Bottom nav mobile**: nav inferior horizontal con scroll-x, iconos 20px + labels cortos (4-5 chars), versión adaptada para celular. `@media (max-width:880px)` switch automático.
- **Photo journal feature** (nuevo módulo):
  - FAB naranja (🧡 `#F97316→#EA580C`) junto al `+` verde: abre modal de subida de fotos
  - **EXIF DateTimeOriginal extraction** desde bytes JPEG (no library deps): lee marker 0xFFE1 → IFD0 → ExifIFD → tag 0x9003. Fallback a `file.lastModified` para HEIC u otros sin EXIF
  - **Compresión automática** a base64 (max 800px, JPEG quality 0.82) via canvas → localStorage por usuario (`nutria_photos_${user}`)
  - **HEIC detection**: navegador no decodifica HEIC nativo, se almacena metadata sin preview (icono 📱)
  - **Inferencia automática** de mealType desde hora EXIF: <11=desayuno, <15=almuerzo, <19=snack, ≥19=cena
  - **Auto-link con meal existente**: cuando date+mealType matchea con entry en local-meals.json, asocia automáticamente. Si no, queda standalone con badge "⚠ Sin texto loggeado"
- **Photo strip en meal cards** (Meals tab):
  - Thumbnails 56×56 con border verde si hay text-match, naranja punteado si solo foto
  - Click expande imagen en nueva pestaña
  - Badge `📷N` en título del meal cuando hay fotos
  - **Discrepancy alert**: si hay fotos pero `kcal === 0` (sin texto), banner amarillo "⚠ N foto(s) sin texto loggeado"
  - Para HEIC sin preview: icono 📱 + hint "convertir a JPG en Photos.app"

### Implementación técnica
- Nuevos files: ninguno (todo en index.html). Photos persistidos en localStorage como base64 → portable, sin filesystem deps
- Architecture: `users.{ernesto, adriana}` ya soportado (currentUser scoped storage)
- Funciones añadidas (window scope): openPhotoJournal, closePhotoJournal, onPhotoJournalSelect, deletePhoto, getPhotosForMeal, readExifDate, compressToBase64, inferMealFromHour, getStoredPhotos, setStoredPhotos
- `setPeriod()` actualizado: sync active state a `.sidebar-tab, .mobile-nav-tab, .pill[data-period]` (all three nav surfaces)
- Removed: legacy `period-pills` horizontal nav, mask-image fade overflow

### Roadmap futuras sesiones
- **Photo-text comparison vía Claude vision**: detectar cuando texto loggeado no matchea foto (e.g., loggeas pollo pero foto muestra pizza)
- **Food image library**: auto-fetch imagen de cada food del DB para mostrar en cards estilo Virtuagym
- **Food card redesign**: imagen + macros prominentes (rings circulares) + click expandible
- **Day strip navigator**: barra horizontal de días recientes (estilo iOS) en lugar de date picker
- **Insights tab**: streaks, achievements, weekly summary
- **Library tab**: catálogo browseable de foods con imágenes
- **Lectura HEIC**: integrar libheif-js para decode HEIC en browser (requiere ~200kb library)

## [Multi-user schema + carga masiva May 6-15 + fixes UI] - 16 mayo 2026
### Fixed (Schema multi-user crítico)
- **`who` → `user` everywhere**: MEAL_LOG en nutrition-data.js tenía 116 entries de Adriana con campo `who` (no `user`). Causa: el dashboard solo veía 7 días de Adriana (vs 29 reales). Migración aplicada: 288 entries MEAL_LOG (172 ernesto + 116 adriana), 12 entries local-meals.json con campo duplicado limpiadas, 40 ACTIVITY_LOG + 8 DAILY_BALANCE tagged con user
- **Dashboard reader**: chain `m.user || m.who || 'ernesto'` (backward-compat)
- **body-comp-history.json v2**: restructurado `users.{ernesto,adriana}` con per-user profile + weekly_snapshots + metabolic
- **local-activity.json schema fix**: `activeKcal` → `stepsKcal` + añadido `gymKcal` (merge desde local-gym.json) para que dashboard lo lea
- **renderActividad() bugs**: no merge con `_extraActivity` ni filter por currentUser. Fix: merge ACTIVITY_LOG + local-activity priority local > legacy, filter por currentUser

### Agregado (Data load May 6-15)
- **Adriana**: 27 meal entries (May 7-15, 7 días), TDEE 1925 kcal (BMR 1244 Mifflin × 1.55 moderado), targets vigentes 1630 kcal = déficit -300 validado
- **Ernesto**: 32 meal entries (May 8-15, 8 días), 9 días pasos (3697→16622 rango), 3 sesiones gym (May 10/12/14, 530-580 kcal)
- **Targets Ernesto**: nuevo entry 2026-05-11 → 1686 kcal / 172P / 101C / 66F (anterior: 1770/190P/140C/50F)
- **~50 alimentos nuevos** en FOOD_DATABASE: McDo+KFC combos, crepe variants (jambon-fromage/caramel-beurre-salé/classique), entrecôte, magret-canard, écrasé pdt, ensalada chèvre, vino rosé/merlot, religieuse framboise, mini croissant/pain-chocolat hotel, bacon, chipolata, nutella, panna cotta, IKEA hotdog veg, aderezo yogur griego, old amsterdam, bolkiri thai, queso roquefort, alcaparras, galleta crème london, financier pistacho, salmón ahumado, etc.
- **86 precios nuevos** en local-prices.json (343 → 368 total, 0 missing ✓)
- **FOOD_DATABASE**: 275 → 339 alimentos

### Agregado (Profile metabolic)
- Adriana: BMR 1244, TDEE 1925 (breakdown: BMR + pasos 260 + gym 229 + NEAT 187 = 1919)
- Ernesto: BMR 1819, TDEE 2182 sedentario
- Schema `profile.metabolic { as_of, weight_kg, bmr_mifflin, activity_factor, activity_label, tdee_maintenance, breakdown, deficit_options, notes }`

### Fixed (UI dashboard)
- **CALORIAS DIARIAS chart**: scroll horizontal cuando >21 días. Bars ancho fijo 28-46px para números kcal sin solape. Hint visual + threshold inteligente
- **Balance Energético table**: sticky header con position:sticky + max-height:560px, scroll interno de filas con columnas siempre visibles

### Fixed (Data corrections solicitadas por usuario)
- May 10 Ernesto: entrecôte 250g→200g (compartida 400g/2), papas 200g→125g (-349 kcal)
- May 12 Ernesto: Bolkiri Thaï per100g recalculado (kcal 165→159, carbs 12→4.7) + porción 620g→485g — error: asumí fideos pero base es germinados de soja. -252 kcal
- May 8 Ernesto: postres libaneses 100g→60g (-152 kcal)
- May 9 Ernesto: split brunch en desayuno + almuerzo. Aderezo casero → industrial 1/2 bolsita. Crêpe snack 180g→150g classique
- May 15 cena: alcaparras 12g añadidas (faltaban), mani-salado proxy → pistacho-picado real

### Notas operacionales
- Backups completos pre-migración multi-user: `~/Desktop/NutrIA/backups/pre-multiuser-migration/` (excluido de git)
- Commits: dabe994 (activity schema), 5b7c131 (renderActividad bugfix), 31c55c7 (sticky header), 1a7c1b4 (chart scroll), 399ee7a (targets), 244ea73 (data fixes), 060a686 (Adriana 27 meals + prices + activity)

## [Fase H4 · Gym detail completo] - 02 mayo 2026
### Agregado
- **`local-gym.json`**: archivo nuevo para sesiones detalladas de gym (cargado al boot junto a meals/prices/activity)
- **Schema sesión gym**: id, user, date, type (8 categorías), durationMin, rpe (1-10), hrAvg, hrMax, kcalBurn, exercises[{name, sets, reps, weightKg}], notes, timestamp
- **Tipos de entreno** (8): 🔼 Push · 🔽 Pull · 🦵 Legs · 💪 Full Body · 🏃 Cardio · 🔥 HIIT · 🏋️ Crossfit · 🧘 Recovery
- **💪 Gym Detail card** en tab Activity (parte superior):
  - KPIs últimos 30 días: sesiones, minutos totales, kcal quemadas
  - Frecuencia por tipo de entreno con conteo + volumen total (sets×reps×kg) cuando aplica
  - Card de última sesión con ejercicios + RPE + notas
  - Detalle expandible últimas 10 sesiones
- **Modal "+ Nueva sesión"**: formulario completo con date, type, duration, RPE, HR, kcal, ejercicios (texto multilínea formato `nombre, sets, reps, peso`), notas
- **Persistencia**: localStorage `nutria_gym_local` (in-memory + persiste). Al hacer commit/push manual sync con local-gym.json
- **Dónde verlo en app**: tab **Actividad** → "💪 Gym Detail (últimos 30 días)"

## [M + E2/E3 scaffold] - 02 mayo 2026
### Agregado — Opción M · Categorización FOOD_DATABASE
- **250 alimentos categorizados** con tag `category` en nutrition-data.js
- 13 categorías canónicas: proteina-animal (51) · snack-treat (38) · lacteo (34) · cereal-carbs (26) · verdura (24) · otros (21) · comer-fuera (17) · grasa-frutos-secos (16) · suplemento (8) · fruta (7) · legumbres (3) · condimento (3) · bebida (2)
- **Treemap (Finanzas) ahora usa el field directo**, no heurística (más preciso)
- Función `categorizeFood()` extiende prefer-field, fallback heurística para items in-memory (OCR)
- Constante `CATEGORY_META` con label/emoji/color canónicos
- **Dónde verlo en app**: tab **Finanzas** → "🗺️ Treemap costo por categoría"

### Agregado — Fase E2/E3 · Supabase backend (scaffold)
- **`modules/db-supabase.js`**: módulo cliente completo (auth + meals CRUD + migration + setup helpers)
- **`db-schema.sql`**: schema completo (profiles, meals, activity_entries, weight_entries, households, household_members) + RLS policies + trigger profile-on-signup
- **`SUPABASE_SETUP.md`**: guía paso a paso (~30 min) — crear proyecto, ejecutar SQL, obtener creds, conectar, signUp, migrar local-meals.json, household sharing E3
- **Panel en Tools**: status semáforo + botón configurar (prompt URL + anonKey) + link a docs + disconnect
- **Dónde verlo en app**: tab **Tools** → "☁️ Supabase Backend (Fase E2/E3)"
- TODO pendiente: UI auth completa + auto-sync hooks (módulo está listo para conectar)

## [I + L + N + Bulk Franprix] - 02 mayo 2026
### Cambiado
- **Bulk update PRICE_DB → Franprix**: 160 alimentos consolidados a "Franprix" (antes Carrefour/Monoprix/Lidl/Picard/etc). Restaurantes (40) y Homemade (52) sin tocar
- **Distribución actual**: Franprix 160 · Homemade 52 · Albert Heijn (viaje) 5 · 40 restaurantes específicos

### Agregado — Opción L · PIN validación
- Setup de PIN ahora valida colisión: si Adriana intenta poner el mismo PIN que Ernesto (o viceversa) → bloqueado con mensaje claro
- Aplica a `enableLock()` y `setupAnotherPin()`

### Agregado — Opción I · Forecast trace + Treemap
- **Forecast line en chart de peso** (Salud): regresión lineal sobre últimos 14d de MA proyectada hasta 60 días adelante
  - Línea púrpura punteada
  - Marcador "hoy" vertical en gris
  - Label en endpoint con peso proyectado
  - Solo visible si slope < 0 (tendencia bajando)
- **Treemap costos por categoría** (Finanzas): clasificación automática heurística
  - Categorías: Snack/Treat · Suplemento · Comer fuera · Lácteo · Proteína animal · Cereal/Carbs · Legumbres · Fruta · Verdura · Bebida · Grasa/Frutos secos · Otros
  - Stacked bar de proporciones
  - Cards por categoría con costo, % del total, top items

### Agregado — Opción N · Catálogo completo de precios
- **Sección expandible en Finanzas** "📚 Catálogo completo de precios"
- Muestra los 252 alimentos con precio (no solo consumidos)
- Búsqueda fulltext + filtro por tienda (top 8)
- Por fila: nombre+marca+store, kcal/100g, €/unidad (cuando aplica), €/100g
- Ordenado por €/100g descendente, scrollable

## [Cierre Fase B/D + Casa-vs-Fuera fix] - 02 mayo 2026
### Arreglado
- **Casa vs Fuera (Finanzas) lógica corregida**: antes Carrefour/Monoprix/Franprix contaban como "Fuera" (incorrecto, son supermercados para cocinar en casa). Ahora:
  - **Casa** = Homemade + supermercados (Carrefour, Franprix, Monoprix, Lidl, Picard, Albert Heijn, Boulangerie, etc.)
  - **Fuera** = Restaurantes (Pizza Hut, Subway, McDonald's, Pizzou, Biyo, Van Stapele, Hotel, Starbucks, Holy Cookie, Jeff de Bruges, etc.)
- Card Casa vs Fuera ahora muestra **explicación** + lista de tiendas detectadas en cada categoría

### Agregado — Fase B 4.1.3 (último item)
- **Modo Casa/Fuera/Delivery** en Coach: 3 botones que filtran las sugerencias según contexto
  - 🏠 Casa: alimentos del FOOD_DATABASE excluyendo recetas completas y restaurantes
  - 🍽️ Fuera: items de restaurantes + recetario completo
  - 🛵 Delivery: subset de restaurantes con delivery viable

### Agregado — Fase D 4.5.1 (último item)
- **📸 OCR de etiquetas nutricionales** en Quick add: reusa Tesseract.js (ya cargado para Renpho)
  - Botón captura de cámara o foto local
  - Extrae kcal/proteína/carbs/grasas/fibra/sodio/azúcar/SF de etiquetas (ES/FR/EN)
  - Detecta basis "por 100g" automáticamente
  - Conversión sal→sodio (× 400)
  - Botón guardar como nuevo alimento (en memoria, persiste al loggear)

## [Opción K · Micros completos] - 02 mayo 2026
### Agregado
- **Schema FOOD_DATABASE extendido** con 6 micros nuevos por alimento:
  - 🩸 Iron (mg) · 🦴 Calcium (mg) · 🧬 B12 (μg) · ☀️ Vit D (μg) · 🍌 Potassium (mg) · 🌰 Magnesium (mg)
- **51 alimentos top consumidos** rellenados con valores USDA/equivalentes:
  - Lácteos (ricotta, cottage, skyr, hipro, kefir, beaufort, queso maduro, feta, alpro)
  - Proteínas (pollo pechuga/carne, huevo, clara, jamón ibérico, salmón, lentejas)
  - Snacks/Carbs (cookies, oreo, eafit, wasa, tastybasics)
  - Frutas (fresas, frambuesas, banana, melón, uva, aguacate, tomate cherry, pimiento)
  - Bebidas (café negro, coca cola zero, té rooibos)
- **Panel Micros extendido** en Nutricion → 🔬 Micros tab:
  - Sección Macros/WHO limits (fibra/sodio/azúcar/SF) — ya existía
  - Nueva sección Micros/RDA mínimos (los 6 nuevos) con adequacy bars
  - Card de alertas al tope si hay déficits ≥25% bajo RDA o excesos
  - Cobertura del DB visible: "X/247 alimentos con micros completos (Y%)"
  - Comparativa semana vs mes ahora incluye los 10 micros

### Referencias RDA
- Iron: 8mg (hombre), 18mg (mujer)
- Calcium: 1000mg
- B12: 2.4μg (crítico vegetarianos)
- Vit D: 15μg (600 IU)
- Potassium: 3500mg
- Magnesium: 400mg

## [Fixes pos-feedback] - 02 mayo 2026
### Cambiado
- **Auto-lock idle**: default 30 min → **24h** (1440 min). Lock manual sigue disponible
- **Quick add FAB**: ahora **solo visible en tab Meals** (no estorba en otros)
- **Lista compras**:
  - Restaurantes excluidos (RegEx: McDonald, Subway, Pizza Hut, Pizzou, Biyo, KLM, Hotel, Starbucks, Holy Cookie, Van Stapele, etc.)
  - Items consumidos ≥2 veces ahora aparecen aunque sean <30g/sem (ricotta, cottage, huevos)
  - **Tienda principal configurable**: default `Franprix`, cambiable desde la card. Items de Carrefour/Monoprix/Picard/Lidl/etc. se reagrupan bajo tu tienda principal. Homemade aparte
- **Coach Q&A**: además del verdict, ahora muestra **3 opciones de porción** (Mínima / Solicitada / Máx. segura) con macros y verdict ✓ cabe / ✗ excede para cada una

## [Fase H · Coach refinement + Q&A + Lista compras + Nav fix] - 02 mayo 2026
### Arreglado
- **PIN gate**: texto roto `${[0,1,2,3].map(...)}` se mostraba como literal. Eliminado, simplificado a "Elige usuario y PIN" con sub-texto explicativo
- **Nav overflow**: 10 tabs desbordaban en compu y mobile. Fix:
  - Scroll horizontal con masking gradient a la derecha (indica más contenido)
  - Padding reducido (12px → 8px en mobile)
  - Font-size escalado por viewport (0.78rem → 0.7rem en 420px)
  - Auto-scroll del tab activo al centro al cambiar (smooth, inline:center)

### Agregado — Coach refinement (Opción H parte 1)
- **Filtro de ingredientes inappropriados** en sugerencias: maizena, harina, aceite, mantequilla, sal, especias, levadura, vinagre, ajo/cebolla solos, agua, azucar, sirope, polvos, salsas, gelatina, items con `*-base` o `base-*`, items con fat > 60g/100g (aceites puros)
- **Boost por uso reciente**: items consumidos en los últimos 60 días tienen ranking más alto (sugiere lo que ya comes habitualmente)
- **Carbs filter mejorado**: requiere prot ≥ 2g O fiber ≥ 1g (excluye almidones puros)
- **Balanced más estricto**: prot ≥ 10 + kcal 80-250 + carbs < 50 (excluye pastas/cereales como "balanceado")
- **🤔 ¿Puedo comer X?** Q&A: input al tope del Coach que evalúa cualquier alimento contra macros pendientes
  - Parsea: "pizza", "200g pollo", "1 galleta", "1 cookie", "carne"
  - Calcula porción: explícita → unitWeight × count → default por densidad calórica
  - Verdict semáforo: ❌ Excede / ⚠️ Ajustado / ✓ Sí cabe / ✓ Buena elección (alta prot)
  - Muestra macros con % del gap pendiente
  - Sugerencia de porción alternativa si excede
  - Lista otras coincidencias en DB

### Agregado — Lista compras predictiva (Opción H parte 2)
- **🛒 Lista compras estimada** en Hogar tab:
  - Predicción basada en consumo de últimas 4 semanas + buffer 10%
  - Agrupada por tienda (Carrefour, Monoprix, Homemade, etc.)
  - Por item: cantidad proyectada (con conversión a unidades), gramos/sem promedio, ocurrencias, costo estimado
  - Indicador 👫 cuando ambos usuarios consumen el item (compras compartidas)
  - Total estimado del periodo
  - Click en item → marca como comprado (persistente en localStorage `nutria_shopping_checked`)
  - Botones "Copiar lista" y "Reset"

## [Fase D + E avanzadas] - 02 mayo 2026
### Agregado — Fase D · UX innovación
- **📖 Body composition storyteller** (4.5.3) en Salud: narrativa visual generada sobre WEIGHT_LOG
  - "En X días bajaste Y kg de los cuales Z fueron grasa (W%)"
  - Detección de patrones: ratio fat-loss vs lean-loss, recomposición vs catabolismo
  - Cards comparativas grasa kg / magra kg / peso total con delta colored
  - Estimación de deficit acumulado en kcal
- **🎤 Voice logging** en Quick add (Web Speech API es-ES): botón micro junto al input, normaliza "doscientos gramos pollo" → "200g pollo". Status visual durante grabación

### Agregado — Fase E · Multi-user mejoras
- **Auto-lock por inactividad**: configurable 5-240 min (default 30), basado en eventos click/keydown/mousemove/touch. Bumpea timer en cada actividad
- **Export/Import de datos por usuario**: backup JSON con meta, targets, budget, notas y pending foods. No incluye comidas (esas están en GitHub local-meals.json). Para sincronizar dispositivos o backup pre-cambio
- **Idle lock min configurable** desde Tools → Seguridad

## [Fase E + D + E + G] - 02 mayo 2026
### Agregado — Fase E · Multi-user lite (PIN gate)
- **PIN gate de 4 dígitos**: opt-in (no bloquea hasta activar). SHA-256 hash via SubtleCrypto en localStorage. Sesión 24h. Pantalla de login con gradient teal→purple
- **Profile manager** en Tools → Seguridad: activar/desactivar lock, configurar PIN per usuario, "lock now" button, reset
- Ergonomía: enter para submeter, focus auto, mensaje de error inline. La data sigue pública en GH Pages (UX-level, no security-level — true multi-tenant en backlog E2/E3 con Supabase)

### Agregado — Opción D · Loops + fricción
- **⚡ Quick add bar** (FAB flotante + tecla `q`): input "200g pollo" → autocompleta FOOD_DATABASE → click meal type → loggeado en 3 segundos. Soporta unidades (1 huevo) usando `unitWeight` del DB. Append a meal existente del día o crea nuevo
- **📝 Loggear sugerencia del Coach**: cada card del Coach tiene selector de meal + botón "Loggear" → addLocalMeal → push a GitHub. Cierra el loop coach que estaba abierto
- **📌 Notas por día**: input al inicio del día con debounce 400ms, persiste en `nutria_note_<user>_<date>`. Para tagear "post-gym", "fuera con Adri", etc.

### Agregado — Opción E · Visualización
- **📅 Heatmap calendario 365 días** (estilo GitHub contributions) en Salud: color por adherencia kcal del día, ejes con labels meses + días, leyenda de 6 niveles, contador "X días con datos · Y en target (Z%)"

### Agregado — Opción G · Análisis micros (parcial)
- **Sub-tab Micros** en Nutricion con bars de adequacy:
  - Fibra: meta mínima 30g/día (WHO)
  - Sodio: max 2300mg/día
  - Azúcar añadido: max 50g/día
  - Grasa saturada: max 22g/día
- Status semáforo (✓ Bajo / ✓ OK / ⚠️ Cerca / ❌ Excede o Déficit)
- Comparativa semana vs mes con delta colored
- Schema extendido placeholder para hierro/calcio/B12/D/potasio/magnesio (auto-fill batch pendiente)

## [Fase B · Inteligencia] - 02 mayo 2026
### Agregado
- **🤖 Coach tab nuevo**: Meal Coach rule-based con sugerencias personalizadas
  - Pendientes hoy: kcal/prot/carbs/grasa restantes con visualización
  - Próxima comida sugerida según hora (desayuno/almuerzo/snack/cena)
  - Patrón histórico del día de la semana actual (alerta si tienes tendencia a excederte)
  - 3 sugerencias generadas: 💪 Alta proteína magra · ⚖️ Balanceado · 🪙 Económico (mejor €/g prot)
  - Cada sugerencia con items + gramos + macros + costo total
  - Filtro: excluye recetario completo + items ya consumidos hoy
  - "Abrir Claude con mis macros pendientes" → bridge a claude.ai con prompt pre-cargado
- **🎯 Forecast peso → ETA goal** (Salud): regresión lineal sobre 7d MA de peso
  - Ritmo (kg/sem) basado en últimos 14 días
  - ETA al goal (75kg para Ernesto) con fecha objetivo
  - Intervalo de confianza 80% via Monte Carlo 500 sims
  - Status semáforo: verde (saludable) · amarillo (lento) · rojo (subiendo)
- **🧠 Patrones detectados** (Informes): análisis automático sobre últimos 30 días
  - Por día de semana: detecta "los Sab excedes calorías 18%" / grasa 68%
  - Gym vs descanso: "días con gym +17g prot (bien)" o alertas si menos
  - Findes vs días de semana: diferencial kcal
  - Streak detection: días consecutivos en target 85-115%
  - Severidad: warn (ámbar) / info (teal) / good (verde)

### CI
- Smoke test ampliado a 10 tabs (incluye coach)

## [Quick wins · A] - 02 mayo 2026
### Agregado
- **Budget mensual configurable**: click en "Budget mensual: €600 ✏️" abre prompt para editar (50-5000), persiste en localStorage por usuario (`nutria_budget_<user>`)
- **Búsqueda fulltext en Historial**: input de search con debounce 250ms, busca por tokens en `name + foodId` de items, agrupa resultados por fecha+meal con kcal y costo, header con total resultados/comidas/gramos/kcal. Restaura focus después del re-render
- **Mobile responsive Finanzas ledger**: clases `.fin-row`/`.fin-header` con media query <680px → grid 3 columnas (rank/nombre+meta+secondary/cost) en 2 filas. Header oculto en mobile

## [Top 3 — CI + Repetir + Apple Health] - 02 mayo 2026
### Agregado
- **Smoke test CI** (Playwright + GitHub Actions): 4 tests que validan boot sin errores, render de los 9 tabs, integridad del bridge `window.NutrIA`, navegación por teclado. Falla cualquier push que rompa la consola. ~7s de ejecución
- **Botón "↩ Repetir última"**: en cada comida vacía del día (vista list y kanban), copia los items del último registro previo del mismo tipo (cualquier fecha) como entry de hoy
- **Apple Health bidireccional** (data layer + setup guide):
  - `local-activity.json` nuevo archivo, app fetched en cada visita y merged en `getActivityForDate` con prioridad sobre ACTIVITY_LOG
  - Panel "🍎 Apple Health Sync" en Tools con status (verde <30h / amarillo <72h / rojo >72h) y enlaces a setup
  - `APPLE_HEALTH_SETUP.md` con instrucciones paso a paso del iOS Shortcut (token, automatización 23h, schema)

## [Hogar + Stories + Tools] - 02 mayo 2026
### Agregado
- **Tab Hogar** 🏠: vista combinada Ernesto + Adriana (período 7/14/30d) con gasto total, kcal/día hogar, items comunes, KPI cards por usuario (gasto, macros/día, adherencia kcal con barra), top alimentos del hogar con split E/A en barra dual, candidatos a compras a granel
- **Finanzas — Costo eficiente proteína**: top 5 alimentos con menor €/g proteína (filtro prot ≥ 5g)
- **Finanzas — Casa vs Fuera**: comparador €/1000kcal y €/g prot por origen (Homemade vs comercio), con factor multiplicador
- **Finanzas — Proyección mensual**: forecast €/mes basado en avg × días del mes, anual proyectado, barra de progreso vs budget €600 con alertas (verde <85% / amarillo 85-100% / rojo >100%)
- **NutrIA Stories** (Tools): card semanal exportable con gradiente teal→purple, KPIs (kcal/prot/gasto/días en target), highlights (top food, más caro, mejor día, gym, pasos, peso), botones Descargar PNG (html2canvas) y Copiar texto
- **Salud técnica** (Tools): captura runtime errors via window.onerror, muestra últimos 10 con stack abreviado, persistente en localStorage. Previene incidentes silenciosos como el de parseRenphoData
- **Renpho chart**: media móvil 7d (línea sólida teal-dark) sobre raw weight (línea punteada faded), label endpoint "X kg avg 7d"
- **Keyboard nav**: ← → para días anteriores/siguientes, H para volver a hoy

## [Finanzas v2] - 02 mayo 2026
### Arreglado
- **Gasto diario chart**: barras 30px (antes 16px) con gap 8px y altura 130px. Etiquetas €X dentro de barras altas (blanco) o encima (teal) según altura. Sin solapamientos €27/€29/€31

### Agregado
- **Detalle por alimento** (en Finanzas): tabla filtrable con
  - Filtros de período: 7d / 14d / 30d / 90d
  - Sorts: 💸 Caros / 🪙 Baratos / €/100g ↑↓ / 📦 Cantidad / 💪 Proteína / 🔤 A–Z
  - Resumen del período: total kg consumidos, proteína, carbs, grasas (acumulados)
  - Por fila: cantidad total (con conversión a unidades si aplica), €/100g, costo unitario (€/pot, €/cookie, etc), macros consumidos (P/C/F), costo total
  - Indicador de alimentos sin precio + número de ocurrencias en el período (ej. "35x")
  - Tienda/origen debajo del nombre (Décathlon, Carrefour, Homemade, etc.)

## [Hotfix] - 02 mayo 2026
### Arreglado
- **App no cargaba (regression Phase 2)**: el bridge `window.NutrIA` referenciaba `parseRenphoData`, función eliminada al modularizar health.js. ReferenceError mataba el IIFE antes de `render()`, dejando todo en blanco (Meals vacío, Informes sin click, Finanzas en "Cargando precios", historial sin datos)
- **Fix**: `parseRenphoData` reubicado en `modules/health.js` (única función que lo usa); referencia rota eliminada del bridge
- Verificado en local server con error handler: Meals/Informes/Finanzas/Salud renderizan correctamente

### Agregado
- 3 alimentos: jamón ibérico de bellota, feta brebis Islos AOP, té rooibos sin azúcar
- Meals 2026-05-02 Ernesto: desayuno (claras+huevo+jamón ibérico+cottage+feta+cracker+cherry, 360 kcal) + almuerzo (froyo Llao Llao 90g+fresas+frambuesas+rooibos, 97 kcal)

## [1.7.0] - 08 abril 2026
### Cambiado
- **Vista de comidas**: eliminado modo Kanban, solo vista Lista
- **Registrar comida**: formulario oculto de la UI (codigo preservado). Registro via /log-food
- **Meta**: boton movido del header a la seccion Tools
- **Token GitHub**: icono cambiado a 🪙, movido del header a Tools (junto a Meta)
- **OCR Screenshot**: seccion oculta temporalmente de Tools
- **Registro de Peso (Renpho)**: seccion oculta temporalmente de Tools

### Agregado
- 6 alimentos nuevos: queso curado Hacendado, rumsteck boeuf, brocoli, Siggi's raspberry, Gerble cookie cacao pepites, kefir nature

## [1.6.0] - 06 abril 2026
### Agregado
- **Subir plato**: nuevo boton en Registrar comida (junto a "Copiar pendientes para Claude") para subir platos con nombre, porcion en gramos, calorias y macros manuales
- **Campo autor**: cada plato subido registra quien lo subio (Ernesto/Adriana). Se muestra como badge amarillo con el nombre del autor en la base de datos
- **Source "manual"**: nuevo tipo de fuente para platos subidos manualmente (distinto de recetario, web, user)
- **Conversion automatica**: el usuario ingresa macros por porcion y el sistema calcula per100g internamente
- **Server.py actualizado**: soporta campos author, source y brand dinamicos en `/api/add-food`

## [1.5.0] - 02 abril 2026
### Agregado
- **Boton Guardar (FAB)** flotante abajo a la derecha. Guarda todas las comidas a disco via servidor
- **Backup diario** automatico a las 23:27 (cron). Endpoints `/api/save-all` y `/api/backup` en servidor
- **Subtotales de macros por comida** en tags de colores: azul (proteina), verde (carbs), amarillo (grasa)
- **Cache buster** en nutrition-data.js para evitar datos viejos en browser
- 3 alimentos nuevos: semillas de chia, miel de abeja, avellanas

### Corregido
- **Bug timezone**: `getTodayStr()` y `addDays()` usaban UTC en vez de hora local (mostraba dia incorrecto despues de medianoche)
- **Boton Meta** movido al header (junto a E/A) en vez de dentro del resumen del dia
- **Emoji nutria** restaurado en el logo

## [1.4.0] - 01 abril 2026
### Agregado
- **PWA manifest** con iconos para shortcut en telefono (iOS/Android)
- **Acceso WiFi** via http://ernesto-flowie.local:8090 + serve.sh
- **Badges de confianza** en la base de datos: recetario (teal), web (amarillo), verificado (verde)
- **Edicion inline** de alimentos web/verificados en la tabla de la DB
- Stats de verificacion al fondo de la tabla (sin verificar / verificados / otros)

## [1.3.0] - 01 abril 2026
### Agregado
- **Usuarios**: Ernesto (E) y Adriana (A) con selector en header
- **Targets por usuario**: Ernesto 1770/190/140/50, Adriana 1200/120/100/45
- **Boton Meta** para ajustar objetivos de dieta (modal, guarda en LocalStorage por usuario)
- **LocalStorage por usuario** (meals, pending, targets, overrides separados)
- **Edit/Delete** ahora funciona para entries del archivo (via overrides en LocalStorage)
- **"Muy bajo"** ahora es naranja (no rojo)
- Eliminado boton "Importar a Claude" (confuso). Solo queda "Copiar pendientes para Claude"

## [1.2.0] - 01 abril 2026
### Mejorado
- **Health status** rediseñado: Optimo (90-110%), En camino (75-90%), Atencion (50-75%), Muy bajo (<50%), Exceso (>120%)
- **Colores de rings** fijos por macro: calorias negro, proteina azul, carbs verde, grasas amarillo
- **Edit/Delete** en cada food card del kanban (hover para ver iconos)
- **Changelog** visible como seccion colapsable en el dashboard

## [1.1.0] - 01 abril 2026
### Agregado
- **Formulario de registro** directo en el dashboard (buscar alimento, poner gramos, elegir comida)
- **LocalStorage** para guardar entries sin necesitar Claude Code
- **Productos pendientes** para alimentos no encontrados en la base
- **Exportar pendientes** como comandos /log-food para pegar en Claude Code
- **Toast notifications** al agregar/editar/eliminar
- 5 productos comerciales: EAFit, Alpro Noisette, Wasa Leger, Danone Cottage, Pizza Hut Hawaienne

## [1.0.0] - 01 abril 2026
### Creado
- **Dashboard HTML** con vista diaria (rings de progreso, kanban de comidas, alertas)
- **Vista historica** con histograma de calorias/macros, filtrable por periodo (hoy/7d/mes/todo)
- **Base de datos de alimentos** pre-cargada con 4 recetas del Recetario
- **nutrition-data.js** como fuente central de datos
- **Skills** /log-food y /nutrition
- Alertas: deficit proteina, exceso calorias, exceso grasa, comidas faltantes, streak
- Design system: teal (#0D9488), Inter font, cards con sombras sutiles
