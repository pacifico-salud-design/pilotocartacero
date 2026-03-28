// ============================================================
// CLOUDFLARE PAGES FUNCTION — GET /api/records
// Returns all atenciones records. Requires a valid session token
// from /api/login in the Authorization: Bearer <token> header.
//
// Optional query params:
//   desde=YYYY-MM-DD   filter records on or after this date
//   hasta=YYYY-MM-DD   filter records on or before this date
//
// Required Cloudflare environment variables:
//   SUPABASE_URL         e.g. https://xxxxxx.supabase.co
//   SUPABASE_SERVICE_KEY your Supabase service_role secret key
//   JWT_SECRET           same secret used in login.js
// ============================================================

const JSON_HEADERS = { 'Content-Type': 'application/json' };
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function onRequestOptions() {
  return new Response(null, { headers: CORS_HEADERS });
}

export async function onRequestGet(context) {
  const { env, request } = context;

  // Verify token
  const auth = request.headers.get('Authorization') || '';
  if (!auth.startsWith('Bearer ')) {
    return json({ error: 'No autorizado.' }, 401);
  }

  const token   = auth.slice(7);
  const payload = await verifyToken(env.JWT_SECRET, token);
  if (!payload) {
    return json({ error: 'Token inválido o expirado. Vuelva a iniciar sesión.' }, 401);
  }

  // Build Supabase query
  const url    = new URL(request.url);
  const desde  = url.searchParams.get('desde');
  const hasta  = url.searchParams.get('hasta');

  let query = `${env.SUPABASE_URL}/rest/v1/atenciones?select=*&order=fecha_atencion.desc`;
  if (desde) query += `&fecha_atencion=gte.${encodeURIComponent(desde + 'T00:00:00')}`;
  if (hasta) query += `&fecha_atencion=lte.${encodeURIComponent(hasta + 'T23:59:59')}`;

  const res = await fetch(query, {
    headers: {
      'apikey': env.SUPABASE_SERVICE_KEY,
      'Authorization': `Bearer ${env.SUPABASE_SERVICE_KEY}`,
    },
  });

  if (!res.ok) {
    const detail = await res.text();
    console.error('Supabase query error:', detail);
    return json({ error: 'Error al obtener registros.' }, 500);
  }

  const data = await res.json();
  return json(data, 200);
}

async function verifyToken(secret, tokenStr) {
  try {
    const dotIdx = tokenStr.lastIndexOf('.');
    if (dotIdx === -1) return null;

    const payB64 = tokenStr.slice(0, dotIdx);
    const sigB64 = tokenStr.slice(dotIdx + 1);

    const payload = JSON.parse(atob(payB64));
    if (payload.exp < Date.now()) return null; // expired

    const encoder = new TextEncoder();
    const keyData = encoder.encode(secret);
    const msgData = encoder.encode(JSON.stringify(payload));

    const key = await crypto.subtle.importKey(
      'raw', keyData,
      { name: 'HMAC', hash: 'SHA-256' },
      false, ['verify']
    );

    const sigBytes = Uint8Array.from(atob(sigB64), c => c.charCodeAt(0));
    const valid    = await crypto.subtle.verify('HMAC', key, sigBytes, msgData);

    return valid ? payload : null;
  } catch {
    return null;
  }
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...JSON_HEADERS, ...CORS_HEADERS },
  });
}
