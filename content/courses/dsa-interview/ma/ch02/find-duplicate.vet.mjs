// Bảng vết LC 287: chạy THẬT Floyd trên i -> nums[i], ghi slow/fast ở pha 1 và p/slow ở pha 2.
export function vetFindDuplicate(nums) {
  const hang = [];
  let slow = nums[0], fast = nums[0];
  hang.push({ pha: 1, a: slow, b: fast, ghi: 'start' });
  do {
    slow = nums[slow];
    fast = nums[nums[fast]];
    hang.push({ pha: 1, a: slow, b: fast, ghi: slow === fast ? 'meet' : '' });
  } while (slow !== fast);
  let p = nums[0];
  hang.push({ pha: 2, a: p, b: slow, ghi: p === slow ? 'entry' : 'start' });
  while (p !== slow) {
    p = nums[p];
    slow = nums[slow];
    hang.push({ pha: 2, a: p, b: slow, ghi: p === slow ? 'entry' : '' });
  }
  return { hang, dup: p };
}
