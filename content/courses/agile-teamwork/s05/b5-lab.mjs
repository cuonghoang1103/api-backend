/**
 * 5.5 — Lab: bộ tài liệu của LabFlow (agl-5-5-lab, bài THÊM vào khung). Soạn 24/11/2026, agent agt.
 * Lab chạy THẬT: scratchpad/agt/lab/ch5/kb-lab.sh (gộp README + ADR + RFC + postmortem vào repo, CI ci/kiem-tai-lieu.sh xanh → đỏ → xanh),
 * chay-readme.mjs (container node:22-alpine) — qua ./_ma.mjs. Mốc dự án 🛠 của Chương 5.
 */
import { cl, note, bang, giai, bash, out, ag, cs, vo } from '../_chung.mjs';
import { MA, RA } from './_ma.mjs';

const lab = (a, b) => { const s = RA.lab; const i = s.indexOf(a); return s.slice(i, b ? s.indexOf(b, i + 1) : undefined).trim(); };

export const L55 = (en) => {
  const t = (a, b) => (en ? a : b);
  return vo(en, 'Chapter 5 · Lab', 'Chương 5 · Lab', `
<h2>${t('5.5 — Lab: LabFlow’s documentation set', '5.5 — Lab: bộ tài liệu của LabFlow')}</h2>
<p class="lead">${t(
    'Put the four documents of this chapter into the repo, next to the code, and give them the same protection as code: a CI step that fails when the README is stale, the decision log is broken, a proposal goes out without a deadline, or a postmortem blames a person. Every output below is from a real run; try each step before opening the answer.',
    'Đưa bốn loại tài liệu của chương vào repo, cạnh mã, và bảo vệ chúng như bảo vệ mã: một bước CI đỏ khi README lỗi thời, sổ quyết định hỏng, đề xuất gửi đi không có hạn, hay postmortem đổ lỗi cho người. Mọi output dưới đây là chạy thật; hãy tự làm từng bước trước khi mở đáp án.')}</p>
${note(t('You need the scripts from lessons 5.1–5.4 (<code>ban-do.mjs</code>, <code>adr.mjs</code>, <code>kiem-rfc.mjs</code>, <code>soat-postmortem.mjs</code>, <code>chay-readme.mjs</code>), Node 22 and Docker. The local CI from ', 'Cần các script của bài 5.1–5.4 (<code>ban-do.mjs</code>, <code>adr.mjs</code>, <code>kiem-rfc.mjs</code>, <code>soat-postmortem.mjs</code>, <code>chay-readme.mjs</code>), Node 22 và Docker. CI cục bộ ở ') + ag('agl-3-3-ci', t('lesson 3.3', 'bài 3.3')) + t(' gets one more step; putting it on GitHub Actions is in the ', ' có thêm một bước; đưa lên GitHub Actions xem khoá ') + cs('github-actions', 'ga-15-1-ci-cho-pr', 'GitHub Actions 15.1') + t(' course.', '.'))}

<h3>${t('Step 1 — The layout', 'Bước 1 — Bố cục')}</h3>
<p>${t('Target tree (under the repo root, next to <code>fe/</code> and <code>be/</code>):', 'Cây thư mục đích (ở gốc repo, cạnh <code>fe/</code> và <code>be/</code>):')}</p>
${out(lab('$ find docs', '$ ci/kiem-tai-lieu.sh'))}
${bang([t('Path', 'Đường dẫn'), t('Source of truth for', 'Nguồn sự thật cho'), t('Generated?', 'Sinh tự động?')], [
    ['README.md', t('How to run; who owns which screen', 'Chạy thế nào; ai phụ trách màn nào'), t('Screen table: yes, from docs/phan-cong.csv', 'Bảng màn: có, từ docs/phan-cong.csv')],
    ['docs/adr/', t('Decisions and why', 'Quyết định và lý do'), t('Index README.md: yes, adr.mjs ds', 'Mục lục README.md: có, adr.mjs ds')],
    ['docs/rfc/', t('Proposals under discussion / archived', 'Đề xuất đang bàn / đã lưu'), t('No', 'Không')],
    ['docs/postmortem/', t('What went wrong and what changed', 'Điều đã hỏng và điều đã đổi'), t('Timeline section: from dong-thoi-gian.mjs', 'Phần dòng thời gian: từ dong-thoi-gian.mjs')],
  ])}

<h3>${t('Step 2 — One CI step for all documents', 'Bước 2 — Một bước CI cho mọi tài liệu')}</h3>
<p>${t(
    'Write <code>ci/kiem-tai-lieu.sh</code>: run every checker, print all failures (not just the first), exit 1 if any is red. Then run it on the assembled repo.',
    'Viết <code>ci/kiem-tai-lieu.sh</code>: chạy mọi bộ soát, in đủ mọi lỗi (không chỉ lỗi đầu), exit 1 nếu có bộ nào đỏ. Rồi chạy trên repo đã gộp.')}</p>
${giai(t('Reference script and the first run', 'Script tham khảo và lần chạy đầu'), `${bash(MA.kiemTaiLieu)}
${out(lab('$ ci/kiem-tai-lieu.sh', '### Tuần 9'))}`)}

<h3>${t('Step 3 — Week 9: three PRs at once', 'Bước 3 — Tuần 9: ba PR cùng lúc')}</h3>
<p>${t(
    'Simulate a normal busy week: C5 takes over S24 (edits the CSV, forgets the README); C4 adds the RFC-002 draft from exercise 5.3; C3 adds the hurried "Use Redis" ADR from lesson 5.2. Predict which checks go red and with what message, then run.',
    'Mô phỏng một tuần bận bình thường: C5 nhận thêm S24 (sửa CSV, quên README); C4 thêm bản nháp RFC-002 ở bài tập 5.3; C3 thêm ADR "Dùng Redis" viết vội ở bài 5.2. Đoán bộ soát nào đỏ và báo gì, rồi chạy.')}</p>
${giai(t('Real output', 'Output thật'), out(lab('### Tuần 9', '### Sửa:')))}

<h3>${t('Step 4 — Fix, the right way', 'Bước 4 — Sửa, đúng cách')}</h3>
<ul>
<li>${t('README: do not edit the table by hand — regenerate it.', 'README: không sửa bảng bằng tay — sinh lại.')}</li>
<li>${t('RFC-002: give option B its trade-off; give the open question an owner and a date.', 'RFC-002: thêm đánh đổi cho phương án B; cho câu hỏi mở một người và một hạn.')}</li>
<li>${t('ADR 0008: the reviewer asks "slow compared to what?". C3 measures (1.8 s on staging, target 0.5 s), finds a repeated query, and rewrites the ADR — the decision becomes "not Redis yet".', 'ADR 0008: người review hỏi "chậm so với cái gì?". C3 đo (1,8 giây ở staging, mục tiêu 0,5 giây), tìm ra truy vấn lặp, và viết lại ADR — quyết định thành "chưa dùng Redis".')}</li>
</ul>
${giai(t('Real output after the fixes', 'Output thật sau khi sửa'), out(lab('### Sửa:')))}
${cl('info', `<p>${t(
    'The most valuable fix here was not made by a machine: the lint only said "no decision sentence, no price"; the human question "compared to what?" turned an unnecessary new service into a database index. Keep both layers.',
    'Bản sửa giá trị nhất ở đây không do máy làm: bộ soát chỉ nói "không có câu quyết định, không có cái giá"; câu hỏi của người "so với cái gì?" đã biến một dịch vụ mới không cần thiết thành một chỉ mục CSDL. Giữ cả hai lớp.')}</p>`)}

<h3>${t('Step 5 — The README on a clean machine', 'Bước 5 — README trên máy sạch')}</h3>
<p>${t('Run <code>chay-readme.mjs</code> on the final README (lesson 5.1). It must reach the last block.', 'Chạy <code>chay-readme.mjs</code> với README cuối (bài 5.1). Phải chạy tới khối cuối.')}</p>
${giai(t('Real output', 'Output thật'), out(RA.readme.split(/\n(?=\$ node chay-readme)/)[2]))}

<h3>🛠 ${t('Project milestone 5 — your team’s documentation', 'Mốc dự án 5 — tài liệu của nhóm bạn')}</h3>
<p>${t('Do this on your real SWP391 repo (or the course project you chose in lesson 0.8):', 'Làm trên repo SWP391 thật của nhóm (hoặc dự án xuyên khoá bạn chọn ở bài 0.8):')}</p>
<ol>
<li>${t('README with the six sections; screen table generated from your assignment file; tested on a clean container <em>and</em> by one person outside the team (record their time).', 'README đủ sáu phần; bảng màn sinh từ tệp phân công; đã chạy thử trên container sạch <em>và</em> nhờ một người ngoài nhóm làm theo (ghi lại thời gian của họ).')}</li>
<li>${t('At least four ADRs for decisions your team has <em>already</em> made (work split, merge style, error codes, migration rule…); at least one superseded.', 'Ít nhất bốn ADR cho những quyết định nhóm <em>đã</em> đưa ra (chia việc, kiểu merge, mã lỗi, luật migration…); ít nhất một ADR bị thay thế.')}</li>
<li>${t('One RFC for your riskiest iteration-3 feature, sent to the supervisor with a comment deadline.', 'Một RFC cho tính năng rủi ro nhất của iteration 3, gửi giảng viên kèm hạn góp ý.')}</li>
<li>${t('One postmortem — for a real incident if you had one, otherwise for a drill (break staging on purpose, time how long until someone notices).', 'Một postmortem — cho sự cố thật nếu đã có, nếu chưa thì cho một buổi diễn tập (cố ý làm hỏng staging, bấm giờ tới khi có người phát hiện).')}</li>
<li>${t('<code>ci/kiem-tai-lieu.sh</code> runs on every PR.', '<code>ci/kiem-tai-lieu.sh</code> chạy trên mọi PR.')}</li>
</ol>
${cl('ok', `<p><strong>${t('Done when', 'Đạt khi')}</strong></p><ul>
<li>${t('The documentation CI step is green on main and has been red at least once on a PR (proof it checks something).', 'Bước CI tài liệu xanh trên main và đã từng đỏ ít nhất một lần ở một PR (bằng chứng nó kiểm thật).')}</li>
<li>${t('A person outside the team ran the project from the README in under 30 minutes without asking anyone.', 'Một người ngoài nhóm chạy được dự án theo README trong dưới 30 phút mà không phải hỏi ai.')}</li>
<li>${t('Every ADR has a "We will …" decision and at least one (−) consequence; every postmortem action has one owner, a date and a ticket in CT Work.', 'Mọi ADR có câu quyết định "Chúng ta sẽ …" và ít nhất một hệ quả (−); mọi hành động trong postmortem có một chủ, một hạn và một ticket trên CT Work.')}</li>
<li>${t('You can answer "why did your team do it this way?" for any decision by opening one file.', 'Bạn trả lời được "vì sao nhóm làm thế này?" cho bất kỳ quyết định nào bằng cách mở một tệp.')}</li>
</ul>`)}
<p>${t('Next: ', 'Bài tiếp: ')}${ag('agl-5-6-quiz', t('5.6 — Chapter 5 quiz', '5.6 — Kiểm tra Chương 5'))}.</p>
`);
};

export default {
  title: '5.5 — Lab: LabFlow’s documentation set|||5.5 — Lab: bộ tài liệu của LabFlow',
  slug: 'agl-5-5-lab',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Lab chạy thật: gộp README, sổ ADR, RFC và postmortem vào repo LabFlow; viết bước CI kiem-tai-lieu.sh; tuần 9 ba PR cùng lúc làm CI đỏ (README lỗi thời, ADR thiếu quyết định, RFC thiếu đánh đổi + hạn) rồi sửa đúng cách — ADR "dùng Redis" lật thành "chưa dùng Redis" sau khi đo; README chạy hết trên máy sạch; mốc dự án 5 cho repo SWP391 thật.',
  content: L55(true) + L55(false),
};
