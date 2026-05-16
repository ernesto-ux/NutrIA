// NutrIA - Nutrition Tracker Data
// Updated by Claude Code via /log-food skill
// DO NOT EDIT MANUALLY - use /log-food to add meals

const DATA_TIMESTAMP = "2026-05-16T01:45:00 Europe/Paris";

const NUTRITION_CONFIG = {
  targets: { kcal: 1770, prot: 190, carbs: 140, fat: 50 },
  targetsAdri: { kcal: 1285, prot: 120, carbs: 100, fat: 45 },
  // Historial de metas por usuario. La meta vigente para una fecha es la entrada
  // con `from` más reciente <= fecha. Add new entries here when goals change.
  targetsHistory: {
    ernesto: [
      { from: "2026-01-01", kcal: 1770, prot: 190, carbs: 140, fat: 50 }
    ],
    adriana: [
      { from: "2026-04-06", kcal: 1285, prot: 120, carbs: 100, fat: 45 },
      { from: "2026-05-10", kcal: 1630, prot: 110, carbs: 155, fat: 63 }
    ]
  },
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
    per100g: { kcal: 118.6, prot: 9.7, carbs: 3.6, fat: 7.2, fiber: 0.7, sodium: 320, sugar: 2.0, sat_fat: 3.5 },
    totalG: 986,
    portions: 4,
    source: "recetario",
    addedDate: "2026-04-13"
  },
  // Pizza High Protein (Jamon) — Masa: 180g cottage Danone + 1 3/4 huevo (87.5g) + 60g harina trigo blanca. Topping: 1/2 maxi mozzarella Buitoni (125g) + 80g salsa Mutti tomate + 2 rodajas jamon Fleury Michon (40g) + 4ml aceite oliva (3.7g). Total crudo 576g, cocido ~560g, 1 porción.
  {
    id: "pizza-high-protein-jamon",
    name: "Pizza High Protein (Jamon)",
    brand: "Recetario",
    per100g: { kcal: 163, prot: 12.4, carbs: 9.6, fat: 8.3, fiber: 0.8, sodium: 410, sugar: 1.4, sat_fat: 5.0 },
    totalG: 560,
    portions: 1,
    source: "recetario",
    addedDate: "2026-05-14",
    notes: "Masa: 180g cottage Danone + 1 3/4 huevo (87.5g) + 60g harina trigo blanca. Topping: 1/2 maxi mozzarella Buitoni (125g) + 80g salsa Mutti tomate + 2 rodajas jamon Fleury Michon (40g) + 4ml aceite oliva (3.7g). Total crudo 576g → cocido ~560g. 914 kcal, 69.2g prot, 53.5g carbs, 46.3g fat."
  },
  // Pizza High Protein (Pesto) — Masa: 180g cottage Danone + 1 3/4 huevo (87.5g) + 60g harina trigo blanca. Topping: 1/2 maxi mozzarella Buitoni (125g) + 80g salsa Mutti tomate + 30g pesto (albahaca, parmesano, AOVE, ajo) + 4ml aceite oliva (3.7g). Total crudo 566g, cocido ~550g, 1 porción.
  {
    id: "pizza-high-protein-pesto",
    name: "Pizza High Protein (Pesto)",
    brand: "Recetario",
    per100g: { kcal: 180, prot: 11.3, carbs: 9.9, fat: 10.3, fiber: 0.8, sodium: 395, sugar: 1.4, sat_fat: 5.0 },
    totalG: 550,
    portions: 1,
    source: "recetario",
    addedDate: "2026-05-14",
    notes: "Masa: 180g cottage Danone + 1 3/4 huevo (87.5g) + 60g harina trigo blanca. Topping: 1/2 maxi mozzarella Buitoni (125g) + 80g salsa Mutti tomate + 30g pesto (albahaca, parmesano, AOVE, ajo) + 4ml aceite oliva (3.7g). Total crudo 566g → cocido ~550g. 988 kcal, 62.3g prot, 54.6g carbs, 56.6g fat."
  },
  // Lasagna de Pollo y Pesto — 8 hojas Barilla crudas (12.5g/u, total 100g), mozzarella maxi, 3 faisselle 125g, pesto casero (40g AOVE+60g parm+albahaca+ajo+4 avellanas), 200g champignons, 300g pollo, bechamel 1L leche demi-écrémée. Total crudo 2355g, cocido ~1884g, 6 porciones de ~314g.
  {
    id: "lasagna-pollo-pesto",
    name: "Lasagna de Pollo y Pesto",
    brand: "Recetario",
    per100g: { kcal: 164.7, prot: 12.5, carbs: 8.7, fat: 9.0, fiber: 0.6, sodium: 380, sugar: 4.0, sat_fat: 4.7 },
    totalG: 1884,
    portions: 6,
    source: "recetario",
    addedDate: "2026-05-07",
    notes: "8 hojas lasagna Barilla crudas 12.5g/u (100g pasta) + 200g mozzarella maxi + 3 faisselle 125g (375g) + pesto (40g AOVE, 60g parmesano, 4 avellanas, albahaca, ajo) + 200g champignons de Paris + 300g pechuga pollo + bechamel (1L leche demi-écrémée, 20g harina, 20g mantequilla salada, cúrcuma, pimentón) + 20g parmesano rapé topping. Crudo 2355g → cocido ~1884g (-20% agua). Bechamel: 688 kcal, 34.4 prot, 63.6 carbs, 32.5 fat."
  },
  {
    id: "mantequilla-de-mani-menguys",
    name: "Mantequilla de Mani (sin azucar)",
    brand: "Recetario",
    per100g: { kcal: 588, prot: 25, carbs: 20, fat: 50, fiber: 6, sodium: 5, sugar: 3.0, sat_fat: 8.0 },
    totalG: 0,
    source: "recetario",
    addedDate: "2026-04-06"
  },
  {
    id: "pancakes-de-proteina-adri-v2",
    name: "Pancakes de Proteina Adri V2",
    brand: "Recetario",
    per100g: { kcal: 156.3, prot: 18.3, carbs: 7.9, fat: 6.1, fiber: 0, sodium: 200, sugar: 5.0, sat_fat: 2.0 },
    totalG: 350,
    source: "recetario",
    addedDate: "2026-04-07"
  },
  // Protein Packed Banana Peanut Butter — claras, whey, banana, cottage, miel, aceite oliva
  {
    id: "protein-packed-banana-pb",
    name: "Protein Packed Banana Peanut Butter",
    brand: "Recetario",
    per100g: { kcal: 99.7, prot: 12.6, carbs: 8.9, fat: 1.7, fiber: 0.3, sodium: 80, sugar: 8.0, sat_fat: 2.0 },
    totalG: 348,
    source: "recetario",
    addedDate: "2026-04-06"
  },
  // Beef & Green Beans Pasta — served in 2 bowls
  {
    id: "beef-green-beans-pasta-bowl",
    name: "Beef & Green Beans Pasta (pasta + salsa)",
    brand: "Recetario",
    per100g: { kcal: 159.2, prot: 5.2, carbs: 29.5, fat: 1.9, fiber: 0.5, sodium: 280, sugar: 2.0, sat_fat: 3.0 },
    totalG: 710,
    source: "recetario",
    addedDate: "2026-04-06"
  },
  {
    id: "beef-green-beans-meat-bowl",
    name: "Beef & Green Beans (carne + ejotes + cebolla)",
    brand: "Recetario",
    per100g: { kcal: 145.9, prot: 12.6, carbs: 5.0, fat: 8.5, fiber: 1.2, sodium: 350, sugar: 3.0, sat_fat: 4.0 },
    totalG: 700,
    source: "recetario",
    addedDate: "2026-04-06"
  },
  // Ingredients: Huevo (1/2) (25g), Ricotta (25g), Cottage Cheese (50g), Pechuga Pollo Asado (30g), Cracker Wasa Leger (9.6g), Salsa de Aguacate (30g)
  {
    id: "cena-de-cracker-con-huevo-ricotta-cottage-pollo-y-salsa-de-aguacate",
    name: "Cena de cracker con huevo, ricotta, cottage, pollo y salsa de aguacate",
    brand: "Recetario",
    per100g: { kcal: 151.7, prot: 13.5, carbs: 6.2, fat: 8.1, fiber: 0, sodium: 280, sugar: 1.5, sat_fat: 3.0 },
    totalG: 169.6,
    source: "recetario",
    addedDate: "2026-04-05"
  },
  {
    id: "frittata-light",
    name: "Frittata Light",
    brand: "Recetario",
    per100g: { kcal: 136.6, prot: 11.9, carbs: 2.5, fat: 8.8, fiber: 0.3, sodium: 200, sugar: 0.5, sat_fat: 3.0 },
    totalG: 350,
    source: "recetario",
    addedDate: "2026-04-01"
  },
  {
    id: "pesto-albahaca-light-feta",
    name: "Pesto de Albahaca Light con Feta",
    brand: "Recetario",
    per100g: { kcal: 185.6, prot: 3.9, carbs: 1.8, fat: 18.0, fiber: 0.6, sodium: 350, sugar: 1.0, sat_fat: 4.0 },
    totalG: 90,
    source: "recetario",
    addedDate: "2026-04-01"
  },
  {
    id: "lentejas-carne-vegetales",
    name: "Lentejas con Carne y Vegetales",
    brand: "Recetario",
    per100g: { kcal: 100.1, prot: 7.6, carbs: 12.1, fat: 2.6, fiber: 1.8, sodium: 280, sugar: 2.5, sat_fat: 2.0 },
    totalG: 2500,
    source: "recetario",
    addedDate: "2026-04-01"
  },
  {
    id: "spanakopita",
    name: "Spanakopita",
    brand: "Recetario",
    per100g: { kcal: 139.8, prot: 6.1, carbs: 6.7, fat: 10.1, fiber: 0.9, sodium: 400, sugar: 2.0, sat_fat: 5.0 },
    totalG: 1400,
    source: "recetario",
    addedDate: "2026-04-01"
  },
  {
    id: "omelette-ligera-jamon",
    name: "Omelette Ligera con Jamon",
    brand: "Recetario",
    per100g: { kcal: 114.7, prot: 13.3, carbs: 1.3, fat: 6.0, fiber: 0, sodium: 250, sugar: 0.5, sat_fat: 3.0 },
    totalG: 109,
    source: "recetario",
    addedDate: "2026-04-01"
  },
  {
    id: "frittata-ranchera",
    name: "Frittata Ranchera",
    brand: "Recetario",
    per100g: { kcal: 104.7, prot: 8.4, carbs: 2.9, fat: 6.6, fiber: 0.5, sodium: 220, sugar: 1.5, sat_fat: 4.0 },
    totalG: 296,
    source: "recetario",
    addedDate: "2026-04-02"
  },
  {
    id: "omelette-cottage-salmon",
    name: "Omelette au Cottage, Salmon, Pimiento y Espinacas",
    brand: "Recetario",
    per100g: { kcal: 99.0, prot: 10.3, carbs: 2.4, fat: 5.3, fiber: 0.8, sodium: 280, sugar: 1.0, sat_fat: 3.0 },
    totalG: 495,
    source: "recetario",
    addedDate: "2026-04-02"
  },
  // === PRODUCTOS COMERCIALES ===
  {
    id: "eafit-pure-isolate-vanille",
    name: "Pure Isolate Whey Vanille",
    brand: "EAFit",
    per100g: { kcal: 366, prot: 86, carbs: 3.3, fat: 0.9, fiber: 0.9, sodium: 120, sugar: 1.2, sat_fat: 0.3 },
    source: "web",
    addedDate: "2026-04-01"
  },
  {
    id: "alpro-noisette-gourmande",
    name: "Boisson Noisette Gourmande",
    brand: "Alpro",
    per100g: { kcal: 29, prot: 0.4, carbs: 3.2, fat: 1.6, fiber: 0.3, sodium: 70, sugar: 5.0, sat_fat: 0.3 },
    source: "web",
    addedDate: "2026-04-01"
  },
  {
    id: "wasa-leger",
    name: "Tartine Croustillante Leger (1 tranche = 9.6g)",
    brand: "Wasa",
    per100g: { kcal: 338, prot: 9, carbs: 62, fat: 1.5, fiber: 22, sodium: 300, sugar: 3.0, sat_fat: 0.5 },
    unitWeight: 9.6, unitLabel: "tranche",
    perUnit: { kcal: 32.4, prot: 0.9, carbs: 6.0, fat: 0.1, fiber: 2.1 },
    source: "web",
    addedDate: "2026-04-01"
  },
  {
    id: "danone-cottage-cheese",
    name: "Cottage Cheese Nature",
    brand: "Danone",
    per100g: { kcal: 90, prot: 12, carbs: 1.6, fat: 3.9, fiber: 0, sodium: 330, sugar: 3.5, sat_fat: 2.5 },
    source: "web",
    addedDate: "2026-04-01"
  },
  {
    id: "pizza-hut-hawaienne",
    name: "Pizza Hawaienne",
    brand: "Pizza Hut",
    per100g: { kcal: 186.6, prot: 8.0, carbs: 21.4, fat: 6.7, fiber: 1.4, sodium: 620, sugar: 4.0, sat_fat: 6.0 },
    source: "web",
    addedDate: "2026-04-01"
  },
  {
    id: "fleury-michon-tendre-poulet-roti",
    name: "Tendre Poulet Roti",
    brand: "Fleury Michon",
    per100g: { kcal: 108, prot: 20, carbs: 0.5, fat: 2.9, fiber: 0, sodium: 720, sugar: 0.5, sat_fat: 0.5 },
    source: "web",
    addedDate: "2026-04-01"
  },
  {
    id: "siggis-skyr-nature",
    name: "Skyr Nature",
    brand: "Siggis",
    per100g: { kcal: 63, prot: 11, carbs: 4.0, fat: 0.2, fiber: 0, sodium: 55, sugar: 4.0, sat_fat: 0.1 },
    source: "web",
    addedDate: "2026-04-01"
  },
  {
    id: "fresas-frescas",
    name: "Fresas Frescas",
    brand: "",
    per100g: { kcal: 32, prot: 0.7, carbs: 7.7, fat: 0.3, fiber: 2.0, sodium: 1, sugar: 4.9, sat_fat: 0.0 },
    source: "web",
    addedDate: "2026-04-01"
  },
  {
    id: "melon-fresco",
    name: "Melon Fresco",
    brand: "",
    per100g: { kcal: 34, prot: 0.8, carbs: 8.2, fat: 0.2, fiber: 0.9, sodium: 16, sugar: 7.4, sat_fat: 0.0 },
    source: "web",
    addedDate: "2026-04-01"
  },
  {
    id: "ricotta-casa-azzurra",
    name: "Ricotta Casa Azzurra",
    brand: "Casa Azzurra",
    per100g: { kcal: 150, prot: 8, carbs: 1.2, fat: 12, fiber: 0, sodium: 80, sugar: 3.0, sat_fat: 8.0 },
    source: "web",
    addedDate: "2026-04-02"
  },
  {
    id: "aguacate-fresco",
    name: "Aguacate Fresco",
    brand: "",
    per100g: { kcal: 160, prot: 2, carbs: 8.5, fat: 14.7, fiber: 6.7, sodium: 7, sugar: 0.7, sat_fat: 2.1 },
    source: "web",
    addedDate: "2026-04-02"
  },
  {
    id: "semillas-chia",
    name: "Semillas de Chia",
    brand: "",
    per100g: { kcal: 486, prot: 17, carbs: 42, fat: 31, fiber: 34, sodium: 16, sugar: 0.0, sat_fat: 3.3 },
    source: "web",
    addedDate: "2026-04-02"
  },
  {
    id: "miel-abeja",
    name: "Miel de Abeja",
    brand: "",
    per100g: { kcal: 304, prot: 0.3, carbs: 82, fat: 0, fiber: 0, sodium: 4, sugar: 82.0, sat_fat: 0.0 },
    source: "web",
    addedDate: "2026-04-02"
  },
  {
    id: "avellanas",
    name: "Avellanas",
    brand: "",
    per100g: { kcal: 628, prot: 15, carbs: 17, fat: 61, fiber: 10, sodium: 0, sugar: 4.3, sat_fat: 7.4 },
    source: "web",
    addedDate: "2026-04-02"
  },
  {
    id: "huevo-entero",
    name: "Huevo Entero",
    brand: "",
    per100g: { kcal: 155, prot: 13, carbs: 1.1, fat: 11, fiber: 0, sodium: 70, sugar: 0.2, sat_fat: 3.3 },
    unitWeight: 50,
    unitLabel: "huevo",
    source: "web",
    addedDate: "2026-04-02"
  },
  {
    id: "clara-huevo",
    name: "Clara de Huevo",
    brand: "",
    per100g: { kcal: 52, prot: 11, carbs: 0.7, fat: 0.2, fiber: 0, sodium: 166, sugar: 0.2, sat_fat: 0.0 },
    unitWeight: 33,
    unitLabel: "clara",
    source: "web",
    addedDate: "2026-04-02"
  },
  {
    id: "aceite-oliva",
    name: "Aceite de Oliva",
    brand: "",
    per100g: { kcal: 884, prot: 0, carbs: 0, fat: 100, fiber: 0, sodium: 0, sugar: 0.0, sat_fat: 14.0 },
    source: "web",
    addedDate: "2026-04-02"
  },
  {
    id: "queso-maduro-espanol",
    name: "Queso Maduro Español",
    brand: "",
    per100g: { kcal: 400, prot: 25, carbs: 0.5, fat: 33, fiber: 0, sodium: 620, sugar: 0.0, sat_fat: 18.0 },
    source: "web",
    addedDate: "2026-04-02"
  },
  {
    id: "mantequilla-salada",
    name: "Mantequilla Salada",
    brand: "",
    per100g: { kcal: 717, prot: 0.9, carbs: 0.1, fat: 81, fiber: 0, sodium: 650, sugar: 0.0, sat_fat: 51.0 },
    source: "web",
    addedDate: "2026-04-02"
  },
  {
    id: "jamon-porc-fleury-michon",
    name: "Jambon de Porc",
    brand: "Fleury Michon",
    per100g: { kcal: 115, prot: 20, carbs: 1, fat: 3.5, fiber: 0, sodium: 1100, sugar: 0.5, sat_fat: 2.0 },
    source: "web",
    addedDate: "2026-04-02"
  },
  {
    id: "salsa-mexicana-casera",
    name: "Salsa Mexicana Casera",
    brand: "Recetario",
    per100g: { kcal: 40, prot: 1, carbs: 5.5, fat: 1.5, fiber: 1.2, sodium: 200, sugar: 2.0, sat_fat: 0.0 },
    source: "recetario",
    addedDate: "2026-04-02"
  },
  {
    id: "cilantro-fresco",
    name: "Cilantro Fresco",
    brand: "",
    per100g: { kcal: 23, prot: 2.1, carbs: 3.7, fat: 0.5, fiber: 2.8, sodium: 46, sugar: 0.9, sat_fat: 0.1 },
    source: "web",
    addedDate: "2026-04-02"
  },
  {
    id: "hipro-banane",
    name: "HiPro Banane",
    brand: "Danone",
    per100g: { kcal: 70, prot: 12.4, carbs: 4.0, fat: 0.4, fiber: 0, sodium: 60, sugar: 8.5, sat_fat: 0.5 },
    unitWeight: 160, unitLabel: "pot",
    source: "web",
    addedDate: "2026-04-02"
  },
  {
    id: "hipro-vanille",
    name: "HiPro Vanille",
    brand: "Danone",
    per100g: { kcal: 77, prot: 10.2, carbs: 5.9, fat: 0.8, fiber: 0, sodium: 60, sugar: 6.0, sat_fat: 0.5 },
    unitWeight: 160, unitLabel: "pot",
    source: "web",
    addedDate: "2026-04-02"
  },
  {
    id: "hipro-coco",
    name: "HiPro Coco",
    brand: "Danone",
    per100g: { kcal: 56, prot: 9.4, carbs: 3.7, fat: 0.4, fiber: 0, sodium: 60, sugar: 7.5, sat_fat: 1.0 },
    unitWeight: 160, unitLabel: "pot",
    source: "web",
    addedDate: "2026-04-02"
  },
  {
    id: "sojasun-nature",
    name: "Dessert Soja Nature",
    brand: "Sojasun",
    per100g: { kcal: 41, prot: 4.6, carbs: 0, fat: 2.4, fiber: 0.7, sodium: 40, sugar: 3.5, sat_fat: 0.5 },
    unitWeight: 100, unitLabel: "pot",
    source: "web",
    addedDate: "2026-04-02"
  },
  {
    id: "jeff-de-bruges-oeuf-paques",
    name: "Petit Oeuf de Pâques Fourré",
    brand: "Jeff de Bruges",
    per100g: { kcal: 538, prot: 6.7, carbs: 52, fat: 33, fiber: 0, sodium: 35, sugar: 52.0, sat_fat: 18.0 },
    unitWeight: 13, unitLabel: "huevo",
    source: "web",
    addedDate: "2026-04-03"
  },
  {
    id: "mere-poulard-biscuit-beurre",
    name: "Biscuit Pur Beurre",
    brand: "La Mère Poulard",
    per100g: { kcal: 501, prot: 6.8, carbs: 70, fat: 21.9, fiber: 1.5, sodium: 370, sugar: 22.0, sat_fat: 12.0 },
    unitWeight: 15.6, unitLabel: "galleta",
    source: "user",
    addedDate: "2026-04-03"
  },
  // === RECETARIO (added 2026-04-03) ===
  {
    id: "ensalada-pollo-quinoa-aderezo-cilantro",
    name: "Ensalada de Pollo con Quinoa y Aderezo Fromage Blanc Cilantro",
    brand: "Recetario",
    per100g: { kcal: 100.1, prot: 14.4, carbs: 3.6, fat: 3.0, fiber: 1.2, sodium: 250, sugar: 2.0, sat_fat: 1.5 },
    totalG: 1177,
    source: "recetario",
    addedDate: "2026-04-03",
    notes: "500g pollo horneado (pimentón, cúrcuma, especias), ensalada verde, tomate cherry, quinoa cocida, endive, aderezo licuado (fromage blanc, aguacate, cilantro, limón persico, aceite oliva, vinagre vino)"
  },
  {
    id: "aderezo-fromage-blanc-aguacate-cilantro",
    name: "Aderezo de Fromage Blanc, Aguacate y Cilantro Limón",
    brand: "Recetario",
    per100g: { kcal: 89.0, prot: 2.6, carbs: 4.7, fat: 7.2, fiber: 1.5, sodium: 120, sugar: 1.0, sat_fat: 1.0 },
    totalG: 197,
    source: "recetario",
    addedDate: "2026-04-03"
  },
  // === PRODUCTOS GENÉRICOS (added 2026-04-03) ===
  {
    id: "pollo-pechuga-horneada",
    name: "Pechuga de Pollo Horneada",
    brand: "",
    per100g: { kcal: 165, prot: 31, carbs: 0, fat: 3.6, fiber: 0, sodium: 75, sugar: 0.0, sat_fat: 1.0 },
    source: "web",
    addedDate: "2026-04-03"
  },
  {
    id: "tomate-cherry",
    name: "Tomate Cherry",
    brand: "",
    per100g: { kcal: 18, prot: 0.9, carbs: 3.9, fat: 0.2, fiber: 1.2, sodium: 5, sugar: 2.6, sat_fat: 0.0 },
    source: "web",
    addedDate: "2026-04-03"
  },
  {
    id: "quinoa-cocida",
    name: "Quinoa Cocida",
    brand: "",
    per100g: { kcal: 120, prot: 4.4, carbs: 21.3, fat: 1.9, fiber: 2.8, sodium: 7, sugar: 0.5, sat_fat: 0.2 },
    source: "web",
    addedDate: "2026-04-03"
  },
  {
    id: "endive",
    name: "Endive",
    brand: "",
    per100g: { kcal: 17, prot: 1.3, carbs: 3.4, fat: 0.2, fiber: 3.1, sodium: 22, sugar: 0.5, sat_fat: 0.0 },
    source: "web",
    addedDate: "2026-04-03"
  },
  {
    id: "galleta-oreo-sin-crema",
    name: "Galleta Oreo (solo wafer, sin crema)",
    brand: "Oreo",
    per100g: { kcal: 471, prot: 2.9, carbs: 73.5, fat: 20.6, fiber: 3.0, sodium: 450, sugar: 30.0, sat_fat: 2.0 },
    unitWeight: 7.5, unitLabel: "galleta",
    source: "web",
    addedDate: "2026-04-03"
  },
  // === RECETARIO (added 2026-04-03) ===
  {
    id: "oreo-protein-shake",
    name: "Oreo Protein Shake",
    brand: "Recetario",
    per100g: { kcal: 92.6, prot: 5.9, carbs: 10.6, fat: 3.2, fiber: 0.5, sodium: 120, sugar: 8.0, sat_fat: 3.0 },
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
    per100g: { kcal: 352.9, prot: 5.8, carbs: 28.2, fat: 24.4, fiber: 0.3, sodium: 250, sugar: 28.0, sat_fat: 12.0 },
    totalG: 1550,
    source: "recetario",
    addedDate: "2026-04-05",
    notes: "Relleno: 750g Philadelphia, 150g azucar, 20g harina, 4 huevos, 125ml crema 5%. Base oreo: 165g oreo sin crema + 75g beurre. Base beurre: 60g Mere Poulard + 100g LU Petit Beurre + 75g beurre. 8 porciones. Receta de Adri"
  },
  {
    id: "cheesecake-light-oreo-beurre",
    name: "Cheesecake Light Oreo & Beurre",
    brand: "Recetario",
    per100g: { kcal: 211.2, prot: 7.8, carbs: 16.2, fat: 12.8, fiber: 0.3, sodium: 200, sugar: 22.0, sat_fat: 8.0 },
    totalG: 1230,
    source: "recetario",
    addedDate: "2026-04-05",
    notes: "Relleno: 500g Philly Light, 200g Skyr, 30g azucar + 60g erythritol, 20g maizena, 3 huevos + 2 claras, 125ml crema 5%. Base oreo: 80g oreo + 30g beurre. Base beurre: 30g MP + 50g LU + 30g beurre. 8 porciones"
  },
  {
    id: "lu-petit-beurre",
    name: "Veritable Petit Beurre",
    brand: "LU",
    per100g: { kcal: 435, prot: 7.5, carbs: 75, fat: 11, fiber: 2.5, sodium: 320, sugar: 20.0, sat_fat: 7.0 },
    source: "web",
    addedDate: "2026-04-05"
  },
  {
    id: "pizza-regine-pizzou",
    name: "Pizza Régine Pizzou (masa fina, jamon, hongos, mozza ligera)",
    brand: "Pizzou",
    per100g: { kcal: 155, prot: 10.4, carbs: 19.2, fat: 4.6, fiber: 1.5, sodium: 480, sugar: 3.0, sat_fat: 4.0 },
    source: "estimado",
    addedDate: "2026-04-06"
  },
  {
    id: "salmorejo-alvalle",
    name: "Salmorejo",
    brand: "Alvalle",
    per100g: { kcal: 54, prot: 1.2, carbs: 5.8, fat: 3.0, fiber: 0.5, sodium: 450, sugar: 3.0, sat_fat: 1.0 },
    source: "web",
    addedDate: "2026-04-06"
  },
  // === PRODUCTOS GENÉRICOS (added 2026-04-05) ===
  {
    id: "coca-cola-zero",
    name: "Coca-Cola Zero",
    brand: "Coca-Cola",
    per100g: { kcal: 0.4, prot: 0, carbs: 0, fat: 0, fiber: 0, sodium: 12, sugar: 0.0, sat_fat: 0.0 },
    source: "web",
    addedDate: "2026-04-05"
  },
  {
    id: "charcuterie-variada",
    name: "Charcuterie Variada (jambon, coppa, saucisson)",
    brand: "",
    per100g: { kcal: 250, prot: 18, carbs: 1, fat: 20, fiber: 0, sodium: 1200, sugar: 0.5, sat_fat: 8.0 },
    source: "web",
    addedDate: "2026-04-05"
  },
  {
    id: "mozzarella-mini-billes",
    name: "Mini Mozzarella (billes)",
    brand: "",
    per100g: { kcal: 280, prot: 17, carbs: 1, fat: 22, fiber: 0, sodium: 370, sugar: 0.5, sat_fat: 11.0 },
    source: "web",
    addedDate: "2026-04-05"
  },
  {
    id: "toast-feuillete-tomate-seche",
    name: "Toast Feuilleté Tomate Séché",
    brand: "",
    per100g: { kcal: 445, prot: 6.5, carbs: 40, fat: 29, fiber: 1.5, sodium: 420, sugar: 4.0, sat_fat: 5.0 },
    unitWeight: 15, unitLabel: "toast",
    source: "web",
    addedDate: "2026-04-05"
  },
  {
    id: "chips-classiques",
    name: "Chips Classiques",
    brand: "",
    per100g: { kcal: 536, prot: 6, carbs: 50, fat: 35, fiber: 4, sodium: 500, sugar: 0.5, sat_fat: 4.0 },
    source: "web",
    addedDate: "2026-04-05"
  },
  {
    id: "vin-blanc-chablis",
    name: "Vin Blanc Chablis",
    brand: "",
    per100g: { kcal: 70, prot: 0, carbs: 0.8, fat: 0, fiber: 0, sodium: 6, sugar: 0.8, sat_fat: 0.0 },
    source: "web",
    addedDate: "2026-04-05"
  },
  {
    id: "champagne-brut",
    name: "Champagne Brut",
    brand: "Mumm",
    per100g: { kcal: 80, prot: 0, carbs: 1.2, fat: 0, fiber: 0, sodium: 10, sugar: 1.2, sat_fat: 0.0 },
    source: "web",
    addedDate: "2026-04-05"
  },
  {
    id: "pain-baguette",
    name: "Pain Baguette",
    brand: "",
    per100g: { kcal: 274, prot: 8.5, carbs: 55, fat: 1.3, fiber: 2.5, sodium: 400, sugar: 2.0, sat_fat: 0.3 },
    source: "web",
    addedDate: "2026-04-05"
  },
  {
    id: "kiwi-fresco",
    name: "Kiwi Fresco",
    brand: "",
    per100g: { kcal: 61, prot: 1.1, carbs: 14.7, fat: 0.5, fiber: 3.0, sodium: 3, sugar: 9.0, sat_fat: 0.0 },
    unitWeight: 75, unitLabel: "kiwi",
    source: "web",
    addedDate: "2026-04-05",
    notes: "1 kiwi ~85g con piel, ~75g pelado. Medio kiwi ~38g"
  },
  {
    id: "coulis-fraises-maison",
    name: "Coulis de Fraises Maison",
    brand: "",
    per100g: { kcal: 110, prot: 0.7, carbs: 27.5, fat: 0.3, fiber: 1.0, sodium: 2, sugar: 12.0, sat_fat: 0.0 },
    source: "web",
    addedDate: "2026-04-05"
  },
  // === PRODUCTOS COMERCIALES (added 2026-04-06) ===
  {
    id: "creme-halva-chocolate-cookie",
    name: "Halva Sesame Chocolate & White Chocolate Cookie",
    brand: "Crème London",
    per100g: { kcal: 480, prot: 7, carbs: 52, fat: 25, fiber: 1.5, sodium: 80, sugar: 45.0, sat_fat: 15.0 },
    unitWeight: 92, unitLabel: "cookie",
    source: "web",
    addedDate: "2026-04-06",
    notes: "Estimated ~480kcal/100g from similar premium halva/chocolate cookies. Weight avg of 3oz/3.5oz = 92g per cookie"
  },
  {
    id: "mostaza-amarilla",
    name: "Mostaza Amarilla",
    brand: "",
    per100g: { kcal: 66, prot: 4, carbs: 4, fat: 3.3, fiber: 2, sodium: 600, sugar: 2.0, sat_fat: 0.3 },
    source: "web",
    addedDate: "2026-04-06"
  },
  {
    id: "harissa-paste",
    name: "Harissa (pate de piment)",
    brand: "",
    per100g: { kcal: 100, prot: 3.5, carbs: 6, fat: 7, fiber: 3, sodium: 450, sugar: 3.0, sat_fat: 0.5 },
    source: "web",
    addedDate: "2026-04-06"
  },
  {
    id: "arroz-bomba-cocido",
    name: "Arroz Bomba Cocido",
    brand: "",
    per100g: { kcal: 130, prot: 2.7, carbs: 28, fat: 0.3, fiber: 0.4, sodium: 1, sugar: 0.0, sat_fat: 0.1 },
    source: "web",
    addedDate: "2026-04-06"
  },
  // === RECETARIO (added 2026-04-06) ===
  {
    id: "tortillarepupusa-ricotta",
    name: "Tortillarepupusa con Ricotta",
    brand: "Recetario",
    per100g: { kcal: 307.8, prot: 12.1, carbs: 39.6, fat: 10.6, fiber: 0.3, sodium: 280, sugar: 1.5, sat_fat: 4.0 },
    totalG: 197.5,
    source: "recetario",
    addedDate: "2026-04-06",
    notes: "100g harina trigo + 70g ricotta + 25g queso curado espanol, frito en 1/2 tsp aceite oliva (2.5g). Yield ~197.5g"
  },
  {
    id: "cookie-dough-adri-choc-oscuro",
    name: "Cookies Adri Cariño (Choc Oscuro)",
    brand: "Recetario",
    per100g: { kcal: 449.3, prot: 4.9, carbs: 56.4, fat: 22.7, fiber: 1.4, sodium: 200, sugar: 35.0, sat_fat: 8.0 },
    totalG: 1103,
    source: "recetario",
    addedDate: "2026-04-06",
    notes: "226g beurre, 3/4 taza azucar morena, 1/2 taza azucar blanca, 2 huevos, 1 tsp bicarbonato, 1 tsp maizena, 1 3/4 taza harina, 1 taza cake flour, 1 taza chispas choc oscuro. ~13 cookies de 3oz (85g)"
  },
  {
    id: "pescado-salsa-limon-alcaparras",
    name: "Pescado a la Salsa de Limon y Alcaparras",
    brand: "Recetario",
    per100g: { kcal: 102.8, prot: 15.1, carbs: 1.2, fat: 3.8, fiber: 0.2, sodium: 350, sugar: 1.0, sat_fat: 1.5 },
    totalG: 650,
    source: "recetario",
    addedDate: "2026-04-06",
    notes: "500g colin salteado en 3 tsp aceite oliva, ajo, 35g alcaparras, 1.5 limones, 1 tsp maizena, perejil, pimienta, sal, noisette mantequilla, agua para diluir. Yield ~650g"
  },
  {
    id: "cafe-negro",
    name: "Café Negro (sin azucar)",
    brand: "",
    per100g: { kcal: 2, prot: 0.1, carbs: 0, fat: 0, fiber: 0, sodium: 2, sugar: 0.0, sat_fat: 0.0 },
    unitWeight: 240, unitLabel: "taza",
    source: "web",
    addedDate: "2026-04-07"
  },
  // === PRODUCTOS (added 2026-04-07 - Adriana) ===
  {
    id: "blueberries-frescas",
    name: "Blueberries (Myrtilles) Frescas",
    brand: "",
    per100g: { kcal: 57, prot: 0.7, carbs: 14.5, fat: 0.3, fiber: 2.4, sodium: 1, sugar: 9.7, sat_fat: 0.0 },
    source: "web",
    addedDate: "2026-04-07"
  },
  {
    id: "baiocchi-pistachio",
    name: "Baiocchi Pistachio Snack",
    brand: "Mulino Bianco",
    per100g: { kcal: 505, prot: 9, carbs: 59, fat: 25, fiber: 3.4, sodium: 130, sugar: 35.0, sat_fat: 8.0 },
    unitWeight: 9.3, unitLabel: "galleta",
    source: "web",
    addedDate: "2026-04-07"
  },
  {
    id: "rigatoni-cocida",
    name: "Rigatoni Cocida",
    brand: "",
    per100g: { kcal: 157, prot: 5.5, carbs: 31, fat: 0.9, fiber: 1.8, sodium: 1, sugar: 0.5, sat_fat: 0.1 },
    source: "web",
    addedDate: "2026-04-07"
  },
  {
    id: "beaufort-rape",
    name: "Beaufort Rapé",
    brand: "",
    per100g: { kcal: 405, prot: 27, carbs: 0, fat: 33, fiber: 0, sodium: 450, sugar: 0.0, sat_fat: 16.0 },
    source: "web",
    addedDate: "2026-04-07"
  },
  {
    id: "pimiento-rojo-crudo",
    name: "Pimiento Rojo Crudo",
    brand: "",
    per100g: { kcal: 31, prot: 1, carbs: 6, fat: 0.3, fiber: 2.1, sodium: 3, sugar: 4.2, sat_fat: 0.0 },
    source: "web",
    addedDate: "2026-04-07"
  },
  {
    id: "jamon-fm-25-moins-sel",
    name: "Jambon Le Supérieur -25% Sel",
    brand: "Fleury Michon",
    per100g: { kcal: 115, prot: 20, carbs: 1, fat: 3.5, fiber: 0, sodium: 820, sugar: 0.5, sat_fat: 2.0 },
    source: "web",
    addedDate: "2026-04-07",
    notes: "Macros identiques au jambon classique FM, seul le sel est réduit de 25%"
  },
  {
    id: "banana-fresca",
    name: "Banana (Plátano) Fresca",
    brand: "",
    per100g: { kcal: 89, prot: 1.1, carbs: 22.8, fat: 0.3, fiber: 2.6, sodium: 1, sugar: 12.2, sat_fat: 0.1 },
    unitWeight: 120, unitLabel: "banana",
    source: "web",
    addedDate: "2026-04-07"
  },
  {
    id: "mandarina-fresca",
    name: "Mandarina / Clementina Fresca",
    brand: "",
    per100g: { kcal: 47, prot: 0.8, carbs: 12, fat: 0.3, fiber: 1.7, sodium: 2, sugar: 9.0, sat_fat: 0.0 },
    source: "web",
    addedDate: "2026-04-07"
  },
  {
    id: "mango-fresco",
    name: "Mango Fresco",
    brand: "",
    per100g: { kcal: 60, prot: 0.8, carbs: 15, fat: 0.4, fiber: 1.6, sodium: 1, sugar: 14.0, sat_fat: 0.1 },
    source: "web",
    addedDate: "2026-04-07"
  },
  {
    id: "maasdam-queso",
    name: "Maasdam (Queso)",
    brand: "",
    per100g: { kcal: 348, prot: 25, carbs: 0, fat: 27, fiber: 0, sodium: 550, sugar: 0.0, sat_fat: 15.0 },
    source: "web",
    addedDate: "2026-04-07"
  },
  {
    id: "queso-curado-hacendado",
    name: "Queso Curado Mezcla",
    brand: "Hacendado",
    per100g: { kcal: 431, prot: 25, carbs: 1.8, fat: 36, fiber: 0, sodium: 600, sugar: 0.0, sat_fat: 17.0 },
    source: "web",
    addedDate: "2026-04-08"
  },
  {
    id: "rumsteck-boeuf-cuit",
    name: "Rumsteck de Boeuf (cuit)",
    brand: "Generic",
    per100g: { kcal: 120, prot: 25, carbs: 0, fat: 2, fiber: 0, sodium: 70, sugar: 0.0, sat_fat: 2.0 },
    source: "web",
    addedDate: "2026-04-08"
  },
  {
    id: "brocoli-cuit",
    name: "Brocoli (cuit)",
    brand: "Generic",
    per100g: { kcal: 35, prot: 3, carbs: 4, fat: 0.4, fiber: 2.6, sodium: 33, sugar: 1.7, sat_fat: 0.0 },
    source: "web",
    addedDate: "2026-04-08"
  },
  {
    id: "siggis-skyr-raspberry",
    name: "Skyr Raspberry",
    brand: "Siggis",
    per100g: { kcal: 73, prot: 10, carbs: 8, fat: 0.2, fiber: 0, sodium: 55, sugar: 9.0, sat_fat: 0.1 },
    unitWeight: 140, unitLabel: "pot",
    source: "web",
    addedDate: "2026-04-08"
  },
  {
    id: "gerble-cookie-cacao-pepites-ss",
    name: "Cookie Cacao Pépites Sans Sucres",
    brand: "Gerblé",
    per100g: { kcal: 518, prot: 8, carbs: 61, fat: 18, fiber: 0, sodium: 200, sugar: 5.0, sat_fat: 3.0 },
    unitWeight: 10.8, unitLabel: "cookie",
    source: "web",
    addedDate: "2026-04-08"
  },
  // === PRODUCTOS (added 2026-04-09) ===
  {
    id: "wasa-fibre",
    name: "Wasa Fibre",
    brand: "Wasa",
    per100g: { kcal: 333, prot: 13, carbs: 46, fat: 5, fiber: 26, sodium: 290, sugar: 3.0, sat_fat: 0.5 },
    unitWeight: 11.4, unitLabel: "tranche",
    source: "web",
    addedDate: "2026-04-09"
  },
  {
    id: "hipro-blueberry",
    name: "HiPro Myrtille (Blueberry)",
    brand: "Danone",
    per100g: { kcal: 53, prot: 9.4, carbs: 3.8, fat: 0, fiber: 0, sodium: 60, sugar: 7.0, sat_fat: 0.5 },
    unitWeight: 160, unitLabel: "pot",
    source: "web",
    addedDate: "2026-04-09"
  },
  {
    id: "bavette-cocida",
    name: "Bavette (Pasta Cocida)",
    brand: "",
    per100g: { kcal: 157, prot: 5.5, carbs: 31, fat: 0.9, fiber: 1.8, sodium: 1, sugar: 0.5, sat_fat: 0.1 },
    source: "web",
    addedDate: "2026-04-09"
  },
  {
    id: "ejote-haricot-vert",
    name: "Ejote / Haricot Vert (cuit)",
    brand: "",
    per100g: { kcal: 31, prot: 1.8, carbs: 7, fat: 0.1, fiber: 3.4, sodium: 6, sugar: 2.4, sat_fat: 0.0 },
    source: "web",
    addedDate: "2026-04-09"
  },
  {
    id: "cebolla-cruda",
    name: "Cebolla (cruda)",
    brand: "",
    per100g: { kcal: 40, prot: 1.1, carbs: 9.3, fat: 0.1, fiber: 1.7, sodium: 4, sugar: 4.2, sat_fat: 0.0 },
    source: "web",
    addedDate: "2026-04-09"
  },
  {
    id: "aceite-sesamo",
    name: "Aceite de Sésamo",
    brand: "",
    per100g: { kcal: 884, prot: 0, carbs: 0, fat: 100, fiber: 0, sodium: 0, sugar: 0.0, sat_fat: 14.0 },
    source: "web",
    addedDate: "2026-04-09"
  },
  {
    id: "salsa-soya",
    name: "Salsa de Soya",
    brand: "",
    per100g: { kcal: 53, prot: 8.1, carbs: 4.9, fat: 0.1, fiber: 0, sodium: 5720, sugar: 5.0, sat_fat: 0.0 },
    source: "web",
    addedDate: "2026-04-09"
  },
  {
    id: "maizena",
    name: "Maizena (Almidón de Maíz)",
    brand: "",
    per100g: { kcal: 381, prot: 0.3, carbs: 91, fat: 0.1, fiber: 0, sodium: 7, sugar: 0.0, sat_fat: 0.0 },
    source: "web",
    addedDate: "2026-04-09"
  },
  {
    id: "chocolate-negro-90",
    name: "Chocolate Negro 90% Cacao",
    brand: "",
    per100g: { kcal: 592, prot: 10, carbs: 14, fat: 55, fiber: 11, sodium: 14, sugar: 7.0, sat_fat: 17.0 },
    source: "web",
    addedDate: "2026-04-09"
  },
  {
    id: "fruits-rouges-mix",
    name: "Fruits Rouges Mix (fraises, framboises, myrtilles)",
    brand: "",
    per100g: { kcal: 40, prot: 0.8, carbs: 9, fat: 0.3, fiber: 2.5, sodium: 1, sugar: 7.0, sat_fat: 0.0 },
    source: "web",
    addedDate: "2026-04-09"
  },
  {
    id: "pp-vanilla-protein",
    name: "PP Vanilla (Protein Powder)",
    brand: "Generic",
    per100g: { kcal: 375, prot: 80, carbs: 5, fat: 3, fiber: 0, sodium: 150, sugar: 2.0, sat_fat: 0.5 },
    source: "web",
    addedDate: "2026-04-09",
    notes: "Generic vanilla whey protein powder"
  },
  {
    id: "leche-almendra",
    name: "Leche de Almendra (sin azúcar)",
    brand: "",
    per100g: { kcal: 13, prot: 0.4, carbs: 0.2, fat: 1.1, fiber: 0.2, sodium: 80, sugar: 0.2, sat_fat: 0.1 },
    source: "web",
    addedDate: "2026-04-09"
  },
  {
    id: "tomate-triturado",
    name: "Tomate Triturado / Passata",
    brand: "",
    per100g: { kcal: 24, prot: 1, carbs: 4, fat: 0.2, fiber: 1, sodium: 10, sugar: 3.5, sat_fat: 0.0 },
    source: "web",
    addedDate: "2026-04-09"
  },
  {
    id: "ciabatta-artesanal",
    name: "Ciabatta Pan Artesanal",
    brand: "",
    per100g: { kcal: 271, prot: 9, carbs: 50, fat: 3.5, fiber: 2.5, sodium: 420, sugar: 2.0, sat_fat: 0.5 },
    source: "web",
    addedDate: "2026-04-09"
  },
  {
    id: "arroz-salteado",
    name: "Arroz Salteado (Stir-Fried Rice)",
    brand: "",
    per100g: { kcal: 150, prot: 3.2, carbs: 30, fat: 1.5, fiber: 0.4, sodium: 150, sugar: 0.0, sat_fat: 1.0 },
    source: "web",
    addedDate: "2026-04-10"
  },
  {
    id: "mani-salado",
    name: "Maní Salado (Cacahuetes Tostados)",
    brand: "",
    per100g: { kcal: 585, prot: 24.5, carbs: 16.1, fat: 49.2, fiber: 8, sodium: 340, sugar: 4.0, sat_fat: 7.0 },
    source: "web",
    addedDate: "2026-04-10"
  },
  {
    id: "spanakopita-light",
    name: "Spanakopita Light",
    brand: "Recetario",
    per100g: { kcal: 179.9, prot: 10.8, carbs: 6.6, fat: 12.1, fiber: 2.3, sodium: 350, sugar: 2.0, sat_fat: 4.0 },
    totalG: 1250,
    source: "recetario",
    addedDate: "2026-04-11",
    notes: "150g feta Islos AOP brebis, 1kg espinaca congelada Picard, 18g aceite oliva, 27g mantequilla, 4 huevos, 4 claras, 375g ricotta Casa Azzurra (1.5 tarros), 6 hojas brick grande. Yield 1100g"
  },
  {
    id: "pan-banano-hp-chocolate",
    name: "Pan de Banano High Protein + Chocolate Oscuro",
    brand: "Recetario",
    per100g: { kcal: 223.5, prot: 9.3, carbs: 33.7, fat: 5.9, fiber: 1.5, sodium: 250, sugar: 12.0, sat_fat: 3.0 },
    totalG: 743,
    source: "recetario",
    addedDate: "2026-04-11",
    notes: "300g banano maduro, 50g azucar blanca (4 cdas), 3 huevos, 1 cdita vainilla, 160g harina blanca, 1/4 cdita bicarbonato, 1/2 cdita canela, 30g proteina EAFit vanille, 45g chispas chocolate oscuro bio (1/4 taza). Yield ~743g"
  },
  {
    id: "almendras-enteras",
    name: "Almendras Enteras (Natural)",
    brand: "",
    per100g: { kcal: 576, prot: 21, carbs: 22, fat: 49, fiber: 12, sodium: 1, sugar: 4.4, sat_fat: 3.7 },
    unitWeight: 1.2, unitLabel: "almendra",
    source: "web",
    addedDate: "2026-04-11"
  },
  {
    id: "eafit-pure-isolate-chocolat",
    name: "Pure Isolate Whey Chocolat",
    brand: "EAFit",
    per100g: { kcal: 354, prot: 81, carbs: 3.7, fat: 1.6, fiber: 3.3, sodium: 130, sugar: 2.0, sat_fat: 0.4 },
    source: "web",
    addedDate: "2026-04-11"
  },
  {
    id: "patate-cuite",
    name: "Pomme de Terre (cuite)",
    brand: "",
    per100g: { kcal: 87, prot: 1.9, carbs: 20, fat: 0.1, fiber: 1.8, sodium: 240, sugar: 0.5, sat_fat: 0.1 },
    source: "web",
    addedDate: "2026-04-11"
  },
  {
    id: "cuisse-poulet-cuite",
    name: "Cuisse de Poulet (cuite, sans peau, sans os)",
    brand: "",
    per100g: { kcal: 172, prot: 26, carbs: 0, fat: 7, fiber: 0, sodium: 90, sugar: 0.0, sat_fat: 2.5 },
    source: "web",
    addedDate: "2026-04-11",
    notes: "300g con hueso ≈ 150g carne comestible (50%). Sin piel"
  },
  {
    id: "saumon-benny-kozy",
    name: "Saumon Benny (Kozy Paris)",
    brand: "Kozy Paris",
    per100g: { kcal: 160.3, prot: 8.2, carbs: 12.2, fat: 8.5, fiber: 0.5, sodium: 280, sugar: 1.0, sat_fat: 4.0 },
    totalG: 340,
    source: "user",
    addedDate: "2026-04-11",
    notes: "Brioche 80g, saumon fumé 60g, huevo pochado 50g, espinacas 60g, salsa holandesa 30g. Total ~340g, 545 kcal"
  },
  {
    id: "girasoli-burrata-basilic-picard",
    name: "Girasoli Burrata Basilic",
    brand: "Picard",
    per100g: { kcal: 181, prot: 8.4, carbs: 25, fat: 4.8, fiber: 1.8, sodium: 380, sugar: 3.0, sat_fat: 5.0 },
    source: "web",
    addedDate: "2026-04-12"
  },
  {
    id: "kebab-veau-maison",
    name: "Kebab Veau Fait Maison (carne sola)",
    brand: "",
    per100g: { kcal: 180, prot: 25, carbs: 1, fat: 8.5, fiber: 0, sodium: 350, sugar: 0.0, sat_fat: 5.0 },
    source: "web",
    addedDate: "2026-04-12",
    notes: "Veau magro marinado (yogurt, poco aceite, especias), grillé maison. Sin pan ni salsa"
  },
  {
    id: "avena-cruda",
    name: "Avena en Hojuelas (cruda)",
    brand: "",
    per100g: { kcal: 389, prot: 16.9, carbs: 66.3, fat: 6.9, fiber: 10.6, sodium: 2, sugar: 1.0, sat_fat: 1.2 },
    source: "web",
    addedDate: "2026-04-12"
  },
  {
    id: "cocoa-en-polvo",
    name: "Cocoa en Polvo (sin azucar)",
    brand: "",
    per100g: { kcal: 228, prot: 19.6, carbs: 57.9, fat: 13.7, fiber: 33.2, sodium: 21, sugar: 1.8, sat_fat: 7.4 },
    source: "web",
    addedDate: "2026-04-12"
  },
  {
    id: "pancake-avena-chocolate-hp",
    name: "Pancake Avena de Chocolate High Protein",
    brand: "Recetario",
    per100g: { kcal: 115.8, prot: 13.3, carbs: 14.9, fat: 1.9, fiber: 2.8, sodium: 200, sugar: 8.0, sat_fat: 2.0 },
    totalG: 245,
    source: "recetario",
    addedDate: "2026-04-12",
    notes: "30g avena cruda, 30g banano, 15g cocoa, 140ml agua, 30g eafit choc. TotalG = raw batter weight"
  },
  {
    id: "blueberries-frescas",
    name: "Blueberries (Arandanos) Frescos",
    brand: "",
    per100g: { kcal: 57, prot: 0.7, carbs: 14.5, fat: 0.3, fiber: 2.4, sodium: 1, sugar: 9.7, sat_fat: 0.0 },
    source: "web",
    addedDate: "2026-04-12"
  },
  {
    id: "shake-strawberry-blueberry-protein",
    name: "Strawberry & Blueberry Protein Shake",
    brand: "Recetario",
    per100g: { kcal: 77.4, prot: 10.8, carbs: 6.1, fat: 1.3, fiber: 0.5, sodium: 100, sugar: 4.0, sat_fat: 0.1 },
    totalG: 255,
    source: "recetario",
    addedDate: "2026-04-12",
    notes: "75ml kefir, 75ml skyr, 20g proteina eafit choc, 60g fresas, 25g blueberries"
  },
  {
    id: "quinoa-cocida",
    name: "Quinoa Cocida",
    brand: "",
    per100g: { kcal: 120, prot: 4.4, carbs: 21.3, fat: 1.9, fiber: 2.8, sodium: 7, sugar: 0.5, sat_fat: 0.2 },
    source: "web",
    addedDate: "2026-04-12"
  },
  {
    id: "ejotes-cocidos",
    name: "Ejotes / Judias Verdes (cocidos)",
    brand: "",
    per100g: { kcal: 35, prot: 1.9, carbs: 7.9, fat: 0.3, fiber: 3.4, sodium: 6, sugar: 2.4, sat_fat: 0.0 },
    source: "web",
    addedDate: "2026-04-12"
  },
  {
    id: "holy-cookie-pistachio",
    name: "Holy Cookie Hot Chocolate Pistachio",
    brand: "Holy Cookie Paris",
    per100g: { kcal: 493, prot: 11.3, carbs: 35.4, fat: 33.0, fiber: 2.5, sodium: 120, sugar: 30.0, sat_fat: 8.0 },
    totalG: 180,
    source: "user",
    addedDate: "2026-04-12",
    notes: "Cookie choc noir Valrhona + pate pistache 100% + eclats pistache + fleur de sel. Estimado visual"
  },
  {
    id: "wasa-fibre",
    name: "Tartine Croustillante Fibre",
    brand: "Wasa",
    per100g: { kcal: 340, prot: 10, carbs: 58, fat: 2.5, fiber: 25, sodium: 290, sugar: 3.0, sat_fat: 0.5 },
    unitWeight: 14, unitLabel: "tranche",
    source: "web",
    addedDate: "2026-04-12"
  },
  {
    id: "pasta-cocida",
    name: "Pasta Tornillos (cocida)",
    brand: "Generic",
    per100g: { kcal: 131, prot: 5, carbs: 25, fat: 1.1, fiber: 1.8, sodium: 1, sugar: 0.5, sat_fat: 0.1 },
    source: "web",
    addedDate: "2026-04-13"
  },
  {
    id: "espinaca-congelada",
    name: "Espinaca Congelada",
    brand: "Generic",
    per100g: { kcal: 23, prot: 2.5, carbs: 1.5, fat: 0.4, fiber: 2.1, sodium: 70, sugar: 0.5, sat_fat: 0.1 },
    source: "web",
    addedDate: "2026-04-13"
  },
  {
    id: "maicena",
    name: "Maicena (Fecula de Maiz)",
    brand: "Generic",
    per100g: { kcal: 381, prot: 0.3, carbs: 91, fat: 0.1, fiber: 0.9, sodium: 7, sugar: 0.0, sat_fat: 0.0 },
    source: "web",
    addedDate: "2026-04-13"
  },
  // Pasta con Pollo, Espinaca y Tomate a la Adri — 70g pasta cocida, 150g espinaca congelada, 153g tomate cherry, 75g skyr, 300g pollo horneado, 75ml agua, 5g maicena. Total ~828g
  {
    id: "pasta-pollo-espinaca-tomate-adri",
    name: "Pasta con Pollo, Espinaca y Tomate a la Adri",
    brand: "Recetario",
    per100g: { kcal: 86.4, prot: 13.3, carbs: 4.0, fat: 1.5, fiber: 0.8, sodium: 300, sugar: 3.0, sat_fat: 3.0 },
    totalG: 828,
    source: "recetario",
    addedDate: "2026-04-13",
    notes: "70g pasta cocida, 150g espinaca congelada, 153g tomate cherry, 75g skyr siggis, 300g pollo horneado, 75ml agua, 5g maicena"
  },
  {
    id: "remolacha-cocida",
    name: "Remolacha (Betterave) Cocida",
    brand: "Generic",
    per100g: { kcal: 44, prot: 1.7, carbs: 10, fat: 0.1, fiber: 2, sodium: 65, sugar: 7.0, sat_fat: 0.0 },
    source: "web",
    addedDate: "2026-04-13"
  },
  {
    id: "kefir-lactel-0-bio",
    name: "Kéfir 0% Bio",
    brand: "Lactel",
    per100g: { kcal: 44, prot: 3.4, carbs: 4.1, fat: 1.5, fiber: 0, sodium: 55, sugar: 4.5, sat_fat: 0.1 },
    source: "web",
    addedDate: "2026-04-13"
  },
  {
    id: "weider-peanut-butter-powder",
    name: "Peanut Butter Powder",
    brand: "Weider",
    per100g: { kcal: 440, prot: 49, carbs: 19, fat: 13, fiber: 0, sodium: 180, sugar: 5.0, sat_fat: 2.0 },
    source: "web",
    addedDate: "2026-04-13"
  },
  {
    id: "mermelada-lucien-fraises-sans-sucres",
    name: "Confiture Fraises Sans Sucres Ajoutés",
    brand: "Lucien Georgelin",
    per100g: { kcal: 89, prot: 0.6, carbs: 21.7, fat: 0.5, fiber: 8.9, sodium: 5, sugar: 15.0, sat_fat: 0.0 },
    source: "web",
    addedDate: "2026-04-13"
  },
  {
    id: "semillas-maranon",
    name: "Semillas de Marañon (Cashews)",
    brand: "Generic",
    per100g: { kcal: 553, prot: 18, carbs: 30, fat: 44, fiber: 3, sodium: 12, sugar: 6.0, sat_fat: 9.0 },
    source: "web",
    addedDate: "2026-04-14"
  },
  {
    id: "patatas-horneadas",
    name: "Patatas Horneadas (sin aceite)",
    brand: "Generic",
    per100g: { kcal: 93, prot: 2.5, carbs: 21, fat: 0.1, fiber: 2.2, sodium: 10, sugar: 0.5, sat_fat: 0.1 },
    source: "web",
    addedDate: "2026-04-14"
  },
  {
    id: "tomate-fresco",
    name: "Tomate Fresco",
    brand: "",
    per100g: { kcal: 18, prot: 0.9, carbs: 3.9, fat: 0.2, fiber: 1.2, sodium: 5, sugar: 2.3, sat_fat: 0.0 },
    source: "web",
    addedDate: "2026-04-15"
  },
  {
    id: "pan-caja-integral",
    name: "Pan de Caja Integral (rebanada pequeña)",
    brand: "Generic",
    per100g: { kcal: 247, prot: 9, carbs: 41, fat: 3.4, fiber: 6, sodium: 380, sugar: 4.0, sat_fat: 0.5 },
    unitWeight: 25, unitLabel: "rebanada",
    source: "web",
    addedDate: "2026-04-15"
  },
  {
    id: "tostones-platano-macho",
    name: "Tostones de Plátano Macho (fritos, secados con toalla)",
    brand: "Homemade",
    per100g: { kcal: 280, prot: 1.3, carbs: 44, fat: 11, fiber: 2, sodium: 180, sugar: 2.0, sat_fat: 1.0 },
    unitWeight: 33, unitLabel: "toston",
    source: "web",
    addedDate: "2026-04-15"
  },
  {
    id: "platano-maduro-frito",
    name: "Plátano Maduro Frito (rodajitas)",
    brand: "Homemade",
    per100g: { kcal: 240, prot: 1, carbs: 40, fat: 9, fiber: 1.5, sodium: 120, sugar: 15.0, sat_fat: 3.0 },
    source: "web",
    addedDate: "2026-04-15"
  },
  // Huevo Picado con Tomate y Cebolla — 1/2 tbsp aceite (7g), 182g cebolla, 6 tomates (~600g), 250g huevo. Total ~1039g
  {
    id: "huevo-picado-tomate-cebolla",
    name: "Huevo Picado con Tomate y Cebolla",
    brand: "Recetario",
    per100g: { kcal: 60.7, prot: 3.8, carbs: 4.1, fat: 3.5, fiber: 0.8, sodium: 120, sugar: 1.5, sat_fat: 2.0 },
    totalG: 1039,
    source: "recetario",
    addedDate: "2026-04-15",
    notes: "1/2 tbsp aceite (7g), 182g cebolla, 6 tomates frescos (~600g), 250g huevo entero"
  },
  {
    id: "chispas-chocolate-oscuro",
    name: "Chispas de Chocolate Oscuro (Dark Chips)",
    brand: "",
    per100g: { kcal: 480, prot: 5, carbs: 55, fat: 28, fiber: 7, sodium: 10, sugar: 40.0, sat_fat: 14.0 },
    source: "web",
    addedDate: "2026-04-15"
  },
  {
    id: "cote-dor-noir-70",
    name: "Chocolat Noir Intense 70%",
    brand: "Côte d'Or",
    per100g: { kcal: 545, prot: 8, carbs: 35, fat: 40, fiber: 11, sodium: 8, sugar: 28.0, sat_fat: 17.0 },
    source: "web",
    addedDate: "2026-04-15"
  },
  {
    id: "mini-financier-amandes",
    name: "Mini Financier aux Amandes",
    brand: "Generic",
    per100g: { kcal: 453, prot: 5.4, carbs: 46.9, fat: 25.6, fiber: 1, sodium: 150, sugar: 35.0, sat_fat: 7.0 },
    unitWeight: 15, unitLabel: "financier",
    source: "web",
    addedDate: "2026-04-16"
  },
  {
    id: "madeleine-traditionnelle",
    name: "Madeleine Traditionnelle",
    brand: "Generic",
    per100g: { kcal: 433, prot: 6.7, carbs: 50, fat: 23.3, fiber: 0.5, sodium: 300, sugar: 30.0, sat_fat: 7.0 },
    unitWeight: 25, unitLabel: "madeleine",
    source: "web",
    addedDate: "2026-04-16"
  },
  {
    id: "champinones-frescos",
    name: "Champiñones (Hongos Frescos)",
    brand: "",
    per100g: { kcal: 22, prot: 3.1, carbs: 3.3, fat: 0.3, fiber: 1.0, sodium: 5, sugar: 2.0, sat_fat: 0.1 },
    source: "web",
    addedDate: "2026-04-15"
  },
  {
    id: "ricotta-casero",
    name: "Ricotta Casero (Homemade)",
    brand: "Homemade",
    per100g: { kcal: 174, prot: 11.3, carbs: 3.0, fat: 13.0, fiber: 0, sodium: 70, sugar: 3.0, sat_fat: 7.0 },
    source: "web",
    addedDate: "2026-04-16"
  },
  {
    id: "hipro-creme-dessert-choco-noisette",
    name: "Crème Dessert Chocolat Noisette",
    brand: "HiPro",
    per100g: { kcal: 76, prot: 10.2, carbs: 6.3, fat: 0.9, fiber: 0, sodium: 70, sugar: 7.0, sat_fat: 1.5 },
    source: "web",
    addedDate: "2026-04-17"
  },
  {
    id: "cannelloni-ricotta-epinard-picard",
    name: "Cannelloni Ricotta Épinard Sauce Tomate",
    brand: "Picard",
    per100g: { kcal: 120, prot: 5.6, carbs: 9.2, fat: 6.5, fiber: 1.3, sodium: 450, sugar: 4.0, sat_fat: 4.0 },
    totalG: 350,
    source: "web",
    addedDate: "2026-04-17",
    notes: "4 cannelloni farcis épinards ricotta, sauce tomate, mozzarella. Caja 350g"
  },
  {
    id: "frijoles-negros-licuados",
    name: "Frijoles Negros Licuados (sin grasa extra)",
    brand: "Homemade",
    per100g: { kcal: 90, prot: 6, carbs: 12, fat: 1.5, fiber: 4, sodium: 5, sugar: 1.5, sat_fat: 0.3 },
    source: "web",
    addedDate: "2026-04-17"
  },
  {
    id: "carne-mechada-venezolana",
    name: "Carne Mechada Venezolana (guiso hervido + sofrito AOVE)",
    brand: "Homemade",
    per100g: { kcal: 140, prot: 17, carbs: 3, fat: 6.5, fiber: 0.5, sodium: 280, sugar: 1.0, sat_fat: 3.0 },
    source: "web",
    addedDate: "2026-04-17"
  },
  {
    id: "halloumi-frito",
    name: "Halloumi Frito (aceite arachide, secado toalla)",
    brand: "Generic",
    per100g: { kcal: 350, prot: 20, carbs: 3, fat: 30, fiber: 0, sodium: 700, sugar: 0.0, sat_fat: 14.0 },
    source: "web",
    addedDate: "2026-04-17"
  },
  {
    id: "agua-jamaica-sin-azucar",
    name: "Agua de Jamaica sin Azúcar",
    brand: "Homemade",
    per100g: { kcal: 2, prot: 0, carbs: 0.5, fat: 0, fiber: 0, sodium: 5, sugar: 0.0, sat_fat: 0.0 },
    source: "web",
    addedDate: "2026-04-17"
  },
  // Carne mechada Netozolana — arroz cocido 50g, frijoles licuados 30g, carne mechada 176g, platano sazon frito 64g, tostones fritos 51g, halloumi frito 33g. Total 404g
  {
    id: "carne-mechada-netozolana",
    name: "Carne Mechada Netozolana",
    brand: "Recetario",
    per100g: { kcal: 185.7, prot: 10.1, carbs: 17.8, fat: 8.2, fiber: 2.0, sodium: 280, sugar: 2.0, sat_fat: 3.0 },
    totalG: 404,
    source: "recetario",
    addedDate: "2026-04-17",
    notes: "Casamiento (arroz cocido 50g + frijoles licuados 30g, asado no frito), carne mechada venezolana 176g (guiso francés hervido + sofrito tomate/cebolla/ajo/pimiento/2cditas AOVE), plátano sazón frito arachide 64g, tostones fritos arachide 51g, halloumi frito arachide 33g. Todo frito bien secado con toalla."
  },
  {
    id: "croissant-boulangerie",
    name: "Croissant Artisanal",
    brand: "Les Commères",
    per100g: { kcal: 406, prot: 8.2, carbs: 45.8, fat: 21, fiber: 2, sodium: 400, sugar: 5.0, sat_fat: 14.0 },
    unitWeight: 50, unitLabel: "croissant",
    source: "web",
    addedDate: "2026-04-18"
  },
  {
    id: "chausson-pommes-boulangerie",
    name: "Chausson aux Pommes Artisanal",
    brand: "Les Commères",
    per100g: { kcal: 340, prot: 3.5, carbs: 40, fat: 18, fiber: 1.5, sodium: 350, sugar: 12.0, sat_fat: 8.0 },
    unitWeight: 140, unitLabel: "chausson",
    source: "web",
    addedDate: "2026-04-18"
  },
  {
    id: "mache-salade",
    name: "Mâche (Salade)",
    brand: "",
    per100g: { kcal: 11, prot: 2.0, carbs: 0.4, fat: 0.4, fiber: 1.5, sodium: 8, sugar: 0.5, sat_fat: 0.0 },
    source: "web",
    addedDate: "2026-04-17"
  },
  // LouieLouie restaurant (Charonne, Paris) - 2026-04-18
  {
    id: "pizza-margherite-louielouie",
    name: "Pizza Margherite LouieLouie (salsa, poca mozza, masa)",
    brand: "LouieLouie",
    per100g: { kcal: 210, prot: 7, carbs: 31, fat: 6, fiber: 1.5, sodium: 520, sugar: 3.5, sat_fat: 5.0 },
    source: "web",
    addedDate: "2026-04-18"
  },
  {
    id: "pizza-jamon-bigorre-louielouie",
    name: "Pizza Jamón Noir de Bigorre LouieLouie (arugula, burrata, tomate)",
    brand: "LouieLouie",
    per100g: { kcal: 250, prot: 11, carbs: 27, fat: 10, fiber: 1, sodium: 500, sugar: 3.0, sat_fat: 5.0 },
    source: "web",
    addedDate: "2026-04-18"
  },
  {
    id: "profiterole-sorbet-vanille-chocolat",
    name: "Profiterole (sorbete vainilla, salsa chocolate negro, avellana)",
    brand: "LouieLouie",
    per100g: { kcal: 280, prot: 4, carbs: 33, fat: 14, fiber: 0.5, sodium: 80, sugar: 25.0, sat_fat: 6.0 },
    source: "web",
    addedDate: "2026-04-18"
  },
  {
    id: "vino-blanco-seco",
    name: "Vino Blanco Seco",
    brand: "Generic",
    per100g: { kcal: 82, prot: 0.1, carbs: 2.6, fat: 0, fiber: 0, sodium: 10, sugar: 2.6, sat_fat: 0.0 },
    source: "web",
    addedDate: "2026-04-18"
  },
  {
    id: "limonada-casera",
    name: "Limonada Casera (limón, azúcar, agua)",
    brand: "Generic",
    per100g: { kcal: 35, prot: 0, carbs: 9, fat: 0, fiber: 0, sodium: 2, sugar: 8.0, sat_fat: 0.0 },
    source: "web",
    addedDate: "2026-04-18"
  },
  // === PRODUCTOS Y RECETARIO (added 2026-04-19) ===
  {
    id: "alfajor-havanna-chocolate-ddl",
    name: "Alfajor Chocolate con Dulce de Leche",
    brand: "Havanna",
    per100g: { kcal: 409, prot: 5.3, carbs: 58, fat: 17, fiber: 1, sodium: 100, sugar: 45.0, sat_fat: 12.0 },
    unitWeight: 55, unitLabel: "alfajor",
    source: "web",
    addedDate: "2026-04-19"
  },
  {
    id: "arepa-maiz-blanco-casera",
    name: "Arepa de Maiz Blanco Casera (Harina PAN, cocida)",
    brand: "Homemade",
    per100g: { kcal: 152, prot: 3.5, carbs: 34, fat: 0.7, fiber: 1.5, sodium: 340, sugar: 0.5, sat_fat: 0.5 },
    source: "web",
    addedDate: "2026-04-19"
  },
  {
    id: "hipro-chocolate-drink",
    name: "HiPro Protein Drink Chocolat (bebida liquida)",
    brand: "Danone",
    per100g: { kcal: 54, prot: 7.2, carbs: 4, fat: 0.3, fiber: 0, sodium: 90, sugar: 5.0, sat_fat: 0.5 },
    source: "web",
    addedDate: "2026-04-19",
    notes: "Botella 345ml, 25g proteina. Bebida liquida, no yogur"
  },
  {
    id: "cottage-cheese-president",
    name: "Cottage Cheese",
    brand: "President",
    per100g: { kcal: 99, prot: 12, carbs: 2.5, fat: 4.5, fiber: 0, sodium: 320, sugar: 3.5, sat_fat: 2.5 },
    source: "web",
    addedDate: "2026-04-19"
  },
  {
    id: "casamiento-arroz-frijoles",
    name: "Casamiento (Arroz Cocido + Frijoles Negros Licuados)",
    brand: "Homemade",
    per100g: { kcal: 115, prot: 3.9, carbs: 22, fat: 0.8, fiber: 2, sodium: 100, sugar: 0.5, sat_fat: 0.5 },
    source: "recetario",
    addedDate: "2026-04-19",
    notes: "Mezcla ~62% arroz cocido + ~38% frijoles negros licuados, salteado sin grasa extra"
  },
  {
    id: "pollo-pepiado-zucchini",
    name: "Pollo Pepiado (pechuga hervida + zucchini licuado + AOVE)",
    brand: "Recetario",
    per100g: { kcal: 91, prot: 13.3, carbs: 1.8, fat: 3.3, fiber: 0.5, sodium: 120, sugar: 1.0, sat_fat: 1.5 },
    totalG: 615,
    source: "recetario",
    addedDate: "2026-04-19",
    notes: "Pechuga hervida (~250g cocida), salteada en AOVE con ajo, 2 zucchinis licuados (~400g). Total ~615g"
  },
  {
    id: "salsa-skyr-cilantro",
    name: "Salsa de Skyr con Cilantro y AOVE",
    brand: "Recetario",
    per100g: { kcal: 85, prot: 10, carbs: 4, fat: 3, fiber: 0, sodium: 50, sugar: 4.0, sat_fat: 0.1 },
    source: "recetario",
    addedDate: "2026-04-19",
    notes: "Skyr siggis + ajo + AOVE poquito + cilantro"
  },
  {
    id: "guacamole-zucchini-limon",
    name: "Guacamole de Aguacate con Zucchini y Limon",
    brand: "Homemade",
    per100g: { kcal: 88, prot: 1.5, carbs: 5.7, fat: 7.5, fiber: 3, sodium: 80, sugar: 1.0, sat_fat: 2.0 },
    source: "recetario",
    addedDate: "2026-04-19",
    notes: "1/2 aguacate + 1/2 zucchini + limon"
  },
  {
    id: "cebolla-salteada",
    name: "Cebolla Salteada (poco aceite)",
    brand: "",
    per100g: { kcal: 50, prot: 1.1, carbs: 9, fat: 1, fiber: 1.5, sodium: 20, sugar: 6.0, sat_fat: 0.5 },
    source: "web",
    addedDate: "2026-04-19"
  },
  {
    id: "shake-vanilla-fresas",
    name: "Shake Vanilla Fresas (EAFit + fresas + agua)",
    brand: "Recetario",
    per100g: { kcal: 44, prot: 8.8, carbs: 2.1, fat: 0.2, fiber: 0.3, sodium: 100, sugar: 3.0, sat_fat: 0.1 },
    totalG: 300,
    source: "recetario",
    addedDate: "2026-04-19",
    notes: "~30g EAFit vanille + ~70g fresas frescas + ~200ml agua, licuado"
  },
  {
    id: "sante-crispy-oat-honey",
    name: "Crispy Oat and Honey Cookie",
    brand: "Santé",
    per100g: { kcal: 475, prot: 9, carbs: 60, fat: 20, fiber: 4, sodium: 320, sugar: 22.0, sat_fat: 4.0 },
    unitWeight: 40, unitLabel: "galleta",
    source: "user",
    addedDate: "2026-04-20",
    notes: "User-provided: 190 kcal, 3.6g prot, 24g carbs, 8g fat por galleta (40g)"
  },
  {
    id: "odyssee-salade-thon-intermarche",
    name: "Salade au Thon Odyssée (valeur moyenne variantes)",
    brand: "Odyssée - Intermarché",
    per100g: { kcal: 125, prot: 7.5, carbs: 10, fat: 6, fiber: 1.5, sodium: 380, sugar: 1.0, sat_fat: 1.0 },
    source: "web",
    addedDate: "2026-04-21",
    notes: "Valor promedio entre variantes (parisienne/nicoise/indienne/mexicaine/piemontaise). Ajustar si variante especifica"
  },
  {
    id: "baguette-croustigraine-ounissi",
    name: "Baguette Croustigraine (multicéréales)",
    brand: "Ounissi",
    per100g: { kcal: 280, prot: 10, carbs: 50, fat: 3, fiber: 4, sodium: 380, sugar: 3.0, sat_fat: 0.5 },
    source: "web",
    addedDate: "2026-04-21",
    notes: "Baguette multicereales con graines. Valores estimados genericos multigrain baguette"
  },
  // === NUEVOS 2026-04-22 ===
  {
    id: "klm-macaron-coco",
    name: "Macaron de Coco (galleta avión KLM)",
    brand: "KLM",
    per100g: { kcal: 460, prot: 4, carbs: 63, fat: 21, fiber: 3, sodium: 100, sugar: 40.0, sat_fat: 12.0 },
    source: "web",
    addedDate: "2026-04-22",
    notes: "Dutch coconut macaron típica de vuelos KLM"
  },
  {
    id: "pan-panini-delgado",
    name: "Pan Panini Pequeño Delgado",
    brand: "Boulangerie",
    per100g: { kcal: 280, prot: 9, carbs: 50, fat: 3, fiber: 2.5, sodium: 500, sugar: 4.0, sat_fat: 0.5 },
    source: "web",
    addedDate: "2026-04-22"
  },
  {
    id: "pesto-generico",
    name: "Pesto Genérico (albahaca, piñones, queso, aceite)",
    brand: "Generic",
    per100g: { kcal: 400, prot: 3.5, carbs: 5, fat: 39, fiber: 1, sodium: 380, sugar: 1.0, sat_fat: 5.0 },
    source: "web",
    addedDate: "2026-04-22"
  },
  {
    id: "queso-cabra-fresco",
    name: "Queso de Cabra Fresco",
    brand: "Generic",
    per100g: { kcal: 300, prot: 19, carbs: 1, fat: 25, fiber: 0, sodium: 370, sugar: 0.0, sat_fat: 11.0 },
    source: "web",
    addedDate: "2026-04-22"
  },
  {
    id: "arugula-fresca",
    name: "Arugula (Roquette) Fresca",
    brand: "",
    per100g: { kcal: 25, prot: 2.6, carbs: 3.7, fat: 0.7, fiber: 1.6, sodium: 27, sugar: 2.0, sat_fat: 0.1 },
    source: "web",
    addedDate: "2026-04-22"
  },
  {
    id: "nueces-enteras",
    name: "Nueces Enteras (Walnuts)",
    brand: "",
    per100g: { kcal: 654, prot: 15, carbs: 14, fat: 65, fiber: 6.7, sodium: 2, sugar: 2.6, sat_fat: 6.1 },
    unitWeight: 4, unitLabel: "nuez",
    source: "web",
    addedDate: "2026-04-22"
  },
  {
    id: "vegetales-mixtos-tomate-chile-hojas",
    name: "Vegetales Mixtos (tomate, chile rojo, hojas verdes)",
    brand: "Homemade",
    per100g: { kcal: 25, prot: 1.2, carbs: 5, fat: 0.2, fiber: 1.8, sodium: 30, sugar: 2.5, sat_fat: 0.0 },
    source: "web",
    addedDate: "2026-04-22"
  },
  {
    id: "tarta-manzana-amsterdam-crumble",
    name: "Tarta de Manzana Estilo Amsterdam con Crumble",
    brand: "Boulangerie",
    per100g: { kcal: 250, prot: 3, carbs: 30, fat: 12, fiber: 1.5, sodium: 150, sugar: 20.0, sat_fat: 5.0 },
    source: "web",
    addedDate: "2026-04-22",
    notes: "Dutch appeltaart con crumble topping"
  },
  {
    id: "nata-chantilly",
    name: "Nata Chantilly (crème fouettée sucrée)",
    brand: "Generic",
    per100g: { kcal: 250, prot: 2, carbs: 3, fat: 25, fiber: 0, sodium: 30, sugar: 12.0, sat_fat: 15.0 },
    source: "web",
    addedDate: "2026-04-22"
  },
  {
    id: "mcdonalds-mccrispy-chicken",
    name: "McCrispy Chicken (sandwich clasico)",
    brand: "McDonald's",
    per100g: { kcal: 229, prot: 13.2, carbs: 22, fat: 9.8, fiber: 0.5, sodium: 600, sugar: 5.0, sat_fat: 4.0 },
    unitWeight: 205, unitLabel: "sandwich",
    source: "web",
    addedDate: "2026-04-22",
    notes: "Sandwich entero ~205g = 470 kcal, 27g prot, 45g carbs, 20g fat"
  },
  {
    id: "mcdonalds-royal-cheese",
    name: "Royal Cheese (Quarter Pounder con queso)",
    brand: "McDonald's",
    per100g: { kcal: 267, prot: 15.4, carbs: 20.5, fat: 13.3, fiber: 0.8, sodium: 620, sugar: 6.0, sat_fat: 9.0 },
    unitWeight: 195, unitLabel: "burger",
    source: "web",
    addedDate: "2026-04-22",
    notes: "Burger entera ~195g = 520 kcal, 30g prot, 40g carbs, 26g fat"
  },
  {
    id: "mcdonalds-papas-large",
    name: "Papas Fritas Large",
    brand: "McDonald's",
    per100g: { kcal: 312, prot: 3.4, carbs: 41, fat: 15, fiber: 4, sodium: 290, sugar: 0.5, sat_fat: 2.5 },
    source: "web",
    addedDate: "2026-04-22",
    notes: "Large McDo France ~150g"
  },
  {
    id: "mcdonalds-cheesestick",
    name: "Cheese Stick (mozzarella frita)",
    brand: "McDonald's",
    per100g: { kcal: 248, prot: 11, carbs: 22, fat: 12, fiber: 1, sodium: 450, sugar: 1.0, sat_fat: 8.0 },
    unitWeight: 27, unitLabel: "stick",
    source: "web",
    addedDate: "2026-04-22",
    notes: "3 sticks = 200 kcal, ~81g total"
  },
  {
    id: "mcdonalds-sweet-sour-sauce",
    name: "Salsa Sweet and Sour",
    brand: "McDonald's",
    per100g: { kcal: 184, prot: 0.5, carbs: 43, fat: 0.5, fiber: 0, sodium: 520, sugar: 20.0, sat_fat: 0.0 },
    unitWeight: 25, unitLabel: "sachet",
    source: "web",
    addedDate: "2026-04-22"
  },
  {
    id: "mcdonalds-ketchup-sachet",
    name: "Ketchup Sachet",
    brand: "McDonald's",
    per100g: { kcal: 100, prot: 1, carbs: 24, fat: 0.1, fiber: 0.3, sodium: 800, sugar: 25.0, sat_fat: 0.0 },
    unitWeight: 10, unitLabel: "sobre",
    source: "web",
    addedDate: "2026-04-22"
  },
  {
    id: "heineken-biere",
    name: "Cerveza Heineken (rubia 5%)",
    brand: "Heineken",
    per100g: { kcal: 42, prot: 0.5, carbs: 3.2, fat: 0, fiber: 0, sodium: 14, sugar: 1.5, sat_fat: 0.0 },
    source: "web",
    addedDate: "2026-04-22"
  },
  {
    id: "lipton-ice-tea-low-sugar",
    name: "Lipton Ice Tea Low Sugar",
    brand: "Lipton",
    per100g: { kcal: 18, prot: 0, carbs: 4.3, fat: 0, fiber: 0, sodium: 10, sugar: 4.3, sat_fat: 0.0 },
    source: "web",
    addedDate: "2026-04-22"
  },
  {
    id: "fuze-tea-the-vert",
    name: "Fuze Tea Thé Vert",
    brand: "Fuze Tea",
    per100g: { kcal: 18, prot: 0, carbs: 4.4, fat: 0, fiber: 0, sodium: 5, sugar: 5.5, sat_fat: 0.0 },
    source: "web",
    addedDate: "2026-04-22"
  },
  {
    id: "zuivelhoeve-boern-yoghurt",
    name: "Boer'n Yoghurt (yogur espeso holandés)",
    brand: "Zuivelhoeve",
    per100g: { kcal: 54, prot: 3.7, carbs: 4.3, fat: 2.5, fiber: 0, sodium: 55, sugar: 5.0, sat_fat: 2.0 },
    source: "web",
    addedDate: "2026-04-23",
    notes: "Pot 500g típico. 1/3 = ~167g"
  },
  {
    id: "papas-ambacht-frites-artesanales",
    name: "Frites Artesanales Amsterdam (Papa's Ambacht)",
    brand: "Papa's Ambacht",
    per100g: { kcal: 350, prot: 4, carbs: 42, fat: 18, fiber: 4, sodium: 400, sugar: 0.5, sat_fat: 3.0 },
    source: "web",
    addedDate: "2026-04-23",
    notes: "Hand-cut double-fried Dutch frites, más ricas que McDo"
  },
  {
    id: "queso-dutch-oud-amsterdam",
    name: "Queso Dutch Oud (Amsterdam Old)",
    brand: "Generic",
    per100g: { kcal: 380, prot: 28, carbs: 0, fat: 30, fiber: 0, sodium: 620, sugar: 0.0, sat_fat: 18.0 },
    source: "web",
    addedDate: "2026-04-23",
    notes: "Queso holandés añejo"
  },
  {
    id: "salsa-trufa-parmesan",
    name: "Salsa Trufa con Parmesano",
    brand: "Generic",
    per100g: { kcal: 450, prot: 3, carbs: 5, fat: 46, fiber: 0, sodium: 400, sugar: 1.0, sat_fat: 6.0 },
    source: "web",
    addedDate: "2026-04-23"
  },
  {
    id: "mayo-picante",
    name: "Mayonesa Picante",
    brand: "Generic",
    per100g: { kcal: 650, prot: 1, carbs: 2, fat: 70, fiber: 0, sodium: 600, sugar: 2.0, sat_fat: 5.0 },
    source: "web",
    addedDate: "2026-04-23"
  },
  {
    id: "ketchup-generico",
    name: "Ketchup Genérico",
    brand: "Generic",
    per100g: { kcal: 100, prot: 1, carbs: 24, fat: 0.1, fiber: 0.3, sodium: 900, sugar: 22.0, sat_fat: 0.0 },
    source: "web",
    addedDate: "2026-04-23"
  },
  {
    id: "muffin-blueberry-artesanal",
    name: "Muffin Blueberry Artesanal",
    brand: "Boulangerie",
    per100g: { kcal: 370, prot: 5, carbs: 55, fat: 14, fiber: 1.5, sodium: 280, sugar: 25.0, sat_fat: 4.0 },
    source: "web",
    addedDate: "2026-04-23"
  },
  {
    id: "muffin-chocolate-artesanal",
    name: "Muffin Chocolate Artesanal",
    brand: "Boulangerie",
    per100g: { kcal: 420, prot: 5, carbs: 54, fat: 20, fiber: 2, sodium: 310, sugar: 28.0, sat_fat: 5.0 },
    source: "web",
    addedDate: "2026-04-23"
  },
  {
    id: "poffertjes-mini-dutch",
    name: "Mini Poffertjes Holandesas",
    brand: "Boulangerie NL",
    per100g: { kcal: 340, prot: 5, carbs: 48, fat: 13, fiber: 1.5, sodium: 250, sugar: 20.0, sat_fat: 4.0 },
    unitWeight: 8, unitLabel: "mini pancake",
    source: "web",
    addedDate: "2026-04-23",
    notes: "Pancakes pequeñas dulces tipicas de Amsterdam, con mantequilla y azucar"
  },
  {
    id: "salsa-pistacho",
    name: "Salsa de Pistacho (topping)",
    brand: "Generic",
    per100g: { kcal: 500, prot: 8, carbs: 40, fat: 35, fiber: 2, sodium: 200, sugar: 10.0, sat_fat: 5.0 },
    source: "web",
    addedDate: "2026-04-23"
  },
  {
    id: "salsa-kinder-bueno",
    name: "Salsa Kinder Bueno (topping)",
    brand: "Generic",
    per100g: { kcal: 560, prot: 7, carbs: 55, fat: 36, fiber: 1, sodium: 200, sugar: 30.0, sat_fat: 8.0 },
    source: "web",
    addedDate: "2026-04-23"
  },
  {
    id: "sopa-thai-mariscos-picante",
    name: "Sopa Thai Picante con Broth de Mariscos",
    brand: "Restaurant",
    per100g: { kcal: 50, prot: 4, carbs: 4, fat: 1.5, fiber: 0.5, sodium: 700, sugar: 3.0, sat_fat: 2.0 },
    source: "web",
    addedDate: "2026-04-23",
    notes: "Tipo tom yum con broth mariscos y vegetales"
  },
  {
    id: "arroz-basmati-cocido",
    name: "Arroz Basmati Cocido",
    brand: "",
    per100g: { kcal: 130, prot: 2.7, carbs: 28, fat: 0.3, fiber: 0.4, sodium: 1, sugar: 0.0, sat_fat: 0.1 },
    source: "web",
    addedDate: "2026-04-23"
  },
  {
    id: "thai-carne-vegetales-maranon-hongos",
    name: "Thai Carne con Vegetales, Marañón y Hongos",
    brand: "Restaurant",
    per100g: { kcal: 180, prot: 14, carbs: 10, fat: 10, fiber: 2, sodium: 650, sugar: 4.0, sat_fat: 3.0 },
    source: "web",
    addedDate: "2026-04-23"
  },
  {
    id: "hipro-banana-drink",
    name: "HiPro Protein Drink Banane (bebida liquida)",
    brand: "Danone",
    per100g: { kcal: 54, prot: 7.2, carbs: 4, fat: 0.3, fiber: 0, sodium: 90, sugar: 7.0, sat_fat: 0.5 },
    source: "web",
    addedDate: "2026-04-24",
    notes: "Botella 345ml, 25g proteina. Bebida liquida, no yogur"
  },
  {
    id: "ensalada-thai-peanut-mango-satay-oliver-green",
    name: "Ensalada Thai Peanut con Mango y Pollo Satay",
    brand: "Oliver Green Amsterdam",
    per100g: { kcal: 130, prot: 8.5, carbs: 11, fat: 6, fiber: 2, sodium: 480, sugar: 8.0, sat_fat: 3.0 },
    source: "web",
    addedDate: "2026-04-24",
    notes: "Bowl tipico 450-500g, ensalada con pollo satay, mango y aderezo peanut"
  },
  {
    id: "stroopwafel-rudi-chocolate-negro",
    name: "Stroopwafel con Chocolate Negro",
    brand: "Rudi's Original",
    per100g: { kcal: 480, prot: 6, carbs: 65, fat: 22, fiber: 1.5, sodium: 200, sugar: 40.0, sat_fat: 6.0 },
    unitWeight: 40, unitLabel: "stroopwafel",
    source: "web",
    addedDate: "2026-04-24"
  },
  {
    id: "te-verde-menta",
    name: "Té Verde con Menta",
    brand: "",
    per100g: { kcal: 1, prot: 0, carbs: 0, fat: 0, fiber: 0, sodium: 1, sugar: 0.0, sat_fat: 0.0 },
    source: "web",
    addedDate: "2026-04-24"
  },
  {
    id: "frites-pareltje-amsterdam",
    name: "Frites Artesanales 't Pareltje Amsterdam",
    brand: "'t Pareltje",
    per100g: { kcal: 350, prot: 4, carbs: 42, fat: 18, fiber: 4, sodium: 380, sugar: 0.5, sat_fat: 3.0 },
    source: "web",
    addedDate: "2026-04-24",
    notes: "Hand-cut Dutch frites Amsterdam"
  },
  {
    id: "mayo-trufa",
    name: "Mayonesa de Trufa",
    brand: "Generic",
    per100g: { kcal: 450, prot: 3, carbs: 5, fat: 46, fiber: 0, sodium: 550, sugar: 2.0, sat_fat: 5.0 },
    source: "web",
    addedDate: "2026-04-24"
  },
  {
    id: "parmesano-rayado",
    name: "Queso Parmesano Rallado",
    brand: "Generic",
    per100g: { kcal: 392, prot: 36, carbs: 0.4, fat: 28, fiber: 0, sodium: 1529, sugar: 0.0, sat_fat: 15.0 },
    source: "web",
    addedDate: "2026-04-24"
  },
  {
    id: "ensalada-ah-linzen-kikkererwten-geitenkaas",
    name: "Ensalada Albert Heijn Lentejas, Garbanzos y Queso de Cabra",
    brand: "Albert Heijn",
    per100g: { kcal: 140, prot: 7, carbs: 14, fat: 6, fiber: 4, sodium: 350, sugar: 3.0, sat_fat: 3.0 },
    source: "web",
    addedDate: "2026-04-24",
    notes: "AH ready salad: linzen + kikkererwten + 9.3 geitenkaas + vinagreta 12%"
  },
  // === PRODUCTOS (added 2026-04-27) ===
  {
    id: "zuivelhoeve-stevige-trek",
    name: "Stevige Trek Yoghurt con Granola",
    brand: "Zuivelhoeve",
    per100g: { kcal: 135, prot: 5, carbs: 17, fat: 4.5, fiber: 1, sodium: 80, sugar: 12.0, sat_fat: 1.5 },
    unitWeight: 200, unitLabel: "pot grande",
    source: "web",
    addedDate: "2026-04-27",
    notes: "Pot grande con yogur espeso + granola incluida (200g)"
  },
  {
    id: "van-stapele-cookie",
    name: "Cookie Chocolate Negro con Núcleo Chocolate Blanco",
    brand: "Van Stapele Koekmakerij",
    per100g: { kcal: 500, prot: 5, carbs: 50, fat: 28, fiber: 2, sodium: 150, sugar: 45.0, sat_fat: 15.0 },
    unitWeight: 80, unitLabel: "cookie",
    source: "web",
    addedDate: "2026-04-27",
    notes: "Famosa cookie de Amsterdam, 60g de chocolate blanco fundido en el núcleo"
  },
  {
    id: "subway-sweet-onion-chicken-teriyaki-15cm",
    name: "Subway Sweet Onion Chicken Teriyaki 15cm con pan sésamo",
    brand: "Subway",
    per100g: { kcal: 151, prot: 11, carbs: 24.5, fat: 1.8, fiber: 1.5, sodium: 620, sugar: 7.0, sat_fat: 2.0 },
    unitWeight: 245, unitLabel: "sub 15cm",
    source: "web",
    addedDate: "2026-04-27",
    notes: "6\" sub: 370 kcal, 27g prot, 60g carbs, 4.5g fat. Pan con sésamo, salsa cebolla dulce, vegetales"
  },
  {
    id: "tres-leches-tiramisu-amsterdam",
    name: "Tres Leches Tiramisu",
    brand: "De Beste Lekkernij Herenstraat",
    per100g: { kcal: 280, prot: 4.5, carbs: 30, fat: 15, fiber: 0, sodium: 120, sugar: 25.0, sat_fat: 8.0 },
    unitWeight: 120, unitLabel: "porcion",
    source: "estimate",
    addedDate: "2026-04-27",
    notes: "Pastelería Amsterdam, postre fusion tres leches + tiramisu, ~120g porción"
  },
  {
    id: "zaanlander-48-cheese",
    name: "Queso Zaanlander 48+",
    brand: "Zaanlander",
    per100g: { kcal: 420, prot: 27, carbs: 0, fat: 35, fiber: 0, sodium: 600, sugar: 0.0, sat_fat: 16.0 },
    unitWeight: 20, unitLabel: "rodaja",
    source: "web",
    addedDate: "2026-04-27",
    notes: "Queso holandés madurado 48% MG. 1 rodaja ~20g"
  },
  {
    id: "pollo-salteado",
    name: "Pechuga de Pollo Salteado (con poco aceite)",
    brand: "",
    per100g: { kcal: 180, prot: 31, carbs: 0, fat: 6, fiber: 0, sodium: 70, sugar: 0.0, sat_fat: 1.0 },
    source: "web",
    addedDate: "2026-04-27",
    notes: "Pechuga horneada 165 kcal/100g + ~1 cdita aceite oliva por porción"
  },
  {
    id: "bolletje-pan-amsterdam-semillas",
    name: "Bolletje Pan Amsterdam con Semillas",
    brand: "",
    per100g: { kcal: 270, prot: 9, carbs: 40, fat: 7, fiber: 5, sodium: 350, sugar: 5.0, sat_fat: 1.0 },
    unitWeight: 80, unitLabel: "bol",
    source: "web",
    addedDate: "2026-04-27",
    notes: "Pan de Amsterdam estilo Bolletje con semillas mixtas"
  },
  {
    id: "frambuesas-fresas",
    name: "Frambuesas Frescas",
    brand: "",
    per100g: { kcal: 52, prot: 1.2, carbs: 11.9, fat: 0.7, fiber: 6.5, sodium: 1, sugar: 5.5, sat_fat: 0.0 },
    source: "web",
    addedDate: "2026-04-27"
  },
  {
    id: "carne-mechada",
    name: "Carne Mechada (res deshebrada estilo latino)",
    brand: "",
    per100g: { kcal: 190, prot: 22, carbs: 4, fat: 9, fiber: 1, sodium: 280, sugar: 1.0, sat_fat: 3.0 },
    source: "web",
    addedDate: "2026-04-27",
    notes: "Falda/sobrebarriga deshebrada con cebolla, pimentón, tomate"
  },
  {
    id: "sopa-pollo-fideos-vegetales",
    name: "Sopa de Pollo con Fideos, Brócoli y Zanahoria",
    brand: "",
    per100g: { kcal: 50, prot: 3, carbs: 6, fat: 1.2, fiber: 0.8, sodium: 450, sugar: 2.0, sat_fat: 1.0 },
    source: "estimate",
    addedDate: "2026-04-27",
    notes: "Sopa casera tipo bowl ~400ml: pollo, fideos, brócoli, zanahoria"
  },
  // === PRODUCTOS (added 2026-04-28) ===
  {
    id: "hotel-yogurt-granola-amsterdam",
    name: "Yogurt con Granola del Hotel (Amsterdam)",
    brand: "Hotel buffet",
    per100g: { kcal: 120, prot: 5, carbs: 14, fat: 5, fiber: 1, sodium: 80, sugar: 15.0, sat_fat: 2.0 },
    unitWeight: 180, unitLabel: "pot",
    source: "estimate",
    addedDate: "2026-04-28",
    notes: "Pot mediano hotel buffet ~180g: yogur natural + granola"
  },
  {
    id: "subway-melt-sweet-onion-15cm",
    name: "Subway Melt 15cm con Sweet Onion (jamón, pavo, bacon, queso)",
    brand: "Subway",
    per100g: { kcal: 167, prot: 9.4, carbs: 22.9, fat: 4.5, fiber: 2, sodium: 780, sugar: 7.0, sat_fat: 5.0 },
    unitWeight: 245, unitLabel: "sub 15cm",
    source: "web",
    addedDate: "2026-04-28",
    notes: "6\" Subway Melt: 370 kcal, 23g prot, 47g carbs, 11g fat + ~40 kcal sweet onion sauce"
  },
  {
    id: "tres-leches-pistacho-amsterdam",
    name: "Tres Leches Pistacho",
    brand: "De Beste Lekkernij Herenstraat",
    per100g: { kcal: 290, prot: 5.5, carbs: 28, fat: 16, fiber: 0.5, sodium: 100, sugar: 25.0, sat_fat: 6.0 },
    unitWeight: 120, unitLabel: "porcion",
    source: "estimate",
    addedDate: "2026-04-28",
    notes: "Variante con crema de pistacho, ~120g porción"
  },
  {
    id: "jugo-manzana-avion",
    name: "Jugo de Manzana",
    brand: "Avion",
    per100g: { kcal: 46, prot: 0.1, carbs: 11.3, fat: 0, fiber: 0.2, sodium: 3, sugar: 10.5, sat_fat: 0.0 },
    source: "web",
    addedDate: "2026-04-28",
    notes: "Vaso pequeño ~150ml"
  },
  {
    id: "caldo-pollo",
    name: "Caldo de Pollo",
    brand: "",
    per100g: { kcal: 10, prot: 1.5, carbs: 0.5, fat: 0.3, fiber: 0, sodium: 500, sugar: 0.5, sat_fat: 0.5 },
    source: "web",
    addedDate: "2026-04-28"
  },
  {
    id: "crutones-caseros",
    name: "Crutones Caseros (pan tostado)",
    brand: "Homemade",
    per100g: { kcal: 400, prot: 12, carbs: 70, fat: 8, fiber: 3, sodium: 500, sugar: 1.0, sat_fat: 1.0 },
    source: "estimate",
    addedDate: "2026-04-28",
    notes: "Pan tostado en horno con poco aceite"
  },
  {
    id: "lechuga-fresca",
    name: "Hojas de Lechuga Frescas",
    brand: "",
    per100g: { kcal: 15, prot: 1.4, carbs: 2.9, fat: 0.2, fiber: 1.3, sodium: 10, sugar: 1.0, sat_fat: 0.0 },
    source: "web",
    addedDate: "2026-04-28"
  },
  {
    id: "chile-rojo-fresco",
    name: "Chile Rojo Fresco (pimiento rojo)",
    brand: "",
    per100g: { kcal: 31, prot: 1.0, carbs: 6.0, fat: 0.3, fiber: 2.1, sodium: 3, sugar: 4.2, sat_fat: 0.0 },
    source: "web",
    addedDate: "2026-04-28"
  },
  {
    id: "tastybasics-cracker-protein",
    name: "Crackers Less Carbs More Protein",
    brand: "TastyBasics",
    per100g: { kcal: 498, prot: 36, carbs: 15, fat: 30, fiber: 15, sodium: 290, sugar: 1.0, sat_fat: 1.0 },
    source: "web",
    addedDate: "2026-04-27"
  },
  {
    id: "flax-seed",
    name: "Semillas de Lino (Flax Seed)",
    brand: "",
    per100g: { kcal: 534, prot: 18, carbs: 29, fat: 42, fiber: 27, sodium: 30, sugar: 1.6, sat_fat: 3.7 },
    source: "web",
    addedDate: "2026-04-28"
  },
  {
    id: "starbucks-protein-drink-coffee-lowfat",
    name: "Protein Drink with Coffee Caffe Latte Low Fat",
    brand: "Starbucks",
    per100g: { kcal: 51, prot: 6.1, carbs: 4.1, fat: 1.1, fiber: 0, sodium: 80, sugar: 10.0, sat_fat: 1.0 },
    unitWeight: 330, unitLabel: "bottle",
    source: "web",
    addedDate: "2026-04-28",
    notes: "1 bottle 330ml = 20g proteina"
  },
  {
    id: "aceituna-kalamata",
    name: "Aceituna Kalamata (sin hueso)",
    brand: "",
    per100g: { kcal: 240, prot: 1, carbs: 6, fat: 22, fiber: 3.3, sodium: 1600, sugar: 0.0, sat_fat: 1.8 },
    unitWeight: 4, unitLabel: "aceituna",
    source: "web",
    addedDate: "2026-04-28"
  },
  // === PRODUCTOS (added 2026-04-29) ===
  {
    id: "tony-chocolonely-dark-70",
    name: "Chocolate Negro 70%",
    brand: "Tony's Chocolonely",
    per100g: { kcal: 575, prot: 9, carbs: 34, fat: 41, fiber: 11.6, sodium: 15, sugar: 26.0, sat_fat: 14.0 },
    source: "web",
    addedDate: "2026-04-29",
    notes: "Pure 70% dark, fairtrade. Tablette estándar 180g divisible en 15 cuadros (~12g)"
  },
  {
    id: "lomo-cerdo-horneado",
    name: "Lomo de Cerdo Horneado",
    brand: "",
    per100g: { kcal: 143, prot: 26, carbs: 0, fat: 4.5, fiber: 0, sodium: 75, sugar: 0.0, sat_fat: 1.5 },
    source: "web",
    addedDate: "2026-04-29",
    notes: "Lean pork loin, baked, no oil added. USDA reference"
  },
  {
    id: "camote-hervido",
    name: "Camote Hervido",
    brand: "",
    per100g: { kcal: 76, prot: 1.4, carbs: 17.7, fat: 0.1, fiber: 2.5, sodium: 36, sugar: 8.0, sat_fat: 0.1 },
    source: "web",
    addedDate: "2026-04-29",
    notes: "Sweet potato (boniato/batata), boiled without skin. USDA reference"
  },
  {
    id: "pain-aux-raisins",
    name: "Pain aux Raisins (Roulé)",
    brand: "Boulangerie",
    per100g: { kcal: 340, prot: 6.5, carbs: 45, fat: 15, fiber: 2, sodium: 300, sugar: 18.0, sat_fat: 5.0 },
    unitWeight: 90, unitLabel: "pièce",
    source: "web",
    addedDate: "2026-04-29",
    notes: "Viennoiserie française classique, ~90g par pièce"
  },
  {
    id: "fideos-chinos-mamee",
    name: "Mamee Nouilles Instantanées Saveur Poulet",
    brand: "Mamee",
    per100g: { kcal: 378, prot: 9.2, carbs: 46.6, fat: 16.5, fiber: 2.4, sodium: 1200, sugar: 5.0, sat_fat: 3.0 },
    unitWeight: 85, unitLabel: "paquete",
    source: "web",
    addedDate: "2026-04-30",
    notes: "Valores per 100g SECO (FatSecret). Paquete completo 85g = 321 kcal, 7.8 prot, 39.6 carbs, 14 fat"
  },
  {
    id: "kinder-chocobon",
    name: "Kinder Schoko-Bons (Chocobon)",
    brand: "Kinder",
    per100g: { kcal: 565, prot: 7.5, carbs: 56, fat: 34, fiber: 1, sodium: 65, sugar: 53.0, sat_fat: 10.0 },
    unitWeight: 5, unitLabel: "chocobon",
    source: "web",
    addedDate: "2026-04-30",
    notes: "Mini bombón Kinder relleno de leche/avellanas, ~5g cada uno"
  },
  {
    id: "froyo-llao-llao-homemade-ninja",
    name: "Froyo Llao Llao Homemade (Ninja Creami)",
    brand: "Homemade",
    per100g: { kcal: 70.5, prot: 13.5, carbs: 4.0, fat: 0.2, fiber: 0, sodium: 55, sugar: 3.5, sat_fat: 0.1 },
    source: "recipe",
    addedDate: "2026-05-01",
    recipe: [
      { ingredient: "Skyr nature 0%",        grams: 300 },
      { ingredient: "Yogur griego 0%",        grams: 100 },
      { ingredient: "Whey vainilla (EAFit)",  grams: 25  },
      { ingredient: "Leche desnatada",        grams: 50  },
      { ingredient: "Eritritol",              grams: 12  },
      { ingredient: "Zumo limón (1 cdta)",    grams: 5   }
    ],
    notes: "Versión light proteica estilo Llao Llao. Acidez yogur + frescura limón. Receta total 492g → 70.5 kcal/100g. Ninja Creami."
  },
  // === PRODUCTOS (added 2026-05-01) ===
  {
    id: "helado-light-vainilla",
    name: "Helado Light Vainilla",
    brand: "",
    per100g: { kcal: 100, prot: 3, carbs: 17, fat: 3, fiber: 0, sodium: 60, sugar: 14.0, sat_fat: 1.5 },
    source: "estimate",
    addedDate: "2026-05-01",
    notes: "Helado light tipo vainilla (Francia) ~100 kcal/100g — estimado"
  },
  {
    id: "durum-biyo-agneau",
    name: "Dürüm Biyo Agneau (Biyo Dürüm, París 12)",
    brand: "Biyo Dürüm",
    per100g: { kcal: 200, prot: 13, carbs: 22, fat: 11, fiber: 1.5, sodium: 480, sugar: 1.0, sat_fat: 4.0 },
    source: "estimate",
    addedDate: "2026-05-01",
    recipe: [
      { ingredient: "Pain Yufka fait maison", role: "wrap" },
      { ingredient: "Viande d'agneau", role: "protein" },
      { ingredient: "Salade", role: "vegetal" },
      { ingredient: "Tomate", role: "vegetal" },
      { ingredient: "Oignons", role: "vegetal" },
      { ingredient: "Persil", role: "vegetal" }
    ],
    notes: "Dürüm fait maison Biyo Dürüm (París 12): yufka artesanal, agneau, salade, tomate, oignon, persil — macros estimados"
  },
  {
    id: "lahmacun-turco",
    name: "Lahmacun (Biyo Dürüm)",
    brand: "Biyo Dürüm",
    per100g: { kcal: 155, prot: 6.9, carbs: 22, fat: 4.2, fiber: 1.5, sodium: 350, sugar: 2.0, sat_fat: 1.5 },
    source: "web",
    addedDate: "2026-05-01",
    notes: "Lahmacun turco con viande hachée, poivron rouge, oignon, persil — FatSecret"
  },
  {
    id: "pogaca-feta-mantequilla",
    name: "Poğaça Feta y Mantequilla",
    brand: "Biyo Dürüm",
    per100g: { kcal: 400, prot: 10, carbs: 40, fat: 22, fiber: 1, sodium: 500, sugar: 2.0, sat_fat: 10.0 },
    source: "estimate",
    addedDate: "2026-05-01",
    notes: "Poğaça turca rellena de feta y mantequilla, cubierta de sésamo — estimado"
  },
  {
    id: "mozzarella-barilla-maxi",
    name: "Mozzarella Fresca Maxi",
    brand: "Barilla",
    per100g: { kcal: 242, prot: 17.1, carbs: 1.8, fat: 19.0, fiber: 0, sodium: 350, sugar: 0.5, sat_fat: 12.5 },
    source: "web",
    addedDate: "2026-05-05"
  },
  {
    id: "uvas-blancas",
    name: "Uvas Blancas (sin semilla)",
    brand: "",
    per100g: { kcal: 67, prot: 0.6, carbs: 17.0, fat: 0.4, fiber: 0.9, sodium: 1, sugar: 16.0, sat_fat: 0.0 },
    source: "web",
    addedDate: "2026-05-05"
  },
  {
    id: "vegetales-wok",
    name: "Vegetales Salteados (wok)",
    brand: "",
    per100g: { kcal: 35, prot: 2.0, carbs: 6.0, fat: 0.5, fiber: 2.0, sodium: 80, sugar: 3.0, sat_fat: 0.1 },
    source: "estimate",
    addedDate: "2026-05-05",
    notes: "Mix wok generico: brócoli, zanahoria, col, pimiento"
  },

  // === AGREGADOS 2026-05-07 ===
  {
    id: "couscous-cuit",
    name: "Couscous Cocido",
    brand: "Genérico",
    per100g: { kcal: 112, prot: 3.8, carbs: 23, fat: 0.2, fiber: 0.6, sodium: 5, sugar: 0.0, sat_fat: 0.0 },
    source: "usda",
    addedDate: "2026-05-07"
  },
  {
    id: "skyr-danone-stracciatella",
    name: "Skyr Danone Stracciatella",
    brand: "Danone",
    per100g: { kcal: 80, prot: 10, carbs: 8, fat: 2, fiber: 0, sodium: 58, sugar: 7.5, sat_fat: 1.3 },
    source: "openfoodfacts",
    addedDate: "2026-05-07"
  },
  {
    id: "too-good-snack-poivre",
    name: "Too Good Snack Poivre",
    brand: "Too Good",
    per100g: { kcal: 400, prot: 1, carbs: 56.5, fat: 9.6, fiber: 5, sodium: 650, sugar: 3.0, sat_fat: 1.0 },
    source: "openfoodfacts",
    addedDate: "2026-05-07",
    notes: "macros pendientes verificación"
  },
  {
    id: "cereal-monstruo-quaker",
    name: "Cereal Monstruo Quaker",
    brand: "Quaker",
    per100g: { kcal: 380, prot: 7, carbs: 78, fat: 4, fiber: 3, sodium: 320, sugar: 35.0, sat_fat: 1.0 },
    source: "estimated",
    addedDate: "2026-05-07",
    notes: "estimated - no encontrado en OpenFoodFacts"
  },
  {
    id: "cereal-monstruo-rockstar",
    name: "Cereal Monstruo Rockstar",
    brand: "Genérico",
    per100g: { kcal: 380, prot: 7, carbs: 78, fat: 4, fiber: 3, sodium: 320, sugar: 35.0, sat_fat: 1.0 },
    source: "estimated",
    addedDate: "2026-05-07",
    notes: "estimated - no encontrado en OpenFoodFacts"
  },
  {
    id: "hipro-fresa",
    name: "HiPro Fresa Danone",
    brand: "Danone",
    per100g: { kcal: 54, prot: 9.4, carbs: 3.9, fat: 0.1, fiber: 0, sodium: 60, sugar: 3.9, sat_fat: 0.0 },
    source: "openfoodfacts",
    addedDate: "2026-05-07"
  },
  {
    id: "lindt-excellence-fleur-de-sel",
    name: "Lindt Excellence Pointe de Fleur de Sel",
    brand: "Lindt",
    per100g: { kcal: 537, prot: 5.7, carbs: 52, fat: 32, fiber: 4, sodium: 250, sugar: 44.0, sat_fat: 19.0 },
    source: "openfoodfacts",
    addedDate: "2026-05-07"
  },
  {
    id: "yogurt-hotos",
    name: "Yogurt Hotos 0%",
    brand: "Hotos",
    per100g: { kcal: 52, prot: 7.9, carbs: 5, fat: 0, fiber: 0, sodium: 48, sugar: 5.0, sat_fat: 0.0 },
    source: "openfoodfacts",
    addedDate: "2026-05-07"
  },
  {
    id: "yogurt-griego-natural",
    name: "Yogurt Griego Natural 0%",
    brand: "Genérico",
    per100g: { kcal: 57, prot: 10, carbs: 3.6, fat: 0.4, fiber: 0, sodium: 35, sugar: 3.6, sat_fat: 0.1 },
    source: "usda",
    addedDate: "2026-05-07"
  },
  // Sorbete Pistacho — 52g yogurt griego 0% + 134g Skyr Siggis Nature + 40g EAFit Vanille. Total 226g. Per100g calculado.
  {
    id: "sorbete-pistacho-ernesto-adri",
    name: "Sorbete Pistacho (Recetario Ernesto/Adriana)",
    brand: "Recetario",
    per100g: { kcal: 115.2, prot: 24.0, carbs: 3.8, fat: 0.4, fiber: 0, sodium: 75, sugar: 2.0, sat_fat: 0.0 },
    totalG: 226,
    source: "recetario",
    addedDate: "2026-05-07",
    notes: "52g yogurt griego 0% + 134g Skyr Siggis Nature + 40g EAFit Pure Isolate Vanille. Total crudo 226g."
  },
  {
    id: "pistacho-picado",
    name: "Pistacho Picado (crudo)",
    brand: "Genérico",
    per100g: { kcal: 562, prot: 20, carbs: 28, fat: 45, fiber: 10, sodium: 5, sugar: 7.0, sat_fat: 5.5 },
    source: "usda",
    addedDate: "2026-05-07"
  },
  {
    id: "kinder-postre-naranja-chocolat",
    name: "Kinder Barra Postre Naranja Chocolate",
    brand: "Kinder",
    per100g: { kcal: 568, prot: 8.8, carbs: 53.6, fat: 35.2, fiber: 1, sodium: 65, sugar: 50.0, sat_fat: 18.0 },
    unitWeight: 25, unitLabel: "barra",
    source: "web",
    addedDate: "2026-05-08",
    notes: "Variante naranja-chocolate; macros estimadas con valores estándar Kinder bar"
  },
  {
    id: "falafel-generic",
    name: "Falafel (cuit/frit)",
    brand: "Generic",
    per100g: { kcal: 330, prot: 13, carbs: 31, fat: 17, fiber: 8, sodium: 400, sugar: 4.0, sat_fat: 2.0 },
    unitWeight: 35, unitLabel: "falafel",
    source: "web",
    addedDate: "2026-05-08"
  },
  {
    id: "empanada-halloumi",
    name: "Empanada de Halloumi",
    brand: "Generic",
    per100g: { kcal: 280, prot: 9, carbs: 24, fat: 14, fiber: 1.5, sodium: 600, sugar: 1.5, sat_fat: 6.0 },
    unitWeight: 60, unitLabel: "empanada",
    source: "web",
    addedDate: "2026-05-08",
    notes: "Estimación basada en empanada de queso genérica con halloumi"
  },
  {
    id: "galette-sarrasin-nature",
    name: "Galette de Sarrasin Nature",
    brand: "Generic",
    per100g: { kcal: 152, prot: 4.9, carbs: 30.2, fat: 1.3, fiber: 2.0, sodium: 200, sugar: 1.0, sat_fat: 0.2 },
    unitWeight: 80, unitLabel: "galette",
    source: "web",
    addedDate: "2026-05-08"
  },
  {
    id: "hipro-creme-dessert-vanille",
    name: "Crème Dessert Vanille",
    brand: "HiPro",
    per100g: { kcal: 77, prot: 10.2, carbs: 5.9, fat: 0.8, fiber: 0, sodium: 70, sugar: 4.5, sat_fat: 0.5 },
    unitWeight: 180, unitLabel: "pot",
    source: "web",
    addedDate: "2026-05-08"
  },
  {
    id: "chocolate-negro-80",
    name: "Chocolate Negro 80% Cacao",
    brand: "",
    per100g: { kcal: 600, prot: 7, carbs: 39, fat: 53.6, fiber: 10, sodium: 14, sugar: 22.0, sat_fat: 32.0 },
    source: "web",
    addedDate: "2026-05-08"
  },
  {
    id: "hipro-natural",
    name: "HiPro Natural 0%",
    brand: "Danone",
    per100g: { kcal: 53, prot: 10, carbs: 3.0, fat: 0.1, fiber: 0, sodium: 60, sugar: 3.0, sat_fat: 0.0 },
    unitWeight: 160, unitLabel: "pot",
    source: "web",
    addedDate: "2026-05-14"
  },
  {
    id: "galettes-riz-nature",
    name: "Galettes de Riz Nature",
    brand: "Generic",
    per100g: { kcal: 387, prot: 8.0, carbs: 82, fat: 3.0, fiber: 2.0, sodium: 5, sugar: 0.5, sat_fat: 0.5 },
    unitWeight: 9, unitLabel: "galette",
    source: "web",
    addedDate: "2026-05-14"
  },
  {
    id: "coppa-charcuterie",
    name: "Coppa (charcuterie)",
    brand: "Generic",
    per100g: { kcal: 380, prot: 24, carbs: 0.5, fat: 30, fiber: 0, sodium: 1800, sugar: 0.5, sat_fat: 10.0 },
    source: "web",
    addedDate: "2026-05-14"
  },
  {
    id: "prosciutto-crudo",
    name: "Prosciutto Crudo",
    brand: "Generic",
    per100g: { kcal: 250, prot: 26, carbs: 0.5, fat: 15, fiber: 0, sodium: 2200, sugar: 0.0, sat_fat: 5.0 },
    source: "web",
    addedDate: "2026-05-14"
  },
  {
    id: "quesitos-diana",
    name: "Quesitos Diana (queso crema porciones)",
    brand: "Diana",
    per100g: { kcal: 240, prot: 10, carbs: 3.5, fat: 20, fiber: 0, sodium: 850, sugar: 3.0, sat_fat: 12.0 },
    source: "web",
    addedDate: "2026-05-14"
  },
  {
    id: "cheese-balls-republique",
    name: "Cheese Balls Chips Chez République",
    brand: "Chez République",
    per100g: { kcal: 540, prot: 7, carbs: 54, fat: 32, fiber: 1.5, sodium: 980, sugar: 3.0, sat_fat: 6.0 },
    source: "estimated",
    addedDate: "2026-05-14"
  },
  {
    id: "saucisson-sec",
    name: "Saucisson Sec",
    brand: "Generic",
    per100g: { kcal: 410, prot: 24, carbs: 1.5, fat: 35, fiber: 0, sodium: 1500, sugar: 0.5, sat_fat: 13.0 },
    source: "web",
    addedDate: "2026-05-14"
  },
  {
    id: "pollo-guisado-verduras",
    name: "Pollo Guisado con Verduras",
    brand: "Casero",
    per100g: { kcal: 120, prot: 14, carbs: 5, fat: 5, fiber: 1.5, sodium: 300, sugar: 2.5, sat_fat: 1.5 },
    source: "estimated",
    addedDate: "2026-05-14"
  },
  {
    id: "pain-au-chocolat",
    name: "Pain au Chocolat",
    brand: "Boulangerie",
    per100g: { kcal: 414, prot: 7.1, carbs: 47.0, fat: 22.0, fiber: 2.0 },
    unitWeight: 65,
    unitLabel: "pieza",
    source: "user",
    addedDate: "2026-05-16"
  },
  {
    id: "crepe-jambon-fromage",
    name: "Crêpe Jambon Fromage",
    brand: "Boulangerie",
    per100g: { kcal: 220, prot: 12.0, carbs: 16.0, fat: 12.0, fiber: 0.5 },
    unitWeight: 250,
    unitLabel: "crepa",
    source: "user",
    addedDate: "2026-05-16"
  },
  {
    id: "crepe-caramel-beurre-sale-chantilly-sorbet",
    name: "Crêpe Caramel Beurre Salé con Chantilly y Sorbete Vainilla",
    brand: "Restaurant",
    per100g: { kcal: 285, prot: 4.0, carbs: 32.0, fat: 16.0, fiber: 1.0 },
    unitWeight: 300,
    unitLabel: "crepa",
    source: "user",
    addedDate: "2026-05-16"
  },
  {
    id: "creme-brulee",
    name: "Crème Brûlée",
    brand: "Restaurant",
    per100g: { kcal: 290, prot: 4.0, carbs: 25.0, fat: 19.0, fiber: 0 },
    unitWeight: 5,
    unitLabel: "cucharadita",
    source: "user",
    addedDate: "2026-05-16"
  },
  {
    id: "soupe-oignon-gratinee",
    name: "Soupe à l'Oignon Gratinée",
    brand: "Restaurant",
    per100g: { kcal: 95, prot: 4.0, carbs: 9.0, fat: 5.0, fiber: 1.0 },
    source: "user",
    addedDate: "2026-05-16"
  },
  {
    id: "salmon-grille-restaurant",
    name: "Filete de Salmón Grillado",
    brand: "Restaurant",
    per100g: { kcal: 206, prot: 22.0, carbs: 0, fat: 13.0, fiber: 0 },
    source: "user",
    addedDate: "2026-05-16"
  },
  {
    id: "papas-roti-restaurant",
    name: "Papas Rôties (al horno)",
    brand: "Restaurant",
    per100g: { kcal: 165, prot: 3.0, carbs: 25.0, fat: 6.0, fiber: 2.5 },
    unitWeight: 40,
    unitLabel: "papa",
    source: "user",
    addedDate: "2026-05-16"
  },
  {
    id: "ensalada-mixta-tomate-lechuga",
    name: "Ensalada Mixta (tomate, lechuga, aderezo)",
    brand: "Generic",
    per100g: { kcal: 30, prot: 1.0, carbs: 4.0, fat: 1.0, fiber: 1.5 },
    source: "user",
    addedDate: "2026-05-16"
  },
  {
    id: "yogurt-blueberry-hp-carrefour",
    name: "Yogurt Blueberry High Protein Carrefour",
    brand: "Carrefour",
    per100g: { kcal: 58, prot: 10.0, carbs: 4.0, fat: 0.2, fiber: 0.5 },
    unitWeight: 150,
    unitLabel: "yogurt",
    source: "user",
    addedDate: "2026-05-16"
  },
  {
    id: "entrecote-grille-restaurant",
    name: "Entrecôte Grillé",
    brand: "Restaurant",
    per100g: { kcal: 270, prot: 25.0, carbs: 0, fat: 18.0, fiber: 0 },
    source: "user",
    addedDate: "2026-05-16"
  },
  {
    id: "papas-fritas-fait-maison",
    name: "Papas Fritas (fait maison)",
    brand: "Restaurant",
    per100g: { kcal: 285, prot: 3.5, carbs: 35.0, fat: 14.0, fiber: 3.0 },
    source: "user",
    addedDate: "2026-05-16"
  },
  {
    id: "salsa-poivre-restaurant",
    name: "Salsa Poivre (crema pimienta)",
    brand: "Restaurant",
    per100g: { kcal: 160, prot: 2.5, carbs: 7.0, fat: 14.0, fiber: 0 },
    source: "user",
    addedDate: "2026-05-16"
  },
  {
    id: "kfc-chicken-tenders",
    name: "Chicken Tenders KFC",
    brand: "KFC",
    per100g: { kcal: 290, prot: 18.0, carbs: 18.0, fat: 16.0, fiber: 0.5 },
    unitWeight: 30,
    unitLabel: "tender",
    source: "user",
    addedDate: "2026-05-16"
  },
  {
    id: "lasagna-restaurant-generic",
    name: "Lasagna (Restaurant Genérica)",
    brand: "Restaurant",
    per100g: { kcal: 155, prot: 8.0, carbs: 12.0, fat: 8.0, fiber: 1.0 },
    source: "user",
    addedDate: "2026-05-16"
  },
  {
    id: "plato-libanes-mixto",
    name: "Plato Libanés Mixto (hummus, kebab, tabbouleh)",
    brand: "Restaurant",
    per100g: { kcal: 220, prot: 12.0, carbs: 22.0, fat: 10.0, fiber: 3.0 },
    source: "user",
    addedDate: "2026-05-16"
  },
  {
    id: "postres-libaneses-baklava",
    name: "Postres Libaneses (baklava, knafeh, etc)",
    brand: "Restaurant",
    per100g: { kcal: 380, prot: 5.0, carbs: 45.0, fat: 20.0, fiber: 1.5 },
    source: "user",
    addedDate: "2026-05-16"
  },
  {
    id: "edamame-cocido",
    name: "Edamame Cocido",
    brand: "Generic",
    per100g: { kcal: 122, prot: 11.0, carbs: 9.0, fat: 5.0, fiber: 5.0 },
    source: "user",
    addedDate: "2026-05-16"
  },
  {
    id: "financier-pistacho",
    name: "Financier Pistache",
    brand: "Boulangerie",
    per100g: { kcal: 460, prot: 8.0, carbs: 40.0, fat: 28.0, fiber: 2.0 },
    unitWeight: 15,
    unitLabel: "mini financier",
    source: "user",
    addedDate: "2026-05-16"
  },
  {
    id: "kinder-bueno-barra",
    name: "Kinder Bueno (barra dual)",
    brand: "Kinder",
    per100g: { kcal: 572, prot: 8.4, carbs: 49.0, fat: 37.0, fiber: 3.0 },
    unitWeight: 43,
    unitLabel: "barra dual",
    source: "user",
    addedDate: "2026-05-16"
  },
  {
    id: "mcdo-cheeseburger",
    name: "Cheeseburger McDonald's",
    brand: "McDonald's",
    per100g: { kcal: 256, prot: 13.0, carbs: 26.0, fat: 12.0, fiber: 1.5 },
    unitWeight: 108,
    unitLabel: "burger",
    source: "user",
    addedDate: "2026-05-16"
  },
  {
    id: "ensalada-carrefour-jamon",
    name: "Ensalada Carrefour con Jamón",
    brand: "Carrefour",
    per100g: { kcal: 130, prot: 8.0, carbs: 12.0, fat: 6.0, fiber: 2.0 },
    source: "user",
    addedDate: "2026-05-16"
  },
  {
    id: "pancito-apero-queso",
    name: "Pancito con Queso (apéritif)",
    brand: "Restaurant",
    per100g: { kcal: 320, prot: 10.0, carbs: 40.0, fat: 14.0, fiber: 1.5 },
    unitWeight: 30,
    unitLabel: "pancito",
    source: "user",
    addedDate: "2026-05-16"
  },
  {
    id: "chorizo-saucisson",
    name: "Chorizo / Saucisson Sec",
    brand: "Charcuterie",
    per100g: { kcal: 410, prot: 25.0, carbs: 1.0, fat: 35.0, fiber: 0 },
    source: "user",
    addedDate: "2026-05-16"
  },
  {
    id: "jamon-rojo-bresaola",
    name: "Jamón Rojo Tipo Bresaola/Coppa",
    brand: "Charcuterie",
    per100g: { kcal: 380, prot: 24.0, carbs: 0, fat: 32.0, fiber: 0 },
    source: "user",
    addedDate: "2026-05-16"
  },
  {
    id: "semillas-mixtas-almendra-avellana-mani",
    name: "Semillas Mixtas (almendras, avellanas, maní)",
    brand: "Generic",
    per100g: { kcal: 620, prot: 18.0, carbs: 18.0, fat: 53.0, fiber: 8.0 },
    source: "user",
    addedDate: "2026-05-16"
  },
  {
    id: "galleta-fortuna-thai",
    name: "Galleta de la Fortuna (Fortune Cookie)",
    brand: "Generic",
    per100g: { kcal: 380, prot: 4.0, carbs: 85.0, fat: 3.0, fiber: 1.0 },
    unitWeight: 7,
    unitLabel: "galleta",
    source: "user",
    addedDate: "2026-05-16"
  },
  {
    id: "jalea-fresa",
    name: "Jalea de Fresa",
    brand: "Generic",
    per100g: { kcal: 250, prot: 0.5, carbs: 60.0, fat: 0.1, fiber: 0.5 },
    source: "user",
    addedDate: "2026-05-16"
  },
  {
    id: "alcaparras-en-vinagre",
    name: "Alcaparras en Vinagre",
    brand: "Generic",
    per100g: { kcal: 23, prot: 2.4, carbs: 4.9, fat: 0.9, fiber: 3.2, sodium: 2350, sugar: 0.4, sat_fat: 0.2 },
    source: "usda",
    addedDate: "2026-05-16"
  },
  {
    id: "galleta-creme-london",
    name: "Galleta Crème London (cookie con crema)",
    brand: "Boulangerie",
    per100g: { kcal: 470, prot: 5.5, carbs: 55.0, fat: 25.0, fiber: 1.5, sodium: 280, sugar: 30.0, sat_fat: 13.0 },
    unitWeight: 70,
    unitLabel: "galleta",
    source: "estimated",
    addedDate: "2026-05-16"
  },
  {
    id: "mcdonalds-double-chicken-small",
    name: "Double Chicken Small (Sandwich)",
    brand: "McDonald's",
    per100g: { kcal: 270, prot: 14.0, carbs: 22.0, fat: 14.0, fiber: 1.5, sodium: 560, sugar: 4.0, sat_fat: 4.5 },
    unitWeight: 175,
    unitLabel: "burger",
    source: "web",
    addedDate: "2026-05-16"
  },
  {
    id: "magret-canard-sin-piel",
    name: "Magret de Canard (sin piel ni grasa)",
    brand: "Restaurant",
    per100g: { kcal: 195, prot: 28.0, carbs: 0, fat: 9.0, fiber: 0, sodium: 75, sugar: 0, sat_fat: 2.5 },
    source: "usda",
    addedDate: "2026-05-16"
  },
  {
    id: "ecrase-pomme-de-terre",
    name: "Écrasé de Pomme de Terre (mantequilla)",
    brand: "Restaurant",
    per100g: { kcal: 155, prot: 2.5, carbs: 18.0, fat: 8.0, fiber: 1.8, sodium: 280, sugar: 1.0, sat_fat: 5.0 },
    source: "estimated",
    addedDate: "2026-05-16"
  },
  {
    id: "ensalada-chevre-noix",
    name: "Salade de Chèvre Chaud (sin pan, con vinagreta)",
    brand: "Restaurant",
    per100g: { kcal: 220, prot: 9.0, carbs: 8.0, fat: 17.0, fiber: 1.5, sodium: 380, sugar: 3.0, sat_fat: 9.0 },
    source: "estimated",
    addedDate: "2026-05-16"
  },
  {
    id: "vino-rosado",
    name: "Vino Rosado",
    brand: "Generic",
    per100g: { kcal: 83, prot: 0.1, carbs: 2.5, fat: 0, fiber: 0, sodium: 4, sugar: 0.7, sat_fat: 0 },
    unitWeight: 125,
    unitLabel: "copa",
    source: "usda",
    addedDate: "2026-05-16"
  },
  {
    id: "tiramisu-classico",
    name: "Tiramisu Clásico Italiano",
    brand: "Restaurant",
    per100g: { kcal: 290, prot: 5.0, carbs: 28.0, fat: 18.0, fiber: 0.5, sodium: 120, sugar: 22.0, sat_fat: 11.0 },
    source: "usda",
    addedDate: "2026-05-16"
  },
  {
    id: "crepe-caramel-beurre-sale-simple",
    name: "Crêpe Caramel Beurre Salé (sin toppings)",
    brand: "Boulangerie",
    per100g: { kcal: 240, prot: 5.0, carbs: 35.0, fat: 9.0, fiber: 1.0, sodium: 250, sugar: 18.0, sat_fat: 5.0 },
    unitWeight: 180,
    unitLabel: "crepa",
    source: "estimated",
    addedDate: "2026-05-16"
  },
  {
    id: "jambon-porc-roti-tranches",
    name: "Jambon de Porc Rôti (tranches)",
    brand: "Charcuterie",
    per100g: { kcal: 130, prot: 22.0, carbs: 1.0, fat: 4.5, fiber: 0, sodium: 1100, sugar: 0.5, sat_fat: 1.5 },
    unitWeight: 25,
    unitLabel: "rodaja",
    source: "usda",
    addedDate: "2026-05-16"
  },
  {
    id: "cafe-negro",
    name: "Café Negro (espresso/allongé)",
    brand: "Generic",
    per100g: { kcal: 2, prot: 0.3, carbs: 0, fat: 0, fiber: 0, sodium: 5, sugar: 0, sat_fat: 0 },
    unitWeight: 50,
    unitLabel: "taza",
    source: "usda",
    addedDate: "2026-05-16"
  },
  {
    id: "kfc-mini-chicken-burger",
    name: "Mini Chicken Burger KFC",
    brand: "KFC",
    per100g: { kcal: 270, prot: 13.0, carbs: 24.0, fat: 14.0, fiber: 1.5, sodium: 520, sugar: 4.0, sat_fat: 4.5 },
    unitWeight: 135,
    unitLabel: "burger",
    source: "web",
    addedDate: "2026-05-16"
  },
  {
    id: "kfc-papas-pequena",
    name: "Papas Fritas KFC (pequeña)",
    brand: "KFC",
    per100g: { kcal: 290, prot: 3.5, carbs: 38.0, fat: 14.0, fiber: 3.5, sodium: 320, sugar: 0.5, sat_fat: 1.5 },
    unitWeight: 75,
    unitLabel: "porción pequeña",
    source: "web",
    addedDate: "2026-05-16"
  },
  {
    id: "helado-vainilla-fast-food",
    name: "Helado/Sorbete Vainilla (fast-food)",
    brand: "Generic",
    per100g: { kcal: 200, prot: 3.5, carbs: 26.0, fat: 9.0, fiber: 0, sodium: 80, sugar: 22.0, sat_fat: 5.5 },
    unitWeight: 60,
    unitLabel: "porción",
    source: "estimated",
    addedDate: "2026-05-16"
  },
  {
    id: "bacon-tocino-cocido",
    name: "Bacon / Tocino Cocido",
    brand: "Generic",
    per100g: { kcal: 540, prot: 37.0, carbs: 1.5, fat: 42.0, fiber: 0, sodium: 1700, sugar: 0, sat_fat: 14.0 },
    source: "usda",
    addedDate: "2026-05-16"
  },
  {
    id: "chipolata-saucisse",
    name: "Chipolata (saucisse petite)",
    brand: "Generic",
    per100g: { kcal: 295, prot: 13.0, carbs: 1.0, fat: 27.0, fiber: 0, sodium: 900, sugar: 0.5, sat_fat: 10.0 },
    unitWeight: 35,
    unitLabel: "salchicha",
    source: "usda",
    addedDate: "2026-05-16"
  },
  {
    id: "nutella",
    name: "Nutella (pâte à tartiner)",
    brand: "Ferrero",
    per100g: { kcal: 539, prot: 6.3, carbs: 57.5, fat: 30.9, fiber: 4.0, sodium: 50, sugar: 56.3, sat_fat: 10.6 },
    source: "official",
    addedDate: "2026-05-16"
  },
  {
    id: "crepe-classique-nature",
    name: "Crêpe Nature (sin relleno)",
    brand: "Boulangerie",
    per100g: { kcal: 198, prot: 6.0, carbs: 25.0, fat: 8.0, fiber: 1.0, sodium: 150, sugar: 5.0, sat_fat: 3.0 },
    unitWeight: 60,
    unitLabel: "crepa",
    source: "usda",
    addedDate: "2026-05-16"
  },
  {
    id: "pan-pumpernickel-aleman",
    name: "Pan Pumpernickel / Pan Negro Alemán",
    brand: "Generic",
    per100g: { kcal: 250, prot: 8.5, carbs: 47.0, fat: 3.0, fiber: 6.0, sodium: 600, sugar: 1.5, sat_fat: 0.5 },
    unitWeight: 30,
    unitLabel: "rebanada",
    source: "usda",
    addedDate: "2026-05-16"
  },
  {
    id: "panna-cotta-fresas",
    name: "Panna Cotta Casera con Fresas",
    brand: "Casera",
    per100g: { kcal: 260, prot: 4.0, carbs: 18.0, fat: 19.0, fiber: 0.5, sodium: 50, sugar: 16.0, sat_fat: 12.0 },
    source: "estimated",
    addedDate: "2026-05-16"
  },
  {
    id: "pollo-esparragos-tomates-cherry",
    name: "Pollo con Espárragos y Tomates Cherry (restaurant)",
    brand: "Restaurant",
    per100g: { kcal: 140, prot: 17.0, carbs: 5.0, fat: 6.0, fiber: 2.0, sodium: 380, sugar: 3.0, sat_fat: 1.5 },
    source: "estimated",
    addedDate: "2026-05-16"
  },
  {
    id: "religieuse-framboise-chantilly",
    name: "Postre Religieuse Framboise Chantilly (choux frambuesa)",
    brand: "Patisserie",
    per100g: { kcal: 310, prot: 5.0, carbs: 32.0, fat: 18.0, fiber: 1.5, sodium: 120, sugar: 20.0, sat_fat: 10.0 },
    unitWeight: 110,
    unitLabel: "porción",
    source: "estimated",
    addedDate: "2026-05-16"
  },
  {
    id: "croissant-mini-hotel",
    name: "Croissant Mini (hotel)",
    brand: "Hotel",
    per100g: { kcal: 460, prot: 8.5, carbs: 45.0, fat: 26.0, fiber: 2.0, sodium: 480, sugar: 9.0, sat_fat: 16.0 },
    unitWeight: 30,
    unitLabel: "mini croissant",
    source: "usda",
    addedDate: "2026-05-16"
  },
  {
    id: "pain-au-chocolat-mini-hotel",
    name: "Pain au Chocolat Mini (hotel)",
    brand: "Hotel",
    per100g: { kcal: 420, prot: 7.5, carbs: 48.0, fat: 22.0, fiber: 2.5, sodium: 380, sugar: 12.0, sat_fat: 13.0 },
    unitWeight: 35,
    unitLabel: "mini pain au chocolat",
    source: "usda",
    addedDate: "2026-05-16"
  },
  {
    id: "yogurt-nature-chia",
    name: "Yogurt Nature con Semillas de Chia",
    brand: "Hotel",
    per100g: { kcal: 75, prot: 4.5, carbs: 6.0, fat: 3.5, fiber: 1.5, sodium: 50, sugar: 4.5, sat_fat: 1.5 },
    source: "estimated",
    addedDate: "2026-05-16"
  },
  {
    id: "old-amsterdam-queso",
    name: "Old Amsterdam (Gouda Vieja)",
    brand: "Westland",
    per100g: { kcal: 400, prot: 28.0, carbs: 0, fat: 32.0, fiber: 0, sodium: 1100, sugar: 0, sat_fat: 21.0 },
    source: "official",
    addedDate: "2026-05-16"
  },
  {
    id: "bolkiri-salade-thai-epicee-doble-carne",
    name: "Salade Thaï Épicée Bolkiri (doble carne)",
    brand: "Bolkiri",
    per100g: { kcal: 159, prot: 14.1, carbs: 4.7, fat: 9.1, fiber: 2.5, sodium: 520, sugar: 2.0, sat_fat: 2.5 },
    source: "estimated",
    addedDate: "2026-05-16"
  },
  {
    id: "arroz-con-vegetales-salteado",
    name: "Arroz con Vegetales Salteado",
    brand: "Casero",
    per100g: { kcal: 150, prot: 3.0, carbs: 28.0, fat: 3.0, fiber: 1.8, sodium: 280, sugar: 2.0, sat_fat: 0.5 },
    source: "estimated",
    addedDate: "2026-05-16"
  },
  {
    id: "queso-roquefort",
    name: "Queso Roquefort (azul)",
    brand: "Generic",
    per100g: { kcal: 369, prot: 21.5, carbs: 2.0, fat: 31.0, fiber: 0, sodium: 1800, sugar: 0.5, sat_fat: 19.0 },
    source: "usda",
    addedDate: "2026-05-16"
  },
  {
    id: "vino-tinto-merlot",
    name: "Vino Tinto Merlot",
    brand: "Generic",
    per100g: { kcal: 85, prot: 0.1, carbs: 2.6, fat: 0, fiber: 0, sodium: 4, sugar: 0.6, sat_fat: 0 },
    unitWeight: 125,
    unitLabel: "copa",
    source: "usda",
    addedDate: "2026-05-16"
  },
  {
    id: "salmon-ahumado",
    name: "Salmón Ahumado",
    brand: "Generic",
    per100g: { kcal: 117, prot: 18.3, carbs: 0, fat: 4.3, fiber: 0, sodium: 1880, sugar: 0, sat_fat: 0.9 },
    source: "usda",
    addedDate: "2026-05-16"
  },
  {
    id: "ikea-hotdog-vegetarian-single",
    name: "Hot Dog Vegetariano IKEA (single)",
    brand: "IKEA",
    per100g: { kcal: 245, prot: 9.0, carbs: 25.0, fat: 11.0, fiber: 3.5, sodium: 720, sugar: 4.0, sat_fat: 2.0 },
    unitWeight: 100,
    unitLabel: "hotdog",
    source: "official",
    addedDate: "2026-05-16"
  },
  {
    id: "ikea-hotdog-vegetarian-double",
    name: "Hot Dog Vegetariano IKEA (doble)",
    brand: "IKEA",
    per100g: { kcal: 250, prot: 10.0, carbs: 24.0, fat: 12.0, fiber: 3.5, sodium: 750, sugar: 4.0, sat_fat: 2.2 },
    unitWeight: 150,
    unitLabel: "hotdog doble",
    source: "official",
    addedDate: "2026-05-16"
  },
  {
    id: "ikea-bebida-roja-frambuesa",
    name: "Bebida IKEA Roja (Frambuesa/Lingonberry)",
    brand: "IKEA",
    per100g: { kcal: 38, prot: 0, carbs: 9.0, fat: 0, fiber: 0, sodium: 8, sugar: 8.5, sat_fat: 0 },
    unitWeight: 300,
    unitLabel: "vaso",
    source: "official",
    addedDate: "2026-05-16"
  },
  {
    id: "aderezo-yogur-griego-mostaza-miel-eneldo",
    name: "Aderezo Yogur Griego, Mostaza, Miel, Eneldo, AOVE",
    brand: "Casero",
    per100g: { kcal: 165, prot: 4.0, carbs: 8.0, fat: 13.0, fiber: 0.5, sodium: 320, sugar: 6.0, sat_fat: 2.5 },
    source: "estimated",
    addedDate: "2026-05-16"
  },
  {
    id: "mostaza-de-dijon",
    name: "Mostaza de Dijon",
    brand: "Generic",
    per100g: { kcal: 70, prot: 4.0, carbs: 4.5, fat: 4.0, fiber: 3.0, sodium: 2400, sugar: 0.5, sat_fat: 0.3 },
    source: "usda",
    addedDate: "2026-05-16"
  },
  {
    id: "aderezo-industrial-ensalada-super",
    name: "Aderezo Industrial Ensalada Súper (bolsita)",
    brand: "Generic",
    per100g: { kcal: 380, prot: 1.5, carbs: 10.0, fat: 36.0, fiber: 0.5, sodium: 1200, sugar: 6.0, sat_fat: 5.0 },
    unitWeight: 30,
    unitLabel: "bolsita",
    source: "estimated",
    addedDate: "2026-05-16"
  },
];

// Meal log - read-only fallback. GitHub (local-meals.json) is source of truth.
const MEAL_LOG = [
  {
    id: "2026-03-29-001",
    date: "2026-03-29",
    meal: "almuerzo", user: "ernesto",
    items: [
      { foodId: "menu-dia-29", name: "Menu dia 29", grams: 0, kcal: 1688, prot: 71, carbs: 212, fat: 64 }
    ],
    timestamp: "2026-03-29T13:00:00"
  },
  {
    id: "2026-03-30-001",
    date: "2026-03-30",
    meal: "almuerzo", user: "ernesto",
    items: [
      { foodId: "menu-dia-30", name: "Menu dia 30", grams: 0, kcal: 1398, prot: 127, carbs: 112, fat: 49 }
    ],
    timestamp: "2026-03-30T13:00:00"
  },
  {
    id: "2026-03-31-001",
    date: "2026-03-31",
    meal: "almuerzo", user: "ernesto",
    items: [
      { foodId: "menu-dia-31", name: "Menu dia 31", grams: 0, kcal: 1190, prot: 135, carbs: 74, fat: 44 }
    ],
    timestamp: "2026-03-31T13:00:00"
  },
  {
    id: "2026-04-01-L1775065384650",
    date: "2026-04-01",
    meal: "cena", user: "ernesto",
    items: [
      { foodId: "omelette-ligera-jamon", name: "Omelette Ligera con Jamon", grams: 110, kcal: 126.2, prot: 14.6, carbs: 1.4, fat: 6.6 }
    ],
    timestamp: "2026-04-01T17:43:04.650Z"
  },
  {
    id: "2026-04-01-L1775065395117",
    date: "2026-04-01",
    meal: "cena", user: "ernesto",
    items: [
      { foodId: "danone-cottage-cheese", name: "Cottage Cheese Nature", grams: 50, kcal: 45, prot: 6, carbs: 0.8, fat: 2 }
    ],
    timestamp: "2026-04-01T17:43:15.117Z"
  },
  {
    id: "2026-04-01-004",
    date: "2026-04-01",
    meal: "snack", user: "ernesto",
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
    meal: "desayuno", user: "ernesto",
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
    meal: "snack", user: "ernesto",
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
    meal: "snack", user: "ernesto",
    items: [
      { foodId: "wasa-leger", name: "Tartine Croustillante Leger", grams: 9.6, kcal: 32.4, prot: 0.9, carbs: 6, fat: 0.1 }
    ],
    timestamp: "2026-04-01T22:04:47.154Z"
  },
  {
    id: "2026-04-01-006",
    date: "2026-04-01",
    meal: "cena", user: "ernesto",
    items: [
      { foodId: "eafit-pure-isolate-vanille", name: "Proteina EAFit Vanille", grams: 40, kcal: 146.4, prot: 34.4, carbs: 1.3, fat: 0.4 },
      { foodId: "alpro-noisette-gourmande", name: "Leche Alpro Noisette", grams: 50, kcal: 14.5, prot: 0.2, carbs: 1.6, fat: 0.8 }
    ],
    timestamp: "2026-04-01T22:30:00"
  },
  {
    id: "2026-04-01-003",
    date: "2026-04-01",
    meal: "almuerzo", user: "ernesto",
    items: [
      { foodId: "fleury-michon-tendre-poulet-roti", name: "Tendre Poulet Roti Fleury Michon", grams: 16.25, kcal: 17.6, prot: 3.3, carbs: 0.1, fat: 0.5 },
      { foodId: "lentejas-carne-vegetales", name: "Lentejas con Carne y Vegetales", grams: 416, kcal: 416.4, prot: 31.6, carbs: 50.3, fat: 10.8 }
    ],
    timestamp: "2026-04-01T23:30:00"
  },
  {
    id: "2026-04-02-L1775132385557",
    date: "2026-04-02",
    meal: "almuerzo", user: "ernesto",
    items: [
      { foodId: "lentejas-carne-vegetales", name: "Lentejas con Carne y Vegetales", grams: 558, kcal: 558.6, prot: 42.4, carbs: 67.5, fat: 14.5 }
    ],
    timestamp: "2026-04-02T12:19:45.557Z"
  },
  {
    id: "2026-04-02-L1775132480724",
    date: "2026-04-02",
    meal: "desayuno", user: "ernesto",
    items: [
      { foodId: "bowl-de-skir-con-fresas-avellanas-y-miel", name: "Bowl de skir con fresas, avellanas y miel", grams: 109, kcal: 86.4, prot: 6.6, carbs: 10.9, fat: 2.4 },
      { foodId: "frittata-ranchera", name: "Frittata Ranchera", grams: 296, kcal: 309.9, prot: 24.9, carbs: 8.6, fat: 19.5 }
    ],
    timestamp: "2026-04-02T12:21:20.724Z"
  },
  {
    id: "2026-04-02-L1775145572391",
    date: "2026-04-02",
    meal: "snack", user: "ernesto",
    items: [
      { foodId: "eafit-pure-isolate-vanille", name: "Pure Isolate Whey Vanille", grams: 40, kcal: 146.4, prot: 34.4, carbs: 1.3, fat: 0.4 }
    ],
    timestamp: "2026-04-02T15:59:32.391Z"
  },
  {
    id: "2026-04-02-003",
    date: "2026-04-02",
    meal: "cena", user: "ernesto",
    items: [
      { foodId: "omelette-cottage-salmon", name: "Omelette Cottage Salmon (1/2 receta)", grams: 248, kcal: 245.5, prot: 25.5, carbs: 6, fat: 13.1 }
    ],
    timestamp: "2026-04-02T21:30:00"
  },
  {
    id: "2026-04-02-L1775165521901",
    date: "2026-04-02",
    meal: "cena", user: "ernesto",
    items: [
      { foodId: "lentejas-carne-vegetales", name: "Lentejas con Carne y Vegetales", grams: 250, kcal: 250.3, prot: 19, carbs: 30.3, fat: 6.5 }
    ],
    timestamp: "2026-04-02T21:32:01.901Z"
  },
  {
    id: "2026-04-02-L1775165597455",
    date: "2026-04-02",
    meal: "snack", user: "ernesto",
    items: [
      { foodId: "eafit-pure-isolate-vanille", name: "Pure Isolate Whey Vanille", grams: 10, kcal: 36.6, prot: 8.6, carbs: 0.3, fat: 0.1 }
    ],
    timestamp: "2026-04-02T21:33:17.455Z"
  },
  {
    id: "2026-04-02-L1775166171502",
    date: "2026-04-02",
    meal: "snack", user: "ernesto",
    items: [
      { foodId: "hipro-vanille", name: "HiPro Vanille", grams: 80, kcal: 61.6, prot: 8.2, carbs: 4.7, fat: 0.6 }
    ],
    timestamp: "2026-04-02T21:42:51.502Z"
  },
  {
    id: "2026-04-03-001",
    date: "2026-04-03",
    meal: "desayuno", user: "ernesto",
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
    meal: "almuerzo", user: "ernesto",
    items: [
      { foodId: "lentejas-carne-vegetales", name: "Lentejas con Carne y Vegetales", grams: 480, kcal: 480.5, prot: 36.5, carbs: 58.1, fat: 12.5 }
    ],
    timestamp: "2026-04-03T13:15:38.905Z"
  },
  {
    id: "2026-04-03-L1775222149706",
    date: "2026-04-03",
    meal: "almuerzo", user: "ernesto",
    items: [
      { foodId: "melon-fresco", name: "Melon Fresco", grams: 30, kcal: 10.2, prot: 0.2, carbs: 2.5, fat: 0.1 }
    ],
    timestamp: "2026-04-03T13:15:49.706Z"
  },
  {
    id: "2026-04-03-002",
    date: "2026-04-03",
    meal: "snack", user: "ernesto",
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
    meal: "cena", user: "ernesto",
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
    meal: "snack", user: "ernesto",
    items: [
      { foodId: "oreo-protein-shake", name: "Oreo Protein Shake", grams: 250, kcal: 231.5, prot: 14.8, carbs: 26.5, fat: 8 }
    ],
    timestamp: "2026-04-03T22:00:00"
  },
  {
    id: "2026-04-04-001",
    date: "2026-04-04",
    meal: "desayuno", user: "ernesto",
    items: [
      { foodId: "oreo-protein-shake", name: "Oreo Protein Shake", grams: 100, kcal: 92.6, prot: 5.9, carbs: 10.6, fat: 3.2 },
      { foodId: "eafit-pure-isolate-vanille", name: "Proteina EAFit Vanille", grams: 40, kcal: 146.4, prot: 34.4, carbs: 1.3, fat: 0.4 }
    ],
    timestamp: "2026-04-04T09:00:00"
  },
  {
    id: "2026-04-04-002",
    date: "2026-04-04",
    meal: "almuerzo", user: "ernesto",
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
    meal: "almuerzo", user: "ernesto",
    items: [
      { foodId: "cheesecake-oreo-beurre", name: "Cheesecake Oreo & Beurre (1/8)", grams: 194, kcal: 684.6, prot: 11.3, carbs: 54.7, fat: 47.3 },
      { foodId: "coulis-fraises-maison", name: "Coulis de Fresas", grams: 30, kcal: 33, prot: 0.2, carbs: 8.3, fat: 0.1 }
    ],
    timestamp: "2026-04-04T14:00:00"
  },
  {
    id: "2026-04-04-004",
    date: "2026-04-04",
    meal: "snack", user: "ernesto",
    items: [
      { foodId: "hipro-vanille", name: "HiPro Vanille (1/2)", grams: 80, kcal: 61.6, prot: 8.2, carbs: 4.7, fat: 0.6 }
    ],
    timestamp: "2026-04-04T17:00:00"
  },
  {
    id: "2026-04-04-005",
    date: "2026-04-04",
    meal: "cena", user: "ernesto",
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
    meal: "cena", user: "ernesto",
    items: [
      { foodId: "lentejas-carne-vegetales", name: "Lentejas con Carne y Vegetales", grams: 300, kcal: 300.3, prot: 22.8, carbs: 36.3, fat: 7.8 }
    ],
    timestamp: "2026-04-05T08:55:36.634Z"
  },
  {
    id: "2026-04-05-001",
    date: "2026-04-05",
    meal: "desayuno", user: "ernesto",
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
    meal: "almuerzo", user: "ernesto",
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
    meal: "snack", user: "ernesto",
    items: [
      { foodId: "creme-halva-chocolate-cookie", name: "Creme London Halva Cookie (1/2)", grams: 46, kcal: 220.8, prot: 3.2, carbs: 23.9, fat: 11.5 }
    ],
    timestamp: "2026-04-05T16:00:00"
  },
  {
    id: "2026-04-05-004",
    date: "2026-04-05",
    meal: "cena", user: "ernesto",
    items: [
      { foodId: "arroz-bomba-cocido", name: "Arroz Bomba Cocido", grams: 95, kcal: 123.5, prot: 2.6, carbs: 26.6, fat: 0.3 },
      { foodId: "pescado-salsa-limon-alcaparras", name: "Pescado Salsa Limon y Alcaparras", grams: 205, kcal: 210.7, prot: 30.9, carbs: 2.5, fat: 7.8 }
    ],
    timestamp: "2026-04-05T21:00:00"
  },
  {
    id: "2026-04-05-L1775431527857",
    date: "2026-04-05",
    meal: "cena", user: "ernesto",
    items: [
      { foodId: "coca-cola-zero", name: "Coca-Cola Zero", grams: 200, kcal: 0.8, prot: 0, carbs: 0, fat: 0 }
    ],
    timestamp: "2026-04-05T23:25:27.857Z"
  },
  {
    id: "2026-04-05-L1775431583057",
    date: "2026-04-05",
    meal: "snack", user: "ernesto",
    items: [
      { foodId: "eafit-pure-isolate-vanille", name: "Pure Isolate Whey Vanille", grams: 20, kcal: 73.2, prot: 17.2, carbs: 0.7, fat: 0.2 }
    ],
    timestamp: "2026-04-05T23:26:23.057Z"
  },
  {
    id: "2026-04-05-L1775433329439",
    date: "2026-04-05",
    meal: "snack", user: "ernesto",
    items: [
      { foodId: "jeff-de-bruges-oeuf-paques", name: "Petit Oeuf de Pâques Fourré", grams: 10, kcal: 53.8, prot: 0.7, carbs: 5.2, fat: 3.3 }
    ],
    timestamp: "2026-04-05T23:55:29.439Z"
  },
  {
    id: "2026-04-06-001",
    date: "2026-04-06",
    meal: "desayuno", user: "ernesto",
    items: [
      { foodId: "protein-packed-banana-pb", name: "Protein Packed Banana Peanut Butter (60%)", grams: 209, kcal: 208.4, prot: 26.2, carbs: 18.6, fat: 3.5 },
      { foodId: "mantequilla-de-mani", name: "Mantequilla de mani", grams: 15, kcal: 88.2, prot: 3.8, carbs: 3, fat: 7.5 }
    ],
    timestamp: "2026-04-06T09:00:00"
  },
  {
    id: "2026-04-06-A01",
    date: "2026-04-06",
    meal: "desayuno", user: "adriana",
    items: [
      { foodId: "pancakes-de-proteina-adri-v2", name: "Pancakes de Proteina Adri V2", grams: 1, kcal: 547, prot: 64.2, carbs: 27.7, fat: 21.2 }
    ],
    timestamp: "2026-04-06T09:00:00"
  },
  {
    id: "2026-04-06-002",
    date: "2026-04-06",
    meal: "almuerzo", user: "ernesto",
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
    meal: "almuerzo", user: "adriana",
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
    meal: "almuerzo", user: "adriana",
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
    meal: "snack", user: "adriana",
    items: [
      { foodId: "jeff-de-bruges-oeuf-paques", name: "Huevito Jeff de Bruges x1", grams: 13, kcal: 69.9, prot: 0.9, carbs: 6.8, fat: 4.3 }
    ],
    timestamp: "2026-04-06T16:00:00"
  },
  {
    id: "2026-04-06-A-snack",
    date: "2026-04-06",
    meal: "snack", user: "adriana",
    items: [
      { foodId: "jeff-de-bruges-oeuf-paques", name: "Huevito Jeff de Bruges x1", grams: 13, kcal: 69.9, prot: 0.9, carbs: 6.8, fat: 4.3 }
    ],
    timestamp: "2026-04-06T16:00:00.000Z"
  },
  {
    id: "2026-04-06-003",
    date: "2026-04-06",
    meal: "snack", user: "ernesto",
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
    meal: "cena", user: "adriana",
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
    meal: "cena", user: "adriana",
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
    meal: "cena", user: "ernesto",
    items: [
      { foodId: "pizza-regine-pizzou", name: "Pizza Régine Pizzou", grams: 330, kcal: 512, prot: 34.3, carbs: 63.4, fat: 15.2 },
      { foodId: "coca-cola-zero", name: "Coca-Cola Zero", grams: 200, kcal: 0.8, prot: 0, carbs: 0, fat: 0 }
    ],
    timestamp: "2026-04-06T21:00:00"
  },
  {
    id: "2026-04-06-L1775512880333",
    date: "2026-04-06",
    meal: "desayuno", user: "adriana",
    items: [
      { foodId: "pancakes-de-proteina-adri-v2", name: "Pancakes de Proteina Adri V2", grams: 1, kcal: 547, prot: 64.2, carbs: 27.7, fat: 21.2 }
    ],
    timestamp: "2026-04-06T22:01:20.333Z"
  },
  {
    id: "2026-04-06-L1775514376856",
    date: "2026-04-06",
    meal: "cena", user: "ernesto",
    items: [
      { foodId: "aceite-oliva", name: "Aceite de Oliva", grams: 3, kcal: 26.5, prot: 0, carbs: 0, fat: 3 }
    ],
    timestamp: "2026-04-06T22:26:16.856Z"
  },
  {
    id: "2026-04-06-005",
    date: "2026-04-06",
    meal: "snack", user: "ernesto",
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
    meal: "desayuno", user: "adriana",
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
    meal: "desayuno", user: "ernesto",
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
    meal: "snack", user: "adriana",
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
    meal: "snack", user: "ernesto",
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
    meal: "almuerzo", user: "adriana",
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
    meal: "almuerzo", user: "ernesto",
    items: [
      { foodId: "rigatoni-cocida", name: "Rigatoni Cocida", grams: 200, kcal: 314, prot: 11, carbs: 62, fat: 1.8 },
      { foodId: "beef-green-beans-meat-bowl", name: "Carne y Ejote con Cebolla", grams: 128, kcal: 186.8, prot: 16.1, carbs: 6.4, fat: 10.9 }
    ],
    timestamp: "2026-04-07T13:30:00"
  },
  {
    id: "2026-04-07-005",
    date: "2026-04-07",
    meal: "snack", user: "ernesto",
    items: [
      { foodId: "wasa-leger", name: "Wasa Léger (1 tartine)", grams: 9.6, kcal: 32.4, prot: 0.9, carbs: 6, fat: 0.1 },
      { foodId: "ricotta-casa-azzurra", name: "Ricotta", grams: 35, kcal: 60.9, prot: 3.9, carbs: 1.1, fat: 4.6 }
    ],
    timestamp: "2026-04-07T16:00:00"
  },
  {
    id: "2026-04-07-A04",
    date: "2026-04-07",
    meal: "cena", user: "adriana",
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
    meal: "cena", user: "ernesto",
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
    meal: "desayuno", user: "ernesto",
    items: [
      { foodId: "cafe-negro", name: "Café Negro (sin azucar)", grams: 120, kcal: 2.4, prot: 0.1, carbs: 0, fat: 0 },
      { foodId: "hipro-banane", name: "HiPro Banane", grams: 160, kcal: 112, prot: 19.8, carbs: 6.4, fat: 0.6 }
    ],
    timestamp: "2026-04-08T06:21:06.710Z"
  },
  {
    id: "2026-04-08-L1775655446964",
    date: "2026-04-08",
    meal: "desayuno", user: "ernesto",
    items: [
      { foodId: "pancakes-de-proteina-adri-v2", name: "Pancakes de Proteina Adri V2", grams: 30, kcal: 46.9, prot: 5.5, carbs: 2.4, fat: 1.8 }
    ],
    timestamp: "2026-04-08T11:17:26.964Z"
  },
  {
    id: "2026-04-08-L1775655454297",
    date: "2026-04-08",
    meal: "desayuno", user: "ernesto",
    items: [
      { foodId: "ricotta-casa-azzurra", name: "Ricotta Casa Azzurra", grams: 50, kcal: 87, prot: 5.5, carbs: 1.5, fat: 6.5 }
    ],
    timestamp: "2026-04-08T11:17:34.297Z"
  },
  {
    id: "2026-04-08-L1775655726869",
    date: "2026-04-08",
    meal: "snack", user: "ernesto",
    items: [
      { foodId: "eafit-pure-isolate-vanille", name: "Pure Isolate Whey Vanille", grams: 40, kcal: 146.4, prot: 34.4, carbs: 1.3, fat: 0.4 }
    ],
    timestamp: "2026-04-08T11:22:06.869Z"
  },
  {
    id: "2026-04-08-L1775663325750",
    date: "2026-04-08",
    meal: "snack", user: "ernesto",
    items: [
      { foodId: "queso-maduro-espanol", name: "Queso Maduro Español", grams: 15, kcal: 60, prot: 3.8, carbs: 0.1, fat: 5.0 }
    ],
    timestamp: "2026-04-08T15:48:45.000Z"
  },
  {
    id: "2026-04-08-002",
    date: "2026-04-08",
    meal: "snack", user: "ernesto",
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
    meal: "almuerzo", user: "ernesto",
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
    meal: "desayuno", user: "adriana",
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
    meal: "almuerzo", user: "adriana",
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
    meal: "snack", user: "adriana",
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
    meal: "cena", user: "adriana",
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
    meal: "cena", user: "ernesto",
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
    meal: "snack", user: "ernesto",
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
    meal: "desayuno", user: "ernesto",
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
    meal: "snack", user: "ernesto",
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
    meal: "almuerzo", user: "ernesto",
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
    meal: "snack", user: "ernesto",
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
    meal: "cena", user: "ernesto",
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
    meal: "snack", user: "ernesto",
    items: [
      { foodId: "eafit-pure-isolate-vanille", name: "EAFit Vanille", grams: 20, kcal: 73.2, prot: 17.2, carbs: 0.7, fat: 0.2 }
    ],
    timestamp: "2026-04-09T22:30:00"
  },
  {
    id: "2026-04-09-007",
    date: "2026-04-09",
    meal: "snack", user: "ernesto",
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
    meal: "desayuno", user: "adriana",
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
    meal: "snack", user: "adriana",
    items: [
      { foodId: "sojasun-nature", name: "Sojasun Nature (1 pot)", grams: 100, units: 1, kcal: 41.0, prot: 4.6, carbs: 0, fat: 2.4 },
      { foodId: "blueberries-frescas", name: "Blueberries", grams: 50, kcal: 28.5, prot: 0.4, carbs: 7.3, fat: 0.2 }
    ],
    timestamp: "2026-04-09T10:30:00"
  },
  {
    id: "2026-04-09-A03",
    date: "2026-04-09",
    meal: "almuerzo", user: "adriana",
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
    meal: "snack", user: "adriana",
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
    meal: "cena", user: "adriana",
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
    meal: "desayuno", user: "ernesto",
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
    meal: "almuerzo", user: "ernesto",
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
    meal: "snack", user: "ernesto",
    items: [
      { foodId: "fresas-frescas", name: "Fresas (x2)", grams: 24, units: 2, kcal: 7.7, prot: 0.2, carbs: 1.8, fat: 0.1 }
    ],
    timestamp: "2026-04-10T16:00:00"
  },
  {
    id: "2026-04-10-004",
    date: "2026-04-10",
    meal: "cena", user: "ernesto",
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
    meal: "desayuno", user: "adriana",
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
    meal: "snack", user: "adriana",
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
    meal: "snack", user: "adriana",
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
    meal: "almuerzo", user: "adriana",
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
    meal: "cena", user: "adriana",
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
    meal: "desayuno", user: "ernesto",
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
    meal: "almuerzo", user: "ernesto",
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
    meal: "snack", user: "ernesto",
    items: [
      { foodId: "spanakopita-light", name: "Spanakopita Light", grams: 125, kcal: 224.9, prot: 13.5, carbs: 8.3, fat: 15.1 },
      { foodId: "kebab-veau-maison", name: "Kebab Veau Maison", grams: 150, kcal: 270.0, prot: 37.5, carbs: 1.5, fat: 12.8 }
    ],
    timestamp: "2026-04-11T16:00:00"
  },
  {
    id: "2026-04-11-004",
    date: "2026-04-11",
    meal: "cena", user: "ernesto",
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
    meal: "desayuno", user: "adriana",
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
    meal: "almuerzo", user: "adriana",
    items: [
      { foodId: "saumon-benny-kozy", name: "Saumon Benny (Kozy Paris)", grams: 340, kcal: 545.0, prot: 28.0, carbs: 41.5, fat: 29.0 }
    ],
    timestamp: "2026-04-11T12:00:00"
  },
  {
    id: "2026-04-11-A03",
    date: "2026-04-11",
    meal: "snack", user: "adriana",
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
    meal: "cena", user: "adriana",
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
    meal: "snack", user: "ernesto",
    items: [
      { foodId: "eafit-pure-isolate-chocolat", name: "EAFit Chocolat", grams: 20, kcal: 70.8, prot: 16.2, carbs: 0.7, fat: 0.3 }
    ],
    timestamp: "2026-04-12T01:00:00"
  },
  {
    id: "2026-04-12-002",
    date: "2026-04-12",
    meal: "desayuno", user: "ernesto",
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
    meal: "snack", user: "ernesto",
    items: [
      { foodId: "shake-strawberry-blueberry-protein", name: "Strawberry Blueberry Protein Shake", grams: 120, kcal: 92.9, prot: 13.0, carbs: 7.3, fat: 1.6 }
    ],
    timestamp: "2026-04-12T11:00:00"
  },
  {
    id: "2026-04-12-004",
    date: "2026-04-12",
    meal: "almuerzo", user: "ernesto",
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
    meal: "snack", user: "ernesto",
    items: [
      { foodId: "holy-cookie-pistachio", name: "Holy Cookie Pistachio (1/2)", grams: 90, kcal: 443.7, prot: 10.2, carbs: 31.9, fat: 29.7 }
    ],
    timestamp: "2026-04-12T16:00:00"
  },
  {
    id: "2026-04-12-006",
    date: "2026-04-12",
    meal: "cena", user: "ernesto",
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
    meal: "cena", user: "ernesto",
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
    meal: "desayuno", user: "adriana",
    items: [
      { foodId: "pancake-avena-chocolate-hp", name: "Pancake Avena Choc HP", grams: 83, kcal: 96.1, prot: 11.0, carbs: 12.4, fat: 1.6 },
      { foodId: "mantequilla-de-mani-menguys", name: "Peanut Butter", grams: 5, kcal: 29.4, prot: 1.3, carbs: 1.0, fat: 2.5 }
    ],
    timestamp: "2026-04-12T09:00:00"
  },
  {
    id: "2026-04-12-A02",
    date: "2026-04-12",
    meal: "snack", user: "adriana",
    items: [
      { foodId: "shake-strawberry-blueberry-protein", name: "Strawberry Blueberry Protein Shake", grams: 120, kcal: 92.9, prot: 13.0, carbs: 7.3, fat: 1.6 }
    ],
    timestamp: "2026-04-12T11:00:00"
  },
  {
    id: "2026-04-12-A03",
    date: "2026-04-12",
    meal: "almuerzo", user: "adriana",
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
    meal: "snack", user: "adriana",
    items: [
      { foodId: "holy-cookie-pistachio", name: "Holy Cookie Pistachio (1/2)", grams: 90, kcal: 443.7, prot: 10.2, carbs: 31.9, fat: 29.7 },
      { foodId: "chocolate-negro-90", name: "Chocolate Negro 90%", grams: 6, kcal: 35.5, prot: 0.6, carbs: 0.8, fat: 3.3 }
    ],
    timestamp: "2026-04-12T16:00:00"
  },
  {
    id: "2026-04-12-A05",
    date: "2026-04-12",
    meal: "cena", user: "adriana",
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
    meal: "cena", user: "adriana",
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
    meal: "desayuno", user: "ernesto",
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
    meal: "almuerzo", user: "ernesto",
    items: [
      { foodId: "spanakopita", name: "Spanakopita", grams: 80, kcal: 111.8, prot: 4.9, carbs: 5.4, fat: 8.1 },
      { foodId: "pasta-pollo-espinaca-tomate-adri", name: "Pasta Pollo Espinaca Tomate", grams: 260, kcal: 224.6, prot: 34.6, carbs: 10.4, fat: 3.9 }
    ],
    timestamp: "2026-04-13T13:00:00"
  },
  {
    id: "2026-04-13-003",
    date: "2026-04-13",
    meal: "snack", user: "ernesto",
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
    meal: "cena", user: "ernesto",
    items: [
      { foodId: "quiche-brocoli-salmon-ricotta", name: "Quiche Brocoli Salmon", grams: 385, kcal: 456.6, prot: 37.3, carbs: 13.9, fat: 27.7 },
      { foodId: "ricotta-casa-azzurra", name: "Ricotta", grams: 63, kcal: 94.5, prot: 5.0, carbs: 0.8, fat: 7.6 }
    ],
    timestamp: "2026-04-13T20:00:00"
  },
  {
    id: "2026-04-13-005",
    date: "2026-04-13",
    meal: "snack", user: "ernesto",
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
    meal: "snack", user: "ernesto",
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
    meal: "desayuno", user: "adriana",
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
    meal: "almuerzo", user: "adriana",
    items: [
      { foodId: "pasta-pollo-espinaca-tomate-adri", name: "Pasta Pollo Espinaca Tomate", grams: 135, kcal: 116.6, prot: 18.0, carbs: 5.4, fat: 2.0 }
    ],
    timestamp: "2026-04-13T13:00:00"
  },
  {
    id: "2026-04-13-A03",
    date: "2026-04-13",
    meal: "snack", user: "adriana",
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
    meal: "snack", user: "adriana",
    items: [
      { foodId: "pan-banano-hp-chocolate", name: "Banana Bread HP", grams: 50, kcal: 111.8, prot: 4.7, carbs: 16.9, fat: 3.0 }
    ],
    timestamp: "2026-04-13T17:00:00"
  },
  {
    id: "2026-04-13-A05",
    date: "2026-04-13",
    meal: "cena", user: "adriana",
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
    meal: "desayuno", user: "adriana",
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
    meal: "snack", user: "adriana",
    items: [
      { foodId: "semillas-maranon", name: "Semillas de Marañon", grams: 10, kcal: 55.3, prot: 1.8, carbs: 3.0, fat: 4.4 }
    ],
    timestamp: "2026-04-14T11:00:00"
  },
  {
    id: "2026-04-14-A03",
    date: "2026-04-14",
    meal: "almuerzo", user: "adriana",
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
    meal: "snack", user: "adriana",
    items: [
      { foodId: "kefir-lactel-0-bio", name: "Kéfir Lactel 0%", grams: 300, kcal: 132.0, prot: 10.2, carbs: 12.3, fat: 4.5 }
    ],
    timestamp: "2026-04-14T10:00:00"
  },
  // === 2026-04-14 - Ernesto ===
  {
    id: "2026-04-14-001",
    date: "2026-04-14",
    meal: "desayuno", user: "ernesto",
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
    meal: "almuerzo", user: "ernesto",
    items: [
      { foodId: "quiche-brocoli-salmon-ricotta", name: "Quiche Saumon Brocoli", grams: 30, kcal: 35.6, prot: 2.9, carbs: 1.1, fat: 2.2 },
      { foodId: "patatas-horneadas", name: "Patatas Horneadas", grams: 100, kcal: 93.0, prot: 2.5, carbs: 21.0, fat: 0.1 },
      { foodId: "pasta-pollo-espinaca-tomate-adri", name: "Pasta Pollo Espinaca", grams: 180, kcal: 155.5, prot: 23.9, carbs: 7.2, fat: 2.7 }
    ],
    timestamp: "2026-04-14T13:00:00"
  },
  {
    id: "2026-04-14-003",
    date: "2026-04-14",
    meal: "snack", user: "ernesto",
    items: [
      { foodId: "eafit-pure-isolate-chocolat", name: "EAFit Chocolat", grams: 45, kcal: 159.3, prot: 36.5, carbs: 1.7, fat: 0.7 },
      { foodId: "remolacha-cocida", name: "Remolacha x2 pequeñas", grams: 120, kcal: 52.8, prot: 2.0, carbs: 12.0, fat: 0.1 },
      { foodId: "eafit-pure-isolate-chocolat", name: "EAFit Chocolat", grams: 30, kcal: 106.2, prot: 24.3, carbs: 1.1, fat: 0.5 }
    ],
    timestamp: "2026-04-14T16:00:00"
  },
  {
    id: "2026-04-14-004",
    date: "2026-04-14",
    meal: "cena", user: "ernesto",
    items: [
      { foodId: "huevo-picado-tomate-cebolla", name: "Huevo Picado con Tomate y Cebolla", grams: 250, kcal: 151.8, prot: 9.5, carbs: 10.3, fat: 8.8 },
      { foodId: "danone-cottage-cheese", name: "Cottage Cheese", grams: 50, kcal: 45.0, prot: 6.0, carbs: 0.8, fat: 2.0 },
      { foodId: "pan-caja-integral", name: "Pan Integral (1 rodaja pequeña)", grams: 25, units: 1, kcal: 61.8, prot: 2.3, carbs: 10.3, fat: 0.9 },
      { foodId: "wasa-fibre", name: "Wasa Fibre x2", grams: 22.8, units: 2, kcal: 75.9, prot: 3.0, carbs: 10.5, fat: 1.1 }
    ],
    timestamp: "2026-04-14T20:30:00"
  },
  {
    id: "2026-04-14-005",
    date: "2026-04-14",
    meal: "snack", user: "ernesto",
    items: [
      { foodId: "tostones-platano-macho", name: "Tostones Plátano Macho", grams: 30, kcal: 84.0, prot: 0.4, carbs: 13.2, fat: 3.3 },
      { foodId: "platano-maduro-frito", name: "Plátano Maduro Frito (2 rodajitas)", grams: 16, kcal: 38.4, prot: 0.2, carbs: 6.4, fat: 1.4 }
    ],
    timestamp: "2026-04-14T21:30:00"
  },
  // === 2026-04-14 - Adriana (cont.) ===
  {
    id: "2026-04-14-A05",
    date: "2026-04-14",
    meal: "snack", user: "adriana",
    items: [
      { foodId: "gerble-cookie-cacao-pepites-ss", name: "Gerblé Cookie Cacao x3", grams: 32.4, units: 3, kcal: 167.8, prot: 2.6, carbs: 19.8, fat: 5.8 }
    ],
    timestamp: "2026-04-14T16:00:00"
  },
  {
    id: "2026-04-14-A06",
    date: "2026-04-14",
    meal: "snack", user: "adriana",
    items: [
      { foodId: "siggis-skyr-nature", name: "Skyr Siggis", grams: 90, kcal: 56.7, prot: 9.9, carbs: 3.6, fat: 0.2 },
      { foodId: "blueberries-frescas", name: "Blueberries", grams: 25, kcal: 14.3, prot: 0.2, carbs: 3.6, fat: 0.1 },
      { foodId: "almendras-enteras", name: "Almendras", grams: 15, kcal: 86.4, prot: 3.2, carbs: 3.3, fat: 7.4 }
    ],
    timestamp: "2026-04-14T17:00:00"
  },
  {
    id: "2026-04-14-A07",
    date: "2026-04-14",
    meal: "cena", user: "adriana",
    items: [
      { foodId: "huevo-picado-tomate-cebolla", name: "Huevo Picado con Tomate y Cebolla", grams: 164, kcal: 99.5, prot: 6.3, carbs: 6.8, fat: 5.7 },
      { foodId: "danone-cottage-cheese", name: "Cottage Cheese", grams: 19, kcal: 17.1, prot: 2.3, carbs: 0.3, fat: 0.7 },
      { foodId: "ricotta-casa-azzurra", name: "Ricotta", grams: 51, kcal: 76.5, prot: 4.1, carbs: 0.6, fat: 6.1 }
    ],
    timestamp: "2026-04-14T20:30:00"
  },
  {
    id: "2026-04-14-A08",
    date: "2026-04-14",
    meal: "snack", user: "adriana",
    items: [
      { foodId: "tostones-platano-macho", name: "Tostones Plátano Macho", grams: 30, kcal: 84.0, prot: 0.4, carbs: 13.2, fat: 3.3 },
      { foodId: "platano-maduro-frito", name: "Plátano Maduro Frito (2 rodajitas)", grams: 16, kcal: 38.4, prot: 0.2, carbs: 6.4, fat: 1.4 }
    ],
    timestamp: "2026-04-14T21:30:00"
  },
  {
    id: "2026-04-14-006",
    date: "2026-04-14",
    meal: "snack", user: "ernesto",
    items: [
      { foodId: "eafit-pure-isolate-vanille", name: "EAFit Vanille", grams: 40, kcal: 146.4, prot: 34.4, carbs: 1.3, fat: 0.4 }
    ],
    timestamp: "2026-04-14T22:00:00"
  },
  {
    id: "2026-04-15-001",
    date: "2026-04-15",
    meal: "desayuno", user: "ernesto",
    items: [
      { foodId: "hipro-blueberry", name: "HiPro Blueberry", grams: 160, units: 1, kcal: 84.8, prot: 15.0, carbs: 6.1, fat: 0 }
    ],
    timestamp: "2026-04-15T09:00:00"
  },
  {
    id: "2026-04-15-002",
    date: "2026-04-15",
    meal: "almuerzo", user: "ernesto",
    items: [
      { foodId: "pollo-pechuga-horneada", name: "Pollo Horneado", grams: 90, kcal: 148.5, prot: 27.9, carbs: 0, fat: 3.2 },
      { foodId: "aceite-oliva", name: "AOVE (1 cdita marinado)", grams: 5, kcal: 44.2, prot: 0, carbs: 0, fat: 5.0 },
      { foodId: "pimiento-rojo-crudo", name: "Pimiento Horneado", grams: 25, kcal: 7.8, prot: 0.3, carbs: 1.5, fat: 0.1 },
      { foodId: "cebolla-cruda", name: "Cebolla Horneada", grams: 25, kcal: 10.0, prot: 0.3, carbs: 2.3, fat: 0 },
      { foodId: "tomate-cherry", name: "Tomates Cherry Frescos", grams: 25, kcal: 4.5, prot: 0.2, carbs: 1.0, fat: 0.1 },
      { foodId: "arroz-bomba-cocido", name: "Arroz Cocido (agua espinacas)", grams: 60, kcal: 78.0, prot: 1.6, carbs: 16.8, fat: 0.2 },
      { foodId: "tostones-platano-macho", name: "Tostones", grams: 28, kcal: 78.4, prot: 0.4, carbs: 12.3, fat: 3.1 },
      { foodId: "queso-curado-hacendado", name: "Queso Curado Mercadona", grams: 15, kcal: 64.7, prot: 3.8, carbs: 0.3, fat: 5.4 }
    ],
    timestamp: "2026-04-15T13:30:00"
  },
  {
    id: "2026-04-15-003",
    date: "2026-04-15",
    meal: "snack", user: "ernesto",
    items: [
      { foodId: "eafit-pure-isolate-vanille", name: "Proteina EAFit Vanille", grams: 50, kcal: 183.0, prot: 43.0, carbs: 1.7, fat: 0.5 },
      { foodId: "siggis-skyr-nature", name: "Skyr Nature", grams: 30, kcal: 18.9, prot: 3.3, carbs: 1.2, fat: 0.1 }
    ],
    timestamp: "2026-04-15T16:00:00"
  },
  {
    id: "2026-04-15-004",
    date: "2026-04-15",
    meal: "snack", user: "ernesto",
    items: [
      { foodId: "remolacha-cocida", name: "Remolacha", grams: 80, units: 1, kcal: 35.2, prot: 1.4, carbs: 8.0, fat: 0.1 },
      { foodId: "galleta-oreo-sin-crema", name: "Oreo Cookie (no cream)", grams: 30, kcal: 141.3, prot: 0.9, carbs: 22.1, fat: 6.2 }
    ],
    timestamp: "2026-04-15T18:30:00"
  },
  {
    id: "2026-04-15-005",
    date: "2026-04-15",
    meal: "snack", user: "ernesto",
    items: [
      { foodId: "gerble-cookie-cacao-pepites-ss", name: "Gerblé Cookie Cacao x1", grams: 10.8, units: 1, kcal: 55.9, prot: 0.9, carbs: 6.6, fat: 1.9 }
    ],
    timestamp: "2026-04-15T19:30:00"
  },
  {
    id: "2026-04-15-006",
    date: "2026-04-15",
    meal: "cena", user: "ernesto",
    items: [
      { foodId: "huevo-entero", name: "Huevo Entero (x1)", grams: 50, units: 1, kcal: 77.5, prot: 6.5, carbs: 0.6, fat: 5.5 },
      { foodId: "clara-huevo", name: "Clara de Huevo (x2)", grams: 66, units: 2, kcal: 34.3, prot: 7.3, carbs: 0.5, fat: 0.1 },
      { foodId: "cebolla-cruda", name: "Cebolla Cocida", grams: 32, kcal: 12.8, prot: 0.4, carbs: 3.0, fat: 0.0 },
      { foodId: "jamon-porc-fleury-michon", name: "Jamón Cocinado", grams: 26, kcal: 29.9, prot: 5.2, carbs: 0.3, fat: 0.9 },
      { foodId: "champinones-frescos", name: "Hongos Salteados", grams: 51, kcal: 11.2, prot: 1.6, carbs: 1.7, fat: 0.2 },
      { foodId: "queso-curado-hacendado", name: "Queso Maduro Mercadona", grams: 10, kcal: 43.1, prot: 2.5, carbs: 0.2, fat: 3.6 },
      { foodId: "ricotta-casa-azzurra", name: "Ricotta (2 tbsp)", grams: 30, kcal: 45.0, prot: 2.4, carbs: 0.4, fat: 3.6 },
      { foodId: "wasa-fibre", name: "Wasa Fibre (x2.5)", grams: 28.5, units: 2.5, kcal: 94.9, prot: 3.7, carbs: 13.1, fat: 1.4 }
    ],
    timestamp: "2026-04-15T20:30:00"
  },
  {
    id: "2026-04-15-007",
    date: "2026-04-15",
    meal: "snack", user: "ernesto",
    items: [
      { foodId: "leche-almendra", name: "Leche Almendra (prop. 130/254)", grams: 51.2, kcal: 6.7, prot: 0.2, carbs: 0.1, fat: 0.6 },
      { foodId: "eafit-pure-isolate-vanille", name: "EAFit Vanille (prop.)", grams: 10.2, kcal: 37.3, prot: 8.8, carbs: 0.3, fat: 0.1 },
      { foodId: "hipro-vanille", name: "HiPro Vanille (2tbsp prop.)", grams: 15.4, kcal: 11.9, prot: 1.6, carbs: 0.9, fat: 0.1 },
      { foodId: "weider-peanut-butter-powder", name: "PB Powder (1/2tbsp prop.)", grams: 2.0, kcal: 8.8, prot: 1.0, carbs: 0.4, fat: 0.3 }
    ],
    timestamp: "2026-04-15T21:30:00"
  },
  {
    id: "2026-04-15-008",
    date: "2026-04-15",
    meal: "cena", user: "ernesto",
    items: [
      { foodId: "eafit-pure-isolate-vanille", name: "EAFit Vanille", grams: 30, kcal: 109.8, prot: 25.8, carbs: 1.0, fat: 0.3 },
      { foodId: "siggis-skyr-nature", name: "Skyr Siggis", grams: 60, kcal: 37.8, prot: 6.6, carbs: 2.4, fat: 0.1 }
    ],
    timestamp: "2026-04-15T21:45:00"
  },
  {
    id: "2026-04-15-009",
    date: "2026-04-15",
    meal: "cena", user: "ernesto",
    items: [
      { foodId: "eafit-pure-isolate-chocolat", name: "EAFit Chocolat", grams: 25, kcal: 88.5, prot: 20.3, carbs: 0.9, fat: 0.4 }
    ],
    timestamp: "2026-04-15T22:00:00"
  },
  // === ADRIANA 2026-04-15 ===
  {
    id: "2026-04-15-010",
    date: "2026-04-15",
    meal: "desayuno", user: "adriana",
    items: [
      { foodId: "hipro-coco", name: "HiPro Coco", grams: 233, kcal: 130.5, prot: 21.9, carbs: 8.6, fat: 0.9 },
      { foodId: "siggis-skyr-nature", name: "Skyr Siggis", grams: 50, kcal: 31.5, prot: 5.5, carbs: 2.0, fat: 0.1 },
      { foodId: "blueberries-frescas", name: "Blueberries", grams: 25, kcal: 14.3, prot: 0.2, carbs: 3.6, fat: 0.1 },
      { foodId: "fruits-rouges-mix", name: "Fruits Rouges", grams: 25, kcal: 10.0, prot: 0.2, carbs: 2.3, fat: 0.1 },
      { foodId: "semillas-chia", name: "Chia", grams: 5, kcal: 24.3, prot: 0.9, carbs: 2.1, fat: 1.6 },
      { foodId: "chispas-chocolate-oscuro", name: "Chocolate Chips", grams: 6, kcal: 28.8, prot: 0.3, carbs: 3.3, fat: 1.7 }
    ],
    timestamp: "2026-04-15T09:00:00"
  },
  {
    id: "2026-04-15-011",
    date: "2026-04-15",
    meal: "snack", user: "adriana",
    items: [
      { foodId: "gerble-cookie-cacao-pepites-ss", name: "Gerblé Cookie Cacao x3", grams: 32.4, units: 3, kcal: 167.8, prot: 2.6, carbs: 19.8, fat: 5.8 },
      { foodId: "cote-dor-noir-70", name: "Côte d'Or 70%", grams: 40, kcal: 218.0, prot: 3.2, carbs: 14.0, fat: 16.0 }
    ],
    timestamp: "2026-04-15T11:00:00"
  },
  {
    id: "2026-04-15-012",
    date: "2026-04-15",
    meal: "snack", user: "adriana",
    items: [
      { foodId: "leche-almendra", name: "Leche Almendra (prop. 130/254)", grams: 51.2, kcal: 6.7, prot: 0.2, carbs: 0.1, fat: 0.6 },
      { foodId: "eafit-pure-isolate-vanille", name: "EAFit Vanille (prop.)", grams: 10.2, kcal: 37.3, prot: 8.8, carbs: 0.3, fat: 0.1 },
      { foodId: "hipro-vanille", name: "HiPro Vanille (2tbsp prop.)", grams: 15.4, kcal: 11.9, prot: 1.6, carbs: 0.9, fat: 0.1 },
      { foodId: "weider-peanut-butter-powder", name: "PB Powder (1/2tbsp prop.)", grams: 2.0, kcal: 8.8, prot: 1.0, carbs: 0.4, fat: 0.3 }
    ],
    timestamp: "2026-04-15T15:00:00"
  },
  {
    id: "2026-04-15-013",
    date: "2026-04-15",
    meal: "snack", user: "adriana",
    items: [
      { foodId: "ricotta-casa-azzurra", name: "Ricotta", grams: 50, kcal: 75.0, prot: 4.0, carbs: 0.6, fat: 6.0 },
      { foodId: "wasa-fibre", name: "Wasa Fibre (x2)", grams: 22.8, units: 2, kcal: 75.9, prot: 3.0, carbs: 10.5, fat: 1.1 }
    ],
    timestamp: "2026-04-15T17:00:00"
  },
  {
    id: "2026-04-15-014",
    date: "2026-04-15",
    meal: "cena", user: "adriana",
    items: [
      { foodId: "huevo-entero", name: "Huevo Entero (x1)", grams: 50, units: 1, kcal: 77.5, prot: 6.5, carbs: 0.6, fat: 5.5 },
      { foodId: "clara-huevo", name: "Clara de Huevo (x1)", grams: 33, units: 1, kcal: 17.2, prot: 3.6, carbs: 0.2, fat: 0.1 },
      { foodId: "cebolla-cruda", name: "Cebolla Cocida", grams: 33, kcal: 13.2, prot: 0.4, carbs: 3.1, fat: 0.0 },
      { foodId: "jamon-porc-fleury-michon", name: "Jamón Cocinado", grams: 15, kcal: 17.3, prot: 3.0, carbs: 0.2, fat: 0.5 },
      { foodId: "champinones-frescos", name: "Hongos Salteados", grams: 38, kcal: 8.4, prot: 1.2, carbs: 1.3, fat: 0.1 },
      { foodId: "queso-curado-hacendado", name: "Queso Maduro", grams: 9, kcal: 38.8, prot: 2.3, carbs: 0.2, fat: 3.2 },
      { foodId: "ricotta-casa-azzurra", name: "Ricotta (2 tbsp)", grams: 30, kcal: 45.0, prot: 2.4, carbs: 0.4, fat: 3.6 },
      { foodId: "wasa-fibre", name: "Wasa Fibre (x1.5)", grams: 17.1, units: 1.5, kcal: 56.9, prot: 2.2, carbs: 7.9, fat: 0.9 }
    ],
    timestamp: "2026-04-15T20:30:00"
  },
  {
    id: "2026-04-15-015",
    date: "2026-04-15",
    meal: "almuerzo", user: "adriana",
    items: [
      { foodId: "arroz-bomba-cocido", name: "Arroz Cocido", grams: 70, kcal: 91.0, prot: 1.9, carbs: 19.6, fat: 0.2 },
      { foodId: "pollo-pechuga-horneada", name: "Pollo Horneado", grams: 80, kcal: 132.0, prot: 24.8, carbs: 0, fat: 2.9 },
      { foodId: "cebolla-cruda", name: "Cebolla Horneada", grams: 25, kcal: 10.0, prot: 0.3, carbs: 2.3, fat: 0.0 },
      { foodId: "pimiento-rojo-crudo", name: "Pimiento (chile)", grams: 25, kcal: 7.8, prot: 0.3, carbs: 1.5, fat: 0.1 },
      { foodId: "tostones-platano-macho", name: "Tostón (x1)", grams: 12, kcal: 33.6, prot: 0.2, carbs: 5.3, fat: 1.3 }
    ],
    timestamp: "2026-04-15T13:30:00"
  },
  // === ERNESTO 2026-04-16 ===
  {
    id: "2026-04-16-001",
    date: "2026-04-16",
    meal: "desayuno", user: "ernesto",
    items: [
      { foodId: "huevo-picado-tomate-cebolla", name: "Huevo Picado con Tomate y Cebolla", grams: 110, kcal: 66.8, prot: 4.2, carbs: 4.5, fat: 3.9 },
      { foodId: "ricotta-casero", name: "Ricotta Casero", grams: 50, kcal: 87.0, prot: 5.7, carbs: 1.5, fat: 6.5 },
      { foodId: "hipro-coco", name: "HiPro Coco", grams: 160, kcal: 89.6, prot: 15.0, carbs: 5.9, fat: 0.6 },
      { foodId: "wasa-fibre", name: "Wasa Fibre x2", grams: 22.8, units: 2, kcal: 75.9, prot: 3.0, carbs: 10.5, fat: 1.1 },
      { foodId: "siggis-skyr-nature", name: "Skyr Siggis", grams: 60, kcal: 37.8, prot: 6.6, carbs: 2.4, fat: 0.1 },
      { foodId: "eafit-pure-isolate-chocolat", name: "EAFit Chocolat", grams: 40, kcal: 141.6, prot: 32.4, carbs: 1.5, fat: 0.6 }
    ],
    timestamp: "2026-04-16T09:00:00"
  },
  {
    id: "2026-04-16-002",
    date: "2026-04-16",
    meal: "almuerzo", user: "ernesto",
    items: [
      { foodId: "pollo-pechuga-horneada", name: "Pollo Horneado", grams: 105, kcal: 173.3, prot: 32.6, carbs: 0, fat: 3.7 },
      { foodId: "aceite-oliva", name: "AOVE (1 cdita marinado)", grams: 5, kcal: 44.2, prot: 0, carbs: 0, fat: 5.0 },
      { foodId: "pimiento-rojo-crudo", name: "Pimiento Horneado", grams: 25, kcal: 7.8, prot: 0.3, carbs: 1.5, fat: 0.1 },
      { foodId: "cebolla-cruda", name: "Cebolla Horneada", grams: 25, kcal: 10.0, prot: 0.3, carbs: 2.3, fat: 0 },
      { foodId: "tomate-cherry", name: "Tomates Cherry Frescos", grams: 25, kcal: 4.5, prot: 0.2, carbs: 1.0, fat: 0.1 },
      { foodId: "arroz-bomba-cocido", name: "Arroz Cocido (agua espinacas)", grams: 60, kcal: 78.0, prot: 1.6, carbs: 16.8, fat: 0.2 },
      { foodId: "cote-dor-noir-70", name: "Côte d'Or 70%", grams: 4, kcal: 21.8, prot: 0.3, carbs: 1.4, fat: 1.6 }
    ],
    timestamp: "2026-04-16T13:30:00"
  },
  // Ernesto - Snack 16/04
  {
    id: "2026-04-16-003",
    date: "2026-04-16",
    meal: "snack", user: "ernesto",
    items: [
      { foodId: "gerble-cookie-cacao-pepites-ss", name: "Gerblé Cookie Chocola x2", grams: 21.6, units: 2, kcal: 111.9, prot: 1.7, carbs: 13.2, fat: 3.9 }
    ],
    timestamp: "2026-04-16T17:00:00"
  },
  // Adriana - Desayuno 16/04
  {
    id: "2026-04-16-A01",
    date: "2026-04-16",
    meal: "desayuno", user: "adriana",
    items: [
      { foodId: "leche-almendra", name: "Leche de Almendras", grams: 150, kcal: 19.5, prot: 0.6, carbs: 0.3, fat: 1.7 },
      { foodId: "hipro-vanille", name: "HiPro Vanille", grams: 153, kcal: 117.8, prot: 15.6, carbs: 9.0, fat: 1.2 },
      { foodId: "siggis-skyr-nature", name: "Skyr Siggis", grams: 127, kcal: 80.0, prot: 14.0, carbs: 5.1, fat: 0.3 },
      { foodId: "semillas-chia", name: "Chia (1 tsp)", grams: 5, kcal: 24.3, prot: 0.9, carbs: 2.1, fat: 1.6 },
      { foodId: "cote-dor-noir-70", name: "Côte d'Or 70%", grams: 10, kcal: 54.5, prot: 0.8, carbs: 3.5, fat: 4.0 },
      { foodId: "blueberries-frescas", name: "Blueberries", grams: 25, kcal: 14.3, prot: 0.2, carbs: 3.6, fat: 0.1 },
      { foodId: "fruits-rouges-mix", name: "Fruits Rouges", grams: 25, kcal: 10.0, prot: 0.2, carbs: 2.3, fat: 0.1 }
    ],
    timestamp: "2026-04-16T08:30:00"
  },
  // Adriana - Snack 16/04
  {
    id: "2026-04-16-A02",
    date: "2026-04-16",
    meal: "snack", user: "adriana",
    items: [
      { foodId: "mini-financier-amandes", name: "Mini Financier x2", grams: 30, units: 2, kcal: 135.9, prot: 1.6, carbs: 14.1, fat: 7.7 },
      { foodId: "madeleine-traditionnelle", name: "Madeleine x2", grams: 50, units: 2, kcal: 216.5, prot: 3.3, carbs: 25.0, fat: 11.7 }
    ],
    timestamp: "2026-04-16T11:00:00"
  },
  // Adriana - Almuerzo 16/04
  {
    id: "2026-04-16-A03",
    date: "2026-04-16",
    meal: "almuerzo", user: "adriana",
    items: [
      { foodId: "arroz-bomba-cocido", name: "Arroz Cocido", grams: 70, kcal: 91.0, prot: 1.9, carbs: 19.6, fat: 0.2 },
      { foodId: "pollo-pechuga-horneada", name: "Pollo Horneado", grams: 80, kcal: 132.0, prot: 24.8, carbs: 0, fat: 2.9 },
      { foodId: "cebolla-cruda", name: "Cebolla", grams: 25, kcal: 10.0, prot: 0.3, carbs: 2.3, fat: 0.0 },
      { foodId: "pimiento-rojo-crudo", name: "Chile (Pimiento)", grams: 25, kcal: 7.8, prot: 0.3, carbs: 1.5, fat: 0.1 },
      { foodId: "tostones-platano-macho", name: "Tostón (x1)", grams: 12, kcal: 33.6, prot: 0.2, carbs: 5.3, fat: 1.3 }
    ],
    timestamp: "2026-04-16T13:30:00"
  },
  // Adriana - Snack 2 16/04
  {
    id: "2026-04-16-A04",
    date: "2026-04-16",
    meal: "snack", user: "adriana",
    items: [
      { foodId: "kefir-lactel-0-bio", name: "Kéfir Lactel 0%", grams: 123, kcal: 54.1, prot: 4.2, carbs: 5.0, fat: 1.8 },
      { foodId: "eafit-pure-isolate-vanille", name: "EAFit Vanille", grams: 10, kcal: 36.6, prot: 8.6, carbs: 0.3, fat: 0.1 },
      { foodId: "fresas-frescas", name: "Fresas", grams: 62, kcal: 19.8, prot: 0.4, carbs: 4.8, fat: 0.2 }
    ],
    timestamp: "2026-04-16T16:30:00"
  },
  // Adriana - Cena 16/04
  {
    id: "2026-04-16-A05",
    date: "2026-04-16",
    meal: "cena", user: "adriana",
    items: [
      { foodId: "huevo-entero", name: "Huevo Entero", grams: 50, units: 1, kcal: 77.5, prot: 6.5, carbs: 0.6, fat: 5.5 },
      { foodId: "clara-huevo", name: "Clara de Huevo", grams: 33, units: 1, kcal: 17.2, prot: 3.6, carbs: 0.2, fat: 0.1 },
      { foodId: "jamon-porc-fleury-michon", name: "Jamón", grams: 26, kcal: 29.9, prot: 5.2, carbs: 0.3, fat: 0.9 },
      { foodId: "aceite-oliva", name: "AOVE (1/2 tsp)", grams: 2.5, kcal: 22.1, prot: 0, carbs: 0, fat: 2.5 },
      { foodId: "quiche-brocoli-salmon-ricotta", name: "Quiche Saumon Brocoli", grams: 61, kcal: 72.3, prot: 5.9, carbs: 2.2, fat: 4.4 },
      { foodId: "ricotta-casa-azzurra", name: "Ricotta (3 tbsp)", grams: 45, kcal: 67.5, prot: 3.6, carbs: 0.5, fat: 5.4 },
      { foodId: "tostones-platano-macho", name: "Tostón (x1)", grams: 12, kcal: 33.6, prot: 0.2, carbs: 5.3, fat: 1.3 },
      { foodId: "hipro-creme-dessert-choco-noisette", name: "HiPro Crème Dessert Choco Noisette", grams: 84, kcal: 63.8, prot: 8.6, carbs: 5.3, fat: 0.8 }
    ],
    timestamp: "2026-04-16T20:00:00"
  },
  // === ERNESTO 2026-04-16 (cont.) ===
  // Ernesto - Snack 2 16/04
  {
    id: "2026-04-16-004",
    date: "2026-04-16",
    meal: "snack", user: "ernesto",
    items: [
      { foodId: "kefir-lactel-0-bio", name: "Kéfir Lactel 0%", grams: 125, kcal: 55.0, prot: 4.3, carbs: 5.1, fat: 1.9 },
      { foodId: "eafit-pure-isolate-chocolat", name: "EAFit Chocolat", grams: 20, kcal: 70.8, prot: 16.2, carbs: 0.7, fat: 0.3 },
      { foodId: "banana-fresca", name: "Banano", grams: 60, kcal: 53.4, prot: 0.7, carbs: 13.7, fat: 0.2 }
    ],
    timestamp: "2026-04-16T17:30:00"
  },
  // Ernesto - Cena 16/04
  {
    id: "2026-04-16-005",
    date: "2026-04-16",
    meal: "cena", user: "ernesto",
    items: [
      { foodId: "huevo-entero", name: "Huevo Entero", grams: 50, units: 1, kcal: 77.5, prot: 6.5, carbs: 0.6, fat: 5.5 },
      { foodId: "clara-huevo", name: "Clara de Huevo (x2)", grams: 66, units: 2, kcal: 34.3, prot: 7.3, carbs: 0.5, fat: 0.1 },
      { foodId: "jamon-porc-fleury-michon", name: "Jamón", grams: 30, kcal: 34.5, prot: 6.0, carbs: 0.3, fat: 1.1 },
      { foodId: "aceite-oliva", name: "AOVE (1/2 tsp)", grams: 2.5, kcal: 22.1, prot: 0, carbs: 0, fat: 2.5 },
      { foodId: "quiche-brocoli-salmon-ricotta", name: "Quiche Saumon Brocoli", grams: 68, kcal: 80.6, prot: 6.6, carbs: 2.4, fat: 4.9 },
      { foodId: "ricotta-casa-azzurra", name: "Ricotta (2 tbsp)", grams: 30, kcal: 45.0, prot: 2.4, carbs: 0.4, fat: 3.6 },
      { foodId: "hipro-creme-dessert-choco-noisette", name: "HiPro Crème Dessert Choco Noisette", grams: 80, kcal: 60.8, prot: 8.2, carbs: 5.0, fat: 0.7 }
    ],
    timestamp: "2026-04-16T20:30:00"
  },
  // Ernesto - Snack 3 16/04
  {
    id: "2026-04-16-006",
    date: "2026-04-16",
    meal: "snack", user: "ernesto",
    items: [
      { foodId: "eafit-pure-isolate-vanille", name: "EAFit Vanille", grams: 35, kcal: 128.1, prot: 30.1, carbs: 1.2, fat: 0.3 }
    ],
    timestamp: "2026-04-16T22:00:00"
  },
  // Ernesto - Desayuno 17/04
  {
    id: "2026-04-17-001",
    date: "2026-04-17",
    meal: "desayuno", user: "ernesto",
    items: [
      { foodId: "eafit-pure-isolate-chocolat", name: "EAFit Chocolat", grams: 40, kcal: 141.6, prot: 32.4, carbs: 1.5, fat: 0.6 },
      { foodId: "kefir-lactel-0-bio", name: "Kéfir Lactel 0%", grams: 50, kcal: 22.0, prot: 1.7, carbs: 2.1, fat: 0.8 },
      { foodId: "siggis-skyr-nature", name: "Skyr Siggis Nature", grams: 50, kcal: 31.5, prot: 5.5, carbs: 2.0, fat: 0.1 },
      { foodId: "hipro-coco", name: "HiPro Coco (1/2 pot)", grams: 80, kcal: 44.8, prot: 7.5, carbs: 3.0, fat: 0.3 }
    ],
    timestamp: "2026-04-17T11:41:10"
  },
  // Ernesto - Almuerzo 17/04
  {
    id: "2026-04-17-002",
    date: "2026-04-17",
    meal: "almuerzo", user: "ernesto",
    items: [
      { foodId: "pollo-pechuga-horneada", name: "Pollo Horneado", grams: 100, kcal: 165.0, prot: 31.0, carbs: 0, fat: 3.6 },
      { foodId: "cannelloni-ricotta-epinard-picard", name: "Cannelloni Ricotta Épinard Picard", grams: 175, kcal: 210.0, prot: 9.8, carbs: 16.1, fat: 11.4 }
    ],
    timestamp: "2026-04-17T13:00:00"
  },
  // Ernesto - Snack 17/04
  {
    id: "2026-04-17-003",
    date: "2026-04-17",
    meal: "snack", user: "ernesto",
    items: [
      { foodId: "kefir-lactel-0-bio", name: "Kéfir Lactel 0%", grams: 150, kcal: 66.0, prot: 5.1, carbs: 6.2, fat: 2.3 },
      { foodId: "eafit-pure-isolate-vanille", name: "EAFit Vainilla", grams: 40, kcal: 146.4, prot: 34.4, carbs: 1.3, fat: 0.4 },
      { foodId: "fresas-frescas", name: "Fresas", grams: 66, kcal: 21.1, prot: 0.5, carbs: 5.1, fat: 0.2 }
    ],
    timestamp: "2026-04-17T16:00:00"
  },
  // Ernesto - Cena 17/04
  {
    id: "2026-04-17-004",
    date: "2026-04-17",
    meal: "cena", user: "ernesto",
    items: [
      { foodId: "arroz-bomba-cocido", name: "Arroz Cocido (casamiento)", grams: 50, kcal: 65.0, prot: 1.4, carbs: 14.0, fat: 0.2 },
      { foodId: "frijoles-negros-licuados", name: "Frijoles Licuados", grams: 30, kcal: 27.0, prot: 1.8, carbs: 3.6, fat: 0.5 },
      { foodId: "carne-mechada-venezolana", name: "Carne Mechada Venezolana", grams: 176, kcal: 246.4, prot: 29.9, carbs: 5.3, fat: 11.4 },
      { foodId: "platano-maduro-frito", name: "Plátano Sazón Frito", grams: 64, kcal: 153.6, prot: 0.6, carbs: 25.6, fat: 5.8 },
      { foodId: "tostones-platano-macho", name: "Tostones Fritos", grams: 51, kcal: 142.8, prot: 0.7, carbs: 22.4, fat: 5.6 },
      { foodId: "halloumi-frito", name: "Halloumi Frito", grams: 33, kcal: 115.5, prot: 6.6, carbs: 1.0, fat: 9.9 },
      { foodId: "agua-jamaica-sin-azucar", name: "Agua de Jamaica sin Azúcar", grams: 200, kcal: 4.0, prot: 0, carbs: 1.0, fat: 0 }
    ],
    timestamp: "2026-04-17T20:30:00"
  },
  // Ernesto - Snack 2 17/04
  {
    id: "2026-04-17-005",
    date: "2026-04-17",
    meal: "snack", user: "ernesto",
    items: [
      { foodId: "hipro-creme-dessert-choco-noisette", name: "HiPro Crème Dessert Choco Noisette", grams: 111, kcal: 84.4, prot: 11.3, carbs: 7.0, fat: 1.0 }
    ],
    timestamp: "2026-04-17T22:00:00"
  },
  // === ADRIANA 2026-04-17 ===
  {
    id: "2026-04-17-A01",
    date: "2026-04-17",
    meal: "desayuno", user: "adriana",
    items: [
      { foodId: "hipro-coco", name: "HiPro Coco", grams: 79, kcal: 44.2, prot: 7.4, carbs: 2.9, fat: 0.3 },
      { foodId: "siggis-skyr-nature", name: "Skyr Siggis", grams: 171, kcal: 107.7, prot: 18.8, carbs: 6.8, fat: 0.3 },
      { foodId: "blueberries-frescas", name: "Blueberries", grams: 50, kcal: 28.5, prot: 0.4, carbs: 7.3, fat: 0.2 },
      { foodId: "chocolate-negro-90", name: "Chocolate Negro 90%", grams: 10, kcal: 59.2, prot: 1.0, carbs: 1.4, fat: 5.5 },
      { foodId: "semillas-chia", name: "Chia (1 tsp)", grams: 5, kcal: 24.3, prot: 0.9, carbs: 2.1, fat: 1.6 }
    ],
    timestamp: "2026-04-17T09:00:00"
  },
  {
    id: "2026-04-17-A02",
    date: "2026-04-17",
    meal: "almuerzo", user: "adriana",
    items: [
      { foodId: "pollo-pechuga-horneada", name: "Pollo Horneado", grams: 80, kcal: 132.0, prot: 24.8, carbs: 0, fat: 2.9 },
      { foodId: "cannelloni-ricotta-epinard-picard", name: "Cannelloni Ricotta Épinard", grams: 175, kcal: 210.0, prot: 9.8, carbs: 16.1, fat: 11.4 },
      { foodId: "mache-salade", name: "Mâche", grams: 15, kcal: 1.7, prot: 0.3, carbs: 0.1, fat: 0.1 },
      { foodId: "tomate-cherry", name: "Tomates Cherry", grams: 10, kcal: 1.8, prot: 0.1, carbs: 0.4, fat: 0 }
    ],
    timestamp: "2026-04-17T13:00:00"
  },
  {
    id: "2026-04-17-A03",
    date: "2026-04-17",
    meal: "snack", user: "adriana",
    items: [
      { foodId: "kefir-lactel-0-bio", name: "Kéfir Lactel 0%", grams: 130, kcal: 57.2, prot: 4.4, carbs: 5.3, fat: 2.0 },
      { foodId: "eafit-pure-isolate-vanille", name: "EAFit Vainilla", grams: 25, kcal: 91.5, prot: 21.5, carbs: 0.8, fat: 0.2 },
      { foodId: "fresas-frescas", name: "Fresas", grams: 54, kcal: 17.3, prot: 0.4, carbs: 4.2, fat: 0.2 },
      { foodId: "siggis-skyr-nature", name: "Skyr Siggis", grams: 45, kcal: 28.4, prot: 5.0, carbs: 1.8, fat: 0.1 },
      { foodId: "almendras-enteras", name: "Almendras", grams: 7, kcal: 40.3, prot: 1.5, carbs: 1.5, fat: 3.4 },
      { foodId: "miel-abeja", name: "Miel (1/2 tsp)", grams: 3.5, kcal: 10.6, prot: 0, carbs: 2.9, fat: 0 }
    ],
    timestamp: "2026-04-17T16:30:00"
  },
  // Adriana - Cena 17/04
  {
    id: "2026-04-17-A04",
    date: "2026-04-17",
    meal: "cena", user: "adriana",
    items: [
      { foodId: "arroz-bomba-cocido", name: "Arroz Cocido (casamiento)", grams: 20, kcal: 26.0, prot: 0.5, carbs: 5.6, fat: 0.1 },
      { foodId: "frijoles-negros-licuados", name: "Frijoles Licuados", grams: 14, kcal: 12.6, prot: 0.8, carbs: 1.7, fat: 0.2 },
      { foodId: "carne-mechada-venezolana", name: "Carne Mechada Venezolana", grams: 123, kcal: 172.2, prot: 20.9, carbs: 3.7, fat: 8.0 },
      { foodId: "platano-maduro-frito", name: "Plátano Sazón Frito", grams: 59, kcal: 141.6, prot: 0.6, carbs: 23.6, fat: 5.3 },
      { foodId: "tostones-platano-macho", name: "Tostones Fritos", grams: 63, kcal: 176.4, prot: 0.8, carbs: 27.7, fat: 6.9 },
      { foodId: "halloumi-frito", name: "Halloumi Frito", grams: 14, kcal: 49.0, prot: 2.8, carbs: 0.4, fat: 4.2 },
      { foodId: "agua-jamaica-sin-azucar", name: "Agua de Jamaica sin Azúcar", grams: 200, kcal: 4.0, prot: 0, carbs: 1.0, fat: 0 }
    ],
    timestamp: "2026-04-17T20:30:00"
  },
  // Adriana - Snack 2 17/04
  {
    id: "2026-04-17-A05",
    date: "2026-04-17",
    meal: "snack", user: "adriana",
    items: [
      { foodId: "hipro-creme-dessert-choco-noisette", name: "HiPro Crème Dessert Choco Noisette", grams: 69, kcal: 52.4, prot: 7.0, carbs: 4.3, fat: 0.6 }
    ],
    timestamp: "2026-04-17T22:00:00"
  },
  // === ERNESTO 2026-04-18 ===
  {
    id: "2026-04-18-001",
    date: "2026-04-18",
    meal: "desayuno", user: "ernesto",
    items: [
      { foodId: "avena-cruda", name: "Avena en Hojuelas (75%)", grams: 30, kcal: 116.7, prot: 5.1, carbs: 19.9, fat: 2.1 },
      { foodId: "huevo-entero", name: "Huevo Entero (75%)", grams: 37.5, kcal: 58.1, prot: 4.9, carbs: 0.4, fat: 4.1 },
      { foodId: "cocoa-en-polvo", name: "Cocoa en Polvo (75%)", grams: 6, kcal: 13.7, prot: 1.2, carbs: 3.5, fat: 0.8 },
      { foodId: "eafit-pure-isolate-vanille", name: "EAFit Vainilla (75%)", grams: 30, kcal: 109.8, prot: 25.8, carbs: 1.0, fat: 0.3 },
      { foodId: "weider-peanut-butter-powder", name: "PB Powder (2 tsp)", grams: 10, kcal: 44.0, prot: 4.9, carbs: 1.9, fat: 1.3 },
      { foodId: "hipro-vanille", name: "HiPro Vanille", grams: 100, kcal: 77.0, prot: 10.2, carbs: 5.9, fat: 0.8 },
      { foodId: "leche-almendra", name: "Leche Almendra Alpro Grillée", grams: 150, kcal: 19.5, prot: 0.6, carbs: 0.3, fat: 1.7 }
    ],
    timestamp: "2026-04-18T09:00:00"
  },
  {
    id: "2026-04-18-002",
    date: "2026-04-18",
    meal: "almuerzo", user: "ernesto",
    items: [
      { foodId: "carne-mechada-venezolana", name: "Carne Mechada Venezolana", grams: 165, kcal: 231.0, prot: 28.1, carbs: 5.0, fat: 10.7 },
      { foodId: "platano-maduro-frito", name: "Plátano Maduro Frito", grams: 57, kcal: 136.8, prot: 0.6, carbs: 22.8, fat: 5.1 },
      { foodId: "halloumi-frito", name: "Halloumi Frito", grams: 22, kcal: 77.0, prot: 4.4, carbs: 0.7, fat: 6.6 },
      { foodId: "arroz-bomba-cocido", name: "Arroz Cocido (casamiento)", grams: 24, kcal: 31.2, prot: 0.6, carbs: 6.7, fat: 0.1 },
      { foodId: "frijoles-negros-licuados", name: "Frijoles Licuados", grams: 16, kcal: 14.4, prot: 1.0, carbs: 1.9, fat: 0.2 },
      { foodId: "eafit-pure-isolate-vanille", name: "EAFit Vainilla", grams: 30, kcal: 109.8, prot: 25.8, carbs: 1.0, fat: 0.3 }
    ],
    timestamp: "2026-04-18T13:00:00"
  },
  // === ADRIANA 2026-04-18 ===
  {
    id: "2026-04-18-A01",
    date: "2026-04-18",
    meal: "desayuno", user: "adriana",
    items: [
      { foodId: "avena-cruda", name: "Avena en Hojuelas", grams: 40, kcal: 155.6, prot: 6.8, carbs: 26.5, fat: 2.8 },
      { foodId: "huevo-entero", name: "Huevo Entero (x1)", grams: 50, units: 1, kcal: 77.5, prot: 6.5, carbs: 0.6, fat: 5.5 },
      { foodId: "cocoa-en-polvo", name: "Cocoa en Polvo", grams: 8, kcal: 18.2, prot: 1.6, carbs: 4.6, fat: 1.1 },
      { foodId: "eafit-pure-isolate-vanille", name: "EAFit Vainilla", grams: 40, kcal: 146.4, prot: 34.4, carbs: 1.3, fat: 0.4 },
      { foodId: "weider-peanut-butter-powder", name: "PB Powder (2 tsp)", grams: 10, kcal: 44.0, prot: 4.9, carbs: 1.9, fat: 1.3 },
      { foodId: "hipro-vanille", name: "HiPro Vanille", grams: 100, kcal: 77.0, prot: 10.2, carbs: 5.9, fat: 0.8 },
      { foodId: "leche-almendra", name: "Leche Almendra Alpro Grillée", grams: 100, kcal: 13.0, prot: 0.4, carbs: 0.2, fat: 1.1 }
    ],
    timestamp: "2026-04-18T09:00:00"
  },
  {
    id: "2026-04-18-A02",
    date: "2026-04-18",
    meal: "snack", user: "adriana",
    items: [
      { foodId: "chausson-pommes-boulangerie", name: "Chausson aux Pommes", grams: 42, kcal: 142.8, prot: 1.5, carbs: 16.8, fat: 7.6 }
    ],
    timestamp: "2026-04-18T11:00:00"
  },
  {
    id: "2026-04-18-A03",
    date: "2026-04-18",
    meal: "almuerzo", user: "adriana",
    items: [
      { foodId: "carne-mechada-venezolana", name: "Carne Mechada Venezolana", grams: 125, kcal: 175.0, prot: 21.3, carbs: 3.8, fat: 8.1 },
      { foodId: "platano-maduro-frito", name: "Plátano Maduro Frito", grams: 55, kcal: 132.0, prot: 0.6, carbs: 22.0, fat: 5.0 },
      { foodId: "arroz-bomba-cocido", name: "Arroz Cocido (casamiento)", grams: 18, kcal: 23.4, prot: 0.5, carbs: 5.0, fat: 0.1 },
      { foodId: "frijoles-negros-licuados", name: "Frijoles Licuados", grams: 12, kcal: 10.8, prot: 0.7, carbs: 1.4, fat: 0.2 }
    ],
    timestamp: "2026-04-18T13:00:00"
  },
  // Ernesto - Cena 18/04 - Pizza LouieLouie
  {
    id: "2026-04-18-003",
    date: "2026-04-18",
    meal: "cena", user: "ernesto",
    items: [
      { foodId: "vino-blanco-seco", name: "Vino Blanco Ouistiti (2 copas peq)", grams: 200, kcal: 164.0, prot: 0.2, carbs: 5.2, fat: 0 },
      { foodId: "pizza-margherite-louielouie", name: "Pizza Margherite LouieLouie (1/2)", grams: 150, kcal: 315.0, prot: 10.5, carbs: 46.5, fat: 9.0 },
      { foodId: "pizza-jamon-bigorre-louielouie", name: "Pizza Jamón Noir de Bigorre (1/2)", grams: 165, kcal: 412.5, prot: 18.2, carbs: 44.6, fat: 16.5 },
      { foodId: "profiterole-sorbet-vanille-chocolat", name: "Profiterole (sorbete vainilla, choco, avellana)", grams: 180, kcal: 504.0, prot: 7.2, carbs: 59.4, fat: 25.2 },
      { foodId: "aceite-oliva", name: "AOVE Piquant (1 cdita)", grams: 5, kcal: 44.2, prot: 0, carbs: 0, fat: 5.0 }
    ],
    timestamp: "2026-04-18T21:00:00"
  },
  // Adriana - Cena 18/04 - Pizza LouieLouie
  {
    id: "2026-04-18-A04",
    date: "2026-04-18",
    meal: "cena", user: "adriana",
    items: [
      { foodId: "limonada-casera", name: "Limonada Casera", grams: 250, kcal: 87.5, prot: 0, carbs: 22.5, fat: 0 },
      { foodId: "pizza-margherite-louielouie", name: "Pizza Margherite LouieLouie (1/3)", grams: 100, kcal: 210.0, prot: 7.0, carbs: 31.0, fat: 6.0 },
      { foodId: "pizza-jamon-bigorre-louielouie", name: "Pizza Jamón Noir de Bigorre (1/3)", grams: 110, kcal: 275.0, prot: 12.1, carbs: 29.7, fat: 11.0 },
      { foodId: "profiterole-sorbet-vanille-chocolat", name: "Profiterole (sorbete vainilla, choco, avellana)", grams: 180, kcal: 504.0, prot: 7.2, carbs: 59.4, fat: 25.2 }
    ],
    timestamp: "2026-04-18T21:00:00"
  },
  // Ernesto - Snack 18/04 - Proteina para meta
  {
    id: "2026-04-18-004",
    date: "2026-04-18",
    meal: "snack", user: "ernesto",
    items: [
      { foodId: "eafit-pure-isolate-vanille", name: "EAFit Vainilla", grams: 48, kcal: 175.7, prot: 41.3, carbs: 1.6, fat: 0.4 }
    ],
    timestamp: "2026-04-18T22:30:00"
  },
  // === ERNESTO 2026-04-19 ===
  {
    id: "2026-04-19-001",
    date: "2026-04-19",
    meal: "desayuno", user: "ernesto",
    items: [
      { foodId: "shake-vanilla-fresas", name: "Shake Vanilla Fresas", grams: 300, kcal: 132.0, prot: 26.4, carbs: 6.3, fat: 0.6 },
      { foodId: "siggis-skyr-nature", name: "Skyr Nature", grams: 50, kcal: 31.5, prot: 5.5, carbs: 2.0, fat: 0.1 },
      { foodId: "fresas-frescas", name: "Fresas Frescas", grams: 50, kcal: 16.0, prot: 0.4, carbs: 3.9, fat: 0.2 }
    ],
    timestamp: "2026-04-19T09:00:00"
  },
  {
    id: "2026-04-19-002",
    date: "2026-04-19",
    meal: "almuerzo", user: "ernesto",
    items: [
      { foodId: "carne-mechada-venezolana", name: "Carne Mechada", grams: 180, kcal: 252.0, prot: 30.6, carbs: 5.4, fat: 11.7 },
      { foodId: "casamiento-arroz-frijoles", name: "Casamiento", grams: 35, kcal: 40.3, prot: 1.4, carbs: 7.7, fat: 0.3 },
      { foodId: "pizza-margherite-louielouie", name: "Pizza Margherite (1/12)", grams: 25, kcal: 52.5, prot: 1.8, carbs: 7.8, fat: 1.5 },
      { foodId: "pizza-jamon-bigorre-louielouie", name: "Pizza Jamon Bigorre (1/12)", grams: 27.5, kcal: 68.8, prot: 3.0, carbs: 7.4, fat: 2.8 },
      { foodId: "tostones-platano-macho", name: "Tostones (1.5 uds)", grams: 50, units: 1.5, kcal: 140.0, prot: 0.7, carbs: 22.0, fat: 5.5 }
    ],
    timestamp: "2026-04-19T13:00:00"
  },
  {
    id: "2026-04-19-003",
    date: "2026-04-19",
    meal: "snack", user: "ernesto",
    items: [
      { foodId: "eafit-pure-isolate-chocolat", name: "EAFit Choco", grams: 40, kcal: 141.6, prot: 32.4, carbs: 1.5, fat: 0.6 },
      { foodId: "kefir-lactel-0-bio", name: "Kefir Lactel 0%", grams: 50, kcal: 22.0, prot: 1.7, carbs: 2.1, fat: 0.8 },
      { foodId: "weider-peanut-butter-powder", name: "PB Powder", grams: 3, kcal: 13.2, prot: 1.5, carbs: 0.6, fat: 0.4 },
      { foodId: "banana-fresca", name: "Banano", grams: 42, kcal: 37.4, prot: 0.5, carbs: 9.6, fat: 0.1 },
      { foodId: "croissant-boulangerie", name: "Croissant Les Commeres", grams: 50, units: 1, kcal: 203.0, prot: 4.1, carbs: 22.9, fat: 10.5 },
      { foodId: "alfajor-havanna-chocolate-ddl", name: "Alfajor Havanna (1/2)", grams: 27.5, kcal: 112.5, prot: 1.5, carbs: 16.0, fat: 4.7 },
      { foodId: "eafit-pure-isolate-vanille", name: "EAFit Vanilla", grams: 38, kcal: 139.1, prot: 32.7, carbs: 1.3, fat: 0.3 },
      { foodId: "wasa-leger", name: "Wasa Leger x2", grams: 19.2, units: 2, kcal: 64.9, prot: 1.7, carbs: 11.9, fat: 0.3 },
      { foodId: "ricotta-casero", name: "Ricotta Casero", grams: 30, kcal: 52.2, prot: 3.4, carbs: 0.9, fat: 3.9 },
      { foodId: "mermelada-lucien-fraises-sans-sucres", name: "Mermelada Fraises Sans Sucres", grams: 20, kcal: 17.8, prot: 0.1, carbs: 4.3, fat: 0.1 }
    ],
    timestamp: "2026-04-19T16:00:00"
  },
  // Ernesto - Cena 19/04 - Arepa Reina Pepiada
  {
    id: "2026-04-19-004",
    date: "2026-04-19",
    meal: "cena", user: "ernesto",
    items: [
      { foodId: "pollo-pepiado-zucchini", name: "Pollo Pepiado (pechuga + zucchini + AOVE)", grams: 185, kcal: 168.4, prot: 24.6, carbs: 3.3, fat: 6.1 },
      { foodId: "salsa-skyr-cilantro", name: "Salsa de Skyr", grams: 36, kcal: 30.6, prot: 3.6, carbs: 1.4, fat: 1.1 },
      { foodId: "guacamole-zucchini-limon", name: "Guacamole Zucchini Limon", grams: 20, kcal: 17.6, prot: 0.3, carbs: 1.1, fat: 1.5 },
      { foodId: "cebolla-salteada", name: "Cebolla Salteada", grams: 17, kcal: 8.5, prot: 0.2, carbs: 1.5, fat: 0.2 },
      { foodId: "cilantro-fresco", name: "Cilantro", grams: 3, kcal: 0.7, prot: 0.1, carbs: 0.1, fat: 0 },
      { foodId: "arepa-maiz-blanco-casera", name: "Arepa Maiz Blanco", grams: 186, kcal: 282.7, prot: 6.5, carbs: 63.2, fat: 1.3 },
      { foodId: "aguacate-fresco", name: "Aguacate", grams: 25, kcal: 40.0, prot: 0.5, carbs: 2.1, fat: 3.7 },
      { foodId: "danone-cottage-cheese", name: "Cottage (1.5 tbsp)", grams: 22.5, kcal: 20.3, prot: 2.7, carbs: 0.4, fat: 0.9 }
    ],
    timestamp: "2026-04-19T20:00:00"
  },
  {
    id: "2026-04-19-005",
    date: "2026-04-19",
    meal: "snack", user: "ernesto",
    items: [
      { foodId: "hipro-chocolate-drink", name: "HiPro Choco Drink", grams: 100, kcal: 54.0, prot: 7.2, carbs: 4.0, fat: 0.3 }
    ],
    timestamp: "2026-04-19T22:00:00"
  },
  // === ADRIANA 2026-04-19 ===
  {
    id: "2026-04-19-A01",
    date: "2026-04-19",
    meal: "desayuno", user: "adriana",
    items: [
      { foodId: "eafit-pure-isolate-vanille", name: "EAFit Vanilla", grams: 20, kcal: 73.2, prot: 17.2, carbs: 0.7, fat: 0.2 },
      { foodId: "siggis-skyr-nature", name: "Skyr Nature", grams: 50, kcal: 31.5, prot: 5.5, carbs: 2.0, fat: 0.1 },
      { foodId: "fresas-frescas", name: "Fresas Frescas", grams: 50, kcal: 16.0, prot: 0.4, carbs: 3.9, fat: 0.2 }
    ],
    timestamp: "2026-04-19T09:00:00"
  },
  {
    id: "2026-04-19-A02",
    date: "2026-04-19",
    meal: "snack", user: "adriana",
    items: [
      { foodId: "eafit-pure-isolate-chocolat", name: "EAFit Choco", grams: 23, kcal: 81.4, prot: 18.6, carbs: 0.9, fat: 0.4 },
      { foodId: "kefir-lactel-0-bio", name: "Kefir Lactel 0%", grams: 50, kcal: 22.0, prot: 1.7, carbs: 2.1, fat: 0.8 },
      { foodId: "weider-peanut-butter-powder", name: "PB Powder", grams: 3, kcal: 13.2, prot: 1.5, carbs: 0.6, fat: 0.4 },
      { foodId: "banana-fresca", name: "Banano", grams: 44, kcal: 39.2, prot: 0.5, carbs: 10.0, fat: 0.1 },
      { foodId: "cottage-cheese-president", name: "Cottage President (2 tbsp)", grams: 30, kcal: 29.7, prot: 3.6, carbs: 0.8, fat: 1.4 }
    ],
    timestamp: "2026-04-19T11:00:00"
  },
  {
    id: "2026-04-19-A03",
    date: "2026-04-19",
    meal: "almuerzo", user: "adriana",
    items: [
      { foodId: "pizza-margherite-louielouie", name: "Pizza Margherite (1/12)", grams: 25, kcal: 52.5, prot: 1.8, carbs: 7.8, fat: 1.5 },
      { foodId: "pizza-jamon-bigorre-louielouie", name: "Pizza Jamon Bigorre (1/12)", grams: 27.5, kcal: 68.8, prot: 3.0, carbs: 7.4, fat: 2.8 },
      { foodId: "carne-mechada-venezolana", name: "Carne Mechada", grams: 150, kcal: 210.0, prot: 25.5, carbs: 4.5, fat: 9.8 },
      { foodId: "casamiento-arroz-frijoles", name: "Casamiento", grams: 30, kcal: 34.5, prot: 1.2, carbs: 6.6, fat: 0.2 },
      { foodId: "tostones-platano-macho", name: "Tostones (1.5 uds)", grams: 50, units: 1.5, kcal: 140.0, prot: 0.7, carbs: 22.0, fat: 5.5 }
    ],
    timestamp: "2026-04-19T13:00:00"
  },
  {
    id: "2026-04-19-A04",
    date: "2026-04-19",
    meal: "snack", user: "adriana",
    items: [
      { foodId: "alfajor-havanna-chocolate-ddl", name: "Alfajor Havanna (1/2)", grams: 27.5, kcal: 112.5, prot: 1.5, carbs: 16.0, fat: 4.7 }
    ],
    timestamp: "2026-04-19T17:00:00"
  },
  // Adriana - Cena 19/04 - Arepa Reina Pepiada
  {
    id: "2026-04-19-A05",
    date: "2026-04-19",
    meal: "cena", user: "adriana",
    items: [
      { foodId: "pollo-pepiado-zucchini", name: "Pollo Pepiado", grams: 130, kcal: 118.3, prot: 17.3, carbs: 2.3, fat: 4.3 },
      { foodId: "salsa-skyr-cilantro", name: "Salsa de Skyr", grams: 34, kcal: 28.9, prot: 3.4, carbs: 1.4, fat: 1.0 },
      { foodId: "cebolla-salteada", name: "Cebolla Salteada", grams: 16, kcal: 8.0, prot: 0.2, carbs: 1.4, fat: 0.2 },
      { foodId: "cilantro-fresco", name: "Cilantro", grams: 3, kcal: 0.7, prot: 0.1, carbs: 0.1, fat: 0 },
      { foodId: "arepa-maiz-blanco-casera", name: "Arepa Maiz Blanco", grams: 83, kcal: 126.2, prot: 2.9, carbs: 28.2, fat: 0.6 },
      { foodId: "aguacate-fresco", name: "Aguacate", grams: 22, kcal: 35.2, prot: 0.4, carbs: 1.9, fat: 3.2 },
      { foodId: "cottage-cheese-president", name: "Cottage President + Casero (2 tbsp)", grams: 30, kcal: 29.7, prot: 3.6, carbs: 0.8, fat: 1.4 },
      { foodId: "hipro-chocolate-drink", name: "HiPro Choco Drink", grams: 100, kcal: 54.0, prot: 7.2, carbs: 4.0, fat: 0.3 },
      { foodId: "cote-dor-noir-70", name: "Chocolate 70%", grams: 20, kcal: 109.0, prot: 1.6, carbs: 7.0, fat: 8.0 }
    ],
    timestamp: "2026-04-19T20:00:00"
  },
  // === ERNESTO 2026-04-20 ===
  {
    id: "2026-04-20-E01",
    date: "2026-04-20",
    meal: "desayuno", user: "ernesto",
    items: [
      { foodId: "eafit-pure-isolate-vanille", name: "EAFit Vanilla", grams: 40, kcal: 146.4, prot: 34.4, carbs: 1.3, fat: 0.4 },
      { foodId: "leche-almendra", name: "Leche Almendra", grams: 100, kcal: 13.0, prot: 0.4, carbs: 0.2, fat: 1.1 }
    ],
    timestamp: "2026-04-20T09:00:00"
  },
  {
    id: "2026-04-20-E02",
    date: "2026-04-20",
    meal: "almuerzo", user: "ernesto",
    items: [
      { foodId: "pollo-pepiado-zucchini", name: "Pollo Pepiado (ayer)", grams: 180, kcal: 163.8, prot: 23.9, carbs: 3.2, fat: 5.9 },
      { foodId: "arepa-maiz-blanco-casera", name: "Arepa Maiz Blanco", grams: 83, kcal: 126.2, prot: 2.9, carbs: 28.2, fat: 0.6 },
      { foodId: "salsa-skyr-cilantro", name: "Salsa Skyr Cilantro (ayer)", grams: 30, kcal: 25.5, prot: 3.0, carbs: 1.2, fat: 0.9 },
      { foodId: "guacamole-zucchini-limon", name: "Aguacate + Zucchini Mix (ayer)", grams: 30, kcal: 26.4, prot: 0.5, carbs: 1.7, fat: 2.3 }
    ],
    timestamp: "2026-04-20T13:00:00"
  },
  {
    id: "2026-04-20-E03",
    date: "2026-04-20",
    meal: "desayuno", user: "ernesto",
    items: [
      { foodId: "chausson-pommes-boulangerie", name: "Chausson Pommes (1/2)", grams: 70, units: 0.5, kcal: 238.0, prot: 2.5, carbs: 28.0, fat: 12.6 },
      { foodId: "hipro-vanille", name: "HiPro Vanille", grams: 160, units: 1, kcal: 123.2, prot: 16.3, carbs: 9.4, fat: 1.3 }
    ],
    timestamp: "2026-04-20T09:30:00"
  },
  {
    id: "2026-04-20-E04",
    date: "2026-04-20",
    meal: "snack", user: "ernesto",
    items: [
      { foodId: "queso-maduro-espanol", name: "Queso Maduro", grams: 15, kcal: 60.0, prot: 3.8, carbs: 0.1, fat: 5.0 },
      { foodId: "sante-crispy-oat-honey", name: "Galleta Crispy Oat & Honey Santé", grams: 40, units: 1, kcal: 190.0, prot: 3.6, carbs: 24.0, fat: 8.0 }
    ],
    timestamp: "2026-04-20T17:30:00"
  },
  {
    id: "2026-04-20-E05",
    date: "2026-04-20",
    meal: "cena", user: "ernesto",
    items: [
      { foodId: "jamon-porc-fleury-michon", name: "Jamon Porc", grams: 67, kcal: 77.1, prot: 13.4, carbs: 0.7, fat: 2.3 },
      { foodId: "champinones-frescos", name: "Hongos", grams: 70, kcal: 15.4, prot: 2.2, carbs: 2.3, fat: 0.2 },
      { foodId: "huevo-entero", name: "Huevo Entero", grams: 50, units: 1, kcal: 77.5, prot: 6.5, carbs: 0.6, fat: 5.5 },
      { foodId: "clara-huevo", name: "Claras", grams: 66, units: 2, kcal: 34.3, prot: 7.3, carbs: 0.5, fat: 0.1 },
      { foodId: "pollo-pepiado-zucchini", name: "Pollo Pepiado (ayer)", grams: 85, kcal: 77.4, prot: 11.3, carbs: 1.5, fat: 2.8 },
      { foodId: "cottage-cheese-president", name: "Cottage", grams: 55, kcal: 54.5, prot: 6.6, carbs: 1.4, fat: 2.5 },
      { foodId: "tomate-cherry", name: "Tomate Cherry", grams: 75, kcal: 13.5, prot: 0.7, carbs: 2.9, fat: 0.2 },
      { foodId: "queso-maduro-espanol", name: "Queso Viejo Tostado", grams: 7, kcal: 28.0, prot: 1.8, carbs: 0.0, fat: 2.3 },
      { foodId: "wasa-fibre", name: "Wasa Fibre x2", grams: 22.8, units: 2, kcal: 75.9, prot: 3.0, carbs: 10.5, fat: 1.1 }
    ],
    timestamp: "2026-04-20T20:30:00"
  },
  {
    id: "2026-04-20-E06",
    date: "2026-04-20",
    meal: "snack", user: "ernesto",
    items: [
      { foodId: "gerble-cookie-cacao-pepites-ss", name: "Gerblé Cookie Cacao x3", grams: 32.4, units: 3, kcal: 167.8, prot: 2.6, carbs: 19.8, fat: 5.8 }
    ],
    timestamp: "2026-04-20T21:30:00"
  },
  {
    id: "2026-04-20-E07",
    date: "2026-04-20",
    meal: "snack", user: "ernesto",
    items: [
      { foodId: "eafit-pure-isolate-chocolat", name: "EAFit Chocolat (shake compartido, 293/443g)", grams: 49.6, kcal: 175.6, prot: 40.2, carbs: 1.8, fat: 0.8 },
      { foodId: "weider-peanut-butter-powder", name: "PB Powder (shake compartido, 293/443g)", grams: 5.3, kcal: 23.3, prot: 2.6, carbs: 1.0, fat: 0.7 }
    ],
    timestamp: "2026-04-20T22:00:00"
  },
  // === ADRIANA 2026-04-20 ===
  {
    id: "2026-04-20-A01",
    date: "2026-04-20",
    meal: "desayuno", user: "adriana",
    items: [
      { foodId: "hipro-coco", name: "HiPro Coco", grams: 155, kcal: 86.8, prot: 14.6, carbs: 5.7, fat: 0.6 },
      { foodId: "siggis-skyr-nature", name: "Skyr Nature", grams: 145, kcal: 91.4, prot: 16.0, carbs: 5.8, fat: 0.3 },
      { foodId: "blueberries-frescas", name: "Blueberries", grams: 50, kcal: 28.5, prot: 0.4, carbs: 7.3, fat: 0.2 },
      { foodId: "semillas-chia", name: "Chia", grams: 5, kcal: 24.3, prot: 0.9, carbs: 2.1, fat: 1.6 }
    ],
    timestamp: "2026-04-20T09:00:00"
  },
  {
    id: "2026-04-20-A02",
    date: "2026-04-20",
    meal: "almuerzo", user: "adriana",
    items: [
      { foodId: "pollo-pepiado-zucchini", name: "Pollo Pepiado", grams: 120, kcal: 109.2, prot: 16.0, carbs: 2.2, fat: 4.0 },
      { foodId: "salsa-skyr-cilantro", name: "Salsa Skyr (ayer)", grams: 20, kcal: 17.0, prot: 2.0, carbs: 0.8, fat: 0.6 },
      { foodId: "arepa-maiz-blanco-casera", name: "Arepa Maiz Blanco", grams: 83, kcal: 126.2, prot: 2.9, carbs: 28.2, fat: 0.6 }
    ],
    timestamp: "2026-04-20T13:00:00"
  },
  {
    id: "2026-04-20-A03",
    date: "2026-04-20",
    meal: "snack", user: "adriana",
    items: [
      { foodId: "kiwi-fresco", name: "Kiwis x2", grams: 150, units: 2, kcal: 91.5, prot: 1.7, carbs: 22.1, fat: 0.8 },
      { foodId: "cottage-cheese-president", name: "Cottage Casero (2 tbsp)", grams: 30, kcal: 29.7, prot: 3.6, carbs: 0.8, fat: 1.4 },
      { foodId: "queso-maduro-espanol", name: "Queso Maduro", grams: 15, kcal: 60.0, prot: 3.8, carbs: 0.1, fat: 5.0 },
      { foodId: "siggis-skyr-nature", name: "Skyr Nature", grams: 100, kcal: 63.0, prot: 11.0, carbs: 4.0, fat: 0.2 },
      { foodId: "miel-abeja", name: "Miel (1/2 tsp)", grams: 2.5, kcal: 7.6, prot: 0.0, carbs: 2.1, fat: 0.0 },
      { foodId: "blueberries-frescas", name: "Blueberries", grams: 20, kcal: 11.4, prot: 0.1, carbs: 2.9, fat: 0.1 }
    ],
    timestamp: "2026-04-20T17:00:00"
  },
  {
    id: "2026-04-20-A04",
    date: "2026-04-20",
    meal: "cena", user: "adriana",
    items: [
      { foodId: "jamon-porc-fleury-michon", name: "Jamon Porc", grams: 56, kcal: 64.4, prot: 11.2, carbs: 0.6, fat: 2.0 },
      { foodId: "champinones-frescos", name: "Hongos Salteados", grams: 56, kcal: 12.3, prot: 1.7, carbs: 1.8, fat: 0.2 },
      { foodId: "huevo-entero", name: "Huevo Entero", grams: 50, units: 1, kcal: 77.5, prot: 6.5, carbs: 0.6, fat: 5.5 },
      { foodId: "clara-huevo", name: "Clara", grams: 33, units: 1, kcal: 17.2, prot: 3.6, carbs: 0.2, fat: 0.1 },
      { foodId: "cottage-cheese-president", name: "Cottage", grams: 60, kcal: 59.4, prot: 7.2, carbs: 1.5, fat: 2.7 },
      { foodId: "tomate-cherry", name: "Tomate Cherry", grams: 46, kcal: 8.3, prot: 0.4, carbs: 1.8, fat: 0.1 },
      { foodId: "queso-maduro-espanol", name: "Queso Viejo Tostado", grams: 7, kcal: 28.0, prot: 1.8, carbs: 0.0, fat: 2.3 }
    ],
    timestamp: "2026-04-20T20:30:00"
  },
  {
    id: "2026-04-20-A05",
    date: "2026-04-20",
    meal: "snack", user: "adriana",
    items: [
      { foodId: "eafit-pure-isolate-chocolat", name: "EAFit Chocolat (shake compartido, 150/443g)", grams: 25.4, kcal: 89.9, prot: 20.6, carbs: 0.9, fat: 0.4 },
      { foodId: "weider-peanut-butter-powder", name: "PB Powder (shake compartido, 150/443g)", grams: 2.7, kcal: 11.9, prot: 1.3, carbs: 0.5, fat: 0.4 }
    ],
    timestamp: "2026-04-20T22:00:00"
  },
  // === ERNESTO 2026-04-21 ===
  {
    id: "2026-04-21-E01",
    date: "2026-04-21",
    meal: "desayuno", user: "ernesto",
    items: [
      { foodId: "hipro-coco", name: "HiPro Coco", grams: 160, units: 1, kcal: 89.6, prot: 15.0, carbs: 5.9, fat: 0.6 },
      { foodId: "eafit-pure-isolate-chocolat", name: "EAFit Isolate Chocolat", grams: 30, kcal: 106.2, prot: 24.3, carbs: 1.1, fat: 0.5 }
    ],
    timestamp: "2026-04-21T09:00:00"
  },
  {
    id: "2026-04-21-E02",
    date: "2026-04-21",
    meal: "almuerzo", user: "ernesto",
    items: [
      { foodId: "pollo-pepiado-zucchini", name: "Pollo Pepiado (ayer)", grams: 180, kcal: 163.8, prot: 23.9, carbs: 3.2, fat: 5.9 },
      { foodId: "brocoli-cuit", name: "Brocoli", grams: 130, kcal: 45.5, prot: 3.9, carbs: 5.2, fat: 0.5 },
      { foodId: "tomate-cherry", name: "Tomate Cherry", grams: 50, kcal: 9.0, prot: 0.5, carbs: 2.0, fat: 0.1 },
      { foodId: "arepa-maiz-blanco-casera", name: "Arepa Maiz Blanco", grams: 120, kcal: 182.4, prot: 4.2, carbs: 40.8, fat: 0.8 }
    ],
    timestamp: "2026-04-21T13:30:00"
  },
  {
    id: "2026-04-21-E03",
    date: "2026-04-21",
    meal: "snack", user: "ernesto",
    items: [
      { foodId: "blueberries-frescas", name: "Blueberries", grams: 50, kcal: 28.5, prot: 0.4, carbs: 7.3, fat: 0.2 },
      { foodId: "gerble-cookie-cacao-pepites-ss", name: "Gerblé Cookie Cacao x3", grams: 32.4, units: 3, kcal: 167.8, prot: 2.6, carbs: 19.8, fat: 5.8 },
      { foodId: "cafe-negro", name: "Café Negro (sin azucar)", grams: 240, units: 1, kcal: 4.8, prot: 0.2, carbs: 0, fat: 0 }
    ],
    timestamp: "2026-04-21T16:00:00"
  },
  {
    id: "2026-04-21-E04",
    date: "2026-04-21",
    meal: "snack", user: "ernesto",
    items: [
      { foodId: "odyssee-salade-thon-intermarche", name: "Odyssée Salade au Thon", grams: 70, kcal: 87.5, prot: 5.3, carbs: 7.0, fat: 4.2 },
      { foodId: "eafit-pure-isolate-vanille", name: "EAFit Isolate Vanille", grams: 44, kcal: 161.0, prot: 37.8, carbs: 1.5, fat: 0.4 },
      { foodId: "kefir-lactel-0-bio", name: "Kéfir Lactel 0%", grams: 50, kcal: 22.0, prot: 1.7, carbs: 2.1, fat: 0.8 },
      { foodId: "siggis-skyr-nature", name: "Skyr Siggis Nature", grams: 50, kcal: 31.5, prot: 5.5, carbs: 2.0, fat: 0.1 },
      { foodId: "fruits-rouges-mix", name: "Fruits Rouges Surgelés Picard", grams: 100, kcal: 40.0, prot: 0.8, carbs: 9.0, fat: 0.3 }
    ],
    timestamp: "2026-04-21T18:00:00"
  },
  {
    id: "2026-04-21-E05",
    date: "2026-04-21",
    meal: "cena", user: "ernesto",
    items: [
      { foodId: "huevo-entero", name: "Huevo Entero", grams: 50, units: 1, kcal: 77.5, prot: 6.5, carbs: 0.6, fat: 5.5 },
      { foodId: "clara-huevo", name: "Claras x2", grams: 66, units: 2, kcal: 34.3, prot: 7.3, carbs: 0.5, fat: 0.1 },
      { foodId: "jamon-porc-fleury-michon", name: "Jambon de Porc", grams: 76, kcal: 87.4, prot: 15.2, carbs: 0.8, fat: 2.7 },
      { foodId: "baguette-croustigraine-ounissi", name: "Baguette Croustigraine Ounissi", grams: 48, kcal: 134.4, prot: 4.8, carbs: 24.0, fat: 1.4 },
      { foodId: "queso-maduro-espanol", name: "Queso Maduro", grams: 15, kcal: 60.0, prot: 3.8, carbs: 0.1, fat: 5.0 }
    ],
    timestamp: "2026-04-21T20:30:00"
  },
  {
    id: "2026-04-21-E06",
    date: "2026-04-21",
    meal: "snack", user: "ernesto",
    items: [
      { foodId: "eafit-pure-isolate-vanille", name: "EAFit Isolate Vanille (ajuste prot)", grams: 31, kcal: 113.5, prot: 26.7, carbs: 1.0, fat: 0.3 }
    ],
    timestamp: "2026-04-21T21:30:00"
  },
  // === ADRIANA 2026-04-21 ===
  {
    id: "2026-04-21-A01",
    date: "2026-04-21",
    meal: "desayuno", user: "adriana",
    items: [
      { foodId: "kefir-lactel-0-bio", name: "Kefir Lactel 0% Bio", grams: 200, kcal: 88.0, prot: 6.8, carbs: 8.2, fat: 3.0 },
      { foodId: "eafit-pure-isolate-vanille", name: "EAFit Isolate Vanille", grams: 27, kcal: 98.8, prot: 23.2, carbs: 0.9, fat: 0.2 },
      { foodId: "banana-fresca", name: "Banano", grams: 60, kcal: 53.4, prot: 0.7, carbs: 13.7, fat: 0.2 },
      { foodId: "blueberries-frescas", name: "Blueberries", grams: 53, kcal: 30.2, prot: 0.4, carbs: 7.7, fat: 0.2 }
    ],
    timestamp: "2026-04-21T09:00:00"
  },
  {
    id: "2026-04-21-A02",
    date: "2026-04-21",
    meal: "almuerzo", user: "adriana",
    items: [
      { foodId: "pollo-pepiado-zucchini", name: "Pollo Pepiado", grams: 120, kcal: 109.2, prot: 16.0, carbs: 2.2, fat: 4.0 },
      { foodId: "salsa-skyr-cilantro", name: "Salsa Skyr (ayer)", grams: 20, kcal: 17.0, prot: 2.0, carbs: 0.8, fat: 0.6 },
      { foodId: "arepa-maiz-blanco-casera", name: "Arepa Maiz Blanco", grams: 83, kcal: 126.2, prot: 2.9, carbs: 28.2, fat: 0.6 },
      { foodId: "tomate-cherry", name: "Tomate Cherry", grams: 60, kcal: 10.8, prot: 0.5, carbs: 2.3, fat: 0.1 },
      { foodId: "brocoli-cuit", name: "Brocoli", grams: 73, kcal: 25.6, prot: 2.2, carbs: 2.9, fat: 0.3 }
    ],
    timestamp: "2026-04-21T13:00:00"
  },
  {
    id: "2026-04-21-A03",
    date: "2026-04-21",
    meal: "snack", user: "adriana",
    items: [
      { foodId: "kiwi-fresco", name: "Kiwi", grams: 75, units: 1, kcal: 45.8, prot: 0.8, carbs: 11.0, fat: 0.4 },
      { foodId: "eafit-pure-isolate-vanille", name: "EAFit Isolate Vanille", grams: 20, kcal: 73.2, prot: 17.2, carbs: 0.7, fat: 0.2 },
      { foodId: "weider-peanut-butter-powder", name: "PB Powder", grams: 4, kcal: 17.6, prot: 2.0, carbs: 0.8, fat: 0.5 },
      { foodId: "kefir-lactel-0-bio", name: "Kéfir Lactel 0%", grams: 44, kcal: 19.4, prot: 1.5, carbs: 1.8, fat: 0.7 },
      { foodId: "siggis-skyr-nature", name: "Skyr Siggis Nature", grams: 43, kcal: 27.1, prot: 4.7, carbs: 1.7, fat: 0.1 },
      { foodId: "cote-dor-noir-70", name: "Chocolat Noir 70%", grams: 10, kcal: 54.5, prot: 0.8, carbs: 3.5, fat: 4.0 }
    ],
    timestamp: "2026-04-21T17:00:00"
  },
  {
    id: "2026-04-21-A04",
    date: "2026-04-21",
    meal: "cena", user: "adriana",
    items: [
      { foodId: "huevo-entero", name: "Huevo Entero", grams: 50, units: 1, kcal: 77.5, prot: 6.5, carbs: 0.6, fat: 5.5 },
      { foodId: "jamon-porc-fleury-michon", name: "Jambon de Porc", grams: 43, kcal: 49.5, prot: 8.6, carbs: 0.4, fat: 1.5 },
      { foodId: "baguette-croustigraine-ounissi", name: "Baguette Croustigraine Ounissi", grams: 45, kcal: 126.0, prot: 4.5, carbs: 22.5, fat: 1.4 },
      { foodId: "queso-maduro-espanol", name: "Queso Maduro", grams: 15, kcal: 60.0, prot: 3.8, carbs: 0.1, fat: 5.0 }
    ],
    timestamp: "2026-04-21T20:30:00"
  },
  // === ERNESTO 2026-04-22 ===
  {
    id: "2026-04-22-E01",
    date: "2026-04-22",
    meal: "desayuno", user: "ernesto",
    items: [
      { foodId: "pain-baguette", name: "Pan Baguette", grams: 79, kcal: 216.5, prot: 6.7, carbs: 43.5, fat: 1.0 },
      { foodId: "salsa-skyr-cilantro", name: "Salsa Skyr", grams: 15, kcal: 12.8, prot: 1.5, carbs: 0.6, fat: 0.5 },
      { foodId: "pollo-pechuga-horneada", name: "Pollo Hervido y Salteado", grams: 130, kcal: 214.5, prot: 40.3, carbs: 0, fat: 4.7 },
      { foodId: "vegetales-mixtos-tomate-chile-hojas", name: "Vegetales (tomate, chile, hojas)", grams: 80, kcal: 20.0, prot: 1.0, carbs: 4.0, fat: 0.2 },
      { foodId: "cottage-cheese-president", name: "Cottage Cheese", grams: 35, kcal: 34.7, prot: 4.2, carbs: 0.9, fat: 1.6 },
      { foodId: "klm-macaron-coco", name: "Macaron Coco KLM (entero)", grams: 80, kcal: 368.0, prot: 3.2, carbs: 50.4, fat: 16.8 }
    ],
    timestamp: "2026-04-22T09:00:00"
  },
  {
    id: "2026-04-22-E02",
    date: "2026-04-22",
    meal: "almuerzo", user: "ernesto",
    items: [
      { foodId: "pain-baguette", name: "Pan Sandwich (1/2)", grams: 70, kcal: 191.8, prot: 6.0, carbs: 38.5, fat: 0.9 },
      { foodId: "pollo-pechuga-horneada", name: "Pollo sandwich", grams: 40, kcal: 66.0, prot: 12.4, carbs: 0, fat: 1.4 },
      { foodId: "pesto-generico", name: "Pesto (poco)", grams: 10, kcal: 40.0, prot: 0.4, carbs: 0.5, fat: 3.9 },
      { foodId: "tomate-fresco", name: "Tomate", grams: 20, kcal: 3.6, prot: 0.2, carbs: 0.8, fat: 0 },
      { foodId: "arugula-fresca", name: "Arugula sandwich", grams: 10, kcal: 2.5, prot: 0.3, carbs: 0.4, fat: 0.1 },
      { foodId: "pan-panini-delgado", name: "Pan Panini (1/2)", grams: 50, kcal: 140.0, prot: 4.5, carbs: 25.0, fat: 1.5 },
      { foodId: "queso-cabra-fresco", name: "Queso Cabra Fresco", grams: 25, kcal: 75.0, prot: 4.8, carbs: 0.3, fat: 6.3 },
      { foodId: "arugula-fresca", name: "Arugula panini", grams: 5, kcal: 1.3, prot: 0.1, carbs: 0.2, fat: 0 },
      { foodId: "miel-abeja", name: "Miel de Abeja (poco)", grams: 5, kcal: 15.2, prot: 0, carbs: 4.1, fat: 0 },
      { foodId: "nueces-enteras", name: "Nueces", grams: 8, units: 2, kcal: 52.3, prot: 1.2, carbs: 1.1, fat: 5.2 },
      { foodId: "tarta-manzana-amsterdam-crumble", name: "Tarta Manzana Amsterdam (1/2)", grams: 100, kcal: 250.0, prot: 3.0, carbs: 30.0, fat: 12.0 },
      { foodId: "nata-chantilly", name: "Nata Chantilly", grams: 20, kcal: 50.0, prot: 0.4, carbs: 0.6, fat: 5.0 }
    ],
    timestamp: "2026-04-22T13:30:00"
  },
  {
    id: "2026-04-22-E03",
    date: "2026-04-22",
    meal: "cena", user: "ernesto",
    items: [
      { foodId: "mcdonalds-mccrispy-chicken", name: "Chicken McCrispy", grams: 205, units: 1, kcal: 470.0, prot: 27.0, carbs: 45.0, fat: 20.0 },
      { foodId: "mcdonalds-papas-large", name: "Papas Large (1/2)", grams: 75, kcal: 234.0, prot: 2.6, carbs: 30.8, fat: 11.3 },
      { foodId: "mcdonalds-cheesestick", name: "Cheese Sticks x2", grams: 54, units: 2, kcal: 134.0, prot: 5.9, carbs: 11.9, fat: 6.5 },
      { foodId: "mcdonalds-sweet-sour-sauce", name: "Sweet & Sour (1/2)", grams: 12.5, kcal: 23.0, prot: 0.1, carbs: 5.4, fat: 0.1 },
      { foodId: "mcdonalds-ketchup-sachet", name: "Ketchup (2/3 sobre)", grams: 6.7, kcal: 6.7, prot: 0.1, carbs: 1.6, fat: 0 },
      { foodId: "coca-cola-zero", name: "Coca-Cola Zero", grams: 330, kcal: 1.3, prot: 0, carbs: 0, fat: 0 },
      { foodId: "pollo-pechuga-horneada", name: "Pollo Hervido extra", grams: 80, kcal: 132.0, prot: 24.8, carbs: 0, fat: 2.9 }
    ],
    timestamp: "2026-04-22T20:00:00"
  },
  {
    id: "2026-04-22-E04",
    date: "2026-04-22",
    meal: "snack", user: "ernesto",
    items: [
      { foodId: "eafit-pure-isolate-vanille", name: "EAFit Isolate Vanille", grams: 40, kcal: 146.4, prot: 34.4, carbs: 1.3, fat: 0.4 },
      { foodId: "heineken-biere", name: "Heineken 500ml", grams: 500, kcal: 210.0, prot: 2.5, carbs: 16.0, fat: 0 }
    ],
    timestamp: "2026-04-22T21:30:00"
  },
  // === ADRIANA 2026-04-22 ===
  {
    id: "2026-04-22-A01",
    date: "2026-04-22",
    meal: "desayuno", user: "adriana",
    items: [
      { foodId: "pain-baguette", name: "Pan Baguette", grams: 71, kcal: 194.5, prot: 6.0, carbs: 39.1, fat: 0.9 },
      { foodId: "salsa-skyr-cilantro", name: "Salsa Skyr", grams: 10, kcal: 8.5, prot: 1.0, carbs: 0.4, fat: 0.3 },
      { foodId: "pollo-pechuga-horneada", name: "Pollo Hervido y Salteado", grams: 100, kcal: 165.0, prot: 31.0, carbs: 0, fat: 3.6 },
      { foodId: "vegetales-mixtos-tomate-chile-hojas", name: "Vegetales (tomate, chile, hojas)", grams: 60, kcal: 15.0, prot: 0.7, carbs: 3.0, fat: 0.1 },
      { foodId: "cottage-cheese-president", name: "Cottage Cheese", grams: 35, kcal: 34.7, prot: 4.2, carbs: 0.9, fat: 1.6 },
      { foodId: "klm-macaron-coco", name: "Macaron Coco KLM (entero)", grams: 80, kcal: 368.0, prot: 3.2, carbs: 50.4, fat: 16.8 }
    ],
    timestamp: "2026-04-22T09:00:00"
  },
  {
    id: "2026-04-22-A02",
    date: "2026-04-22",
    meal: "almuerzo", user: "adriana",
    items: [
      { foodId: "pain-baguette", name: "Pan Sandwich (1/2)", grams: 70, kcal: 191.8, prot: 6.0, carbs: 38.5, fat: 0.9 },
      { foodId: "pollo-pechuga-horneada", name: "Pollo sandwich", grams: 40, kcal: 66.0, prot: 12.4, carbs: 0, fat: 1.4 },
      { foodId: "pesto-generico", name: "Pesto (poco)", grams: 10, kcal: 40.0, prot: 0.4, carbs: 0.5, fat: 3.9 },
      { foodId: "tomate-fresco", name: "Tomate", grams: 20, kcal: 3.6, prot: 0.2, carbs: 0.8, fat: 0 },
      { foodId: "arugula-fresca", name: "Arugula sandwich", grams: 10, kcal: 2.5, prot: 0.3, carbs: 0.4, fat: 0.1 },
      { foodId: "pan-panini-delgado", name: "Pan Panini (1/2)", grams: 50, kcal: 140.0, prot: 4.5, carbs: 25.0, fat: 1.5 },
      { foodId: "queso-cabra-fresco", name: "Queso Cabra Fresco", grams: 25, kcal: 75.0, prot: 4.8, carbs: 0.3, fat: 6.3 },
      { foodId: "arugula-fresca", name: "Arugula panini", grams: 5, kcal: 1.3, prot: 0.1, carbs: 0.2, fat: 0 },
      { foodId: "miel-abeja", name: "Miel de Abeja (poco)", grams: 5, kcal: 15.2, prot: 0, carbs: 4.1, fat: 0 },
      { foodId: "nueces-enteras", name: "Nueces", grams: 8, units: 2, kcal: 52.3, prot: 1.2, carbs: 1.1, fat: 5.2 },
      { foodId: "tarta-manzana-amsterdam-crumble", name: "Tarta Manzana Amsterdam (1/2)", grams: 100, kcal: 250.0, prot: 3.0, carbs: 30.0, fat: 12.0 },
      { foodId: "nata-chantilly", name: "Nata Chantilly", grams: 20, kcal: 50.0, prot: 0.4, carbs: 0.6, fat: 5.0 },
      { foodId: "lipton-ice-tea-low-sugar", name: "Lipton Ice Tea Low Sugar 200ml", grams: 200, kcal: 36.0, prot: 0, carbs: 8.6, fat: 0 }
    ],
    timestamp: "2026-04-22T13:30:00"
  },
  {
    id: "2026-04-22-A03",
    date: "2026-04-22",
    meal: "cena", user: "adriana",
    items: [
      { foodId: "mcdonalds-royal-cheese", name: "Royal Cheese (1/4 Pounder)", grams: 195, units: 1, kcal: 520.0, prot: 30.0, carbs: 40.0, fat: 26.0 },
      { foodId: "mcdonalds-papas-large", name: "Papas Large (1/2)", grams: 75, kcal: 234.0, prot: 2.6, carbs: 30.8, fat: 11.3 },
      { foodId: "mcdonalds-cheesestick", name: "Cheese Sticks x2", grams: 54, units: 2, kcal: 134.0, prot: 5.9, carbs: 11.9, fat: 6.5 },
      { foodId: "mcdonalds-sweet-sour-sauce", name: "Sweet & Sour (1/2)", grams: 12.5, kcal: 23.0, prot: 0.1, carbs: 5.4, fat: 0.1 },
      { foodId: "mcdonalds-ketchup-sachet", name: "Ketchup (2/3 sobre)", grams: 6.7, kcal: 6.7, prot: 0.1, carbs: 1.6, fat: 0 }
    ],
    timestamp: "2026-04-22T20:00:00"
  },
  {
    id: "2026-04-22-A04",
    date: "2026-04-22",
    meal: "snack", user: "adriana",
    items: [
      { foodId: "fuze-tea-the-vert", name: "Fuze Tea Thé Vert 330ml", grams: 330, kcal: 59.4, prot: 0, carbs: 14.5, fat: 0 }
    ],
    timestamp: "2026-04-22T17:00:00"
  },
  // === ERNESTO 2026-04-23 ===
  {
    id: "2026-04-23-E01",
    date: "2026-04-23",
    meal: "desayuno", user: "ernesto",
    items: [
      { foodId: "hipro-coco", name: "HiPro Coco", grams: 160, units: 1, kcal: 89.6, prot: 15.0, carbs: 5.9, fat: 0.6 },
      { foodId: "eafit-pure-isolate-chocolat", name: "EAFit Isolate Chocolat", grams: 30, kcal: 106.2, prot: 24.3, carbs: 1.1, fat: 0.5 },
      { foodId: "zuivelhoeve-boern-yoghurt", name: "Zuivelhoeve Boer'n Yoghurt (1/3 pot)", grams: 167, kcal: 90.2, prot: 6.2, carbs: 7.2, fat: 4.2 }
    ],
    timestamp: "2026-04-23T09:00:00"
  },
  {
    id: "2026-04-23-A01",
    date: "2026-04-23",
    meal: "desayuno", user: "adriana",
    items: [
      { foodId: "hipro-coco", name: "HiPro Coco", grams: 160, units: 1, kcal: 89.6, prot: 15.0, carbs: 5.9, fat: 0.6 }
    ],
    timestamp: "2026-04-23T09:00:00"
  },
  {
    id: "2026-04-23-E02",
    date: "2026-04-23",
    meal: "almuerzo", user: "ernesto",
    items: [
      { foodId: "papas-ambacht-frites-artesanales", name: "Frites Papa's Ambacht (Large+Regular /2)", grams: 275, kcal: 962.5, prot: 11.0, carbs: 115.5, fat: 49.5 },
      { foodId: "queso-dutch-oud-amsterdam", name: "Queso Dutch Oud (compartido /2)", grams: 15, kcal: 57.0, prot: 4.2, carbs: 0, fat: 4.5 },
      { foodId: "salsa-trufa-parmesan", name: "Salsa Trufa Parmesano (compartido /2)", grams: 20, kcal: 90.0, prot: 0.6, carbs: 1.0, fat: 9.2 },
      { foodId: "mayo-picante", name: "Mayo Picante (compartido /2)", grams: 20, kcal: 130.0, prot: 0.2, carbs: 0.4, fat: 14.0 },
      { foodId: "ketchup-generico", name: "Ketchup (compartido /2)", grams: 20, kcal: 20.0, prot: 0.2, carbs: 4.8, fat: 0 },
      { foodId: "muffin-blueberry-artesanal", name: "Muffin Blueberry Artesanal", grams: 125, kcal: 462.5, prot: 6.3, carbs: 68.8, fat: 17.5 }
    ],
    timestamp: "2026-04-23T13:30:00"
  },
  {
    id: "2026-04-23-A02",
    date: "2026-04-23",
    meal: "almuerzo", user: "adriana",
    items: [
      { foodId: "papas-ambacht-frites-artesanales", name: "Frites Papa's Ambacht (Large+Regular /2)", grams: 275, kcal: 962.5, prot: 11.0, carbs: 115.5, fat: 49.5 },
      { foodId: "queso-dutch-oud-amsterdam", name: "Queso Dutch Oud (compartido /2)", grams: 15, kcal: 57.0, prot: 4.2, carbs: 0, fat: 4.5 },
      { foodId: "salsa-trufa-parmesan", name: "Salsa Trufa Parmesano (compartido /2)", grams: 20, kcal: 90.0, prot: 0.6, carbs: 1.0, fat: 9.2 },
      { foodId: "mayo-picante", name: "Mayo Picante (compartido /2)", grams: 20, kcal: 130.0, prot: 0.2, carbs: 0.4, fat: 14.0 },
      { foodId: "ketchup-generico", name: "Ketchup (compartido /2)", grams: 20, kcal: 20.0, prot: 0.2, carbs: 4.8, fat: 0 },
      { foodId: "muffin-chocolate-artesanal", name: "Muffin Chocolate Artesanal", grams: 125, kcal: 525.0, prot: 6.3, carbs: 67.5, fat: 25.0 }
    ],
    timestamp: "2026-04-23T13:30:00"
  },
  {
    id: "2026-04-23-E03",
    date: "2026-04-23",
    meal: "snack", user: "ernesto",
    items: [
      { foodId: "poffertjes-mini-dutch", name: "Mini Poffertjes x10", grams: 80, units: 10, kcal: 272.0, prot: 4.0, carbs: 38.4, fat: 10.4 },
      { foodId: "salsa-pistacho", name: "Salsa Pistacho", grams: 20, kcal: 100.0, prot: 1.6, carbs: 8.0, fat: 7.0 },
      { foodId: "salsa-kinder-bueno", name: "Salsa Kinder Bueno", grams: 20, kcal: 112.0, prot: 1.4, carbs: 11.0, fat: 7.2 },
      { foodId: "cafe-negro", name: "Café Americano", grams: 240, units: 1, kcal: 4.8, prot: 0.2, carbs: 0, fat: 0 }
    ],
    timestamp: "2026-04-23T17:00:00"
  },
  {
    id: "2026-04-23-E04",
    date: "2026-04-23",
    meal: "cena", user: "ernesto",
    items: [
      { foodId: "sopa-thai-mariscos-picante", name: "Sopa Thai Picante Mariscos", grams: 300, kcal: 150.0, prot: 12.0, carbs: 12.0, fat: 4.5 },
      { foodId: "coca-cola-zero", name: "Coca-Cola Zero", grams: 330, kcal: 1.3, prot: 0, carbs: 0, fat: 0 },
      { foodId: "arroz-basmati-cocido", name: "Arroz Basmati", grams: 60, kcal: 78.0, prot: 1.6, carbs: 16.8, fat: 0.2 },
      { foodId: "thai-carne-vegetales-maranon-hongos", name: "Thai Carne con Vegetales, Marañón y Hongos", grams: 120, kcal: 216.0, prot: 16.8, carbs: 12.0, fat: 12.0 }
    ],
    timestamp: "2026-04-23T20:30:00"
  },
  {
    id: "2026-04-23-A03",
    date: "2026-04-23",
    meal: "cena", user: "adriana",
    items: [
      { foodId: "sopa-thai-mariscos-picante", name: "Sopa Thai Picante Mariscos", grams: 300, kcal: 150.0, prot: 12.0, carbs: 12.0, fat: 4.5 },
      { foodId: "arroz-basmati-cocido", name: "Arroz Basmati", grams: 60, kcal: 78.0, prot: 1.6, carbs: 16.8, fat: 0.2 },
      { foodId: "thai-carne-vegetales-maranon-hongos", name: "Thai Carne con Vegetales, Marañón y Hongos", grams: 120, kcal: 216.0, prot: 16.8, carbs: 12.0, fat: 12.0 }
    ],
    timestamp: "2026-04-23T20:30:00"
  },
  {
    id: "2026-04-23-E05",
    date: "2026-04-23",
    meal: "snack", user: "ernesto",
    items: [
      { foodId: "eafit-pure-isolate-vanille", name: "EAFit Isolate Vanille", grams: 40, kcal: 146.4, prot: 34.4, carbs: 1.3, fat: 0.4 }
    ],
    timestamp: "2026-04-23T22:00:00"
  },
  // === ERNESTO 2026-04-24 ===
  {
    id: "2026-04-24-E01",
    date: "2026-04-24",
    meal: "desayuno", user: "ernesto",
    items: [
      { foodId: "hipro-banana-drink", name: "HiPro Banana Drink (botella 345ml, 25g prot)", grams: 345, kcal: 186.3, prot: 24.8, carbs: 13.8, fat: 1.0 },
      { foodId: "eafit-pure-isolate-vanille", name: "EAFit Isolate Vanille", grams: 40, kcal: 146.4, prot: 34.4, carbs: 1.3, fat: 0.4 }
    ],
    timestamp: "2026-04-24T09:00:00"
  },
  {
    id: "2026-04-24-E02",
    date: "2026-04-24",
    meal: "almuerzo", user: "ernesto",
    items: [
      { foodId: "te-verde-menta", name: "Té Verde con Menta", grams: 250, kcal: 2.5, prot: 0, carbs: 0, fat: 0 },
      { foodId: "ensalada-thai-peanut-mango-satay-oliver-green", name: "Ensalada Thai Peanut Mango Satay (Oliver Green)", grams: 500, kcal: 650.0, prot: 42.5, carbs: 55.0, fat: 30.0 }
    ],
    timestamp: "2026-04-24T13:30:00"
  },
  {
    id: "2026-04-24-E03",
    date: "2026-04-24",
    meal: "snack", user: "ernesto",
    items: [
      { foodId: "stroopwafel-rudi-chocolate-negro", name: "Stroopwafel Rudi con Chocolate Negro", grams: 40, units: 1, kcal: 192.0, prot: 2.4, carbs: 26.0, fat: 8.8 }
    ],
    timestamp: "2026-04-24T17:00:00"
  },
  {
    id: "2026-04-24-E04",
    date: "2026-04-24",
    meal: "cena", user: "ernesto",
    items: [
      { foodId: "frites-pareltje-amsterdam", name: "Large Frites 't Pareltje (5oz)", grams: 142, kcal: 497.0, prot: 5.7, carbs: 59.6, fat: 25.6 },
      { foodId: "mayo-trufa", name: "Mayo Trufa (1/3)", grams: 17, kcal: 76.5, prot: 0.5, carbs: 0.9, fat: 7.8 },
      { foodId: "ketchup-generico", name: "Ketchup (1/3)", grams: 17, kcal: 17.0, prot: 0.2, carbs: 4.1, fat: 0 },
      { foodId: "parmesano-rayado", name: "Parmesano Rallado", grams: 10, kcal: 39.2, prot: 3.6, carbs: 0, fat: 2.8 },
      { foodId: "ensalada-ah-linzen-kikkererwten-geitenkaas", name: "Ensalada AH Linzen + Kikkererwten + Geitenkaas", grams: 220, kcal: 308.0, prot: 15.4, carbs: 30.8, fat: 13.2 }
    ],
    timestamp: "2026-04-24T20:30:00"
  },
  // === ERNESTO 2026-04-25 ===
  {
    id: "2026-04-25-E01",
    date: "2026-04-25",
    meal: "desayuno", user: "ernesto",
    items: [
      { foodId: "zuivelhoeve-stevige-trek", name: "Zuivelhoeve Stevige Trek con Granola (pot grande)", grams: 200, units: 1, kcal: 270.0, prot: 10.0, carbs: 34.0, fat: 9.0 }
    ],
    timestamp: "2026-04-25T09:30:00"
  },
  {
    id: "2026-04-25-E02",
    date: "2026-04-25",
    meal: "almuerzo", user: "ernesto",
    items: [
      { foodId: "van-stapele-cookie", name: "Van Stapele Cookie x2", grams: 160, units: 2, kcal: 800.0, prot: 8.0, carbs: 80.0, fat: 44.8 },
      { foodId: "subway-sweet-onion-chicken-teriyaki-15cm", name: "Subway Sweet Onion Chicken Teriyaki 15cm (pan sésamo)", grams: 245, units: 1, kcal: 370.0, prot: 27.0, carbs: 60.0, fat: 4.5 }
    ],
    timestamp: "2026-04-25T13:30:00"
  },
  {
    id: "2026-04-25-E03",
    date: "2026-04-25",
    meal: "snack", user: "ernesto",
    items: [
      { foodId: "tres-leches-tiramisu-amsterdam", name: "Tres Leches Tiramisu (De Beste Lekkernij Herenstraat)", grams: 120, units: 1, kcal: 336.0, prot: 5.4, carbs: 36.0, fat: 18.0 },
      { foodId: "papas-ambacht-frites-artesanales", name: "Frites Regular 1/2 (compartidas)", grams: 75, kcal: 262.5, prot: 3.0, carbs: 31.5, fat: 13.5 },
      { foodId: "mayo-trufa", name: "Mayo Trufa (poquito)", grams: 10, kcal: 45.0, prot: 0.3, carbs: 0.5, fat: 4.6 }
    ],
    timestamp: "2026-04-25T17:30:00"
  },
  {
    id: "2026-04-25-E04",
    date: "2026-04-25",
    meal: "cena", user: "ernesto",
    items: [
      { foodId: "zaanlander-48-cheese", name: "Queso Zaanlander +48 (2.5 rodajas)", grams: 50, units: 2.5, kcal: 210.0, prot: 13.5, carbs: 0, fat: 17.5 },
      { foodId: "pollo-salteado", name: "Pollo Salteado", grams: 200, kcal: 360.0, prot: 62.0, carbs: 0, fat: 12.0 },
      { foodId: "bolletje-pan-amsterdam-semillas", name: "Bol Pan Amsterdam con Semillas", grams: 80, units: 1, kcal: 216.0, prot: 7.2, carbs: 32.0, fat: 5.6 },
      { foodId: "coca-cola-zero", name: "Coca-Cola Zero", grams: 330, kcal: 1.3, prot: 0, carbs: 0, fat: 0 }
    ],
    timestamp: "2026-04-25T21:00:00"
  },
  // === ERNESTO 2026-04-26 ===
  {
    id: "2026-04-26-E01",
    date: "2026-04-26",
    meal: "desayuno", user: "ernesto",
    items: [
      { foodId: "hipro-vanille", name: "HiPro Vanille (1 pot)", grams: 160, units: 1, kcal: 123.2, prot: 16.3, carbs: 9.4, fat: 1.3 },
      { foodId: "frambuesas-fresas", name: "Frambuesas", grams: 20, kcal: 10.4, prot: 0.2, carbs: 2.4, fat: 0.1 }
    ],
    timestamp: "2026-04-26T09:30:00"
  },
  {
    id: "2026-04-26-E02",
    date: "2026-04-26",
    meal: "snack", user: "ernesto",
    items: [
      { foodId: "gerble-cookie-cacao-pepites-ss", name: "Gerblé Cookie Cacao Pépites Sans Sucres x3", grams: 32.4, units: 3, kcal: 167.8, prot: 2.6, carbs: 19.8, fat: 5.8 }
    ],
    timestamp: "2026-04-26T11:30:00"
  },
  {
    id: "2026-04-26-E03",
    date: "2026-04-26",
    meal: "almuerzo", user: "ernesto",
    items: [
      { foodId: "carne-mechada", name: "Carne Mechada", grams: 250, kcal: 475.0, prot: 55.0, carbs: 10.0, fat: 22.5 },
      { foodId: "pain-baguette", name: "Pain Baguette", grams: 40, kcal: 109.6, prot: 3.4, carbs: 22.0, fat: 0.5 },
      { foodId: "zaanlander-48-cheese", name: "Queso Zaanlander +48 (1.5 rodajas)", grams: 30, units: 1.5, kcal: 126.0, prot: 8.1, carbs: 0, fat: 10.5 },
      { foodId: "ricotta-casa-azzurra", name: "Ricotta Casa Azzurra", grams: 30, kcal: 45.0, prot: 2.4, carbs: 0.4, fat: 3.6 },
      { foodId: "eafit-pure-isolate-vanille", name: "EAFit Pure Isolate Vanille", grams: 40, kcal: 146.4, prot: 34.4, carbs: 1.3, fat: 0.4 }
    ],
    timestamp: "2026-04-26T14:00:00"
  },
  {
    id: "2026-04-26-E04",
    date: "2026-04-26",
    meal: "cena", user: "ernesto",
    items: [
      { foodId: "sopa-pollo-fideos-vegetales", name: "Sopa Pollo Fideos Brócoli y Zanahoria", grams: 400, kcal: 200.0, prot: 12.0, carbs: 24.0, fat: 4.8 },
      { foodId: "chocolate-negro-90", name: "Chocolate Negro 10g", grams: 10, kcal: 59.2, prot: 1.0, carbs: 1.4, fat: 5.5 }
    ],
    timestamp: "2026-04-26T20:30:00"
  },
  // === ADRIANA 2026-04-24 ===
  {
    id: "2026-04-24-A01",
    date: "2026-04-24",
    meal: "desayuno", user: "adriana",
    items: [
      { foodId: "hotel-yogurt-granola-amsterdam", name: "Yogurt con Granola del Hotel", grams: 180, units: 1, kcal: 216.0, prot: 9.0, carbs: 25.2, fat: 9.0 },
      { foodId: "eafit-pure-isolate-vanille", name: "EAFit Vainilla con agua (120ml)", grams: 30, kcal: 109.8, prot: 25.8, carbs: 1.0, fat: 0.3 }
    ],
    timestamp: "2026-04-24T09:00:00"
  },
  {
    id: "2026-04-24-A02",
    date: "2026-04-24",
    meal: "almuerzo", user: "adriana",
    items: [
      { foodId: "ensalada-thai-peanut-mango-satay-oliver-green", name: "Bowl Autumn Chicken (espinaca, pollo, camote, feta, brocoli, tomate cherry, manzana, almendras, balsamico, arroz integral)", grams: 500, kcal: 650.0, prot: 40.0, carbs: 75.0, fat: 25.0 },
      { foodId: "te-verde-menta", name: "Té de Menta", grams: 250, kcal: 2.5, prot: 0, carbs: 0, fat: 0 }
    ],
    timestamp: "2026-04-24T13:30:00"
  },
  {
    id: "2026-04-24-A03",
    date: "2026-04-24",
    meal: "snack", user: "adriana",
    items: [
      { foodId: "stroopwafel-rudi-chocolate-negro", name: "Stroopwafel Rudi's", grams: 40, units: 1, kcal: 192.0, prot: 2.4, carbs: 26.0, fat: 8.8 }
    ],
    timestamp: "2026-04-24T17:00:00"
  },
  {
    id: "2026-04-24-A04",
    date: "2026-04-24",
    meal: "cena", user: "adriana",
    items: [
      { foodId: "frites-pareltje-amsterdam", name: "Large Frites 't Pareltje (5oz, mismas que Ernesto)", grams: 142, kcal: 497.0, prot: 5.7, carbs: 59.6, fat: 25.6 },
      { foodId: "mayo-trufa", name: "Mayo Trufa", grams: 17, kcal: 76.5, prot: 0.5, carbs: 0.9, fat: 7.8 },
      { foodId: "ketchup-generico", name: "Ketchup", grams: 17, kcal: 17.0, prot: 0.2, carbs: 4.1, fat: 0 },
      { foodId: "parmesano-rayado", name: "Parmesano Rallado", grams: 10, kcal: 39.2, prot: 3.6, carbs: 0, fat: 2.8 }
    ],
    timestamp: "2026-04-24T20:30:00"
  },
  // === ADRIANA 2026-04-25 ===
  {
    id: "2026-04-25-A01",
    date: "2026-04-25",
    meal: "desayuno", user: "adriana",
    items: [
      { foodId: "zuivelhoeve-stevige-trek", name: "Zuivelhoeve Stevige Trek con Granola (pot grande)", grams: 200, units: 1, kcal: 270.0, prot: 10.0, carbs: 34.0, fat: 9.0 }
    ],
    timestamp: "2026-04-25T09:30:00"
  },
  {
    id: "2026-04-25-A02",
    date: "2026-04-25",
    meal: "almuerzo", user: "adriana",
    items: [
      { foodId: "subway-melt-sweet-onion-15cm", name: "Subway Melt 15cm con Sweet Onion", grams: 245, units: 1, kcal: 410.0, prot: 23.0, carbs: 56.0, fat: 11.0 },
      { foodId: "van-stapele-cookie", name: "Van Stapele Cookie x2", grams: 160, units: 2, kcal: 800.0, prot: 8.0, carbs: 80.0, fat: 44.8 }
    ],
    timestamp: "2026-04-25T13:30:00"
  },
  {
    id: "2026-04-25-A03",
    date: "2026-04-25",
    meal: "cena", user: "adriana",
    items: [
      { foodId: "zaanlander-48-cheese", name: "Queso Zaanlander +48 (2 rodajas)", grams: 40, units: 2, kcal: 168.0, prot: 10.8, carbs: 0, fat: 14.0 },
      { foodId: "pollo-salteado", name: "Pollo Salteado", grams: 100, kcal: 180.0, prot: 31.0, carbs: 0, fat: 6.0 },
      { foodId: "bolletje-pan-amsterdam-semillas", name: "Bol Pan Amsterdam con Semillas", grams: 80, units: 1, kcal: 216.0, prot: 7.2, carbs: 32.0, fat: 5.6 },
      { foodId: "jugo-manzana-avion", name: "Jugo de Manzana Avion (vaso pequeño 150ml)", grams: 150, kcal: 69.0, prot: 0.2, carbs: 17.0, fat: 0 }
    ],
    timestamp: "2026-04-25T21:00:00"
  },
  {
    id: "2026-04-25-A04",
    date: "2026-04-25",
    meal: "snack", user: "adriana",
    items: [
      { foodId: "tres-leches-tiramisu-amsterdam", name: "Tres Leches Tiramisu (1/2 porción)", grams: 60, units: 0.5, kcal: 168.0, prot: 2.7, carbs: 18.0, fat: 9.0 },
      { foodId: "tres-leches-pistacho-amsterdam", name: "Tres Leches Pistacho (1/2 porción)", grams: 60, units: 0.5, kcal: 174.0, prot: 3.3, carbs: 16.8, fat: 9.6 },
      { foodId: "papas-ambacht-frites-artesanales", name: "Frites Regular", grams: 150, kcal: 525.0, prot: 6.0, carbs: 63.0, fat: 27.0 },
      { foodId: "mayo-trufa", name: "Mayo Trufa", grams: 15, kcal: 67.5, prot: 0.5, carbs: 0.8, fat: 6.9 }
    ],
    timestamp: "2026-04-25T18:00:00"
  },
  // === ADRIANA 2026-04-26 ===
  {
    id: "2026-04-26-A01",
    date: "2026-04-26",
    meal: "desayuno", user: "adriana",
    items: [
      { foodId: "huevo-entero", name: "Huevo Entero x2", grams: 100, units: 2, kcal: 155.0, prot: 13.0, carbs: 1.2, fat: 11.0 },
      { foodId: "jamon-porc-fleury-michon", name: "Jamón", grams: 23, kcal: 26.5, prot: 4.6, carbs: 0.2, fat: 0.8 },
      { foodId: "zaanlander-48-cheese", name: "Queso Zaanlander +48", grams: 26, kcal: 109.2, prot: 7.0, carbs: 0, fat: 9.1 },
      { foodId: "pain-baguette", name: "Pain Baguette", grams: 50, kcal: 137.0, prot: 4.3, carbs: 27.5, fat: 0.7 },
      { foodId: "aceite-oliva", name: "Aceite de Oliva (1/2 tsp)", grams: 2.5, kcal: 22.5, prot: 0, carbs: 0, fat: 2.5 },
      { foodId: "leche-almendra", name: "Leche de Almendras (150ml)", grams: 150, kcal: 19.5, prot: 0.6, carbs: 0.3, fat: 1.7 }
    ],
    timestamp: "2026-04-26T09:00:00"
  },
  {
    id: "2026-04-26-A02",
    date: "2026-04-26",
    meal: "snack", user: "adriana",
    items: [
      { foodId: "frambuesas-fresas", name: "Frambuesas", grams: 24, kcal: 12.5, prot: 0.3, carbs: 2.9, fat: 0.2 },
      { foodId: "fresas-frescas", name: "Fresas Frescas", grams: 45, kcal: 14.4, prot: 0.3, carbs: 3.5, fat: 0.1 },
      { foodId: "kefir-lactel-0-bio", name: "Kéfir Lactel 0% Bio", grams: 114, kcal: 50.2, prot: 3.9, carbs: 4.7, fat: 1.7 },
      { foodId: "siggis-skyr-nature", name: "Skyr Nature", grams: 30, kcal: 18.9, prot: 3.3, carbs: 1.2, fat: 0.1 },
      { foodId: "eafit-pure-isolate-vanille", name: "EAFit Vainilla", grams: 26, kcal: 95.2, prot: 22.4, carbs: 0.9, fat: 0.2 }
    ],
    timestamp: "2026-04-26T11:30:00"
  },
  {
    id: "2026-04-26-A03",
    date: "2026-04-26",
    meal: "cena", user: "adriana",
    items: [
      { foodId: "bavette-cocida", name: "Fideos Cocidos", grams: 87, kcal: 136.6, prot: 4.8, carbs: 27.0, fat: 0.8 },
      { foodId: "caldo-pollo", name: "Caldo de Pollo (180ml)", grams: 180, kcal: 18.0, prot: 2.7, carbs: 0.9, fat: 0.5 },
      { foodId: "pollo-pechuga-horneada", name: "Pollo", grams: 40, kcal: 66.0, prot: 12.4, carbs: 0, fat: 1.4 },
      { foodId: "brocoli-cuit", name: "Brócoli (cocido)", grams: 28, kcal: 9.8, prot: 0.8, carbs: 1.1, fat: 0.1 }
    ],
    timestamp: "2026-04-26T20:30:00"
  },
  // === ADRIANA 2026-04-27 ===
  {
    id: "2026-04-27-A01",
    date: "2026-04-27",
    meal: "desayuno", user: "adriana",
    items: [
      { foodId: "hipro-vanille", name: "HiPro Vanille", grams: 155, kcal: 119.4, prot: 15.8, carbs: 9.1, fat: 1.2 },
      { foodId: "siggis-skyr-nature", name: "Skyr Nature", grams: 145, kcal: 91.4, prot: 16.0, carbs: 5.8, fat: 0.3 },
      { foodId: "fresas-frescas", name: "Fresas Frescas", grams: 64, kcal: 20.5, prot: 0.4, carbs: 4.9, fat: 0.2 }
    ],
    timestamp: "2026-04-27T09:00:00"
  },
  {
    id: "2026-04-27-A02",
    date: "2026-04-27",
    meal: "snack", user: "adriana",
    items: [
      { foodId: "stroopwafel-rudi-chocolate-negro", name: "Stroopwafels x2", grams: 80, units: 2, kcal: 384.0, prot: 4.8, carbs: 52.0, fat: 17.6 }
    ],
    timestamp: "2026-04-27T11:30:00"
  },
  {
    id: "2026-04-27-A03",
    date: "2026-04-27",
    meal: "almuerzo", user: "adriana",
    items: [
      { foodId: "lechuga-fresca", name: "Hojas de Lechuga", grams: 40, kcal: 6.0, prot: 0.6, carbs: 1.2, fat: 0.1 },
      { foodId: "chile-rojo-fresco", name: "Chile Rojo", grams: 40, kcal: 12.4, prot: 0.4, carbs: 2.4, fat: 0.1 },
      { foodId: "tomate-cherry", name: "Tomate Cherry", grams: 18, kcal: 3.2, prot: 0.2, carbs: 0.7, fat: 0 },
      { foodId: "brocoli-cuit", name: "Brócoli", grams: 50, kcal: 17.5, prot: 1.5, carbs: 2.0, fat: 0.2 },
      { foodId: "pollo-pechuga-horneada", name: "Pollo", grams: 99, kcal: 163.4, prot: 30.7, carbs: 0, fat: 3.6 },
      { foodId: "crutones-caseros", name: "Crutones Caseros", grams: 20, kcal: 80.0, prot: 2.4, carbs: 14.0, fat: 1.6 }
    ],
    timestamp: "2026-04-27T13:30:00"
  },
  // === ERNESTO 2026-04-27 ===
  {
    id: "2026-04-27-E01",
    date: "2026-04-27",
    meal: "desayuno", user: "ernesto",
    items: [
      { foodId: "hipro-blueberry", name: "HiPro Myrtille (Blueberry)", grams: 160, units: 1, kcal: 84.8, prot: 15.0, carbs: 6.1, fat: 0 },
      { foodId: "cafe-negro", name: "Café sin azúcar", grams: 240, units: 1, kcal: 4.8, prot: 0.2, carbs: 0, fat: 0 },
      { foodId: "wasa-fibre", name: "Cracker Wasa Fibre", grams: 11.4, units: 1, kcal: 38.0, prot: 1.5, carbs: 5.2, fat: 0.6 },
      { foodId: "danone-cottage-cheese", name: "Cottage Cheese", grams: 20, kcal: 18.0, prot: 2.4, carbs: 0.3, fat: 0.8 }
    ],
    timestamp: "2026-04-27T09:00:00"
  },
  {
    id: "2026-04-27-E02",
    date: "2026-04-27",
    meal: "almuerzo", user: "ernesto",
    items: [
      { foodId: "lechuga-fresca", name: "Hojas de Lechuga", grams: 40, kcal: 6.0, prot: 0.6, carbs: 1.2, fat: 0.1 },
      { foodId: "chile-rojo-fresco", name: "Chile Rojo", grams: 40, kcal: 12.4, prot: 0.4, carbs: 2.4, fat: 0.1 },
      { foodId: "tomate-cherry", name: "Tomate Cherry", grams: 18, kcal: 3.2, prot: 0.2, carbs: 0.7, fat: 0 },
      { foodId: "brocoli-cuit", name: "Brócoli", grams: 50, kcal: 17.5, prot: 1.5, carbs: 2.0, fat: 0.2 },
      { foodId: "pollo-pechuga-horneada", name: "Pollo", grams: 100, kcal: 165.0, prot: 31.0, carbs: 0, fat: 3.6 },
      { foodId: "crutones-caseros", name: "Crutones Caseros", grams: 20, kcal: 80.0, prot: 2.4, carbs: 14.0, fat: 1.6 },
      { foodId: "sopa-pollo-fideos-vegetales", name: "Sopa Pollo Fideos (de anoche, 200ml)", grams: 200, kcal: 100.0, prot: 6.0, carbs: 12.0, fat: 2.4 }
    ],
    timestamp: "2026-04-27T13:30:00"
  },
  {
    id: "2026-04-27-A04",
    date: "2026-04-27",
    meal: "snack", user: "adriana",
    items: [
      { foodId: "eafit-pure-isolate-chocolat", name: "Pure Isolate Whey Chocolat", grams: 25, kcal: 88.5, prot: 20.3, carbs: 0.9, fat: 0.4 },
      { foodId: "kefir-lactel-0-bio", name: "Kéfir Lactel 0%", grams: 107, kcal: 47.1, prot: 3.6, carbs: 4.4, fat: 1.6 },
      { foodId: "kefir-lactel-0-bio", name: "Kéfir Lactel 0%", grams: 31, kcal: 13.6, prot: 1.1, carbs: 1.3, fat: 0.5 },
      { foodId: "banana-fresca", name: "Banano", grams: 40, kcal: 35.6, prot: 0.4, carbs: 9.1, fat: 0.1 },
      { foodId: "weider-peanut-butter-powder", name: "PB en polvo", grams: 3, kcal: 13.2, prot: 1.5, carbs: 0.6, fat: 0.4 },
      { foodId: "siggis-skyr-nature", name: "Skyr Siggis Nature", grams: 100, kcal: 63.0, prot: 11.0, carbs: 4.0, fat: 0.2 },
      { foodId: "miel-abeja", name: "Miel (1/2 tsp)", grams: 2.5, kcal: 7.6, prot: 0, carbs: 2.1, fat: 0 }
    ],
    timestamp: "2026-04-27T17:00:00"
  },
  {
    id: "2026-04-27-A05",
    date: "2026-04-27",
    meal: "cena", user: "adriana",
    items: [
      { foodId: "huevo-entero", name: "Huevo Entero", grams: 50, units: 1, kcal: 77.5, prot: 6.5, carbs: 0.6, fat: 5.5 },
      { foodId: "clara-huevo", name: "Clara de Huevo", grams: 33, units: 1, kcal: 17.2, prot: 3.6, carbs: 0.2, fat: 0.1 },
      { foodId: "jamon-porc-fleury-michon", name: "Jambon (1 rodaja)", grams: 30, kcal: 34.5, prot: 6.0, carbs: 0.3, fat: 1.1 },
      { foodId: "cebolla-salteada", name: "Cebolla Salteada", grams: 45, kcal: 22.5, prot: 0.5, carbs: 4.1, fat: 0.5 },
      { foodId: "aceite-oliva", name: "AOVE (1/2 tsp)", grams: 2.5, kcal: 22.1, prot: 0, carbs: 0, fat: 2.5 }
    ],
    timestamp: "2026-04-27T20:00:00"
  },
  {
    id: "2026-04-27-E03",
    date: "2026-04-27",
    meal: "snack", user: "ernesto",
    items: [
      { foodId: "eafit-pure-isolate-vanille", name: "Pure Isolate Whey Vanille", grams: 40, kcal: 146.4, prot: 34.4, carbs: 1.3, fat: 0.4 },
      { foodId: "fresas-frescas", name: "Fresas Frescas", grams: 50, kcal: 16.0, prot: 0.4, carbs: 3.9, fat: 0.2 }
    ],
    timestamp: "2026-04-27T17:00:00"
  },
  {
    id: "2026-04-27-E04",
    date: "2026-04-27",
    meal: "cena", user: "ernesto",
    items: [
      { foodId: "huevo-entero", name: "Huevo Entero", grams: 50, units: 1, kcal: 77.5, prot: 6.5, carbs: 0.6, fat: 5.5 },
      { foodId: "clara-huevo", name: "Claras de Huevo", grams: 66, units: 2, kcal: 34.3, prot: 7.3, carbs: 0.5, fat: 0.1 },
      { foodId: "jamon-porc-fleury-michon", name: "Jambon (1 rodaja)", grams: 30, kcal: 34.5, prot: 6.0, carbs: 0.3, fat: 1.1 },
      { foodId: "queso-maduro-espanol", name: "Queso Maduro", grams: 15, kcal: 60.0, prot: 3.8, carbs: 0.1, fat: 5.0 },
      { foodId: "chile-rojo-fresco", name: "Pimiento Rojo", grams: 30, kcal: 9.3, prot: 0.3, carbs: 1.8, fat: 0.1 },
      { foodId: "cebolla-cruda", name: "Cebolla (1/2 pequeña)", grams: 35, kcal: 14.0, prot: 0.4, carbs: 3.3, fat: 0 },
      { foodId: "tomate-cherry", name: "Tomate Cherry x4", grams: 40, kcal: 7.2, prot: 0.4, carbs: 1.6, fat: 0.1 },
      { foodId: "tastybasics-cracker-protein", name: "TastyBasics High Prot Low Carb Crackers", grams: 40, kcal: 199.2, prot: 14.4, carbs: 6.0, fat: 12.0 }
    ],
    timestamp: "2026-04-27T20:30:00"
  },
  {
    id: "2026-04-27-E05",
    date: "2026-04-27",
    meal: "snack", user: "ernesto",
    items: [
      { foodId: "wasa-fibre", name: "Wasa Fibre", grams: 14, units: 1, kcal: 47.6, prot: 1.4, carbs: 8.1, fat: 0.4 },
      { foodId: "mermelada-lucien-fraises-sans-sucres", name: "Mermelada Sans Sucres", grams: 10, kcal: 8.9, prot: 0.1, carbs: 2.2, fat: 0.1 },
      { foodId: "siggis-skyr-nature", name: "Skyr Siggis Nature", grams: 30, kcal: 18.9, prot: 3.3, carbs: 1.2, fat: 0.1 }
    ],
    timestamp: "2026-04-27T21:30:00"
  },
  {
    id: "2026-04-27-E06",
    date: "2026-04-27",
    meal: "snack", user: "ernesto",
    items: [
      { foodId: "lu-petit-beurre", name: "LU Petit Beurre x3", grams: 25, units: 3, kcal: 108.8, prot: 1.9, carbs: 18.8, fat: 2.8 }
    ],
    timestamp: "2026-04-27T22:30:00"
  },
  {
    id: "2026-04-28-A01",
    date: "2026-04-28",
    meal: "desayuno", user: "adriana",
    items: [
      { foodId: "hipro-coco", name: "HiPro Coco", grams: 155, kcal: 86.8, prot: 14.6, carbs: 5.7, fat: 0.6 },
      { foodId: "siggis-skyr-nature", name: "Skyr Siggis Nature", grams: 150, kcal: 94.5, prot: 16.5, carbs: 6.0, fat: 0.3 },
      { foodId: "flax-seed", name: "Flax Seed", grams: 3, kcal: 16.0, prot: 0.5, carbs: 0.9, fat: 1.3 },
      { foodId: "fresas-frescas", name: "Fresas Frescas", grams: 63, kcal: 20.2, prot: 0.4, carbs: 4.9, fat: 0.2 }
    ],
    timestamp: "2026-04-28T09:00:00"
  },
  {
    id: "2026-04-28-A02",
    date: "2026-04-28",
    meal: "almuerzo", user: "adriana",
    items: [
      { foodId: "lechuga-fresca", name: "Hojas de Lechuga", grams: 40, kcal: 6.0, prot: 0.6, carbs: 1.2, fat: 0.1 },
      { foodId: "chile-rojo-fresco", name: "Chile Rojo", grams: 40, kcal: 12.4, prot: 0.4, carbs: 2.4, fat: 0.1 },
      { foodId: "tomate-cherry", name: "Tomate Cherry", grams: 18, kcal: 3.2, prot: 0.2, carbs: 0.7, fat: 0 },
      { foodId: "brocoli-cuit", name: "Brócoli", grams: 50, kcal: 17.5, prot: 1.5, carbs: 2.0, fat: 0.2 },
      { foodId: "pollo-pechuga-horneada", name: "Pollo", grams: 99, kcal: 163.4, prot: 30.7, carbs: 0, fat: 3.6 },
      { foodId: "crutones-caseros", name: "Crutones Caseros", grams: 20, kcal: 80.0, prot: 2.4, carbs: 14.0, fat: 1.6 }
    ],
    timestamp: "2026-04-28T13:30:00"
  },
  {
    id: "2026-04-28-A03",
    date: "2026-04-28",
    meal: "snack", user: "adriana",
    items: [
      { foodId: "mandarina-fresca", name: "Mandarina", grams: 80, units: 1, kcal: 37.6, prot: 0.6, carbs: 9.6, fat: 0.2 }
    ],
    timestamp: "2026-04-28T16:30:00"
  },
  {
    id: "2026-04-28-A04",
    date: "2026-04-28",
    meal: "snack", user: "adriana",
    items: [
      { foodId: "kefir-lactel-0-bio", name: "Kéfir Lactel 0%", grams: 130, kcal: 57.2, prot: 4.4, carbs: 5.3, fat: 2.0 },
      { foodId: "siggis-skyr-nature", name: "Skyr Nature", grams: 42, kcal: 26.5, prot: 4.6, carbs: 1.7, fat: 0.1 },
      { foodId: "eafit-pure-isolate-vanille", name: "Pure Isolate Whey Vanille", grams: 28, kcal: 102.5, prot: 24.1, carbs: 0.9, fat: 0.3 },
      { foodId: "fresas-frescas", name: "Fresas Frescas", grams: 55, kcal: 17.6, prot: 0.4, carbs: 4.2, fat: 0.2 },
      { foodId: "wasa-leger", name: "Wasa Leger", grams: 9.6, units: 1, kcal: 32.4, prot: 0.9, carbs: 6.0, fat: 0.1 }
    ],
    timestamp: "2026-04-28T18:00:00"
  },
  {
    id: "2026-04-28-A05",
    date: "2026-04-28",
    meal: "cena", user: "adriana",
    items: [
      { foodId: "huevo-entero", name: "Huevos Enteros x2", grams: 100, units: 2, kcal: 155.0, prot: 13.0, carbs: 1.1, fat: 11.0 },
      { foodId: "wasa-leger", name: "Wasa Holandesa", grams: 25, kcal: 84.5, prot: 2.3, carbs: 15.5, fat: 0.4 },
      { foodId: "jamon-porc-fleury-michon", name: "Jamón", grams: 35, kcal: 40.3, prot: 7.0, carbs: 0.4, fat: 1.2 },
      { foodId: "zaanlander-48-cheese", name: "Queso Zaanlander 48+", grams: 26, kcal: 109.2, prot: 7.0, carbs: 0, fat: 9.1 },
      { foodId: "aceite-oliva", name: "AOVE (1/2 tsp)", grams: 2.5, kcal: 22.1, prot: 0, carbs: 0, fat: 2.5 }
    ],
    timestamp: "2026-04-28T21:30:00"
  },
  {
    id: "2026-04-28-E01",
    date: "2026-04-28",
    meal: "desayuno", user: "ernesto",
    items: [
      { foodId: "hipro-coco", name: "HiPro Coco", grams: 160, units: 1, kcal: 89.6, prot: 15.0, carbs: 5.9, fat: 0.6 },
      { foodId: "starbucks-protein-drink-coffee-lowfat", name: "Starbucks Protein Coffee Drink Low Fat", grams: 330, units: 1, kcal: 168.3, prot: 20.1, carbs: 13.5, fat: 3.6 }
    ],
    timestamp: "2026-04-28T09:00:00"
  },
  {
    id: "2026-04-28-E02",
    date: "2026-04-28",
    meal: "almuerzo", user: "ernesto",
    items: [
      { foodId: "lechuga-fresca", name: "Hojas de Lechuga", grams: 40, kcal: 6.0, prot: 0.6, carbs: 1.2, fat: 0.1 },
      { foodId: "chile-rojo-fresco", name: "Chile Rojo", grams: 40, kcal: 12.4, prot: 0.4, carbs: 2.4, fat: 0.1 },
      { foodId: "tomate-cherry", name: "Tomate Cherry", grams: 18, kcal: 3.2, prot: 0.2, carbs: 0.7, fat: 0 },
      { foodId: "brocoli-cuit", name: "Brócoli", grams: 50, kcal: 17.5, prot: 1.5, carbs: 2.0, fat: 0.2 },
      { foodId: "pollo-pechuga-horneada", name: "Pollo", grams: 99, kcal: 163.4, prot: 30.7, carbs: 0, fat: 3.6 },
      { foodId: "crutones-caseros", name: "Crutones Caseros", grams: 20, kcal: 80.0, prot: 2.4, carbs: 14.0, fat: 1.6 },
      { foodId: "aceituna-kalamata", name: "Aceituna Kalamata x4", grams: 16, units: 4, kcal: 38.4, prot: 0.2, carbs: 1.0, fat: 3.5 },
      { foodId: "siggis-skyr-nature", name: "Skyr Siggis Nature (aderezo)", grams: 20, kcal: 12.6, prot: 2.2, carbs: 0.8, fat: 0 },
      { foodId: "aceite-oliva", name: "AOVE (1/3 cdta)", grams: 1.7, kcal: 15.0, prot: 0, carbs: 0, fat: 1.7 },
      { foodId: "eafit-pure-isolate-chocolat", name: "Pure Isolate Whey Chocolat", grams: 45, kcal: 159.3, prot: 36.5, carbs: 1.7, fat: 0.7 },
      { foodId: "banana-fresca", name: "Banana", grams: 50, kcal: 44.5, prot: 0.6, carbs: 11.4, fat: 0.2 },
      { foodId: "weider-peanut-butter-powder", name: "PB en polvo", grams: 4, kcal: 17.6, prot: 2.0, carbs: 0.8, fat: 0.5 },
      { foodId: "siggis-skyr-nature", name: "Skyr Siggis Nature", grams: 40, kcal: 25.2, prot: 4.4, carbs: 1.6, fat: 0.1 }
    ],
    timestamp: "2026-04-28T13:30:00"
  },
  {
    id: "2026-04-28-E03",
    date: "2026-04-28",
    meal: "cena", user: "ernesto",
    items: [
      { foodId: "huevo-entero", name: "Huevo Entero", grams: 50, units: 1, kcal: 77.5, prot: 6.5, carbs: 0.6, fat: 5.5 },
      { foodId: "clara-huevo", name: "Claras de Huevo", grams: 66, units: 2, kcal: 34.3, prot: 7.3, carbs: 0.5, fat: 0.1 },
      { foodId: "jamon-porc-fleury-michon", name: "Jambon Porc Rôti FM (1 rodaja)", grams: 28, units: 1, kcal: 32.2, prot: 5.6, carbs: 0.3, fat: 1.0 },
      { foodId: "danone-cottage-cheese", name: "Cottage Cheese", grams: 80, kcal: 72.0, prot: 9.6, carbs: 1.3, fat: 3.1 },
      { foodId: "tastybasics-cracker-protein", name: "TastyBasics High Prot Low Carb Crackers", grams: 15, kcal: 74.7, prot: 5.4, carbs: 2.3, fat: 4.5 },
      { foodId: "eafit-pure-isolate-vanille", name: "Pure Isolate Whey Vanille", grams: 35, kcal: 128.1, prot: 30.1, carbs: 1.1, fat: 0.4 }
    ],
    timestamp: "2026-04-28T20:30:00"
  },
  {
    id: "2026-04-28-E04",
    date: "2026-04-28",
    meal: "snack", user: "ernesto",
    items: [
      { foodId: "tony-chocolonely-dark-70", name: "Tony's Chocolonely Dark 70%", grams: 12, kcal: 69.0, prot: 1.1, carbs: 4.1, fat: 4.9 }
    ],
    timestamp: "2026-04-28T22:00:00"
  },
  {
    id: "2026-04-29-E01",
    date: "2026-04-29",
    meal: "desayuno", user: "ernesto",
    items: [
      { foodId: "hipro-coco", name: "HiPro Coco", grams: 160, units: 1, kcal: 89.6, prot: 15.0, carbs: 5.9, fat: 0.6 },
      { foodId: "eafit-pure-isolate-vanille", name: "Pure Isolate Whey Vanille", grams: 30, kcal: 109.8, prot: 25.8, carbs: 1.0, fat: 0.3 }
    ],
    timestamp: "2026-04-29T09:00:00"
  },
  {
    id: "2026-04-29-E02",
    date: "2026-04-29",
    meal: "almuerzo", user: "ernesto",
    items: [
      { foodId: "lomo-cerdo-horneado", name: "Lomo de Cerdo Horneado", grams: 120, kcal: 171.6, prot: 31.2, carbs: 0, fat: 5.4 },
      { foodId: "camote-hervido", name: "Camote Hervido", grams: 80, kcal: 60.8, prot: 1.1, carbs: 14.2, fat: 0.1 },
      { foodId: "brocoli-cuit", name: "Brócoli", grams: 100, kcal: 35.0, prot: 3.0, carbs: 4.0, fat: 0.4 },
      { foodId: "cebolla-cruda", name: "Cebolla Horneada", grams: 30, kcal: 12.0, prot: 0.3, carbs: 2.8, fat: 0 },
      { foodId: "agua-jamaica-sin-azucar", name: "Fresco de Rosa de Jamaica sin Azúcar", grams: 250, kcal: 5.0, prot: 0, carbs: 1.3, fat: 0 }
    ],
    timestamp: "2026-04-29T13:30:00"
  },
  {
    id: "2026-04-29-E03",
    date: "2026-04-29",
    meal: "snack", user: "ernesto",
    items: [
      { foodId: "tastybasics-cracker-protein", name: "TastyBasics Fibre Cracker (Amsterdam)", grams: 20, kcal: 99.6, prot: 7.2, carbs: 3.0, fat: 6.0 },
      { foodId: "danone-cottage-cheese", name: "Cottage Cheese", grams: 80, kcal: 72.0, prot: 9.6, carbs: 1.3, fat: 3.1 }
    ],
    timestamp: "2026-04-29T17:00:00"
  },
  {
    id: "2026-04-29-A01",
    date: "2026-04-29",
    meal: "desayuno",
    user: "adriana",
    items: [
      { foodId: "kefir-lactel-0-bio", name: "Kéfir Lactel 0%", grams: 90, kcal: 39.6, prot: 3.1, carbs: 3.7, fat: 1.4 },
      { foodId: "siggis-skyr-nature", name: "Skyr Nature", grams: 75, kcal: 47.3, prot: 8.3, carbs: 3.0, fat: 0.2 },
      { foodId: "flax-seed", name: "Semillas de Lino", grams: 5, units: 1, kcal: 26.7, prot: 0.9, carbs: 1.5, fat: 2.1 },
      { foodId: "fresas-frescas", name: "Fresas Frescas", grams: 55, kcal: 17.6, prot: 0.4, carbs: 4.2, fat: 0.2 },
      { foodId: "eafit-pure-isolate-vanille", name: "Pure Isolate Whey Vanille", grams: 30, kcal: 109.8, prot: 25.8, carbs: 1.0, fat: 0.3 }
    ],
    timestamp: "2026-04-29T07:55:00"
  },
  {
    id: "2026-04-29-A02",
    date: "2026-04-29",
    meal: "snack",
    user: "adriana",
    items: [
      { foodId: "pain-aux-raisins", name: "Pain aux Raisins (Roulé)", grams: 90, units: 1, kcal: 306.0, prot: 5.9, carbs: 40.5, fat: 13.5 }
    ],
    timestamp: "2026-04-29T11:35:00"
  },
  {
    id: "2026-04-29-A03",
    date: "2026-04-29",
    meal: "snack",
    user: "adriana",
    items: [
      { foodId: "wasa-leger", name: "Wasa Leger x2", grams: 19.2, units: 2, kcal: 64.9, prot: 1.7, carbs: 11.9, fat: 0.3 },
      { foodId: "ricotta-casa-azzurra", name: "Ricotta Casa Azzurra", grams: 46, kcal: 69.0, prot: 3.7, carbs: 0.6, fat: 5.5 },
      { foodId: "fresas-frescas", name: "Fresas Frescas", grams: 56, kcal: 17.9, prot: 0.4, carbs: 4.3, fat: 0.2 }
    ],
    timestamp: "2026-04-29T18:23:00"
  },
  {
    id: "2026-04-29-A04",
    date: "2026-04-29",
    meal: "cena",
    user: "adriana",
    items: [
      { foodId: "bavette-cocida", name: "Fideos Cocidos", grams: 93, kcal: 146.0, prot: 5.1, carbs: 28.8, fat: 0.8 },
      { foodId: "caldo-pollo", name: "Caldo de Pollo", grams: 198, kcal: 19.8, prot: 3.0, carbs: 1.0, fat: 0.6 },
      { foodId: "ricotta-casa-azzurra", name: "Ricotta Casa Azzurra", grams: 25, kcal: 37.5, prot: 2.0, carbs: 0.3, fat: 3.0 },
      { foodId: "pollo-pechuga-horneada", name: "Pechuga de Pollo Horneada", grams: 79, kcal: 130.4, prot: 24.5, carbs: 0, fat: 2.8 }
    ],
    timestamp: "2026-04-29T22:05:00"
  },
  {
    id: "2026-04-29-A05",
    date: "2026-04-29",
    meal: "almuerzo",
    user: "adriana",
    items: [
      { foodId: "lomo-cerdo-horneado", name: "Lomo de Cerdo Horneado", grams: 90, kcal: 128.7, prot: 23.4, carbs: 0, fat: 4.1 },
      { foodId: "brocoli-cuit", name: "Brócoli", grams: 90, kcal: 31.5, prot: 2.7, carbs: 3.6, fat: 0.4 },
      { foodId: "cebolla-cruda", name: "Cebolla Horneada", grams: 30, kcal: 12.0, prot: 0.3, carbs: 2.8, fat: 0 },
      { foodId: "camote-hervido", name: "Camote Hervido", grams: 70, kcal: 53.2, prot: 1.0, carbs: 12.4, fat: 0.1 }
    ],
    timestamp: "2026-04-29T13:30:00"
  },
  {
    id: "2026-04-29-E04",
    date: "2026-04-29",
    meal: "snack", user: "ernesto",
    items: [
      { foodId: "tony-chocolonely-dark-70", name: "Chocolate Negro 70%", grams: 20, kcal: 115.0, prot: 1.8, carbs: 6.8, fat: 8.2 },
      { foodId: "wasa-leger", name: "Wasa Light x2", grams: 19.2, units: 2, kcal: 64.9, prot: 1.7, carbs: 11.9, fat: 0.3 },
      { foodId: "ricotta-casa-azzurra", name: "Ricotta", grams: 20, kcal: 30.0, prot: 1.6, carbs: 0.2, fat: 2.4 },
      { foodId: "mermelada-lucien-fraises-sans-sucres", name: "Mermelada sin Azúcar", grams: 12, kcal: 10.7, prot: 0.1, carbs: 2.6, fat: 0.1 }
    ],
    timestamp: "2026-04-29T19:30:00"
  },
  {
    id: "2026-04-29-E05",
    date: "2026-04-29",
    meal: "cena", user: "ernesto",
    items: [
      { foodId: "fideos-chinos-mamee", name: "Mamee Poulet (80% del sachet 85g = 68g seco)", grams: 68, kcal: 257.0, prot: 6.3, carbs: 31.7, fat: 11.2 },
      { foodId: "lomo-cerdo-horneado", name: "Cerdo Horneado", grams: 50, kcal: 71.5, prot: 13.0, carbs: 0, fat: 2.3 },
      { foodId: "brocoli-cuit", name: "Brócoli (en sopa)", grams: 60, kcal: 21.0, prot: 1.8, carbs: 2.4, fat: 0.2 },
      { foodId: "stroopwafel-rudi-chocolate-negro", name: "Stroopwafel 9cm", grams: 35, kcal: 168.0, prot: 2.1, carbs: 22.8, fat: 7.7 }
    ],
    timestamp: "2026-04-29T21:30:00"
  },
  {
    id: "2026-04-30-E01",
    date: "2026-04-30",
    meal: "desayuno", user: "ernesto",
    items: [
      { foodId: "eafit-pure-isolate-vanille", name: "Pure Isolate Whey Vanille", grams: 40, kcal: 146.4, prot: 34.4, carbs: 1.3, fat: 0.4 },
      { foodId: "banana-fresca", name: "Banana", grams: 35, kcal: 31.2, prot: 0.4, carbs: 8.0, fat: 0.1 },
      { foodId: "fresas-frescas", name: "Fresas", grams: 40, kcal: 12.8, prot: 0.3, carbs: 3.1, fat: 0.1 },
      { foodId: "cafe-negro", name: "Café Negro", grams: 240, units: 1, kcal: 4.8, prot: 0.2, carbs: 0, fat: 0 }
    ],
    timestamp: "2026-04-30T08:00:00"
  },
  {
    id: "2026-04-30-E02",
    date: "2026-04-30",
    meal: "almuerzo", user: "ernesto",
    items: [
      { foodId: "lomo-cerdo-horneado", name: "Lomo de Cerdo Horneado", grams: 130, kcal: 185.9, prot: 33.8, carbs: 0, fat: 5.9 },
      { foodId: "brocoli-cuit", name: "Brócoli", grams: 120, kcal: 42.0, prot: 3.6, carbs: 4.8, fat: 0.5 },
      { foodId: "camote-hervido", name: "Camote Hervido", grams: 80, kcal: 60.8, prot: 1.1, carbs: 14.2, fat: 0.1 },
      { foodId: "cebolla-cruda", name: "Cebolla Horneada", grams: 25, kcal: 10.0, prot: 0.3, carbs: 2.3, fat: 0 },
      { foodId: "odyssee-salade-thon-intermarche", name: "Ensalada de Atún con Arroz (Odyssée)", grams: 35, kcal: 43.8, prot: 2.6, carbs: 3.5, fat: 2.1 },
      { foodId: "jeff-de-bruges-oeuf-paques", name: "Huevito Orange Jeff de Bruges x1", grams: 13, units: 1, kcal: 69.9, prot: 0.9, carbs: 6.8, fat: 4.3 }
    ],
    timestamp: "2026-04-30T13:30:00"
  },
  {
    id: "2026-04-30-E03",
    date: "2026-04-30",
    meal: "snack", user: "ernesto",
    items: [
      { foodId: "kinder-chocobon", name: "Kinder Chocobon x1", grams: 5, units: 1, kcal: 28.3, prot: 0.4, carbs: 2.8, fat: 1.7 }
    ],
    timestamp: "2026-04-30T16:00:00"
  }

];

// Activity log - gym sessions and step data
// Steps from Samsung Health, gym from Apple Watch/tracker
const ACTIVITY_LOG = [
  { date: "2026-03-29", user: "ernesto", steps: 3000, stepsKcal: 50,  gym: null, gymKcal: 0,   notes: "estimado pasos" },
  { date: "2026-03-30", user: "ernesto", steps: 200,  stepsKcal: 0,   gym: null, gymKcal: 0,   notes: "lunes casi sin pasos" },
  { date: "2026-03-31", user: "ernesto", steps: 4000, stepsKcal: 100,  gym: "full body", gymKcal: 744, notes: "" },
  { date: "2026-04-01", user: "ernesto", steps: 3500, stepsKcal: 75,  gym: null, gymKcal: 0,   notes: "" },
  { date: "2026-04-02", user: "ernesto", steps: 3000, stepsKcal: 50,  gym: "full body", gymKcal: 466, notes: "" },
  { date: "2026-04-03", user: "ernesto", steps: 3500, stepsKcal: 75,  gym: null, gymKcal: 0,   notes: "" },
  { date: "2026-04-04", user: "ernesto", steps: 6000, stepsKcal: 200, gym: "gym", gymKcal: 370, notes: "apero + gym" },
  { date: "2026-04-05", user: "ernesto", steps: 12954, stepsKcal: 400, gym: "gym", gymKcal: 541, notes: "domingo" },
  { date: "2026-04-06", user: "ernesto", steps: 11001, stepsKcal: 350, gym: "gym", gymKcal: 656, notes: "" },
  { date: "2026-04-07", user: "ernesto", steps: 6755, stepsKcal: 175, gym: null, gymKcal: 0, notes: "" },
  { date: "2026-04-08", user: "ernesto", steps: 6368, stepsKcal: 175, gym: "gym", gymKcal: 601, notes: "" },
  { date: "2026-04-09", user: "ernesto", steps: 10000, stepsKcal: 300, gym: "caminar rapido", gymKcal: 265, notes: "" },
  { date: "2026-04-10", user: "ernesto", steps: 10017, stepsKcal: 300, gym: null, gymKcal: 0, notes: "" },
  { date: "2026-04-11", user: "ernesto", steps: 10624, stepsKcal: 300, gym: "gym", gymKcal: 551, notes: "" },
  { date: "2026-04-12", user: "ernesto", steps: 12870, stepsKcal: 375, gym: "gym", gymKcal: 478, notes: "" },
  { date: "2026-04-13", user: "ernesto", steps: 5484, stepsKcal: 150, gym: null, gymKcal: 0, notes: "" },
  { date: "2026-04-14", user: "ernesto", steps: 4737, stepsKcal: 125, gym: "gym", gymKcal: 480, notes: "" },
  { date: "2026-04-15", user: "ernesto", steps: 5500, stepsKcal: 150, gym: null, gymKcal: 0, notes: "" },
  { date: "2026-04-16", user: "ernesto", steps: 6336, stepsKcal: 175, gym: null, gymKcal: 0, notes: "" },
  { date: "2026-04-17", user: "ernesto", steps: 8800, stepsKcal: 250, gym: "caminata cardio 45min", gymKcal: 300, notes: "" },
  { date: "2026-04-18", user: "ernesto", steps: 16846, stepsKcal: 500, gym: "gym", gymKcal: 507, notes: "pizza LouieLouie" },
  { date: "2026-04-19", user: "ernesto", steps: 12221, stepsKcal: 365, gym: "gym", gymKcal: 923, notes: "arepa reina pepiada day" },
  { date: "2026-04-20", user: "ernesto", steps: 3054,  stepsKcal: 50,  gym: "gym", gymKcal: 487, notes: "" },
  { date: "2026-04-21", user: "ernesto", steps: 3922,  stepsKcal: 75,  gym: null,  gymKcal: 0,   notes: "" },
  { date: "2026-04-22", user: "ernesto", steps: 8224,  stepsKcal: 525, gym: null,  gymKcal: 0,   notes: "8224 pasos + 7h de pie en fila (~275 kcal standing extra)" },
  { date: "2026-04-23", user: "ernesto", steps: 16705, stepsKcal: 500, gym: null,  gymKcal: 0,   notes: "Amsterdam walking day" },
  { date: "2026-04-24", user: "ernesto", steps: 18795, stepsKcal: 600, gym: "gym", gymKcal: 610, notes: "Amsterdam walking day 2 + gym" },
  { date: "2026-04-25", user: "ernesto", steps: 15119, stepsKcal: 450, gym: null,  gymKcal: 0,   notes: "Amsterdam walking day 3" },
  { date: "2026-04-26", user: "ernesto", steps: 300,   stepsKcal: 0,   gym: null,  gymKcal: 0,   notes: "Domingo descanso, viaje" },
  { date: "2026-04-27", user: "ernesto", steps: 2600,  stepsKcal: 25,  gym: null,  gymKcal: 0,   notes: "" },
  { date: "2026-04-28", user: "ernesto", steps: 800,   stepsKcal: 0,   gym: null,  gymKcal: 0,   notes: "" },
  { date: "2026-04-29", user: "ernesto", steps: 5065,  stepsKcal: 125, gym: null,  gymKcal: 0,   notes: "" },
  { date: "2026-04-30", user: "ernesto", steps: 600,   stepsKcal: 0,   gym: null,  gymKcal: 0,   notes: "" },
  { date: "2026-05-01", user: "ernesto", steps: 5413,  stepsKcal: 125, gym: "gym", gymKcal: 617, notes: "" },
  { date: "2026-05-02", steps: 1475, stepsKcal: 25,  gym: null, gymKcal: 0,   user: "adriana", notes: "" },
  { date: "2026-05-03", steps: 3972, stepsKcal: 75,  gym: "gym", gymKcal: 428, user: "adriana", notes: "" },
  { date: "2026-05-04", steps: 3273, stepsKcal: 65,  gym: null, gymKcal: 0,   user: "adriana", notes: "" },
  { date: "2026-05-05", steps: 500,  stepsKcal: 0,   gym: null, gymKcal: 0,   user: "adriana", notes: "" },
  { date: "2026-05-06", steps: 3284, stepsKcal: 65,  gym: "gym", gymKcal: 482, user: "adriana", notes: "" },
  { date: "2026-05-07", steps: 0,    stepsKcal: 0,   gym: "gym", gymKcal: 500, user: "ernesto", notes: "entrené 500kcal" },
];

// Daily energy balance (sabado a sabado: 29 mar - 4 abr + dom 5)
// intake: from MEAL_LOG or corrected from NutrIA dashboard
// tdee: BMR 1788 x 1.2 = 2145 (sedentary base) — updated 2026-04-17 at 86.9kg
// stepsKcal: extra calories from steps above sedentary baseline (~2000 steps/day)
// gymKcal: active calories from gym sessions
// balance: intake - tdee - stepsKcal - gymKcal (negative = deficit)
const DAILY_BALANCE = [
  // Semana 29 mar - 5 abr
  { date: "2026-03-29", user: "ernesto", day: "Dom", intake: 1688, tdee: 2182, stepsKcal: 50,  gymKcal: 0,   balance: -544 },
  { date: "2026-03-30", user: "ernesto", day: "Lun", intake: 1398, tdee: 2182, stepsKcal: 0,   gymKcal: 0,   balance: -784 },
  { date: "2026-03-31", user: "ernesto", day: "Mar", intake: 1190, tdee: 2182, stepsKcal: 100, gymKcal: 744, balance: -1836 },
  { date: "2026-04-01", user: "ernesto", day: "Mie", intake: 1158, tdee: 2182, stepsKcal: 75,  gymKcal: 0,   balance: -1099 },
  { date: "2026-04-02", user: "ernesto", day: "Jue", intake: 1695, tdee: 2182, stepsKcal: 50,  gymKcal: 466, balance: -1003 },
  { date: "2026-04-03", user: "ernesto", day: "Vie", intake: 1193, tdee: 2182, stepsKcal: 75,  gymKcal: 0,   balance: -1064 },
  { date: "2026-04-04", user: "ernesto", day: "Sab", intake: 2564, tdee: 2182, stepsKcal: 200, gymKcal: 370, balance: -188 },
  { date: "2026-04-05", user: "ernesto", day: "Dom", intake: 1459, tdee: 2182, stepsKcal: 400, gymKcal: 541, balance: -1664, notes: "" }
];

// Weight & body composition log - from Renpho scale or manual entry
// Fields match Renpho app output
const WEIGHT_LOG = [
  {
    date: "2026-03-29",
    weight: 89.0,
    bmi: 29.1,
    bodyFat: 24.7, fatFreeWeight: 67.0, subcutFat: 21.3, visceralFat: 11,
    bodyWater: 54.4, skeletalMuscle: 48.7, muscleMass: 63.50, boneMass: 3.34,
    bmr: 1812, metabolicAge: 38,
    source: "renpho",
    notes: "Renpho 29/03 10:22. Peso corregido a 89kg (bascula marcó 88.7)"
  },
  {
    date: "2026-04-06",
    weight: 87.6,
    bmi: 28.6,
    bodyFat: 24.1, fatFreeWeight: null, subcutFat: null, visceralFat: null,
    bodyWater: null, skeletalMuscle: null, muscleMass: 63.2, boneMass: null,
    bmr: null, metabolicAge: null,
    source: "renpho",
    notes: "AM"
  },
  {
    date: "2026-04-10",
    weight: 87.15,
    bmi: 28.5,
    bodyFat: 23.9, fatFreeWeight: null, subcutFat: null, visceralFat: null,
    bodyWater: null, skeletalMuscle: null, muscleMass: 63.0, boneMass: null,
    bmr: null, metabolicAge: null,
    source: "renpho",
    notes: ""
  },
  {
    date: "2026-04-16",
    weight: 86.9,
    bmi: 28.4,
    bodyFat: 23.8, fatFreeWeight: 66.20, subcutFat: 20.5, visceralFat: 11,
    bodyWater: 55.0, skeletalMuscle: 49.2, muscleMass: 62.90, boneMass: 3.31,
    bmr: 1800, metabolicAge: 37,
    source: "renpho",
    notes: "Renpho 16/04 09:31"
  },
  {
    date: "2026-04-28",
    weight: 86.10,
    bmi: 28.1,
    bodyFat: 23.4, fatFreeWeight: 66.00, subcutFat: 20.1, visceralFat: 10,
    bodyWater: 55.3, skeletalMuscle: 49.5, muscleMass: 62.70, boneMass: 3.30,
    protein: 17.5,
    bmr: 1796, metabolicAge: null,
    source: "renpho",
    notes: "Renpho 28/04 17:26"
  },
  {
    date: "2026-05-01",
    weight: 85.85,
    bmi: 28.0,
    bodyFat: 23.2, fatFreeWeight: 65.90, subcutFat: 20.0, visceralFat: 10,
    bodyWater: 55.4, skeletalMuscle: 49.6, muscleMass: 62.60, boneMass: 3.30,
    protein: 17.5,
    bmr: 1794, metabolicAge: null,
    source: "renpho",
    notes: "Renpho 01/05 17:25"
  }
];
