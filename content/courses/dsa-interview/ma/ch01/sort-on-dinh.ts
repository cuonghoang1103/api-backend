// @java: SortOnDinh.java
// Stable sort: sort by name, then (stably) by score — ties keep the name order. Selection sort is NOT stable.
type Student = { name: string; score: number };
const students: Student[] = [
  { name: 'Minh', score: 8 }, { name: 'An', score: 8 }, { name: 'Lan', score: 7 },
  { name: 'Bao', score: 8 }, { name: 'Chi', score: 9 }, { name: 'Duc', score: 7 },
];
const show = (xs: Student[]) => xs.map((s) => s.name + ':' + s.score).join(' ');

// #region ondinh
const byName = [...students].sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
const thenScore = [...byName].sort((a, b) => b.score - a.score);  // stable: equal scores keep the name order
// #endregion
// #region haikhoa
const twoKeys = [...students].sort((a, b) => b.score - a.score || (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
// #endregion

// #region chon
function selectionSortByScoreDesc(xs: Student[]): Student[] {
  const a = [...xs];
  for (let i = 0; i < a.length; i++) {
    let best = i;
    for (let j = i + 1; j < a.length; j++) if (a[j].score > a[best].score) best = j;
    [a[i], a[best]] = [a[best], a[i]];   // a long-distance swap can jump over an equal element
  }
  return a;
}
// #endregion

console.log('by name          :', show(byName));
console.log('then by score    :', show(thenScore));
console.log('two-key compare  :', show(twoKeys));
console.log('selection sort   :', show(selectionSortByScoreDesc(byName)));
