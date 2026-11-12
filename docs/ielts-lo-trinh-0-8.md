# Lộ trình IELTS Academic 0 → 8.0 — "hiến pháp" soạn khoá `/language/en/ielts`

> Soạn 12/11/2026. Tệp này là nguồn sự thật cho MỌI đợt soạn bài IELTS sau: Tập 2–5, đề thi máy, test đầu vào, nâng cấp Tập 1.
> Người soạn một Ngày mới PHẢI mở mục 3 (mục lục ngày) + mục 6 (ma trận phủ) rồi tick ô mình phủ. Không có mục nào ở mục 2
> được phép "rơi" khỏi 5 tập. Quy tắc văn phong/khối/id vẫn theo `frontend/src/app/language/[code]/ielts/SOAN-BAI.md`
> và bản giao việc `GIAO-VIEC-NGAY.md`; tệp này chỉ nói **dạy cái gì, ở đâu, đến mức nào**.

Đường dẫn liên quan (đọc để biết đã có gì, không lặp):
- Khoá: `frontend/src/app/language/[code]/ielts/` — `data.ts` (Ngày 1 + mục lục `LATER` Ngày 2–15), `ngay/ngay2..6.ts`, `ngay/manifest.ts`,
  `tracuu.ts` (tra công thức · tra từ vựng), `videos.ts` (24 video Ngày 1–6).
- Công cụ: `thi-may/` (phòng thi máy tính; kho đề `thi-may/de/` hiện 3 tệp `doc-01`, `nghe-01`, `viet-01`, mức "Band 6 → 7.5"),
  `the-tu/` (flashcard SRS, 5 bộ: khoá · nền 1 · nền 2 · học thuật 600 · chặng 3 — tổng ~1.206 từ), `so-loi/` (sổ lỗi tự động, ôn giãn cách),
  `phong-thi/` (đề đủ 3 phần dựng ở máy chủ từ kho `tech-trends/ielts`), `luyen-them/` (kho cũ 4 chặng 0 → 7.5, `roadmap.ts`).
- Bộ khung khối bài: `frontend/src/components/sach-hoc/types.ts` (có khối mới 12/11: `sodo` timeline/flow/mindmap/compare, `figure`, `hinh`,
  `canh`, `slides`; `vocab` item có `anh`).
- Backend AI đã có: `/ielts/ai/cham-viet` (chấm 4 tiêu chí), `/ielts/ai/cham-phat-am` (Azure từng âm), `/ielts/ai/tro-chuyen` (+`/luong`,
  `/cham` — hội thoại nói với AI, chấm), `/ielts/thi-may/*` (lượt thi, chấm viết), `/ielts/vocab/*` (SRS), `/ielts/so-loi/*`.

---

## 0. Nguyên tắc thiết kế (áp cho cả 5 tập)

1. **Một người học, một đích: IELTS Academic 8.0 + dùng được tiếng Anh thật.** Mọi bài phải trả lời được "bài này đẩy band nào, tiêu chí nào"
   (ghi thẳng trong `recap` / `goal`). Tiếng Anh công việc–đời sống không tách khoá riêng: nó là **ngữ liệu** của bài Nghe/Nói/Viết
   (email công việc = luyện cohesion + register; họp = Listening Part 3; phỏng vấn = Speaking Part 1/3; thuyết trình = Part 2 + Part 4).
2. **Ôn xoắn ốc 3 vòng.** Mỗi điểm ngữ pháp/dạng bài xuất hiện ít nhất 3 lần ở 3 tập liên tiếp với yêu cầu tăng: *nhận ra → dùng đúng
   trong câu → dùng tự nhiên trong bài thi đủ độ dài*. Ma trận mục 6 kiểm điều này.
3. **Nhịp 6 ngày = 1 chặng.** Ngày 6k có bài `review` (kiểm tra chặng, ngưỡng đạt ≥ 70 % từng phần, chỉ rõ Ngày cần ôn — như `d6-kiem-tra`).
   Ngày cuối tập = **thi cuối tập đúng dạng IELTS đủ 4 kỹ năng** (đi vào `thi-may`, không nhét trong `ngayN.ts`).
4. **Mỗi ngày 3 bài + 1 `homework`** (≥ 30 câu, có đáp án). Khuôn ngày theo tập, mỗi kind xuất hiện đúng ½ số ngày:
   - Tập 1 (đã có): lẻ = grammar · vocab · listening, chẵn = reading · writing · speaking.
   - Tập 2: lẻ = grammar · listening · speaking, chẵn = vocab · reading · writing (đẩy Nói lên ngang Nghe vì band 4→5 vỡ ở Speaking).
   - Tập 3–5: lẻ = grammar · reading · (bài 3), chẵn = vocab · writing · (bài 3); **bài 3 = listening khi N mod 4 ∈ {0, 1}, speaking khi
     N mod 4 ∈ {2, 3}** (N1 nghe · N2 nói · N3 nói · N4 nghe · N5 nghe · N6 nói …) ⇒ 30 ngày = 15 bài mỗi kind.
   Mỗi ngày đúng 1 khối `phatam`; 3 ngày có 1 bài có `canh` + `dialogue` đời sống/công việc.
5. **Không chép đề thật, nhưng đúng dạng đến từng chi tiết**: giới hạn số từ in HOA, đánh số câu liên tục 1–40, lời dẫn băng, 10 phút
   chép đáp án (bản giấy) → bản máy 2 phút kiểm; Writing đếm từ; Speaking đúng thời gian từng Part.
6. **Đo được mới tin.** Mọi kỹ năng có số đo: L/R = điểm thô → band (bảng mục 1.4, đã khớp `thi-may/cham.ts › bandTuDiem`); W/S = AI chấm 4
   tiêu chí; phát âm = Azure từng âm; từ vựng = SRS "nhớ sau 7 ngày". Band ước tính luôn ghi "ước tính".
7. **Từ vựng có chủ**: mọi từ dạy trong `vocab` tự chảy vào flashcard (`the-tu` bộ "khoá") và `tra-tu-vung`. Không dạy từ ngoài khối `vocab`
   (từ trong bài đọc muốn người học nhớ thì phải đưa vào `vocab` "Từ vựng hữu ích").

---

## 1. Đầu ra theo band — cái gì phải làm được ở cuối mỗi tập

### 1.1 Ánh xạ band ↔ CEFR ↔ tập

| Mốc band tổng | CEFR (theo bảng đối chiếu công khai của IELTS) | Tập đạt được | Số từ vựng chủ động (mục tiêu) |
|---|---|---|---|
| < 4.0 | A1–A2 | Tập 1 (mất gốc → ~4.0) | 1.200–1.500 từ đời sống + 200 từ IELTS nền |
| 4.0–5.0 | B1 (4.0 = đầu B1) | Tập 2 (4.0 → 5.0) | 2.500 (GSL 2000 + AWL sublist 1–2) |
| 5.5–6.5 | B2 | Tập 3 (5.0 → 6.0) | 4.000 (NGSL hết + AWL 1–6 + 20 chủ đề) |
| 7.0–8.0 | C1 | Tập 4 (6.0 → 7.0) · Tập 5 (7.0 → 8.0) | 6.000+ (AWL đủ 570 họ · collocation học thuật · idiom tự nhiên) |
| 8.5–9.0 | C2 | (ngoài khoá) | — |

### 1.2 Writing — đọc từ band descriptors công khai (Task 1: TA · CC · LR · GRA; Task 2: TR · CC · LR · GRA)

| Band | TR / TA (trả lời đề) | CC (mạch lạc, liên kết) | LR (từ vựng) | GRA (ngữ pháp) | Khoá phải dạy để đạt |
|---|---|---|---|---|---|
| **4.0** (cuối Tập 1) | Trả lời được đề nhưng sót phần, ý kiến chưa rõ; Task 1 có số liệu nhưng chưa có overview rõ | Ý có xếp nhưng chưa mạch; từ nối cơ bản (and, but, because) lặp/sai; chia đoạn chưa chắc | Từ cơ bản, lặp; lỗi chính tả làm khó đọc | Câu đơn đúng, câu ghép hay sai; lỗi chia động từ, mạo từ, số nhiều thường xuyên | Khung 4 đoạn; mở bài 2 câu; câu đơn S-V-O; 6 dạng Task 1 nhận ra được |
| **5.0** (Tập 2) | Trả lời đủ các phần nhưng chỗ sâu chỗ nông; có ý kiến nhưng kết luận còn lặp/không rõ; Task 1 kể chi tiết máy móc, **chưa có overview rõ** (overview rõ là mốc band 6), số liệu có chỗ thiếu/sai | Có tổ chức; **lạm dụng** từ nối (Firstly, Moreover…) hoặc dùng sai; có chia đoạn | Đủ dùng cho đề nhưng hạn chế, lỗi từ gây khó hiểu chỗ này chỗ kia | Có **thử** câu phức nhưng sai nhiều; đủ 150/250 từ | Đủ 5 dạng Task 2 + 6 dạng Task 1 viết trọn bài (dạng 7 — biểu đồ kết hợp — ở Tập 3); body paragraph P-E-E; từ nối đúng vai |
| **6.0** (Tập 3) | Trả lời **đủ mọi phần**, ý chính rõ dù có ý phát triển chưa đủ; ý kiến rõ xuyên bài; Task 1 overview rõ, so sánh đúng chỗ | Xếp ý logic, có tiến triển; từ nối đủ loại nhưng còn máy móc; mỗi đoạn có 1 ý trung tâm (chưa luôn) | Đủ rộng; **dám dùng từ ít gặp** nhưng còn sai; lỗi chính tả không cản hiểu | Trộn câu đơn + phức; có lỗi nhưng hiếm khi làm sai nghĩa | Tất cả 12 thì + bị động + điều kiện 2/3 + mệnh đề quan hệ; paraphrase 3 cách; cohesion không lặp từ nối |
| **7.0** (Tập 4) | Đủ mọi phần; **ý kiến rõ suốt bài**; ý chính được mở rộng và chống đỡ (đôi chỗ còn khái quát); Task 1 chọn đúng điểm nổi bật, nhóm số liệu | Tổ chức logic, tiến triển rõ; cohesive devices **đa dạng** (còn chỗ thừa/thiếu); mỗi đoạn 1 chủ đề rõ | Đủ rộng để **linh hoạt và chính xác**; dùng từ ít gặp **có ý thức về văn phong và collocation**; lỗi hiếm | Đa dạng câu phức; **phần lớn câu không lỗi**; kiểm soát tốt dấu câu | Nominalisation, cleft, inversion, hedging, mixed conditionals; tự soát 6 lượt; collocation học thuật |
| **8.0** (Tập 5) | Trả lời **đủ và sâu**; ý được mở rộng, chống đỡ bằng ví dụ/lý lẽ **có liên quan**; Task 1 tổng quan + chi tiết chọn lọc, không sót xu hướng | Thông tin **xâu chuỗi tự nhiên**; mọi mặt của cohesion xử lý tốt (referencing, substitution, ellipsis); chia đoạn đủ và hợp lý | Vốn từ **rộng, dùng trôi chảy, chuyển nghĩa chính xác**; từ ít gặp dùng khéo; lỗi chính tả/chọn từ rất hiếm | **Nhiều cấu trúc, đa số câu không lỗi**; chỉ sai lặt vặt rất hiếm | Sắc thái từ, register, điều tiết độ chắc; cấu trúc hiếm dùng đúng chỗ; tự biên tập đến lỗi 0–1/bài |

### 1.3 Speaking — FC · LR · GRA · P

| Band | FC (trôi chảy, mạch lạc) | LR | GRA | P (phát âm) | Khoá phải dạy |
|---|---|---|---|---|---|
| **4.0** | Nói được nhưng ngắt dài, lặp từ, tự sửa nhiều; câu nối đơn giản | Chủ đề quen (gia đình, thói quen, sở thích); đủ nghĩa cơ bản | Câu cơ bản, mệnh đề phụ hiếm; lỗi thường xuyên | Phạm vi âm hạn chế; phát âm sai gây khó hiểu chỗ này chỗ kia | Part 1 công thức Trả lời → Lý do → Ví dụ; 44 âm nhận biết, âm cuối |
| **5.0** | Giữ được mạch nhưng nhờ lặp/tự sửa/nói chậm; lạm dụng filler; Part 2 nói đủ 2 phút với nhắc | Nói được cả chủ đề lạ nhưng kém linh hoạt; paraphrase lúc được lúc không | Dạng cơ bản đúng khá ổn; câu phức ít, sai nhiều | Có một số đặc trưng band 6 (trọng âm từ đúng, một số nối âm) | Part 2 cấu trúc 4 phần; Part 3 trả lời có mức độ; trọng âm từ; rhythm |
| **6.0** | Sẵn lòng nói dài; mất mạch đôi lúc do lặp/ngắt; từ nối & discourse markers đủ nhưng không luôn đúng | Đủ để nói dài về mọi chủ đề; paraphrase nói chung thành công | Trộn đơn + phức, linh hoạt hạn chế; lỗi ở câu phức nhưng hiếm khi gây hiểu sai | Nhiều đặc trưng, kiểm soát lẫn lộn; nhìn chung dễ hiểu | Idiomatic language mức tự nhiên; nối âm, âm yếu; ngữ điệu câu hỏi/liệt kê |
| **7.0** | Nói dài **không gắng sức**, ngắt chỉ khi tìm từ; discourse markers linh hoạt | Linh hoạt nhiều chủ đề; **có từ ít gặp/idiom**, ý thức văn phong, paraphrase hiệu quả | Nhiều cấu trúc phức khá linh hoạt; **thường không lỗi**; còn vài lỗi dai dẳng | Mọi đặc trưng band 6 + một số band 8 | Part 3 trừu tượng: so sánh, dự đoán, giả định; chunking; sentence stress mang nghĩa |
| **8.0** | Trôi chảy, chỉ đôi lúc lặp/tự sửa; ngắt vì **nội dung**, không vì ngôn ngữ; phát triển ý mạch lạc | Vốn từ rộng, dùng sẵn và linh hoạt; idiom/từ ít gặp **dùng khéo**, sai rất ít | Đa dạng, linh hoạt; **đa số câu không lỗi**; sai vặt rất hiếm | Phạm vi đặc trưng rộng, duy trì linh hoạt; **giọng mẹ đẻ ảnh hưởng tối thiểu** | Tinh chỉnh ngữ điệu thái độ, tone units; luyện giám khảo AI đủ 11–14 phút nhiều lần |

### 1.4 Listening / Reading Academic — điểm thô → band (bảng quy đổi phổ biến; đã khớp `thi-may/cham.ts`)

| Band | Listening (đúng/40) | Reading Academic (đúng/40) | Mục tiêu tập |
|---|---|---|---|
| 4.0 | 10–12 | 10–12 | Tập 1 (P1 Listening ≥ 6/10 · Passage 1 ≥ 6/13) |
| 4.5 | 13–15 | 13–14 | Tập 2 giữa |
| 5.0 | 16–17 | 15–18 | Tập 2 (P1+P2 ≥ 14/20 · Passage 1+2 ≥ 15/27) |
| 5.5 | 18–22 | 19–22 | Tập 3 giữa |
| 6.0 | 23–25 | 23–26 | Tập 3 (mọi Part/Passage làm được, đúng giờ) |
| 6.5 | 26–29 | 27–29 | Tập 4 giữa |
| 7.0 | 30–31 | 30–32 | Tập 4 (P3/P4 ≥ 14/20 · Passage 3 ≥ 9/13) |
| 7.5 | 32–34 | 33–34 | Tập 5 giữa |
| 8.0 | 35–36 | 35–36 | Tập 5 (sai ≤ 5 câu, ổn định 3 đề liên tiếp) |
| 8.5 / 9.0 | 37–38 / 39–40 | 37–38 / 39–40 | — |

Mô tả kỹ năng đọc/nghe tương ứng (để viết `goal`): **4.0** hiểu ý chính đoạn ngắn 300 từ, bắt số/tên đánh vần; **5.0** làm được mọi dạng câu
hỏi ở Passage 1 / Part 1–2, nhận ra paraphrase từ đồng nghĩa; **6.0** làm đủ 3 passage trong 60 phút, bắt được paraphrase đổi loại từ/cấu trúc,
Part 3 phân biệt 3 người nói; **7.0** suy luận quan điểm tác giả, loại bẫy T/F/NG, Part 4 ghi chú bài giảng 5 phút; **8.0** đọc 900 từ trong
≤ 17 phút, tránh bẫy "đúng một nửa", nghe được số liệu phức tạp + giọng vùng ở tốc độ tự nhiên.

### 1.5 Cách tính band tổng (dùng cho kết quả `thi-may` và xếp lớp đầu vào)

Band tổng = trung bình 4 kỹ năng, làm tròn về **.0 / .5 gần nhất**: phần lẻ .25 → .5; .75 → lên nguyên; .125 → xuống .0; .625 → .5
(ví dụ 6.5 · 6.5 · 5.0 · 7.0 = 6.25 → **6.5**). Ghi công thức này vào `thi-may/cham.ts` khi thêm Speaking.

---

## 2. Danh mục phủ trọn (coverage checklist) — mã số dùng trong ma trận mục 6

### 2.1 Ngữ pháp A1 → C1 (bám English Grammar Profile / Cambridge; mã **G**)

| Mã | Điểm ngữ pháp | CEFR | Tập vòng 1 (dạy) | Vòng 2 (dùng) | Vòng 3 (tự nhiên) |
|---|---|---|---|---|---|
| G01 | Câu đơn S-V-O, 4 mẫu câu gốc; to be am/is/are | A1 | T1 N1 | T2 N1 | T3 N1 |
| G02 | Hiện tại đơn (chia -s/-es, phủ định, câu hỏi); trạng từ tần suất | A1 | T1 N1, N7 | T2 N1 | T3 N1 |
| G03 | Đại từ 7 loại; it chủ ngữ giả; one | A1–A2 | T1 N3 | T2 N13 | T4 N13 (referencing) |
| G04 | Danh từ đếm/không đếm; quantifiers; a/an/some/any | A1–A2 | T1 N5 | T2 N7 | T4 N1 |
| G05 | Tính từ & trạng từ; thứ tự tính từ; -ed/-ing adjectives | A2 | T1 N7 | T2 N9 | T3 N7 |
| G06 | Hiện tại tiếp diễn; quá khứ đơn (quy tắc/bất quy tắc 60 động từ); was/were | A2 | T1 N9 | T2 N3 | T3 N1 |
| G07 | Kết hợp N–V–Adj (collocation ngữ pháp cơ bản); there is/are | A2 | T1 N11 | T2 N11 | — |
| G08 | Động từ khuyết thiếu cơ bản: can/could/should/must/have to/may | A2 | T1 N13 | T2 N15 | T3 N19 |
| G09 | Câu bị động hiện tại/quá khứ đơn | A2–B1 | T1 N15 | T2 N21 | T3 N13 |
| G10 | Mạo từ a/an/the/Ø — địa danh, danh từ chung, lần hai | A2–B1 | T2 N1 | T3 N3 | T4 N1 |
| G11 | Giới từ thời gian/nơi chốn/chuyển động; giới từ phụ thuộc (depend on…) | A2–B1 | T2 N3 | T3 N9 | T4 N7 |
| G12 | Hiện tại hoàn thành vs quá khứ đơn; for/since/already/yet/just | B1 | T2 N5 | T3 N1 | T4 N3 |
| G13 | Tương lai: will / be going to / hiện tại tiếp diễn / hiện tại đơn lịch trình | B1 | T2 N7 | T3 N5 | — |
| G14 | So sánh hơn/nhất/bằng; as…as; much/far + comparative; the same as | B1 | T2 N9 | T3 N11 (Task 1) | T4 N9 |
| G15 | Gerund & infinitive (verb patterns 40 động từ); V-ing sau giới từ | B1 | T2 N11 | T3 N7 | T4 N11 |
| G16 | Câu điều kiện loại 0 & 1; unless; when/as soon as | B1 | T2 N13 | T3 N15 | — |
| G17 | Mệnh đề quan hệ xác định who/which/that/whose/where; rút gọn chủ ngữ | B1 | T2 N15 | T3 N17 | T4 N5 |
| G18 | Từ nối cấp câu: and/but/so/because/although; cấp đoạn: Firstly, In addition, However, Therefore | B1 | T2 N17 | T3 N21 | T4 N15 |
| G19 | Câu hỏi: Wh-, Yes/No, câu hỏi gián tiếp (Could you tell me…); question tags | B1 | T2 N19 | T3 N25 | — |
| G20 | used to / would (thói quen quá khứ); past continuous + when/while | B1 | T2 N21 | T3 N1 | — |
| G21 | too/enough; so/such; quite/rather/fairly | B1 | T2 N23 | T3 N23 | — |
| G22 | Hệ 12 thì (bảng tổng + timeline); hiện tại hoàn thành tiếp diễn; quá khứ hoàn thành | B1–B2 | T3 N1 | T4 N3 | T5 N1 |
| G23 | Tương lai hoàn thành / tiếp diễn; dự đoán cho Task 1 có năm tương lai | B2 | T3 N5 | T4 N9 | — |
| G24 | Bị động mọi thì; bị động với modal; bị động của động từ hai tân ngữ; by + agent khi nào | B2 | T3 N13 | T4 N5 | T5 N7 |
| G25 | Câu điều kiện loại 2 & 3; wish / if only; would rather | B2 | T3 N15 | T4 N19 | — |
| G26 | Mệnh đề quan hệ không xác định; rút gọn V-ing/V-ed; mệnh đề quan hệ với giới từ | B2 | T3 N17 | T4 N5 | T5 N7 |
| G27 | Reported speech (câu kể, câu hỏi, mệnh lệnh); say/tell/ask + động từ tường thuật học thuật (claim, argue, suggest) | B2 | T3 N19 | T4 N17 | — |
| G28 | Modal suy đoán hiện tại/quá khứ: must/might/can't have; should have | B2 | T3 N19 | T4 N13 | — |
| G29 | Mệnh đề nhượng bộ/đối lập: although/despite/in spite of/whereas/while; nguyên nhân–kết quả: due to/owing to/as a result/lead to/result in | B2 | T3 N21 | T4 N15 | T5 N13 |
| G30 | Mệnh đề danh ngữ (that-clause, wh-clause làm chủ/tân ngữ); It is + adj + that/to | B2 | T3 N23 | T4 N11 | — |
| G31 | Cụm danh từ phức (pre/post-modification); danh hoá (nominalisation) mức 1 | B2 | T3 N25 | T4 N1 | T5 N1 |
| G32 | Dấu câu: dấu phẩy, chấm phẩy, hai chấm, gạch ngang; lỗi comma splice/run-on | B2 | T3 N27 | T4 N21 | T5 N19 |
| G33 | Cấu trúc so sánh nâng cao: the more…the more; twice as…as; by far | B2 | T3 N29 | T4 N9 | — |
| G34 | Causative have/get sth done; make/let/allow | B2 | T3 N29 | T4 N17 | — |
| G35 | Participle clauses (Having finished…, Faced with…); absolute clause | C1 | T4 N5 | T5 N7 | — |
| G36 | Cleft sentences (It is X that…, What matters is…); emphasis do/does | C1 | T4 N7 | T5 N13 | — |
| G37 | Đảo ngữ: Not only…, Rarely…, Only when…, Should/Were/Had… | C1 | T4 N7 | T5 N13 | — |
| G38 | Mixed conditionals; conditionals với modal perfect; provided that/as long as/supposing | C1 | T4 N19 | T5 N19 | — |
| G39 | Hedging & modality tinh: tend to, appear to, arguably, to some extent, it is widely believed that…; impersonal passive (It is thought that…) | C1 | T4 N13 | T5 N1 | — |
| G40 | Cohesion nâng cao: referencing (this/such/the former/the latter), substitution (one/do so), ellipsis | C1 | T4 N13 | T5 N13 | — |
| G41 | Danh hoá mức 2 (nominalised academic style) vs lúc nên dùng động từ; register formal/informal | C1 | T4 N21 | T5 N1 | — |
| G42 | Subjunctive & formal structures: It is essential that he be…; Were it not for…; so/neither do I; fronting | C1 | T4 N27 | T5 N19 | — |
| G43 | Hệ thống lỗi: subject–verb agreement, dangling modifier, parallelism, tense consistency — bảng tự soát 6 lượt | B2–C1 | T3 N27 | T4 N21 | T5 N25 |
| G44 | Ngữ pháp nói: ellipsis hội thoại, question tags, chunks (I'd say…, the thing is…), fillers học thuật | B2–C1 | T3 N11 | T4 N23 | T5 N11 |

### 2.2 Từ vựng (mã **V**)

**V-A Dải tần suất**: VA1 GSL/NGSL 1–1000 (T1), VA2 1001–2000 (T2), VA3 2001–3000 (T3), VA4 3001–4000 + 1000 từ học thuật ngoài AWL (T4), VA5 từ tần suất thấp có giá trị band 8 (T5).

**V-B Academic Word List 570 họ từ theo sublist** (mỗi sublist 60 họ, sublist 10 = 30): VB1 sublist 1 (T2 N2·N4) · VB2 sublist 2 (T2 N10·N14) · VB3 sublist 3 (T3 N2) · VB4 sublist 4 (T3 N8) · VB5 sublist 5 (T3 N14) · VB6 sublist 6 (T3 N20) · VB7 sublist 7 (T4 N2) · VB8 sublist 8 (T4 N8) · VB9 sublist 9 (T4 N14) · VB10 sublist 10 (T4 N20). Mỗi họ từ dạy đủ các dạng (analyse → analysis, analytical, analyst) + collocation + câu mẫu Task 2. Ôn trọn 570 ở T5 N2 (bộ flashcard "AWL 570").

**V-C 30 chủ đề IELTS hay gặp** (mỗi chủ đề 1 bài `vocab` 20 từ + 10 collocation/cụm động từ + 5 họ từ + 4 câu mẫu ăn điểm; chủ đề đánh ★ có vòng 2 ở tập sau với từ nâng cao):

| Mã | Chủ đề | Tập vòng 1 | Vòng 2 |
|---|---|---|---|
| VC01 | Social media & communication ★ | T1 N1 | T3 N18 |
| VC02 | Education & society ★ | T1 N3 | T3 N2 |
| VC03 | Work, careers & remote work ★ | T1 N5, N7 | T3 N14 |
| VC04 | Volunteering & community | T1 N9 | T4 N14 |
| VC05 | Charts & trends (ngôn ngữ Task 1) ★ | T1 N11 | T2 N10, T3 N11 |
| VC06 | Online vs traditional learning | T1 N13 | T3 N2 |
| VC07 | Maps & processes (ngôn ngữ Task 1) ★ | T1 N15 | T3 N17 |
| VC08 | Environment, climate & pollution ★ | T2 N2 | T4 N2 |
| VC09 | Health, diet & fitness ★ | T2 N4 | T4 N8 |
| VC10 | Technology & innovation ★ | T2 N6 | T4 N20 |
| VC11 | Transport & urban life ★ | T2 N8 | T3 N20 |
| VC12 | Food & agriculture | T2 N12 | T4 N26 |
| VC13 | Travel, tourism & culture | T2 N14 | T3 N26 |
| VC14 | Money, shopping & consumerism | T2 N16 | T4 N14 |
| VC15 | Media, news & advertising | T2 N18 | T4 N26 |
| VC16 | Sport, leisure & entertainment | T2 N20 | T5 N14 |
| VC17 | Family, relationships & generations | T2 N22 | T4 N8 |
| VC18 | Housing, architecture & cities | T2 N24 (ôn) | T3 N8 |
| VC19 | Crime, law & punishment | T3 N4 | T5 N8 |
| VC20 | Government, politics & public spending | T3 N6 | T5 N2 |
| VC21 | Science, research & space | T3 N10 | T5 N20 |
| VC22 | History, archaeology & heritage | T3 N12 | T5 N14 |
| VC23 | Business, economy & globalisation | T3 N16 | T5 N8 |
| VC24 | Animals, nature & biodiversity | T3 N22 | T5 N20 |
| VC25 | Energy & resources | T3 N24 | T5 N26 |
| VC26 | Language, culture & identity | T3 N28 | T5 N26 |
| VC27 | Psychology, happiness & behaviour | T4 N4 | T5 N14 |
| VC28 | Art, music & creativity | T4 N10 | T5 N2 |
| VC29 | Ageing, population & migration | T4 N16 | T5 N8 |
| VC30 | Children, parenting & gender roles | T4 N22 | T5 N20 |

**V-D Kỹ năng từ vựng**: VD1 họ từ & hậu tố/tiền tố (T1 mỗi bài vocab; T2 N4 hệ thống hoá) · VD2 cụm động từ 150 cụm (T1–T2 rải, T3 N18 gom) · VD3 collocation (T2 N16 mở đầu; T3 N14·N24 Task 1/Task 2; T4 N10 học thuật; T5 N2 tinh) · VD4 paraphrase 3 cách — đồng nghĩa, đổi loại từ, đổi cấu trúc (T2 N8 mở đầu; T3 N3 hệ thống; T4 N15 nâng cao) · VD5 từ dễ nhầm (affect/effect, rise/raise, economic/economical…) (T3 N28; T4 N10) · VD6 từ nối & discourse markers theo chức năng (T2 N17; T3 N21; T4 N15) · VD7 idiom & ngôn ngữ tự nhiên cho Speaking (T3 N30; T4 N22; T5 N11) · VD8 sắc thái mạnh/nhẹ, register (T4 N10; T5 N1) · VD9 ngân hàng cụm học thuật (Academic Phrasebank: introducing, contrasting, concluding) (T4 N21; T5 N7) · VD10 đoán nghĩa từ ngữ cảnh khi đọc/nghe (T2 N6; T3 N9).

### 2.3 Reading Academic (mã **R**) — 14 dạng + kỹ năng

| Mã | Dạng câu hỏi | Dạy lần 1 | Luyện lại (độ khó tăng) |
|---|---|---|---|
| R01 | Sentence completion | T1 N4 | T2 N14 · T3 N9 |
| R02 | Flow-chart completion | T1 N6 | T2 N24 · T4 N17 |
| R03 | Table completion | T1 N8 | T3 N15 |
| R04 | Matching features | T1 N10 | T3 N21 · T4 N23 |
| R05 | True / False / Not Given | T1 N12 | T2 N6 (TFNG 2) · T3 N3 · T4 N5 (bẫy) · T5 N3 |
| R06 | Summary completion (word box) | T1 N14 | T3 N9 |
| R07 | Summary completion (từ trong bài) | T2 N2 | T3 N27 |
| R08 | Note completion | T2 N4 | T4 N11 |
| R09 | Short-answer questions | T2 N8 | T3 N15 |
| R10 | Multiple choice (1 đáp án) | T2 N10 | T3 N13 · T4 N9 |
| R11 | Multiple choice (nhiều đáp án) | T3 N13 | T4 N9 |
| R12 | Matching headings | T2 N12 | T3 N5 · T4 N3 · T5 N9 |
| R13 | Matching information (đoạn chứa thông tin) | T2 N16 | T3 N19 · T4 N21 |
| R14 | Matching sentence endings | T2 N18 | T4 N15 |
| R15 | Yes / No / Not Given (quan điểm tác giả) | T2 N20 | T3 N23 · T4 N5 · T5 N9 |
| R16 | Diagram label completion | T2 N22 | T4 N17 |
| R17 | Kỹ năng: 10 loại từ khoá, skim/scan, đọc câu hỏi trước | T1 N2 | T2 N2 · T3 N3 |
| R18 | Kỹ năng: nhận paraphrase (đồng nghĩa → đổi loại từ → đổi cấu trúc → ý ẩn) | T2 N8 | T3 N3 · T4 N3 |
| R19 | Kỹ năng: suy luận, quan điểm/giọng điệu tác giả, bẫy "đúng một nửa", từ cực đoan (all/only/never) | T3 N23 | T4 N5 · T5 N3 |
| R20 | Kỹ năng: quản lý thời gian 17–20–23, thứ tự làm, đọc bố cục 900 từ/20 phút, không bỏ trống | T2 N24 | T3 N29 · T4 N27 · T5 N21 |
| R21 | Thể loại văn bản: khoa học tự nhiên, xã hội, lịch sử, công nghệ, nghệ thuật, kinh tế — mỗi tập đủ 6 thể loại | T2 | T3 · T4 · T5 |

### 2.4 Listening (mã **L**) — 4 Part × mọi dạng × giọng

| Mã | Nội dung | Dạy lần 1 | Luyện lại |
|---|---|---|---|
| L01 | Bảng chữ cái, đánh vần tên/địa chỉ/email, số điện thoại, giá, ngày tháng, giờ, số thập phân/phân số/phần trăm | T1 N1 | T2 N3 · T3 N6 (số liệu phức) |
| L02 | Dictation 1–2 (nghe chép) | T1 N3, N5 | T2 N5 · T3 N12 (dictation nâng cao) |
| L03 | Part 1 — hội thoại giao dịch 2 người, Form completion | T1 N7, N15 | T2 N1 · T3 N6 |
| L04 | Part 2 — độc thoại đời sống, MCQ + Map/plan labelling | T1 N9 | T2 N7 (map) · T3 N12 · T4 N6 |
| L05 | Part 3 — thảo luận học thuật 2–4 người, MCQ · Matching · Flow-chart | T1 N11 | T2 N13 · T3 N18 · T4 N12 · T5 N6 |
| L06 | Part 4 — bài giảng, Note/Summary/Table completion, Sentence completion | T1 N13 | T2 N19 · T3 N24 · T4 N18 · T5 N12 |
| L07 | Dạng: Note completion | T2 N1 | T3 N24 |
| L08 | Dạng: Table completion | T2 N5 | T4 N18 |
| L09 | Dạng: Flow-chart completion | T2 N13 | T4 N12 |
| L10 | Dạng: Summary completion | T3 N24 | T5 N12 |
| L11 | Dạng: MCQ 1 đáp án · MCQ nhiều đáp án (chọn TWO) | T2 N7 · T2 N13 | T3 N18 · T4 N6 |
| L12 | Dạng: Matching (người–ý kiến, địa điểm–đặc điểm) | T2 N13 | T3 N18 · T4 N24 |
| L13 | Dạng: Plan / Map / Diagram labelling (hướng chỉ đường, ngôn ngữ vị trí) | T2 N7 | T3 N12 · T4 N6 |
| L14 | Dạng: Sentence completion · Short answer | T2 N19 | T3 N30 |
| L15 | Kỹ năng: đọc trước câu hỏi, đoán loại từ, từ báo hiệu (signposting), bẫy đổi ý ("actually, no…"), paraphrase khi nghe | T2 N11 | T3 N6 · T4 N12 |
| L16 | Kỹ năng: bỏ câu lỡ, chuyển đáp án đúng chính tả/số nhiều, 2 phút kiểm (bản máy) | T2 N19 | T3 N30 · T5 N24 |
| L17 | Giọng: UK (Received Pronunciation + miền Bắc), US, AU, CA, NZ, Ireland, Scotland — mỗi giọng có bài nhận diện riêng | UK T1; US T2 N7; AU T2 N19; CA T3 N12; NZ T3 N24; Scot/Irish T4 N18 | T5 trộn giọng trong mọi đề |
| L18 | Nghe hiểu đời sống/công việc: họp, thuyết trình, phỏng vấn, podcast, bài giảng đại học 10 phút | T2 N17 (họp) · T3 N18 (phỏng vấn) | T4 N24 (bài giảng dài) · T5 N18 (podcast tốc độ thật) |

### 2.5 Writing (mã **W**)

| Mã | Nội dung | Dạy lần 1 | Nâng cấp |
|---|---|---|---|
| W01 | Task 2 là gì, 4 tiêu chí, khung 4–5 đoạn | T1 N2 | T2 N2 (band 5 trông thế nào) · T3 N2 (band 6) · T4 N2 (band 7) · T5 N1 (band 8) |
| W02 | Task 1 là gì, 6 dạng, Intro–Overview–Body. **Mỗi dạng có 2 biến thể phải dạy đủ**: tĩnh (no time — so sánh) và động (over time — xu hướng); line graph thêm biến thể **tương lai** (dự báo: is expected/projected to); process tách tự nhiên vs nhân tạo | T1 N4 | T2 N4 · T3 N4 |
| W03 | Opinion essay (agree/disagree, to what extent): mở bài → thesis → body → kết | T1 N6, N8, N10 | T2 N2 (trọn bài) · T3 N6 · T4 N4 · T5 N3 |
| W04 | Discussion essay (discuss both views and give your opinion) | T1 N14 | T2 N6 · T3 N10 · T4 N10 · T5 N9 |
| W05 | Advantages / disadvantages (+ "do the advantages outweigh…") + biến thể **"Is this a positive or negative development?"** (đối chiếu 12/11: khoá Writing cũ của chủ kênh tách thành dạng riêng — dạy ở T3 N14) | T2 N10 | T3 N14 · T4 N16 · T5 N15 |
| W06 | Problem / solution · cause / effect / solution | T2 N14 | T3 N18 · T4 N22 · T5 N21 |
| W07 | Two-part question / direct questions | T2 N18 | T3 N22 · T4 N28 · T5 N27 |
| W08 | Task 1 line graph (xu hướng theo thời gian) | T1 N12 (ngôn ngữ) | T2 N4 · T3 N8 · T4 N6 |
| W09 | Task 1 bar chart (so sánh nhóm; có/không thời gian) | T2 N8 | T3 N12 · T4 N12 |
| W10 | Task 1 pie chart (tỉ lệ, so sánh 2 pie) | T2 N12 | T3 N16 · T4 N18 |
| W11 | Task 1 table (chọn lọc số liệu nổi bật) | T2 N16 | T3 N20 · T4 N24 |
| W12 | Task 1 mixed charts (2 biểu đồ khác loại) | T3 N24 | T4 N24 · T5 N5 |
| W13 | Task 1 process diagram (quy trình tự nhiên/sản xuất; bị động, trình tự) | T2 N20 | T3 N28 · T4 N30 (ôn) · T5 N11 |
| W14 | Task 1 map (so sánh trước–sau, vị trí, hướng; bị động quá khứ/hoàn thành) | T2 N22 | T3 N28 · T5 N17 |
| W15 | Kỹ năng: paraphrase đề, thesis statement, topic sentence, P-E-E-L, kết bài không lặp | T1 N6 | T2 N2·N6 · T3 N6 · T4 N4 |
| W16 | Kỹ năng: cohesion — từ nối đúng vai, referencing, không lạm dụng; mỗi đoạn 1 ý | T2 N17 | T3 N10 · T4 N13 · T5 N13 |
| W17 | Kỹ năng: ngôn ngữ số liệu — tăng/giảm/ổn định, mức độ (sharply/gradually), so sánh, tỉ lệ, dự đoán | T1 N11 | T2 N4·N8 · T3 N8 |
| W18 | Kỹ năng: lập dàn ý 5 phút, brainstorm ý + ví dụ, quản lý 20/40 phút, đếm từ; **kho ý tưởng tự soạn theo 20 chủ đề Task 2** (mỗi chủ đề: 4–6 ý ủng hộ/phản đối + ví dụ + 10 collocation) — tra cứu ở `tracuu` từ Tập 3 | T2 N6 | T3 N22 · T4 N28 · T5 N21 |
| W19 | Kỹ năng: tự chấm theo band descriptors, sổ lỗi, viết lại (rewrite) bài cũ | T3 N2 | T4 N2 · T5 N1 |
| W20 | Kỹ năng: 12 lỗi mất điểm oan (lạc đề, memorised, chữ viết, thiếu từ, câu chép đề nguyên văn…) | T2 N24 | T4 N28 |
| W21 | Viết ứng dụng (gắn khéo): email công việc formal/informal (T2 N24), báo cáo ngắn (T3 N26), cover letter (T4 N26), tóm tắt bài giảng (T4 N24), bài phản biện học thuật (T5 N23) | | |

### 2.6 Speaking (mã **S**)

| Mã | Nội dung | Dạy lần 1 | Nâng cấp |
|---|---|---|---|
| S01 | Cấu trúc 3 Part, giám khảo làm gì, tiêu chí | T1 N2 | T3 N2 (band 6) · T5 N1 (band 8) |
| S02 | Part 1 Yes/No → Trả lời + lý do + ví dụ | T1 N4 | T2 N1 |
| S03 | Part 1 Wh- → trả lời thẳng + chi tiết + cảm xúc | T1 N6 | T2 N5 |
| S04 | Part 1 sở thích / thói quen / quan điểm / trải nghiệm quá khứ | T1 N8, N10, N12, N14 | T2 N9 (12 chủ đề Part 1 nhanh) · T3 N4 |
| S05 | Part 2 cue card: 4 dòng gợi ý, 1 phút ghi chú, kể 2 phút; 6 loại đề (người, nơi, đồ vật, sự kiện, hoạt động, trừu tượng) | T2 N3 (người) · N7 (nơi) · N11 (đồ vật) · N15 (sự kiện) · N19 (hoạt động) · N23 (trừu tượng) | T3 N8·N16·N24 · T4 N8·N20 · T5 N5·N17 |
| S06 | Part 3: ý kiến + lý do + ví dụ + nhượng bộ; câu hỏi so sánh quá khứ–hiện tại, dự đoán, giả định, đánh giá | T2 N13 (nhập) | T3 N12·N20·N28 · T4 N4·N12·N24 · T5 N9·N15·N23·N27 |
| S07 | Ngân hàng chủ đề Part 1 (30): work/study, hometown, home, family, friends, daily routine, hobbies, sport, music, films, books, food, weather, travel, transport, shopping, clothes, technology, social media, photography, art, plants/animals, colours, numbers, time management, sleep, noise, weekends, celebrations, neighbours. **+20 chủ đề "lạ" hay ra (đối chiếu 12/11 với bộ đề Part 1 cũ của chủ kênh)**: mirrors, robots, chocolate, watches, bags, shoes, flowers, birds, rain, sunshine, handwriting, patience, visitors, swimming, dreams, history, fruit, toys, housework, dancing — rải T3–T4, mỗi chủ đề 4 câu, tự soạn | rải T1–T3 (mỗi bài Speaking 2–3 chủ đề) | T4 N30 ôn trọn |
| S08 | Ngân hàng Part 2/3 (40 đề) theo 6 loại; mỗi đề đi kèm 4 câu Part 3 | T2–T5 (mỗi bài Speaking 1 đề + Part 3 tương ứng) | T5 N29 ôn 12 đề hay gặp |
| S09 | Fluency: fillers học thuật (Well, I'd say…), kéo dài ý (because/which means/for instance), tự sửa đúng cách, không im > 3 giây; **khi không biết/không có trải nghiệm thì nói gì** (thừa nhận + chuyển ý), **kể chuyện ngắn làm ví dụ**, **kết câu trả lời dứt khoát** (không treo "…and yeah") | T2 N5 | T3 N4 · T4 N4 |
| S10 | Paraphrase câu hỏi, không lặp từ giám khảo; mở rộng từ vựng tại chỗ | T2 N9 | T3 N12 |
| S11 | Phát âm: 44 âm — 12 nguyên âm đơn (T1 N4), 8 nguyên âm đôi (T1 N6), 24 phụ âm (T1 N1 -s/-es; N3 /ð/; T1 N8 /θ/·/ð/; N10 /s/·/ʃ/·/tʃ/·/dʒ/; N12 /v/·/w/·/f/; N14 /r/·/l/; T2 N1 /p/·/b/·/t/·/d/·/k/·/g/ bật hơi + âm cuối; T2 N5 /z/·/ʒ/·/ŋ/·/h/·/j/; T2 N9 cụm phụ âm đầu/cuối -sts, -ths) | T1–T2 | Azure `phatam` mỗi ngày đo lại |
| S12 | Trọng âm từ (quy tắc theo hậu tố; danh–động cùng chữ) | T2 N13 | T3 N16 |
| S13 | Trọng âm câu & nhịp (content vs function words); âm yếu /ə/ (to, for, of, and, can) | T2 N17 | T3 N20 · T4 N8 |
| S14 | Nối âm (consonant–vowel, linking /r/, /j/ /w/), đồng hoá, nuốt âm (wanna/gonna nhận biết) | T3 N4 | T4 N12 · T5 N5 |
| S15 | Ngữ điệu: lên/xuống câu hỏi, liệt kê, đối lập, thái độ; chunking (tone units) & pause mang nghĩa | T3 N24 | T4 N20 · T5 N17 |
| S16 | Nói ứng dụng: tự giới thiệu + small talk (T1 N2), gọi điện/đặt lịch (T2 N3), họp & nêu ý kiến (T2 N17), phỏng vấn xin việc (T3 N18), thuyết trình 3 phút (T4 N20), đàm phán/phản biện lịch sự (T5 N15) | | |
| S17 | Luyện với giám khảo AI đủ 11–14 phút (`/ielts/ai/tro-chuyen`), chấm 4 tiêu chí | T2 N24 (lần đầu) | mỗi đề `thi-may` từ Đề 3 |
| S18 | Part 1 theo **11 khung câu hỏi** (cách khác với chia theo chủ đề — người học gặp chủ đề lạ vẫn có khung trả lời): Do you like X? · How often…? · When was the last time…? · Do you prefer X or Y? · Is X popular in your country? · How has X changed? · Did you do X as a child? · What do you dislike about X? · Is it easy/difficult to…? · What is the best time to…? · Is X suitable for…? | T3 N4 | T4 N4 (ôn nhanh) |

### 2.7 Chiến thuật & quản lý thời gian; ngày thi (mã **X**)

X01 Bài thi gồm gì, Academic vs General, bản máy vs giấy (T1 N2 · T2 N24) · X02 Listening: đọc trước, 1 lần phát, chuyển đáp án (T2 N19) · X03 Reading: thứ tự passage, 17–20–23 phút, không bỏ trống (T2 N24 · T3 N29) · X04 Writing: 20/40 phút, dàn ý 5 phút, đếm từ, không xoá bừa (T2 N6 · T4 N28) · X05 Speaking: tư thế, không học thuộc, xin nhắc lại câu hỏi (T2 N13 · T4 N30) · X06 Ngày thi: giấy tờ, mang gì, thứ tự, tạm nghỉ, kết quả & EOR (T5 N29) · X07 Tự học bền: SRS, sổ lỗi, lịch tuần, đo tiến độ (T1 Intro · T3 N2 · T5 N1) · X08 Tâm lý phòng thi, chiến thuật khi lỡ câu / lạc đề giữa bài (T4 N28 · T5 N29).

### 2.8 Tiếng Anh dùng hằng ngày & công việc (mã **E**, gắn vào bài kỹ năng — không bài riêng)

E01 Tự giới thiệu & small talk (T1 N2 Speaking) · E02 Hỏi đường, mua sắm, nhà hàng, bác sĩ (T2 N3 Listening P1/P2; `canh` + `dialogue`) · E03 Email công việc formal/informal, lịch hẹn (T2 N24 Writing) · E04 Họp: nêu ý kiến, đồng ý/phản đối lịch sự, tóm tắt (T2 N17 Listening P3 + Speaking) · E05 Phỏng vấn xin việc & CV nói (T3 N18) · E06 Thuyết trình 3 phút có slide, trả lời Q&A (T4 N20 Speaking; T4 N24 Listening bài giảng) · E07 Đọc tài liệu chuyên ngành/bài báo khoa học phổ thông (T4 Reading mọi bài) · E08 Nghe podcast/tin tức tốc độ thật, giọng vùng (T5 N18) · E09 Viết báo cáo/tóm tắt/phản biện (T3 N26 · T4 N24 · T5 N23) · E10 Đàm phán & phản biện lịch sự, hedging trong giao tiếp (T5 N15).

> Cột "Tập/Ngày" trong mục 2 là **chỉ dẫn khi thiết kế**; mục lục từng ngày (mục 3) và ma trận (mục 6) là **bản chốt** — lệch nhau thì mục 3/6 thắng.

---

## 3. Lộ trình 5 tập — mục lục từng ngày

Tổng: **Tập 1** 15 ngày (có) + **Tập 2** 24 ngày + **Tập 3** 30 ngày + **Tập 4** 30 ngày + **Tập 5** 30 ngày = **129 ngày học** (~2 giờ/ngày ⇒ 6–7
tháng học liên tục; thực tế 9–12 tháng vì ôn lại và nghỉ). Mỗi ngày ghi `N` = số ngày trong tập; id bài giữ quy ước `dN-…` nhưng **mỗi tập một
`storageKey` + tiền tố id riêng** (`t2d1-…`, `t3d1-…`) để không đụng id Tập 1 (Tập 1 giữ `dN-…` như cũ).

Ký hiệu trong bảng: **[G..] [V..] [R..] [L..] [W..] [S..] [X..] [E..]** = mã mục 2; 🔊 = âm luyện trong khối `phatam` của ngày; ✅ = kiểm tra chặng
(`kind: 'review'`, ngưỡng ≥ 70 % từng phần); 🖥️ = đề thi máy (`thi-may`), xem mục 4.

### 3.1 Tập 1 — "Mất gốc → 4.0" (15 ngày, ĐÃ CÓ: Ngày 1–6 soạn xong, 7–15 đang soạn theo `LATER`)

| N | Bài 1 | Bài 2 | Bài 3 | Ghi chú |
|---|---|---|---|---|
| 1 | Câu đơn & thì hiện tại đơn [G01 G02] 🔊 -s/-es | Từ vựng Mạng xã hội [VC01] | Nghe: bảng chữ cái & đánh vần [L01] | + Bắt đầu tại đây (intro, X07) |
| 2 | Làm quen IELTS Reading & từ khoá [R17 X01] | Làm quen Writing Task 2 [W01] | Cấu trúc bài thi Speaking [S01 E01] 🔊 âm cuối | |
| 3 | Đại từ [G03] 🔊 /ð/ | Từ vựng Giáo dục & xã hội [VC02] | Dictation 1 [L02] | |
| 4 | Sentence Completion 1 [R01] | Làm quen Writing Task 1 [W02] | Part 1 Yes/No [S02] 🔊 11 nguyên âm đơn | |
| 5 | Danh từ đếm được / không đếm được [G04] | Từ vựng Làm việc từ xa [VC03] | Dictation 2 [L02] | |
| 6 | Flow-chart Completion 1 [R02] | Opinion Essay 1 — mở bài [W03 W15] | Part 1 Wh- [S03] 🔊 8 nguyên âm đôi | ✅ Kiểm tra chặng 1 (`d6-kiem-tra`) |
| 7 | Tính từ & trạng từ [G05] | Từ vựng Làm việc từ xa (tiếp) [VC03] | Listening Part 1 [L03] | 🔊 đề xuất /θ/ /ð/ |
| 8 | Table Completion [R03] | Opinion Essay 2 — thân bài [W03] | Part 1 Sở thích [S04] | 🔊 /s/ /ʃ/ /tʃ/ /dʒ/ |
| 9 | Hiện tại tiếp diễn & quá khứ đơn [G06] | Từ vựng Tình nguyện [VC04] | Listening Part 2 [L04] | |
| 10 | Matching Features [R04] | Opinion Essay 3 — kết bài & trọn bài [W03] | Part 1 Thói quen [S04] | 🔊 /v/ /w/ /f/ |
| 11 | Kết hợp danh từ – động từ – tính từ [G07] | Từ vựng Biểu đồ theo thời gian 1 [VC05 W17] | Listening Part 3 [L05] | |
| 12 | True / False / Not Given [R05] | Biểu đồ theo thời gian 2 — viết Task 1 line [W08] | Part 1 Nêu quan điểm [S04] | ✅ Kiểm tra chặng 2 (N7–12) — **phải thêm**, 🔊 /r/ /l/ |
| 13 | Động từ khuyết thiếu [G08] | Từ vựng Học trực tuyến & truyền thống [VC06] | Listening Part 4 [L06] | |
| 14 | Summary Completion (hộp từ) [R06] | Bài luận thảo luận hai mặt [W04] | Kể lại trải nghiệm đã qua [S04] | 🔊 /ɪ/ vs /iː/ ôn |
| 15 | Câu bị động [G09] | Từ vựng Bản đồ & quy trình [VC07] | Form Completion [L03] | ✅ Kiểm tra chặng 3 (N13–15) + 🖥️ **Đề 1** (thi cuối Tập 1, band 3.5–4.5) |

### 3.2 Tập 2 — "4.0 → 5.0" (24 ngày; CEFR A2+ → B1)

Mục tiêu đo được cuối tập: Listening ≥ 16/40 (P1+P2 ≥ 14/20) · Reading ≥ 15/40 (Passage 1+2 ≥ 15/27) · Writing 5.0 (đủ 150/250 từ, đủ 5 dạng
Task 2 + 6 dạng Task 1 viết trọn bài; biểu đồ kết hợp để Tập 3) · Speaking 5.0 (Part 2 đủ 2 phút, Part 3 trả lời 3 câu) · 2.500 từ · AWL sublist 1–2 · phụ âm hết 24 âm.
Khuôn: lẻ = grammar · listening · speaking; chẵn = vocab · reading · writing.

| N | Bài 1 | Bài 2 | Bài 3 | Ghi chú |
|---|---|---|---|---|
| 1 | Mạo từ a / an / the / Ø — địa danh, lần hai, danh từ chung [G10] | Listening Part 1 — Form completion 2: đăng ký khoá học [L03] | Part 1 ôn Yes/No: Work/Study · Hometown · Home [S02 S07] 🔊 /p b t d k g/ bật hơi + âm cuối | khung ngày mới: recap "bài này đẩy band nào" |
| 2 | AWL sublist 1 (30 họ đầu) + Environment & pollution [VB1 VC08] | Summary completion — điền từ trong bài [R07] | Opinion essay trọn bài band 5: thân bài P-E-E [W01 W03 W15] | |
| 3 | Giới từ thời gian / nơi chốn / chuyển động + giới từ phụ thuộc [G11] | Nghe số, ngày, giá, địa chỉ nâng cao — đặt phòng, hỏi đường [L01 E02] `canh`+`dialogue` | Part 2 lần đầu: Describe a person — cue card, 1 phút ghi chú [S05]; gọi điện đặt lịch [S16] 🔊 /θ/ /ð/ trong câu | |
| 4 | AWL sublist 1 (30 họ còn lại) + Health & diet + hệ thống hậu tố/tiền tố [VB1 VC09 VD1] | Note completion [R08] | Task 1 line graph trọn bài (`figure`) — overview 2 câu [W02 W08 W17] | |
| 5 | Hiện tại hoàn thành vs quá khứ đơn; for / since / yet [G12] | Dictation 3 + Table completion [L02 L08] | Part 1 Wh- ôn + fillers học thuật, kéo dài ý [S03 S09] 🔊 /z ʒ ŋ h j/ | |
| 6 | Technology & innovation + đoán nghĩa từ ngữ cảnh [VC10 VD10] | True / False / Not Given 2 — 5 bẫy cơ bản [R05] | Discussion essay trọn bài + dàn ý 5 phút + 20/40 phút [W04 W18 X04] | ✅ Kiểm tra chặng (N1–6) |
| 7 | Tương lai: will / be going to / hiện tại tiếp diễn / lịch trình [G13] | Part 2 — Map labelling, ngôn ngữ vị trí; **giọng US** [L04 L13 L17] | Part 2: Describe a place [S05] 🔊 US vs UK: /r/ cuối, /t/ flap | |
| 8 | Transport & urban life [VC11] | Short-answer questions + paraphrase 3 cách khi đọc [R09 R18 VD4] | Task 1 bar chart + ngôn ngữ so sánh [W09 W17] | |
| 9 | So sánh hơn / nhất / bằng; much / far + comparative [G14] | Đề nhỏ Part 1+2 (20 câu, đúng giờ) — tự chấm, ghi sổ lỗi [L03 L04] | Paraphrase câu hỏi giám khảo + 12 chủ đề Part 1 nhanh [S10 S04 S07] 🔊 cụm phụ âm -sts / -ths / -ngths | |
| 10 | AWL sublist 2 (30 họ) + ngôn ngữ xu hướng vòng 2 [VB2 VC05] | Multiple choice 1 đáp án [R10] | Advantages / disadvantages (+ outweigh) [W05] | |
| 11 | Gerund & infinitive — 40 động từ; V-ing sau giới từ [G15] | Kỹ năng nghe: từ báo hiệu, bẫy "actually, no…", đoán loại từ [L15] | Part 2: Describe an object [S05] 🔊 trọng âm từ 2 âm tiết (REcord / reCORD) [S12] | |
| 12 | Food & agriculture [VC12] | Matching headings [R12] | Task 1 pie chart (1 và 2 pie) [W10] | ✅ Kiểm tra chặng (N7–12) + 🖥️ **Đề 2** (band 4.5) |
| 13 | Câu điều kiện loại 0 & 1; unless; as soon as [G16] | Part 3 — MCQ, chọn TWO, Flow-chart, Matching người–ý kiến [L05 L09 L11 L12] | Part 3 nhập môn: ý kiến + lý do + ví dụ; xin nhắc lại câu hỏi [S06 X05] 🔊 trọng âm từ 3 âm tiết | |
| 14 | AWL sublist 2 (30 còn lại) + Travel & tourism [VB2 VC13] | Sentence completion 2 — Passage 2 [R01] | Problem / solution · cause / effect [W06] | |
| 15 | Mệnh đề quan hệ xác định who / which / that / whose / where [G17] | Part 1+2 **giọng AU** nhập [L03 L04 L17] | Part 2: Describe an event [S05] 🔊 âm yếu /ə/ nhập (to, for, of, and) [S13] | |
| 16 | Money, shopping & consumerism + collocation mở đầu [VC14 VD3] | Matching information [R13] | Task 1 table — chọn số nổi bật [W11] | |
| 17 | Từ nối cấp câu & cấp đoạn — đúng vai, không lạm dụng [G18 VD6 W16] | Nghe họp công việc (dạng Part 3): nêu ý kiến, đồng ý/phản đối [L18 E04] `canh` | Trọng âm câu & nhịp; nêu ý kiến trong họp [S13 S16] 🔊 content vs function words | |
| 18 | Media, news & advertising [VC15] | Matching sentence endings [R14] | Two-part question [W07] | ✅ Kiểm tra chặng (N13–18) |
| 19 | Câu hỏi Wh- / Yes-No / gián tiếp; question tags [G19] | Part 4 — Note · Sentence completion · Short answer; chuyển đáp án, 2 phút kiểm; giọng AU [L06 L14 L16 X02] | Part 2: Describe an activity [S05] 🔊 ngữ điệu câu hỏi Yes/No ↑ Wh- ↓ | |
| 20 | Sport, leisure & entertainment [VC16] | Yes / No / Not Given [R15] | Task 1 process diagram — bị động + trình tự [W13] | |
| 21 | used to / would; quá khứ tiếp diễn + when / while [G20] | Đề nhỏ Part 3+4 (20 câu) [L05 L06] | Part 3: so sánh quá khứ – hiện tại [S06] 🔊 -ed ba cách đọc | |
| 22 | Family, relationships & generations [VC17] | Diagram label completion [R16] | Task 1 map — trước/sau, bị động quá khứ [W14] | |
| 23 | too / enough / so / such; ôn tổng ngữ pháp Tập 2 (bảng 12 điểm) [G21] | Đề Listening đủ 40 câu (luyện, cho tua) [L03–L06] | Part 2 đề trừu tượng (a rule you dislike) + **giám khảo AI lần đầu** 11 phút [S05 S17] 🔊 nối âm phụ âm–nguyên âm nhập [S14] | |
| 24 | Ôn 18 chủ đề từ vựng (Match 200 từ) + Housing & cities nhập [VC18] | Reading đủ 3 passage 60 phút — thứ tự, 17–20–23, không bỏ trống [R20 X01 X03] | 12 lỗi mất điểm oan + email công việc formal/informal [W20 W21 E03] | 🖥️ **Đề 3 = thi cuối Tập 2** (band 5.0, đủ 4 kỹ năng) |

### 3.3 Tập 3 — "5.0 → 6.0" (30 ngày; B1 → B2) — chặng đông người kẹt nhất, trọng tâm Writing + paraphrase

Mục tiêu đo được cuối tập: Listening ≥ 23/40 · Reading ≥ 23/40 (làm đủ 3 passage trong 60 phút) · Writing 6.0 (đủ mọi phần đề, ý kiến rõ,
trộn câu đơn–phức) · Speaking 6.0 (nói dài sẵn lòng, Part 3 có mức độ) · 4.000 từ · AWL sublist 3–6 · nối âm + âm yếu.
Khuôn: lẻ = grammar · reading · bài 3; chẵn = vocab · writing · bài 3; bài 3 = **nghe** khi N mod 4 ∈ {0,1}, **nói** khi N mod 4 ∈ {2,3}.

| N | Bài 1 | Bài 2 | Bài 3 | Ghi chú |
|---|---|---|---|---|
| 1 | Hệ 12 thì — timeline tổng; hiện tại hoàn thành tiếp diễn; quá khứ hoàn thành (ôn G01 G02 G06 G12 G20) [G22] | Chiến thuật đọc band 6: skim bố cục 900 từ, câu hỏi trước, paraphrase 4 mức [R17 R18] | 🎧 Part 1 giọng trộn UK/US/AU — 10/10 câu, 2 phút kiểm [L03 L16] 🔊 tự chẩn 44 âm (Azure) | |
| 2 | AWL sublist 3 + Education vòng 2 [VB3 VC02] | Band 6 trông thế nào — tự chấm theo descriptors, sổ lỗi, viết lại [W01 W19 X07] | 🗣 Band 6 Speaking: tiêu chí, so mẫu band 5 vs 6 [S01] 🔊 /æ/ /e/ /ʌ/ | |
| 3 | Mạo từ vòng 2 — the + danh từ chung, lỗi band 6 [G10] | True / False / Not Given 3 + paraphrase hệ thống [R05 R18 VD4] | 🗣 Part 1: Weather · Shopping · Clothes + nối âm phụ âm–nguyên âm [S04 S07 S14] 🔊 linking /r/ | |
| 4 | Crime, law & punishment [VC19] | Task 1 band 6 — overview chọn 2 điểm, nhóm số liệu [W02] | 🎧 Part 2 MCQ + Map, **giọng CA** [L04 L13 L17] | |
| 5 | Tương lai hoàn thành / tiếp diễn; dự đoán Task 1 (ôn G13) [G23] | Matching headings 2 — ý chính vs chi tiết [R12] | 🎧 Số liệu phức: thập phân, %, năm, đơn vị [L01] 🔊 thirteen/thirty | |
| 6 | Government, politics & public spending [VC20] | Opinion band 6 — thesis có mức độ, phản đề 1 câu [W03] | 🗣 Part 3 "Why do you think…?" — 2 lý do + ví dụ [S06] 🔊 /ɔː/ /ɒ/ /əʊ/ | ✅ Kiểm tra chặng (N1–6) |
| 7 | Verb patterns nâng cao + -ed/-ing adjectives (ôn G15 G05) | Short answer 2 + văn bản khoa học tự nhiên [R09 R21] | 🗣 Part 2: Describe a person vòng 2 (người có ảnh hưởng) [S05] 🔊 trọng âm theo hậu tố -tion/-ic/-ity [S12] | |
| 8 | AWL sublist 4 + Housing & architecture [VB4 VC18] | Task 1 line graph 2 — hai đường cắt nhau [W08 W17] | 🎧 Part 3 — 3 người nói, phân biệt giọng, Matching [L05 L12] | |
| 9 | Giới từ phụ thuộc 60 cụm + đoán nghĩa ngữ cảnh (ôn G11) [VD10] | Sentence completion 3 + Summary hộp từ 2 [R01 R06] | 🎧 Kỹ năng: bẫy đổi ý, paraphrase khi nghe, 2 đáp án gần nhau [L15] 🔊 âm yếu trong cụm giới từ | |
| 10 | Science, research & space [VC21] | Discussion band 6 — 2 thân bài cân đối + ý kiến rõ [W04 W16] | 🗣 Part 3 "Do you agree that…?" — đồng ý một phần [S06] 🔊 ngữ điệu nhượng bộ | |
| 11 | So sánh nâng cao cho Task 1: the more…, twice as…, by far (ôn G14) [G33 VC05] | Multiple choice 2 — loại 3 đáp án sai [R10] | 🗣 Ngữ pháp nói: chunks (I'd say…, the thing is…) + fluency [G44 S09] 🔊 chunking nhập [S15] | |
| 12 | History, archaeology & heritage [VC22] | Task 1 bar chart 2 — nhiều nhóm, không thời gian [W09] | 🎧 Part 2 map + dictation nâng cao; giọng CA/NZ [L04 L13 L02 L17] | ✅ Kiểm tra chặng (N7–12) |
| 13 | Bị động mọi thì + với modal + by agent (ôn G09) [G24] | Multiple choice nhiều đáp án (TWO/THREE) [R11] | 🎧 Part 4 — Note completion bài giảng 5 phút [L06 L07] 🔊 /ʃ/ /ʒ/ trong -tion/-sion | |
| 14 | AWL sublist 5 + Work vòng 2 + collocation Task 2 [VB5 VC03 VD3] | Advantages/disadvantages band 6 — outweigh, cân nhắc [W05] | 🗣 Part 2: Describe a place vòng 2 (nơi công cộng) [S05] 🔊 /ɪə/ /eə/ /ʊə/ | |
| 15 | Điều kiện loại 2 & 3; wish / if only (ôn G16) [G25] | Table completion 2 + Short answer [R03 R09] | 🗣 Part 3 giả định "What would happen if…?" [S06] 🔊 would've / could've nối âm | 🖥️ **Đề 4** (giữa tập, band 5.5) |
| 16 | Business, economy & globalisation [VC23] | Task 1 pie chart 2 — hai pie theo năm [W10] | 🎧 Đề nhỏ Part 1+2, 20 câu, không tua [L03 L04 L16] 🔊 trọng âm danh–động (INcrease/inCREASE) [S12] | |
| 17 | Mệnh đề quan hệ không xác định; rút gọn V-ing/V-ed (ôn G17) [G26] | Flow-chart 2 + Diagram label + ngôn ngữ quy trình/bản đồ vòng 2 [R02 R16 VC07] | 🎧 Part 3 Flow-chart + MCQ TWO [L05 L09 L11] 🔊 pause trước mệnh đề quan hệ | |
| 18 | Social media vòng 2 + gom 150 cụm động từ [VC01 VD2] | Problem/solution band 6 — giải pháp gắn đúng vấn đề [W06] | 🗣 Phỏng vấn xin việc — Part 1/3 dạng + nghe phỏng vấn mẫu [S16 E05 L18] `canh` 🔊 ngữ điệu lịch sự | ✅ Kiểm tra chặng (N13–18) |
| 19 | Reported speech + động từ tường thuật học thuật; modal suy đoán (ôn G08) [G27 G28] | Matching information 2 [R13] | 🗣 Part 3 tường thuật ý người khác "Some people say…" [S06] 🔊 /s/ /z/ cuối (claims, argues) | |
| 20 | AWL sublist 6 + Transport vòng 2 [VB6 VC11] | Task 1 table 2 — bảng 2 chiều nhiều số [W11] | 🎧 Part 3 thảo luận đồ án: Matching + Sentence; **giọng NZ** [L05 L12 L14 L17] 🔊 âm yếu hội thoại nhanh [S13] | |
| 21 | Nhượng bộ/đối lập + nguyên nhân–kết quả (ôn G18 VD6) [G29] | Matching features 2 [R04] | 🎧 Đề Listening đủ 40 câu lần 1 của tập, đúng giờ [L03–L06] 🔊 /ð/ trong although/whereas | |
| 22 | Animals, nature & biodiversity [VC24] | Two-part question band 6 + dàn ý 2 câu hỏi [W07 W18] | 🗣 Part 2: Describe an event vòng 2 — kể quá khứ hoàn chỉnh [S05] 🔊 -ed + nối âm | |
| 23 | Mệnh đề danh ngữ; It is + adj + that/to (ôn G21) [G30] | Yes/No/Not Given 2 + suy luận quan điểm, từ cực đoan [R15 R19] | 🗣 Part 3 đánh giá "Is it a good thing that…?" [S06] 🔊 ngữ điệu đối lập [S15] | |
| 24 | Energy & resources + collocation Task 1 [VC25 VD3] | Task 1 mixed charts (bar + line) [W12] | 🎧 Part 4 Summary + Table completion; giọng NZ [L06 L10 L08] 🔊 nhận ra ngữ điệu khi nghe | ✅ Kiểm tra chặng (N19–24) |
| 25 | Cụm danh từ phức + danh hoá mức 1 (ôn G19) [G31] | Summary từ trong bài 2 + Sentence completion [R07 R01] | 🎧 Đề nhỏ Part 3+4, 20 câu + bẫy [L05 L06 L15] 🔊 trọng âm cụm danh từ | |
| 26 | Travel & culture vòng 2 [VC13] | Báo cáo ngắn / tóm tắt số liệu (ứng dụng) + ôn 7 dạng Task 1 [W21 E09] | 🗣 Part 2: Describe an object/activity vòng 2 [S05] 🔊 /l/ cuối, dark l | |
| 27 | Dấu câu + bảng tự soát 6 lượt lần 1 [G32 G43] | Reading đủ 3 passage 60 phút lần 2 [R20] | 🗣 Fluency 2: không im > 3 giây, tự sửa đúng cách; ghi âm tự chấm [S09 S10] 🔊 tự chẩn lại 44 âm | |
| 28 | Language, culture & identity + từ dễ nhầm [VC26 VD5] | Task 1 process + map band 6 [W13 W14] | 🎧 Part 2 + Part 4 giọng trộn, Short answer [L04 L06 L14] | |
| 29 | Causative + ôn tổng ngữ pháp Tập 3 (bảng 24 điểm) [G34] | Chiến thuật 900 từ/20 phút, đọc bố cục, Passage 3 lần đầu [R20] | 🎧 Đề Listening 40 câu lần 2, 2 phút kiểm [L16] | |
| 30 | 30 idiom tự nhiên + ôn 30 chủ đề flashcard [VD7] | Viết lại 2 bài cũ theo sổ lỗi (rewrite) [W19] | 🗣 Giám khảo AI 14 phút lần 2 [S17] | ✅ Kiểm tra chặng (N25–30) + 🖥️ **Đề 5 = thi cuối Tập 3** (band 6.0) |

### 3.4 Tập 4 — "6.0 → 7.0" (30 ngày; B2 → C1) — ăn ở độ chính xác: lỗi nhỏ, collocation, Passage 3 / Part 4

Mục tiêu đo được cuối tập: Listening ≥ 30/40 (P3+P4 ≥ 14/20) · Reading ≥ 30/40 (Passage 3 ≥ 9/13) · Writing 7.0 (ý kiến rõ suốt bài, ý mở
rộng, đa số câu không lỗi) · Speaking 7.0 (nói dài không gắng sức, từ ít gặp, trọng âm/ngữ điệu band 7) · 6.000 từ · AWL sublist 7–10 trọn.
Khuôn như Tập 3 (bài 3 = nghe khi N mod 4 ∈ {0,1}, nói khi ∈ {2,3}).

| N | Bài 1 | Bài 2 | Bài 3 | Ghi chú |
|---|---|---|---|---|
| 1 | Cụm danh từ phức; mạo từ & danh từ không đếm — lỗi số 1 ở band 6.5 (ôn G04 G10) [G31] | Passage 3 nhập — văn bản nhân văn/khoa học xã hội, bố cục 900 từ/17 phút [R20 R21] | 🎧 Part 1 "quá dễ để sai": chính tả, số nhiều, 10/10 [L03 L16] 🔊 rhythm câu dài | 🖥️ **Đề 6** đầu tập (= `doc-01`/`nghe-01`/`viet-01` hiện có, band 6→7.5) |
| 2 | AWL sublist 7 + Environment vòng 2 [VB7 VC08] | Band 7 trông thế nào — TR mở rộng & chống đỡ, CC, LR, GRA; so 2 bài 6 vs 7 [W01 W19] | 🗣 Part 1 band 7: chi tiết + từ ít gặp [S04 S09] 🔊 sentence stress mang nghĩa [S13] | |
| 3 | Thì trong văn học thuật: HTHT cho xu hướng, QKHT trong tường thuật (ôn G12 G22) | Matching headings 3 + paraphrase ẩn ý [R12 R18] | 🗣 Part 3 band 7: quá khứ–hiện tại–tương lai, discourse markers linh hoạt [S06 S09] 🔊 /ɜː/ /ə/ | |
| 4 | Psychology, happiness & behaviour [VC27] | Opinion band 7 — ý mở rộng 3 tầng, ví dụ cụ thể, không khái quát [W03 W15] | 🎧 Part 2 MCQ dài, phương án paraphrase [L04 L11] | |
| 5 | Participle clauses; bị động + quan hệ rút gọn trong câu học thuật (ôn G24 G26) [G35] | TFNG / YNNG bẫy band 7: "đúng một nửa", so sánh ngầm, số đổi [R05 R15 R19] | 🎧 Part 3 — 4 người nói, Matching ý kiến [L05 L12] 🔊 nuốt /t/ /d/ giữa phụ âm [S14] | |
| 6 | Collocation học thuật verb+noun (conduct research, pose a threat) [VD3 VD9] | Task 1 line 3 — nhiều đường, nhóm xu hướng [W08 W17] | 🗣 Part 2 band 7: Describe a person/place có câu chuyện nhỏ [S05] 🔊 ngữ điệu kể chuyện | ✅ Kiểm tra chặng (N1–6) |
| 7 | Cleft sentences + đảo ngữ (ôn G11) [G36 G37] | Multiple choice Passage 3 (1 & nhiều đáp án) [R10 R11] | 🗣 Part 3 dự đoán tương lai có hedging [S06 G39] 🔊 nối âm /j/ /w/ [S14] | |
| 8 | AWL sublist 8 + Health vòng 2 + Family vòng 2 [VB8 VC09 VC17] | Task 1 bar 3 — stacked / grouped [W09] | 🎧 Part 4 bài giảng 6 phút — Note + Sentence [L06 L18] 🔊 âm yếu chuỗi (should have been) [S13] | |
| 9 | Ngôn ngữ so sánh & dự đoán Task 1 band 7 (ôn G14 G23 G33) | Suy luận & giọng điệu tác giả (ironic, cautious) + văn bản nghệ thuật [R19 R21] | 🎧 Đề nhỏ Part 1+2, 20 câu [L03 L04] 🔊 tone units | |
| 10 | Art, music & creativity + sắc thái từ đồng nghĩa, từ dễ nhầm [VC28 VD5 VD8] | Discussion band 7 — thesis + hai góc + đánh giá [W04] | 🗣 Part 2: Describe an object/activity band 7 — từ ít gặp, idiom tự nhiên [S05 VD7] 🔊 /tʃ/ /dʒ/ /tr/ /dr/ | |
| 11 | Mệnh đề danh ngữ & verb pattern trong câu phức dài không lỗi (ôn G15 G30) | Note completion 2 — Passage 3 [R08] | 🗣 Part 3 "To what extent…" có mức độ + chống đỡ [S06] 🔊 trọng âm tương phản | |
| 12 | Ngôn ngữ Task 1 band 7: nhóm số liệu, ngoại lệ, tỉ lệ [VC05 W17] | Cohesion band 7 — referencing this/such, không lạm dụng từ nối; viết lại đoạn [W16 G40] | 🎧 Part 3 Flow-chart + bẫy đổi ý, paraphrase nặng [L05 L09 L15] | ✅ Kiểm tra chặng (N7–12) |
| 13 | Hedging & impersonal passive; cohesion nâng cao (referencing, substitution, ellipsis) (ôn G03 G28) [G39 G40] | Reading đủ 3 passage 60 phút lần 1 [R20] | 🎧 Part 4 Table + Summary [L06 L08 L10] 🔊 âm cuối trong chuỗi từ | |
| 14 | AWL sublist 9 + Volunteering vòng 2 + Money vòng 2 [VB9 VC04 VC14] | Advantages/disadvantages band 7 — đánh giá "outweigh" rõ [W05] | 🗣 Part 2 Describe an event band 7 + Part 3 nối tiếp [S05 S06] 🔊 ngữ điệu liệt kê | |
| 15 | Từ nối band 7 — đúng liều, cấp câu vs đoạn; cause–effect tinh (ôn G18 G29) [VD6] | Matching sentence endings 2 + paraphrase nâng cao [R14 R18 VD4] | 🗣 Part 3 nguyên nhân–hệ quả, lập luận chuỗi [S06] 🔊 pause mang nghĩa | 🖥️ **Đề 7** (giữa tập, band 6.5) |
| 16 | Ageing, population & migration [VC29] | Task 1 table 3 — so sánh chéo nhiều chiều [W11] | 🎧 Part 2 Map phức — nhiều tầng, phương hướng [L04 L13] 🔊 /h/ rơi trong he/his nhanh | |
| 17 | Tường thuật học thuật (According to X, it is argued that…) + causative (ôn G27 G34) | Flow-chart / Diagram Passage 3 kỹ thuật [R02 R16] | 🎧 Đề nhỏ Part 3+4, 20 câu [L05 L06] 🔊 trọng âm từ 4–5 âm tiết | |
| 18 | Idiom & register — lúc nào dùng (Speaking) / không dùng (Writing) [VD7 VD8] | Task 1 pie 3 — nhiều pie, so sánh chéo [W10] | 🗣 Part 3 band 7: ví dụ cá nhân vs xã hội; paraphrase nâng cao [S06 S10] 🔊 ngữ điệu thái độ [S15] | ✅ Kiểm tra chặng (N13–18) |
| 19 | Mixed conditionals; provided that / as long as (ôn G25) [G38] | Matching information 3 — Passage 3 [R13] | 🗣 Part 3 giả định & phản thực tế [S06] 🔊 would've trong câu dài | |
| 20 | AWL sublist 10 + Technology vòng 2 [VB10 VC10] | Kịch bản thuyết trình 3 phút + tóm tắt [W21 E06] | 🎧 Part 4 bài giảng 8 phút — ghi chú kiểu Cornell [L06 L18] | |
| 21 | Danh hoá mức 2 vs động từ; register; dấu câu; tự soát 6 lượt lần 2; Academic Phrasebank [G41 G32 G43 VD9] | Reading 3 passage 60 phút lần 2 + văn bản kinh tế [R20 R21] | 🎧 **Giọng Scotland / Ireland** Part 1+2 [L17 L03 L04] 🔊 ngữ điệu giọng vùng | |
| 22 | Children, parenting & gender roles [VC30] | Problem/solution band 7 — đánh giá tính khả thi [W06] | 🗣 Thuyết trình 3 phút + Q&A [S16 E06 VD7] 🔊 chunking bài nói dài [S15] | |
| 23 | Ngữ pháp nói band 7: câu phức trong nói, ellipsis, tags [G44] | Matching features 3 [R04] | 🗣 Part 3 trừu tượng: giá trị, đạo đức, công nghệ & xã hội [S06] 🔊 từ trừu tượng dài | |
| 24 | Collocation Task 1 & 2 nâng cao (adj+noun, adv+adj) [VD3] | Task 1 table + mixed 3 nguồn; tóm tắt bài giảng [W11 W12 W21 E09] | 🎧 Bài giảng 10 phút + Matching [L06 L12 L18] | ✅ Kiểm tra chặng (N19–24) |
| 25 | Đọc hiểu câu phức Passage 3: chuỗi thì & bị động (ôn G22 G24) | Summary 3 — Passage 3 (hộp từ & từ trong bài) [R06 R07] | 🎧 Đề Listening 40 câu lần 1 của tập — mục tiêu 30+ [L16] | |
| 26 | Food vòng 2 + Media vòng 2 [VC12 VC15] | Cover letter + email formal nâng cao [W21 E03] | 🗣 Part 2 band 7 đề trừu tượng (a law, a piece of advice) [S05] 🔊 tốc độ tự nhiên | |
| 27 | Subjunctive & formal structures; fronting [G42] | Reading 3 passage 60 phút lần 3 — Passage 3 ≥ 9/13 [R20] | 🗣 Full 14 phút tự thu, tự chấm 4 tiêu chí [S17] 🔊 tự chẩn 44 âm | |
| 28 | Ôn AWL 7–10 + 12 chủ đề vòng 2 (Match) [VB7–10] | Two-part band 7 + quản lý 60 phút + 12 lỗi ở band 7 [W07 W18 W20 X04 X08] | 🎧 Đề nhỏ Part 3+4 + bẫy [L05 L06 L15] | |
| 29 | Ôn tổng ngữ pháp Tập 4 (bảng 20 điểm C1) [G35–G42] | Chiến thuật band 7: thứ tự passage theo độ khó cá nhân [R19 R20 X03] | 🎧 Đề Listening 40 câu lần 2 [L16] | |
| 30 | Ôn 30 chủ đề Part 1 + idiom [S07 VD7] | Viết lại 3 bài theo sổ lỗi — mục tiêu ≤ 3 lỗi/bài [W19] | 🗣 Giám khảo AI 14 phút [S17 X05] | ✅ Kiểm tra chặng (N25–30) + 🖥️ **Đề 8 = thi cuối Tập 4** (band 7.0) |

### 3.5 Tập 5 — "7.0 → 8.0" (30 ngày; C1 vững) — độ chính xác tuyệt đối, 4 đề thi đủ, luyện giám khảo AI

Mục tiêu đo được cuối tập: Listening ≥ 35/40 · Reading ≥ 35/40 (3 đề liên tiếp) · Writing 8.0 (lỗi 0–1/bài, cohesion tự nhiên, từ chính xác) ·
Speaking 8.0 (ngắt vì nội dung, idiom khéo, giọng mẹ đẻ ảnh hưởng tối thiểu) · AWL 570 họ chủ động · 100 từ band 8 dùng đúng chỗ.
Nhịp: 4 đề đủ (N8 · N16 · N24 · N30), ngày sau đề là ngày **mổ đề** (phân tích từng câu sai). Khuôn như Tập 3.

| N | Bài 1 | Bài 2 | Bài 3 | Ghi chú |
|---|---|---|---|---|
| 1 | Ngữ pháp band 8: kiểm soát thì tuyệt đối, hedging, danh hoá — "nhiều cấu trúc, đa số không lỗi" (ôn G22 G39 G41) [W01 X07] | Reading band 8: 900 từ/15 phút, đọc một lần [R20] | 🎧 Part 1 tốc độ thật, giọng trộn [L03 L17] 🔊 flap / glottal nhận biết | |
| 2 | Ôn trọn AWL 570 (bộ flashcard "AWL 570") + Government vòng 2 + Art vòng 2 + collocation tinh [VB1–10 VC20 VC28 VD3] | Band 8 trông thế nào — so 7 vs 8; tự chấm [W01 W19 VD8] | 🗣 Band 8 Speaking: ngắt vì nội dung, không vì ngôn ngữ [S01] 🔊 tone units | |
| 3 | Lỗi dai dẳng cá nhân: SVA, mạo từ, giới từ — truy từ sổ lỗi [G43] | TFNG band 8 — câu 40 từ, suy luận [R05 R19] | 🗣 Part 1 band 8: tự nhiên, idiom khéo [S04 VD7] 🔊 nguyên âm đôi giảm giọng mẹ đẻ | |
| 4 | 100 từ tần suất thấp đáng giá band 8 (phần 1) [VA5] | Opinion band 8 — lập luận sâu, ví dụ liên quan, không khái quát [W03] | 🎧 Part 2+3 tốc độ thật, 4 người nói [L04 L05] | |
| 5 | Câu phức nhiều tầng không lỗi: participle + relative + noun clause (ôn G26 G30 G35) | Matching headings 4 — bài trừu tượng [R12] | 🎧 Part 4 bài giảng chuyên sâu 8 phút [L06] 🔊 nối âm chuỗi [S14] | |
| 6 | Paraphrase & sắc thái band 8 [VD4 VD8] | Task 1 mixed charts band 8 [W12] | 🗣 Part 3 band 8: phản biện, nhượng bộ, hedging [S06 G39] 🔊 ngữ điệu thái độ [S15] | ✅ Kiểm tra chặng (N1–6) |
| 7 | Bị động + rút gọn trong Task 1 process (vòng 3 G24 G26 G35) + Phrasebank [VD9] | Short answer & sentence completion Passage 3 [R09 R01] | 🗣 Part 2 band 8 — người/nơi với chi tiết cảm quan [S05] 🔊 giọng kể | |
| 8 | Crime vòng 2 + Business vòng 2 + Ageing vòng 2 [VC19 VC23 VC29] | Writing Đề 9 — Task 1 + Task 2 trong 60 phút | 🎧 Listening Đề 9 | 🖥️ **Đề 9** (band 7.0–7.5; Reading + Speaking làm trong `thi-may`) |
| 9 | Parallelism, dangling modifiers; câu dài vẫn rõ [G43 G32] | Yes/No/Not Given + Headings band 8 [R15 R12] | 🎧 Mổ Đề 9: từng câu sai → sổ lỗi [L16] | |
| 10 | Academic Phrasebank nâng cao [VD9] | Discussion band 8 — đánh giá hai góc & lập trường tinh [W04] | 🗣 Mổ Speaking Đề 9 theo 4 tiêu chí [S06 S17] | |
| 11 | Ngữ pháp nói band 8 — cấu trúc phức tự nhiên, ellipsis [G44] | Thể loại khó: triết học / kinh tế học, 900 từ/15 phút [R20 R21] | 🗣 Idiom & từ ít gặp dùng khéo [VD7 S10] 🔊 trọng âm chuỗi | |
| 12 | Từ vựng Part 4 học thuật: sinh học, địa chất, tâm lý, kinh tế | Task 1 process band 8 — quy trình 2 giai đoạn [W13] | 🎧 Part 4 Summary band 8 + Part 3 bẫy [L06 L10 L05] | ✅ Kiểm tra chặng (N7–12) |
| 13 | Cleft / inversion / cohesion / concession trong Task 2 band 8 — dùng vừa đủ (vòng 3 G29 G36 G37 G40) | Reading 3 passage 55 phút [R20] | 🗣 Part 3 trừu tượng cấp cao: triết lý, chính sách [S06] 🔊 pause mang nghĩa | |
| 14 | Sport vòng 2 + History vòng 2 + Psychology vòng 2 [VC16 VC22 VC27] | Task 2 trộn dạng — nhận dạng đề lạ, chọn khung [W03–W07] | 🗣 Part 2 band 8 đề hiếm (a time you changed your mind) [S05] | |
| 15 | Register & tone: formal / neutral / informal trong Viết & Nói [G41 VD8] | Matching features / information band 8 [R04 R13] | 🎧 Bẫy nghe band 8: số liệu đổi, phủ định kép [L15] | |
| 16 | Ôn 30 chủ đề (Match 300 từ) [VC01–30] | Advantages/disadvantages band 8 [W05] | 🎧 Listening Đề 10 | 🖥️ **Đề 10** (band 7.5) |
| 17 | Chuỗi lỗi 7→8: mạo từ, số nhiều, giới từ, dấu phẩy (vòng 3 G04 G10 G11) [G43] | Mổ Reading Đề 10 — paraphrase từng câu sai [R18] | 🗣 Part 2 nơi chốn/sự kiện band 8 + Part 3 nối [S05 S06] 🔊 ngữ điệu kể chuyện band 8 [S15] | |
| 18 | Idiom & sắc thái vòng cuối [VD7 VD8] | Task 1 map band 8 [W14] | 🗣 Đàm phán & phản biện lịch sự; hedging giao tiếp [S16 E10] | ✅ Kiểm tra chặng (N13–18) |
| 19 | Mixed conditionals, subjunctive, dấu câu vòng 3 [G38 G42 G32] | Reading 3 passage 55 phút lần 2 [R20] | 🎧 Đề nhỏ Part 3+4 tốc độ thật [L05 L06] | |
| 20 | Science vòng 2 + Animals vòng 2 + Children vòng 2 [VC21 VC24 VC30] | Problem/solution band 8 [W06] | 🎧 Part 4 bài giảng 10 phút, giọng vùng [L06 L17] | |
| 21 | 3 cấu trúc hiếm dùng đúng chỗ trong Part 3 [G36 G37 G42 G44] | Chiến thuật band 8: đọc 1 lần, không quay lại; 55 phút [R20 X03] | 🎧 Podcast / tin tức tốc độ thật, giọng vùng [E08 L17 L18] | |
| 22 | Từ vựng cho đề Task 2 lạ: ethics, AI, space, genetics | Bài phản biện học thuật 300 từ [W21 E09] | 🗣 Mổ Speaking Đề 10 + paraphrase tinh [S06 S10 S17] | |
| 23 | Bảng tự soát 6 lượt lần 3 → lỗi 0–1 [G43] | Suy luận band 8 & bẫy cuối [R19 R05] | 🗣 Part 3 phản biện giám khảo khéo [S06] 🔊 nối âm chuỗi band 8 | |
| 24 | Ôn AWL + 30 chủ đề (Match) | Writing Đề 11 | 🎧 Listening Đề 11 | 🖥️ **Đề 11** (band 8.0) · ✅ Kiểm tra chặng (N19–24) |
| 25 | Ôn lỗi từ Đề 11 [G43] | Mổ Reading Đề 11 | 🎧 Mổ Listening Đề 11 + 2 phút kiểm [L16] | |
| 26 | Energy vòng 2 + Language vòng 2 [VC25 VC26] | Sprint Task 1: 7 dạng × 20 phút [W08–W14] | 🗣 Sprint Part 2: 12 đề hay gặp, 1 phút chuẩn bị [S05 S08] | |
| 27 | Ôn tổng ngữ pháp 5 tập (bảng 44 điểm) [G01–G44] | Reading 3 passage 55 phút lần 3 — mục tiêu 35+ [R20] | 🗣 Sprint Part 3: 12 đề [S06 S08] | |
| 28 | 100 từ band 8 (phần 2) [VA5] | Two-part band 8 + quản lý thời gian lần cuối [W07 W18] | 🎧 Đề Listening 40 câu — mục tiêu 35+ [L16] | |
| 29 | Ngày thi: giấy tờ, thứ tự, tâm lý, EOR; khi lỡ câu / lạc đề [X06 X08] | Checklist 16 dạng Reading — 1 câu/dạng [R01–R16] | 🎧 Checklist 14 dạng Listening [L07–L14] | |
| 30 | Tổng kết từ vựng: "nhớ sau 7 ngày" ≥ 90 % | Viết lại bài yếu nhất + tự chấm [W19] | 🗣 Giám khảo AI 14 phút lần cuối [S17] | ✅ Kiểm tra chặng (N25–30) + 🖥️ **Đề 12 "Final"** (band 8.0) |

---

## 4. Đề thi thử kiểu máy tính (`thi-may`) + test đầu vào

### 4.1 Khuôn một đề đủ 4 kỹ năng (mọi đề từ Đề 1 trở đi)

| Kỹ năng | Dạng | Thời gian | Chấm |
|---|---|---|---|
| Listening | 4 Part × 10 câu (P1 hội thoại giao dịch · P2 độc thoại đời sống · P3 thảo luận học thuật 2–4 người · P4 bài giảng), phát 1 lần, lời dẫn băng, bản máy: 2 phút kiểm cuối | 30' + 2' | tự động, điểm thô → band (mục 1.4) |
| Reading | 3 passage (~700 / 800 / 900 từ), 40 câu, ≥ 6 dạng/đề, cả 16 dạng xuất hiện qua 3 đề liên tiếp | 60' | tự động |
| Writing | Task 1 (`figure`: 7 dạng xoay vòng) + Task 2 (5 dạng xoay vòng), đếm từ, 20/40' | 60' | AI 4 tiêu chí (`/ielts/thi-may/cham-viet`) — band từng tiêu chí + sửa lỗi + bản viết lại band +1 |
| Speaking | Giám khảo AI: Part 1 (3 chủ đề, 4–5') · Part 2 (cue card, 1' chuẩn bị + 2' nói, 1 câu nối) · Part 3 (4–6 câu, 4–5') — dùng `/ielts/ai/tro-chuyen/luong` + `/cham` | 11–14' | AI 4 tiêu chí + Azure phát âm từng âm |

Kiến trúc dữ liệu: thêm `thi-may/de/noi-XX.ts` (kiểu `DeNoi`: `part1: {chuDe, cauHoi[]}[]`, `part2: {cueCard, goiY[], cauNoi}`, `part3: string[]`,
`bandMucTieu`), mục lục `MUC_LUC` thêm `kyNang: 'noi'`; **bộ đề** (`boDe`) gom 4 tệp L/R/W/S thành "Đề N" để người học chọn **Thi đủ đề** (4 kỹ
năng liên tục, nghỉ 10' trước Speaking) hoặc từng kỹ năng. Kết quả lưu `/ielts/thi-may/luot` + band tổng theo 1.5; câu sai tự vào `so-loi`.

### 4.2 Kế hoạch 12 đề — độ khó tăng dần, rải theo tập

| Đề | Mức (band) | Vị trí | Reading: thể loại 3 passage · dạng trọng tâm | Listening: P1–P4 bối cảnh | Writing T1 / T2 | Speaking chủ đề P1 · P2 |
|---|---|---|---|---|---|---|
| **0** | 4.0–8.0 (bậc thang) | Test đầu vào (mục 4.3) | xem 4.3 | xem 4.3 | bar chart đơn / Opinion | Work-Study, Hometown · Describe a person |
| 1 | 3.5–4.5 | cuối Tập 1 (N15) | Đời sống đô thị · Giáo dục · Công nghệ dễ · Sentence/Table/Flow-chart/TFNG/Matching features/Summary box | đăng ký thư viện · thông báo xe buýt · 2 SV chọn đề tài · bài giảng "giấc ngủ" | line (ôn W08) / Opinion | Daily routine, Family · Describe a place you like |
| 2 | 4.5 | Tập 2 N12 | Môi trường · Sức khoẻ · Giao thông · + Note/Short answer/MCQ/Headings | đặt phòng · hướng dẫn bảo tàng (map) · nhóm đồ án · bài giảng "ong mật" | bar / Discussion | Hobbies, Weather · Describe an object |
| 3 | 5.0 | thi cuối Tập 2 (N24) | Du lịch · Truyền thông · Thể thao · + Matching info/endings · YNNG · Diagram | khoá học buổi tối · tour thành phố · phỏng vấn SV · bài giảng "thuỷ triều" | pie / Advantages–disadvantages | Food, Travel · Describe an event |
| 4 | 5.5 | Tập 3 N15 | Tội phạm · Khoa học vũ trụ · Lịch sử | thuê xe (giọng US) · bản đồ khu bảo tồn · thảo luận bài báo · bài giảng "ngôn ngữ trẻ em" (CA) | table / Problem–solution | Shopping, Technology · Describe a skill |
| 5 | 6.0 | thi cuối Tập 3 (N30) | Kinh tế · Sinh học · Ngôn ngữ (Passage 3 ~900 từ) | bảo hiểm · trung tâm cộng đồng · nhóm nghiên cứu 3 người · bài giảng "nông nghiệp đô thị" (NZ) | process / Two-part | Music, Sleep · Describe a change |
| 6 | 6.0–7.5 | đầu Tập 4 (N1) — **đã có**: `doc-01` · `nghe-01` · `viet-01` + soạn thêm `noi-06` | Mangroves · Shipping container · Boredom | Paddle club · Market hall map · Urban heat · Reef sounds | bar (commuting) / Discussion (university purpose) | Art, Neighbours · Describe a decision |
| 7 | 6.5 | Tập 4 N15 | Tâm lý · Nghệ thuật · Dân số (Passage 3 trừu tượng) | hội thảo · toà nhà mới (map tầng) · 4 người đánh giá đồ án · bài giảng "trí nhớ" (Scotland) | line nhiều đường / Opinion | Books, Time management · Describe a rule |
| 8 | 7.0 | thi cuối Tập 4 (N30) | Kinh tế học hành vi · Khảo cổ · Năng lượng | chuyển nhà (Ireland) · hướng dẫn lễ hội · thảo luận luận văn · bài giảng "đô thị thông minh" | mixed / Advantages–disadvantages | Plants, Noise · Describe a piece of advice |
| 9 | 7.0–7.5 | Tập 5 N8 | Triết học khoa học · Di truyền · Toàn cầu hoá | tốc độ thật, giọng trộn | map / Problem–solution | Photography, Celebrations · Describe a time you changed your mind |
| 10 | 7.5 | Tập 5 N16 | AI & đạo đức · Địa chất · Ngôn ngữ học | tốc độ thật | table + pie / Two-part | Colours, Weekends · Describe a tradition |
| 11 | 8.0 | Tập 5 N24 | Kinh tế vĩ mô · Thần kinh học · Lịch sử nghệ thuật | tốc độ thật, nhiễu nền nhẹ | process 2 giai đoạn / Discussion | Numbers, Clothes · Describe an achievement |
| 12 | 8.0 "Final" | thi cuối Tập 5 (N30) | 3 passage trộn thể loại, đủ 16 dạng | 4 Part đủ 14 dạng | mixed / Opinion (đề lạ) | random từ ngân hàng S07/S08 |

Quy tắc soạn đề: không chép đề thật; mỗi đề qua `frontend/src/lib/ielts/thiMayCham.test.ts` (đáp án có trong bài, `ev` là chuỗi con thật, 1–40
liên tục, đáp án chuẩn 40/40); độ khó định bằng (a) độ dài/độ hiếm từ (dải tần suất), (b) mức paraphrase (đồng nghĩa → đổi loại từ → đổi cấu trúc
→ ý ẩn), (c) tốc độ nói (wpm: Đề 1–3 ≈ 130, Đề 4–6 ≈ 150, Đề 7–9 ≈ 165, Đề 10–12 ≈ 180) và (d) tỉ lệ câu bẫy. Giọng TTS: mỗi đề ≥ 3 giọng (`uk-nu`,
`uk-nam`, `us-nu`, `us-nam`; cần thêm `au-*`, `ca-*`, `nz-*`, `sco-*`, `ie-*` ở máy chủ — xem mục 5.3).

### 4.3 Test đầu vào (Đề 0) — "độ khó trải 4.0–8.0" + quy tắc xếp lớp

**Mục tiêu**: 2 giờ 45 phút đo cả 4 kỹ năng, đặt người học vào đúng **tập + ngày**, không làm nản người mất gốc.

**Cấu trúc bậc thang** (mỗi phần khó dần, để người yếu vẫn ghi được điểm ở phần đầu):

| Phần | Thời gian | Thiết kế |
|---|---|---|
| **Sàng lọc 10'** (trước Listening) | 10' | 25 câu MCQ ngữ pháp + từ vựng A1→B2 (5 câu/mức: A1, A2, B1, B1+, B2) + 1 đoạn đọc 120 từ 5 câu TFNG. **Dưới 10/30 ⇒ dừng**, xếp **Tập 1 Ngày 1** ngay, không làm tiếp (tránh 2 giờ ngồi đoán). |
| Listening | 30' + 2' | P1 giao dịch chậm 130 wpm (mức 4.0) · P2 độc thoại map (5.0) · P3 thảo luận 3 người (6.0–6.5) · P4 bài giảng 165 wpm (7.0–8.0). 40 câu, 10 dạng. |
| Reading | 60' | Passage 1 ~600 từ mức 4.0–5.0 (Sentence/Table/TFNG) · Passage 2 ~800 từ mức 6.0 (Headings/Matching info/Summary) · Passage 3 ~900 từ mức 7.0–8.0 (YNNG/MCQ nhiều đáp án/Matching endings). |
| Writing | 60' | Task 1 bar chart 1 nhóm (ai cũng mô tả được) · Task 2 Opinion về chủ đề quen (online learning). AI chấm 4 tiêu chí; **< 100 từ Task 2 ⇒ band Writing = 3.0**. |
| Speaking | 11–14' | Giám khảo AI: Part 1 Work/Study + Hometown (6 câu) · Part 2 Describe a person you admire · Part 3 (4 câu, khó dần: fact → opinion → compare → hypothesise). Không nói được 20 giây ⇒ AI chuyển câu, band 3.0. |

**Tính band**: L/R theo 1.4; W/S = AI (trung bình 4 tiêu chí, làm tròn .5 xuống); **Overall** theo 1.5. Thêm **band ngữ pháp** = % sàng lọc (≥ 80 % B2
đúng → "GRA sẵn cho Tập 4").

**Quy tắc xếp lớp** (áp theo thứ tự, luật đầu tiên khớp thì dừng):

| # | Điều kiện | Xếp vào |
|---|---|---|
| 1 | Sàng lọc < 10/30, HOẶC Overall < 3.5, HOẶC L **và** R đều < 8/40 | **Tập 1 Ngày 1** |
| 2 | Overall 3.5–4.0 và sàng lọc < 20/30 | **Tập 1 Ngày 7** (ôn Tập 1 nửa sau, làm `d6-kiem-tra` trước) |
| 3 | Overall 3.5–4.0 và sàng lọc ≥ 20/30 | **Tập 2 Ngày 1** |
| 4 | Overall 4.5 | **Tập 2 Ngày 13** (làm kiểm tra chặng N12 trước; < 70 % ⇒ lùi N7) |
| 5 | Overall 5.0 | **Tập 3 Ngày 1** |
| 6 | Overall 5.5 | **Tập 3 Ngày 16** (làm kiểm tra chặng N12 trước) |
| 7 | Overall 6.0 | **Tập 4 Ngày 1** (+ Đề 6 là bài đầu tiên) |
| 8 | Overall 6.5 | **Tập 4 Ngày 16** |
| 9 | Overall 7.0 | **Tập 5 Ngày 1** |
| 10 | Overall 7.5 | **Tập 5 Ngày 16** |
| 11 | Overall ≥ 8.0 | **Tập 5 "chỉ luyện đề"**: Đề 9–12 + ngày mổ đề; gợi ý đăng ký thi |

**Luật kỹ năng lệch** (áp thêm sau khi xếp): kỹ năng nào thấp hơn Overall ≥ 1.0 band ⇒ gắn **"đường ôn kèm"** = các bài cùng kind của tập ngay
dưới (ví dụ xếp Tập 4 nhưng Writing 5.0 ⇒ thêm 15 bài Writing của Tập 3 vào lịch, 1 bài/ngày trước bài chính). Lệch ≥ 2.0 ⇒ xếp theo kỹ năng
yếu nhất thay vì Overall. Mọi kết quả ghi "ước tính"; hiện bảng 4 kỹ năng + bản đồ 44 âm (Azure) + 5 dạng câu hỏi sai nhiều nhất ⇒ 3 dòng
"bắt đầu từ đâu, vì sao".

**Làm lại test đầu vào**: cho phép mỗi 30 ngày; kết quả mới chỉ **đẩy lên**, không kéo xuống (người học đang ở N20 Tập 3 không bị lùi).

---

## 5. Soát lỗ hổng phần đã có (Tập 1 Ngày 1–6, mục lục 7–15, công cụ) — kèm đề xuất sửa có ưu tiên

Đếm thật trên mã ngày 12/11/2026 (`node` đếm `t: '…'` trong `data.ts` + `ngay/ngay2..6.ts`):

| Khối | N1 | N2 | N3 | N4 | N5 | N6 | Nhận xét |
|---|---|---|---|---|---|---|---|
| `sodo` / `hinh` / `canh` / `figure` | 0 | 0 | 0 | 0 | 0 | 0 | **Không có hình/sơ đồ nào** dù khung đã có từ 12/11 và người học yêu cầu |
| `chart` (cũ) | 0 | 0 | 0 | 2 | 0 | 0 | Task 1 Ngày 4 dùng khối cũ `chart` (chỉ line/bar), chưa `figure` |
| `phatam` | 1 | 1 | 1 | 1 | 1 | 2 | Đủ 1/ngày ✓ (N6 có 1 trong kiểm tra) |
| `listen` | 0 | 0 | 1 | 0 | 2 | 1 | N1 nghe bảng chữ cái dùng `dictation`/`alphabet` — chưa có bài nghe có lời dẫn |
| `speak` | 0 | 3 | 0 | 1 | 0 | 2 | ngày lẻ không nói — đúng khuôn, nhưng Part 2/3 chỉ "giới thiệu" ở N2 |
| `essay` | 0 | 1 | 0 | 1 | 0 | 3 | ✓ |
| `passage` | 0 | 6 | 0 | 1 | 0 | 2 | ✓ (N2 là 6 đoạn ví dụ ngắn) |
| `vocab` | 2 | **0** | 2 | 1 | 2 | 1 | **N2 không có khối `vocab`** ⇒ từ của N2 không vào flashcard/tra từ |
| Giọng TTS | uk-nu 12 · uk-nam 11 | | | | | | **Chưa có giọng US/AU** dù `Voice` đã có `us-nu`/`us-nam` |

### 5.1 Lỗ hổng NỘI DUNG Tập 1 (ưu tiên P0 = làm trước khi soạn tiếp, P1 = trong đợt 7–15, P2 = sau)

| # | Ưu tiên | Lỗ hổng | Đề xuất sửa cụ thể |
|---|---|---|---|
| 1 | **P0** | Ngày 1–6 không có `sodo`/`hinh`/`canh`/`figure` (0/6 ngày) — trái yêu cầu "bài có tranh, từ có tranh, sơ đồ" đang áp cho Ngày 7–15 | Vá ngược mỗi ngày ≥ 1 `sodo` (N1 `timeline` hiện tại đơn; N2 `flow` 2 bước từ khoá + `compare` 3 Part Speaking; N3 `mindmap` 7 loại đại từ; N4 `flow` 9 bước Sentence Completion + `figure` line thay `chart`; N5 `compare` đếm được/không; N6 `flow` 6 bước Flow-chart + `flow` mở bài 5 bước). `hinh` cho từ cụ thể (N1 mạng xã hội, N5 office/computer…), `canh` trước mỗi `dialogue`. |
| 2 | **P0** | Chỉ có 1 kiểm tra chặng (`d6-kiem-tra`); SOAN-BAI hứa giữa khoá + cuối khoá | Thêm `d12-kiem-tra` (N7–12) và `d15-kiem-tra` (N13–15) + 🖥️ **Đề 1** band 3.5–4.5 trong `thi-may` (hiện kho đề chỉ có mức 6→7.5 — người học Tập 1 không có đề nào vừa sức). |
| 3 | **P0** | Speaking Part 2 **không được luyện** ở Tập 1 (N2 giới thiệu; N14 "Kể lại trải nghiệm" vẫn là Part 1) ⇒ Đề 1 không thể có Part 2 | N10 (Part 1 Thói quen) thêm mục "Part 2 nhập: Describe your daily routine — 1 phút" (cue card 4 dòng, nói 1 phút); N14 nâng thành Part 2 "Describe a past experience" 1,5 phút. Part 3 để Tập 2. |
| 4 | **P1** | Ngữ pháp Tập 1 thiếu những điểm A2 mà band 4.0 cần: **will / be going to**, **so sánh hơn/nhất**, **there is/are**, **in/on/at**, mạo từ **the** (N5 chỉ a/an/some/any) | N7 (Tính từ & trạng từ) thêm mục "So sánh hơn/nhất cơ bản"; N9 thêm "Tương lai will/be going to nhập"; N11 ("Kết hợp N–V–Adj" đang mỏng) thêm "there is/are + in/on/at"; N5 thêm "the — lần hai, duy nhất". Tập 2 vẫn dạy sâu (G10 G13 G14) — đúng xoắn ốc. |
| 5 | **P1** | N2 Reading nói "8 dạng câu hỏi phổ biến" — IELTS có 14 dạng (16 tính biến thể, `TEN_DANG` trong `thi-may/de/types.ts` đã liệt kê đủ) | Sửa thành bảng 14 dạng + cột "học ở Ngày/Tập nào" (R01–R16 mục 2.3) để người học thấy lộ trình. |
| 6 | **P1** | Homework N2 = 16 câu, N6 = 10 câu (< 30 câu theo khuôn); N3 (42) N4 (48) N5 (22) | Bổ sung: N2 thêm 10 câu "từ khoá loại nào" + 5 dịch; N6 thêm 10 dịch (khung mở bài) + 10 mcq; N5 thêm 8 câu quantifiers. |
| 7 | **P1** | N2 không có `vocab` ⇒ 0 từ vào flashcard; `vocabAll`/`the-tu` bộ "khoá" tên cứng "Ngày 1–6" | N2 thêm `vocab` 15 từ về bài thi (passage, heading, paraphrase, synonym, band, criterion…). `the-tu/boTu.ts` lấy tên theo số ngày trong manifest. |
| 8 | **P1** | Giọng nghe: 100 % UK (uk-nu/uk-nam) — L17 chưa bắt đầu; N7–15 đang soạn có thể lặp | Từ N7: mỗi `listen` ≥ 2 giọng, N9 (Part 2) dùng `us-nu`, N13 (Part 4) `us-nam`; máy chủ thêm giọng AU/CA/NZ/IE (Azure neural `en-AU-NatashaNeural`, `en-CA-ClaraNeural`, `en-NZ-MollyNeural`, `en-IE-EmilyNeural`, `en-GB-…` cho Scotland không có ⇒ ghi chú dùng IE thay). |
| 9 | **P1** | `LATER` N7 "Từ vựng Làm việc từ xa (tiếp)" lặp chủ đề N5 | Đổi thành "Work & careers (tiếp): nghề nghiệp, tuyển dụng, thăng tiến" (mở rộng VC03, 20 từ mới không trùng). |
| 10 | **P1** | `tracuu.ts` chỉ có công thức Ngày 1/3/5 + khung câu N2/4/6; N7–15 soạn mà không cập nhật là tra cứu thủng | Mỗi ngày N7–15 có `h` + `patterns` + `rule` thêm vào `tracuu.ts` (quy tắc SOAN-BAI §3 — nhắc lại trong báo cáo agent); từ Tập 2 tách `tracuu` theo tập, gộp hiện "Tất cả". |
| 11 | **P1** | `videos.ts` 24 video chỉ Ngày 1–6 | N7–15 theo quy trình `reference_tim_video_youtube_cho_bai_hoc` sau khi nội dung xong. |
| 12 | **P2** | N4 phát âm 11 nguyên âm, N6 8 nguyên âm đôi dạy bằng `table` + 1 `phatam` — kiểm `phatam` có đủ 11/8 âm không; 24 phụ âm mới có -s/-es, âm cuối, /ð/ | Lịch phụ âm Tập 1: N8 /θ ð/, N10 /s ʃ tʃ dʒ/, N12 /r l/, N14 /v w f/ (đã ghi 3.1); còn lại Tập 2 N1/N5/N9 (S11). Mỗi `phatam` ≥ 8 từ, có cặp tối thiểu. |
| 13 | **P2** | id kiểm tra `kt1-*` không theo quy ước `dN-…` | Giữ (đổi id mất điểm cũ) nhưng ghi ngoại lệ vào SOAN-BAI; chặng mới dùng `d12-kt-…`. |
| 14 | **P2** | N11 "Từ vựng: Biểu đồ theo thời gian 1" thực chất là ngôn ngữ Task 1 (W17) đặt ở kind `vocab` | Giữ kind, nhưng bài phải có `figure` line + 20 từ/cụm (rise/fall/fluctuate/peak…) dạng `vocab` để vào flashcard. |

### 5.2 Lỗ hổng CÔNG CỤ

| # | Ưu tiên | Lỗ hổng | Đề xuất |
|---|---|---|---|
| 15 | **P0** | `thi-may` không có **Speaking** (`kyNang` chỉ doc/nghe/viet) ⇒ không có band tổng, không "thi đủ đề"; backend `/ielts/ai/tro-chuyen` đã có nhưng không có trang nào trong thư mục `ielts/` gọi | Thêm `PhongNoi.tsx` + `de/noi-XX.ts` (4.1); `MUC_LUC` thêm `boDe` gom 4 tệp = "Đề N"; `cham.ts` thêm band tổng (1.5). Đồng thời là nền cho test đầu vào. |
| 16 | **P0** | Kho đề: 1 đề duy nhất, mức 6→7.5 — không đề nào cho Tập 1–3 | Soạn Đề 1 → 3 (band 3.5–5.0) trước (mục 4.2), Đề 0 test đầu vào ngay sau. |
| 17 | **P0** | Không có **test đầu vào / xếp lớp**: người học mới luôn bắt đầu Ngày 1 | Đề 0 + luật 4.3; trang `/ielts/dau-vao` ghi kết quả vào `/ielts/thi-may/luot` với `loai: 'dau-vao'`, lưu "điểm xếp lớp" trong tiến độ khoá. |
| 18 | **P1** | **Hai phòng thi song song**: `phong-thi` (cũ, đề dựng từ kho `tech-trends`, 3 phần, band theo 4 chặng cũ) và `thi-may` (mới) — người học không biết vào đâu | Khi có Đề 1–3: `phong-thi` chuyển hướng sang `thi-may`; đề dựng từ kho cũ đưa vào `thi-may` dưới nhãn "Luyện theo dạng" (Practice) chứ không phải đề đủ. |
| 19 | **P1** | `luyen-them` (kho 0→7.5 cũ) gắn nhãn 4 chặng (0–4 / 4–5.5 / 5.5–6.5 / 6.5–7.5) **lệch** 5 tập; nội dung tốt (40 bài ngữ pháp chặng 1, question-types chặng 2, collocation chặng 3, lỗi band 7 chặng 4) nhưng không nối với ngày học | Gắn nhãn lại theo tập (chặng 1 ≈ Tập 1–2, 2 ≈ Tập 2–3, 3 ≈ Tập 3–4, 4 ≈ Tập 4–5); mỗi ngày mới có trường `luyenThem: [{stage, id}]` trỏ bài liên quan ("Luyện thêm" cuối bài) thay vì soạn lại. |
| 20 | **P1** | `so-loi` chỉ nhận lỗi từ `thi-may` và từ vựng (`loai: 'tu'`); câu sai trong **bài học** (`quiz`/`mcq`/`translate` hàng trăm câu/ngày) không vào sổ | Bộ khung `sach-hoc` gọi `/ielts/so-loi/ghi` khi nộp sai (kèm `lessonId`, `quizId`, dạng = kind bài); sổ lỗi thêm bộ lọc "theo Ngày". |
| 21 | **P1** | `the-tu`: có bộ học thuật 600 từ/30 chủ đề nhưng **không có AWL theo sublist** (VB1–10) và không gắn ngày học | Thêm bộ "AWL 570 theo sublist" (10 bộ con); bộ "khoá" tự tách theo tập; mục tiêu ngày mặc định 100 → gợi ý theo tập (T1 40, T2 60, T3–5 100). |
| 22 | **P1** | Không có **bảng tiến độ band**: L/R từ đề, W/S từ AI, phát âm Azure, SRS rải 4 trang khác nhau | Trang `/ielts/tien-do`: biểu đồ band 4 kỹ năng theo thời gian (từ `thi-may/luot`), ma trận 44 âm (xanh/vàng/đỏ), 16 dạng Reading × % đúng, 14 dạng Listening × % đúng, từ vựng "nhớ sau 7 ngày", kiểm tra chặng đã đạt; gợi ý "hôm nay nên làm gì" (ôn đến hạn → bài mới → sổ lỗi). |
| 23 | **P2** | Ôn xoắn ốc chỉ có cho từ vựng (SRS); câu dịch/ngữ pháp làm sai không quay lại | "SRS ngữ pháp": câu `translate`/`fill` sai được xếp lịch làm lại sau 3 / 7 / 21 ngày trong mục "Ôn hôm nay" (dùng cùng bảng SRS, `k = quizId#idx`). |
| 24 | **P2** | `figure` tĩnh; Task 1 cần đọc số | `FigureView` thêm hover/tap hiện giá trị, nút "bảng số liệu" (bắt buộc cho người khiếm thị / điện thoại nhỏ). |
| 25 | **P2** | Thiếu chế độ in/PDF cho bài học + đáp án (người học thích ghi tay), và ghi âm Speaking chưa có "nghe lại so với mẫu" | Nút "In bài" (CSS print), trang kết quả Speaking phát mẫu band 7 cùng câu hỏi để shadowing. |

### 5.3 Việc hạ tầng đi kèm (không chặn soạn bài, nhưng chặn Đề 4+)
- Thêm giọng Azure AU/CA/NZ/IE vào máy chủ sinh mp3 (`Voice` union: `au-nu`, `au-nam`, `ca-nu`, `nz-nu`, `ie-nam`), `sach-hoc/audio` đọc được.
- `thi-may` cho Listening: tốc độ nói ghi trong đề (`wpm`), máy chủ chỉnh `rate` TTS theo đề.
- Test `thiMayCham.test.ts` mở rộng cho `DeNoi` (đủ Part, số câu, thời gian) và band tổng.

---

## 6. Ma trận phủ — hàng = mục danh mục (mục 2), cột = Tập/Ngày phủ (lấy từ mục lục mục 3; **bản chốt**)

Cách dùng: soạn xong một Ngày ⇒ tìm các mã mình đã phủ, đối chiếu ô; ô ghi ngày khác với bài mình soạn ⇒ hoặc sửa bài, hoặc sửa ma trận **và**
mục lục cùng lúc. Mã không có ô ở tập nào = thủng ⇒ không được có.

### 6.1 Ngữ pháp

| Mã | T1 | T2 | T3 | T4 | T5 |
|---|---|---|---|---|---|
| G01 | N1 | N23 (ôn) | N1 | — | N27 |
| G02 | N1 | N23 | N1 | — | N27 |
| G03 | N3 | — | — | N13 | N27 |
| G04 | N5 | N23 | — | N1 | N17 |
| G05 | N7 | — | N7 | — | N27 |
| G06 | N9 | N21 | N1 | — | — |
| G07 | N11 | N16 (VD3) | — | — | — |
| G08 | N13 | — | N19 | — | — |
| G09 | N15 | — | N13 | N25 | N7 |
| G10 | (N5 "the" — đề xuất #4) | N1 | N3 | N1 | N17 |
| G11 | (N11 — đề xuất #4) | N3 | N9 | N7 | N17 |
| G12 | — | N5 | N1 | N3 | N1 |
| G13 | (N9 — đề xuất #4) | N7 | N5 | — | — |
| G14 | (N7 — đề xuất #4) | N9 | N11 | N9 | — |
| G15 | — | N11 | N7 | N11 | — |
| G16 | — | N13 | N15 | — | — |
| G17 | — | N15 | N17 | N5 | N5 |
| G18 | — | N17 | N21 | N15 | N13 |
| G19 | — | N19 | N25 | — | — |
| G20 | — | N21 | N1 | — | — |
| G21 | — | N23 | N23 | — | — |
| G22 | — | — | N1 | N3 · N25 | N1 |
| G23 | — | — | N5 | N9 | — |
| G24 | — | — | N13 | N5 · N25 | N7 |
| G25 | — | — | N15 | N19 | N19 |
| G26 | — | — | N17 | N5 | N5 · N7 |
| G27 | — | — | N19 | N17 | — |
| G28 | — | — | N19 | N13 | — |
| G29 | — | — | N21 | N15 | N13 |
| G30 | — | — | N23 | N11 | N5 |
| G31 | — | — | N25 | N1 | N1 |
| G32 | — | — | N27 | N21 | N9 · N19 |
| G33 | — | — | N11 · N29 | N9 | — |
| G34 | — | — | N29 | N17 | — |
| G35 | — | — | — | N5 | N5 · N7 |
| G36 | — | — | — | N7 | N13 · N21 |
| G37 | — | — | — | N7 | N13 · N21 |
| G38 | — | — | — | N19 | N19 |
| G39 | — | — | — | N7 · N13 | N1 · N6 |
| G40 | — | — | — | N12 · N13 | N13 |
| G41 | — | — | — | N21 | N1 · N15 |
| G42 | — | — | — | N27 | N19 · N21 |
| G43 | — | — | N27 | N21 | N3 · N9 · N17 · N23 · N25 |
| G44 | — | — | N11 | N23 | N11 · N21 |
| Ôn tổng | — | N23 | N29 | N29 | N27 |

### 6.2 Từ vựng

| Mã | T1 | T2 | T3 | T4 | T5 |
|---|---|---|---|---|---|
| VA1–VA5 (dải tần suất) | VA1 mọi bài | VA2 | VA3 | VA4 | VA5 N4 · N28 |
| VB1 / VB2 | — | N2 · N4 / N10 · N14 | — | — | N2 (ôn 570) |
| VB3 / VB4 / VB5 / VB6 | — | — | N2 / N8 / N14 / N20 | — | N2 · N24 |
| VB7 / VB8 / VB9 / VB10 | — | — | — | N2 / N8 / N14 / N20 · ôn N28 | N2 · N24 |
| VC01 · VC02 · VC03 | N1 · N3 · N5+N7 | — | N18 · N2 · N14 | — | — |
| VC04 · VC05 · VC06 · VC07 | N9 · N11 · N13 · N15 | N10 (VC05) | N11 · N17 | N14 (VC04) · N12 (VC05) | — |
| VC08 · VC09 · VC10 · VC11 | — | N2 · N4 · N6 · N8 | N20 (VC11) | N2 · N8 · N20 | — |
| VC12 · VC13 · VC14 · VC15 | — | N12 · N14 · N16 · N18 | N26 (VC13) | N26 · N14 · N26 | — |
| VC16 · VC17 · VC18 | — | N20 · N22 · N24 | N8 (VC18) | N8 (VC17) | N14 (VC16) |
| VC19 · VC20 · VC21 · VC22 | — | — | N4 · N6 · N10 · N12 | — | N8 · N2 · N20 · N14 |
| VC23 · VC24 · VC25 · VC26 | — | — | N16 · N22 · N24 · N28 | — | N8 · N20 · N26 · N26 |
| VC27 · VC28 · VC29 · VC30 | — | — | — | N4 · N10 · N16 · N22 | N14 · N2 · N8 · N20 |
| Ôn trọn chủ đề | — | N24 | N30 | N28 | N16 · N24 · N30 |
| VD1 họ từ | mỗi bài vocab | N4 | — | — | — |
| VD2 cụm động từ | mỗi bài vocab | rải | N18 | — | — |
| VD3 collocation | — | N16 | N14 · N24 | N6 · N24 | N2 |
| VD4 paraphrase | — | N8 | N3 | N15 | N6 |
| VD5 từ dễ nhầm | — | — | N28 | N10 | — |
| VD6 từ nối | — | N17 | N21 | N15 | — |
| VD7 idiom | — | — | N30 | N10 · N18 · N22 · N30 | N3 · N11 · N18 |
| VD8 sắc thái / register | — | — | — | N10 · N18 | N2 · N6 · N15 · N18 |
| VD9 Phrasebank | — | — | — | N6 · N21 | N7 · N10 |
| VD10 đoán nghĩa | — | N6 | N9 | — | — |

### 6.3 Reading

| Mã | T1 | T2 | T3 | T4 | T5 |
|---|---|---|---|---|---|
| R01 | N4 | N14 | N9 · N25 | — | N7 |
| R02 | N6 | — | N17 | N17 | — |
| R03 | N8 | — | N15 | — | — |
| R04 | N10 | — | N21 | N23 | N15 |
| R05 | N12 | N6 | N3 | N5 | N3 · N23 |
| R06 | N14 | — | N9 | N25 | — |
| R07 | — | N2 | N25 | N25 | — |
| R08 | — | N4 | — | N11 | — |
| R09 | — | N8 | N7 · N15 | — | N7 |
| R10 | — | N10 | N11 | N7 | — |
| R11 | — | — | N13 | N7 | — |
| R12 | — | N12 | N5 | N3 | N5 · N9 |
| R13 | — | N16 | N19 | N19 | N15 |
| R14 | — | N18 | — | N15 | — |
| R15 | — | N20 | N23 | N5 | N9 |
| R16 | — | N22 | N17 | N17 | — |
| R17 | N2 | — | N1 | — | — |
| R18 | — | N8 | N1 · N3 | N3 · N15 | N17 |
| R19 | — | — | N23 | N5 · N9 · N29 | N3 · N23 |
| R20 | — | N24 | N27 · N29 | N1 · N13 · N21 · N27 · N29 | N1 · N11 · N13 · N19 · N21 · N27 |
| R21 | — | 12 bài / 6 thể loại | N7 | N1 · N9 · N21 | N11 |
| Checklist 16 dạng | — | — | — | — | N29 |

### 6.4 Listening

| Mã | T1 | T2 | T3 | T4 | T5 |
|---|---|---|---|---|---|
| L01 | N1 | N3 | N5 | — | — |
| L02 | N3 · N5 | N5 | N12 | — | — |
| L03 | N7 · N15 | N1 · N9 · N15 | N1 · N16 · N21 | N1 · N9 · N21 | N1 |
| L04 | N9 | N7 · N9 · N15 | N4 · N12 · N16 · N28 | N4 · N9 · N16 · N21 | N4 |
| L05 | N11 | N13 · N21 | N8 · N17 · N20 · N25 | N5 · N12 · N17 · N28 | N4 · N12 · N19 |
| L06 | N13 | N19 · N21 | N13 · N24 · N25 · N28 | N8 · N13 · N17 · N20 · N24 · N28 | N5 · N12 · N19 · N20 |
| L07 | — | N1 | N13 | N8 | — |
| L08 | — | N5 | N24 | N13 | — |
| L09 | — | N13 | N17 | N12 | — |
| L10 | — | — | N24 | N13 | N12 |
| L11 | — | N7 · N13 | N17 | N4 | — |
| L12 | — | N13 | N8 · N20 | N5 · N24 | — |
| L13 | — | N7 | N4 · N12 | N16 | — |
| L14 | — | N19 | N20 · N28 | — | — |
| L15 | — | N11 | N9 · N25 | N12 · N28 | N15 |
| L16 | — | N19 | N1 · N16 · N29 | N1 · N25 · N29 | N9 · N25 · N28 |
| L17 | UK | US N7 · AU N15 · N19 | CA N4 · N12 · NZ N12 · N20 · N24 | Scot/IE N21 | trộn N1 · N20 · N21 |
| L18 | — | N17 | N18 | N8 · N20 · N24 | N21 |
| Đề 40 câu luyện | — | N23 | N21 · N29 | N25 · N29 | N28 |
| Checklist 14 dạng | — | — | — | — | N29 |

### 6.5 Writing

| Mã | T1 | T2 | T3 | T4 | T5 |
|---|---|---|---|---|---|
| W01 | N2 | N2 | N2 | N2 | N1 · N2 |
| W02 | N4 | N4 | N4 | — | — |
| W03 | N6 · N8 · N10 | N2 | N6 | N4 | N4 · N14 |
| W04 | N14 | N6 | N10 | N10 | N10 |
| W05 | — | N10 | N14 | N14 | N16 |
| W06 | — | N14 | N18 | N22 | N20 |
| W07 | — | N18 | N22 | N28 | N28 |
| W08 | N12 | N4 | N8 | N6 | N26 |
| W09 | — | N8 | N12 | N8 | N26 |
| W10 | — | N12 | N16 | N18 | N26 |
| W11 | — | N16 | N20 | N16 · N24 | N26 |
| W12 | — | — | N24 | N24 | N6 |
| W13 | — | N20 | N28 | — | N12 · N26 |
| W14 | — | N22 | N28 | — | N18 · N26 |
| W15 | N6 | N2 | — | N4 | — |
| W16 | — | N17 | N10 | N12 | — |
| W17 | N11 | N4 · N8 | N8 | N6 · N12 | — |
| W18 | — | N6 | N22 | N28 | N28 |
| W19 | — | — | N2 · N30 | N2 · N30 | N2 · N30 |
| W20 | — | N24 | — | N28 | — |
| W21 | — | N24 email | N26 báo cáo | N20 kịch bản · N24 tóm tắt · N26 cover letter | N22 phản biện |

### 6.6 Speaking

| Mã | T1 | T2 | T3 | T4 | T5 |
|---|---|---|---|---|---|
| S01 | N2 | — | N2 | — | N2 |
| S02 | N4 | N1 | — | — | — |
| S03 | N6 | N5 | — | — | — |
| S04 | N8 · N10 · N12 · N14 | N9 | N3 | N2 | N3 |
| S05 | (N10 · N14 — đề xuất #3) | N3 · N7 · N11 · N15 · N19 · N23 | N7 · N14 · N22 · N26 | N6 · N10 · N14 · N26 | N7 · N14 · N17 · N26 |
| S06 | — | N13 · N21 | N6 · N10 · N15 · N19 · N23 | N3 · N7 · N11 · N14 · N15 · N18 · N19 · N23 | N6 · N10 · N13 · N17 · N22 · N23 · N27 |
| S07 (30 chủ đề P1) | rải | N1 · N9 | N3 | N30 | — |
| S08 (40 đề P2/P3) | — | 6 đề | 8 đề | 8 đề | N26 · N27 (12 đề) |
| S09 | — | N5 | N11 · N27 | N2 · N3 | — |
| S10 | — | N9 | N27 | N18 | N11 · N22 |
| S11 44 âm | N1 · N2 · N3 · N4 · N6 · N8 · N10 · N12 · N14 | N1 · N5 · N9 | N1 · N27 (tự chẩn) | N27 | — |
| S12 trọng âm từ | — | N11 · N13 | N7 · N16 | N17 | — |
| S13 trọng âm câu / âm yếu | — | N15 · N17 | N9 · N20 | N2 · N8 | — |
| S14 nối âm | — | N23 | N3 · N15 | N5 · N7 · N12 | N5 · N23 |
| S15 ngữ điệu / chunking | — | N19 | N11 · N23 · N24 | N9 · N18 · N22 | N2 · N6 · N13 · N17 |
| S16 nói ứng dụng | N2 | N3 · N17 | N18 | N22 | N18 |
| S17 giám khảo AI | — | N23 · N24 | N30 | N27 · N30 | N8 · N10 · N22 · N30 |

### 6.7 Chiến thuật & tiếng Anh ứng dụng

| Mã | T1 | T2 | T3 | T4 | T5 |
|---|---|---|---|---|---|
| X01 | N2 | N24 | — | — | — |
| X02 | — | N19 | — | — | — |
| X03 | — | N24 | N29 | N29 | N21 |
| X04 | — | N6 | — | N28 | — |
| X05 | — | N13 | — | N30 | — |
| X06 | — | — | — | — | N29 |
| X07 | Intro | — | N2 | — | N1 |
| X08 | — | — | — | N28 | N29 |
| E01 | N2 | — | — | — | — |
| E02 | — | N3 | — | — | — |
| E03 | — | N24 | — | N26 | — |
| E04 | — | N17 | — | — | — |
| E05 | — | — | N18 | — | — |
| E06 | — | — | — | N20 · N22 · N24 | — |
| E07 | — | — | — | mọi bài Reading | mọi bài Reading |
| E08 | — | — | — | — | N21 |
| E09 | — | — | N26 | N24 | N22 |
| E10 | — | — | — | — | N18 |
| 🖥️ Đề | Đề 1 N15 | Đề 2 N12 · Đề 3 N24 | Đề 4 N15 · Đề 5 N30 | Đề 6 N1 · Đề 7 N15 · Đề 8 N30 | Đề 9 N8 · Đề 10 N16 · Đề 11 N24 · Đề 12 N30 |
| ✅ Kiểm tra chặng | N6 · N12 · N15 | N6 · N12 · N18 | N6 · N12 · N18 · N24 · N30 | N6 · N12 · N18 · N24 · N30 | N6 · N12 · N18 · N24 · N30 |

---

## 7. Việc làm ngay (thứ tự đề xuất)

1. **Vá Tập 1** theo mục 5.1 #1–#4 (hình/sơ đồ Ngày 1–6, `d12-kiem-tra` + `d15-kiem-tra`, Part 2 nhập N10/N14, 4 điểm ngữ pháp A2 chèn N5/N7/N9/N11)
   — giao cùng đợt với 3 agent đang soạn N7–15 (họ đang có file mở; người điều phối vá N1–6).
2. **Speaking trong `thi-may`** + bộ đề gom 4 kỹ năng (5.2 #15) → **Đề 1, 2, 3** (4.2) → **Đề 0 test đầu vào** (4.3).
3. Soạn **Tập 2** theo 3.2 (24 ngày, mỗi agent 6 ngày = 1 chặng, có kiểm tra chặng ở N6/N12/N18 và Đề 2/3), `storageKey` + tiền tố id `t2dN-`.
4. Song song: giọng AU/CA/NZ/IE (5.3), sổ lỗi nhận câu sai từ bài học (5.2 #20), trang tiến độ band (5.2 #22).
5. Tập 3 → 4 → 5 theo 3.3–3.5; mỗi tập xong thì soạn đề tương ứng trước khi mở tập kế.
