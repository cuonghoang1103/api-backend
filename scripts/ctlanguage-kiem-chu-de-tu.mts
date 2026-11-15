/**
 * Kiểm TỪ VỰNG THEO CHỦ ĐỀ CT Language (`content/ctlanguage/chu-de-tu/`): danh mục (14 mã cũ còn, ảnh có trong danh mục
 * Fluent), từng tệp (khuôn từ, 60–150 từ, không trùng, ≥ 30% có ví dụ, mục con thuộc chủ đề), thống kê ví dụ / ảnh / cấp
 * (cấp ước lượng đếm riêng), từ trùng giữa các chủ đề. Có CSDL ⇒ báo thêm % từ khớp mục `ctl_tu` và (ja/zh) số từ có
 * cách đọc KHÁC mọi cách đọc của từ điển.
 *
 *   npx tsx scripts/ctlanguage-kiem-chu-de-tu.mts            # tất cả
 *   npx tsx scripts/ctlanguage-kiem-chu-de-tu.mts zh --mau   # một ngôn ngữ + in 3 từ mẫu mỗi chủ đề
 *   npx tsx scripts/ctlanguage-kiem-chu-de-tu.mts --khong-db
 */
import fs from 'node:fs';
import path from 'node:path';
import { NN_CDT, kiemDanhMuc, kiemTep, khoaKana, khoaPinyin, khoaTrung, type DanhMucChuDe, type TepChuDe } from '../src/services/ctlanguage/chuDeTuThuan.js';

const goc = path.join(process.cwd(), 'content', 'ctlanguage', 'chu-de-tu');
const doiSo = process.argv.slice(2);
const chiNn = doiSo.filter((x) => (NN_CDT as readonly string[]).includes(x));
const khongDb = doiSo.includes('--khong-db');
const inMau = doiSo.includes('--mau');
const anhCo = new Set(Object.keys(JSON.parse(fs.readFileSync(path.join(process.cwd(), 'scripts', 'hinh', 'fluent-catalog.json'), 'utf8')).hinh));
let hong = 0;
const dm = JSON.parse(fs.readFileSync(path.join(goc, '_chu-de.json'), 'utf8')) as DanhMucChuDe;
const loiDm = kiemDanhMuc(dm, anhCo);
if (loiDm.length) { hong++; console.error('✗ _chu-de.json:'); for (const l of loiDm) console.error(`    ${l}`); }
console.log(`Danh mục: ${dm.nhomLon.length} nhóm lớn · ${dm.chuDe.length} chủ đề`);

const theoNn: Record<string, TepChuDe[]> = {};
for (const nn of NN_CDT) {
  if (chiNn.length && !chiNn.includes(nn)) continue;
  theoNn[nn] = [];
  for (const c of dm.chuDe) {
    const f = path.join(goc, nn, `${c.ma}.json`);
    if (!fs.existsSync(f)) { hong++; console.error(`✗ ${nn}/${c.ma}.json: chưa có`); continue; }
    let t: TepChuDe;
    try { t = JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { hong++; console.error(`✗ ${nn}/${c.ma}.json: JSON hỏng — ${(e as Error).message}`); continue; }
    const loi = kiemTep(t, dm, anhCo);
    if (t.nn !== nn) loi.push(`nn "${t.nn}" khác thư mục`);
    if (t.ma !== c.ma) loi.push(`ma "${t.ma}" khác tên tệp`);
    if (loi.length) { hong++; console.error(`✗ ${nn}/${c.ma} — ${loi.length} lỗi:`); for (const l of loi.slice(0, 30)) console.error(`    ${l}`); continue; }
    theoNn[nn].push(t);
    if (inMau) console.log(`  ${nn}/${c.ma}: ${t.tu.length} — ${t.tu.filter((_, i) => i % Math.ceil(t.tu.length / 3) === 0).map((x) => `${x.chu} (${x.doc ?? ''}) ${x.nghia}`).join(' · ')}`);
  }
  const tu = theoNn[nn].flatMap((t) => t.tu);
  const pt = (n: number) => `${Math.round((100 * n) / Math.max(1, tu.length))}%`;
  const chung = new Map<string, number>();
  for (const t of theoNn[nn]) for (const x of t.tu) chung.set(khoaTrung(x.chu), (chung.get(khoaTrung(x.chu)) ?? 0) + 1);
  console.log(`${nn}: ${theoNn[nn].length} chủ đề · ${tu.length} từ (${chung.size} chữ khác nhau) · ví dụ ${pt(tu.filter((x) => x.viDu).length)} · ảnh ${pt(tu.filter((x) => x.anh).length)}`
    + ` · có cấp ${pt(tu.filter((x) => x.cap).length)} (ước lượng ${pt(tu.filter((x) => x.capUoc).length)}) · có loại từ ${pt(tu.filter((x) => x.loai).length)}`
    + ` · chữ nằm ≥ 3 chủ đề: ${[...chung.values()].filter((v) => v >= 3).length}`);
}

if (!khongDb) {
  try {
    await import('dotenv/config');
    const { prisma } = await import('../src/config/database.js');
    for (const [nn, ds] of Object.entries(theoNn)) {
      const tu = ds.flatMap((t) => t.tu);
      const chu = [...new Set(tu.map((t) => t.chu))];
      if (!chu.length) continue;
      const co = await prisma.ctlTu.findMany({ where: { nn, chu: { in: chu } }, select: { chu: true, doc: true } });
      const docTheoChu = new Map<string, string[]>();
      for (const m of co) { if (!docTheoChu.has(m.chu)) docTheoChu.set(m.chu, []); if (m.doc) docTheoChu.get(m.chu)!.push(m.doc); }
      let lech = 0; const mauLech: string[] = [];
      if (nn !== 'en') for (const t of tu) {
        const ds2 = docTheoChu.get(t.chu); if (!ds2?.length || !t.doc) continue;
        const k = nn === 'zh' ? khoaPinyin : khoaKana;
        if (/^[ぁ-ゖァ-ヺー・]+$/.test(t.chu)) continue;
        if (!ds2.some((d) => k(d) === k(t.doc!))) { lech++; if (mauLech.length < 10) mauLech.push(`${t.chu}=${t.doc} (từ điển: ${ds2.slice(0, 2).join('/')})`); }
      }
      console.log(`  ${nn}: ${docTheoChu.size}/${chu.length} chữ khớp mục từ điển ctl_tu (${Math.round((100 * docTheoChu.size) / chu.length)}%)`
        + (nn !== 'en' ? ` · cách đọc khác từ điển: ${lech}${mauLech.length ? ` — ${mauLech.join(', ')}` : ''}` : ''));
    }
    await prisma.$disconnect();
  } catch (e) {
    console.log(`  (bỏ qua kiểm từ điển — không nối được CSDL: ${(e as Error).message.split('\n')[0]})`);
  }
}
console.log(hong ? `\n${hong} chỗ LỖI` : '\nTất cả hợp lệ');
process.exit(hong ? 1 : 0);
