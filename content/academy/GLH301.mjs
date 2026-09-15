/**
 * GLH301 — Goods and Insurance (Hàng hoá & Bảo hiểm, logistics/vận tải).
 * Giáo trình (trích dẫn, KHÔNG upload PDF): Marine Insurance (Bennett);
 * Incoterms 2020 (ICC); Luật Kinh doanh bảo hiểm Việt Nam; Institute Cargo
 * Clauses (ICC A/B/C). Song ngữ + ví dụ + quiz.
 * Giữ NGUYÊN slug/semester/thumb(v3). ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('glh301-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & sách (Marine Insurance, Incoterms 2020, Luật KDBH VN, ICC A/B/C), tài liệu chính thức miễn phí, YouTube, công cụ, lộ trình tự học.',
  [[
    `<span class="eyebrow">GLH301 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn Goods and Insurance — cargo risk, Incoterms 2020, marine cargo insurance contracts and claims — in one place. Full official slides live on <strong>FLM</strong>; below are free, legal references.</p>
<h3>📘 Core references</h3>
<ul>
<li><em>Marine Insurance</em> — Bennett (core textbook: principles, contracts, claims of marine/cargo insurance)</li>
<li><em>Incoterms® 2020</em> — International Chamber of Commerce (ICC): the 11 trade terms and who insures what</li>
<li>Luật Kinh doanh bảo hiểm Việt Nam (2022) — legal framework for insurance business in Vietnam</li>
<li>Institute Cargo Clauses — ICC (A), ICC (B), ICC (C): the standard cargo cover wordings</li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://iccwbo.org/business-solutions/incoterms-rules/" target="_blank" rel="noopener">ICC — Incoterms® rules overview</a></li>
<li><a href="https://www.lmalloyds.com/LMA/Underwriting/Non-Marine/Cargo/Clauses.aspx" target="_blank" rel="noopener">LMA — Institute Cargo Clauses (market wordings)</a></li>
<li><a href="https://vanban.chinhphu.vn/" target="_blank" rel="noopener">Cổng thông tin văn bản pháp luật — Luật Kinh doanh bảo hiểm</a></li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/results?search_query=marine+cargo+insurance+explained" target="_blank" rel="noopener">Marine cargo insurance explained (playlists)</a> — visual walk-throughs of ICC A/B/C and claims</li>
<li><a href="https://www.youtube.com/results?search_query=incoterms+2020+explained" target="_blank" rel="noopener">Incoterms 2020 explained</a> — who ships, who insures, who pays at each term</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://iccwbo.org/business-solutions/incoterms-rules/" target="_blank" rel="noopener">Incoterms 2020 responsibility chart</a> — quick lookup of risk/cost transfer per term</li>
<li>Premium calculator (spreadsheet): Sum Insured × Rate = Premium — build your own to practice Chapter 5</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation</strong> — principles of insurance, perils vs risks, Incoterms 2020.</li>
<li><strong>Contracts</strong> — ICC A/B/C clauses, insured value, premium.</li>
<li><strong>Claims</strong> — survey, documents, indemnity, general average.</li>
<li><strong>Practice</strong> — P&amp;I, liability cover, Vietnam market &amp; risk management.</li>
</ol></div>`,
    `<span class="eyebrow">GLH301 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học Hàng hoá &amp; Bảo hiểm — rủi ro hàng hoá, Incoterms 2020, hợp đồng bảo hiểm hàng hoá và khiếu nại — gom về một chỗ. Slide chính thức đầy đủ nằm trên <strong>FLM</strong>; bên dưới là tài liệu miễn phí, hợp pháp.</p>
<h3>📘 Tài liệu gốc</h3>
<ul>
<li><em>Marine Insurance</em> — Bennett (giáo trình chính: nguyên tắc, hợp đồng, khiếu nại bảo hiểm hàng hải/hàng hoá)</li>
<li><em>Incoterms® 2020</em> — Phòng Thương mại Quốc tế (ICC): 11 điều kiện thương mại và ai mua bảo hiểm</li>
<li>Luật Kinh doanh bảo hiểm Việt Nam (2022) — khung pháp lý kinh doanh bảo hiểm tại Việt Nam</li>
<li>Institute Cargo Clauses — ICC (A), ICC (B), ICC (C): các mẫu điều khoản bảo hiểm hàng hoá chuẩn</li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://iccwbo.org/business-solutions/incoterms-rules/" target="_blank" rel="noopener">ICC — tổng quan Incoterms®</a></li>
<li><a href="https://www.lmalloyds.com/LMA/Underwriting/Non-Marine/Cargo/Clauses.aspx" target="_blank" rel="noopener">LMA — Institute Cargo Clauses (mẫu điều khoản thị trường)</a></li>
<li><a href="https://vanban.chinhphu.vn/" target="_blank" rel="noopener">Cổng thông tin văn bản pháp luật — Luật Kinh doanh bảo hiểm</a></li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/results?search_query=marine+cargo+insurance+explained" target="_blank" rel="noopener">Marine cargo insurance explained (playlist)</a> — giải thích trực quan ICC A/B/C và khiếu nại</li>
<li><a href="https://www.youtube.com/results?search_query=incoterms+2020+explained" target="_blank" rel="noopener">Incoterms 2020 explained</a> — ai chở, ai mua bảo hiểm, ai trả tiền ở mỗi điều kiện</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://iccwbo.org/business-solutions/incoterms-rules/" target="_blank" rel="noopener">Bảng trách nhiệm Incoterms 2020</a> — tra nhanh điểm chuyển rủi ro/chi phí theo từng điều kiện</li>
<li>Bảng tính phí (spreadsheet): Số tiền bảo hiểm × Tỉ lệ phí = Phí bảo hiểm — tự làm để luyện Chương 5</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền tảng</strong> — nguyên tắc bảo hiểm, rủi ro vs hiểm hoạ, Incoterms 2020.</li>
<li><strong>Hợp đồng</strong> — điều khoản ICC A/B/C, giá trị bảo hiểm, phí.</li>
<li><strong>Khiếu nại</strong> — giám định, chứng từ, bồi thường, tổn thất chung.</li>
<li><strong>Thực tiễn</strong> — P&amp;I, bảo hiểm trách nhiệm, thị trường Việt Nam &amp; quản trị rủi ro.</li>
</ol></div>`,
  ]]);

const intro = doc('glh301-0-1-overview', 'Course overview: Goods and Insurance|||Tổng quan: Hàng hoá & Bảo hiểm',
  'Vì sao hàng hoá xuất nhập khẩu cần bảo hiểm; các bên liên quan; lộ trình 8 chương từ nguyên lý → Incoterms → hợp đồng ICC → khiếu nại → P&amp;I → quản trị rủi ro.',
  [[
    `<span class="eyebrow">GLH301 · Lesson 0.1 · Overview</span>
<h2>Goods and Insurance</h2>
<p class="lead">Every shipment crossing borders is exposed to loss or damage — storms, collisions, theft, mishandling. <strong>Cargo insurance</strong> is the financial tool that transfers this risk from the trader to an insurer, for an agreed premium. This course builds the knowledge a logistics/trade professional needs to understand, arrange and manage that protection.</p>
<h3>Who is involved</h3>
<ul>
<li><strong>The insured</strong> — the party with an insurable interest in the goods (usually buyer or seller, depending on the Incoterm).</li>
<li><strong>The insurer</strong> — the company that accepts the risk in exchange for a premium.</li>
<li><strong>The broker / agent</strong> — arranges the cover and helps at claim time.</li>
</ul>
<h3>Roadmap</h3>
<p>Principles of cargo insurance → transport risks &amp; classification → Incoterms 2020 &amp; who must insure → insurance contracts &amp; ICC A/B/C clauses → insured value, premium &amp; indemnity → claims &amp; survey → liability insurance &amp; P&amp;I → risk management &amp; Vietnam practice.</p>`,
    `<span class="eyebrow">GLH301 · Bài 0.1 · Tổng quan</span>
<h2>Hàng hoá &amp; Bảo hiểm</h2>
<p class="lead">Mọi lô hàng xuất nhập khẩu đều có nguy cơ mất mát hoặc hư hỏng — bão tố, va chạm, trộm cắp, xếp dỡ sai. <strong>Bảo hiểm hàng hoá</strong> là công cụ tài chính chuyển rủi ro từ người mua bán sang công ty bảo hiểm, đổi lại một khoản phí thoả thuận. Môn học xây kiến thức cần cho người làm logistics/ngoại thương để hiểu, mua và quản lý sự bảo vệ đó.</p>
<h3>Các bên liên quan</h3>
<ul>
<li><strong>Người được bảo hiểm</strong> — bên có quyền lợi bảo hiểm với hàng hoá (thường là người mua hoặc người bán, tuỳ điều kiện Incoterms).</li>
<li><strong>Người bảo hiểm</strong> — công ty nhận rủi ro, đổi lại một khoản phí.</li>
<li><strong>Môi giới / đại lý</strong> — sắp xếp hợp đồng bảo hiểm và hỗ trợ khi khiếu nại.</li>
</ul>
<h3>Lộ trình</h3>
<p>Nguyên lý bảo hiểm hàng hoá → rủi ro vận chuyển &amp; phân loại → Incoterms 2020 &amp; ai phải mua bảo hiểm → hợp đồng bảo hiểm &amp; điều khoản ICC A/B/C → giá trị bảo hiểm, phí &amp; bồi thường → khiếu nại &amp; giám định → bảo hiểm trách nhiệm &amp; P&amp;I → quản trị rủi ro &amp; thực tiễn Việt Nam.</p>`,
  ]]);

const c1 = doc('glh301-1-1-tong-quan', '1.1 — Overview of cargo insurance in international trade|||1.1 — Tổng quan bảo hiểm hàng hoá trong thương mại quốc tế',
  'Vì sao thương mại quốc tế cần bảo hiểm hàng hoá; quyền lợi bảo hiểm (insurable interest); 5 nguyên tắc: trung thực tuyệt đối, quyền lợi bảo hiểm, bồi thường, thế quyền, góp phần.',
  [[
    `<span class="eyebrow">GLH301 · Chapter 1 · Lesson 1.1</span>
<h2>Overview of cargo insurance in international trade</h2>
<h3>Why international trade needs cargo insurance</h3>
<p>Goods travel long distances, change hands between carriers, and cross jurisdictions — every step adds exposure to loss. Cargo insurance lets buyers and sellers trade with confidence: if the goods are lost or damaged, the loss is compensated instead of falling entirely on one party.</p>
<h3>Insurable interest</h3>
<p>To buy valid insurance, the insured must have an <strong>insurable interest</strong> — a legal/financial stake such that loss of the goods causes them a real financial loss (e.g. they own the goods, or bear the risk under the sales contract).</p>
<h3>Five core principles of marine/cargo insurance</h3>
<ul>
<li><strong>Utmost good faith</strong> — both parties must disclose all material facts honestly.</li>
<li><strong>Insurable interest</strong> — the insured must stand to lose financially if the goods are lost/damaged.</li>
<li><strong>Indemnity</strong> — insurance restores the insured to the financial position before the loss, not more.</li>
<li><strong>Subrogation</strong> — after paying a claim, the insurer takes over the insured's right to sue a responsible third party.</li>
<li><strong>Contribution</strong> — if the same risk is insured with more than one insurer, each pays its proportionate share.</li>
</ul>
<pre><code>Trade risk without insurance:
 Seller ships goods -> storm damages cargo -> loss falls on
 whoever legally bears the risk at that point (buyer or seller)

Trade risk with insurance:
 Seller ships goods -> storm damages cargo -> insurer indemnifies
 the insured -> trade relationship and cash flow protected
</code></pre>
<div class="callout"><span class="badge">Why it matters</span> Cargo insurance does not stop accidents at sea — it stops one accident from becoming a business failure.</div>`,
    `<span class="eyebrow">GLH301 · Chương 1 · Bài 1.1</span>
<h2>Tổng quan bảo hiểm hàng hoá trong thương mại quốc tế</h2>
<h3>Vì sao thương mại quốc tế cần bảo hiểm hàng hoá</h3>
<p>Hàng hoá di chuyển quãng đường dài, đổi tay giữa nhiều hãng vận chuyển, và qua nhiều vùng pháp lý — mỗi bước đều thêm nguy cơ mất mát. Bảo hiểm hàng hoá giúp người mua và người bán giao dịch an tâm: nếu hàng bị mất hoặc hư hỏng, tổn thất được bồi thường thay vì đổ dồn lên một bên.</p>
<h3>Quyền lợi bảo hiểm (insurable interest)</h3>
<p>Để mua bảo hiểm hợp lệ, người được bảo hiểm phải có <strong>quyền lợi bảo hiểm</strong> — một lợi ích pháp lý/tài chính sao cho việc mất hàng gây tổn thất tài chính thật (vd họ sở hữu hàng, hoặc chịu rủi ro theo hợp đồng mua bán).</p>
<h3>Năm nguyên tắc cốt lõi của bảo hiểm hàng hải/hàng hoá</h3>
<ul>
<li><strong>Trung thực tuyệt đối</strong> — cả hai bên phải khai báo trung thực mọi thông tin trọng yếu.</li>
<li><strong>Quyền lợi bảo hiểm</strong> — người được bảo hiểm phải chịu tổn thất tài chính thật nếu hàng mất/hỏng.</li>
<li><strong>Bồi thường (indemnity)</strong> — bảo hiểm khôi phục vị trí tài chính trước khi tổn thất, không hơn.</li>
<li><strong>Thế quyền (subrogation)</strong> — sau khi trả bồi thường, người bảo hiểm được thay quyền kiện bên thứ ba có lỗi.</li>
<li><strong>Góp phần (contribution)</strong> — nếu cùng một rủi ro được bảo hiểm ở nhiều công ty, mỗi công ty trả theo tỉ lệ phần mình.</li>
</ul>
<pre><code>Rủi ro thương mại KHÔNG có bảo hiểm:
 Người bán gửi hàng -> bão làm hỏng hàng -> tổn thất đổ lên
 bên đang chịu rủi ro theo luật tại thời điểm đó

Rủi ro thương mại CÓ bảo hiểm:
 Người bán gửi hàng -> bão làm hỏng hàng -> công ty bảo hiểm
 bồi thường -> quan hệ thương mại và dòng tiền được bảo vệ
</code></pre>
<div class="callout"><span class="badge">Vì sao quan trọng</span> Bảo hiểm hàng hoá không ngăn tai nạn trên biển — nó ngăn một tai nạn biến thành thất bại kinh doanh.</div>`,
  ]]);

const c1q = quiz('glh301-quiz-1', 'Quiz 1 — Tổng quan bảo hiểm hàng hoá|||Quiz 1', [
  { id: 'q1', question: 'Để mua bảo hiểm hàng hoá hợp lệ, người được bảo hiểm phải có gì?', options: ['Hộ chiếu còn hạn', 'Quyền lợi bảo hiểm (insurable interest)', 'Giấy phép xuất khẩu', 'Hợp đồng vận chuyển đường bộ'], correctIndex: 1, explanation: 'Phải có lợi ích tài chính/pháp lý thật với hàng hoá — nếu hàng mất thì họ tổn thất thật.' },
  { id: 'q2', question: 'Nguyên tắc bồi thường (indemnity) nghĩa là gì?', options: ['Trả nhiều hơn giá trị hàng để bù rủi ro', 'Khôi phục vị trí tài chính trước tổn thất, không hơn', 'Chỉ trả khi có lỗi của người vận chuyển', 'Bồi thường theo giá thị trường tại thời điểm khiếu nại'], correctIndex: 1, explanation: 'Bảo hiểm đưa người được bảo hiểm về đúng vị trí tài chính ban đầu, không tạo lợi nhuận từ tổn thất.' },
  { id: 'q3', question: 'Sau khi trả bồi thường cho người được bảo hiểm, công ty bảo hiểm được quyền gì?', options: ['Từ chối bảo hiểm lô hàng sau', 'Thế quyền (subrogation) kiện bên thứ ba có lỗi', 'Giữ lại hàng hoá bị hỏng', 'Tăng phí bảo hiểm ngay lập tức'], correctIndex: 1, explanation: 'Thế quyền: công ty bảo hiểm thay người được bảo hiểm đòi bên gây lỗi (vd hãng tàu).' },
]);

const c2 = doc('glh301-2-1-rui-ro-van-chuyen', '2.1 — Transport risks & classification|||2.1 — Rủi ro trong vận chuyển & phân loại',
  'Hiểm hoạ (peril) vs rủi ro (risk); hiểm hoạ hàng hải (thiên nhiên) vs hiểm hoạ ngoài hàng hải (con người); tổn thất toàn bộ vs tổn thất riêng.',
  [[
    `<span class="eyebrow">GLH301 · Chapter 2 · Lesson 2.1</span>
<h2>Transport risks &amp; classification</h2>
<h3>Peril vs risk</h3>
<p>A <strong>peril</strong> is the event that may cause loss (a storm, a fire, theft). A <strong>risk</strong> is the possibility that a peril will happen and cause loss. Insurance policies list which perils are covered.</p>
<h3>Classifying transport perils</h3>
<ul>
<li><strong>Marine perils (natural)</strong> — perils of the sea: storm, heavy weather, stranding, sinking, collision, being swept overboard.</li>
<li><strong>Extraneous perils (man-made)</strong> — fire, explosion, theft, non-delivery, rough handling, contamination, war, strikes/riots/civil commotion (SRCC).</li>
</ul>
<h3>Classifying loss</h3>
<ul>
<li><strong>Total loss</strong> — <em>actual</em> total loss (goods destroyed/irrecoverable) or <em>constructive</em> total loss (cost to repair/recover exceeds the value).</li>
<li><strong>Partial loss</strong> — <em>particular average</em> (loss suffered by one party's own cargo) vs <em>general average</em> (a deliberate, reasonable sacrifice for the common safety of the voyage, shared by all cargo owners).</li>
</ul>
<pre><code>Classification map:
 Peril      -> natural (storm, sinking) | man-made (theft, war)
 Loss scale -> total (actual | constructive) | partial (particular | general average)
</code></pre>
<div class="callout"><span class="badge">Why the split matters</span> The type of peril decides which clause (ICC A/B/C) is needed; the type of loss decides how the claim is calculated and shared.</div>`,
    `<span class="eyebrow">GLH301 · Chương 2 · Bài 2.1</span>
<h2>Rủi ro trong vận chuyển &amp; phân loại</h2>
<h3>Hiểm hoạ (peril) vs rủi ro (risk)</h3>
<p><strong>Hiểm hoạ</strong> là sự kiện có thể gây tổn thất (bão, hoả hoạn, trộm cắp). <strong>Rủi ro</strong> là khả năng hiểm hoạ đó xảy ra và gây tổn thất. Hợp đồng bảo hiểm liệt kê những hiểm hoạ nào được bảo hiểm.</p>
<h3>Phân loại hiểm hoạ trong vận chuyển</h3>
<ul>
<li><strong>Hiểm hoạ hàng hải (tự nhiên)</strong> — hiểm hoạ của biển: bão, thời tiết xấu, mắc cạn, đắm tàu, va chạm, hàng bị cuốn khỏi tàu.</li>
<li><strong>Hiểm hoạ ngoài hàng hải (con người)</strong> — cháy, nổ, trộm cắp, giao thiếu hàng, xếp dỡ thô bạo, nhiễm bẩn, chiến tranh, đình công/bạo loạn/nổi loạn dân sự (SRCC).</li>
</ul>
<h3>Phân loại tổn thất</h3>
<ul>
<li><strong>Tổn thất toàn bộ</strong> — <em>thực tế</em> (hàng bị phá huỷ/không thể phục hồi) hoặc <em>ước tính (constructive)</em> (chi phí sửa/phục hồi vượt giá trị hàng).</li>
<li><strong>Tổn thất riêng phần</strong> — <em>tổn thất riêng (particular average)</em> (chỉ một chủ hàng chịu) vs <em>tổn thất chung (general average)</em> (một hy sinh cố ý, hợp lý vì an toàn chung của chuyến đi, mọi chủ hàng cùng chia sẻ).</li>
</ul>
<pre><code>Sơ đồ phân loại:
 Hiểm hoạ    -> tự nhiên (bão, đắm tàu) | con người (trộm, chiến tranh)
 Quy mô tổn thất -> toàn bộ (thực tế | ước tính) | riêng phần (riêng | tổn thất chung)
</code></pre>
<div class="callout"><span class="badge">Vì sao phân loại quan trọng</span> Loại hiểm hoạ quyết định cần điều khoản nào (ICC A/B/C); loại tổn thất quyết định cách tính và chia sẻ khiếu nại.</div>`,
  ]]);

const c2q = quiz('glh301-quiz-2', 'Quiz 2 — Rủi ro & phân loại|||Quiz 2', [
  { id: 'q1', question: 'Sự khác biệt giữa "hiểm hoạ" (peril) và "rủi ro" (risk) là gì?', options: ['Không khác biệt, dùng thay nhau', 'Hiểm hoạ là sự kiện gây tổn thất, rủi ro là khả năng hiểm hoạ xảy ra', 'Rủi ro chỉ áp dụng cho hàng nguyên container', 'Hiểm hoạ chỉ tính cho vận chuyển đường biển'], correctIndex: 1, explanation: 'Peril = sự kiện (bão, cháy); risk = khả năng peril đó xảy ra và gây tổn thất.' },
  { id: 'q2', question: 'Tổn thất chung (general average) khác tổn thất riêng (particular average) ở điểm nào?', options: ['Tổn thất chung chỉ áp dụng cho hàng rời', 'Tổn thất chung là hy sinh cố ý vì an toàn chung, được mọi chủ hàng chia sẻ', 'Tổn thất riêng luôn lớn hơn tổn thất chung', 'Tổn thất chung không cần giám định'], correctIndex: 1, explanation: 'General average là hành động hy sinh có chủ đích, hợp lý, vì lợi ích chung của cả hành trình — chi phí được phân chia cho tất cả các bên liên quan.' },
  { id: 'q3', question: 'Trộm cắp và chiến tranh (war) thuộc loại hiểm hoạ nào?', options: ['Hiểm hoạ tự nhiên (hàng hải)', 'Hiểm hoạ ngoài hàng hải (con người)', 'Không được coi là hiểm hoạ', 'Chỉ tính khi vận chuyển hàng không'], correctIndex: 1, explanation: 'Trộm cắp, chiến tranh, đình công là hiểm hoạ do con người/xã hội gây ra, khác với hiểm hoạ tự nhiên như bão, đắm tàu.' },
]);

const c3 = doc('glh301-3-1-incoterms', '3.1 — Incoterms 2020 & insurance responsibility|||3.1 — Incoterms 2020 & trách nhiệm bảo hiểm',
  '11 điều kiện Incoterms 2020, 2 nhóm (mọi phương thức vs đường biển/thuỷ nội địa); điểm chuyển rủi ro; CIF/CIP là 2 điều kiện duy nhất buộc người bán mua bảo hiểm.',
  [[
    `<span class="eyebrow">GLH301 · Chapter 3 · Lesson 3.1</span>
<h2>Incoterms 2020 &amp; insurance responsibility</h2>
<h3>What Incoterms decide</h3>
<p><strong>Incoterms® 2020</strong> (ICC) are 11 standard trade terms that fix, at a defined point, when <em>risk</em> transfers from seller to buyer, who pays which <em>costs</em>, and (for two terms) who must arrange <em>insurance</em>.</p>
<h3>The 11 terms in two groups</h3>
<ul>
<li><strong>Any mode of transport:</strong> EXW, FCA, CPT, CIP, DAP, DPU, DDP.</li>
<li><strong>Sea &amp; inland waterway only:</strong> FAS, FOB, CFR, CIF.</li>
</ul>
<h3>Who must insure: only CIF and CIP</h3>
<p>Only two terms make insurance an <strong>obligation of the seller</strong>:</p>
<ul>
<li><strong>CIF (Cost, Insurance and Freight)</strong> — seller must buy cargo insurance at the <strong>minimum level: ICC (C)</strong>, for at least 110% of the contract value.</li>
<li><strong>CIP (Carriage and Insurance Paid to)</strong> — since Incoterms 2020, seller must buy the <strong>higher level: ICC (A)</strong> (all-risks), unless the parties agree otherwise.</li>
</ul>
<p>Under every other term (FOB, EXW, DAP, etc.), whichever party bears the risk at that point is free to insure — but is not <em>obliged</em> to by the Incoterm itself.</p>
<pre><code>Risk transfer examples:
 FOB — risk passes when goods are loaded on board the vessel
 CIF — risk passes on board too, but SELLER must buy min. ICC (C)
 CIP — risk passes on handover to the first carrier; SELLER buys ICC (A)
 DAP — risk passes at destination, before unloading; seller carries risk that far
</code></pre>
<div class="callout"><span class="badge">Common exam trap</span> CIF and CIP tell you WHO buys insurance and the MINIMUM level — they do not by themselves move the point where risk transfers, which is a separate rule per term.</div>`,
    `<span class="eyebrow">GLH301 · Chương 3 · Bài 3.1</span>
<h2>Incoterms 2020 &amp; trách nhiệm bảo hiểm</h2>
<h3>Incoterms quyết định điều gì</h3>
<p><strong>Incoterms® 2020</strong> (ICC) là 11 điều kiện thương mại chuẩn, ấn định tại một điểm xác định: khi nào <em>rủi ro</em> chuyển từ người bán sang người mua, ai trả <em>chi phí</em> nào, và (với hai điều kiện) ai phải mua <em>bảo hiểm</em>.</p>
<h3>11 điều kiện, hai nhóm</h3>
<ul>
<li><strong>Mọi phương thức vận chuyển:</strong> EXW, FCA, CPT, CIP, DAP, DPU, DDP.</li>
<li><strong>Chỉ đường biển &amp; thuỷ nội địa:</strong> FAS, FOB, CFR, CIF.</li>
</ul>
<h3>Ai phải mua bảo hiểm: chỉ CIF và CIP</h3>
<p>Chỉ hai điều kiện biến bảo hiểm thành <strong>nghĩa vụ của người bán</strong>:</p>
<ul>
<li><strong>CIF (Cost, Insurance and Freight)</strong> — người bán phải mua bảo hiểm hàng hoá ở mức <strong>tối thiểu: ICC (C)</strong>, với số tiền bảo hiểm tối thiểu 110% giá trị hợp đồng.</li>
<li><strong>CIP (Carriage and Insurance Paid to)</strong> — từ Incoterms 2020, người bán phải mua mức <strong>cao hơn: ICC (A)</strong> (bảo hiểm mọi rủi ro), trừ khi hai bên thoả thuận khác.</li>
</ul>
<p>Ở mọi điều kiện khác (FOB, EXW, DAP,...), bên đang chịu rủi ro tại thời điểm đó được tự do mua bảo hiểm — nhưng không bị <em>buộc</em> phải mua theo chính điều kiện Incoterms đó.</p>
<pre><code>Ví dụ điểm chuyển rủi ro:
 FOB — rủi ro chuyển khi hàng được xếp lên tàu
 CIF — rủi ro cũng chuyển lúc xếp hàng, nhưng NGƯỜI BÁN phải mua ít nhất ICC (C)
 CIP — rủi ro chuyển khi giao cho người vận chuyển đầu tiên; NGƯỜI BÁN mua ICC (A)
 DAP — rủi ro chuyển tại nơi đến, trước khi dỡ hàng; người bán chịu rủi ro tới đó
</code></pre>
<div class="callout"><span class="badge">Bẫy hay gặp khi thi</span> CIF và CIP cho biết AI mua bảo hiểm và mức TỐI THIỂU — chúng không tự làm thay đổi điểm chuyển rủi ro, vốn là quy tắc riêng của từng điều kiện.</div>`,
  ]]);

const c3q = quiz('glh301-quiz-3', 'Quiz 3 — Incoterms 2020 & bảo hiểm|||Quiz 3', [
  { id: 'q1', question: 'Trong Incoterms 2020, những điều kiện nào buộc người bán phải mua bảo hiểm hàng hoá?', options: ['FOB và EXW', 'CIF và CIP', 'DAP và DDP', 'Tất cả 11 điều kiện'], correctIndex: 1, explanation: 'Chỉ CIF (Cost, Insurance and Freight) và CIP (Carriage and Insurance Paid to) buộc người bán mua bảo hiểm.' },
  { id: 'q2', question: 'Theo Incoterms 2020, mức bảo hiểm tối thiểu người bán phải mua theo điều kiện CIP là gì?', options: ['ICC (C) — mức thấp nhất', 'ICC (B) — mức trung bình', 'ICC (A) — mọi rủi ro (all risks)', 'Không quy định mức tối thiểu'], correctIndex: 2, explanation: 'CIP nâng chuẩn từ Incoterms 2020: người bán phải mua ICC (A), trừ khi hai bên thoả thuận khác — khác với CIF chỉ yêu cầu ICC (C).' },
  { id: 'q3', question: 'Điều kiện FOB và FAS chỉ áp dụng cho phương thức vận chuyển nào?', options: ['Mọi phương thức, kể cả đường hàng không', 'Chỉ đường bộ', 'Chỉ đường biển & thuỷ nội địa', 'Chỉ đường sắt'], correctIndex: 2, explanation: 'FAS, FOB, CFR, CIF thuộc nhóm điều kiện chỉ dùng cho vận tải đường biển và thuỷ nội địa.' },
]);

const c4 = doc('glh301-4-1-hop-dong-icc', '4.1 — Cargo insurance contracts & ICC A/B/C clauses|||4.1 — Hợp đồng bảo hiểm hàng hoá & điều khoản (ICC A/B/C)',
  'Các chứng từ bảo hiểm (policy, cover note, certificate); phạm vi ICC (A) mọi rủi ro trừ loại trừ, ICC (B) hiểm hoạ chỉ định rộng, ICC (C) hiểm hoạ chỉ định hẹp; loại trừ chung; thời hạn kho-tới-kho.',
  [[
    `<span class="eyebrow">GLH301 · Chapter 4 · Lesson 4.1</span>
<h2>Cargo insurance contracts &amp; ICC A/B/C clauses</h2>
<h3>The contract documents</h3>
<ul>
<li><strong>Insurance policy</strong> — the full, signed contract between insurer and insured.</li>
<li><strong>Cover note</strong> — temporary evidence of cover issued by a broker before the policy is finalized.</li>
<li><strong>Insurance certificate</strong> — a simplified document (often required by banks under a letter of credit) confirming cover exists.</li>
</ul>
<h3>Institute Cargo Clauses: three levels of cover</h3>
<ul>
<li><strong>ICC (A)</strong> — broadest: covers <strong>all risks</strong> of loss/damage EXCEPT the listed general exclusions. The default choice for high-value or fragile cargo.</li>
<li><strong>ICC (B)</strong> — covers a wide list of <strong>named perils</strong> (fire, explosion, stranding, sinking, earthquake, washing overboard, etc.), narrower than (A).</li>
<li><strong>ICC (C)</strong> — the narrowest: covers only the most serious named perils (fire/explosion, vessel sinking/capsizing, collision, general average sacrifice). No cover for storm-caused wetting, for example.</li>
</ul>
<h3>General exclusions (all three clauses)</h3>
<p>Wilful misconduct of the insured, ordinary leakage/wear and tear, inadequate packing, insufficiency/unfitness of the vessel, war and strikes/riots/civil commotion (SRCC) — the last two need separate <strong>War Clause</strong> and <strong>Strikes Clause</strong> add-ons.</p>
<h3>Duration of cover</h3>
<p>Standard cargo clauses run <strong>"warehouse to warehouse"</strong> — from leaving the warehouse named for commencement of transit, through ordinary transit, to arrival at the final warehouse (subject to a time limit, usually 60 days after discharge).</p>
<pre><code>Cover comparison:
 ICC (A) -> all risks, except listed exclusions   (broadest)
 ICC (B) -> long list of named perils              (medium)
 ICC (C) -> short list of major named perils only   (narrowest)
</code></pre>
<div class="callout"><span class="badge">Choosing a clause</span> Higher-value, fragile or high-theft-risk cargo usually justifies ICC (A); bulk, low-value commodities are often insured under ICC (C) to control premium cost.</div>`,
    `<span class="eyebrow">GLH301 · Chương 4 · Bài 4.1</span>
<h2>Hợp đồng bảo hiểm hàng hoá &amp; điều khoản ICC A/B/C</h2>
<h3>Các chứng từ hợp đồng</h3>
<ul>
<li><strong>Đơn bảo hiểm (policy)</strong> — hợp đồng đầy đủ, đã ký, giữa người bảo hiểm và người được bảo hiểm.</li>
<li><strong>Giấy chứng nhận tạm (cover note)</strong> — bằng chứng bảo hiểm tạm thời do môi giới cấp trước khi hoàn tất đơn chính thức.</li>
<li><strong>Chứng thư bảo hiểm (certificate)</strong> — chứng từ đơn giản hoá (thường ngân hàng yêu cầu theo L/C) xác nhận đã có bảo hiểm.</li>
</ul>
<h3>Institute Cargo Clauses: ba mức bảo hiểm</h3>
<ul>
<li><strong>ICC (A)</strong> — rộng nhất: bảo hiểm <strong>mọi rủi ro</strong> TRỪ các loại trừ được liệt kê. Lựa chọn mặc định cho hàng giá trị cao hoặc dễ vỡ.</li>
<li><strong>ICC (B)</strong> — bảo hiểm một danh sách rộng các <strong>hiểm hoạ được chỉ định</strong> (cháy, nổ, mắc cạn, đắm tàu, động đất, hàng bị cuốn khỏi tàu,...), hẹp hơn (A).</li>
<li><strong>ICC (C)</strong> — hẹp nhất: chỉ bảo hiểm các hiểm hoạ chỉ định nghiêm trọng nhất (cháy/nổ, tàu đắm/lật, va chạm, hy sinh vì tổn thất chung). Không bảo hiểm hàng bị ướt do bão, ví dụ.</li>
</ul>
<h3>Loại trừ chung (cả ba điều khoản)</h3>
<p>Hành vi cố ý của người được bảo hiểm, hao hụt/hao mòn tự nhiên thông thường, đóng gói không đủ, tàu không đủ khả năng đi biển, chiến tranh và đình công/bạo loạn/nổi loạn dân sự (SRCC) — hai loại trừ cuối cần mua thêm <strong>Điều khoản Chiến tranh</strong> và <strong>Điều khoản Đình công</strong> riêng.</p>
<h3>Thời hạn bảo hiểm</h3>
<p>Điều khoản hàng hoá chuẩn chạy theo nguyên tắc <strong>"kho đến kho"</strong> — từ khi hàng rời kho khởi hành, qua quá trình vận chuyển thông thường, đến khi tới kho cuối cùng (có giới hạn thời gian, thường 60 ngày sau khi dỡ hàng).</p>
<pre><code>So sánh mức bảo hiểm:
 ICC (A) -> mọi rủi ro, trừ các loại trừ được liệt kê   (rộng nhất)
 ICC (B) -> danh sách dài hiểm hoạ chỉ định              (trung bình)
 ICC (C) -> danh sách ngắn, chỉ hiểm hoạ nghiêm trọng    (hẹp nhất)
</code></pre>
<div class="callout"><span class="badge">Chọn điều khoản nào</span> Hàng giá trị cao, dễ vỡ hoặc dễ bị trộm thường nên mua ICC (A); hàng rời, giá trị thấp thường mua ICC (C) để kiểm soát phí bảo hiểm.</div>`,
  ]]);

const c4q = quiz('glh301-quiz-4', 'Quiz 4 — Hợp đồng & điều khoản ICC|||Quiz 4', [
  { id: 'q1', question: 'Điều khoản ICC (A) khác ICC (C) như thế nào?', options: ['ICC (A) chỉ bảo hiểm cháy/nổ, ICC (C) bảo hiểm mọi rủi ro', 'ICC (A) bảo hiểm mọi rủi ro trừ loại trừ, ICC (C) chỉ bảo hiểm hiểm hoạ nghiêm trọng nhất', 'Hai điều khoản có phạm vi giống nhau, chỉ khác phí', 'ICC (C) chỉ dùng cho hàng hàng không'], correctIndex: 1, explanation: 'ICC (A) là mức rộng nhất (mọi rủi ro trừ loại trừ); ICC (C) là mức hẹp nhất (chỉ hiểm hoạ chính như cháy/nổ, đắm tàu, va chạm).' },
  { id: 'q2', question: 'Muốn được bảo hiểm cho rủi ro chiến tranh hoặc đình công, cần gì?', options: ['Không cần gì thêm, ICC (A) đã bao gồm', 'Mua thêm Điều khoản Chiến tranh và/hoặc Điều khoản Đình công riêng', 'Chỉ ICC (C) mới bảo hiểm được', 'Chuyển sang mua bảo hiểm P&amp;I'], correctIndex: 1, explanation: 'Chiến tranh và SRCC (đình công/bạo loạn/nổi loạn dân sự) là loại trừ chung ở cả ba điều khoản ICC, cần mua thêm điều khoản riêng.' },
  { id: 'q3', question: 'Thời hạn bảo hiểm hàng hoá theo nguyên tắc "kho đến kho" nghĩa là gì?', options: ['Chỉ bảo hiểm khi hàng nằm trong kho', 'Bảo hiểm từ khi hàng rời kho khởi hành đến khi tới kho cuối, có giới hạn thời gian', 'Chỉ bảo hiểm trong quá trình xếp/dỡ hàng lên tàu', 'Bảo hiểm vô thời hạn, không giới hạn ngày'], correctIndex: 1, explanation: 'Cover chạy suốt quá trình vận chuyển thông thường từ kho khởi hành tới kho đến, thường giới hạn 60 ngày sau khi dỡ hàng.' },
]);

const c5 = doc('glh301-5-1-gia-tri-phi-boi-thuong', '5.1 — Insured value, premium & claims (indemnity)|||5.1 — Giá trị bảo hiểm, phí & bồi thường (claim)',
  'Giá trị bảo hiểm CIF+10%; công thức phí = Số tiền bảo hiểm × Tỉ lệ phí; nguyên tắc bồi thường theo tỉ lệ khi dưới bảo hiểm (under-insurance).',
  [[
    `<span class="eyebrow">GLH301 · Chapter 5 · Lesson 5.1</span>
<h2>Insured value, premium &amp; claims (indemnity)</h2>
<h3>Insurable value &amp; the "CIF + 10%" convention</h3>
<p>The <strong>insurable value</strong> is the full commercial value of the goods at risk. Market practice, and ICC clauses by default, set the <strong>insured value at CIF value + 10%</strong> — the extra 10% covers anticipated profit/costs (e.g. import duties, handling) that would otherwise be uninsured if the goods are lost.</p>
<pre><code>Insured value = CIF value × 1.10
Example: CIF value = USD 100,000
 Insured value = 100,000 × 1.10 = USD 110,000
</code></pre>
<h3>Premium calculation</h3>
<pre><code>Premium = Sum Insured × Premium rate
Example: Sum Insured = USD 110,000, rate = 0.30%
 Premium = 110,000 × 0.30% = USD 330
</code></pre>
<p>The <strong>rate</strong> reflects the insurer's assessment of risk: type of goods, packing, route, mode of transport, and clause chosen (A/B/C).</p>
<h3>Sum insured vs actual loss — the indemnity rule</h3>
<ul>
<li>If the <strong>sum insured equals the insurable value</strong> — a loss is paid in full (up to the loss amount).</li>
<li>If the <strong>sum insured is LESS than the insurable value</strong> ("under-insurance") — most policies apply <strong>average/pro-rata condition</strong>: the insurer pays only the same proportion of the loss as the sum insured bears to the full value.</li>
</ul>
<pre><code>Under-insurance example:
 Insurable value = 100,000; Sum insured = 80,000 (80%)
 Actual loss = 50,000
 Claim paid = 50,000 × (80,000/100,000) = 40,000
</code></pre>
<div class="callout"><span class="badge">Never over-insure</span> Because of the indemnity principle, insuring above the real value does not increase the payout on loss — it only wastes premium.</div>`,
    `<span class="eyebrow">GLH301 · Chương 5 · Bài 5.1</span>
<h2>Giá trị bảo hiểm, phí &amp; bồi thường (claim)</h2>
<h3>Giá trị bảo hiểm &amp; quy ước "CIF + 10%"</h3>
<p><strong>Giá trị bảo hiểm</strong> là giá trị thương mại đầy đủ của hàng hoá đang gặp rủi ro. Thông lệ thị trường, và điều khoản ICC theo mặc định, đặt <strong>giá trị bảo hiểm bằng giá CIF + 10%</strong> — phần 10% bù cho lợi nhuận/chi phí dự kiến (vd thuế nhập khẩu, xếp dỡ) mà nếu không có sẽ không được bảo hiểm khi hàng bị mất.</p>
<pre><code>Giá trị bảo hiểm = Giá trị CIF × 1,10
Ví dụ: Giá trị CIF = 100.000 USD
 Giá trị bảo hiểm = 100.000 × 1,10 = 110.000 USD
</code></pre>
<h3>Tính phí bảo hiểm</h3>
<pre><code>Phí bảo hiểm = Số tiền bảo hiểm × Tỉ lệ phí
Ví dụ: Số tiền bảo hiểm = 110.000 USD, tỉ lệ = 0,30%
 Phí = 110.000 × 0,30% = 330 USD
</code></pre>
<p><strong>Tỉ lệ phí</strong> phản ánh đánh giá rủi ro của công ty bảo hiểm: loại hàng, đóng gói, tuyến đường, phương thức vận chuyển, và điều khoản đã chọn (A/B/C).</p>
<h3>Số tiền bảo hiểm vs tổn thất thực — nguyên tắc bồi thường</h3>
<ul>
<li>Nếu <strong>số tiền bảo hiểm bằng giá trị bảo hiểm</strong> — tổn thất được trả đủ (trong giới hạn số tiền tổn thất).</li>
<li>Nếu <strong>số tiền bảo hiểm THẤP HƠN giá trị bảo hiểm</strong> ("dưới bảo hiểm") — hầu hết đơn bảo hiểm áp dụng <strong>điều kiện bồi thường theo tỉ lệ</strong>: công ty bảo hiểm chỉ trả tổn thất theo đúng tỉ lệ số tiền bảo hiểm so với giá trị đầy đủ.</li>
</ul>
<pre><code>Ví dụ dưới bảo hiểm:
 Giá trị bảo hiểm = 100.000; Số tiền bảo hiểm = 80.000 (80%)
 Tổn thất thực = 50.000
 Bồi thường = 50.000 × (80.000/100.000) = 40.000
</code></pre>
<div class="callout"><span class="badge">Không nên mua vượt giá trị</span> Vì nguyên tắc bồi thường, mua bảo hiểm cao hơn giá trị thực không làm tăng số tiền nhận khi tổn thất — chỉ lãng phí phí bảo hiểm.</div>`,
  ]]);

const c5q = quiz('glh301-quiz-5', 'Quiz 5 — Giá trị, phí & bồi thường|||Quiz 5', [
  { id: 'q1', question: 'Theo quy ước thông lệ, giá trị bảo hiểm hàng hoá thường được tính bằng?', options: ['Giá FOB × 1,05', 'Giá trị CIF × 1,10', 'Giá trị hoá đơn không cộng thêm', 'Giá trị CIF trừ chi phí bảo hiểm'], correctIndex: 1, explanation: 'Quy ước phổ biến: giá trị bảo hiểm = CIF + 10%, phần 10% bù lợi nhuận/chi phí dự kiến.' },
  { id: 'q2', question: 'Công thức tính phí bảo hiểm cơ bản là?', options: ['Phí = Số tiền bảo hiểm × Tỉ lệ phí', 'Phí = Tổn thất thực × Tỉ lệ phí', 'Phí = Giá CIF − Số tiền bảo hiểm', 'Phí luôn cố định, không phụ thuộc số tiền bảo hiểm'], correctIndex: 0, explanation: 'Phí bảo hiểm = Số tiền bảo hiểm (sum insured) nhân với tỉ lệ phí do công ty bảo hiểm áp.' },
  { id: 'q3', question: 'Nếu số tiền bảo hiểm chỉ bằng 80% giá trị bảo hiểm ("dưới bảo hiểm") và tổn thất thực là 50.000, số tiền bồi thường theo điều kiện tỉ lệ là bao nhiêu?', options: ['50.000 (trả đủ)', '40.000 (50.000 × 80%)', '0 (không được bồi thường)', '62.500 (50.000 / 80%)'], correctIndex: 1, explanation: 'Điều kiện bồi thường theo tỉ lệ: bồi thường = tổn thất thực × (số tiền bảo hiểm / giá trị bảo hiểm) = 50.000 × 80% = 40.000.' },
]);

const c6 = doc('glh301-6-1-khieu-nai-giam-dinh', '6.1 — Claims process & loss survey|||6.1 — Quy trình khiếu nại & giám định tổn thất',
  'Các bước khi phát sinh tổn thất: thông báo ngay, hạn chế tổn thất, mời giám định (surveyor), hồ sơ khiếu nại, thời hạn khiếu nại, giám định viên tổn thất chung (average adjuster).',
  [[
    `<span class="eyebrow">GLH301 · Chapter 6 · Lesson 6.1</span>
<h2>Claims process &amp; loss survey</h2>
<h3>Steps when a loss is discovered</h3>
<ol>
<li><strong>Notify the insurer/agent immediately</strong> upon discovering loss or damage.</li>
<li><strong>Take reasonable measures to minimize the loss</strong> — this duty of the insured survives even after a claim is made, and does not waive the insurer's defenses.</li>
<li><strong>Request a survey</strong> — an independent <strong>surveyor</strong> inspects the damaged cargo, assesses cause and extent of loss, and issues a survey report.</li>
<li><strong>Submit the claim file</strong> with supporting documents.</li>
<li><strong>Insurer assesses and settles</strong> the claim, or disputes it with reasons.</li>
</ol>
<h3>Typical claim documents</h3>
<ul>
<li>Insurance policy/certificate</li>
<li>Bill of lading / transport document</li>
<li>Commercial invoice &amp; packing list</li>
<li>Survey report</li>
<li>Notice of claim to the carrier (to preserve the right of recourse)</li>
</ul>
<h3>Who assesses complex claims</h3>
<p>For <strong>general average</strong> cases, a specialist called an <strong>average adjuster</strong> calculates each cargo owner's contribution to the shared sacrifice/expenditure. For ordinary claims, the insurer's own claims department or an appointed surveyor handles the assessment.</p>
<pre><code>Claim timeline (typical):
 Discover loss -> notify insurer (immediately) -> survey
 -> submit documents -> insurer assesses -> settlement
 (claims are usually time-barred if not brought within the policy's limitation period)
</code></pre>
<div class="callout"><span class="badge">Practical tip</span> Never delay notification "to gather more evidence first" — late notice is one of the most common reasons claims are reduced or rejected.</div>`,
    `<span class="eyebrow">GLH301 · Chương 6 · Bài 6.1</span>
<h2>Quy trình khiếu nại &amp; giám định tổn thất</h2>
<h3>Các bước khi phát hiện tổn thất</h3>
<ol>
<li><strong>Thông báo ngay cho công ty bảo hiểm/đại lý</strong> khi phát hiện mất mát hoặc hư hỏng.</li>
<li><strong>Áp dụng biện pháp hợp lý để hạn chế tổn thất</strong> — nghĩa vụ này của người được bảo hiểm vẫn tồn tại dù đã khiếu nại, và không làm mất quyền bảo vệ của công ty bảo hiểm.</li>
<li><strong>Yêu cầu giám định</strong> — <strong>giám định viên (surveyor)</strong> độc lập kiểm tra hàng hư hỏng, đánh giá nguyên nhân và mức độ tổn thất, lập báo cáo giám định.</li>
<li><strong>Nộp hồ sơ khiếu nại</strong> kèm chứng từ hỗ trợ.</li>
<li><strong>Công ty bảo hiểm đánh giá và giải quyết</strong> khiếu nại, hoặc từ chối kèm lý do.</li>
</ol>
<h3>Chứng từ khiếu nại thông thường</h3>
<ul>
<li>Đơn/chứng thư bảo hiểm</li>
<li>Vận đơn / chứng từ vận chuyển</li>
<li>Hoá đơn thương mại &amp; phiếu đóng gói</li>
<li>Báo cáo giám định</li>
<li>Thông báo khiếu nại tới người vận chuyển (để giữ quyền truy đòi)</li>
</ul>
<h3>Ai đánh giá khiếu nại phức tạp</h3>
<p>Với trường hợp <strong>tổn thất chung (general average)</strong>, một chuyên gia gọi là <strong>average adjuster</strong> tính toán phần đóng góp của mỗi chủ hàng vào sự hy sinh/chi phí chung. Với khiếu nại thông thường, bộ phận khiếu nại của công ty bảo hiểm hoặc giám định viên được chỉ định xử lý việc đánh giá.</p>
<pre><code>Dòng thời gian khiếu nại (điển hình):
 Phát hiện tổn thất -> thông báo ngay -> giám định
 -> nộp chứng từ -> công ty bảo hiểm đánh giá -> giải quyết
 (khiếu nại thường hết quyền nếu không nộp trong thời hạn của đơn bảo hiểm)
</code></pre>
<div class="callout"><span class="badge">Lời khuyên thực tế</span> Đừng bao giờ chậm thông báo "để thu thập thêm bằng chứng" — thông báo muộn là một trong những lý do phổ biến nhất khiến khiếu nại bị giảm hoặc từ chối.</div>`,
  ]]);

const c6q = quiz('glh301-quiz-6', 'Quiz 6 — Khiếu nại & giám định|||Quiz 6', [
  { id: 'q1', question: 'Bước đầu tiên khi phát hiện hàng hoá bị mất mát/hư hỏng là gì?', options: ['Chờ hàng đến đích rồi mới báo', 'Thông báo ngay cho công ty bảo hiểm/đại lý', 'Tự sửa chữa hàng trước khi báo', 'Gửi khiếu nại thẳng lên toà án'], correctIndex: 1, explanation: 'Thông báo ngay là bước bắt buộc đầu tiên — chậm thông báo là lý do phổ biến khiến khiếu nại bị giảm/từ chối.' },
  { id: 'q2', question: 'Vai trò của giám định viên (surveyor) trong khiếu nại là gì?', options: ['Thay công ty bảo hiểm ký hợp đồng mới', 'Kiểm tra hàng hư hỏng, đánh giá nguyên nhân & mức độ tổn thất, lập báo cáo', 'Chỉ có nhiệm vụ vận chuyển hàng đến kho khác', 'Đại diện người mua đàm phán giá hàng'], correctIndex: 1, explanation: 'Surveyor độc lập giám định hiện trường, xác định nguyên nhân và mức tổn thất, làm cơ sở cho công ty bảo hiểm giải quyết khiếu nại.' },
  { id: 'q3', question: '"Average adjuster" là chuyên gia xử lý loại tổn thất nào?', options: ['Tổn thất do lỗi đóng gói', 'Tổn thất chung (general average) — tính phần đóng góp mỗi chủ hàng', 'Tổn thất do chậm giao hàng', 'Tổn thất bảo hiểm nhân sự thuỷ thủ'], correctIndex: 1, explanation: 'Average adjuster chuyên tính toán và phân chia phần đóng góp của các chủ hàng trong trường hợp tổn thất chung.' },
]);

const c7 = doc('glh301-7-1-trach-nhiem-pi', '7.1 — Liability insurance & other types (P&I)|||7.1 — Bảo hiểm trách nhiệm & các loại hình khác (P&I)',
  'P&amp;I Club (Protection &amp; Indemnity) bảo hiểm trách nhiệm chủ tàu; bảo hiểm trách nhiệm người giao nhận (freight forwarder liability); bảo hiểm chiến tranh/đình công riêng.',
  [[
    `<span class="eyebrow">GLH301 · Chapter 7 · Lesson 7.1</span>
<h2>Liability insurance &amp; other types (P&amp;I)</h2>
<h3>Cargo insurance vs liability insurance</h3>
<p>Cargo insurance protects the <strong>value of the goods</strong>. <strong>Liability insurance</strong> instead protects a party against claims <strong>made against them</strong> by a third party — e.g. a shipowner being sued for cargo damage, or a forwarder being sued for a documentation error.</p>
<h3>P&amp;I Clubs (Protection &amp; Indemnity)</h3>
<p>Shipowners typically insure their liability exposure through mutual associations called <strong>P&amp;I Clubs</strong>, not through ordinary commercial insurers. P&amp;I cover includes: liability for cargo loss/damage, crew injury/illness, pollution, collision liability (beyond hull cover), wreck removal, and more. Unlike a fixed-premium policy, members pay <strong>calls</strong> (contributions) that can be adjusted based on the club's claims experience.</p>
<h3>Freight forwarder's liability insurance</h3>
<p>Freight forwarders and logistics companies carry their own liability cover for errors such as mis-declared cargo, wrong documentation, delay, or mishandling — distinct from the cargo owner's own cargo insurance.</p>
<h3>Other specialist covers</h3>
<ul>
<li><strong>War risk insurance</strong> — separate cover for war-related perils excluded from standard ICC clauses.</li>
<li><strong>Strikes insurance</strong> — separate cover for strikes/riots/civil commotion (SRCC).</li>
<li><strong>Container insurance</strong> — for the container itself (as equipment), separate from the goods inside it.</li>
</ul>
<pre><code>Who insures what:
 Cargo owner  -> cargo insurance (ICC A/B/C) for the goods' VALUE
 Shipowner    -> P&amp;I Club for LIABILITY to third parties/cargo/crew
 Forwarder    -> liability insurance for its OWN errors/omissions
</code></pre>
<div class="callout"><span class="badge">Don't confuse the two</span> A cargo owner with a valid cargo policy is still protected even if the carrier's liability cover, or lack of it, is a separate matter entirely.</div>`,
    `<span class="eyebrow">GLH301 · Chương 7 · Bài 7.1</span>
<h2>Bảo hiểm trách nhiệm &amp; các loại hình khác (P&amp;I)</h2>
<h3>Bảo hiểm hàng hoá vs bảo hiểm trách nhiệm</h3>
<p>Bảo hiểm hàng hoá bảo vệ <strong>giá trị của hàng hoá</strong>. <strong>Bảo hiểm trách nhiệm</strong> thì bảo vệ một bên trước các khiếu nại <strong>nhắm vào họ</strong> từ bên thứ ba — vd chủ tàu bị kiện vì làm hỏng hàng, hoặc người giao nhận bị kiện vì sai chứng từ.</p>
<h3>P&amp;I Club (Protection &amp; Indemnity)</h3>
<p>Chủ tàu thường bảo hiểm trách nhiệm của mình qua các hội tương hỗ gọi là <strong>P&amp;I Club</strong>, không phải qua công ty bảo hiểm thương mại thông thường. Bảo hiểm P&amp;I bao gồm: trách nhiệm với mất/hư hỏng hàng hoá, thương tích/bệnh của thuỷ thủ đoàn, ô nhiễm, trách nhiệm va chạm (ngoài phạm vi bảo hiểm thân tàu), trục vớt xác tàu, và nhiều hơn. Khác với đơn phí cố định, hội viên đóng <strong>calls</strong> (khoản góp) có thể điều chỉnh theo tình hình khiếu nại của hội.</p>
<h3>Bảo hiểm trách nhiệm người giao nhận</h3>
<p>Công ty giao nhận và logistics có bảo hiểm trách nhiệm riêng cho các lỗi như khai sai hàng hoá, sai chứng từ, chậm giao, hoặc xếp dỡ sai — khác với bảo hiểm hàng hoá của chính chủ hàng.</p>
<h3>Các loại bảo hiểm chuyên biệt khác</h3>
<ul>
<li><strong>Bảo hiểm chiến tranh</strong> — bảo hiểm riêng cho hiểm hoạ liên quan chiến tranh bị loại trừ khỏi điều khoản ICC chuẩn.</li>
<li><strong>Bảo hiểm đình công</strong> — bảo hiểm riêng cho đình công/bạo loạn/nổi loạn dân sự (SRCC).</li>
<li><strong>Bảo hiểm container</strong> — cho chính vỏ container (như thiết bị), khác với hàng hoá bên trong.</li>
</ul>
<pre><code>Ai bảo hiểm cho cái gì:
 Chủ hàng   -> bảo hiểm hàng hoá (ICC A/B/C) cho GIÁ TRỊ hàng
 Chủ tàu    -> P&amp;I Club cho TRÁCH NHIỆM với bên thứ ba/hàng/thuỷ thủ
 Người giao nhận -> bảo hiểm trách nhiệm cho LỖI/THIẾU SÓT của chính mình
</code></pre>
<div class="callout"><span class="badge">Đừng nhầm hai loại</span> Chủ hàng có đơn bảo hiểm hàng hoá hợp lệ vẫn được bảo vệ dù bảo hiểm trách nhiệm của hãng tàu — có hay không — là vấn đề hoàn toàn riêng.</div>`,
  ]]);

const c7q = quiz('glh301-quiz-7', 'Quiz 7 — Bảo hiểm trách nhiệm & P&I|||Quiz 7', [
  { id: 'q1', question: 'Khác biệt cơ bản giữa bảo hiểm hàng hoá và bảo hiểm trách nhiệm là gì?', options: ['Không có gì khác, cùng bảo hiểm giá trị hàng', 'Bảo hiểm hàng hoá bảo vệ giá trị hàng; bảo hiểm trách nhiệm bảo vệ trước khiếu nại của bên thứ ba', 'Bảo hiểm trách nhiệm chỉ áp dụng cho hàng không', 'Bảo hiểm hàng hoá chỉ mua được ở Việt Nam'], correctIndex: 1, explanation: 'Cargo insurance bảo vệ giá trị hàng hoá; liability insurance bảo vệ một bên trước khiếu nại nhắm vào họ từ bên thứ ba.' },
  { id: 'q2', question: 'Chủ tàu thường bảo hiểm trách nhiệm của mình qua tổ chức nào?', options: ['Công ty bảo hiểm nhân thọ', 'P&amp;I Club (hội tương hỗ Protection &amp; Indemnity)', 'Ngân hàng phát hành L/C', 'Cơ quan hải quan'], correctIndex: 1, explanation: 'P&amp;I Club là hội tương hỗ chuyên bảo hiểm trách nhiệm chủ tàu, hội viên đóng "calls" thay vì phí cố định.' },
  { id: 'q3', question: 'Bảo hiểm chiến tranh và bảo hiểm đình công cần mua riêng vì lý do gì?', options: ['Chúng đã nằm sẵn trong mọi điều khoản ICC', 'Chiến tranh và SRCC là loại trừ chung trong các điều khoản ICC chuẩn', 'Chỉ hàng hoá xuất khẩu mới cần', 'Chúng thay thế hoàn toàn cho bảo hiểm hàng hoá'], correctIndex: 1, explanation: 'Chiến tranh, đình công/bạo loạn/nổi loạn dân sự bị loại trừ chung ở cả ICC (A), (B), (C) nên cần mua điều khoản bổ sung riêng.' },
]);

const c8 = doc('glh301-8-1-quan-tri-rui-ro-vn', '8.1 — Cargo risk management & Vietnam practice|||8.1 — Quản trị rủi ro hàng hoá & thực tiễn Việt Nam',
  'Quy trình quản trị rủi ro (nhận diện → đánh giá → kiểm soát → chuyển giao/bảo hiểm); Luật Kinh doanh bảo hiểm Việt Nam; các công ty bảo hiểm nội địa; lưu ý thực tiễn cho doanh nghiệp xuất nhập khẩu.',
  [[
    `<span class="eyebrow">GLH301 · Chapter 8 · Lesson 8.1</span>
<h2>Cargo risk management &amp; Vietnam practice</h2>
<h3>The risk management cycle</h3>
<ol>
<li><strong>Identify</strong> — map the risks along the transport chain (peril types from Chapter 2).</li>
<li><strong>Assess</strong> — estimate likelihood and severity for each risk.</li>
<li><strong>Control</strong> — reduce risk through better packing, route choice, reputable carriers, security measures.</li>
<li><strong>Transfer / finance</strong> — buy insurance (the right ICC clause and sum insured) for what cannot be economically eliminated; retain small, predictable losses.</li>
</ol>
<h3>Vietnam's legal &amp; market context</h3>
<p>The <strong>Luật Kinh doanh bảo hiểm</strong> (Law on Insurance Business, most recently revised 2022) is the legal framework governing insurers, contracts, and consumer protection in Vietnam. Major domestic non-life insurers offering cargo cover include <strong>Bảo Việt, PVI, Bảo Minh, PJICO</strong>, alongside foreign insurers/brokers active in the market.</p>
<h3>Practical checklist for Vietnamese exporters/importers</h3>
<ul>
<li>Match the Incoterm chosen to who is obliged (or well-advised) to insure — don't assume the other side has cover.</li>
<li>Choose ICC (A) for high-value/fragile/high-theft cargo; ICC (C) may be adequate and cheaper for bulk, low-value commodities.</li>
<li>Set the sum insured correctly (typically CIF + 10%) to avoid under-insurance penalties.</li>
<li>Keep all shipping documents (B/L, invoice, packing list) ready — they are needed fast if a claim arises.</li>
<li>Notify losses immediately and request survey before cargo is moved or repaired.</li>
</ul>
<pre><code>Risk management in one line:
 Identify -> Assess -> Control (reduce) -> Transfer (insure) -> Retain (accept small risk)
</code></pre>
<div class="callout"><span class="badge">Course takeaway</span> Insurance is the last line of defense, not the first — good risk management (packing, carrier choice, documentation) reduces both losses and premiums.</div>`,
    `<span class="eyebrow">GLH301 · Chương 8 · Bài 8.1</span>
<h2>Quản trị rủi ro hàng hoá &amp; thực tiễn Việt Nam</h2>
<h3>Chu trình quản trị rủi ro</h3>
<ol>
<li><strong>Nhận diện</strong> — vạch ra các rủi ro trong toàn chuỗi vận chuyển (các loại hiểm hoạ ở Chương 2).</li>
<li><strong>Đánh giá</strong> — ước tính khả năng xảy ra và mức độ nghiêm trọng của mỗi rủi ro.</li>
<li><strong>Kiểm soát</strong> — giảm rủi ro bằng đóng gói tốt hơn, chọn tuyến đường, hãng vận chuyển uy tín, biện pháp an ninh.</li>
<li><strong>Chuyển giao / tài trợ</strong> — mua bảo hiểm (đúng điều khoản ICC và số tiền bảo hiểm) cho phần không thể loại bỏ hiệu quả; tự chịu những tổn thất nhỏ, dự đoán được.</li>
</ol>
<h3>Bối cảnh pháp lý &amp; thị trường Việt Nam</h3>
<p><strong>Luật Kinh doanh bảo hiểm</strong> (sửa đổi gần nhất năm 2022) là khung pháp lý quản lý công ty bảo hiểm, hợp đồng, và bảo vệ người tiêu dùng tại Việt Nam. Các công ty bảo hiểm phi nhân thọ nội địa lớn có bán bảo hiểm hàng hoá gồm <strong>Bảo Việt, PVI, Bảo Minh, PJICO</strong>, cùng với các công ty/môi giới bảo hiểm nước ngoài hoạt động trên thị trường.</p>
<h3>Danh mục thực tiễn cho doanh nghiệp xuất nhập khẩu Việt Nam</h3>
<ul>
<li>Khớp điều kiện Incoterms đã chọn với ai có nghĩa vụ (hoặc nên) mua bảo hiểm — không giả định bên kia đã mua.</li>
<li>Chọn ICC (A) cho hàng giá trị cao/dễ vỡ/dễ bị trộm; ICC (C) có thể đủ và rẻ hơn cho hàng rời, giá trị thấp.</li>
<li>Đặt đúng số tiền bảo hiểm (thường CIF + 10%) để tránh bị áp điều kiện dưới bảo hiểm.</li>
<li>Giữ sẵn mọi chứng từ vận chuyển (vận đơn, hoá đơn, phiếu đóng gói) — cần ngay khi phát sinh khiếu nại.</li>
<li>Thông báo tổn thất ngay và yêu cầu giám định trước khi di chuyển hoặc sửa chữa hàng.</li>
</ul>
<pre><code>Quản trị rủi ro trong một dòng:
 Nhận diện -> Đánh giá -> Kiểm soát (giảm) -> Chuyển giao (bảo hiểm) -> Tự chịu (rủi ro nhỏ)
</code></pre>
<div class="callout"><span class="badge">Điều đọng lại của môn học</span> Bảo hiểm là tuyến phòng thủ cuối, không phải đầu tiên — quản trị rủi ro tốt (đóng gói, chọn hãng vận chuyển, chứng từ) giảm cả tổn thất và phí bảo hiểm.</div>`,
  ]]);

const c8q = quiz('glh301-quiz-8', 'Quiz 8 — Quản trị rủi ro & thực tiễn VN|||Quiz 8', [
  { id: 'q1', question: 'Bốn bước của chu trình quản trị rủi ro hàng hoá theo đúng thứ tự là gì?', options: ['Chuyển giao → Kiểm soát → Đánh giá → Nhận diện', 'Nhận diện → Đánh giá → Kiểm soát → Chuyển giao', 'Kiểm soát → Nhận diện → Chuyển giao → Đánh giá', 'Đánh giá → Chuyển giao → Nhận diện → Kiểm soát'], correctIndex: 1, explanation: 'Chu trình chuẩn: nhận diện rủi ro → đánh giá khả năng/mức độ → kiểm soát (giảm) → chuyển giao (mua bảo hiểm) hoặc tự chịu.' },
  { id: 'q2', question: 'Văn bản pháp lý nào quản lý hoạt động kinh doanh bảo hiểm tại Việt Nam?', options: ['Luật Thương mại', 'Luật Kinh doanh bảo hiểm', 'Luật Hải quan', 'Luật Doanh nghiệp'], correctIndex: 1, explanation: 'Luật Kinh doanh bảo hiểm (sửa đổi gần nhất 2022) là khung pháp lý cho công ty bảo hiểm, hợp đồng bảo hiểm và bảo vệ người tiêu dùng tại Việt Nam.' },
  { id: 'q3', question: 'Vì sao bảo hiểm được coi là "tuyến phòng thủ cuối" trong quản trị rủi ro hàng hoá, không phải đầu tiên?', options: ['Vì bảo hiểm luôn rẻ hơn các biện pháp kiểm soát khác', 'Vì đóng gói/chọn hãng vận chuyển/chứng từ tốt giúp giảm rủi ro trước khi cần dùng đến bảo hiểm', 'Vì bảo hiểm chỉ áp dụng sau khi hàng đã tới đích', 'Vì luật pháp Việt Nam yêu cầu kiểm soát rủi ro trước khi mua bảo hiểm'], correctIndex: 1, explanation: 'Quản trị rủi ro tốt (nhận diện, kiểm soát) giảm khả năng và mức độ tổn thất trước; bảo hiểm chỉ xử lý phần rủi ro còn lại không loại bỏ được.' },
]);

export default {
  semester: { code: 'FPTU_Hola5', name: 'Kỳ 5', ordinal: 7 },
  course: {
    courseCode: 'GLH301',
    slug: 'glh301-goods-and-insurance',
    title: 'Goods and Insurance',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/GLH301.webp',
    shortDescription: 'Cargo insurance in trade — transport risks, Incoterms 2020 insurance duty, ICC A/B/C clauses, insured value/premium/claims, loss survey, liability & P&I, Vietnam practice. Bilingual, with examples & quizzes.|||Bảo hiểm hàng hoá trong ngoại thương — rủi ro vận chuyển, Incoterms 2020 & trách nhiệm bảo hiểm, điều khoản ICC A/B/C, giá trị/phí/bồi thường, giám định tổn thất, bảo hiểm trách nhiệm & P&I, thực tiễn Việt Nam. Song ngữ, có ví dụ & quiz.',
    description: 'Môn <strong>GLH301 — Goods and Insurance</strong> (khối Quản trị Kinh doanh, kỳ 5) trang bị kiến thức <strong>bảo hiểm hàng hoá trong thương mại quốc tế</strong>. Từ <strong>nguyên lý bảo hiểm</strong> &amp; <strong>rủi ro vận chuyển</strong> → <strong>Incoterms 2020</strong> &amp; trách nhiệm bảo hiểm (CIF/CIP) → <strong>hợp đồng bảo hiểm</strong> &amp; điều khoản <strong>ICC A/B/C</strong> → <strong>giá trị bảo hiểm, phí &amp; bồi thường</strong> → <strong>khiếu nại &amp; giám định tổn thất</strong> → <strong>bảo hiểm trách nhiệm &amp; P&amp;I</strong> → <strong>quản trị rủi ro</strong> &amp; thực tiễn Việt Nam. Bám giáo trình (Marine Insurance — Bennett; Incoterms 2020 — ICC; Luật Kinh doanh bảo hiểm VN; Institute Cargo Clauses), song ngữ, có ví dụ tính toán và quiz mỗi chương.',
    whatYouLearn: 'Nguyên lý bảo hiểm hàng hoá (quyền lợi bảo hiểm, bồi thường, thế quyền, góp phần); phân loại rủi ro/hiểm hoạ vận chuyển; Incoterms 2020 & ai phải mua bảo hiểm (CIF/CIP); chứng từ & điều khoản bảo hiểm ICC A/B/C; giá trị bảo hiểm (CIF+10%), tính phí, nguyên tắc bồi thường theo tỉ lệ; quy trình khiếu nại & giám định tổn thất; P&I Club & bảo hiểm trách nhiệm; quản trị rủi ro hàng hoá & thực tiễn thị trường bảo hiểm Việt Nam.',
    requirements: 'Kiến thức nền về xuất nhập khẩu/logistics (nên học trước các môn nhập môn Kinh doanh quốc tế/Logistics). Không yêu cầu kiến thức bảo hiểm trước đó.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Marine Insurance (Bennett), Incoterms 2020 (ICC), Luật KDBH VN, ICC A/B/C, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Vì sao thương mại quốc tế cần bảo hiểm hàng hoá; các bên liên quan; lộ trình 8 chương.', lessons: [intro] },
    { title: 'Chương 1 — Tổng quan bảo hiểm hàng hoá|||Chapter 1 — Overview of cargo insurance', description: 'Quyền lợi bảo hiểm, 5 nguyên tắc bảo hiểm hàng hải.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Rủi ro trong vận chuyển & phân loại|||Chapter 2 — Transport risks & classification', description: 'Hiểm hoạ tự nhiên/con người; tổn thất toàn bộ/riêng phần/chung.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Incoterms 2020 & trách nhiệm bảo hiểm|||Chapter 3 — Incoterms 2020 & insurance responsibility', description: '11 điều kiện Incoterms; CIF/CIP buộc mua bảo hiểm.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Hợp đồng bảo hiểm & điều khoản ICC A/B/C|||Chapter 4 — Insurance contracts & ICC A/B/C clauses', description: 'Chứng từ bảo hiểm; phạm vi ICC (A)/(B)/(C); loại trừ; thời hạn.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Giá trị bảo hiểm, phí & bồi thường|||Chapter 5 — Insured value, premium & claims', description: 'CIF+10%; công thức phí; bồi thường theo tỉ lệ khi dưới bảo hiểm.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Quy trình khiếu nại & giám định tổn thất|||Chapter 6 — Claims process & loss survey', description: 'Thông báo, giám định, chứng từ, average adjuster.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Bảo hiểm trách nhiệm & P&I|||Chapter 7 — Liability insurance & P&I', description: 'P&I Club, bảo hiểm trách nhiệm người giao nhận, bảo hiểm chuyên biệt.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Quản trị rủi ro hàng hoá & thực tiễn VN|||Chapter 8 — Cargo risk management & Vietnam practice', description: 'Chu trình quản trị rủi ro; Luật KDBH VN; danh mục thực tiễn.', lessons: [c8, c8q] },
  ],
};
