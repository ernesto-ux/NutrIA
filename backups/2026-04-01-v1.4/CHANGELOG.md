# Changelog - NutrIA

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
