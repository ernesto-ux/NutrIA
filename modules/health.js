// NutrIA — Health module
// Loaded AFTER the main IIFE. All helpers accessed via window.NutrIA.
// renphoResult, renphoProcessing, tesseractLoaded are globals declared before the IIFE.

window.applyOCRData = function(steps, stepsKcal, gymKcal) {
  const { showToast, render } = window.NutrIA;
  const currentDate = window.NutrIA.currentDate;
  const dateEl = document.getElementById('ocr-date');
  const dateStr = dateEl ? dateEl.value : currentDate;
  const finalStepsKcal = stepsKcal || (steps ? Math.round(steps * 0.03) : 0);

  let found = false;
  for (let i = 0; i < ACTIVITY_LOG.length; i++) {
    if (ACTIVITY_LOG[i].date === dateStr) {
      if (steps) { ACTIVITY_LOG[i].steps = steps; ACTIVITY_LOG[i].stepsKcal = finalStepsKcal; }
      if (gymKcal) { ACTIVITY_LOG[i].gymKcal = gymKcal; ACTIVITY_LOG[i].gym = 'gym'; }
      found = true;
      break;
    }
  }
  if (!found) {
    ACTIVITY_LOG.push({
      date: dateStr, steps: steps || 0, stepsKcal: finalStepsKcal,
      gym: gymKcal ? 'gym' : null, gymKcal: gymKcal || 0, notes: 'OCR import'
    });
  }
  for (let i = 0; i < DAILY_BALANCE.length; i++) {
    if (DAILY_BALANCE[i].date === dateStr) {
      if (steps) DAILY_BALANCE[i].stepsKcal = finalStepsKcal;
      if (gymKcal) DAILY_BALANCE[i].gymKcal = gymKcal;
      DAILY_BALANCE[i].balance = DAILY_BALANCE[i].intake - DAILY_BALANCE[i].tdee - DAILY_BALANCE[i].stepsKcal - DAILY_BALANCE[i].gymKcal;
      break;
    }
  }
  fetch('/api/activity', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      date: dateStr, steps: steps || 0, stepsKcal: finalStepsKcal,
      gym: gymKcal ? 'gym' : null, gymKcal: gymKcal || 0, notes: 'OCR import'
    })
  }).then(r => r.json()).then(d => {
    if (d.ok) showToast(`Guardado en ${dateStr}: ${steps ? steps.toLocaleString() + ' pasos' : ''}${gymKcal ? ' + ' + gymKcal + ' kcal gym' : ''}`);
    else showToast('Error guardando actividad');
  }).catch(() => showToast('Guardado local (server offline)'));
  render();
};

function parseRenphoData(text) {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  const data = {};

  function findMetric(keywords, min, max) {
    for (const line of lines) {
      const lower = line.toLowerCase().replace(/[éèê]/g, 'e').replace(/[àâ]/g, 'a');
      for (const kw of keywords) {
        if (lower.includes(kw)) {
          const nums = line.match(/(\d+[.,]\d+|\d+)/g);
          if (nums) {
            for (const n of nums) {
              const val = parseFloat(n.replace(',', '.'));
              if (val >= min && val <= max) return val;
            }
          }
        }
      }
    }
    return null;
  }

  data.weight = findMetric(['weight', 'poids', 'peso', 'body weight'], 30, 250);
  data.bmi = findMetric(['bmi', 'imc'], 10, 60);
  data.bodyFat = findMetric(['body fat', 'grasa corporal', 'graisse corporelle', 'taux de graisse', 'fat %', 'body fat %'], 3, 60);
  data.fatFreeWeight = findMetric(['fat-free', 'fat free', 'masse maigre', 'masa magra', 'lean'], 20, 150);
  data.subcutFat = findMetric(['subcutaneous', 'sous-cutan', 'subcutan', 'grasa subcutan'], 1, 50);
  data.visceralFat = findMetric(['visceral', 'graisse visc'], 1, 30);
  data.bodyWater = findMetric(['body water', 'eau corporelle', 'agua corporal', 'water %'], 20, 80);
  data.skeletalMuscle = findMetric(['skeletal muscle', 'muscle squelettique', 'musculo esqueletico'], 10, 60);
  data.muscleMass = findMetric(['muscle mass', 'masse musculaire', 'masa muscular'], 20, 120);
  data.boneMass = findMetric(['bone mass', 'masse osseuse', 'masa osea'], 1, 10);
  data.bmr = findMetric(['bmr', 'basal', 'metabolismo basal', 'metabolisme'], 800, 3500);
  data.metabolicAge = findMetric(['metabolic age', 'age metabolique', 'edad metabolica'], 10, 90);

  if (!data.weight) {
    for (const line of lines) {
      const m = line.match(/^[\s]*(\d{2,3}[.,]\d{1,2})\s*(kg)?[\s]*$/i);
      if (m) {
        const v = parseFloat(m[1].replace(',', '.'));
        if (v >= 40 && v <= 200) { data.weight = v; break; }
      }
    }
  }

  const el = document.getElementById('renpho-parsed');
  if (el) {
    const fields = [
      { key: 'weight', label: 'Peso', unit: 'kg', icon: '⚖️' },
      { key: 'bmi', label: 'IMC', unit: '', icon: '📊' },
      { key: 'bodyFat', label: 'Grasa Corporal', unit: '%', icon: '🔴' },
      { key: 'fatFreeWeight', label: 'Masa Magra', unit: 'kg', icon: '💪' },
      { key: 'subcutFat', label: 'Grasa Subcutanea', unit: '%', icon: '📉' },
      { key: 'visceralFat', label: 'Grasa Visceral', unit: '', icon: '🫀' },
      { key: 'bodyWater', label: 'Agua Corporal', unit: '%', icon: '💧' },
      { key: 'skeletalMuscle', label: 'Musculo Esqueletico', unit: '%', icon: '🦴' },
      { key: 'muscleMass', label: 'Masa Muscular', unit: 'kg', icon: '💪' },
      { key: 'boneMass', label: 'Masa Osea', unit: 'kg', icon: '🦴' },
      { key: 'bmr', label: 'BMR', unit: 'kcal', icon: '🔥' },
      { key: 'metabolicAge', label: 'Edad Metabolica', unit: 'anos', icon: '🎂' },
    ];

    const detected = fields.filter(f => data[f.key] != null);
    const inputRows = fields.map(f => `
      <div style="display:flex;align-items:center;gap:8px;padding:4px 0;">
        <span style="font-size:14px;">${f.icon}</span>
        <span style="font-size:12px;color:var(--text-sec);width:120px;">${f.label}</span>
        <input id="renpho-${f.key}" type="number" step="0.1" value="${data[f.key] || ''}" placeholder="-" style="width:80px;padding:6px 8px;border:1px solid ${data[f.key] ? 'var(--teal)' : 'var(--border)'};border-radius:6px;font-size:13px;font-family:inherit;color:var(--text);background:var(--bg);text-align:right;">
        <span style="font-size:11px;color:var(--text-sec);width:30px;">${f.unit}</span>
      </div>
    `).join('');

    el.innerHTML = `
      <div style="font-weight:600;margin-bottom:8px;color:var(--teal);font-size:13px;">${detected.length} metricas detectadas. Corrige si es necesario:</div>
      ${inputRows}
      <button onclick="saveRenphoEntry()" style="margin-top:12px;width:100%;padding:10px;background:var(--teal);color:#fff;border:none;border-radius:8px;font-size:13px;font-weight:600;cursor:pointer;">Guardar en historial</button>
    `;
  }
}

window.processRenphoOCR = async function(file) {
  const { loadTesseract, render } = window.NutrIA;
  if (!file || renphoProcessing) return;
  renphoProcessing = true;
  renphoResult = null;
  render();

  try {
    await loadTesseract();
    const { data: { text } } = await Tesseract.recognize(file, 'eng+fra+spa', {
      logger: m => {
        if (m.status === 'recognizing text') {
          const pct = Math.round((m.progress || 0) * 100);
          const el = document.getElementById('renpho-progress');
          if (el) el.textContent = pct + '%';
        }
      }
    });
    renphoResult = text;
  } catch (e) {
    renphoResult = 'Error OCR: ' + e.message;
  }
  renphoProcessing = false;
  render();
  setTimeout(() => { if (renphoResult) parseRenphoData(renphoResult); }, 100);
};

window.saveRenphoEntry = function() {
  const { showToast, render, getMetaProfile, saveMetaProfile } = window.NutrIA;
  const currentDate = window.NutrIA.currentDate;
  const dateEl = document.getElementById('renpho-date');
  const dateStr = dateEl ? dateEl.value : currentDate;
  const entry = { date: dateStr, source: 'renpho-ocr' };
  const keys = ['weight','bmi','bodyFat','fatFreeWeight','subcutFat','visceralFat','bodyWater','skeletalMuscle','muscleMass','boneMass','bmr','metabolicAge'];
  keys.forEach(k => {
    const el = document.getElementById('renpho-' + k);
    if (el && el.value) entry[k] = parseFloat(el.value);
    else entry[k] = null;
  });
  if (!entry.weight) { showToast('Peso es obligatorio'); return; }

  if (!entry.bmi && entry.weight) {
    const h = 1.75;
    entry.bmi = Math.round(entry.weight / (h * h) * 10) / 10;
  }

  const idx = WEIGHT_LOG.findIndex(w => w.date === currentDate);
  if (idx >= 0) {
    WEIGHT_LOG[idx] = entry;
  } else {
    WEIGHT_LOG.push(entry);
    WEIGHT_LOG.sort((a, b) => a.date.localeCompare(b.date));
  }

  const meta = getMetaProfile();
  if (meta) { meta.weight = entry.weight; saveMetaProfile(meta); }

  fetch('/api/weight', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(entry)
  }).then(r => r.json()).then(d => {
    if (d.ok) showToast(`Peso guardado (${dateStr}): ${entry.weight} kg` + (entry.bodyFat ? ` | ${entry.bodyFat}% grasa` : ''));
    else showToast('Error guardando peso');
  }).catch(() => showToast('Guardado local (server offline)'));
  renphoResult = null;
  render();
};

window.saveManualWeight = function() {
  const { showToast, render } = window.NutrIA;
  const currentDate = window.NutrIA.currentDate;
  const w = parseFloat(document.getElementById('manual-weight').value);
  if (!w || w < 30 || w > 300) { showToast('Peso invalido'); return; }
  const dateEl = document.getElementById('renpho-date');
  const dateStr = dateEl ? dateEl.value : currentDate;

  const entry = {
    date: dateStr,
    weight: w,
    bmi: Math.round(w / (1.75 * 1.75) * 10) / 10,
    bodyFat: null, fatFreeWeight: null, subcutFat: null, visceralFat: null,
    bodyWater: null, skeletalMuscle: null, muscleMass: null, boneMass: null,
    bmr: null, metabolicAge: null,
    source: 'manual'
  };

  const idx = WEIGHT_LOG.findIndex(e => e.date === dateStr);
  if (idx >= 0) WEIGHT_LOG[idx] = entry;
  else { WEIGHT_LOG.push(entry); WEIGHT_LOG.sort((a, b) => a.date.localeCompare(b.date)); }

  fetch('/api/weight', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(entry)
  }).then(r => r.json()).then(d => {
    if (d.ok) showToast(`Peso guardado (${dateStr}): ${w} kg (IMC ${entry.bmi})`);
  }).catch(() => showToast('Guardado local (server offline)'));
  render();
};

window.calcMetabolism = function() {
  const { USERS, getMetaProfile, saveMetaProfile } = window.NutrIA;
  const currentUser = window.NutrIA.currentUser;
  const age = parseInt(document.getElementById('meta-age').value) || 0;
  const weight = parseFloat(document.getElementById('meta-weight').value) || 0;
  const height = parseFloat(document.getElementById('meta-height').value) || 0;
  const sex = document.getElementById('meta-sex').value;
  const activity = parseFloat(document.getElementById('meta-activity').value) || 1.2;
  const goal = document.getElementById('meta-goal').value;

  if (!age || !weight || !height) return;

  let bmr;
  if (sex === 'M') {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  }

  const tdee = bmr * activity;

  let targetKcal, protGkg, note;
  if (goal === 'cut') {
    targetKcal = tdee - 500;
    protGkg = 2.0;
    note = 'Deficit de 500 kcal/dia (~0.45 kg/semana)';
  } else if (goal === 'aggro') {
    targetKcal = tdee - 750;
    protGkg = 2.2;
    note = 'Deficit agresivo de 750 kcal/dia (~0.7 kg/semana). Riesgo de perder musculo si no entrenas.';
  } else if (goal === 'bulk') {
    targetKcal = tdee + 300;
    protGkg = 1.8;
    note = 'Superavit de 300 kcal/dia para ganar masa';
  } else {
    targetKcal = tdee;
    protGkg = 1.6;
    note = 'Mantenimiento';
  }

  const prot = Math.round(weight * protGkg);
  const fat = Math.round(weight * 0.8);
  const protKcal = prot * 4;
  const fatKcal = fat * 9;
  const carbsKcal = targetKcal - protKcal - fatKcal;
  const carbs = Math.max(50, Math.round(carbsKcal / 4));

  saveMetaProfile({ age, weight, height, sex, activity, goal, bmr: Math.round(bmr), tdee: Math.round(tdee) });

  const el = document.getElementById('meta-results');
  if (el) {
    el.innerHTML = `
      <div style="background:var(--card);border:1px solid var(--border);border-radius:var(--radius);padding:16px;margin-top:16px;">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px;">
          <div style="text-align:center;padding:12px;background:var(--bg);border-radius:8px;">
            <div style="font-size:24px;font-weight:700;color:var(--teal);">${Math.round(bmr)}</div>
            <div style="font-size:10px;color:var(--text-sec);text-transform:uppercase;letter-spacing:1px;font-weight:600;">BMR (kcal)</div>
          </div>
          <div style="text-align:center;padding:12px;background:var(--bg);border-radius:8px;">
            <div style="font-size:24px;font-weight:700;color:var(--teal);">${Math.round(tdee)}</div>
            <div style="font-size:10px;color:var(--text-sec);text-transform:uppercase;letter-spacing:1px;font-weight:600;">TDEE (kcal)</div>
          </div>
        </div>
        <div style="font-size:12px;color:var(--text-sec);margin-bottom:12px;font-style:italic;">${note}</div>
        <div style="font-size:11px;font-weight:600;letter-spacing:1px;text-transform:uppercase;color:var(--teal);margin-bottom:8px;">Macros recomendados</div>
        <table style="width:100%;border-collapse:collapse;font-size:13px;">
          <tr style="background:var(--teal);color:#fff;"><th style="padding:6px 8px;text-align:left;">Macro</th><th style="padding:6px 8px;text-align:right;">Diario</th><th style="padding:6px 8px;text-align:right;">g/kg</th></tr>
          <tr><td style="padding:5px 8px;">Calorias</td><td style="padding:5px 8px;text-align:right;font-weight:600;">${Math.round(targetKcal)} kcal</td><td style="padding:5px 8px;text-align:right;">-</td></tr>
          <tr style="background:var(--bg);"><td style="padding:5px 8px;">Proteina</td><td style="padding:5px 8px;text-align:right;font-weight:600;">${prot} g</td><td style="padding:5px 8px;text-align:right;">${protGkg}</td></tr>
          <tr><td style="padding:5px 8px;">Carbohidratos</td><td style="padding:5px 8px;text-align:right;font-weight:600;">${carbs} g</td><td style="padding:5px 8px;text-align:right;">${(carbs/weight).toFixed(1)}</td></tr>
          <tr style="background:var(--bg);"><td style="padding:5px 8px;">Grasas</td><td style="padding:5px 8px;text-align:right;font-weight:600;">${fat} g</td><td style="padding:5px 8px;text-align:right;">0.8</td></tr>
        </table>
        <button onclick="applyMetaTargets(${Math.round(targetKcal)},${prot},${carbs},${fat})" style="margin-top:12px;width:100%;padding:10px;background:var(--teal);color:#fff;border:none;border-radius:8px;font-size:13px;font-weight:600;cursor:pointer;">Aplicar como objetivos</button>
      </div>`;
  }
};

window.openUploadDish = function () {
  const { USERS, round1 } = window.NutrIA;
  const currentUser = window.NutrIA.currentUser;
  const authorName = USERS[currentUser].name;
  const overlay = document.createElement('div');
  overlay.className = 'upload-modal-overlay';
  overlay.id = 'upload-modal-overlay';
  overlay.onclick = function (e) { if (e.target === overlay) window.closeUploadDish(); };
  overlay.innerHTML = `
    <div class="upload-modal">
      <h3>Subir plato</h3>
      <label>Nombre del plato</label>
      <input id="upload-name" type="text" placeholder="Ej: Pasta carbonara" />
      <label>Porcion (gramos)</label>
      <input id="upload-portion" type="number" min="1" step="1" placeholder="Ej: 350" />
      <div class="upload-macros-grid">
        <div><label>Calorias (kcal)</label><input id="upload-kcal" type="number" min="0" step="1" placeholder="0" /></div>
        <div><label>Proteina (g)</label><input id="upload-prot" type="number" min="0" step="0.1" placeholder="0" /></div>
        <div><label>Carbos (g)</label><input id="upload-carbs" type="number" min="0" step="0.1" placeholder="0" /></div>
        <div><label>Grasa (g)</label><input id="upload-fat" type="number" min="0" step="0.1" placeholder="0" /></div>
      </div>
      <label>Autor</label>
      <select id="upload-author">
        ${Object.entries(USERS).map(([k, v]) => `<option value="${v.name}" ${k === currentUser ? 'selected' : ''}>${v.name}</option>`).join('')}
      </select>
      <div class="upload-actions">
        <button class="upload-btn-cancel" onclick="closeUploadDish()">Cancelar</button>
        <button class="upload-btn-save" onclick="saveUploadDish()">Guardar</button>
      </div>
    </div>`;
  document.body.appendChild(overlay);
  document.getElementById('upload-name').focus();
};

window.closeUploadDish = function () {
  const overlay = document.getElementById('upload-modal-overlay');
  if (overlay) overlay.remove();
};

window.saveUploadDish = function () {
  const { round1, showToast, render, getTodayStr } = window.NutrIA;
  const name = document.getElementById('upload-name').value.trim();
  const portion = parseFloat(document.getElementById('upload-portion').value);
  const kcal = parseFloat(document.getElementById('upload-kcal').value) || 0;
  const prot = parseFloat(document.getElementById('upload-prot').value) || 0;
  const carbs = parseFloat(document.getElementById('upload-carbs').value) || 0;
  const fat = parseFloat(document.getElementById('upload-fat').value) || 0;
  const author = document.getElementById('upload-author').value;

  if (!name) { alert('Ingresa el nombre del plato.'); return; }
  if (!portion || portion <= 0) { alert('Ingresa los gramos de la porcion.'); return; }

  const per100g = {
    kcal: round1(kcal / portion * 100),
    prot: round1(prot / portion * 100),
    carbs: round1(carbs / portion * 100),
    fat: round1(fat / portion * 100),
    fiber: 0
  };

  const id = name.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  if (FOOD_DATABASE.find(f => f.id === id)) {
    alert('Ya existe un alimento con ID "' + id + '". Usa otro nombre.');
    return;
  }

  const newFood = {
    id,
    name,
    brand: author,
    per100g,
    totalG: portion,
    source: 'manual',
    author: author,
    addedDate: getTodayStr()
  };

  FOOD_DATABASE.unshift(newFood);

  fetch('/api/add-food', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newFood)
  }).catch(() => {});

  window.closeUploadDish();
  showToast('🍽️ "' + name + '" subido por ' + author + ' (' + portion + 'g)');
  render();
};
