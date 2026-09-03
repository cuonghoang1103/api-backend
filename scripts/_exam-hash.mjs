// Hash NỘI DUNG câu hỏi — bền qua re-seed (id đổi, nội dung giữ). classifier và
// reapply PHẢI dùng CHUNG hàm này để khớp. Chuẩn hoá: bỏ tag HTML, gộp khoảng
// trắng, thường hoá, cắt ~600 ký tự đầu → sha256.
import { createHash } from 'node:crypto';

export function normalizePrompt(prompt) {
  return String(prompt || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()
    .slice(0, 600);
}

export function promptHash(prompt) {
  return createHash('sha256').update(normalizePrompt(prompt)).digest('hex');
}
