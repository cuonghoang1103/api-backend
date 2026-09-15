/**
 * CRW201 — Chinese Reading & Writing Skills 2. Nối tiếp CRW101 (HSK1-2), nâng
 * lên HSK3: đọc đoạn tự sự/thông tin dài hơn, viết đoạn văn có liên từ, thư/
 * thông báo, ôn chữ Hán. 8 chương bám khung HSK Standard Course 3 (读写).
 * Giữ NGUYÊN slug/semester/thumb. ⚠️ KHÔNG backtick/${; tránh nháy đơn trong
 * chuỗi single-quote (title/desc); chữ Hán + pinyin dấu thanh thật, UTF-8.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const intro = doc('crw201-0-1-overview', 'Course overview: Chinese Reading and Writing Skills 2|||Tổng quan: Kỹ năng Đọc - Viết tiếng Trung 2',
  'Nối tiếp CRW101 (HSK1-2), nâng lên HSK3: đọc đoạn dài hơn, viết đoạn văn có liên từ, thư và thông báo, ôn chữ Hán. Lộ trình 8 chương.',
  [[
    `<span class="eyebrow">CRW201 · Lesson 0.1 · Overview</span>
<h2>Chinese Reading &amp; Writing Skills 2</h2>
<p class="lead">This course continues from <strong>CRW101</strong> (HSK1-2 foundations) and raises your reading &amp; writing to <strong>HSK3</strong> level: longer narrative and informational passages, multi-sentence paragraphs, and connective-driven complex sentences.</p>
<h3>What is different from CRW101</h3>
<ul>
<li>CRW101: short sentences, basic characters, simple Q&amp;A texts.</li>
<li>CRW201: paragraph-length passages (80-150+ characters), letters/notices, opinion writing, sentence-combining connectives (因为/所以, 虽然/但是...).</li>
</ul>
<h3>Roadmap — 8 chapters</h3>
<ol>
<li>Reading narrative paragraphs (sequence connectors)</li>
<li>Writing about experience (了/过)</li>
<li>Describing people &amp; scenery (的, 比, 得)</li>
<li>Connectives &amp; complex sentences</li>
<li>Reading letters, messages &amp; notices</li>
<li>Writing letters, emails &amp; invitations</li>
<li>Reading informational texts (schedules, ads)</li>
<li>Short opinion writing &amp; HSK3 character review</li>
</ol>
<div class="callout"><span class="badge">Goal</span> By the end you can read an HSK3-level paragraph for its main facts AND write a coherent multi-sentence paragraph using at least one connective pair.</div>`,
    `<span class="eyebrow">CRW201 · Bài 0.1 · Tổng quan</span>
<h2>Kỹ năng Đọc - Viết tiếng Trung 2</h2>
<p class="lead">Môn này nối tiếp <strong>CRW101</strong> (nền tảng HSK1-2) và nâng kỹ năng đọc - viết lên trình độ <strong>HSK3</strong>: đoạn văn tự sự và thông tin dài hơn, đoạn văn nhiều câu, câu phức dùng liên từ.</p>
<h3>Khác gì so với CRW101</h3>
<ul>
<li>CRW101: câu ngắn, chữ Hán cơ bản, văn bản hỏi đáp đơn giản.</li>
<li>CRW201: đoạn văn dài (80-150+ chữ), thư/thông báo, viết nghị luận ngắn, ghép câu bằng liên từ (因为/所以, 虽然/但是...).</li>
</ul>
<h3>Lộ trình — 8 chương</h3>
<ol>
<li>Đọc hiểu đoạn tự sự (từ nối trình tự)</li>
<li>Viết đoạn kể lại trải nghiệm (了/过)</li>
<li>Miêu tả người &amp; cảnh (的, 比, 得)</li>
<li>Liên từ &amp; câu phức</li>
<li>Đọc thư, tin nhắn &amp; thông báo</li>
<li>Viết thư, email &amp; lời mời</li>
<li>Đọc văn bản thông tin (thời khoá biểu, quảng cáo)</li>
<li>Viết nghị luận ngắn &amp; ôn tập chữ Hán HSK3</li>
</ol>
<div class="callout"><span class="badge">Mục tiêu</span> Kết thúc môn, bạn đọc được đoạn văn HSK3 để lấy thông tin chính, VÀ viết được một đoạn văn mạch lạc nhiều câu có dùng ít nhất một cặp liên từ.</div>`,
  ]]);

const c1 = doc('crw201-1-1-doc-tu-su', '1.1 — Reading narrative paragraphs: telling what happened|||1.1 — Đọc hiểu đoạn tự sự: kể lại sự việc',
  'Đọc đoạn văn kể chuyện theo trình tự thời gian; từ nối 先/然后/后来/最后/才; luyện xác định trình tự sự kiện.',
  [[
    `<span class="eyebrow">CRW201 · Chapter 1 · Lesson 1.1</span>
<h2>Reading narrative paragraphs</h2>
<p class="lead">A narrative (记叙文 jixuwen) tells events in time order. At HSK3 you read longer paragraphs (80-150 characters) and must track <strong>who did what, and when</strong>.</p>
<h3>Sequence connectors</h3>
<ul>
<li><strong>先...然后...</strong> (xian...ranhou...) — first...then...</li>
<li><strong>后来</strong> (houlai) — after that, later (used once the story has already started)</li>
<li><strong>最后</strong> (zuihou) — finally, at the end</li>
<li><strong>才</strong> (cai) — not until then / only then (something happened later than expected)</li>
</ul>
<h3>Sample passage — an unforgettable Sunday</h3>
<pre><code>上个星期天，我和朋友一起去公园。早上八点，我们
在公园门口见面。天气很好，不冷也不热。我们先在
公园里散步，然后坐在草地上聊天。中午，我们一起
吃了野餐。下午三点，我们去划船，玩儿得很高兴。
晚上六点，我们才回家。这是一个很难忘的星期天。

Shang ge xingqitian, wo he pengyou yiqi qu gongyuan.
Zaoshang ba dian, women zai gongyuan menkou jianmian.
Tianqi hen hao, bu leng ye bu re. Women xian zai
gongyuan li sanbu, ranhou zuo zai caodi shang liaotian.
Zhongwu, women yiqi chi le yecan. Xiawu san dian,
women qu huachuan, wanr de hen gaoxing. Wanshang
liu dian, women cai hui jia. Zhe shi yi ge hen nanwang
de xingqitian.</code></pre>
<h3>Key vocabulary</h3>
<ul>
<li>难忘 (nanwang) — unforgettable</li>
<li>散步 (sanbu) — to take a walk</li>
<li>草地 (caodi) — lawn, grass</li>
<li>野餐 (yecan) — picnic</li>
<li>划船 (huachuan) — to row a boat</li>
</ul>
<div class="callout"><span class="badge">Reading strategy</span> Underline every time word (早上/中午/下午/晚上) and every connector (先/然后/后来/才) first — they give you the whole skeleton of the story before you understand every character.</div>`,
    `<span class="eyebrow">CRW201 · Chương 1 · Bài 1.1</span>
<h2>Đọc hiểu đoạn tự sự</h2>
<p class="lead">Văn tự sự (记叙文 jìxùwén) kể lại sự việc theo trình tự thời gian. Ở HSK3, bạn đọc đoạn văn dài hơn (80-150 chữ) và phải theo dõi <strong>ai làm gì, khi nào</strong>.</p>
<h3>Từ nối trình tự</h3>
<ul>
<li><strong>先...然后...</strong> (xiān...ránhòu...) — trước tiên...sau đó...</li>
<li><strong>后来</strong> (hòulái) — sau đó, về sau (dùng khi câu chuyện đã bắt đầu)</li>
<li><strong>最后</strong> (zuìhòu) — cuối cùng</li>
<li><strong>才</strong> (cái) — mãi đến lúc đó mới (nhấn mạnh việc xảy ra muộn hơn mong đợi)</li>
</ul>
<h3>Đoạn văn mẫu — một chủ nhật khó quên</h3>
<pre><code>上个星期天，我和朋友一起去公园。早上八点，我们
在公园门口见面。天气很好，不冷也不热。我们先在
公园里散步，然后坐在草地上聊天。中午，我们一起
吃了野餐。下午三点，我们去划船，玩儿得很高兴。
晚上六点，我们才回家。这是一个很难忘的星期天。

Chủ nhật tuần trước, tôi cùng bạn đi công viên. 8 giờ
sáng, chúng tôi gặp nhau ở cổng công viên. Thời tiết
rất đẹp, không lạnh cũng không nóng. Chúng tôi trước
tiên đi dạo trong công viên, sau đó ngồi trên bãi cỏ
nói chuyện. Buổi trưa, chúng tôi cùng ăn dã ngoại.
3 giờ chiều, chúng tôi đi chèo thuyền, chơi rất vui.
6 giờ tối, chúng tôi mới về nhà. Đây là một ngày chủ
nhật rất khó quên.</code></pre>
<h3>Từ vựng trọng tâm</h3>
<ul>
<li>难忘 (nánwàng) — khó quên</li>
<li>散步 (sànbù) — đi dạo</li>
<li>草地 (cǎodì) — bãi cỏ</li>
<li>野餐 (yěcān) — dã ngoại</li>
<li>划船 (huáchuán) — chèo thuyền</li>
</ul>
<div class="callout"><span class="badge">Mẹo đọc</span> Gạch chân mọi từ chỉ thời gian (早上/中午/下午/晚上) và mọi từ nối (先/然后/后来/才) trước tiên — chúng cho bạn cả bộ khung câu chuyện trước khi cần hiểu hết từng chữ.</div>`,
  ]]);

const c1q = quiz('crw201-quiz-1', 'Quiz 1 — Narrative reading|||Quiz 1 — Đọc hiểu tự sự', [
  { id: 'q1', question: 'Cặp từ nào dùng để nối trước tiên...sau đó...?', options: ['因为...所以...', '先...然后...', '虽然...但是...', '一...就...'], correctIndex: 1, explanation: '先...然后... diễn tả trình tự: việc trước rồi đến việc sau.' },
  { id: 'q2', question: 'Trong câu 晚上六点，我们才回家, chữ 才 nhấn mạnh điều gì?', options: ['Về nhà sớm hơn dự kiến', 'Mãi đến 6 giờ tối mới về nhà (muộn hơn mong đợi)', 'Không về nhà', 'Về nhà nhiều lần'], correctIndex: 1, explanation: '才 nhấn mạnh việc xảy ra muộn hơn so với mong đợi.' },
  { id: 'q3', question: '散步 nghĩa là gì?', options: ['Chèo thuyền', 'Đi dạo', 'Ăn dã ngoại', 'Nói chuyện'], correctIndex: 1, explanation: '散步 (sànbù) = đi dạo, đi bộ thong thả.' },
]);

const c2 = doc('crw201-2-1-viet-trai-nghiem', '2.1 — Writing about past experience: le and guo|||2.1 — Viết đoạn kể trải nghiệm: 了 và 过',
  'Trợ từ 了 (hoàn thành/biến đổi) và 过 (đã từng); khung viết đoạn văn kể trải nghiệm cá nhân theo trình tự thời gian.',
  [[
    `<span class="eyebrow">CRW201 · Chapter 2 · Lesson 2.1</span>
<h2>Writing about past experience: 了 &amp; 过</h2>
<p class="lead">Two small words carry most of the past-tense meaning in Chinese: <strong>了 (le)</strong> and <strong>过 (guo)</strong>.</p>
<h3>了 — completed action / new situation</h3>
<ul>
<li><strong>V + 了</strong> — the action is completed: 我吃了早饭 (I ate breakfast).</li>
<li><strong>Sentence-final 了</strong> — a new state has appeared: 我学中文两年了 (I have been learning Chinese for two years, and still am).</li>
<li>Negative of a completed action uses <strong>没(有)</strong>, NOT 了: 我没吃早饭 (I did not eat breakfast) — never 没吃了.</li>
</ul>
<h3>过 — ever done (experience)</h3>
<ul>
<li><strong>V + 过</strong> — has ever done something, no matter when: 我去过北京 (I have been to Beijing).</li>
<li>Negative: <strong>没 + V + 过</strong>: 我没去过北京 (I have never been to Beijing).</li>
<li>Question: <strong>V + 过 + 吗?</strong>: 你去过中国吗?</li>
</ul>
<h3>Writing template — recount an experience</h3>
<pre><code>1. Time + who + what happened -- use le
2. Sequence of events (xian...ranhou...houlai...zuihou...)
3. Feeling (juede...) + whether you had done it before (guo)</code></pre>
<h3>Sample paragraph</h3>
<pre><code>去年夏天，我和家人一起去云南旅游了。我们先坐飞机，
然后坐火车去了大理。那是我第一次坐火车旅行，也是
我第一次去云南。我以前没去过大理，那里的风景美极
了。我们在那儿玩儿了五天，拍了很多照片。这次旅行
让我觉得很难忘。

Qunian xiatian, wo he jiaren yiqi qu Yunnan luyou le.
Women xian zuo feiji, ranhou zuo huoche qu le Dali.
Na shi wo di-yi ci zuo huoche luxing, ye shi wo di-yi
ci qu Yunnan. Wo yiqian mei qu guo Dali, nali de
fengjing mei ji le. Women zai nar wanr le wu tian,
pai le hen duo zhaopian. Zhe ci luxing rang wo juede
hen nanwang.</code></pre>
<div class="callout"><span class="badge">Common mistake</span> Do not say 我没去了 — a negated completed action drops 了 entirely: 我没去 (I did not go). 了 and 没 never appear together on the same verb.</div>`,
    `<span class="eyebrow">CRW201 · Chương 2 · Bài 2.1</span>
<h2>Viết đoạn kể trải nghiệm: 了 và 过</h2>
<p class="lead">Hai trợ từ nhỏ mang phần lớn ý nghĩa "thì quá khứ" trong tiếng Trung: <strong>了 (le)</strong> và <strong>过 (guo)</strong>.</p>
<h3>了 — hoàn thành / trạng thái mới</h3>
<ul>
<li><strong>Động từ + 了</strong> — hành động đã hoàn thành: 我吃了早饭 (Tôi đã ăn sáng).</li>
<li><strong>了 cuối câu</strong> — xuất hiện trạng thái mới: 我学中文两年了 (Tôi đã học tiếng Trung 2 năm rồi, và vẫn đang học).</li>
<li>Phủ định của hành động hoàn thành dùng <strong>没(有)</strong>, KHÔNG dùng 了: 我没吃早饭 (Tôi chưa ăn sáng) — không bao giờ nói 没吃了.</li>
</ul>
<h3>过 — đã từng (kinh nghiệm)</h3>
<ul>
<li><strong>Động từ + 过</strong> — đã từng làm việc gì đó, bất kể khi nào: 我去过北京 (Tôi đã từng đi Bắc Kinh).</li>
<li>Phủ định: <strong>没 + Động từ + 过</strong>: 我没去过北京 (Tôi chưa từng đi Bắc Kinh).</li>
<li>Câu hỏi: <strong>Động từ + 过 + 吗?</strong>: 你去过中国吗?</li>
</ul>
<h3>Khung viết — kể lại một trải nghiệm</h3>
<pre><code>1. Khi nào + với ai + làm gì -- dùng 了
2. Diễn biến theo trình tự (先...然后...后来...最后...)
3. Cảm nhận (觉得...) + đã từng làm việc đó trước đây chưa (过)</code></pre>
<h3>Đoạn văn mẫu</h3>
<pre><code>去年夏天，我和家人一起去云南旅游了。我们先坐飞机，
然后坐火车去了大理。那是我第一次坐火车旅行，也是
我第一次去云南。我以前没去过大理，那里的风景美极
了。我们在那儿玩儿了五天，拍了很多照片。这次旅行
让我觉得很难忘。

Mùa hè năm ngoái, tôi cùng gia đình đi du lịch Vân
Nam. Chúng tôi trước tiên đi máy bay, sau đó đi tàu
hoả đến Đại Lý. Đó là lần đầu tiên tôi đi du lịch bằng
tàu hoả, cũng là lần đầu tiên tôi đến Vân Nam. Trước
đây tôi chưa từng đến Đại Lý, phong cảnh ở đó đẹp
vô cùng. Chúng tôi chơi ở đó năm ngày, chụp rất nhiều
ảnh. Chuyến đi này khiến tôi thấy rất khó quên.</code></pre>
<div class="callout"><span class="badge">Lỗi thường gặp</span> Không nói 我没去了 — hành động hoàn thành bị phủ định thì bỏ hẳn 了: 我没去 (Tôi đã không đi). 了 và 没 không bao giờ đứng cùng một động từ.</div>`,
  ]]);

const c2q = quiz('crw201-quiz-2', 'Quiz 2 — le and guo|||Quiz 2 — 了 và 过', [
  { id: 'q1', question: 'Phủ định đúng của 我去了 là gì?', options: ['我没去了', '我没去', '我不去了', '我去过没'], correctIndex: 1, explanation: '了 và 没 không đi cùng nhau; phủ định hành động hoàn thành chỉ cần 没去.' },
  { id: 'q2', question: '过 dùng để diễn tả điều gì?', options: ['Hành động đang diễn ra', 'Kinh nghiệm đã từng làm, bất kể khi nào', 'Mệnh lệnh', 'Dự định trong tương lai'], correctIndex: 1, explanation: '过 sau động từ chỉ trải nghiệm đã từng có, không quan tâm thời điểm cụ thể.' },
  { id: 'q3', question: 'Câu nào đúng ngữ pháp để hỏi Bạn đã từng đi Trung Quốc chưa?', options: ['你去中国了吗?', '你去过中国吗?', '你去了过中国吗?', '你在去中国过吗?'], correctIndex: 1, explanation: 'Cấu trúc hỏi kinh nghiệm: Động từ + 过 + 吗?' },
]);

const c3 = doc('crw201-3-1-mieu-ta', '3.1 — Reading and writing descriptions: people and scenery|||3.1 — Đọc và viết miêu tả: người và cảnh',
  'Miêu tả ngoại hình/tính cách (的 định ngữ, 比 so sánh), miêu tả cảnh vật (bổ ngữ trình độ 得); đoạn văn mẫu.',
  [[
    `<span class="eyebrow">CRW201 · Chapter 3 · Lesson 3.1</span>
<h2>Reading &amp; writing descriptions: people &amp; scenery</h2>
<h3>Describing people</h3>
<ul>
<li><strong>的 (de)</strong> strings a description onto a noun: 一个圆脸、大眼睛的女孩 (a round-faced, big-eyed girl).</li>
<li><strong>比 (bi)</strong> for comparison: A + 比 + B + adjective — 他比我高 (He is taller than me).</li>
<li>Appearance words: 高/矮 (tall/short), 瘦/胖 (thin/fat), 长头发/短头发 (long/short hair), 圆脸 (round face).</li>
<li>Personality words: 开朗 (cheerful), 安静 (quiet), 幽默 (humorous), 认真 (serious, diligent).</li>
</ul>
<h3>Describing scenery — the 得 complement</h3>
<p><strong>V/Adj + 得 + manner word</strong> describes how something is or happens: 那里的风景美得很 (the scenery there is extremely beautiful); 孩子们玩儿得很高兴 (the children played very happily).</p>
<h3>Sample passage — my hometown</h3>
<pre><code>我的家乡是一个安静的小城市。那里没有大城市那么热
闹，但是空气很好，天很蓝。城市中间有一条河，河水
很干净。晚上，河边亮起灯，非常漂亮。我的奶奶就住
在河边，她个子不高，头发已经白了，但是身体很健康，
笑起来眼睛弯弯的。我很想她。

Wo de jiaxiang shi yi ge anjing de xiao chengshi. Nali
meiyou da chengshi name renao, danshi kongqi hen hao,
tian hen lan. Chengshi zhongjian you yi tiao he, heshui
hen ganjing. Wanshang, hebian liang qi deng, feichang
piaoliang. Wo de nainai jiu zhu zai hebian, ta gezi bu
gao, toufa yijing bai le, danshi shenti hen jiankang,
xiao qilai yanjing wanwan de. Wo hen xiang ta.</code></pre>
<div class="callout"><span class="badge">Writing tip</span> Compare, do not just list: instead of "our city is quiet, the big city is noisy", write 没有大城市那么热闹 (not as bustling as a big city) — comparison makes description vivid.</div>`,
    `<span class="eyebrow">CRW201 · Chương 3 · Bài 3.1</span>
<h2>Đọc và viết miêu tả: người và cảnh</h2>
<h3>Miêu tả người</h3>
<ul>
<li><strong>的 (de)</strong> nối phần miêu tả vào danh từ: 一个圆脸、大眼睛的女孩 (một cô gái mặt tròn, mắt to).</li>
<li><strong>比 (bǐ)</strong> dùng để so sánh: A + 比 + B + tính từ — 他比我高 (Anh ấy cao hơn tôi).</li>
<li>Từ chỉ ngoại hình: 高/矮 (cao/thấp), 瘦/胖 (gầy/béo), 长头发/短头发 (tóc dài/ngắn), 圆脸 (mặt tròn).</li>
<li>Từ chỉ tính cách: 开朗 (vui vẻ, cởi mở), 安静 (trầm tính), 幽默 (hài hước), 认真 (nghiêm túc, chăm chỉ).</li>
</ul>
<h3>Miêu tả cảnh — bổ ngữ trình độ 得</h3>
<p><strong>Động từ/Tính từ + 得 + từ chỉ cách thức</strong> diễn tả sự vật/việc như thế nào: 那里的风景美得很 (phong cảnh ở đó đẹp vô cùng); 孩子们玩儿得很高兴 (bọn trẻ chơi rất vui).</p>
<h3>Đoạn văn mẫu — quê hương tôi</h3>
<pre><code>我的家乡是一个安静的小城市。那里没有大城市那么热
闹，但是空气很好，天很蓝。城市中间有一条河，河水
很干净。晚上，河边亮起灯，非常漂亮。我的奶奶就住
在河边，她个子不高，头发已经白了，但是身体很健康，
笑起来眼睛弯弯的。我很想她。

Quê tôi là một thành phố nhỏ yên tĩnh. Ở đó không
náo nhiệt như thành phố lớn, nhưng không khí rất
trong lành, trời rất xanh. Giữa thành phố có một con
sông, nước sông rất sạch. Buổi tối, đèn bên bờ sông
sáng lên, rất đẹp. Bà tôi sống ngay bên bờ sông, bà
không cao, tóc đã bạc, nhưng sức khoẻ rất tốt, cười
lên là mắt cong cong. Tôi rất nhớ bà.</code></pre>
<div class="callout"><span class="badge">Mẹo viết</span> Hãy so sánh, đừng chỉ liệt kê: thay vì viết "thành phố tôi yên tĩnh, thành phố lớn ồn ào", hãy viết 没有大城市那么热闹 (không náo nhiệt bằng thành phố lớn) — so sánh làm câu văn sinh động hơn.</div>`,
  ]]);

const c3q = quiz('crw201-quiz-3', 'Quiz 3 — Describing people and scenery|||Quiz 3 — Miêu tả người và cảnh', [
  { id: 'q1', question: 'Cấu trúc so sánh A hơn B trong tiếng Trung là gì?', options: ['A没有B', 'A比B + tính từ', 'A跟B一样', 'A是B'], correctIndex: 1, explanation: 'A + 比 + B + tính từ là cấu trúc so sánh hơn kém cơ bản.' },
  { id: 'q2', question: 'Chữ 得 trong 玩儿得很高兴 dùng để làm gì?', options: ['Nối định ngữ với danh từ', 'Làm bổ ngữ trình độ, chỉ cách thức/mức độ', 'Chỉ hành động đã hoàn thành', 'Chỉ kinh nghiệm đã từng làm'], correctIndex: 1, explanation: '得 sau động từ/tính từ giới thiệu bổ ngữ chỉ cách thức hoặc mức độ.' },
  { id: 'q3', question: '圆脸 nghĩa là gì?', options: ['Tóc dài', 'Mặt tròn', 'Mắt to', 'Dáng cao'], correctIndex: 1, explanation: '圆脸 (yuánliǎn) = mặt tròn.' },
]);

const c4 = doc('crw201-4-1-lien-tu', '4.1 — Connectives and complex sentences|||4.1 — Liên từ và câu phức',
  'Cặp liên từ nhân quả (因为/所以), nhượng bộ (虽然/但是), tăng tiến (不但/而且), liên tiếp (一/就); luyện viết câu phức.',
  [[
    `<span class="eyebrow">CRW201 · Chapter 4 · Lesson 4.1</span>
<h2>Connectives &amp; complex sentences</h2>
<h3>因为...所以... — because...so...</h3>
<p>因为下雨，所以我们没去公园 (Because it rained, we did not go to the park). Either half can be dropped if context makes it clear, but keeping both is safest for HSK3 writing.</p>
<h3>虽然...但是... — although...but...</h3>
<p>虽然天气很冷，但是他还是去跑步了 (Although the weather was cold, he still went running). 但是 can be replaced by 可是 or 不过 in casual writing.</p>
<h3>不但...而且... — not only...but also...</h3>
<p>他不但会说中文，而且会说日文 (He can not only speak Chinese, but also Japanese). Both clauses share the same subject, or the subject goes before 不但.</p>
<h3>一...就... — as soon as...then...</h3>
<p>我一到家就开始做作业 (As soon as I got home, I started doing homework). Marks two actions happening in immediate sequence.</p>
<h3>Sample paragraph — combining connectives</h3>
<pre><code>虽然我已经学了一年中文，但是读长文章的时候还是
觉得有点儿难。因为生词太多，所以我经常查词典。不
但要记住汉字，而且要记住拼音和意思。不过，我一
开始每天读一篇短文章，水平就慢慢提高了。

Suiran wo yijing xue le yi nian Zhongwen, danshi du
chang wenzhang de shihou haishi juede youdianr nan.
Yinwei shengci tai duo, suoyi wo jingchang cha cidian.
Budan yao jizhu Hanzi, erqie yao jizhu pinyin he yisi.
Buguo, wo yi kaishi meitian du yi pian duan wenzhang,
shuiping jiu manman tigao le.</code></pre>
<div class="callout"><span class="badge">HSK3 exam tip</span> Sentence-ordering questions almost always hinge on these connective pairs — 因为/虽然/不但 always come first in their clause, 所以/但是/而且 always start the second clause.</div>`,
    `<span class="eyebrow">CRW201 · Chương 4 · Bài 4.1</span>
<h2>Liên từ &amp; câu phức</h2>
<h3>因为...所以... — vì...nên...</h3>
<p>因为下雨，所以我们没去公园 (Vì trời mưa nên chúng tôi không đi công viên). Có thể bỏ một vế nếu ngữ cảnh đã rõ, nhưng giữ đủ cả hai là an toàn nhất khi viết HSK3.</p>
<h3>虽然...但是... — tuy...nhưng...</h3>
<p>虽然天气很冷，但是他还是去跑步了 (Tuy trời rất lạnh nhưng anh ấy vẫn đi chạy bộ). 但是 có thể thay bằng 可是 hoặc 不过 khi viết văn phong thoải mái.</p>
<h3>不但...而且... — không những...mà còn...</h3>
<p>他不但会说中文，而且会说日文 (Anh ấy không những nói được tiếng Trung mà còn nói được tiếng Nhật). Hai vế cùng chủ ngữ, hoặc chủ ngữ đứng trước 不但.</p>
<h3>一...就... — vừa...thì (đã)...</h3>
<p>我一到家就开始做作业 (Tôi vừa về đến nhà thì bắt đầu làm bài tập). Diễn tả hai hành động xảy ra liên tiếp ngay sau nhau.</p>
<h3>Đoạn văn mẫu — kết hợp liên từ</h3>
<pre><code>虽然我已经学了一年中文，但是读长文章的时候还是
觉得有点儿难。因为生词太多，所以我经常查词典。不
但要记住汉字，而且要记住拼音和意思。不过，我一
开始每天读一篇短文章，水平就慢慢提高了。

Tuy tôi đã học tiếng Trung được một năm, nhưng khi
đọc bài văn dài vẫn thấy hơi khó. Vì có quá nhiều từ
mới nên tôi thường xuyên tra từ điển. Không những
phải nhớ chữ Hán mà còn phải nhớ cả pinyin và nghĩa.
Nhưng từ khi tôi bắt đầu mỗi ngày đọc một bài văn
ngắn, trình độ liền dần dần được nâng lên.</code></pre>
<div class="callout"><span class="badge">Mẹo thi HSK3</span> Câu hỏi sắp xếp câu gần như luôn dựa vào các cặp liên từ này — 因为/虽然/不但 luôn đứng đầu vế đầu, 所以/但是/而且 luôn mở đầu vế sau.</div>`,
  ]]);

const c4q = quiz('crw201-quiz-4', 'Quiz 4 — Connectives|||Quiz 4 — Liên từ', [
  { id: 'q1', question: 'Cặp liên từ nào diễn tả quan hệ nhượng bộ (tuy...nhưng...)?', options: ['因为...所以...', '虽然...但是...', '一...就...', '不但...而且...'], correctIndex: 1, explanation: '虽然...但是... diễn tả điều trái ngược mong đợi: tuy A nhưng B.' },
  { id: 'q2', question: 'Câu 我一到家就开始做作业 nghĩa là gì?', options: ['Tôi vừa về đến nhà thì bắt đầu làm bài tập', 'Tôi không về nhà nên không làm bài tập', 'Tôi về nhà rồi mới nghỉ ngơi', 'Tôi làm bài tập trước khi về nhà'], correctIndex: 0, explanation: '一...就... chỉ hai việc xảy ra ngay liên tiếp nhau.' },
  { id: 'q3', question: 'Cặp liên từ 不但...而且... diễn tả quan hệ gì?', options: ['Nhân quả', 'Nhượng bộ', 'Tăng tiến (không những...mà còn...)', 'Điều kiện'], correctIndex: 2, explanation: '不但...而且... thêm một ý mạnh hơn vào sau, quan hệ tăng tiến.' },
]);

const c5 = doc('crw201-5-1-doc-thu-thong-bao', '5.1 — Reading letters, messages and notices|||5.1 — Đọc thư, tin nhắn và thông báo',
  'Cấu trúc thư/email (称呼, 正文, 祝福语, 落款), tin nhắn ngắn, thông báo (通知); kỹ năng đọc lấy thông tin chính.',
  [[
    `<span class="eyebrow">CRW201 · Chapter 5 · Lesson 5.1</span>
<h2>Reading letters, messages &amp; notices</h2>
<h3>Anatomy of a Chinese letter</h3>
<ul>
<li><strong>称呼 (chenghu)</strong> — salutation: 亲爱的 (dear) + name, e.g. 亲爱的小明：</li>
<li><strong>正文 (zhengwen)</strong> — the body</li>
<li><strong>祝福语 (zhufuyu)</strong> — closing wish: 祝你身体健康! (Wishing you good health!)</li>
<li><strong>署名 + 日期</strong> — signature + date, on separate lines at the bottom right</li>
</ul>
<h3>Sample letter</h3>
<pre><code>亲爱的小丽：
你好！好久不见，最近怎么样？我下个月要去上海开
会，听说你也在那儿工作。如果你有时间，我们可以
见面聊聊天。请告诉我你什么时候方便。
祝
工作顺利！
       你的朋友 明明
       九月十号

Qin'ai de Xiaoli:
Ni hao! Hao jiu bu jian, zuijin zenmeyang? Wo xia ge
yue yao qu Shanghai kaihui, tingshuo ni ye zai nar
gongzuo. Ruguo ni you shijian, women keyi jianmian
liao liao tian. Qing gaosu wo ni shenme shihou fangbian.
Zhu gongzuo shunli!
       Ni de pengyou Mingming
       Jiu yue shi hao</code></pre>
<h3>Sample notice — 通知 (notice)</h3>
<pre><code>通知：因为下周一是假期，公司放假一天，周二正常
上班。请大家安排好工作。

Tongzhi: Yinwei xia zhou yi shi jiaqi, gongsi fangjia
yi tian, zhou'er zhengchang shangban. Qing dajia anpai
hao gongzuo.</code></pre>
<div class="callout"><span class="badge">Reading strategy</span> For notices, first find WHO/WHAT is affected (放假/上班), then WHEN (下周一/周二) — exam questions target exactly these two facts.</div>`,
    `<span class="eyebrow">CRW201 · Chương 5 · Bài 5.1</span>
<h2>Đọc thư, tin nhắn &amp; thông báo</h2>
<h3>Cấu trúc một lá thư tiếng Trung</h3>
<ul>
<li><strong>称呼 (chēnghu)</strong> — lời chào mở đầu: 亲爱的 (thân mến) + tên, ví dụ 亲爱的小明：</li>
<li><strong>正文 (zhèngwén)</strong> — phần nội dung chính</li>
<li><strong>祝福语 (zhùfúyǔ)</strong> — lời chúc kết thư: 祝你身体健康! (Chúc bạn sức khoẻ dồi dào!)</li>
<li><strong>署名 + 日期</strong> — chữ ký + ngày tháng, xuống dòng riêng, canh phải phía cuối</li>
</ul>
<h3>Thư mẫu</h3>
<pre><code>亲爱的小丽：
你好！好久不见，最近怎么样？我下个月要去上海开
会，听说你也在那儿工作。如果你有时间，我们可以
见面聊聊天。请告诉我你什么时候方便。
祝
工作顺利！
       你的朋友 明明
       九月十号

Chào Tiểu Lệ thân mến,
Bạn khoẻ không! Lâu rồi không gặp, dạo này thế nào?
Tháng sau tôi sẽ đến Thượng Hải họp, nghe nói bạn
cũng đang làm việc ở đó. Nếu bạn có thời gian, chúng
ta có thể gặp mặt nói chuyện. Hãy cho tôi biết khi nào
bạn thuận tiện nhé.
Chúc công việc thuận lợi!
       Bạn của bạn, Minh Minh
       Ngày 10 tháng 9</code></pre>
<h3>Thông báo mẫu — 通知</h3>
<pre><code>通知：因为下周一是假期，公司放假一天，周二正常
上班。请大家安排好工作。

Thông báo: Vì thứ Hai tuần sau là ngày lễ, công ty
nghỉ một ngày, thứ Ba làm việc bình thường. Đề nghị
mọi người sắp xếp công việc hợp lý.</code></pre>
<div class="callout"><span class="badge">Mẹo đọc</span> Với thông báo, hãy tìm AI/VIỆC GÌ bị ảnh hưởng (放假/上班) trước, sau đó tìm KHI NÀO (下周一/周二) — câu hỏi thi thường nhắm đúng hai thông tin này.</div>`,
  ]]);

const c5q = quiz('crw201-quiz-5', 'Quiz 5 — Letters and notices|||Quiz 5 — Thư và thông báo', [
  { id: 'q1', question: 'Phần nào của lá thư thường nằm ở dòng cuối, canh phải?', options: ['称呼', '正文', '署名 + 日期', '祝福语'], correctIndex: 2, explanation: 'Chữ ký và ngày tháng đặt ở cuối thư, thường canh sang phải.' },
  { id: 'q2', question: '通知 nghĩa là gì?', options: ['Thư mời', 'Thông báo', 'Tin nhắn riêng tư', 'Đơn xin nghỉ'], correctIndex: 1, explanation: '通知 (tōngzhī) = thông báo, thường mang tính chung cho nhiều người.' },
  { id: 'q3', question: 'Trong thư mẫu, người viết muốn làm gì khi đến Thượng Hải?', options: ['Xin nghỉ việc', 'Gặp mặt nói chuyện với bạn', 'Đi du lịch một mình', 'Gửi quà cho bạn'], correctIndex: 1, explanation: 'Người viết đề nghị gặp mặt và nói chuyện nếu bạn có thời gian.' },
]);

const c6 = doc('crw201-6-1-viet-thu-loi-moi', '6.1 — Writing letters, emails and simple invitations|||6.1 — Viết thư, email và lời mời đơn giản',
  'Khung viết thư/email hoàn chỉnh (称呼→正文→祝福语→署名); mẫu viết thiệp mời (邀请函) sinh nhật, họp mặt.',
  [[
    `<span class="eyebrow">CRW201 · Chapter 6 · Lesson 6.1</span>
<h2>Writing letters, emails &amp; simple invitations</h2>
<h3>Letter/email writing template</h3>
<pre><code>1. Salutation: qin'ai de + name + colon (or ni hao after the name)
2. Body paragraph 1: reason for writing (greeting / purpose)
3. Body paragraph 2: main content (time / place / what to do)
4. Closing wish: zhu ni... / zhu shenti jiankang / zhu xuexi jinbu
5. Signature + date (new line, right-aligned)</code></pre>
<h3>Sample invitation — 邀请函</h3>
<pre><code>亲爱的朋友们：
下星期六（六月十号）是我的生日，我想请大家来我
家吃饭、聊天。时间是晚上六点，地点是我家（阳光
小区5号楼）。希望大家能来，如果不能来，请提前告
诉我。
祝
大家周末愉快！
       小王
       六月三号

Qin'ai de pengyoumen:
Xia xingqiliu (liu yue shi hao) shi wo de shengri, wo
xiang qing dajia lai wo jia chi fan, liaotian. Shijian
shi wanshang liu dian, didian shi wo jia (Yangguang
Xiaoqu wu hao lou). Xiwang dajia neng lai, ruguo bu
neng lai, qing tiqian gaosu wo.
Zhu dajia zhoumo yukuai!
       Xiao Wang
       Liu yue san hao</code></pre>
<h3>Checklist for a good invitation</h3>
<ul>
<li>What event? (什么事)</li>
<li>When? (什么时候)</li>
<li>Where? (在哪儿)</li>
<li>What should the reader do? (要不要回复/带什么)</li>
</ul>
<div class="callout"><span class="badge">Writing tip</span> HSK3 writing tasks are graded on the completeness of these four pieces of information more than on grammar perfection — always double-check all four are present before you finish.</div>`,
    `<span class="eyebrow">CRW201 · Chương 6 · Bài 6.1</span>
<h2>Viết thư, email &amp; lời mời đơn giản</h2>
<h3>Khung viết thư/email</h3>
<pre><code>1. 称呼: qin'ai de + tên + dấu hai chấm (hoặc ni hao sau tên)
2. 正文 đoạn 1: lý do viết thư (chào hỏi/nêu mục đích)
3. 正文 đoạn 2: nội dung chính (thời gian/địa điểm/việc cần làm)
4. 祝福语: zhu ni.../zhu shenti jiankang/zhu xuexi jinbu
5. 署名 + 日期 (xuống dòng, canh phải)</code></pre>
<h3>Thiệp mời mẫu — 邀请函</h3>
<pre><code>亲爱的朋友们：
下星期六（六月十号）是我的生日，我想请大家来我
家吃饭、聊天。时间是晚上六点，地点是我家（阳光
小区5号楼）。希望大家能来，如果不能来，请提前告
诉我。
祝
大家周末愉快！
       小王
       六月三号

Các bạn thân mến,
Thứ Bảy tuần sau (ngày 10 tháng 6) là sinh nhật của
mình, mình muốn mời mọi người đến nhà mình ăn cơm,
nói chuyện. Thời gian là 6 giờ tối, địa điểm là nhà
mình (Toà 5, khu Dương Quang). Mong mọi người đến
được, nếu không đến được thì báo trước cho mình nhé.
Chúc mọi người cuối tuần vui vẻ!
       Tiểu Vương
       Ngày 3 tháng 6</code></pre>
<h3>Danh sách cần có trong một lời mời tốt</h3>
<ul>
<li>Sự kiện gì? (什么事)</li>
<li>Khi nào? (什么时候)</li>
<li>Ở đâu? (在哪儿)</li>
<li>Người nhận cần làm gì? (要不要回复/带什么)</li>
</ul>
<div class="callout"><span class="badge">Mẹo viết</span> Bài viết HSK3 được chấm dựa vào việc có đủ bốn thông tin trên nhiều hơn là ngữ pháp hoàn hảo — luôn kiểm tra lại cả bốn trước khi hoàn thành.</div>`,
  ]]);

const c6q = quiz('crw201-quiz-6', 'Quiz 6 — Writing letters and invitations|||Quiz 6 — Viết thư và lời mời', [
  { id: 'q1', question: 'Thứ tự đúng khi viết một lá thư là gì?', options: ['正文→称呼→署名→祝福语', '称呼→正文→祝福语→署名', '祝福语→称呼→正文→署名', '署名→称呼→正文→祝福语'], correctIndex: 1, explanation: 'Thư đi theo thứ tự: lời chào → nội dung → lời chúc → chữ ký.' },
  { id: 'q2', question: 'Một lời mời (邀请函) tốt cần có đủ thông tin nào?', options: ['Chỉ cần thời gian', 'Chỉ cần địa điểm', 'Sự kiện, thời gian, địa điểm, việc cần làm', 'Chỉ cần tên người mời'], correctIndex: 2, explanation: 'Bài viết được chấm dựa vào đủ bốn thông tin: sự kiện/thời gian/địa điểm/việc cần làm.' },
  { id: 'q3', question: 'Câu 地点是我家 nghĩa là gì?', options: ['Thời gian là ở nhà tôi', 'Địa điểm là nhà tôi', 'Sự kiện là ở nhà tôi', 'Lý do là nhà tôi'], correctIndex: 1, explanation: '地点 (dìdiǎn) = địa điểm.' },
]);

const c7 = doc('crw201-7-1-doc-van-ban-thong-tin', '7.1 — Reading informational texts: schedules and ads|||7.1 — Đọc hiểu văn bản thông tin: thời khoá biểu, quảng cáo',
  'Đọc bảng thời khoá biểu, quảng cáo, biển hiệu; kỹ năng quét thông tin (giờ, giá, địa điểm) không cần đọc từng chữ.',
  [[
    `<span class="eyebrow">CRW201 · Chapter 7 · Lesson 7.1</span>
<h2>Reading informational texts: schedules &amp; ads</h2>
<h3>Sample schedule — 课程表 (class schedule)</h3>
<pre><code>时间          星期一      星期三      星期五
8:00-9:40    汉语精读     汉语听力     汉语口语
10:00-11:40  中国文化     汉语写作     汉语精读
14:00-15:40  ——         汉语阅读     ——</code></pre>
<h3>Sample advertisement — 广告</h3>
<pre><code>【中文书店大减价】
本周六、周日，全场图书八折！
地址：文化路25号
营业时间：早上9点到晚上9点
电话：010-6666-8888

[Chinese Bookstore Big Sale]
This Saturday and Sunday, all books 20% off!
Address: No. 25 Wenhua Road
Business hours: 9 AM to 9 PM
Phone: 010-6666-8888</code></pre>
<h3>Scan, do not read word by word</h3>
<ul>
<li>Numbers (时间/价格/电话/地址) usually answer the question directly — find them first.</li>
<li>Bracketed titles 【...】 tell you the topic before you read the body.</li>
<li>For a schedule, match the ROW (time) with the COLUMN (day) — most questions ask what class is at time X on day Y.</li>
</ul>
<div class="callout"><span class="badge">Exam tip</span> Informational-text questions rarely require full comprehension — they test whether you can LOCATE one fact fast. Read the question first, then hunt for that fact in the text.</div>`,
    `<span class="eyebrow">CRW201 · Chương 7 · Bài 7.1</span>
<h2>Đọc hiểu văn bản thông tin: thời khoá biểu, quảng cáo</h2>
<h3>Thời khoá biểu mẫu — 课程表</h3>
<pre><code>时间          星期一      星期三      星期五
8:00-9:40    汉语精读     汉语听力     汉语口语
10:00-11:40  中国文化     汉语写作     汉语精读
14:00-15:40  ——         汉语阅读     ——</code></pre>
<h3>Quảng cáo mẫu — 广告</h3>
<pre><code>【中文书店大减价】
本周六、周日，全场图书八折！
地址：文化路25号
营业时间：早上9点到晚上9点
电话：010-6666-8888

[Hiệu sách tiếng Trung đại giảm giá]
Thứ Bảy, Chủ nhật tuần này, toàn bộ sách giảm 20%!
Địa chỉ: Số 25 đường Văn Hoá
Giờ mở cửa: 9 giờ sáng đến 9 giờ tối
Điện thoại: 010-6666-8888</code></pre>
<h3>Quét thông tin, đừng đọc từng chữ</h3>
<ul>
<li>Số liệu (时间/价格/电话/地址) thường trả lời trực tiếp câu hỏi — tìm chúng trước tiên.</li>
<li>Tiêu đề trong ngoặc 【...】 cho biết chủ đề trước khi đọc phần thân.</li>
<li>Với thời khoá biểu, khớp HÀNG (giờ) với CỘT (thứ) — hầu hết câu hỏi hỏi giờ X thứ Y học môn gì.</li>
</ul>
<div class="callout"><span class="badge">Mẹo thi</span> Câu hỏi về văn bản thông tin ít khi cần hiểu toàn bộ — chúng kiểm tra bạn có TÌM ĐƯỢC một dữ kiện thật nhanh không. Đọc câu hỏi trước, rồi mới tìm dữ kiện đó trong văn bản.</div>`,
  ]]);

const c7q = quiz('crw201-quiz-7', 'Quiz 7 — Informational texts|||Quiz 7 — Văn bản thông tin', [
  { id: 'q1', question: 'Theo thời khoá biểu mẫu, thứ Tư (星期三) tiết 10:00-11:40 học môn gì?', options: ['汉语口语', '汉语写作', '中国文化', '汉语阅读'], correctIndex: 1, explanation: 'Khớp hàng 10:00-11:40 với cột 星期三 ra 汉语写作.' },
  { id: 'q2', question: 'Trong quảng cáo, cửa hàng giảm giá bao nhiêu?', options: ['Giảm 10%', 'Giảm 20% (八折)', 'Miễn phí', 'Tăng giá'], correctIndex: 1, explanation: '八折 nghĩa là chỉ trả 80% giá gốc, tức giảm 20%.' },
  { id: 'q3', question: 'Chiến lược đọc hiệu quả với thời khoá biểu, quảng cáo là gì?', options: ['Đọc từng chữ theo thứ tự', 'Đọc câu hỏi trước rồi quét tìm số liệu/từ khoá', 'Chỉ đọc tiêu đề', 'Bỏ qua toàn bộ số liệu'], correctIndex: 1, explanation: 'Đọc câu hỏi trước giúp biết cần tìm dữ kiện gì rồi mới quét văn bản.' },
]);

const c8 = doc('crw201-8-1-nghi-luan-on-tap', '8.1 — Writing a short opinion paragraph and HSK3 character review|||8.1 — Viết đoạn văn nghị luận ngắn và ôn tập chữ Hán HSK3',
  'Khung viết đoạn nghị luận ngắn (我认为.../因为...), bảng ôn tập nhóm chữ Hán HSK3 hay nhầm lẫn, tổng kết kỹ năng cả môn.',
  [[
    `<span class="eyebrow">CRW201 · Chapter 8 · Lesson 8.1</span>
<h2>Writing a short opinion paragraph &amp; character review</h2>
<h3>Opinion paragraph template</h3>
<pre><code>1. Opinion: wo renwei... / wo juede...
2. Reason: yinwei... (1-2 concrete reasons)
3. Example (optional): biru...
4. Conclusion: suoyi wo renwei...</code></pre>
<h3>Sample paragraph — is online learning good?</h3>
<pre><code>我认为网上学习有好处，也有坏处。好处是学习时间
很自由，不用去教室，可以在家上课。而且网上有很
多免费的学习资料。但是坏处是有时候网络不好，上
课会有问题，而且一个人在家学习，没有人一起讨论，
容易觉得孤单。所以我觉得网上学习和教室学习应该
结合起来，效果才最好。

Wo renwei wangshang xuexi you haochu, ye you huaichu.
Haochu shi xuexi shijian hen ziyou, buyong qu jiaoshi,
keyi zai jia shangke. Erqie wangshang you hen duo
mianfei de xuexi ziliao. Danshi huaichu shi youshihou
wangluo bu hao, shangke hui you wenti, erqie yi ge ren
zai jia xuexi, meiyou ren yiqi taolun, rongyi juede
gudan. Suoyi wo juede wangshang xuexi he jiaoshi
xuexi yinggai jiehe qilai, xiaoguo cai zui hao.</code></pre>
<h3>HSK3 confusable-character review</h3>
<pre><code>己 (ji, self)     vs  已 (yi, already)   vs  巳 (si, snake-zodiac, rare)
未 (wei, not yet) vs  末 (mo, end)
天 (tian, sky/day) vs 夭 (yao, die young, rare)
大 (da, big)  vs  太 (tai, too)  vs  犬 (quan, dog)
问 (wen, ask) vs  间 (jian, between) vs  闷 (men, bored/stuffy)</code></pre>
<div class="callout"><span class="badge">Course wrap-up</span> Across CRW201 you moved from short narrated paragraphs to letters, notices and short opinion writing — sequencing events, describing, connecting clauses, structuring a text are exactly what HSK3 reading and writing sections test.</div>`,
    `<span class="eyebrow">CRW201 · Chương 8 · Bài 8.1</span>
<h2>Viết đoạn văn nghị luận ngắn &amp; ôn tập chữ Hán</h2>
<h3>Khung viết đoạn nghị luận ngắn</h3>
<pre><code>1. 观点 (quan điểm): wo renwei... / wo juede...
2. 理由 (lý do): yinwei... (1-2 lý do cụ thể)
3. 例子 (ví dụ, không bắt buộc): biru...
4. 结论 (kết luận): suoyi wo renwei...</code></pre>
<h3>Đoạn văn mẫu — học online có tốt không?</h3>
<pre><code>我认为网上学习有好处，也有坏处。好处是学习时间
很自由，不用去教室，可以在家上课。而且网上有很
多免费的学习资料。但是坏处是有时候网络不好，上
课会有问题，而且一个人在家学习，没有人一起讨论，
容易觉得孤单。所以我觉得网上学习和教室学习应该
结合起来，效果才最好。

Tôi cho rằng học online có mặt tốt và cũng có mặt xấu.
Mặt tốt là thời gian học rất tự do, không cần đến lớp,
có thể học ở nhà. Hơn nữa trên mạng có rất nhiều tài
liệu học miễn phí. Nhưng mặt xấu là đôi khi mạng
không tốt, việc học sẽ gặp vấn đề, hơn nữa một mình
học ở nhà, không có ai cùng thảo luận, dễ cảm thấy
cô đơn. Vì vậy tôi nghĩ học online và học trên lớp nên
kết hợp với nhau thì hiệu quả mới tốt nhất.</code></pre>
<h3>Ôn tập nhóm chữ Hán HSK3 dễ nhầm</h3>
<pre><code>己 (ji, bản thân)  vs  已 (yi, đã)         vs  巳 (si, con rắn, hiếm gặp)
未 (wei, chưa)     vs  末 (mo, cuối cùng)
天 (tian, trời/ngày) vs 夭 (yao, chết yểu, hiếm gặp)
大 (da, to)  vs  太 (tai, quá)  vs  犬 (quan, con chó)
问 (wen, hỏi) vs  间 (jian, giữa/khoảng) vs  闷 (men, buồn chán/bí bách)</code></pre>
<div class="callout"><span class="badge">Tổng kết môn</span> Qua CRW201, bạn đã đi từ đoạn văn tự sự ngắn đến thư, thông báo và viết nghị luận ngắn — sắp xếp trình tự sự việc, miêu tả, ghép câu bằng liên từ, và dựng bố cục văn bản chính là những gì phần đọc-viết HSK3 kiểm tra.</div>`,
  ]]);

const c8q = quiz('crw201-quiz-8', 'Quiz 8 — Opinion writing and character review|||Quiz 8 — Nghị luận và ôn tập chữ Hán', [
  { id: 'q1', question: 'Khung đoạn văn nghị luận ngắn theo thứ tự đúng là gì?', options: ['理由→观点→结论', '观点→理由→结论', '结论→理由→观点', '例子→观点→理由'], correctIndex: 1, explanation: 'Đoạn nghị luận ngắn đi theo: nêu quan điểm → nêu lý do → kết luận.' },
  { id: 'q2', question: 'Chữ nào dễ nhầm với 已 vì hình dạng gần giống nhau?', options: ['己', '天', '大', '问'], correctIndex: 0, explanation: '己/已/巳 chỉ khác nhau ở nét móc nhỏ, rất dễ nhầm khi viết tay.' },
  { id: 'q3', question: 'Trong đoạn văn mẫu, tác giả kết luận thế nào về học online?', options: ['Chỉ nên học online', 'Chỉ nên học ở lớp', 'Nên kết hợp cả học online và học ở lớp', 'Không nên học online'], correctIndex: 2, explanation: 'Kết luận của đoạn văn là 网上学习和教室学习应该结合起来 — nên kết hợp cả hai.' },
]);

const taiLieu = doc('crw201-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình HSK Standard Course 3, Graded Chinese Reader, công cụ tra cứu, đọc mở rộng, lộ trình tự học.',
  [[
    `<span class="eyebrow">CRW201 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to practice HSK3-level reading &amp; writing — narrative paragraphs, letters, notices, informational texts and short opinion writing — in one place.</p>
<h3>📘 Textbook &amp; graded readers</h3>
<ul>
<li><em>HSK Standard Course 3 (读写, reading &amp; writing)</em> — Jiang Liping, Beijing Language and Culture University Press. The primary reference for this course.</li>
<li><em>Graded Chinese Reader (500/1000 words)</em> — Chen Xiang — short graded stories that reuse HSK-level vocabulary.</li>
</ul>
<h3>🌐 Official / free resources</h3>
<ul>
<li><a href="https://www.chinesetest.cn" target="_blank" rel="noopener">Chinesetest.cn</a> — official HSK site (exam format, sample papers).</li>
<li><a href="https://www.mdbg.net" target="_blank" rel="noopener">MDBG Chinese-English Dictionary</a> — free online dictionary with stroke order and example sentences.</li>
<li><a href="https://www.thechairmansbao.com" target="_blank" rel="noopener">The Chairman's Bao</a> — graded Chinese news articles by HSK level, great for extended reading practice.</li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@MandarinCorner" target="_blank" rel="noopener">Mandarin Corner</a> — real-life conversations with subtitles at multiple levels.</li>
<li><a href="https://www.youtube.com/@yoyochinese" target="_blank" rel="noopener">Yoyo Chinese</a> — grammar explanations, including 了/过 and complex sentence patterns.</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://www.pleco.com" target="_blank" rel="noopener">Pleco</a> — mobile dictionary app with OCR and flashcards, essential for reading practice.</li>
<li><a href="https://www.skritter.com" target="_blank" rel="noopener">Skritter</a> — character writing practice with stroke-order feedback.</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation review</strong> — make sure 了/过, 的/得/地, and basic connectives from CRW101 are solid.</li>
<li><strong>Read daily</strong> — one short graded passage a day (The Chairman's Bao, HSK Standard Course 3 texts).</li>
<li><strong>Write daily</strong> — one 3-5 sentence paragraph a day using a connective pair from Chapter 4.</li>
<li><strong>Review characters</strong> — track confusable characters (Chapter 8) in a personal notebook.</li>
</ol></div>`,
    `<span class="eyebrow">CRW201 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để luyện đọc - viết trình độ HSK3 — đoạn tự sự, thư, thông báo, văn bản thông tin và viết nghị luận ngắn — gom về một chỗ.</p>
<h3>📘 Giáo trình &amp; sách đọc mở rộng</h3>
<ul>
<li><em>HSK Standard Course 3 (读写, đọc-viết)</em> — Jiang Liping, Nhà xuất bản Đại học Ngôn ngữ Bắc Kinh. Tài liệu tham khảo chính của môn.</li>
<li><em>Graded Chinese Reader (500/1000 từ)</em> — Chen Xiang — truyện ngắn phân cấp, dùng lại từ vựng theo trình độ HSK.</li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://www.chinesetest.cn" target="_blank" rel="noopener">Chinesetest.cn</a> — trang chính thức của kỳ thi HSK (cấu trúc đề, đề mẫu).</li>
<li><a href="https://www.mdbg.net" target="_blank" rel="noopener">Từ điển Trung-Anh MDBG</a> — từ điển trực tuyến miễn phí, có thứ tự nét và câu ví dụ.</li>
<li><a href="https://www.thechairmansbao.com" target="_blank" rel="noopener">The Chairman's Bao</a> — tin tức tiếng Trung phân theo cấp độ HSK, rất tốt để luyện đọc mở rộng.</li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@MandarinCorner" target="_blank" rel="noopener">Mandarin Corner</a> — hội thoại đời thực có phụ đề nhiều cấp độ.</li>
<li><a href="https://www.youtube.com/@yoyochinese" target="_blank" rel="noopener">Yoyo Chinese</a> — giải thích ngữ pháp, gồm cả 了/过 và câu phức.</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://www.pleco.com" target="_blank" rel="noopener">Pleco</a> — ứng dụng từ điển di động có OCR và flashcard, rất cần cho luyện đọc.</li>
<li><a href="https://www.skritter.com" target="_blank" rel="noopener">Skritter</a> — luyện viết chữ Hán, có phản hồi thứ tự nét.</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Ôn nền tảng</strong> — chắc lại 了/过, 的/得/地 và liên từ cơ bản đã học ở CRW101.</li>
<li><strong>Đọc mỗi ngày</strong> — một đoạn văn phân cấp ngắn mỗi ngày (The Chairman's Bao, bài trong HSK Standard Course 3).</li>
<li><strong>Viết mỗi ngày</strong> — một đoạn 3-5 câu mỗi ngày dùng một cặp liên từ ở Chương 4.</li>
<li><strong>Ôn chữ Hán</strong> — ghi lại các nhóm chữ dễ nhầm (Chương 8) vào sổ tay cá nhân.</li>
</ol></div>`,
  ]]);

export default {
  semester: { code: 'KY2', name: 'Kỳ 2', ordinal: 2 },
  course: {
    courseCode: 'CRW201',
    slug: 'crw201-chinese-reading-writing-skills-2',
    title: 'Chinese Reading & Writing Skills 2',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/CRW201.webp',
    shortDescription: 'Continues CRW101 to HSK3: read longer narrative & informational texts (letters, notices, schedules, ads) and write paragraphs using le/guo, comparisons, and connectives. 8 chapters, bilingual, with passages, writing templates & quizzes.|||Nối tiếp CRW101 lên HSK3: đọc văn bản tự sự & thông tin dài hơn (thư, thông báo, thời khoá biểu, quảng cáo), viết đoạn văn dùng 了/过, so sánh, liên từ. 8 chương, song ngữ, có bài đọc, khung viết & quiz.',
    description: 'Môn <strong>CRW201 — Chinese Reading &amp; Writing Skills 2</strong> (kỳ 2, ngành Ngôn ngữ Trung) nối tiếp <strong>CRW101</strong> và nâng kỹ năng đọc - viết lên trình độ <strong>HSK3</strong>. Từ <strong>đọc đoạn tự sự</strong> (từ nối trình tự) → <strong>viết trải nghiệm</strong> (了/过) → <strong>miêu tả người &amp; cảnh</strong> (的/比/得) → <strong>liên từ &amp; câu phức</strong> (因为/所以, 虽然/但是) → <strong>đọc thư/thông báo</strong> → <strong>viết thư/lời mời</strong> → <strong>đọc văn bản thông tin</strong> (thời khoá biểu, quảng cáo) → <strong>viết nghị luận ngắn &amp; ôn chữ Hán</strong>. Bám khung <em>HSK Standard Course 3</em> và <em>Graded Chinese Reader</em>, song ngữ Việt/Anh, chữ Hán kèm pinyin, quiz mỗi chương.',
    whatYouLearn: 'Đọc đoạn tự sự dùng từ nối trình tự (先/然后/后来/最后/才); dùng 了 (hoàn thành) và 过 (kinh nghiệm) để kể trải nghiệm; miêu tả người & cảnh bằng 的/比/得; ghép câu phức bằng 因为/所以, 虽然/但是, 不但/而且, 一/就; đọc thư, tin nhắn, thông báo (通知) lấy thông tin chính; viết thư/email/lời mời đủ 4 thành phần (sự kiện/thời gian/địa điểm/việc cần làm); đọc nhanh thời khoá biểu và quảng cáo; viết đoạn văn nghị luận ngắn (观点→理由→结论); nhận diện nhóm chữ Hán HSK3 dễ nhầm.',
    requirements: 'Đã hoàn thành CRW101 (hoặc tương đương trình độ HSK1-2): đọc/viết được câu đơn, biết khoảng 150-300 chữ Hán cơ bản. Nên có từ điển tra cứu (Pleco hoặc MDBG) khi đọc bài mới.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình HSK Standard Course 3, Graded Chinese Reader, từ điển, kênh học, lộ trình tự học.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Nối tiếp CRW101, nâng lên HSK3, lộ trình 8 chương.', lessons: [intro] },
    { title: 'Chương 1 — Đọc hiểu đoạn tự sự|||Chapter 1 — Reading narrative paragraphs', description: 'Từ nối trình tự 先/然后/后来/最后/才.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Viết trải nghiệm: 了/过|||Chapter 2 — Writing experience: le/guo', description: 'Hoàn thành (了) và kinh nghiệm (过).', lessons: [c2, c2q] },
    { title: 'Chương 3 — Miêu tả người & cảnh|||Chapter 3 — Describing people & scenery', description: 'Định ngữ 的, so sánh 比, bổ ngữ 得.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Liên từ & câu phức|||Chapter 4 — Connectives & complex sentences', description: '因为/所以, 虽然/但是, 不但/而且, 一/就.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Đọc thư & thông báo|||Chapter 5 — Reading letters & notices', description: 'Cấu trúc thư, tin nhắn, 通知.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Viết thư & lời mời|||Chapter 6 — Writing letters & invitations', description: 'Khung thư/email, thiệp mời 邀请函.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Đọc văn bản thông tin|||Chapter 7 — Reading informational texts', description: 'Thời khoá biểu, quảng cáo, kỹ năng quét thông tin.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Nghị luận ngắn & ôn chữ Hán|||Chapter 8 — Opinion writing & character review', description: 'Khung 观点→理由→结论, chữ Hán HSK3 dễ nhầm.', lessons: [c8, c8q] },
  ],
};
