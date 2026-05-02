// NutrIA — Export module
// Loaded AFTER the main IIFE. All helpers accessed via window.NutrIA.

window.copyForMFP = function() {
  const { getAllMeals, USERS, MEAL_ORDER, MEAL_LABELS, round1, showToast } = window.NutrIA;
  const currentUser = window.NutrIA.currentUser;
  const currentDate = window.NutrIA.currentDate;
  const allMeals = getAllMeals();
  const dayMeals = allMeals.filter(m => m.date === currentDate);
  const lines = [];
  const userName = USERS[currentUser].name;
  lines.push(`${userName} - ${currentDate}`);
  lines.push('');
  MEAL_ORDER.forEach(m => {
    const entries = dayMeals.filter(e => e.meal === m);
    const items = entries.flatMap(e => e.items || []);
    if (items.length === 0) return;
    lines.push(`${MEAL_LABELS[m].toUpperCase()}`);
    items.forEach(item => {
      lines.push(`  ${item.name} — ${item.grams}g — ${Math.round(item.kcal)}kcal | P${round1(item.prot)}g C${round1(item.carbs)}g F${round1(item.fat)}g`);
    });
    lines.push('');
  });
  navigator.clipboard.writeText(lines.join('\n')).then(() => showToast('Copiado para MFP'));
};

window.copyForHealth = function() {
  const currentDate = window.NutrIA.currentDate;
  const cards = document.querySelectorAll('.food-card[data-meal]');
  if (cards.length === 0) { alert('Sin comidas para copiar'); return; }

  const mealTotals = {};
  cards.forEach(card => {
    const meal = card.getAttribute('data-meal');
    const kcal = parseFloat(card.getAttribute('data-kcal')) || 0;
    const prot = parseFloat(card.getAttribute('data-prot')) || 0;
    const carbs = parseFloat(card.getAttribute('data-carbs')) || 0;
    const fat = parseFloat(card.getAttribute('data-fat')) || 0;
    if (!mealTotals[meal]) mealTotals[meal] = { kcal: 0, prot: 0, carbs: 0, fat: 0 };
    mealTotals[meal].kcal += kcal;
    mealTotals[meal].prot += prot;
    mealTotals[meal].carbs += carbs;
    mealTotals[meal].fat += fat;
  });

  const MEAL_TIMES = { desayuno: '08:00', almuerzo: '13:00', snack: '16:00', cena: '20:00' };
  const lines = [];
  for (const [meal, t] of Object.entries(mealTotals)) {
    const time = MEAL_TIMES[meal] || '12:00';
    const r = v => Math.round(v * 10) / 10;
    lines.push(`${currentDate} ${time}|${r(t.kcal)}|${r(t.prot)}|${r(t.carbs)}|${r(t.fat)}`);
  }

  const text = lines.join('\n');
  window.prompt('Select All + Copy this text, then run NutrIA shortcut:', text);
};

window.exportInformeCSV = function() {
  const { getInformeDates, getAllMeals, USERS, parseDate, round1, showToast } = window.NutrIA;
  const currentUser = window.NutrIA.currentUser;
  const dates = getInformeDates();
  const allMeals = getAllMeals();
  const userName = USERS[currentUser].name;
  const hasPricesCSV = Object.keys(PRICE_DB).length > 0;
  const rows = [['Fecha','Dia','Comida','Alimento','Gramos','Kcal','Proteina','Carbs','Grasa', ...(hasPricesCSV ? ['Costo (€)'] : [])]];
  const dayNames = ['Dom','Lun','Mar','Mie','Jue','Vie','Sab'];

  dates.forEach(date => {
    const dayMeals = allMeals.filter(m => m.date === date);
    const d = parseDate(date);
    const dayName = dayNames[d.getDay()];
    dayMeals.forEach(m => {
      (m.items || []).forEach(item => {
        const itemCost = hasPricesCSV && item.foodId && PRICE_DB[item.foodId]
          ? (PRICE_DB[item.foodId].price_per_100g * (item.grams || 0) / 100).toFixed(2)
          : '';
        rows.push([
          date, dayName, m.meal || '',
          (item.name || item.foodId || '').replace(/,/g, ';'),
          round1(item.grams || 0),
          round1(item.kcal || 0),
          round1(item.prot || 0),
          round1(item.carbs || 0),
          round1(item.fat || 0),
          ...(hasPricesCSV ? [itemCost] : [])
        ]);
      });
    });
  });

  const csv = rows.map(r => r.join(',')).join('\n');
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `NutrIA_${userName}_${dates[0]}_${dates[dates.length-1]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('CSV descargado');
};

window.openAdrianaDoc = function() {
  const w = window.open('', '_blank');
  const raw = `# Documento de configuración NutrIA para Claude (Adriana)

Pega este bloque al inicio de tu sesión con Claude, junto con el token que te dio Ernesto.

---

Eres el asistente de NutrIA para ADRIANA.

## Repo y archivos
- GitHub repo: ernesto-ux/NutrIA
- Meals: local-meals.json → campo "meals": [...]
- Pesos: nutrition-data.js → WEIGHT_LOG
- Actividad: nutrition-data.js → ACTIVITY_LOG
- Alimentos: nutrition-data.js → FOOD_DATABASE
- Precios: local-prices.json

## Tu usuario
- user: "adriana"
- TODAS las entradas deben tener "user": "adriana"
- NUNCA toques entradas de user "ernesto"

## Formato entrada de comida (local-meals.json)
{
  "id": "YYYY-MM-DD-adriana-001",
  "date": "YYYY-MM-DD",
  "meal": "desayuno|almuerzo|cena|snack",
  "user": "adriana",
  "items": [
    { "foodId": "id-alimento", "name": "Nombre", "grams": 100,
      "kcal": 0.0, "prot": 0.0, "carbs": 0.0, "fat": 0.0 }
  ]
}

## Formato peso (WEIGHT_LOG en nutrition-data.js)
{ date: "YYYY-MM-DD", weight: 00.0, user: "adriana", notes: "" }

## Formato actividad (ACTIVITY_LOG en nutrition-data.js)
{ date: "YYYY-MM-DD", steps: 0000, stepsKcal: 0, gym: null, gymKcal: 0, user: "adriana", notes: "" }

## Lookup macros — orden de prioridad
1. FOOD_DATABASE en nutrition-data.js
2. OpenFoodFacts: https://world.openfoodfacts.org/cgi/search.pl?search_terms=NOMBRE&json=1
3. FatSecret France: https://www.fatsecret.fr/calories-nutrition/search?q=NOMBRE
4. Estimación (indicar "estimated" en notes)

## Escribir al repo
Siempre obtén el SHA antes de escribir:
  gh api repos/ernesto-ux/NutrIA/contents/FILENAME --jq '.sha'

Luego escribe:
  gh api --method PUT repos/ernesto-ux/NutrIA/contents/FILENAME \\
    --field message="descripción" \\
    --field content="\$(base64 -i archivo)" \\
    --field sha="SHA_ACTUAL"

## Token
El token de GitHub lo provee Ernesto. Configúralo al inicio:
  gh auth login --with-token <<< TOKEN

## Reglas
- NUNCA borres entradas existentes
- NUNCA modifiques datos de user "ernesto"
- Verifica SHA antes de cada escritura
- IDs de alimentos: kebab-case, sin tildes (ej: "pollo-plancha-pechuga")
- IDs de entradas: "YYYY-MM-DD-adriana-001", "002", etc.
- Si un alimento no está en FOOD_DATABASE, créalo primero`;

  w.document.write('<!DOCTYPE html><html><head><meta charset="UTF-8"><title>NutrIA — Setup Adriana</title>'
    + '<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">'
    + '<style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:Inter,sans-serif;background:#F8FAFC;color:#1E293B;padding:24px}'
    + 'h1{font-size:1.3rem;font-weight:800;color:#6366F1;margin-bottom:16px}'
    + 'pre{background:#1E293B;color:#E2E8F0;padding:20px;border-radius:12px;font-size:12px;line-height:1.6;white-space:pre-wrap;overflow-x:auto}'
    + '.copy-btn{margin-bottom:16px;padding:10px 20px;background:#6366F1;color:#fff;border:none;border-radius:8px;font-size:13px;font-weight:600;cursor:pointer;font-family:inherit}'
    + '.copy-btn:hover{background:#4F46E5}</style></head><body>'
    + '<h1>🤖 Documento para Claude — Setup NutrIA (Adriana)</h1>'
    + '<button class="copy-btn" onclick="navigator.clipboard.writeText(document.getElementById(\'doc\').textContent).then(()=>{this.textContent=\'✅ Copiado!\';setTimeout(()=>{this.textContent=\'📋 Copiar al portapapeles\'},2000)})">📋 Copiar al portapapeles</button>'
    + '<pre id="doc">' + raw.replace(/</g,'&lt;').replace(/>/g,'&gt;') + '</pre>'
    + '</body></html>');
  w.document.close();
};

window.openPricesDoc = function() {
  if (!Object.keys(PRICE_DB).length) { alert('Base de precios no cargada todavía.'); return; }
  const entries = Object.entries(PRICE_DB);
  const stores = ['— Todas —', ...new Set(entries.map(([,p]) => p.store || '—').filter(Boolean).sort())];
  const storeOptions = stores.map(s => `<option>${s}</option>`).join('');
  const priceData = JSON.stringify(Object.fromEntries(entries));

  const w = window.open('', '_blank');
  w.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8">
<title>NutrIA — Base de Precios</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
<style>
  * { box-sizing:border-box; margin:0; padding:0; }
  body { font-family:'Inter',sans-serif; background:#F8FAFC; color:#1E293B; padding:24px; }
  h1 { font-size:1.4rem; font-weight:800; color:#0D9488; margin-bottom:4px; }
  .subtitle { font-size:11px; color:#64748B; margin-bottom:14px; }
  .controls { display:flex; gap:10px; flex-wrap:wrap; align-items:center; margin-bottom:14px; }
  .controls input, .controls select { padding:6px 10px; border:1.5px solid #E2E8F0; border-radius:7px; font-size:12px; font-family:inherit; background:#fff; }
  .controls input:focus, .controls select:focus { outline:none; border-color:#0D9488; }
  label { font-size:11px; font-weight:600; color:#64748B; }
  table { width:100%; border-collapse:collapse; background:#fff; border-radius:10px; overflow:hidden; box-shadow:0 1px 4px rgba(0,0,0,.08); }
  th { background:#0D9488; color:#fff; font-size:10px; text-transform:uppercase; letter-spacing:1px; padding:8px 10px; text-align:left; cursor:pointer; user-select:none; white-space:nowrap; }
  th:hover { background:#0F766E; }
  th.asc::after { content:' ↑'; } th.desc::after { content:' ↓'; }
  td { padding:6px 10px; border-bottom:1px solid #F1F5F9; font-size:11px; }
  tr:hover td { background:#F0FDFA; }
  .legend { display:flex; gap:14px; margin-bottom:12px; font-size:11px; }
  .dot { display:inline-block; width:10px; height:10px; border-radius:50%; vertical-align:middle; margin-right:4px; }
  #count { font-size:11px; color:#64748B; margin-left:auto; }
</style></head><body>
<h1>🦦 NutrIA — Base de Precios (París 2026)</h1>
<p class="subtitle">${entries.length} productos · actualizado ${new Date().toLocaleDateString('es-ES')}</p>
<div class="legend">
  <span><span class="dot" style="background:#059669"></span>€0–1.49/100g</span>
  <span><span class="dot" style="background:#F59E0B"></span>€1.50–2.99/100g</span>
  <span><span class="dot" style="background:#EF4444"></span>€3+/100g</span>
</div>
<div class="controls">
  <label>Tienda <select id="f-store">${storeOptions}</select></label>
  <label>Precio <select id="f-tier">
    <option value="">— Todos —</option>
    <option value="green">🟢 &lt;€1.50</option>
    <option value="yellow">🟡 €1.50–2.99</option>
    <option value="red">🔴 €3+</option>
  </select></label>
  <input id="f-search" placeholder="🔍 Buscar..." style="min-width:180px;">
  <span id="count"></span>
</div>
<table><thead><tr>
  <th data-key="id">ID Alimento</th>
  <th data-key="p100">€/100g</th>
  <th data-key="unit">Precio Unidad</th>
  <th data-key="store">Tienda</th>
  <th>Notas</th>
</tr></thead><tbody id="tbody"></tbody></table>
<script>
var DB = ${priceData};
var entries2 = Object.entries(DB);
var sortKey = 'id', sortDir = 'asc';
function refresh() {
  var store = document.getElementById('f-store').value;
  var tier = document.getElementById('f-tier').value;
  var search = document.getElementById('f-search').value.toLowerCase().trim();
  var data = entries2.filter(function(e) {
    var id = e[0], p = e[1];
    if (store && store !== '— Todas —' && p.store !== store) return false;
    if (tier === 'green' && p.price_per_100g >= 1.5) return false;
    if (tier === 'yellow' && (p.price_per_100g < 1.5 || p.price_per_100g >= 3)) return false;
    if (tier === 'red' && p.price_per_100g < 3) return false;
    if (search && !id.toLowerCase().includes(search) && !(p.notes||'').toLowerCase().includes(search) && !(p.store||'').toLowerCase().includes(search)) return false;
    return true;
  });
  data.sort(function(a, b) {
    var va, vb;
    if (sortKey === 'id') { va = a[0]; vb = b[0]; }
    else if (sortKey === 'p100') { va = a[1].price_per_100g; vb = b[1].price_per_100g; }
    else if (sortKey === 'unit') { va = a[1].unit_price || 9999; vb = b[1].unit_price || 9999; }
    else if (sortKey === 'store') { va = a[1].store||''; vb = b[1].store||''; }
    var cmp = typeof va === 'string' ? va.localeCompare(vb) : va - vb;
    return sortDir === 'asc' ? cmp : -cmp;
  });
  document.getElementById('count').textContent = data.length + ' resultados';
  var html = '';
  data.forEach(function(e) {
    var id = e[0], p = e[1];
    var color = p.price_per_100g >= 3 ? '#EF4444' : p.price_per_100g >= 1.5 ? '#F59E0B' : '#059669';
    var unitStr = p.unit_price ? ('€' + p.unit_price.toFixed(2) + ' / ' + (p.unit_size_g||'?') + 'g') : '—';
    html += '<tr><td>' + id + '</td><td style="font-weight:700;color:' + color + '">€' + p.price_per_100g.toFixed(2) + '</td><td>' + unitStr + '</td><td style="color:#64748B">' + (p.store||'—') + '</td><td style="color:#94A3B8">' + (p.notes||'') + '</td></tr>';
  });
  document.getElementById('tbody').innerHTML = html;
  document.querySelectorAll('th[data-key]').forEach(function(th) {
    th.className = th.dataset.key === sortKey ? sortDir : '';
  });
}
document.querySelectorAll('th[data-key]').forEach(function(th) {
  th.addEventListener('click', function() {
    if (sortKey === th.dataset.key) sortDir = sortDir === 'asc' ? 'desc' : 'asc';
    else { sortKey = th.dataset.key; sortDir = 'asc'; }
    refresh();
  });
});
document.getElementById('f-store').addEventListener('change', refresh);
document.getElementById('f-tier').addEventListener('change', refresh);
document.getElementById('f-search').addEventListener('input', refresh);
refresh();
<\/script></body></html>`);
  w.document.close();
};

window.exportInformeHTML = function() {
  const { getInformeDates, getDayTotals, getActivityForDate, getBalanceForDate, parseDate,
          TARGETS, getTDEE, round1, USERS } = window.NutrIA;
  const currentUser = window.NutrIA.currentUser;
  const informeRange = window.NutrIA.informeRange;
  const hasPricesLocal = Object.keys(PRICE_DB).length > 0;

  const statusEl = document.getElementById('pdf-status');
  if (statusEl) statusEl.textContent = 'Generando...';

  const dates = getInformeDates();
  const dayNames = ['Dom','Lun','Mar','Mie','Jue','Vie','Sab'];
  const tgt = TARGETS();

  const days = dates.map(date => {
    const totals = getDayTotals(date);
    const activity = getActivityForDate(date);
    const balance = getBalanceForDate(date);
    const d = parseDate(date);
    return { date, totals, activity, balance, dayName: dayNames[d.getDay()],
      dayLabel: d.toLocaleDateString('es-ES',{day:'numeric',month:'short'}),
      hasData: totals.kcal > 0 };
  });

  const daysWithData = days.filter(d => d.hasData);
  const totalIntake = daysWithData.reduce((s,d) => s + d.totals.kcal, 0);
  const avgIntake = daysWithData.length > 0 ? totalIntake / daysWithData.length : 0;
  const avgProt = daysWithData.length > 0 ? daysWithData.reduce((s,d) => s + d.totals.prot, 0) / daysWithData.length : 0;
  const avgCarbs = daysWithData.length > 0 ? daysWithData.reduce((s,d) => s + d.totals.carbs, 0) / daysWithData.length : 0;
  const avgFat = daysWithData.length > 0 ? daysWithData.reduce((s,d) => s + d.totals.fat, 0) / daysWithData.length : 0;

  let totalGym = 0, totalStepsKcal = 0, totalSteps = 0, gymSessions = 0;
  days.forEach(d => {
    if (d.activity) {
      totalGym += d.activity.gymKcal || 0;
      totalStepsKcal += d.activity.stepsKcal || 0;
      totalSteps += d.activity.steps || 0;
      if (d.activity.gymKcal > 0) gymSessions++;
    }
  });

  const totalTDEE = daysWithData.reduce((s, d) => s + getTDEE(d.date), 0);
  const totalBurn = totalTDEE + totalGym + totalStepsKcal;
  const totalDeficit = totalIntake - totalBurn;
  const fatLost = Math.abs(totalDeficit) / 7700;

  const rangeLabel = informeRange === 'dia' ? `Dia ${dates[0]}` : informeRange === 'semana' ? `Semana ${dates[0].slice(8)}-${dates[dates.length-1].slice(8)} ${dates[0].slice(5,7)}` : informeRange === 'mes' ? 'Ultimos 30 dias' : `${dates[0]} a ${dates[dates.length-1]}`;
  const totalCostH = hasPricesLocal ? daysWithData.reduce((s,d) => s + window.getDayCost(d.date), 0) : 0;
  const avgCostH = daysWithData.length > 0 ? totalCostH / daysWithData.length : 0;

  const kpiItemsH = [
    { emoji:'🔥', value: `${Math.abs(Math.round(totalDeficit)).toLocaleString()} kcal`, label:'Déficit', color:'#059669' },
    { emoji:'⚖️', value: `${fatLost.toFixed(2)} kg`, label:'Grasa Perdida', color:'#0D9488' },
    { emoji:'🍽️', value: `${Math.round(avgIntake)} kcal`, label:'Prom/día', color: avgIntake <= tgt.kcal ? '#059669' : '#F59E0B' },
    { emoji:'💪', value: `${gymSessions}x · ${totalGym.toLocaleString()} kcal`, label:'Gym', color:'#0D9488' },
    { emoji:'🚶', value: `${Math.round(totalSteps/1000)}k pasos`, label:`${totalStepsKcal} kcal`, color:'#64748B' },
    { emoji:'📅', value: `${daysWithData.length}/${days.length}`, label:'Días Reg.', color:'#1E293B' },
    ...(hasPricesLocal ? [{ emoji:'💶', value:`€${totalCostH.toFixed(2)}`, label:`€${avgCostH.toFixed(2)}/día`, color:'#059669' }] : []),
  ];
  const kpiHtmlH = kpiItemsH.map(k => `
    <div style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:8px;padding:10px 6px;text-align:center;">
      <div style="font-size:18px;">${k.emoji}</div>
      <div style="font-size:14px;font-weight:700;color:${k.color};margin:3px 0 1px;">${k.value}</div>
      <div style="font-size:9px;color:#64748B;text-transform:uppercase;letter-spacing:0.5px;font-weight:600;">${k.label}</div>
    </div>`).join('');

  let balRows = '', wkI=0, wkT=0, wkS=0, wkG=0, wkB=0, wkC=0;
  days.forEach(d => {
    const pdfTDEE = getTDEE(d.date);
    const intake = d.hasData ? Math.round(d.totals.kcal) : '—';
    const gym = d.activity && d.activity.gymKcal > 0 ? d.activity.gymKcal : '—';
    const steps = d.activity ? d.activity.stepsKcal : '—';
    const bal = d.hasData ? Math.round(d.totals.kcal - pdfTDEE - (d.activity?d.activity.gymKcal||0:0) - (d.activity?d.activity.stepsKcal||0:0)) : null;
    const balColor = bal === null ? '#64748B' : bal < -1000 ? '#059669' : bal < 0 ? '#0D9488' : '#EF4444';
    const balStr = bal === null ? '—' : (bal > 0 ? '+' : '') + bal;
    const dayCostH = d.hasData && hasPricesLocal ? window.getDayCost(d.date) : 0;
    const bg = (d.dayName==='Sab'||d.dayName==='Dom') ? '#F0FDFA' : '#fff';
    if (d.hasData) { wkI+=d.totals.kcal; wkT+=pdfTDEE; wkS+=(d.activity?d.activity.stepsKcal||0:0); wkG+=(d.activity?d.activity.gymKcal||0:0); wkB+=(bal||0); wkC+=dayCostH; }
    balRows += `<tr style="background:${bg}">
      <td style="font-weight:700;text-align:left;padding:5px 8px;">${d.dayName}</td>
      <td style="text-align:left;color:#64748B;padding:5px 8px;">${d.dayLabel}</td>
      <td>${intake}</td><td style="color:#64748B;">${pdfTDEE.toLocaleString()}</td>
      <td style="color:#F59E0B;">${steps}</td><td style="color:#0D9488;font-weight:600;">${gym}</td>
      <td style="color:${balColor};font-weight:700;">${balStr}</td>
      ${hasPricesLocal ? `<td style="color:#059669;font-weight:600;">${d.hasData?'€'+dayCostH.toFixed(0):''}</td>` : ''}
    </tr>`;
  });
  balRows += `<tr style="background:#0D9488;color:#fff;font-weight:700;">
    <td colspan="2" style="padding:6px 8px;text-align:left;">TOTAL</td>
    <td>${Math.round(wkI).toLocaleString()}</td><td style="opacity:.8;">${Math.round(wkT).toLocaleString()}</td>
    <td style="opacity:.8;">${wkS}</td><td style="opacity:.8;">${wkG.toLocaleString()}</td>
    <td>${wkB > 0 ? '+' : ''}${Math.round(wkB).toLocaleString()}</td>
    ${hasPricesLocal ? `<td>€${wkC.toFixed(0)}</td>` : ''}
  </tr>`;

  const avgFiber = daysWithData.length > 0 ? daysWithData.reduce((s,d)=>s+(d.totals.fiber||0),0)/daysWithData.length : 0;
  const avgSodium = daysWithData.length > 0 ? daysWithData.reduce((s,d)=>s+(d.totals.sodium||0),0)/daysWithData.length : 0;
  const macroRowsH = [
    {n:'Calorías',e:'🔥',avg:avgIntake,tgt2:tgt.kcal,u:'kcal',inv:false},
    {n:'Proteína',e:'💪',avg:avgProt,tgt2:tgt.prot,u:'g',inv:false},
    {n:'Carbs',e:'🌾',avg:avgCarbs,tgt2:tgt.carbs,u:'g',inv:false},
    {n:'Grasa',e:'🧈',avg:avgFat,tgt2:tgt.fat,u:'g',inv:false},
    {n:'Fibra',e:'🥦',avg:avgFiber,tgt2:25,u:'g',inv:false},
    {n:'Sodio',e:'🧂',avg:avgSodium,tgt2:2300,u:'mg',inv:true},
  ].map(m => {
    const pct = m.tgt2 > 0 ? Math.round(m.avg / m.tgt2 * 100) : 0;
    const color = (m.inv ? pct > 100 : pct > 120) ? '#EF4444' : (m.inv ? pct <= 100 : pct >= 90 && pct <= 110) ? '#059669' : '#F59E0B';
    return `<tr><td style="text-align:left;font-weight:600;">${m.e} ${m.n}</td>
      <td style="text-align:right;">${round1(m.avg)} ${m.u}</td>
      <td style="text-align:right;color:#64748B;">${m.tgt2} ${m.u}</td>
      <td style="text-align:right;font-weight:700;color:${color};">${pct}%</td></tr>`;
  }).join('');

  let weightHtmlH = '';
  if (typeof WEIGHT_LOG !== 'undefined' && WEIGHT_LOG.length >= 2) {
    const wS = [...WEIGHT_LOG].sort((a,b)=>a.date.localeCompare(b.date));
    const delta = (wS[wS.length-1].weight - wS[0].weight).toFixed(1);
    const wRate = (wS[wS.length-1].weight - wS[0].weight) / ((new Date(wS[wS.length-1].date)-new Date(wS[0].date))/604800000);
    const wLeft = wRate < 0 ? Math.ceil((wS[wS.length-1].weight-75)/Math.abs(wRate)) : 999;
    weightHtmlH = `<section><h2>⚖️ Evolución de Peso</h2>
      <p style="margin-bottom:10px;">${wS[0].weight} → ${wS[wS.length-1].weight} kg (<b style="color:${delta<0?'#059669':'#EF4444'}">${delta} kg</b>) · ${wRate.toFixed(2)} kg/sem · meta 75 kg en ~${wLeft} sem</p>
      <table><thead><tr><th style="text-align:left;">Fecha</th><th>Peso</th><th>% Grasa</th><th style="text-align:left;">Notas</th></tr></thead>
      <tbody>${wS.map(w=>`<tr><td style="text-align:left;">${w.date}</td><td>${w.weight} kg</td><td>${w.bodyFat?w.bodyFat+'%':'—'}</td><td style="color:#64748B;">${w.notes||''}</td></tr>`).join('')}</tbody></table>
    </section>`;
  }

  // Build food cost breakdown (top items by total spend)
  let gastoPorAlimentoHtml = '';
  if (hasPricesLocal) {
    const foodTotals = {};
    const { getAllMeals } = window.NutrIA;
    const allMealsForPeriod = getAllMeals().filter(m => dates.includes(m.date));
    allMealsForPeriod.forEach(m => {
      (m.items || []).forEach(item => {
        if (!item.foodId) return;
        const p = PRICE_DB[item.foodId];
        const itemCost = p ? p.price_per_100g * (item.grams || 0) / 100 : 0;
        if (!foodTotals[item.foodId]) foodTotals[item.foodId] = { name: item.name, grams: 0, cost: 0, p100: p ? p.price_per_100g : null };
        foodTotals[item.foodId].grams += item.grams || 0;
        foodTotals[item.foodId].cost += itemCost;
      });
    });
    const foodRows = Object.values(foodTotals)
      .filter(f => f.cost > 0)
      .sort((a, b) => b.cost - a.cost)
      .slice(0, 20)
      .map(f => {
        const color = f.p100 >= 3 ? '#EF4444' : f.p100 >= 1.5 ? '#F59E0B' : '#059669';
        return `<tr><td style="text-align:left;">${f.name}</td><td>${Math.round(f.grams)}g</td><td style="color:${color};">€${f.p100 ? f.p100.toFixed(2) : '—'}</td><td style="font-weight:700;color:#059669;">€${f.cost.toFixed(2)}</td></tr>`;
      }).join('');
    if (foodRows) {
      gastoPorAlimentoHtml = `<section><h2>💶 Gasto por Alimento</h2>
        <table><thead><tr><th style="text-align:left;">Alimento</th><th>Total g</th><th>€/100g</th><th>Gasto</th></tr></thead>
        <tbody>${foodRows}</tbody></table>
      </section>`;
    }
  }

  const wFL = (Math.abs(totalDeficit)/Math.max(daysWithData.length,1)*7)/7700;
  const cW = 89 - fatLost;
  const wG = wFL > 0 ? Math.ceil((cW-75)/wFL) : 999;
  const gD = new Date(); gD.setDate(gD.getDate()+wG*7);
  const gL = gD.toLocaleDateString('es-ES',{day:'numeric',month:'long',year:'numeric'});

  const win = window.open('', '_blank');
  win.document.write(`<!DOCTYPE html><html lang="es"><head>
<meta charset="UTF-8"><title>NutrIA — ${USERS[currentUser].name} — ${rangeLabel}</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet">
<style>
  *{box-sizing:border-box;margin:0;padding:0}body{font-family:'Inter',sans-serif;background:#F8FAFC;color:#1E293B;padding:32px;font-size:13px;line-height:1.5;}
  .top{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:24px;padding-bottom:16px;border-bottom:3px solid #0D9488;}
  h1{font-size:1.6rem;font-weight:800;color:#0D9488;}.sub{font-size:12px;color:#64748B;margin-top:2px;}
  .dl-btn{background:#0D9488;color:#fff;border:none;border-radius:8px;padding:8px 18px;font-size:12px;font-weight:600;cursor:pointer;font-family:inherit;}
  section{background:#fff;border:1px solid #E2E8F0;border-radius:12px;padding:18px 20px;margin-bottom:16px;}
  h2{font-size:14px;font-weight:700;margin-bottom:12px;}.kpi-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(110px,1fr));gap:8px;}
  table{width:100%;border-collapse:collapse;}th{background:#F1F5F9;color:#64748B;font-size:10px;text-transform:uppercase;letter-spacing:.8px;font-weight:700;padding:6px 8px;text-align:center;}
  td{padding:5px 8px;border-bottom:1px solid #F1F5F9;text-align:center;font-size:12px;}.proj{display:grid;grid-template-columns:1fr 1fr;gap:12px;}
  .proj-box{border-radius:10px;padding:16px;text-align:center;}footer{text-align:center;font-size:10px;color:#94A3B8;margin-top:20px;padding-top:12px;border-top:1px solid #E2E8F0;}
  p{font-size:12px;color:#64748B;}
</style></head><body>
<div class="top"><div><h1>🦦 NutrIA — Informe Nutricional</h1>
  <div class="sub">${rangeLabel} · ${USERS[currentUser].name} · ${daysWithData.length} días · ${new Date().toLocaleDateString('es-ES',{day:'numeric',month:'long',year:'numeric'})}</div></div>
  <button class="dl-btn" onclick="(()=>{const a=document.createElement('a');a.href='data:text/html;charset=utf-8,'+encodeURIComponent(document.documentElement.outerHTML);a.download='nutria-${dates[0]}.html';a.click()})()">⬇ Descargar</button>
</div>
<section><h2>🎯 Resumen</h2><div class="kpi-grid">${kpiHtmlH}</div></section>
<section><h2>⚡ Balance Energético</h2>
  <table><thead><tr><th style="text-align:left;">Día</th><th style="text-align:left;">Fecha</th><th>Ingesta</th><th>TDEE</th><th>🚶</th><th>🏋️</th><th>Balance</th>${hasPricesLocal?'<th style="color:#059669;">💶</th>':''}</tr></thead>
  <tbody>${balRows}</tbody></table>
</section>
<section><h2>🥗 Macros Promedio</h2>
  <table><thead><tr><th style="text-align:left;">Macro</th><th style="text-align:right;">Promedio</th><th style="text-align:right;">Meta</th><th style="text-align:right;">%</th></tr></thead>
  <tbody>${macroRowsH}</tbody></table>
</section>
${weightHtmlH}
${gastoPorAlimentoHtml}
<section><h2>🎯 Proyección</h2><div class="proj">
  <div class="proj-box" style="background:#CCFBF1;"><div style="font-size:10px;text-transform:uppercase;color:#0D9488;font-weight:700;margin-bottom:4px;">Peso Actual Est.</div>
    <div style="font-size:2rem;font-weight:800;color:#0D9488;">${cW.toFixed(1)} kg</div>
    <div style="font-size:11px;color:#64748B;margin-top:4px;">desde 89 kg inicial</div></div>
  <div class="proj-box" style="background:#D1FAE5;"><div style="font-size:10px;text-transform:uppercase;color:#059669;font-weight:700;margin-bottom:4px;">Meta 75 kg</div>
    <div style="font-size:1.4rem;font-weight:800;color:#059669;">${gL}</div>
    <div style="font-size:11px;color:#64748B;margin-top:4px;">~${wG} sem · ${wFL.toFixed(2)} kg/sem</div></div>
</div></section>
<footer>NutrIA · ${new Date().toLocaleDateString('es-ES',{day:'numeric',month:'long',year:'numeric'})}</footer>
</body></html>`);
  win.document.close();
  if (statusEl) statusEl.textContent = 'Abierto en nueva pestaña.';
};

window.exportAllLocal = function () {
  const { getLocalMeals, showToast } = window.NutrIA;
  const local = getLocalMeals();
  if (local.length === 0) { showToast('No hay entries locales'); return; }
  const text = JSON.stringify(local, null, 2);
  navigator.clipboard.writeText(text).then(() => {
    showToast('📤 Entries locales copiados. Pega en Claude Code para persistir.');
  }).catch(() => {
    prompt('Copia este JSON:', text);
  });
};
