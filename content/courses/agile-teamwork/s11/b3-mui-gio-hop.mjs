/**
 * 11.3 — Múi giờ, biên bản họp và xác nhận bằng văn bản (agl-11-3-mui-gio-hop). Soạn 24/11/2026, agent agl.
 * Chạy thật: scratchpad/agl/lab/ch11/mui-gio.mjs (Intl + IANA tz của Node 22.22.2; ngày DST 2026: Mỹ 08/03 và 01/11, EU 29/03 và 25/10)
 * và kiem-bien-ban.mjs trên bien-ban/hop-0.md (6 lỗi, exit 1) + hop-1.md (0 lỗi, exit 0) — output RA.muiGio, RA.bienBan.
 * Nguồn: FBI Boston 30/03/2020 "FBI Warns of Teleconferencing and Online Classroom Hijacking During COVID-19 Pandemic".
 * Mars Climate Orbiter đã kể ở tak-0-9 ⇒ chỉ liên kết.
 */
import { bang, cl, note, phongVan, thuatNgu, tomTat, giai, cs, ag, ng, vo, js, out } from '../_chung.mjs';
import { MA, RA } from './_ma.mjs';

export const L113 = (en) => {
  const t = (a, b) => (en ? a : b);
  return vo(en, 'Chapter 11 · Working with Japanese and American clients', 'Chương 11 · Làm việc với khách Nhật và khách Mỹ', `
<h2>${t('11.3 — Time zones, meeting minutes and confirming in writing', '11.3 — Múi giờ, biên bản họp và xác nhận bằng văn bản')}</h2>
<p class="lead">${t(
    'Monday 9 March 2026, 21:05 Hanoi time. You join the weekly call with the New York customer exactly as your calendar says — and the meeting is already over. Nobody changed anything: the US moved its clocks forward the day before, and your calendar entry said "21:00 Hanoi" instead of "09:00 New York". The same week, the customer insists they "clearly said" the export must include cancelled bookings; you remember the opposite and nobody wrote it down. This lesson fixes both problems: time zones you can trust, and decisions that exist on paper.',
    'Thứ Hai 9/3/2026, 21:05 giờ Hà Nội. Bạn vào cuộc họp tuần với khách New York đúng giờ trên lịch — và buổi họp đã kết thúc. Không ai đổi gì cả: hôm trước nước Mỹ vặn đồng hồ sớm lên một giờ, còn lịch của bạn ghi "21:00 Hà Nội" thay vì "09:00 New York". Cũng tuần đó, khách khẳng định họ "đã nói rõ" là tệp xuất phải gồm cả lịch hẹn đã huỷ; bạn nhớ ngược lại và không ai ghi lại. Bài này sửa cả hai vấn đề: giờ giấc tin được, và quyết định có trên giấy.')}</p>

${cl('info', t(
    '<strong>Everyday picture.</strong> You lend a friend money and say "pay me back next month". A month later you both "remember" different amounts. A one-line message — "Lent you 2 million on 24/11, back by 24/12 👍" — would have saved the friendship. Minutes and written confirmations are that message, for projects.',
    '<strong>Liên tưởng đời thường.</strong> Bạn cho bạn thân vay tiền, nói "tháng sau trả". Một tháng sau hai người "nhớ" hai con số khác nhau. Một tin nhắn một dòng — "Cho vay 2 triệu ngày 24/11, trả trước 24/12 👍" — đã cứu được tình bạn. Biên bản họp và xác nhận bằng văn bản chính là tin nhắn đó, cho dự án.'))}

<h3>${t('Time zones: the facts you need', 'Múi giờ: những điều cần biết')}</h3>
${bang([t('Place', 'Nơi'), t('IANA zone', 'Vùng IANA'), t('Offset', 'Độ lệch'), t('Summer time (DST)', 'Giờ mùa hè (DST)')], [
    [t('Vietnam', 'Việt Nam'), 'Asia/Ho_Chi_Minh', 'UTC+7 (ICT)', t('None', 'Không có')],
    [t('Japan', 'Nhật'), 'Asia/Tokyo', 'UTC+9 (JST)', t('None — Japan is always 2 hours ahead of Vietnam', 'Không — Nhật luôn sớm hơn Việt Nam 2 giờ')],
    [t('US East coast', 'Bờ Đông Mỹ'), 'America/New_York', t('UTC−5 (EST) / UTC−4 (EDT)', 'UTC−5 (EST) / UTC−4 (EDT)'), t('Second Sunday of March → first Sunday of November (2026: 8 Mar → 1 Nov)', 'Chủ nhật thứ hai của tháng 3 → Chủ nhật đầu tháng 11 (2026: 8/3 → 1/11)')],
    [t('UK', 'Anh'), 'Europe/London', t('UTC+0 / UTC+1 (BST)', 'UTC+0 / UTC+1 (BST)'), t('Last Sunday of March → last Sunday of October (2026: 29 Mar → 25 Oct)', 'Chủ nhật cuối tháng 3 → Chủ nhật cuối tháng 10 (2026: 29/3 → 25/10)')],
  ])}
<p>${t(
    'Because the US and Europe switch on <em>different</em> Sundays, there are a few weeks each spring and autumn when even the gap between New York and London is one hour off. Nobody memorises this; you let the computer compute it. The script below uses only Node\'s built-in Intl API and the IANA time-zone database:',
    'Vì Mỹ và châu Âu đổi giờ vào những Chủ nhật <em>khác nhau</em>, mỗi mùa xuân và mùa thu có vài tuần mà ngay cả khoảng cách New York – London cũng lệch một giờ. Không ai học thuộc chuyện này; hãy để máy tính. Đoạn script dưới đây chỉ dùng Intl có sẵn của Node và cơ sở dữ liệu múi giờ IANA:')}</p>
${js(MA.muiGio)}
${out('$ node mui-gio.mjs\n' + RA.muiGio)}
<ul>
<li>${t('<strong>Part 1:</strong> a 09:00 New York stand-up is 21:00 in Hanoi in winter and 20:00 in summer. Between 9 and 29 March (and 26 Oct – 1 Nov) London is only 4 hours ahead of New York instead of 5.', '<strong>Phần 1:</strong> họp đứng 09:00 New York là 21:00 Hà Nội mùa đông và 20:00 mùa hè. Từ 9 tới 29/3 (và 26/10 – 1/11), London chỉ sớm hơn New York 4 giờ thay vì 5.')}</li>
<li>${t('<strong>Part 2:</strong> with Japan you share 8 working hours — easy. With London, 3 hours in your afternoon. With New York, <strong>none</strong>: someone always works outside normal hours, so agree who and when, and rotate it fairly.', '<strong>Phần 2:</strong> với Nhật bạn có chung 8 giờ làm — dễ. Với London, 3 giờ vào buổi chiều của bạn. Với New York, <strong>không có giờ chung</strong>: luôn có người phải làm ngoài giờ, nên phải thoả thuận ai và khi nào, và luân phiên cho công bằng.')}</li>
<li>${t('<strong>Part 3:</strong> the bug from the opening story. A meeting owned by New York must be stored in New York time; then every calendar converts it correctly on every date.', '<strong>Phần 3:</strong> lỗi trong câu chuyện mở đầu. Cuộc họp do New York làm chủ phải được lưu theo giờ New York; khi đó mọi lịch đều tự đổi đúng vào mọi ngày.')}</li>
</ul>
${bang([t('Rule', 'Quy tắc'), t('Why', 'Vì sao')], [
    [t('Always write time <strong>with its zone, both sides</strong>: "10:00 JST (08:00 ICT)", "9:00 am ET (21:00 ICT)"', 'Luôn ghi giờ <strong>kèm múi giờ, cả hai bên</strong>: "10:00 JST (08:00 ICT)", "9:00 am ET (21:00 ICT)"'), t('Removes the "your 9 or my 9?" question', 'Bỏ được câu hỏi "9 giờ bên anh hay bên em?"')],
    [t('Write "ET"/"PT", not "EST" in summer', 'Viết "ET"/"PT", đừng viết "EST" vào mùa hè'), t('EST is the winter offset only; in July it is EDT', 'EST chỉ là độ lệch mùa đông; tháng 7 là EDT')],
    [t('Send a calendar invite from a calendar app, never "copy the time" by hand', 'Gửi lời mời bằng ứng dụng lịch, đừng "chép giờ" bằng tay'), t('The invite carries the organiser\'s zone; every attendee\'s calendar converts it', 'Lời mời mang múi giờ của người tổ chức; lịch của từng người tự đổi')],
    [t('Dates as YYYY-MM-DD in writing to foreigners', 'Ngày viết YYYY-MM-DD khi gửi người nước ngoài'), t('03/04 is 3 April in Vietnam but March 4 in the US', '03/04 là 3 tháng 4 ở Việt Nam, nhưng là ngày 4 tháng 3 ở Mỹ')],
    [t('Store timestamps in UTC in databases; convert for display', 'Lưu thời điểm trong database bằng UTC; đổi khi hiển thị'), t('The same Intl technique, on the server side', 'Cùng kỹ thuật Intl, phía máy chủ')],
  ])}

<h3>${t('Working across the gap: the hand-over note', 'Làm việc qua khoảng lệch: ghi chú bàn giao')}</h3>
<p>${t(
    'With no shared hours, the customer reads your work while you sleep. End each day with a hand-over note in the team channel — it is the daily report of lesson 9.7, rewritten for a reader who cannot ask you anything for 12 hours:',
    'Khi không có giờ chung, khách đọc kết quả của bạn lúc bạn ngủ. Cuối mỗi ngày viết một ghi chú bàn giao trong kênh của đội — nó là báo cáo ngày ở bài 9.7, viết lại cho một người đọc không hỏi lại bạn được suốt 12 giờ:')}</p>
${out(t(
    'EOD 2026-11-24 (Lan, ICT) — TICKET-142 booking export\nDone: CSV export incl. cancelled bookings per D-3 (minutes 2026-11-23). PR #88 ready for review.\nBlocked: need the de-DE date format decision (Q&A #15) — I assumed DD.MM.YYYY, easy to change.\nNext (my tomorrow 08:00 ICT = your 20:00 ET): fix review comments on PR #88.\nPlease reply in this thread; I will read at 08:00 ICT.',
    'Cuối ngày 2026-11-24 (Lan, ICT) — TICKET-142 xuất lịch hẹn\nĐã xong: xuất CSV gồm lịch đã huỷ theo D-3 (biên bản 2026-11-23). PR #88 sẵn sàng review.\nVướng: cần quyết định định dạng ngày de-DE (Q&A #15) — em tạm giả định DD.MM.YYYY, đổi dễ.\nTiếp theo (08:00 ICT mai = 20:00 ET của anh/chị): sửa góp ý review PR #88.\nVui lòng trả lời trong thread này; em đọc lúc 08:00 ICT.'))}

<h3>${t('Meeting minutes (議事録, MoM): what goes in', 'Biên bản họp (議事録, MoM): ghi gì')}</h3>
<p>${t(
    'Minutes are not a transcript. They record four things: who was there and when, what was <strong>decided</strong>, who does <strong>what by when</strong>, and what is still <strong>open</strong>. In Japanese projects they are called 議事録 (<em>gijiroku</em>); in English "minutes of meeting" (MoM). The usual practice is to send them the same day — while everyone still remembers — and ask the customer to reply with corrections by a date; silence after that date is treated as agreement only if the project has agreed that rule in advance.',
    'Biên bản không phải bản ghi lại từng lời. Nó ghi bốn thứ: ai dự và lúc nào, điều gì đã được <strong>quyết</strong>, ai làm <strong>việc gì trước ngày nào</strong>, và điều gì còn <strong>mở</strong>. Ở dự án Nhật gọi là 議事録 (<em>gijiroku</em>); tiếng Anh là "minutes of meeting" (MoM). Thông lệ là gửi ngay trong ngày — khi mọi người còn nhớ — và đề nghị khách phản hồi chỗ cần sửa trước một ngày cụ thể; im lặng sau ngày đó chỉ được coi là đồng ý nếu dự án đã thống nhất luật đó từ trước.')}</p>
${bang([t('Section', 'Mục'), t('Must contain', 'Phải có'), t('Typical mistake', 'Lỗi hay gặp')], [
    [t('Information', 'Thông tin'), t('Date, time <em>with zone</em>, attendees with roles, note-taker', 'Ngày, giờ <em>kèm múi giờ</em>, người dự kèm vai trò, người ghi'), t('No zone; "the customer" instead of names', 'Thiếu múi giờ; ghi "khách" thay vì tên')],
    [t('Decisions', 'Quyết định'), t('Numbered D-1, D-2… so later documents can cite them; link to the Q&amp;A or CR', 'Đánh số D-1, D-2… để tài liệu sau trích dẫn được; liên kết tới Q&amp;A hoặc CR'), t('Discussion written as if it were a decision', 'Ghi phần thảo luận như thể đã là quyết định')],
    [t('Action items', 'Việc cần làm'), t('One owner (@name) and one date (YYYY-MM-DD) each', 'Mỗi việc một người (@tên) và một ngày (YYYY-MM-DD)'), t('"ASAP", "the team", "we will look into it"', '"ASAP", "cả đội", "sẽ xem"')],
    [t('Open questions', 'Câu hỏi còn mở'), t('What is not decided, who must answer', 'Điều chưa quyết, ai phải trả lời'), t('Forgotten — then "decided" by default', 'Bị quên — rồi thành "đã quyết" mặc định')],
  ])}

<h3>${t('A linter for minutes', 'Một bộ soát cho biên bản')}</h3>
<p>${t('The rules above are mechanical, so a script can check them before you press Send. Here is a first draft written right after a review meeting:', 'Các quy tắc trên là máy móc, nên một script có thể kiểm chúng trước khi bạn bấm Gửi. Đây là bản nháp đầu viết ngay sau một buổi review:')}</p>
${out('hop-0.md\n\n' + MA.hop0)}
<p>${t('The checker (≈ 30 lines of Node, no library):', 'Bộ soát (≈ 30 dòng Node, không thư viện):')}</p>
${js(MA.kiemBienBan)}
${out(RA.bienBan)}
<p>${t(
    'Six problems in an eight-line draft — and every one of them is the kind that causes a dispute two weeks later: a decision without a number cannot be cited, "send the test spec soon" has no owner and no date, "10:00" means two different times to the two companies. The corrected version passes with exit code 0, so it can also run in CI or as a pre-commit hook if your minutes live in a repository:',
    'Sáu lỗi trong một bản nháp tám dòng — và lỗi nào cũng là loại gây tranh cãi hai tuần sau: quyết định không có số thì không trích dẫn được, "gửi lại test spec sớm" không có người cũng không có ngày, "10:00" là hai giờ khác nhau với hai công ty. Bản đã sửa qua với mã thoát 0, nên cũng chạy được trong CI hoặc làm hook pre-commit nếu biên bản nằm trong repo:')}</p>
${out('hop-1.md\n\n' + MA.hop1)}

<h3>${t('Confirming in writing', 'Xác nhận bằng văn bản')}</h3>
<p>${t(
    'Decisions also happen outside meetings — in a hallway call, on a Zoom after the agenda ended, in a voice message. The rule: <strong>if it changes what you build, when, or for how much, it is not real until it is written and acknowledged</strong>. A one-paragraph confirmation is enough:',
    'Quyết định còn xảy ra ngoài buổi họp — trong cuộc gọi nhanh, trên Zoom sau khi hết chương trình, trong tin nhắn thoại. Quy tắc: <strong>nếu nó thay đổi thứ bạn làm, lúc nào xong, hay tốn bao nhiêu, thì nó chưa có thật cho tới khi được viết ra và được xác nhận</strong>. Một đoạn xác nhận là đủ:')}</p>
${out(t(
    'Subject: [Confirm] Export includes cancelled bookings (from today\'s call)\n\nHi Tanaka-san,\nTo confirm what we agreed on the call today (2026-11-24, 15:00 JST):\n- The CSV export will include cancelled bookings, with status = CANCELLED.\n- This replaces DD 4.1 row 7 ("active bookings only"). We will update DD to v1.3.\n- No change to the delivery date (2026-12-05).\nIf anything above is not correct, please reply by 2026-11-26.\nBest regards, Lan',
    'Tiêu đề: [Xác nhận] Tệp xuất gồm lịch hẹn đã huỷ (từ cuộc gọi hôm nay)\n\nKính gửi anh Tanaka,\nEm xin xác nhận nội dung đã thống nhất trong cuộc gọi hôm nay (2026-11-24, 15:00 JST):\n- Tệp CSV xuất ra sẽ gồm lịch hẹn đã huỷ, với status = CANCELLED.\n- Điều này thay cho DD 4.1 dòng 7 ("chỉ lịch còn hiệu lực"). Bên em sẽ cập nhật DD lên v1.3.\n- Không đổi ngày giao (2026-12-05).\nNếu có điểm nào chưa đúng, mong anh phản hồi trước 2026-11-26.\nTrân trọng, Lan'))}
<p>${t(
    'Notice it cites the document and row it replaces — so the DD, the test spec and the minutes stay consistent. If the change affects scope or the date, it is a change request instead (',
    'Để ý nó dẫn đúng tài liệu và dòng bị thay — để DD, test spec và biên bản luôn khớp nhau. Nếu thay đổi chạm tới phạm vi hoặc ngày giao, nó là change request (')}${ag('agl-9-5-qa-cr', t('lesson 9.5', 'bài 9.5'))}${t('). English phrasing for confirmation e-mails: ', '). Câu chữ tiếng Anh cho email xác nhận: ')}${cs('tieng-anh-ky-thuat-di-lam', 'tak-5-3-xac-nhan', t('Technical English 5.3', 'Tiếng Anh kỹ thuật 5.3'))}${t('. Why two teams can work for months on different assumptions — the Mars Climate Orbiter story — is told in ', '. Vì sao hai đội có thể làm hàng tháng trời trên hai giả định khác nhau — chuyện tàu Mars Climate Orbiter — được kể ở ')}${cs('tieng-anh-ky-thuat-di-lam', 'tak-0-9-bat-dau-khi-khong-co', t('Technical English, Start here 2/2', 'Tiếng Anh kỹ thuật, Bắt đầu tại đây 2/2'))}.</p>

<h3>${t('Hacker\'s corner: the meeting link is a key', 'Góc hacker: đường dẫn họp là một chiếc chìa khoá')}</h3>
<p>${t(
    'On 30 March 2020, as the world moved online, the FBI\'s Boston office warned about "Zoom-bombing": strangers joining online classes and meetings whose links had been posted publicly, then shouting threats or showing offensive images. The FBI advised keeping meetings private with a passcode or waiting room and never posting links on public channels (',
    'Ngày 30/3/2020, khi cả thế giới chuyển lên mạng, văn phòng FBI ở Boston cảnh báo về "Zoom-bombing": người lạ vào các lớp học và cuộc họp trực tuyến có đường dẫn bị đăng công khai, rồi la hét đe doạ hoặc chiếu hình ảnh xúc phạm. FBI khuyên giữ cuộc họp riêng tư bằng mật mã hoặc phòng chờ và không bao giờ đăng đường dẫn lên kênh công khai (')}${ng('https://www.securitymagazine.com/articles/92050-fbi-warns-of-teleconferencing-and-online-classroom-hijacking-during-covid-19-pandemic', t('FBI warning, reported by Security Magazine', 'cảnh báo của FBI, Security Magazine đưa tin'))}${t(
    '). For customer meetings the same applies, plus three habits from chapter 10: do not paste the meeting link into public or personal chats; ask before recording, and store recordings and minutes where the project\'s classification rules say (lesson 10.2); and do not invite a personal AI note-taker bot into a customer meeting — it sends the conversation to a third party (lesson 10.3).',
    '). Với cuộc họp với khách cũng vậy, thêm ba thói quen từ chương 10: không dán đường dẫn họp vào chat công khai hay chat cá nhân; hỏi trước khi ghi hình, và lưu bản ghi cùng biên bản đúng chỗ mà quy định phân loại của dự án chỉ ra (bài 10.2); và không mời bot ghi chú AI cá nhân vào cuộc họp với khách — nó gửi cuộc trò chuyện cho bên thứ ba (bài 10.3).')}</p>

<h3>${t('Exercise', 'Bài tập')}</h3>
<ol>
<li>${t('Your Tokyo customer proposes "next Tuesday 17:00". Write the line you put in your reply.', 'Khách Tokyo đề nghị "thứ Ba tuần sau 17:00". Viết dòng bạn đưa vào thư trả lời.')}</li>
<li>${t('Run mui-gio.mjs for a London customer and find the best 1-hour slot for a weekly call in March 2026, before and after 29 March.', 'Chạy mui-gio.mjs cho khách London, tìm khung 1 giờ tốt nhất cho họp tuần trong tháng 3/2026, trước và sau 29/3.')}</li>
<li>${t('Add one rule to kiem-bien-ban.mjs: every decision must cite a source (Q&amp;A #n, CR-n or "meeting"). Make hop-1.md still pass.', 'Thêm một luật vào kiem-bien-ban.mjs: mỗi quyết định phải dẫn nguồn (Q&amp;A #n, CR-n hoặc "trong họp"). Giữ hop-1.md vẫn qua.')}</li>
</ol>
${giai(t('Hints and answers', 'Gợi ý và đáp án'), `<ol>
<li>${t('"Tuesday 2026-12-01, 17:00 JST (15:00 ICT) — confirmed. I will send the invite." Japan has no DST, so the 2-hour gap never changes.', '"Thứ Ba 2026-12-01, 17:00 JST (15:00 ICT) — xác nhận. Em sẽ gửi lời mời." Nhật không có DST nên khoảng 2 giờ không bao giờ đổi.')}</li>
<li>${t('Change NGAY to 2026-03-10 and 2026-03-30 and rerun. Output: before 29 March, 3 shared hours, 15:00–18:00 ICT (08:00–11:00 London); after, 4 shared hours, 14:00–18:00 ICT (08:00–12:00 London), because 08:00 BST = 07:00 UTC = 14:00 ICT. Pick e.g. 15:00 ICT, which stays inside the window on both sides of the change.', 'Đổi NGAY thành 2026-03-10 và 2026-03-30 rồi chạy lại. Kết quả: trước 29/3 có 3 giờ chung, 15:00–18:00 ICT (08:00–11:00 London); sau đó 4 giờ chung, 14:00–18:00 ICT (08:00–12:00 London), vì 08:00 BST = 07:00 UTC = 14:00 ICT. Chọn ví dụ 15:00 ICT, nằm trong khung ở cả hai phía ngày đổi giờ.')}</li>
<li>${t('In the decision loop: if (!/(Q&amp;A #\\d+|CR-\\d+|trong họp)/.test(d)) loi.push(…). hop-1.md D-2 has no source yet — add "(trong họp)" to it.', 'Trong vòng lặp quyết định: if (!/(Q&amp;A #\\d+|CR-\\d+|trong họp)/.test(d)) loi.push(…). D-2 của hop-1.md chưa có nguồn — thêm "(trong họp)" vào.')}</li>
</ol>`)}

${phongVan([
    [t('How do you work with a team 12 hours away?', 'Bạn làm việc thế nào với một đội lệch 12 giờ?'), t('Self-contained async messages, an end-of-day hand-over note, decisions written in the ticket or minutes, and an agreed rotating slot for the calls that must be live.', 'Tin nhắn bất đồng bộ tự đủ ý, ghi chú bàn giao cuối ngày, quyết định ghi trong ticket hoặc biên bản, và một khung họp trực tiếp được thống nhất, luân phiên.')],
    [t('What makes good meeting minutes?', 'Biên bản họp tốt cần gì?'), t('Date and time with zone, attendees, numbered decisions, action items each with one owner and one date, open questions — sent the same day, with a reply-by date.', 'Ngày giờ kèm múi giờ, người dự, quyết định có số, việc cần làm mỗi việc một người một ngày, câu hỏi còn mở — gửi trong ngày, kèm hạn phản hồi.')],
    [t('The customer changes a requirement on a call. What do you do next?', 'Khách đổi yêu cầu trong một cuộc gọi. Bạn làm gì tiếp?'), t('Send a written confirmation citing the document and row it replaces, check scope and date impact with my PM, and only then update the DD and start.', 'Gửi xác nhận bằng văn bản dẫn đúng tài liệu và dòng bị thay, kiểm ảnh hưởng tới phạm vi và ngày với PM, rồi mới cập nhật DD và bắt đầu làm.')],
    [t('Why store timestamps in UTC?', 'Vì sao lưu thời điểm bằng UTC?'), t('UTC has no DST, so instants are unambiguous; you convert to the user\'s IANA zone only for display. Recurring local events like "09:00 New York every Monday" are the exception: store the local time plus the zone.', 'UTC không có DST nên thời điểm không mơ hồ; chỉ đổi sang vùng IANA của người dùng khi hiển thị. Ngoại lệ là sự kiện lặp theo giờ địa phương như "09:00 New York mỗi thứ Hai": lưu giờ địa phương kèm vùng.')],
  ], en)}

${thuatNgu([
    [t('IANA time zone', 'Vùng giờ IANA'), t('Named zone such as America/New_York, with its full history of offset changes', 'Tên vùng như America/New_York, kèm toàn bộ lịch sử thay đổi độ lệch')],
    ['DST', t('Daylight saving time — clocks moved one hour in summer', 'Giờ mùa hè — đồng hồ vặn sớm một giờ')],
    ['ICT / JST / ET', t('Indochina Time (UTC+7) / Japan Standard Time (UTC+9) / US Eastern Time', 'Giờ Đông Dương (UTC+7) / giờ chuẩn Nhật (UTC+9) / giờ miền Đông Mỹ')],
    ['議事録 / MoM', t('Meeting minutes', 'Biên bản họp')],
    ['Action item', t('A task from a meeting with one owner and one date', 'Việc phát sinh từ buổi họp, có một người làm và một hạn')],
    ['EOD', t('End of day — "by your EOD" means before their working day ends', 'Cuối ngày — "by your EOD" là trước khi ngày làm của họ kết thúc')],
  ], en)}

${tomTat([
    t('Write every time with its zone on both sides; send calendar invites; let code compute DST.', 'Mọi giờ đều ghi kèm múi giờ hai bên; gửi lời mời lịch; để mã tính DST.'),
    t('Vietnam–Japan: always 2 hours. Vietnam–New York: no shared working hours — agree a rotating slot.', 'Việt Nam – Nhật: luôn 2 giờ. Việt Nam – New York: không có giờ làm chung — thoả thuận khung luân phiên.'),
    t('Minutes = information, numbered decisions, action items with owner + date, open questions; send the same day.', 'Biên bản = thông tin, quyết định có số, việc có người + hạn, câu hỏi còn mở; gửi trong ngày.'),
    t('Anything that changes what, when or how much is not real until written and acknowledged.', 'Thứ gì thay đổi làm gì, khi nào xong hay tốn bao nhiêu thì chưa có thật cho tới khi được viết ra và được xác nhận.'),
    t('Meeting links, recordings and minutes are project data — protect them like documents.', 'Đường dẫn họp, bản ghi và biên bản là dữ liệu dự án — bảo vệ như tài liệu.'),
  ], en)}
<p>${t('Next', 'Tiếp theo')}: ${ag('agl-11-4-tinh-huong-kho', t('11.4 — Hard situations', '11.4 — Tình huống khó'))}.</p>
`);
};
