/**
 * CTM201c — Contract Management. Giáo trình FLM (syl): tổng quan hợp đồng &
 * quản lý hợp đồng — pháp luật hợp đồng cơ bản (Bộ luật Dân sự 2015, Luật
 * Thương mại 2005), các loại hợp đồng thương mại, soạn thảo & đàm phán,
 * quản lý thực hiện & tuân thủ, rủi ro/thay đổi/tranh chấp, kết thúc & thanh
 * lý, số hoá hợp đồng (CLM/e-contract/chữ ký số). Song ngữ + ví dụ + bài tập.
 * Giữ NGUYÊN slug/semester/courseCode/thumbnailUrl. ⚠️ KHÔNG backtick/${}.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('ctm201c-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: khung kiến thức (IACCM/WorldCC, NCMA CMBOK), pháp luật VN (Bộ luật Dân sự, Luật Thương mại), YouTube, công cụ, lộ trình tự học.',
  [[
    `<span class="eyebrow">CTM201c · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn Contract Management — contract law basics, contract types, drafting, performance monitoring, risk &amp; dispute handling, closeout, and digitalization — in one place. The full official slides &amp; textbook live on <strong>FLM</strong>; below are free, legal references.</p>
<h3>📘 Official course materials</h3>
<p>The official FPTU giáo trình &amp; lecture slides for CTM201c are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books &amp; bodies of knowledge</h3>
<ul>
<li><em>Contract Management</em> — course text referenced by the FPTU curriculum (Cummins/IACCM lineage).</li>
<li><a href="https://www.worldcc.com/" target="_blank" rel="noopener">World Commerce &amp; Contracting (formerly IACCM)</a> — global contract management body of knowledge &amp; research.</li>
<li><a href="https://www.ncmahq.org/" target="_blank" rel="noopener">NCMA — Contract Management Body of Knowledge (CMBOK)</a></li>
</ul>
<h3>⚖️ Vietnamese law (official text)</h3>
<ul>
<li><a href="https://vanban.chinhphu.vn/" target="_blank" rel="noopener">Bộ luật Dân sự 2015 (Civil Code) — Cổng thông tin điện tử Chính phủ</a></li>
<li><a href="https://thuvienphapluat.vn/" target="_blank" rel="noopener">Luật Thương mại 2005 (Commercial Law) — Thư viện Pháp luật</a></li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@WorldCommerceandContracting" target="_blank" rel="noopener">World Commerce &amp; Contracting</a> — contract management practice &amp; webinars</li>
<li><a href="https://www.youtube.com/@lawinsider" target="_blank" rel="noopener">Law Insider</a> — clause explanations &amp; contract drafting tips</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://www.lawinsider.com/" target="_blank" rel="noopener">Law Insider</a> — searchable library of real contract clauses</li>
<li><a href="https://www.docusign.com/" target="_blank" rel="noopener">DocuSign</a> / <a href="https://www.adobe.com/sign.html" target="_blank" rel="noopener">Adobe Sign</a> — e-signature tools showing a modern CLM front-end</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation / exam core</strong> — contract elements, formation &amp; validity conditions (Civil Code Art. 117), contract lifecycle.</li>
<li><strong>Practice</strong> — read real contract clauses (Law Insider) and map each to a chapter of this course.</li>
<li><strong>Go deeper</strong> — drafting &amp; negotiation, performance monitoring, risk/change/dispute.</li>
<li><strong>Job-ready</strong> — closeout checklists, and how modern CLM/e-signature tools operationalize the whole lifecycle.</li>
</ol></div>`,
    `<span class="eyebrow">CTM201c · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học Quản lý hợp đồng — pháp luật hợp đồng cơ bản, các loại hợp đồng, soạn thảo, giám sát thực hiện, quản lý rủi ro &amp; tranh chấp, thanh lý, và số hoá — gom về một chỗ. Slide &amp; giáo trình chính thức đầy đủ nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp.</p>
<h3>📘 Tài liệu chính thức của môn</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của CTM201c có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo &amp; khung kiến thức</h3>
<ul>
<li><em>Contract Management</em> — giáo trình được khung chương trình FPTU tham chiếu (gốc Cummins/IACCM).</li>
<li><a href="https://www.worldcc.com/" target="_blank" rel="noopener">World Commerce &amp; Contracting (trước đây là IACCM)</a> — khung kiến thức &amp; nghiên cứu quản lý hợp đồng toàn cầu.</li>
<li><a href="https://www.ncmahq.org/" target="_blank" rel="noopener">NCMA — Contract Management Body of Knowledge (CMBOK)</a></li>
</ul>
<h3>⚖️ Pháp luật Việt Nam (văn bản chính thức)</h3>
<ul>
<li><a href="https://vanban.chinhphu.vn/" target="_blank" rel="noopener">Bộ luật Dân sự 2015 — Cổng thông tin điện tử Chính phủ</a></li>
<li><a href="https://thuvienphapluat.vn/" target="_blank" rel="noopener">Luật Thương mại 2005 — Thư viện Pháp luật</a></li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@WorldCommerceandContracting" target="_blank" rel="noopener">World Commerce &amp; Contracting</a> — thực tiễn &amp; hội thảo quản lý hợp đồng</li>
<li><a href="https://www.youtube.com/@lawinsider" target="_blank" rel="noopener">Law Insider</a> — giải thích điều khoản &amp; kỹ thuật soạn hợp đồng</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://www.lawinsider.com/" target="_blank" rel="noopener">Law Insider</a> — thư viện điều khoản hợp đồng thật, tra cứu được</li>
<li><a href="https://www.docusign.com/" target="_blank" rel="noopener">DocuSign</a> / <a href="https://www.adobe.com/sign.html" target="_blank" rel="noopener">Adobe Sign</a> — công cụ chữ ký điện tử, hình dung một CLM hiện đại</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền / lõi thi</strong> — các yếu tố hợp đồng, điều kiện giao kết &amp; hiệu lực (Điều 117 BLDS), vòng đời hợp đồng.</li>
<li><strong>Luyện tập</strong> — đọc điều khoản hợp đồng thật (Law Insider) và gắn từng điều khoản vào đúng chương của môn.</li>
<li><strong>Đào sâu</strong> — soạn thảo &amp; đàm phán, giám sát thực hiện, rủi ro/thay đổi/tranh chấp.</li>
<li><strong>Sẵn sàng đi làm</strong> — checklist thanh lý, và cách CLM/chữ ký số hiện đại vận hành cả vòng đời.</li>
</ol></div>`,
  ]]);

const intro = doc('ctm201c-0-1-overview', 'Course overview: Contract Management|||Tổng quan: Quản lý hợp đồng',
  'Hợp đồng là gì, vì sao quản lý hợp đồng quan trọng; vòng đời hợp đồng; lộ trình môn học từ pháp luật cơ bản đến số hoá CLM.',
  [[
    `<span class="eyebrow">CTM201c · Lesson 0.1 · Overview</span>
<h2>Contract Management</h2>
<p class="lead">This course teaches how organizations create, negotiate, execute, and close out <strong>contracts</strong> — the legal backbone of every business relationship. You will learn contract law fundamentals under Vietnamese law, common commercial contract types, drafting and negotiation skills, and how to manage a contract through its full lifecycle: performance monitoring, risk, change and dispute handling, closeout, and modern contract digitalization (CLM, e-contract, e-signature).</p>
<h3>Why contract management matters</h3>
<ul>
<li><strong>Contracts allocate risk</strong> — who pays if something goes wrong, and how much.</li>
<li><strong>Contracts are living documents</strong> — most value is won or lost AFTER signature, during performance.</li>
<li><strong>Poor contract management</strong> is a leading cause of revenue leakage, disputes, and compliance failures in real organizations.</li>
</ul>
<h3>The contract lifecycle</h3>
<p>Request &amp; initiation → drafting &amp; negotiation → approval &amp; signature → performance &amp; compliance monitoring → change &amp; amendment → renewal or closeout. This course follows that lifecycle chapter by chapter, referencing Vietnam's <strong>Civil Code 2015</strong> and <strong>Commercial Law 2005</strong>, plus international frameworks (IACCM/WorldCC, NCMA CMBOK).</p>`,
    `<span class="eyebrow">CTM201c · Bài 0.1 · Tổng quan</span>
<h2>Quản lý hợp đồng</h2>
<p class="lead">Môn này dạy cách các tổ chức tạo lập, đàm phán, thực hiện và kết thúc <strong>hợp đồng</strong> — nền tảng pháp lý của mọi quan hệ kinh doanh. Bạn học pháp luật hợp đồng cơ bản theo luật Việt Nam, các loại hợp đồng thương mại thông dụng, kỹ năng soạn thảo &amp; đàm phán, và cách quản lý hợp đồng suốt vòng đời: giám sát thực hiện, xử lý rủi ro/thay đổi/tranh chấp, kết thúc hợp đồng, và số hoá quản lý hợp đồng hiện đại (CLM, e-contract, chữ ký số).</p>
<h3>Vì sao quản lý hợp đồng quan trọng</h3>
<ul>
<li><strong>Hợp đồng phân bổ rủi ro</strong> — ai chịu nếu có sự cố, và chịu bao nhiêu.</li>
<li><strong>Hợp đồng là văn bản "sống"</strong> — phần lớn giá trị được thu về hoặc mất đi SAU khi ký, trong lúc thực hiện.</li>
<li><strong>Quản lý hợp đồng yếu</strong> là nguyên nhân hàng đầu gây thất thoát doanh thu, tranh chấp và vi phạm tuân thủ trong thực tế.</li>
</ul>
<h3>Vòng đời hợp đồng</h3>
<p>Khởi tạo yêu cầu → soạn thảo &amp; đàm phán → phê duyệt &amp; ký kết → thực hiện &amp; giám sát tuân thủ → thay đổi &amp; sửa đổi → gia hạn hoặc kết thúc. Môn học đi theo vòng đời này từng chương, bám <strong>Bộ luật Dân sự 2015</strong> và <strong>Luật Thương mại 2005</strong> của Việt Nam, cùng khung quốc tế (IACCM/WorldCC, NCMA CMBOK).</p>`,
  ]]);

const c1 = doc('ctm201c-1-1-tong-quan', '1.1 — Overview of contracts & contract management|||1.1 — Tổng quan hợp đồng & quản lý hợp đồng',
  'Định nghĩa hợp đồng, các yếu tố cấu thành, ba giai đoạn quản lý hợp đồng (pre-award/award/post-award), ai chịu trách nhiệm quản lý hợp đồng.',
  [[
    `<span class="eyebrow">CTM201c · Chapter 1 · Lesson 1.1</span>
<h2>Overview of contracts &amp; contract management</h2>
<h3>What is a contract?</h3>
<p>A <strong>contract</strong> is an agreement between two or more parties that creates enforceable rights and obligations. Under Vietnamese law (Civil Code 2015, Art. 385), a civil contract is "an agreement between parties on the establishment, change, or termination of civil rights and obligations."</p>
<h3>Essential elements</h3>
<ul>
<li><strong>Parties</strong> with legal capacity to contract.</li>
<li><strong>Offer</strong> (đề nghị giao kết) and <strong>acceptance</strong> (chấp nhận đề nghị).</li>
<li><strong>Subject matter</strong> that is lawful and not prohibited.</li>
<li><strong>Genuine consent</strong> — free from fraud, duress, or mistake.</li>
</ul>
<h3>What is contract management?</h3>
<p><strong>Contract management (CM)</strong> is the discipline of managing contract creation, execution, and analysis to maximize value and minimize risk. It spans three phases: <strong>pre-award</strong> (drafting, negotiation), <strong>award</strong> (approval, signature), and <strong>post-award</strong> (performance monitoring, compliance, change, closeout) — the post-award phase is where most value is won or lost, yet it is the most neglected in practice.</p>
<pre><code>Contract lifecycle (CLM):
 Request -&gt; Draft -&gt; Negotiate -&gt; Approve -&gt; Sign
   -&gt; Perform &amp; monitor -&gt; Change/Amend -&gt; Renew or Close-out
</code></pre>
<h3>Who owns contract management</h3>
<p>In practice CM is shared: <strong>Legal</strong> (risk, compliance, clauses), <strong>Procurement/Sales</strong> (commercial terms, relationship), <strong>Finance</strong> (payment, budget), and the <strong>business owner</strong> (delivery, performance). A contract manager coordinates across these roles.</p>
<div class="callout"><span class="badge">Key idea</span> A signed contract is not the finish line — it is the starting line for the obligations both sides must now perform.</div>`,
    `<span class="eyebrow">CTM201c · Chương 1 · Bài 1.1</span>
<h2>Tổng quan hợp đồng &amp; quản lý hợp đồng</h2>
<h3>Hợp đồng là gì?</h3>
<p>Một <strong>hợp đồng</strong> là thoả thuận giữa hai hay nhiều bên, tạo ra quyền và nghĩa vụ có thể yêu cầu thực hiện. Theo pháp luật Việt Nam (Bộ luật Dân sự 2015, Điều 385), hợp đồng dân sự là "sự thoả thuận giữa các bên về việc xác lập, thay đổi hoặc chấm dứt quyền, nghĩa vụ dân sự."</p>
<h3>Các yếu tố cấu thành</h3>
<ul>
<li><strong>Các bên</strong> có năng lực pháp luật để giao kết hợp đồng.</li>
<li><strong>Đề nghị giao kết</strong> và <strong>chấp nhận đề nghị giao kết</strong>.</li>
<li><strong>Đối tượng của hợp đồng</strong> hợp pháp, không bị cấm.</li>
<li><strong>Sự đồng ý thực sự</strong> — không do lừa dối, cưỡng ép hay nhầm lẫn.</li>
</ul>
<h3>Quản lý hợp đồng là gì?</h3>
<p><strong>Quản lý hợp đồng (CM)</strong> là hoạt động quản lý việc tạo lập, thực hiện và phân tích hợp đồng nhằm tối đa hoá giá trị và tối thiểu hoá rủi ro. Nó trải qua ba giai đoạn: <strong>trước ký (pre-award)</strong> (soạn thảo, đàm phán), <strong>ký kết (award)</strong> (phê duyệt, ký), và <strong>sau ký (post-award)</strong> (giám sát thực hiện, tuân thủ, thay đổi, kết thúc) — giai đoạn sau ký là nơi phần lớn giá trị được thu về hoặc mất đi, nhưng lại thường bị xem nhẹ nhất trong thực tế.</p>
<pre><code>Vòng đời hợp đồng (CLM):
 Yêu cầu -&gt; Soạn thảo -&gt; Đàm phán -&gt; Phê duyệt -&gt; Ký
   -&gt; Thực hiện &amp; giám sát -&gt; Thay đổi/Sửa đổi -&gt; Gia hạn hoặc Kết thúc
</code></pre>
<h3>Ai chịu trách nhiệm quản lý hợp đồng</h3>
<p>Trong thực tế CM là trách nhiệm chung: <strong>Pháp chế</strong> (rủi ro, tuân thủ, điều khoản), <strong>Mua hàng/Kinh doanh</strong> (điều khoản thương mại, quan hệ), <strong>Tài chính</strong> (thanh toán, ngân sách), và <strong>bộ phận nghiệp vụ</strong> (giao hàng, thực hiện). Người quản lý hợp đồng điều phối giữa các vai trò này.</p>
<div class="callout"><span class="badge">Ý chính</span> Hợp đồng đã ký không phải là điểm kết thúc — đó là điểm khởi đầu cho các nghĩa vụ cả hai bên phải thực hiện.</div>`,
  ]]);

const c1q = quiz('ctm201c-quiz-1', 'Quiz 1 — Overview|||Quiz 1 — Tổng quan', [
  { id: 'q1', question: 'Theo Bộ luật Dân sự 2015 (Điều 385), hợp đồng dân sự là gì?', options: ['Văn bản do một bên tự soạn và công bố', 'Sự thoả thuận giữa các bên về xác lập, thay đổi hoặc chấm dứt quyền, nghĩa vụ dân sự', 'Quyết định hành chính của cơ quan nhà nước', 'Biên bản ghi nhớ không có giá trị pháp lý'], correctIndex: 1, explanation: 'Điều 385 BLDS 2015 định nghĩa hợp đồng là sự thoả thuận giữa các bên.' },
  { id: 'q2', question: 'Ba giai đoạn của quản lý hợp đồng (CM) theo thứ tự là?', options: ['Post-award → Award → Pre-award', 'Pre-award → Award → Post-award', 'Award → Pre-award → Post-award', 'Chỉ có một giai đoạn duy nhất'], correctIndex: 1, explanation: 'CM trải qua pre-award (soạn thảo/đàm phán) → award (ký) → post-award (thực hiện/kết thúc).' },
  { id: 'q3', question: 'Giai đoạn nào của vòng đời hợp đồng thường bị xem nhẹ nhất nhưng lại là nơi phần lớn giá trị được thu về hoặc mất đi?', options: ['Pre-award (soạn thảo)', 'Award (ký kết)', 'Post-award (thực hiện, sau ký)', 'Không giai đoạn nào quan trọng hơn'], correctIndex: 2, explanation: 'Giai đoạn sau ký (post-award) — giám sát thực hiện — là nơi giá trị thực sự được giữ hoặc thất thoát.' },
]);

const c2 = doc('ctm201c-2-1-phap-luat-hop-dong', '2.1 — Contract law basics: formation & validity|||2.1 — Pháp luật hợp đồng cơ bản: giao kết & hiệu lực',
  'Giao kết hợp đồng (đề nghị/chấp nhận), điều kiện có hiệu lực (Điều 117 BLDS), hợp đồng vô hiệu vs có thể bị vô hiệu, quan hệ BLDS-Luật Thương mại.',
  [[
    `<span class="eyebrow">CTM201c · Chapter 2 · Lesson 2.1</span>
<h2>Contract law basics: formation &amp; validity</h2>
<h3>Contract formation (giao kết hợp đồng)</h3>
<p>Under the Civil Code 2015, a contract is formed when an <strong>offer</strong> is met by a matching <strong>acceptance</strong>. Time and place of formation: when the offeror receives the acceptance (unless otherwise agreed), or — for contracts requiring a specific form (writing, notarization) — when that form is completed.</p>
<h3>Conditions for a legally valid civil transaction (Art. 117)</h3>
<ul>
<li>Parties have the legal capacity appropriate to the transaction.</li>
<li>Parties participate entirely voluntarily.</li>
<li>Purpose and content do not violate legal prohibitions or social ethics.</li>
<li>Form complies with the law where the law requires a specific form (e.g. writing, notarized/authenticated, or registered — real estate transfer).</li>
</ul>
<h3>When a contract is void / voidable</h3>
<ul>
<li><strong>Void (vô hiệu)</strong> — violates a mandatory legal prohibition, is a sham transaction, or lacks legal capacity/genuine consent from the start; treated as never having had legal effect.</li>
<li><strong>Voidable</strong> — formed under mistake, fraud, duress, or by a person with limited capacity; valid until a competent court declares it void within the statute of limitation.</li>
</ul>
<pre><code>Quick validity check:
 1) Capacity?          (đủ năng lực hành vi)
 2) Genuine consent?   (không lừa dối/ép buộc/nhầm lẫn)
 3) Lawful purpose?    (không vi phạm điều cấm/đạo đức)
 4) Required form met? (văn bản/công chứng nếu luật buộc)
 -&gt; All 4 YES = valid contract
</code></pre>
<div class="callout"><span class="badge">Commercial Law 2005</span> For business-to-business trade in goods and commercial services, the Commercial Law 2005 applies alongside the Civil Code as the general framework — the Civil Code fills any gap the Commercial Law does not cover.</div>`,
    `<span class="eyebrow">CTM201c · Chương 2 · Bài 2.1</span>
<h2>Pháp luật hợp đồng cơ bản: giao kết &amp; hiệu lực</h2>
<h3>Giao kết hợp đồng</h3>
<p>Theo Bộ luật Dân sự 2015, hợp đồng được giao kết khi một <strong>đề nghị giao kết</strong> được đáp lại bằng một <strong>chấp nhận đề nghị</strong> phù hợp. Thời điểm và nơi giao kết: khi bên đề nghị nhận được chấp nhận (trừ khi có thoả thuận khác), hoặc — với hợp đồng buộc phải theo hình thức nhất định (văn bản, công chứng) — khi hoàn tất hình thức đó.</p>
<h3>Điều kiện có hiệu lực của giao dịch dân sự (Điều 117)</h3>
<ul>
<li>Các bên có năng lực pháp luật, năng lực hành vi phù hợp với giao dịch.</li>
<li>Các bên tham gia hoàn toàn tự nguyện.</li>
<li>Mục đích và nội dung không vi phạm điều cấm của luật, không trái đạo đức xã hội.</li>
<li>Hình thức phù hợp với quy định của luật trong trường hợp luật buộc theo hình thức nhất định (vd văn bản, công chứng/chứng thực, hoặc đăng ký — chuyển nhượng bất động sản).</li>
</ul>
<h3>Khi nào hợp đồng vô hiệu / có thể bị vô hiệu</h3>
<ul>
<li><strong>Vô hiệu</strong> — vi phạm điều cấm của luật, là giao dịch giả tạo, hoặc thiếu năng lực/sự đồng ý thực sự ngay từ đầu; coi như chưa từng có hiệu lực pháp lý.</li>
<li><strong>Có thể bị vô hiệu (voidable)</strong> — được xác lập do nhầm lẫn, lừa dối, cưỡng ép, hoặc bởi người có năng lực hành vi hạn chế; vẫn có hiệu lực cho đến khi toà án có thẩm quyền tuyên vô hiệu trong thời hạn khởi kiện.</li>
</ul>
<pre><code>Kiểm nhanh hiệu lực:
 1) Đủ năng lực?         (đủ năng lực hành vi)
 2) Đồng ý thực sự?      (không lừa dối/ép buộc/nhầm lẫn)
 3) Mục đích hợp pháp?   (không vi phạm điều cấm/đạo đức)
 4) Đúng hình thức luật buộc? (văn bản/công chứng nếu cần)
 -&gt; Cả 4 CÓ = hợp đồng có hiệu lực
</code></pre>
<div class="callout"><span class="badge">Luật Thương mại 2005</span> Với mua bán hàng hoá và dịch vụ thương mại giữa các thương nhân, Luật Thương mại 2005 áp dụng cùng Bộ luật Dân sự làm khung chung — Bộ luật Dân sự bổ khuyết những phần Luật Thương mại không quy định.</div>`,
  ]]);

const c2q = quiz('ctm201c-quiz-2', 'Quiz 2 — Contract law|||Quiz 2 — Pháp luật hợp đồng', [
  { id: 'q1', question: 'Điều 117 Bộ luật Dân sự 2015 quy định điều kiện có hiệu lực của giao dịch dân sự KHÔNG bao gồm yếu tố nào?', options: ['Năng lực pháp luật, năng lực hành vi phù hợp', 'Tham gia hoàn toàn tự nguyện', 'Mục đích, nội dung không vi phạm điều cấm/đạo đức', 'Phải có người làm chứng ký tên trong mọi trường hợp'], correctIndex: 3, explanation: 'Điều 117 không yêu cầu người làm chứng trong mọi trường hợp; hình thức chỉ bắt buộc khi luật quy định.' },
  { id: 'q2', question: 'Khác biệt chính giữa hợp đồng "vô hiệu" và "có thể bị vô hiệu" là?', options: ['Không có khác biệt, hai thuật ngữ đồng nghĩa', 'Vô hiệu coi như chưa từng có hiệu lực; có thể bị vô hiệu vẫn có hiệu lực cho đến khi toà tuyên vô hiệu', 'Có thể bị vô hiệu luôn nghiêm trọng hơn vô hiệu', 'Chỉ hợp đồng bằng văn bản mới có thể vô hiệu'], correctIndex: 1, explanation: 'Vô hiệu = chưa từng có hiệu lực; voidable = có hiệu lực đến khi bị toà tuyên vô hiệu trong thời hạn.' },
  { id: 'q3', question: 'Luật Thương mại 2005 và Bộ luật Dân sự 2015 quan hệ với nhau như thế nào?', options: ['Luật Thương mại thay thế hoàn toàn Bộ luật Dân sự', 'Luật Thương mại áp dụng cho hoạt động thương mại, Bộ luật Dân sự là khung chung bổ khuyết phần chưa quy định', 'Hai luật không liên quan gì đến nhau', 'Chỉ áp dụng Bộ luật Dân sự nếu hợp đồng có giá trị dưới 100 triệu'], correctIndex: 1, explanation: 'Luật Thương mại điều chỉnh hoạt động thương mại; Bộ luật Dân sự là luật chung bổ khuyết.' },
]);

const c3 = doc('ctm201c-3-1-loai-hop-dong', '3.1 — Common commercial contract types|||3.1 — Các loại hợp đồng thương mại thông dụng',
  'Hợp đồng mua bán hàng hoá, dịch vụ, thuê tài sản, xây dựng/EPC, đại lý/phân phối, NDA — rủi ro chính và điều khoản cần chú ý của mỗi loại.',
  [[
    `<span class="eyebrow">CTM201c · Chapter 3 · Lesson 3.1</span>
<h2>Common commercial contract types</h2>
<p>Most business contracts are variations on a handful of core types. Recognizing the type tells you which risks and clauses matter most.</p>
<pre><code>Type                      | Core risk                 | Key clause to watch
--------------------------|----------------------------|----------------------
Sale of goods             | Quality, delivery, title   | Inspection &amp; acceptance
Service                   | Scope creep, SLA           | Scope &amp; acceptance criteria
Lease                     | Maintenance, return state  | Term &amp; renewal
Construction / EPC        | Delay, defects, variation  | Liquidated damages
Agency / Distribution     | Territory, exclusivity     | Termination &amp; compensation
NDA / Confidentiality     | Leakage of info            | Duration &amp; carve-outs
</code></pre>
<h3>Sale of goods contracts (hợp đồng mua bán hàng hoá)</h3>
<p>Governed by the Commercial Law 2005 when both parties act for commercial purposes. Core terms: goods description, quantity/quality, price, delivery time &amp; place, payment, warranty, and risk transfer point (when the buyer bears risk of loss).</p>
<h3>Service contracts (hợp đồng dịch vụ)</h3>
<p>The provider performs work FOR a fee; risk centers on scope definition and acceptance — vague scope is the #1 cause of service disputes.</p>
<h3>Lease, construction, agency contracts</h3>
<p>Each carries a distinct risk profile: leases hinge on the return condition of the asset; construction contracts hinge on delay and defect liability (often with liquidated damages clauses); agency/distribution contracts hinge on territory, exclusivity, and termination compensation.</p>
<div class="callout"><span class="badge">Practical tip</span> Before drafting, first identify the contract TYPE — it points you straight at the 3-4 clauses that carry most of the real risk.</div>`,
    `<span class="eyebrow">CTM201c · Chương 3 · Bài 3.1</span>
<h2>Các loại hợp đồng thương mại thông dụng</h2>
<p>Phần lớn hợp đồng kinh doanh là biến thể của một số loại cốt lõi. Nhận diện đúng loại giúp biết ngay rủi ro và điều khoản nào quan trọng nhất.</p>
<pre><code>Loại hợp đồng            | Rủi ro chính              | Điều khoản cần chú ý
--------------------------|----------------------------|----------------------
Mua bán hàng hoá          | Chất lượng, giao hàng, quyền sở hữu | Kiểm tra &amp; nghiệm thu
Dịch vụ                   | Phình phạm vi, SLA          | Phạm vi &amp; tiêu chí nghiệm thu
Thuê tài sản               | Bảo trì, hiện trạng trả lại | Thời hạn &amp; gia hạn
Xây dựng / EPC             | Trễ tiến độ, lỗi, thay đổi  | Phạt vi phạm hợp đồng
Đại lý / Phân phối         | Vùng lãnh thổ, độc quyền    | Chấm dứt &amp; bồi thường
NDA / Bảo mật              | Rò rỉ thông tin             | Thời hạn &amp; ngoại lệ
</code></pre>
<h3>Hợp đồng mua bán hàng hoá</h3>
<p>Chịu sự điều chỉnh của Luật Thương mại 2005 khi cả hai bên hoạt động vì mục đích thương mại. Điều khoản cốt lõi: mô tả hàng hoá, số lượng/chất lượng, giá, thời gian &amp; địa điểm giao hàng, thanh toán, bảo hành, và mốc chuyển rủi ro (khi nào bên mua chịu rủi ro mất mát).</p>
<h3>Hợp đồng dịch vụ</h3>
<p>Bên cung cấp thực hiện công việc để nhận phí; rủi ro tập trung ở việc xác định phạm vi và nghiệm thu — phạm vi mơ hồ là nguyên nhân số một gây tranh chấp hợp đồng dịch vụ.</p>
<h3>Hợp đồng thuê, xây dựng, đại lý</h3>
<p>Mỗi loại có hồ sơ rủi ro riêng: hợp đồng thuê xoay quanh hiện trạng trả lại tài sản; hợp đồng xây dựng xoay quanh trách nhiệm trễ tiến độ và lỗi (thường kèm điều khoản phạt vi phạm); hợp đồng đại lý/phân phối xoay quanh vùng lãnh thổ, độc quyền, và bồi thường khi chấm dứt.</p>
<div class="callout"><span class="badge">Mẹo thực tế</span> Trước khi soạn thảo, hãy xác định LOẠI hợp đồng trước — nó chỉ thẳng đến 3-4 điều khoản mang phần lớn rủi ro thực sự.</div>`,
  ]]);

const c3q = quiz('ctm201c-quiz-3', 'Quiz 3 — Contract types|||Quiz 3 — Các loại hợp đồng', [
  { id: 'q1', question: 'Rủi ro chính của hợp đồng mua bán hàng hoá là gì?', options: ['Phình phạm vi công việc', 'Chất lượng, giao hàng, quyền sở hữu', 'Vùng lãnh thổ độc quyền', 'Thời hạn thuê tài sản'], correctIndex: 1, explanation: 'Mua bán hàng hoá tập trung vào chất lượng, thời điểm giao hàng và chuyển quyền sở hữu.' },
  { id: 'q2', question: 'Luật nào điều chỉnh hợp đồng mua bán hàng hoá giữa các thương nhân vì mục đích thương mại?', options: ['Luật Thương mại 2005', 'Luật Đầu tư', 'Luật Lao động', 'Luật Doanh nghiệp'], correctIndex: 0, explanation: 'Luật Thương mại 2005 điều chỉnh mua bán hàng hoá và dịch vụ thương mại.' },
  { id: 'q3', question: 'Nguyên nhân số một gây tranh chấp trong hợp đồng dịch vụ là gì?', options: ['Giá quá thấp', 'Phạm vi công việc mơ hồ, không rõ ràng', 'Hợp đồng quá dài', 'Không có chữ ký số'], correctIndex: 1, explanation: 'Phạm vi (scope) mơ hồ khiến hai bên hiểu khác nhau về việc cần làm — nguyên nhân hàng đầu gây tranh chấp dịch vụ.' },
]);

const c4 = doc('ctm201c-4-1-soan-thao-dam-phan', '4.1 — Drafting & negotiating contract clauses|||4.1 — Soạn thảo & đàm phán điều khoản hợp đồng',
  'Cấu trúc một hợp đồng, nguyên tắc soạn thảo rõ ràng đo lường được, kỹ năng đàm phán (BATNA, đánh đổi điều khoản), điều khoản mẫu.',
  [[
    `<span class="eyebrow">CTM201c · Chapter 4 · Lesson 4.1</span>
<h2>Drafting &amp; negotiating contract clauses</h2>
<h3>Anatomy of a contract</h3>
<pre><code>1. Preamble &amp; parties       (bên A/B, thông tin pháp lý)
2. Definitions               (thuật ngữ dùng xuyên suốt)
3. Subject matter &amp; scope    (đối tượng, phạm vi)
4. Price &amp; payment terms
5. Delivery / performance obligations
6. Warranty &amp; liability
7. Confidentiality
8. Force majeure
9. Term, termination &amp; renewal
10. Dispute resolution &amp; governing law
11. Signatures
</code></pre>
<h3>Drafting principles</h3>
<ul>
<li><strong>Clarity over cleverness</strong> — one sentence, one obligation, one responsible party.</li>
<li><strong>Define once, use consistently</strong> — capitalized defined terms avoid ambiguity.</li>
<li><strong>Make obligations measurable</strong> — dates, quantities, and acceptance criteria, not "reasonable efforts."</li>
</ul>
<h3>Negotiation essentials</h3>
<ul>
<li>Separate <strong>must-have</strong> terms from <strong>nice-to-have</strong> before entering the room.</li>
<li>Know your <strong>BATNA</strong> (Best Alternative To a Negotiated Agreement) — it sets your walk-away point.</li>
<li>Trade concessions across clauses, not within one — e.g. accept shorter payment terms for a higher liability cap.</li>
</ul>
<pre><code>Sample limitation-of-liability clause:
"Except for breaches of confidentiality or wilful misconduct,
 either Party's total liability under this Agreement shall not
 exceed the total fees paid in the twelve (12) months preceding
 the claim."
</code></pre>
<div class="callout"><span class="badge">Red-flag clauses</span> Unlimited liability, one-sided termination rights, and unilateral price-change clauses are the three most common items pushed back on in negotiation.</div>`,
    `<span class="eyebrow">CTM201c · Chương 4 · Bài 4.1</span>
<h2>Soạn thảo &amp; đàm phán điều khoản hợp đồng</h2>
<h3>Cấu trúc một hợp đồng</h3>
<pre><code>1. Phần mở đầu &amp; các bên     (bên A/B, thông tin pháp lý)
2. Định nghĩa                (thuật ngữ dùng xuyên suốt)
3. Đối tượng &amp; phạm vi
4. Giá &amp; điều khoản thanh toán
5. Nghĩa vụ giao hàng / thực hiện
6. Bảo hành &amp; trách nhiệm
7. Bảo mật
8. Bất khả kháng
9. Thời hạn, chấm dứt &amp; gia hạn
10. Giải quyết tranh chấp &amp; luật áp dụng
11. Chữ ký
</code></pre>
<h3>Nguyên tắc soạn thảo</h3>
<ul>
<li><strong>Rõ ràng hơn là khéo léo</strong> — một câu, một nghĩa vụ, một bên chịu trách nhiệm.</li>
<li><strong>Định nghĩa một lần, dùng nhất quán</strong> — thuật ngữ viết hoa được định nghĩa tránh mơ hồ.</li>
<li><strong>Làm nghĩa vụ đo lường được</strong> — ngày cụ thể, số lượng, tiêu chí nghiệm thu, không dùng "cố gắng hợp lý" mơ hồ.</li>
</ul>
<h3>Kỹ năng đàm phán cốt lõi</h3>
<ul>
<li>Tách <strong>điều khoản bắt buộc phải có</strong> khỏi <strong>điều khoản có thì tốt</strong> trước khi vào phòng đàm phán.</li>
<li>Biết <strong>BATNA</strong> của mình (Phương án thay thế tốt nhất nếu không đạt thoả thuận) — nó đặt điểm dừng của bạn.</li>
<li>Đánh đổi nhượng bộ giữa các điều khoản khác nhau, không đánh đổi trong cùng một điều khoản — vd chấp nhận thời hạn thanh toán ngắn hơn để đổi lấy trần trách nhiệm cao hơn.</li>
</ul>
<pre><code>Mẫu điều khoản hạn chế trách nhiệm:
"Trừ trường hợp vi phạm bảo mật hoặc lỗi cố ý,
 tổng trách nhiệm của mỗi Bên theo Hợp đồng này không
 vượt quá tổng phí đã thanh toán trong mười hai (12) tháng
 trước thời điểm khiếu nại."
</code></pre>
<div class="callout"><span class="badge">Điều khoản đáng cảnh giác</span> Trách nhiệm không giới hạn, quyền chấm dứt hợp đồng một chiều, và điều khoản đổi giá đơn phương là ba điểm bị phản đối nhiều nhất khi đàm phán.</div>`,
  ]]);

const c4q = quiz('ctm201c-quiz-4', 'Quiz 4 — Drafting & negotiation|||Quiz 4 — Soạn thảo & đàm phán', [
  { id: 'q1', question: 'Trong cấu trúc hợp đồng, điều khoản "Giải quyết tranh chấp & luật áp dụng" thường nằm ở đâu?', options: ['Đầu tiên, trước phần mở đầu', 'Ngay sau phần định nghĩa', 'Gần cuối, trước phần chữ ký', 'Không cần có trong hợp đồng'], correctIndex: 2, explanation: 'Điều khoản giải quyết tranh chấp &amp; luật áp dụng thường nằm gần cuối, ngay trước phần chữ ký.' },
  { id: 'q2', question: 'BATNA trong đàm phán hợp đồng nghĩa là gì?', options: ['Điều khoản bắt buộc phải có trong hợp đồng', 'Phương án thay thế tốt nhất nếu không đạt được thoả thuận', 'Một loại chữ ký điện tử', 'Mức giá tối thiểu của hàng hoá'], correctIndex: 1, explanation: 'BATNA = Best Alternative To a Negotiated Agreement, đặt điểm dừng khi đàm phán.' },
  { id: 'q3', question: 'Đâu là một ví dụ điều khoản "đáng cảnh giác" (red-flag) khi đàm phán?', options: ['Trần trách nhiệm bằng tổng phí 12 tháng gần nhất', 'Điều khoản định nghĩa thuật ngữ rõ ràng', 'Trách nhiệm không giới hạn cho một bên', 'Ngày giao hàng cụ thể, đo lường được'], correctIndex: 2, explanation: 'Trách nhiệm không giới hạn là một trong ba điều khoản bị phản đối nhiều nhất khi đàm phán.' },
]);

const c5 = doc('ctm201c-5-1-quan-ly-thuc-hien', '5.1 — Managing contract performance & compliance|||5.1 — Quản lý thực hiện hợp đồng & giám sát tuân thủ',
  'Theo dõi nghĩa vụ, giám sát SLA/KPI, nghiệm thu mốc, kiểm tra tuân thủ; vì sao giai đoạn sau ký gây thất thoát giá trị nhiều nhất.',
  [[
    `<span class="eyebrow">CTM201c · Chapter 5 · Lesson 5.1</span>
<h2>Managing contract performance &amp; compliance</h2>
<h3>From signature to delivery</h3>
<p>Once signed, the contract becomes an operational tool. <strong>Contract administration</strong> tracks obligations, deadlines, deliverables, and payments against what was actually agreed — not what people remember.</p>
<h3>Key monitoring activities</h3>
<ul>
<li><strong>Obligation tracking</strong> — extract every deliverable/deadline into a tracker (who owes what, by when).</li>
<li><strong>SLA / KPI monitoring</strong> — measure service levels against agreed thresholds; flag breaches early.</li>
<li><strong>Milestone &amp; acceptance sign-off</strong> — formally accept each deliverable before payment triggers.</li>
<li><strong>Compliance audits</strong> — periodic checks that both sides meet regulatory and contractual requirements.</li>
</ul>
<pre><code>Simple obligation tracker:
| Obligation            | Owner | Due date   | Status   | Evidence |
|------------------------|-------|------------|----------|----------|
| Deliver goods lot 1    | Seller| 2026-10-01 | On track | PO #1023 |
| Pay invoice #45        | Buyer | 2026-10-15 | Pending  | -        |
| Submit weekly report   | Vendor| Weekly     | Overdue  | -        |
</code></pre>
<h3>Why this phase matters most</h3>
<p>Studies by IACCM/WorldCC consistently find <strong>most contract value leakage happens post-signature</strong> — missed deadlines, unenforced SLAs, and un-tracked change requests quietly erode margin far more than a badly negotiated clause.</p>
<div class="callout"><span class="badge">Rule of thumb</span> If an obligation is not written down and assigned an owner and a date, it will not be performed on time.</div>`,
    `<span class="eyebrow">CTM201c · Chương 5 · Bài 5.1</span>
<h2>Quản lý thực hiện hợp đồng &amp; giám sát tuân thủ</h2>
<h3>Từ khi ký đến khi giao hàng</h3>
<p>Sau khi ký, hợp đồng trở thành công cụ vận hành. <strong>Quản trị hợp đồng</strong> theo dõi nghĩa vụ, hạn chót, sản phẩm bàn giao, và thanh toán so với những gì THỰC SỰ đã thoả thuận — không phải những gì mọi người nhớ.</p>
<h3>Các hoạt động giám sát chính</h3>
<ul>
<li><strong>Theo dõi nghĩa vụ</strong> — trích mọi sản phẩm bàn giao/hạn chót vào một bảng theo dõi (ai nợ gì, đến khi nào).</li>
<li><strong>Giám sát SLA / KPI</strong> — đo mức dịch vụ so với ngưỡng đã thoả thuận; cảnh báo sớm khi vi phạm.</li>
<li><strong>Nghiệm thu mốc bàn giao</strong> — chính thức nghiệm thu từng sản phẩm bàn giao trước khi kích hoạt thanh toán.</li>
<li><strong>Kiểm tra tuân thủ</strong> — kiểm tra định kỳ cả hai bên đáp ứng yêu cầu pháp lý và hợp đồng.</li>
</ul>
<pre><code>Bảng theo dõi nghĩa vụ đơn giản:
| Nghĩa vụ                | Chịu trách nhiệm | Hạn        | Trạng thái | Chứng cứ |
|--------------------------|------------------|------------|------------|----------|
| Giao lô hàng 1           | Bên bán          | 01/10/2026 | Đúng tiến độ | PO #1023 |
| Thanh toán hoá đơn #45   | Bên mua          | 15/10/2026 | Chưa đến hạn | -        |
| Nộp báo cáo hàng tuần    | Nhà thầu         | Hàng tuần  | Trễ hạn      | -        |
</code></pre>
<h3>Vì sao giai đoạn này quan trọng nhất</h3>
<p>Các nghiên cứu của IACCM/WorldCC luôn cho thấy <strong>phần lớn thất thoát giá trị hợp đồng xảy ra SAU khi ký</strong> — trễ hạn không bị phát hiện, SLA không được thực thi, và yêu cầu thay đổi không được theo dõi âm thầm ăn mòn lợi nhuận nhiều hơn cả một điều khoản đàm phán tồi.</p>
<div class="callout"><span class="badge">Quy tắc chung</span> Nếu một nghĩa vụ không được ghi lại và gán người chịu trách nhiệm cùng hạn cụ thể, nó sẽ không được thực hiện đúng hạn.</div>`,
  ]]);

const c5q = quiz('ctm201c-quiz-5', 'Quiz 5 — Performance & compliance|||Quiz 5 — Thực hiện & tuân thủ', [
  { id: 'q1', question: 'Mục đích chính của "theo dõi nghĩa vụ" (obligation tracking) là gì?', options: ['Trang trí hồ sơ hợp đồng cho đẹp', 'Biết rõ ai nợ gì, đến khi nào, để không bỏ sót nghĩa vụ', 'Thay thế hoàn toàn việc đàm phán', 'Chỉ áp dụng cho hợp đồng xây dựng'], correctIndex: 1, explanation: 'Theo dõi nghĩa vụ giúp biết ai chịu trách nhiệm việc gì và hạn nào, tránh bỏ sót.' },
  { id: 'q2', question: 'Theo các nghiên cứu IACCM/WorldCC, phần lớn thất thoát giá trị hợp đồng xảy ra ở đâu?', options: ['Trước khi ký (pre-award)', 'Ngay lúc ký kết', 'Sau khi ký (post-award), trong quá trình thực hiện', 'Chỉ xảy ra khi có tranh chấp ra toà'], correctIndex: 2, explanation: 'Phần lớn giá trị bị mất trong giai đoạn thực hiện sau ký, không phải lúc đàm phán hay ký.' },
  { id: 'q3', question: 'Nghiệm thu mốc bàn giao (milestone acceptance sign-off) nên diễn ra khi nào?', options: ['Sau khi đã thanh toán toàn bộ', 'Trước khi kích hoạt thanh toán cho sản phẩm bàn giao đó', 'Chỉ khi có tranh chấp', 'Không cần thiết nếu hai bên tin tưởng nhau'], correctIndex: 1, explanation: 'Nghiệm thu chính thức nên diễn ra trước khi thanh toán được kích hoạt, để bảo vệ cả hai bên.' },
]);

const c6 = doc('ctm201c-6-1-rui-ro-thay-doi-tranh-chap', '6.1 — Managing contract risk, change & disputes|||6.1 — Quản lý rủi ro, thay đổi & tranh chấp hợp đồng',
  'Các loại rủi ro hợp đồng, quy trình kiểm soát thay đổi, các cấp giải quyết tranh chấp (đàm phán, hoà giải, trọng tài, toà án).',
  [[
    `<span class="eyebrow">CTM201c · Chapter 6 · Lesson 6.1</span>
<h2>Managing contract risk, change &amp; disputes</h2>
<h3>Contract risk categories</h3>
<ul>
<li><strong>Performance risk</strong> — a party fails to deliver as agreed.</li>
<li><strong>Financial risk</strong> — non-payment, currency/price fluctuation.</li>
<li><strong>Legal/compliance risk</strong> — regulatory change, non-compliance penalties.</li>
<li><strong>Force majeure risk</strong> — events beyond control (natural disaster, war, pandemic) excusing non-performance.</li>
</ul>
<h3>Change management</h3>
<p>Most real contracts change after signing. A <strong>change control process</strong> prevents scope creep and disputes:</p>
<pre><code>Change request process:
 1) Submit Change Request (CR) in writing - describe &amp; justify
 2) Assess impact on scope, price, schedule
 3) Both parties approve in writing (signed amendment / phụ lục)
 4) Update the obligation tracker &amp; contract file
 -&gt; Never perform an unapproved change and hope to be paid for it later
</code></pre>
<h3>Dispute resolution ladder</h3>
<ul>
<li><strong>Negotiation</strong> — direct discussion, cheapest &amp; fastest.</li>
<li><strong>Mediation/Conciliation (hoà giải)</strong> — a neutral third party helps reach agreement; non-binding.</li>
<li><strong>Arbitration (trọng tài)</strong> — binding decision by an arbitral tribunal (e.g. VIAC); faster and more confidential than court, common in commercial contracts.</li>
<li><strong>Litigation (toà án)</strong> — public, binding, appealable; last resort.</li>
</ul>
<div class="callout"><span class="badge">Draft it in advance</span> The dispute-resolution clause is agreed while both sides are still friendly — it is far harder to negotiate fair terms after a dispute has already started.</div>`,
    `<span class="eyebrow">CTM201c · Chương 6 · Bài 6.1</span>
<h2>Quản lý rủi ro, thay đổi &amp; tranh chấp hợp đồng</h2>
<h3>Các loại rủi ro hợp đồng</h3>
<ul>
<li><strong>Rủi ro thực hiện</strong> — một bên không giao hàng/thực hiện như thoả thuận.</li>
<li><strong>Rủi ro tài chính</strong> — không thanh toán, biến động tỷ giá/giá cả.</li>
<li><strong>Rủi ro pháp lý/tuân thủ</strong> — thay đổi quy định, chế tài do không tuân thủ.</li>
<li><strong>Rủi ro bất khả kháng</strong> — sự kiện ngoài tầm kiểm soát (thiên tai, chiến tranh, đại dịch) miễn trừ việc không thực hiện được.</li>
</ul>
<h3>Quản lý thay đổi</h3>
<p>Hầu hết hợp đồng thực tế đều thay đổi sau khi ký. Một <strong>quy trình kiểm soát thay đổi</strong> ngăn phình phạm vi và tranh chấp:</p>
<pre><code>Quy trình yêu cầu thay đổi:
 1) Gửi Yêu cầu thay đổi (CR) bằng văn bản - mô tả &amp; lý do
 2) Đánh giá tác động đến phạm vi, giá, tiến độ
 3) Cả hai bên phê duyệt bằng văn bản (phụ lục hợp đồng có ký)
 4) Cập nhật bảng theo dõi nghĩa vụ &amp; hồ sơ hợp đồng
 -&gt; Không bao giờ thực hiện thay đổi chưa được phê duyệt rồi hy vọng được trả tiền sau
</code></pre>
<h3>Các cấp giải quyết tranh chấp</h3>
<ul>
<li><strong>Đàm phán</strong> — trao đổi trực tiếp, rẻ &amp; nhanh nhất.</li>
<li><strong>Hoà giải</strong> — bên thứ ba trung gian giúp đạt thoả thuận; không ràng buộc.</li>
<li><strong>Trọng tài</strong> — quyết định ràng buộc bởi hội đồng trọng tài (vd VIAC); nhanh và bảo mật hơn toà án, phổ biến trong hợp đồng thương mại.</li>
<li><strong>Toà án</strong> — công khai, ràng buộc, có thể kháng cáo; giải pháp cuối cùng.</li>
</ul>
<div class="callout"><span class="badge">Soạn trước, ký trước</span> Điều khoản giải quyết tranh chấp nên được thoả thuận khi hai bên còn thiện chí — sẽ khó hơn rất nhiều để đàm phán điều khoản công bằng sau khi tranh chấp đã xảy ra.</div>`,
  ]]);

const c6q = quiz('ctm201c-quiz-6', 'Quiz 6 — Risk, change & disputes|||Quiz 6 — Rủi ro, thay đổi & tranh chấp', [
  { id: 'q1', question: '"Bất khả kháng" (force majeure) trong hợp đồng dùng để chỉ điều gì?', options: ['Lỗi cố ý của một bên', 'Sự kiện ngoài tầm kiểm soát (thiên tai, chiến tranh, đại dịch) miễn trừ việc không thực hiện được', 'Việc một bên đơn phương đổi giá', 'Việc chậm thanh toán do quên chuyển tiền'], correctIndex: 1, explanation: 'Bất khả kháng là sự kiện ngoài tầm kiểm soát của các bên, dùng để miễn trừ nghĩa vụ.' },
  { id: 'q2', question: 'Bước ĐẦU TIÊN đúng trong quy trình kiểm soát thay đổi (change control) là gì?', options: ['Thực hiện thay đổi ngay rồi báo sau', 'Gửi Yêu cầu thay đổi (CR) bằng văn bản, mô tả & lý do', 'Cập nhật bảng theo dõi nghĩa vụ trước tiên', 'Khởi kiện ra toà án'], correctIndex: 1, explanation: 'Quy trình bắt đầu bằng việc gửi CR bằng văn bản, trước khi đánh giá tác động và phê duyệt.' },
  { id: 'q3', question: 'Điểm khác biệt chính giữa hoà giải (mediation) và trọng tài (arbitration) là gì?', options: ['Hoà giải luôn tốn kém hơn trọng tài', 'Kết quả hoà giải không ràng buộc, kết quả trọng tài có tính ràng buộc', 'Trọng tài chỉ áp dụng cho hợp đồng lao động', 'Hai phương thức hoàn toàn giống nhau'], correctIndex: 1, explanation: 'Hoà giải là thoả thuận không ràng buộc; trọng tài đưa ra quyết định ràng buộc như bản án.' },
]);

const c7 = doc('ctm201c-7-1-ket-thuc-thanh-ly', '7.1 — Contract closeout, liquidation & evaluation|||7.1 — Kết thúc hợp đồng, thanh lý & đánh giá',
  'Các cách hợp đồng kết thúc, checklist thanh lý hợp đồng, biên bản thanh lý, đánh giá sau hợp đồng phục vụ lựa chọn đối tác lần sau.',
  [[
    `<span class="eyebrow">CTM201c · Chapter 7 · Lesson 7.1</span>
<h2>Contract closeout, liquidation &amp; evaluation</h2>
<h3>Ways a contract ends</h3>
<ul>
<li><strong>Full performance</strong> — both sides completed their obligations (the normal, healthy ending).</li>
<li><strong>Expiry</strong> — the agreed term lapses without renewal.</li>
<li><strong>Termination</strong> — ended early, for cause (breach) or convenience (as allowed by the contract).</li>
<li><strong>Mutual liquidation (thanh lý hợp đồng)</strong> — both parties formally confirm obligations are settled and release each other.</li>
</ul>
<h3>Closeout checklist</h3>
<pre><code>Contract closeout checklist:
 [ ] All deliverables accepted &amp; documented
 [ ] All invoices issued and payments settled
 [ ] Liquidation minutes (biên bản thanh lý) signed by both parties
 [ ] Warranty/post-contract obligations identified and tracked
 [ ] Confidential materials returned or destroyed per clause
 [ ] Lessons learned logged for future contracts
 [ ] Contract file archived (retention period per policy/law)
</code></pre>
<h3>Post-contract evaluation</h3>
<p>A short vendor/performance review — on time? on budget? quality issues? relationship health? — feeds directly into the next negotiation and into a scorecard for future supplier selection.</p>
<div class="callout"><span class="badge">Don't skip it</span> An unsigned liquidation record leaves both sides exposed to later claims — closeout is a legal step, not paperwork housekeeping.</div>`,
    `<span class="eyebrow">CTM201c · Chương 7 · Bài 7.1</span>
<h2>Kết thúc hợp đồng, thanh lý &amp; đánh giá</h2>
<h3>Các cách hợp đồng kết thúc</h3>
<ul>
<li><strong>Hoàn thành đầy đủ nghĩa vụ</strong> — cả hai bên đã thực hiện xong nghĩa vụ (kết thúc bình thường, lành mạnh).</li>
<li><strong>Hết thời hạn</strong> — thời hạn thoả thuận hết mà không gia hạn.</li>
<li><strong>Chấm dứt trước hạn</strong> — kết thúc sớm, do vi phạm hoặc theo quyền chấm dứt được hợp đồng cho phép.</li>
<li><strong>Thanh lý hợp đồng</strong> — cả hai bên chính thức xác nhận nghĩa vụ đã được giải quyết và miễn trách cho nhau.</li>
</ul>
<h3>Checklist kết thúc hợp đồng</h3>
<pre><code>Checklist kết thúc hợp đồng:
 [ ] Mọi sản phẩm bàn giao đã được nghiệm thu &amp; ghi hồ sơ
 [ ] Mọi hoá đơn đã xuất và thanh toán đã hoàn tất
 [ ] Biên bản thanh lý đã được cả hai bên ký
 [ ] Nghĩa vụ bảo hành/sau hợp đồng đã xác định &amp; theo dõi
 [ ] Tài liệu bảo mật đã trả lại hoặc tiêu huỷ theo điều khoản
 [ ] Bài học kinh nghiệm đã được ghi lại cho hợp đồng sau
 [ ] Hồ sơ hợp đồng đã lưu trữ (đúng thời hạn lưu theo chính sách/luật)
</code></pre>
<h3>Đánh giá sau hợp đồng</h3>
<p>Một đợt đánh giá ngắn về nhà cung cấp/hiệu suất — đúng hạn? đúng ngân sách? có vấn đề chất lượng? quan hệ hai bên ra sao? — đưa trực tiếp vào lần đàm phán tiếp theo và vào thang điểm cho việc lựa chọn nhà cung cấp về sau.</p>
<div class="callout"><span class="badge">Đừng bỏ qua</span> Một biên bản thanh lý chưa ký khiến cả hai bên vẫn phơi trước rủi ro khiếu nại về sau — kết thúc hợp đồng là bước pháp lý, không phải việc dọn hồ sơ.</div>`,
  ]]);

const c7q = quiz('ctm201c-quiz-7', 'Quiz 7 — Closeout & evaluation|||Quiz 7 — Kết thúc & đánh giá', [
  { id: 'q1', question: '"Thanh lý hợp đồng" nghĩa là gì?', options: ['Bán tài sản của một bên để trả nợ', 'Hai bên chính thức xác nhận nghĩa vụ đã giải quyết xong và miễn trách cho nhau', 'Chấm dứt hợp đồng ngay khi có vi phạm nhỏ', 'Gia hạn hợp đồng thêm một kỳ nữa'], correctIndex: 1, explanation: 'Thanh lý hợp đồng là bước xác nhận chính thức nghĩa vụ đã hoàn tất và miễn trách cho nhau.' },
  { id: 'q2', question: 'Mục nào SAU đây thuộc checklist kết thúc hợp đồng?', options: ['Xoá toàn bộ hợp đồng khỏi hệ thống ngay lập tức', 'Biên bản thanh lý được cả hai bên ký', 'Không cần nghiệm thu vì hợp đồng đã hết hạn', 'Bỏ qua nghĩa vụ bảo hành sau hợp đồng'], correctIndex: 1, explanation: 'Biên bản thanh lý có ký của cả hai bên là một mục bắt buộc trong checklist kết thúc.' },
  { id: 'q3', question: 'Mục đích của đánh giá sau hợp đồng (post-contract evaluation) là gì?', options: ['Chỉ để lưu trữ, không dùng cho việc gì khác', 'Cung cấp dữ liệu cho lần đàm phán tiếp theo và thang điểm chọn nhà cung cấp về sau', 'Thay thế hoàn toàn việc nghiệm thu trong hợp đồng', 'Chỉ thực hiện khi có tranh chấp'], correctIndex: 1, explanation: 'Đánh giá sau hợp đồng nuôi dữ liệu cho các quyết định thương mại và lựa chọn nhà cung cấp sau này.' },
]);

const c8 = doc('ctm201c-8-1-so-hoa-clm', '8.1 — Contract digitalization: CLM, e-contracts & e-signatures|||8.1 — Số hoá quản lý hợp đồng: CLM, e-contract & chữ ký số',
  'Phần mềm CLM, giá trị pháp lý hợp đồng điện tử theo luật VN, chữ ký số vs chữ ký điện tử đơn giản, giới hạn thực tiễn (giao dịch buộc phải công chứng).',
  [[
    `<span class="eyebrow">CTM201c · Chapter 8 · Lesson 8.1</span>
<h2>Contract digitalization: CLM, e-contracts &amp; e-signatures</h2>
<h3>Contract Lifecycle Management (CLM) software</h3>
<p>A <strong>CLM system</strong> centralizes contract creation (clause library, templates), approval workflow, e-signature, obligation tracking, and a searchable repository — replacing scattered Word files and email threads.</p>
<pre><code>CLM value chain:
 Template/clause library -&gt; Automated draft -&gt; Approval workflow
   -&gt; e-Signature -&gt; Central repository -&gt; Obligation &amp; renewal alerts
</code></pre>
<h3>Electronic contracts under Vietnamese law</h3>
<p>The Law on Electronic Transactions recognizes a <strong>data message</strong> (electronic contract) as having the same legal validity as a paper document, provided its content can be reliably stored and retrieved. This underpins the e-contracts and e-signatures used in Vietnamese business today.</p>
<h3>Electronic signatures</h3>
<ul>
<li><strong>Simple e-signature</strong> — a scanned signature or a click-to-accept; weak evidentiary value.</li>
<li><strong>Digital signature (chữ ký số)</strong> — cryptographically bound to a certificate issued by a licensed provider; the strongest form, legally equivalent to a handwritten signature/seal for most transactions.</li>
</ul>
<h3>Benefits &amp; practical limits</h3>
<p>Digitalization speeds up cycle time and reduces lost/expired contracts, but a few transaction types (e.g. real estate transfer, some notarized transactions) still require the traditional paper form and notarization by law — check the required form BEFORE choosing an e-contract flow.</p>
<div class="callout"><span class="badge">Where the industry is going</span> Modern CLM increasingly adds AI clause review and risk flagging — but it augments, not replaces, the legal judgment covered in Chapters 2 and 4.</div>`,
    `<span class="eyebrow">CTM201c · Chương 8 · Bài 8.1</span>
<h2>Số hoá quản lý hợp đồng: CLM, e-contract &amp; chữ ký số</h2>
<h3>Phần mềm quản lý vòng đời hợp đồng (CLM)</h3>
<p>Một <strong>hệ thống CLM</strong> tập trung hoá việc tạo hợp đồng (thư viện điều khoản, mẫu), quy trình phê duyệt, chữ ký điện tử, theo dõi nghĩa vụ, và kho lưu trữ có thể tra cứu — thay thế cho các file Word rời rạc và chuỗi email.</p>
<pre><code>Chuỗi giá trị CLM:
 Thư viện mẫu/điều khoản -&gt; Soạn tự động -&gt; Quy trình phê duyệt
   -&gt; Chữ ký điện tử -&gt; Kho lưu trữ trung tâm -&gt; Cảnh báo nghĩa vụ &amp; gia hạn
</code></pre>
<h3>Hợp đồng điện tử theo pháp luật Việt Nam</h3>
<p>Luật Giao dịch điện tử công nhận <strong>thông điệp dữ liệu</strong> (hợp đồng điện tử) có giá trị pháp lý tương đương văn bản giấy, miễn nội dung có thể lưu trữ và truy xuất một cách đáng tin cậy. Đây là cơ sở cho hợp đồng điện tử &amp; chữ ký điện tử đang dùng trong kinh doanh tại Việt Nam hiện nay.</p>
<h3>Chữ ký điện tử</h3>
<ul>
<li><strong>Chữ ký điện tử đơn giản</strong> — chữ ký quét hoặc nhấn nút chấp nhận; giá trị chứng cứ yếu.</li>
<li><strong>Chữ ký số</strong> — gắn với chứng thư số do tổ chức được cấp phép cung cấp bằng mật mã; hình thức mạnh nhất, có giá trị pháp lý tương đương chữ ký tay/dấu trong hầu hết giao dịch.</li>
</ul>
<h3>Lợi ích &amp; giới hạn thực tiễn</h3>
<p>Số hoá giúp rút ngắn thời gian xử lý và giảm thất lạc/hết hạn hợp đồng, nhưng một số loại giao dịch (vd chuyển nhượng bất động sản, một số giao dịch phải công chứng) vẫn buộc phải theo hình thức văn bản giấy truyền thống và công chứng theo luật — kiểm tra hình thức bắt buộc TRƯỚC khi chọn quy trình hợp đồng điện tử.</p>
<div class="callout"><span class="badge">Xu hướng ngành</span> CLM hiện đại ngày càng bổ sung rà soát điều khoản bằng AI và cảnh báo rủi ro — nhưng đó là công cụ hỗ trợ, không thay thế xét đoán pháp lý đã học ở Chương 2 và 4.</div>`,
  ]]);

const c8q = quiz('ctm201c-quiz-8', 'Quiz 8 — Digitalization|||Quiz 8 — Số hoá quản lý hợp đồng', [
  { id: 'q1', question: 'Một hệ thống CLM (Contract Lifecycle Management) chủ yếu làm gì?', options: ['Chỉ lưu file PDF hợp đồng, không làm gì khác', 'Tập trung hoá tạo hợp đồng, quy trình phê duyệt, chữ ký điện tử, theo dõi nghĩa vụ và kho lưu trữ tra cứu được', 'Thay thế hoàn toàn vai trò của luật sư', 'Chỉ dùng để gửi email nhắc thanh toán'], correctIndex: 1, explanation: 'CLM tập trung hoá toàn bộ vòng đời hợp đồng: soạn, phê duyệt, ký, theo dõi, lưu trữ.' },
  { id: 'q2', question: 'So với chữ ký điện tử đơn giản, chữ ký số (digital signature) khác biệt ở điểm nào?', options: ['Chữ ký số chỉ là ảnh quét chữ ký tay', 'Chữ ký số gắn với chứng thư số do tổ chức được cấp phép cung cấp, giá trị pháp lý mạnh hơn', 'Hai loại có giá trị pháp lý hoàn toàn giống nhau trong mọi trường hợp', 'Chữ ký số chỉ dùng được cho hợp đồng lao động'], correctIndex: 1, explanation: 'Chữ ký số dùng chứng thư số cấp phép, là hình thức mạnh nhất, còn chữ ký điện tử đơn giản có giá trị chứng cứ yếu hơn.' },
  { id: 'q3', question: 'Loại giao dịch nào vẫn buộc phải theo hình thức văn bản giấy/công chứng dù đã số hoá?', options: ['Mọi hợp đồng dịch vụ nhỏ', 'Một số giao dịch như chuyển nhượng bất động sản, giao dịch buộc công chứng theo luật', 'Hợp đồng mua bán hàng hoá giá trị thấp', 'Không có giao dịch nào bị hạn chế'], correctIndex: 1, explanation: 'Một số giao dịch như chuyển nhượng bất động sản vẫn buộc theo hình thức giấy &amp; công chứng theo luật.' },
]);

export default {
  semester: { code: 'FPTU_Hola5', name: 'Kỳ 5', ordinal: 7 },
  course: {
    courseCode: 'CTM201c',
    slug: 'ctm201c-contract-management',
    title: 'Contract Management',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/CTM201c.webp',
    shortDescription: 'How contracts are formed & managed under VN law - formation & validity, common contract types, drafting & negotiation, performance monitoring, risk/change/dispute, closeout, and CLM/e-contract digitalization. Bilingual, with templates & quizzes.|||Hợp đồng giao kết & quản lý theo luật VN ra sao - giao kết, hiệu lực, các loại hợp đồng, soạn thảo & đàm phán, giám sát thực hiện, rủi ro/thay đổi/tranh chấp, thanh lý, và số hoá CLM/e-contract. Song ngữ, có mẫu điều khoản & quiz.',
    description: 'Môn <strong>CTM201c — Contract Management</strong> (kỳ 5) dạy cách <strong>hợp đồng được giao kết, điều chỉnh &amp; quản lý</strong> trong thực tế kinh doanh. Từ <strong>tổng quan hợp đồng &amp; quản lý hợp đồng</strong> → <strong>pháp luật hợp đồng cơ bản</strong> (Bộ luật Dân sự 2015, Luật Thương mại 2005) → <strong>các loại hợp đồng thương mại</strong> → <strong>soạn thảo &amp; đàm phán</strong> → <strong>quản lý thực hiện &amp; tuân thủ</strong> → <strong>rủi ro, thay đổi &amp; tranh chấp</strong> → <strong>kết thúc &amp; thanh lý</strong> → <strong>số hoá quản lý hợp đồng</strong> (CLM, e-contract, chữ ký số). Bám giáo trình FLM (gốc Cummins/IACCM, NCMA CMBOK), song ngữ, có mẫu điều khoản/checklist/quy trình và quiz mỗi chương.',
    whatYouLearn: 'Định nghĩa &amp; yếu tố hợp đồng, ba giai đoạn quản lý hợp đồng (pre-award/award/post-award); điều kiện giao kết &amp; hiệu lực (Điều 117 BLDS), vô hiệu vs có thể bị vô hiệu; các loại hợp đồng thương mại (mua bán hàng hoá, dịch vụ, thuê, xây dựng, đại lý, NDA); cấu trúc &amp; nguyên tắc soạn thảo, kỹ năng đàm phán (BATNA); theo dõi nghĩa vụ, giám sát SLA/KPI, nghiệm thu; quản lý rủi ro, quy trình kiểm soát thay đổi, các cấp giải quyết tranh chấp (đàm phán/hoà giải/trọng tài/toà án); checklist thanh lý hợp đồng; CLM, hợp đồng điện tử &amp; chữ ký số theo luật VN.',
    requirements: 'Không yêu cầu kiến thức pháp lý trước đó. Nên đọc trước khung chương trình khối Quản trị Kinh doanh trên FLM để nắm vị trí môn trong lộ trình.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Khung kiến thức IACCM/WorldCC, NCMA CMBOK, pháp luật VN, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Hợp đồng là gì, vòng đời hợp đồng, vì sao quản lý hợp đồng quan trọng.', lessons: [intro] },
    { title: 'Chương 1 — Tổng quan hợp đồng & quản lý hợp đồng|||Chapter 1 — Overview of contracts & CM', description: 'Định nghĩa, yếu tố cấu thành, ba giai đoạn quản lý hợp đồng.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Pháp luật hợp đồng cơ bản|||Chapter 2 — Contract law basics', description: 'Giao kết, hiệu lực, Bộ luật Dân sự 2015, Luật Thương mại 2005.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Các loại hợp đồng thương mại thông dụng|||Chapter 3 — Common contract types', description: 'Mua bán hàng hoá, dịch vụ, thuê, xây dựng, đại lý, NDA.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Soạn thảo & đàm phán điều khoản|||Chapter 4 — Drafting & negotiation', description: 'Cấu trúc hợp đồng, nguyên tắc soạn thảo, BATNA, điều khoản mẫu.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Quản lý thực hiện & tuân thủ|||Chapter 5 — Performance & compliance', description: 'Theo dõi nghĩa vụ, SLA/KPI, nghiệm thu, kiểm tra tuân thủ.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Rủi ro, thay đổi & tranh chấp|||Chapter 6 — Risk, change & disputes', description: 'Loại rủi ro, kiểm soát thay đổi, các cấp giải quyết tranh chấp.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Kết thúc, thanh lý & đánh giá|||Chapter 7 — Closeout & evaluation', description: 'Cách kết thúc hợp đồng, checklist thanh lý, đánh giá sau hợp đồng.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Số hoá quản lý hợp đồng|||Chapter 8 — Contract digitalization', description: 'CLM, hợp đồng điện tử, chữ ký số, giới hạn thực tiễn.', lessons: [c8, c8q] },
  ],
};
