// NutrIA - Nutrition Tracker Data
// Updated by Claude Code via /log-food skill
// DO NOT EDIT MANUALLY - use /log-food to add meals

const DATA_TIMESTAMP = "2026-04-14T13:30:00 Europe/Paris";

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
  // Quiche de Brocoli con Salmon y Ricotta — 4 claras, 2 huevos, 90g ricotta, 1 brocoli pequeño, 1 cebolla mediana, 2 filetes salmon, 3 cdtas aceite. Total ~986g, 4 porciones.
  {
    id: "quiche-brocoli-salmon-ricotta",
    name: "Quiche de Brocoli con Salmon y Ricotta",
    brand: "Recetario",
    per100g: { kcal: 118.6, prot: 9.7, carbs: 3.6, fat: 7.2, fiber: 0.7 },
    totalG: 986,
    portions: 4,
    source: "recetario",
    addedDate: "2026-04-13"
  },
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
    per100g: { kcal: 150, prot: 8, carbs: 1.2, fat: 12, fiber: 0 },
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
  },
  {
    id: "queso-curado-hacendado",
    name: "Queso Curado Mezcla",
    brand: "Hacendado",
    per100g: { kcal: 431, prot: 25, carbs: 1.8, fat: 36, fiber: 0 },
    source: "web",
    addedDate: "2026-04-08"
  },
  {
    id: "rumsteck-boeuf-cuit",
    name: "Rumsteck de Boeuf (cuit)",
    brand: "Generic",
    per100g: { kcal: 120, prot: 25, carbs: 0, fat: 2, fiber: 0 },
    source: "web",
    addedDate: "2026-04-08"
  },
  {
    id: "brocoli-cuit",
    name: "Brocoli (cuit)",
    brand: "Generic",
    per100g: { kcal: 35, prot: 3, carbs: 4, fat: 0.4, fiber: 2.6 },
    source: "web",
    addedDate: "2026-04-08"
  },
  {
    id: "siggis-skyr-raspberry",
    name: "Skyr Raspberry",
    brand: "Siggis",
    per100g: { kcal: 73, prot: 10, carbs: 8, fat: 0.2, fiber: 0 },
    unitWeight: 140, unitLabel: "pot",
    source: "web",
    addedDate: "2026-04-08"
  },
  {
    id: "gerble-cookie-cacao-pepites-ss",
    name: "Cookie Cacao Pépites Sans Sucres",
    brand: "Gerblé",
    per100g: { kcal: 518, prot: 8, carbs: 61, fat: 18, fiber: 0 },
    unitWeight: 10.8, unitLabel: "cookie",
    source: "web",
    addedDate: "2026-04-08"
  },
  // === PRODUCTOS (added 2026-04-09) ===
  {
    id: "wasa-fibre",
    name: "Wasa Fibre",
    brand: "Wasa",
    per100g: { kcal: 333, prot: 13, carbs: 46, fat: 5, fiber: 26 },
    unitWeight: 11.4, unitLabel: "tranche",
    source: "web",
    addedDate: "2026-04-09"
  },
  {
    id: "hipro-blueberry",
    name: "HiPro Myrtille (Blueberry)",
    brand: "Danone",
    per100g: { kcal: 53, prot: 9.4, carbs: 3.8, fat: 0, fiber: 0 },
    unitWeight: 160, unitLabel: "pot",
    source: "web",
    addedDate: "2026-04-09"
  },
  {
    id: "bavette-cocida",
    name: "Bavette (Pasta Cocida)",
    brand: "",
    per100g: { kcal: 157, prot: 5.5, carbs: 31, fat: 0.9, fiber: 1.8 },
    source: "web",
    addedDate: "2026-04-09"
  },
  {
    id: "ejote-haricot-vert",
    name: "Ejote / Haricot Vert (cuit)",
    brand: "",
    per100g: { kcal: 31, prot: 1.8, carbs: 7, fat: 0.1, fiber: 3.4 },
    source: "web",
    addedDate: "2026-04-09"
  },
  {
    id: "cebolla-cruda",
    name: "Cebolla (cruda)",
    brand: "",
    per100g: { kcal: 40, prot: 1.1, carbs: 9.3, fat: 0.1, fiber: 1.7 },
    source: "web",
    addedDate: "2026-04-09"
  },
  {
    id: "aceite-sesamo",
    name: "Aceite de Sésamo",
    brand: "",
    per100g: { kcal: 884, prot: 0, carbs: 0, fat: 100, fiber: 0 },
    source: "web",
    addedDate: "2026-04-09"
  },
  {
    id: "salsa-soya",
    name: "Salsa de Soya",
    brand: "",
    per100g: { kcal: 53, prot: 8.1, carbs: 4.9, fat: 0.1, fiber: 0 },
    source: "web",
    addedDate: "2026-04-09"
  },
  {
    id: "maizena",
    name: "Maizena (Almidón de Maíz)",
    brand: "",
    per100g: { kcal: 381, prot: 0.3, carbs: 91, fat: 0.1, fiber: 0 },
    source: "web",
    addedDate: "2026-04-09"
  },
  {
    id: "chocolate-negro-90",
    name: "Chocolate Negro 90% Cacao",
    brand: "",
    per100g: { kcal: 592, prot: 10, carbs: 14, fat: 55, fiber: 11 },
    source: "web",
    addedDate: "2026-04-09"
  },
  {
    id: "fruits-rouges-mix",
    name: "Fruits Rouges Mix (fraises, framboises, myrtilles)",
    brand: "",
    per100g: { kcal: 40, prot: 0.8, carbs: 9, fat: 0.3, fiber: 2.5 },
    source: "web",
    addedDate: "2026-04-09"
  },
  {
    id: "pp-vanilla-protein",
    name: "PP Vanilla (Protein Powder)",
    brand: "Generic",
    per100g: { kcal: 375, prot: 80, carbs: 5, fat: 3, fiber: 0 },
    source: "web",
    addedDate: "2026-04-09",
    notes: "Generic vanilla whey protein powder"
  },
  {
    id: "leche-almendra",
    name: "Leche de Almendra (sin azúcar)",
    brand: "",
    per100g: { kcal: 13, prot: 0.4, carbs: 0.2, fat: 1.1, fiber: 0.2 },
    source: "web",
    addedDate: "2026-04-09"
  },
  {
    id: "tomate-triturado",
    name: "Tomate Triturado / Passata",
    brand: "",
    per100g: { kcal: 24, prot: 1, carbs: 4, fat: 0.2, fiber: 1 },
    source: "web",
    addedDate: "2026-04-09"
  },
  {
    id: "ciabatta-artesanal",
    name: "Ciabatta Pan Artesanal",
    brand: "",
    per100g: { kcal: 271, prot: 9, carbs: 50, fat: 3.5, fiber: 2.5 },
    source: "web",
    addedDate: "2026-04-09"
  },
  {
    id: "arroz-salteado",
    name: "Arroz Salteado (Stir-Fried Rice)",
    brand: "",
    per100g: { kcal: 150, prot: 3.2, carbs: 30, fat: 1.5, fiber: 0.4 },
    source: "web",
    addedDate: "2026-04-10"
  },
  {
    id: "mani-salado",
    name: "Maní Salado (Cacahuetes Tostados)",
    brand: "",
    per100g: { kcal: 585, prot: 24.5, carbs: 16.1, fat: 49.2, fiber: 8 },
    source: "web",
    addedDate: "2026-04-10"
  },
  {
    id: "spanakopita-light",
    name: "Spanakopita Light",
    brand: "Recetario",
    per100g: { kcal: 179.9, prot: 10.8, carbs: 6.6, fat: 12.1, fiber: 2.3 },
    totalG: 1250,
    source: "recetario",
    addedDate: "2026-04-11",
    notes: "150g feta Islos AOP brebis, 1kg espinaca congelada Picard, 18g aceite oliva, 27g mantequilla, 4 huevos, 4 claras, 375g ricotta Casa Azzurra (1.5 tarros), 6 hojas brick grande. Yield 1100g"
  },
  {
    id: "pan-banano-hp-chocolate",
    name: "Pan de Banano High Protein + Chocolate Oscuro",
    brand: "Recetario",
    per100g: { kcal: 223.5, prot: 9.3, carbs: 33.7, fat: 5.9, fiber: 1.5 },
    totalG: 743,
    source: "recetario",
    addedDate: "2026-04-11",
    notes: "300g banano maduro, 50g azucar blanca (4 cdas), 3 huevos, 1 cdita vainilla, 160g harina blanca, 1/4 cdita bicarbonato, 1/2 cdita canela, 30g proteina EAFit vanille, 45g chispas chocolate oscuro bio (1/4 taza). Yield ~743g"
  },
  {
    id: "almendras-enteras",
    name: "Almendras Enteras (Natural)",
    brand: "",
    per100g: { kcal: 576, prot: 21, carbs: 22, fat: 49, fiber: 12 },
    unitWeight: 1.2, unitLabel: "almendra",
    source: "web",
    addedDate: "2026-04-11"
  },
  {
    id: "eafit-pure-isolate-chocolat",
    name: "Pure Isolate Whey Chocolat",
    brand: "EAFit",
    per100g: { kcal: 354, prot: 81, carbs: 3.7, fat: 1.6, fiber: 3.3 },
    source: "web",
    addedDate: "2026-04-11"
  },
  {
    id: "patate-cuite",
    name: "Pomme de Terre (cuite)",
    brand: "",
    per100g: { kcal: 87, prot: 1.9, carbs: 20, fat: 0.1, fiber: 1.8 },
    source: "web",
    addedDate: "2026-04-11"
  },
  {
    id: "cuisse-poulet-cuite",
    name: "Cuisse de Poulet (cuite, sans peau, sans os)",
    brand: "",
    per100g: { kcal: 172, prot: 26, carbs: 0, fat: 7, fiber: 0 },
    source: "web",
    addedDate: "2026-04-11",
    notes: "300g con hueso ≈ 150g carne comestible (50%). Sin piel"
  },
  {
    id: "saumon-benny-kozy",
    name: "Saumon Benny (Kozy Paris)",
    brand: "Kozy Paris",
    per100g: { kcal: 160.3, prot: 8.2, carbs: 12.2, fat: 8.5, fiber: 0.5 },
    totalG: 340,
    source: "user",
    addedDate: "2026-04-11",
    notes: "Brioche 80g, saumon fumé 60g, huevo pochado 50g, espinacas 60g, salsa holandesa 30g. Total ~340g, 545 kcal"
  },
  {
    id: "girasoli-burrata-basilic-picard",
    name: "Girasoli Burrata Basilic",
    brand: "Picard",
    per100g: { kcal: 181, prot: 8.4, carbs: 25, fat: 4.8, fiber: 1.8 },
    source: "web",
    addedDate: "2026-04-12"
  },
  {
    id: "kebab-veau-maison",
    name: "Kebab Veau Fait Maison (carne sola)",
    brand: "",
    per100g: { kcal: 180, prot: 25, carbs: 1, fat: 8.5, fiber: 0 },
    source: "web",
    addedDate: "2026-04-12",
    notes: "Veau magro marinado (yogurt, poco aceite, especias), grillé maison. Sin pan ni salsa"
  },
  {
    id: "avena-cruda",
    name: "Avena en Hojuelas (cruda)",
    brand: "",
    per100g: { kcal: 389, prot: 16.9, carbs: 66.3, fat: 6.9, fiber: 10.6 },
    source: "web",
    addedDate: "2026-04-12"
  },
  {
    id: "cocoa-en-polvo",
    name: "Cocoa en Polvo (sin azucar)",
    brand: "",
    per100g: { kcal: 228, prot: 19.6, carbs: 57.9, fat: 13.7, fiber: 33.2 },
    source: "web",
    addedDate: "2026-04-12"
  },
  {
    id: "pancake-avena-chocolate-hp",
    name: "Pancake Avena de Chocolate High Protein",
    brand: "Recetario",
    per100g: { kcal: 115.8, prot: 13.3, carbs: 14.9, fat: 1.9, fiber: 2.8 },
    totalG: 245,
    source: "recetario",
    addedDate: "2026-04-12",
    notes: "30g avena cruda, 30g banano, 15g cocoa, 140ml agua, 30g eafit choc. TotalG = raw batter weight"
  },
  {
    id: "blueberries-frescas",
    name: "Blueberries (Arandanos) Frescos",
    brand: "",
    per100g: { kcal: 57, prot: 0.7, carbs: 14.5, fat: 0.3, fiber: 2.4 },
    source: "web",
    addedDate: "2026-04-12"
  },
  {
    id: "shake-strawberry-blueberry-protein",
    name: "Strawberry & Blueberry Protein Shake",
    brand: "Recetario",
    per100g: { kcal: 77.4, prot: 10.8, carbs: 6.1, fat: 1.3, fiber: 0.5 },
    totalG: 255,
    source: "recetario",
    addedDate: "2026-04-12",
    notes: "75ml kefir, 75ml skyr, 20g proteina eafit choc, 60g fresas, 25g blueberries"
  },
  {
    id: "quinoa-cocida",
    name: "Quinoa Cocida",
    brand: "",
    per100g: { kcal: 120, prot: 4.4, carbs: 21.3, fat: 1.9, fiber: 2.8 },
    source: "web",
    addedDate: "2026-04-12"
  },
  {
    id: "ejotes-cocidos",
    name: "Ejotes / Judias Verdes (cocidos)",
    brand: "",
    per100g: { kcal: 35, prot: 1.9, carbs: 7.9, fat: 0.3, fiber: 3.4 },
    source: "web",
    addedDate: "2026-04-12"
  },
  {
    id: "holy-cookie-pistachio",
    name: "Holy Cookie Hot Chocolate Pistachio",
    brand: "Holy Cookie Paris",
    per100g: { kcal: 493, prot: 11.3, carbs: 35.4, fat: 33.0, fiber: 2.5 },
    totalG: 180,
    source: "user",
    addedDate: "2026-04-12",
    notes: "Cookie choc noir Valrhona + pate pistache 100% + eclats pistache + fleur de sel. Estimado visual"
  },
  {
    id: "wasa-fibre",
    name: "Tartine Croustillante Fibre",
    brand: "Wasa",
    per100g: { kcal: 340, prot: 10, carbs: 58, fat: 2.5, fiber: 25 },
    unitWeight: 14, unitLabel: "tranche",
    source: "web",
    addedDate: "2026-04-12"
  },
  {
    id: "pasta-cocida",
    name: "Pasta Tornillos (cocida)",
    brand: "Generic",
    per100g: { kcal: 131, prot: 5, carbs: 25, fat: 1.1, fiber: 1.8 },
    source: "web",
    addedDate: "2026-04-13"
  },
  {
    id: "espinaca-congelada",
    name: "Espinaca Congelada",
    brand: "Generic",
    per100g: { kcal: 23, prot: 2.5, carbs: 1.5, fat: 0.4, fiber: 2.1 },
    source: "web",
    addedDate: "2026-04-13"
  },
  {
    id: "maicena",
    name: "Maicena (Fecula de Maiz)",
    brand: "Generic",
    per100g: { kcal: 381, prot: 0.3, carbs: 91, fat: 0.1, fiber: 0.9 },
    source: "web",
    addedDate: "2026-04-13"
  },
  // Pasta con Pollo, Espinaca y Tomate a la Adri — 70g pasta cocida, 150g espinaca congelada, 153g tomate cherry, 75g skyr, 300g pollo horneado, 75ml agua, 5g maicena. Total ~828g
  {
    id: "pasta-pollo-espinaca-tomate-adri",
    name: "Pasta con Pollo, Espinaca y Tomate a la Adri",
    brand: "Recetario",
    per100g: { kcal: 86.4, prot: 13.3, carbs: 4.0, fat: 1.5, fiber: 0.8 },
    totalG: 828,
    source: "recetario",
    addedDate: "2026-04-13",
    notes: "70g pasta cocida, 150g espinaca congelada, 153g tomate cherry, 75g skyr siggis, 300g pollo horneado, 75ml agua, 5g maicena"
  },
  {
    id: "remolacha-cocida",
    name: "Remolacha (Betterave) Cocida",
    brand: "Generic",
    per100g: { kcal: 44, prot: 1.7, carbs: 10, fat: 0.1, fiber: 2 },
    source: "web",
    addedDate: "2026-04-13"
  },
  {
    id: "kefir-lactel-0-bio",
    name: "Kéfir 0% Bio",
    brand: "Lactel",
    per100g: { kcal: 44, prot: 3.4, carbs: 4.1, fat: 1.5, fiber: 0 },
    source: "web",
    addedDate: "2026-04-13"
  },
  {
    id: "weider-peanut-butter-powder",
    name: "Peanut Butter Powder",
    brand: "Weider",
    per100g: { kcal: 440, prot: 49, carbs: 19, fat: 13, fiber: 0 },
    source: "web",
    addedDate: "2026-04-13"
  },
  {
    id: "mermelada-lucien-fraises-sans-sucres",
    name: "Confiture Fraises Sans Sucres Ajoutés",
    brand: "Lucien Georgelin",
    per100g: { kcal: 89, prot: 0.6, carbs: 21.7, fat: 0.5, fiber: 8.9 },
    source: "web",
    addedDate: "2026-04-13"
  },
  {
    id: "semillas-maranon",
    name: "Semillas de Marañon (Cashews)",
    brand: "Generic",
    per100g: { kcal: 553, prot: 18, carbs: 30, fat: 44, fiber: 3 },
    source: "web",
    addedDate: "2026-04-14"
  },
  {
    id: "patatas-horneadas",
    name: "Patatas Horneadas (sin aceite)",
    brand: "Generic",
    per100g: { kcal: 93, prot: 2.5, carbs: 21, fat: 0.1, fiber: 2.2 },
    source: "web",
    addedDate: "2026-04-14"
  }
];

// Meal log - read-only fallback. GitHub (local-meals.json) is source of truth.
const MEAL_LOG = [
  {
    id: "2026-03-29-001",
    date: "2026-03-29",
    meal: "almuerzo",
    items: [
      { foodId: "menu-dia-29", name: "Menu dia 29", grams: 0, kcal: 1688, prot: 71, carbs: 212, fat: 64 }
    ],
    timestamp: "2026-03-29T13:00:00"
  },
  {
    id: "2026-03-30-001",
    date: "2026-03-30",
    meal: "almuerzo",
    items: [
      { foodId: "menu-dia-30", name: "Menu dia 30", grams: 0, kcal: 1398, prot: 127, carbs: 112, fat: 49 }
    ],
    timestamp: "2026-03-30T13:00:00"
  },
  {
    id: "2026-03-31-001",
    date: "2026-03-31",
    meal: "almuerzo",
    items: [
      { foodId: "menu-dia-31", name: "Menu dia 31", grams: 0, kcal: 1190, prot: 135, carbs: 74, fat: 44 }
    ],
    timestamp: "2026-03-31T13:00:00"
  },
  {
    id: "2026-04-01-L1775065384650",
    date: "2026-04-01",
    meal: "cena",
    items: [
      { foodId: "omelette-ligera-jamon", name: "Omelette Ligera con Jamon", grams: 110, kcal: 126.2, prot: 14.6, carbs: 1.4, fat: 6.6 }
    ],
    timestamp: "2026-04-01T17:43:04.650Z"
  },
  {
    id: "2026-04-01-L1775065395117",
    date: "2026-04-01",
    meal: "cena",
    items: [
      { foodId: "danone-cottage-cheese", name: "Cottage Cheese Nature", grams: 50, kcal: 45, prot: 6, carbs: 0.8, fat: 2 }
    ],
    timestamp: "2026-04-01T17:43:15.117Z"
  },
  {
    id: "2026-04-01-004",
    date: "2026-04-01",
    meal: "snack",
    items: [
      { foodId: "siggis-skyr-nature", name: "Skyr Siggis Nature", grams: 80, kcal: 50.4, prot: 8.8, carbs: 3.2, fat: 0.2 },
      { foodId: "fresas-frescas", name: "Fresas Frescas", grams: 20, kcal: 6.4, prot: 0.1, carbs: 1.5, fat: 0.1 },
      { foodId: "melon-fresco", name: "Melon Fresco", grams: 30, kcal: 10.2, prot: 0.2, carbs: 2.5, fat: 0.1 }
    ],
    timestamp: "2026-04-01T19:00:00"
  },
  {
    id: "2026-04-01-001",
    date: "2026-04-01",
    meal: "desayuno",
    items: [
      { foodId: "frittata-light", name: "Frittata Light", grams: 110, kcal: 150.3, prot: 13.1, carbs: 2.8, fat: 9.7 },
      { foodId: "danone-cottage-cheese", name: "Cottage Cheese Danone", grams: 50, kcal: 45, prot: 6, carbs: 0.8, fat: 2 },
      { foodId: "wasa-leger", name: "Wasa Leger (1 tartine)", grams: 9.6, kcal: 32.4, prot: 0.9, carbs: 6, fat: 0.1 },
      { foodId: "eafit-pure-isolate-vanille", name: "Proteina EAFit Vanille", grams: 40, kcal: 146.4, prot: 34.4, carbs: 1.3, fat: 0.4 },
      { foodId: "alpro-noisette-gourmande", name: "Leche Alpro Noisette", grams: 80, kcal: 23.2, prot: 0.3, carbs: 2.6, fat: 1.3 }
    ],
    timestamp: "2026-04-01T21:45:00"
  },
  {
    id: "2026-04-01-005",
    date: "2026-04-01",
    meal: "snack",
    items: [
      { foodId: "ricotta-casa-azzurra", name: "Ricotta Casa Azzurra", grams: 25, kcal: 43.5, prot: 2.8, carbs: 0.8, fat: 3.3 },
      { foodId: "aguacate-fresco", name: "Aguacate Fresco", grams: 25, kcal: 40, prot: 0.5, carbs: 2.1, fat: 3.7 },
      { foodId: "fresas-frescas", name: "Fresas Frescas (4 ud.)", grams: 48, kcal: 15.4, prot: 0.3, carbs: 3.7, fat: 0.1 }
    ],
    timestamp: "2026-04-01T22:00:00"
  },
  {
    id: "2026-04-01-L1775081087154",
    date: "2026-04-01",
    meal: "snack",
    items: [
      { foodId: "wasa-leger", name: "Tartine Croustillante Leger", grams: 9.6, kcal: 32.4, prot: 0.9, carbs: 6, fat: 0.1 }
    ],
    timestamp: "2026-04-01T22:04:47.154Z"
  },
  {
    id: "2026-04-01-006",
    date: "2026-04-01",
    meal: "cena",
    items: [
      { foodId: "eafit-pure-isolate-vanille", name: "Proteina EAFit Vanille", grams: 40, kcal: 146.4, prot: 34.4, carbs: 1.3, fat: 0.4 },
      { foodId: "alpro-noisette-gourmande", name: "Leche Alpro Noisette", grams: 50, kcal: 14.5, prot: 0.2, carbs: 1.6, fat: 0.8 }
    ],
    timestamp: "2026-04-01T22:30:00"
  },
  {
    id: "2026-04-01-003",
    date: "2026-04-01",
    meal: "almuerzo",
    items: [
      { foodId: "fleury-michon-tendre-poulet-roti", name: "Tendre Poulet Roti Fleury Michon", grams: 16.25, kcal: 17.6, prot: 3.3, carbs: 0.1, fat: 0.5 },
      { foodId: "lentejas-carne-vegetales", name: "Lentejas con Carne y Vegetales", grams: 416, kcal: 416.4, prot: 31.6, carbs: 50.3, fat: 10.8 }
    ],
    timestamp: "2026-04-01T23:30:00"
  },
  {
    id: "2026-04-02-L1775132385557",
    date: "2026-04-02",
    meal: "almuerzo",
    items: [
      { foodId: "lentejas-carne-vegetales", name: "Lentejas con Carne y Vegetales", grams: 558, kcal: 558.6, prot: 42.4, carbs: 67.5, fat: 14.5 }
    ],
    timestamp: "2026-04-02T12:19:45.557Z"
  },
  {
    id: "2026-04-02-L1775132480724",
    date: "2026-04-02",
    meal: "desayuno",
    items: [
      { foodId: "bowl-de-skir-con-fresas-avellanas-y-miel", name: "Bowl de skir con fresas, avellanas y miel", grams: 109, kcal: 86.4, prot: 6.6, carbs: 10.9, fat: 2.4 },
      { foodId: "frittata-ranchera", name: "Frittata Ranchera", grams: 296, kcal: 309.9, prot: 24.9, carbs: 8.6, fat: 19.5 }
    ],
    timestamp: "2026-04-02T12:21:20.724Z"
  },
  {
    id: "2026-04-02-L1775145572391",
    date: "2026-04-02",
    meal: "snack",
    items: [
      { foodId: "eafit-pure-isolate-vanille", name: "Pure Isolate Whey Vanille", grams: 40, kcal: 146.4, prot: 34.4, carbs: 1.3, fat: 0.4 }
    ],
    timestamp: "2026-04-02T15:59:32.391Z"
  },
  {
    id: "2026-04-02-003",
    date: "2026-04-02",
    meal: "cena",
    items: [
      { foodId: "omelette-cottage-salmon", name: "Omelette Cottage Salmon (1/2 receta)", grams: 248, kcal: 245.5, prot: 25.5, carbs: 6, fat: 13.1 }
    ],
    timestamp: "2026-04-02T21:30:00"
  },
  {
    id: "2026-04-02-L1775165521901",
    date: "2026-04-02",
    meal: "cena",
    items: [
      { foodId: "lentejas-carne-vegetales", name: "Lentejas con Carne y Vegetales", grams: 250, kcal: 250.3, prot: 19, carbs: 30.3, fat: 6.5 }
    ],
    timestamp: "2026-04-02T21:32:01.901Z"
  },
  {
    id: "2026-04-02-L1775165597455",
    date: "2026-04-02",
    meal: "snack",
    items: [
      { foodId: "eafit-pure-isolate-vanille", name: "Pure Isolate Whey Vanille", grams: 10, kcal: 36.6, prot: 8.6, carbs: 0.3, fat: 0.1 }
    ],
    timestamp: "2026-04-02T21:33:17.455Z"
  },
  {
    id: "2026-04-02-L1775166171502",
    date: "2026-04-02",
    meal: "snack",
    items: [
      { foodId: "hipro-vanille", name: "HiPro Vanille", grams: 80, kcal: 61.6, prot: 8.2, carbs: 4.7, fat: 0.6 }
    ],
    timestamp: "2026-04-02T21:42:51.502Z"
  },
  {
    id: "2026-04-03-001",
    date: "2026-04-03",
    meal: "desayuno",
    items: [
      { foodId: "hipro-coco", name: "HiPro Coco", grams: 160, kcal: 89.6, prot: 15, carbs: 5.9, fat: 0.6 },
      { foodId: "huevo-entero", name: "Huevo Entero", grams: 50, kcal: 77.5, prot: 6.5, carbs: 0.6, fat: 5.5 },
      { foodId: "clara-huevo", name: "Clara de Huevo", grams: 33, kcal: 17.2, prot: 3.6, carbs: 0.2, fat: 0.1 },
      { foodId: "danone-cottage-cheese", name: "Cottage Cheese Danone", grams: 50, kcal: 45, prot: 6, carbs: 0.8, fat: 2 }
    ],
    timestamp: "2026-04-03T09:15:00"
  },
  {
    id: "2026-04-03-L1775222138905",
    date: "2026-04-03",
    meal: "almuerzo",
    items: [
      { foodId: "lentejas-carne-vegetales", name: "Lentejas con Carne y Vegetales", grams: 480, kcal: 480.5, prot: 36.5, carbs: 58.1, fat: 12.5 }
    ],
    timestamp: "2026-04-03T13:15:38.905Z"
  },
  {
    id: "2026-04-03-L1775222149706",
    date: "2026-04-03",
    meal: "almuerzo",
    items: [
      { foodId: "melon-fresco", name: "Melon Fresco", grams: 30, kcal: 10.2, prot: 0.2, carbs: 2.5, fat: 0.1 }
    ],
    timestamp: "2026-04-03T13:15:49.706Z"
  },
  {
    id: "2026-04-03-002",
    date: "2026-04-03",
    meal: "snack",
    items: [
      { foodId: "jeff-de-bruges-oeuf-paques", name: "Petit Oeuf Pâques Jeff de Bruges (violet)", grams: 13, kcal: 69.9, prot: 0.9, carbs: 6.8, fat: 4.3 },
      { foodId: "mere-poulard-biscuit-beurre", name: "Biscuit Beurre Mère Poulard x2", grams: 31.2, kcal: 156, prot: 2, carbs: 22, fat: 7 },
      { foodId: "fresas-frescas", name: "Fresas Frescas x2", grams: 24, kcal: 7.7, prot: 0.2, carbs: 1.8, fat: 0.1 },
      { foodId: "wasa-leger", name: "Cracker Wasa Leger", grams: 9.6, kcal: 32.4, prot: 0.9, carbs: 6, fat: 0.1 },
      { foodId: "ricotta-casa-azzurra", name: "Ricotta Casa Azzurra", grams: 50, kcal: 87, prot: 5.5, carbs: 1.5, fat: 6.5 }
    ],
    timestamp: "2026-04-03T16:30:00"
  },
  {
    id: "2026-04-03-003",
    date: "2026-04-03",
    meal: "cena",
    items: [
      { foodId: "pollo-pechuga-horneada", name: "Pechuga de Pollo Horneada", grams: 162, kcal: 267.3, prot: 50.2, carbs: 0, fat: 5.8 },
      { foodId: "tomate-cherry", name: "Tomate Cherry", grams: 50, kcal: 9, prot: 0.5, carbs: 2, fat: 0.1 },
      { foodId: "quinoa-cocida", name: "Quinoa Cocida", grams: 27, kcal: 32.4, prot: 1.2, carbs: 5.8, fat: 0.5 },
      { foodId: "endive", name: "Endive (1/2)", grams: 75, kcal: 12.8, prot: 1, carbs: 2.6, fat: 0.2 },
      { foodId: "aderezo-fromage-blanc-aguacate-cilantro", name: "Aderezo Fromage Blanc Aguacate Cilantro", grams: 65, kcal: 57.9, prot: 1.7, carbs: 3.1, fat: 4.7 }
    ],
    timestamp: "2026-04-03T21:00:00"
  },
  {
    id: "2026-04-03-004",
    date: "2026-04-03",
    meal: "snack",
    items: [
      { foodId: "oreo-protein-shake", name: "Oreo Protein Shake", grams: 250, kcal: 231.5, prot: 14.8, carbs: 26.5, fat: 8 }
    ],
    timestamp: "2026-04-03T22:00:00"
  },
  {
    id: "2026-04-04-001",
    date: "2026-04-04",
    meal: "desayuno",
    items: [
      { foodId: "oreo-protein-shake", name: "Oreo Protein Shake", grams: 100, kcal: 92.6, prot: 5.9, carbs: 10.6, fat: 3.2 },
      { foodId: "eafit-pure-isolate-vanille", name: "Proteina EAFit Vanille", grams: 40, kcal: 146.4, prot: 34.4, carbs: 1.3, fat: 0.4 }
    ],
    timestamp: "2026-04-04T09:00:00"
  },
  {
    id: "2026-04-04-002",
    date: "2026-04-04",
    meal: "almuerzo",
    items: [
      { foodId: "charcuterie-variada", name: "Charcuterie Variada (jambon, coppa, saucisson)", grams: 120, kcal: 300, prot: 21.6, carbs: 1.2, fat: 24 },
      { foodId: "tomate-cherry", name: "Tomates Cherry", grams: 100, kcal: 18, prot: 0.9, carbs: 3.9, fat: 0.2 },
      { foodId: "mozzarella-mini-billes", name: "Mini Mozzarella", grams: 60, kcal: 168, prot: 10.2, carbs: 0.6, fat: 13.2 },
      { foodId: "toast-feuillete-tomate-seche", name: "Toast Feuilleté Tomate Séché x3", grams: 45, kcal: 200.3, prot: 2.9, carbs: 18, fat: 13.1 },
      { foodId: "chips-classiques", name: "Chips", grams: 20, kcal: 107.2, prot: 1.2, carbs: 10, fat: 7 },
      { foodId: "vin-blanc-chablis", name: "Vin Chablis Blanc x2 copas", grams: 250, kcal: 175, prot: 0, carbs: 2, fat: 0 },
      { foodId: "champagne-brut", name: "Champagne Mumm x1 copa", grams: 125, kcal: 100, prot: 0, carbs: 1.5, fat: 0 },
      { foodId: "pain-baguette", name: "Pan Baguette x2 pedazos", grams: 80, kcal: 219.2, prot: 6.8, carbs: 44, fat: 1 }
    ],
    timestamp: "2026-04-04T13:00:00"
  },
  {
    id: "2026-04-04-003",
    date: "2026-04-04",
    meal: "almuerzo",
    items: [
      { foodId: "cheesecake-oreo-beurre", name: "Cheesecake Oreo & Beurre (1/8)", grams: 194, kcal: 684.6, prot: 11.3, carbs: 54.7, fat: 47.3 },
      { foodId: "coulis-fraises-maison", name: "Coulis de Fresas", grams: 30, kcal: 33, prot: 0.2, carbs: 8.3, fat: 0.1 }
    ],
    timestamp: "2026-04-04T14:00:00"
  },
  {
    id: "2026-04-04-004",
    date: "2026-04-04",
    meal: "snack",
    items: [
      { foodId: "hipro-vanille", name: "HiPro Vanille (1/2)", grams: 80, kcal: 61.6, prot: 8.2, carbs: 4.7, fat: 0.6 }
    ],
    timestamp: "2026-04-04T17:00:00"
  },
  {
    id: "2026-04-04-005",
    date: "2026-04-04",
    meal: "cena",
    items: [
      { foodId: "huevo-entero", name: "Huevo (1/2)", grams: 25, kcal: 38.8, prot: 3.3, carbs: 0.3, fat: 2.8 },
      { foodId: "ricotta-casa-azzurra", name: "Ricotta", grams: 25, kcal: 43.5, prot: 2.8, carbs: 0.8, fat: 3.3 },
      { foodId: "danone-cottage-cheese", name: "Cottage Cheese", grams: 50, kcal: 45, prot: 6, carbs: 0.8, fat: 2 },
      { foodId: "pollo-pechuga-horneada", name: "Pechuga Pollo Asado", grams: 30, kcal: 49.5, prot: 9.3, carbs: 0, fat: 1.1 },
      { foodId: "wasa-leger", name: "Cracker Wasa Leger", grams: 9.6, kcal: 32.4, prot: 0.9, carbs: 6, fat: 0.1 },
      { foodId: "aguacate-fresco", name: "Salsa de Aguacate", grams: 30, kcal: 48, prot: 0.6, carbs: 2.6, fat: 4.4 },
      { foodId: "coca-cola-zero", name: "Coca-Cola Zero", grams: 330, kcal: 1.3, prot: 0, carbs: 0, fat: 0 }
    ],
    timestamp: "2026-04-04T21:00:00"
  },
  {
    id: "2026-04-04-L1775379336634",
    date: "2026-04-04",
    meal: "cena",
    items: [
      { foodId: "lentejas-carne-vegetales", name: "Lentejas con Carne y Vegetales", grams: 300, kcal: 300.3, prot: 22.8, carbs: 36.3, fat: 7.8 }
    ],
    timestamp: "2026-04-05T08:55:36.634Z"
  },
  {
    id: "2026-04-05-001",
    date: "2026-04-05",
    meal: "desayuno",
    items: [
      { foodId: "wasa-leger", name: "Wasa Leger (x2)", grams: 19.2, kcal: 64.9, prot: 1.7, carbs: 11.9, fat: 0.3 },
      { foodId: "kiwi-fresco", name: "Kiwi (1/2)", grams: 38, kcal: 23.2, prot: 0.4, carbs: 5.6, fat: 0.2 },
      { foodId: "hipro-banane", name: "HiPro Banane", grams: 160, kcal: 112, prot: 19.8, carbs: 6.4, fat: 0.6 },
      { foodId: "aguacate-fresco", name: "Aguacate", grams: 45, kcal: 72, prot: 0.9, carbs: 3.8, fat: 6.6 },
      { foodId: "danone-cottage-cheese", name: "Cottage Cheese", grams: 100, kcal: 90, prot: 12, carbs: 1.6, fat: 3.9 }
    ],
    timestamp: "2026-04-05T12:15:00"
  },
  {
    id: "2026-04-05-003",
    date: "2026-04-05",
    meal: "almuerzo",
    items: [
      { foodId: "pollo-pechuga-horneada", name: "Pollo al Horno", grams: 180, kcal: 297, prot: 55.8, carbs: 0, fat: 6.5 },
      { foodId: "tortillarepupusa-ricotta", name: "Tortillarepupusa con Ricotta", grams: 53, kcal: 163.1, prot: 6.4, carbs: 21, fat: 5.6 },
      { foodId: "tomate-cherry", name: "Tomate Cherry x4", grams: 60, kcal: 10.8, prot: 0.5, carbs: 2.3, fat: 0.1 },
      { foodId: "coca-cola-zero", name: "Coca-Cola Zero", grams: 330, kcal: 1.3, prot: 0, carbs: 0, fat: 0 },
      { foodId: "danone-cottage-cheese", name: "Cottage Cheese", grams: 50, kcal: 45, prot: 6, carbs: 0.8, fat: 2 },
      { foodId: "mostaza-amarilla", name: "Mostaza (1 cda)", grams: 15, kcal: 9.9, prot: 0.6, carbs: 0.6, fat: 0.5 },
      { foodId: "harissa-paste", name: "Harissa (1 cda)", grams: 15, kcal: 15, prot: 0.5, carbs: 0.9, fat: 1.1 }
    ],
    timestamp: "2026-04-05T14:00:00"
  },
  {
    id: "2026-04-05-002",
    date: "2026-04-05",
    meal: "snack",
    items: [
      { foodId: "creme-halva-chocolate-cookie", name: "Creme London Halva Cookie (1/2)", grams: 46, kcal: 220.8, prot: 3.2, carbs: 23.9, fat: 11.5 }
    ],
    timestamp: "2026-04-05T16:00:00"
  },
  {
    id: "2026-04-05-004",
    date: "2026-04-05",
    meal: "cena",
    items: [
      { foodId: "arroz-bomba-cocido", name: "Arroz Bomba Cocido", grams: 95, kcal: 123.5, prot: 2.6, carbs: 26.6, fat: 0.3 },
      { foodId: "pescado-salsa-limon-alcaparras", name: "Pescado Salsa Limon y Alcaparras", grams: 205, kcal: 210.7, prot: 30.9, carbs: 2.5, fat: 7.8 }
    ],
    timestamp: "2026-04-05T21:00:00"
  },
  {
    id: "2026-04-05-L1775431527857",
    date: "2026-04-05",
    meal: "cena",
    items: [
      { foodId: "coca-cola-zero", name: "Coca-Cola Zero", grams: 200, kcal: 0.8, prot: 0, carbs: 0, fat: 0 }
    ],
    timestamp: "2026-04-05T23:25:27.857Z"
  },
  {
    id: "2026-04-05-L1775431583057",
    date: "2026-04-05",
    meal: "snack",
    items: [
      { foodId: "eafit-pure-isolate-vanille", name: "Pure Isolate Whey Vanille", grams: 20, kcal: 73.2, prot: 17.2, carbs: 0.7, fat: 0.2 }
    ],
    timestamp: "2026-04-05T23:26:23.057Z"
  },
  {
    id: "2026-04-05-L1775433329439",
    date: "2026-04-05",
    meal: "snack",
    items: [
      { foodId: "jeff-de-bruges-oeuf-paques", name: "Petit Oeuf de Pâques Fourré", grams: 10, kcal: 53.8, prot: 0.7, carbs: 5.2, fat: 3.3 }
    ],
    timestamp: "2026-04-05T23:55:29.439Z"
  },
  {
    id: "2026-04-06-001",
    date: "2026-04-06",
    meal: "desayuno",
    items: [
      { foodId: "protein-packed-banana-pb", name: "Protein Packed Banana Peanut Butter (60%)", grams: 209, kcal: 208.4, prot: 26.2, carbs: 18.6, fat: 3.5 },
      { foodId: "mantequilla-de-mani", name: "Mantequilla de mani", grams: 15, kcal: 88.2, prot: 3.8, carbs: 3, fat: 7.5 }
    ],
    timestamp: "2026-04-06T09:00:00"
  },
  {
    id: "2026-04-06-A01",
    date: "2026-04-06",
    meal: "desayuno", who: "adriana",
    items: [
      { foodId: "pancakes-de-proteina-adri-v2", name: "Pancakes de Proteina Adri V2", grams: 1, kcal: 547, prot: 64.2, carbs: 27.7, fat: 21.2 }
    ],
    timestamp: "2026-04-06T09:00:00"
  },
  {
    id: "2026-04-06-002",
    date: "2026-04-06",
    meal: "almuerzo",
    items: [
      { foodId: "salmorejo-alvalle", name: "Salmorejo Alvalle", grams: 200, kcal: 108, prot: 2.4, carbs: 11.6, fat: 6 },
      { foodId: "ricotta-casa-azzurra", name: "Ricotta Casa Azzurra", grams: 30, kcal: 52.2, prot: 3.3, carbs: 0.9, fat: 3.9 },
      { foodId: "aceite-oliva", name: "Aceite de oliva (1/4 cdta)", grams: 1.1, kcal: 9.7, prot: 0, carbs: 0, fat: 1.1 },
      { foodId: "pollo-pechuga-horneada", name: "Pollo horneado", grams: 50, kcal: 82.5, prot: 15.5, carbs: 0, fat: 1.8 },
      { foodId: "pescado-salsa-limon-alcaparras", name: "Pescado salsa limon alcaparras", grams: 35, kcal: 36, prot: 5.3, carbs: 0.4, fat: 1.3 },
      { foodId: "tortillarepupusa-ricotta", name: "Pupusarepatotilla", grams: 58, kcal: 178.5, prot: 7, carbs: 23, fat: 6.1 },
      { foodId: "coca-cola-zero", name: "Coca-Cola Zero", grams: 200, kcal: 0.8, prot: 0, carbs: 0, fat: 0 },
      { foodId: "tomate-cherry", name: "Tomate cherry", grams: 15, kcal: 2.7, prot: 0.1, carbs: 0.6, fat: 0 }
    ],
    timestamp: "2026-04-06T13:00:00"
  },
  {
    id: "2026-04-06-A02",
    date: "2026-04-06",
    meal: "almuerzo", who: "adriana",
    items: [
      { foodId: "salmorejo-alvalle", name: "Salmorejo", grams: 100, kcal: 54, prot: 1.2, carbs: 5.8, fat: 3 },
      { foodId: "ricotta-casa-azzurra", name: "Ricotta", grams: 25, kcal: 43.5, prot: 2.8, carbs: 0.8, fat: 3.3 },
      { foodId: "aceite-oliva", name: "Aceite de oliva (1/4 cdta)", grams: 1.1, kcal: 9.7, prot: 0, carbs: 0, fat: 1.1 },
      { foodId: "pollo-pechuga-horneada", name: "Pollo horneado", grams: 48, kcal: 79.2, prot: 14.9, carbs: 0, fat: 1.7 },
      { foodId: "pescado-salsa-limon-alcaparras", name: "Pescado salsa limon alcaparras", grams: 55, kcal: 56.5, prot: 8.3, carbs: 0.7, fat: 2.1 },
      { foodId: "tortillarepupusa-ricotta", name: "Pupusarepatortilla", grams: 50, kcal: 153.9, prot: 6.1, carbs: 19.8, fat: 5.3 }
    ],
    timestamp: "2026-04-06T13:00:00"
  },
  {
    id: "2026-04-06-A-almuerzo",
    date: "2026-04-06",
    meal: "almuerzo", who: "adriana",
    items: [
      { foodId: "salmorejo-alvalle", name: "Salmorejo", grams: 100, kcal: 54, prot: 1.2, carbs: 5.8, fat: 3 },
      { foodId: "ricotta-casa-azzurra", name: "Ricotta", grams: 25, kcal: 43.5, prot: 2.8, carbs: 0.8, fat: 3.3 },
      { foodId: "aceite-oliva", name: "Aceite de oliva (1/4 cdta)", grams: 1.1, kcal: 9.7, prot: 0, carbs: 0, fat: 1.1 },
      { foodId: "pollo-pechuga-horneada", name: "Pollo horneado", grams: 48, kcal: 79.2, prot: 14.9, carbs: 0, fat: 1.7 },
      { foodId: "pescado-salsa-limon-alcaparras", name: "Pescado salsa limon alcaparras", grams: 55, kcal: 56.5, prot: 8.3, carbs: 0.7, fat: 2.1 },
      { foodId: "tortillarepupusa-ricotta", name: "Pupusarepatortilla", grams: 50, kcal: 153.9, prot: 6.1, carbs: 19.8, fat: 5.3 }
    ],
    timestamp: "2026-04-06T13:00:00.000Z"
  },
  {
    id: "2026-04-06-A03",
    date: "2026-04-06",
    meal: "snack", who: "adriana",
    items: [
      { foodId: "jeff-de-bruges-oeuf-paques", name: "Huevito Jeff de Bruges x1", grams: 13, kcal: 69.9, prot: 0.9, carbs: 6.8, fat: 4.3 }
    ],
    timestamp: "2026-04-06T16:00:00"
  },
  {
    id: "2026-04-06-A-snack",
    date: "2026-04-06",
    meal: "snack", who: "adriana",
    items: [
      { foodId: "jeff-de-bruges-oeuf-paques", name: "Huevito Jeff de Bruges x1", grams: 13, kcal: 69.9, prot: 0.9, carbs: 6.8, fat: 4.3 }
    ],
    timestamp: "2026-04-06T16:00:00.000Z"
  },
  {
    id: "2026-04-06-003",
    date: "2026-04-06",
    meal: "snack",
    items: [
      { foodId: "jeff-de-bruges-oeuf-paques", name: "Huevito Jeff de Bruges x2", grams: 26, kcal: 139.9, prot: 1.7, carbs: 13.5, fat: 8.6 },
      { foodId: "oreo-protein-shake", name: "Oreo Protein Shake", grams: 400, kcal: 370.4, prot: 23.6, carbs: 42.4, fat: 12.8 },
      { foodId: "alpro-noisette-gourmande", name: "Leche noisette extra", grams: 50, kcal: 14.5, prot: 0.2, carbs: 1.6, fat: 0.8 },
      { foodId: "galleta-oreo-sin-crema", name: "8 tapitas oreo sin crema", grams: 30, kcal: 141.3, prot: 0.9, carbs: 22.1, fat: 6.2 }
    ],
    timestamp: "2026-04-06T17:00:00"
  },
  {
    id: "2026-04-06-A04",
    date: "2026-04-06",
    meal: "cena", who: "adriana",
    items: [
      { foodId: "pizza-regine-pizzou", name: "Pizza Régine Pizzou", grams: 220, kcal: 341, prot: 22.9, carbs: 42.2, fat: 10.1 },
      { foodId: "aceite-oliva", name: "Aceite de oliva (1/4 cdta)", grams: 1.1, kcal: 9.7, prot: 0, carbs: 0, fat: 1.1 },
      { foodId: "ricotta-casa-azzurra", name: "Ricotta (3 cdtas + 1/2 cda)", grams: 22.5, kcal: 39.2, prot: 2.5, carbs: 0.7, fat: 2.9 },
      { foodId: "coca-cola-zero", name: "Coca-Cola Zero", grams: 200, kcal: 0.8, prot: 0, carbs: 0, fat: 0 },
      { foodId: "alpro-noisette-gourmande", name: "Leche noisette", grams: 150, kcal: 43.5, prot: 0.6, carbs: 4.8, fat: 2.4 }
    ],
    timestamp: "2026-04-06T20:00:00"
  },
  {
    id: "2026-04-06-A-cena",
    date: "2026-04-06",
    meal: "cena", who: "adriana",
    items: [
      { foodId: "pizza-regine-pizzou", name: "Pizza Régine Pizzou", grams: 220, kcal: 341, prot: 22.9, carbs: 42.2, fat: 10.1 },
      { foodId: "aceite-oliva", name: "Aceite de oliva (1/4 cdta)", grams: 1.1, kcal: 9.7, prot: 0, carbs: 0, fat: 1.1 },
      { foodId: "ricotta-casa-azzurra", name: "Ricotta (3 cdtas + 1/2 cda)", grams: 22.5, kcal: 39.2, prot: 2.5, carbs: 0.7, fat: 2.9 },
      { foodId: "coca-cola-zero", name: "Coca-Cola Zero", grams: 200, kcal: 0.8, prot: 0, carbs: 0, fat: 0 },
      { foodId: "alpro-noisette-gourmande", name: "Leche noisette", grams: 150, kcal: 43.5, prot: 0.6, carbs: 4.8, fat: 2.4 }
    ],
    timestamp: "2026-04-06T20:00:00.000Z"
  },
  {
    id: "2026-04-06-004",
    date: "2026-04-06",
    meal: "cena",
    items: [
      { foodId: "pizza-regine-pizzou", name: "Pizza Régine Pizzou", grams: 330, kcal: 512, prot: 34.3, carbs: 63.4, fat: 15.2 },
      { foodId: "coca-cola-zero", name: "Coca-Cola Zero", grams: 200, kcal: 0.8, prot: 0, carbs: 0, fat: 0 }
    ],
    timestamp: "2026-04-06T21:00:00"
  },
  {
    id: "2026-04-06-L1775512880333",
    date: "2026-04-06",
    meal: "desayuno", who: "adriana",
    items: [
      { foodId: "pancakes-de-proteina-adri-v2", name: "Pancakes de Proteina Adri V2", grams: 1, kcal: 547, prot: 64.2, carbs: 27.7, fat: 21.2 }
    ],
    timestamp: "2026-04-06T22:01:20.333Z"
  },
  {
    id: "2026-04-06-L1775514376856",
    date: "2026-04-06",
    meal: "cena",
    items: [
      { foodId: "aceite-oliva", name: "Aceite de Oliva", grams: 3, kcal: 26.5, prot: 0, carbs: 0, fat: 3 }
    ],
    timestamp: "2026-04-06T22:26:16.856Z"
  },
  {
    id: "2026-04-06-005",
    date: "2026-04-06",
    meal: "snack",
    items: [
      { foodId: "eafit-pure-isolate-vanille", name: "Pure Isolate Whey Vanille", grams: 40, kcal: 146.4, prot: 34.4, carbs: 1.3, fat: 0.4 },
      { foodId: "galleta-oreo-sin-crema", name: "Galleta Oreo wafer x8", grams: 60, kcal: 282.6, prot: 1.7, carbs: 44.1, fat: 12.4 },
      { foodId: "alpro-noisette-gourmande", name: "Leche Alpro Noisette", grams: 50, kcal: 14.5, prot: 0.2, carbs: 1.6, fat: 0.8 }
    ],
    timestamp: "2026-04-06T22:30:00"
  },
  {
    id: "2026-04-07-A01",
    date: "2026-04-07",
    meal: "desayuno", who: "adriana",
    items: [
      { foodId: "hipro-coco", name: "HiPro Coco", grams: 152, kcal: 85.1, prot: 14.3, carbs: 5.6, fat: 0.6 },
      { foodId: "siggis-skyr-nature", name: "Skyr Siggis Nature", grams: 104, kcal: 65.5, prot: 11.4, carbs: 4.2, fat: 0.2 },
      { foodId: "fresas-frescas", name: "Fresas", grams: 25, kcal: 8, prot: 0.2, carbs: 1.9, fat: 0.1 },
      { foodId: "blueberries-frescas", name: "Blueberries", grams: 22, kcal: 12.5, prot: 0.2, carbs: 3.2, fat: 0.1 }
    ],
    timestamp: "2026-04-07T08:30:00"
  },
  {
    id: "2026-04-07-001",
    date: "2026-04-07",
    meal: "desayuno",
    items: [
      { foodId: "hipro-coco", name: "HiPro Coco", grams: 160, kcal: 89.6, prot: 15, carbs: 5.9, fat: 0.6 },
      { foodId: "pancakes-de-proteina-adri-v2", name: "Pancake Proteina Adri", grams: 30, kcal: 46.9, prot: 5.5, carbs: 2.4, fat: 1.8 },
      { foodId: "banana-fresca", name: "Banano", grams: 20, kcal: 17.8, prot: 0.2, carbs: 4.6, fat: 0.1 }
    ],
    timestamp: "2026-04-07T08:30:00"
  },
  {
    id: "2026-04-07-A02",
    date: "2026-04-07",
    meal: "snack", who: "adriana",
    items: [
      { foodId: "baiocchi-pistachio", name: "Baiocchi Pistachio (x1 galleta)", grams: 9.3, kcal: 47, prot: 0.8, carbs: 5.5, fat: 2.3 },
      { foodId: "pancakes-de-proteina-adri-v2", name: "Pancake Proteina Adri", grams: 62, kcal: 96.9, prot: 11.4, carbs: 4.9, fat: 3.8 },
      { foodId: "danone-cottage-cheese", name: "Cottage Cheese", grams: 110, kcal: 99, prot: 13.2, carbs: 1.8, fat: 4.3 },
      { foodId: "fresas-frescas", name: "Fresas", grams: 30, kcal: 9.6, prot: 0.2, carbs: 2.3, fat: 0.1 }
    ],
    timestamp: "2026-04-07T11:00:00"
  },
  {
    id: "2026-04-07-002",
    date: "2026-04-07",
    meal: "snack",
    items: [
      { foodId: "mandarina-fresca", name: "Mandarina", grams: 80, kcal: 37.6, prot: 0.6, carbs: 9.6, fat: 0.2 },
      { foodId: "mango-fresco", name: "Mango", grams: 55, kcal: 33, prot: 0.4, carbs: 8.3, fat: 0.2 },
      { foodId: "fresas-frescas", name: "Fresas (x2)", grams: 24, kcal: 7.7, prot: 0.2, carbs: 1.8, fat: 0.1 },
      { foodId: "eafit-pure-isolate-vanille", name: "EAFit Vanilla Shake", grams: 40, kcal: 146.4, prot: 34.4, carbs: 1.3, fat: 0.4 },
      { foodId: "alpro-noisette-gourmande", name: "Leche Alpro Noisette", grams: 50, kcal: 14.5, prot: 0.2, carbs: 1.6, fat: 0.8 }
    ],
    timestamp: "2026-04-07T11:30:00"
  },
  {
    id: "2026-04-07-A03",
    date: "2026-04-07",
    meal: "almuerzo", who: "adriana",
    items: [
      { foodId: "rigatoni-cocida", name: "Rigatoni Cocida", grams: 130, kcal: 204.1, prot: 7.2, carbs: 40.3, fat: 1.2 },
      { foodId: "beef-green-beans-meat-bowl", name: "Carne con Ejote y Cebolla", grams: 130, kcal: 189.7, prot: 16.4, carbs: 6.5, fat: 11.1 },
      { foodId: "danone-cottage-cheese", name: "Cottage Cheese", grams: 100, kcal: 90, prot: 12, carbs: 1.6, fat: 3.9 }
    ],
    timestamp: "2026-04-07T13:00:00"
  },
  {
    id: "2026-04-07-003",
    date: "2026-04-07",
    meal: "almuerzo",
    items: [
      { foodId: "rigatoni-cocida", name: "Rigatoni Cocida", grams: 200, kcal: 314, prot: 11, carbs: 62, fat: 1.8 },
      { foodId: "beef-green-beans-meat-bowl", name: "Carne y Ejote con Cebolla", grams: 128, kcal: 186.8, prot: 16.1, carbs: 6.4, fat: 10.9 }
    ],
    timestamp: "2026-04-07T13:30:00"
  },
  {
    id: "2026-04-07-005",
    date: "2026-04-07",
    meal: "snack",
    items: [
      { foodId: "wasa-leger", name: "Wasa Léger (1 tartine)", grams: 9.6, kcal: 32.4, prot: 0.9, carbs: 6, fat: 0.1 },
      { foodId: "ricotta-casa-azzurra", name: "Ricotta", grams: 35, kcal: 60.9, prot: 3.9, carbs: 1.1, fat: 4.6 }
    ],
    timestamp: "2026-04-07T16:00:00"
  },
  {
    id: "2026-04-07-A04",
    date: "2026-04-07",
    meal: "cena", who: "adriana",
    items: [
      { foodId: "clara-huevo", name: "Clara de Huevo (x1)", grams: 33, kcal: 17.2, prot: 3.6, carbs: 0.2, fat: 0.1 },
      { foodId: "huevo-entero", name: "Huevo Entero (x1)", grams: 50, kcal: 77.5, prot: 6.5, carbs: 0.6, fat: 5.5 },
      { foodId: "pimiento-rojo-crudo", name: "Pimiento Rojo", grams: 11, kcal: 3.4, prot: 0.1, carbs: 0.7, fat: 0 },
      { foodId: "jamon-fm-25-moins-sel", name: "Jamón FM -25% Sel", grams: 35, kcal: 40.3, prot: 7, carbs: 0.4, fat: 1.2 },
      { foodId: "beaufort-rape", name: "Beaufort Rapé", grams: 20, kcal: 81, prot: 5.4, carbs: 0, fat: 6.6 },
      { foodId: "aceite-oliva", name: "AOVE (1/2 tsp)", grams: 2.5, kcal: 22.1, prot: 0, carbs: 0, fat: 2.5 },
      { foodId: "ricotta-casa-azzurra", name: "Ricotta", grams: 64, kcal: 111.4, prot: 7, carbs: 1.9, fat: 8.3 }
    ],
    timestamp: "2026-04-07T20:00:00"
  },
  {
    id: "2026-04-07-004",
    date: "2026-04-07",
    meal: "cena",
    items: [
      { foodId: "danone-cottage-cheese", name: "Cottage Cheese", grams: 100, kcal: 90, prot: 12, carbs: 1.6, fat: 3.9 },
      { foodId: "clara-huevo", name: "Clara de Huevo (x2)", grams: 66, kcal: 34.3, prot: 7.3, carbs: 0.5, fat: 0.1 },
      { foodId: "huevo-entero", name: "Huevo Entero (x1)", grams: 50, kcal: 77.5, prot: 6.5, carbs: 0.6, fat: 5.5 },
      { foodId: "beaufort-rape", name: "Beaufort Rapé", grams: 25, kcal: 101.3, prot: 6.8, carbs: 0, fat: 8.3 },
      { foodId: "pimiento-rojo-crudo", name: "Pimiento Rojo", grams: 17, kcal: 5.3, prot: 0.2, carbs: 1, fat: 0.1 },
      { foodId: "jamon-fm-25-moins-sel", name: "Jamón FM -25% Sel", grams: 44, kcal: 50.6, prot: 8.8, carbs: 0.4, fat: 1.5 },
      { foodId: "maasdam-queso", name: "Maasdam", grams: 14, kcal: 48.7, prot: 3.5, carbs: 0, fat: 3.8 },
      { foodId: "aceite-oliva", name: "AOVE (1/2 tsp)", grams: 2.5, kcal: 22.1, prot: 0, carbs: 0, fat: 2.5 }
    ],
    timestamp: "2026-04-07T20:30:00"
  },
  {
    id: "2026-04-08-L1775637666710",
    date: "2026-04-08",
    meal: "desayuno",
    items: [
      { foodId: "cafe-negro", name: "Café Negro (sin azucar)", grams: 120, kcal: 2.4, prot: 0.1, carbs: 0, fat: 0 },
      { foodId: "hipro-banane", name: "HiPro Banane", grams: 160, kcal: 112, prot: 19.8, carbs: 6.4, fat: 0.6 }
    ],
    timestamp: "2026-04-08T06:21:06.710Z"
  },
  {
    id: "2026-04-08-L1775655446964",
    date: "2026-04-08",
    meal: "desayuno",
    items: [
      { foodId: "pancakes-de-proteina-adri-v2", name: "Pancakes de Proteina Adri V2", grams: 30, kcal: 46.9, prot: 5.5, carbs: 2.4, fat: 1.8 }
    ],
    timestamp: "2026-04-08T11:17:26.964Z"
  },
  {
    id: "2026-04-08-L1775655454297",
    date: "2026-04-08",
    meal: "desayuno",
    items: [
      { foodId: "ricotta-casa-azzurra", name: "Ricotta Casa Azzurra", grams: 50, kcal: 87, prot: 5.5, carbs: 1.5, fat: 6.5 }
    ],
    timestamp: "2026-04-08T11:17:34.297Z"
  },
  {
    id: "2026-04-08-L1775655726869",
    date: "2026-04-08",
    meal: "snack",
    items: [
      { foodId: "eafit-pure-isolate-vanille", name: "Pure Isolate Whey Vanille", grams: 40, kcal: 146.4, prot: 34.4, carbs: 1.3, fat: 0.4 }
    ],
    timestamp: "2026-04-08T11:22:06.869Z"
  },
  {
    id: "2026-04-08-L1775663325750",
    date: "2026-04-08",
    meal: "snack",
    items: [
      { foodId: "queso-maduro-espanol", name: "Queso Maduro Español", grams: 15, kcal: 60, prot: 3.8, carbs: 0.1, fat: 5.0 }
    ],
    timestamp: "2026-04-08T15:48:45.000Z"
  },
  {
    id: "2026-04-08-002",
    date: "2026-04-08",
    meal: "snack",
    items: [
      { foodId: "queso-curado-hacendado", name: "Queso Curado Hacendado", grams: 15, kcal: 64.7, prot: 3.8, carbs: 0.3, fat: 5.4 },
      { foodId: "wasa-leger", name: "Wasa Leger", grams: 9.6, units: 1, kcal: 32.4, prot: 0.9, carbs: 6.0, fat: 0.1 },
      { foodId: "ricotta-casa-azzurra", name: "Ricotta Casa Azzurra", grams: 30, kcal: 52.2, prot: 3.3, carbs: 0.9, fat: 3.9 }
    ],
    timestamp: "2026-04-08T16:30:00"
  },
  {
    id: "2026-04-08-003",
    date: "2026-04-08",
    meal: "almuerzo",
    items: [
      { foodId: "rumsteck-boeuf-cuit", name: "Rumsteck de Boeuf", grams: 95, kcal: 114.0, prot: 23.8, carbs: 0, fat: 1.9 },
      { foodId: "aceite-oliva", name: "AOVE (3/4 cdita)", grams: 3.75, kcal: 33.2, prot: 0, carbs: 0, fat: 3.8 },
      { foodId: "pimiento-rojo-crudo", name: "Pimiento Rojo", grams: 140, kcal: 43.4, prot: 1.4, carbs: 8.4, fat: 0.4 },
      { foodId: "brocoli-cuit", name: "Brocoli", grams: 130, kcal: 45.5, prot: 3.9, carbs: 5.2, fat: 0.5 }
    ],
    timestamp: "2026-04-08T17:00:00"
  },
  // === ADRIANA 2026-04-08 ===
  {
    id: "2026-04-08-A01",
    date: "2026-04-08",
    meal: "desayuno", who: "adriana",
    items: [
      { foodId: "hipro-vanille", name: "HiPro Vanille", grams: 154, kcal: 118.6, prot: 15.7, carbs: 9.1, fat: 1.2 },
      { foodId: "siggis-skyr-nature", name: "Skyr Siggis Nature", grams: 127, kcal: 80.0, prot: 14.0, carbs: 5.1, fat: 0.3 },
      { foodId: "semillas-chia", name: "Chia (1 cdita)", grams: 5, kcal: 24.3, prot: 0.9, carbs: 2.1, fat: 1.6 },
      { foodId: "fresas-frescas", name: "Fresas", grams: 50, kcal: 16.0, prot: 0.4, carbs: 3.9, fat: 0.2 }
    ],
    timestamp: "2026-04-08T08:30:00"
  },
  {
    id: "2026-04-08-A02",
    date: "2026-04-08",
    meal: "almuerzo", who: "adriana",
    items: [
      { foodId: "rumsteck-boeuf-cuit", name: "Rumsteck de Boeuf", grams: 75, kcal: 90.0, prot: 18.8, carbs: 0, fat: 1.5 },
      { foodId: "brocoli-cuit", name: "Brocoli", grams: 95, kcal: 33.3, prot: 2.9, carbs: 3.8, fat: 0.4 },
      { foodId: "pimiento-rojo-crudo", name: "Pimiento", grams: 90, kcal: 27.9, prot: 0.9, carbs: 5.4, fat: 0.3 },
      { foodId: "aceite-oliva", name: "AOVE (3/4 cdita)", grams: 3.75, kcal: 33.2, prot: 0, carbs: 0, fat: 3.8 },
      { foodId: "quinoa-cocida", name: "Quinoa Cocida", grams: 70, kcal: 84.0, prot: 3.1, carbs: 14.9, fat: 1.3 }
    ],
    timestamp: "2026-04-08T13:00:00"
  },
  {
    id: "2026-04-08-A03",
    date: "2026-04-08",
    meal: "snack", who: "adriana",
    items: [
      { foodId: "siggis-skyr-raspberry", name: "Siggi's Skyr Raspberry", grams: 140, units: 1, kcal: 102.2, prot: 14.0, carbs: 11.2, fat: 0.3 },
      { foodId: "gerble-cookie-cacao-pepites-ss", name: "Gerblé Cookie Cacao Pépites x6", grams: 65, units: 6, kcal: 336.7, prot: 5.2, carbs: 39.7, fat: 11.7 },
      { foodId: "salmorejo-alvalle", name: "Salmorejo", grams: 75, kcal: 40.5, prot: 0.9, carbs: 4.4, fat: 2.3 },
      { foodId: "ricotta-casa-azzurra", name: "Ricotta", grams: 40, kcal: 69.6, prot: 4.4, carbs: 1.2, fat: 5.2 }
    ],
    timestamp: "2026-04-08T16:00:00"
  },
  {
    id: "2026-04-08-A04",
    date: "2026-04-08",
    meal: "cena", who: "adriana",
    items: [
      { foodId: "huevo-entero", name: "Huevo Entero", grams: 50, units: 1, kcal: 77.5, prot: 6.5, carbs: 0.6, fat: 5.5 },
      { foodId: "jamon-porc-fleury-michon", name: "Jambon Porc Rôti FM", grams: 26, kcal: 29.9, prot: 5.2, carbs: 0.3, fat: 0.9 },
      { foodId: "kefir-lactel-0-bio", name: "Kéfir Lactel 0%", grams: 100, kcal: 44.0, prot: 3.4, carbs: 4.1, fat: 1.5 },
      { foodId: "eafit-pure-isolate-vanille", name: "EAFit Vanille", grams: 11, kcal: 40.3, prot: 9.5, carbs: 0.4, fat: 0.1 },
      { foodId: "fresas-frescas", name: "Fresas", grams: 23, kcal: 7.4, prot: 0.2, carbs: 1.8, fat: 0.1 },
      { foodId: "semillas-chia", name: "Chia (1 cdita)", grams: 5, kcal: 24.3, prot: 0.9, carbs: 2.1, fat: 1.6 },
      { foodId: "ricotta-casa-azzurra", name: "Ricotta (1.5 cda)", grams: 22.5, kcal: 39.2, prot: 2.5, carbs: 0.7, fat: 2.9 },
      { foodId: "queso-maduro-espanol", name: "Queso Maduro Español", grams: 15, kcal: 60.0, prot: 3.8, carbs: 0.1, fat: 5.0 }
    ],
    timestamp: "2026-04-08T20:30:00"
  },
  // === ERNESTO 2026-04-08 (cont.) ===
  {
    id: "2026-04-08-004",
    date: "2026-04-08",
    meal: "cena",
    items: [
      { foodId: "clara-huevo", name: "Clara de Huevo (x2)", grams: 66, kcal: 34.3, prot: 7.3, carbs: 0.5, fat: 0.1 },
      { foodId: "huevo-entero", name: "Huevo Entero", grams: 50, units: 1, kcal: 77.5, prot: 6.5, carbs: 0.6, fat: 5.5 },
      { foodId: "jamon-porc-fleury-michon", name: "Jambon Porc Rôti FM", grams: 28, kcal: 32.2, prot: 5.6, carbs: 0.3, fat: 1.0 },
      { foodId: "kefir-lactel-0-bio", name: "Kéfir Lactel 0%", grams: 150, kcal: 66.0, prot: 5.1, carbs: 6.2, fat: 2.3 },
      { foodId: "eafit-pure-isolate-vanille", name: "EAFit Vanille", grams: 20, kcal: 73.2, prot: 17.2, carbs: 0.7, fat: 0.2 },
      { foodId: "fresas-frescas", name: "Fresas", grams: 41, kcal: 13.1, prot: 0.3, carbs: 3.2, fat: 0.1 },
      { foodId: "ricotta-casa-azzurra", name: "Ricotta (1.5 cda)", grams: 22.5, kcal: 39.2, prot: 2.5, carbs: 0.7, fat: 2.9 },
      { foodId: "queso-maduro-espanol", name: "Queso Maduro Español", grams: 30, kcal: 120.0, prot: 7.5, carbs: 0.2, fat: 9.9 }
    ],
    timestamp: "2026-04-08T20:30:00"
  },
  {
    id: "2026-04-08-005",
    date: "2026-04-08",
    meal: "snack",
    items: [
      { foodId: "wasa-leger", name: "Wasa Leger (x2)", grams: 19.2, units: 2, kcal: 64.9, prot: 1.7, carbs: 11.9, fat: 0.3 },
      { foodId: "danone-cottage-cheese", name: "Cottage Cheese", grams: 30, kcal: 27.0, prot: 3.6, carbs: 0.5, fat: 1.2 }
    ],
    timestamp: "2026-04-08T21:00:00"
  },
  // === 9 abril 2026 ===
  {
    id: "2026-04-09-001",
    date: "2026-04-09",
    meal: "desayuno",
    items: [
      { foodId: "cafe-negro", name: "Café", grams: 240, units: 1, kcal: 4.8, prot: 0.2, carbs: 0, fat: 0 },
      { foodId: "huevo-entero", name: "Huevo Entero", grams: 50, units: 1, kcal: 77.5, prot: 6.5, carbs: 0.6, fat: 5.5 },
      { foodId: "clara-huevo", name: "Clara de Huevo", grams: 33, units: 1, kcal: 17.2, prot: 3.6, carbs: 0.2, fat: 0.1 },
      { foodId: "ricotta-casa-azzurra", name: "Ricotta", grams: 30, kcal: 52.2, prot: 3.3, carbs: 0.9, fat: 3.9 },
      { foodId: "jamon-porc-fleury-michon", name: "Jambon Porc Rôti FM (1 rodaja)", grams: 28, units: 1, kcal: 32.2, prot: 5.6, carbs: 0.3, fat: 1.0 },
      { foodId: "aceite-oliva", name: "AOVE (1/3 tsp)", grams: 1.7, kcal: 15.0, prot: 0, carbs: 0, fat: 1.7 },
      { foodId: "wasa-fibre", name: "Wasa Fibre", grams: 11.4, units: 1, kcal: 38.0, prot: 1.5, carbs: 5.2, fat: 0.6 }
    ],
    timestamp: "2026-04-09T08:00:00"
  },
  {
    id: "2026-04-09-002",
    date: "2026-04-09",
    meal: "snack",
    items: [
      { foodId: "siggis-skyr-nature", name: "Skyr Siggis", grams: 50, kcal: 31.5, prot: 5.5, carbs: 2.0, fat: 0.1 },
      { foodId: "hipro-blueberry", name: "HiPro Blueberry", grams: 50, kcal: 26.5, prot: 4.7, carbs: 1.9, fat: 0 },
      { foodId: "fresas-frescas", name: "Fresas (x2)", grams: 24, units: 2, kcal: 7.7, prot: 0.2, carbs: 1.8, fat: 0.1 },
      { foodId: "semillas-chia", name: "Chia", grams: 1, kcal: 4.9, prot: 0.2, carbs: 0.4, fat: 0.3 },
      { foodId: "eafit-pure-isolate-vanille", name: "EAFit Vanille", grams: 40, kcal: 146.4, prot: 34.4, carbs: 1.3, fat: 0.4 },
      { foodId: "alpro-noisette-gourmande", name: "Lait Noisette", grams: 100, kcal: 29.0, prot: 0.4, carbs: 3.2, fat: 1.6 }
    ],
    timestamp: "2026-04-09T10:30:00"
  },
  {
    id: "2026-04-09-003",
    date: "2026-04-09",
    meal: "almuerzo",
    items: [
      { foodId: "rigatoni-cocida", name: "Rigatoni", grams: 80, kcal: 125.6, prot: 4.4, carbs: 24.8, fat: 0.7 },
      { foodId: "bavette-cocida", name: "Bavette", grams: 130, kcal: 204.1, prot: 7.2, carbs: 40.3, fat: 1.2 },
      { foodId: "ejote-haricot-vert", name: "Ejote Salteado", grams: 150, kcal: 46.5, prot: 2.7, carbs: 10.5, fat: 0.2 },
      { foodId: "aceite-sesamo", name: "Aceite de Sésamo (saltear)", grams: 5, kcal: 44.2, prot: 0, carbs: 0, fat: 5.0 },
      { foodId: "salsa-soya", name: "Salsa de Soya", grams: 5, kcal: 2.7, prot: 0.4, carbs: 0.2, fat: 0 },
      { foodId: "cebolla-cruda", name: "Cebolla", grams: 50, kcal: 20.0, prot: 0.6, carbs: 4.7, fat: 0.1 },
      { foodId: "maizena", name: "Maizena (espesar)", grams: 3, kcal: 11.4, prot: 0, carbs: 2.7, fat: 0 }
    ],
    timestamp: "2026-04-09T13:00:00"
  },
  {
    id: "2026-04-09-004",
    date: "2026-04-09",
    meal: "snack",
    items: [
      { foodId: "chocolate-negro-90", name: "Chocolate Negro 90%", grams: 7, kcal: 41.4, prot: 0.7, carbs: 1.0, fat: 3.9 },
      { foodId: "kefir-lactel-0-bio", name: "Kéfir Lactel 0%", grams: 125, kcal: 55.0, prot: 4.3, carbs: 5.1, fat: 1.9 },
      { foodId: "fruits-rouges-mix", name: "Fruits Rouges", grams: 60, kcal: 24.0, prot: 0.5, carbs: 5.4, fat: 0.2 },
      { foodId: "pp-vanilla-protein", name: "PP Vanilla", grams: 17, kcal: 63.8, prot: 13.6, carbs: 0.9, fat: 0.5 },
      { foodId: "leche-almendra", name: "Leche de Almendra", grams: 30, kcal: 3.9, prot: 0.1, carbs: 0.1, fat: 0.3 }
    ],
    timestamp: "2026-04-09T16:30:00"
  },
  {
    id: "2026-04-09-005",
    date: "2026-04-09",
    meal: "cena",
    items: [
      { foodId: "huevo-entero", name: "Huevo Entero (x2)", grams: 100, units: 2, kcal: 155.0, prot: 13.0, carbs: 1.1, fat: 11.0 },
      { foodId: "clara-huevo", name: "Clara de Huevo", grams: 33, units: 1, kcal: 17.2, prot: 3.6, carbs: 0.2, fat: 0.1 },
      { foodId: "tomate-triturado", name: "Tomate (6 cdas)", grams: 90, kcal: 21.6, prot: 0.9, carbs: 3.6, fat: 0.2 },
      { foodId: "cebolla-cruda", name: "Cebolla (2 tbsp)", grams: 30, kcal: 12.0, prot: 0.3, carbs: 2.8, fat: 0 },
      { foodId: "ciabatta-artesanal", name: "Ciabatta Artesanal", grams: 115, kcal: 311.7, prot: 10.4, carbs: 57.5, fat: 4.0 },
      { foodId: "danone-cottage-cheese", name: "Cottage", grams: 50, kcal: 45.0, prot: 6.0, carbs: 0.8, fat: 2.0 },
      { foodId: "ricotta-casa-azzurra", name: "Ricotta", grams: 30, kcal: 52.2, prot: 3.3, carbs: 0.9, fat: 3.9 }
    ],
    timestamp: "2026-04-09T20:30:00"
  },
  {
    id: "2026-04-09-006",
    date: "2026-04-09",
    meal: "snack",
    items: [
      { foodId: "eafit-pure-isolate-vanille", name: "EAFit Vanille", grams: 20, kcal: 73.2, prot: 17.2, carbs: 0.7, fat: 0.2 }
    ],
    timestamp: "2026-04-09T22:30:00"
  },
  {
    id: "2026-04-09-007",
    date: "2026-04-09",
    meal: "snack",
    items: [
      { foodId: "eafit-pure-isolate-vanille", name: "EAFit Vanille", grams: 20, kcal: 73.2, prot: 17.2, carbs: 0.7, fat: 0.2 },
      { foodId: "siggis-skyr-nature", name: "Skyr Siggis", grams: 70, kcal: 44.1, prot: 7.7, carbs: 2.8, fat: 0.1 }
    ],
    timestamp: "2026-04-09T23:00:00"
  },
  // === 9 abril 2026 - Adriana ===
  {
    id: "2026-04-09-A01",
    date: "2026-04-09",
    meal: "desayuno", who: "adriana",
    items: [
      { foodId: "hipro-vanille", name: "HiPro Vanille", grams: 154, kcal: 118.6, prot: 15.7, carbs: 9.1, fat: 1.2 },
      { foodId: "siggis-skyr-nature", name: "Skyr Siggis", grams: 100, kcal: 63.0, prot: 11.0, carbs: 4.0, fat: 0.2 },
      { foodId: "fruits-rouges-mix", name: "Fruits Rouges", grams: 32, kcal: 12.8, prot: 0.3, carbs: 2.9, fat: 0.1 },
      { foodId: "semillas-chia", name: "Chia", grams: 5, kcal: 24.3, prot: 0.9, carbs: 2.1, fat: 1.6 },
      { foodId: "blueberries-frescas", name: "Blueberries", grams: 19, kcal: 10.8, prot: 0.1, carbs: 2.8, fat: 0.1 },
      { foodId: "chocolate-negro-90", name: "Chocolate Negro 90%", grams: 10, kcal: 59.2, prot: 1.0, carbs: 1.4, fat: 5.5 }
    ],
    timestamp: "2026-04-09T08:00:00"
  },
  {
    id: "2026-04-09-A02",
    date: "2026-04-09",
    meal: "snack", who: "adriana",
    items: [
      { foodId: "sojasun-nature", name: "Sojasun Nature (1 pot)", grams: 100, units: 1, kcal: 41.0, prot: 4.6, carbs: 0, fat: 2.4 },
      { foodId: "blueberries-frescas", name: "Blueberries", grams: 50, kcal: 28.5, prot: 0.4, carbs: 7.3, fat: 0.2 }
    ],
    timestamp: "2026-04-09T10:30:00"
  },
  {
    id: "2026-04-09-A03",
    date: "2026-04-09",
    meal: "almuerzo", who: "adriana",
    items: [
      { foodId: "bavette-cocida", name: "Pasta", grams: 130, kcal: 204.1, prot: 7.2, carbs: 40.3, fat: 1.2 },
      { foodId: "rumsteck-boeuf-cuit", name: "Carne", grams: 80, kcal: 96.0, prot: 20.0, carbs: 0, fat: 1.6 },
      { foodId: "ejote-haricot-vert", name: "Ejotes", grams: 120, kcal: 37.2, prot: 2.2, carbs: 8.4, fat: 0.1 }
    ],
    timestamp: "2026-04-09T13:00:00"
  },
  {
    id: "2026-04-09-A04",
    date: "2026-04-09",
    meal: "snack", who: "adriana",
    items: [
      { foodId: "kefir-lactel-0-bio", name: "Kéfir Lactel 0%", grams: 125, kcal: 55.0, prot: 4.3, carbs: 5.1, fat: 1.9 },
      { foodId: "fruits-rouges-mix", name: "Fruits Rouges", grams: 60, kcal: 24.0, prot: 0.5, carbs: 5.4, fat: 0.2 },
      { foodId: "pp-vanilla-protein", name: "Proteina Vanilla", grams: 17, kcal: 63.8, prot: 13.6, carbs: 0.9, fat: 0.5 },
      { foodId: "leche-almendra", name: "Leche de Almendra", grams: 30, kcal: 3.9, prot: 0.1, carbs: 0.1, fat: 0.3 }
    ],
    timestamp: "2026-04-09T16:30:00"
  },
  {
    id: "2026-04-09-A05",
    date: "2026-04-09",
    meal: "cena", who: "adriana",
    items: [
      { foodId: "huevo-entero", name: "Huevo Entero (x2)", grams: 100, units: 2, kcal: 155.0, prot: 13.0, carbs: 1.1, fat: 11.0 },
      { foodId: "tomate-triturado", name: "Tomate (4 cdas)", grams: 60, kcal: 14.4, prot: 0.6, carbs: 2.4, fat: 0.1 },
      { foodId: "cebolla-cruda", name: "Cebolla (1.5 tbsp)", grams: 22.5, kcal: 9.0, prot: 0.2, carbs: 2.1, fat: 0 },
      { foodId: "ciabatta-artesanal", name: "Ciabatta", grams: 67, kcal: 181.6, prot: 6.0, carbs: 33.5, fat: 2.3 },
      { foodId: "danone-cottage-cheese", name: "Cottage (1.5 tbsp)", grams: 22.5, kcal: 20.3, prot: 2.7, carbs: 0.4, fat: 0.9 },
      { foodId: "ricotta-casa-azzurra", name: "Ricotta (5 tsp)", grams: 25, kcal: 43.5, prot: 2.8, carbs: 0.8, fat: 3.3 }
    ],
    timestamp: "2026-04-09T20:30:00"
  },
  // === ERNESTO 2026-04-10 ===
  {
    id: "2026-04-10-001",
    date: "2026-04-10",
    meal: "desayuno",
    items: [
      { foodId: "hipro-blueberry", name: "HiPro Blueberry (1/2)", grams: 80, kcal: 42.4, prot: 7.5, carbs: 3.0, fat: 0 },
      { foodId: "eafit-pure-isolate-vanille", name: "EAFit Vanille", grams: 40, kcal: 146.4, prot: 34.4, carbs: 1.3, fat: 0.4 },
      { foodId: "siggis-skyr-nature", name: "Skyr Siggis", grams: 100, kcal: 63.0, prot: 11.0, carbs: 4.0, fat: 0.2 },
      { foodId: "leche-almendra", name: "Lait Amande Alpro Sans Sucres", grams: 50, kcal: 6.5, prot: 0.2, carbs: 0.1, fat: 0.6 }
    ],
    timestamp: "2026-04-10T08:00:00"
  },
  {
    id: "2026-04-10-002",
    date: "2026-04-10",
    meal: "almuerzo",
    items: [
      { foodId: "salmorejo-alvalle", name: "Salmorejo", grams: 150, kcal: 81.0, prot: 1.8, carbs: 8.7, fat: 4.5 },
      { foodId: "ricotta-casa-azzurra", name: "Ricotta (1 tbsp)", grams: 15, kcal: 26.1, prot: 1.7, carbs: 0.5, fat: 2.0 },
      { foodId: "aceite-oliva", name: "AOVE (1/2 tsp)", grams: 2.5, kcal: 22.1, prot: 0, carbs: 0, fat: 2.5 },
      { foodId: "arroz-salteado", name: "Arroz Salteado", grams: 100, kcal: 150.0, prot: 3.2, carbs: 30.0, fat: 1.5 },
      { foodId: "mani-salado", name: "Maní Salado", grams: 13, kcal: 76.1, prot: 3.2, carbs: 2.1, fat: 6.4 },
      { foodId: "salsa-soya", name: "Salsa de Soya (1 cda)", grams: 15, kcal: 8.0, prot: 1.2, carbs: 0.7, fat: 0 },
      { foodId: "maizena", name: "Maizena", grams: 3, kcal: 11.4, prot: 0, carbs: 2.7, fat: 0 },
      { foodId: "rumsteck-boeuf-cuit", name: "Rumsteck de Boeuf", grams: 95, kcal: 114.0, prot: 23.8, carbs: 0, fat: 1.9 },
      { foodId: "pimiento-rojo-crudo", name: "Pimiento Rojo", grams: 140, kcal: 43.4, prot: 1.4, carbs: 8.4, fat: 0.4 },
      { foodId: "brocoli-cuit", name: "Brocoli", grams: 130, kcal: 45.5, prot: 3.9, carbs: 5.2, fat: 0.5 }
    ],
    timestamp: "2026-04-10T13:00:00"
  },
  {
    id: "2026-04-10-003",
    date: "2026-04-10",
    meal: "snack",
    items: [
      { foodId: "fresas-frescas", name: "Fresas (x2)", grams: 24, units: 2, kcal: 7.7, prot: 0.2, carbs: 1.8, fat: 0.1 }
    ],
    timestamp: "2026-04-10T16:00:00"
  },
  {
    id: "2026-04-10-004",
    date: "2026-04-10",
    meal: "cena",
    items: [
      { foodId: "spanakopita-light", name: "Spanakopita Light", grams: 440, kcal: 791.6, prot: 47.5, carbs: 29.0, fat: 53.2 },
      { foodId: "pan-banano-hp-chocolate", name: "Pan de Banano HP + Choc", grams: 125, kcal: 279.4, prot: 11.6, carbs: 42.1, fat: 7.4 },
      { foodId: "mantequilla-de-mani-menguys", name: "Peanut Butter Menguys", grams: 12, kcal: 70.6, prot: 3.0, carbs: 2.4, fat: 6.0 }
    ],
    timestamp: "2026-04-10T20:00:00"
  },
  // === ADRIANA 2026-04-10 ===
  {
    id: "2026-04-10-A01",
    date: "2026-04-10",
    meal: "desayuno", who: "adriana",
    items: [
      { foodId: "hipro-blueberry", name: "HiPro Blueberry", grams: 155, kcal: 82.2, prot: 14.6, carbs: 5.9, fat: 0 },
      { foodId: "siggis-skyr-nature", name: "Skyr", grams: 100, kcal: 63.0, prot: 11.0, carbs: 4.0, fat: 0.2 },
      { foodId: "semillas-chia", name: "Chia", grams: 5, kcal: 24.3, prot: 0.9, carbs: 2.1, fat: 1.6 },
      { foodId: "chocolate-negro-90", name: "Chocolate Negro 90%", grams: 10, kcal: 59.2, prot: 1.0, carbs: 1.4, fat: 5.5 },
      { foodId: "blueberries-frescas", name: "Blueberries", grams: 50, kcal: 28.5, prot: 0.4, carbs: 7.3, fat: 0.2 }
    ],
    timestamp: "2026-04-10T08:30:00"
  },
  {
    id: "2026-04-10-A02",
    date: "2026-04-10",
    meal: "snack", who: "adriana",
    items: [
      { foodId: "kefir-lactel-0-bio", name: "Kéfir Lactel 0%", grams: 125, kcal: 55.0, prot: 4.3, carbs: 5.1, fat: 1.9 },
      { foodId: "pp-vanilla-protein", name: "Proteina", grams: 13, kcal: 48.8, prot: 10.4, carbs: 0.7, fat: 0.4 },
      { foodId: "fresas-frescas", name: "Fresas", grams: 29, kcal: 9.3, prot: 0.2, carbs: 2.2, fat: 0.1 },
      { foodId: "wasa-leger", name: "Wasa Leger x2", grams: 19.2, units: 2, kcal: 64.9, prot: 1.7, carbs: 11.9, fat: 0.3 },
      { foodId: "ricotta-casa-azzurra", name: "Ricotta (2 tbsp)", grams: 30, kcal: 52.2, prot: 3.3, carbs: 0.9, fat: 3.9 }
    ],
    timestamp: "2026-04-10T11:00:00"
  },
  {
    id: "2026-04-10-A03",
    date: "2026-04-10",
    meal: "snack", who: "adriana",
    items: [
      { foodId: "wasa-leger", name: "Wasa Leger x1", grams: 9.6, units: 1, kcal: 32.4, prot: 0.9, carbs: 6.0, fat: 0.1 },
      { foodId: "ricotta-casa-azzurra", name: "Ricotta (1 tbsp)", grams: 15, kcal: 26.1, prot: 1.7, carbs: 0.5, fat: 2.0 },
      { foodId: "almendras-enteras", name: "Almendras x5", grams: 6, units: 5, kcal: 34.6, prot: 1.3, carbs: 1.3, fat: 2.9 }
    ],
    timestamp: "2026-04-10T15:00:00"
  },
  {
    id: "2026-04-10-A04",
    date: "2026-04-10",
    meal: "almuerzo", who: "adriana",
    items: [
      { foodId: "salmorejo-alvalle", name: "Salmorejo", grams: 100, kcal: 54.0, prot: 1.2, carbs: 5.8, fat: 3.0 },
      { foodId: "ricotta-casa-azzurra", name: "Ricotta (1 tbsp)", grams: 15, kcal: 26.1, prot: 1.7, carbs: 0.5, fat: 2.0 },
      { foodId: "aceite-oliva", name: "AOVE (1/2 tsp)", grams: 2.5, kcal: 22.1, prot: 0, carbs: 0, fat: 2.5 },
      { foodId: "arroz-salteado", name: "Arroz Salteado", grams: 50, kcal: 75.0, prot: 1.6, carbs: 15.0, fat: 0.8 },
      { foodId: "rumsteck-boeuf-cuit", name: "Carne", grams: 47, kcal: 56.4, prot: 11.8, carbs: 0, fat: 0.9 },
      { foodId: "pimiento-rojo-crudo", name: "Chiles", grams: 31, kcal: 9.6, prot: 0.3, carbs: 1.9, fat: 0.1 },
      { foodId: "brocoli-cuit", name: "Brocoli al vapor", grams: 57, kcal: 20.0, prot: 1.7, carbs: 2.3, fat: 0.2 }
    ],
    timestamp: "2026-04-10T13:00:00"
  },
  {
    id: "2026-04-10-A05",
    date: "2026-04-10",
    meal: "cena", who: "adriana",
    items: [
      { foodId: "spanakopita-light", name: "Spanakopita Light", grams: 309, kcal: 555.9, prot: 33.4, carbs: 20.4, fat: 37.4 },
      { foodId: "pan-banano-hp-chocolate", name: "Pan de Banano HP + Choc", grams: 102, kcal: 228.0, prot: 9.5, carbs: 34.4, fat: 6.0 },
      { foodId: "mantequilla-de-mani-menguys", name: "Peanut Butter Menguys", grams: 7, kcal: 41.2, prot: 1.8, carbs: 1.4, fat: 3.5 }
    ],
    timestamp: "2026-04-10T20:00:00"
  },
  // === ERNESTO 2026-04-11 ===
  {
    id: "2026-04-11-001",
    date: "2026-04-11",
    meal: "desayuno",
    items: [
      { foodId: "kefir-lactel-0-bio", name: "Kéfir Lactel 0%", grams: 150, kcal: 66.0, prot: 5.1, carbs: 6.2, fat: 2.3 },
      { foodId: "eafit-pure-isolate-vanille", name: "EAFit Vanille", grams: 20, kcal: 73.2, prot: 17.2, carbs: 0.7, fat: 0.2 },
      { foodId: "fresas-frescas", name: "Fresas", grams: 55, kcal: 17.6, prot: 0.4, carbs: 4.2, fat: 0.2 },
      { foodId: "eafit-pure-isolate-chocolat", name: "EAFit Chocolat", grams: 25, kcal: 88.5, prot: 20.3, carbs: 0.9, fat: 0.4 }
    ],
    timestamp: "2026-04-11T08:00:00"
  },
  {
    id: "2026-04-11-002",
    date: "2026-04-11",
    meal: "almuerzo",
    items: [
      { foodId: "eafit-pure-isolate-chocolat", name: "EAFit Chocolat", grams: 40, kcal: 141.6, prot: 32.4, carbs: 1.5, fat: 0.6 },
      { foodId: "siggis-skyr-nature", name: "Skyr Siggis", grams: 50, kcal: 31.5, prot: 5.5, carbs: 2.0, fat: 0.1 },
      { foodId: "patate-cuite", name: "Pomme de Terre", grams: 160, kcal: 139.2, prot: 3.0, carbs: 32.0, fat: 0.2 },
      { foodId: "cuisse-poulet-cuite", name: "Cuisses de Poulet sin piel (300g con hueso)", grams: 150, kcal: 258.0, prot: 39.0, carbs: 0, fat: 10.5 },
      { foodId: "aceite-oliva", name: "AOVE (1/2 cdita)", grams: 2.5, kcal: 22.1, prot: 0, carbs: 0, fat: 2.5 },
      { foodId: "tomate-cherry", name: "Tomate Cherry", grams: 50, kcal: 9.0, prot: 0.5, carbs: 2.0, fat: 0.1 },
      { foodId: "pan-banano-hp-chocolate", name: "Banana Bread HP", grams: 75, kcal: 167.6, prot: 7.0, carbs: 25.3, fat: 4.4 }
    ],
    timestamp: "2026-04-11T13:00:00"
  },
  {
    id: "2026-04-11-003",
    date: "2026-04-11",
    meal: "snack",
    items: [
      { foodId: "spanakopita-light", name: "Spanakopita Light", grams: 125, kcal: 224.9, prot: 13.5, carbs: 8.3, fat: 15.1 },
      { foodId: "kebab-veau-maison", name: "Kebab Veau Maison", grams: 150, kcal: 270.0, prot: 37.5, carbs: 1.5, fat: 12.8 }
    ],
    timestamp: "2026-04-11T16:00:00"
  },
  {
    id: "2026-04-11-004",
    date: "2026-04-11",
    meal: "cena",
    items: [
      { foodId: "girasoli-burrata-basilic-picard", name: "Girasoli Burrata Picard", grams: 113, kcal: 204.5, prot: 9.5, carbs: 28.3, fat: 5.4 },
      { foodId: "tomate-triturado", name: "Salsa Tomate Natural", grams: 50, kcal: 12.0, prot: 0.5, carbs: 2.0, fat: 0.1 },
      { foodId: "queso-maduro-espanol", name: "Queso Maduro Español", grams: 15, kcal: 60.0, prot: 3.8, carbs: 0.1, fat: 5.0 },
      { foodId: "aceite-oliva", name: "AOVE (1/3 tsp)", grams: 1.7, kcal: 15.0, prot: 0, carbs: 0, fat: 1.7 },
      { foodId: "pan-banano-hp-chocolate", name: "Banana Bread HP", grams: 50, kcal: 111.8, prot: 4.7, carbs: 16.9, fat: 3.0 }
    ],
    timestamp: "2026-04-11T20:30:00"
  },
  // === ADRIANA 2026-04-11 ===
  {
    id: "2026-04-11-A01",
    date: "2026-04-11",
    meal: "desayuno", who: "adriana",
    items: [
      { foodId: "kefir-lactel-0-bio", name: "Kéfir Lactel 0%", grams: 125, kcal: 55.0, prot: 4.3, carbs: 5.1, fat: 1.9 },
      { foodId: "pp-vanilla-protein", name: "Proteina", grams: 15, kcal: 56.3, prot: 12.0, carbs: 0.8, fat: 0.5 },
      { foodId: "fresas-frescas", name: "Fresas", grams: 36, kcal: 11.5, prot: 0.3, carbs: 2.8, fat: 0.1 }
    ],
    timestamp: "2026-04-11T08:30:00"
  },
  {
    id: "2026-04-11-A02",
    date: "2026-04-11",
    meal: "almuerzo", who: "adriana",
    items: [
      { foodId: "saumon-benny-kozy", name: "Saumon Benny (Kozy Paris)", grams: 340, kcal: 545.0, prot: 28.0, carbs: 41.5, fat: 29.0 }
    ],
    timestamp: "2026-04-11T12:00:00"
  },
  {
    id: "2026-04-11-A03",
    date: "2026-04-11",
    meal: "snack", who: "adriana",
    items: [
      { foodId: "pan-banano-hp-chocolate", name: "Pan de Banano HP", grams: 16, kcal: 35.8, prot: 1.5, carbs: 5.4, fat: 0.9 },
      { foodId: "siggis-skyr-raspberry", name: "Siggis Framboise (3 tsp)", grams: 15, kcal: 11.0, prot: 1.5, carbs: 1.2, fat: 0 },
      { foodId: "pan-banano-hp-chocolate", name: "Pan de Banano HP", grams: 36, kcal: 80.5, prot: 3.3, carbs: 12.1, fat: 2.1 }
    ],
    timestamp: "2026-04-11T15:00:00"
  },
  {
    id: "2026-04-11-A04",
    date: "2026-04-11",
    meal: "cena", who: "adriana",
    items: [
      { foodId: "girasoli-burrata-basilic-picard", name: "Girasoli Burrata Picard", grams: 226, kcal: 409.1, prot: 19.0, carbs: 56.5, fat: 10.8 },
      { foodId: "pan-banano-hp-chocolate", name: "Banana Bread HP", grams: 120, kcal: 268.2, prot: 11.2, carbs: 40.4, fat: 7.1 }
    ],
    timestamp: "2026-04-11T20:30:00"
  },
  // === ERNESTO 2026-04-12 ===
  {
    id: "2026-04-12-001",
    date: "2026-04-12",
    meal: "snack",
    items: [
      { foodId: "eafit-pure-isolate-chocolat", name: "EAFit Chocolat", grams: 20, kcal: 70.8, prot: 16.2, carbs: 0.7, fat: 0.3 }
    ],
    timestamp: "2026-04-12T01:00:00"
  },
  {
    id: "2026-04-12-002",
    date: "2026-04-12",
    meal: "desayuno",
    items: [
      { foodId: "pancake-avena-chocolate-hp", name: "Pancake Avena Choc HP", grams: 105, kcal: 121.6, prot: 14.0, carbs: 15.6, fat: 2.0 },
      { foodId: "banana-fresca", name: "Banano", grams: 36, kcal: 32.0, prot: 0.4, carbs: 8.2, fat: 0.1 },
      { foodId: "mantequilla-de-mani-menguys", name: "Peanut Butter", grams: 5, kcal: 29.4, prot: 1.3, carbs: 1.0, fat: 2.5 }
    ],
    timestamp: "2026-04-12T09:00:00"
  },
  {
    id: "2026-04-12-003",
    date: "2026-04-12",
    meal: "snack",
    items: [
      { foodId: "shake-strawberry-blueberry-protein", name: "Strawberry Blueberry Protein Shake", grams: 120, kcal: 92.9, prot: 13.0, carbs: 7.3, fat: 1.6 }
    ],
    timestamp: "2026-04-12T11:00:00"
  },
  {
    id: "2026-04-12-004",
    date: "2026-04-12",
    meal: "almuerzo",
    items: [
      { foodId: "kebab-veau-maison", name: "Kebab Veau (sobras)", grams: 60, kcal: 108.0, prot: 15.0, carbs: 0.6, fat: 5.1 },
      { foodId: "quinoa-cocida", name: "Quinoa Cocida", grams: 63, kcal: 75.6, prot: 2.8, carbs: 13.4, fat: 1.2 },
      { foodId: "spanakopita", name: "Spanakopita", grams: 122, kcal: 170.6, prot: 7.4, carbs: 8.2, fat: 12.3 },
      { foodId: "ejotes-cocidos", name: "Ejotes", grams: 103, kcal: 36.1, prot: 2.0, carbs: 8.1, fat: 0.3 }
    ],
    timestamp: "2026-04-12T13:00:00"
  },
  {
    id: "2026-04-12-005",
    date: "2026-04-12",
    meal: "snack",
    items: [
      { foodId: "holy-cookie-pistachio", name: "Holy Cookie Pistachio (1/2)", grams: 90, kcal: 443.7, prot: 10.2, carbs: 31.9, fat: 29.7 }
    ],
    timestamp: "2026-04-12T16:00:00"
  },
  {
    id: "2026-04-12-006",
    date: "2026-04-12",
    meal: "cena",
    items: [
      { foodId: "huevo-entero", name: "Huevo Entero", grams: 50, units: 1, kcal: 77.5, prot: 6.5, carbs: 0.6, fat: 5.5 },
      { foodId: "jamon-porc-fleury-michon", name: "Jamon", grams: 25, kcal: 28.8, prot: 5.0, carbs: 0.3, fat: 0.9 },
      { foodId: "aceite-oliva", name: "Aceite de Oliva", grams: 2.5, kcal: 22.1, prot: 0.0, carbs: 0.0, fat: 2.5 },
      { foodId: "danone-cottage-cheese", name: "Cottage Cheese", grams: 50, kcal: 45.0, prot: 6.0, carbs: 0.8, fat: 2.0 },
      { foodId: "ricotta-casa-azzurra", name: "Ricotta", grams: 7.5, kcal: 11.3, prot: 0.6, carbs: 0.1, fat: 0.9 },
      { foodId: "wasa-fibre", name: "Wasa Fibre", grams: 14, units: 1, kcal: 47.6, prot: 1.4, carbs: 8.1, fat: 0.4 }
    ],
    timestamp: "2026-04-12T20:00:00"
  },
  {
    id: "2026-04-12-007",
    date: "2026-04-12",
    meal: "cena",
    items: [
      { foodId: "kefir-lactel-0-bio", name: "Kéfir Lactel 0%", grams: 100, kcal: 44.0, prot: 3.4, carbs: 4.1, fat: 1.5 },
      { foodId: "siggis-skyr-nature", name: "Skyr", grams: 50, kcal: 31.5, prot: 5.5, carbs: 2.0, fat: 0.1 },
      { foodId: "eafit-pure-isolate-vanille", name: "EAFit Vainilla", grams: 50, kcal: 183.0, prot: 43.0, carbs: 1.7, fat: 0.5 },
      { foodId: "fresas-frescas", name: "Fresas", grams: 63, kcal: 20.2, prot: 0.4, carbs: 4.9, fat: 0.2 }
    ],
    timestamp: "2026-04-12T20:30:00"
  },
  // === ADRIANA 2026-04-12 ===
  {
    id: "2026-04-12-A01",
    date: "2026-04-12",
    meal: "desayuno", who: "adriana",
    items: [
      { foodId: "pancake-avena-chocolate-hp", name: "Pancake Avena Choc HP", grams: 83, kcal: 96.1, prot: 11.0, carbs: 12.4, fat: 1.6 },
      { foodId: "mantequilla-de-mani-menguys", name: "Peanut Butter", grams: 5, kcal: 29.4, prot: 1.3, carbs: 1.0, fat: 2.5 }
    ],
    timestamp: "2026-04-12T09:00:00"
  },
  {
    id: "2026-04-12-A02",
    date: "2026-04-12",
    meal: "snack", who: "adriana",
    items: [
      { foodId: "shake-strawberry-blueberry-protein", name: "Strawberry Blueberry Protein Shake", grams: 120, kcal: 92.9, prot: 13.0, carbs: 7.3, fat: 1.6 }
    ],
    timestamp: "2026-04-12T11:00:00"
  },
  {
    id: "2026-04-12-A03",
    date: "2026-04-12",
    meal: "almuerzo", who: "adriana",
    items: [
      { foodId: "kebab-veau-maison", name: "Kebab Veau (sobras)", grams: 57, kcal: 102.6, prot: 14.3, carbs: 0.6, fat: 4.8 },
      { foodId: "quinoa-cocida", name: "Quinoa Cocida", grams: 40, kcal: 48.0, prot: 1.8, carbs: 8.5, fat: 0.8 },
      { foodId: "spanakopita", name: "Spanakopita", grams: 102, kcal: 142.6, prot: 6.2, carbs: 6.8, fat: 10.3 },
      { foodId: "ejotes-cocidos", name: "Ejotes", grams: 53, kcal: 18.6, prot: 1.0, carbs: 4.2, fat: 0.2 }
    ],
    timestamp: "2026-04-12T13:00:00"
  },
  {
    id: "2026-04-12-A04",
    date: "2026-04-12",
    meal: "snack", who: "adriana",
    items: [
      { foodId: "holy-cookie-pistachio", name: "Holy Cookie Pistachio (1/2)", grams: 90, kcal: 443.7, prot: 10.2, carbs: 31.9, fat: 29.7 },
      { foodId: "chocolate-negro-90", name: "Chocolate Negro 90%", grams: 6, kcal: 35.5, prot: 0.6, carbs: 0.8, fat: 3.3 }
    ],
    timestamp: "2026-04-12T16:00:00"
  },
  {
    id: "2026-04-12-A05",
    date: "2026-04-12",
    meal: "cena", who: "adriana",
    items: [
      { foodId: "huevo-entero", name: "Huevo Entero", grams: 50, units: 1, kcal: 77.5, prot: 6.5, carbs: 0.6, fat: 5.5 },
      { foodId: "jamon-porc-fleury-michon", name: "Jamon", grams: 25, kcal: 28.8, prot: 5.0, carbs: 0.3, fat: 0.9 },
      { foodId: "aceite-oliva", name: "Aceite de Oliva", grams: 2.5, kcal: 22.1, prot: 0.0, carbs: 0.0, fat: 2.5 },
      { foodId: "danone-cottage-cheese", name: "Cottage Cheese", grams: 50, kcal: 45.0, prot: 6.0, carbs: 0.8, fat: 2.0 },
      { foodId: "ricotta-casa-azzurra", name: "Ricotta", grams: 7.5, kcal: 11.3, prot: 0.6, carbs: 0.1, fat: 0.9 },
      { foodId: "wasa-fibre", name: "Wasa Fibre", grams: 14, units: 1, kcal: 47.6, prot: 1.4, carbs: 8.1, fat: 0.4 }
    ],
    timestamp: "2026-04-12T20:00:00"
  },
  {
    id: "2026-04-12-A06",
    date: "2026-04-12",
    meal: "cena", who: "adriana",
    items: [
      { foodId: "kefir-lactel-0-bio", name: "Kéfir Lactel 0%", grams: 125, kcal: 55.0, prot: 4.3, carbs: 5.1, fat: 1.9 },
      { foodId: "siggis-skyr-nature", name: "Skyr", grams: 47, kcal: 29.6, prot: 5.2, carbs: 1.9, fat: 0.1 },
      { foodId: "eafit-pure-isolate-vanille", name: "EAFit Vainilla", grams: 20, kcal: 73.2, prot: 17.2, carbs: 0.7, fat: 0.2 },
      { foodId: "fresas-frescas", name: "Fresas", grams: 66, kcal: 21.1, prot: 0.5, carbs: 5.1, fat: 0.2 }
    ],
    timestamp: "2026-04-12T20:30:00"
  },
  // === ERNESTO 2026-04-13 ===
  {
    id: "2026-04-13-001",
    date: "2026-04-13",
    meal: "desayuno",
    items: [
      { foodId: "hipro-coco", name: "HiPro Coco", grams: 160, kcal: 89.6, prot: 15.0, carbs: 5.9, fat: 0.6 },
      { foodId: "siggis-skyr-nature", name: "Skyr", grams: 40, kcal: 25.2, prot: 4.4, carbs: 1.6, fat: 0.1 },
      { foodId: "eafit-pure-isolate-chocolat", name: "EAFit Chocolat", grams: 40, kcal: 141.6, prot: 32.4, carbs: 1.5, fat: 0.6 },
      { foodId: "banana-fresca", name: "Banano", grams: 45, kcal: 40.1, prot: 0.5, carbs: 10.3, fat: 0.1 }
    ],
    timestamp: "2026-04-13T09:00:00"
  },
  {
    id: "2026-04-13-002",
    date: "2026-04-13",
    meal: "almuerzo",
    items: [
      { foodId: "spanakopita", name: "Spanakopita", grams: 80, kcal: 111.8, prot: 4.9, carbs: 5.4, fat: 8.1 },
      { foodId: "pasta-pollo-espinaca-tomate-adri", name: "Pasta Pollo Espinaca Tomate", grams: 260, kcal: 224.6, prot: 34.6, carbs: 10.4, fat: 3.9 }
    ],
    timestamp: "2026-04-13T13:00:00"
  },
  {
    id: "2026-04-13-003",
    date: "2026-04-13",
    meal: "snack",
    items: [
      { foodId: "wasa-leger", name: "Wasa Leger", grams: 19.2, units: 2, kcal: 64.9, prot: 1.7, carbs: 11.9, fat: 0.3 },
      { foodId: "ricotta-casa-azzurra", name: "Ricotta", grams: 40, kcal: 60.0, prot: 3.2, carbs: 0.5, fat: 4.8 },
      { foodId: "mermelada-lucien-fraises-sans-sucres", name: "Mermelada Fraises Lucien", grams: 20, kcal: 17.8, prot: 0.1, carbs: 4.3, fat: 0.1 }
    ],
    timestamp: "2026-04-13T16:00:00"
  },
  {
    id: "2026-04-13-004",
    date: "2026-04-13",
    meal: "cena",
    items: [
      { foodId: "quiche-brocoli-salmon-ricotta", name: "Quiche Brocoli Salmon", grams: 385, kcal: 456.6, prot: 37.3, carbs: 13.9, fat: 27.7 },
      { foodId: "ricotta-casa-azzurra", name: "Ricotta", grams: 63, kcal: 94.5, prot: 5.0, carbs: 0.8, fat: 7.6 }
    ],
    timestamp: "2026-04-13T20:00:00"
  },
  {
    id: "2026-04-13-005",
    date: "2026-04-13",
    meal: "snack",
    items: [
      { foodId: "kefir-lactel-0-bio", name: "Kefir Lactel 0 Bio", grams: 126, kcal: 55.4, prot: 4.3, carbs: 5.2, fat: 1.9 },
      { foodId: "siggis-skyr-nature", name: "Skyr Siggis", grams: 53, kcal: 33.4, prot: 5.8, carbs: 2.1, fat: 0.1 },
      { foodId: "eafit-pure-isolate-chocolat", name: "EAFit Chocolat", grams: 40, kcal: 141.6, prot: 32.4, carbs: 1.5, fat: 0.6 },
      { foodId: "banana-fresca", name: "Banano", grams: 52, kcal: 46.3, prot: 0.6, carbs: 11.9, fat: 0.2 },
      { foodId: "weider-peanut-butter-powder", name: "Weider PB Powder", grams: 5, kcal: 22.0, prot: 2.5, carbs: 1.0, fat: 0.7 }
    ],
    timestamp: "2026-04-13T21:00:00"
  },
  {
    id: "2026-04-13-006",
    date: "2026-04-13",
    meal: "snack",
    items: [
      { foodId: "wasa-fibre", name: "Wasa Fibre", grams: 14, units: 1, kcal: 47.6, prot: 1.4, carbs: 8.1, fat: 0.4 },
      { foodId: "danone-cottage-cheese", name: "Cottage Cheese", grams: 30, kcal: 27.0, prot: 3.6, carbs: 0.5, fat: 1.2 },
      { foodId: "remolacha-cocida", name: "Remolacha", grams: 150, kcal: 66.0, prot: 2.6, carbs: 15.0, fat: 0.2 }
    ],
    timestamp: "2026-04-13T22:00:00"
  },
  // === ADRIANA 2026-04-13 ===
  {
    id: "2026-04-13-A01",
    date: "2026-04-13",
    meal: "desayuno", who: "adriana",
    items: [
      { foodId: "chocolate-negro-90", name: "Chocolate Negro 90%", grams: 10, kcal: 59.2, prot: 1.0, carbs: 1.4, fat: 5.5 },
      { foodId: "hipro-blueberry", name: "HiPro Blueberry", grams: 155, kcal: 82.2, prot: 14.6, carbs: 5.9, fat: 0 },
      { foodId: "siggis-skyr-nature", name: "Skyr Siggis", grams: 33, kcal: 20.8, prot: 3.6, carbs: 1.3, fat: 0.1 },
      { foodId: "blueberries-frescas", name: "Blueberries", grams: 50, kcal: 28.5, prot: 0.4, carbs: 7.3, fat: 0.2 }
    ],
    timestamp: "2026-04-13T09:00:00"
  },
  {
    id: "2026-04-13-A02",
    date: "2026-04-13",
    meal: "almuerzo", who: "adriana",
    items: [
      { foodId: "pasta-pollo-espinaca-tomate-adri", name: "Pasta Pollo Espinaca Tomate", grams: 135, kcal: 116.6, prot: 18.0, carbs: 5.4, fat: 2.0 }
    ],
    timestamp: "2026-04-13T13:00:00"
  },
  {
    id: "2026-04-13-A03",
    date: "2026-04-13",
    meal: "snack", who: "adriana",
    items: [
      { foodId: "kefir-lactel-0-bio", name: "Kéfir Lactel 0%", grams: 125, kcal: 55.0, prot: 4.3, carbs: 5.1, fat: 1.9 },
      { foodId: "siggis-skyr-nature", name: "Skyr Siggis", grams: 42, kcal: 26.5, prot: 4.6, carbs: 1.7, fat: 0.1 },
      { foodId: "eafit-pure-isolate-chocolat", name: "EAFit Chocolat", grams: 22, kcal: 77.9, prot: 17.8, carbs: 0.8, fat: 0.4 },
      { foodId: "banana-fresca", name: "Banano", grams: 33, kcal: 29.4, prot: 0.4, carbs: 7.5, fat: 0.1 },
      { foodId: "weider-peanut-butter-powder", name: "Weider PB Powder", grams: 5, kcal: 22.0, prot: 2.5, carbs: 1.0, fat: 0.7 }
    ],
    timestamp: "2026-04-13T16:00:00"
  },
  {
    id: "2026-04-13-A04",
    date: "2026-04-13",
    meal: "snack", who: "adriana",
    items: [
      { foodId: "pan-banano-hp-chocolate", name: "Banana Bread HP", grams: 50, kcal: 111.8, prot: 4.7, carbs: 16.9, fat: 3.0 }
    ],
    timestamp: "2026-04-13T17:00:00"
  },
  {
    id: "2026-04-13-A05",
    date: "2026-04-13",
    meal: "cena", who: "adriana",
    items: [
      { foodId: "quiche-brocoli-salmon-ricotta", name: "Quiche Brocoli Salmon", grams: 245, kcal: 290.6, prot: 23.8, carbs: 8.8, fat: 17.6 },
      { foodId: "ricotta-casa-azzurra", name: "Ricotta", grams: 53, kcal: 79.5, prot: 4.2, carbs: 0.6, fat: 6.4 }
    ],
    timestamp: "2026-04-13T20:00:00"
  },
  // === 2026-04-14 - Adriana ===
  {
    id: "2026-04-14-A01",
    date: "2026-04-14",
    meal: "desayuno", who: "adriana",
    items: [
      { foodId: "kefir-lactel-0-bio", name: "Kéfir Lactel 0%", grams: 200, kcal: 88.0, prot: 6.8, carbs: 8.2, fat: 3.0 },
      { foodId: "siggis-skyr-nature", name: "Skyr Siggis", grams: 40, kcal: 25.2, prot: 4.4, carbs: 1.6, fat: 0.1 },
      { foodId: "fresas-frescas", name: "Fresas", grams: 30, kcal: 9.6, prot: 0.2, carbs: 2.3, fat: 0.1 },
      { foodId: "fruits-rouges-mix", name: "Frutos Rojos", grams: 20, kcal: 8.0, prot: 0.2, carbs: 1.8, fat: 0.1 },
      { foodId: "eafit-pure-isolate-vanille", name: "EAFIT Vanilla", grams: 40, kcal: 146.4, prot: 34.4, carbs: 1.3, fat: 0.4 },
      { foodId: "semillas-chia", name: "Chia", grams: 5, kcal: 24.3, prot: 0.9, carbs: 2.1, fat: 1.6 }
    ],
    timestamp: "2026-04-14T08:30:00"
  },
  {
    id: "2026-04-14-A02",
    date: "2026-04-14",
    meal: "snack", who: "adriana",
    items: [
      { foodId: "semillas-maranon", name: "Semillas de Marañon", grams: 10, kcal: 55.3, prot: 1.8, carbs: 3.0, fat: 4.4 }
    ],
    timestamp: "2026-04-14T11:00:00"
  },
  {
    id: "2026-04-14-A03",
    date: "2026-04-14",
    meal: "almuerzo", who: "adriana",
    items: [
      { foodId: "rigatoni-cocida", name: "Pasta Cocida", grams: 50, kcal: 78.5, prot: 2.8, carbs: 15.5, fat: 0.5 },
      { foodId: "espinaca-congelada", name: "Salsa Espinaca", grams: 75, kcal: 17.3, prot: 1.9, carbs: 1.1, fat: 0.3 },
      { foodId: "pollo-pechuga-horneada", name: "Pollo", grams: 75, kcal: 123.8, prot: 23.3, carbs: 0.0, fat: 2.7 },
      { foodId: "danone-cottage-cheese", name: "Cottage Cheese", grams: 150, kcal: 135.0, prot: 18.0, carbs: 2.4, fat: 5.9 }
    ],
    timestamp: "2026-04-14T13:00:00"
  },
  {
    id: "2026-04-14-A04",
    date: "2026-04-14",
    meal: "snack", who: "adriana",
    items: [
      { foodId: "kefir-lactel-0-bio", name: "Kéfir Lactel 0%", grams: 300, kcal: 132.0, prot: 10.2, carbs: 12.3, fat: 4.5 }
    ],
    timestamp: "2026-04-14T10:00:00"
  },
  // === 2026-04-14 - Ernesto ===
  {
    id: "2026-04-14-001",
    date: "2026-04-14",
    meal: "desayuno",
    items: [
      { foodId: "kefir-lactel-0-bio", name: "Kéfir Lactel 0%", grams: 200, kcal: 88.0, prot: 6.8, carbs: 8.2, fat: 3.0 },
      { foodId: "siggis-skyr-nature", name: "Skyr Siggis", grams: 50, kcal: 31.5, prot: 5.5, carbs: 2.0, fat: 0.1 },
      { foodId: "fresas-frescas", name: "Fresas", grams: 30, kcal: 9.6, prot: 0.2, carbs: 2.3, fat: 0.1 },
      { foodId: "fruits-rouges-mix", name: "Frutos Rojos", grams: 30, kcal: 12.0, prot: 0.2, carbs: 2.7, fat: 0.1 },
      { foodId: "eafit-pure-isolate-vanille", name: "EAFIT Vanilla", grams: 40, kcal: 146.4, prot: 34.4, carbs: 1.3, fat: 0.4 }
    ],
    timestamp: "2026-04-14T08:30:00"
  },
  {
    id: "2026-04-14-002",
    date: "2026-04-14",
    meal: "almuerzo",
    items: [
      { foodId: "quiche-brocoli-salmon-ricotta", name: "Quiche Saumon Brocoli", grams: 30, kcal: 35.6, prot: 2.9, carbs: 1.1, fat: 2.2 },
      { foodId: "patatas-horneadas", name: "Patatas Horneadas", grams: 100, kcal: 93.0, prot: 2.5, carbs: 21.0, fat: 0.1 },
      { foodId: "pasta-pollo-espinaca-tomate-adri", name: "Pasta Pollo Espinaca", grams: 180, kcal: 155.5, prot: 23.9, carbs: 7.2, fat: 2.7 }
    ],
    timestamp: "2026-04-14T13:00:00"
  }

];

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
  { date: "2026-04-07", steps: 6755, stepsKcal: 175, gym: null, gymKcal: 0, notes: "" },
  { date: "2026-04-08", steps: 6368, stepsKcal: 175, gym: "gym", gymKcal: 601, notes: "" },
  { date: "2026-04-09", steps: 10000, stepsKcal: 300, gym: "caminar rapido", gymKcal: 265, notes: "" },
  { date: "2026-04-10", steps: 10017, stepsKcal: 300, gym: null, gymKcal: 0, notes: "" },
  { date: "2026-04-11", steps: 10624, stepsKcal: 300, gym: "gym", gymKcal: 551, notes: "" },
  { date: "2026-04-12", steps: 12870, stepsKcal: 375, gym: "gym", gymKcal: 478, notes: "" }
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
  },
  {
    date: "2026-04-10",
    weight: 87.15,
    bmi: 28.5,
    bodyFat: null, fatFreeWeight: null, subcutFat: null, visceralFat: null,
    bodyWater: null, skeletalMuscle: null, muscleMass: null, boneMass: null,
    bmr: null, metabolicAge: null,
    source: "manual",
    notes: ""
  }
];
