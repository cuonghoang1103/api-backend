#!/usr/bin/env node
/**
 * Gán khoá học vào CHƯƠNG TRÌNH ĐÀO TẠO của /courses (15 kỳ × 5 khoá) từ `scripts/chuong-trinh-15-ky.json`.
 *
 *   node scripts/gan-chuong-trinh-khoa-hoc.mjs            # CHẠY THỬ (mặc định) — chỉ in, không ghi gì
 *   node scripts/gan-chuong-trinh-khoa-hoc.mjs --ghi      # ghi thật vào CSDL ở DATABASE_URL
 *   node scripts/gan-chuong-trinh-khoa-hoc.mjs --file khac.json
 *
 * Trên production (sau khi `prisma migrate deploy` đã thêm cột lo_trinh_ky / lo_trinh_thu_tu):
 *   docker exec -it cuonghoangdev_backend node scripts/gan-chuong-trinh-khoa-hoc.mjs          # xem trước
 *   docker exec -it cuonghoangdev_backend node scripts/gan-chuong-trinh-khoa-hoc.mjs --ghi
 *
 * Idempotent: khoá đã đúng kỳ/thứ tự thì không ghi lại. Khoá theo SLUG.
 * Báo: slug không có trong CSDL, khoá Academy (có semester_id — trang /courses không hiện), khoá chưa xuất bản,
 * và khoá đang có kỳ trong CSDL nhưng KHÔNG có trong JSON (GIỮ NGUYÊN — có thể admin vừa gán tay; muốn gỡ thì
 * gỡ ở trang admin).
 */
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const SO_KY = 15;

/** Kiểm khung JSON. Trả danh sách lỗi (rỗng = hợp lệ). */
export function kiemKhung(khung) {
  const loi = [];
  if (!Array.isArray(khung)) return ['JSON phải là một mảng các kỳ'];
  const daThayKy = new Set();
  const daThaySlug = new Map();
  for (const k of khung) {
    if (!Number.isInteger(k?.ky) || k.ky < 1 || k.ky > SO_KY) { loi.push(`kỳ không hợp lệ: ${JSON.stringify(k?.ky)}`); continue; }
    if (daThayKy.has(k.ky)) loi.push(`kỳ ${k.ky} lặp lại`);
    daThayKy.add(k.ky);
    if (!Array.isArray(k.mon) || k.mon.length === 0) { loi.push(`kỳ ${k.ky} không có khoá nào`); continue; }
    const daThayThuTu = new Set();
    for (const m of k.mon) {
      if (typeof m?.slug !== 'string' || !m.slug) loi.push(`kỳ ${k.ky}: thiếu slug`);
      if (!Number.isInteger(m?.thuTu) || m.thuTu < 1 || m.thuTu > 99) loi.push(`kỳ ${k.ky}: thuTu sai ở ${m?.slug}`);
      if (daThayThuTu.has(m?.thuTu)) loi.push(`kỳ ${k.ky}: thuTu ${m?.thuTu} lặp`);
      daThayThuTu.add(m?.thuTu);
      if (daThaySlug.has(m?.slug)) loi.push(`slug "${m.slug}" có ở cả kỳ ${daThaySlug.get(m.slug)} và kỳ ${k.ky}`);
      daThaySlug.set(m?.slug, k.ky);
    }
  }
  return loi;
}

/**
 * Lõi của script — nhận một PrismaClient (hoặc thứ có cùng `course.findMany/update`) để test được không cần CSDL.
 * @returns {Promise<{ ghi: number, khongDoi: number, khongCo: string[], academy: string[], chuaXuatBan: string[], ngoaiJson: string[] }>}
 */
export async function ganChuongTrinh(prisma, khung, { apply = false, log = console.log } = {}) {
  const loi = kiemKhung(khung);
  if (loi.length) throw new Error(`JSON chương trình sai:\n  - ${loi.join('\n  - ')}`);

  const muonGan = new Map(); // slug → { ky, thuTu }
  for (const k of khung) for (const m of k.mon) muonGan.set(m.slug, { ky: k.ky, thuTu: m.thuTu });

  const coSan = await prisma.course.findMany({
    where: { OR: [{ slug: { in: [...muonGan.keys()] } }, { loTrinhKy: { not: null } }] },
    select: { id: true, slug: true, title: true, isPublished: true, semesterId: true, loTrinhKy: true, loTrinhThuTu: true },
  });
  const theoSlug = new Map(coSan.map((c) => [c.slug, c]));

  const kq = { ghi: 0, khongDoi: 0, khongCo: [], academy: [], chuaXuatBan: [], ngoaiJson: [] };
  for (const [slug, { ky, thuTu }] of muonGan) {
    const c = theoSlug.get(slug);
    if (!c) { kq.khongCo.push(slug); continue; }
    if (c.semesterId != null) kq.academy.push(slug);
    if (!c.isPublished) kq.chuaXuatBan.push(slug);
    if (c.loTrinhKy === ky && c.loTrinhThuTu === thuTu) { kq.khongDoi++; continue; }
    log(`${apply ? 'GHI ' : 'THỬ '} kỳ ${String(ky).padStart(2)} · #${thuTu}  ${slug}` +
      (c.loTrinhKy != null ? `  (trước: kỳ ${c.loTrinhKy} · #${c.loTrinhThuTu ?? '—'})` : ''));
    if (apply) await prisma.course.update({ where: { id: c.id }, data: { loTrinhKy: ky, loTrinhThuTu: thuTu } });
    kq.ghi++;
  }
  for (const c of coSan) {
    if (c.loTrinhKy != null && !muonGan.has(c.slug)) kq.ngoaiJson.push(`${c.slug} (kỳ ${c.loTrinhKy})`);
  }
  return kq;
}

async function main() {
  const args = process.argv.slice(2);
  const apply = args.includes('--ghi');
  const iFile = args.indexOf('--file');
  const goc = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  const file = iFile >= 0 ? path.resolve(args[iFile + 1]) : path.join(goc, 'scripts/chuong-trinh-15-ky.json');
  const khung = JSON.parse(readFileSync(file, 'utf8'));

  try { (await import('dotenv')).config({ path: path.join(goc, '.env') }); } catch { /* trong container env đã có sẵn */ }
  const { PrismaClient } = await import('@prisma/client');
  const prisma = new PrismaClient();
  try {
    const host = (() => { try { return new URL(process.env.DATABASE_URL).host; } catch { return '?'; } })();
    console.log(`${apply ? '⚠️  GHI THẬT' : 'Chạy thử (thêm --ghi để ghi)'} · CSDL ${host} · ${path.relative(goc, file)}`);
    const kq = await ganChuongTrinh(prisma, khung, { apply });
    console.log(`\n${apply ? 'Đã ghi' : 'Sẽ ghi'}: ${kq.ghi} · đã đúng sẵn: ${kq.khongDoi}`);
    if (kq.khongCo.length) console.log(`❌ Slug KHÔNG có trong CSDL (${kq.khongCo.length}): ${kq.khongCo.join(', ')}`);
    if (kq.academy.length) console.log(`⚠️  Khoá Academy — /courses không hiện (${kq.academy.length}): ${kq.academy.join(', ')}`);
    if (kq.chuaXuatBan.length) console.log(`⚠️  Chưa xuất bản — chưa hiện (${kq.chuaXuatBan.length}): ${kq.chuaXuatBan.join(', ')}`);
    if (kq.ngoaiJson.length) console.log(`ℹ️  Có kỳ trong CSDL nhưng không có trong JSON — giữ nguyên (${kq.ngoaiJson.length}): ${kq.ngoaiJson.join(', ')}`);
    process.exitCode = kq.khongCo.length ? 2 : 0;
  } finally {
    await prisma.$disconnect();
  }
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  main().catch((e) => { console.error(e.message || e); process.exit(1); });
}
