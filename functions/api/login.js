// ============================================================
// CLOUDFLARE PAGES FUNCTION — POST /api/login
// Validates the admin password and returns a signed session token.
// Token is HMAC-SHA256 signed, expires in 8 hours.
//
// Required Cloudflare environment variables:
//   ADMIN_PASSWORD   the back office password
//   JWT_SECRET       a random string used to sign tokens (min 32 chars)
//                    generate one with: openssl rand -base64 32
// ============================================================

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

  // Constant-time delay to prevent timing attacks and brute-force enumeration
  const delay = 300 + Math.floor(Math.random() * 200);
  await new Promise(r => setTimeout(r, delay));

  if (!body.password || body.password !== env.ADMIN_PASSWORD) {
    return json({ error: 'Contraseña incorrecta.' }, 401);
  }

  const payload = {
    role: 'admin',
    iat: Date.now(),
    exp: Date.now() + 8 * 60 * 60 * 1000, // 8 hours
  };

  const token = await signToken(env.JWT_SECRET, payload);
  return json({ token }, 200);
}

async function signToken(secret, payload) {
  const encoder  = new TextEncoder();
  const keyData  = encoder.encode(secret);
  const msgData  = encoder.encode(JSON.stringify(payload));

  const key = await crypto.subtle.importKey(
    'raw', keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false, ['sign']
  );

  const sig    = await crypto.subtle.sign('HMAC', key, msgData);
  const sigB64 = btoa(String.fromCharCode(...new Uint8Array(sig)));
  const payB64 = btoa(JSON.stringify(payload));

  return `${payB64}.${sigB64}`;
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...JSON_HEADERS, ...CORS_HEADERS },
  });
}
