# Soạn bài khoá tiếng Nhật できる日本語 (`/language/ja/dekiru`) — quy tắc bắt buộc

Giáo trình **できる日本語 初級 本冊** (Dekiru Nihongo), môn **JPD113/JPD123** (FPT).
Người học: sinh viên Việt, **mới biết nửa bảng hiragana**, cần học trước để theo kịp
lớp và **thi nói + nghe điểm cao**. Cô giáo không phát tài liệu ngữ pháp — cô chỉ
viết bảng — nên khoá này là nguồn ngữ pháp chính của người học.

Nguồn (máy người dùng): `/Users/admin/Documents/JPD123/` — sách PDF scan 304 trang
(bài 1 p.15, bài 2 p.31, bài 3 p.47, bài 4 p.67, bài 5 p.83, bài 6 p.101, bài 7
p.117; **ポイント一覧 p.270–281** = toàn bộ giải thích ngữ pháp; **表 p.282–289**),
"Từ mới bài 1–7.pdf" + "Từ vựng JPD123 — Bài 1-7 (sổ tra)" (danh sách từ CÔ PHÁT —
là chuẩn từ vựng), "Âm ghép, trường âm", "Luyện nói", "bài đọc gỡ điểm", "ôn tập 1",
"Hướng dẫn ôn thi". Dữ liệu thi JPD113 có sẵn trong web:
`app/tech-trends/on-thi-jpd113/data/{speaking,personalQA,readaloud,listening}.ts`.

ポイント theo bài: B1 = 1–6 · B2 = 7–15 · B3 = 16–23 · B4 = 24–36 · B5 = 37–47 · B6 = 48–60 · B7 = 61–71 · B8 = 72–80 · B9 = 81–87 · B10 = 88–97 · B11 = 98–103 · B12 = 104–107 · B13 = 108–112 · B14 = 113–118 · B15 = 119–124.
Trang bắt đầu: B7 p.117 · B8 p.137 · B9 p.153 · B10 p.169 · B11 p.185 · B12 p.205 · B13 p.221 · B14 p.237 · B15 p.253 (hết p.269). Người học cần TRỌN sách (27/09: "học hết sách mới đủ thi JPD113 + JPD123"). Từ mới của cô chỉ có đến Bài 7 — Bài 8–15 lấy trang ことば của sách làm chuẩn.

## 1. Nội dung

- **ĐỦ**: mọi ポイント của bài (công thức + mọi ý giải thích), mọi từ trong danh sách
  từ mới của CÔ cho bài đó (không bớt từ nào), mọi mẫu câu hỏi–đáp của 言ってみよう,
  mọi mục できる (can-do). Thiếu một từ/một điểm ngữ pháp là thủng một chỗ khi thi.
- **KHÔNG chép sách**: sách + CD có bản quyền, web công khai → giữ KIẾN THỨC, THỨ
  TỰ, TÌNH HUỐNG, DẠNG BÀI; hội thoại, câu ví dụ, bài đọc, kịch bản nghe VIẾT MỚI
  (cùng nhân vật được — tên nhân vật không có bản quyền). KHÔNG đưa ảnh scan lên
  web; minh hoạ vẽ bằng khối có sẵn (dialogue có nhân vật SVG) hoặc bảng.
- **Romaji ở MỌI câu tiếng Nhật** (người học yêu cầu, dạng Hepburn tách từ:
  `watashi wa Maruko desu`): vocab → `ipa` = romaji của từ, `exRo` = romaji câu
  ví dụ; `examples`/`patterns` → `ro`; `dialogue`/`listen` → `ro`; `build` → `ro`.
- **Furigana**: mọi chữ Hán viết `{漢字|かんじ}` (trang có nút bật/tắt).
- **Từ vựng gắn với ngữ pháp**: mỗi điểm ngữ pháp có câu mẫu CHỈ dùng từ của bài
  (và bài trước), kèm **cặp hỏi ↔ trả lời** (khẳng định + phủ định khi có), và
  **bảng thay thế** (mẫu câu + các từ lắp vào) để người học tự nói được câu mới.
- Giảng bằng tiếng Việt cho người mất gốc: câu ngắn, công thức rõ (`N1 は N2 です`),
  giải thích từng trợ từ, lỗi người Việt hay mắc (`note` tiêu đề có "sai/nhầm").
- Mọi bài tập có đáp án đúng; câu trả lời tự do chấp nhận nhiều cách viết.

## 2. Cấu trúc một bài (`bai/baiN.ts` export `BAI_N: Lesson[]`)

id bài `bN-<slug>`, id bài tập `bN-<slug>` duy nhất (tiến độ lưu theo id — không đổi).

1. `bN-hoi-thoai` kind `conversation` — mục tiêu できる của bài; mỗi スモールトピック:
   tình huống (1–2 câu tiếng Việt), `dialogue` mới (nhân vật sách, `ro` + `vi`),
   biểu hiện quan trọng (`examples`).
2. `bN-tu-vung` kind `vocab` — ĐỦ danh sách từ của cô, chia theo chủ đề nhỏ,
   `vocab` (w furigana, pos tiếng Việt, ipa=romaji, vi, ex, exRo, exVi).
3. `bN-ngu-phap` kind `grammar` — mỗi ポイント một `h` (tự đóng khung): công thức
   (`patterns`/`table`), giải thích, ví dụ có `ro`, cặp hỏi–đáp (`dialogue`
   hoặc `examples`), bảng thay thế, lỗi hay mắc; cuối bài `build` (ghép câu, ≥8)
   + `quiz`/`mcq` ngắn.
4. `bN-kanji` kind `kanji` — chữ Hán xuất hiện trong từ vựng bài: `table` (chữ,
   âm On/Kun, nghĩa Hán Việt, từ ví dụ) + `mcq` đọc chữ.
   + (27/09, người học trượt phần Đọc vì đề KHÔNG có furigana) mục "Đứng riêng
   hay đứng chung" (bảng: chữ | kun đứng riêng | on trong từ ghép) + `readkanji`
   `bN-doc-kanji` (≥15 câu) + `readkanji` `bN-doc-doan` (3–4 đoạn đọc kiểu đề) +
   `write` `bN-viet-kanji` ở cuối.
   Bảng chữ Hán có cột **Mức**: 👁 nhận mặt (đọc + hiểu nghĩa — phần lớn chữ, ưu
   tiên cho thi Đọc) / ✍ nên viết (chữ ít nét, tần suất cao: số, 日月人山川大小…).
   Học chữ Hán THEO TỪ (学生 = gakusei), không bắt thuộc âm từng chữ rời.
5. `bN-nghe` kind `listening` — `listen` kịch bản mới dạng やってみよう /
   もう一度聞こう (voice ja-nu/ja-nam theo người nói) + câu hỏi `mcq`/`quiz`.
6. `bN-noi` kind `speaking` — dạng thi JPD: câu hỏi của giám thị liên quan bài
   (lấy/khớp `on-thi-jpd113/data/speaking.ts`, `personalQA.ts`) + câu trả lời mẫu
   (`dialogue` examiner ↔ candidate có `ro`/`vi`) + đoạn đọc to (Reading 40đ) +
   `speak` để ghi âm.
7. `bN-bai-tap` kind `homework` — `quiz` translate Việt→Nhật (hint = từ cần dùng,
   grammar = ポイント), `mcq` trợ từ/từ vựng, `build`; có đáp án.

Bài 0 (`bai0.ts`, kind `kana`): hiragana trọn bảng (清音 → 濁音・半濁音 → 拗音) →
katakana → âm ngắt っ, trường âm (file "Âm ghép, trường âm" của cô) → chào hỏi &
câu lớp học. Dùng `alphabet` (l = chữ kana, ipa = romaji), `dictation` không
dùng; bài tập `mcq`/`quiz`/`build` đọc–viết kana.

## 3. Kiểm trước khi deploy

`(cd frontend && npx tsc --noEmit)` · đếm: số từ = danh sách của cô, số ポイント
đúng bảng trên · chạy dev mở `?bai=bN-…` ở 1440/820/390, không cuộn ngang, không
lỗi trang · commit theo pathspec · `deploy-nha.sh` (tự push).

## 4. Tiến độ

| Bài | Trạng thái |
|---|---|
| 0 | ✅ kana trọn bộ + âm đặc biệt + chào hỏi/thi (27/09) |
| 1 | ✅ ポイント 1–6, 52/52 từ của cô, đủ 10 câu hỏi thi Bài 1 (27/09) |
| 2 | ✅ ポイント 7–15, 82/82 từ (27/09) — danh sách của cô đảo nghĩa そこ/あそこ, đã dùng nghĩa đúng |
| 3 | ✅ ポイント 16–23, 80/80 từ, bảng giờ/ngày/tháng, ます-form (27/09) |
| 4 | ✅ ポイント 24–36, 72/72 từ, bảng chia tính từ (27/09) — danh sách cô dịch nhầm #68 (không nóng ≠ không lạnh) |
| 5 | ✅ ポイント 37–47, 61/61 từ, bảng quá khứ (27/09) |
| 6 | ✅ ポイント 48–60, 55/55 từ (27/09) — danh sách cô dịch nhầm #27 (日曜日 = CN, không phải thứ 7) |
| 📖 Theo sách | ✅ Bài 1–3 (bai/sach.ts) + Bài 4–6 (bai/sach2.ts) |
| 7 | ✅ ポイント 61–71 + thể て, 71/71 từ của cô (27/09) — list cô ghi 洗います 'tắm' là sai |
| 8 | ✅ ポイント 72–80, 84 từ (27/09) |
| 9 | ✅ ポイント 81–87 + thể từ điển, 61 từ (27/09) |
| 10 | ✅ ポイント 88–97 + thể ない, 70 từ (27/09) |
| 11 | ✅ ポイント 98–103 + 普通形/友達言葉, 49 từ (27/09) |
| 12 | ✅ ポイント 104–107, 51 từ (27/09) |
| 13 | ✅ ポイント 108–112, 40 từ (27/09) |
| 14 | ✅ ポイント 113–118, 65 từ (27/09) — sách in 開(あ)きます (bản trích đọc nhầm ひら) |
| 15 | ✅ ポイント 119–124, 48 từ (27/09) — TRỌN SÁCH |
| Chữ Hán B1–6 | ✅ bổ sung 👁/✍, đứng riêng/chung, readkanji (27/09) |

## 5. 📷 Sách gốc (RIÊNG TƯ — 29/09/2026)

Ngoại lệ DUY NHẤT của luật "không đưa ảnh scan lên web": trang
`/language/ja/dekiru/sach-goc` cho **tài khoản được phép** (`SACH_RIENG_USER_IDS`
hoặc vai trò ADMIN) xem từng trang sách thật + hướng dẫn học trang đó + gia sư
AI nhìn đúng ảnh trang. Người khác: API 403, web không hiện thẻ/mục.

- Ảnh + hướng dẫn KHÔNG ở repo / `public/`: dựng ở `~/Documents/JPD123/sach-goc-web/`
  bằng `scripts/sach-rieng/` (1 `dekiru-xuat-anh.mjs` → 2 `dekiru-huong-dan.mts`
  (AI soạn, gpt-6-sol nhìn ảnh) → 3 `dekiru-tai-len.mts` (mã hoá AES-GCM bằng
  `SACH_RIENG_KHOA`, lên R2 `rieng/sach/dekiru/`)). Bucket R2 được CDN phục vụ
  công khai theo tên khoá — vì thế PHẢI mã hoá, và mọi byte đi qua backend.
- Số trang = trang in trên sách (bản đầy đủ 304 trang); p.1–132 và p.270–289
  lấy từ "BẢN RÕ" (đã đối chiếu ảnh từng trang).
- Mục của trang (チャレンジ！/やってみよう/…) do AI đọc, chuẩn hoá bởi
  `chuanHoaMuc()` (src/services/sachRieng/dekiru.ts) — tên in trên trang thắng.
- Các mục cũ (📖 Theo sách viết lại, hội thoại SVG…) GIỮ NGUYÊN — đây là phần thêm.

## 6. 🈶 Chữ Hán của lớp + thẻ chữ Hán + Chia động từ (29/09/2026)

Người học: "chữ Hán của khoá thiếu nhiều so với bài cô giảng" (slide Bài 5 có đúng
12 chữ) và muốn chạm vào chữ là thấy nét viết + từ đi chung. Các mục cũ GIỮ NGUYÊN.

- **Bài `bN-han-lop`** (kind `kanji`, chèn ngay SAU `bN-kanji` bằng `chenHanLop()`
  trong `bai/hanLop.ts` — bộ nạp `bai/index.ts` và `scripts/course-manifest.mts`
  gọi cùng hàm). Gồm: khối `hanlop` (thẻ như slide) → từ cô chép bổ sung (nếu có)
  → `readkanji` `bN-han-doc` (≥10 câu không furigana) → `write` `bN-han-viet`.
- **Dữ liệu từng chữ** ở `bai/hanTu.ts` (Hán Việt IN HOA · On katakana · Kun
  hiragana với `・` tách gốc–đuôi đúng như cô viết: `み・ます`, `うし・ろ` · nghĩa ·
  cách nhớ bằng hình · 2–5 từ đi chung, `bang: true` = cô chép trên bảng). Số nét
  lấy từ KanjiVG, "Bài N" của từ lấy từ chỉ mục — không soạn tay.
- **Chỉ mục** `bai/kanjiIndex.ts` — SINH TỰ ĐỘNG (`npm run dekiru:kanji`, chạy ở
  `prebuild`): chữ → mọi từ vựng chứa nó (kèm bài), câu ví dụ, âm từ các bảng chữ
  Hán sẵn có. `hanTu`, `hanLop.LOP`, `kanjiIndex` chỉ tải khi mở thẻ (`course.kanji()`).
- **Thẻ chữ Hán** (`components/sach-hoc/KanjiSheet.tsx`): Inline gắn `data-kj`
  cho MỌI chữ Hán → chạm là mở (trừ chữ nằm trong nút, hoặc đang bôi đen để hỏi
  gia sư). Có hoạt hình nét (phát/từng nét/số nét/chậm), On/Kun, cách nhớ, từ đi
  chung chia "bài đang học / bài trước / bài sau" + chip chữ Hán đã học, câu ví
  dụ, tập viết (tái dùng WriteBlock, id `kj-<chữ>`).
- Thêm chữ Hán mới vào nội dung → chạy lại `node scripts/kanjivg-subset.mjs` (ở gốc
  repo) cho `public/kanjivg/strokes.json`.
- **Chia động từ & tính từ**: mục tra cứu `?bai=chia-dong-tu` (CourseDef `extras`,
  hiện dưới "Mở đầu"), khối `chia` → `components/sach-hoc/nhat/ChiaDongTu.tsx`.
  Thuật toán `nhat/chia.ts` (nhóm I/II/III + ngoại lệ 行く・ある・来る・帰る/入る/
  走る/知る/切る), kiểm thử `npm run dekiru:chia:test` (44 động từ + tra nhanh).
  Thêm động từ mới của sách → thêm vào `VERBS` (thể từ điển có furigana, nhóm, bài).

### Danh sách chữ của lớp — khớp slide hay dự kiến

| Bài | Chữ | Nguồn |
|---|---|---|
| 1 | 日本人名前国学生語何私会 | dự kiến |
| 2 | 一二三四五六七八九十百千万円 | dự kiến |
| 3 | 時分半今月火水木金土曜朝 | dự kiến |
| 4 | 山川町駅東西南北大小高新 | dự kiến |
| 5 | 先週毎午後見食飲買物行休 | ✅ **khớp slide của cô** (29/09) |
| 6 | 手歌近遠早広全部約束遊野 | dự kiến |
| 7 | 上下中外横出入開閉使貸置 | dự kiến |
| 8 | 父母兄弟姉妹子目口耳足長 | dự kiến |
| 9 | 読書聞話言泳乗習運転集描 | dự kiến |
| 10 | 右左立座歩待持帰道橋危曲 | dự kiến |
| 11 | 起寝働始終住通活初忘慣卒 | dự kiến |
| 12 | 病院医者体頭薬熱痛歯悪治 | dự kiến |
| 13 | 男女赤青黄色若売知場所品 | dự kiến |
| 14 | 田空字思便利不同笑経験化 | dự kiến |
| 15 | 天気晴雨曇降台震事故急心 | dự kiến |

Dự kiến = chữ N5/N4 có trong từ vựng/ngữ pháp bài đó, không trùng bài khác (tài
liệu trong `~/Documents/JPD123/` không có danh sách chữ Hán của lớp; sách không có
mục chữ Hán). Có ảnh slide của cô → sửa `chars` + `nguon: 'slide'` + `bang: true`
cho từ cô chép, rồi `npm run course:manifest && npm run dekiru:kanji`.
Bài 5 (29/09): từ vựng khớp đủ 61/61 "Từ mới bài 5.pdf", ポイント 37–47 đủ; bổ sung
6 từ cô chép trên bảng (後ろ, 午後, 見学します, 飲食, 毎週, 後で) trong `b5-han-lop`.
