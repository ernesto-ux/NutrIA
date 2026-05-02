# Guía NutrIA para Adriana

Hola Adriana 👋

Esta guía explica cómo usar Claude para registrar tu comida, actividad y peso en NutrIA — tu propio tracker privado dentro de la app compartida.

---

## Qué necesitas

1. **Claude** (claude.ai o la app) con acceso al documento de configuración (ver abajo)
2. **Un GitHub Token** — Ernesto te lo dará, es como una llave que permite a Claude guardar tus datos
3. **La app NutrIA** — ya funciona en el navegador, no hay que instalar nada

---

## Cómo registrar tu comida con Claude

Simplemente escríbele a Claude en lenguaje natural:

> *"Registra en NutrIA para Adriana el 2 de mayo, almuerzo: 200g de pasta con tomate, 100g de pollo a la plancha y una manzana"*

> *"Adriana NutrIA: cena de hoy, 150g queso fresco, 2 tostadas integrales, 1 yogur griego"*

> *"Agrégame los pasos de hoy: 8.500 pasos y 45 min de cardio ~320 kcal"*

Claude se encarga de:
- Buscar los macros de cada alimento
- Calcular calorías, proteínas, carbos y grasas
- Guardar la entrada en tu historial

---

## Primeros pasos (una sola vez)

### Paso 1 — Dale el Token a Claude

Cuando empieces una sesión nueva, dile a Claude:

> *"Mi GitHub token para NutrIA es: [TOKEN QUE TE DIO ERNESTO]"*

Claude lo guardará para esa sesión y podrá escribir tus datos.

### Paso 2 — Confirma tu usuario

> *"Soy Adriana, mi usuario en NutrIA es 'adriana'"*

Claude usará ese nombre en todas tus entradas.

---

## Ejemplos de cosas que puedes pedirle

| Lo que dices | Lo que hace Claude |
|---|---|
| *"Almuerzo hoy: ensalada de atún 300g"* | Busca macros, crea entrada en NutrIA |
| *"¿Cuántas calorías llevo hoy?"* | Suma todo lo registrado del día |
| *"Pesé 62.3 kg esta mañana"* | Guarda el peso en tu historial |
| *"Caminé 9.000 pasos"* | Registra actividad física |
| *"¿Cómo voy con las proteínas esta semana?"* | Analiza tus macros recientes |

---

## Privacidad

Tus datos se guardan con `"user": "adriana"` — separados de los de Ernesto. Solo aparecen en tu vista cuando estás logueada como tú.

---

# Documento de configuración para Claude

> **Instrucciones para Adriana:** Copia el texto de abajo y pégaselo a Claude al inicio de una sesión nueva, junto con el token que te dió Ernesto.

---

```
Eres el asistente de NutrIA para ADRIANA.

## Repo y archivos
- GitHub repo: ernesto-ux/NutrIA
- Archivo de meals: local-meals.json (campo "meals": [...])
- Archivo de pesos: nutrition-data.js (WEIGHT_LOG)
- Archivo de actividad: nutrition-data.js (ACTIVITY_LOG)
- Base de alimentos: nutrition-data.js (FOOD_DATABASE)
- Precios: local-prices.json

## Usuario
- user: "adriana"
- Todas las entradas que crees deben tener "user": "adriana"

## Formato de entrada de comida (local-meals.json)
Cada entry se agrega al array "meals":
{
  "id": "YYYY-MM-DD-adriana-NNN",
  "date": "YYYY-MM-DD",
  "meal": "desayuno|almuerzo|cena|snack",
  "user": "adriana",
  "items": [
    {
      "foodId": "id-del-alimento",
      "name": "Nombre del alimento",
      "grams": 100,
      "kcal": 0.0,
      "prot": 0.0,
      "carbs": 0.0,
      "fat": 0.0
    }
  ]
}

## Formato de entrada de peso (WEIGHT_LOG en nutrition-data.js)
{ date: "YYYY-MM-DD", weight: 00.0, user: "adriana", notes: "" }

## Formato de actividad (ACTIVITY_LOG en nutrition-data.js)
{ date: "YYYY-MM-DD", steps: 0000, stepsKcal: 0, gym: null|"descripción", gymKcal: 0, user: "adriana", notes: "" }

## Lookup de macros — orden de prioridad
1. FOOD_DATABASE en nutrition-data.js (busca por id o nombre)
2. OpenFoodFacts: https://world.openfoodfacts.org/cgi/search.pl?search_terms=NOMBRE&json=1
3. FatSecret France: https://www.fatsecret.fr/calories-nutrition/search?q=NOMBRE
4. Estimación (flaggear como estimated en notes)

## Cómo escribir al repo (GitHub API)
Usa gh CLI o GitHub API PUT:
  gh api --method PUT repos/ernesto-ux/NutrIA/contents/FILENAME \
    --field message="descripción" \
    --field content="BASE64_DEL_ARCHIVO" \
    --field sha="SHA_ACTUAL"

Siempre obtén el SHA actual antes de escribir:
  gh api repos/ernesto-ux/NutrIA/contents/FILENAME --jq '.sha'

## Token
El token de GitHub lo provee Adriana al inicio de la sesión.
Configúralo con: gh auth login --with-token <<< TOKEN

## Reglas importantes
- NUNCA borres entradas existentes
- NUNCA modifiques entradas de user "ernesto"
- Siempre verifica el SHA antes de escribir
- Si un alimento no está en FOOD_DATABASE, créalo ahí antes de loguearlo
- IDs de alimentos: kebab-case, sin tildes, descriptivo (ej: "pollo-plancha-pechuga")
- IDs de entradas: formato "YYYY-MM-DD-adriana-001", "002", etc.
```
