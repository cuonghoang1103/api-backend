/**
 * IELTS Tập 5 — Ngày 15 (band 7.0 → 8.0; tự soạn 24/11/2026 — mọi câu ví dụ, bài đọc, hội thoại, kịch bản nghe, câu bài tập VIẾT MỚI)
 *   Bài 1 (grammar)   Register & tone: formal / neutral / informal trong Viết và Nói [G41 VD8] — bảy công tắc ngữ pháp đổi mức
 *                     trang trọng, lỗi "trang trọng giả", tone (hedge · booster · thái độ), lệch register trong một câu, ba mức
 *                     của một lời đề nghị trong công việc — nối Tập 4 Ngày 21 (danh hoá mức 2, register) · Tập 4 Ngày 10 (sắc
 *                     thái) · Tập 5 Ngày 1 (hedging) · Ngày 13 (cấu trúc nhấn "dùng vừa đủ").
 *   Bài 2 (reading)   Matching information + Matching features band 8 [R13 R04] — passage "What Is So Funny?" (~1.070 từ, 8 đoạn,
 *                     7 nhân vật, 15 câu) — nối Tập 3 Ngày 19 · 21 và Tập 4 Ngày 19 · 21 · 23.
 *   Bài 3 (speaking)  Register & tone khi nói + đàm phán, phản biện lịch sự (E10 phần 1) [S16 S06 E10] `canh` + `dialogue`
 *                     công việc (lập trình viên thương lượng hạn giao với trưởng sản phẩm) · 🔊 ngữ điệu xuống–lên làm mềm lời
 *                     phản đối — nối Tập 2 Ngày 17 (họp) · Tập 4 Ngày 22 · Tập 5 Ngày 6 · 10; Ngày 18 học tiếp phần 2.
 *   Bài tập Ngày 15   38 câu có đáp án (có bài nghe "bẫy band 8: con số đổi, phủ định kép" [L15] — bảng 3.5 ghi mục này cho bài 3
 *                     của ngày, nhưng khuôn N mod 4 = 3 buộc bài 3 là Nói, nên phần bẫy nghe nằm ở Bài tập hôm nay và được dạy
 *                     trọn trong bài Nghe của Ngày 16).
 * Dữ kiện thật trong bài đọc: Thomas Hobbes ("sudden glory", thế kỷ 17); Francis Hutcheson (phản bác Hobbes, thế kỷ 18); Herbert
 * Spencer (1860) và Sigmund Freud (1905) — thuyết giải toả; Immanuel Kant (1790) và Schopenhauer — thuyết bất tương hợp; Victor
 * Raskin (1985, hai "script" đối lập); Peter McGraw & Caleb Warren (2010, "benign violation"); Robert Provine (quan sát khoảng
 * 1.200 lượt cười ngoài đời: đa số theo sau câu nói bình thường, người nói cười nhiều hơn người nghe, cười khi có người khác nhiều
 * gấp khoảng 30 lần khi ở một mình). Bài đọc ở Bài tập (nhãn bảo tàng) và mọi tên người trong đó là HƯ CẤU, có ghi rõ.
 * Mọi id bắt đầu `t5d15-`.
 */
import type { Lesson } from '../data';

export const NGAY_15: Lesson[] = [
  /* ═══════════════════════════ BÀI 1 — NGỮ PHÁP ═══════════════════════════ */
  {
    id: "t5d15-ngu-phap",
    kind: "grammar",
    title: "Ngữ pháp: Register & tone — formal / neutral / informal trong Viết và Nói",
    goal: "Chọn đúng mức trang trọng cho từng phần thi và từng tình huống công việc: viết Task 1 / Task 2 ở mức học thuật trung tính (không suồng sã, không “trang trọng giả”), nói Part 1 tự nhiên như người thật và Part 3 nâng lên một nấc; đổi một ý qua ba mức bằng bảy công tắc ngữ pháp; chỉnh tone bằng hedge và booster cho vừa với bằng chứng; phát hiện và sửa chỗ lệch register trong một câu.",
    minutes: 95,
    blocks: [
      {
        t: "recap",
        items: [
          "**Register** = mức trang trọng của lời nói / bài viết (formal · neutral · informal). **Tone** = thái độ nghe ra được: chắc chắn hay dè dặt, lịch sự hay cộc, khách quan hay gay gắt.",
          "Band 8 không phải là “càng trang trọng càng tốt”. Bảng mô tả Lexical Resource band 8 đòi dùng từ ==chính xác và tự nhiên==; giám khảo Speaking trừ điểm người nói Part 1 như đọc bài luận.",
          "Bảy **công tắc ngữ pháp** đổi register: viết tắt · cụm động từ ↔ động từ đơn · ngôi I / you ↔ chủ ngữ phi nhân xưng · động từ ↔ danh hoá · lượng từ · từ nối · câu hỏi, câu cụt.",
          "Ba lỗi của người đang ở band 7: **lệch register trong một câu** (kids + furthermore), **trang trọng giả** (cụm học thuộc), **tone quá mạnh** (obviously, everyone knows).",
          "Nối lại: Tập 4 Ngày 21 (danh hoá mức 2 và register), Tập 4 Ngày 10 (sắc thái từ), Tập 5 Ngày 1 (hedging), Ngày 13 (cấu trúc nhấn dùng vừa đủ). Hôm nay gom thành một hệ thống cho cả Viết lẫn Nói.",
          "Ứng dụng công việc: cùng một lời đề nghị viết cho bạn, cho đồng nghiệp, cho khách hàng — ba mức, ba khung câu.",
        ],
      },

      /* ── 0 ── */
      { t: "h", text: "0. Kiểm tra đầu bài — ôn Tập 4 Ngày 21 và Tập 5 Ngày 1 (5 câu)" },
      {
        t: "mcq",
        id: "t5d15-on-dau-bai",
        title: "Chọn câu hợp nhất với Writing Task 2",
        items: [
          { q: "1. Ý: giá nhà tăng nên người trẻ khó mua nhà.", options: ["House prices have gone up a lot, so young people can't buy a place.", "Rising house prices have put home ownership beyond the reach of many young people.", "The escalation of residential property valuations has engendered insurmountable impediments for the youth."], correct: 1, why: "Câu A suồng sã (gone up a lot, can't, a place). Câu C “trang trọng giả”: từ to nhưng không ai viết như vậy, nghĩa lại mờ đi. Câu B: danh hoá vừa đủ (rising house prices, home ownership) + cụm tự nhiên beyond the reach of — đúng mức học thuật trung tính." },
          { q: "2. Chọn câu có mức chắc chắn hợp với một bài luận không có số liệu.", options: ["Social media destroys teenagers' ability to concentrate.", "Social media may well be eroding teenagers' ability to concentrate.", "Social media might possibly perhaps affect some teenagers a little."], correct: 1, why: "A khẳng định tuyệt đối không bằng chứng. C chồng ba hedge (might possibly perhaps) ⇒ nghe như không dám nói gì. B một hedge đúng chỗ (may well) — ôn Tập 5 Ngày 1." },
          { q: "3. Câu nào KHÔNG nên có trong bài Task 2?", options: ["This trend is likely to continue.", "There are a number of reasons for this.", "Nowadays, kids are glued to their phones 24/7."], correct: 2, why: "kids, glued to, 24/7 đều là khẩu ngữ. Dùng: children today spend much of their time on their phones." },
          { q: "4. Danh hoá nào ĐÚNG và tự nhiên?", options: ["The government's decision to cut funding caused protests.", "The government's deciding of cutting of funding caused protests.", "The decision-making of funding-cutting by the government caused protests."], correct: 0, why: "Một danh từ trừu tượng (decision) + to V là đủ. Danh hoá chồng danh hoá làm câu rối — Tập 4 Ngày 21 gọi là “danh hoá quá đà”." },
          { q: "5. Trong Speaking Part 1, câu trả lời nào nghe tự nhiên nhất?", options: ["Moreover, I am of the opinion that cooking is beneficial.", "Yeah, I do — I find it really relaxing, to be honest.", "Cooking constitutes one of my principal leisure pursuits."], correct: 1, why: "Part 1 là trò chuyện về đời thường: viết tắt, to be honest, really đều đúng chỗ. A và C là văn viết đặt vào miệng — giám khảo nghe ra ngay là học thuộc." },
        ],
      },

      /* ── 1 ── */
      { t: "h", text: "1. Ba mức register — và IELTS muốn mức nào ở đâu" },
      {
        t: "p",
        text: "Hãy nghĩ register như ==quần áo==. Không có bộ nào “đẹp nhất”; chỉ có bộ hợp chỗ. Mặc vest đi đá bóng cũng sai như mặc áo ba lỗ đi phỏng vấn. Người bản ngữ đổi register mỗi ngày mà không để ý; người học thường chỉ có **một** bộ — hoặc bộ sách giáo khoa, hoặc bộ phim Mỹ — và mặc nó ở mọi nơi.",
      },
      {
        t: "sodo", kind: "compare", title: "Một ý — ba mức",
        cols: [
          { title: "Informal (thân mật)", items: ["Loads of people can't afford a flat, so they're stuck at their parents' place.", "viết tắt · loads of · stuck · place", "Dùng: nhắn tin, nói với bạn, **Part 1** (một phần)"] },
          { title: "Neutral (trung tính)", items: ["Many people cannot afford a flat, so they have to stay with their parents.", "câu đủ · từ thông dụng · không khẩu ngữ", "Dùng: **Part 2 · Part 3**, email công việc thường ngày, thuyết trình"] },
          { title: "Formal (học thuật)", items: ["Unable to afford a home of their own, many adults remain in the parental household.", "cụm phân từ · remain · danh từ trừu tượng", "Dùng: **Task 1 · Task 2**, báo cáo, thư gửi khách / cơ quan"] },
        ],
      },
      {
        t: "table",
        caption: "Mức register đích của từng phần thi",
        head: ["Phần thi", "Mức đích", "Dấu hiệu đúng", "Lệch xuống (quá suồng sã)", "Lệch lên (quá cứng)"],
        rows: [
          ["Writing Task 1", "formal – trung tính, **khách quan**", "bị động, danh hoá số liệu, không ý kiến", "a huge jump · went through the roof", "it is with great interest that we observe"],
          ["Writing Task 2", "formal vừa đủ, có **lập trường**", "không viết tắt, từ nối cấp đoạn, hedge", "kids · a lot of stuff · I reckon", "in this day and age · it goes without saying · myriad plethora"],
          ["Speaking Part 1", "**neutral – informal**", "viết tắt, câu ngắn, well / actually", "tiếng lóng nặng, gonna / wanna liên tục", "moreover · furthermore · I am of the opinion"],
          ["Speaking Part 2", "neutral, giọng **kể**", "thì quá khứ kể chuyện, chi tiết cảm quan", "like… like… you know (lặp)", "đọc lại một bài viết thuộc lòng"],
          ["Speaking Part 3", "**neutral, nhích lên** một nấc", "tend to, I'd argue, từ trừu tượng, vẫn viết tắt", "trả lời một câu, toàn I think", "nói như đọc bài luận, không ngắt tự nhiên"],
        ],
      },
      {
        t: "note",
        title: "📌 Ba điều band 7 hay hiểu nhầm về register",
        items: [
          "**“Formal = từ dài.”** Không. Formal là ==chính xác, phi cá nhân, câu trọn vẹn==. “Use” vẫn formal hơn “utilise” dùng sai chỗ.",
          "**“Speaking càng giống văn viết càng điểm cao.”** Ngược lại: bảng mô tả Fluency band 8 nói về lời nói ==trôi chảy tự nhiên==; văn viết đọc thành tiếng nghe gồng và thiếu ngữ điệu.",
          "**“Informal = sai ngữ pháp.”** Không. I'd say it's kind of a mixed picture là informal và hoàn toàn đúng ngữ pháp.",
        ],
      },
      { t: "rule", formula: "Task 1 · Task 2 → formal vừa đủ   ·   Part 1 → neutral – informal   ·   Part 3 → neutral, nhích lên một nấc", vi: "Không có mức “cao nhất”; chỉ có mức hợp chỗ. Lệch lên cũng mất điểm như lệch xuống." },

      /* ── 2 ── */
      { t: "h", text: "2. Bảy công tắc ngữ pháp đổi register" },
      {
        t: "p",
        text: "Register không chỉ nằm ở từ vựng. Bảy lựa chọn ngữ pháp dưới đây, mỗi cái là một công tắc: bật về bên trái thì câu thân mật hơn, về bên phải thì trang trọng hơn. Bài viết band 8 bật ==cả bảy về cùng một phía==.",
      },
      {
        t: "table",
        head: ["Công tắc", "Informal ←", "→ Formal", "Ghi chú"],
        rows: [
          ["① Viết tắt", "it's · don't · they've", "it is · do not · they have", "Task 1 / 2: không viết tắt. Speaking: PHẢI viết tắt mới tự nhiên."],
          ["② Cụm động từ ↔ động từ đơn", "find out · put up with · go up · get rid of", "discover · tolerate · rise · eliminate", "Không phải cụm động từ nào cũng suồng sã: carry out, account for, result in dùng tốt trong bài luận."],
          ["③ Chủ ngữ", "I think · you can see · we need to", "It is argued that · It can be seen that · There is a need to", "Task 2 vẫn được dùng I ở câu nêu lập trường; tránh you chỉ người đọc."],
          ["④ Động từ ↔ danh hoá", "People are living longer, so…", "Rising life expectancy means…", "Một danh hoá mỗi câu là đủ (Tập 4 Ngày 21)."],
          ["⑤ Lượng từ & từ nhấn", "a lot of · lots of · really · pretty", "a great deal of · many · considerably · fairly", "a lot of không sai trong bài luận, chỉ kém chính xác; lots of thì nên tránh."],
          ["⑥ Từ nối", "but · so · plus · anyway · then", "however · therefore · in addition · nevertheless", "Speaking Part 1 mà dùng cột phải là lệch lên."],
          ["⑦ Kiểu câu", "câu hỏi tu từ · câu cảm · câu cụt (Sounds good.)", "câu trần thuật trọn vẹn, có chủ – vị", "Một câu hỏi tu từ trong mở bài không sai, nhưng band 8 hiếm khi cần."],
        ],
      },
      {
        t: "patterns",
        rows: [
          {
            formula: "It + is / has been + V3 + that + S + V",
            vi: "Chủ ngữ phi nhân xưng thay I think / people say.",
            examples: [
              { en: "It is widely assumed that longer sentences deter crime.", vi: "Người ta thường cho rằng án dài hơn thì răn đe được tội phạm." },
              { en: "It has been suggested that the scheme be extended to rural areas.", vi: "Đã có đề xuất mở rộng chương trình ra vùng nông thôn." },
            ],
          },
          {
            formula: "There + is / are + N (danh hoá) + giới từ…",
            vi: "Thay “we need to… / people want…”.",
            examples: [
              { en: "There is growing demand for flexible working arrangements.", vi: "Nhu cầu về chế độ làm việc linh hoạt đang tăng." },
              { en: "There is little evidence that the ban has reduced consumption.", vi: "Có rất ít bằng chứng cho thấy lệnh cấm đã làm giảm tiêu thụ." },
            ],
          },
          {
            formula: "N (danh hoá) + V + N",
            vi: "Đưa cả một mệnh đề lên làm chủ ngữ.",
            examples: [
              { en: "The closure of rural branches has left many elderly customers without access to cash.", vi: "Việc đóng cửa các chi nhánh ở nông thôn khiến nhiều khách hàng lớn tuổi không tiếp cận được tiền mặt." },
            ],
          },
        ],
      },
      {
        t: "table",
        caption: "Cùng một câu — bật từng công tắc",
        head: ["Bước", "Câu", "Công tắc vừa bật"],
        rows: [
          ["gốc", "Lots of firms don't let people work from home because they think they'll slack off.", "—"],
          ["1", "Lots of firms **do not** let people work from home because they think they **will** slack off.", "① viết tắt"],
          ["2", "**Many** firms do not let people work from home because they think they will slack off.", "⑤ lượng từ"],
          ["3", "Many firms do not **allow staff to** work from home because they **fear productivity will fall**.", "② cụm động từ + từ chính xác"],
          ["4", "Many firms **are reluctant to permit remote working for fear of a fall in productivity**.", "④ danh hoá (remote working, a fall in productivity)"],
        ],
      },
      {
        t: "note",
        title: "⚠️ Cẩn thận — đừng bật quá tay",
        items: [
          "Bước 4 là đích. Bước 5 kiểu ~~The reluctance of numerous enterprises with regard to the authorisation of remote working is attributable to apprehension concerning productivity diminution~~ là ==trang trọng giả==: đúng ngữ pháp, nhưng người đọc phải dịch ngược mới hiểu.",
          "Người Việt hay nhầm “không viết tắt” với “không dùng I”. Trong Task 2, **I believe / In my view** ở mở bài và kết bài là bắt buộc để có lập trường rõ (Task Response).",
          "Trong Speaking, đừng tách **it is · do not · I would** — nói tách là dấu hiệu đang đọc thuộc. Chỉ tách khi ==nhấn mạnh==: I do NOT think that's fair.",
        ],
      },
      { t: "rule", formula: "informal → formal:  viết tắt ✗ · cụm động từ → động từ đơn · I / you → It is V3 that / There is N · S V → N (danh hoá) · lots of → many · but / so → however / therefore", vi: "Bật cả bảy công tắc về cùng một phía — và dừng ở mức người đọc vẫn hiểu ngay lần đầu." },
      {
        t: "quiz",
        id: "t5d15-cong-tac-dich",
        kind: "translate",
        title: "Dịch sang tiếng Anh ở mức Task 2 (4 câu)",
        grammar: "It is V3 that… · There is N… · N (danh hoá) + V",
        items: [
          { q: "Người ta thường tin rằng công nghệ giúp con người tiết kiệm thời gian.", answers: ["It is widely believed that technology saves people time.", "It is commonly believed that technology saves people time.", "It is widely believed that technology helps people save time.", "It is commonly believed that technology helps people save time.", "It is generally believed that technology saves people time.", "It is often believed that technology saves people time."], hint: "It is widely believed that… · save people time" },
          { q: "Có rất ít bằng chứng cho thấy bài tập về nhà cải thiện kết quả ở tiểu học.", answers: ["There is little evidence that homework improves results at primary school.", "There is little evidence that homework improves results in primary school.", "There is little evidence that homework improves performance at primary school.", "There is little evidence that homework improves results at primary level.", "There is little evidence that homework improves attainment at primary level.", "There is little evidence that homework improves attainment at primary school."], hint: "There is little evidence that… · at primary school / level" },
          { q: "Việc đóng cửa các bưu điện địa phương đã ảnh hưởng nặng nhất tới các gia đình thu nhập thấp.", answers: ["The closure of local post offices has affected low-income families most severely.", "The closure of local post offices has hit low-income families hardest.", "The closure of local post offices has affected low-income families the most.", "The closure of local post offices has affected low-income families most.", "The closure of local post offices has hit low-income families the hardest."], hint: "The closure of… · post offices · low-income families · most severely / hardest" },
          { q: "Nhiều công ty ngần ngại cho phép làm việc từ xa.", answers: ["Many companies are reluctant to permit remote working.", "Many companies are reluctant to allow remote working.", "Many firms are reluctant to permit remote working.", "Many firms are reluctant to allow remote working.", "Many companies are reluctant to allow remote work.", "Many firms are reluctant to allow remote work.", "Many companies are reluctant to permit remote work."], hint: "be reluctant to + V · remote working" },
        ],
      },

      /* ── 3 ── */
      { t: "h", text: "3. “Trang trọng giả” — lỗi của người học chăm" },
      {
        t: "p",
        text: "Người đã ở band 7 hiếm khi viết quá suồng sã. Lỗi của họ nằm ở phía kia: chất vào bài những cụm ==nghe có vẻ học thuật== học từ các bài mẫu. Giám khảo gặp các cụm này hàng trăm lần mỗi tuần; bảng mô tả gọi đó là ngôn ngữ **học thuộc** và không tính nó vào vốn từ của bạn.",
      },
      {
        t: "table",
        head: ["Trang trọng giả", "Vì sao mất điểm", "Viết thế này"],
        rows: [
          ["~~In this day and age / In this modern era~~", "sáo, không mang thông tin", "Today · In recent years · Over the past decade"],
          ["~~It goes without saying that…~~", "nếu không cần nói thì đừng nói; tone lại quá chắc", "(bỏ) hoặc It is generally accepted that…"],
          ["~~a plethora of / a myriad of problems~~", "từ hiếm dùng để thay “many”, không chính xác hơn", "a range of problems · several distinct problems"],
          ["~~Every coin has two sides.~~", "tục ngữ dịch; không phải lập luận", "This development has both benefits and costs."],
          ["~~I am of the opinion that… (khi nói)~~", "văn thư tín thế kỷ trước", "I'd say… · My feeling is that…"],
          ["~~utilise · commence · endeavour · peruse~~ (thay use · begin · try · read)", "từ Latin dài không làm câu chính xác hơn", "use · begin · attempt · read"],
          ["~~With the rapid development of society,…~~", "mở bài vạn năng, đề nào cũng lắp vào được", "mở thẳng bằng hiện tượng mà ĐỀ nêu"],
          ["~~Last but not least,…~~", "khẩu ngữ diễn thuyết", "Finally, · A further consideration is…"],
        ],
      },
      {
        t: "note",
        title: "💡 Mẹo — phép thử “người trong ngành có viết thế không”",
        items: [
          "Mở một bài báo của The Economist hay một bản tóm tắt nghiên cứu. Đếm xem có bao nhiêu **plethora, myriad, in this day and age**. Gần như bằng không. Thứ có rất nhiều: danh từ chính xác, động từ mạnh, hedge đúng chỗ.",
          "Từ dài chỉ đáng dùng khi nó ==thu hẹp nghĩa==: deteriorate (xấu đi dần) chính xác hơn get worse; exacerbate (làm cái đã xấu thành xấu hơn) chính xác hơn make worse. Còn utilise không nói được gì hơn use.",
          "Khi nói: nếu một cụm bạn chưa từng nghe người thật nói trong phim, podcast hay cuộc họp, đừng mang nó vào Part 1.",
        ],
      },
      { t: "rule", formula: "từ dài chỉ dùng khi nó HẸP NGHĨA hơn từ ngắn  ·  cụm vạn năng (lắp vào đề nào cũng được) → bỏ", vi: "Band 8 = chính xác + tự nhiên, không phải hiếm + dài." },
      {
        t: "quiz",
        id: "t5d15-gia",
        kind: "fill",
        title: "Thay phần [trong ngoặc] bằng MỘT từ tự nhiên hơn (6 câu)",
        items: [
          { q: "1. Schools should [utilise] technology only where it improves learning.", answers: ["use"], hint: "utilise không chính xác hơn use." },
          { q: "2. The project will [commence] in March.", answers: ["begin", "start"], hint: "begin / start." },
          { q: "3. There are [a plethora of] reasons for this trend. (một từ)", answers: ["several", "many", "various", "numerous"], hint: "several / many / various." },
          { q: "4. [In this day and age], most teenagers own a smartphone. (một từ)", answers: ["Today", "Nowadays", "Now"], hint: "Today." },
          { q: "5. [Last but not least], the policy would be expensive to enforce. (một từ)", answers: ["Finally", "Lastly"], hint: "Finally." },
          { q: "6. Residents should [endeavour] to recycle more.", answers: ["try", "attempt"], hint: "try / attempt." },
        ],
      },

      /* ── 4 ── */
      { t: "h", text: "4. Tone — nói chắc tới đâu, gắt tới đâu" },
      {
        t: "p",
        text: "Register trả lời “trang trọng tới đâu”. **Tone** trả lời “người viết đứng ở đâu so với điều mình nói”. Ba nhóm từ điều khiển tone: **hedge** (hạ độ chắc), **booster** (đẩy độ chắc) và **từ chỉ thái độ** (surprisingly, regrettably). Band 8 dùng cả ba, nhưng theo một luật: ==độ chắc của câu không được vượt quá bằng chứng bạn có==.",
      },
      {
        t: "table",
        head: ["Nhóm", "Từ / cấu trúc", "Dùng khi", "Lạm dụng thì"],
        rows: [
          ["Hedge", "may · might · tend to · appear to · is likely to · arguably · to some extent · in many cases", "nói về xu hướng, nguyên nhân, dự đoán — thứ không thể chứng minh trong 250 từ", "bài không còn lập trường (Task Response tụt)"],
          ["Booster", "clearly · undoubtedly · by far · it is evident that · there is no question that", "điều hiển nhiên từ số liệu (Task 1) hoặc lập trường ở KẾT bài", "nghe võ đoán: ~~Undoubtedly, video games cause violence.~~"],
          ["Thái độ", "surprisingly · regrettably · understandably · more importantly · admittedly", "cho thấy bạn ĐÁNH GIÁ chứ không chỉ kể", "bài thành cảm tính: ~~It is a disgrace that…~~"],
        ],
      },
      {
        t: "patterns",
        rows: [
          {
            formula: "S + tend to / appear to / be likely to + V",
            vi: "Hedge bằng động từ — gọn nhất.",
            examples: [
              { en: "Children who read for pleasure tend to do better across the curriculum.", vi: "Trẻ đọc sách vì thích thường học tốt hơn ở mọi môn." },
              { en: "The decline appears to be linked to the rise of streaming.", vi: "Sự sụt giảm có vẻ liên quan tới sự nổi lên của dịch vụ phát trực tuyến." },
            ],
          },
          {
            formula: "Admittedly, + S + V; + however / nevertheless, + S + V",
            vi: "Từ chỉ thái độ mở câu nhượng bộ — tone công bằng.",
            examples: [
              { en: "Admittedly, the scheme is costly; nevertheless, the long-term savings are substantial.", vi: "Phải thừa nhận chương trình tốn kém; tuy nhiên, khoản tiết kiệm dài hạn là đáng kể." },
            ],
          },
          {
            formula: "It would be + adj + to V (unwise / naive / premature)",
            vi: "Phê bình mạnh nhưng không gắt.",
            examples: [
              { en: "It would be naive to assume that the market will solve the problem unaided.", vi: "Sẽ là ngây thơ nếu cho rằng thị trường tự nó giải quyết được vấn đề." },
            ],
          },
        ],
      },
      {
        t: "table",
        caption: "Chỉnh tone — từ gắt sang đo được",
        head: ["Quá mạnh / cảm tính", "Đo được (band 8)"],
        rows: [
          ["~~Everyone knows that fast food is poison.~~", "There is strong evidence that a diet high in processed food increases the risk of heart disease."],
          ["~~It is totally wrong to say that…~~", "This view is difficult to defend, since…"],
          ["~~The government has done nothing.~~", "Government action to date has been limited."],
          ["~~People who disagree are just selfish.~~", "Opponents of the measure tend to overlook its wider benefits."],
          ["~~This will definitely solve the problem.~~", "This is likely to go a long way towards solving the problem."],
        ],
      },
      {
        t: "note",
        title: "⚠️ Người Việt hay sai — hai thái cực",
        items: [
          "**Khẳng định tuyệt đối** vì tiếng Việt viết nghị luận thích câu chắc nịch: “chắc chắn”, “không thể phủ nhận”. Sang tiếng Anh học thuật, ~~It cannot be denied that~~ đặt trước một ý còn tranh cãi nghe như chặn họng người đọc.",
          "**Hedge chồng hedge** sau khi học hedging: ~~It may possibly seem that this could perhaps…~~ Một câu, một hedge.",
          "Kết bài KHÔNG hedge lập trường: ~~I think maybe the advantages might outweigh…~~ → **On balance, I am convinced that the advantages outweigh…**",
        ],
      },
      { t: "rule", formula: "độ chắc của câu ≤ bằng chứng   ·   một câu — một hedge   ·   lập trường ở kết bài: KHÔNG hedge", vi: "Hedge cho nguyên nhân, xu hướng, dự đoán; booster cho điều số liệu cho thấy và cho câu chốt lập trường." },
      {
        t: "quiz",
        id: "t5d15-tone-dich",
        kind: "translate",
        title: "Dịch sang tiếng Anh — giữ tone đo được (4 câu)",
        grammar: "tend to · appear to · Admittedly… nevertheless… · It would be naive to…",
        items: [
          { q: "Người làm việc tại nhà thường làm nhiều giờ hơn. (dùng tend to)", answers: ["People who work from home tend to work longer hours.", "Those who work from home tend to work longer hours.", "People working from home tend to work longer hours.", "Home workers tend to work longer hours.", "Remote workers tend to work longer hours."], hint: "tend to work longer hours" },
          { q: "Phải thừa nhận thuế này không được lòng dân; tuy nhiên, nó hiệu quả.", answers: ["Admittedly, the tax is unpopular; nevertheless, it is effective.", "Admittedly, the tax is unpopular; however, it is effective.", "Admittedly, this tax is unpopular; nevertheless, it is effective.", "Admittedly, this tax is unpopular; however, it is effective.", "Admittedly, the tax is unpopular. Nevertheless, it is effective.", "Admittedly, the tax is unpopular. However, it is effective."], hint: "Admittedly, …; nevertheless, …" },
          { q: "Sẽ là ngây thơ nếu cho rằng công nghệ tự nó giải quyết được vấn đề.", answers: ["It would be naive to assume that technology alone will solve the problem.", "It would be naive to assume that technology will solve the problem by itself.", "It would be naive to assume that technology will solve the problem on its own.", "It would be naive to assume that technology alone can solve the problem.", "It would be naive to think that technology alone will solve the problem.", "It would be naive to assume that technology can solve the problem on its own."], hint: "It would be naive to assume that… · alone / on its own" },
          { q: "Sự sụt giảm có vẻ liên quan tới giá vé tăng.", answers: ["The decline appears to be linked to rising ticket prices.", "The fall appears to be linked to rising ticket prices.", "The decline seems to be linked to rising ticket prices.", "The decline appears to be linked to higher ticket prices.", "The decline appears to be related to rising ticket prices.", "The decline appears to be linked to the rise in ticket prices."], hint: "appear to be linked to · rising ticket prices" },
        ],
      },

      /* ── 5 ── */
      { t: "h", text: "5. Register khi NÓI — ngữ pháp của lời nói tự nhiên" },
      {
        t: "p",
        text: "Lời nói có ngữ pháp riêng, và giám khảo chấm theo ngữ pháp đó. Sáu đặc điểm dưới đây ==không phải lỗi==; thiếu chúng thì bài nói nghe như đọc. Tập 4 Ngày 23 và Tập 5 Ngày 11 đã dạy ellipsis và câu hỏi đuôi; hôm nay xếp chúng vào thang register.",
      },
      {
        t: "table",
        head: ["Đặc điểm lời nói", "Ví dụ", "Dùng ở Part nào"],
        rows: [
          ["Viết tắt (luôn luôn)", "I'd say · it's · they've · wouldn't", "1 · 2 · 3"],
          ["Từ mở lời / câu giờ có nghĩa", "Well, · Actually, · I mean, · To be honest, · Let me think.", "1 · 2 · 3 (mỗi câu trả lời tối đa một, hai lần)"],
          ["Ngôn ngữ mơ hồ có chủ ý", "sort of · or something like that · and so on · a couple of", "1 · 2 (Part 3 dùng ít hơn)"],
          ["Câu cụt (ellipsis)", "Not really. · Depends on the day. · Couldn't agree more.", "1; mở đầu câu trả lời Part 3 rồi phát triển"],
          ["Lùi lại sửa ý", "…or rather, · what I mean is, · put another way,", "2 · 3 — dấu hiệu Fluency tốt, không phải vấp"],
          ["Từ nối nói", "so · but · and then · plus · mind you · that said", "1 · 2 · 3 (thay however / moreover)"],
        ],
      },
      {
        t: "table",
        caption: "Cùng một ý — Part 1 và Part 3 (nhích lên MỘT nấc, không phải hai)",
        head: ["Ý", "Part 1 (neutral – informal)", "Part 3 (neutral, nhích lên)", "Lệch lên — đừng nói"],
        rows: [
          ["Mua sắm trực tuyến tiện", "I buy most stuff online, to be honest — it's just easier.", "I'd say convenience is the main draw: people can compare prices in seconds without leaving the house.", "~~Online shopping is advantageous owing to its convenience. Moreover, …~~"],
          ["Người trẻ ít đọc sách", "My friends don't read much. They're on their phones all day.", "Young people do seem to read fewer books, though I suspect they read more text overall than their parents did.", "~~It is evident that the youth's reading habits have deteriorated.~~"],
          ["Giao thông tệ", "It's a nightmare at rush hour.", "Congestion tends to be at its worst around the school run, which suggests the problem is partly about how we plan cities.", "~~Traffic congestion constitutes a severe predicament.~~"],
        ],
      },
      {
        t: "note",
        title: "📌 Nhích lên một nấc ở Part 3 nghĩa là gì",
        items: [
          "Giữ viết tắt và từ mở lời, nhưng thêm ==ba thứ==: hedge bằng động từ (tend to, seem to), một danh từ trừu tượng (convenience, congestion, trust), và một câu phức có lý do / nhượng bộ.",
          "Từ nối vẫn là từ nối NÓI: **that said, mind you, having said that, then again** thay cho however; **on top of that, plus** thay cho furthermore.",
          "Idiom (Ngày 11): một cái mỗi hai, ba câu trả lời là đủ; đặt ở câu bình luận, không đặt ở câu lập luận chính.",
        ],
      },
      { t: "rule", formula: "Part 3 = Part 1 + hedge (tend to / seem to) + 1 danh từ trừu tượng + 1 câu phức  —  vẫn viết tắt, vẫn từ nối nói", vi: "Nhích lên một nấc. Nói như bài luận là lệch lên hai nấc." },
      {
        t: "quiz",
        id: "t5d15-noi-dich",
        kind: "translate",
        title: "Dịch sang tiếng Anh ở mức NÓI Part 3 — có viết tắt (4 câu)",
        grammar: "I'd say… · tend to / seem to · that said · though",
        items: [
          { q: "Tôi nghĩ chi phí là rào cản chính. (mở bằng I'd say)", answers: ["I'd say cost is the main barrier.", "I'd say the cost is the main barrier.", "I'd say cost is the main obstacle.", "I'd say cost is the biggest barrier.", "I'd say that cost is the main barrier."], hint: "I'd say · the main barrier" },
          { q: "Người lớn tuổi có xu hướng tin báo in hơn.", answers: ["Older people tend to trust newspapers more.", "Older people tend to trust print newspapers more.", "Older people tend to trust printed newspapers more.", "Older people tend to trust the printed press more.", "Older people tend to have more trust in newspapers."], hint: "tend to trust… more" },
          { q: "Nói vậy chứ, nó không hề rẻ. (mở bằng That said)", answers: ["That said, it isn't cheap.", "That said, it's not cheap.", "That said, it isn't cheap at all.", "That said, it's not cheap at all.", "That said, it's by no means cheap."], hint: "That said, · it isn't cheap" },
          { q: "Có vẻ người ta kiên nhẫn ít đi, dù tôi không chắc lắm.", answers: ["People seem to be less patient, though I'm not sure.", "People seem to be less patient, though I'm not entirely sure.", "People seem less patient, though I'm not sure.", "People seem less patient, though I'm not entirely sure.", "People seem to be less patient, although I'm not sure.", "People do seem less patient, though I'm not entirely sure.", "People seem to be less patient, though I'm not so sure."], hint: "seem (to be) less patient · though I'm not (entirely) sure" },
        ],
      },

      /* ── 6 ── */
      { t: "h", text: "6. Lệch register trong một câu — lỗi lộ nhất ở band 7" },
      {
        t: "p",
        text: "Một bài toàn câu trung tính không sao. Một bài formal mà rơi vào một chữ **kids** hay **a bunch of** thì chữ đó ==nhảy ra khỏi trang==. Giám khảo gọi là inconsistent register. Lỗi này hay nằm ở bốn chỗ: danh từ chỉ người, lượng từ, động từ “đa năng” (get, do, make, have) và từ nhấn.",
      },
      {
        t: "table",
        head: ["Chỗ lệch", "Câu lệch", "Sửa"],
        rows: [
          ["danh từ chỉ người", "Furthermore, ~~kids~~ who lack supervision are more likely to offend.", "…**children** who lack supervision…"],
          ["lượng từ", "The policy has brought ~~a bunch of~~ unintended consequences.", "…**a number of** unintended consequences."],
          ["get đa năng", "Unemployment ~~got worse~~ after the factory closed.", "Unemployment **rose / worsened** after the factory closed."],
          ["từ nhấn", "The results were ~~pretty~~ disappointing. / This is ~~super~~ important.", "The results were **rather** disappointing. / This is **of particular** importance."],
          ["thing / stuff", "Education is the most important ~~thing~~ for development.", "Education is the most important **factor in** development."],
          ["cụm động từ khẩu ngữ", "Councils should ~~crack down on~~ illegal dumping.", "Councils should **take firmer action against** illegal dumping. (crack down on được trong báo chí; bài luận nên trung tính hơn)"],
          ["lệch NGƯỢC khi nói", "Yeah, I love hiking; ~~furthermore~~, it's free.", "Yeah, I love hiking — **and** it's free. / **plus** it's free."],
        ],
      },
      {
        t: "table",
        caption: "get · do · make · have · big · good · bad → động từ / tính từ chính xác",
        head: ["Đa năng", "Trong Task 1 / Task 2 nên là"],
        rows: [
          ["get bigger / smaller", "increase, expand, grow / decrease, shrink, contract"],
          ["get a job / a degree / permission", "find employment / obtain a degree / be granted permission"],
          ["do research / do harm", "conduct (carry out) research / cause harm"],
          ["make a problem / make better", "create (give rise to) a problem / improve"],
          ["have an effect / have problems", "exert an effect (affect) / face (encounter) difficulties"],
          ["a big problem / a big change", "a serious (pressing) problem / a major (far-reaching) change"],
          ["good / bad for", "beneficial (conducive) to / harmful (detrimental) to"],
        ],
      },
      { t: "rule", formula: "soát register: người (kids → children) · lượng (a bunch of → a number of) · get / do / make → động từ chính xác · pretty / super → rather / highly · thing → factor / issue / aspect", vi: "Lượt soát thứ bảy cho bài Task 2: đọc lướt tìm đúng năm loại chữ này." },
      {
        t: "quiz",
        id: "t5d15-lech",
        kind: "fill",
        title: "Mỗi câu có MỘT chữ lệch register. Gõ chữ thay thế cho phần [trong ngoặc] (8 câu)",
        items: [
          { q: "1. In addition, many [kids] now own a tablet before they start school.", answers: ["children"], hint: "children" },
          { q: "2. Carbon emissions [got bigger] by 12% over the decade. (một từ)", answers: ["increased", "rose", "grew"], hint: "increased / rose / grew" },
          { q: "3. The reform caused [a bunch of] administrative problems. (ba từ: a ___ of)", answers: ["a number of", "a range of", "a series of", "a variety of"], hint: "a number of / a range of" },
          { q: "4. Researchers [did] a survey of 2,000 households. (một từ)", answers: ["conducted", "carried out", "undertook"], hint: "conducted / carried out" },
          { q: "5. Air pollution is [bad for] children's lungs. (hai từ: ___ to)", answers: ["harmful to", "detrimental to", "damaging to"], hint: "harmful to / detrimental to" },
          { q: "6. Cost is the most important [thing] in consumers' decisions. (một từ)", answers: ["factor", "consideration", "element"], hint: "factor" },
          { q: "7. The figures for 2020 were [pretty] similar to those for 2015. (một từ)", answers: ["fairly", "broadly", "rather", "very", "remarkably", "quite"], hint: "broadly / fairly" },
          { q: "8. (Speaking Part 1) I like the area, and [moreover] it's close to work. (một từ nói)", answers: ["plus", "besides", "also"], hint: "plus / besides — moreover là từ nối VIẾT." },
        ],
      },

      /* ── 7 ── */
      { t: "h", text: "7. Ứng dụng công việc — một lời đề nghị, ba mức" },
      {
        t: "p",
        text: "Trong công việc, register sai gây hậu quả thật: quá cộc với khách thì mất khách, quá khách sáo với đồng đội thì nghe xa cách. Ngữ pháp của phép lịch sự tiếng Anh rất đều: ==càng lùi thì (can → could → would), càng dài, càng gián tiếp thì càng lịch sự==. Tập 2 Ngày 24 dạy email formal / informal ở mức nhập; đây là thang đầy đủ.",
      },
      {
        t: "patterns",
        rows: [
          {
            formula: "Can you + V…? / V + …, will you?",
            vi: "Bạn bè, đồng đội thân — trực tiếp.",
            examples: [
              { en: "Can you send me the log file?", vi: "Gửi tớ tệp log được không?" },
              { en: "Have a look at my pull request when you get a sec, will you?", vi: "Rảnh thì xem giúp pull request của tớ nhé." },
            ],
          },
          {
            formula: "Could you + V…? / Would you mind + V-ing…?",
            vi: "Đồng nghiệp, cấp trên trực tiếp — trung tính lịch sự.",
            examples: [
              { en: "Could you review the draft by Thursday?", vi: "Anh xem giúp bản nháp trước thứ Năm được không?" },
              { en: "Would you mind moving our call to three o'clock?", vi: "Chị có phiền dời cuộc gọi của mình sang ba giờ không?" },
            ],
          },
          {
            formula: "I was wondering if + S + could + V / I would be grateful if + S + could + V",
            vi: "Khách hàng, người chưa quen, việc khó nhờ — formal.",
            examples: [
              { en: "I was wondering if you could extend the deadline by a week.", vi: "Tôi muốn hỏi liệu anh có thể gia hạn thêm một tuần không." },
              { en: "I would be grateful if you could confirm the delivery date in writing.", vi: "Tôi rất biết ơn nếu quý công ty xác nhận ngày giao hàng bằng văn bản." },
            ],
          },
        ],
      },
      {
        t: "table",
        caption: "Từ chối và báo tin xấu — ba mức",
        head: ["Việc", "Thân mật", "Trung tính", "Formal (viết cho khách)"],
        rows: [
          ["Từ chối", "Sorry, can't make it.", "I'm afraid I can't make Friday.", "Unfortunately, I will be unable to attend on Friday."],
          ["Báo trễ", "It's going to be late — sorry!", "I'm afraid there's going to be a short delay.", "We regret to inform you that delivery will be delayed by two days."],
          ["Nhắc việc", "Any news on this?", "Just checking whether you've had a chance to look at this.", "I am writing to follow up on my email of 3 May."],
          ["Không đồng ý", "No way. That won't work.", "I'm not sure that would work, to be honest.", "We have some reservations about this proposal."],
        ],
      },
      {
        t: "note",
        title: "⚠️ Người Việt hay sai khi viết email công việc",
        items: [
          "**Please + mệnh lệnh** tưởng là lịch sự: ~~Please send me the report today.~~ Với cấp trên hay khách, câu này là ra lệnh có thêm chữ please. Dùng **Could you send…?**",
          "**I want…** dịch từ “tôi muốn”: ~~I want to ask about the price.~~ → **I would like to ask… / I'd like to ask…**",
          "Trộn mức: mở thư **Dear Sir or Madam** rồi kết **Cheers** ; hoặc mở **Hi Tom** rồi viết **I hereby request**. Lời chào quyết định register của cả thư.",
          "Dùng **Dear** + tên riêng (Dear Anna,) là trung tính an toàn nhất với người đã trao đổi vài lần.",
        ],
      },
      { t: "rule", formula: "Can you…?  →  Could you…? / Would you mind V-ing…?  →  I was wondering if you could… / I would be grateful if you could…", vi: "Càng lùi thì, càng dài, càng gián tiếp ⇒ càng lịch sự. Chọn theo khoảng cách với người nhận và độ khó của việc nhờ." },
      {
        t: "quiz",
        id: "t5d15-de-nghi-dich",
        kind: "translate",
        title: "Dịch sang tiếng Anh đúng mức ghi trong ngoặc (4 câu)",
        grammar: "Could you…? · Would you mind V-ing…? · I was wondering if you could… · I would be grateful if you could…",
        items: [
          { q: "(đồng nghiệp) Anh có phiền kiểm tra giúp số liệu không?", answers: ["Would you mind checking the figures?", "Would you mind checking the figures for me?", "Would you mind checking the numbers?", "Would you mind checking the data?", "Would you mind checking the numbers for me?"], hint: "Would you mind + V-ing" },
          { q: "(khách hàng, formal) Tôi rất biết ơn nếu anh có thể gửi hợp đồng trước thứ Sáu.", answers: ["I would be grateful if you could send the contract by Friday.", "I would be grateful if you could send the contract before Friday.", "I would be grateful if you could send me the contract by Friday.", "I would be very grateful if you could send the contract by Friday.", "I would be most grateful if you could send the contract by Friday."], hint: "I would be grateful if you could… · by Friday" },
          { q: "(cấp trên) Tôi muốn hỏi liệu chị có thể gia hạn thêm hai ngày không.", answers: ["I was wondering if you could extend the deadline by two days.", "I was wondering whether you could extend the deadline by two days.", "I was wondering if you could give me two more days.", "I was wondering if you could extend the deadline by another two days.", "I was wondering if you could give me an extra two days."], hint: "I was wondering if you could… · extend the deadline by two days" },
          { q: "(trung tính) Tôi e là tôi không dự được cuộc họp thứ Hai.", answers: ["I'm afraid I can't make the meeting on Monday.", "I'm afraid I can't make Monday's meeting.", "I'm afraid I can't attend the meeting on Monday.", "I'm afraid I won't be able to make the meeting on Monday.", "I'm afraid I won't be able to attend the meeting on Monday.", "I'm afraid I can't attend Monday's meeting.", "I am afraid I cannot attend the meeting on Monday."], hint: "I'm afraid I can't make / attend…" },
        ],
      },

      /* ── 8 ── */
      { t: "h", text: "8. Kiểm tra cuối bài (14 câu)" },
      {
        t: "mcq",
        id: "t5d15-np-chon",
        title: "Chọn phương án hợp register / tone nhất (8 câu)",
        items: [
          { q: "1. (Task 1) The number of visitors ___ between 2010 and 2015.", options: ["went through the roof", "rose sharply", "experienced a truly breathtaking escalation"], correct: 1, why: "A là thành ngữ khẩu ngữ. C trang trọng giả và có từ cảm xúc (breathtaking) — Task 1 phải khách quan. rose sharply: chính xác, trung tính." },
          { q: "2. (Task 2, thân bài) ___ that stricter penalties would reduce reoffending.", options: ["Everybody knows", "It is far from certain", "I reckon it's doubtful"], correct: 1, why: "A: booster võ đoán. C: reckon + it's là khẩu ngữ. B: cấu trúc phi nhân xưng + hedge đúng mức." },
          { q: "3. (Speaking Part 1) “Do you like your neighbourhood?” —", options: ["Yes. Furthermore, it possesses numerous amenities.", "Yeah, it's great — there's loads to do, and it's pretty quiet at night.", "My neighbourhood is satisfactory with respect to facilities."], correct: 1, why: "Part 1 là neutral – informal: viết tắt, loads to do, pretty quiet đều tự nhiên. A và C là văn viết." },
          { q: "4. (Speaking Part 3) Chọn câu nhích lên MỘT nấc.", options: ["People are lazy now, that's all.", "I'd say people tend to value convenience more than they used to.", "It is indisputable that contemporary society prioritises convenience."], correct: 1, why: "A quá suồng sã và võ đoán. C là giọng bài luận + booster. B: I'd say (viết tắt) + tend to (hedge) + convenience (danh từ trừu tượng)." },
          { q: "5. (Email cho khách hàng lần đầu) Mở thư:", options: ["Hey there,", "Dear Ms Tran,", "To whom it may concern, yo"], correct: 1, why: "Biết tên thì Dear + Ms / Mr + họ. Hey there quá thân; To whom it may concern chỉ dùng khi không biết người nhận." },
          { q: "6. (Task 2) Chọn câu KHÔNG có chữ lệch register.", options: ["A lot of stuff is thrown away every day.", "Vast quantities of food are discarded every day.", "Loads of food gets chucked out daily."], correct: 1, why: "stuff, loads of, chucked out đều khẩu ngữ. B: vast quantities of + discarded." },
          { q: "7. (Kết bài Task 2) Chọn câu chốt lập trường tốt nhất.", options: ["So maybe the advantages might be a bit bigger, I guess.", "On balance, I am convinced that the benefits outweigh the costs.", "It cannot be denied by anyone that the benefits are infinitely greater."], correct: 1, why: "A: ba hedge + khẩu ngữ. C: booster quá tay (by anyone, infinitely). B: rõ, chắc, không gắt." },
          { q: "8. (Nói với trưởng nhóm) Nhờ xem lại mã trước giờ họp:", options: ["Review my code now.", "Could you take a look at my code before the meeting?", "I hereby request that you peruse my code."], correct: 1, why: "A là mệnh lệnh. C quá trang trọng tới mức buồn cười trong một nhóm làm việc. B: Could you + cụm động từ tự nhiên take a look at." },
        ],
      },
      {
        t: "quiz",
        id: "t5d15-np-doi",
        kind: "fill",
        title: "Đổi sang mức ghi trong ngoặc — gõ phần còn thiếu (6 câu)",
        items: [
          { q: "1. (→ formal) Prices went up a lot. → Prices ___ considerably. (một từ)", answers: ["rose", "increased"], hint: "rose / increased" },
          { q: "2. (→ formal) People think the law is unfair. → It is widely ___ that the law is unfair. (một từ)", answers: ["believed", "felt", "thought", "held"], hint: "It is widely believed / felt that…" },
          { q: "3. (→ formal) We need more nurses. → There is a ___ for more nurses. (một từ)", answers: ["need", "demand", "requirement"], hint: "There is a need for…" },
          { q: "4. (→ nói) However, it is expensive. → That ___, it's expensive. (một từ)", answers: ["said"], hint: "That said," },
          { q: "5. (→ lịch sự hơn) Can you send it today? → ___ you mind sending it today? (một từ)", answers: ["Would"], hint: "Would you mind + V-ing" },
          { q: "6. (→ tone đo được) This will definitely fix the problem. → This is ___ to fix the problem. (một từ)", answers: ["likely"], hint: "be likely to" },
        ],
      },
      {
        t: "note",
        title: "📌 Mang gì sang hai bài sau",
        items: [
          "**Bài 2 (Reading):** bài đọc hôm nay thuật ý của bảy người. Để ý ==động từ tường thuật== (argued, pointed out, concluded) và hedge của TÁC GIẢ — đó là tone, và câu hỏi matching features bám vào nó.",
          "**Bài 3 (Speaking):** dùng thang register của mục 5 và thang lịch sự của mục 7 để phản biện giám khảo và thương lượng trong công việc.",
          "Ghi vào sổ lỗi (Ngày 3) hai chữ lệch register bạn hay dùng nhất. Với đa số người Việt: **kids** và **a lot of things**.",
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI 2 — ĐỌC ═══════════════════════════ */
  {
    id: "t5d15-doc",
    kind: "reading",
    title: "Đọc: Matching information + Matching features band 8 — bài nhiều học thuyết, nhiều người",
    goal: "Làm 15 câu matching information và matching features của một Passage 3 hơn 1.000 từ trong 20 phút với ít nhất 13 câu đúng: lập “bản đồ đoạn” ngay trong lượt đọc đầu, phân biệt ý của người NÊU thuyết với ý của người PHẢN BÁC và với ý của TÁC GIẢ, nhận ra paraphrase mức 4 (ý ẩn, đổi cấu trúc), và xử lý được luật “một chữ cái có thể dùng nhiều lần”.",
    minutes: 90,
    blocks: [
      {
        t: "recap",
        items: [
          "Hai dạng hôm nay đều là dạng **nối**, và đều ==không theo thứ tự bài đọc==: **matching information** (đoạn nào chứa thông tin này?) và **matching features** (ý này của ai?).",
          "Đẩy **Reading từ 33–34 lên 35+**: ở band 8, hai dạng này mất điểm không phải vì không hiểu, mà vì ==quay lại bài quá nhiều lần== và vì gán ý của người phản bác cho người nêu thuyết.",
          "Vòng 3 của cả hai dạng: Matching information — Tập 3 Ngày 19, Tập 4 Ngày 19; Matching features — Tập 3 Ngày 21, Tập 4 Ngày 23. Hôm nay là bài trừu tượng: nhiều học thuyết, mỗi thuyết có người nêu, người bác, và tác giả đứng trên tất cả.",
          "Kỹ thuật mới: **bản đồ đoạn hai cột** (chức năng đoạn + tên người) lập trong lượt đọc đầu, để mọi câu hỏi chỉ cần quay lại ĐÚNG một đoạn.",
          "Nối với Bài 1: động từ tường thuật và hedge cho biết ai nói, chắc tới đâu — đó là chìa khoá của matching features.",
        ],
      },

      { t: "h", text: "1. Hai dạng nối — giống và khác" },
      {
        t: "table",
        head: ["", "Matching information", "Matching features"],
        rows: [
          ["Câu hỏi", "Which paragraph contains the following information?", "Match each statement with the correct person / theory / period."],
          ["Đáp án", "chữ cái của ĐOẠN (A–H)", "chữ cái trong HỘP danh sách (A–G)"],
          ["Thứ tự", "không theo bài", "không theo bài (nhưng tên trong hộp thường theo thứ tự xuất hiện)"],
          ["Lời câu hỏi", "cụm danh từ mô tả LOẠI thông tin: a reference to… · an example of… · a reason why… · the claim that…", "một câu trọn, paraphrase ý của người đó"],
          ["Luật hay gặp", "NB You may use any letter more than once — có đoạn chứa 2 đáp án, có đoạn không chứa đáp án nào", "NB … more than once — có người khớp 2 câu; có tên trong bài KHÔNG có trong hộp"],
          ["Bẫy band 8", "từ khoá nằm ở đoạn X nhưng LOẠI thông tin (ví dụ, lý do, phản bác) nằm ở đoạn Y", "ý nằm trong đoạn nói về người A nhưng do người B (người phản bác) nêu"],
        ],
      },
      {
        t: "note",
        title: "📌 Đọc kỹ danh từ đầu câu hỏi matching information",
        items: [
          "**a reference to** = chỉ cần nhắc tới, có thể một cụm ngắn. **an account / a description of** = kể chi tiết, vài câu.",
          "**an example of** = phải có trường hợp cụ thể. **a reason why / an explanation of** = phải có quan hệ nhân quả.",
          "**the claim that / the suggestion that** = một ý kiến (của tác giả hoặc ai đó); **a criticism / an objection** = ý chê.",
          "Đoạn có đúng chủ đề nhưng sai LOẠI thông tin là đoạn bẫy. Câu hỏi “an example of X” không khớp với đoạn chỉ định nghĩa X.",
        ],
      },

      { t: "h", text: "2. Bản đồ đoạn hai cột — lập trong lượt đọc đầu" },
      {
        t: "p",
        text: "Ở Ngày 1 bạn đã tập đọc ==một lần== 900 từ trong 15 phút. Với hai dạng nối, lượt đọc đó phải để lại dấu vết trên giấy nháp (bản máy: ô ghi chú), nếu không mỗi câu hỏi sẽ bắt bạn quét lại cả bài. Mỗi đoạn ghi **hai thứ**: đoạn này LÀM GÌ (3–5 chữ) và CÓ AI trong đó.",
      },
      {
        t: "sodo", kind: "flow", title: "Quy trình 20 phút cho 15 câu nối",
        steps: [
          { label: "0′–1′ · đọc hộp tên + lướt câu hỏi", sub: "khoanh tên riêng; gạch danh từ đầu mỗi câu matching information" },
          { label: "1′–9′ · đọc bài MỘT lần, lập bản đồ đoạn", sub: "mỗi đoạn: chức năng + tên người + dấu ✗ nếu có phản bác" },
          { label: "9′–14′ · làm matching features trước", sub: "mỗi câu → tìm tên trên bản đồ → đọc lại 2–3 câu quanh tên đó" },
          { label: "14′–19′ · làm matching information", sub: "mỗi câu → đoán 1–2 đoạn theo bản đồ → kiểm LOẠI thông tin" },
          { label: "19′–20′ · soát luật NB", sub: "có chữ nào dùng hai lần? có câu nào còn trống? không bỏ trống" },
        ],
      },
      {
        t: "note",
        title: "💡 Mẹo — vì sao làm matching features TRƯỚC",
        items: [
          "Tên riêng viết hoa, mắt quét là thấy ⇒ features là dạng ==định vị nhanh==. Làm xong tám câu features, bạn đã đọc lại kỹ gần hết các đoạn giữa bài.",
          "Matching information không có từ khoá để quét (câu hỏi là paraphrase trừu tượng). Làm sau, khi đã thuộc bài, thì chỉ còn là việc nhớ lại.",
          "Trong đề thật, thứ tự in có thể là information trước. Bạn được phép làm theo thứ tự của mình — bản máy cho nhảy câu tự do.",
        ],
      },
      { t: "rule", formula: "đọc 1 lần + bản đồ đoạn (chức năng · tên · ✗)  →  features trước  →  information sau  →  soát NB", vi: "Mỗi câu hỏi chỉ được quay lại đúng MỘT đoạn. Phải quét lại cả bài nghĩa là bản đồ chưa đủ tốt." },

      { t: "h", text: "3. “Ý của ai?” — ba tầng giọng trong một đoạn" },
      {
        t: "p",
        text: "Một đoạn văn học thuật về một học thuyết thường có ba giọng: ==người nêu thuyết==, ==người phản bác==, và ==tác giả== đánh giá. Matching features chỉ hỏi hai giọng đầu, nhưng trộn chúng với nhau. Đọc đoạn mẫu ngắn này (không thuộc bài chính):",
      },
      {
        t: "passage",
        title: "Đoạn mẫu",
        paras: [
          { text: "For Dr Lena Marsh, forgetting is simply decay: a memory that is not used fades like an unwatered plant. Her colleague Paul Odell has long resisted this picture, pointing out that people often recall in old age events they had not thought of for fifty years. Neither account, it must be said, explains why some trivial memories last a lifetime." },
        ],
      },
      {
        t: "table",
        head: ["Câu trong đoạn", "Giọng của ai", "Tín hiệu"],
        rows: [
          ["forgetting is simply decay… fades like an unwatered plant", "**Marsh** (người nêu)", "For Dr Lena Marsh, …"],
          ["people often recall in old age events they had not thought of for fifty years", "**Odell** (người phản bác)", "has long resisted this picture, pointing out that…"],
          ["Neither account… explains why some trivial memories last", "**tác giả**", "it must be said (từ chỉ thái độ — Bài 1 mục 4)"],
        ],
      },
      {
        t: "mcq",
        id: "t5d15-doc-khoi-dong",
        title: "Khởi động — ý của ai? (4 câu; đoạn mẫu là hư cấu)",
        items: [
          { q: "1. Memories that are left unused gradually weaken.", options: ["Marsh", "Odell", "Neither (the writer's own view)"], correct: 0, why: "“a memory that is not used fades” — ý của Marsh. left unused = not used; gradually weaken = fades." },
          { q: "2. Long periods without recalling an event do not necessarily erase it.", options: ["Marsh", "Odell", "Neither (the writer's own view)"], correct: 1, why: "Odell: người già nhớ lại chuyện năm mươi năm không nghĩ tới ⇒ không dùng lâu vẫn không mất. Câu này nằm trong đoạn nói về thuyết của Marsh nhưng là ý NGƯỢC lại với Marsh — bẫy kinh điển." },
          { q: "3. Existing explanations fail to account for the survival of unimportant memories.", options: ["Marsh", "Odell", "Neither (the writer's own view)"], correct: 2, why: "“Neither account, it must be said, explains…” — giọng tác giả. Trong đề thật, câu kiểu này sẽ không có trong danh sách features (hoặc là câu YES/NO/NOT GIVEN)." },
          { q: "4. Which word shows that Odell has held his position for some time?", options: ["simply", "long", "often"], correct: 1, why: "“has long resisted” = đã phản đối từ lâu. long đứng giữa trợ động từ và V3 là trạng từ chỉ thời gian, formal (Bài 1)." },
        ],
      },
      {
        t: "table",
        caption: "Động từ tường thuật — ai đứng ở đâu",
        head: ["Động từ", "Người được thuật đang", "Ví dụ"],
        rows: [
          ["argue · propose · suggest · maintain · hold that", "NÊU thuyết", "Raskin argued that…"],
          ["observe · point out · note · object · reply · counter", "PHẢN BÁC hoặc bổ sung", "Hutcheson observed that…"],
          ["conclude · infer", "RÚT RA từ dữ liệu", "Provine concluded that…"],
          ["claim · is said to · supposedly", "tác giả GIỮ KHOẢNG CÁCH với ý đó", "a proposal that claims to handle…"],
          ["show · demonstrate · establish · reveal", "tác giả CHẤP NHẬN ý đó là đúng", "The study showed that…"],
        ],
      },
      { t: "rule", formula: "For X, … / X argued that … = ý của X   ·   Y observed / pointed out / replied that … = ý của Y (phản bác)   ·   it must be said / though / in other words = tác giả", vi: "Ý phản bác nằm TRONG đoạn nói về X vẫn là ý của Y. Nhìn động từ tường thuật, đừng nhìn vị trí." },

      { t: "h", text: "4. Bài chính — 20 phút, Questions 1–15" },
      {
        t: "p",
        text: "Đặt đồng hồ **20:00**. Đọc ==một lần==, lập bản đồ đoạn hai cột ra giấy. Không tra từ. Làm Questions 8–15 trước rồi quay lại 1–7 nếu muốn.",
      },
      {
        t: "passage",
        title: "What Is So Funny?",
        intro: "Three old theories of laughter, and why none of them has had the last word",
        paras: [
          { label: "A", text: "Few human behaviours are as familiar as laughter, and few have proved as resistant to explanation. Philosophers have been proposing accounts of what makes things funny for well over two thousand years, yet anyone who asks the question today will be offered not one answer but several, each defended by a school inclined to regard its rivals as having mistaken a part for the whole. The three oldest accounts are still the ones against which newer proposals are measured, and it is worth setting them out in turn, together with the objections that have dogged each of them, before asking whether the question has been well posed in the first place." },
          { label: "B", text: "The earliest tradition treats laughter as an expression of triumph. Hints of it can be found in ancient Greek philosophy, but its classic statement belongs to the seventeenth-century English thinker Thomas Hobbes, for whom laughter arose from a ‘sudden glory’: the abrupt recognition of some advantage in ourselves by comparison with the weakness of other people, or with our own weakness at an earlier time. The idea accounts neatly for mockery and for our amusement at another person's clumsy fall. It was not long, however, before its limits were exposed. Writing in the following century, Francis Hutcheson observed that if a sense of superiority were all that was required, the wealthy and healthy ought to find the sight of the poor and the sick hilarious, which, as a rule, they do not. Nor is it easy to see over whom we are triumphing when we laugh at a play on words." },
          { label: "C", text: "A second tradition locates the source of laughter not in what we think of others but in what happens inside ourselves. In an essay of 1860 Herbert Spencer described laughter as the discharge, through the muscles, of nervous energy that had been built up and was no longer needed. Sigmund Freud later gave the notion a psychological turn: a joke, he proposed in 1905, lets us voice hostile or indecent thoughts that we ordinarily spend effort suppressing, and the effort thus saved is released as laughter. That many jokes touch on forbidden subjects, and that people often laugh when a danger has passed, lends the account a certain plausibility. Its foundations, though, have not worn well. The picture of the nervous system as a set of vessels under pressure corresponds to nothing in modern physiology, and the theory has little to say about humour that is entirely innocent." },
          { label: "D", text: "The account that commands the widest support today is concerned with neither status nor tension but with surprise. Immanuel Kant, in 1790, traced laughter to an expectation that has been strained and then suddenly comes to nothing; Arthur Schopenhauer, a generation later, spoke of a mismatch between an idea and the object to which it is applied. On this view a joke lays down a pattern and then breaks it. The difficulty is that the world is full of broken patterns that amuse nobody. A stranger's face at one's bedroom window at midnight is as unexpected as any punchline. Incongruity, in other words, may be necessary for humour, but it can hardly be sufficient, and for a long time the theory's defenders were unable to say what else was needed." },
          { label: "E", text: "One attempt to supply the missing ingredient came from linguistics. In 1985 Victor Raskin argued that a joke is a text compatible, wholly or in part, with two different ‘scripts’, or familiar scenarios, which are opposed to each other in some definite way: the listener is led along one until the final line forces a switch to the other. Because it specified conditions that a piece of language either does or does not meet, the proposal appealed to researchers hoping to teach computers to recognise or even generate jokes. By the same token, it was confined to jokes that are told. About the laughter provoked by a custard pie, or by being tickled, it was silent." },
          { label: "F", text: "Tickling is among the cases that a more recent proposal claims to handle. In 2010 the psychologists Peter McGraw and Caleb Warren suggested that we are amused when something strikes us as a violation, a threat to how we believe things ought to be, while appearing at the same moment to be harmless. Tickling is a mock attack by someone we trust; we cannot tickle ourselves, since no attack is perceived, and being tickled by a stranger is alarming rather than funny. The same reasoning is said to explain why a misfortune that could not be joked about last week may be joked about next year: distance, whether in time or in space, renders the violation benign. Critics reply that both key terms are so elastic that almost any instance of humour can be made to fit them after the event, which is a weakness in a theory, not a strength." },
          { label: "G", text: "All of these accounts begin from the joke. Robert Provine, an American neuroscientist, began instead from the laugh. Rather than bring volunteers into a laboratory and show them comedy, he and his students spent many months noting down, in shopping centres and on pavements, what people said immediately before they laughed, without the speakers' knowledge. Of some twelve hundred episodes, only a small minority followed anything resembling a joke; far more often the trigger was a remark as ordinary as a farewell. Speakers, moreover, laughed considerably more than their listeners, and people turned out to be about thirty times more likely to laugh in company than alone. Provine concluded that laughter is first and foremost a social signal, akin to the panting sounds made by young apes at play, and that its connection with humour is a comparatively late development." },
          { label: "H", text: "If he is right, the theorists of humour and the student of laughter have not been disagreeing so much as answering separate questions. It may even be that the classic theories are not rivals either. One describes a mental trigger, another an emotional condition under which the trigger works, a third the use to which the result is put among other people. The error that has kept the argument alive for so long is perhaps the assumption that because we have a single word, ‘funny’, there must be a single thing for it to name. Whether a unified account can be built from the pieces remains to be seen; that no one piece will do the job alone seems reasonably clear." },
        ],
      },
      {
        t: "p",
        text: "**Questions 1–7.** The passage has eight paragraphs, **A–H**. Which paragraph contains the following information? Write the correct letter, **A–H**. **NB** You may use any letter more than once.",
      },
      {
        t: "quiz",
        id: "t5d15-doc-info",
        kind: "fill",
        title: "Questions 1–7 — gõ chữ cái của đoạn (A–H)",
        items: [
          { q: "1. a reference to sounds produced by other species", answers: ["G"], hint: "Đoạn G: “akin to the panting sounds made by young apes at play”. other species = young apes; sounds produced = panting sounds made. “a reference to” ⇒ chỉ một cụm ngắn ở cuối đoạn là đủ." },
          { q: "2. an explanation of why the passing of time can make a subject acceptable to joke about", answers: ["F"], hint: "Đoạn F: “a misfortune that could not be joked about last week may be joked about next year: distance, whether in time or in space, renders the violation benign.” Dấu hai chấm mở phần giải thích ⇒ đúng loại “an explanation of why”." },
          { q: "3. the claim that a theory rests on an outdated understanding of the body", answers: ["C"], hint: "Đoạn C: “The picture of the nervous system as a set of vessels under pressure corresponds to nothing in modern physiology.” outdated understanding of the body = corresponds to nothing in modern physiology. Bẫy B: có “weakness” nhưng đó là điểm yếu của NGƯỜI KHÁC, không phải của cơ thể học." },
          { q: "4. a description of research carried out without the participants being aware of it", answers: ["G"], hint: "Đoạn G: “noting down… what people said immediately before they laughed, without the speakers' knowledge.” Đây là lần thứ HAI dùng chữ G — luật NB. Nếu bạn loại G vì “đã dùng rồi” thì mất câu này." },
          { q: "5. the suggestion that long-established accounts may complement one another", answers: ["H"], hint: "Đoạn H: “It may even be that the classic theories are not rivals either. One describes…, another…, a third…” complement one another = not rivals + mỗi thuyết tả một phần. Bẫy A: A nói các trường phái COI NHAU là sai — ngược lại." },
          { q: "6. an example of fortunate people failing to react as a theory would predict", answers: ["B"], hint: "Đoạn B: “the wealthy and healthy ought to find the sight of the poor and the sick hilarious, which, as a rule, they do not.” fortunate people = the wealthy and healthy; failing to react as predicted = ought to… they do not." },
          { q: "7. a reason why one account attracted interest from people working with machines", answers: ["E"], hint: "Đoạn E: “Because it specified conditions that a piece of language either does or does not meet, the proposal appealed to researchers hoping to teach computers…” Because… mở LÝ DO ⇒ đúng loại “a reason why”." },
        ],
      },
      {
        t: "p",
        text: "**Questions 8–15.** Look at the following statements and the list of people below. Match each statement with the correct person or people, **A–G**. **NB** You may use any letter more than once.",
      },
      {
        t: "table",
        caption: "List of People",
        head: ["Chữ", "Người"],
        rows: [
          ["A", "Thomas Hobbes"],
          ["B", "Francis Hutcheson"],
          ["C", "Sigmund Freud"],
          ["D", "Immanuel Kant"],
          ["E", "Victor Raskin"],
          ["F", "Peter McGraw and Caleb Warren"],
          ["G", "Robert Provine"],
        ],
      },
      {
        t: "quiz",
        id: "t5d15-doc-feature",
        kind: "fill",
        title: "Questions 8–15 — gõ chữ cái của người (A–G)",
        items: [
          { q: "8. Laughter results when something we have been waiting for fails to materialise.", answers: ["D"], hint: "Kant: “an expectation that has been strained and then suddenly comes to nothing”. waiting for = expectation; fails to materialise = comes to nothing. Schopenhauer cùng đoạn nói ý khác (mismatch) và KHÔNG có trong hộp." },
          { q: "9. We may laugh on realising that we are better placed than we ourselves once were.", answers: ["A"], hint: "Hobbes: “…or with our own weakness at an earlier time”. Người làm vội chỉ nhớ nửa đầu (so với người khác) và bỏ qua nửa sau dấu phẩy. than we ourselves once were = our own weakness at an earlier time." },
          { q: "10. What people say just before they laugh is seldom witty.", answers: ["G"], hint: "Provine: “only a small minority followed anything resembling a joke; far more often the trigger was a remark as ordinary as a farewell”. seldom witty = only a small minority… a joke." },
          { q: "11. Humour gives an outlet to impulses that are normally held in check.", answers: ["C"], hint: "Freud: “lets us voice hostile or indecent thoughts that we ordinarily spend effort suppressing”. held in check = suppressing; gives an outlet = lets us voice. Spencer cùng đoạn chỉ nói năng lượng thần kinh, không nói ý nghĩ bị kìm nén — và không có trong hộp." },
          { q: "12. A humorous text must lend itself to two conflicting interpretations.", answers: ["E"], hint: "Raskin: “a text compatible… with two different ‘scripts’… which are opposed to each other”. conflicting = opposed; lend itself to = compatible with." },
          { q: "13. Something amuses us only if it seems both wrong and safe at once.", answers: ["F"], hint: "McGraw và Warren: “a violation… while appearing at the same moment to be harmless”. wrong = violation; safe = harmless; at once = at the same moment." },
          { q: "14. Feeling more fortunate than another person is not enough to make us laugh.", answers: ["B"], hint: "Hutcheson: “if a sense of superiority were all that was required, the wealthy… ought to find… hilarious, which… they do not”. Ý này nằm trong đoạn B — đoạn của HOBBES — nhưng là lời phản bác của Hutcheson. Chọn A là rơi đúng bẫy mục 3." },
          { q: "15. The person who is talking laughs more than those who are being addressed.", answers: ["G"], hint: "Provine: “Speakers… laughed considerably more than their listeners”. Chữ G dùng lần thứ hai trong nhóm này (câu 10 và 15)." },
        ],
      },

      { t: "h", text: "5. Chấm điểm và bảng paraphrase" },
      {
        t: "table",
        head: ["Số câu đúng / 15", "Ước tính", "Việc cần làm"],
        rows: [
          ["14–15", "mức band 8–8.5 cho hai dạng này", "Giữ quy trình; lần sau ép thời gian xuống 18 phút."],
          ["12–13", "mức band 7.5", "Xem câu sai thuộc bẫy nào ở bảng dưới; thường là câu 9 hoặc 14."],
          ["9–11", "mức band 6.5–7", "Bản đồ đoạn chưa ghi tên người phản bác. Làm lại mục 3, rồi làm bài ở Bài tập."],
          ["≤ 8", "dưới band 6.5", "Ôn Tập 4 Ngày 19 (matching information) và Ngày 23 (matching features) trước khi đi tiếp."],
        ],
      },
      {
        t: "table",
        caption: "Paraphrase mức 4 trong bài — câu hỏi không dùng lại từ nào của bài",
        head: ["Câu hỏi", "Trong bài", "Kiểu paraphrase"],
        rows: [
          ["fails to materialise", "comes to nothing", "động từ ↔ cụm động từ"],
          ["better placed than we ourselves once were", "our own weakness at an earlier time", "đổi cấu trúc: so sánh ↔ cụm danh từ"],
          ["held in check", "spend effort suppressing", "thành ngữ ↔ diễn giải"],
          ["lend itself to two conflicting interpretations", "compatible with two… scripts… opposed to each other", "đổi loại từ + gộp hai mệnh đề"],
          ["outdated understanding of the body", "corresponds to nothing in modern physiology", "ý ẩn: không khớp hiện đại ⇒ lỗi thời"],
          ["fortunate people", "the wealthy and healthy", "khái quát ↔ cụ thể"],
          ["complement one another", "not rivals… One describes…, another…, a third…", "ý ẩn: mỗi cái một phần ⇒ bổ sung nhau"],
          ["people working with machines", "researchers hoping to teach computers", "khái quát ↔ cụ thể"],
        ],
      },
      {
        t: "note",
        title: "⚠️ Ba bẫy của bài này — bạn rơi vào cái nào?",
        items: [
          "**Bẫy vị trí (câu 14):** ý nằm trong đoạn của Hobbes nhưng là của Hutcheson. Dấu hiệu: “It was not long, however, before its limits were exposed” — câu chuyển giọng.",
          "**Bẫy nửa câu (câu 9):** định nghĩa của Hobbes có hai nửa nối bằng **or**; câu hỏi lấy nửa sau.",
          "**Bẫy NB (câu 4, câu 15):** chữ G đúng bốn lần cả bài (1, 4, 10, 15). Đề thật không cân đều đáp án cho bạn đoán.",
          "Tên có trong bài nhưng không có trong hộp (Spencer, Schopenhauer) là ==mồi==: ý của họ gần ý của Freud và Kant nhưng không trùng.",
        ],
      },

      { t: "h", text: "6. Soi tone của tác giả — nối với Bài 1" },
      {
        t: "p",
        text: "Tác giả không viết “thuyết này sai”. Ông dùng hedge và từ chỉ thái độ để đánh giá — đúng cách bạn sẽ làm trong Task 2. Điền từ tác giả đã dùng (xem lại bài nếu cần).",
      },
      {
        t: "quiz",
        id: "t5d15-doc-soi",
        kind: "fill",
        title: "Điền MỘT từ lấy từ bài đọc (6 câu)",
        items: [
          { q: "1. (Đoạn C) …lends the account a ___ plausibility. — tác giả công nhận một phần", answers: ["certain"], hint: "a certain plausibility = có phần hợp lý; certain ở đây là hedge, không phải “chắc chắn”." },
          { q: "2. (Đoạn D) Incongruity… may be necessary for humour, but it can ___ be sufficient.", answers: ["hardly"], hint: "can hardly = khó mà — phủ định mềm." },
          { q: "3. (Đoạn F) a more recent proposal ___ to handle — tác giả giữ khoảng cách", answers: ["claims"], hint: "claims to = tự cho là; tác giả chưa xác nhận." },
          { q: "4. (Đoạn F) The same reasoning is ___ to explain why…", answers: ["said"], hint: "is said to — bị động tường thuật, giữ khoảng cách." },
          { q: "5. (Đoạn H) The error… is ___ the assumption that…", answers: ["perhaps"], hint: "perhaps — hedge cho ý của chính tác giả." },
          { q: "6. (Đoạn H) that no one piece will do the job alone seems ___ clear.", answers: ["reasonably"], hint: "reasonably clear — chắc vừa đủ, không tuyệt đối." },
        ],
      },

      { t: "h", text: "7. Từ vựng hữu ích từ bài đọc" },
      {
        t: "vocab",
        items: [
          { w: "incongruity", pos: "n", ipa: "/ˌɪnkɒnˈɡruːəti/", vi: "sự bất tương hợp, cái không ăn khớp", ex: "The humour lies in the incongruity between his formal tone and the silly subject.", exVi: "Cái buồn cười nằm ở chỗ giọng trang trọng của anh ta không ăn khớp với đề tài ngớ ngẩn.", more: "adj **incongruous** · the incongruity **between** A **and** B" },
          { w: "mockery", pos: "n", ipa: "/ˈmɒkəri/", vi: "sự chế giễu", ex: "The proposal was greeted with mockery in the press.", exVi: "Đề xuất bị báo chí chế giễu.", more: "v **mock** · **make a mockery of** (biến thành trò hề)" },
          { w: "play on words", pos: "n", ipa: "/ˌpleɪ ɒn ˈwɜːdz/", vi: "lối chơi chữ", ex: "The headline is a play on words that only native speakers will catch.", exVi: "Tiêu đề là một lối chơi chữ mà chỉ người bản ngữ mới nhận ra.", more: "đồng nghĩa: **a pun** · số nhiều: **plays on words**." },
          { w: "punchline", pos: "n", ipa: "/ˈpʌntʃlaɪn/", vi: "câu chốt gây cười (của một truyện cười)", ex: "He told the joke well but forgot the punchline.", exVi: "Anh ấy kể chuyện cười hay nhưng quên mất câu chốt.", more: "**deliver / get to the punchline** · nghĩa rộng: điểm chốt bất ngờ của một bài nói." },
          { w: "benign", pos: "adj", ipa: "/bɪˈnaɪn/", vi: "vô hại, lành tính", ex: "What looks like a threat often turns out to be benign.", exVi: "Thứ trông như mối đe doạ hoá ra thường vô hại.", more: "y khoa: a **benign** tumour ↔ **malignant** · chữ g câm" },
          { w: "command", pos: "v", ipa: "/kəˈmɑːnd/", vi: "(trang trọng) có được, giành được (sự ủng hộ, tôn trọng, giá cao)", ex: "The proposal commands wide support among teachers.", exVi: "Đề xuất này được giáo viên ủng hộ rộng rãi.", more: "**command support / respect / attention / a high price** — nghĩa này khác “ra lệnh”. Trong bài: the account that commands the widest support." },
          { w: "akin to", pos: "adj phr", ipa: "/əˈkɪn tə/", vi: "tương tự, gần với", ex: "Learning to code is akin to learning a foreign language.", exVi: "Học lập trình cũng gần như học một ngoại ngữ.", more: "formal hơn **similar to**; chỉ đứng sau động từ (be akin to)" },
          { w: "dog", pos: "v", ipa: "/dɒɡ/", vi: "đeo bám dai dẳng (vấn đề, tai tiếng)", ex: "The project has been dogged by delays from the start.", exVi: "Dự án bị chậm trễ đeo bám ngay từ đầu.", more: "thường bị động: **be dogged by** problems / injury / controversy" },
          { w: "by the same token", pos: "phr", ipa: "/baɪ ðə seɪm ˈtəʊkən/", vi: "cũng chính vì lẽ đó; tương tự như vậy", ex: "The method is precise; by the same token, it is narrow.", exVi: "Phương pháp này chính xác; cũng vì thế mà nó hẹp.", more: "nối hai hệ quả của CÙNG một lý do — hợp cả viết lẫn Part 3" },
          { w: "first and foremost", pos: "phr", ipa: "/ˌfɜːst ən ˈfɔːməʊst/", vi: "trước hết và trên hết", ex: "A university is first and foremost a place of learning.", exVi: "Đại học trước hết là nơi để học.", more: "nhấn BẢN CHẤT, không dùng để đếm ý thứ nhất (đừng thay Firstly)" },
        ],
      },
      {
        t: "note",
        title: "📌 Ghi sổ lỗi sau bài này",
        items: [
          "Mỗi câu sai, ghi một trong ba nhãn: **vị trí** (gán nhầm người) · **loại thông tin** (đúng đoạn chủ đề, sai loại) · **NB** (ngại dùng lại chữ cái).",
          "Ngày mai làm **Đề 10**: phần Reading (làm ở Online Test) cũng có dạng nối. Mang theo quy trình mục 2.",
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI 3 — NÓI ═══════════════════════════ */
  {
    id: "t5d15-noi",
    kind: "speaking",
    title: "Nói: Register & tone khi nói — phản biện lịch sự và thương lượng trong công việc (E10 phần 1)",
    goal: "Phản đối một ý kiến (của giám khảo ở Part 3, của sếp hay đồng nghiệp trong cuộc họp) mà không nghe cộc cũng không nghe yếu: chọn đúng nấc trên thang năm nấc phản đối, làm mềm bằng hedge và ngữ điệu xuống–lên, rồi đi trọn năm bước của một cuộc thương lượng ngắn — công nhận, nêu ràng buộc, đề xuất có điều kiện, kiểm tra, chốt.",
    minutes: 85,
    blocks: [
      {
        t: "recap",
        items: [
          "Bài 1 dạy register và tone trên giấy. Bài này mang chúng vào ==lời nói==: Part 3 (khi giám khảo đẩy ngược ý bạn) và công việc thật (thương lượng hạn giao, từ chối khéo).",
          "Đẩy **Fluency & Coherence** và **Lexical Resource** của Speaking lên band 8: band 8 phát triển ý ==mạch lạc và phù hợp==, dùng ngôn ngữ linh hoạt để nói chính xác — kể cả khi không đồng ý.",
          "**Thang năm nấc phản đối**: đồng ý một phần → nghi ngờ nhẹ → phản bác có lý do → kiên quyết lịch sự → (cộc — tránh). Band 8 đi lại được giữa nấc 1 và nấc 4.",
          "**Năm bước thương lượng** (mã E10): công nhận nhu cầu bên kia → nêu ràng buộc bằng sự kiện → đề xuất có điều kiện (If you could…, I'd be able to…) → kiểm tra → chốt và ghi lại.",
          "🔊 Ngữ điệu **xuống–lên** (fall-rise) trên từ cuối cụm là thứ làm câu phản đối nghe lịch sự; nói ngang hoặc xuống hẳn thì cùng câu ấy nghe gắt.",
          "Nối lại: Tập 2 Ngày 17 (đồng ý / phản đối trong họp), Tập 4 Ngày 22 (hỏi – đáp sau thuyết trình), Tập 5 Ngày 6 (nhượng bộ, hedging Part 3), Ngày 10 (bất đồng trong nhóm). Ngày 18 học tiếp phần 2: thương lượng nhiều vòng.",
        ],
      },

      { t: "h", text: "1. Vì sao người Việt hay lệch tone khi phản đối bằng tiếng Anh" },
      {
        t: "table",
        head: ["Lệch", "Nghe thế nào với người bản ngữ", "Gốc rễ", "Sửa"],
        rows: [
          ["~~I don't agree. / You are wrong.~~", "cộc, gần như gây sự", "dịch thẳng “tôi không đồng ý”; tiếng Việt làm mềm bằng “ạ, dạ, em nghĩ là”, tiếng Anh làm mềm bằng NGỮ PHÁP", "I'm not sure I'd agree. / I see it slightly differently."],
          ["~~Yes, yes, I agree~~ (rồi nói ý ngược lại)", "khó hiểu: đồng ý hay không?", "ngại nói “không” với người trên", "I take your point, but… (công nhận RỒI mới rẽ)"],
          ["~~Maybe… I think maybe… it depends…~~", "không có lập trường", "sợ sai nên né", "It depends on X: if…, then…; if not, … (tách trường hợp, vẫn có ý)"],
          ["nói phản đối bằng giọng ngang, đều", "lạnh, khó chịu dù từ ngữ lịch sự", "tiếng Việt có thanh điệu cố định, không dùng cao độ để tỏ thái độ", "luyện xuống–lên ở mục 4"],
        ],
      },
      {
        t: "note",
        title: "📌 Lịch sự trong tiếng Anh nằm ở đâu",
        items: [
          "Không nằm ở chữ please. Nằm ở ==khoảng cách ngữ pháp==: thì lùi (I was wondering), điều kiện (would, could), phủ định mềm (I'm not sure, not quite), và từ đệm (to be honest, I'm afraid).",
          "Và nằm ở ==thứ tự==: công nhận trước, phản đối sau. Người nghe cần nghe thấy bạn đã hiểu họ.",
          "Trong IELTS, giám khảo KHÔNG chấm quan điểm. Họ đẩy ngược ý bạn (“But some people would say…”) để xem bạn có ngôn ngữ bảo vệ ý mình không. Im lặng đồng ý là bỏ lỡ cơ hội lấy điểm.",
        ],
      },

      { t: "h", text: "2. Thang năm nấc phản đối" },
      {
        t: "table",
        head: ["Nấc", "Khi nào", "Khung câu", "Tone"],
        rows: [
          ["① Đồng ý một phần", "ý kia đúng trong vài trường hợp", "That's true up to a point, but… · I'd go along with that to some extent. · There's something in that, though…", "mềm nhất"],
          ["② Nghi ngờ nhẹ", "chưa chắc, muốn thêm điều kiện", "I'm not sure it's quite that simple. · I wonder whether that's always the case. · I'd be a bit wary of saying that.", "mềm"],
          ["③ Phản bác có lý do", "bạn có lập luận ngược", "I see it rather differently. · I'd actually argue the opposite: … · The way I see it, …", "trung tính, rõ"],
          ["④ Kiên quyết, lịch sự", "điểm cốt lõi, không lùi được", "I'm afraid I really can't agree with that. · With respect, I think that misses the point. · I'd have to disagree there.", "chắc, vẫn tôn trọng"],
          ["⑤ Cộc", "— (tránh)", "~~No, that's wrong. · That's ridiculous. · You don't understand.~~", "gây sự"],
        ],
      },
      {
        t: "patterns",
        rows: [
          {
            formula: "I take your point, but + S + V",
            vi: "Công nhận rồi rẽ — dùng được ở mọi nấc.",
            examples: [
              { en: "I take your point, but I think cost is only part of the story.", vi: "Tôi hiểu ý anh, nhưng tôi nghĩ chi phí chỉ là một phần của câu chuyện." },
            ],
          },
          {
            formula: "I'm not sure (that) + S + V / I'm not sure I'd + V",
            vi: "Phủ định mềm — nấc ②.",
            examples: [
              { en: "I'm not sure I'd put it as strongly as that.", vi: "Tôi không chắc mình sẽ nói mạnh tới mức đó." },
              { en: "I'm not sure that's true of everyone.", vi: "Tôi không chắc điều đó đúng với mọi người." },
            ],
          },
          {
            formula: "It's not so much + N / that + S + V + as + N / that + S + V",
            vi: "Sửa lại trọng tâm thay vì bác thẳng — rất band 8.",
            examples: [
              { en: "It's not so much that people are lazy as that they're short of time.", vi: "Không hẳn là người ta lười, mà là họ thiếu thời gian." },
              { en: "It's not so much a question of money as of priorities.", vi: "Đây không hẳn là chuyện tiền, mà là chuyện ưu tiên." },
            ],
          },
          {
            formula: "If anything, + S + V",
            vi: "Lật ngược nhẹ nhàng: “có chăng thì là…”.",
            examples: [
              { en: "If anything, young people are more polite online than their parents are.", vi: "Có chăng thì người trẻ còn lịch sự trên mạng hơn cha mẹ họ." },
            ],
          },
        ],
      },
      {
        t: "note",
        title: "⚠️ Cẩn thận — bốn cụm hay dùng sai",
        items: [
          "**With respect, …** chỉ dùng khi bạn sắp nói điều khá mạnh (nấc ④). Dùng trước một ý nhỏ nghe mỉa.",
          "**To be honest** đặt trước ý ==khó nghe==, không đặt trước mọi câu. Nói ba lần trong một phút thành tật.",
          "**Actually** mở câu là báo hiệu sắp sửa lại người kia — đúng ở nấc ③; dùng bừa thì nghe như cãi.",
          "**I'm afraid** = “tôi e là”, không phải “tôi sợ”. Đặt trước tin xấu hoặc lời từ chối: I'm afraid I can't agree.",
        ],
      },
      { t: "rule", formula: "công nhận (I take your point / That's true up to a point)  +  but / though  +  ý của bạn  +  lý do", vi: "Chọn nấc theo mức bạn chắc và theo người nghe. Part 3: nấc ①–③ là đủ; nấc ④ chỉ khi giám khảo đẩy lần thứ hai." },
      {
        t: "quiz",
        id: "t5d15-noi-nac",
        kind: "fill",
        title: "Điền MỘT từ để hoàn thành khung phản đối (8 câu)",
        items: [
          { q: "1. That's true up to a ___, but it ignores smaller towns.", answers: ["point"], hint: "up to a point" },
          { q: "2. I take your ___, but I think the real issue is trust.", answers: ["point"], hint: "I take your point" },
          { q: "3. I'm not ___ it's quite that simple.", answers: ["sure", "convinced", "certain"], hint: "I'm not sure" },
          { q: "4. I'd go ___ with that to some extent.", answers: ["along"], hint: "go along with = đồng tình" },
          { q: "5. It's not so ___ a question of money as of priorities.", answers: ["much"], hint: "not so much A as B" },
          { q: "6. If ___, people read more now than they used to.", answers: ["anything"], hint: "If anything," },
          { q: "7. I'm ___ I really can't agree with that.", answers: ["afraid"], hint: "I'm afraid" },
          { q: "8. I see it ___ differently. (trạng từ làm mềm)", answers: ["rather", "slightly", "somewhat", "quite", "a little"], hint: "rather / slightly differently" },
        ],
      },

      { t: "h", text: "3. Part 3 — khi giám khảo đẩy ngược: band 7 và band 8 đặt cạnh nhau" },
      {
        t: "p",
        text: "Câu hỏi: **“Some people say that at work it's always better to be direct than to be polite. What do you think?”** Sau câu trả lời, giám khảo đẩy: **“But doesn't being polite just waste everybody's time?”**",
      },
      {
        t: "dialogue",
        title: "Band 7 (ước tính) — đúng, rõ, nhưng một giọng",
        lines: [
          { who: "Examiner", role: "examiner", text: "Some people say that at work it's always better to be direct than to be polite. What do you think?" },
          { who: "Candidate", role: "candidate", text: "I don't agree with that. I think politeness is very important at work because it makes people feel respected. If a manager is too direct, employees may feel upset, and then they will not work well. However, sometimes people need to be direct, for example when there is a serious mistake. So I think both of them are important.", vi: "Tôi không đồng ý. Tôi nghĩ lịch sự rất quan trọng ở chỗ làm vì nó khiến người ta thấy được tôn trọng…" },
          { who: "Examiner", role: "examiner", text: "But doesn't being polite just waste everybody's time?" },
          { who: "Candidate", role: "candidate", text: "No, I don't think so. Being polite only takes a few seconds, and it is good for the relationship. So it is not a waste of time.", vi: "Không, tôi không nghĩ vậy. Lịch sự chỉ mất vài giây và tốt cho quan hệ…" },
        ],
      },
      {
        t: "dialogue",
        title: "Band 8 (ước tính) — đi lại giữa các nấc, sửa trọng tâm câu hỏi",
        lines: [
          { who: "Examiner", role: "examiner", text: "Some people say that at work it's always better to be direct than to be polite. What do you think?" },
          { who: "Candidate", role: "candidate", text: "I'm not sure I'd go quite that far. Directness is great when the stakes are high — if there's a bug in production, nobody wants a five-minute preamble. But most of the time, I'd say the two aren't really opposites. You can be perfectly clear about what's wrong and still be decent about how you say it. Where I do think people go wrong is in confusing politeness with vagueness — you know, hinting at a problem instead of naming it. So, if anything, I'd put it the other way round: be direct about the issue, and polite about the person.", vi: "Tôi không chắc mình sẽ nói tới mức đó. Thẳng thắn rất tốt khi việc hệ trọng — nếu có lỗi trên hệ thống thật thì chẳng ai muốn nghe rào đón năm phút. Nhưng phần lớn thời gian, tôi cho rằng hai thứ ấy không hẳn đối lập…" },
          { who: "Examiner", role: "examiner", text: "But doesn't being polite just waste everybody's time?" },
          { who: "Candidate", role: "candidate", text: "Well, I take the point that it can — a meeting where everyone's too polite to disagree is an hour nobody gets back. That said, I'd argue rudeness costs more in the long run, because people simply stop telling you things. And a team where nobody tells the boss bad news is, well, a much bigger waste of time.", vi: "Vâng, tôi công nhận là có thể — một cuộc họp mà ai cũng lịch sự tới mức không dám phản đối là mất trắng một giờ. Nói vậy chứ, tôi cho rằng về lâu dài sự thô lỗ còn tốn hơn, vì người ta thôi không nói gì với bạn nữa…" },
        ],
      },
      {
        t: "table",
        caption: "Khác nhau ở đâu — theo 4 tiêu chí",
        head: ["Tiêu chí", "Band 7", "Band 8"],
        rows: [
          ["Fluency & Coherence", "ý xếp theo khuôn bài luận (because… However… So…); câu trả lời thứ hai chỉ lặp lại lập trường", "phát triển theo mạch nghĩ: giới hạn câu hỏi → trường hợp đúng → sửa trọng tâm → chốt; khi bị đẩy thì ==công nhận rồi mới giữ ý=="],
          ["Lexical Resource", "very important · feel upset · serious mistake — đúng nhưng chung", "the stakes are high · preamble · vagueness · hinting at… instead of naming it · in the long run — chính xác, tự nhiên"],
          ["Grammar", "câu phức cơ bản, không viết tắt (it is, will not) ⇒ nghe như đọc", "Where I do think people go wrong is in… (cleft + do nhấn) · If anything · câu điều kiện ngầm; viết tắt tự nhiên"],
          ["Pronunciation (dự đoán)", "giọng đều, nhấn mọi từ", "nhấn tương phản: direct about the ISSUE, polite about the PERSON; xuống–lên ở I take the point that it CAN"],
          ["Register / tone", "“I don't agree with that.” — nấc ⑤ gần cộc; rồi giọng bài luận", "nấc ② (not sure I'd go quite that far) → ③ (I'd argue) — neutral nhích lên một nấc, đúng Part 3"],
        ],
      },
      {
        t: "note",
        title: "💡 Mẹo — ba nước đi khi bị đẩy ngược",
        items: [
          "**Công nhận phần đúng** (I take the point that it can…) — cho thấy bạn nghe hiểu, và mua cho bạn hai giây nghĩ.",
          "**Đổi thang thời gian hoặc phạm vi** (in the long run · for most people · in a small team) — cách dễ nhất để giữ ý mà không lặp.",
          "**Chốt bằng một câu ngắn có hình ảnh** (people simply stop telling you things). Đừng chốt bằng “So that's my opinion.”",
        ],
      },

      { t: "h", text: "4. 🔊 Ngữ điệu xuống–lên — làm mềm lời phản đối" },
      {
        t: "p",
        text: "Trong tiếng Anh, giọng **xuống rồi lên** ở từ mang trọng âm cuối cụm báo cho người nghe: “tôi chưa nói hết, còn một chữ **nhưng**”. Nó biến That's true (đồng ý hẳn) thành That's ↘↗true… (đúng, nhưng). Nói câu phản đối bằng giọng **xuống hẳn** thì thành lời tuyên bố; người nghe cảm thấy bị chặn.",
      },
      {
        t: "phatam",
        id: "t5d15-phat-am",
        title: "Luyện phát âm — xuống–lên (fall-rise) trên từ in HOA: nghe lịch sự mà vẫn rõ ý",
        note: "Từ in HOA trong phần dịch: hạ giọng xuống rồi vuốt nhẹ lên ở chính âm tiết nhấn. Nửa sau câu (ý của bạn) kết thúc bằng giọng XUỐNG — chắc, không hỏi. Thu âm, nghe lại: nếu cả câu đi ngang thì bạn đang nghe như máy đọc.",
        items: [
          { text: "I see what you mean, but I'm not sure it's that simple.", ipa: "aɪ siː wɒt ju miːn bʌt aɪm nɒt ʃɔː ɪts ðæt sɪmpl", vi: "Tôi hiểu ý anh, nhưng tôi không chắc nó đơn giản vậy. (I see what you ↘↗MEAN | …that ↘SIMple)" },
          { text: "That's true up to a point.", ipa: "ðæts truː ʌp tu ə pɔɪnt", vi: "Điều đó đúng ở một mức nào đó. (up to a ↘↗POINT — người nghe chờ chữ but)" },
          { text: "I wouldn't go quite that far.", ipa: "aɪ wʊdnt ɡəʊ kwaɪt ðæt fɑː", vi: "Tôi sẽ không nói tới mức đó. (quite ↘↗THAT far)" },
          { text: "I take your point, though I'd put it differently.", ipa: "aɪ teɪk jɔː pɔɪnt ðəʊ aɪd pʊt ɪt dɪfrəntli", vi: "Tôi hiểu ý chị, dù tôi sẽ diễn đạt khác. (your ↘↗POINT | ↘DIFferently)" },
          { text: "Would it help if we met in the middle?", ipa: "wʊd ɪt help ɪf wi met ɪn ðə mɪdl", vi: "Liệu có ổn hơn nếu mỗi bên nhường một nửa? (lên nhẹ ở MIDdle — câu hỏi thật)" },
          { text: "I'm afraid Friday isn't realistic.", ipa: "aɪm əfreɪd fraɪdeɪ ɪznt rɪəlɪstɪk", vi: "Tôi e là thứ Sáu không khả thi. (↘↗FRIday | isn't rea↘LIStic)" },
          { text: "If you could give me two more days, I could finish it properly.", ipa: "ɪf ju kʊd ɡɪv mi tuː mɔː deɪz aɪ kʊd fɪnɪʃ ɪt prɒpəli", vi: "Nếu chị cho tôi thêm hai ngày, tôi có thể làm xong cho đàng hoàng. (two more ↘↗DAYS | ↘PROperly)" },
          { text: "Just to check we're on the same page.", ipa: "dʒʌst tə tʃek wɪə ɒn ðə seɪm peɪdʒ", vi: "Để chắc là mình hiểu giống nhau. (the same ↘PAGE)" },
        ],
      },

      { t: "h", text: "5. Thương lượng trong công việc — năm bước (E10)" },
      {
        t: "p",
        text: "Thương lượng không phải là thắng. Đó là tìm một phương án ==cả hai bên chấp nhận được== mà quan hệ vẫn nguyên vẹn. Với lập trình viên, tình huống hay gặp nhất: bị yêu cầu giao sớm hơn mức làm được. Nói “không” thì mất lòng; nói “vâng” thì giao hàng lỗi.",
      },
      {
        t: "sodo", kind: "flow", title: "Năm bước của một cuộc thương lượng ngắn",
        steps: [
          { label: "① Công nhận nhu cầu bên kia", sub: "I can see why that matters. · I understand the pressure you're under." },
          { label: "② Nêu ràng buộc bằng SỰ KIỆN", sub: "What worries me is… · We haven't tested… — không đổ lỗi, không nói you" },
          { label: "③ Đề xuất có điều kiện", sub: "Suppose we… · If I could…, I'd be able to… · I wonder if we could meet in the middle." },
          { label: "④ Kiểm tra bên kia", sub: "Would that work for you? · Would it help if…? · How does that sound?" },
          { label: "⑤ Chốt và ghi lại", sub: "So, just to make sure we're on the same page: … · I'll put it in writing." },
        ],
      },
      { t: "canh", anh: ["man-technologist", "woman-office-worker", "spiral-calendar"], caption: "Văn phòng một công ty phần mềm. Sarah (trưởng sản phẩm) cần tính năng xuất báo cáo kịp buổi trình diễn với khách vào thứ Sáu. Minh (lập trình viên backend) biết phần này chưa kiểm thử xong." },
      {
        t: "dialogue",
        title: "Hội thoại mẫu — “Can we meet in the middle?”",
        lines: [
          { who: "Sarah", role: "a", text: "Minh, have you got a minute? It's about the export feature. The client demo's been moved up to Friday, and I'd really like them to see it.", vi: "Minh, em có rảnh một phút không? Chuyện tính năng xuất báo cáo. Buổi demo với khách bị dời lên thứ Sáu, và chị rất muốn họ được thấy nó." },
          { who: "Minh", role: "b", text: "Sure. I can see why that matters — it's the thing they asked for first. Can I be upfront about where we are, though?", vi: "Vâng. Em hiểu vì sao nó quan trọng — đó là thứ họ yêu cầu đầu tiên. Nhưng em nói thẳng tình hình hiện tại được không ạ?" },
          { who: "Sarah", role: "a", text: "Please.", vi: "Em cứ nói." },
          { who: "Minh", role: "b", text: "The export itself works. What worries me is the large reports. We haven't tested anything over fifty pages, and I'd rather not find out in front of the client.", vi: "Phần xuất thì chạy rồi. Cái em lo là các báo cáo lớn. Mình chưa thử cái nào trên năm mươi trang, và em không muốn phát hiện lỗi ngay trước mặt khách." },
          { who: "Sarah", role: "a", text: "I take your point, but moving the demo isn't really an option. Is there no way of getting it done by Friday?", vi: "Chị hiểu ý em, nhưng dời buổi demo thì không được. Không có cách nào xong trước thứ Sáu à?" },
          { who: "Minh", role: "b", text: "Not the whole thing, to be honest — not to a standard I'd be comfortable with. But I wonder if we could meet in the middle. Suppose we switched it on for the demo account only, with a limit of twenty pages. That I could have ready by Thursday evening.", vi: "Thật lòng là không phải toàn bộ — không tới mức em thấy yên tâm. Nhưng em nghĩ mình có thể mỗi bên nhường một chút. Giả sử mình chỉ bật nó cho tài khoản demo, giới hạn hai mươi trang. Cái đó em làm xong được trước tối thứ Năm." },
          { who: "Sarah", role: "a", text: "Hmm. And the full version?", vi: "Ừm. Thế còn bản đầy đủ?" },
          { who: "Minh", role: "b", text: "If I could borrow someone from QA for half a day, I'd be able to release it to everyone by the following Wednesday.", vi: "Nếu em mượn được một bạn bên kiểm thử nửa ngày, em có thể phát hành cho mọi người trước thứ Tư tuần sau." },
          { who: "Sarah", role: "a", text: "Half a day I can probably manage. I'm not so sure about Wednesday, though — the sales team have been promising the end of this week.", vi: "Nửa ngày thì chắc chị xoay được. Nhưng thứ Tư thì chị chưa chắc — bên bán hàng đang hứa với khách là cuối tuần này." },
          { who: "Minh", role: "b", text: "I understand that puts you in an awkward position. Would it help if I wrote two lines they could send to customers, explaining what's coming and when?", vi: "Em hiểu như vậy làm chị khó xử. Liệu có đỡ hơn không nếu em viết hai dòng để họ gửi khách, giải thích sắp có gì và khi nào?" },
          { who: "Sarah", role: "a", text: "Actually, yes, it would. All right. So, just to make sure we're on the same page: limited version for the demo by Thursday evening, I find you a tester, full release next Wednesday.", vi: "Thật ra là có đấy. Được rồi. Vậy để chắc là mình hiểu giống nhau: bản giới hạn cho buổi demo trước tối thứ Năm, chị tìm cho em một bạn kiểm thử, phát hành đầy đủ thứ Tư tuần sau." },
          { who: "Minh", role: "b", text: "That's right. I'll put it in writing this afternoon so nobody has to remember it.", vi: "Đúng ạ. Chiều nay em sẽ viết lại thành văn bản để không ai phải nhớ." },
          { who: "Sarah", role: "a", text: "Perfect. Thanks for not just saying no.", vi: "Tuyệt. Cảm ơn em vì đã không chỉ nói “không”." },
        ],
      },
      {
        t: "table",
        caption: "Mổ hội thoại — câu nào làm bước nào",
        head: ["Bước", "Câu của Minh", "Vì sao hiệu quả"],
        rows: [
          ["① Công nhận", "I can see why that matters — it's the thing they asked for first.", "nói lại được LÝ DO của bên kia ⇒ Sarah biết mình được nghe"],
          ["xin phép nói thẳng", "Can I be upfront about where we are, though?", "xin phép trước khi nói điều khó nghe; though ở cuối câu là kiểu nói, không phải kiểu viết"],
          ["② Ràng buộc", "What worries me is the large reports. We haven't tested anything over fifty pages.", "cleft What worries me is… + sự kiện đo được; chủ ngữ là we, không phải you"],
          ["từ chối mềm", "Not the whole thing, to be honest — not to a standard I'd be comfortable with.", "từ chối MỘT PHẦN, kèm tiêu chuẩn chứ không kèm cảm xúc"],
          ["③ Đề xuất có điều kiện", "Suppose we switched it on… · If I could borrow someone…, I'd be able to…", "quá khứ giả định (switched, could) = khoảng cách lịch sự; mỗi đề xuất kèm một mốc cụ thể"],
          ["④ Kiểm tra / thêm giá trị", "Would it help if I wrote two lines they could send to customers?", "giải quyết nỗi lo THẬT của Sarah (lời hứa của bên bán hàng), không chỉ nỗi lo của mình"],
          ["⑤ Chốt", "I'll put it in writing this afternoon so nobody has to remember it.", "thoả thuận miệng dễ trôi; ghi lại là phép lịch sự chuyên nghiệp"],
        ],
      },
      {
        t: "patterns",
        rows: [
          {
            formula: "If + S + could + V, + S + would be able to + V",
            vi: "Đề xuất có điều kiện — đổi một thứ lấy một thứ.",
            examples: [
              { en: "If you could push the deadline to Monday, I'd be able to include the test results.", vi: "Nếu anh lùi hạn sang thứ Hai, tôi có thể đưa cả kết quả kiểm thử vào." },
            ],
          },
          {
            formula: "Suppose / What if + S + V-ed (quá khứ)…?",
            vi: "Thả một phương án để thăm dò, chưa cam kết.",
            examples: [
              { en: "What if we released it to ten per cent of users first?", vi: "Hay là mình phát hành cho mười phần trăm người dùng trước?" },
            ],
          },
          {
            formula: "Would it help if + S + V-ed…?",
            vi: "Đề nghị một nhượng bộ nhỏ.",
            examples: [
              { en: "Would it help if I joined the call to answer technical questions?", vi: "Liệu có đỡ hơn không nếu tôi tham gia cuộc gọi để trả lời câu hỏi kỹ thuật?" },
            ],
          },
          {
            formula: "I'd rather + not + V / I'd rather + S + V-ed",
            vi: "Nêu điều mình muốn tránh mà không ra lệnh.",
            examples: [
              { en: "I'd rather we didn't promise a date until the tests are done.", vi: "Tôi mong mình đừng hứa ngày nào cho tới khi kiểm thử xong." },
            ],
          },
        ],
      },
      { t: "rule", formula: "công nhận → What worries me is + sự kiện → If you could…, I'd be able to… → Would that work for you? → I'll put it in writing", vi: "Từ chối một PHẦN và luôn kèm một phương án. “Không” trần trụi là hết đường thương lượng." },
      {
        t: "mcq",
        id: "t5d15-noi-chon",
        title: "Chọn câu đáp hợp nhất (6 câu)",
        items: [
          { q: "1. Trưởng nhóm: “I need this report by tomorrow morning.” Bạn cần tới chiều mai.", options: ["Impossible. Tomorrow afternoon.", "I can see it's urgent. If I could have until three, I'd be able to check the figures properly.", "Yes, of course."], correct: 1, why: "A cộc, không lý do. C đồng ý điều mình không làm được ⇒ sẽ trễ và mất uy tín. B: công nhận + đề xuất có điều kiện + lợi ích cho bên kia (số liệu được kiểm)." },
          { q: "2. Giám khảo: “Don't you think children today are simply spoilt?” Bạn đồng ý một phần.", options: ["Yes.", "No, you're wrong about that.", "There's something in that, though I'd say it's less about the children than about how little time parents have."], correct: 2, why: "A bỏ lỡ cơ hội phát triển. B cộc và công kích người hỏi. C: nấc ① + sửa trọng tâm (less about… than about…)." },
          { q: "3. Đồng nghiệp đề xuất viết lại toàn bộ module. Bạn thấy rủi ro.", options: ["That's a terrible idea.", "I'd be a bit wary of rewriting all of it at once. What if we started with the login part?", "Whatever you want."], correct: 1, why: "B: nghi ngờ nhẹ (nấc ②) + phương án thay thế bằng What if + quá khứ." },
          { q: "4. Khách hàng muốn giảm giá 30%. Công ty chỉ cho phép 10%.", options: ["I'm afraid thirty per cent is beyond what I can offer. What I could do is ten per cent, plus free support for the first three months.", "No discount.", "OK, thirty per cent, but don't tell my boss."], correct: 0, why: "I'm afraid + giới hạn nêu như sự kiện (beyond what I can offer) + What I could do is… (cleft) + thêm giá trị khác ngoài giá." },
          { q: "5. Sau khi thống nhất, câu nào chốt tốt nhất?", options: ["OK, bye.", "So, just to confirm: you'll send the data by Tuesday, and I'll have the draft ready by Friday. I'll email that round now.", "I hope you will remember what we said."], correct: 1, why: "Nhắc lại ai làm gì, khi nào + ghi lại. C nghe như nghi ngờ người kia." },
          { q: "6. Giám khảo đẩy lần hai: “But surely money matters more than job satisfaction?” Bạn vẫn giữ ý.", options: ["I already answered that.", "For some people it clearly does, and I wouldn't argue with them. I'd still say that, past a certain income, it stops making much difference.", "Maybe you are right. I don't know."], correct: 1, why: "A cộc. C buông ý. B: công nhận phạm vi đúng (for some people) rồi giữ ý với điều kiện (past a certain income) — nấc ③, tone chắc mà nhã." },
        ],
      },

      { t: "h", text: "6. Luyện nói — ghi âm" },
      {
        t: "note",
        title: "📌 Cách luyện",
        items: [
          "**Part 1**: trả lời 2–3 câu mỗi câu hỏi, giọng trò chuyện, có viết tắt. Không moreover, không furthermore.",
          "**Part 3**: mỗi câu 40–60 giây. Trong mỗi câu trả lời dùng ==ít nhất một khung của mục 2== và một hedge. Câu số 5 là câu “bị đẩy ngược” — bắt buộc công nhận trước khi giữ ý.",
          "**Đóng vai**: nói cả hai vai nếu luyện một mình, hoặc chỉ nói vai của bạn và để khoảng lặng cho vai kia.",
          "Nghe lại bản ghi và đếm: bao nhiêu lần **I think**? Bao nhiêu lần câu phản đối đi giọng ngang? Hai con số đó là việc cần sửa của tuần này.",
        ],
      },
      {
        t: "speak",
        id: "t5d15-noi-part1",
        part: "1",
        questions: [
          "Let's talk about asking for help. Do you find it easy to ask other people for help?",
          "Who do you usually turn to when you have a problem with your studies or work?",
          "Have you ever had to say no to someone who asked you for a favour?",
          "Now let's talk about text messages. Do you prefer sending messages or making phone calls?",
          "Do you write differently when you message a friend and when you message a teacher or a manager?",
          "Have you ever misunderstood the tone of a message someone sent you?",
        ],
      },
      {
        t: "speak",
        id: "t5d15-noi-part3",
        part: "3",
        questions: [
          "In your country, is it generally acceptable to disagree openly with someone older or more senior than you?",
          "Do you think people are becoming more direct in the way they speak to each other? Why might that be?",
          "Some companies train their staff in negotiation. Is that a good use of time and money?",
          "Is it harder to be polite in writing, for example in emails and messages, than face to face?",
          "Some people would say that politeness is just a form of dishonesty. How would you respond to that?",
        ],
      },
      {
        t: "speak",
        id: "t5d15-noi-dong-vai",
        part: "3",
        questions: [
          "ROLE-PLAY 1 (about 1 minute). Your project supervisor wants your team to add a new feature one week before the final presentation. You think there is not enough time to test it. Respond: acknowledge, state the constraint as a fact, make a conditional offer, check, and confirm.",
          "ROLE-PLAY 2 (about 1 minute). A classmate proposes that your group should present without slides ‘to be different’. You partly agree. Say what you agree with, say what worries you, and suggest a middle way.",
          "ROLE-PLAY 3 (about 1 minute). A client asks you to lower your price by a quarter. You cannot, but you can offer something else. Decline politely and make your counter-offer.",
        ],
      },
      {
        t: "table",
        caption: "Tự chấm sau khi nghe lại",
        head: ["Kiểm", "Có / Chưa", "Nếu chưa"],
        rows: [
          ["Part 1 nghe như trò chuyện (viết tắt, câu ngắn, không từ nối viết)", "", "Bài 1 mục 5"],
          ["Mỗi câu Part 3 có ít nhất một lần công nhận trước khi phản đối", "", "mục 2 — nấc ①"],
          ["Không có câu nào ở nấc ⑤ (I don't agree. / You're wrong.)", "", "mục 1 — bảng lệch tone"],
          ["Đóng vai đủ năm bước, có một câu If… could…, …would…", "", "mục 5"],
          ["Câu phản đối có giọng xuống–lên, không đi ngang", "", "mục 4"],
        ],
      },
      {
        t: "note",
        title: "📌 Ngày 18 học tiếp gì",
        items: [
          "Hôm nay là **phần 1** của mã E10: một vòng thương lượng, hai người, một vấn đề. Ngày 18 nâng lên **nhiều vòng** — khi bên kia từ chối đề xuất đầu tiên, khi có bên thứ ba, và hedging tinh hơn trong giao tiếp.",
          "Mang sang Ngày 16: tone đo được của Bài 1 mục 4 chính là thứ bài **advantages / disadvantages band 8** cần khi cân hai phía.",
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI TẬP ═══════════════════════════ */
  {
    id: "t5d15-bai-tap",
    kind: "homework",
    title: "Bài tập Ngày 15 — register, tone, matching features, bẫy nghe band 8, thương lượng (38 câu)",
    goal: "Củng cố cả ba bài trong 60 phút: đổi register bằng bảy công tắc, chỉnh tone, làm một bài matching features mới, nghe một tin nhắn thoại đầy con số bị đổi và phủ định kép, và hoàn thành các khung câu thương lượng — đúng ít nhất 30 / 38.",
    minutes: 60,
    blocks: [
      {
        t: "recap", title: "Bài tập hôm nay gồm gì",
        items: [
          "**I–III** ôn Bài 1: công tắc register (8 câu), chọn tone (6 câu), dịch (4 câu).",
          "**IV** ôn Bài 2: một bài đọc ngắn MỚI, 6 câu matching features (luật NB).",
          "**V** chuẩn bị cho Ngày 16: một tin nhắn thoại giọng Úc, tốc độ thật — ==con số bị đổi, phủ định kép== (8 câu). Bài Nghe ngày mai dạy trọn hai bẫy này.",
          "**VI** ôn Bài 3: khung câu phản đối và thương lượng (6 câu).",
          "Đích: ≥ 30 / 38. Phần nào dưới 70% thì ôn lại đúng mục ghi ở tiêu đề phần đó.",
        ],
      },
      {
        t: "sodo", kind: "mindmap", title: "Ngày 15 trong một hình", center: "Register & tone",
        branches: [
          { label: "Viết", items: ["7 công tắc", "không trang trọng giả", "độ chắc ≤ bằng chứng"] },
          { label: "Nói", items: ["Part 1: trò chuyện", "Part 3: nhích một nấc", "từ nối nói"] },
          { label: "Đọc", items: ["bản đồ đoạn 2 cột", "ý của ai?", "luật NB"] },
          { label: "Công việc", items: ["thang 5 nấc phản đối", "5 bước thương lượng", "If you could…, I'd…"] },
        ],
      },

      { t: "h", text: "I. Công tắc register — gõ phần còn thiếu (8 câu) — ôn Bài 1 mục 2 · 6" },
      {
        t: "quiz",
        id: "t5d15-bt-cong-tac",
        kind: "fill",
        title: "Đổi sang mức Task 2 — mỗi chỗ trống MỘT từ (trừ khi ghi khác)",
        items: [
          { q: "1. Lots of people can't afford it. → ___ people cannot afford it.", answers: ["Many"], hint: "Many" },
          { q: "2. They found out that sales had fallen. → They ___ that sales had fallen.", answers: ["discovered", "found", "established", "learned", "learnt"], hint: "discovered" },
          { q: "3. People say the tax is unfair. → It is often ___ that the tax is unfair.", answers: ["said", "argued", "claimed", "suggested"], hint: "It is often said / argued that" },
          { q: "4. The government should get rid of the fee. → The government should ___ the fee.", answers: ["abolish", "remove", "scrap", "eliminate"], hint: "abolish / remove" },
          { q: "5. Because more people are living in cities, … → The ___ of urban populations means that…", answers: ["growth", "expansion", "rise"], hint: "danh hoá: the growth of" },
          { q: "6. But this is expensive. → ___, this is expensive.", answers: ["However", "Nevertheless", "Nonetheless"], hint: "However," },
          { q: "7. We need to do more research. → There is a need for ___ research.", answers: ["further", "more", "additional"], hint: "further research" },
          { q: "8. Old people can't put up with the noise. → Elderly residents cannot ___ the noise.", answers: ["tolerate", "bear", "endure"], hint: "tolerate" },
        ],
      },

      { t: "h", text: "II. Tone và register — chọn câu hợp nhất (6 câu) — ôn Bài 1 mục 3 · 4 · 5" },
      {
        t: "mcq",
        id: "t5d15-bt-tone",
        title: "Chọn A, B hoặc C",
        items: [
          { q: "1. (Task 2, thân bài) Nguyên nhân của béo phì ở trẻ em:", options: ["Fast food is undoubtedly the only cause of childhood obesity.", "A diet high in processed food is likely to be one of the main contributors to childhood obesity.", "Maybe fast food could possibly be a bit of a reason, perhaps."], correct: 1, why: "A: booster + the only — võ đoán. C: bốn hedge. B: is likely to be + one of the main — độ chắc vừa với bằng chứng." },
          { q: "2. (Task 1) Mô tả một cột tăng gấp đôi:", options: ["Amazingly, sales doubled, which is fantastic news.", "Sales doubled over the period.", "Sales kind of doubled."], correct: 1, why: "Task 1 khách quan: không từ cảm xúc (amazingly, fantastic), không ngôn ngữ mơ hồ (kind of)." },
          { q: "3. (Speaking Part 1) “Do you cook?”", options: ["Not really, to be honest. I can do pasta and that's about it.", "I seldom engage in culinary activities.", "Cooking is an activity in which I do not frequently participate."], correct: 0, why: "Câu cụt Not really + to be honest + that's about it — đúng register Part 1." },
          { q: "4. (Task 2) Câu nào là “trang trọng giả”?", options: ["Several factors account for this trend.", "In this day and age, a myriad of factors give rise to this phenomenon.", "This trend has a number of causes."], correct: 1, why: "In this day and age + a myriad of + this phenomenon: ba cụm vạn năng trong một câu, không thêm thông tin." },
          { q: "5. (Email cho giảng viên) Xin gia hạn:", options: ["I want more time for the assignment.", "I was wondering if I could have an extension of two days for the assignment.", "Give me an extension please."], correct: 1, why: "I was wondering if I could… — thì lùi + could = khoảng cách lịch sự. A và C là đòi hỏi." },
          { q: "6. (Kết bài Task 2) Câu chốt:", options: ["In conclusion, I firmly believe that the benefits of the scheme outweigh its costs.", "In conclusion, it might perhaps be said that there may be more benefits.", "To sum up, the scheme is totally awesome."], correct: 0, why: "Lập trường ở kết bài không hedge (Bài 1 mục 4). C lệch register." },
        ],
      },

      { t: "h", text: "III. Dịch sang tiếng Anh (4 câu) — ôn Bài 1 mục 2 · 4 · 7" },
      {
        t: "quiz",
        id: "t5d15-bt-dich",
        kind: "translate",
        title: "Dịch đúng mức ghi trong ngoặc",
        grammar: "It is V3 that… · tend to · Would you mind V-ing…? · It would be unwise to…",
        items: [
          { q: "(Task 2) Người ta thường cho rằng thành phố lớn mang lại nhiều cơ hội hơn.", answers: ["It is often argued that large cities offer more opportunities.", "It is often said that large cities offer more opportunities.", "It is widely believed that large cities offer more opportunities.", "It is often argued that big cities offer more opportunities.", "It is commonly believed that large cities offer more opportunities.", "It is often claimed that large cities offer more opportunities.", "It is widely believed that big cities offer more opportunities.", "It is often said that big cities offer more opportunities."], hint: "It is often argued / said that… · offer more opportunities" },
          { q: "(Task 2) Sinh viên đi làm thêm thường ngủ ít hơn.", answers: ["Students who work part-time tend to sleep less.", "Students who have part-time jobs tend to sleep less.", "Students with part-time jobs tend to sleep less.", "Students who work part time tend to sleep less.", "Students who work part-time tend to get less sleep."], hint: "tend to sleep less" },
          { q: "(đồng nghiệp) Chị có phiền gửi lại tệp đó không?", answers: ["Would you mind sending that file again?", "Would you mind sending the file again?", "Would you mind resending that file?", "Would you mind resending the file?", "Would you mind sending me that file again?", "Would you mind sending me the file again?"], hint: "Would you mind + V-ing" },
          { q: "(Task 2) Sẽ là thiếu khôn ngoan nếu bỏ qua những rủi ro này.", answers: ["It would be unwise to ignore these risks.", "It would be unwise to overlook these risks.", "It would be unwise to disregard these risks.", "It would be unwise to ignore such risks."], hint: "It would be unwise to + V" },
        ],
      },

      { t: "h", text: "IV. Matching features — bài mới (6 câu, 8 phút) — ôn Bài 2 mục 2 · 3" },
      {
        t: "p",
        text: "Bài đọc dưới đây là **hư cấu** (ba nhân vật và bảo tàng của họ không có thật), viết để luyện dạng. Lập bản đồ: mỗi đoạn một người, và ai phản bác ai.",
      },
      {
        t: "passage",
        title: "Who Is the Label For?",
        intro: "Three museum professionals on the small card beside the exhibit (a fictional debate written for practice)",
        paras: [
          { label: "A", text: "A short card beside an exhibit seems an unlikely thing to quarrel over, yet few questions divide museum staff more sharply than what such a card should say. For Helena Voss, who has written labels for forty years, the answer is as little as possible. A label, she maintains, should give the maker, the date and the material, and then fall silent; anything more tells visitors what to feel before they have looked. She concedes that newcomers may find this forbidding, but regards a moment of puzzlement as the price of a genuine encounter." },
          { label: "B", text: "Daniel Okoro, who runs a gallery of local history, has little patience with this. Visitors, he points out, do not arrive as blank pages: without a sentence of context they simply supply their own, and it is usually mistaken. His own labels therefore tell a story, and he is unapologetic about choosing which story. What he will not do is lengthen them. Tracking studies at his gallery, he says, show that almost nobody reads beyond the third line." },
          { label: "C", text: "Mei Tanaka accepts Okoro's findings but draws a different lesson from them. If people will read only forty words, she argues, the institution should stop deciding which forty. At her museum each exhibit carries a question rather than a statement, and visitors' written answers are displayed beside it for a month. Voss has called the practice an abdication of expertise. Tanaka's reply is that expertise shows in the choice of question, and that a visitor who has had to answer one remembers the object far longer than one who has merely been told about it." },
        ],
      },
      {
        t: "p",
        text: "**Questions 1–6.** Match each statement with the correct person, **A**, **B** or **C**. **NB** You may use any letter more than once. — **A** Helena Voss · **B** Daniel Okoro · **C** Mei Tanaka",
      },
      {
        t: "quiz",
        id: "t5d15-bt-doc",
        kind: "fill",
        title: "Questions 1–6 — gõ A, B hoặc C",
        items: [
          { q: "1. Interpretation supplied in advance interferes with a visitor's own response.", answers: ["A"], hint: "Voss: “anything more tells visitors what to feel before they have looked”. supplied in advance = before they have looked." },
          { q: "2. People who are given no background information will invent an inaccurate version of it.", answers: ["B"], hint: "Okoro: “without a sentence of context they simply supply their own, and it is usually mistaken”." },
          { q: "3. Being required to take part makes an exhibit more memorable.", answers: ["C"], hint: "Tanaka: “a visitor who has had to answer one remembers the object far longer”." },
          { q: "4. Some initial confusion is an acceptable cost.", answers: ["A"], hint: "Voss: “regards a moment of puzzlement as the price of a genuine encounter”. Chữ A dùng lần hai — luật NB." },
          { q: "5. A colleague's method amounts to giving up professional responsibility.", answers: ["A"], hint: "Câu này nằm ở ĐOẠN C (đoạn của Tanaka) nhưng là lời của Voss: “Voss has called the practice an abdication of expertise.” Bẫy vị trí — Bài 2 mục 3." },
          { q: "6. Specialist knowledge reveals itself in what visitors are asked.", answers: ["C"], hint: "Tanaka: “expertise shows in the choice of question”." },
        ],
      },

      { t: "h", text: "V. Nghe — bẫy band 8: con số bị đổi, phủ định kép (8 câu) — chuẩn bị Ngày 16" },
      {
        t: "p",
        text: "Bạn gọi hỏi về thẻ thành viên ở một phòng leo núi trong nhà và nhận lại tin nhắn thoại này. Đọc câu hỏi trong **30 giây**. Nghe **một lần**. Với câu 1–6: **ONE WORD AND/OR A NUMBER**.",
      },
      {
        t: "listen",
        id: "t5d15-bt-nghe",
        title: "A voicemail from Granite Works Climbing Centre",
        dan: { so: "Day 15, Recording 1", boiCanh: "a voicemail message from a member of staff at an indoor climbing centre, returning a call about membership.", cau: [1, 8] },
        note: "Khoảng 1 phút 20 giây, ~175 từ/phút. Giọng Úc (nam). Mọi tên cơ sở, giá tiền là hư cấu.",
        lines: [
          { who: "Callum", voice: "au-nam", text: "Hi, this is Callum from Granite Works Climbing Centre, returning your call about membership. I'll run through the main points. The monthly pass used to be forty-five dollars, and you may have seen fifty-two on our old leaflet, but since the first of March it's been forty-eight, so that's the figure to go by." },
          { who: "Callum", voice: "au-nam", text: "There's a joining fee as well, thirty dollars. It's not refundable, I'm afraid, but we do waive it if you sign up together with a friend." },
          { who: "Callum", voice: "au-nam", text: "Now, you asked whether beginners have to book the induction. It's not that you can't just turn up, but I wouldn't recommend it. The Saturday sessions are rarely anything less than full. The induction lasts ninety minutes, not the sixty it still says online, and there are never more than eight people in a group." },
          { who: "Callum", voice: "au-nam", text: "We run it at ten and at two. This Saturday's two o'clock session has already gone, so it would have to be ten." },
          { who: "Callum", voice: "au-nam", text: "You don't need your own shoes. Hardly anyone brings them the first time. But nobody climbs without signing the safety form, and for that we need to see photo ID, so don't forget it." },
          { who: "Callum", voice: "au-nam", text: "One last thing. The car park isn't free any more, though it's hardly expensive: two dollars for up to three hours. If none of that puts you off, call me back on 0491 570 126. Cheers." },
        ],
      },
      {
        t: "quiz",
        id: "t5d15-bt-nghe-dien",
        kind: "fill",
        title: "Questions 1–6 — ONE WORD AND/OR A NUMBER",
        items: [
          { q: "1. Current price of the monthly pass: $ ___", answers: ["48", "forty-eight", "forty eight"], hint: "Ba con số: 45 (used to be) · 52 (old leaflet) · 48 (“since the first of March it's been forty-eight, so that's the figure to go by”). Con số đúng là con số có câu XÁC NHẬN đi sau." },
          { q: "2. The joining fee is not charged if you join with a ___", answers: ["friend"], hint: "“we do waive it if you sign up together with a friend”. waive = miễn. not refundable là chi tiết gây nhiễu." },
          { q: "3. Length of the induction: ___ minutes", answers: ["90", "ninety"], hint: "“ninety minutes, not the sixty it still says online” — số đúng nói TRƯỚC, số sai nói sau: đừng ghi con số cuối cùng nghe được." },
          { q: "4. Maximum number of people in a group: ___", answers: ["8", "eight"], hint: "“never more than eight” = tối đa tám." },
          { q: "5. Induction time available this Saturday: ___ o'clock", answers: ["10", "ten"], hint: "“two o'clock session has already gone, so it would have to be ten”. gone = hết chỗ." },
          { q: "6. Item you must bring: photo ___", answers: ["ID", "identification", "I.D."], hint: "Giày: “You don't need your own shoes”. “nobody climbs without signing… for that we need to see photo ID”." },
        ],
      },
      {
        t: "mcq",
        id: "t5d15-bt-nghe-chon",
        title: "Questions 7–8 — Choose the correct letter, A, B or C",
        items: [
          { q: "7. What does Callum say about arriving for the induction without a booking?", options: ["A It is not allowed.", "B It is possible but unwise.", "C It is what most beginners do."], correct: 1, why: "“It's not that you can't just turn up, but I wouldn't recommend it.” Phủ định kép: not that you can't = bạn CÓ THỂ ⇒ không cấm (loại A). “rarely anything less than full” = gần như luôn kín chỗ ⇒ không nên." },
          { q: "8. What does Callum say about parking?", options: ["A It costs nothing.", "B It is costly.", "C There is a small charge."], correct: 2, why: "“isn't free any more” ⇒ loại A. “hardly expensive” = hầu như không đắt ⇒ loại B. Hai đô cho ba giờ ⇒ C." },
        ],
      },
      {
        t: "table",
        caption: "Sáu cụm phủ định trong bài — nghĩa thật",
        head: ["Cụm nghe được", "Nghĩa thật", "Kiểu"],
        rows: [
          ["It's not that you can't just turn up", "bạn CÓ THỂ cứ tới", "phủ định kép"],
          ["rarely anything less than full", "gần như luôn KÍN chỗ", "gần phủ định + less than"],
          ["never more than eight", "TỐI ĐA tám", "never + so sánh"],
          ["Hardly anyone brings them", "gần như KHÔNG ai mang", "gần phủ định"],
          ["nobody climbs without signing", "AI CŨNG phải ký", "phủ định kép"],
          ["hardly expensive", "KHÔNG đắt", "gần phủ định + tính từ"],
        ],
      },

      { t: "h", text: "VI. Phản đối và thương lượng — điền MỘT từ (6 câu) — ôn Bài 3 mục 2 · 5" },
      {
        t: "quiz",
        id: "t5d15-bt-thuong-luong",
        kind: "fill",
        title: "Hoàn thành khung câu",
        items: [
          { q: "1. I can see ___ that matters to you.", answers: ["why"], hint: "I can see why that matters — bước ① công nhận." },
          { q: "2. What ___ me is that we haven't tested it yet.", answers: ["worries", "concerns", "bothers"], hint: "What worries me is… — bước ②." },
          { q: "3. If you ___ give me until Monday, I'd be able to finish the tests.", answers: ["could"], hint: "If you could…, I'd be able to…" },
          { q: "4. I wonder if we could meet in the ___.", answers: ["middle"], hint: "meet in the middle = mỗi bên nhường một nửa." },
          { q: "5. ___ it help if I joined the call?", answers: ["Would"], hint: "Would it help if + quá khứ" },
          { q: "6. Just to make sure we're on the same ___: you send the data, I write the draft.", answers: ["page"], hint: "on the same page = hiểu giống nhau." },
        ],
      },
      {
        t: "note",
        title: "📌 Tự chấm và ghi sổ lỗi",
        items: [
          "**I–III dưới 13 / 18** ⇒ ôn Bài 1 mục 2 (bảng bảy công tắc) và mục 4 (tone).",
          "**IV dưới 5 / 6** ⇒ ôn Bài 2 mục 3; câu 5 sai nghĩa là bạn vẫn nhìn vị trí thay vì nhìn động từ tường thuật.",
          "**V dưới 6 / 8** ⇒ ngày mai học kỹ mục bẫy nghe trong bài Nghe của Ngày 16 trước khi làm Đề 10.",
          "**VI dưới 5 / 6** ⇒ đọc to lại hội thoại mẫu của Bài 3 hai lần, vai Minh.",
          "Ngày mai là **ngày làm Đề 10**: ngủ đủ, chuẩn bị 60 phút liền cho Writing và 32 phút cho Listening.",
        ],
      },
    ],
  },
];
