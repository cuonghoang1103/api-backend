# Kế hoạch soạn khoá `tieng-anh-ky-thuat-di-lam` — Tiếng Anh kỹ thuật khi đi làm

Khung dựng 20/11/2026: `content/courses/tieng-anh-ky-thuat-di-lam.mjs` (prefix bài `tak-`, 9 phần = Mục 0 + 8 chương, 45 bài).
Ảnh bìa: `scripts/covers/tieng-anh-ky-thuat-di-lam.png` (logo tự vẽ `scripts/icons/chat-bubbles.svg`) — **chưa đẩy R2**.
Category `career`, level `BEGINNER`. Nguồn yêu cầu: bảng soát khoảng trống P0-4.

**Người học:** SV SE FPT năm 3, yếu tiếng Anh, sắp OJT FPT Software (khách Nhật/Mỹ, tài liệu tiếng Anh, bài test tiếng Anh).
**Trục:** dùng câu theo TÌNH HUỐNG công việc. Mỗi bài: (1) tình huống thật, (2) mẫu thật đã che thông tin, (3) phân tích vì sao viết/nói vậy,
(4) lỗi người Việt hay mắc, (5) bài luyện có đáp án gợi ý, (6) 🗂 cụm từ. Bài nói có file âm thanh mẫu (giọng TTS chuẩn) + gợi ý ghi âm.
**Quy trình soạn:** theo `content/courses/docker/_HOP-DONG.md` (phần slide/quiz) — không có terminal; thay bằng "mẫu trước/sau".
Khi soạn: thay phần tử `sections` bằng `tieng-anh-ky-thuat-di-lam/sNN-*.mjs`, **GIỮ NGUYÊN slug bài và title chương**.

## 1. Bảng phủ chủ đề bắt buộc → bài

| Chủ đề (yêu cầu) | Bài (slug) |
|---|---|
| Đọc tài liệu/spec tiếng Anh | `tak-1-1-tai-lieu`, `tak-1-2-loi-issue`, `tak-1-3-spec` |
| Viết ticket / bug report | `tak-2-1-ticket`, `tak-2-2-bug-report`, `tak-2-3-cap-nhat` |
| Commit message + PR description (+ review) | `tak-3-1-commit`, `tak-3-2-pr`, `tak-3-3-review` |
| Email với khách: hỏi lại yêu cầu, báo trễ, báo sự cố | `tak-4-1-cau-truc`, `tak-4-2-hoi-lai`, `tak-4-3-bao-tre`, `tak-4-4-bao-su-co`, `tak-4-5-chat` |
| Q&A list | `tak-5-1-qa-list`, `tak-5-2-cau-hoi-dong`, `tak-5-3-xac-nhan` |
| Daily standup / demo / họp với khách (nói) | `tak-6-1-standup`, `tak-6-2-demo`, `tak-6-3-hop`, `tak-6-4-nghe` |
| Từ vựng theo tình huống | `tak-7-1-tu-vung`, `tak-7-3-mau-cau` |
| Phát âm thuật ngữ hay sai | `tak-7-2-phat-am` |
| Bài test tiếng Anh công ty | `tak-8-1-bai-test` |
| Dự án cuối khoá | `tak-8-2-tuan-mo-phong`, `tak-8-3-tu-cham` |
| Lab + quiz mỗi chương | `tak-N-*-lab`, `tak-N-*-quiz` (N = 1…7), tổng kết `tak-8-4-tong-ket` |

## 2. Tránh trùng — liên kết chéo

| Ở bài | Dẫn sang | Ranh giới |
|---|---|---|
| `tak-0-1-tu-danh-gia`, `tak-8-3` | `interview-prep` ch8 | Tiếng Anh PHỎNG VẤN ở đó; ở đây tiếng Anh SAU KHI đã đi làm |
| `tak-7-1`, `tak-7-4-lab` | CT Language (sổ chuyên ngành 64 bộ, IELTS) | Từ đơn lẻ, luyện thi ở đó; ở đây câu theo tình huống |
| `tak-2-*`, `tak-4-*`, `tak-6-*` | `agile-teamwork` ch2, ch5–6, ch9–11 | Cùng tình huống bằng tiếng Việt (nội dung nghiệp vụ); ở đây đổi ngôn ngữ |
| `tak-2-2` | `debug-co-phuong-phap` ch11 | Nội dung một bug report tốt |
| `tak-3-1` | `git` (commit), agile ch3 | Quy ước commit đã có; ở đây là câu chữ tiếng Anh |

Khi khoá có bài thật: interview-prep ch8 thêm dòng dẫn sang khoá này (mục 3.4 bảng soát).

## 3. Nguồn chính thống

Google Technical Writing One/Two • Google developer documentation style guide • Microsoft Writing Style Guide • RFC 2119 / RFC 8174 •
conventionalcommits.org • cbea.ms/git-commit • Google Engineering Practices (code review comments) • Cambridge Dictionary, Oxford Learner's Dictionaries
(phiên âm IPA) • YouGlish • NASA Mars Climate Orbiter Mishap Investigation Board report (1999) • nohello.net. KHÔNG bịa định dạng bài test tiếng Anh
của FPT Software: chỉ mô tả các dạng bài phổ biến và ghi rõ "tham khảo, kiểm lại với HR".

## 4. Môi trường lab

Không cần cài đặt: trình soạn văn bản + ghi âm điện thoại/máy tính. Mẫu tình huống dựa trên dự án mẫu LabFlow (spec, ticket, PR) để nối với các khoá khác.
Luyện nói có thể dùng CuongMini/AI nói trong CT Language. Mẫu email/chat che toàn bộ tên khách thật.

## 5. Mục lục khung (tự sinh từ tệp khoá)

| Chương | Slug bài | Tiêu đề (VI) |
|---|---|---|
| **Mục 0 — Tiếng Anh như một công cụ làm việc** | | |
| | `tak-0-8-bat-dau-tai-day` | Bắt đầu tại đây (1/2) — Thứ tiếng Anh bạn dùng trong tháng đầu đi làm |
| | `tak-0-9-bat-dau-khi-khong-co` | Bắt đầu tại đây (2/2) — Khi tiếng Anh hỏng việc: im lặng, mơ hồ, sai giọng |
| | `tak-0-1-tu-danh-gia` | 0.1 — Tự đánh giá và kế hoạch 15 phút mỗi ngày |
| **Chương 1 — Đọc tiếng Anh kỹ thuật** | | |
| | `tak-1-1-tai-lieu` | 1.1 — Đọc tài liệu: cấu trúc, đọc lướt, tutorial và reference |
| | `tak-1-2-loi-issue` | 1.2 — Thông báo lỗi, log, issue GitHub, release notes và changelog |
| | `tak-1-3-spec` | 1.3 — Spec và yêu cầu bằng tiếng Anh: từ của RFC 2119, tiêu chí chấp nhận, chỗ mơ hồ |
| | `tak-1-4-lab` | 1.4 — Lab: tóm tắt một README, một luồng issue và một spec |
| | `tak-1-5-quiz` | 1.5 — Kiểm tra Chương 1 |
| **Chương 2 — Viết ticket và bug report** | | |
| | `tak-2-1-ticket` | 2.1 — Ticket và user story: tiêu đề, bối cảnh, tiêu chí chấp nhận (Given/When/Then) |
| | `tak-2-2-bug-report` | 2.2 — Bug report: bước tái hiện, mong đợi và thực tế, môi trường, mức độ |
| | `tak-2-3-cap-nhat` | 2.3 — Cập nhật trạng thái và bình luận trên ticket |
| | `tak-2-4-lab` | 2.4 — Lab: Viết lại năm bug report tiếng Việt thật thành tiếng Anh rõ ràng |
| | `tak-2-5-quiz` | 2.5 — Kiểm tra Chương 2 |
| **Chương 3 — Commit message, pull request và code review** | | |
| | `tak-3-1-commit` | 3.1 — Commit message: thể mệnh lệnh, quy tắc 50/72, Conventional Commits |
| | `tak-3-2-pr` | 3.2 — Mô tả pull request: tóm tắt, vì sao, đã kiểm thế nào, ảnh chụp, rủi ro |
| | `tak-3-3-review` | 3.3 — Bình luận review lịch sự và rõ ràng: gợi ý, câu hỏi, nit, chấp thuận |
| | `tak-3-4-lab` | 3.4 — Lab: một PR trọn vẹn bằng tiếng Anh |
| | `tak-3-5-quiz` | 3.5 — Kiểm tra Chương 3 |
| **Chương 4 — Email và chat với khách hàng và trưởng nhóm** | | |
| | `tak-4-1-cau-truc` | 4.1 — Cấu trúc email công việc: tiêu đề, mở đầu, ý chính, đề nghị, kết |
| | `tak-4-2-hoi-lai` | 4.2 — Hỏi lại cho rõ yêu cầu |
| | `tak-4-3-bao-tre` | 4.3 — Báo trễ hạn: lý do, ảnh hưởng, kế hoạch mới, cần hỗ trợ gì |
| | `tak-4-4-bao-su-co` | 4.4 — Báo sự cố và cập nhật tiếp theo |
| | `tak-4-5-chat` | 4.5 — Tin nhắn Slack/Teams tự đủ ý, và phép lịch sự khi làm bất đồng bộ |
| | `tak-4-6-lab` | 4.6 — Lab: Sáu email cho sáu tình huống thật |
| | `tak-4-7-quiz` | 4.7 — Kiểm tra Chương 4 |
| **Chương 5 — Q&A list và spec với khách hàng** | | |
| | `tak-5-1-qa-list` | 5.1 — Q&A list: các cột, đánh số, trạng thái, ai trả lời |
| | `tak-5-2-cau-hoi-dong` | 5.2 — Câu hỏi đóng có đề xuất: "Chúng tôi giả định X. Như vậy có đúng không?" |
| | `tak-5-3-xac-nhan` | 5.3 — Xác nhận thay đổi bằng văn bản và nhận ra phạm vi phình to |
| | `tak-5-4-lab` | 5.4 — Lab: Lập Q&A list từ một spec tiếng Anh 3 trang |
| | `tak-5-5-quiz` | 5.5 — Kiểm tra Chương 5 |
| **Chương 6 — Nói: standup, demo và họp** | | |
| | `tak-6-1-standup` | 6.1 — Standup 60 giây: hôm qua, hôm nay, vướng gì |
| | `tak-6-2-demo` | 6.2 — Demo cho khách: kịch bản, lời dẫn, xử lý câu hỏi |
| | `tak-6-3-hop` | 6.3 — Họp: xin nhắc lại, xác nhận, không đồng ý lịch sự, chốt việc |
| | `tak-6-4-nghe` | 6.4 — Nghe nhiều giọng: Ấn, Nhật, Mỹ, Úc |
| | `tak-6-5-lab` | 6.5 — Lab: Ghi âm một standup, một demo 3 phút và một buổi họp đóng vai |
| | `tak-6-6-quiz` | 6.6 — Kiểm tra Chương 6 |
| **Chương 7 — Từ vựng theo tình huống và phát âm thuật ngữ** | | |
| | `tak-7-1-tu-vung` | 7.1 — Từ vựng theo tình huống: lên kế hoạch, viết code, kiểm thử, triển khai, sự cố |
| | `tak-7-2-phat-am` | 7.2 — Thuật ngữ người Việt hay phát âm sai |
| | `tak-7-3-mau-cau` | 7.3 — 100 mẫu câu cho tình huống làm việc hằng ngày |
| | `tak-7-4-lab` | 7.4 — Lab: Kiểm phát âm bằng ghi âm và tạo bộ từ trong CT Language |
| | `tak-7-5-quiz` | 7.5 — Kiểm tra Chương 7 |
| **Chương 8 — Bài test tiếng Anh của công ty và dự án cuối khoá: một tuần làm việc bằng tiếng Anh** | | |
| | `tak-8-1-bai-test` | 8.1 — Chuẩn bị bài test tiếng Anh của công ty: dạng đọc, ngữ pháp, nghe, nói |
| | `tak-8-2-tuan-mo-phong` | 8.2 — Dự án cuối khoá — một tuần làm việc mô phỏng bằng tiếng Anh |
| | `tak-8-3-tu-cham` | 8.3 — Tự chấm, nhận phản hồi và kế hoạch luyện 3 tháng tới |
| | `tak-8-4-tong-ket` | 8.4 — Kiểm tra tổng kết |

## 6. Tiến độ soạn

- 22/11/2026: **Mục 0** (`s00-bat-dau.mjs`: tak-0-8, tak-0-9, tak-0-1) và **Chương 1** (`s01-doc-tieng-anh-ky-thuat.mjs`: tak-1-1 … tak-1-4 + quiz 10 câu tak-1-5, type QUIZ) đã soạn chi tiết.
  Tiện ích chung: `_chung.mjs` (mau, saiDung, tuVung, Q). Tệp khoá ghép chương vào khung THEO SLUG (`ghep()`): bài đã soạn thay bài khung,
  bài chưa có giữ "Đang soạn", slug lạ ⇒ ném lỗi lúc nạp. Chương 2–8 vẫn là khung.
