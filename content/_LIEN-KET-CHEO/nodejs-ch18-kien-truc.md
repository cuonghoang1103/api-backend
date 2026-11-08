# Liên kết chéo Node.js Chương 18 (Kiến trúc) ↔ Deploy lên VPS (+ khoá kiến trúc còn là KHUNG)

Đợt 12 video Node.js, 08/11/2026. Deep link: `/courses/<slug-khoá>/learn?lessonSlug=<slug-bài>`.
Khối `<a class="link-card lien-ket-cheo">` cuối `ml-en` và cuối `ml-vi`, HAI CHIỀU.
Các khoá kiến trúc đúng chủ đề (`software-architecture` 3.1 layered · 3.2 modular monolith · 2.3 ADR · 10.3 anti-pattern shared database · 11.4 nợ kỹ thuật;
`system-design`, `distributed-systems`) hiện mới là KHUNG (~1 nghìn ký tự/bài) ⇒ CHƯA gắn thẻ hai chiều; gắn khi soạn các khoá đó.
Số đo đọc mã nguồn website ở commit 9076fb918 (chỉ đọc, `git archive`), chỉ tệp mã, không tính *.test.ts; lời gọi hàm vs HTTP đo trên Node 22.23.3, trung vị 5.

| Node.js | Bài kia | Giống | Node.js thêm (đo thật) |
|---|---|---|---|
| `nodejs-18-5-quyet-dinh-kho-dao-nguoc` | `deploy-6-4-cua-mot-chieu` | cửa một chiều, quyết chậm | chú thích thật "Why no BullMQ?" (thiếu dòng "khi nào nghĩ lại") · CLAUDE.md 21 dòng lỗi đã gặp + 9 luật NEVER · 50/150 route bỏ tầng là nợ, file seed 6.113 dòng thì không |

Sửa bài web cùng đợt (s18, EN + VI): thêm callout "Đo lại cho video (08/11/2026)" sau mỗi đoạn "cuongthai.com làm thế nào" ở 18.1–18.6 (giữ số gốc của bài):
18.1 50/150 route gọi thẳng prisma (39 kèm service, 11 không), 382/705 service, 900 tệp 302.781 dòng, 4,8 : 1 · 18.2 phân bố 91/36/12/11, tệp lớn nhất 6.113 (seed), 33 thư mục con giữ 560/705 ·
18.3 work/permissions 143×, pro.service 39 import / 0 phụ thuộc, 28 cặp vòng, 608 model, 243 migration, prisma.user 57 chỗ · 18.4 hàm 2,0 ns vs HTTP 0,072 / 0,177 ms, cron 40 lịch ·
18.5 chú thích BullMQ thật + CLAUDE.md 21/9 · 18.6 số tổng + AsyncLocalStorage nay ở 4 tệp CT Work, vẫn không /metrics, OTel, stop_grace_period; ân hạn Docker mặc định 3,14 s.
