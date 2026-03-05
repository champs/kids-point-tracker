import { jsonResponse, handleOptions } from '../_utils.js';

export function onRequestOptions() {
  return handleOptions();
}

export async function onRequestGet({ request, env }) {
  const token = request.headers.get('x-session-token');

  if (!token) {
    return jsonResponse({ valid: false }, 401);
  }

  const session = await env.DB
    .prepare("SELECT token FROM sessions WHERE token = ? AND expires_at > datetime('now')")
    .bind(token)
    .first();

  return session
    ? jsonResponse({ valid: true })
    : jsonResponse({ valid: false }, 401);
}
