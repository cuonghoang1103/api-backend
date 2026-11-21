// Milestone 13: the pure logic of the app lives here, so it can be tested without a browser.
export function validateRecipe(input) {
  const errors = {};
  if (typeof input.name !== 'string' || input.name.trim().length < 2) errors.name = 'Name needs at least 2 characters';
  if (!Number.isInteger(input.minutes) || input.minutes <= 0) errors.minutes = 'Minutes must be a positive whole number';
  return errors;
}

export function filterRecipes(recipes, { q = '', category = 'all' } = {}) {
  const needle = q.trim().toLowerCase();
  return recipes.filter((r) =>
    (category === 'all' || r.category === category) && r.name.toLowerCase().includes(needle));
}

export function slugify(text) {
  return text.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/gi, 'd')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

// fetch is passed in, so a test can hand it a fake one (no network, no server).
export async function loadRecipes(fetchFn = fetch) {
  const res = await fetchFn('/api/recipes');
  if (!res.ok) throw new Error('Could not load recipes (HTTP ' + res.status + ')');
  return (await res.json()).items;
}
