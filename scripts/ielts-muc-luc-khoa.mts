/**
 * Mục lục NHẸ của các khoá tiếng Anh kiểu sách (IELTS Tập 1–5 + Tiếng Anh giao tiếp) cho MÁY CHỦ — 24/11/2026.
 *
 * Vì sao: nội dung các khoá nằm trong mã frontend (không có trong image backend). "Nhận xét tuần" của CuongMini cần biết
 * tên bài / tên bài tập / số phút của bài để nói cụ thể ("bài tập 'Chia động từ trong ngoặc' Ngày 4 được 55%") và để
 * xếp kế hoạch tuần sau (buổi kế tiếp chưa học). Script đọc ĐÚNG các tệp `ngay/manifest.ts` do
 * `frontend/scripts/course-manifest.mts` sinh (chỉ có `import type` ⇒ nạp được bằng tsx), rồi ghi
 * `content/ielts/muc-luc-khoa.json` (thư mục `content/` có trong image backend).
 *
 *   npx tsx scripts/ielts-muc-luc-khoa.mts           # ghi lại tệp
 *   npx tsx scripts/ielts-muc-luc-khoa.mts --check   # không ghi; lệch ⇒ exit 1
 *
 * Chốt chống trôi: `src/services/ielts/nhanXetTuan.test.ts` dựng lại trong bộ nhớ và so với tệp đã ghi.
 * Giới hạn đã biết: Tập 1 Ngày 1 viết thẳng trong `ielts/data.ts` (không có trong manifest) ⇒ mục lục Tập 1 bắt đầu từ
 * Ngày 2; số buổi vẫn đúng (15).
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const LANG = join(ROOT, 'frontend/src/app/language/[code]');
export const TEP_MUC_LUC = join(ROOT, 'content/ielts/muc-luc-khoa.json');

/** stage · đường web · tên · thư mục manifest. Số buổi = khoá lớn nhất của manifest. */
export const KHOA_EN = [
  { stage: 'sach1', duong: '/language/en/ielts', ten: 'IELTS Tập 1', thuMuc: 'ielts/ngay' },
  { stage: 'sach2', duong: '/language/en/ielts/tap-2', ten: 'IELTS Tập 2', thuMuc: 'ielts/tap-2/ngay' },
  { stage: 'sach3', duong: '/language/en/ielts/tap-3', ten: 'IELTS Tập 3', thuMuc: 'ielts/tap-3/ngay' },
  { stage: 'sach4', duong: '/language/en/ielts/tap-4', ten: 'IELTS Tập 4', thuMuc: 'ielts/tap-4/ngay' },
  { stage: 'sach5', duong: '/language/en/ielts/tap-5', ten: 'IELTS Tập 5', thuMuc: 'ielts/tap-5/ngay' },
  { stage: 'giaotiep1', duong: '/language/en/giao-tiep', ten: 'Tiếng Anh giao tiếp', thuMuc: 'giao-tiep/ngay' },
] as const;

type LessonMeta = { id: string; kind: string; title: string; minutes: number; ready: boolean };
type DayMeta = { lessons: LessonMeta[]; quizzes: { id: string; title: string; lessonId: string; count: number }[] };

const cat = (s: string, n: number) => (s.length > n ? `${s.slice(0, n - 1)}…` : s);

export async function dungMucLuc() {
  const khoa: Record<string, unknown> = {};
  for (const k of KHOA_EN) {
    const mod = (await import(pathToFileURL(join(LANG, k.thuMuc, 'manifest.ts')).href)) as { MANIFEST: Record<number, DayMeta> };
    const so = Object.keys(mod.MANIFEST).map(Number).sort((a, b) => a - b);
    const buoi: Record<string, unknown> = {};
    for (const n of so) {
      const d = mod.MANIFEST[n]!;
      const bai = d.lessons.filter((l) => l.ready).map((l) => [l.id, l.kind, cat(l.title, 90), l.minutes]);
      const quiz = d.quizzes.map((q) => [q.id, cat(q.title, 90), q.lessonId]);
      buoi[String(n)] = { phut: d.lessons.filter((l) => l.ready).reduce((s, l) => s + l.minutes, 0), bai, quiz };
    }
    khoa[k.stage] = { duong: k.duong, ten: k.ten, soBuoi: so.length ? so[so.length - 1] : 0, buoi };
  }
  return { phienBan: 1, ghiChu: 'Sinh bằng scripts/ielts-muc-luc-khoa.mts — đừng sửa tay.', khoa };
}

const laChinh = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
if (laChinh) {
  const moi = `${JSON.stringify(await dungMucLuc())}\n`;
  if (process.argv.includes('--check')) {
    let cu = '';
    try { cu = readFileSync(TEP_MUC_LUC, 'utf8'); } catch { /* chưa có */ }
    if (cu !== moi) { console.error('✗ content/ielts/muc-luc-khoa.json lệch manifest — chạy: npx tsx scripts/ielts-muc-luc-khoa.mts'); process.exit(1); }
    console.log('✓ muc-luc-khoa.json khớp manifest');
  } else {
    writeFileSync(TEP_MUC_LUC, moi);
    console.log(`✓ ghi ${TEP_MUC_LUC} (${(moi.length / 1024).toFixed(0)} KB)`);
  }
}
