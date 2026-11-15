// Summary Ranges, clean version: grow a run while the next number is exactly one more, then close it.
const arr = new Array1DTracer('nums (sorted, no duplicates)');
const log = new LogTracer('ranges');
const nums = [-3, -2, -1, 4, 6, 7, 8, 10];
arr.set(nums);
log.println('start = 0. A run grows while nums[end + 1] === nums[end] + 1.');
Tracer.delay();
const ranges = [];
let start = 0;
while (start < nums.length) {
  let end = start;
  arr.select(start);
  log.println('new run starts at index ' + start + ' (value ' + nums[start] + ')');
  Tracer.delay();
  while (end + 1 < nums.length && nums[end + 1] === nums[end] + 1) {
    end++;
    arr.select(end);
    log.println('  ' + nums[end] + ' = ' + nums[end - 1] + ' + 1 -> extend, end = ' + end);
    Tracer.delay();
  }
  const why = end + 1 < nums.length ? nums[end + 1] + ' is not ' + nums[end] + ' + 1' : 'no more numbers';
  const text = nums[start] === nums[end] ? String(nums[start]) : nums[start] + '->' + nums[end];
  ranges.push(text);
  for (let k = start; k <= end; k++) arr.patch(k);
  log.println('  stop (' + why + ') -> formatRange gives "' + text + '"');
  Tracer.delay();
  for (let k = start; k <= end; k++) { arr.depatch(k); arr.deselect(k); }
  start = end + 1;
}
log.println('answer = [' + ranges.map(function (r) { return '"' + r + '"'; }).join(', ') + ']  — every index visited once: O(n)');
Tracer.delay();
