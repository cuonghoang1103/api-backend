/**
 * 10.1 — NDA và những gì được nói (agl-10-1-nda). Soạn 24/11/2026, agent agl.
 * Chạy thật: scratchpad/agl/lab/ch10/soat-portfolio.sh trên repo thử portfolio/ (output RA.portfolio).
 * Nguồn: ISO/IEC 27001:2022 Annex A 6.6. Vụ mã nguồn Twitter trên GitHub: TechCrunch 27/03/2023 (DMCA 24/03/2023, repo 'PublicSpace',
 * gần 3 tháng công khai) + thư mục github/dmca 2023/03.
 * ⛔ Không bịa điều khoản NDA của FPT Software: dạy thông lệ ngành + "đọc bản bạn ký".
 */
import { bang, cl, note, phongVan, thuatNgu, tomTat, giai, cs, ag, ng, vo, bash, out } from '../_chung.mjs';
import { MA, RA } from './_ma.mjs';

export const L101 = (en) => {
  const t = (a, b) => (en ? a : b);
  return vo(en, 'Chapter 10 · Information security at work', 'Chương 10 · An ninh thông tin khi đi làm', `
<h2>${t('10.1 — NDAs and what you may say: social media, CV, GitHub, interviews', '10.1 — NDA và những gì được nói: mạng xã hội, CV, GitHub, phỏng vấn')}</h2>
<p class="lead">${t(
    'On your first OJT morning you will sign a stack of papers before you see any code. One of them is a non-disclosure agreement (NDA), often together with an information-security pledge. Most interns sign without reading — and then, months later, post a photo of their desk, push "their" project to GitHub for the CV, or tell an interviewer the customer\'s name. This lesson explains what an NDA usually forbids, how long it lasts, and how to talk about your work everywhere without breaking it.',
    'Sáng đầu tiên đi OJT, bạn sẽ ký một xấp giấy trước khi thấy dòng code nào. Một trong số đó là thoả thuận bảo mật (NDA — non-disclosure agreement), thường đi kèm bản cam kết an ninh thông tin. Phần lớn thực tập sinh ký mà không đọc — rồi vài tháng sau đăng ảnh bàn làm việc, đẩy dự án "của mình" lên GitHub để làm CV, hay kể tên khách cho người phỏng vấn. Bài này giải thích NDA thường cấm gì, kéo dài bao lâu, và cách nói về công việc của mình ở mọi nơi mà không vi phạm.')}</p>

${cl('info', t(
    '<strong>Everyday picture.</strong> A doctor may tell friends "I operated on a heart today" but not "I operated on Mr. Hùng from apartment 12B". An NDA asks the same of you: talk about the <em>kind</em> of work and your skills, never about <em>whose</em> it is or what is inside it.',
    '<strong>Liên tưởng đời thường.</strong> Bác sĩ được kể với bạn bè "hôm nay mổ tim một ca", nhưng không được kể "mổ cho ông Hùng phòng 12B". NDA đòi bạn y như vậy: nói về <em>loại</em> việc và kỹ năng của mình, không bao giờ nói việc đó <em>của ai</em> hay bên trong có gì.'))}

<h3>${t('Two NDAs you will meet', 'Hai bản NDA bạn sẽ gặp')}</h3>
${bang([t('NDA', 'NDA'), t('Between', 'Giữa ai'), t('What it means for you', 'Nghĩa là gì với bạn')], [
    [t('Company ↔ customer', 'Công ty ↔ khách'), t('Your employer and the customer (often mutual, signed before the project)', 'Công ty bạn và khách (thường hai chiều, ký trước khi có dự án)'), t('You never see it, but you are bound by it through the next one. It may forbid even <strong>naming</strong> the customer — common with Japanese customers.', 'Bạn không thấy bản này, nhưng bị ràng buộc qua bản thứ hai. Nó có thể cấm cả việc <strong>nêu tên</strong> khách — hay gặp với khách Nhật.')],
    [t('Company ↔ you', 'Công ty ↔ bạn'), t('You, as an employee/intern (one-way: you protect the company\'s and its customers\' information)', 'Bạn, với tư cách nhân viên/thực tập sinh (một chiều: bạn bảo vệ thông tin của công ty và khách)'), t('This is what you sign on day one; often part of the labour contract or a separate pledge.', 'Đây là bản bạn ký ngày đầu; thường nằm trong hợp đồng lao động hoặc bản cam kết riêng.')],
  ])}
<p>${t('ISO/IEC 27001:2022, the standard most outsourcing companies are certified against (lesson 10.2), lists confidentiality agreements as control <strong>A 6.6</strong> — so an auditor will check that every person on a project has signed one.', 'ISO/IEC 27001:2022, tiêu chuẩn mà hầu hết công ty outsourcing được chứng nhận (bài 10.2), liệt kê thoả thuận bảo mật thành biện pháp kiểm soát <strong>A 6.6</strong> — nên kiểm toán viên sẽ kiểm mọi người trong dự án đã ký.')}</p>

<h3>${t('What is inside a typical NDA', 'Trong một bản NDA thường có gì')}</h3>
${bang([t('Clause', 'Điều khoản'), t('Typical content', 'Nội dung thường gặp'), t('Read carefully for', 'Đọc kỹ chỗ')], [
    [t('Definition of confidential information', 'Định nghĩa thông tin mật'), t('Source code, designs, documents, customer identity and data, prices, estimates, internal processes, anything marked Confidential — and often "anything you learn through your work"', 'Mã nguồn, thiết kế, tài liệu, danh tính và dữ liệu khách, giá, ước lượng, quy trình nội bộ, mọi thứ có nhãn Confidential — và thường cả "mọi thứ bạn biết được qua công việc"'), t('Broad definitions are normal; assume everything is covered unless it is clearly public', 'Định nghĩa rộng là bình thường; coi như mọi thứ đều thuộc diện mật trừ khi rõ ràng đã công khai')],
    [t('Obligations', 'Nghĩa vụ'), t('Do not disclose; use only for the job; protect with reasonable care; tell the company if a leak happens', 'Không tiết lộ; chỉ dùng cho công việc; bảo vệ cẩn thận hợp lý; báo công ty khi có rò rỉ'), t('"Use only for the job" also forbids reusing customer code in your side project', '"Chỉ dùng cho công việc" cũng cấm dùng lại mã của khách vào dự án riêng')],
    [t('Exceptions', 'Ngoại lệ'), t('Already public, already known before, independently developed, required by law', 'Đã công khai, đã biết từ trước, tự phát triển độc lập, pháp luật buộc cung cấp'), t('"Independently developed" must be provable — your own repo history helps', '"Tự phát triển độc lập" phải chứng minh được — lịch sử repo của chính bạn giúp việc này')],
    [t('Duration', 'Thời hạn'), t('Continues after you leave — commonly a number of years, sometimes indefinitely for trade secrets', 'Còn hiệu lực sau khi nghỉ việc — thường một số năm, có khi vô thời hạn với bí mật kinh doanh'), t('Ending the internship does <strong>not</strong> end the NDA', 'Hết thực tập <strong>không</strong> có nghĩa là hết NDA')],
    [t('Return / destroy', 'Trả lại / huỷ'), t('Hand back devices and delete copies when you leave', 'Trả thiết bị và xoá bản sao khi nghỉ'), t('Includes files in personal cloud drives, chat apps, phone photos', 'Gồm cả tệp trong ổ đám mây cá nhân, ứng dụng chat, ảnh trong điện thoại')],
    [t('Consequences', 'Hậu quả'), t('Disciplinary action, termination, compensation for damage', 'Kỷ luật, chấm dứt hợp đồng, bồi thường thiệt hại'), t('The customer can also claim against the company — which then turns to you', 'Khách còn có thể đòi công ty bồi thường — rồi công ty quay sang bạn')],
  ])}
${note(t('This is common industry practice, not the text of any particular company. Your contract is what binds you: read it, keep a copy, and ask HR or your leader about anything unclear <em>before</em> signing — asking is normal and nobody will think less of you.', 'Đây là thông lệ ngành, không phải văn bản của công ty cụ thể nào. Thứ ràng buộc bạn là bản bạn ký: đọc nó, giữ một bản, và hỏi HR hay leader chỗ chưa rõ <em>trước</em> khi ký — hỏi là chuyện bình thường, không ai đánh giá thấp bạn vì thế.'))}
<p>${t('The NDA inside a job offer, and what to check before accepting, is covered in ', 'NDA nằm trong thư mời nhận việc, và cần kiểm gì trước khi nhận, có ở ')}${cs('interview-prep', 'pv-9-3-offer', t('Interview prep 9.3', 'Chuẩn bị phỏng vấn 9.3'))}.</p>

<h3>${t('What you may say — place by place', 'Được nói gì — theo từng nơi')}</h3>
${bang([t('Place', 'Nơi'), t('OK', 'Được'), t('Not OK', 'Không được')], [
    [t('Facebook, TikTok, LinkedIn', 'Facebook, TikTok, LinkedIn'), t('"Started OJT as a backend intern at an outsourcing company, working with Spring Boot." A photo of the building lobby if the company allows it.', '"Bắt đầu OJT vị trí backend ở một công ty outsourcing, làm Spring Boot." Ảnh sảnh toà nhà nếu công ty cho phép.'), t('Photos of your screen, whiteboard, desk, badge; the customer\'s name or logo; "our Japanese bank customer is migrating its core system…"; complaints about a named customer.', 'Ảnh màn hình, bảng trắng, bàn làm việc, thẻ nhân viên; tên hay logo khách; "khách ngân hàng Nhật bên mình đang chuyển hệ thống lõi…"; than phiền về một khách có tên.')],
    [t('CV', 'CV'), t('Domain, scale, your role, technologies, measurable results', 'Lĩnh vực, quy mô, vai trò của bạn, công nghệ, kết quả đo được'), t('Customer name (unless public and permitted), internal project code names, screenshots, real numbers the customer considers confidential', 'Tên khách (trừ khi đã công khai và được phép), tên mã dự án nội bộ, ảnh chụp màn hình, số liệu thật mà khách coi là mật')],
    [t('GitHub / portfolio', 'GitHub / portfolio'), t('Your own code written in your own time, reproducing a <em>general idea</em> with your own design and fake data', 'Mã của chính bạn, viết ngoài giờ, tái hiện một <em>ý tưởng chung</em> bằng thiết kế riêng và dữ liệu giả'), t('Any file copied from the company repo, documents, test data, configuration, commit history from work', 'Bất kỳ tệp nào chép từ repo công ty, tài liệu, dữ liệu test, cấu hình, lịch sử commit từ chỗ làm')],
    [t('Interviews', 'Phỏng vấn'), t('STAR stories about the problem type and what you did; "I can\'t name the customer under NDA"', 'Câu chuyện STAR về loại vấn đề và việc bạn làm; "Tôi không nêu được tên khách vì NDA"'), t('Showing code or documents on your laptop "just to explain"', 'Mở mã hay tài liệu trên laptop "chỉ để giải thích"')],
    [t('Friends, family, classmates', 'Bạn bè, gia đình, bạn cùng lớp'), t('"I\'m building a booking system for clinics."', '"Mình đang làm hệ thống đặt lịch cho phòng khám."'), t('Asking a classmate for help by sending them the customer\'s code', 'Nhờ bạn cùng lớp giúp bằng cách gửi mã của khách')],
  ])}

<h3>${t('Writing it on your CV without leaking', 'Ghi vào CV mà không làm lộ')}</h3>
${bang([t('Leaks', 'Làm lộ'), t('Safe and still impressive', 'An toàn mà vẫn ấn tượng')], [
    [t('"Sakura Clinic Booking System (Sakura Medical Group, Osaka) — project SKR-2026"', '"Hệ thống đặt lịch Sakura Clinic (Sakura Medical Group, Osaka) — dự án SKR-2026"'), t('"Appointment booking system for a Japanese clinic chain (≈ 50 screens, offshore team of 8)"', '"Hệ thống đặt lịch khám cho một chuỗi phòng khám Nhật (≈ 50 màn hình, đội offshore 8 người)"')],
    [t('"Fixed the bug where patient phone numbers in table PATIENT_MST were saved wrong"', '"Sửa lỗi số điện thoại bệnh nhân trong bảng PATIENT_MST lưu sai"'), t('"Implemented 3 registration screens from Japanese detailed design; wrote 120 UT cases; 0 defects found in IT"', '"Làm 3 màn hình đăng ký theo thiết kế chi tiết tiếng Nhật; viết 120 UT case; 0 lỗi bị phát hiện ở IT"')],
    [t('Screenshot of the real UI', 'Ảnh giao diện thật'), t('A link to <em>your own</em> demo project that shows the same skill with fake data', 'Liên kết tới dự án demo <em>của chính bạn</em> thể hiện cùng kỹ năng với dữ liệu giả')],
  ])}
<p>${t('How to describe projects on a CV in general: ', 'Cách mô tả dự án trên CV nói chung: ')}${cs('interview-prep', 'pv-1-2-du-an-cv', t('Interview prep 1.2', 'Chuẩn bị phỏng vấn 1.2'))}.</p>

<h3>${t('GitHub: the most common way interns break an NDA', 'GitHub: cách thực tập sinh vi phạm NDA phổ biến nhất')}</h3>
<p>${t(
    'It rarely looks like theft. It looks like "I worked hard on this module, I want it in my portfolio", or "I\'ll push to my private repo so I can continue at home". A private repo on your personal account is still outside the company\'s control — it can be made public by mistake, your account can be taken over (lesson 10.5), and the company cannot delete it when you leave. Lesson 10.7 shows how a contractor\'s repo exposed Toyota customer data for almost five years.',
    'Nó hiếm khi trông như ăn cắp. Nó trông như "mình làm module này vất vả, muốn đưa vào portfolio", hay "đẩy lên repo private của mình để về nhà làm tiếp". Repo private trên tài khoản cá nhân vẫn nằm ngoài tầm kiểm soát của công ty — có thể lỡ tay chuyển sang công khai, tài khoản có thể bị chiếm (bài 10.5), và công ty không xoá được khi bạn nghỉ. Bài 10.7 kể chuyện repo của một nhà thầu làm lộ dữ liệu khách của Toyota gần năm năm.')}</p>
<p>${t('Before you make any personal repo public, scan it — not only the current files, but the <strong>whole history</strong> and the author e-mails. The small script below did this on a test portfolio repo:', 'Trước khi chuyển bất kỳ repo cá nhân nào sang công khai, hãy soát nó — không chỉ tệp hiện tại mà cả <strong>toàn bộ lịch sử</strong> và email tác giả. Đoạn script nhỏ dưới đây đã làm việc đó trên một repo portfolio thử:')}</p>
${bash(MA.soatPortfolio)}
${out(RA.portfolio)}
<p>${t(
    'Three findings: the customer\'s name, an internal IP address, and one commit made with the <em>company</em> e-mail (your git identity on the work laptop leaked into a personal repo). Fixing the README is not enough — the old text stays in history; rewrite or recreate the repo (',
    'Ba phát hiện: tên khách, một địa chỉ IP nội bộ, và một commit dùng email <em>công ty</em> (danh tính git trên laptop công ty lọt vào repo cá nhân). Sửa README chưa đủ — chữ cũ vẫn nằm trong lịch sử; phải viết lại lịch sử hoặc tạo lại repo (')}${cs('git', 'git-8-3-go-bi-mat', 'Git 8.3')}${t('). Keeping two git identities apart on one machine: ', '). Tách hai danh tính git trên cùng một máy: ')}${cs('git', 'git-14-3-cau-hinh', 'Git 14.3 (includeIf)')}.</p>
${cl('warn', t('Rewriting an idea from scratch is not automatically safe. If the customer\'s business rules, screen layout or data model are recognisable, it can still breach the NDA. When in doubt, ask your leader — in writing — before publishing.', 'Tự viết lại một ý tưởng từ đầu không tự động an toàn. Nếu quy tắc nghiệp vụ, bố cục màn hình hay mô hình dữ liệu của khách vẫn nhận ra được, vẫn có thể vi phạm NDA. Còn phân vân thì hỏi leader — bằng văn bản — trước khi công khai.'))}

<h3>${t('In the interview room', 'Trong phòng phỏng vấn')}</h3>
<p>${t(
    'Interviewers at outsourcing companies sign NDAs too; they <em>expect</em> you to protect your previous customers and they test it. A candidate who names last year\'s customer and opens its code on a laptop has just shown what they will do with the next customer\'s code. Say instead:',
    'Người phỏng vấn ở công ty outsourcing cũng ký NDA; họ <em>mong</em> bạn giữ bí mật cho khách cũ và còn thử điều đó. Ứng viên kể tên khách năm ngoái và mở code của khách trên laptop vừa cho thấy mình sẽ làm gì với code của khách tiếp theo. Hãy nói:')}</p>
${out(t(
    '"I can\'t name the customer because of an NDA, but it was a booking system for a Japanese clinic chain.\nThe problem was… what I did was… the result was…"',
    '"Em không nêu được tên khách vì NDA, nhưng đó là hệ thống đặt lịch cho một chuỗi phòng khám Nhật.\nVấn đề là… em đã… kết quả là…"'))}

<h3>${t('Hacker\'s corner: your posts are someone\'s reconnaissance', 'Góc hacker: bài đăng của bạn là tài liệu trinh sát của kẻ khác')}</h3>
<p>${t(
    'Before a targeted attack, attackers collect open-source intelligence (OSINT): LinkedIn job titles, "first day at…" photos, tech stacks in CVs, conference badges. "Backend intern on a Japanese insurance project, Spring Boot 2.7, Jenkins" tells an attacker which customer to impersonate in an e-mail (lesson 10.6) and which old library versions may be unpatched. A photo of a monitor can be zoomed until the code, a ticket number or a password on a sticky note is readable.',
    'Trước một cuộc tấn công có chủ đích, kẻ tấn công thu thập thông tin công khai (OSINT): chức danh LinkedIn, ảnh "ngày đầu đi làm ở…", công nghệ ghi trong CV, thẻ đeo hội thảo. "Thực tập backend dự án bảo hiểm Nhật, Spring Boot 2.7, Jenkins" cho kẻ tấn công biết nên giả danh khách nào trong email (bài 10.6) và phiên bản thư viện cũ nào có thể chưa vá. Ảnh chụp màn hình máy tính phóng to được tới mức đọc ra code, số ticket hay mật khẩu trên giấy dán.')}</p>
<p>${t(
    '<strong>A real case of code walking out.</strong> In March 2023 Twitter asked GitHub, through a DMCA takedown notice, to remove a repository containing parts of its source code; according to the notice (public in GitHub\'s DMCA repository) and press reports citing The New York Times, parts of the code had been public for nearly three months, and the company went to court to identify the poster. It does not matter whether the person was angry or careless: once code is on a public site, it is copied within hours and cannot be pulled back.',
    '<strong>Chuyện thật: mã nguồn "đi ra ngoài".</strong> Tháng 3/2023, Twitter gửi GitHub thông báo gỡ bỏ theo DMCA để xoá một repo chứa một phần mã nguồn của họ; theo chính bản thông báo (công khai trong repo DMCA của GitHub) và báo chí dẫn lại The New York Times, một phần mã đã công khai gần ba tháng, và công ty phải nhờ toà án để tìm người đăng. Người đăng tức giận hay bất cẩn thì kết quả cũng như nhau: mã đã lên trang công khai thì vài giờ sau đã bị sao chép, không lấy lại được.')}
${ng('https://techcrunch.com/2023/03/27/github-takes-down-repository-containing-twitters-source-code/', 'TechCrunch, 27/03/2023')} · ${ng('https://github.com/github/dmca/tree/master/2023/03', 'github/dmca 2023/03')}</p>

<h3>${t('Situation at work', 'Tình huống đi làm')}</h3>
<p>${t(
    'Week 3 of OJT. Your classmate, interning elsewhere, is stuck on Spring Security and asks: "send me your project\'s config, I just want to see how you did it". What do you do? — You do not send it. You can explain the idea in your own words, or point to the public documentation/course you learned from (',
    'Tuần thứ 3 OJT. Bạn cùng lớp thực tập ở chỗ khác đang vướng Spring Security và nhắn: "gửi tớ cái config dự án cậu, tớ chỉ xem cậu làm thế nào thôi". Bạn làm gì? — Không gửi. Bạn có thể giải thích ý tưởng bằng lời của mình, hoặc chỉ tài liệu công khai/khoá học bạn đã học (')}${cs('spring-boot', 'sb-0-8-bat-dau-tai-day', t('Spring Boot course', 'khoá Spring Boot'))}${t('). The config file belongs to the customer, even if you typed it.', '). Tệp cấu hình là của khách, dù chính bạn gõ.')}</p>

<h3>${t('Exercise: OK to post?', 'Bài tập: đăng được không?')}</h3>
<ol>
<li>${t('A selfie at your desk; the second monitor shows the IDE.', 'Ảnh tự sướng ở bàn làm việc; màn hình thứ hai đang mở IDE.')}</li>
<li>${t('LinkedIn: "Completed OJT as a Java developer. Learned V-model, UT with JUnit, and writing test specs in Excel."', 'LinkedIn: "Hoàn thành OJT vị trí Java developer. Học được V-model, UT với JUnit, viết test spec bằng Excel."')}</li>
<li>${t('A blog post explaining a tricky NFC/NFD bug, with your own minimal example code.', 'Bài blog giải thích một lỗi NFC/NFD khó, kèm đoạn code ví dụ tối giản tự viết.')}</li>
<li>${t('The same blog post, with the customer\'s stack trace pasted in.', 'Cùng bài blog đó, nhưng dán nguyên stack trace của hệ thống khách.')}</li>
<li>${t('Your CV: "Worked on Toyota\'s connected-car platform" (the customer is not public).', 'CV: "Làm nền tảng xe kết nối của Toyota" (khách chưa công khai).')}</li>
</ol>
${giai(t('Answers', 'Đáp án'), `<ol>
<li>${t('No — the screen content leaks; and many offices forbid photos at desks at all.', 'Không — nội dung màn hình bị lộ; nhiều văn phòng cấm chụp ảnh ở khu làm việc.')}</li>
<li>${t('Yes — skills and methods, no customer.', 'Được — kỹ năng và phương pháp, không có khách.')}</li>
<li>${t('Usually yes if the example is truly generic; ask your leader if the bug is recognisably the customer\'s.', 'Thường được nếu ví dụ thật sự chung chung; hỏi leader nếu lỗi nhận ra được là của khách.')}</li>
<li>${t('No — stack traces contain package names, class names, server paths and sometimes data.', 'Không — stack trace chứa tên package, tên lớp, đường dẫn máy chủ và có khi cả dữ liệu.')}</li>
<li>${t('No — rewrite as "a Japanese automotive company\'s connected-car platform".', 'Không — viết lại thành "nền tảng xe kết nối của một hãng ô tô Nhật".')}</li>
</ol>`)}

${phongVan([
    [t('Tell me about your OJT project.', 'Kể về dự án OJT của bạn.'), t('Domain and scale without the customer\'s name ("a Japanese clinic chain, ~50 screens"), my role, technologies, one concrete result — and if asked for the name, "I can\'t share it under NDA".', 'Lĩnh vực và quy mô mà không nêu tên khách ("một chuỗi phòng khám Nhật, ~50 màn hình"), vai trò, công nghệ, một kết quả cụ thể — nếu được hỏi tên thì "em không chia sẻ được vì NDA".')],
    [t('Can you show us some code you wrote at your internship?', 'Cho xem code bạn viết lúc thực tập được không?'), t('No — it belongs to the customer. I can show my personal project that uses the same techniques, or write an example now.', 'Không — code đó là của khách. Em có thể cho xem dự án cá nhân dùng cùng kỹ thuật, hoặc viết ví dụ ngay bây giờ.')],
    [t('Does an NDA end when you leave the company?', 'NDA có hết hiệu lực khi nghỉ việc không?'), t('Usually not — confidentiality obligations normally survive termination for a period stated in the contract, sometimes indefinitely for trade secrets.', 'Thường là không — nghĩa vụ bảo mật thường còn sau khi chấm dứt hợp đồng trong thời hạn ghi trong hợp đồng, có khi vô thời hạn với bí mật kinh doanh.')],
    [t('A friend asks for your project config to learn from it. What do you say?', 'Bạn bè xin cấu hình dự án để học. Bạn trả lời sao?'), t('I explain the idea and point to public documentation; I never send customer files.', 'Em giải thích ý tưởng và chỉ tài liệu công khai; không bao giờ gửi tệp của khách.')],
  ], en)}

${thuatNgu([
    ['NDA', t('Non-disclosure agreement — contract to keep information confidential', 'Thoả thuận không tiết lộ — hợp đồng giữ bí mật thông tin')],
    [t('Mutual / one-way NDA', 'NDA hai chiều / một chiều'), t('Both sides protect each other\'s information / only one side does', 'Cả hai bên bảo vệ thông tin của nhau / chỉ một bên')],
    [t('Survival clause', 'Điều khoản còn hiệu lực'), t('Obligations that continue after the contract ends', 'Nghĩa vụ vẫn tiếp tục sau khi hợp đồng kết thúc')],
    ['OSINT', t('Open-source intelligence — information gathered from public sources', 'Thu thập thông tin từ nguồn công khai')],
    ['DMCA takedown', t('US legal notice asking a platform to remove copyrighted content', 'Thông báo pháp lý (Mỹ) yêu cầu nền tảng gỡ nội dung vi phạm bản quyền')],
  ], en)}

${tomTat([
    t('You are bound by your own NDA and, through it, by the company–customer NDA you never see.', 'Bạn bị ràng buộc bởi NDA của mình và, qua đó, bởi NDA công ty–khách mà bạn không bao giờ thấy.'),
    t('Talk about the kind of work and your skills; never whose work it is or what is inside.', 'Nói về loại việc và kỹ năng; không bao giờ nói việc của ai hay bên trong có gì.'),
    t('No company file ever goes to a personal repo, drive or chat — private repos included.', 'Không tệp nào của công ty đi vào repo, ổ đám mây hay chat cá nhân — kể cả repo private.'),
    t('Scan the whole history and author e-mails before making a personal repo public.', 'Soát toàn bộ lịch sử và email tác giả trước khi công khai repo cá nhân.'),
    t('The NDA outlives the internship.', 'NDA sống lâu hơn kỳ thực tập.'),
  ], en)}
<p>${t('Next', 'Tiếp theo')}: ${ag('agl-10-2-isms', t('10.2 — ISMS and ISO 27001 for employees', '10.2 — ISMS và ISO 27001 cho nhân viên'))}.</p>
`);
};
