# Apple Shortcut: NutrIA Exercise Sync

## Setup (una sola vez)

### Paso 1: Crear carpeta en iCloud Drive
En tu iPhone: Archivos > iCloud Drive > crear carpeta `NutrIA`

### Paso 2: Crear el Atajo

Abre la app **Atajos** en tu iPhone y crea uno nuevo llamado **"NutrIA Exercise Sync"**.

Añade estas acciones en orden:

```
1. [Buscar en Salud]
   - Tipo: Ejercicios
   - Fecha de inicio: está en los últimos 7 días
   - Ordenar por: Fecha de inicio (más reciente primero)

2. [Repetir con cada elemento] de (resultado de Buscar en Salud)
   - [Texto]
     {"date":"[Fecha de inicio (formato: yyyy-MM-dd)]","type":"[Tipo de ejercicio]","duration_min":[Duración (en minutos)],"kcal":[Energía activa quemada],"source":"[Nombre de la fuente]"}
   - [Añadir a variable] → exercises

3. [Fin de Repetir]

4. [Texto]
   {"exported":"[Fecha actual (formato: yyyy-MM-dd'T'HH:mm:ss)]","workouts":[
   [Combinar exercises con separador: ,
   ]
   ]}

5. [Guardar archivo]
   - Contenido: (resultado del texto anterior)
   - Destino: iCloud Drive/NutrIA/exercise-data.json
   - Preguntar dónde guardar: NO
   - Sobrescribir si existe: SÍ
```

### Paso 3: Automatización (opcional pero recomendado)

En Atajos > Automatización > Nueva:
- **Cuándo:** Cada domingo a las 21:00
- **Hacer:** Ejecutar atajo "NutrIA Exercise Sync"
- **Preguntar antes de ejecutar:** NO

Esto exporta automáticamente cada domingo antes del análisis semanal.

### Paso 4: Verificar

Ejecuta el atajo manualmente. Ve a Archivos > iCloud Drive > NutrIA y verifica que `exercise-data.json` existe con tus workouts.

## Formato del archivo generado

```json
{
  "exported": "2026-04-03T21:00:00",
  "workouts": [
    {
      "date": "2026-04-01",
      "type": "Functional Strength Training",
      "duration_min": 62,
      "kcal": 1075,
      "source": "Mi Fit"
    },
    {
      "date": "2026-04-02",
      "type": "HIIT",
      "duration_min": 45,
      "kcal": 575,
      "source": "Everfit"
    }
  ]
}
```

## Uso con Claude Code

Una vez el archivo existe en iCloud Drive, `/body-comp` lo lee automáticamente.
No necesitas reportar ejercicio manualmente.

Si quieres forzar una sync: ejecuta el atajo "NutrIA Exercise Sync" desde tu iPhone.
