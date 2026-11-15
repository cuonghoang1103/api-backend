// LC 238 — Product of Array Except Self, no division: one pass left-to-right (product of the LEFT side),
// one pass right-to-left (multiply by the product of the RIGHT side).
const nums = [1, 2, 3, 4];
const a = new Array1DTracer('nums');
const ans = new Array1DTracer('answer');
const log = new LogTracer('two passes');
const answer = [1, 1, 1, 1];
a.set(nums);
ans.set(answer);
log.println('Hint from the interviewer: "what if you knew the product of everything to the LEFT of i?"');
Tracer.delay();
let left = 1;
for (let i = 0; i < nums.length; i++) {
  a.select(i);
  answer[i] = left;
  ans.set(answer);
  ans.patch(i);
  log.println('pass 1, i=' + i + ': answer[i] = left = ' + left + ', then left *= ' + nums[i] + ' -> ' + (left * nums[i]));
  Tracer.delay();
  left *= nums[i];
  a.deselect(i);
  ans.depatch(i);
}
log.println('After pass 1 answer[i] = product of the left side. Now the same from the right.');
Tracer.delay();
let right = 1;
for (let i = nums.length - 1; i >= 0; i--) {
  a.select(i);
  answer[i] = answer[i] * right;
  ans.set(answer);
  ans.patch(i);
  log.println('pass 2, i=' + i + ': answer[i] *= right (' + right + ') -> ' + answer[i] + ', then right *= ' + nums[i]);
  Tracer.delay();
  right *= nums[i];
  a.deselect(i);
  ans.depatch(i);
}
log.println('answer = [' + answer.join(', ') + ']  — O(n) time, O(1) extra space besides the output.');
Tracer.delay();
