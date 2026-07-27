/**
 * JPD113 (Elementary Japanese 1, A1.1) grammar points for My Language.
 * level = 'JPD113', sits alongside N5..N1 in /language/ja/grammar.
 * Order follows Academy JPD113 chapter order (3 → 4 → 5 → 6); order 0-31.
 * Content is Vietnamese-only (matches existing N5..N1 grammar rows in DB).
 */
export const GRAMMAR = [
  // ══════════════ CHƯƠNG 3 — Chào hỏi, số, tiền, ngày giờ (order 0-9) ══════════════
  {
    order: 0,
    title: '[C3] Chào hỏi & câu trong lớp học',
    structure: 'Cụm cố định, không chia: おはようございます・こんにちは・すみません・わかりません…',
    explanation: `<p>Đây không phải "ngữ pháp" theo nghĩa có công thức chia — mà là những <strong>câu cố định (あいさつ)</strong> đổi theo thời điểm trong ngày, phải thuộc nguyên cụm và dùng ngay từ ngày đầu. Tiếng Nhật không có một câu chào chung cho cả ngày như "hello" — mỗi khung giờ có câu riêng.</p>
<ul>
<li><b>おはようございます</b> (ohayō gozaimasu) — chào buổi sáng, lịch sự. Bạn bè thân có thể rút gọn おはよう.</li>
<li><b>こんにちは</b> (konnichiwa) — chào giữa trưa/chiều. Chú ý は ở đây đọc "wa" (giống trợ từ chủ đề).</li>
<li><b>こんばんは</b> (konbanwa) — chào buổi tối.</li>
<li><b>さようなら</b> (sayōnara) — tạm biệt, mang tính trang trọng/dài hạn hơn "bye" thường.</li>
<li><b>すみません</b> (sumimasen) — xin lỗi / làm ơn (gọi ai đó, xin phép chen ngang) — từ đa năng nhất trong nhóm này.</li>
<li><b>わかりました／わかりません</b> — em hiểu rồi / em không hiểu — hai câu sống còn trong lớp học, dùng để phản hồi giáo viên.</li>
</ul>
<p>Nhóm câu lớp học khác (もう一度おねがいします、ちょっとまってください、しつもんがあります) đều lịch sự, dùng お-/ご- hoặc ます-form, phù hợp giao tiếp thầy-trò.</p>`,
    examples: [
      { sentence: 'おはようございます、せんせい。', pronunciation: 'Ohayō gozaimasu, sensei.', meaningVi: 'Chào buổi sáng, thầy/cô.' },
      { sentence: 'すみません、もう一度おねがいします。', pronunciation: 'Sumimasen, mō ichido onegaishimasu.', meaningVi: 'Xin lỗi, xin nhắc lại một lần nữa.' },
      { sentence: 'わかりましたか。― はい、わかりました。', pronunciation: 'Wakarimashita ka. — Hai, wakarimashita.', meaningVi: 'Bạn hiểu chưa? — Vâng, em hiểu rồi.' },
      { sentence: 'しつもんが あります。', pronunciation: 'Shitsumon ga arimasu.', meaningVi: 'Em có một câu hỏi.' },
    ],
    commonMistakes: 'Dùng こんにちは vào buổi sáng sớm (phải おはようございます tới ~10-11h). Đọc は trong こんにちは/こんばんは thành "ha" thay vì "wa" — は chỉ đọc "wa" khi làm trợ từ, còn trong these cụm chào cố định nó cũng theo quy ước đọc "wa" vì về mặt lịch sử đây từng là trợ từ chủ đề của một câu dài hơn.',
    comparedWith: 'こんにちは dùng ban ngày (~11h-18h) — mang tính trung lập, không phân biệt thân sơ. さようなら nghe khá trang trọng/dứt khoát; với bạn bè/đồng nghiệp người Nhật thường dùng じゃあね, またね thay vì さようなら trong ngữ cảnh thân mật (ngoài phạm vi JPD113 nhưng nên biết).',
  },
  {
    order: 1,
    title: '[C3] Nhóm số mỗi 4 chữ số — 万 (vạn)',
    structure: '1 = いち … 10 = じゅう · 100 = ひゃく · 1.000 = せん · 10.000 = まん(万) · 100.000.000 = おく(億)',
    explanation: `<p>Số tiếng Nhật xây từ 1-10 rồi ghép lại đều đặn: 20 = に+じゅう (にじゅう), 34 = さんじゅう+よん (さんじゅうよん), 99 = きゅうじゅうきゅう. Điều khác biệt lớn nhất so với tiếng Việt/tiếng Anh là <strong>tiếng Nhật nhóm số theo mỗi 4 chữ số (万 = 10.000)</strong>, không phải mỗi 3 chữ số (nghìn) như hệ phương Tây.</p>
<p>Vì vậy: 一万 (1万) = 10⁴ = 10.000, 一億 (1億) = 10⁸ = 100.000.000. Kết quả là <b>100万 = 1 triệu</b> (không phải "trăm nghìn"!) và <b>1億 = 100 triệu</b>. Đây là điều số 1 người học tiếng Việt phải "lập trình lại" trong đầu khi đọc số lớn tiếng Nhật.</p>
<p><b>Mẹo đọc số lớn:</b> nhẩm đặt lại dấu phẩy mỗi 4 chữ số từ phải sang, thay vì mỗi 3 chữ số. Ví dụ 25.300 → tách thành 2 万 (25) + 5.300 → にまん ごせん さんびゃく.</p>`,
    examples: [
      { sentence: '100万 = ひゃくまん', pronunciation: 'hyaku-man', meaningVi: '1.000.000 (một triệu = "trăm vạn")' },
      { sentence: '1億 = いちおく', pronunciation: 'ichi-oku', meaningVi: '100.000.000 (một trăm triệu)' },
      { sentence: '25.300 = にまん ごせん さんびゃく', pronunciation: 'ni-man go-sen san-byaku', meaningVi: '25.300 (2万 + 5.300)' },
    ],
    commonMistakes: 'Đọc 100万 thành "せんひゃく" hoặc nghĩ nó là "trăm nghìn" theo phản xạ hệ 3 chữ số của tiếng Việt — 100万 luôn là 1.000.000 (1 triệu). Quên rằng 万 áp dụng ngay từ 10.000, không phải từ 100.000.',
    comparedWith: 'So với biến âm ひゃく/びゃく/ぴゃく (điểm ngữ pháp kế tiếp): nhóm-4-chữ-số là quy tắc về CÁCH CHIA số, còn ひゃく/びゃく/ぴゃく là quy tắc về CÁCH ĐỌC âm khi ghép — hai vấn đề độc lập, cùng lúc áp dụng khi đọc một số lớn.',
  },
  {
    order: 2,
    title: '[C3] Biến âm số đếm: ひゃく/びゃく/ぴゃく & せん/ぜん',
    structure: '300=さんびゃく · 600=ろっぴゃく · 800=はっぴゃく · 3.000=さんぜん · 8.000=はっせん',
    explanation: `<p>Hàng trăm và hàng nghìn có vài chỗ đọc "mềm" đi (rendaku) khi ghép với số đứng trước — đây là quy tắc PHẢI học thuộc, không suy luận được:</p>
<ul>
<li><b>Hàng trăm:</b> 300 = さん<b>び</b>ゃく (không phải さんひゃく) · 600 = ろ<b>っぴ</b>ゃく · 800 = は<b>っぴ</b>ゃく. Còn lại đều đọc thẳng: 200=にひゃく, 400=よんひゃく, 500=ごひゃく, 700=ななひゃく, 900=きゅうひゃく.</li>
<li><b>Hàng nghìn:</b> 3.000 = さん<b>ぜ</b>ん (không phải さんせん) · 8.000 = は<b>っせ</b>ん. Còn lại đều đọc thẳng: 2.000=にせん, 5.000=ごせん.</li>
</ul>
<p>Đây chính là kanji/âm tiết bị test rất nhiều trong đề trắc nghiệm — vì các phương án gây nhiễu luôn là dạng đọc thẳng sai (さんひゃく, さんせん).</p>`,
    examples: [
      { sentence: '300円は さんびゃくえんです。', pronunciation: 'San-byaku-en desu.', meaningVi: '300 yên.' },
      { sentence: '600人が います。', pronunciation: 'Roppyaku-nin ga imasu.', meaningVi: 'Có 600 người.' },
      { sentence: '3.800円は さんぜんはっぴゃくえんです。', pronunciation: 'San-zen happyaku-en desu.', meaningVi: '3.800 yên (kết hợp cả hai biến âm).' },
    ],
    commonMistakes: 'Đọc thẳng さんひゃく/ろくひゃく/はちひゃく hoặc さんせん/はちせん theo phản xạ ghép âm thông thường — đây là 5 điểm biến âm bắt buộc học thuộc riêng (300, 600, 800, 3.000, 8.000), không theo quy tắc chung.',
    comparedWith: '',
  },
  {
    order: 3,
    title: '[C3] これは いくらですか — hỏi giá',
    structure: '[vật] は いくらですか。/ Đáp: [vật] は [số]円です。',
    explanation: `<p>いくら nghĩa là "bao nhiêu (tiền)" — một từ để hỏi chuyên dùng cho giá cả, khác với 何 (cái gì) hay 何人 (bao nhiêu người). Câu hỏi giữ đúng khung は…ですか đã học, chỉ thay từ hỏi bằng いくら.</p>
<p>Đơn vị tiền Nhật là <b>円 (えん, yên)</b>, viết sau số: 500円 = ごひゃくえん. Muốn hỏi tổng số tiền (khi mua nhiều món), dùng ぜんぶで いくらですか (tất cả bao nhiêu).</p>`,
    examples: [
      { sentence: 'これは いくらですか。― 350円です。', pronunciation: 'Kore wa ikura desu ka. — San-byaku gojū-en desu.', meaningVi: 'Cái này bao nhiêu tiền? — 350 yên.' },
      { sentence: 'この本は いくらですか。― 1.500円です。', pronunciation: 'Kono hon wa ikura desu ka. — Sen gohyaku-en desu.', meaningVi: 'Quyển sách này bao nhiêu? — 1.500 yên.' },
      { sentence: 'ぜんぶで いくらですか。― ぜんぶで1.200円です。', pronunciation: 'Zenbu de ikura desu ka. — Zenbu de sen nihyaku-en desu.', meaningVi: 'Tất cả bao nhiêu? — Tổng cộng 1.200 yên.' },
    ],
    commonMistakes: 'Dùng なんですか thay vì いくらですか khi hỏi giá — なん hỏi "cái gì/tên gì", không hỏi được số tiền. Quên 円 sau số khi trả lời (chỉ nói "350です" là thiếu, phải "350円です").',
    comparedWith: 'So với 何ですか (hỏi tên/loại vật) và 何歳ですか (hỏi tuổi): いくら là từ hỏi RIÊNG cho số lượng/giá tiền — không thuộc nhóm 6 từ để hỏi chính ở Chương 5 nhưng hoạt động theo cùng khung ngữ pháp です/ですか.',
  },
  {
    order: 4,
    title: '[C3] [số]年生まれです — nói năm sinh',
    structure: '[year]年 + 生まれです。 Hỏi: 何年(なんねん)生まれですか。',
    explanation: `<p>年 (ねん) là "năm", ghép trực tiếp sau số năm (không cần biến âm đặc biệt trừ 4年 = よねん, một cách đọc bất quy tắc). 生まれ (うまれ) nghĩa đen là "sinh ra", ghép sau để tạo câu "sinh năm...".</p>
<p>Câu hỏi dùng 何年 đọc là <b>なんねん</b> (không phải なにねん) — quy tắc 何 đọc なん trước danh từ đếm/trợ số từ sẽ gặp lại xuyên suốt chương 3 (何月、何日、何時、何歳、何曜日 đều đọc なん).</p>`,
    examples: [
      { sentence: '何年生まれですか。― 2005年生まれです。', pronunciation: 'Nan-nen umare desu ka. — Nisen-go-nen umare desu.', meaningVi: 'Bạn sinh năm nào? — Tôi sinh năm 2005.' },
      { sentence: 'アンさんは 2004年生まれです。', pronunciation: 'An-san wa nisen-yo-nen umare desu.', meaningVi: 'An sinh năm 2004.' },
    ],
    commonMistakes: 'Đọc 4年 thành よんねん thay vì đúng よねん (bất quy tắc, giống 4月=しがつ, 4日=よっか — số 4 trong tiếng Nhật có rất nhiều cách đọc khác nhau tuỳ ngữ cảnh, phải học riêng từng trường hợp).',
    comparedWith: '',
  },
  {
    order: 5,
    title: '[C3] [số]月 — tên tháng (bất quy tắc 4, 7, 9)',
    structure: '[1-12] + 月(がつ); ngoại lệ: 4月=しがつ, 7月=しちがつ, 9月=くがつ',
    explanation: `<p>Tên tháng = số đếm thuần Hán (いち・に・さん…) + 月 (がつ). Đa số đều đọc thẳng: 1月=いちがつ, 2月=にがつ, 3月=さんがつ, 5月=ごがつ, 6月=ろくがつ, 8月=はちがつ, 10月=じゅうがつ, 11月=じゅういちがつ, 12月=じゅうにがつ.</p>
<p>Ba tháng luôn bất quy tắc, PHẢI học thuộc riêng vì đây là lỗi phổ biến nhất chương này:</p>
<ul>
<li>4月 = <b>し</b>がつ (không phải よんがつ)</li>
<li>7月 = <b>しち</b>がつ (không phải なながつ)</li>
<li>9月 = <b>く</b>がつ (không phải きゅうがつ)</li>
</ul>`,
    examples: [
      { sentence: '4月は はるです。', pronunciation: 'Shigatsu wa haru desu.', meaningVi: 'Tháng 4 là mùa xuân.' },
      { sentence: '9月に がっこうが はじまります。', pronunciation: 'Kugatsu ni gakkō ga hajimarimasu.', meaningVi: 'Trường học bắt đầu vào tháng 9.' },
      { sentence: 'たんじょうびは 7月です。', pronunciation: 'Tanjōbi wa shichigatsu desu.', meaningVi: 'Sinh nhật (của tôi) là tháng 7.' },
    ],
    commonMistakes: 'Ghép số đếm thường (よん・なな・きゅう) trực tiếp với 月 cho tháng 4/7/9 — ba tháng này dùng cách đọc số cổ (し・しち・く), khác hẳn quy tắc đều đặn của các tháng còn lại.',
    comparedWith: 'So với 何日 (ngày trong tháng, điểm ngữ pháp kế tiếp): 月 chỉ có 3 ngoại lệ (4,7,9) trong khi 日 có tới hơn 10 ngoại lệ — 日 khó nhớ hơn nhiều.',
  },
  {
    order: 6,
    title: '[C3] [số]日 — ngày trong tháng (bất quy tắc 1-10, 14, 20, 24)',
    structure: '1日=ついたち…10日=とおか (10 từ cổ riêng); từ 11 trở đi + にち; ngoại lệ 14,20,24',
    explanation: `<p>Ngày 1-10 trong tháng KHÔNG dùng số đếm thông thường + にち, mà dùng 10 từ số thuần Nhật (kun) cổ, phải học thuộc nguyên khối:</p>
<p>1日=<b>ついたち</b>、2日=<b>ふつか</b>、3日=<b>みっか</b>、4日=<b>よっか</b>、5日=<b>いつか</b>、6日=<b>むいか</b>、7日=<b>なのか</b>、8日=<b>ようか</b>、9日=<b>ここのか</b>、10日=<b>とおか</b>。</p>
<p>Từ 11 trở đi phần lớn đều đặn: [số] + にち (11日=じゅういちにち). Ba ngoại lệ cần nhớ thêm: <b>14日=じゅうよっか</b>、<b>20日=はつか</b> (hoàn toàn khác quy tắc, giống 20歳=はたち)、<b>24日=にじゅうよっか</b>.</p>
<p><span class="badge">Mẹo</span> Các từ ngày 1-10 vọng lại cách đếm vật thuần Nhật ひとつ・ふたつ・みっつ… (một cái, hai cái…) mà bạn sẽ gặp ở N5 — nếu quen ひとつふたつ trước, nhóm ngày tháng này dễ nhớ hơn hẳn.</p>`,
    examples: [
      { sentence: 'お誕生日は 8月4日です。', pronunciation: 'Otanjōbi wa hachigatsu yokka desu.', meaningVi: 'Sinh nhật (của bạn) là ngày 4 tháng 8.' },
      { sentence: '今日は 20日です。', pronunciation: 'Kyō wa hatsuka desu.', meaningVi: 'Hôm nay là ngày 20.' },
      { sentence: '1日から 10日まで やすみです。', pronunciation: 'Tsuitachi kara tōka made yasumi desu.', meaningVi: 'Nghỉ từ mùng 1 đến mùng 10.' },
    ],
    commonMistakes: 'Đọc 20日 thành にじゅうにち (theo quy tắc đều đặn) — 20日 luôn là はつか, một ngoại lệ hoàn toàn tách biệt, không suy luận được từ quy tắc chung. Nhầm 4日(よっか) với 4月(しがつ) hay 4年(よねん) — cùng số 4 nhưng ba cách đọc khác nhau tuỳ đơn vị đi kèm.',
    comparedWith: 'So với 曜日 (thứ trong tuần): 日 (ngày trong tháng) có rất nhiều ngoại lệ khó, còn 曜日 hoàn toàn đều đặn không ngoại lệ nào — đừng nhầm hai khái niệm "ngày" khác nhau này với nhau.',
  },
  {
    order: 7,
    title: '[C3] [số]時[分] & 何時ですか — giờ',
    structure: '[giờ]時[phút]分; Hỏi: 今 何時ですか。',
    explanation: `<p>時 (じ, giờ) và 分 (ふん/ぷん, phút) ghép trực tiếp sau số. 時 đọc đều đặn (4時=よじ là ngoại lệ nhỏ, đọc よじ không phải よんじ), nhưng 分 đổi âm đầu tuỳ số đứng trước — ぷん sau các số 1,3,4,6,8,10 (いっぷん、さんぷん、よんぷん、ろっぷん、はっぷん、じゅっぷん) và ふん sau các số còn lại (にふん、ごふん、ななふん、きゅうふん).</p>
<p>Câu hỏi giờ dùng <b>何時</b> đọc <b>なんじ</b> (theo đúng quy tắc 何 đọc なん trước trợ số từ).</p>`,
    examples: [
      { sentence: '今 何時ですか。― 3時です。', pronunciation: 'Ima nanji desu ka. — Sanji desu.', meaningVi: 'Bây giờ mấy giờ? — 3 giờ.' },
      { sentence: '3時30分に あいましょう。', pronunciation: 'Sanji sanjuppun ni aimashō.', meaningVi: 'Gặp nhau lúc 3 giờ 30 phút nhé.' },
      { sentence: 'じゅぎょうは 9時に はじまります。', pronunciation: 'Jugyō wa kuji ni hajimarimasu.', meaningVi: 'Tiết học bắt đầu lúc 9 giờ.' },
    ],
    commonMistakes: 'Đọc 4時 thành よんじ thay vì đúng よじ. Dùng に sau 何時ですか khi chỉ hỏi giờ hiện tại (今何時ですか không cần に vì không phải câu hành động) nhưng lại BẮT BUỘC に khi nói "làm gì LÚC mấy giờ" (7時に おきます — xem trợ từ に ở Chương 5).',
    comparedWith: '',
  },
  {
    order: 8,
    title: '[C3] [số]歳 — tuổi (bất quy tắc 20歳=はたち)',
    structure: '[số]歳(さい); Hỏi: 何歳ですか。/ おいくつですか。(lịch sự hơn)',
    explanation: `<p>歳 (さい) là trợ số từ đếm tuổi, ghép sau số đếm thường: 18歳=じゅうはっさい, 19歳=じゅうきゅうさい. Có hai cách hỏi tuổi: <b>何歳ですか</b> (trung tính, dùng được với bạn bè/người nhỏ tuổi hơn) và <b>おいくつですか</b> (lịch sự hơn, nên dùng với người lớn tuổi hoặc mới quen).</p>
<p><b>20歳 luôn đọc là はたち</b> — hoàn toàn không theo quy tắc [số]+さい thông thường, đây là một trong những ngoại lệ bị hỏi nhiều nhất đề thi thật (giống 20日=はつか cùng gốc từ cổ).</p>`,
    examples: [
      { sentence: '何歳ですか。― 19歳です。', pronunciation: 'Nansai desu ka. — Jūkyū-sai desu.', meaningVi: 'Bạn bao nhiêu tuổi? — 19 tuổi.' },
      { sentence: 'おいくつですか。― 20歳です。', pronunciation: 'Oikutsu desu ka. — Hatachi desu.', meaningVi: 'Ông/bà bao nhiêu tuổi ạ? — 20 tuổi.' },
    ],
    commonMistakes: 'Đọc 20歳 thành にじゅっさい (theo quy tắc đều đặn) — luôn phải là はたち, không có ngoại lệ. Dùng 何歳ですか với người lớn tuổi hơn nhiều trong ngữ cảnh trang trọng — nên đổi sang おいくつですか.',
    comparedWith: '',
  },
  {
    order: 9,
    title: '[C3] [thứ]曜日 & 何曜日ですか — thứ trong tuần',
    structure: '[nguyên tố]+曜日(ようび); 月火水木金土日 + 曜日; Hỏi: 何曜日ですか。',
    explanation: `<p>Mỗi ngày trong tuần = một kanji "nguyên tố" + 曜日 (ようび, "ngày của ~"). Khác với 月 và 日 (nhiều ngoại lệ), <b>曜日 hoàn toàn đều đặn, không ngoại lệ nào</b>:</p>
<p>月曜日(げつようび)・火曜日(かようび)・水曜日(すいようび)・木曜日(もくようび)・金曜日(きんようび)・土曜日(どようび)・日曜日(にちようび)。</p>
<p>Mỗi kanji nguyên tố còn mang nghĩa riêng: 月=mặt trăng, 火=lửa, 水=nước, 木=gỗ/cây, 金=vàng/tiền, 土=đất, 日=mặt trời — năm nguyên tố ngũ hành + mặt trời/mặt trăng. Trong lời nói thân mật thường bỏ 日 cuối: 月曜=げつよう.</p>
<p><span class="badge">Tần suất thi thật</span> Kanji <b>曜</b> xuất hiện <b>nhiều thứ 3</b> trong 420 câu FE thật đã khảo sát (60 lần) — chỉ sau 日 và 私. Nếu chỉ ôn thêm vài kanji trước khi thi, 曜 phải nằm trong đó.</p>`,
    examples: [
      { sentence: '今日は 何曜日ですか。― 水曜日です。', pronunciation: 'Kyō wa nan-yōbi desu ka. — Suiyōbi desu.', meaningVi: 'Hôm nay thứ mấy? — Thứ Tư.' },
      { sentence: '日本語のクラスは 月曜日と木曜日です。', pronunciation: 'Nihongo no kurasu wa getsuyōbi to mokuyōbi desu.', meaningVi: 'Lớp tiếng Nhật vào thứ Hai và thứ Năm.' },
      { sentence: '休みは 何曜日ですか。― 土曜日と日曜日です。', pronunciation: 'Yasumi wa nan-yōbi desu ka. — Doyōbi to nichiyōbi desu.', meaningVi: 'Nghỉ vào thứ mấy? — Thứ Bảy và Chủ Nhật.' },
    ],
    commonMistakes: 'Nhầm 曜日 (thứ trong tuần) với 日 đứng một mình (ngày trong tháng, ví dụ 8日) — hai khái niệm "ngày" hoàn toàn khác nhau dùng cùng chữ 日. Đọc 何曜日 nhầm thành どの曜日 — từ hỏi đúng luôn là 何 (なん), không phải どの.',
    comparedWith: 'So với 日 (ngày trong tháng, có 10+ ngoại lệ): 曜日 đều đặn 100%, không ngoại lệ — nếu phải chọn học thuộc trước, ưu tiên 曜日 vì dễ và ăn điểm chắc hơn.',
  },

  // ══════════════ CHƯƠNG 4 — Tự giới thiệu (order 10-16) ══════════════
  {
    order: 10,
    title: '[C4] は — trợ từ chủ đề',
    structure: 'N + は + … (は viết vậy nhưng đọc "wa" khi làm trợ từ)',
    explanation: `<p>は đứng ngay sau một danh từ để đánh dấu <strong>chủ đề</strong> — cái mà cả câu đang nói tới. Trật tự câu tiếng Nhật là Chủ–Tân–Động (SOV), nên は xuất hiện gần đầu câu còn động từ/です nằm ở cuối.</p>
<p>は là trợ từ duy nhất trong nhóm は/へ/を bị "đọc khác chữ": viết bằng hiragana は (bình thường đọc "ha") nhưng trong vai trò trợ từ chủ đề LUÔN đọc <b>"wa"</b>.</p>`,
    examples: [
      { sentence: 'わたしは アンです。', pronunciation: 'Watashi wa An desu.', meaningVi: 'Tôi là An.' },
      { sentence: 'これは ほんです。', pronunciation: 'Kore wa hon desu.', meaningVi: 'Đây là quyển sách.' },
      { sentence: 'アンさんは がくせいです。', pronunciation: 'An-san wa gakusei desu.', meaningVi: 'An là sinh viên.' },
    ],
    commonMistakes: 'Đọc は thành "ha" thay vì "wa" khi làm trợ từ chủ đề. Nhầm は với が (trợ từ chủ ngữ, chưa dạy ở JPD113 nhưng hay gặp ở N5) — は đánh dấu ĐIỀU ĐANG NÓI TỚI, không nhất thiết là chủ ngữ ngữ pháp.',
    comparedWith: 'So với も (điểm ngữ pháp kế tiếp): は đánh dấu chủ đề bình thường, も thay thế は khi ý là "cũng" — hai trợ từ này không bao giờ xuất hiện cùng lúc trên cùng một danh từ.',
  },
  {
    order: 11,
    title: '[C4] です — vị ngữ lịch sự (phủ định ではありません)',
    structure: 'N + です。("là/thì", lịch sự) — Phủ định: N + ではありません。(じゃありません, khẩu ngữ)',
    explanation: `<p>です là đuôi lịch sự tương đương "là/thì", LUÔN đứng cuối câu (vì tiếng Nhật đặt vị ngữ ở cuối). Đây là mảnh ghép cuối cùng khiến một câu tiếng Nhật hoàn chỉnh và lịch sự.</p>
<p>Phủ định của です là <b>ではありません</b> (trang trọng) hoặc rút gọn khẩu ngữ <b>じゃありません</b>/<b>じゃないです</b> (thân mật hơn nhưng vẫn lịch sự, thường dùng trong hội thoại hằng ngày).</p>`,
    examples: [
      { sentence: 'かれは エンジニアです。', pronunciation: 'Kare wa enjinia desu.', meaningVi: 'Anh ấy là kỹ sư.' },
      { sentence: 'これは みずではありません。', pronunciation: 'Kore wa mizu dewa arimasen.', meaningVi: 'Đây không phải là nước.' },
      { sentence: 'わたしは せんせいじゃないです。がくせいです。', pronunciation: 'Watashi wa sensei ja nai desu. Gakusei desu.', meaningVi: 'Tôi không phải giáo viên. Tôi là sinh viên.' },
    ],
    commonMistakes: 'Đặt です ở giữa câu thay vì cuối câu (ảnh hưởng trật tự SVO của tiếng Việt/Anh). Dùng ではない (thể thường/suồng sã) thay vì ではありません/じゃないです trong ngữ cảnh cần lịch sự — ở A1.1 luôn ưu tiên thể lịch sự.',
    comparedWith: '',
  },
  {
    order: 12,
    title: '[C4] の — trợ từ sở hữu / liên kết',
    structure: 'N1 + の + N2 (N1 sở hữu/bổ nghĩa cho N2)',
    explanation: `<p>の nối hai danh từ, danh từ đứng trước bổ nghĩa/sở hữu cho danh từ đứng sau — giống "'s" hoặc "của" trong tiếng Việt nhưng ĐẢO NGƯỢC thứ tự so với "của": わたしのなまえ = "tên của tôi" (nghĩa đen: tôi-の-tên).</p>
<p>の không chỉ dùng cho sở hữu vật, mà còn cho nguồn gốc/xuất xứ: ベトナムのがくせい = "sinh viên đến từ Việt Nam" (nghĩa đen: Việt Nam-の-sinh viên).</p>`,
    examples: [
      { sentence: 'わたしの なまえは アンです。', pronunciation: 'Watashi no namae wa An desu.', meaningVi: 'Tên của tôi là An.' },
      { sentence: 'アンさんは ベトナムの がくせいです。', pronunciation: 'An-san wa Betonamu no gakusei desu.', meaningVi: 'An là sinh viên đến từ Việt Nam.' },
      { sentence: 'この かばんは わたしのです。', pronunciation: 'Kono kaban wa watashi no desu.', meaningVi: 'Cái cặp này là của tôi.' },
    ],
    commonMistakes: 'Đảo ngược thứ tự N1-の-N2 theo thói quen "của" tiếng Việt (nói "tên-の-tôi" thay vì "tôi-の-tên"). Quên rằng の đứng ở cuối câu vẫn có nghĩa "của [ai đó]" mà không cần lặp lại danh từ (この かばんは わたしのです — わたしの đứng một mình = "của tôi").',
    comparedWith: '',
  },
  {
    order: 13,
    title: '[C4] も — "cũng" (thay thế は/が)',
    structure: 'N + も + … ("cũng"; も THAY THẾ は/が, không đứng cạnh)',
    explanation: `<p>も có nghĩa "cũng/cả" và <strong>thay thế hoàn toàn</strong> vị trí của は (hoặc が) trên cùng một danh từ — không bao giờ xuất hiện cùng lúc với は/が trên một từ.</p>
<p>Dùng khi muốn nói một sự việc tương tự đã đúng với người/vật khác. Câu trước xác lập một sự thật (X は Y です), câu sau lặp lại sự thật đó cho chủ thể khác bằng も.</p>`,
    examples: [
      { sentence: 'わたしは がくせいです。かれも がくせいです。', pronunciation: 'Watashi wa gakusei desu. Kare mo gakusei desu.', meaningVi: 'Tôi là sinh viên. Anh ấy cũng là sinh viên.' },
      { sentence: 'アンさんは ベトナム人です。マイさんも ベトナム人です。', pronunciation: 'An-san wa Betonamu-jin desu. Mai-san mo Betonamu-jin desu.', meaningVi: 'An là người Việt Nam. Mai cũng là người Việt Nam.' },
    ],
    commonMistakes: 'Viết は và も cùng lúc (わたしはもがくせいです là SAI) — も phải THAY hẳn は, câu đúng là わたしもがくせいです. Dùng も khi ý muốn nói KHÔNG phải "cũng" (も chỉ dùng khi thật sự có một sự việc tương tự trước đó).',
    comparedWith: 'So với は: は đánh dấu chủ đề trung lập, も đánh dấu chủ đề "giống một điều đã nói trước đó". Nhìn câu trước để biết có nên dùng も hay không.',
  },
  {
    order: 14,
    title: '[C4] か — trợ từ hỏi cuối câu',
    structure: '[câu です] + か。(biến khẳng định thành câu hỏi, GIỮ NGUYÊN trật tự từ)',
    explanation: `<p>か thêm vào cuối một câu です đã hoàn chỉnh để biến nó thành câu hỏi có/không — không cần đảo trật tự từ, không cần dấu hỏi tiếng Anh (dù văn viết vẫn dùng 。hoặc đôi khi ？), khác hẳn cách đặt câu hỏi trong tiếng Anh.</p>
<p>Trả lời: <b>はい、そうです。</b> (đúng vậy) khi đồng ý, <b>いいえ、ちがいます。</b> hoặc <b>いいえ、[N]じゃないです。</b> khi phủ định.</p>`,
    examples: [
      { sentence: 'あなたは がくせいですか。', pronunciation: 'Anata wa gakusei desu ka.', meaningVi: 'Bạn có phải là sinh viên không?' },
      { sentence: 'はい、そうです。', pronunciation: 'Hai, sō desu.', meaningVi: 'Vâng, đúng vậy.' },
      { sentence: 'いいえ、がくせいじゃないです。せんせいです。', pronunciation: 'Iie, gakusei ja nai desu. Sensei desu.', meaningVi: 'Không, tôi không phải sinh viên. Tôi là giáo viên.' },
    ],
    commonMistakes: 'Đảo trật tự từ khi đặt câu hỏi theo thói quen tiếng Anh ("Are you...") — tiếng Nhật CHỈ cần thêm か vào cuối, giữ nguyên toàn bộ trật tự câu khẳng định.',
    comparedWith: 'Trong đề trắc nghiệm: chỗ trống ngay trước ですか mà không có trợ từ nào khác gần đó thường được điền bằng chính か (để câu thành câu hỏi hợp ngữ pháp) hoặc bằng も (nếu câu lặp lại một sự việc đã nói về người khác) — luôn đọc câu TRƯỚC chỗ trống để tìm chủ đề trùng lặp, đó là manh mối quyết định giữa hai lựa chọn này.',
  },
  {
    order: 15,
    title: '[C4] Quốc tịch: [nước] + 人',
    structure: '[tên nước] + 人(じん) = người của nước đó',
    explanation: `<p>Ghép 人 (じん, "người") ngay sau tên một quốc gia là tạo ra danh từ chỉ quốc tịch — quy tắc đơn giản, đều đặn cho MỌI quốc gia, không có ngoại lệ.</p>
<p>Tên nước láng giềng có gốc kanji (にほん・かんこく・ちゅうごく) ở trình độ A1.1 thường viết hiragana; tên nước phương Tây luôn viết katakana (ベトナム là ngoại lệ hay gặp — dù là nước châu Á nhưng lại viết katakana vì tên phiên âm không có gốc kanji quen thuộc trong giáo trình này).</p>`,
    examples: [
      { sentence: 'わたしは にほんじんです。', pronunciation: 'Watashi wa nihonjin desu.', meaningVi: 'Tôi là người Nhật.' },
      { sentence: 'アンさんは ベトナムじんです。', pronunciation: 'An-san wa Betonamu-jin desu.', meaningVi: 'An là người Việt Nam.' },
      { sentence: 'かのじょは フランスじんです。', pronunciation: 'Kanojo wa Furansu-jin desu.', meaningVi: 'Cô ấy là người Pháp.' },
    ],
    commonMistakes: 'Viết tên nước bằng sai bảng chữ (viết にほん bằng katakana, hoặc ベトナム bằng hiragana) — quy tắc chọn hiragana/katakana theo TỪNG nước cụ thể phải nhớ, không có logic chung tuyệt đối.',
    comparedWith: '',
  },
  {
    order: 16,
    title: '[C4] おくにはどちらですか / おしごとはなんですか',
    structure: 'おくには どちらですか。(hỏi quốc gia, lịch sự) — おしごとは なんですか。(hỏi nghề nghiệp)',
    explanation: `<p>Hai mẫu câu hỏi lịch sự dùng お- (tiền tố kính ngữ) khi hỏi thông tin về NGƯỜI ĐỐI DIỆN — lịch sự hơn hẳn so với hỏi trực tiếp bằng どこ/なん không có お-.</p>
<p><b>おくには どちらですか</b> — nghĩa đen "nước của bạn là hướng nào", dùng どちら (lịch sự) thay vì どこ khi hỏi quê quán trực tiếp trước mặt ai đó.</p>
<p><b>おしごとは なんですか</b> — luôn dùng <b>なん</b> (không phải なに) ngay trước です, đúng quy tắc 何 đọc なん trước です/だ đã gặp ở nhóm số đếm.</p>`,
    examples: [
      { sentence: 'おくには どちらですか。― ベトナムです。', pronunciation: 'Okuni wa dochira desu ka. — Betonamu desu.', meaningVi: 'Quê bạn ở đâu? — Việt Nam.' },
      { sentence: 'おしごとは なんですか。― かいしゃいんです。', pronunciation: 'Oshigoto wa nan desu ka. — Kaishain desu.', meaningVi: 'Bạn làm nghề gì? — Nhân viên công ty.' },
    ],
    commonMistakes: 'Dùng どこ thay vì どちら khi hỏi quê quán một cách lịch sự trước mặt người đối diện — どこ nghe cộc/suồng sã hơn trong ngữ cảnh này. Nói なにですか thay vì なんですか trước です.',
    comparedWith: 'So với 6 từ để hỏi cốt lõi ở Chương 5 (なに/だれ/どこ/いつ/どちら): どちら ở đây là bản lịch sự của どこ, dùng đặc biệt khi hỏi trực diện người đối thoại về xuất xứ của họ.',
  },

  // ══════════════ CHƯƠNG 5 — Chỉ định, nơi chốn, từ hỏi, trợ từ (order 17-25) ══════════════
  {
    order: 17,
    title: '[C5] これ/それ/あれ/どれ — chỉ định đứng MỘT MÌNH',
    structure: 'これ(gần tôi)・それ(gần bạn)・あれ(xa cả hai)・どれ(cái nào?) — đứng thay hẳn cho danh từ',
    explanation: `<p>Hệ こ・そ・あ・ど chia theo khoảng cách VỚI NGƯỜI NÓI VÀ NGƯỜI NGHE: こ- gần người nói, そ- gần người nghe, あ- xa cả hai, ど- dùng để hỏi.</p>
<p>これ/それ/あれ/どれ <strong>đứng MỘT MÌNH</strong>, thay thế hoàn toàn cho một danh từ — giống đại từ "cái này/cái đó/cái kia/cái nào" đứng độc lập trong câu, KHÔNG đi kèm danh từ ngay sau nó.</p>`,
    examples: [
      { sentence: 'これは なんですか。― それは ほんです。', pronunciation: 'Kore wa nan desu ka. — Sore wa hon desu.', meaningVi: 'Cái này là gì? — Đó là quyển sách.' },
      { sentence: 'あれは わたしの かさです。', pronunciation: 'Are wa watashi no kasa desu.', meaningVi: 'Cái kia (đằng xa) là ô của tôi.' },
      { sentence: 'どれが あなたの かばんですか。', pronunciation: 'Dore ga anata no kaban desu ka.', meaningVi: 'Cái nào là cặp của bạn?' },
    ],
    commonMistakes: 'Dùng これ/それ/あれ ngay trước một danh từ (これ ほん là SAI) — muốn đứng trước danh từ phải dùng dạng riêng この/その/あの (điểm ngữ pháp kế tiếp), đây là bẫy lặp lại nhiều nhất trong đề thi thật.',
    comparedWith: 'So với この/その/あの (kế tiếp): đây là hai bộ TÁCH BIỆT cho cùng khái niệm "gần/xa" — chọn bộ nào phụ thuộc HOÀN TOÀN vào việc ngay sau chỗ trống có danh từ trần hay không.',
  },
  {
    order: 18,
    title: '[C5] この/その/あの/どの — chỉ định ĐỨNG TRƯỚC danh từ',
    structure: 'この/その/あの/どの + N (LUÔN phải có danh từ theo ngay sau, không bao giờ đứng một mình)',
    explanation: `<p>この/その/あの/どの làm nhiệm vụ ngược lại với これ/それ/あれ/どれ: chúng <strong>LUÔN đứng ngay trước một danh từ</strong>, giống "[danh từ] này/đó/kia" trong tiếng Việt, và <strong>không bao giờ đứng một mình</strong>.</p>
<p><strong>Đây là bẫy được lặp lại NHIỀU NHẤT trong 420 câu đề thi FE thật đã khảo sát</strong> — quy tắc quyết định duy nhất và chắc chắn: nhìn vào từ NGAY SAU chỗ trống.</p>
<ul>
<li>Có <b>danh từ trần</b> ngay sau → phải dùng この/その/あの/どの.</li>
<li>Không có gì, hoặc có trợ từ/động từ ngay sau (hết mệnh đề) → phải dùng これ/それ/あれ/どれ.</li>
</ul>`,
    examples: [
      { sentence: 'この ほんは わたしのです。', pronunciation: 'Kono hon wa watashi no desu.', meaningVi: 'Quyển sách này là của tôi. (この phải theo sau bởi ほん)' },
      { sentence: 'その ペンは アンさんのです。', pronunciation: 'Sono pen wa An-san no desu.', meaningVi: 'Cây bút đó là của An.' },
      { sentence: '＿＿＿ かばんは わたしのです。→ この', pronunciation: '(danh từ trần かばん theo ngay sau)', meaningVi: 'Cái cặp này là của tôi. → đáp án: この' },
      { sentence: '＿＿＿ は なんですか。→ これ', pronunciation: '(không có gì theo sau ngoài は)', meaningVi: 'Cái này là gì? → đáp án: これ' },
    ],
    commonMistakes: 'Dùng この/その/あの đứng MỘT MÌNH không kèm danh từ (このは... là SAI hoàn toàn). Ngược lại, thêm danh từ ngay sau これ/それ/あれ (これほん là SAI, phải là このほん).',
    comparedWith: 'So với これ/それ/あれ/どれ (mục trước): quy tắc kiểm tra là nhìn từ NGAY SAU chỗ trống — danh từ trần → この nhóm; không có gì/trợ từ/động từ → これ nhóm. Chỉ một phép kiểm tra này giải quyết phần lớn câu điền chỗ trống về chỉ định trong đề thi thật.',
  },
  {
    order: 19,
    title: '[C5] ここ/そこ/あそこ/どこ — chỉ định nơi chốn',
    structure: 'ここ(ở đây)・そこ(ở đó)・あそこ(đằng kia)・どこ(ở đâu?) — cùng hệ こ・そ・あ・ど áp cho NƠI CHỐN',
    explanation: `<p>Cùng logic khoảng cách của これ/それ/あれ/どれ nhưng áp dụng cho địa điểm thay vì vật thể: ここ = nơi gần người nói, そこ = nơi gần người nghe, あそこ = nơi xa cả hai, どこ = từ hỏi "ở đâu".</p>
<p>Nhóm này đứng MỘT MÌNH như これ/それ/あれ (không có dạng "trước danh từ" riêng như この/その/あの), thường đi cùng trợ từ に hoặc で tuỳ vai trò trong câu (xem trợ từ に/で ở các điểm ngữ pháp sau trong chương này).</p>`,
    examples: [
      { sentence: 'としょかんは どこですか。― あそこです。', pronunciation: 'Toshokan wa doko desu ka. — Asoko desu.', meaningVi: 'Thư viện ở đâu? — Ở đằng kia.' },
      { sentence: 'かばんは あそこに あります。', pronunciation: 'Kaban wa asoko ni arimasu.', meaningVi: 'Cái cặp ở đằng kia.' },
      { sentence: 'ここで べんきょうします。', pronunciation: 'Koko de benkyō shimasu.', meaningVi: 'Học ở đây.' },
    ],
    commonMistakes: 'Nhầm どこ (nơi chốn, "ở đâu") với どの (chỉ định trước danh từ, "cái nào") hoặc どれ (đứng một mình, "cái nào") — ba từ đọc gần giống nhưng vai trò ngữ pháp khác hẳn nhau.',
    comparedWith: 'So với これ/それ/あれ (chỉ vật) và この/その/あの (chỉ vật trước danh từ): ここ/そこ/あそこ CHỈ dùng cho địa điểm, không có dạng "trước danh từ" tương ứng.',
  },
  {
    order: 20,
    title: '[C5] あります vs います — tồn tại vô tri / hữu sinh',
    structure: '[vật vô tri]が あります。 / [vật hữu sinh]が います。',
    explanation: `<p>Cả hai đều dịch là "có/tồn tại", nhưng chọn động từ nào phụ thuộc <strong>HOÀN TOÀN vào việc chủ thể có SỐNG hay không</strong>, không phụ thuộc kích thước hay tính chất khác.</p>
<ul>
<li><b>あります</b> — dùng cho vật vô tri: sách, xe, tòa nhà, đồ vật bất kỳ. 本があります (có một quyển sách).</li>
<li><b>います</b> — dùng cho vật hữu sinh: người, động vật. 猫がいます (có một con mèo).</li>
</ul>
<p>Trợ từ が (chưa dạy sâu ở JPD113 nhưng xuất hiện cố định trong mẫu này) đánh dấu CHỦ THỂ đang tồn tại, khác は (chủ đề của câu nói chung).</p>`,
    examples: [
      { sentence: 'つくえの うえに ほんが あります。', pronunciation: 'Tsukue no ue ni hon ga arimasu.', meaningVi: 'Có một quyển sách trên bàn.' },
      { sentence: 'きょうしつに がくせいが います。', pronunciation: 'Kyōshitsu ni gakusei ga imasu.', meaningVi: 'Có sinh viên trong lớp học.' },
      { sentence: 'あそこに ねこが います。かばんは ここに あります。', pronunciation: 'Asoko ni neko ga imasu. Kaban wa koko ni arimasu.', meaningVi: 'Có con mèo ở đằng kia. Cặp ở đây.' },
    ],
    commonMistakes: 'Chọn います/あります theo KÍCH THƯỚC (nghĩ vật to dùng います) thay vì theo tiêu chí SỐNG hay KHÔNG SỐNG — đây là lỗi tư duy phổ biến nhất. Ví dụ: xe hơi rất to nhưng vẫn dùng あります vì là vật vô tri.',
    comparedWith: '',
  },
  {
    order: 21,
    title: '[C5] Từ để hỏi: なに/なん・だれ・どこ・いつ・どちら',
    structure: '何(なに/なん)="cái gì" · 誰(だれ)="ai" · どこ="ở đâu" · いつ="khi nào" · どちら="ở đâu/hướng nào (lịch sự)"',
    explanation: `<p>Năm/sáu từ hỏi này xuất hiện trong gần như mọi đoạn hội thoại của đề thi. Học mỗi từ CÙNG với dạng câu trả lời điển hình của nó — đó là cách nhanh nhất để giải câu điền chỗ trống.</p>
<table><thead><tr><th>Từ hỏi</th><th>Trả lời điển hình</th></tr></thead><tbody>
<tr><td>なに／なん (何)</td><td>một vật/tên: ほんです、がくせいです</td></tr>
<tr><td>だれ (誰)</td><td>một người: アンさんです</td></tr>
<tr><td>どこ</td><td>một nơi: がっこうです、ここです</td></tr>
<tr><td>いつ</td><td>một mốc thời gian: あした、8月4日です</td></tr>
<tr><td>どちら</td><td>nơi/hướng, lịch sự: ベトナムです</td></tr>
</tbody></table>
<p><b>Quy tắc đọc 何:</b> đọc <b>なに</b> khi đứng một mình hoặc trước で/を/が (何ですか thực chất vẫn có ngoại lệ — xem dưới); đọc <b>なん</b> ngay trước です/だ hoặc trước trợ số từ/trợ từ bắt đầu bằng な・だ・と (何時なんじ、何人なんにん、何曜日なんようび、何ですかなんですか).</p>
<p><b>Kỹ thuật làm bài:</b> khi câu điền chỗ trống cho sẵn CÂU TRẢ LỜI nhưng để trống từ hỏi, hãy đọc câu trả lời TRƯỚC — loại của nó (người/nơi/thời gian/vật) cho biết ngay từ hỏi nào phù hợp.</p>`,
    examples: [
      { sentence: '＿＿＿ですか。― アンさんです。→ だれ', pronunciation: '(câu trả lời là tên người)', meaningVi: 'Ai vậy? — Là An.' },
      { sentence: '＿＿＿ですか。― 火曜日です。→ 何曜日', pronunciation: '(câu trả lời là thứ trong tuần)', meaningVi: 'Thứ mấy? — Thứ Ba.' },
      { sentence: 'たんじょうびは いつですか。― 3月です。', pronunciation: 'Tanjōbi wa itsu desu ka. — Sangatsu desu.', meaningVi: 'Sinh nhật khi nào? — Tháng 3.' },
    ],
    commonMistakes: 'Đoán từ hỏi TRƯỚC khi đọc câu trả lời — luôn lãng phí thời gian và dễ sai. Đọc 何 nhầm giữa なに/なん trong các trợ số từ ghép sẵn (何時 phải なんじ, không phải なにじ).',
    comparedWith: 'So với おくにはどちらですか ở Chương 4: どちら trong nhóm 6 từ hỏi này dùng chung logic — là bản lịch sự thay cho どこ khi hỏi trực diện một người về nơi chốn/xuất xứ.',
  },
  {
    order: 22,
    title: '[C5] を — trợ từ tân ngữ (đối tượng)',
    structure: '[danh từ] + を + [động từ] (を đánh dấu vật bị hành động tác động, đọc "o")',
    explanation: `<p>を đánh dấu <strong>tân ngữ trực tiếp</strong> — vật bị hành động của động từ tác động lên. を viết bằng hiragana を nhưng đọc "o" (âm giống hệt お) — nó CHỈ tồn tại với vai trò trợ từ tân ngữ này, không bao giờ xuất hiện như một âm tiết bình thường trong từ.</p>
<p>Nếu thấy を trong một câu, nó LUÔN đánh dấu tân ngữ ngay trước nó — dấu hiệu chắc chắn 100% để nhận diện.</p>`,
    examples: [
      { sentence: 'パンを たべます。', pronunciation: 'Pan o tabemasu.', meaningVi: 'Ăn bánh mì.' },
      { sentence: 'にほんごを べんきょうします。', pronunciation: 'Nihongo o benkyō shimasu.', meaningVi: 'Học tiếng Nhật.' },
      { sentence: 'ジュースを のみます。', pronunciation: 'Jūsu o nomimasu.', meaningVi: 'Uống nước ép.' },
    ],
    commonMistakes: 'Viết nhầm を thành お trong văn bản (dù đọc giống nhau, chữ viết PHẢI là を khi làm trợ từ). Dùng を cho điểm đến/thời gian thay vì đúng trợ từ へ/に (がっこうを いきます là SAI, phải がっこうへ いきます).',
    comparedWith: 'So với に/で/へ (các mục kế tiếp): を luôn đánh dấu TÂN NGỮ (vật bị tác động trực tiếp bởi động từ như ăn/uống/đọc/mua/học), không bao giờ đánh dấu địa điểm hay thời gian.',
  },
  {
    order: 23,
    title: '[C5] に — trợ từ thời điểm / điểm đến',
    structure: '[giờ/mốc thời gian cụ thể] + に + [động từ] / [nơi đến] + に + いきます・きます',
    explanation: `<p>に có hai vai trò chính ở trình độ này: (1) đánh dấu <strong>một mốc thời gian cụ thể</strong> (giờ đồng hồ, không dùng cho ngày/tháng chung chung như "hôm nay/ngày mai"), và (2) đánh dấu <strong>điểm đến</strong> cùng vai trò với へ khi đi cùng いきます/きます/かえります.</p>
<p><span class="badge">Lưu ý quan trọng</span> に và へ CÙNG đánh dấu được điểm đến (がっこうに行きます = がっこうへ行きます, có thể thay nhau), nhưng CHỈ に đánh dấu được giờ đồng hồ cụ thể (7時に) — へ KHÔNG BAO GIỜ làm việc này.</p>`,
    examples: [
      { sentence: '7時に おきます。', pronunciation: 'Shichiji ni okimasu.', meaningVi: 'Dậy lúc 7 giờ.' },
      { sentence: 'がっこうに いきます。', pronunciation: 'Gakkō ni ikimasu.', meaningVi: 'Đi đến trường.' },
      { sentence: 'あさ7時に がっこうに いきます。', pronunciation: 'Asa shichiji ni gakkō ni ikimasu.', meaningVi: 'Sáng 7 giờ đi đến trường.' },
    ],
    commonMistakes: 'Dùng へ cho giờ đồng hồ (7時へおきます là SAI) — chỉ に mới đánh dấu được thời điểm cụ thể. Dùng で thay vì に cho điểm đến — で không bao giờ đánh dấu đích đến, chỉ đánh dấu nơi hành động DIỄN RA (xem で ở mục kế tiếp).',
    comparedWith: 'So với へ: cả hai đều đánh dấu được điểm đến với đi/đến/về, nhưng に còn kiêm luôn vai trò đánh dấu giờ mà へ không có — nếu không chắc chọn cái nào cho điểm đến, に luôn an toàn hơn vì đa năng hơn.',
  },
  {
    order: 24,
    title: '[C5] で — trợ từ nơi hành động / phương tiện',
    structure: '[nơi hành động diễn ra] + で + [động từ] / [phương tiện/công cụ] + で + [động từ]',
    explanation: `<p>で có hai vai trò: (1) đánh dấu <strong>nơi một hành động diễn ra</strong> (khác với に/へ là điểm ĐẾN — で là nơi hành động XẢY RA sau khi đã tới), và (2) đánh dấu <strong>phương tiện hoặc công cụ</strong> dùng để thực hiện hành động.</p>
<p>で KHÔNG BAO GIỜ đánh dấu điểm đến — chỉ に/へ làm việc đó. Ghi nhớ: đi ĐẾN đâu dùng に/へ; làm gì Ở đâu hoặc BẰNG gì dùng で.</p>`,
    examples: [
      { sentence: 'としょかんで べんきょうします。', pronunciation: 'Toshokan de benkyō shimasu.', meaningVi: 'Học ở thư viện.' },
      { sentence: 'バスで いきます。', pronunciation: 'Basu de ikimasu.', meaningVi: 'Đi bằng xe buýt.' },
      { sentence: 'かいしゃで はたらきます。', pronunciation: 'Kaisha de hatarakimasu.', meaningVi: 'Làm việc ở công ty.' },
    ],
    commonMistakes: 'Dùng で cho điểm đến thay vì に/へ (がっこうで いきます là SAI — phải がっこうへ/に いきます, vì いきます cần điểm ĐẾN không phải nơi hành động). Nhầm で(nơi hành động) với に(điểm đến) khi cùng đi với động từ chuyển động.',
    comparedWith: 'So với に: cùng liên quan tới "địa điểm" nhưng に là ĐIỂM ĐẾN (đi tới đâu), で là NƠI HÀNH ĐỘNG DIỄN RA (làm gì ở đâu, sau khi đã ở đó) — hai vai trò không thể hoán đổi.',
  },
  {
    order: 25,
    title: '[C5] へ — trợ từ hướng đi',
    structure: '[nơi đến] + へ + いきます・きます・かえります (へ viết vậy nhưng đọc "e" khi làm trợ từ)',
    explanation: `<p>へ đánh dấu <strong>hướng di chuyển</strong> tới một nơi, luôn đi cùng các động từ chuyển động いきます (đi)、きます (đến)、かえります (về). Giống は, へ cũng bị "đọc khác chữ": viết bằng hiragana へ nhưng trong vai trò trợ từ hướng LUÔN đọc <b>"e"</b>, không phải "he".</p>
<p>へ có thể thay thế bằng に trong hầu hết ngữ cảnh chỉ điểm đến (にほんへ いきます = にほんに いきます), nhưng へ CHỈ có nghĩa "hướng đi", không kiêm được vai trò đánh dấu giờ như に.</p>`,
    examples: [
      { sentence: 'にほんへ いきます。', pronunciation: 'Nihon e ikimasu.', meaningVi: 'Đi đến/về hướng Nhật Bản.' },
      { sentence: 'うちへ かえります。', pronunciation: 'Uchi e kaerimasu.', meaningVi: 'Về nhà.' },
      { sentence: 'せんせいが きょうしつへ きます。', pronunciation: 'Sensei ga kyōshitsu e kimasu.', meaningVi: 'Thầy/cô đến lớp học.' },
    ],
    commonMistakes: 'Đọc へ thành "he" thay vì "e" khi làm trợ từ hướng. Dùng へ cho những vai trò mà chỉ に mới làm được (giờ đồng hồ, hoặc để chỉ nơi nhận/người nhận trong một số mẫu câu N5 sau này).',
    comparedWith: 'So với に: へ chỉ có một vai trò (hướng đi), trong khi に đa năng hơn (thời điểm + điểm đến) — với động từ đi/đến/về, hai trợ từ này dùng thay nhau được.',
  },

  // ══════════════ CHƯƠNG 6 — Động từ thể ます (order 26-31) ══════════════
  {
    order: 26,
    title: '[C6] ます — khẳng định động từ (thể lịch sự)',
    structure: 'gốc động từ + ます (khẳng định, hiện tại/tương lai)',
    explanation: `<p>Mọi câu học từ đầu tới giờ đều dùng です (là/thì). ます là đuôi lịch sự tương ứng cho <strong>động từ hành động</strong> (đi/ăn/uống/học/làm…) — mảng ngữ pháp lớn nhất bị hỏi trong đề thi thật.</p>
<p>Ở trình độ A1.1, hãy coi mỗi động từ thể ます như MỘT MỤC TỪ VỰNG học thuộc nguyên khối (いきます, たべます, かいます…), giống hệt cách bạn học câu です — quy tắc chia động từ sâu hơn theo nhóm 1/2/3 (đổi từ dạng từ điển sang thể ます) sẽ học ở trình độ N5/N4.</p>`,
    examples: [
      { sentence: 'まいにち べんきょうします。', pronunciation: 'Mainichi benkyō shimasu.', meaningVi: 'Tôi học mỗi ngày.' },
      { sentence: 'あさごはんを たべます。', pronunciation: 'Asagohan o tabemasu.', meaningVi: 'Ăn bữa sáng.' },
      { sentence: 'がっこうへ いきます。', pronunciation: 'Gakkō e ikimasu.', meaningVi: 'Đi đến trường.' },
    ],
    commonMistakes: 'Dùng です cho hành động thay vì ます (たべますです là SAI, chỉ たべます là đủ, vì ます tự nó đã là đuôi lịch sự hoàn chỉnh, không cần thêm です). Quên rằng động từ luôn đứng CUỐI câu (sau khi đã có を/に/で/へ đánh dấu các thành phần khác).',
    comparedWith: 'So với です: です dùng cho câu "N là/thì gì đó" (danh từ/tính từ), ます dùng cho câu có HÀNH ĐỘNG (động từ) — hai hệ thống song song, không trộn lẫn.',
  },
  {
    order: 27,
    title: '[C6] ません — phủ định động từ',
    structure: 'gốc động từ + ません (phủ định của ます)',
    explanation: `<p>ません là dạng phủ định của ます — thay đuôi ます bằng ません để nói "không làm gì đó". Đây là quy tắc đơn giản, đều đặn cho MỌI động từ ở thể ます, không có ngoại lệ.</p>
<p><span class="badge">Đừng nhầm</span> ません (phủ định ĐỘNG TỪ) hoàn toàn khác ではありません/じゃないです (phủ định です, dùng cho danh từ/tính từ) — hai cặp khẳng định/phủ định này gắn vào hai LOẠI TỪ khác nhau, không thể hoán đổi.</p>`,
    examples: [
      { sentence: 'あさごはんを たべません。', pronunciation: 'Asagohan o tabemasen.', meaningVi: 'Không ăn bữa sáng.' },
      { sentence: 'にほんごを べんきょうしません。', pronunciation: 'Nihongo o benkyō shimasen.', meaningVi: 'Không học tiếng Nhật.' },
      { sentence: 'あした がっこうへ いきません。', pronunciation: 'Ashita gakkō e ikimasen.', meaningVi: 'Ngày mai không đi học.' },
    ],
    commonMistakes: 'Dùng じゃないです cho động từ (たべますじゃないです là SAI) — động từ chỉ phủ định bằng ません, không bao giờ dùng cấu trúc phủ định của です.',
    comparedWith: 'So với ではありません/じゃないです (phủ định です đã học ở Chương 4): ません chỉ dùng cho ĐỘNG TỪ ở thể ます; ではありません/じゃないです chỉ dùng cho DANH TỪ/TÍNH TỪ ở thể です. Nhìn từ ngay trước để biết dùng cặp nào.',
  },
  {
    order: 28,
    title: '[C6] ますか — câu hỏi với động từ',
    structure: '[động từ thể ます] + か。(giữ nguyên trật tự từ, giống quy tắc か đã học ở Chương 4)',
    explanation: `<p>Quy tắc か học ở Chương 4 (thêm か vào cuối câu です để hỏi) áp dụng NGUYÊN VẸN cho câu động từ ます — chỉ cần thêm か vào cuối một câu ます đã hoàn chỉnh, không đổi trật tự từ, không cần công thức mới.</p>`,
    examples: [
      { sentence: 'あさごはんを たべますか。', pronunciation: 'Asagohan o tabemasu ka.', meaningVi: 'Bạn có ăn sáng không?' },
      { sentence: 'はい、たべます。／いいえ、たべません。', pronunciation: 'Hai, tabemasu. / Iie, tabemasen.', meaningVi: 'Có, tôi ăn. / Không, tôi không ăn.' },
      { sentence: 'にほんごを べんきょうしますか。― はい、べんきょうします。', pronunciation: 'Nihongo o benkyō shimasu ka. — Hai, benkyō shimasu.', meaningVi: 'Bạn có học tiếng Nhật không? — Có, tôi học.' },
    ],
    commonMistakes: 'Nghĩ câu hỏi động từ cần một công thức riêng khác với です・か — thực chất chỉ cần áp dụng lại đúng quy tắc "thêm か, giữ nguyên trật tự" đã học ở Chương 4, không có gì mới phải học thêm.',
    comparedWith: '',
  },
  {
    order: 29,
    title: '[C6] します／きます — động từ nhóm 3 bất quy tắc',
    structure: 'します(làm) / きます(đến) — bất quy tắc; [danh từ] + します = "làm [danh từ]"',
    explanation: `<p>します và きます là hai động từ <strong>bất quy tắc nhóm 3</strong> duy nhất trong tiếng Nhật (mọi động từ khác thuộc nhóm 1 hoặc nhóm 2 với quy tắc chia riêng, học ở N5). Ở A1.1 chỉ cần nhớ mặt chữ và cách dùng, chưa cần hiểu vì sao chúng "bất quy tắc".</p>
<p>Vai trò quan trọng nhất của します ở trình độ này: ghép với BẤT KỲ danh từ nào để tạo động từ mới, theo công thức <b>[danh từ] + します = "làm [danh từ đó]"</b>. Đây là cách tiếng Nhật liên tục tạo động từ mới từ danh từ (đặc biệt là từ Hán-Nhật và từ mượn).</p>`,
    examples: [
      { sentence: 'べんきょうします。', pronunciation: 'Benkyō shimasu.', meaningVi: 'Học (nghĩa đen: làm việc-học).' },
      { sentence: 'うんてんします。', pronunciation: 'Unten shimasu.', meaningVi: 'Lái xe (làm việc-lái xe).' },
      { sentence: 'せんせいが きょうしつに きます。', pronunciation: 'Sensei ga kyōshitsu ni kimasu.', meaningVi: 'Thầy/cô đến lớp học.' },
    ],
    commonMistakes: 'Chia します/きます theo quy tắc động từ nhóm 1 thông thường (đổi đuôi い→ない,ます theo mẫu chung) — hai động từ này BẤT QUY TẮC, phải học thuộc riêng từng thể, không suy luận theo quy tắc nhóm 1/2.',
    comparedWith: '',
  },
  {
    order: 30,
    title: '[C6] Hiện tại = cả tương lai (không có thì tương lai riêng)',
    structure: 'まいにち/いつも + ます (thói quen) — cùng dạng ます dùng cho あした/らいしゅう (tương lai)',
    explanation: `<p>Thể ます phủ CẢ hai ý nghĩa: hành động lặp lại theo thói quen (hiện tại đơn) VÀ hành động sẽ xảy ra trong tương lai — tiếng Nhật <strong>không có thì tương lai riêng biệt</strong> như "will" trong tiếng Anh.</p>
<p>Cách phân biệt đang nói về thói quen hay tương lai hoàn toàn dựa vào <b>trạng từ chỉ thời gian</b> đi kèm trong câu (まいにち=mỗi ngày, いつも=luôn luôn → thói quen; あした=ngày mai, らいしゅう=tuần sau → tương lai), KHÔNG dựa vào việc chia động từ.</p>`,
    examples: [
      { sentence: 'まいにち べんきょうします。', pronunciation: 'Mainichi benkyō shimasu.', meaningVi: 'Tôi học mỗi ngày. (thói quen)' },
      { sentence: 'あした べんきょうします。', pronunciation: 'Ashita benkyō shimasu.', meaningVi: 'Ngày mai tôi sẽ học. (tương lai — CÙNG một dạng động từ)' },
    ],
    commonMistakes: 'Tìm một dạng chia động từ riêng cho "tương lai" giống tiếng Anh (will + V) — tiếng Nhật KHÔNG có, luôn dùng chung thể ます, chỉ đổi trạng từ thời gian trong câu.',
    comparedWith: '',
  },
  {
    order: 31,
    title: '[C6] Bảng động từ + trợ từ theo tần suất đề thi thật',
    structure: 'いきます[nơi]へ/に · たべます[món]を · かいます[vật]を · べんきょうします[môn]を · おきます[giờ]に · はたらきます[nơi]で',
    explanation: `<p>Đếm được từ 420 câu đề FE thật đã khảo sát — đây chính xác là nơi nên dành thời gian học thuộc nhất, xếp theo tần suất xuất hiện. Điều quan trọng: học mỗi động từ <strong>CÙNG VỚI</strong> trợ từ nó thường đi kèm, vì câu điền chỗ trống trợ từ luôn ghép một động từ trong bảng dưới với trợ từ SAI làm phương án gây nhiễu.</p>
<table><thead><tr><th>Động từ</th><th>Nghĩa</th><th>Trợ từ đi kèm</th><th>Số lần trong đề</th></tr></thead><tbody>
<tr><td>いきます</td><td>đi</td><td>[nơi]へ/に</td><td>43</td></tr>
<tr><td>たべます</td><td>ăn</td><td>[món]を</td><td>29</td></tr>
<tr><td>かいます</td><td>mua</td><td>[vật]を</td><td>23</td></tr>
<tr><td>べんきょうします</td><td>học</td><td>[môn]を</td><td>18</td></tr>
<tr><td>よみます</td><td>đọc</td><td>[vật]を</td><td>14</td></tr>
<tr><td>おきます</td><td>dậy</td><td>[giờ]に</td><td>13</td></tr>
<tr><td>ききます</td><td>nghe/hỏi</td><td>[vật]を</td><td>12</td></tr>
<tr><td>はたらきます</td><td>làm việc</td><td>[nơi]で</td><td>11</td></tr>
<tr><td>のみます</td><td>uống</td><td>[vật]を</td><td>10</td></tr>
<tr><td>かえります</td><td>về nhà</td><td>[nơi]へ/に</td><td>6</td></tr>
</tbody></table>`,
    examples: [
      { sentence: 'まいあさ 7時に おきます。がっこうへ いきます。', pronunciation: 'Maiasa shichiji ni okimasu. Gakkō e ikimasu.', meaningVi: 'Mỗi sáng tôi dậy lúc 7 giờ. Tôi đi đến trường.' },
      { sentence: 'としょかんで べんきょうします。ひるごはんを たべます。', pronunciation: 'Toshokan de benkyō shimasu. Hirugohan o tabemasu.', meaningVi: 'Tôi học ở thư viện. Tôi ăn trưa.' },
      { sentence: 'がっこうを いきます。(SAI) → がっこうへ いきます。(ĐÚNG)', pronunciation: '', meaningVi: 'を không bao giờ đánh dấu điểm đến — bẫy gây nhiễu phổ biến nhất trong đề trắc nghiệm.' },
    ],
    commonMistakes: 'Học động từ RIÊNG LẺ mà không học kèm trợ từ — đề thi luôn kiểm tra CẶP động từ+trợ từ, không phải nghĩa động từ đơn thuần. Nhầm trợ từ giữa các động từ có cùng "họ" (いきます/かえります dùng へ/に, nhưng はたらきます lại dùng で vì là nơi hành động chứ không phải điểm đến).',
    comparedWith: 'Xem lại các trợ từ を/に/で/へ ở Chương 5 (mục [C5]) trước khi học bảng này — bảng này chính là ứng dụng thực tế của bốn trợ từ đó vào 10 động từ hay gặp nhất đề thi.',
  },
];
