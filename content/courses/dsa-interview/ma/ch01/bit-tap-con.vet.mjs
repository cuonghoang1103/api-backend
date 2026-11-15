// Bảng vết bitmask → tập con: chạy THẬT, mỗi mask ghi dạng nhị phân và tập con nó chọn.
export function vetTapCon(nums) {
  const n = nums.length;
  const hang = [];
  for (let mask = 0; mask < (1 << n); mask++) {
    const chon = [];
    for (let i = 0; i < n; i++) if (mask & (1 << i)) chon.push(i);
    hang.push({ mask, bin: mask.toString(2).padStart(n, '0'), chon, tap: chon.map((i) => nums[i]) });
  }
  return hang;
}
