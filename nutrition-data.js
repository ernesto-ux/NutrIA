// NutrIA - Nutrition Tracker Data
// Updated by Claude Code via /log-food skill
// DO NOT EDIT MANUALLY - use /log-food to add meals

const DATA_TIMESTAMP = "2026-04-07T11:00:00 Europe/Paris";

const NUTRITION_CONFIG = {
  targets: { kcal: 1770, prot: 190, carbs: 140, fat: 50 },
  targetsAdri: { kcal: 1285, prot: 120, carbs: 100, fat: 45 },
  meals: ["desayuno", "almuerzo", "cena", "snack"],
  mealLabels: { desayuno: "Desayuno", almuerzo: "Almuerzo", cena: "Cena", snack: "Snack" },
  mealIcons: { desayuno: "\u{1F963}", almuerzo: "\u{1F372}", cena: "\u{1F319}", snack: "\u{1F34E}" },
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
    id: "mantequilla-de-mani-menguys",
    name: "Mantequilla de Mani (sin azucar)",
    brand: "Recetario",
    per100g: { kcal: 588, prot: 25, carbs: 20, fat: 50, fiber: 6 },
    totalG: 0,
    source: "recetario",
    addedDate: "2026-04-06"
  },
  {
    id: "pancakes-de-proteina-adri-v2",
    name: "Pancakes de Proteina Adri V2",
    brand: "Recetario",
    per100g: { kcal: 156.3, prot: 18.3, carbs: 7.9, fat: 6.1, fiber: 0 },
    totalG: 350,
    source: "recetario",
    addedDate: "2026-04-07"
  },
  // Protein Packed Banana Peanut Butter — claras, whey, banana, cottage, miel, aceite oliva
  {
    id: "protein-packed-banana-pb",
    name: "Protein Packed Banana Peanut Butter",
    brand: "Recetario",
    per100g: { kcal: 99.7, prot: 12.6, carbs: 8.9, fat: 1.7, fiber: 0.3 },
    totalG: 348,
    source: "recetario",
    addedDate: "2026-04-06"
  },
  // Beef & Green Beans Pasta — served in 2 bowls
  {
    id: "beef-green-beans-pasta-bowl",
    name: "Beef & Green Beans Pasta (pasta + salsa)",
    brand: "Recetario",
    per100g: { kcal: 159.2, prot: 5.2, carbs: 29.5, fat: 1.9, fiber: 0.5 },
    totalG: 710,
    source: "recetario",
    addedDate: "2026-04-06"
  },
  {
    id: "beef-green-beans-meat-bowl",
    name: "Beef & Green Beans (carne + ejotes + cebolla)",
    brand: "Recetario",
    per100g: { kcal: 145.9, prot: 12.6, carbs: 5.0, fat: 8.5, fiber: 1.2 },
    totalG: 700,
    source: "recetario",
    addedDate: "2026-04-06"
  },
  // Ingredients: Huevo (1/2) (25g), Ricotta (25g), Cottage Cheese (50g), Pechuga Pollo Asado (30g), Cracker Wasa Leger (9.6g), Salsa de Aguacate (30g)
  {
    id: "cena-de-cracker-con-huevo-ricotta-cottage-pollo-y-salsa-de-aguacate",
    name: "Cena de cracker con huevo, ricotta, cottage, pollo y salsa de aguacate",
    brand: "Recetario",
    per100g: { kcal: 151.7, prot: 13.5, carbs: 6.2, fat: 8.1, fiber: 0 },
    totalG: 169.6,
    source: "recetario",
    addedDate: "2026-04-05"
  },
  {
    id: "frittata-light",
    name: "Frittata Light",
    brand: "Recetario",
    per100g: { kcal: 136.6, prot: 11.9, carbs: 2.5, fat: 8.8, fiber: 0.3 },
    totalG: 350,
    source: "recetario",
    addedDate: "2026-04-01"
  },
  {
    id: "pesto-albahaca-light-feta",
    name: "Pesto de Albahaca Light con Feta",
    brand: "Recetario",
    per100g: { kcal: 185.6, prot: 3.9, carbs: 1.8, fat: 18.0, fiber: 0.6 },
    totalG: 90,
    source: "recetario",
    addedDate: "2026-04-01"
  },
  {
    id: "lentejas-carne-vegetales",
    name: "Lentejas con Carne y Vegetales",
    brand: "Recetario",
    per100g: { kcal: 100.1, prot: 7.6, carbs: 12.1, fat: 2.6, fiber: 1.8 },
    totalG: 2500,
    source: "recetario",
    addedDate: "2026-04-01"
  },
  {
    id: "spanakopita",
    name: "Spanakopita",
    brand: "Recetario",
    per100g: { kcal: 139.8, prot: 6.1, carbs: 6.7, fat: 10.1, fiber: 0.9 },
    totalG: 1400,
    source: "recetario",
    addedDate: "2026-04-01"
  },
  {
    id: "omelette-ligera-jamon",
    name: "Omelette Ligera con Jamon",
    brand: "Recetario",
    per100g: { kcal: 114.7, prot: 13.3, carbs: 1.3, fat: 6.0, fiber: 0 },
    totalG: 109,
    source: "recetario",
    addedDate: "2026-04-01"
  },
  {
    id: "frittata-ranchera",
    name: "Frittata Ranchera",
    brand: "Recetario",
    per100g: { kcal: 104.7, prot: 8.4, carbs: 2.9, fat: 6.6, fiber: 0.5 },
    totalG: 296,
    source: "recetario",
    addedDate: "2026-04-02"
  },
  {
    id: "omelette-cottage-salmon",
    name: "Omelette au Cottage, Salmon, Pimiento y Espinacas",
    brand: "Recetario",
    per100g: { kcal: 99.0, prot: 10.3, carbs: 2.4, fat: 5.3, fiber: 0.8 },
    totalG: 495,
    source: "recetario",
    addedDate: "2026-04-02"
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
    name: "Tartine Croustillante Leger (1 tranche = 9.6g)",
    brand: "Wasa",
    per100g: { kcal: 338, prot: 9, carbs: 62, fat: 1.5, fiber: 22 },
    unitWeight: 9.6, unitLabel: "tranche",
    perUnit: { kcal: 32.4, prot: 0.9, carbs: 6.0, fat: 0.1, fiber: 2.1 },
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
  },
  {
    id: "fleury-michon-tendre-poulet-roti",
    name: "Tendre Poulet Roti",
    brand: "Fleury Michon",
    per100g: { kcal: 108, prot: 20, carbs: 0.5, fat: 2.9, fiber: 0 },
    source: "web",
    addedDate: "2026-04-01"
  },
  {
    id: "siggis-skyr-nature",
    name: "Skyr Nature",
    brand: "Siggis",
    per100g: { kcal: 63, prot: 11, carbs: 4.0, fat: 0.2, fiber: 0 },
    source: "web",
    addedDate: "2026-04-01"
  },
  {
    id: "fresas-frescas",
    name: "Fresas Frescas",
    brand: "",
    per100g: { kcal: 32, prot: 0.7, carbs: 7.7, fat: 0.3, fiber: 2.0 },
    source: "web",
    addedDate: "2026-04-01"
  },
  {
    id: "melon-fresco",
    name: "Melon Fresco",
    brand: "",
    per100g: { kcal: 34, prot: 0.8, carbs: 8.2, fat: 0.2, fiber: 0.9 },
    source: "web",
    addedDate: "2026-04-01"
  },
  {
    id: "ricotta-casa-azzurra",
    name: "Ricotta Casa Azzurra",
    brand: "Casa Azzurra",
    per100g: { kcal: 174, prot: 11, carbs: 3, fat: 13, fiber: 0 },
    source: "web",
    addedDate: "2026-04-02"
  },
  {
    id: "aguacate-fresco",
    name: "Aguacate Fresco",
    brand: "",
    per100g: { kcal: 160, prot: 2, carbs: 8.5, fat: 14.7, fiber: 6.7 },
    source: "web",
    addedDate: "2026-04-02"
  },
  {
    id: "semillas-chia",
    name: "Semillas de Chia",
    brand: "",
    per100g: { kcal: 486, prot: 17, carbs: 42, fat: 31, fiber: 34 },
    source: "web",
    addedDate: "2026-04-02"
  },
  {
    id: "miel-abeja",
    name: "Miel de Abeja",
    brand: "",
    per100g: { kcal: 304, prot: 0.3, carbs: 82, fat: 0, fiber: 0 },
    source: "web",
    addedDate: "2026-04-02"
  },
  {
    id: "avellanas",
    name: "Avellanas",
    brand: "",
    per100g: { kcal: 628, prot: 15, carbs: 17, fat: 61, fiber: 10 },
    source: "web",
    addedDate: "2026-04-02"
  },
  {
    id: "huevo-entero",
    name: "Huevo Entero",
    brand: "",
    per100g: { kcal: 155, prot: 13, carbs: 1.1, fat: 11, fiber: 0 },
    unitWeight: 50,
    unitLabel: "huevo",
    source: "web",
    addedDate: "2026-04-02"
  },
  {
    id: "clara-huevo",
    name: "Clara de Huevo",
    brand: "",
    per100g: { kcal: 52, prot: 11, carbs: 0.7, fat: 0.2, fiber: 0 },
    unitWeight: 33,
    unitLabel: "clara",
    source: "web",
    addedDate: "2026-04-02"
  },
  {
    id: "aceite-oliva",
    name: "Aceite de Oliva",
    brand: "",
    per100g: { kcal: 884, prot: 0, carbs: 0, fat: 100, fiber: 0 },
    source: "web",
    addedDate: "2026-04-02"
  },
  {
    id: "queso-maduro-espanol",
    name: "Queso Maduro Español",
    brand: "",
    per100g: { kcal: 400, prot: 25, carbs: 0.5, fat: 33, fiber: 0 },
    source: "web",
    addedDate: "2026-04-02"
  },
  {
    id: "mantequilla-salada",
    name: "Mantequilla Salada",
    brand: "",
    per100g: { kcal: 717, prot: 0.9, carbs: 0.1, fat: 81, fiber: 0 },
    source: "web",
    addedDate: "2026-04-02"
  },
  {
    id: "jamon-porc-fleury-michon",
    name: "Jambon de Porc",
    brand: "Fleury Michon",
    per100g: { kcal: 115, prot: 20, carbs: 1, fat: 3.5, fiber: 0 },
    source: "web",
    addedDate: "2026-04-02"
  },
  {
    id: "salsa-mexicana-casera",
    name: "Salsa Mexicana Casera",
    brand: "Recetario",
    per100g: { kcal: 40, prot: 1, carbs: 5.5, fat: 1.5, fiber: 1.2 },
    source: "recetario",
    addedDate: "2026-04-02"
  },
  {
    id: "cilantro-fresco",
    name: "Cilantro Fresco",
    brand: "",
    per100g: { kcal: 23, prot: 2.1, carbs: 3.7, fat: 0.5, fiber: 2.8 },
    source: "web",
    addedDate: "2026-04-02"
  },
  {
    id: "hipro-banane",
    name: "HiPro Banane",
    brand: "Danone",
    per100g: { kcal: 70, prot: 12.4, carbs: 4.0, fat: 0.4, fiber: 0 },
    unitWeight: 160, unitLabel: "pot",
    source: "web",
    addedDate: "2026-04-02"
  },
  {
    id: "hipro-vanille",
    name: "HiPro Vanille",
    brand: "Danone",
    per100g: { kcal: 77, prot: 10.2, carbs: 5.9, fat: 0.8, fiber: 0 },
    unitWeight: 160, unitLabel: "pot",
    source: "web",
    addedDate: "2026-04-02"
  },
  {
    id: "hipro-coco",
    name: "HiPro Coco",
    brand: "Danone",
    per100g: { kcal: 56, prot: 9.4, carbs: 3.7, fat: 0.4, fiber: 0 },
    unitWeight: 160, unitLabel: "pot",
    source: "web",
    addedDate: "2026-04-02"
  },
  {
    id: "sojasun-nature",
    name: "Dessert Soja Nature",
    brand: "Sojasun",
    per100g: { kcal: 41, prot: 4.6, carbs: 0, fat: 2.4, fiber: 0.7 },
    unitWeight: 100, unitLabel: "pot",
    source: "web",
    addedDate: "2026-04-02"
  },
  {
    id: "jeff-de-bruges-oeuf-paques",
    name: "Petit Oeuf de Pâques Fourré",
    brand: "Jeff de Bruges",
    per100g: { kcal: 538, prot: 6.7, carbs: 52, fat: 33, fiber: 0 },
    unitWeight: 13, unitLabel: "huevo",
    source: "web",
    addedDate: "2026-04-03"
  },
  {
    id: "mere-poulard-biscuit-beurre",
    name: "Biscuit Pur Beurre",
    brand: "La Mère Poulard",
    per100g: { kcal: 501, prot: 6.8, carbs: 70, fat: 21.9, fiber: 1.5 },
    unitWeight: 15.6, unitLabel: "galleta",
    source: "user",
    addedDate: "2026-04-03"
  },
  // === RECETARIO (added 2026-04-03) ===
  {
    id: "ensalada-pollo-quinoa-aderezo-cilantro",
    name: "Ensalada de Pollo con Quinoa y Aderezo Fromage Blanc Cilantro",
    brand: "Recetario",
    per100g: { kcal: 100.1, prot: 14.4, carbs: 3.6, fat: 3.0, fiber: 1.2 },
    totalG: 1177,
    source: "recetario",
    addedDate: "2026-04-03",
    notes: "500g pollo horneado (pimentón, cúrcuma, especias), ensalada verde, tomate cherry, quinoa cocida, endive, aderezo licuado (fromage blanc, aguacate, cilantro, limón persico, aceite oliva, vinagre vino)"
  },
  {
    id: "aderezo-fromage-blanc-aguacate-cilantro",
    name: "Aderezo de Fromage Blanc, Aguacate y Cilantro Limón",
    brand: "Recetario",
    per100g: { kcal: 89.0, prot: 2.6, carbs: 4.7, fat: 7.2, fiber: 1.5 },
    totalG: 197,
    source: "recetario",
    addedDate: "2026-04-03"
  },
  // === PRODUCTOS GENÉRICOS (added 2026-04-03) ===
  {
    id: "pollo-pechuga-horneada",
    name: "Pechuga de Pollo Horneada",
    brand: "",
    per100g: { kcal: 165, prot: 31, carbs: 0, fat: 3.6, fiber: 0 },
    source: "web",
    addedDate: "2026-04-03"
  },
  {
    id: "tomate-cherry",
    name: "Tomate Cherry",
    brand: "",
    per100g: { kcal: 18, prot: 0.9, carbs: 3.9, fat: 0.2, fiber: 1.2 },
    source: "web",
    addedDate: "2026-04-03"
  },
  {
    id: "quinoa-cocida",
    name: "Quinoa Cocida",
    brand: "",
    per100g: { kcal: 120, prot: 4.4, carbs: 21.3, fat: 1.9, fiber: 2.8 },
    source: "web",
    addedDate: "2026-04-03"
  },
  {
    id: "endive",
    name: "Endive",
    brand: "",
    per100g: { kcal: 17, prot: 1.3, carbs: 3.4, fat: 0.2, fiber: 3.1 },
    source: "web",
    addedDate: "2026-04-03"
  },
  {
    id: "galleta-oreo-sin-crema",
    name: "Galleta Oreo (solo wafer, sin crema)",
    brand: "Oreo",
    per100g: { kcal: 471, prot: 2.9, carbs: 73.5, fat: 20.6, fiber: 3.0 },
    unitWeight: 7.5, unitLabel: "galleta",
    source: "web",
    addedDate: "2026-04-03"
  },
  // === RECETARIO (added 2026-04-03) ===
  {
    id: "oreo-protein-shake",
    name: "Oreo Protein Shake",
    brand: "Recetario",
    per100g: { kcal: 92.6, prot: 5.9, carbs: 10.6, fat: 3.2, fiber: 0.5 },
    totalG: 400,
    source: "recetario",
    addedDate: "2026-04-03",
    notes: "50g galleta oreo sin crema, 150g leche alpro noisette, 25g proteina eafit vainilla, 170g agua, 4 cubos hielo. Yield ~400g"
  },
  // === RECETARIO (added 2026-04-05) ===
  {
    id: "cheesecake-oreo-beurre",
    name: "Cheesecake Oreo & Beurre (Adri)",
    brand: "Recetario",
    per100g: { kcal: 352.9, prot: 5.8, carbs: 28.2, fat: 24.4, fiber: 0.3 },
    totalG: 1550,
    source: "recetario",
    addedDate: "2026-04-05",
    notes: "Relleno: 750g Philadelphia, 150g azucar, 20g harina, 4 huevos, 125ml crema 5%. Base oreo: 165g oreo sin crema + 75g beurre. Base beurre: 60g Mere Poulard + 100g LU Petit Beurre + 75g beurre. 8 porciones. Receta de Adri"
  },
  {
    id: "cheesecake-light-oreo-beurre",
    name: "Cheesecake Light Oreo & Beurre",
    brand: "Recetario",
    per100g: { kcal: 211.2, prot: 7.8, carbs: 16.2, fat: 12.8, fiber: 0.3 },
    totalG: 1230,
    source: "recetario",
    addedDate: "2026-04-05",
    notes: "Relleno: 500g Philly Light, 200g Skyr, 30g azucar + 60g erythritol, 20g maizena, 3 huevos + 2 claras, 125ml crema 5%. Base oreo: 80g oreo + 30g beurre. Base beurre: 30g MP + 50g LU + 30g beurre. 8 porciones"
  },
  {
    id: "lu-petit-beurre",
    name: "Veritable Petit Beurre",
    brand: "LU",
    per100g: { kcal: 435, prot: 7.5, carbs: 75, fat: 11, fiber: 2.5 },
    source: "web",
    addedDate: "2026-04-05"
  },
  {
    id: "pizza-regine-pizzou",
    name: "Pizza Régine Pizzou (masa fina, jamon, hongos, mozza ligera)",
    brand: "Pizzou",
    per100g: { kcal: 155, prot: 10.4, carbs: 19.2, fat: 4.6, fiber: 1.5 },
    source: "estimado",
    addedDate: "2026-04-06"
  },
  {
    id: "salmorejo-alvalle",
    name: "Salmorejo",
    brand: "Alvalle",
    per100g: { kcal: 54, prot: 1.2, carbs: 5.8, fat: 3.0, fiber: 0.5 },
    source: "web",
    addedDate: "2026-04-06"
  },
  // === PRODUCTOS GENÉRICOS (added 2026-04-05) ===
  {
    id: "coca-cola-zero",
    name: "Coca-Cola Zero",
    brand: "Coca-Cola",
    per100g: { kcal: 0.4, prot: 0, carbs: 0, fat: 0, fiber: 0 },
    source: "web",
    addedDate: "2026-04-05"
  },
  {
    id: "charcuterie-variada",
    name: "Charcuterie Variada (jambon, coppa, saucisson)",
    brand: "",
    per100g: { kcal: 250, prot: 18, carbs: 1, fat: 20, fiber: 0 },
    source: "web",
    addedDate: "2026-04-05"
  },
  {
    id: "mozzarella-mini-billes",
    name: "Mini Mozzarella (billes)",
    brand: "",
    per100g: { kcal: 280, prot: 17, carbs: 1, fat: 22, fiber: 0 },
    source: "web",
    addedDate: "2026-04-05"
  },
  {
    id: "toast-feuillete-tomate-seche",
    name: "Toast Feuilleté Tomate Séché",
    brand: "",
    per100g: { kcal: 445, prot: 6.5, carbs: 40, fat: 29, fiber: 1.5 },
    unitWeight: 15, unitLabel: "toast",
    source: "web",
    addedDate: "2026-04-05"
  },
  {
    id: "chips-classiques",
    name: "Chips Classiques",
    brand: "",
    per100g: { kcal: 536, prot: 6, carbs: 50, fat: 35, fiber: 4 },
    source: "web",
    addedDate: "2026-04-05"
  },
  {
    id: "vin-blanc-chablis",
    name: "Vin Blanc Chablis",
    brand: "",
    per100g: { kcal: 70, prot: 0, carbs: 0.8, fat: 0, fiber: 0 },
    source: "web",
    addedDate: "2026-04-05"
  },
  {
    id: "champagne-brut",
    name: "Champagne Brut",
    brand: "Mumm",
    per100g: { kcal: 80, prot: 0, carbs: 1.2, fat: 0, fiber: 0 },
    source: "web",
    addedDate: "2026-04-05"
  },
  {
    id: "pain-baguette",
    name: "Pain Baguette",
    brand: "",
    per100g: { kcal: 274, prot: 8.5, carbs: 55, fat: 1.3, fiber: 2.5 },
    source: "web",
    addedDate: "2026-04-05"
  },
  {
    id: "kiwi-fresco",
    name: "Kiwi Fresco",
    brand: "",
    per100g: { kcal: 61, prot: 1.1, carbs: 14.7, fat: 0.5, fiber: 3.0 },
    unitWeight: 75, unitLabel: "kiwi",
    source: "web",
    addedDate: "2026-04-05",
    notes: "1 kiwi ~85g con piel, ~75g pelado. Medio kiwi ~38g"
  },
  {
    id: "coulis-fraises-maison",
    name: "Coulis de Fraises Maison",
    brand: "",
    per100g: { kcal: 110, prot: 0.7, carbs: 27.5, fat: 0.3, fiber: 1.0 },
    source: "web",
    addedDate: "2026-04-05"
  },
  // === PRODUCTOS COMERCIALES (added 2026-04-06) ===
  {
    id: "creme-halva-chocolate-cookie",
    name: "Halva Sesame Chocolate & White Chocolate Cookie",
    brand: "Crème London",
    per100g: { kcal: 480, prot: 7, carbs: 52, fat: 25, fiber: 1.5 },
    unitWeight: 92, unitLabel: "cookie",
    source: "web",
    addedDate: "2026-04-06",
    notes: "Estimated ~480kcal/100g from similar premium halva/chocolate cookies. Weight avg of 3oz/3.5oz = 92g per cookie"
  },
  {
    id: "mostaza-amarilla",
    name: "Mostaza Amarilla",
    brand: "",
    per100g: { kcal: 66, prot: 4, carbs: 4, fat: 3.3, fiber: 2 },
    source: "web",
    addedDate: "2026-04-06"
  },
  {
    id: "harissa-paste",
    name: "Harissa (pate de piment)",
    brand: "",
    per100g: { kcal: 100, prot: 3.5, carbs: 6, fat: 7, fiber: 3 },
    source: "web",
    addedDate: "2026-04-06"
  },
  {
    id: "arroz-bomba-cocido",
    name: "Arroz Bomba Cocido",
    brand: "",
    per100g: { kcal: 130, prot: 2.7, carbs: 28, fat: 0.3, fiber: 0.4 },
    source: "web",
    addedDate: "2026-04-06"
  },
  // === RECETARIO (added 2026-04-06) ===
  {
    id: "tortillarepupusa-ricotta",
    name: "Tortillarepupusa con Ricotta",
    brand: "Recetario",
    per100g: { kcal: 307.8, prot: 12.1, carbs: 39.6, fat: 10.6, fiber: 0.3 },
    totalG: 197.5,
    source: "recetario",
    addedDate: "2026-04-06",
    notes: "100g harina trigo + 70g ricotta + 25g queso curado espanol, frito en 1/2 tsp aceite oliva (2.5g). Yield ~197.5g"
  },
  {
    id: "cookie-dough-adri-choc-oscuro",
    name: "Cookies Adri Cariño (Choc Oscuro)",
    brand: "Recetario",
    per100g: { kcal: 449.3, prot: 4.9, carbs: 56.4, fat: 22.7, fiber: 1.4 },
    totalG: 1103,
    source: "recetario",
    addedDate: "2026-04-06",
    notes: "226g beurre, 3/4 taza azucar morena, 1/2 taza azucar blanca, 2 huevos, 1 tsp bicarbonato, 1 tsp maizena, 1 3/4 taza harina, 1 taza cake flour, 1 taza chispas choc oscuro. ~13 cookies de 3oz (85g)"
  },
  {
    id: "pescado-salsa-limon-alcaparras",
    name: "Pescado a la Salsa de Limon y Alcaparras",
    brand: "Recetario",
    per100g: { kcal: 102.8, prot: 15.1, carbs: 1.2, fat: 3.8, fiber: 0.2 },
    totalG: 650,
    source: "recetario",
    addedDate: "2026-04-06",
    notes: "500g colin salteado en 3 tsp aceite oliva, ajo, 35g alcaparras, 1.5 limones, 1 tsp maizena, perejil, pimienta, sal, noisette mantequilla, agua para diluir. Yield ~650g"
  },
  {
    id: "cafe-negro",
    name: "Café Negro (sin azucar)",
    brand: "",
    per100g: { kcal: 2, prot: 0.1, carbs: 0, fat: 0, fiber: 0 },
    unitWeight: 240, unitLabel: "taza",
    source: "web",
    addedDate: "2026-04-07"
  },
  // === PRODUCTOS (added 2026-04-07 - Adriana) ===
  {
    id: "blueberries-frescas",
    name: "Blueberries (Myrtilles) Frescas",
    brand: "",
    per100g: { kcal: 57, prot: 0.7, carbs: 14.5, fat: 0.3, fiber: 2.4 },
    source: "web",
    addedDate: "2026-04-07"
  },
  {
    id: "baiocchi-pistachio",
    name: "Baiocchi Pistachio Snack",
    brand: "Mulino Bianco",
    per100g: { kcal: 505, prot: 9, carbs: 59, fat: 25, fiber: 3.4 },
    unitWeight: 9.3, unitLabel: "galleta",
    source: "web",
    addedDate: "2026-04-07"
  },
  {
    id: "rigatoni-cocida",
    name: "Rigatoni Cocida",
    brand: "",
    per100g: { kcal: 157, prot: 5.5, carbs: 31, fat: 0.9, fiber: 1.8 },
    source: "web",
    addedDate: "2026-04-07"
  },
  {
    id: "beaufort-rape",
    name: "Beaufort Rapé",
    brand: "",
    per100g: { kcal: 405, prot: 27, carbs: 0, fat: 33, fiber: 0 },
    source: "web",
    addedDate: "2026-04-07"
  },
  {
    id: "pimiento-rojo-crudo",
    name: "Pimiento Rojo Crudo",
    brand: "",
    per100g: { kcal: 31, prot: 1, carbs: 6, fat: 0.3, fiber: 2.1 },
    source: "web",
    addedDate: "2026-04-07"
  },
  {
    id: "jamon-fm-25-moins-sel",
    name: "Jambon Le Supérieur -25% Sel",
    brand: "Fleury Michon",
    per100g: { kcal: 115, prot: 20, carbs: 1, fat: 3.5, fiber: 0 },
    source: "web",
    addedDate: "2026-04-07",
    notes: "Macros identiques au jambon classique FM, seul le sel est réduit de 25%"
  },
  {
    id: "banana-fresca",
    name: "Banana (Plátano) Fresca",
    brand: "",
    per100g: { kcal: 89, prot: 1.1, carbs: 22.8, fat: 0.3, fiber: 2.6 },
    unitWeight: 120, unitLabel: "banana",
    source: "web",
    addedDate: "2026-04-07"
  },
  {
    id: "mandarina-fresca",
    name: "Mandarina / Clementina Fresca",
    brand: "",
    per100g: { kcal: 47, prot: 0.8, carbs: 12, fat: 0.3, fiber: 1.7 },
    source: "web",
    addedDate: "2026-04-07"
  },
  {
    id: "mango-fresco",
    name: "Mango Fresco",
    brand: "",
    per100g: { kcal: 60, prot: 0.8, carbs: 15, fat: 0.4, fiber: 1.6 },
    source: "web",
    addedDate: "2026-04-07"
  },
  {
    id: "maasdam-queso",
    name: "Maasdam (Queso)",
    brand: "",
    per100g: { kcal: 348, prot: 25, carbs: 0, fat: 27, fiber: 0 },
    source: "web",
    addedDate: "2026-04-07"
  }
];

// Meal log - migrated to local-meals.json (GitHub-only storage)
const MEAL_LOG = [];

// Activity log - gym sessions and step data
// Steps from Samsung Health, gym from Apple Watch/tracker
const ACTIVITY_LOG = [
  { date: "2026-03-29", steps: 3000, stepsKcal: 50,  gym: null, gymKcal: 0,   notes: "estimado pasos" },
  { date: "2026-03-30", steps: 200,  stepsKcal: 0,   gym: null, gymKcal: 0,   notes: "lunes casi sin pasos" },
  { date: "2026-03-31", steps: 4000, stepsKcal: 100,  gym: "full body", gymKcal: 744, notes: "" },
  { date: "2026-04-01", steps: 3500, stepsKcal: 75,  gym: null, gymKcal: 0,   notes: "" },
  { date: "2026-04-02", steps: 3000, stepsKcal: 50,  gym: "full body", gymKcal: 466, notes: "" },
  { date: "2026-04-03", steps: 3500, stepsKcal: 75,  gym: null, gymKcal: 0,   notes: "" },
  { date: "2026-04-04", steps: 6000, stepsKcal: 200, gym: "gym", gymKcal: 370, notes: "apero + gym" },
  { date: "2026-04-05", steps: 12954, stepsKcal: 400, gym: "gym", gymKcal: 541, notes: "domingo" },
  { date: "2026-04-06", steps: 11001, stepsKcal: 350, gym: "gym", gymKcal: 656, notes: "" },
  { date: "2026-04-07", steps: 6755, stepsKcal: 175, gym: null, gymKcal: 0, notes: "" }
];

// Daily energy balance (sabado a sabado: 29 mar - 4 abr + dom 5)
// intake: from MEAL_LOG or corrected from NutrIA dashboard
// tdee: BMR 1819 x 1.2 = 2182 (sedentary base)
// stepsKcal: extra calories from steps above sedentary baseline (~2000 steps/day)
// gymKcal: active calories from gym sessions
// balance: intake - tdee - stepsKcal - gymKcal (negative = deficit)
const DAILY_BALANCE = [
  // Semana 29 mar - 5 abr
  { date: "2026-03-29", day: "Dom", intake: 1688, tdee: 2182, stepsKcal: 50,  gymKcal: 0,   balance: -544 },
  { date: "2026-03-30", day: "Lun", intake: 1398, tdee: 2182, stepsKcal: 0,   gymKcal: 0,   balance: -784 },
  { date: "2026-03-31", day: "Mar", intake: 1190, tdee: 2182, stepsKcal: 100, gymKcal: 744, balance: -1836 },
  { date: "2026-04-01", day: "Mie", intake: 1158, tdee: 2182, stepsKcal: 75,  gymKcal: 0,   balance: -1099 },
  { date: "2026-04-02", day: "Jue", intake: 1695, tdee: 2182, stepsKcal: 50,  gymKcal: 466, balance: -1003 },
  { date: "2026-04-03", day: "Vie", intake: 1193, tdee: 2182, stepsKcal: 75,  gymKcal: 0,   balance: -1064 },
  { date: "2026-04-04", day: "Sab", intake: 2564, tdee: 2182, stepsKcal: 200, gymKcal: 370, balance: -188 },
  { date: "2026-04-05", day: "Dom", intake: 1459, tdee: 2182, stepsKcal: 400, gymKcal: 541, balance: -1664, notes: "" }
];

// Weight & body composition log - from Renpho scale or manual entry
// Fields match Renpho app output
const WEIGHT_LOG = [
  {
    date: "2026-04-01",
    weight: 89.0,
    bmi: 29.1,
    bodyFat: null,
    fatFreeWeight: null,
    subcutFat: null,
    visceralFat: null,
    bodyWater: null,
    skeletalMuscle: null,
    muscleMass: null,
    boneMass: null,
    bmr: null,
    metabolicAge: null,
    source: "manual",
    notes: "peso inicial estimado"
  },
  {
    date: "2026-04-06",
    weight: 87.6,
    bmi: 28.6,
    bodyFat: null, fatFreeWeight: null, subcutFat: null, visceralFat: null,
    bodyWater: null, skeletalMuscle: null, muscleMass: null, boneMass: null,
    bmr: null, metabolicAge: null,
    source: "manual",
    notes: "AM"
  }
];
