// Bảng vết cửa sổ cố định (LC 643): chạy THẬT, ghi cửa sổ, phần tử vào/ra và tổng sau mỗi bước.
export function vetMaxAverage(nums, k) {
  const hang = [];
  let sum = 0;
  for (let i = 0; i < k; i++) sum += nums[i];
  let best = sum;
  hang.push({ l: 0, r: k - 1, vao: null, ra: null, sum, best });
  for (let r = k; r < nums.length; r++) {
    sum += nums[r] - nums[r - k];
    best = Math.max(best, sum);
    hang.push({ l: r - k + 1, r, vao: nums[r], ra: nums[r - k], sum, best });
  }
  return hang;
}
