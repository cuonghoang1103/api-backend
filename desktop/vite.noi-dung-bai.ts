/**
 * Plugin cắt vùng CSS nội dung bài học từ cây nguồn của web.
 *
 * Xem `src/renderer/features/academy/noiDungBai.ts` để biết vì sao cắt chứ
 * không chép. Thiếu mốc thì NÉM — hỏng ồn ào lúc dựng, thay vì âm thầm cho ra
 * một bản cài mà trang Học viện vẽ xấu và không ai biết tại sao.
 */
import { readFileSync } from 'node:fs';
import path from 'node:path';
import type { Plugin } from 'vite';

const ID = 'virtual:noi-dung-bai.css';
const DAU = 'ct-desktop:bat-dau noi-dung-bai';
const CUOI = 'ct-desktop:ket-thuc noi-dung-bai';

export function noiDungBai(gocDesktop: string): Plugin {
  return {
    name: 'ct-noi-dung-bai',
    resolveId: (id) => (id === ID ? `\0${ID}` : null),
    load(id) {
      if (id !== `\0${ID}`) return null;
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
