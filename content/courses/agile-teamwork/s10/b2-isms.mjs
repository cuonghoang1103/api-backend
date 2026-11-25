/**
 * 10.2 — ISMS và ISO 27001 cho nhân viên (agl-10-2-isms). Soạn 24/11/2026, agent agl.
 * Chạy thật: scratchpad/agl/lab/ch10/excel/bao-gia.fods → LibreOffice headless → .xlsx, mở zip đọc sheet ẩn + docProps (RA.excel).
 * Nguồn: ISO/IEC 27001:2022 — Annex A 93 biện pháp, 4 nhóm (tổ chức 37, con người 8, vật lý 14, công nghệ 34); A 5.12 phân loại,
 * A 5.13 gắn nhãn, A 6.3 nhận thức/đào tạo, A 6.6 NDA, A 6.8 báo cáo sự kiện ATTT, A 7.7 bàn sạch/màn hình sạch (iso.org, isms.online).
 * Vụ "dodgy dossier" 02/2003: nhật ký sửa đổi trong tệp Word lộ tên người soạn (en.wikipedia.org/wiki/Dodgy_Dossier).
 */
import { bang, cl, note, phongVan, thuatNgu, tomTat, giai, cs, ag, ng, vo, out } from '../_chung.mjs';
import { RA } from './_ma.mjs';

export const L102 = (en) => {
  const t = (a, b) => (en ? a : b);
  return vo(en, 'Chapter 10 · Information security at work', 'Chương 10 · An ninh thông tin khi đi làm', `
<h2>${t('10.2 — ISMS and ISO 27001 for employees: classification, clean desk, reporting', '10.2 — ISMS và ISO 27001 cho nhân viên: phân loại tài liệu, bàn làm việc sạch, báo cáo sự cố')}</h2>
<p class="lead">${t(
    'Large outsourcing companies win Japanese and European contracts partly because they are certified to ISO/IEC 27001. That certificate is not a firewall; it is a promise that every employee follows a set of rules — and auditors check it by walking around the office, looking at screens and asking interns questions. This lesson gives you the part of the ISMS that lands on your desk: the three properties you protect, document labels, clean desk and clear screen, hidden data in files, and what to do the moment something looks wrong.',
    'Các công ty outsourcing lớn giành được hợp đồng Nhật, châu Âu một phần nhờ có chứng nhận ISO/IEC 27001. Chứng chỉ đó không phải tường lửa; nó là lời cam kết rằng mọi nhân viên làm theo một bộ quy tắc — và kiểm toán viên kiểm bằng cách đi quanh văn phòng, nhìn màn hình, hỏi cả thực tập sinh. Bài này đưa cho bạn phần ISMS rơi xuống bàn làm việc của chính bạn: ba tính chất cần bảo vệ, nhãn tài liệu, bàn sạch và màn hình sạch, dữ liệu ẩn trong tệp, và việc phải làm ngay khi thấy có gì không ổn.')}</p>

<h3>${t('ISMS, ISO 27001 — in one paragraph', 'ISMS, ISO 27001 — trong một đoạn')}</h3>
<p>${t(
    'An <strong>ISMS</strong> (information security management system) is the set of policies, roles, risk assessments and controls a company uses to protect information, plus the cycle of checking and improving them. <strong>ISO/IEC 27001</strong> is the international standard that says what an ISMS must contain; a company can be audited and certified against it. Its 2022 edition lists <strong>93 controls</strong> in Annex A, grouped into four themes: organisational (37), people (8), physical (14) and technological (34). The supporting standard ISO/IEC 27002 explains each control. You do not need to memorise them — but six of them are literally about you:',
    '<strong>ISMS</strong> (hệ thống quản lý an ninh thông tin) là tập hợp chính sách, vai trò, đánh giá rủi ro và biện pháp kiểm soát mà công ty dùng để bảo vệ thông tin, cộng với vòng kiểm tra – cải tiến chúng. <strong>ISO/IEC 27001</strong> là tiêu chuẩn quốc tế quy định một ISMS phải có gì; công ty được đánh giá và cấp chứng nhận theo nó. Bản 2022 liệt kê <strong>93 biện pháp kiểm soát</strong> ở Phụ lục A, chia bốn nhóm: tổ chức (37), con người (8), vật lý (14) và công nghệ (34). Tiêu chuẩn đi kèm ISO/IEC 27002 giải thích từng biện pháp. Bạn không cần thuộc — nhưng có sáu cái nói thẳng về bạn:')}</p>
${bang([t('Control (2022)', 'Biện pháp (2022)'), t('What it means on your desk', 'Nghĩa là gì ở bàn làm việc')], [
    [t('A 5.12 Classification of information', 'A 5.12 Phân loại thông tin'), t('Every document has a level; you treat it according to that level', 'Mọi tài liệu có một mức; bạn xử lý theo đúng mức đó')],
    [t('A 5.13 Labelling of information', 'A 5.13 Gắn nhãn thông tin'), t('The level is written on it (header, file name, e-mail subject)', 'Mức được ghi lên tài liệu (đầu trang, tên tệp, tiêu đề email)')],
    [t('A 6.3 Awareness, education and training', 'A 6.3 Nhận thức, giáo dục, đào tạo'), t('The security training and test you take in week one — and yearly after', 'Buổi đào tạo + bài kiểm tra an ninh ở tuần đầu — và hằng năm sau đó')],
    [t('A 6.6 Confidentiality or NDAs', 'A 6.6 Thoả thuận bảo mật / NDA'), t('What you signed (lesson 10.1)', 'Thứ bạn đã ký (bài 10.1)')],
    [t('A 6.8 Information security event reporting', 'A 6.8 Báo cáo sự kiện an ninh thông tin'), t('You report anything suspicious, fast, through the official channel', 'Bạn báo mọi điều đáng ngờ, nhanh, qua kênh chính thức')],
    [t('A 7.7 Clear desk and clear screen', 'A 7.7 Bàn sạch và màn hình sạch'), t('No papers left out, screen locked when you stand up', 'Không để giấy tờ, khoá màn hình khi đứng dậy')],
  ])}
<p>${ng('https://www.iso.org/standard/27001', 'iso.org — ISO/IEC 27001:2022')}. ${t('CMMI (lesson 9.2) is about how well a company runs its processes; ISO 27001 is about how it protects information. Outsourcing companies typically hold both.', 'CMMI (bài 9.2) nói về công ty vận hành quy trình tốt đến đâu; ISO 27001 nói về cách nó bảo vệ thông tin. Công ty outsourcing thường có cả hai.')}</p>

<h3>${t('Confidentiality, integrity, availability — with a medical record', 'Bảo mật, toàn vẹn, sẵn sàng — bằng một bệnh án')}</h3>
${bang([t('Property', 'Tính chất'), t('Medical record', 'Bệnh án'), t('In your project', 'Trong dự án của bạn'), t('Typical violation by an employee', 'Vi phạm điển hình của nhân viên')], [
    [t('<strong>Confidentiality</strong>', '<strong>Bảo mật</strong> (confidentiality)'), t('Only the treating doctor reads it', 'Chỉ bác sĩ điều trị được đọc'), t('Only project members see code and data', 'Chỉ thành viên dự án thấy mã và dữ liệu'), t('E-mail sent to the wrong "Nguyễn", screen shared with chat notifications', 'Gửi email nhầm "Nguyễn", chia sẻ màn hình lộ thông báo chat')],
    [t('<strong>Integrity</strong>', '<strong>Toàn vẹn</strong> (integrity)'), t('Nobody changes the drug dose without a trace', 'Không ai sửa liều thuốc mà không để lại dấu vết'), t('Code changes only through reviewed PRs; documents only through versions', 'Mã chỉ đổi qua PR có review; tài liệu chỉ đổi qua phiên bản'), t('Editing data directly on the test DB "just to make the test pass"', 'Sửa thẳng dữ liệu trên DB test "cho test qua"')],
    [t('<strong>Availability</strong>', '<strong>Sẵn sàng</strong> (availability)'), t('The ER doctor can open it at 3 a.m.', 'Bác sĩ cấp cứu mở được lúc 3 giờ sáng'), t('The staging server and the repo are up when needed', 'Server staging và repo chạy được khi cần'), t('Running a load test on a shared server, deleting the only copy of a file', 'Chạy test tải trên server dùng chung, xoá bản duy nhất của một tệp')],
  ])}

<h3>${t('Labels and how to handle each', 'Nhãn tài liệu và cách xử lý từng loại')}</h3>
<p>${t('Names differ between companies (some add "Strictly Confidential" or "Secret"); the idea is the same. Look for the label in the header, footer, file name or e-mail subject — and if there is none on a customer document, treat it as Confidential.', 'Tên gọi khác nhau giữa các công ty (có nơi thêm "Strictly Confidential" hay "Secret"); ý tưởng thì giống nhau. Tìm nhãn ở đầu trang, chân trang, tên tệp hay tiêu đề email — tài liệu của khách mà không có nhãn thì coi là Confidential.')}</p>
${bang([t('Label', 'Nhãn'), t('Examples', 'Ví dụ'), t('Store', 'Lưu'), t('Send', 'Gửi'), t('Print / dispose', 'In / huỷ')], [
    ['Public', t('Website text, published job ads', 'Nội dung website, tin tuyển dụng đã đăng'), t('Anywhere', 'Đâu cũng được'), t('Anyone', 'Ai cũng được'), t('Normal bin', 'Thùng rác thường')],
    ['Internal', t('Org chart, internal training, meeting room schedule', 'Sơ đồ tổ chức, tài liệu đào tạo nội bộ, lịch phòng họp'), t('Company systems only', 'Chỉ hệ thống công ty'), t('Employees only', 'Chỉ nhân viên'), t('Avoid printing; shred', 'Hạn chế in; cắt huỷ')],
    ['Confidential', t('Customer BD/DD, source code, test data, estimates, prices', 'BD/DD của khách, mã nguồn, dữ liệu test, ước lượng, giá'), t('Project folders with access control', 'Thư mục dự án có phân quyền'), t('Project members only; encrypted or via approved file-sharing', 'Chỉ thành viên dự án; mã hoá hoặc qua kênh chia sẻ được duyệt'), t('Print only if allowed, collect immediately, locked shred bin', 'Chỉ in khi được phép, lấy ngay, thùng huỷ có khoá')],
    [t('Strictly confidential / Secret', 'Strictly confidential / Secret'), t('Real personal data, production credentials, security reports', 'Dữ liệu cá nhân thật, mật khẩu production, báo cáo bảo mật'), t('Named individuals only, often a separate secure room or system', 'Chỉ người có tên, thường phòng hay hệ thống bảo mật riêng'), t('Named recipients; logged', 'Người nhận có tên; có ghi nhật ký'), t('Usually no printing', 'Thường cấm in')],
  ])}

<h3>${t('Clean desk, clear screen', 'Bàn sạch, màn hình sạch')}</h3>
<ul>
<li>${t('Lock the screen <strong>every</strong> time you stand up: <code>Win + L</code> (Windows), <code>Ctrl + Cmd + Q</code> (macOS), <code>Super + L</code> (most Linux desktops). Auditors and colleagues test this; in some offices an unlocked screen earns a "you bought coffee for the team" message sent from your own chat.', 'Khoá màn hình <strong>mỗi</strong> lần đứng dậy: <code>Win + L</code> (Windows), <code>Ctrl + Cmd + Q</code> (macOS), <code>Super + L</code> (đa số desktop Linux). Kiểm toán viên và đồng nghiệp sẽ thử; có văn phòng ai để màn hình mở là bị nhắn hộ "hôm nay mình mời cả đội cà phê" từ chính tài khoản chat của mình.')}</li>
<li>${t('Nothing on paper left on the desk at the end of the day: printouts, notebooks with customer names, sticky notes with passwords (there should be none).', 'Cuối ngày không để giấy tờ trên bàn: bản in, sổ ghi tên khách, giấy dán ghi mật khẩu (vốn không được có).')}</li>
<li>${t('Whiteboards: erase after the meeting. Photos of whiteboards are documents — they inherit the label of what is on them.', 'Bảng trắng: xoá sau buổi họp. Ảnh chụp bảng trắng là tài liệu — mang nhãn của nội dung trên bảng.')}</li>
<li>${t('Screen sharing: share one window, not the whole screen; turn on "do not disturb" so chat pop-ups from another project do not appear in the customer meeting.', 'Chia sẻ màn hình: chia sẻ một cửa sổ, không phải cả màn hình; bật "không làm phiền" để thông báo chat của dự án khác không hiện lên trong buổi họp với khách.')}</li>
<li>${t('Printers: collect immediately; a forgotten printout of a DD on a shared printer is a classic audit finding.', 'Máy in: lấy ngay; bản in DD bị bỏ quên ở máy in chung là phát hiện kiểm toán kinh điển.')}</li>
</ul>

<h3>${t('Hidden data in documents (run for real)', 'Dữ liệu ẩn trong tài liệu (chạy thật)')}</h3>
<p>${t(
    'A spreadsheet is a ZIP of XML files. "Hiding" a sheet only sets a flag; the content is still inside, together with the author\'s account name. We built an estimate for the customer with a hidden internal sheet, saved it as <code>.xlsx</code> with LibreOffice, then looked inside the way anyone who receives it could:',
    'Một bảng tính là một tệp ZIP chứa các tệp XML. "Ẩn" một sheet chỉ là bật một cờ; nội dung vẫn nằm bên trong, cùng tên tài khoản người tạo. Ta làm một bảng ước lượng gửi khách có một sheet nội bộ bị ẩn, lưu thành <code>.xlsx</code> bằng LibreOffice, rồi mở bên trong đúng như bất kỳ ai nhận tệp cũng làm được:')}</p>
${out(RA.excel)}
<p>${t(
    'The customer now knows your internal day rate, the margin and the hidden 40 % buffer — and the e-mail of the person who prepared it. Before sending any file outside: <strong>delete</strong> (not hide) internal sheets, rows and comments; run the inspector (Excel: <em>File → Info → Check for Issues → Inspect Document</em>; LibreOffice: <em>File → Properties</em> and <em>Tools → Options → Security → Remove personal information on saving</em>); or export only what is needed to PDF. Many projects require a second person to check outgoing files.',
    'Giờ khách biết đơn giá nội bộ, phần chênh và 40 % dự phòng bị giấu — cùng email người soạn. Trước khi gửi bất kỳ tệp nào ra ngoài: <strong>xoá</strong> (không phải ẩn) sheet, dòng và bình luận nội bộ; chạy công cụ soát (Excel: <em>File → Info → Check for Issues → Inspect Document</em>; LibreOffice: <em>File → Properties</em> và <em>Tools → Options → Security → Remove personal information on saving</em>); hoặc chỉ xuất phần cần gửi ra PDF. Nhiều dự án bắt người thứ hai kiểm tệp trước khi gửi đi.')}</p>
<p>${t(
    '<strong>A real case.</strong> In February 2003 the UK government published a briefing document on Iraq as a Word file. Researchers read its revision log — metadata nobody had removed — and found the names of the officials who had edited it — at the same time as a researcher showed that much of the text was copied from an academic article. The episode is remembered as the "dodgy dossier".',
    '<strong>Chuyện thật.</strong> Tháng 2/2003, chính phủ Anh công bố một tài liệu về Iraq dưới dạng tệp Word. Các nhà nghiên cứu đọc nhật ký sửa đổi — siêu dữ liệu không ai xoá — và thấy tên các quan chức đã chỉnh sửa — đúng lúc một nhà nghiên cứu chỉ ra phần lớn nội dung được chép từ một bài báo học thuật. Vụ này được nhớ tới với tên "dodgy dossier" (hồ sơ mờ ám).')}
${ng('https://en.wikipedia.org/wiki/Dodgy_Dossier', 'Wikipedia — Dodgy Dossier')}</p>

<h3>${t('Reporting: the one habit that matters most', 'Báo cáo: thói quen quan trọng nhất')}</h3>
<p>${t('An <em>event</em> is anything that might affect security; an <em>incident</em> is an event that actually did. You are not expected to tell them apart — you are expected to report events.', '<em>Sự kiện</em> là bất cứ điều gì có thể ảnh hưởng an ninh; <em>sự cố</em> là sự kiện đã thật sự gây ảnh hưởng. Không ai đòi bạn phân biệt hai cái — người ta đòi bạn báo sự kiện.')}</p>
${bang([t('Report immediately when…', 'Báo ngay khi…'), t('Do', 'Làm'), t('Do not', 'Đừng')], [
    [t('You sent a file or e-mail to the wrong person', 'Gửi nhầm tệp hay email cho người khác'), t('Tell your leader + the security channel; ask the recipient (through the leader) to delete', 'Báo leader + kênh an ninh; nhờ (qua leader) người nhận xoá'), t('Quietly send "please ignore" and hope', 'Âm thầm gửi "vui lòng bỏ qua" rồi cầu may')],
    [t('You clicked a link or opened an attachment and then had doubts', 'Lỡ bấm liên kết hay mở tệp đính kèm rồi thấy nghi'), t('Disconnect from the network if told to, report, note the time', 'Ngắt mạng nếu được hướng dẫn, báo cáo, ghi lại giờ'), t('Delete the e-mail (it is evidence), run random "cleaners"', 'Xoá email (đó là bằng chứng), chạy phần mềm "dọn dẹp" lung tung')],
    [t('Your badge, laptop or phone with work apps is missing', 'Mất thẻ, laptop hay điện thoại có ứng dụng công việc'), t('Report within minutes (lesson 10.4)', 'Báo trong vài phút (bài 10.4)'), t('Search for two days first', 'Tự đi tìm hai ngày rồi mới báo')],
    [t('You see a secret in a repo, log, chat or ticket', 'Thấy bí mật trong repo, log, chat hay ticket'), t('Report so it can be rotated (lesson 10.7)', 'Báo để thu hồi, đổi khoá (bài 10.7)'), t('Delete the message and consider it solved', 'Xoá tin nhắn rồi coi như xong')],
    [t('A stranger follows you through the secured door', 'Người lạ đi theo bạn qua cửa an ninh'), t('Politely ask them to badge in or call reception', 'Lịch sự đề nghị họ quẹt thẻ hoặc gọi lễ tân'), t('Hold the door "to be nice"', 'Giữ cửa "cho lịch sự"')],
  ])}
${cl('ok', t(
    'Security teams can only fix what they hear about. Fast reporting turns a disaster into a routine ticket: a key revoked within ten minutes is useless to an attacker. In mature companies people are disciplined for <em>hiding</em> incidents, not for reporting their own mistakes — check how your company phrases this in its policy.',
    'Đội an ninh chỉ sửa được thứ họ biết. Báo nhanh biến thảm hoạ thành một ticket bình thường: khoá bị thu hồi trong mười phút thì vô dụng với kẻ tấn công. Ở công ty trưởng thành, người ta bị kỷ luật vì <em>giấu</em> sự cố, không phải vì tự báo lỗi của mình — xem chính sách công ty bạn viết điều này thế nào.'))}

<h3>${t('Hacker\'s corner: tailgating and the helpful employee', 'Góc hacker: đi ké qua cửa và nhân viên tốt bụng')}</h3>
<p>${t(
    'Physical penetration testers report that the easiest way into an office is to carry two coffees or a big box and wait for someone to hold the door. Once inside, an unlocked screen, a printout or a USB port is enough. The defence is boring and personal: everyone badges in individually, visitors wear visitor badges and are escorted, and you are allowed — expected — to ask "who are you visiting?". Social engineering aimed at developers is lesson 10.6.',
    'Những người kiểm thử xâm nhập vật lý kể rằng cách dễ nhất để vào văn phòng là cầm hai ly cà phê hay một thùng hàng to rồi chờ ai đó giữ cửa. Vào được rồi thì một màn hình không khoá, một bản in hay một cổng USB là đủ. Cách phòng nhàm chán và rất cá nhân: ai cũng tự quẹt thẻ, khách đeo thẻ khách và có người đi kèm, và bạn được phép — được mong đợi — hỏi "anh/chị đến gặp ai ạ?". Lừa đảo nhắm vào lập trình viên ở bài 10.6.')}</p>

<h3>${t('Situation at work', 'Tình huống đi làm')}</h3>
<p>${t(
    'Friday 17:50. The customer asks for the latest estimate before the weekend. Your leader is gone; the file on the shared drive has a hidden "internal" sheet. What do you do? — Make a copy, delete the internal sheet (not hide), remove personal information, check the file once more as a ZIP or with the inspector, and ask another team member to look before sending. If nobody can check, send on Monday with a short message: "the estimate will be with you Monday 10:00 after internal review". A late file is a minor issue; a leaked margin is a commercial incident.',
    'Thứ sáu 17:50. Khách xin bản ước lượng mới nhất trước cuối tuần. Leader đã về; tệp trên ổ chung có một sheet "nội bộ" bị ẩn. Bạn làm gì? — Tạo bản sao, xoá sheet nội bộ (không phải ẩn), xoá thông tin cá nhân, kiểm lại tệp thêm một lần bằng cách mở ZIP hoặc dùng công cụ soát, nhờ một thành viên khác xem trước khi gửi. Không ai kiểm được thì gửi sáng thứ hai kèm lời nhắn: "bản ước lượng sẽ gửi anh lúc 10:00 thứ hai sau khi soát nội bộ". Tệp trễ là chuyện nhỏ; lộ phần chênh giá là sự cố thương mại.')}</p>

<h3>${t('Exercise: label it', 'Bài tập: gắn nhãn')}</h3>
<ol>
<li>${t('The customer\'s detailed design for the registration screen.', 'Thiết kế chi tiết màn hình đăng ký của khách.')}</li>
<li>${t('The company\'s public blog post about a tech talk.', 'Bài blog công khai của công ty về một buổi chia sẻ công nghệ.')}</li>
<li>${t('A CSV exported from the customer\'s production DB with patient names.', 'Tệp CSV xuất từ DB production của khách có tên bệnh nhân.')}</li>
<li>${t('Next week\'s internal training schedule.', 'Lịch đào tạo nội bộ tuần sau.')}</li>
<li>${t('A photo of the whiteboard after the design review.', 'Ảnh chụp bảng trắng sau buổi review thiết kế.')}</li>
</ol>
${giai(t('Answers', 'Đáp án'), `<ol>
<li>Confidential.</li>
<li>Public.</li>
<li>${t('Strictly confidential — and it should not be on a developer\'s machine at all without explicit approval (lesson 10.3).', 'Strictly confidential — và vốn không được nằm trên máy dev nếu chưa có phê duyệt rõ ràng (bài 10.3).')}</li>
<li>Internal.</li>
<li>${t('Same label as the design being reviewed — usually Confidential; store in the project folder, not your phone gallery.', 'Cùng nhãn với thiết kế được review — thường là Confidential; lưu vào thư mục dự án, không để trong thư viện ảnh điện thoại.')}</li>
</ol>`)}

${phongVan([
    [t('What is ISO 27001 and why does an outsourcing company care?', 'ISO 27001 là gì và vì sao công ty outsourcing quan tâm?'), t('The international standard for an information security management system; customers, especially in Japan and Europe, require certified vendors, and certification depends on every employee following the controls.', 'Tiêu chuẩn quốc tế cho hệ thống quản lý an ninh thông tin; khách, nhất là Nhật và châu Âu, đòi vendor có chứng nhận, và chứng nhận phụ thuộc vào việc mọi nhân viên tuân thủ các biện pháp.')],
    [t('Explain the CIA triad with an example.', 'Giải thích bộ ba CIA bằng ví dụ.'), t('Confidentiality (only authorised people read it), integrity (changes are authorised and traceable), availability (usable when needed) — e.g. a medical record.', 'Bảo mật (chỉ người được phép đọc), toàn vẹn (thay đổi có phép và truy vết được), sẵn sàng (dùng được khi cần) — ví dụ bệnh án.')],
    [t('You sent a confidential file to the wrong person. What do you do?', 'Bạn gửi nhầm một tệp mật. Làm gì?'), t('Report immediately to my leader and the security channel with what, to whom, when; follow instructions to request deletion; do not try to hide it.', 'Báo ngay leader và kênh an ninh: cái gì, cho ai, lúc nào; làm theo hướng dẫn để đề nghị xoá; không tìm cách giấu.')],
    [t('What hidden information can a document contain?', 'Một tài liệu có thể chứa thông tin ẩn nào?'), t('Hidden sheets/rows, comments, tracked changes, author and company names, file paths, previous versions — check with the document inspector before sending.', 'Sheet/dòng ẩn, bình luận, lịch sử sửa, tên tác giả và công ty, đường dẫn tệp, phiên bản cũ — kiểm bằng công cụ soát tài liệu trước khi gửi.')],
  ], en)}

${thuatNgu([
    ['ISMS', t('Information security management system', 'Hệ thống quản lý an ninh thông tin')],
    ['ISO/IEC 27001 / 27002', t('Requirements standard (certifiable) / guidance for each control', 'Tiêu chuẩn yêu cầu (cấp chứng nhận được) / hướng dẫn từng biện pháp')],
    ['Annex A', t('List of 93 controls in ISO 27001:2022', 'Danh sách 93 biện pháp kiểm soát trong ISO 27001:2022')],
    ['CIA triad', t('Confidentiality, integrity, availability', 'Bảo mật, toàn vẹn, sẵn sàng')],
    [t('Event / incident', 'Sự kiện / sự cố'), t('Something that might affect security / something that did', 'Điều có thể ảnh hưởng an ninh / điều đã gây ảnh hưởng')],
    ['Tailgating', t('Following an authorised person through a secured door', 'Đi theo người có quyền qua cửa an ninh')],
    [t('Metadata', 'Siêu dữ liệu (metadata)'), t('Data about a file: author, dates, revisions, hidden parts', 'Dữ liệu về tệp: tác giả, ngày, lần sửa, phần ẩn')],
  ], en)}

${tomTat([
    t('ISO 27001 certification is a promise kept by employees: classification, NDAs, training, reporting, clean desk.', 'Chứng nhận ISO 27001 là lời hứa do nhân viên giữ: phân loại, NDA, đào tạo, báo cáo, bàn sạch.'),
    t('Find the label; no label on a customer document ⇒ Confidential.', 'Tìm nhãn; tài liệu khách không có nhãn ⇒ Confidential.'),
    t('Lock the screen every time; share one window, not the screen.', 'Khoá màn hình mỗi lần đứng dậy; chia sẻ một cửa sổ, không phải cả màn hình.'),
    t('Hidden is not deleted: inspect files before they leave the company.', 'Ẩn không phải là xoá: soát tệp trước khi gửi ra ngoài.'),
    t('Report events fast through the official channel; never hide or self-clean.', 'Báo sự kiện nhanh qua kênh chính thức; không giấu, không tự dọn.'),
  ], en)}
<p>${t('Next', 'Tiếp theo')}: ${ag('agl-10-3-du-lieu-khach', t('10.3 — customer data and code', '10.3 — dữ liệu và mã của khách'))}.</p>
`);
};
