const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, x-password, x-session-token',
};

export function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
  });
}

export function errorResponse(message, status = 400) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
  });
}

export function handleOptions() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

export function generateToken() {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, b => b.toString(16).padStart(2, '0')).join('');
}

export async function authenticate(request, env) {
  const token = request.headers.get('x-session-token');
  const password = request.headers.get('x-password');

  if (token) {
    const session = await env.DB
      .prepare("SELECT token FROM sessions WHERE token = ? AND expires_at > datetime('now')")
      .bind(token)
      .first();
    if (session) return true;
  }

  if (password) {
    const adminPassword = env.ADMIN_PASSWORD || 'parent123';
    if (password.trim() === adminPassword) return true;
  }

  return false;
}
