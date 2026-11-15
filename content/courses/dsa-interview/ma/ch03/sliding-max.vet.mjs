// Bảng vết Sliding Window Maximum (deque đơn điệu): chạy THẬT, ghi deque sau từng bước.
export function vetSlidingMax(nums, k) {
  const dq = [];
  const hang = [];
  for (let i = 0; i < nums.length; i++) {
    const viec = [];
    if (dq.length && dq[0] <= i - k) viec.push(`front ${dq.shift()} left the window`);
    const bo = [];
    while (dq.length && nums[dq[dq.length - 1]] <= nums[i]) bo.push(dq.pop());
    if (bo.length) viec.push(`pop back ${bo.join(', ')} (≤ ${nums[i]})`);
    dq.push(i);
    viec.push(`push ${i}`);
    hang.push({ i, x: nums[i], tu: Math.max(0, i - k + 1), dq: [...dq], viec, max: i >= k - 1 ? nums[dq[0]] : null });
  }
  return hang;
}
