# NutrIA - Nutrition Tracker

Daily nutrition tracker with macro/calorie counting, meal logging via Claude Code, and visual dashboard.

## Architecture

```
~/Desktop/NutrIA/
  index.html          # Dashboard (read-only visualization)
  nutrition-data.js   # Central data: config + food DB + meal log
  CHANGELOG.md
  README.md
  backups/            # Date-stamped backups
  docs/               # Documentation
```

## Data Flow

```
User says: "log food 80gr frittata light (desayuno)"
  |
  v
Claude Code (/log-food skill)
  |-- 1. Parse: meal=desayuno, item=frittata light, grams=80
  |-- 2. Lookup: search FOOD_DATABASE -> found (recetario source)
  |-- 3. Calculate: 80g * per100g values
  |-- 4. Write: append to MEAL_LOG in nutrition-data.js
  |
  v
Dashboard (index.html)
  |-- Loads nutrition-data.js
  |-- Renders: progress rings, kanban, alerts, history chart
```

## Usage

### Log a meal
```
/log-food 40gr proteina EAFit vainilla + 80ml leche alpro noisette (desayuno)
```

### View summary
```
/nutrition          # Today's summary in terminal
/nutrition week     # Last 7 days
/nutrition open     # Open dashboard in browser
```

### Open dashboard directly
```
open ~/Desktop/NutrIA/index.html
```

## Targets
- Calories: 1770 kcal/day
- Protein: 190g/day
- Carbs: 140g/day
- Fat: 50g/day

## Health Indicators
- Green: 90-110% of target
- Yellow: 75-125% of target
- Red: outside 75-125%

## Food Sources (priority order)
1. Local FOOD_DATABASE (instant)
2. Recetario recipes (~/Desktop/Recetario/)
3. Web search (commercial products)
4. User-provided (link or image)
