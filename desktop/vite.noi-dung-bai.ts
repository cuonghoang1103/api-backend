/**
 * Plugin cắt vùng CSS từ cây nguồn của web: nội dung bài học + bảng trong Notes.
 *
 * Xem `src/renderer/features/academy/noiDungBai.ts` để biết vì sao cắt chứ
 * không chép. Thiếu mốc thì NÉM — hỏng ồn ào lúc dựng, thay vì âm thầm cho ra
 * một bản cài mà trang Học viện vẽ xấu và không ai biết tại sao.
 */
import { readFileSync } from 'node:fs';
import path from 'node:path';
import type { Plugin } from 'vite';

/** Vùng cắt: module ảo → tên mốc trong globals.css. */
const VUNG: Record<string, string> = {
  'virtual:noi-dung-bai.css': 'noi-dung-bai',
  // Bảng trong Notes (Sổ lệnh…). Thiếu vùng này bảng trong app KHÔNG có khung
  // nào — ảnh người dùng 26/09/2026: chữ rơi tự do, không biết dòng nào của lệnh nào.
  'virtual:bang-ghi-chu.css': 'bang-ghi-chu',
};

export function noiDungBai(gocDesktop: string): Plugin {
  return {
    name: 'ct-noi-dung-bai',
    resolveId: (id) => (id in VUNG ? `\0${id}` : null),
    load(id) {
      const ten = id.startsWith('\0') ? VUNG[id.slice(1)] : undefined;
      if (!ten) return null;
      const DAU = `ct-desktop:bat-dau ${ten}`;
      const CUOI = `ct-desktop:ket-thuc ${ten}`;
      const tep = path.resolve(gocDesktop, '../frontend/src/app/globals.css');
      const css = readFileSync(tep, 'utf8');
      const i = css.indexOf(DAU);
      const j = css.indexOf(CUOI);
      if (i === -1 || j === -1 || j <= i) {
        throw new Error(
          `Không tìm thấy mốc \`${DAU}\` / \`${CUOI}\` trong ${tep}. `
          + 'Ai đó vừa xoá chúng — xem chú thích ngay trên mốc trong globals.css.',
        );
      }
      // Bỏ nốt phần đuôi của dòng mốc mở để không lọt một mẩu chú thích cụt.
      return css.slice(css.indexOf('*/', i) + 2, j - 3);
    },
  };
}
