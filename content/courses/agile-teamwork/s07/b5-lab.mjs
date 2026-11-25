/**
 * 7.5 — Lab: một tuần với bốn vai (agl-7-5-lab — BÀI MỚI thêm vào khung, slug không trùng). Soạn 24/11/2026, agent agt.
 * Mốc dự án 7: bộ "bốn vai" trong repo (report lỗi JSON + tai-hien, sổ hỏi đáp + bảng ví dụ, spec thiết kế + so-thiet-ke, bảng thuật ngữ + soát thư + dự báo)
 * và một lệnh kiem-vai.sh. Chạy THẬT (scratchpad/agt/lab/ch7): lần 1 (11/03) mã thoát 1 — LF-B13 thiếu trường, Q-12 quá hạn; xử lý (đánh trùng LF-B12,
 * ghi câu trả lời GV) ⇒ lần 2 mã thoát 0. Toàn bộ lab chạy lại bằng lab/ch7/chay-het.sh.
 */
import { bang, cl, note, phongVan, thuatNgu, tomTat, giai, js, out, bash, ag, cs, ac, ng, vo } from '../_chung.mjs';
import { MA, RA } from './_ma.mjs';

export const L75 = (en) => {
  const t = (a, b) => (en ? a : b);
  return vo(en, 'Chapter 7 · Lesson 7.5 · Lab', 'Chương 7 · Bài 7.5 · Lab', `
<h2>${t('7.5 — Lab: one week with four roles', '7.5 — Lab: một tuần với bốn vai')}</h2>
<p class="lead">${t(
    'In a five-student team every member plays four roles besides "developer": tester of someone else’s screen, BA of their own screen, designer-checker of the shared look, and occasionally the person who writes to the supervisor. In this lab you put the tools of lessons 7.1–7.4 into your repository and run one week of LabFlow with them — including the day the check fails and what the team does about it.',
    'Trong nhóm năm sinh viên, mỗi thành viên đóng bốn vai ngoài "lập trình viên": tester màn của người khác, BA của màn của mình, người soát giao diện chung, và thỉnh thoảng là người viết thư cho giảng viên. Trong lab này bạn đưa công cụ của bài 7.1–7.4 vào repo và chạy một tuần LabFlow với chúng — kể cả hôm bộ kiểm báo đỏ và nhóm xử lý thế nào.')}</p>
${note(t('Time: about 3 hours. Needs Node 22 and Google Chrome (or Chromium). No container, no internet. Every output below was produced by running the files shown.', 'Thời gian: khoảng 3 giờ. Cần Node 22 và Google Chrome (hoặc Chromium). Không container, không cần mạng. Mọi output dưới đây đều có được bằng cách chạy đúng các tệp đã đưa.'))}

<h3>${t('Step 1 — The layout', 'Bước 1 — Bố cục')}</h3>
${out(`tools/vai/
├── bao-loi/            ${t('bug reports as JSON (one file per bug: LF-B12.json …)', 'bug report dạng JSON (mỗi bug một tệp: LF-B12.json …)')}
├── tai-hien.mjs        ${t('7.1 — replay a report on its build + time zone; --chi-soat = completeness only', '7.1 — chạy lại report trên đúng bản + múi giờ; --chi-soat = chỉ soát đủ trường')}
├── vong-doi.mjs        ${t('7.1 — ping-pong statistics from the CT Work export', '7.1 — thống kê bóng bàn từ tệp xuất CT Work')}
├── yeu-cau/            ${t('requirement notes + example tables (vi-du-q04.csv …)', 'ghi chép yêu cầu + bảng ví dụ (vi-du-q04.csv …)')}
├── soat-yeu-cau.mjs    ${t('7.2 — untestable words → questions', '7.2 — chữ không kiểm được → câu hỏi')}
├── vi-du.mjs           ${t('7.2 — run an example table on the real rule', '7.2 — chạy bảng ví dụ trên quy tắc thật')}
├── thiet-ke/           ${t('one spec JSON per screen (spec-s22.json …)', 'mỗi màn một spec JSON (spec-s22.json …)')}
├── so-thiet-ke.mjs     ${t('7.3 — computed styles + contrast + states in headless Chrome', '7.3 — style đã tính + tương phản + trạng thái trong Chrome headless')}
├── mau/thuat-ngu.csv   ${t('7.4 — glossary for the supervisor / client', '7.4 — bảng thuật ngữ cho giảng viên / khách')}
├── mau/hoi-dap.csv     ${t('7.2 — the question log (one row per question)', '7.2 — sổ câu hỏi (mỗi câu một dòng)')}
├── soat-thuat-ngu.mjs  ${t('7.4 — linter for outgoing messages', '7.4 — bộ soát thư gửi đi')}
├── du-bao.mjs          ${t('7.4 — Monte Carlo forecast from real throughput', '7.4 — dự báo Monte Carlo từ thông lượng thật')}
└── kiem-vai.sh         ${t('one command for all four roles (exit code 0/1)', 'một lệnh cho cả bốn vai (mã thoát 0/1)')}`)}
<p>${t('Copy the files from lessons 7.1–7.4 into this layout. Then add the one script that ties them together:', 'Chép các tệp của bài 7.1–7.4 vào bố cục này. Rồi thêm script nối tất cả lại:')}</p>
${bash(MA.kiemVai)}
${cl('info', `<p>${t(
    '<code>set -o pipefail</code> is not decoration. The first version of this script piped every check into <code>sed</code> for indentation and printed "ĐẠT" (pass) while LF-B13 was clearly incomplete: the exit code of a pipeline is the exit code of its <em>last</em> command, so <code>sed</code>’s 0 hid the failure. A guard that always passes is worse than no guard — test the failing case on purpose, as in chapter 6.',
    '<code>set -o pipefail</code> không phải trang trí. Bản đầu của script này đưa mọi bước kiểm qua <code>sed</code> để thụt lề và in "ĐẠT" trong khi LF-B13 rõ ràng thiếu trường: mã thoát của một ống lệnh là mã thoát của lệnh <em>cuối cùng</em>, nên số 0 của <code>sed</code> che mất lỗi. Một rào chắn lúc nào cũng cho qua còn tệ hơn không có rào — hãy cố ý thử ca hỏng, như ở chương 6.')}</p>`)}

<h3>${t('Step 2 — The week, day by day', 'Bước 2 — Một tuần, từng ngày')}</h3>
${bang([t('Day (sprint 3)', 'Ngày (sprint 3)'), t('Role', 'Vai'), t('What happens', 'Việc xảy ra'), t('Tool', 'Công cụ')], [
    [t('Mon 01/03', 'T2 01/03'), 'BA', t('Meeting with the supervisor; 8 requirement lines; 11 questions; send the closed ones (Q-04, Q-07, Q-09, Q-10)', 'Gặp giảng viên; 8 dòng yêu cầu; 11 câu hỏi; gửi các câu đã đóng (Q-04, Q-07, Q-09, Q-10)'), '<code>soat-yeu-cau.mjs</code>, <code>hoi-dap.csv</code>'],
    [t('Wed 03/03', 'T4 03/03'), t('BA + tester', 'BA + tester'), t('Answer to Q-04; three amigos for S22; v1 rule 5/6 → v2 6/6', 'Có trả lời Q-04; ba bên cho S22; quy tắc v1 5/6 → v2 6/6'), '<code>vi-du.mjs</code>'],
    [t('Fri 05/03', 'T6 05/03'), t('Designer', 'Designer'), t('S22 merged; checked against Figma: 13 deviations → fixed; QĐ-07 recorded', 'S22 merge; so với Figma: 13 lệch → sửa; ghi QĐ-07'), '<code>so-thiet-ke.mjs</code>'],
    [t('Sat 06/03', 'T7 06/03'), t('Tester', 'Tester'), t('Cross-test on staging: LF-B12 (complete), LF-B13 (four words)', 'Test chéo trên staging: LF-B12 (đủ), LF-B13 (bốn chữ)'), '<code>tai-hien.mjs</code>'],
    [t('Mon 08/03', 'T2 08/03'), 'BA', t('New question Q-12 to the supervisor, deadline 10/03', 'Câu hỏi mới Q-12 gửi giảng viên, hạn 10/03'), '<code>hoi-dap.csv</code>'],
    [t('Tue 09/03', 'T3 09/03'), t('Developer', 'Lập trình viên'), t('LF-B12 fixed (gioVN), LF-B14 found and covered', 'Sửa LF-B12 (gioVN), phát hiện và phủ LF-B14'), '<code>tai-hien.mjs --phien-ban v2</code>'],
    [t('Thu 11/03', 'T5 11/03'), t('Leader', 'Trưởng nhóm'), t('Before the daily: <code>kiem-vai.sh</code> → red', 'Trước daily: <code>kiem-vai.sh</code> → đỏ'), '<code>kiem-vai.sh</code>'],
    [t('Fri 12/03', 'T6 12/03'), t('Client-facing', 'Đối ngoại'), t('Forecast + message to the supervisor; bug statistics for the retro', 'Dự báo + thư gửi giảng viên; số liệu bug cho retro'), '<code>du-bao.mjs</code>, <code>soat-thuat-ngu.mjs</code>, <code>vong-doi.mjs</code>'],
  ])}

<h3>${t('Step 3 — Thursday: the check is red', 'Bước 3 — Thứ Năm: bộ kiểm báo đỏ')}</h3>
${out(RA.kiemVai1)}
<p>${t('Two items, two owners, decided at the daily in two minutes:', 'Hai mục, hai người chịu trách nhiệm, chốt ở daily trong hai phút:')}</p>
<ul>
  <li>${t('<strong>LF-B13</strong> — C2 is asked privately (lesson 6.5: never in the group) what they saw. It was the same 07:00 rejection as LF-B12. C2 marks it duplicate; the report file gets <code>"trungVoi": "LF-B12"</code>, and <code>tai-hien.mjs</code> accepts that as a valid closed state.', '<strong>LF-B13</strong> — hỏi riêng C2 (bài 6.5: không bao giờ hỏi giữa nhóm) đã thấy gì. Đó chính là lỗi từ chối 07:00 của LF-B12. C2 đánh dấu trùng; tệp report thêm <code>"trungVoi": "LF-B12"</code>, và <code>tai-hien.mjs</code> chấp nhận đó là trạng thái đóng hợp lệ.')}</li>
  <li>${t('<strong>Q-12</strong> — one day past its deadline and blocking S31. The leader sends one reminder with the proposal and the consequence ("if no answer by tonight we build A"), the supervisor answers A by email the same day, and the row is updated with the answer and its date.', '<strong>Q-12</strong> — quá hạn một ngày và đang chặn S31. Trưởng nhóm gửi một lời nhắc kèm đề xuất và hệ quả ("nếu tới tối nay chưa có trả lời, nhóm làm theo A"), giảng viên trả lời A qua email ngay trong ngày, và dòng đó được cập nhật kèm câu trả lời và ngày.')}</li>
</ul>
${out(RA.kiemVai2)}
${note(t(
    'In the lab files, <code>phan-75.sh</code> applies these two changes, runs the check again, then restores the originals so the whole lab can be replayed with <code>chay-het.sh</code>.',
    'Trong tệp lab, <code>phan-75.sh</code> áp hai thay đổi này, chạy lại bộ kiểm, rồi trả các tệp về bản gốc để cả lab chạy lại được bằng <code>chay-het.sh</code>.'))}

<h3>${t('Step 4 — Friday: three numbers for the retro', 'Bước 4 — Thứ Sáu: ba con số cho retro')}</h3>
${bang([t('Number', 'Con số'), t('This week', 'Tuần này'), t('Source', 'Nguồn')], [
    [t('Ping-pong rounds per bug (complete / incomplete report)', 'Số vòng bóng bàn mỗi bug (report đủ / thiếu)'), '0.4 / 1.1', '<code>vong-doi.mjs</code>'],
    [t('Open questions past their deadline', 'Câu hỏi quá hạn chưa trả lời'), t('1 on Thursday → 0', '1 hôm thứ Năm → 0'), '<code>kiem-vai.sh</code>'],
    [t('Chance of finishing iteration 3 (14 screens) by 16/04', 'Khả năng xong iteration 3 (14 màn) trước 16/04'), '68 %', '<code>du-bao.mjs</code>'],
  ])}
<p>${t('Each number has an action attached: a required "environment" field in the bug template; reminders the day before a question’s deadline; the supervisor chooses the two "if time allows" screens.', 'Mỗi con số gắn với một hành động: trường "môi trường" bắt buộc trong mẫu bug; nhắc trước một ngày khi câu hỏi sắp tới hạn; giảng viên chọn hai màn "nếu kịp".')}</p>

<h3>🛠 ${t('Project milestone 7 — your team’s four-role kit', 'Mốc dự án 7 — bộ bốn vai của nhóm bạn')}</h3>
<ol>
  <li>${t('Create <code>tools/vai/</code> in your SWP391 repository with the layout above, adapted to your topic (your screens, your rules).', 'Tạo <code>tools/vai/</code> trong repo SWP391 của bạn theo bố cục trên, chỉnh theo đề tài của bạn (màn của bạn, quy tắc của bạn).')}</li>
  <li>${t('Write a spec JSON for at least two screens (yours and one other person’s), with all four states.', 'Viết spec JSON cho ít nhất hai màn (màn của bạn và màn của một người khác), đủ bốn trạng thái.')}</li>
  <li>${t('Start the question log with every untestable line of your SRS, as closed questions.', 'Mở sổ câu hỏi với mọi dòng không kiểm được trong SRS của bạn, ở dạng câu đóng.')}</li>
  <li>${t('One example table per business rule that has a boundary (dates, limits, roles).', 'Mỗi quy tắc nghiệp vụ có biên (ngày, giới hạn, vai trò) có một bảng ví dụ.')}</li>
  <li>${t('Run <code>kiem-vai.sh</code> before every daily for one week; make it fail on purpose once to prove it can.', 'Chạy <code>kiem-vai.sh</code> trước mỗi daily trong một tuần; cố ý làm nó báo đỏ một lần để chứng minh nó chặn được.')}</li>
</ol>
${bang([t('Criterion', 'Tiêu chí'), t('Points', 'Điểm')], [
    [t('Bug reports replayable by script; at least one "cannot reproduce" resolved by environment', 'Bug report chạy lại được bằng script; ít nhất một ca "không tái hiện" được giải bằng môi trường'), '20'],
    [t('Question log: closed questions with proposal, deadline, what it blocks; answers dated', 'Sổ câu hỏi: câu đóng có đề xuất, hạn, việc bị chặn; câu trả lời có ngày'), '20'],
    [t('Example tables run on the real rule and caught at least one disagreement', 'Bảng ví dụ chạy trên quy tắc thật và bắt được ít nhất một bất đồng'), '20'],
    [t('Two screen specs with four states and contrast; approved deviations recorded', 'Spec hai màn đủ bốn trạng thái và tương phản; lệch đã duyệt có ghi lại'), '20'],
    [t('One message to the supervisor that passes the linter and contains a forecast range', 'Một thư gửi giảng viên qua bộ soát và có khoảng dự báo'), '10'],
    [t('<code>kiem-vai.sh</code> shown failing and then passing', '<code>kiem-vai.sh</code> được cho thấy báo đỏ rồi qua'), '10'],
  ])}
${giai(t('Self-check before you call the milestone done', 'Tự soát trước khi coi là xong mốc'), `<ul>
  <li>${t('Does <code>kiem-vai.sh</code> return exit code 1 when you delete the "moiTruong" field of a report? (pipefail)', '<code>kiem-vai.sh</code> có trả mã thoát 1 khi bạn xoá trường "moiTruong" của một report không? (pipefail)')}</li>
  <li>${t('Does at least one example row test a boundary (the last allowed day, the closing time)?', 'Có ít nhất một dòng ví dụ kiểm biên (ngày cuối được phép, giờ đóng cửa) không?')}</li>
  <li>${t('Has every "X can do Y" in your SRS a matching "who must not" question?', 'Mọi câu "X được làm Y" trong SRS đã có câu hỏi "ai không được" tương ứng chưa?')}</li>
  <li>${t('Does your forecast message state its assumptions?', 'Thư dự báo của bạn có nói rõ giả định không?')}</li>
</ul>`)}
<p>${t('Then: ', 'Tiếp theo: ')}${ag('agl-7-6-quiz', t('7.6 — Chapter 7 quiz', '7.6 — Kiểm tra Chương 7'))}. ${t('In the capstone (', 'Ở dự án cuối khoá (')}${ag('agl-9-2-thuc-hien', t('lesson 12.2', 'bài 12.2'))}${t(') you run this kit together with the communication kit of chapter 6 for a whole sprint.', ') bạn chạy bộ này cùng bộ giao tiếp của chương 6 trọn một sprint.')}</p>
`);
};

export default {
  title: '7.5 — Lab: one week with four roles|||7.5 — Lab: một tuần với bốn vai',
  slug: 'agl-7-5-lab',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Mốc dự án 7: gom công cụ bài 7.1–7.4 vào tools/vai/ (report lỗi JSON + tai-hien, sổ hỏi đáp + bảng ví dụ, spec màn + so-thiet-ke, bảng thuật ngữ + soát thư + dự báo) và một lệnh kiem-vai.sh; bản đầu luôn "ĐẠT" vì ống lệnh che mã thoát ⇒ set -o pipefail; một tuần sprint 3 từng ngày; thứ Năm 11/03 bộ kiểm báo đỏ (LF-B13 thiếu trường, Q-12 quá hạn) ⇒ xử lý ⇒ mã thoát 0; ba con số cho retro; phiếu chấm 100 điểm.',
  content: L75(true) + L75(false),
};
