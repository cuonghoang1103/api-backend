// text.js — so sánh chữ tiếng Việt "như người đọc": không phân biệt dấu, hoa thường, NFC/NFD
// "Phòng Lab IoT" ⇒ "phong lab iot"; đ/Đ không tách được bằng NFD nên đổi tay
export const fold = (s) => s.normalize('NFD').replace(/\p{M}/gu, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase();
