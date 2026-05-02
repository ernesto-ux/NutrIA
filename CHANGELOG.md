# Changelog - NutrIA

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
