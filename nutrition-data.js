// NutrIA - Nutrition Tracker Data
// Updated by Claude Code via /log-food skill
// DO NOT EDIT MANUALLY - use /log-food to add meals

const DATA_TIMESTAMP = "2026-04-07T11:00:00 Europe/Paris";

const NUTRITION_CONFIG = {
  targets: { kcal: 1770, prot: 190, carbs: 140, fat: 50 },
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

// Meal log - each entry is one meal occasion
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
    id: "2026-04-01-005",
    date: "2026-04-01",
    meal: "snack",
    items: [
      { foodId: "ricotta-casa-azzurra", name: "Ricotta Casa Azzurra", grams: 25, kcal: 43.5, prot: 2.8, carbs: 0.8, fat: 3.3 },
      { foodId: "aguacate-fresco", name: "Aguacate Fresco", grams: 25, kcal: 40.0, prot: 0.5, carbs: 2.1, fat: 3.7 },
      { foodId: "fresas-frescas", name: "Fresas Frescas (4 ud.)", grams: 48, kcal: 15.4, prot: 0.3, carbs: 3.7, fat: 0.1 }
    ],
    timestamp: "2026-04-01T22:00:00"
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
    id: "2026-04-02-001",
    date: "2026-04-02",
    meal: "desayuno",
    items: [
      { foodId: "siggis-skyr-nature", name: "Skyr Siggis Nature", grams: 50, kcal: 31.5, prot: 5.5, carbs: 2.0, fat: 0.1 },
      { foodId: "semillas-chia", name: "Semillas de Chia", grams: 1, kcal: 4.9, prot: 0.2, carbs: 0.4, fat: 0.3 },
      { foodId: "fresas-frescas", name: "Fresas Frescas", grams: 50, kcal: 16.0, prot: 0.4, carbs: 3.9, fat: 0.2 },
      { foodId: "miel-abeja", name: "Miel de Abeja", grams: 5, kcal: 15.2, prot: 0.0, carbs: 4.1, fat: 0.0 },
      { foodId: "avellanas", name: "Avellanas", grams: 3, kcal: 18.8, prot: 0.5, carbs: 0.5, fat: 1.8 }
    ],
    timestamp: "2026-04-02T08:00:00"
  },
  {
    id: "2026-04-02-002",
    date: "2026-04-02",
    meal: "desayuno",
    items: [
      { foodId: "huevo-entero", name: "Huevo Entero", grams: 50, kcal: 77.5, prot: 6.5, carbs: 0.6, fat: 5.5 },
      { foodId: "clara-huevo", name: "Clara de Huevo x2", grams: 66, kcal: 34.3, prot: 7.3, carbs: 0.5, fat: 0.1 },
      { foodId: "aceite-oliva", name: "Aceite de Oliva", grams: 2, kcal: 17.7, prot: 0, carbs: 0, fat: 2.0 },
      { foodId: "queso-maduro-espanol", name: "Queso Maduro Español", grams: 5, kcal: 20.0, prot: 1.3, carbs: 0, fat: 1.7 },
      { foodId: "mantequilla-salada", name: "Mantequilla Salada", grams: 2, kcal: 14.3, prot: 0, carbs: 0, fat: 1.6 },
      { foodId: "jamon-porc-fleury-michon", name: "Jamón de Cerdo Fleury Michon", grams: 16, kcal: 18.4, prot: 3.2, carbs: 0.2, fat: 0.6 },
      { foodId: "ricotta-casa-azzurra", name: "Ricotta", grams: 50, kcal: 87.0, prot: 5.5, carbs: 1.5, fat: 6.5 },
      { foodId: "salsa-mexicana-casera", name: "Salsa Mexicana Casera", grams: 100, kcal: 40.0, prot: 1.0, carbs: 5.5, fat: 1.5 },
      { foodId: "cilantro-fresco", name: "Cilantro Fresco", grams: 5, kcal: 1.2, prot: 0.1, carbs: 0.2, fat: 0 }
    ],
    timestamp: "2026-04-02T10:15:00"
  },
  {
    id: "2026-04-02-003",
    date: "2026-04-02",
    meal: "cena",
    items: [
      { foodId: "omelette-cottage-salmon", name: "Omelette Cottage Salmon (1/2 receta)", grams: 248, kcal: 245.5, prot: 25.5, carbs: 6.0, fat: 13.1, fiber: 2.0 }
    ],
    timestamp: "2026-04-02T21:30:00"
  },
  {
    id: "2026-04-03-001",
    date: "2026-04-03",
    meal: "desayuno",
    items: [
      { foodId: "hipro-coco", name: "HiPro Coco", grams: 160, kcal: 89.6, prot: 15.0, carbs: 5.9, fat: 0.6 },
      { foodId: "huevo-entero", name: "Huevo Entero", grams: 50, kcal: 77.5, prot: 6.5, carbs: 0.6, fat: 5.5 },
      { foodId: "clara-huevo", name: "Clara de Huevo", grams: 33, kcal: 17.2, prot: 3.6, carbs: 0.2, fat: 0.1 },
      { foodId: "danone-cottage-cheese", name: "Cottage Cheese Danone", grams: 50, kcal: 45.0, prot: 6.0, carbs: 0.8, fat: 2.0 }
    ],
    timestamp: "2026-04-03T09:15:00"
  },
  {
    id: "2026-04-03-002",
    date: "2026-04-03",
    meal: "snack",
    items: [
      { foodId: "jeff-de-bruges-oeuf-paques", name: "Petit Oeuf Pâques Jeff de Bruges (violet)", grams: 13, kcal: 69.9, prot: 0.9, carbs: 6.8, fat: 4.3 },
      { foodId: "mere-poulard-biscuit-beurre", name: "Biscuit Beurre Mère Poulard x2", grams: 31.2, kcal: 156.0, prot: 2.0, carbs: 22.0, fat: 7.0 },
      { foodId: "fresas-frescas", name: "Fresas Frescas x2", grams: 24, kcal: 7.7, prot: 0.2, carbs: 1.8, fat: 0.1 },
      { foodId: "wasa-leger", name: "Cracker Wasa Leger", grams: 9.6, kcal: 32.4, prot: 0.9, carbs: 6.0, fat: 0.1 },
      { foodId: "ricotta-casa-azzurra", name: "Ricotta Casa Azzurra", grams: 50, kcal: 87.0, prot: 5.5, carbs: 1.5, fat: 6.5 }
    ],
    timestamp: "2026-04-03T16:30:00"
  },
  {
    id: "2026-04-03-003",
    date: "2026-04-03",
    meal: "cena",
    items: [
      { foodId: "pollo-pechuga-horneada", name: "Pechuga de Pollo Horneada", grams: 162, kcal: 267.3, prot: 50.2, carbs: 0, fat: 5.8 },
      { foodId: "tomate-cherry", name: "Tomate Cherry", grams: 50, kcal: 9.0, prot: 0.5, carbs: 2.0, fat: 0.1 },
      { foodId: "quinoa-cocida", name: "Quinoa Cocida", grams: 27, kcal: 32.4, prot: 1.2, carbs: 5.8, fat: 0.5 },
      { foodId: "endive", name: "Endive (1/2)", grams: 75, kcal: 12.8, prot: 1.0, carbs: 2.6, fat: 0.2 },
      { foodId: "aderezo-fromage-blanc-aguacate-cilantro", name: "Aderezo Fromage Blanc Aguacate Cilantro", grams: 65, kcal: 57.9, prot: 1.7, carbs: 3.1, fat: 4.7 }
    ],
    timestamp: "2026-04-03T21:00:00"
  },
  {
    id: "2026-04-03-004",
    date: "2026-04-03",
    meal: "snack",
    items: [
      { foodId: "oreo-protein-shake", name: "Oreo Protein Shake", grams: 250, kcal: 231.5, prot: 14.8, carbs: 26.5, fat: 8.0 }
    ],
    timestamp: "2026-04-03T22:00:00"
  },
  // === 2026-04-04 (Saturday) ===
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
      { foodId: "charcuterie-variada", name: "Charcuterie Variada (jambon, coppa, saucisson)", grams: 120, kcal: 300.0, prot: 21.6, carbs: 1.2, fat: 24.0 },
      { foodId: "tomate-cherry", name: "Tomates Cherry", grams: 100, kcal: 18.0, prot: 0.9, carbs: 3.9, fat: 0.2 },
      { foodId: "mozzarella-mini-billes", name: "Mini Mozzarella", grams: 60, kcal: 168.0, prot: 10.2, carbs: 0.6, fat: 13.2 },
      { foodId: "toast-feuillete-tomate-seche", name: "Toast Feuilleté Tomate Séché x3", grams: 45, kcal: 200.3, prot: 2.9, carbs: 18.0, fat: 13.1 },
      { foodId: "chips-classiques", name: "Chips", grams: 20, kcal: 107.2, prot: 1.2, carbs: 10.0, fat: 7.0 },
      { foodId: "vin-blanc-chablis", name: "Vin Chablis Blanc x2 copas", grams: 250, kcal: 175.0, prot: 0, carbs: 2.0, fat: 0 },
      { foodId: "champagne-brut", name: "Champagne Mumm x1 copa", grams: 125, kcal: 100.0, prot: 0, carbs: 1.5, fat: 0 },
      { foodId: "pain-baguette", name: "Pan Baguette x2 pedazos", grams: 80, kcal: 219.2, prot: 6.8, carbs: 44.0, fat: 1.0 }
    ],
    timestamp: "2026-04-04T13:00:00"
  },
  {
    id: "2026-04-04-003",
    date: "2026-04-04",
    meal: "almuerzo",
    items: [
      { foodId: "cheesecake-oreo-beurre", name: "Cheesecake Oreo & Beurre (1/8)", grams: 194, kcal: 684.6, prot: 11.3, carbs: 54.7, fat: 47.3 },
      { foodId: "coulis-fraises-maison", name: "Coulis de Fresas", grams: 30, kcal: 33.0, prot: 0.2, carbs: 8.3, fat: 0.1 }
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
      { foodId: "danone-cottage-cheese", name: "Cottage Cheese", grams: 50, kcal: 45.0, prot: 6.0, carbs: 0.8, fat: 2.0 },
      { foodId: "pollo-pechuga-horneada", name: "Pechuga Pollo Asado", grams: 30, kcal: 49.5, prot: 9.3, carbs: 0, fat: 1.1 },
      { foodId: "wasa-leger", name: "Cracker Wasa Leger", grams: 9.6, kcal: 32.4, prot: 0.9, carbs: 6.0, fat: 0.1 },
      { foodId: "aguacate-fresco", name: "Salsa de Aguacate", grams: 30, kcal: 48.0, prot: 0.6, carbs: 2.6, fat: 4.4 },
      { foodId: "coca-cola-zero", name: "Coca-Cola Zero", grams: 330, kcal: 1.3, prot: 0, carbs: 0, fat: 0 }
    ],
    timestamp: "2026-04-04T21:00:00"
  },
  {
    id: "2026-04-05-001",
    date: "2026-04-05",
    meal: "desayuno",
    items: [
      { foodId: "wasa-leger", name: "Wasa Leger (x2)", grams: 19.2, kcal: 64.9, prot: 1.7, carbs: 11.9, fat: 0.3 },
      { foodId: "kiwi-fresco", name: "Kiwi (1/2)", grams: 38, kcal: 23.2, prot: 0.4, carbs: 5.6, fat: 0.2 },
      { foodId: "hipro-banane", name: "HiPro Banane", grams: 160, kcal: 112.0, prot: 19.8, carbs: 6.4, fat: 0.6 },
      { foodId: "aguacate-fresco", name: "Aguacate", grams: 45, kcal: 72.0, prot: 0.9, carbs: 3.8, fat: 6.6 },
      { foodId: "danone-cottage-cheese", name: "Cottage Cheese", grams: 100, kcal: 90.0, prot: 12.0, carbs: 1.6, fat: 3.9 }
    ],
    timestamp: "2026-04-05T12:15:00"
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
    id: "2026-04-05-003",
    date: "2026-04-05",
    meal: "almuerzo",
    items: [
      { foodId: "pollo-pechuga-horneada", name: "Pollo al Horno", grams: 180, kcal: 297.0, prot: 55.8, carbs: 0, fat: 6.5 },
      { foodId: "tortillarepupusa-ricotta", name: "Tortillarepupusa con Ricotta", grams: 53, kcal: 163.1, prot: 6.4, carbs: 21.0, fat: 5.6 },
      { foodId: "tomate-cherry", name: "Tomate Cherry x4", grams: 60, kcal: 10.8, prot: 0.5, carbs: 2.3, fat: 0.1 },
      { foodId: "coca-cola-zero", name: "Coca-Cola Zero", grams: 330, kcal: 1.3, prot: 0, carbs: 0, fat: 0 },
      { foodId: "danone-cottage-cheese", name: "Cottage Cheese", grams: 50, kcal: 45.0, prot: 6.0, carbs: 0.8, fat: 2.0 },
      { foodId: "mostaza-amarilla", name: "Mostaza (1 cda)", grams: 15, kcal: 9.9, prot: 0.6, carbs: 0.6, fat: 0.5 },
      { foodId: "harissa-paste", name: "Harissa (1 cda)", grams: 15, kcal: 15.0, prot: 0.5, carbs: 0.9, fat: 1.1 }
    ],
    timestamp: "2026-04-05T14:00:00"
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
    id: "2026-04-06-001",
    date: "2026-04-06",
    meal: "desayuno",
    items: [
      { foodId: "protein-packed-banana-pb", name: "Protein Packed Banana Peanut Butter (60%)", grams: 209, kcal: 208.4, prot: 26.2, carbs: 18.6, fat: 3.5 },
      { foodId: "mantequilla-de-mani", name: "Mantequilla de mani", grams: 15, kcal: 88.2, prot: 3.8, carbs: 3.0, fat: 7.5 }
    ],
    timestamp: "2026-04-06T09:00:00"
  },
  {
    id: "2026-04-06-002",
    date: "2026-04-06",
    meal: "almuerzo",
    items: [
      { foodId: "salmorejo-alvalle", name: "Salmorejo Alvalle", grams: 200, kcal: 108, prot: 2.4, carbs: 11.6, fat: 6.0 },
      { foodId: "ricotta-casa-azzurra", name: "Ricotta Casa Azzurra", grams: 30, kcal: 52.2, prot: 3.3, carbs: 0.9, fat: 3.9 },
      { foodId: "aceite-oliva", name: "Aceite de oliva (1/4 cdta)", grams: 1.1, kcal: 9.7, prot: 0, carbs: 0, fat: 1.1 },
      { foodId: "pollo-pechuga-horneada", name: "Pollo horneado", grams: 50, kcal: 82.5, prot: 15.5, carbs: 0, fat: 1.8 },
      { foodId: "pescado-salsa-limon-alcaparras", name: "Pescado salsa limon alcaparras", grams: 35, kcal: 36.0, prot: 5.3, carbs: 0.4, fat: 1.3 },
      { foodId: "tortillarepupusa-ricotta", name: "Pupusarepatotilla", grams: 58, kcal: 178.5, prot: 7.0, carbs: 23.0, fat: 6.1 },
      { foodId: "coca-cola-zero", name: "Coca-Cola Zero", grams: 200, kcal: 0.8, prot: 0, carbs: 0, fat: 0 },
      { foodId: "tomate-cherry", name: "Tomate cherry", grams: 15, kcal: 2.7, prot: 0.1, carbs: 0.6, fat: 0 }
    ],
    timestamp: "2026-04-06T13:00:00"
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
    id: "2026-04-06-005",
    date: "2026-04-06",
    meal: "snack",
    items: [
      { foodId: "eafit-pure-isolate-vanille", name: "Pure Isolate Whey Vanille", grams: 40, kcal: 146.4, prot: 34.4, carbs: 1.3, fat: 0.4 },
      { foodId: "galleta-oreo-sin-crema", name: "Galleta Oreo wafer x8", grams: 60, units: 8, kcal: 282.6, prot: 1.7, carbs: 44.1, fat: 12.4 },
      { foodId: "alpro-noisette-gourmande", name: "Leche Alpro Noisette", grams: 50, kcal: 14.5, prot: 0.2, carbs: 1.6, fat: 0.8 }
    ],
    timestamp: "2026-04-06T22:30:00"
  },
  // === 2026-04-07 (Lunes) - ADRIANA ===
  {
    id: "2026-04-07-A01",
    date: "2026-04-07",
    meal: "desayuno",
    who: "adriana",
    items: [
      { foodId: "hipro-coco", name: "HiPro Coco", grams: 152, kcal: 85.1, prot: 14.3, carbs: 5.6, fat: 0.6 },
      { foodId: "siggis-skyr-nature", name: "Skyr Siggis Nature", grams: 104, kcal: 65.5, prot: 11.4, carbs: 4.2, fat: 0.2 },
      { foodId: "fresas-frescas", name: "Fresas", grams: 25, kcal: 8.0, prot: 0.2, carbs: 1.9, fat: 0.1 },
      { foodId: "blueberries-frescas", name: "Blueberries", grams: 22, kcal: 12.5, prot: 0.2, carbs: 3.2, fat: 0.1 }
    ],
    timestamp: "2026-04-07T08:30:00"
  },
  {
    id: "2026-04-07-A02",
    date: "2026-04-07",
    meal: "snack",
    who: "adriana",
    items: [
      { foodId: "baiocchi-pistachio", name: "Baiocchi Pistachio (x1 galleta)", grams: 9.3, units: 1, kcal: 47.0, prot: 0.8, carbs: 5.5, fat: 2.3 },
      { foodId: "pancakes-de-proteina-adri-v2", name: "Pancake Proteina Adri", grams: 62, kcal: 96.9, prot: 11.4, carbs: 4.9, fat: 3.8 },
      { foodId: "danone-cottage-cheese", name: "Cottage Cheese", grams: 110, kcal: 99.0, prot: 13.2, carbs: 1.8, fat: 4.3 },
      { foodId: "fresas-frescas", name: "Fresas", grams: 30, kcal: 9.6, prot: 0.2, carbs: 2.3, fat: 0.1 }
    ],
    timestamp: "2026-04-07T11:00:00"
  },
  {
    id: "2026-04-07-A03",
    date: "2026-04-07",
    meal: "almuerzo",
    who: "adriana",
    items: [
      { foodId: "rigatoni-cocida", name: "Rigatoni Cocida", grams: 130, kcal: 204.1, prot: 7.2, carbs: 40.3, fat: 1.2 },
      { foodId: "beef-green-beans-meat-bowl", name: "Carne con Ejote y Cebolla", grams: 130, kcal: 189.7, prot: 16.4, carbs: 6.5, fat: 11.1 },
      { foodId: "danone-cottage-cheese", name: "Cottage Cheese", grams: 100, kcal: 90.0, prot: 12.0, carbs: 1.6, fat: 3.9 }
    ],
    timestamp: "2026-04-07T13:00:00"
  },
  {
    id: "2026-04-07-A04",
    date: "2026-04-07",
    meal: "cena",
    who: "adriana",
    items: [
      { foodId: "clara-huevo", name: "Clara de Huevo (x1)", grams: 33, kcal: 17.2, prot: 3.6, carbs: 0.2, fat: 0.1 },
      { foodId: "huevo-entero", name: "Huevo Entero (x1)", grams: 50, kcal: 77.5, prot: 6.5, carbs: 0.6, fat: 5.5 },
      { foodId: "pimiento-rojo-crudo", name: "Pimiento Rojo", grams: 11, kcal: 3.4, prot: 0.1, carbs: 0.7, fat: 0.0 },
      { foodId: "jamon-fm-25-moins-sel", name: "Jamón FM -25% Sel", grams: 35, kcal: 40.3, prot: 7.0, carbs: 0.4, fat: 1.2 },
      { foodId: "beaufort-rape", name: "Beaufort Rapé", grams: 20, kcal: 81.0, prot: 5.4, carbs: 0.0, fat: 6.6 },
      { foodId: "aceite-oliva", name: "AOVE (1/2 tsp)", grams: 2.5, kcal: 22.1, prot: 0.0, carbs: 0.0, fat: 2.5 },
      { foodId: "ricotta-casa-azzurra", name: "Ricotta", grams: 64, kcal: 111.4, prot: 7.0, carbs: 1.9, fat: 8.3 }
    ],
    timestamp: "2026-04-07T20:00:00"
  },
  // === 2026-04-07 (Lunes) - ERNESTO ===
  {
    id: "2026-04-07-001",
    date: "2026-04-07",
    meal: "desayuno",
    items: [
      { foodId: "hipro-coco", name: "HiPro Coco", grams: 160, kcal: 89.6, prot: 15.0, carbs: 5.9, fat: 0.6 },
      { foodId: "pancakes-de-proteina-adri-v2", name: "Pancake Proteina Adri", grams: 30, kcal: 46.9, prot: 5.5, carbs: 2.4, fat: 1.8 },
      { foodId: "banana-fresca", name: "Banano", grams: 20, kcal: 17.8, prot: 0.2, carbs: 4.6, fat: 0.1 }
    ],
    timestamp: "2026-04-07T08:30:00"
  },
  {
    id: "2026-04-07-002",
    date: "2026-04-07",
    meal: "snack",
    items: [
      { foodId: "mandarina-fresca", name: "Mandarina", grams: 80, kcal: 37.6, prot: 0.6, carbs: 9.6, fat: 0.2 },
      { foodId: "mango-fresco", name: "Mango", grams: 55, kcal: 33.0, prot: 0.4, carbs: 8.3, fat: 0.2 },
      { foodId: "fresas-frescas", name: "Fresas (x2)", grams: 24, kcal: 7.7, prot: 0.2, carbs: 1.8, fat: 0.1 },
      { foodId: "eafit-pure-isolate-vanille", name: "EAFit Vanilla Shake", grams: 40, kcal: 146.4, prot: 34.4, carbs: 1.3, fat: 0.4 },
      { foodId: "alpro-noisette-gourmande", name: "Leche Alpro Noisette", grams: 50, kcal: 14.5, prot: 0.2, carbs: 1.6, fat: 0.8 }
    ],
    timestamp: "2026-04-07T11:30:00"
  },
  {
    id: "2026-04-07-003",
    date: "2026-04-07",
    meal: "almuerzo",
    items: [
      { foodId: "rigatoni-cocida", name: "Rigatoni Cocida", grams: 200, kcal: 314.0, prot: 11.0, carbs: 62.0, fat: 1.8 },
      { foodId: "beef-green-beans-meat-bowl", name: "Carne y Ejote con Cebolla", grams: 128, kcal: 186.8, prot: 16.1, carbs: 6.4, fat: 10.9 }
    ],
    timestamp: "2026-04-07T13:30:00"
  },
  {
    id: "2026-04-07-004",
    date: "2026-04-07",
    meal: "cena",
    items: [
      { foodId: "danone-cottage-cheese", name: "Cottage Cheese", grams: 100, kcal: 90.0, prot: 12.0, carbs: 1.6, fat: 3.9 },
      { foodId: "clara-huevo", name: "Clara de Huevo (x2)", grams: 66, kcal: 34.3, prot: 7.3, carbs: 0.5, fat: 0.1 },
      { foodId: "huevo-entero", name: "Huevo Entero (x1)", grams: 50, kcal: 77.5, prot: 6.5, carbs: 0.6, fat: 5.5 },
      { foodId: "beaufort-rape", name: "Beaufort Rapé", grams: 25, kcal: 101.3, prot: 6.8, carbs: 0.0, fat: 8.3 },
      { foodId: "pimiento-rojo-crudo", name: "Pimiento Rojo", grams: 17, kcal: 5.3, prot: 0.2, carbs: 1.0, fat: 0.1 },
      { foodId: "jamon-fm-25-moins-sel", name: "Jamón FM -25% Sel", grams: 44, kcal: 50.6, prot: 8.8, carbs: 0.4, fat: 1.5 },
      { foodId: "maasdam-queso", name: "Maasdam", grams: 14, kcal: 48.7, prot: 3.5, carbs: 0.0, fat: 3.8 },
      { foodId: "aceite-oliva", name: "AOVE (1/2 tsp)", grams: 2.5, kcal: 22.1, prot: 0.0, carbs: 0.0, fat: 2.5 }
    ],
    timestamp: "2026-04-07T20:30:00"
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
  { date: "2026-04-06", steps: 11001, stepsKcal: 350, gym: "gym", gymKcal: 656, notes: "" }
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
