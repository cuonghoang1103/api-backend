// House Robber: fill dp[i] = max(skip, rob) left to right and watch which two cells each step reads.
const NUMS = [2, 7, 9, 3, 1, 5, 8];
const street = new Array1DTracer('nums (money in each house)');
const table = new Array1DTracer('dp[i] = best total using houses 0..i   (-1 = not computed yet)');
const log = new LogTracer('decisions');
const n = NUMS.length;
const dp = new Array(n).fill(-1);
street.set(NUMS);
table.set(dp);
log.println('Rule: dp[i] = max(dp[i-1]  (skip house i),  nums[i] + dp[i-2]  (rob house i)).');
Tracer.delay();
dp[0] = NUMS[0]; table.set(dp); table.patch(0);
log.println('base: dp[0] = nums[0] = ' + dp[0]);
Tracer.delay(); table.depatch(0);
dp[1] = Math.max(NUMS[0], NUMS[1]); table.set(dp); table.patch(1);
log.println('base: dp[1] = max(' + NUMS[0] + ', ' + NUMS[1] + ') = ' + dp[1]);
Tracer.delay(); table.depatch(1);
for (let i = 2; i < n; i++) {
  street.select(i);
  table.select(i - 2, i - 1);
  const skip = dp[i - 1], take = NUMS[i] + dp[i - 2];
  log.println('i=' + i + ': skip -> ' + skip + ',  rob ' + NUMS[i] + ' + dp[' + (i - 2) + '] = ' + take);
  Tracer.delay();
  dp[i] = Math.max(skip, take);
  table.set(dp); table.patch(i);
  log.println('   dp[' + i + '] = ' + dp[i] + (take > skip ? '  (rob house ' + i + ')' : '  (skip house ' + i + ')'));
  Tracer.delay();
  table.depatch(i); table.deselect(i - 2, i - 1); street.deselect(i);
}
const picked = [];
for (let i = n - 1; i >= 0;) { if (i === 0 || dp[i] !== dp[i - 1]) { picked.push(i); i -= 2; } else i -= 1; }
picked.reverse();
for (let k = 0; k < picked.length; k++) street.patch(picked[k]);
log.println('answer dp[' + (n - 1) + '] = ' + dp[n - 1] + ', houses robbed: ' + picked.join(', ') + ' (walk back: house i is robbed when dp[i] != dp[i-1])');
Tracer.delay();
