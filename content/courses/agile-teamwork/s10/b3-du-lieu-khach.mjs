/**
 * 10.3 — Dữ liệu và mã của khách (agl-10-3-du-lieu-khach). Soạn 24/11/2026, agent agl.
 * Chạy thật (Node 22.22.2): scratchpad/agl/lab/ch10/du-lieu/{lam-gia.mjs, bam-tran.mjs, truoc-khi-dan.mjs} (RA.lamGia, RA.bamTran, RA.truocKhiDan).
 * Samsung: Bloomberg 02/05/2023 "Samsung Bans Staff's AI Use After Spotting ChatGPT Data Leak" (bản ghi nhớ nội bộ: kỹ sư tải mã nội bộ
 * lên ChatGPT trong tháng 4; cấm AI tạo sinh trên thiết bị + mạng công ty); The Register 02/05/2023.
 * Luật: Luật Bảo vệ dữ liệu cá nhân 91/2025/QH15 (thông qua 26/06/2025, hiệu lực 01/01/2026) — chuyên sâu ở khoá privacy-data-law.
 */
import { bang, cl, note, phongVan, thuatNgu, tomTat, giai, cs, ag, ng, vo, js, out } from '../_chung.mjs';
import { MA, RA } from './_ma.mjs';

export const L103 = (en) => {
  const t = (a, b) => (en ? a : b);
  return vo(en, 'Chapter 10 · Information security at work', 'Chương 10 · An ninh thông tin khi đi làm', `
<h2>${t('10.3 — Customer data and code: no copying out, no personal repos, no public AI', '10.3 — Dữ liệu và mã của khách: không mang ra, không repo cá nhân, không AI công cộng')}</h2>
<p class="lead">${t(
    'Everything the customer gives you — code, documents, database dumps, logs, screenshots — is on loan. It may live only in the places the contract and the project allow. In 2026 the easiest way to move it somewhere else is not a USB stick; it is pasting it into a chat box. This lesson sets the three rules, shows how to check a snippet before it leaves, and how to build realistic fake data so you never need the real thing on your laptop.',
    'Mọi thứ khách đưa cho bạn — mã, tài liệu, bản dump database, log, ảnh chụp màn hình — đều là đồ mượn. Nó chỉ được nằm ở những nơi hợp đồng và dự án cho phép. Năm 2026, cách dễ nhất để mang nó đi nơi khác không còn là USB; mà là dán vào một ô chat. Bài này đặt ra ba quy tắc, chỉ cách soát một đoạn văn bản trước khi nó rời khỏi tay bạn, và cách tạo dữ liệu giả đủ thật để bạn không bao giờ cần dữ liệu thật trên laptop.')}</p>

${cl('info', t(
    '<strong>Everyday picture.</strong> A bank teller counts your money at the counter. She may not take a photo of your passbook to ask a friend "is this signature odd?", even if the friend is an expert. Help is fine; carrying the customer\'s things out of the bank is not.',
    '<strong>Liên tưởng đời thường.</strong> Giao dịch viên ngân hàng đếm tiền của bạn ngay tại quầy. Cô ấy không được chụp sổ tiết kiệm của bạn để hỏi bạn bè "chữ ký này có lạ không?", kể cả khi người bạn là chuyên gia. Nhờ giúp thì được; mang đồ của khách ra khỏi ngân hàng thì không.'))}

<h3>${t('Three rules', 'Ba quy tắc')}</h3>
${bang([t('Rule', 'Quy tắc'), t('Includes', 'Gồm cả'), t('Why', 'Vì sao')], [
    [t('<strong>1. Data stays where it is allowed to be</strong>', '<strong>1. Dữ liệu chỉ ở nơi được phép</strong>'), t('Personal e-mail, personal Google Drive/OneDrive, Zalo/Messenger/Telegram, personal phone photos, home PC', 'Email cá nhân, Google Drive/OneDrive cá nhân, Zalo/Messenger/Telegram, ảnh trên điện thoại riêng, máy tính ở nhà'), t('Outside company control: no access control, no audit log, cannot be wiped when you leave', 'Ngoài tầm kiểm soát của công ty: không phân quyền, không nhật ký, không xoá được khi bạn nghỉ')],
    [t('<strong>2. No customer code in personal repos</strong>', '<strong>2. Không đưa mã khách vào repo cá nhân</strong>'), t('Private repos, gists, "temporary" forks, pastebins, online formatters/diff tools', 'Repo private, gist, fork "tạm", pastebin, các trang định dạng/so sánh mã trực tuyến'), t('Lesson 10.1 (NDA) and 10.7 (the Toyota case)', 'Bài 10.1 (NDA) và 10.7 (vụ Toyota)')],
    [t('<strong>3. No public AI unless the project approves it</strong>', '<strong>3. Không dùng AI công cộng trừ khi dự án cho phép</strong>'), t('Chatbots, browser extensions that "explain code", AI features in online tools, translation sites', 'Chatbot, extension trình duyệt "giải thích mã", tính năng AI trong công cụ trực tuyến, trang dịch thuật'), t('What you paste leaves the company boundary; the customer contract may forbid any third party', 'Thứ bạn dán rời khỏi ranh giới công ty; hợp đồng với khách có thể cấm mọi bên thứ ba')],
  ])}
${note(t('Translation sites count too. Pasting a Japanese DD into a free online translator sends the whole document to a third party. Use the translation tool your company provides.', 'Trang dịch thuật cũng tính. Dán DD tiếng Nhật vào trang dịch miễn phí là gửi nguyên tài liệu cho bên thứ ba. Hãy dùng công cụ dịch công ty cung cấp.'))}

<h3>${t('A real case: Samsung, April 2023', 'Chuyện thật: Samsung, tháng 4/2023')}</h3>
<p>${t(
    'Bloomberg reported on 2 May 2023 that Samsung Electronics had banned staff from using generative AI tools such as ChatGPT on company devices and internal networks, after discovering that engineers had uploaded internal source code to ChatGPT in April. According to the internal memo quoted by the press, staff using personal devices were told not to submit company information, and violations could lead to dismissal. Nobody hacked Samsung; engineers were trying to work faster.',
    'Bloomberg đưa tin ngày 02/05/2023 rằng Samsung Electronics cấm nhân viên dùng công cụ AI tạo sinh như ChatGPT trên thiết bị và mạng nội bộ của công ty, sau khi phát hiện kỹ sư đã tải mã nguồn nội bộ lên ChatGPT trong tháng 4. Theo bản ghi nhớ nội bộ được báo chí trích, nhân viên dùng thiết bị cá nhân được dặn không gửi thông tin công ty, vi phạm có thể bị cho thôi việc. Không ai tấn công Samsung cả; các kỹ sư chỉ đang cố làm cho nhanh.')}
${ng('https://www.bloomberg.com/news/articles/2023-05-02/samsung-bans-chatgpt-and-other-generative-ai-use-by-staff-after-leak', 'Bloomberg, 02/05/2023')} · ${ng('https://www.theregister.com/2023/05/02/samsung_generative_ai_ban/', 'The Register, 02/05/2023')}</p>

<h3>${t('AI at work: what is actually the problem', 'AI khi đi làm: vấn đề thật sự là gì')}</h3>
<ul>
<li>${t('<strong>The data leaves.</strong> Whatever the provider promises about training, the text has been sent to, processed by and possibly logged at a third party. Many customer contracts forbid that, full stop.', '<strong>Dữ liệu đã rời đi.</strong> Nhà cung cấp hứa gì về việc huấn luyện thì văn bản cũng đã được gửi tới, xử lý và có thể được ghi log ở bên thứ ba. Nhiều hợp đồng với khách cấm hẳn điều đó.')}</li>
<li>${t('<strong>Consumer vs enterprise.</strong> A company-approved AI tool with a contract (data not used for training, retention limits, region, audit) is a different thing from your personal free account — even if the model is the same.', '<strong>Bản cá nhân và bản doanh nghiệp.</strong> Công cụ AI công ty đã duyệt, có hợp đồng (không dùng dữ liệu để huấn luyện, giới hạn lưu trữ, vùng lưu, kiểm toán) khác hẳn tài khoản miễn phí của bạn — kể cả khi cùng một mô hình.')}</li>
<li>${t('<strong>Per project, not per company.</strong> The company may approve a tool, and a particular customer may still forbid it. Ask your leader: "Is tool X allowed on this project, and for what?"', '<strong>Theo dự án, không theo công ty.</strong> Công ty có thể duyệt một công cụ mà khách cụ thể vẫn cấm. Hỏi leader: "Công cụ X có được dùng ở dự án này không, dùng cho việc gì?"')}</li>
<li>${t('<strong>Output is your responsibility.</strong> Generated code may be wrong, insecure or copied from licensed code; you review it like a junior colleague\'s PR. More in ', '<strong>Kết quả là trách nhiệm của bạn.</strong> Mã sinh ra có thể sai, kém an toàn hoặc chép từ mã có giấy phép; bạn review nó như PR của một đồng nghiệp mới. Thêm ở ')}${cs('ai-coding', 'ai-0-9-bat-dau-khi-khong-co', t('AI coding — when AI gets it wrong', 'AI coding — khi AI làm sai'))}.</li>
</ul>
<p>${t('Even when a tool is allowed, minimise what you send: the error message and a <em>minimal</em> reproduction with fake names beat the whole file. The privacy angle (prompts as personal data processing) is in ', 'Kể cả khi công cụ được phép, hãy tối thiểu hoá thứ gửi đi: thông báo lỗi và một bản tái hiện <em>tối giản</em> với tên giả tốt hơn nguyên tệp. Góc quyền riêng tư (prompt là một hoạt động xử lý dữ liệu cá nhân) ở ')}${cs('privacy-data-law', 'pdl-5-2-toi-thieu', t('Privacy 5.2', 'Quyền riêng tư 5.2'))} ${t('and', 'và')} ${cs('privacy-data-law', 'pdl-5-5-ai', '5.5')}.</p>

<h3>${t('Check before you paste (run for real)', 'Soát trước khi dán (chạy thật)')}</h3>
<p>${t('A 30-line checker: read text from standard input, flag secrets, personal data, internal addresses and a deny-list of customer/project names. Fake-data conventions (<code>example.*</code> domains from RFC 2606, numbers 09000000xx) are allowed.', 'Một bộ soát 30 dòng: đọc văn bản từ đầu vào chuẩn, đánh dấu bí mật, dữ liệu cá nhân, địa chỉ nội bộ và danh sách cấm tên khách/dự án. Dữ liệu giả theo quy ước (tên miền <code>example.*</code> theo RFC 2606, số 09000000xx) được bỏ qua.')}</p>
${js(MA.truocKhiDan)}
<p>${t('The snippet a developer wanted to ask about, and the cleaned version:', 'Đoạn mã một dev muốn hỏi, và bản đã làm sạch:')}</p>
${out(MA.doanCanHoi)}
${out(MA.doanSach)}
${out(RA.truocKhiDan)}
${note(t('A regex checker catches the obvious; it cannot know that "the renal unit queue" is the customer\'s confidential business rule. It is a seatbelt, not permission. Real companies use data loss prevention (DLP) tools on a much larger scale.', 'Bộ soát bằng regex chỉ bắt thứ hiển nhiên; nó không biết "hàng chờ khoa thận" là quy tắc nghiệp vụ mật của khách. Nó là dây an toàn, không phải giấy phép. Công ty thật dùng công cụ chống rò rỉ dữ liệu (DLP) ở quy mô lớn hơn nhiều.'))}

<h3>${t('Fake data for development (run for real)', 'Dữ liệu giả cho môi trường dev (chạy thật)')}</h3>
<p>${t('"The bug only happens with production data" is the most common excuse for copying a real DB to a laptop. Usually you need the <em>shape</em> of the data (lengths, Unicode, relations, edge cases), not the people. Real extract:', '"Lỗi chỉ xảy ra với dữ liệu production" là lý do hay gặp nhất để chép DB thật về laptop. Thường thứ bạn cần là <em>hình dạng</em> dữ liệu (độ dài, Unicode, quan hệ, trường hợp biên), không phải con người thật. Bản trích thật:')}</p>
${out(MA.benhNhan)}
${js(MA.lamGia)}
${out(RA.lamGia)}
<p>${t(
    'The same e-mail always maps to the same pseudonym (so JOINs between tables still match), but without the secret key nobody can map it back. Change the key and every pseudonym changes. Why not just SHA-256 the e-mail? Because anyone with a list of candidate e-mails — and leaked lists are everywhere — can hash them and compare:',
    'Cùng một email luôn ra cùng một mã giả (nên JOIN giữa các bảng vẫn khớp), nhưng không có khoá bí mật thì không ai dò ngược được. Đổi khoá là mọi mã giả đổi theo. Sao không băm SHA-256 email cho nhanh? Vì ai có danh sách email ứng viên — và danh sách bị lộ thì đầy rẫy — cũng băm lại rồi so được:')}</p>
${js(MA.bamTran)}
${out(RA.bamTran)}
${cl('warn', t(
    '<strong>Pseudonymised is not anonymous.</strong> Under GDPR, pseudonymised data is still personal data, because whoever holds the key can re-identify people. True anonymisation (no reasonable way back, including by combining fields like birth year + district + diagnosis) is much harder. For dev, prefer <em>synthetic</em> data generated from scratch; use pseudonymised copies only with approval.',
    '<strong>Giả danh không phải ẩn danh.</strong> Theo GDPR, dữ liệu đã giả danh vẫn là dữ liệu cá nhân, vì ai giữ khoá vẫn nhận diện lại được. Ẩn danh thật (không có cách hợp lý nào lần ngược, kể cả ghép các trường như năm sinh + quận + chẩn đoán) khó hơn nhiều. Cho môi trường dev, ưu tiên dữ liệu <em>tổng hợp</em> sinh từ đầu; chỉ dùng bản giả danh khi được phép.'))}

<h3>${t('The law, in one paragraph', 'Luật, trong một đoạn')}</h3>
<p>${t(
    'Vietnam\'s Law on Personal Data Protection No. 91/2025/QH15 was passed on 26 June 2025 and took effect on 1 January 2026, replacing the framework of Decree 13/2023/ND-CP; health data is in the sensitive category. A Japanese customer\'s data is also governed by Japan\'s APPI, a European customer\'s by GDPR. As an employee you do not interpret these laws — you follow the project rules built on them, and you report when data turns up where it should not be. In depth: ',
    'Luật Bảo vệ dữ liệu cá nhân số 91/2025/QH15 được thông qua ngày 26/06/2025, có hiệu lực từ 01/01/2026, thay cho khung Nghị định 13/2023/NĐ-CP; dữ liệu sức khoẻ thuộc nhóm nhạy cảm. Dữ liệu của khách Nhật còn chịu luật APPI của Nhật, khách châu Âu chịu GDPR. Là nhân viên, bạn không tự diễn giải các luật này — bạn làm theo quy định dự án được xây trên chúng, và báo cáo khi thấy dữ liệu nằm ở nơi không nên. Chuyên sâu: ')}${cs('privacy-data-law', 'pdl-3-1-tong-quan', t('Privacy 3.1', 'Quyền riêng tư 3.1'))}.</p>

<h3>${t('Hacker\'s corner: data that wanders is data that gets found', 'Góc hacker: dữ liệu đi lạc là dữ liệu bị tìm thấy')}</h3>
<p>${t(
    'Attackers do not need to break into the customer if a copy is lying in an easier place: a public S3 bucket made for "sharing test data with the team", a personal Google Drive link set to "anyone with the link", a forgotten <code>dump.sql</code> in a repo. Search engines and dedicated scanners index such places continuously. Every extra copy is one more door — the rule "data stays where it is allowed" is about reducing doors.',
    'Kẻ tấn công không cần đột nhập hệ thống khách nếu có một bản sao nằm ở chỗ dễ hơn: bucket S3 công khai tạo ra để "chia sẻ dữ liệu test cho đội", liên kết Google Drive cá nhân đặt "ai có liên kết đều xem được", tệp <code>dump.sql</code> quên trong repo. Công cụ tìm kiếm và máy quét chuyên dụng liên tục lập chỉ mục những chỗ như vậy. Mỗi bản sao thêm là thêm một cánh cửa — quy tắc "dữ liệu chỉ ở nơi được phép" là để bớt cửa.')}</p>

<h3>${t('Situation at work', 'Tình huống đi làm')}</h3>
<p>${t(
    'The customer\'s support team e-mails a 2 GB production dump to "help you reproduce the bug faster". What do you do? — Do not download it to your laptop. Tell your leader; the project decides where (if anywhere) it may be stored — usually an approved environment with access control — who may access it, and when it is deleted. Ask the customer for the minimal data that reproduces the issue, or reproduce it with synthetic data. Record the decision in the Q&amp;A list (lesson 9.5).',
    'Đội hỗ trợ của khách gửi email một bản dump production 2 GB "để các bạn tái hiện lỗi nhanh hơn". Bạn làm gì? — Không tải về laptop. Báo leader; dự án quyết định lưu ở đâu (nếu được lưu) — thường là môi trường được duyệt có phân quyền — ai được truy cập, và khi nào xoá. Xin khách phần dữ liệu tối thiểu tái hiện được lỗi, hoặc tái hiện bằng dữ liệu tổng hợp. Ghi quyết định vào Q&amp;A list (bài 9.5).')}</p>

<h3>${t('Exercise', 'Bài tập')}</h3>
<ol>
<li>${t('Allowed or not: pasting a stack trace from the customer\'s staging server into your personal ChatGPT account?', 'Được hay không: dán stack trace từ server staging của khách vào tài khoản ChatGPT cá nhân?')}</li>
<li>${t('Allowed or not: forwarding a DD to your Gmail to read on the bus?', 'Được hay không: chuyển tiếp DD sang Gmail để đọc trên xe buýt?')}</li>
<li>${t('Extend <code>truoc-khi-dan.mjs</code> with a rule for JWTs (three base64url parts separated by dots, starting with <code>eyJ</code>).', 'Mở rộng <code>truoc-khi-dan.mjs</code> thêm luật cho JWT (ba phần base64url ngăn bằng dấu chấm, bắt đầu bằng <code>eyJ</code>).')}</li>
<li>${t('Why does <code>lam-gia.mjs</code> keep only the birth year?', 'Vì sao <code>lam-gia.mjs</code> chỉ giữ năm sinh?')}</li>
</ol>
${giai(t('Answers', 'Đáp án'), `<ol>
<li>${t('Not allowed: a stack trace contains package names, hosts, sometimes data. Use the approved tool if there is one, with a minimal fake reproduction.', 'Không: stack trace có tên package, máy chủ, có khi cả dữ liệu. Dùng công cụ được duyệt nếu có, với bản tái hiện tối giản bằng dữ liệu giả.')}</li>
<li>${t('Not allowed: personal e-mail is outside company control. Use the company mobile app/VPN if your project permits reading on the go.', 'Không: email cá nhân nằm ngoài kiểm soát công ty. Dùng ứng dụng di động/VPN công ty nếu dự án cho đọc ngoài văn phòng.')}</li>
<li>${t('For example <code>[\'JWT\', /\\beyJ[\\w-]+\\.[\\w-]+\\.[\\w-]+/]</code>.', 'Ví dụ <code>[\'JWT\', /\\beyJ[\\w-]+\\.[\\w-]+\\.[\\w-]+/]</code>.')}</li>
<li>${t('A full birth date plus a few other fields can identify a person; the year is usually enough for age-based rules in dev.', 'Ngày sinh đầy đủ cộng vài trường khác có thể nhận diện một người; năm sinh thường đủ cho các quy tắc theo tuổi ở môi trường dev.')}</li>
</ol>`)}

${phongVan([
    [t('Do you use AI tools when coding? How do you handle confidentiality?', 'Bạn có dùng AI khi code không? Xử lý chuyện bảo mật thế nào?'), t('Yes, but only tools approved for the specific project, with minimal context and no customer data or secrets; I review the output like any other code.', 'Có, nhưng chỉ công cụ được duyệt cho dự án cụ thể, gửi ngữ cảnh tối thiểu, không dữ liệu khách hay bí mật; kết quả tôi review như mọi mã khác.')],
    [t('How would you get realistic test data without using production data?', 'Bạn lấy dữ liệu test đủ thật mà không dùng dữ liệu production thế nào?'), t('Generate synthetic data matching the schema and edge cases; if a copy is unavoidable, use an approved, pseudonymised extract with a key held outside dev, and delete it when done.', 'Sinh dữ liệu tổng hợp theo schema và các trường hợp biên; nếu buộc phải có bản sao thì dùng bản trích giả danh đã được duyệt, khoá giữ ngoài dev, xong thì xoá.')],
    [t('Is hashing an e-mail enough to anonymise it?', 'Băm email có đủ để ẩn danh không?'), t('No — an unsalted hash can be reversed by hashing candidate e-mails; a keyed HMAC gives pseudonymisation, which is still personal data.', 'Không — hàm băm không có khoá dò ngược được bằng cách băm danh sách email ứng viên; HMAC có khoá cho ra dữ liệu giả danh, vẫn là dữ liệu cá nhân.')],
  ], en)}

${thuatNgu([
    [t('Pseudonymisation', 'Giả danh (pseudonymisation)'), t('Replacing identifiers with codes that can be reversed only with separate information (a key)', 'Thay định danh bằng mã chỉ lần ngược được khi có thông tin riêng (khoá)')],
    [t('Anonymisation', 'Ẩn danh (anonymisation)'), t('Irreversibly removing the ability to identify a person', 'Loại bỏ không thể đảo ngược khả năng nhận diện một người')],
    [t('Synthetic data', 'Dữ liệu tổng hợp'), t('Data generated from scratch that only imitates the real shape', 'Dữ liệu sinh từ đầu, chỉ bắt chước hình dạng dữ liệu thật')],
    ['HMAC', t('Keyed hash — same input + same key ⇒ same output; without the key, cannot be recomputed', 'Hàm băm có khoá — cùng đầu vào + cùng khoá ⇒ cùng kết quả; không có khoá thì không tính lại được')],
    ['DLP', t('Data loss prevention — tools that detect and block sensitive data leaving the company', 'Chống rò rỉ dữ liệu — công cụ phát hiện và chặn dữ liệu nhạy cảm rời khỏi công ty')],
  ], en)}

${tomTat([
    t('Customer data and code are on loan: only approved places, never personal drives, chats or repos.', 'Dữ liệu và mã của khách là đồ mượn: chỉ ở nơi được duyệt, không ổ cá nhân, chat hay repo cá nhân.'),
    t('AI tools: approved for this project, minimal context, no data or secrets — Samsung 2023 is the warning.', 'Công cụ AI: được duyệt cho dự án này, ngữ cảnh tối thiểu, không dữ liệu hay bí mật — Samsung 2023 là lời cảnh báo.'),
    t('Check before you paste; a checker is a seatbelt, not permission.', 'Soát trước khi dán; bộ soát là dây an toàn, không phải giấy phép.'),
    t('Develop with synthetic or pseudonymised data; plain hashes are reversible by guessing.', 'Phát triển bằng dữ liệu tổng hợp hoặc giả danh; băm trần đoán ngược được.'),
  ], en)}
<p>${t('Next', 'Tiếp theo')}: ${ag('agl-10-4-thiet-bi', t('10.4 — devices and networks', '10.4 — thiết bị và mạng'))}.</p>
`);
};
