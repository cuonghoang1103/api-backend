# Soạn bài khoá CH (`/language/zh/ch`, app: mục **CH**) — quy tắc bắt buộc

Khoá **tiếng Trung phổ thông (普通话), chữ giản thể, từ con số 0** cho người Việt TỰ HỌC.
Người dùng (05/10/2026): "trung hiện tại chưa có phần nào, bạn làm giúp tôi chuyên nghiệp
để user khác và tôi học… tôi không có giáo trình, chưa biết làm như nào, đành nhờ bạn hết".
Chuẩn: **HSK 3.0** (国际中文教育中文水平等级标准 GF0025-2021) — danh sách từ/chữ theo
cấp là chuẩn công khai. Mục lục HSK 1 ở `data.ts` (OUTLINE) — tiêu đề bài là lời hứa
với người học: dạy ĐÚNG và ĐỦ những gì tiêu đề ghi.

## 1. Nội dung

- **Tự viết 100%**: hội thoại, câu ví dụ, bài đọc, kịch bản nghe, bài tập đều MỚI.
  KHÔNG chép giáo trình nào (HSK Standard Course, 汉语教程/Giáo trình Hán ngữ, Boya,
  New Practical Chinese Reader…) — có bản quyền, web công khai.
- **Phạm vi đúng cấp**: bài HSK 1 chỉ dùng từ HSK 1 đã học (bài trước + bài này).
  Cần một từ ngoài cấp thì ghi rõ "(từ mở rộng)".
- **Nhân vật cố định** cho cả khoá: **Lan** (兰兰 Lánlan, sinh viên Việt sang Bắc Kinh
  học, vai chính), **Vương Minh** (王明 Wáng Míng, bạn cùng lớp người Trung),
  **cô Lý** (李老师 Lǐ lǎoshī, giáo viên), **Anna** (安娜 Ānnà, bạn người Nga),
  **Đại Vĩ** (大伟 Dàwěi, bạn người Mỹ), **bà chủ quán** (老板 lǎobǎn).
  Bối cảnh: Lan học ở một trường đại học ở Bắc Kinh, ở ký túc xá.
- **Pinyin CÓ DẤU THANH ở MỌI câu tiếng Trung** (không dùng số 1–4; thanh nhẹ không
  dấu; tách theo từ: `Wǒ shì Yuènán rén.`). Trường `ro` = pinyin cả câu:
  vocab → `ipa` = pinyin của từ, `exRo` = pinyin câu ví dụ; `examples`/`patterns`/
  `dialogue`/`listen`/`build`/`readkanji` → `ro`.
- **Chữ có pinyin bên trên**: viết `{汉字|hànzì}` — mỗi TỪ một cặp ngoặc
  (`{学生|xuéshēng}`, `{你好|nǐ hǎo}`), không lồng ngoặc. Trang có nút bật/tắt. Dấu câu
  và chữ Latin để ngoài ngoặc. Ghi pinyin theo cách ĐỌC THỰC TẾ của từ điển (不 bù/bú,
  一 yī/yí/yì: ghi theo biến điệu trong câu, giải thích biến điệu ở Bài 0).
- **Âm Hán Việt** là lợi thế lớn của người Việt: ghi âm Hán Việt (IN HOA) trong `more`
  của từ vựng và trong bảng chữ Hán: 学生 = HỌC SINH. Nói rõ khi nghĩa đã lệch
  (先生 tiếng Trung = "ông, chồng", không phải "giáo viên").
- Giảng bằng **tiếng Việt cho người mất gốc**: công thức rõ (`S + 是 + N`), so sánh trật
  tự từ với tiếng Việt (trạng ngữ thời gian/nơi chốn đứng TRƯỚC động từ), lượng từ,
  thanh điệu, lỗi người Việt hay mắc (`note` có tiêu đề chứa "sai" hoặc "nhầm").
- Mỗi điểm ngữ pháp: công thức → giải thích → ví dụ (≥4, có `ro`) → **cặp hỏi ↔ đáp**
  (khẳng định + phủ định) → **bảng thay thế** → `rule` → lỗi hay mắc.
- Mọi bài tập có đáp án; `quiz` nhận nhiều cách viết (có/không dấu câu, 。/.)
  — quiz dịch Việt→Trung: đáp án viết bằng CHỮ HÁN; quiz pinyin: nhận cả dạng có dấu.

## 2. Cấu trúc một bài (`bai/baiN.ts` export `BAI_N: Lesson[]`)

Chỉ được `import type { Lesson } from '@/components/sach-hoc/types';`. id bài `bN-<slug>`,
id bài tập `bN-<slug>` duy nhất toàn khoá. Mỗi bài mở đầu bằng `recap` (🎯 3–6 ý).

1. `bN-hoi-thoai` kind `conversation` (25–35′) — 2–3 tình huống: bối cảnh → `dialogue`
   (role `a`/`b`/`c`, `ro` + `vi`, 6–12 dòng) → `examples` câu then chốt.
2. `bN-tu-vung` kind `vocab` (30–40′) — 20–35 từ chia nhóm (`h` + `vocab`): `w`
   `{chữ|pinyin}`, `pos` (danh từ, động từ, lượng từ, trợ từ…), `ipa` = pinyin, `vi`,
   `ex` câu ví dụ dùng đúng từ đó, `exRo`, `exVi`, `more` (Hán Việt + từ đi kèm/lỗi).
   Kết bằng `mcq` nghĩa từ (≥8).
3. `bN-ngu-phap` kind `grammar` (40–50′) — mọi mẫu trong tiêu đề, mỗi mẫu một `h`;
   cuối bài `build` ghép câu (≥8, chips là từng TỪ tiếng Trung) + `quiz` (≥8) + `mcq` (≥6).
4. `bN-han-tu` kind `kanji` (25–30′) — 6–12 chữ của bài: `table` [Chữ, Pinyin, Hán Việt,
   Bộ thủ, Số nét, Nghĩa, Từ ví dụ] → cách nhớ bằng hình/bộ thủ (`note`) → `readkanji`
   (≥10 câu, hiện chữ trần, `ro` = pinyin) → `mcq` → `write` (chữ nên viết — khoá CH
   tự dùng trình viết hanzi-writer: xem nét / tô / tự viết).
5. `bN-nghe` kind `listening` (20–30′) — 3–5 `listen` (giọng `zh-nu`/`zh-nam` theo
   người nói, `ro` + `vi` mỗi dòng) + `mcq` (3–5 câu mỗi bài), kiểu đề HSK 1 (nghe
   câu chọn tranh-mô-tả bằng chữ, nghe hội thoại trả lời) — ghi dạng đề trong `note`.
6. `bN-noi` kind `speaking` (25–35′) — **`phatam` 8–12 câu** (text `{chữ|pinyin}`,
   `ipa` = pinyin cả câu, `vi`) — cũng là danh sách câu cho 📞 **CuongMini** trong bài
   này: câu hay dùng, ngắn → dài, phủ các thanh khó của bài; rồi `dialogue` mẫu
   examiner↔candidate + `speak` (part '1', 4–6 câu hỏi).
7. `bN-bai-tap` kind `homework` (30–40′) — `quiz` dịch Việt→Trung (≥10, `hint` = từ
   cần dùng, `grammar` = mẫu), `quiz` điền pinyin/thanh (≥6), `mcq` (≥10), `build` (≥6),
   một `passage` đọc hiểu ngắn + `mcq`. Có đáp án.

**Bài 0** (`bai0.ts`, kind `kana`): thanh mẫu (声母 21) → vận mẫu (韵母: đơn, kép, mũi)
→ 4 thanh + thanh nhẹ (so với thanh tiếng Việt) → biến điệu (thanh 3 + thanh 3, 不, 一)
→ quy tắc viết pinyin (y/w, ü sau j/q/x, iou→iu…) → cặp dễ nhầm (zh/z, ch/c, sh/s,
j/q/x, ü/u, an/ang, en/eng) → nét cơ bản & 10 bộ thủ hay gặp + quy tắc thứ tự nét →
chào hỏi đầu tiên (你好, 谢谢, 再见, 对不起). Dùng `alphabet` (l = pinyin, ipa = mô tả cách
đọc ngắn kiểu Việt, **`doc` = một chữ Hán đọc đúng âm đó** — vd l "bā" doc "八";
thanh mẫu b: doc "波"), `phatam` (cặp dễ nhầm, 4 thanh của một âm 妈麻马骂), `mcq`
nghe–chọn thanh, `quiz` điền dấu thanh, `write` (nét/chữ cơ bản 一二三人口大中).
Chia 5–7 mục (b0-thanh-mau, b0-van-mau, b0-thanh-dieu, b0-bien-dieu, b0-quy-tac,
b0-net-chu, b0-chao-hoi…).

**Kiểm tra chặng**: bài cuối mỗi chặng (Bài 5, 10, 15, 20) thêm `bN-kiem-tra` kind
`review` (~60′): dạng đề HSK (听力, 阅读; HSK 3+ có 书写), phủ mọi bài của chặng,
≥40 câu, thang điểm và "dưới 70% ôn lại bài nào".

## 3. Khối & cú pháp (đọc `components/sach-hoc/types.ts` cho đủ trường)

- Chữ: `**đậm**`, `==dạ quang==`, `~~câu sai~~`, `{汉字|hànzì}`.
- Giọng: `zh-nu` (nữ, mặc định), `zh-nam` (nam). Vai: `a`, `b`, `c`, `examiner`, `candidate`.
- KHÔNG dùng `hanlop`, `chia` (riêng Dekiru), `essay`/`chart` (riêng IELTS).
- Mẫu tham khảo độ sâu: `../dekiru/bai/bai1.ts`, `../ielts/ngay/ngay2.ts`.

## 4. Kiểm trước khi nhận bài

```bash
cd frontend
node --experimental-strip-types --no-warnings scripts/kiem-khoa-sach.mts ch   # 0 lỗi
npm run course:manifest
npx tsc --noEmit
```
Thêm `case N` vào `bai/index.ts` cho mỗi bài mới.

## 5. Tiến độ

| Bài | Trạng thái |
|---|---|
| 0–5 | đợt 1 (05/10/2026) |
