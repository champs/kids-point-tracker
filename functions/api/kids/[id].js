import { jsonResponse, errorResponse, authenticate, handleOptions } from '../_utils.js';

export function onRequestOptions() {
  return handleOptions();
}

export async function onRequestPut({ request, env, params }) {
  const authed = await authenticate(request, env);
  if (!authed) return errorResponse('Unauthorized', 401);

  const { name, initials, color } = await request.json();

  await env.DB
    .prepare('UPDATE kids SET name = ?, initials = ?, color = ? WHERE id = ?')
    .bind(name, initials, color, params.id)
    .run();

  return jsonResponse({ success: true });
}
