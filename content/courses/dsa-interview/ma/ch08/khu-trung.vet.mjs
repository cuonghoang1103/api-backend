// Bảng vết khử trùng + cắt nhánh: chạy THẬT, ghi cả những nhánh BỊ BỎ (vì sao bỏ).
// vetSubsetsDup: Subsets II — mỗi sự kiện (ghi đáp án / bỏ qua anh em trùng ở cùng tầng) là một hàng.
export function vetSubsetsDup(nums) {
  const a = [...nums].sort((x, y) => x - y);
  const hang = [];
  const path = [];
  function bt(start, depth) {
    hang.push({ loai: 'ghi', depth, start, path: [...path] });
    for (let i = start; i < a.length; i++) {
      if (i > start && a[i] === a[i - 1]) { hang.push({ loai: 'bo', depth, start, i, path: [...path], gt: a[i] }); continue; }
      path.push(a[i]);
      bt(i + 1, depth + 1);
      path.pop();
    }
  }
  bt(0, 0);
  return { a, hang };
}

// vetComboSum: Combination Sum (sort + break) — MỘT hàng cho mỗi lời gọi: nhánh đã đi, giá trị làm vòng lặp dừng
// (break), và số ứng viên phía sau không bao giờ được thử nhờ break.
export function vetComboSum(cands, target) {
  const a = [...cands].sort((x, y) => x - y);
  const hang = [];
  const path = [];
  function bt(start, remain) {
    const h = { path: [...path], remain, start, thu: [], dung: null, boQua: 0 };
    hang.push(h);
    if (remain === 0) return;
    for (let i = start; i < a.length; i++) {
      if (a[i] > remain) { h.dung = a[i]; h.boQua = a.length - i; break; }
      h.thu.push(a[i]);
      path.push(a[i]);
      bt(i, remain - a[i]);
      path.pop();
    }
  }
  bt(0, target);
  return { a, hang };
}
