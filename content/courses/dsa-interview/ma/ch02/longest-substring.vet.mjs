// Bảng vết LC 3 (bản nhảy bằng chỉ số cuối): chạy THẬT, ghi l trước/sau, chỗ cũ của ký tự và kỷ lục.
export function vetLongest(s) {
  const last = new Map();
  const hang = [];
  let l = 0, best = 0;
  for (let r = 0; r < s.length; r++) {
    const p = last.get(s[r]);
    const lTruoc = l;
    if (p !== undefined) l = Math.max(l, p + 1);
    last.set(s[r], r);
    const moi = r - l + 1 > best;
    best = Math.max(best, r - l + 1);
    hang.push({ r, c: s[r], p: p === undefined ? null : p, lTruoc, l, len: r - l + 1, best, moi, sai: p === undefined ? null : p + 1 });
  }
  return hang;
}
