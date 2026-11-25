/**
 * Bắt đầu tại đây (2/2) — khoá agile-teamwork (agl-0-9-bat-dau-khi-khong-co). Soạn 24/11/2026, agent agt.
 * Demo "địa ngục merge": scratchpad/agt/lab/ch0/dia-nguc-merge.sh chạy THẬT (git 2.55.0, Node 22.22.2), output nhúng qua ./_ma.mjs.
 * Sự cố có nguồn (tra 24/11/2026): SEC press release 2013-222 + order Knight Capital (16/10/2013); GAO-14-694 (30/07/2014) HealthCare.gov;
 * DOJ OIG + IEEE Spectrum "Who Killed the Virtual Case File?" (2005). Tình huống nhóm SV ghi rõ là MINH HOẠ.
 */
import { bang, cl, note, phongVan, thuatNgu, tomTat, giai, bash, out, ag, cs, ac, ng, vo } from '../_chung.mjs';
import { MA, RA } from './_ma.mjs';

const loc = (s, giu) => s.split('\n').filter((d) => giu(d)).join('\n');

export const L09 = (en) => {
  const t = (a, b) => (en ? a : b);
  return vo(en, 'Section 0 · Start here', 'Mục 0 · Bắt đầu tại đây', `
<h2>${t('Start here (2/2) — Team failures: missed deadlines, merge hell, silent blockers', 'Bắt đầu tại đây (2/2) — Đội hỏng: trễ hạn, địa ngục merge, người bí mà im lặng')}</h2>
<p class="lead">${t(
    'Teams rarely fail because someone cannot code. They fail because work is integrated too late, because nobody checks a step everybody assumed was done, because a person stuck on day 2 says nothing until day 10. This lesson shows four failure patterns — three from real organisations with official reports, one from a student team (an illustration) — and a demo you run yourself where git merges cleanly and the product is still broken.',
    'Các đội hiếm khi hỏng vì ai đó không biết code. Họ hỏng vì gộp việc quá muộn, vì không ai kiểm một bước mà ai cũng tưởng đã xong, vì một người bí từ ngày thứ 2 mà im tới ngày thứ 10. Bài này cho bạn bốn kiểu hỏng — ba từ tổ chức thật có báo cáo chính thức, một từ nhóm sinh viên (minh hoạ) — và một demo bạn tự chạy, trong đó git merge êm ru mà sản phẩm vẫn hỏng.')}</p>

<h3>${t('Case 1 — Knight Capital, 1 August 2012: one server of eight', 'Sự cố 1 — Knight Capital, 01/08/2012: một máy chủ trong tám')}</h3>
<p>${t(
    'Knight Capital was one of the largest stock traders in the US. For a new program it reused an old flag in its order router. A technician deployed the new code by hand to eight servers and missed one. On the eighth server the reused flag woke up dead code ("Power Peg") that had not run for years. In 45 minutes the router sent millions of orders, for more than 397 million shares. Knight lost more than $460 million and was sold months later. Before the market opened, the system had sent 97 automated emails warning about an error to a group of staff — nobody acted on them.',
    'Knight Capital là một trong những công ty giao dịch chứng khoán lớn nhất nước Mỹ. Cho một chương trình mới, họ dùng lại một cờ cũ trong bộ định tuyến lệnh. Một kỹ thuật viên triển khai mã mới bằng tay lên tám máy chủ và sót một máy. Trên máy thứ tám, cờ cũ đánh thức một đoạn mã chết ("Power Peg") đã nhiều năm không chạy. Trong 45 phút, hệ thống gửi hàng triệu lệnh, hơn 397 triệu cổ phiếu. Knight lỗ hơn 460 triệu USD và bị bán lại vài tháng sau. Trước giờ mở cửa thị trường, hệ thống đã gửi 97 email tự động báo lỗi cho một nhóm nhân viên — không ai xử lý.')}
${ng('https://www.sec.gov/news/press-release/2013-222', 'SEC, press release 2013-222 (16/10/2013)')}</p>
<p><strong>${t('Team lesson', 'Bài học cho nhóm')}:</strong> ${t('a manual step with no checklist and no second person checking; dead code nobody removed; warnings sent to "a group" so each person assumed someone else would read them. In this course: a Definition of Done that includes "deployed and verified" (2.x), review of every change (ch. 4), and one named owner for every alert or task (RACI, lesson 0.1).', 'một bước làm tay không có checklist và không có người thứ hai kiểm; mã chết không ai xoá; cảnh báo gửi cho "một nhóm" nên ai cũng tưởng người khác sẽ đọc. Trong khoá này: Definition of Done có "đã triển khai và kiểm" (ch. 2), review mọi thay đổi (ch. 4), và mỗi cảnh báo hay việc có đúng một người chịu trách nhiệm đứng tên (RACI, bài 0.1).')}</p>

<h3>${t('Case 2 — FBI Virtual Case File, 2000–2005: five years, one big delivery', 'Sự cố 2 — FBI Virtual Case File, 2000–2005: năm năm, giao một lần')}</h3>
<p>${t(
    'The FBI ordered a new case management system in one large contract, with requirements written up front and the software expected to arrive whole at the end. Requirements kept changing while nothing usable was delivered. In 2005 the project was abandoned after about $170 million. Its replacement, Sentinel, struggled too until the FBI took development in-house and switched to agile, delivering in small increments; the Justice Department\'s Inspector General followed it through a series of audits.',
    'FBI đặt làm hệ thống quản lý hồ sơ vụ án mới trong một hợp đồng lớn, yêu cầu viết trước, phần mềm dự kiến giao trọn một lần ở cuối. Yêu cầu liên tục đổi trong khi chưa có gì dùng được được giao. Năm 2005 dự án bị bỏ sau khoảng 170 triệu USD. Hệ thống thay thế, Sentinel, cũng chật vật cho tới khi FBI tự làm và chuyển sang agile, giao từng phần nhỏ; Tổng thanh tra Bộ Tư pháp Mỹ theo dõi nó qua nhiều đợt kiểm toán.')}
${ng('https://spectrum.ieee.org/who-killed-the-virtual-case-file', 'IEEE Spectrum — Who Killed the Virtual Case File? (2005)')} · ${ng('https://oig.justice.gov/archives/reports/FBI/a0703/exec.htm', 'DOJ OIG — Sentinel Audit II')}</p>
<p><strong>${t('Team lesson', 'Bài học cho nhóm')}:</strong> ${t('if nothing works until the end, you learn you are wrong at the end. SWP391 has three iterations precisely so you show working screens early. Chapter 1.', 'nếu tới cuối mới có thứ chạy được thì tới cuối mới biết mình sai. SWP391 có ba iteration chính là để bạn cho thấy màn hình chạy được từ sớm. Chương 1.')}</p>

<h3>${t('Case 3 — HealthCare.gov, October 2013: nobody owned the whole', 'Sự cố 3 — HealthCare.gov, 10/2013: không ai chịu trách nhiệm cái tổng thể')}</h3>
<p>${t(
    'The US health insurance marketplace crashed on launch day. Many contractors each built a piece; the US Government Accountability Office found the agency "undertook the development of Healthcare.gov and its related systems without effective planning or oversight practices" and launched it without verifying that it met its performance requirements.',
    'Chợ bảo hiểm y tế của Mỹ sập ngay ngày ra mắt. Nhiều nhà thầu mỗi bên làm một mảnh; Văn phòng Kiểm toán Chính phủ Mỹ (GAO) kết luận cơ quan chủ quản "đã phát triển Healthcare.gov và các hệ thống liên quan mà không có cách lập kế hoạch và giám sát hiệu quả", và đưa lên chạy mà không kiểm xem nó có đạt yêu cầu hiệu năng không.')}
${ng('https://www.gao.gov/products/GAO-14-694', 'GAO-14-694 (30/07/2014)')}</p>
<p><strong>${t('Team lesson', 'Bài học cho nhóm')}:</strong> ${t('pieces that each "work" are not a product. Someone must own integration and the end-to-end test — on a student team, that is the leader\'s job, not the leader\'s code. Chapters 3 and 12.', 'các mảnh mà mảnh nào cũng "chạy" chưa phải là sản phẩm. Phải có người chịu trách nhiệm tích hợp và test xuyên suốt — ở nhóm sinh viên đó là việc của leader, không phải là "leader code hết". Chương 3 và 12.')}</p>

<h3>${t('Case 4 — an SWP391 team (illustration, not a real group)', 'Tình huống 4 — một nhóm SWP391 (minh hoạ, không phải nhóm có thật)')}</h3>
${bang([t('Week', 'Tuần'), t('What happened', 'Chuyện gì xảy ra'), t('Pattern', 'Kiểu hỏng')], [
    ['1', t('The leader splits: "C2, C3 do frontend; C4, C5 do backend; I do the database."', 'Leader chia: "C2, C3 làm frontend; C4, C5 làm backend; mình làm database."'), t('Split by layer — but SWP391 grades LOC per screen per person', 'Chia theo tầng — trong khi SWP391 chấm LOC theo màn hình từng người')],
    ['2–3', t('C5 cannot install PostgreSQL on Windows, is embarrassed to ask, says "đang làm" (working on it) in chat.', 'C5 không cài được PostgreSQL trên Windows, ngại hỏi, nhắn nhóm "đang làm".'), t('Silent blocker', 'Người bí mà im lặng')],
    ['4', t('Frontend waits for APIs that do not exist; frontend mocks its own data shapes.', 'Frontend chờ API chưa có; frontend tự bịa dạng dữ liệu.'), t('Hand-off waiting', 'Chờ nhau')],
    ['5 (night before demo)', t('Four branches, two weeks old, merged at 23:00. Conflicts in 30 files; field names differ between frontend and backend; the demo shows a blank page.', 'Bốn nhánh, hai tuần tuổi, merge lúc 23 giờ. Xung đột 30 tệp; tên trường frontend và backend khác nhau; buổi demo hiện trang trắng.'), t('Merge hell + late integration', 'Địa ngục merge + tích hợp muộn')],
    ['6', t('The lecturer asks who built which screen. Nobody can answer cleanly; C5 has no screen.', 'Giảng viên hỏi ai làm màn hình nào. Không ai trả lời rành mạch; C5 không có màn hình nào.'), t('No ownership', 'Không ai sở hữu gì')],
  ])}
<p>${t('Every row has a fix in this course: split by screen (2.2, 12.1), ask within 30 minutes and a daily standup (6.1, 8.2), contract-first API with shared field names (3.x, 7.2), daily small PRs (3.2), and a RACI with one owner per screen (0.1).', 'Dòng nào cũng có cách chữa trong khoá: chia theo màn hình (2.2, 12.1), quy tắc hỏi sau 30 phút và standup hằng ngày (6.1, 8.2), thống nhất hợp đồng API và tên trường trước (ch. 3, 7.2), PR nhỏ hằng ngày (3.2), và RACI mỗi màn hình đúng một chủ (0.1).')}</p>

<h3>${t('Run it yourself: merge hell, measured', 'Tự chạy: địa ngục merge, đo bằng số')}</h3>
<p>${t(
    'Three developers, five days, one small JavaScript repo. Each day each person adds one screen (a route and an API function). On day 2, C2 makes a reasonable change: renames <code>login</code> to <code>dangNhap</code> and updates their own code. On day 3, C3 writes a new screen that calls the login function — using the name C3 can see in their copy of the code. We compare two habits: one branch per person for all five days, merged on day 5; or a fresh branch each morning merged each afternoon. At the end, Node imports each page to see whether the product still runs.',
    'Ba lập trình viên, năm ngày, một repo JavaScript nhỏ. Mỗi ngày mỗi người thêm một màn hình (một route và một hàm API). Ngày 2, C2 làm một thay đổi hợp lý: đổi tên <code>login</code> thành <code>dangNhap</code> và sửa code của mình theo. Ngày 3, C3 viết màn mới gọi hàm đăng nhập — bằng cái tên C3 đang thấy trong bản code của mình. Ta so hai thói quen: mỗi người một nhánh suốt năm ngày, ngày 5 mới merge; hoặc mỗi sáng tách nhánh mới, chiều merge. Cuối cùng Node nạp thử từng trang xem sản phẩm còn chạy không.')}</p>
${giai(t('dia-nguc-merge.sh (full script)', 'dia-nguc-merge.sh (toàn bộ script)'), bash(MA.diaNguc))}
${out('$ bash dia-nguc-merge.sh\n' + loc(RA.merge, (d) => !/d[2-4]:|Ngày [2-4]/.test(d)).replace(' Ngày 1:', ' Ngày 1:').replace(/( Ngày 5:)/, '  … (ngày 2–4 giống ngày 1)\n$1'))}
<p>${t('Read it carefully — the result is not the one most people expect:', 'Đọc kỹ — kết quả không như phần đông mọi người đoán:')}</p>
<ol>
<li>${t('<strong>Counting textual conflicts, daily integration is not better</strong>: 20 small conflicts against 4 big ones, and the same 50 lines to read in total. If someone tells you "merge often and you get no conflicts", that is not true.', '<strong>Đếm xung đột chữ thì tích hợp mỗi ngày không hơn</strong>: 20 xung đột nhỏ so với 4 xung đột lớn, tổng số dòng phải đọc như nhau (50). Ai bảo bạn "merge thường xuyên thì hết xung đột" là chưa đúng.')}</li>
<li>${t('<strong>The real difference is the hidden break</strong>. With long branches git merged the rename <em>without any conflict</em> — the lines did not touch — yet <code>pages/C3.js</code> is broken: <code>does not provide an export named \'login\'</code>. Nobody sees it until the evening before the demo. With daily integration C3 started day 3 from a <code>main</code> that already had <code>dangNhap</code>, so the problem never existed.', '<strong>Khác biệt thật nằm ở lỗi ngầm</strong>. Với nhánh sống lâu, git merge phần đổi tên <em>không có xung đột nào</em> — các dòng không chạm nhau — vậy mà <code>pages/C3.js</code> hỏng: <code>does not provide an export named \'login\'</code>. Không ai thấy cho tới tối trước buổi demo. Với tích hợp hằng ngày, sáng ngày 3 C3 bắt đầu từ một <code>main</code> đã có <code>dangNhap</code>, nên lỗi không bao giờ xuất hiện.')}</li>
<li>${t('Small conflicts are cheap: 4–6 lines you wrote this morning, while you still remember why. 30 lines from two weeks ago, at 23:00, by tired people, is where wrong choices happen.', 'Xung đột nhỏ thì rẻ: 4–6 dòng bạn viết sáng nay, còn nhớ vì sao. 30 dòng từ hai tuần trước, lúc 23 giờ, người đang mệt, là chỗ sinh ra lựa chọn sai.')}</li>
</ol>
${cl('info', `<p><strong>${t('Integration habits that remove the problem', 'Thói quen tích hợp xoá được vấn đề')}</strong>: ${t('(1) small branches merged at least daily; (2) code organised <em>by feature/screen</em> so two people rarely edit the same file — see the practice below; (3) a CI check that builds and runs tests on every pull request, so a hidden break turns red within minutes, not on demo night.', '(1) nhánh nhỏ, merge ít nhất mỗi ngày; (2) tổ chức code <em>theo chức năng/màn hình</em> để hai người hiếm khi sửa cùng một tệp — xem bài thực hành dưới; (3) một bước CI build và chạy test cho mọi pull request, để lỗi ngầm đỏ lên sau vài phút chứ không phải đêm demo.')} ${cs('github-actions', 'ga-15-1-ci-cho-pr', t('(CI for pull requests — GitHub Actions 15.1)', '(CI cho pull request — GitHub Actions 15.1)'))}</p>`)}

<h3>🧪 ${t('Practice (20 minutes)', 'Thực hành (20 phút)')}</h3>
<ol>
<li>${t('Run <code>bash dia-nguc-merge.sh ~/lab0/merge</code>. Your numbers must match (they do not depend on the machine).', 'Chạy <code>bash dia-nguc-merge.sh ~/lab0/merge</code>. Số liệu phải khớp (không phụ thuộc máy).')}</li>
<li>${t('Open <code>~/lab0/merge/don-cuoi/api.js</code> and <code>pages/C3.js</code>. Explain in one sentence why git saw no conflict on the rename.', 'Mở <code>~/lab0/merge/don-cuoi/api.js</code> và <code>pages/C3.js</code>. Giải thích trong một câu vì sao git không thấy xung đột ở chỗ đổi tên.')}</li>
<li>${t('The script has a second mode, <code>theo-man</code>, where each screen gets its own file instead of everyone appending to <code>routes.js</code> and <code>api.js</code>. Predict the result, then run <code>bash dia-nguc-merge.sh ~/lab0/merge3 theo-man</code>.', 'Script có chế độ thứ hai, <code>theo-man</code>: mỗi màn hình một tệp riêng thay vì ai cũng nối thêm vào <code>routes.js</code> và <code>api.js</code>. Đoán kết quả trước, rồi chạy <code>bash dia-nguc-merge.sh ~/lab0/merge3 theo-man</code>.')}</li>
</ol>
${giai(t('Answers', 'Đáp án'), `<p>${t('2. Git compares lines, not meaning: C2 changed line 1 of <code>api.js</code>, C3 changed <code>pages/C3.js</code>; no line was edited by both, so the merge is "clean" while the code no longer fits together.', '2. Git so dòng, không hiểu nghĩa: C2 sửa dòng 1 của <code>api.js</code>, C3 sửa <code>pages/C3.js</code>; không dòng nào bị cả hai cùng sửa nên merge "sạch" trong khi code không còn khớp nhau.')}</p>
<p>${t('3. Real output:', '3. Output thật:')}</p>
${out('$ bash dia-nguc-merge.sh ~/lab0/merge3 theo-man\n' + loc(RA.mergeTheoMan, (d) => !/d[2-4]:|Ngày [2-5]|d5:/.test(d)))}
<p>${t('Zero textual conflicts in both modes — splitting files by screen removed them. But the long-branch mode still breaks <code>pages/C3.js</code>: file layout cannot fix a hidden semantic break; only integrating often (plus CI) can. This is also why we split <em>work</em> by screen in SWP391: fewer collisions, clear ownership, fair LOC.', 'Không còn xung đột chữ nào ở cả hai cách — tách tệp theo màn hình đã xoá chúng. Nhưng cách nhánh sống lâu vẫn làm hỏng <code>pages/C3.js</code>: cách sắp tệp không chữa được lỗi ngầm về nghĩa; chỉ tích hợp thường xuyên (cộng CI) mới chữa được. Đây cũng là lý do ở SWP391 ta chia <em>việc</em> theo màn hình: ít va chạm, rõ ai sở hữu gì, LOC công bằng.')}</p>`)}

<h3>${t('Studying without giving up', 'Học mà không bỏ cuộc')}</h3>
<ul>
<li>${t('Teamwork skills feel "soft" until the week they save your project. Do one lesson, then apply one thing to your team the same day — a RACI, a PR template, a 10-minute standup.', 'Kỹ năng làm nhóm nghe có vẻ "mềm" cho tới cái tuần nó cứu dự án của bạn. Học một bài, áp một điều vào nhóm ngay trong ngày — một bảng RACI, một mẫu PR, một buổi standup 10 phút.')}</li>
<li>${t('Keep a "team journal" (one line per day: what happened, what you did as leader). In three months it is the source of every STAR story you tell in interviews.', 'Giữ "nhật ký nhóm" (mỗi ngày một dòng: chuyện gì xảy ra, bạn làm gì với vai leader). Ba tháng sau, nó là nguồn của mọi câu chuyện STAR bạn kể khi phỏng vấn.')}</li>
<li>${t('If you are not a leader yet, still do the leader exercises: in internships the person who notices the silent blocker and offers help is the one who gets kept.', 'Chưa làm leader cũng vẫn làm bài tập của leader: khi đi thực tập, người nhận ra bạn đang bí và chủ động giúp là người được giữ lại.')}</li>
</ul>

${phongVan([
    [t('"Have you had a merge conflict disaster? What did you change afterwards?"', '"Bạn từng gặp thảm hoạ xung đột merge chưa? Sau đó bạn thay đổi gì?"'), t('Describe one concretely (two-week branches merged before a demo), then the change in process: daily small PRs, feature-based folders, CI on every PR, and the result (no more demo-night merges).', 'Kể một lần cụ thể (nhánh hai tuần merge trước demo), rồi thay đổi quy trình: PR nhỏ hằng ngày, thư mục theo chức năng, CI cho mọi PR, và kết quả (không còn merge đêm demo).')],
    [t('"Git merged without conflicts but the app broke. How is that possible?"', '"Git merge không có xung đột mà ứng dụng vẫn hỏng. Sao lại thế?"'), t('Git merges text, not meaning: a rename in one branch and a new call to the old name in another touch different lines. Only building and testing the merged result catches it — that is the job of CI.', 'Git gộp chữ, không gộp nghĩa: đổi tên ở nhánh này và gọi tên cũ ở nhánh kia nằm trên các dòng khác nhau. Chỉ build và test bản đã gộp mới bắt được — đó là việc của CI.')],
    [t('"Tell me about a project failure you know of and what caused it."', '"Kể một thất bại dự án bạn biết và nguyên nhân."'), t('Knight Capital 2012: manual deployment missed one of eight servers, reused flag triggered dead code, $460M lost in 45 minutes; causes were process — no checklist, no verification, unread alerts. Then say what you do in your own team because of it.', 'Knight Capital 2012: triển khai tay sót một trong tám máy chủ, cờ dùng lại kích hoạt mã chết, mất 460 triệu USD trong 45 phút; nguyên nhân là quy trình — không checklist, không kiểm lại, cảnh báo không ai đọc. Rồi nói bạn làm gì trong nhóm mình nhờ bài học đó.')],
  ], en)}

${thuatNgu([
    [t('integration', 'integration (tích hợp)'), t('Combining everyone\'s work into the shared branch and checking it still works.', 'Gộp công việc của mọi người vào nhánh chung và kiểm xem vẫn chạy.')],
    [t('merge hell', 'merge hell (địa ngục merge)'), t('Long-lived branches merged late: big conflicts plus hidden breaks.', 'Nhánh sống lâu gộp muộn: xung đột lớn cộng lỗi ngầm.')],
    [t('semantic conflict', 'semantic conflict (xung đột ngầm)'), t('Changes that merge without textual conflict but no longer work together.', 'Các thay đổi gộp không có xung đột chữ nhưng không còn chạy được với nhau.')],
    [t('blocker', 'blocker (vướng mắc)'), t('Anything that stops you progressing; must be said out loud early.', 'Bất cứ thứ gì làm bạn không tiến được; phải nói ra sớm.')],
    ['CI', t('Continuous Integration: build and test every change automatically.', 'Tích hợp liên tục: tự động build và test mọi thay đổi.')],
  ], en)}

${tomTat([
    t('Knight Capital 2012: a manual step with no checklist and unread alerts cost $460 million in 45 minutes.', 'Knight Capital 2012: một bước làm tay không checklist và cảnh báo không ai đọc làm mất 460 triệu USD trong 45 phút.'),
    t('FBI VCF 2005: deliver everything at the end and you discover you were wrong at the end.', 'FBI VCF 2005: giao tất cả ở cuối thì tới cuối mới biết mình sai.'),
    t('HealthCare.gov 2013: pieces that work are not a product without an owner of integration.', 'HealthCare.gov 2013: các mảnh chạy được chưa thành sản phẩm nếu không ai chịu trách nhiệm tích hợp.'),
    t('Daily integration does not mean fewer textual conflicts; it means small ones and no hidden breaks at the end.', 'Tích hợp hằng ngày không có nghĩa ít xung đột chữ hơn; nó nghĩa là xung đột nhỏ và không có lỗi ngầm dồn tới cuối.'),
    t('Splitting files and work by screen removes most collisions; CI catches what git cannot.', 'Tách tệp và chia việc theo màn hình xoá phần lớn va chạm; CI bắt những gì git không bắt được.'),
  ], en)}
<p>${t('Next: ', 'Bài tiếp: ')}${ag('agl-0-1-vai-tro', t('0.1 — Roles: dev, tester, BA, PM, PO, Scrum Master', '0.1 — Vai trò: dev, tester, BA, PM, PO, Scrum Master'))}.</p>
`);
};

export default {
  title: 'Start here (2/2) — Team failures: missed deadlines, merge hell, silent blockers|||Bắt đầu tại đây (2/2) — Đội hỏng: trễ hạn, địa ngục merge, người bí mà im lặng',
  slug: 'agl-0-9-bat-dau-khi-khong-co',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Knight Capital 2012 (SEC), FBI Virtual Case File 2005, HealthCare.gov 2013 (GAO) và một nhóm SWP391 minh hoạ; tự chạy demo địa ngục merge: git gộp không xung đột mà sản phẩm vẫn hỏng, và vì sao chia theo màn hình + tích hợp hằng ngày + CI chữa được.',
  content: L09(true) + L09(false),
};
