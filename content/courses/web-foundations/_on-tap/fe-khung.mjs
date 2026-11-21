/**
 * Khung câu hỏi tiếng Anh kiểu đề FE (21/11/2026).
 *   q(id, cauHoi, [đúng, sai1, sai2, sai3], giảiThích 'EN|||VI', { code, codeLang, chay })
 * - Câu hỏi + phương án TIẾNG ANH như đề FE thật; câu hỏi ghi "EN|||EN" (người học chọn tiếng Việt vẫn thấy đề tiếng Anh,
 *   bộ kiểm course-content-check đòi |||); giải thích song ngữ.
 * - Phương án ĐÚNG luôn viết đầu tiên trong mã nguồn; vị trí hiển thị được xoay theo id (không đoán được "luôn là A").
 * - chay: đặc tả để scripts kiểm (scratch) CHẠY THẬT câu hỏi về mã — { kieu: 'js'|'html'|'tz'|'sql'|'ts', ma?, tz? }.
 *   Bị bỏ khi xuất (seed không cần), giữ trong *_THO để kiểm lại.
 * - Chữ thuần (không HTML); mã KHÔNG chứa chuỗi gạch chéo + n/t (LessonQuizPlayer đổi chúng thành xuống dòng).
 */
export const L = (...dong) => dong.join('\n');

const hash = (s) => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);

export function q(id, cauHoi, phuongAn, giaiThich, extra = {}) {
  if (phuongAn.length !== 4) throw new Error(id + ': cần 4 phương án');
  if (!giaiThich.includes('|||')) throw new Error(id + ': giải thích cần EN|||VI');
  const vt = hash(id) % 4;
  const options = phuongAn.slice(1);
  options.splice(vt, 0, phuongAn[0]);
  const { code, codeLang, chay } = extra;
  return {
    id,
    question: cauHoi + '|||' + cauHoi,
    options,
    correctIndex: vt,
    points: 1,
    explanation: giaiThich,
    ...(code ? { code, codeLang: codeLang || 'javascript' } : {}),
    ...(chay ? { chay } : {}),
  };
}

/** Bỏ trường nội bộ trước khi đưa vào quiz. */
export const xuat = (ds) => ds.map(({ chay, ...rest }) => rest);
