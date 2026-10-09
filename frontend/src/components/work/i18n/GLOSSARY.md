# CT Work — Bảng thuật ngữ Anh ⇄ Việt (giao diện)

Áp cho mọi chuỗi trong `components/work/i18n/{en,vi}/*.ts`. Dịch mới phải theo bảng này. Thêm thuật ngữ thì sửa bảng trước, rồi mới dịch.

## Nguyên tắc

1. **Giữ tiếng Anh** những từ sinh viên phải học đúng tên: chúng có trong đề cương môn (SWP391, SWT301, SWR302, SEP490), trong báo cáo nộp thầy và trong phỏng vấn. Viết hoa như trong Jira/Xray.
2. **Dịch tự nhiên** phần còn lại, theo cách nói của nhóm sinh viên Việt (ngắn, dùng động từ: "Tạo thẻ", không phải "Thực hiện việc tạo một thẻ mới").
3. **Nhãn nút**: động từ đứng đầu, ≤ 3 từ nếu được ("Lưu", "Tạo thẻ", "Bắt đầu sprint").
4. **Không dịch dữ liệu** người dùng nhập (tên dự án, tên trạng thái tự đặt…). Chỉ dịch phần hiển thị của **tên mặc định** do mẫu dự án tạo (`i18n/names.ts`). Không bao giờ gửi tên đã dịch lên máy chủ (JQL vẫn dùng tên gốc).
5. **Mã/ký hiệu giữ nguyên**: JQL, UTCID, mã thẻ `CTW-12`, tên trường JQL (`status`, `assignee`), phím tắt.
6. Chữ do AI viết và báo cáo xuất ra theo cài đặt dự án **"Language for generated text"** — không theo ngôn ngữ giao diện.

## Giữ tiếng Anh

| Thuật ngữ | Ghi chú |
|---|---|
| Sprint, Backlog, Board, Timeline, Kanban, Scrum | "Bắt đầu sprint", "Kết thúc sprint", "Mục tiêu sprint" |
| Story point | số nhiều vẫn viết "story point" |
| Epic, Story, Bug, Task | loại thẻ (Requirement → *Yêu cầu*, Sub-task → *Việc con*) |
| Test case, Test plan, Test cycle, Test run, Test set | Xray |
| Unit Test 5.1, Integration Test 5.2, System Test 5.3 | mẫu FPT |
| UTCID, Xray, RTM, WBS, SRS, SDS, Use case, Actor | |
| Pull Request, Commit, Branch, Merge, Code review | |
| Velocity, Burndown, Burnup, CFD, Dashboard | |
| Release (danh từ) | động từ "release" → *Phát hành* |
| JQL, API token, MCP, Webhook, AI agent | |
| Workflow | màn cấu hình quy trình |
| QA, Retest, Backlog (tên trạng thái) | |
| PASS / FAIL / BLOCKED (kết quả test) | nhãn trạng thái chạy test, giữ như mẫu FPT |

## Dịch

| English | Tiếng Việt |
|---|---|
| Issue | Thẻ |
| Create issue | Tạo thẻ |
| Sub-task | Việc con |
| Requirement | Yêu cầu |
| Workspace | Không gian làm việc (ngắn: *Không gian*) |
| Project | Dự án |
| My work | Việc của tôi |
| Assignee | Người thực hiện |
| Reporter | Người báo cáo |
| Unassigned | Chưa giao |
| Priority | Độ ưu tiên (Highest/High/Medium/Low/Lowest → Cao nhất/Cao/Trung bình/Thấp/Thấp nhất) |
| Status | Trạng thái |
| To Do / In Progress / Done | Cần làm / Đang làm / Hoàn thành |
| In Review | Đang review |
| Due date | Hạn chót |
| Overdue | Quá hạn |
| Start date / End date | Ngày bắt đầu / Ngày kết thúc |
| Label | Nhãn |
| Component | Thành phần |
| Version | Phiên bản |
| Parent | Thẻ cha |
| Estimate | Ước lượng |
| Worklog / Log time | Nhật ký giờ / Ghi giờ |
| Watcher | Người theo dõi |
| Comment | Bình luận |
| Attachment | Tệp đính kèm |
| Settings | Cài đặt |
| Members | Thành viên |
| Owner / Admin / Member / Viewer | Chủ sở hữu / Quản trị / Thành viên / Người xem |
| Invite | Mời / Lời mời |
| Archive / Archived | Lưu trữ / Đã lưu trữ |
| Trash | Thùng rác |
| Automation | Tự động hoá |
| Report | Báo cáo |
| Requirements (trang) | Yêu cầu |
| Traceability | Truy vết |
| Severity | Mức nghiêm trọng |
| Defect | Lỗi (loại thẻ Bug vẫn là *Bug*) |
| Step | Bước |
| Expected result | Kết quả mong đợi |
| Precondition | Điều kiện trước |
| Ask AI | Hỏi AI |
| Help & guide | Hướng dẫn sử dụng |
| Search | Tìm |
| Filter | Lọc / Bộ lọc |
| Export / Import | Xuất / Nhập |
| Save / Cancel / Delete | Lưu / Huỷ / Xoá |
| Try again | Thử lại |
| Loading… | Đang tải… |
| No results | Không có kết quả |

## Kiểm bố cục

Tiếng Việt dài hơn tiếng Anh khoảng 20–40%. Nút trên thanh công cụ phải có `whitespace-nowrap` và chỗ chứa co giãn (`min-w-0 truncate` cho tiêu đề). Kiểm ở 390 / 1024 / 1180 / 1440.
