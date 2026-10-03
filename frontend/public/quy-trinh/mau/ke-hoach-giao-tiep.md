# Kế hoạch giao tiếp & leo thang (Communication & Escalation Plan)

> **Mục đích:** ai nói với ai, qua kênh nào, bao lâu một lần, chờ trả lời tối đa bao lâu — và khi kẹt thì đưa lên ai, sau bao lâu. Viết ra trước để không ai phải đoán, và để vấn đề không nằm im trong một tin nhắn chưa đọc.
> **Ai điền:** PM chủ trì; khách (Product Owner / đầu mối phía khách) cùng chốt; Tech Lead, Hỗ trợ & Chăm sóc khách hàng góp phần kênh kỹ thuật và sự cố.
> **Khi nào:** giai đoạn 08 · Lập kế hoạch & thiết lập dự án (là một phần của kế hoạch quản lý dự án); phác thảo từ buổi kick-off (giai đoạn 04); rà lại khi đổi nhân sự đầu mối hoặc khi chuyển sang bảo hành / bảo trì.
> **Chuẩn tham chiếu:** PMBOK® Guide 6th ed. — Plan Communications Management (10.1), Plan Stakeholder Engagement (13.2); ISO 21502:2020.

---

## 0. Thông tin
| Dự án | Phiên bản kế hoạch | Ngày hiệu lực | Người duy trì |
|---|---|---|---|
| [...] | [v1.0] | [...] | [PM ...] |

## 1. Danh bạ các bên liên quan (Stakeholder directory)
| Vai trò | Bên | Họ tên | Email / điện thoại | Múi giờ, giờ làm việc | Người thay thế khi vắng |
|---|---|---|---|---|---|
| Nhà tài trợ dự án (Sponsor) | Khách | [...] | [...] | [...] | [...] |
| Product Owner / đầu mối nghiệp vụ | Khách | [...] | [...] | [...] | [...] |
| Đầu mối kỹ thuật / IT | Khách | [...] | [...] | [...] | [...] |
| Quản lý dự án (PM) | Bên B | [...] | [...] | [...] | [...] |
| Tech Lead | Bên B | [...] | [...] | [...] | [...] |
| Kinh doanh / quản lý tài khoản (Account) | Bên B | [...] | [...] | [...] | [...] |
| Hỗ trợ / trực sự cố (on-call) | Bên B | [...] | [...] | [...] | [...] |

> **Một đầu mối ra quyết định mỗi bên.** Yêu cầu từ người không có trong danh bạ được chuyển về đầu mối, không xử lý trực tiếp.

## 2. Kênh giao tiếp & thời gian phản hồi
| Kênh | Dùng cho | **Không** dùng cho | Thời gian phản hồi mục tiêu | Giờ hoạt động |
|---|---|---|---|---|
| Công cụ quản lý dự án (task / ticket) | Yêu cầu, lỗi, câu hỏi cần theo dõi đến khi xong | Sự cố khẩn | [...] ngày làm việc | Giờ hành chính |
| Nhóm chat dự án | Trao đổi nhanh, làm rõ | **Quyết định** (phải ghi lại vào ticket / email) | [...] giờ trong giờ làm việc | Giờ hành chính |
| Email | Quyết định chính thức, phê duyệt, tài liệu, hợp đồng, CR | Trao đổi vụn | [...] ngày làm việc | — |
| Điện thoại / kênh khẩn | **Chỉ** sự cố P1 trên production | Mọi việc khác | [...] phút | [24×7 / giờ ...] |
| Họp trực tuyến | Theo lịch ở mục 3, hoặc khi trao đổi qua chữ quá 2 lượt chưa xong | | Hẹn trong [...] ngày làm việc | |

**Quy tắc:**
- Quyết định nói miệng / chat **chưa phải quyết định** cho đến khi được ghi vào email hoặc ticket và đầu mối xác nhận.
- Tin nhắn ngoài giờ không được tính thời gian phản hồi (trừ kênh khẩn).
- Ngôn ngữ làm việc: [...]. Tài liệu lưu tại: [...].

## 3. Nhịp họp (Meeting cadence)
| Cuộc họp | Tần suất · thời lượng | Thành phần | Mục đích | Đầu ra |
|---|---|---|---|---|
| Daily stand-up | Hằng ngày · 15 phút | Đội Bên B (khách tham gia tuỳ chọn) | Hôm qua / hôm nay / vướng gì | Vướng mắc được giao người gỡ |
| Họp tiến độ tuần (weekly) | Hằng tuần · 30–45 phút | PM, PO, Tech Lead | Tiến độ, rủi ro, quyết định cần đưa ra | Báo cáo tuần (`bao-cao-tuan.md`), danh sách quyết định |
| Demo cuối sprint (sprint review) | Mỗi [... tuần] · 60 phút | Đội, PO, người dùng chính | Trình diễn phần đã xong, nhận phản hồi | Phản hồi đưa vào backlog; xác nhận hạng mục đạt |
| Lập kế hoạch sprint | Đầu mỗi sprint · [...] | Đội, PO | Chọn việc cho sprint | Sprint backlog đã chốt |
| Retrospective | Cuối mỗi sprint · 45 phút | Đội (nội bộ) | Cải tiến cách làm | 1–3 hành động cải tiến |
| Họp ban chỉ đạo (steering committee) | Hằng tháng / mỗi mốc · 60 phút | Sponsor, PM hai bên, Account | Phạm vi, ngân sách, rủi ro lớn, quyết định chiến lược | Biên bản quyết định |

## 4. Ai nhận báo cáo gì (Reporting matrix)
| Báo cáo / thông tin | Người lập | Người nhận | Tần suất | Kênh |
|---|---|---|---|---|
| Báo cáo tiến độ tuần | PM | PO, Sponsor (bản tóm tắt) | Hằng tuần | Email |
| Sổ rủi ro & vấn đề (risk / issue log) | PM | PO; Sponsor khi có rủi ro mức cao | Cập nhật hằng tuần | Công cụ dự án |
| Báo cáo ngân sách / giờ công | PM + Tài chính | Sponsor, PO | Hằng tháng | Email |
| Ghi chú phát hành (release notes) | Tech Lead | PO, người dùng chính | Mỗi lần phát hành | Email / công cụ dự án |
| Báo cáo kiểm thử | QA | PO, PM | Mỗi đợt kiểm thử | Công cụ dự án |
| Thông báo sự cố & postmortem | Trực sự cố / Tech Lead | Đầu mối kỹ thuật khách, PO, PM | Khi xảy ra; postmortem trong [...] ngày | Kênh khẩn → email |
| Phiếu yêu cầu thay đổi (CR) | BA / PM | PO (duyệt), Sponsor nếu vượt ngưỡng [...] | Khi phát sinh | Email |

## 5. Ma trận leo thang (Escalation matrix)
Leo thang **không phải là phàn nàn** — là cách đưa vấn đề tới người có quyền gỡ, đúng lúc. Mỗi cấp có thời gian tối đa; quá hạn thì tự động lên cấp tiếp theo.

| Cấp | Phía Bên B | Phía khách | Khi nào lên cấp này | Thời gian tối đa ở cấp trước khi lên tiếp |
|---|---|---|---|---|
| **1 — Vận hành** | Tech Lead / thành viên phụ trách | Đầu mối nghiệp vụ / kỹ thuật | Vướng mắc thường ngày, câu hỏi chờ trả lời | [...] ngày làm việc |
| **2 — Dự án** | PM | Product Owner | Vướng quá hạn cấp 1; ảnh hưởng tiến độ sprint; tranh chấp lỗi hay yêu cầu mới | [...] ngày làm việc |
| **3 — Quản lý** | Trưởng bộ phận / Account | [Trưởng bộ phận phía khách] | Ảnh hưởng mốc, ngân sách hoặc phạm vi; cấp 2 không thống nhất | [...] ngày làm việc |
| **4 — Ban chỉ đạo** | Lãnh đạo Bên B | Sponsor | Rủi ro hợp đồng, chấm dứt, thay đổi lớn về chiến lược | Họp trong [...] ngày làm việc |

**Leo thang sự cố production (song song, nhanh hơn):** P1 → báo ngay kênh khẩn + đầu mối kỹ thuật khách; quá [...] phút chưa có người nhận → PM hai bên; quá [...] giờ chưa khắc phục tạm thời → cấp 3. Mức P1–P4 theo chính sách bảo hành / SLA.

**Khi leo thang, luôn gửi kèm:** vấn đề (1–2 câu), ảnh hưởng (tiến độ / chi phí / người dùng), những gì đã thử, phương án đề xuất, quyết định cần ai đưa ra và trước khi nào.

## 6. Thông báo vắng mặt & bàn giao
- Đầu mối vắng > [...] ngày làm việc: báo trước [...] ngày, chỉ định người thay thế trong danh bạ.
- Đổi nhân sự đầu mối: cập nhật kế hoạch này và gửi lại cho các bên.

## 7. Phê duyệt
| | Đại diện khách (PO / Sponsor) | PM Bên B |
|---|---|---|
| Họ tên | | |
| Xác nhận (email / chữ ký) | | |
| Ngày | | |

---
*Mẫu tham khảo — https://cuongthai.com/about/quy-trinh. Tần suất và thời gian phản hồi do hai bên thoả thuận.*
