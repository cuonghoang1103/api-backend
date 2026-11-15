// Bảng vết heap nhỏ nhất: chạy push/pop THẬT (đúng thuật toán của heap.ts) và ghi lại MỖI phép so sánh với cha/con.
// ops: số = push số đó, 'pop' = lấy đỉnh. Trả về các dòng { op, buoc, mang (bản chụp), to: {chỉSố: màu}, viec }.
export function vetHeap(ops, batDau = []) {
  const a = [...batDau];
  const hang = [];
  const chup = (op, viec, to) => hang.push({ op, mang: [...a], to, viec });
  for (const op of ops) {
    if (op === 'pop') {
      const top = a[0];
      const last = a.pop();
      if (a.length === 0) { chup('pop', `take ${top}; heap is now empty`, {}); continue; }
      a[0] = last;
      chup('pop', `take root ${top}; last leaf ${last} moves to the root`, { 0: 'l' });
      let i = 0;
      for (;;) {
        const l = 2 * i + 1, r = l + 1;
        let m = i;
        if (l < a.length && a[l] < a[m]) m = l;
        if (r < a.length && a[r] < a[m]) m = r;
        const con = [l, r].filter((j) => j < a.length);
        if (m === i) {
          chup('pop', con.length ? `${a[i]} ≤ children (${con.map((j) => a[j]).join(', ')}) ⇒ stop` : `${a[i]} is a leaf ⇒ stop`, { [i]: 'ok' });
          break;
        }
        const truoc = a[i];
        [a[i], a[m]] = [a[m], a[i]];
        chup('pop', `${truoc} > smaller child ${a[i]} ⇒ swap (index ${i} ↔ ${m})`, { [i]: 'r', [m]: 'l' });
        i = m;
      }
    } else {
      a.push(op);
      let i = a.length - 1;
      chup(`push ${op}`, `append ${op} as the last leaf (index ${i})`, { [i]: 'l' });
      while (i > 0) {
        const p = (i - 1) >> 1;
        if (a[i] >= a[p]) { chup(`push ${op}`, `parent ${a[p]} ≤ ${a[i]} ⇒ stop`, { [i]: 'ok', [p]: 'mo' }); break; }
        [a[i], a[p]] = [a[p], a[i]];
        chup(`push ${op}`, `${op} < parent ${a[i]} ⇒ swap (index ${i} ↔ ${p})`, { [p]: 'l', [i]: 'r' });
        i = p;
      }
      if (i === 0 && hang[hang.length - 1].viec.indexOf('stop') < 0) chup(`push ${op}`, `${op} reached the root ⇒ stop`, { 0: 'ok' });
    }
  }
  return hang;
}
