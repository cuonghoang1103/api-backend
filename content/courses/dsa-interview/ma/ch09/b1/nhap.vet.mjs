// Bảng vết bài 9.1 — chạy THẬT ba phiên bản Climbing Stairs và ghi lại trạng thái.

/** Mỗi bài toán con k (n..0) bị GIẢI bao nhiêu lần: đệ quy ngây thơ vs có nhớ (tính thật / tra sổ). */
export function vetDemLap(n) {
  const ngay = new Array(n + 1).fill(0);
  const f = (k) => { ngay[k]++; return k <= 1 ? 1 : f(k - 1) + f(k - 2); };
  f(n);
  const tinh = new Array(n + 1).fill(0), tra = new Array(n + 1).fill(0), memo = new Map();
  const g = (k) => {
    if (k <= 1) { tinh[k]++; return 1; }
    if (memo.has(k)) { tra[k]++; return memo.get(k); }
    tinh[k]++;
    const v = g(k - 1) + g(k - 2);
    memo.set(k, v);
    return v;
  };
  g(n);
  const hang = [];
  for (let k = n; k >= 0; k--) hang.push({ k, ngay: ngay[k], tinh: tinh[k], tra: tra[k] });
  return { hang, tongNgay: ngay.reduce((a, b) => a + b, 0), tongNho: tinh.reduce((a, b) => a + b, 0) + tra.reduce((a, b) => a + b, 0) };
}

/** Bảng dp[0..n] lấp từ trái sang phải: mỗi dòng = sau khi ghi dp[i]. */
export function vetBang(n) {
  const dp = new Array(n + 1).fill(null);
  const hang = [];
  dp[0] = 1; hang.push({ i: 0, dp: [...dp], coSo: true });
  dp[1] = 1; hang.push({ i: 1, dp: [...dp], coSo: true });
  for (let i = 2; i <= n; i++) { dp[i] = dp[i - 1] + dp[i - 2]; hang.push({ i, dp: [...dp], a: dp[i - 1], b: dp[i - 2] }); }
  return hang;
}

/** Hai biến trượt: trước/sau mỗi vòng. */
export function vetHaiBien(n) {
  let prev2 = 1, prev1 = 1;
  const hang = [];
  for (let i = 2; i <= n; i++) {
    const cur = prev1 + prev2;
    hang.push({ i, p2: prev2, p1: prev1, cur, p2m: prev1, p1m: cur });
    prev2 = prev1; prev1 = cur;
  }
  return hang;
}
