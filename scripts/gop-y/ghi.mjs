#!/usr/bin/env node
/**
 * Ghi KẾT QUẢ ĐỐI CHIẾU góp ý khoá học lên prod (PATCH /api/v1/internal/course-suggestions/:id).
 * Quy trình: docs/gop-y-khoa-hoc.md.
 *
 *   node scripts/gop-y/ghi.mjs ket-qua.json          # ghi thật
 *   node scripts/gop-y/ghi.mjs ket-qua.json --thu    # chỉ kiểm tệp, không gọi máy chủ
 *
 * Tệp: mảng (hoặc { items: [...] }) các mục
 *   {
 *     "id": 12,
 *     "trangThai": "DA_CO" | "NEN_BO_SUNG" | "DA_LEN_KE_HOACH" | "DA_BO_SUNG" | "KHONG_CHINH_XAC" | "TRUNG" | "DANG_DOI_CHIEU" | "AN" | "MOI",
 *     "ketQuaDoiChieu": "Kết luận ngắn gọn, đủ để người đọc hiểu vì sao",
 *     "bangChung": [{ "lessonSlug": "nodejs-5-3-middleware", "tieuDe": "5.3 Middleware", "trichDoan": "…", "tep": "content/…" }],
 *     "nguoiDoiChieu": "Claude"          // tuỳ chọn, mặc định "Claude"
 *   }
 * Env: INTERNAL_API_TOKEN (hoặc ~/.config/cuongthai/internal-api-token), GOP_Y_API.
 */
import { readFileSync } from 'node:fs';
import { docCo, goiNoiBo } from './_chung.mjs';

const HOP_LE = ['MOI', 'DANG_DOI_CHIEU', 'DA_CO', 'NEN_BO_SUNG', 'DA_LEN_KE_HOACH', 'DA_BO_SUNG', 'KHONG_CHINH_XAC', 'TRUNG', 'AN'];
const tep = process.argv.slice(2).find((a) => !a.startsWith('--'));
const co = docCo();
if (!tep) {
  console.error('Dùng: node scripts/gop-y/ghi.mjs <ket-qua.json> [--thu]');
  process.exit(2);
}
const goc = JSON.parse(readFileSync(tep, 'utf8'));
const ds = Array.isArray(goc) ? goc : goc.items;
if (!Array.isArray(ds) || !ds.length) {
  console.error('✗ Tệp phải là mảng (hoặc { items: [...] }) và không rỗng');
  process.exit(2);
}

const loi = [];
for (const [i, m] of ds.entries()) {
  if (!Number.isInteger(m.id) || m.id <= 0) loi.push(`mục ${i}: thiếu id`);
  if (m.trangThai && !HOP_LE.includes(m.trangThai)) loi.push(`#${m.id}: trạng thái lạ ${m.trangThai}`);
  if (['DA_CO', 'KHONG_CHINH_XAC', 'NEN_BO_SUNG', 'TRUNG'].includes(m.trangThai) && !m.ketQuaDoiChieu?.trim()) {
    loi.push(`#${m.id}: ${m.trangThai} phải kèm ketQuaDoiChieu (lý do)`);
  }
  if (m.trangThai === 'DA_CO' && !(Array.isArray(m.bangChung) && m.bangChung.length)) {
    loi.push(`#${m.id}: DA_CO phải kèm bangChung (bài + trích đoạn đã có kiến thức)`);
  }
}
if (loi.length) {
  console.error(`✗ ${loi.length} lỗi trong tệp:\n  ${loi.join('\n  ')}`);
  process.exit(1);
}
if (co.thu) {
  console.log(`✓ Tệp hợp lệ: ${ds.length} mục (chạy thử — chưa ghi gì)`);
  process.exit(0);
}

let ok = 0;
for (const m of ds) {
  const { id, trangThai, ketQuaDoiChieu, bangChung, nguoiDoiChieu } = m;
  try {
    const r = await goiNoiBo('PATCH', `/course-suggestions/${id}`, {
      ...(trangThai ? { trangThai } : {}),
      ...(ketQuaDoiChieu !== undefined ? { ketQuaDoiChieu } : {}),
      ...(bangChung !== undefined ? { bangChung } : {}),
      nguoiDoiChieu: nguoiDoiChieu || 'Claude',
    });
    ok++;
    console.log(`✓ #${id} ⇒ ${r.trangThai} (${r.course.slug})`);
  } catch (e) {
    console.error(`✗ #${id}: ${e.message}`);
  }
}
console.log(`Xong: ${ok}/${ds.length} mục đã ghi.`);
process.exit(ok === ds.length ? 0 : 1);
