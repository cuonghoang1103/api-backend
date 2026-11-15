// Bảng vết Remove Duplicates (con trỏ đọc r + con trỏ ghi w): chạy THẬT trên bản sao, chụp mảng sau mỗi vòng.
export function vetRemoveDup(input) {
  const nums = [...input];
  const hang = [];
  let w = 1;
  for (let r = 1; r < nums.length; r++) {
    const moi = nums[r] !== nums[w - 1];
    const wTruoc = w;
    if (moi) nums[w++] = nums[r];
    hang.push({ r, wTruoc, w, moi, x: nums[r], mang: [...nums] });
  }
  return { hang, k: w };
}
