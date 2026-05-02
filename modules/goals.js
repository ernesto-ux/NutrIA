// NutrIA — Goals module
// Loaded AFTER the main IIFE. All helpers accessed via window.NutrIA.

window.openTargetsModal = function () {
  const { TARGETS, USERS } = window.NutrIA;
  const currentUser = window.NutrIA.currentUser;
  const t = TARGETS();
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.id = 'targets-modal';
  overlay.onclick = function (e) { if (e.target === overlay) window.closeTargetsModal(); };
  overlay.innerHTML = `
    <div class="modal-box">
      <div class="modal-title">Ajustar objetivos</div>
      <div class="modal-sub">Dieta de ${USERS[currentUser].name}. Los cambios se guardan en este dispositivo.</div>
      <div class="modal-field">
        <span class="modal-label">Calorias (kcal)</span>
        <input class="modal-input" id="target-kcal" type="number" value="${t.kcal}" />
      </div>
      <div class="modal-field">
        <span class="modal-label">Proteina (g)</span>
        <input class="modal-input" id="target-prot" type="number" value="${t.prot}" />
      </div>
      <div class="modal-field">
        <span class="modal-label">Carbs (g)</span>
        <input class="modal-input" id="target-carbs" type="number" value="${t.carbs}" />
      </div>
      <div class="modal-field">
        <span class="modal-label">Grasas (g)</span>
        <input class="modal-input" id="target-fat" type="number" value="${t.fat}" />
      </div>
      <div class="modal-actions">
        <button class="modal-btn modal-btn-cancel" onclick="closeTargetsModal()">Cancelar</button>
        <button class="modal-btn modal-btn-save" onclick="saveTargets()">Guardar</button>
      </div>
    </div>`;
  document.body.appendChild(overlay);
};

window.closeTargetsModal = function () {
  const el = document.getElementById('targets-modal');
  if (el) el.remove();
};

window.saveTargets = function () {
  const { USERS, showToast, render } = window.NutrIA;
  const currentUser = window.NutrIA.currentUser;
  const kcal = parseInt(document.getElementById('target-kcal').value) || 0;
  const prot = parseInt(document.getElementById('target-prot').value) || 0;
  const carbs = parseInt(document.getElementById('target-carbs').value) || 0;
  const fat = parseInt(document.getElementById('target-fat').value) || 0;
  if (kcal <= 0) return;
  USERS[currentUser].targets = { kcal, prot, carbs, fat };
  localStorage.setItem('nutria_targets_' + currentUser, JSON.stringify({ kcal, prot, carbs, fat }));
  window.closeTargetsModal();
  showToast('Objetivos actualizados: ' + kcal + ' kcal');
  render();
};

window.applyMetaTargets = function(kcal, prot, carbs, fat) {
  const { USERS, showToast, render } = window.NutrIA;
  const currentUser = window.NutrIA.currentUser;
  USERS[currentUser].targets = { kcal, prot, carbs, fat };
  localStorage.setItem('nutria_targets_' + currentUser, JSON.stringify({ kcal, prot, carbs, fat }));
  showToast('Objetivos actualizados: ' + kcal + ' kcal | ' + prot + 'g prot');
  render();
};
