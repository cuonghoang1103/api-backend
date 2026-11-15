// Bảng DP của LC 516 (chạy ĐÚNG công thức trong lps.ts) — trả ma trận n×n, ô i > j để null (không dùng).
export function bangLps(s) {
  const n = s.length;
  const dp = Array.from({ length: n }, () => new Array(n).fill(null));
  const tu = {};   // 'i,j' -> nguồn: 'both' (hai đầu bằng nhau) | 'drop'
  for (let i = n - 1; i >= 0; i--) {
    dp[i][i] = 1;
    for (let j = i + 1; j < n; j++) {
      if (s[i] === s[j]) { dp[i][j] = (j - 1 >= i + 1 ? dp[i + 1][j - 1] : 0) + 2; tu[`${i},${j}`] = 'both'; }
      else { dp[i][j] = Math.max(dp[i + 1][j], dp[i][j - 1]); tu[`${i},${j}`] = 'drop'; }
    }
  }
  return { dp, tu };
}
