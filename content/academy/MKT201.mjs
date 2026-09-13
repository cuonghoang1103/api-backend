/**
 * MKT201 — Consumer Behavior (Hành vi người tiêu dùng). Khối Quản trị Kinh doanh, kỳ 3.
 * Bám cấu trúc giáo trình hành vi người tiêu dùng chuẩn quốc tế (Solomon — Consumer Behavior:
 * Buying, Having, and Being; Schiffman & Wisenblit — Consumer Behavior; Hoyer, MacInnis & Pieters —
 * Consumer Behavior): mức độ liên quan và ra quyết định, nhận thức (ngưỡng, JND, Weber), học hỏi và
 * trí nhớ, động cơ – giá trị – chuỗi phương tiện–mục đích, bản thân – tính cách – lối sống, thái độ
 * (ABC, Fishbein) và thuyết phục (ELM), nhóm – gia đình – văn hoá – tầng lớp – lan toả đổi mới,
 * hành trình số, đạo đức. Tránh lặp MKT101 (quy trình 5 bước, 4 nhóm yếu tố chỉ nhắc để liên hệ) và
 * MMG301. Song ngữ + ví dụ (số đã kiểm bằng máy; tình huống, thương hiệu, số liệu là GIẢ ĐỊNH) +
 * 3 bài tập + quiz.
 * Giữ NGUYÊN slug/semester/thumb(v3). ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const intro = doc('mkt201-0-1-overview', 'Course overview: the psychology behind every purchase|||Tổng quan: tâm lý học đằng sau mỗi lần mua',
  'Hành vi người tiêu dùng là gì, từ MKT101 sang MKT201, các vai trò của người tiêu dùng, hành vi như một quá trình, ba cách tiếp cận nghiên cứu (thực chứng, diễn giải, dữ liệu hành vi), lộ trình môn.',
  [[
    `<span class="eyebrow">MKT201 · Lesson 0.1 · Overview</span>
<h2>Consumer Behavior</h2>
<p class="lead">Consumer behavior is the study of the processes involved when individuals or groups <strong>select, purchase, use or dispose of</strong> products, services, ideas or experiences to satisfy needs and desires. It covers what happens before, during and after the moment of purchase — and, above all, <em>why</em>.</p>
<h3>From MKT101 to MKT201</h3>
<p>MKT101 gave you the outline: the five-stage buyer decision process and four groups of influencing factors (cultural, social, personal, psychological). MKT201 opens that "black box". Instead of listing factors, we ask how perception, learning, memory, motivation, the self, attitudes and social influence actually work — and how marketers can use that knowledge responsibly. MMG301 later turns these insights into management decisions such as positioning and brand equity.</p>
<p>The field is interdisciplinary: <strong>psychology</strong> explains the individual (perception, learning, attitudes), <strong>sociology and anthropology</strong> explain groups, culture and rituals, and <strong>economics</strong> — including behavioral economics — explains choices under limited time, money and attention.</p>
<h3>Who is "the consumer"?</h3>
<table>
<tr><th>Role</th><th>Example (a fictional family buying a laptop)</th></tr>
<tr><td>Initiator / influencer</td><td>The daughter, a first-year student, says she needs a laptop; a classmate recommends a brand</td></tr>
<tr><td>Decider / payer</td><td>The parents set the budget and approve the final choice</td></tr>
<tr><td>Buyer</td><td>The father places the order online</td></tr>
<tr><td>User</td><td>The daughter uses it every day and later writes a review</td></tr>
</table>
<p>One person can play every role, or the roles can be split among several people. Consumer behavior is also a <strong>process over time</strong> — pre-purchase, purchase and post-purchase, including use and disposal — and it matters to three parties: <strong>consumers</strong> (better decisions), <strong>marketers</strong> (better offers and messages) and <strong>public policy</strong> (protecting consumers from harm).</p>
<h3>Three ways to study consumers</h3>
<ul>
<li><strong>Positivist</strong> approach: explain and predict behavior with theories tested through experiments and surveys (for example, does a price framed as a discount raise purchase intention?).</li>
<li><strong>Interpretivist</strong> approach: understand the meanings people give to consumption through in-depth interviews, observation and ethnography — including <em>netnography</em>, the ethnographic study of online communities.</li>
<li><strong>Behavioral data</strong>: clickstreams, purchase histories, A/B tests and eye-tracking show what people do, though not always why they do it.</li>
</ul>
<h3>Roadmap</h3>
<p>Part 1: involvement and decision making · Part 2: perception, learning and memory · Part 3: motivation, values, the self and personality · Part 4: attitudes and persuasion · Part 5: groups, culture, the diffusion of innovations, the digital consumer and ethics. Cases, brands and numbers are fictional and illustrative; every calculation has been checked.</p>
<div class="callout"><span class="badge">One idea to keep</span> People rarely buy a product only for what it does; they also buy what it means — the feelings it brings and the sense of who they are.</div>`,
    `<span class="eyebrow">MKT201 · Bài 0.1 · Tổng quan</span>
<h2>Hành vi người tiêu dùng</h2>
<p class="lead">Hành vi người tiêu dùng nghiên cứu các quá trình diễn ra khi cá nhân hoặc nhóm <strong>lựa chọn, mua, sử dụng hoặc thải bỏ</strong> sản phẩm, dịch vụ, ý tưởng hay trải nghiệm để thoả mãn nhu cầu và mong muốn. Môn học bao quát những gì xảy ra trước, trong và sau thời điểm mua — và trên hết là <em>vì sao</em>.</p>
<h3>Từ MKT101 sang MKT201</h3>
<p>MKT101 đã cho bạn bộ khung: quy trình quyết định mua năm bước và bốn nhóm yếu tố ảnh hưởng (văn hoá, xã hội, cá nhân, tâm lý). MKT201 mở "hộp đen" đó. Thay vì liệt kê các yếu tố, ta hỏi nhận thức, học hỏi, trí nhớ, động cơ, bản thân, thái độ và ảnh hưởng xã hội thực sự vận hành thế nào — và người làm marketing dùng hiểu biết đó ra sao cho có trách nhiệm. Về sau MMG301 biến những hiểu biết này thành các quyết định quản trị như định vị và tài sản thương hiệu.</p>
<p>Đây là lĩnh vực liên ngành: <strong>tâm lý học</strong> giải thích cá nhân (nhận thức, học hỏi, thái độ), <strong>xã hội học và nhân học</strong> giải thích nhóm, văn hoá và nghi lễ, còn <strong>kinh tế học</strong> — gồm cả kinh tế học hành vi — giải thích lựa chọn khi thời gian, tiền bạc và sự chú ý đều có hạn.</p>
<h3>"Người tiêu dùng" là ai?</h3>
<table>
<tr><th>Vai trò</th><th>Ví dụ (một gia đình giả định mua máy tính xách tay)</th></tr>
<tr><td>Người khởi xướng / người ảnh hưởng</td><td>Cô con gái, sinh viên năm nhất, nói cần máy tính; một bạn cùng lớp gợi ý một thương hiệu</td></tr>
<tr><td>Người quyết định / người trả tiền</td><td>Bố mẹ đặt ngân sách và duyệt lựa chọn cuối cùng</td></tr>
<tr><td>Người mua</td><td>Người bố đặt hàng trực tuyến</td></tr>
<tr><td>Người sử dụng</td><td>Cô con gái dùng máy hằng ngày và sau đó viết đánh giá</td></tr>
</table>
<p>Một người có thể đảm nhận mọi vai trò, hoặc các vai trò được chia cho nhiều người. Hành vi người tiêu dùng cũng là một <strong>quá trình theo thời gian</strong> — trước mua, mua và sau mua, gồm cả sử dụng và thải bỏ — và nó quan trọng với ba bên: <strong>người tiêu dùng</strong> (quyết định tốt hơn), <strong>doanh nghiệp</strong> (sản phẩm và thông điệp tốt hơn) và <strong>chính sách công</strong> (bảo vệ người tiêu dùng khỏi bị thiệt hại).</p>
<h3>Ba cách nghiên cứu người tiêu dùng</h3>
<ul>
<li>Cách tiếp cận <strong>thực chứng</strong>: giải thích và dự đoán hành vi bằng lý thuyết được kiểm định qua thực nghiệm và khảo sát (ví dụ: trình bày giá dưới dạng giảm giá có làm tăng ý định mua không?).</li>
<li>Cách tiếp cận <strong>diễn giải</strong>: thấu hiểu ý nghĩa mà con người gán cho việc tiêu dùng qua phỏng vấn sâu, quan sát và dân tộc học — gồm cả <em>netnography</em>, nghiên cứu dân tộc học về cộng đồng trực tuyến.</li>
<li><strong>Dữ liệu hành vi</strong>: dấu vết nhấp chuột, lịch sử mua hàng, thử nghiệm A/B và theo dõi chuyển động mắt cho biết con người làm gì, dù không phải lúc nào cũng cho biết vì sao.</li>
</ul>
<h3>Lộ trình</h3>
<p>Phần 1: mức độ liên quan và ra quyết định · Phần 2: nhận thức, học hỏi và trí nhớ · Phần 3: động cơ, giá trị, bản thân và tính cách · Phần 4: thái độ và thuyết phục · Phần 5: nhóm, văn hoá, lan toả đổi mới, người tiêu dùng số và đạo đức. Tình huống, thương hiệu và số liệu đều là giả định, mang tính minh hoạ; mọi phép tính đã được kiểm tra.</p>
<div class="callout"><span class="badge">Một ý cần giữ</span> Người ta hiếm khi mua một sản phẩm chỉ vì công dụng của nó; họ còn mua ý nghĩa của nó — cảm xúc nó mang lại và cảm nhận về việc mình là ai.</div>`,
  ]]);

const c1 = doc('mkt201-1-1-involvement-decisions', '1.1 — Involvement & types of consumer decisions|||1.1 — Mức độ liên quan & các kiểu quyết định của người tiêu dùng',
  'Ba loại mức độ liên quan (sản phẩm, thông điệp, tình huống mua), rủi ro cảm nhận, ba kiểu quyết định (giải quyết vấn đề mở rộng, giới hạn, theo thói quen), ba góc nhìn về ra quyết định, tính hợp lý có giới hạn và kinh tế học hành vi, lòng trung thành và quán tính.',
  [[
    `<span class="eyebrow">MKT201 · Part 1 · Lesson 1.1</span>
<h2>Involvement &amp; types of consumer decisions</h2>
<p class="lead">Not every purchase deserves the same mental effort. The key variable that decides how much effort a consumer invests is <strong>involvement</strong> — the perceived relevance of an object based on the person's needs, values and interests.</p>
<h3>Three kinds of involvement</h3>
<table>
<tr><th>Type</th><th>What drives it</th><th>Example</th></tr>
<tr><td>Product involvement</td><td>Interest in a product category; higher when the product is expensive, risky, visible to others or linked to the self</td><td>A student who loves photography compares camera sensors for weeks</td></tr>
<tr><td>Message (advertising) involvement</td><td>Interest in processing a marketing message</td><td>Watching a product-review video to the end and reading the comments</td></tr>
<tr><td>Purchase-situation involvement</td><td>The context: the same product matters more in some situations</td><td>Choosing tea as a gift for a future parent-in-law rather than for oneself</td></tr>
</table>
<p>Involvement is a continuum, from <strong>inertia</strong> (decisions made out of habit, with little motivation to consider alternatives) to intense <strong>passion</strong> for a product or brand. <strong>Perceived risk</strong> raises involvement; its main forms are monetary, functional, physical, social and psychological risk. Researchers measure involvement with semantic-differential scales such as Zaichkowsky's Personal Involvement Inventory (pairs like important–unimportant, boring–interesting).</p>
<h3>Three types of decisions</h3>
<table>
<tr><th></th><th>Extended problem solving</th><th>Limited problem solving</th><th>Habitual decision making</th></tr>
<tr><td>Involvement / risk</td><td>High</td><td>Moderate to low</td><td>Low</td></tr>
<tr><td>Information search</td><td>Extensive; many internal and external sources</td><td>Little; relies on simple rules</td><td>Almost none (automatic)</td></tr>
<tr><td>Alternatives compared</td><td>Many, on many attributes</td><td>Few</td><td>One brand, by habit or loyalty</td></tr>
<tr><td>Typical example</td><td>A first motorbike, a university, a smartphone</td><td>A new shampoo when the usual one is out of stock</td><td>Instant noodles, milk tea from the usual shop</td></tr>
</table>
<p>MKT101's four buying-behavior types (complex, dissonance-reducing, variety-seeking, habitual) combine this same involvement idea with the degree of difference between brands.</p>
<h3>Three perspectives on decision making</h3>
<ul>
<li><strong>Rational (cognitive)</strong>: consumers gather information and weigh alternatives carefully — realistic mainly for high-involvement decisions.</li>
<li><strong>Behavioral influence</strong>: many choices are triggered by the environment — shelf position, default options, a promotion at the checkout — with little thought.</li>
<li><strong>Experiential</strong>: some choices are driven by feelings, fun, fantasy or aesthetic pleasure rather than by attribute comparison.</li>
</ul>
<p>Behavioral economics adds that rationality is <strong>bounded</strong> (Herbert Simon): people often <em>satisfice</em> — choose an option that is good enough — rather than optimize. Losses loom larger than equivalent gains (<strong>loss aversion</strong>, from Kahneman and Tversky's prospect theory), and the way options are arranged — <strong>choice architecture</strong>, such as which option is the default — changes what people choose. Adding a "decoy" option that is clearly worse than the target but not clearly worse than the competitor makes the target look better (the <strong>decoy</strong> or asymmetric-dominance effect). MMG301 treats related heuristics and framing from a manager's viewpoint.</p>
<h3>Brand loyalty versus inertia</h3>
<p>Both produce repeat purchases, but they differ in attitude. <strong>Inertia</strong> is buying out of habit; a small discount from a rival can switch the buyer. <strong>Brand loyalty</strong> is repeat purchase with a strong positive attitude and commitment; loyal customers resist rival offers and may even defend the brand. A leader serving inertia buyers keeps them from noticing alternatives (availability, shelf space); challengers try to break the habit (free samples, "switch and save" offers).</p>
<div class="callout"><span class="badge">Marketing implication</span> Diagnose involvement before designing a campaign: high-involvement buyers need detailed arguments and comparison tools; low-involvement buyers need visibility, simple cues and easy availability.</div>`,
    `<span class="eyebrow">MKT201 · Phần 1 · Bài 1.1</span>
<h2>Mức độ liên quan &amp; các kiểu quyết định của người tiêu dùng</h2>
<p class="lead">Không phải lần mua nào cũng đáng bỏ ra cùng một nỗ lực suy nghĩ. Biến số then chốt quyết định người tiêu dùng đầu tư bao nhiêu nỗ lực là <strong>mức độ liên quan</strong> (involvement) — mức độ một đối tượng được cảm nhận là quan trọng dựa trên nhu cầu, giá trị và sở thích của người đó.</p>
<h3>Ba loại mức độ liên quan</h3>
<table>
<tr><th>Loại</th><th>Điều gì thúc đẩy</th><th>Ví dụ</th></tr>
<tr><td>Liên quan với sản phẩm</td><td>Sự quan tâm tới một loại sản phẩm; cao hơn khi sản phẩm đắt, rủi ro, dễ bị người khác nhìn thấy hoặc gắn với bản thân</td><td>Một sinh viên mê nhiếp ảnh so sánh cảm biến máy ảnh suốt nhiều tuần</td></tr>
<tr><td>Liên quan với thông điệp (quảng cáo)</td><td>Sự quan tâm xử lý một thông điệp marketing</td><td>Xem hết một video đánh giá sản phẩm và đọc cả phần bình luận</td></tr>
<tr><td>Liên quan với tình huống mua</td><td>Bối cảnh: cùng một sản phẩm nhưng quan trọng hơn trong một số tình huống</td><td>Chọn trà làm quà biếu bố mẹ người yêu thay vì mua cho chính mình</td></tr>
</table>
<p>Mức độ liên quan là một dải liên tục, từ <strong>quán tính</strong> (quyết định theo thói quen, ít động lực xem xét phương án khác) tới <strong>đam mê</strong> mãnh liệt với một sản phẩm hay thương hiệu. <strong>Rủi ro cảm nhận</strong> làm tăng mức độ liên quan; các dạng chính là rủi ro tiền bạc, chức năng, thể chất, xã hội và tâm lý. Nhà nghiên cứu đo mức độ liên quan bằng thang đo đối nghĩa như Personal Involvement Inventory của Zaichkowsky (các cặp như quan trọng – không quan trọng, nhàm chán – thú vị).</p>
<h3>Ba kiểu quyết định</h3>
<table>
<tr><th></th><th>Giải quyết vấn đề mở rộng</th><th>Giải quyết vấn đề giới hạn</th><th>Ra quyết định theo thói quen</th></tr>
<tr><td>Mức độ liên quan / rủi ro</td><td>Cao</td><td>Trung bình tới thấp</td><td>Thấp</td></tr>
<tr><td>Tìm kiếm thông tin</td><td>Rộng; nhiều nguồn bên trong và bên ngoài</td><td>Ít; dựa vào quy tắc đơn giản</td><td>Gần như không có (tự động)</td></tr>
<tr><td>Số phương án so sánh</td><td>Nhiều, trên nhiều thuộc tính</td><td>Ít</td><td>Một thương hiệu, do thói quen hoặc lòng trung thành</td></tr>
<tr><td>Ví dụ điển hình</td><td>Chiếc xe máy đầu tiên, trường đại học, điện thoại thông minh</td><td>Dầu gội mới khi loại quen dùng hết hàng</td><td>Mì gói, trà sữa ở quán quen</td></tr>
</table>
<p>Bốn kiểu hành vi mua trong MKT101 (phức tạp, giảm bất hoà, tìm kiếm sự đa dạng, theo thói quen) kết hợp chính ý tưởng mức độ liên quan này với mức khác biệt giữa các thương hiệu.</p>
<h3>Ba góc nhìn về ra quyết định</h3>
<ul>
<li><strong>Hợp lý (nhận thức)</strong>: người tiêu dùng thu thập thông tin và cân nhắc kỹ các phương án — sát thực tế chủ yếu với quyết định có mức độ liên quan cao.</li>
<li><strong>Ảnh hưởng hành vi</strong>: nhiều lựa chọn do môi trường kích hoạt — vị trí trên kệ, phương án mặc định, khuyến mãi ở quầy thu ngân — mà hầu như không suy nghĩ.</li>
<li><strong>Trải nghiệm</strong>: một số lựa chọn do cảm xúc, niềm vui, tưởng tượng hoặc khoái cảm thẩm mỹ dẫn dắt chứ không phải do so sánh thuộc tính.</li>
</ul>
<p>Kinh tế học hành vi bổ sung rằng tính hợp lý là <strong>có giới hạn</strong> (Herbert Simon): con người thường <em>chọn cái đủ tốt</em> (satisfice) thay vì tối ưu. Mất mát được cảm nhận nặng hơn khoản được tương đương (<strong>né tránh mất mát</strong>, từ lý thuyết triển vọng của Kahneman và Tversky), và cách sắp xếp các phương án — <strong>kiến trúc lựa chọn</strong>, chẳng hạn phương án nào là mặc định — làm thay đổi điều người ta chọn. Thêm một phương án "mồi nhử" kém hẳn phương án mục tiêu nhưng không kém rõ so với đối thủ sẽ khiến phương án mục tiêu trông tốt hơn (<strong>hiệu ứng mồi nhử</strong>, hay hiệu ứng trội bất đối xứng). MMG301 bàn các lối tắt suy nghĩ và cách đóng khung liên quan dưới góc nhìn nhà quản trị.</p>
<h3>Lòng trung thành thương hiệu và quán tính</h3>
<p>Cả hai đều tạo ra mua lặp lại nhưng khác nhau về thái độ. <strong>Quán tính</strong> là mua theo thói quen; một khoản giảm giá nhỏ của đối thủ có thể khiến người mua đổi. <strong>Lòng trung thành thương hiệu</strong> là mua lặp lại kèm thái độ tích cực mạnh và sự gắn bó; khách trung thành cưỡng lại ưu đãi của đối thủ và thậm chí bênh vực thương hiệu. Thương hiệu dẫn đầu phục vụ khách quán tính cần giữ để họ không để ý tới phương án khác (độ phủ, diện tích kệ); kẻ thách thức thì tìm cách phá thói quen (phát mẫu thử miễn phí, ưu đãi "đổi sang dùng và tiết kiệm").</p>
<div class="callout"><span class="badge">Hàm ý marketing</span> Chẩn đoán mức độ liên quan trước khi thiết kế chiến dịch: người mua có mức độ liên quan cao cần lập luận chi tiết và công cụ so sánh; người mua có mức độ liên quan thấp cần sự hiện diện, tín hiệu đơn giản và sản phẩm dễ mua.</div>`,
  ]]);

const c2 = doc('mkt201-1-2-search-choice-post-purchase', '1.2 — Problem recognition, search, choice & post-purchase|||1.2 — Nhận biết vấn đề, tìm kiếm, lựa chọn & sau mua',
  'Trạng thái thực tế và lý tưởng, tìm kiếm trước mua và liên tục, tìm kiếm bên trong và bên ngoài, các tập thương hiệu (nhận biết, gợi nhớ, cân nhắc, loại bỏ, thờ ơ), quy tắc quyết định, yếu tố tình huống, mua bốc đồng, mô hình bất xác nhận kỳ vọng, bất hoà và thải bỏ.',
  [[
    `<span class="eyebrow">MKT201 · Part 1 · Lesson 1.2</span>
<h2>Problem recognition, search, choice &amp; post-purchase</h2>
<p class="lead">MKT101 named the stages of the decision process. This lesson looks inside each stage with the concepts consumer researchers use.</p>
<h3>Problem recognition</h3>
<p>A problem is recognized when there is a significant gap between the consumer's <strong>actual state</strong> and a desired <strong>ideal state</strong>. <em>Need recognition</em> happens when the actual state falls (the phone battery dies, the rice runs out); <em>opportunity recognition</em> happens when the ideal state rises (a friend shows off a new foldable phone). Marketing works mostly on the ideal state, by showing new possibilities, and sometimes on the actual state — for example reminders to replace a toothbrush or a water filter.</p>
<h3>Information search</h3>
<ul>
<li><strong>Pre-purchase search</strong> is triggered by a specific need; <strong>ongoing search</strong> is browsing for pleasure or to stay up to date (enthusiasts following tech channels).</li>
<li><strong>Internal search</strong> scans memory; <strong>external search</strong> uses advertising, retailers, friends, reviews and search engines.</li>
<li>Search is greater when perceived risk is high, when search is cheap and fast, and when the consumer has moderate knowledge: the relationship with knowledge is an inverted U — novices do not know where to start and experts already know what they want.</li>
</ul>
<h3>Evaluating alternatives: brand sets and categories</h3>
<table>
<tr><th>Set</th><th>Meaning</th></tr>
<tr><td>Awareness set</td><td>All brands the consumer knows in the category</td></tr>
<tr><td>Evoked set</td><td>Brands retrieved from memory when the need arises</td></tr>
<tr><td>Consideration set</td><td>Brands the consumer seriously considers — usually only a handful</td></tr>
<tr><td>Inept set</td><td>Known brands the consumer rejects (a negative image or bad experience)</td></tr>
<tr><td>Inert set</td><td>Known brands the consumer is indifferent to</td></tr>
</table>
<p>Terminology varies: some textbooks (for example Schiffman) use "evoked set" for the brands actually considered. Consumers also evaluate products by <strong>category</strong>: placing a cereal bar in the "breakfast" category rather than "snacks" changes its competitors and the attributes it is judged on. The most typical member of a category (the <em>prototype</em>) often becomes the reference point.</p>
<h3>Decision rules and heuristics</h3>
<p>With <strong>compensatory</strong> rules a weakness on one attribute can be offset by a strength on another (the multi-attribute model of Part 4). <strong>Non-compensatory</strong> rules are shortcuts: <em>lexicographic</em> (choose the best brand on the most important attribute), <em>elimination-by-aspects</em> (drop brands that fail on attributes taken one at a time) and <em>conjunctive</em> (every attribute must pass a cut-off). Consumers also rely on <strong>heuristics</strong> — "higher price means higher quality", "a well-known brand is safer", country-of-origin cues. These save effort but can mislead.</p>
<h3>The purchase situation</h3>
<p>Situational variables (Belk) shape the final choice: <em>physical surroundings</em> (store layout, music, scent, lighting — <strong>atmospherics</strong>), <em>social surroundings</em> (shopping with friends), <em>time</em> (time pressure), <em>task definition</em> (buying for oneself or as a gift) and <em>antecedent states</em> (mood, fatigue, hunger). <strong>Impulse buying</strong> — a sudden, powerful urge to buy immediately — is fueled by point-of-purchase displays, limited-time offers and one-click payment.</p>
<h3>Post-purchase: satisfaction, dissonance and disposal</h3>
<ul>
<li><strong>Expectancy disconfirmation model</strong>: satisfaction depends on performance relative to expectations. Performance above expectations (positive disconfirmation) delights; below expectations (negative disconfirmation) disappoints. Overpromising in advertising can therefore lower satisfaction.</li>
<li><strong>Cognitive dissonance</strong> after an important purchase is reduced by reassurance: warranties, follow-up messages, easy returns.</li>
<li><strong>Disposal</strong>: keep, give away, sell, recycle or throw away. Resale platforms and second-hand markets (<em>lateral cycling</em>) and the sharing of goods (<em>collaborative consumption</em>) are growing parts of consumer behavior.</li>
</ul>
<div class="callout"><span class="badge">Marketing implication</span> A brand outside the consideration set never gets its attributes compared. In many categories the first battle is simply to be remembered and found at the right moment.</div>`,
    `<span class="eyebrow">MKT201 · Phần 1 · Bài 1.2</span>
<h2>Nhận biết vấn đề, tìm kiếm, lựa chọn &amp; sau mua</h2>
<p class="lead">MKT101 đã gọi tên các giai đoạn của quy trình quyết định. Bài này đi vào bên trong từng giai đoạn bằng các khái niệm mà nhà nghiên cứu người tiêu dùng sử dụng.</p>
<h3>Nhận biết vấn đề</h3>
<p>Vấn đề được nhận biết khi có khoảng cách đáng kể giữa <strong>trạng thái thực tế</strong> và <strong>trạng thái lý tưởng</strong> mà người tiêu dùng mong muốn. <em>Nhận biết nhu cầu</em> xảy ra khi trạng thái thực tế đi xuống (điện thoại hết pin, gạo trong nhà hết); <em>nhận biết cơ hội</em> xảy ra khi trạng thái lý tưởng được nâng lên (một người bạn khoe điện thoại màn hình gập mới). Marketing chủ yếu tác động vào trạng thái lý tưởng bằng cách cho thấy những khả năng mới, và đôi khi tác động vào trạng thái thực tế — ví dụ nhắc thay bàn chải đánh răng hay lõi lọc nước.</p>
<h3>Tìm kiếm thông tin</h3>
<ul>
<li><strong>Tìm kiếm trước mua</strong> do một nhu cầu cụ thể kích hoạt; <strong>tìm kiếm liên tục</strong> là lướt xem cho vui hoặc để cập nhật (người mê công nghệ theo dõi các kênh công nghệ).</li>
<li><strong>Tìm kiếm bên trong</strong> là lục lại trí nhớ; <strong>tìm kiếm bên ngoài</strong> dùng quảng cáo, nhà bán lẻ, bạn bè, đánh giá và công cụ tìm kiếm.</li>
<li>Người ta tìm kiếm nhiều hơn khi rủi ro cảm nhận cao, khi việc tìm kiếm rẻ và nhanh, và khi có hiểu biết ở mức vừa phải: quan hệ với hiểu biết có dạng chữ U ngược — người mới không biết bắt đầu từ đâu, còn chuyên gia đã biết mình muốn gì.</li>
</ul>
<h3>Đánh giá phương án: các tập thương hiệu và loại sản phẩm</h3>
<table>
<tr><th>Tập</th><th>Ý nghĩa</th></tr>
<tr><td>Tập nhận biết</td><td>Mọi thương hiệu người tiêu dùng biết trong loại sản phẩm</td></tr>
<tr><td>Tập gợi nhớ</td><td>Các thương hiệu được lấy ra từ trí nhớ khi nhu cầu xuất hiện</td></tr>
<tr><td>Tập cân nhắc</td><td>Các thương hiệu được xem xét nghiêm túc — thường chỉ vài cái</td></tr>
<tr><td>Tập loại bỏ</td><td>Thương hiệu đã biết nhưng bị từ chối (hình ảnh xấu hoặc trải nghiệm tệ)</td></tr>
<tr><td>Tập thờ ơ</td><td>Thương hiệu đã biết nhưng người tiêu dùng không có cảm xúc gì</td></tr>
</table>
<p>Thuật ngữ không thống nhất: một số giáo trình (ví dụ Schiffman) dùng "tập gợi nhớ" (evoked set) để chỉ các thương hiệu thực sự được cân nhắc. Người tiêu dùng còn đánh giá sản phẩm theo <strong>loại</strong>: xếp một thanh ngũ cốc vào loại "bữa sáng" thay vì "đồ ăn vặt" sẽ đổi đối thủ cạnh tranh và đổi các thuộc tính nó bị đem ra so sánh. Thành viên tiêu biểu nhất của một loại (<em>nguyên mẫu</em>) thường trở thành điểm tham chiếu.</p>
<h3>Quy tắc quyết định và lối tắt suy nghĩ</h3>
<p>Với quy tắc <strong>bù trừ</strong>, điểm yếu ở một thuộc tính có thể được bù bằng điểm mạnh ở thuộc tính khác (mô hình đa thuộc tính ở Phần 4). Quy tắc <strong>không bù trừ</strong> là lối tắt: <em>từ điển</em> (chọn thương hiệu tốt nhất ở thuộc tính quan trọng nhất), <em>loại trừ theo khía cạnh</em> (lần lượt loại các thương hiệu không đạt từng thuộc tính) và <em>kết hợp</em> (mọi thuộc tính đều phải vượt một ngưỡng tối thiểu). Người tiêu dùng còn dựa vào <strong>lối tắt suy nghĩ</strong> — "đắt hơn thì tốt hơn", "thương hiệu nổi tiếng thì an toàn hơn", tín hiệu xuất xứ. Chúng giúp tiết kiệm công sức nhưng có thể dẫn tới sai lầm.</p>
<h3>Tình huống mua</h3>
<p>Các biến tình huống (Belk) định hình lựa chọn cuối cùng: <em>môi trường vật chất</em> (bố cục cửa hàng, âm nhạc, mùi hương, ánh sáng — <strong>bầu không khí cửa hàng</strong>), <em>môi trường xã hội</em> (đi mua cùng bạn bè), <em>thời gian</em> (áp lực thời gian), <em>mục đích mua</em> (mua cho mình hay làm quà) và <em>trạng thái trước đó</em> (tâm trạng, mệt mỏi, đói). <strong>Mua bốc đồng</strong> — thôi thúc đột ngột, mạnh mẽ muốn mua ngay — được tiếp sức bởi quầy trưng bày tại điểm bán, ưu đãi có thời hạn và thanh toán một chạm.</p>
<h3>Sau mua: hài lòng, bất hoà và thải bỏ</h3>
<ul>
<li><strong>Mô hình bất xác nhận kỳ vọng</strong>: sự hài lòng phụ thuộc vào hiệu quả sử dụng so với kỳ vọng. Vượt kỳ vọng (bất xác nhận tích cực) tạo sự thích thú; dưới kỳ vọng (bất xác nhận tiêu cực) gây thất vọng. Vì vậy quảng cáo hứa quá mức có thể làm giảm sự hài lòng.</li>
<li><strong>Bất hoà nhận thức</strong> sau một lần mua quan trọng được giảm bằng sự trấn an: bảo hành, tin nhắn chăm sóc, đổi trả dễ dàng.</li>
<li><strong>Thải bỏ</strong>: giữ lại, cho đi, bán lại, tái chế hoặc vứt bỏ. Nền tảng bán lại và chợ đồ cũ (<em>tái lưu thông ngang</em>) cùng việc dùng chung đồ vật (<em>tiêu dùng cộng tác</em>) là những phần đang lớn dần của hành vi người tiêu dùng.</li>
</ul>
<div class="callout"><span class="badge">Hàm ý marketing</span> Một thương hiệu nằm ngoài tập cân nhắc thì không bao giờ được đem thuộc tính ra so sánh. Ở nhiều loại sản phẩm, trận chiến đầu tiên chỉ đơn giản là được nhớ tới và được tìm thấy đúng lúc.</div>`,
  ]]);

const c1q = quiz('mkt201-quiz-1', 'Quiz 1 — Involvement & decision making|||Quiz 1 — Mức độ liên quan & ra quyết định', [
  { id: 'q1', question: 'A shopper buys the same toothpaste every month without thinking, and switches immediately when a rival offers a small discount. This pattern is best described as…|||Một người mua cùng một loại kem đánh răng mỗi tháng mà không suy nghĩ, và đổi ngay khi đối thủ giảm giá chút ít. Hành vi này được mô tả đúng nhất là…', options: ['brand loyalty|||lòng trung thành thương hiệu', 'extended problem solving|||giải quyết vấn đề mở rộng', 'inertia|||quán tính', 'cognitive dissonance|||bất hoà nhận thức'], correctIndex: 2, explanation: 'Repeat buying without commitment is inertia; a loyal customer would hold a strong positive attitude and resist the rival offer.|||Mua lặp lại mà không có sự gắn bó là quán tính; khách trung thành sẽ có thái độ tích cực mạnh và cưỡng lại ưu đãi của đối thủ.' },
  { id: 'q2', question: 'The small group of brands a consumer seriously considers before choosing is called the…|||Nhóm nhỏ các thương hiệu mà người tiêu dùng xem xét nghiêm túc trước khi chọn được gọi là…', options: ['consideration set|||tập cân nhắc', 'inept set|||tập loại bỏ', 'inert set|||tập thờ ơ', 'awareness set|||tập nhận biết'], correctIndex: 0, explanation: 'The inept set contains rejected brands, the inert set brands the consumer is indifferent to, and the awareness set every known brand.|||Tập loại bỏ gồm thương hiệu bị từ chối, tập thờ ơ gồm thương hiệu không gây cảm xúc, còn tập nhận biết gồm mọi thương hiệu đã biết.' },
  { id: 'q3', question: 'According to the expectancy disconfirmation model, a customer is most likely to be dissatisfied when…|||Theo mô hình bất xác nhận kỳ vọng, khách hàng dễ không hài lòng nhất khi…', options: ['the product is cheap|||sản phẩm rẻ', 'performance falls below what the advertising led them to expect|||hiệu quả sử dụng thấp hơn điều quảng cáo khiến họ kỳ vọng', 'they searched for a long time before buying|||họ tìm kiếm rất lâu trước khi mua', 'the brand has a strong personality|||thương hiệu có tính cách mạnh'], correctIndex: 1, explanation: 'Satisfaction is judged relative to expectations: negative disconfirmation, often caused by overpromising, creates dissatisfaction.|||Sự hài lòng được đánh giá so với kỳ vọng: bất xác nhận tiêu cực, thường do hứa quá mức, gây ra sự không hài lòng.' },
]);

const c3 = doc('mkt201-2-1-perception', '2.1 — Perception: sensation, thresholds, attention & interpretation|||2.1 — Nhận thức: cảm giác, ngưỡng, sự chú ý & diễn giải',
  'Cảm giác và nhận thức, quá trình nhận thức, marketing giác quan, ngưỡng tuyệt đối, ngưỡng khác biệt JND và định luật Weber, nhận thức dưới ngưỡng, chú ý có chọn lọc, diễn giải: lược đồ, mồi, nguyên tắc Gestalt, ký hiệu học.',
  [[
    `<span class="eyebrow">MKT201 · Part 2 · Lesson 2.1</span>
<h2>Perception: sensation, thresholds, attention &amp; interpretation</h2>
<p class="lead"><strong>Sensation</strong> is the immediate response of our sensory receptors (eyes, ears, nose, mouth, skin) to basic stimuli such as light, colour, sound, odour and texture. <strong>Perception</strong> is the process by which people select, organize and interpret these sensations. Marketing lives in perception: two people can see the same ad and understand different things.</p>
<h3>The perceptual process</h3>
<pre><code>Stimuli (sights, sounds, smells, tastes, textures)
  → Exposure       (stimuli reach the senses)
  → Attention      (mental resources go to some of them)
  → Interpretation (meaning is assigned)
  → Response and memory</code></pre>
<h3>Sensory marketing</h3>
<p>Firms use the five senses deliberately: <strong>vision</strong> (colour associations differ across cultures), <strong>sound</strong> (jingles, sonic logos, the tempo of in-store music), <strong>smell</strong> (scents are closely tied to emotions and memories), <strong>touch</strong> (the weight of a phone, the texture of packaging) and <strong>taste</strong> (sampling). Sensory marketing aims to make the brand experience multisensory and memorable.</p>
<h3>Thresholds</h3>
<ul>
<li><strong>Absolute threshold</strong>: the minimum amount of stimulation that can be detected on a sensory channel — for example, whether a billboard's text is readable from a moving car.</li>
<li><strong>Differential threshold</strong>: the ability to detect a change or difference between two stimuli. The minimum detectable change is the <strong>just noticeable difference (JND)</strong>. In psychophysics a threshold is usually defined as the level detected 50% of the time.</li>
<li><strong>Weber's law</strong>: the stronger the initial stimulus, the larger the change needed for it to be noticed: ΔI / I = k, where I is the initial intensity, ΔI the JND and k a constant that differs by sense, product and person.</li>
</ul>
<pre><code>Illustrative: if k = 0.10 for price, a VND 20,000 drink needs a cut of about
0.10 x 20,000 = VND 2,000 before roughly half of customers notice it; a
VND 20,000,000 motorbike needs about 0.10 x 20,000,000 = VND 2,000,000.</code></pre>
<p>Marketers use the JND in two directions: they keep unfavourable or identity-threatening changes (a small price rise, gradual updates of a logo that must stay recognizable) <em>below</em> the JND, and they make favourable changes (discounts, product improvements) clearly <em>above</em> it. Deliberately hiding a worse deal below the JND — for example shrinking a pack without saying so — raises ethical and trust problems (Part 5).</p>
<h3>Subliminal perception</h3>
<p>Subliminal perception refers to stimuli below the level of conscious awareness. Despite popular myths, there is little evidence that hidden messages make people buy things they do not want; the famous 1957 cinema "study" ("eat popcorn") was never replicated and its promoter later admitted it was a gimmick. Effective marketing works <em>above</em> the threshold.</p>
<h3>Attention</h3>
<p>Consumers are exposed to far more messages than they can process (<strong>sensory overload</strong>, advertising clutter), so they practise <strong>perceptual selection</strong>: <em>perceptual vigilance</em> (noticing stimuli related to current needs — you suddenly see laptop ads everywhere when you need one), <em>perceptual defense</em> (screening out threatening or uncomfortable information) and <em>adaptation</em> (no longer noticing a familiar stimulus). Stimuli win attention through size, colour, position, novelty, contrast and movement.</p>
<h3>Interpretation</h3>
<p>Meaning depends on the consumer's <strong>schema</strong> — the organized set of beliefs a stimulus activates — and on <strong>priming</strong> (earlier cues shape how later ones are read). The Gestalt principles describe how people organize stimuli into wholes: <em>closure</em> (completing incomplete figures), <em>similarity</em> (grouping similar-looking objects — the basis of look-alike packaging) and <em>figure–ground</em> (one part dominates while the rest recedes into the background). <strong>Semiotics</strong> studies how signs carry meaning: a brand's logo, colours and mascot are signs that consumers decode.</p>
<div class="callout"><span class="badge">Remember</span> For the consumer, reality is what they perceive. A product improvement nobody notices, or a message nobody attends to, has no effect in the market.</div>`,
    `<span class="eyebrow">MKT201 · Phần 2 · Bài 2.1</span>
<h2>Nhận thức: cảm giác, ngưỡng, sự chú ý &amp; diễn giải</h2>
<p class="lead"><strong>Cảm giác</strong> là phản ứng tức thời của các cơ quan thụ cảm (mắt, tai, mũi, miệng, da) với những kích thích cơ bản như ánh sáng, màu sắc, âm thanh, mùi và kết cấu bề mặt. <strong>Nhận thức</strong> (tri giác — perception) là quá trình con người chọn lọc, sắp xếp và diễn giải các cảm giác đó. Marketing sống trong nhận thức: hai người xem cùng một quảng cáo có thể hiểu hai điều khác nhau. Lưu ý thuật ngữ: trong Phần 2, "nhận thức" nghĩa là tri giác (perception); còn "nhận thức" trong học nhận thức, bất hoà nhận thức và mô hình ABC (Phần 4) là cognition — suy nghĩ, niềm tin.</p>
<h3>Quá trình nhận thức</h3>
<pre><code>Kích thích (hình ảnh, âm thanh, mùi, vị, kết cấu)
  → Tiếp xúc   (kích thích chạm tới giác quan)
  → Chú ý      (nguồn lực tinh thần dành cho một số kích thích)
  → Diễn giải  (gán ý nghĩa)
  → Phản ứng và ghi nhớ</code></pre>
<h3>Marketing giác quan</h3>
<p>Doanh nghiệp chủ động dùng năm giác quan: <strong>thị giác</strong> (liên tưởng về màu sắc khác nhau giữa các nền văn hoá), <strong>thính giác</strong> (nhạc hiệu, logo âm thanh, nhịp nhạc trong cửa hàng), <strong>khứu giác</strong> (mùi hương gắn chặt với cảm xúc và ký ức), <strong>xúc giác</strong> (độ nặng của chiếc điện thoại, chất liệu bao bì) và <strong>vị giác</strong> (cho dùng thử). Marketing giác quan nhằm làm cho trải nghiệm thương hiệu đa giác quan và dễ nhớ.</p>
<h3>Các ngưỡng</h3>
<ul>
<li><strong>Ngưỡng tuyệt đối</strong>: lượng kích thích nhỏ nhất có thể nhận ra trên một kênh giác quan — ví dụ chữ trên biển quảng cáo có đọc được từ một chiếc xe đang chạy hay không.</li>
<li><strong>Ngưỡng khác biệt</strong>: khả năng nhận ra một thay đổi hay khác biệt giữa hai kích thích. Thay đổi nhỏ nhất nhận ra được là <strong>khác biệt vừa đủ nhận biết (JND)</strong>. Trong tâm vật lý học, ngưỡng thường được định nghĩa là mức được nhận ra trong 50% số lần.</li>
<li><strong>Định luật Weber</strong>: kích thích ban đầu càng mạnh thì thay đổi cần thiết để được nhận ra càng lớn: ΔI / I = k, trong đó I là cường độ ban đầu, ΔI là JND và k là hằng số khác nhau theo giác quan, sản phẩm và từng người.</li>
</ul>
<pre><code>Minh hoạ: nếu k = 0,10 với giá, một ly nước 20.000 đồng cần giảm khoảng
0,10 x 20.000 = 2.000 đồng thì mới có khoảng một nửa số khách nhận ra; một chiếc
xe máy 20.000.000 đồng cần khoảng 0,10 x 20.000.000 = 2.000.000 đồng.</code></pre>
<p>Người làm marketing dùng JND theo hai chiều: giữ những thay đổi bất lợi hoặc đe doạ nhận diện (tăng giá nhẹ, cập nhật dần một logo cần giữ được sự nhận diện) ở <em>dưới</em> JND, và làm cho thay đổi có lợi (giảm giá, cải tiến sản phẩm) nằm rõ ràng <em>trên</em> JND. Cố ý giấu một điều kiện kém đi dưới JND — ví dụ thu nhỏ gói hàng mà không nói ra — gây ra vấn đề đạo đức và niềm tin (Phần 5).</p>
<h3>Nhận thức dưới ngưỡng</h3>
<p>Nhận thức dưới ngưỡng là các kích thích nằm dưới mức nhận biết có ý thức. Trái với nhiều lời đồn, có rất ít bằng chứng rằng thông điệp ẩn khiến người ta mua thứ họ không muốn; "nghiên cứu" nổi tiếng trong rạp chiếu phim năm 1957 ("hãy ăn bỏng ngô") chưa từng được lặp lại và người quảng bá nó sau này thừa nhận đó chỉ là chiêu trò. Marketing hiệu quả hoạt động ở <em>trên</em> ngưỡng.</p>
<h3>Sự chú ý</h3>
<p>Người tiêu dùng tiếp xúc với nhiều thông điệp hơn hẳn khả năng xử lý (<strong>quá tải giác quan</strong>, quảng cáo nhiễu loạn), nên họ thực hiện <strong>chọn lọc tri giác</strong>: <em>cảnh giác tri giác</em> (để ý các kích thích liên quan tới nhu cầu hiện tại — khi cần mua máy tính, bạn bỗng thấy quảng cáo máy tính ở khắp nơi), <em>phòng vệ tri giác</em> (gạt bỏ thông tin đe doạ hoặc gây khó chịu) và <em>thích nghi</em> (không còn để ý tới một kích thích quen thuộc). Kích thích giành được sự chú ý nhờ kích thước, màu sắc, vị trí, sự mới lạ, độ tương phản và chuyển động.</p>
<h3>Diễn giải</h3>
<p>Ý nghĩa phụ thuộc vào <strong>lược đồ</strong> (schema) của người tiêu dùng — tập niềm tin có tổ chức mà một kích thích gợi lên — và vào <strong>hiệu ứng mồi</strong> (priming: tín hiệu trước định hướng cách hiểu tín hiệu sau). Các nguyên tắc Gestalt mô tả cách con người sắp xếp kích thích thành tổng thể: <em>khép kín</em> (tự hoàn thiện hình chưa đầy đủ), <em>tương đồng</em> (gom các vật trông giống nhau thành nhóm — cơ sở của bao bì "nhái dáng") và <em>hình – nền</em> (một phần nổi bật, phần còn lại lùi thành nền). <strong>Ký hiệu học</strong> nghiên cứu cách các dấu hiệu mang ý nghĩa: logo, màu sắc và linh vật của thương hiệu là những dấu hiệu mà người tiêu dùng giải mã.</p>
<div class="callout"><span class="badge">Ghi nhớ</span> Với người tiêu dùng, thực tế là điều họ nhận thức được. Một cải tiến sản phẩm không ai nhận ra, hay một thông điệp không ai chú ý, thì không tạo ra tác động nào trên thị trường.</div>`,
  ]]);

const c4 = doc('mkt201-2-2-learning-memory', '2.2 — Learning & memory|||2.2 — Học hỏi & trí nhớ',
  'Điều kiện hoá cổ điển (khái quát hoá và phân biệt kích thích), điều kiện hoá thao tác (củng cố, trừng phạt, lịch củng cố, định hình), học nhận thức và học qua quan sát, trí nhớ: mã hoá – lưu trữ – truy xuất, mạng liên tưởng, nhận ra và hồi tưởng.',
  [[
    `<span class="eyebrow">MKT201 · Part 2 · Lesson 2.2</span>
<h2>Learning &amp; memory</h2>
<p class="lead"><strong>Learning</strong> is a relatively permanent change in behavior caused by experience. Consumers learn which brands satisfy, which logos signal quality and which apps reward them — often without trying to learn at all.</p>
<h3>Classical conditioning (Pavlov)</h3>
<p>A stimulus that naturally produces a response (the <strong>unconditioned stimulus</strong>, UCS) is repeatedly paired with a neutral stimulus (the <strong>conditioned stimulus</strong>, CS) until the CS alone produces a similar <strong>conditioned response</strong>. Pairing a brand (CS) with pleasant music, beautiful scenery or a loved celebrity (UCS) can transfer positive feelings to the brand. Conditioning works best when the CS comes <em>before</em> the UCS, with repetition, and for new or unfamiliar brands.</p>
<ul>
<li><strong>Extinction</strong>: the learned link fades when the pairing stops.</li>
<li><strong>Stimulus generalization</strong>: similar stimuli trigger similar responses — the logic behind family branding, licensing and look-alike packaging by store brands.</li>
<li><strong>Stimulus discrimination</strong>: consumers learn to respond differently to similar stimuli — "look for the original".</li>
</ul>
<h3>Instrumental (operant) conditioning (Skinner)</h3>
<p>People learn to repeat behaviors that bring positive outcomes and to avoid those that bring negative ones.</p>
<table>
<tr><th>Mechanism</th><th>What happens</th><th>Marketing example</th></tr>
<tr><td>Positive reinforcement</td><td>A reward follows the behavior</td><td>Loyalty points, a thank-you gift</td></tr>
<tr><td>Negative reinforcement</td><td>An unpleasant state is removed or avoided</td><td>A deodorant ad showing the embarrassment the product helps you avoid</td></tr>
<tr><td>Punishment</td><td>An unpleasant outcome follows</td><td>A late-payment fee</td></tr>
<tr><td>Extinction</td><td>No outcome follows, so the behavior fades</td><td>A loyalty program whose rewards quietly stop</td></tr>
</table>
<p><strong>Reinforcement schedules</strong>: <em>fixed-interval</em> (a reward after a set time, such as a monthly member sale), <em>variable-interval</em> (unpredictable timing, such as surprise rewards), <em>fixed-ratio</em> (after a set number of responses, "buy 9 coffees, get the 10th free") and <em>variable-ratio</em> (after an unpredictable number of responses, such as lucky draws and slot machines). Variable-ratio schedules produce high response rates and behavior that is very resistant to extinction. <em>Shaping</em> rewards intermediate steps (a free trial, then a discounted first month). Streaks, badges and spin-the-wheel games in apps apply these principles.</p>
<h3>Cognitive learning</h3>
<p>Cognitive theories stress internal mental processes: people actively use information to solve problems. In <strong>observational learning</strong> (modeling, associated with Bandura), consumers watch others and the consequences of their behavior, then imitate — one reason testimonials and unboxing videos work. Modeling requires attention to the model, retention in memory, the ability to perform the behavior and the motivation to do so.</p>
<h3>Memory</h3>
<pre><code>Encoding  → information enters memory (linked to what we already know)
Storage   → sensory memory (a second or so) → short-term memory (limited
            capacity, helped by grouping into "chunks") → long-term memory
Retrieval → information is recalled or recognized when needed</code></pre>
<p>Long-term memory is organized as an <strong>associative network</strong>: nodes (brands, attributes, feelings, places) connected by links; activating one node spreads activation to related ones (<em>spreading activation</em>). Retrieval improves with familiarity, <em>salience</em> (prominence), pictures, and a match between the setting at learning and at retrieval; it suffers from <em>interference</em> when similar competing ads blur together. Personal, <em>episodic</em> memories feed <strong>nostalgia</strong> marketing — retro packaging, reissued products.</p>
<p>Marketers measure memory by <strong>recognition</strong> ("Have you seen this ad before?") and <strong>recall</strong> ("Which milk-tea brands do you remember seeing?"). Recall is harder; recognition matters most when the choice happens in front of a shelf or a product list.</p>
<div class="callout"><span class="badge">Marketing implication</span> Consistent brand cues — colour, sound, character, slogan — repeated across touchpoints build strong memory links. Changing them every season resets the learning you paid for.</div>`,
    `<span class="eyebrow">MKT201 · Phần 2 · Bài 2.2</span>
<h2>Học hỏi &amp; trí nhớ</h2>
<p class="lead"><strong>Học hỏi</strong> là sự thay đổi tương đối bền vững trong hành vi do trải nghiệm tạo ra. Người tiêu dùng học được thương hiệu nào làm họ hài lòng, logo nào báo hiệu chất lượng, ứng dụng nào thưởng cho họ — thường là hoàn toàn không chủ ý học.</p>
<h3>Điều kiện hoá cổ điển (Pavlov)</h3>
<p>Một kích thích tự nhiên gây ra phản ứng (<strong>kích thích không điều kiện</strong>, UCS) được lặp lại nhiều lần cùng một kích thích trung tính (<strong>kích thích có điều kiện</strong>, CS) cho tới khi riêng CS cũng tạo ra một <strong>phản ứng có điều kiện</strong> tương tự. Ghép thương hiệu (CS) với âm nhạc dễ chịu, cảnh đẹp hay người nổi tiếng được yêu mến (UCS) có thể chuyển cảm xúc tích cực sang thương hiệu. Điều kiện hoá hiệu quả nhất khi CS xuất hiện <em>trước</em> UCS, được lặp lại, và với thương hiệu mới hoặc còn lạ.</p>
<ul>
<li><strong>Dập tắt</strong>: liên kết đã học mờ dần khi việc ghép cặp dừng lại.</li>
<li><strong>Khái quát hoá kích thích</strong>: kích thích tương tự gây ra phản ứng tương tự — logic của thương hiệu gia đình, cấp phép thương hiệu và bao bì "nhái dáng" của nhãn hàng riêng.</li>
<li><strong>Phân biệt kích thích</strong>: người tiêu dùng học cách phản ứng khác nhau với các kích thích giống nhau — "hãy tìm hàng chính hãng".</li>
</ul>
<h3>Điều kiện hoá thao tác (Skinner)</h3>
<p>Con người học cách lặp lại hành vi mang lại kết quả tích cực và tránh hành vi mang lại kết quả tiêu cực.</p>
<table>
<tr><th>Cơ chế</th><th>Điều gì xảy ra</th><th>Ví dụ marketing</th></tr>
<tr><td>Củng cố tích cực</td><td>Phần thưởng đi sau hành vi</td><td>Điểm tích luỹ, quà cảm ơn</td></tr>
<tr><td>Củng cố tiêu cực</td><td>Một trạng thái khó chịu được loại bỏ hoặc tránh được</td><td>Quảng cáo lăn khử mùi cho thấy sự ngượng ngùng mà sản phẩm giúp bạn tránh</td></tr>
<tr><td>Trừng phạt</td><td>Một kết quả khó chịu đi sau hành vi</td><td>Phí trả chậm</td></tr>
<tr><td>Dập tắt</td><td>Không có kết quả nào đi sau, hành vi mờ dần</td><td>Chương trình khách hàng thân thiết âm thầm ngừng thưởng</td></tr>
</table>
<p><strong>Lịch củng cố</strong>: <em>cố định theo thời gian</em> (thưởng sau một khoảng thời gian định sẵn, như đợt giảm giá hội viên hằng tháng), <em>biến đổi theo thời gian</em> (thời điểm không đoán trước, như phần thưởng bất ngờ), <em>cố định theo số lần</em> (sau một số lần phản ứng định sẵn, "mua 9 ly cà phê, tặng ly thứ 10") và <em>biến đổi theo số lần</em> (sau một số lần không đoán trước, như bốc thăm may mắn và máy đánh bạc). Lịch biến đổi theo số lần tạo ra tần suất phản ứng cao và hành vi rất khó bị dập tắt. <em>Định hình hành vi</em> thưởng cho các bước trung gian (dùng thử miễn phí, rồi giảm giá tháng đầu). Chuỗi ngày liên tiếp, huy hiệu và vòng quay may mắn trong ứng dụng đều áp dụng các nguyên tắc này.</p>
<h3>Học nhận thức</h3>
<p>Các lý thuyết nhận thức nhấn mạnh quá trình tinh thần bên trong: con người chủ động dùng thông tin để giải quyết vấn đề. Trong <strong>học qua quan sát</strong> (học theo hình mẫu — modeling, gắn với Bandura), người tiêu dùng quan sát người khác và hệ quả hành vi của họ rồi bắt chước — một lý do khiến lời chứng thực và video đập hộp có hiệu quả. Học theo hình mẫu đòi hỏi chú ý tới hình mẫu, lưu giữ trong trí nhớ, có khả năng thực hiện hành vi và có động lực làm theo.</p>
<h3>Trí nhớ</h3>
<pre><code>Mã hoá     → thông tin đi vào trí nhớ (gắn với điều ta đã biết)
Lưu trữ    → trí nhớ giác quan (khoảng một giây) → trí nhớ ngắn hạn (dung lượng
             hạn chế, được hỗ trợ bằng cách gom thành "cụm") → trí nhớ dài hạn
Truy xuất  → thông tin được nhớ lại hoặc nhận ra khi cần</code></pre>
<p>Trí nhớ dài hạn được tổ chức thành <strong>mạng liên tưởng</strong>: các nút (thương hiệu, thuộc tính, cảm xúc, địa điểm) nối với nhau bằng liên kết; kích hoạt một nút sẽ lan sang các nút liên quan (<em>lan toả kích hoạt</em>). Việc truy xuất tốt hơn nhờ sự quen thuộc, <em>độ nổi bật</em>, hình ảnh, và sự trùng khớp giữa bối cảnh lúc học và lúc nhớ lại; nó kém đi do <em>nhiễu</em> khi các quảng cáo cạnh tranh giống nhau bị trộn lẫn. Những ký ức cá nhân (<em>trí nhớ tình tiết</em> — episodic memory, ký ức về những sự kiện mình đã trải qua) nuôi dưỡng marketing <strong>hoài niệm</strong> — bao bì cổ điển, sản phẩm tái phát hành.</p>
<p>Người làm marketing đo trí nhớ bằng <strong>nhận ra</strong> ("Bạn đã từng thấy quảng cáo này chưa?") và <strong>hồi tưởng</strong> ("Bạn nhớ đã thấy những thương hiệu trà sữa nào?"). Hồi tưởng khó hơn; nhận ra quan trọng nhất khi lựa chọn diễn ra trước kệ hàng hoặc danh sách sản phẩm.</p>
<div class="callout"><span class="badge">Hàm ý marketing</span> Tín hiệu thương hiệu nhất quán — màu sắc, âm thanh, nhân vật, khẩu hiệu — lặp lại ở mọi điểm chạm sẽ xây dựng liên kết trí nhớ mạnh. Đổi chúng mỗi mùa là xoá đi phần học mà bạn đã trả tiền để tạo ra.</div>`,
  ]]);

const c4e = doc('mkt201-2-3-exercise', 'Exercise 1 — Weber’s law and the just noticeable difference|||Bài tập 1 — Định luật Weber và khác biệt vừa đủ nhận biết (JND)',
  'Bài tập tình huống giả định: dùng định luật Weber với hằng số k giả định để tính mức giảm giá tối thiểu khách nhận ra, so sánh hai chương trình giảm giá, xử lý một đợt tăng giá và phân tích việc thu nhỏ gói hàng (đơn giá ẩn tăng); kèm lời giải và bàn về đạo đức.',
  [[
    `<span class="eyebrow">MKT201 · Part 2 · Exercise</span>
<h2>Exercise 1 — how big must a change be to be noticed?</h2>
<div class="callout"><span class="badge">Problem</span> A convenience-store chain (a fictional case) estimates from earlier promotion tests that, for its customers, the Weber constant is k = 0.10 for price and k = 0.05 for pack weight (illustrative numbers). (a) A snack sells at VND 40,000. What is the smallest price cut customers are likely to notice, and what cut would you choose if you want most customers to notice it? (b) Promotion A takes VND 5,000 off a VND 50,000 item; promotion B takes VND 100,000 off a VND 2,000,000 rice cooker. Which cut is more likely to be noticed? (c) Rising costs force a price increase on a VND 250,000 product. Compute the JND and explain how to handle an increase below and above it. (d) A 500 g pack of dried fruit sells at VND 60,000. The firm considers cutting it to 480 g at the same price. Will the change be noticed, and what happens to the unit price?</div>
<h3>Worked solution</h3>
<pre><code class="language-text">Weber's law: JND = k x I

(a) JND = 0.10 x 40,000 = VND 4,000  → threshold price VND 36,000
    At the threshold only about half of customers notice (assuming the estimated k
    defines the change noticed by about half of customers), so choose a cut clearly above it, e.g. VND 6,000 (6,000 / 40,000 = 15%)
    → promotional price VND 34,000

(b) A: 5,000 / 50,000       = 10%   JND = 0.10 x 50,000    = 5,000    → at the threshold
    B: 100,000 / 2,000,000  =  5%   JND = 0.10 x 2,000,000 = 200,000  → below the JND
    B is 20 times larger in VND but only half as large in relative terms.

(c) JND = 0.10 x 250,000 = VND 25,000
    +20,000 (8%)  → below the JND: many customers will not notice
    +30,000 (12%) → above the JND: noticed, so explain the reason and the value

(d) Weight JND = 0.05 x 500 g = 25 g; a 20 g cut is below it → likely unnoticed
    Unit price: 60,000 / 500 = VND 120 per g  →  60,000 / 480 = VND 125 per g
    Hidden unit-price increase = 125 / 120 − 1 = 4.17%</code></pre>
<p><strong>Why:</strong> Weber's law is about <em>relative</em> change, so the same amount of money means a lot on a cheap item and little on an expensive one — promotion B would need about VND 200,000 just to reach the threshold. The constant k is not universal: it must be estimated for each category and customer group by testing, and the values here are assumptions. Keeping a cost-driven price rise below the JND is common practice, but case (d) crosses an ethical line if it is meant to hide a worse deal: the true net quantity must be printed on the label (Vietnam's goods-labelling rules require it — check the regulation currently in force), shoppers who compare unit prices will discover it, and "shrinkflation" stories damage trust far more than an honest, explained price increase.</p>`,
    `<span class="eyebrow">MKT201 · Phần 2 · Bài tập</span>
<h2>Bài tập 1 — thay đổi phải lớn tới đâu mới được nhận ra?</h2>
<div class="callout"><span class="badge">Đề</span> Một chuỗi cửa hàng tiện lợi (tình huống giả định) ước tính từ các lần thử khuyến mãi trước rằng, với khách hàng của mình, hằng số Weber là k = 0,10 với giá và k = 0,05 với khối lượng gói (số liệu minh hoạ giả định). (a) Một gói snack bán giá 40.000 đồng. Mức giảm giá nhỏ nhất khách có khả năng nhận ra là bao nhiêu, và bạn sẽ chọn giảm bao nhiêu nếu muốn phần lớn khách nhận ra? (b) Chương trình A giảm 5.000 đồng cho món hàng 50.000 đồng; chương trình B giảm 100.000 đồng cho nồi cơm điện 2.000.000 đồng. Mức giảm nào dễ được nhận ra hơn? (c) Chi phí tăng buộc phải tăng giá một sản phẩm 250.000 đồng. Tính JND và giải thích cách xử lý khi mức tăng nằm dưới và trên JND. (d) Một gói trái cây sấy 500 g bán 60.000 đồng. Doanh nghiệp tính giảm xuống 480 g với giá không đổi. Thay đổi này có bị nhận ra không, và đơn giá thay đổi thế nào?</div>
<h3>Lời giải</h3>
<pre><code class="language-text">Định luật Weber: JND = k x I

(a) JND = 0,10 x 40.000 = 4.000 đồng  → giá ngưỡng 36.000 đồng
    Ở đúng ngưỡng chỉ khoảng một nửa số khách nhận ra (giả định k ước tính là mức
    thay đổi được khoảng một nửa số khách nhận ra), nên chọn mức giảm rõ ràng cao hơn, vd 6.000 đồng (6.000 / 40.000 = 15%)
    → giá khuyến mãi 34.000 đồng

(b) A: 5.000 / 50.000       = 10%   JND = 0,10 x 50.000    = 5.000    → đúng ngưỡng
    B: 100.000 / 2.000.000  =  5%   JND = 0,10 x 2.000.000 = 200.000  → dưới JND
    B lớn gấp 20 lần tính bằng đồng nhưng chỉ bằng một nửa tính theo tỷ lệ.

(c) JND = 0,10 x 250.000 = 25.000 đồng
    +20.000 (8%)  → dưới JND: nhiều khách sẽ không nhận ra
    +30.000 (12%) → trên JND: sẽ bị nhận ra, nên giải thích lý do và giá trị

(d) JND khối lượng = 0,05 x 500 g = 25 g; giảm 20 g là dưới ngưỡng → khó bị nhận ra
    Đơn giá: 60.000 / 500 = 120 đồng/g  →  60.000 / 480 = 125 đồng/g
    Đơn giá tăng ngầm = 125 / 120 − 1 = 4,17%</code></pre>
<p><strong>Vì sao:</strong> định luật Weber nói về thay đổi <em>tương đối</em>, nên cùng một số tiền có ý nghĩa lớn với món hàng rẻ và nhỏ với món hàng đắt — chương trình B cần khoảng 200.000 đồng mới chạm tới ngưỡng. Hằng số k không phổ quát: phải ước tính cho từng loại sản phẩm và nhóm khách bằng thử nghiệm, và các giá trị ở đây là giả định. Giữ mức tăng giá do chi phí dưới JND là cách làm phổ biến, nhưng trường hợp (d) vượt qua ranh giới đạo đức nếu nhằm che giấu một điều kiện kém đi: định lượng thật phải được ghi trên nhãn (quy định về nhãn hàng hoá ở Việt Nam yêu cầu điều này — kiểm văn bản đang có hiệu lực), khách so sánh đơn giá sẽ phát hiện ra, và những câu chuyện "lạm phát thu nhỏ" (shrinkflation) làm tổn hại niềm tin hơn nhiều so với một đợt tăng giá trung thực có giải thích.</p>`,
  ]]);

const c4q = quiz('mkt201-quiz-2', 'Quiz 2 — Perception, learning & memory|||Quiz 2 — Nhận thức, học hỏi & trí nhớ', [
  { id: 'q1', question: 'For a product priced at VND 150,000, the Weber constant for price is assumed to be k = 0.20. What is the smallest price cut customers are likely to notice?|||Với sản phẩm giá 150.000 đồng, giả định hằng số Weber với giá là k = 0,20. Mức giảm giá nhỏ nhất khách có khả năng nhận ra là bao nhiêu?', options: ['VND 15,000|||15.000 đồng', 'VND 20,000|||20.000 đồng', 'VND 75,000|||75.000 đồng', 'VND 30,000|||30.000 đồng'], correctIndex: 3, explanation: 'JND = k x I = 0.20 x 150,000 = VND 30,000.|||JND = k x I = 0,20 x 150.000 = 30.000 đồng.' },
  { id: 'q2', question: 'A store brand copies the colours and shape of a leading brand’s packaging so shoppers transfer their positive feelings to it. This relies on…|||Một nhãn hàng riêng chép màu sắc và kiểu dáng bao bì của thương hiệu dẫn đầu để người mua chuyển cảm xúc tích cực sang nó. Cách này dựa vào…', options: ['stimulus discrimination|||phân biệt kích thích', 'stimulus generalization|||khái quát hoá kích thích', 'extinction|||dập tắt', 'negative reinforcement|||củng cố tiêu cực'], correctIndex: 1, explanation: 'Stimulus generalization means similar stimuli trigger similar responses; discrimination is the opposite skill of telling them apart.|||Khái quát hoá kích thích nghĩa là kích thích tương tự gây phản ứng tương tự; phân biệt kích thích là kỹ năng ngược lại — nhận ra chúng khác nhau.' },
  { id: 'q3', question: 'Which reinforcement schedule produces behavior that is most resistant to extinction, as in lucky draws?|||Lịch củng cố nào tạo ra hành vi khó bị dập tắt nhất, như trong bốc thăm may mắn?', options: ['Variable-ratio|||Biến đổi theo số lần', 'Fixed-interval|||Cố định theo thời gian', 'Fixed-ratio|||Cố định theo số lần', 'No reinforcement|||Không củng cố'], correctIndex: 0, explanation: 'When the reward comes after an unpredictable number of responses, people keep responding because the next try might pay off.|||Khi phần thưởng đến sau một số lần không đoán trước, người ta tiếp tục phản ứng vì lần tiếp theo có thể trúng.' },
]);

const c5 = doc('mkt201-3-1-motivation-values', '3.1 — Motivation, values & means–end chains|||3.1 — Động cơ, giá trị & chuỗi phương tiện – mục đích',
  'Quá trình động cơ, nhu cầu thực dụng và hưởng thụ, nhu cầu thành tích – liên kết – quyền lực, ba loại xung đột động cơ, giá trị cứu cánh và giá trị công cụ (Rokeach), LOV, lý thuyết Schwartz, chuỗi phương tiện – mục đích, kỹ thuật bậc thang và mô hình MECCAs.',
  [[
    `<span class="eyebrow">MKT201 · Part 3 · Lesson 3.1</span>
<h2>Motivation, values &amp; means–end chains</h2>
<p class="lead"><strong>Motivation</strong> is the process that leads people to behave as they do. It starts when a need is aroused: the gap between the present and the desired state creates <strong>tension</strong>, and the <strong>drive</strong> to reduce that tension pushes the person toward a <strong>goal</strong> — a product, a service or an experience.</p>
<h3>Needs and their strength</h3>
<ul>
<li><strong>Utilitarian</strong> needs seek functional, practical benefits (a laptop's battery life); <strong>hedonic</strong> needs seek experiential and emotional benefits (fun, excitement, self-confidence). Most products serve both.</li>
<li><em>Biogenic</em> needs (food, water, shelter) are innate; <em>psychogenic</em> needs (status, power, belonging) are learned within a culture. McClelland's well-known social needs are <strong>achievement</strong>, <strong>affiliation</strong> and <strong>power</strong>; consumers also show a <strong>need for uniqueness</strong>.</li>
<li>Maslow's hierarchy (MKT101) is a useful starting point, but people pursue several levels at once and priorities differ across cultures and situations — a gift can serve social belonging and esteem at the same time.</li>
</ul>
<h3>Motivational conflicts</h3>
<table>
<tr><th>Conflict</th><th>Situation</th><th>Marketing response</th></tr>
<tr><td>Approach–approach</td><td>Choosing between two desirable options (a holiday or a new phone)</td><td>Bundle both, or reassure after the choice to reduce <strong>cognitive dissonance</strong></td></tr>
<tr><td>Approach–avoidance</td><td>A desired option with negative consequences (a tasty but high-sugar drink; stylish but expensive shoes)</td><td>Remove the negative: "less sugar", instalment payments, sustainable materials</td></tr>
<tr><td>Avoidance–avoidance</td><td>Choosing between two undesirable options (repair an old laptop or pay for a new one)</td><td>Stress the benefit of the less painful option: trade-in credit, extended warranty</td></tr>
</table>
<h3>Consumer values</h3>
<p>A <strong>value</strong> is a belief that some condition is preferable to its opposite (freedom rather than constraint). Values are few, stable and central to the self, so products linked to them become highly involving.</p>
<ul>
<li><strong>Rokeach Value Survey</strong>: <em>terminal values</em> are desired end-states (a comfortable life, freedom, family security); <em>instrumental values</em> are ways of reaching them (being ambitious, honest, capable).</li>
<li><strong>List of Values (LOV)</strong>, developed by Kahle for consumer research: a short list such as self-respect, security, warm relationships with others, a sense of belonging, fun and enjoyment in life.</li>
<li><strong>Schwartz's theory</strong>: ten basic values arranged in a circle; neighbouring values are compatible and opposite ones conflict — for example openness to change (self-direction, stimulation) versus conservation (security, conformity, tradition).</li>
</ul>
<h3>Means–end chains and laddering</h3>
<p>The <strong>means–end chain</strong> model (Gutman) says that product attributes matter because they lead to consequences that help consumers reach their values:</p>
<pre><code>Attribute → Functional consequence → Psychosocial consequence → Value
(a fictional e-scooter)
Light frame (8 kg) → easy to carry up to a dorm room → I don't need anyone's help
  → Freedom / self-direction</code></pre>
<p><strong>Laddering</strong> interviews uncover these chains by repeatedly asking "Why is that important to you?". The results are summarized in a hierarchical value map that guides advertising. The <strong>MECCAs</strong> model (Means–End Conceptualization of Components for Advertising Strategy) turns a ladder into message elements: the product attributes to mention, the consumer benefit, the executional framework (the ad's style and scenario), the leverage point (how the ad links the benefit to the value) and the driving force (the value itself).</p>
<div class="callout"><span class="badge">Marketing implication</span> Sell the whole ladder, not just the bottom rung: "8 kg" becomes persuasive when the ad shows the consequence and the value it serves — "go anywhere on your own".</div>`,
    `<span class="eyebrow">MKT201 · Phần 3 · Bài 3.1</span>
<h2>Động cơ, giá trị &amp; chuỗi phương tiện – mục đích</h2>
<p class="lead"><strong>Động cơ</strong> là quá trình khiến con người hành động như họ vẫn hành động. Nó bắt đầu khi một nhu cầu được khơi dậy: khoảng cách giữa trạng thái hiện tại và trạng thái mong muốn tạo ra <strong>sự căng thẳng</strong>, và <strong>động lực</strong> giảm căng thẳng đó đẩy người ta hướng tới một <strong>mục tiêu</strong> — một sản phẩm, dịch vụ hay trải nghiệm.</p>
<h3>Các nhu cầu và cường độ của chúng</h3>
<ul>
<li>Nhu cầu <strong>thực dụng</strong> tìm kiếm lợi ích chức năng, thiết thực (thời lượng pin của máy tính); nhu cầu <strong>hưởng thụ</strong> tìm kiếm lợi ích trải nghiệm và cảm xúc (niềm vui, sự phấn khích, sự tự tin). Phần lớn sản phẩm phục vụ cả hai.</li>
<li>Nhu cầu <em>sinh học</em> (ăn, uống, chỗ ở) là bẩm sinh; nhu cầu <em>tâm lý</em> (địa vị, quyền lực, sự thuộc về) được học trong một nền văn hoá. Ba nhu cầu xã hội nổi tiếng của McClelland là <strong>thành tích</strong>, <strong>liên kết</strong> và <strong>quyền lực</strong>; người tiêu dùng còn có <strong>nhu cầu khác biệt</strong>.</li>
<li>Tháp nhu cầu Maslow (MKT101) là điểm xuất phát hữu ích, nhưng con người theo đuổi nhiều tầng cùng lúc và thứ tự ưu tiên khác nhau giữa các nền văn hoá và tình huống — một món quà có thể phục vụ đồng thời nhu cầu thuộc về và nhu cầu được tôn trọng.</li>
</ul>
<h3>Xung đột động cơ</h3>
<table>
<tr><th>Xung đột</th><th>Tình huống</th><th>Cách marketing ứng phó</th></tr>
<tr><td>Tiếp cận – tiếp cận</td><td>Chọn giữa hai phương án đều hấp dẫn (một chuyến du lịch hay một chiếc điện thoại mới)</td><td>Gói cả hai, hoặc trấn an sau lựa chọn để giảm <strong>bất hoà nhận thức</strong></td></tr>
<tr><td>Tiếp cận – né tránh</td><td>Phương án mong muốn nhưng kèm hệ quả tiêu cực (đồ uống ngon nhưng nhiều đường; giày đẹp nhưng đắt)</td><td>Loại bỏ mặt tiêu cực: "ít đường", trả góp, vật liệu bền vững</td></tr>
<tr><td>Né tránh – né tránh</td><td>Chọn giữa hai phương án đều không mong muốn (sửa máy tính cũ hay bỏ tiền mua máy mới)</td><td>Nhấn mạnh lợi ích của phương án ít khó chịu hơn: thu cũ đổi mới, bảo hành mở rộng</td></tr>
</table>
<h3>Giá trị của người tiêu dùng</h3>
<p><strong>Giá trị</strong> là niềm tin rằng một trạng thái đáng mong muốn hơn trạng thái ngược lại (tự do thay vì bị ràng buộc). Giá trị ít về số lượng, ổn định và nằm ở trung tâm bản thân, nên sản phẩm gắn với giá trị sẽ có mức độ liên quan rất cao.</p>
<ul>
<li><strong>Bảng giá trị Rokeach</strong>: <em>giá trị cứu cánh</em> là trạng thái cuối cùng mong muốn (cuộc sống sung túc, tự do, gia đình an toàn); <em>giá trị công cụ</em> là cách để đạt được chúng (tham vọng, trung thực, có năng lực).</li>
<li><strong>Danh sách giá trị (LOV)</strong> do Kahle phát triển cho nghiên cứu người tiêu dùng: một danh sách ngắn như tự trọng, an toàn, quan hệ ấm áp với người khác, cảm giác thuộc về, niềm vui và tận hưởng cuộc sống.</li>
<li><strong>Lý thuyết Schwartz</strong>: mười giá trị cơ bản xếp thành vòng tròn; giá trị kề nhau thì tương thích, đối diện nhau thì xung đột — ví dụ cởi mở với thay đổi (tự định hướng, kích thích) đối lập với bảo tồn (an toàn, tuân thủ, truyền thống).</li>
</ul>
<h3>Chuỗi phương tiện – mục đích và kỹ thuật bậc thang</h3>
<p>Mô hình <strong>chuỗi phương tiện – mục đích</strong> (Gutman) cho rằng thuộc tính sản phẩm quan trọng vì chúng dẫn tới những hệ quả giúp người tiêu dùng đạt được giá trị của mình:</p>
<pre><code>Thuộc tính → Hệ quả chức năng → Hệ quả tâm lý – xã hội → Giá trị
(một chiếc xe scooter điện gấp gọn giả định)
Khung nhẹ (8 kg) → dễ xách lên phòng ký túc xá → mình không cần nhờ ai
  → Tự do / tự định hướng</code></pre>
<p>Phỏng vấn <strong>bậc thang</strong> (laddering) phát hiện các chuỗi này bằng cách hỏi đi hỏi lại "Vì sao điều đó quan trọng với bạn?". Kết quả được tóm tắt thành bản đồ giá trị thứ bậc để định hướng quảng cáo. Mô hình <strong>MECCAs</strong> (khái niệm hoá phương tiện – mục đích cho các thành phần của chiến lược quảng cáo) biến một bậc thang thành các thành phần thông điệp: thuộc tính sản phẩm cần nêu, lợi ích cho người tiêu dùng, khung thể hiện (phong cách và kịch bản quảng cáo), điểm đòn bẩy (cách quảng cáo nối lợi ích với giá trị) và động lực cốt lõi (chính giá trị đó).</p>
<div class="callout"><span class="badge">Hàm ý marketing</span> Hãy bán cả chiếc thang chứ không chỉ bậc thấp nhất: "8 kg" trở nên thuyết phục khi quảng cáo cho thấy hệ quả và giá trị mà nó phục vụ — "tự mình đi bất cứ đâu".</div>`,
  ]]);

const c6 = doc('mkt201-3-2-self-personality-lifestyle', '3.2 — The self, personality, lifestyle & psychographics|||3.2 — Bản thân, tính cách, lối sống & phân tích tâm lý (psychographics)',
  'Quan niệm về bản thân (thực tế, lý tưởng), tương hợp hình ảnh bản thân, tự hoàn thiện bằng biểu tượng, bản thân mở rộng; lý thuyết tính cách (Freud, Horney, đặc điểm, Big Five); tính cách thương hiệu của Aaker; lối sống, AIO, VALS.',
  [[
    `<span class="eyebrow">MKT201 · Part 3 · Lesson 3.2</span>
<h2>The self, personality, lifestyle &amp; psychographics</h2>
<h3>The self-concept</h3>
<p>The <strong>self-concept</strong> is the set of beliefs a person holds about their own attributes and how they evaluate them. It has several parts: the <strong>actual self</strong> (who I think I am), the <strong>ideal self</strong> (who I would like to be) and, online, the curated self people show on social media. <strong>Self-esteem</strong> is the positivity of the self-concept; ads that invite comparison with idealized models can lower it.</p>
<ul>
<li><strong>Self-image congruence</strong>: consumers choose products and brands whose image matches their actual or ideal self — an office worker who sees herself as "modern and efficient" prefers brands that project the same image.</li>
<li><strong>Symbolic self-completion</strong>: people who feel insecure in a new role use products to complete that identity (a new graduate buying a formal bag and shoes for the first job).</li>
<li><strong>The extended self</strong> (Belk): possessions become part of who we are — a first motorbike, a grandmother's ring, a phone full of photos. Losing them feels like losing part of oneself.</li>
</ul>
<h3>Personality</h3>
<p><strong>Personality</strong> is a person's unique psychological makeup and the way it consistently influences how they respond to their environment.</p>
<table>
<tr><th>Approach</th><th>Core idea</th><th>Use in marketing</th></tr>
<tr><td>Freudian theory</td><td>Behavior results from the conflict between the id (pleasure), the superego (conscience) and the ego (the mediator)</td><td>Early <strong>motivational research</strong> (Ernest Dichter) used depth interviews to find hidden motives; projective techniques survive today</td></tr>
<tr><td>Neo-Freudian (Karen Horney)</td><td>People tend to be <em>compliant</em> (moving toward others), <em>aggressive</em> (against others) or <em>detached</em> (away from others)</td><td>Links orientations toward others with brand and category preferences</td></tr>
<tr><td>Trait theory</td><td>Personality is a set of measurable traits; the widely used <strong>Big Five</strong> are openness, conscientiousness, extraversion, agreeableness and neuroticism</td><td>Consumer traits such as innovativeness, materialism, need for cognition, frugality and self-monitoring</td></tr>
</table>
<p>Traits usually predict specific purchases only weakly, because behavior also depends on the situation; they are more useful for describing segments and choosing a communication style.</p>
<h3>Brand personality (Aaker)</h3>
<p><strong>Brand personality</strong> is the set of human characteristics associated with a brand. Jennifer Aaker's framework identifies five dimensions:</p>
<table>
<tr><th>Dimension</th><th>Facets</th></tr>
<tr><td>Sincerity</td><td>Down-to-earth, honest, wholesome, cheerful</td></tr>
<tr><td>Excitement</td><td>Daring, spirited, imaginative, up-to-date</td></tr>
<tr><td>Competence</td><td>Reliable, intelligent, successful</td></tr>
<tr><td>Sophistication</td><td>Upper class, charming</td></tr>
<tr><td>Ruggedness</td><td>Outdoorsy, tough</td></tr>
</table>
<p>Brand personality is built by everything the brand does: spokespeople and mascots, tone of voice, design, price, even how it answers complaints on social media. The framework was developed with American consumers and later studies found culture-specific dimensions, so test it before applying it in Vietnam.</p>
<h3>Lifestyle and psychographics</h3>
<p>A <strong>lifestyle</strong> is a pattern of consumption reflecting how a person chooses to spend time and money. <strong>Psychographics</strong> measures lifestyles, values and personality to segment consumers, most often through <strong>AIO</strong> statements — <em>Activities</em> (work, hobbies, sports, shopping), <em>Interests</em> (family, food, fashion, media) and <em>Opinions</em> (about themselves, social issues, products) — rated on agreement scales and then grouped by cluster analysis.</p>
<ul>
<li>Products that express a lifestyle tend to be bought together (<em>consumption constellations</em>): a runner's watch, a fitness app, protein drinks and race registrations — an opening for co-branding.</li>
<li>Commercial systems such as <strong>VALS</strong> (Strategic Business Insights, built on US data) classify consumers by primary motivation — ideals, achievement or self-expression — and by resources. Local markets need segmentations built on local data.</li>
</ul>
<div class="callout"><span class="badge">Marketing implication</span> Demographics tell you who buys; psychographics tell you why. Two 22-year-old students with the same income can live very different lifestyles and respond to opposite messages.</div>`,
    `<span class="eyebrow">MKT201 · Phần 3 · Bài 3.2</span>
<h2>Bản thân, tính cách, lối sống &amp; phân tích tâm lý (psychographics)</h2>
<h3>Quan niệm về bản thân</h3>
<p><strong>Quan niệm về bản thân</strong> là tập niềm tin một người có về các đặc điểm của chính mình và cách họ đánh giá chúng. Nó gồm nhiều phần: <strong>bản thân thực tế</strong> (tôi nghĩ mình là ai), <strong>bản thân lý tưởng</strong> (tôi muốn trở thành ai) và, trên mạng, hình ảnh bản thân được chọn lọc mà người ta phô ra trên mạng xã hội. <strong>Lòng tự trọng</strong> là mức độ tích cực của quan niệm về bản thân; quảng cáo gợi sự so sánh với người mẫu lý tưởng hoá có thể làm nó giảm xuống.</p>
<ul>
<li><strong>Tương hợp hình ảnh bản thân</strong>: người tiêu dùng chọn sản phẩm và thương hiệu có hình ảnh khớp với bản thân thực tế hoặc lý tưởng — một nhân viên văn phòng tự thấy mình "hiện đại và hiệu quả" sẽ ưa thương hiệu toát lên đúng hình ảnh đó.</li>
<li><strong>Tự hoàn thiện bằng biểu tượng</strong>: người cảm thấy chưa vững vàng trong một vai trò mới dùng sản phẩm để hoàn thiện bản sắc đó (sinh viên mới tốt nghiệp mua túi và giày công sở cho công việc đầu tiên).</li>
<li><strong>Bản thân mở rộng</strong> (Belk): đồ vật sở hữu trở thành một phần con người ta — chiếc xe máy đầu tiên, chiếc nhẫn của bà, chiếc điện thoại đầy ảnh. Mất chúng giống như mất một phần bản thân.</li>
</ul>
<h3>Tính cách</h3>
<p><strong>Tính cách</strong> là cấu trúc tâm lý riêng của mỗi người và cách nó ảnh hưởng nhất quán tới việc người đó phản ứng với môi trường.</p>
<table>
<tr><th>Cách tiếp cận</th><th>Ý tưởng cốt lõi</th><th>Ứng dụng trong marketing</th></tr>
<tr><td>Lý thuyết Freud</td><td>Hành vi là kết quả xung đột giữa cái ấy (khoái lạc), cái siêu tôi (lương tâm) và cái tôi (người hoà giải)</td><td><strong>Nghiên cứu động cơ</strong> thời kỳ đầu (Ernest Dichter) dùng phỏng vấn sâu để tìm động cơ ẩn; kỹ thuật phóng chiếu vẫn còn được dùng</td></tr>
<tr><td>Hậu Freud (Karen Horney)</td><td>Con người có xu hướng <em>phục tùng</em> (hướng về người khác), <em>gây hấn</em> (chống lại người khác) hoặc <em>tách biệt</em> (xa người khác)</td><td>Nối xu hướng ứng xử với người khác với sở thích thương hiệu và loại sản phẩm</td></tr>
<tr><td>Lý thuyết đặc điểm</td><td>Tính cách là tập hợp các đặc điểm đo được; mô hình <strong>Big Five</strong> phổ biến gồm cởi mở, tận tâm, hướng ngoại, dễ chịu và bất ổn cảm xúc</td><td>Các đặc điểm người tiêu dùng như tính đổi mới, chủ nghĩa vật chất, nhu cầu tư duy, tính tiết kiệm và khả năng tự điều chỉnh hình ảnh</td></tr>
</table>
<p>Đặc điểm tính cách thường chỉ dự đoán yếu các lần mua cụ thể, vì hành vi còn phụ thuộc tình huống; chúng hữu ích hơn khi mô tả phân khúc và chọn phong cách truyền thông.</p>
<h3>Tính cách thương hiệu (Aaker)</h3>
<p><strong>Tính cách thương hiệu</strong> là tập hợp các đặc điểm con người được gắn với một thương hiệu. Khung của Jennifer Aaker xác định năm khía cạnh:</p>
<table>
<tr><th>Khía cạnh</th><th>Biểu hiện</th></tr>
<tr><td>Chân thành</td><td>Giản dị, trung thực, lành mạnh, vui vẻ</td></tr>
<tr><td>Sôi nổi</td><td>Táo bạo, đầy sinh khí, giàu trí tưởng tượng, hợp thời</td></tr>
<tr><td>Năng lực</td><td>Đáng tin cậy, thông minh, thành công</td></tr>
<tr><td>Tinh tế</td><td>Thượng lưu, quyến rũ</td></tr>
<tr><td>Mạnh mẽ (phong trần)</td><td>Ưa ngoài trời, cứng cỏi</td></tr>
</table>
<p>Tính cách thương hiệu được xây dựng từ mọi việc thương hiệu làm: người phát ngôn và linh vật, giọng điệu, thiết kế, giá, thậm chí cách trả lời khiếu nại trên mạng xã hội. Khung này được xây dựng với người tiêu dùng Mỹ và các nghiên cứu sau đó tìm thấy những khía cạnh đặc thù theo văn hoá, nên cần kiểm chứng trước khi áp dụng ở Việt Nam.</p>
<h3>Lối sống và phân tích tâm lý</h3>
<p><strong>Lối sống</strong> là khuôn mẫu tiêu dùng phản ánh cách một người chọn dùng thời gian và tiền bạc. <strong>Phân tích tâm lý</strong> (psychographics) đo lường lối sống, giá trị và tính cách để phân khúc người tiêu dùng, thường qua các nhận định <strong>AIO</strong> — <em>Hoạt động</em> (công việc, sở thích, thể thao, mua sắm), <em>Mối quan tâm</em> (gia đình, ẩm thực, thời trang, truyền thông) và <em>Quan điểm</em> (về bản thân, vấn đề xã hội, sản phẩm) — được chấm theo thang đồng ý rồi gom nhóm bằng phân tích cụm.</p>
<ul>
<li>Những sản phẩm cùng thể hiện một lối sống thường được mua cùng nhau (<em>chòm sao tiêu dùng</em>): đồng hồ chạy bộ, ứng dụng thể dục, đồ uống bổ sung đạm và phí đăng ký giải chạy — cơ hội cho hợp tác đồng thương hiệu.</li>
<li>Các hệ thống thương mại như <strong>VALS</strong> (Strategic Business Insights, xây trên dữ liệu Mỹ) phân loại người tiêu dùng theo động cơ chính — lý tưởng, thành tích hay thể hiện bản thân — và theo nguồn lực. Thị trường địa phương cần phân khúc xây trên dữ liệu địa phương.</li>
</ul>
<div class="callout"><span class="badge">Hàm ý marketing</span> Nhân khẩu học cho biết ai mua; phân tích tâm lý cho biết vì sao. Hai sinh viên 22 tuổi có cùng thu nhập vẫn có thể sống theo hai lối rất khác nhau và phản ứng với hai thông điệp trái ngược.</div>`,
  ]]);

const c6q = quiz('mkt201-quiz-3', 'Quiz 3 — Motivation, values, self & personality|||Quiz 3 — Động cơ, giá trị, bản thân & tính cách', [
  { id: 'q1', question: 'A student wants a delicious bubble tea but worries about the sugar. This is an example of…|||Một sinh viên muốn uống trà sữa ngon nhưng lo về lượng đường. Đây là ví dụ về…', options: ['an approach–approach conflict|||xung đột tiếp cận – tiếp cận', 'an avoidance–avoidance conflict|||xung đột né tránh – né tránh', 'an approach–avoidance conflict|||xung đột tiếp cận – né tránh', 'stimulus generalization|||khái quát hoá kích thích'], correctIndex: 2, explanation: 'One option has both a desired outcome (taste) and a negative one (sugar); a less-sugar version removes the avoidance side.|||Một phương án vừa có kết quả mong muốn (vị ngon) vừa có hệ quả tiêu cực (đường); phiên bản ít đường loại bỏ mặt né tránh.' },
  { id: 'q2', question: 'What is the correct order of a means–end chain?|||Thứ tự đúng của chuỗi phương tiện – mục đích là gì?', options: ['Value → attribute → consequence|||Giá trị → thuộc tính → hệ quả', 'Attribute → consequence → value|||Thuộc tính → hệ quả → giá trị', 'Consequence → value → attribute|||Hệ quả → giá trị → thuộc tính', 'Attribute → value → consequence|||Thuộc tính → giá trị → hệ quả'], correctIndex: 1, explanation: 'Concrete attributes produce functional and psychosocial consequences, which serve abstract personal values.|||Thuộc tính cụ thể tạo ra hệ quả chức năng và tâm lý – xã hội, các hệ quả này phục vụ những giá trị cá nhân trừu tượng.' },
  { id: 'q3', question: 'In Aaker’s brand personality framework, "outdoorsy" and "tough" are facets of…|||Trong khung tính cách thương hiệu của Aaker, "ưa ngoài trời" và "cứng cỏi" là biểu hiện của…', options: ['ruggedness|||mạnh mẽ (phong trần)', 'sophistication|||tinh tế', 'competence|||năng lực', 'sincerity|||chân thành'], correctIndex: 0, explanation: 'Ruggedness covers outdoorsy and tough; sophistication covers upper class and charming.|||Khía cạnh mạnh mẽ gồm ưa ngoài trời và cứng cỏi; tinh tế gồm thượng lưu và quyến rũ.' },
]);

const c7 = doc('mkt201-4-1-attitudes-abc-fishbein', '4.1 — Attitudes: the ABC model & multi-attribute models|||4.1 — Thái độ: mô hình ABC & mô hình đa thuộc tính',
  'Bốn chức năng của thái độ (Katz), mô hình ABC và ba thứ bậc hiệu ứng, thái độ với quảng cáo, bất hoà nhận thức, tự nhận thức, phán đoán xã hội, thuyết cân bằng, mô hình đa thuộc tính Fishbein, thuyết hành động hợp lý, thuyết hành vi có kế hoạch và khoảng cách thái độ – hành vi.',
  [[
    `<span class="eyebrow">MKT201 · Part 4 · Lesson 4.1</span>
<h2>Attitudes: the ABC model &amp; multi-attribute models</h2>
<p class="lead">An <strong>attitude</strong> is a lasting, general evaluation of people (including oneself), objects, advertisements or issues. Attitudes matter to marketers because they are relatively stable and help predict behavior.</p>
<h3>Why people hold attitudes (Katz's functional theory)</h3>
<table>
<tr><th>Function</th><th>The attitude helps the person…</th><th>Example</th></tr>
<tr><td>Utilitarian</td><td>obtain rewards and avoid punishment</td><td>"I like this app because it saves me money"</td></tr>
<tr><td>Value-expressive</td><td>express central values or the self-concept</td><td>Preferring an eco-friendly brand to show what I stand for</td></tr>
<tr><td>Ego-defensive</td><td>protect themselves from threats or insecurity</td><td>Buying a mouthwash to avoid embarrassment</td></tr>
<tr><td>Knowledge</td><td>bring order and meaning to a confusing world</td><td>Trusting a familiar brand when facing a new category</td></tr>
</table>
<h3>The ABC model and hierarchies of effects</h3>
<p>Attitudes have three components: <strong>Affect</strong> (feelings), <strong>Behavior</strong> (intentions to act) and <strong>Cognition</strong> (beliefs). The order in which they form depends on involvement:</p>
<table>
<tr><th>Hierarchy</th><th>Sequence</th><th>When it applies</th></tr>
<tr><td>Standard learning</td><td>Cognition → Affect → Behavior</td><td>High involvement: research, form feelings, then buy (a laptop)</td></tr>
<tr><td>Low-involvement</td><td>Cognition → Behavior → Affect</td><td>Minimal beliefs, buy, then evaluate after use (a new snack)</td></tr>
<tr><td>Experiential</td><td>Affect → Behavior → Cognition</td><td>Emotions drive the purchase (a concert ticket, a perfume); beliefs follow</td></tr>
</table>
<p><strong>Attitude toward the ad</strong> (A<sub>ad</sub>) — feelings about the ad itself — can transfer to the brand, especially for low-involvement products.</p>
<h3>Consistency and attitude change</h3>
<ul>
<li><strong>Cognitive consistency</strong>: people want their beliefs, feelings and behaviors to agree. <strong>Cognitive dissonance theory</strong> (Festinger): inconsistency creates discomfort that people reduce by changing an attitude or a behavior.</li>
<li><strong>Self-perception theory</strong>: people infer their attitudes from their own behavior ("I keep buying it, so I must like it"). It helps explain the <em>foot-in-the-door</em> technique: agreeing to a small request makes agreeing to a larger one more likely.</li>
<li><strong>Social judgment theory</strong>: messages within a person's <em>latitude of acceptance</em> are assimilated (seen as closer to their view than they are); messages in the <em>latitude of rejection</em> are contrasted (seen as further away). Highly involved people have narrow latitudes of acceptance, so change them step by step.</li>
<li><strong>Balance theory</strong> (Heider): people seek harmony among three elements — the person, another person and an object. If I like a celebrity who endorses a brand, I tend to like the brand; a scandal can tip the balance the other way.</li>
</ul>
<h3>Multi-attribute attitude models (Fishbein)</h3>
<pre><code>A(o) = Σ b(i) x e(i)
A(o): attitude toward object o (a brand)
b(i): belief that the brand has attribute i  (e.g. 1 = very unlikely ... 7 = very likely)
e(i): evaluation of attribute i              (e.g. −3 = very bad ... +3 = very good)
A common marketing version replaces e(i) with an importance weight I(i).</code></pre>
<p>The model is <em>compensatory</em> and diagnostic: it shows which beliefs to strengthen and which attributes matter. Attitude-change strategies include strengthening beliefs about the brand's real advantages, correcting wrong beliefs, changing the importance or evaluation of an attribute, adding a new attribute, and changing beliefs about competitors (comparative advertising, which must be truthful and legal).</p>
<p>The <strong>theory of reasoned action</strong> (Fishbein and Ajzen) focuses on the <em>attitude toward the act</em> of buying and adds the <strong>subjective norm</strong> — what important others think I should do, weighted by my motivation to comply; together they predict <strong>behavioral intention</strong>. Ajzen's <strong>theory of planned behavior</strong> adds <strong>perceived behavioral control</strong> (can I actually do it?). Even so, intentions do not always become behavior — the <em>attitude–behavior gap</em>: many consumers say they support green products but buy on price.</p>
<div class="callout"><span class="badge">Remember</span> Measure the attitude toward buying, not only toward the brand: a student may love a premium laptop brand yet have a negative attitude toward buying it this year because of the price and her parents' opinion.</div>`,
    `<span class="eyebrow">MKT201 · Phần 4 · Bài 4.1</span>
<h2>Thái độ: mô hình ABC &amp; mô hình đa thuộc tính</h2>
<p class="lead"><strong>Thái độ</strong> là sự đánh giá chung, bền vững về con người (kể cả chính mình), sự vật, quảng cáo hay vấn đề. Thái độ quan trọng với người làm marketing vì nó tương đối ổn định và giúp dự đoán hành vi.</p>
<h3>Vì sao con người có thái độ (thuyết chức năng của Katz)</h3>
<table>
<tr><th>Chức năng</th><th>Thái độ giúp con người…</th><th>Ví dụ</th></tr>
<tr><td>Thực dụng</td><td>nhận phần thưởng và tránh bị trừng phạt</td><td>"Tôi thích ứng dụng này vì nó giúp tôi tiết kiệm tiền"</td></tr>
<tr><td>Biểu đạt giá trị</td><td>thể hiện giá trị cốt lõi hoặc quan niệm về bản thân</td><td>Ưa thương hiệu thân thiện môi trường để cho thấy mình theo đuổi điều gì</td></tr>
<tr><td>Tự vệ bản ngã</td><td>tự bảo vệ trước mối đe doạ hoặc sự bất an</td><td>Mua nước súc miệng để tránh bị ngượng</td></tr>
<tr><td>Tri thức</td><td>tạo trật tự và ý nghĩa cho một thế giới rối rắm</td><td>Tin một thương hiệu quen khi gặp loại sản phẩm mới</td></tr>
</table>
<h3>Mô hình ABC và các thứ bậc hiệu ứng</h3>
<p>Thái độ có ba thành phần: <strong>Cảm xúc</strong> (Affect), <strong>Hành vi</strong> (Behavior — ý định hành động) và <strong>Nhận thức</strong> (Cognition — niềm tin; khác với nhận thức theo nghĩa tri giác — perception — ở Phần 2). Thứ tự hình thành của chúng phụ thuộc vào mức độ liên quan:</p>
<table>
<tr><th>Thứ bậc</th><th>Trình tự</th><th>Khi nào áp dụng</th></tr>
<tr><td>Học hỏi chuẩn</td><td>Nhận thức → Cảm xúc → Hành vi</td><td>Mức độ liên quan cao: tìm hiểu, hình thành cảm xúc rồi mới mua (máy tính xách tay)</td></tr>
<tr><td>Mức độ liên quan thấp</td><td>Nhận thức → Hành vi → Cảm xúc</td><td>Niềm tin tối thiểu, mua, rồi đánh giá sau khi dùng (một loại snack mới)</td></tr>
<tr><td>Trải nghiệm</td><td>Cảm xúc → Hành vi → Nhận thức</td><td>Cảm xúc dẫn dắt việc mua (vé hoà nhạc, nước hoa); niềm tin theo sau</td></tr>
</table>
<p><strong>Thái độ với quảng cáo</strong> (A<sub>ad</sub>) — cảm xúc về chính mẩu quảng cáo — có thể chuyển sang thương hiệu, nhất là với sản phẩm có mức độ liên quan thấp.</p>
<h3>Tính nhất quán và thay đổi thái độ</h3>
<ul>
<li><strong>Nhất quán nhận thức</strong>: con người muốn niềm tin, cảm xúc và hành vi của mình ăn khớp. <strong>Thuyết bất hoà nhận thức</strong> (Festinger): sự không nhất quán gây khó chịu, và người ta giảm nó bằng cách thay đổi thái độ hoặc hành vi.</li>
<li><strong>Thuyết tự nhận thức</strong>: con người suy ra thái độ từ chính hành vi của mình ("mình cứ mua nó hoài, chắc là mình thích nó"). Thuyết này giúp giải thích kỹ thuật <em>"đặt chân qua cửa"</em>: đồng ý một yêu cầu nhỏ khiến việc đồng ý một yêu cầu lớn hơn dễ xảy ra hơn.</li>
<li><strong>Thuyết phán đoán xã hội</strong>: thông điệp nằm trong <em>vùng chấp nhận</em> của một người được đồng hoá (thấy gần quan điểm của họ hơn thực tế); thông điệp nằm trong <em>vùng bác bỏ</em> bị tương phản (thấy xa hơn thực tế). Người có mức độ liên quan cao có vùng chấp nhận hẹp, nên cần thay đổi họ từng bước.</li>
<li><strong>Thuyết cân bằng</strong> (Heider): con người tìm sự hài hoà giữa ba yếu tố — bản thân, một người khác và một đối tượng. Nếu tôi thích một người nổi tiếng đang quảng cáo cho một thương hiệu, tôi có xu hướng thích thương hiệu đó; một vụ bê bối có thể làm cán cân nghiêng theo chiều ngược lại.</li>
</ul>
<h3>Mô hình thái độ đa thuộc tính (Fishbein)</h3>
<pre><code>A(o) = Σ b(i) x e(i)
A(o): thái độ với đối tượng o (một thương hiệu)
b(i): niềm tin rằng thương hiệu có thuộc tính i  (vd 1 = rất không chắc ... 7 = rất chắc chắn)
e(i): đánh giá về thuộc tính i                 (vd −3 = rất xấu ... +3 = rất tốt)
Một phiên bản phổ biến trong marketing thay e(i) bằng trọng số tầm quan trọng I(i).</code></pre>
<p>Mô hình mang tính <em>bù trừ</em> và có giá trị chẩn đoán: nó cho biết cần củng cố niềm tin nào và thuộc tính nào quan trọng. Các chiến lược thay đổi thái độ gồm: củng cố niềm tin về lợi thế thật của thương hiệu, sửa niềm tin sai, thay đổi tầm quan trọng hoặc đánh giá về một thuộc tính, thêm thuộc tính mới, và thay đổi niềm tin về đối thủ (quảng cáo so sánh — phải trung thực và đúng pháp luật).</p>
<p><strong>Thuyết hành động hợp lý</strong> (Fishbein và Ajzen) tập trung vào <em>thái độ với hành động</em> mua và bổ sung <strong>chuẩn chủ quan</strong> — điều những người quan trọng nghĩ tôi nên làm, nhân với động lực làm theo của tôi; hai yếu tố này cùng dự đoán <strong>ý định hành vi</strong>. <strong>Thuyết hành vi có kế hoạch</strong> của Ajzen thêm <strong>nhận thức kiểm soát hành vi</strong> (tôi có thực sự làm được không?). Dù vậy, ý định không phải lúc nào cũng thành hành vi — <em>khoảng cách thái độ – hành vi</em>: nhiều người nói ủng hộ sản phẩm xanh nhưng lại mua theo giá.</p>
<div class="callout"><span class="badge">Ghi nhớ</span> Hãy đo thái độ với việc mua, không chỉ thái độ với thương hiệu: một sinh viên có thể rất thích một thương hiệu máy tính cao cấp nhưng lại có thái độ tiêu cực với việc mua nó trong năm nay vì giá và ý kiến của bố mẹ.</div>`,
  ]]);

const c8 = doc('mkt201-4-2-persuasion-elm', '4.2 — Persuasion: source, message & the elaboration likelihood model|||4.2 — Thuyết phục: nguồn phát, thông điệp & mô hình xác suất xử lý kỹ lưỡng (ELM)',
  'Mô hình truyền thông, độ tin cậy và sức hấp dẫn của nguồn, giả thuyết tương hợp, hiệu ứng ngủ; thông điệp một chiều và hai chiều, so sánh, cảm xúc và lý trí, sợ hãi, hài hước, lặp lại; mô hình xác suất xử lý kỹ lưỡng (ELM) với đường trung tâm và đường ngoại vi.',
  [[
    `<span class="eyebrow">MKT201 · Part 4 · Lesson 4.2</span>
<h2>Persuasion: source, message &amp; the elaboration likelihood model</h2>
<p class="lead"><strong>Persuasion</strong> is an active attempt to change attitudes. The communication model reminds us that a <strong>source</strong> sends a <strong>message</strong> through a <strong>medium</strong> to a <strong>receiver</strong>, who interprets it and gives <strong>feedback</strong>. Today receivers also create and share messages themselves, so the brand no longer controls the conversation.</p>
<h3>Source effects</h3>
<ul>
<li><strong>Credibility</strong> combines expertise and trustworthiness. A dentist recommending a toothpaste scores on expertise; an ordinary reviewer with no commercial link scores on trust. A known payment can reduce trust, which is one reason paid endorsements must be disclosed.</li>
<li><strong>Attractiveness</strong>: physically or socially attractive sources create a <em>halo effect</em>. The <strong>match-up hypothesis</strong> says the endorser's image should fit the product (an athlete for sportswear, a chef for cookware).</li>
<li><strong>Sleeper effect</strong>: over time people may remember a message but forget its low-credibility source, so its persuasive impact can increase later.</li>
</ul>
<h3>Message effects</h3>
<table>
<tr><th>Choice</th><th>What research suggests</th></tr>
<tr><td>One-sided vs two-sided</td><td>Two-sided messages (admitting a minor weakness, then answering it) seem more credible, especially to educated audiences and those already exposed to counter-arguments</td></tr>
<tr><td>Comparative advertising</td><td>Attracts attention and highlights advantages, but can reduce credibility; claims must be truthful and legal</td></tr>
<tr><td>Emotional vs rational</td><td>Emotional appeals build liking and memory; rational appeals work when the audience wants information</td></tr>
<tr><td>Fear appeals</td><td>Classic texts claim moderate fear works best, but meta-analyses find that stronger fear appeals are generally more persuasive provided the message offers a clear, doable solution (high efficacy); without one, fear can backfire</td></tr>
<tr><td>Humour</td><td>Wins attention; it must not overshadow the brand or mock the target audience</td></tr>
<tr><td>Repetition</td><td>Two-factor theory: repetition first builds familiarity and learning, then boredom sets in (wear-out); vary the executions around one core message</td></tr>
</table>
<h3>The elaboration likelihood model (ELM)</h3>
<p>Petty and Cacioppo's ELM predicts <em>how</em> a message persuades, depending on the receiver's <strong>motivation</strong> (involvement, need for cognition) and <strong>ability</strong> (knowledge, time, lack of distraction) to think about it.</p>
<pre><code>             Motivation AND ability to process the message?
                /                                  \\
             HIGH                                  LOW
       CENTRAL ROUTE                         PERIPHERAL ROUTE
  weighs the quality of arguments       relies on cues: an attractive or famous
  → supporting or counter-arguments     source, music, visuals, the number of
  → attitude change that lasts,         arguments, likes and views
    resists counter-persuasion and      → attitude change that is temporary,
    predicts behavior                     easily reversed, weakly linked to behavior</code></pre>
<ul>
<li>The same element can play different roles: an attractive model is a peripheral cue in a car ad but a <em>central argument</em> in a skin-care ad ("this could be your skin").</li>
<li>Strong arguments help only when people process them; when they do process, weak arguments backfire.</li>
<li>Consumers high in <strong>need for cognition</strong> enjoy thinking and favour detailed, argument-based messages.</li>
</ul>
<div class="callout"><span class="badge">Marketing implication</span> Do not choose between "facts" and "feelings" for the whole campaign — match the route to the audience and the touchpoint. A few seconds of video in a feed is peripheral territory; a product page or a comparison article is central territory.</div>`,
    `<span class="eyebrow">MKT201 · Phần 4 · Bài 4.2</span>
<h2>Thuyết phục: nguồn phát, thông điệp &amp; mô hình xác suất xử lý kỹ lưỡng (ELM)</h2>
<p class="lead"><strong>Thuyết phục</strong> là nỗ lực chủ động nhằm thay đổi thái độ. Mô hình truyền thông nhắc rằng một <strong>nguồn phát</strong> gửi <strong>thông điệp</strong> qua một <strong>kênh</strong> tới <strong>người nhận</strong>, người này diễn giải và <strong>phản hồi</strong>. Ngày nay người nhận cũng tự tạo và chia sẻ thông điệp, nên thương hiệu không còn kiểm soát được cuộc trò chuyện.</p>
<h3>Ảnh hưởng của nguồn phát</h3>
<ul>
<li><strong>Độ tin cậy</strong> gồm chuyên môn và sự đáng tin. Nha sĩ giới thiệu kem đánh răng mạnh về chuyên môn; một người đánh giá bình thường không có quan hệ thương mại mạnh về sự đáng tin. Việc biết người nói được trả tiền có thể làm giảm lòng tin — một lý do khiến quảng cáo trả phí phải được công khai.</li>
<li><strong>Sức hấp dẫn</strong>: nguồn phát hấp dẫn về ngoại hình hoặc xã hội tạo ra <em>hiệu ứng hào quang</em>. <strong>Giả thuyết tương hợp</strong> cho rằng hình ảnh người đại diện phải hợp với sản phẩm (vận động viên cho đồ thể thao, đầu bếp cho đồ nhà bếp).</li>
<li><strong>Hiệu ứng ngủ</strong>: theo thời gian người ta có thể nhớ thông điệp nhưng quên nguồn phát kém tin cậy của nó, nên sức thuyết phục có thể tăng lên về sau.</li>
</ul>
<h3>Ảnh hưởng của thông điệp</h3>
<table>
<tr><th>Lựa chọn</th><th>Nghiên cứu cho thấy</th></tr>
<tr><td>Một chiều hay hai chiều</td><td>Thông điệp hai chiều (thừa nhận một điểm yếu nhỏ rồi giải đáp nó) có vẻ đáng tin hơn, nhất là với khán giả có học vấn và người đã nghe các lập luận phản bác</td></tr>
<tr><td>Quảng cáo so sánh</td><td>Thu hút chú ý và làm nổi bật lợi thế, nhưng có thể giảm độ tin cậy; tuyên bố phải trung thực và đúng pháp luật</td></tr>
<tr><td>Cảm xúc hay lý trí</td><td>Thông điệp cảm xúc tạo thiện cảm và ghi nhớ; thông điệp lý trí hiệu quả khi khán giả muốn có thông tin</td></tr>
<tr><td>Gợi sự sợ hãi</td><td>Giáo trình kinh điển cho rằng mức sợ vừa phải là tốt nhất, nhưng các phân tích tổng hợp cho thấy mức sợ cao hơn thường thuyết phục hơn, với điều kiện thông điệp đưa ra một giải pháp rõ ràng, làm được (hiệu quả cao); thiếu giải pháp thì dễ phản tác dụng</td></tr>
<tr><td>Hài hước</td><td>Giành được chú ý; không được lấn át thương hiệu hay chế giễu chính khán giả mục tiêu</td></tr>
<tr><td>Lặp lại</td><td>Thuyết hai yếu tố: lặp lại lúc đầu tạo sự quen thuộc và học hỏi, sau đó gây nhàm chán (bão hoà); hãy thay đổi cách thể hiện quanh một thông điệp cốt lõi</td></tr>
</table>
<h3>Mô hình xác suất xử lý kỹ lưỡng (ELM)</h3>
<p>Mô hình ELM (Elaboration Likelihood Model — xác suất người nhận xử lý kỹ lưỡng thông điệp) của Petty và Cacioppo dự đoán thông điệp thuyết phục <em>bằng cách nào</em>, tuỳ vào <strong>động lực</strong> (motivation: mức độ liên quan, nhu cầu tư duy) và <strong>khả năng</strong> (ability: hiểu biết, thời gian, không bị xao nhãng) suy nghĩ về thông điệp của người nhận.</p>
<pre><code>             Có động lực VÀ khả năng xử lý thông điệp không?
                /                                  \\
              CAO                                 THẤP
      ĐƯỜNG TRUNG TÂM                       ĐƯỜNG NGOẠI VI
  cân nhắc chất lượng lập luận          dựa vào tín hiệu: nguồn phát hấp dẫn
  → lập luận ủng hộ hoặc phản bác       hoặc nổi tiếng, âm nhạc, hình ảnh, số
  → thay đổi thái độ bền vững,          lượng lập luận, lượt thích và lượt xem
    chống lại thuyết phục ngược,        → thay đổi thái độ tạm thời, dễ bị đảo
    dự đoán được hành vi                  ngược, gắn yếu với hành vi</code></pre>
<ul>
<li>Cùng một yếu tố có thể đóng vai trò khác nhau: người mẫu hấp dẫn là tín hiệu ngoại vi trong quảng cáo ô tô nhưng là <em>lập luận trung tâm</em> trong quảng cáo chăm sóc da ("làn da của bạn cũng có thể như thế này").</li>
<li>Lập luận mạnh chỉ có ích khi người ta xử lý nó; khi người ta đã xử lý, lập luận yếu sẽ phản tác dụng.</li>
<li>Người tiêu dùng có <strong>nhu cầu tư duy</strong> cao thích suy nghĩ và ưa thông điệp chi tiết, dựa trên lập luận.</li>
</ul>
<div class="callout"><span class="badge">Hàm ý marketing</span> Đừng chọn "dữ kiện" hay "cảm xúc" cho cả chiến dịch — hãy khớp con đường với khán giả và điểm chạm. Vài giây video trên bảng tin là lãnh địa của đường ngoại vi; trang sản phẩm hay bài so sánh là lãnh địa của đường trung tâm.</div>`,
  ]]);

const c8e = doc('mkt201-4-3-exercise', 'Exercise 2 — Fishbein multi-attribute model for three e-scooter brands|||Bài tập 2 — Mô hình đa thuộc tính Fishbein cho ba thương hiệu xe scooter điện',
  'Bài tập tình huống giả định: tính điểm thái độ Fishbein cho ba thương hiệu xe scooter điện (có thuộc tính mang đánh giá âm), so sánh với quy tắc từ điển, đánh giá bốn chiến lược thay đổi thái độ bằng số và đề xuất chiến lược; kèm lời giải.',
  [[
    `<span class="eyebrow">MKT201 · Part 4 · Exercise</span>
<h2>Exercise 2 — which attitude-change strategy works?</h2>
<div class="callout"><span class="badge">Problem</span> A survey (a fictional case, illustrative numbers) asks university students about three fictional electric-scooter brands. Evaluations e(i) on a −3 to +3 scale: low price +3, long battery range +2, stylish design +2, heavy weight −2. Beliefs b(i) on a 1–7 scale (how likely the brand has the attribute): <strong>Volta</strong> — price 6, range 3, design 4, heavy 5; <strong>Ecoro</strong> — 3, 6, 5, 3; <strong>Mira</strong> — 4, 5, 6, 2. (a) Compute each brand's attitude score A(o). (b) Which brand would a price-first buyer using a lexicographic rule choose? (c) You advise Volta. Evaluate four strategies: S1 — improve and prove the battery range (belief 3 → 5); S2 — launch a lighter frame (belief "heavy" 5 → 3); S3 — persuade students that weight means "sturdy" (evaluation of heavy −2 → −1, for every brand); S4 — add a new attribute, a free battery-swap network (e = +2; beliefs Volta 6, Ecoro 2, Mira 2). Recommend a strategy.</div>
<h3>Worked solution</h3>
<pre><code class="language-text">(a) A(o) = Σ b(i) x e(i)
    Volta = 6x3 + 3x2 + 4x2 + 5x(−2) = 18 + 6 + 8 − 10  = 22
    Ecoro = 3x3 + 6x2 + 5x2 + 3x(−2) =  9 + 12 + 10 − 6 = 25
    Mira  = 4x3 + 5x2 + 6x2 + 2x(−2) = 12 + 10 + 12 − 4 = 30   ← preferred

(b) Lexicographic on price: highest price belief = Volta (6) → Volta wins

(c) S1  range 3 → 5:        Volta = 22 + (5 − 3) x 2    = 26
    S2  heavy 5 → 3:        Volta = 22 + (3 − 5) x (−2) = 26
        S1 + S2 together:   Volta = 30  (only ties Mira)
    S3  e(heavy) −2 → −1:   Volta 27, Ecoro 28, Mira 32
        gap to Mira shrinks from 8 to 5, but every brand gains
    S4  new attribute e = +2: Volta 22 + 6x2 = 34, Ecoro 25 + 2x2 = 29,
                              Mira 30 + 2x2 = 34  (tie)
    S1 + S4:                Volta 26 + 12 = 38  vs  Mira 34, Ecoro 29  ← recommended
    S2 + S4 gives the same: Volta 26 + 12 = 38  (S1 + S2 + S4 = 42 if both are feasible)</code></pre>
<p><strong>Why:</strong> S3 changes an evaluation that applies to the whole category, so it lifts rivals too — Volta gains most (+5) because it is seen as the heaviest, yet stays behind. With a 1–7 belief scale, brands believed unlikely to have an attribute still gain (or lose) points from it — as Ecoro and Mira do in S3 and S4 — so only the differences between brands are meaningful; on a bipolar −3 to +3 belief scale the absolute scores change but those differences stay the same. S1 and S2 change beliefs about Volta alone, but each needs real product changes and proof (claims must be true). S4 works because Volta "owns" the new attribute — for as long as rivals cannot copy it — and combining it with S1 puts Volta first. S2 + S4 scores the same 38, so the choice between S1 and S2 rests on which improvement Volta can deliver and prove more cheaply and quickly, not on the numbers. Keep the price advantage too: the lexicographic result shows that price-first buyers already choose Volta even though its compensatory score is lowest. The model assumes compensatory, high-involvement processing; for low-involvement buyers peripheral cues may matter more.</p>`,
    `<span class="eyebrow">MKT201 · Phần 4 · Bài tập</span>
<h2>Bài tập 2 — chiến lược thay đổi thái độ nào hiệu quả?</h2>
<div class="callout"><span class="badge">Đề</span> Một khảo sát (tình huống giả định, số liệu minh hoạ giả định) hỏi sinh viên về ba thương hiệu xe scooter điện (e-scooter loại đứng lái, gấp gọn) giả định. Đánh giá e(i) theo thang −3 tới +3: giá thấp +3, quãng đường mỗi lần sạc dài +2, thiết kế đẹp +2, nặng −2. Niềm tin b(i) theo thang 1–7 (khả năng thương hiệu có thuộc tính đó): <strong>Volta</strong> — giá 6, quãng đường 3, thiết kế 4, nặng 5; <strong>Ecoro</strong> — 3, 6, 5, 3; <strong>Mira</strong> — 4, 5, 6, 2. (a) Tính điểm thái độ A(o) của từng thương hiệu. (b) Người mua đặt giá lên hàng đầu và dùng quy tắc từ điển sẽ chọn thương hiệu nào? (c) Bạn tư vấn cho Volta. Đánh giá bốn chiến lược: S1 — cải tiến và chứng minh quãng đường (niềm tin 3 → 5); S2 — ra khung xe nhẹ hơn (niềm tin "nặng" 5 → 3); S3 — thuyết phục sinh viên rằng nặng nghĩa là "chắc chắn" (đánh giá thuộc tính nặng −2 → −1, áp dụng cho mọi thương hiệu); S4 — thêm thuộc tính mới là mạng lưới đổi pin miễn phí (e = +2; niềm tin Volta 6, Ecoro 2, Mira 2). Đề xuất chiến lược.</div>
<h3>Lời giải</h3>
<pre><code class="language-text">(a) A(o) = Σ b(i) x e(i)
    Volta = 6x3 + 3x2 + 4x2 + 5x(−2) = 18 + 6 + 8 − 10  = 22
    Ecoro = 3x3 + 6x2 + 5x2 + 3x(−2) =  9 + 12 + 10 − 6 = 25
    Mira  = 4x3 + 5x2 + 6x2 + 2x(−2) = 12 + 10 + 12 − 4 = 30   ← được ưa thích nhất

(b) Quy tắc từ điển theo giá: niềm tin về giá cao nhất = Volta (6) → Volta thắng

(c) S1  quãng đường 3 → 5:  Volta = 22 + (5 − 3) x 2    = 26
    S2  nặng 5 → 3:         Volta = 22 + (3 − 5) x (−2) = 26
        S1 + S2 cùng lúc:   Volta = 30  (chỉ ngang Mira)
    S3  e(nặng) −2 → −1:    Volta 27, Ecoro 28, Mira 32
        khoảng cách với Mira thu hẹp từ 8 xuống 5, nhưng thương hiệu nào cũng được cộng
    S4  thuộc tính mới e = +2: Volta 22 + 6x2 = 34, Ecoro 25 + 2x2 = 29,
                               Mira 30 + 2x2 = 34  (ngang nhau)
    S1 + S4:                Volta 26 + 12 = 38  so với  Mira 34, Ecoro 29  ← đề xuất
    S2 + S4 cũng cho:       Volta 26 + 12 = 38  (S1 + S2 + S4 = 42 nếu làm được cả hai)</code></pre>
<p><strong>Vì sao:</strong> S3 thay đổi một đánh giá áp dụng cho cả loại sản phẩm, nên nâng cả đối thủ — Volta được cộng nhiều nhất (+5) vì bị coi là nặng nhất, nhưng vẫn đứng sau. Với thang niềm tin 1–7, thương hiệu bị cho là khó có một thuộc tính vẫn được cộng (hoặc bị trừ) điểm từ thuộc tính đó — như Ecoro và Mira ở S3 và S4 — nên chỉ khoảng cách giữa các thương hiệu là có ý nghĩa; với thang niềm tin lưỡng cực −3 tới +3, điểm tuyệt đối thay đổi nhưng các khoảng cách đó giữ nguyên. S1 và S2 chỉ thay đổi niềm tin về riêng Volta, nhưng mỗi cách đều cần thay đổi sản phẩm thật và bằng chứng (tuyên bố phải đúng sự thật). S4 hiệu quả vì Volta "sở hữu" thuộc tính mới — chừng nào đối thủ chưa bắt chước được — và kết hợp với S1 đưa Volta lên đầu. S2 + S4 cũng được đúng 38 điểm, nên việc chọn S1 hay S2 dựa vào cải tiến nào Volta làm và chứng minh được rẻ hơn, nhanh hơn, chứ không dựa vào con số. Cũng nên giữ lợi thế giá: kết quả theo quy tắc từ điển cho thấy người mua đặt giá lên đầu đã chọn Volta dù điểm bù trừ của nó thấp nhất. Mô hình giả định người mua xử lý theo kiểu bù trừ, với mức độ liên quan cao; với người mua có mức độ liên quan thấp, tín hiệu ngoại vi có thể quan trọng hơn.</p>`,
  ]]);

const c8q = quiz('mkt201-quiz-4', 'Quiz 4 — Attitudes & persuasion|||Quiz 4 — Thái độ & thuyết phục', [
  { id: 'q1', question: 'A brand is rated on two attributes. Evaluations: e1 = +3, e2 = +1. Beliefs: b1 = 4, b2 = 5. What is its Fishbein attitude score?|||Một thương hiệu được đánh giá trên hai thuộc tính. Đánh giá: e1 = +3, e2 = +1. Niềm tin: b1 = 4, b2 = 5. Điểm thái độ Fishbein của nó là bao nhiêu?', options: ['9|||9', '12|||12', '17|||17', '20|||20'], correctIndex: 2, explanation: 'A(o) = 4 x 3 + 5 x 1 = 12 + 5 = 17. Adding beliefs (9) or multiplying them (20) ignores the evaluations.|||A(o) = 4 x 3 + 5 x 1 = 12 + 5 = 17. Cộng niềm tin (9) hay nhân chúng với nhau (20) là bỏ qua phần đánh giá.' },
  { id: 'q2', question: 'According to the ELM, a consumer with low motivation to process an ad is most likely to be persuaded by…|||Theo mô hình ELM, người tiêu dùng có động lực xử lý quảng cáo thấp dễ bị thuyết phục nhất bởi…', options: ['detailed technical specifications|||thông số kỹ thuật chi tiết', 'peripheral cues such as an attractive celebrity and catchy music|||tín hiệu ngoại vi như người nổi tiếng hấp dẫn và nhạc bắt tai', 'a two-sided argument with statistics|||lập luận hai chiều kèm số liệu thống kê', 'a comparison table of competing brands|||bảng so sánh các thương hiệu cạnh tranh'], correctIndex: 1, explanation: 'With low motivation or ability, people rely on peripheral cues rather than on the quality of the arguments.|||Khi động lực hoặc khả năng thấp, người ta dựa vào tín hiệu ngoại vi thay vì chất lượng lập luận.' },
  { id: 'q3', question: 'Which sequence describes the low-involvement hierarchy of effects?|||Trình tự nào mô tả thứ bậc hiệu ứng khi mức độ liên quan thấp? (Trong mô hình ABC, "nhận thức" là cognition — niềm tin.)', options: ['Affect → behavior → cognition|||Cảm xúc → hành vi → nhận thức', 'Cognition → affect → behavior|||Nhận thức → cảm xúc → hành vi', 'Behavior → affect → cognition|||Hành vi → cảm xúc → nhận thức', 'Cognition → behavior → affect|||Nhận thức → hành vi → cảm xúc'], correctIndex: 3, explanation: 'With little involvement the consumer holds minimal beliefs, buys, and forms feelings after use. C → A → B is the standard learning hierarchy; A → B → C is experiential.|||Khi mức độ liên quan thấp, người tiêu dùng có niềm tin tối thiểu, mua, rồi hình thành cảm xúc sau khi dùng. Nhận thức → cảm xúc → hành vi là thứ bậc học hỏi chuẩn; cảm xúc → hành vi → nhận thức là thứ bậc trải nghiệm.' },
]);

const c9 = doc('mkt201-5-1-groups-influence-family', '5.1 — Reference groups, opinion leaders, word of mouth & the family|||5.1 — Nhóm tham khảo, người dẫn dắt ý kiến, truyền miệng & gia đình',
  'Các loại nhóm tham khảo, ba dạng ảnh hưởng (thông tin, thực dụng, biểu đạt giá trị), khi nào ảnh hưởng nhóm mạnh, người dẫn dắt ý kiến, chuyên gia thị trường, người có ảnh hưởng trên mạng xã hội, truyền miệng và eWOM, cộng đồng thương hiệu, gia đình như một đơn vị ra quyết định.',
  [[
    `<span class="eyebrow">MKT201 · Part 5 · Lesson 5.1</span>
<h2>Reference groups, opinion leaders, word of mouth &amp; the family</h2>
<h3>Reference groups</h3>
<p>A <strong>reference group</strong> is an actual or imaginary individual or group that significantly influences a person's evaluations, aspirations or behavior.</p>
<table>
<tr><th>Group type</th><th>Meaning</th><th>Example</th></tr>
<tr><td>Membership</td><td>Groups the person already belongs to</td><td>Classmates, a university football club</td></tr>
<tr><td>Aspirational</td><td>Groups the person admires and wants to resemble</td><td>Successful entrepreneurs, admired athletes</td></tr>
<tr><td>Dissociative (avoidance)</td><td>Groups the person wants to distance themselves from</td><td>A style teenagers regard as "old-fashioned"</td></tr>
</table>
<p>Influence takes three forms (Park and Lessig): <strong>informational</strong> (seeking information from experts or observing what they use), <strong>utilitarian</strong> (complying with the preferences of people one interacts with, to gain approval or avoid sanctions) and <strong>value-expressive</strong> (buying to express or strengthen one's identity with a group). Group influence is strongest for products consumed <strong>publicly</strong> and for <strong>luxuries</strong> that few people own, and weakest for privately consumed necessities. Conformity pressure, social comparison and the fear of missing out (FOMO) amplify these effects on social media.</p>
<h3>Opinion leaders, market mavens and influencers</h3>
<ul>
<li><strong>Opinion leaders</strong> are knowledgeable and highly involved in a specific category, and often similar to their followers in values and background (<em>homophily</em>), which makes them credible. The classic <em>two-step flow</em> idea: information flows from the media to opinion leaders, then from them to others.</li>
<li><strong>Market mavens</strong> have general marketplace knowledge — where to buy, when the sales are — across many categories, and enjoy sharing it.</li>
<li><strong>Surrogate consumers</strong> are paid advisers who make or guide decisions (stylists, interior designers, financial planners).</li>
<li><strong>Social media influencers</strong> are opinion leaders at scale. Tiers such as nano, micro, macro and mega are defined by follower counts that differ by platform; smaller influencers often have closer, more trusted relationships with followers. Paid partnerships must be clearly disclosed.</li>
</ul>
<h3>Word of mouth and eWOM</h3>
<p><strong>Word of mouth (WOM)</strong> is product information passed from person to person. It is persuasive because it seems independent of the marketer. Negative WOM tends to weigh more heavily than positive WOM (<em>negativity bias</em>). Electronic WOM (eWOM) spreads faster, stays searchable and reaches strangers. <strong>Brand communities</strong> — groups of admirers of a brand — share three markers (Muniz and O'Guinn): consciousness of kind, rituals and traditions, and a sense of moral responsibility to other members.</p>
<h3>The family as a decision-making unit</h3>
<ul>
<li>Family purchase decisions are <strong>consensual</strong> (members agree on the goal and differ only on how to reach it) or <strong>accommodative</strong> (members have different preferences and resolve them through bargaining, coalitions or power). Between spouses, decisions may be <em>autonomic</em> (made by one person) or <em>syncratic</em> (made jointly); the balance shifts with the category and the culture.</li>
<li>Common family decision roles: initiator, gatekeeper (controls information), influencer, decider, buyer, preparer, user, maintainer and disposer.</li>
<li>The <strong>family life cycle</strong> (single, young couple, full nest, empty nest and so on) changes needs and budgets. Children influence many purchases and learn to be consumers through <strong>consumer socialization</strong>; in multi-generational households, grandparents can also shape choices.</li>
</ul>
<div class="callout"><span class="badge">Marketing implication</span> Map who influences, who decides and who pays. A children's learning app must convince the child (user), the parents (deciders and payers) and sometimes the teacher (opinion leader).</div>`,
    `<span class="eyebrow">MKT201 · Phần 5 · Bài 5.1</span>
<h2>Nhóm tham khảo, người dẫn dắt ý kiến, truyền miệng &amp; gia đình</h2>
<h3>Nhóm tham khảo</h3>
<p><strong>Nhóm tham khảo</strong> là một cá nhân hay nhóm có thật hoặc tưởng tượng có ảnh hưởng đáng kể tới sự đánh giá, khát vọng hoặc hành vi của một người.</p>
<table>
<tr><th>Loại nhóm</th><th>Ý nghĩa</th><th>Ví dụ</th></tr>
<tr><td>Nhóm thành viên</td><td>Nhóm mà người đó đang là thành viên</td><td>Bạn cùng lớp, câu lạc bộ bóng đá của trường</td></tr>
<tr><td>Nhóm ngưỡng mộ</td><td>Nhóm người đó ngưỡng mộ và muốn giống</td><td>Doanh nhân thành đạt, vận động viên được hâm mộ</td></tr>
<tr><td>Nhóm tách biệt (né tránh)</td><td>Nhóm người đó muốn giữ khoảng cách</td><td>Một phong cách mà thanh thiếu niên cho là "lỗi thời"</td></tr>
</table>
<p>Ảnh hưởng có ba dạng (Park và Lessig): <strong>thông tin</strong> (tìm thông tin từ chuyên gia hoặc quan sát thứ họ dùng), <strong>thực dụng</strong> (làm theo sở thích của những người mình tiếp xúc để được chấp nhận hoặc tránh bị chê trách) và <strong>biểu đạt giá trị</strong> (mua để thể hiện hoặc củng cố bản sắc của mình với một nhóm). Ảnh hưởng của nhóm mạnh nhất với sản phẩm được tiêu dùng <strong>công khai</strong> và với <strong>hàng xa xỉ</strong> ít người sở hữu, yếu nhất với hàng thiết yếu dùng riêng tư. Áp lực tuân thủ, sự so sánh xã hội và nỗi sợ bỏ lỡ (FOMO) khuếch đại những ảnh hưởng này trên mạng xã hội.</p>
<h3>Người dẫn dắt ý kiến, chuyên gia thị trường và người có ảnh hưởng</h3>
<ul>
<li><strong>Người dẫn dắt ý kiến</strong> hiểu biết và có mức độ liên quan cao với một loại sản phẩm cụ thể, thường giống người theo dõi về giá trị và hoàn cảnh (<em>tính đồng loại</em>), nên đáng tin. Ý tưởng kinh điển về <em>dòng chảy hai bước</em>: thông tin đi từ truyền thông tới người dẫn dắt ý kiến, rồi từ họ tới những người khác.</li>
<li><strong>Chuyên gia thị trường</strong> (market maven) có hiểu biết chung về thị trường — mua ở đâu, khi nào có giảm giá — ở nhiều loại sản phẩm và thích chia sẻ.</li>
<li><strong>Người tiêu dùng đại diện</strong> là cố vấn được trả tiền để ra hoặc định hướng quyết định (chuyên viên phối đồ, nhà thiết kế nội thất, người hoạch định tài chính).</li>
<li><strong>Người có ảnh hưởng trên mạng xã hội</strong> là người dẫn dắt ý kiến ở quy mô lớn. Các bậc nano, micro, macro và mega được xác định theo số người theo dõi, khác nhau giữa các nền tảng; người có ảnh hưởng nhỏ hơn thường có quan hệ gần gũi và được tin hơn. Hợp tác trả phí phải được công khai rõ ràng.</li>
</ul>
<h3>Truyền miệng và eWOM</h3>
<p><strong>Truyền miệng (WOM)</strong> là thông tin sản phẩm được truyền từ người này sang người khác. Nó có sức thuyết phục vì có vẻ độc lập với doanh nghiệp. Truyền miệng tiêu cực thường nặng ký hơn truyền miệng tích cực (<em>thiên kiến tiêu cực</em>). Truyền miệng điện tử (eWOM) lan nhanh hơn, tìm lại được và tới cả người lạ. <strong>Cộng đồng thương hiệu</strong> — nhóm những người hâm mộ một thương hiệu — có ba dấu hiệu chung (Muniz và O'Guinn): ý thức đồng loại, nghi thức và truyền thống, và tinh thần trách nhiệm với các thành viên khác.</p>
<h3>Gia đình như một đơn vị ra quyết định</h3>
<ul>
<li>Quyết định mua của gia đình là <strong>đồng thuận</strong> (các thành viên thống nhất mục tiêu, chỉ khác nhau về cách đạt được) hoặc <strong>dung hoà</strong> (các thành viên có sở thích khác nhau và giải quyết bằng thương lượng, liên minh hoặc quyền lực). Giữa vợ chồng, quyết định có thể là <em>tự quyết</em> (một người quyết) hoặc <em>cùng quyết</em>; cán cân thay đổi theo loại sản phẩm và nền văn hoá.</li>
<li>Các vai trò thường gặp trong quyết định gia đình: người khởi xướng, người gác cổng (kiểm soát thông tin), người ảnh hưởng, người quyết định, người mua, người chuẩn bị, người sử dụng, người bảo quản và người thải bỏ.</li>
<li><strong>Vòng đời gia đình</strong> (độc thân, vợ chồng trẻ, tổ ấm đầy đủ, tổ ấm vắng con…) làm thay đổi nhu cầu và ngân sách. Trẻ em ảnh hưởng tới nhiều lần mua và học cách làm người tiêu dùng qua quá trình <strong>xã hội hoá người tiêu dùng</strong>; trong gia đình nhiều thế hệ, ông bà cũng có thể định hình lựa chọn.</li>
</ul>
<div class="callout"><span class="badge">Hàm ý marketing</span> Hãy vẽ ra ai ảnh hưởng, ai quyết định và ai trả tiền. Một ứng dụng học tập cho trẻ em phải thuyết phục được trẻ (người dùng), bố mẹ (người quyết định và trả tiền) và đôi khi cả giáo viên (người dẫn dắt ý kiến).</div>`,
  ]]);

const c10 = doc('mkt201-5-2-culture-class-diffusion', '5.2 — Culture, subculture, social class & the diffusion of innovations|||5.2 — Văn hoá, nhánh văn hoá, tầng lớp xã hội & sự lan toả của đổi mới',
  'Văn hoá và các khía cạnh của Hofstede, nghi lễ, tiêu dùng thiêng liêng và trần tục, mô hình chuyển giao ý nghĩa văn hoá (McCracken), nhánh văn hoá, chủ nghĩa vị chủng tiêu dùng, tầng lớp xã hội, tiêu dùng phô trương, các loại vốn (Bourdieu), lan toả đổi mới (Rogers): năm nhóm người chấp nhận, năm đặc tính của đổi mới.',
  [[
    `<span class="eyebrow">MKT201 · Part 5 · Lesson 5.2</span>
<h2>Culture, subculture, social class &amp; the diffusion of innovations</h2>
<h3>Culture</h3>
<p><strong>Culture</strong> is the accumulation of shared meanings, rituals, norms and traditions among the members of a society. It is learned, shared and changes over time, and it shapes what people consider appropriate to buy, give and display.</p>
<ul>
<li><strong>Hofstede's dimensions</strong>: power distance, individualism–collectivism, masculinity–femininity (The Culture Factor’s comparison tool now labels it "Motivation towards Achievement and Success"), uncertainty avoidance, long-term orientation and indulgence–restraint. In more collectivist cultures family and group opinions weigh more in purchases; in cultures high in uncertainty avoidance, trusted brands and guarantees matter more. Treat country scores as tendencies, never as stereotypes of individuals.</li>
<li><strong>Rituals</strong>: consumption is full of rituals — gift-giving at Lunar New Year, weddings, graduation photos, daily grooming routines. Ritual artefacts (red envelopes, gift baskets, flowers) create large seasonal markets.</li>
<li><strong>Sacred and profane consumption</strong>: some objects, places and events are treated as extraordinary (family heirlooms, collections, memorabilia) and set apart from ordinary, everyday (profane) goods.</li>
<li><strong>Cultural meaning transfer</strong> (McCracken): meaning moves from the culturally constituted world into products through advertising and the fashion system, then from products to consumers through rituals of possession, exchange, grooming and divestment.</li>
</ul>
<h3>Subcultures</h3>
<p>A <strong>subculture</strong> is a group whose members share beliefs and common experiences that set them apart from others: ethnic and religious groups, regions (food, speech and taste differ across northern, central and southern Vietnam) and age cohorts — Gen X, Millennials, Gen Z — shaped by shared historical and technological experiences. <strong>Consumer ethnocentrism</strong>, the belief that buying domestic products is better or more appropriate, affects how consumers respond to imported brands.</p>
<h3>Social class</h3>
<p><strong>Social class</strong> is the overall rank of people in a society, determined mainly by occupation, education, income and wealth. People in the same class tend to share tastes and consumption patterns.</p>
<ul>
<li><strong>Conspicuous consumption</strong> (Veblen): displaying status through visible, expensive goods. Status symbols change as more people can afford them, pushing some consumers toward subtler signals.</li>
<li><strong>Forms of capital</strong> (Bourdieu): economic capital (money), social capital (networks and relationships) and cultural capital (knowledge and taste — for example knowing about art or fine food — that signal status).</li>
<li>Income predicts how much people can spend; social class often predicts better <em>how</em> they spend it. Research suggests class works better for visible, symbolic purchases, income for major non-status purchases such as household appliances, and combining both works best for expensive, symbolic products.</li>
</ul>
<h3>The diffusion of innovations (Rogers)</h3>
<table>
<tr><th>Adopter category</th><th>Share (Rogers, rounded from a normal curve)</th><th>Profile</th></tr>
<tr><td>Innovators</td><td>2.5%</td><td>Venturesome, tolerate risk</td></tr>
<tr><td>Early adopters</td><td>13.5%</td><td>Respected, often opinion leaders</td></tr>
<tr><td>Early majority</td><td>34%</td><td>Deliberate; adopt just before the average person</td></tr>
<tr><td>Late majority</td><td>34%</td><td>Sceptical; adopt out of necessity or peer pressure</td></tr>
<tr><td>Laggards</td><td>16%</td><td>Tradition-bound; adopt last, if at all</td></tr>
</table>
<p>An innovation spreads faster when it has high <strong>relative advantage</strong>, <strong>compatibility</strong> with existing values and habits, low <strong>complexity</strong>, and good <strong>trialability</strong> and <strong>observability</strong>. Innovations also differ in how much behavior they change: <em>continuous</em> (a new flavour), <em>dynamically continuous</em> (a smartwatch that extends the habit of wearing a watch) and <em>discontinuous</em> (a genuinely new way of living, such as smartphones or ride-hailing apps). Individuals move through Rogers' innovation-decision stages: knowledge, persuasion, decision, implementation and confirmation.</p>
<div class="callout"><span class="badge">Marketing implication</span> Launch plans should win innovators and early adopters first — they create the visibility and word of mouth that the early majority waits for.</div>`,
    `<span class="eyebrow">MKT201 · Phần 5 · Bài 5.2</span>
<h2>Văn hoá, nhánh văn hoá, tầng lớp xã hội &amp; sự lan toả của đổi mới</h2>
<h3>Văn hoá</h3>
<p><strong>Văn hoá</strong> là sự tích tụ những ý nghĩa, nghi lễ, chuẩn mực và truyền thống được các thành viên trong một xã hội chia sẻ. Văn hoá được học, được chia sẻ, thay đổi theo thời gian, và định hình điều người ta cho là phù hợp để mua, tặng và phô bày.</p>
<ul>
<li><strong>Các khía cạnh của Hofstede</strong>: khoảng cách quyền lực, chủ nghĩa cá nhân – tập thể, nam tính – nữ tính (công cụ so sánh của The Culture Factor hiện gọi chiều này là "Motivation towards Achievement and Success" — động lực hướng tới thành tích và thành công), né tránh bất định, định hướng dài hạn và tận hưởng – kiềm chế. Ở nền văn hoá thiên về tập thể, ý kiến gia đình và nhóm có trọng lượng lớn hơn trong việc mua; ở nền văn hoá né tránh bất định cao, thương hiệu uy tín và cam kết bảo đảm quan trọng hơn. Hãy coi điểm số quốc gia là xu hướng, không bao giờ là khuôn mẫu áp cho từng cá nhân.</li>
<li><strong>Nghi lễ</strong>: tiêu dùng đầy ắp nghi lễ — tặng quà dịp Tết Nguyên đán, đám cưới, chụp ảnh tốt nghiệp, thói quen chăm sóc bản thân hằng ngày. Vật phẩm nghi lễ (bao lì xì, giỏ quà, hoa) tạo ra những thị trường mùa vụ lớn.</li>
<li><strong>Tiêu dùng thiêng liêng và trần tục</strong>: một số đồ vật, địa điểm và sự kiện được coi là phi thường (vật gia truyền, bộ sưu tập, kỷ vật) và được tách khỏi hàng hoá bình thường, thường ngày (trần tục).</li>
<li><strong>Chuyển giao ý nghĩa văn hoá</strong> (McCracken): ý nghĩa đi từ thế giới được văn hoá kiến tạo vào sản phẩm qua quảng cáo và hệ thống thời trang, rồi từ sản phẩm tới người tiêu dùng qua các nghi thức sở hữu, trao đổi, chăm chút và từ bỏ.</li>
</ul>
<h3>Nhánh văn hoá</h3>
<p><strong>Nhánh văn hoá</strong> là nhóm có thành viên cùng chia sẻ niềm tin và trải nghiệm chung khiến họ khác với những người khác: nhóm dân tộc và tôn giáo, vùng miền (ẩm thực, giọng nói và khẩu vị khác nhau giữa miền Bắc, miền Trung và miền Nam Việt Nam) và các thế hệ — thế hệ X, Millennials, thế hệ Z — được định hình bởi trải nghiệm lịch sử và công nghệ chung. <strong>Chủ nghĩa vị chủng tiêu dùng</strong>, niềm tin rằng mua hàng nội tốt hơn hoặc đúng đắn hơn, ảnh hưởng tới cách người tiêu dùng đón nhận thương hiệu nhập khẩu.</p>
<h3>Tầng lớp xã hội</h3>
<p><strong>Tầng lớp xã hội</strong> là thứ bậc tổng thể của con người trong xã hội, được xác định chủ yếu bởi nghề nghiệp, học vấn, thu nhập và tài sản. Người cùng tầng lớp thường có thị hiếu và khuôn mẫu tiêu dùng giống nhau.</p>
<ul>
<li><strong>Tiêu dùng phô trương</strong> (Veblen): thể hiện địa vị qua hàng hoá đắt tiền, dễ nhìn thấy. Biểu tượng địa vị thay đổi khi nhiều người mua được chúng, đẩy một số người tiêu dùng sang những tín hiệu kín đáo hơn.</li>
<li><strong>Các dạng vốn</strong> (Bourdieu): vốn kinh tế (tiền), vốn xã hội (mạng lưới và quan hệ) và vốn văn hoá (hiểu biết và gu thẩm mỹ — ví dụ am hiểu nghệ thuật hay ẩm thực tinh tế — báo hiệu địa vị).</li>
<li>Thu nhập dự đoán người ta chi được bao nhiêu; tầng lớp xã hội thường dự đoán tốt hơn việc họ chi <em>như thế nào</em>. Nghiên cứu cho thấy tầng lớp dự đoán tốt hơn với hàng mang tính biểu tượng, dễ thấy; thu nhập tốt hơn với khoản chi lớn không gắn địa vị như đồ gia dụng; kết hợp cả hai là tốt nhất với hàng đắt tiền mang tính biểu tượng.</li>
</ul>
<h3>Sự lan toả của đổi mới (Rogers)</h3>
<table>
<tr><th>Nhóm người chấp nhận</th><th>Tỷ lệ (Rogers, làm tròn từ phân phối chuẩn)</th><th>Chân dung</th></tr>
<tr><td>Người đổi mới</td><td>2,5%</td><td>Thích mạo hiểm, chịu được rủi ro</td></tr>
<tr><td>Người chấp nhận sớm</td><td>13,5%</td><td>Được kính trọng, thường là người dẫn dắt ý kiến</td></tr>
<tr><td>Số đông sớm</td><td>34%</td><td>Thận trọng; chấp nhận ngay trước người bình thường</td></tr>
<tr><td>Số đông muộn</td><td>34%</td><td>Hoài nghi; chấp nhận vì cần thiết hoặc áp lực từ người xung quanh</td></tr>
<tr><td>Người chậm chân</td><td>16%</td><td>Bám truyền thống; chấp nhận sau cùng, hoặc không bao giờ</td></tr>
</table>
<p>Một đổi mới lan nhanh hơn khi có <strong>lợi thế tương đối</strong> cao, <strong>tương thích</strong> với giá trị và thói quen hiện có, <strong>độ phức tạp</strong> thấp, dễ <strong>dùng thử</strong> và dễ <strong>quan sát</strong>. Các đổi mới cũng khác nhau ở mức thay đổi hành vi mà chúng đòi hỏi: <em>liên tục</em> (một hương vị mới), <em>liên tục động</em> (đồng hồ thông minh mở rộng thói quen đeo đồng hồ) và <em>gián đoạn</em> (một cách sống thật sự mới, như điện thoại thông minh hay ứng dụng gọi xe). Mỗi cá nhân đi qua các giai đoạn quyết định chấp nhận đổi mới của Rogers: hiểu biết, bị thuyết phục, quyết định, thực hiện và khẳng định.</p>
<div class="callout"><span class="badge">Hàm ý marketing</span> Kế hoạch ra mắt nên chinh phục người đổi mới và người chấp nhận sớm trước — họ tạo ra sự hiện diện và truyền miệng mà số đông sớm đang chờ đợi.</div>`,
  ]]);

const c11 = doc('mkt201-5-3-digital-journey-ethics', '5.3 — The digital consumer journey, online reviews & ethics|||5.3 — Hành trình khách hàng số, đánh giá trực tuyến & đạo đức',
  'Từ phễu tới hành trình quyết định (vòng trung thành, ZMOT), điểm chạm số theo giai đoạn, showrooming và webrooming, thương mại xã hội, đánh giá trực tuyến và đánh giá giả, cá nhân hoá và nghịch lý quyền riêng tư, người tiêu dùng dễ bị tổn thương, dark patterns và trách nhiệm đạo đức.',
  [[
    `<span class="eyebrow">MKT201 · Part 5 · Lesson 5.3</span>
<h2>The digital consumer journey, online reviews &amp; ethics</h2>
<h3>From funnel to journey</h3>
<p>The classic funnel suggested that consumers narrow a list of brands step by step. McKinsey's work on the <strong>consumer decision journey</strong> described a loop instead: an initial consideration set, <strong>active evaluation</strong> in which brands are added as well as dropped, the <strong>moment of purchase</strong>, and a <strong>post-purchase experience</strong> that can create a <strong>loyalty loop</strong> which skips the search next time. Google called the online research consumers do before reaching the shelf or checkout the <strong>zero moment of truth (ZMOT)</strong>, ahead of the "first moment of truth" at the point of sale.</p>
<table>
<tr><th>Journey stage</th><th>Typical digital touchpoints</th><th>What the consumer needs</th></tr>
<tr><td>Trigger / awareness</td><td>Short videos, feeds, search ads, friends' posts</td><td>A reason to notice</td></tr>
<tr><td>Consideration / evaluation</td><td>Search, comparison content, reviews, livestreams, product pages</td><td>Evidence, comparisons, social proof</td></tr>
<tr><td>Purchase</td><td>Marketplaces, apps, checkout, payment and delivery options</td><td>Low friction, trust, a clear total price</td></tr>
<tr><td>Experience / retention</td><td>Unboxing, onboarding messages, customer-service chat</td><td>Performance that meets expectations</td></tr>
<tr><td>Advocacy</td><td>Reviews, user-generated content, referral programs</td><td>An easy, rewarding way to share</td></tr>
</table>
<p>Consumers move freely across channels: <strong>showrooming</strong> (examining a product in a store, then buying it online) and <strong>webrooming</strong> (researching online, then buying in a store). <strong>Social commerce</strong> and livestream selling merge entertainment, social proof and instant purchase, which also fuels impulse buying.</p>
<h3>Online reviews</h3>
<ul>
<li>Shoppers read the <strong>valence</strong> (average rating), <strong>volume</strong> (number of reviews), <strong>variance</strong> and <strong>recency</strong>. A perfect score can look too good to be true; a few honest negative reviews often make a rating more believable.</li>
<li>Reviews reduce perceived risk, especially for experience goods that cannot be judged before use (restaurants, cosmetics, online courses).</li>
<li><strong>Fake reviews</strong>, incentivized reviews without disclosure and review-gating (asking only happy customers to review) deceive consumers and erode trust in the whole system.</li>
<li>Responding publicly and constructively to complaints can win back dissatisfied customers and shows future buyers how the brand behaves.</li>
</ul>
<h3>Personalization and the privacy paradox</h3>
<p>Algorithms personalize feeds, offers and recommendations using behavioral data. Many consumers say they value privacy yet share data for small benefits — the <strong>privacy paradox</strong>. Clear consent and a fair, visible value exchange build more trust than hidden tracking.</p>
<h3>Ethics and vulnerable consumers</h3>
<p><strong>Vulnerable consumers</strong> are people more likely to be harmed in the marketplace because of age, limited knowledge or literacy, financial pressure, illness, disability or emotional state — for example children, older people new to online shopping, and people in debt. Practices that deserve particular scrutiny:</p>
<ul>
<li><strong>Dark patterns</strong> — interface designs that trick users: costs added only at the last checkout step, fake countdown timers or "only 1 left" claims, pre-ticked add-ons, subscriptions that are easy to start but hard to cancel, and "confirmshaming" wording.</li>
<li>Advertising to children who cannot yet recognize persuasive intent, and influencer advertising that is not disclosed.</li>
<li>Hidden shrinkflation (Part 2, Exercise 1) and misleading "was/now" reference prices.</li>
<li>Easy credit and "buy now, pay later" offers that encourage compulsive buying.</li>
</ul>
<p>In Vietnam, the Law on Protection of Consumers' Rights (2023) contains provisions on vulnerable consumers and on business obligations, including in online transactions — check the text currently in force and its guiding regulations before applying them. A useful ethical test: would consumers still endorse the choice if they fully understood how it was designed?</p>
<div class="callout"><span class="badge">Remember</span> Consumer psychology is a powerful tool. The same knowledge that removes friction for customers can be used to exploit their biases — and long-term trust is the better business model.</div>`,
    `<span class="eyebrow">MKT201 · Phần 5 · Bài 5.3</span>
<h2>Hành trình khách hàng số, đánh giá trực tuyến &amp; đạo đức</h2>
<h3>Từ phễu tới hành trình</h3>
<p>Mô hình phễu kinh điển cho rằng người tiêu dùng thu hẹp danh sách thương hiệu từng bước một. Nghiên cứu của McKinsey về <strong>hành trình quyết định của người tiêu dùng</strong> lại mô tả một vòng lặp: tập cân nhắc ban đầu, giai đoạn <strong>đánh giá chủ động</strong> trong đó thương hiệu vừa bị loại vừa được thêm vào, <strong>thời điểm mua</strong>, và <strong>trải nghiệm sau mua</strong> có thể tạo ra <strong>vòng trung thành</strong> giúp bỏ qua bước tìm kiếm ở lần sau. Google gọi việc tìm hiểu trực tuyến mà người tiêu dùng làm trước khi tới kệ hàng hay trang thanh toán là <strong>khoảnh khắc sự thật số không (ZMOT)</strong>, đứng trước "khoảnh khắc sự thật đầu tiên" tại điểm bán.</p>
<table>
<tr><th>Giai đoạn hành trình</th><th>Điểm chạm số điển hình</th><th>Người tiêu dùng cần gì</th></tr>
<tr><td>Kích hoạt / nhận biết</td><td>Video ngắn, bảng tin, quảng cáo tìm kiếm, bài đăng của bạn bè</td><td>Một lý do để chú ý</td></tr>
<tr><td>Cân nhắc / đánh giá</td><td>Tìm kiếm, nội dung so sánh, đánh giá, livestream, trang sản phẩm</td><td>Bằng chứng, so sánh, bằng chứng xã hội</td></tr>
<tr><td>Mua</td><td>Sàn thương mại điện tử, ứng dụng, thanh toán, lựa chọn trả tiền và giao hàng</td><td>Ít trở ngại, sự tin tưởng, tổng giá rõ ràng</td></tr>
<tr><td>Trải nghiệm / giữ chân</td><td>Đập hộp, tin nhắn hướng dẫn sử dụng, chat chăm sóc khách hàng</td><td>Hiệu quả sử dụng đáp ứng kỳ vọng</td></tr>
<tr><td>Ủng hộ</td><td>Đánh giá, nội dung do người dùng tạo, chương trình giới thiệu</td><td>Cách chia sẻ dễ dàng và có thưởng</td></tr>
</table>
<p>Người tiêu dùng di chuyển tự do giữa các kênh: <strong>showrooming</strong> (xem hàng ở cửa hàng rồi mua trực tuyến) và <strong>webrooming</strong> (tìm hiểu trực tuyến rồi mua ở cửa hàng). <strong>Thương mại xã hội</strong> và bán hàng qua livestream kết hợp giải trí, bằng chứng xã hội và mua ngay lập tức, đồng thời tiếp sức cho mua bốc đồng.</p>
<h3>Đánh giá trực tuyến</h3>
<ul>
<li>Người mua đọc <strong>chiều hướng</strong> (điểm trung bình), <strong>số lượng</strong> đánh giá, <strong>độ phân tán</strong> và <strong>độ mới</strong>. Điểm tuyệt đối có thể trông khó tin; vài đánh giá tiêu cực trung thực thường làm điểm số đáng tin hơn.</li>
<li>Đánh giá làm giảm rủi ro cảm nhận, nhất là với hàng trải nghiệm không thể đánh giá trước khi dùng (nhà hàng, mỹ phẩm, khoá học trực tuyến).</li>
<li><strong>Đánh giá giả</strong>, đánh giá được thưởng mà không công khai, và "lọc đánh giá" (chỉ mời khách hài lòng viết đánh giá) lừa dối người tiêu dùng và làm xói mòn niềm tin vào cả hệ thống.</li>
<li>Trả lời công khai và mang tính xây dựng trước các khiếu nại có thể lấy lại khách không hài lòng và cho người mua tương lai thấy thương hiệu cư xử thế nào.</li>
</ul>
<h3>Cá nhân hoá và nghịch lý quyền riêng tư</h3>
<p>Thuật toán cá nhân hoá bảng tin, ưu đãi và gợi ý dựa trên dữ liệu hành vi. Nhiều người nói coi trọng quyền riêng tư nhưng vẫn chia sẻ dữ liệu để đổi lấy lợi ích nhỏ — <strong>nghịch lý quyền riêng tư</strong>. Sự đồng ý rõ ràng và một cuộc trao đổi giá trị công bằng, minh bạch tạo ra nhiều niềm tin hơn việc theo dõi ngầm.</p>
<h3>Đạo đức và người tiêu dùng dễ bị tổn thương</h3>
<p><strong>Người tiêu dùng dễ bị tổn thương</strong> là những người dễ chịu thiệt hại trên thị trường hơn vì tuổi tác, hiểu biết hay khả năng đọc hiểu hạn chế, áp lực tài chính, bệnh tật, khuyết tật hoặc trạng thái cảm xúc — ví dụ trẻ em, người cao tuổi mới làm quen mua sắm trực tuyến, và người đang mắc nợ. Những cách làm cần đặc biệt xem xét:</p>
<ul>
<li><strong>Dark patterns</strong> (mẫu thiết kế lừa dối) — giao diện đánh lừa người dùng: chi phí chỉ hiện ra ở bước thanh toán cuối cùng, đồng hồ đếm ngược hay thông báo "chỉ còn 1 sản phẩm" giả, dịch vụ kèm theo được tích sẵn, gói thuê bao dễ đăng ký nhưng khó huỷ, và câu chữ "làm xấu hổ" người từ chối.</li>
<li>Quảng cáo nhắm tới trẻ em khi các em chưa nhận ra ý đồ thuyết phục, và quảng cáo qua người có ảnh hưởng mà không công khai.</li>
<li>Thu nhỏ gói hàng ngầm (Phần 2, Bài tập 1) và giá tham chiếu "giá cũ/giá mới" gây hiểu lầm.</li>
<li>Tín dụng dễ dãi và "mua trước trả sau" khuyến khích mua sắm cưỡng chế.</li>
</ul>
<p>Ở Việt Nam, Luật Bảo vệ quyền lợi người tiêu dùng (2023) có các quy định về người tiêu dùng là đối tượng dễ bị tổn thương và về nghĩa vụ của doanh nghiệp, kể cả trong giao dịch trực tuyến — kiểm văn bản đang có hiệu lực và các văn bản hướng dẫn trước khi áp dụng. Một phép thử đạo đức hữu ích: người tiêu dùng có còn tán thành lựa chọn đó nếu họ hiểu đầy đủ nó được thiết kế ra sao không?</p>
<div class="callout"><span class="badge">Ghi nhớ</span> Tâm lý học người tiêu dùng là một công cụ mạnh. Cùng một hiểu biết có thể giúp khách hàng bớt trở ngại, hoặc bị dùng để khai thác thiên kiến của họ — và niềm tin lâu dài mới là mô hình kinh doanh tốt hơn.</div>`,
  ]]);

const c11e = doc('mkt201-5-4-exercise', 'Exercise 3 — ELM and the customer journey for an oat-milk launch|||Bài tập 3 — ELM và hành trình khách hàng khi ra mắt sữa yến mạch',
  'Bài tập tình huống giả định: tính tỷ lệ chuyển đổi qua từng giai đoạn hành trình và chi phí mỗi đơn hàng, tìm điểm nghẽn so với chuẩn giả định, giải thích bằng ELM, thiết kế nội dung theo đường trung tâm và ngoại vi cho hai nhóm khách, ước tính tác động khi gỡ điểm nghẽn; kèm lời giải.',
  [[
    `<span class="eyebrow">MKT201 · Part 5 · Exercise</span>
<h2>Exercise 3 — where does the campaign lose people, and why?</h2>
<div class="callout"><span class="badge">Problem</span> GreenGrain, a fictional oat-milk brand, runs a 4-week launch campaign with a budget of VND 150,000,000 (all figures illustrative). It targets two audiences: <strong>A</strong> — young parents who read nutrition labels before buying for their children (high involvement); <strong>B</strong> — office workers who scroll short videos on their phones (low involvement). Results: 800,000 people reached; 40,000 engaged (watched most of a video or clicked); 12,000 visited the product page; 1,800 added to cart; 900 purchased; 90 wrote a review. Assumed benchmarks for similar launches: engagement 4% of reach, page visits 25% of engaged, add-to-cart 20% of visits, purchase 60% of carts, reviews 8% of buyers. (a) Compute the stage conversion rates and the cost per purchase. (b) Find the bottlenecks and explain them with the ELM. (c) Design ELM-matched content for each audience along the journey. (d) Estimate the effect of fixing the bottlenecks with the same budget.</div>
<h3>Worked solution</h3>
<pre><code class="language-text">(a) Stage              Count      Rate                        Benchmark
    Engaged            40,000     40,000 / 800,000 =  5.0%    4%    ok
    Product-page visit 12,000     12,000 / 40,000  = 30.0%    25%   ok
    Add to cart         1,800      1,800 / 12,000  = 15.0%    20%   BELOW
    Purchase              900        900 / 1,800   = 50.0%    60%   BELOW
    Review                 90         90 / 900     = 10.0%    8%    ok
    Cost per purchase = 150,000,000 / 900 = VND 166,667

(d) Add-to-cart raised to 20%: 12,000 x 20% = 2,400 carts x 50% = 1,200 purchases
       → cost per purchase = 150,000,000 / 1,200 = VND 125,000
    Checkout also raised to 60%: 2,400 x 60% = 1,440 purchases
       → cost per purchase = 150,000,000 / 1,440 = VND 104,167</code></pre>
<p><strong>(b) Diagnosis.</strong> The peripheral content works: engagement and page visits beat the benchmarks. People are lost on the product page and at checkout. The funnel figures are pooled across both audiences, so the explanation below is a hypothesis to test, not a finding. A likely explanation: visitors who reach the product page — especially audience A — have switched to the <strong>central route</strong>: they are motivated (it is for their child) and able to process (they are reading, not scrolling). If the page is built like the ad (a big photo and a slogan), it gives them no arguments to weigh. The checkout drop looks like a purchase-stage problem of friction and trust — for example surprise shipping costs or few payment options — rather than persuasion. To test it: split the funnel by audience A and B, check time on page and scroll or heatmap data, ask cart abandoners why they stopped, and A/B-test a new product page against the current one.</p>
<table>
<tr><th>Journey stage</th><th>Audience A — central route</th><th>Audience B — peripheral route</th></tr>
<tr><td>Awareness</td><td>Short video in which a nutritionist asks "What is in your child's milk?" — a credible source</td><td>A humorous 10-second video with catchy music and a likeable creator; pack and logo clearly visible</td></tr>
<tr><td>Consideration</td><td>Product page with a nutrition table per 100 ml, an honest comparison with dairy milk (including where oat milk is lower, such as protein), allergen information and a two-sided message that admits any trade-offs of the (fictional) product honestly</td><td>Social proof: number of ratings, a best-seller badge, office sampling days</td></tr>
<tr><td>Purchase</td><td>Show the total price including shipping early, a small trial pack, easy returns</td><td>A bundle offer, one-tap payment, clear delivery time</td></tr>
<tr><td>Retention and advocacy</td><td>Recipes for children, a subscription that is as easy to cancel as to start, a request for detailed reviews</td><td>A user-content challenge, referral codes</td></tr>
</table>
<p><strong>Why:</strong> the ELM predicts that attitudes formed through the central route last longer and predict repeat buying — exactly what parents need to become loyal — while peripheral attitudes need frequent reminders. Fixing add-to-cart — the stage furthest below its benchmark in relative terms (15% against 20%, i.e. 75% of benchmark; checkout is at 50 / 60 ≈ 83%) — adds 300 purchases (900 → 1,200) with the same media budget; fixing only checkout (50% → 60%) would give 1,080 (+180). Assuming the page and checkout changes cost little compared with the VND 150,000,000 budget, this is cheaper than buying more reach at the top of the journey. Three ethical limits apply: influencer partnerships must be disclosed; nutrition or health claims must be true and comply with food-advertising rules — no fake countdowns or pre-ticked add-ons at checkout; and because audience A buys for children, the case assumes the drink is for children over 3 as one drink among others — plant milks are not a nutritional equivalent of dairy milk for young children and never a substitute for breast milk or formula. Check the rules on advertising products for young children (Vietnam has specific rules for nutrition products for children under 24 months) and on using health professionals or experts in food advertising; the texts in force may have changed.</p>`,
    `<span class="eyebrow">MKT201 · Phần 5 · Bài tập</span>
<h2>Bài tập 3 — chiến dịch đánh rơi khách ở đâu, và vì sao?</h2>
<div class="callout"><span class="badge">Đề</span> GreenGrain, một thương hiệu sữa yến mạch giả định, chạy chiến dịch ra mắt 4 tuần với ngân sách 150.000.000 đồng (mọi số liệu là minh hoạ giả định). Chiến dịch nhắm tới hai nhóm: <strong>A</strong> — bố mẹ trẻ đọc bảng thành phần dinh dưỡng trước khi mua cho con (mức độ liên quan cao); <strong>B</strong> — nhân viên văn phòng lướt video ngắn trên điện thoại (mức độ liên quan thấp). Kết quả: tiếp cận 800.000 người; 40.000 người tương tác (xem gần hết video hoặc nhấp chuột); 12.000 người vào trang sản phẩm; 1.800 người thêm vào giỏ; 900 người mua; 90 người viết đánh giá. Chuẩn giả định của các lần ra mắt tương tự: tương tác 4% số người tiếp cận, vào trang 25% số người tương tác, thêm vào giỏ 20% số lượt vào trang, mua 60% số giỏ hàng, đánh giá 8% số người mua. (a) Tính tỷ lệ chuyển đổi từng giai đoạn và chi phí mỗi đơn hàng. (b) Tìm điểm nghẽn và giải thích bằng ELM. (c) Thiết kế nội dung khớp ELM cho từng nhóm dọc theo hành trình. (d) Ước tính tác động khi gỡ các điểm nghẽn với cùng ngân sách.</div>
<h3>Lời giải</h3>
<pre><code class="language-text">(a) Giai đoạn          Số lượng   Tỷ lệ                       Chuẩn
    Tương tác          40.000     40.000 / 800.000 =  5,0%    4%    đạt
    Vào trang sản phẩm 12.000     12.000 / 40.000  = 30,0%    25%   đạt
    Thêm vào giỏ        1.800      1.800 / 12.000  = 15,0%    20%   DƯỚI CHUẨN
    Mua                   900        900 / 1.800   = 50,0%    60%   DƯỚI CHUẨN
    Đánh giá               90         90 / 900     = 10,0%    8%    đạt
    Chi phí mỗi đơn hàng = 150.000.000 / 900 = 166.667 đồng

(d) Nâng tỷ lệ thêm vào giỏ lên 20%: 12.000 x 20% = 2.400 giỏ x 50% = 1.200 đơn
       → chi phí mỗi đơn = 150.000.000 / 1.200 = 125.000 đồng
    Nâng thêm tỷ lệ thanh toán lên 60%: 2.400 x 60% = 1.440 đơn
       → chi phí mỗi đơn = 150.000.000 / 1.440 = 104.167 đồng</code></pre>
<p><strong>(b) Chẩn đoán.</strong> Nội dung ngoại vi đang hiệu quả: tương tác và lượt vào trang đều vượt chuẩn. Khách bị rơi ở trang sản phẩm và ở bước thanh toán. Số liệu phễu là số gộp của cả hai nhóm, nên phần giải thích dưới đây là giả thuyết cần kiểm chứng, chưa phải kết luận. Giả thuyết hợp lý nhất: người đã tới trang sản phẩm — nhất là nhóm A — đã chuyển sang <strong>đường trung tâm</strong>: họ có động lực (sữa cho con mình) và có khả năng xử lý (họ đang đọc chứ không lướt). Nếu trang sản phẩm làm giống quảng cáo (ảnh to và một câu khẩu hiệu), nó không cho họ lập luận nào để cân nhắc. Tỷ lệ rơi ở bước thanh toán nhiều khả năng là vấn đề trở ngại và niềm tin của giai đoạn mua — ví dụ phí giao hàng bất ngờ hay ít cách thanh toán — chứ không phải vấn đề thuyết phục. Cách kiểm chứng: tách phễu theo nhóm A và B, xem thời gian trên trang và dữ liệu cuộn trang hoặc bản đồ nhiệt, hỏi khách bỏ giỏ vì sao họ dừng, và thử nghiệm A/B trang sản phẩm mới so với trang hiện tại.</p>
<table>
<tr><th>Giai đoạn hành trình</th><th>Nhóm A — đường trung tâm</th><th>Nhóm B — đường ngoại vi</th></tr>
<tr><td>Nhận biết</td><td>Video ngắn trong đó chuyên gia dinh dưỡng hỏi "Trong sữa của con bạn có gì?" — một nguồn phát đáng tin</td><td>Video hài hước 10 giây, nhạc bắt tai, người sáng tạo nội dung dễ mến; bao bì và logo hiện rõ</td></tr>
<tr><td>Cân nhắc</td><td>Trang sản phẩm có bảng dinh dưỡng trên 100 ml, so sánh trung thực với sữa bò (kể cả chỗ sữa yến mạch thấp hơn, như chất đạm), thông tin chất gây dị ứng, và thông điệp hai chiều thừa nhận trung thực những điểm đánh đổi của sản phẩm (giả định)</td><td>Bằng chứng xã hội: số lượt đánh giá, nhãn bán chạy, ngày dùng thử tại văn phòng</td></tr>
<tr><td>Mua</td><td>Hiện tổng giá gồm phí giao hàng ngay từ đầu, gói dùng thử nhỏ, đổi trả dễ</td><td>Ưu đãi mua theo combo, thanh toán một chạm, thời gian giao rõ ràng</td></tr>
<tr><td>Giữ chân và ủng hộ</td><td>Công thức món ăn cho trẻ, gói định kỳ huỷ dễ như lúc đăng ký, lời mời viết đánh giá chi tiết</td><td>Thử thách nội dung do người dùng tạo, mã giới thiệu</td></tr>
</table>
<p><strong>Vì sao:</strong> ELM dự đoán thái độ hình thành qua đường trung tâm bền hơn và dự đoán được việc mua lặp lại — đúng thứ cần để bố mẹ trở thành khách trung thành — còn thái độ qua đường ngoại vi cần được nhắc lại thường xuyên. Gỡ bước thêm vào giỏ — giai đoạn hụt chuẩn nhiều nhất tính theo tỷ lệ (15% so với 20%, tức 75% chuẩn; bước thanh toán đạt 50 / 60 ≈ 83% chuẩn) — mang thêm 300 đơn (900 → 1.200) với cùng ngân sách quảng cáo; chỉ sửa bước thanh toán (50% → 60%) thì được 1.080 đơn (+180). Giả định chi phí sửa trang và bước thanh toán nhỏ so với ngân sách 150.000.000 đồng, cách này rẻ hơn việc mua thêm lượt tiếp cận ở đầu hành trình. Có ba giới hạn đạo đức: hợp tác với người có ảnh hưởng phải được công khai; tuyên bố về dinh dưỡng hay sức khoẻ phải đúng sự thật và tuân thủ quy định quảng cáo thực phẩm — không đồng hồ đếm ngược giả, không tích sẵn sản phẩm kèm theo ở bước thanh toán; và vì nhóm A mua cho con, tình huống giả định sản phẩm dành cho trẻ trên 3 tuổi như một thức uống bên cạnh các thức uống khác — sữa thực vật không tương đương sữa bò về dinh dưỡng với trẻ nhỏ và không bao giờ thay thế sữa mẹ hay sữa công thức. Hãy kiểm quy định về quảng cáo sản phẩm cho trẻ nhỏ (Việt Nam có quy định riêng cho sản phẩm dinh dưỡng dùng cho trẻ dưới 24 tháng tuổi) và về việc dùng nhân viên y tế hay chuyên gia trong quảng cáo thực phẩm; văn bản đang có hiệu lực có thể đã thay đổi.</p>`,
  ]]);

const c11q = quiz('mkt201-quiz-5', 'Quiz 5 — Groups, culture & the digital consumer|||Quiz 5 — Nhóm, văn hoá & người tiêu dùng số', [
  { id: 'q1', question: 'In Rogers’ diffusion model, what share of adopters are innovators and early adopters combined?|||Trong mô hình lan toả của Rogers, người đổi mới và người chấp nhận sớm cộng lại chiếm bao nhiêu phần trăm?', options: ['2.5%|||2,5%', '34%|||34%', '16%|||16%', '50%|||50%'], correctIndex: 2, explanation: 'Innovators 2.5% + early adopters 13.5% = 16%. Adding the early majority (34%) gives 50%.|||Người đổi mới 2,5% + người chấp nhận sớm 13,5% = 16%. Cộng thêm số đông sớm (34%) mới được 50%.' },
  { id: 'q2', question: 'A shopper tries on shoes in a mall, then orders the same pair online at a lower price. This behavior is called…|||Một người thử giày ở trung tâm thương mại, rồi đặt mua đúng đôi đó trên mạng với giá thấp hơn. Hành vi này gọi là…', options: ['webrooming|||webrooming', 'showrooming|||showrooming', 'the loyalty loop|||vòng trung thành', 'review-gating|||lọc đánh giá'], correctIndex: 1, explanation: 'Showrooming is examining in a store and buying online; webrooming is the reverse.|||Showrooming là xem ở cửa hàng rồi mua trực tuyến; webrooming là chiều ngược lại.' },
  { id: 'q3', question: 'A student buys the same sneaker brand as her friends mainly to be accepted by them. Which type of reference-group influence is this?|||Một sinh viên mua cùng thương hiệu giày với bạn bè chủ yếu để được nhóm chấp nhận. Đây là dạng ảnh hưởng nào của nhóm tham khảo?', options: ['Utilitarian (normative)|||Thực dụng (chuẩn mực)', 'Informational|||Thông tin', 'Value-expressive|||Biểu đạt giá trị', 'Dissociative|||Tách biệt'], correctIndex: 0, explanation: 'Complying with the preferences of people one interacts with to gain approval is utilitarian influence; buying to express an identity would be value-expressive. Both are often grouped as normative influence; the difference is seeking approval versus expressing an identity.|||Làm theo sở thích của những người mình tiếp xúc để được chấp nhận là ảnh hưởng thực dụng; mua để thể hiện bản sắc mới là biểu đạt giá trị. Cả hai thường được xếp chung vào ảnh hưởng chuẩn mực; khác biệt nằm ở chỗ tìm sự chấp nhận hay thể hiện bản sắc.' },
]);

const taiLieu = doc('mkt201-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách (kèm link), tài liệu chính thức miễn phí, YouTube, công cụ, lộ trình tự học.',
  [[
    `<span class="eyebrow">MKT201 · 📚 Resource hub</span>
<h2>Course materials &amp; references</h2>
<p class="lead">One hub for learning consumer behavior: the official syllabus and slides, books, free official resources, video channels, tools and a self-study roadmap.</p>
<h3>📘 Syllabus &amp; slides</h3>
<p>Sign in to <strong>FLM</strong> (<a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">flm.fpt.edu.vn</a>) with your FPTU account to read the official MKT201 syllabus and lecture slides.</p>
<h3>📗 Books</h3>
<ul>
<li><a href="https://www.pearson.com/en-us/subject-catalog/p/consumer-behavior-buying-having-being/P200000009740/9780138170806" target="_blank" rel="noopener">Consumer Behavior: Buying, Having, Being</a> — Michael R. Solomon (Pearson): the reference text this course follows most closely.</li>
<li><a href="https://openstax.org/details/books/principles-marketing" target="_blank" rel="noopener">Principles of Marketing</a> — OpenStax: a free open textbook; its chapter on consumer markets and purchasing behavior is a good review.</li>
<li>Also used for the course structure: Schiffman &amp; Wisenblit, <em>Consumer Behavior</em> (<a href="https://www.pearson.com/" target="_blank" rel="noopener">Pearson</a>) and Hoyer, MacInnis &amp; Pieters, <em>Consumer Behavior</em> (<a href="https://www.cengage.com/" target="_blank" rel="noopener">Cengage</a>) — search the titles on the publishers' sites.</li>
</ul>
<h3>🌐 Free official resources</h3>
<ul>
<li><a href="https://openstax.org/details/books/psychology-2e" target="_blank" rel="noopener">Psychology 2e</a> — OpenStax: free chapters on sensation and perception, learning, memory, motivation, personality and social psychology.</li>
<li><a href="https://www.thinkwithgoogle.com/" target="_blank" rel="noopener">Think with Google</a> — consumer insights and articles on the digital decision journey.</li>
<li><a href="https://www.ftc.gov/influencers" target="_blank" rel="noopener">FTC — Disclosures 101 for Social Media Influencers</a> — a clear US guide to disclosing paid partnerships.</li>
<li><a href="https://unctad.org/topic/competition-and-consumer-protection" target="_blank" rel="noopener">UNCTAD — Competition and consumer protection</a> — international consumer-protection work, including vulnerable consumers.</li>
</ul>
<h3>▶️ YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@crashcourse" target="_blank" rel="noopener">CrashCourse</a> — the Psychology series explains perception, learning, memory and persuasion.</li>
<li><a href="https://www.youtube.com/@thinkwithgoogle" target="_blank" rel="noopener">Think with Google</a> — talks on consumer journeys and digital behavior.</li>
<li><a href="https://www.youtube.com/@HubSpotMarketing" target="_blank" rel="noopener">HubSpot Marketing</a> — practical content on buyer journeys and customer experience.</li>
<li><a href="https://www.youtube.com/@TED" target="_blank" rel="noopener">TED</a> — talks on decision making, behavioral economics and influence.</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://www.google.com/sheets/about/" target="_blank" rel="noopener">Google Sheets</a> — Fishbein attitude scores, Weber thresholds and journey conversion rates.</li>
<li><a href="https://trends.google.com/" target="_blank" rel="noopener">Google Trends</a> — see what consumers search for, by season and region.</li>
<li><a href="https://miro.com/" target="_blank" rel="noopener">Miro</a> — map customer journeys, touchpoints and laddering interviews.</li>
<li><a href="https://www.theculturefactor.com/country-comparison-tool" target="_blank" rel="noopener">The Culture Factor — Country comparison tool</a> — compare Hofstede's dimensions across countries.</li>
</ul>
<h3>🎯 Self-study roadmap</h3>
<ol>
<li><strong>Foundations (exam core)</strong> — involvement, perception, learning, motivation and attitudes, following Parts 1–4 here.</li>
<li><strong>Practise</strong> — redo the Weber and Fishbein exercises with your own numbers in a spreadsheet.</li>
<li><strong>Go deeper</strong> — run five laddering interviews with friends about one product and draw the means–end chains.</li>
<li><strong>Apply</strong> — map the journey of a real purchase you made, mark each touchpoint and classify the content as central or peripheral.</li>
</ol>
<div class="callout"><span class="badge">Note</span> An original hub of real links — no copyrighted slides or books are embedded. If a link moves, start from the official homepage.</div>`,
    `<span class="eyebrow">MKT201 · 📚 Trung tâm tài liệu</span>
<h2>Tài liệu tham khảo môn học</h2>
<p class="lead">Một nơi gom để học hành vi người tiêu dùng: giáo trình &amp; slide chính thức, sách, tài liệu miễn phí chính thống, kênh video, công cụ, và lộ trình tự học.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Đăng nhập <strong>FLM</strong> (<a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">flm.fpt.edu.vn</a>) bằng tài khoản FPTU để đọc giáo trình và slide bài giảng chính thức của MKT201.</p>
<h3>📗 Sách</h3>
<ul>
<li><a href="https://www.pearson.com/en-us/subject-catalog/p/consumer-behavior-buying-having-being/P200000009740/9780138170806" target="_blank" rel="noopener">Consumer Behavior: Buying, Having, Being</a> — Michael R. Solomon (Pearson): giáo trình tham chiếu mà môn học bám sát nhất.</li>
<li><a href="https://openstax.org/details/books/principles-marketing" target="_blank" rel="noopener">Principles of Marketing</a> — OpenStax: giáo trình mở miễn phí; chương về thị trường người tiêu dùng và hành vi mua là phần ôn tập tốt.</li>
<li>Cấu trúc môn còn tham khảo: Schiffman &amp; Wisenblit, <em>Consumer Behavior</em> (<a href="https://www.pearson.com/" target="_blank" rel="noopener">Pearson</a>) và Hoyer, MacInnis &amp; Pieters, <em>Consumer Behavior</em> (<a href="https://www.cengage.com/" target="_blank" rel="noopener">Cengage</a>) — tra tên sách trên trang nhà xuất bản.</li>
</ul>
<h3>🌐 Tài liệu chính thức miễn phí</h3>
<ul>
<li><a href="https://openstax.org/details/books/psychology-2e" target="_blank" rel="noopener">Psychology 2e</a> — OpenStax: các chương miễn phí về cảm giác và tri giác, học hỏi, trí nhớ, động cơ, tính cách và tâm lý học xã hội.</li>
<li><a href="https://www.thinkwithgoogle.com/" target="_blank" rel="noopener">Think with Google</a> — hiểu biết về người tiêu dùng và bài viết về hành trình quyết định trên nền số.</li>
<li><a href="https://www.ftc.gov/influencers" target="_blank" rel="noopener">FTC — Disclosures 101 for Social Media Influencers</a> — hướng dẫn rõ ràng của Mỹ về công khai hợp tác trả phí.</li>
<li><a href="https://unctad.org/topic/competition-and-consumer-protection" target="_blank" rel="noopener">UNCTAD — Competition and consumer protection</a> — hoạt động bảo vệ người tiêu dùng quốc tế, gồm cả người tiêu dùng dễ bị tổn thương.</li>
</ul>
<h3>▶️ YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@crashcourse" target="_blank" rel="noopener">CrashCourse</a> — loạt Psychology giải thích tri giác, học hỏi, trí nhớ và thuyết phục.</li>
<li><a href="https://www.youtube.com/@thinkwithgoogle" target="_blank" rel="noopener">Think with Google</a> — các bài nói về hành trình khách hàng và hành vi số.</li>
<li><a href="https://www.youtube.com/@HubSpotMarketing" target="_blank" rel="noopener">HubSpot Marketing</a> — nội dung thực hành về hành trình người mua và trải nghiệm khách hàng.</li>
<li><a href="https://www.youtube.com/@TED" target="_blank" rel="noopener">TED</a> — các bài nói về ra quyết định, kinh tế học hành vi và sự ảnh hưởng.</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://www.google.com/sheets/about/" target="_blank" rel="noopener">Google Sheets</a> — tính điểm thái độ Fishbein, ngưỡng Weber và tỷ lệ chuyển đổi trong hành trình.</li>
<li><a href="https://trends.google.com/" target="_blank" rel="noopener">Google Trends</a> — xem người tiêu dùng tìm kiếm gì, theo mùa và theo vùng.</li>
<li><a href="https://miro.com/" target="_blank" rel="noopener">Miro</a> — vẽ hành trình khách hàng, điểm chạm và kết quả phỏng vấn bậc thang.</li>
<li><a href="https://www.theculturefactor.com/country-comparison-tool" target="_blank" rel="noopener">The Culture Factor — Country comparison tool</a> — so sánh các khía cạnh văn hoá của Hofstede giữa các quốc gia.</li>
</ul>
<h3>🎯 Lộ trình tự học</h3>
<ol>
<li><strong>Nền tảng (lõi thi)</strong> — mức độ liên quan, nhận thức, học hỏi, động cơ và thái độ, theo đúng Phần 1–4 ở đây.</li>
<li><strong>Luyện tập</strong> — làm lại bài tập Weber và Fishbein với số liệu của riêng bạn trên bảng tính.</li>
<li><strong>Đào sâu</strong> — phỏng vấn bậc thang năm người bạn về một sản phẩm và vẽ các chuỗi phương tiện – mục đích.</li>
<li><strong>Vận dụng</strong> — vẽ hành trình của một lần mua thật của bạn, đánh dấu từng điểm chạm và phân loại nội dung theo đường trung tâm hay ngoại vi.</li>
</ol>
<div class="callout"><span class="badge">Lưu ý</span> Đây là trung tâm liên kết nguyên gốc — không nhúng slide/sách có bản quyền. Link đổi thì vào trang chủ chính thức để tìm.</div>`,
  ]]);

export default {
  semester: { code: 'FPTU_Hola3', name: 'Kỳ 3', ordinal: 5 },
  course: {
    courseCode: 'MKT201',
    slug: 'mkt201-consumer-behavior',
    title: 'Consumer Behavior',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/MKT201.webp',
    shortDescription: 'The psychology of buying: involvement, perception (Weber’s law), learning, memory, motivation, the self, attitudes (Fishbein), persuasion (ELM), groups, culture, innovation diffusion, the digital journey, ethics. Bilingual, with exercises and quizzes.|||Tâm lý học của việc mua: mức độ liên quan, nhận thức (Weber), học hỏi, trí nhớ, động cơ, bản thân, thái độ (Fishbein), thuyết phục (ELM), nhóm, văn hoá, lan toả đổi mới, hành trình số, đạo đức. Song ngữ, có bài tập và quiz.',
    description: 'Môn <strong>MKT201 — Consumer Behavior (Hành vi người tiêu dùng)</strong> (khối Quản trị Kinh doanh, kỳ 3) mở "hộp đen" của người mua mà MKT101 mới phác thảo, đi sâu vào <strong>tâm lý học người tiêu dùng</strong>. Từ <strong>mức độ liên quan và các kiểu quyết định</strong> (tìm kiếm, tập cân nhắc, quy tắc quyết định, sau mua) → <strong>nhận thức</strong> (ngưỡng tuyệt đối, JND và định luật Weber, chú ý, diễn giải), <strong>học hỏi và trí nhớ</strong> (điều kiện hoá cổ điển và thao tác, học qua quan sát) → <strong>động cơ, giá trị, chuỗi phương tiện – mục đích</strong>, <strong>bản thân, tính cách, tính cách thương hiệu Aaker, lối sống</strong> → <strong>thái độ</strong> (mô hình ABC, mô hình đa thuộc tính Fishbein) và <strong>thuyết phục</strong> (mô hình ELM) → <strong>nhóm tham khảo, người có ảnh hưởng, gia đình, văn hoá, tầng lớp xã hội, lan toả đổi mới</strong>, <strong>hành trình khách hàng số, đánh giá trực tuyến và đạo đức</strong>. Bám cấu trúc giáo trình của Solomon, Schiffman &amp; Wisenblit và Hoyer, MacInnis &amp; Pieters, song ngữ Anh–Việt, tình huống giả định với mọi con số đã kiểm bằng máy, có ba bài tập kèm lời giải và quiz cuối mỗi phần.',
    whatYouLearn: 'Chẩn đoán mức độ liên quan và phân biệt ba kiểu quyết định của người tiêu dùng\nGiải thích tìm kiếm thông tin, các tập thương hiệu, quy tắc quyết định và sự hài lòng sau mua\nTính khác biệt vừa đủ nhận biết (JND) theo định luật Weber và dùng nó cho quyết định giá, bao bì\nÁp dụng điều kiện hoá cổ điển, điều kiện hoá thao tác và học qua quan sát vào marketing\nNối thuộc tính sản phẩm với giá trị bằng chuỗi phương tiện – mục đích và kỹ thuật bậc thang\nPhân tích bản thân, tính cách, tính cách thương hiệu (Aaker) và lối sống để phân khúc\nTính điểm thái độ Fishbein, chọn chiến lược thay đổi thái độ và thiết kế thông điệp theo ELM\nPhân tích ảnh hưởng của nhóm, gia đình, văn hoá, lan toả đổi mới và hành trình khách hàng số một cách có đạo đức',
    requirements: 'Nên học trước MKT101 — Marketing Principles (quy trình quyết định mua, STP)\nTính toán cơ bản với phần trăm và bảng tính\nThói quen quan sát quảng cáo, cửa hàng và hành vi mua sắm của chính mình',
  },
  sections: [
    { title: '📚 Course materials|||📚 Tài liệu tham khảo', description: 'Giáo trình & slide trên FLM, sách, tài liệu chính thức, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Course introduction|||Giới thiệu môn học', description: 'Hành vi người tiêu dùng là gì, vai trò, cách nghiên cứu, lộ trình.', lessons: [intro] },
    { title: 'Part 1 — Involvement & decision making|||Phần 1 — Mức độ liên quan & ra quyết định', description: 'Mức độ liên quan, ba kiểu quyết định, tìm kiếm, tập cân nhắc, quy tắc quyết định, sau mua.', lessons: [c1, c2, c1q] },
    { title: 'Part 2 — Perception, learning & memory|||Phần 2 — Nhận thức, học hỏi & trí nhớ', description: 'Ngưỡng, JND, định luật Weber, chú ý, diễn giải, điều kiện hoá, trí nhớ.', lessons: [c3, c4, c4e, c4q] },
    { title: 'Part 3 — Motivation, values, self & personality|||Phần 3 — Động cơ, giá trị, bản thân & tính cách', description: 'Động cơ, xung đột, giá trị, chuỗi phương tiện – mục đích, bản thân, tính cách thương hiệu, lối sống.', lessons: [c5, c6, c6q] },
    { title: 'Part 4 — Attitudes & persuasion|||Phần 4 — Thái độ & thuyết phục', description: 'Mô hình ABC, Fishbein, thuyết hành động hợp lý, nguồn phát, thông điệp, ELM.', lessons: [c7, c8, c8e, c8q] },
    { title: 'Part 5 — Social, cultural & digital consumers|||Phần 5 — Người tiêu dùng trong xã hội, văn hoá & môi trường số', description: 'Nhóm tham khảo, người có ảnh hưởng, gia đình, văn hoá, tầng lớp, lan toả đổi mới, hành trình số, đạo đức.', lessons: [c9, c10, c11, c11e, c11q] },
  ],
};
