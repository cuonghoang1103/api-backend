// Bảng vết Trapping Rain Water (hai con trỏ): chạy THẬT, ghi từng vòng (bên nào đi, mức nước, nước cộng thêm).
export function vetTrap(h) {
  const hang = [];
  let l = 0, r = h.length - 1, leftMax = 0, rightMax = 0, water = 0;
  while (l < r) {
    if (h[l] < h[r]) {
      leftMax = Math.max(leftMax, h[l]);
      const them = leftMax - h[l];
      water += them;
      hang.push({ l, r, ben: 'L', i: l, muc: leftMax, them, water });
      l++;
    } else {
      rightMax = Math.max(rightMax, h[r]);
      const them = rightMax - h[r];
      water += them;
      hang.push({ l, r, ben: 'R', i: r, muc: rightMax, them, water });
      r--;
    }
  }
  return hang;
}
