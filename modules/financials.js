// NutrIA — Financials module
// Loaded BEFORE the main IIFE. Provides global PRICE_DB and window.getDayCost.
// getDayCost uses window.NutrIA.getDay which is set at end of IIFE.

var PRICE_DB = {};

async function loadPriceDB() {
  try {
    const r = await fetch('local-prices.json', { cache: 'no-store' });
    if (r.ok) PRICE_DB = await r.json();
  } catch(e) {}
}

window.getDayCost = function(date) {
  const entries = window.NutrIA.getDay(date);
  let cost = 0;
  entries.forEach(entry => {
    entry.items.forEach(item => {
      if (!item.foodId || !(item.grams > 0)) return;
      const p = PRICE_DB[item.foodId];
      if (p && p.price_per_100g) cost += p.price_per_100g * item.grams / 100;
    });
  });
  return Math.round(cost * 100) / 100;
};
