# Từ vựng theo chủ đề — khuôn tệp (15/11/2026)

Màn "Từ vựng theo chủ đề" của app CT Language (Khám phá ở tab Hôm nay). Tuyến: `GET /api/v1/ctlanguage/kham-pha/<nn>/chu-de`
(lưới, có `nhomLon`) và `GET …/chu-de/<ma>` (từ của chủ đề; `?cap=HSK1,HSK2&nhom=…&trang=&kichThuoc=`, không `trang` ⇒ cả chủ đề).
Luật kiểm: `src/services/ctlanguage/chuDeTuThuan.ts` · nạp: `chuDeTu.ts` · kiểm: `npx tsx scripts/ctlanguage-kiem-chu-de-tu.mts [nn] [--mau]`.

## `_chu-de.json` — danh mục chung ba ngôn ngữ

- `nhomLon`: 7 nhóm lớn (Đời sống · Xã hội & công việc · Học tập · Du lịch · Thời gian & thiên nhiên · Con người · Văn hoá).
- `chuDe[]`: `ma` (kebab-case, KHÔNG đổi — app lưu sổ `chu-de:<ma>`), `ten`, `nhomLon`, `bieuTuong` (SF Symbol iOS 17),
  `anh` (tên ảnh Fluent Emoji ĐÃ CÓ trên R2 `hoc/hinh/<tên>.webp`), `moTa`, `nhom` (3–8 mục con — app chia khúc theo đây).
  Chủ đề văn hoá thêm `tenRieng` / `anhRieng` / `moTaRieng` theo ngôn ngữ (lễ hội Nhật ≠ Tết Trung Hoa ≠ ngày lễ Anh – Mỹ).
- 14 mã của đợt C bắt buộc còn: gia-dinh, an-uong, mua-sam, du-lich, giao-thong, truong-hoc, cong-so, suc-khoe, nha-cua,
  thoi-tiet, cam-xuc, thoi-gian, cong-nghe, so-thich.

## `<nn>/<ma>.json` — từ của một chủ đề ở một ngôn ngữ

```json
{ "ma": "dong-vat", "nn": "ja", "tu": [
  {"chu":"犬","doc":"いぬ","nghia":"chó","loai":"n","cap":"N5","nhom":"Thú cưng","viDu":"犬が好きです。","viDuNghia":"Tôi thích chó.","anh":"dog"}
]}
```

- 60–150 từ/chủ đề, không trùng chữ (katakana = hiragana), ≥ 30% có `viDu` + `viDuNghia`.
- `doc`: ja toàn kana (từ toàn kana ⇒ chính nó) · zh pinyin CÓ DẤU THANH (ü, không "v") · en IPA `/…/` hoặc bỏ.
- `nghia`: Việt, ≤ 80 ký tự, không lẫn chữ Hán/kana. `loai`: n v adj adv phr num mw pron intj conj prep part name.
- `cap`: zh HSK1–HSK6 · ja N5–N1 · en A1–C2. `capUoc: true` = ước lượng (không có trong bộ từ theo cấp của CuongThai, hoặc bị
  nâng lên vì chứa chữ Hán cấp cao hơn — sàn cấp theo `data/hanzi-levels.json.gz`).
- `anh`: chỉ tên có trên R2 (`scripts/hinh/len-r2.mts` — ảnh mới thì đẩy lên R2 TRƯỚC khi ghi vào tệp).
- KHÔNG ghi id `ctl_tu` (id đổi mỗi lần nhập lại từ điển) — máy chủ khớp CHỮ lúc phục vụ, không khớp ⇒ id âm ổn định.

## Cách dựng — `scripts/ctlanguage/sinh-chu-de-tu.mts`

Ứng viên = bộ từ soạn tay theo cấp của CuongThai (API công khai `/my-language/<nn>/vocab`, nhóm "HSK2 · Thể thao" đã mang chủ
đề + cấp + nghĩa + ví dụ) + sổ chuyên ngành + 12 từ cũ. AI (`gpt-6-sol`) chọn từ đúng chủ đề, chia mục con, viết nghĩa ngắn và
BỔ SUNG từ thông dụng còn thiếu; từ bổ sung phải có trong `ctl_tu`/bộ từ web, cách đọc lấy của TỪ ĐIỂN (AI đọc lệch ⇒ log),
không có ⇒ bỏ. Lọc nội dung nhạy cảm (`locNoiDung`). Câu trả lời AI nhớ ở `$TMPDIR/ctl-chu-de-nguon/ai/` — sửa luật hậu kỳ rồi
dựng lại không tốn lượt AI: `npx tsx scripts/ctlanguage/sinh-chu-de-tu.mts --khong-ai --ghi-de`.
Sửa tay một từ: sửa thẳng tệp JSON rồi chạy lệnh kiểm (dựng lại bằng script sẽ GHI ĐÈ chỗ sửa tay nếu dùng `--ghi-de`).
