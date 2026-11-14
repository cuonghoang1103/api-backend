#!/usr/bin/env node
/**
 * Kéo góp ý khoá học cần đối chiếu từ prod (qua /api/v1/internal) ⇒ tệp JSON để Claude điều phối đọc.
 * Mỗi mục kèm ĐƯỜNG TỆP nội dung khoá (content/courses/… hoặc content/academy/…) và tệp chứa đúng bài, để grep/đọc
 * mà đối chiếu. Quy trình: docs/gop-y-khoa-hoc.md.
 *
 *   node scripts/gop-y/keo.mjs                                  # MOI + DANG_DOI_CHIEU, mọi khoá
 *   node scripts/gop-y/keo.mjs --khoa nodejs                    # một khoá
 *   node scripts/gop-y/keo.mjs --trang-thai NEN_BO_SUNG         # lấy danh sách để lên kế hoạch nâng cấp
 *   node scripts/gop-y/keo.mjs --nhan                           # kéo xong đặt MOI ⇒ DANG_DOI_CHIEU (giữ chỗ, tránh
 *                                                               #   hai phiên cùng đối chiếu một góp ý)
 *   node scripts/gop-y/keo.mjs --out /đường/gop-y-cho.json      # mặc định scripts/gop-y/.cho/gop-y-cho.json
 *
 * Env: INTERNAL_API_TOKEN (hoặc ~/.config/cuongthai/internal-api-token), GOP_Y_API (mặc định https://cuongthai.com).
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { GOC_API, GOC_REPO, docCo, goiNoiBo, timTepNoiDung } from './_chung.mjs';

const co = docCo();
const trangThai = typeof co['trang-thai'] === 'string' ? co['trang-thai'] : 'MOI,DANG_DOI_CHIEU';
const khoa = typeof co.khoa === 'string' ? co.khoa : '';
const out = path.resolve(typeof co.out === 'string' ? co.out : path.join(GOC_REPO, 'scripts/gop-y/.cho/gop-y-cho.json'));

const tatCa = [];
for (let page = 1; page <= 200; page++) {
  const q = new URLSearchParams({ trangThai, limit: '100', page: String(page), sapXep: 'phieu' });
  if (khoa) q.set('courseSlug', khoa);
  const d = await goiNoiBo('GET', `/course-suggestions?${q}`);
  tatCa.push(...d.items);
  if (page >= d.totalPages) break;
}

const items = tatCa.map((g) => {
  const tep = timTepNoiDung(g.course, g.lesson);
  return {
    id: g.id,
    url: `${GOC_API}/courses/${g.course.slug}/gop-y?id=${g.id}`,
    trangThai: g.trangThai,
    loai: g.loai,
    vaiTro: g.vaiTro,
    tenAi: g.tenAi,
    soPhieu: g.soPhieu,
    createdAt: g.createdAt,
    course: g.course,
    lesson: g.lesson,
    noiDung: g.noiDung,
    nguon: g.nguon,
    ketQuaDoiChieu: g.ketQuaDoiChieu,
    bangChung: g.bangChung,
    tepKhoa: tep.tepKhoa,
    thuMucKhoa: tep.thuMucKhoa,
    tepBai: tep.tepBai,
  };
});

if (co.nhan) {
  for (const g of items.filter((x) => x.trangThai === 'MOI')) {
    await goiNoiBo('PATCH', `/course-suggestions/${g.id}`, { trangThai: 'DANG_DOI_CHIEU' });
    g.trangThai = 'DANG_DOI_CHIEU';
  }
}

mkdirSync(path.dirname(out), { recursive: true });
writeFileSync(
  out,
  JSON.stringify(
    {
      keoLuc: new Date().toISOString(),
      nguon: GOC_API,
      locTrangThai: trangThai,
      tong: items.length,
      huongDan:
        'Với mỗi mục: đọc noiDung → grep/đọc tepBai (nếu trống thì tepKhoa + thuMucKhoa) → kết luận DA_CO (bangChung = trích đoạn bài) / ' +
        'NEN_BO_SUNG (lý do + bài nên chèn) / KHONG_CHINH_XAC (nguồn chứng minh) / TRUNG. Ghi bằng scripts/gop-y/ghi.mjs. Chi tiết: docs/gop-y-khoa-hoc.md.',
      items,
    },
    null,
    2,
  ),
);

const theoKhoa = new Map();
for (const g of items) theoKhoa.set(g.course.slug, (theoKhoa.get(g.course.slug) ?? 0) + 1);
console.log(`✓ ${items.length} góp ý (${trangThai}) ⇒ ${path.relative(process.cwd(), out) || out}`);
for (const [k, n] of [...theoKhoa].sort((a, b) => b[1] - a[1])) console.log(`   ${String(n).padStart(4)}  ${k}`);
const thieuTep = items.filter((g) => !g.tepKhoa.length).map((g) => `#${g.id} ${g.course.slug}`);
if (thieuTep.length) console.log(`⚠ ${thieuTep.length} mục không tìm thấy tệp nội dung khoá: ${thieuTep.slice(0, 10).join(', ')}`);
