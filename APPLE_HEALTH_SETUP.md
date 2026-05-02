# Apple Health → NutrIA (sync bidireccional)

NutrIA puede recibir pasos, kcal activas, minutos de ejercicio y HR directamente desde Apple Health vía iOS Shortcut. Setup ~10 min.

## Cómo funciona

```
Apple Health (iPhone)
   |
   v
iOS Shortcut diario 23h00
   |-- 1. Lee pasos, kcal activas, minutos ejercicio, HR avg/max de hoy
   |-- 2. Construye JSON entry
   |-- 3. PATCH local-activity.json en GitHub vía API
   v
GitHub repo (ernesto-ux/NutrIA)
   |
   v
NutrIA dashboard (lee local-activity.json en cada visita)
```

`local-activity.json` toma prioridad sobre `ACTIVITY_LOG` cuando hay misma fecha.

## Setup

### 1. Generar GitHub Personal Access Token

1. https://github.com/settings/tokens → **Generate new token (classic)**
2. **Note**: `nutria-apple-health`
3. **Expiration**: 90 days
4. **Scopes**: solo `repo` (acceso a tu repo)
5. Copia el token (`ghp_...`) — solo lo verás una vez

### 2. Crear el Shortcut en iPhone

App **Atajos** → **+** → nuevo Atajo. Pega los pasos:

```
1. Texto:        ghp_TU_TOKEN_AQUI                                  → variable: TOKEN
2. Texto:        ernesto-ux/NutrIA                                   → variable: REPO
3. Salud:        Recibir pasos · Hoy · Suma                          → variable: STEPS
4. Salud:        Recibir energía activa · Hoy · Suma · kcal          → variable: ACTIVE_KCAL
5. Salud:        Recibir minutos de ejercicio · Hoy · Suma           → variable: EXERCISE_MIN
6. Salud:        Recibir frecuencia cardíaca · Hoy · Promedio        → variable: HR_AVG
7. Salud:        Recibir frecuencia cardíaca · Hoy · Máximo          → variable: HR_MAX
8. Fecha:        Hoy → Formatear ISO sin hora (yyyy-MM-dd)           → variable: TODAY
9. Texto:        {"date":"[TODAY]","steps":[STEPS],"activeKcal":[ACTIVE_KCAL],"exerciseMin":[EXERCISE_MIN],"hrAvg":[HR_AVG],"hrMax":[HR_MAX],"source":"apple-health"}
                                                                     → variable: ENTRY_JSON

10. URL:         https://api.github.com/repos/[REPO]/contents/local-activity.json
11. Obtener contenidos de URL:
    - Método: GET
    - Cabeceras: { "Authorization": "token [TOKEN]", "Accept": "application/vnd.github+json" }
                                                                     → variable: CURRENT_FILE

12. Obtener valor del diccionario "content" → DECODE BASE64 → variable: CURRENT_JSON
13. Obtener valor del diccionario "sha" → variable: SHA

14. Ejecutar JavaScript en página web (o usar paso "Texto") con:
    const j = JSON.parse(`[CURRENT_JSON]`);
    const entry = JSON.parse(`[ENTRY_JSON]`);
    j.entries = (j.entries || []).filter(e => e.date !== entry.date);
    j.entries.push(entry);
    j.entries.sort((a,b) => a.date.localeCompare(b.date));
    j.lastSync = new Date().toISOString();
    return JSON.stringify(j, null, 2);
                                                                     → variable: NEW_JSON

15. ENCODE BASE64 NEW_JSON                                           → variable: NEW_B64

16. URL:         https://api.github.com/repos/[REPO]/contents/local-activity.json
17. Obtener contenidos de URL:
    - Método: PUT
    - Cabeceras: { "Authorization": "token [TOKEN]", "Accept": "application/vnd.github+json", "Content-Type": "application/json" }
    - Cuerpo (JSON):
      {
        "message": "apple-health: sync [TODAY]",
        "content": "[NEW_B64]",
        "sha": "[SHA]"
      }
```

### 3. Programar la ejecución diaria

App **Atajos** → pestaña **Automatización** → **+** → **Hora del día** → 23:00, todos los días → ejecutar tu shortcut → desactivar "Preguntar antes de ejecutar".

### 4. Verificar

1. Abre NutrIA → tab **Tools**
2. Sección "🍎 Apple Health Sync" debe mostrar 🟢 con timestamp reciente
3. Tab **Actividad** mostrará las entries sincronizadas (toman priority sobre ACTIVITY_LOG en `nutrition-data.js`)

## Schema completo

`local-activity.json`:
```json
{
  "lastSync": "2026-05-02T23:00:00.000Z",
  "entries": [
    {
      "date": "2026-05-02",
      "steps": 8421,
      "activeKcal": 380,
      "exerciseMin": 42,
      "hrAvg": 72,
      "hrMax": 145,
      "source": "apple-health"
    }
  ]
}
```

Campos opcionales que NutrIA reconoce: `gymKcal`, `gym` (texto del workout), `notes`, `restingHR`, `vo2max`, `recoveryHr`.

## Próximos pasos

Una vez funcionando el sync de actividad, el plan es:
- **Dynamic TDEE**: usar `activeKcal` real en lugar del 2145 hardcoded para calcular balance
- **Sleep correlation**: agregar `sleepHrs` al schema y correlacionar con macros del día siguiente
- **Workout type detection**: parsear el campo `gym` → tipo (push/pull/legs/cardio)

## Troubleshooting

- **Status 404**: el path en la API URL está mal. Debe ser `repos/USER/REPO/contents/local-activity.json` exacto
- **Status 422**: el SHA está desactualizado (alguien modificó el archivo). Reejecuta el shortcut para refrescar
- **Status 401**: token expirado o sin scope `repo`
- **Sync nunca aparece en NutrIA**: verifica que GH Pages se redesplegó (1-2 min) y haz hard refresh (⌘+Shift+R)
- **JSON malformado**: el paso 9 puede romperse si HR_AVG es vacío. Encierra cada variable con `default:0` en el shortcut
