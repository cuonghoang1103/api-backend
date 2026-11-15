// Bảng vết N-Queens (n = 4) tới lời giải ĐẦU TIÊN: chạy THẬT, mỗi lời gọi bt(r) là một hàng — các hậu đã đặt,
// từng cột thử ở hàng r và vì sao bị loại (cột / chéo \ / chéo /) hoặc được đặt rồi đi xuống, và kết cục của lời gọi.
export function vetNQueens(n) {
  const hang = [];
  const q = [];
  const cols = new Set(), diag = new Set(), anti = new Set();
  let xong = false;
  function bt(r) {
    const h = { r, hau: [...q], thu: [], ketCuc: '' };
    hang.push(h);
    if (r === n) { h.ketCuc = 'loi-giai'; xong = true; return; }
    for (let c = 0; c < n && !xong; c++) {
      if (cols.has(c)) { h.thu.push({ c, ly: 'col' }); continue; }
      if (diag.has(r - c)) { h.thu.push({ c, ly: 'diag' }); continue; }
      if (anti.has(r + c)) { h.thu.push({ c, ly: 'anti' }); continue; }
      h.thu.push({ c, ly: 'dat' });
      cols.add(c); diag.add(r - c); anti.add(r + c); q.push(c);
      bt(r + 1);
      if (xong) { h.ketCuc = 'xong'; return; }
      cols.delete(c); diag.delete(r - c); anti.delete(r + c); q.pop();
    }
    if (!xong) h.ketCuc = 'cut';
  }
  bt(0);
  return hang;
}
