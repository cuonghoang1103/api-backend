// Bảng vết Two Sum (hash map): chạy thuật toán THẬT và ghi trạng thái từng vòng.
export function vetTwoSum(nums, target) {
  const seen = new Map();
  const hang = [];
  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i];
    const truoc = '{' + [...seen].map(([k, v]) => `${k}:${v}`).join(', ') + '}';
    const hit = seen.has(need);
    hang.push({ i, x: nums[i], need, truoc, hit, j: hit ? seen.get(need) : null });
    if (hit) break;
    seen.set(nums[i], i);
  }
  return hang;
}
