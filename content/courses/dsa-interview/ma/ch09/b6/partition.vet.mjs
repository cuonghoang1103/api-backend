// Bảng vết LC 763 (chạy ĐÚNG thuật toán trong partition-labels.ts): mỗi dòng = một vị trí i.
export function vetPartition(s) {
  const last = {};
  for (let i = 0; i < s.length; i++) last[s[i]] = i;
  const hang = [];
  let start = 0, end = 0;
  for (let i = 0; i < s.length; i++) {
    end = Math.max(end, last[s[i]]);
    const cat = i === end;
    hang.push({ i, ch: s[i], last: last[s[i]], start, end, cat, size: cat ? end - start + 1 : null });
    if (cat) start = i + 1;
  }
  return hang;
}
