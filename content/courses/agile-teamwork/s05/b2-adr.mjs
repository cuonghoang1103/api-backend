/**
 * 5.2 — Ghi quyết định kiến trúc (ADR) (agl-5-2-adr). Soạn 24/11/2026, agent agt.
 * Lab chạy THẬT: scratchpad/agt/lab/ch5/mau/labflow/scripts/adr.mjs + kb-adr.sh (git 2.55.0, Node 22.22.2) — qua ./_ma.mjs.
 * Nguồn (đọc 24/11): Michael Nygard, "Documenting Architecture Decisions", Cognitect blog 15/11/2011 (Status proposed/accepted/
 * deprecated/superseded; "one or two pages long"; "conversation with a future developer"); ThoughtWorks Technology Radar —
 * Lightweight Architecture Decision Records: Adopt (11/2017, nhắc lại 05/2018); adr.github.io.
 * Ranh giới: đọc ngược quyết định khi người viết cũ đã nghỉ ⇒ doc-code-cu 8.4.
 */
import { bang, cl, note, phongVan, thuatNgu, tomTat, giai, js, out, ag, cs, ng, vo } from '../_chung.mjs';
import { MA, RA } from './_ma.mjs';

const doan = (bd, kt) => { const s = RA.adr; const i = s.indexOf(bd); return s.slice(i, kt ? s.indexOf(kt, i + 1) : undefined).trim(); };

export const L52 = (en) => {
  const t = (a, b) => (en ? a : b);
  return vo(en, 'Chapter 5 · Lesson 5.2', 'Chương 5 · Bài 5.2', `
<h2>${t('5.2 — Architecture decision records', '5.2 — Ghi quyết định kiến trúc (ADR)')}</h2>
<p class="lead">${t(
    'The hardest question at a project defence is rarely "what did you build" — it is "why did you do it this way?". By week 12 nobody remembers why the team split work by screen, why the API returns 404 instead of 403, or why migrations are numbered the way they are. An architecture decision record is one short page per decision, kept in the repo, written while the reasons are still fresh.',
    'Câu hỏi khó nhất ở buổi bảo vệ hiếm khi là "nhóm làm gì" — mà là "vì sao làm thế này?". Tới tuần 12 không ai nhớ vì sao nhóm chia việc theo màn, vì sao API trả 404 thay vì 403, hay vì sao migration đánh số như vậy. Bản ghi quyết định kiến trúc (ADR) là một trang ngắn cho mỗi quyết định, nằm trong repo, viết lúc lý do còn nóng.')}</p>
${note(t('Recovering decisions <em>after</em> the author has left — asking around, reading history, writing the ADR retroactively — is ', 'Khôi phục quyết định <em>sau khi</em> người viết đã nghỉ — hỏi quanh, đọc lịch sử, viết ADR bù — ở ') + cs('doc-code-cu-va-refactor', 'lgc-8-4-nguoi-viet-cu', t('Reading legacy code 8.4', 'Đọc code cũ 8.4')) + t('. Here the team writes ADRs as it goes, and the leader keeps the log honest.', '. Ở đây nhóm viết ADR ngay khi làm, và trưởng nhóm giữ cho sổ luôn trung thực.'))}

<h3>${t('Where ADRs come from', 'ADR từ đâu ra')}</h3>
<p>${t(
    'Michael Nygard proposed the format in a blog post on 15 November 2011, ', 'Michael Nygard đề xuất mẫu này trong một bài blog ngày 15/11/2011, ')}${ng('https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions', '"Documenting Architecture Decisions"')}${t(
    ': each decision gets a short file with <em>Context</em>, <em>Decision</em>, <em>Status</em> and <em>Consequences</em>; "the whole document should be one or two pages long", written "as if it is a conversation with a future developer". A decision may be "proposed", "accepted", and later "deprecated" or "superseded" with a reference to its replacement. Consequences list "all" effects, "not just the positive ones". ThoughtWorks’ Technology Radar moved lightweight ADRs to <strong>Adopt</strong> in November 2017, recommending they live in source control next to the code. Templates and tools: ',
    ': mỗi quyết định một tệp ngắn gồm <em>Bối cảnh</em>, <em>Quyết định</em>, <em>Trạng thái</em> và <em>Hệ quả</em>; "cả tài liệu nên dài một hoặc hai trang", viết "như một cuộc trò chuyện với người lập trình tương lai". Quyết định có thể "đề xuất", "chấp nhận", rồi sau đó "lỗi thời" hoặc "bị thay thế" kèm liên kết tới bản thay. Hệ quả liệt kê "mọi" tác động, "không chỉ mặt tốt". Technology Radar của ThoughtWorks đưa ADR gọn nhẹ lên mức <strong>Adopt</strong> (nên dùng) từ 11/2017, khuyên để chúng trong kho mã cạnh mã nguồn. Mẫu và công cụ: ')}${ng('https://adr.github.io/', 'adr.github.io')}.</p>

<h3>${t('Everyday picture: the class fund meeting', 'Liên tưởng đời thường: buổi họp quỹ lớp')}</h3>
<p>${t(
    'In September the class agreed to collect 50,000 VND a month instead of 200,000 once. By December someone asks "why monthly? It is so annoying". If the minutes say "because several people could not pay 200,000 at once; downside: the treasurer chases people every month", the argument ends in one minute. If not, the class argues again from zero. An ADR is that one paragraph — for code.',
    'Tháng 9 lớp thống nhất thu quỹ 50 nghìn mỗi tháng thay vì 200 nghìn một lần. Tới tháng 12 có người hỏi "sao lại thu từng tháng, phiền thế". Nếu biên bản ghi "vì vài bạn không đóng nổi 200 nghìn một lần; cái giá: thủ quỹ phải nhắc mỗi tháng", tranh luận kết thúc trong một phút. Nếu không, cả lớp cãi lại từ đầu. ADR là đúng đoạn đó — cho mã.')}</p>

<h3>${t('Which decisions deserve an ADR', 'Quyết định nào đáng một ADR')}</h3>
${bang([t('Write one when…', 'Viết khi…'), t('LabFlow example', 'Ví dụ LabFlow'), t('Do not bother when…', 'Không cần khi…')], [
    [t('It is expensive to reverse', 'Đảo ngược tốn kém'), t('Split work by screen, not FE/BE', 'Chia việc theo màn, không chia FE/BE'), t('It is a variable name', 'Là tên một biến')],
    [t('The team argued more than ~10 minutes', 'Nhóm cãi quá ~10 phút'), t('404 vs 403 for someone else’s booking (lesson 4.4)', '404 hay 403 với lịch của người khác (bài 4.4)'), t('One person decides inside their own screen', 'Một người tự quyết trong màn của mình')],
    [t('It affects how everyone works', 'Ảnh hưởng cách mọi người làm'), t('Squash merge; migration numbering', 'Squash merge; đánh số migration'), t('A linter or formatter already enforces it', 'Linter/formatter đã ép rồi')],
    [t('An outsider will ask "why?"', 'Người ngoài sẽ hỏi "vì sao?"'), t('QR labels carry the asset code, not the DB id', 'Nhãn QR chứa mã tài sản, không chứa id CSDL'), t('It is a temporary experiment on a branch', 'Là thử nghiệm tạm trên một nhánh')],
  ])}

<h3>${t('Anatomy, on a real LabFlow decision', 'Cấu tạo, trên một quyết định thật của LabFlow')}</h3>
<p>${t('ADR 0002 as the team wrote it in sprint 0 (the header lines are generated by the tool below):', 'ADR 0002 nhóm viết ở sprint 0 (các dòng đầu do công cụ bên dưới sinh):')}</p>
${out('# 2. Chia việc theo màn hình, không chia FE/BE\n\n- Trạng thái: Chấp nhận\n- Ngày: 2027-01-06\n\n' + MA.adr2)}
${bang([t('Part', 'Phần'), t('Rule', 'Luật'), t('Common mistake', 'Lỗi hay gặp')], [
    [t('Context', 'Bối cảnh'), t('Facts and forces only: grading rules, deadlines, people, numbers.', 'Chỉ sự thật và lực tác động: luật chấm, hạn, con người, con số.'), t('Arguing for the answer already ("Redis is fast").', 'Đã cãi cho đáp án ngay ở đây ("Redis nhanh").')],
    [t('Decision', 'Quyết định'), t('Full sentence, active voice: "We will …".', 'Câu đầy đủ, chủ động: "Chúng ta sẽ …".'), t('A noun: "Redis." — chosen for what, where, when?', 'Một danh từ: "Redis." — dùng cho gì, ở đâu, khi nào?')],
    [t('Status', 'Trạng thái'), t('Proposed → Accepted; later Superseded by NNNN. Never edit an accepted ADR’s decision.', 'Đề xuất → Chấp nhận; sau này Bị thay bởi NNNN. Không bao giờ sửa phần quyết định của ADR đã chấp nhận.'), t('Silently rewriting history when the team changes its mind.', 'Lặng lẽ sửa lịch sử khi nhóm đổi ý.')],
    [t('Consequences', 'Hệ quả'), t('Good, bad and neutral. At least one (−): the price you agreed to pay.', 'Tốt, xấu và trung tính. Ít nhất một (−): cái giá đã đồng ý trả.'), t('Only advantages — then nobody can later tell whether the price became too high.', 'Chỉ có ưu điểm — sau này không ai biết cái giá đã quá cao chưa.')],
  ])}

<h3>${t('Lab: a decision log the team cannot break', 'Lab: sổ quyết định mà nhóm không làm hỏng được')}</h3>
<p>${t(
    'About sixty lines of Node give the team four commands: <code>moi</code> (new, from a template), <code>chap-nhan</code> (accept), <code>ds</code> (list + regenerate the index) and <code>kiem</code> (lint the whole log, for CI). <code>moi --thay N</code> creates a replacement and marks ADR N as superseded, both directions linked.',
    'Khoảng sáu mươi dòng Node cho nhóm bốn lệnh: <code>moi</code> (tạo từ mẫu), <code>chap-nhan</code>, <code>ds</code> (liệt kê + sinh lại mục lục) và <code>kiem</code> (soát cả sổ, cho CI). <code>moi --thay N</code> tạo ADR thay thế và đánh dấu ADR N bị thay, liên kết hai chiều.')}</p>
${js(MA.adr)}
<h4>${t('Sprint 0: the leader opens the log', 'Sprint 0: trưởng nhóm mở sổ')}</h4>
${out(doan('### Sprint 0', '### Tuần 7'))}
<p>${t(
    'A fresh ADR fails the lint on purpose: a template with TODOs must never be merged. The team filled in four decisions, accepted them at the sprint 0 meeting, and CI went green.',
    'ADR mới tạo cố ý trượt bộ soát: mẫu còn TODO không bao giờ được merge. Nhóm điền bốn quyết định, chấp nhận ở buổi họp sprint 0, CI xanh.')}</p>
<h4>${t('Week 7: two branches, one number', 'Tuần 7: hai nhánh, một số')}</h4>
${out(doan('### Tuần 7', '### 24/02/2027'))}
<p>${t(
    'Git merged both branches cleanly — two different file names — but the log now has two ADR 0005. This is exactly the bug from ', 'Git merge cả hai nhánh sạch sẽ — hai tên tệp khác nhau — nhưng sổ giờ có hai ADR 0005. Đây đúng là lỗi ở ')}${ag('agl-3-3-ci', t('lesson 3.3', 'bài 3.3'))}${t(
    ' with migrations V3: <strong>sequential numbers handed out on parallel branches collide, and git cannot see it</strong>. A machine check can. The later branch renumbers before merging.',
    ' với migration V3: <strong>số tuần tự cấp trên các nhánh song song sẽ đụng nhau, và git không thấy</strong>. Máy kiểm thì thấy. Nhánh merge sau đổi số trước khi merge.')}</p>
<h4>${t('After the incident: supersede, do not edit', 'Sau sự cố: thay thế, không sửa')}</h4>
${out(doan('### 24/02/2027', '### Một ADR viết vội'))}
${out(MA.adr7)}
<p>${t(
    'ADR 0003 ("reviewers will catch duplicate numbers") turned out wrong — lesson 5.4 tells how. The team did not edit 0003; it wrote 0007 and marked 0003 "Superseded by 0007". Anyone reading 0003 a month later sees what the team believed, why it changed, and where the current rule is. That chain is what your supervisor wants to hear when asking "did your design change during the project?".',
    'ADR 0003 ("người review sẽ bắt số trùng") hoá ra sai — bài 5.4 kể chuyện đó. Nhóm không sửa 0003; nhóm viết 0007 và đánh dấu 0003 "Bị thay bởi 0007". Một tháng sau ai đọc 0003 cũng thấy nhóm từng tin gì, vì sao đổi, và luật hiện tại ở đâu. Chuỗi đó chính là câu trả lời giảng viên muốn nghe khi hỏi "thiết kế của nhóm có thay đổi trong quá trình làm không?".')}</p>
<h4>${t('What the machine cannot judge', 'Điều máy không phán được')}</h4>
${out(MA.adrXau)}
${out(doan('### Một ADR viết vội'))}
${cl('warn', `<p>${t(
    'The lint caught the missing decision and the missing price — but "Context: use Redis because it is fast" passed. Is it slow now? Measured where? Fast compared to what? Only a human reviewer asks that. In lab 5.5 the same ADR comes back rewritten after measuring, and the decision flips to "not Redis yet". Machine checks keep the <em>form</em>; review keeps the <em>reasoning</em>.',
    'Bộ soát bắt được thiếu quyết định và thiếu cái giá — nhưng "Bối cảnh: dùng Redis cho nhanh" vẫn qua. Hiện đang chậm à? Đo ở đâu? Nhanh hơn so với cái gì? Chỉ người review mới hỏi. Ở lab 5.5 chính ADR này quay lại sau khi đã đo, và quyết định lật thành "chưa dùng Redis". Máy giữ <em>hình thức</em>; review giữ <em>lập luận</em>.')}</p>`)}

<h3>${t('The team process (who writes, who accepts)', 'Quy trình của nhóm (ai viết, ai chấp nhận)')}</h3>
${bang([t('Step', 'Bước'), t('Who', 'Ai'), t('Where', 'Ở đâu')], [
    [t('Anyone notices a decision worth recording', 'Ai cũng có thể thấy một quyết định đáng ghi'), t('Any member — not only the leader', 'Mọi thành viên — không chỉ trưởng nhóm'), t('Standup or a review thread', 'Standup hoặc một luồng review')],
    [t('Open a PR with the ADR as "Proposed"', 'Mở PR có ADR ở trạng thái "Đề xuất"'), t('The person closest to the problem', 'Người gần vấn đề nhất'), 'docs/adr/NNNN-….md'],
    [t('Discuss and accept', 'Thảo luận và chấp nhận'), t('Whole team; tie-breakers from lesson 4.3', 'Cả nhóm; luật phân xử ở bài 4.3'), t('Next planning or a 15-minute call', 'Planning gần nhất hoặc một cuộc gọi 15 phút')],
    [t('Change of mind', 'Đổi ý'), t('Whoever proposes the change', 'Người đề xuất thay đổi'), t('New ADR with --thay; old one stays', 'ADR mới với --thay; bản cũ giữ nguyên')],
    [t('Supervisor imposes a change', 'Giảng viên yêu cầu đổi'), t('Leader', 'Trưởng nhóm'), t('New ADR: "Context: on 12/03 the supervisor required …"', 'ADR mới: "Bối cảnh: ngày 12/03 giảng viên yêu cầu …"')],
  ])}

${cl('warn', `<p><strong>${t('Exercise 5.2', 'Bài tập 5.2')}</strong> — ${t(
    'In week 10, PR #41 (screen S35, made by C5 and C3 together) was squashed into one commit, and <code>git blame</code> now shows only C5. The team decides: squash PRs with one author, use a merge commit for PRs with two or more. Record it with the tool, without touching ADR 0005’s decision text.',
    'Tuần 10, PR #41 (màn S35, C5 và C3 cùng làm) bị squash thành một commit, và <code>git blame</code> giờ chỉ hiện C5. Nhóm quyết: PR một tác giả thì squash, PR từ hai tác giả trở lên thì merge commit. Ghi lại bằng công cụ, không đụng vào phần quyết định của ADR 0005.')}</p>
${giai(t('Real run and the ADR text', 'Lần chạy thật và nội dung ADR'), `${out(RA.baiTap.split('### BT 5.2')[1].split('### BT 5.4')[0].replace(/^[^\n]*\n/, ''))}
${out(MA.adr9)}
<p>${t('Note the first <code>kiem</code> fails: a new ADR is only a template until someone writes the context, the decision and the price.', 'Để ý lần <code>kiem</code> đầu trượt: ADR mới chỉ là mẫu cho tới khi có người viết bối cảnh, quyết định và cái giá.')}</p>`)}`)}

<h3>${t('At work: decisions that belong to the client', 'Khi đi làm: quyết định thuộc về khách')}</h3>
<p>${t(
    'In outsourcing, many "architecture" decisions are the client’s: database, framework, even naming rules. Those are recorded as answers in the Q&amp;A list or in meeting minutes the client confirms (', 'Ở outsourcing, nhiều quyết định "kiến trúc" thuộc về khách: CSDL, framework, cả luật đặt tên. Chúng được ghi thành câu trả lời trong Q&amp;A list hoặc biên bản họp khách xác nhận (')}${ag('agl-9-5-qa-cr', t('lesson 9.5', 'bài 9.5'))}${t(
    '), and if the client changes their mind it becomes a change request. ADRs remain useful for the decisions <em>inside</em> the offshore team — how to split modules, how to test, how to handle an ambiguous spec — and they protect you when someone asks three months later "who decided this?". If a teammate argues the same point every sprint, the kindest answer is a link to the ADR.',
    '), và nếu khách đổi ý thì thành change request. ADR vẫn có ích cho những quyết định <em>bên trong</em> đội offshore — chia mô-đun ra sao, test thế nào, xử lý spec mơ hồ thế nào — và bảo vệ bạn khi ba tháng sau có người hỏi "ai quyết cái này?". Nếu một đồng đội cãi lại cùng một chuyện mỗi sprint, câu trả lời tử tế nhất là liên kết tới ADR.')}</p>

${phongVan([
    [t('"Tell me about a technical decision you made and its trade-offs."', '"Kể về một quyết định kỹ thuật bạn đã đưa ra và cái giá của nó."'), t('Use one ADR as the story: context (SWP391 grades by screen), decision (vertical slices per person), consequences (everyone writes React and Spring; shared files need an owner), and what we did about the downside (pairing in week 1, CODEOWNERS).', 'Dùng một ADR làm câu chuyện: bối cảnh (SWP391 chấm theo màn), quyết định (mỗi người một lát dọc), hệ quả (ai cũng viết cả React lẫn Spring; tệp chung cần chủ), và nhóm đã làm gì với mặt xấu (làm cặp tuần 1, CODEOWNERS).')],
    [t('"What is an ADR?"', '"ADR là gì?"'), t('A one-page record of one significant decision — context, decision, status, consequences — stored in the repo. The format comes from Michael Nygard, 2011.', 'Bản ghi một trang cho một quyết định quan trọng — bối cảnh, quyết định, trạng thái, hệ quả — để trong repo. Mẫu do Michael Nygard đưa ra năm 2011.')],
    [t('"What do you do when a decision turns out to be wrong?"', '"Khi một quyết định hoá ra sai, bạn làm gì?"'), t('Write a new ADR that supersedes it, explaining what we learned, and link both ways. The old one stays, so the history of our reasoning is not lost.', 'Viết ADR mới thay thế nó, nói rõ đã học được gì, liên kết hai chiều. Bản cũ giữ nguyên, để lịch sử lập luận không mất.')],
    [t('"How do you keep documentation from going stale?"', '"Làm sao để tài liệu không lỗi thời?"'), t('Keep it next to the code, change it in the same PR, generate what can be generated, and let CI check structure — duplicate numbers, missing sections, broken superseded links.', 'Để cạnh mã, đổi trong cùng PR, sinh tự động những gì sinh được, và để CI kiểm cấu trúc — số trùng, thiếu mục, liên kết thay thế hỏng.')],
  ], en)}

${thuatNgu([
    ['ADR', t('Architecture decision record: one page per significant decision.', 'Bản ghi quyết định kiến trúc: một trang cho mỗi quyết định quan trọng.')],
    ['supersede', t('Replace a decision with a newer ADR while keeping the old one.', 'Thay một quyết định bằng ADR mới hơn mà vẫn giữ bản cũ.')],
    [t('consequence (−)', 'hệ quả (−)'), t('The price the team knowingly accepted.', 'Cái giá nhóm biết mà vẫn chấp nhận.')],
    [t('decision log', 'sổ quyết định'), t('The folder of ADRs plus a generated index.', 'Thư mục ADR cùng mục lục sinh tự động.')],
  ], en)}

${tomTat([
    t('One short ADR per decision that is costly to reverse, argued about, or that outsiders will question.', 'Mỗi quyết định khó đảo ngược, bị tranh cãi, hay người ngoài sẽ hỏi — một ADR ngắn.'),
    t('Context = facts; Decision = "We will …"; Consequences include the price; Status moves forward, never backwards.', 'Bối cảnh = sự thật; Quyết định = "Chúng ta sẽ …"; Hệ quả có cái giá; Trạng thái chỉ đi tới, không đi lùi.'),
    t('Changing your mind = a new ADR that supersedes the old one, linked both ways.', 'Đổi ý = ADR mới thay ADR cũ, liên kết hai chiều.'),
    t('Sequential numbers on parallel branches collide (two ADR 0005, like two V3 migrations) — let CI catch it.', 'Số tuần tự trên nhánh song song sẽ đụng (hai ADR 0005, như hai migration V3) — để CI bắt.'),
    t('Machines check the form; reviewers check the reasoning.', 'Máy kiểm hình thức; người review kiểm lập luận.'),
  ], en)}
<p>${t('Next: ', 'Bài tiếp: ')}${ag('agl-5-3-rfc', t('5.3 — Design docs and RFCs', '5.3 — Tài liệu thiết kế và RFC'))}.</p>
`);
};

export default {
  title: '5.2 — Architecture decision records|||5.2 — Ghi quyết định kiến trúc (ADR)',
  slug: 'agl-5-2-adr',
  type: 'LESSON',
  isFreePreview: true,
  description: 'ADR theo mẫu Nygard (2011) cho đồ án nhóm: quyết định nào đáng ghi, bối cảnh/quyết định/trạng thái/hệ quả trên ADR thật của LabFlow; lab chạy thật công cụ adr.mjs (moi/chap-nhan/ds/kiem): ADR mẫu trượt soát, hai nhánh cùng tạo ADR 0005 (giống migration V3), ADR 0007 thay 0003 sau sự cố, ADR "dùng Redis" viết vội; quy trình nhóm; bài tập thay ADR squash; quyết định thuộc về khách khi đi outsourcing.',
  content: L52(true) + L52(false),
};
