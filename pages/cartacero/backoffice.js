// ============================================================
// CARTA CERO — BACK OFFICE LOGIC
// pages/cartacero/backoffice.js
// ============================================================

const TOKEN_KEY = 'cartacero_bo_token';

// --- Token storage (sessionStorage — cleared on tab close) --

function getToken()        { return sessionStorage.getItem(TOKEN_KEY); }
function setToken(t)       { sessionStorage.setItem(TOKEN_KEY, t); }
function clearToken()      { sessionStorage.removeItem(TOKEN_KEY); }

// --- Screen management --------------------------------------

function showDashboard() {
  document.getElementById('loginScreen').style.display = 'none';
  document.getElementById('dashboard').removeAttribute('hidden');
  loadRecords();
}

function showLogin() {
  document.getElementById('loginScreen').style.display = '';
  document.getElementById('dashboard').setAttribute('hidden', '');
  document.getElementById('password').value = '';
}

// --- Login --------------------------------------------------

async function handleLogin(e) {
  e.preventDefault();
  const btn       = document.getElementById('loginBtn');
  const passInput = document.getElementById('password');
  const alert     = document.getElementById('loginAlert');

  btn.classList.add('btn--loading');
  btn.disabled = true;
  alert.textContent = '';
  alert.className = 'login-card__alert';

  try {
    const res  = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: passInput.value }),
    });
    const data = await res.json();

    if (!res.ok) {
      alert.textContent = data.error || 'Error al iniciar sesión.';
      alert.classList.add('login-card__alert--error');
      return;
    }

    setToken(data.token);
    showDashboard();
  } catch {
    alert.textContent = 'Error de conexión. Intente nuevamente.';
    alert.classList.add('login-card__alert--error');
  } finally {
    btn.classList.remove('btn--loading');
    btn.disabled = false;
  }
}

// --- Logout -------------------------------------------------

function handleLogout() {
  clearToken();
  showLogin();
}

// --- Load records -------------------------------------------

let currentRecords = [];

async function loadRecords() {
  const token = getToken();
  if (!token) { showLogin(); return; }

  setTableStatus('Cargando registros...');

  const desde = document.getElementById('filterDesde').value;
  const hasta = document.getElementById('filterHasta').value;

  const params = new URLSearchParams();
  if (desde) params.set('desde', desde);
  if (hasta) params.set('hasta', hasta);
  const qs = params.toString() ? '?' + params.toString() : '';

  try {
    const res = await fetch(`/api/records${qs}`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });

    if (res.status === 401) {
      clearToken();
      showLogin();
      return;
    }

    if (!res.ok) throw new Error('Error al cargar registros.');

    currentRecords = await res.json();
    renderTable(currentRecords);
    renderKPIs(currentRecords);
    setTableStatus(
      currentRecords.length === 0
        ? 'No hay registros para el período seleccionado.'
        : `${currentRecords.length} registro${currentRecords.length !== 1 ? 's' : ''} encontrado${currentRecords.length !== 1 ? 's' : ''}.`
    );
  } catch (err) {
    setTableStatus('Error al cargar los datos. Intente nuevamente.');
    console.error(err);
  }
}

// --- Render table -------------------------------------------

function fmtDate(isoStr) {
  if (!isoStr) return '—';
  return new Date(isoStr).toLocaleString('es-PE', {
    dateStyle: 'short',
    timeStyle: 'short',
  });
}

function fmtMonto(val) {
  if (val == null) return '—';
  return parseFloat(val).toLocaleString('es-PE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function esc(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderTable(records) {
  const tbody = document.getElementById('recordsBody');

  if (!records.length) {
    tbody.innerHTML = '<tr><td colspan="9" class="table__empty">No hay registros para mostrar.</td></tr>';
    return;
  }

  tbody.innerHTML = records.map(r => `
    <tr class="table__row">
      <td class="table__td">${fmtDate(r.fecha_atencion)}</td>
      <td class="table__td">${esc(r.prestador)}</td>
      <td class="table__td">
        <span class="badge badge--${r.compania === 'EPS' ? 'eps' : 'amed'}">${esc(r.compania)}</span>
      </td>
      <td class="table__td">${esc(r.beneficio)}</td>
      <td class="table__td table__td--wrap">${esc(r.prestacion)}</td>
      <td class="table__td table__td--code">${esc(r.cie10)}</td>
      <td class="table__td">${esc(r.cie10_desc)}</td>
      <td class="table__td">${r.solicitud_por ? esc(r.solicitud_por) : '<span style="color:var(--neutral-color-medium)">—</span>'}</td>
      <td class="table__td table__td--num">S/&nbsp;${fmtMonto(r.monto)}</td>
    </tr>
  `).join('');
}

// --- KPIs ---------------------------------------------------

function renderKPIs(records) {
  const total = records.length;
  const monto = records.reduce((s, r) => s + (parseFloat(r.monto) || 0), 0);
  const eps   = records.filter(r => r.compania === 'EPS').length;
  const amed  = records.filter(r => r.compania === 'AMED').length;

  document.getElementById('kpiTotal').textContent = total.toLocaleString('es-PE');
  document.getElementById('kpiMonto').textContent = 'S/ ' + monto.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  document.getElementById('kpiEPS').textContent   = eps.toLocaleString('es-PE');
  document.getElementById('kpiAMED').textContent  = amed.toLocaleString('es-PE');
}

// --- Table status -------------------------------------------

function setTableStatus(msg) {
  document.getElementById('tableStatus').textContent = msg;
}

// --- Clear filter -------------------------------------------

function clearFilter() {
  document.getElementById('filterDesde').value = '';
  document.getElementById('filterHasta').value = '';
  loadRecords();
}

// --- CSV export ---------------------------------------------

function exportCSV() {
  if (!currentRecords.length) return;

  const headers = [
    'Fecha', 'Prestador', 'Compañía', 'Beneficio',
    'Prestación', 'CIE10', 'Descripción CIE10', 'Solicitud por', 'Monto (S/)',
  ];

  const rows = currentRecords.map(r => [
    fmtDate(r.fecha_atencion),
    r.prestador,
    r.compania,
    r.beneficio,
    r.prestacion,
    r.cie10,
    r.cie10_desc ?? '',
    r.solicitud_por ?? '',
    fmtMonto(r.monto),
  ].map(cell => `"${String(cell).replace(/"/g, '""')}"`));

  const csv  = [headers.map(h => `"${h}"`).join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `cartacero_${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// --- Init ---------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
  if (getToken()) {
    showDashboard();
  } else {
    showLogin();
  }

  document.getElementById('loginForm').addEventListener('submit', handleLogin);
  document.getElementById('btnLogout').addEventListener('click', handleLogout);
  document.getElementById('btnFilter').addEventListener('click', loadRecords);
  document.getElementById('btnClearFilter').addEventListener('click', clearFilter);
  document.getElementById('btnExport').addEventListener('click', exportCSV);
});
