// Bảng vết Sort Colors (cờ Hà Lan): chạy THẬT trên bản sao, chụp mảng và ba con trỏ SAU mỗi bước.
export function vetSortColors(input) {
  const a = [...input];
  const hang = [];
  let lo = 0, mid = 0, hi = a.length - 1;
  while (mid <= hi) {
    const x = a[mid], midTruoc = mid, hiTruoc = hi;
    let viec;
    if (x === 0) { [a[lo], a[mid]] = [a[mid], a[lo]]; viec = `0 ⇒ swap(${lo}, ${mid}), lo++, mid++`; lo++; mid++; }
    else if (x === 1) { viec = '1 ⇒ mid++'; mid++; }
    else { [a[mid], a[hi]] = [a[hi], a[mid]]; viec = `2 ⇒ swap(${mid}, ${hi}), hi--`; hi--; }
    hang.push({ x, midTruoc, hiTruoc, viec, lo, mid, hi, mang: [...a] });
  }
  return hang;
}
