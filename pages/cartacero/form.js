// ============================================================
// CARTA CERO — FRONT OFFICE LOGIC
// pages/cartacero/form.js
// ============================================================

// --- CIE10 datalist -----------------------------------------

function populateCie10Datalist() {
  const datalist = document.getElementById('cie10List');
  if (!datalist || typeof cie10Data === 'undefined') return;
  const fragment = document.createDocumentFragment();
  cie10Data.forEach(({ codigo, descripcion }) => {
    const opt = document.createElement('option');
    opt.value = codigo;
    opt.label = descripcion;
    fragment.appendChild(opt);
  });
  datalist.appendChild(fragment);
}

function setupCie10Autofill() {
  const codeInput = document.getElementById('cie10');
  const descInput = document.getElementById('cie10Desc');
  if (!codeInput || !descInput || typeof cie10Data === 'undefined') return;

  codeInput.addEventListener('input', () => {
    const val = codeInput.value.trim().toUpperCase();
    const match = cie10Data.find(item => item.codigo === val);
    if (match && !descInput.value) {
      descInput.value = match.descripcion;
    } else if (!match) {
      descInput.value = '';
    }
  });
}

// --- Prestador logic ----------------------------------------

const BENEFICIO_OPTIONS = {
  default: ['Ambulatorio', 'Hospitalario', 'Chequeo preventivo'],
  'Sanna El Golf': ['Ambulatorio'],
};

function setupPrestadorLogic() {
  const prestadorSel  = document.getElementById('prestador');
  const beneficioSel  = document.getElementById('beneficio');
  const solicitudRow  = document.getElementById('solicitudPorRow');
  const solicitudSel  = document.getElementById('solicitudPor');
  if (!prestadorSel) return;

  prestadorSel.addEventListener('change', () => {
    const val = prestadorSel.value;

    // Update Beneficio options
    const opts = BENEFICIO_OPTIONS[val] || BENEFICIO_OPTIONS.default;
    beneficioSel.innerHTML = '<option value="">Seleccionar...</option>';
    opts.forEach(o => {
      const el = document.createElement('option');
      el.value = o;
      el.textContent = o;
      beneficioSel.appendChild(el);
    });
    if (opts.length === 1) beneficioSel.value = opts[0];

    // Show / hide Solicitud por
    if (val === 'San Felipe') {
      solicitudRow.classList.remove('form__row--hidden');
      solicitudRow.classList.add('form__row--visible');
      solicitudRow.removeAttribute('aria-hidden');
      solicitudSel.setAttribute('required', '');
      solicitudSel.setAttribute('aria-required', 'true');
    } else {
      solicitudRow.classList.add('form__row--hidden');
      solicitudRow.classList.remove('form__row--visible');
      solicitudRow.setAttribute('aria-hidden', 'true');
      solicitudSel.removeAttribute('required');
      solicitudSel.setAttribute('aria-required', 'false');
      solicitudSel.value = '';
    }
  });
}

// --- Default datetime ---------------------------------------

function setDefaultDatetime() {
  const el = document.getElementById('fechaAtencion');
  if (!el) return;
  const now = new Date();
  now.setSeconds(0, 0);
  el.value = now.toISOString().slice(0, 16);
}

// --- Alert system -------------------------------------------

function showAlert(message, type = 'success') {
  const area = document.getElementById('alertArea');
  area.innerHTML = '';
  const div = document.createElement('div');
  div.className = `alert alert--${type}`;
  div.textContent = message;
  area.appendChild(div);
  setTimeout(() => div.remove(), 6000);
}

// --- Validation ---------------------------------------------

function validate(data) {
  if (!data.prestador)                           return 'Seleccione un Prestador.';
  if (!data.compania)                            return 'Seleccione una Compañía.';
  if (!data.beneficio)                           return 'Seleccione un Beneficio.';
  if (!data.prestacion.trim())                   return 'Ingrese la Prestación.';
  if (!data.cie10.trim())                        return 'Ingrese el código CIE10.';
  if (!data.monto || data.monto <= 0)            return 'Ingrese un Monto válido (mayor a 0).';
  if (!data.fecha_atencion)                      return 'Seleccione la Fecha y Hora de Atención.';
  if (data.prestador === 'San Felipe' && !data.solicitud_por)
                                                 return 'Seleccione el tipo de Solicitud (requerido para San Felipe).';
  return null;
}

// --- Submit -------------------------------------------------

async function handleSubmit(e) {
  e.preventDefault();

  const btn = document.getElementById('btnSubmit');

  const data = {
    prestador:      document.getElementById('prestador').value,
    compania:       document.getElementById('compania').value,
    // PÓLIZA: disabled — to enable, uncomment the line below and update register.js
    // poliza:      document.getElementById('poliza').value,
    beneficio:      document.getElementById('beneficio').value,
    prestacion:     document.getElementById('prestacion').value,
    cie10:          document.getElementById('cie10').value.trim().toUpperCase(),
    cie10_desc:     document.getElementById('cie10Desc').value.trim(),
    monto:          parseFloat(document.getElementById('monto').value),
    fecha_atencion: document.getElementById('fechaAtencion').value,
    solicitud_por:  document.getElementById('solicitudPor').value || null,
  };

  const error = validate(data);
  if (error) { showAlert(error, 'error'); return; }

  btn.classList.add('btn--loading');
  btn.disabled = true;

  try {
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Error al registrar.');
    showAlert('Atención registrada correctamente.', 'success');
    resetForm();
  } catch (err) {
    showAlert(err.message || 'Error de conexión. Intente nuevamente.', 'error');
  } finally {
    btn.classList.remove('btn--loading');
    btn.disabled = false;
  }
}

// --- Reset --------------------------------------------------

function resetForm() {
  document.getElementById('atencionForm').reset();
  setDefaultDatetime();

  const row = document.getElementById('solicitudPorRow');
  row.classList.add('form__row--hidden');
  row.classList.remove('form__row--visible');
  row.setAttribute('aria-hidden', 'true');

  const beneficioSel = document.getElementById('beneficio');
  beneficioSel.innerHTML = `
    <option value="">Seleccionar...</option>
    <option value="Ambulatorio">Ambulatorio</option>
    <option value="Hospitalario">Hospitalario</option>
    <option value="Chequeo preventivo">Chequeo preventivo</option>
  `;
}

// --- Init ---------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
  populateCie10Datalist();
  setupCie10Autofill();
  setupPrestadorLogic();
  setDefaultDatetime();

  document.getElementById('atencionForm').addEventListener('submit', handleSubmit);
  document.getElementById('btnReset').addEventListener('click', resetForm);
});
