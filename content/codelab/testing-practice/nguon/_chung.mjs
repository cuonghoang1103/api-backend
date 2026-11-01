/**
 * Testing · bộ luyện `mutation` — phần dùng chung (01/11/2026).
 *
 * NGUỒN SỰ THẬT của đề là của khoá: content/courses/testing/_de-codelab-mutation.json (đột biến { file, from, to, label },
 * đã kiểm 58/58 bị diệt bằng scripts/tst/kiem-de-mutation.mjs) + code đúng ở content/courses/testing/_labflow-lite.
 * `deTuKhoa(id, …)` lấy đúng đề đó: đọc `fileDung` (+ mọi tệp chúng import tương đối) làm `impl`, chép `dotBien`
 * nguyên dạng, thêm gợi ý (`goiYDotBien[label]` ⇒ `goiY` của đột biến, hiện khi nó còn sống). Bộ xuất (codelab-xuat-de.mjs) dựng kiểm từ đó.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DAY = path.dirname(fileURLToPath(import.meta.url));
const KHOA_DIR = path.resolve(DAY, '../../../courses/testing');
const DU_AN = path.join(KHOA_DIR, '_labflow-lite');
export const DE_KHOA = JSON.parse(fs.readFileSync(path.join(KHOA_DIR, '_de-codelab-mutation.json'), 'utf8')).de;
export const KHOA = 'testing';

/** `fileDung` + mọi tệp chúng `import … from './x.js'` (bắc cầu) — đọc từ ảnh chụp LabFlow Lite. */
export function implTu(fileDung) {
  const out = {};
  const hang = [...fileDung];
  while (hang.length) {
    const t = hang.shift();
    if (out[t] != null) continue;
    out[t] = fs.readFileSync(path.join(DU_AN, t), 'utf8');
    for (const m of out[t].matchAll(/from\s+['"](\.{1,2}\/[^'"]+)['"]/g)) hang.push(path.posix.normalize(path.posix.join(path.posix.dirname(t), m[1])));
  }
  return out;
}

const hai = (s) => { const [en, vi] = String(s).split('|||'); return vi ? { en, vi } : en; };

/**
 * Một đề `mutation` dựng từ đề của khoá. `goiYDotBien`: { '<label>': 'gợi ý' } (thiếu ⇒ lỗi — mọi đột biến phải có gợi ý).
 * `them`: các trường đề còn lại (moTa, yeuCau, khoiDau, loiGiai, giaiThich…) — xem content/codelab/README.md mục 3d.
 */
export function deTuKhoa(id, { goiYDotBien, toiThieuTest, nguong, an = [], ...them }) {
  const d = DE_KHOA.find((x) => x.id === id);
  if (!d) throw new Error(`không có đề ${id} trong _de-codelab-mutation.json`);
  const impl = implTu(d.fileDung);
  const dotBien = d.dotBien.map((m) => {
    if (!goiYDotBien?.[m.label]) throw new Error(`${id}: thiếu goiYDotBien cho đột biến "${m.label}"`);
    return { ...m, goiY: goiYDotBien[m.label], ...(an.includes(m.label) ? { an: true } : {}) };
  });
  return {
    tieuDe: hai(d.tieuDe),
    ngonNgu: 'javascript',
    ...them,
    // bài làm = tệp test + bản sao code cần test (đọc tham khảo; máy chấm luôn dùng bản của đề)
    khoiDau: { ...them.khoiDau, ...impl },
    loiGiai: { ...them.loiGiai, ...impl },
    tests: { loai: 'mutation', impl, toiThieuTest, ...(nguong ? { nguong } : {}), timeoutMs: 4000, dotBien },
  };
}

export const TN = {
  mutant: { en: 'mutant', vi: 'đột biến', giaiThich: 'bản code bị cài sẵn MỘT lỗi nhỏ; bộ test tốt phải đỏ với nó' },
  killed: { en: 'killed / survived', vi: 'bị diệt / còn sống', giaiThich: 'test đỏ với đột biến = diệt; vẫn xanh = sống (bộ test có lỗ hổng)' },
  assertion: { en: 'assertion', vi: 'khẳng định', giaiThich: 'một dòng expect(…).toX(…) — test không có khẳng định luôn xanh' },
  boundary: { en: 'boundary value', vi: 'giá trị biên', giaiThich: 'giá trị nằm đúng mép luật (30 chỗ, 14 ngày, đúng 4 giờ) và ±1' },
  partition: { en: 'equivalence partition', vi: 'phân vùng tương đương', giaiThich: 'nhóm đầu vào mà code xử lý giống nhau — test một đại diện mỗi vùng' },
  matcher: { en: 'matcher', vi: 'hàm so khớp', giaiThich: 'phần .toBe/.toEqual/.toThrow… quyết định thế nào là "đúng"' },
};
