/**
 * CME501 — Microeconomics (taught in Chinese). Ngành Ngôn ngữ Trung, Kỳ 7.
 * Kinh tế vi mô, nhấn thuật ngữ kinh tế tiếng Trung (汉字 + pinyin có dấu thanh).
 * Giáo trình tham khảo (trích dẫn, không upload PDF): "微观经济学" (高鸿业) và
 * Pindyck & Rubinfeld "Microeconomics". 8 chương. Song ngữ EN/VN (khối .ml-en/.ml-vi).
 * Giữ NGUYÊN slug/semester/thumb(v3). ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const intro = doc('cme501-0-1-overview', 'Course overview: Microeconomics in Chinese|||Tổng quan: Kinh tế vi mô bằng tiếng Trung',
  'Kinh tế vi mô là gì, khác kinh tế vĩ mô ra sao, vì sao học bằng tiếng Trung, giáo trình & lộ trình 8 chương.',
  [[
    `<span class="eyebrow">CME501 · Lesson 0.1 · Overview</span>
<h2>Microeconomics — taught in Chinese</h2>
<p class="lead">This course teaches <strong>microeconomics</strong> — <strong>微观经济学 (wēiguān jīngjìxué)</strong> — how individual households and firms make choices under <strong>scarcity (稀缺性, xīquēxìng)</strong>, and how those choices interact in a <strong>market (市场, shìchǎng)</strong>. Because the class is delivered in Chinese, every core concept here is tagged with its Chinese term (汉字) and pinyin, so you build economics knowledge and Chinese vocabulary together.</p>
<h3>Micro vs. macro</h3>
<ul>
<li><strong>微观经济学 (wēiguān jīngjìxué)</strong> — microeconomics: individual consumers, firms, single markets, prices.</li>
<li><strong>宏观经济学 (hóngguān jīngjìxué)</strong> — macroeconomics (the sister course CEM501): the whole economy — GDP, inflation, unemployment.</li>
</ul>
<h3>Roadmap — 8 chapters</h3>
<table>
<tr><th>#</th><th>Chapter</th><th>Key Chinese term</th></tr>
<tr><td>1</td><td>Introduction &amp; markets</td><td>市场经济 shìchǎng jīngjì</td></tr>
<tr><td>2</td><td>Supply, demand &amp; equilibrium price</td><td>供给与需求 gōngjǐ yǔ xūqiú</td></tr>
<tr><td>3</td><td>Elasticity</td><td>弹性 tánxìng</td></tr>
<tr><td>4</td><td>Consumer behavior theory</td><td>消费者行为 xiāofèizhě xíngwéi</td></tr>
<tr><td>5</td><td>Production &amp; cost theory</td><td>生产与成本 shēngchǎn yǔ chéngběn</td></tr>
<tr><td>6</td><td>Perfect competition &amp; monopoly</td><td>完全竞争与垄断 wánquán jìngzhēng yǔ lǒngduàn</td></tr>
<tr><td>7</td><td>Factor markets &amp; income distribution</td><td>生产要素市场 shēngchǎn yàosù shìchǎng</td></tr>
<tr><td>8</td><td>Market failure, externalities &amp; glossary review</td><td>市场失灵 shìchǎng shīlíng</td></tr>
</table>
<div class="callout"><span class="badge">How to study</span> Learn every term as a triple: <strong>汉字 (characters) — pinyin — meaning</strong>. Say the pinyin out loud, then explain the concept in your own words — reciting characters without understanding the economics won't survive an exam question.</div>`,
    `<span class="eyebrow">CME501 · Bài 0.1 · Tổng quan</span>
<h2>Kinh tế vi mô — giảng bằng tiếng Trung</h2>
<p class="lead">Môn này dạy <strong>kinh tế vi mô</strong> — <strong>微观经济学 (wēiguān jīngjìxué)</strong> — cách các hộ gia đình và doanh nghiệp riêng lẻ ra quyết định trong điều kiện <strong>khan hiếm (稀缺性, xīquēxìng)</strong>, và các quyết định đó tương tác với nhau như thế nào trên <strong>thị trường (市场, shìchǎng)</strong>. Vì lớp học bằng tiếng Trung, mọi khái niệm cốt lõi ở đây đều gắn kèm chữ Hán (汉字) và pinyin, để bạn xây dựng kiến thức kinh tế và vốn từ tiếng Trung song song.</p>
<h3>Vi mô vs. vĩ mô</h3>
<ul>
<li><strong>微观经济学 (wēiguān jīngjìxué)</strong> — kinh tế vi mô: người tiêu dùng, doanh nghiệp riêng lẻ, từng thị trường, giá cả.</li>
<li><strong>宏观经济学 (hóngguān jīngjìxué)</strong> — kinh tế vĩ mô (môn chị em CEM501): toàn bộ nền kinh tế — GDP, lạm phát, thất nghiệp.</li>
</ul>
<h3>Lộ trình — 8 chương</h3>
<table>
<tr><th>#</th><th>Chương</th><th>Thuật ngữ Trung then chốt</th></tr>
<tr><td>1</td><td>Nhập môn &amp; thị trường</td><td>市场经济 shìchǎng jīngjì</td></tr>
<tr><td>2</td><td>Cung, cầu &amp; giá cân bằng</td><td>供给与需求 gōngjǐ yǔ xūqiú</td></tr>
<tr><td>3</td><td>Độ co giãn</td><td>弹性 tánxìng</td></tr>
<tr><td>4</td><td>Lý thuyết hành vi người tiêu dùng</td><td>消费者行为 xiāofèizhě xíngwéi</td></tr>
<tr><td>5</td><td>Lý thuyết sản xuất &amp; chi phí</td><td>生产与成本 shēngchǎn yǔ chéngběn</td></tr>
<tr><td>6</td><td>Cạnh tranh hoàn hảo &amp; độc quyền</td><td>完全竞争与垄断 wánquán jìngzhēng yǔ lǒngduàn</td></tr>
<tr><td>7</td><td>Thị trường yếu tố sản xuất &amp; phân phối thu nhập</td><td>生产要素市场 shēngchǎn yàosù shìchǎng</td></tr>
<tr><td>8</td><td>Thất bại thị trường, ngoại ứng &amp; ôn tập thuật ngữ</td><td>市场失灵 shìchǎng shīlíng</td></tr>
</table>
<div class="callout"><span class="badge">Cách học</span> Học mỗi thuật ngữ theo bộ ba: <strong>汉字 (chữ Hán) — pinyin — nghĩa</strong>. Đọc to pinyin, rồi tự giải thích khái niệm bằng lời của mình — thuộc mặt chữ mà không hiểu bản chất kinh tế thì không trả lời nổi câu hỏi ứng dụng trong đề thi.</div>`,
  ]]);

const taiLieu = doc('cme501-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình tiếng Trung & tiếng Anh (trích dẫn), tài liệu chính thức miễn phí, YouTube, công cụ tra từ, lộ trình tự học.',
  [[
    `<span class="eyebrow">CME501 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn microeconomics with Chinese terminology — supply &amp; demand, elasticity, consumer &amp; producer theory, market structures — in one place.</p>
<h3>📘 Reference textbooks (cited, not uploaded)</h3>
<ul>
<li><em>《微观经济学》</em> (Wēiguān Jīngjìxué) — 高鸿业 (Gāo Hóngyè), the standard Chinese-language microeconomics textbook used across mainland Chinese universities.</li>
<li><em>Microeconomics</em> — Pindyck &amp; Rubinfeld, the standard English-language reference for the same concepts, useful for cross-checking definitions.</li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://www.khanacademy.org/economics-finance-domain/microeconomics" target="_blank" rel="noopener">Khan Academy — Microeconomics</a> — free video course, English, matches this syllabus chapter by chapter.</li>
<li><a href="https://openstax.org/details/books/principles-microeconomics-3e" target="_blank" rel="noopener">OpenStax — Principles of Microeconomics</a> — free open textbook (English).</li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@economicsexplained" target="_blank" rel="noopener">Economics Explained</a> — intuitive explanations of core micro concepts.</li>
<li><a href="https://www.youtube.com/@jacobclifford" target="_blank" rel="noopener">Jacob Clifford (ACDC Econ)</a> — supply/demand, elasticity, market structure walkthroughs.</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://www.mdbg.net/chinese/dictionary" target="_blank" rel="noopener">MDBG Chinese Dictionary</a> — look up any 汉字 term instantly, with pinyin and stroke order.</li>
<li><a href="https://www.pleco.com/" target="_blank" rel="noopener">Pleco</a> — mobile Chinese dictionary app, good for flashcards on economics vocabulary.</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation</strong> — scarcity, opportunity cost, the PPF, and the market as a coordinating mechanism.</li>
<li><strong>Core toolkit</strong> — supply/demand curves, equilibrium, elasticity: the workhorse diagrams for every later chapter.</li>
<li><strong>Two sides of the market</strong> — consumer theory (utility, indifference curves) and producer theory (production, cost).</li>
<li><strong>Market structures &amp; policy</strong> — perfect competition vs. monopoly, factor markets, market failure and externalities.</li>
</ol></div>`,
    `<span class="eyebrow">CME501 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học kinh tế vi mô kèm thuật ngữ tiếng Trung — cung cầu, độ co giãn, lý thuyết người tiêu dùng &amp; nhà sản xuất, cấu trúc thị trường — gom về một chỗ.</p>
<h3>📘 Giáo trình tham khảo (trích dẫn, không upload)</h3>
<ul>
<li><em>《微观经济学》</em> (Wēiguān Jīngjìxué) — 高鸿业 (Gāo Hóngyè), giáo trình kinh tế vi mô tiếng Trung chuẩn, dùng phổ biến ở các trường đại học Trung Quốc.</li>
<li><em>Microeconomics</em> — Pindyck &amp; Rubinfeld, tài liệu tham khảo tiếng Anh chuẩn cho cùng nội dung, hữu ích để đối chiếu định nghĩa.</li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://www.khanacademy.org/economics-finance-domain/microeconomics" target="_blank" rel="noopener">Khan Academy — Microeconomics</a> — khoá video miễn phí, tiếng Anh, bám sát từng chương của đề cương này.</li>
<li><a href="https://openstax.org/details/books/principles-microeconomics-3e" target="_blank" rel="noopener">OpenStax — Principles of Microeconomics</a> — sách mở miễn phí (tiếng Anh).</li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@economicsexplained" target="_blank" rel="noopener">Economics Explained</a> — giải thích trực quan các khái niệm vi mô cốt lõi.</li>
<li><a href="https://www.youtube.com/@jacobclifford" target="_blank" rel="noopener">Jacob Clifford (ACDC Econ)</a> — cung cầu, độ co giãn, cấu trúc thị trường.</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://www.mdbg.net/chinese/dictionary" target="_blank" rel="noopener">MDBG Chinese Dictionary</a> — tra bất kỳ thuật ngữ 汉字 nào ngay lập tức, kèm pinyin và thứ tự nét.</li>
<li><a href="https://www.pleco.com/" target="_blank" rel="noopener">Pleco</a> — app từ điển Trung trên điện thoại, tiện làm flashcard từ vựng kinh tế.</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền tảng</strong> — khan hiếm, chi phí cơ hội, đường PPF, và thị trường như một cơ chế điều phối.</li>
<li><strong>Bộ công cụ lõi</strong> — đường cung/cầu, cân bằng, độ co giãn: đồ thị chủ lực cho mọi chương sau.</li>
<li><strong>Hai phía thị trường</strong> — lý thuyết người tiêu dùng (hữu dụng, đường bàng quan) và lý thuyết nhà sản xuất (sản xuất, chi phí).</li>
<li><strong>Cấu trúc thị trường &amp; chính sách</strong> — cạnh tranh hoàn hảo vs. độc quyền, thị trường yếu tố sản xuất, thất bại thị trường và ngoại ứng.</li>
</ol></div>`,
  ]]);

const c1 = doc('cme501-1-1-intro-market', '1.1 — Introduction to microeconomics & markets|||1.1 — Nhập môn kinh tế vi mô & thị trường',
  'Khan hiếm (稀缺性), chi phí cơ hội (机会成本), đường giới hạn khả năng sản xuất (PPF), thị trường & bàn tay vô hình.',
  [[
    `<span class="eyebrow">CME501 · Chapter 1 · Lesson 1.1</span>
<h2>Introduction to microeconomics &amp; markets</h2>
<h3>Scarcity — the starting point of all economics</h3>
<p><strong>稀缺性 (xīquēxìng)</strong> — scarcity — means resources (labor, land, capital) are limited while human wants are unlimited. Because of scarcity, every choice has an <strong>机会成本 (jīhuì chéngběn)</strong> — opportunity cost: the value of the next-best alternative you give up.</p>
<h3>The production possibility frontier</h3>
<p><strong>生产可能性边界 (shēngchǎn kěnéngxìng biānjiè)</strong> — the PPF — shows the maximum combinations of two goods an economy can produce with fixed resources and technology. Points inside the curve are inefficient; points outside are currently unattainable; the curve's bow-out shape reflects the <strong>increasing opportunity cost</strong> as you shift resources between goods.</p>
<pre><code>PPF — moving along the curve:
 More of good A  -->  give up some of good B
 Slope of the PPF = opportunity cost of A in terms of B
 Outward shift of the whole curve = economic growth
</code></pre>
<h3>The market &amp; the "invisible hand"</h3>
<p>A <strong>market (市场, shìchǎng)</strong> is any arrangement that brings buyers and sellers together to exchange goods, services or resources. In a <strong>market economy (市场经济, shìchǎng jīngjì)</strong>, prices coordinate millions of independent decisions without central planning — Adam Smith's <strong>看不见的手 (kànbújiàn de shǒu)</strong>, "the invisible hand."</p>
<div class="callout"><span class="badge">Key vocabulary</span> 稀缺性 xīquēxìng (scarcity) · 机会成本 jīhuì chéngběn (opportunity cost) · 生产可能性边界 shēngchǎn kěnéngxìng biānjiè (PPF) · 市场 shìchǎng (market) · 市场经济 shìchǎng jīngjì (market economy).</div>`,
    `<span class="eyebrow">CME501 · Chương 1 · Bài 1.1</span>
<h2>Nhập môn kinh tế vi mô &amp; thị trường</h2>
<h3>Khan hiếm — điểm xuất phát của mọi bài toán kinh tế</h3>
<p><strong>稀缺性 (xīquēxìng)</strong> — khan hiếm — nghĩa là nguồn lực (lao động, đất đai, vốn) có hạn trong khi nhu cầu con người là vô hạn. Vì khan hiếm, mọi lựa chọn đều có <strong>机会成本 (jīhuì chéngběn)</strong> — chi phí cơ hội: giá trị của phương án tốt nhất tiếp theo mà bạn từ bỏ.</p>
<h3>Đường giới hạn khả năng sản xuất</h3>
<p><strong>生产可能性边界 (shēngchǎn kěnéngxìng biānjiè)</strong> — đường PPF — thể hiện các tổ hợp tối đa của hai loại hàng hoá mà một nền kinh tế có thể sản xuất với nguồn lực và công nghệ cố định. Điểm nằm trong đường là chưa hiệu quả; điểm nằm ngoài đường là chưa thể đạt được với nguồn lực hiện có; hình dạng lồi ra ngoài phản ánh <strong>chi phí cơ hội tăng dần</strong> khi bạn chuyển nguồn lực giữa hai hàng hoá.</p>
<pre><code>PPF — di chuyển dọc đường cong:
 Sản xuất thêm hàng A  -->  phải từ bỏ một phần hàng B
 Độ dốc của PPF = chi phí cơ hội của A tính theo B
 Cả đường cong dịch ra ngoài = tăng trưởng kinh tế
</code></pre>
<h3>Thị trường & "bàn tay vô hình"</h3>
<p>Một <strong>thị trường (市场, shìchǎng)</strong> là bất kỳ cơ chế nào đưa người mua và người bán lại với nhau để trao đổi hàng hoá, dịch vụ hoặc nguồn lực. Trong <strong>nền kinh tế thị trường (市场经济, shìchǎng jīngjì)</strong>, giá cả điều phối hàng triệu quyết định độc lập mà không cần kế hoạch tập trung — "bàn tay vô hình" (看不见的手, kànbújiàn de shǒu) của Adam Smith.</p>
<div class="callout"><span class="badge">Từ vựng chính</span> 稀缺性 xīquēxìng (khan hiếm) · 机会成本 jīhuì chéngběn (chi phí cơ hội) · 生产可能性边界 shēngchǎn kěnéngxìng biānjiè (đường PPF) · 市场 shìchǎng (thị trường) · 市场经济 shìchǎng jīngjì (kinh tế thị trường).</div>`,
  ]]);

const c1q = quiz('cme501-quiz-1', 'Quiz 1 — Introduction & markets|||Quiz 1 — Nhập môn & thị trường', [
  { id: 'q1', question: 'Chi phí cơ hội (机会成本, jīhuì chéngběn) là gì?', options: ['Tổng chi phí bằng tiền để sản xuất', 'Giá trị phương án tốt nhất bị từ bỏ khi chọn một lựa chọn khác', 'Lợi nhuận thu được sau khi bán hàng', 'Chi phí cố định không đổi theo sản lượng'], correctIndex: 1, explanation: '机会成本 là giá trị của lựa chọn tốt nhất tiếp theo mà bạn phải từ bỏ.' },
  { id: 'q2', question: 'Điểm nằm BÊN TRONG đường PPF (生产可能性边界) thể hiện điều gì?', options: ['Không thể đạt được với nguồn lực hiện có', 'Sản xuất chưa hiệu quả, còn nguồn lực chưa dùng hết', 'Tăng trưởng kinh tế', 'Cân bằng thị trường'], correctIndex: 1, explanation: 'Điểm trong đường PPF là chưa tận dụng hết nguồn lực → chưa hiệu quả.' },
  { id: 'q3', question: '"Bàn tay vô hình" (看不见的手) của Adam Smith mô tả điều gì?', options: ['Chính phủ can thiệp trực tiếp vào giá cả', 'Giá cả tự điều phối hàng triệu quyết định mà không cần kế hoạch tập trung', 'Doanh nghiệp độc quyền thao túng thị trường', 'Ngân hàng trung ương ấn định lãi suất'], correctIndex: 1, explanation: 'Bàn tay vô hình: cơ chế giá tự phối hợp cung-cầu trong kinh tế thị trường.' },
]);

const c2 = doc('cme501-2-1-supply-demand', '2.1 — Supply, demand & equilibrium price|||2.1 — Cung, cầu & giá cân bằng',
  'Quy luật cầu & cung (需求定律/供给定律), đường cầu & cung, giá cân bằng (均衡价格), thiếu hụt & dư thừa.',
  [[
    `<span class="eyebrow">CME501 · Chapter 2 · Lesson 2.1</span>
<h2>Supply, demand &amp; equilibrium price</h2>
<h3>Demand</h3>
<p><strong>需求 (xūqiú)</strong> — demand — is the quantity of a good buyers are willing and able to buy at each price. The <strong>law of demand (需求定律, xūqiú dìnglǜ)</strong>: as price rises, quantity demanded falls (all else equal) — the demand curve slopes downward.</p>
<h3>Supply</h3>
<p><strong>供给 (gōngjǐ)</strong> — supply — is the quantity sellers are willing and able to sell at each price. The <strong>law of supply (供给定律, gōngjǐ dìnglǜ)</strong>: as price rises, quantity supplied rises — the supply curve slopes upward.</p>
<h3>Equilibrium</h3>
<p>Where the two curves cross is the <strong>equilibrium price (均衡价格, jūnhéng jiàgé)</strong> and <strong>equilibrium quantity (均衡数量, jūnhéng shùliàng)</strong> — the only price at which quantity demanded equals quantity supplied, so the market "clears."</p>
<pre><code>Price above equilibrium -> Qs &gt; Qd -> 过剩 (guòshèng) surplus -> price pressured DOWN
Price below equilibrium -> Qd &gt; Qs -> 短缺 (duǎnquē) shortage -> price pressured UP
</code></pre>
<div class="callout"><span class="badge">Shift vs. movement</span> A price change causes <em>movement along</em> a curve. A change in income, tastes, input costs or expectations <em>shifts the whole curve</em> — always ask which one you're describing.</div>`,
    `<span class="eyebrow">CME501 · Chương 2 · Bài 2.1</span>
<h2>Cung, cầu & giá cân bằng</h2>
<h3>Cầu</h3>
<p><strong>需求 (xūqiú)</strong> — cầu — là lượng hàng hoá mà người mua sẵn lòng và có khả năng mua ở mỗi mức giá. <strong>Quy luật cầu (需求定律, xūqiú dìnglǜ)</strong>: giá tăng thì lượng cầu giảm (các yếu tố khác không đổi) — đường cầu dốc xuống.</p>
<h3>Cung</h3>
<p><strong>供给 (gōngjǐ)</strong> — cung — là lượng hàng hoá mà người bán sẵn lòng và có khả năng bán ở mỗi mức giá. <strong>Quy luật cung (供给定律, gōngjǐ dìnglǜ)</strong>: giá tăng thì lượng cung tăng — đường cung dốc lên.</p>
<h3>Cân bằng</h3>
<p>Nơi hai đường cắt nhau là <strong>giá cân bằng (均衡价格, jūnhéng jiàgé)</strong> và <strong>sản lượng cân bằng (均衡数量, jūnhéng shùliàng)</strong> — mức giá duy nhất mà tại đó lượng cầu bằng lượng cung, thị trường "cân bằng".</p>
<pre><code>Giá trên mức cân bằng -> Qs &gt; Qd -> 过剩 (guòshèng) dư thừa -> giá bị ép GIẢM
Giá dưới mức cân bằng -> Qd &gt; Qs -> 短缺 (duǎnquē) thiếu hụt -> giá bị ép TĂNG
</code></pre>
<div class="callout"><span class="badge">Dịch chuyển vs. di chuyển</span> Thay đổi giá gây <em>di chuyển dọc</em> một đường. Thay đổi thu nhập, thị hiếu, chi phí đầu vào hay kỳ vọng làm <em>dịch chuyển cả đường</em> — luôn hỏi bạn đang mô tả loại nào.</div>`,
  ]]);

const c2q = quiz('cme501-quiz-2', 'Quiz 2 — Supply & demand|||Quiz 2 — Cung & cầu', [
  { id: 'q1', question: 'Quy luật cầu (需求定律, xūqiú dìnglǜ) phát biểu điều gì?', options: ['Giá tăng thì lượng cầu tăng', 'Giá tăng thì lượng cầu giảm (các yếu tố khác không đổi)', 'Giá không ảnh hưởng tới lượng cầu', 'Lượng cầu chỉ phụ thuộc thu nhập'], correctIndex: 1, explanation: 'Quy luật cầu: giá và lượng cầu quan hệ nghịch biến.' },
  { id: 'q2', question: 'Tại giá cao hơn giá cân bằng (均衡价格), điều gì xảy ra?', options: ['Xuất hiện thiếu hụt (短缺)', 'Xuất hiện dư thừa (过剩), Qs &gt; Qd', 'Thị trường vẫn cân bằng', 'Đường cầu dịch chuyển'], correctIndex: 1, explanation: 'Giá cao hơn cân bằng → cung vượt cầu → dư thừa (过剩), tạo áp lực giảm giá.' },
  { id: 'q3', question: 'Thu nhập người tiêu dùng tăng (hàng hoá thông thường) sẽ làm gì?', options: ['Di chuyển dọc đường cầu hiện tại', 'Dịch chuyển toàn bộ đường cầu sang phải', 'Dịch chuyển đường cung sang trái', 'Không ảnh hưởng gì tới thị trường'], correctIndex: 1, explanation: 'Thay đổi thu nhập là yếu tố ngoài giá → dịch chuyển cả đường cầu (需求), không phải di chuyển dọc đường.' },
]);

const c3 = doc('cme501-3-1-elasticity', '3.1 — Elasticity|||3.1 — Độ co giãn',
  'Độ co giãn giá của cầu (需求价格弹性), của cung, độ co giãn theo thu nhập & chéo; co giãn nhiều/ít (富有/缺乏弹性).',
  [[
    `<span class="eyebrow">CME501 · Chapter 3 · Lesson 3.1</span>
<h2>Elasticity</h2>
<h3>Price elasticity of demand</h3>
<p><strong>价格弹性 (jiàgé tánxìng)</strong> — price elasticity — measures how responsive quantity is to a price change. The most-used one is <strong>需求价格弹性 (xūqiú jiàgé tánxìng)</strong> — price elasticity of demand:</p>
<pre><code>Ed = (%ΔQuantity demanded) / (%ΔPrice)

|Ed| &gt; 1  -&gt;  富有弹性 (fùyǒu tánxìng)  — elastic (luxury goods, many substitutes)
|Ed| &lt; 1  -&gt;  缺乏弹性 (quēfá tánxìng)  — inelastic (necessities, few substitutes)
|Ed| = 1  -&gt;  单位弹性 (dānwèi tánxìng) — unit elastic
</code></pre>
<h3>Other elasticities</h3>
<ul>
<li><strong>供给价格弹性 (gōngjǐ jiàgé tánxìng)</strong> — price elasticity of supply: how responsive quantity supplied is to price.</li>
<li><strong>收入弹性 (shōurù tánxìng)</strong> — income elasticity of demand: positive for normal goods, negative for inferior goods.</li>
<li><strong>交叉价格弹性 (jiāochā jiàgé tánxìng)</strong> — cross-price elasticity: positive for substitutes, negative for complements.</li>
</ul>
<div class="callout"><span class="badge">Why it matters for business</span> A firm facing elastic demand should NOT raise price (revenue falls); a firm facing inelastic demand CAN raise price (revenue rises). Elasticity, not cost alone, drives pricing strategy.</div>`,
    `<span class="eyebrow">CME501 · Chương 3 · Bài 3.1</span>
<h2>Độ co giãn</h2>
<h3>Độ co giãn giá của cầu</h3>
<p><strong>价格弹性 (jiàgé tánxìng)</strong> — độ co giãn giá — đo mức độ phản ứng của lượng khi giá thay đổi. Loại dùng nhiều nhất là <strong>需求价格弹性 (xūqiú jiàgé tánxìng)</strong> — độ co giãn giá của cầu:</p>
<pre><code>Ed = (%Δ Lượng cầu) / (%Δ Giá)

|Ed| &gt; 1  -&gt;  富有弹性 (fùyǒu tánxìng)  — co giãn nhiều (hàng xa xỉ, nhiều hàng thay thế)
|Ed| &lt; 1  -&gt;  缺乏弹性 (quēfá tánxìng)  — co giãn ít (hàng thiết yếu, ít hàng thay thế)
|Ed| = 1  -&gt;  单位弹性 (dānwèi tánxìng) — co giãn đơn vị
</code></pre>
<h3>Các loại co giãn khác</h3>
<ul>
<li><strong>供给价格弹性 (gōngjǐ jiàgé tánxìng)</strong> — độ co giãn giá của cung: lượng cung phản ứng thế nào khi giá thay đổi.</li>
<li><strong>收入弹性 (shōurù tánxìng)</strong> — độ co giãn theo thu nhập của cầu: dương với hàng thông thường, âm với hàng thứ cấp.</li>
<li><strong>交叉价格弹性 (jiāochā jiàgé tánxìng)</strong> — độ co giãn chéo: dương với hàng thay thế, âm với hàng bổ sung.</li>
</ul>
<div class="callout"><span class="badge">Vì sao quan trọng với kinh doanh</span> Doanh nghiệp đối diện cầu co giãn nhiều KHÔNG nên tăng giá (doanh thu giảm); doanh nghiệp đối diện cầu co giãn ít CÓ THỂ tăng giá (doanh thu tăng). Độ co giãn, chứ không chỉ chi phí, dẫn dắt chiến lược định giá.</div>`,
  ]]);

const c3q = quiz('cme501-quiz-3', 'Quiz 3 — Elasticity|||Quiz 3 — Độ co giãn', [
  { id: 'q1', question: 'Nếu |Ed| &gt; 1 (富有弹性, fùyǒu tánxìng), cầu được gọi là?', options: ['Co giãn ít (inelastic)', 'Co giãn nhiều (elastic)', 'Co giãn đơn vị', 'Không co giãn'], correctIndex: 1, explanation: '|Ed| &gt; 1 nghĩa là lượng cầu phản ứng mạnh hơn phần trăm thay đổi giá → co giãn nhiều.' },
  { id: 'q2', question: 'Doanh nghiệp có cầu co giãn NHIỀU (富有弹性) nên làm gì để tăng doanh thu?', options: ['Tăng giá', 'Giảm giá', 'Giữ nguyên giá và sản lượng', 'Không liên quan tới giá'], correctIndex: 1, explanation: 'Cầu co giãn nhiều: giảm giá làm lượng bán tăng mạnh hơn tỉ lệ giảm giá → doanh thu tăng.' },
  { id: 'q3', question: '交叉价格弹性 (jiāochā jiàgé tánxìng) dương cho biết hai hàng hoá là?', options: ['Hàng bổ sung (complements)', 'Hàng thay thế (substitutes)', 'Hàng thứ cấp (inferior)', 'Hàng xa xỉ (luxury)'], correctIndex: 1, explanation: 'Co giãn chéo dương: giá hàng A tăng làm cầu hàng B tăng → hai hàng là thay thế cho nhau.' },
]);

const c4 = doc('cme501-4-1-consumer-theory', '4.1 — Consumer behavior theory|||4.1 — Lý thuyết hành vi người tiêu dùng',
  'Hữu dụng (效用), hữu dụng biên & quy luật giảm dần, đường bàng quan, đường ngân sách, điểm cân bằng người tiêu dùng.',
  [[
    `<span class="eyebrow">CME501 · Chapter 4 · Lesson 4.1</span>
<h2>Consumer behavior theory</h2>
<h3>Utility &amp; marginal utility</h3>
<p><strong>效用 (xiàoyòng)</strong> — utility — is the satisfaction a consumer gets from consuming a good. <strong>边际效用 (biānjì xiàoyòng)</strong> — marginal utility — is the extra satisfaction from one more unit. The <strong>边际效用递减规律 (biānjì xiàoyòng dìjiǎn guīlǜ)</strong> — law of diminishing marginal utility — says MU falls as consumption increases (the 1st slice of pizza feels better than the 5th).</p>
<h3>Indifference curves &amp; the budget line</h3>
<p>An <strong>无差异曲线 (wúchāyì qūxiàn)</strong> — indifference curve — shows all combinations of two goods that give the same total utility. The <strong>预算约束线 (yùsuàn yuēshù xiàn)</strong> — budget constraint line — shows all combinations affordable at a given income and prices.</p>
<h3>Consumer equilibrium</h3>
<p><strong>消费者均衡 (xiāofèizhě jūnhéng)</strong> — consumer equilibrium — is where the budget line is tangent to the highest reachable indifference curve: the consumer gets the most utility for their money when the last dollar spent on each good yields equal marginal utility per dollar.</p>
<pre><code>Consumer equilibrium condition:
 MUx / Px = MUy / Py
 (marginal utility per dollar is equal across all goods purchased)
</code></pre>
<div class="callout"><span class="badge">Key vocabulary</span> 效用 xiàoyòng (utility) · 边际效用 biānjì xiàoyòng (marginal utility) · 无差异曲线 wúchāyì qūxiàn (indifference curve) · 预算约束线 yùsuàn yuēshù xiàn (budget line) · 消费者均衡 xiāofèizhě jūnhéng (consumer equilibrium).</div>`,
    `<span class="eyebrow">CME501 · Chương 4 · Bài 4.1</span>
<h2>Lý thuyết hành vi người tiêu dùng</h2>
<h3>Hữu dụng & hữu dụng biên</h3>
<p><strong>效用 (xiàoyòng)</strong> — hữu dụng — là mức thoả mãn người tiêu dùng nhận được khi tiêu dùng một hàng hoá. <strong>边际效用 (biānjì xiàoyòng)</strong> — hữu dụng biên — là phần thoả mãn tăng thêm từ một đơn vị tiêu dùng thêm. <strong>Quy luật hữu dụng biên giảm dần (边际效用递减规律, biānjì xiàoyòng dìjiǎn guīlǜ)</strong>: MU giảm khi tiêu dùng tăng (lát pizza đầu ngon hơn lát thứ năm).</p>
<h3>Đường bàng quan & đường ngân sách</h3>
<p>Một <strong>无差异曲线 (wúchāyì qūxiàn)</strong> — đường bàng quan — thể hiện mọi tổ hợp của hai hàng hoá đem lại cùng mức hữu dụng. <strong>预算约束线 (yùsuàn yuēshù xiàn)</strong> — đường ngân sách — thể hiện mọi tổ hợp mà người tiêu dùng có thể mua được với thu nhập và giá cả cho trước.</p>
<h3>Điểm cân bằng người tiêu dùng</h3>
<p><strong>消费者均衡 (xiāofèizhě jūnhéng)</strong> — cân bằng người tiêu dùng — là điểm đường ngân sách tiếp xúc với đường bàng quan cao nhất có thể đạt: người tiêu dùng đạt hữu dụng tối đa khi đồng tiền cuối cùng chi cho mỗi hàng hoá đem lại hữu dụng biên trên mỗi đồng bằng nhau.</p>
<pre><code>Điều kiện cân bằng người tiêu dùng:
 MUx / Px = MUy / Py
 (hữu dụng biên trên mỗi đồng bằng nhau giữa các hàng hoá đã mua)
</code></pre>
<div class="callout"><span class="badge">Từ vựng chính</span> 效用 xiàoyòng (hữu dụng) · 边际效用 biānjì xiàoyòng (hữu dụng biên) · 无差异曲线 wúchāyì qūxiàn (đường bàng quan) · 预算约束线 yùsuàn yuēshù xiàn (đường ngân sách) · 消费者均衡 xiāofèizhě jūnhéng (cân bằng người tiêu dùng).</div>`,
  ]]);

const c4q = quiz('cme501-quiz-4', 'Quiz 4 — Consumer theory|||Quiz 4 — Lý thuyết người tiêu dùng', [
  { id: 'q1', question: 'Quy luật hữu dụng biên giảm dần (边际效用递减规律) nói gì?', options: ['Hữu dụng biên tăng khi tiêu dùng thêm', 'Hữu dụng biên giảm dần khi tiêu dùng thêm đơn vị', 'Tổng hữu dụng luôn giảm', 'Giá hàng hoá luôn giảm theo thời gian'], correctIndex: 1, explanation: 'MU (边际效用) giảm dần khi số lượng tiêu dùng tăng, dù tổng hữu dụng có thể vẫn tăng.' },
  { id: 'q2', question: 'Đường bàng quan (无差异曲线, wúchāyì qūxiàn) thể hiện điều gì?', options: ['Các tổ hợp hàng hoá có cùng mức hữu dụng', 'Các tổ hợp hàng hoá có thể mua với thu nhập cho trước', 'Mối quan hệ giữa giá và lượng cầu', 'Chi phí sản xuất của doanh nghiệp'], correctIndex: 0, explanation: 'Đường bàng quan gồm các điểm (tổ hợp 2 hàng hoá) mang lại cùng tổng hữu dụng cho người tiêu dùng.' },
  { id: 'q3', question: 'Điều kiện cân bằng người tiêu dùng (消费者均衡) là gì?', options: ['MUx = MUy', 'Px = Py', 'MUx/Px = MUy/Py', 'Thu nhập chia đều cho hai hàng hoá'], correctIndex: 2, explanation: 'Cân bằng khi hữu dụng biên trên mỗi đồng chi tiêu bằng nhau giữa các hàng hoá: MUx/Px = MUy/Py.' },
]);

const c5 = doc('cme501-5-1-production-cost', '5.1 — Production & cost theory|||5.1 — Lý thuyết sản xuất & chi phí',
  'Hàm sản xuất (生产函数), sản phẩm biên & quy luật hiệu suất giảm dần, chi phí cố định/biến đổi, chi phí biên & bình quân.',
  [[
    `<span class="eyebrow">CME501 · Chapter 5 · Lesson 5.1</span>
<h2>Production &amp; cost theory</h2>
<h3>Production function &amp; marginal product</h3>
<p>A <strong>生产函数 (shēngchǎn hánshù)</strong> — production function — shows the maximum output from given inputs (labor, capital). <strong>边际产量 (biānjì chǎnliàng)</strong> — marginal product — is the extra output from one more unit of an input. The <strong>边际报酬递减规律 (biānjì bàochóu dìjiǎn guīlǜ)</strong> — law of diminishing marginal returns — says that as you add more of one input while holding others fixed, its marginal product eventually falls.</p>
<h3>Cost categories</h3>
<ul>
<li><strong>固定成本 (gùdìng chéngběn)</strong> — fixed cost: does not change with output (rent, fixed loan interest).</li>
<li><strong>可变成本 (kěbiàn chéngběn)</strong> — variable cost: changes with output (raw materials, hourly labor).</li>
<li><strong>边际成本 (biānjì chéngběn)</strong> — marginal cost (MC): the extra cost of producing one more unit.</li>
<li><strong>平均成本 (píngjūn chéngběn)</strong> — average cost (AC): total cost divided by quantity.</li>
</ul>
<pre><code>Short run:  TC = FC + VC          (固定成本 + 可变成本)
            MC = ΔTC / ΔQ         (边际成本)
            AC = TC / Q           (平均成本)
Long run:  all inputs variable -> 规模经济 (guīmó jīngjì) economies of scale possible
</code></pre>
<div class="callout"><span class="badge">Why MC matters most</span> A profit-maximizing firm decides output unit-by-unit by comparing marginal cost to marginal revenue — not by looking at average cost. This rule reappears in every market-structure chapter that follows.</div>`,
    `<span class="eyebrow">CME501 · Chương 5 · Bài 5.1</span>
<h2>Lý thuyết sản xuất & chi phí</h2>
<h3>Hàm sản xuất & sản phẩm biên</h3>
<p>Một <strong>生产函数 (shēngchǎn hánshù)</strong> — hàm sản xuất — thể hiện sản lượng tối đa từ các yếu tố đầu vào cho trước (lao động, vốn). <strong>边际产量 (biānjì chǎnliàng)</strong> — sản phẩm biên — là sản lượng tăng thêm từ một đơn vị đầu vào tăng thêm. <strong>Quy luật hiệu suất biên giảm dần (边际报酬递减规律, biānjì bàochóu dìjiǎn guīlǜ)</strong>: khi tăng thêm một yếu tố đầu vào trong khi giữ nguyên các yếu tố khác, sản phẩm biên của nó cuối cùng sẽ giảm.</p>
<h3>Các loại chi phí</h3>
<ul>
<li><strong>固定成本 (gùdìng chéngběn)</strong> — chi phí cố định: không đổi theo sản lượng (tiền thuê mặt bằng, lãi vay cố định).</li>
<li><strong>可变成本 (kěbiàn chéngběn)</strong> — chi phí biến đổi: thay đổi theo sản lượng (nguyên vật liệu, lương theo giờ).</li>
<li><strong>边际成本 (biānjì chéngběn)</strong> — chi phí biên (MC): chi phí tăng thêm để sản xuất một đơn vị nữa.</li>
<li><strong>平均成本 (píngjūn chéngběn)</strong> — chi phí bình quân (AC): tổng chi phí chia cho sản lượng.</li>
</ul>
<pre><code>Ngắn hạn:  TC = FC + VC          (固定成本 + 可变成本)
           MC = ΔTC / ΔQ         (边际成本)
           AC = TC / Q           (平均成本)
Dài hạn:  mọi đầu vào đều biến đổi -> có thể có 规模经济 (guīmó jīngjì) hiệu suất kinh tế theo quy mô
</code></pre>
<div class="callout"><span class="badge">Vì sao MC quan trọng nhất</span> Doanh nghiệp tối đa hoá lợi nhuận quyết định sản lượng từng đơn vị bằng cách so sánh chi phí biên với doanh thu biên — chứ không nhìn vào chi phí bình quân. Quy tắc này xuất hiện lại ở mọi chương cấu trúc thị trường tiếp theo.</div>`,
  ]]);

const c5q = quiz('cme501-quiz-5', 'Quiz 5 — Production & cost|||Quiz 5 — Sản xuất & chi phí', [
  { id: 'q1', question: 'Quy luật hiệu suất biên giảm dần (边际报酬递减规律) áp dụng khi nào?', options: ['Khi mọi đầu vào đều tăng cùng tỉ lệ', 'Khi tăng một đầu vào, giữ nguyên các đầu vào khác', 'Chỉ trong dài hạn', 'Chỉ khi giá đầu vào tăng'], correctIndex: 1, explanation: 'Quy luật này áp dụng trong ngắn hạn khi ít nhất một yếu tố đầu vào cố định.' },
  { id: 'q2', question: '固定成本 (gùdìng chéngběn) là loại chi phí nào?', options: ['Thay đổi theo sản lượng', 'Không đổi theo sản lượng', 'Chỉ xuất hiện trong dài hạn', 'Bằng chi phí biên'], correctIndex: 1, explanation: 'Chi phí cố định (固定成本) không phụ thuộc vào mức sản lượng, ví dụ tiền thuê mặt bằng.' },
  { id: 'q3', question: 'Chi phí biên (边际成本, biānjì chéngběn) là gì?', options: ['Tổng chi phí chia sản lượng', 'Chi phí tăng thêm khi sản xuất thêm một đơn vị', 'Chi phí cố định trên mỗi đơn vị', 'Doanh thu trừ lợi nhuận'], correctIndex: 1, explanation: 'MC = ΔTC/ΔQ — chi phí tăng thêm để làm ra một đơn vị sản phẩm nữa.' },
]);

const c6 = doc('cme501-6-1-competition-monopoly', '6.1 — Perfect competition & monopoly|||6.1 — Cạnh tranh hoàn hảo & độc quyền',
  'Thị trường cạnh tranh hoàn hảo (完全竞争), độc quyền (垄断), cạnh tranh độc quyền, dừng đầu, quy tắc MR=MC.',
  [[
    `<span class="eyebrow">CME501 · Chapter 6 · Lesson 6.1</span>
<h2>Perfect competition &amp; monopoly</h2>
<h3>Perfect competition</h3>
<p>A <strong>完全竞争市场 (wánquán jìngzhēng shìchǎng)</strong> — perfectly competitive market — has many small sellers, an identical product, free entry/exit and full information. No single firm can influence price — each is a "price taker."</p>
<h3>Monopoly</h3>
<p><strong>垄断 (lǒngduàn)</strong> — monopoly — is the opposite extreme: a single seller with no close substitutes and high barriers to entry, so the firm is a "price maker" facing the entire market demand curve.</p>
<h3>In-between structures</h3>
<ul>
<li><strong>垄断竞争 (lǒngduàn jìngzhēng)</strong> — monopolistic competition: many sellers, slightly differentiated products (restaurants, clothing brands).</li>
<li><strong>寡头垄断 (guǎtóu lǒngduàn)</strong> — oligopoly: a few large sellers who react strategically to each other (airlines, telecom).</li>
</ul>
<h3>The universal profit-maximizing rule</h3>
<pre><code>Every firm, in every market structure, maximizes profit where:
 边际收益 (biānjì shōuyì) MR  =  边际成本 (biānjì chéngběn) MC

 Perfect competition: P = MR = MC (price taker)
 Monopoly:            MR &lt; P, produce where MR = MC, then price off the demand curve
</code></pre>
<div class="callout"><span class="badge">Key vocabulary</span> 完全竞争市场 wánquán jìngzhēng shìchǎng (perfect competition) · 垄断 lǒngduàn (monopoly) · 垄断竞争 lǒngduàn jìngzhēng (monopolistic competition) · 寡头垄断 guǎtóu lǒngduàn (oligopoly) · 边际收益 biānjì shōuyì (marginal revenue).</div>`,
    `<span class="eyebrow">CME501 · Chương 6 · Bài 6.1</span>
<h2>Cạnh tranh hoàn hảo & độc quyền</h2>
<h3>Cạnh tranh hoàn hảo</h3>
<p>Một <strong>完全竞争市场 (wánquán jìngzhēng shìchǎng)</strong> — thị trường cạnh tranh hoàn hảo — có rất nhiều người bán nhỏ, sản phẩm đồng nhất, tự do gia nhập/rút lui và thông tin đầy đủ. Không doanh nghiệp nào ảnh hưởng được tới giá — mỗi doanh nghiệp là "người chấp nhận giá".</p>
<h3>Độc quyền</h3>
<p><strong>垄断 (lǒngduàn)</strong> — độc quyền — là thái cực ngược lại: chỉ một người bán duy nhất, không có hàng thay thế gần gũi và rào cản gia nhập cao, nên doanh nghiệp là "người định giá" đối diện toàn bộ đường cầu thị trường.</p>
<h3>Các cấu trúc trung gian</h3>
<ul>
<li><strong>垄断竞争 (lǒngduàn jìngzhēng)</strong> — cạnh tranh độc quyền: nhiều người bán, sản phẩm khác biệt hoá nhẹ (nhà hàng, thương hiệu thời trang).</li>
<li><strong>寡头垄断 (guǎtóu lǒngduàn)</strong> — độc quyền nhóm (oligopoly): vài doanh nghiệp lớn phản ứng chiến lược lẫn nhau (hàng không, viễn thông).</li>
</ul>
<h3>Quy tắc tối đa hoá lợi nhuận phổ quát</h3>
<pre><code>Mọi doanh nghiệp, ở mọi cấu trúc thị trường, tối đa hoá lợi nhuận tại:
 边际收益 (biānjì shōuyì) MR  =  边际成本 (biānjì chéngběn) MC

 Cạnh tranh hoàn hảo: P = MR = MC (người chấp nhận giá)
 Độc quyền:           MR &lt; P, sản xuất tại MR = MC, rồi định giá theo đường cầu
</code></pre>
<div class="callout"><span class="badge">Từ vựng chính</span> 完全竞争市场 wánquán jìngzhēng shìchǎng (cạnh tranh hoàn hảo) · 垄断 lǒngduàn (độc quyền) · 垄断竞争 lǒngduàn jìngzhēng (cạnh tranh độc quyền) · 寡头垄断 guǎtóu lǒngduàn (độc quyền nhóm) · 边际收益 biānjì shōuyì (doanh thu biên).</div>`,
  ]]);

const c6q = quiz('cme501-quiz-6', 'Quiz 6 — Market structures|||Quiz 6 — Cấu trúc thị trường', [
  { id: 'q1', question: 'Trong thị trường cạnh tranh hoàn hảo (完全竞争市场), doanh nghiệp là?', options: ['Người định giá (price maker)', 'Người chấp nhận giá (price taker)', 'Người độc quyền', 'Không tham gia thị trường'], correctIndex: 1, explanation: 'Nhiều người bán nhỏ, sản phẩm đồng nhất → không ai ảnh hưởng được giá → price taker.' },
  { id: 'q2', question: '寡头垄断 (guǎtóu lǒngduàn) mô tả cấu trúc thị trường nào?', options: ['Rất nhiều người bán nhỏ', 'Một người bán duy nhất', 'Vài doanh nghiệp lớn phản ứng chiến lược lẫn nhau', 'Sản phẩm hoàn toàn đồng nhất, tự do gia nhập'], correctIndex: 2, explanation: 'Oligopoly (寡头垄断): số ít doanh nghiệp lớn, quyết định của một hãng ảnh hưởng tới các hãng còn lại.' },
  { id: 'q3', question: 'Quy tắc tối đa hoá lợi nhuận chung cho MỌI cấu trúc thị trường là?', options: ['P = AC', 'MR = MC', 'TC = TR', 'MC luôn bằng 0'], correctIndex: 1, explanation: 'Mọi doanh nghiệp tối đa lợi nhuận khi doanh thu biên bằng chi phí biên (边际收益 = 边际成本).' },
]);

const c7 = doc('cme501-7-1-factor-markets', '7.1 — Factor markets & income distribution|||7.1 — Thị trường yếu tố sản xuất & phân phối thu nhập',
  'Yếu tố sản xuất (生产要素): lao động, đất đai, vốn; thị trường lao động, tiền lương, địa tô, lãi suất, lợi nhuận.',
  [[
    `<span class="eyebrow">CME501 · Chapter 7 · Lesson 7.1</span>
<h2>Factor markets &amp; income distribution</h2>
<h3>Factors of production</h3>
<p><strong>生产要素 (shēngchǎn yàosù)</strong> — factors of production — are the inputs firms combine to produce output: labor, land, capital and entrepreneurship. Each factor is traded in its own market, and its price is a form of income.</p>
<h3>The labor market</h3>
<p>In the <strong>劳动力市场 (láodònglì shìchǎng)</strong> — labor market — firms demand labor based on its <strong>边际生产力 (biānjì shēngchǎnlì)</strong> — marginal productivity: a firm hires workers up to the point where the value of one more worker's output equals the wage. The price of labor is <strong>工资 (gōngzī)</strong> — wage.</p>
<h3>Income from other factors</h3>
<ul>
<li><strong>地租 (dìzū)</strong> — rent: the return to land / natural resources.</li>
<li><strong>利息 (lìxī)</strong> — interest: the return to capital (the price of borrowing/lending funds).</li>
<li><strong>利润 (lìrùn)</strong> — profit: the return to entrepreneurship — what's left after paying wages, rent and interest.</li>
</ul>
<pre><code>National income (simplified) = 工资 wages + 地租 rent + 利息 interest + 利润 profit
Firm's hiring rule: hire labor while
   value of marginal product of labor (VMPL) &gt; wage (工资)
</code></pre>
<div class="callout"><span class="badge">Key vocabulary</span> 生产要素 shēngchǎn yàosù (factors of production) · 劳动力市场 láodònglì shìchǎng (labor market) · 工资 gōngzī (wage) · 地租 dìzū (rent) · 利息 lìxī (interest) · 利润 lìrùn (profit).</div>`,
    `<span class="eyebrow">CME501 · Chương 7 · Bài 7.1</span>
<h2>Thị trường yếu tố sản xuất & phân phối thu nhập</h2>
<h3>Các yếu tố sản xuất</h3>
<p><strong>生产要素 (shēngchǎn yàosù)</strong> — yếu tố sản xuất — là các đầu vào mà doanh nghiệp kết hợp để tạo ra sản lượng: lao động, đất đai, vốn và năng lực kinh doanh (entrepreneurship). Mỗi yếu tố được giao dịch trên thị trường riêng, và giá của nó chính là một dạng thu nhập.</p>
<h3>Thị trường lao động</h3>
<p>Trên <strong>劳动力市场 (láodònglì shìchǎng)</strong> — thị trường lao động — doanh nghiệp có cầu lao động dựa trên <strong>边际生产力 (biānjì shēngchǎnlì)</strong> — năng suất biên: doanh nghiệp thuê thêm lao động tới khi giá trị sản phẩm biên của người lao động thêm đó bằng đúng tiền lương. Giá của lao động là <strong>工资 (gōngzī)</strong> — tiền lương.</p>
<h3>Thu nhập từ các yếu tố khác</h3>
<ul>
<li><strong>地租 (dìzū)</strong> — địa tô: khoản trả cho đất đai / tài nguyên thiên nhiên.</li>
<li><strong>利息 (lìxī)</strong> — lãi suất: khoản trả cho vốn (giá của việc vay/cho vay tiền).</li>
<li><strong>利润 (lìrùn)</strong> — lợi nhuận: khoản trả cho năng lực kinh doanh — phần còn lại sau khi trả lương, địa tô và lãi suất.</li>
</ul>
<pre><code>Thu nhập quốc dân (đơn giản hoá) = 工资 tiền lương + 地租 địa tô + 利息 lãi suất + 利润 lợi nhuận
Quy tắc thuê lao động: doanh nghiệp thuê thêm lao động khi
   giá trị sản phẩm biên của lao động (VMPL) &gt; tiền lương (工资)
</code></pre>
<div class="callout"><span class="badge">Từ vựng chính</span> 生产要素 shēngchǎn yàosù (yếu tố sản xuất) · 劳动力市场 láodònglì shìchǎng (thị trường lao động) · 工资 gōngzī (tiền lương) · 地租 dìzū (địa tô) · 利息 lìxī (lãi suất) · 利润 lìrùn (lợi nhuận).</div>`,
  ]]);

const c7q = quiz('cme501-quiz-7', 'Quiz 7 — Factor markets|||Quiz 7 — Thị trường yếu tố sản xuất', [
  { id: 'q1', question: '劳动力市场 (láodònglì shìchǎng) là thị trường của yếu tố sản xuất nào?', options: ['Đất đai', 'Vốn', 'Lao động', 'Doanh nghiệp'], correctIndex: 2, explanation: '劳动力市场 nghĩa là thị trường lao động, nơi giao dịch sức lao động lấy tiền lương.' },
  { id: 'q2', question: '地租 (dìzū) là khoản thu nhập trả cho yếu tố sản xuất nào?', options: ['Lao động', 'Đất đai / tài nguyên', 'Vốn tài chính', 'Năng lực kinh doanh'], correctIndex: 1, explanation: '地租 (địa tô) là khoản trả cho việc sử dụng đất đai và tài nguyên thiên nhiên.' },
  { id: 'q3', question: 'Doanh nghiệp nên thuê thêm lao động khi nào theo quy tắc năng suất biên?', options: ['Khi VMPL &gt; tiền lương (工资)', 'Khi VMPL &lt; tiền lương', 'Khi lợi nhuận (利润) bằng 0', 'Khi lãi suất (利息) tăng'], correctIndex: 0, explanation: 'Thuê thêm lao động còn có lợi khi giá trị sản phẩm biên còn lớn hơn tiền lương phải trả.' },
]);

const c8 = doc('cme501-8-1-market-failure-glossary', '8.1 — Market failure, externalities & glossary review|||8.1 — Thất bại thị trường, ngoại ứng & ôn tập thuật ngữ',
  'Thất bại thị trường (市场失灵), ngoại ứng (外部性), hàng hoá công cộng, thông tin bất cân xứng; bảng ôn tập 8 chương.',
  [[
    `<span class="eyebrow">CME501 · Chapter 8 · Lesson 8.1</span>
<h2>Market failure, externalities &amp; glossary review</h2>
<h3>Market failure</h3>
<p><strong>市场失灵 (shìchǎng shīlíng)</strong> — market failure — happens when the free market, left alone, fails to allocate resources efficiently. Two classic causes: externalities and public goods.</p>
<h3>Externalities</h3>
<p><strong>外部性 (wàibùxìng)</strong> — externality — is a cost or benefit affecting a third party not involved in a transaction.</p>
<ul>
<li><strong>正外部性 (zhèng wàibùxìng)</strong> — positive externality: e.g. education benefits society beyond the student (market tends to <em>under-produce</em>).</li>
<li><strong>负外部性 (fù wàibùxìng)</strong> — negative externality: e.g. pollution harms bystanders (market tends to <em>over-produce</em>).</li>
</ul>
<h3>Public goods &amp; information</h3>
<p><strong>公共物品 (gōnggòng wùpǐn)</strong> — public goods (e.g. street lighting, national defense) are non-excludable and non-rival — the private market under-supplies them, so government usually provides them. <strong>信息不对称 (xìnxī bú duìchèn)</strong> — asymmetric information — is when one side of a transaction knows more than the other (e.g. used-car sellers vs. buyers), which can break down markets entirely.</p>
<h3>Glossary review — all 8 chapters</h3>
<table>
<tr><th>汉字</th><th>Pinyin</th><th>English / Vietnamese</th></tr>
<tr><td>稀缺性</td><td>xīquēxìng</td><td>scarcity — khan hiếm</td></tr>
<tr><td>需求 / 供给</td><td>xūqiú / gōngjǐ</td><td>demand / supply — cầu / cung</td></tr>
<tr><td>均衡价格</td><td>jūnhéng jiàgé</td><td>equilibrium price — giá cân bằng</td></tr>
<tr><td>弹性</td><td>tánxìng</td><td>elasticity — độ co giãn</td></tr>
<tr><td>效用</td><td>xiàoyòng</td><td>utility — hữu dụng</td></tr>
<tr><td>边际成本</td><td>biānjì chéngběn</td><td>marginal cost — chi phí biên</td></tr>
<tr><td>垄断</td><td>lǒngduàn</td><td>monopoly — độc quyền</td></tr>
<tr><td>市场失灵</td><td>shìchǎng shīlíng</td><td>market failure — thất bại thị trường</td></tr>
<tr><td>外部性</td><td>wàibùxìng</td><td>externality — ngoại ứng</td></tr>
</table>
<div class="callout"><span class="badge">Exam tip</span> When a question mixes an economics concept with a Chinese term, first translate the 汉字 to its English/Vietnamese meaning in your head, THEN apply the economics rule — don't try to reason in Chinese under time pressure.</div>`,
    `<span class="eyebrow">CME501 · Chương 8 · Bài 8.1</span>
<h2>Thất bại thị trường, ngoại ứng & ôn tập thuật ngữ</h2>
<h3>Thất bại thị trường</h3>
<p><strong>市场失灵 (shìchǎng shīlíng)</strong> — thất bại thị trường — xảy ra khi thị trường tự do, nếu để tự vận hành, không phân bổ nguồn lực hiệu quả. Hai nguyên nhân kinh điển: ngoại ứng và hàng hoá công cộng.</p>
<h3>Ngoại ứng</h3>
<p><strong>外部性 (wàibùxìng)</strong> — ngoại ứng — là chi phí hoặc lợi ích ảnh hưởng tới bên thứ ba không tham gia giao dịch.</p>
<ul>
<li><strong>正外部性 (zhèng wàibùxìng)</strong> — ngoại ứng tích cực: ví dụ giáo dục đem lại lợi ích cho xã hội vượt ra ngoài bản thân người học (thị trường có xu hướng <em>sản xuất dưới mức</em> tối ưu).</li>
<li><strong>负外部性 (fù wàibùxìng)</strong> — ngoại ứng tiêu cực: ví dụ ô nhiễm gây hại cho người ngoài cuộc (thị trường có xu hướng <em>sản xuất vượt mức</em> tối ưu).</li>
</ul>
<h3>Hàng hoá công cộng & thông tin</h3>
<p><strong>公共物品 (gōnggòng wùpǐn)</strong> — hàng hoá công cộng (đèn đường, quốc phòng) — không loại trừ và không cạnh tranh trong tiêu dùng — thị trường tư nhân cung cấp thiếu, nên thường do chính phủ đảm nhận. <strong>信息不对称 (xìnxī bú duìchèn)</strong> — thông tin bất cân xứng — là khi một bên trong giao dịch biết nhiều hơn bên kia (ví dụ người bán xe cũ so với người mua), có thể khiến cả thị trường sụp đổ.</p>
<h3>Bảng ôn tập thuật ngữ — 8 chương</h3>
<table>
<tr><th>汉字</th><th>Pinyin</th><th>Tiếng Anh / Tiếng Việt</th></tr>
<tr><td>稀缺性</td><td>xīquēxìng</td><td>scarcity — khan hiếm</td></tr>
<tr><td>需求 / 供给</td><td>xūqiú / gōngjǐ</td><td>demand / supply — cầu / cung</td></tr>
<tr><td>均衡价格</td><td>jūnhéng jiàgé</td><td>equilibrium price — giá cân bằng</td></tr>
<tr><td>弹性</td><td>tánxìng</td><td>elasticity — độ co giãn</td></tr>
<tr><td>效用</td><td>xiàoyòng</td><td>utility — hữu dụng</td></tr>
<tr><td>边际成本</td><td>biānjì chéngběn</td><td>marginal cost — chi phí biên</td></tr>
<tr><td>垄断</td><td>lǒngduàn</td><td>monopoly — độc quyền</td></tr>
<tr><td>市场失灵</td><td>shìchǎng shīlíng</td><td>market failure — thất bại thị trường</td></tr>
<tr><td>外部性</td><td>wàibùxìng</td><td>externality — ngoại ứng</td></tr>
</table>
<div class="callout"><span class="badge">Mẹo làm bài thi</span> Khi câu hỏi trộn khái niệm kinh tế với thuật ngữ tiếng Trung, hãy dịch chữ Hán (汉字) ra nghĩa tiếng Việt/Anh trong đầu TRƯỚC, rồi mới áp dụng quy tắc kinh tế — đừng cố suy luận trực tiếp bằng tiếng Trung khi đang chịu áp lực thời gian.</div>`,
  ]]);

const c8q = quiz('cme501-quiz-8', 'Quiz 8 — Market failure & review|||Quiz 8 — Thất bại thị trường & ôn tập', [
  { id: 'q1', question: 'Ô nhiễm môi trường là ví dụ của loại ngoại ứng nào?', options: ['正外部性 (ngoại ứng tích cực)', '负外部性 (ngoại ứng tiêu cực)', 'Không phải ngoại ứng', 'Hàng hoá công cộng'], correctIndex: 1, explanation: 'Ô nhiễm gây hại cho bên thứ ba → 负外部性 (fù wàibùxìng), ngoại ứng tiêu cực.' },
  { id: 'q2', question: '公共物品 (gōnggòng wùpǐn) — hàng hoá công cộng — có đặc điểm gì?', options: ['Loại trừ và cạnh tranh trong tiêu dùng', 'Không loại trừ và không cạnh tranh trong tiêu dùng', 'Chỉ bán được bởi doanh nghiệp độc quyền', 'Giá luôn bằng chi phí biên'], correctIndex: 1, explanation: 'Hàng hoá công cộng: không thể loại trừ người không trả tiền, và một người dùng không làm giảm phần người khác dùng.' },
  { id: 'q3', question: '市场失灵 (shìchǎng shīlíng) — thất bại thị trường — có thể do nguyên nhân nào sau đây?', options: ['Cạnh tranh hoàn hảo hoạt động tốt', 'Ngoại ứng (外部性) và hàng hoá công cộng (公共物品)', 'Giá luôn ở mức cân bằng', 'Người tiêu dùng luôn có đầy đủ thông tin'], correctIndex: 1, explanation: 'Ngoại ứng, hàng hoá công cộng và thông tin bất cân xứng là các nguyên nhân kinh điển của thất bại thị trường.' },
]);

export default {
  semester: { code: 'FPTU_Hola7', name: 'Kỳ 7', ordinal: 9 },
  course: {
    courseCode: 'CME501',
    slug: 'cme501-microeconomics-taught-in-chinese',
    title: 'Microeconomics (taught in Chinese)',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/CME501.webp',
    shortDescription: 'Microeconomics with Chinese economics terminology (汉字 + pinyin): scarcity & PPF, supply/demand & equilibrium, elasticity, consumer & producer theory, competition & monopoly, factor markets, market failure.|||Kinh tế vi mô kèm thuật ngữ kinh tế tiếng Trung (汉字 + pinyin): khan hiếm & PPF, cung–cầu & cân bằng, độ co giãn, lý thuyết người tiêu dùng & sản xuất, cạnh tranh & độc quyền, thị trường yếu tố, thất bại thị trường.',
    description: 'Môn <strong>CME501 — Microeconomics (taught in Chinese)</strong> (ngành Ngôn ngữ Trung, kỳ 7) dạy <strong>kinh tế vi mô</strong> song song với <strong>thuật ngữ kinh tế tiếng Trung</strong> (汉字 + pinyin). Đi từ <strong>khan hiếm &amp; đường PPF</strong> → <strong>cung, cầu &amp; giá cân bằng</strong> → <strong>độ co giãn</strong> → <strong>lý thuyết hành vi người tiêu dùng</strong> (hữu dụng, đường bàng quan) → <strong>lý thuyết sản xuất &amp; chi phí</strong> → <strong>cạnh tranh hoàn hảo &amp; độc quyền</strong> → <strong>thị trường yếu tố sản xuất &amp; phân phối thu nhập</strong> → <strong>thất bại thị trường &amp; ngoại ứng</strong>. Tham khảo giáo trình 《微观经济学》(高鸿业) và Pindyck &amp; Rubinfeld <em>Microeconomics</em>. Mỗi chương có bài đọc song ngữ (kèm 汉字/pinyin) và quiz 3 câu.',
    whatYouLearn: 'Khan hiếm (稀缺性) & chi phí cơ hội (机会成本), đường PPF; quy luật cung-cầu (供给/需求定律) & giá cân bằng (均衡价格); độ co giãn giá/thu nhập/chéo (弹性); hữu dụng (效用) & cân bằng người tiêu dùng (消费者均衡); hàm sản xuất (生产函数), chi phí biên/bình quân (边际/平均成本); cạnh tranh hoàn hảo (完全竞争) vs. độc quyền (垄断), quy tắc MR=MC; thị trường yếu tố sản xuất (生产要素市场): tiền lương, địa tô, lãi suất, lợi nhuận; thất bại thị trường (市场失灵) & ngoại ứng (外部性). Vốn từ vựng kinh tế tiếng Trung xuyên suốt 8 chương.',
    requirements: 'Trình độ tiếng Trung cơ bản-trung cấp theo khung chương trình Ngôn ngữ Trung FPTU. Không cần nền tảng kinh tế trước đó — mọi khái niệm được xây từ đầu.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình 高鸿业 & Pindyck (trích dẫn), tài liệu chính thức, YouTube, công cụ tra từ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Kinh tế vi mô là gì, khác vĩ mô ra sao, lộ trình 8 chương.', lessons: [intro] },
    { title: 'Chương 1 — Nhập môn & thị trường|||Chapter 1 — Introduction & markets', description: 'Khan hiếm, chi phí cơ hội, PPF, thị trường.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Cung, cầu & giá cân bằng|||Chapter 2 — Supply, demand & equilibrium', description: 'Quy luật cung-cầu, giá cân bằng, thiếu hụt & dư thừa.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Độ co giãn|||Chapter 3 — Elasticity', description: 'Co giãn giá, thu nhập, chéo.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Lý thuyết người tiêu dùng|||Chapter 4 — Consumer behavior theory', description: 'Hữu dụng, đường bàng quan, cân bằng người tiêu dùng.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Sản xuất & chi phí|||Chapter 5 — Production & cost theory', description: 'Hàm sản xuất, sản phẩm biên, các loại chi phí.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Cạnh tranh hoàn hảo & độc quyền|||Chapter 6 — Perfect competition & monopoly', description: 'Cấu trúc thị trường, quy tắc MR=MC.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Thị trường yếu tố sản xuất|||Chapter 7 — Factor markets & income distribution', description: 'Lao động, tiền lương, địa tô, lãi suất, lợi nhuận.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Thất bại thị trường & ngoại ứng|||Chapter 8 — Market failure, externalities & review', description: 'Ngoại ứng, hàng hoá công cộng, ôn tập thuật ngữ.', lessons: [c8, c8q] },
  ],
};
