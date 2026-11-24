/**
 * IELTS Tập 5 — Ngày 17 (band 7.0 → 8.0; tự soạn 24/11/2026 — mọi câu ví dụ, bài đọc, kịch bản nghe, câu bài tập VIẾT MỚI)
 * 🔬 NGÀY MỔ READING ĐỀ 10 (docs/ielts-lo-trinh-0-8.md mục 3.5; khuôn N mod 4 = 1 ⇒ grammar · reading · LISTENING).
 *   Bài 1 (grammar)   Chuỗi lỗi 7 → 8: mạo từ, số nhiều, giới từ, dấu phẩy — vòng 3 [G04 G10 G11 G43]. Chỉ dạy phần vòng 2
 *                     (Tập 3 Ngày 27 · Tập 5 Ngày 3) CHƯA phủ: bảy tình huống mạo từ khó, danh từ không đếm được / hai nghĩa /
 *                     mười khuôn số, giới từ của con số · to + V-ing · giới từ + which, sáu luật dấu phẩy; lượt soát 4 phút
 *                     theo danh từ + đoạn 14 lỗi biết trước số lượng (số liệu trong đoạn là hư cấu).
 *   Bài 2 (reading)   Mổ Reading Đề 10 [R18] — đọc `thi-may/de/doc-de10.ts`, chỉ TRÍCH NGẮN chỗ cần mổ, không chép đề: thang
 *                     4 mức paraphrase với 12 cặp của đề, ba bẫy lặp lại (so sánh đảo chiều · phạm vi bị nới · phê bình ≠ phủ
 *                     nhận), luyện lại bằng câu MỚI (3 bộ mcq đoạn ngắn hư cấu) + bài mới "The Line on the Hull" (~950 từ, vạch
 *                     Plimsoll; 14 câu TFNG · Short answer · Summary hộp từ). DỮ KIỆN Plimsoll soạn theo trí nhớ (Hall đề xuất
 *                     trước, Our Seamen 1873, luật 1876 chưa định vị trí vạch, 1890 mới định, công ước 1930) — CHƯA mở nguồn
 *                     đối chiếu; bài có ghi chú "đừng dùng làm tài liệu tra cứu".
 *   Bài 3 (listening) NỘI DUNG MỚI, không mổ đề: Part 2 người kể về một sự kiện ở một nơi chốn (cuộc đua bè Tallow Creek — hư
 *                     cấu, giọng Úc, ~590 từ ≈ 175 wpm) + Practice 1 (cầu tàu Kereru Bay, giọng New Zealand) + Practice 3 trao
 *                     đổi hai người (Ireland · Canada). Bảng 3.5 ghi ô này là 🗣 "Part 2 nơi chốn / sự kiện band 8 + Part 3 nối
 *                     [S05 S06] 🔊 ngữ điệu kể chuyện band 8 [S15]"; khuôn buộc là bài Nghe ⇒ dạy theo lối Ngày 13: nghe người
 *                     bản ngữ kể → mượn khung để nói (band 7 và band 8 cạnh nhau, 3 khối speak) + khối phatam ngữ điệu kể chuyện.
 *   Bài tập            49 câu có đáp án + 1 essay + 2 speak (bài đọc "The Door Nobody Uses", bài nghe giọng Mỹ — đều hư cấu).
 * Đã grep tap-3…tap-5/ngay + thi-may/de trước khi chọn đề tài: Plimsoll, load line, revolving door, raft race, county fair,
 * Kereru = 0 kết quả. Thẻ Part 2 mới (annual event attended more than once · a place that looks different at night · a place
 * where you had to wait · a market or street from childhood) không trùng thẻ nào của Tập 3–5 và Đề 0–12.
 */
import type { Lesson } from '../data';

export const NGAY_17: Lesson[] = [
  /* ════════════════ BÀI 1 — NGỮ PHÁP ════════════════ */
  {
    id: "t5d17-ngu-phap",
    kind: "grammar",
    title: "Ngữ pháp: Chuỗi lỗi 7 → 8 — mạo từ, số nhiều, giới từ, dấu phẩy (vòng 3) và lượt soát theo danh từ",
    goal: "Hạ số câu có lỗi trong một bài Task 2 xuống còn 0–2 câu (mô tả GRA band 8: đa số câu không lỗi) bằng cách bắt đúng bốn loại lỗi nhỏ còn sót ở band 7 — mạo từ ở sáu tình huống khó, số ít / số nhiều của danh từ không đếm được và danh từ hai nghĩa, giới từ đi với con số, to + V-ing và giới từ + which, sáu luật dấu phẩy — rồi soát cả bài trong 4 phút theo bốn lượt bắt đầu từ danh từ.",
    minutes: 100,
    blocks: [
      {
        t: "recap", title: "Bài này học gì · đẩy tiêu chí nào",
        items: [
          "Đẩy **Grammatical Range & Accuracy** của Writing từ 7 lên 8. Band 7: ==frequent error-free sentences==. Band 8: ==the majority of sentences are error-free==, chỉ còn lỗi rất lẻ tẻ. Khác nhau không ở cấu trúc khó, mà ở **số câu sạch**.",
          "Bốn loại lỗi hôm nay là lỗi **nhỏ nhưng dày**: mạo từ, số nhiều, giới từ, dấu phẩy. Chúng hay đi thành ==chuỗi==: chọn sai một danh từ (researches) kéo theo sai mạo từ, sai động từ, sai đại từ.",
          "Đây là **vòng 3**. Vòng 1: Tập 2 (mạo từ, số nhiều, giới từ cơ bản). Vòng 2: Tập 3 Ngày 27 (bảng tự soát 6 lượt) và Tập 5 Ngày 3 (bốn câu hỏi mạo từ, giới từ sau danh – động – tính từ). Hôm nay chỉ dạy phần hai vòng trước ==chưa phủ==.",
          "Mỗi mục: bảng → lỗi người Việt hay mắc → công thức 1 dòng → bài dịch. Mục 6 gom lại thành **lượt soát 4 phút theo danh từ** và một đoạn văn 14 lỗi biết trước số lượng.",
          "Ngày 19 học tiếp dấu câu còn lại (chấm phẩy, hai chấm, gạch ngang). Ngày 23 dùng lượt soát hôm nay trong bảng tự soát 6 lượt lần 3.",
        ],
      },

      { t: "h", text: "1. Vì sao gọi là “chuỗi lỗi” — và band 8 đếm lỗi thế nào" },
      { t: "p", text: "Một bài Task 2 dài 280 từ có khoảng 14–16 câu. Giám khảo không đếm từng lỗi; họ ước lượng ==bao nhiêu câu sạch==. Bài band 7 thường có 5–6 câu dính lỗi nhỏ. Bài band 8 chỉ còn 1–2 câu. Vậy việc của bạn không phải là học thêm cấu trúc, mà là xoá 4 câu lỗi." },
      {
        t: "table", caption: "Một quyết định sai về danh từ kéo theo ba lỗi",
        head: ["Câu band 7", "Lỗi gốc", "Lỗi kéo theo", "Câu sạch"],
        rows: [
          ["~~Many researches show that they are reliable.~~", "research không đếm được", "many → much · show → shows · they → it", "Much research shows that it is reliable."],
          ["~~The unemployment are a serious problem for the youth people.~~", "unemployment: nói chung, không đếm được", "the thừa · are → is · the youth people → young people", "Unemployment is a serious problem for young people."],
          ["~~One of the reason, is the lack of informations.~~", "one of the + số nhiều", "reason → reasons · dấu phẩy tách chủ – vị · informations → information", "One of the reasons is the lack of information."],
        ],
      },
      {
        t: "table", caption: "Bốn loại lỗi — vì sao người Việt mắc, và học ở mục nào",
        head: ["Loại", "Gốc rễ", "Mục"],
        rows: [
          ["Mạo từ", "tiếng Việt không có mạo từ; ta quyết định theo cảm giác “nghe quen”", "2"],
          ["Số ít / số nhiều", "tiếng Việt không biến hình danh từ; “nghiên cứu, thông tin, bằng chứng” đếm được trong tiếng Việt", "3"],
          ["Giới từ", "dịch từng chữ: “tăng lên 5%”, “đầu tư vào”, “đóng góp cho”", "4"],
          ["Dấu phẩy", "tiếng Việt cho phép nối hai câu bằng dấu phẩy; tiếng Anh thì không", "5"],
        ],
      },
      {
        t: "quiz", id: "t5d17-on-dau-bai", kind: "fill",
        title: "Kiểm tra đầu bài — ôn Tập 5 Ngày 3 (6 câu). Gõ lại phần [trong ngoặc] cho đúng",
        items: [
          { q: "1. The quality of the lessons [depend] on the teacher.", answers: ["depends"], hint: "Danh từ chính là quality (số ít) — Ngày 3 mục 2." },
          { q: "2. A number of students [has] complained about the timetable.", answers: ["have"], hint: "a number of + số nhiều + V số nhiều — Ngày 3 mục 3." },
          { q: "3. She plays [a] important role in the project.", answers: ["an"], hint: "an trước nguyên âm — Ngày 3 mục 4." },
          { q: "4. There has been a sharp increase [of] the price of fuel. (thứ tăng là giá)", answers: ["in"], hint: "an increase IN + thứ thay đổi — Ngày 3 mục 5." },
          { q: "5. We need to discuss [about] the budget.", answers: ["discuss"], hint: "discuss + tân ngữ, không giới từ — Ngày 3 mục 6. Gõ lại: discuss" },
          { q: "6. Many people are not aware [about] the risks.", answers: ["of"], hint: "aware OF — Ngày 3 mục 6." },
        ],
      },
      { t: "p", text: "Đúng 5–6 câu: nền vòng 2 đã ổn, học thẳng mục 2. Sai từ 2 câu: mở lại **Tập 5 Ngày 3** (Bài 1 mục 2–6) trong 15 phút rồi quay lại." },
      { t: "rule", formula: "band 8  =  14–16 câu, tối đa 1–2 câu có lỗi nhỏ", vi: "Mỗi danh từ là một cửa ra của bốn lỗi: mạo từ → số → động từ → giới từ. Soát từ danh từ." },

      { t: "h", text: "2. Mạo từ vòng 3 — bảy tình huống band 7 còn sai" },
      { t: "p", text: "Ngày 3 cho bạn bốn câu hỏi theo thứ tự (đếm được? một hay nhiều? người đọc biết cái nào chưa? có phải cụm cố định?). Bốn câu hỏi ấy xử lý được khoảng 80 % trường hợp. Bảy tình huống dưới đây là phần còn lại." },
      {
        t: "table",
        head: ["Tình huống", "Luật", "Sai", "Đúng"],
        rows: [
          ["① Nói chung về cả loại", "Ø + số nhiều / Ø + không đếm được. Không dùng the.", "~~The technology has changed the society.~~", "Technology has changed society."],
          ["② Cả loại, bằng the + số ít", "chỉ dùng cho phát minh, nhạc cụ, loài vật — văn trang trọng", "~~A smartphone has changed how we read.~~ (nghe như một chiếc)", "The smartphone has changed how we read."],
          ["③ N + of + N", "cụm of làm danh từ xác định ⇒ the. Nhưng a/an khi là MỘT lượng / MỘT lần", "~~Rise of online shopping~~ · ~~the rise of 5 %~~", "the rise of online shopping · a rise of 5 %"],
          ["④ Danh từ trừu tượng + tính từ", "thêm tính từ / of-phrase thì nhiều danh từ nhận a/an", "~~Children need good education.~~", "Children need a good education. · a thorough knowledge of law"],
          ["⑤ the + tính từ", "= cả nhóm người; động từ số nhiều; không thêm people, không thêm -s", "~~the elderlies~~ · ~~the unemployed people is~~", "the elderly are · the unemployed need"],
          ["⑥ Cơ sở theo chức năng", "Ø khi nói việc đi học, nằm viện, ở tù; the khi nói toà nhà / tổ chức cụ thể", "~~go to the university~~ (đi học đại học)", "go to university · The university has raised its fees."],
          ["⑦ most", "most + N (nói chung) · most of the + N (nhóm đã biết) · the most + adj (so sánh nhất)", "~~the most people~~ · ~~most of people~~", "most people · most of the participants · the most common reason"],
        ],
      },
      {
        t: "table", caption: "Hai danh sách phải thuộc — danh từ “một mình” của xã hội và tự nhiên",
        head: ["Luôn KHÔNG có the (nghĩa chung)", "Luôn CÓ the"],
        rows: [
          ["society · nature · space (vũ trụ) · humanity · mankind", "the environment · the economy · the government · the state"],
          ["public opinion · human nature · modern life · everyday life", "the public · the media · the press · the internet"],
          ["unemployment · poverty · crime · inflation · globalisation", "the countryside · the climate · the weather · the future · the past"],
          ["in recent years · in future (UK) · at present · in practice · in theory", "in the 1990s · in the long term · in the short term · on the whole"],
        ],
      },
      {
        t: "patterns",
        rows: [
          { formula: "the + N + of + N  (cái đã xác định)", vi: "Cụm of trả lời “cái nào?” ⇒ the.", examples: [{ en: "The cost of housing has doubled; the role of the state is being questioned.", vi: "Chi phí nhà ở đã tăng gấp đôi; vai trò của nhà nước đang bị đặt câu hỏi." }] },
          { formula: "a / an + N + of + số lượng", vi: "Một lượng, một mức, một lần ⇒ a/an.", examples: [{ en: "There was a fall of 12 per cent, followed by a period of stability.", vi: "Có một mức giảm 12 %, tiếp theo là một giai đoạn ổn định." }] },
          { formula: "a / an + adj + N trừu tượng (education, knowledge, understanding, awareness, impact, effect, influence)", vi: "Có tính từ đứng trước thì nhóm danh từ này đếm được như “một loại”.", examples: [{ en: "The scheme had a lasting impact and created a growing awareness of the problem.", vi: "Chương trình có tác động lâu dài và tạo ra nhận thức ngày càng tăng về vấn đề." }] },
          { formula: "S + V. The + bộ phận / hệ quả của nó + V  (the “bắc cầu”)", vi: "Lần đầu nhắc nhưng người đọc suy ra được từ danh từ trước ⇒ the.", examples: [{ en: "The council built a new library. The roof alone cost two million pounds.", vi: "Hội đồng xây một thư viện mới. Riêng phần mái đã tốn hai triệu bảng." }] },
        ],
      },
      {
        t: "note", title: "⚠️ Hay sai — tám lỗi mạo từ của người Việt ở band 7",
        items: [
          "~~the nature~~ · ~~the society~~ · ~~the life~~ khi nói chung. Thêm the là thành “thiên nhiên đó”, “xã hội đó”.",
          "~~in the recent years~~ → **in recent years**. Nhưng: in the last few years · in the past decade.",
          "~~in the 2020~~ → **in 2020**. Thập kỷ mới có the: in the 2020s.",
          "~~the most of~~ · ~~most of people~~ → **most people** / **most of the people in the survey**.",
          "~~an advice · a research · an evidence · a progress · a feedback~~: năm danh từ này ==không bao giờ== nhận a/an, kể cả khi có tính từ (~~a good advice~~).",
          "~~The Vietnam~~ · ~~the Hanoi~~. Chỉ tên nước có chữ chung mới có the: the United Kingdom, the Netherlands, the Philippines.",
          "Bỏ the trước same, first, only, next, following: ~~at same time~~ → at **the** same time.",
          "~~the youth people~~ → **young people** (nói chung) hoặc **the young** (cả nhóm, trang trọng).",
        ],
      },
      { t: "rule", formula: "nói chung: Ø + N số nhiều / N không đếm được   ·   the + N + of + N   ·   a / an + adj + N trừu tượng   ·   the + adj = cả nhóm", vi: "Trước khi viết the, hỏi: người đọc có chỉ ra được ĐÚNG cái nào không? Không ⇒ bỏ the." },
      {
        t: "quiz", id: "t5d17-mao-tu-dich", kind: "translate", grammar: "Ø + N nói chung · the + N + of + N · a/an + adj + N trừu tượng · the + adj",
        title: "Dịch sang tiếng Anh — mạo từ vòng 3 (5 câu)",
        items: [
          { q: "Công nghệ đã thay đổi cách xã hội giao tiếp.", answers: ["Technology has changed the way society communicates.", "Technology has changed the way in which society communicates.", "Technology has changed how society communicates."], hint: "technology · society — không the; the way" },
          { q: "Sự gia tăng của mua sắm trực tuyến đã dẫn đến một mức giảm 15 % trong số cửa hàng.", answers: ["The rise of online shopping has led to a fall of 15 per cent in the number of shops.", "The rise of online shopping has led to a fall of 15% in the number of shops.", "The rise of online shopping has led to a 15 per cent fall in the number of shops.", "The rise of online shopping has led to a 15% fall in the number of shops."], hint: "the rise of · a fall of · the number of" },
          { q: "Người cao tuổi cần một sự hiểu biết tốt hơn về công nghệ số.", answers: ["The elderly need a better understanding of digital technology.", "Elderly people need a better understanding of digital technology.", "Older people need a better understanding of digital technology."], hint: "the elderly + V số nhiều · a better understanding of" },
          { q: "Hầu hết mọi người đồng ý rằng thất nghiệp là vấn đề nghiêm trọng nhất.", answers: ["Most people agree that unemployment is the most serious problem.", "Most people agree unemployment is the most serious problem."], hint: "most people · unemployment · the most serious" },
          { q: "Trong những năm gần đây, nhiều người trẻ đã chọn không học đại học.", answers: ["In recent years, many young people have chosen not to go to university.", "In recent years many young people have chosen not to go to university."], hint: "in recent years · young people · go to university" },
        ],
      },

      { t: "h", text: "3. Số ít / số nhiều vòng 3 — danh từ không đếm được, danh từ hai nghĩa, mười khuôn bắt buộc" },
      {
        t: "table", caption: "① 20 danh từ KHÔNG đếm được mà người Việt hay thêm -s",
        head: ["Nhóm", "Danh từ (không -s, không a/an, động từ số ít)", "Muốn đếm thì nói"],
        rows: [
          ["Tri thức", "research · evidence · information · knowledge · advice · feedback · news", "a study · a piece of evidence · a piece of advice · a news item"],
          ["Vật dụng, hệ thống", "equipment · machinery · furniture · software · infrastructure · luggage", "a piece of equipment · a machine · a program / an app"],
          ["Hoạt động xã hội", "traffic · pollution · employment · legislation · progress · homework · accommodation", "a law · a job · an assignment · a place to stay"],
          ["Con người", "staff (cả đội ngũ) · behaviour (thường không đếm)", "a member of staff · three employees"],
        ],
      },
      {
        t: "table", caption: "② Danh từ hai nghĩa — đếm được hay không tuỳ nghĩa",
        head: ["Danh từ", "Không đếm được", "Đếm được"],
        rows: [
          ["experience", "kinh nghiệm: She has little experience of teaching.", "trải nghiệm: Travel gave me many memorable experiences."],
          ["work", "công việc: There is too much work.", "tác phẩm, công trình: the works of Nguyễn Du · road works"],
          ["time", "thời gian: Children spend too much time online.", "lần, thời kỳ: three times a week · in ancient times"],
          ["business", "việc kinh doanh: Business is slow in winter.", "doanh nghiệp: Small businesses create most jobs."],
          ["technology", "công nghệ nói chung: Technology saves time.", "từng loại công nghệ: new technologies such as AI"],
          ["industry", "ngành sản xuất nói chung: Industry needs cheap energy.", "từng ngành: the tourism and film industries"],
          ["competition", "sự cạnh tranh: Competition lowers prices.", "cuộc thi: She won two competitions."],
          ["paper", "giấy: a sheet of paper", "bài báo khoa học, tờ báo: She has published three papers."],
        ],
      },
      {
        t: "table", caption: "③ Mười khuôn bắt buộc số — viết sai là lộ ngay",
        head: ["Khuôn", "Ví dụ", "Sai hay gặp"],
        rows: [
          ["one of the + N **số nhiều** + V **số ít**", "One of the main causes is poor planning.", "~~one of the main cause are~~"],
          ["each / every + N **số ít** + V số ít", "Every student has a tutor.", "~~every students have~~"],
          ["each of the + N **số nhiều** + V **số ít**", "Each of the proposals has a weakness.", "~~each of the proposal have~~"],
          ["a variety / range / number of + N **số nhiều** + V số nhiều", "A range of measures have been introduced.", "~~a range of measure~~"],
          ["the number of + N số nhiều + V **số ít**", "The number of visitors has fallen.", "~~the number of visitor have~~"],
          ["kinds / types / forms of + N (số nhiều hoặc không đếm được)", "different types of pollution · many kinds of jobs", "~~many kind of job~~"],
          ["another + số ít · other + số nhiều · others (đứng một mình)", "another reason · other reasons · Others disagree.", "~~another reasons~~ · ~~others people~~"],
          ["số + danh từ làm TÍNH TỪ: không -s, có gạch nối", "a five-year plan · a two-hour delay · a 20-per-cent rise", "~~a five-years plan~~"],
          ["số + million / thousand (không -s) · millions of (không số)", "5 million people · millions of people", "~~5 millions people~~ · ~~5 million of people~~"],
          ["per cent: không bao giờ -s · percentage: danh từ", "40 per cent of adults · a small percentage of adults", "~~40 per cents~~ · ~~a small per cent~~"],
        ],
      },
      {
        t: "note", title: "⚠️ Cẩn thận — bốn bẫy số nhiều ở Task 2",
        items: [
          "Nói chung về một loại người / vật ⇒ dùng ==số nhiều không mạo từ==: **Children need** rules. Không viết ~~Child needs~~ hay ~~The child needs~~ (trừ văn rất trang trọng).",
          "**people** đã là số nhiều: ~~peoples~~ chỉ đúng khi nghĩa là “các dân tộc”. **person → people**; persons chỉ dùng trong văn bản pháp lý.",
          "Danh từ sau **many / several / various / numerous / a few** phải số nhiều; sau **much / little / a great deal of / a large amount of** phải không đếm được. ~~a large amount of people~~ → a large **number** of people.",
          "Số nhiều gốc Latin (data, criteria, phenomena, media) đã học ở **Ngày 12 Bài 1**. Trong Task 2: **criteria are** · **a criterion is** · **the media are / is** đều được, miễn nhất quán.",
        ],
      },
      { t: "rule", formula: "N không đếm được: không -s · không a/an · V số ít · much / little / a piece of      |      one of the + N số nhiều + V số ít", vi: "Gặp danh từ trừu tượng, hỏi: tiếng Anh có nói “two …s” được không? Không ⇒ giữ số ít, đổi many thành much." },
      {
        t: "quiz", id: "t5d17-so-nhieu-dich", kind: "translate", grammar: "N không đếm được · one of the + N số nhiều + V số ít · số + N làm tính từ",
        title: "Dịch sang tiếng Anh — số ít / số nhiều (5 câu)",
        items: [
          { q: "Nhiều nghiên cứu cho thấy lời khuyên này hữu ích. (dùng research)", answers: ["Much research shows that this advice is useful.", "A great deal of research shows that this advice is useful.", "A lot of research shows that this advice is useful.", "Much research shows this advice is useful."], hint: "much research + shows · advice is" },
          { q: "Một trong những lý do chính là thiếu bằng chứng.", answers: ["One of the main reasons is the lack of evidence.", "One of the main reasons is a lack of evidence.", "One of the main reasons is lack of evidence."], hint: "one of the main reasons + is · evidence" },
          { q: "Chính phủ đã công bố một kế hoạch 5 năm trị giá 3 triệu đô la.", answers: ["The government has announced a five-year plan worth 3 million dollars.", "The government has announced a five-year plan worth three million dollars.", "The government has announced a five-year, three-million-dollar plan.", "The government announced a five-year plan worth 3 million dollars."], hint: "a five-year plan · 3 million dollars" },
          { q: "Mỗi đề xuất trong số này đều có một điểm yếu.", answers: ["Each of these proposals has a weakness.", "Each of the proposals has a weakness.", "Each of these proposals has one weakness."], hint: "each of these proposals + has" },
          { q: "Các doanh nghiệp nhỏ cần thiết bị tốt hơn và nhân viên có kinh nghiệm.", answers: ["Small businesses need better equipment and experienced staff.", "Small businesses need better equipment and staff with experience."], hint: "businesses · equipment · staff — hai từ sau không -s" },
        ],
      },

      { t: "h", text: "4. Giới từ vòng 3 — ba vùng Ngày 3 chưa phủ" },
      { t: "p", text: "Ngày 3 đã dạy giới từ sau danh từ (a rise in, a solution to), sau động từ và tính từ (depend on, aware of), và nhóm động từ không có giới từ (discuss, emphasise). Còn ba vùng: ==giới từ đi với con số== trong Task 1, ==to + V-ing==, và ==giới từ + which==." },
      {
        t: "table", caption: "Vùng ① — giới từ của con số (Task 1)",
        head: ["Giới từ", "Dùng cho", "Ví dụ", "Sai hay gặp"],
        rows: [
          ["**in**", "thứ thay đổi", "a rise in car ownership", "~~a rise of car ownership~~"],
          ["**of**", "mức thay đổi (sau danh từ) · giá trị của đỉnh", "a rise of 5 % · a peak of 80 million", "~~a rise by 5 %~~"],
          ["**by**", "mức thay đổi (sau động từ)", "rose by 5 % · fell by a third", "~~rose with 5 %~~ · ~~rose 5 % up~~"],
          ["**to**", "điểm đến", "rose to 45 % · a fall to 1,200", "~~rose until 45 %~~"],
          ["**at**", "mức đứng yên, đỉnh, đáy", "stood at 30 % · peaked at 80 · remained stable at · levelled off at", "~~stood in 30 %~~ · ~~peaked in 80~~"],
          ["**from … to … / between … and …**", "khoảng", "from 10 % to 25 % · between 2010 and 2020", "~~between 2010 to 2020~~ · ~~from 2010 and 2020~~"],
          ["**over / during / throughout**", "cả giai đoạn", "over the period · throughout the decade", "~~in the whole period~~"],
          ["**for**", "account for · chiếm", "Coal accounted for 40 % of output.", "~~accounted 40 %~~ · ~~occupied 40 %~~"],
          ["**as … as**", "bội số", "twice as high as · three times as many … as", "~~twice higher than~~ (không chuẩn trong văn viết)"],
        ],
      },
      {
        t: "table", caption: "by hay until · in hay on · for hay since — bốn cặp thời gian",
        head: ["Cặp", "Khác nhau", "Ví dụ"],
        rows: [
          ["by 2030 · until 2030", "by = không muộn hơn (một mốc) · until = kéo dài tới (cả quãng)", "The figure is expected to double by 2030. · Sales remained flat until 2015."],
          ["in · on · at", "in + năm, tháng, thập kỷ · on + ngày · at + giờ, the end / the beginning", "in 2010 · on 3 May · at the end of the period"],
          ["for · since", "for + quãng · since + mốc (đi với hoàn thành)", "has risen for five years · has risen since 2019"],
          ["during · while", "during + danh từ · while + mệnh đề", "during the pandemic · while the survey was being carried out"],
        ],
      },
      {
        t: "table", caption: "Vùng ② — to là GIỚI TỪ ⇒ theo sau là V-ing / danh từ",
        head: ["Nhóm", "Cụm", "Ví dụ"],
        rows: [
          ["Động từ", "contribute to · lead to · object to · adapt to · adjust to · resort to · amount to", "Subsidies contribute to keeping prices low."],
          ["be + tính từ / V3", "be used to · be accustomed to · be committed to · be dedicated to · be opposed to · be key to · be central to", "The city is committed to reducing emissions."],
          ["Danh từ", "an alternative to · an obstacle to · an approach to · a barrier to · a commitment to", "There are several obstacles to building new homes."],
          ["Cụm cố định", "look forward to · with a view to · when it comes to · in addition to · as opposed to", "Roads were widened with a view to easing congestion."],
        ],
      },
      {
        t: "note", title: "⚠️ Hay sai — to + V hay to + V-ing?",
        items: [
          "**used to + V** (ngày xưa thường) ≠ **be used to + V-ing** (đã quen với). ~~People are used to drive~~ → are used to driving.",
          "Phép thử: thay bằng một danh từ. “contribute to **the problem**” nghe đúng ⇒ to là giới từ ⇒ contribute to **solving** it. “tend to **the problem**” sai ⇒ to + V: tend to solve.",
          "~~lead to increase prices~~ → lead to **an increase in** prices / lead to prices **increasing**. Sau lead to, danh từ thường gọn hơn V-ing.",
          "~~in order to improving~~: in order to, so as to, be likely to, tend to là to + V nguyên mẫu.",
        ],
      },
      {
        t: "table", caption: "Vùng ③ — giới từ + which: danh từ nào kéo giới từ nào",
        head: ["Cụm", "Nghĩa", "Ví dụ Task 2"],
        rows: [
          ["the extent **to** which", "mức độ mà", "The essay examines the extent to which schools shape character."],
          ["the way **in** which", "cách mà", "This has changed the way in which people shop."],
          ["the speed / rate **at** which", "tốc độ mà", "The rate at which species are disappearing is alarming."],
          ["the conditions / circumstances **under** which", "điều kiện mà", "We should ask under which conditions the policy works."],
          ["the basis **on** which · the grounds **on** which", "cơ sở mà", "The grounds on which the ban was justified were weak."],
          ["the period **during** which · the age **at** which", "giai đoạn / độ tuổi mà", "The age at which children start school varies."],
          ["the ease **with** which · the frequency **with** which", "sự dễ dàng / tần suất mà", "The ease with which data can be copied creates risks."],
          ["a situation **in** which · a society **in** which", "tình huống / xã hội mà", "A society in which nobody saves is fragile."],
        ],
      },
      { t: "p", text: "Cách tìm giới từ: đặt lại thành câu đơn. People shop **in** a certain way ⇒ the way **in** which. Species disappear **at** a certain rate ⇒ the rate **at** which. Trong Part 3 khi nói, người bản ngữ đẩy giới từ về cuối hoặc bỏ which (the way people shop) — đã học ở **Ngày 11 Bài 1 mục 5**." },
      { t: "rule", formula: "a rise in + thứ · of + mức · V + by + mức · to + điểm đến · at + mức đứng      |      contribute / be committed + to + V-ing      |      the extent to which + S + V", vi: "Giới từ đi theo từ đứng TRƯỚC nó (rise, contribute, extent), không đi theo nghĩa tiếng Việt." },
      {
        t: "quiz", id: "t5d17-gioi-tu-dich", kind: "translate", grammar: "giới từ của con số · to + V-ing · giới từ + which",
        title: "Dịch sang tiếng Anh — giới từ vòng 3 (5 câu)",
        items: [
          { q: "Số người dùng tăng 20 % lên 6 triệu vào năm 2020.", answers: ["The number of users rose by 20 per cent to 6 million in 2020.", "The number of users rose by 20% to 6 million in 2020.", "The number of users increased by 20 per cent to 6 million in 2020.", "The number of users increased by 20% to 6 million in 2020.", "The number of users grew by 20 per cent to 6 million in 2020."], hint: "rose by … to … in 2020" },
          { q: "Tỉ lệ này đạt đỉnh ở mức 45 % rồi giữ ổn định ở mức 40 %.", answers: ["The figure peaked at 45 per cent and then remained stable at 40 per cent.", "The figure peaked at 45% and then remained stable at 40%.", "This figure peaked at 45 per cent and then remained stable at 40 per cent.", "The rate peaked at 45 per cent and then remained stable at 40 per cent.", "The proportion peaked at 45 per cent and then remained stable at 40 per cent.", "The figure peaked at 45 per cent before remaining stable at 40 per cent."], hint: "peaked at · remained stable at" },
          { q: "Thành phố cam kết giảm ô nhiễm trước năm 2030.", answers: ["The city is committed to reducing pollution by 2030.", "The city is committed to cutting pollution by 2030."], hint: "be committed to + V-ing · by 2030" },
          { q: "Bài viết này xem xét mức độ mà quảng cáo ảnh hưởng đến trẻ em.", answers: ["This essay examines the extent to which advertising influences children.", "This essay considers the extent to which advertising influences children.", "This essay examines the extent to which advertising affects children."], hint: "the extent to which + S + V · advertising (không -s)" },
          { q: "Người dân đã quen với việc trả tiền cho thông tin.", answers: ["People are used to paying for information.", "People are accustomed to paying for information.", "People have become used to paying for information.", "People have got used to paying for information."], hint: "be used to + V-ing · information" },
        ],
      },

      { t: "h", text: "5. Dấu phẩy vòng 3 — sáu luật" },
      { t: "p", text: "Dấu phẩy sai không làm người đọc hiểu nhầm nhiều, nhưng giám khảo ==nhìn thấy ngay==, và mô tả GRA có ghi cả punctuation. Sáu luật dưới đây xử lý gần hết lỗi phẩy trong bài của người Việt." },
      {
        t: "table",
        head: ["Luật", "Sai", "Đúng"],
        rows: [
          ["① Không nối hai câu đủ chủ – vị bằng một dấu phẩy (comma splice)", "~~Rents are rising, many families are moving out.~~", "Rents are rising, **and** many families are moving out. · Rents are rising**;** many families… · **As** rents are rising, many families…"],
          ["② however / therefore / moreover / as a result nối hai CÂU ⇒ trước nó là chấm hoặc chấm phẩy", "~~Prices fell, however demand did not rise.~~", "Prices fell**. However,** demand did not rise. · Prices fell**; however,** demand did not rise."],
          ["③ Phần mở đầu (mệnh đề phụ, cụm dài) đứng TRƯỚC ⇒ có phẩy. Đứng SAU ⇒ không phẩy", "~~Although it is costly the scheme works.~~ · ~~The scheme works, because it is simple.~~", "Although it is costly**,** the scheme works. · The scheme works because it is simple."],
          ["④ Mệnh đề quan hệ: xác định — không phẩy; thêm thông tin — hai phẩy; that không đứng sau phẩy", "~~Workers, that commute by car, pay more.~~", "Workers who commute by car pay more. · My manager, who commutes by car, pays more."],
          ["⑤ Không phẩy giữa chủ ngữ và động từ, giữa động từ và that", "~~The main reason why people leave, is cost.~~ · ~~I believe, that it is unfair.~~", "The main reason why people leave is cost. · I believe that it is unfair."],
          ["⑥ Phần chen giữa câu: mở phẩy thì đóng phẩy", "~~Governments, in my view should act.~~", "Governments, in my view, should act."],
        ],
      },
      {
        t: "table", caption: "Luật ④ đổi nghĩa — cùng một câu, có và không có phẩy",
        head: ["Câu", "Nghĩa"],
        rows: [
          ["Students who work part-time get lower grades.", "chỉ những sinh viên CÓ đi làm thêm (một nhóm trong số sinh viên)"],
          ["Students, who work part-time, get lower grades.", "MỌI sinh viên đều đi làm thêm, và mọi sinh viên đều điểm thấp hơn — gần như chắc chắn không phải ý bạn"],
          ["The policy which was introduced in 2020 has failed.", "chính sách năm 2020 (phân biệt với các chính sách khác)"],
          ["The policy, which was introduced in 2020, has failed.", "chỉ có một chính sách đang được bàn; năm 2020 là thông tin thêm"],
        ],
      },
      {
        t: "note", title: "⚠️ Sai kinh điển của người Việt ở dấu phẩy",
        items: [
          "**Nối câu bằng phẩy** như trong tiếng Việt. Phép thử: che phần trước dấu phẩy, phần sau có tự đứng thành câu không? Che phần sau, phần trước có tự đứng không? Cả hai đều có ⇒ cần chấm, chấm phẩy hoặc liên từ.",
          "**Phẩy trước because, that, if, when** khi chúng đứng giữa câu. Riêng although / whereas / while (nghĩa tương phản) đứng giữa câu thì có phẩy: Cities are growing, whereas villages are shrinking.",
          "**, and** trước một động từ chung chủ ngữ: ~~The council built a road, and closed the bridge.~~ Chung chủ ngữ ⇒ không phẩy. Hai chủ ngữ ⇒ có phẩy: The council built a road, and traffic fell.",
          "**Thiếu phẩy sau However / Therefore / In addition / For example** ở đầu câu.",
          "**such as**: phẩy trước such as khi nó thêm ví dụ (Many cities, such as Hanoi, …); không phẩy SAU such as (~~such as, Hanoi~~).",
        ],
      },
      { t: "rule", formula: "câu đủ S V  +  ,  +  câu đủ S V   ⇒   SAI.   Sửa:  .  |  ;  |  , and / but / so  |  because / although / as", vi: "Mỗi dấu phẩy phải trả lời được: nó tách cái gì khỏi cái gì? Không trả lời được ⇒ xoá." },
      {
        t: "mcq", id: "t5d17-dau-phay", title: "Câu nào chấm phẩy ĐÚNG? (6 câu)",
        items: [
          { q: "1.", options: ["Public transport is cheap, however it is often late.", "Public transport is cheap; however, it is often late.", "Public transport is cheap however, it is often late."], correct: 1, why: "however nối hai câu đủ ⇒ chấm phẩy (hoặc chấm) trước, phẩy sau — luật ②. A là comma splice." },
          { q: "2.", options: ["The fact that so many graduates cannot find work, is worrying.", "The fact, that so many graduates cannot find work is worrying.", "The fact that so many graduates cannot find work is worrying."], correct: 2, why: "Chủ ngữ dài (The fact that… work) không bị tách khỏi động từ is — luật ⑤. Không phẩy trước that." },
          { q: "3.", options: ["If fares were lower more people would use buses.", "If fares were lower, more people would use buses.", "More people would use buses, if fares were lower."], correct: 1, why: "Mệnh đề if đứng trước ⇒ có phẩy; đứng sau ⇒ không phẩy — luật ③." },
          { q: "4. (Ý: chỉ những công ty gây ô nhiễm mới bị phạt)", options: ["Companies, which pollute rivers, should be fined.", "Companies which pollute rivers should be fined.", "Companies, that pollute rivers should be fined."], correct: 1, why: "Mệnh đề xác định (chỉ nhóm gây ô nhiễm) ⇒ không phẩy. A nói mọi công ty đều gây ô nhiễm — luật ④." },
          { q: "5.", options: ["Tourism creates jobs, it also raises prices.", "Tourism creates jobs, and it also raises prices.", "Tourism creates jobs and, it also raises prices."], correct: 1, why: "Hai mệnh đề đủ chủ – vị nối bằng , and — luật ①. A là comma splice." },
          { q: "6.", options: ["Older workers, in particular find retraining difficult.", "Older workers in particular, find retraining difficult.", "Older workers, in particular, find retraining difficult."], correct: 2, why: "Phần chen in particular được kẹp giữa hai phẩy — luật ⑥. B đặt phẩy giữa chủ ngữ và động từ." },
        ],
      },
      {
        t: "quiz", id: "t5d17-dau-phay-dich", kind: "translate", grammar: "S V; however, S V · Although S V, S V · N, which …, V",
        title: "Dịch sang tiếng Anh — gõ đủ dấu câu (3 câu)",
        items: [
          { q: "Mặc dù kế hoạch này tốn kém, nó tiết kiệm thời gian.", answers: ["Although the plan is expensive, it saves time.", "Although this plan is expensive, it saves time.", "Although the plan is costly, it saves time.", "Although this plan is costly, it saves time."], hint: "Although + S V, + S V — có phẩy" },
          { q: "Giá vé đã giảm; tuy nhiên, số hành khách không tăng.", answers: ["Fares have fallen; however, passenger numbers have not risen.", "Fares have fallen. However, passenger numbers have not risen.", "Fares have fallen; however, the number of passengers has not risen.", "Fares have fallen. However, the number of passengers has not risen.", "Ticket prices have fallen; however, passenger numbers have not risen.", "Ticket prices have fallen; however, the number of passengers has not risen."], hint: "; however, — the number of passengers HAS" },
          { q: "Thư viện này, mở cửa năm 2019, đón 500 khách mỗi ngày.", answers: ["The library, which opened in 2019, receives 500 visitors a day.", "This library, which opened in 2019, receives 500 visitors a day.", "The library, which opened in 2019, welcomes 500 visitors a day.", "This library, which opened in 2019, welcomes 500 visitors a day.", "The library, which opened in 2019, receives 500 visitors every day.", "The library, which was opened in 2019, receives 500 visitors a day."], hint: ", which opened in 2019, — hai phẩy" },
        ],
      },

      { t: "h", text: "6. Lượt soát 4 phút theo danh từ — và một đoạn 14 lỗi" },
      { t: "p", text: "Ở Tập 3 Ngày 27 bạn soát bài theo sáu lượt, mỗi lượt một loại lỗi. Ở band 8, thời gian soát chỉ còn 4–5 phút, nên gom lại: ==đi theo danh từ==. Mỗi danh từ là chỗ bốn loại lỗi gặp nhau." },
      {
        t: "sodo", kind: "flow", title: "Bốn lượt — mỗi lượt khoảng 1 phút",
        steps: [
          { label: "① Chạm bút vào từng DANH TỪ", sub: "đếm được không? một hay nhiều? người đọc biết cái nào chưa? ⇒ sửa -s và a / the / Ø" },
          { label: "② Từ danh từ CHÍNH của chủ ngữ sang ĐỘNG TỪ", sub: "số ít hay số nhiều? (the number of… has · one of the… is)" },
          { label: "③ Mọi CON SỐ và mọi to", sub: "rise in / of / by / to / at · to + V hay to + V-ing?" },
          { label: "④ Mọi DẤU PHẨY", sub: "hai bên có phải hai câu đủ không? có tách chủ ngữ khỏi động từ không? phần chen đã đóng phẩy chưa?" },
        ],
      },
      { t: "p", text: "Đoạn dưới đây là một thân bài Task 2 (đề: thành phố có nên đầu tư cho xe đạp). Nó có ==đúng 14 lỗi== thuộc bốn loại của hôm nay. Tự tìm trước, rồi mới xem bản sạch và bảng lỗi. Số liệu trong đoạn là hư cấu cho bài luyện." },
      {
        t: "passage", title: "Thân bài band 7 (ước tính) — 14 lỗi nhỏ",
        paras: [{ text: "(1) In the recent years, the number of people who cycle to work has risen sharply in many European cities. (2) A research carried out in Copenhagen suggests that the trend is driven less by concern for the environment than by convenience, most of commuters simply find that cycling is the fastest way of crossing the city. (3) However the infrastructures needed to support cyclists are expensive, and many councils are reluctant to invest on them. (4) One of the main obstacle, is the lack of secure parking at stations. (5) Supporters argue that, the cost should be set against spending on roads, which has increased with almost 40 per cents since 2010. (6) They also point out that the cycling reduces the pressure on the public transport at peak hours." }],
      },
      {
        t: "passage", title: "Cùng thân bài, đã sạch lỗi — band 8 (ước tính)",
        paras: [{ text: "In recent years, the number of people who cycle to work has risen sharply in many European cities. Research carried out in Copenhagen suggests that the trend is driven less by concern for the environment than by convenience: most commuters simply find that cycling is the fastest way of crossing the city. However, the infrastructure needed to support cyclists is expensive, and many councils are reluctant to invest in it. One of the main obstacles is the lack of secure parking at stations. Supporters argue that the cost should be set against spending on roads, which has increased by almost 40 per cent since 2010. They also point out that cycling reduces the pressure on public transport at peak hours." }],
      },
      {
        t: "table", caption: "14 lỗi — loại nào, lượt soát nào bắt được",
        head: ["Câu", "Sai → đúng", "Loại", "Lượt"],
        rows: [
          ["1", "In the recent years → In recent years", "mạo từ (cụm cố định)", "①"],
          ["2", "A research → Research", "không đếm được", "①"],
          ["2", "convenience, most… → convenience: most… (hoặc chấm)", "comma splice", "④"],
          ["2", "most of commuters → most commuters", "mạo từ / most", "①"],
          ["3", "However the → However, the", "phẩy sau từ nối đầu câu", "④"],
          ["3", "infrastructures… are… them → infrastructure… is… it", "không đếm được + chuỗi động từ, đại từ", "① ②"],
          ["3", "invest on → invest in", "giới từ", "③"],
          ["4", "One of the main obstacle → obstacles", "one of the + số nhiều", "①"],
          ["4", "obstacles, is → obstacles is", "phẩy tách chủ – vị", "④"],
          ["5", "argue that, the cost → argue that the cost", "phẩy sau that", "④"],
          ["5", "increased with almost 40 → increased by almost 40", "giới từ của con số", "③"],
          ["5", "per cents → per cent", "số nhiều", "①"],
          ["6", "the cycling → cycling", "mạo từ (hoạt động nói chung)", "①"],
          ["6", "the public transport → public transport", "mạo từ (không đếm được, nói chung)", "①"],
        ],
      },
      {
        t: "note", title: "💡 Mẹo — đọc ngược từ câu cuối",
        items: [
          "Khi soát, đọc ==từ câu cuối lên câu đầu==. Mắt không còn chạy theo ý nên nhìn thấy hình thức.",
          "Tám trên mười bốn lỗi ở đoạn trên bắt được ngay ở lượt ①. Nếu chỉ còn 2 phút, làm lượt ① và lượt ④.",
          "Ghi ba lỗi của riêng bạn (từ sổ lỗi Ngày 3) lên đầu giấy nháp trước khi viết. Soát ba lỗi ấy trước mọi thứ khác.",
        ],
      },
      { t: "rule", formula: "soát 4 phút:  ① danh từ (a / the / Ø · -s)  →  ② động từ theo danh từ chính  →  ③ con số + to  →  ④ dấu phẩy", vi: "Đi theo danh từ, không đi theo câu. Đọc ngược từ cuối bài." },
      {
        t: "quiz", id: "t5d17-chuoi-loi", kind: "fill",
        title: "Đoạn MỚI — mỗi câu một lỗi. Gõ lại phần [trong ngoặc] cho đúng (8 câu)",
        items: [
          { q: "1. [The] tourism brings money to remote regions.", answers: ["Tourism"], hint: "Hoạt động nói chung ⇒ không the. Gõ: Tourism" },
          { q: "2. It also creates [employments] for local people.", answers: ["employment", "jobs"], hint: "employment không đếm được; hoặc jobs." },
          { q: "3. However, visitor numbers have risen [with] a third since 2015.", answers: ["by"], hint: "rise BY + mức." },
          { q: "4. This has put pressure on [the nature], especially on beaches.", answers: ["nature", "the environment", "the natural environment"], hint: "nature không the; hoặc the environment." },
          { q: "5. One of the worst [effect] is the shortage of fresh water.", answers: ["effects"], hint: "one of the + số nhiều." },
          { q: "6. Some islands now limit arrivals[, however] the rule is hard to enforce.", answers: ["; however,", ". However,", "; however"], hint: "Hai câu đủ ⇒ ; however, hoặc . However," },
          { q: "7. Residents are not used to [share] their streets with so many visitors.", answers: ["sharing"], hint: "be used to + V-ing." },
          { q: "8. The speed [in] which hotels are being built worries planners.", answers: ["at"], hint: "build AT a certain speed ⇒ the speed at which." },
        ],
      },

      { t: "h", text: "7. Kiểm tra cuối bài (14 câu)" },
      {
        t: "mcq", id: "t5d17-np-chon", title: "Chọn phương án đúng (8 câu)",
        items: [
          { q: "1. ___ has made it easier to work from home.", options: ["The technology", "Technology", "A technology"], correct: 1, why: "Công nghệ nói chung ⇒ Ø — mục 2 tình huống ①." },
          { q: "2. The scheme gave young offenders ___ of the law.", options: ["better understanding", "a better understanding", "the better understandings"], correct: 1, why: "a + adj + N trừu tượng — mục 2 tình huống ④." },
          { q: "3. ___ agree that the rule is unfair.", options: ["The most of residents", "Most of residents", "Most residents"], correct: 2, why: "most + N (nói chung). most of phải có the / these: most of the residents — tình huống ⑦." },
          { q: "4. There is ___ to support this claim.", options: ["few evidences", "little evidence", "a little evidences"], correct: 1, why: "evidence không đếm được ⇒ little, không -s — mục 3 bảng ①." },
          { q: "5. The city has introduced ___ to cut traffic.", options: ["a three-years programme", "a three-year programme", "a three year's programme"], correct: 1, why: "số + danh từ làm tính từ: không -s, có gạch nối — mục 3 bảng ③." },
          { q: "6. Unemployment ___ 9 per cent in 2012.", options: ["peaked at", "peaked in", "peaked to"], correct: 0, why: "peak AT + mức — mục 4 vùng ①." },
          { q: "7. Lower fares would contribute ___ congestion.", options: ["to reduce", "to reducing", "for reducing"], correct: 1, why: "contribute to + V-ing (to là giới từ) — mục 4 vùng ②." },
          { q: "8. We should consider the conditions ___ which such a ban would work.", options: ["in", "under", "at"], correct: 1, why: "work UNDER certain conditions ⇒ the conditions under which — mục 4 vùng ③." },
        ],
      },
      {
        t: "quiz", id: "t5d17-np-sua", kind: "fill",
        title: "Mỗi câu một lỗi — gõ lại phần [trong ngoặc] cho đúng (6 câu)",
        items: [
          { q: "1. Schools need more [equipments] for science lessons.", answers: ["equipment"], hint: "equipment không đếm được." },
          { q: "2. [The unemployed is] often blamed for their own situation.", answers: ["The unemployed are"], hint: "the + adj = cả nhóm ⇒ V số nhiều." },
          { q: "3. The figure stood [in] 30 per cent throughout the decade.", answers: ["at"], hint: "stand AT." },
          { q: "4. Each of the [solution has] a cost.", answers: ["solutions has"], hint: "each of the + số nhiều + V số ít." },
          { q: "5. Sales were flat [by] 2018, when a new model was launched. (kéo dài tới 2018)", answers: ["until"], hint: "until = kéo dài tới; by = không muộn hơn." },
          { q: "6. The reason why many small shops [close, is] rising rent.", answers: ["close is"], hint: "Không phẩy giữa chủ ngữ và động từ." },
        ],
      },
      {
        t: "note", title: "Sau bài này — việc phải làm với bài viết của bạn",
        items: [
          "Mở bài Task 2 của **Đề 10** (làm ở Ngày 16). Chạy bốn lượt soát của mục 6, bấm giờ 4 phút. Đếm số ==câu== có lỗi, không đếm số lỗi. Ghi con số vào sổ: đó là mốc để so với Đề 11 (Ngày 24).",
          "Mỗi lỗi tìm được: ghi vào sổ lỗi theo mẫu Ngày 3 mục 7 (câu sai → câu đúng → quy tắc của tôi).",
          "Bài 2 hôm nay mổ Reading Đề 10. Khi đọc lại ba passage, để ý mạo từ ở các câu nói chung (Languages do not ordinarily begin · Accuracy measured against a distorted record is not a virtue).",
        ],
      },
    ],
  },
  /* ════════════════ BÀI 2 — ĐỌC: MỔ READING ĐỀ 10 ════════════════ */
  {
    id: "t5d17-doc",
    kind: "reading",
    title: "Đọc: Mổ Reading Đề 10 — paraphrase từng câu sai (so sánh bị đảo chiều, phạm vi bị nới, đổi loại từ ở hộp từ), rồi luyện lại bằng bài mới",
    goal: "Gắn nhãn nguyên nhân R1–R5 cho từng câu sai của Reading Đề 10, chỉ ra đúng chữ trong bài đã được đổi thành chữ nào trong câu hỏi (mức paraphrase 1–4), hiểu ba bẫy lặp lại của đề — so sánh bị đảo chiều, phạm vi bị nới rộng, “phê bình” bị đọc thành “phủ nhận” — rồi làm một bài mới khoảng 950 từ với 14 câu (TFNG · Short answer · Summary hộp từ) trong 18 phút, đúng ít nhất 12/14.",
    minutes: 90,
    blocks: [
      {
        t: "recap", title: "Bài này làm gì · đẩy tiêu chí nào",
        items: [
          "Mở trang kết quả **Đề 10 — Reading** ở Online Test trước khi học. Bài này không chép lại đề; nó chỉ trích vài chữ ở chỗ cần mổ.",
          "Dùng lại năm nhãn nguyên nhân **R1–R5** của Ngày 9. Ở Đề 10, nhãn hay gặp nhất là **R2** (tìm đúng chỗ, hiểu sai paraphrase) — vì gần như mọi câu của đề đều paraphrase ở mức 3–4.",
          "Kỹ năng chính hôm nay (mã R18): viết ra ==cặp “bài viết ↔ câu hỏi”== cho từng câu sai và gọi tên phép đổi. Gọi được tên thì lần sau nhận ra.",
          "Ba bẫy lặp lại của Đề 10: ==so sánh bị đảo chiều== (câu 1, 3, 21) · ==phạm vi bị nới== (câu 4, 28) · ==phê bình ≠ phủ nhận== (câu 29, 31, 37).",
          "Sau phần mổ: bài mới **The Line on the Hull**, 14 câu, 18 phút, có đủ ba bẫy trên. Mục tiêu ≥ 12/14. Đích của cả đề: 33/40 (band 7.5); Đề 11 ở Ngày 24 nhắm 35/40.",
        ],
      },

      { t: "h", text: "1. Chấm Đề 10 theo nhóm câu — và gắn nhãn nguyên nhân" },
      {
        t: "table",
        head: ["Câu", "Passage", "Dạng", "Đã học ở", "Bạn đúng"],
        rows: [
          ["1–6", "1 · Reading the Planet from the Outside", "True / False / Not Given", "Tập 5 Ngày 3", "… / 6"],
          ["7–10", "1", "Diagram labelling", "Tập 4 Ngày 17", "… / 4"],
          ["11–13", "1", "Short answer", "Tập 5 Ngày 7", "… / 3"],
          ["14–20", "2 · A Language is Born", "Matching headings", "Tập 5 Ngày 5 · Ngày 9", "… / 7"],
          ["21–24", "2", "Matching features", "Tập 5 Ngày 15", "… / 4"],
          ["25–26", "2", "Sentence completion", "Tập 5 Ngày 7", "… / 2"],
          ["27–32", "3 · The Arithmetic of Fairness", "Yes / No / Not Given", "Tập 5 Ngày 9", "… / 6"],
          ["33–36", "3", "Multiple choice (4 lựa chọn)", "Tập 4 Ngày 7 · Tập 5 Ngày 11", "… / 4"],
          ["37–40", "3", "Summary — hộp từ", "Tập 4 Ngày 25", "… / 4"],
        ],
        caption: "Chép bảng vào Sổ lỗi, điền cột cuối. Mục tiêu Đề 10: 33/40. Nhóm nào mất từ 2 câu trở lên là nhóm phải ôn trước Ngày 19 (Reading đủ 3 passage lần 2).",
      },
      {
        t: "table", caption: "Năm nhãn nguyên nhân (nhắc lại từ Ngày 9) — thêm cột “ở Đề 10 hay dính câu nào”",
        head: ["Nhãn", "Nguyên nhân", "Ở Đề 10 hay dính"],
        rows: [
          ["**R1**", "không tìm ra chỗ trong bài", "câu 23 (Goldin-Meadow xuất hiện ở đoạn B, lại được nhắc ở đoạn G)"],
          ["**R2**", "tìm đúng chỗ, hiểu sai paraphrase", "câu 1 · 3 · 19 · 38 · 39"],
          ["**R3**", "rơi bẫy “có nhắc nhưng không phải đáp án”", "câu 7 · 9 · 12 · 25 · 26"],
          ["**R4**", "tự suy thêm / dùng kiến thức ngoài", "câu 4 · 6 · 28 · 32"],
          ["**R5**", "hết giờ, chép sai, vượt giới hạn từ", "câu 13 (ba từ thay vì hai) · câu 37–40"],
        ],
      },
      {
        t: "note", title: "💡 Cách học: mổ trước, đọc giải thích sau",
        items: [
          "Với mỗi câu sai: mở lại passage, tự gạch câu chứa đáp án, gắn nhãn. Sau đó mới đọc phần giải thích ở trang kết quả.",
          "Câu đúng nhưng bạn đoán cũng tính là sai. Đánh dấu ? và mổ như câu sai.",
          "Việc mới của hôm nay: bên cạnh mỗi câu sai, viết ==một dòng paraphrase== theo mẫu ở mục 2. Mười dòng như thế đáng giá hơn làm thêm một đề.",
        ],
      },

      { t: "h", text: "2. Thang bốn mức paraphrase — đọc Đề 10 bằng thang này" },
      { t: "p", text: "Thang này bạn đã gặp từ Tập 2 Ngày 8 và dùng lại ở Tập 5 Ngày 1 và Ngày 6. Ở Đề 10, mức 1 gần như không còn. Bảng dưới xếp mười hai cặp của đề theo mức." },
      {
        t: "table",
        head: ["Mức", "Phép đổi", "Bài viết (trích)", "Câu hỏi", "Câu"],
        rows: [
          ["1", "đồng nghĩa", "to contest it", "to **challenge** it", "40"],
          ["2", "đổi loại từ", "made **in public**", "made **openly**", "38"],
          ["2", "đổi loại từ", "people who **can be held to account**", "people who are **accountable**", "39"],
          ["2", "đổi loại từ + bị động", "this motion that **generates**…", "**produced by** the movement", "13"],
          ["3", "đổi cấu trúc", "**Nobody set out to** give these pupils…", "the **unplanned** result", "16"],
          ["3", "đổi cấu trúc", "a claim that is **difficult to dismiss**", "**deserves to be taken seriously**", "27"],
          ["3", "đổi cấu trúc", "applies **with equal force** to a human judge", "affects human decision-makers **as well as** software", "30"],
          ["4", "đảo chiều so sánh", "They are **the slower of the two** (nói về sóng S)", "P waves move at a **higher** speed than S waves", "3"],
          ["4", "đổi góc nhìn", "**almost twice what had been predicted**", "had expected the rock to be **cooler than it was**", "2"],
          ["4", "ý ẩn", "a subject fit for **speculation rather than research**", "considered **beyond investigation**", "14"],
          ["4", "ý ẩn", "a demand for **something that cannot exist**", "regards the call… as **unrealistic**", "37"],
          ["4", "gom chi tiết thành khái niệm", "**a community of several hundred** users… **before the age of about ten**", "why **numbers and timing** both mattered", "20"],
        ],
        caption: "Mức 4 chiếm khoảng một nửa số câu của Đề 10. Người band 7 đọc ra mức 2–3; người band 8 đọc ra mức 4 mà không phải đọc lại.",
      },
      {
        t: "patterns",
        rows: [
          { formula: "A is the slower / smaller / older of the two   ⇄   B is faster / larger / newer than A", vi: "Đảo chiều so sánh: bài nói về A, câu hỏi nói về B.", examples: [{ en: "Text: “Rail is the cheaper of the two options.” — Statement: “Travelling by road costs more than travelling by rail.” ⇒ TRUE", vi: "Bài nói tàu rẻ hơn; câu hỏi nói đường bộ đắt hơn — cùng một sự thật." }] },
          { formula: "twice / half / well above + what had been expected   ⇄   had expected it to be lower / higher than it was", vi: "Đổi góc nhìn: từ con số thật sang kỳ vọng của người trong cuộc.", examples: [{ en: "Text: “The repairs took three times as long as planned.” — Statement: “The engineers had thought the work would be quicker.” ⇒ TRUE", vi: "Lâu gấp ba dự kiến ⇒ họ đã nghĩ sẽ nhanh hơn." }] },
          { formula: "not X but Y · replied not by V-ing X but by V-ing Y   ⇄   câu hỏi nhắc X", vi: "Vế sau not là vế BỊ BÁC. Câu hỏi hay nhặt đúng vế đó.", examples: [{ en: "Text: “The firm responded not by cutting prices but by improving its service.” — Statement: “The firm lowered its prices.” ⇒ FALSE", vi: "Hãng không giảm giá; hãng cải thiện dịch vụ." }] },
        ],
      },
      { t: "rule", formula: "mỗi câu sai  →  viết một dòng:  “chữ trong bài”  ↔  “chữ trong câu hỏi”  +  tên phép đổi (đồng nghĩa · loại từ · cấu trúc · đảo chiều · góc nhìn · ý ẩn)", vi: "Không gọi được tên phép đổi nghĩa là bạn chưa hiểu vì sao mình sai." },

      { t: "h", text: "3. Mổ Passage 1 — TFNG 1–6, Diagram 7–10, Short answer 11–13" },
      {
        t: "table", caption: "True / False / Not Given",
        head: ["Câu", "Đáp án", "Chữ quyết định trong bài", "Bẫy · kỹ năng"],
        rows: [
          ["1", "FALSE", "“wells that are **longer**… measured **straight down**, Kola has never been beaten”", "Bài tách hai phép đo: chiều DÀI và độ SÂU thẳng đứng. Câu hỏi hỏi “greater in length”. Người đọc lướt dừng ở “has never been beaten” và chọn TRUE. Bài học: khi bài có **but… ; measured…**, nghĩa là có hai tiêu chí — hỏi câu hỏi đang dùng tiêu chí nào."],
          ["2", "TRUE", "“almost twice what had been predicted”", "Đổi góc nhìn (mức 4). Nóng gấp đôi dự tính ⇒ họ đã tưởng nó nguội hơn. Đây là suy luận ==được phép==: không thêm thông tin."],
          ["3", "TRUE", "“They are the slower of the two”", "Thông tin nằm ở câu nói về sóng **S**, không ở câu nói về sóng P. Ai chỉ dò chữ “P waves” sẽ không thấy tốc độ và chọn NOT GIVEN."],
          ["4", "NOT GIVEN", "“One of the first to **read** the code”", "Chữ first có trong bài nhưng gắn với việc ĐỌC (diễn giải). Câu hỏi nói “the first… to **record**… with an instrument”. Hai lần lệch: one of the first ≠ the first; read ≠ record."],
          ["5", "FALSE", "“both came from the same shock”", "Câu dễ. Sai ở đây thường do không biết shock = earthquake (đồng nghĩa theo ngữ cảnh)."],
          ["6", "NOT GIVEN", "“could not be demonstrated until several decades later”", "Câu này nói về tính RẮN của lõi, không nói đồng nghiệp phản ứng ra sao. Người chọn FALSE / TRUE đã tự viết thêm một câu: “vì chưa chứng minh được nên bị bác”."],
        ],
      },
      {
        t: "table", caption: "Diagram + Short answer — mỗi ô có ít nhất một “ứng viên sai” cùng loại",
        head: ["Câu", "Đáp án", "Ứng viên sai", "Cách loại"],
        rows: [
          ["7", "2,900", "6,400 · 1,220 · 35", "Hình ghi “the core **begins at a depth of**”. Chỉ một con số trong bài đi với begins. 6,400 là tâm, 1,220 là bán kính lõi trong."],
          ["8", "liquid", "solid", "Mũi tên chỉ lõi NGOÀI. Bài nói sóng S không qua được chất lỏng (đoạn 2) rồi mới nói lõi là lỏng (đoạn 4): đáp án cần ghép hai đoạn."],
          ["9", "pressure", "depth · heat", "Hình ghi “kept solid by the enormous ___”. Bài: “not in spite of its depth but because of it: the **pressure**… is so great”. depth là nguyên nhân xa; thứ được gọi là lớn là pressure."],
          ["11", "heat", "hardness", "Câu chẻ phủ định: “It was **not the hardness** of the rock… **but heat**”. Vế sau not là bẫy."],
          ["12", "New Zealand", "Denmark · Zagreb", "Ba nơi chốn, ba quan hệ: nơi bà làm việc · nơi xảy ra động đất · trận của người khác. Câu hỏi hỏi nơi XẢY RA."],
          ["13", "magnetic field", "planet's magnetic field", "Giới hạn hai từ. Chép cả ba từ là mất điểm dù hiểu đúng — nhãn R5."],
        ],
      },
      {
        t: "note", title: "⚠️ Người Việt hay sai ở TFNG band 8",
        items: [
          "**Dò theo danh từ của câu hỏi.** Câu 3 hỏi về P waves nhưng đáp án nằm ở câu có chủ ngữ They (S waves). Khi câu hỏi là một phép so sánh, dò CẢ HAI vế.",
          "**Thấy never / always / first là chọn ngay.** Ở câu 1 và câu 4, chính các chữ tuyệt đối ấy là mồi. Đọc xem chúng gắn với danh từ hay động từ nào.",
          "**Điền chỗ trống bằng kiến thức phổ thông.** Câu 6: “ý tưởng mới thì hay bị bác” là hiểu biết của bạn, không phải của bài.",
        ],
      },
      {
        t: "mcq", id: "t5d17-doc-tfng-luyen", title: "Luyện ngay — bốn đoạn ngắn MỚI, cùng bốn kiểu bẫy (4 câu · 3 phút)",
        items: [
          { q: "1. Text: “Several bridges built since then are longer, but they stand on dozens of piers; in terms of the distance crossed in a single span, the bridge of 1890 has never been surpassed.” — Statement: No bridge completed after 1890 has exceeded it in overall length.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 1, why: "Hai tiêu chí: tổng chiều dài (đã bị vượt: Several bridges… are longer) và nhịp đơn (chưa bị vượt). Câu hỏi hỏi overall length ⇒ FALSE. Cùng kiểu câu 1 của Đề 10." },
          { q: "2. Text: “Of the two metals, copper is the poorer conductor, though it is far cheaper.” — Statement: Silver carries electricity better than copper.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 2, why: "Bài chỉ nói the two metals, không nói kim loại kia là bạc. Bạn biết đó là bạc nhờ kiến thức ngoài ⇒ NOT GIVEN. Đảo chiều so sánh chỉ dùng được khi bài nêu tên cả hai." },
          { q: "3. Text: “Dr Okafor was among the earliest to interpret the tablets, which had been dug up forty years before she was born.” — Statement: Dr Okafor was the first person to discover the tablets.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 1, why: "Các phiến đất được đào lên bốn mươi năm TRƯỚC khi bà ra đời ⇒ bà không thể là người tìm ra ⇒ FALSE. Khác câu 4 của Đề 10: ở đây bài CÓ thông tin trái ngược (dug up forty years before she was born)." },
          { q: "4. Text: “Her proposal appeared in 1952. The equipment needed to test it did not exist until the 1980s.” — Statement: Other researchers were unconvinced by her proposal for thirty years.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 2, why: "Bài nói chưa có thiết bị để kiểm chứng, không nói đồng nghiệp tin hay không tin ⇒ NOT GIVEN. Cùng kiểu câu 6 của Đề 10." },
        ],
      },

      { t: "h", text: "4. Mổ Passage 2 — Headings 14–20, Features 21–24, Sentence completion 25–26" },
      { t: "p", text: "Ở Ngày 9 bạn đã học: ==tiêu đề đúng trùng ý, tiêu đề sai trùng chữ==. Passage 2 của Đề 10 đi thêm một bước: ba tiêu đề thừa không chỉ trùng chữ mà còn ==nghe rất hợp lý== với chủ đề chung của bài." },
      {
        t: "table",
        head: ["Tiêu đề thừa", "Vì sao hấp dẫn", "Vì sao sai"],
        rows: [
          ["**i** A dispute over who deserves the credit", "Đoạn F có hai tên (Pinker, Bickerton); đoạn G mở bằng “Others have drawn more cautious lessons”", "Họ bất đồng về cách DIỄN GIẢI, không tranh công. Không ai trong bài đòi công lao."],
          ["**v** How the language spread to neighbouring countries", "Bài nói về một ngôn ngữ ra đời ⇒ đoán nó sẽ lan ra", "Không đoạn nào nhắc nước khác. Đây là tiêu đề “đúng với kiến thức, không có trong bài”."],
          ["**ix** Teachers who learned from their pupils", "Đoạn C và D đều có teachers / staff và pupils", "Đoạn D: giáo viên KHÔNG theo kịp học trò nên phải mời chuyên gia. Ngược với learned."],
        ],
      },
      {
        t: "table", caption: "Bốn câu dễ sai nhất của Passage 2",
        head: ["Câu", "Đáp án", "Chữ quyết định", "Bẫy"],
        rows: [
          ["16", "vii", "“Nobody set out to…” · “The lessons achieved very little.”", "Tiêu đề có hai nửa: policy that failed (dạy đọc môi) + unplanned result (ngôn ngữ ngoài sân chơi). Đoạn phải có CẢ HAI. Ai chỉ thấy nửa đầu sẽ phân vân với ix."],
          ["19", "iii", "“seemed to **vindicate**… who had argued **years earlier**”", "vindicate = chứng tỏ ai đó đã đúng. Không biết từ này thì nhìn “years earlier” + “the best evidence available”: bằng chứng mới cho một ý cũ ⇒ Earlier claims… confirmed. Chữ apparently trong tiêu đề khớp seemed to."],
          ["21", "E · Bickerton", "“had argued years earlier… it is their children who turn it into a complete language”", "Hai người cùng đoạn F cùng nói về trẻ em và ngữ pháp. Câu hỏi có “**before** the events in Nicaragua” ⇒ chỉ Bickerton. Pinker nói SAU, lấy Nicaragua làm bằng chứng (câu 24)."],
          ["22", "B · Kegl", "“It was when she turned to the primary school that she was astonished.”", "Senghas cũng so sánh lứa trước – lứa sau, và bài tả kỹ nghiên cứu của bà. Nhưng câu hỏi có “was **surprised**”: cảm xúc ấy chỉ gắn với Kegl."],
          ["25", "buses", "“In the playground, however, and on the buses…”", "Câu hỏi đã dùng playground (“Apart from the playground”) ⇒ cần nơi thứ hai. classroom là nơi ký hiệu bị cấm."],
          ["26", "movement", "“made **a single movement**” · lứa sau: “**one sign**… then a separate sign”", "Câu hỏi hỏi về người nghe và lứa ĐẦU. sign thuộc về lứa SAU. Cả hai từ đều vừa chỗ trống về ngữ pháp; chỉ một từ đúng người."],
        ],
      },
      {
        t: "note", title: "📌 Matching features band 8 — ba câu hỏi phụ",
        items: [
          "**Khi nào?** Câu hỏi có before / after / later / at first ⇒ xếp các tên theo dòng thời gian (câu 21).",
          "**Cảm xúc hay hành động gì?** was surprised · complained · conceded · warned ⇒ chỉ một người có đúng động từ ấy (câu 22).",
          "**Người ấy NÓI ý đó, hay bài dùng nghiên cứu của người ấy để nói ý khác?** Senghas mô tả hiện tượng; bài không gán cho bà quan điểm “bẩm sinh” (câu 24). Đây là bài học “ý của ai?” của Ngày 15 mục 3.",
        ],
      },
      {
        t: "mcq", id: "t5d17-doc-feature-luyen", title: "Luyện ngay — một đoạn MỚI, ba câu nối người (3 câu · 3 phút)",
        items: [
          { q: "Đoạn (hư cấu): “The idea that cities make their own weather is usually credited to Hale, whose measurements in the 1960s showed that streets stayed warmer than the surrounding fields after dark. Hale, however, was building on a suggestion made a generation earlier by Brandt, who had no instruments to test it. It was left to Osei, mapping temperatures street by street, to notice something neither had predicted: that the warmest spots were not the busiest ones, a result she admitted she had not been looking for.” — 1. Who put forward an idea before it could be checked?", options: ["Hale", "Brandt", "Osei"], correct: 1, why: "Brandt: a suggestion made a generation earlier… had no instruments to test it. Câu hỏi có before ⇒ xếp theo thời gian. Hale được credited nhưng là người đo, không phải người nêu trước." },
          { q: "2. Who came across a finding by accident?", options: ["Hale", "Brandt", "Osei"], correct: 2, why: "Osei: a result she admitted she had not been looking for ⇒ tình cờ. Paraphrase mức 4: không có chữ accident / chance trong đoạn." },
          { q: "3. Who provided the first evidence for the effect?", options: ["Hale", "Brandt", "Osei"], correct: 0, why: "Hale: whose measurements… showed. Brandt chỉ nêu ý, không có bằng chứng. Osei đến sau." },
        ],
      },

      { t: "h", text: "5. Mổ Passage 3 — YNNG 27–32, MCQ 33–36, Summary hộp từ 37–40" },
      { t: "p", text: "Passage 3 là bài lập luận ngôi thứ nhất, và tác giả ==cho cả hai phe đều đúng một phần==. Cấu trúc ấy sinh ra một bẫy riêng: thấy tác giả phê bình một thứ là tưởng tác giả bác thứ đó." },
      {
        t: "table",
        head: ["Câu", "Đáp án", "Chữ quyết định", "Bẫy"],
        rows: [
          ["28", "NOT GIVEN", "“a program used in American courts” · “a single county in Florida”", "==Phạm vi bị nới==: American courts ≠ the courts of **every** American state. Bài không nói bao nhiêu bang. Chọn NO cũng sai: bài không nói chương trình chỉ dùng ở một số bang."],
          ["29", "NO", "“replied **not by disputing** these figures **but by** producing figures of its own”", "Khuôn not by X but by Y (mục 2). Câu hỏi chép vế bị bác: showed that the journalists had made errors."],
          ["31", "NO", "“**I do not doubt the value** of such tools… **But** they encourage the belief…”", "Cả đoạn là lời phê bình, nên dễ chọn YES cho “serves no useful purpose”. Tác giả phê bình NIỀM TIN do công cụ gây ra, và nói rõ công cụ có giá trị."],
          ["32", "NOT GIVEN", "“the questions that legislatures and courts **exist to decide**”", "exist to decide = đáng lẽ phải quyết. Bài không nói đã có luật nào được thông qua. Suy thêm một bước ⇒ NOT GIVEN."],
          ["33", "C", "“no predictor… **however it is built**, can meet both standards at once”", "A sai vì however it is built. D sai vì bài nói đây không phải tranh cãi về số liệu — không bên nào sai."],
          ["36", "D", "“the scandal was possible only because the system was… **more open to scrutiny** than the judges”", "Câu hỏi hỏi VÌ SAO tác giả dùng chữ curious. Đáp án là nghịch lý nằm ngay sau chữ đó, không nằm ở đầu đoạn."],
          ["37", "D · unrealistic", "“a demand for something that **cannot exist**”", "H dangerous cùng loại từ và cùng màu tiêu cực. Nhưng tác giả gọi yêu cầu ấy là understandable; nó làm lạc hướng, không gây hại."],
          ["38–39", "F openly · A accountable", "“in public” · “can be held to account”", "Đổi loại từ: cụm giới từ → trạng từ; mệnh đề bị động → tính từ. E qualified nghe hợp lý (người có chuyên môn) nhưng bài đòi người CHỊU TRÁCH NHIỆM."],
        ],
      },
      {
        t: "table", caption: "Bốn kiểu phương án sai của MCQ band 8 (câu 33–36)",
        head: ["Kiểu", "Ví dụ ở Đề 10", "Phép thử"],
        rows: [
          ["**Ngược với bài**", "33A (có thể thiết kế lại để thoả cả hai) · 36A (thẩm phán chính xác hơn)", "tìm chữ phủ định trong bài: no predictor… · hardly reassuring"],
          ["**Đúng chữ, sai quan hệ**", "35C (bỏ địa chỉ thì hết liên hệ) — bài: “Nor does it help to remove…”", "chữ ấy trong bài đứng sau nor / not / hardly?"],
          ["**Không được nhắc**", "34D (bị toà bác) · 35B · 36B · 36C", "chỉ ngón tay vào câu trong bài; không chỉ được ⇒ loại"],
          ["**Đúng một nửa**", "34A (liên quan tới đo thiên lệch) — bài nói công cụ GIÚP đo", "đọc hết phương án; nửa sau thường là chỗ sai"],
        ],
      },
      {
        t: "note", title: "⚠️ Hay sai — “phê bình” không phải “phủ nhận”",
        items: [
          "Dấu hiệu tác giả đang ==nhượng bộ trước khi phê bình==: I do not doubt… · None of this is an argument for… · understandable though it is · It would be dishonest to pretend…",
          "Sau các cụm ấy luôn có But / Yet / however. Phần TRƯỚC but là điều tác giả CÔNG NHẬN. Câu hỏi YNNG hay hỏi đúng phần đó (câu 27, 31).",
          "Đây chính là cấu trúc nhượng bộ bạn tập viết ở **Ngày 13 Bài 1 mục 4**. Viết được thì đọc ra.",
          "Ở summary hộp từ, hai từ bẫy thường ==cùng loại từ== với đáp án (dangerous / unrealistic · qualified / accountable). Loại bằng nghĩa, không loại bằng ngữ pháp.",
        ],
      },
      {
        t: "mcq", id: "t5d17-doc-ynng-luyen", title: "Luyện ngay — bốn đoạn ngắn MỚI: phạm vi, not… but, nhượng bộ, đổi loại từ (4 câu · 4 phút)",
        items: [
          { q: "1. Text: “The scheme has been tried in schools in Wales, where one district reported a fall in absences.” — Statement: The scheme has been adopted by every school in Wales.", options: ["YES", "NO", "NOT GIVEN"], correct: 2, why: "schools in Wales ≠ every school in Wales. Bài không nói bao nhiêu trường ⇒ NOT GIVEN. Cùng kiểu câu 28." },
          { q: "2. Text: “The museum answered its critics not by lowering its prices but by opening on two evenings a week.” — Statement: The museum reduced the cost of admission in response to criticism.", options: ["YES", "NO", "NOT GIVEN"], correct: 1, why: "not by lowering its prices ⇒ không giảm giá ⇒ NO. Câu hỏi chép vế bị bác. Cùng kiểu câu 29." },
          { q: "3. Text: “I would not wish to deny that league tables tell parents something. My complaint is that they tell them the wrong thing with great precision.” — Statement: The writer believes league tables give parents no information at all.", options: ["YES", "NO", "NOT GIVEN"], correct: 1, why: "would not wish to deny that… tell parents something ⇒ tác giả công nhận chúng có cho thông tin. Phê bình (the wrong thing) ≠ phủ nhận ⇒ NO. Cùng kiểu câu 31." },
          { q: "4. Text: “Decisions of this kind should be taken in the open, by officials who can be removed if they get them wrong.” — Which pair of words completes the summary? “Such decisions should be made ___ by people who are ___.”", options: ["quickly · experienced", "transparently · answerable", "privately · elected"], correct: 1, why: "in the open → transparently (cụm giới từ → trạng từ); can be removed if they get them wrong → answerable (mệnh đề → tính từ). Cùng kiểu câu 38–39." },
        ],
      },

      { t: "h", text: "6. Ba bẫy lặp lại của Reading Đề 10 — mang sang Đề 11" },
      {
        t: "table",
        head: ["Bẫy", "Ở Đề 10", "Phản xạ cần có"],
        rows: [
          ["**So sánh bị đảo chiều / hai tiêu chí**", "câu 1 (dài ≠ sâu) · câu 3 (S chậm hơn ⇒ P nhanh hơn) · câu 21 (ai nói trước)", "gặp -er, than, the … of the two, earlier, since ⇒ viết ra giấy: A > B theo tiêu chí gì?"],
          ["**Phạm vi bị nới**", "câu 4 (one of the first → the first) · câu 28 (American courts → every state)", "khoanh chữ tuyệt đối trong CÂU HỎI (every, the first, only, all) rồi tìm đúng chữ ấy hoặc chữ tương đương trong bài"],
          ["**Phê bình ≠ phủ nhận**", "câu 29 · 31 · 37", "tìm câu nhượng bộ (I do not doubt… But…); phần trước but là điều tác giả công nhận"],
        ],
      },
      { t: "rule", formula: "so sánh ⇒ viết A > B theo tiêu chí gì   ·   chữ tuyệt đối trong câu hỏi ⇒ tìm chữ tương đương trong bài   ·   I do not doubt X, but Y ⇒ tác giả CÔNG NHẬN X", vi: "Ba phản xạ này lấy lại được 3–4 câu ở mỗi đề band 7.5 – 8." },

      { t: "h", text: "7. Luyện lại — bài mới, 18 phút, Questions 1–14" },
      { t: "p", text: "Đặt đồng hồ **18:00**. Đọc một lượt, ghi lề 3–5 chữ cho mỗi đoạn. Không tra từ. Bài có đủ ba bẫy của mục 6. Bài tự soạn; các mốc lịch sử (Plimsoll, luật 1876, vạch cố định năm 1890, công ước 1930) là chuyện có thật, kể gọn và làm tròn — muốn trích dẫn thì đối chiếu thêm sách sử hàng hải." },
      {
        t: "passage", title: "The Line on the Hull", intro: "How a mark painted on the side of a ship came to be law",
        paras: [
          { label: "A", text: "Look at the side of almost any cargo ship in port and you will find, roughly halfway along the hull, a circle about thirty centimetres across with a horizontal line drawn through its centre. It is easy to overlook, and it is one of the more consequential pieces of paint in the world. When the ship is loaded, the water must not rise above that line. The rule sounds too obvious to need stating, let alone enforcing. Yet for most of the nineteenth century no such rule existed in Britain, which then owned the largest merchant fleet on earth, and the campaign to introduce one took the better part of a decade and very nearly failed." },
          { label: "B", text: "The danger was not new, and neither was the remedy. Medieval Venice is said to have required a cross to be marked on the hulls of its ships, and in the 1830s a society of London insurers had recommended a simple rule linking the depth of a vessel's hold to the height of hull that ought to remain above the water. But the recommendation bound nobody. What had changed by the 1860s was not the sea but the economics of going to sea. A vessel could now be insured for more than it was worth, so that an owner whose ageing ship went down with its cargo might end the year richer than one whose ship came home. Sailors had a name for vessels sent out in this condition: coffin ships. They also had very little choice, for a seaman who had signed on and then refused to sail could be sent to prison, and some were." },
          { label: "C", text: "The man whose name the line now bears was not a sailor, and he was not the first to propose it. Samuel Plimsoll was a coal merchant who had gone bankrupt as a young man and had lived for a time in the cheapest lodgings in London, an experience to which he later attributed his sympathy for the poor. Elected to Parliament in 1868, he took up a proposal already drafted by James Hall, a shipowner from the north-east of England who believed that his less scrupulous competitors were ruining the trade. Hall supplied the idea and much of the evidence. What Plimsoll supplied was noise. His book Our Seamen, published in 1873, was not a careful piece of work: it mixed statistics with rumour and accused named individuals, several of whom took him to court. It was, however, read everywhere, and it turned a technical question into a moral one." },
          { label: "D", text: "Parliament was a harder audience than the public. A good many of its members owned ships, and the objections they raised were not all self-serving. A fixed line, it was argued, would treat a new iron steamer and an old wooden sailing vessel alike; it would hand an advantage to foreign fleets that observed no such limit; and it would transfer responsibility from the owner, who knew his ship, to an official, who did not. In 1875 the government, short of time, abandoned a bill that would have introduced inspections. Plimsoll's reaction has become the best-known episode in the story. He stood in the chamber, called some of his fellow members villains, and shook his fist at the Speaker. He was made to apologise. But the outburst was reported in every newspaper, public meetings were held across the country, and within weeks the government had passed a temporary measure, followed by a full Act in 1876." },
          { label: "E", text: "It is usually at this point that the story is brought to a close, and it is the wrong point. The Act of 1876 did require every British ship to carry a load line. What it did not say was where the line should go. That decision was left to the owner, and at least one captain is reported to have painted his on the funnel. Only in 1890 was the position fixed by an official body according to published tables, and only then did the mark begin to do what its supporters had promised. Plimsoll had by that time left Parliament. The fourteen years between the two dates are a useful reminder that a rule can be won in principle and lost in detail." },
          { label: "F", text: "The modern mark is a more elaborate thing than the circle and line of the 1870s. Beside it stands a ladder of shorter lines, each labelled with letters, because the depth to which a ship may safely be loaded is not a single figure. Fresh water is less dense than salt water, so a ship floats lower in a river than at sea; a vessel loading in a river port may therefore be allowed to sink beyond its sea-water line, on the understanding that it will rise again as it reaches the ocean. Season and region matter as well. Calm tropical waters permit a heavier load than the same ship could carry across the North Atlantic in winter, where the lowest line of all, and therefore the lightest load, applies. These distinctions were agreed between the major shipping nations in 1930, since when the mark has been, in effect, international law." },
          { label: "G", text: "The name survives in one other place. In Britain a light canvas shoe with a rubber sole is called a plimsoll, apparently because the band where the rubber meets the canvas recalled the line on a hull: let the water rise above it, and the wearer gets wet feet. It is a modest monument, and perhaps a fitting one. The line itself is not a sophisticated idea. Its history suggests that what stood between an obvious remedy and its adoption was never ignorance; it was the fact that those who bore the risk and those who took the decision were not the same people." },
        ],
      },
      { t: "p", text: "**Questions 1–5** — Do the following statements agree with the information given in the passage? Choose **TRUE**, **FALSE** or **NOT GIVEN**." },
      {
        t: "mcq", id: "t5d17-doc-tfng", title: "Questions 1–5 — TRUE / FALSE / NOT GIVEN",
        items: [
          { q: "1. Before the 1860s, nobody had suggested limiting how deeply a ship could be loaded.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 1, why: "Đoạn B: “The danger was not new, and neither was the remedy” — Venice thời trung cổ và nhóm bảo hiểm London thập niên 1830 đều đã đề xuất ⇒ FALSE. Bẫy: “the recommendation bound nobody” có chữ nobody, nhưng nghĩa là không ai BỊ RÀNG BUỘC, không phải không ai đề xuất." },
          { q: "2. By the 1860s, it was possible for an owner to gain financially from the loss of a ship.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 0, why: "Đoạn B: “an owner whose ageing ship went down… might end the year richer than one whose ship came home” ⇒ TRUE. Paraphrase mức 4 (đổi góc nhìn): không có chữ profit / gain trong bài." },
          { q: "3. James Hall became involved in the campaign for a load line later than Plimsoll did.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 1, why: "Đoạn C: Plimsoll “took up a proposal **already drafted** by James Hall” ⇒ Hall có trước ⇒ FALSE. So sánh thời gian bị đảo chiều — kiểu câu 21 của Đề 10. Thêm: “he was not the first to propose it”." },
          { q: "4. Most of the people named in Our Seamen won their cases against Plimsoll.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 2, why: "Bài chỉ nói “several of whom took him to court”; không nói ai thắng ⇒ NOT GIVEN. Hai lần lệch: several ≠ most; kiện ≠ thắng kiện." },
          { q: "5. The shipowners in Parliament objected to a fixed line purely in order to protect their own interests.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 1, why: "Đoạn D: “the objections they raised were **not all self-serving**” ⇒ có những phản đối không vì lợi riêng ⇒ trái với purely ⇒ FALSE. Phạm vi bị nới: not all → purely." },
        ],
      },
      { t: "p", text: "**Questions 6–9** — Answer the questions below. Choose **NO MORE THAN TWO WORDS AND/OR A NUMBER** from the passage for each answer." },
      {
        t: "quiz", id: "t5d17-doc-short", kind: "fill", title: "Questions 6–9 — NO MORE THAN TWO WORDS AND/OR A NUMBER",
        items: [
          { q: "6. What term did sailors use for ships that put to sea in an unsafe state?", answers: ["coffin ships"], hint: "Đoạn B: “Sailors had a name for vessels sent out in this condition: coffin ships.” — used a term for = had a name for." },
          { q: "7. According to the writer, what did Plimsoll, rather than Hall, bring to the campaign?", answers: ["noise"], hint: "Đoạn C: “Hall supplied the idea and much of the evidence. What Plimsoll supplied was noise.” — idea và evidence thuộc về Hall. Câu chẻ What… was… dồn ánh sáng vào noise." },
          { q: "8. On which part of a ship is one captain said to have put his load line?", answers: ["funnel", "the funnel"], hint: "Đoạn E: “at least one captain is reported to have painted his on the funnel”. — is said to = is reported to." },
          { q: "9. In which year was the position of the line first settled by an official body?", answers: ["1890"], hint: "Đoạn E: “Only in 1890 was the position fixed by an official body”. Bẫy: 1876 (luật bắt buộc CÓ vạch, chưa định vị trí) · 1875 (biện pháp tạm) · 1930 (thoả thuận quốc tế)." },
        ],
      },
      { t: "p", text: "**Questions 10–14** — Complete the summary using the list of words, **A–I**, below. Mỗi từ dùng nhiều nhất một lần; có bốn từ thừa." },
      {
        t: "note", title: "The modern load line",
        items: [
          "Today's mark is made up of several lines because the depth to which a ship can safely be loaded **10** ___ according to conditions. A ship sits **11** ___ in fresh water than in the sea, and so additional loading may be **12** ___ in a river port. In tropical regions the sea tends to be **13** ___, which makes a heavier load acceptable, whereas the most **14** ___ limit is the one that applies to winter crossings of the North Atlantic.",
        ],
      },
      {
        t: "table", caption: "List of words",
        head: ["A", "B", "C", "D", "E", "F", "G", "H", "I"],
        rows: [["deeper", "varies", "permitted", "rougher", "restrictive", "calmer", "higher", "forbidden", "generous"]],
      },
      {
        t: "quiz", id: "t5d17-doc-hop-tu", kind: "fill", title: "Questions 10–14 — gõ chữ cái A–I",
        items: [
          { q: "10.", answers: ["B"], hint: "“is not a single figure” ⇒ varies. Phủ định + danh từ → động từ (mức 3)." },
          { q: "11.", answers: ["A"], hint: "“a ship floats lower in a river than at sea” ⇒ sits deeper. Bẫy G higher: nước dâng CAO hơn trên thân tàu, nhưng con tàu thì chìm SÂU hơn." },
          { q: "12.", answers: ["C"], hint: "“may therefore be allowed to sink beyond its sea-water line” ⇒ permitted. Bẫy H forbidden: ngược nghĩa." },
          { q: "13.", answers: ["F"], hint: "“Calm tropical waters” ⇒ calmer. Tính từ gốc → so sánh hơn. Bẫy D rougher thuộc về Bắc Đại Tây Dương mùa đông." },
          { q: "14.", answers: ["E"], hint: "“the lowest line of all, and therefore the lightest load” ⇒ giới hạn ngặt nhất ⇒ restrictive. Ý ẩn (mức 4): vạch thấp nhất = được chở ít nhất. Bẫy I generous: ngược nghĩa." },
        ],
      },

      { t: "h", text: "8. Chấm điểm — và bảng paraphrase của bài mới" },
      {
        t: "table",
        head: ["Điểm", "Nghĩa là", "Việc tiếp theo"],
        rows: [
          ["13–14", "ba phản xạ của mục 6 đã thành thói quen", "sang Bài 3; Ngày 19 làm Reading đủ 3 passage lần 2"],
          ["11–12", "còn dính một kiểu bẫy", "xem câu sai thuộc bẫy nào, làm lại mcq “Luyện ngay” của mục đó"],
          ["≤ 10", "paraphrase mức 4 chưa vững", "ôn Tập 5 Ngày 1 Bài 2 (đọc mức chắc chắn) và Ngày 3 Bài 2 (chẻ câu hỏi), rồi làm lại bài này sau 3 ngày"],
        ],
      },
      {
        t: "table", caption: "Bảy cặp paraphrase đáng chép vào sổ",
        head: ["Bài viết", "Câu hỏi", "Phép đổi"],
        rows: [
          ["neither was the remedy", "nobody had suggested limiting… (FALSE)", "phủ định kép: not new + neither ⇒ đã có từ trước"],
          ["might end the year richer than one whose ship came home", "gain financially from the loss of a ship", "đổi góc nhìn + ví dụ → khái niệm"],
          ["took up a proposal already drafted by", "became involved… later than (FALSE)", "đảo chiều thời gian"],
          ["not all self-serving", "purely… to protect their own interests (FALSE)", "phạm vi: not all ↔ purely"],
          ["is reported to have painted", "is said to have put", "đồng nghĩa (khuôn tường thuật bị động)"],
          ["is not a single figure", "varies according to conditions", "phủ định + danh từ → động từ"],
          ["the lowest line of all, and therefore the lightest load", "the most restrictive limit", "ý ẩn"],
        ],
      },
      {
        t: "note", title: "💡 Mẹo — đọc câu chủ đề của đoạn E và G như người ra đề",
        items: [
          "Đoạn E mở bằng: “It is usually at this point that the story is brought to a close, and it is the wrong point.” Một câu chẻ + một nhận định. Người ra đề sẽ đặt câu hỏi ở ==phần sau nhận định ấy== (câu 8, 9).",
          "Đoạn G kết bằng “was never ignorance; it was the fact that…”. Đây là khuôn not X but Y của mục 2. Nếu bài có câu YNNG, nó sẽ hỏi: “The line was adopted late because people did not understand the danger” ⇒ NO.",
          "Thói quen band 8: mỗi khi gặp not X but Y, gạch chân Y và viết chữ “bẫy” cạnh X.",
        ],
      },

      { t: "h", text: "9. Soi lại bài đọc bằng ngữ pháp Bài 1 — mạo từ và số nhiều của người viết giỏi" },
      { t: "p", text: "Bài 1 hôm nay dạy bốn loại lỗi nhỏ. Bài đọc trên dài 950 từ và không có lỗi nào. Sáu câu dưới lấy từ bài; chọn dạng đúng rồi mở lại bài để kiểm." },
      {
        t: "mcq", id: "t5d17-doc-soi", title: "Chọn dạng tác giả đã dùng (6 câu)",
        items: [
          { q: "1. ___ is less dense than salt water.", options: ["The fresh water", "Fresh water", "A fresh water"], correct: 1, why: "Nói chung về một chất không đếm được ⇒ không mạo từ — Bài 1 mục 2 tình huống ①." },
          { q: "2. …which then owned ___ on earth.", options: ["largest merchant fleet", "a largest merchant fleet", "the largest merchant fleet"], correct: 2, why: "So sánh nhất ⇒ the." },
          { q: "3. …an experience ___ he later attributed his sympathy for the poor.", options: ["to which", "in which", "which"], correct: 0, why: "attribute something TO an experience ⇒ to which — Bài 1 mục 4 vùng ③. the poor = the + tính từ (tình huống ⑤)." },
          { q: "4. Hall supplied the idea and much of the ___.", options: ["evidences", "evidence", "an evidence"], correct: 1, why: "evidence không đếm được; much of the evidence — Bài 1 mục 3 bảng ①." },
          { q: "5. Calm tropical waters permit a heavier load than the same ship could carry across the North Atlantic ___ winter.", options: ["on", "at", "in"], correct: 2, why: "in + mùa." },
          { q: "6. The line itself is not a sophisticated idea___ Its history suggests that…", options: [", (dấu phẩy)", ". (dấu chấm)", "không dấu"], correct: 1, why: "Hai câu đủ chủ – vị ⇒ không nối bằng phẩy — Bài 1 mục 5 luật ①." },
        ],
      },

      { t: "h", text: "10. Từ vựng hữu ích từ Đề 10 và bài mới" },
      {
        t: "vocab",
        items: [
          { w: "vindicate", pos: "v", ipa: "/ˈvɪndɪkeɪt/", vi: "chứng tỏ (ai / điều gì) đã đúng", ex: "The new data seemed to vindicate her earlier warning.", exVi: "Số liệu mới dường như chứng tỏ lời cảnh báo trước đó của bà là đúng.", more: "be vindicated by events · N: vindication. Trong bài đọc, thấy vindicate ⇒ có một ý CŨ vừa được xác nhận." },
          { w: "even-handed", pos: "adj", ipa: "/ˌiːvn ˈhændɪd/", vi: "công bằng, không thiên vị bên nào", ex: "The report is an even-handed account of both sides of the dispute.", exVi: "Bản báo cáo trình bày công bằng cả hai phía của vụ tranh chấp.", more: "an even-handed approach / treatment · gần nghĩa: impartial, balanced" },
          { w: "scrupulously", pos: "adv", ipa: "/ˈskruːpjələsli/", vi: "một cách cực kỳ cẩn thận, ngay thẳng", ex: "The figures were scrupulously checked before publication.", exVi: "Các con số được kiểm tra hết sức cẩn thận trước khi công bố.", more: "scrupulously fair / honest / clean · trái: unscrupulous (bất chấp đạo lý) — less scrupulous competitors" },
          { w: "entail", pos: "v", ipa: "/ɪnˈteɪl/", vi: "kéo theo, đòi hỏi (như một hệ quả tất yếu)", ex: "Cutting class sizes would entail hiring thousands of teachers.", exVi: "Giảm sĩ số lớp sẽ kéo theo việc tuyển hàng nghìn giáo viên.", more: "entail + N / V-ing (không entail to V) · trang trọng hơn involve" },
          { w: "deflect", pos: "v", ipa: "/dɪˈflekt/", vi: "làm chệch hướng; lái (sự chú ý, lời chỉ trích) sang hướng khác", ex: "The minister tried to deflect criticism by blaming the weather.", exVi: "Bộ trưởng cố lái lời chỉ trích sang hướng khác bằng cách đổ cho thời tiết.", more: "deflect attention / blame / a question from sth" },
          { w: "overturn", pos: "v", ipa: "/ˌəʊvəˈtɜːn/", vi: "lật lại, huỷ (một quyết định, bản án)", ex: "The decision was overturned on appeal.", exVi: "Quyết định đã bị huỷ ở phiên phúc thẩm.", more: "overturn a ruling / a ban / a verdict · câu 40 của Đề 10: the authority to overturn it = the power to reverse it" },
          { w: "fragmentary", pos: "adj", ipa: "/ˈfræɡməntri/", vi: "rời rạc, chắp vá, không đầy đủ", ex: "Our knowledge of the period is based on fragmentary records.", exVi: "Hiểu biết của chúng ta về giai đoạn ấy dựa trên những ghi chép rời rạc.", more: "fragmentary evidence / records / material · N: fragment · Passage 2 của Đề 10: given only fragmentary material to work with" },
          { w: "seaworthy", pos: "adj", ipa: "/ˈsiːwɜːði/", vi: "(tàu) đủ điều kiện đi biển", ex: "Inspectors refused to certify the vessel as seaworthy.", exVi: "Thanh tra từ chối chứng nhận con tàu đủ điều kiện đi biển.", more: "trái: unseaworthy · cùng khuôn -worthy: roadworthy, trustworthy, newsworthy" },
          { w: "self-serving", pos: "adj", ipa: "/ˌself ˈsɜːvɪŋ/", vi: "vụ lợi, chỉ phục vụ lợi ích của chính mình", ex: "Not every objection from the industry was self-serving.", exVi: "Không phải mọi phản đối từ ngành này đều vụ lợi.", more: "a self-serving argument / excuse · dùng để PHÊ BÌNH; trung tính hơn: in their own interest" },
          { w: "outburst", pos: "n", ipa: "/ˈaʊtbɜːst/", vi: "cơn bùng nổ (giận dữ, cảm xúc)", ex: "His outburst in the meeting was reported in every newspaper.", exVi: "Cơn bùng nổ của ông trong cuộc họp được mọi tờ báo đưa tin.", more: "an angry / emotional outburst · an outburst of anger / laughter" },
        ],
      },
      {
        t: "note", title: "📌 Việc sau buổi mổ",
        items: [
          "Sổ lỗi: mỗi câu sai của Đề 10 một dòng — số câu · nhãn R · cặp paraphrase · phép đổi. Mười dòng là đủ.",
          "Nếu nhãn R5 (hết giờ, vượt giới hạn từ) xuất hiện từ 2 lần: Ngày 19 làm Reading 3 passage với nhịp 17 – 20 – 20 và 3 phút soát giới hạn từ.",
          "Đọc lại Passage 3 của Đề 10 một lần nữa chỉ để tìm bốn chỗ tác giả nhượng bộ. Chép hai câu bạn thích vào sổ Writing — chúng dùng được cho Task 2.",
        ],
      },
    ],
  },
  /* ════════════════ BÀI 3 — NGHE (nội dung mới, không mổ đề) ════════════════ */
  {
    id: "t5d17-nghe",
    kind: "listening",
    title: "Nghe Part 2 tốc độ thật: người bản ngữ KỂ về một sự kiện ở một nơi chốn (giọng Úc) + một cuộc trao đổi nối tiếp (giọng Ireland · Canada) → mượn khung để nói Part 2 nơi chốn / sự kiện band 8 và Part 3 nối; ngữ điệu kể chuyện",
    goal: "Làm đúng ít nhất 13/15 câu của một bài Part 2 khoảng 3 phút rưỡi (~175 từ/phút, giọng Úc: multiple choice + matching) và một cuộc trao đổi hai người (giọng Ireland và Canada: ai nêu ý nào); nghe ra ba thứ người kể giỏi luôn làm — đổi ống kính, đổi thì, chen lời bình — rồi dùng chính ba thứ ấy để nói một thẻ Part 2 về nơi chốn / sự kiện trọn 2 phút ở band 8, nối sang Part 3 không gãy, với ngữ điệu kể chuyện có lên, có xuống, có chỗ ngừng.",
    minutes: 85,
    blocks: [
      {
        t: "recap", title: "Bài này học gì · đẩy tiêu chí nào",
        items: [
          "Bài nghe hôm nay là ==nội dung mới==, không mổ đề. (Listening Đề 10 bạn tự mổ theo mục 8 của Ngày 16; Speaking Đề 10 mổ ở Ngày 22.)",
          "**Listening**: Part 2 ở tốc độ thật, người nói vừa kể chuyện vừa đưa thông tin ⇒ đáp án hay nằm sau một câu sửa (not… as people assume · not Friday as it says…). Đẩy điểm Part 2 lên 9–10/10.",
          "**Speaking Part 2 nơi chốn / sự kiện**: band 7 trả lời đủ bốn gợi ý. Band 8 ==dựng một cảnh==: toàn cảnh → cận cảnh → âm thanh; thì đổi theo việc; có lời bình chen. Bạn học bằng cách nghe người bản ngữ làm đúng như thế.",
          "**Part 3 nối**: từ chuyện của mình sang chuyện chung bằng ba cây cầu (mục 9). Nối lại Tập 5 Ngày 7 (chi tiết cảm quan), Ngày 13 (Part 3 trừu tượng), Ngày 14 (thẻ hiếm, chặng “nhìn lại”).",
          "🔊 **Ngữ điệu kể chuyện band 8**: lên ở vế chưa xong, xuống ở câu chốt, chậm và ngừng trước cao trào, hạ giọng ở lời chen. Nối Tập 5 Ngày 7 (giọng kể) và Ngày 13 (pause mang nghĩa).",
        ],
      },

      { t: "h", text: "1. Part 2 về nơi chốn / sự kiện — band 7 và band 8 khác nhau ở đâu" },
      {
        t: "table",
        head: ["", "Band 7", "Band 8"],
        rows: [
          ["Nội dung", "đi lần lượt bốn gợi ý trên thẻ; mỗi gợi ý 2–3 câu", "trả lời đủ bốn gợi ý nhưng xoay quanh ==một cảnh== người nghe hình dung được"],
          ["Thì", "một thì suốt bài (toàn quá khứ đơn, hoặc toàn hiện tại)", "đổi thì theo việc: would cho lệ hằng năm · quá khứ tiếp diễn cho nền · quá khứ hoàn thành để lùi lại · hiện tại cho điều vẫn đúng"],
          ["Từ vựng", "tính từ chung: beautiful, crowded, interesting, exciting", "chi tiết cụ thể thay tính từ: the mist was still sitting on the water"],
          ["Mạch", "First… Second… Finally…", "ống kính: xa → gần → một âm thanh; lời bình chen (which, looking back, …)"],
          ["Giọng", "đều; mọi câu cùng một độ cao", "lên ở chỗ chưa xong, xuống ở chỗ chốt, có một chỗ chậm hẳn lại"],
        ],
      },
      {
        t: "note", title: "💡 Cách học: nghe để “ăn cắp” khung, không phải để chép từ",
        items: [
          "Lượt 1: làm câu hỏi như đi thi (mục 5). Lượt 2: mở lời thoại, đánh dấu ba thứ ở mục 2. Lượt 3: tắt lời thoại, nói đuổi theo đoạn kể (shadowing) để bắt ngữ điệu.",
          "Đừng học thuộc câu của người nói. Lấy ==khuôn==: You could hear it before you could see it → You could smell it before you got there.",
        ],
      },

      { t: "h", text: "2. Ba thứ phải nghe ra trong một bài kể" },
      {
        t: "table",
        head: ["Thứ", "Người kể làm gì", "Dấu hiệu khi nghe", "Vì sao đáng điểm"],
        rows: [
          ["① **Ống kính**", "đi từ toàn cảnh (nơi nào, mùa nào) vào một điểm (một chiếc bè, một người) rồi tới một âm thanh hay mùi", "Let me tell you what it's actually like · I remember… · you could hear / see / smell", "LR: từ cụ thể, ít gặp · FC: mạch tự nhiên không cần First / Second"],
          ["② **Thì**", "would / used to cho việc lặp lại · had + V3 cho việc xảy ra trước cảnh chính · was / were + V-ing cho nền · hiện tại khi quay về bây giờ", "We'd got there far too early · the mist was still sitting · They were still paddling", "GRA: nhiều cấu trúc, dùng có lý do"],
          ["③ **Lời bình chen**", "dừng câu chuyện nửa giây để nói mình nghĩ gì", "which, if you'd told my nine-year-old self, … · frankly · I think · not, as people tend to assume, …", "FC + P: nghe như người thật đang nghĩ; kèm một lần hạ giọng"],
        ],
      },
      {
        t: "patterns",
        rows: [
          { formula: "You could + V (giác quan) + it + before + you could + V + it", vi: "Mở cận cảnh bằng một giác quan đến trước giác quan kia.", examples: [{ en: "You could smell the incense before you could see the temple.", vi: "Bạn ngửi thấy mùi hương trước khi nhìn thấy ngôi chùa." }] },
          { formula: "What actually happened was (that) + S + V", vi: "Sửa một cách hiểu quen thuộc — đáp án Listening hay nằm ngay sau khuôn này.", examples: [{ en: "What actually happened was that the organisers ran out of tickets by noon.", vi: "Chuyện thật là ban tổ chức hết vé từ trưa." }] },
          { formula: "It was only + mốc thời gian + that + S + V", vi: "Câu chẻ thời gian: việc xảy ra muộn hơn người ta tưởng.", examples: [{ en: "It was only the following year that they started charging.", vi: "Phải tới năm sau họ mới bắt đầu thu tiền." }] },
          { formula: "S + V, + which, + lời bình, + V", vi: "Lời bình chen bằng which — hạ giọng ở phần giữa hai dấu phẩy.", examples: [{ en: "This year I'm one of the organisers, which, if I'm honest, still surprises me.", vi: "Năm nay tôi là một trong những người tổ chức, mà nói thật là tôi vẫn còn ngạc nhiên." }] },
        ],
      },
      { t: "rule", formula: "toàn cảnh (would / every year)  →  một cảnh (had V3 · was V-ing · V2)  →  một giác quan  →  lời bình  →  quay về hiện tại", vi: "Đây vừa là thứ để NGHE ra, vừa là khung để NÓI ở mục 8." },

      { t: "h", text: "3. 🔊 Ngữ điệu kể chuyện band 8 — lên, xuống, chậm, ngừng" },
      { t: "p", text: "Tập 5 Ngày 7 dạy giọng kể ở mức cơ bản: đừng đọc đều. Ngày 13 dạy chỗ ngừng. Hôm nay ghép lại thành bốn động tác của người kể chuyện. Ký hiệu: ↗ lên · ↘ xuống · | ngừng ngắn · … chậm lại." },
      {
        t: "table",
        head: ["Động tác", "Khi nào", "Ví dụ", "Người Việt hay sai"],
        rows: [
          ["**Lên ở vế chưa xong**", "sau mỗi vế, mỗi mục liệt kê mà câu còn tiếp", "We'd got there far too ↗early, | the mist was still on the ↗water, | and for a long time nothing ↘happened.", "xuống giọng ở mỗi dấu phẩy ⇒ nghe như ba câu rời"],
          ["**Xuống ở câu chốt**", "câu ngắn cuối đoạn, câu mang cảm xúc", "I've never for↘gotten that.", "lên giọng ở cuối (như hỏi) ⇒ mất sức nặng"],
          ["**Chậm + ngừng trước cao trào**", "ngay trước chi tiết bất ngờ", "And then, | from round the bend, | … this thing came into ↘view.", "nói nhanh lên vì sợ quên ⇒ cao trào trôi mất"],
          ["**Hạ giọng ở lời chen**", "phần giữa hai dấu phẩy không thuộc mạch chính", "It wasn't, | (thấp) as people assume, | a ↘fundraiser.", "nói lời chen to như câu chính ⇒ người nghe lạc"],
          ["**Cao giọng ở lời thoại**", "khi thuật lại lời ai đó", "He looked at me and said, | (cao hơn) “You're ↘late.”", "thuật lời bằng giọng của chính mình ⇒ không biết ai nói"],
        ],
      },
      {
        t: "phatam", id: "t5d17-phat-am", title: "Luyện phát âm — ngữ điệu kể chuyện: lên ở vế chưa xong, xuống ở câu chốt",
        note: "Đọc theo ký hiệu trong phần dịch: ↗ lên, ↘ xuống, | ngừng ngắn. Thu âm rồi nghe lại: nếu mọi dấu phẩy đều xuống giọng thì bạn đang đọc, chưa kể. Câu 5 và câu 7 có phần phải đổi độ cao (hạ ở lời chen, nâng ở lời thoại).",
        items: [
          { text: "We'd got there far too early, and for a long time, nothing happened.", ipa: "wiːd ɡɒt ðeə fɑː tuː ɜːli ænd fɔː ə lɒŋ taɪm nʌθɪŋ hæpənd", vi: "Chúng tôi đến quá sớm, và suốt một lúc lâu, chẳng có gì xảy ra. (↗EARly | long ↗TIME | nothing ↘HAPpened)" },
          { text: "You could hear it before you could see it.", ipa: "ju kʊd hɪər ɪt bɪfɔː ju kʊd siː ɪt", vi: "Bạn nghe thấy nó trước khi nhìn thấy nó. (↗HEAR it | before you could ↘SEE it)" },
          { text: "And then, from round the bend, this thing came into view.", ipa: "ænd ðen frɒm raʊnd ðə bend ðɪs θɪŋ keɪm ɪntu vjuː", vi: "Và rồi, từ sau khúc quanh, cái thứ ấy hiện ra. (and ↗THEN | round the ↗BEND | … came into ↘VIEW — chậm lại trước this thing)" },
          { text: "The crew were still paddling.", ipa: "ðə kruː wɜː stɪl pædlɪŋ", vi: "Cả đội vẫn đang chèo. (STILL ↘PADdling — câu chốt, xuống hẳn)" },
          { text: "It wasn't, as people assume, a fundraiser.", ipa: "ɪt wɒznt æz piːpl əsjuːm ə fʌndreɪzə", vi: "Nó không phải, như mọi người vẫn tưởng, là một buổi gây quỹ. (hạ giọng ở as people assume)" },
          { text: "Every year we'd meet at the gate, wait for the bell, and run.", ipa: "evri jɪə wiːd miːt æt ðə ɡeɪt weɪt fɔː ðə bel ænd rʌn", vi: "Năm nào chúng tôi cũng gặp nhau ở cổng, chờ tiếng chuông, rồi chạy. (↗GATE | ↗BELL | and ↘RUN)" },
          { text: "He looked at me and said, you're late.", ipa: "hi lʊkt æt mi ænd sed jɔː leɪt", vi: "Thầy nhìn tôi và nói: “Em đến muộn.” (nâng giọng ở you're ↘LATE)" },
          { text: "I've never forgotten that.", ipa: "aɪv nevə fəɡɒtn ðæt", vi: "Tôi chưa bao giờ quên điều đó. (NEver for↘GOTten that — chậm, xuống)" },
        ],
      },
      {
        t: "mcq", id: "t5d17-nghe-ngu-dieu", title: "Ngữ điệu kể chuyện — chọn phương án đúng (4 câu)",
        items: [
          { q: "1. “The gates opened, the crowd moved forward, and the music started.” Giọng ở opened và forward nên:", options: ["xuống, vì có dấu phẩy", "lên, vì câu chưa xong", "ngang, không đổi"], correct: 1, why: "Vế chưa xong ⇒ lên; chỉ xuống ở started. Xuống ở mỗi dấu phẩy làm câu vỡ thành ba câu." },
          { q: "2. Ngay trước chi tiết bất ngờ nhất của câu chuyện, người kể giỏi thường:", options: ["nói nhanh hơn", "nói to hơn hẳn", "chậm lại và ngừng một nhịp"], correct: 2, why: "Chậm + ngừng tạo chờ đợi. Nói nhanh làm cao trào trôi qua." },
          { q: "3. “The festival, which I'd honestly never heard of, turned out to be huge.” Phần which I'd honestly never heard of nên được nói:", options: ["thấp và nhanh hơn một chút", "cao và chậm hơn", "to nhất câu"], correct: 0, why: "Lời chen nằm ngoài mạch chính ⇒ hạ giọng, lướt nhanh, rồi trở lại độ cao cũ ở turned out." },
          { q: "4. Câu chốt “I'd go back tomorrow.” kết thúc bằng giọng:", options: ["lên, để mời giám khảo hỏi tiếp", "xuống, chắc", "xuống rồi lên"], correct: 1, why: "Câu chốt mang cảm xúc ⇒ xuống hẳn. Lên giọng nghe như chưa chắc hoặc như câu hỏi." },
        ],
      },

      { t: "h", text: "4. Khởi động — Practice 1: một người kể về một nơi chốn (giọng New Zealand)" },
      { t: "p", text: "Nghe MỘT lần. Đọc bốn câu hỏi trước trong 15 giây. Để ý chỗ người nói đổi từ would (thói quen) sang quá khứ đơn (một lần cụ thể)." },
      {
        t: "listen", id: "t5d17-nghe-ngan", title: "Practice 1 — The wharf at Kereru Bay",
        dan: { so: "Day 17, Recording 1", boiCanh: "a man describing a place he knew as a child.", cau: [1, 4] },
        lines: [
          { who: "Tane", voice: "nz-nam", text: "The place I always think of is the old wharf at Kereru Bay. It's not much to look at — about sixty metres of grey timber sticking out into the water, with a rusty crane at the far end that hasn't worked since before I was born. But when I was a kid, we'd be down there every evening in summer. My grandfather would bring two fishing lines and a tin of bait, and we'd sit with our legs over the edge, not saying much." },
          { who: "Tane", voice: "nz-nam", text: "The evening I remember best, we hadn't caught a thing. The light was going, and I was starting to complain, when the water under the wharf suddenly went silver. It was a school of mackerel, thousands of them, and for about a minute you could have filled a bucket without a hook. And then they were gone. My grandfather just laughed and said, “Well, that's the sea for you.” The wharf's still there, by the way. They talked about pulling it down in 2011, but the locals wouldn't have it." },
        ],
      },
      {
        t: "quiz", id: "t5d17-nghe-ngan-dien", kind: "fill", title: "Practice 1 — Questions 1–4. ONE WORD OR A NUMBER",
        items: [
          { q: "1. Length of the wharf: about ___ metres", answers: ["60", "sixty"], hint: "about sixty metres of grey timber. Cẩn thận sixty / sixteen." },
          { q: "2. At the far end of the wharf there is an old ___.", answers: ["crane"], hint: "a rusty crane at the far end." },
          { q: "3. The fish that appeared under the wharf were ___.", answers: ["mackerel"], hint: "a school of mackerel. Chính tả: m-a-c-k-e-r-e-l (số nhiều không đổi)." },
          { q: "4. There was a plan to demolish the wharf in ___.", answers: ["2011"], hint: "They talked about pulling it down in 2011 — pull down = demolish." },
        ],
      },
      {
        t: "table", caption: "Ba thứ của mục 2 trong 175 từ",
        head: ["Thứ", "Trong bài"],
        rows: [
          ["Ống kính", "sáu mươi mét gỗ xám → cần cẩu gỉ → hai chân thõng xuống mép cầu → mặt nước “went silver”"],
          ["Thì", "we'd be down there · would bring (thói quen) → we hadn't caught a thing (lùi lại) → The light was going (nền) → went silver (việc xảy ra) → The wharf's still there (hiện tại)"],
          ["Lời bình + lời thoại", "It's not much to look at — · “Well, that's the sea for you.” · by the way"],
        ],
      },

      { t: "h", text: "5. Bài chính — Part 2, Questions 11–20 (giọng Úc)" },
      { t: "p", text: "Bạn có 30 giây đọc câu 11–15 và 20 giây đọc câu 16–20. Gạch chân **first** (câu 11), **most** (câu 12), **this year** (câu 13–15). Nghe MỘT lần." },
      {
        t: "listen", id: "t5d17-nghe-bai", title: "Part 2 — The Tallow Creek Raft Race",
        dan: { so: "Day 17, Recording 2", boiCanh: "a presenter on a community radio station talking about an annual raft race.", cau: [11, 20] },
        lines: [
          { who: "Presenter", voice: "au-nu", text: "Good morning, and welcome back to Around the Valley. Now, if you've driven through Tallow Creek lately, you'll have seen the banners, so you know what's coming: the raft race is on again, the first Saturday of March. I've been going since I was nine, and this year I'm one of the organisers, which, if you'd told my nine-year-old self, she wouldn't have believed." },
          { who: "Presenter", voice: "au-nu", text: "For anyone new to the district, the idea is simple. Teams of four build a raft out of whatever they can find — the only things you may not use are a proper boat hull and an engine — and then they try to get it two kilometres down the creek without sinking. It started back in 1987, and not, as people tend to assume, as a fundraiser. What actually happened was that the footbridge had been washed out in a flood, the council was taking forever to replace it, and a couple of dairy farmers floated across on oil drums to make a point. It was only the following year that someone thought to charge an entry fee, and since then the money has gone to the volunteer fire brigade." },
          { who: "Presenter", voice: "au-nu", text: "Let me tell you what it's actually like, because the photos don't do it justice. I remember my first one. We'd got there far too early, the mist was still sitting on the water, and for a long time nothing happened. And then, from round the bend, you could hear it before you could see it — drums, somebody's trumpet, a lot of shouting — and this thing came into view that was, I think, meant to be a pirate ship, and it was already going down. The crew were still paddling. They were up to their waists in water, and still paddling. I've never forgotten that." },
          { who: "Presenter", voice: "au-nu", text: "Now, a few changes this year. We've had up to sixty rafts in the past, but after last year, when the creek was so crowded that nobody could steer, we've capped it at forty-five. Entries close this Wednesday, not Friday as it says on the old posters. And life jackets, which used to be recommended, are now compulsory for every crew member. No jacket, no start." },
          { who: "Presenter", voice: "au-nu", text: "If you're coming to watch, here's how the course works. The start is at the new footbridge, and that's where the costumes are judged, so get there by nine if that's what you're after. From there the creek narrows through what we call the Squeeze. It's the narrowest stretch, it's hard to see from the bank, and frankly I'd skip it. The place to be is Miller's Bend. The water slows right down there, the bank's flat and grassy, and it's where I'd take small children, because nothing dramatic happens and there's shade." },
          { who: "Presenter", voice: "au-nu", text: "The drama is at the rapids below the bend. They're not big, but it's where most rafts come apart, and the crowd knows it. After that there's the long pool beside the showground, and that's the one section where spectators are allowed to throw water at the crews — buckets only, please, no hoses this year. And then the finish is at the boat ramp, with the prizes handed out at about one o'clock — not at the showground, as we used to do, because people kept leaving before the end." },
          { who: "Presenter", voice: "au-nu", text: "One last thing. Parking in the main street will be closed from eight, so use the showground car park, which is a gold coin donation. And bring a hat. See you on the bank." },
        ],
      },
      { t: "p", text: "**Questions 11–15** — Choose the correct letter, **A**, **B** or **C**." },
      {
        t: "mcq", id: "t5d17-nghe-chon", title: "Questions 11–15 — Multiple choice",
        items: [
          { q: "11. Why was the first raft race held?", options: ["A  to raise money for the fire brigade", "B  as a protest about a bridge", "C  to celebrate the opening of a bridge"], correct: 1, why: "“not, as people tend to assume, as a fundraiser… the footbridge had been washed out… floated across on oil drums to make a point” ⇒ B. A là điều người ta TƯỞNG; phí tham gia chỉ có từ năm sau. make a point = phản đối để chứng minh điều gì." },
          { q: "12. What does the speaker remember most about her first race?", options: ["A  the mist on the water", "B  hearing the rafts before they appeared", "C  a crew that kept paddling as their raft sank"], correct: 2, why: "Cả ba đều được kể. Câu chốt “I've never forgotten that” đứng ngay sau “still paddling” ⇒ C. Ở Part 2, đáp án cho câu hỏi most thường đi kèm một câu chốt xuống giọng." },
          { q: "13. Why has the number of rafts been limited this year?", options: ["A  The creek became too crowded for rafts to steer.", "B  Fewer teams wanted to take part.", "C  There were not enough life jackets."], correct: 0, why: "“the creek was so crowded that nobody could steer, we've capped it at forty-five” ⇒ A. cap = đặt mức trần." },
          { q: "14. Entries for this year's race must be in by", options: ["A  Wednesday.", "B  Friday.", "C  Saturday."], correct: 0, why: "“Entries close this Wednesday, not Friday as it says on the old posters.” Friday là thông tin cũ bị sửa; Saturday là ngày đua." },
          { q: "15. What has changed about life jackets?", options: ["A  They are now provided free of charge.", "B  Every member of a crew now has to wear one.", "C  They are now recommended for children only."], correct: 1, why: "“which used to be recommended, are now compulsory for every crew member” ⇒ B. recommended là quy định CŨ." },
        ],
      },
      { t: "p", text: "**Questions 16–20** — What does the speaker say about each of the following parts of the course? Choose **FIVE** answers from the box and write the correct letter, **A–G**." },
      {
        t: "table", caption: "Comments",
        head: ["", ""],
        rows: [
          ["A", "Costumes are judged here."],
          ["B", "Rafts most often break up here."],
          ["C", "Spectators may throw water here."],
          ["D", "It is the best place for young children."],
          ["E", "It is difficult to watch from the bank."],
          ["F", "The prizes are presented here."],
          ["G", "Food is on sale here."],
        ],
      },
      {
        t: "quiz", id: "t5d17-nghe-noi", kind: "fill", title: "Questions 16–20 — gõ chữ cái A–G",
        items: [
          { q: "16. the footbridge", answers: ["A"], hint: "“The start is at the new footbridge, and that's where the costumes are judged”." },
          { q: "17. the Squeeze", answers: ["E"], hint: "“it's hard to see from the bank, and frankly I'd skip it”. difficult to watch = hard to see." },
          { q: "18. Miller's Bend", answers: ["D"], hint: "“it's where I'd take small children”. young = small." },
          { q: "19. the rapids", answers: ["B"], hint: "“it's where most rafts come apart”. break up = come apart." },
          { q: "20. the long pool", answers: ["C"], hint: "“the one section where spectators are allowed to throw water at the crews”. Bẫy F: pool nằm cạnh showground, nhưng giải được trao ở boat ramp — “not at the showground, as we used to do”." },
        ],
      },

      { t: "h", text: "6. Sau khi nghe — bẫy ở đâu, và ba thứ của mục 2 ở đâu" },
      {
        t: "table", caption: "Năm lần người nói SỬA một thông tin — cả năm đều thành câu hỏi",
        head: ["Câu", "Thông tin cũ / điều người ta tưởng", "Thông tin đúng", "Tín hiệu"],
        rows: [
          ["11", "một buổi gây quỹ", "một cách phản đối việc chậm sửa cầu", "not, as people tend to assume, … What actually happened was…"],
          ["13", "tới sáu mươi bè", "trần bốn mươi lăm", "but after last year… we've capped it at"],
          ["14", "thứ Sáu", "thứ Tư", "not Friday as it says on the old posters"],
          ["15", "khuyến nghị", "bắt buộc", "which used to be… are now…"],
          ["20 (bẫy F)", "trao giải ở showground", "trao giải ở boat ramp", "not at the showground, as we used to do"],
        ],
      },
      {
        t: "table", caption: "Ba thứ của mục 2 trong đoạn kể (đoạn thứ ba của bài)",
        head: ["Câu trong bài", "Thứ", "Ghi chú"],
        rows: [
          ["We'd got there far too early", "thì — had + V3", "lùi lại trước cảnh chính"],
          ["the mist was still sitting on the water", "thì — nền + chi tiết thay tính từ", "không nói It was beautiful"],
          ["you could hear it before you could see it — drums, somebody's trumpet", "ống kính — âm thanh trước hình", "liệt kê ba thứ, lên – lên – xuống"],
          ["that was, I think, meant to be a pirate ship", "lời bình chen", "hạ giọng ở I think"],
          ["The crew were still paddling. They were up to their waists in water, and still paddling.", "cận cảnh + lặp có chủ ý", "lặp still paddling để nhấn — kỹ thuật của người kể, không phải nghèo từ"],
          ["I've never forgotten that.", "câu chốt, hiện tại hoàn thành", "quay về bây giờ; xuống giọng"],
        ],
      },
      {
        t: "note", title: "📌 Thang điểm của bài này",
        items: [
          "Practice 1 (4 câu) + Part 2 (10 câu) + Practice 3 ở mục 7 (5 câu) = 19 câu. Đích band 8: ≥ 17/19.",
          "Sai câu 11, 14, 15, 20: bẫy “thông tin bị sửa”. Ôn Tập 5 Ngày 9 Bài 3 (ba kiểu bẫy) và Ngày 16 Bài 3 mục 3.",
          "Sai câu 12: bạn chọn thứ nghe thấy đầu tiên. Với câu hỏi most / best / main, chờ câu chốt.",
        ],
      },

      { t: "h", text: "7. Practice 3 — cuộc trao đổi nối tiếp: hai người bàn rộng ra (giọng Ireland · Canada)" },
      { t: "p", text: "Đây là mẫu cho ==Part 3 nối==: từ một cuộc đua bè cụ thể, hai người chuyển sang hỏi vì sao sự kiện địa phương sống hay chết. Nghe MỘT lần. Với mỗi ý, quyết định: chỉ Declan, chỉ Renée, hay cả hai." },
      {
        t: "listen", id: "t5d17-nghe-trao-doi", title: "Practice 3 — Why some local events last",
        dan: { so: "Day 17, Recording 3", boiCanh: "a radio host, Declan, talking to a researcher, Renée, who studies small-town festivals.", cau: [21, 25] },
        lines: [
          { who: "Declan", voice: "ie-nam", text: "Renée, you study small-town festivals for a living. Is something like that raft race typical?" },
          { who: "Renée", voice: "ca-nu", text: "In one way, very. Most of the events I look at began by accident, the way that one did. Nobody sits down and designs a tradition." },
          { who: "Declan", voice: "ie-nam", text: "And yet councils try to, all the time. Every town I drive through seems to have a food festival that's about three years old." },
          { who: "Renée", voice: "ca-nu", text: "They do, and I'd say most of those won't last. Not because they're badly run — often they're run better than the old ones. It's that nobody feels they own them." },
          { who: "Declan", voice: "ie-nam", text: "I'm not sure I'd go that far. Where I grew up, the regatta was invented by the tourist board in the seventies, and people would be up in arms now if you cancelled it. Give it thirty years." },
          { who: "Renée", voice: "ca-nu", text: "That's fair. Time does a lot of the work. I'd still say it helps if locals are taking part and not just watching." },
          { who: "Declan", voice: "ie-nam", text: "On that we agree. The day it's all visitors on the bank and paid performers on the water, it's a show, not an event." },
          { who: "Renée", voice: "ca-nu", text: "Although I wouldn't blame the visitors. In most of the places I've studied, it's visitor money that keeps the thing alive." },
          { who: "Declan", voice: "ie-nam", text: "Hm. I'd have said it's the volunteers. Take them away and no amount of money replaces them." },
          { who: "Renée", voice: "ca-nu", text: "Well, you need both, I suppose. The volunteers get tired, though. That's the bit that worries me — the same twelve people every year, and they're all getting older." },
          { who: "Declan", voice: "ie-nam", text: "There, sadly, I can't argue with you." },
        ],
      },
      { t: "p", text: "**Questions 21–25** — Who expresses each of the following views? Choose **A** (Declan only), **B** (Renée only) or **C** (both of them)." },
      {
        t: "mcq", id: "t5d17-nghe-ai", title: "Questions 21–25 — Matching: whose view?",
        items: [
          { q: "21. Most events that officials have set up recently are unlikely to survive.", options: ["A  Declan only", "B  Renée only", "C  both"], correct: 1, why: "Renée: “I'd say most of those won't last.” Declan: “I'm not sure I'd go that far” + ví dụ regatta ⇒ không đồng ý ⇒ B." },
          { q: "22. Local people ought to be participants and not merely spectators.", options: ["A  Declan only", "B  Renée only", "C  both"], correct: 2, why: "Renée: “it helps if locals are taking part and not just watching.” Declan: “On that we agree.” ⇒ C." },
          { q: "23. It is tourists' spending that keeps such events going.", options: ["A  Declan only", "B  Renée only", "C  both"], correct: 1, why: "Renée: “it's visitor money that keeps the thing alive.” Declan: “I'd have said it's the volunteers.” ⇒ B. I'd have said = cách phản đối mềm (Ngày 11 Bài 1 mục 6)." },
          { q: "24. Money cannot make up for a lack of volunteers.", options: ["A  Declan only", "B  Renée only", "C  both"], correct: 0, why: "Declan: “Take them away and no amount of money replaces them.” Renée: “you need both, I suppose” — không nhận rằng tiền vô dụng ⇒ A." },
          { q: "25. The fact that the organisers are ageing is a cause for concern.", options: ["A  Declan only", "B  Renée only", "C  both"], correct: 2, why: "Renée: “That's the bit that worries me… they're all getting older.” Declan: “There, sadly, I can't argue with you.” ⇒ C." },
        ],
      },

      { t: "h", text: "8. Từ nghe sang nói — khung Part 2 nơi chốn / sự kiện band 8" },
      { t: "p", text: "Ở Ngày 14 bạn có khung bốn chặng cho thẻ “a time when…”. Thẻ nơi chốn và sự kiện khác ở một điểm: nó không có cốt truyện sẵn. Nếu chỉ tả, bạn hết ý sau 70 giây. Cách của người bản ngữ ở mục 5: ==tả cái lặp lại, rồi kể một lần cụ thể==." },
      {
        t: "sodo", kind: "flow", title: "Năm bước cho 2 phút — nơi chốn / sự kiện",
        steps: [
          { label: "① Định vị (2 câu · 10 giây)", sub: "cái gì, ở đâu, tôi dính líu thế nào — I've been going since…" },
          { label: "② Toàn cảnh — cái lặp lại (25 giây)", sub: "hiện tại đơn hoặc would / every year; ai tới, làm gì" },
          { label: "③ Một lần cụ thể (45 giây)", sub: "I remember one year… · had V3 → was V-ing → V2 · một âm thanh, một hình ảnh, một câu thoại" },
          { label: "④ Cái đã đổi hoặc cái lạ (20 giây)", sub: "It used to… now… · What people don't realise is…" },
          { label: "⑤ Nó nghĩa gì với tôi + câu chốt (20 giây)", sub: "hiện tại hoàn thành hoặc điều kiện: I've never… · If it ever stopped, …" },
        ],
      },
      { t: "p", text: "Thẻ: **Describe an annual event in your hometown or region that you have attended more than once. You should say: what the event is; where and when it takes place; what people do there; and explain why you keep going back.**" },
      {
        t: "dialogue", title: "Bài nói band 7 (ước tính) — khoảng 1 phút 25 giây, 176 từ",
        lines: [
          { who: "Thí sinh A", role: "a", text: "I'd like to talk about the old students' football match at my high school. It takes place every year on the twentieth of November, which is Teachers' Day in Vietnam. It is held in the school yard in the morning.", vi: "Tôi muốn nói về trận bóng đá cựu học sinh ở trường cấp ba của tôi. Nó diễn ra hằng năm vào ngày 20 tháng 11, Ngày Nhà giáo Việt Nam, ở sân trường vào buổi sáng." },
          { who: "Thí sinh A", role: "a", text: "On that day, many former students come back to school. First, we visit our teachers and give them flowers. Then there is a football match between the old students and the current students. A lot of people watch the match and they cheer loudly. The atmosphere is very exciting and everyone is happy. After the match, we usually have lunch together near the school.", vi: "Hôm đó nhiều cựu học sinh về trường. Đầu tiên chúng tôi thăm thầy cô và tặng hoa. Sau đó có trận bóng giữa cựu học sinh và học sinh hiện tại. Nhiều người xem và cổ vũ rất to. Không khí rất sôi nổi, ai cũng vui. Sau trận, chúng tôi thường ăn trưa cùng nhau gần trường." },
          { who: "Thí sinh A", role: "a", text: "I have attended this event four times. I keep going back because I want to meet my old friends and my teachers. We don't have much time to see each other because everyone is busy with work and study. In addition, the event reminds me of my school days, which were a very happy time. So I think it is a meaningful event and I will continue to go in the future.", vi: "Tôi đã dự bốn lần. Tôi cứ quay lại vì muốn gặp bạn cũ và thầy cô. Chúng tôi không có nhiều thời gian gặp nhau vì ai cũng bận. Ngoài ra, sự kiện làm tôi nhớ thời đi học, một thời rất vui. Vì vậy tôi nghĩ đây là sự kiện ý nghĩa và tôi sẽ tiếp tục tham dự." },
        ],
      },
      {
        t: "dialogue", title: "Bài nói band 8 (ước tính) — khoảng 2 phút, 253 từ",
        lines: [
          { who: "Thí sinh B", role: "candidate", text: "There's a football match I go back for every year — old students against current students, at my high school, on the morning of the twentieth of November, which is Teachers' Day here. I've been four times now, and I'm honestly not much of a footballer.", vi: "Có một trận bóng mà năm nào tôi cũng về dự — cựu học sinh đấu với học sinh hiện tại, ở trường cấp ba của tôi, sáng 20 tháng 11, Ngày Nhà giáo. Tôi đã dự bốn lần rồi, mà nói thật tôi đá bóng chẳng ra gì." },
          { who: "Thí sinh B", role: "candidate", text: "The pattern never changes. People start drifting in at about seven, there's a lot of standing around pretending to recognise each other, and then somebody finds a ball. The pitch is just the concrete yard between the two classroom blocks, so the younger kids hang over the balconies on every floor and shout advice.", vi: "Kịch bản không bao giờ đổi. Khoảng bảy giờ mọi người lục tục kéo tới, đứng loanh quanh giả vờ nhận ra nhau, rồi ai đó tìm được quả bóng. Sân chỉ là khoảng sân bê tông giữa hai dãy lớp học, nên đám học sinh nhỏ hơn bám lan can ở mọi tầng và hét xuống chỉ đạo." },
          { who: "Thí sinh B", role: "candidate", text: "The year I remember best was my second one. It had rained overnight, the yard was still wet, and we were losing — badly — to a team of sixteen-year-olds. And then our old maths teacher, who must be nearly sixty, walked onto the pitch in his office shoes, took the ball off one of them, and scored. You could hear the balconies before you could work out what had happened. He didn't celebrate. He just looked at his watch and said, “Right. Back to class.”", vi: "Năm tôi nhớ nhất là năm thứ hai. Đêm trước trời mưa, sân còn ướt, và chúng tôi đang thua — thua đậm — một đội toàn nhóc mười sáu tuổi. Rồi thầy dạy toán cũ của chúng tôi, chắc phải gần sáu mươi, bước vào sân trong đôi giày công sở, lấy bóng từ chân một đứa, và ghi bàn. Bạn nghe thấy tiếng các ban công trước khi kịp hiểu chuyện gì vừa xảy ra. Thầy không ăn mừng. Thầy chỉ nhìn đồng hồ và nói: “Rồi. Về lớp.”" },
          { who: "Thí sinh B", role: "candidate", text: "It's got bigger since then — there's a banner now, and somebody's dad films it — which, if I'm honest, I slightly regret. But I keep going back, and not really for the football. It's the one morning of the year when nobody asks what I do for a living. If it ever stopped, I think I'd lose touch with half the people I grew up with.", vi: "Từ đó nó to dần — giờ có băng rôn, có bố của ai đó quay phim — mà nói thật tôi hơi tiếc. Nhưng tôi vẫn quay lại, và không hẳn vì bóng đá. Đó là buổi sáng duy nhất trong năm không ai hỏi tôi làm nghề gì. Nếu có ngày nó dừng, tôi nghĩ mình sẽ mất liên lạc với một nửa những người lớn lên cùng mình." },
        ],
      },
      {
        t: "table", caption: "Khác nhau ở đâu — theo 4 tiêu chí",
        head: ["Tiêu chí", "Band 7", "Band 8"],
        rows: [
          ["Fluency & Coherence", "First… Then… After… In addition… So… — mạch của bài viết; hết ý ở giây 85", "năm bước của sơ đồ: định vị → cái lặp lại → một năm cụ thể → cái đã đổi → ý nghĩa; không cần từ nối đếm số"],
          ["Lexical Resource", "very exciting · everyone is happy · meaningful — tính từ chung", "drifting in · hang over the balconies · in his office shoes · lose touch with — chi tiết thay tính từ"],
          ["Grammar", "hiện tại đơn suốt bài, một câu which", "hiện tại (lệ) → It had rained · we were losing · walked… took… scored → It's got bigger → If it ever stopped, I'd…"],
          ["Pronunciation (dự đoán)", "đều; các câu cùng độ cao", "chậm lại trước walked onto the pitch; nâng giọng ở “Right. Back to class.”; hạ ở which, if I'm honest"],
        ],
      },
      {
        t: "note", title: "⚠️ Người Việt hay sai ở thẻ nơi chốn / sự kiện",
        items: [
          "**Tả bằng tính từ**: beautiful, peaceful, crowded, exciting. Mỗi tính từ đổi lấy một thứ nhìn / nghe được: không nói crowded, nói you can't see the pavement.",
          "**Kể lịch sử và số liệu** của nơi đó như hướng dẫn viên. Giám khảo chấm ngôn ngữ của BẠN, không chấm kiến thức. Một câu lịch sử là đủ.",
          "**Không có “một lần cụ thể”**. Thẻ không yêu cầu, nhưng không có nó thì không có chỗ cho quá khứ hoàn thành, quá khứ tiếp diễn, lời thoại.",
          "**Kết bằng I will go there again in the future.** Thay bằng một câu điều kiện hoặc một câu nói lên nó nghĩa gì: If it ever closed, …",
        ],
      },

      { t: "h", text: "9. Part 3 nối — ba cây cầu từ chuyện của mình sang chuyện chung" },
      { t: "p", text: "Sau thẻ, giám khảo hỏi 1–2 câu nối rồi vào Part 3 cùng chủ đề nhưng ==chung hơn==: không hỏi trận bóng của bạn, mà hỏi vì sao sự kiện địa phương quan trọng. Ba cây cầu dưới đây lấy từ Practice 3." },
      {
        t: "patterns",
        rows: [
          { formula: "Not because + S + V. It's that + S + V", vi: "Cầu ①: bác lý do dễ đoán, nêu lý do thật.", examples: [{ en: "New festivals often fail — not because they're badly run. It's that nobody feels they own them.", vi: "Lễ hội mới hay thất bại — không phải vì tổ chức kém. Mà vì không ai thấy nó là của mình." }] },
          { formula: "In my own case…, but I'd say that's true more widely: + S + V", vi: "Cầu ②: lấy chuyện mình làm ví dụ MỘT câu, rồi khái quát.", examples: [{ en: "In my own case it's a school football match, but I'd say that's true more widely: people go back for the people, not the event.", vi: "Với tôi đó là một trận bóng ở trường, nhưng tôi nghĩ điều này đúng rộng hơn: người ta quay lại vì con người, không vì sự kiện." }] },
          { formula: "The day (that) + S + V, + S + V  /  Take + N + away and + S + V", vi: "Cầu ③: một viễn cảnh ngắn thay cho “if”.", examples: [{ en: "The day it's all visitors and paid performers, it's a show, not an event.", vi: "Ngày mà chỉ toàn khách và người biểu diễn được trả tiền, nó là một buổi diễn, không còn là sự kiện." }, { en: "Take the volunteers away and no amount of money replaces them.", vi: "Bỏ tình nguyện viên đi thì bao nhiêu tiền cũng không thay được." }] },
        ],
      },
      {
        t: "dialogue", title: "Câu nối + một câu Part 3 mẫu (band 8, ước tính)",
        lines: [
          { who: "Examiner", role: "examiner", text: "Do many people from your school go to that match?" },
          { who: "Candidate", role: "candidate", text: "A fair few — maybe sixty or seventy, though it depends on which day of the week it falls on.", vi: "Khá đông — chừng sáu bảy chục người, dù còn tuỳ năm đó rơi vào thứ mấy." },
          { who: "Examiner", role: "examiner", text: "Let's talk about local events more generally. Why do you think some local events last for decades while others disappear?" },
          { who: "Candidate", role: "candidate", text: "I think it comes down to who it belongs to. In my own case it's just a football match in a school yard, but I'd say that's true more widely: the events that last are the ones people feel are theirs. A festival set up by the city to bring in tourists can be far better organised and still vanish — not because it's badly run. It's that nobody would miss it. Having said that, time does some of the work. Give a new event twenty years and a generation has grown up with it, and by then it doesn't much matter who started it.", vi: "Tôi nghĩ mấu chốt là nó thuộc về ai. Với tôi đó chỉ là một trận bóng ở sân trường, nhưng tôi cho rằng điều này đúng rộng hơn: sự kiện sống lâu là sự kiện người ta thấy là của mình. Một lễ hội do thành phố dựng lên để hút khách có thể tổ chức tốt hơn nhiều mà vẫn biến mất — không phải vì tổ chức kém, mà vì không ai thấy thiếu nó. Nói vậy, thời gian cũng góp phần. Cho một sự kiện mới hai mươi năm thì cả một thế hệ đã lớn lên cùng nó, lúc ấy ai khởi xướng không còn quan trọng nữa." },
        ],
      },
      { t: "rule", formula: "Part 3 nối:  một câu chuyện của mình  →  but I'd say that's true more widely:  →  Not because…  It's that…  →  Having said that, + giới hạn", vi: "Chuyện riêng chỉ MỘT câu. Phần còn lại nói về người ta nói chung." },
      {
        t: "note", title: "📌 Cách luyện ba khối ghi âm dưới đây",
        items: [
          "**Thẻ chính**: 1 phút ghi chú theo năm bước (mỗi bước 2–3 chữ), nói đủ 2 phút. Bắt buộc có “một lần cụ thể” với ít nhất một câu had + V3 và một câu thoại.",
          "**Hai thẻ thêm**: mượn cùng khung. Thẻ về nơi chốn không có “hằng năm” thì bước ② đổi thành “một ngày bình thường ở đó”.",
          "**Part 3**: mỗi câu 40–50 giây, dùng ít nhất một cây cầu của mục 9. Nghe lại và đếm số dấu phẩy bạn xuống giọng.",
        ],
      },
      {
        t: "speak", id: "t5d17-noi-p2", part: "2",
        questions: ["Describe an annual event in your hometown or region that you have attended more than once. You should say: what the event is; where and when it takes place; what people do there; and explain why you keep going back."],
      },
      {
        t: "speak", id: "t5d17-noi-p2-them", part: "2",
        questions: [
          "Describe a place you know that looks completely different at night. You should say: where it is; what it is like during the day; how it changes after dark; and explain how you feel about the place at night.",
          "Describe a place where you once had to wait for a long time. You should say: where it was; why you had to wait; what you did while you were waiting; and explain how you felt about the experience.",
        ],
      },
      {
        t: "speak", id: "t5d17-noi-p3", part: "3",
        questions: [
          "Why do you think some local events last for decades while others disappear after a few years?",
          "Do events that are created to attract tourists have the same value as ones that grew up naturally?",
          "Is it a problem if a local tradition changes a great deal over time?",
          "Who should pay for community events: local government, businesses, or the people who attend?",
          "Do you think people will still gather in person for events like these in thirty years' time?",
        ],
      },

      { t: "h", text: "10. Từ vựng hữu ích từ bài nghe" },
      {
        t: "vocab",
        items: [
          { w: "not do sth justice", pos: "idiom", ipa: "/duː ˈdʒʌstɪs/", vi: "(ảnh, lời tả) không lột tả hết được", ex: "The photos don't do the place justice.", exVi: "Ảnh không lột tả hết được nơi này.", more: "Câu mở cận cảnh rất tự nhiên cho Part 2: It's hard to describe — photos really don't do it justice." },
          { w: "come into view", pos: "phrase", ipa: "/kʌm ˌɪntu ˈvjuː/", vi: "hiện ra trong tầm mắt", ex: "As we turned the corner, the lake came into view.", exVi: "Khi chúng tôi rẽ qua góc, mặt hồ hiện ra.", more: "trái: disappear from view · go out of sight" },
          { w: "cap", pos: "v", ipa: "/kæp/", vi: "đặt mức trần, giới hạn (số lượng, giá)", ex: "The organisers have capped the number of entries at forty-five.", exVi: "Ban tổ chức đã giới hạn số đội đăng ký ở mức bốn mươi lăm.", more: "cap sth at + số · N: a cap on rents / fees · dùng tốt trong Task 2 về chính sách" },
          { w: "be up in arms", pos: "idiom", ipa: "/ʌp ɪn ˈɑːmz/", vi: "phản đối dữ dội", ex: "Residents would be up in arms if the market were closed.", exVi: "Người dân sẽ phản đối dữ dội nếu khu chợ bị đóng cửa.", more: "be up in arms about / over sth · không trang trọng — dùng khi NÓI" },
          { w: "a stretch (of)", pos: "n", ipa: "/stretʃ/", vi: "một đoạn, một quãng (sông, đường, bờ biển)", ex: "It's the narrowest stretch of the river.", exVi: "Đó là đoạn hẹp nhất của con sông.", more: "a stretch of road / coast / water · cũng dùng cho thời gian: a long stretch without rain" },
          { w: "come apart", pos: "phr v", ipa: "/kʌm əˈpɑːt/", vi: "vỡ ra, rời ra từng mảnh", ex: "Most of the home-made rafts come apart in the rapids.", exVi: "Phần lớn bè tự chế vỡ ra ở đoạn ghềnh.", more: "nghĩa bóng: The plan came apart within a week. · gần nghĩa: fall apart, break up" },
          { w: "make a point", pos: "idiom", ipa: "/meɪk ə pɔɪnt/", vi: "làm điều gì để chứng minh / phản đối một điều", ex: "They crossed the river on oil drums to make a point about the missing bridge.", exVi: "Họ vượt sông bằng thùng phuy để nói lên chuyện cây cầu bị mất.", more: "khác make a point OF doing sth = cố ý luôn làm điều gì (I make a point of arriving early)." },
          { w: "drift in", pos: "phr v", ipa: "/drɪft ɪn/", vi: "lục tục kéo đến, đến dần dần không vội", ex: "People start drifting in at about seven.", exVi: "Khoảng bảy giờ mọi người bắt đầu lục tục kéo đến.", more: "drift away / off = tản dần đi · chi tiết thay cho “many people come”" },
        ],
      },
    ],
  },
  /* ════════════════ BÀI TẬP NGÀY 17 ════════════════ */
  {
    id: "t5d17-bai-tap",
    kind: "homework",
    title: "Bài tập Ngày 17 — mạo từ · số nhiều · giới từ · dấu phẩy · đọc: đảo chiều, phạm vi, phê bình ≠ phủ nhận · nghe người kể · ngữ điệu kể chuyện",
    goal: "Ôn trọn Ngày 17 trong 65 phút: chọn đúng mạo từ ở bảy tình huống khó, sửa số nhiều và giới từ, đặt đúng dấu phẩy, dịch năm câu Task 2 không lỗi nhỏ, đọc một bài lập luận ngắn có ba bẫy của Reading Đề 10, nghe một người Mỹ kể về một sự kiện có thông tin bị sửa, và nhận ra ngữ điệu kể chuyện — 49 câu có đáp án, một đoạn viết và một thẻ nói AI chấm.",
    minutes: 65,
    blocks: [
      {
        t: "recap", title: "Bài tập hôm nay",
        items: [
          "Phần I–V ôn **Bài 1** (bốn loại lỗi nhỏ). Làm xong, đếm số câu sai theo loại: loại nào sai từ 2 câu thì ghi vào sổ lỗi.",
          "Phần VI ôn **Bài 2** bằng một bài đọc mới 280 từ có đủ ba bẫy của Đề 10.",
          "Phần VII–VIII ôn **Bài 3**: nghe người kể (giọng Mỹ) và ngữ điệu kể chuyện.",
          "Phần IX: từ vựng của ngày. Phần X–XI: viết một thân bài rồi tự soát bốn lượt; nói một thẻ Part 2 — AI chấm.",
        ],
      },
      {
        t: "sodo", kind: "mindmap", title: "Ngày 17 trong một hình", center: "7 → 8: ít lỗi hơn, đọc kỹ hơn, kể hay hơn",
        branches: [
          { label: "Viết sạch", items: ["Ø + N nói chung", "N không đếm được", "rise in / of / by / to / at", "S V; however, S V"] },
          { label: "Soát 4 phút", items: ["① danh từ", "② động từ", "③ con số + to", "④ dấu phẩy"] },
          { label: "Đọc Đề 10", items: ["đảo chiều so sánh", "phạm vi bị nới", "phê bình ≠ phủ nhận"] },
          { label: "Nghe → nói", items: ["ống kính", "đổi thì", "lời bình chen", "↗ vế chưa xong · ↘ câu chốt"] },
        ],
      },

      { t: "h", text: "I. Mạo từ — chọn phương án đúng (6 câu) — ôn Bài 1 mục 2" },
      {
        t: "mcq", id: "t5d17-bt-mao-tu", title: "I. Mạo từ vòng 3",
        items: [
          { q: "1. ___ is often blamed for problems that have other causes.", options: ["The globalisation", "Globalisation", "A globalisation"], correct: 1, why: "Hiện tượng nói chung, không đếm được ⇒ Ø." },
          { q: "2. ___ of remote working has emptied many city centres.", options: ["Rise", "A rise", "The rise"], correct: 2, why: "N + of + N xác định cái nào ⇒ the rise of remote working." },
          { q: "3. Sales recorded ___ of 8 per cent last year.", options: ["the fall", "a fall", "fall"], correct: 1, why: "Một mức giảm (số lượng) ⇒ a fall of 8 per cent." },
          { q: "4. Governments have a duty to protect ___.", options: ["the poor", "the poors", "poor"], correct: 0, why: "the + tính từ = cả nhóm; không -s." },
          { q: "5. Her brother is in ___ after the accident; I visited ___ yesterday. (UK)", options: ["the hospital · hospital", "hospital · the hospital", "a hospital · hospital"], correct: 1, why: "in hospital = đang nằm viện (chức năng); visited the hospital = tới toà nhà cụ thể." },
          { q: "6. ___ said they would pay more for cleaner air.", options: ["Most of respondents", "The most respondents", "Most of the respondents"], correct: 2, why: "Nhóm đã xác định (những người được hỏi trong khảo sát) ⇒ most of the + N. Most respondents cũng đúng nhưng không có trong lựa chọn." },
        ],
      },

      { t: "h", text: "II. Số ít / số nhiều — gõ lại phần [trong ngoặc] (6 câu) — ôn Bài 1 mục 3" },
      {
        t: "quiz", id: "t5d17-bt-so-nhieu", kind: "fill", title: "II. Mỗi câu một lỗi",
        items: [
          { q: "1. The company gave its staff useful [feedbacks] after the trial.", answers: ["feedback"], hint: "feedback không đếm được." },
          { q: "2. [Another reasons] for the decline is the cost of fuel.", answers: ["Another reason"], hint: "another + số ít." },
          { q: "3. The town attracts about two [millions] visitors a year.", answers: ["million"], hint: "số + million (không -s)." },
          { q: "4. A wide range of [measure has] been tried.", answers: ["measures have"], hint: "a range of + số nhiều + V số nhiều." },
          { q: "5. She has ten years' [experiences] of teaching adults.", answers: ["experience"], hint: "experience = kinh nghiệm ⇒ không đếm được." },
          { q: "6. There are many [kind] of renewable energy.", answers: ["kinds"], hint: "many kinds of." },
        ],
      },

      { t: "h", text: "III. Giới từ — điền MỘT từ (7 câu) — ôn Bài 1 mục 4" },
      {
        t: "quiz", id: "t5d17-bt-gioi-tu", kind: "fill", title: "III. Điền MỘT giới từ",
        items: [
          { q: "1. Exports fell ___ a quarter between 2015 and 2018.", answers: ["by"], hint: "V + by + mức." },
          { q: "2. The proportion levelled off ___ around 60 per cent.", answers: ["at"], hint: "level off AT." },
          { q: "3. Renewable sources accounted ___ a third of electricity.", answers: ["for"], hint: "account FOR." },
          { q: "4. The target must be met ___ 2035 at the latest.", answers: ["by"], hint: "by = không muộn hơn." },
          { q: "5. Many employees object ___ being monitored at work.", answers: ["to"], hint: "object TO + V-ing." },
          { q: "6. This raises the question of the extent ___ which parents are responsible.", answers: ["to"], hint: "the extent TO which." },
          { q: "7. The ease ___ which images can be edited makes fakes hard to spot.", answers: ["with"], hint: "edit WITH ease ⇒ the ease with which." },
        ],
      },

      { t: "h", text: "IV. Dấu phẩy — chọn câu ĐÚNG (5 câu) — ôn Bài 1 mục 5" },
      {
        t: "mcq", id: "t5d17-bt-dau-phay", title: "IV. Dấu phẩy vòng 3",
        items: [
          { q: "1.", options: ["Rents have doubled, many shops have closed.", "Rents have doubled, and many shops have closed.", "Rents have doubled and, many shops have closed."], correct: 1, why: "Hai mệnh đề đủ ⇒ , and. A là comma splice." },
          { q: "2.", options: ["What surprised researchers most, was the speed of the change.", "What surprised researchers most was the speed of the change.", "What surprised researchers, most was the speed of the change."], correct: 1, why: "Không phẩy giữa chủ ngữ (What… most) và động từ was." },
          { q: "3.", options: ["Wages rose slowly. Therefore many workers left.", "Wages rose slowly, therefore, many workers left.", "Wages rose slowly; therefore, many workers left."], correct: 2, why: "; therefore, nối hai câu. A thiếu phẩy sau Therefore; B là comma splice." },
          { q: "4. (Ý: chỉ những tài xế chạy quá tốc độ mới bị phạt)", options: ["Drivers who exceed the limit are fined.", "Drivers, who exceed the limit, are fined.", "Drivers who exceed the limit, are fined."], correct: 0, why: "Mệnh đề xác định ⇒ không phẩy. B nói mọi tài xế đều chạy quá tốc độ." },
          { q: "5.", options: ["The scheme failed, because nobody was told about it.", "The scheme failed because, nobody was told about it.", "The scheme failed because nobody was told about it."], correct: 2, why: "because đứng giữa câu ⇒ không phẩy." },
        ],
      },

      { t: "h", text: "V. Dịch Việt → Anh (5 câu) — ôn Bài 1 mục 2–5" },
      {
        t: "quiz", id: "t5d17-bt-dich", kind: "translate", grammar: "mạo từ · N không đếm được · giới từ của con số · dấu phẩy",
        title: "V. Dịch — mỗi câu có ít nhất hai “điểm lỗi” của hôm nay",
        items: [
          { q: "Ô nhiễm là một trong những vấn đề lớn nhất mà các thành phố phải đối mặt.", answers: ["Pollution is one of the biggest problems that cities face.", "Pollution is one of the biggest problems cities face.", "Pollution is one of the greatest problems that cities face.", "Pollution is one of the biggest problems facing cities."], hint: "Pollution (Ø) · one of the biggest problems · cities (Ø)" },
          { q: "Có rất ít bằng chứng cho thấy bài tập về nhà cải thiện kết quả.", answers: ["There is very little evidence that homework improves results.", "There is little evidence that homework improves results.", "There is very little evidence to show that homework improves results.", "There is very little evidence to suggest that homework improves results."], hint: "little evidence · homework (không -s)" },
          { q: "Giá nhà tăng 12 % trong năm 2022; tuy nhiên, lương không đổi.", answers: ["House prices rose by 12 per cent in 2022; however, wages did not change.", "House prices rose by 12% in 2022; however, wages did not change.", "House prices rose by 12 per cent in 2022. However, wages did not change.", "House prices rose by 12 per cent in 2022; however, wages remained unchanged.", "House prices rose by 12 per cent in 2022; however, wages stayed the same.", "House prices increased by 12 per cent in 2022; however, wages did not change.", "House prices rose by 12 per cent in 2022. However, wages remained unchanged."], hint: "rose by · in 2022 · ; however," },
          { q: "Nhiều người già chưa quen với việc dùng thiết bị này.", answers: ["Many elderly people are not used to using this equipment.", "Many older people are not used to using this equipment.", "Many of the elderly are not used to using this equipment.", "Many old people are not used to using this equipment.", "Many elderly people are not accustomed to using this equipment."], hint: "be used to + V-ing · equipment" },
          { q: "Cách mà thông tin được chia sẻ đã thay đổi trong những năm gần đây.", answers: ["The way in which information is shared has changed in recent years.", "The way information is shared has changed in recent years.", "The way that information is shared has changed in recent years."], hint: "the way in which · information is · in recent years" },
        ],
      },

      { t: "h", text: "VI. Đọc — một bài lập luận ngắn (5 câu · 6 phút) — ôn Bài 2 mục 3–6" },
      { t: "p", text: "Bài viết ở ngôi thứ nhất. Để ý: hai tiêu chí so sánh, một câu not… but, và một chỗ tác giả nhượng bộ trước khi phê bình. Chi tiết về nghiên cứu trong bài được nêu chung chung cho mục đích luyện đọc." },
      {
        t: "passage", title: "The Door Nobody Uses",
        paras: [
          { label: "A", text: "Most large office buildings offer two ways in: a revolving door, and beside it an ordinary door that swings on hinges. Stand and watch for ten minutes, and you will see the great majority of people choose the second. This is odd, because the revolving door is, by one measure, much the better of the two. Since it never stands fully open, far less heated or cooled air escapes through it, and studies of buildings that have both kinds have put the saving at several times the loss through a swing door. Of the two, it is the swing door that costs more to live with." },
          { label: "B", text: "Why, then, do we avoid it? The usual answer is that people are lazy, and I do not wish to deny that a revolving door takes a little more effort to push. But laziness cannot be the whole story, since the same people will happily climb a flight of stairs to save a minute. What puts us off, I suspect, is not the effort but the timing. A revolving door obliges us to match our pace to a stranger's, and to step into a moving space at exactly the right moment. A swing door asks nothing of the kind." },
          { label: "C", text: "Some building managers have tried signs explaining how much energy is wasted. In the cases I know of, these raised the use of the revolving door for a few weeks, after which the old habits returned. A more promising approach has been to move the swing door a few metres to one side, so that it is no longer the obvious choice. Nobody is forbidden to use it. It has simply stopped being the easier of the two." },
        ],
      },
      {
        t: "mcq", id: "t5d17-bt-doc", title: "VI. Questions 1–4: YES / NO / NOT GIVEN (ý người viết) · Question 5: chọn A–C",
        items: [
          { q: "1. A swing door allows more heated or cooled air to escape than a revolving door.", options: ["YES", "NO", "NOT GIVEN"], correct: 0, why: "Đoạn A: “far less… air escapes through it [the revolving door]” ⇒ cửa bản lề để thoát nhiều hơn ⇒ YES. Đảo chiều so sánh." },
          { q: "2. Pushing a revolving door requires no more effort than pushing a swing door.", options: ["YES", "NO", "NOT GIVEN"], correct: 1, why: "Đoạn B: “I do not wish to deny that a revolving door takes a little more effort to push” ⇒ tác giả CÔNG NHẬN nó tốn sức hơn ⇒ NO. Phần nhượng bộ trước But." },
          { q: "3. People avoid revolving doors mainly because they dislike physical effort.", options: ["YES", "NO", "NOT GIVEN"], correct: 1, why: "Đoạn B: “What puts us off, I suspect, is not the effort but the timing.” Khuôn not X but Y: effort là vế bị bác ⇒ NO." },
          { q: "4. Signs about wasted energy have failed in every building where they have been tried.", options: ["YES", "NO", "NOT GIVEN"], correct: 2, why: "Đoạn C: “In the cases I know of…” — tác giả chỉ nói về các trường hợp mình biết ⇒ không biết “every building” ⇒ NOT GIVEN. Phạm vi bị nới." },
          { q: "5. What does the writer say about moving the swing door to one side?", options: ["A  It prevents people from using the swing door.", "B  It works by making the swing door less convenient, not by banning it.", "C  It has proved less effective than putting up signs."], correct: 1, why: "“Nobody is forbidden to use it. It has simply stopped being the easier of the two.” ⇒ B. A ngược với bài; C ngược (a more promising approach)." },
        ],
      },

      { t: "h", text: "VII. Nghe — một người kể về một sự kiện (5 câu) — ôn Bài 3 mục 2 · 6" },
      { t: "p", text: "Nghe MỘT lần. Giọng Mỹ, tốc độ tự nhiên. Có ba chỗ người nói sửa một thông tin." },
      {
        t: "listen", id: "t5d17-bt-nghe", title: "The pie contest at the Harlan County Fair",
        dan: { so: "Day 17, Recording 4", boiCanh: "a woman describing an event she goes to every year.", cau: [1, 5] },
        lines: [
          { who: "Dana", voice: "us-nu", text: "So every August my family goes to the county fair, and the one thing we never miss is the pie contest. It's held in the old dairy barn — not the main hall, which is where everybody looks for it first. There are about eighty pies most years, and the rule is that the crust has to be made by hand." },
          { who: "Dana", voice: "us-nu", text: "My aunt entered for years. People assume she must have won with her apple pie, because that's the one she's known for, but what actually took first prize, in 2016, was a sour cherry pie she'd never made before. She'd run out of apples the night before. I was standing right next to her when they read out her name, and she didn't move. She just said, very quietly, “That can't be right.” The judging used to start at noon, but they've moved it to ten, because by lunchtime the barn gets so hot the cream pies start to slide." },
        ],
      },
      {
        t: "quiz", id: "t5d17-bt-nghe-dien", kind: "fill", title: "VII. Questions 1–5 — ONE WORD OR A NUMBER",
        items: [
          { q: "1. The contest takes place in the old dairy ___.", answers: ["barn"], hint: "the old dairy barn — not the main hall." },
          { q: "2. Number of pies in most years: about ___", answers: ["80", "eighty"], hint: "about eighty pies. eighty / eighteen." },
          { q: "3. The pie that won first prize was made with sour ___.", answers: ["cherry", "cherries"], hint: "Không phải apple (điều người ta tưởng): what actually took first prize… was a sour cherry pie." },
          { q: "4. Her aunt won first prize in ___.", answers: ["2016"], hint: "in 2016." },
          { q: "5. The judging now begins at ___ o'clock.", answers: ["10", "ten"], hint: "used to start at noon, but they've moved it to ten." },
        ],
      },

      { t: "h", text: "VIII. Ngữ điệu kể chuyện và khung Part 2 (4 câu) — ôn Bài 3 mục 3 · 8" },
      {
        t: "mcq", id: "t5d17-bt-ngu-dieu", title: "VIII. Chọn phương án đúng",
        items: [
          { q: "1. “She'd run out of apples the night before.” Câu này dùng quá khứ hoàn thành vì:", options: ["nó xảy ra trước cảnh chính đang kể", "nó là thói quen hằng năm", "nó vẫn còn đúng ở hiện tại"], correct: 0, why: "had + V3 lùi lại trước cảnh chính (lúc đọc tên người thắng)." },
          { q: "2. Trong câu “She just said, very quietly, ‘That can't be right.’”, lời thoại nên được nói:", options: ["cùng độ cao với phần dẫn", "khác độ cao và nhịp so với phần dẫn", "nhanh hơn hẳn"], correct: 1, why: "Đổi độ cao / nhịp để người nghe biết đó là lời của người khác; ở đây còn nói nhỏ lại theo very quietly." },
          { q: "3. Thẻ: Describe a market you often go to. Bước ③ của khung năm bước là:", options: ["liệt kê các mặt hàng bán ở chợ", "kể một lần cụ thể ở chợ, có nền và một chi tiết nghe / nhìn", "nêu lịch sử của chợ"], correct: 1, why: "Bước ③ = một lần cụ thể: had V3 → was V-ing → V2 + một giác quan. Không có nó thì hết ý ở giây 70." },
          { q: "4. Câu nào là một “cây cầu” hợp để mở câu trả lời Part 3?", options: ["In my case it's a small market, but I'd say that's true more widely: …", "As I mentioned in Part 2, my market is very crowded.", "I don't know about other people."], correct: 0, why: "Chuyện riêng một câu rồi khái quát — cầu ② của Bài 3 mục 9." },
        ],
      },

      { t: "h", text: "IX. Từ vựng của ngày (6 câu) — ôn Bài 2 mục 10 và Bài 3 mục 10" },
      {
        t: "quiz", id: "t5d17-bt-tu-vung", kind: "fill", title: "IX. Điền MỘT từ (chữ đầu cho sẵn)",
        items: [
          { q: "1. The latest figures seem to v___ those who warned about the risk.", answers: ["vindicate"], hint: "chứng tỏ ai đã đúng" },
          { q: "2. Raising the school-leaving age would e___ building hundreds of classrooms.", answers: ["entail"], hint: "kéo theo" },
          { q: "3. The court's decision was o___ a year later.", answers: ["overturned"], hint: "bị lật lại" },
          { q: "4. The council has c___ rent increases at 3 per cent a year.", answers: ["capped"], hint: "đặt mức trần" },
          { q: "5. Parents were up in a___ when the school cancelled the trip.", answers: ["arms"], hint: "be up in arms" },
          { q: "6. This photograph doesn't do the view j___.", answers: ["justice"], hint: "do sth justice" },
        ],
      },

      { t: "h", text: "X. Viết một thân bài rồi tự soát bốn lượt (110–140 từ) — AI chấm" },
      { t: "p", text: "Đề: Some people think that city centres should be closed to private cars. To what extent do you agree or disagree? — Viết **một thân bài** (một lý do + giải thích + ví dụ). Viết xong, bấm giờ 3 phút và chạy bốn lượt soát của Bài 1 mục 6 trước khi nộp. Dưới bài viết, ghi một dòng: số lỗi bạn tự bắt được ở mỗi lượt." },
      {
        t: "essay", id: "t5d17-bt-viet-doan", task: "Task 2", minWords: 110,
        prompt: "Topic: Some people think that city centres should be closed to private cars. To what extent do you agree or disagree? — Write ONE body paragraph (110–140 words) giving one reason for your view, with explanation and an example. Then check it in four passes: nouns (articles, plurals), verbs (agreement), prepositions with numbers and 'to', commas. On the last line, note how many errors you corrected in each pass.",
        tips: [
          "Câu chủ đề nói chung ⇒ danh từ số nhiều không mạo từ: Private cars… · City centres… · Pollution…",
          "Nếu dùng con số: rise / fall BY · a reduction OF · stood AT.",
          "Không nối hai câu bằng dấu phẩy. however / therefore đứng sau chấm hoặc chấm phẩy.",
          "Đích: không quá MỘT câu có lỗi nhỏ.",
        ],
      },
      {
        t: "note", title: "📌 Một thân bài mẫu để so SAU khi đã viết (band 8, ước tính) — 120 từ",
        items: [
          "The strongest argument for closing city centres to private cars is that it returns public space to the people who actually use it. In most centres, the majority of visitors arrive on foot or by public transport, yet most of the street is given over to moving and parked vehicles. When cars are removed, the effect on everyday life is immediate: pavements can be widened, cafés can put tables outside, and noise falls sharply. Pontevedra, a city in north-west Spain, is often cited as an example; after it restricted traffic in its historic centre, the area is widely reported to have become busier, not quieter. A ban, in other words, need not harm trade, provided that buses and deliveries are still allowed in.",
          "Soi: Ø + số nhiều / không đếm được ở câu nói chung (private cars · public space · public transport · noise · trade) · the + N + of (the majority of visitors · the effect on everyday life) · một dấu chấm phẩy trước after · phần chen kẹp hai phẩy (in other words). Ví dụ về Pontevedra được nêu chung chung, không kèm số liệu — đúng cách dùng ví dụ thật khi không nhớ con số.",
        ],
      },

      { t: "h", text: "XI. Nói một thẻ Part 2 — 1 phút ghi chú, 2 phút nói — AI chấm — ôn Bài 3 mục 8" },
      { t: "p", text: "Dùng khung năm bước. Bắt buộc: một câu would hoặc used to (cái lặp lại), một câu had + V3, một câu thoại, và câu chốt xuống giọng. Sau đó trả lời hai câu Part 3 bằng một cây cầu của mục 9." },
      {
        t: "speak", id: "t5d17-bt-noi-p2", part: "2",
        questions: ["Describe a market or street where you often went as a child. You should say: where it was; who you went there with; what you remember seeing or hearing there; and explain how the place has changed since then."],
      },
      {
        t: "speak", id: "t5d17-bt-noi-p3", part: "3",
        questions: [
          "Why do people often feel attached to places from their childhood?",
          "Should cities try to preserve old markets and streets even if modern shops would be more efficient?",
        ],
      },
    ],
  },
];
