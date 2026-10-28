//@from F2
// src/utils/format.js — hàm THUẦN định dạng dữ liệu để hiển thị (dễ kiểm, dùng lại ở mọi trang)

// Ngày hôm nay "yyyy-mm-dd" theo giờ MÁY. Không dùng toISOString(): đó là giờ UTC — 6h sáng ở VN vẫn là "hôm qua".
export function todayISO() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}
//#F3

// 0 ⇒ "Free" · 199000 ⇒ "199.000 ₫" (dấu chấm ngăn cách hàng nghìn kiểu Việt Nam)
export function formatPrice(price) {
  const n = Number(price) || 0;
  if (n === 0) return 'Free';
  return `${String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.')} ₫`;
}
//#end
//#F5

// "2026-09-01" hoặc "2026-09-01T10:30:00.000Z" ⇒ "01/09/2026" — cắt chuỗi, không qua new Date() nên không lệch múi giờ
export function formatDate(iso) {
  if (!iso) return '';
  const [y, m, d] = String(iso).slice(0, 10).split('-');
  return `${d}/${m}/${y}`;
}
//#end
