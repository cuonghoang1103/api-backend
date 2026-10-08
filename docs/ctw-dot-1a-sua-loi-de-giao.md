# Đề giao (Opus): CT WORK ĐỢT 1a — SỬA 10 LỖI CÒN MỞ (CTW-7,9,10,14,15,17,18,20,27,38) + TEST · 08/10/2026

Repo `/Users/admin/Downloads/api-backend`. Đọc `CLAUDE.md` + bộ nhớ `project_ct_work_kieu_jira.md` (trong
/Users/admin/.claude/projects/-Users-admin-Downloads-api-backend/memory/). Làm MỘT MÌNH. **KHÔNG commit/push/deploy.** Nhiều phiên khác cùng repo
(và agent "CT Work đợt 1b — kiểm thử FPT" song song, làm phần test management) — chỉ đụng tệp cần cho từng lỗi; không git add/stash/checkout.
Chi tiết từng thẻ: đọc trên CT Work dự án CTW (id 4) bằng `~/Documents/FlyingPencil/.ctwork/lib.mjs` (`api('fp_claude','GET','/work/projects/4/issues/<số>')`
— token agent, không in token) hoặc API tương đương.

## 10 lỗi
- CTW-7: "Test" luật tự động phải là CHẠY THỬ (dry-run) — không bình luận/không gửi thông báo thật lên thẻ thật; trả bản xem trước hành động.
- CTW-9: insights/daily brief "quá tải" chỉ tính việc của sprint đang chạy + theo sức chứa người, không cộng mọi thẻ mở mọi sprint.
- CTW-10: AI plan-sprint loại test case (Xray) và ticket service desk khỏi backlog lập kế hoạch (hoặc nhóm riêng).
- CTW-14: chữ sinh tự động (tiêu đề phê duyệt, thông báo, báo cáo…) theo NGÔN NGỮ dự án/người dùng (vi/en), không cứng tiếng Anh.
- CTW-15: API nhận số thẻ (key/number) cho parentId/epic ở mọi chỗ nhận id nội bộ (chấp nhận cả hai, nhất quán), lỗi rõ ràng.
- CTW-17: action họp → thẻ kế thừa sprint/giai đoạn/bộ phận/epic của cuộc họp (có thể chỉnh).
- CTW-18: kỳ báo cáo AI tuần tính theo múi giờ dự án/người dùng (Asia/Ho_Chi_Minh), khớp xem trước.
- CTW-20: Docs PATCH status IN_REVIEW: luồng trạng thái đúng + thông báo lỗi chỉ đường (vd. phải gửi duyệt qua endpoint nào).
- CTW-27: `POST /issues/:num/move` thiếu/undefined `statusId` ⇒ 400 rõ ràng (không 200 im lặng); rà các endpoint tương tự.
- CTW-38: timesheet duyệt tuần CHƯA kết thúc không được khoá ngày sau hôm nay (khoá tới hôm nay hoặc chặn duyệt tới khi hết tuần — chọn và ghi lý do); có mở lại.
## Kiểm
Test cho TỪNG lỗi (unit + `WORK_DB_TEST=1` DB test nếu chạm route) — thêm vào danh sách `npm test` nếu là test mới; chạy lại toàn bộ test work liên quan;
`npx tsc --noEmit`; nếu đổi frontend: `(cd frontend && npx tsc --noEmit)` (build để trưởng nhóm chạy). Cập nhật bình luận trên từng thẻ CTW (bot fp_claude):
nguyên nhân + cách sửa + test (KHÔNG đổi trạng thái Done — người duyệt). Báo lại ngắn: tệp đổi, test, rủi ro.
