// Bảng vết LRU (Map + danh sách đôi): mô phỏng đúng thứ tự, ghi danh sách MRU→LRU sau mỗi thao tác.
export function vetLru(cap, ops) {
  const ds = [];                               // keys, index 0 = most recent
  const val = new Map();
  const hang = [];
  for (const [op, k, v] of ops) {
    let kq = '', bo = null;
    if (op === 'get') {
      if (!val.has(k)) kq = '-1 (miss)';
      else { ds.splice(ds.indexOf(k), 1); ds.unshift(k); kq = `${val.get(k)} (hit → move to front)`; }
    } else {
      if (val.has(k)) { ds.splice(ds.indexOf(k), 1); }
      else if (ds.length === cap) { bo = ds.pop(); val.delete(bo); }
      ds.unshift(k); val.set(k, v);
      kq = bo !== null ? `evict ${bo} (tail)` : 'insert at front';
    }
    hang.push({ op: op === 'get' ? `get(${k})` : `put(${k},${v})`, kq, ds: [...ds], bo });
  }
  return hang;
}
