# Changelog - NutrIA

## [1.2.0] - 01 abril 2026
### Mejorado
- **Health status** rediseñado: Optimo (90-110%), En camino (75-90%), Atencion (50-75%), Muy bajo (<50%), Exceso (>120%)
- **Colores de rings** fijos por macro: calorias negro, proteina azul, carbs verde, grasas amarillo
- **Edit/Delete** en cada food card del kanban (hover para ver iconos)
- Boton "Importar a Claude" (antes "Exportar todo local") con tooltips descriptivos

## [1.1.0] - 01 abril 2026
### Agregado
- **Formulario de registro** directo en el dashboard (buscar alimento, poner gramos, elegir comida)
- **LocalStorage** para guardar entries sin necesitar Claude Code
- **Productos pendientes** para alimentos no encontrados en la base
- **Exportar pendientes** como comandos /log-food para pegar en Claude Code
- **Importar a Claude** para persistir entries locales en nutrition-data.js
- **Toast notifications** al agregar/editar/eliminar
- 4 productos comerciales en la base: EAFit Pure Isolate, Alpro Noisette, Wasa Leger, Danone Cottage
- Pizza Hut Hawaienne agregada a la base

## [1.0.0] - 01 abril 2026
### Creado
- **Dashboard HTML** con vista diaria (rings de progreso, kanban de comidas, alertas)
- **Vista historica** con histograma de calorias/macros, filtrable por periodo (hoy/7d/mes/todo)
- **Base de datos de alimentos** pre-cargada con 4 recetas del Recetario
- **nutrition-data.js** como fuente central de datos (config, food DB, meal log)
- **Skill /log-food** para registrar comidas via Claude Code (busqueda web + recetario + DB local)
- **Skill /nutrition** para ver resumen rapido y abrir dashboard
- Objetivos: 1770 kcal, 190g prot, 140g carbs, 50g fat
- Alertas: deficit proteina, exceso calorias, exceso grasa, comidas faltantes, streak
- Design system: teal (#0D9488), Inter font, cards con sombras sutiles
