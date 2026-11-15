// Bảng vết LC 238 (hai lượt tiền tố / hậu tố) — chạy ĐÚNG thuật toán của product-except-self.ts, ghi sau mỗi bước.
export function vetProduct(nums) {
  const n = nums.length;
  const answer = new Array(n).fill(1);
  const hang = [];
  let left = 1;
  for (let i = 0; i < n; i++) {
    answer[i] = left;
    hang.push({ luot: '→ left', i, bien: `left = ${left}`, ghi: `answer[${i}] = ${left}`, answer: [...answer] });
    left *= nums[i];
  }
  let right = 1;
  for (let i = n - 1; i >= 0; i--) {
    const cu = answer[i];
    answer[i] *= right;
    hang.push({ luot: '← right', i, bien: `right = ${right}`, ghi: `answer[${i}] = ${cu} × ${right} = ${answer[i]}`, answer: [...answer] });
    right *= nums[i];
  }
  return hang;
}
