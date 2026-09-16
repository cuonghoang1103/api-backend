/**
 * KBL401 — Business Korean / Tiếng Hàn thương mại. Ngành Ngôn ngữ Hàn, FPTU,
 * Kỳ 7. Trình độ TOPIK 4-5 + từ vựng thương mại (danh thiếp, email, báo giá,
 * đàm phán, hợp đồng, xuất nhập khẩu, họp, văn hoá công sở). Hangeul (한글) +
 * romaja + nghĩa Việt/Anh, hội thoại & bảng từ vựng thương mại.
 * Giữ NGUYÊN slug/semester/thumb. ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('kbl401-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình 비즈니스 한국어 & 무역 한국어 (FLM), TOPIK, từ điển, YouTube, công cụ gõ Hangeul, lộ trình tự học.',
  [[
    `<span class="eyebrow">KBL401 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn <strong>Business Korean (비즈니스 한국어)</strong> — office honorifics, phone/email, company &amp; product pitch, quoting &amp; ordering, negotiation &amp; contracts, payment &amp; trade, meetings — in one place. The full official textbook &amp; slides live on <strong>FLM</strong>; below are free, legal resources.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for KBL401 (based on <em>비즈니스 한국어</em> and <em>무역 한국어</em>) are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Dictionaries &amp; TOPIK</h3>
<ul>
<li><a href="https://ko.dict.naver.com/" target="_blank" rel="noopener">Naver Korean Dictionary</a> — Korean↔Vietnamese/English, example sentences</li>
<li><a href="https://www.topik.go.kr/" target="_blank" rel="noopener">TOPIK (topik.go.kr)</a> — official exam info, TOPIK 4-5 = intermediate-advanced</li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://kiip.korean.go.kr/" target="_blank" rel="noopener">KIIP — 국립국어원 (National Institute of Korean Language)</a></li>
<li><a href="https://www.korean.go.kr/" target="_blank" rel="noopener">국립국어원 (korean.go.kr)</a> — standard Korean references</li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@talktomeinkorean" target="_blank" rel="noopener">Talk To Me In Korean</a> — grammar &amp; honorifics explained</li>
<li><a href="https://www.youtube.com/@GoBillykorean" target="_blank" rel="noopener">GoBillyKorean</a> — business &amp; formal Korean expressions</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://www.branah.com/korean" target="_blank" rel="noopener">Branah Korean Keyboard</a> — type Hangeul without installing a keyboard</li>
<li><a href="https://papago.naver.com/" target="_blank" rel="noopener">Naver Papago</a> — Korean↔Vietnamese translation, romanization</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation</strong> — office honorifics (존댓말), business cards, phone &amp; email etiquette.</li>
<li><strong>Core transactions</strong> — company/product pitch, quotes, orders, negotiation, contracts.</li>
<li><strong>Trade &amp; ops</strong> — payment terms, shipping, import/export, customs vocabulary.</li>
<li><strong>Job-ready</strong> — run a meeting, give a short presentation, write a status report, read the culture.</li>
</ol></div>`,
    `<span class="eyebrow">KBL401 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học <strong>Tiếng Hàn thương mại (비즈니스 한국어)</strong> — kính ngữ công sở, điện thoại/email, giới thiệu công ty &amp; sản phẩm, báo giá &amp; đặt hàng, đàm phán &amp; hợp đồng, thanh toán &amp; xuất nhập khẩu, họp hành — gom về một chỗ. Giáo trình &amp; slide chính thức đầy đủ nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của KBL401 (dựa trên <em>비즈니스 한국어</em> và <em>무역 한국어</em>) có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Từ điển &amp; TOPIK</h3>
<ul>
<li><a href="https://ko.dict.naver.com/" target="_blank" rel="noopener">Từ điển Naver Hàn-Việt/Anh</a> — kèm câu ví dụ</li>
<li><a href="https://www.topik.go.kr/" target="_blank" rel="noopener">TOPIK (topik.go.kr)</a> — thông tin kỳ thi, TOPIK 4-5 = trung-cao cấp</li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://kiip.korean.go.kr/" target="_blank" rel="noopener">KIIP — Viện Quốc ngữ Hàn Quốc</a></li>
<li><a href="https://www.korean.go.kr/" target="_blank" rel="noopener">국립국어원 (korean.go.kr)</a> — tài liệu chuẩn tiếng Hàn</li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@talktomeinkorean" target="_blank" rel="noopener">Talk To Me In Korean</a> — ngữ pháp &amp; kính ngữ</li>
<li><a href="https://www.youtube.com/@GoBillykorean" target="_blank" rel="noopener">GoBillyKorean</a> — cách nói trang trọng &amp; thương mại</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://www.branah.com/korean" target="_blank" rel="noopener">Bàn phím Hangeul ảo Branah</a> — gõ tiếng Hàn không cần cài bàn phím</li>
<li><a href="https://papago.naver.com/" target="_blank" rel="noopener">Naver Papago</a> — dịch Hàn-Việt, phiên âm romaja</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền tảng</strong> — kính ngữ công sở (존댓말), danh thiếp, phép lịch sự điện thoại &amp; email.</li>
<li><strong>Giao dịch lõi</strong> — giới thiệu công ty/sản phẩm, báo giá, đặt hàng, đàm phán, hợp đồng.</li>
<li><strong>Thương mại &amp; vận hành</strong> — điều kiện thanh toán, giao hàng, xuất nhập khẩu, thuế quan.</li>
<li><strong>Sẵn sàng đi làm</strong> — điều hành họp, thuyết trình ngắn, viết báo cáo, hiểu văn hoá công sở.</li>
</ol></div>`,
  ]]);

const c1 = doc('kbl401-1-1-greetings', '1.1 — Office greetings, business cards & honorifics|||1.1 — Chào hỏi công sở, danh thiếp & kính ngữ',
  'Kính ngữ 존댓말 (-습니다/-ㅂ니다), trao đổi danh thiếp 명함, chức danh 부장님/과장님/사장님, mẫu câu chào hỏi trang trọng.',
  [[
    `<span class="eyebrow">KBL401 · Chapter 1 · Lesson 1.1</span>
<h2>Office greetings, business cards &amp; honorifics</h2>
<h3>Vocabulary</h3>
<pre><code>회사원  hoesawon      nhân viên công ty / company employee
명함    myeongham     danh thiếp / business card
부장님  bujangnim     trưởng phòng (kính ngữ) / department head (hon.)
과장님  gwajangnim    trưởng nhóm (kính ngữ) / manager (hon.)
사장님  sajangnim     giám đốc (kính ngữ) / CEO (hon.)
존댓말  jondaesmal    kính ngữ / honorific speech
반말    banmal        lời nói suồng sã / casual speech
처음 뵙겠습니다  cheoeum boepgetseumnida   rất hân hạnh được gặp / nice to meet you (formal)
잘 부탁드립니다  jal butakdeurimnida       mong được giúp đỡ / please take care of me
</code></pre>
<h3>Honorific ending -습니다/-ㅂ니다</h3>
<p>Business Korean runs almost entirely on the <strong>formal polite style</strong> — verbs/adjectives end in <strong>-습니다</strong> (after a consonant) or <strong>-ㅂ니다</strong> (after a vowel). This is the default register for meetings, emails and first contact with anyone outside your close circle.</p>
<h3>Dialogue — exchanging business cards</h3>
<pre><code>A: 안녕하세요. 저는 ABC 무역의 김민수입니다.
   Annyeonghaseyo. Jeoneun ABC muyeogui Gim Minsu-imnida.
   Xin chào. Tôi là Kim Min-su của công ty thương mại ABC.

B: 처음 뵙겠습니다. 저는 베트남 XYZ 회사의 응우옌입니다.
   Cheoeum boepgetseumnida. Jeoneun Beteunam XYZ hoesaui Eunguyen-imnida.
   Rất hân hạnh được gặp. Tôi là Nguyễn của công ty XYZ Việt Nam.

A: 여기 제 명함입니다.
   Yeogi je myeonghamimnida.
   Đây là danh thiếp của tôi.

B: 감사합니다. 잘 부탁드립니다.
   Gamsahamnida. Jal butakdeurimnida.
   Cảm ơn. Mong được giúp đỡ nhiều.
</code></pre>
<div class="callout"><span class="badge">Etiquette</span> Hand and receive a business card (명함) with <strong>both hands</strong>, give a slight bow, and read it before putting it away — never write on it or pocket it immediately.</div>`,
    `<span class="eyebrow">KBL401 · Chương 1 · Bài 1.1</span>
<h2>Chào hỏi công sở, danh thiếp &amp; kính ngữ</h2>
<h3>Từ vựng</h3>
<pre><code>회사원  hoesawon      nhân viên công ty
명함    myeongham     danh thiếp
부장님  bujangnim     trưởng phòng (kính ngữ)
과장님  gwajangnim    trưởng nhóm (kính ngữ)
사장님  sajangnim     giám đốc (kính ngữ)
존댓말  jondaesmal    kính ngữ
반말    banmal        lời nói suồng sã
처음 뵙겠습니다  cheoeum boepgetseumnida   rất hân hạnh được gặp
잘 부탁드립니다  jal butakdeurimnida       mong được giúp đỡ nhiều
</code></pre>
<h3>Đuôi kính ngữ -습니다/-ㅂ니다</h3>
<p>Tiếng Hàn thương mại gần như luôn dùng <strong>thể trang trọng lịch sự</strong> — động từ/tính từ kết thúc bằng <strong>-습니다</strong> (sau phụ âm) hoặc <strong>-ㅂ니다</strong> (sau nguyên âm). Đây là văn phong mặc định trong cuộc họp, email và lần gặp đầu với người ngoài vòng thân quen.</p>
<h3>Hội thoại — trao đổi danh thiếp</h3>
<pre><code>A: 안녕하세요. 저는 ABC 무역의 김민수입니다.
   Annyeonghaseyo. Jeoneun ABC muyeogui Gim Minsu-imnida.
   Xin chào. Tôi là Kim Min-su của công ty thương mại ABC.

B: 처음 뵙겠습니다. 저는 베트남 XYZ 회사의 응우옌입니다.
   Cheoeum boepgetseumnida. Jeoneun Beteunam XYZ hoesaui Eunguyen-imnida.
   Rất hân hạnh được gặp. Tôi là Nguyễn của công ty XYZ Việt Nam.

A: 여기 제 명함입니다.
   Yeogi je myeonghamimnida.
   Đây là danh thiếp của tôi.

B: 감사합니다. 잘 부탁드립니다.
   Gamsahamnida. Jal butakdeurimnida.
   Cảm ơn. Mong được giúp đỡ nhiều.
</code></pre>
<div class="callout"><span class="badge">Phép lịch sự</span> Trao và nhận danh thiếp (명함) bằng <strong>cả hai tay</strong>, hơi cúi đầu, đọc qua trước khi cất — đừng viết lên đó hay nhét túi ngay.</div>`,
  ]]);

const c1q = quiz('kbl401-quiz-1', 'Quiz 1 — Greetings & honorifics|||Quiz 1 — Chào hỏi & kính ngữ', [
  { id: 'q1', question: 'Đuôi câu nào là thể kính ngữ trang trọng dùng trong môi trường công sở Hàn Quốc?', options: ['-아/어', '-습니다/-ㅂ니다', '-거든', '-지만'], correctIndex: 1, explanation: '-습니다/-ㅂ니다 là thể trang trọng lịch sự, dùng phổ biến trong họp, email, lần gặp đầu.' },
  { id: 'q2', question: '"처음 뵙겠습니다" nghĩa là gì?', options: ['Tạm biệt', 'Rất hân hạnh được gặp (lần đầu)', 'Xin lỗi', 'Cảm ơn nhiều'], correctIndex: 1, explanation: 'Câu chào trang trọng dùng khi gặp ai đó lần đầu tiên trong bối cảnh công việc.' },
  { id: 'q3', question: 'Khi trao danh thiếp (명함) cho đối tác Hàn, nên làm gì?', options: ['Đưa bằng một tay và cất ngay vào túi', 'Đưa/nhận bằng cả hai tay, hơi cúi đầu, đọc qua trước khi cất', 'Viết ghi chú lên danh thiếp ngay lúc nhận', 'Ném lên bàn cho nhanh'], correctIndex: 1, explanation: 'Trao đổi danh thiếp bằng hai tay kèm cúi đầu nhẹ là phép lịch sự công sở cơ bản ở Hàn Quốc.' },
]);

const c2 = doc('kbl401-2-1-phone-email', '2.1 — Business phone calls & email|||2.1 — Điện thoại & email thương mại',
  'Mẫu câu điện thoại công sở, cấu trúc email trang trọng 이메일, từ vựng 담당자/첨부파일/회신, cách để lại lời nhắn.',
  [[
    `<span class="eyebrow">KBL401 · Chapter 2 · Lesson 2.1</span>
<h2>Business phone calls &amp; email</h2>
<h3>Vocabulary</h3>
<pre><code>전화     jeonhwa       điện thoại / phone call
이메일   imeil         email
첨부파일 cheombu pail  tệp đính kèm / attachment
회신     hoesin        hồi âm, trả lời / reply
문의     munui         thắc mắc, yêu cầu thông tin / inquiry
담당자   damdangja     người phụ trách / person in charge
연락처   yeollakcheo   thông tin liên lạc / contact info
부재중   bujaejung     vắng mặt, không có ở chỗ / not available
</code></pre>
<h3>Phone phrases</h3>
<pre><code>여보세요, ABC무역 김민수입니다.
Yeoboseyo, ABC muyeok Gim Minsu-imnida.
Alo, tôi là Kim Min-su, công ty thương mại ABC.

죄송하지만 지금 자리에 안 계십니다.
Joesonghajiman jigeum jarie an gyesimnida.
Xin lỗi nhưng hiện anh/chị ấy không có ở chỗ ngồi.

메시지를 남겨 드릴까요?
Mesijireul namgyeo deurilkkayo?
Tôi có thể để lại lời nhắn giúp anh/chị không?

나중에 다시 전화드리겠습니다.
Najunge dasi jeonhwadeurigetseumnida.
Tôi sẽ gọi lại sau.
</code></pre>
<h3>Email opening &amp; closing</h3>
<pre><code>안녕하세요, 담당자님께.
Annyeonghaseyo, damdangjanimkke.
Kính gửi anh/chị phụ trách,

첨부파일을 확인해 주시기 바랍니다.
Cheombu-paireul hwaginhae jusigi baramnida.
Xin vui lòng kiểm tra tệp đính kèm.

빠른 회신 부탁드립니다.
Ppareun hoesin butakdeurimnida.
Mong được hồi âm sớm.
</code></pre>
<div class="callout"><span class="badge">Tip</span> Both phone calls and emails default to -습니다/-ㅂ니다 style; emails additionally open with "~께" (to/dear ~) and close with a request line like "부탁드립니다" (I ask for your favor).</div>`,
    `<span class="eyebrow">KBL401 · Chương 2 · Bài 2.1</span>
<h2>Điện thoại &amp; email thương mại</h2>
<h3>Từ vựng</h3>
<pre><code>전화     jeonhwa       điện thoại
이메일   imeil         email
첨부파일 cheombu pail  tệp đính kèm
회신     hoesin        hồi âm, trả lời
문의     munui         thắc mắc, yêu cầu thông tin
담당자   damdangja     người phụ trách
연락처   yeollakcheo   thông tin liên lạc
부재중   bujaejung     vắng mặt, không có ở chỗ
</code></pre>
<h3>Mẫu câu điện thoại</h3>
<pre><code>여보세요, ABC무역 김민수입니다.
Yeoboseyo, ABC muyeok Gim Minsu-imnida.
Alo, tôi là Kim Min-su, công ty thương mại ABC.

죄송하지만 지금 자리에 안 계십니다.
Joesonghajiman jigeum jarie an gyesimnida.
Xin lỗi nhưng hiện anh/chị ấy không có ở chỗ ngồi.

메시지를 남겨 드릴까요?
Mesijireul namgyeo deurilkkayo?
Tôi có thể để lại lời nhắn giúp anh/chị không?

나중에 다시 전화드리겠습니다.
Najunge dasi jeonhwadeurigetseumnida.
Tôi sẽ gọi lại sau.
</code></pre>
<h3>Mở đầu &amp; kết thúc email</h3>
<pre><code>안녕하세요, 담당자님께.
Annyeonghaseyo, damdangjanimkke.
Kính gửi anh/chị phụ trách,

첨부파일을 확인해 주시기 바랍니다.
Cheombu-paireul hwaginhae jusigi baramnida.
Xin vui lòng kiểm tra tệp đính kèm.

빠른 회신 부탁드립니다.
Ppareun hoesin butakdeurimnida.
Mong được hồi âm sớm.
</code></pre>
<div class="callout"><span class="badge">Mẹo</span> Cả điện thoại lẫn email đều mặc định dùng thể -습니다/-ㅂ니다; email còn mở đầu bằng "~께" (kính gửi ~) và kết bằng câu nhờ vả như "부탁드립니다" (mong được giúp đỡ).</div>`,
  ]]);

const c2q = quiz('kbl401-quiz-2', 'Quiz 2 — Phone & email|||Quiz 2 — Điện thoại & email', [
  { id: 'q1', question: '"메시지를 남겨 드릴까요?" dùng để làm gì khi nghe điện thoại công ty?', options: ['Hỏi có muốn để lại lời nhắn không', 'Từ chối nhận điện thoại', 'Xin số điện thoại', 'Kết thúc cuộc gọi ngay'], correctIndex: 0, explanation: 'Đây là câu hỏi lịch sự để đề nghị ghi lại lời nhắn cho người vắng mặt.' },
  { id: 'q2', question: '"담당자" nghĩa là gì?', options: ['Khách hàng', 'Người phụ trách', 'Tệp đính kèm', 'Giám đốc điều hành'], correctIndex: 1, explanation: '담당자 = người phụ trách một công việc/bộ phận cụ thể.' },
  { id: 'q3', question: 'Câu nào thường dùng để kết thúc một email thương mại, nhờ đối tác hồi âm sớm?', options: ['여보세요, 김민수입니다', '빠른 회신 부탁드립니다', '자리에 안 계십니다', '처음 뵙겠습니다'], correctIndex: 1, explanation: '"빠른 회신 부탁드립니다" (mong được hồi âm sớm) là câu kết phổ biến trong email công việc.' },
]);

const c3 = doc('kbl401-3-1-company-product', '3.1 — Company & product introduction|||3.1 — Giới thiệu công ty & sản phẩm',
  'Giới thiệu công ty 회사 소개: năm thành lập, trụ sở/chi nhánh, doanh thu; giới thiệu sản phẩm: chất lượng, sức cạnh tranh.',
  [[
    `<span class="eyebrow">KBL401 · Chapter 3 · Lesson 3.1</span>
<h2>Company &amp; product introduction</h2>
<h3>Vocabulary</h3>
<pre><code>회사 소개  hoesa sogae     giới thiệu công ty / company introduction
제품       jepum           sản phẩm / product
품질       pumjil          chất lượng / quality
설립       seollip         thành lập / founding, establishment
본사       bonsa           trụ sở chính / headquarters
지사       jisa            chi nhánh / branch office
매출       maechul         doanh thu / revenue, sales
경쟁력     gyeongjaengnyeok sức cạnh tranh / competitiveness
</code></pre>
<h3>Sample sentences — introducing the company</h3>
<pre><code>저희 회사는 2010년에 설립되었습니다.
Jeohui hoesaneun 2010nyeone seollibdoeeotseumnida.
Công ty chúng tôi được thành lập năm 2010.

본사는 서울에 있고, 하노이에 지사가 있습니다.
Bonsaneun Seoure itgo, Hanoie jisaga itseumnida.
Trụ sở chính đặt tại Seoul, và có chi nhánh ở Hà Nội.

작년 매출은 전년 대비 15% 증가했습니다.
Jangnyeon maechureun jeonnyeon daebi 15% jeunggahaetseumnida.
Doanh thu năm ngoái tăng 15% so với năm trước.
</code></pre>
<h3>Sample sentences — pitching the product</h3>
<pre><code>이 제품은 품질이 뛰어납니다.
I jepumeun pumjiri ttwieonamnida.
Sản phẩm này có chất lượng vượt trội.

가격 대비 경쟁력이 높습니다.
Gagyeok daebi gyeongjaengnyeogi nopseumnida.
Sức cạnh tranh cao so với giá thành.
</code></pre>
<div class="callout"><span class="badge">Structure</span> A company pitch usually follows: founding year &amp; scale (설립/매출) → headquarters/branches (본사/지사) → product strength (품질/경쟁력). Keep each sentence in -습니다 style.</div>`,
    `<span class="eyebrow">KBL401 · Chương 3 · Bài 3.1</span>
<h2>Giới thiệu công ty &amp; sản phẩm</h2>
<h3>Từ vựng</h3>
<pre><code>회사 소개  hoesa sogae     giới thiệu công ty
제품       jepum           sản phẩm
품질       pumjil          chất lượng
설립       seollip         thành lập
본사       bonsa           trụ sở chính
지사       jisa            chi nhánh
매출       maechul         doanh thu
경쟁력     gyeongjaengnyeok sức cạnh tranh
</code></pre>
<h3>Mẫu câu — giới thiệu công ty</h3>
<pre><code>저희 회사는 2010년에 설립되었습니다.
Jeohui hoesaneun 2010nyeone seollibdoeeotseumnida.
Công ty chúng tôi được thành lập năm 2010.

본사는 서울에 있고, 하노이에 지사가 있습니다.
Bonsaneun Seoure itgo, Hanoie jisaga itseumnida.
Trụ sở chính đặt tại Seoul, và có chi nhánh ở Hà Nội.

작년 매출은 전년 대비 15% 증가했습니다.
Jangnyeon maechureun jeonnyeon daebi 15% jeunggahaetseumnida.
Doanh thu năm ngoái tăng 15% so với năm trước.
</code></pre>
<h3>Mẫu câu — giới thiệu sản phẩm</h3>
<pre><code>이 제품은 품질이 뛰어납니다.
I jepumeun pumjiri ttwieonamnida.
Sản phẩm này có chất lượng vượt trội.

가격 대비 경쟁력이 높습니다.
Gagyeok daebi gyeongjaengnyeogi nopseumnida.
Sức cạnh tranh cao so với giá thành.
</code></pre>
<div class="callout"><span class="badge">Cấu trúc</span> Một bài giới thiệu công ty thường theo thứ tự: năm thành lập &amp; quy mô (설립/매출) → trụ sở/chi nhánh (본사/지사) → điểm mạnh sản phẩm (품질/경쟁력). Giữ mỗi câu ở thể -습니다.</div>`,
  ]]);

const c3q = quiz('kbl401-quiz-3', 'Quiz 3 — Company & product|||Quiz 3 — Công ty & sản phẩm', [
  { id: 'q1', question: '"매출" nghĩa là gì?', options: ['Chi nhánh', 'Doanh thu', 'Chất lượng', 'Trụ sở chính'], correctIndex: 1, explanation: '매출 = doanh thu, doanh số bán hàng.' },
  { id: 'q2', question: 'Câu "본사는 서울에 있고, 하노이에 지사가 있습니다" nói về điều gì?', options: ['Giá sản phẩm', 'Trụ sở chính ở Seoul, chi nhánh ở Hà Nội', 'Ngày ký hợp đồng', 'Số lượng nhân viên'], correctIndex: 1, explanation: '본사 = trụ sở chính, 지사 = chi nhánh; câu này mô tả vị trí hai nơi đó.' },
  { id: 'q3', question: 'Thứ tự hợp lý khi giới thiệu công ty theo bài học là gì?', options: ['Sản phẩm → giá → thành lập', 'Thành lập/quy mô → trụ sở/chi nhánh → điểm mạnh sản phẩm', 'Chi nhánh → hợp đồng → thanh toán', 'Chỉ nói doanh thu'], correctIndex: 1, explanation: 'Bài giới thiệu công ty thường đi từ 설립/매출 → 본사/지사 → 품질/경쟁력.' },
]);

const c4 = doc('kbl401-4-1-quote-order', '4.1 — Quotes & orders|||4.1 — Hỏi giá, báo giá & đặt hàng',
  'Bảng báo giá 견적서, đơn đặt hàng 주문서, số lượng/đơn giá/giảm giá, hỏi số lượng đặt hàng tối thiểu.',
  [[
    `<span class="eyebrow">KBL401 · Chapter 4 · Lesson 4.1</span>
<h2>Quotes &amp; orders</h2>
<h3>Vocabulary</h3>
<pre><code>견적서       gyeonjeokseo       bảng báo giá / quotation
가격         gagyeok            giá cả / price
주문서       jumunseo           đơn đặt hàng / purchase order
수량         suryang            số lượng / quantity
단가         dan-ga             đơn giá / unit price
할인         halin              giảm giá / discount
최소 주문량 choeso jumullyang  số lượng đặt hàng tối thiểu / MOQ
</code></pre>
<h3>Dialogue — asking for a quote</h3>
<pre><code>A: 견적서를 보내 주시겠습니까?
   Gyeonjeokseoreul bonae jusigetseumnikka?
   Anh/chị có thể gửi bảng báo giá cho tôi được không?

B: 네, 오늘 중으로 이메일로 보내드리겠습니다.
   Ne, oneul jung-euro imeillo bonaedeurigetseumnida.
   Vâng, tôi sẽ gửi qua email trong hôm nay.

A: 100개 주문하면 할인이 가능한가요?
   100gae jumunhamyeon halini ganeunghangayo?
   Nếu đặt 100 cái thì có được giảm giá không?

B: 최소 주문량은 50개이고, 100개 이상은 10% 할인됩니다.
   Choeso jumullyangeun 50gaeigo, 100gae isangeun 10% halindoemnida.
   Số lượng tối thiểu là 50 cái, từ 100 cái trở lên được giảm 10%.
</code></pre>
<div class="callout"><span class="badge">Number sense</span> Quotes use Sino-Korean numbers (일, 이, 삼…) for money/quantity: 십 만 원 (100,000 won), 백 개 (100 units) — keep pure-Korean numbers (하나, 둘…) for counting people/age instead.</div>`,
    `<span class="eyebrow">KBL401 · Chương 4 · Bài 4.1</span>
<h2>Hỏi giá, báo giá &amp; đặt hàng</h2>
<h3>Từ vựng</h3>
<pre><code>견적서       gyeonjeokseo       bảng báo giá
가격         gagyeok            giá cả
주문서       jumunseo           đơn đặt hàng
수량         suryang            số lượng
단가         dan-ga             đơn giá
할인         halin              giảm giá
최소 주문량 choeso jumullyang  số lượng đặt hàng tối thiểu (MOQ)
</code></pre>
<h3>Hội thoại — hỏi báo giá</h3>
<pre><code>A: 견적서를 보내 주시겠습니까?
   Gyeonjeokseoreul bonae jusigetseumnikka?
   Anh/chị có thể gửi bảng báo giá cho tôi được không?

B: 네, 오늘 중으로 이메일로 보내드리겠습니다.
   Ne, oneul jung-euro imeillo bonaedeurigetseumnida.
   Vâng, tôi sẽ gửi qua email trong hôm nay.

A: 100개 주문하면 할인이 가능한가요?
   100gae jumunhamyeon halini ganeunghangayo?
   Nếu đặt 100 cái thì có được giảm giá không?

B: 최소 주문량은 50개이고, 100개 이상은 10% 할인됩니다.
   Choeso jumullyangeun 50gaeigo, 100gae isangeun 10% halindoemnida.
   Số lượng tối thiểu là 50 cái, từ 100 cái trở lên được giảm 10%.
</code></pre>
<div class="callout"><span class="badge">Số đếm</span> Báo giá dùng số Hán-Hàn (일, 이, 삼…) cho tiền/số lượng: 십만 원 (100.000 won), 백 개 (100 cái) — số thuần Hàn (하나, 둘…) chỉ dùng đếm người/tuổi.</div>`,
  ]]);

const c4q = quiz('kbl401-quiz-4', 'Quiz 4 — Quotes & orders|||Quiz 4 — Báo giá & đặt hàng', [
  { id: 'q1', question: '"최소 주문량" nghĩa là gì?', options: ['Đơn giá', 'Số lượng đặt hàng tối thiểu (MOQ)', 'Bảng báo giá', 'Giảm giá'], correctIndex: 1, explanation: '최소 주문량 = Minimum Order Quantity, số lượng ít nhất phải đặt.' },
  { id: 'q2', question: 'Theo hội thoại, đặt từ 100 cái trở lên được giảm bao nhiêu phần trăm?', options: ['5%', '10%', '15%', 'Không giảm'], correctIndex: 1, explanation: 'B nói "100개 이상은 10% 할인됩니다" — từ 100 cái trở lên giảm 10%.' },
  { id: 'q3', question: 'Khi nói về giá tiền và số lượng hàng hoá trong tiếng Hàn thương mại, nên dùng hệ số đếm nào?', options: ['Số thuần Hàn (하나, 둘…)', 'Số Hán-Hàn (일, 이, 삼…)', 'Chữ cái La-tinh', 'Không cần số đếm'], correctIndex: 1, explanation: 'Tiền và số lượng lớn dùng số Hán-Hàn; số thuần Hàn dành cho đếm người/tuổi/vật nhỏ theo đơn vị riêng.' },
]);

const c5 = doc('kbl401-5-1-negotiation-contract', '5.1 — Negotiation & signing contracts|||5.1 — Đàm phán & ký hợp đồng',
  'Đàm phán 협상, hợp đồng 계약서, điều kiện/điều khoản 조건/조항, ký tên 서명, thoả thuận 합의, tiền phạt vi phạm 위약금.',
  [[
    `<span class="eyebrow">KBL401 · Chapter 5 · Lesson 5.1</span>
<h2>Negotiation &amp; signing contracts</h2>
<h3>Vocabulary</h3>
<pre><code>협상    hyeopsang    đàm phán / negotiation
계약서  gyeyakseo    hợp đồng / contract
조건    jogeon       điều kiện / condition, terms
조항    johang       điều khoản / clause
서명    seomyeong    ký tên / signature
합의    habui        thoả thuận / agreement
위약금  wiyakgeum    tiền phạt vi phạm hợp đồng / penalty for breach
</code></pre>
<h3>Dialogue — reaching agreement</h3>
<pre><code>A: 가격 조건에 대해 다시 협상하고 싶습니다.
   Gagyeok jogeone daehae dasi hyeopsanghago sipseumnida.
   Chúng tôi muốn đàm phán lại về điều kiện giá cả.

B: 어떤 조건을 원하십니까?
   Eotteon jogeoneul wonhasimnikka?
   Anh/chị muốn điều kiện như thế nào?

A: 결제 기한을 30일로 조정해 주시면 좋겠습니다.
   Gyeolje gihaneul 30ilro jojeonghae jusimyeon jokesseumnida.
   Nếu điều chỉnh thời hạn thanh toán thành 30 ngày thì tốt.

B: 좋습니다. 그 조건에 합의할 수 있습니다.
   Joseumnida. Geu jogeone habuihal su itseumnida.
   Được. Chúng tôi có thể đồng ý với điều kiện đó.

B: 계약서에 서명해 주시기 바랍니다.
   Gyeyakseoe seomyeonghae jusigi baramnida.
   Xin vui lòng ký vào hợp đồng.
</code></pre>
<div class="callout"><span class="badge">Careful reading</span> Before signing (서명), check every clause (조항) — especially the penalty clause (위약금 조항) — since a contract in Korean business culture is treated as final and binding.</div>`,
    `<span class="eyebrow">KBL401 · Chương 5 · Bài 5.1</span>
<h2>Đàm phán &amp; ký hợp đồng</h2>
<h3>Từ vựng</h3>
<pre><code>협상    hyeopsang    đàm phán
계약서  gyeyakseo    hợp đồng
조건    jogeon       điều kiện
조항    johang       điều khoản
서명    seomyeong    ký tên
합의    habui        thoả thuận
위약금  wiyakgeum    tiền phạt vi phạm hợp đồng
</code></pre>
<h3>Hội thoại — đi đến thoả thuận</h3>
<pre><code>A: 가격 조건에 대해 다시 협상하고 싶습니다.
   Gagyeok jogeone daehae dasi hyeopsanghago sipseumnida.
   Chúng tôi muốn đàm phán lại về điều kiện giá cả.

B: 어떤 조건을 원하십니까?
   Eotteon jogeoneul wonhasimnikka?
   Anh/chị muốn điều kiện như thế nào?

A: 결제 기한을 30일로 조정해 주시면 좋겠습니다.
   Gyeolje gihaneul 30ilro jojeonghae jusimyeon jokesseumnida.
   Nếu điều chỉnh thời hạn thanh toán thành 30 ngày thì tốt.

B: 좋습니다. 그 조건에 합의할 수 있습니다.
   Joseumnida. Geu jogeone habuihal su itseumnida.
   Được. Chúng tôi có thể đồng ý với điều kiện đó.

B: 계약서에 서명해 주시기 바랍니다.
   Gyeyakseoe seomyeonghae jusigi baramnida.
   Xin vui lòng ký vào hợp đồng.
</code></pre>
<div class="callout"><span class="badge">Đọc kỹ</span> Trước khi ký (서명), kiểm tra từng điều khoản (조항) — nhất là điều khoản phạt vi phạm (위약금 조항) — vì hợp đồng trong văn hoá kinh doanh Hàn Quốc được xem là ràng buộc cuối cùng.</div>`,
  ]]);

const c5q = quiz('kbl401-quiz-5', 'Quiz 5 — Negotiation & contract|||Quiz 5 — Đàm phán & hợp đồng', [
  { id: 'q1', question: '"위약금" nghĩa là gì?', options: ['Chữ ký', 'Tiền phạt vi phạm hợp đồng', 'Điều kiện giá', 'Bảng báo giá'], correctIndex: 1, explanation: '위약금 = khoản tiền phạt khi một bên vi phạm điều khoản hợp đồng.' },
  { id: 'q2', question: 'Trong hội thoại, bên A muốn điều chỉnh điều kiện nào?', options: ['Số lượng đặt hàng', 'Thời hạn thanh toán (결제 기한)', 'Tên công ty', 'Địa chỉ giao hàng'], correctIndex: 1, explanation: 'A đề nghị "결제 기한을 30일로 조정" — điều chỉnh thời hạn thanh toán thành 30 ngày.' },
  { id: 'q3', question: 'Trước khi ký hợp đồng (계약서), theo bài học nên đặc biệt chú ý điều gì?', options: ['Màu mực chữ ký', 'Đọc kỹ từng điều khoản, nhất là điều khoản phạt vi phạm (위약금)', 'Số trang hợp đồng', 'Phông chữ hợp đồng'], correctIndex: 1, explanation: 'Hợp đồng được xem là ràng buộc cuối cùng nên phải đọc kỹ mọi điều khoản (조항), đặc biệt là 위약금.' },
]);

const c6 = doc('kbl401-6-1-payment-trade', '6.1 — Payment, shipping & import/export|||6.1 — Thanh toán, giao hàng & xuất nhập khẩu',
  'Thanh toán 결제/송금/신용장, giao hàng 선적, thông quan 통관, xuất khẩu 수출, nhập khẩu 수입, thuế quan 관세.',
  [[
    `<span class="eyebrow">KBL401 · Chapter 6 · Lesson 6.1</span>
<h2>Payment, shipping &amp; import/export</h2>
<h3>Vocabulary</h3>
<pre><code>결제    gyeolje       thanh toán / payment
송금    songgeum      chuyển khoản / bank transfer
신용장  sinyongjang   thư tín dụng (L/C) / letter of credit
선적    seonjeok      xếp hàng lên tàu, giao hàng / shipment
통관    tonggwan      thông quan / customs clearance
수출    suchul        xuất khẩu / export
수입    suip          nhập khẩu / import
관세    gwanse        thuế quan / tariff, customs duty
</code></pre>
<h3>Sample sentences</h3>
<pre><code>신용장으로 결제하겠습니다.
Sinyongjangeuro gyeoljehagetseumnida.
Chúng tôi sẽ thanh toán bằng thư tín dụng.

선적은 다음 주에 이루어집니다.
Seonjeogeun daeum jue irueojimnida.
Việc giao hàng sẽ diễn ra vào tuần tới.

통관 절차에 시간이 좀 걸립니다.
Tonggwan jeolchae sigani jom geollimnida.
Thủ tục thông quan mất một chút thời gian.

이 제품에는 관세가 부과됩니다.
I jepume-neun gwansega bugwadoemnida.
Sản phẩm này bị áp thuế quan.
</code></pre>
<div class="callout"><span class="badge">Trade chain</span> The typical flow is: <strong>계약 (contract) → 결제/신용장 (payment/L/C) → 선적 (shipment) → 통관 (customs clearance) → 수입/수출 완료</strong> (import/export complete) — the same vocabulary applies whether Vietnam is exporting to Korea or the reverse.</div>`,
    `<span class="eyebrow">KBL401 · Chương 6 · Bài 6.1</span>
<h2>Thanh toán, giao hàng &amp; xuất nhập khẩu</h2>
<h3>Từ vựng</h3>
<pre><code>결제    gyeolje       thanh toán
송금    songgeum      chuyển khoản
신용장  sinyongjang   thư tín dụng (L/C)
선적    seonjeok      xếp hàng lên tàu, giao hàng
통관    tonggwan      thông quan
수출    suchul        xuất khẩu
수입    suip          nhập khẩu
관세    gwanse        thuế quan
</code></pre>
<h3>Mẫu câu</h3>
<pre><code>신용장으로 결제하겠습니다.
Sinyongjangeuro gyeoljehagetseumnida.
Chúng tôi sẽ thanh toán bằng thư tín dụng.

선적은 다음 주에 이루어집니다.
Seonjeogeun daeum jue irueojimnida.
Việc giao hàng sẽ diễn ra vào tuần tới.

통관 절차에 시간이 좀 걸립니다.
Tonggwan jeolchae sigani jom geollimnida.
Thủ tục thông quan mất một chút thời gian.

이 제품에는 관세가 부과됩니다.
I jepume-neun gwansega bugwadoemnida.
Sản phẩm này bị áp thuế quan.
</code></pre>
<div class="callout"><span class="badge">Chuỗi thương mại</span> Quy trình điển hình: <strong>계약 (hợp đồng) → 결제/신용장 (thanh toán/L/C) → 선적 (giao hàng) → 통관 (thông quan) → hoàn tất 수입/수출</strong> — cùng bộ từ vựng áp dụng dù Việt Nam xuất khẩu sang Hàn hay ngược lại.</div>`,
  ]]);

const c6q = quiz('kbl401-quiz-6', 'Quiz 6 — Payment & trade|||Quiz 6 — Thanh toán & xuất nhập khẩu', [
  { id: 'q1', question: '"신용장" là gì?', options: ['Hợp đồng lao động', 'Thư tín dụng (L/C) dùng trong thanh toán quốc tế', 'Danh thiếp', 'Bảng báo giá'], correctIndex: 1, explanation: '신용장 = Letter of Credit, một hình thức thanh toán phổ biến trong thương mại quốc tế.' },
  { id: 'q2', question: '"통관" nghĩa là gì?', options: ['Xuất khẩu', 'Thông quan (thủ tục hải quan)', 'Chuyển khoản', 'Giảm giá'], correctIndex: 1, explanation: '통관 = thủ tục thông quan hàng hoá qua hải quan.' },
  { id: 'q3', question: 'Theo chuỗi thương mại trong bài, bước nào diễn ra NGAY SAU khi ký hợp đồng (계약)?', options: ['통관 (thông quan)', '결제/신용장 (thanh toán/L/C)', '수입 hoàn tất', '선적 (giao hàng)'], correctIndex: 1, explanation: 'Chuỗi là 계약 → 결제/신용장 → 선적 → 통관 → hoàn tất xuất/nhập khẩu.' },
]);

const c7 = doc('kbl401-7-1-meetings-presentations', '7.1 — Meetings, presentations & work reports|||7.1 — Họp, thuyết trình & báo cáo công việc',
  'Cuộc họp 회의, nghị trình 안건, thuyết trình 발표, báo cáo 보고서, ý kiến 의견, lịch trình 일정, hạn chót 마감일.',
  [[
    `<span class="eyebrow">KBL401 · Chapter 7 · Lesson 7.1</span>
<h2>Meetings, presentations &amp; work reports</h2>
<h3>Vocabulary</h3>
<pre><code>회의    hoeui       cuộc họp / meeting
안건    angeon      nghị trình, vấn đề thảo luận / agenda item
발표    balpyo      thuyết trình / presentation
보고서  bogoseo     báo cáo / report
의견    uigyeon     ý kiến / opinion
일정    iljeong     lịch trình / schedule
마감일  magamil     hạn chót / deadline
</code></pre>
<h3>Sample sentences — running a meeting</h3>
<pre><code>오늘 회의 안건은 세 가지입니다.
Oneul hoeui angeoneun se gajiimnida.
Nghị trình cuộc họp hôm nay có ba mục.

발표를 시작하겠습니다.
Balpyoreul sijakhagetseumnida.
Tôi xin bắt đầu bài thuyết trình.

이 부분에 대해 의견이 있으십니까?
I bubune daehae uigyeoni isseusimnikka?
Anh/chị có ý kiến gì về phần này không?

보고서는 이번 주 금요일까지 제출해 주세요.
Bogoseoneun ibeon ju geumyoilkkaji jechulhae juseyo.
Xin nộp báo cáo trước thứ Sáu tuần này.

마감일을 지켜 주시기 바랍니다.
Magamireul jikyeo jusigi baramnida.
Xin vui lòng tuân thủ hạn chót.
</code></pre>
<div class="callout"><span class="badge">Structure</span> A Korean business meeting typically opens by stating the 안건 (agenda), runs through discussion with 의견 (opinions) invited from junior staff last, and closes by confirming 일정/마감일 (schedule/deadline) for follow-up.</div>`,
    `<span class="eyebrow">KBL401 · Chương 7 · Bài 7.1</span>
<h2>Họp, thuyết trình &amp; báo cáo công việc</h2>
<h3>Từ vựng</h3>
<pre><code>회의    hoeui       cuộc họp
안건    angeon      nghị trình, vấn đề thảo luận
발표    balpyo      thuyết trình
보고서  bogoseo     báo cáo
의견    uigyeon     ý kiến
일정    iljeong     lịch trình
마감일  magamil     hạn chót
</code></pre>
<h3>Mẫu câu — điều hành cuộc họp</h3>
<pre><code>오늘 회의 안건은 세 가지입니다.
Oneul hoeui angeoneun se gajiimnida.
Nghị trình cuộc họp hôm nay có ba mục.

발표를 시작하겠습니다.
Balpyoreul sijakhagetseumnida.
Tôi xin bắt đầu bài thuyết trình.

이 부분에 대해 의견이 있으십니까?
I bubune daehae uigyeoni isseusimnikka?
Anh/chị có ý kiến gì về phần này không?

보고서는 이번 주 금요일까지 제출해 주세요.
Bogoseoneun ibeon ju geumyoilkkaji jechulhae juseyo.
Xin nộp báo cáo trước thứ Sáu tuần này.

마감일을 지켜 주시기 바랍니다.
Magamireul jikyeo jusigi baramnida.
Xin vui lòng tuân thủ hạn chót.
</code></pre>
<div class="callout"><span class="badge">Cấu trúc</span> Một cuộc họp công sở Hàn Quốc thường mở đầu bằng nêu 안건 (nghị trình), thảo luận và mời 의견 (ý kiến) — nhân viên cấp dưới thường phát biểu sau cùng, rồi kết bằng chốt 일정/마감일 (lịch trình/hạn chót) cho bước tiếp theo.</div>`,
  ]]);

const c7q = quiz('kbl401-quiz-7', 'Quiz 7 — Meetings & reports|||Quiz 7 — Họp & báo cáo', [
  { id: 'q1', question: '"안건" nghĩa là gì?', options: ['Hạn chót', 'Nghị trình / vấn đề thảo luận trong cuộc họp', 'Báo cáo', 'Ý kiến'], correctIndex: 1, explanation: '안건 = mục/vấn đề được đưa ra thảo luận trong cuộc họp.' },
  { id: 'q2', question: 'Câu "마감일을 지켜 주시기 바랍니다" có nghĩa là gì?', options: ['Xin bắt đầu thuyết trình', 'Xin vui lòng tuân thủ hạn chót', 'Xin nộp báo cáo bằng tiếng Anh', 'Xin dời cuộc họp'], correctIndex: 1, explanation: '지키다 = tuân thủ/giữ đúng; câu này nhắc tuân thủ đúng hạn chót (마감일).' },
  { id: 'q3', question: 'Theo bài học, trong một cuộc họp Hàn Quốc, nhân viên cấp dưới thường phát biểu ý kiến (의견) khi nào?', options: ['Đầu tiên, trước cả cấp trên', 'Sau cùng, sau khi cấp trên đã nói', 'Không bao giờ được phát biểu', 'Chỉ qua email sau họp'], correctIndex: 1, explanation: 'Văn hoá tôn ti công sở Hàn thường để cấp dưới phát biểu ý kiến sau cùng.' },
]);

const c8 = doc('kbl401-8-1-review-culture', '8.1 — Review: integrated scenarios & Korean office culture|||8.1 — Ôn tập: tình huống thương mại tổng hợp & văn hoá công sở Hàn',
  'Ôn tập toàn bộ từ vựng 7 chương qua một tình huống liên tục; văn hoá công sở: 회식, 눈치, 선배/후배, 야근, tôn ti trật tự.',
  [[
    `<span class="eyebrow">KBL401 · Chapter 8 · Lesson 8.1</span>
<h2>Review: integrated scenarios &amp; Korean office culture</h2>
<h3>Culture vocabulary</h3>
<pre><code>회식    hoesik    tiệc liên hoan công ty / company dinner
눈치    nunchi    sự tinh ý, khéo léo quan sát tình huống / social tact
선배    seonbae   tiền bối, người vào trước / senior colleague
후배    hubae     hậu bối, người vào sau / junior colleague
야근    yageun    làm thêm giờ / working overtime
회식 문화 hoesik munhwa  văn hoá tiệc liên hoan / dinner culture
</code></pre>
<h3>End-to-end scenario (review of Ch.1–7)</h3>
<pre><code>1. 명함 교환 & 인사 (Ch.1) — 처음 뵙겠습니다, 잘 부탁드립니다.
2. 이메일로 문의 (Ch.2) — 견적서를 요청하는 이메일을 보냅니다.
3. 회사 소개 (Ch.3) — 저희 회사는 2010년에 설립되었습니다.
4. 견적 & 주문 (Ch.4) — 100개 주문하면 10% 할인됩니다.
5. 협상 & 계약 (Ch.5) — 결제 기한에 합의하고 계약서에 서명합니다.
6. 결제 & 선적 (Ch.6) — 신용장으로 결제하고 통관 절차를 거칩니다.
7. 회의 보고 (Ch.7) — 발표를 시작하겠습니다, 마감일을 지켜 주십시오.
</code></pre>
<h3>Office culture notes</h3>
<ul>
<li><strong>눈치 (social tact)</strong> — reading the room before speaking or acting is highly valued; rushing to voice disagreement can be seen as 눈치 없다 (tactless).</li>
<li><strong>선배/후배</strong> — seniority by join-date (not just age) shapes speech level and who pours drinks/leaves first at a 회식.</li>
<li><strong>회식</strong> — after-work team dinners build relationships; declining occasionally is fine, but never expected to be rude about it.</li>
<li><strong>야근</strong> — overtime culture is shifting but still common; asking "먼저 가도 될까요?" (may I leave first?) toward superiors is a common courtesy.</li>
</ul>
<div class="callout"><span class="badge">Exam tip</span> TOPIK 4-5 business scenarios often chain several chapters together (greeting → email → quote → negotiate → confirm) — practice reading a full email or dialogue thread, not just isolated sentences.</div>`,
    `<span class="eyebrow">KBL401 · Chương 8 · Bài 8.1</span>
<h2>Ôn tập: tình huống thương mại tổng hợp &amp; văn hoá công sở Hàn</h2>
<h3>Từ vựng văn hoá</h3>
<pre><code>회식    hoesik    tiệc liên hoan công ty
눈치    nunchi    sự tinh ý, khéo léo quan sát tình huống
선배    seonbae   tiền bối, người vào công ty trước
후배    hubae     hậu bối, người vào công ty sau
야근    yageun    làm thêm giờ
회식 문화 hoesik munhwa  văn hoá tiệc liên hoan
</code></pre>
<h3>Tình huống xuyên suốt (ôn tập Chương 1–7)</h3>
<pre><code>1. Trao danh thiếp & chào hỏi (Ch.1) — 처음 뵙겠습니다, 잘 부탁드립니다.
2. Hỏi thông tin qua email (Ch.2) — gửi email yêu cầu 견적서.
3. Giới thiệu công ty (Ch.3) — 저희 회사는 2010년에 설립되었습니다.
4. Báo giá & đặt hàng (Ch.4) — đặt 100 cái được giảm 10%.
5. Đàm phán & hợp đồng (Ch.5) — thống nhất thời hạn thanh toán, ký 계약서.
6. Thanh toán & giao hàng (Ch.6) — thanh toán bằng 신용장, làm thủ tục 통관.
7. Báo cáo trong cuộc họp (Ch.7) — bắt đầu 발표, nhắc tuân thủ 마감일.
</code></pre>
<h3>Ghi chú văn hoá công sở</h3>
<ul>
<li><strong>눈치 (sự tinh ý)</strong> — biết quan sát tình huống trước khi nói/hành động rất được coi trọng; vội vàng phản đối có thể bị xem là "눈치 없다" (thiếu tinh ý).</li>
<li><strong>선배/후배</strong> — thứ bậc theo thời điểm vào công ty (không chỉ tuổi tác) ảnh hưởng cách xưng hô và ai rót rượu/về trước trong 회식.</li>
<li><strong>회식</strong> — tiệc liên hoan sau giờ làm giúp gắn kết đội nhóm; thỉnh thoảng từ chối là bình thường, nhưng không nên tỏ ra bất lịch sự.</li>
<li><strong>야근</strong> — văn hoá làm thêm giờ đang thay đổi nhưng vẫn phổ biến; hỏi "먼저 가도 될까요?" (tôi về trước được không?) với cấp trên là phép lịch sự thường gặp.</li>
</ul>
<div class="callout"><span class="badge">Mẹo thi</span> Tình huống thương mại TOPIK 4-5 thường nối liền nhiều chương (chào hỏi → email → báo giá → đàm phán → xác nhận) — nên luyện đọc trọn một email hay chuỗi hội thoại, đừng chỉ học câu rời rạc.</div>`,
  ]]);

const c8q = quiz('kbl401-quiz-8', 'Quiz 8 — Review & office culture|||Quiz 8 — Ôn tập & văn hoá công sở', [
  { id: 'q1', question: '"눈치" trong văn hoá công sở Hàn Quốc nghĩa là gì?', options: ['Tiền phạt hợp đồng', 'Sự tinh ý, khéo léo quan sát tình huống trước khi nói/hành động', 'Danh thiếp', 'Thư tín dụng'], correctIndex: 1, explanation: '눈치 là khả năng đọc tình huống/không khí — rất được coi trọng ở công sở Hàn Quốc.' },
  { id: 'q2', question: 'Trong quan hệ 선배/후배 (tiền bối/hậu bối) ở công ty Hàn, yếu tố nào quyết định thứ bậc?', options: ['Tuổi tác tuyệt đối', 'Thời điểm vào công ty trước/sau', 'Bằng cấp học vấn', 'Số lượng hợp đồng đã ký'], correctIndex: 1, explanation: '선배/후배 dựa theo thời điểm gia nhập công ty, không chỉ dựa vào tuổi.' },
  { id: 'q3', question: 'Theo tình huống ôn tập, thứ tự đúng của một giao dịch thương mại điển hình là gì?', options: ['Ký hợp đồng → chào hỏi → báo giá → thanh toán', 'Chào hỏi/danh thiếp → email hỏi giá → báo giá & đặt hàng → đàm phán & ký hợp đồng → thanh toán & giao hàng → báo cáo họp', 'Thanh toán → chào hỏi → hợp đồng → email', 'Báo cáo họp → chào hỏi → giao hàng → đàm phán'], correctIndex: 1, explanation: 'Chuỗi tình huống ôn tập đi theo đúng thứ tự 8 chương: chào hỏi → email → báo giá/đặt hàng → đàm phán/hợp đồng → thanh toán/giao hàng → họp báo cáo.' },
]);

export default {
  semester: { code: 'FPTU_Hola7', name: 'Kỳ 7', ordinal: 9 },
  course: {
    courseCode: 'KBL401',
    slug: 'kbl401-tieng-han-thuong-mai',
    title: 'Tiếng Hàn thương mại',
    level: 'INTERMEDIATE',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/KBL401.webp',
    shortDescription: 'Business Korean (TOPIK 4-5): honorifics & cards, phone/email, company & product pitch, quotes/orders, negotiation & contracts, payment/shipping/trade, meetings & reports, office culture. Hangeul + romaja + dialogues & quizzes.|||Tiếng Hàn thương mại (TOPIK 4-5): kính ngữ & danh thiếp, điện thoại/email, giới thiệu công ty & sản phẩm, báo giá/đặt hàng, đàm phán & hợp đồng, thanh toán/giao hàng/xuất nhập khẩu, họp & báo cáo, văn hoá công sở. Hangeul + romaja + hội thoại & quiz.',
    description: 'Môn <strong>KBL401 — Business Korean / Tiếng Hàn thương mại</strong> (ngành Ngôn ngữ Hàn, kỳ 7, trình độ TOPIK 4-5) trang bị tiếng Hàn dùng trong môi trường doanh nghiệp. Từ <strong>chào hỏi công sở &amp; kính ngữ 존댓말</strong> (danh thiếp 명함) → <strong>điện thoại &amp; email 이메일</strong> → <strong>giới thiệu công ty &amp; sản phẩm 회사 소개</strong> → <strong>hỏi giá, báo giá &amp; đặt hàng 견적/주문</strong> → <strong>đàm phán &amp; ký hợp đồng 협상/계약</strong> → <strong>thanh toán, giao hàng &amp; xuất nhập khẩu 결제/무역</strong> → <strong>họp, thuyết trình &amp; báo cáo 회의/발표</strong> → <strong>ôn tập tổng hợp &amp; văn hoá công sở Hàn</strong>. Mỗi chương có Hangeul (한글) + romaja + nghĩa Việt/Anh, hội thoại thực tế và bảng từ vựng thương mại, kèm quiz.',
    whatYouLearn: 'Kính ngữ -습니다/-ㅂ니다 & phép trao danh thiếp; mẫu câu điện thoại & cấu trúc email trang trọng; giới thiệu công ty (설립/본사/지사/매출) & sản phẩm (품질/경쟁력); từ vựng báo giá/đặt hàng (견적서/단가/할인/최소 주문량); đàm phán & điều khoản hợp đồng (협상/조건/서명/위약금); thanh toán & xuất nhập khẩu (결제/신용장/선적/통관/관세); điều hành họp & báo cáo (안건/발표/보고서/마감일); văn hoá công sở Hàn Quốc (눈치/선배-후배/회식/야근).',
    requirements: 'Đã hoàn thành các môn tiếng Hàn nền tảng trình độ sơ-trung cấp (tương đương TOPIK 3+); biết đọc Hangeul thông thạo.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình 비즈니스 한국어/무역 한국어 trên FLM, từ điển, TOPIK, YouTube, công cụ gõ Hangeul, lộ trình.', lessons: [taiLieu] },
    { title: 'Chương 1 — Chào hỏi công sở, danh thiếp & kính ngữ|||Chapter 1 — Greetings, business cards & honorifics', description: '존댓말, 명함, chức danh, mẫu câu chào hỏi trang trọng.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Điện thoại & email thương mại|||Chapter 2 — Business phone & email', description: '전화, 이메일, 담당자, mẫu câu & cấu trúc email.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Giới thiệu công ty & sản phẩm|||Chapter 3 — Company & product introduction', description: '회사 소개, 설립/본사/지사/매출, 품질/경쟁력.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Hỏi giá, báo giá & đặt hàng|||Chapter 4 — Quotes & orders', description: '견적서, 주문서, 단가, 할인, 최소 주문량.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Đàm phán & ký hợp đồng|||Chapter 5 — Negotiation & contracts', description: '협상, 계약서, 조건/조항, 서명, 위약금.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Thanh toán, giao hàng & xuất nhập khẩu|||Chapter 6 — Payment, shipping & trade', description: '결제/신용장, 선적, 통관, 수출/수입, 관세.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Họp, thuyết trình & báo cáo|||Chapter 7 — Meetings, presentations & reports', description: '회의, 안건, 발표, 보고서, 마감일.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Ôn tập & văn hoá công sở Hàn|||Chapter 8 — Review & Korean office culture', description: 'Tình huống thương mại tổng hợp; 눈치, 선배/후배, 회식, 야근.', lessons: [c8, c8q] },
  ],
};
