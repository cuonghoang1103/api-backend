#!/usr/bin/env npx tsx
/* eslint-disable no-console */
/**
 * Chạy tay "Học mỗi ngày" (local/dev). Trên prod dùng tuyến admin
 * /api/v1/admin/feed-hoc (ảnh Docker không có tsx).
 *
 *   STORAGE_SANDBOX=1 npx tsx scripts/feed-hoc-dang.ts --thong-ke
 *   STORAGE_SANDBOX=1 npx tsx scripts/feed-hoc-dang.ts --xem            # bài kế tiếp sẽ chọn
 *   STORAGE_SANDBOX=1 npx tsx scripts/feed-hoc-dang.ts --dang 3         # đăng 3 bài kế tiếp
 *   STORAGE_SANDBOX=1 npx tsx scripts/feed-hoc-dang.ts --id <id-bai>    # đăng đúng một bài
 *   STORAGE_SANDBOX=1 npx tsx scripts/feed-hoc-dang.ts --an-mau-cu      # đếm bài bot mẫu cũ sẽ ẩn
 *   STORAGE_SANDBOX=1 npx tsx scripts/feed-hoc-dang.ts --an-mau-cu --xac-nhan
 *
 * Luôn chạy với STORAGE_SANDBOX=1 ở máy local: .env mang khoá R2 THẬT.
 */
import { prisma } from '../src/config/database.js';
import { getCuongMiniBotUser } from '../src/services/techTrends/cuongMiniBot.js';
import { anBaiMauCu, dangBai, dangBaiKeTiep, thongKeBaiBot } from '../src/services/techTrends/hocFeed/dangBaiHoc.js';
import { THU_VIEN } from '../src/services/techTrends/hocFeed/thuVien.js';

const a = process.argv.slice(2);
const co = (f: string) => a.includes(f);
const sau = (f: string) => a[a.indexOf(f) + 1];

if (process.env.NODE_ENV !== 'production' && process.env.STORAGE_SANDBOX !== '1') {
  console.error('Đặt STORAGE_SANDBOX=1 để ảnh không lên bucket R2 thật.');
  process.exit(2);
}

try {
  if (co('--thong-ke')) console.log(JSON.stringify(await thongKeBaiBot(), null, 2));
  if (co('--xem')) console.log(await dangBaiKeTiep({ xemTruoc: true }));
  if (co('--dang')) {
    const n = Math.max(1, Math.min(30, Number(sau('--dang')) || 1));
    for (let i = 0; i < n; i++) console.log(await dangBaiKeTiep({ luot: i }));
  }
  if (co('--id')) {
    const bai = THU_VIEN.find((b) => b.id === sau('--id'));
    if (!bai) throw new Error(`không có bài ${sau('--id')}`);
    const bot = await getCuongMiniBotUser();
    console.log({ postId: await dangBai(bai, bot.id), id: bai.id });
  }
  if (co('--an-mau-cu')) console.log(await anBaiMauCu({ thuThoi: !co('--xac-nhan') }));
} finally {
  await prisma.$disconnect();
}
