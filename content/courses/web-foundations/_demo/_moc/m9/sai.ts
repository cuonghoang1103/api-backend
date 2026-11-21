// Four mistakes the compiler catches before a user does.
import type { Recipe, ApiResult } from './types.ts';

const r: Recipe = { id: 1, name: 'Pho bo', minutes: '90', category: 'main' };
const s: Recipe = { id: 2, name: 'Flan', minutes: 40, category: 'desert' };

function show(result: ApiResult<Recipe[]>) {
  console.log(result.data.length);
}

function upper(recipe: Recipe) {
  return recipe.note.toUpperCase();
}
export { r, s, show, upper };
