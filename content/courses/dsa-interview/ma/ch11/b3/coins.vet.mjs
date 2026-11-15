// Bảng vết LC 979: dựng cây từ mảng kiểu LeetCode, chạy hậu thứ tự THẬT, ghi mỗi nút: tiền dư trái/phải, tiền dư trả lên, tổng nước đi.
export function vetTienDu(a) {
  const nodes = [];
  if (!a.length || a[0] === null) return [];
  const mk = (v, ten) => ({ v, ten, l: null, r: null });
  const root = mk(a[0], 'A');
  let id = 1;
  const q = [root];
  let h = 0, i = 1;
  while (i < a.length) {
    const n = q[h++];
    if (i < a.length && a[i] !== null) { n.l = mk(a[i], String.fromCharCode(65 + id++)); q.push(n.l); }
    i++;
    if (i < a.length && a[i] !== null) { n.r = mk(a[i], String.fromCharCode(65 + id++)); q.push(n.r); }
    i++;
  }
  let moves = 0;
  const hang = [];
  const go = (n, cha) => {
    if (!n) return 0;
    const l = go(n.l, n.ten), r = go(n.r, n.ten);
    moves += Math.abs(l) + Math.abs(r);
    const e = n.v + l + r - 1;
    hang.push({ ten: n.ten, v: n.v, cha, l, r, e, moves });
    return e;
  };
  go(root, '—');
  return hang;
}
