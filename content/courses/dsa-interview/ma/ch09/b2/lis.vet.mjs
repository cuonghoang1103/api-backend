// Bảng vết LIS O(n log n): chạy ĐÚNG khuôn firstTrue trên tails và ghi tails sau mỗi phần tử.
function firstTrue(lo, hi, ok) {
  while (lo < hi) { const mid = lo + Math.floor((hi - lo) / 2); if (ok(mid)) hi = mid; else lo = mid + 1; }
  return lo;
}
export function vetLis(nums) {
  const tails = [];
  const hang = [];
  nums.forEach((x, idx) => {
    const truoc = [...tails];
    const k = firstTrue(0, tails.length, (i) => tails[i] >= x);
    const noi = k === tails.length;
    if (noi) tails.push(x); else tails[k] = x;
    hang.push({ idx, x, truoc, k, noi, sau: [...tails] });
  });
  return hang;
}
// Bảng dp[i] của bản O(n²) (độ dài dãy tăng dài nhất KẾT THÚC tại i) + chỉ số trước đó để truy vết.
export function vetLisN2(nums) {
  const n = nums.length;
  const dp = new Array(n).fill(1), truoc = new Array(n).fill(-1);
  for (let i = 0; i < n; i++)
    for (let j = 0; j < i; j++)
      if (nums[j] < nums[i] && dp[j] + 1 > dp[i]) { dp[i] = dp[j] + 1; truoc[i] = j; }
  let end = 0;
  for (let i = 1; i < n; i++) if (dp[i] > dp[end]) end = i;
  const day = [];
  for (let i = end; i !== -1; i = truoc[i]) day.push(i);
  return { dp, truoc, day: day.reverse() };
}
