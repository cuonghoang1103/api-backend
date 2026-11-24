# Gắn video YouTube cho IELTS Tập 2–5 và khoá Tiếng Anh giao tiếp — hướng dẫn agent (24/11/2026)

User tạm thời chưa có máy làm video riêng: "lên YouTube kiếm video chuẩn IELTS, kiến thức đúng và chi tiết, nhúng vào tạm để học".
Người học thật: sinh viên IT Việt Nam, đích IELTS Academic 8.0 + giao tiếp đi làm. CHẤT LƯỢNG + ĐÚNG BÀI trên hết: một video sai
kiến thức hoặc lạc đề còn tệ hơn không có video.

## Định dạng — tệp `videos.ts` của từng khoá
Theo đúng mẫu đã dùng ở Tập 1: `frontend/src/app/language/[code]/ielts/videos.ts` (đọc 40 dòng đầu để thấy định dạng):
```ts
export const VIDEO_BAI_T3: Record<string, LessonVideo[]> = {
  't3d1-ngu-phap': [
    {"id":"<11 ký tự>","credit":"<Kênh> — <Tiêu đề THẬT>","dur":"m:ss","lang":"en","note":"<cách xem, tiếng Việt>"},
  ],
};
```
- Khoá của map = **id bài THẬT**. Lấy id từ `ngay/manifest.ts` của khoá đó: id bài, tiêu đề, mục tiêu. Muốn biết bài dạy cụ thể gì thì
  `grep -n "t: 'h'"` hoặc tiêu đề khối trong `ngayN.ts`. KHÔNG đọc trọn tệp ngày (mỗi tệp ~100 KB).
- `credit` = `author_name — title` đúng như `yt-check` in ra; `dur` lấy đúng thời lượng; `lang` là `en` hoặc `vi`.
- `note` (tiếng Việt, 1–2 câu): video giúp phần nào của bài, xem thế nào (dừng lại tự làm, bật phụ đề, xem đoạn mm:ss–mm:ss).

## Chọn video
- Mỗi bài `grammar` / `vocab` / `reading` / `writing` / `listening` / `speaking` (và `intro`): **1–2 video**. Bài `homework` và `review`
  KHÔNG gắn. Chỉ gắn khi video KHỚP nội dung bài (đúng dạng câu, đúng điểm ngữ pháp, đúng dạng Task); không có video khớp thì
  để trống bài đó, không gắn video chung chung cho có.
- **Đúng trình độ:**
  - Tập 2: band 4–5, ưu tiên video dễ, có thể thêm 1 video tiếng Việt giảng lại.
  - Tập 3: band 5–6.
  - Tập 4: band 6–7.
  - Tập 5: band 7–8+ (video phân tích band 8–9, bài mẫu band cao).
  - Giao tiếp: video hội thoại / cụm câu tự nhiên (BBC Learning English, English with Lucy, Rachel's English, mmmEnglish,
    Speak English With Vanessa, engVid, Linguamarina, VOA Learning English…).
- **Kênh tin cậy cho IELTS:** TakeIELTS Official, IELTS Official, British Council, IELTS Liz, IELTS Simon, E2 IELTS, IELTS Advantage,
  Keith O'Hare (IELTS Speaking Success), IELTS Ryan, Fastrack IELTS, BBC Learning English, engVid, Cambridge English. Kênh Việt có uy tín
  dùng được (IELTS Fighter, The Forum…) nhưng tiếng Anh ưu tiên hơn. Tránh video giật tít "band 9 trong 7 ngày", mẹo sai, quảng cáo
  khoá học là chính, video lẫn quy định thi cũ đã đổi (vd quy định chấm/format cũ trước 2020 với nội dung đã sai).
- Thời lượng nên 3–25 phút; bài giảng dài tới 40 phút được nếu thật sự đúng bài (ghi trong note nên xem đoạn nào).
- **Không trùng:** grep `"id":"<id>"` trong `ielts/videos.ts`, `ielts/tap-*/videos.ts`, `giao-tiep/videos.ts` — một video đã gắn ở khoá
  khác cho CÙNG nội dung thì chọn video khác (được dùng lại nếu bài sau là ôn lại có chủ đích, ghi rõ "ôn lại" trong note).

## Công cụ (BẮT BUỘC — ID YouTube không nhớ được, mọi ID phải đến từ công cụ)
Chạy ở gốc repo `/Users/admin/Downloads/api-backend`:
- Tìm: `node scripts/yt-search.mjs "ielts writing task 1 line graph band 8" --n 10` ⇒ in id · thời lượng · lượt xem · kênh · tiêu đề.
- Kiểm nhúng được + tên thật: `node scripts/yt-check.mjs <id> <id> …` ⇒ chỉ ghi id báo OK.
- Xem mô tả khi chưa chắc nội dung: `node scripts/yt-desc.mjs <id>`.
Gọi tìm kiếm vừa phải (một truy vấn tốt cho mỗi bài, gộp kiểm nhiều id một lần).

## Xong
- Ghi tệp `videos.ts` của khoá được giao (KHÔNG sửa data.ts/index.ts — phiên chính nối).
- `cd frontend && npx tsc --noEmit -p tsconfig.json` có thể nặng; tối thiểu chạy
  `node --experimental-strip-types --no-warnings -e "import('./src/app/language/[code]/…/videos.ts').then(m=>console.log(Object.keys(Object.values(m)[0]).length))"`
  để chắc tệp nạp được, và `node scripts/yt-check.mjs --stdin` với mọi id trong tệp ⇒ 0 lỗi.
- Báo lại (tiếng Việt, ≤ 150 từ): bao nhiêu bài có video / tổng bài gắn được, số video, kênh chính, bài nào để trống vì không có video khớp.
