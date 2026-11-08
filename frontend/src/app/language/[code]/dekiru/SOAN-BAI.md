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
- **Ôn tập bằng thẻ** (13/10/2026): mục tra cứu `?bai=on-tap-the` (`extras`, cạnh Chia
  động từ), khối `onthe` → `components/sach-hoc/nhat/OnTapThe.tsx` (tải chậm). 8 cách
  ôn: thẻ lật · học (đúng 2 lần: chọn rồi gõ) · trắc nghiệm 4 đáp án (+ câu `mcq` sẵn
  có của sách) · gõ (kana/romaji/chữ Hán, nghĩa Việt không dấu) · nghe chọn/chép ·
  ghép cặp bấm giờ · kiểm tra 20 câu · ôn từ sai (Leitner 5 hộp). Trạng thái lưu
  localStorage `dekiru-onthe-v1` (dùng chung mọi chế độ). Dữ liệu **sinh từ chính các
  bài**, không soạn tay: `npm run dekiru:onthe` → `bai/onTheData.ts` (khối `vocab` trừ
  "câu mẫu", nhóm = tiêu đề `h` trước khối; chữ Hán = hanLop × hanTu; ngữ pháp = dòng
  `patterns` của bài ngữ pháp; câu = khối `mcq` của bài ngữ pháp/chữ Hán/bài tập/từ
  vựng, KHÔNG lấy bài nghe/hội thoại). Tự chạy ở `prebuild`; sửa bài xong thì chạy lại.
  Chấm câu gõ: `nhat/onThe.ts`, kiểm thử `npm run dekiru:onthe:test`. Chữ Hán trông
  giống (đáp án nhiễu) ở `LOOK` trong OnTapThe.tsx. KHÔNG đưa nguyên văn đề ôn của cô.

### Danh sách chữ của lớp — khớp slide hay dự kiến

| Bài | Chữ | Nguồn |
|---|---|---|
| 1 | 日本人学生語何私英員 | dự kiến |
| 2 | 一二三四五六七八九十百千万円 | dự kiến |
| 3 | 時分月火水木金土曜朝晩 | dự kiến |
| 4 | 京名前国男東女区市 | **slide** (13/10) |
| 5 | 先週毎午後見食飲買物行休 | ✅ **khớp slide của cô** (29/09) |
| 6 | 来帰会社聞読書今話 | **slide** (13/10) |
| 7 | 言貝田力門寺肉料理野半大小 | **slide** (13/10) |
| 8 | 父母兄弟姉妹子目口耳足長 | dự kiến |
| 9 | 泳乗習運転集描歌遊 | dự kiến |
| 10 | 右左立座歩待持近道橋危曲 | dự kiến |
| 11 | 起寝働始終住通活初忘慣卒 | dự kiến |
| 12 | 病院医者体頭薬熱痛歯悪治 | dự kiến |
| 13 | 赤青黄色若売知場所品全部 | dự kiến |
| 14 | 空字思便利不同笑経験化手 | dự kiến |
| 15 | 天気晴雨曇降台震事故急心 | dự kiến |

Bài 4/6/7 khớp slide lớp JPD123 (13/10/2026, từ bộ slide "Chu Han Bai 4–7" — Bài 5 trùng khớp 12/12 với ảnh của người học nên bộ này đáng tin); chữ dự kiến trùng với bài có slide đã nhường đi.

Dự kiến = chữ N5/N4 có trong từ vựng/ngữ pháp bài đó, không trùng bài khác (tài
liệu trong `~/Documents/JPD123/` không có danh sách chữ Hán của lớp; sách không có
mục chữ Hán). Có ảnh slide của cô → sửa `chars` + `nguon: 'slide'` + `bang: true`
cho từ cô chép, rồi `npm run course:manifest && npm run dekiru:kanji`.
Bài 5 (29/09): từ vựng khớp đủ 61/61 "Từ mới bài 5.pdf", ポイント 37–47 đủ; bổ sung
6 từ cô chép trên bảng (後ろ, 午後, 見学します, 飲食, 毎週, 後で) trong `b5-han-lop`.

## 7. 🎬 Video giảng theo mục + ✍️ viết tay cả TỪ (15/10/2026)

- **Video KHÔNG soạn trong tệp bài.** Video mp4 (R2) gắn theo mục nằm ở `videos.ts`
  (`{ [lessonId]: { [neo]: VideoMuc[] } }`), SINH bởi `~/Documents/video-bai-giang/xuat/gan-sach.mts`
  từ trường `neo` trong `thong-tin.json` của từng video. Neo = `'dau-bai'` hoặc `'#<đầu tiêu đề h>'`
  (vd `'#ポイント 48'`) ⇒ trang tự chèn video ngay dưới tiêu đề đó + mục "🎬 Video của bài" đầu bài.
  ⚠️ Đổi chữ ĐẦU của một tiêu đề `h` đã có video gắn (vd "ポイント 48 — …") là gỡ video khỏi chỗ đó
  (video rơi lên đầu bài) — sửa thì chạy lại `gan-sach` để nó kiểm neo.
- **`write` nhận TỪ**: phần tử `chars` dài hơn một chữ (`'がくせい'`, `'学生'`, `'コーヒー'`) ⇒ hàng
  từ: mẫu cả từ + lưới (dòng trên tô, dòng dưới tự viết). Trộn được với chữ đơn. Thêm `goi`
  (`{ '学生': 'がくせい · học sinh' }`) để nút "Che mẫu" luyện nhớ từ: chỉ hiện gợi ý + 🔊.
  Đặt sau `vocab` của `bN-tu-vung` (vd `write` `bN-viet-tu`, 8–15 từ hay vào đề), từ ≤ 6 chữ.
- **Để sau** (chưa có khối, đừng giả lập bằng khối khác): viết hội thoại + AI chấm (`vietHoiThoai`),
  trả lời câu hỏi tự do + AI kiểm (`traLoi`), AI chấm NÓI tiếng Nhật (chamNoi đang cứng `en`/thang IELTS),
  dữ liệu `phatam` (Azure ja-JP) cho câu mẫu mỗi ポイント.

## 8. 🚀 TIẾP SAU SÁCH — Bài 16–55, N4 → N3 → N2 (09/11/2026)

Người dùng (09/11/2026): "hãy học theo kiểu trên lớp… để mình và các user trong trường học, và
soạn tiếp phần đã kết thúc đấy đến N2 đầy đủ, chuyên nghiệp, chất lượng để mình học ngữ pháp,
từ vựng, chữ Hán, hội thoại, nghe, nói, đọc, viết… all thi N2". Sách 初級 dừng ở Bài 15
(ポイント 124, ≈ N5 + nửa N4); Bài 16–55 nối tiếp CÙNG KHUÔN lớp, tự soạn 100% theo chuẩn JLPT.
Mục lục + mẫu ngữ pháp từng bài: OUTLINE trong `data.ts` — tiêu đề là lời hứa, dạy ĐỦ mọi mẫu ghi
trong tiêu đề (được thêm mẫu cùng nhóm nếu cần cho đủ cấp).

**Phạm vi & người học.** Người học đã xong trọn Bài 1–15 (mọi ポイント 1–124 + từ vựng sách) và
các bài 16…N−1 trước đó. Bài cấp Nx chỉ dùng từ/ngữ pháp của cấp đó trở xuống + bài trước. Trước
khi soạn: đọc tiêu đề các bài trước trong OUTLINE + `grep` mẫu ngữ pháp trong `bai/` để KHÔNG dạy
lại thứ đã có (nếu cần nhắc thì 1 dòng "ôn: Bài X ポイント Y").

**Nhân vật** giữ của sách (đọc tên + vai ở `bai/bai1.ts`…`bai15.ts`, dùng lại đúng giới tính/giọng);
người mới (đồng nghiệp, sếp…) khai ở chú thích đầu tệp kèm giới tính + giọng `ja-nu`/`ja-nam`.
Bối cảnh lớn dần: N4 đời sống du học + làm thêm · N3 đại học, thực tập, công ty · N2 tìm việc,
công ty IT Nhật, họp, báo cáo, tin tức.

**Một tệp `bai/baiN.ts` export `BAI_N: Lesson[]`** gồm, theo thứ tự:

A. **① Cốt lõi** (id cố định — `nhom.ts` gom theo id):
  1. `bN-hoi-thoai` conversation — 3 tình huống (can-do), `dialogue` 8–14 dòng, `examples`.
  2. `bN-tu-vung` vocab — N4 40–50 từ · N3/N2 50–70 từ, chia nhóm chủ đề; từ N3 thêm nhóm
     **từ dễ nhầm** (類義語, bảng phân biệt) + **kết hợp từ** (コロケーション); `mcq` ≥10.
  3. `bN-ngu-phap` grammar — mỗi mẫu một `h`: công thức (bảng chia đủ V/イA/ナA/N) → giải
     thích → ≥5 ví dụ có `ro` → cặp hỏi↔đáp → bảng thay thế → `rule` → lỗi hay mắc; từ N3 thêm
     **bảng phân biệt với mẫu gần nghĩa** (mẫu · sắc thái · nói/viết · ví dụ). Cuối: `build` ≥10,
     `quiz` ≥10, `mcq` ≥8 dạng đề JLPT (文法形式の判断 + 文の組み立て ★).
  4. `bN-han-tu` kanji — chữ MỚI của bài: N4 12–15 · N3 18–22 · N2 20–25 chữ (tích luỹ ~300 /
     ~650 / ~1.000), không trùng chữ đã dạy (grep `bai/` + `bai/hanTu.ts`). `table` [Chữ, Hán Việt,
     On, Kun, Nghĩa, Từ ví dụ, Mức 👁/✍] → "đứng riêng hay đứng chung" → `readkanji` ≥15 câu (đề
     KHÔNG furigana) → `mcq` đọc chữ + chọn chữ đúng (漢字読み・表記) ≥10 → `write`.
  5. `bN-nghe` listening — 4–6 bài `listen` theo đủ dạng đề JLPT của cấp (課題理解・ポイント理解・
     概要理解・発話表現・即時応答; N2 thêm 統合理解), ghi dạng đề trong `note`, mỗi bài `mcq`.
  6. `bN-doc` reading — 2–3 `passage` (N4 200–400 chữ · N3 400–700 · N2 600–1.000) dạng
     内容理解 短文/中文/長文・情報検索 (N2 thêm 統合理解・主張理解), `mcq` + giải thích đáp án.
  7. `bN-noi` speaking — `phatam` 10–14 câu hay dùng; `dialogue` mẫu; `speak` 5–6 câu hỏi
     (thi nói kiểu JPD: tự giới thiệu, kể, nêu ý kiến; N3+ có trình bày 1 phút).
  8. `bN-viet` writing — viết đoạn/email/ý kiến theo chủ đề bài (N4 150–200 chữ, N3 300, N2 400–600),
     có dàn ý, bài mẫu + từ nối, tiêu chí tự chấm.
  9. `bN-bai-tap` homework — `quiz` dịch Việt→Nhật ≥12, `mcq` ≥12, `build` ≥8, có đáp án.

B. **② Theo buổi trên lớp** — 3 buổi `bN-buoi-1-<slug>` … `bN-buoi-3-<slug>` kind `review`, như
   buổi Slot của lớp (mẫu: `slideB67.ts`): `recap` mục tiêu buổi → các "slide" (`h` + nội dung ngắn,
   bảng, ví dụ — trình tự giáo viên giảng: khởi động/ôn bài cũ → từ mới → ngữ pháp → hội thoại →
   チャレンジ luyện cặp) → bài luyện có đáp án → **"Giáo viên hay hỏi gì khi gọi phát biểu"** (câu
   hỏi + câu trả lời mẫu có `ro`). Buổi chia đúng thứ tự mục A, KHÔNG chép lại nguyên văn mục A —
   cô đọng, nhịp lớp học, có câu hỏi kiểm tra đầu/cuối buổi.

C. **③ Luyện thêm dễ → khó** — 3–5 bài `bN-lt-<slug>` kind `homework` (mọi id phải bắt đầu `bN-` — bộ kiểm đòi): tổng ≥120 câu có đáp án +
   giải thích ngắn (từ vựng → chữ Hán → ngữ pháp → đọc → đề tổng hợp có thang điểm).

D. **④ Kiểm tra** — bài 20, 30, 35, 45, 50: `bN-kiem-tra` kind `review` (~60′, ≥50 câu, đủ 文字・語彙,
   文法, 読解, 聴解, phủ mọi bài của chặng, thang điểm + "sai câu nào ôn bài nào"). Bài 25 / 40 / 55
   là bài **thi thử cả cấp**: thay mục A–C bằng `bN-thi-thu-1-moji` … theo ĐÚNG cấu trúc đề JLPT cấp
   đó (số mondai, số câu, thời gian), ≥120 câu, bảng quy đổi điểm + điểm liệt từng phần, mục ôn
   tổng hợp ngữ pháp/từ vựng/chữ Hán cả cấp.

Độ dày: ~350–600 KB mỗi tệp. Tạo bằng Write 1–2 mục rồi Edit nối từng mục. Romaji MỌI câu, furigana
MỌI chữ Hán `{漢字|かな}` (trừ `readkanji`), giảng tiếng Việt cho người mất gốc, KHÔNG chép giáo trình
nào (Shin Kanzen, Soumatome, Minna…): kiến thức chung dùng được, câu/bài đọc/kịch bản VIẾT MỚI.
Không chắc một cách đọc/nghĩa thì chọn ví dụ khác, không đoán.

**Thẻ chữ Hán của chữ mới (bắt buộc, từ Bài 16):** tệp riêng `bai/hanTuN.ts` export `HAN_TU_N: Record<string, HanTu>`
(đúng khuôn `hanTu.ts`: hv, nghia, en, on, kun, nho = cách nhớ theo ĐÚNG cấu tạo chữ, tu 3–5 từ) cho mọi chữ mới của
`bN-han-tu`. Nét viết: `node --experimental-strip-types --no-warnings scripts/kanjivg-bo-sung.mts` (người điều phối).
**Cấp chữ Hán lệch sớm (đo 09/11):** sách 初級 + chữ của lớp đã phủ gần hết chữ N4 ⇒ từ Bài 17 chữ mới chủ yếu là N3
(ghi đúng cấp trong cột Mức). Bài 16 dùng: 代意考答問質正工堂面接決夢将守 — không dạy lại.
**Hình ảnh (bắt buộc):** mỗi bài ≥1 khối `hinh` (thẻ từ có hình, 12–24 từ cụ thể: đồ vật, con vật, nơi chốn, hành
động) trong `bN-tu-vung`, ≥1 `canh` mở mỗi tình huống hội thoại, và mỗi buổi trên lớp có 1 khối `slides` (10–18
slide như slide của cô: tranh to + mẫu câu + câu hỏi gọi phát biểu `hoi`/`dap` + `ghi` giảng). Tên hình lấy trong
`scripts/hinh/fluent-catalog.json` (Fluent Emoji, ~1.600 tên tiếng Anh viết thường, gạch nối: `dog`, `bento-box`,
`man-cook`…) — `kiem-khoa-sach` báo tên sai. Không có hình đúng nghĩa thì BỎ (đừng gán hình sai nghĩa).

Thêm `case N: return import('./baiN').then((m) => m.BAI_N);` vào `bai/index.ts` (người điều phối làm),
rồi `npm run course:manifest`, `npx tsc --noEmit`. 🎬 Video giảng cho Bài 16+: làm sau khi chữ ổn
(dự án video, gắn qua `videos.ts` như Bài 1–15).
