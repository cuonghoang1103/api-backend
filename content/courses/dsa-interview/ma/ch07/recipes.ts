// @java: Recipes.java
// LC 2115 · Find All Possible Recipes from Given Supplies — Kahn where the starting queue is the SUPPLIES.

// #region giai
function findAllRecipes(recipes: string[], ingredients: string[][], supplies: string[]): string[] {
  const usedBy = new Map<string, string[]>();          // ingredient → recipes that need it
  const need = new Map<string, number>();              // recipe → ingredients still missing (in-degree)
  recipes.forEach((r, i) => {
    need.set(r, ingredients[i].length);
    for (const ing of ingredients[i]) {
      if (!usedBy.has(ing)) usedBy.set(ing, []);
      usedBy.get(ing)!.push(r);
    }
  });
  const q = [...supplies];
  const made: string[] = [];
  for (let head = 0; head < q.length; head++) {
    for (const r of usedBy.get(q[head]) ?? []) {
      need.set(r, need.get(r)! - 1);
      if (need.get(r) === 0) { made.push(r); q.push(r); }   // a finished recipe is a new supply
    }
  }
  return made;
}
// #endregion

console.log(JSON.stringify(findAllRecipes(['bread'], [['yeast', 'flour']], ['yeast', 'flour', 'corn'])));
console.log(JSON.stringify(findAllRecipes(['bread', 'sandwich', 'burger'], [['yeast', 'flour'], ['bread', 'meat'], ['sandwich', 'meat', 'bread']], ['yeast', 'flour', 'meat'])));
console.log(JSON.stringify(findAllRecipes(['a', 'b'], [['b'], ['a']], ['x'])));
