// @java: L5Equations.java
// LC 990 · Satisfiability of Equality Equations — union all "==" first, THEN check every "!=".

// #region giai
function equationsPossible(equations: string[]): boolean {
  const parent = Array.from({ length: 26 }, (_, i) => i);
  const find = (x: number): number => { while (parent[x] !== x) { parent[x] = parent[parent[x]]; x = parent[x]; } return x; };
  const id = (ch: string) => ch.charCodeAt(0) - 97;
  for (const e of equations) if (e[1] === '=') parent[find(id(e[0]))] = find(id(e[3]));
  for (const e of equations) if (e[1] === '!' && find(id(e[0])) === find(id(e[3]))) return false;
  return true;
}
// #endregion

console.log(equationsPossible(['a==b', 'b!=a']));
console.log(equationsPossible(['b==a', 'a==b']));
console.log(equationsPossible(['a!=c', 'a==b', 'b==c']));
console.log(equationsPossible(['c==c', 'b==d', 'x!=z']));
console.log(equationsPossible(['a!=a']));
