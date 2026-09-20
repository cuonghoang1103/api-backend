# Hợp đồng soạn NWC204 — Mạng máy tính (môn ƯU TIÊN SỐ 1)

> Đọc file này TRƯỚC khi sửa bất cứ gì của NWC204.
> Nguồn dữ liệu bắt buộc: `content/academy/_syllabus-flm/NWC204.json` (sylID 14520,
> QĐ 968/QĐ-ĐHFPT ngày 07/08/2026 — 60 buổi, 10 CLO, 52 câu hỏi kiến tạo).
> Chuẩn trình bày chung: `content/academy/_HOP-DONG-SOAN-BAI.md`.

## 0. Vì sao môn này khác mọi môn khác

Người học đặt hàng môn này là **chủ của web** này. Yêu cầu nguyên văn:

> "Quan trọng nhất là Computer networking để tôi hiểu toàn bộ mạng để có thể ssh,
> deploy, cổng mạng trường học, và all liên quan đến cổng mạng, và các thứ khác
> chuyên gia, chuyên nghiệp để phục vụ công việc của tôi **khi không có bạn ở bên
> mà vẫn hoàn hảo tự kiểm tra và làm được hiểu hoàn toàn**. Từ cơ bản đến nâng cao."

Rút ra ba điều chi phối toàn bộ cách viết:

1. **Mục tiêu là TỰ CHẨN ĐOÁN, không phải thi qua môn.** Mỗi khái niệm phải kèm
   *cách tự kiểm bằng lệnh thật* — gõ gì, thấy gì thì kết luận gì.
2. **Từ số 0 đến nâng cao, không nhảy bước.** Người học không có nền mạng. Mỗi
   thuật ngữ mới phải được định nghĩa ở chỗ nó xuất hiện lần đầu.
3. **Nói rõ vì sao, không chỉ nói là gì.** "TCP có 3 bước bắt tay" là vô dụng nếu
   không giải thích vì sao cần 3 bước mà không phải 2.

## 1. Hai pha — ĐỪNG trộn

| Pha | Phạm vi | Trạng thái |
|---|---|---|
| **Pha 1** | Bám 100% giáo trình: 17 module CCNA ITN theo đúng 60 buổi + **bù Cisco Module 5** | ĐANG LÀM |
| **Pha 2** | Mỗi chương thêm một bài *"Trên máy chủ thật của bạn"* | SAU, đừng làm trước |

Pha 1 viết bài giảng **độc lập, không để chỗ trống chờ Pha 2**. Pha 2 sẽ thêm
bài MỚI (slug `nwc204-<ch>-tt-...`), không sửa bài Pha 1.

## 2. ⛔ Lỗ hổng BẮT BUỘC phải bù: Cisco Module 5

Kế hoạch 60 buổi của trường đánh số chương lệch so với module Cisco và **bỏ hẳn
Module 5 (Number Systems)**:

| Chương của môn | Module Cisco | Buổi |
|---|---|---|
| 5. Data Link Layer | Module **6** | 15–16 |
| 6. Ethernet Switching | Module **7** | 17–18 |
| 7. Network Layer | Module **8** | 21–22 |
| … | … lệch 1 đơn vị suốt phần còn lại | |

Nhưng buổi 30–33 dạy **chia subnet và VLSM**, và việc đó **không làm được nếu
không đọc được nhị phân**. Vì vậy phải có một chương bù, đặt **trước chương IPv4
Addressing**, dạy: hệ nhị phân · chuyển đổi 8 bit ↔ thập phân (cả hai chiều, có
mẹo bảng 128-64-32-16-8-4-2-1) · hệ thập lục phân và vì sao MAC/IPv6 dùng hex ·
phép AND theo bit và vì sao nó chính là cách router so địa chỉ với mặt nạ.
Ghi rõ trong bài: **"Trường không xếp buổi nào cho phần này; đây là chương web
bổ sung vì không có nó thì không học được buổi 30–33."**

## 3. Cấu trúc file — chia nhiều phần, viết song song

```
content/academy/NWC204.mjs              ← file spec, chỉ gom các phần lại
content/academy/_nwc204/muc0.mjs        ← export default [ ...sections ]
content/academy/_nwc204/ch01-02.mjs
content/academy/_nwc204/ch03-04-bu05.mjs
…
```

- Vòng seed của deploy quét `content/academy/*.mjs` **không đệ quy**, nên thư mục
  con `_nwc204/` sẽ không bị seed như một môn riêng. Đã kiểm.
- `NWC204.mjs` giữ `course` + `sections: [...muc0, ...ch0102, ...]`.
- **Mỗi agent CHỈ ghi file phần của mình.** Không ai sửa `NWC204.mjs` ngoài người
  điều phối.

## 4. Mỗi bài giảng phải có, theo đúng thứ tự này

1. `<span class="eyebrow">` — mã môn · chương · số bài · **buổi nào của FLM** · CLO.
2. **Câu hỏi mở đầu**: một tình huống thật người học sẽ gặp. Ví dụ cho bài về cổng:
   *"Bạn gõ `curl localhost:3000` thì được, gõ từ máy khác thì treo. Vì sao?"*
3. **Khái niệm, từ số 0.** Định nghĩa từng thuật ngữ ngay lần đầu dùng.
4. **Vì sao thiết kế như vậy** — nêu cái giá của phương án khác.
5. **Ví dụ có số thật, giải từng bước.** Subnet thì phải có bảng bit.
6. **Khối lệnh/cấu hình thật** (xem mục 5).
7. **`Cách tự kiểm`** — một khối riêng: gõ lệnh gì, kết quả nào nghĩa là đúng,
   kết quả nào nghĩa là sai và sai ở đâu.
8. **`Bẫy hay mắc`** — tối thiểu 3 cái, mỗi cái nói rõ triệu chứng người học sẽ thấy.
9. **Bài tập + lời giải đầy đủ.**
10. **Câu hỏi kiến tạo của trường** cho đúng buổi đó (bảng `cauHoiKienTao` trong
    JSON, 52 câu) — đặt làm câu hỏi thảo luận cuối bài, nguyên văn + dịch.

## 5. Code và cấu hình — quy tắc cứng

- **Mọi khối code PHẢI có `class="language-<tên>"`** để bộ tô màu VS Code chạy và
  nút "Sao chép" xuất hiện. Không có nhãn là chữ trắng trơn, người học phản ánh.
- Nhãn dùng: `language-bash` (lệnh Linux/macOS) · `language-ini` hoặc
  `language-apache` (file cấu hình) · `language-json` · `language-plaintext`
  (kết xuất lệnh, bảng bit). Cisco IOS: dùng `language-bash` — hljs không có
  "cisco", và bash cho màu dễ đọc nhất cho dạng `command argument`.
- **Lệnh và kết xuất tách thành HAI khối.** Trộn vào nhau thì người học sao chép
  ra là dán cả kết xuất vào terminal.
- Cấu hình Cisco viết **đủ từ `enable` trở đi**, đừng bắt đầu giữa chế độ. Mỗi
  dòng kèm chú thích `!` nói dòng đó làm gì.
- Sơ đồ mạng trong BÀI GIẢNG: dùng **mermaid** viết ĐÚNG dạng
  `<pre><code class="language-mermaid">…</code></pre>` — đừng nạp thư viện, đừng dùng ảnh.
  ⛔ `<pre class="mermaid">` và ```fence **KHÔNG được vẽ**, chúng hiện ra mã nguồn
  thô cho người học. Bộ vẽ chỉ quét `code.language-mermaid`. (Lỗi thật, người
  dùng báo 20/09/2026 — 14 khối của chính môn này phải sửa lại.)

## 6. Sách & tài liệu

Theo mục "📗 SÁCH & TÀI LIỆU" của `_HOP-DONG-SOAN-BAI.md`. Riêng môn này:

- Cả 5 dòng tài liệu đều là của **Cisco** và **không có ISBN, không có URL** —
  chỉ vào được qua netacad.com sau khi trường cấp lớp. Dùng `.the-sach.khong-link`
  và **nói thẳng điều đó**, tuyệt đối đừng gắn link đoán.
- ⚠️ Bảng gốc đánh `Is Main Material = True` cho Slides, 17 module e-learning và
  36 video, nhưng đánh `False` cho **24 Lab và 31 bài Packet Tracer** — dù Lab
  chiếm 20% điểm. Nêu chỗ chưa khớp này.
- Packet Tracer là **phần mềm miễn phí** tải từ netacad — đây là thứ người học
  cần nhất để tự luyện, nên cho nó một thẻ nổi bật.

## 7. Nêu chỗ syllabus gốc bất thường — KHÔNG tự sửa bảng gốc

`ghiChuKiemChung` trong JSON có đủ danh sách. Bắt buộc nêu, ít nhất:

- Bỏ hẳn Cisco Module 5 (mục 2 ở trên) — quan trọng nhất.
- Buổi 60 ghi `CLO1-CLO11` nhưng môn chỉ có **10 CLO**.
- Buổi 27 nhảy `9.2` → `9.4`, thiếu 9.3.
- Buổi 35 ghi `11.1 IPv6 Addressing` rồi lại `11.3 IPv6 Addressing`.
- `CQ11.1` ở buổi 31 có nội dung là **"Progress Test 2"** — không phải câu hỏi;
  mà môn chỉ có một Midterm Progress Test ở buổi 34.
- Bảng câu hỏi đánh tới `CQ20.2` nhưng bỏ trống buổi 6, 9, 15, 16, 22, 30, 36, 56.
- Cùng một đồ án mà buổi 43/44/47/48 ghi `CLO7-10`, buổi 51/52/56/57 lại liệt kê
  `CLO3, CLO5…CLO10` — hai tập CLO khác nhau.
- Ô `Pre-Requisite` **trống**; ô `Description` bị **cắt giữa câu** trên bản web.
- Bảng điểm đọc thẳng ra 150%: dòng `Final exam 50%` là **dòng cha** của
  `Practical Exam 20%` + `Theoretical Exam 30%`. Tổng thật là 100%.

## 8. Giới hạn kỹ thuật — vượt là seed CHẾT im lặng

- `Lesson.title` và `slug`: **tối đa 255 ký tự**, `EN|||VI` tính **CẢ HAI VẾ**.
- `course.shortDescription`: **tối đa 500 ký tự**.
- `lesson.content` phải là **String**.
- Trong chuỗi template: KHÔNG backtick lồng, KHÔNG `${ }`.
- Trong `title`: **KHÔNG thực thể HTML thô** (`&amp;` `&lt;`…) — title là văn bản
  thuần, React in ra đúng chữ đó. Trong `content` thì `&amp;` mới đúng.
- `course.syncOrder: true`. `pruneSections` **chỉ bật khi người điều phối bảo**.

## 9. Nghiệm thu

```bash
node scripts/academy-doi-chieu-syllabus.mjs --ma NWC204 --syl content/academy/_syllabus-flm/NWC204.json
node scripts/academy-seed-course.mjs --file ./content/academy/NWC204.mjs     # dry-run
node --check content/academy/_nwc204/<file>.mjs
```

Tự kiểm thêm, báo bằng SỐ: số bài · title dài nhất · shortDescription bao nhiêu
ký tự · 0 slug trùng · 0 entity thô trong `title` · **mọi khối `<pre><code>` đều
có `language-`** · mọi phép tính subnet đã kiểm lại bằng `python3`.

## 10. Liên quan

- `content/academy/_syllabus-flm/NWC204.json` — dữ liệu gốc + so sánh với NWC203c.
- `content/academy/NWC203c.mjs` — môn cũ (26 bài, lý thuyết giao thức, tự học
  Coursera). **ĐỪNG sửa, đừng rút gọn.** Nội dung ở đó bổ trợ cho NWC204.
- `content/academy/_KHUNG-CHUA-DAY-DU.md` — mục "Việc kế tiếp" ghi thứ tự 5 môn.
