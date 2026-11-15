// @java: L1FloodFill.java
// LC 733 · Flood Fill — iterative DFS from (sr, sc) over cells with the ORIGINAL colour.

// #region giai
function floodFill(image: number[][], sr: number, sc: number, color: number): number[][] {
  const old = image[sr][sc];
  if (old === color) return image;               // otherwise "visited" (= new colour) never differs: infinite loop
  const R = image.length, C = image[0].length;
  const stack = [[sr, sc]];
  image[sr][sc] = color;
  while (stack.length > 0) {
    const [r, c] = stack.pop()!;
    for (const [dr, dc] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nr = r + dr, nc = c + dc;
      if (nr >= 0 && nr < R && nc >= 0 && nc < C && image[nr][nc] === old) { image[nr][nc] = color; stack.push([nr, nc]); }
    }
  }
  return image;
}
// #endregion

console.log(JSON.stringify(floodFill([[1, 1, 1], [1, 1, 0], [1, 0, 1]], 1, 1, 2)));
console.log(JSON.stringify(floodFill([[0, 0, 0], [0, 0, 0]], 0, 0, 0)));
console.log(JSON.stringify(floodFill([[0, 0, 0], [0, 1, 1]], 1, 1, 1)));
