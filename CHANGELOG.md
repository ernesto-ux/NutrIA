# Changelog - NutrIA

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
