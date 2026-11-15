// Bảng vết trung vị động bằng hai heap: chạy THẬT addNum (định tuyến theo giá trị rồi cân bằng kích thước).
// Mỗi dòng: x, nơi x được đưa vào, có chuyển đỉnh không, nội dung lo (giảm dần, đỉnh đầu tiên) và hi (tăng dần), trung vị.
export function vetTrungVi(stream) {
  const lo = [], hi = [];                               // giữ dạng đã sắp để in cho dễ đọc; phép toán y hệt heap
  const loTop = () => Math.max(...lo), hiTop = () => Math.min(...hi);
  const bo = (arr, v) => arr.splice(arr.indexOf(v), 1);
  const hang = [];
  for (const x of stream) {
    let vao, chuyen = null;
    if (lo.length === 0 || x <= loTop()) { lo.push(x); vao = 'lo'; } else { hi.push(x); vao = 'hi'; }
    if (lo.length > hi.length + 1) { const t = loTop(); bo(lo, t); hi.push(t); chuyen = `lo → hi: ${t}`; }
    else if (hi.length > lo.length) { const t = hiTop(); bo(hi, t); lo.push(t); chuyen = `hi → lo: ${t}`; }
    const med = lo.length > hi.length ? loTop() : (loTop() + hiTop()) / 2;
    hang.push({ x, vao, chuyen, lo: [...lo].sort((a, b) => b - a), hi: [...hi].sort((a, b) => a - b), med });
  }
  return hang;
}
