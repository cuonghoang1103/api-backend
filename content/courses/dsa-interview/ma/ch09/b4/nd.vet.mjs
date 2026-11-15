// Bảng vết bài 9.4 — chạy THẬT lời giải và ghi trạng thái.

/** LC 740: gom điểm theo giá trị rồi chạy House Robber trên trục giá trị. */
export function vetDeleteEarn(nums) {
  const maxV = Math.max(...nums);
  const points = new Array(maxV + 1).fill(0);
  for (const x of nums) points[x] += x;
  const dp = new Array(maxV + 1).fill(0);
  const hang = [];
  for (let v = 1; v <= maxV; v++) {
    const bo = dp[v - 1], lay = (v >= 2 ? dp[v - 2] : 0) + points[v];
    dp[v] = Math.max(bo, lay);
    hang.push({ v, diem: points[v], bo, lay, dp: dp[v], chon: lay > bo ? 'take' : 'skip' });
  }
  return { points, dp, hang };
}

/** LC 309: ba trạng thái hold / sold / rest sau mỗi ngày. -Infinity giữ nguyên để in ra "−∞". */
export function vetCooldown(prices) {
  let hold = -Infinity, sold = -Infinity, rest = 0;
  const cot = [];
  for (const p of prices) {
    const h = Math.max(hold, rest - p), s = hold + p, r = Math.max(rest, sold);
    cot.push({ p, hold: h, sold: s, rest: r, mua: rest - p > hold });
    hold = h; sold = s; rest = r;
  }
  return { cot, dapAn: Math.max(sold, rest) };
}

/** LC 221: bảng dp (R+1)×(C+1) sau khi điền xong + ô đạt max. */
export function vetSquare(rows) {
  const R = rows.length, C = rows[0].length;
  const dp = Array.from({ length: R + 1 }, () => new Array(C + 1).fill(0));
  let best = 0, at = null;
  for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) {
    if (rows[r][c] !== '1') continue;
    dp[r + 1][c + 1] = 1 + Math.min(dp[r][c + 1], dp[r + 1][c], dp[r][c]);
    if (dp[r + 1][c + 1] > best) { best = dp[r + 1][c + 1]; at = [r + 1, c + 1]; }
  }
  return { dp, best, at };
}
