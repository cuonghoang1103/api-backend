# Soạn bài khoá IELTS (`/language/en/ielts`) — quy tắc bắt buộc

Khoá đi theo giáo trình **"IELTS 4 kỹ năng cho người bắt đầu từ con số âm – Tập 1"**
(Smart English, 15 Day, đáp án từ trang 287). Người học chụp sách vào thư mục
iCloud `~/Ielts` (ảnh HEIC, hay bị xoay ngang) để soạn từng đợt.

## 1. Nội dung: ĐỦ như sách, TỐT hơn sách, KHÔNG chép sách

- **Không được thiếu** bất kỳ điểm kiến thức, bảng, từ vựng, cụm động từ, họ từ,
  dạng bài, số câu bài tập, mẹo "Watch out" nào có trong sách. Người học dùng
  khoá này để thi lấy bằng — thiếu một điểm là thủng một chỗ.
- **Không chép nguyên văn**: sách có bản quyền, trang này công khai. Giữ đúng
  KIẾN THỨC, THỨ TỰ, DẠNG BÀI, SỐ CÂU; lời giảng, câu ví dụ, bài đọc, kịch bản
  nghe, câu bài tập **viết mới**. Danh sách từ vựng/ngữ pháp là kiến thức chung —
  giữ đủ từ, nhưng câu ví dụ tự đặt.
- **Chỉ bổ sung**: giảng sâu hơn, sửa chỗ sách giảng chưa đúng, thêm lỗi người
  Việt hay mắc, thêm mẹo làm bài thi. Đánh dấu phần thêm bằng câu dẫn kiểu
  "Phần này sách chưa có…".
- **Đáp án**: mọi bài tập có đáp án (đối chiếu phần Đáp án cuối sách khi có
  ảnh). Câu dịch chấp nhận nhiều cách viết đúng (`answers: [...]`).
- Giọng văn: tiếng Việt dễ hiểu cho người **mất gốc**, câu ngắn, giải nghĩa
  mọi thuật ngữ tiếng Anh lần đầu xuất hiện.

## 2. Cấu trúc dữ liệu

- Mỗi ngày một tệp `ngay/ngayN.ts` export `NGAY_N: Lesson[]` (3 bài như mục
  lục sách + 1 bài `homework` nếu sách có Homework). Đăng ký trong `data.ts`
  (`WRITTEN`).
- id bài: `dN-<slug>`; id bài tập (`quiz`/`mcq`/`dictation`/`essay`/`speak`/
  `listen`): `dN-<slug>` **duy nhất toàn khoá** — tiến độ & điểm lưu theo id.
  Đổi id là mất điểm cũ của người học.
- Các khối (`Block` trong `data.ts`):
  - Lý thuyết: `h` (tiêu đề mục — bài `grammar` tự ĐÓNG KHUNG theo mỗi `h`),
    `p` (`**đậm**`, `==dạ quang==`, `~~câu sai~~`), `patterns` (công thức — ký
    hiệu S/V/O/C/A/do tự tô màu), `table`, `note` (tiêu đề chứa "sai/nhầm/cẩn
    thận" → ⚠️ Watch out; "mẹo/cách học" → 💡; còn lại → 📌 Ghi nhớ),
    `examples`, `vocab` (w, pos, ipa, vi, ex, exVi — từ tự tô dạ quang trong
    `ex`), `alphabet`.
  - Nâng cấp dễ nhìn (29/09/2026) — BẮT BUỘC cho ngày mới:
    - `recap` (items, title?) — khối **đầu tiên** của mỗi bài: 3–6 ý "bài này học gì / cần nhớ gì".
    - `rule` (formula, vi?) — "Công thức 1 dòng", đặt **cuối mỗi điểm ngữ pháp** (trước `h` kế tiếp);
      bài kỹ năng dùng cho khung câu mẫu quan trọng.
    - Mỗi điểm ngữ pháp có **bài dịch Việt→Anh 3–5 câu** (`quiz` kind `translate`, `grammar` +
      `hint` cho nút 💡) đặt ngay sau `rule`; id dạng `dN-<muc>-dich`.
    - `vocab` item có thể thêm `more` (collocation / họ từ / lỗi hay sai). Khối `vocab` tự có nút
      "Che nghĩa / Che từ" để tự kiểm — không phải khai gì.
    - Ký hiệu tô màu trong `formula` (patterns, rule, ô bảng bắt đầu bằng S/V/N/Do…): `S V O C A N adj adv
      Wh- V-ing V-ed V3 V(s/es) to V`, trợ động từ `do/does/did/don't…`, `am/is/are/was/were/be`, `not`,
      `will`, `have/has`. "am / is / are" cùng vai tự gộp một ô; chữ Việt trong công thức hiện font thường.
    - KHÔNG dùng `*nghiêng*` (một dấu sao) — bộ khung không hiểu, hiện nguyên dấu sao. Dùng `**đậm**`.
    - Bảng ≥ 3 cột chữ dài tự xếp thành thẻ trên điện thoại (nhãn cột lấy từ `head`) — `head` phải ngắn, rõ.
  - Bài tập: `quiz` (`fill` | `translate` — `translate` có `hint` = từ cần dùng
    và `grammar` = cấu trúc, hiện trong nút 💡 Gợi ý), `mcq` (có `why`),
    `dictation` (đánh vần).
  - Kỹ năng (Blocks2.tsx): `passage` (bài đọc, đoạn có nhãn A/B/C), `listen`
    (kịch bản nghe — `voice`: uk-nu | uk-nam | us-nu | us-nam; máy chủ sinh mp3
    WaveNet), `dialogue` (nhân vật: examiner | candidate | a | b | c), `essay`
    (ô viết + AI chấm 4 tiêu chí), `chart` (line/bar cho Writing Task 1),
    `speak` (ghi âm + AI chấm).
- **Bài nghe**: sách dùng file audio có bản quyền → viết KỊCH BẢN MỚI cùng dạng,
  cùng độ khó, cùng số câu hỏi, rồi để khối `listen` đọc. Câu hỏi đặt ngay sau
  khối `listen` bằng `quiz`/`mcq`.
- `goal` mỗi bài một câu "học xong làm được gì"; `minutes` ước lượng thật.

## 3. Mục tra cứu cả khoá (`tracuu.ts`, 29/09/2026)

- `?bai=tra-cong-thuc` — mọi công thức + khung câu Nói/Viết, gom theo điểm ngữ pháp, ghi ngày học chi
  tiết. **Soạn ngày có ngữ pháp mới → thêm một mục `h` + `patterns`/`table` + `rule` vào đây.**
- `?bai=tra-tu-vung` — khối `vocabAll`: toàn bộ từ vựng lấy từ mục lục (manifest) — tự cập nhật,
  tìm Anh/Việt (không dấu), lọc theo ngày, che nghĩa/che từ, thẻ nhớ Anh→Việt / Việt→Anh.

## 4. Kiểm trước khi deploy

1. `(cd frontend && npx tsc --noEmit)`.
2. Chạy dev (`NEXT_DIST_DIR=.next-xxx`) và mở `?buoi=N` + từng `?bai=…`, chụp
   ở 1440 / iPad 820 / iPhone 390; không cuộn ngang, không lỗi console.
3. Đếm lại với bản trích sách: số từ, số câu từng bài tập khớp.
4. Commit chỉ các tệp của mình (pathspec), `deploy-nha.sh` (tự push).

## 5. Tiến độ soạn

| Day | Trạng thái |
|---|---|
| 1 | ✅ đủ (trang 8–19) |
| 2–4 | ✅ đủ (trang 20–75, soạn 27/09/2026; sách không in đáp án Day 2–4 → đáp án tự soạn & kiểm) |
| 5 | ✅ trang 75–90 (28/09): danh từ đếm/không đếm được, Remote Work, Dictation 2, homework 12+10 |
| 6 | ✅ trang 91–110 (28/09): Flow-chart Completion, Opinion intro 5 bước, Speaking Wh- (Daily Routine 6 câu, Family 2), 8 nguyên âm đôi, homework 6 chỗ trống |
| 1–6 | 🔎 rà soát lại toàn bộ với ảnh 29/09/2026: đủ từ/câu như sách; thêm recap, rule, bài dịch 💡 từng điểm ngữ pháp, `more` cho từ vựng; Ngày 6 bài đọc sửa cho đáp án khớp Answer Explanation (firm · simplicity · full version · feedback) |
| 7–15 | chờ ảnh (ảnh mới bắt đầu từ trang 111) |

## Trọn gói mỗi Ngày mới (từ 03/10/2026)

Soạn xong nội dung theo sách thì CHƯA xong ngày đó. Đủ khi có cả:

1. **Video bài giảng** cho mỗi bài trong `videos.ts` — tìm theo
   `reference_tim_video_youtube_cho_bai_hoc` (agent xuất TSV, ghép bằng script, bắt
   trùng ID với các ngày cũ; mỗi ID qua oEmbed + `playabilityStatus` OK).
2. **Khối `phatam`** (luyện phát âm, Azure chấm từng âm) — chọn âm theo chủ đề ngày
   đó; `ipa` Anh-Anh, mỗi từ một cụm cách nhau dấu cách, KHÔNG dấu nhấn ˈ.
   Đặt dưới tiêu đề "Thêm: …" nếu sách không có phần phát âm.
3. **Tự bổ sung** chỗ sách sơ sài / sắp xếp chưa hợp lý (user cho phép 03/10) — vẫn
   giữ đủ nội dung sách, chỉ thêm; ghi lại đã thêm gì khi báo cáo.
4. **Bài kiểm tra chặng**: cuối mỗi chặng (hiện có `d6-kiem-tra` — Ngày 1–6) thêm một
   bài `kind: 'review'` gom ngữ pháp · từ vựng · dịch · nghe · đọc · viết · nói · phát âm,
   ngưỡng đạt ≥70% từng phần, chỉ rõ Ngày cần ôn. Dự kiến: giữa khoá (~Ngày 10/11, xem
   sách có ngày ôn tập không), thi cuối khoá (Ngày 15, dạng đề IELTS đủ 4 kỹ năng).
   Viết THẲNG trong `ngayN.ts` — script mục lục chạy node strip-types, KHÔNG nạp được
   `import './x'` (không đuôi .ts) từ tệp ngày.
5. `npm run course:manifest`, `npx tsc --noEmit`, `npm run build`; mở bài bằng
   Playwright xem không kẹt "Đang tải bài…".
