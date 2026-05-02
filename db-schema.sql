-- NutrIA — Supabase schema
-- Run in SQL Editor of your Supabase project
-- Free tier: 500MB Postgres, sufficient for years of meal data

-- Auth users come from Supabase auth.users built-in table
-- Public profile extension
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique,
  name text,
  household_id uuid,
  created_at timestamptz default now()
);

-- Meals: one row per meal entry (matches local-meals.json structure)
create table public.meals (
  id text primary key,
  user_id uuid references auth.users not null,
  date date not null,
  meal text not null check (meal in ('desayuno','almuerzo','snack','cena')),
  items jsonb not null default '[]',
  source text default 'local',
  timestamp timestamptz default now(),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index meals_user_date_idx on public.meals(user_id, date desc);
create index meals_household_idx on public.meals(user_id, date) where source != 'archive';

-- Household sharing (optional Phase E3)
create table public.households (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_by uuid references auth.users,
  created_at timestamptz default now()
);

create table public.household_members (
  household_id uuid references public.households on delete cascade,
  user_id uuid references auth.users on delete cascade,
  role text default 'member' check (role in ('owner','member')),
  joined_at timestamptz default now(),
  primary key (household_id, user_id)
);

-- Activity, Weight, Notes (one table per metric type for clarity)
create table public.activity_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  date date not null,
  steps int default 0,
  active_kcal int default 0,
  exercise_min int default 0,
  hr_avg int,
  hr_max int,
  source text default 'manual',
  unique (user_id, date, source)
);

create table public.weight_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  date date not null,
  weight numeric(5,2) not null,
  body_fat numeric(4,1),
  bmi numeric(4,1),
  muscle_mass numeric(5,2),
  fat_free_weight numeric(5,2),
  visceral_fat numeric(4,1),
  body_water numeric(4,1),
  bmr int,
  metabolic_age int,
  source text default 'manual',
  unique (user_id, date, source)
);

-- ── ROW LEVEL SECURITY ─────────────────────────────────────────────
-- Enable RLS
alter table public.profiles            enable row level security;
alter table public.meals               enable row level security;
alter table public.households          enable row level security;
alter table public.household_members   enable row level security;
alter table public.activity_entries    enable row level security;
alter table public.weight_entries      enable row level security;

-- Profiles: read own + household, edit own
create policy "Users see own profile" on public.profiles for select using (id = auth.uid());
create policy "Users edit own profile" on public.profiles for update using (id = auth.uid());

-- Meals: see own + household members'
create policy "Users see own meals" on public.meals for select
  using (user_id = auth.uid()
         OR user_id in (
           select hm2.user_id from public.household_members hm1
           join public.household_members hm2 on hm1.household_id = hm2.household_id
           where hm1.user_id = auth.uid()
         ));
create policy "Users insert own meals" on public.meals for insert with check (user_id = auth.uid());
create policy "Users update own meals" on public.meals for update using (user_id = auth.uid());
create policy "Users delete own meals" on public.meals for delete using (user_id = auth.uid());

-- Activity / Weight similar
create policy "Users own activity" on public.activity_entries for all using (user_id = auth.uid());
create policy "Users own weight" on public.weight_entries for all using (user_id = auth.uid());

-- Households (members can see, owners can mutate)
create policy "Members see household" on public.households for select
  using (id in (select household_id from public.household_members where user_id = auth.uid()));
create policy "Owners create household" on public.households for insert with check (created_by = auth.uid());

-- Household members
create policy "Users see members of own household" on public.household_members for select
  using (household_id in (select household_id from public.household_members where user_id = auth.uid()));
create policy "Users join household" on public.household_members for insert with check (user_id = auth.uid());

-- ── PROFILE TRIGGER on signup ─────────────────────────────────────
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
