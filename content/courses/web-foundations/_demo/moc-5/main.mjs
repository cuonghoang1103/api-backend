// chay: tay — module, được index.html nạp
// main.mjs — wires api + ui together. No global variables: modules have their own scope.
import { getRecipes } from './api.mjs';
import { showLoading, showError, showRecipes } from './ui.mjs';

export async function load(url) {
  showLoading();
  try {
    const recipes = await getRecipes(url);
    showRecipes(recipes);
  } catch (err) {
    console.error(err);                 // for you, in DevTools
    showError(err.message);             // for the user, on the page
  }
}
