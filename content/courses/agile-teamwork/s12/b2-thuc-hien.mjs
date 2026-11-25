/**
 * 12.2 — Công việc hằng ngày: PR, review, standup (agl-9-2-thuc-hien — slug + title GIỮ theo khung). Soạn 24/11/2026, agent agt.
 * Chạy TRỌN ba tuần sprint 3 bằng bộ giao tiếp ch6 (standup.mjs, canh-bao-som.mjs, chay-tuan.sh) — đã hứa ở 6.6 và 7.5.
 * Lab THẬT (scratchpad/agt/lab/ch12): tao-repo.mjs (nhánh + merge --no-ff thật), chay-tuan.sh ×3 (đạt 8/8; bản ch6 in nhầm "kết quả"
 * giữa sprint khi hai số dự báo trùng nhau ⇒ sửa), canh-bao-som C3 (19/03), kiem-r33.mjs (1/1), bi-mat.sh (git thật: thêm commit xoá
 * KHÔNG đủ; bản clone cũ vẫn giữ mật khẩu), soat-tra-loi.mjs (lần 1 bắt nhầm "ẩu" trong "mật khẩu" ⇒ ranh giới \p{L}).
 * Sự cố thật: Uber 2016 (Wikipedia "Controversies surrounding Uber", "Joe Sullivan (cybersecurity)" — truy cập 24/11/2026).
 */
import { bang, cl, note, phongVan, thuatNgu, tomTat, giai, bash, js, out, ag, cs, ng, vo } from '../_chung.mjs';
import { MA, RA } from './_ma.mjs';

export const L122 = (en) => {
  const t = (a, b) => (en ? a : b);
  return vo(en, 'Chapter 12 · Lesson 12.2', 'Chương 12 · Bài 12.2', `
<h2>${t('12.2 — Daily work: PRs, reviews, standups', '12.2 — Công việc hằng ngày: PR, review, standup')}</h2>
<p class="lead">${t(
    'Fifteen working days. Most of them are boring on purpose: people commit, open small PRs, review each other within a day, and post a four-line standup before 21:45. The leader’s job is to notice the few days that are not boring early enough to act — and to act in the right place. This lesson replays sprint 3 from the event log, with the chapter-6 kit running every evening and four real situations: a carried-over ticket, a mid-sprint request from the supervisor, a member who went silent, and a password in a pull request.',
    'Mười lăm ngày làm việc. Phần lớn cố ý nhàm chán: mọi người commit, mở PR nhỏ, review cho nhau trong một ngày, đăng standup bốn dòng trước 21:45. Việc của trưởng nhóm là nhận ra vài ngày không nhàm chán đủ sớm để hành động — và hành động đúng chỗ. Bài này phát lại sprint 3 từ nhật ký sự kiện, bộ công cụ chương 6 chạy mỗi tối, cùng bốn tình huống thật: một ticket dở, một yêu cầu giữa sprint của giảng viên, một thành viên im lặng, và một mật khẩu trong pull request.')}</p>

<h3>${t('Everyday picture: a restaurant kitchen', 'Liên tưởng đời thường: bếp nhà hàng')}</h3>
<p>${t(
    'In a good kitchen the head chef does not cook every dish. They watch the pass: which plate has waited too long, which station is quiet when it should be busy, which order changed after it was fired. They call it out in a few words, at the moment it matters. The standup script is your pass: it does not cook, it shows you which plate is getting cold.',
    'Trong một bếp tốt, bếp trưởng không nấu mọi món. Họ đứng ở quầy ra món: đĩa nào chờ quá lâu, góc bếp nào im khi đáng ra phải bận, món nào bị đổi sau khi đã lên bếp. Họ gọi ra bằng vài chữ, đúng lúc cần. Script standup là quầy ra món của bạn: nó không nấu, nó cho bạn thấy đĩa nào đang nguội.')}</p>

<h3>${t('The leader’s 20 minutes, every evening', 'Hai mươi phút của trưởng nhóm, mỗi tối')}</h3>
${bang([t('Time', 'Giờ'), t('What', 'Việc'), t('Tool', 'Công cụ')], [
    ['21:00', t('PR queue: anything waiting more than one working day names its reviewer (R2-2)', 'Hàng PR: PR nào chờ quá một ngày làm việc thì nêu tên người duyệt (R2-2)'), ag('agl-6-1-standup', 'standup.mjs')],
    ['21:30', t('Daily in #daily: walk the board right to left, then compare each written standup with the data', 'Daily trên #daily: đi bảng từ phải sang trái, rồi so từng standup viết với dữ liệu'), 'standup.mjs'],
    ['21:45', t('Signals → actions: silent, stuck card, no standup; follow the ladder', 'Tín hiệu → hành động: im lặng, thẻ đứng, không gửi standup; theo bậc thang'), ag('agl-6-5-thanh-vien', 'canh-bao-som.mjs')],
    [t('Thursday', 'Thứ Năm'), t('Four-role check before the daily', 'Soát bốn vai trước daily'), ag('agl-7-5-lab', 'kiem-vai.sh')],
    [t('Friday', 'Thứ Sáu'), t('Weekly pack: dailies, report checked 8/8, early warnings', 'Gói tuần: daily, báo cáo soát 8/8, cảnh báo sớm'), ag('agl-6-6-lab', 'chay-tuan.sh')],
  ])}
<p>${t('The event log the scripts read is exported from CT Work’s history and the PR pages (for a real team) — for this course it is the sprint’s data file:', 'Nhật ký sự kiện mà các script đọc được xuất từ lịch sử CT Work và trang PR (với nhóm thật) — trong khoá này là tệp dữ liệu của sprint:')}</p>
${giai(t('su-kien.csv — sprint 3 (click to open)', 'su-kien.csv — sprint 3 (bấm để mở)'), out(MA.suKien))}
<p>${t('From it, a git repository is rebuilt with one branch per ticket and a real <code>merge --no-ff</code> for every merged PR, so that git-based reports see what a real repo would show — work still under review stays on its branch:', 'Từ nhật ký đó, một repo git được dựng lại với mỗi ticket một nhánh và một lần <code>merge --no-ff</code> thật cho mỗi PR đã merge, để các báo cáo đọc git thấy đúng như repo thật — việc còn đang review thì nằm trên nhánh của nó:')}</p>
${out('$ node tao-repo.mjs /tmp/agt-lab12/labflow\n' + RA.taoRepo)}

<h3>${t('Week 1 (08–12/03): close the old before starting the new', 'Tuần 1 (08–12/03): đóng việc cũ trước khi mở việc mới')}</h3>
<p>${t(
    'On the first evening the standup script flags LF-45: a PR waiting one working day. Carried-over tickets are cheap to finish and expensive to forget — so the first reviews of the sprint go to them: LF-45 merges 09/03, LF-25 (C5) on 10/03, closing risk R-04 a day before its checkpoint. By Friday the written standups all match the data:',
    'Ngay tối đầu, script standup cờ LF-45: một PR chờ một ngày làm việc. Ticket dở thì làm nốt rẻ, quên thì đắt — nên những lần review đầu tiên của sprint dành cho chúng: LF-45 merge 09/03, LF-25 (C5) ngày 10/03, đóng rủi ro R-04 sớm một ngày so với mốc kiểm. Tới thứ Sáu, mọi standup viết đều khớp dữ liệu:')}</p>
${out('$ node standup.mjs 2027-03-12\n' + RA.standup12)}
<p>${t('The weekly pack is <strong>red</strong> — and that is correct, not alarming:', 'Gói tuần màu <strong>đỏ</strong> — và thế là đúng, không đáng sợ:')}</p>
${out('$ ./chay-tuan.sh 2027-03-08 /tmp/agt-lab12/labflow\n' + RA.chayTuan0308)}
<p>${t(
    'Red here means "the supervisor must decide something" (risk R-07: the iteration-3 forecast says 68 % for all 14 screens by 16/04, so the team proposes 12 screens plus S36 and S37 "if time allows" — the forecast itself is lesson ', 'Đỏ ở đây nghĩa là "giảng viên cần quyết một việc" (rủi ro R-07: dự báo iteration 3 là 68 % kịp cả 14 màn trước 16/04, nên nhóm đề xuất 12 màn cộng S36, S37 "nếu kịp" — chính dự báo đó là bài ')}${ag('agl-7-4-khach-hang', '7.4')}${t(
    '). A report that is never red is a report nobody needs to read.',
    '). Báo cáo không bao giờ đỏ là báo cáo không ai cần đọc.')}</p>

<h3>${t('Week 2 (15–19/03): a change from the supervisor', 'Tuần 2 (15–19/03): một thay đổi từ giảng viên')}</h3>
<p>${t(
    'Monday 08:40 the supervisor answers: S36 and S37 "if time allows" is fine — and the demo on 26/03 must export the weekly timetable (S47) as PDF, because the faculty wants to print it on lab doors. That is 2 more points in a full sprint. What the leader did, in this order:',
    'Thứ Hai 08:40 giảng viên trả lời: S36 và S37 "nếu kịp" là được — và buổi demo 26/03 phải xuất được thời khoá biểu tuần (S47) ra PDF, vì khoa muốn in dán cửa lab. Thêm 2 điểm vào một sprint đã đầy. Trưởng nhóm làm theo thứ tự:')}</p>
<ol>
  <li>${t('Created LF-80 (2 points, C3 — S47 is C3’s screen) instead of quietly stretching LF-47.', 'Tạo LF-80 (2 điểm, C3 — S47 là màn của C3) thay vì lặng lẽ nhồi thêm vào LF-47.')}</li>
  <li>${t('Proposed a trade, not an addition: stretch ticket LF-68 (3 points, C5) moves to sprint 4. Messaged C5 first — it is C5’s screen — then the supervisor.', 'Đề xuất một cuộc đổi, không phải cộng thêm: ticket dự phòng LF-68 (3 điểm, C5) sang sprint 4. Nhắn C5 trước — đó là màn của C5 — rồi mới nhắn giảng viên.')}</li>
  <li>${t('Only then changed the board, and recorded it in <code>sprint.json</code> (<code>themGiua</code>, <code>boGiua</code>) so that every script, the burndown included, shows the change on the right day.', 'Chỉ sau đó mới sửa bảng, và ghi vào <code>sprint.json</code> (<code>themGiua</code>, <code>boGiua</code>) để mọi script, cả burndown, hiện thay đổi đúng ngày.')}</li>
</ol>
<p>${t('The mid-sprint retro on 18/03 turned this into a rule (R3-4): every weekly report gets a "Scope changes" section. The report generator was extended the same evening — and running it exposed a bug in the chapter-6 version:', 'Retro giữa sprint ngày 18/03 biến việc này thành luật (R3-4): mọi báo cáo tuần có mục "Thay đổi phạm vi". Bộ sinh báo cáo được bổ sung ngay tối đó — và khi chạy, nó lộ một lỗi của bản chương 6:')}</p>
${cl('warn', `<p>${t(
    '<strong>A bug found by real data.</strong> On 19/03 (day 10 of 15) the low and high forecasts happened to be equal (42 and 42). The chapter-6 code printed "result: 28/47" — the end-of-sprint wording — in the middle of the sprint. Fixed: "result" only on the last day; equal numbers print as one estimate. The sprint-2 data never hit this case, which is why it survived a whole chapter.',
    '<strong>Một lỗi do dữ liệu thật tìm ra.</strong> Ngày 19/03 (ngày 10/15) hai số dự báo thấp và cao tình cờ bằng nhau (42 và 42). Mã chương 6 in "kết quả: 28/47" — câu dành cho ngày cuối sprint — ngay giữa sprint. Đã sửa: chỉ ngày cuối mới in "kết quả"; hai số bằng nhau thì in một con số ước. Dữ liệu sprint 2 chưa bao giờ rơi vào trường hợp này, nên lỗi sống qua cả một chương.')}</p>`)}
${out(MA.baoCaoTuan0315)}

<h3>${t('19/03: the leader is away, and a member goes silent', '19/03: trưởng nhóm vắng, và một thành viên im lặng')}</h3>
<p>${t('C1 is at an OJT interview (announced at planning; C2 runs the daily). C3 opened LF-73 on Tuesday, committed once, and has been quiet since. The written standups of that evening:', 'C1 đi phỏng vấn OJT (đã báo từ planning; C2 chạy daily thay). C3 mở LF-73 hôm thứ Ba, commit một lần, rồi im lặng. Standup viết tối hôm đó:')}</p>
${out(MA.standup19)}
${out('$ node standup.mjs 2027-03-19\n' + RA.standup19)}
${out('$ node canh-bao-som.mjs C3 2027-03-15 2027-03-26\n' + RA.canhBao)}
<p>${t(
    'The early-warning script fires on the first possible evening, and the team acts within the hour: C2, standing in, messages C3 privately at 21:55; the next morning C1 spends an hour with C3 on Meet — rule R3-3 exactly. What the hour found is the real lesson: C3 was not lazy. S29 needed the opening hours from S18 and the QR tokens from S28, "screens of other people", and C3 did not want to bother them. The fix took ten minutes: an API that already existed. C3’s next standup, honest and without excuses:',
    'Script cảnh báo sớm bật đúng tối sớm nhất có thể, và nhóm hành động trong vòng một giờ: C2, đang thay, nhắn riêng C3 lúc 21:55; sáng hôm sau C1 ngồi cùng C3 một giờ qua Meet — đúng luật R3-3. Điều buổi ngồi cùng tìm ra mới là bài học thật: C3 không lười. S29 cần giờ mở cửa của S18 và token QR của S28, "màn của người khác", và C3 ngại làm phiền họ. Gỡ mất mười phút: một API đã có sẵn. Standup tiếp theo của C3, thật thà, không bào chữa:')}</p>
${out(MA.standup22)}
${note(t('The data cannot tell "lazy" from "stuck" from "sick". It tells you <em>when to ask</em>. The ladder in ', 'Dữ liệu không phân biệt được "lười", "kẹt" hay "ốm". Nó cho bạn biết <em>khi nào cần hỏi</em>. Bậc thang ở ') + ag('agl-6-5-thanh-vien', '6.5') + t(' starts with a private question, never with a judgement.', ' luôn bắt đầu bằng một câu hỏi riêng, không bao giờ bằng một lời phán xét.'))}

<h3>${t('23/03: a password in pull request #52', '23/03: mật khẩu trong pull request #52')}</h3>
<p>${t(
    'C4 opens PR #52 (S33, overdue loans) on Monday night; it sends reminder emails through MailTrap, and <code>application-dev.yml</code> contains the SMTP password and the JWT signing key. C2’s review blocks it at 09:10. The drill below is real git in a throwaway repository (the secrets are fake strings); the CI step is a minimal scanner — a real team uses gitleaks, set up in ', 'C4 mở PR #52 (S33, hàng quá hạn) tối thứ Hai; màn gửi email nhắc qua MailTrap, và <code>application-dev.yml</code> chứa mật khẩu SMTP lẫn khoá ký JWT. Review của C2 chặn lúc 09:10. Bài diễn tập dưới đây là git thật trong một repo tạm (bí mật là chuỗi giả); bước CI là một bộ quét tối giản — nhóm thật dùng gitleaks, cài ở ')}${ag('agl-10-8-lab', '10.8')}.</p>
${js(MA.soatBiMat)}
${giai(t('bi-mat.sh — the drill script', 'bi-mat.sh — kịch bản diễn tập'), bash(MA.biMat))}
${out('$ ./bi-mat.sh\n' + RA.biMat)}
<ul>
  <li>${t('<strong>Step 3 is the common mistake.</strong> A "fix" commit makes the latest file clean, but the scanner reads every commit of the PR, and so does anyone who clones the branch.', '<strong>Bước 3 là lỗi hay gặp.</strong> Commit "sửa" làm tệp mới nhất sạch, nhưng bộ quét đọc từng commit của PR, và ai clone nhánh cũng đọc được.')}</li>
  <li>${t('<strong>Step 5 is why rotation comes first.</strong> Rewriting the branch cleaned the remote, but C2 had fetched at 09:10 and still holds the password. History you have pushed is not yours to delete — you can only make the secret worthless.', '<strong>Bước 5 là lý do đổi bí mật phải làm trước.</strong> Viết lại nhánh làm sạch remote, nhưng C2 đã fetch lúc 09:10 và vẫn giữ mật khẩu. Lịch sử đã đẩy lên thì không còn là của riêng bạn để xoá — bạn chỉ có thể làm bí mật đó vô dụng.')}</li>
</ul>
${cl('danger', `<p><strong>${t('Hacker’s corner — Uber, 2016', 'Góc hacker — Uber, 2016')}</strong></p><p>${t(
    'Attackers logged in to a <em>private</em> GitHub repository used by Uber engineers with passwords reused from earlier breaches, found AWS credentials in the files, and downloaded data of about 57 million customers and 600,000 drivers from Amazon S3. Uber paid the attackers 100,000 USD to delete the data and disclosed the breach only in November 2017; in 2018 it paid 148 million USD in a settlement with US states, and its former security chief was convicted in October 2022 of obstruction for the cover-up. The repo being private protected nothing once a single account was taken. Sources: ',
    'Kẻ tấn công đăng nhập vào một repo GitHub <em>private</em> của kỹ sư Uber bằng mật khẩu bị lộ từ các vụ trước, tìm thấy khoá AWS trong tệp, rồi tải dữ liệu của khoảng 57 triệu khách hàng và 600.000 tài xế từ Amazon S3. Uber trả kẻ tấn công 100.000 USD để xoá dữ liệu và chỉ công bố vụ việc vào tháng 11/2017; năm 2018 Uber trả 148 triệu USD dàn xếp với các bang Mỹ, và cựu giám đốc an ninh bị kết tội cản trở công lý vì che giấu vụ việc vào tháng 10/2022. Repo private chẳng bảo vệ được gì khi một tài khoản đã bị chiếm. Nguồn: ')}${ng('https://en.wikipedia.org/wiki/Controversies_surrounding_Uber', 'Wikipedia — Controversies surrounding Uber')}, ${ng('https://en.wikipedia.org/wiki/Joe_Sullivan_(cybersecurity)', 'Wikipedia — Joe Sullivan (cybersecurity)')}.</p>`)}

<h3>${t('23/03, 09:40: the same incident, now between people', '23/03, 09:40: cùng sự cố đó, giờ là chuyện giữa người với người')}</h3>
<p>${t('C4, with an exam the next day, posts in the team channel:', 'C4, hôm sau thi, đăng lên kênh nhóm:')}</p>
${out(MA.c4)}
<p>${t('Two replies the leader could send, and a checker built from the feedback rules of lesson 6.5 (situation–behaviour–impact; correct in private, update in public):', 'Hai cách trả lời trưởng nhóm có thể gửi, và một bộ soát dựng từ luật góp ý bài 6.5 (tình huống – hành vi – tác động; góp ý riêng, cập nhật công khai):')}</p>
${out(MA.traLoiV1)}
${out(MA.traLoiV2)}
${out(MA.nhomSau)}
${js(MA.soatTraLoi)}
<p>${t('The first run flagged the two good messages too:', 'Lần chạy đầu cờ cả hai tin tốt:')}</p>
${out(RA.traLoiLan1)}
<p>${t(
    'Rule T2 looked for "ẩu" (sloppy) — and found it inside "mật kh<strong>ẩu</strong>" (password). Vietnamese words are syllables; <code>\\b</code> and plain substrings do not respect them. With a letter-class boundary (<code>\\p{L}</code>, flag <code>u</code>) — and after the public update gained a reason ("vì") — the result is what a human would say:',
    'Luật T2 tìm chữ "ẩu" — và thấy nó nằm trong "mật kh<strong>ẩu</strong>". Tiếng Việt là các âm tiết; <code>\\b</code> và so chuỗi con không tôn trọng chúng. Với ranh giới theo lớp chữ cái (<code>\\p{L}</code>, cờ <code>u</code>) — và sau khi tin cập nhật công khai được thêm lý do ("vì") — kết quả đúng như người đọc sẽ nói:')}</p>
${out('$ node soat-tra-loi.mjs tra-loi-v1.txt tra-loi-v2.txt nhom-sau.txt\n' + RA.traLoi)}
<p>${t(
    'The rule was right and stays: secrets never merge, private repo or not. What changed is <em>where</em> each part was said, and that the leader took an action (R4-1: CI scans for secrets before review) so nobody loses a morning to this again.',
    'Luật đúng và vẫn giữ: bí mật không bao giờ được merge, repo private hay không. Cái thay đổi là <em>mỗi phần được nói ở đâu</em>, và trưởng nhóm nhận một hành động (R4-1: CI quét bí mật trước khi review) để không ai mất một buổi sáng vì chuyện này nữa.')}</p>

<h3>${t('25/03: S42 will not make it', '25/03: S42 sẽ không kịp')}</h3>
<p>${t(
    'C5’s second review of LF-42 (usage report, C2) asks for a fix to date ranges that cross a month boundary. The review cannot happen again before the 19:00 cut-off on 26/03. The leader’s call, written in the board and the risk log the same evening (R-11): S42 is not demoed — an unfinished screen shown "just to look good" is the start of a report that lies. Week 3’s pack:',
    'Review lần hai của C5 cho LF-42 (báo cáo mức sử dụng, C2) yêu cầu sửa khoảng ngày vắt qua hai tháng. Không thể review lại trước mốc chốt 19:00 ngày 26/03. Quyết định của trưởng nhóm, ghi lên bảng và sổ rủi ro ngay tối đó (R-11): không demo S42 — một màn chưa xong đem ra demo "cho đẹp" là khởi đầu của một bản báo cáo nói dối. Gói tuần 3:')}</p>
${out('$ ./chay-tuan.sh 2027-03-22 /tmp/agt-lab12/labflow\n' + RA.chayTuan0322)}
${out(MA.baoCaoTuan0322)}

<h3>${t('At work: the same three weeks in an outsourcing team', 'Đi làm thật: cùng ba tuần đó trong một đội outsourcing')}</h3>
<ul>
  <li>${t('The written standup becomes a daily report to the PM or the customer, often with hourensou rules on what to report immediately (', 'Standup viết trở thành báo cáo ngày gửi PM hoặc khách, thường kèm luật hourensou về việc nào phải báo ngay (')}${ag('agl-9-7-bao-cao-hourensou', '9.7')}).</li>
  <li>${t('A customer’s mid-sprint request is a change request until someone with authority accepts the trade (', 'Yêu cầu giữa sprint của khách là change request cho tới khi người có thẩm quyền chấp nhận cuộc đổi (')}${ag('agl-9-5-qa-cr', '9.5')}).</li>
  <li>${t('A secret in a repo of a customer project is a security incident: report to the security team within the hour, before you fix anything (', 'Bí mật trong repo của dự án khách là sự cố an ninh: báo đội an ninh trong vòng một giờ, trước khi tự sửa gì (')}${ag('agl-10-7-su-co-that', '10.7')}).</li>
</ul>

${phongVan([
    [t('"Tell me about a time a teammate stopped responding."', '"Kể về một lần đồng đội ngừng phản hồi."'),
     t('Our standup script flagged a card with three working days without a commit; the deputy messaged privately that evening and I paired with them for an hour the next morning — a rule the team had agreed in the retro. They were stuck on data from other people’s screens and did not want to bother them; ten minutes fixed it and they finished two tickets that week.', 'Script standup của nhóm cờ một thẻ ba ngày làm việc không commit; phó nhóm nhắn riêng ngay tối đó và sáng hôm sau em ngồi cùng bạn ấy một giờ — luật cả nhóm đã thống nhất ở retro. Bạn ấy kẹt vì cần dữ liệu từ màn của người khác mà ngại hỏi; mười phút là gỡ được và tuần đó bạn ấy xong hai ticket.')],
    [t('"Someone committed a password. What do you do?"', '"Có người commit mật khẩu. Bạn làm gì?"'),
     t('Rotate it first, because anyone who fetched the branch still has it; then rewrite the branch before merge, and add a CI step that scans every commit of a PR. On a customer project, report to security before fixing.', 'Đổi mật khẩu trước, vì ai đã fetch nhánh vẫn còn giữ nó; rồi viết lại nhánh trước khi merge, và thêm bước CI quét từng commit của PR. Ở dự án khách, báo đội an ninh trước khi sửa.')],
    [t('"Your supervisor adds work in the middle of a sprint."', '"Giảng viên thêm việc giữa sprint."'),
     t('Make it a separate ticket, propose a trade of the same size, tell the person whose work moves before changing the board, and record the change so the report and the burndown show it.', 'Tạo ticket riêng, đề xuất đổi một phần việc cùng cỡ, báo người bị dời việc trước khi sửa bảng, và ghi lại thay đổi để báo cáo và burndown đều thấy.')],
    [t('"How do you keep reviews fast?"', '"Làm sao giữ review nhanh?"'),
     t('Small PRs, a named reviewer for each, and a visible rule: more than one working day waiting is named at the daily. In this sprint every PR opened during the sprint got its first review within one working day.', 'PR nhỏ, mỗi PR có tên người duyệt, và một luật ai cũng thấy: chờ quá một ngày làm việc thì nêu tên ở daily. Trong sprint này, mọi PR mở trong sprint đều được review lần đầu trong vòng một ngày làm việc.')],
  ], en)}

<h3>${t('Exercises', 'Bài tập')}</h3>
<ol>
  <li>${t('R3-3 says "within 24 hours". Write a script that finds every episode of a card reaching three working days without a commit and checks whether a pairing session (<code>mot-mot</code>) on that ticket happened within 24 hours.', 'R3-3 nói "trong 24 giờ". Viết script tìm mọi đợt thẻ chạm ba ngày làm việc không commit và kiểm có buổi ngồi cùng (<code>mot-mot</code>) trên đúng ticket đó trong 24 giờ không.')}</li>
  <li>${t('Rewrite reply v1 yourself — without looking at v2 — until <code>soat-tra-loi.mjs</code> passes it 7/7. Then ask: did the checker miss anything a person would notice?', 'Tự viết lại tin trả lời v1 — không nhìn v2 — tới khi <code>soat-tra-loi.mjs</code> cho qua 7/7. Rồi tự hỏi: bộ soát có bỏ sót điều gì người đọc sẽ nhận ra không?')}</li>
</ol>
${giai(t('Solution 1 (real run)', 'Lời giải 1 (chạy thật)'), js(MA.kiemR33) + out('$ node kiem-r33.mjs\n' + RA.kiemR33) + `<p>${t('One episode in sprint 3, handled within 24 hours. Note the design choice: the 24 hours start at the daily (21:30), when the team could first have seen the signal.', 'Một đợt trong sprint 3, được xử lý trong 24 giờ. Để ý lựa chọn thiết kế: 24 giờ tính từ daily (21:30), lúc nhóm có thể thấy tín hiệu sớm nhất.')}</p>`)}
${giai(t('Notes for 2', 'Gợi ý câu 2'), `<p>${t('A 7/7 message can still be cold or long-winded; the checker cannot hear tone. Read it aloud as the receiver, the day before an exam.', 'Một tin đạt 7/7 vẫn có thể lạnh lùng hay dài dòng; bộ soát không nghe được giọng. Đọc to nó lên trong vai người nhận, vào hôm trước ngày thi.')}</p>`)}

${thuatNgu([
    [t('Scope change', 'Thay đổi phạm vi'), t('Work added to or removed from a running sprint; done as a visible trade agreed with the people affected.', 'Việc thêm vào hoặc bỏ khỏi sprint đang chạy; làm như một cuộc đổi công khai, thống nhất với người bị ảnh hưởng.')],
    [t('Secret rotation', 'Đổi bí mật (rotate)'), t('Replacing a leaked credential so the old one stops working; the only fix that reaches copies you cannot delete.', 'Thay thông tin đăng nhập bị lộ để cái cũ hết tác dụng; cách sửa duy nhất chạm tới những bản sao bạn không xoá được.')],
    [t('force-with-lease', 'force-with-lease'), t('A push that overwrites a branch only if nobody else has pushed to it since you last fetched.', 'Lệnh đẩy đè nhánh chỉ khi không ai khác đẩy lên đó kể từ lần bạn fetch gần nhất.')],
    [t('Deputy', 'Phó nhóm'), t('The member who runs the daily and the evening checks when the leader is away; named at planning.', 'Người chạy daily và việc soát buổi tối khi trưởng nhóm vắng; chỉ định từ planning.')],
  ], en)}
${tomTat([
    t('Finish carried-over work first; review it first.', 'Làm nốt việc dở trước; review nó trước.'),
    t('A red report that asks for a decision is a good report.', 'Báo cáo đỏ để xin quyết định là báo cáo tốt.'),
    t('Mid-sprint additions are separate tickets traded against equal work, told to the affected person first, recorded for the scripts.', 'Việc thêm giữa sprint là ticket riêng, đổi lấy phần việc tương đương, báo người bị ảnh hưởng trước, ghi lại cho script.'),
    t('Signals tell you when to ask; the answer is often "stuck", rarely "lazy".', 'Tín hiệu cho biết khi nào cần hỏi; câu trả lời thường là "kẹt", hiếm khi là "lười".'),
    t('Leaked secret: rotate first, rewrite second, scan every commit; correct in private, update in public.', 'Lộ bí mật: đổi trước, viết lại sau, quét từng commit; góp ý riêng, cập nhật công khai.'),
  ], en)}
<p>${t('Next: ', 'Tiếp theo: ')}${ag('agl-9-3-ket-thuc', t('12.3 — Review, retro and report', '12.3 — Review, retro và báo cáo'))}.</p>
`);
};

export default {
  title: '12.2 — Daily work: PRs, reviews, standups|||12.2 — Công việc hằng ngày: PR, review, standup',
  slug: 'agl-9-2-thuc-hien',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Ba tuần sprint 3 của LabFlow chạy thật bằng bộ công cụ ch6–7: repo dựng lại có nhánh + merge thật, daily mỗi tối, gói tuần (đỏ khi cần giảng viên quyết), giảng viên thêm việc giữa sprint ⇒ đổi ngang có ghi lại, thành viên im lặng ⇒ cảnh báo sớm + ngồi cùng trong 24 giờ (kiem-r33 1/1), mật khẩu trong PR ⇒ diễn tập git thật (thêm commit xoá không đủ, bản clone cũ vẫn giữ), Uber 2016, trả lời va chạm đúng chỗ.',
  content: L122(true) + L122(false),
};
