# Soạn bài khoá JP (`/language/ja/jp`, app: mục **JP**) — quy tắc bắt buộc

Khoá **tiếng Nhật từ con số 0 tới N1** theo chuẩn JLPT, cho người Việt TỰ HỌC (sinh
viên, người đi làm). Khác khoá Dekiru (`../dekiru`, bài giảng trên lớp theo sách
của trường): khoá này **tự soạn**, không đi theo giáo trình nào. Người dùng (05/10/2026):
"thiết kế và soạn nội dung bài học như IELTS… chuyên nghiệp để user khác và tôi học…
học từ con số 0 đến N1". Mục lục cấp N5 ở `data.ts` (OUTLINE) — tiêu đề bài là lời
hứa với người học: bài phải dạy ĐÚNG và ĐỦ các mẫu ghi trong tiêu đề.

## 1. Nội dung

- **Tự viết 100%**: hội thoại, câu ví dụ, bài đọc, kịch bản nghe, bài tập đều MỚI.
  KHÔNG chép giáo trình nào (Minna no Nihongo, Genki, Marugoto, Dekiru…) — có bản
  quyền, web công khai. Từ vựng và mẫu ngữ pháp thì là kiến thức chung, dùng được.
- **Phạm vi đúng cấp**: bài N5 chỉ dùng từ/ngữ pháp N5 đã học ở bài TRƯỚC + bài này.
  Chữ Hán ngoài N5 thì viết hiragana.
- **Nhân vật cố định** cho cả khoá (giúp người học nhớ): **Lan** (ランさん, sinh viên
  Việt sang Nhật du học, vai chính), **Tanaka** (たなかさん, bạn cùng lớp người Nhật),
  **Yamada-sensei** (やまだ先生, cô giáo), **Kim** (キムさん, bạn Hàn), **Mike**
  (マイクさん, bạn Mỹ), **Suzuki** (すずきさん, chủ nhà trọ/nhân viên cửa hàng…).
  Bối cảnh: Lan học ở trường tiếng ở Tokyo, ở ký túc xá, đi làm thêm ở konbini.
  **Giới tính & vai cố định** (để giọng/hình nhất quán): Lan nữ `a` · Tanaka nam `b` ·
  Yamada-sensei nữ `c` · Mike nam `b` · Suzuki nam `b` · Kim nữ (chủ yếu trong bài nghe/đọc).
  Bài nghe: nữ `ja-nu`, nam `ja-nam`.
- **Romaji ở MỌI câu tiếng Nhật** (Hepburn, tách từ: `watashi wa Ran desu`):
  vocab → `ipa` = romaji của từ, `exRo` = romaji câu ví dụ; `examples`/`patterns`
  → `ro`; `dialogue`/`listen` → `ro`; `build` → `ro`; `readkanji` → `ro`.
- **Furigana**: mọi chữ Hán viết `{漢字|かんじ}` — mỗi từ một cặp ngoặc (`{学生|がくせい}`),
  KHÔNG lồng ngoặc. Trang có nút bật/tắt furigana.
- Giảng bằng **tiếng Việt cho người mất gốc**: câu ngắn, công thức rõ (`N1 は N2 です`),
  giải thích từng trợ từ, **âm Hán Việt** của chữ Hán khi giúp nhớ (学生 = HỌC SINH),
  lỗi người Việt hay mắc (`note` có tiêu đề chứa "sai" hoặc "nhầm").
- Mỗi điểm ngữ pháp: công thức → giải thích → ví dụ (≥4, có `ro`) → **cặp hỏi ↔ đáp**
  (khẳng định + phủ định) → **bảng thay thế** (mẫu + từ lắp vào) → `rule` (công thức 1 dòng)
  → lỗi hay mắc.
- Mọi bài tập có đáp án đúng; `quiz` nhận nhiều cách viết (kana/kanji, có/không dấu câu).

## 2. Cấu trúc một bài (`bai/baiN.ts` export `BAI_N: Lesson[]`)

Chỉ được `import type { Lesson } from '@/components/sach-hoc/types';` (script manifest
chạy bằng Node thuần, KHÔNG nạp được import thường). id bài `bN-<slug>`, id bài tập
`bN-<slug>` duy nhất toàn khoá (tiến độ lưu theo id — đặt rồi không đổi).
Mỗi bài mở đầu bằng khối `recap` (🎯 3–6 ý: hôm nay học gì).

1. `bN-hoi-thoai` kind `conversation` (25–35′) — mục tiêu "học xong nói được gì";
   2–3 tình huống, mỗi tình huống: bối cảnh 1–2 câu tiếng Việt → `dialogue` (role
   `a`/`b`/`c`, `ro` + `vi` mỗi dòng, 6–12 dòng) → `examples` biểu hiện quan trọng.
2. `bN-tu-vung` kind `vocab` (30–40′) — 25–45 từ chia nhóm chủ đề (`h` + `vocab`):
   `w` có furigana, `pos` tiếng Việt (danh từ, động từ nhóm I…), `ipa` romaji, `vi`,
   `ex` câu ví dụ dùng ĐÚNG từ đó, `exRo`, `exVi`, `more` (từ đi kèm / Hán Việt / lỗi).
   Kết bằng `mcq` nghĩa từ (≥8 câu).
3. `bN-ngu-phap` kind `grammar` (40–50′) — mọi mẫu trong tiêu đề bài, mỗi mẫu một `h`
   (tự đóng khung) theo mục 1; cuối bài `build` ghép câu (≥8) + `quiz` điền trợ từ/dạng
   (≥8) + `mcq` (≥6).
4. `bN-kanji` kind `kanji` (25–30′) — từ Bài 2 trở đi (Bài 1 chỉ vài chữ cơ bản):
   `table` [Chữ, Hán Việt, On, Kun, Nghĩa, Từ ví dụ, Mức 👁/✍] cho 6–12 chữ N5
   của bài → `readkanji` (≥10 câu, viết `{漢字|かな}` nhưng hiện chữ trần) → `mcq` đọc
   chữ → `write` (chữ ✍ nên viết).
5. `bN-nghe` kind `listening` (20–30′) — 3–5 bài `listen` (giọng `ja-nu`/`ja-nam`
   theo người nói, `ro` + `vi` mỗi dòng), mỗi bài kèm `mcq` (3–5 câu), kiểu đề JLPT
   N5 (課題理解・ポイント理解・発話表現・即時応答) — ghi rõ dạng đề trong `note`.
6. `bN-noi` kind `speaking` (25–35′) — **`phatam` 8–12 câu** (text có furigana,
   `ipa` = romaji, `vi`) — đây cũng là danh sách câu cho 📞 **CuongMini** khi gọi
   trong bài này, nên chọn câu hay dùng, từ ngắn → dài; rồi `dialogue` mẫu
   examiner↔candidate + `speak` (part '1', 4–6 câu hỏi về bản thân dùng mẫu của bài).
7. `bN-bai-tap` kind `homework` (30–40′) — `quiz` translate Việt→Nhật (≥10, `hint`
   = từ cần dùng, `grammar` = mẫu), `mcq` trợ từ/từ vựng (≥10), `build` (≥6), một
   `passage` đọc hiểu ngắn + `mcq`. Có đáp án.

**Bài 0** (`bai0.ts`, kind `kana`): hiragana (清音 → 濁音・半濁音 → 拗音) → katakana →
âm ngắt っ, trường âm, ん, quy tắc は/へ/を → chào hỏi & câu lớp học. Dùng `alphabet`
(l = kana, ipa = romaji), `write` (kana), `mcq`/`quiz`/`build` đọc–viết kana, `phatam`
cặp dễ nhầm (おばさん/おばあさん, きて/きって…). Chia 4–6 mục (b0-hiragana, b0-dakuon,
b0-youon, b0-katakana, b0-am-dac-biet, b0-chao-hoi…).

**Kiểm tra chặng**: bài cuối mỗi chặng (Bài 5, 10, 15, 20, 24) thêm mục `bN-kiem-tra`
kind `review` (~60′): đủ dạng đề JLPT (文字・語彙, 文法, 読解, 聴解) phủ mọi bài của
chặng, ≥40 câu, thang điểm và "dưới 70% ôn lại bài nào".

## 3. Khối & cú pháp (đọc `components/sach-hoc/types.ts` cho đủ trường)

- Chữ: `**đậm**`, `==dạ quang==`, `~~câu sai~~`, `{漢字|かな}`.
- Giọng: `ja-nu` (nữ, mặc định), `ja-nam` (nam). Vai hội thoại: `a`, `b`, `c`, `examiner`, `candidate`.
- KHÔNG dùng `hanlop`, `chia` (riêng khoá Dekiru), `essay`/`chart` (riêng IELTS).
- Mẫu tham khảo văn phong và độ sâu: `../dekiru/bai/bai1.ts` (hội thoại, ngữ pháp,
  chữ Hán), `../ielts/ngay/ngay2.ts` (recap, rule, bài tập).

## 4. Kiểm trước khi nhận bài

```bash
cd frontend
node --experimental-strip-types --no-warnings scripts/kiem-khoa-sach.mts jp   # 0 lỗi
npm run course:manifest                                                       # ghi manifest.ts
npx tsc --noEmit                                                              # 0 lỗi
```
Thêm `case N` vào `bai/index.ts` cho mỗi bài mới.

## 5. Tiến độ

| Bài | Trạng thái |
|---|---|
| 0–5 | đợt 1 (05/10/2026) |
