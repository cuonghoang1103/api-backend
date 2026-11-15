// Bảng vết Merge k Sorted Lists: chạy THẬT heap đầu danh sách (mỗi phần tử = [giá trị, danh sách số mấy]).
export function vetMergeK(lists) {
  const h = [];                       // heap nhỏ nhất theo giá trị, hoà thì theo số danh sách
  const lt = (x, y) => x[0] < y[0] || (x[0] === y[0] && x[1] < y[1]);
  const push = (e) => { h.push(e); for (let i = h.length - 1; i > 0;) { const p = (i - 1) >> 1; if (!lt(h[i], h[p])) break; [h[i], h[p]] = [h[p], h[i]]; i = p; } };
  const pop = () => {
    const top = h[0], last = h.pop();
    if (h.length) {
      h[0] = last;
      for (let i = 0; ;) { const l = 2 * i + 1, r = l + 1; let m = i; if (l < h.length && lt(h[l], h[m])) m = l; if (r < h.length && lt(h[r], h[m])) m = r; if (m === i) break; [h[i], h[m]] = [h[m], h[i]]; i = m; }
    }
    return top;
  };
  const pos = lists.map(() => 0);
  lists.forEach((l, k) => { if (l.length) { push([l[0], k]); pos[k] = 1; } });
  const out = [];
  const hang = [{ lay: null, heap: [...h].sort((a, b) => (lt(a, b) ? -1 : 1)), out: [], vao: null }];
  while (h.length) {
    const [v, k] = pop();
    out.push(v);
    let vao = null;
    if (pos[k] < lists[k].length) { vao = [lists[k][pos[k]], k]; push(vao); pos[k]++; }
    hang.push({ lay: [v, k], heap: [...h].sort((a, b) => (lt(a, b) ? -1 : 1)), out: [...out], vao });
  }
  return hang;
}
