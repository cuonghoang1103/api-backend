// Bẫy follow-up "nếu lưới 1000 x 1000 thì sao?": DFS đệ quy sâu bằng KÍCH THƯỚC ĐẢO, không phải bằng cạnh lưới.
// Lưới toàn đất N x N ⇒ đệ quy có thể sâu tới N² khung ⇒ Node ném RangeError (stack mặc định ~1 MB).
// Bản ngăn xếp tường minh không có giới hạn đó.
function areaRecursive(R: number, C: number): number | string {
  const g = Array.from({ length: R }, () => new Uint8Array(C).fill(1));
  let maxDepth = 0;
  const area = (r: number, c: number, d: number): number => {
    if (r < 0 || r >= R || c < 0 || c >= C || g[r][c] !== 1) return 0;
    g[r][c] = 0;
    if (d > maxDepth) maxDepth = d;
    return 1 + area(r + 1, c, d + 1) + area(r - 1, c, d + 1) + area(r, c + 1, d + 1) + area(r, c - 1, d + 1);
  };
  try {
    const a = area(0, 0, 1);
    return `${a} (max depth ${maxDepth})`;
  } catch (e) {
    return `${(e as Error).name}: ${(e as Error).message}`;
  }
}
function areaStack(R: number, C: number): number {
  const g = Array.from({ length: R }, () => new Uint8Array(C).fill(1));
  const stack: number[] = [0];
  g[0][0] = 0;
  let size = 0;
  while (stack.length) {
    const cell = stack.pop()!;
    size++;
    const r = Math.floor(cell / C), c = cell % C;
    for (const [nr, nc] of [[r + 1, c], [r - 1, c], [r, c + 1], [r, c - 1]]) {
      if (nr >= 0 && nr < R && nc >= 0 && nc < C && g[nr][nc] === 1) { g[nr][nc] = 0; stack.push(nr * C + nc); }
    }
  }
  return size;
}
for (const n of [50, 100, 300, 1000]) {
  console.log(`${n}x${n} all land: recursive -> ${areaRecursive(n, n)} | explicit stack -> ${areaStack(n, n)}`);
}
