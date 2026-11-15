// Bảng vết hiệu mảng (difference array): trạng thái diff sau từng lượt đăng ký, rồi lượt cộng dồn.
export function vetHieuMang(bookings, hours) {
  const diff = new Array(hours + 1).fill(0);
  const capNhat = [];
  for (const [enter, leave] of bookings) {
    diff[enter] += 1;
    diff[leave] -= 1;
    capNhat.push({ enter, leave, diff: diff.slice() });
  }
  const congDon = [];
  let running = 0;
  for (let h = 0; h < hours; h++) {
    running += diff[h];
    congDon.push({ h, d: diff[h], running });
  }
  return { capNhat, congDon };
}
