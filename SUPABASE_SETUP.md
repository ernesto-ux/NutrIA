# Supabase backend setup (Fase E2/E3)

NutrIA puede usar Supabase como backend real para multi-usuario auténtico (en vez del PIN gate lite). Setup ~30 min.

## Por qué Supabase

- **Free tier generoso**: 500MB Postgres, 2GB bandwidth/mes, auth incluido, 50k MAU
- **RLS (Row Level Security)** integrado: cada usuario solo ve sus propios datos por default
- **Auth out-of-the-box**: email/password, magic link, OAuth (Google, GitHub)
- **JS SDK** maduro
- **Local-first compatible**: el cliente puede sync incrementalmente

## Setup paso a paso

### 1. Crear proyecto Supabase

1. https://supabase.com/dashboard → New project
2. Nombre: `nutria`
3. Region: Europe West (Frankfurt) — más cerca de París
4. Password de DB: guardar en password manager
5. Plan: Free
6. Wait ~2 min para que se cree

### 2. Ejecutar el schema SQL

1. SQL Editor → New query
2. Copiar contenido de `db-schema.sql`
3. Run
4. Verifica que las tablas se crearon en Table Editor: `profiles`, `meals`, `activity_entries`, `weight_entries`, `households`, `household_members`

### 3. Obtener credenciales

1. Project Settings → API
2. Copiar:
   - **Project URL** (ej. `https://xyzabc.supabase.co`)
   - **anon public key** (empieza con `eyJ...`)
3. **NO copies la `service_role` key** — esa nunca va al frontend

### 4. Configurar NutrIA

En el browser (NutrIA abierto):

```js
window.NutrIASupabase.setupConnection(
  'https://xyzabc.supabase.co',
  'eyJ...'
);
```

O usa el formulario en Tools → Supabase Backend (cuando esté UI lista, ver TODO abajo).

### 5. Crear cuenta inicial

```js
await window.NutrIASupabase.signUp('ernesto@flowie.fr', 'password-fuerte-aqui');
```

Verificá email (Supabase free tier requiere verificación).

### 6. Migrar datos existentes

```js
// Cargar local-meals.json y migrar a Supabase
const r = await fetch('local-meals.json');
const data = await r.json();
await window.NutrIASupabase.migrateFromLocalMeals(data.meals);
```

Verifica en Supabase → Table Editor → meals que aparezcan tus 80+ comidas.

### 7. Compartir con Adriana (Fase E3)

1. Adriana se registra: `signUp('adriana@email.com', 'su-password')`
2. Crear household:
   ```js
   const c = window.NutrIASupabase.getClient();
   const { data: hh } = await c.from('households').insert({ name: 'Otero', created_by: (await c.auth.getUser()).data.user.id }).select().single();
   await c.from('household_members').insert([
     { household_id: hh.id, user_id: <ernesto-uuid>, role: 'owner' },
     { household_id: hh.id, user_id: <adriana-uuid>, role: 'member' }
   ]);
   ```
3. Ahora ambos ven las comidas del otro vía RLS policy "household members".

## TODO en NutrIA (UI hooks pendientes)

Lo que ya está scaffolded en `modules/db-supabase.js`:
- ✅ Auth: signUp, signIn, signOut, currentUser
- ✅ Meals CRUD: fetchMeals, upsertMeal, deleteMeal
- ✅ Migration: migrateFromLocalMeals
- ✅ Setup helpers: setupConnection, disableConnection

Lo que falta para activarlo en UI:
- [ ] Form en Tools → Supabase Backend para meter URL + anonKey
- [ ] Login screen alterno (cuando Supabase está enabled, en vez del PIN gate)
- [ ] Auto-sync: en vez de leer/escribir local-meals.json, usar Supabase
- [ ] Migración guiada con progress bar
- [ ] Conflict resolution (si hay cambios offline)

## Costos esperados

- **Free tier suficiente para uso personal indefinido**
- 80 comidas/mes × 365 días × 5 años = ~146k filas → 50MB approx (< 10% del free tier)
- 2 usuarios = pico 0.0002% MAU del límite

## Migración inversa (rollback)

Si querés volver al modo local-only:
1. Tools → Supabase Backend → "Disable"
2. Esto desactiva sync (datos siguen en Supabase pero no se usan)
3. Para borrar datos del cloud: SQL Editor → `delete from meals where user_id = '<tu-uuid>';`

## Privacidad

- **Datos en EU** (Supabase Frankfurt) → cumple GDPR
- **Encriptación at-rest** automática
- **Encriptación in-transit** (TLS) automática
- **Backups** diarios (free tier: 7 días retención)

## Troubleshooting

- **"Failed to fetch"**: revisar que la URL no tenga trailing slash
- **"Invalid API key"**: usar `anon public`, no `service_role`
- **"new row violates row-level security policy"**: el insert no incluye `user_id = auth.uid()`. Re-leer policies en `db-schema.sql`
- **"Email rate limit"**: Supabase free tier tiene 3 emails/hora. Esperar
