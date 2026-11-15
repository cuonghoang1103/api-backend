// Bảng vết Subsets (LC 78, khuôn vòng for + start): chạy THẬT, mỗi lời gọi backtrack(start) là một hàng —
// đường đi hiện tại (đáp án được ghi), các khung còn chờ trên ngăn xếp lời gọi, các lựa chọn còn lại.
export function vetSubsets(nums) {
  const hang = [];
  const path = [];
  const stack = [];          // path của các khung đang chờ (khung gọi tới khung hiện tại)
  let k = 0;
  function backtrack(start) {
    k++;
    hang.push({ k, start, path: [...path], cho: nums.slice(start), cho_i: [...Array(nums.length - start).keys()].map((j) => j + start), stack: stack.map((p) => '[' + p.join(',') + ']') });
    stack.push([...path]);
    for (let i = start; i < nums.length; i++) {
      path.push(nums[i]);
      backtrack(i + 1);
      path.pop();
    }
    stack.pop();
  }
  backtrack(0);
  return hang;
}
