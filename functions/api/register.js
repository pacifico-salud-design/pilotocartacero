// ============================================================
// CLOUDFLARE PAGES FUNCTION — POST /api/register
// Receives form data and inserts a record into Supabase.
// No authentication required (public front office endpoint).
//
// Required Cloudflare environment variables:
//   SUPABASE_URL         e.g. https://xxxxxx.supabase.co
//   SUPABASE_SERVICE_KEY your Supabase service_role secret key
//
// Supabase table: public.atenciones
// Run the SQL in supabase/schema.sql to create the table.
//
// To enable the Póliza field:
//   1. Uncomment the `poliza` line in the record object below.
//   2. Uncomment `poliza text` in supabase/schema.sql and run it.
//   3. Uncomment `poliza` in pages/cartacero/form.js handleSubmit().
//   4. Remove `disabled` from the Póliza input in index.html.
// ============================================================

const REQUIRED = ['prestador', 'compania', 'beneficio', 'prestacion', 'cie10', 'monto', 'fecha_atencion'];

const JSON_HEADERS = { 'Content-Type': 'application/json' };
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function onRequestOptions() {
  return new Response(null, { headers: CORS_HEADERS });
}

export async function onRequestPost(context) {
  const { env, request } = context;

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Solicitud inválida.' }, 400);
  }

  for (const field of REQUIRED) {
    if (body[field] === undefined || body[field] === null || body[field] === '') {
      return json({ error: `Campo requerido: ${field}` }, 400);
    }
  }

  const monto = parseFloat(body.monto);
  if (isNaN(monto) || monto <= 0) {
    return json({ error: 'El monto debe ser mayor a 0.' }, 400);
  }

  const record = {
    prestador:      String(body.prestador),
    compania:       String(body.compania),
    // poliza:      body.poliza ? String(body.poliza) : null,  // PÓLIZA: disabled
    beneficio:      String(body.beneficio),
    prestacion:     String(body.prestacion),
    cie10:          String(body.cie10).toUpperCase(),
    cie10_desc:     body.cie10_desc ? String(body.cie10_desc) : null,
    monto:          monto,
    fecha_atencion: String(body.fecha_atencion),
    solicitud_por:  body.solicitud_por ? String(body.solicitud_por) : null,
  };

  const res = await fetch(`${env.SUPABASE_URL}/rest/v1/atenciones`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': env.SUPABASE_SERVICE_KEY,
      'Authorization': `Bearer ${env.SUPABASE_SERVICE_KEY}`,
      'Prefer': 'return=minimal',
    },
    body: JSON.stringify(record),
  });

  if (!res.ok) {
    const detail = await res.text();
    console.error('Supabase insert error:', detail);
    return json({ error: 'Error al guardar en la base de datos.' }, 500);
  }

  return json({ ok: true }, 201);
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...JSON_HEADERS, ...CORS_HEADERS },
  });
}
