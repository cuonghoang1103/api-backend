// Bảng vết đảo danh sách (vòng lặp 3 con trỏ): chạy THẬT, sau mỗi vòng ghi mũi tên next của MỌI nút.
export function vetReverse(vals) {
  const nodes = vals.map((v) => ({ val: v, next: null }));
  nodes.forEach((n, i) => { n.next = nodes[i + 1] ?? null; });
  const ten = (n) => (n ? String(n.val) : 'null');
  const muiTen = () => nodes.map((n) => `${n.val}→${ten(n.next)}`).join('  ');
  const hang = [{ buoc: 'start', prev: 'null', curr: ten(nodes[0]), arrows: muiTen() }];
  let prev = null, curr = nodes[0] ?? null, k = 0;
  while (curr) {
    const next = curr.next;
    curr.next = prev;
    prev = curr;
    curr = next;
    k++;
    hang.push({ buoc: String(k), prev: ten(prev), curr: ten(curr), arrows: muiTen() });
  }
  return hang;
}
