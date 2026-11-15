// Bảng vết LC 560 (tổng tiền tố + map đếm): chạy thuật toán THẬT, ghi trạng thái từng vòng.
// khoiTaoRong = true ⇒ chạy bản SAI (quên {0: 1}) để so.
export function vetSubarrayK(nums, k, khoiTaoRong = false) {
  const seen = new Map(khoiTaoRong ? [] : [[0, 1]]);
  const fmt = () => '{' + [...seen].map(([s, c]) => `${s}:${c}`).join(', ') + '}';
  let sum = 0, count = 0;
  const hang = [];
  for (let i = 0; i < nums.length; i++) {
    const truoc = fmt();
    sum += nums[i];
    const need = sum - k;
    const them = seen.get(need) ?? 0;
    count += them;
    seen.set(sum, (seen.get(sum) ?? 0) + 1);
    hang.push({ i, x: nums[i], sum, need, truoc, them, count, sau: fmt() });
  }
  return hang;
}
