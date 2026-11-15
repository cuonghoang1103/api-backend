// Bảng vết Kadane: endHere (dp[i]) và best qua từng phần tử, kèm đoạn đang giữ [start..i].
export function vetKadane(nums) {
  let endHere = nums[0], best = nums[0], start = 0, bestL = 0, bestR = 0;
  const hang = [{ i: 0, x: nums[0], moi: true, endHere, best, start, bestL, bestR }];
  for (let i = 1; i < nums.length; i++) {
    const moi = nums[i] > endHere + nums[i];
    if (moi) { endHere = nums[i]; start = i; } else endHere += nums[i];
    if (endHere > best) { best = endHere; bestL = start; bestR = i; }
    hang.push({ i, x: nums[i], moi, endHere, best, start, bestL, bestR });
  }
  return hang;
}
