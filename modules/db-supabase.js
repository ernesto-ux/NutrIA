// NutrIA — Supabase backend client (OPT-IN)
// Loaded only when localStorage.nutria_supabase_enabled === 'true'
// AND credentials are stored in localStorage.
//
// Schema expected (see SUPABASE_SETUP.md):
//   users (id uuid pk, email, name, created_at)
//   meals (id text pk, user_id uuid fk, date, meal, items jsonb, source, timestamp, created_at)
//   household_members (household_id uuid, user_id uuid, role text)
//
// RLS policies enforce that users only see their own meals + household-shared.

(function() {
  'use strict';

  // Config helpers
  function cfg() {
    return {
      url: localStorage.getItem('nutria_supabase_url') || '',
      anonKey: localStorage.getItem('nutria_supabase_anon_key') || '',
      enabled: localStorage.getItem('nutria_supabase_enabled') === 'true'
    };
  }

  function isReady() {
    const c = cfg();
    return c.enabled && c.url && c.anonKey && typeof window.supabase !== 'undefined';
  }

  let _client = null;
  function getClient() {
    if (_client) return _client;
    if (!isReady()) return null;
    const { url, anonKey } = cfg();
    _client = window.supabase.createClient(url, anonKey, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false }
    });
    return _client;
  }

  async function ensureSDK() {
    if (typeof window.supabase !== 'undefined') return true;
    return new Promise((res, rej) => {
      const s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.js';
      s.onload = res;
      s.onerror = rej;
      document.head.appendChild(s);
    });
  }

  // ── Auth ──
  async function signUp(email, password) {
    await ensureSDK();
    const c = getClient();
    if (!c) throw new Error('Supabase no configurado');
    const { data, error } = await c.auth.signUp({ email, password });
    if (error) throw error;
    return data;
  }

  async function signIn(email, password) {
    await ensureSDK();
    const c = getClient();
    if (!c) throw new Error('Supabase no configurado');
    const { data, error } = await c.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  }

  async function signOut() {
    const c = getClient();
    if (!c) return;
    await c.auth.signOut();
  }

  async function currentUser() {
    const c = getClient();
    if (!c) return null;
    const { data: { user } } = await c.auth.getUser();
    return user;
  }

  // ── Meals CRUD ──
  async function fetchMeals(opts = {}) {
    const c = getClient();
    if (!c) return [];
    let q = c.from('meals').select('*').order('date', { ascending: true });
    if (opts.from) q = q.gte('date', opts.from);
    if (opts.to)   q = q.lte('date', opts.to);
    const { data, error } = await q;
    if (error) throw error;
    return data || [];
  }

  async function upsertMeal(meal) {
    const c = getClient();
    if (!c) throw new Error('Supabase no configurado');
    const { data, error } = await c.from('meals').upsert(meal, { onConflict: 'id' }).select().single();
    if (error) throw error;
    return data;
  }

  async function deleteMeal(id) {
    const c = getClient();
    if (!c) throw new Error('Supabase no configurado');
    const { error } = await c.from('meals').delete().eq('id', id);
    if (error) throw error;
  }

  // ── Migration: bulk import local-meals.json ──
  async function migrateFromLocalMeals(localMealsArray) {
    const c = getClient();
    if (!c) throw new Error('Supabase no configurado');
    const { data: { user } } = await c.auth.getUser();
    if (!user) throw new Error('No autenticado');
    const rows = localMealsArray.map(m => ({
      id: m.id,
      user_id: user.id,
      date: m.date,
      meal: m.meal,
      items: m.items,
      source: m.source || 'migrated',
      timestamp: m.timestamp || new Date().toISOString()
    }));
    const { data, error } = await c.from('meals').upsert(rows, { onConflict: 'id' });
    if (error) throw error;
    return data;
  }

  // ── Setup helper (called from Tools UI) ──
  async function setupConnection(url, anonKey) {
    localStorage.setItem('nutria_supabase_url', url);
    localStorage.setItem('nutria_supabase_anon_key', anonKey);
    localStorage.setItem('nutria_supabase_enabled', 'true');
    _client = null; // reset
    await ensureSDK();
    return getClient();
  }

  function disableConnection() {
    localStorage.removeItem('nutria_supabase_url');
    localStorage.removeItem('nutria_supabase_anon_key');
    localStorage.removeItem('nutria_supabase_enabled');
    _client = null;
  }

  // Expose
  window.NutrIASupabase = {
    cfg, isReady, getClient, ensureSDK,
    signUp, signIn, signOut, currentUser,
    fetchMeals, upsertMeal, deleteMeal,
    migrateFromLocalMeals,
    setupConnection, disableConnection
  };
})();
