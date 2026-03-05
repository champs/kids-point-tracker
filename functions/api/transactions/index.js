import { jsonResponse, errorResponse, authenticate, handleOptions } from '../_utils.js';

export function onRequestOptions() {
  return handleOptions();
}

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const kidId = url.searchParams.get('kid_id');
  const limit = parseInt(url.searchParams.get('limit') || '50');

  let query =
    'SELECT t.*, k.name, k.initials, k.color FROM transactions t JOIN kids k ON t.kid_id = k.id';
  const bindings = [];

  if (kidId) {
    query += ' WHERE t.kid_id = ?';
    bindings.push(kidId);
  }

  query += ' ORDER BY t.timestamp DESC LIMIT ?';
  bindings.push(limit);

  const { results } = await env.DB
    .prepare(query)
    .bind(...bindings)
    .all();

  return jsonResponse(results);
}

export async function onRequestPost({ request, env }) {
  const authed = await authenticate(request, env);
  if (!authed) return errorResponse('Unauthorized', 401);

  const { kid_id, points, tag, note } = await request.json();
  const transactionTag = tag || 'General';

  await env.DB
    .prepare('INSERT INTO transactions (kid_id, points, tag, note) VALUES (?, ?, ?, ?)')
    .bind(kid_id, points, transactionTag, note || '')
    .run();

  await env.DB
    .prepare('UPDATE kids SET balance = balance + ? WHERE id = ?')
    .bind(points, kid_id)
    .run();

  const kid = await env.DB
    .prepare('SELECT * FROM kids WHERE id = ?')
    .bind(kid_id)
    .first();

  return jsonResponse({ success: true, kid });
}
