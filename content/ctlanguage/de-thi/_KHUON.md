# Khuôn đề thi thử CT Language

Mỗi đề = một tệp `<id>.json` (id = tên tệp, `^[a-z0-9-]{3,40}$`). Kiểu dữ liệu + luật kiểm: `src/services/ctlanguage/thiThuan.ts`
(`DeThi`, `kiemDe`). Kiểm: `npx tsx scripts/ctlanguage-kiem-de-thi.mts [id…]`.

⛔ **TỰ SOẠN 100%.** Không chép / phỏng lại câu của đề thật (Hanban HSK/HSKK, JLPT, IELTS của IDP/British Council/Cambridge),
không chép sách luyện đề. Chỉ theo CẤU TRÚC (số phần, số câu, dạng câu, độ khó, từ vựng trong phạm vi cấp).

```jsonc
{
  "id": "hsk1-de-1", "nn": "zh", "kyThi": "HSK", "cap": "HSK1",
  "ten": "HSK 1 · Đề 1", "moTa": "Một dòng tiếng Việt.", "diemDat": 120, "xepHang": true,
  "phan": [
    { "id": "nghe", "ten": "Nghe 听力", "kyNang": "nghe", "phut": 15, "diemToiDa": 100,
      "nhom": [
        { "huongDan": "Phần 1 — Nghe một cụm từ, xét mô tả bên dưới ĐÚNG hay SAI.", "ngheLan": 2,
          "cau": [
            { "id": "1", "kieu": "chon",
              "nghe": [ { "g": "zh-nu", "t": "喝茶" } ],
              "de": "Hình: một người đang uống trà.",
              "luaChon": ["Đúng", "Sai"], "dapAn": 0,
              "giaiThich": "喝茶 (hē chá) = uống trà — khớp mô tả. 喝 = uống, 茶 = trà. Bẫy thường gặp: nhầm 茶 với 水 (nước).",
              "tu": ["喝", "茶"] }
          ] }
      ] }
  ]
}
```

- `kyNang`: `nghe | doc | viet | noi | tu-vung | ngu-phap`. `kieu` câu: `chon | sapXep | dien | noi`.
- `chon`: `luaChon` 2–4 lựa chọn KHÁC nhau, `dapAn` = chỉ số 0-based. **Rải đáp án đều các vị trí** (đừng toàn 0 hay toàn 1).
- `sapXep`: `manh` (các mảnh ĐÃ XÁO, ≥ 3), `dapAn` = mảng câu đúng (ghép đúng từ các mảnh, không thêm bớt chữ; dấu câu bị bỏ khi so).
- `dien`: `de` có chỗ trống `___`, `dapAn` = mảng đáp án chấp nhận (so không phân biệt hoa/thường, bỏ dấu câu + khoảng trắng).
- `noi` (HSKK): `noiKieu: "nhacLai"` (có `nghe`, `mau` = đúng câu đó) hoặc `"traLoi"` (`mau` = câu trả lời mẫu).
- `nghe`: mảng `{g, t}` đọc lần lượt bằng TTS. Giọng: `zh-nu zh-nam` · `ja-nu ja-nam ja2-nu ja2-nam` · `uk-nu uk-nam us-nu us-nam au-nu au-nam`.
  Hội thoại ⇒ mỗi lượt lời một phần tử, đổi giọng nam/nữ theo vai. Câu hỏi của bài nghe (nếu thi thật đọc lên) cũng đưa vào `nghe`.
  Nhóm có `nghe` chung (một hội thoại dài, nhiều câu hỏi) thì đặt `nghe` ở NHÓM. `ngheLan` (1–3, mặc định 2; JLPT = 1).
  ⚠️ `t` chỉ chứa chữ của ngôn ngữ thi (TTS đọc nguyên văn) — không pinyin/furigana/tiếng Việt, không ký hiệu vai "男：".
- `doan` (ở nhóm): đoạn đọc chung. Xuống dòng bằng `\n`.
- `de`, `luaChon`: chữ hiện trên màn. Đề thật có HÌNH ⇒ thay bằng mô tả tiếng Việt ("Hình: …").
- `giaiThich` (bắt buộc, tiếng Việt, ≥ 20 ký tự): vì sao đáp án đúng + bẫy ở đâu / vì sao phương án kia sai + từ / ngữ pháp liên quan
  (kèm pinyin / cách đọc + nghĩa). Câu nghe: chép lại lời nghe kèm dịch nghĩa. 1–3 câu, không lan man.
- `tu`: 1–3 từ / mẫu ngữ pháp then chốt (chữ gốc, đúng dạng từ điển) — sai câu ⇒ app gợi ý ôn.
- Đề xếp lớp (`kyThi: "XEP-LOP"`): mỗi PHẦN là một mức (dễ → khó), `xepLop: { nguong: 60, muc: [ {cap, nhan, loTrinh} × số phần ], vuot: {…} }`.
