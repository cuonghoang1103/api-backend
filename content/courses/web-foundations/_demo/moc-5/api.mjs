// chay: tay — module, được main.mjs import
// api.mjs — the only file that knows WHERE data comes from (a JSON file now, your API in milestone 6).
export async function getRecipes(url = 'data/recipes.json') {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Could not load recipes (HTTP ' + res.status + ')');   // fetch does NOT throw on 404/500
  return res.json();
}
