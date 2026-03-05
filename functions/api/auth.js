import { jsonResponse, errorResponse, generateToken, handleOptions } from './_utils.js';

export function onRequestOptions() {
  return handleOptions();
}

export async function onRequestPost({ request, env }) {
  const password = request.headers.get('x-password') || '';
  const adminPassword = env.ADMIN_PASSWORD || 'parent123';

  if (password.trim() !== adminPassword.trim()) {
    return errorResponse('Incorrect password', 401);
  }

  const token = generateToken();
  const expiresAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();

  await env.DB
    .prepare('INSERT INTO sessions (token, expires_at) VALUES (?, ?)')
    .bind(token, expiresAt)
    .run();

  return jsonResponse({ success: true, sessionToken: token, expiresAt });
}
