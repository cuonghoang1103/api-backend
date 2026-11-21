// chay: tay — module, được main.mjs import
// ui.mjs — the only file that touches the DOM. Four states, one function each.
const box = () => document.querySelector('#recipes');

export function showLoading() { box().textContent = 'Loading recipes…'; }
export function showError(message) { box().textContent = message + ' — try again later.'; }
export function showRecipes(recipes) {
  if (recipes.length === 0) { box().textContent = 'No recipes yet. Add the first one!'; return; }
  const ul = document.createElement('ul');
  for (const r of recipes) {
    const li = document.createElement('li');
    li.textContent = r.name + ' (' + r.minutes + ' min)';
    ul.append(li);
  }
  box().replaceChildren(ul);
}
