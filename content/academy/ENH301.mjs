/**
 * ENH301 — Business English for Hospitality (Intermediate). Giáo trình tham
 * khảo: "English for International Tourism" (Pearson Longman), "Highly
 * Recommended - English for the Hotel and Catering Industry" (OUP), "Hotel &
 * Hospitality English". 8 chương giao tiếp ngành khách sạn, song ngữ.
 * Giữ NGUYÊN slug/semester/thumb(v3). ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('enh301-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình tham khảo (Pearson, OUP), tài liệu chính thức miễn phí, YouTube, công cụ, lộ trình tự học.',
  [[
    `<span class="eyebrow">ENH301 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn <strong>Business English for Hospitality</strong> — greeting guests, reservations, hotel facilities, complaints, restaurant service, directions, phone/email etiquette, and check-out/billing — in one place.</p>
<h3>📘 Reference textbooks</h3>
<ul>
<li><em>English for International Tourism</em> (Intermediate) — Pearson Longman.</li>
<li><em>Highly Recommended — English for the Hotel and Catering Industry</em> — Oxford University Press (OUP).</li>
<li><em>Hotel &amp; Hospitality English</em> — industry phrasebook / coursebook.</li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://www.britishcouncil.org/" target="_blank" rel="noopener">British Council — Learn English for Work</a></li>
<li><a href="https://www.bbc.co.uk/learningenglish" target="_blank" rel="noopener">BBC Learning English</a> — business &amp; everyday English, free audio</li>
<li><a href="https://www.cambridgeenglish.org/" target="_blank" rel="noopener">Cambridge English</a> — vocabulary lists &amp; practice</li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@BusinessEnglishPod" target="_blank" rel="noopener">Business English Pod</a> — workplace &amp; service English lessons</li>
<li><a href="https://www.youtube.com/@EnglishwithLucy" target="_blank" rel="noopener">English with Lucy</a> — pronunciation &amp; everyday phrases</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://www.oxfordlearnersdictionaries.com/" target="_blank" rel="noopener">Oxford Learner's Dictionaries</a> — definitions &amp; audio pronunciation</li>
<li><a href="https://www.deepl.com/translator" target="_blank" rel="noopener">DeepL</a> — check translations of guest requests</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Core service phrases</strong> — greetings, check-in/out, polite requests.</li>
<li><strong>Practice</strong> — read dialogues aloud, role-play guest/staff with a partner.</li>
<li><strong>Go deeper</strong> — complaints, food &amp; beverage vocabulary, phone/email etiquette.</li>
<li><strong>Job-ready</strong> — mock front-desk and restaurant shifts, timed responses.</li>
</ol></div>`,
    `<span class="eyebrow">ENH301 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học <strong>Tiếng Anh thương mại ngành Khách sạn</strong> — chào khách, đặt phòng, tiện nghi khách sạn, xử lý phàn nàn, phục vụ nhà hàng, chỉ đường, giao tiếp điện thoại/email, và thanh toán/tạm biệt — gom về một chỗ.</p>
<h3>📘 Giáo trình tham khảo</h3>
<ul>
<li><em>English for International Tourism</em> (Intermediate) — Pearson Longman.</li>
<li><em>Highly Recommended — English for the Hotel and Catering Industry</em> — Oxford University Press (OUP).</li>
<li><em>Hotel &amp; Hospitality English</em> — sách cụm từ / giáo trình ngành.</li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://www.britishcouncil.org/" target="_blank" rel="noopener">British Council — Learn English for Work</a></li>
<li><a href="https://www.bbc.co.uk/learningenglish" target="_blank" rel="noopener">BBC Learning English</a> — tiếng Anh thương mại &amp; đời thường, audio miễn phí</li>
<li><a href="https://www.cambridgeenglish.org/" target="_blank" rel="noopener">Cambridge English</a> — danh sách từ vựng &amp; luyện tập</li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@BusinessEnglishPod" target="_blank" rel="noopener">Business English Pod</a> — bài học tiếng Anh công việc &amp; dịch vụ</li>
<li><a href="https://www.youtube.com/@EnglishwithLucy" target="_blank" rel="noopener">English with Lucy</a> — phát âm &amp; cụm từ đời thường</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://www.oxfordlearnersdictionaries.com/" target="_blank" rel="noopener">Oxford Learner's Dictionaries</a> — định nghĩa &amp; audio phát âm</li>
<li><a href="https://www.deepl.com/translator" target="_blank" rel="noopener">DeepL</a> — đối chiếu bản dịch yêu cầu của khách</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Cụm từ dịch vụ lõi</strong> — chào hỏi, check-in/out, yêu cầu lịch sự.</li>
<li><strong>Luyện tập</strong> — đọc to hội thoại, đóng vai khách/nhân viên với bạn học.</li>
<li><strong>Đào sâu</strong> — phàn nàn, từ vựng ẩm thực, giao tiếp điện thoại/email.</li>
<li><strong>Sẵn sàng đi làm</strong> — mô phỏng ca làm ở lễ tân và nhà hàng, phản xạ nhanh.</li>
</ol></div>`,
  ]]);

const intro = doc('enh301-0-1-overview', 'Course overview: Business English for Hospitality|||Tổng quan: Tiếng Anh thương mại ngành Khách sạn',
  'Vai trò tiếng Anh trong ngành khách sạn; nguyên tắc giao tiếp với khách (lịch sự, rõ ràng, chủ động); lộ trình 8 chương từ chào khách đến tạm biệt.',
  [[
    `<span class="eyebrow">ENH301 · Lesson 0.1 · Overview</span>
<h2>Business English for Hospitality</h2>
<p class="lead">This course builds the <strong>practical English</strong> a hotel or restaurant employee uses every shift: greeting guests, taking reservations, checking guests in and out, explaining facilities, handling requests and complaints, serving food, giving directions, and communicating by phone and email.</p>
<h3>Three golden rules of guest communication</h3>
<ul>
<li><strong>Be polite</strong> — use softening language: "Could you...", "Would you mind...", "I'm afraid...".</li>
<li><strong>Be clear</strong> — short sentences, confirm details by repeating them back ("So that's a double room for two nights, checking in on the 12th?").</li>
<li><strong>Be proactive</strong> — offer help before being asked, apologize and offer a solution when something goes wrong.</li>
</ul>
<h3>Roadmap (8 chapters)</h3>
<p>Welcoming &amp; greeting guests → Reservations &amp; check-in → Hotel facilities &amp; room service → Handling requests &amp; complaints → Restaurant &amp; food service English → Giving directions &amp; local information → Telephone &amp; email etiquette → Check-out, billing &amp; farewell.</p>`,
    `<span class="eyebrow">ENH301 · Bài 0.1 · Tổng quan</span>
<h2>Tiếng Anh thương mại ngành Khách sạn</h2>
<p class="lead">Môn này xây <strong>tiếng Anh thực dụng</strong> mà một nhân viên khách sạn hoặc nhà hàng dùng mỗi ca làm: chào khách, nhận đặt phòng, làm thủ tục nhận/trả phòng, giới thiệu tiện nghi, xử lý yêu cầu và phàn nàn, phục vụ món ăn, chỉ đường, và giao tiếp qua điện thoại/email.</p>
<h3>Ba nguyên tắc vàng khi giao tiếp với khách</h3>
<ul>
<li><strong>Lịch sự</strong> — dùng ngôn ngữ giảm nhẹ: "Could you...", "Would you mind...", "I'm afraid...".</li>
<li><strong>Rõ ràng</strong> — câu ngắn, xác nhận thông tin bằng cách lặp lại ("So that's a double room for two nights, checking in on the 12th?").</li>
<li><strong>Chủ động</strong> — đề nghị giúp trước khi được hỏi, xin lỗi và đưa giải pháp khi có sự cố.</li>
</ul>
<h3>Lộ trình (8 chương)</h3>
<p>Chào &amp; đón khách → Đặt phòng &amp; nhận phòng → Tiện nghi &amp; dịch vụ phòng → Xử lý yêu cầu &amp; phàn nàn → Tiếng Anh nhà hàng &amp; phục vụ ăn uống → Chỉ đường &amp; thông tin địa phương → Giao tiếp điện thoại &amp; email → Trả phòng, thanh toán &amp; tạm biệt.</p>`,
  ]]);

// ---------- Chapter 1: Welcoming & greeting guests ----------
const c1 = doc('enh301-1-1-welcoming-guests', '1.1 — Welcoming & greeting guests|||1.1 — Chào & đón khách',
  'Từ vựng chào đón, mẫu câu chào hỏi trang trọng, hội thoại lễ tân đón khách, ngữ pháp: câu hỏi lịch sự với "Could/Would/May".',
  [[
    `<span class="eyebrow">ENH301 · Chapter 1 · Lesson 1.1</span>
<h2>Welcoming &amp; greeting guests</h2>
<h3>Target vocabulary</h3>
<pre><code>lobby        - sảnh khách sạn
concierge    - nhân viên hỗ trợ khách (đặt tour, taxi...)
front desk   - lễ tân
porter/bellhop - nhân viên khuân hành lý
welcome drink - đồ uống chào mừng
loyalty member - khách hàng thân thiết
</code></pre>
<h3>Useful phrases</h3>
<ul>
<li>"Good morning/afternoon/evening, welcome to [hotel name]."</li>
<li>"How may I help you today?"</li>
<li>"May I take your bag(s), sir/madam?"</li>
<li>"Please, right this way." / "Right this way, please."</li>
<li>"Is this your first time staying with us?"</li>
</ul>
<h3>Sample dialogue</h3>
<pre><code>Receptionist: Good afternoon, welcome to Riverside Hotel. How may I help you?
Guest:        Hi, I have a reservation under the name Nguyen.
Receptionist: Let me check... Yes, Mr. Nguyen, a deluxe room for
              three nights. Welcome! May I take your bags?
Guest:        Thank you, that would be great.
Receptionist: Of course. Right this way, please.
</code></pre>
<h3>Grammar focus — Polite questions with Could/Would/May</h3>
<p>Use <strong>Could/Would/May I...?</strong> instead of direct commands to sound polite and professional:</p>
<ul>
<li><em>Direct (too blunt):</em> "Give me your passport." → <em>Polite:</em> "Could I see your passport, please?"</li>
<li><em>Direct:</em> "Wait here." → <em>Polite:</em> "Would you mind waiting here for a moment?"</li>
<li><em>Direct:</em> "Take your bag." → <em>Polite:</em> "May I take your bag for you?"</li>
</ul>
<div class="callout"><span class="badge">First impression</span> The first 30 seconds set the tone for the whole stay — a warm greeting, eye contact, and the guest's name (if known) go a long way.</div>`,
    `<span class="eyebrow">ENH301 · Chương 1 · Bài 1.1</span>
<h2>Chào &amp; đón khách</h2>
<h3>Từ vựng trọng tâm</h3>
<pre><code>lobby        - sảnh khách sạn
concierge    - nhân viên hỗ trợ khách (đặt tour, taxi...)
front desk   - lễ tân
porter/bellhop - nhân viên khuân hành lý
welcome drink - đồ uống chào mừng
loyalty member - khách hàng thân thiết
</code></pre>
<h3>Mẫu câu hữu ích</h3>
<ul>
<li>"Good morning/afternoon/evening, welcome to [hotel name]." — Chào mừng đến [tên khách sạn].</li>
<li>"How may I help you today?" — Tôi có thể giúp gì cho quý khách hôm nay?</li>
<li>"May I take your bag(s), sir/madam?" — Tôi mang hành lý giúp quý khách được không?</li>
<li>"Please, right this way." — Xin mời đi hướng này.</li>
<li>"Is this your first time staying with us?" — Đây có phải lần đầu quý khách lưu trú tại đây?</li>
</ul>
<h3>Hội thoại mẫu</h3>
<pre><code>Lễ tân: Good afternoon, welcome to Riverside Hotel. How may I help you?
Khách:  Hi, I have a reservation under the name Nguyen.
Lễ tân: Let me check... Yes, Mr. Nguyen, a deluxe room for
        three nights. Welcome! May I take your bags?
Khách:  Thank you, that would be great.
Lễ tân: Of course. Right this way, please.
</code></pre>
<h3>Ngữ pháp — Câu hỏi lịch sự với Could/Would/May</h3>
<p>Dùng <strong>Could/Would/May I...?</strong> thay cho câu ra lệnh trực tiếp để nghe lịch sự và chuyên nghiệp hơn:</p>
<ul>
<li><em>Trực tiếp (quá thẳng):</em> "Give me your passport." → <em>Lịch sự:</em> "Could I see your passport, please?"</li>
<li><em>Trực tiếp:</em> "Wait here." → <em>Lịch sự:</em> "Would you mind waiting here for a moment?"</li>
<li><em>Trực tiếp:</em> "Take your bag." → <em>Lịch sự:</em> "May I take your bag for you?"</li>
</ul>
<div class="callout"><span class="badge">Ấn tượng đầu tiên</span> 30 giây đầu tiên định hình cả kỳ nghỉ — lời chào ấm áp, giao tiếp mắt, và gọi tên khách (nếu biết) tạo hiệu ứng rất lớn.</div>`,
  ]]);

const c1q = quiz('enh301-quiz-1', 'Quiz 1 — Welcoming guests|||Quiz 1 — Chào & đón khách', [
  { id: 'q1', question: 'Câu nào lịch sự nhất khi muốn xin xem hộ chiếu của khách?', options: ['Give me your passport.', 'Passport now.', 'Could I see your passport, please?', 'Passport?'], correctIndex: 2, explanation: '"Could I...please?" là cách hỏi lịch sự, chuẩn dịch vụ khách sạn.' },
  { id: 'q2', question: '"Concierge" là nhân viên phụ trách việc gì?', options: ['Nấu ăn trong bếp', 'Hỗ trợ khách đặt tour, taxi, thông tin', 'Dọn phòng', 'Kế toán khách sạn'], correctIndex: 1, explanation: 'Concierge hỗ trợ các dịch vụ ngoài lưu trú như đặt tour, taxi, đặt bàn.' },
  { id: 'q3', question: '"Would you mind waiting here for a moment?" có nghĩa gần nhất với?', options: ['Đứng yên!', 'Quý khách có thể vui lòng chờ ở đây một chút được không?', 'Không được chờ ở đây.', 'Khách phải đi ngay.'], correctIndex: 1, explanation: '"Would you mind + V-ing?" là cách yêu cầu lịch sự, không phải câu lệnh.' },
]);

// ---------- Chapter 2: Reservations & check-in ----------
const c2 = doc('enh301-2-1-reservations-checkin', '2.1 — Reservations & check-in|||2.1 — Đặt phòng & nhận phòng',
  'Từ vựng loại phòng/đặt phòng, mẫu câu nhận đặt phòng qua điện thoại, hội thoại check-in, ngữ pháp: thì tương lai cho xác nhận lịch trình.',
  [[
    `<span class="eyebrow">ENH301 · Chapter 2 · Lesson 2.1</span>
<h2>Reservations &amp; check-in</h2>
<h3>Target vocabulary</h3>
<pre><code>single/double/twin room - phòng đơn/đôi (1 giường lớn)/đôi (2 giường)
suite         - phòng hạng sang
vacancy       - phòng trống
fully booked  - hết phòng
confirmation number - mã xác nhận đặt phòng
check-in/check-out time - giờ nhận/trả phòng
deposit       - tiền đặt cọc
</code></pre>
<h3>Useful phrases</h3>
<ul>
<li>"I'd like to book a room for [dates]."</li>
<li>"Could you confirm the check-in and check-out times?"</li>
<li>"I'm sorry, we're fully booked on those dates."</li>
<li>"Could I have your name and a contact number, please?"</li>
<li>"You'll need to leave a deposit / a credit card for the room."</li>
</ul>
<h3>Sample dialogue</h3>
<pre><code>Guest: Hello, I'd like to book a double room for two nights,
       from the 20th to the 22nd of this month.
Staff: Let me check availability... Yes, we have a double room
       available. May I have your name, please?
Guest: It's Tran Thi Mai.
Staff: Thank you, Ms. Tran. Could I also get a phone number and
       a credit card to secure the booking?
Guest: Sure, here you go.
Staff: Perfect, your confirmation number is HT-4821. Check-in is
       from 2 PM, check-out is by 12 noon.
</code></pre>
<h3>Grammar focus — Future forms for confirming plans</h3>
<p>Use <strong>will</strong> for promises/offers, <strong>be going to</strong> for plans, and the <strong>present continuous</strong> for fixed arrangements:</p>
<ul>
<li>"I'll send you a confirmation email." (offer)</li>
<li>"We're going to renovate the pool next month." (plan)</li>
<li>"Mr. Smith is arriving at 3 PM tomorrow." (fixed arrangement)</li>
</ul>
<div class="callout"><span class="badge">Always confirm</span> Repeat back dates, room type, and number of guests before ending the call — misheard dates are the #1 cause of reservation disputes.</div>`,
    `<span class="eyebrow">ENH301 · Chương 2 · Bài 2.1</span>
<h2>Đặt phòng &amp; nhận phòng</h2>
<h3>Từ vựng trọng tâm</h3>
<pre><code>single/double/twin room - phòng đơn/đôi (1 giường lớn)/đôi (2 giường)
suite         - phòng hạng sang
vacancy       - phòng trống
fully booked  - hết phòng
confirmation number - mã xác nhận đặt phòng
check-in/check-out time - giờ nhận/trả phòng
deposit       - tiền đặt cọc
</code></pre>
<h3>Mẫu câu hữu ích</h3>
<ul>
<li>"I'd like to book a room for [dates]." — Tôi muốn đặt phòng cho [ngày].</li>
<li>"Could you confirm the check-in and check-out times?" — Xin xác nhận giờ nhận/trả phòng.</li>
<li>"I'm sorry, we're fully booked on those dates." — Xin lỗi, những ngày đó đã hết phòng.</li>
<li>"Could I have your name and a contact number, please?" — Xin cho biết tên và số liên hệ.</li>
<li>"You'll need to leave a deposit / a credit card for the room." — Quý khách cần đặt cọc / để lại thẻ tín dụng.</li>
</ul>
<h3>Hội thoại mẫu</h3>
<pre><code>Khách:     Hello, I'd like to book a double room for two nights,
           from the 20th to the 22nd of this month.
Nhân viên: Let me check availability... Yes, we have a double room
           available. May I have your name, please?
Khách:     It's Tran Thi Mai.
Nhân viên: Thank you, Ms. Tran. Could I also get a phone number and
           a credit card to secure the booking?
Khách:     Sure, here you go.
Nhân viên: Perfect, your confirmation number is HT-4821. Check-in is
           from 2 PM, check-out is by 12 noon.
</code></pre>
<h3>Ngữ pháp — Các thì tương lai để xác nhận lịch trình</h3>
<p>Dùng <strong>will</strong> cho lời hứa/đề nghị, <strong>be going to</strong> cho kế hoạch, và <strong>hiện tại tiếp diễn</strong> cho lịch trình đã cố định:</p>
<ul>
<li>"I'll send you a confirmation email." (lời đề nghị)</li>
<li>"We're going to renovate the pool next month." (kế hoạch)</li>
<li>"Mr. Smith is arriving at 3 PM tomorrow." (lịch trình cố định)</li>
</ul>
<div class="callout"><span class="badge">Luôn xác nhận lại</span> Lặp lại ngày, loại phòng, số khách trước khi kết thúc cuộc gọi — nghe nhầm ngày là nguyên nhân số một gây tranh chấp đặt phòng.</div>`,
  ]]);

const c2q = quiz('enh301-quiz-2', 'Quiz 2 — Reservations & check-in|||Quiz 2 — Đặt phòng & nhận phòng', [
  { id: 'q1', question: '"Fully booked" nghĩa là gì?', options: ['Còn nhiều phòng trống', 'Hết phòng, không còn chỗ', 'Phòng đang sửa chữa', 'Phòng đã được dọn xong'], correctIndex: 1, explanation: '"Fully booked" = đã hết phòng cho khoảng thời gian đó.' },
  { id: 'q2', question: 'Câu nào đúng ngữ pháp để nói về lịch trình CỐ ĐỊNH của khách?', options: ['Mr. Smith arrive at 3 PM tomorrow.', 'Mr. Smith is arriving at 3 PM tomorrow.', 'Mr. Smith arrived at 3 PM tomorrow.', 'Mr. Smith will arrived at 3 PM.'], correctIndex: 1, explanation: 'Hiện tại tiếp diễn diễn tả lịch trình/kế hoạch đã sắp xếp trước.' },
  { id: 'q3', question: '"Confirmation number" dùng để làm gì?', options: ['Số phòng của khách', 'Mã xác nhận đặt phòng để tra cứu lại', 'Số điện thoại lễ tân', 'Mã thẻ tín dụng'], correctIndex: 1, explanation: 'Confirmation number giúp khách/nhân viên tra lại thông tin đặt phòng.' },
]);

// ---------- Chapter 3: Hotel facilities & room service ----------
const c3 = doc('enh301-3-1-facilities-room-service', '3.1 — Hotel facilities & room service|||3.1 — Tiện nghi khách sạn & dịch vụ phòng',
  'Từ vựng tiện nghi khách sạn, mẫu câu giới thiệu tiện nghi, hội thoại gọi dịch vụ phòng, ngữ pháp: giới từ chỉ vị trí & giờ mở/đóng.',
  [[
    `<span class="eyebrow">ENH301 · Chapter 3 · Lesson 3.1</span>
<h2>Hotel facilities &amp; room service</h2>
<h3>Target vocabulary</h3>
<pre><code>gym/fitness center - phòng gym
rooftop bar   - quán bar trên tầng cao
spa           - spa
laundry service - dịch vụ giặt ủi
room service  - dịch vụ phòng
minibar       - tủ lạnh mini trong phòng
Wi-Fi password - mật khẩu Wi-Fi
housekeeping  - bộ phận dọn phòng
</code></pre>
<h3>Useful phrases</h3>
<ul>
<li>"The gym is open from 6 AM to 10 PM, located on the 2nd floor."</li>
<li>"You can reach room service by dialing 9 from your room phone."</li>
<li>"Breakfast is served in the restaurant from 6:30 to 10:30."</li>
<li>"Would you like anything sent up to your room?"</li>
<li>"Is there anything else I can help you with?"</li>
</ul>
<h3>Sample dialogue</h3>
<pre><code>Guest (calling): Hi, this is room 508. Could I order some food, please?
Room service:    Of course. What would you like?
Guest:           I'd like a club sandwich and a bottle of water.
Room service:    Certainly. That will be ready in about 20 minutes.
                 Is there anything else?
Guest:           No, that's all, thank you.
</code></pre>
<h3>Grammar focus — Prepositions of place & time</h3>
<p>Facility descriptions rely on precise prepositions:</p>
<ul>
<li><strong>on</strong> the 2nd floor / <strong>in</strong> the lobby / <strong>next to</strong> the elevator</li>
<li><strong>from</strong> 6 AM <strong>to</strong> 10 PM / open <strong>until</strong> midnight</li>
</ul>
<div class="callout"><span class="badge">Anticipate needs</span> Mention facilities the guest didn't ask about (Wi-Fi password, breakfast hours) — it prevents a second call and feels attentive.</div>`,
    `<span class="eyebrow">ENH301 · Chương 3 · Bài 3.1</span>
<h2>Tiện nghi khách sạn &amp; dịch vụ phòng</h2>
<h3>Từ vựng trọng tâm</h3>
<pre><code>gym/fitness center - phòng gym
rooftop bar   - quán bar trên tầng cao
spa           - spa
laundry service - dịch vụ giặt ủi
room service  - dịch vụ phòng
minibar       - tủ lạnh mini trong phòng
Wi-Fi password - mật khẩu Wi-Fi
housekeeping  - bộ phận dọn phòng
</code></pre>
<h3>Mẫu câu hữu ích</h3>
<ul>
<li>"The gym is open from 6 AM to 10 PM, located on the 2nd floor." — Phòng gym mở 6h-22h, ở tầng 2.</li>
<li>"You can reach room service by dialing 9 from your room phone." — Bấm số 9 từ điện thoại phòng để gọi dịch vụ phòng.</li>
<li>"Breakfast is served in the restaurant from 6:30 to 10:30." — Bữa sáng phục vụ tại nhà hàng từ 6h30-10h30.</li>
<li>"Would you like anything sent up to your room?" — Quý khách có muốn gửi gì lên phòng không?</li>
<li>"Is there anything else I can help you with?" — Tôi có thể giúp gì thêm không?</li>
</ul>
<h3>Hội thoại mẫu</h3>
<pre><code>Khách (gọi điện): Hi, this is room 508. Could I order some food, please?
Dịch vụ phòng:    Of course. What would you like?
Khách:            I'd like a club sandwich and a bottle of water.
Dịch vụ phòng:    Certainly. That will be ready in about 20 minutes.
                  Is there anything else?
Khách:            No, that's all, thank you.
</code></pre>
<h3>Ngữ pháp — Giới từ chỉ vị trí &amp; thời gian</h3>
<p>Mô tả tiện nghi cần giới từ chính xác:</p>
<ul>
<li><strong>on</strong> the 2nd floor (ở tầng 2) / <strong>in</strong> the lobby (trong sảnh) / <strong>next to</strong> the elevator (cạnh thang máy)</li>
<li><strong>from</strong> 6 AM <strong>to</strong> 10 PM / open <strong>until</strong> midnight (mở đến nửa đêm)</li>
</ul>
<div class="callout"><span class="badge">Chủ động đoán nhu cầu</span> Nhắc thêm những tiện nghi khách chưa hỏi (mật khẩu Wi-Fi, giờ ăn sáng) — tránh khách phải gọi lại lần hai, tạo cảm giác được chăm sóc.</div>`,
  ]]);

const c3q = quiz('enh301-quiz-3', 'Quiz 3 — Facilities & room service|||Quiz 3 — Tiện nghi & dịch vụ phòng', [
  { id: 'q1', question: '"Housekeeping" là bộ phận phụ trách?', options: ['Nấu ăn', 'Dọn phòng', 'Lái xe đưa khách', 'Kế toán'], correctIndex: 1, explanation: 'Housekeeping = bộ phận dọn phòng, vệ sinh buồng khách.' },
  { id: 'q2', question: 'Điền giới từ đúng: "The gym is open ___ 6 AM ___ 10 PM."', options: ['on / at', 'from / to', 'in / on', 'at / in'], correctIndex: 1, explanation: '"from...to..." dùng để chỉ khoảng thời gian mở cửa.' },
  { id: 'q3', question: 'Muốn gọi dịch vụ phòng đặt món ăn, khách nên nói gì?', options: ['Give me food now.', 'I would like to order some food, please.', 'Food. Room 508.', 'Bring food.'], correctIndex: 1, explanation: 'Câu lịch sự, đầy đủ chủ ngữ và "please" phù hợp giao tiếp dịch vụ.' },
]);

// ---------- Chapter 4: Handling requests & complaints ----------
const c4 = doc('enh301-4-1-requests-complaints', '4.1 — Handling requests & complaints|||4.1 — Xử lý yêu cầu & phàn nàn',
  'Từ vựng phàn nàn thường gặp, mẫu câu xin lỗi & đưa giải pháp, hội thoại xử lý khiếu nại, ngữ pháp: câu điều kiện loại 1 cho giải pháp.',
  [[
    `<span class="eyebrow">ENH301 · Chapter 4 · Lesson 4.1</span>
<h2>Handling requests &amp; complaints</h2>
<h3>Target vocabulary</h3>
<pre><code>noisy room     - phòng ồn
broken air-conditioner - máy lạnh hỏng
overbooked     - nhận đặt phòng quá số lượng
compensation   - đền bù
inconvenience  - sự bất tiện
upgrade        - nâng cấp (phòng)
refund         - hoàn tiền
</code></pre>
<h3>Useful phrases (apologizing & solving)</h3>
<ul>
<li>"I'm so sorry for the inconvenience."</li>
<li>"Let me look into this right away."</li>
<li>"I completely understand your frustration."</li>
<li>"As a solution, we can offer you a free upgrade / a discount on your next stay."</li>
<li>"Thank you for bringing this to our attention."</li>
</ul>
<h3>Sample dialogue</h3>
<pre><code>Guest: Excuse me, the air-conditioner in my room isn't working at all.
Staff: I'm very sorry to hear that, sir. Let me check right away.
       If it can't be fixed quickly, would you like us to move you
       to another room?
Guest: Yes, that would be better.
Staff: Of course. I'll also offer you a complimentary breakfast
       tomorrow for the inconvenience.
Guest: That's very kind, thank you.
</code></pre>
<h3>Grammar focus — First conditional for solutions</h3>
<p>Use <strong>If + present simple, ... will + verb</strong> to offer conditional solutions:</p>
<ul>
<li>"If the room isn't ready, we will upgrade you to a suite."</li>
<li>"If you're still not satisfied, I will call my manager."</li>
</ul>
<div class="callout"><span class="badge">LAST method</span> <strong>L</strong>isten, <strong>A</strong>pologize, <strong>S</strong>olve, <strong>T</strong>hank — a simple order to follow when handling any complaint.</div>`,
    `<span class="eyebrow">ENH301 · Chương 4 · Bài 4.1</span>
<h2>Xử lý yêu cầu &amp; phàn nàn</h2>
<h3>Từ vựng trọng tâm</h3>
<pre><code>noisy room     - phòng ồn
broken air-conditioner - máy lạnh hỏng
overbooked     - nhận đặt phòng quá số lượng
compensation   - đền bù
inconvenience  - sự bất tiện
upgrade        - nâng cấp (phòng)
refund         - hoàn tiền
</code></pre>
<h3>Mẫu câu hữu ích (xin lỗi &amp; đưa giải pháp)</h3>
<ul>
<li>"I'm so sorry for the inconvenience." — Tôi rất xin lỗi vì sự bất tiện này.</li>
<li>"Let me look into this right away." — Để tôi kiểm tra ngay.</li>
<li>"I completely understand your frustration." — Tôi hoàn toàn hiểu sự khó chịu của quý khách.</li>
<li>"As a solution, we can offer you a free upgrade / a discount on your next stay." — Chúng tôi có thể nâng cấp phòng miễn phí / giảm giá lần sau.</li>
<li>"Thank you for bringing this to our attention." — Cảm ơn quý khách đã cho chúng tôi biết.</li>
</ul>
<h3>Hội thoại mẫu</h3>
<pre><code>Khách:     Excuse me, the air-conditioner in my room isn't working at all.
Nhân viên: I'm very sorry to hear that, sir. Let me check right away.
           If it can't be fixed quickly, would you like us to move you
           to another room?
Khách:     Yes, that would be better.
Nhân viên: Of course. I'll also offer you a complimentary breakfast
           tomorrow for the inconvenience.
Khách:     That's very kind, thank you.
</code></pre>
<h3>Ngữ pháp — Câu điều kiện loại 1 cho giải pháp</h3>
<p>Dùng <strong>If + hiện tại đơn, ... will + động từ</strong> để đưa giải pháp có điều kiện:</p>
<ul>
<li>"If the room isn't ready, we will upgrade you to a suite." — Nếu phòng chưa sẵn sàng, chúng tôi sẽ nâng cấp lên suite.</li>
<li>"If you're still not satisfied, I will call my manager." — Nếu quý khách vẫn không hài lòng, tôi sẽ gọi quản lý.</li>
</ul>
<div class="callout"><span class="badge">Phương pháp LAST</span> <strong>L</strong>isten (lắng nghe), <strong>A</strong>pologize (xin lỗi), <strong>S</strong>olve (giải quyết), <strong>T</strong>hank (cảm ơn) — thứ tự đơn giản khi xử lý bất kỳ phàn nàn nào.</div>`,
  ]]);

const c4q = quiz('enh301-quiz-4', 'Quiz 4 — Requests & complaints|||Quiz 4 — Yêu cầu & phàn nàn', [
  { id: 'q1', question: 'Bước đầu tiên trong phương pháp LAST khi xử lý phàn nàn là gì?', options: ['Apologize', 'Listen', 'Solve', 'Thank'], correctIndex: 1, explanation: 'LAST: Listen trước tiên — lắng nghe đầy đủ trước khi phản hồi.' },
  { id: 'q2', question: 'Câu nào ĐÚNG dạng câu điều kiện loại 1?', options: ['If the room isnt ready, we upgraded you.', 'If the room isnt ready, we will upgrade you.', 'If the room wasnt ready, we will upgrade you.', 'If the room isnt ready, we upgrading you.'], correctIndex: 1, explanation: 'Cấu trúc: If + hiện tại đơn, ... will + V (nguyên thể).' },
  { id: 'q3', question: '"Compensation" trong ngành khách sạn nghĩa là gì?', options: ['Hoá đơn', 'Đền bù/bồi thường cho khách', 'Đặt phòng', 'Dọn phòng'], correctIndex: 1, explanation: 'Compensation = hình thức đền bù (giảm giá, nâng cấp, hoàn tiền...) khi có sự cố.' },
]);

// ---------- Chapter 5: Restaurant & food service English ----------
const c5 = doc('enh301-5-1-restaurant-food-service', '5.1 — Restaurant & food service English|||5.1 — Tiếng Anh nhà hàng & phục vụ ăn uống',
  'Từ vựng thực đơn/phục vụ, mẫu câu gọi món & giới thiệu món ăn, hội thoại phục vụ bàn, ngữ pháp: câu hỏi gợi ý "Would you like...?" và "How would you like...?".',
  [[
    `<span class="eyebrow">ENH301 · Chapter 5 · Lesson 5.1</span>
<h2>Restaurant &amp; food service English</h2>
<h3>Target vocabulary</h3>
<pre><code>appetizer/starter - món khai vị
main course    - món chính
dessert        - món tráng miệng
allergy/allergic to - dị ứng / bị dị ứng với
medium rare/well done - (thịt) chín vừa / chín kỹ
to go / takeaway - mang đi
the bill / the check - hoá đơn
</code></pre>
<h3>Useful phrases</h3>
<ul>
<li>"Are you ready to order, or do you need a few more minutes?"</li>
<li>"Would you like to start with an appetizer?"</li>
<li>"How would you like your steak done?"</li>
<li>"Do you have any food allergies I should know about?"</li>
<li>"Would you like anything else, or shall I bring the bill?"</li>
</ul>
<h3>Sample dialogue</h3>
<pre><code>Waiter: Good evening, are you ready to order?
Guest:  Yes. I'll have the grilled salmon, please.
Waiter: Certainly. How would you like your vegetables — steamed
        or grilled?
Guest:  Steamed, please. Also, I'm allergic to peanuts — is that
        in the sauce?
Waiter: Let me check with the kitchen and get back to you right away.
</code></pre>
<h3>Grammar focus — Offering choices politely</h3>
<p>Use <strong>Would you like...?</strong> for offers and <strong>How would you like...?</strong> to ask about preparation:</p>
<ul>
<li>"Would you like still or sparkling water?"</li>
<li>"How would you like your eggs — scrambled or fried?"</li>
</ul>
<div class="callout"><span class="badge">Always ask about allergies</span> Confirming allergies before serving isn't just good service — it's a safety requirement in every hospitality workplace.</div>`,
    `<span class="eyebrow">ENH301 · Chương 5 · Bài 5.1</span>
<h2>Tiếng Anh nhà hàng &amp; phục vụ ăn uống</h2>
<h3>Từ vựng trọng tâm</h3>
<pre><code>appetizer/starter - món khai vị
main course    - món chính
dessert        - món tráng miệng
allergy/allergic to - dị ứng / bị dị ứng với
medium rare/well done - (thịt) chín vừa / chín kỹ
to go / takeaway - mang đi
the bill / the check - hoá đơn
</code></pre>
<h3>Mẫu câu hữu ích</h3>
<ul>
<li>"Are you ready to order, or do you need a few more minutes?" — Quý khách sẵn sàng gọi món chưa, hay cần thêm chút thời gian?</li>
<li>"Would you like to start with an appetizer?" — Quý khách muốn bắt đầu với món khai vị không?</li>
<li>"How would you like your steak done?" — Quý khách muốn bít tết chín thế nào?</li>
<li>"Do you have any food allergies I should know about?" — Quý khách có dị ứng thực phẩm nào tôi cần biết không?</li>
<li>"Would you like anything else, or shall I bring the bill?" — Quý khách muốn dùng thêm gì không, hay tôi mang hoá đơn?</li>
</ul>
<h3>Hội thoại mẫu</h3>
<pre><code>Phục vụ: Good evening, are you ready to order?
Khách:   Yes. I'll have the grilled salmon, please.
Phục vụ: Certainly. How would you like your vegetables — steamed
         or grilled?
Khách:   Steamed, please. Also, I'm allergic to peanuts — is that
         in the sauce?
Phục vụ: Let me check with the kitchen and get back to you right away.
</code></pre>
<h3>Ngữ pháp — Đưa lựa chọn một cách lịch sự</h3>
<p>Dùng <strong>Would you like...?</strong> để mời/đề nghị và <strong>How would you like...?</strong> để hỏi cách chế biến:</p>
<ul>
<li>"Would you like still or sparkling water?" — Quý khách muốn nước lọc thường hay có gas?</li>
<li>"How would you like your eggs — scrambled or fried?" — Quý khách muốn trứng chiên khuấy hay chiên nguyên lòng?</li>
</ul>
<div class="callout"><span class="badge">Luôn hỏi về dị ứng</span> Xác nhận dị ứng trước khi phục vụ không chỉ là dịch vụ tốt — đó là yêu cầu an toàn bắt buộc ở mọi cơ sở khách sạn/nhà hàng.</div>`,
  ]]);

const c5q = quiz('enh301-quiz-5', 'Quiz 5 — Restaurant & food service|||Quiz 5 — Nhà hàng & phục vụ ăn uống', [
  { id: 'q1', question: '"Allergic to peanuts" nghĩa là gì?', options: ['Rất thích ăn đậu phộng', 'Bị dị ứng với đậu phộng', 'Không ăn đậu phộng vì tôn giáo', 'Ăn chay'], correctIndex: 1, explanation: '"Allergic to X" = bị dị ứng với X.' },
  { id: 'q2', question: 'Câu hỏi phù hợp để hỏi cách chế biến món ăn?', options: ['What do you want?', 'How would you like your steak done?', 'You want steak?', 'Give me your order.'], correctIndex: 1, explanation: '"How would you like...?" dùng để hỏi cách chế biến/mức độ chín một cách lịch sự.' },
  { id: 'q3', question: '"The bill" trong nhà hàng nghĩa là gì?', options: ['Món khai vị', 'Hoá đơn thanh toán', 'Thực đơn', 'Ghế ngồi'], correctIndex: 1, explanation: '"The bill" (Anh-Anh) / "the check" (Anh-Mỹ) = hoá đơn thanh toán.' },
]);

// ---------- Chapter 6: Giving directions & local information ----------
const c6 = doc('enh301-6-1-directions-local-info', '6.1 — Giving directions & local information|||6.1 — Chỉ đường & thông tin địa phương',
  'Từ vựng chỉ đường, mẫu câu hướng dẫn đến địa điểm, hội thoại tư vấn du lịch địa phương, ngữ pháp: câu mệnh lệnh (imperatives) cho chỉ đường.',
  [[
    `<span class="eyebrow">ENH301 · Chapter 6 · Lesson 6.1</span>
<h2>Giving directions &amp; local information</h2>
<h3>Target vocabulary</h3>
<pre><code>turn left/right   - rẽ trái/phải
go straight ahead - đi thẳng
on the corner of  - ở góc đường
across from       - đối diện
a five-minute walk - đi bộ khoảng 5 phút
landmark          - địa điểm mốc, dễ nhận biết
</code></pre>
<h3>Useful phrases</h3>
<ul>
<li>"Could you tell me how to get to...?" (guest asking)</li>
<li>"It's about a ten-minute walk from here."</li>
<li>"Go straight ahead, then turn left at the second traffic light."</li>
<li>"The museum is right across from the park, you can't miss it."</li>
<li>"I'd recommend visiting... it's very popular with our guests."</li>
</ul>
<h3>Sample dialogue</h3>
<pre><code>Guest:      Excuse me, could you tell me how to get to the old
            market from here?
Concierge:  Sure. Go straight ahead until you reach the main square,
            then turn right. The market is on your left, about a
            five-minute walk. You'll see a big red gate — that's
            the entrance.
Guest:      Great, thank you!
Concierge:  You're welcome. It's very busy in the morning, so I'd
            recommend going before 9 AM.
</code></pre>
<h3>Grammar focus — Imperatives for directions</h3>
<p>Directions use the <strong>imperative</strong> (base verb, no subject) — polite because of tone, not extra words:</p>
<ul>
<li>"Turn left at the corner." / "Go straight ahead." / "Take the second exit."</li>
</ul>
<div class="callout"><span class="badge">Give a landmark</span> Numbers and street names are easy to forget — a visual landmark ("a big red gate", "next to the coffee shop") sticks in memory much better.</div>`,
    `<span class="eyebrow">ENH301 · Chương 6 · Bài 6.1</span>
<h2>Chỉ đường &amp; thông tin địa phương</h2>
<h3>Từ vựng trọng tâm</h3>
<pre><code>turn left/right   - rẽ trái/phải
go straight ahead - đi thẳng
on the corner of  - ở góc đường
across from       - đối diện
a five-minute walk - đi bộ khoảng 5 phút
landmark          - địa điểm mốc, dễ nhận biết
</code></pre>
<h3>Mẫu câu hữu ích</h3>
<ul>
<li>"Could you tell me how to get to...?" — (khách hỏi) Làm sao để đến...?</li>
<li>"It's about a ten-minute walk from here." — Đi bộ khoảng 10 phút từ đây.</li>
<li>"Go straight ahead, then turn left at the second traffic light." — Đi thẳng, rồi rẽ trái ở đèn giao thông thứ hai.</li>
<li>"The museum is right across from the park, you can't miss it." — Viện bảo tàng đối diện công viên, không thể lạc đâu.</li>
<li>"I'd recommend visiting... it's very popular with our guests." — Tôi khuyên nên đến... rất được khách yêu thích.</li>
</ul>
<h3>Hội thoại mẫu</h3>
<pre><code>Khách:      Excuse me, could you tell me how to get to the old
            market from here?
Concierge:  Sure. Go straight ahead until you reach the main square,
            then turn right. The market is on your left, about a
            five-minute walk. You'll see a big red gate — that's
            the entrance.
Khách:      Great, thank you!
Concierge:  You're welcome. It's very busy in the morning, so I'd
            recommend going before 9 AM.
</code></pre>
<h3>Ngữ pháp — Câu mệnh lệnh khi chỉ đường</h3>
<p>Chỉ đường dùng <strong>câu mệnh lệnh</strong> (động từ nguyên thể, không chủ ngữ) — vẫn lịch sự nhờ ngữ điệu, không cần thêm từ:</p>
<ul>
<li>"Turn left at the corner." — Rẽ trái ở góc đường. / "Go straight ahead." — Đi thẳng. / "Take the second exit." — Ra ở lối ra thứ hai.</li>
</ul>
<div class="callout"><span class="badge">Nêu một mốc dễ nhớ</span> Số nhà và tên đường dễ quên — một mốc trực quan ("cổng đỏ lớn", "cạnh quán cà phê") in vào bộ nhớ tốt hơn nhiều.</div>`,
  ]]);

const c6q = quiz('enh301-quiz-6', 'Quiz 6 — Directions & local info|||Quiz 6 — Chỉ đường & thông tin địa phương', [
  { id: 'q1', question: '"Across from the park" nghĩa là gì?', options: ['Bên trong công viên', 'Đối diện công viên', 'Cạnh công viên', 'Xa công viên'], correctIndex: 1, explanation: '"Across from" = đối diện.' },
  { id: 'q2', question: 'Câu chỉ đường nào dùng đúng dạng mệnh lệnh?', options: ['You should turn left.', 'Turn left at the corner.', 'Turning left is good.', 'Left turn maybe.'], correctIndex: 1, explanation: 'Chỉ đường dùng động từ nguyên thể đầu câu: "Turn left..."' },
  { id: 'q3', question: 'Vì sao nên đưa ra một "landmark" khi chỉ đường?', options: ['Vì bắt buộc theo luật', 'Vì khách không biết đọc bản đồ', 'Vì mốc trực quan dễ nhớ hơn số nhà/tên đường', 'Vì không cần nói tên đường'], correctIndex: 2, explanation: 'Landmark (mốc dễ nhận biết) giúp khách nhớ đường tốt hơn con số hay tên đường.' },
]);

// ---------- Chapter 7: Telephone & email etiquette ----------
const c7 = doc('enh301-7-1-phone-email-etiquette', '7.1 — Telephone & email etiquette|||7.1 — Giao tiếp điện thoại & email',
  'Từ vựng & mẫu câu trả lời điện thoại chuyên nghiệp, cấu trúc email trả lời khách, ngữ pháp: câu gián tiếp (reported speech) khi ghi lại lời nhắn.',
  [[
    `<span class="eyebrow">ENH301 · Chapter 7 · Lesson 7.1</span>
<h2>Telephone &amp; email etiquette</h2>
<h3>Target vocabulary</h3>
<pre><code>to put someone on hold - giữ máy chờ
to transfer a call    - chuyển máy
to take a message     - ghi lại lời nhắn
attachment            - file đính kèm (email)
subject line          - dòng chủ đề email
to follow up          - theo dõi/nhắc lại sau
</code></pre>
<h3>Useful phrases (phone)</h3>
<ul>
<li>"Good morning, [Hotel Name], this is [Name] speaking. How may I help you?"</li>
<li>"Could you hold the line for a moment, please?"</li>
<li>"I'm afraid Mr. Tran is not available right now. Would you like to leave a message?"</li>
<li>"Let me transfer you to the reservations department."</li>
</ul>
<h3>Sample email reply</h3>
<pre><code>Subject: Re: Booking Inquiry - Deluxe Room, 15-17 Oct

Dear Ms. Johnson,

Thank you for your email. We are pleased to confirm that a
deluxe room is available for your stay from 15 to 17 October.

Please find the rate details attached. Kindly let us know if
you would like to proceed with the booking.

We look forward to welcoming you.

Best regards,
Le Van An
Reservations Team, Riverside Hotel
</code></pre>
<h3>Grammar focus — Reported speech for messages</h3>
<p>When passing on a phone message, shift the tense back one step:</p>
<ul>
<li>Guest said: "I'll arrive late." → Message: "Mr. Tran said he <strong>would</strong> arrive late."</li>
<li>Guest said: "I need a wake-up call." → Message: "The guest said she <strong>needed</strong> a wake-up call."</li>
</ul>
<div class="callout"><span class="badge">Email = the guest's first written impression</span> Always keep a clear subject line, a polite greeting/closing, and proofread before sending — a typo in a booking date can cause a real dispute.</div>`,
    `<span class="eyebrow">ENH301 · Chương 7 · Bài 7.1</span>
<h2>Giao tiếp điện thoại &amp; email</h2>
<h3>Từ vựng trọng tâm</h3>
<pre><code>to put someone on hold - giữ máy chờ
to transfer a call    - chuyển máy
to take a message     - ghi lại lời nhắn
attachment            - file đính kèm (email)
subject line          - dòng chủ đề email
to follow up          - theo dõi/nhắc lại sau
</code></pre>
<h3>Mẫu câu hữu ích (điện thoại)</h3>
<ul>
<li>"Good morning, [Hotel Name], this is [Name] speaking. How may I help you?" — Xin chào, đây là [tên khách sạn], tôi là [tên]. Tôi giúp gì được cho quý khách?</li>
<li>"Could you hold the line for a moment, please?" — Xin quý khách giữ máy một chút.</li>
<li>"I'm afraid Mr. Tran is not available right now. Would you like to leave a message?" — Ông Trần hiện không có mặt, quý khách muốn để lại lời nhắn không?</li>
<li>"Let me transfer you to the reservations department." — Để tôi chuyển máy đến bộ phận đặt phòng.</li>
</ul>
<h3>Mẫu email trả lời</h3>
<pre><code>Subject: Re: Booking Inquiry - Deluxe Room, 15-17 Oct

Dear Ms. Johnson,

Thank you for your email. We are pleased to confirm that a
deluxe room is available for your stay from 15 to 17 October.

Please find the rate details attached. Kindly let us know if
you would like to proceed with the booking.

We look forward to welcoming you.

Best regards,
Le Van An
Reservations Team, Riverside Hotel
</code></pre>
<h3>Ngữ pháp — Câu gián tiếp khi ghi lại lời nhắn</h3>
<p>Khi truyền đạt lại lời nhắn qua điện thoại, lùi thì một bậc:</p>
<ul>
<li>Khách nói: "I'll arrive late." → Lời nhắn: "Mr. Tran said he <strong>would</strong> arrive late."</li>
<li>Khách nói: "I need a wake-up call." → Lời nhắn: "The guest said she <strong>needed</strong> a wake-up call."</li>
</ul>
<div class="callout"><span class="badge">Email = ấn tượng viết đầu tiên của khách</span> Luôn giữ dòng chủ đề rõ ràng, lời chào/kết lịch sự, và đọc lại trước khi gửi — một lỗi chính tả trong ngày đặt phòng có thể gây tranh chấp thật.</div>`,
  ]]);

const c7q = quiz('enh301-quiz-7', 'Quiz 7 — Phone & email etiquette|||Quiz 7 — Điện thoại & email', [
  { id: 'q1', question: 'Khách nói "I will arrive late." Ghi lại lời nhắn đúng theo câu gián tiếp là?', options: ['The guest said he will arrive late.', 'The guest said he would arrive late.', 'The guest say he arrive late.', 'The guest said he arrives late.'], correctIndex: 1, explanation: 'Câu gián tiếp lùi thì: will → would.' },
  { id: 'q2', question: '"To transfer a call" nghĩa là gì?', options: ['Ghi lại lời nhắn', 'Chuyển máy sang bộ phận khác', 'Giữ máy chờ', 'Ngắt cuộc gọi'], correctIndex: 1, explanation: '"Transfer a call" = chuyển cuộc gọi đến người/bộ phận khác.' },
  { id: 'q3', question: 'Trong email trả lời khách, phần nào KHÔNG nên bỏ qua?', options: ['Emoji nhiều màu', 'Dòng chủ đề (subject line) rõ ràng & lời chào/kết lịch sự', 'Viết toàn chữ hoa', 'Viết càng dài càng tốt'], correctIndex: 1, explanation: 'Subject line rõ ràng và giọng văn lịch sự là chuẩn email chuyên nghiệp trong ngành khách sạn.' },
]);

// ---------- Chapter 8: Check-out, billing & farewell ----------
const c8 = doc('enh301-8-1-checkout-billing-farewell', '8.1 — Check-out, billing & farewell|||8.1 — Trả phòng, thanh toán & tạm biệt',
  'Từ vựng trả phòng/thanh toán, mẫu câu xử lý hoá đơn, hội thoại trả phòng & tạm biệt, ngữ pháp: hiện tại hoàn thành cho tổng kết chi phí lưu trú.',
  [[
    `<span class="eyebrow">ENH301 · Chapter 8 · Lesson 8.1</span>
<h2>Check-out, billing &amp; farewell</h2>
<h3>Target vocabulary</h3>
<pre><code>to settle the bill   - thanh toán hoá đơn
incidental charges   - chi phí phát sinh (minibar, giặt ủi...)
late check-out       - trả phòng muộn (có phí/không phí)
receipt              - biên nhận
express check-out    - trả phòng nhanh (qua TV/app)
farewell             - lời tạm biệt
</code></pre>
<h3>Useful phrases</h3>
<ul>
<li>"How would you like to settle the bill — by card or cash?"</li>
<li>"This charge here is for the minibar on the 15th."</li>
<li>"Would you like a printed receipt, or shall I email it to you?"</li>
<li>"Thank you for staying with us. We hope to see you again soon."</li>
<li>"Have a safe trip home!"</li>
</ul>
<h3>Sample dialogue</h3>
<pre><code>Guest:      Hi, I'd like to check out. Room 508.
Receptionist: Certainly. Let me print your final bill... You've
              used the minibar once and the laundry service, so
              the total comes to $215. How would you like to pay?
Guest:        By credit card, please.
Receptionist: All done. Here's your receipt. Thank you for staying
              with us, Mr. Nguyen — we hope to see you again soon!
Guest:        Thank you, it was a great stay.
</code></pre>
<h3>Grammar focus — Present perfect for a stay summary</h3>
<p>Use the <strong>present perfect</strong> to summarize what happened during the stay, without a specific past time:</p>
<ul>
<li>"You've used the minibar twice." / "You haven't used any extra services."</li>
<li>"Have you enjoyed your stay with us?"</li>
</ul>
<div class="callout"><span class="badge">End on a high note</span> A genuine "thank you" and a personal wish ("safe trip", "see you again") is what guests remember and often mention in reviews.</div>`,
    `<span class="eyebrow">ENH301 · Chương 8 · Bài 8.1</span>
<h2>Trả phòng, thanh toán &amp; tạm biệt</h2>
<h3>Từ vựng trọng tâm</h3>
<pre><code>to settle the bill   - thanh toán hoá đơn
incidental charges   - chi phí phát sinh (minibar, giặt ủi...)
late check-out       - trả phòng muộn (có phí/không phí)
receipt              - biên nhận
express check-out    - trả phòng nhanh (qua TV/app)
farewell             - lời tạm biệt
</code></pre>
<h3>Mẫu câu hữu ích</h3>
<ul>
<li>"How would you like to settle the bill — by card or cash?" — Quý khách muốn thanh toán bằng thẻ hay tiền mặt?</li>
<li>"This charge here is for the minibar on the 15th." — Khoản này là tiền minibar ngày 15.</li>
<li>"Would you like a printed receipt, or shall I email it to you?" — Quý khách muốn biên nhận in giấy hay gửi qua email?</li>
<li>"Thank you for staying with us. We hope to see you again soon." — Cảm ơn quý khách đã lưu trú. Mong sớm được gặp lại.</li>
<li>"Have a safe trip home!" — Chúc quý khách về nhà an toàn!</li>
</ul>
<h3>Hội thoại mẫu</h3>
<pre><code>Khách: Hi, I'd like to check out. Room 508.
Lễ tân: Certainly. Let me print your final bill... You've
        used the minibar once and the laundry service, so
        the total comes to $215. How would you like to pay?
Khách:  By credit card, please.
Lễ tân: All done. Here's your receipt. Thank you for staying
        with us, Mr. Nguyen — we hope to see you again soon!
Khách:  Thank you, it was a great stay.
</code></pre>
<h3>Ngữ pháp — Hiện tại hoàn thành để tổng kết kỳ lưu trú</h3>
<p>Dùng <strong>hiện tại hoàn thành</strong> để tổng kết những gì xảy ra trong kỳ lưu trú, không cần mốc thời gian cụ thể:</p>
<ul>
<li>"You've used the minibar twice." — Quý khách đã dùng minibar hai lần. / "You haven't used any extra services." — Quý khách chưa dùng dịch vụ phát sinh nào.</li>
<li>"Have you enjoyed your stay with us?" — Quý khách có hài lòng với kỳ lưu trú không?</li>
</ul>
<div class="callout"><span class="badge">Kết thúc ấn tượng</span> Một lời "cảm ơn" chân thành và lời chúc cá nhân ("về nhà an toàn", "hẹn gặp lại") là điều khách nhớ nhất và thường nhắc đến trong đánh giá.</div>`,
  ]]);

const c8q = quiz('enh301-quiz-8', 'Quiz 8 — Check-out & billing|||Quiz 8 — Trả phòng & thanh toán', [
  { id: 'q1', question: '"Incidental charges" nghĩa là gì?', options: ['Giá phòng cơ bản', 'Chi phí phát sinh như minibar, giặt ủi', 'Tiền đặt cọc', 'Thuế VAT'], correctIndex: 1, explanation: 'Incidental charges = các khoản phát sinh ngoài giá phòng gốc.' },
  { id: 'q2', question: 'Câu nào dùng đúng hiện tại hoàn thành để tổng kết kỳ lưu trú?', options: ['You use the minibar twice.', 'You used the minibar twice yesterday at 3pm.', 'You have used the minibar twice.', 'You are using the minibar twice.'], correctIndex: 2, explanation: 'Hiện tại hoàn thành (have/has + V3) dùng khi không nêu mốc thời gian cụ thể trong quá khứ.' },
  { id: 'q3', question: 'Câu nào phù hợp nhất để tạm biệt khách khi trả phòng?', options: ['Bye.', 'Thank you for staying with us. We hope to see you again soon.', 'Leave now, please.', 'Next!'], correctIndex: 1, explanation: 'Lời tạm biệt lịch sự, cảm ơn và mong gặp lại là chuẩn dịch vụ khách sạn.' },
]);

export default {
  semester: { code: 'KY1', name: 'Kỳ 1', ordinal: 1 },
  course: {
    courseCode: 'ENH301',
    slug: 'enh301-business-english-for-hospitality-level-intermediate',
    title: 'BUSINESS ENGLISH FOR HOSPITALITY -  Level: Intermediate',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/ENH301.webp',
    shortDescription: 'Practical hotel English — welcoming guests, reservations & check-in, facilities & room service, complaints, restaurant service, directions, phone/email etiquette, check-out & billing. Bilingual, with dialogues & quizzes.|||Tiếng Anh thực dụng ngành khách sạn — chào khách, đặt phòng & nhận phòng, tiện nghi & dịch vụ phòng, xử lý phàn nàn, phục vụ nhà hàng, chỉ đường, điện thoại/email, trả phòng & thanh toán. Song ngữ, có hội thoại & quiz.',
    description: 'Môn <strong>ENH301 — Business English for Hospitality (Intermediate)</strong> (kỳ 1, khối Quản trị Kinh doanh) xây <strong>tiếng Anh giao tiếp thực dụng ngành khách sạn</strong>. Từ <strong>chào &amp; đón khách</strong> → <strong>đặt phòng &amp; nhận phòng</strong> → <strong>tiện nghi &amp; dịch vụ phòng</strong> → <strong>xử lý yêu cầu &amp; phàn nàn</strong> → <strong>tiếng Anh nhà hàng &amp; phục vụ ăn uống</strong> → <strong>chỉ đường &amp; thông tin địa phương</strong> → <strong>giao tiếp điện thoại &amp; email</strong> → <strong>trả phòng, thanh toán &amp; tạm biệt</strong>. Tham khảo <em>English for International Tourism</em> (Pearson Longman), <em>Highly Recommended — English for the Hotel and Catering Industry</em> (OUP) và <em>Hotel &amp; Hospitality English</em>. Song ngữ, có từ vựng, mẫu câu, hội thoại và quiz mỗi chương.',
    whatYouLearn: 'Chào & đón khách lịch sự; nhận đặt phòng & check-in; giới thiệu tiện nghi & gọi dịch vụ phòng; xin lỗi & xử lý phàn nàn (phương pháp LAST); tiếng Anh phục vụ nhà hàng & hỏi dị ứng thực phẩm; chỉ đường & giới thiệu địa điểm; trả lời điện thoại & viết email chuyên nghiệp; xử lý hoá đơn, trả phòng & tạm biệt khách.',
    requirements: 'Tiếng Anh trình độ cơ bản-trung cấp (tương đương A2-B1). Không yêu cầu kiến thức ngành khách sạn trước đó.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình tham khảo, tài liệu chính thức miễn phí, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Vai trò tiếng Anh trong ngành khách sạn, nguyên tắc giao tiếp với khách.', lessons: [intro] },
    { title: 'Chương 1 — Chào & đón khách|||Chapter 1 — Welcoming & greeting guests', description: 'Từ vựng & mẫu câu chào đón, câu hỏi lịch sự.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Đặt phòng & nhận phòng|||Chapter 2 — Reservations & check-in', description: 'Nhận đặt phòng, xác nhận thông tin, check-in.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Tiện nghi & dịch vụ phòng|||Chapter 3 — Hotel facilities & room service', description: 'Giới thiệu tiện nghi, gọi dịch vụ phòng.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Xử lý yêu cầu & phàn nàn|||Chapter 4 — Handling requests & complaints', description: 'Xin lỗi, đưa giải pháp, phương pháp LAST.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Tiếng Anh nhà hàng & phục vụ ăn uống|||Chapter 5 — Restaurant & food service English', description: 'Gọi món, hỏi dị ứng, phục vụ bàn.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Chỉ đường & thông tin địa phương|||Chapter 6 — Giving directions & local information', description: 'Chỉ đường, giới thiệu điểm tham quan.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Giao tiếp điện thoại & email|||Chapter 7 — Telephone & email etiquette', description: 'Trả lời điện thoại, viết email chuyên nghiệp.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Trả phòng, thanh toán & tạm biệt|||Chapter 8 — Check-out, billing & farewell', description: 'Xử lý hoá đơn, trả phòng, lời chào tạm biệt.', lessons: [c8, c8q] },
  ],
};
