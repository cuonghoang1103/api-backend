/**
 * 5.4 — Báo cáo sau sự cố (postmortem) (agl-5-4-postmortem). Soạn 24/11/2026, agent agt.
 * Lab chạy THẬT: scratchpad/agt/lab/ch5/kb-su-co.sh (repo git có lịch sử quanh sự cố), dong-thoi-gian.mjs (git log + log CI + chat),
 * soat-postmortem.mjs, su-co/pm-v1.md, pm-v2.md; output Flyway thật từ lab 3.3 (lab/ch3/out-ngoai-thu-tu.txt) — qua ./_ma.mjs.
 * Phát hiện khi soạn: git log --since=2027-02-22 lấy GIỜ HIỆN TẠI của ngày đó ⇒ bỏ sót merge lúc 10:05; phải ghi --since=2027-02-22T00:00.
 * Nguồn (đọc 24/11): Google SRE Book ch.15 "Postmortem Culture: Learning from Failure" (sre.google); GitLab, "Postmortem of database
 * outage of January 31" (about.gitlab.com — ~300 GB bị xoá, pg_dump 9.2 vs PostgreSQL 9.6, email cảnh báo bị từ chối vì DMARC,
 * ~5.000 project, 5.000 bình luận, 700 tài khoản mới mất dữ liệu 17:20–00:00 UTC).
 * Ranh giới: mẫu postmortem từng mục ⇒ incident-response 10.2; họp rà soát ⇒ ir 10.5; postmortem một lỗi + 5 Whys ⇒ debug 11.3.
 */
import { bang, cl, note, phongVan, thuatNgu, tomTat, giai, js, out, ag, cs, ng, vo } from '../_chung.mjs';
import { MA, RA } from './_ma.mjs';

const pm = (n) => RA.soatPm.split(/\n(?=\$ node soat-postmortem)/)[n];

export const L54 = (en) => {
  const t = (a, b) => (en ? a : b);
  return vo(en, 'Chapter 5 · Lesson 5.4', 'Chương 5 · Bài 5.4', `
<h2>${t('5.4 — Incident postmortems', '5.4 — Báo cáo sau sự cố (postmortem)')}</h2>
<p class="lead">${t(
    'Something will break during the project: staging dies the night before a review, someone pushes a password, the database is wiped. What the leader does in the next 48 hours decides whether the team learns from it or just learns to hide things. A postmortem is a short, blameless write-up: what happened, minute by minute, why the system allowed it, and the specific changes — each with an owner and a date — that make it less likely.',
    'Trong dự án chắc chắn sẽ có thứ hỏng: staging chết đêm trước buổi review, ai đó đẩy mật khẩu lên repo, CSDL bị xoá. Việc trưởng nhóm làm trong 48 giờ sau quyết định nhóm học được từ nó hay chỉ học cách giấu. Postmortem là bản viết ngắn, không đổ lỗi: chuyện gì xảy ra, theo từng phút, vì sao hệ thống để nó xảy ra, và những thay đổi cụ thể — mỗi cái có chủ và hạn — làm nó khó lặp lại.')}</p>
${note(t('Every section of a full postmortem template: ', 'Từng mục của mẫu postmortem đầy đủ: ') + cs('incident-response', 'ir-10-2-mau', 'Incident response 10.2') + t('; running the review meeting: ', '; tổ chức buổi họp rà soát: ') + cs('incident-response', 'ir-10-5-buoi-hop', 'Incident response 10.5') + t('; a small postmortem for a single bug with 5 Whys: ', '; postmortem nhỏ cho một lỗi với 5 Whys: ') + cs('debug-co-phuong-phap', 'dbg-11-3-postmortem-nho', t('Debugging 11.3', 'Debug 11.3')) + t('. Here: a <em>student team’s</em> incident, a timeline rebuilt from real data, and the leader’s job of keeping it blameless.', '. Ở đây: sự cố của <em>một nhóm sinh viên</em>, dòng thời gian dựng lại từ dữ liệu thật, và việc của trưởng nhóm là giữ nó không đổ lỗi.'))}

<h3>${t('Blameless — and why it is not "soft"', 'Không đổ lỗi — và vì sao đó không phải "dễ dãi"')}</h3>
<p>${t('Google’s SRE book (chapter ', 'Sách SRE của Google (chương ')}${ng('https://sre.google/sre-book/postmortem-culture/', '"Postmortem Culture: Learning from Failure"')}${t(
    ') puts it plainly: a blameless postmortem "must focus on identifying the contributing causes of the incident without indicting any individual or team", and assumes "everyone involved in an incident had good intentions and did the right thing with the information they had". The reason is practical: "You can’t ‘fix’ people, but you can fix systems and processes". If the member who caused the outage is shamed, next time the outage is hidden until the demo — and you find out in front of the committee.',
    ') nói thẳng: postmortem không đổ lỗi "phải tập trung xác định các nguyên nhân góp phần mà không buộc tội cá nhân hay đội nào", và giả định "mọi người liên quan đều có thiện chí và đã làm điều đúng với thông tin họ có". Lý do rất thực tế: "Bạn không thể ‘sửa’ con người, nhưng có thể sửa hệ thống và quy trình". Nếu thành viên gây sự cố bị bêu tên, lần sau sự cố sẽ bị giấu tới tận buổi demo — và bạn biết chuyện trước mặt hội đồng.')}</p>

<h3>${t('Everyday picture: the burnt rice cooker', 'Liên tưởng đời thường: nồi cơm cháy ở phòng trọ')}</h3>
<p>${t(
    '"Nam burnt the rice again" changes nothing; Nam will be more careful for a week. "The cooker has no auto-off, the rice is put on at 6, and everyone leaves for class at 6:15" leads to a fix: a cooker with keep-warm, or a rule that whoever leaves last checks the kitchen. Same event, two write-ups — only one prevents the next one.',
    '"Nam lại làm cháy cơm" không thay đổi gì; Nam sẽ cẩn thận được một tuần. "Nồi không tự ngắt, cơm bắc lúc 6 giờ, 6 giờ 15 cả phòng đi học" dẫn tới cách sửa: nồi có chế độ giữ ấm, hoặc luật ai ra khỏi phòng cuối cùng thì xem bếp. Cùng một chuyện, hai cách viết — chỉ một cách ngăn được lần sau.')}</p>

${cl('danger', `<p><strong>${t('Real incident: GitLab.com, 31 January 2017', 'Sự cố thật: GitLab.com, 31/01/2017')}</strong> — ${t(
    'While fighting a replication problem late at night, an engineer ran a directory wipe on the primary database server instead of the secondary; "around 300 GB of data had already been removed" before the engineer stopped it. Then every backup method failed: the backup job used <code>pg_dump</code> 9.2 against a PostgreSQL 9.6 database and errored, and the error notifications were sent by email that was "rejected by the receiver" because of DMARC — "we were never aware of the backups failing, until it was too late". About 5,000 projects, 5,000 comments and 700 new accounts lost six hours of changes. GitLab published ', 'Đang gỡ sự cố sao chép giữa đêm, một kỹ sư chạy lệnh xoá thư mục dữ liệu trên máy chủ CSDL chính thay vì máy phụ; "khoảng 300 GB dữ liệu đã bị xoá" trước khi người đó kịp dừng. Rồi mọi cách sao lưu đều hỏng: job sao lưu dùng <code>pg_dump</code> 9.2 với CSDL PostgreSQL 9.6 nên báo lỗi, và thông báo lỗi gửi bằng email bị "máy nhận từ chối" vì DMARC — "chúng tôi không hề biết sao lưu đã hỏng, cho tới khi quá muộn". Khoảng 5.000 project, 5.000 bình luận và 700 tài khoản mới mất sáu giờ thay đổi. GitLab công bố ')}${ng('https://about.gitlab.com/blog/postmortem-of-database-outage-of-january-31/', t('a public postmortem', 'một postmortem công khai'))}${t(
    ' that did not name or blame the engineer: the real causes were runbooks that did not explain normal behaviour, backups nobody had tested restoring, and alerts that went to a place nobody looked. Keep the last one in mind — it happens to LabFlow below.',
    ' không nêu tên hay đổ lỗi cho kỹ sư: nguyên nhân thật là tài liệu vận hành không giải thích hành vi bình thường, sao lưu chưa ai thử khôi phục, và cảnh báo gửi tới nơi không ai nhìn. Hãy nhớ điều cuối — nó xảy ra với LabFlow ngay dưới đây.')}</p>`)}

<h3>${t('When the team writes one', 'Khi nào nhóm viết postmortem')}</h3>
${bang([t('Trigger', 'Điều kiện'), t('LabFlow example', 'Ví dụ LabFlow')], [
    [t('Staging or the demo environment down for more than a few hours', 'Staging hoặc môi trường demo hỏng quá vài giờ'), t('This lesson: 11 h 50 min', 'Bài này: 11 giờ 50 phút')],
    [t('A secret pushed to the repo (even if removed quickly)', 'Một bí mật bị đẩy lên repo (kể cả xoá ngay)'), t('Lesson 10.7', 'Bài 10.7')],
    [t('Data lost or corrupted', 'Mất hoặc hỏng dữ liệu'), t('Seed data overwritten on the shared DB', 'Dữ liệu mẫu bị ghi đè trên CSDL dùng chung')],
    [t('A deadline or review missed because of a technical problem', 'Trễ hạn hay hỏng buổi review vì sự cố kỹ thuật'), t('Main red for 2 days before iteration end', 'main đỏ 2 ngày trước khi hết iteration')],
    [t('Anyone on the team asks for one', 'Bất kỳ ai trong nhóm yêu cầu'), t('—', '—')],
  ])}

<h3>${t('Lab: rebuild the timeline from three sources', 'Lab: dựng lại dòng thời gian từ ba nguồn')}</h3>
<p>${t(
    'The incident is the one you ran for real with Flyway in ', 'Sự cố chính là cái bạn đã chạy thật với Flyway ở ')}${ag('agl-3-3-ci', t('lesson 3.3', 'bài 3.3'))}${t(
    ': PR #34 brought migration V4 to staging on Monday; PR #29 (opened a week earlier with V3) merged on Tuesday night. Flyway’s real answer:',
    ': PR #34 đưa migration V4 lên staging hôm thứ Hai; PR #29 (mở từ tuần trước, mang V3) merge tối thứ Ba. Câu trả lời thật của Flyway:')}</p>
${out(MA.ngoaiThuTu.split('### Thứ Tư')[0].trim())}
<p>${t(
    'Memories disagree within a day ("I think it broke in the morning?"). Timestamps do not. Three sources already have them: <code>git log</code>, the CI log, and the team chat exported as text. The script merges and sorts them, marks long silences, and computes the three numbers every postmortem needs:',
    'Trí nhớ đã lệch nhau chỉ sau một ngày ("hình như sáng mới hỏng?"). Dấu thời gian thì không. Ba nguồn đã có sẵn: <code>git log</code>, log CI, và nhóm chat xuất ra văn bản. Script ghép và xếp chúng, đánh dấu khoảng lặng dài, và tính ba con số postmortem nào cũng cần:')}</p>
${js(MA.dongThoiGian)}
<p>${t('The inputs (CI log and chat):', 'Đầu vào (log CI và chat):')}</p>
${out(MA.ciLog)}
${out(MA.chat)}
${out(RA.suCo)}
${cl('info', `<p>${t(
    'A real trap found while building this lab: the first version used <code>git log --since=2027-02-22</code> and silently dropped the 10:05 merge of PR #34. Git reads a bare date as "that day at the <em>current</em> time of day", so the result changes with the hour you run it. Always give a time: <code>--since=2027-02-22T00:00</code>. A timeline missing its first event would have hidden half the cause.',
    'Một cái bẫy thật gặp khi dựng lab này: bản đầu dùng <code>git log --since=2027-02-22</code> và lặng lẽ bỏ mất lần merge PR #34 lúc 10:05. Git hiểu một ngày trần là "ngày đó vào <em>giờ hiện tại</em>", nên kết quả đổi theo giờ bạn chạy. Luôn ghi giờ: <code>--since=2027-02-22T00:00</code>. Một dòng thời gian thiếu sự kiện đầu tiên sẽ giấu mất một nửa nguyên nhân.')}</p>`)}
<p>${t(
    'Read the numbers: detection took <strong>11 h 29 min</strong>, the fix took <strong>21 minutes</strong>. The problem to solve is not "fix faster" — it is "find out sooner". Exactly GitLab’s lesson: the alert existed, as an email to one inbox nobody watched at night. Also notice the last line: a question at 16:05 reveals that the quick fix plus the revert left staging with a table the code no longer knows about — a second, quieter problem.',
    'Đọc con số: phát hiện mất <strong>11 giờ 29 phút</strong>, sửa mất <strong>21 phút</strong>. Vấn đề cần giải không phải "sửa nhanh hơn" — mà là "biết sớm hơn". Đúng bài học của GitLab: cảnh báo có tồn tại, dưới dạng một email vào một hòm thư không ai xem ban đêm. Để ý cả dòng cuối: một câu hỏi lúc 16:05 cho thấy bản sửa tạm cộng lần revert đã để staging còn một bảng mà mã không còn biết tới — vấn đề thứ hai, im lặng hơn.')}</p>

<h3>${t('Two write-ups of the same night', 'Hai bản viết về cùng một đêm')}</h3>
<p>${t('What a tired team writes at 1 a.m.:', 'Bản một nhóm mệt mỏi viết lúc 1 giờ sáng:')}</p>
${out(MA.pmV1)}
<p>${t('A checker for the problems that are easy to spot by machine:', 'Một script bắt những lỗi máy dễ thấy:')}</p>
${js(MA.soatPm)}
${out(pm(0))}
<p>${t(
    'Three sentences name a person next to a judgement, and both actions are wishes ("be more careful", "learn the lesson") with no owner, no date, no way to check them. Notice also what the checker did <em>not</em> flag: "C1 also did not read the CI mail" names a person without a blame keyword. A machine filter only narrows the search; the facilitator still reads every sentence.',
    'Ba câu đặt tên người cạnh một lời phán xét, và cả hai hành động đều là mong ước ("cẩn thận hơn", "rút kinh nghiệm") không chủ, không hạn, không cách nào kiểm. Để ý cả điều script <em>không</em> bắt: "C1 cũng không đọc mail CI" nêu tên một người mà không có từ khoá quy lỗi. Bộ lọc máy chỉ thu hẹp chỗ cần tìm; người điều phối vẫn phải đọc từng câu.')}</p>
<p>${t('The version the team reviewed the next afternoon:', 'Bản nhóm rà soát chiều hôm sau:')}</p>
${out(MA.pmV2)}
${out(pm(1))}

<h3>${t('What changed between the two', 'Hai bản khác nhau ở đâu')}</h3>
${bang([t('Blaming version', 'Bản đổ lỗi'), t('Blameless version', 'Bản không đổ lỗi')], [
    [t('"C1 merged without checking"', '"C1 merge mà không kiểm tra"'), t('"Numbers were taken when the branch was created; the rule relied on reviewers’ eyes; CI did not check order"', '"Số lấy lúc tạo nhánh; luật dựa vào mắt người review; CI không kiểm thứ tự"')],
    [t('"C1 did not read the mail"', '"C1 không đọc mail"'), t('"The only alert was an email to one inbox; the team works in chat; nobody was on watch"', '"Cảnh báo duy nhất là email vào một hòm thư; nhóm làm việc trên chat; không ai trực"')],
    [t('One cause', 'Một nguyên nhân'), t('A chain of five whys plus a side effect of the fix', 'Chuỗi năm câu vì sao cộng một tác dụng phụ của bản sửa')],
    [t('"Be more careful" — everyone', '"Cẩn thận hơn" — cả nhóm'), t('Four actions: prevent, detect, mitigate — one owner, one date, one ticket each', 'Bốn hành động: ngăn, phát hiện, giảm nhẹ — mỗi cái một chủ, một hạn, một ticket')],
    [t('No numbers', 'Không có số'), t('11 h 50 min impact, 11 h 29 min to detect, no data lost', 'Ảnh hưởng 11 giờ 50 phút, 11 giờ 29 phút mới phát hiện, không mất dữ liệu')],
  ])}
<p>${t(
    'Note who wrote it: C1, the person who merged PR #29, facilitated the review. When the leader describes their own part first and calmly, everyone else stops defending themselves. The postmortem then produced ADR 0007 (lesson 5.2) — the old rule "reviewers will catch it" was superseded, not quietly forgotten.',
    'Để ý ai viết: C1, người đã merge PR #29, điều phối buổi rà soát. Khi trưởng nhóm kể phần của chính mình trước và bình tĩnh, mọi người thôi phòng thủ. Postmortem sau đó sinh ra ADR 0007 (bài 5.2) — luật cũ "người review sẽ bắt" bị thay thế, không phải lặng lẽ bị quên.')}</p>

<h3>${t('Running the 30-minute review', 'Điều hành buổi rà soát 30 phút')}</h3>
${bang([t('Minutes', 'Phút'), t('What', 'Làm gì')], [
    ['0–3', t('Facilitator reads the ground rule aloud: we fix systems, not people.', 'Người điều phối đọc to luật: sửa hệ thống, không sửa người.')],
    ['3–12', t('Walk the generated timeline; anyone can add an event they remember — with its source.', 'Đi qua dòng thời gian đã sinh; ai nhớ thêm sự kiện thì bổ sung — kèm nguồn.')],
    ['12–22', t('Contributing causes: ask "what made this the reasonable thing to do at the time?", not "why did you do that?".', 'Nguyên nhân góp phần: hỏi "điều gì khiến việc đó là hợp lý vào lúc đó?", không hỏi "sao bạn lại làm thế?".')],
    ['22–30', t('Actions: at least one that prevents and one that detects; each gets a single owner, a date, a ticket in CT Work.', 'Hành động: ít nhất một cái ngăn và một cái phát hiện; mỗi cái một chủ, một hạn, một ticket trên CT Work.')],
  ])}
<p>${t(
    'A postmortem is finished when its actions are done, not when the document is written. Put the tickets into the next sprint and check them at the next planning. Tell your supervisor in the weekly report — briefly, factually, with what changed (', 'Postmortem chỉ xong khi các hành động xong, không phải khi viết xong tài liệu. Đưa ticket vào sprint kế tiếp và kiểm ở buổi planning sau. Báo giảng viên trong báo cáo tuần — ngắn, đúng sự thật, kèm điều đã thay đổi (')}${ag('agl-6-3-bao-cao', t('lesson 6.3', 'bài 6.3'))}${t('). A supervisor who already heard "staging was down 12 hours, here is why and what we changed" will not be surprised at the review.', '). Giảng viên đã nghe "staging hỏng 12 giờ, nguyên nhân thế này, nhóm đã đổi thế này" sẽ không bất ngờ ở buổi review.')}</p>

${cl('warn', `<p><strong>${t('Exercise 5.4', 'Bài tập 5.4')}</strong> — ${t(
    '(a) Rewrite the three flagged sentences of the blaming version so they describe the system. (b) Suppose action LF-71 had existed: the red deploy posts to the team chat, and C4 sees it at 21:55. Add that line to the chat and rerun the timeline. How much does the impact shrink? What does that tell you about action LF-71 on its own?',
    '(a) Viết lại ba câu bị bắt của bản đổ lỗi sao cho chúng mô tả hệ thống. (b) Giả sử hành động LF-71 đã có: deploy đỏ báo vào chat nhóm, và C4 thấy lúc 21:55. Thêm dòng đó vào chat rồi chạy lại dòng thời gian. Ảnh hưởng giảm được bao nhiêu? Điều đó nói gì về riêng hành động LF-71?')}</p>
${giai(t('Answers and the real rerun', 'Đáp án và lần chạy lại thật'), `<p>${t('(a) For example:', '(a) Ví dụ:')}</p>
<ul>
<li>${t('"PR #29 merged at 21:40 with migration V3 while staging was already at V4; nothing checked migration order before merge."', '"PR #29 merge lúc 21:40 với migration V3 khi staging đã ở V4; không có gì kiểm thứ tự migration trước khi merge."')}</li>
<li>${t('"PR #34 merged first; the team had no way to see which migration numbers other open branches had taken."', '"PR #34 merge trước; nhóm không có cách nào thấy các nhánh đang mở đã lấy số migration nào."')}</li>
<li>${t('"Contributing cause: the numbering rule (ADR 0003) depended on reviewers noticing duplicates."', '"Nguyên nhân góp phần: luật đánh số (ADR 0003) phụ thuộc vào việc người review để ý số trùng."')}</li>
</ul>
<p>${t('(b) Real output:', '(b) Output thật:')}</p>
${out(RA.baiTap.split('### BT 5.4')[1].replace(/^[^\n]*\n/, ''))}
<p>${t(
    'Detection drops from 11 h 29 min to 14 minutes — but the impact barely changes (still 11 h 50 min), because seeing an alert is not handling it: C4 asked C1, and C1 was asleep. An alert needs a responder. Add to LF-71: "the person who merges watches staging for 30 minutes after a merge, or does not merge after 21:00" — and LF-70 (CI blocking the PR) remains the action that would have prevented the night entirely.',
    'Phát hiện giảm từ 11 giờ 29 phút xuống 14 phút — nhưng ảnh hưởng gần như không đổi (vẫn 11 giờ 50 phút), vì thấy cảnh báo chưa phải là xử lý: C4 nhờ C1, mà C1 đã ngủ. Cảnh báo cần người nhận việc. Bổ sung cho LF-71: "người merge theo dõi staging 30 phút sau khi merge, hoặc không merge sau 21 giờ" — và LF-70 (CI chặn PR) vẫn là hành động đã có thể ngăn trọn cả đêm đó.')}</p>`)}`)}

<h3>${t('At work: incident reports to the client', 'Khi đi làm: báo cáo sự cố cho khách')}</h3>
<p>${t(
    'On Japanese outsourcing projects, an incident on the client’s system usually produces a formal incident report (障害報告書) with a timeline, root cause and recurrence-prevention measures (再発防止策), often in a fixed Excel template, reviewed by the client. Inside the team the analysis should still be blameless; to the client, what matters is that the <em>process</em> cause and the countermeasures are concrete and dated. As a trainee you will most often contribute the timeline: exact times, exact commands, exact log lines. And the hourensou rule from ',
    'Ở dự án outsourcing Nhật, sự cố trên hệ thống của khách thường kéo theo một báo cáo sự cố chính thức (障害報告書) có dòng thời gian, nguyên nhân gốc và biện pháp chống tái diễn (再発防止策), thường theo mẫu Excel cố định, được khách duyệt. Trong đội, phân tích vẫn nên không đổ lỗi; với khách, điều quan trọng là nguyên nhân về <em>quy trình</em> và biện pháp phải cụ thể, có hạn. Là thực tập sinh, phần bạn hay đóng góp nhất là dòng thời gian: đúng giờ, đúng lệnh, đúng dòng log. Và luật hourensou ở ')}${ag('agl-9-7-bao-cao-hourensou', t('lesson 9.7', 'bài 9.7'))}${t(
    ' applies: report the problem the moment you notice it — a 14-minute detection is worthless if you then wait until morning to say something.',
    ' áp dụng: báo vấn đề ngay khi thấy — phát hiện trong 14 phút cũng vô nghĩa nếu bạn chờ tới sáng mới lên tiếng.')}</p>

${phongVan([
    [t('"Tell me about a time something went wrong in your project."', '"Kể về một lần dự án của bạn gặp sự cố."'), t('Staging rejected a migration and stayed broken for almost 12 hours before a review. I merged the PR that triggered it. We rebuilt the timeline from git, CI and chat: fixing took 21 minutes, detecting took 11 and a half hours, because the only alert was an email. We added a CI check for migration order and moved alerts to the team chat, and recorded the change as an ADR.', 'Staging từ chối một migration và hỏng gần 12 giờ trước buổi review. Chính mình là người merge PR gây ra nó. Nhóm dựng lại dòng thời gian từ git, CI và chat: sửa mất 21 phút, phát hiện mất 11 tiếng rưỡi, vì cảnh báo duy nhất là một email. Nhóm thêm bước CI kiểm thứ tự migration, chuyển cảnh báo vào chat nhóm, và ghi thay đổi thành ADR.')],
    [t('"What does blameless mean? Doesn’t anyone take responsibility?"', '"Không đổ lỗi nghĩa là gì? Vậy không ai chịu trách nhiệm à?"'), t('People own their actions — I said in the review that I merged it. Blameless means we analyse why the system let a reasonable action cause harm, because punishing people makes them hide problems, and fixing the system prevents the next person from repeating it.', 'Mọi người nhận phần việc của mình — mình đã nói trong buổi rà soát rằng mình merge. Không đổ lỗi nghĩa là phân tích vì sao hệ thống để một hành động hợp lý gây hại, vì phạt người làm họ giấu sự cố, còn sửa hệ thống thì người sau không lặp lại.')],
    [t('"What makes a good action item?"', '"Hành động khắc phục tốt là thế nào?"'), t('Specific and checkable, with one owner, a date and a ticket; a mix of prevention, detection and mitigation. "Be more careful" is not an action.', 'Cụ thể và kiểm được, một chủ, một hạn, một ticket; có cả ngăn, phát hiện và giảm nhẹ. "Cẩn thận hơn" không phải hành động.')],
    [t('"What did GitLab’s 2017 outage teach the industry?"', '"Sự cố GitLab 2017 dạy ngành điều gì?"'), t('That a backup you have never restored is not a backup, and that alerts sent somewhere nobody looks are no alerts. Also that a public, blameless postmortem can build trust instead of destroying it.', 'Rằng bản sao lưu chưa từng khôi phục thử thì không phải sao lưu, và cảnh báo gửi tới nơi không ai nhìn thì không phải cảnh báo. Và rằng một postmortem công khai, không đổ lỗi có thể xây dựng niềm tin thay vì phá huỷ nó.')],
  ], en)}

${thuatNgu([
    ['postmortem', t('A written review after an incident: timeline, causes, actions.', 'Bản rà soát sau sự cố: dòng thời gian, nguyên nhân, hành động.')],
    ['blameless', t('Analysing system causes without indicting individuals.', 'Phân tích nguyên nhân hệ thống mà không buộc tội cá nhân.')],
    [t('time to detect / mitigate', 'thời gian phát hiện / giảm nhẹ'), t('From start to first human awareness / to the service working again.', 'Từ lúc bắt đầu tới khi có người biết / tới khi dịch vụ chạy lại.')],
    [t('contributing cause', 'nguyên nhân góp phần'), t('One of several conditions that together allowed the incident.', 'Một trong nhiều điều kiện cùng nhau cho phép sự cố xảy ra.')],
    [t('action item', 'hành động khắc phục'), t('A concrete change with owner, date and ticket; type prevent/detect/mitigate.', 'Thay đổi cụ thể có chủ, hạn, ticket; loại ngăn/phát hiện/giảm nhẹ.')],
  ], en)}

${tomTat([
    t('Blameless is practical: you cannot fix people, you can fix systems; shamed people hide the next incident.', 'Không đổ lỗi là thực tế: không sửa được người, sửa được hệ thống; người bị bêu tên sẽ giấu sự cố sau.'),
    t('Build the timeline from timestamps (git, CI, chat), not memory — and give git a time, not a bare date.', 'Dựng dòng thời gian từ dấu thời gian (git, CI, chat), không từ trí nhớ — và đưa git một giờ cụ thể, không chỉ ngày.'),
    t('LabFlow’s numbers: 21 minutes to fix, 11 h 29 min to detect — the email alert nobody read, like GitLab 2017.', 'Số của LabFlow: 21 phút để sửa, 11 giờ 29 phút để phát hiện — cảnh báo email không ai đọc, như GitLab 2017.'),
    t('Actions have one owner, a date, a ticket, and include both prevention and detection; detection without a responder changes little.', 'Hành động có một chủ, một hạn, một ticket, có cả ngăn và phát hiện; phát hiện mà không có người nhận việc thì thay đổi rất ít.'),
    t('The leader goes first about their own part; the postmortem ends when the actions are done.', 'Trưởng nhóm kể phần của mình trước; postmortem chỉ xong khi hành động xong.'),
  ], en)}
<p>${t('Next: ', 'Bài tiếp: ')}${ag('agl-5-5-lab', t('5.5 — Lab: LabFlow’s documentation set', '5.5 — Lab: bộ tài liệu của LabFlow'))}.</p>
`);
};

export default {
  title: '5.4 — Incident postmortems|||5.4 — Báo cáo sau sự cố (postmortem)',
  slug: 'agl-5-4-postmortem',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Postmortem không đổ lỗi theo SRE của Google; sự cố GitLab 31/01/2017 (300 GB, sao lưu hỏng, email cảnh báo bị DMARC chặn); lab chạy thật: dựng dòng thời gian sự cố staging của LabFlow từ git log + log CI + chat (phát hiện 11 giờ 29 phút, sửa 21 phút; bẫy git --since); bản đổ lỗi vs bản không đổ lỗi soát bằng script (13 lỗi vs 0) và giới hạn của máy; 5 câu vì sao; hành động ngăn/phát hiện/giảm nhẹ; buổi rà soát 30 phút; báo cáo sự cố cho khách Nhật.',
  content: L54(true) + L54(false),
};
