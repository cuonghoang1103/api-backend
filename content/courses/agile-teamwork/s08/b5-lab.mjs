/**
 * 8.5 — Lab: hai tuần đầu, có kiểm (agl-8-5-lab — bài THÊM vào khung 24/11/2026, agent agt).
 * Gom công cụ bài 8.1–8.4 thành một hồ sơ hai tuần đầu + một lệnh kiem-2-tuan.sh (mã thoát = số phần trượt);
 * chạy thật trên hồ sơ vội (0/4, mã thoát 4) và hồ sơ chắc (4/4, mã thoát 0). Mốc dự án 8: bộ đón thành viên cho nhóm SWP391
 * + bộ chuẩn bị OJT của chính bạn (sổ thành tích bắt đầu từ SP27).
 */
import { bang, cl, note, giai, bash, js, out, ag, cs, vo } from '../_chung.mjs';
import { MA, RA } from './_ma.mjs';

export const L85 = (en) => {
  const t = (a, b) => (en ? a : b);
  return vo(en, 'Chapter 8 · Lab', 'Chương 8 · Lab', `
<h2>${t('8.5 — Lab: your first two weeks, checked', '8.5 — Lab: hai tuần đầu, có kiểm')}</h2>
<p class="lead">${t(
    'Four lessons, four artefacts: a one-page map (8.1), the questions you sent (8.2), your first PR (8.3) and a 30-60-90 plan (8.4). This lab puts them in one folder and one command, so that at the end of week two you — and your mentor — can see in ten seconds whether the basics are in place. Then the project milestone turns the same kit around: you are the SWP391 leader onboarding four teammates.',
    'Bốn bài, bốn sản phẩm: bản đồ một trang (8.1), các câu hỏi đã gửi (8.2), PR đầu tiên (8.3) và kế hoạch 30-60-90 (8.4). Lab này gom chúng vào một thư mục và một lệnh, để cuối tuần thứ hai bạn — và mentor — thấy trong mười giây phần nền đã đủ chưa. Rồi mốc dự án lật ngược bộ đó: bạn là trưởng nhóm SWP391 đón bốn thành viên.')}</p>

<h3>${t('Step 1 — The folder', 'Bước 1 — Thư mục')}</h3>
${out('ho-so/\n├── ban-do.md          # 8.1 — mục ## Chạy, ## Gói và người hỏi, ## Rủi ro\n├── cau-hoi/*.txt      # 8.2 — mọi câu hỏi đã gửi trong 2 tuần\n├── nhanh.txt          # 8.3 — tên nhánh của PR đầu tiên\n├── pr.md              # 8.3 — mô tả PR (Vì sao · Đã đổi gì · Cách kiểm · Rủi ro)\n└── 30-60-90.md        # 8.4 — kế hoạch đã thống nhất với mentor')}
<p>${t('The map of the strong folder — short, but every line answers a question a newcomer actually has:', 'Bản đồ trong hồ sơ chắc — ngắn, nhưng dòng nào cũng trả lời một câu người mới thật sự cần:')}</p>
${out(MA.banDoV2)}

<h3>${t('Step 2 — One command over the four checkers', 'Bước 2 — Một lệnh gọi bốn bộ soát')}</h3>
${bash(MA.kiem2Tuan)}
<p>${t(
    'Two design choices learned earlier in this course: <code>set -o pipefail</code>, because each checker is piped into <code>sed</code>/<code>grep</code> and without it a red checker would look green (lesson 7.5); and an exit code equal to the number of failed parts, so a script or CI job can use it.',
    'Hai lựa chọn thiết kế đã học trước đó trong khoá: <code>set -o pipefail</code>, vì mỗi bộ soát được đưa qua ống vào <code>sed</code>/<code>grep</code> và thiếu nó thì bộ soát đỏ trông như xanh (bài 7.5); và mã thoát bằng số phần trượt, để script hay CI dùng được.')}</p>

<h3>${t('Step 3 — The hurried two weeks', 'Bước 3 — Hai tuần vội')}</h3>
${out(RA['2TuanV1'])}
<p>${t(
    'Every part fails, and each failure is a specific, fixable thing — not "you are not good enough". The map is two lines with no "who to ask"; one question would have leaked a token; the first PR renamed a public function; the plan has no checkable goal. A mentor reading this in week two can help in one 1:1 instead of discovering it at the three-month review.',
    'Phần nào cũng trượt, và mỗi chỗ trượt là một việc cụ thể sửa được — không phải "bạn chưa đủ giỏi". Bản đồ có hai dòng, không có "hỏi ai"; một câu hỏi suýt làm lộ token; PR đầu tiên đổi tên hàm công khai; kế hoạch không có mục tiêu nào kiểm được. Mentor đọc cái này ở tuần thứ hai có thể giúp trong một buổi 1:1, thay vì phát hiện ra ở buổi đánh giá ba tháng.')}</p>

<h3>${t('Step 4 — The same two weeks, done carefully', 'Bước 4 — Cùng hai tuần đó, làm cẩn thận')}</h3>
${out(RA['2TuanV2'])}
${cl('warn', `<p>${t(
    '<strong>4/4 is the floor, not the goal.</strong> The checker cannot see whether you asked the right question (XY, lesson 8.2), whether your map is true (petclinic’s grep map was wrong twice, 8.1) or whether your goals are the right goals. It catches the cheap mistakes so that your mentor’s attention goes to the expensive ones.',
    '<strong>4/4 là mức sàn, không phải mục tiêu.</strong> Bộ soát không thấy được bạn có hỏi đúng câu không (XY, bài 8.2), bản đồ của bạn có đúng không (bản đồ grep của petclinic sai hai chỗ, 8.1) hay mục tiêu có phải mục tiêu đúng không. Nó bắt lỗi rẻ để sự chú ý của mentor dành cho lỗi đắt.')}</p>`)}

<h3>🛠 ${t('Project milestone 8 — two kits', 'Mốc dự án 8 — hai bộ công cụ')}</h3>
<p><strong>${t('A. The onboarding kit for your SWP391 team (you are the leader)', 'A. Bộ đón thành viên cho nhóm SWP391 (bạn là trưởng nhóm)')}</strong></p>
<ol>
  <li>${t('README tested on a teammate’s laptop, not yours; record their onboarding log (8.1) and merge the fixes before iteration 1 coding starts.', 'README được thử trên laptop của một thành viên, không phải của bạn; ghi nhật ký onboarding của họ (8.1) và merge các chỗ sửa trước khi iteration 1 bắt đầu code.')}</li>
  <li>${t('<code>docs/ban-do.md</code>: modules/screens → owner → who to ask, generated where possible (5.1’s <code>ban-do.mjs</code>).', '<code>docs/ban-do.md</code>: module/màn → người phụ trách → hỏi ai, sinh tự động khi được (<code>ban-do.mjs</code> của bài 5.1).')}</li>
  <li>${t('One tiny "first ticket" per member, each through branch → CI → review → merge, with <code>kiem-pr-dau.mjs</code> adapted to your CONTRIBUTING.', 'Mỗi thành viên một "ticket đầu tiên" rất nhỏ, mỗi ticket đi đủ nhánh → CI → review → merge, với <code>kiem-pr-dau.mjs</code> chỉnh theo CONTRIBUTING của nhóm.')}</li>
  <li>${t('A team rule for questions: the 15–30 minute rule, ask in the group channel, eight parts, no secrets (8.2) — pinned in the chat.', 'Luật hỏi của nhóm: quy tắc 15–30 phút, hỏi trong kênh chung, đủ tám phần, không bí mật (8.2) — ghim trong nhóm chat.')}</li>
  <li>${t('A 10-minute 1:1 with each member every two weeks, using the three headings (8.4); notes kept privately.', 'Mỗi hai tuần một buổi 1:1 10 phút với từng thành viên, theo ba mục cố định (8.4); ghi chú giữ riêng.')}</li>
</ol>
<p><strong>${t('B. Your own OJT-preparation kit', 'B. Bộ chuẩn bị OJT của chính bạn')}</strong></p>
<ol>
  <li>${t('Start <code>viec.csv</code> now, during SP27: one line per thing you deliver as leader, with a measured result. By the OJT application it becomes your CV and STAR stories.', 'Mở <code>viec.csv</code> ngay từ bây giờ, trong kỳ SP27: mỗi việc bạn giao được với vai trưởng nhóm một dòng, kèm kết quả đo được. Tới lúc nộp OJT nó thành CV và câu chuyện STAR.')}</li>
  <li>${t('Draft the 30-60-90 plan you will propose to your OJT mentor, and make it pass <code>kiem-muc-tieu.mjs</code>.', 'Soạn sẵn kế hoạch 30-60-90 bạn sẽ đề xuất với mentor OJT, cho nó qua <code>kiem-muc-tieu.mjs</code>.')}</li>
  <li>${t('Practise the map on one real public Spring Boot repo (petclinic or another) and keep the result in your notes.', 'Luyện bản đồ trên một repo Spring Boot công khai thật (petclinic hoặc repo khác) và giữ kết quả trong ghi chú.')}</li>
</ol>
${bang([t('Criterion', 'Tiêu chí'), t('Points', 'Điểm')], [
    [t('README verified on another member’s machine; onboarding log + merged fixes', 'README được kiểm trên máy thành viên khác; có nhật ký onboarding + chỗ sửa đã merge'), '20'],
    [t('Map with owners and "who to ask", checked against the real code at least once', 'Bản đồ có người phụ trách và "hỏi ai", đã đối chiếu với mã thật ít nhất một lần'), '15'],
    [t('Every member merged a first PR through the full flow; checker output attached', 'Mọi thành viên đã merge PR đầu tiên qua đủ quy trình; kèm output bộ soát'), '25'],
    [t('Question rule pinned; at least one question rewritten after the checker', 'Luật hỏi được ghim; ít nhất một câu hỏi được viết lại sau khi soát'), '10'],
    [t('1:1 notes with actions, followed up at the next 1:1', 'Ghi chú 1:1 có việc cần làm, được xem lại ở buổi sau'), '15'],
    [t('Your own brag log started with measured results; 30-60-90 passes the checker', 'Sổ thành tích của bạn đã bắt đầu, có kết quả đo; 30-60-90 qua bộ soát'), '15'],
  ])}
${giai(t('Self-check before you call the milestone done', 'Tự soát trước khi coi là xong mốc'), `<ul>
  <li>${t('Does <code>kiem-2-tuan.sh</code> return a non-zero code when you delete the "## Rủi ro" heading from the map? Try it.', '<code>kiem-2-tuan.sh</code> có trả mã khác 0 khi bạn xoá tiêu đề "## Rủi ro" khỏi bản đồ không? Thử đi.')}</li>
  <li>${t('Did the member who had the hardest setup write the README fix (not you)?', 'Người cài đặt vất vả nhất có phải là người viết chỗ sửa README không (chứ không phải bạn)?')}</li>
  <li>${t('Is any production or shared credential written in your README or chat? (8.1, 8.2)', 'Có thông tin đăng nhập production hay dùng chung nào nằm trong README hoặc nhóm chat không? (8.1, 8.2)')}</li>
  <li>${t('Does each brag line say what changed for someone, not just what you did?', 'Mỗi dòng sổ thành tích có nói điều gì đã thay đổi cho ai đó, chứ không chỉ việc bạn làm?')}</li>
</ul>`)}
${note(t('All repositories in this chapter are local: petclinic is only read (git log, source text), and <code>lich-hen-api</code> is rebuilt by <code>lam-ticket.sh</code>. To rerun everything: <code>chay-het.sh</code> in the chapter’s lab folder.', 'Mọi repo trong chương đều ở máy: petclinic chỉ được đọc (git log, chữ trong mã), còn <code>lich-hen-api</code> được dựng lại bằng <code>lam-ticket.sh</code>. Chạy lại tất cả: <code>chay-het.sh</code> trong thư mục lab của chương.'))}
<p>${t('Then: ', 'Tiếp theo: ')}${ag('agl-8-6-quiz', t('8.6 — Chapter 8 quiz', '8.6 — Kiểm tra Chương 8'))}. ${t('Chapter 9 (', 'Chương 9 (')}${ag('agl-9-1-mo-hinh-hop-dong', t('9.1', '9.1'))}${t(') continues with how outsourcing projects actually run — the world your OJT mentor works in.', ') đi tiếp vào cách dự án outsourcing thật sự vận hành — thế giới mentor OJT của bạn đang làm việc.')}</p>
`);
};

export default {
  title: '8.5 — Lab: your first two weeks, checked|||8.5 — Lab: hai tuần đầu, có kiểm',
  slug: 'agl-8-5-lab',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Gom bản đồ một trang, câu hỏi đã gửi, PR đầu tiên và kế hoạch 30-60-90 vào một hồ sơ và một lệnh kiem-2-tuan.sh (pipefail, mã thoát = số phần trượt); chạy thật: hồ sơ vội 0/4 (mã thoát 4), hồ sơ chắc 4/4; 4/4 là mức sàn — máy không thấy XY hay bản đồ sai. Mốc dự án 8: bộ đón thành viên cho nhóm SWP391 (README thử trên máy người khác, bản đồ hỏi ai, ticket đầu cho mỗi người, luật hỏi, 1:1) và bộ chuẩn bị OJT của chính bạn.',
  content: L85(true) + L85(false),
};
