import { jsonResponse, errorResponse, authenticate, handleOptions } from '../_utils.js';

export function onRequestOptions() {
  return handleOptions();
}

export async function onRequestGet({ env }) {
  const { results } = await env.DB
    .prepare('SELECT * FROM tags ORDER BY name')
    .all();
  return jsonResponse(results);
}

export async function onRequestPost({ request, env }) {
  const authed = await authenticate(request, env);
  if (!authed) return errorResponse('Unauthorized', 401);

  const { name, color, is_positive } = await request.json();

  try {
    await env.DB
      .prepare('INSERT INTO tags (name, color, is_positive) VALUES (?, ?, ?)')
      .bind(name, color, is_positive ? 1 : 0)
      .run();
    return jsonResponse({ success: true });
  } catch {
    return errorResponse('Tag already exists', 400);
  }
}
