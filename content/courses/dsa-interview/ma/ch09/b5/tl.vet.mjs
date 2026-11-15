// Bảng vết bài 9.5: chạy ĐÚNG các thuật toán của tl-jump.ts / tl-gas.ts và ghi trạng thái từng vòng.

// LC 55 — farthest reach.
export function vetCanJump(nums) {
  const hang = [];
  let far = 0;
  for (let i = 0; i < nums.length; i++) {
    if (i > far) { hang.push({ i, farTruoc: far, far, chet: true }); return { hang, kq: false }; }
    const farTruoc = far;
    far = Math.max(far, i + nums[i]);
    const xong = far >= nums.length - 1;
    hang.push({ i, farTruoc, far, xong });
    if (xong) return { hang, kq: true };
  }
  return { hang, kq: true };
}

// LC 45 — levels: [.., end] reachable with `jumps` jumps.
export function vetJump(nums) {
  const hang = [];
  let jumps = 0, end = 0, far = 0;
  for (let i = 0; i < nums.length - 1; i++) {
    far = Math.max(far, i + nums[i]);
    const het = i === end;
    if (het) { jumps++; end = far; }
    hang.push({ i, far, het, jumps, end });
  }
  return { hang, kq: jumps };
}

// LC 134 — tank since start, total.
export function vetGas(gas, cost) {
  const hang = [];
  let total = 0, tank = 0, start = 0;
  for (let i = 0; i < gas.length; i++) {
    const gain = gas[i] - cost[i];
    total += gain;
    tank += gain;
    const am = tank < 0;
    hang.push({ i, gain, tank, total, am, start: am ? i + 1 : start });
    if (am) { start = i + 1; tank = 0; }
  }
  return { hang, kq: total >= 0 ? start : -1 };
}
