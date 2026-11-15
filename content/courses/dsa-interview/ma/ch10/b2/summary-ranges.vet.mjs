// Bảng vết Summary Ranges (bản SẠCH): chạy đúng thuật toán và ghi trạng thái sau mỗi dải được đóng.
export function vetSummary(nums) {
  const hang = [];
  const ranges = [];
  let start = 0;
  while (start < nums.length) {
    let end = start;
    const buoc = [];
    while (end + 1 < nums.length && nums[end + 1] === nums[end] + 1) { buoc.push(nums[end + 1]); end++; }
    const dung = end + 1 < nums.length ? `${nums[end + 1]} ≠ ${nums[end]} + 1` : 'end of array';
    ranges.push(nums[start] === nums[end] ? String(nums[start]) : `${nums[start]}->${nums[end]}`);
    hang.push({ start, end, buoc, dung, out: [...ranges] });
    start = end + 1;
  }
  return hang;
}
