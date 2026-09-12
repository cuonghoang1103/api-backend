/**
 * Buổi 4 · Bài 18 — Business email & letter (21 slide).
 *
 * Bám bộ "Session 4_..._Lesson 18_Business Email _ Letter.pptx". Syllabus hỏi
 * CQ14.2 (memo khác thư ra sao) và CQ14.4 ("mười lăm phần của một bức thư
 * công việc chuẩn"). Bản Academy cũ: email chỉ một câu, chữ "letter" xuất hiện
 * 0 lần, memo chỉ nằm trong một giai thoại về Amazon.
 */
import { slide, walkHead, books, bi } from './_slides.mjs';

const D = 's4-l18';

export const b4l18 = [
  walkHead(D, 1, 21,
    'Three documents in one deck: email (13 rules), memo (internal), letter (external, 15 elements). Knowing which of the three to use is itself an exam question.',
    'Ba loại văn bản trong một bộ slide: email (13 quy tắc), memo (nội bộ), thư (đối ngoại, 15 phần). Biết chọn dùng cái nào trong ba tự nó đã là một câu hỏi thi.'),

  slide(D, 1, 'Business writing in action — Session IV',
    `<p class="y-chinh">🎯 Title slide.</p>
     <p class="meo">💡 Lesson 17 was the process of writing; this lesson is the three concrete formats that process produces.</p>`,
    `<p class="y-chinh">🎯 Slide tiêu đề.</p>
     <p class="meo">💡 Bài 17 nói về quá trình viết; bài này là ba định dạng cụ thể mà quá trình ấy tạo ra.</p>`),

  slide(D, 2, 'Learning objectives (3)',
    `<p class="y-chinh">🎯 Three objectives.</p>
     <ol>
       <li>Discuss the role of <strong>text messaging</strong> in business communication.</li>
       <li>Write effective <strong>emails</strong> for both internal and external communication.</li>
       <li>Discuss the purpose and format of a <strong>memo</strong>.</li>
     </ol>
     <p class="meo">💡 Objective 2 names the split that runs through the whole deck: internal readers and external readers need different documents.</p>`,
    `<p class="y-chinh">🎯 Ba mục tiêu.</p>
     <ol>
       <li>Bàn về vai trò của <strong>tin nhắn</strong> trong giao tiếp công việc.</li>
       <li>Viết <strong>email</strong> hiệu quả cho cả giao tiếp nội bộ lẫn đối ngoại.</li>
       <li>Bàn về mục đích và định dạng của <strong>memo</strong>.</li>
     </ol>
     <p class="meo">💡 Mục tiêu 2 gọi tên lằn ranh chạy suốt bộ slide: người đọc bên trong và người đọc bên ngoài cần hai loại văn bản khác nhau.</p>`),

  slide(D, 3, 'Email',
    `<p class="y-chinh">🎯 Electronic mail, usually called email.</p>
     <ul>
       <li>It may be used like text or synchronous chat.</li>
       <li>It can be delivered to a mobile phone.</li>
     </ul>
     <p class="meo">💡 That second line is why brevity matters: much of your email is read on a phone screen, standing up, between two other things.</p>`,
    `<p class="y-chinh">🎯 Thư điện tử, thường gọi là email.</p>
     <ul>
       <li>Nó có thể được dùng như tin nhắn hoặc như chat thời gian thực.</li>
       <li>Nó gửi tới được điện thoại di động.</li>
     </ul>
     <p class="meo">💡 Dòng thứ hai chính là lý do phải viết ngắn: phần lớn email của bạn được đọc trên màn hình điện thoại, trong lúc đứng, giữa hai việc khác.</p>`),

  slide(D, 4, 'How to write an effective email',
    `<p class="y-chinh">🎯 Divider — thirteen rules follow, on slides 5 to 10.</p>`,
    `<p class="y-chinh">🎯 Slide phân mục — mười ba quy tắc nằm ở slide 5 tới slide 10.</p>`),

  slide(D, 5, 'Rule 1 — proper salutations',
    `<p class="y-chinh">🎯 Salutations should demonstrate respect and <strong>avoid mix-ups in case a message is accidentally sent to the wrong recipient</strong>.</p>
     <p><span class="nhan">Examples from the slide</span> — "Dear Ms. X" (external) · "Hi Barry" (internal).</p>
     <p class="meo">💡 The stated reason is the interesting one: a correct salutation is a safety check. If you would be embarrassed by the greeting reaching someone else, the greeting is wrong.</p>`,
    `<p class="y-chinh">🎯 Lời chào phải thể hiện sự tôn trọng và <strong>tránh nhầm lẫn trong trường hợp thư bị gửi nhầm người</strong>.</p>
     <p><span class="nhan">Ví dụ trên slide</span> — "Dear Ms. X" (đối ngoại) · "Hi Barry" (nội bộ).</p>
     <p class="meo">💡 Lý do được nêu mới là điều thú vị: lời chào đúng là một chốt an toàn. Nếu bạn thấy ngượng khi lời chào đó tới tay người khác thì lời chào đó sai.</p>`),

  slide(D, 6, 'Rule 2 — subject lines',
    `<p class="y-chinh">🎯 Subject lines should be <strong>clear, brief and specific</strong>, helping the recipient understand the essence of the message.</p>
     <p><span class="nhan">Examples</span> — "Proposal attached" · "Your question of 10/25".</p>
     <p class="meo">💡 Both examples let the reader decide whether to open it now or later. A subject line like "Hi" or "Question" forces them to open it to find out, which is what makes it rude rather than merely vague.</p>`,
    `<p class="y-chinh">🎯 Dòng chủ đề phải <strong>rõ, ngắn và cụ thể</strong>, giúp người nhận nắm ngay cốt lõi thông điệp.</p>
     <p><span class="nhan">Ví dụ</span> — "Đã đính kèm bản đề xuất" · "Trả lời câu hỏi của anh ngày 25/10".</p>
     <p class="meo">💡 Cả hai ví dụ đều cho người đọc quyết được mở ngay hay để sau. Dòng chủ đề kiểu "Chào anh" hay "Hỏi chút" buộc họ phải mở ra mới biết, và đó là chỗ nó thành bất lịch sự chứ không chỉ là mơ hồ.</p>`),

  slide(D, 7, 'Rule 3 — close with a signature',
    `<p class="y-chinh">🎯 Identify yourself by creating a <strong>signature block</strong> that automatically contains your name and business contact information.</p>
     <p class="meo">💡 "Automatically" is the operative word: a signature you have to remember to type is a signature you will forget on the one email that needed it.</p>`,
    `<p class="y-chinh">🎯 Hãy tự giới thiệu bằng một <strong>khối chữ ký</strong> tự động chứa tên và thông tin liên hệ công việc của bạn.</p>
     <p class="meo">💡 Chữ "tự động" mới là mấu chốt: chữ ký mà bạn phải nhớ gõ tay là chữ ký bạn sẽ quên đúng vào bức email cần nó nhất.</p>`),

  slide(D, 8, 'Rules 4–5 — avoid abbreviations, be brief',
    `<p class="y-chinh">🎯 Two rules about register and length.</p>
     <ul>
       <li><span class="nhan">4. Avoid abbreviations</span> — an email is not a text message, and the audience may not find your wit cause to ROTFLOL.</li>
       <li><span class="nhan">5. Be brief</span> — omit unnecessary words.</li>
     </ul>
     <p class="meo">💡 Rule 5 is Lesson 17's style revision applied to email: cut big words, long prepositional phrases and fillers before you press send.</p>`,
    `<p class="y-chinh">🎯 Hai quy tắc về giọng điệu và độ dài.</p>
     <ul>
       <li><span class="nhan">4. Tránh viết tắt</span> — email không phải tin nhắn, và người đọc chưa chắc thấy sự dí dỏm của bạn đáng để "cười lăn lộn".</li>
       <li><span class="nhan">5. Viết ngắn</span> — bỏ những chữ không cần thiết.</li>
     </ul>
     <p class="meo">💡 Quy tắc 5 chính là phần rà văn phong của Bài 17 áp vào email: cắt chữ đao to búa lớn, cụm giới từ dài và chữ độn trước khi bấm gửi.</p>`),

  slide(D, 9, 'Rule 6 — use a good format',
    `<p class="y-chinh">🎯 Include line breaks between sentences, or divide your message into brief paragraphs for ease of reading.</p>
     <p><strong>A good email should get to the point and conclude in three small paragraphs or less.</strong></p>
     <p class="pitfall co-tieu-de"><strong>Con số cụ thể:</strong> three short paragraphs. Anything longer should probably be an attachment with a two-line email pointing at it.</p>`,
    `<p class="y-chinh">🎯 Hãy xuống dòng giữa các câu, hoặc chia thông điệp thành những đoạn ngắn cho dễ đọc.</p>
     <p><strong>Một email tốt phải vào thẳng vấn đề và kết thúc trong ba đoạn nhỏ hoặc ít hơn.</strong></p>
     <p class="pitfall co-tieu-de"><strong>Con số cụ thể:</strong> ba đoạn ngắn. Dài hơn thế thì gần như chắc chắn nên là một file đính kèm cộng với email hai dòng trỏ tới nó.</p>`),

  slide(D, 10, 'Rules 7–10',
    `<p class="y-chinh">🎯 Four rules about sending behaviour.</p>
     <ul>
       <li><span class="nhan">7. Reread, revise and review</span>.</li>
       <li><span class="nhan">8. Reply promptly</span>.</li>
       <li><span class="nhan">9. Use "Reply All" sparingly</span>.</li>
       <li><span class="nhan">10. Avoid using all caps</span>.</li>
     </ul>
     <p class="meo">💡 Rule 9 is the one with the widest blast radius: every unnecessary Reply All multiplies your mistake by the size of the recipient list.</p>`,
    `<p class="y-chinh">🎯 Bốn quy tắc về hành vi khi gửi.</p>
     <ul>
       <li><span class="nhan">7. Đọc lại, sửa lại, soát lại</span>.</li>
       <li><span class="nhan">8. Trả lời kịp thời</span>.</li>
       <li><span class="nhan">9. Dùng "Reply All" một cách dè dặt</span>.</li>
       <li><span class="nhan">10. Tránh viết toàn chữ HOA</span>.</li>
     </ul>
     <p class="meo">💡 Quy tắc 9 có bán kính sát thương rộng nhất: mỗi lần Reply All không cần thiết là nhân sai sót của bạn lên bằng số người trong danh sách nhận.</p>`),

  slide(D, 11, 'Rules 11–13',
    `<p class="y-chinh">🎯 Three rules about attachments and follow-up.</p>
     <ul>
       <li><span class="nhan">11. Test links</span> — if you include a link, check it is complete.</li>
       <li><span class="nhan">12. Email ahead of time if you are going to attach large files</span>, to avoid exceeding the recipient's mailbox limit or triggering the spam filter.</li>
       <li><span class="nhan">13. Give feedback or follow up</span>.</li>
     </ul>
     <p class="meo">💡 Rule 12 is the one nobody thinks of until a deadline submission silently bounces. If the file is large, say so first and agree a channel.</p>`,
    `<p class="y-chinh">🎯 Ba quy tắc về file đính kèm và việc theo dõi tiếp.</p>
     <ul>
       <li><span class="nhan">11. Kiểm đường dẫn</span> — có chèn link thì phải thử xem link có đầy đủ không.</li>
       <li><span class="nhan">12. Báo trước bằng email nếu bạn sắp gửi file lớn</span>, để tránh vượt dung lượng hộp thư người nhận hoặc bị bộ lọc thư rác chặn.</li>
       <li><span class="nhan">13. Phản hồi hoặc theo dõi tiếp</span>.</li>
     </ul>
     <p class="meo">💡 Quy tắc 12 là thứ chẳng ai nghĩ tới cho tới khi một bài nộp đúng hạn lặng lẽ bị trả về. File lớn thì báo trước và thống nhất kênh gửi.</p>`),

  slide(D, 12, 'Activity — rewrite a bad email',
    `<p class="y-chinh">🎯 Find an example of an email you wish you had never sent or received. Rewrite it to eliminate the problematic characteristics, and share with classmates.</p>
     <p class="meo">💡 Name which of the thirteen rules it broke before you rewrite. Most regretted emails break rule 7 (not rereading) and one other.</p>`,
    `<p class="y-chinh">🎯 Tìm một email bạn ước đã không gửi hoặc không nhận. Viết lại để loại bỏ những chỗ có vấn đề, rồi chia sẻ với bạn học.</p>
     <p class="meo">💡 Hãy gọi tên nó vi phạm quy tắc nào trong mười ba quy tắc trước khi viết lại. Phần lớn email khiến người ta hối hận đều vi phạm quy tắc 7 (không đọc lại) cộng thêm một quy tắc nữa.</p>`),

  slide(D, 13, 'Memorandums and letters — the distinction',
    `<p class="y-chinh">🎯 The definition that answers CQ14.2.</p>
     <ul>
       <li><span class="nhan">Memo</span> (memorandum, meaning "<strong>reminder</strong>") — normally used for communicating <strong>policies, procedures or related official business within an organisation</strong>.</li>
       <li><span class="nhan">Letter</span> — a brief message sent to a recipient <strong>often outside the organisation</strong>.</li>
     </ul>
     <p class="pitfall co-tieu-de"><strong>Cách nhớ:</strong> memo = inside, letter = outside. That single line decides format, salutation and tone, and it is the most likely one-mark question in this lesson.</p>`,
    `<p class="y-chinh">🎯 Định nghĩa trả lời CQ14.2.</p>
     <ul>
       <li><span class="nhan">Memo</span> (memorandum, nghĩa là "<strong>lời nhắc</strong>") — thường dùng để truyền đạt <strong>chính sách, quy trình hoặc công việc chính thức bên trong tổ chức</strong>.</li>
       <li><span class="nhan">Thư</span> — thông điệp ngắn gửi tới người nhận <strong>thường ở bên ngoài tổ chức</strong>.</li>
     </ul>
     <p class="pitfall co-tieu-de"><strong>Cách nhớ:</strong> memo = bên trong, thư = bên ngoài. Đúng một dòng đó quyết định định dạng, lời chào và giọng văn, và là câu hỏi một điểm dễ ra nhất của bài này.</p>`),

  slide(D, 14, 'Memo format',
    `<p class="y-chinh">🎯 The four-line heading every memo uses.</p>
     <ul>
       <li><span class="nhan">To:</span></li>
       <li><span class="nhan">From:</span></li>
       <li><span class="nhan">Date:</span></li>
       <li><span class="nhan">Subject:</span></li>
     </ul>
     <p>The writer <strong>signs or writes initials near the keyed name</strong> in the heading.</p>
     <p class="meo">💡 Note what a memo has no room for: a greeting and a sign-off. That absence is the format saying "this is internal business, not correspondence".</p>`,
    `<p class="y-chinh">🎯 Bốn dòng đầu đề mà memo nào cũng dùng.</p>
     <ul>
       <li><span class="nhan">Kính gửi (To):</span></li>
       <li><span class="nhan">Người gửi (From):</span></li>
       <li><span class="nhan">Ngày (Date):</span></li>
       <li><span class="nhan">Về việc (Subject):</span></li>
     </ul>
     <p>Người viết <strong>ký hoặc viết tắt tên mình cạnh phần tên đã đánh máy</strong> trong đầu đề.</p>
     <p class="meo">💡 Để ý memo không có chỗ cho lời chào mở đầu và lời chào kết. Chính sự vắng mặt đó là cách định dạng nói rằng "đây là việc nội bộ, không phải thư từ".</p>`),

  slide(D, 15, 'How to write effective business memos (5)',
    `<p class="y-chinh">🎯 Five qualities.</p>
     <ol>
       <li><span class="nhan">Audience orientation</span></li>
       <li><span class="nhan">Professional, formal tone</span></li>
       <li><span class="nhan">Subject emphasis</span></li>
       <li><span class="nhan">Direct format</span></li>
       <li><span class="nhan">Objectivity</span></li>
     </ol>
     <p class="meo">💡 "Direct format" means the main point comes first, not last. A memo that builds to its conclusion has buried the thing the reader needed.</p>`,
    `<p class="y-chinh">🎯 Năm phẩm chất.</p>
     <ol>
       <li><span class="nhan">Hướng về người đọc</span></li>
       <li><span class="nhan">Giọng chuyên nghiệp, trang trọng</span></li>
       <li><span class="nhan">Làm nổi chủ đề</span></li>
       <li><span class="nhan">Bố cục trực tiếp</span></li>
       <li><span class="nhan">Khách quan</span></li>
     </ol>
     <p class="meo">💡 "Bố cục trực tiếp" nghĩa là ý chính đứng đầu, không đứng cuối. Memo mà dẫn dắt dần tới kết luận là đã chôn mất thứ người đọc cần.</p>`),

  slide(D, 16, 'Fifteen elements of a business letter',
    `<p class="y-chinh">🎯 The list CQ14.4 asks for.</p>
     <ol class="hai-cot">
       <li>Return address</li>
       <li>Date</li>
       <li>Reference (Re:)</li>
       <li>Delivery (optional)</li>
       <li>Recipient note (optional)</li>
       <li>Salutation</li>
       <li>Introduction</li>
       <li>Body</li>
       <li>Conclusion</li>
       <li>Close</li>
       <li>Signature</li>
       <li>Preparation line</li>
       <li>Enclosures / attachments</li>
       <li>Courtesy copies ("CC")</li>
       <li>Logo / contact information</li>
     </ol>
     <p class="meo">💡 Two are marked optional (4 and 5). The other thirteen are expected, which is why a letter looks so much more formal than an email carrying the same message.</p>`,
    `<p class="y-chinh">🎯 Danh sách mà CQ14.4 hỏi tới.</p>
     <ol class="hai-cot">
       <li>Địa chỉ người gửi</li>
       <li>Ngày tháng</li>
       <li>Trích yếu (Re:)</li>
       <li>Hình thức chuyển phát (tuỳ chọn)</li>
       <li>Ghi chú cho người nhận (tuỳ chọn)</li>
       <li>Lời chào mở đầu</li>
       <li>Mở bài</li>
       <li>Thân bài</li>
       <li>Kết luận</li>
       <li>Lời chào kết</li>
       <li>Chữ ký</li>
       <li>Dòng ghi người soạn</li>
       <li>Tài liệu đính kèm</li>
       <li>Bản sao gửi kèm ("CC")</li>
       <li>Logo / thông tin liên hệ</li>
     </ol>
     <p class="meo">💡 Hai mục được đánh dấu tuỳ chọn (4 và 5). Mười ba mục còn lại là bắt buộc, và đó là lý do một bức thư trông trang trọng hơn hẳn email chở cùng nội dung.</p>`),

  slide(D, 17, 'Strategies for effective letters — the five areas',
    `<p class="y-chinh">🎯 Remember that a letter has five main areas.</p>
     <ol>
       <li><span class="nhan">The heading</span> — establishes the sender, often including address and date.</li>
       <li><span class="nhan">The introduction</span> — establishes the purpose.</li>
       <li><span class="nhan">The body</span> — articulates the message.</li>
       <li><span class="nhan">The conclusion</span> — restates the main point and may include a <strong>call to action</strong>.</li>
       <li><span class="nhan">The signature line</span> — sometimes includes contact information.</li>
     </ol>
     <p class="meo">💡 Fifteen elements, five areas: the elements are what goes on the page, the areas are what the reader experiences. Learn both — they answer different questions.</p>`,
    `<p class="y-chinh">🎯 Nhớ rằng một bức thư có năm vùng chính.</p>
     <ol>
       <li><span class="nhan">Phần đầu thư</span> — xác lập người gửi, thường gồm địa chỉ và ngày tháng.</li>
       <li><span class="nhan">Phần mở</span> — xác lập mục đích.</li>
       <li><span class="nhan">Phần thân</span> — trình bày thông điệp.</li>
       <li><span class="nhan">Phần kết</span> — nhắc lại ý chính và có thể kèm <strong>lời kêu gọi hành động</strong>.</li>
       <li><span class="nhan">Dòng chữ ký</span> — đôi khi kèm thông tin liên hệ.</li>
     </ol>
     <p class="meo">💡 Mười lăm thành phần, năm vùng: thành phần là thứ nằm trên trang giấy, còn vùng là thứ người đọc trải nghiệm. Học cả hai — chúng trả lời hai câu hỏi khác nhau.</p>`),

  slide(D, 18, 'To communicate effectively and project a positive image',
    `<p class="y-chinh">🎯 Five requirements, and they apply to all three document types in this lesson.</p>
     <ul>
       <li>Be <strong>clear, concise, specific and respectful</strong>.</li>
       <li><strong>Each word</strong> should contribute to your purpose.</li>
       <li><strong>Each paragraph</strong> should focus on one idea.</li>
       <li>The parts of the letter should form a <strong>complete message</strong>.</li>
       <li>The letter should be <strong>free of errors</strong>.</li>
     </ul>
     <p class="meo">💡 "Each paragraph one idea" is the most testable of the five: run your finger down your draft and name each paragraph's idea. Any paragraph you cannot name needs splitting or cutting.</p>`,
    `<p class="y-chinh">🎯 Năm yêu cầu, và chúng áp dụng cho cả ba loại văn bản trong bài này.</p>
     <ul>
       <li>Phải <strong>rõ, gọn, cụ thể và tôn trọng</strong>.</li>
       <li><strong>Mỗi chữ</strong> phải đóng góp cho mục đích của bạn.</li>
       <li><strong>Mỗi đoạn</strong> chỉ tập trung vào một ý.</li>
       <li>Các phần của bức thư phải hợp thành một <strong>thông điệp trọn vẹn</strong>.</li>
       <li>Bức thư phải <strong>không có lỗi</strong>.</li>
     </ul>
     <p class="meo">💡 "Mỗi đoạn một ý" là điều dễ kiểm nhất trong năm: rà tay dọc bản nháp và gọi tên ý của từng đoạn. Đoạn nào bạn không gọi được tên thì phải tách ra hoặc cắt bỏ.</p>`),

  slide(D, 19, 'Exercise 1 — draft a letter introducing a product',
    `<p class="y-chinh">🎯 Create a draft letter introducing a product or service to a new client. Post and share with classmates.</p>
     <p class="meo">💡 A new client is an <em>external</em> reader, so this is a letter, not a memo — and it needs the full fifteen elements plus a call to action in the conclusion.</p>`,
    `<p class="y-chinh">🎯 Soạn bản nháp một bức thư giới thiệu sản phẩm hoặc dịch vụ tới khách hàng mới. Đăng lên và chia sẻ với bạn học.</p>
     <p class="meo">💡 Khách hàng mới là người đọc <em>bên ngoài</em>, nên đây là thư chứ không phải memo — và nó cần đủ mười lăm thành phần cộng với lời kêu gọi hành động ở phần kết.</p>`),

  slide(D, 20, 'Exercise 2 — write a memo about a holiday',
    `<p class="y-chinh">🎯 Write a memo informing your class that an upcoming holiday will be observed. Post and share with classmates.</p>
     <p class="meo">💡 Your class is an <em>internal</em> audience, so this is a memo: four-line heading, direct format, main point first. Comparing the two exercises side by side is the point of setting both.</p>`,
    `<p class="y-chinh">🎯 Viết một memo thông báo cho lớp về một kỳ nghỉ lễ sắp tới. Đăng lên và chia sẻ với bạn học.</p>
     <p class="meo">💡 Lớp của bạn là người đọc <em>nội bộ</em>, nên đây là memo: đầu đề bốn dòng, bố cục trực tiếp, ý chính lên trước. Đặt hai bài tập cạnh nhau để so sánh chính là dụng ý của đề bài.</p>`),

  slide(D, 21, 'End of Lesson 18',
    `<p class="y-chinh">🎯 Closing slide.</p>
     <p><span class="nhan">Self-check</span></p>
     <ol>
       <li>Memo or letter — which is internal and which is external?</li>
       <li>How many paragraphs should a good email have?</li>
       <li>The four lines of a memo heading?</li>
       <li>Five main areas of a letter, ending with what in the conclusion?</li>
     </ol>`,
    `<p class="y-chinh">🎯 Slide kết.</p>
     <p><span class="nhan">Tự kiểm</span></p>
     <ol>
       <li>Memo hay thư — cái nào nội bộ, cái nào đối ngoại?</li>
       <li>Một email tốt nên có mấy đoạn?</li>
       <li>Bốn dòng đầu đề của memo?</li>
       <li>Năm vùng chính của bức thư, phần kết nên có gì?</li>
     </ol>`),

  books([
    ['bcs', 'chương Business Writing in Action — email, memo, letter', 'chương Business Writing in Action — email, memo, thư'],
    ['bc7', 'chương về correspondence: memos và letters', 'chương về thư từ công việc: memo và thư'],
  ]),

  bi(
    `<h3>✅ What was missing here</h3>
     <p>The syllabus asks CQ14.2 (memos vs letters) and CQ14.4 (the fifteen parts of a standard business letter). In the old Academy course, email was one sentence, "letter" appeared zero times, and memos existed only inside an anecdote about Amazon.</p>`,
    `<h3>✅ Chỗ này trước đây thiếu gì</h3>
     <p>Syllabus hỏi CQ14.2 (memo khác thư) và CQ14.4 (mười lăm phần của một bức thư công việc chuẩn). Ở khoá Academy cũ, email chỉ được một câu, chữ "letter" xuất hiện 0 lần, còn memo chỉ tồn tại trong một giai thoại về Amazon.</p>`),
].join('\n');
