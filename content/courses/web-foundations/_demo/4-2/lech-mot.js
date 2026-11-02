// The most common loop bug: off by one.
const nums = [10, 20, 30];
for (let i = 0; i <= nums.length; i++) console.log(i, nums[i]);   // i = 3 does not exist

// Trace a small example by hand before you run the big one.
let sum = 0;
for (let i = 1; i <= 4; i++) {
  sum += i;
  console.log(`i=${i} sum=${sum}`);
}
