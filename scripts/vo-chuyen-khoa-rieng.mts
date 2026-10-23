#!/usr/bin/env -S npx tsx
/**
 * Chuyển tệp nét + ảnh xem trước Vở từ khoá CŨ (đoán được, `notes/u<id>/ink/<trang>/v<n>.png`)
 * sang khoá mới có chuỗi ngẫu nhiên, rồi xoá tệp cũ (23/10/2026).
 *
 *   npx tsx scripts/vo-chuyen-khoa-rieng.mts                    # CHẠY THỬ: chỉ đếm, không ghi gì
 *   npx tsx scripts/vo-chuyen-khoa-rieng.mts --ghi              # chạy thật
 *   npx tsx scripts/vo-chuyen-khoa-rieng.mts --ghi --gioi-han 50 --nguoi 12
 *
 * ⚠️ Chạy thật trên production CHỈ khi chủ web đồng ý (nó chép + xoá tệp trên bucket thật). Tuần tự từng trang;
 * mỗi trang đổi con trỏ có điều kiện nên chạy lại / chạy song song với app đang đẩy vẫn an toàn.
 * Chỉ đổi KHOÁ — tệp CŨ đã nằm trên CDN công khai thì chỉ hết truy cập được sau khi bị xoá ở đây
 * (hoặc khi chặn tiền tố ở Cloudflare — xem báo cáo/CLAUDE.md).
 */
import { prisma } from '../src/config/database.js';
import { chuyenKhoaRieng, laKhoaNetCu } from '../src/services/voInk.service.js';

const args = process.argv.slice(2);
const ghi = args.includes('--ghi');
const so = (ten: string) => { const i = args.indexOf(ten); return i >= 0 ? Number(args[i + 1]) : undefined; };
const gioiHan = so('--gioi-han');
const nguoi = so('--nguoi');

const ds = await prisma.note.findMany({
  where: {
    clientId: { not: null },
    OR: [{ inkKey: { not: null } }, { inkPreviewKey: { not: null } }],
    ...(nguoi ? { userId: nguoi } : {}),
  },
  select: { id: true, userId: true, inkKey: true, inkPreviewKey: true, inkVersion: true },
  orderBy: { id: 'asc' },
});
const can = ds.filter((t) => laKhoaNetCu(t.inkKey) || laKhoaNetCu(t.inkPreviewKey)).slice(0, gioiHan ?? Infinity);
console.log(`${ghi ? 'CHẠY THẬT' : 'CHẠY THỬ'} · ${ds.length} trang có nét · ${can.length} trang còn khoá cũ cần chuyển`);

const dem: Record<string, number> = {};
let soXoa = 0;
for (const [i, t] of can.entries()) {
  try {
    const kq = await chuyenKhoaRieng(t, ghi);
    dem[kq.trangThai] = (dem[kq.trangThai] ?? 0) + 1;
    soXoa += kq.xoa.length;
  } catch (e) {
    dem.loi = (dem.loi ?? 0) + 1;
    console.error(`  trang ${t.id}: ${String(e)}`);
  }
  if (ghi && (i + 1) % 50 === 0) console.log(`  … ${i + 1}/${can.length}`);
}
console.log('Kết quả:', dem, ghi ? `· đã xoá ${soXoa} tệp cũ` : '· (thêm --ghi để chạy thật)');
await prisma.$disconnect();
