/**
 * Kiểm SỔ TAY CHUYÊN NGÀNH CT Language (`content/ctlanguage/so-chuyen-nganh/<nn>/<ma>.json`): khuôn từng từ (ja: kana ·
 * zh: pinyin có dấu thanh · en: IPA /…/ hoặc trống), 60–150 từ/bộ, không trùng trong bộ, ≥ 60% có câu ví dụ, mỗi ngôn
 * ngữ ≥ 8 bộ, `ma` khớp tên tệp. Có CSDL (DATABASE_URL) ⇒ báo thêm bao nhiêu từ khớp mục `ctl_tu` (máy chủ gắn id lúc
 * phục vụ — tệp KHÔNG ghi id vì id từ điển đổi mỗi lần nhập lại).
 *
 *   npx tsx scripts/ctlanguage-kiem-so-chuyen-nganh.mts          # tất cả
 *   npx tsx scripts/ctlanguage-kiem-so-chuyen-nganh.mts ja       # một ngôn ngữ
 *   npx tsx scripts/ctlanguage-kiem-so-chuyen-nganh.mts --khong-db
 */
import fs from 'node:fs';
import path from 'node:path';
import { NN_SCN, kiemBo, type BoChuyenNganh } from '../src/services/ctlanguage/soChuyenNganhThuan.js';

const goc = path.join(process.cwd(), 'content', 'ctlanguage', 'so-chuyen-nganh');
const doiSo = process.argv.slice(2);
const chiNn = doiSo.filter((x) => (NN_SCN as readonly string[]).includes(x));
const khongDb = doiSo.includes('--khong-db');
let hong = 0;
const theoNn: Record<string, BoChuyenNganh[]> = {};

for (const nn of NN_SCN) {
  if (chiNn.length && !chiNn.includes(nn)) continue;
  let tep: string[] = [];
  try { tep = fs.readdirSync(path.join(goc, nn)).filter((f) => f.endsWith('.json')).sort(); } catch { /* chưa có */ }
  theoNn[nn] = [];
  for (const f of tep) {
    const ten = `${nn}/${f}`;
    let b: BoChuyenNganh;
    try { b = JSON.parse(fs.readFileSync(path.join(goc, nn, f), 'utf8')); }
    catch (e) { console.error(`✗ ${ten}: JSON hỏng — ${(e as Error).message}`); hong++; continue; }
    const loi = kiemBo(b);
    if (b.nn !== nn) loi.push(`nn "${b.nn}" khác thư mục "${nn}"`);
    if (b.ma !== f.replace(/\.json$/, '')) loi.push(`ma "${b.ma}" khác tên tệp`);
    if (loi.length) { hong++; console.error(`✗ ${ten} — ${loi.length} lỗi:`); for (const l of loi.slice(0, 60)) console.error(`    ${l}`); continue; }
    theoNn[nn].push(b);
    console.log(`✓ ${ten} — ${b.ten} · ${b.tu.length} từ · ${b.tu.filter((t) => t.viDu).length} ví dụ`);
  }
  if (theoNn[nn].length < 8) { hong++; console.error(`✗ ${nn}: mới ${theoNn[nn].length} bộ — cần ≥ 8`); }
}

// Độ phủ từ điển (không bắt buộc): bao nhiêu từ khớp chữ một mục ctl_tu.
if (!khongDb) {
  try {
    await import('dotenv/config');
    const { prisma } = await import('../src/config/database.js');
    for (const [nn, ds] of Object.entries(theoNn)) {
      const chu = [...new Set(ds.flatMap((b) => b.tu.map((t) => t.chu)))];
      if (!chu.length) continue;
      const co = await prisma.ctlTu.findMany({ where: { nn, chu: { in: chu } }, select: { chu: true }, distinct: ['chu'] });
      const coSet = new Set(co.map((x) => x.chu));
      console.log(`  ${nn}: ${co.length}/${chu.length} từ khớp mục từ điển ctl_tu (${Math.round((100 * co.length) / chu.length)}%)`
        + (chu.length - co.length ? ` · không khớp (id âm): ${chu.filter((c) => !coSet.has(c)).slice(0, 12).join(', ')}${chu.length - co.length > 12 ? '…' : ''}` : ''));
    }
    await prisma.$disconnect();
  } catch (e) {
    console.log(`  (bỏ qua kiểm từ điển — không nối được CSDL: ${(e as Error).message.split('\n')[0]})`);
  }
}

const tong = Object.values(theoNn).flat();
console.log(`\n${tong.length} bộ · ${tong.reduce((s, b) => s + b.tu.length, 0)} từ · `
  + Object.entries(theoNn).map(([nn, ds]) => `${nn} ${ds.length} bộ/${ds.reduce((s, b) => s + b.tu.length, 0)} từ`).join(' · ')
  + ` · ${hong ? `${hong} chỗ LỖI` : 'tất cả hợp lệ'}`);
process.exit(hong ? 1 : 0);
