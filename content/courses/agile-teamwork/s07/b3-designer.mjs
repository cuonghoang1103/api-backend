/**
 * 7.3 — Lập trình viên và designer (agl-7-3-designer — slug + title GIỮ theo khung). Soạn 24/11/2026, agent agt.
 * Ranh giới: lý thuyết UX (heuristics, prototype, usability test) ở WDU203c (Academy 'ui-ux-design') ⇒ liên kết; so ảnh tự động trong CI ở tst-7-4.
 * Bài này: đọc thiết kế như một đặc tả (Dev Mode/Inspect, token, component, trạng thái), thương lượng chi tiết, ghi lệch đã duyệt; nhóm SWP391 không có designer.
 * Lab chạy THẬT (scratchpad/agt/lab/ch7): so-thiet-ke.mjs mở màn S22 trong Google Chrome 150 headless qua CDP (WebSocket của Node 22), đo style đã tính
 * của từng data-k, so spec JSON, đo tương phản WCAG, chạy trạng thái chữ dài/rỗng/lỗi: v1 13 lệch ⇒ v2 0 lệch + 1 lệch đã duyệt (QĐ-07).
 * Chuyện thật: Robles v. Domino’s Pizza (Ninth Circuit 15/01/2019; Toà Tối cao Mỹ từ chối xem xét 07/10/2019).
 */
import { bang, cl, note, phongVan, thuatNgu, tomTat, giai, js, out, ag, cs, ac, ng, vo } from '../_chung.mjs';
import { MA, RA } from './_ma.mjs';

export const L73 = (en) => {
  const t = (a, b) => (en ? a : b);
  return vo(en, 'Chapter 7 · Lesson 7.3', 'Chương 7 · Bài 7.3', `
<h2>${t('7.3 — Developers and designers', '7.3 — Lập trình viên và designer')}</h2>
<p class="lead">${t(
    'A design file is a specification written in pictures. Developers get into trouble in two opposite ways: treating it as a rough sketch ("close enough") or as sacred ("I spent two days on a custom date picker because it was in Figma"). The professional middle is to read the design precisely, ask about what the pictures do not show — empty, loading, error, long text — and negotiate the expensive details openly, writing down what was agreed. This lesson does that on a real page with a real browser.',
    'Tệp thiết kế là một bản đặc tả viết bằng hình. Lập trình viên gặp rắc rối theo hai hướng ngược nhau: coi nó là bản phác ("gần giống là được") hoặc coi nó là thánh ("mình mất hai ngày làm bộ chọn ngày tự vẽ vì Figma có thế"). Chỗ chuyên nghiệp ở giữa là đọc thiết kế cho chính xác, hỏi những gì hình không cho thấy — rỗng, đang tải, lỗi, chữ dài — và thương lượng công khai các chi tiết đắt, ghi lại điều đã thống nhất. Bài này làm đúng việc đó trên một trang thật với một trình duyệt thật.')}</p>

<h3>${t('Everyday picture: the tailor and the sketch', 'Liên tưởng đời thường: thợ may và bản vẽ')}</h3>
<p>${t(
    'A good tailor reads the sketch and the measurements exactly: a sleeve that is 2 cm short is a wrong sleeve, not "close enough". But when the sketch shows a fabric that costs three times the budget, the tailor does not silently swap it, nor silently overspend — they call the customer: "this fabric costs X; this one looks 90 % the same for a third; which do you want?" And the sketch never shows what happens when the customer gains five kilos. Somebody has to ask.',
    'Thợ may giỏi đọc bản vẽ và số đo chính xác: tay áo ngắn 2 cm là tay áo sai, không phải "gần đúng". Nhưng khi bản vẽ dùng loại vải đắt gấp ba ngân sách, thợ không âm thầm đổi, cũng không âm thầm vượt chi — họ gọi khách: "vải này giá X; vải kia trông giống 90 % mà giá một phần ba; anh chọn loại nào?" Và bản vẽ không bao giờ cho thấy chuyện gì xảy ra khi khách tăng năm cân. Phải có người hỏi.')}</p>

<h3>${t('Reading a design like a spec', 'Đọc thiết kế như đọc đặc tả')}</h3>
${bang([t('In the design tool', 'Trong công cụ thiết kế'), t('What it means for your code', 'Nghĩa là gì với mã của bạn')], [
    [t('Inspect / Dev Mode values (size, spacing, colour)', 'Giá trị trong Inspect / Dev Mode (kích thước, khoảng cách, màu)'), t('Exact numbers — copy them, do not eyeball', 'Con số chính xác — chép lại, đừng ước bằng mắt')],
    [t('Colour and text styles with names (tokens)', 'Màu và kiểu chữ có tên (token)'), t('CSS variables / theme values; never hard-code #1d4ed8 in ten places', 'Biến CSS / giá trị theme; đừng gõ cứng #1d4ed8 ở mười chỗ')],
    [t('Components and variants (Button / primary / disabled)', 'Component và biến thể (Button / primary / disabled)'), t('One React component with props, not five copies', 'Một component React có props, không phải năm bản sao')],
    [t('Auto layout (direction, gap, padding)', 'Auto layout (hướng, gap, padding)'), t('Flexbox: flex-direction, gap, padding — it maps almost one to one', 'Flexbox: flex-direction, gap, padding — gần như tương ứng một–một')],
    [t('Frames at 1440 and 375 px', 'Khung ở 1440 và 375 px'), t('Breakpoints; ask what happens between them', 'Điểm ngắt; hỏi giữa hai cỡ đó thì sao')],
    [t('Prototype links between frames', 'Liên kết prototype giữa các khung'), t('The navigation flow and which states exist', 'Luồng điều hướng và những trạng thái có tồn tại')],
  ])}
<p>${t(
    'What a design file almost never shows, and you must ask about before you start: <strong>empty</strong> (no rooms that day), <strong>loading</strong>, <strong>error</strong> (network down, 422), <strong>very long text</strong> (a 60-character room name, a Vietnamese name with many words), <strong>0 / 1 / many</strong> items, <strong>disabled</strong> and <strong>permission</strong> states (what does a lecturer see that a student does not?). The UX theory behind these — heuristics, prototyping, usability tests — is in ',
    'Điều tệp thiết kế gần như không bao giờ cho thấy, và bạn phải hỏi trước khi bắt đầu: trạng thái <strong>rỗng</strong> (hôm đó không còn phòng), <strong>đang tải</strong>, <strong>lỗi</strong> (mất mạng, 422), <strong>chữ rất dài</strong> (tên phòng 60 ký tự, tên người Việt nhiều chữ), <strong>0 / 1 / nhiều</strong> phần tử, trạng thái <strong>vô hiệu</strong> và <strong>phân quyền</strong> (giảng viên thấy gì mà sinh viên không thấy?). Lý thuyết UX phía sau — heuristic, prototype, kiểm thử khả dụng — có ở ')}${ac('ui-ux-design', 'wdu203c-1-3-heuristics', t('WDU203c — heuristics', 'WDU203c — heuristic'))} ${t('and', 'và')} ${ac('ui-ux-design', 'wdu203c-4-2-prototyping', t('WDU203c — prototyping', 'WDU203c — prototype'))}.</p>

<h3>${t('Lab: compare the real screen with the design, by machine', 'Lab: so màn thật với thiết kế, bằng máy')}</h3>
<p>${t(
    'Eyeballing two screenshots side by side misses a 2 px difference and catches nothing about contrast. Instead, the designer’s values for screen S22 (from Dev Mode) go into a small JSON file — including the one deviation already agreed (QĐ-07) and the three states the picture did not show:',
    'Nhìn hai ảnh chụp cạnh nhau sẽ sót khác biệt 2 px và không bắt được gì về độ tương phản. Thay vào đó, các giá trị designer đưa cho màn S22 (lấy từ Dev Mode) được ghi vào một tệp JSON nhỏ — kể cả một lệch đã thống nhất (QĐ-07) và ba trạng thái mà hình không thể hiện:')}</p>
${out(MA.spec)}
<p>${t('C1’s first implementation (v1), as merged on Friday:', 'Bản cài đặt đầu tiên của C1 (v1), đã merge hôm thứ Sáu:')}</p>
${out(MA.manV1)}
<p>${t(
    'The script opens the page in real headless Chrome through the DevTools Protocol, reads the <em>computed</em> style of every element marked <code>data-k</code> (what the browser actually applied after all CSS rules, not what you think you wrote), computes the WCAG contrast ratio of text against its real background, and replays the page in the "long text", "empty" and "error" states:',
    'Script mở trang trong Chrome headless thật qua DevTools Protocol, đọc style <em>đã tính</em> của mọi phần tử có <code>data-k</code> (thứ trình duyệt thật sự áp dụng sau mọi luật CSS, không phải thứ bạn nghĩ mình đã viết), tính tỉ lệ tương phản WCAG của chữ với nền thật của nó, và chạy lại trang ở các trạng thái "chữ dài", "rỗng", "lỗi":')}</p>
${js(MA.soThietKe)}
${out('$ node so-thiet-ke.mjs man/s22-v1.html thiet-ke/spec-s22.json\n' + RA.soV1)}
<p>${t(
    'Thirteen deviations, and none of them would have been noticed in a demo on the leader’s laptop. Three kinds matter differently: the <strong>token</strong> mistakes (#2563eb instead of #1d4ed8, 22 instead of 24 px) come from hard-coding instead of using the theme; the <strong>contrast</strong> failure (2.54:1 for grey hint text, WCAG AA needs 4.5:1 for normal text) is an accessibility bug, not a taste issue; the <strong>missing states</strong> — a nowrap room name spilling out of its card, a white page when nothing is free, and "Error: 422 Unprocessable Entity at fetchRooms (rooms.js:41)" shown to students — are what users actually meet. After the fixes:',
    'Mười ba chỗ lệch, và không chỗ nào bị phát hiện trong buổi demo trên laptop của trưởng nhóm. Ba loại có tầm quan trọng khác nhau: lỗi <strong>token</strong> (#2563eb thay #1d4ed8, 22 thay 24 px) đến từ việc gõ cứng thay vì dùng theme; lỗi <strong>tương phản</strong> (chữ gợi ý xám 2,54:1, WCAG AA cần 4,5:1 cho chữ thường) là bug khả năng tiếp cận, không phải chuyện gu; các <strong>trạng thái bị thiếu</strong> — tên phòng nowrap tràn khỏi thẻ, màn trắng khi không còn phòng, và dòng "Error: 422 Unprocessable Entity at fetchRooms (rooms.js:41)" hiện cho sinh viên — mới là thứ người dùng thật sự gặp. Sau khi sửa:')}</p>
${out(RA.diffMan)}
${out('$ node so-thiet-ke.mjs man/s22-v2.html thiet-ke/spec-s22.json\n' + RA.soV2)}
${note(t(
    'Limits, honestly: the script checks the values you listed, in one viewport, in Chrome only. It does not judge layout as a whole, animation, or how the page feels. Pixel-level comparison of screenshots in CI is a different tool, covered in ',
    'Giới hạn, nói thật: script kiểm các giá trị bạn liệt kê, ở một cỡ màn, chỉ trên Chrome. Nó không đánh giá bố cục tổng thể, chuyển động, hay cảm giác dùng trang. So ảnh từng điểm ảnh trong CI là một công cụ khác, có ở ') + cs('testing', 'tst-7-4-da-trinh-duyet', t('Testing 7.4', 'Testing 7.4')) + '.')}

<h3>${t('Negotiating the expensive details', 'Thương lượng những chi tiết đắt')}</h3>
<p>${t(
    'The one remaining "≈" line is QĐ-07. The design had a custom date picker with rounded corners; C1 estimated two days to build and test it across browsers. Instead of either building it silently or replacing it silently, C1 messaged the designer:',
    'Dòng "≈" còn lại là QĐ-07. Thiết kế có bộ chọn ngày tự vẽ bo góc; C1 ước hai ngày để làm và test trên nhiều trình duyệt. Thay vì âm thầm làm hoặc âm thầm thay, C1 nhắn designer:')}</p>
${out(t(
    'S22 date field: the custom picker in Figma is about 2 days of work (keyboard, mobile, Safari). Option A: build it (S22 moves to sprint 4). Option B: use the browser’s date input — same height 44 px and colours, square corners, looks slightly different on Safari. I propose B for this iteration and a ticket for A later if users complain. OK by Friday 05/03?',
    'Ô ngày ở S22: bộ chọn tự vẽ trong Figma tốn khoảng 2 ngày (bàn phím, di động, Safari). Phương án A: làm đúng như vậy (S22 dời sang sprint 4). Phương án B: dùng ô ngày của trình duyệt — vẫn cao 44 px, đúng màu, góc vuông, trên Safari trông hơi khác. Mình đề xuất B cho iteration này và mở ticket cho A sau nếu người dùng phàn nàn. Bạn đồng ý trước thứ Sáu 05/03 được không?'))}
<p>${t(
    'Same structure as a closed question in lesson 7.2: cost, options, a proposal, a deadline. The answer becomes a decision record (QĐ-07) and the spec marks the deviation as approved, so nobody "fixes" it later and nobody blames C1 in review. Things worth negotiating: custom controls, complex animations, pixel-perfect matches across browsers. Things <em>not</em> to negotiate away: contrast, focus visible for keyboard users, touch target size, error and empty states.',
    'Cùng cấu trúc với câu hỏi đóng ở bài 7.2: chi phí, phương án, đề xuất, hạn. Câu trả lời thành một ghi chép quyết định (QĐ-07) và spec đánh dấu lệch đó là đã duyệt, để không ai "sửa" nó về sau và không ai trách C1 khi review. Đáng thương lượng: control tự vẽ, hiệu ứng phức tạp, khớp từng pixel trên mọi trình duyệt. <em>Không</em> được thương lượng bỏ: độ tương phản, viền focus cho người dùng bàn phím, kích thước vùng chạm, trạng thái lỗi và rỗng.')}</p>

<h3>${t('An SWP391 team has no designer', 'Nhóm SWP391 không có designer')}</h3>
<ul>
  <li>${t('<strong>Pick a component library on day one</strong> (MUI, Ant Design, or shadcn/ui) and use its theme for colour, spacing and typography. Five people inventing buttons produce five buttons.', '<strong>Chọn thư viện component ngay ngày đầu</strong> (MUI, Ant Design, hoặc shadcn/ui) và dùng theme của nó cho màu, khoảng cách, kiểu chữ. Năm người tự chế nút sẽ ra năm kiểu nút.')}</li>
  <li>${t('<strong>Wireframe every screen before coding</strong> — low-fidelity is enough — and review the wireframes together once. Your screen list (and LOC per person) is decided here.', '<strong>Vẽ khung (wireframe) mọi màn trước khi code</strong> — độ chi tiết thấp là đủ — và cùng duyệt một lần. Danh sách màn (và LOC mỗi người) được quyết từ đây.')}</li>
  <li>${t('<strong>One member owns the design tokens file</strong> and reviews visual PRs, the way CODEOWNERS works for code.', '<strong>Một thành viên giữ tệp design token</strong> và duyệt các PR về giao diện, giống CODEOWNERS cho mã.')}</li>
  <li>${t('<strong>Every screen ships its four states</strong>: normal, empty, loading, error. Put them in the Definition of Done.', '<strong>Mỗi màn giao đủ bốn trạng thái</strong>: bình thường, rỗng, đang tải, lỗi. Ghi vào Definition of Done.')}</li>
</ul>

<h3>⚖️ ${t('A real case: accessibility is a requirement, not decoration (Robles v. Domino’s, 2019)', 'Chuyện thật: khả năng tiếp cận là yêu cầu, không phải trang trí (Robles v. Domino’s, 2019)')}</h3>
<p>${t(
    'Guillermo Robles, who is blind, could not order a pizza on Domino’s website and app with a screen reader and sued under the Americans with Disabilities Act. On 15 January 2019 the US Ninth Circuit held that the ADA applies to Domino’s website and app; on 7 October 2019 the Supreme Court declined to review the case, leaving that ruling in place (',
    'Guillermo Robles, một người khiếm thị, không đặt được bánh pizza trên website và ứng dụng của Domino’s bằng trình đọc màn hình, và kiện theo Đạo luật Người khuyết tật Mỹ (ADA). Ngày 15/01/2019 Toà phúc thẩm Khu vực 9 kết luận ADA áp dụng cho website và ứng dụng của Domino’s; ngày 07/10/2019 Toà Tối cao từ chối xem xét lại, giữ nguyên phán quyết đó (')}${ng('https://www.supremecourt.gov/docket/docketfiles/html/public/18-1539.html', t('Supreme Court docket 18-1539', 'hồ sơ Toà Tối cao 18-1539'))}). ${t(
    'For a developer that means: contrast ratios, labels, keyboard focus and readable error messages are acceptance criteria with legal weight in many markets — exactly the lines your script turned red. US and European clients in outsourcing projects often write WCAG 2.1 AA into the contract.',
    'Với lập trình viên, điều đó có nghĩa: tỉ lệ tương phản, nhãn, focus bàn phím và thông báo lỗi đọc được là tiêu chí chấp nhận có sức nặng pháp lý ở nhiều thị trường — đúng những dòng script của bạn tô đỏ. Khách Mỹ và châu Âu trong dự án outsourcing thường ghi WCAG 2.1 AA vào hợp đồng.')}</p>

<h3>${t('At work (OJT, outsourcing)', 'Khi đi làm (OJT, outsourcing)')}</h3>
<p>${t(
    'Japanese customers often send screen designs as Excel or PowerPoint (画面設計書) with every label, size and message listed; deviations are counted as review findings (',
    'Khách Nhật thường gửi thiết kế màn hình dạng Excel hoặc PowerPoint (画面設計書) liệt kê từng nhãn, kích thước, thông báo; mỗi lệch được đếm như một lỗi review (')}${ag('agl-9-3-tai-lieu-bd-dd', t('9.3 — reading BD/DD documents', '9.3 — đọc tài liệu BD/DD'))}). ${t(
    'US product teams usually hand over Figma with a designer you can ping. In both: never change a design silently. Ask with a screenshot and a proposal, record the answer, and attach a before/after screenshot to your PR so the reviewer and the designer see the same thing.',
    'Đội sản phẩm Mỹ thường giao Figma kèm một designer bạn nhắn được. Ở cả hai: đừng bao giờ âm thầm đổi thiết kế. Hỏi kèm ảnh chụp và đề xuất, ghi lại câu trả lời, và gắn ảnh trước/sau vào PR để người review và designer cùng nhìn một thứ.')}</p>

<h3>🧪 ${t('Practice (30 minutes)', 'Thực hành (30 phút)')}</h3>
<ol>
  <li>${t('Add an element <code>nut-thu-lai</code> (the Retry button in the error state) to the spec with the same values as the primary button, and make the script measure it in the "loi" state. Which value would you have to ask the designer about?', 'Thêm phần tử <code>nut-thu-lai</code> (nút Thử lại ở trạng thái lỗi) vào spec với cùng giá trị như nút chính, và cho script đo nó ở trạng thái "loi". Giá trị nào bạn sẽ phải hỏi lại designer?')}</li>
  <li>${t('Compute by hand (or with the script’s formula) the contrast of #9ca3af on white and of #4b5563 on white. Which grey is the lightest that still passes 4.5:1?', 'Tính tay (hoặc bằng công thức trong script) tương phản của #9ca3af trên nền trắng và của #4b5563 trên nền trắng. Màu xám nhạt nhất vẫn qua 4,5:1 là màu nào?')}</li>
  <li>${t('Write the message to the designer for a deviation you want: a 60-character room name should be cut with "…" on one line instead of wrapping.', 'Viết tin nhắn gửi designer cho một lệch bạn muốn: tên phòng 60 ký tự nên cắt bằng "…" trên một dòng thay vì xuống dòng.')}</li>
</ol>
${giai(t('Hints and model answer', 'Gợi ý và đáp án mẫu'), `<p>${t(
    '1 — The script currently measures only the normal state; move the measurement loop into a function and call it with the state name. Ask the designer whether Retry is primary or secondary (it competes with nothing else on an error screen, but many systems make it secondary). 2 — #9ca3af ≈ 2.54:1 (fails), #4b5563 ≈ 7.6:1 (passes); among Tailwind’s greys #6b7280 is about 4.8:1 and is the lightest that passes. 3 — see below.',
    '1 — Script hiện chỉ đo trạng thái bình thường; tách vòng đo thành một hàm và gọi kèm tên trạng thái. Hỏi designer nút Thử lại là primary hay secondary (trên màn lỗi nó không cạnh tranh với gì, nhưng nhiều hệ thống để secondary). 2 — #9ca3af ≈ 2,54:1 (trượt), #4b5563 ≈ 7,6:1 (qua); trong dải xám của Tailwind, #6b7280 khoảng 4,8:1 và là màu nhạt nhất còn qua. 3 — xem dưới.')}</p>` + out(t(
    'S22 room name: in Figma names wrap to two lines. With real data (longest name 63 characters) cards get uneven heights and the list jumps. Proposal: one line with "…" and the full name in a tooltip and on the detail screen S21. Screenshots of both attached. If you prefer wrapping, I would cap it at 2 lines. Decision by Wed 10/03?',
    'Tên phòng ở S22: trong Figma tên xuống hai dòng. Với dữ liệu thật (tên dài nhất 63 ký tự) các thẻ cao thấp không đều và danh sách bị giật. Đề xuất: một dòng có "…", tên đầy đủ trong tooltip và ở màn chi tiết S21. Đính kèm ảnh cả hai cách. Nếu bạn thích xuống dòng, mình sẽ giới hạn tối đa 2 dòng. Chốt trước thứ Tư 10/03 nhé?')))}

${phongVan([
    [t('"How do you work with designers?"', '"Bạn làm việc với designer thế nào?"'), t('I read the design as a spec — values from Dev Mode, tokens instead of hard-coded colours, components with variants. Before starting I ask about the states the design does not show. If something is expensive I give the designer options with costs and a proposal, and we record the decision. I attach before/after screenshots to PRs.', 'Tôi đọc thiết kế như đặc tả — lấy giá trị từ Dev Mode, dùng token thay màu gõ cứng, component có biến thể. Trước khi bắt đầu tôi hỏi các trạng thái mà thiết kế không thể hiện. Nếu có gì đắt, tôi đưa designer các phương án kèm chi phí và đề xuất, rồi ghi lại quyết định. Tôi gắn ảnh trước/sau vào PR.')],
    [t('"How do you make sure the implementation matches the design?"', '"Làm sao bạn đảm bảo bản cài đặt khớp thiết kế?"'), t('Use the theme so most values cannot drift, then check computed styles and contrast automatically in a headless browser for each state. In our project that found 13 deviations on one screen, including contrast 2.54:1 and a raw error message.', 'Dùng theme để phần lớn giá trị không thể lệch, rồi kiểm style đã tính và tương phản tự động bằng trình duyệt headless cho từng trạng thái. Trong dự án của chúng tôi cách này tìm ra 13 chỗ lệch trên một màn, gồm tương phản 2,54:1 và một thông báo lỗi thô.')],
    [t('"A design is too expensive to implement. What do you do?"', '"Một thiết kế quá tốn công để làm. Bạn làm gì?"'), t('Estimate it, offer a cheaper alternative that keeps the intent, say what we lose, propose one, and let the designer or PO decide by a date. I never silently replace it.', 'Ước lượng, đưa phương án rẻ hơn mà giữ được ý đồ, nói rõ mất gì, đề xuất một phương án, và để designer hoặc PO quyết trước một hạn. Tôi không bao giờ âm thầm thay.')],
    [t('"What do you know about accessibility?"', '"Bạn biết gì về khả năng tiếp cận?"'), t('WCAG 2.1 AA as a baseline: 4.5:1 contrast for normal text, labels for inputs, visible keyboard focus, meaningful error messages. It has legal weight — Robles v. Domino’s in 2019 applied the ADA to a website and app.', 'Lấy WCAG 2.1 AA làm nền: tương phản 4,5:1 cho chữ thường, nhãn cho ô nhập, focus bàn phím nhìn thấy được, thông báo lỗi có nghĩa. Nó có sức nặng pháp lý — vụ Robles v. Domino’s năm 2019 áp ADA cho website và ứng dụng.')],
  ], en)}

${thuatNgu([
    [t('design token', 'design token'), t('A named design value (colour, spacing, font size) shared by design and code.', 'Một giá trị thiết kế có tên (màu, khoảng cách, cỡ chữ) dùng chung giữa thiết kế và mã.')],
    ['Dev Mode / Inspect', t('The view of a design tool that shows exact values for developers.', 'Chế độ của công cụ thiết kế hiện giá trị chính xác cho lập trình viên.')],
    [t('computed style', 'style đã tính'), t('The final CSS value the browser applied after all rules.', 'Giá trị CSS cuối cùng trình duyệt áp dụng sau mọi luật.')],
    [t('contrast ratio (WCAG)', 'tỉ lệ tương phản (WCAG)'), t('Luminance ratio of text and background; AA needs 4.5:1 for normal text.', 'Tỉ lệ độ sáng giữa chữ và nền; mức AA cần 4,5:1 cho chữ thường.')],
    [t('approved deviation', 'lệch đã duyệt'), t('A difference from the design agreed in writing, with a decision ID.', 'Một khác biệt so với thiết kế được thống nhất bằng văn bản, có mã quyết định.')],
  ], en)}

${tomTat([
    t('Read designs as specs: exact values, tokens, components, auto layout ≈ flexbox.', 'Đọc thiết kế như đặc tả: giá trị chính xác, token, component, auto layout ≈ flexbox.'),
    t('Ask for the states pictures do not show: empty, loading, error, long text, permissions.', 'Hỏi những trạng thái hình không cho thấy: rỗng, đang tải, lỗi, chữ dài, phân quyền.'),
    t('Check by machine: computed styles + WCAG contrast + states in headless Chrome — v1 had 13 deviations, v2 none.', 'Kiểm bằng máy: style đã tính + tương phản WCAG + các trạng thái trong Chrome headless — v1 lệch 13 chỗ, v2 không còn.'),
    t('Negotiate expensive details with cost, options and a proposal; record approved deviations (QĐ-07).', 'Thương lượng chi tiết đắt bằng chi phí, phương án và đề xuất; ghi lệch đã duyệt (QĐ-07).'),
    t('Accessibility is a requirement with legal weight (Robles v. Domino’s, 2019).', 'Khả năng tiếp cận là yêu cầu có sức nặng pháp lý (Robles v. Domino’s, 2019).'),
  ], en)}
<p>${t('Next: ', 'Bài tiếp: ')}${ag('agl-7-4-khach-hang', t('7.4 — Talking to clients and stakeholders', '7.4 — Nói chuyện với khách hàng và các bên liên quan'))}.</p>
`);
};

export default {
  title: '7.3 — Developers and designers|||7.3 — Lập trình viên và designer',
  slug: 'agl-7-3-designer',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Đọc thiết kế như đặc tả (Dev Mode, token, component, auto layout) và hỏi các trạng thái hình không cho thấy (rỗng, đang tải, lỗi, chữ dài, phân quyền); lab chạy thật so-thiet-ke.mjs mở màn S22 trong Chrome headless qua DevTools Protocol, đo style đã tính, tương phản WCAG và ba trạng thái: v1 lệch 13 chỗ (xám 2,54:1, tên phòng tràn, màn trắng, lộ "Error: 422"…) ⇒ v2 0 lệch + 1 lệch đã duyệt; thương lượng chi tiết đắt (QĐ-07 bộ chọn ngày); nhóm SWP391 không có designer; Robles v. Domino’s 2019.',
  content: L73(true) + L73(false),
};
