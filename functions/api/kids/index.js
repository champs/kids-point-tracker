import { jsonResponse, handleOptions } from '../_utils.js';

export function onRequestOptions() {
  return handleOptions();
}

export async function onRequestGet({ env }) {
  const { results } = await env.DB
    .prepare('SELECT * FROM kids ORDER BY id')
    .all();
  return jsonResponse(results);
}
