// Bảng vết Boyer–Moore (LC 169): chạy thuật toán THẬT, ghi ứng viên + bộ đếm sau từng phần tử.
export function vetBauChon(nums) {
  let candidate = null, count = 0;
  const hang = [];
  nums.forEach((x, i) => {
    const doi = count === 0;
    if (doi) candidate = x;
    count += x === candidate ? 1 : -1;
    hang.push({ i, x, doi, candidate, count });
  });
  return hang;
}
