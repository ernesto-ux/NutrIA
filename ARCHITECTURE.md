# NutrIA — Architecture

## Current State

Single monolithic `index.html` of ~5,250 lines containing HTML, CSS, and 61 JavaScript functions. All logic, UI rendering, and data access are co-located.

**Data files (GitHub repo, fetched at runtime):**
| File | Role |
|---|---|
| `nutrition-data.js` | FOOD_DATABASE + MEAL_LOG + ACTIVITY_LOG + WEIGHT_LOG (static fallback) |
| `local-meals.json` | Source of truth for meal entries (has `user` field) |
| `local-prices.json` | Price database — €/100g for each food item |
| `body-comp-history.json` | Renpho body composition entries |

---

## Target Architecture — 9 Modules

### 1. 🍽️ Meals & Logs
Registro diario de comidas, historial, overrides de MEAL_LOG.

**Functions:** `addLogEntry`, `deleteFoodItem`, `editFoodGrams`, `moveFoodItem`, `addAsPending`, `removePending`, `exportPending`, `navigateDay`, `toggleLogForm`, `selectLogMeal`, `toggleMealAccordion`, `setMealView`, `onLogSearch`, `onLogGrams`, `selectFood`, `clearSelectedFood`, `setFullPortion`, `confirmDeleteFood`, `saveAll`

**Data access:** `local-meals.json` (write), `MEAL_LOG` (read fallback), `FOOD_DATABASE` (lookup)

---

### 2. 📊 Stats & Analytics
Balance calórico, promedios, déficit, proyecciones. Vista "Informes".

**Functions:** `setInformeRange`, `setInformeCustomDates`, `toggleInformeChartMode`, `toggleInformeCombined`, `toggleInformeDetailed`, `toggleAlerts`, `setPeriod`, `setNutriTab`, `setNutriMealFilter`, `setNutriSort`, `setMetric`

**Data access:** derivado de Meals & Logs + Activity + Weight

---

### 3. 🥦 Alimentos (Food Database)
FOOD_DATABASE — búsqueda, creación, edición de alimentos. Incluye datos nutricionales por ítem.

**Functions:** `toggleDB`, `editFoodDB`, `saveFoodDB`, `deleteFoodDB`, `confirmCreateRecipe`, `closeRecipeModal`, `openPricesDoc`

**Data access:** `nutrition-data.js` (FOOD_DATABASE), `local-prices.json` (read)

---

### 4. 💶 Financials
Gasto alimentario diario y por período. Price database management.

**Functions:** `openPricesDoc` *(shared con Alimentos)*

**Data access:** `local-prices.json` (write), `local-meals.json` (read)

**Key computed values:** `getDayCost(date)`, `PRICE_DB`

---

### 5. 🏋️ Actividad Física
Pasos, sesiones de gym, TDEE, quema calórica por actividad.

**Functions:** *(actualmente inline en renderizado — pendiente extraer)*

**Data access:** `ACTIVITY_LOG` en `nutrition-data.js`, Apple Health export

**Pendiente separar:** pasos (`steps`, `stepsKcal`) de sesiones gym (`gymKcal`, `gymMinutes`)

---

### 6. 🏥 Salud
Peso corporal, composición corporal Renpho, métricas de salud.

**Functions:** `saveManualWeight`, `saveRenphoEntry`, `processRenphoOCR`, `calcMetabolism`, `applyOCRData`, `closeUploadDish`, `openUploadDish`, `saveUploadDish`

**Data access:** `WEIGHT_LOG` en `nutrition-data.js`, `body-comp-history.json`

---

### 7. 🎯 Metas / Goals
Definición y seguimiento de objetivos: peso meta, fecha objetivo, targets de macros.

**Functions:** `openTargetsModal`, `closeTargetsModal`, `saveTargets`, `applyMetaTargets`

**Data access:** `localStorage` (`nutrIA_targets`), derivado de Weight para proyecciones

**Pendiente:** dashboard de progreso visual hacia meta, fecha estimada de llegada

---

### 8. 📤 Exportación / Reports
Generación de informes HTML descargables, CSV, copia para apps externas.

**Functions:** `exportInformeHTML`, `exportInformeCSV`, `exportAllLocal`, `copyForHealth`, `copyForMFP`

**Data access:** consume salida de Stats & Analytics

---

### 9. 👤 Login / Users
Autenticación, perfiles de usuario, separación de datos por usuario.

**Functions:** `switchUser`, `setupGHToken`

**Data access:** `localStorage` (token, usuario activo)

**Estado actual:** campo `user` en `local-meals.json`; MEAL_LOG sin campo user (April 6–7 mezclados Ernesto/Adriana)

**Pendiente:** autenticación real, filtrado robusto por usuario en todas las vistas, separación de WEIGHT_LOG y ACTIVITY_LOG por usuario

---

## Function → Module Map

| Function | Module |
|---|---|
| `addLogEntry`, `deleteFoodItem`, `editFoodGrams`, `moveFoodItem` | Meals & Logs |
| `addAsPending`, `removePending`, `exportPending` | Meals & Logs |
| `navigateDay`, `toggleLogForm`, `selectLogMeal`, `toggleMealAccordion` | Meals & Logs |
| `setMealView`, `onLogSearch`, `onLogGrams`, `selectFood`, `clearSelectedFood` | Meals & Logs |
| `setFullPortion`, `confirmDeleteFood`, `saveAll` | Meals & Logs |
| `setInformeRange`, `setInformeCustomDates`, `toggleInformeChartMode` | Stats & Analytics |
| `toggleInformeCombined`, `toggleInformeDetailed`, `toggleAlerts` | Stats & Analytics |
| `setPeriod`, `setNutriTab`, `setNutriMealFilter`, `setNutriSort`, `setMetric` | Stats & Analytics |
| `toggleDB`, `editFoodDB`, `saveFoodDB`, `deleteFoodDB` | Alimentos |
| `confirmCreateRecipe`, `closeRecipeModal`, `openPricesDoc` | Alimentos |
| `saveManualWeight`, `saveRenphoEntry`, `processRenphoOCR` | Salud |
| `calcMetabolism`, `applyOCRData`, `closeUploadDish`, `openUploadDish`, `saveUploadDish` | Salud |
| `openTargetsModal`, `closeTargetsModal`, `saveTargets`, `applyMetaTargets` | Metas / Goals |
| `exportInformeHTML`, `exportInformeCSV`, `exportAllLocal` | Exportación |
| `copyForHealth`, `copyForMFP` | Exportación |
| `switchUser`, `setupGHToken` | Login / Users |

---

## Migration Strategy

The monolithic `index.html` stays as the shell. Modules are extracted progressively — no big-bang rewrite.

**Phase 1 — Low risk, high independence:**
- Extract `modules/financials.js` (getDayCost, openPricesDoc, PRICE_DB logic)
- Extract `modules/export.js` (exportInformeHTML, exportInformeCSV, copyForHealth, copyForMFP)

**Phase 2 — State-bearing but self-contained:**
- Extract `modules/goals.js` (targets modal, projections)
- Extract `modules/health.js` (weight, Renpho, OCR)

**Phase 3 — Core, requires careful dependency tracing:**
- Extract `modules/food-db.js` (FOOD_DATABASE operations)
- Extract `modules/activity.js` (steps + gym separation)
- Extract `modules/stats.js` (all informe rendering)

**Phase 4 — Breaking change:**
- Extract `modules/meals.js` (log CRUD — touches most of the app)
- Implement `modules/auth.js` (Login / Users — requires data migration)

**Rule:** Each module exposes a single `window.ModuleName = {}` object. `index.html` calls module methods; modules do not call each other directly — they go through shared state (`MEAL_LOG`, `FOOD_DATABASE`, `PRICE_DB`) or events.

---

## Open Questions

1. **Auth:** GitHub token as identity (current) vs. simple PIN per profile vs. proper auth?
2. **Storage:** Stay on GitHub API for persistence, or add a lightweight backend for Phase 4?
3. **Hidratación:** Add water tracking module (currently missing from all logs)?
4. **MEAL_LOG mixed entries (Apr 6–7):** Resolve via overrides system before Login module, or clean up data file directly?
