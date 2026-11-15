// @java: LuPascal.java
// LC 118 Pascal's Triangle — the first 2D table: every inner cell = the two cells above it.

// #region giai
function generate(numRows: number): number[][] {
  const rows: number[][] = [];
  for (let r = 0; r < numRows; r++) {
    const row: number[] = new Array(r + 1).fill(1);   // base case: both ends are 1
    for (let c = 1; c < r; c++) {
      row[c] = rows[r - 1][c - 1] + rows[r - 1][c];   // transition: up-left + up
    }
    rows.push(row);
  }
  return rows;
}
// #endregion

console.log(`generate(5) = ${JSON.stringify(generate(5))}`);
console.log(`generate(1) = ${JSON.stringify(generate(1))}`);
const big = generate(30);
console.log(`row 29 (the 30th row), middle cell = ${big[29][14]}   biggest number LeetCode can ask for`);

// Self-test: cell (r, c) must equal C(r, c) computed by the multiplicative formula.
let bad = 0, cells = 0;
for (let r = 0; r < 30; r++) {
  let comb = 1;
  for (let c = 0; c <= r; c++) {
    cells++;
    if (big[r][c] !== comb) bad++;
    comb = (comb * (r - c)) / (c + 1);
  }
}
console.log(`self-test vs C(r, c): ${cells} cells, ${bad} mismatches`);
