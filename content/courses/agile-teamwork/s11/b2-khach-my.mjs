/**
 * 11.2 — Khách Mỹ và châu Âu (agl-11-2-khach-my). Soạn 24/11/2026, agent agl.
 * Nguồn: Amazon Leadership Principles ("Have Backbone; Disagree and Commit"); GitLab Handbook (giao tiếp bất đồng bộ);
 * Erin Meyer "The Culture Map" (thang Evaluating: upgrader/downgrader — chỉ tóm tắt, chi tiết ở IBC201 2.1);
 * FBI IC3 Internet Crime Report 2024 (BEC: 21.442 khiếu nại, 2,77 tỷ USD; công bố 23/04/2025).
 * Bài không có mã chạy — phần làm được nằm ở mẫu email đề xuất, bảng phương án và bài tập viết lại.
 * ⛔ Không quy chụp: "xu hướng thường gặp", luôn hỏi PM/account manager về khách cụ thể.
 */
import { bang, cl, note, phongVan, thuatNgu, tomTat, giai, cs, ac, ag, ng, vo, out } from '../_chung.mjs';

export const L112 = (en) => {
  const t = (a, b) => (en ? a : b);
  return vo(en, 'Chapter 11 · Working with Japanese and American clients', 'Chương 11 · Làm việc với khách Nhật và khách Mỹ', `
<h2>${t('11.2 — American and European clients: directness, proactive proposals, reasoned pushback', '11.2 — Khách Mỹ và châu Âu: thẳng thắn, chủ động đề xuất, phản biện có lý lẽ')}</h2>
<p class="lead">${t(
    'Three weeks into a project for a US start-up, the product manager writes in Slack: "The search is slow and the filters are confusing. Thoughts?" A Vietnamese junior answers "Yes, I will fix it" and starts coding. The PM is disappointed — not because the fix is wrong, but because they asked for <em>thoughts</em>: options, trade-offs, a recommendation. With many American and Western European customers, doing exactly what you are told is the minimum; what they pay for is your judgement. This lesson shows how to give it without sounding rude — and without forgetting that the customer still decides.',
    'Ba tuần vào dự án cho một start-up Mỹ, product manager nhắn Slack: "Tìm kiếm chậm và bộ lọc khó hiểu. Thoughts?" Một junior Việt trả lời "Vâng, em sẽ sửa" rồi bắt đầu code. PM thất vọng — không phải vì cách sửa sai, mà vì họ hỏi <em>ý kiến</em>: các phương án, đánh đổi, một đề xuất. Với nhiều khách Mỹ và Tây Âu, làm đúng y lời được bảo chỉ là mức tối thiểu; thứ họ trả tiền là khả năng phán đoán của bạn. Bài này chỉ cách đưa ra phán đoán đó mà không thành thô lỗ — và không quên rằng người quyết vẫn là khách.')}</p>

${cl('info', t(
    '<strong>Everyday picture.</strong> You hire a mechanic and say "change the brake pads". A good mechanic does it — and also says "your tyres are worn, here are two options and prices, I recommend the cheaper one". A bad one stays silent, or changes the tyres without asking. Be the good mechanic: <em>propose</em>, never <em>impose</em>.',
    '<strong>Liên tưởng đời thường.</strong> Bạn thuê thợ sửa xe và bảo "thay má phanh". Thợ giỏi làm việc đó — và nói thêm "lốp mòn rồi, có hai phương án, giá thế này, tôi khuyên cái rẻ hơn". Thợ tệ thì im lặng, hoặc tự thay lốp không hỏi. Hãy là người thợ giỏi: <em>đề xuất</em>, không <em>áp đặt</em>.'))}

${note(t(
    '"American" and "European" are huge groups: a German bank, a Dutch scale-up and a Texas insurance company behave very differently. The tables are tendencies drawn from Erin Meyer\'s <em>The Culture Map</em> and common outsourcing experience; your account manager knows <em>your</em> customer.',
    '"Mỹ" và "châu Âu" là những nhóm rất lớn: một ngân hàng Đức, một start-up Hà Lan và một công ty bảo hiểm ở Texas cư xử rất khác nhau. Các bảng là xu hướng rút từ sách <em>The Culture Map</em> của Erin Meyer và kinh nghiệm outsourcing phổ biến; account manager mới biết khách <em>của bạn</em>.'))}

<h3>${t('Side by side', 'Đặt cạnh nhau')}</h3>
${bang([t('Topic', 'Chủ đề'), t('Japanese customer (tendency)', 'Khách Nhật (xu hướng)'), t('US customer (tendency)', 'Khách Mỹ (xu hướng)'), t('What it means for you', 'Nghĩa là gì với bạn')], [
    [t('Saying no', 'Nói "không"'), t('Indirect ("we will consider it")', 'Gián tiếp ("sẽ xem xét")'), t('Direct ("No, let\'s not do that")', 'Trực tiếp ("Không, đừng làm thế")'), t('With US customers a "no" is not an insult — do not take it personally', 'Với khách Mỹ, một chữ "không" không phải xúc phạm — đừng để bụng')],
    [t('Questions', 'Đặt câu hỏi'), t('Formal, batched in the Q&amp;A list', 'Trang trọng, gom vào Q&amp;A list'), t('Quick, in Slack/Teams threads, any time', 'Nhanh, trong thread Slack/Teams, bất cứ lúc nào'), t('Still keep a record of decisions (lesson 11.3) — chat scrolls away', 'Vẫn phải ghi lại quyết định (bài 11.3) — chat trôi mất')],
    [t('Documents', 'Tài liệu'), t('Detailed BD/DD, Excel test specs', 'BD/DD chi tiết, test spec Excel'), t('User stories, tickets, short design docs, working software', 'User story, ticket, tài liệu thiết kế ngắn, phần mềm chạy được'), t('Less paper, more demos — the demo is the progress report', 'Ít giấy hơn, nhiều demo hơn — demo chính là báo cáo tiến độ')],
    [t('Initiative', 'Chủ động'), t('Welcome after asking; changing the spec on your own is a defect', 'Được hoan nghênh khi đã hỏi; tự đổi spec là lỗi'), t('Expected: "what would you suggest?"', 'Được mong đợi: "bạn đề xuất gì?"'), t('Propose with options; still never implement a change before they agree', 'Đề xuất kèm phương án; vẫn không bao giờ làm thay đổi trước khi họ đồng ý')],
    [t('Hierarchy', 'Thứ bậc'), t('Talk through the BrSE/PM', 'Nói qua BrSE/PM'), t('First names; the PM may message you directly', 'Gọi tên riêng; PM có thể nhắn thẳng cho bạn'), t('Answer, but copy your PM when it touches scope, dates or money', 'Trả lời, nhưng đưa PM vào khi dính tới phạm vi, ngày hay tiền')],
    [t('Silence in a meeting', 'Im lặng trong họp'), t('Acceptable, often respectful', 'Chấp nhận được, thường là tôn trọng'), t('Read as "no opinion" or "not engaged"', 'Bị hiểu là "không có ý kiến" hoặc "không quan tâm"'), t('Prepare one question or one observation for every meeting', 'Chuẩn bị sẵn một câu hỏi hoặc một nhận xét cho mỗi buổi họp')],
  ])}
<p>${t('The theory behind this table — Meyer\'s eight scales, Hofstede\'s dimensions — is in ', 'Lý thuyết phía sau bảng này — tám thang đo của Meyer, các chiều văn hoá của Hofstede — có ở ')}${ac('ibc201-cross-cultural-management-and-negotiation', 'ibc201-2-1-communication-meyer', 'IBC201 2.1')}${t(' and ', ' và ')}${ac('ibc201-cross-cultural-management-and-negotiation', 'ibc201-1-2-hofstede-trompenaars', 'IBC201 1.2')}.</p>

<h3>${t('Europe is not one country: reading feedback', 'Châu Âu không phải một nước: đọc lời nhận xét')}</h3>
<p>${t(
    'Meyer describes "upgraders" who soften criticism with words like <em>slightly</em> and "downgraders" who strengthen it with <em>totally</em>, <em>absolutely</em>. Americans tend to wrap criticism in praise; Dutch and German colleagues often give negative feedback bluntly and in front of others; British colleagues tend to understate. The same sentence can mean opposite things:',
    'Meyer mô tả người "nói giảm" làm nhẹ lời chê bằng các từ như <em>slightly</em> (hơi) và người "nói tăng" làm mạnh nó bằng <em>totally</em>, <em>absolutely</em>. Người Mỹ thường gói lời chê trong lời khen; đồng nghiệp Hà Lan, Đức hay góp ý tiêu cực rất thẳng và ngay trước người khác; đồng nghiệp Anh thì hay nói giảm. Cùng một câu có thể mang nghĩa ngược nhau:')}</p>
${bang([t('Heard', 'Nghe thấy'), t('From', 'Từ ai'), t('Often means', 'Thường có nghĩa là')], [
    [t('"Great work! Just a few small things to consider…"', '"Great work! Just a few small things to consider…"'), t('American PM', 'PM Mỹ'), t('The few small things are the real message — fix them first', 'Mấy "điều nhỏ" mới là thông điệp chính — sửa chúng trước')],
    [t('"This is wrong. The API returns 200 on error."', '"This is wrong. The API returns 200 on error."'), t('Dutch / German tech lead', 'Tech lead Hà Lan / Đức'), t('A factual comment on the code, not on you — reply with the fix, no apology speech needed', 'Một nhận xét về mã, không phải về bạn — trả lời bằng bản sửa, không cần một bài xin lỗi')],
    [t('"Quite good, with the greatest respect, perhaps one could reconsider…"', '"Quite good, with the greatest respect, perhaps one could reconsider…"'), t('British stakeholder', 'Người liên quan người Anh'), t('Probably "this is not good enough, please change it"', 'Nhiều khả năng là "chưa đạt, hãy sửa"')],
  ])}

<h3>${t('Proactive proposals: options, trade-offs, a recommendation', 'Đề xuất chủ động: phương án, đánh đổi, một khuyến nghị')}</h3>
<p>${t(
    'When a Western customer asks "thoughts?", the strongest answer has a fixed shape. Put the bottom line first (BLUF — <em>bottom line up front</em>, a habit from US military writing that spread to business): the recommendation, then the options, then the details. Never more than three options; always the cost in days and the risk.',
    'Khi khách phương Tây hỏi "thoughts?", câu trả lời mạnh nhất có một khuôn cố định. Đặt kết luận lên đầu (BLUF — <em>bottom line up front</em>, thói quen từ văn phong quân đội Mỹ lan sang doanh nghiệp): khuyến nghị trước, rồi các phương án, rồi chi tiết. Không quá ba phương án; luôn có chi phí tính bằng ngày và rủi ro.')}</p>
${out(t(
    'Subject: Search speed — recommendation: option B (2 days)\n\nTL;DR: I recommend B: add a database index and debounce the filter input.\nIt fixes most of the slowness for 2 days of work. Your decision needed by Thu.\n\nMeasured today on staging: search 1.8 s at p95 with 50,000 bookings.\n\n| Option | What | Effort | Expected | Risk |\n| A | Debounce input only | 0.5 d | fewer requests, each still slow | low |\n| B | A + index on (clinic_id, date) | 2 d | p95 ≈ 0.2 s (tested on a copy) | migration on prod |\n| C | Move search to Elasticsearch | 8–10 d | fastest, fuzzy search | new infra, ops cost |\n\nNot included: redesigning the filter UI — I suggest a separate ticket.\nI will not start any option until you choose.',
    'Tiêu đề: Tốc độ tìm kiếm — khuyến nghị: phương án B (2 ngày)\n\nTóm tắt: Em khuyến nghị B: thêm chỉ mục database và debounce ô lọc.\nGiải quyết phần lớn độ chậm với 2 ngày công. Cần anh/chị quyết trước thứ Năm.\n\nĐo hôm nay trên staging: tìm kiếm 1,8 s ở p95 với 50.000 lịch hẹn.\n\n| Phương án | Làm gì | Công | Kỳ vọng | Rủi ro |\n| A | Chỉ debounce ô nhập | 0,5 ngày | ít request hơn, mỗi request vẫn chậm | thấp |\n| B | A + chỉ mục (clinic_id, date) | 2 ngày | p95 ≈ 0,2 s (đã thử trên bản sao) | migration trên prod |\n| C | Chuyển tìm kiếm sang Elasticsearch | 8–10 ngày | nhanh nhất, tìm gần đúng | hạ tầng mới, chi phí vận hành |\n\nChưa gồm: thiết kế lại giao diện bộ lọc — đề xuất tách ticket riêng.\nEm chưa bắt đầu phương án nào cho tới khi anh/chị chọn.'))}
${note(t(
    'The numbers in this template are placeholders for <em>your</em> measurements — measuring an index properly is taught in ',
    'Các con số trong mẫu này là chỗ để điền số <em>bạn tự đo</em> — cách đo một chỉ mục đúng được dạy ở ') + cs('postgresql', 'postgresql-10-1-doc-explain', t('PostgreSQL 10.1 — EXPLAIN', 'PostgreSQL 10.1 — EXPLAIN')) + t('. A proposal with an invented number is worse than one with no number.', '. Một đề xuất có con số bịa còn tệ hơn đề xuất không có số.'))}
${cl('tip', t(
    'Notice the last two lines: "Not included" stops scope creep before it starts, and "I will not start until you choose" makes clear the decision is theirs. Proactive does not mean acting alone.',
    'Để ý hai dòng cuối: "Chưa gồm" chặn phạm vi phình to từ trong trứng, và "chưa bắt đầu cho tới khi anh/chị chọn" nói rõ quyền quyết là của họ. Chủ động không có nghĩa là tự làm một mình.'))}

<h3>${t('Pushback with reasons — and then commit', 'Phản biện có lý lẽ — rồi cam kết')}</h3>
<p>${t(
    'Amazon\'s leadership principles include "Have Backbone; Disagree and Commit": challenge a decision you disagree with, respectfully, even when it is uncomfortable — and once it is decided, commit to it fully (',
    'Bộ nguyên tắc lãnh đạo của Amazon có câu "Have Backbone; Disagree and Commit": phản biện quyết định mà bạn không đồng ý, một cách tôn trọng, kể cả khi khó nói — và khi đã quyết thì dốc toàn lực làm (')}${ng('https://www.amazon.jobs/content/en/our-workplace/leadership-principles', 'amazon.jobs')}${t('). Many US teams work this way. A good pushback has four parts:', '). Nhiều đội Mỹ làm việc theo cách này. Một lời phản biện tốt có bốn phần:')}</p>
${bang([t('Part', 'Phần'), t('Example', 'Ví dụ')], [
    [t('1. Show you understood the goal', '1. Cho thấy bạn hiểu mục tiêu'), t('"I understand we want users to see the confirmation instantly."', '"Em hiểu mục tiêu là người dùng thấy xác nhận ngay lập tức."')],
    [t('2. The concern, with evidence', '2. Mối lo, kèm bằng chứng'), t('"Sending the e-mail inside the request adds ~1.2 s and fails the booking when the mail server is down — I reproduced it on staging."', '"Gửi email ngay trong request làm chậm thêm ~1,2 s và làm hỏng việc đặt lịch khi máy chủ mail sập — em đã tái hiện trên staging."')],
    [t('3. An alternative', '3. Một phương án khác'), t('"We could show the confirmation on screen and send the e-mail from a queue within a minute."', '"Mình có thể hiện xác nhận trên màn hình và gửi email từ hàng đợi trong vòng một phút."')],
    [t('4. Hand back the decision', '4. Trả lại quyền quyết'), t('"If you still prefer the synchronous e-mail, I\'ll implement it and add a timeout."', '"Nếu anh/chị vẫn muốn gửi email đồng bộ, em sẽ làm và thêm timeout."')],
  ])}
<p>${t('Then, if they decide against you: build it well, and do not say "I told you so" later. Your reasoning is on record in the thread — that is enough.', 'Rồi nếu họ quyết khác ý bạn: làm cho tốt, và sau này đừng nói "em đã bảo rồi". Lý lẽ của bạn đã nằm trong thread — thế là đủ.')}</p>

<h3>${t('Async by default', 'Mặc định là bất đồng bộ')}</h3>
<p>${t(
    'Teams spread across time zones rely on written, asynchronous communication; GitLab\'s public handbook is a well-known description of this way of working (',
    'Các đội trải khắp nhiều múi giờ sống nhờ giao tiếp viết, bất đồng bộ; sổ tay công khai của GitLab là bản mô tả nổi tiếng về cách làm này (')}${ng('https://handbook.gitlab.com/handbook/company/culture/all-remote/asynchronous/', 'GitLab Handbook')}${t('). In practice: a message must be self-contained (context, question, deadline) because the reader is asleep when you write it. How to write such messages in English is in ', '). Thực tế: một tin nhắn phải tự đủ ý (bối cảnh, câu hỏi, hạn) vì người đọc đang ngủ lúc bạn viết. Cách viết tin như vậy bằng tiếng Anh có ở ')}${cs('tieng-anh-ky-thuat-di-lam', 'tak-4-5-chat', t('Technical English 4.5', 'Tiếng Anh kỹ thuật 4.5'))}${t('; time zones and written confirmation in ', '; múi giờ và xác nhận bằng văn bản ở ')}${ag('agl-11-3-mui-gio-hop', t('lesson 11.3', 'bài 11.3'))}.</p>
${bang([t('Weak', 'Yếu'), t('Self-contained', 'Tự đủ ý')], [
    ['"Hi, are you there?"', t('"Hi Sarah — TICKET-142: the spec says dates in MM/DD but the clinic is in Germany. Use DD.MM.YYYY for de-DE users? If no answer by your EOD I\'ll keep MM/DD and note it in the PR."', '"Hi Sarah — TICKET-142: spec ghi ngày dạng MM/DD nhưng phòng khám ở Đức. Dùng DD.MM.YYYY cho người dùng de-DE nhé? Nếu tới cuối ngày bên chị chưa trả lời, em giữ MM/DD và ghi chú trong PR."')],
    ['"I have a question about the API"', t('"Question on POST /bookings (blocking TICKET-150): should a double booking return 409 or 422? I suggest 409 Conflict. Example payload below."', '"Câu hỏi về POST /bookings (đang chặn TICKET-150): đặt trùng trả 409 hay 422? Em đề xuất 409 Conflict. Ví dụ payload bên dưới."')],
  ])}

<h3>${t('Contracts change the conversation', 'Hợp đồng đổi cách nói chuyện')}</h3>
<p>${t(
    'US customers more often buy Time &amp; Materials or a dedicated team (lesson 9.1): they pay for hours, so they expect hours to be visible and honest — time logged daily against tickets, a quick "this is taking longer than expected" message the moment you know. Under fixed price, "small" additions cost your company money; under T&amp;M they cost the customer — either way, every addition must be agreed. Contract models: ',
    'Khách Mỹ hay mua kiểu Time &amp; Materials hoặc đội riêng (bài 9.1): họ trả tiền theo giờ, nên mong giờ làm được thấy rõ và trung thực — ghi giờ mỗi ngày theo ticket, nhắn ngay "việc này lâu hơn dự kiến" khi vừa biết. Với hợp đồng trọn gói, phần thêm "nhỏ" tốn tiền của công ty bạn; với T&amp;M thì tốn tiền của khách — kiểu nào thì mọi phần thêm cũng phải được đồng ý. Các mô hình hợp đồng: ')}${ag('agl-9-1-mo-hinh-hop-dong', t('lesson 9.1', 'bài 9.1'))}.</p>

<h3>${t('Hacker\'s corner: the "customer" who changes the bank account', 'Góc hacker: "khách" đổi số tài khoản ngân hàng')}</h3>
<p>${t(
    'Direct, informal communication — first names, quick messages, decisions in chat — is efficient, and attackers love it. Business e-mail compromise (BEC) means an attacker takes over or imitates a customer\'s or supplier\'s mailbox and sends a perfectly normal-looking request: pay the invoice to a new account, send the production database export "for the audit", add this person to the repository. The FBI\'s Internet Crime Report 2024 counted 21,442 BEC complaints with about US&#36;2.77 billion in losses in that year alone (',
    'Giao tiếp thẳng, thân mật — gọi tên riêng, nhắn nhanh, quyết trong chat — hiệu quả, và kẻ tấn công rất thích nó. Lừa đảo qua email doanh nghiệp (BEC — business email compromise) là khi kẻ tấn công chiếm hoặc giả hộp thư của khách hay nhà cung cấp, rồi gửi một yêu cầu trông hoàn toàn bình thường: chuyển tiền hoá đơn sang tài khoản mới, gửi bản xuất database production "để kiểm toán", thêm người này vào repo. Báo cáo tội phạm Internet 2024 của FBI ghi nhận 21.442 khiếu nại BEC với khoảng 2,77 tỷ USD thiệt hại chỉ trong năm đó (')}${ng('https://www.ic3.gov/AnnualReport/Reports/2024_IC3Report.pdf', 'FBI IC3 2024')}${t(
    '). Your rule does not change with the customer\'s friendliness: any request to move data, grant access or change payment goes to your PM and is verified through a second, known channel (lesson ',
    '). Quy tắc của bạn không đổi theo độ thân thiện của khách: mọi yêu cầu chuyển dữ liệu, cấp quyền hay đổi thanh toán đều đưa PM và được xác minh qua một kênh thứ hai đã biết (bài ')}${ag('agl-10-6-lua-dao', '10.6')}).</p>

<h3>${t('Demos are the real progress report', 'Demo mới là báo cáo tiến độ thật')}</h3>
<ul>
<li>${t('Show working software on a real-looking environment, not slides. Start with the user story, then click through it.', 'Cho xem phần mềm chạy được trên môi trường trông như thật, không phải slide. Bắt đầu bằng user story, rồi bấm qua nó.')}</li>
<li>${t('Say what is <em>not</em> done before they find it.', 'Nói phần <em>chưa</em> xong trước khi họ tự phát hiện.')}</li>
<li>${t('Collect feedback as tickets during the meeting, read them back at the end.', 'Ghi góp ý thành ticket ngay trong họp, đọc lại ở cuối buổi.')}</li>
<li>${t('Script and English phrases for demos: ', 'Kịch bản và câu tiếng Anh cho demo: ')}${cs('tieng-anh-ky-thuat-di-lam', 'tak-6-2-demo', t('Technical English 6.2', 'Tiếng Anh kỹ thuật 6.2'))}; ${t('sprint review in general: ', 'sprint review nói chung: ')}${ag('agl-1-2-scrum', t('lesson 1.2', 'bài 1.2'))}.</li>
</ul>

<h3>${t('Exercise: rewrite the "yes-man" replies', 'Bài tập: viết lại các câu trả lời "dạ vâng"')}</h3>
<ol>
<li>${t('PM: "Can we add Google login by Friday?" — Junior: "Yes, I will try."', 'PM: "Thêm đăng nhập Google trước thứ Sáu được không?" — Junior: "Vâng, em sẽ cố."')}</li>
<li>${t('Tech lead (Dutch): "This class is far too big." — Junior: "Sorry, sorry, I will be more careful."', 'Tech lead (Hà Lan): "Lớp này quá to." — Junior: "Em xin lỗi, em xin lỗi, em sẽ cẩn thận hơn."')}</li>
<li>${t('Customer in a meeting: "Any concerns about the new reporting page?" — Junior stays silent although the data needs a new table.', 'Khách trong họp: "Có lo ngại gì về trang báo cáo mới không?" — Junior im lặng dù dữ liệu cần thêm một bảng mới.')}</li>
</ol>
${giai(t('Model answers', 'Bài mẫu'), `<ol>
<li>${t('"Google login itself is about 1.5 days, but we also need account linking for users who already registered by e-mail — 2 more days. Options: (A) Google login for new users only by Friday, linking next sprint; (B) everything by next Wednesday. I recommend A. Which do you prefer?"', '"Riêng đăng nhập Google khoảng 1,5 ngày, nhưng còn cần liên kết tài khoản cho người đã đăng ký bằng email — thêm 2 ngày. Phương án: (A) đăng nhập Google cho người dùng mới trước thứ Sáu, liên kết để sprint sau; (B) làm đủ trước thứ Tư tuần sau. Em khuyến nghị A. Anh/chị chọn cái nào?"')}</li>
<li>${t('"Agreed — it mixes validation and persistence. I\'ll split it into BookingValidator and BookingRepository in this PR and push today."', '"Đồng ý — nó trộn kiểm dữ liệu và lưu trữ. Em sẽ tách thành BookingValidator và BookingRepository trong PR này và đẩy trong hôm nay."')}</li>
<li>${t('"One concern: the page needs daily totals we don\'t store yet — a new table plus a nightly job, about 2 days. I can write a short design note by tomorrow."', '"Một lo ngại: trang cần tổng theo ngày mà mình chưa lưu — thêm một bảng và một job chạy đêm, khoảng 2 ngày. Mai em gửi một ghi chú thiết kế ngắn."')}</li>
</ol>`)}

${phongVan([
    [t('How is working with US customers different from Japanese customers?', 'Làm với khách Mỹ khác khách Nhật thế nào?'), t('Communication is more direct and async; documents are lighter, demos matter more; they expect proposals. But the rule is the same: confirm decisions in writing and never change scope without agreement.', 'Giao tiếp thẳng hơn và bất đồng bộ; tài liệu nhẹ hơn, demo quan trọng hơn; họ mong được đề xuất. Nhưng luật giữ nguyên: chốt quyết định bằng văn bản và không bao giờ đổi phạm vi khi chưa được đồng ý.')],
    [t('Tell me about a time you disagreed with a decision.', 'Kể một lần bạn không đồng ý với một quyết định.'), t('STAR: goal I understood, concern with evidence, alternative I proposed, decision handed back — and what I did after (committed and delivered).', 'STAR: mục tiêu em hiểu, mối lo có bằng chứng, phương án em đề xuất, trả lại quyền quyết — và em làm gì sau đó (cam kết và làm xong).')],
    [t('The customer asks for your opinion. How do you structure the answer?', 'Khách hỏi ý kiến bạn. Bạn trình bày thế nào?'), t('Bottom line first, at most three options with effort and risk, what is not included, and who decides by when.', 'Kết luận trước, tối đa ba phương án có công sức và rủi ro, phần không gồm, và ai quyết trước ngày nào.')],
    [t('A customer messages you directly asking for a new feature. What do you do?', 'Khách nhắn thẳng cho bạn xin tính năng mới. Bạn làm gì?'), t('Thank them, clarify what they need, say I will check scope and timing with my PM, and copy the PM — I do not promise dates alone.', 'Cảm ơn, hỏi rõ họ cần gì, nói em sẽ kiểm phạm vi và thời gian với PM, và đưa PM vào cuộc trao đổi — em không tự hứa ngày.')],
  ], en)}

${thuatNgu([
    ['BLUF', t('Bottom line up front — conclusion first', 'Kết luận lên đầu')],
    [t('Upgrader / downgrader', 'Nói giảm / nói tăng'), t('Softening vs strengthening criticism (Meyer)', 'Làm nhẹ / làm mạnh lời chê (Meyer)')],
    ['Disagree and commit', t('Argue before the decision, support it fully after', 'Tranh luận trước khi quyết, ủng hộ hết mình sau khi đã quyết')],
    [t('Async communication', 'Giao tiếp bất đồng bộ'), t('Written messages that do not need the reader online now', 'Tin nhắn viết, không cần người đọc đang trực tuyến')],
    ['BEC', t('Business e-mail compromise — fraud through a real or fake business mailbox', 'Lừa đảo qua hộp thư doanh nghiệp thật bị chiếm hoặc giả')],
    ['TL;DR', t('"Too long; didn\'t read" — the one-line summary at the top', 'Dòng tóm tắt ở đầu cho người không đọc hết')],
  ], en)}

${tomTat([
    t('Western customers often pay for your judgement: answer "thoughts?" with options, trade-offs and a recommendation.', 'Khách phương Tây thường trả tiền cho phán đoán của bạn: trả lời "thoughts?" bằng phương án, đánh đổi và khuyến nghị.'),
    t('Bottom line first; at most three options; always effort, risk and "not included".', 'Kết luận trước; tối đa ba phương án; luôn có công sức, rủi ro và "chưa gồm".'),
    t('Push back with the goal, evidence and an alternative — then hand back the decision and commit.', 'Phản biện bằng mục tiêu, bằng chứng và phương án khác — rồi trả lại quyền quyết và cam kết.'),
    t('Read feedback by culture: American praise can wrap a real problem; Dutch bluntness is about the code.', 'Đọc lời nhận xét theo văn hoá: lời khen kiểu Mỹ có thể bọc một vấn đề thật; sự thẳng kiểu Hà Lan là nói về mã.'),
    t('Informality is not trust: data, access and payment requests are verified through a second channel.', 'Thân mật không phải tin tưởng: yêu cầu về dữ liệu, quyền truy cập và thanh toán phải xác minh qua kênh thứ hai.'),
  ], en)}
<p>${t('Next', 'Tiếp theo')}: ${ag('agl-11-3-mui-gio-hop', t('11.3 — Time zones, meeting minutes and written confirmation', '11.3 — Múi giờ, biên bản họp và xác nhận bằng văn bản'))}.</p>
`);
};
