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

## Bổ sung 15/11/2026

- `luaChon` nay 2–**10** phương án (hộp chữ cái A–J của IELTS; khung 6 từ + sắp A/B/C 6 hoán vị của HSK 4).
- `kieu: "viet"` — bài viết tự do (IELTS Writing): `de` (đề), `mau` (bài mẫu), `vietTask` 1|2, `vietToiThieu` (số từ), `moTaHinh`
  (số liệu Task 1 ở dạng chữ — hiện cho người làm + gửi AI chấm). Câu trả lời = mức 0…1 (band ÷ 9 do AI chấm qua
  `/ielts/thi-may/cham-viet`, hoặc tự chấm). Đề có câu `viet` phải `xepHang: false`.
- Nhóm có thể mang `hinh` (bản đồ / sơ đồ — khuôn `Hinh` của phòng thi web); phần có thể mang `band` (bảng quy số câu đúng ⇒ band).
- Cấp mới: `HSK4` (nghe 45 · đọc 40 · viết 15), `N3` (35 · 39 · 28), `IELTS` (nghe 40 · đọc 40), `IELTS-VIET` (viết 2). Cấp của
  đề phải có trong `CAP_THEO_NN` (`kiemCap`).
- **Đề IELTS (`ielts-de-*`, `ielts-viet-de-*`, `../de-thi-noi/ielts-noi-de-*`) là tệp SINH RA** từ đề phòng thi web bằng
  `npx tsx scripts/ctlanguage-ielts-tu-web.mts` — đừng sửa tay: sửa đề gốc ở `frontend/…/ielts/thi-may/de/*.ts` rồi chạy lại.
- Soát nội dung bằng máy (ngoài khuôn): `npx tsx scripts/ctlanguage-soat-de-thi.mts [id…] [--tu-dien]` — ✗ là lỗi, `!` là nghi.
- Đề thi NÓI với giám khảo AI: `content/ctlanguage/de-thi-noi/*.json` (khuôn `DeNoi` ở `src/services/ctlanguage/thiNoiThuan.ts`);
  HSKK dựng tự động từ đề HSKK ở thư mục này.
