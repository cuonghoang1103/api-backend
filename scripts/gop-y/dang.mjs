#!/usr/bin/env node
/**
 * Claude điều phối (hoặc agent khác) ĐĂNG góp ý dạng AI_AGENT cho một khoá (POST /api/v1/internal/course-suggestions).
 * Góp ý hiện công khai ở /courses/<slug>/gop-y với nhãn 🤖 + tên AI. Nội dung trùng trong cùng khoá ⇒ 409, bỏ qua.
 *
 *   node scripts/gop-y/dang.mjs --khoa nodejs --loai THIEU_KIEN_THUC --noi-dung "…" [--bai nodejs-5-3-middleware] \
 *        [--nguon https://…] [--ten-ai "Claude Opus 5.5 (điều phối)"]
 *   node scripts/gop-y/dang.mjs --tep goi-y.json [--thu]
 *       tệp: mảng { courseSlug, loai, noiDung, lessonSlug?, nguon?, tenAi? }
 *
 * loai: THIEU_KIEN_THUC | SAI_SOT | LIEN_TUONG | NANG_CAP | KHAC
 * Env: INTERNAL_API_TOKEN (hoặc ~/.config/cuongthai/internal-api-token), GOP_Y_API.
 */
import { readFileSync } from 'node:fs';
import { docCo, goiNoiBo } from './_chung.mjs';

const LOAI = ['THIEU_KIEN_THUC', 'SAI_SOT', 'LIEN_TUONG', 'NANG_CAP', 'KHAC'];
const co = docCo();
const tenAiMacDinh = typeof co['ten-ai'] === 'string' ? co['ten-ai'] : 'Claude (điều phối)';

let ds;
if (typeof co.tep === 'string') {
  const goc = JSON.parse(readFileSync(co.tep, 'utf8'));
  ds = Array.isArray(goc) ? goc : goc.items;
} else {
  ds = [{
    courseSlug: co.khoa, loai: co.loai, noiDung: co['noi-dung'],
    lessonSlug: typeof co.bai === 'string' ? co.bai : undefined,
    nguon: typeof co.nguon === 'string' ? co.nguon : undefined,
  }];
}

const loi = [];
for (const [i, m] of (ds ?? []).entries()) {
  if (typeof m.courseSlug !== 'string' || !m.courseSlug) loi.push(`mục ${i}: thiếu courseSlug (--khoa)`);
  if (!LOAI.includes(m.loai)) loi.push(`mục ${i}: loai phải là ${LOAI.join(' | ')}`);
  if (typeof m.noiDung !== 'string' || m.noiDung.trim().length < 10 || m.noiDung.length > 5000) loi.push(`mục ${i}: noiDung 10–5000 ký tự`);
}
if (!ds?.length || loi.length) {
  console.error(`✗ ${loi.join('\n  ') || 'Không có mục nào'}\nDùng: node scripts/gop-y/dang.mjs --khoa <slug> --loai <LOAI> --noi-dung "…" [--bai <lessonSlug>] [--nguon URL]`);
  process.exit(2);
}
if (co.thu) {
  console.log(`✓ ${ds.length} mục hợp lệ (chạy thử — chưa đăng)`);
  process.exit(0);
}

let ok = 0;
for (const m of ds) {
  try {
    const r = await goiNoiBo('POST', '/course-suggestions', { ...m, tenAi: m.tenAi || tenAiMacDinh });
    ok++;
    console.log(`✓ #${r.id} ${m.courseSlug}${r.lesson ? ` › ${r.lesson.slug}` : ''}`);
  } catch (e) {
    if (e.status === 409) console.log(`· bỏ qua (trùng góp ý #${e.body?.data?.trungVoiId ?? '?'}) — ${m.courseSlug}`);
    else console.error(`✗ ${m.courseSlug}: ${e.message}`);
  }
}
console.log(`Xong: đăng ${ok}/${ds.length}.`);
