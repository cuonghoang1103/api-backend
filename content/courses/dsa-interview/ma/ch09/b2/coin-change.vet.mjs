// Bảng vết Coin Change: chạy ĐÚNG dp[a] = min over c of dp[a - c] + 1, ghi mỗi a: ứng viên của từng đồng xu.
export function vetCoin(coins, amount) {
  const INF = Infinity;
  const dp = new Array(amount + 1).fill(INF);
  dp[0] = 0;
  const hang = [];
  for (let a = 1; a <= amount; a++) {
    const ungVien = [];
    let tu = -1;
    for (const c of coins) {
      if (c > a) { ungVien.push(`c=${c}: too big`); continue; }
      const v = dp[a - c] + 1;
      ungVien.push(`c=${c}: dp[${a - c}]+1 = ${v === INF ? '∞' : v}`);
      if (v < dp[a]) { dp[a] = v; tu = a - c; }
    }
    hang.push({ a, dp: [...dp], tu, ungVien });
  }
  return { hang, dp };
}
