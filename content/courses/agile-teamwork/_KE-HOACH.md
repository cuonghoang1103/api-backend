# Kế hoạch soạn 3 chương mới của khoá `agile-teamwork` (Chương 9–11)

Bổ sung 20/11/2026 theo bảng soát khoảng trống P0-3 vào `content/courses/agile-teamwork.mjs` (prefix bài `agl-`).
Khoá nay: 13 phần (Mục 0 + 12 chương), 64 bài; 3 chương mới = 24 bài.

**⚠️ Đánh số và slug:** 3 chương mới chèn TRƯỚC dự án cuối khoá ⇒ dự án cuối khoá hiển thị "Chương 12" nhưng **giữ slug cũ `agl-9-1-chuan-bi` …
`agl-9-4-tong-ket`** (hàm `giuSlugDuAnCuoi` trong tệp khoá). `scripts/course-seed.mjs` neo chương bằng slug bài ĐẦU (`agl-9-1-chuan-bi`) ⇒ đổi
tiêu đề chương 9 → 12 chỉ cập nhật tiêu đề, không tạo chương trùng; `syncOrder: true` xếp lại thứ tự. Chương mới 9 có slug `agl-9-1-mo-hinh-hop-dong`…
(khác tên đuôi, không trùng). KHÔNG đổi/xoá slug cũ nào. Khi soạn chi tiết: tệp chương `agile-teamwork/sNN-*.mjs`, giữ nguyên slug + title chương.

**Người học:** SV SE năm 3, sắp OJT FPT Software (thị trường Nhật lớn, CMMI/ISO 27001). Ngày đầu sẽ gặp BD/DD, test spec Excel, Q&A list,
daily report, NDA/ISMS. **Chuẩn:** liên tưởng đời thường, tình huống OJT, góc hacker (ch10: lừa đảo, token lộ), lab trên CT Work + Excel mẫu, quiz.
⛔ Không bịa quy định nội bộ cụ thể của FPT Software: dạy ở mức thông lệ ngành + "kiểm lại quy định công ty bạn".

## 1. Bảng phủ chủ đề bắt buộc → bài

| Chủ đề (yêu cầu) | Bài (slug) |
|---|---|
| Mô hình hợp đồng ODC/fixed price/T&M, BrSE | `agl-9-1-mo-hinh-hop-dong` |
| Vòng đời dự án, V-model dự án Nhật | `agl-9-2-vong-doi-v-model` |
| Tài liệu BD/DD | `agl-9-3-tai-lieu-bd-dd` |
| Test spec / test case Excel, evidence | `agl-9-4-test-spec` |
| Q&A list với khách, CR | `agl-9-5-qa-cr` |
| Ước lượng man-day, buffer, rủi ro | `agl-9-6-uoc-luong-man-day` |
| Báo cáo tiến độ, hourensou, xử lý trễ | `agl-9-7-bao-cao-hourensou` |
| NDA | `agl-10-1-nda` |
| ISMS/ISO 27001 mức nhân viên | `agl-10-2-isms` |
| Quy định dữ liệu khách, AI công cộng | `agl-10-3-du-lieu-khach` |
| USB/VPN, mất laptop thì làm gì | `agl-10-4-thiet-bi` |
| Vệ sinh tài khoản cá nhân (password manager, 2FA, SSH key, PAT) | `agl-10-5-tai-khoan` |
| Lừa đảo, sự cố rò rỉ thật | `agl-10-6-lua-dao`, `agl-10-7-su-co-that` |
| Khác biệt văn hoá khách Nhật/Mỹ | `agl-11-1-khach-nhat`, `agl-11-2-khach-my`, `agl-11-3-mui-gio-hop`, `agl-11-4-tinh-huong-kho` |
| Lab + quiz | `agl-9-8-lab`, `agl-9-9-quiz`, `agl-10-8-lab`, `agl-10-9-quiz`, `agl-11-5-lab`, `agl-11-6-quiz` |

## 2. Tránh trùng — liên kết chéo

| Ở bài | Dẫn sang | Ranh giới |
|---|---|---|
| `agl-9-2` | SWE201c 2.1, SWT301 2.7 | V-model lý thuyết ở đó; ở đây "ngày thường trông thế nào" |
| `agl-9-6` | PMG201c (WBS), agile ch2 (story point) | So sánh man-day vs story point |
| `agl-9-3`, `agl-9-5` | SWR302 (SRS) | Viết yêu cầu ở đó; ở đây đọc tài liệu khách giao |
| `agl-9-4` | SWT301 ch7 | Quản lý test lý thuyết |
| `agl-9-7` | agile ch6 (`agl-6-3-bao-cao`) | Báo cáo chung; ở đây mẫu daily report outsourcing + hourensou |
| `agl-10-5` | `authentication` ch7 | Góc người XÂY hệ thống xác thực |
| `agl-10-1` | `interview-prep` 9.3 | NDA trong offer |
| `agl-10-3` | `privacy-data-law` | Nghị định 13/2023 chuyên sâu |
| `agl-10-5` | `ide-va-do-nghe-dev` 6.3, `git` 8.3 | SSH key, gỡ bí mật khỏi lịch sử |
| `agl-9-5`, `agl-11-4` | `tieng-anh-ky-thuat-di-lam` ch4–6 | Bản tiếng Anh của cùng tình huống |
| `agl-11-1` | Academy JPD113/JPD123 | Tiếng Nhật |

## 3. Nguồn chính thống

ISO/IEC 27001:2022 và 27002:2022 (tóm tắt chính thức trên iso.org) • NIST SP 800-50 (security awareness) • NIST SP 800-63B (mật khẩu, 2FA) •
Nghị định 13/2023/NĐ-CP • CMMI Institute (mô tả mức trưởng thành) • GitHub Docs — 2FA, fine-grained PAT, secret scanning • OWASP Top 10 (phần nhận thức) •
Sự cố: Uber 2016 (FTC complaint 2017/2018), Toyota T-Connect 10/2022 (thông cáo Toyota), Samsung 04/2023 (Bloomberg/The Economist Korea) •
Văn hoá: Erin Meyer "The Culture Map" (trục giao tiếp ngữ cảnh cao/thấp), tài liệu hourensou/nemawashi của JETRO.

## 4. Môi trường lab

CT Work (dự án mẫu "Đặt lịch phòng khám"/LabFlow) + bộ Excel mẫu (DD một màn hình, test spec, Q&A list, daily report) soạn kèm chương 9.
Lab 10 trên tài khoản GitHub CỦA NGƯỜI HỌC: gitleaks, bật 2FA, kiểm kê SSH key/PAT. Lab 11 đóng vai có kịch bản + rubric.

## 5. Mục lục 3 chương mới + dự án cuối khoá (tự sinh)

| Chương | Slug bài | Tiêu đề (VI) |
|---|---|---|
| **Chương 9 — Quy trình dự án outsourcing trong thực tế** | | |
| | `agl-9-1-mo-hinh-hop-dong` | 9.1 — Mô hình hợp đồng và vai trò: ODC, trọn gói, T&M, onsite/offshore, BrSE |
| | `agl-9-2-vong-doi-v-model` | 9.2 — Vòng đời dự án thực tế: V-model ở dự án Nhật, Agile lai |
| | `agl-9-3-tai-lieu-bd-dd` | 9.3 — Đọc tài liệu thiết kế cơ bản và chi tiết (BD/DD) dạng Excel |
| | `agl-9-4-test-spec` | 9.4 — Test spec và test case dạng Excel: các cột, evidence, checklist UT |
| | `agl-9-5-qa-cr` | 9.5 — Q&A list với khách và change request (CR) |
| | `agl-9-6-uoc-luong-man-day` | 9.6 — Ước lượng bằng man-day: WBS, dự phòng, ước lượng ba điểm và rủi ro |
| | `agl-9-7-bao-cao-hourensou` | 9.7 — Báo cáo ngày/tuần và hourensou (báo cáo, liên lạc, thảo luận) — và xử lý khi trễ |
| | `agl-9-8-lab` | 9.8 — Lab: một ticket theo quy trình outsourcing, từ DD tới báo cáo ngày |
| | `agl-9-9-quiz` | 9.9 — Kiểm tra Chương 9 |
| **Chương 10 — An ninh thông tin khi đi làm** | | |
| | `agl-10-1-nda` | 10.1 — NDA và những gì được nói: mạng xã hội, CV, GitHub, phỏng vấn |
| | `agl-10-2-isms` | 10.2 — ISMS và ISO 27001 cho nhân viên: phân loại tài liệu, bàn làm việc sạch, báo cáo sự cố |
| | `agl-10-3-du-lieu-khach` | 10.3 — Dữ liệu và mã của khách: không mang ra, không repo cá nhân, không AI công cộng |
| | `agl-10-4-thiet-bi` | 10.4 — Thiết bị và mạng: USB, VPN, Wi-Fi công cộng — và khi mất laptop |
| | `agl-10-5-tai-khoan` | 10.5 — Vệ sinh tài khoản cá nhân: trình quản lý mật khẩu, 2FA, SSH key, token phạm vi hẹp |
| | `agl-10-6-lua-dao` | 10.6 — Lừa đảo và tấn công phi kỹ thuật nhắm vào lập trình viên |
| | `agl-10-7-su-co-that` | 10.7 — Sự cố rò rỉ thật và bài học: bí mật trong repo công khai, mất thiết bị, dán code |
| | `agl-10-8-lab` | 10.8 — Lab: Tự kiểm tra an ninh cá nhân |
| | `agl-10-9-quiz` | 10.9 — Kiểm tra Chương 10 |
| **Chương 11 — Làm việc với khách Nhật và khách Mỹ** | | |
| | `agl-11-1-khach-nhat` | 11.1 — Khách Nhật: chất lượng, chi tiết, lời từ chối gián tiếp, hourensou, nemawashi |
| | `agl-11-2-khach-my` | 11.2 — Khách Mỹ và châu Âu: thẳng thắn, chủ động đề xuất, phản biện có lý lẽ |
| | `agl-11-3-mui-gio-hop` | 11.3 — Múi giờ, biên bản họp và xác nhận bằng văn bản |
| | `agl-11-4-tinh-huong-kho` | 11.4 — Tình huống khó: đổi yêu cầu sát hạn, khách phàn nàn lỗi, yêu cầu ngoài phạm vi |
| | `agl-11-5-lab` | 11.5 — Lab: đóng vai họp review với khách Nhật và demo với khách Mỹ |
| | `agl-11-6-quiz` | 11.6 — Kiểm tra Chương 11 |
| **Chương 12 — Dự án cuối khoá: điều hành một sprint cho dự án nhóm** | | |
| | `agl-9-1-chuan-bi` | 12.1 — Backlog, mục tiêu sprint và planning |
| | `agl-9-2-thuc-hien` | 12.2 — Công việc hằng ngày: PR, review, standup |
| | `agl-9-3-ket-thuc` | 12.3 — Review, retro và báo cáo |
| | `agl-9-4-tong-ket` | 12.4 — Checklist và câu chuyện phỏng vấn |
