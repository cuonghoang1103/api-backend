# CT Work — CuongMini đọc code & review code (27/10/2026)

Trước đợt này "Hỏi CuongMini" chỉ thấy metadata Git (dev_activity) và phải nói "tôi chưa đọc code". Giờ CuongMini đọc
được repo đã nối của dự án và review được PR thay trưởng nhóm / mentor / giảng viên.

## 1. Đọc code — lệnh `code_read` (MCP + Ask AI, chỉ token NGƯỜI)

Một lệnh, gộp theo `action` (trần MCP 280 lệnh cho token người — đây là lệnh thứ 279):

| action | tham số | trả về |
|---|---|---|
| `activity` | `member?`, `since?` (`7d`, `24h`, `2w`, `2026-10-20`, `today`), `until?`, `branch?` | theo NGƯỜI: số commit (khử trùng sha), push, nhánh, PR, thẻ, 10 commit gần nhất; lọc một người ⇒ thêm tệp đổi nhiều nhất (diff thật của ≤ 5 commit mới nhất) |
| `tree` | `path?`, `ref?` | cây thư mục |
| `file` | `path`, `ref?`, `line?` | tệp có số dòng, cắt theo ngân sách, nói rõ đọc tiếp từ dòng nào |
| `commits` | `ref?`, `path?` | 30 commit mới nhất |
| `commit` | `sha` | diff một commit |
| `compare` | `head`, `base?` (mặc định nhánh mặc định) | ahead/behind, commit, diff `base...head` |
| `pr` | `n` | tiêu đề, MÔ TẢ, trạng thái, nhánh head/base + sha, tác giả, thẻ nhắc tới |
| `pr_files` | `n` | danh sách tệp + diff |

- Diff luôn mang **số dòng của tệp mới** ở mỗi dòng thêm/giữ (`  42 +code`) ⇒ model trích `file:line` không phải tự tính.
- Tệp ồn (lock, `dist/`, `.min.js`…) xếp cuối; hết ngân sách ⇒ liệt kê tệp chưa đọc.
- Ngân sách: Ask AI (web) ~11k ký tự/kết quả (vừa `ASK_LIMITS.commandResultChars`), MCP ~48k.
- Kết quả bọc `<ctwork-content untrusted="true">` (mã + commit message do người viết).
- Quyền như xem mã nguồn (`codeGate({source:true})`): thành viên đội; CLIENT 403; agent bị chặn ở `AGENT_DENIED_ROUTES`
  (`/code/source/**`) và service. Không có ở agent BUILTIN.
- REST mới (cùng chốt): `GET /projects/:pid/code/source/pull/:n`, `…/pull/:n/files`, `…/compare?base=&head=`.
- Gọi đi qua `gitSource.ts` (đệm, hạn mức, chặn redirect khác nguồn, token chỉ đọc mã hoá). GitLab: MR (`/diffs`, lùi
  `/changes` cho GitLab < 15.7) + `repository/compare`.

Prompt trợ lý có thêm khối CODE (chỉ khi dự án đã nối repo): tìm PR/nhánh bằng `dev_activity(issue)` ⇒ đọc diff bằng
`code_read` ⇒ đối chiếu "Xong khi" + Definition of Done ⇒ nói rõ đã đọc tệp nào, chưa đọc tệp nào.

## 2. Review code — `POST /projects/:pid/code/review` `{ pr? | issue?, notify? }`

`src/services/work/codeReview.service.ts` (+ phần thuần `codeReviewRules.ts`, `codeText.ts`).

1. Đích: `pr`, hoặc `issue` ⇒ PR mở mới nhất nhắc KEY-n ⇒ PR đã merge mới nhất ⇒ nhánh mới nhất nhắc KEY-n (so với nhánh mặc định).
2. Đọc: thẻ (mô tả, tiêu chí chấp nhận, Definition of Done), mô tả PR, diff (~70k ký tự).
3. Model: `goiAiCtWork` việc `work_spec_review` + `nang` (chuỗi cổng CT Work: rambo Opus → chính hãng Sonnet → modelapi).
   Bắt buộc JSON: `summary`, `verdict` (APPROVE|CHANGES|COMMENT — chỉ là GỢI Ý), `findings[{file,line,severity,category,message,suggestion}]`,
   `acceptance[{criterion,met,evidence}]`, `nextSteps[]`.
4. Kẹp (`parseCodeReview`): tệp không có trong diff ⇒ bỏ phát hiện; số dòng không hiện trong patch đã đưa model ⇒ gỡ số
   dòng; `met: yes` không có bằng chứng ⇒ `unknown`; còn BLOCKER hoặc tiêu chí `no` ⇒ không bao giờ APPROVE.
5. Lưu phiên review (`WorkReviewSession` kind CODE, checklist CODE_PR, status PREPARATION, `decision` ĐỂ TRỐNG): câu
   checklist CODE_PR (để người chấm) + tiêu chí chấp nhận (OK/NG/trống) + phát hiện (NG, `line` = `file:line`,
   severity BLOCKER→CRITICAL, MAJOR→MAJOR, MINOR→MINOR, NIT→TRIVIAL ⇒ "Log defect" như mọi câu NG). Người bấm = MODERATOR,
   người làm/tác giả PR = AUTHOR.
6. Bình luận NỘI BỘ vào thẻ, đứng tên người bấm, cờ `isAi` (không gắn chữ "AI" trên web): kết luận gợi ý, phát hiện chính
   `file:line`, tiêu chí chưa đạt, bước tiếp theo, độ phủ (đã đọc x/y tệp), link `REV-n`. `notify: true` ⇒ chuông cho người làm.
7. CuongMini KHÔNG duyệt, KHÔNG merge, KHÔNG đặt quyết định review.

Lối vào: nút **CuongMini review** ở panel Development của thẻ và từng PR ở trang Code (chỉ hiện khi `permissions.aiCodeReview`);
Ask AI đề xuất lệnh `code_review` (chỉ ở Ask, người bấm Apply); MCP `review_manage` action `ai_code_review`.

### Quyền

- Hành động mới `ai.review` = ADMIN + TEACHER; thêm trưởng dự án (`leadId`) và trưởng bộ phận (LEAD của bộ phận chứa thẻ /
  người làm / tác giả PR) khi họ là MEMBER (`canAiCodeReview`). MEMBER thường, VIEWER, CLIENT: không.
- Agent: `ai.review` ∈ `AGENT_DENIED_ACTIONS`, tuyến `/code/review` ∈ `AGENT_DENIED_ROUTES`, service gọi `assertHumanActor`.
- Giảng viên (TEACHER) **hỏi CuongMini được** ở dự án mình (`canAskAssistant` / `requireAskAssistant`, cờ `permissions.askAi`)
  nhưng CHỈ ĐỌC: trợ lý chỉ mời đề xuất bình luận (+ `code_review`), Apply chạy dưới quyền người bấm. `ai.use` KHÔNG đổi
  (nó mở cả AI sơ đồ / SRS / biên bản…), luyện bảo vệ + quick task vẫn cần `ai.use`.

### Trần chi phí

- `WORK_AI_CODE_REVIEW_PER_DAY` (mặc định 30 lượt/dự án/ngày giờ VN; `0` = tắt hẳn), `WORK_AI_CODE_REVIEW_PER_USER_DAY`
  (15/người/ngày) — đếm nhật ký audit `review.ai_code`.
- Cộng hạn mức/tài trợ AI hiện có (`kiemHanMucAi`) + trần $/ngày của chuỗi cổng CT Work. Hai cú bấm cùng đích ⇒ một lượt.

### Test

```bash
npx tsx --test src/services/work/codeReview.test.ts src/services/work/permissions.test.ts src/services/work/toolRegistry/registry.test.ts
WORK_DB_TEST=1 npx tsx --test src/routes/work.codeReview.db.test.ts
```

## 3. CuongMini hỏi nhanh — gợi ý chuyển thẻ (`goiYChuyenThe.service.ts`)

Thẻ CỦA NGƯỜI DÙNG chưa Done có tín hiệu: PR nhắc KEY-n đã merge · commit nhắc KEY-n lên `main/master/develop/dev` ·
checklist trong mô tả tích đủ · thẻ con xong hết · thẻ "cơ bản" (cài đặt/setup/đọc/tìm hiểu…) nằm im ≥ 2 ngày (câu HỎI,
không khẳng định). Đích theo workflow thật (`chonDich`): cấu hình "PR merged ⇒ trạng thái" của dự án ⇒ cột Review ⇒ Done;
checklist/thẻ con/cơ bản ⇒ Done; thẻ đã ở cột Review ⇒ không hỏi người làm (việc của người review); đích không chuyển tới
được theo luật transition ⇒ không gợi ý.

- Web: thẻ "CuongMini hỏi nhanh" (≤ 3) ở Việc của tôi + đầu Board/Backlog. **Có** ⇒ `updateIssueAs` (quyền người đó,
  luật Done/DoD) + bình luận NỘI BỘ isAi kèm bằng chứng (link PR/commit, checklist) + ghi chú/ảnh tuỳ chọn. **Chưa** ⇒ hoãn 3
  ngày. Mỗi thẻ hiện một cửa sổ 24 giờ, rồi tối đa một lần / 3 ngày (`work_status_nudges`).
- REST: `GET /me/nudges`, `GET /projects/:pid/nudges`, `POST /projects/:pid/nudges/:num/apply|snooze`.
- MCP: `issue_extras` action `status_suggestions` / `status_suggestion_apply` / `status_suggestion_snooze`.
- Ask: người nói "xong rồi" ⇒ trợ lý đề xuất update_issue (trạng thái kế) + add_comment bằng chứng.
- Quyền: `issue.transition` (ADMIN/MEMBER); VIEWER/CLIENT/giảng viên không; agent cấm (`/nudges` ∈ AGENT_DENIED_ROUTES).

## 4. CuongMini làm thay trưởng nhóm — review cột Review (`reviewHangLoat.service.ts`)

**(A) Theo yêu cầu** — người được review (như §2) bấm "Review cùng CuongMini" (trang Reviews) hoặc hỏi "thẻ nào chờ tôi
review" (Ask: lệnh đọc `review_queue`, chỉ Ask, chỉ người được review; MCP: `review_manage` action `ai_review_queue`).
CuongMini xét ≤ 6 thẻ (Ask: 3) ở cột Review, 3 thẻ song song: thẻ (mô tả, "Xong khi", DoD, bình luận bằng chứng), chữ của
tệp đính kèm (ảnh: chỉ biết tên — model không nhìn ảnh), diff thật của PR/nhánh ⇒ mỗi thẻ DONE / BACK / KEEP + tiêu chí +
phát hiện + bình luận soạn sẵn. Còn BLOCKER/MAJOR hoặc tiêu chí "no" ⇒ không bao giờ DONE. Kết quả đệm 15 phút theo
`updatedAt` của thẻ (hỏi lại không tốn tiền). Người bấm bỏ chọn / sửa bình luận ⇒ `POST /code/review/queue/apply` chạy dưới
DANH TÍNH NGƯỜI BẤM (`updateIssueAs` via AI ⇒ applyIssueChange) + bình luận isAi có @nhắc người làm.

**(B) Tự động** — `settings.cuongMiniAutoReview` (mặc định TẮT; chỉ ADMIN dự án / trưởng dự án bật, audit
`review.ai_auto_on/off`; người bật = danh tính hành động; mất quyền ⇒ tự tắt). Quét 10 phút (`startAgentJobs`), ≤ 3 thẻ/lượt
(`maxPerRun`), thẻ đã xét chỉ xét lại khi thẻ đổi. Tự Done CHỈ khi `autoDoneOk`: mọi tiêu chí `yes` có bằng chứng, không
BLOCKER/MAJOR, PR đã merge nếu thẻ có code. Tự trả về In Progress chỉ khi `autoBackOk` (tiêu chí "no" / BLOCKER/MAJOR). Còn
lại: chỉ bình luận, để người xem. Mỗi lần: bình luận "CuongMini (thay mặt trưởng nhóm) …", chuông tóm tắt cho người bật,
nhật ký `work_ai_auto_reviews` + nút Hoàn tác (`POST /code/review/auto/:id/undo`, chỉ khi thẻ còn ở trạng thái CuongMini đặt).
Không bao giờ: merge PR, chấm điểm, quyết định Approvals, xoá.

Trần: chung với §2 — mỗi thẻ xét = một lượt (`review.ai_card`) trong `WORK_AI_CODE_REVIEW_PER_DAY`; theo người ×3 của
`WORK_AI_CODE_REVIEW_PER_USER_DAY`.

```bash
npx tsx --test src/services/work/goiYChuyenThe.test.ts src/services/work/reviewHangLoat.test.ts
WORK_DB_TEST=1 npx tsx --test src/routes/work.nudges.db.test.ts src/routes/work.reviewQueue.db.test.ts
```
