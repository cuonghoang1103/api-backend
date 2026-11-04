/**
 * Networking for Developers — Chương 8: CDN và cache (soạn trọn 04/11/2026). Slug bài của khung giữ nguyên
 * (netdev-8-1 … netdev-8-4); thêm lab chương netdev-8-5 và quiz netdev-8-6. GIỮ NGUYÊN title chương (seeder neo bằng nó).
 * Lab: CDN thu nhỏ (lab/code/ch08/cdn.conf) — biên nginx (:8080) cache từ origin (:8081), biên hỏng (:8082) nuốt header,
 * đường chậm (/cham/, timeout 1s ⇒ 504) và trần thân 1MB (⇒ 413). Output thật: bash lab/code/dung-output-ch8.sh.
 */
import b81 from './bai/080-cdn.mjs';
import b82 from './bai/081-cache-dung.mjs';
import b83 from './bai/082-nginx-nuot-header.mjs';
import b84 from './bai/083-gioi-han-cdn.mjs';
import lab8 from './bai/084-lab8.mjs';
import q8 from './bai/085-quiz-ch8.mjs';

export default {
  title: 'Chapter 8 — CDN and caching|||Chương 8 — CDN và cache',
  description: 'Học xong chương: giải thích một CDN (edge/origin/PoP, Anycast) và đọc trạng thái cache (HIT/MISS/EXPIRED) thẳng từ header; cache cho đúng (khoá cache gồm cả query ⇒ ?v=1 ≠ ?v=2, tên tệp bất biến có mã băm, TTL + stale-while-revalidate, purge, bẫy cookie); gỡ cuộc tranh tầng khi proxy ghi đè Cache-Control (sự cố thật cuongthai — nginx dán no-store nuốt cache Next.js, kiểm bằng curl -I ở mỗi chặng); và tôn trọng giới hạn của biên (timeout ~100s ⇒ 524/504, trần thân ⇒ 413) bằng cách đưa việc dài (202 + chạy nền + hỏi lại) và upload lớn (presigned URL thẳng R2) đi VÒNG qua biên — đo trên một CDN thu nhỏ bằng nginx; kèm lab chương kiểm toán tầng CDN của LabFlow.',
  lessons: [b81, b82, b83, b84, lab8, q8],
};
