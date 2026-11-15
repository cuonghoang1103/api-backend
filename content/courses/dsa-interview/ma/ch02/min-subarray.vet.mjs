// Bảng vết LC 209: chạy THẬT, mỗi dòng là một lần "mở rộng" r hoặc một lần "co" l, kèm tổng và kỷ lục.
export function vetMinSubarray(target, nums) {
  const hang = [];
  let l = 0, sum = 0, best = Infinity;
  for (let r = 0; r < nums.length; r++) {
    sum += nums[r];
    hang.push({ loai: 'grow', l, r, sum, best });
    while (sum >= target) {
      best = Math.min(best, r - l + 1);
      sum -= nums[l];
      l++;
      hang.push({ loai: 'shrink', l, r, sum, best, bo: nums[l - 1] });
    }
  }
  return hang;
}
