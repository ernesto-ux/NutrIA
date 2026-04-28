# NutrIA → Apple Health: Setup

## Crear el Shortcut (solo 1 vez)

1. Abre **Shortcuts** en Mac (o iPhone)
2. Crea un nuevo Shortcut llamado **"NutrIA Log"**
3. Agrega estas acciones EN ORDEN:

### Accion 1: Get File
- Action: **Get File**
- File Path: `/tmp/nutria-health-export.json`

### Accion 2: Get Dictionary from Input
- Action: **Get Dictionary from Input**
- Input: File (del paso anterior)

### Accion 3: Repeat with Each (item in Dictionary)
- Action: **Repeat with Each**

Dentro del Repeat, agrega 4x "Log Health Sample":

### Accion 4: Log Health Sample - Calories
- Type: **Dietary Energy**
- Value: Get Dictionary Value for key "calories" from Repeat Item
- Date: Get Dictionary Value for key "date" from Repeat Item

### Accion 5: Log Health Sample - Protein  
- Type: **Protein**
- Value: Get Dictionary Value for key "protein" from Repeat Item
- Date: Get Dictionary Value for key "date" from Repeat Item

### Accion 6: Log Health Sample - Carbohydrates
- Type: **Carbohydrates**
- Value: Get Dictionary Value for key "carbs" from Repeat Item
- Date: Get Dictionary Value for key "date" from Repeat Item

### Accion 7: Log Health Sample - Total Fat
- Type: **Total Fat**
- Value: Get Dictionary Value for key "fat" from Repeat Item
- Date: Get Dictionary Value for key "date" from Repeat Item

### Accion 8: End Repeat

### Accion 9: Show Notification
- "NutrIA: Logged X days to Apple Health"

4. Guarda el Shortcut

## Uso diario

Desde terminal (o Claude Code lo hace automaticamente):

```bash
# Exportar hoy
cd ~/Desktop/NutrIA && node export-to-health.js

# Exportar rango de fechas
cd ~/Desktop/NutrIA && node export-to-health.js 2026-04-14 2026-04-15 2026-04-16 2026-04-17 2026-04-18

# Enviar a Apple Health
shortcuts run "NutrIA Log"
```

## Automatizacion

Se puede agregar al cron de EOD para que despues de cada log-food,
automaticamente exporte y corra el shortcut.
