// NutrIA - Nutrition Tracker Data
// Updated by Claude Code via /log-food skill
// DO NOT EDIT MANUALLY - use /log-food to add meals

const DATA_TIMESTAMP = "2026-04-01T22:10:00 Europe/Paris";

const NUTRITION_CONFIG = {
  targets: { kcal: 1770, prot: 190, carbs: 140, fat: 50 },
  meals: ["desayuno", "almuerzo", "cena", "snack"],
  mealLabels: { desayuno: "Desayuno", almuerzo: "Almuerzo", cena: "Cena", snack: "Snack" },
  mealIcons: { desayuno: "\u2600", almuerzo: "\u{1F372}", cena: "\u{1F319}", snack: "\u{1F34E}" },
  alerts: {
    proteinMinPct: 0.75,    // alert if < 75% protein target
    calorieMaxPct: 1.20,    // alert if > 120% calorie target
    fatMaxPct: 1.30,        // alert if > 130% fat target
    sugarMaxPerItem: 25,    // alert if single item > 25g sugar
    streakTarget: 7         // days streak goal
  },
  health: {
    greenRange: [0.90, 1.10],  // 90-110% = green
    yellowRange: [0.75, 1.25], // 75-125% = yellow
    // outside yellow = red
  }
};

// Food database - grows over time as new foods are logged
// per100g values: kcal, prot, carbs, fat, fiber (all per 100g or 100ml)
const FOOD_DATABASE = [
  // === RECETARIO ===
  {
    id: "frittata-light",
    name: "Frittata Light",
    brand: "Recetario",
    per100g: { kcal: 136.6, prot: 11.9, carbs: 2.5, fat: 8.8, fiber: 0.3 },
    source: "recetario",
    addedDate: "2026-04-01"
  },
  {
    id: "pesto-albahaca-light-feta",
    name: "Pesto de Albahaca Light con Feta",
    brand: "Recetario",
    per100g: { kcal: 185.6, prot: 3.9, carbs: 1.8, fat: 18.0, fiber: 0.6 },
    source: "recetario",
    addedDate: "2026-04-01"
  },
  {
    id: "lentejas-carne-vegetales",
    name: "Lentejas con Carne y Vegetales",
    brand: "Recetario",
    per100g: { kcal: 100.1, prot: 7.6, carbs: 12.1, fat: 2.6, fiber: 1.8 },
    source: "recetario",
    addedDate: "2026-04-01"
  },
  {
    id: "spanakopita",
    name: "Spanakopita",
    brand: "Recetario",
    per100g: { kcal: 139.8, prot: 6.1, carbs: 6.7, fat: 10.1, fiber: 0.9 },
    source: "recetario",
    addedDate: "2026-04-01"
  },
  // === PRODUCTOS COMERCIALES ===
  {
    id: "eafit-pure-isolate-vanille",
    name: "Pure Isolate Whey Vanille",
    brand: "EAFit",
    per100g: { kcal: 366, prot: 86, carbs: 3.3, fat: 0.9, fiber: 0.9 },
    source: "web",
    addedDate: "2026-04-01"
  },
  {
    id: "alpro-noisette-gourmande",
    name: "Boisson Noisette Gourmande",
    brand: "Alpro",
    per100g: { kcal: 29, prot: 0.4, carbs: 3.2, fat: 1.6, fiber: 0.3 },
    source: "web",
    addedDate: "2026-04-01"
  },
  {
    id: "wasa-leger",
    name: "Tartine Croustillante Leger",
    brand: "Wasa",
    per100g: { kcal: 338, prot: 9, carbs: 62, fat: 1.5, fiber: 22 },
    unitWeight: 9.6,
    source: "web",
    addedDate: "2026-04-01"
  },
  {
    id: "danone-cottage-cheese",
    name: "Cottage Cheese Nature",
    brand: "Danone",
    per100g: { kcal: 90, prot: 12, carbs: 1.6, fat: 3.9, fiber: 0 },
    source: "web",
    addedDate: "2026-04-01"
  },
  {
    id: "pizza-hut-hawaienne",
    name: "Pizza Hawaienne",
    brand: "Pizza Hut",
    per100g: { kcal: 186.6, prot: 8.0, carbs: 21.4, fat: 6.7, fiber: 1.4 },
    source: "web",
    addedDate: "2026-04-01"
  }
];

// Meal log - each entry is one meal occasion
const MEAL_LOG = [
  {
    id: "2026-04-01-001",
    date: "2026-04-01",
    meal: "desayuno",
    items: [
      { foodId: "frittata-light", name: "Frittata Light", grams: 110, kcal: 150.3, prot: 13.1, carbs: 2.8, fat: 9.7 },
      { foodId: "danone-cottage-cheese", name: "Cottage Cheese Danone", grams: 50, kcal: 45.0, prot: 6.0, carbs: 0.8, fat: 2.0 },
      { foodId: "wasa-leger", name: "Wasa Leger (1 tartine)", grams: 9.6, kcal: 32.4, prot: 0.9, carbs: 6.0, fat: 0.1 },
      { foodId: "eafit-pure-isolate-vanille", name: "Proteina EAFit Vanille", grams: 40, kcal: 146.4, prot: 34.4, carbs: 1.3, fat: 0.4 },
      { foodId: "alpro-noisette-gourmande", name: "Leche Alpro Noisette", grams: 80, kcal: 23.2, prot: 0.3, carbs: 2.6, fat: 1.3 }
    ],
    timestamp: "2026-04-01T21:45:00"
  },
  {
    id: "2026-04-01-002",
    date: "2026-04-01",
    meal: "desayuno",
    items: [
      { foodId: "pizza-hut-hawaienne", name: "Pizza Hut Hawaienne", grams: 250, kcal: 466.5, prot: 20.0, carbs: 53.5, fat: 16.8 }
    ],
    timestamp: "2026-04-01T22:10:00"
  }
];
