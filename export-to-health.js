#!/usr/bin/env node
// Export NutrIA meals to JSON for Apple Health import
// Usage: node export-to-health.js [date] [date2]
// If no dates, exports today

const fs = require('fs');
const src = fs.readFileSync(__dirname + '/nutrition-data.js', 'utf8').replace(/^const /gm, 'var ');
eval(src);

const args = process.argv.slice(2);
const dates = args.length ? args : [new Date().toISOString().slice(0,10)];

// Filter meals for Ernesto (no "who" field) for the given dates
const meals = MEAL_LOG.filter(m => 
  dates.includes(m.date) && !m.who
);

// Group by date
const byDate = {};
meals.forEach(m => {
  if (!byDate[m.date]) byDate[m.date] = { kcal: 0, prot: 0, carbs: 0, fat: 0, fiber: 0, items: [] };
  const day = byDate[m.date];
  (m.items || []).forEach(it => {
    day.kcal += it.kcal || 0;
    day.prot += it.prot || 0;
    day.carbs += it.carbs || 0;
    day.fat += it.fat || 0;
    day.items.push({ meal: m.meal, name: it.name, grams: it.grams, kcal: it.kcal });
  });
});

// Output for Apple Health Shortcut
const output = Object.entries(byDate).map(([date, d]) => ({
  date: date,
  calories: Math.round(d.kcal),
  protein: Math.round(d.prot * 10) / 10,
  carbs: Math.round(d.carbs * 10) / 10,
  fat: Math.round(d.fat * 10) / 10,
  items_count: d.items.length
}));

// Write to both /tmp and iCloud Drive
const icloudDir = require('os').homedir() + '/Library/Mobile Documents/com~apple~CloudDocs/NutrIA';
if (!fs.existsSync(icloudDir)) fs.mkdirSync(icloudDir, { recursive: true });
const jsonStr = JSON.stringify(output, null, 2);
fs.writeFileSync('/tmp/nutria-health-export.json', jsonStr);
fs.writeFileSync(icloudDir + '/health-export.json', jsonStr);
console.log('Exported to iCloud Drive → NutrIA/health-export.json');
output.forEach(d => {
  console.log(`${d.date}: ${d.calories} kcal | ${d.protein}p | ${d.carbs}c | ${d.fat}f (${d.items_count} items)`);
});
