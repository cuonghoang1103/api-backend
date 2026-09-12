/**
 * IBI101 — Introduction to International Business (Nhập môn kinh doanh quốc tế). Khối Quản trị
 * Kinh doanh, kỳ 2. Bám cấu trúc giáo trình kinh doanh quốc tế chuẩn (vd Charles W. L. Hill &
 * G. Tomas M. Hult — International Business: Competing in the Global Marketplace): toàn cầu hoá,
 * khác biệt quốc gia (kinh tế chính trị, luật, văn hoá, đạo đức), lý thuyết & chính sách thương
 * mại, WTO, hội nhập khu vực, FDI, ngoại hối & hệ thống tiền tệ, chiến lược & phương thức thâm
 * nhập. Song ngữ + ví dụ số (đã kiểm bằng script; tình huống và số liệu là GIẢ ĐỊNH, không có số
 * liệu thương mại/FDI thật, không nêu điểm Hofstede) + bài tập có lời giải + quiz.
 * Giữ NGUYÊN slug/semester/thumb(v3). ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const intro = doc('ibi101-0-1-overview', 'Course overview: what international business is|||Tổng quan: kinh doanh quốc tế là gì',
  'Kinh doanh quốc tế và doanh nghiệp đa quốc gia là gì, vì sao quản trị xuyên biên giới khác quản trị trong nước, các câu hỏi lớn của môn, lộ trình 4 phần và cách học.',
  [[
    `<span class="eyebrow">IBI101 · Lesson 0.1 · Overview</span>
<h2>Introduction to International Business</h2>
<p class="lead">An <strong>international business</strong> is any firm that engages in <strong>international trade or investment</strong>. You do not need to be a giant multinational to qualify: a small Vietnamese workshop that exports furniture, or a start-up that buys software services from abroad, is already doing international business.</p>
<h3>Key terms</h3>
<ul>
<li><strong>International trade</strong> — a firm exports goods or services to consumers in another country, or imports them from abroad.</li>
<li><strong>Foreign direct investment (FDI)</strong> — a firm invests resources in business activities outside its home country (a factory, a sales subsidiary, a stake in a local company) and gains control over them.</li>
<li><strong>Multinational enterprise (MNE)</strong> — any business that has productive activities in two or more countries.</li>
<li><strong>Globalization</strong> — the shift towards a more integrated and interdependent world economy.</li>
</ul>
<h3>Why managing across borders is different</h3>
<table>
<tr><th>Difference</th><th>What it means for managers</th></tr>
<tr><td>Countries are different</td><td>Political, economic, legal and cultural systems vary, so practices that work at home may fail abroad</td></tr>
<tr><td>More complex problems</td><td>Where to produce, which markets to enter, how to adapt products, how to organize a network of subsidiaries</td></tr>
<tr><td>Government rules on trade and investment</td><td>Tariffs, quotas, FDI restrictions and trade agreements shape what is allowed and profitable</td></tr>
<tr><td>Currency conversion</td><td>Revenues and costs arise in different currencies, so exchange-rate movements change profits</td></tr>
</table>
<h3>The big questions of this course</h3>
<ol>
<li>Why is the world economy becoming more integrated, and is that good or bad?</li>
<li>How do national differences affect the attractiveness of a country as a market or a production site?</li>
<li>Why do nations trade, and why do governments still intervene in trade?</li>
<li>Why do firms invest abroad instead of simply exporting or licensing?</li>
<li>How does the foreign exchange market affect international business?</li>
<li>Which strategy should a firm pursue abroad, and how should it enter a foreign market?</li>
</ol>
<h3>Roadmap</h3>
<table>
<tr><th>Part</th><th>Topics</th><th>Exercise</th></tr>
<tr><td>1</td><td>Globalization · national differences in political economy, law and culture · ethics</td><td>—</td></tr>
<tr><td>2</td><td>Trade theory (from mercantilism to Porter’s diamond) · trade policy and the WTO</td><td>Comparative advantage; tariff analysis</td></tr>
<tr><td>3</td><td>Foreign direct investment · regional economic integration · the foreign exchange market and the international monetary system</td><td>—</td></tr>
<tr><td>4</td><td>Strategy of international business · choosing an entry mode</td><td>Choosing an entry mode</td></tr>
</table>
<p>The structure follows a standard international-business textbook such as Hill &amp; Hult, <em>International Business: Competing in the Global Marketplace</em> (McGraw Hill). All company cases and numbers in the exercises are <strong>fictional and illustrative</strong>; they are built to teach the reasoning, not to describe real markets.</p>
<div class="callout"><span class="badge">How to study</span> For every topic ask two questions: "What does this mean for a firm deciding where to sell or produce?" and "What does it mean for a country like Vietnam?". Work the exercises by hand before reading the solutions.</div>`,
    `<span class="eyebrow">IBI101 · Bài 0.1 · Tổng quan</span>
<h2>Nhập môn kinh doanh quốc tế</h2>
<p class="lead"><strong>Doanh nghiệp kinh doanh quốc tế</strong> là bất kỳ doanh nghiệp nào tham gia <strong>thương mại hoặc đầu tư quốc tế</strong>. Không cần là một tập đoàn đa quốc gia khổng lồ: một xưởng nhỏ ở Việt Nam xuất khẩu đồ gỗ, hay một công ty khởi nghiệp mua dịch vụ phần mềm từ nước ngoài, đã là đang kinh doanh quốc tế.</p>
<h3>Thuật ngữ then chốt</h3>
<ul>
<li><strong>Thương mại quốc tế</strong> — doanh nghiệp xuất khẩu hàng hoá, dịch vụ cho khách hàng ở nước khác, hoặc nhập khẩu chúng từ nước ngoài.</li>
<li><strong>Đầu tư trực tiếp nước ngoài (FDI)</strong> — doanh nghiệp đầu tư nguồn lực vào hoạt động kinh doanh bên ngoài nước mình (một nhà máy, một công ty con bán hàng, cổ phần trong một công ty địa phương) và nắm quyền kiểm soát các hoạt động đó.</li>
<li><strong>Doanh nghiệp đa quốc gia (MNE)</strong> — bất kỳ doanh nghiệp nào có hoạt động sản xuất kinh doanh ở từ hai quốc gia trở lên.</li>
<li><strong>Toàn cầu hoá</strong> — sự chuyển dịch hướng tới một nền kinh tế thế giới hội nhập và phụ thuộc lẫn nhau hơn.</li>
</ul>
<h3>Vì sao quản trị xuyên biên giới khác biệt</h3>
<table>
<tr><th>Khác biệt</th><th>Ý nghĩa với nhà quản trị</th></tr>
<tr><td>Các quốc gia khác nhau</td><td>Hệ thống chính trị, kinh tế, pháp luật và văn hoá khác nhau, nên cách làm hiệu quả ở trong nước có thể thất bại ở nước ngoài</td></tr>
<tr><td>Vấn đề phức tạp hơn</td><td>Sản xuất ở đâu, thâm nhập thị trường nào, điều chỉnh sản phẩm ra sao, tổ chức mạng lưới công ty con thế nào</td></tr>
<tr><td>Quy định của chính phủ về thương mại và đầu tư</td><td>Thuế quan, hạn ngạch, hạn chế FDI và các hiệp định thương mại quyết định điều gì được phép và điều gì có lãi</td></tr>
<tr><td>Chuyển đổi tiền tệ</td><td>Doanh thu và chi phí phát sinh bằng nhiều đồng tiền khác nhau, nên biến động tỷ giá làm thay đổi lợi nhuận</td></tr>
</table>
<h3>Những câu hỏi lớn của môn học</h3>
<ol>
<li>Vì sao kinh tế thế giới ngày càng hội nhập, và điều đó tốt hay xấu?</li>
<li>Khác biệt quốc gia ảnh hưởng thế nào tới sức hấp dẫn của một nước với tư cách thị trường hoặc địa điểm sản xuất?</li>
<li>Vì sao các quốc gia buôn bán với nhau, và vì sao chính phủ vẫn can thiệp vào thương mại?</li>
<li>Vì sao doanh nghiệp đầu tư ra nước ngoài thay vì chỉ xuất khẩu hoặc cấp phép?</li>
<li>Thị trường ngoại hối tác động thế nào tới kinh doanh quốc tế?</li>
<li>Doanh nghiệp nên theo đuổi chiến lược nào ở nước ngoài, và nên thâm nhập thị trường nước ngoài bằng cách nào?</li>
</ol>
<h3>Lộ trình</h3>
<table>
<tr><th>Phần</th><th>Chủ đề</th><th>Bài tập</th></tr>
<tr><td>1</td><td>Toàn cầu hoá · khác biệt quốc gia về kinh tế chính trị, pháp luật và văn hoá · đạo đức</td><td>—</td></tr>
<tr><td>2</td><td>Lý thuyết thương mại (từ chủ nghĩa trọng thương tới mô hình kim cương của Porter) · chính sách thương mại và WTO</td><td>Lợi thế so sánh; phân tích thuế quan</td></tr>
<tr><td>3</td><td>Đầu tư trực tiếp nước ngoài · hội nhập kinh tế khu vực · thị trường ngoại hối và hệ thống tiền tệ quốc tế</td><td>—</td></tr>
<tr><td>4</td><td>Chiến lược kinh doanh quốc tế · lựa chọn phương thức thâm nhập</td><td>Chọn phương thức thâm nhập</td></tr>
</table>
<p>Cấu trúc môn bám theo một giáo trình kinh doanh quốc tế chuẩn như Hill &amp; Hult, <em>International Business: Competing in the Global Marketplace</em> (McGraw Hill). Mọi tình huống doanh nghiệp và con số trong bài tập đều là <strong>giả định, mang tính minh hoạ</strong>; chúng được dựng để dạy cách lập luận, không mô tả thị trường thật.</p>
<div class="callout"><span class="badge">Cách học</span> Với mỗi chủ đề, hãy tự hỏi hai câu: "Điều này có ý nghĩa gì với một doanh nghiệp đang quyết định bán hàng hay sản xuất ở đâu?" và "Điều này có ý nghĩa gì với một quốc gia như Việt Nam?". Tự làm bài tập bằng tay trước khi đọc lời giải.</div>`,
  ]]);

const c1 = doc('ibi101-1-1-globalization', '1.1 — Globalization: markets, production, drivers & debate|||1.1 — Toàn cầu hoá: thị trường, sản xuất, động lực & tranh luận',
  'Toàn cầu hoá thị trường và toàn cầu hoá sản xuất, các thể chế toàn cầu (WTO, IMF, Ngân hàng Thế giới, Liên Hợp Quốc, G20), hai động lực chính (giảm rào cản, thay đổi công nghệ), bức tranh kinh tế thế giới đang đổi, và cuộc tranh luận ủng hộ – phản đối toàn cầu hoá.',
  [[
    `<span class="eyebrow">IBI101 · Part 1 · Lesson 1.1</span>
<h2>Globalization: markets, production, drivers &amp; debate</h2>
<p class="lead">Globalization has two faces. Firms sell to a world market, and they also build products from inputs made all over the world.</p>
<h3>Two faces of globalization</h3>
<table>
<tr><th>Face</th><th>Meaning</th><th>Illustration</th></tr>
<tr><td><strong>Globalization of markets</strong></td><td>Historically separate national markets merge into one huge global marketplace as barriers fall and tastes converge</td><td>The same smartphones, soft drinks and streaming services are sold in dozens of countries</td></tr>
<tr><td><strong>Globalization of production</strong></td><td>Firms source goods and services from locations around the world to exploit national differences in the cost and quality of factors of production (labour, land, energy, capital)</td><td>A product designed in one country, with chips from a second, assembled in a third and sold everywhere</td></tr>
</table>
<p>Markets are not fully global yet: significant differences remain in consumer tastes, distribution channels, cultural value systems, business systems and legal rules. These differences are exactly why international business needs its own discipline.</p>
<h3>The institutions that govern the global economy</h3>
<ul>
<li><strong>World Trade Organization (WTO)</strong> — polices the multinational trading system and resolves trade disputes; it succeeded the GATT in 1995.</li>
<li><strong>International Monetary Fund (IMF)</strong> — maintains order in the international monetary system and lends to countries in financial crisis.</li>
<li><strong>World Bank</strong> — promotes economic development through low-interest loans and grants for projects in developing countries.</li>
<li><strong>United Nations (UN)</strong> — works for peace, security, human rights and development.</li>
<li><strong>Group of Twenty (G20)</strong> — a forum of major economies that coordinates policy responses to global economic problems.</li>
</ul>
<h3>Drivers of globalization</h3>
<ol>
<li><strong>Declining barriers to trade and investment.</strong> Since the Second World War, successive rounds of negotiations under the GATT (and later the WTO) have cut tariffs sharply, and many countries have opened up to foreign investment.</li>
<li><strong>Technological change.</strong> Microprocessors and telecommunications cut the cost of processing and sending information; the internet created a global platform for commerce; and transportation innovations — jet aircraft, very large ships and above all <strong>containerization</strong> — cut the cost and time of moving goods.</li>
</ol>
<h3>The changing shape of the world economy</h3>
<ul>
<li>The share of world output and trade produced by developing and emerging economies — especially in Asia — has grown, while the share of the older industrial countries has fallen.</li>
<li>FDI now flows not only from rich countries but also from emerging economies.</li>
<li>Multinationals are no longer only large Western firms: firms from emerging economies, and even small and medium-sized enterprises, operate across borders.</li>
</ul>
<h3>The globalization debate</h3>
<table>
<tr><th>Concern of critics</th><th>Typical reply of supporters</th></tr>
<tr><td>Jobs and wages in rich countries are lost to low-cost countries</td><td>Trade lets countries specialize in what they do best; consumers gain from lower prices and new jobs appear in growing sectors (but workers who lose jobs need help to adjust)</td></tr>
<tr><td>Firms move production to countries with weak labour and environmental rules</td><td>As countries grow richer, they tend to adopt stricter labour and environmental standards; trade agreements can include such standards</td></tr>
<tr><td>International organizations reduce national sovereignty</td><td>Countries join voluntarily and can leave; the rules exist because members agreed to them</td></tr>
<tr><td>The gap between rich and poor countries persists</td><td>Many of the fastest-growing economies are those that opened to trade; poverty has deeper causes such as weak institutions, conflict and debt</td></tr>
</table>
<div class="callout"><span class="badge">For Vietnam</span> Vietnam is a textbook case of globalization of production: after opening its economy and becoming a WTO member in 2007, it attracted large inflows of FDI into export manufacturing. The questions of this course — why trade, why FDI, which entry mode — are everyday questions for Vietnamese firms and policymakers.</div>`,
    `<span class="eyebrow">IBI101 · Phần 1 · Bài 1.1</span>
<h2>Toàn cầu hoá: thị trường, sản xuất, động lực &amp; tranh luận</h2>
<p class="lead">Toàn cầu hoá có hai mặt. Doanh nghiệp bán hàng cho thị trường thế giới, và cũng làm ra sản phẩm từ những đầu vào được sản xuất khắp nơi trên thế giới.</p>
<h3>Hai mặt của toàn cầu hoá</h3>
<table>
<tr><th>Mặt</th><th>Ý nghĩa</th><th>Minh hoạ</th></tr>
<tr><td><strong>Toàn cầu hoá thị trường</strong></td><td>Các thị trường quốc gia vốn tách biệt hợp nhất thành một thị trường toàn cầu khổng lồ khi rào cản giảm và thị hiếu hội tụ</td><td>Cùng những mẫu điện thoại thông minh, nước giải khát, dịch vụ xem phim trực tuyến được bán ở hàng chục quốc gia</td></tr>
<tr><td><strong>Toàn cầu hoá sản xuất</strong></td><td>Doanh nghiệp tìm nguồn hàng hoá, dịch vụ từ nhiều địa điểm trên thế giới để khai thác khác biệt giữa các quốc gia về chi phí và chất lượng của các yếu tố sản xuất (lao động, đất đai, năng lượng, vốn)</td><td>Một sản phẩm thiết kế ở nước này, dùng chip từ nước thứ hai, lắp ráp ở nước thứ ba và bán khắp nơi</td></tr>
</table>
<p>Thị trường vẫn chưa toàn cầu hoàn toàn: vẫn còn khác biệt đáng kể về thị hiếu người tiêu dùng, kênh phân phối, hệ giá trị văn hoá, hệ thống kinh doanh và quy định pháp luật. Chính những khác biệt này khiến kinh doanh quốc tế cần một môn học riêng.</p>
<h3>Các thể chế điều tiết kinh tế toàn cầu</h3>
<ul>
<li><strong>Tổ chức Thương mại Thế giới (WTO)</strong> — giám sát hệ thống thương mại đa phương và giải quyết tranh chấp thương mại; kế tục GATT từ năm 1995.</li>
<li><strong>Quỹ Tiền tệ Quốc tế (IMF)</strong> — duy trì trật tự trong hệ thống tiền tệ quốc tế và cho các nước gặp khủng hoảng tài chính vay.</li>
<li><strong>Ngân hàng Thế giới (World Bank)</strong> — thúc đẩy phát triển kinh tế bằng các khoản vay lãi suất thấp và viện trợ không hoàn lại cho dự án ở các nước đang phát triển.</li>
<li><strong>Liên Hợp Quốc (UN)</strong> — hoạt động vì hoà bình, an ninh, nhân quyền và phát triển.</li>
<li><strong>Nhóm G20</strong> — diễn đàn của các nền kinh tế lớn nhằm phối hợp chính sách ứng phó với các vấn đề kinh tế toàn cầu.</li>
</ul>
<h3>Động lực của toàn cầu hoá</h3>
<ol>
<li><strong>Rào cản thương mại và đầu tư giảm.</strong> Từ sau Chiến tranh thế giới thứ hai, các vòng đàm phán liên tiếp trong khuôn khổ GATT (và sau đó là WTO) đã cắt giảm mạnh thuế quan, và nhiều nước đã mở cửa cho đầu tư nước ngoài.</li>
<li><strong>Thay đổi công nghệ.</strong> Bộ vi xử lý và viễn thông làm giảm chi phí xử lý và truyền thông tin; internet tạo ra một nền tảng thương mại toàn cầu; còn đổi mới trong vận tải — máy bay phản lực, tàu biển siêu lớn và nhất là <strong>container hoá</strong> — làm giảm chi phí và thời gian vận chuyển hàng hoá.</li>
</ol>
<h3>Bức tranh kinh tế thế giới đang thay đổi</h3>
<ul>
<li>Tỷ trọng sản lượng và thương mại thế giới của các nền kinh tế đang phát triển và mới nổi — nhất là ở châu Á — tăng lên, trong khi tỷ trọng của các nước công nghiệp lâu đời giảm xuống.</li>
<li>Dòng FDI giờ không chỉ đi ra từ các nước giàu mà còn từ các nền kinh tế mới nổi.</li>
<li>Doanh nghiệp đa quốc gia không còn chỉ là các công ty lớn phương Tây: doanh nghiệp từ các nền kinh tế mới nổi, thậm chí doanh nghiệp nhỏ và vừa, cũng hoạt động xuyên biên giới.</li>
</ul>
<h3>Cuộc tranh luận về toàn cầu hoá</h3>
<table>
<tr><th>Mối lo của phe phản đối</th><th>Câu trả lời thường gặp của phe ủng hộ</th></tr>
<tr><td>Việc làm và tiền lương ở nước giàu bị mất sang các nước chi phí thấp</td><td>Thương mại cho phép mỗi nước chuyên môn hoá vào điều mình làm tốt nhất; người tiêu dùng được lợi nhờ giá thấp hơn và việc làm mới xuất hiện ở các ngành đang phát triển (nhưng người lao động mất việc cần được hỗ trợ để thích nghi)</td></tr>
<tr><td>Doanh nghiệp chuyển sản xuất sang nước có quy định lao động và môi trường lỏng lẻo</td><td>Khi giàu lên, các nước có xu hướng áp dụng chuẩn lao động và môi trường chặt chẽ hơn; hiệp định thương mại có thể đưa các chuẩn này vào</td></tr>
<tr><td>Các tổ chức quốc tế làm suy giảm chủ quyền quốc gia</td><td>Các nước tự nguyện tham gia và có thể rút ra; luật lệ tồn tại vì chính các thành viên đã đồng ý</td></tr>
<tr><td>Khoảng cách giàu – nghèo giữa các nước vẫn còn</td><td>Nhiều nền kinh tế tăng trưởng nhanh nhất chính là những nước mở cửa thương mại; nghèo đói có nguyên nhân sâu xa hơn như thể chế yếu, xung đột và nợ nần</td></tr>
</table>
<div class="callout"><span class="badge">Với Việt Nam</span> Việt Nam là ví dụ điển hình của toàn cầu hoá sản xuất: sau khi mở cửa nền kinh tế và trở thành thành viên WTO năm 2007, Việt Nam thu hút dòng FDI lớn vào sản xuất hàng xuất khẩu. Những câu hỏi của môn này — vì sao thương mại, vì sao FDI, chọn phương thức thâm nhập nào — là câu hỏi hằng ngày của doanh nghiệp và nhà hoạch định chính sách Việt Nam.</div>`,
  ]]);

const c2 = doc('ibi101-1-2-national-differences', '1.2 — National differences: political economy, law, culture & ethics|||1.2 — Khác biệt quốc gia: kinh tế chính trị, pháp luật, văn hoá & đạo đức',
  'Hệ thống chính trị, kinh tế và pháp luật; quyền tài sản, tham nhũng, sở hữu trí tuệ; đo lường phát triển kinh tế (GNI, PPP, HDI); văn hoá (giá trị, chuẩn mực, tôn giáo, ngôn ngữ) và sáu chiều văn hoá Hofstede mô tả định tính; các vấn đề và cách tiếp cận đạo đức trong kinh doanh quốc tế.',
  [[
    `<span class="eyebrow">IBI101 · Part 1 · Lesson 1.2</span>
<h2>National differences: political economy, law, culture &amp; ethics</h2>
<p class="lead">A country’s <strong>political economy</strong> — its political, economic and legal systems — together with its culture determines how costly, how risky and how rewarding it is to do business there.</p>
<h3>Political systems</h3>
<ul>
<li><strong>Collectivism vs individualism</strong> — whether the needs of society as a whole take priority over individual freedoms, or individual freedom and self-expression come first.</li>
<li><strong>Democracy vs totalitarianism</strong> — government by elected representatives, with free elections, free speech and an independent judiciary, versus government by one person or party that allows no opposition.</li>
</ul>
<h3>Economic systems</h3>
<table>
<tr><th>System</th><th>Who decides what is produced</th></tr>
<tr><td>Market economy</td><td>Supply and demand; resources are mostly privately owned and the state encourages free competition</td></tr>
<tr><td>Command economy</td><td>The government plans output and prices; key businesses are state-owned</td></tr>
<tr><td>Mixed economy</td><td>Some sectors are left to markets, others are state-owned or heavily regulated</td></tr>
</table>
<h3>Legal systems and the business climate</h3>
<ul>
<li><strong>Common law</strong> (based on tradition, precedent and custom — judges interpret law case by case), <strong>civil law</strong> (based on detailed written codes) and <strong>theocratic law</strong> (based on religious teachings).</li>
<li><strong>Property rights</strong> can be violated by <em>private action</em> (theft, piracy, organized crime) or <em>public action</em> (corruption, arbitrary expropriation). Weak property rights discourage investment. Many countries prohibit bribery of foreign officials — for example the US Foreign Corrupt Practices Act and the OECD Anti-Bribery Convention.</li>
<li><strong>Intellectual property</strong> — patents, copyrights and trademarks — must be protected; the WTO’s TRIPS agreement sets minimum standards for members.</li>
<li><strong>Product safety and liability</strong> rules and <strong>contract law</strong> (how disputes are settled) differ across countries and affect costs.</li>
</ul>
<h3>Measuring economic development</h3>
<p><strong>GNI per person</strong> measures income; adjusting it for <strong>purchasing power parity (PPP)</strong> accounts for differences in the cost of living; the UN’s <strong>Human Development Index (HDI)</strong> adds life expectancy and education. Growth tends to be faster where there is economic freedom, secure property rights, good infrastructure and education, and political stability.</p>
<h3>Culture</h3>
<p><strong>Culture</strong> is a system of <strong>values</strong> (abstract ideas about what is good and desirable) and <strong>norms</strong> (social rules for behaviour — everyday <em>folkways</em> and more serious <em>mores</em>) shared by a group. It is shaped by social structure, religion and ethical systems, language and education. Hofstede’s research on employee values describes cultures along six dimensions:</p>
<table>
<tr><th>Dimension</th><th>What a "high" position means</th></tr>
<tr><td>Power distance</td><td>People accept that power is distributed unequally; hierarchy is expected</td></tr>
<tr><td>Individualism (vs collectivism)</td><td>Loose ties; people look after themselves rather than belonging to strong in-groups</td></tr>
<tr><td>Uncertainty avoidance</td><td>People feel uncomfortable with ambiguity; they prefer rules, structure and job security</td></tr>
<tr><td>Masculinity (vs femininity)</td><td>Achievement, competition and material success are emphasized over care and quality of life</td></tr>
<tr><td>Long-term orientation</td><td>Persistence, thrift and future rewards are valued (added later from research in Asian cultures)</td></tr>
<tr><td>Indulgence (vs restraint)</td><td>Relatively free gratification of desires and enjoyment of life (the most recent addition)</td></tr>
</table>
<p>Use the framework carefully: it assumes one culture per country, the original data came from employees of a single company, and cultures change over time. It is a starting point for questions, not a stereotype of individuals.</p>
<h3>Ethics in international business</h3>
<p>Ethical issues arise over <strong>employment practices</strong> (wages and conditions in foreign factories and suppliers), <strong>human rights</strong>, <strong>environmental pollution</strong>, <strong>corruption</strong> and the <strong>moral obligations</strong> of powerful multinationals. Some approaches are too simple ("straw men"): the <em>Friedman doctrine</em> (the only social responsibility of business is to increase profits within the law), <em>cultural relativism</em> ("when in Rome, do as the Romans do"), the <em>righteous moralist</em> (home standards everywhere) and the <em>naive immoralist</em> (if others ignore ethics, so can we). Stronger frameworks weigh consequences (<em>utilitarian</em>), duties and respect for people (<em>Kantian</em>), fundamental <em>rights</em>, and fair distribution (<em>justice</em> theories such as Rawls’ "veil of ignorance").</p>
<div class="callout"><span class="badge">Manager’s test</span> Before acting, ask: "Would I be comfortable if this decision were reported in the newspaper, and would I want my own family to be treated this way?" Many firms also write a code of ethics that applies in every country where they operate.</div>`,
    `<span class="eyebrow">IBI101 · Phần 1 · Bài 1.2</span>
<h2>Khác biệt quốc gia: kinh tế chính trị, pháp luật, văn hoá &amp; đạo đức</h2>
<p class="lead"><strong>Kinh tế chính trị</strong> của một quốc gia — hệ thống chính trị, kinh tế và pháp luật — cùng với văn hoá quyết định việc kinh doanh ở đó tốn kém, rủi ro và đáng giá tới mức nào.</p>
<h3>Hệ thống chính trị</h3>
<ul>
<li><strong>Chủ nghĩa tập thể và chủ nghĩa cá nhân</strong> — nhu cầu của xã hội nói chung được đặt trên tự do cá nhân, hay tự do và sự thể hiện bản thân của cá nhân được đặt lên trước.</li>
<li><strong>Dân chủ và toàn trị</strong> — chính quyền do các đại biểu được bầu ra, với bầu cử tự do, tự do ngôn luận và tư pháp độc lập, so với chính quyền do một người hoặc một đảng nắm giữ và không cho phép đối lập.</li>
</ul>
<h3>Hệ thống kinh tế</h3>
<table>
<tr><th>Hệ thống</th><th>Ai quyết định sản xuất cái gì</th></tr>
<tr><td>Kinh tế thị trường</td><td>Cung và cầu; nguồn lực chủ yếu thuộc sở hữu tư nhân và nhà nước khuyến khích cạnh tranh tự do</td></tr>
<tr><td>Kinh tế chỉ huy</td><td>Chính phủ lập kế hoạch sản lượng và giá cả; các doanh nghiệp then chốt thuộc sở hữu nhà nước</td></tr>
<tr><td>Kinh tế hỗn hợp</td><td>Một số lĩnh vực để thị trường quyết định, số khác thuộc sở hữu nhà nước hoặc bị điều tiết chặt</td></tr>
</table>
<h3>Hệ thống pháp luật và môi trường kinh doanh</h3>
<ul>
<li><strong>Thông luật</strong> (dựa trên truyền thống, án lệ và tập quán — thẩm phán diễn giải luật theo từng vụ việc), <strong>dân luật</strong> (dựa trên các bộ luật thành văn chi tiết) và <strong>luật thần quyền</strong> (dựa trên giáo lý tôn giáo).</li>
<li><strong>Quyền tài sản</strong> có thể bị xâm phạm bởi <em>hành vi tư nhân</em> (trộm cắp, vi phạm bản quyền, tội phạm có tổ chức) hoặc <em>hành vi công quyền</em> (tham nhũng, tịch thu tuỳ tiện). Quyền tài sản yếu làm nản lòng nhà đầu tư. Nhiều nước cấm hối lộ quan chức nước ngoài — ví dụ Đạo luật Chống tham nhũng ở nước ngoài (FCPA) của Hoa Kỳ và Công ước Chống hối lộ của OECD.</li>
<li><strong>Sở hữu trí tuệ</strong> — bằng sáng chế, quyền tác giả và nhãn hiệu — cần được bảo hộ; hiệp định TRIPS của WTO đặt ra chuẩn tối thiểu cho các thành viên.</li>
<li>Quy định về <strong>an toàn và trách nhiệm sản phẩm</strong> cùng <strong>luật hợp đồng</strong> (cách giải quyết tranh chấp) khác nhau giữa các nước và ảnh hưởng tới chi phí.</li>
</ul>
<h3>Đo lường phát triển kinh tế</h3>
<p><strong>GNI bình quân đầu người</strong> đo thu nhập; điều chỉnh theo <strong>ngang giá sức mua (PPP)</strong> để tính tới khác biệt về giá cả sinh hoạt; <strong>Chỉ số Phát triển Con người (HDI)</strong> của Liên Hợp Quốc bổ sung tuổi thọ và giáo dục. Tăng trưởng thường nhanh hơn ở nơi có tự do kinh tế, quyền tài sản được bảo đảm, hạ tầng và giáo dục tốt, và ổn định chính trị.</p>
<h3>Văn hoá</h3>
<p><strong>Văn hoá</strong> là hệ thống các <strong>giá trị</strong> (ý niệm trừu tượng về điều gì là tốt và đáng mong muốn) và <strong>chuẩn mực</strong> (quy tắc xã hội về hành vi — <em>tập tục</em> thường ngày và <em>lề thói đạo đức</em> nghiêm trọng hơn) được một nhóm người chia sẻ. Văn hoá được định hình bởi cấu trúc xã hội, tôn giáo và hệ thống đạo đức, ngôn ngữ và giáo dục. Nghiên cứu của Hofstede về giá trị của người lao động mô tả văn hoá theo sáu chiều:</p>
<table>
<tr><th>Chiều</th><th>Vị trí "cao" nghĩa là</th></tr>
<tr><td>Khoảng cách quyền lực</td><td>Mọi người chấp nhận quyền lực được phân bổ không đều; thứ bậc là điều đương nhiên</td></tr>
<tr><td>Chủ nghĩa cá nhân (và tập thể)</td><td>Quan hệ lỏng lẻo; mỗi người tự lo cho mình thay vì thuộc về các nhóm gắn bó chặt</td></tr>
<tr><td>Né tránh bất định</td><td>Mọi người thấy khó chịu với sự mơ hồ; họ chuộng luật lệ, cấu trúc và công việc ổn định</td></tr>
<tr><td>Nam tính (và nữ tính)</td><td>Thành tích, cạnh tranh và thành công vật chất được đề cao hơn sự quan tâm và chất lượng cuộc sống</td></tr>
<tr><td>Định hướng dài hạn</td><td>Coi trọng sự kiên trì, tiết kiệm và phần thưởng trong tương lai (bổ sung sau, từ nghiên cứu ở các nền văn hoá châu Á)</td></tr>
<tr><td>Tự thoả mãn (và kiềm chế)</td><td>Tương đối thoải mái thoả mãn mong muốn và tận hưởng cuộc sống (chiều được bổ sung gần đây nhất)</td></tr>
</table>
<p>Hãy dùng khung này thận trọng: nó giả định mỗi nước một nền văn hoá, dữ liệu gốc lấy từ nhân viên của một công ty duy nhất, và văn hoá thay đổi theo thời gian. Đây là điểm xuất phát để đặt câu hỏi, không phải khuôn mẫu áp lên từng cá nhân.</p>
<h3>Đạo đức trong kinh doanh quốc tế</h3>
<p>Vấn đề đạo đức nảy sinh quanh <strong>thực tiễn sử dụng lao động</strong> (tiền lương, điều kiện làm việc ở nhà máy và nhà cung cấp ở nước ngoài), <strong>nhân quyền</strong>, <strong>ô nhiễm môi trường</strong>, <strong>tham nhũng</strong> và <strong>nghĩa vụ đạo đức</strong> của các tập đoàn đa quốc gia có quyền lực lớn. Một số cách tiếp cận quá đơn giản ("hình nộm rơm"): <em>học thuyết Friedman</em> (trách nhiệm xã hội duy nhất của doanh nghiệp là tăng lợi nhuận trong khuôn khổ pháp luật), <em>thuyết tương đối văn hoá</em> ("nhập gia tuỳ tục"), <em>người đạo đức cực đoan</em> (áp chuẩn của nước mình ở mọi nơi) và <em>người vô đạo đức ngây thơ</em> (người khác bỏ qua đạo đức thì mình cũng vậy). Các khung vững hơn cân nhắc hệ quả (<em>thuyết vị lợi</em>), bổn phận và sự tôn trọng con người (<em>thuyết Kant</em>), các <em>quyền</em> cơ bản, và sự phân phối công bằng (<em>thuyết công lý</em> như "bức màn vô tri" của Rawls).</p>
<div class="callout"><span class="badge">Phép thử của nhà quản trị</span> Trước khi hành động, hãy hỏi: "Tôi có thấy thoải mái nếu quyết định này lên mặt báo không, và tôi có muốn chính gia đình mình bị đối xử như vậy không?" Nhiều doanh nghiệp còn ban hành bộ quy tắc đạo đức áp dụng ở mọi quốc gia nơi họ hoạt động.</div>`,
  ]]);

const c2q = quiz('ibi101-quiz-1', 'Quiz 1 — Globalization & national differences|||Quiz 1 — Toàn cầu hoá & khác biệt quốc gia', [
  { id: 'q1', question: 'A firm designs a product at home, buys components from three countries and assembles it in a fourth to cut costs. This is an example of…|||Một doanh nghiệp thiết kế sản phẩm ở trong nước, mua linh kiện từ ba nước và lắp ráp ở nước thứ tư để giảm chi phí. Đây là ví dụ của…', options: ['globalization of markets|||toàn cầu hoá thị trường', 'globalization of production|||toàn cầu hoá sản xuất', 'a command economy|||nền kinh tế chỉ huy', 'cultural relativism|||thuyết tương đối văn hoá'], correctIndex: 1, explanation: 'Globalization of production means sourcing from different locations to exploit national differences in the cost and quality of factors of production.|||Toàn cầu hoá sản xuất là tìm nguồn cung từ nhiều địa điểm để khai thác khác biệt quốc gia về chi phí và chất lượng yếu tố sản xuất.' },
  { id: 'q2', question: 'Which statement about Hofstede’s cultural dimensions is correct?|||Nhận định nào về các chiều văn hoá của Hofstede là đúng?', options: ['High power distance means people expect power to be shared equally|||Khoảng cách quyền lực cao nghĩa là mọi người mong quyền lực được chia đều', 'High uncertainty avoidance means people enjoy ambiguity and risk|||Né tránh bất định cao nghĩa là mọi người thích sự mơ hồ và rủi ro', 'The framework assumes one culture per country, which is one of its limitations|||Khung này giả định mỗi nước một nền văn hoá, đó là một hạn chế của nó', 'The dimensions describe every individual in a country exactly|||Các chiều mô tả chính xác từng cá nhân trong một nước'], correctIndex: 2, explanation: 'High power distance means inequality is accepted; high uncertainty avoidance means a preference for rules. The dimensions describe national tendencies, not individuals.|||Khoảng cách quyền lực cao là chấp nhận bất bình đẳng; né tránh bất định cao là chuộng luật lệ. Các chiều mô tả xu hướng quốc gia, không phải từng cá nhân.' },
  { id: 'q3', question: 'A manager argues: "Local firms here pay bribes, so our firm should do the same." This reflects which flawed approach?|||Một nhà quản lý lập luận: "Doanh nghiệp địa phương ở đây đều đưa hối lộ, nên ta cũng làm vậy." Đây là cách tiếp cận sai lầm nào?', options: ['The naive immoralist|||Người vô đạo đức ngây thơ', 'The righteous moralist|||Người đạo đức cực đoan', 'The Kantian approach|||Cách tiếp cận Kant', 'Justice theory|||Thuyết công lý'], correctIndex: 0, explanation: 'The naive immoralist believes that if others ignore ethical norms, a firm may ignore them too — and bribery of foreign officials is illegal under laws such as the FCPA.|||Người vô đạo đức ngây thơ cho rằng người khác bỏ qua chuẩn mực đạo đức thì doanh nghiệp cũng được bỏ qua — trong khi hối lộ quan chức nước ngoài bị cấm bởi các luật như FCPA.' },
]);

const c3 = doc('ibi101-2-1-trade-theory', '2.1 — International trade theory: from mercantilism to Porter’s diamond|||2.1 — Lý thuyết thương mại quốc tế: từ trọng thương tới mô hình kim cương của Porter',
  'Chủ nghĩa trọng thương, lợi thế tuyệt đối (Smith), lợi thế so sánh (Ricardo) và chi phí cơ hội, lý thuyết Heckscher–Ohlin và nghịch lý Leontief, vòng đời sản phẩm (Vernon), lý thuyết thương mại mới (quy mô, lợi thế người đi đầu), mô hình kim cương của Porter và hàm ý cho doanh nghiệp.',
  [[
    `<span class="eyebrow">IBI101 · Part 2 · Lesson 2.1</span>
<h2>International trade theory: from mercantilism to Porter’s diamond</h2>
<p class="lead">Trade theories answer two questions: <strong>why</strong> countries trade, and <strong>what pattern</strong> of trade we should expect. Most of them conclude that free trade makes countries better off overall — even though some groups inside each country lose.</p>
<h3>1. Mercantilism (16th–18th centuries)</h3>
<p>Gold and silver were the measure of national wealth, so a country should run a <strong>trade surplus</strong>: maximize exports, minimize imports with tariffs and quotas. Mercantilism sees trade as a <strong>zero-sum game</strong> — one country’s gain is another’s loss. David Hume showed its flaw: a surplus brings in gold, raises domestic prices and makes exports less competitive, so a permanent surplus is impossible. <em>Neo-mercantilist</em> ideas (treating exports as good and imports as bad) still appear in political debate.</p>
<h3>2. Absolute advantage — Adam Smith (1776)</h3>
<p>A country has an <strong>absolute advantage</strong> in a product when it produces it more efficiently (with fewer resources) than any other country. Countries should specialize in the goods in which they have an absolute advantage and trade for the rest. Trade is a <strong>positive-sum game</strong>.</p>
<h3>3. Comparative advantage — David Ricardo (1817)</h3>
<p>Even a country that is better at producing <em>everything</em> gains from trade. It should specialize in the goods it produces <strong>relatively</strong> most efficiently — where its <strong>opportunity cost</strong> (what it gives up of the other good) is lowest — and import the rest. Specialization according to comparative advantage raises total world output, and both partners can consume more than they could alone (see Exercise 1).</p>
<p>The simple model assumes two countries, two goods, full employment, no transport costs, fixed resources and no effects on income distribution. Relaxing the assumptions adds nuance — for example, resources do not move freely between industries, so some workers lose — but the core result is robust. Dynamic gains (more efficient use of resources, new ideas) can make the benefits even larger.</p>
<h3>4. Heckscher–Ohlin theory</h3>
<p>Comparative advantage arises from differences in <strong>factor endowments</strong> — the amounts of land, labour and capital a country has. A country exports goods that use its <strong>locally abundant</strong> factors intensively and imports goods that use its scarce factors. <strong>The Leontief paradox:</strong> Wassily Leontief found that US exports were <em>less</em> capital-intensive than US imports, although the US was capital-rich — a result that led researchers to consider differences in technology and in skilled labour.</p>
<h3>5. Product life-cycle theory — Raymond Vernon (1960s)</h3>
<p>New products are first developed and made in a rich, innovative country near demanding customers and exported. As the product matures and demand grows abroad, production starts in other advanced countries. When the product becomes <strong>standardized</strong> and price competition dominates, production moves to low-cost developing countries, and the original innovator may become an importer. The theory fits some 20th-century products but is less useful today, when many products are launched globally at once and made in dispersed global value chains.</p>
<h3>6. New trade theory</h3>
<p>In industries with large <strong>economies of scale</strong>, the world market may support only a few firms. Trade lets firms reach scale and gives consumers more variety at lower cost. <strong>First-mover advantages</strong> mean that a country may dominate exports of a product simply because its firms entered first and captured scale — not because of its factor endowments. Paul Krugman received the Nobel Prize for this work. The theory is sometimes used to justify <em>strategic trade policy</em> (Lesson 2.3).</p>
<h3>7. National competitive advantage — Porter’s diamond (1990)</h3>
<table>
<tr><th>Attribute</th><th>Meaning</th></tr>
<tr><td>Factor endowments</td><td>Not only basic factors (natural resources, climate) but especially <strong>advanced factors</strong> — skilled labour, research institutions, infrastructure — that are created by investment</td></tr>
<tr><td>Demand conditions</td><td>Sophisticated, demanding home customers push firms to innovate and upgrade quality</td></tr>
<tr><td>Related and supporting industries</td><td>Internationally competitive suppliers and related industries form <strong>clusters</strong> of knowledge</td></tr>
<tr><td>Firm strategy, structure and rivalry</td><td>Vigorous domestic rivalry forces firms to become efficient and innovative</td></tr>
</table>
<p>Porter adds two outside variables: <strong>chance</strong> (major innovations, wars, shocks) and <strong>government</strong>, which influences every attribute (education, regulation, competition policy).</p>
<h3>Implications for managers</h3>
<ul>
<li><strong>Location:</strong> disperse each value-creation activity to the country where it can be performed most efficiently.</li>
<li><strong>First-mover advantages:</strong> early investment in an industry with large scale economies can lock in a dominant position.</li>
<li><strong>Government policy:</strong> firms have a stake in open trade and often lobby for it; they also benefit from policies that build advanced factors.</li>
</ul>
<div class="callout"><span class="badge">Key idea</span> Absolute advantage asks "who is more productive?"; comparative advantage asks "who gives up less?". Trade follows comparative advantage.</div>`,
    `<span class="eyebrow">IBI101 · Phần 2 · Bài 2.1</span>
<h2>Lý thuyết thương mại quốc tế: từ trọng thương tới mô hình kim cương của Porter</h2>
<p class="lead">Các lý thuyết thương mại trả lời hai câu hỏi: <strong>vì sao</strong> các nước buôn bán với nhau, và nên kỳ vọng <strong>cơ cấu</strong> thương mại như thế nào. Phần lớn đi tới kết luận rằng thương mại tự do làm các nước khấm khá hơn xét tổng thể — dù một số nhóm bên trong mỗi nước bị thiệt.</p>
<h3>1. Chủ nghĩa trọng thương (thế kỷ 16–18)</h3>
<p>Vàng và bạc là thước đo của cải quốc gia, nên một nước phải giữ <strong>thặng dư thương mại</strong>: tối đa hoá xuất khẩu, hạn chế nhập khẩu bằng thuế quan và hạn ngạch. Chủ nghĩa trọng thương xem thương mại là <strong>trò chơi tổng bằng không</strong> — cái được của nước này là cái mất của nước kia. David Hume chỉ ra điểm yếu: thặng dư mang vàng về, đẩy giá trong nước lên và làm hàng xuất khẩu kém cạnh tranh, nên không thể có thặng dư vĩnh viễn. Tư tưởng <em>tân trọng thương</em> (coi xuất khẩu là tốt, nhập khẩu là xấu) vẫn xuất hiện trong tranh luận chính trị.</p>
<h3>2. Lợi thế tuyệt đối — Adam Smith (1776)</h3>
<p>Một nước có <strong>lợi thế tuyệt đối</strong> về một sản phẩm khi sản xuất sản phẩm đó hiệu quả hơn (tốn ít nguồn lực hơn) mọi nước khác. Các nước nên chuyên môn hoá vào hàng hoá mình có lợi thế tuyệt đối và trao đổi lấy phần còn lại. Thương mại là <strong>trò chơi tổng dương</strong>.</p>
<h3>3. Lợi thế so sánh — David Ricardo (1817)</h3>
<p>Ngay cả một nước sản xuất <em>mọi thứ</em> giỏi hơn cũng được lợi từ thương mại. Nước đó nên chuyên môn hoá vào hàng hoá mình sản xuất hiệu quả nhất một cách <strong>tương đối</strong> — nơi <strong>chi phí cơ hội</strong> (lượng hàng kia phải bỏ đi) thấp nhất — và nhập khẩu phần còn lại. Chuyên môn hoá theo lợi thế so sánh làm tăng tổng sản lượng thế giới, và cả hai bên đều có thể tiêu dùng nhiều hơn so với tự làm một mình (xem Bài tập 1).</p>
<p>Mô hình đơn giản giả định hai nước, hai hàng hoá, toàn dụng lao động, không có chi phí vận chuyển, nguồn lực cố định và không xét tác động tới phân phối thu nhập. Nới lỏng các giả định sẽ thêm sắc thái — ví dụ nguồn lực không dịch chuyển tự do giữa các ngành, nên một số người lao động bị thiệt — nhưng kết luận cốt lõi vẫn vững. Lợi ích động (sử dụng nguồn lực hiệu quả hơn, ý tưởng mới) có thể làm lợi ích còn lớn hơn.</p>
<h3>4. Lý thuyết Heckscher–Ohlin</h3>
<p>Lợi thế so sánh bắt nguồn từ khác biệt về <strong>mức sẵn có của các yếu tố sản xuất</strong> — lượng đất đai, lao động và vốn mà một nước có. Một nước xuất khẩu hàng hoá sử dụng nhiều yếu tố <strong>dồi dào trong nước</strong> và nhập khẩu hàng hoá sử dụng nhiều yếu tố khan hiếm. <strong>Nghịch lý Leontief:</strong> Wassily Leontief nhận thấy hàng xuất khẩu của Mỹ <em>ít</em> thâm dụng vốn hơn hàng nhập khẩu, dù Mỹ dồi dào vốn — kết quả khiến các nhà nghiên cứu xét thêm khác biệt về công nghệ và lao động có kỹ năng.</p>
<h3>5. Lý thuyết vòng đời sản phẩm — Raymond Vernon (thập niên 1960)</h3>
<p>Sản phẩm mới được phát triển và sản xuất trước tiên ở một nước giàu, giàu tính đổi mới, gần khách hàng khó tính, rồi được xuất khẩu. Khi sản phẩm trưởng thành và cầu ở nước ngoài tăng, việc sản xuất bắt đầu ở các nước phát triển khác. Khi sản phẩm được <strong>chuẩn hoá</strong> và cạnh tranh giá chiếm ưu thế, sản xuất chuyển sang các nước đang phát triển chi phí thấp, và nước đổi mới ban đầu có thể trở thành nước nhập khẩu. Lý thuyết giải thích tốt một số sản phẩm của thế kỷ 20 nhưng kém hữu ích hơn ngày nay, khi nhiều sản phẩm được tung ra đồng loạt trên toàn cầu và sản xuất trong các chuỗi giá trị toàn cầu phân tán.</p>
<h3>6. Lý thuyết thương mại mới</h3>
<p>Ở những ngành có <strong>lợi thế kinh tế theo quy mô</strong> lớn, thị trường thế giới có thể chỉ đủ chỗ cho vài doanh nghiệp. Thương mại giúp doanh nghiệp đạt quy mô và cho người tiêu dùng nhiều lựa chọn hơn với chi phí thấp hơn. <strong>Lợi thế người đi đầu</strong> nghĩa là một nước có thể thống trị xuất khẩu một sản phẩm đơn giản vì doanh nghiệp của họ vào ngành sớm và chiếm được quy mô — không phải nhờ mức sẵn có yếu tố sản xuất. Paul Krugman nhận giải Nobel cho công trình này. Lý thuyết đôi khi được dùng để biện minh cho <em>chính sách thương mại chiến lược</em> (Bài 2.3).</p>
<h3>7. Lợi thế cạnh tranh quốc gia — mô hình kim cương của Porter (1990)</h3>
<table>
<tr><th>Thuộc tính</th><th>Ý nghĩa</th></tr>
<tr><td>Điều kiện yếu tố sản xuất</td><td>Không chỉ yếu tố cơ bản (tài nguyên thiên nhiên, khí hậu) mà nhất là <strong>yếu tố cao cấp</strong> — lao động có kỹ năng, viện nghiên cứu, hạ tầng — được tạo ra nhờ đầu tư</td></tr>
<tr><td>Điều kiện cầu</td><td>Khách hàng trong nước sành sỏi, khó tính buộc doanh nghiệp đổi mới và nâng chất lượng</td></tr>
<tr><td>Các ngành liên quan và hỗ trợ</td><td>Nhà cung cấp và ngành liên quan có năng lực cạnh tranh quốc tế tạo thành các <strong>cụm ngành</strong> tích tụ tri thức</td></tr>
<tr><td>Chiến lược, cấu trúc và cạnh tranh của doanh nghiệp</td><td>Cạnh tranh gay gắt trong nước buộc doanh nghiệp trở nên hiệu quả và đổi mới</td></tr>
</table>
<p>Porter bổ sung hai biến số bên ngoài: <strong>cơ hội</strong> (đổi mới lớn, chiến tranh, cú sốc) và <strong>chính phủ</strong>, tác động lên mọi thuộc tính (giáo dục, quy định, chính sách cạnh tranh).</p>
<h3>Hàm ý cho nhà quản trị</h3>
<ul>
<li><strong>Địa điểm:</strong> phân tán mỗi hoạt động tạo giá trị tới quốc gia nơi hoạt động đó được thực hiện hiệu quả nhất.</li>
<li><strong>Lợi thế người đi đầu:</strong> đầu tư sớm vào ngành có lợi thế quy mô lớn có thể giữ chắc vị thế thống trị.</li>
<li><strong>Chính sách của chính phủ:</strong> doanh nghiệp có lợi ích từ thương mại mở và thường vận động cho nó; họ cũng hưởng lợi từ chính sách xây dựng yếu tố sản xuất cao cấp.</li>
</ul>
<div class="callout"><span class="badge">Ý chính</span> Lợi thế tuyệt đối hỏi "ai năng suất hơn?"; lợi thế so sánh hỏi "ai phải hy sinh ít hơn?". Thương mại đi theo lợi thế so sánh.</div>`,
  ]]);

const c3e = doc('ibi101-2-2-exercise', 'Exercise 1 — comparative advantage & the gains from trade|||Bài tập 1 — lợi thế so sánh & lợi ích từ thương mại',
  'Bài tập tính với số liệu minh hoạ giả định: xác định lợi thế tuyệt đối và lợi thế so sánh qua chi phí cơ hội, so sánh sản lượng trước và sau chuyên môn hoá, tìm khoảng tỷ lệ trao đổi có lợi và chứng minh cả hai nước tiêu dùng vượt ra ngoài đường giới hạn khả năng sản xuất; kèm lời giải.',
  [[
    `<span class="eyebrow">IBI101 · Part 2 · Exercise</span>
<h2>Exercise 1 — who should make what?</h2>
<div class="callout"><span class="badge">Problem</span> Two fictional countries, Northland and Southland, each have <strong>400 units of resources</strong> and can produce rice (tonnes) and cloth (bolts). Illustrative numbers: Northland needs 10 resource units per tonne of rice and 20 per bolt of cloth; Southland needs 40 per tonne of rice and 25 per bolt of cloth. Without trade, each country splits its resources equally between the two goods.<br>(a) Which country has an absolute advantage in each good? (b) Compute the opportunity costs and identify each country’s comparative advantage. (c) Find output without trade. (d) Southland specializes completely in cloth, and Northland moves 320 units into rice and keeps 80 in cloth. Compare world output. (e) They trade 7 tonnes of rice for 7 bolts of cloth. Show that both gain, and give the range of terms of trade that benefits both.</div>
<h3>Worked solution</h3>
<pre><code class="language-text">Resources per unit      Rice (t)   Cloth (bolt)
  Northland               10          20
  Southland               40          25

(a) Northland uses fewer resources for BOTH goods
    -> absolute advantage in rice AND cloth.

(b) Opportunity cost (OC)
    Northland: 1 t rice  = 10/20 = 0.5 bolt;   1 bolt = 20/10 = 2 t rice
    Southland: 1 t rice  = 40/25 = 1.6 bolt;   1 bolt = 25/40 = 0.625 t rice
    Rice : Northland OC 0.5 &lt; 1.6     -> comparative advantage NORTHLAND
    Cloth: Southland OC 0.625 &lt; 2     -> comparative advantage SOUTHLAND

(c) No trade (200 units on each good)
    Northland: rice 200/10 = 20   cloth 200/20 = 10
    Southland: rice 200/40 =  5   cloth 200/25 =  8
    World    : rice 25            cloth 18

(d) Specialization
    Southland: cloth 400/25 = 16, rice 0
    Northland: rice 320/10 = 32, cloth 80/20 = 4
    World    : rice 32 (+7)       cloth 20 (+2)

(e) Trade 7 t rice for 7 bolts (1 t = 1 bolt)
    Northland: rice 32 - 7 = 25   cloth 4 + 7 = 11   (was 20 and 10: +5, +1)
    Southland: rice  0 + 7 =  7   cloth 16 - 7 = 9   (was 5 and 8:  +2, +1)
    Check: rice 25 + 7 = 32, cloth 11 + 9 = 20  ✓</code></pre>
<table>
<tr><th>Country</th><th>Consumes after trade</th><th>Resources needed to make that alone</th><th>Available</th></tr>
<tr><td>Northland</td><td>25 t rice + 11 bolts</td><td>25 x 10 + 11 x 20 = 470</td><td>400</td></tr>
<tr><td>Southland</td><td>7 t rice + 9 bolts</td><td>7 x 40 + 9 x 25 = 505</td><td>400</td></tr>
</table>
<p><strong>Terms of trade:</strong> Northland gains if it gets more than 0.5 bolt per tonne of rice (its own opportunity cost); Southland gains if it pays less than 1.6 bolts per tonne. Any rate <strong>between 0.5 and 1.6 bolts per tonne</strong> benefits both — the rate of 1 used here lies inside that range.</p>
<p><strong>Why:</strong> both countries consume a bundle that neither could produce alone (the resources needed exceed 400) — they consume <em>beyond their production possibilities frontier</em>. Northland is better at everything, yet it still gains by shifting towards the good in which its advantage is greatest (rice) and buying cloth from the country that gives up less to make it. Note why Northland does not specialize <em>completely</em>: with 40 t of rice and 16 bolts of cloth, world cloth would fall below the no-trade level of 18, so partial specialization is needed here to raise output of both goods.</p>`,
    `<span class="eyebrow">IBI101 · Phần 2 · Bài tập</span>
<h2>Bài tập 1 — nước nào nên làm gì?</h2>
<div class="callout"><span class="badge">Đề</span> Hai quốc gia giả định, Northland và Southland, mỗi nước có <strong>400 đơn vị nguồn lực</strong> và có thể sản xuất gạo (tấn) và vải (súc). Số liệu minh hoạ giả định: Northland cần 10 đơn vị nguồn lực cho mỗi tấn gạo và 20 cho mỗi súc vải; Southland cần 40 cho mỗi tấn gạo và 25 cho mỗi súc vải. Khi chưa có thương mại, mỗi nước chia đều nguồn lực cho hai hàng hoá.<br>(a) Nước nào có lợi thế tuyệt đối về mỗi hàng hoá? (b) Tính chi phí cơ hội và xác định lợi thế so sánh của mỗi nước. (c) Tính sản lượng khi chưa có thương mại. (d) Southland chuyên môn hoá hoàn toàn vào vải, còn Northland chuyển 320 đơn vị sang gạo và giữ 80 đơn vị cho vải. So sánh sản lượng thế giới. (e) Hai nước đổi 7 tấn gạo lấy 7 súc vải. Chứng minh cả hai cùng có lợi, và nêu khoảng tỷ lệ trao đổi có lợi cho cả hai.</div>
<h3>Lời giải</h3>
<pre><code class="language-text">Nguồn lực / đơn vị      Gạo (tấn)   Vải (súc)
  Northland               10          20
  Southland               40          25

(a) Northland dùng ít nguồn lực hơn cho CẢ HAI hàng hoá
    -> lợi thế tuyệt đối về gạo VÀ vải.

(b) Chi phí cơ hội (CPCH)
    Northland: 1 tấn gạo = 10/20 = 0,5 súc;   1 súc = 20/10 = 2 tấn gạo
    Southland: 1 tấn gạo = 40/25 = 1,6 súc;   1 súc = 25/40 = 0,625 tấn gạo
    Gạo: CPCH của Northland 0,5 &lt; 1,6    -> lợi thế so sánh thuộc NORTHLAND
    Vải: CPCH của Southland 0,625 &lt; 2    -> lợi thế so sánh thuộc SOUTHLAND

(c) Chưa có thương mại (200 đơn vị cho mỗi hàng)
    Northland: gạo 200/10 = 20   vải 200/20 = 10
    Southland: gạo 200/40 =  5   vải 200/25 =  8
    Thế giới : gạo 25            vải 18

(d) Chuyên môn hoá
    Southland: vải 400/25 = 16, gạo 0
    Northland: gạo 320/10 = 32, vải 80/20 = 4
    Thế giới : gạo 32 (+7)       vải 20 (+2)

(e) Đổi 7 tấn gạo lấy 7 súc vải (1 tấn = 1 súc)
    Northland: gạo 32 - 7 = 25   vải 4 + 7 = 11   (trước là 20 và 10: +5, +1)
    Southland: gạo  0 + 7 =  7   vải 16 - 7 = 9   (trước là 5 và 8:   +2, +1)
    Kiểm tra: gạo 25 + 7 = 32, vải 11 + 9 = 20  ✓</code></pre>
<table>
<tr><th>Quốc gia</th><th>Tiêu dùng sau thương mại</th><th>Nguồn lực cần để tự làm ra</th><th>Hiện có</th></tr>
<tr><td>Northland</td><td>25 tấn gạo + 11 súc vải</td><td>25 x 10 + 11 x 20 = 470</td><td>400</td></tr>
<tr><td>Southland</td><td>7 tấn gạo + 9 súc vải</td><td>7 x 40 + 9 x 25 = 505</td><td>400</td></tr>
</table>
<p><strong>Tỷ lệ trao đổi:</strong> Northland có lợi nếu nhận được hơn 0,5 súc vải cho mỗi tấn gạo (chi phí cơ hội của chính nó); Southland có lợi nếu trả ít hơn 1,6 súc cho mỗi tấn. Mọi tỷ lệ <strong>trong khoảng 0,5 đến 1,6 súc mỗi tấn</strong> đều có lợi cho cả hai — tỷ lệ 1 dùng ở đây nằm trong khoảng đó.</p>
<p><strong>Vì sao:</strong> cả hai nước tiêu dùng một tổ hợp hàng hoá mà không nước nào tự làm ra được (nguồn lực cần vượt quá 400) — họ tiêu dùng <em>vượt ra ngoài đường giới hạn khả năng sản xuất</em> của mình. Northland giỏi hơn ở mọi thứ, nhưng vẫn được lợi khi dịch chuyển sang hàng hoá mà lợi thế của nó lớn nhất (gạo) và mua vải từ nước phải hy sinh ít hơn để làm ra vải. Lưu ý vì sao Northland không chuyên môn hoá <em>hoàn toàn</em>: khi đó thế giới có 40 tấn gạo và 16 súc vải, lượng vải thấp hơn mức 18 khi chưa có thương mại, nên ở đây cần chuyên môn hoá một phần để tăng sản lượng của cả hai hàng hoá.</p>`,
  ]]);

const c4 = doc('ibi101-2-3-trade-policy-wto', '2.3 — The political economy of trade: policy instruments & the WTO|||2.3 — Kinh tế chính trị của thương mại: công cụ chính sách & WTO',
  'Các công cụ chính sách thương mại (thuế quan, trợ cấp, hạn ngạch nhập khẩu, hạn chế xuất khẩu tự nguyện, yêu cầu nội địa hoá, chính sách hành chính, chống bán phá giá), ai được ai mất, lập luận chính trị và kinh tế cho can thiệp, lý lẽ cho thương mại tự do, từ GATT tới WTO và các nguyên tắc cốt lõi.',
  [[
    `<span class="eyebrow">IBI101 · Part 2 · Lesson 2.3</span>
<h2>The political economy of trade: policy instruments &amp; the WTO</h2>
<p class="lead">Trade theory recommends free trade, yet every government intervenes. To understand why, look at <strong>who gains and who loses</strong> from each instrument.</p>
<h3>Instruments of trade policy</h3>
<table>
<tr><th>Instrument</th><th>How it works</th><th>Who gains / who loses</th></tr>
<tr><td><strong>Tariff</strong></td><td>A tax on imports (or, rarely, exports). <em>Specific</em> tariffs are a fixed amount per unit; <em>ad valorem</em> tariffs are a percentage of the import’s value</td><td>Government (revenue) and domestic producers gain; consumers lose more than the others gain — a net loss to the economy</td></tr>
<tr><td><strong>Subsidy</strong></td><td>A government payment to domestic producers: cash grants, low-interest loans, tax breaks, government equity</td><td>Producers gain; taxpayers pay; can trigger foreign retaliation</td></tr>
<tr><td><strong>Import quota</strong></td><td>A direct limit on the quantity of a good that may be imported; a <em>tariff rate quota</em> applies a low tariff within the quota and a higher one above it</td><td>Domestic producers and holders of import licences gain (the <strong>quota rent</strong>); consumers lose</td></tr>
<tr><td><strong>Voluntary export restraint (VER)</strong></td><td>A quota imposed by the exporting country, usually at the importing government’s request</td><td>Domestic producers gain; foreign producers keep the quota rent; consumers lose</td></tr>
<tr><td><strong>Local content requirement</strong></td><td>A share of a good must be produced domestically (in physical or value terms)</td><td>Domestic component makers gain; final prices rise</td></tr>
<tr><td><strong>Administrative policies</strong></td><td>Bureaucratic rules that make importing hard (slow customs checks, special standards) — typical <em>non-tariff barriers</em></td><td>Domestic producers gain; consumers lose choice</td></tr>
<tr><td><strong>Antidumping policies</strong></td><td>Duties against <em>dumping</em> — selling goods abroad below cost or below their "fair" home-market price</td><td>Protect domestic producers from "unfair" competition; can be abused as disguised protection</td></tr>
</table>
<h3>Why governments intervene</h3>
<ul>
<li><strong>Political arguments</strong> — protect jobs and industries (often under pressure from organized groups), national security (defence-related industries), retaliation against unfair foreign policies, protecting consumers (product safety), furthering foreign-policy objectives (sanctions, preferential access), protecting human rights.</li>
<li><strong>Economic arguments</strong> — the <strong>infant industry</strong> argument (protect a new industry until it becomes competitive; the risk is that protection never ends and breeds inefficiency) and <strong>strategic trade policy</strong> (help national firms win first-mover advantages in industries with large scale economies; the risks are retaliation and capture by special interests).</li>
</ul>
<h3>The case for free trade, revised</h3>
<p>Intervention invites <strong>retaliation</strong> and trade wars, and trade policy is easily <strong>captured by special interests</strong> that seek protection for themselves at the expense of consumers. For these reasons most economists still favour free trade, supported by a system of agreed rules.</p>
<h3>From GATT to the WTO</h3>
<ul>
<li>The <strong>General Agreement on Tariffs and Trade (GATT)</strong>, signed in 1947, cut tariffs through successive negotiating rounds.</li>
<li>The <strong>Uruguay Round</strong> extended the rules to services (GATS) and intellectual property (TRIPS), strengthened dispute settlement and created the <strong>World Trade Organization</strong>, which began operating in 1995.</li>
<li>The <strong>Doha Round</strong>, launched in 2001, aimed to cut barriers on agriculture and help developing countries, but has made little progress; many countries have turned to regional and bilateral agreements instead (Lesson 3.2).</li>
</ul>
<table>
<tr><th>Core WTO principle</th><th>Meaning</th></tr>
<tr><td>Most-favoured-nation (MFN)</td><td>A trade advantage granted to one member must be extended to all members (exceptions exist, e.g. for free trade areas)</td></tr>
<tr><td>National treatment</td><td>Imported goods, once inside the market, must be treated no worse than domestic goods</td></tr>
<tr><td>Binding commitments and transparency</td><td>Members commit to maximum tariff rates and publish their trade rules</td></tr>
<tr><td>Dispute settlement</td><td>Members bring complaints to panels; a member that loses and does not comply can face authorized retaliation</td></tr>
</table>
<div class="callout"><span class="badge">For managers</span> Trade barriers raise the cost of exporting and of global supply chains, and can push firms to produce inside protected markets (FDI). Firms therefore watch trade policy closely and, where it pays, lobby for open markets.</div>`,
    `<span class="eyebrow">IBI101 · Phần 2 · Bài 2.3</span>
<h2>Kinh tế chính trị của thương mại: công cụ chính sách &amp; WTO</h2>
<p class="lead">Lý thuyết thương mại khuyến nghị thương mại tự do, vậy mà chính phủ nào cũng can thiệp. Để hiểu vì sao, hãy xem <strong>ai được và ai mất</strong> từ mỗi công cụ.</p>
<h3>Các công cụ chính sách thương mại</h3>
<table>
<tr><th>Công cụ</th><th>Cách hoạt động</th><th>Ai được / ai mất</th></tr>
<tr><td><strong>Thuế quan</strong></td><td>Thuế đánh vào hàng nhập khẩu (hiếm khi vào hàng xuất khẩu). Thuế <em>tuyệt đối</em> là một khoản cố định trên mỗi đơn vị; thuế <em>theo giá trị</em> là tỷ lệ phần trăm trên trị giá hàng nhập</td><td>Chính phủ (thu ngân sách) và nhà sản xuất trong nước được lợi; người tiêu dùng mất nhiều hơn phần những bên kia được — nền kinh tế chịu tổn thất ròng</td></tr>
<tr><td><strong>Trợ cấp</strong></td><td>Khoản chính phủ chi cho nhà sản xuất trong nước: tiền mặt, vay lãi suất thấp, ưu đãi thuế, góp vốn của nhà nước</td><td>Nhà sản xuất được lợi; người nộp thuế chi trả; có thể khiến nước ngoài trả đũa</td></tr>
<tr><td><strong>Hạn ngạch nhập khẩu</strong></td><td>Giới hạn trực tiếp số lượng một mặt hàng được nhập khẩu; <em>hạn ngạch thuế quan</em> áp thuế thấp trong hạn ngạch và thuế cao hơn ngoài hạn ngạch</td><td>Nhà sản xuất trong nước và người giữ giấy phép nhập khẩu được lợi (<strong>tiền thuê hạn ngạch</strong>); người tiêu dùng chịu thiệt</td></tr>
<tr><td><strong>Hạn chế xuất khẩu tự nguyện (VER)</strong></td><td>Hạn ngạch do chính nước xuất khẩu áp đặt, thường theo yêu cầu của chính phủ nước nhập khẩu</td><td>Nhà sản xuất trong nước được lợi; nhà sản xuất nước ngoài giữ tiền thuê hạn ngạch; người tiêu dùng chịu thiệt</td></tr>
<tr><td><strong>Yêu cầu tỷ lệ nội địa hoá</strong></td><td>Một phần sản phẩm phải được sản xuất trong nước (tính theo hiện vật hoặc giá trị)</td><td>Nhà sản xuất linh kiện trong nước được lợi; giá thành phẩm tăng</td></tr>
<tr><td><strong>Chính sách hành chính</strong></td><td>Quy định thủ tục gây khó cho nhập khẩu (kiểm tra hải quan chậm, tiêu chuẩn đặc biệt) — dạng điển hình của <em>rào cản phi thuế quan</em></td><td>Nhà sản xuất trong nước được lợi; người tiêu dùng mất bớt lựa chọn</td></tr>
<tr><td><strong>Chính sách chống bán phá giá</strong></td><td>Thuế đánh vào hành vi <em>bán phá giá</em> — bán hàng ra nước ngoài dưới giá thành hoặc dưới mức giá "công bằng" ở thị trường nội địa của nhà xuất khẩu</td><td>Bảo vệ nhà sản xuất trong nước khỏi cạnh tranh "không lành mạnh"; có thể bị lạm dụng thành bảo hộ trá hình</td></tr>
</table>
<h3>Vì sao chính phủ can thiệp</h3>
<ul>
<li><strong>Lập luận chính trị</strong> — bảo vệ việc làm và ngành sản xuất (thường dưới áp lực của các nhóm lợi ích có tổ chức), an ninh quốc gia (ngành liên quan quốc phòng), trả đũa chính sách không công bằng của nước ngoài, bảo vệ người tiêu dùng (an toàn sản phẩm), phục vụ mục tiêu đối ngoại (trừng phạt, ưu đãi tiếp cận thị trường), bảo vệ nhân quyền.</li>
<li><strong>Lập luận kinh tế</strong> — lập luận <strong>bảo hộ ngành công nghiệp non trẻ</strong> (bảo vệ một ngành mới cho tới khi đủ sức cạnh tranh; rủi ro là bảo hộ không bao giờ chấm dứt và nuôi dưỡng sự kém hiệu quả) và <strong>chính sách thương mại chiến lược</strong> (giúp doanh nghiệp trong nước giành lợi thế người đi đầu ở những ngành có lợi thế quy mô lớn; rủi ro là bị trả đũa và bị các nhóm lợi ích thao túng).</li>
</ul>
<h3>Lý lẽ cho thương mại tự do, nhìn lại</h3>
<p>Can thiệp dễ dẫn tới <strong>trả đũa</strong> và chiến tranh thương mại, và chính sách thương mại dễ bị <strong>các nhóm lợi ích thao túng</strong> để giành bảo hộ cho riêng mình trên lưng người tiêu dùng. Vì thế phần lớn các nhà kinh tế vẫn ủng hộ thương mại tự do, dựa trên một hệ thống luật lệ được thoả thuận chung.</p>
<h3>Từ GATT tới WTO</h3>
<ul>
<li><strong>Hiệp định chung về Thuế quan và Thương mại (GATT)</strong>, ký năm 1947, cắt giảm thuế quan qua các vòng đàm phán liên tiếp.</li>
<li><strong>Vòng Uruguay</strong> mở rộng luật lệ sang dịch vụ (GATS) và sở hữu trí tuệ (TRIPS), củng cố cơ chế giải quyết tranh chấp và thành lập <strong>Tổ chức Thương mại Thế giới</strong>, bắt đầu hoạt động năm 1995.</li>
<li><strong>Vòng Doha</strong>, khởi động năm 2001, nhằm cắt giảm rào cản trong nông nghiệp và hỗ trợ các nước đang phát triển, nhưng tiến triển rất ít; nhiều nước chuyển sang các hiệp định khu vực và song phương (Bài 3.2).</li>
</ul>
<table>
<tr><th>Nguyên tắc cốt lõi của WTO</th><th>Ý nghĩa</th></tr>
<tr><td>Đối xử tối huệ quốc (MFN)</td><td>Ưu đãi thương mại dành cho một thành viên phải được áp dụng cho mọi thành viên (có ngoại lệ, vd cho khu vực mậu dịch tự do)</td></tr>
<tr><td>Đối xử quốc gia</td><td>Hàng nhập khẩu, khi đã vào thị trường, không bị đối xử kém hơn hàng trong nước</td></tr>
<tr><td>Cam kết ràng buộc và minh bạch</td><td>Thành viên cam kết mức thuế trần và công bố quy định thương mại của mình</td></tr>
<tr><td>Giải quyết tranh chấp</td><td>Thành viên đưa khiếu nại ra ban hội thẩm; thành viên thua kiện mà không tuân thủ có thể bị trả đũa được cho phép</td></tr>
</table>
<div class="callout"><span class="badge">Với nhà quản trị</span> Rào cản thương mại làm tăng chi phí xuất khẩu và chi phí của chuỗi cung ứng toàn cầu, và có thể buộc doanh nghiệp sản xuất ngay trong thị trường được bảo hộ (FDI). Vì vậy doanh nghiệp theo dõi sát chính sách thương mại và, khi có lợi, vận động cho thị trường mở.</div>`,
  ]]);

const c4e = doc('ibi101-2-4-exercise', 'Exercise 2 — who gains and who loses from a tariff?|||Bài tập 2 — ai được, ai mất khi áp thuế quan?',
  'Bài tập tính với cung cầu tuyến tính giả định: giá, sản lượng và lượng nhập khẩu khi thương mại tự do và khi có thuế quan; thay đổi thặng dư tiêu dùng, thặng dư sản xuất, thu thuế và tổn thất vô ích; so sánh với hạn ngạch tương đương; kèm lời giải.',
  [[
    `<span class="eyebrow">IBI101 · Part 2 · Exercise</span>
<h2>Exercise 2 — the arithmetic of a tariff</h2>
<div class="callout"><span class="badge">Problem</span> A small country (a fictional case, illustrative numbers) imports bicycles. Domestic demand is <strong>Qd = 120 − 2P</strong> and domestic supply is <strong>Qs = 2P − 20</strong>, with Q in thousands of bicycles and P in dollars per bicycle. The country can import any quantity at the world price of <strong>$20</strong>; being small, it cannot affect that price.<br>(a) Find the no-trade price. (b) Under free trade, find domestic demand, domestic supply and imports. (c) The government imposes a specific tariff of <strong>$5 per bicycle</strong>. Find the new quantities and the tariff revenue. (d) Compute the change in consumer surplus and producer surplus, and the deadweight loss. (e) What changes if, instead of the tariff, the government sets an import quota that leads to the same domestic price?</div>
<h3>Worked solution</h3>
<pre><code class="language-text">(a) No trade: 120 - 2P = 2P - 20  ->  4P = 140  ->  P = 35,  Q = 50
    World price 20 &lt; 35  -> the country imports.

(b) Free trade at P = 20
    Qd = 120 - 2x20 = 80      Qs = 2x20 - 20 = 20      Imports = 80 - 20 = 60

(c) Tariff $5 -> domestic price P = 20 + 5 = 25   (ad valorem equivalent 5/20 = 25%)
    Qd = 120 - 2x25 = 70      Qs = 2x25 - 20 = 30      Imports = 70 - 30 = 40
    Tariff revenue = 5 x 40 = 200   ($ thousand)

(d) Changes ($ thousand)
    Consumer surplus : -(80 + 70)/2 x 5 = -375
    Producer surplus : +(20 + 30)/2 x 5 = +125
    Government       : +200
    Net change       : -375 + 125 + 200 = -50
    Deadweight loss  = production loss 1/2 x 5 x (30 - 20) = 25
                     + consumption loss 1/2 x 5 x (80 - 70) = 25   = 50  ✓</code></pre>
<table>
<tr><th>Group</th><th>Free trade</th><th>With $5 tariff</th><th>Effect</th></tr>
<tr><td>Domestic price</td><td>$20</td><td>$25</td><td>+$5</td></tr>
<tr><td>Domestic production</td><td>20,000</td><td>30,000</td><td>+10,000 (inefficient producers enter)</td></tr>
<tr><td>Consumption</td><td>80,000</td><td>70,000</td><td>−10,000</td></tr>
<tr><td>Imports</td><td>60,000</td><td>40,000</td><td>−20,000</td></tr>
<tr><td>Consumers / producers / government</td><td>—</td><td>—</td><td>−$375k / +$125k / +$200k</td></tr>
</table>
<p><strong>(e) Quota:</strong> a quota of 40,000 bicycles raises the domestic price to $25 as well, so consumers, domestic producers and the deadweight loss are exactly as above. The difference is the $200k rectangle: it is no longer tariff revenue but a <strong>quota rent</strong> that goes to whoever holds the import licences — domestic importers, or foreign exporters under a VER. If foreign firms capture it, the importing country’s net loss grows from $50k to $250k.</p>
<p><strong>Why:</strong> consumers lose $375k while producers and the government together gain only $325k. The missing $50k is the <strong>deadweight loss</strong>: resources wasted producing 10,000 bicycles at home that could be imported for less, and 10,000 purchases that no longer happen although buyers valued them above the world price. This is why economists say a tariff is "a tax on consumers" that makes the economy as a whole less efficient.</p>`,
    `<span class="eyebrow">IBI101 · Phần 2 · Bài tập</span>
<h2>Bài tập 2 — phép tính của thuế quan</h2>
<div class="callout"><span class="badge">Đề</span> Một nước nhỏ (tình huống giả định, số liệu minh hoạ giả định) nhập khẩu xe đạp. Cầu trong nước là <strong>Qd = 120 − 2P</strong> và cung trong nước là <strong>Qs = 2P − 20</strong>, với Q tính bằng nghìn chiếc và P tính bằng đô la mỗi chiếc. Nước này có thể nhập khẩu bất kỳ lượng nào ở mức giá thế giới <strong>20 $</strong>; vì là nước nhỏ, nó không tác động được tới mức giá đó.<br>(a) Tìm giá khi không có thương mại. (b) Khi thương mại tự do, tìm lượng cầu, lượng cung trong nước và lượng nhập khẩu. (c) Chính phủ áp thuế tuyệt đối <strong>5 $ mỗi chiếc</strong>. Tìm các lượng mới và số thu thuế. (d) Tính thay đổi của thặng dư tiêu dùng, thặng dư sản xuất và tổn thất vô ích. (e) Điều gì thay đổi nếu thay vì thuế quan, chính phủ đặt hạn ngạch nhập khẩu dẫn tới cùng mức giá trong nước?</div>
<h3>Lời giải</h3>
<pre><code class="language-text">(a) Không thương mại: 120 - 2P = 2P - 20  ->  4P = 140  ->  P = 35,  Q = 50
    Giá thế giới 20 &lt; 35  -> nước này nhập khẩu.

(b) Thương mại tự do ở P = 20
    Qd = 120 - 2x20 = 80      Qs = 2x20 - 20 = 20      Nhập khẩu = 80 - 20 = 60

(c) Thuế 5 $ -> giá trong nước P = 20 + 5 = 25   (tương đương thuế theo giá trị 5/20 = 25%)
    Qd = 120 - 2x25 = 70      Qs = 2x25 - 20 = 30      Nhập khẩu = 70 - 30 = 40
    Thu thuế = 5 x 40 = 200   (nghìn $)

(d) Thay đổi (nghìn $)
    Thặng dư tiêu dùng : -(80 + 70)/2 x 5 = -375
    Thặng dư sản xuất  : +(20 + 30)/2 x 5 = +125
    Chính phủ          : +200
    Thay đổi ròng      : -375 + 125 + 200 = -50
    Tổn thất vô ích    = tổn thất sản xuất 1/2 x 5 x (30 - 20) = 25
                       + tổn thất tiêu dùng 1/2 x 5 x (80 - 70) = 25   = 50  ✓</code></pre>
<table>
<tr><th>Nhóm</th><th>Thương mại tự do</th><th>Có thuế 5 $</th><th>Tác động</th></tr>
<tr><td>Giá trong nước</td><td>20 $</td><td>25 $</td><td>+5 $</td></tr>
<tr><td>Sản xuất trong nước</td><td>20.000</td><td>30.000</td><td>+10.000 (nhà sản xuất kém hiệu quả tham gia)</td></tr>
<tr><td>Tiêu dùng</td><td>80.000</td><td>70.000</td><td>−10.000</td></tr>
<tr><td>Nhập khẩu</td><td>60.000</td><td>40.000</td><td>−20.000</td></tr>
<tr><td>Người tiêu dùng / nhà sản xuất / chính phủ</td><td>—</td><td>—</td><td>−375 nghìn $ / +125 nghìn $ / +200 nghìn $</td></tr>
</table>
<p><strong>(e) Hạn ngạch:</strong> hạn ngạch 40.000 chiếc cũng đẩy giá trong nước lên 25 $, nên người tiêu dùng, nhà sản xuất trong nước và tổn thất vô ích giống hệt như trên. Khác biệt nằm ở hình chữ nhật 200 nghìn $: nó không còn là thu thuế mà là <strong>tiền thuê hạn ngạch</strong> thuộc về người nắm giấy phép nhập khẩu — nhà nhập khẩu trong nước, hoặc nhà xuất khẩu nước ngoài nếu là VER. Nếu doanh nghiệp nước ngoài giành được khoản này, tổn thất ròng của nước nhập khẩu tăng từ 50 nghìn $ lên 250 nghìn $.</p>
<p><strong>Vì sao:</strong> người tiêu dùng mất 375 nghìn $ trong khi nhà sản xuất và chính phủ cộng lại chỉ được 325 nghìn $. Khoản 50 nghìn $ biến mất là <strong>tổn thất vô ích</strong>: nguồn lực bị lãng phí để sản xuất trong nước 10.000 chiếc xe lẽ ra nhập khẩu được với giá rẻ hơn, và 10.000 lượt mua không còn diễn ra dù người mua đánh giá chúng cao hơn giá thế giới. Đó là lý do các nhà kinh tế nói thuế quan là "thuế đánh vào người tiêu dùng" làm cả nền kinh tế kém hiệu quả hơn.</p>`,
  ]]);

const c4q = quiz('ibi101-quiz-2', 'Quiz 2 — Trade theory & trade policy|||Quiz 2 — Lý thuyết & chính sách thương mại', [
  { id: 'q1', question: 'Country X can produce both wheat and steel with fewer resources than Country Y. According to Ricardo…|||Nước X sản xuất cả lúa mì và thép bằng ít nguồn lực hơn nước Y. Theo Ricardo…', options: ['X should produce both goods and not trade with Y|||X nên tự sản xuất cả hai hàng và không buôn bán với Y', 'trade is impossible because Y has no absolute advantage|||không thể có thương mại vì Y không có lợi thế tuyệt đối', 'X should run a trade surplus to accumulate gold|||X nên giữ thặng dư thương mại để tích luỹ vàng', 'both can gain if each specializes where its opportunity cost is lower|||cả hai có thể cùng lợi nếu mỗi nước chuyên môn hoá vào hàng có chi phí cơ hội thấp hơn'], correctIndex: 3, explanation: 'Trade follows comparative advantage (lower opportunity cost), not absolute advantage; the gold argument is mercantilism.|||Thương mại đi theo lợi thế so sánh (chi phí cơ hội thấp hơn), không theo lợi thế tuyệt đối; lập luận tích luỹ vàng là của chủ nghĩa trọng thương.' },
  { id: 'q2', question: 'Which theory explains trade by differences in countries’ endowments of land, labour and capital?|||Lý thuyết nào giải thích thương mại bằng khác biệt về mức sẵn có đất đai, lao động và vốn giữa các nước?', options: ['Heckscher–Ohlin theory|||Lý thuyết Heckscher–Ohlin', 'Product life-cycle theory|||Lý thuyết vòng đời sản phẩm', 'New trade theory|||Lý thuyết thương mại mới', 'Mercantilism|||Chủ nghĩa trọng thương'], correctIndex: 0, explanation: 'Heckscher–Ohlin: countries export goods that use their locally abundant factors intensively. The Leontief paradox is the famous test of this theory.|||Heckscher–Ohlin: các nước xuất khẩu hàng hoá sử dụng nhiều yếu tố dồi dào trong nước. Nghịch lý Leontief là phép kiểm định nổi tiếng của lý thuyết này.' },
  { id: 'q3', question: 'Compared with a tariff that raises the domestic price by the same amount, an import quota…|||So với một mức thuế quan làm giá trong nước tăng cùng mức, hạn ngạch nhập khẩu…', options: ['eliminates the deadweight loss|||xoá bỏ tổn thất vô ích', 'lowers the price paid by consumers|||làm giảm giá người tiêu dùng phải trả', 'gives the revenue rectangle to licence holders as quota rent instead of to the government|||trao hình chữ nhật doanh thu cho người giữ giấy phép dưới dạng tiền thuê hạn ngạch thay vì cho chính phủ', 'always raises domestic output more than the tariff|||luôn làm sản lượng trong nước tăng nhiều hơn thuế quan'], correctIndex: 2, explanation: 'At the same domestic price, quantities and deadweight loss are identical; only the destination of the revenue rectangle changes.|||Ở cùng mức giá trong nước, các lượng và tổn thất vô ích giống hệt nhau; chỉ có nơi nhận hình chữ nhật doanh thu là thay đổi.' },
]);

const c5 = doc('ibi101-3-1-fdi', '3.1 — Foreign direct investment: forms, theories & effects|||3.1 — Đầu tư trực tiếp nước ngoài: hình thức, lý thuyết & tác động',
  'FDI và đầu tư gián tiếp, dòng và lượng FDI, đầu tư mới và mua lại/sáp nhập, FDI theo chiều ngang và chiều dọc; vì sao doanh nghiệp chọn FDI thay vì xuất khẩu hay cấp phép (lý thuyết nội hoá), phản ứng độc quyền nhóm, mô hình chiết trung OLI của Dunning; lợi ích và chi phí với nước nhận và nước đầu tư, công cụ chính sách.',
  [[
    `<span class="eyebrow">IBI101 · Part 3 · Lesson 3.1</span>
<h2>Foreign direct investment: forms, theories &amp; effects</h2>
<p class="lead"><strong>FDI</strong> occurs when a firm invests directly in facilities to produce or market a product in a foreign country and gains <strong>control</strong> over them. Buying a small block of shares only for financial return is <strong>foreign portfolio investment</strong>, not FDI.</p>
<h3>Basic vocabulary</h3>
<ul>
<li><strong>Flow</strong> of FDI — the amount invested abroad over a period (usually a year); <strong>outflows</strong> leave a country, <strong>inflows</strong> enter it. <strong>Stock</strong> of FDI — the total accumulated value of foreign-owned assets at a point in time.</li>
<li><strong>Greenfield investment</strong> — building a new operation from scratch. <strong>Acquisition or merger</strong> — buying or combining with an existing local firm; quicker, gives immediate access to customers, brands and staff, but integration can be hard and firms often overpay.</li>
</ul>
<table>
<tr><th>Direction</th><th>Meaning</th><th>Example of the logic</th></tr>
<tr><td><strong>Horizontal FDI</strong></td><td>Investment in the <em>same</em> industry abroad as at home</td><td>A food company builds a plant abroad to make the same products for the local market</td></tr>
<tr><td><strong>Vertical FDI — backward</strong></td><td>Investment in an industry that <em>supplies inputs</em> to the firm’s home operations</td><td>A carmaker invests in a foreign parts or raw-materials producer</td></tr>
<tr><td><strong>Vertical FDI — forward</strong></td><td>Investment in an industry that <em>sells or distributes</em> the firm’s home output</td><td>A manufacturer opens its own sales and distribution subsidiary abroad</td></tr>
</table>
<h3>Why FDI instead of exporting or licensing?</h3>
<p>Exporting and licensing are usually cheaper and less risky than FDI, so theory must explain why firms bear the extra cost:</p>
<ul>
<li><strong>Limits of exporting</strong> — high transportation costs (for low value-to-weight products such as cement or soft drinks) and trade barriers (tariffs, quotas, or the threat of them) make local production more attractive.</li>
<li><strong>Limits of licensing — internalization theory</strong> (also called market imperfections theory). Licensing may give valuable <em>technological know-how</em> to a future competitor; it does not give the tight <em>control</em> over manufacturing, marketing and strategy that the firm may need; and a firm’s advantage may rest on <em>management know-how and routines</em> that cannot be written into a licence. When the market for selling know-how works badly, the firm <strong>internalizes</strong> the transaction by owning the foreign operation.</li>
<li><strong>Strategic behaviour</strong> — in oligopolies, firms often follow each other abroad (Knickerbocker’s <em>oligopolistic reaction</em>) so that no rival gains an unchallenged position in a new market.</li>
<li><strong>Location-specific advantages</strong> — some resources (natural resources, skilled labour, clusters of know-how) are tied to a place, so the firm must go there.</li>
</ul>
<h3>Dunning’s eclectic paradigm (OLI)</h3>
<table>
<tr><th>Advantage</th><th>Question it answers</th><th>Examples</th></tr>
<tr><td><strong>O</strong>wnership</td><td>Does the firm possess something that lets it compete with local firms despite being foreign?</td><td>Technology, brand, management skills, patents</td></tr>
<tr><td><strong>L</strong>ocation</td><td>Is it better to use that asset <em>in</em> the foreign country than to serve it from home?</td><td>Market size, labour cost and skills, resources, trade barriers, incentives</td></tr>
<tr><td><strong>I</strong>nternalization</td><td>Is it better to exploit the asset <em>inside</em> the firm than through a licence or contract?</td><td>Risk of losing know-how, need for quality control, difficulty of pricing know-how</td></tr>
</table>
<p>FDI is most likely when <strong>all three</strong> advantages are present. With O and L but not I, licensing or franchising may be enough; with O but no L, the firm serves the market by exporting.</p>
<h3>Political ideology and FDI</h3>
<p>Views range from the <strong>radical view</strong> (FDI is an instrument of domination by rich countries), through <strong>pragmatic nationalism</strong> (welcome FDI when benefits outweigh costs, often with conditions), to the <strong>free market view</strong> (FDI should flow freely according to comparative advantage). Most countries today take a pragmatic position and compete for investment.</p>
<h3>Benefits and costs</h3>
<table>
<tr><th></th><th>Host country</th><th>Home country</th></tr>
<tr><td>Benefits</td><td>Resource transfer (capital, technology, management skills), employment, possible improvement in the balance of payments (import substitution, exports), more competition and efficiency</td><td>Earnings flowing back, demand for home exports of equipment and components, skills learnt abroad</td></tr>
<tr><td>Costs</td><td>Adverse effects on local competitors (a subsidiary backed by a large parent may drive them out), balance-of-payments outflows (repatriated profits, imported inputs), perceived loss of economic independence</td><td>Possible loss of jobs and exports if production moves offshore</td></tr>
</table>
<p><strong>Policy instruments.</strong> Home countries may encourage outward FDI (investment insurance, tax agreements) or restrict it. Host countries use <strong>incentives</strong> (tax breaks, low-interest loans, grants, often in special economic zones) and <strong>restrictions</strong> — <em>ownership restraints</em> (limits on foreign ownership in some sectors) and <em>performance requirements</em> (local content, exports, technology transfer, local management).</p>
<div class="callout"><span class="badge">Try it</span> Pick a foreign manufacturer operating in Vietnam. Write one sentence each for its O, L and I advantages. If you cannot find an I advantage, ask why it did not simply license a local firm.</div>`,
    `<span class="eyebrow">IBI101 · Phần 3 · Bài 3.1</span>
<h2>Đầu tư trực tiếp nước ngoài: hình thức, lý thuyết &amp; tác động</h2>
<p class="lead"><strong>FDI</strong> diễn ra khi một doanh nghiệp đầu tư trực tiếp vào cơ sở sản xuất hoặc tiếp thị sản phẩm ở nước ngoài và nắm <strong>quyền kiểm soát</strong> các cơ sở đó. Mua một lượng nhỏ cổ phần chỉ để hưởng lợi tức tài chính là <strong>đầu tư gián tiếp nước ngoài</strong> (đầu tư danh mục), không phải FDI.</p>
<h3>Thuật ngữ cơ bản</h3>
<ul>
<li><strong>Dòng</strong> FDI — lượng vốn đầu tư ra nước ngoài trong một thời kỳ (thường là một năm); <strong>dòng ra</strong> đi khỏi một nước, <strong>dòng vào</strong> đi vào một nước. <strong>Lượng</strong> (tích luỹ) FDI — tổng giá trị tài sản thuộc sở hữu nước ngoài tích luỹ tới một thời điểm.</li>
<li><strong>Đầu tư mới (greenfield)</strong> — xây dựng một cơ sở mới từ đầu. <strong>Mua lại hoặc sáp nhập</strong> — mua hoặc hợp nhất với một doanh nghiệp địa phương hiện có; nhanh hơn, có ngay khách hàng, thương hiệu và nhân sự, nhưng việc hợp nhất có thể khó khăn và doanh nghiệp thường trả giá quá cao.</li>
</ul>
<table>
<tr><th>Hướng</th><th>Ý nghĩa</th><th>Ví dụ về logic</th></tr>
<tr><td><strong>FDI theo chiều ngang</strong></td><td>Đầu tư ra nước ngoài vào <em>cùng</em> ngành với hoạt động trong nước</td><td>Một công ty thực phẩm xây nhà máy ở nước ngoài để làm cùng sản phẩm cho thị trường địa phương</td></tr>
<tr><td><strong>FDI theo chiều dọc — ngược</strong></td><td>Đầu tư vào ngành <em>cung cấp đầu vào</em> cho hoạt động trong nước của doanh nghiệp</td><td>Một hãng ô tô đầu tư vào nhà sản xuất linh kiện hoặc nguyên liệu ở nước ngoài</td></tr>
<tr><td><strong>FDI theo chiều dọc — xuôi</strong></td><td>Đầu tư vào ngành <em>bán hoặc phân phối</em> sản phẩm của doanh nghiệp</td><td>Một nhà sản xuất mở công ty con bán hàng và phân phối của riêng mình ở nước ngoài</td></tr>
</table>
<h3>Vì sao chọn FDI thay vì xuất khẩu hay cấp phép?</h3>
<p>Xuất khẩu và cấp phép thường rẻ và ít rủi ro hơn FDI, nên lý thuyết phải giải thích vì sao doanh nghiệp chấp nhận chi phí cao hơn:</p>
<ul>
<li><strong>Giới hạn của xuất khẩu</strong> — chi phí vận chuyển cao (với sản phẩm có tỷ lệ giá trị trên trọng lượng thấp như xi măng hay nước giải khát) và rào cản thương mại (thuế quan, hạn ngạch, hoặc nguy cơ bị áp dụng) khiến sản xuất tại chỗ hấp dẫn hơn.</li>
<li><strong>Giới hạn của cấp phép — lý thuyết nội hoá</strong> (còn gọi là lý thuyết thị trường không hoàn hảo). Cấp phép có thể trao <em>bí quyết công nghệ</em> quý giá cho một đối thủ tương lai; nó không cho doanh nghiệp quyền <em>kiểm soát</em> chặt chẽ sản xuất, marketing và chiến lược mà doanh nghiệp có thể cần; và lợi thế của doanh nghiệp có thể nằm ở <em>bí quyết quản lý và nếp vận hành</em> không thể viết thành hợp đồng cấp phép. Khi thị trường mua bán bí quyết vận hành kém, doanh nghiệp <strong>nội hoá</strong> giao dịch bằng cách sở hữu luôn cơ sở ở nước ngoài.</li>
<li><strong>Hành vi chiến lược</strong> — trong ngành độc quyền nhóm, các doanh nghiệp thường theo chân nhau ra nước ngoài (<em>phản ứng độc quyền nhóm</em> của Knickerbocker) để không đối thủ nào chiếm được vị thế không bị thách thức ở thị trường mới.</li>
<li><strong>Lợi thế gắn với địa điểm</strong> — một số nguồn lực (tài nguyên, lao động có kỹ năng, cụm tri thức) gắn với một nơi, nên doanh nghiệp phải tới đó.</li>
</ul>
<h3>Mô hình chiết trung của Dunning (OLI)</h3>
<table>
<tr><th>Lợi thế</th><th>Câu hỏi được trả lời</th><th>Ví dụ</th></tr>
<tr><td><strong>O</strong> — Sở hữu</td><td>Doanh nghiệp có thứ gì giúp nó cạnh tranh được với doanh nghiệp địa phương dù là người ngoài?</td><td>Công nghệ, thương hiệu, kỹ năng quản lý, bằng sáng chế</td></tr>
<tr><td><strong>L</strong> — Địa điểm</td><td>Dùng tài sản đó <em>ngay tại</em> nước ngoài có tốt hơn phục vụ từ trong nước không?</td><td>Quy mô thị trường, chi phí và kỹ năng lao động, tài nguyên, rào cản thương mại, ưu đãi</td></tr>
<tr><td><strong>I</strong> — Nội hoá</td><td>Khai thác tài sản <em>bên trong</em> doanh nghiệp có tốt hơn qua hợp đồng cấp phép hay hợp đồng khác không?</td><td>Nguy cơ mất bí quyết, nhu cầu kiểm soát chất lượng, khó định giá bí quyết</td></tr>
</table>
<p>FDI dễ xảy ra nhất khi có đủ <strong>cả ba</strong> lợi thế. Có O và L mà thiếu I thì cấp phép hoặc nhượng quyền có thể là đủ; có O mà thiếu L thì doanh nghiệp phục vụ thị trường bằng xuất khẩu.</p>
<h3>Hệ tư tưởng chính trị và FDI</h3>
<p>Quan điểm trải từ <strong>quan điểm cấp tiến</strong> (FDI là công cụ thống trị của các nước giàu), qua <strong>chủ nghĩa dân tộc thực dụng</strong> (đón nhận FDI khi lợi ích lớn hơn chi phí, thường kèm điều kiện), tới <strong>quan điểm thị trường tự do</strong> (FDI nên được lưu chuyển tự do theo lợi thế so sánh). Ngày nay phần lớn các nước theo lập trường thực dụng và cạnh tranh để thu hút đầu tư.</p>
<h3>Lợi ích và chi phí</h3>
<table>
<tr><th></th><th>Nước nhận đầu tư</th><th>Nước đi đầu tư</th></tr>
<tr><td>Lợi ích</td><td>Chuyển giao nguồn lực (vốn, công nghệ, kỹ năng quản lý), việc làm, có thể cải thiện cán cân thanh toán (thay thế nhập khẩu, xuất khẩu), cạnh tranh và hiệu quả cao hơn</td><td>Lợi nhuận chuyển về, cầu đối với máy móc và linh kiện xuất khẩu từ nước đầu tư, kỹ năng học được ở nước ngoài</td></tr>
<tr><td>Chi phí</td><td>Tác động bất lợi tới doanh nghiệp địa phương (một công ty con được công ty mẹ lớn hậu thuẫn có thể đẩy họ ra khỏi thị trường), dòng tiền ra trong cán cân thanh toán (chuyển lợi nhuận về nước, nhập khẩu đầu vào), cảm nhận mất độc lập kinh tế</td><td>Có thể mất việc làm và xuất khẩu nếu sản xuất chuyển ra nước ngoài</td></tr>
</table>
<p><strong>Công cụ chính sách.</strong> Nước đi đầu tư có thể khuyến khích FDI ra nước ngoài (bảo hiểm đầu tư, hiệp định thuế) hoặc hạn chế nó. Nước nhận đầu tư dùng <strong>ưu đãi</strong> (miễn giảm thuế, vay lãi suất thấp, trợ cấp, thường trong các khu kinh tế đặc biệt) và <strong>hạn chế</strong> — <em>giới hạn sở hữu</em> (trần sở hữu nước ngoài ở một số ngành) và <em>yêu cầu về hoạt động</em> (tỷ lệ nội địa hoá, xuất khẩu, chuyển giao công nghệ, sử dụng nhà quản lý địa phương).</p>
<div class="callout"><span class="badge">Thử làm</span> Chọn một nhà sản xuất nước ngoài đang hoạt động ở Việt Nam. Viết mỗi lợi thế O, L và I của họ bằng một câu. Nếu không tìm ra lợi thế I, hãy tự hỏi vì sao họ không đơn giản là cấp phép cho một doanh nghiệp địa phương.</div>`,
  ]]);

const c6 = doc('ibi101-3-2-regional-integration', '3.2 — Regional economic integration: levels, EU, ASEAN & Vietnam’s FTAs|||3.2 — Hội nhập kinh tế khu vực: các cấp độ, EU, ASEAN & các FTA của Việt Nam',
  'Năm cấp độ hội nhập (khu vực mậu dịch tự do, liên minh thuế quan, thị trường chung, liên minh kinh tế, liên minh chính trị), tạo lập và chuyển hướng thương mại, quy tắc xuất xứ, Liên minh châu Âu, ASEAN và Cộng đồng Kinh tế ASEAN, các khối ở châu Mỹ, các FTA Việt Nam tham gia và hàm ý cho doanh nghiệp.',
  [[
    `<span class="eyebrow">IBI101 · Part 3 · Lesson 3.2</span>
<h2>Regional economic integration: levels, EU, ASEAN &amp; Vietnam’s FTAs</h2>
<p class="lead"><strong>Regional economic integration</strong> means agreements among countries in a region (or, increasingly, across regions) to reduce and ultimately remove tariff and non-tariff barriers to the free flow of goods, services and factors of production between them.</p>
<h3>Five levels of integration</h3>
<table>
<tr><th>Level</th><th>Free trade among members</th><th>Common external tariff</th><th>Free movement of labour and capital</th><th>Harmonized economic policy</th><th>Political integration</th></tr>
<tr><td>Free trade area</td><td>✓</td><td></td><td></td><td></td><td></td></tr>
<tr><td>Customs union</td><td>✓</td><td>✓</td><td></td><td></td><td></td></tr>
<tr><td>Common market</td><td>✓</td><td>✓</td><td>✓</td><td></td><td></td></tr>
<tr><td>Economic union</td><td>✓</td><td>✓</td><td>✓</td><td>✓ (common currency, harmonized tax, common monetary and fiscal policy)</td><td></td></tr>
<tr><td>Political union</td><td>✓</td><td>✓</td><td>✓</td><td>✓</td><td>✓ (a central political apparatus)</td></tr>
</table>
<p>In a <strong>free trade area</strong>, each member keeps its own tariffs on non-members. To stop goods entering through the member with the lowest tariff, FTAs use <strong>rules of origin</strong>: a good qualifies for preferential tariffs only if enough of its value or processing comes from inside the area. Exporters must prove origin with certificates — so knowing the rules of origin is how a firm actually captures the benefit of an FTA.</p>
<h3>The case for and against</h3>
<ul>
<li><strong>For:</strong> the gains from trade and FDI of Part 2 and Lesson 3.1, achieved more easily among a few neighbours than in global negotiations; larger markets and economies of scale; closer political ties and peace.</li>
<li><strong>Obstacles:</strong> integration brings adjustment costs to some groups (they lobby against it) and a loss of national sovereignty over policy.</li>
<li><strong>Trade creation vs trade diversion:</strong> integration is beneficial when it <em>creates</em> trade — high-cost domestic producers are replaced by low-cost producers inside the area. It is harmful when it <em>diverts</em> trade — lower-cost suppliers outside the area are replaced by higher-cost suppliers inside it, only because they escape the tariff.</li>
</ul>
<h3>The European Union</h3>
<p>The EU grew out of the European Economic Community created by the Treaty of Rome (1957). It is the most advanced example of integration: a <strong>single market</strong> with free movement of goods, services, capital and people, and a common trade policy. Many — but not all — members share a single currency, the <strong>euro</strong>, managed by the European Central Bank. Key institutions are the European Commission (proposes and implements laws, negotiates trade agreements), the Council of the EU and the European Parliament (which adopt laws) and the Court of Justice. The United Kingdom left the EU in 2020, showing that integration can also be reversed.</p>
<h3>ASEAN and the ASEAN Economic Community</h3>
<p>The Association of Southeast Asian Nations was founded in 1967; Vietnam joined in 1995. Members cut intra-regional tariffs under the ASEAN Free Trade Area, and the <strong>ASEAN Economic Community (AEC)</strong>, established in 2015, aims at a single market and production base with freer flows of goods, services, investment and skilled labour. ASEAN integration is looser than the EU’s: there is no common external tariff, no common currency and no supranational law-making body.</p>
<h3>The Americas</h3>
<p>The <strong>United States–Mexico–Canada Agreement (USMCA)</strong> replaced NAFTA as a free trade area. <strong>Mercosur</strong>, formed by Brazil, Argentina, Paraguay and Uruguay, aims to be a customs union.</p>
<h3>Vietnam’s free trade agreements</h3>
<p>Vietnam has built one of the widest FTA networks in the region. Well-known examples:</p>
<table>
<tr><th>Type</th><th>Agreements</th></tr>
<tr><td>Within ASEAN</td><td>The ASEAN Trade in Goods Agreement (the legal basis of the ASEAN free trade area)</td></tr>
<tr><td>ASEAN with partners</td><td>ASEAN FTAs with China, South Korea, Japan, India, and Australia–New Zealand</td></tr>
<tr><td>Bilateral</td><td>Vietnam–Japan, Vietnam–Chile, Vietnam–Korea (VKFTA), Vietnam–Eurasian Economic Union, the EU–Vietnam FTA (EVFTA) and the UK–Vietnam FTA (UKVFTA)</td></tr>
<tr><td>Mega-regional</td><td>The Comprehensive and Progressive Agreement for Trans-Pacific Partnership (CPTPP) and the Regional Comprehensive Economic Partnership (RCEP)</td></tr>
</table>
<div class="callout"><span class="badge">For managers</span> Integration creates opportunities (larger markets, lower input costs, a chance to concentrate production in the best location inside the bloc) and threats (stronger competitors from other members). A Vietnamese exporter to the EU should ask: does my product meet the EVFTA rules of origin, and how much tariff does that save compared with the normal MFN rate?</div>`,
    `<span class="eyebrow">IBI101 · Phần 3 · Bài 3.2</span>
<h2>Hội nhập kinh tế khu vực: các cấp độ, EU, ASEAN &amp; các FTA của Việt Nam</h2>
<p class="lead"><strong>Hội nhập kinh tế khu vực</strong> là các thoả thuận giữa những nước trong một khu vực (và ngày càng nhiều thoả thuận xuyên khu vực) nhằm giảm và cuối cùng xoá bỏ rào cản thuế quan và phi thuế quan đối với sự lưu chuyển tự do của hàng hoá, dịch vụ và các yếu tố sản xuất giữa họ.</p>
<h3>Năm cấp độ hội nhập</h3>
<table>
<tr><th>Cấp độ</th><th>Tự do thương mại giữa các thành viên</th><th>Biểu thuế quan chung với bên ngoài</th><th>Tự do di chuyển lao động và vốn</th><th>Hài hoà chính sách kinh tế</th><th>Hội nhập chính trị</th></tr>
<tr><td>Khu vực mậu dịch tự do</td><td>✓</td><td></td><td></td><td></td><td></td></tr>
<tr><td>Liên minh thuế quan</td><td>✓</td><td>✓</td><td></td><td></td><td></td></tr>
<tr><td>Thị trường chung</td><td>✓</td><td>✓</td><td>✓</td><td></td><td></td></tr>
<tr><td>Liên minh kinh tế</td><td>✓</td><td>✓</td><td>✓</td><td>✓ (đồng tiền chung, hài hoà thuế, chính sách tiền tệ và tài khoá chung)</td><td></td></tr>
<tr><td>Liên minh chính trị</td><td>✓</td><td>✓</td><td>✓</td><td>✓</td><td>✓ (một bộ máy chính trị trung ương)</td></tr>
</table>
<p>Trong <strong>khu vực mậu dịch tự do</strong>, mỗi thành viên giữ biểu thuế riêng với nước ngoài khối. Để hàng hoá không "đi vòng" qua thành viên có thuế thấp nhất, các FTA dùng <strong>quy tắc xuất xứ</strong>: hàng hoá chỉ được hưởng thuế ưu đãi nếu đủ tỷ lệ giá trị hoặc công đoạn chế biến diễn ra trong khu vực. Nhà xuất khẩu phải chứng minh xuất xứ bằng giấy chứng nhận — vì thế nắm vững quy tắc xuất xứ chính là cách doanh nghiệp thực sự hưởng lợi từ một FTA.</p>
<h3>Lý lẽ ủng hộ và phản đối</h3>
<ul>
<li><strong>Ủng hộ:</strong> lợi ích từ thương mại và FDI ở Phần 2 và Bài 3.1, đạt được dễ hơn giữa vài nước láng giềng so với đàm phán toàn cầu; thị trường lớn hơn và lợi thế quy mô; quan hệ chính trị gắn bó và hoà bình.</li>
<li><strong>Trở ngại:</strong> hội nhập gây chi phí điều chỉnh cho một số nhóm (họ vận động phản đối) và làm mất một phần chủ quyền quốc gia về chính sách.</li>
<li><strong>Tạo lập thương mại và chuyển hướng thương mại:</strong> hội nhập có lợi khi nó <em>tạo lập</em> thương mại — nhà sản xuất trong nước chi phí cao được thay bằng nhà sản xuất chi phí thấp trong khu vực. Hội nhập có hại khi nó <em>chuyển hướng</em> thương mại — nhà cung cấp chi phí thấp hơn ngoài khu vực bị thay bằng nhà cung cấp chi phí cao hơn trong khu vực, chỉ vì họ không phải chịu thuế.</li>
</ul>
<h3>Liên minh châu Âu</h3>
<p>EU phát triển từ Cộng đồng Kinh tế châu Âu được thành lập theo Hiệp ước Rome (1957). Đây là ví dụ hội nhập sâu nhất: một <strong>thị trường chung duy nhất</strong> với tự do di chuyển hàng hoá, dịch vụ, vốn và con người, cùng một chính sách thương mại chung. Nhiều — nhưng không phải tất cả — thành viên dùng chung đồng tiền <strong>euro</strong>, do Ngân hàng Trung ương châu Âu quản lý. Các thể chế then chốt gồm Uỷ ban châu Âu (đề xuất và thực thi luật, đàm phán hiệp định thương mại), Hội đồng EU và Nghị viện châu Âu (thông qua luật) và Toà án Công lý. Vương quốc Anh rời EU năm 2020, cho thấy hội nhập cũng có thể đảo ngược.</p>
<h3>ASEAN và Cộng đồng Kinh tế ASEAN</h3>
<p>Hiệp hội các quốc gia Đông Nam Á được thành lập năm 1967; Việt Nam gia nhập năm 1995. Các thành viên cắt giảm thuế quan nội khối trong khuôn khổ Khu vực Mậu dịch Tự do ASEAN, và <strong>Cộng đồng Kinh tế ASEAN (AEC)</strong>, thành lập năm 2015, hướng tới một thị trường và cơ sở sản xuất thống nhất với sự lưu chuyển tự do hơn của hàng hoá, dịch vụ, đầu tư và lao động có tay nghề. Hội nhập ASEAN lỏng hơn EU: không có biểu thuế quan chung với bên ngoài, không có đồng tiền chung và không có cơ quan lập pháp siêu quốc gia.</p>
<h3>Châu Mỹ</h3>
<p><strong>Hiệp định Hoa Kỳ – Mexico – Canada (USMCA)</strong> thay thế NAFTA với tư cách một khu vực mậu dịch tự do. <strong>Mercosur</strong>, do Brazil, Argentina, Paraguay và Uruguay lập ra, hướng tới trở thành một liên minh thuế quan.</p>
<h3>Các hiệp định thương mại tự do của Việt Nam</h3>
<p>Việt Nam đã xây dựng một trong những mạng lưới FTA rộng nhất khu vực. Một số ví dụ tiêu biểu:</p>
<table>
<tr><th>Loại</th><th>Hiệp định</th></tr>
<tr><td>Trong ASEAN</td><td>Hiệp định Thương mại Hàng hoá ASEAN (ATIGA — nền tảng pháp lý của khu vực mậu dịch tự do ASEAN)</td></tr>
<tr><td>ASEAN với đối tác</td><td>Các FTA giữa ASEAN với Trung Quốc, Hàn Quốc, Nhật Bản, Ấn Độ, và Úc – New Zealand</td></tr>
<tr><td>Song phương</td><td>Việt Nam – Nhật Bản, Việt Nam – Chile, Việt Nam – Hàn Quốc (VKFTA), Việt Nam – Liên minh Kinh tế Á – Âu, Hiệp định EVFTA với Liên minh châu Âu và Hiệp định UKVFTA với Vương quốc Anh</td></tr>
<tr><td>Siêu khu vực</td><td>Hiệp định Đối tác Toàn diện và Tiến bộ xuyên Thái Bình Dương (CPTPP) và Hiệp định Đối tác Kinh tế Toàn diện Khu vực (RCEP)</td></tr>
</table>
<div class="callout"><span class="badge">Với nhà quản trị</span> Hội nhập mở ra cơ hội (thị trường lớn hơn, chi phí đầu vào thấp hơn, cơ hội tập trung sản xuất ở địa điểm tốt nhất trong khối) và cả đe doạ (đối thủ mạnh hơn từ các thành viên khác). Một nhà xuất khẩu Việt Nam sang EU nên hỏi: sản phẩm của mình có đáp ứng quy tắc xuất xứ của EVFTA không, và điều đó tiết kiệm được bao nhiêu thuế so với mức thuế MFN thông thường?</div>`,
  ]]);

const c7 = doc('ibi101-3-3-forex-monetary-system', '3.3 — The foreign exchange market & the international monetary system|||3.3 — Thị trường ngoại hối & hệ thống tiền tệ quốc tế',
  'Chức năng của thị trường ngoại hối, tỷ giá giao ngay, kỳ hạn và hoán đổi, tỷ giá chéo, các yếu tố quyết định tỷ giá (ngang giá sức mua, lãi suất, tâm lý), khả năng chuyển đổi tiền tệ; bản vị vàng, Bretton Woods, chế độ thả nổi, các chế độ tỷ giá, vai trò IMF; ba loại rủi ro tỷ giá và cách phòng ngừa; ví dụ số minh hoạ.',
  [[
    `<span class="eyebrow">IBI101 · Part 3 · Lesson 3.3</span>
<h2>The foreign exchange market &amp; the international monetary system</h2>
<p class="lead">The <strong>foreign exchange (forex) market</strong> is where one currency is converted into another. The <strong>exchange rate</strong> is the price of one currency in terms of another. Because rates move, a deal that is profitable today may be unprofitable when the money arrives.</p>
<h3>Functions of the forex market</h3>
<ul>
<li><strong>Currency conversion</strong> — paying foreign suppliers, converting export receipts, investing abroad, and speculation (trying to profit from rate movements).</li>
<li><strong>Insurance against foreign exchange risk</strong> — <em>hedging</em>, i.e. protecting against losses from unpredictable changes in exchange rates.</li>
</ul>
<table>
<tr><th>Instrument</th><th>Meaning</th></tr>
<tr><td>Spot exchange rate</td><td>The rate for exchanging currencies on a particular day (settlement within a short period)</td></tr>
<tr><td>Forward exchange rate</td><td>A rate agreed today for an exchange at a specified future date (e.g. 30, 90 or 180 days)</td></tr>
<tr><td>Currency swap</td><td>The simultaneous purchase and sale of a given amount of foreign exchange for two different value dates, e.g. a spot sale combined with a forward repurchase</td></tr>
</table>
<p>The market is a global over-the-counter network of banks, brokers and firms, active around the clock, with major centres such as London and New York. The US dollar is on one side of most transactions, acting as a <strong>vehicle currency</strong>.</p>
<h3>A worked example (illustrative rates, not current market rates)</h3>
<pre><code class="language-text">Spot: 1 USD = 25,000 VND.  A Vietnamese exporter will receive USD 10,000 in 90 days.
  Value at today's spot         : 10,000 x 25,000 = 250,000,000 VND
  If the dong weakens to 26,000 : 10,000 x 26,000 = 260,000,000 VND  (+10,000,000)
  If the dong strengthens to 24,000: 10,000 x 24,000 = 240,000,000 VND  (-10,000,000)
  Hedge with a 90-day forward at 25,300: 10,000 x 25,300 = 253,000,000 VND, certain

Percentage change from 25,000 to 26,000 VND per USD:
  USD appreciates : 26,000 / 25,000 - 1 = +4.00%
  VND depreciates : 25,000 / 26,000 - 1 = -3.85%   (not simply -4%)

Cross rate: 1 EUR = 1.10 USD and 1 USD = 25,000 VND
  -> 1 EUR = 1.10 x 25,000 = 27,500 VND

Relative PPP: inflation 4% in Vietnam, 2% in the US (illustrative)
  expected rate in one year = 25,000 x 1.04 / 1.02 = about 25,490 VND per USD</code></pre>
<h3>What determines exchange rates?</h3>
<ul>
<li><strong>Prices and inflation</strong> — the <em>law of one price</em> says identical goods should cost the same in different countries once converted into one currency. <strong>Purchasing power parity (PPP)</strong> extends this: a country with higher inflation should see its currency depreciate by roughly the inflation difference. PPP predicts well in the long run and for high-inflation countries, poorly in the short run.</li>
<li><strong>Interest rates</strong> — the <em>Fisher effect</em> links nominal interest rates to expected inflation, so interest-rate differences also signal expected currency movements.</li>
<li><strong>Investor psychology</strong> — expectations and <em>bandwagon effects</em> can move rates sharply in the short run, away from what fundamentals suggest.</li>
</ul>
<p><strong>Currency convertibility.</strong> A currency is <em>freely convertible</em> when residents and non-residents may buy unlimited amounts of foreign currency with it; <em>externally convertible</em> when only non-residents may do so freely; <em>non-convertible</em> when neither may. Non-convertibility pushes firms towards <strong>countertrade</strong> — barter-like deals in which goods are traded for goods.</p>
<h3>The international monetary system</h3>
<table>
<tr><th>Era</th><th>How it worked</th></tr>
<tr><td>Gold standard</td><td>Currencies were pegged to gold, which gave fixed exchange rates and automatic adjustment of trade imbalances; it broke down in the period between the two world wars</td></tr>
<tr><td>Bretton Woods (1944)</td><td>Fixed but adjustable rates: currencies were pegged to the US dollar, and the dollar was convertible into gold at 35 dollars per ounce. The conference also created the <strong>IMF</strong> and the <strong>World Bank</strong></td></tr>
<tr><td>Collapse (early 1970s)</td><td>The US ended the dollar’s convertibility into gold in 1971 and fixed rates gave way to floating by 1973; the Jamaica Agreement (1976) formally accepted floating rates</td></tr>
<tr><td>Today</td><td>A mixed system: some currencies <strong>float freely</strong>, many follow a <strong>managed ("dirty") float</strong> in which the central bank intervenes, some are <strong>pegged</strong> to another currency or a basket, and a few use a <strong>currency board</strong> (the domestic currency is fully backed by a foreign reserve currency)</td></tr>
</table>
<p><strong>Fixed vs floating.</strong> Floating rates give each country <em>monetary policy autonomy</em> and adjust trade imbalances automatically; fixed rates impose <em>monetary discipline</em> (governments cannot simply print money), limit speculation and reduce uncertainty for trade and investment. Vietnam’s central bank (the State Bank of Vietnam) manages the dong around a daily central (reference) rate with a permitted trading band — a form of managed exchange rate. The <strong>IMF</strong> lends to countries facing currency, banking or foreign-debt crises, usually with <em>conditions</em> (tighter budgets, reforms) — a practice that is often debated.</p>
<h3>Implications for firms: three kinds of exposure</h3>
<table>
<tr><th>Exposure</th><th>Meaning</th><th>Typical response</th></tr>
<tr><td>Transaction exposure</td><td>Individual deals (receivables, payables, loans) change value in home currency</td><td>Forward contracts, currency swaps, leading and lagging payments</td></tr>
<tr><td>Translation exposure</td><td>Accounting results of foreign subsidiaries change when translated into the parent’s currency</td><td>Mostly an accounting issue; matching assets and liabilities by currency</td></tr>
<tr><td>Economic exposure</td><td>Long-run competitiveness and future cash flows change with exchange rates</td><td>Spread production across several countries, keep sourcing flexible, price in stable currencies where possible</td></tr>
</table>
<div class="callout"><span class="badge">Remember</span> A forward contract does not guarantee the <em>best</em> result — in the example, the exporter would have earned more without the hedge if the dong had weakened to 26,000. It guarantees a <em>known</em> result, which lets the firm plan and price with confidence.</div>`,
    `<span class="eyebrow">IBI101 · Phần 3 · Bài 3.3</span>
<h2>Thị trường ngoại hối &amp; hệ thống tiền tệ quốc tế</h2>
<p class="lead"><strong>Thị trường ngoại hối</strong> là nơi một đồng tiền được chuyển đổi sang đồng tiền khác. <strong>Tỷ giá hối đoái</strong> là giá của một đồng tiền tính bằng đồng tiền khác. Vì tỷ giá biến động, một hợp đồng có lãi hôm nay có thể thành lỗ khi tiền về tới nơi.</p>
<h3>Chức năng của thị trường ngoại hối</h3>
<ul>
<li><strong>Chuyển đổi tiền tệ</strong> — trả tiền cho nhà cung cấp nước ngoài, đổi tiền thu từ xuất khẩu, đầu tư ra nước ngoài, và đầu cơ (tìm lợi nhuận từ biến động tỷ giá).</li>
<li><strong>Bảo hiểm trước rủi ro tỷ giá</strong> — <em>phòng ngừa rủi ro</em>, tức là tự bảo vệ trước thua lỗ do tỷ giá thay đổi khó lường.</li>
</ul>
<table>
<tr><th>Công cụ</th><th>Ý nghĩa</th></tr>
<tr><td>Tỷ giá giao ngay</td><td>Tỷ giá trao đổi tiền tệ trong một ngày cụ thể (thanh toán trong thời gian ngắn)</td></tr>
<tr><td>Tỷ giá kỳ hạn</td><td>Tỷ giá thoả thuận hôm nay cho một giao dịch vào một ngày xác định trong tương lai (vd 30, 90 hay 180 ngày)</td></tr>
<tr><td>Hoán đổi tiền tệ</td><td>Đồng thời mua và bán một lượng ngoại tệ cho hai ngày giá trị khác nhau, vd bán giao ngay kết hợp mua lại kỳ hạn</td></tr>
</table>
<p>Thị trường là một mạng lưới phi tập trung toàn cầu gồm ngân hàng, nhà môi giới và doanh nghiệp, hoạt động suốt ngày đêm, với các trung tâm lớn như London và New York. Đồng đô la Mỹ có mặt ở một phía của phần lớn giao dịch, đóng vai trò <strong>đồng tiền trung gian</strong>.</p>
<h3>Ví dụ tính (tỷ giá minh hoạ giả định, không phải tỷ giá thị trường hiện hành)</h3>
<pre><code class="language-text">Giao ngay: 1 USD = 25.000 VND.  Một nhà xuất khẩu Việt Nam sẽ nhận 10.000 USD sau 90 ngày.
  Giá trị theo tỷ giá hôm nay       : 10.000 x 25.000 = 250.000.000 VND
  Nếu đồng Việt Nam yếu đi còn 26.000: 10.000 x 26.000 = 260.000.000 VND  (+10.000.000)
  Nếu đồng Việt Nam mạnh lên 24.000 : 10.000 x 24.000 = 240.000.000 VND  (-10.000.000)
  Phòng ngừa bằng kỳ hạn 90 ngày ở 25.300: 10.000 x 25.300 = 253.000.000 VND, chắc chắn

Thay đổi phần trăm khi tỷ giá đi từ 25.000 lên 26.000 VND/USD:
  USD lên giá  : 26.000 / 25.000 - 1 = +4,00%
  VND mất giá  : 25.000 / 26.000 - 1 = -3,85%   (không đơn giản là -4%)

Tỷ giá chéo: 1 EUR = 1,10 USD và 1 USD = 25.000 VND
  -> 1 EUR = 1,10 x 25.000 = 27.500 VND

Ngang giá sức mua tương đối: lạm phát 4% ở Việt Nam, 2% ở Mỹ (minh hoạ)
  tỷ giá kỳ vọng sau một năm = 25.000 x 1,04 / 1,02 = khoảng 25.490 VND/USD</code></pre>
<h3>Điều gì quyết định tỷ giá?</h3>
<ul>
<li><strong>Giá cả và lạm phát</strong> — <em>quy luật một giá</em> nói rằng hàng hoá giống hệt nhau phải có cùng giá ở các nước khác nhau khi quy về một đồng tiền. <strong>Ngang giá sức mua (PPP)</strong> mở rộng ý đó: nước có lạm phát cao hơn sẽ thấy đồng tiền của mình mất giá xấp xỉ bằng chênh lệch lạm phát. PPP dự báo tốt trong dài hạn và với các nước lạm phát cao, kém trong ngắn hạn.</li>
<li><strong>Lãi suất</strong> — <em>hiệu ứng Fisher</em> gắn lãi suất danh nghĩa với lạm phát kỳ vọng, nên chênh lệch lãi suất cũng báo hiệu biến động tỷ giá kỳ vọng.</li>
<li><strong>Tâm lý nhà đầu tư</strong> — kỳ vọng và <em>hiệu ứng bầy đàn</em> có thể làm tỷ giá biến động mạnh trong ngắn hạn, lệch khỏi mức các yếu tố cơ bản gợi ý.</li>
</ul>
<p><strong>Khả năng chuyển đổi tiền tệ.</strong> Một đồng tiền <em>tự do chuyển đổi</em> khi cả người cư trú và không cư trú đều được dùng nó mua ngoại tệ không giới hạn; <em>chuyển đổi với bên ngoài</em> khi chỉ người không cư trú được làm vậy tự do; <em>không chuyển đổi</em> khi không ai được làm vậy. Tiền tệ không chuyển đổi đẩy doanh nghiệp sang <strong>thương mại đối lưu</strong> — những giao dịch kiểu hàng đổi hàng.</p>
<h3>Hệ thống tiền tệ quốc tế</h3>
<table>
<tr><th>Thời kỳ</th><th>Cách vận hành</th></tr>
<tr><td>Bản vị vàng</td><td>Các đồng tiền được neo vào vàng, tạo ra tỷ giá cố định và cơ chế tự điều chỉnh mất cân bằng thương mại; hệ thống sụp đổ trong giai đoạn giữa hai cuộc chiến tranh thế giới</td></tr>
<tr><td>Bretton Woods (1944)</td><td>Tỷ giá cố định nhưng có thể điều chỉnh: các đồng tiền neo vào đô la Mỹ, còn đô la được đổi ra vàng ở mức 35 đô la mỗi ounce. Hội nghị cũng lập ra <strong>IMF</strong> và <strong>Ngân hàng Thế giới</strong></td></tr>
<tr><td>Sụp đổ (đầu thập niên 1970)</td><td>Năm 1971 Mỹ chấm dứt việc đổi đô la ra vàng và tới năm 1973 tỷ giá cố định nhường chỗ cho thả nổi; Hiệp định Jamaica (1976) chính thức chấp nhận tỷ giá thả nổi</td></tr>
<tr><td>Ngày nay</td><td>Một hệ thống hỗn hợp: một số đồng tiền <strong>thả nổi tự do</strong>, nhiều đồng theo <strong>thả nổi có quản lý</strong> với sự can thiệp của ngân hàng trung ương, một số được <strong>neo</strong> vào một đồng tiền khác hoặc một rổ tiền tệ, và vài nước dùng <strong>uỷ ban tiền tệ</strong> (nội tệ được bảo đảm hoàn toàn bằng một đồng ngoại tệ dự trữ)</td></tr>
</table>
<p><strong>Cố định hay thả nổi.</strong> Tỷ giá thả nổi cho mỗi nước <em>quyền tự chủ chính sách tiền tệ</em> và tự động điều chỉnh mất cân bằng thương mại; tỷ giá cố định áp đặt <em>kỷ luật tiền tệ</em> (chính phủ không thể cứ in thêm tiền), hạn chế đầu cơ và giảm bất định cho thương mại và đầu tư. Ngân hàng Nhà nước Việt Nam quản lý đồng Việt Nam quanh một tỷ giá trung tâm công bố hằng ngày với biên độ giao dịch cho phép — một dạng tỷ giá có quản lý. <strong>IMF</strong> cho vay các nước gặp khủng hoảng tiền tệ, ngân hàng hoặc nợ nước ngoài, thường kèm <em>điều kiện</em> (thắt chặt ngân sách, cải cách) — một thực tiễn thường gây tranh luận.</p>
<h3>Hàm ý cho doanh nghiệp: ba loại rủi ro tỷ giá</h3>
<table>
<tr><th>Loại rủi ro</th><th>Ý nghĩa</th><th>Cách ứng phó điển hình</th></tr>
<tr><td>Rủi ro giao dịch</td><td>Từng giao dịch (khoản phải thu, phải trả, khoản vay) thay đổi giá trị khi quy ra nội tệ</td><td>Hợp đồng kỳ hạn, hoán đổi tiền tệ, thanh toán sớm hoặc trễ</td></tr>
<tr><td>Rủi ro chuyển đổi (kế toán)</td><td>Kết quả kế toán của công ty con ở nước ngoài thay đổi khi quy đổi sang đồng tiền của công ty mẹ</td><td>Chủ yếu là vấn đề kế toán; cân đối tài sản và nợ theo từng đồng tiền</td></tr>
<tr><td>Rủi ro kinh tế</td><td>Năng lực cạnh tranh dài hạn và dòng tiền tương lai thay đổi theo tỷ giá</td><td>Phân tán sản xuất ở nhiều nước, giữ nguồn cung linh hoạt, định giá bằng đồng tiền ổn định khi có thể</td></tr>
</table>
<div class="callout"><span class="badge">Ghi nhớ</span> Hợp đồng kỳ hạn không bảo đảm kết quả <em>tốt nhất</em> — trong ví dụ, nếu đồng Việt Nam yếu đi còn 26.000 thì nhà xuất khẩu không phòng ngừa sẽ thu được nhiều hơn. Nó bảo đảm một kết quả <em>biết trước</em>, giúp doanh nghiệp lập kế hoạch và định giá một cách chắc chắn.</div>`,
  ]]);

const c7q = quiz('ibi101-quiz-3', 'Quiz 3 — FDI, integration & foreign exchange|||Quiz 3 — FDI, hội nhập & ngoại hối', [
  { id: 'q1', question: 'A carmaker acquires a foreign company that produces steel and components for its home assembly plants. This is…|||Một hãng ô tô mua lại một công ty nước ngoài sản xuất thép và linh kiện cho các nhà máy lắp ráp ở trong nước. Đây là…', options: ['horizontal FDI|||FDI theo chiều ngang', 'backward vertical FDI|||FDI theo chiều dọc ngược', 'forward vertical FDI|||FDI theo chiều dọc xuôi', 'foreign portfolio investment|||đầu tư gián tiếp nước ngoài'], correctIndex: 1, explanation: 'Backward vertical FDI invests in an industry that supplies inputs; forward vertical FDI invests in industries that sell or distribute the output.|||FDI chiều dọc ngược đầu tư vào ngành cung cấp đầu vào; FDI chiều dọc xuôi đầu tư vào ngành bán hoặc phân phối đầu ra.' },
  { id: 'q2', question: 'Members remove tariffs among themselves and adopt a common external tariff, but labour and capital cannot move freely. This level of integration is a…|||Các thành viên xoá thuế quan giữa họ và áp một biểu thuế chung với bên ngoài, nhưng lao động và vốn chưa được di chuyển tự do. Cấp độ hội nhập này là…', options: ['free trade area|||khu vực mậu dịch tự do', 'common market|||thị trường chung', 'economic union|||liên minh kinh tế', 'customs union|||liên minh thuế quan'], correctIndex: 3, explanation: 'A customs union = free trade + common external tariff. Adding free movement of factors makes it a common market.|||Liên minh thuế quan = tự do thương mại + biểu thuế chung với bên ngoài. Thêm tự do di chuyển yếu tố sản xuất thì thành thị trường chung.' },
  { id: 'q3', question: 'A Vietnamese importer must pay USD 50,000 in 90 days and fears the dong will weaken. The simplest hedge is to…|||Một nhà nhập khẩu Việt Nam phải trả 50.000 USD sau 90 ngày và lo đồng Việt Nam sẽ mất giá. Cách phòng ngừa đơn giản nhất là…', options: ['buy USD forward for delivery in 90 days|||mua kỳ hạn USD giao sau 90 ngày', 'sell USD forward for delivery in 90 days|||bán kỳ hạn USD giao sau 90 ngày', 'wait and buy USD at the spot rate in 90 days|||chờ 90 ngày rồi mua USD theo tỷ giá giao ngay', 'convert its dong into gold|||đổi tiền đồng ra vàng'], correctIndex: 0, explanation: 'Buying USD forward locks in the dong cost of the payment today; waiting leaves the importer exposed to transaction risk.|||Mua kỳ hạn USD chốt ngay hôm nay số tiền đồng phải bỏ ra; chờ đợi khiến nhà nhập khẩu chịu rủi ro giao dịch.' },
]);

const c8 = doc('ibi101-4-1-strategy', '4.1 — The strategy of international business|||4.1 — Chiến lược kinh doanh quốc tế',
  'Tạo giá trị và chuỗi giá trị, lợi ích của mở rộng toàn cầu (năng lực cốt lõi, lợi thế địa điểm, hiệu ứng kinh nghiệm, học hỏi từ công ty con), áp lực giảm chi phí và áp lực đáp ứng địa phương, bốn chiến lược: quốc tế, bản địa hoá, chuẩn hoá toàn cầu, xuyên quốc gia.',
  [[
    `<span class="eyebrow">IBI101 · Part 4 · Lesson 4.1</span>
<h2>The strategy of international business</h2>
<p class="lead">A firm’s <strong>strategy</strong> is the set of actions managers take to reach the firm’s goals — above all, to create more value than rivals and earn higher profits. Going international adds new ways to create value, and new tensions.</p>
<h3>Value creation</h3>
<p>A firm creates value by lowering its costs (<strong>low-cost strategy</strong>) or by making its product more attractive so it can charge more (<strong>differentiation strategy</strong>). Its operations form a <strong>value chain</strong>: <em>primary activities</em> (research and development, production, marketing and sales, customer service) and <em>support activities</em> (information systems, logistics, human resources, company infrastructure). Each activity can be placed in a different country.</p>
<h3>Benefits of global expansion</h3>
<ul>
<li><strong>Expanding the market</strong> by leveraging <strong>core competencies</strong> — skills that competitors cannot easily imitate — into foreign markets where local rivals lack them.</li>
<li><strong>Location economies</strong> — performing each value-creation activity where it is done best or cheapest, creating a <em>global web</em> of activities (subject to transport costs, trade barriers and political risk).</li>
<li><strong>Experience effects</strong> — the <em>experience curve</em>: unit costs fall as cumulative output rises, through learning effects and economies of scale. Serving the world market from one location moves a firm down the curve faster.</li>
<li><strong>Leveraging subsidiary skills</strong> — valuable skills can also be developed in a foreign subsidiary and transferred to the rest of the network.</li>
</ul>
<h3>Two pressures that pull in opposite directions</h3>
<table>
<tr><th>Pressures for cost reductions</th><th>Pressures for local responsiveness</th></tr>
<tr><td>Strong where products are <strong>commodity-like</strong> (steel, chemicals, basic electronics), where price is the main basis of competition, where competitors are based in low-cost locations, where there is persistent excess capacity, and where customers are powerful and switching costs are low</td><td>Arise from differences in <strong>consumer tastes and preferences</strong> (often cultural), <strong>infrastructure and traditional practices</strong> (electrical standards, driving on the left or right), <strong>distribution channels</strong>, and <strong>host-government demands</strong> (local content, protection, regulation)</td></tr>
</table>
<p>Responding to local differences raises costs (different products, smaller production runs), so a firm that faces strong pressure in both directions has a hard balancing act.</p>
<h3>Four basic strategies</h3>
<table>
<tr><th>Strategy</th><th>Cost pressure</th><th>Local responsiveness pressure</th><th>What the firm does</th><th>Risk</th></tr>
<tr><td><strong>Global standardization</strong></td><td>High</td><td>Low</td><td>Sells a standardized product worldwide and concentrates activities in a few optimal locations to reap experience effects and location economies</td><td>Poor fit where local tastes really differ</td></tr>
<tr><td><strong>Localization</strong></td><td>Low</td><td>High</td><td>Customizes products and marketing to each country’s tastes and rules</td><td>Higher costs; duplication across countries</td></tr>
<tr><td><strong>Transnational</strong></td><td>High</td><td>High</td><td>Tries to achieve low costs, local responsiveness <em>and</em> global learning at once — skills flow in all directions across the network</td><td>Organizationally very hard to implement</td></tr>
<tr><td><strong>International</strong></td><td>Low</td><td>Low</td><td>Sells products first developed for the home market internationally, with only limited local customization; key functions such as R&amp;D stay at home</td><td>Becomes unviable when cost pressure or local demands grow</td></tr>
</table>
<p>Strategies <strong>evolve</strong>: as competition intensifies, pressure for cost reductions tends to rise, and firms using international or localization strategies often move towards global standardization or transnational strategies.</p>
<div class="callout"><span class="badge">Think about it</span> For a product you know well — instant noodles, smartphones, cement, streaming — ask: is it bought mainly on price? Do tastes, standards or regulations differ by country? Your two answers place it on the map above.</div>`,
    `<span class="eyebrow">IBI101 · Phần 4 · Bài 4.1</span>
<h2>Chiến lược kinh doanh quốc tế</h2>
<p class="lead"><strong>Chiến lược</strong> của một doanh nghiệp là tập hợp hành động mà nhà quản trị thực hiện để đạt mục tiêu của doanh nghiệp — trước hết là tạo ra nhiều giá trị hơn đối thủ và thu lợi nhuận cao hơn. Vươn ra quốc tế thêm những cách mới để tạo giá trị, và cả những mâu thuẫn mới.</p>
<h3>Tạo giá trị</h3>
<p>Doanh nghiệp tạo giá trị bằng cách hạ chi phí (<strong>chiến lược chi phí thấp</strong>) hoặc làm sản phẩm hấp dẫn hơn để bán giá cao hơn (<strong>chiến lược khác biệt hoá</strong>). Hoạt động của doanh nghiệp tạo thành <strong>chuỗi giá trị</strong>: <em>hoạt động chính</em> (nghiên cứu và phát triển, sản xuất, marketing và bán hàng, dịch vụ khách hàng) và <em>hoạt động hỗ trợ</em> (hệ thống thông tin, logistics, nhân sự, hạ tầng doanh nghiệp). Mỗi hoạt động có thể đặt ở một quốc gia khác nhau.</p>
<h3>Lợi ích của mở rộng toàn cầu</h3>
<ul>
<li><strong>Mở rộng thị trường</strong> bằng cách đưa <strong>năng lực cốt lõi</strong> — những kỹ năng đối thủ khó bắt chước — tới các thị trường nước ngoài nơi đối thủ địa phương không có.</li>
<li><strong>Lợi thế kinh tế theo địa điểm</strong> — thực hiện mỗi hoạt động tạo giá trị ở nơi làm tốt nhất hoặc rẻ nhất, tạo thành một <em>mạng lưới toàn cầu</em> các hoạt động (tuỳ thuộc chi phí vận chuyển, rào cản thương mại và rủi ro chính trị).</li>
<li><strong>Hiệu ứng kinh nghiệm</strong> — <em>đường cong kinh nghiệm</em>: chi phí đơn vị giảm khi sản lượng tích luỹ tăng, nhờ hiệu ứng học hỏi và lợi thế quy mô. Phục vụ thị trường thế giới từ một địa điểm giúp doanh nghiệp đi xuống đường cong nhanh hơn.</li>
<li><strong>Tận dụng kỹ năng của công ty con</strong> — kỹ năng giá trị cũng có thể được phát triển ở một công ty con ở nước ngoài rồi chuyển giao cho phần còn lại của mạng lưới.</li>
</ul>
<h3>Hai áp lực kéo theo hai hướng ngược nhau</h3>
<table>
<tr><th>Áp lực giảm chi phí</th><th>Áp lực đáp ứng địa phương</th></tr>
<tr><td>Mạnh khi sản phẩm <strong>giống hàng thông dụng</strong> (thép, hoá chất, điện tử cơ bản), khi giá là cơ sở cạnh tranh chính, khi đối thủ đặt ở nơi chi phí thấp, khi dư thừa công suất kéo dài, và khi khách hàng có quyền lực lớn và chi phí chuyển đổi thấp</td><td>Phát sinh từ khác biệt về <strong>thị hiếu và sở thích người tiêu dùng</strong> (thường do văn hoá), <strong>hạ tầng và tập quán truyền thống</strong> (chuẩn điện, lái xe bên trái hay bên phải), <strong>kênh phân phối</strong>, và <strong>yêu cầu của chính phủ nước sở tại</strong> (tỷ lệ nội địa hoá, bảo hộ, quy định)</td></tr>
</table>
<p>Đáp ứng khác biệt địa phương làm tăng chi phí (nhiều mẫu sản phẩm, lô sản xuất nhỏ hơn), nên doanh nghiệp chịu áp lực mạnh theo cả hai hướng phải cân bằng rất khó.</p>
<h3>Bốn chiến lược cơ bản</h3>
<table>
<tr><th>Chiến lược</th><th>Áp lực chi phí</th><th>Áp lực đáp ứng địa phương</th><th>Doanh nghiệp làm gì</th><th>Rủi ro</th></tr>
<tr><td><strong>Chuẩn hoá toàn cầu</strong></td><td>Cao</td><td>Thấp</td><td>Bán sản phẩm chuẩn hoá trên toàn thế giới và tập trung hoạt động ở vài địa điểm tối ưu để khai thác hiệu ứng kinh nghiệm và lợi thế địa điểm</td><td>Không phù hợp khi thị hiếu địa phương thực sự khác biệt</td></tr>
<tr><td><strong>Bản địa hoá</strong></td><td>Thấp</td><td>Cao</td><td>Điều chỉnh sản phẩm và marketing theo thị hiếu và quy định của từng nước</td><td>Chi phí cao hơn; trùng lặp giữa các nước</td></tr>
<tr><td><strong>Xuyên quốc gia</strong></td><td>Cao</td><td>Cao</td><td>Cố gắng đồng thời đạt chi phí thấp, đáp ứng địa phương <em>và</em> học hỏi toàn cầu — kỹ năng lưu chuyển theo mọi hướng trong mạng lưới</td><td>Rất khó triển khai về mặt tổ chức</td></tr>
<tr><td><strong>Quốc tế</strong></td><td>Thấp</td><td>Thấp</td><td>Bán ra quốc tế những sản phẩm vốn phát triển cho thị trường trong nước, chỉ điều chỉnh địa phương rất ít; các chức năng then chốt như R&amp;D giữ ở trong nước</td><td>Mất khả năng tồn tại khi áp lực chi phí hoặc yêu cầu địa phương tăng</td></tr>
</table>
<p>Chiến lược <strong>thay đổi theo thời gian</strong>: khi cạnh tranh gay gắt hơn, áp lực giảm chi phí thường tăng, và doanh nghiệp theo chiến lược quốc tế hay bản địa hoá thường chuyển dần sang chuẩn hoá toàn cầu hoặc xuyên quốc gia.</p>
<div class="callout"><span class="badge">Suy ngẫm</span> Với một sản phẩm bạn biết rõ — mì ăn liền, điện thoại thông minh, xi măng, dịch vụ xem phim trực tuyến — hãy hỏi: người ta mua nó chủ yếu vì giá không? Thị hiếu, tiêu chuẩn hay quy định có khác nhau giữa các nước không? Hai câu trả lời sẽ đặt sản phẩm vào bản đồ ở trên.</div>`,
  ]]);

const c9 = doc('ibi101-4-2-entry-modes', '4.2 — Entering foreign markets: which, when, on what scale & how|||4.2 — Thâm nhập thị trường nước ngoài: đâu, khi nào, quy mô nào & bằng cách nào',
  'Ba quyết định cơ bản (thị trường nào, thời điểm, quy mô và cam kết chiến lược), lợi thế và bất lợi người đi đầu, sáu phương thức thâm nhập (xuất khẩu, dự án chìa khoá trao tay, cấp phép, nhượng quyền, liên doanh, công ty con 100% vốn) với ưu nhược điểm, cách chọn phương thức theo năng lực cốt lõi và áp lực chi phí, đầu tư mới hay mua lại, liên minh chiến lược.',
  [[
    `<span class="eyebrow">IBI101 · Part 4 · Lesson 4.2</span>
<h2>Entering foreign markets: which, when, on what scale &amp; how</h2>
<h3>Three basic decisions</h3>
<ol>
<li><strong>Which markets?</strong> Weigh long-run benefits (market size, purchasing power today and in the future) against costs and risks (political, economic, legal). Markets where the firm offers something local rivals lack are the most attractive.</li>
<li><strong>When?</strong> <strong>First-mover advantages</strong>: pre-empting rivals, building sales volume and moving down the experience curve, and creating switching costs that tie customers in. <strong>First-mover disadvantages</strong>: <em>pioneering costs</em> — learning the rules the hard way, educating customers, and the risk that the rules change.</li>
<li><strong>On what scale?</strong> Large-scale entry is a <strong>strategic commitment</strong> — hard to reverse. It signals seriousness to customers and rivals, but reduces flexibility and ties up resources. Small-scale entry lets the firm learn while limiting its exposure.</li>
</ol>
<h3>Six entry modes</h3>
<table>
<tr><th>Mode</th><th>What it is</th><th>Advantages</th><th>Disadvantages</th></tr>
<tr><td><strong>Exporting</strong></td><td>Producing at home and selling abroad, directly or through agents and distributors</td><td>Avoids the cost of setting up operations abroad; can realize experience-curve and location economies from a central plant</td><td>High transport costs; trade barriers; home may not be the lowest-cost location; dependence on local marketing agents</td></tr>
<tr><td><strong>Turnkey project</strong></td><td>The contractor designs, builds and starts up a complete facility (a refinery, a power plant) and hands over the "key" to the foreign client</td><td>Earns returns from process know-how in countries where FDI is restricted; low risk</td><td>No long-term interest in the market; may create a competitor; selling technology may give away a competitive advantage</td></tr>
<tr><td><strong>Licensing</strong></td><td>A licensor grants rights to intangible property (patents, designs, trademarks, technology) to a licensee for a royalty fee</td><td>Low development costs and risks; a way in when capital is scarce or FDI is barred; earns money from intangibles the firm will not use itself</td><td>Little control over manufacturing, marketing and strategy; hard to coordinate globally; risk of losing technological know-how (cross-licensing can reduce it)</td></tr>
<tr><td><strong>Franchising</strong></td><td>A specialized, longer-term form of licensing used mainly by service firms: the franchiser sells the brand <em>and</em> requires the franchisee to follow strict rules of doing business, for a fee and a share of revenue</td><td>Low cost and risk; fast expansion; local partners bring capital and market knowledge</td><td>Quality control at a distance — one poor outlet damages the global brand; master franchises and subsidiaries in each country help</td></tr>
<tr><td><strong>Joint venture (JV)</strong></td><td>A firm jointly owned by two or more otherwise independent firms (often 50/50)</td><td>Local partner’s knowledge of culture, language, politics and business; shared costs and risks; sometimes the only politically acceptable route</td><td>Risk of losing control of technology to the partner; less tight control for global coordination; conflicts over goals and control when the balance of power shifts</td></tr>
<tr><td><strong>Wholly owned subsidiary (WOS)</strong></td><td>The firm owns 100% of the foreign entity — set up as a <strong>greenfield venture</strong> or through an <strong>acquisition</strong></td><td>Protects technology; tight control for global strategic coordination; captures all profits; realizes location and experience economies</td><td>Highest cost and risk; the firm bears all the problems of doing business abroad</td></tr>
</table>
<h3>Choosing among the modes</h3>
<ul>
<li><strong>Core competence in technological know-how</strong> → avoid licensing and JVs that could leak the technology; a WOS is safer. (Licensing can still work if the technology will soon be out of date anyway, or if licensing establishes it as the industry standard.)</li>
<li><strong>Core competence in management know-how</strong> (typical of service firms — hotels, restaurants, retail) → the brand is protected by trademark law, so franchising, often combined with a local JV or subsidiary as <em>master franchisee</em>, works well.</li>
<li><strong>Strong pressure for cost reductions</strong> → firms concentrate production (exporting from optimal locations) or use WOS that can be tightly coordinated.</li>
</ul>
<p><strong>Greenfield or acquisition?</strong> Acquisitions are quick, pre-empt rivals and may be less risky because the firm buys a going concern; but many fail because acquirers overpay, cultures clash, integration is slow and the target is not screened well enough. A greenfield venture lets the firm build exactly the organization and culture it wants, but is slower and riskier, and rivals may enter first.</p>
<p><strong>Strategic alliances</strong> — cooperative agreements between potential or actual competitors, from formal JVs to short-term contracts — can facilitate entry, share fixed costs and bring together complementary skills, but may give competitors low-cost access to technology and markets. Success depends on choosing the right partner, designing the alliance to prevent unintended transfers, and actively learning from the partner.</p>
<div class="callout"><span class="badge">Rule of thumb</span> As you move from exporting to licensing, franchising, joint ventures and wholly owned subsidiaries, <strong>control</strong>, <strong>resource commitment</strong> and <strong>risk</strong> all tend to rise together. The right mode balances how much control your competitive advantage needs against how much commitment and risk you can afford.</div>`,
    `<span class="eyebrow">IBI101 · Phần 4 · Bài 4.2</span>
<h2>Thâm nhập thị trường nước ngoài: đâu, khi nào, quy mô nào &amp; bằng cách nào</h2>
<h3>Ba quyết định cơ bản</h3>
<ol>
<li><strong>Thị trường nào?</strong> Cân nhắc lợi ích dài hạn (quy mô thị trường, sức mua hiện tại và tương lai) so với chi phí và rủi ro (chính trị, kinh tế, pháp lý). Hấp dẫn nhất là những thị trường nơi doanh nghiệp mang tới thứ mà đối thủ địa phương không có.</li>
<li><strong>Khi nào?</strong> <strong>Lợi thế người đi đầu</strong>: chiếm chỗ trước đối thủ, xây dựng doanh số và đi xuống đường cong kinh nghiệm, tạo chi phí chuyển đổi để giữ chân khách hàng. <strong>Bất lợi người đi đầu</strong>: <em>chi phí tiên phong</em> — phải tự trả giá để học luật chơi, giáo dục khách hàng, và rủi ro luật chơi thay đổi.</li>
<li><strong>Quy mô nào?</strong> Thâm nhập quy mô lớn là một <strong>cam kết chiến lược</strong> — khó đảo ngược. Nó cho khách hàng và đối thủ thấy doanh nghiệp nghiêm túc, nhưng giảm tính linh hoạt và giam nguồn lực. Thâm nhập quy mô nhỏ cho phép vừa làm vừa học mà hạn chế mức độ rủi ro.</li>
</ol>
<h3>Sáu phương thức thâm nhập</h3>
<table>
<tr><th>Phương thức</th><th>Là gì</th><th>Ưu điểm</th><th>Nhược điểm</th></tr>
<tr><td><strong>Xuất khẩu</strong></td><td>Sản xuất ở trong nước rồi bán ra nước ngoài, trực tiếp hoặc qua đại lý và nhà phân phối</td><td>Tránh chi phí thiết lập cơ sở ở nước ngoài; có thể tận dụng hiệu ứng kinh nghiệm và lợi thế địa điểm từ một nhà máy trung tâm</td><td>Chi phí vận chuyển cao; rào cản thương mại; trong nước có thể không phải nơi chi phí thấp nhất; phụ thuộc vào đại lý marketing địa phương</td></tr>
<tr><td><strong>Dự án chìa khoá trao tay</strong></td><td>Nhà thầu thiết kế, xây dựng và vận hành thử cả một cơ sở hoàn chỉnh (nhà máy lọc dầu, nhà máy điện) rồi trao "chìa khoá" cho khách hàng nước ngoài</td><td>Thu lợi từ bí quyết quy trình ở những nước hạn chế FDI; rủi ro thấp</td><td>Không có lợi ích lâu dài ở thị trường; có thể tạo ra đối thủ; bán công nghệ có thể làm mất lợi thế cạnh tranh</td></tr>
<tr><td><strong>Cấp phép</strong></td><td>Bên cấp phép trao quyền sử dụng tài sản vô hình (bằng sáng chế, kiểu dáng, nhãn hiệu, công nghệ) cho bên nhận phép để lấy phí bản quyền</td><td>Chi phí phát triển và rủi ro thấp; là lối vào khi thiếu vốn hoặc FDI bị cấm; kiếm tiền từ tài sản vô hình mà doanh nghiệp không tự dùng</td><td>Ít kiểm soát sản xuất, marketing và chiến lược; khó phối hợp toàn cầu; nguy cơ mất bí quyết công nghệ (cấp phép chéo có thể giảm nguy cơ này)</td></tr>
<tr><td><strong>Nhượng quyền thương mại</strong></td><td>Một dạng cấp phép chuyên biệt, dài hạn hơn, chủ yếu dùng trong ngành dịch vụ: bên nhượng quyền bán thương hiệu <em>và</em> buộc bên nhận quyền tuân thủ quy tắc kinh doanh chặt chẽ, đổi lấy phí và một phần doanh thu</td><td>Chi phí và rủi ro thấp; mở rộng nhanh; đối tác địa phương mang vốn và hiểu biết thị trường</td><td>Khó kiểm soát chất lượng từ xa — một cửa hàng kém làm tổn hại thương hiệu toàn cầu; nhượng quyền chính (master franchise) và công ty con ở mỗi nước giúp giảm vấn đề này</td></tr>
<tr><td><strong>Liên doanh (JV)</strong></td><td>Doanh nghiệp do hai hay nhiều doanh nghiệp độc lập cùng sở hữu (thường 50/50)</td><td>Đối tác địa phương am hiểu văn hoá, ngôn ngữ, chính trị và kinh doanh; chia sẻ chi phí và rủi ro; đôi khi là con đường duy nhất được chấp nhận về chính trị</td><td>Nguy cơ mất quyền kiểm soát công nghệ vào tay đối tác; kiểm soát kém chặt cho phối hợp toàn cầu; xung đột về mục tiêu và quyền kiểm soát khi cán cân quyền lực thay đổi</td></tr>
<tr><td><strong>Công ty con 100% vốn (WOS)</strong></td><td>Doanh nghiệp sở hữu 100% pháp nhân ở nước ngoài — lập bằng <strong>đầu tư mới (greenfield)</strong> hoặc bằng <strong>mua lại</strong></td><td>Bảo vệ công nghệ; kiểm soát chặt để phối hợp chiến lược toàn cầu; hưởng toàn bộ lợi nhuận; tận dụng lợi thế địa điểm và kinh nghiệm</td><td>Chi phí và rủi ro cao nhất; doanh nghiệp tự gánh mọi khó khăn khi kinh doanh ở nước ngoài</td></tr>
</table>
<h3>Chọn giữa các phương thức</h3>
<ul>
<li><strong>Năng lực cốt lõi là bí quyết công nghệ</strong> → tránh cấp phép và liên doanh vì dễ rò rỉ công nghệ; công ty con 100% vốn an toàn hơn. (Cấp phép vẫn có thể hợp lý nếu công nghệ đằng nào cũng sớm lỗi thời, hoặc nếu cấp phép giúp công nghệ trở thành chuẩn của ngành.)</li>
<li><strong>Năng lực cốt lõi là bí quyết quản lý</strong> (điển hình ở doanh nghiệp dịch vụ — khách sạn, nhà hàng, bán lẻ) → thương hiệu được luật nhãn hiệu bảo vệ, nên nhượng quyền, thường kết hợp với một liên doanh hoặc công ty con địa phương làm <em>bên nhận quyền chính</em>, là phù hợp.</li>
<li><strong>Áp lực giảm chi phí mạnh</strong> → doanh nghiệp tập trung sản xuất (xuất khẩu từ những địa điểm tối ưu) hoặc dùng công ty con 100% vốn có thể phối hợp chặt chẽ.</li>
</ul>
<p><strong>Đầu tư mới hay mua lại?</strong> Mua lại nhanh, chặn trước đối thủ và có thể ít rủi ro hơn vì mua một doanh nghiệp đang vận hành; nhưng nhiều thương vụ thất bại vì bên mua trả giá quá cao, văn hoá xung đột, hợp nhất chậm và việc thẩm định mục tiêu chưa kỹ. Đầu tư mới cho phép xây dựng đúng tổ chức và văn hoá mình muốn, nhưng chậm hơn, rủi ro hơn, và đối thủ có thể vào trước.</p>
<p><strong>Liên minh chiến lược</strong> — thoả thuận hợp tác giữa các đối thủ tiềm năng hoặc hiện tại, từ liên doanh chính thức tới hợp đồng ngắn hạn — giúp thâm nhập thị trường dễ hơn, chia sẻ chi phí cố định và kết hợp các kỹ năng bổ sung cho nhau, nhưng có thể cho đối thủ tiếp cận công nghệ và thị trường với giá rẻ. Thành công phụ thuộc vào chọn đúng đối tác, thiết kế liên minh để tránh chuyển giao ngoài ý muốn, và chủ động học hỏi từ đối tác.</p>
<div class="callout"><span class="badge">Quy tắc kinh nghiệm</span> Khi đi từ xuất khẩu tới cấp phép, nhượng quyền, liên doanh và công ty con 100% vốn, <strong>mức kiểm soát</strong>, <strong>mức cam kết nguồn lực</strong> và <strong>rủi ro</strong> thường cùng tăng. Phương thức đúng là phương thức cân bằng giữa mức kiểm soát mà lợi thế cạnh tranh của bạn cần với mức cam kết và rủi ro mà bạn chịu được.</div>`,
  ]]);

const c9e = doc('ibi101-4-3-exercise', 'Exercise 3 — choosing an entry mode for a cafe chain|||Bài tập 3 — chọn phương thức thâm nhập cho một chuỗi cà phê',
  'Bài tập tình huống giả định: chấm điểm bốn phương thức thâm nhập (xuất khẩu, nhượng quyền, liên doanh, công ty con 100% vốn) bằng bảng tiêu chí có trọng số, đề xuất phương thức, kiểm tra độ nhạy khi đổi trọng số và đề ra cách giảm rủi ro chính; kèm lời giải.',
  [[
    `<span class="eyebrow">IBI101 · Part 4 · Exercise</span>
<h2>Exercise 3 — how should the chain go abroad?</h2>
<div class="callout"><span class="badge">Problem</span> Mây Coffee (a fictional case) is a Vietnamese café chain with 60 stores, known for its own roasting recipes and a well-documented store-operations system. It wants cafés in a neighbouring ASEAN country within two years, has limited capital, and knows little about the local property market and consumer habits. Management scored four entry modes from 1 (poor) to 5 (excellent) on five criteria (illustrative scores):</div>
<table>
<tr><th>Criterion (weight)</th><th>Exporting packaged coffee</th><th>Franchising</th><th>Joint venture</th><th>Wholly owned subsidiary</th></tr>
<tr><td>Control over brand, quality and know-how (0.30)</td><td>3</td><td>2</td><td>3</td><td>5</td></tr>
<tr><td>Low capital requirement (0.20)</td><td>5</td><td>5</td><td>3</td><td>1</td></tr>
<tr><td>Access to local market knowledge (0.20)</td><td>1</td><td>4</td><td>5</td><td>2</td></tr>
<tr><td>Low risk exposure (0.15)</td><td>5</td><td>4</td><td>3</td><td>1</td></tr>
<tr><td>Speed of entry (0.15)</td><td>4</td><td>5</td><td>3</td><td>1</td></tr>
</table>
<p>(a) Compute the weighted score of each mode. (b) Recommend a mode. (c) Management then says control matters more: recompute with control 0.40 and speed 0.05 (other weights unchanged). Does the ranking change? (d) How can the firm reduce the main weakness of the recommended mode?</p>
<h3>Worked solution</h3>
<pre><code class="language-text">(a) Weights 0.30 / 0.20 / 0.20 / 0.15 / 0.15  (sum = 1.00)
    Exporting   = 0.30x3 + 0.20x5 + 0.20x1 + 0.15x5 + 0.15x4
                = 0.90 + 1.00 + 0.20 + 0.75 + 0.60 = 3.45
    Franchising = 0.30x2 + 0.20x5 + 0.20x4 + 0.15x4 + 0.15x5
                = 0.60 + 1.00 + 0.80 + 0.60 + 0.75 = 3.75   ← first
    Joint venture = 0.30x3 + 0.20x3 + 0.20x5 + 0.15x3 + 0.15x3
                = 0.90 + 0.60 + 1.00 + 0.45 + 0.45 = 3.40
    Wholly owned  = 0.30x5 + 0.20x1 + 0.20x2 + 0.15x1 + 0.15x1
                = 1.50 + 0.20 + 0.40 + 0.15 + 0.15 = 2.40

(c) Weights 0.40 / 0.20 / 0.20 / 0.15 / 0.05  (sum = 1.00)
    Exporting     = 1.20 + 1.00 + 0.20 + 0.75 + 0.20 = 3.35
    Franchising   = 0.80 + 1.00 + 0.80 + 0.60 + 0.25 = 3.45   ← still first
    Joint venture = 1.20 + 0.60 + 1.00 + 0.45 + 0.15 = 3.40
    Wholly owned  = 2.00 + 0.20 + 0.40 + 0.15 + 0.05 = 2.80</code></pre>
<p><strong>(b)</strong> Franchising ranks first (3.75): it fits the limited capital, the need for speed and the lack of local knowledge, and the firm’s advantage is <em>management know-how</em> (a documented operating system and a brand), which is exactly what franchising is designed to transfer. Exporting packaged coffee is safe and cheap but does not create cafés, so it serves only as a complementary step.</p>
<p><strong>(c)</strong> Franchising stays first, but its lead over the joint venture shrinks from 0.35 (3.75 vs 3.40) to only 0.05 (3.45 vs 3.40). The recommendation is therefore <strong>sensitive</strong> to how much the firm values control: if protecting the roasting recipes were critical, a JV with a strong local partner would deserve a serious look.</p>
<p><strong>(d)</strong> The main weakness of franchising is weak control over quality. Remedies: appoint one strong <strong>master franchisee</strong> for the country instead of many small franchisees; keep the roasting recipe in-house by supplying roasted beans from Vietnam (which also adds export revenue); enforce a detailed operations manual, training and regular audits; and write contract clauses that allow termination for quality breaches.</p>
<p><strong>Why:</strong> the weighted table makes the trade-offs explicit, but the numbers are only as good as the weights and scores behind them. Always test whether a reasonable change in weights would change the decision, and then design the chosen mode to fix its known weakness.</p>`,
    `<span class="eyebrow">IBI101 · Phần 4 · Bài tập</span>
<h2>Bài tập 3 — chuỗi cà phê nên ra nước ngoài bằng cách nào?</h2>
<div class="callout"><span class="badge">Đề</span> Mây Coffee (tình huống giả định) là một chuỗi cà phê Việt Nam có 60 cửa hàng, nổi tiếng với công thức rang riêng và một hệ thống vận hành cửa hàng được chuẩn hoá thành văn bản. Doanh nghiệp muốn mở quán ở một nước ASEAN láng giềng trong vòng hai năm, vốn có hạn, và hiểu biết ít về thị trường mặt bằng cũng như thói quen tiêu dùng ở đó. Ban lãnh đạo chấm điểm bốn phương thức thâm nhập từ 1 (kém) tới 5 (rất tốt) theo năm tiêu chí (điểm minh hoạ giả định):</div>
<table>
<tr><th>Tiêu chí (trọng số)</th><th>Xuất khẩu cà phê đóng gói</th><th>Nhượng quyền</th><th>Liên doanh</th><th>Công ty con 100% vốn</th></tr>
<tr><td>Kiểm soát thương hiệu, chất lượng và bí quyết (0,30)</td><td>3</td><td>2</td><td>3</td><td>5</td></tr>
<tr><td>Yêu cầu vốn thấp (0,20)</td><td>5</td><td>5</td><td>3</td><td>1</td></tr>
<tr><td>Tiếp cận hiểu biết thị trường địa phương (0,20)</td><td>1</td><td>4</td><td>5</td><td>2</td></tr>
<tr><td>Mức độ rủi ro thấp (0,15)</td><td>5</td><td>4</td><td>3</td><td>1</td></tr>
<tr><td>Tốc độ thâm nhập (0,15)</td><td>4</td><td>5</td><td>3</td><td>1</td></tr>
</table>
<p>(a) Tính điểm có trọng số của mỗi phương thức. (b) Đề xuất phương thức. (c) Sau đó ban lãnh đạo cho rằng kiểm soát quan trọng hơn: tính lại với trọng số kiểm soát 0,40 và tốc độ 0,05 (các trọng số khác giữ nguyên). Thứ hạng có đổi không? (d) Doanh nghiệp có thể giảm điểm yếu chính của phương thức được đề xuất bằng cách nào?</p>
<h3>Lời giải</h3>
<pre><code class="language-text">(a) Trọng số 0,30 / 0,20 / 0,20 / 0,15 / 0,15  (tổng = 1,00)
    Xuất khẩu    = 0,30x3 + 0,20x5 + 0,20x1 + 0,15x5 + 0,15x4
                 = 0,90 + 1,00 + 0,20 + 0,75 + 0,60 = 3,45
    Nhượng quyền = 0,30x2 + 0,20x5 + 0,20x4 + 0,15x4 + 0,15x5
                 = 0,60 + 1,00 + 0,80 + 0,60 + 0,75 = 3,75   ← thứ nhất
    Liên doanh   = 0,30x3 + 0,20x3 + 0,20x5 + 0,15x3 + 0,15x3
                 = 0,90 + 0,60 + 1,00 + 0,45 + 0,45 = 3,40
    Công ty con 100% = 0,30x5 + 0,20x1 + 0,20x2 + 0,15x1 + 0,15x1
                 = 1,50 + 0,20 + 0,40 + 0,15 + 0,15 = 2,40

(c) Trọng số 0,40 / 0,20 / 0,20 / 0,15 / 0,05  (tổng = 1,00)
    Xuất khẩu        = 1,20 + 1,00 + 0,20 + 0,75 + 0,20 = 3,35
    Nhượng quyền     = 0,80 + 1,00 + 0,80 + 0,60 + 0,25 = 3,45   ← vẫn thứ nhất
    Liên doanh       = 1,20 + 0,60 + 1,00 + 0,45 + 0,15 = 3,40
    Công ty con 100% = 2,00 + 0,20 + 0,40 + 0,15 + 0,05 = 2,80</code></pre>
<p><strong>(b)</strong> Nhượng quyền đứng đầu (3,75): nó phù hợp với vốn hạn chế, nhu cầu vào nhanh và việc thiếu hiểu biết địa phương, còn lợi thế của doanh nghiệp là <em>bí quyết quản lý</em> (hệ thống vận hành thành văn và thương hiệu) — đúng thứ mà nhượng quyền được thiết kế để chuyển giao. Xuất khẩu cà phê đóng gói an toàn và rẻ nhưng không tạo ra quán, nên chỉ nên là bước bổ trợ.</p>
<p><strong>(c)</strong> Nhượng quyền vẫn đứng đầu, nhưng khoảng cách với liên doanh thu hẹp từ 0,35 (3,75 so với 3,40) xuống chỉ còn 0,05 (3,45 so với 3,40). Vì vậy đề xuất này <strong>nhạy cảm</strong> với mức độ doanh nghiệp coi trọng kiểm soát: nếu bảo vệ công thức rang là sống còn, một liên doanh với đối tác địa phương mạnh đáng được cân nhắc nghiêm túc.</p>
<p><strong>(d)</strong> Điểm yếu chính của nhượng quyền là khó kiểm soát chất lượng. Cách khắc phục: chỉ định một <strong>bên nhận quyền chính</strong> đủ mạnh cho cả nước thay vì nhiều bên nhận quyền nhỏ; giữ công thức rang trong nội bộ bằng cách cung cấp cà phê đã rang từ Việt Nam (đồng thời tạo thêm doanh thu xuất khẩu); áp dụng sổ tay vận hành chi tiết, đào tạo và kiểm tra định kỳ; và đưa vào hợp đồng điều khoản cho phép chấm dứt khi vi phạm chất lượng.</p>
<p><strong>Vì sao:</strong> bảng tiêu chí có trọng số làm rõ các đánh đổi, nhưng con số chỉ tốt bằng trọng số và điểm chấm đằng sau nó. Luôn kiểm tra xem một thay đổi hợp lý về trọng số có làm đổi quyết định không, rồi thiết kế phương thức đã chọn để khắc phục điểm yếu đã biết của nó.</p>`,
  ]]);

const c9q = quiz('ibi101-quiz-4', 'Quiz 4 — Strategy & entry modes|||Quiz 4 — Chiến lược & phương thức thâm nhập', [
  { id: 'q1', question: 'A firm faces strong pressure for cost reductions and weak pressure for local responsiveness. Which strategy fits best?|||Một doanh nghiệp chịu áp lực giảm chi phí mạnh và áp lực đáp ứng địa phương yếu. Chiến lược nào phù hợp nhất?', options: ['Localization|||Bản địa hoá', 'International|||Quốc tế', 'Global standardization|||Chuẩn hoá toàn cầu', 'Transnational|||Xuyên quốc gia'], correctIndex: 2, explanation: 'Global standardization concentrates activities in optimal locations and sells a standard product to reap experience effects and location economies.|||Chuẩn hoá toàn cầu tập trung hoạt động ở những địa điểm tối ưu và bán sản phẩm chuẩn để khai thác hiệu ứng kinh nghiệm và lợi thế địa điểm.' },
  { id: 'q2', question: 'A technology firm’s competitive advantage rests on proprietary process know-how. Which entry mode best protects it?|||Lợi thế cạnh tranh của một doanh nghiệp công nghệ nằm ở bí quyết quy trình độc quyền. Phương thức thâm nhập nào bảo vệ nó tốt nhất?', options: ['Licensing|||Cấp phép', 'Wholly owned subsidiary|||Công ty con 100% vốn', 'Joint venture|||Liên doanh', 'Turnkey project|||Dự án chìa khoá trao tay'], correctIndex: 1, explanation: 'Licensing, joint ventures and turnkey projects all risk transferring know-how to a potential competitor; full ownership keeps it inside the firm.|||Cấp phép, liên doanh và dự án chìa khoá trao tay đều có nguy cơ chuyển bí quyết cho một đối thủ tiềm năng; sở hữu toàn bộ giữ nó trong nội bộ doanh nghiệp.' },
  { id: 'q3', question: 'Which statement about first-mover advantages and disadvantages is correct?|||Nhận định nào về lợi thế và bất lợi của người đi đầu là đúng?', options: ['Early entrants never bear pioneering costs|||Người vào sớm không bao giờ chịu chi phí tiên phong', 'Large-scale entry is easy to reverse, so it carries little risk|||Thâm nhập quy mô lớn dễ đảo ngược nên ít rủi ro', 'Late entrants can never build a strong position|||Người vào muộn không bao giờ xây được vị thế mạnh', 'Early entrants can pre-empt rivals but may pay pioneering costs such as educating customers|||Người vào sớm có thể chiếm chỗ trước đối thủ nhưng có thể phải trả chi phí tiên phong như giáo dục khách hàng'], correctIndex: 3, explanation: 'First movers can pre-empt rivals and create switching costs, but they also bear pioneering costs; large-scale entry is a strategic commitment that is hard to reverse.|||Người đi đầu có thể chiếm chỗ trước và tạo chi phí chuyển đổi, nhưng cũng chịu chi phí tiên phong; thâm nhập quy mô lớn là cam kết chiến lược khó đảo ngược.' },
]);

const taiLieu = doc('ibi101-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách (kèm link), tài liệu chính thức miễn phí, YouTube, công cụ, lộ trình tự học.',
  [[
    `<span class="eyebrow">IBI101 · 📚 Resource hub</span>
<h2>Course materials &amp; references</h2>
<p class="lead">One hub for learning international business: the official syllabus and slides, books, free official resources, video channels, tools and a self-study roadmap.</p>
<h3>📘 Syllabus &amp; slides</h3>
<p>Sign in to <strong>FLM</strong> (<a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">flm.fpt.edu.vn</a>) with your FPTU account to read the official IBI101 syllabus and lecture slides.</p>
<h3>📗 Books</h3>
<ul>
<li><a href="https://www.mheducation.com/" target="_blank" rel="noopener">International Business: Competing in the Global Marketplace</a> — Charles W. L. Hill &amp; G. Tomas M. Hult (McGraw Hill); search the title on the publisher site.</li>
<li><a href="https://www.pearson.com/" target="_blank" rel="noopener">International Business: Environments and Operations</a> — John D. Daniels, Lee H. Radebaugh &amp; Daniel P. Sullivan (Pearson); search the title on the publisher site.</li>
</ul>
<h3>🌐 Free official resources</h3>
<ul>
<li><a href="https://www.wto.org/" target="_blank" rel="noopener">World Trade Organization</a> — trade rules, agreements and statistics.</li>
<li><a href="https://wits.worldbank.org/" target="_blank" rel="noopener">World Integrated Trade Solution (World Bank)</a> — tariff and trade-flow data by country and product.</li>
<li><a href="https://trungtamwto.vn/" target="_blank" rel="noopener">WTO and Integration Center (VCCI)</a> — Vietnamese-language information on Vietnam’s FTAs.</li>
<li><a href="https://www.hofstede-insights.com/" target="_blank" rel="noopener">Hofstede Insights</a> — a country-comparison tool for cultural dimensions.</li>
</ul>
<h3>▶️ YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@wto" target="_blank" rel="noopener">World Trade Organization</a> — official explainers on trade and the WTO.</li>
<li><a href="https://www.youtube.com/@EconomicsExplained" target="_blank" rel="noopener">Economics Explained</a> — country and trade case studies.</li>
<li><a href="https://www.youtube.com/@IMF" target="_blank" rel="noopener">International Monetary Fund</a> — exchange rates and the global economy.</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://ourworldindata.org/" target="_blank" rel="noopener">Our World in Data</a> — charts on trade openness and globalization.</li>
<li><a href="https://www.google.com/sheets/about/" target="_blank" rel="noopener">Google Sheets</a> — comparative-advantage and tariff calculations like the exercises.</li>
</ul>
<h3>🎯 Self-study roadmap</h3>
<ol>
<li><strong>Foundations (exam core)</strong> — globalization, national differences and trade theory, following Parts 1–2 here.</li>
<li><strong>Practise</strong> — redo the comparative-advantage and tariff exercises with new numbers.</li>
<li><strong>Go deeper</strong> — study one FTA Vietnam belongs to, using trungtamwto.vn and WITS data.</li>
<li><strong>Apply</strong> — recommend an entry mode for a Vietnamese brand entering one foreign market.</li>
</ol>
<div class="callout"><span class="badge">Note</span> An original hub of real links — no copyrighted slides or books are embedded. If a link moves, start from the official homepage.</div>`,
    `<span class="eyebrow">IBI101 · 📚 Trung tâm tài liệu</span>
<h2>Tài liệu tham khảo môn học</h2>
<p class="lead">Một nơi gom để học kinh doanh quốc tế: giáo trình &amp; slide chính thức, sách, tài liệu miễn phí chính thống, kênh video, công cụ, và lộ trình tự học.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Đăng nhập <strong>FLM</strong> (<a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">flm.fpt.edu.vn</a>) bằng tài khoản FPTU để đọc giáo trình và slide bài giảng chính thức của IBI101.</p>
<h3>📗 Sách</h3>
<ul>
<li><a href="https://www.mheducation.com/" target="_blank" rel="noopener">International Business: Competing in the Global Marketplace</a> — Charles W. L. Hill &amp; G. Tomas M. Hult (McGraw Hill); tra tên sách trên trang nhà xuất bản.</li>
<li><a href="https://www.pearson.com/" target="_blank" rel="noopener">International Business: Environments and Operations</a> — John D. Daniels, Lee H. Radebaugh &amp; Daniel P. Sullivan (Pearson); tra tên sách trên trang nhà xuất bản.</li>
</ul>
<h3>🌐 Tài liệu chính thức miễn phí</h3>
<ul>
<li><a href="https://www.wto.org/" target="_blank" rel="noopener">World Trade Organization</a> — quy tắc thương mại, hiệp định và số liệu thống kê.</li>
<li><a href="https://wits.worldbank.org/" target="_blank" rel="noopener">World Integrated Trade Solution (World Bank)</a> — số liệu thuế quan và dòng thương mại theo nước và mặt hàng.</li>
<li><a href="https://trungtamwto.vn/" target="_blank" rel="noopener">WTO and Integration Center (VCCI)</a> — thông tin tiếng Việt về các FTA của Việt Nam.</li>
<li><a href="https://www.hofstede-insights.com/" target="_blank" rel="noopener">Hofstede Insights</a> — công cụ so sánh các chiều văn hoá giữa các quốc gia.</li>
</ul>
<h3>▶️ YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@wto" target="_blank" rel="noopener">World Trade Organization</a> — video giải thích chính thức về thương mại và WTO.</li>
<li><a href="https://www.youtube.com/@EconomicsExplained" target="_blank" rel="noopener">Economics Explained</a> — tình huống về các quốc gia và thương mại.</li>
<li><a href="https://www.youtube.com/@IMF" target="_blank" rel="noopener">International Monetary Fund</a> — tỷ giá và kinh tế toàn cầu.</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://ourworldindata.org/" target="_blank" rel="noopener">Our World in Data</a> — biểu đồ về độ mở thương mại và toàn cầu hoá.</li>
<li><a href="https://www.google.com/sheets/about/" target="_blank" rel="noopener">Google Sheets</a> — tính lợi thế so sánh và thuế quan như các bài tập.</li>
</ul>
<h3>🎯 Lộ trình tự học</h3>
<ol>
<li><strong>Nền tảng (lõi thi)</strong> — toàn cầu hoá, khác biệt quốc gia và lý thuyết thương mại, theo đúng Phần 1–2 ở đây.</li>
<li><strong>Luyện tập</strong> — làm lại bài tập lợi thế so sánh và thuế quan với số liệu mới.</li>
<li><strong>Đào sâu</strong> — tìm hiểu một FTA Việt Nam tham gia, dùng trungtamwto.vn và số liệu WITS.</li>
<li><strong>Vận dụng</strong> — đề xuất phương thức thâm nhập cho một thương hiệu Việt vào một thị trường nước ngoài.</li>
</ol>
<div class="callout"><span class="badge">Lưu ý</span> Đây là trung tâm liên kết nguyên gốc — không nhúng slide/sách có bản quyền. Link đổi thì vào trang chủ chính thức để tìm.</div>`,
  ]]);

export default {
  semester: { code: 'KY2', name: 'Kỳ 2', ordinal: 2 },
  course: {
    courseCode: 'IBI101',
    slug: 'ibi101-introduction-to-international-business',
    title: 'Introduction to International Business',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/IBI101.webp',
    shortDescription: 'Competing in the global marketplace: globalization, national differences in politics, law and culture, trade theory and policy, WTO, regional integration, FDI, foreign exchange, international strategy and entry modes. Bilingual, with exercises and quizzes.|||Cạnh tranh toàn cầu: toàn cầu hoá, khác biệt quốc gia, lý thuyết và chính sách thương mại, WTO, hội nhập khu vực, FDI, ngoại hối, chiến lược quốc tế và phương thức thâm nhập. Song ngữ, có bài tập và quiz.',
    description: 'Môn <strong>IBI101 — Introduction to International Business (Nhập môn kinh doanh quốc tế)</strong> (khối Quản trị Kinh doanh, kỳ 2) giúp bạn hiểu doanh nghiệp <strong>cạnh tranh trên thị trường toàn cầu</strong> như thế nào. Từ <strong>toàn cầu hoá</strong> và <strong>khác biệt quốc gia</strong> về kinh tế chính trị, pháp luật, văn hoá (các chiều văn hoá Hofstede) và đạo đức → <strong>lý thuyết thương mại</strong> (trọng thương, lợi thế tuyệt đối và so sánh, Heckscher–Ohlin, vòng đời sản phẩm, thương mại mới, mô hình kim cương của Porter) và <strong>chính sách thương mại</strong>, WTO → <strong>đầu tư trực tiếp nước ngoài</strong> (nội hoá, mô hình OLI), <strong>hội nhập kinh tế khu vực</strong> (EU, ASEAN, các FTA của Việt Nam), <strong>thị trường ngoại hối và hệ thống tiền tệ quốc tế</strong> → <strong>chiến lược kinh doanh quốc tế</strong> và <strong>phương thức thâm nhập thị trường</strong>. Bám cấu trúc giáo trình kinh doanh quốc tế chuẩn (Hill &amp; Hult), song ngữ Anh–Việt, có ba bài tập tính toán và tình huống (giả định) kèm lời giải và quiz cuối mỗi phần.',
    whatYouLearn: 'Giải thích toàn cầu hoá thị trường và sản xuất, các động lực và cuộc tranh luận quanh toàn cầu hoá\nPhân tích khác biệt quốc gia về kinh tế chính trị, pháp luật, văn hoá và các vấn đề đạo đức trong kinh doanh quốc tế\nTính chi phí cơ hội, xác định lợi thế so sánh và lợi ích từ chuyên môn hoá và thương mại\nSo sánh các lý thuyết thương mại từ trọng thương tới mô hình kim cương của Porter\nPhân tích tác động của thuế quan, hạn ngạch và các công cụ chính sách thương mại; hiểu vai trò của WTO\nGiải thích FDI bằng lý thuyết nội hoá và mô hình OLI; phân biệt các cấp độ hội nhập kinh tế khu vực\nĐọc tỷ giá giao ngay, kỳ hạn, tỷ giá chéo và nhận diện ba loại rủi ro tỷ giá\nChọn chiến lược quốc tế và phương thức thâm nhập thị trường bằng bảng tiêu chí có trọng số',
    requirements: 'Không cần kiến thức kinh doanh quốc tế trước\nToán phổ thông: phần trăm, trung bình có trọng số, phương trình bậc nhất\nNên đọc song song tin kinh tế về xuất nhập khẩu, FDI và tỷ giá để liên hệ',
  },
  sections: [
    { title: '📚 Course materials|||📚 Tài liệu tham khảo', description: 'Giáo trình & slide trên FLM, sách, tài liệu chính thức, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Course introduction|||Giới thiệu môn học', description: 'Kinh doanh quốc tế là gì, vì sao khác kinh doanh trong nước, lộ trình.', lessons: [intro] },
    { title: 'Part 1 — Globalization & national differences|||Phần 1 — Toàn cầu hoá & khác biệt quốc gia', description: 'Toàn cầu hoá, thể chế toàn cầu, kinh tế chính trị, pháp luật, văn hoá, đạo đức.', lessons: [c1, c2, c2q] },
    { title: 'Part 2 — International trade: theory & policy|||Phần 2 — Thương mại quốc tế: lý thuyết & chính sách', description: 'Lợi thế so sánh, Heckscher–Ohlin, Porter, thuế quan, hạn ngạch, WTO.', lessons: [c3, c3e, c4, c4e, c4q] },
    { title: 'Part 3 — FDI, regional integration & foreign exchange|||Phần 3 — FDI, hội nhập khu vực & ngoại hối', description: 'FDI và mô hình OLI, các cấp độ hội nhập, EU, ASEAN, FTA, tỷ giá, hệ thống tiền tệ.', lessons: [c5, c6, c7, c7q] },
    { title: 'Part 4 — Strategy & entry modes|||Phần 4 — Chiến lược & phương thức thâm nhập', description: 'Bốn chiến lược quốc tế, sáu phương thức thâm nhập, chọn phương thức.', lessons: [c8, c9, c9e, c9q] },
  ],
};
