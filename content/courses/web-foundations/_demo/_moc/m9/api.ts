// The API client: the ONE place where unknown JSON becomes typed data.
import { isRecipe, type ApiResult, type Recipe } from './types.ts';

export async function parseRecipes(res: { ok: boolean; status: number; json(): Promise<unknown> }): Promise<ApiResult<Recipe[]>> {
  if (!res.ok) return { ok: false, status: res.status, message: 'HTTP ' + res.status };
  const body = await res.json();
  if (!Array.isArray(body)) return { ok: false, status: res.status, message: 'expected an array' };
  const bad = body.findIndex((item) => !isRecipe(item));
  if (bad !== -1) return { ok: false, status: res.status, message: 'item ' + bad + ' is not a Recipe' };
  return { ok: true, data: body };
}

export function totalMinutes(recipes: Recipe[]): number {
  return recipes.reduce((sum, r) => sum + r.minutes, 0);
}

// Try it without a server: fake two responses.
const fake = (status: number, body: unknown) => ({ ok: status < 400, status, json: async () => body });
for (const res of [
  fake(200, [{ id: 1, name: 'Pho bo', minutes: 90, category: 'main' }]),
  fake(200, [{ id: 2, name: 'Flan', minutes: '40', category: 'dessert' }]),
  fake(500, null),
]) {
  const result = await parseRecipes(res);
  if (result.ok) console.log('ok, total minutes =', totalMinutes(result.data));
  else console.log('failed:', result.message);   // TypeScript knows .message exists only here
}
