/**
 * Móc phân giải module cho các script Node chạy THẲNG mã TypeScript của trang
 * (`node --experimental-strip-types --import ./scripts/lib/nap-ts-alias.mjs …`).
 *
 * Mã trang viết cho webpack: import bằng alias `@/…` và KHÔNG ghi đuôi tệp
 * (`import('./bai0')`, `from './bai'` = thư mục có index.ts). Node thuần không
 * hiểu hai thứ đó. Móc này dạy Node đúng hai luật ấy — không gì hơn — để script
 * gọi được nguyên văn code của web (data.ts, bộ nạp loadBai…) thay vì chép lại
 * luật ghép bài. Dùng ở `sach-hoc-xuat.mts`.
 *
 * Không cần thêm `tsx` vào image frontend (Dockerfile chỉ có node:22).
 */
import { register } from 'node:module';

register(new URL(import.meta.url).href.replace(/nap-ts-alias\.mjs$/, 'nap-ts-alias-moc.mjs'), import.meta.url);
