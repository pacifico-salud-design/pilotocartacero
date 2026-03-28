// ============================================================
// CARTA CERO — FRONT OFFICE LOGIC
// pages/cartacero/form.js
// ============================================================

// --- SVG constants ------------------------------------------

const SVG_CHEVRON_DOWN = `<svg class="dropdown__chevron" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M16.59 8.29L12 12.87L7.41 8.29L6 9.7L12 15.7L18 9.7L16.59 8.29Z" fill="currentColor"/></svg>`;

const SVG_CHECKMARK = `<svg class="dropdown__option-check" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M2.5 8L6.5 12L13.5 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

// Registry of all open/close functions to allow closing all on outside click
const allDropdownCloseFns = [];

// --- Dropdown component -------------------------------------

/**
 * Initialise a custom dropdown from the .dropdown component markup.
 * Returns an API object: { getValue, setValue, reset, rebuildOptions }.
 */
function initDropdown(wrapperId, options, onChange) {
  const wrapper     = document.getElementById(wrapperId);
  if (!wrapper) return null;

  const trigger     = wrapper.querySelector('.dropdown__trigger');
  const menu        = wrapper.querySelector('.dropdown__menu');
  const valueSpan   = wrapper.querySelector('.dropdown__value');
  const hiddenInput = wrapper.querySelector('input[type="hidden"]');

  function buildOptions(opts) {
    menu.innerHTML = '';
    opts.forEach(({ value, label }) => {
      const opt = document.createElement('div');
      opt.className = 'dropdown__option';
      opt.setAttribute('role', 'option');
      opt.setAttribute('aria-selected', 'false');
      opt.dataset.value = value;
      opt.innerHTML = `<span>${label}</span>${SVG_CHECKMARK}`;
      menu.appendChild(opt);
    });
  }

  function open() {
    // Close all other dropdowns first
    allDropdownCloseFns.forEach(fn => fn !== close && fn());
    wrapper.classList.add('is-open');
    trigger.setAttribute('aria-expanded', 'true');
  }

  function close() {
    wrapper.classList.remove('is-open');
    trigger.setAttribute('aria-expanded', 'false');
  }

  function toggle() {
    wrapper.classList.contains('is-open') ? close() : open();
  }

  function selectOption(val, label) {
    if (hiddenInput) hiddenInput.value = val;
    valueSpan.textContent = label;
    trigger.classList.add('dropdown__trigger--has-value');

    menu.querySelectorAll('.dropdown__option').forEach(o => {
      const selected = o.dataset.value === val;
      o.classList.toggle('dropdown__option--selected', selected);
      o.setAttribute('aria-selected', selected ? 'true' : 'false');
    });

    close();
    trigger.focus();
    if (onChange) onChange(val);
  }

  function reset() {
    if (hiddenInput) hiddenInput.value = '';
    valueSpan.textContent = 'Seleccionar...';
    trigger.classList.remove('dropdown__trigger--has-value');
    menu.querySelectorAll('.dropdown__option').forEach(o => {
      o.classList.remove('dropdown__option--selected');
      o.setAttribute('aria-selected', 'false');
    });
    close();
  }

  function getValue() {
    return hiddenInput ? hiddenInput.value : '';
  }

  // Events
  trigger.addEventListener('click', e => { e.stopPropagation(); toggle(); });
  trigger.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
    if (e.key === 'Escape') { close(); trigger.focus(); }
  });
  menu.addEventListener('click', e => {
    const opt = e.target.closest('.dropdown__option');
    if (!opt) return;
    e.stopPropagation();
    selectOption(opt.dataset.value, opt.querySelector('span').textContent);
  });
  // Stop propagation so the document click handler doesn't close it immediately
  wrapper.addEventListener('click', e => e.stopPropagation());

  allDropdownCloseFns.push(close);
  buildOptions(options);

  return { getValue, selectOption, reset, rebuildOptions: buildOptions };
}

// --- CIE10 search-input component ---------------------------

function initCie10SearchInput() {
  const wrapper    = document.getElementById('si-cie10');
  if (!wrapper || typeof cie10Data === 'undefined') return null;

  const input      = wrapper.querySelector('.search-input__input');
  const menu       = wrapper.querySelector('.search-input__menu');
  const clearBtn   = wrapper.querySelector('.search-input__clear');
  const helper     = wrapper.querySelector('.search-input__helper');
  const hiddenCode = document.getElementById('cie10');
  const descInput  = document.getElementById('cie10Desc');

  let activeIndex = -1;

  function escHtml(str) {
    return str.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }

  function highlight(text, query) {
    if (!query) return escHtml(text);
    const idx = text.toLowerCase().indexOf(query.toLowerCase());
    if (idx === -1) return escHtml(text);
    return escHtml(text.slice(0, idx)) +
           '<mark>' + escHtml(text.slice(idx, idx + query.length)) + '</mark>' +
           escHtml(text.slice(idx + query.length));
  }

  function filterCie10(query) {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    const results = [];
    for (let i = 0; i < cie10Data.length && results.length < 50; i++) {
      const item = cie10Data[i];
      if (item.codigo.toLowerCase().startsWith(q) || item.descripcion.toLowerCase().includes(q)) {
        results.push(item);
      }
    }
    return results;
  }

  function setHelper(msg, type) {
    helper.textContent = msg;
    helper.className = 'search-input__helper';
    if (type) helper.classList.add('search-input__helper--' + type);
  }

  function openMenu() {
    wrapper.classList.add('is-open');
    input.setAttribute('aria-expanded', 'true');
  }

  function closeMenu() {
    wrapper.classList.remove('is-open');
    input.setAttribute('aria-expanded', 'false');
    activeIndex = -1;
  }

  function renderMenu(query) {
    const results = filterCie10(query);
    menu.innerHTML = '';
    activeIndex = -1;

    if (results.length === 0) {
      menu.innerHTML =
        '<li class="search-input__empty" role="option">No se encontraron resultados para "<strong>' +
        escHtml(query) + '</strong>"</li>';
      setHelper('Sin coincidencias. Intente con otro término.');
      openMenu();
      return;
    }

    results.forEach(item => {
      const li = document.createElement('li');
      li.className = 'search-input__option';
      li.setAttribute('role', 'option');
      li.dataset.code = item.codigo;
      li.dataset.desc = item.descripcion;
      li.innerHTML =
        '<strong>' + highlight(item.codigo, query) + '</strong>&nbsp;&mdash;&nbsp;' +
        highlight(item.descripcion, query);
      li.addEventListener('mousedown', e => {
        e.preventDefault();
        selectValue(item.codigo, item.descripcion);
      });
      menu.appendChild(li);
    });

    const count = results.length;
    setHelper(count + (count === 1 ? ' resultado' : ' resultados') +
              (count >= 50 ? ' (primeros 50)' : ''));
    openMenu();
  }

  function selectValue(code, desc) {
    input.value = code;
    input.classList.add('search-input__input--has-value');
    wrapper.classList.add('search-input--selected');
    clearBtn.hidden = false;
    if (hiddenCode) hiddenCode.value = code;
    if (descInput)  descInput.value  = desc;
    closeMenu();
    setHelper('CIE10 seleccionado', 'selected');
  }

  function clearValue() {
    input.value = '';
    input.classList.remove('search-input__input--has-value');
    wrapper.classList.remove('search-input--selected');
    clearBtn.hidden = true;
    if (hiddenCode) hiddenCode.value = '';
    if (descInput)  descInput.value  = '';
    input.focus();
    setHelper('Escriba código o descripción para buscar');
    closeMenu();
  }

  function updateActiveItem() {
    const options = menu.querySelectorAll('.search-input__option');
    options.forEach((opt, i) => {
      if (i === activeIndex) {
        opt.classList.add('is-active');
        opt.scrollIntoView({ block: 'nearest' });
      } else {
        opt.classList.remove('is-active');
      }
    });
  }

  input.addEventListener('input', () => {
    wrapper.classList.remove('search-input--selected');
    input.classList.remove('search-input__input--has-value');
    clearBtn.hidden = !input.value;
    if (hiddenCode) hiddenCode.value = '';
    if (descInput && !input.value) descInput.value = '';
    if (input.value) {
      renderMenu(input.value);
    } else {
      closeMenu();
      setHelper('Escriba código o descripción para buscar');
    }
  });

  input.addEventListener('focus', () => {
    if (input.value && !wrapper.classList.contains('search-input--selected')) {
      renderMenu(input.value);
    }
  });

  input.addEventListener('blur', () => {
    setTimeout(() => closeMenu(), 150);
  });

  input.addEventListener('keydown', e => {
    const options = menu.querySelectorAll('.search-input__option');
    if (!wrapper.classList.contains('is-open')) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      activeIndex = Math.min(activeIndex + 1, options.length - 1);
      updateActiveItem();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      activeIndex = Math.max(activeIndex - 1, 0);
      updateActiveItem();
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault();
      const opt = options[activeIndex];
      selectValue(opt.dataset.code, opt.dataset.desc);
    } else if (e.key === 'Escape') {
      closeMenu();
    }
  });

  clearBtn.addEventListener('click', clearValue);
  setHelper('Escriba código o descripción para buscar');

  return { clearValue };
}

// --- Prestador / Beneficio logic ----------------------------

const BENEFICIO_OPTIONS = {
  default: ['Ambulatorio', 'Hospitalario', 'Chequeo preventivo'],
  'Sanna El Golf': ['Ambulatorio'],
};

// Module-level dropdown instances (used by resetForm)
let ddBeneficio    = null;
let ddSolicitud    = null;
let ddPrestador    = null;
let ddCompania     = null;
let cie10Search    = null;

function setupForm() {
  ddCompania = initDropdown('dd-compania', [
    { value: 'EPS',  label: 'EPS'  },
    { value: 'AMED', label: 'AMED' },
  ]);

  ddBeneficio = initDropdown('dd-beneficio',
    BENEFICIO_OPTIONS.default.map(o => ({ value: o, label: o }))
  );

  ddSolicitud = initDropdown('dd-solicitud', [
    { value: 'Cirugía',             label: 'Cirugía'             },
    { value: 'Tratamiento médico',  label: 'Tratamiento médico'  },
    { value: 'Hospitalización',     label: 'Hospitalización'     },
  ]);

  ddPrestador = initDropdown('dd-prestador', [
    { value: 'San Felipe',    label: 'San Felipe'    },
    { value: 'Sanna El Golf', label: 'Sanna El Golf' },
    { value: 'CC Miraflores', label: 'CC Miraflores' },
    { value: 'CC San Miguel', label: 'CC San Miguel' },
  ], (val) => {
    // Rebuild Beneficio options for this prestador
    const opts = (BENEFICIO_OPTIONS[val] || BENEFICIO_OPTIONS.default)
      .map(o => ({ value: o, label: o }));
    ddBeneficio.rebuildOptions(opts);
    ddBeneficio.reset();
    if (opts.length === 1) ddBeneficio.selectOption(opts[0].value, opts[0].label);

    // Show / hide Solicitud por row
    const row = document.getElementById('solicitudPorRow');
    if (val === 'San Felipe') {
      row.classList.remove('form__row--hidden');
      row.classList.add('form__row--visible');
      row.removeAttribute('aria-hidden');
    } else {
      row.classList.add('form__row--hidden');
      row.classList.remove('form__row--visible');
      row.setAttribute('aria-hidden', 'true');
      ddSolicitud.reset();
    }
  });

  cie10Search = initCie10SearchInput();
}

// --- Default datetime ---------------------------------------

function setDefaultDatetime() {
  const el = document.getElementById('fechaAtencion');
  if (!el) return;
  // Format in Lima timezone (America/Lima = UTC-5, no DST).
  // sv-SE locale produces the YYYY-MM-DD HH:mm format required by datetime-local.
  const formatted = new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'America/Lima',
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hour12: false,
  }).format(new Date());
  el.value = formatted.replace(' ', 'T');
}

// --- Alert system -------------------------------------------

function showAlert(message, type = 'success') {
  const area = document.getElementById('alertArea');
  area.innerHTML = '';
  const div = document.createElement('div');
  // Use alert--danger (not alert--error) to match the alert component
  const variantClass = type === 'error' ? 'alert--danger' : `alert--${type}`;
  div.className = `alert ${variantClass}`;
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
  if (!data.cie10.trim())                        return 'Seleccione un código CIE10 de la lista.';
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

  // Reset all custom dropdowns visually
  ddPrestador  && ddPrestador.reset();
  ddCompania   && ddCompania.reset();
  ddSolicitud  && ddSolicitud.reset();
  if (ddBeneficio) {
    ddBeneficio.rebuildOptions(BENEFICIO_OPTIONS.default.map(o => ({ value: o, label: o })));
    ddBeneficio.reset();
  }

  // Hide solicitudPorRow
  const row = document.getElementById('solicitudPorRow');
  row.classList.add('form__row--hidden');
  row.classList.remove('form__row--visible');
  row.setAttribute('aria-hidden', 'true');

  // Reset CIE10 search input
  cie10Search && cie10Search.clearValue();
}

// --- Close all dropdowns on outside click -------------------

document.addEventListener('click', () => {
  allDropdownCloseFns.forEach(fn => fn());
});

// --- Init ---------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
  setupForm();
  setDefaultDatetime();

  document.getElementById('atencionForm').addEventListener('submit', handleSubmit);
  document.getElementById('btnReset').addEventListener('click', resetForm);
});
