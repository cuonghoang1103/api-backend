// Bảng vết House Robber: chạy ĐÚNG công thức dp[i] = max(dp[i-1], nums[i] + dp[i-2]) và ghi từng bước.
export function vetRob(nums) {
  const n = nums.length;
  const dp = new Array(n).fill(null);
  const hang = [];
  dp[0] = nums[0];
  hang.push({ i: 0, dp: [...dp], bo: null, lay: nums[0], chon: 'base', cong: `dp[0] = nums[0] = ${nums[0]}` });
  dp[1] = Math.max(nums[0], nums[1]);
  hang.push({ i: 1, dp: [...dp], bo: nums[0], lay: nums[1], chon: nums[1] > nums[0] ? 'rob' : 'skip', cong: `dp[1] = max(${nums[0]}, ${nums[1]}) = ${dp[1]}` });
  for (let i = 2; i < n; i++) {
    const bo = dp[i - 1], lay = nums[i] + dp[i - 2];
    dp[i] = Math.max(bo, lay);
    hang.push({ i, dp: [...dp], bo, lay, chon: lay > bo ? 'rob' : 'skip', cong: `max(dp[${i - 1}] = ${bo}, ${nums[i]} + dp[${i - 2}] = ${lay}) = ${dp[i]}` });
  }
  // Truy vết: đi lùi, nhà i được lấy khi dp[i] !== dp[i-1].
  const lay = [];
  for (let i = n - 1; i >= 0;) {
    if (i === 0 || dp[i] !== dp[i - 1]) { lay.push(i); i -= 2; } else i -= 1;
  }
  return { hang, dp, nhaLay: lay.reverse() };
}
