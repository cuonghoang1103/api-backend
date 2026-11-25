/**
 * 10.6 — Lừa đảo và tấn công phi kỹ thuật nhắm vào lập trình viên (agl-10-6-lua-dao). Soạn 24/11/2026, agent agl.
 * Chạy thật: email/soi-thu.py (Python 3, thư mẫu thu-gia.eml dùng tên miền example.*) → RA.email;
 * npm-doc: gói "bcrypts-js" minh hoạ có postinstall CHỈ IN, cài trong container node:22-alpine --network none --memory 2g --cpus 2 → RA.npmDoc;
 * ten-gan-giong.mjs (khoảng cách Levenshtein) → RA.tenGanGiong.
 * Nguồn: Unit 42 (Palo Alto Networks) 11/2023 "Two campaigns by North Korea bad actors target job hunters" (Contagious Interview, BeaverTail
 * trong gói npm); Datadog Security Labs: gói passports-js, bcrypts-js, blockscan-api; npm blog 02/08/2017 "crossenv malware on the npm
 * registry" (~40 gói của tài khoản hacktask, gửi biến môi trường đi). Góc người xây chống lừa đảo: authentication ch10 (không giảng lại).
 */
import { bang, cl, note, phongVan, thuatNgu, tomTat, giai, cs, ag, ng, vo, bash, js, out } from '../_chung.mjs';
import { MA, RA } from './_ma.mjs';

export const L106 = (en) => {
  const t = (a, b) => (en ? a : b);
  return vo(en, 'Chapter 10 · Information security at work', 'Chương 10 · An ninh thông tin khi đi làm', `
<h2>${t('10.6 — Phishing and social engineering aimed at developers', '10.6 — Lừa đảo và tấn công phi kỹ thuật nhắm vào lập trình viên')}</h2>
<p class="lead">${t(
    'Developers believe they are too technical to be phished. Attackers know developers have exactly what they want — source code, cloud keys, access to customers — and that developers install unknown code from the internet many times a day. The attacks in this lesson do not break any cryptography; they borrow trust: a customer\'s name, a manager\'s urgency, a recruiter\'s offer, a package that looks like a famous one. You will read a forged e-mail\'s headers, watch a package run code during <code>npm install</code>, and learn the one habit that defeats almost all of it.',
    'Lập trình viên tin mình quá rành kỹ thuật để bị lừa. Kẻ tấn công thì biết lập trình viên có đúng thứ chúng cần — mã nguồn, khoá đám mây, quyền vào hệ thống khách — và lập trình viên cài mã lạ từ Internet nhiều lần mỗi ngày. Các đòn trong bài này không phá thuật toán mã hoá nào; chúng mượn lòng tin: tên của khách, sự gấp gáp của sếp, lời mời của nhà tuyển dụng, một gói trông giống gói nổi tiếng. Bạn sẽ đọc header của một email giả mạo, xem một gói chạy mã ngay lúc <code>npm install</code>, và học thói quen duy nhất đánh bại gần như tất cả.')}</p>

${cl('info', t(
    '<strong>Everyday picture.</strong> The phone call "this is the bank, your account is locked, read me the OTP" works not because people are stupid but because it sounds urgent and official. Workplace versions sound like your customer, your PM or your IT department.',
    '<strong>Liên tưởng đời thường.</strong> Cuộc gọi "ngân hàng đây, tài khoản anh bị khoá, đọc mã OTP cho em" thành công không phải vì người nghe kém, mà vì nó nghe gấp và chính thức. Phiên bản ở chỗ làm nghe giống khách của bạn, PM của bạn hay phòng IT.'))}

<h3>${t('The map', 'Bản đồ các kiểu tấn công')}</h3>
${bang([t('Attack', 'Kiểu'), t('What it looks like at work', 'Trông thế nào khi đi làm'), t('What they want', 'Chúng muốn gì')], [
    [t('Spear phishing / BEC', 'Spear phishing / giả danh doanh nghiệp (BEC)'), t('E-mail "from the customer\'s new PM" or "from your director" asking for a file, a DB dump, a payment or a password reset', 'Email "từ PM mới bên khách" hay "từ giám đốc" xin tệp, bản dump DB, chuyển tiền hay đặt lại mật khẩu'), t('Data, money, account access', 'Dữ liệu, tiền, quyền vào tài khoản')],
    [t('Vishing / chat pretexting', 'Gọi điện / nhắn tin giả danh'), t('"IT here, we\'re migrating your account, read me the code we just sent"', '"IT đây, bọn anh đang chuyển tài khoản, đọc giúp mã vừa gửi"'), t('Your OTP or a push approval', 'Mã OTP hay một lần bấm duyệt')],
    [t('MFA fatigue', 'Dội thông báo MFA'), t('Push prompts at night until you accept (Uber 2022, lesson 10.5)', 'Thông báo đẩy liên tục lúc nửa đêm tới khi bạn bấm nhận (Uber 2022, bài 10.5)'), t('A logged-in session', 'Một phiên đã đăng nhập')],
    [t('Fake job / coding test', 'Việc làm giả / bài test lập trình giả'), t('Recruiter on LinkedIn sends a repo: "run <code>npm install && npm start</code> and fix the bug"', 'Nhà tuyển dụng trên LinkedIn gửi repo: "chạy <code>npm install && npm start</code> rồi sửa lỗi"'), t('Code execution on your machine: keys, wallets, tokens', 'Chạy mã trên máy bạn: khoá, ví, token')],
    [t('Malicious packages', 'Gói độc'), t('<code>crossenv</code> instead of <code>cross-env</code>; a "helper" library with an install script', '<code>crossenv</code> thay vì <code>cross-env</code>; một thư viện "tiện ích" có script lúc cài'), t('Environment variables, SSH keys, cloud credentials', 'Biến môi trường, SSH key, thông tin đăng nhập đám mây')],
    [t('Malicious IDE extensions', 'Extension IDE độc'), t('A copycat of a popular extension', 'Bản nhái extension nổi tiếng'), t('Everything your editor can read', 'Mọi thứ editor của bạn đọc được')],
  ])}
<p>${t('Extensions are covered in ', 'Extension đã có ở ')}${cs('ide-va-do-nghe-dev', 'ide-1-4-extension', t('IDE &amp; dev tools 1.4', 'IDE và đồ nghề 1.4'))}; ${t('phishing seen from the side of the people who build login systems: ', 'lừa đảo nhìn từ phía người xây hệ thống đăng nhập: ')}${cs('authentication', 'auth-10-2-lua-dao', t('Authentication 10.2', 'Xác thực 10.2'))}.</p>

<h3>${t('Reading a forged e-mail (run for real)', 'Đọc một email giả mạo (chạy thật)')}</h3>
<p>${t('Your mail client shows a friendly name. The headers tell the truth. Here is a forged request (all domains are <code>example.*</code>):', 'Trình đọc thư chỉ hiện một cái tên thân thiện. Header mới nói sự thật. Đây là một yêu cầu giả mạo (mọi tên miền đều là <code>example.*</code>):')}</p>
${out(MA.thuGia)}
${bash(MA.soiThu)}
${out(RA.email)}
<ul>
<li>${t('<strong>Display name ≠ address.</strong> Anyone can type "Tanaka Hiroshi (Sakura Clinic PM)".', '<strong>Tên hiển thị ≠ địa chỉ.</strong> Ai cũng gõ được "Tanaka Hiroshi (Sakura Clinic PM)".')}</li>
<li>${t('<strong>Reply-To</strong> elsewhere: your answer goes to the attacker even if From looks right.', '<strong>Reply-To</strong> trỏ chỗ khác: thư trả lời của bạn đi tới kẻ gian dù From trông đúng.')}</li>
<li>${t('<strong>SPF/DKIM/DMARC fail</strong>: the receiving server checked and the sender is not authorised for that domain. Many clients show this as a warning banner — read it.', '<strong>SPF/DKIM/DMARC fail</strong>: máy chủ nhận đã kiểm và người gửi không được tên miền đó cho phép. Nhiều trình đọc thư hiện thành dải cảnh báo — hãy đọc nó.')}</li>
<li>${t('<strong>The real domain is at the end.</strong> <code>sakura-clinic.example.login-verify.example.net</code> belongs to whoever owns the end of the name. (The script\'s "last two labels" rule is a simplification; for <code>.co.jp</code> or <code>.com.vn</code> you need the Public Suffix List.)', '<strong>Tên miền thật nằm ở cuối.</strong> <code>sakura-clinic.example.login-verify.example.net</code> thuộc về người sở hữu phần cuối của tên. (Quy tắc "hai nhãn cuối" của script là đơn giản hoá; với <code>.co.jp</code> hay <code>.com.vn</code> cần Public Suffix List.)')}</li>
<li>${t('<strong>Pressure + isolation</strong>: a deadline today, and "don\'t bother Suzuki-san" — designed to stop you from checking.', '<strong>Ép thời gian + cô lập</strong>: hạn ngay hôm nay, và "đừng làm phiền anh Suzuki" — viết ra để bạn khỏi kiểm chứng.')}</li>
</ul>
${note(t('A perfectly authenticated e-mail can still be malicious — it may come from a real customer account that was compromised. Headers raise your suspicion; they never prove safety. The decisive check is the second channel below.', 'Một email xác thực hoàn hảo vẫn có thể độc hại — nó có thể đến từ tài khoản thật của khách đã bị chiếm. Header làm bạn nghi ngờ; nó không bao giờ chứng minh an toàn. Phép kiểm quyết định là kênh thứ hai ở dưới.'))}

<h3>${t('The fake job interview (Contagious Interview, 2023–)', 'Buổi phỏng vấn giả (Contagious Interview, 2023–)')}</h3>
<p>${t(
    'In November 2023 Palo Alto Networks\' Unit 42 described a campaign it named <strong>Contagious Interview</strong>, which it attributed with moderate confidence to a North Korean state-sponsored actor: the attackers pose as employers, invite developers to an online interview and give them a coding task to install and run. The project includes npm packages carrying JavaScript malware Unit 42 called <strong>BeaverTail</strong>, which steals data and drops a Python backdoor. Datadog Security Labs later analysed packages in the same family with names such as <code>passports-js</code> and <code>bcrypts-js</code>. Microsoft was still reporting new waves in 2026. For a student about to look for an internship, this is the most relevant attack in the chapter.',
    'Tháng 11/2023, nhóm Unit 42 của Palo Alto Networks mô tả một chiến dịch họ đặt tên <strong>Contagious Interview</strong>, và quy (với độ tin cậy trung bình) cho một nhóm được nhà nước Triều Tiên hậu thuẫn: kẻ tấn công đóng vai nhà tuyển dụng, mời lập trình viên phỏng vấn trực tuyến và giao một bài lập trình phải cài và chạy. Dự án chứa gói npm mang mã độc JavaScript mà Unit 42 gọi là <strong>BeaverTail</strong>, chuyên lấy cắp dữ liệu và thả một backdoor viết bằng Python. Sau đó Datadog Security Labs phân tích các gói cùng họ với tên như <code>passports-js</code> và <code>bcrypts-js</code>. Tới năm 2026 Microsoft vẫn báo cáo các đợt mới. Với sinh viên sắp đi tìm chỗ thực tập, đây là đòn đáng quan tâm nhất của chương.')}
${ng('https://unit42.paloaltonetworks.com/two-campaigns-by-north-korea-bad-actors-target-job-hunters/', 'Unit 42, 11/2023')} · ${ng('https://securitylabs.datadoghq.com/articles/tenacious-pungsan-dprk-threat-actor-contagious-interview/', 'Datadog Security Labs')}</p>

<h3>${t('Code runs during install (run for real)', 'Mã chạy ngay lúc cài (chạy thật)')}</h3>
<p>${t('npm runs a package\'s <code>preinstall</code>/<code>install</code>/<code>postinstall</code> scripts with <em>your</em> permissions. We made a harmless imitation named after one of those packages: its install script only <em>prints</em> what it could read. It was installed inside a throwaway container with no network and a fake home directory:', 'npm chạy script <code>preinstall</code>/<code>install</code>/<code>postinstall</code> của gói bằng quyền của <em>chính bạn</em>. Ta làm một bản bắt chước vô hại đặt theo tên một gói như thế: script cài của nó chỉ <em>in ra</em> những gì nó đọc được. Nó được cài trong một container dùng một lần, không mạng, với thư mục home giả:')}</p>
${out(MA.goiDocPkg)}
${js(MA.setupJs)}
${out(RA.npmDoc)}
<p>${t(
    'With a normal install, the script ran before you wrote a single line: it saw your tokens in the environment and your SSH and cloud key files. A real one would send them away. <code>--ignore-scripts</code> stops install scripts — but the moment you run <code>npm start</code> or <code>npm test</code>, the project\'s own code runs anyway. So for code from strangers: read <code>package.json</code> (scripts, dependencies) first, and run it only in a disposable container or VM with no access to your keys and, ideally, no network.',
    'Với lệnh cài bình thường, script chạy trước khi bạn viết được dòng nào: nó thấy token trong biến môi trường, thấy tệp SSH key và khoá đám mây. Bản thật sẽ gửi chúng đi. <code>--ignore-scripts</code> chặn script lúc cài — nhưng khi bạn chạy <code>npm start</code> hay <code>npm test</code>, mã của chính dự án vẫn chạy. Nên với mã từ người lạ: đọc <code>package.json</code> (scripts, dependencies) trước, và chỉ chạy trong container hay máy ảo dùng một lần, không đụng tới khoá của bạn và tốt nhất là không có mạng.')}</p>
${bash(`# Chạy bài test của người lạ: container dùng một lần, không mạng, không mount ~/.ssh, giới hạn tài nguyên
docker run --rm -it --network none --memory 2g --cpus 2 -v "$PWD":/app -w /app node:22-alpine sh
# Trong container: xem trước, cài không chạy script, rồi mới quyết định
cat package.json
npm install --ignore-scripts`)}

<h3>${t('Look-alike package names (run for real)', 'Tên gói na ná (chạy thật)')}</h3>
<p>${t(
    'In August 2017 npm removed about 40 packages published by one account, including <code>crossenv</code> — a look-alike of the popular <code>cross-env</code> — which sent the installing machine\'s environment variables to the attacker. npm\'s advice was to rotate every credential that had been in the shell environment. A 20-line check against a list of popular names catches the obvious cases:',
    'Tháng 8/2017, npm gỡ khoảng 40 gói do một tài khoản đăng, trong đó có <code>crossenv</code> — bản na ná của gói nổi tiếng <code>cross-env</code> — gửi biến môi trường của máy cài nó cho kẻ tấn công. Lời khuyên của npm là thay mọi thông tin đăng nhập từng nằm trong biến môi trường của shell. Một phép kiểm 20 dòng với danh sách tên phổ biến bắt được các trường hợp hiển nhiên:')}
${ng('https://blog.npmjs.org/post/163723642530/crossenv-malware-on-the-npm-registry.html', 'npm blog, 02/08/2017')}</p>
${js(MA.tenGanGiong)}
${out(RA.tenGanGiong)}
<p>${t('Before adding a dependency: check the exact name on npmjs.com, the publisher, weekly downloads, repository link and age. Lock files and review of dependency changes in PRs are team-level defences — see ', 'Trước khi thêm phụ thuộc: kiểm đúng tên trên npmjs.com, người đăng, lượt tải hằng tuần, liên kết repo và tuổi của gói. File khoá phiên bản và review thay đổi phụ thuộc trong PR là lớp phòng thủ cấp đội — xem ')}${cs('devsecops', 'dso-4-1-neu-da-hoc', t('DevSecOps 4.1', 'DevSecOps 4.1'))}.</p>

<h3>${t('The habit that beats all of it: verify through a second channel', 'Thói quen đánh bại tất cả: xác minh qua kênh thứ hai')}</h3>
${bang([t('Request', 'Yêu cầu'), t('Second channel', 'Kênh thứ hai')], [
    [t('"Customer PM" asks for data or credentials', '"PM bên khách" xin dữ liệu hay mật khẩu'), t('Ask your leader/BrSE; they contact the customer through the known channel. Data never travels through Q&amp;A (lesson 9.5).', 'Hỏi leader/BrSE; họ liên hệ khách qua kênh đã biết. Dữ liệu không bao giờ đi qua Q&amp;A (bài 9.5).')],
    [t('"Director" asks for an urgent transfer or gift cards', '"Giám đốc" nhờ chuyển khoản gấp hay mua thẻ quà tặng'), t('Call the number in the company directory, not the one in the message', 'Gọi số trong danh bạ công ty, không gọi số trong tin nhắn')],
    [t('"IT" asks for your OTP or to approve a prompt', '"IT" xin mã OTP hay nhờ bấm duyệt'), t('Real IT never asks for codes. Hang up and open a ticket in the official system.', 'IT thật không bao giờ xin mã. Cúp máy và mở ticket trên hệ thống chính thức.')],
    [t('Recruiter sends a project to run', 'Nhà tuyển dụng gửi dự án bắt chạy'), t('Check the company\'s official careers site and the recruiter on it; run code only in a sandbox', 'Kiểm trang tuyển dụng chính thức của công ty và tên người tuyển dụng ở đó; chỉ chạy mã trong môi trường cô lập')],
    [t('Link to "log in again"', 'Liên kết "đăng nhập lại"'), t('Type the address yourself or use your bookmark', 'Tự gõ địa chỉ hoặc dùng dấu trang')],
  ])}
${cl('ok', t('Saying "I\'ll confirm through my leader first" is never rude. Real customers and managers are relieved when you do it; attackers are the only people who are annoyed.', 'Nói "em xin xác nhận qua leader trước ạ" không bao giờ là bất lịch sự. Khách và sếp thật thấy yên tâm khi bạn làm vậy; chỉ kẻ gian mới khó chịu.'))}

<h3>${t('Situation at work', 'Tình huống đi làm')}</h3>
<p>${t(
    'You received the e-mail above at 15:42 and already started compressing the test DB before you noticed the Reply-To. What now? — Stop, do not send. Report it through the company\'s phishing-report button or security channel (do not just delete it — it may be targeting colleagues too), tell your leader, delete the archive you created. If you had clicked the link and typed your password, say so: change it immediately and let security revoke sessions.',
    'Bạn nhận email ở trên lúc 15:42 và đã bắt đầu nén DB test trước khi để ý Reply-To. Giờ làm gì? — Dừng, không gửi. Báo qua nút báo lừa đảo hay kênh an ninh của công ty (đừng chỉ xoá — có thể nó đang nhắm cả đồng nghiệp), báo leader, xoá tệp nén vừa tạo. Nếu đã bấm liên kết và gõ mật khẩu, hãy nói rõ: đổi mật khẩu ngay và để đội an ninh thu hồi phiên.')}</p>

<h3>${t('Exercise: spot the signals', 'Bài tập: tìm dấu hiệu')}</h3>
<ol>
<li>${t('A LinkedIn recruiter offers a remote job at 3× the usual salary; the interview is "a quick take-home: clone, <code>npm i</code>, run, fix the failing test, 30 minutes".', 'Một nhà tuyển dụng trên LinkedIn mời việc từ xa lương gấp 3; vòng phỏng vấn là "bài làm nhanh: clone, <code>npm i</code>, chạy, sửa test đang đỏ, 30 phút".')}</li>
<li>${t('Your chat shows "Quang (IT Helpdesk)" — new account, no shared groups — asking you to approve "a security update" on your phone.', 'Chat hiện "Quang (IT Helpdesk)" — tài khoản mới, không chung nhóm nào — nhờ bạn duyệt "bản cập nhật bảo mật" trên điện thoại.')}</li>
<li>${t('A PR from a teammate adds the dependency <code>lodahs</code>.', 'Một PR của đồng đội thêm phụ thuộc <code>lodahs</code>.')}</li>
</ol>
${giai(t('Answers', 'Đáp án'), `<ol>
<li>${t('Classic fake-interview pattern: unrealistic offer, urgency, run-my-code task. Verify the company and person independently; if you continue, read package.json and run only in a disposable container without network or your keys.', 'Mẫu phỏng vấn giả kinh điển: lời mời phi thực tế, gấp gáp, bắt chạy mã của họ. Xác minh công ty và người đó độc lập; nếu vẫn làm thì đọc package.json và chỉ chạy trong container dùng một lần, không mạng, không có khoá của bạn.')}</li>
<li>${t('Do not approve. Verify via the official IT ticket system or the phone number in the directory; report the account.', 'Không duyệt. Xác minh qua hệ thống ticket IT chính thức hoặc số điện thoại trong danh bạ; báo cáo tài khoản đó.')}</li>
<li>${t('Typosquat of <code>lodash</code>. Request changes; check whether anyone already installed it, and if so treat their environment as compromised.', 'Tên nhái của <code>lodash</code>. Yêu cầu sửa; kiểm xem ai đã cài chưa, nếu có thì coi môi trường của người đó là đã bị xâm nhập.')}</li>
</ol>`)}

${phongVan([
    [t('How do you recognise a phishing e-mail?', 'Bạn nhận ra email lừa đảo thế nào?'), t('Mismatch between display name and address, Reply-To elsewhere, failed SPF/DKIM/DMARC, look-alike domains, urgency and isolation, requests for data or credentials — and I verify through a second channel regardless.', 'Tên hiển thị khác địa chỉ, Reply-To trỏ chỗ khác, SPF/DKIM/DMARC thất bại, tên miền na ná, gấp gáp và cô lập, xin dữ liệu hay mật khẩu — và dù thế nào tôi vẫn xác minh qua kênh thứ hai.')],
    [t('Is it safe to run a take-home project a recruiter sends you?', 'Chạy dự án bài làm ở nhà nhà tuyển dụng gửi có an toàn không?'), t('Not by default — fake-interview campaigns deliver malware this way. I verify the company, review package.json and scripts, and run it only in an isolated container or VM.', 'Mặc định là không — các chiến dịch phỏng vấn giả phát tán mã độc đúng cách này. Tôi xác minh công ty, đọc package.json và scripts, và chỉ chạy trong container hay máy ảo cô lập.')],
    [t('What is typosquatting and how do teams defend against it?', 'Typosquatting là gì và đội phòng thế nào?'), t('Publishing malicious packages with names close to popular ones; defend with exact-name checks, lock files, dependency review in PRs, and scanners.', 'Đăng gói độc có tên gần giống gói phổ biến; phòng bằng kiểm đúng tên, file khoá phiên bản, review thay đổi phụ thuộc trong PR và công cụ quét.')],
  ], en)}

${thuatNgu([
    [t('Social engineering', 'Tấn công phi kỹ thuật (social engineering)'), t('Manipulating people rather than systems', 'Thao túng con người thay vì hệ thống')],
    [t('Spear phishing', 'Spear phishing'), t('Phishing tailored to a specific person or team', 'Lừa đảo may đo cho một người hay một đội cụ thể')],
    ['BEC', t('Business e-mail compromise — impersonating executives, partners or customers', 'Giả danh lãnh đạo, đối tác hay khách hàng qua email doanh nghiệp')],
    ['SPF / DKIM / DMARC', t('DNS-based checks of who may send mail for a domain and whether it was altered', 'Các phép kiểm dựa trên DNS: ai được gửi thư cho tên miền và thư có bị sửa không')],
    ['Typosquatting', t('Look-alike names for packages or domains', 'Tên na ná cho gói hay tên miền')],
    [t('Install script', 'Script lúc cài'), t('preinstall/install/postinstall — code npm runs during installation', 'preinstall/install/postinstall — mã npm chạy khi cài')],
  ], en)}

${tomTat([
    t('Developers are targeted because they hold code, keys and access.', 'Lập trình viên bị nhắm vì nắm mã, khoá và quyền truy cập.'),
    t('Headers reveal forgery (name ≠ address, Reply-To, DMARC fail, domain at the end); they never prove safety.', 'Header lộ dấu giả mạo (tên ≠ địa chỉ, Reply-To, DMARC fail, tên miền ở cuối); không bao giờ chứng minh an toàn.'),
    t('Installing a package can run code; strangers\' projects run only in disposable sandboxes.', 'Cài một gói có thể chạy mã; dự án của người lạ chỉ chạy trong môi trường dùng một lần.'),
    t('Check exact package names; look-alikes like crossenv stole credentials.', 'Kiểm đúng tên gói; bản nhái như crossenv đã lấy cắp thông tin đăng nhập.'),
    t('Verify every unusual request through a second, known channel.', 'Xác minh mọi yêu cầu bất thường qua kênh thứ hai đã biết.'),
  ], en)}
<p>${t('Next', 'Tiếp theo')}: ${ag('agl-10-7-su-co-that', t('10.7 — real leaks and what they teach', '10.7 — sự cố rò rỉ thật và bài học'))}.</p>
`);
};
