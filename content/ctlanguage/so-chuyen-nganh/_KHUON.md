# Sổ tay chuyên ngành — khuôn tệp

Một tệp = một bộ từ của MỘT ngôn ngữ: `content/ctlanguage/so-chuyen-nganh/<nn>/<ma>.json` (`nn` = en | ja | zh).
Cùng `ma` cho cả ba ngôn ngữ. Luật kiểm: `src/services/ctlanguage/soChuyenNganhThuan.ts`.
Kiểm: `npx tsx scripts/ctlanguage-kiem-so-chuyen-nganh.mts [nn]`.

```json
{
  "ma": "cntt",
  "nn": "ja",
  "ten": "CNTT – phần mềm",
  "moTa": "Từ vựng cho kỹ sư IT / BrSE làm việc với công ty Nhật: đặc tả, kiểm thử, họp, báo cáo tiến độ.",
  "bieuTuong": "laptopcomputer",
  "thuTu": 1,
  "tu": [
    { "chu": "仕様書", "doc": "しようしょ", "hanViet": "SĨ DẠNG THƯ", "nghia": "bản đặc tả", "nhom": "Phát triển",
      "viDu": "仕様書を確認してください。", "viDuDoc": "しようしょをかくにんしてください。", "viDuNghia": "Hãy kiểm tra bản đặc tả." }
  ]
}
```

| `ma` | thuTu | Tên | SF Symbol gợi ý |
|---|---|---|---|
| `cntt` | 1 | CNTT – phần mềm | `laptopcomputer` |
| `van-phong` | 2 | Kinh tế – văn phòng | `briefcase.fill` |
| `nha-may` | 3 | Nhà máy – công xưởng | `gearshape.2.fill` |
| `nha-hang-khach-san` | 4 | Nhà hàng – khách sạn | `fork.knife` |
| `y-te-dieu-duong` | 5 | Y tế – điều dưỡng (ja: kaigo) | `cross.case.fill` |
| `xay-dung` | 6 | Xây dựng | `hammer.fill` |
| `tmdt-logistics` | 7 | Thương mại điện tử – logistics | `shippingbox.fill` |
| `du-lich-san-bay` | 8 | Du lịch – sân bay | `airplane` |

Luật:
- 60–150 từ/bộ, không trùng chữ trong bộ; ≥ 60% từ có `viDu` (câu NGẮN, đời thực trong nghề đó) + `viDuNghia`.
- `doc`: ja = toàn kana (katakana giữ katakana) · zh = pinyin CÓ DẤU THANH (không số, ü không viết v) · en = IPA `/…/` hoặc bỏ.
- `viDuDoc`: ja = toàn kana · zh = pinyin có dấu · en = bỏ.
- `nghia`: tiếng Việt ngắn, đúng nghĩa trong NGHỀ đó. `hanViet` (ja/zh) tuỳ chọn, VIẾT HOA như từ điển.
- `nhom`: mục nhỏ trong bộ (4–8 mục/bộ), app chia đoạn theo đây.
- KHÔNG ghi id `ctl_tu` (id từ điển đổi mỗi lần nhập lại) — máy chủ khớp CHỮ lúc phục vụ. Muốn được gắn mục từ điển
  thì ghi `chu` đúng dạng từ điển (zh giản thể; ja dạng từ điển, động từ thể từ điển; en dạng gốc).
