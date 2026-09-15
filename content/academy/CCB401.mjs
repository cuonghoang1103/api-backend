/**
 * CCB401 — Chinese Business Culture and Communication. Ngành Ngôn ngữ Trung,
 * FPTU Kỳ 5. Giáo trình tham khảo (trích dẫn, không upload PDF): "Chinese
 * Business Culture" (Kwintessential); "The Chinese Negotiation" (HBR, Graham
 * & Lam); 商务文化与沟通. 8 chương: Nho giáo & tổng quan, quan hệ (关系),
 * thể diện (面子), nghi thức & tiệc tùng (酒桌文化), đàm phán, giao tiếp
 * gián tiếp/high-context, cấp bậc & văn hoá doanh nghiệp, đa văn hoá Trung-Việt.
 * Giữ NGUYÊN slug/semester/thumb(v3). ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('ccb401-0-0-materials', 'Course materials|||Tài liệu tham khảo',
  'Ba nguồn tham khảo chính của môn (trích dẫn, không upload PDF) + tài liệu miễn phí, hợp pháp.',
  [[
    `<span class="eyebrow">CCB401 · Course materials</span>
<h2>Reference materials</h2>
<p class="lead">This course draws on three main references. They are <strong>cited</strong>, not distributed as PDFs — use the official FLM (flm.fpt.edu.vn) slide deck as the primary source, and the links below for further reading.</p>
<h3>📘 Core references (cited)</h3>
<ul>
<li><strong>"Chinese Business Culture"</strong> — Kwintessential cross-cultural guides.</li>
<li><strong>"The Chinese Negotiation"</strong> — John L. Graham &amp; N. Mark Lam, <em>Harvard Business Review</em>, October 2003.</li>
<li><strong>商务文化与沟通</strong> (Business Culture &amp; Communication) — Chinese-language business-culture textbook.</li>
</ul>
<h3>🌐 Free, legitimate resources</h3>
<ul>
<li><a href="https://www.kwintessential.co.uk/resources/guides/guide-to-china" target="_blank" rel="noopener">Kwintessential — Guide to China</a></li>
<li><a href="https://hbr.org/2003/10/the-chinese-negotiation" target="_blank" rel="noopener">HBR — "The Chinese Negotiation" (Graham &amp; Lam, 2003)</a></li>
<li><a href="https://www.export.gov.uk/" target="_blank" rel="noopener">UK Department for Business &amp; Trade — country trade guides</a></li>
</ul>
<h3>▶️ YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@AsianBossVN" target="_blank" rel="noopener">Asian Boss</a> — phỏng vấn đường phố về văn hoá &amp; xã hội Trung Quốc</li>
<li><a href="https://www.youtube.com/@ChinaBusinessInsider" target="_blank" rel="noopener">China Business Insider</a> — case study kinh doanh thực tế</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://www.pleco.com/" target="_blank" rel="noopener">Pleco</a> — từ điển Hán-Anh có pinyin, tra thuật ngữ nhanh</li>
<li><a href="https://www.mdbg.net/chinese/dictionary" target="_blank" rel="noopener">MDBG Chinese Dictionary</a> — tra chữ Hán &amp; pinyin trực tuyến</li>
</ul>
<div class="callout"><span class="badge">Study path</span>
<ol>
<li><strong>Foundations</strong> — Confucian values, guanxi, mianzi (Chapters 1–3).</li>
<li><strong>Practice</strong> — meeting etiquette, negotiation style (Chapters 4–5).</li>
<li><strong>Depth</strong> — indirect/high-context communication, hierarchy &amp; corporate culture (Chapters 6–7).</li>
<li><strong>Application</strong> — real China-Vietnam cross-cultural cases (Chapter 8).</li>
</ol></div>`,
    `<span class="eyebrow">CCB401 · Tài liệu tham khảo</span>
<h2>Nguồn tham khảo</h2>
<p class="lead">Môn học dựa trên ba nguồn tham khảo chính. Các nguồn này được <strong>trích dẫn</strong>, không phát PDF — dùng slide chính thức trên <strong>FLM</strong> (flm.fpt.edu.vn) làm nguồn chuẩn, và các liên kết dưới đây để đọc thêm.</p>
<h3>📘 Nguồn tham khảo chính (trích dẫn)</h3>
<ul>
<li><strong>"Chinese Business Culture"</strong> — bộ hướng dẫn liên văn hoá của Kwintessential.</li>
<li><strong>"The Chinese Negotiation"</strong> — John L. Graham &amp; N. Mark Lam, <em>Harvard Business Review</em>, tháng 10/2003.</li>
<li><strong>商务文化与沟通</strong> (Văn hoá &amp; Giao tiếp Thương mại) — giáo trình tiếng Trung về văn hoá kinh doanh.</li>
</ul>
<h3>🌐 Tài liệu miễn phí, hợp pháp</h3>
<ul>
<li><a href="https://www.kwintessential.co.uk/resources/guides/guide-to-china" target="_blank" rel="noopener">Kwintessential — Hướng dẫn về Trung Quốc</a></li>
<li><a href="https://hbr.org/2003/10/the-chinese-negotiation" target="_blank" rel="noopener">HBR — "The Chinese Negotiation" (Graham &amp; Lam, 2003)</a></li>
<li><a href="https://www.export.gov.uk/" target="_blank" rel="noopener">UK Department for Business &amp; Trade — hướng dẫn thương mại theo quốc gia</a></li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@AsianBossVN" target="_blank" rel="noopener">Asian Boss</a> — phỏng vấn đường phố về văn hoá &amp; xã hội Trung Quốc</li>
<li><a href="https://www.youtube.com/@ChinaBusinessInsider" target="_blank" rel="noopener">China Business Insider</a> — tình huống kinh doanh thực tế</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://www.pleco.com/" target="_blank" rel="noopener">Pleco</a> — từ điển Hán-Anh có pinyin, tra thuật ngữ nhanh</li>
<li><a href="https://www.mdbg.net/chinese/dictionary" target="_blank" rel="noopener">MDBG Chinese Dictionary</a> — tra chữ Hán &amp; pinyin trực tuyến</li>
</ul>
<div class="callout"><span class="badge">Lộ trình học</span>
<ol>
<li><strong>Nền tảng</strong> — giá trị Nho giáo, guanxi, mianzi (Chương 1–3).</li>
<li><strong>Thực hành</strong> — nghi thức gặp gỡ, phong cách đàm phán (Chương 4–5).</li>
<li><strong>Đào sâu</strong> — giao tiếp gián tiếp/high-context, cấp bậc &amp; văn hoá doanh nghiệp (Chương 6–7).</li>
<li><strong>Ứng dụng</strong> — tình huống thực tế Trung-Việt (Chương 8).</li>
</ol></div>`,
  ]]);

const intro = doc('ccb401-0-1-overview', 'Course overview: Chinese Business Culture & Communication|||Tổng quan: Văn hoá & Giao tiếp Thương mại Trung Quốc',
  'Vì sao văn hoá quyết định thành-bại một thương vụ với đối tác Trung Quốc; lộ trình 8 chương từ Nho giáo đến tình huống Trung-Việt thực tế.',
  [[
    `<span class="eyebrow">CCB401 · Lesson 0.1 · Overview</span>
<h2>Chinese Business Culture and Communication</h2>
<p class="lead">A brilliant product and a fair price are not enough to close a deal in China — <strong>how</strong> you build trust, present yourself, and read the room often matters more than <strong>what</strong> you offer. This course gives you the cultural literacy behind Chinese business behaviour: values, relationships, etiquette, negotiation style, and communication patterns.</p>
<h3>Why this matters for a Chinese-language graduate</h3>
<p>Fluent Mandarin without cultural fluency still produces awkward, sometimes deal-breaking, mistakes — praising someone in the wrong context, refusing tea, or correcting a senior person in public. This course pairs each cultural concept with the exact <strong>Chinese term and pinyin</strong> a business professional actually uses.</p>
<h3>Roadmap — 8 chapters</h3>
<ol>
<li>Overview of Chinese business culture &amp; Confucian values</li>
<li>Guanxi (关系) &amp; network-building</li>
<li>Mianzi (面子) &amp; face-saving communication</li>
<li>Meeting etiquette, business cards &amp; banquets (酒桌文化)</li>
<li>Chinese negotiation style &amp; decision-making</li>
<li>Indirect, high-context &amp; nonverbal communication</li>
<li>Hierarchy, power &amp; corporate culture</li>
<li>Cross-cultural China–Vietnam business communication &amp; real cases</li>
</ol>
<div class="callout"><span class="badge">How to study</span> Each chapter has one reading (theory + Chinese terms + a real-style situation) and one quiz. Learn the pinyin with tone marks — a wrong tone in a toast or a business card exchange is a small but very visible mistake.</div>`,
    `<span class="eyebrow">CCB401 · Bài 0.1 · Tổng quan</span>
<h2>Văn hoá &amp; Giao tiếp Thương mại Trung Quốc</h2>
<p class="lead">Sản phẩm tốt và giá hợp lý là chưa đủ để chốt một thương vụ ở Trung Quốc — <strong>cách</strong> bạn xây dựng lòng tin, thể hiện bản thân và đọc tình huống thường quan trọng hơn <strong>thứ</strong> bạn chào bán. Môn này trang bị hiểu biết văn hoá đằng sau hành vi kinh doanh của người Trung Quốc: giá trị, quan hệ, nghi thức, phong cách đàm phán và cách giao tiếp.</p>
<h3>Vì sao quan trọng với sinh viên ngành Ngôn ngữ Trung</h3>
<p>Giỏi tiếng Trung mà thiếu am hiểu văn hoá vẫn dễ mắc lỗi ngượng ngùng, thậm chí làm đổ vỡ thương vụ — khen sai lúc, từ chối trà không đúng cách, hay sửa lỗi cấp trên trước mặt người khác. Môn này gắn mỗi khái niệm văn hoá với đúng <strong>thuật ngữ tiếng Trung và pinyin</strong> mà người làm kinh doanh thực sự dùng.</p>
<h3>Lộ trình — 8 chương</h3>
<ol>
<li>Tổng quan văn hoá kinh doanh Trung Quốc &amp; giá trị Nho giáo</li>
<li>Quan hệ (关系 guanxi) &amp; xây dựng mạng lưới</li>
<li>Thể diện (面子 mianzi) &amp; giao tiếp giữ thể diện</li>
<li>Nghi thức gặp gỡ, danh thiếp &amp; tiệc tùng (酒桌文化)</li>
<li>Phong cách đàm phán &amp; ra quyết định của người Trung Quốc</li>
<li>Giao tiếp gián tiếp, ngữ cảnh cao (high-context) &amp; phi ngôn ngữ</li>
<li>Cấp bậc, quyền lực &amp; văn hoá doanh nghiệp Trung Quốc</li>
<li>Giao tiếp thương mại đa văn hoá Trung-Việt &amp; tình huống thực tế</li>
</ol>
<div class="callout"><span class="badge">Cách học</span> Mỗi chương có một bài đọc (lý thuyết + thuật ngữ tiếng Trung + một tình huống sát thực tế) và một quiz. Học kỹ pinyin có dấu thanh — sai một dấu thanh khi chúc rượu hay trao danh thiếp là lỗi nhỏ nhưng rất dễ bị chú ý.</div>`,
  ]]);

const c1 = doc('ccb401-1-1-confucian-values', '1.1 — Overview of Chinese business culture & Confucian values|||1.1 — Tổng quan văn hoá kinh doanh & giá trị Nho giáo',
  'Năm dòng chảy Nho giáo trong kinh doanh hiện đại: tập thể, cấp bậc, hoà hợp, quan hệ dài hạn, có qua có lại.',
  [[
    `<span class="eyebrow">CCB401 · Chapter 1 · Lesson 1.1</span>
<h2>Overview of Chinese business culture &amp; Confucian values</h2>
<p class="lead">Doing business in China means operating inside a culture shaped for over two thousand years by <strong>Confucianism (儒家思想 Rújiā sīxiǎng)</strong>. Five ideas from that tradition still drive everyday business behaviour.</p>
<h3>Five Confucian threads in modern business</h3>
<ul>
<li><strong>Collectivism (集体主义 jítǐ zhǔyì)</strong> — the group (family, company, nation) comes before the individual; decisions weigh group harmony over personal gain.</li>
<li><strong>Hierarchy (等级 děngjí)</strong> — the traditional "five relationships" (ruler-subject, father-son, husband-wife, elder-younger, friend-friend) map onto boss-employee, senior-junior today.</li>
<li><strong>Harmony (和谐 héxié)</strong> — open conflict is avoided; disagreement is expressed indirectly to preserve group cohesion.</li>
<li><strong>Long-termism</strong> — a <strong>long-term relationship (长期关系 chángqī guānxi)</strong> is built over years, not closed in a single meeting.</li>
<li><strong>Reciprocity</strong> — a favour given is a favour owed; this underlies the whole <em>guanxi</em> system covered in Chapter 2.</li>
</ul>
<pre><code>Term table — Chapter 1
Hanzi       Pinyin              Meaning
儒家思想    Rújiā sīxiǎng       Confucian thought
集体主义    jítǐ zhǔyì          Collectivism
等级        děngjí              Hierarchy
和谐        héxié               Harmony
商务文化    shāngwù wénhuà      Business culture
长期关系    chángqī guānxi      Long-term relationship
</code></pre>
<h3>Why this matters for a deal</h3>
<p>A negotiator who reads silence as "no interest," or treats a signed contract as the end of the discussion, is reading the room with the wrong lens. In a Confucian-influenced culture, signing is often the <em>start</em> of the relationship — maintaining <strong>héxié</strong> and repaying favours (人情 rénqíng, Chapter 2) continues long after.</p>
<div class="callout"><span class="badge">Case</span> A European supplier closed a deal in one meeting and then stopped calling until the next order was due. Their Chinese partner read this as purely transactional — and moved future orders to a competitor who kept in touch between deals.</div>`,
    `<span class="eyebrow">CCB401 · Chương 1 · Bài 1.1</span>
<h2>Tổng quan văn hoá kinh doanh Trung Quốc &amp; giá trị Nho giáo</h2>
<p class="lead">Làm kinh doanh ở Trung Quốc nghĩa là vận hành trong một nền văn hoá được <strong>Nho giáo (儒家思想 Rújiā sīxiǎng)</strong> định hình hơn hai nghìn năm. Năm mạch tư tưởng Nho giáo vẫn dẫn dắt hành vi kinh doanh hằng ngày.</p>
<h3>Năm dòng chảy Nho giáo trong kinh doanh hiện đại</h3>
<ul>
<li><strong>Chủ nghĩa tập thể (集体主义 jítǐ zhǔyì)</strong> — nhóm (gia đình, công ty, quốc gia) đặt trên cá nhân; quyết định cân nhắc hoà hợp tập thể hơn lợi ích riêng.</li>
<li><strong>Cấp bậc (等级 děngjí)</strong> — "ngũ luân" truyền thống (vua-tôi, cha-con, chồng-vợ, trên-dưới, bạn-bạn) ánh xạ thành sếp-nhân viên, cấp trên-cấp dưới ngày nay.</li>
<li><strong>Hoà hợp (和谐 héxié)</strong> — tránh xung đột công khai; bất đồng được bày tỏ gián tiếp để giữ sự gắn kết nhóm.</li>
<li><strong>Tư duy dài hạn</strong> — một <strong>quan hệ dài hạn (长期关系 chángqī guānxi)</strong> được xây trong nhiều năm, không chốt xong trong một buổi họp.</li>
<li><strong>Có qua có lại</strong> — ơn cho đi là ơn phải trả; đây là nền tảng của cả hệ thống <em>guanxi</em> ở Chương 2.</li>
</ul>
<pre><code>Bảng thuật ngữ — Chương 1
Hán tự      Pinyin              Nghĩa
儒家思想    Rújiā sīxiǎng       Tư tưởng Nho giáo
集体主义    jítǐ zhǔyì          Chủ nghĩa tập thể
等级        děngjí              Cấp bậc
和谐        héxié               Hoà hợp
商务文化    shāngwù wénhuà      Văn hoá kinh doanh
长期关系    chángqī guānxi      Quan hệ dài hạn
</code></pre>
<h3>Vì sao điều này quan trọng cho một thương vụ</h3>
<p>Người đàm phán đọc sự im lặng là "không quan tâm", hay coi hợp đồng đã ký là điểm kết, đang đọc sai tình huống. Trong văn hoá chịu ảnh hưởng Nho giáo, ký hợp đồng thường là <em>khởi đầu</em> của quan hệ — việc giữ <strong>hoà hợp</strong> và trả ơn (人情 rénqíng, Chương 2) tiếp tục lâu dài sau đó.</p>
<div class="callout"><span class="badge">Tình huống</span> Một nhà cung cấp châu Âu chốt xong hợp đồng trong một buổi họp rồi ngừng liên lạc cho tới đơn hàng kế tiếp. Đối tác Trung Quốc hiểu đây là quan hệ thuần giao dịch — và chuyển các đơn hàng sau cho đối thủ luôn giữ liên lạc giữa các thương vụ.</div>`,
  ]]);

const c1q = quiz('ccb401-quiz-1', 'Quiz 1 — Confucian values|||Quiz 1 — Giá trị Nho giáo', [
  { id: 'q1', question: '"儒家思想" (Nho giáo) ảnh hưởng thế nào đến văn hoá kinh doanh Trung Quốc hiện đại?', options: ['Đề cao cá nhân hơn tập thể', 'Đề cao tập thể, cấp bậc và hoà hợp', 'Không còn ảnh hưởng gì trong kinh doanh', 'Chỉ còn ý nghĩa tôn giáo, tâm linh'], correctIndex: 1, explanation: 'Nho giáo để lại 5 mạch tư tưởng vẫn dẫn dắt kinh doanh: tập thể, cấp bậc, hoà hợp, dài hạn, có qua có lại.' },
  { id: 'q2', question: 'Trong văn hoá kinh doanh chịu ảnh hưởng Nho giáo, việc ký hợp đồng thường được xem là?', options: ['Kết thúc quan hệ hợp tác', 'Khởi đầu của một quan hệ lâu dài', 'Không quan trọng bằng bữa tiệc sau đó', 'Chỉ là thủ tục pháp lý đơn thuần'], correctIndex: 1, explanation: 'Ký hợp đồng thường là điểm bắt đầu — việc duy trì hoà hợp và trả ơn tiếp diễn lâu dài sau đó.' },
  { id: 'q3', question: 'Từ nào trong bảng thuật ngữ Chương 1 có nghĩa là "hoà hợp"?', options: ['集体主义 (jítǐ zhǔyì)', '和谐 (héxié)', '等级 (děngjí)', '商务文化 (shāngwù wénhuà)'], correctIndex: 1, explanation: '和谐 (héxié) = hoà hợp — tránh xung đột công khai để giữ gắn kết nhóm.' },
]);

const c2 = doc('ccb401-2-1-guanxi', '2.1 — Guanxi (关系) & network-building|||2.1 — Quan hệ (关系 guanxi) & xây dựng mạng lưới',
  'Guanxi là ngân hàng ơn nghĩa: rénqíng (nợ ơn), zhongjianren (người trung gian), thời gian xây dựng trước khi bàn việc.',
  [[
    `<span class="eyebrow">CCB401 · Chapter 2 · Lesson 2.1</span>
<h2>Guanxi (关系) &amp; network-building</h2>
<p class="lead"><strong>Guanxi (关系 guānxi)</strong> is a network of reciprocal personal relationships that carries real business weight — access, trust and speed often flow through guanxi rather than through a cold pitch.</p>
<h3>How guanxi works</h3>
<ul>
<li><strong>关系 (guānxi)</strong> — a personal connection built on mutual obligation, not just acquaintance.</li>
<li><strong>拉关系 (lā guānxi)</strong> — "pulling connections," actively building a relationship (dinners, small gifts, introductions) before business is discussed.</li>
<li><strong>人情 (rénqíng)</strong> — a favour or emotional debt; think of guanxi as a bank account where favours are deposits.</li>
<li><strong>还人情 (huán rénqíng)</strong> — to repay a favour; failing to repay damages the relationship permanently.</li>
<li><strong>中间人 (zhōngjiānrén)</strong> — a trusted middleman who makes the introduction; a warm introduction outperforms a cold email by a wide margin.</li>
<li><strong>老朋友 (lǎo péngyou)</strong> — "old friend," a term used for a long-trusted partner, even one met only a handful of times.</li>
</ul>
<pre><code>Term table — Chapter 2
Hanzi       Pinyin          Meaning
关系        guānxi          Personal connections/network
拉关系      lā guānxi       To build connections
人情        rénqíng         Favour / emotional debt
还人情      huán rénqíng    To repay a favour
中间人      zhōngjiānrén    Middleman / intermediary
老朋友      lǎo péngyou     Old (trusted) friend
</code></pre>
<h3>Building guanxi before the deal</h3>
<p>Expect several meals, small favours, and personal conversation before a Chinese counterpart moves to substantive terms — this is not delay for its own sake, it is <strong>rénqíng</strong> being deposited on both sides so the eventual deal rests on trust, not just a contract clause.</p>
<div class="callout"><span class="badge">Case</span> A startup emailed 40 Chinese manufacturers cold; two replied. The same founder asked an alumnus with China experience for a <strong>zhōngjiānrén</strong> introduction to one factory owner — that single warm introduction led to a signed order within three weeks.</div>`,
    `<span class="eyebrow">CCB401 · Chương 2 · Bài 2.1</span>
<h2>Quan hệ (关系 guanxi) &amp; xây dựng mạng lưới</h2>
<p class="lead"><strong>Guanxi (关系 guānxi)</strong> là mạng lưới quan hệ cá nhân có qua có lại, mang trọng lượng kinh doanh thật sự — cơ hội tiếp cận, lòng tin và tốc độ xử lý thường đi qua guanxi hơn là một lời chào hàng lạnh lùng.</p>
<h3>Guanxi vận hành thế nào</h3>
<ul>
<li><strong>关系 (guānxi)</strong> — một mối quan hệ cá nhân dựa trên nghĩa vụ qua lại, không chỉ là quen biết.</li>
<li><strong>拉关系 (lā guānxi)</strong> — "kéo quan hệ", chủ động xây dựng mối quan hệ (ăn tối, quà nhỏ, giới thiệu) trước khi bàn chuyện kinh doanh.</li>
<li><strong>人情 (rénqíng)</strong> — một ơn nghĩa hoặc khoản nợ tình cảm; hãy hình dung guanxi như một tài khoản ngân hàng, mỗi ơn nghĩa là một khoản gửi vào.</li>
<li><strong>还人情 (huán rénqíng)</strong> — trả ơn; không trả ơn sẽ làm hỏng quan hệ vĩnh viễn.</li>
<li><strong>中间人 (zhōngjiānrén)</strong> — người trung gian đáng tin cậy đứng ra giới thiệu; một lời giới thiệu ấm áp hiệu quả hơn nhiều so với email lạnh.</li>
<li><strong>老朋友 (lǎo péngyou)</strong> — "bạn cũ", cách gọi đối tác đã được tin cậy lâu dài, kể cả khi mới gặp vài lần.</li>
</ul>
<pre><code>Bảng thuật ngữ — Chương 2
Hán tự      Pinyin          Nghĩa
关系        guānxi          Quan hệ/mạng lưới cá nhân
拉关系      lā guānxi       Xây dựng quan hệ
人情        rénqíng         Ơn nghĩa / nợ tình cảm
还人情      huán rénqíng    Trả ơn
中间人      zhōngjiānrén    Người trung gian
老朋友      lǎo péngyou     Bạn cũ (đáng tin cậy)
</code></pre>
<h3>Xây dựng guanxi trước khi vào việc</h3>
<p>Hãy chuẩn bị tinh thần cho vài bữa ăn, những ơn nhỏ và trò chuyện cá nhân trước khi đối tác Trung Quốc chuyển sang điều khoản thực chất — đây không phải là trì hoãn vô nghĩa, mà là <strong>rénqíng</strong> đang được "gửi vào" từ cả hai phía để thương vụ cuối cùng dựa trên lòng tin, không chỉ trên một điều khoản hợp đồng.</p>
<div class="callout"><span class="badge">Tình huống</span> Một startup gửi email lạnh cho 40 nhà sản xuất Trung Quốc, chỉ 2 nơi trả lời. Cũng người sáng lập đó nhờ một cựu sinh viên có kinh nghiệm ở Trung Quốc làm <strong>zhōngjiānrén</strong> giới thiệu tới một chủ xưởng — lời giới thiệu ấm áp duy nhất đó dẫn tới đơn hàng ký kết chỉ trong ba tuần.</div>`,
  ]]);

const c2q = quiz('ccb401-quiz-2', 'Quiz 2 — Guanxi|||Quiz 2 — Quan hệ (guanxi)', [
  { id: 'q1', question: '"关系" (guanxi) trong kinh doanh Trung Quốc nghĩa là gì?', options: ['Chỉ là quen biết xã giao', 'Mạng lưới quan hệ cá nhân có qua có lại', 'Một loại hợp đồng chính thức', 'Chức danh trong công ty'], correctIndex: 1, explanation: 'Guanxi là quan hệ cá nhân dựa trên nghĩa vụ qua lại, mang trọng lượng kinh doanh thật.' },
  { id: 'q2', question: 'Cách tiếp cận đối tác Trung Quốc lần đầu thường hiệu quả nhất là?', options: ['Gửi email chào hàng hàng loạt', 'Qua người trung gian (中间人) mà cả hai bên tin tưởng', 'Gọi điện thoại bất ngờ không hẹn trước', 'Đăng quảng cáo trên báo'], correctIndex: 1, explanation: 'Một lời giới thiệu ấm áp qua zhōngjiānrén hiệu quả hơn nhiều so với tiếp cận lạnh.' },
  { id: 'q3', question: '"人情" (rénqíng) trong quan hệ guanxi được hiểu là?', options: ['Một loại thuế kinh doanh', 'Ơn nghĩa/khoản nợ tình cảm cần đáp lại đúng lúc', 'Tên một nghi lễ tôn giáo', 'Giá trị hợp đồng bằng tiền'], correctIndex: 1, explanation: 'Rénqíng là ơn nghĩa — cho đi là nợ, và phải trả (还人情) để giữ quan hệ.' },
]);

const c3 = doc('ccb401-3-1-mianzi', '3.1 — Mianzi (面子) & face-saving communication|||3.1 — Thể diện (面子 mianzi) & giữ thể diện trong giao tiếp',
  'Cho thể diện, mất mặt, giữ thể diện, tranh thể diện, từ chối gián tiếp — quy tắc khen công khai/góp ý riêng tư.',
  [[
    `<span class="eyebrow">CCB401 · Chapter 3 · Lesson 3.1</span>
<h2>Mianzi (面子) &amp; face-saving communication</h2>
<p class="lead"><strong>Mianzi (面子 miànzi)</strong>, or "face," is a person's social standing, dignity and reputation in front of others. Protecting your own and others' mianzi is a daily discipline in Chinese business, not an occasional courtesy.</p>
<h3>Core face vocabulary</h3>
<ul>
<li><strong>给面子 (gěi miànzi)</strong> — "to give face": publicly showing someone respect, e.g. deferring to a senior even when a junior colleague did the actual work.</li>
<li><strong>丢脸 (diūliǎn)</strong> — "to lose face": public embarrassment, e.g. being corrected or criticized in front of others.</li>
<li><strong>留面子 (liú miànzi)</strong> — "to save face" for someone: phrasing bad news or a refusal so the other party is not embarrassed.</li>
<li><strong>争面子 (zhēng miànzi)</strong> — "to fight for face": competing for prestige or status, e.g. through gift value or banquet lavishness.</li>
<li><strong>不好意思 (bù hǎoyìsi)</strong> — "embarrassed/awkward," often used to soften an indirect refusal instead of a blunt "no."</li>
</ul>
<pre><code>Term table — Chapter 3
Hanzi       Pinyin          Meaning
面子        miànzi          Face / social standing
给面子      gěi miànzi      To give someone face
丢脸        diūliǎn         To lose face
留面子      liú miànzi      To save someone's face
争面子      zhēng miànzi    To compete for face/prestige
不好意思    bù hǎoyìsi      Embarrassed (soft refusal)
</code></pre>
<h3>The golden rule</h3>
<p><strong>Praise in public, correct in private.</strong> Never point out an error, contradict a number, or reject a proposal in front of a counterpart's boss or colleagues — do it one-on-one, or let the person save face by framing it as a joint problem ("maybe our figures differ") rather than their mistake.</p>
<div class="callout"><span class="badge">Case</span> A foreign engineer corrected a Chinese partner's calculation error in front of the partner's director. The number was fixed — but the deal stalled for two months while the partner's team quietly rebuilt confidence with their own director.</div>`,
    `<span class="eyebrow">CCB401 · Chương 3 · Bài 3.1</span>
<h2>Thể diện (面子 mianzi) &amp; giữ thể diện trong giao tiếp</h2>
<p class="lead"><strong>Mianzi (面子 miànzi)</strong>, hay "thể diện", là vị thế xã hội, phẩm giá và uy tín của một người trước mặt người khác. Giữ thể diện cho bản thân và cho người khác là kỷ luật hằng ngày trong kinh doanh Trung Quốc, không phải phép lịch sự thỉnh thoảng.</p>
<h3>Từ vựng cốt lõi về thể diện</h3>
<ul>
<li><strong>给面子 (gěi miànzi)</strong> — "cho thể diện": công khai thể hiện sự tôn trọng với ai đó, ví dụ nhường lời cho người cấp cao dù người thực làm việc là cấp dưới.</li>
<li><strong>丢脸 (diūliǎn)</strong> — "mất mặt": bị làm bẽ mặt công khai, ví dụ bị sửa lỗi hoặc phê bình trước mặt người khác.</li>
<li><strong>留面子 (liú miànzi)</strong> — "giữ thể diện" cho ai đó: diễn đạt tin xấu hoặc lời từ chối sao cho đối phương không bị bẽ mặt.</li>
<li><strong>争面子 (zhēng miànzi)</strong> — "tranh thể diện": cạnh tranh uy tín/địa vị, ví dụ qua giá trị quà tặng hay độ hoành tráng của bữa tiệc.</li>
<li><strong>不好意思 (bù hǎoyìsi)</strong> — "ngại/khó xử", thường dùng để làm mềm một lời từ chối gián tiếp thay vì nói thẳng "không".</li>
</ul>
<pre><code>Bảng thuật ngữ — Chương 3
Hán tự      Pinyin          Nghĩa
面子        miànzi          Thể diện/vị thế xã hội
给面子      gěi miànzi      Cho ai đó thể diện
丢脸        diūliǎn         Mất mặt
留面子      liú miànzi      Giữ thể diện cho ai đó
争面子      zhēng miànzi    Tranh thể diện/uy tín
不好意思    bù hǎoyìsi      Ngại/khó xử (từ chối mềm)
</code></pre>
<h3>Nguyên tắc vàng</h3>
<p><strong>Khen công khai, góp ý riêng tư.</strong> Không bao giờ chỉ ra lỗi, phản bác một con số, hay từ chối một đề xuất trước mặt cấp trên hoặc đồng nghiệp của đối tác — hãy làm việc đó riêng, một-một, hoặc để họ tự giữ thể diện bằng cách coi đó là vấn đề chung ("có lẽ số liệu hai bên đang khác nhau") thay vì lỗi của họ.</p>
<div class="callout"><span class="badge">Tình huống</span> Một kỹ sư nước ngoài sửa lỗi tính toán của đối tác Trung Quốc ngay trước mặt giám đốc của đối tác. Con số được sửa đúng — nhưng thương vụ đình trệ hai tháng trong khi đội của đối tác âm thầm gây dựng lại niềm tin với giám đốc của họ.</div>`,
  ]]);

const c3q = quiz('ccb401-quiz-3', 'Quiz 3 — Mianzi|||Quiz 3 — Thể diện (mianzi)', [
  { id: 'q1', question: '"面子" (mianzi) gần nghĩa nhất với khái niệm nào?', options: ['Thể diện/uy tín xã hội', 'Số tiền đặt cọc', 'Tên gọi hợp đồng', 'Chức danh công ty'], correctIndex: 0, explanation: 'Mianzi là vị thế xã hội, phẩm giá, uy tín trước mặt người khác.' },
  { id: 'q2', question: 'Nguyên tắc nào nên áp dụng khi cần góp ý hoặc phản bác đối tác Trung Quốc?', options: ['Nêu thẳng lỗi ngay trong cuộc họp đông người', 'Góp ý riêng tư, tránh làm mất mặt trước đám đông', 'Chỉ trích qua email gửi cho cả nhóm', 'Im lặng không góp ý bao giờ'], correctIndex: 1, explanation: 'Nguyên tắc vàng: khen công khai, góp ý/sửa lỗi riêng tư để không ai bị "diūliǎn" (mất mặt).' },
  { id: 'q3', question: '"给面子" (gěi miànzi) nghĩa là?', options: ['Từ chối thẳng thừng', 'Cho ai đó thể diện / tôn trọng công khai', 'Yêu cầu giảm giá', 'Huỷ cuộc hẹn'], correctIndex: 1, explanation: '给面子 = công khai thể hiện sự tôn trọng với ai đó, ví dụ nhường lời cho người cấp cao.' },
]);

const c4 = doc('ccb401-4-1-etiquette-banquet', '4.1 — Meeting etiquette, business cards & banquets (酒桌文化)|||4.1 — Nghi thức gặp gỡ, danh thiếp & tiệc tùng (酒桌文化)',
  'Trao danh thiếp hai tay, thứ tự chúc rượu, chỗ ngồi theo cấp bậc, văn hoá bàn tiệc nơi thương vụ thực sự được xây dựng.',
  [[
    `<span class="eyebrow">CCB401 · Chapter 4 · Lesson 4.1</span>
<h2>Meeting etiquette, business cards &amp; banquets (酒桌文化)</h2>
<p class="lead">First meetings and banquets are not small talk on the side of the deal — in Chinese business they <em>are</em> part of the deal, governed by specific etiquette.</p>
<h3>Business cards (名片 míngpiàn)</h3>
<ul>
<li><strong>双手递名片 (shuāngshǒu dì míngpiàn)</strong> — present and receive a business card with <em>both hands</em>, card facing the recipient.</li>
<li>Take a moment to read the card before putting it away — pocketing it immediately can read as disrespect.</li>
<li>Hand cards to the most senior person first; card design (title, company) signals hierarchy at a glance.</li>
</ul>
<h3>The banquet table (酒桌文化 jiǔzhuō wénhuà)</h3>
<ul>
<li><strong>请客 (qǐngkè)</strong> — to host/treat; the host usually orders and pays, and is expected to over-order slightly as a show of generosity.</li>
<li><strong>座位安排 (zuòwèi ānpái)</strong> — seating order: the seat facing the door is usually for the guest of honour or the most senior host.</li>
<li><strong>敬酒 (jìngjiǔ)</strong> — a formal toast; typically the host toasts the guest of honour first, then juniors toast seniors, moving down the hierarchy.</li>
<li><strong>干杯 (gānbēi)</strong> — "cheers/bottoms up," a full-glass toast; declining alcohol gracefully with tea is acceptable if done respectfully, not abruptly.</li>
</ul>
<pre><code>Term table — Chapter 4
Hanzi           Pinyin              Meaning
名片            míngpiàn            Business card
双手递名片      shuāngshǒu dì míngpiàn  Present card with both hands
敬酒            jìngjiǔ             Toast
干杯            gānbēi              Cheers / bottoms up
酒桌文化        jiǔzhuō wénhuà      Banquet/drinking-table culture
请客            qǐngkè              To host / treat
座位安排        zuòwèi ānpái        Seating arrangement
</code></pre>
<div class="callout"><span class="badge">Case</span> A visiting manager pocketed a partner's business card without glancing at it, then sat down before being shown a seat. Neither act was meant as rude — but the host's team quietly described the visitor afterward as "not very polite," and follow-up meetings cooled noticeably.</div>`,
    `<span class="eyebrow">CCB401 · Chương 4 · Bài 4.1</span>
<h2>Nghi thức gặp gỡ, danh thiếp &amp; tiệc tùng (酒桌文化)</h2>
<p class="lead">Buổi gặp đầu tiên và bữa tiệc không phải là phần "phụ" bên lề thương vụ — trong kinh doanh Trung Quốc, chúng <em>là</em> một phần của thương vụ, có nghi thức riêng.</p>
<h3>Danh thiếp (名片 míngpiàn)</h3>
<ul>
<li><strong>双手递名片 (shuāngshǒu dì míngpiàn)</strong> — trao và nhận danh thiếp bằng <em>cả hai tay</em>, mặt chữ hướng về phía người nhận.</li>
<li>Dành một chút thời gian đọc qua danh thiếp trước khi cất — cất ngay lập tức có thể bị hiểu là thiếu tôn trọng.</li>
<li>Trao danh thiếp cho người cấp cao nhất trước; thiết kế danh thiếp (chức danh, công ty) cho thấy cấp bậc chỉ trong một cái nhìn.</li>
</ul>
<h3>Bàn tiệc (酒桌文化 jiǔzhuō wénhuà)</h3>
<ul>
<li><strong>请客 (qǐngkè)</strong> — mời/đãi khách; người mời thường gọi món và trả tiền, và thường gọi hơi nhiều một chút để thể hiện sự hào phóng.</li>
<li><strong>座位安排 (zuòwèi ānpái)</strong> — thứ tự chỗ ngồi: chỗ đối diện cửa ra vào thường dành cho khách danh dự hoặc chủ tiệc cấp cao nhất.</li>
<li><strong>敬酒 (jìngjiǔ)</strong> — chúc rượu trang trọng; thường chủ tiệc chúc khách danh dự trước, rồi cấp dưới chúc cấp trên, theo thứ tự cấp bậc.</li>
<li><strong>干杯 (gānbēi)</strong> — "cạn ly"; một lời chúc uống hết ly; từ chối rượu bằng trà vẫn được chấp nhận nếu làm khéo léo, không đột ngột.</li>
</ul>
<pre><code>Bảng thuật ngữ — Chương 4
Hán tự          Pinyin              Nghĩa
名片            míngpiàn            Danh thiếp
双手递名片      shuāngshǒu dì míngpiàn  Trao danh thiếp bằng hai tay
敬酒            jìngjiǔ             Chúc rượu
干杯            gānbēi              Cạn ly
酒桌文化        jiǔzhuō wénhuà      Văn hoá bàn tiệc/chén rượu
请客            qǐngkè              Mời/đãi khách
座位安排        zuòwèi ānpái        Sắp xếp chỗ ngồi
</code></pre>
<div class="callout"><span class="badge">Tình huống</span> Một quản lý đến thăm cất danh thiếp của đối tác vào túi mà không liếc qua, rồi ngồi xuống trước khi được mời chỗ ngồi. Không hành động nào cố ý bất lịch sự — nhưng đội của bên chủ nhà sau đó âm thầm nhận xét vị khách "không lịch sự lắm", và các buổi họp tiếp theo rõ ràng nguội đi.</div>`,
  ]]);

const c4q = quiz('ccb401-quiz-4', 'Quiz 4 — Etiquette & banquets|||Quiz 4 — Nghi thức & tiệc tùng', [
  { id: 'q1', question: 'Khi nhận danh thiếp từ đối tác Trung Quốc, nên làm gì?', options: ['Nhận bằng một tay và cất ngay', 'Nhận bằng hai tay, đọc qua trước khi cất', 'Ném vào túi áo mà không nhìn', 'Từ chối nhận vì không cần thiết'], correctIndex: 1, explanation: '双手递名片: trao/nhận bằng hai tay; đọc qua trước khi cất thể hiện tôn trọng.' },
  { id: 'q2', question: '"酒桌文化" (jiǔzhuō wénhuà) là gì?', options: ['Luật cấm rượu bia trong kinh doanh', 'Văn hoá bàn tiệc/chén rượu, nơi phần lớn quan hệ kinh doanh được xây dựng', 'Tên một loại hợp đồng', 'Nghi lễ ký kết văn bản'], correctIndex: 1, explanation: 'Bàn tiệc là nơi diễn ra chúc rượu (敬酒), sắp xếp chỗ ngồi theo cấp bậc — phần quan trọng của xây dựng quan hệ.' },
  { id: 'q3', question: 'Trong sắp xếp chỗ ngồi tiệc kinh doanh Trung Quốc, vị trí đối diện cửa ra vào thường dành cho?', options: ['Người phục vụ', 'Khách mời danh dự/người cao cấp nhất', 'Người đến muộn nhất', 'Không có quy tắc nào'], correctIndex: 1, explanation: 'Zuòwèi ānpái: chỗ đối diện cửa thường là vị trí danh dự cho khách/chủ cấp cao nhất.' },
]);

const c5 = doc('ccb401-5-1-negotiation', '5.1 — Chinese negotiation style & decision-making|||5.1 — Phong cách đàm phán & ra quyết định của người Trung Quốc',
  'Đàm phán chậm có chủ đích, quyết định tập thể nhưng do một người chốt (一把手), chiến thuật trì hoãn, giá trị của nhượng bộ cuối.',
  [[
    `<span class="eyebrow">CCB401 · Chapter 5 · Lesson 5.1</span>
<h2>Chinese negotiation style &amp; decision-making</h2>
<p class="lead">Chinese negotiation is often slower and more indirect than Western counterparts expect — and the slowness is frequently a deliberate tactic, not inefficiency.</p>
<h3>Key patterns</h3>
<ul>
<li><strong>讨价还价 (tǎojiàhuánjià)</strong> — bargaining; an initial offer is rarely final, and long back-and-forth over price/terms is normal.</li>
<li><strong>慢慢来 (mànmàn lái)</strong> — "take it slow": a deliberate pace tests the other side's patience and commitment, and buys time to gather more information.</li>
<li><strong>集体决策 (jítǐ juécè)</strong> — collective decision-making: proposals are discussed and vetted by a group before being finalized.</li>
<li><strong>一把手 (yībǎshǒu)</strong> — "the number-one hand," the actual top decision-maker; this person may say little in the room, while a spokesperson does most of the talking. Identify who this is early.</li>
<li><strong>拖延战术 (tuōyán zhànshù)</strong> — delay tactics, used deliberately to pressure a counterpart who has a deadline.</li>
<li><strong>让步 (ràngbù)</strong> — a concession; concessions made late and reluctantly are valued far more than ones given early and easily.</li>
</ul>
<pre><code>Term table — Chapter 5
Hanzi           Pinyin              Meaning
讨价还价        tǎojiàhuánjià       Bargaining
慢慢来          mànmàn lái          Take it slow
集体决策        jítǐ juécè          Collective decision-making
一把手          yībǎshǒu            Top decision-maker
拖延战术        tuōyán zhànshù      Delay tactics
让步            ràngbù              Concession
</code></pre>
<h3>Practical advice</h3>
<p>Do not mistake the loudest speaker for the decision-maker (一把手), do not signal a hard deadline early (it becomes a lever the other side uses), and never give your best concession in the first round — hold something back for a later, more meaningful moment.</p>
<div class="callout"><span class="badge">Case</span> A Western firm, eager to close before a quarter-end deadline, offered its best discount in round one. The Chinese side then slowed the process further, aware the deadline meant more leverage remained on their side — the final price ended up lower than planned.</div>`,
    `<span class="eyebrow">CCB401 · Chương 5 · Bài 5.1</span>
<h2>Phong cách đàm phán &amp; ra quyết định của người Trung Quốc</h2>
<p class="lead">Đàm phán kiểu Trung Quốc thường chậm và gián tiếp hơn nhiều so với kỳ vọng của phía phương Tây — và sự chậm rãi đó thường là chiến thuật có chủ đích, không phải kém hiệu quả.</p>
<h3>Các khuôn mẫu chính</h3>
<ul>
<li><strong>讨价还价 (tǎojiàhuánjià)</strong> — mặc cả; đề nghị đầu tiên hiếm khi là cuối cùng, việc trả giá/điều khoản qua lại nhiều vòng là bình thường.</li>
<li><strong>慢慢来 (mànmàn lái)</strong> — "từ từ": nhịp độ chậm có chủ đích để thử độ kiên nhẫn và mức cam kết của đối phương, đồng thời tranh thủ thêm thời gian thu thập thông tin.</li>
<li><strong>集体决策 (jítǐ juécè)</strong> — ra quyết định tập thể: đề xuất được thảo luận và xem xét bởi cả nhóm trước khi chốt.</li>
<li><strong>一把手 (yībǎshǒu)</strong> — "người cầm trịch số một", người thực sự ra quyết định; người này có thể nói rất ít trong phòng họp trong khi người phát ngôn nói phần lớn. Cần nhận diện đúng người này càng sớm càng tốt.</li>
<li><strong>拖延战术 (tuōyán zhànshù)</strong> — chiến thuật trì hoãn, cố ý dùng để tạo áp lực lên đối tác đang có thời hạn (deadline).</li>
<li><strong>让步 (ràngbù)</strong> — nhượng bộ; nhượng bộ được đưa ra muộn và miễn cưỡng được đánh giá cao hơn nhiều so với nhượng bộ đưa sớm và dễ dàng.</li>
</ul>
<pre><code>Bảng thuật ngữ — Chương 5
Hán tự          Pinyin              Nghĩa
讨价还价        tǎojiàhuánjià       Mặc cả
慢慢来          mànmàn lái          Từ từ, chậm rãi
集体决策        jítǐ juécè          Ra quyết định tập thể
一把手          yībǎshǒu            Người ra quyết định thực sự
拖延战术        tuōyán zhànshù      Chiến thuật trì hoãn
让步            ràngbù              Nhượng bộ
</code></pre>
<h3>Lời khuyên thực tế</h3>
<p>Đừng nhầm người nói nhiều nhất là người ra quyết định (一把手), đừng để lộ thời hạn gấp của mình quá sớm (nó sẽ trở thành đòn bẩy cho đối phương), và đừng bao giờ đưa nhượng bộ tốt nhất ngay vòng đầu — hãy giữ lại điều gì đó cho thời điểm có ý nghĩa hơn về sau.</p>
<div class="callout"><span class="badge">Tình huống</span> Một công ty phương Tây, muốn chốt trước hạn cuối quý, đưa ra mức giảm giá tốt nhất ngay vòng một. Phía Trung Quốc sau đó càng kéo dài tiến trình hơn, vì biết deadline nghĩa là họ vẫn còn lợi thế đàm phán — giá cuối cùng thấp hơn dự tính ban đầu.</div>`,
  ]]);

const c5q = quiz('ccb401-quiz-5', 'Quiz 5 — Negotiation style|||Quiz 5 — Phong cách đàm phán', [
  { id: 'q1', question: '"一把手" (yībǎshǒu) trong đàm phán Trung Quốc ám chỉ ai?', options: ['Người nói nhiều nhất trên bàn', 'Người ra quyết định thực sự, có thể không nói nhiều', 'Phiên dịch viên', 'Nhân viên trẻ nhất trong đoàn'], correctIndex: 1, explanation: 'Yībǎshǒu là người cầm trịch thực sự — cần nhận diện đúng người này, không nhầm với người phát ngôn.' },
  { id: 'q2', question: 'Việc đàm phán Trung Quốc diễn ra chậm, nhiều vòng thường nhằm mục đích gì?', options: ['Chỉ vì thiếu tổ chức', 'Thử kiên nhẫn đối tác & thu thập thêm thông tin trước khi quyết định', 'Không có lý do, ngẫu nhiên', 'Vì luật pháp yêu cầu'], correctIndex: 1, explanation: 'Mànmàn lái (từ từ) thường là chiến thuật có chủ đích, không phải sự chậm trễ ngẫu nhiên.' },
  { id: 'q3', question: '"让步" (ràngbù) trong đàm phán nghĩa là?', options: ['Nhượng bộ', 'Ký hợp đồng', 'Huỷ giao dịch', 'Chúc rượu'], correctIndex: 0, explanation: 'Ràngbù = nhượng bộ; nên đưa ra muộn và có tính toán thay vì sớm và dễ dàng.' },
]);

const c6 = doc('ccb401-6-1-high-context', '6.1 — Indirect, high-context & nonverbal communication|||6.1 — Giao tiếp gián tiếp, ngữ cảnh cao (high-context) & phi ngôn ngữ',
  'Ngữ cảnh cao, im lặng, gật đầu, hàm ý ngoài lời, "để chúng tôi suy nghĩ thêm" là một lời từ chối mềm.',
  [[
    `<span class="eyebrow">CCB401 · Chapter 6 · Lesson 6.1</span>
<h2>Indirect, high-context &amp; nonverbal communication</h2>
<p class="lead">China is a classic <strong>high-context (高语境 gāo yǔjìng)</strong> culture: meaning lives as much in shared context, tone, silence and body language as in the words spoken.</p>
<h3>Reading between the lines</h3>
<ul>
<li><strong>委婉 (wěiwǎn)</strong> — euphemistic, indirect phrasing; bad news, refusals and criticism are softened rather than stated bluntly.</li>
<li><strong>我们考虑考虑 (wǒmen kǎolǜ kǎolǜ)</strong> — "we'll think about it/consider it"; in context this is very often a polite way of saying "no," not a genuine open question.</li>
<li><strong>沉默 (chénmò)</strong> — silence; it does not default to agreement. It can signal discomfort, disagreement, or a need to save face by not answering directly.</li>
<li><strong>点头 (diǎntóu)</strong> — a nod; often means "I am listening/I understand," not necessarily "I agree."</li>
<li><strong>察言观色 (chá yán guān sè)</strong> — "observe words, watch expressions": the skill of reading unspoken meaning from tone, posture and context.</li>
<li><strong>言外之意 (yánwài zhī yì)</strong> — "the meaning beyond the words," the implied message a listener is expected to infer.</li>
</ul>
<pre><code>Term table — Chapter 6
Hanzi           Pinyin              Meaning
高语境          gāo yǔjìng          High-context
委婉            wěiwǎn              Euphemistic / indirect
我们考虑考虑    wǒmen kǎolǜ kǎolǜ   "We'll think about it" (soft no)
沉默            chénmò              Silence
点头            diǎntóu             Nod
察言观色        chá yán guān sè     Read words & expressions
言外之意        yánwài zhī yì       The implied meaning
</code></pre>
<h3>Practical decoding</h3>
<p>Treat "maybe," "it's not very convenient," or a sudden topic change as likely refusals. Treat silence after a proposal as a prompt to pause and ask an open question, not a green light to proceed. And never assume a nod means a deal is agreed — confirm explicitly, ideally in writing, afterward.</p>
<div class="callout"><span class="badge">Case</span> A team announced a price increase and was met with silence, which they took as acceptance. It was, in fact, strong disapproval expressed the only way that preserved harmony in the room — the Chinese partner raised the objection privately, through an intermediary, two days later.</div>`,
    `<span class="eyebrow">CCB401 · Chương 6 · Bài 6.1</span>
<h2>Giao tiếp gián tiếp, ngữ cảnh cao (high-context) &amp; phi ngôn ngữ</h2>
<p class="lead">Trung Quốc là ví dụ điển hình của văn hoá <strong>ngữ cảnh cao (高语境 gāo yǔjìng)</strong>: ý nghĩa nằm nhiều ở bối cảnh chung, giọng điệu, sự im lặng và ngôn ngữ cơ thể chứ không chỉ ở lời nói ra.</p>
<h3>Đọc giữa các dòng</h3>
<ul>
<li><strong>委婉 (wěiwǎn)</strong> — cách diễn đạt uyển chuyển, gián tiếp; tin xấu, lời từ chối và phê bình thường được làm mềm thay vì nói thẳng.</li>
<li><strong>我们考虑考虑 (wǒmen kǎolǜ kǎolǜ)</strong> — "chúng tôi sẽ suy nghĩ thêm"; trong ngữ cảnh, đây thường là cách lịch sự để nói "không", không phải một câu hỏi mở thật sự.</li>
<li><strong>沉默 (chénmò)</strong> — im lặng; không mặc định là đồng ý. Có thể là dấu hiệu khó xử, không đồng ý, hoặc cách giữ thể diện bằng việc không trả lời trực tiếp.</li>
<li><strong>点头 (diǎntóu)</strong> — gật đầu; thường chỉ có nghĩa "tôi đang nghe/tôi hiểu", không nhất thiết là "tôi đồng ý".</li>
<li><strong>察言观色 (chá yán guān sè)</strong> — "quan sát lời nói, nhìn biểu cảm": kỹ năng đọc ý nghĩa chưa nói ra từ giọng điệu, tư thế và bối cảnh.</li>
<li><strong>言外之意 (yánwài zhī yì)</strong> — "ý nằm ngoài lời nói", thông điệp ngầm mà người nghe được kỳ vọng tự suy ra.</li>
</ul>
<pre><code>Bảng thuật ngữ — Chương 6
Hán tự          Pinyin              Nghĩa
高语境          gāo yǔjìng          Ngữ cảnh cao
委婉            wěiwǎn              Uyển chuyển/gián tiếp
我们考虑考虑    wǒmen kǎolǜ kǎolǜ   "Chúng tôi sẽ suy nghĩ thêm" (từ chối mềm)
沉默            chénmò              Im lặng
点头            diǎntóu             Gật đầu
察言观色        chá yán guān sè     Quan sát lời nói & biểu cảm
言外之意        yánwài zhī yì       Ý ngoài lời nói
</code></pre>
<h3>Cách giải mã thực tế</h3>
<p>Coi "có lẽ", "hơi bất tiện", hoặc việc đột ngột đổi chủ đề là dấu hiệu từ chối nhiều khả năng. Coi sự im lặng sau một đề xuất là gợi ý nên dừng lại và đặt câu hỏi mở, không phải tín hiệu để tiếp tục. Và đừng bao giờ mặc định một cái gật đầu nghĩa là đã đồng ý — hãy xác nhận rõ ràng, tốt nhất bằng văn bản, sau đó.</p>
<div class="callout"><span class="badge">Tình huống</span> Một đội thông báo tăng giá và nhận được sự im lặng, họ hiểu đó là chấp nhận. Thực ra đó là sự phản đối mạnh, được bày tỏ theo cách duy nhất giữ được hoà khí trong phòng — đối tác Trung Quốc nêu phản đối riêng tư, qua người trung gian, hai ngày sau đó.</div>`,
  ]]);

const c6q = quiz('ccb401-quiz-6', 'Quiz 6 — High-context communication|||Quiz 6 — Giao tiếp ngữ cảnh cao', [
  { id: 'q1', question: 'Trong giao tiếp "ngữ cảnh cao" (high-context) như Trung Quốc, im lặng (沉默 chénmò) trong đàm phán thường có nghĩa gì?', options: ['Luôn luôn là đồng ý', 'Có thể là dấu hiệu không đồng ý hoặc khó xử, không mặc định là đồng ý', 'Không có ý nghĩa gì', 'Luôn là dấu hiệu kết thúc cuộc họp'], correctIndex: 1, explanation: 'Im lặng trong văn hoá ngữ cảnh cao có thể mang nhiều hàm ý khác nhau, không nên mặc định là đồng ý.' },
  { id: 'q2', question: 'Câu "我们考虑考虑" (chúng tôi sẽ suy nghĩ thêm) trong giao tiếp gián tiếp Trung Quốc thường ngầm ý điều gì?', options: ['Chắc chắn sẽ đồng ý sau', 'Một cách từ chối lịch sự, gần nghĩa với "không"', 'Yêu cầu gặp lại ngay hôm sau', 'Không liên quan đến quyết định'], correctIndex: 1, explanation: 'Đây thường là một lời từ chối được làm mềm (委婉), không phải câu hỏi mở thật sự.' },
  { id: 'q3', question: '"察言观色" (chá yán guān sè) mô tả kỹ năng gì?', options: ['Đọc hợp đồng kỹ trước khi ký', 'Quan sát lời nói & biểu cảm để hiểu ý người khác chưa nói ra', 'Ghi chép cuộc họp bằng tốc ký', 'Dịch song ngữ Anh-Trung'], correctIndex: 1, explanation: 'Chá yán guān sè là khả năng đọc hàm ý qua giọng điệu, nét mặt, bối cảnh.' },
]);

const c7 = doc('ccb401-7-1-hierarchy-corporate', '7.1 — Hierarchy, power & corporate culture|||7.1 — Cấp bậc, quyền lực & văn hoá doanh nghiệp Trung Quốc',
  'Lãnh đạo, quan hệ trên-dưới, tôn trọng quyền uy, thâm niên xếp bậc, "một người quyết" trong nhiều doanh nghiệp TQ.',
  [[
    `<span class="eyebrow">CCB401 · Chapter 7 · Lesson 7.1</span>
<h2>Hierarchy, power &amp; corporate culture</h2>
<p class="lead">Chinese organizations — especially state-owned enterprises and family businesses — tend to centralize authority and formalize rank far more visibly than many Western firms.</p>
<h3>Key concepts</h3>
<ul>
<li><strong>领导 (lǐngdǎo)</strong> — leader/leadership; the term itself carries weight and is used respectfully when addressing or referring to a senior figure.</li>
<li><strong>上下级关系 (shàngxiàjí guānxi)</strong> — the superior-subordinate relationship; clearly marked in seating, speaking order, and who is addressed first.</li>
<li><strong>尊重权威 (zūnzhòng quánwēi)</strong> — respect for authority; junior staff rarely challenge a senior's statement openly, even when they disagree.</li>
<li><strong>论资排辈 (lùn zī pái bèi)</strong> — ranking by seniority/tenure rather than by merit or age alone; a longtime employee often outranks a younger, higher-credentialed one.</li>
<li><strong>企业文化 (qǐyè wénhuà)</strong> — corporate culture; varies by ownership type (state-owned, private, foreign joint venture) but hierarchy is a common thread.</li>
<li><strong>一言堂 (yìyántáng)</strong> — "one-voice hall," a decision style where one person (usually the top leader) decides with little open debate.</li>
</ul>
<pre><code>Term table — Chapter 7
Hanzi           Pinyin              Meaning
领导            lǐngdǎo             Leader / leadership
上下级关系      shàngxiàjí guānxi   Superior-subordinate relationship
尊重权威        zūnzhòng quánwēi    Respect for authority
论资排辈        lùn zī pái bèi      Seniority-based ranking
企业文化        qǐyè wénhuà         Corporate culture
一言堂          yìyántáng           One-person decision-making
</code></pre>
<h3>Practical advice</h3>
<p>Address the most senior person present first, route key questions and disagreements to them (or through a proper channel), and never let a junior colleague — foreign or local — publicly contradict a senior counterpart. Hierarchy here is not bureaucracy for its own sake; violating it reads as disrespect (a hit to 面子, Chapter 3) even when unintended.</p>
<div class="callout"><span class="badge">Case</span> A foreign manager let a junior engineer openly correct a visiting Chinese director's technical claim in a meeting, meaning only to be transparent. The partnership cooled for months — not because the correction was wrong, but because of who was allowed to make it, and in front of whom.</div>`,
    `<span class="eyebrow">CCB401 · Chương 7 · Bài 7.1</span>
<h2>Cấp bậc, quyền lực &amp; văn hoá doanh nghiệp Trung Quốc</h2>
<p class="lead">Các tổ chức Trung Quốc — đặc biệt doanh nghiệp nhà nước và công ty gia đình — thường tập trung quyền lực và thể hiện cấp bậc rõ ràng hơn nhiều so với không ít công ty phương Tây.</p>
<h3>Khái niệm chính</h3>
<ul>
<li><strong>领导 (lǐngdǎo)</strong> — lãnh đạo; bản thân từ này mang trọng lượng và được dùng trang trọng khi nói với hoặc về một người cấp cao.</li>
<li><strong>上下级关系 (shàngxiàjí guānxi)</strong> — quan hệ cấp trên-cấp dưới; được thể hiện rõ qua chỗ ngồi, thứ tự phát biểu, và ai được hỏi trước.</li>
<li><strong>尊重权威 (zūnzhòng quánwēi)</strong> — tôn trọng quyền uy; nhân viên cấp dưới hiếm khi phản bác công khai ý kiến của cấp trên, kể cả khi không đồng ý.</li>
<li><strong>论资排辈 (lùn zī pái bèi)</strong> — xếp bậc theo thâm niên/tuổi nghề hơn là chỉ theo năng lực hay tuổi đời; một nhân viên lâu năm thường có vị thế cao hơn người trẻ có bằng cấp tốt hơn.</li>
<li><strong>企业文化 (qǐyè wénhuà)</strong> — văn hoá doanh nghiệp; khác nhau theo loại hình sở hữu (nhà nước, tư nhân, liên doanh nước ngoài) nhưng cấp bậc luôn là mạch chung.</li>
<li><strong>一言堂 (yìyántáng)</strong> — "gian phòng một tiếng nói", kiểu ra quyết định mà một người (thường là lãnh đạo cao nhất) quyết, ít tranh luận công khai.</li>
</ul>
<pre><code>Bảng thuật ngữ — Chương 7
Hán tự          Pinyin              Nghĩa
领导            lǐngdǎo             Lãnh đạo
上下级关系      shàngxiàjí guānxi   Quan hệ cấp trên-cấp dưới
尊重权威        zūnzhòng quánwēi    Tôn trọng quyền uy
论资排辈        lùn zī pái bèi      Xếp bậc theo thâm niên
企业文化        qǐyè wénhuà         Văn hoá doanh nghiệp
一言堂          yìyántáng           Một người ra quyết định
</code></pre>
<h3>Lời khuyên thực tế</h3>
<p>Hãy hướng lời chào và câu hỏi tới người cấp cao nhất hiện diện trước, đưa các câu hỏi/bất đồng quan trọng tới đúng người đó (hoặc qua đúng kênh), và đừng bao giờ để một đồng nghiệp cấp dưới — dù là người nước ngoài hay bản địa — công khai phản bác đối tác cấp cao. Cấp bậc ở đây không phải thủ tục hành chính vô nghĩa; vi phạm nó bị hiểu là thiếu tôn trọng (ảnh hưởng tới 面子, Chương 3) dù không cố ý.</p>
<div class="callout"><span class="badge">Tình huống</span> Một quản lý nước ngoài để một kỹ sư cấp dưới công khai sửa lại nhận định kỹ thuật của một giám đốc Trung Quốc đang thăm công ty, chỉ với ý định minh bạch. Quan hệ hợp tác nguội lạnh suốt nhiều tháng — không phải vì lời sửa sai, mà vì ai được phép sửa, và trước mặt ai.</div>`,
  ]]);

const c7q = quiz('ccb401-quiz-7', 'Quiz 7 — Hierarchy & corporate culture|||Quiz 7 — Cấp bậc & văn hoá doanh nghiệp', [
  { id: 'q1', question: '"一言堂" (yìyántáng) mô tả kiểu ra quyết định nào?', options: ['Bỏ phiếu dân chủ toàn thể nhân viên', 'Một người (thường là lãnh đạo cao nhất) quyết định, ít tranh luận công khai', 'Thuê chuyên gia bên ngoài quyết định', 'Không ai quyết định, để tự phát triển'], correctIndex: 1, explanation: 'Yìyántáng: quyết định tập trung ở một người, thường là lãnh đạo cao nhất.' },
  { id: 'q2', question: '"论资排辈" (lùn zī pái bèi) là nguyên tắc xếp bậc dựa trên?', options: ['Bằng cấp cao nhất', 'Thâm niên/tuổi nghề & vị trí lâu năm', 'Doanh số cá nhân', 'Ngoại hình bên ngoài'], correctIndex: 1, explanation: 'Lùn zī pái bèi: thâm niên quyết định thứ bậc, không chỉ dựa vào năng lực hay bằng cấp.' },
  { id: 'q3', question: 'Khi họp với đối tác doanh nghiệp Trung Quốc, nên hướng câu hỏi quan trọng tới ai trước?', options: ['Người trẻ nhất, nói tiếng Anh tốt nhất', 'Người có chức vụ/thâm niên cao nhất hiện diện', 'Người ngồi gần cửa nhất', 'Bất kỳ ai trả lời trước'], correctIndex: 1, explanation: 'Hướng câu hỏi tới người cấp cao nhất thể hiện tôn trọng quyền uy (尊重权威).' },
]);

const c8 = doc('ccb401-8-1-china-vietnam', '8.1 — Cross-cultural China–Vietnam business communication & real cases|||8.1 — Giao tiếp thương mại đa văn hoá Trung-Việt & tình huống thực tế',
  'Điểm chung Nho giáo Việt-Trung, khác biệt cần kiểm chứng thực tế, ba tình huống Trung-Việt sát thực tế.',
  [[
    `<span class="eyebrow">CCB401 · Chapter 8 · Lesson 8.1</span>
<h2>Cross-cultural China–Vietnam business communication &amp; real cases</h2>
<p class="lead">Vietnam shares a Confucian-influenced foundation with China — hierarchy, face, relationship-building all matter in both — but the specific customs are not identical. Assuming "same rules" is itself a common mistake.</p>
<h3>Key concepts</h3>
<ul>
<li><strong>跨文化沟通 (kuà wénhuà gōutōng)</strong> — cross-cultural communication; the skill of adapting behaviour, not just language, across cultures.</li>
<li><strong>文化差异 (wénhuà chāyì)</strong> — cultural difference; expect differences in specifics (toasting customs, business-card formality, decision speed) even where underlying values overlap.</li>
<li><strong>合作伙伴 (hézuò huǒbàn)</strong> — business partner; the term itself frames the relationship as ongoing collaboration, echoing Chapter 1's long-termism.</li>
<li><strong>入乡随俗 (rùxiāng suísú)</strong> — "when entering a village, follow its customs" (when in Rome...); verify local practice rather than assuming it matches home.</li>
<li><strong>双赢 (shuāngyíng)</strong> — win-win; a frequently invoked framing in Chinese negotiation rhetoric, worth using genuinely rather than as an empty phrase.</li>
<li><strong>中越贸易 (Zhōng-Yuè màoyì)</strong> — China-Vietnam trade, the broader economic relationship this course prepares graduates to work within.</li>
</ul>
<pre><code>Term table — Chapter 8
Hanzi           Pinyin              Meaning
跨文化沟通      kuà wénhuà gōutōng  Cross-cultural communication
文化差异        wénhuà chāyì        Cultural difference
合作伙伴        hézuò huǒbàn        Business partner
入乡随俗        rùxiāng suísú       "When in Rome, do as the Romans do"
双赢            shuāngyíng          Win-win
中越贸易        Zhōng-Yuè màoyì     China–Vietnam trade
</code></pre>
<h3>Three real-style cases</h3>
<ol>
<li><strong>Case 1 — misread patience:</strong> a Vietnamese SME negotiating with a Guangdong supplier read "慢慢来" (take it slow) as disinterest and lowered its own opening price too early — losing leverage it did not need to give up.</li>
<li><strong>Case 2 — seating at a joint-venture meeting:</strong> a Sino-Vietnamese JV kickoff nearly stalled when the Vietnamese side seated their most senior person away from the door, unaware of the Chinese convention — a quick, quiet fix by the host avoided embarrassment.</li>
<li><strong>Case 3 — toasting customs:</strong> Chinese 干杯 (full-glass toast) and the casual Vietnamese "một, hai, ba, dzô!" style feel similar but differ in formality and pacing; a Vietnamese host who matched the Chinese guest's more formal toasting order was noticeably better received than one who treated the whole table casually.</li>
</ol>
<div class="callout"><span class="badge">The one rule that always applies</span> <strong>入乡随俗</strong> — verify the specific custom in front of you rather than transplanting a rule from Chapter 1–7 or from home. Culture guides describe patterns, not guarantees; the safest move in an unfamiliar moment is to watch, ask discreetly, or follow the host's lead.</div>`,
    `<span class="eyebrow">CCB401 · Chương 8 · Bài 8.1</span>
<h2>Giao tiếp thương mại đa văn hoá Trung-Việt &amp; tình huống thực tế</h2>
<p class="lead">Việt Nam chia sẻ nền tảng chịu ảnh hưởng Nho giáo với Trung Quốc — cấp bậc, thể diện, xây dựng quan hệ đều quan trọng ở cả hai — nhưng phong tục cụ thể không giống hệt nhau. Mặc định "cùng một bộ quy tắc" chính là lỗi thường gặp.</p>
<h3>Khái niệm chính</h3>
<ul>
<li><strong>跨文化沟通 (kuà wénhuà gōutōng)</strong> — giao tiếp đa văn hoá; kỹ năng điều chỉnh hành vi, không chỉ ngôn ngữ, giữa các nền văn hoá.</li>
<li><strong>文化差异 (wénhuà chāyì)</strong> — khác biệt văn hoá; nên lường trước khác biệt ở chi tiết cụ thể (tục chúc rượu, mức trang trọng của danh thiếp, tốc độ ra quyết định) dù giá trị nền có chồng lấn.</li>
<li><strong>合作伙伴 (hézuò huǒbàn)</strong> — đối tác kinh doanh; bản thân từ này định hình quan hệ là hợp tác lâu dài, hô ứng với tư duy dài hạn ở Chương 1.</li>
<li><strong>入乡随俗 (rùxiāng suísú)</strong> — "vào làng nào theo phong tục làng đó" (nhập gia tuỳ tục); nên kiểm chứng phong tục địa phương thay vì mặc định giống ở nhà.</li>
<li><strong>双赢 (shuāngyíng)</strong> — cùng thắng (win-win); một khung diễn đạt thường được dùng trong đàm phán Trung Quốc, nên dùng thật lòng thay vì như một câu sáo rỗng.</li>
<li><strong>中越贸易 (Zhōng-Yuè màoyì)</strong> — thương mại Trung-Việt, quan hệ kinh tế rộng hơn mà môn học chuẩn bị cho sinh viên tốt nghiệp làm việc trong đó.</li>
</ul>
<pre><code>Bảng thuật ngữ — Chương 8
Hán tự          Pinyin              Nghĩa
跨文化沟通      kuà wénhuà gōutōng  Giao tiếp đa văn hoá
文化差异        wénhuà chāyì        Khác biệt văn hoá
合作伙伴        hézuò huǒbàn        Đối tác kinh doanh
入乡随俗        rùxiāng suísú       Nhập gia tuỳ tục
双赢            shuāngyíng          Cùng thắng (win-win)
中越贸易        Zhōng-Yuè màoyì     Thương mại Trung-Việt
</code></pre>
<h3>Ba tình huống sát thực tế</h3>
<ol>
<li><strong>Tình huống 1 — hiểu sai sự kiên nhẫn:</strong> một doanh nghiệp vừa và nhỏ Việt Nam đàm phán với nhà cung cấp Quảng Đông hiểu "慢慢来" (từ từ) là thiếu quan tâm, nên hạ giá chào ban đầu quá sớm — mất đi lợi thế đàm phán mà lẽ ra không cần nhượng.</li>
<li><strong>Tình huống 2 — chỗ ngồi trong họp liên doanh:</strong> buổi khởi động một liên doanh Trung-Việt suýt trục trặc khi phía Việt Nam xếp người cấp cao nhất của mình ngồi xa cửa ra vào, không biết quy ước phía Trung Quốc — chủ nhà kịp thời chỉnh lại khéo léo, tránh được sự bẽ mặt.</li>
<li><strong>Tình huống 3 — tục chúc rượu:</strong> 干杯 kiểu Trung Quốc (cạn ly) và phong cách "một, hai, ba, dzô!" thoải mái của Việt Nam nghe có vẻ giống nhau nhưng khác về mức trang trọng và nhịp độ; một chủ tiệc Việt Nam chúc rượu theo đúng thứ tự trang trọng hơn mà khách Trung Quốc quen thuộc được đón nhận rõ rệt tốt hơn so với người xử sự thoải mái với cả bàn.</li>
</ol>
<div class="callout"><span class="badge">Nguyên tắc luôn đúng</span> <strong>入乡随俗</strong> — kiểm chứng phong tục cụ thể trước mắt thay vì áp thẳng một quy tắc từ Chương 1–7 hay từ quê nhà. Các cẩm nang văn hoá mô tả khuôn mẫu phổ biến, không phải sự đảm bảo tuyệt đối; cách an toàn nhất trong tình huống lạ là quan sát, hỏi khéo, hoặc theo sự dẫn dắt của chủ nhà.</div>`,
  ]]);

const c8q = quiz('ccb401-quiz-8', 'Quiz 8 — China-Vietnam cross-cultural cases|||Quiz 8 — Tình huống đa văn hoá Trung-Việt', [
  { id: 'q1', question: 'Điểm chung giữa văn hoá kinh doanh Việt Nam và Trung Quốc chủ yếu bắt nguồn từ đâu?', options: ['Cùng hệ thống pháp luật hiện đại', 'Ảnh hưởng Nho giáo chung (đề cao thể diện, cấp bậc, quan hệ)', 'Cùng dùng một ngôn ngữ', 'Không có điểm chung nào'], correctIndex: 1, explanation: 'Cả hai nền văn hoá đều chịu ảnh hưởng Nho giáo, dù phong tục cụ thể khác nhau.' },
  { id: 'q2', question: '"入乡随俗" nghĩa gần với thành ngữ Việt nào?', options: ['Nhập gia tuỳ tục', 'Nước đến chân mới nhảy', 'Có công mài sắt có ngày nên kim', 'Một cây làm chẳng nên non'], correctIndex: 0, explanation: 'Rùxiāng suísú = "vào làng nào theo phong tục làng đó" — tương đương "nhập gia tuỳ tục".' },
  { id: 'q3', question: 'Khi giao tiếp thương mại Trung-Việt, nguyên tắc an toàn nhất là gì?', options: ['Áp dụng máy móc mọi quy tắc Trung Quốc dù ở Việt Nam', 'Tìm hiểu và kiểm chứng phong tục địa phương thực tế trước khi hành động', 'Bỏ qua khác biệt văn hoá vì đều là châu Á', 'Chỉ làm theo thói quen ở quê nhà mình'], correctIndex: 1, explanation: 'Nguyên tắc 入乡随俗: kiểm chứng thực tế tại chỗ thay vì mặc định quy tắc từ nơi khác.' },
]);

export default {
  semester: { code: 'FPTU_Hola5', name: 'Kỳ 5', ordinal: 7 },
  course: {
    courseCode: 'CCB401',
    slug: 'ccb401-chinese-business-culture-and-communication',
    title: 'Chinese Business Culture and Communication',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/CCB401.webp',
    shortDescription: 'Chinese business culture — Confucian values, guanxi, mianzi (face), meeting & banquet etiquette, negotiation style, high-context communication, hierarchy, and real China-Vietnam cases. Chinese terms, pinyin & quizzes.|||Văn hoá kinh doanh Trung Quốc — giá trị Nho giáo, quan hệ (关系), thể diện (面子), nghi thức & tiệc rượu, phong cách đàm phán, giao tiếp gián tiếp, cấp bậc & tình huống Trung-Việt thực tế. Thuật ngữ Hán, pinyin & quiz.',
    description: 'Môn <strong>CCB401 — Chinese Business Culture and Communication</strong> (kỳ 5, ngành Ngôn ngữ Trung) trang bị hiểu biết văn hoá đằng sau hành vi kinh doanh Trung Quốc: <strong>giá trị Nho giáo</strong> → <strong>quan hệ (关系 guanxi)</strong> → <strong>thể diện (面子 mianzi)</strong> → <strong>nghi thức gặp gỡ &amp; tiệc tùng (酒桌文化)</strong> → <strong>phong cách đàm phán</strong> → <strong>giao tiếp gián tiếp/ngữ cảnh cao</strong> → <strong>cấp bậc &amp; văn hoá doanh nghiệp</strong> → <strong>tình huống Trung-Việt thực tế</strong>. Song ngữ Anh-Việt, mỗi chương kèm thuật ngữ tiếng Trung (chữ Hán + pinyin có dấu thanh) và quiz.',
    whatYouLearn: 'Giá trị Nho giáo trong kinh doanh (tập thể, cấp bậc, hoà hợp); guanxi (关系) & xây dựng mạng lưới, rénqíng; mianzi (面子) & giao tiếp giữ thể diện; nghi thức trao danh thiếp, chúc rượu, sắp xếp chỗ ngồi (酒桌文化); phong cách đàm phán chậm, tập thể, vai trò yībǎshǒu; giao tiếp ngữ cảnh cao, đọc im lặng & hàm ý; cấp bậc, quyền uy & văn hoá doanh nghiệp; tình huống giao tiếp thương mại Trung-Việt thực tế.',
    requirements: 'Đã học tiếng Trung cơ bản (đọc được pinyin và một số Hán tự thông dụng). Không cần kiến thức kinh doanh trước đó.',
  },
  sections: [
    { title: '📚 Course materials|||📚 Tài liệu tham khảo', description: 'Ba nguồn tham khảo chính + tài liệu miễn phí, hợp pháp.', lessons: [taiLieu] },
    { title: 'Course introduction|||Giới thiệu môn học', description: 'Vì sao văn hoá quyết định thành-bại thương vụ; lộ trình 8 chương.', lessons: [intro] },
    { title: 'Chương 1 — Tổng quan văn hoá & Nho giáo|||Chapter 1 — Overview & Confucian values', description: 'Tập thể, cấp bậc, hoà hợp, quan hệ dài hạn.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Quan hệ (关系 guanxi)|||Chapter 2 — Guanxi', description: 'Rénqíng, zhōngjiānrén, xây dựng mạng lưới.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Thể diện (面子 mianzi)|||Chapter 3 — Mianzi (face)', description: 'Cho/mất/giữ thể diện, khen công khai góp ý riêng tư.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Nghi thức & tiệc tùng (酒桌文化)|||Chapter 4 — Etiquette & banquets', description: 'Danh thiếp, chúc rượu, chỗ ngồi theo cấp bậc.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Phong cách đàm phán|||Chapter 5 — Negotiation style', description: 'Yībǎshǒu, quyết định tập thể, chiến thuật trì hoãn.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Giao tiếp ngữ cảnh cao|||Chapter 6 — High-context communication', description: 'Im lặng, gật đầu, hàm ý ngoài lời, từ chối gián tiếp.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Cấp bậc & văn hoá doanh nghiệp|||Chapter 7 — Hierarchy & corporate culture', description: 'Quyền uy, thâm niên, ra quyết định tập trung.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Đa văn hoá Trung-Việt|||Chapter 8 — China-Vietnam cross-cultural cases', description: 'Điểm chung, khác biệt cần kiểm chứng, tình huống thực tế.', lessons: [c8, c8q] },
  ],
};
