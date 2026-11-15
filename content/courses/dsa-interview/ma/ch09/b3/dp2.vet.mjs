// Bảng vết cho bài 9.3: chạy THẬT các DP hai chiều và trả về cả bảng + thông tin tô màu.

// LCS: bảng (n+1)×(m+1), các hàng sau từng vòng i, và đường truy vết từ (n, m) về.
export function vetLcs(a, b) {
  const n = a.length, m = b.length;
  const dp = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
  const hang = [];
  for (let i = 1; i <= n; i++) {
    const khop = [];
    for (let j = 1; j <= m; j++) {
      if (a[i - 1] === b[j - 1]) { dp[i][j] = dp[i - 1][j - 1] + 1; khop.push(j); }
      else dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
    hang.push({ i, ch: a[i - 1], row: [...dp[i]], khop });
  }
  const duong = [];  // [i, j, muiTen]
  let i = n, j = m, chu = '';
  while (i > 0 && j > 0) {
    if (a[i - 1] === b[j - 1]) { duong.push([i, j, '↖']); chu = a[i - 1] + chu; i--; j--; }
    else if (dp[i - 1][j] >= dp[i][j - 1]) { duong.push([i, j, '↑']); i--; }
    else { duong.push([i, j, '←']); j--; }
  }
  return { dp, hang, duong, chu };
}

// Edit distance: bảng đầy đủ + đường truy vết + danh sách phép sửa.
export function vetEdit(a, b) {
  const n = a.length, m = b.length;
  const dp = Array.from({ length: n + 1 }, (_, i) => Array.from({ length: m + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0)));
  for (let i = 1; i <= n; i++)
    for (let j = 1; j <= m; j++)
      dp[i][j] = a[i - 1] === b[j - 1] ? dp[i - 1][j - 1] : 1 + Math.min(dp[i - 1][j - 1], dp[i - 1][j], dp[i][j - 1]);
  const duong = [];
  let i = n, j = m;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && a[i - 1] === b[j - 1]) { duong.push([i, j, '↖=', `keep ${a[i - 1]}`]); i--; j--; }
    else if (i > 0 && j > 0 && dp[i][j] === dp[i - 1][j - 1] + 1) { duong.push([i, j, '↖', `replace ${a[i - 1]}→${b[j - 1]}`]); i--; j--; }
    else if (i > 0 && dp[i][j] === dp[i - 1][j] + 1) { duong.push([i, j, '↑', `delete ${a[i - 1]}`]); i--; }
    else { duong.push([i, j, '←', `insert ${b[j - 1]}`]); j--; }
  }
  duong.push([0, 0, '', 'start']);
  return { dp, duong };
}

// 0/1 knapsack: bảng (số vật + 1) × (W + 1), mỗi hàng = sau khi xét thêm một vật; ghi ô nào "lấy vật".
export function vetKnap(w, v, W) {
  const n = w.length;
  const dp = Array.from({ length: n + 1 }, () => new Array(W + 1).fill(0));
  const lay = Array.from({ length: n + 1 }, () => new Array(W + 1).fill(false));
  for (let i = 1; i <= n; i++)
    for (let c = 0; c <= W; c++) {
      dp[i][c] = dp[i - 1][c];
      if (w[i - 1] <= c && dp[i - 1][c - w[i - 1]] + v[i - 1] > dp[i][c]) { dp[i][c] = dp[i - 1][c - w[i - 1]] + v[i - 1]; lay[i][c] = true; }
    }
  const chon = [];
  for (let i = n, c = W; i > 0; i--) if (lay[i][c]) { chon.push(i - 1); c -= w[i - 1]; }
  return { dp, lay, chon: chon.reverse() };
}

// Xâu con đối xứng dài nhất: is[i][j] tính theo ĐỘ DÀI (đường chéo), ghi thứ tự ô được tính.
export function vetPal(s) {
  const n = s.length;
  const is = Array.from({ length: n }, () => new Array(n).fill(null));
  const thuTu = [];
  let best = [0, 0];
  for (let len = 1; len <= n; len++)
    for (let i = 0; i + len - 1 < n; i++) {
      const j = i + len - 1;
      is[i][j] = s[i] === s[j] && (len <= 2 || is[i + 1][j - 1]) ? 1 : 0;
      thuTu.push({ len, i, j, v: is[i][j] });
      if (is[i][j] && len > best[1] - best[0] + 1) best = [i, j];
    }
  return { is, thuTu, best, chu: s.slice(best[0], best[1] + 1) };
}

// Unique Paths: bảng m×n đầy đủ + các phiên bản của MỘT hàng sau từng vòng r (bản nén).
export function vetPaths(m, n) {
  const dp = Array.from({ length: m }, () => new Array(n).fill(0));
  for (let r = 0; r < m; r++) for (let c = 0; c < n; c++) dp[r][c] = r === 0 || c === 0 ? 1 : dp[r - 1][c] + dp[r][c - 1];
  const row = new Array(n).fill(1);
  const hang = [{ r: 0, row: [...row] }];
  for (let r = 1; r < m; r++) { for (let c = 1; c < n; c++) row[c] += row[c - 1]; hang.push({ r, row: [...row] }); }
  return { dp, hang };
}
