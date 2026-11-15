// Bảng vết Two Sum II (hai con trỏ đối đầu): chạy thuật toán THẬT, ghi trạng thái từng vòng.
export function vetTwoSumII(nums, target) {
  const hang = [];
  let l = 0, r = nums.length - 1;
  while (l < r) {
    const sum = nums[l] + nums[r];
    const viec = sum === target ? 'found' : sum < target ? 'l++' : 'r--';
    hang.push({ l, r, sum, viec });
    if (viec === 'found') break;
    if (viec === 'l++') l++; else r--;
  }
  return hang;
}
