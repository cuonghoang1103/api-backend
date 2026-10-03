/**
 * Ngày 6 — sách trang 91–110:
 *   Reading Skills: Flow-chart Completion 1 · Writing Skills: Opinion Essays 1
 *   (mở bài Task 2) · Speaking Skills: Wh-Questions (Part 1, Daily Routine +
 *   Family, nhị trùng âm) · Homework (3 đề điền mở bài, 6 chỗ trống).
 *
 * Giữ đủ kiến thức, thứ tự, dạng bài và số câu của sách; bài đọc, ví dụ, câu
 * trả lời mẫu và câu bài tập đều VIẾT MỚI (xem ../SOAN-BAI.md). Bài đọc là phần
 * tiếp theo (đoạn D–F) của bài đọc Ngày 4 (đoạn A–C).
 *
 * Rà soát 29/09/2026: câu hỏi đánh số 10–13 như sách, đáp án khớp phần Answer
 * Explanation của sách (firm · simplicity · full version · feedback); thêm recap
 * đầu mỗi bài, khung câu (rule) Opinion + Wh-, bài dịch d6-viet-dich, d6-noi-dich.
 */
import type { Lesson } from '../data';

/* ─────────────────────────── Reading ─────────────────────────── */

const D6_READING: Lesson = {
  id: "d6-doc",
  kind: "reading",
  title: "Đọc: Flow-chart Completion 1 (hoàn thành sơ đồ quy trình)",
  goal: "Làm được dạng Flow-chart Completion theo 6 bước: đoán loại thông tin cần điền, bám theo trình tự bài đọc, dò từ khoá và từ đồng nghĩa, điền đúng từ trong bài và đúng giới hạn số từ.",
  minutes: 45,
  blocks: [
    {
      t: "recap",
      title: "Bài này học gì",
      items: [
        "**Flow-chart Completion** = điền vào sơ đồ quy trình (các ô nối bằng mũi tên ↓), lấy **đúng từ trong bài đọc**.",
        "Sơ đồ đi **theo thứ tự** bài đọc → đáp án câu sau nằm **sau** đáp án câu trước.",
        "Ô viết rất gọn, hay dùng **danh từ** (Presentation of…, Testing of…, Collection of…) → chỗ trống thường cần ==danh từ==.",
        "Làm theo **6 bước**: đọc đề → tìm vị trí → đọc kỹ ô → tìm từ khoá & từ đồng nghĩa → điền đúng dạng & số từ → kiểm tra lại.",
        "Luyện 4 câu (10–13, đánh số như sách) + **37 từ vựng** của bài đọc.",
      ],
    },
    {
      t: "p",
      text: "**Flow-chart** (sơ đồ quy trình, lưu đồ) là một chuỗi ô nối với nhau bằng **mũi tên ↓**. Mỗi ô là **một bước** hoặc **một giai đoạn** của một quá trình: làm sản phẩm, tiến hành nghiên cứu, lịch sử một phát minh… Một số ô có **chỗ trống**. Bạn phải lấy **đúng từ trong bài đọc** để điền vào.",
    },
    {
      t: "note",
      title: "Ghi nhớ về dạng bài",
      items: [
        "Flow-chart gần như luôn đi **theo thứ tự thời gian** của bài đọc: ô trên xảy ra trước, ô dưới xảy ra sau. Đáp án câu sau nằm **sau** đáp án câu trước trong bài.",
        "Nội dung trong ô được viết **rất gọn**, như ghi chú: hay dùng **danh từ** thay cho câu đầy đủ (**Presentation of…**, **Collection of…**, **Testing of…**). Vì thế chỗ trống thường cần **danh từ**.",
        "Giống Sentence Completion (Ngày 4): chép **đúng từ trong bài**, **đúng chính tả**, **không quá số từ** đề cho.",
        "Phần này sách chưa có: có một kiểu flow-chart khác cho sẵn **khung đáp án A–H**, bạn chỉ chọn chữ cái. Cách làm vẫn y như vậy, chỉ khác bước cuối là chọn chữ thay vì chép từ.",
      ],
    },

    { t: "h", text: "1. Cách làm: 6 bước" },
    {
      t: "p",
      text: "Sách đưa ra 6 bước. Bảng dưới đây giữ đúng 6 bước đó và thêm cột **giải thích** cho người mới.",
    },
    {
      t: "table",
      head: ["Bước", "Làm gì", "Giải thích thêm"],
      rows: [
        ["1. Đọc kỹ đề bài", "Xác định **chủ đề** của sơ đồ (đọc tiêu đề) và **loại thông tin** cần điền vào từng ô: danh từ, động từ, ngày tháng, con số…", "Khoanh ngay **giới hạn số từ** (ONE WORD ONLY, NO MORE THAN TWO WORDS…). Nhìn chữ đứng trước chỗ trống: sau **of / a / the / specialist** → danh từ."],
        ["2. Xác định vị trí đoạn văn", "Sơ đồ đi **theo trình tự** bài đọc. Đọc lướt để tìm đoạn nói về quá trình trong sơ đồ.", "Tiêu đề sơ đồ thường chỉ ngay đoạn cần đọc. Tìm được ô đầu tiên rồi thì các ô sau cứ **đi tiếp xuống dưới**, không cần dò lại từ đầu bài."],
        ["3. Đọc kỹ thông tin trong sơ đồ", "Chú ý **từ nối, từ chỉ sự kiện** trong từng ô để biết ô đó nói về bước nào.", "Các chữ như **then, after, once, finally, testing, presentation** cho biết thứ tự. Đọc cả ô **trước** và **sau** chỗ trống để hiểu ngữ cảnh."],
        ["4. Tìm từ khoá", "Gạch chân từ khoá trong ô, đối chiếu với bài đọc để tìm **thông tin chính xác**.", "Như Ngày 4: từ khoá trong sơ đồ thường **đã bị đổi** sang từ đồng nghĩa hoặc dạng khác (collected → **Collection**, a dozen → **twelve**)."],
        ["5. Điền đúng dạng từ", "Kiểm tra **số từ** và đảm bảo điền đúng **loại từ** (danh từ, động từ, số…).", "Chép nguyên dạng trong bài: bài viết **mechanics** (số nhiều) thì không chép ~~mechanic~~; bài viết **feedback** (không đếm được) thì không thêm ~~-s~~."],
        ["6. Kiểm tra lại", "Đọc lại cả sơ đồ và đoạn văn: câu trả lời phải **logic** và **đúng**.", "Đọc liền mạch từ ô đầu đến ô cuối: các bước có nối nhau hợp lý không? Có ô nào bạn điền một thứ xảy ra **sai thứ tự** không?"],
      ],
    },
    {
      t: "note",
      title: "Người Việt hay sai ở dạng bài này",
      items: [
        "Điền **động từ** vào chỗ cần **danh từ**: ô viết “Collection of ___” mà điền ~~collected~~ là sai. Sau **of** luôn cần danh từ (hoặc V-ing).",
        "Điền **từ đứng gần nhất** với từ khoá mà không kiểm tra nghĩa. Bài hay đặt **hai danh từ gần nhau** (ví dụ “firm” và “agency” trong bài dưới); chỉ một cái khớp với ô.",
        "Bỏ qua thứ tự: đáp án câu 12 lại lấy ở đoạn trước đáp án câu 11. Nếu thấy vậy, gần như chắc chắn bạn đã **nhầm chỗ**.",
        "Viết thêm mạo từ hay giới từ cho “đủ ý”: ~~the full version~~ (3 từ) là **sai** với đề NO MORE THAN TWO WORDS.",
      ],
    },

    {
      t: "rule",
      formula: "Đọc đề (loại từ + giới hạn số từ) → tìm đoạn → đọc ô trước/sau → từ khoá ↔ từ đồng nghĩa → chép đúng từ trong bài → đọc lại cả sơ đồ",
      vi: "Sau of / a / the / specialist → cần danh từ. Không quá số từ đề cho, không tự đổi dạng từ.",
    },

    { t: "h", text: "2. Ví dụ ngắn: áp dụng 6 bước (phần thêm)" },
    {
      t: "examples",
      items: [
        { en: "Flow-chart: Rice is harvested → The grains are dried in the ______ → Husks are removed", vi: "Sơ đồ: Lúa được gặt → Hạt được phơi ở ______ → Vỏ trấu được bóc đi" },
        { en: "Passage: After the harvest, farmers spread the grains across the village yard, where the sun dries them for two or three days. Only then are the husks taken off in a small mill.", vi: "Bài đọc: Sau khi gặt, nông dân rải thóc khắp sân làng, nơi nắng phơi khô chúng trong hai ba ngày. Sau đó vỏ trấu mới được bóc ở một cối xay nhỏ." },
      ],
    },
    {
      t: "table",
      head: ["Bước", "Áp dụng vào ví dụ (ONE WORD ONLY)"],
      rows: [
        ["1. Đọc đề", "Chủ đề: chế biến lúa. Sau **in the** → cần **danh từ chỉ nơi chốn**, một từ."],
        ["2. Vị trí", "Ô đứng giữa **harvested** và **husks removed** → tìm câu nằm giữa hai việc đó trong bài."],
        ["3. Đọc ô", "Ô trước: gặt xong. Ô sau: bóc vỏ. Ô cần điền: **phơi khô ở đâu**."],
        ["4. Từ khoá", "**dried** ↔ bài viết “the sun **dries** them” (đổi dạng từ). Nơi phơi: “the village **yard**”."],
        ["5. Điền", "**yard** (một từ). Không điền ~~village yard~~ vì đề chỉ cho ONE WORD; không điền ~~mill~~ vì cối xay là nơi **bóc vỏ**, bước sau."],
        ["6. Kiểm tra", "“The grains are dried in the yard” → đúng ngữ pháp, đúng thứ tự: gặt → phơi → bóc vỏ. ✓"],
      ],
    },

    { t: "h", text: "3. Bài đọc luyện tập" },
    {
      t: "p",
      text: "Bài đọc dưới đây được soạn riêng cho khoá học, là **phần tiếp theo** của bài đọc Ngày 4 (đoạn A–C: công ty phần mềm tìm hiểu trẻ mẫu giáo trước khi làm ứng dụng). Đoạn D–F kể nhóm nghiên cứu **dùng kết quả** đó thế nào. Hãy đọc sơ đồ ở Questions 10–13 **trước**, rồi mới đọc bài.",
    },
    {
      t: "passage",
      title: "Designing a Tablet App for Young Children: From Research to Product",
      intro: "Phần tiếp theo của bài đọc Ngày 4 — gồm 3 đoạn D, E, F. Câu hỏi 10–13 ở ngay bên dưới (đánh số như sách).",
      paras: [
        {
          label: "D",
          text: "The findings from this initial round of home visits were extensive, and several of them surprised the team. In one short experiment, children were handed a tablet with no instructions at all, and most of them tried to drag pictures around the screen before they ever tried to tap them. After reviewing these outcomes and discussing their implications for the design with the company's internal production team, the researchers outlined the needs of the project in a single document. At the top of that list was one rule: every screen should give the child one clear task. Rather than create the artwork themselves, the team presented the list to a firm specialising in picture books and animation for pre-school children. Its experts, most of whom had previously worked for a well-known advertising agency, then worked side by side with the programmers to fix the look of the two apps under development, using everything the home visits had revealed.",
        },
        {
          label: "E",
          text: "As the two apps moved through the development process, a formative research routine was put in place, which meant that children tested the product while it was still being built, not just at the end. Whenever the programmers created a new game mechanic, such as shaking the tablet to make apples fall from a tree, five or six children were invited into the company's utility lab, a spare meeting room fitted with two cameras and child-sized chairs. There the team evaluated two things: the simplicity of each mechanic, and whether it could engage a four-year-old for more than a few seconds. Early versions of separate elements, like the menus and the sound effects, were tried out in the same way, and the overall structure of each app was checked too. Anything that confused the children was adjusted before the next session.",
        },
        {
          label: "F",
          text: "When a full version of each app was ready, the researchers went back into the field and visited a dozen children in their own homes. Their objective was to make sure that every part of the app worked for its young users, that the aim of each game was understandable without adult help, and that the whole experience was enjoyable from start to finish. The children's own comments were recorded on video during each visit. Finally, the team gathered feedback from parents and grandparents about whether the apps were appropriate for small children, easy to trust and worth the price.",
        },
      ],
    },

    { t: "h", text: "Questions 10–13" },
    {
      t: "p",
      text: "Complete the flow-chart below. Choose **NO MORE THAN TWO WORDS** from the passage for each answer. — *Hoàn thành sơ đồ dưới đây. Chọn **KHÔNG QUÁ HAI TỪ** trong bài đọc cho mỗi câu trả lời.*",
    },
    {
      t: "table",
      caption: "Using the Results of the Home Visits — Sử dụng kết quả của các lần đến thăm tại nhà",
      head: ["", "Bước (đọc từ trên xuống)"],
      rows: [
        ["1", "Design needs presented to a specialist **(10) ______** — **Trình bày nhu cầu thiết kế cho một (10) ______ chuyên môn**"],
        ["↓", ""],
        ["2", "Testing of new mechanics in the company's own lab (assessing **(11) ______** and interest) — **Thử các cơ chế mới trong phòng thí nghiệm của công ty (đánh giá (11) ______ và mức độ hứng thú)**"],
        ["↓", ""],
        ["3", "A field test of the **(12) ______** involving twelve children — **Thử nghiệm thực địa (12) ______ với mười hai trẻ**"],
        ["↓", ""],
        ["4", "Collection of **(13) ______** from adults in the family — **Thu thập (13) ______ từ người lớn trong gia đình**"],
      ],
    },
    {
      t: "quiz",
      id: "d6-doc-cau",
      title: "Questions 10–13 — NO MORE THAN TWO WORDS",
      kind: "fill",
      items: [
        { q: "(10) Design needs presented to a specialist ___", answers: ["firm"] },
        { q: "(11) Testing of new mechanics in the company's own lab (assessing ___ and interest)", answers: ["simplicity"] },
        { q: "(12) A field test of the ___ involving twelve children", answers: ["full version"] },
        { q: "(13) Collection of ___ from adults in the family", answers: ["feedback"] },
      ],
    },

    { t: "h", text: "4. Giải thích đáp án" },
    {
      t: "note",
      title: "Giải thích đáp án câu 10: firm",
      items: [
        "**Dạng câu hỏi:** Flow-chart Completion · **Vị trí:** đoạn D, câu 5. (Đáp án khớp sách: **firm**.)",
        "Bài viết: “Rather than create the artwork themselves, the team **presented the list** to a **firm specialising in** picture books and animation for pre-school children.” — **Thay vì tự vẽ hình, nhóm trình bày danh sách đó cho một công ty chuyên về sách tranh và hoạt hình cho trẻ mẫu giáo.**",
        "Paraphrase: **the list** (ở câu 3: the needs of the project) = **Design needs**; **presented… to** giữ nguyên; **specialising in** (động từ) → **specialist** (danh từ đứng trước chỗ trống, dùng như tính từ). Sau “a specialist” cần **một danh từ** → **firm**.",
        "Bẫy: ~~agency~~ ở câu ngay sau. Nhưng “a well-known advertising agency” là **nơi các chuyên gia từng làm trước đây** (had previously worked for), không phải nơi nhóm trình bày danh sách. Đọc đúng **ai làm gì với ai** thì loại được.",
      ],
    },
    {
      t: "note",
      title: "Giải thích đáp án câu 11: simplicity",
      items: [
        "**Dạng câu hỏi:** Flow-chart Completion · **Vị trí:** đoạn E, câu 3. (Đáp án khớp sách: **simplicity**.)",
        "Bài viết: “There the team **evaluated two things**: the **simplicity** of each mechanic, and whether it could **engage** a four-year-old for more than a few seconds.” — **Ở đó nhóm đánh giá hai điều: độ đơn giản của mỗi cơ chế, và liệu nó có thu hút được một đứa trẻ bốn tuổi lâu hơn vài giây hay không.**",
        "Paraphrase: **evaluated** = **assessing**; **whether it could engage** (có thu hút không) = **interest**; **the company's utility lab** = **the company's own lab**. Ô đánh giá **hai thứ**, “interest” đã có sẵn → thứ còn lại là **simplicity**.",
        "Chép đúng danh từ **simplicity** (sự đơn giản), không đổi thành tính từ ~~simple~~: sau **assessing** và đứng cạnh danh từ **interest** thì phải là **danh từ**.",
      ],
    },
    {
      t: "note",
      title: "Giải thích đáp án câu 12: full version",
      items: [
        "**Dạng câu hỏi:** Flow-chart Completion · **Vị trí:** đoạn F, câu 1. (Đáp án khớp sách: **full version**.)",
        "Bài viết: “When a **full version** of each app was ready, the researchers **went back into the field** and visited **a dozen children** in their own homes.” — **Khi bản đầy đủ của mỗi ứng dụng đã sẵn sàng, các nhà nghiên cứu quay lại thực địa và đến thăm mười hai đứa trẻ tại nhà các em.**",
        "Paraphrase: **went back into the field** = **A field test**; **a dozen** (một tá = 12) = **twelve**; **visited… children** = **involving… children**. Sau **the** cần cụm danh từ → **full version** (2 từ, đúng giới hạn).",
        "Bẫy: ~~early versions~~ ở đoạn E là bản thử **từng phần** (menu, âm thanh) trong lab, không phải bản đem đi thử thực địa. Và ~~version~~ một mình thì thiếu nghĩa: phải là bản **đầy đủ**.",
      ],
    },
    {
      t: "note",
      title: "Giải thích đáp án câu 13: feedback",
      items: [
        "**Dạng câu hỏi:** Flow-chart Completion · **Vị trí:** đoạn F, câu cuối. (Đáp án khớp sách: **feedback**.)",
        "Bài viết: “Finally, the team **gathered feedback from parents and grandparents** about whether the apps were appropriate for small children, easy to trust and worth the price.” — **Cuối cùng, nhóm thu thập ý kiến phản hồi của bố mẹ và ông bà về việc các ứng dụng có phù hợp với trẻ nhỏ, đáng tin cậy và đáng đồng tiền hay không.**",
        "Paraphrase: **gathered** (động từ) → **Collection** (danh từ); **parents and grandparents** = **adults in the family**; **Finally** khớp với **ô cuối cùng** của sơ đồ.",
        "Bẫy: ~~comments~~ ở câu ngay trước — nhưng đó là lời **của các em nhỏ** (the children's own comments), còn ô 13 hỏi ý kiến **từ người lớn**. Và **feedback** là danh từ **không đếm được** (liên hệ Ngày 5): chép đúng ~~feedbacks~~ → **feedback**.",
      ],
    },

    { t: "h", text: "5. Từ vựng hữu ích (37 từ)" },
    {
      t: "p",
      text: "Đủ 37 từ của sách, tất cả đều có mặt trong đoạn D–F ở trên (có khi ở dạng khác: reviewing, outlined, specialising, adjusted…). Bấm 🔊 để nghe, tìm lại từ đó trong bài, rồi tự đặt một câu.",
    },
    {
      t: "vocab",
      items: [
        { w: "finding", pos: "n", ipa: "/ˈfaɪndɪŋ/", vi: "phát hiện, kết quả tìm ra (thường dùng số nhiều: findings)", ex: "The main finding of the survey is that students sleep too little.", exVi: "Phát hiện chính của cuộc khảo sát là học sinh ngủ quá ít." },
        { w: "initial", pos: "adj", ipa: "/ɪˈnɪʃl/", vi: "ban đầu, đầu tiên", ex: "My initial plan was to study medicine.", exVi: "Kế hoạch ban đầu của tôi là học y." },
        { w: "experiment", pos: "n", ipa: "/ɪkˈsperɪmənt/", vi: "thí nghiệm, cuộc thử nghiệm", ex: "In today's experiment, we will heat water to 100 degrees.", exVi: "Trong thí nghiệm hôm nay, chúng ta sẽ đun nước tới 100 độ." },
        { w: "extensive", pos: "adj", ipa: "/ɪkˈstensɪv/", vi: "rộng, nhiều, bao quát", ex: "The storm caused extensive damage to the rice fields.", exVi: "Cơn bão gây thiệt hại trên diện rộng cho các cánh đồng lúa." },
        { w: "review", pos: "v", ipa: "/rɪˈvjuː/", vi: "xem xét lại, ôn lại", ex: "Review your notes for ten minutes before bed.", exVi: "Hãy xem lại ghi chép của bạn mười phút trước khi ngủ." },
        { w: "outcome", pos: "n", ipa: "/ˈaʊtkʌm/", vi: "kết quả (cuối cùng)", ex: "Nobody could predict the outcome of the final match.", exVi: "Không ai đoán được kết quả trận chung kết." },
        { w: "discuss", pos: "v", ipa: "/dɪˈskʌs/", vi: "thảo luận, bàn bạc", ex: "We discussed the plan for our class trip.", exVi: "Chúng tôi đã bàn kế hoạch cho chuyến đi của lớp." },
        { w: "implication", pos: "n", ipa: "/ˌɪmplɪˈkeɪʃn/", vi: "hệ quả, ảnh hưởng có thể xảy ra", ex: "Think about the implications of quitting your job.", exVi: "Hãy nghĩ về các hệ quả của việc bỏ việc." },
        { w: "design", pos: "n", ipa: "/dɪˈzaɪn/", vi: "thiết kế, bản thiết kế", ex: "I love the simple design of this backpack.", exVi: "Tôi thích thiết kế đơn giản của chiếc ba lô này." },
        { w: "internal", pos: "adj", ipa: "/ɪnˈtɜːnl/", vi: "nội bộ, bên trong", ex: "The company sent an internal email to all staff.", exVi: "Công ty gửi một email nội bộ cho toàn bộ nhân viên." },
        { w: "production", pos: "n", ipa: "/prəˈdʌkʃn/", vi: "sự sản xuất; khâu sản xuất", ex: "Coffee production in Vietnam rose last year.", exVi: "Sản lượng cà phê ở Việt Nam đã tăng năm ngoái." },
        { w: "outline", pos: "v", ipa: "/ˈaʊtlaɪn/", vi: "phác thảo, nêu những ý chính", ex: "The teacher outlined the three parts of the essay.", exVi: "Cô giáo phác thảo ba phần của bài luận." },
        { w: "need", pos: "n", ipa: "/niːd/", vi: "nhu cầu, điều cần có", ex: "The new hospital will meet the needs of the whole district.", exVi: "Bệnh viện mới sẽ đáp ứng nhu cầu của cả huyện." },
        { w: "present", pos: "v", ipa: "/prɪˈzent/", vi: "trình bày; trao tặng", ex: "Each group will present its project on Friday.", exVi: "Mỗi nhóm sẽ trình bày dự án của mình vào thứ Sáu." },
        { w: "firm", pos: "n", ipa: "/fɜːm/", vi: "công ty, hãng", ex: "My uncle works for a small law firm in Da Nang.", exVi: "Chú tôi làm cho một công ty luật nhỏ ở Đà Nẵng." },
        { w: "specialise", pos: "v", ipa: "/ˈspeʃəlaɪz/", vi: "chuyên về (specialise in + N/V-ing); Mỹ viết specialize", ex: "This restaurant specialises in seafood from Nha Trang.", exVi: "Nhà hàng này chuyên về hải sản Nha Trang." },
        { w: "expert", pos: "n", ipa: "/ˈekspɜːt/", vi: "chuyên gia", ex: "Health experts advise walking 30 minutes a day.", exVi: "Các chuyên gia sức khoẻ khuyên đi bộ 30 phút mỗi ngày." },
        { w: "development", pos: "n", ipa: "/dɪˈveləpmənt/", vi: "sự phát triển; under development = đang được phát triển", ex: "A new vaccine is under development.", exVi: "Một loại vắc-xin mới đang được phát triển." },
        { w: "mechanic", pos: "n", ipa: "/məˈkænɪk/", vi: "(trong game) một cơ chế chơi; nghĩa phổ biến hơn: thợ máy", ex: "Jumping is the main mechanic in this game. / The mechanic fixed my motorbike.", exVi: "Nhảy là cơ chế chính của trò này. / Người thợ máy đã sửa xe máy của tôi." },
        { w: "utility", pos: "n", ipa: "/juːˈtɪləti/", vi: "sự hữu dụng; (đứng trước danh từ) đa năng, dùng cho nhiều việc: utility room/lab", ex: "We keep the washing machine in the utility room.", exVi: "Chúng tôi để máy giặt trong phòng tiện ích." },
        { w: "lab", pos: "n", ipa: "/læb/", vi: "phòng thí nghiệm (viết tắt của laboratory)", ex: "Students must wear glasses in the chemistry lab.", exVi: "Học sinh phải đeo kính trong phòng thí nghiệm hoá." },
        { w: "evaluate", pos: "v", ipa: "/ɪˈvæljueɪt/", vi: "đánh giá", ex: "Teachers evaluate students by their homework and tests.", exVi: "Giáo viên đánh giá học sinh qua bài tập về nhà và bài kiểm tra." },
        { w: "simplicity", pos: "n", ipa: "/sɪmˈplɪsəti/", vi: "sự đơn giản", ex: "People love this phone for its simplicity.", exVi: "Mọi người thích chiếc điện thoại này vì sự đơn giản của nó." },
        { w: "gather", pos: "v", ipa: "/ˈɡæðə(r)/", vi: "thu thập; tụ họp", ex: "Scientists gathered data from 500 schools.", exVi: "Các nhà khoa học đã thu thập dữ liệu từ 500 trường học." },
        { w: "adjust", pos: "v", ipa: "/əˈdʒʌst/", vi: "điều chỉnh", ex: "You can adjust the height of this chair.", exVi: "Bạn có thể điều chỉnh độ cao của chiếc ghế này." },
        { w: "formative", pos: "adj", ipa: "/ˈfɔːmətɪv/", vi: "(nghiên cứu, đánh giá) diễn ra trong lúc làm để góp ý sửa dần; (thời kỳ) hình thành", ex: "Weekly quizzes are a kind of formative assessment.", exVi: "Bài kiểm tra nhanh hằng tuần là một kiểu đánh giá trong quá trình học." },
        { w: "element", pos: "n", ipa: "/ˈelɪmənt/", vi: "yếu tố, thành phần", ex: "Good sleep is a key element of a healthy life.", exVi: "Ngủ ngon là một yếu tố then chốt của cuộc sống khoẻ mạnh." },
        { w: "structure", pos: "n", ipa: "/ˈstrʌktʃə(r)/", vi: "cấu trúc", ex: "An essay needs a clear structure: introduction, body and conclusion.", exVi: "Một bài luận cần cấu trúc rõ ràng: mở bài, thân bài và kết bài." },
        { w: "full", pos: "adj", ipa: "/fʊl/", vi: "đầy đủ, trọn vẹn; đầy", ex: "Please write your full name on the form.", exVi: "Vui lòng ghi họ tên đầy đủ vào tờ khai." },
        { w: "field", pos: "n", ipa: "/fiːld/", vi: "thực địa (in the field = tại hiện trường, ngoài đời thật); cánh đồng; lĩnh vực", ex: "The students collected plant samples in the field.", exVi: "Các sinh viên thu thập mẫu cây ngoài thực địa." },
        { w: "engage", pos: "v", ipa: "/ɪnˈɡeɪdʒ/", vi: "thu hút (sự chú ý, sự tham gia)", ex: "Good stories engage even the youngest listeners.", exVi: "Những câu chuyện hay thu hút cả những người nghe nhỏ tuổi nhất." },
        { w: "dozen", pos: "n", ipa: "/ˈdʌzn/", vi: "một tá, mười hai", ex: "I bought a dozen eggs at the market.", exVi: "Tôi đã mua một tá trứng ở chợ." },
        { w: "objective", pos: "n", ipa: "/əbˈdʒektɪv/", vi: "mục tiêu (cụ thể)", ex: "The objective of this lesson is to write a clear introduction.", exVi: "Mục tiêu của bài học này là viết một mở bài rõ ràng." },
        { w: "understandable", pos: "adj", ipa: "/ˌʌndəˈstændəbl/", vi: "dễ hiểu; có thể hiểu được", ex: "The doctor gave an understandable explanation.", exVi: "Bác sĩ đưa ra lời giải thích dễ hiểu." },
        { w: "process", pos: "n", ipa: "/ˈprəʊses/", vi: "quá trình, quy trình", ex: "Learning a language is a slow process.", exVi: "Học một ngôn ngữ là một quá trình chậm." },
        { w: "enjoyable", pos: "adj", ipa: "/ɪnˈdʒɔɪəbl/", vi: "thú vị, mang lại niềm vui", ex: "We had an enjoyable weekend in Da Lat.", exVi: "Chúng tôi đã có một cuối tuần vui vẻ ở Đà Lạt." },
        { w: "appropriate", pos: "adj", ipa: "/əˈprəʊpriət/", vi: "phù hợp, thích hợp (appropriate for + người/việc)", ex: "This film is not appropriate for young children.", exVi: "Bộ phim này không phù hợp với trẻ nhỏ." },
      ],
    },
    {
      t: "note",
      title: "Cẩn thận: những chỗ sách ghi quá gọn",
      items: [
        "Sách ghi **extensive = rộng lớn**. Với kết quả, nghiên cứu thì nên hiểu là **nhiều, bao quát**: extensive findings = rất nhiều phát hiện. “Rộng lớn” chỉ hợp khi nói diện tích, thiệt hại.",
        "Sách ghi **mechanic (n) = cơ chế**. Nghĩa thường gặp nhất của **a mechanic** là **thợ máy**. Nghĩa “cơ chế” chỉ dùng trong ngành game (**a game mechanic**); ngoài game dùng **mechanics** có -s (the mechanics of a clock), xem Ngày 4.",
        "Sách ghi **utility = tiện ích**. Trong bài, **utility lab / utility room** là phòng **dùng cho nhiều việc**, không phải “phòng thí nghiệm tiện ích”. Số nhiều **utilities** lại là **điện, nước, gas** (tiền điện nước = utility bills).",
        "Sách ghi **formative = hình thành**. Trong nghiên cứu và giáo dục, **formative** nghĩa là **làm trong lúc đang xây dựng để sửa dần** (khác **summative** = đánh giá tổng kết ở cuối).",
        "**present** động từ (trình bày) nhấn âm **sau**: /prɪˈzent/. Danh từ/tính từ **present** (món quà, hiện tại) nhấn âm **đầu**: /ˈpreznt/.",
        "**engage** thu hút ai: **engage children** (không có giới từ). **engaging** (tính từ) = hấp dẫn, lôi cuốn: an engaging game.",
      ],
    },
  ],
};

/* ─────────────────────────── Writing ─────────────────────────── */

const D6_WRITING: Lesson = {
  id: "d6-viet",
  kind: "writing",
  title: "Viết: Opinion Essay 1 — viết mở bài Task 2",
  goal: "Viết được mở bài 2 câu cho bài luận nêu quan điểm (Opinion Essay) Task 2: đọc đề, viết lại đề (paraphrase), nêu quan điểm kèm lý do (thesis), ghép lại và tự rà lỗi.",
  minutes: 50,
  blocks: [
    {
      t: "recap",
      title: "Bài này học gì",
      items: [
        "**Writing Task 2** ≥ 250 từ, ~40 phút, điểm **gấp đôi** Task 1. Dạng **Opinion** nhận ra qua câu **Do you agree or disagree? / To what extent…?**",
        "Mở bài chỉ **2 câu (~40–50 từ)**: ==paraphrase đề== + ==thesis statement== (quan điểm + 1–2 lý do).",
        "5 bước: **đọc đề → paraphrase → thesis → ghép → rà soát**.",
        "3 cách paraphrase: **đổi từ đồng nghĩa · đổi dạng từ · đổi cấu trúc câu** — không đổi mất nghĩa.",
        "Hai lý do trong thesis = **hai đoạn thân bài**. Tránh lỗi ~~I am agree~~, ~~In my opinion, I think~~.",
      ],
    },
    { t: "h", text: "1. Writing Task 2 và dạng Opinion" },
    {
      t: "p",
      text: "**Writing Task 2** là bài luận (essay) trả lời một câu hỏi về một vấn đề xã hội: giáo dục, công việc, công nghệ, môi trường… Bạn viết **ít nhất 250 từ** trong khoảng **40 phút**. Task 2 được tính điểm **gấp đôi** Task 1, nên đây là phần quan trọng nhất của bài Writing.",
    },
    {
      t: "p",
      text: "**Opinion Essay** (bài luận nêu quan điểm, còn gọi là Agree/Disagree) là dạng hay gặp nhất. Đề đưa ra một ý kiến rồi hỏi **bạn đồng ý hay không đồng ý**. Nhận ra dạng này qua câu hỏi cuối đề:",
    },
    {
      t: "table",
      head: ["Câu hỏi cuối đề", "Nghĩa", "Bạn được chọn"],
      rows: [
        ["**Do you agree or disagree?**", "Bạn đồng ý hay không đồng ý?", "Đồng ý, không đồng ý, hoặc đồng ý một phần. Người mới nên chọn **một phía rõ ràng**."],
        ["**To what extent do you agree or disagree?**", "Bạn đồng ý hay không đồng ý **đến mức độ nào**?", "Như trên, nhưng đề **mời bạn nói mức độ**: hoàn toàn đồng ý (completely agree), đồng ý một phần (partly agree)…"],
        ["**What is your opinion?** / **What do you think?**", "Ý kiến của bạn là gì?", "Thường đi sau đề nêu **hai quan điểm** (Some people… while others…): bạn nói mình nghiêng về bên nào."],
      ],
    },
    {
      t: "note",
      title: "Ghi nhớ: mở bài làm hai việc",
      items: [
        "**Câu 1 — Paraphrase:** viết lại đề bằng lời của bạn, để giám khảo thấy bạn **hiểu đúng đề**.",
        "**Câu 2 — Thesis statement** (câu luận điểm): nói rõ **bạn đứng về phía nào** và **vì sao** (1–2 lý do ngắn).",
        "Mở bài chỉ cần **2 câu, khoảng 40–50 từ**. Không cần câu dẫn dắt dài dòng.",
      ],
    },

    { t: "h", text: "2. Các bước viết mở bài" },
    {
      t: "p",
      text: "Sách đưa ra các bước theo mục tiêu band 4.0, ở hai trang liền nhau: một bảng 4 bước (Paraphrase → Thesis → Ghép → Rà soát) và một bảng 5 bước có thêm **bước đọc đề** ở đầu. Bảng dưới gộp cả hai thành **5 bước**; ví dụ đều viết mới.",
    },
    {
      t: "table",
      head: ["Bước", "Làm gì", "Giải thích thêm"],
      rows: [
        ["1. Đọc kỹ đề bài", "Xác định **chủ đề** và **yêu cầu** của đề. Quyết định rõ quan điểm: đồng ý hay không đồng ý.", "Gạch chân 3 thứ: **chủ đề** (smartphones), **đối tượng** (teenagers), **ý kiến đề đưa ra** (negative effect on concentration). Quyết định quan điểm **trước khi viết**, không vừa viết vừa nghĩ."],
        ["2. Paraphrase đề bài", "Viết lại đề bằng **từ đồng nghĩa** và **cấu trúc câu khác**, nhưng **giữ nguyên nghĩa**.", "Không chép nguyên đề: phần chép lại **không được tính** vào số từ và không cho giám khảo thấy vốn từ của bạn."],
        ["3. Viết thesis statement", "Nêu rõ quan điểm (**agree** hoặc **disagree**) và **một hoặc hai lý do** chính, đơn giản.", "Hai lý do này sẽ là **hai đoạn thân bài**. Chọn lý do mà bạn **có đủ từ vựng** để viết tiếp."],
        ["4. Ghép mở bài", "Nối câu paraphrase và câu thesis thành **một đoạn** hoàn chỉnh.", "Paraphrase đứng trước, thesis đứng sau. Hai câu, không xuống dòng giữa chúng."],
        ["5. Rà soát", "Kiểm tra **ngữ pháp, dấu câu, từ vựng**; câu văn phải **ngắn gọn, dễ hiểu**, không lỗi chính tả.", "Danh sách soát ở mục 5 bên dưới. Mất 1 phút nhưng cứu được nhiều lỗi mất điểm."],
      ],
    },

    { t: "h", text: "3. Ví dụ 1 (đề hai quan điểm, “To what extent”)" },
    {
      t: "p",
      text: "**Đề:** Some people believe that studying online is more beneficial for university students, while others think it only brings disadvantages. To what extent do you agree or disagree? — **Một số người tin rằng học trực tuyến mang lại nhiều lợi ích hơn cho sinh viên đại học, trong khi những người khác cho rằng nó chỉ mang lại bất lợi. Bạn đồng ý hay không đồng ý đến mức độ nào?**",
    },
    {
      t: "table",
      head: ["Bước", "Ví dụ minh hoạ"],
      rows: [
        ["1. Đọc đề", "Chủ đề: **học trực tuyến**. Đối tượng: **sinh viên đại học**. Hai quan điểm: nhiều lợi ích hơn ↔ chỉ có bất lợi. Quyết định: **đồng ý** rằng nó có lợi hơn."],
        ["2. Paraphrase", "Some people **argue** that **learning over the internet offers** university students **more advantages**, **whereas** others **feel** that it **does more harm than good**. — **Một số người lập luận rằng học qua internet mang lại cho sinh viên nhiều lợi thế hơn, trong khi những người khác cảm thấy nó gây hại nhiều hơn lợi.**"],
        ["3. Thesis", "I believe that online study is more beneficial **because** it **saves travel time** and **lets students learn at their own pace**. — **Tôi tin rằng học trực tuyến có lợi hơn vì nó tiết kiệm thời gian đi lại và cho phép sinh viên học theo tốc độ của riêng mình.**"],
        ["4. Ghép", "Some people argue that learning over the internet offers university students more advantages, whereas others feel that it does more harm than good. I believe that online study is more beneficial because it saves travel time and lets students learn at their own pace."],
        ["5. Rà soát", "✓ **offers** (chủ ngữ số ít “learning”) · ✓ **lets students learn** (let + O + V nguyên mẫu) · ✓ không lặp “studying online” ba lần · ✓ 2 câu, 48 từ."],
      ],
    },
    {
      t: "table",
      caption: "Paraphrase đã đổi những gì?",
      head: ["Trong đề", "Trong bài", "Cách đổi"],
      rows: [
        ["believe", "argue", "Từ đồng nghĩa"],
        ["studying online", "learning over the internet", "Từ đồng nghĩa + đổi cụm"],
        ["is more beneficial for university students", "offers university students more advantages", "Đổi cấu trúc: tính từ (beneficial) → động từ + danh từ (offers… advantages)"],
        ["while", "whereas", "Từ nối đồng nghĩa"],
        ["think", "feel", "Từ đồng nghĩa"],
        ["only brings disadvantages", "does more harm than good", "Diễn đạt bằng một thành ngữ"],
      ],
    },

    { t: "h", text: "4. Ví dụ 2 (đề một ý kiến, “Do you agree or disagree?”)" },
    {
      t: "p",
      text: "**Đề:** Smartphones have a negative effect on teenagers' ability to concentrate. Do you agree or disagree? — **Điện thoại thông minh có ảnh hưởng tiêu cực đến khả năng tập trung của thanh thiếu niên. Bạn đồng ý hay không đồng ý?**",
    },
    {
      t: "table",
      head: ["Bước", "Ví dụ minh hoạ"],
      rows: [
        ["1. Đọc đề", "Chủ đề: **điện thoại thông minh**. Đối tượng: **thanh thiếu niên**. Ý kiến: làm **giảm khả năng tập trung**. Quyết định: **hoàn toàn đồng ý**."],
        ["2. Paraphrase", "Many people **claim** that **mobile phones make it harder for young people to focus**. — **Nhiều người cho rằng điện thoại di động khiến người trẻ khó tập trung hơn.**"],
        ["3. Thesis", "I **completely agree** because **constant notifications interrupt study time** and **short videos train the brain to expect quick rewards**. — **Tôi hoàn toàn đồng ý vì thông báo liên tục làm gián đoạn giờ học và video ngắn khiến não quen với việc đòi phần thưởng tức thì.**"],
        ["4. Ghép", "Many people claim that mobile phones make it harder for young people to focus. I completely agree because constant notifications interrupt study time and short videos train the brain to expect quick rewards."],
        ["5. Rà soát", "✓ **make it harder for sb to V** (cấu trúc đúng) · ✓ **notifications interrupt** (chủ ngữ số nhiều, động từ không -s) · ✓ hai lý do rõ ràng = hai đoạn thân bài."],
      ],
    },
    {
      t: "note",
      title: "Mẹo: 3 cách paraphrase cho người mới (phần sách chưa có)",
      items: [
        "**Đổi từ đồng nghĩa:** believe → **argue / claim / feel / are of the opinion that**; beneficial → **advantageous / useful**; disadvantages → **drawbacks**; children → **young people / kids**.",
        "**Đổi dạng từ:** beneficial (adj) → **benefit** (n/v): “it is beneficial” → “it **benefits** students”; negative effect → “**negatively affects**”.",
        "**Đổi cấu trúc:** “X has a negative effect on Y” → “**X makes it harder for Y to…**”; “A is more beneficial than B” → “**A offers more advantages than B**”.",
        "**Không đổi** những từ không có đồng nghĩa chuẩn (university, government, public transport). Đổi sai nghĩa còn tệ hơn giữ nguyên.",
      ],
    },
    {
      t: "patterns",
      rows: [
        {
          formula: "I completely agree / I strongly believe that + S + V + because + lý do 1 + and + lý do 2.",
          vi: "Hoàn toàn đồng ý (một phía rõ ràng) — dễ viết nhất cho người mới.",
          examples: [
            { en: "I completely agree because regular exercise improves both physical and mental health.", vi: "Tôi hoàn toàn đồng ý vì tập thể dục đều đặn cải thiện cả sức khoẻ thể chất lẫn tinh thần." },
          ],
        },
        {
          formula: "I completely disagree with this view because + lý do 1 + and + lý do 2.",
          vi: "Hoàn toàn không đồng ý.",
          examples: [
            { en: "I completely disagree with this view because homework helps students remember lessons and builds good habits.", vi: "Tôi hoàn toàn không đồng ý với quan điểm này vì bài tập về nhà giúp học sinh nhớ bài và hình thành thói quen tốt." },
          ],
        },
        {
          formula: "I partly agree because while + S + V (mặt đồng ý), + S + V (mặt không đồng ý).",
          vi: "Đồng ý một phần — hợp với đề “To what extent”, nhưng cần ý rõ ràng cho cả hai mặt.",
          examples: [
            { en: "I partly agree because while online shopping saves time, it can also encourage people to buy things they do not need.", vi: "Tôi đồng ý một phần vì dù mua sắm trực tuyến tiết kiệm thời gian, nó cũng có thể khuyến khích người ta mua những thứ không cần." },
          ],
        },
      ],
    },
    {
      t: "patterns",
      rows: [
        {
          formula: "Some people / Many individuals + argue / claim / believe + that + S + V, whereas / while others + feel / think + that + S + V.",
          vi: "Khung câu PARAPHRASE cho đề hai quan điểm (Some people… while others…).",
          examples: [
            { en: "Some individuals argue that remote work gives employees more freedom, while others feel that it makes them lonely.", vi: "Một số người lập luận rằng làm từ xa cho nhân viên nhiều tự do hơn, trong khi những người khác cảm thấy nó khiến họ cô đơn." },
          ],
        },
        {
          formula: "It is often argued / Many people claim + that + S + V.",
          vi: "Khung câu PARAPHRASE cho đề một ý kiến (Do you agree or disagree?).",
          examples: [
            { en: "Many people claim that social media makes it harder for friends to communicate face to face.", vi: "Nhiều người cho rằng mạng xã hội khiến bạn bè khó giao tiếp trực tiếp hơn." },
          ],
        },
      ],
    },
    {
      t: "rule",
      formula: "Mở bài = [Some people argue that + S + V, while others feel that + S + V.] + [I (completely / partly) agree / disagree + because + S + V + and + S + V.]",
      vi: "Câu 1 paraphrase đề, câu 2 nêu quan điểm + 2 lý do (sau because là một mệnh đề có S + V).",
    },
    {
      t: "quiz",
      id: "d6-viet-dich",
      title: "Dịch sang tiếng Anh — khung câu mở bài Opinion (5 câu)",
      kind: "translate",
      grammar: "Paraphrase: Some people / Many individuals + argue / believe / claim + that + S + V, while / whereas others + feel / think + that + S + V. Thesis: I (completely / partly) agree / disagree + because + S + V (+ and + S + V). Chủ ngữ số ít (remote work, social media) → động từ thêm -s.",
      items: [
        { q: "Một số người lập luận rằng làm việc từ xa mang lại nhiều lợi thế hơn cho nhân viên.", hint: "Some people / Some individuals, argue that, remote work, offers / gives, more advantages, to employees", answers: ["Some people argue that remote work offers more advantages to employees.", "Some individuals argue that remote work offers more advantages to employees.", "Some people argue that remote work offers employees more advantages.", "Some individuals argue that remote work offers employees more advantages.", "Some people argue that remote work gives employees more advantages.", "Some individuals argue that remote work gives employees more advantages.", "Some people argue that remote work gives more advantages to employees.", "Some people argue that working remotely offers more advantages to employees.", "Some people argue that working from home offers more advantages to employees."] },
        { q: "Tôi tin rằng làm việc tại nhà có lợi hơn vì nó cho phép linh hoạt hơn.", hint: "I believe that, working from home, is more beneficial, because, it allows greater flexibility", answers: ["I believe that working from home is more beneficial because it allows greater flexibility.", "I believe working from home is more beneficial because it allows greater flexibility.", "I believe that working from home is more beneficial because it allows more flexibility.", "I believe working from home is more beneficial because it allows more flexibility.", "I believe that working from home is more beneficial because it gives more flexibility.", "I believe that working from home is more beneficial because it offers greater flexibility.", "I believe that working from home is more beneficial because it offers more flexibility."] },
        { q: "Tôi hoàn toàn đồng ý vì mạng xã hội làm giảm giao tiếp trực tiếp.", hint: "I completely agree, because, social media (số ít → decreases / reduces), face-to-face communication", answers: ["I completely agree because social media decreases face-to-face communication.", "I completely agree because social media reduces face-to-face communication.", "I totally agree because social media decreases face-to-face communication.", "I totally agree because social media reduces face-to-face communication.", "I completely agree with this because social media reduces face-to-face communication.", "I completely agree with this because social media decreases face-to-face communication."] },
        { q: "Tôi hoàn toàn không đồng ý với quan điểm này vì bài tập về nhà giúp học sinh nhớ bài.", hint: "I completely disagree with this view, because, homework helps students + V nguyên mẫu (remember lessons)", answers: ["I completely disagree with this view because homework helps students remember lessons.", "I completely disagree with this view because homework helps students remember their lessons.", "I completely disagree with this view because homework helps students to remember lessons.", "I completely disagree with this view because homework helps students to remember their lessons.", "I completely disagree with this opinion because homework helps students remember lessons.", "I completely disagree with this opinion because homework helps students remember their lessons.", "I strongly disagree with this view because homework helps students remember lessons."] },
        { q: "Tôi đồng ý một phần vì dù du lịch có lợi, sách cũng có thể dạy chúng ta về các nền văn hoá khác.", hint: "I partly agree, because while, travelling is beneficial, books can also teach us about other cultures", answers: ["I partly agree because while travelling is beneficial, books can also teach us about other cultures.", "I partly agree because while traveling is beneficial, books can also teach us about other cultures.", "I partially agree because while travelling is beneficial, books can also teach us about other cultures.", "I partially agree because while traveling is beneficial, books can also teach us about other cultures.", "I partly agree because although travelling is beneficial, books can also teach us about other cultures.", "I partly agree because although traveling is beneficial, books can also teach us about other cultures.", "I partly agree because while travel is beneficial, books can also teach us about other cultures."] },
      ],
    },

    { t: "h", text: "5. Lỗi hay gặp và danh sách rà soát" },
    {
      t: "note",
      title: "Người Việt hay sai khi viết mở bài",
      items: [
        "~~I am agree.~~ → **I agree.** (agree là động từ, không dùng với am/is/are).",
        "~~In my opinion, I think…~~ → chọn **một**: “In my opinion, …” **hoặc** “I think…”. Viết cả hai là lặp ý.",
        "~~According to me,…~~ → **In my view,…** (according to dùng cho người/nguồn khác: according to experts).",
        "Mở bài bằng câu chung chung học thuộc: ~~Nowadays, with the development of society, this is a hot topic.~~ Câu này không nói gì về đề và giám khảo nhận ra ngay là câu học thuộc.",
        "**Không nêu quan điểm** (“There are many different opinions about this issue.”) hoặc nêu nhưng **thân bài lại nói ngược**. Đề Opinion mà thiếu quan điểm rõ ràng thì tiêu chí Task Response khó vượt band 5.",
        "Paraphrase **đổi mất nghĩa**: đề nói “teenagers” mà viết ~~children~~ (trẻ em nhỏ) là đổi đối tượng; đề nói “only brings disadvantages” mà viết ~~has some disadvantages~~ là làm yếu ý.",
      ],
    },
    {
      t: "table",
      caption: "Bước 5 — danh sách rà soát 1 phút",
      head: ["Kiểm tra", "Câu hỏi tự đặt"],
      rows: [
        ["Nghĩa", "Câu paraphrase có **giữ đúng** chủ đề, đối tượng và ý kiến của đề không?"],
        ["Quan điểm", "Người đọc có biết ngay tôi **đồng ý hay không** sau câu 2 không?"],
        ["Lý do", "Tôi có nêu **1–2 lý do** và chúng có khớp với **hai đoạn thân bài** định viết không?"],
        ["Ngữ pháp", "Chủ ngữ số ít → động từ thêm **-s**? Sau **because** là một **mệnh đề** (S + V)? Sau **let / make / help + O** là **V nguyên mẫu**?"],
        ["Dấu câu, chính tả", "Mỗi câu một dấu chấm; có dấu phẩy trước **whereas / while** khi nối hai vế? Không sai chính tả từ lấy từ đề?"],
      ],
    },

    { t: "h", text: "6. Mở bài mẫu và dàn ý cả bài (phần thêm)" },
    {
      t: "p",
      text: "Sách mới dạy mở bài. Để bạn thấy mở bài **dẫn đường** cho cả bài ra sao, đây là dàn ý và bài mẫu khoảng 270 từ cho đề ở **Ví dụ 1**. Để ý: **hai lý do trong thesis = hai đoạn thân bài**.",
    },
    {
      t: "table",
      caption: "Dàn ý bài Opinion 4 đoạn",
      head: ["Đoạn", "Nội dung", "Câu chủ đề / câu khung"],
      rows: [
        ["Introduction", "Paraphrase + thesis (2 lý do)", "Some people argue that… I believe that online study is more beneficial because it saves travel time and lets students learn at their own pace."],
        ["Body 1", "Lý do 1: tiết kiệm thời gian đi lại → giải thích → ví dụ", "**Firstly**, studying online saves students a great deal of time."],
        ["Body 2", "Lý do 2: tự học theo tốc độ của mình → giải thích → ví dụ", "**Secondly**, online courses allow learners to study at their own speed."],
        ["Conclusion", "Nhắc lại quan điểm + 2 lý do (bằng lời khác), có thể thêm một ý nhượng bộ ngắn", "**In conclusion**, although online learning is not perfect, I believe its advantages outweigh its drawbacks…"],
      ],
    },
    {
      t: "examples",
      items: [
        { en: "[Introduction] Some people argue that learning over the internet offers university students more advantages, whereas others feel that it does more harm than good. I believe that online study is more beneficial because it saves travel time and lets students learn at their own pace.", vi: "[Mở bài] Một số người lập luận rằng học qua internet mang lại cho sinh viên nhiều lợi thế hơn, trong khi những người khác cảm thấy nó hại nhiều hơn lợi. Tôi tin rằng học trực tuyến có lợi hơn vì nó tiết kiệm thời gian đi lại và cho phép sinh viên học theo tốc độ của riêng mình." },
        { en: "[Body 1] Firstly, studying online saves students a great deal of time. In big cities such as Hanoi, a trip to campus can take more than an hour because of traffic jams. When lectures are online, students can use this time to review their notes, do a part-time job or simply rest. As a result, they often feel less tired and can concentrate better in class.", vi: "[Thân bài 1] Thứ nhất, học trực tuyến giúp sinh viên tiết kiệm rất nhiều thời gian. Ở các thành phố lớn như Hà Nội, một chuyến đến trường có thể mất hơn một giờ vì tắc đường. Khi bài giảng diễn ra trực tuyến, sinh viên có thể dùng thời gian này để ôn bài, làm thêm hoặc đơn giản là nghỉ ngơi. Nhờ vậy, họ thường bớt mệt và tập trung tốt hơn trong giờ học." },
        { en: "[Body 2] Secondly, online courses allow learners to study at their own speed. A recorded lecture can be paused, replayed or watched again before an exam, which is especially helpful for students who find a subject difficult. For example, a first-year student who struggles with mathematics can watch the same explanation three times until it makes sense, something that is impossible in a crowded lecture hall.", vi: "[Thân bài 2] Thứ hai, các khoá học trực tuyến cho phép người học học theo tốc độ riêng. Một bài giảng ghi hình có thể tạm dừng, tua lại hoặc xem lại trước kỳ thi, điều này đặc biệt có ích với sinh viên thấy môn học khó. Ví dụ, một sinh viên năm nhất gặp khó với môn toán có thể xem lại cùng một phần giảng ba lần cho đến khi hiểu, điều không thể làm trong một giảng đường đông đúc." },
        { en: "[Conclusion] In conclusion, although studying online can feel lonely at times, I believe its advantages clearly outweigh its drawbacks. It saves students valuable time and gives them control over how fast they learn, so universities should continue to offer it.", vi: "[Kết bài] Tóm lại, dù học trực tuyến đôi khi khiến người học thấy cô đơn, tôi tin rằng lợi ích của nó rõ ràng lớn hơn bất lợi. Nó giúp sinh viên tiết kiệm thời gian quý báu và cho họ quyền kiểm soát tốc độ học, vì vậy các trường đại học nên tiếp tục cung cấp hình thức này." },
      ],
    },
    {
      t: "note",
      title: "Ghi nhớ: vì sao bài mẫu mạch lạc",
      items: [
        "Mỗi đoạn thân bài mở bằng **câu chủ đề** lặp lại đúng **một lý do** trong thesis (**Firstly… / Secondly…**).",
        "Mỗi đoạn có đủ 3 phần: **ý chính → giải thích → ví dụ** (Hanoi traffic, a first-year student).",
        "Kết bài **không đưa ý mới**, chỉ nhắc lại quan điểm và hai lý do bằng từ khác (saves time → saves valuable time; own pace → control over how fast they learn).",
      ],
    },
    {
      t: "mcq",
      id: "d6-viet-nhanh",
      title: "Kiểm tra nhanh — mở bài Opinion (4 câu)",
      items: [
        {
          q: "Đề: “Children should learn a foreign language at primary school. Do you agree or disagree?” Câu nào là **paraphrase** tốt nhất?",
          options: [
            "Children should learn a foreign language at primary school.",
            "Many people think that young pupils ought to study a second language from an early age.",
            "Nowadays, learning languages is a hot topic in society.",
          ],
          correct: 1,
          why: "Câu 2 giữ đúng nghĩa và đổi từ (children → young pupils, should → ought to, foreign → second). Câu 1 chép nguyên đề; câu 3 là câu chung chung học thuộc, không nói gì về đề.",
        },
        {
          q: "Câu nào là **thesis statement** đúng?",
          options: [
            "There are many different opinions about this issue.",
            "I am agree because it is good.",
            "I agree because young children pick up pronunciation easily and it opens more opportunities later.",
          ],
          correct: 2,
          why: "Thesis phải có **quan điểm rõ** + **lý do cụ thể**. Câu 1 không có quan điểm; câu 2 sai ngữ pháp (~~am agree~~) và lý do quá chung (“it is good”).",
        },
        {
          q: "Trong mở bài, câu paraphrase và câu thesis sắp xếp thế nào?",
          options: ["Thesis trước, paraphrase sau", "Paraphrase trước, thesis sau", "Chỉ cần thesis"],
          correct: 1,
          why: "Bước 4 (Ghép): **paraphrase trước** để giới thiệu vấn đề, **thesis sau** để nêu quan điểm.",
        },
        {
          q: "Hai lý do trong thesis sẽ trở thành gì trong bài?",
          options: ["Kết bài", "Hai đoạn thân bài", "Không dùng lại nữa"],
          correct: 1,
          why: "Mỗi lý do được phát triển thành **một đoạn thân bài**. Vì thế hãy chọn lý do mà bạn viết tiếp được.",
        },
      ],
    },

    { t: "h", text: "7. Tự viết" },
    {
      t: "essay",
      id: "d6-viet-bai",
      task: "Task 2",
      prompt: "Some people believe that having a part-time job while at university is more beneficial for students, while others think it only harms their studies. To what extent do you agree or disagree? Give reasons for your answer and include any relevant examples from your own knowledge or experience. Write at least 250 words.",
      minWords: 250,
      tips: [
        "Làm đủ 5 bước cho mở bài: đọc đề → paraphrase → thesis → ghép → rà soát. Viết mở bài trước, soát xong rồi mới viết thân bài.",
        "Paraphrase gợi ý: part-time job → **working a few hours a week**; beneficial → **offers more advantages**; only harms their studies → **does more harm than good to their education**.",
        "Thesis: chọn một phía và **2 lý do** (ví dụ: kinh nghiệm làm việc, tự lo chi phí / hoặc mất thời gian học, mệt mỏi).",
        "Theo dàn ý 4 đoạn ở mục 6: Body 1 = lý do 1, Body 2 = lý do 2, mỗi đoạn có ví dụ.",
        "Kết bài bắt đầu bằng **In conclusion,** và nhắc lại quan điểm bằng từ khác.",
      ],
    },
  ],
};

/* ─────────────────────────── Speaking ─────────────────────────── */

const D6_SPEAKING: Lesson = {
  id: "d6-noi",
  kind: "speaking",
  title: "Nói: Trả lời câu hỏi Wh- (Part 1 · Thói quen hằng ngày, Gia đình)",
  goal: "Trả lời câu hỏi What/Where/When/Why/Who/How ở Speaking Part 1 bằng 2–3 câu theo công thức (trả lời thẳng + chi tiết + lợi ích/cảm xúc) về thói quen hằng ngày và gia đình, và phát âm đúng 8 nhị trùng âm.",
  minutes: 50,
  blocks: [
    {
      t: "recap",
      title: "Bài này học gì",
      items: [
        "Câu hỏi **Wh-** (What, Where, When, Why, Who, How) **không trả lời Yes/No** — giám khảo cần **thông tin**.",
        "Công thức 3 câu: ==trả lời thẳng== → ==thêm 1 chi tiết (I usually…)== → ==lợi ích / cảm xúc (This helps me… / This makes me feel…)==.",
        "Thói quen → **hiện tại đơn**; nhớ **-s** ngôi thứ ba (*My mother live**s**…*).",
        "Hai chủ đề của sách: **Daily Routine** (6 câu hỏi) và **Family** (2 câu hỏi).",
        "Phát âm: **8 nhị trùng âm** /eɪ aɪ ɔɪ aʊ əʊ ɪə eə ʊə/ — miệng **trượt** từ âm đầu sang âm sau.",
      ],
    },
    { t: "h", text: "1. Câu hỏi Wh- là gì?" },
    {
      t: "p",
      text: "Ở Ngày 4 bạn đã học câu hỏi **Yes/No**. Hôm nay là câu hỏi **Wh-**: câu hỏi bắt đầu bằng **What, Where, When, Why, Who, How**. Loại câu này **không trả lời Yes/No được**; giám khảo muốn bạn đưa **thông tin**: làm gì, ở đâu, khi nào, vì sao, với ai, bằng cách nào.",
    },
    {
      t: "table",
      head: ["Từ hỏi", "Hỏi về", "Câu trả lời cần có", "Ví dụ mở đầu"],
      rows: [
        ["**What**", "cái gì, việc gì", "một **hoạt động / sự vật**", "I usually **do some stretching**."],
        ["**Where**", "ở đâu", "một **nơi chốn** (in / at / to…)", "I usually study **at the library**."],
        ["**When**", "khi nào", "một **thời điểm** (at 7 a.m. / on Sundays / in the evening)", "I go to bed **at around eleven**."],
        ["**Why**", "vì sao", "một **lý do** (because / since / it helps me…)", "**Because** it helps me relax."],
        ["**Who**", "ai", "một **người** (with my…)", "I spend most of my time **with my mum**."],
        ["**How**", "bằng cách nào, thế nào", "một **cách thức** (by + V-ing) hoặc mức độ", "I stay healthy **by cycling to school**."],
      ],
    },
    {
      t: "note",
      title: "Mẹo: nhận ra các biến thể của How (phần thêm)",
      items: [
        "**How often…?** → hỏi **mức độ thường xuyên**: every day, twice a week, once a month.",
        "**How long…?** → hỏi **bao lâu**: for two hours, for about three years.",
        "**How do you spend…?** → hỏi bạn **dùng thời gian làm gì**: I spend my weekends + V-ing…",
      ],
    },
    {
      t: "patterns",
      rows: [
        {
          formula: "Wh- + do / does + S + V?",
          vi: "Câu hỏi Wh- ở hiện tại đơn (giám khảo hay dùng nhất ở Part 1). Chủ ngữ he / she / it / danh từ số ít → does.",
          examples: [
            { en: "Where do you usually study?", vi: "Bạn thường học ở đâu?" },
            { en: "What does your father do?", vi: "Bố bạn làm nghề gì?" },
          ],
        },
        {
          formula: "Wh- + am / is / are + S + …?",
          vi: "Câu hỏi Wh- với động từ to be (hỏi tính chất, trạng thái).",
          examples: [
            { en: "Who is the most important person in your family?", vi: "Ai là người quan trọng nhất trong gia đình bạn?" },
          ],
        },
        {
          formula: "S + V(s/es) + [thông tin Wh-]. · S + usually + V + [chi tiết]. · This helps me + V / This makes me feel + adj.",
          vi: "Câu trả lời: nhắc lại động từ của câu hỏi ở hiện tại đơn, thêm đúng loại thông tin mà từ Wh- hỏi.",
          examples: [
            { en: "I usually study in the library. It is quiet there. This helps me concentrate.", vi: "Tôi thường học ở thư viện. Ở đó yên tĩnh. Điều này giúp tôi tập trung." },
          ],
        },
      ],
    },
    {
      t: "rule",
      formula: "Hỏi: Wh- + do / does + S + V? → Đáp: S + V(s/es) + [thông tin] + 1 chi tiết + This helps me + V.",
      vi: "What → việc · Where → nơi · When → thời gian · Why → because… · Who → người · How → by + V-ing / cách thức.",
    },
    {
      t: "quiz",
      id: "d6-noi-dich",
      title: "Dịch sang tiếng Anh — hỏi và trả lời câu Wh- (5 câu)",
      kind: "translate",
      grammar: "Wh- + do / does + S + V? · Trả lời bằng hiện tại đơn: I / We + V; He / She / My mother + V-s. This helps me + V nguyên mẫu · This makes me feel + tính từ · I stay healthy by + V-ing.",
      items: [
        { q: "Bạn thường làm gì vào buổi sáng?", hint: "What, do you usually do, in the morning", answers: ["What do you usually do in the morning?", "What do you usually do in the mornings?"] },
        { q: "Gia đình tôi sống ở Huế.", hint: "My family (members), live, in Hue (thành phố → in)", answers: ["My family lives in Hue.", "My family live in Hue.", "My family members live in Hue."] },
        { q: "Tôi giữ sức khoẻ bằng cách đạp xe đi học.", hint: "I stay healthy, by + V-ing (cycling), to school", answers: ["I stay healthy by cycling to school.", "I keep healthy by cycling to school.", "I stay healthy by riding my bike to school.", "I stay healthy by riding a bike to school.", "I keep fit by cycling to school."] },
        { q: "Tôi thường đi ngủ lúc mười giờ. Điều này giúp tôi ngủ ngon hơn.", hint: "usually go to bed, at ten; This helps me + V nguyên mẫu (sleep better)", answers: ["I usually go to bed at ten. This helps me sleep better.", "I usually go to bed at 10 p.m. This helps me sleep better.", "I usually go to bed at ten o'clock. This helps me sleep better.", "I usually go to bed at 10. This helps me sleep better.", "I usually go to bed at ten. This helps me to sleep better.", "I usually go to bed at 10 pm. This helps me sleep better."] },
        { q: "Mẹ tôi dành phần lớn thời gian với bà tôi. Điều đó khiến bà thấy hạnh phúc.", hint: "My mother (số ít → spends), most of her time, with my grandmother; This makes her feel + adj", answers: ["My mother spends most of her time with my grandmother. This makes her feel happy.", "My mum spends most of her time with my grandmother. This makes her feel happy.", "My mom spends most of her time with my grandmother. This makes her feel happy.", "My mother spends most of her time with my grandmother. It makes her feel happy.", "My mother spends most of her time with my grandma. This makes her feel happy.", "My mother spends most of her time with my grandmother. That makes her feel happy."] },
      ],
    },

    { t: "h", text: "2. Cách trả lời: 5 bước" },
    {
      t: "p",
      text: "Sách đưa ra 5 bước cho mục tiêu band 4.0. Bảng dưới giữ đủ 5 bước, ví dụ viết mới.",
    },
    {
      t: "table",
      head: ["Bước", "Làm gì", "Ví dụ"],
      rows: [
        ["1. Hiểu câu hỏi", "Nghe ra **từ Wh-** và **nội dung** câu hỏi.", "“**Where** do you usually **study**?” → hỏi **nơi chốn**, về việc **học**."],
        ["2. Trả lời ngắn gọn", "Bắt đầu bằng **một câu trả lời đơn giản, trực tiếp**.", "What: “I like **cooking**.” · Where: “I usually study **in my bedroom**.”"],
        ["3. Thêm một chút chi tiết", "Nói thêm **1–2 câu** để giải thích hoặc cho thêm thông tin.", "“Cooking helps me **forget about stress** and I can make food for my family.”"],
        ["4. Dùng ngữ pháp, từ vựng đơn giản", "Tránh cấu trúc phức tạp. Dùng **hiện tại đơn** cho thói quen và sự thật.", "“**On Sundays, I visit** my grandparents.”"],
        ["5. Luyện phát âm", "Nói **to, rõ**. Ghi âm rồi nghe lại để sửa.", "Dùng khối 🎙️ **Luyện nói** ở cuối bài: ghi âm → nghe lại → AI chấm."],
      ],
    },
    {
      t: "note",
      title: "Người Việt hay sai khi trả lời câu hỏi Wh-",
      items: [
        "Nghe nhầm từ hỏi: câu hỏi **When** (khi nào) mà trả lời nơi chốn. Nghe không rõ thì hỏi lại: **“Sorry, could you repeat the question?”** — không bị trừ điểm.",
        "Quên **-s** với ngôi thứ ba: ~~My mother live in Hue.~~ → **My mother lives in Hue.**",
        "Dùng sai thì: ~~I usually waking up at six.~~ / ~~I usually woke up…~~ → **I usually wake up at six.** (usually + hiện tại đơn).",
        "Sai giới từ thời gian: **at** + giờ (at 6 a.m.), **on** + thứ (on Sundays), **in** + buổi (in the morning). Nhưng: **at night**, **at the weekend** (Anh) / **on the weekend** (Mỹ).",
        "~~I spend time for my family.~~ → **I spend time with my family.** · ~~They live at Hanoi.~~ → **They live in Hanoi.** (thành phố, quốc gia dùng **in**).",
        "Chỉ nói một câu cụt ~~Because it's fun.~~ rồi dừng. Câu Why vẫn cần thêm **chi tiết** (bước 3).",
      ],
    },

    { t: "h", text: "3. Chủ đề Daily Routine — công thức trả lời" },
    {
      t: "p",
      text: "Hai câu hỏi mở đầu chủ đề trong sách: **“What do you usually do in the morning?”** và **“How do you spend your weekends?”**. Bảng dưới là **công thức 3 câu** cho từng câu hỏi Wh- của chủ đề này. Câu trả lời mẫu (viết mới) ở phần hội thoại ngay sau bảng — bấm 🔊 để nghe.",
    },
    {
      t: "table",
      head: ["Câu hỏi", "Công thức trả lời"],
      rows: [
        ["**What** do you usually do in the morning?", "1. I [thói quen / hoạt động]. · 2. I usually [thêm chi tiết]. · 3. This helps me [lợi ích]."],
        ["**How** do you stay healthy?", "1. I [hoạt động giữ sức khoẻ]. · 2. I usually [thêm chi tiết]. · 3. This helps me [lợi ích]."],
        ["**Where** do you like to go on holiday?", "1. I like to go to [địa điểm]. · 2. I usually [thêm chi tiết]. · 3. I enjoy [lợi ích]."],
        ["**When** do you usually go to bed?", "1. I usually go to bed at [thời gian]. · 2. I [thêm chi tiết]. · 3. This helps me [lợi ích]."],
        ["**Why** do you like your favourite hobby?", "1. I love [sở thích]. · 2. I usually [thêm chi tiết]. · 3. This helps me [lợi ích]."],
        ["**Who** do you spend time with at the weekend?", "1. I spend time with [người]. · 2. We usually [thêm chi tiết]. · 3. This makes me feel [cảm xúc]."],
      ],
    },
    {
      t: "dialogue",
      title: "Daily Routine — câu trả lời mẫu band 4.0",
      lines: [
        { who: "Examiner", role: "examiner", text: "What do you usually do in the morning?" },
        { who: "Candidate", role: "candidate", text: "I get up at half past five. I usually water the plants on the balcony and then cook some noodles for breakfast. This helps me feel calm before school.", vi: "Tôi dậy lúc năm rưỡi. Tôi thường tưới cây ngoài ban công rồi nấu mì ăn sáng. Việc này giúp tôi thấy bình tĩnh trước khi đi học." },
        { who: "Examiner", role: "examiner", text: "How do you stay healthy?" },
        { who: "Candidate", role: "candidate", text: "I stay healthy by cycling to school. I usually ride about four kilometres every day, and I drink a lot of water. This helps me keep fit without paying for a gym.", vi: "Tôi giữ sức khoẻ bằng cách đạp xe đi học. Tôi thường đạp khoảng bốn cây số mỗi ngày và uống nhiều nước. Việc này giúp tôi khoẻ mà không phải trả tiền phòng tập." },
        { who: "Examiner", role: "examiner", text: "Where do you like to go on holiday?" },
        { who: "Candidate", role: "candidate", text: "I like to go to the mountains, for example Sa Pa. I usually walk around the villages and take photos of the rice terraces. I enjoy the cool air and the quiet.", vi: "Tôi thích lên vùng núi, ví dụ Sa Pa. Tôi thường đi dạo quanh các bản làng và chụp ảnh ruộng bậc thang. Tôi thích không khí mát và sự yên tĩnh." },
        { who: "Examiner", role: "examiner", text: "When do you usually go to bed?" },
        { who: "Candidate", role: "candidate", text: "I usually go to bed at about eleven. I listen to some soft music for a few minutes first. This helps me fall asleep quickly.", vi: "Tôi thường đi ngủ khoảng mười một giờ. Tôi nghe nhạc nhẹ vài phút trước đã. Việc này giúp tôi ngủ nhanh." },
        { who: "Examiner", role: "examiner", text: "Why do you like your favourite hobby?" },
        { who: "Candidate", role: "candidate", text: "I love drawing because it is relaxing. I usually draw cartoon characters in a small notebook. This helps me forget about my exams for a while.", vi: "Tôi thích vẽ vì nó giúp thư giãn. Tôi thường vẽ nhân vật hoạt hình vào một cuốn sổ nhỏ. Việc này giúp tôi quên chuyện thi cử một lúc." },
        { who: "Examiner", role: "examiner", text: "Who do you spend time with at the weekend?" },
        { who: "Candidate", role: "candidate", text: "At the weekend, I spend time with my best friend, Lan. We usually play badminton in the park and then eat banh mi. This makes me feel happy and relaxed.", vi: "Cuối tuần, tôi dành thời gian với bạn thân tên Lan. Chúng tôi thường chơi cầu lông ở công viên rồi ăn bánh mì. Điều đó khiến tôi thấy vui và thoải mái." },
      ],
    },

    { t: "h", text: "4. Chủ đề Family — công thức trả lời" },
    {
      t: "p",
      text: "Hai câu hỏi của chủ đề trong sách: **“Who do you spend most of your time with?”** và **“Where do your family members live?”**.",
    },
    {
      t: "table",
      head: ["Câu hỏi", "Công thức trả lời"],
      rows: [
        ["**Who** do you spend most of your time with?", "1. I spend most of my time with [người]. · 2. We usually [thêm chi tiết]. · 3. This makes me feel [cảm xúc]."],
        ["**Where** do your family members live?", "1. My family members live in [địa điểm]. · 2. I usually [thêm chi tiết]. · 3. I enjoy [lợi ích]."],
      ],
    },
    {
      t: "dialogue",
      title: "Family — câu trả lời mẫu band 4.0",
      lines: [
        { who: "Examiner", role: "examiner", text: "Who do you spend most of your time with?" },
        { who: "Candidate", role: "candidate", text: "I spend most of my time with my grandmother. We usually cook dinner together and watch the news in the evening. This makes me feel safe and loved.", vi: "Tôi dành phần lớn thời gian với bà. Chúng tôi thường cùng nấu bữa tối và xem thời sự buổi tối. Điều đó khiến tôi thấy an toàn và được yêu thương." },
        { who: "Examiner", role: "examiner", text: "Where do your family members live?" },
        { who: "Candidate", role: "candidate", text: "My family members live in Can Tho, in the Mekong Delta. I usually go back there during the summer holiday. I enjoy eating my mother's food and visiting the floating market.", vi: "Gia đình tôi sống ở Cần Thơ, miền Tây. Tôi thường về đó vào kỳ nghỉ hè. Tôi thích ăn đồ mẹ nấu và đi chợ nổi." },
      ],
    },
    {
      t: "note",
      title: "Cẩn thận: vài chỗ trong công thức",
      items: [
        "Sách có câu hỏi “Why do you like your **favorite** hobby?” (chính tả Mỹ). Chính tả Anh là **favourite**; trong thi viết kiểu nào cũng được, miễn **nhất quán**.",
        "Câu “**Where** do you like to go on holiday?” → “I like to go **to** the mountains” (**go to** + nơi chốn). Nhưng **go home**, **go abroad**, **go shopping** không có to.",
        "**This helps me + V nguyên mẫu** (helps me **sleep**), không phải ~~helps me sleeping~~. **This makes me feel + tính từ** (makes me feel **happy**), không phải ~~makes me to feel~~.",
        "“**I enjoy** + danh từ / V-ing”: I enjoy **the cool air** / I enjoy **eating**… — không phải ~~I enjoy to eat~~.",
      ],
    },

    { t: "h", text: "5. Nâng lên band 6 (phần sách chưa có)" },
    {
      t: "p",
      text: "Công thức 3 câu giúp bạn **không bị cứng họng**, nhưng nếu câu nào cũng “This helps me…” thì giám khảo sẽ thấy bạn **nói theo khuôn**. Muốn lên band 6, giữ đúng khung nhưng: **đổi cách mở đầu**, thêm **chi tiết cụ thể** (con số, tên riêng), dùng **từ nối** và vài **cụm từ tự nhiên**.",
    },
    {
      t: "dialogue",
      title: "Hai câu trả lời nâng cấp band 6",
      lines: [
        { who: "Examiner", role: "examiner", text: "What do you usually do in the morning?" },
        { who: "Candidate", role: "candidate", text: "Well, I'm definitely an early bird, so I'm up by half past five most days. The first thing I do is water the plants on our balcony, and then I make myself a quick bowl of noodles. Having a slow start like that puts me in a good mood before the rush of school.", vi: "À, tôi đúng là người dậy sớm, nên hầu như ngày nào năm rưỡi tôi cũng dậy rồi. Việc đầu tiên tôi làm là tưới cây ngoài ban công, rồi tự nấu nhanh một bát mì. Bắt đầu ngày chậm rãi như vậy giúp tôi có tâm trạng tốt trước khi lao vào nhịp học vội vã." },
        { who: "Examiner", role: "examiner", text: "Who do you spend most of your time with?" },
        { who: "Candidate", role: "candidate", text: "That would be my grandmother, since my parents often work late. We're really close — we cook dinner together almost every evening, and she tells me stories about what our town was like when she was young. I think those evenings are the best part of my day.", vi: "Chắc là bà tôi, vì bố mẹ tôi hay làm về muộn. Hai bà cháu rất thân — gần như tối nào cũng cùng nấu cơm, và bà kể cho tôi nghe thị trấn mình ngày xưa thế nào khi bà còn trẻ. Tôi nghĩ những buổi tối đó là khoảng thời gian tuyệt nhất trong ngày." },
      ],
    },
    {
      t: "note",
      title: "Ghi nhớ: vì sao hai câu trên lên được band 6",
      items: [
        "**Mở đầu tự nhiên**: Well, … / That would be… thay cho lặp lại nguyên câu hỏi.",
        "**Cụm từ tự nhiên**: an early bird (người dậy sớm), be up (đã dậy), put me in a good mood (làm tôi vui), the rush of school, we're really close (rất thân).",
        "**Từ nối và câu phức**: so, since, and then, when she was young — nhưng vẫn chỉ **3 câu, khoảng 20–25 giây**.",
        "Lợi ích/cảm xúc được nói **bằng cách khác** thay cho “This helps me / This makes me feel” lặp đi lặp lại.",
      ],
    },

    { t: "h", text: "6. Phát âm: 8 nhị trùng âm (diphthongs)" },
    {
      t: "p",
      text: "**Nhị trùng âm** (diphthong) là nguyên âm **ghép từ hai âm**, đọc **trong cùng một âm tiết**: miệng bắt đầu ở âm thứ nhất rồi **trượt liền** sang âm thứ hai, không ngắt. Ví dụ **boy** /bɔɪ/: bắt đầu bằng /ɔ/ (gần âm trong **saw**) rồi trượt sang /ɪ/ (âm trong **sit**). Âm đầu **dài và rõ hơn**, âm sau **nhẹ và ngắn**.",
    },
    {
      t: "table",
      head: ["Âm", "Trượt từ → tới", "Gần giống tiếng Việt", "Ví dụ thêm", "Từ trong sách"],
      rows: [
        ["/eɪ/", "/e/ → /ɪ/", "“ây” (đầu âm mở như “ê”)", "day (ngày), rain (mưa), table (cái bàn)", "say, pay, day"],
        ["/aɪ/", "/a/ → /ɪ/", "“ai”", "time (thời gian), light (ánh sáng), buy (mua)", "my, like, fly"],
        ["/ɔɪ/", "/ɔ/ → /ɪ/", "“oi”", "boy (cậu bé), coin (đồng xu), noise (tiếng ồn)", "boy, toy, enjoy"],
        ["/aʊ/", "/a/ → /ʊ/", "“ao”", "house (ngôi nhà), town (thị trấn), loud (to, ồn)", "now, how, cow"],
        ["/əʊ/", "/ə/ → /ʊ/", "“âu” (giọng Anh); giọng Mỹ /oʊ/ gần “ôu”", "home (nhà), road (con đường), phone (điện thoại)", "go, know, show"],
        ["/ɪə/", "/ɪ/ → /ə/", "“ia” (như trong “kia”)", "ear (tai), idea (ý tưởng), beer (bia)", "here, near, fear"],
        ["/eə/", "/e/ → /ə/", "“e-ơ” đọc liền (gần “ea”)", "chair (cái ghế), where (ở đâu), bear (con gấu)", "there, care, hair"],
        ["/ʊə/", "/ʊ/ → /ə/", "“ua” (như trong “cua”)", "tour (chuyến tham quan), pure (tinh khiết), cure (chữa khỏi)", "tour, sure"],
      ],
    },
    {
      t: "p",
      text: "Bấm 🔊 để nghe từng nhóm và đọc to theo 3 lần. Ba từ trong cùng một dòng có **cùng một nhị trùng âm**. Cột **Từ trong sách** giữ đủ ví dụ của sách; hai dòng cuối dưới đây đọc liền các từ đó.",
    },
    {
      t: "examples",
      items: [
        { en: "day, rain, table", vi: "/eɪ/" },
        { en: "time, light, buy", vi: "/aɪ/" },
        { en: "boy, coin, noise", vi: "/ɔɪ/" },
        { en: "house, town, loud", vi: "/aʊ/" },
        { en: "home, road, phone", vi: "/əʊ/" },
        { en: "ear, idea, beer", vi: "/ɪə/" },
        { en: "chair, where, bear", vi: "/eə/" },
        { en: "tour, pure, cure", vi: "/ʊə/" },
        { en: "say, pay, day · my, like, fly · boy, toy, enjoy · now, how, cow", vi: "Từ trong sách: /eɪ/ · /aɪ/ · /ɔɪ/ · /aʊ/" },
        { en: "go, know, show · here, near, fear · there, care, hair · tour, sure", vi: "Từ trong sách: /əʊ/ · /ɪə/ · /eə/ · /ʊə/" },
      ],
    },
    {
      t: "note",
      title: "Những lỗi người Việt hay mắc với nhị trùng âm (phần thêm)",
      items: [
        "Đọc thành **nguyên âm đơn**, bỏ mất phần trượt: **home** đọc ~~“hôm”~~, **phone** đọc ~~“phôn”~~ → phải trượt /həʊm/, /fəʊn/. **late** đọc ~~“lét”~~ → /leɪt/ (có “i” nhẹ ở cuối).",
        "**Nuốt phụ âm cuối** sau nhị trùng âm: **time** /taɪm/ phải khép môi ở /m/, **light** /laɪt/ phải chặn lưỡi ở /t/. Bỏ phụ âm cuối thì **time**, **tie**, **Thai** nghe giống nhau.",
        "Cặp dễ nhầm: **/eɪ/ – /e/**: late – let, pain – pen, sale – sell. **/əʊ/ – /ɒ/**: coat – cot, road – rod.",
        "**sure** và **tour**: sách xếp vào /ʊə/, nhưng nhiều người Anh ngày nay đọc /ʃɔː/, /tɔː/. Cả hai cách đều được chấp nhận trong thi. **where** và **wear** đọc giống nhau /weə/.",
      ],
    },
    {
      t: "examples",
      items: [
        { en: "late — let", vi: "/eɪ/ · /e/" },
        { en: "coat — cot", vi: "/əʊ/ · /ɒ/" },
        { en: "time — tie", vi: "/aɪm/ · /aɪ/ — giữ âm /m/ cuối" },
        { en: "here — hair", vi: "/ɪə/ · /eə/" },
      ],
    },

    {
      t: "phatam",
      id: "d6-phat-am",
      title: "Luyện phát âm — máy chấm 8 nhị trùng âm",
      note: "Bấm “Nghe mẫu”, rồi “Đọc & chấm” và đọc to đúng dòng đó. Nhị trùng âm phải TRƯỢT từ âm đầu sang âm sau; đọc thành một âm đơn (home → “hôm”) là máy chấm đỏ. Giữ cả phụ âm cuối (time, light).",
      items: [
        { text: "day, rain, table", ipa: "deɪ reɪn teɪbl", vi: "/eɪ/" },
        { text: "time, light, buy", ipa: "taɪm laɪt baɪ", vi: "/aɪ/ — giữ /m/, /t/ cuối" },
        { text: "boy, coin, noise", ipa: "bɔɪ kɔɪn nɔɪz", vi: "/ɔɪ/" },
        { text: "house, town, loud", ipa: "haʊs taʊn laʊd", vi: "/aʊ/" },
        { text: "home, road, phone", ipa: "həʊm rəʊd fəʊn", vi: "/əʊ/ — không đọc “hôm”, “phôn”" },
        { text: "ear, idea, beer", ipa: "ɪə aɪdɪə bɪə", vi: "/ɪə/" },
        { text: "chair, where, bear", ipa: "tʃeə weə beə", vi: "/eə/" },
        { text: "tour, pure, cure", ipa: "tʊə pjʊə kjʊə", vi: "/ʊə/" },
        { text: "late, let", ipa: "leɪt let", vi: "/eɪ/ · /e/" },
        { text: "coat, cot", ipa: "kəʊt kɒt", vi: "/əʊ/ · /ɒ/" },
        { text: "I go home by train every day.", ipa: "aɪ ɡəʊ həʊm baɪ treɪn evri deɪ", vi: "/aɪ/ /əʊ/ /eɪ/ trong một câu" },
        { text: "I know how to make a cake.", ipa: "aɪ nəʊ haʊ tə meɪk ə keɪk", vi: "/aɪ/ /əʊ/ /aʊ/ /eɪ/" },
      ],
    },

    { t: "h", text: "7. Luyện nói" },
    {
      t: "p",
      text: "Nghe từng câu hỏi Wh-, ghi âm câu trả lời theo công thức **trả lời thẳng + chi tiết + lợi ích/cảm xúc**, rồi để AI chấm. Nói 2–3 câu cho mỗi câu hỏi; chú ý đọc rõ các từ có nhị trùng âm (**home, day, time, house**).",
    },
    {
      t: "speak",
      id: "d6-noi-luyen",
      part: "1",
      questions: [
        "What do you usually do in the morning?",
        "How do you spend your weekends?",
        "When do you usually go to bed?",
        "Why do you like your favourite hobby?",
        "Who do you spend most of your time with?",
        "Where do your family members live?",
      ],
    },
  ],
};

/* ─────────────────────────── Homework ─────────────────────────── */

const D6_HOMEWORK: Lesson = {
  id: "d6-bai-tap",
  kind: "homework",
  title: "Bài tập Ngày 6",
  goal: "Hoàn thành mở bài cho 3 đề Opinion (điền 6 chỗ trống theo các bước paraphrase → thesis → ghép), rồi tự ghép câu thesis statement đúng thứ tự.",
  minutes: 30,
  blocks: [
    {
      t: "recap",
      title: "Bài tập hôm nay",
      items: [
        "3 đề Opinion, mỗi đề **2 chỗ trống** (cả bài **6**): một chỗ ở câu **paraphrase**, một chỗ ở câu **thesis**.",
        "Đoán **loại từ** trước khi điền: sau **to** → động từ nguyên mẫu; sau **is** → tính từ; sau **an essential / improve** → danh từ.",
        "Điền xong, đọc **mở bài hoàn chỉnh** (bước 3 — Ghép) để thấy paraphrase + thesis nối với nhau thế nào.",
        "Bài thêm: **ghép câu thesis** — tránh mảnh sai ~~am agree~~, ~~because of + mệnh đề~~.",
      ],
    },
    {
      t: "p",
      text: "Hãy điền vào chỗ trống để hoàn thành mở bài cho các đề sau. Chữ **in đậm** trong phần dịch tiếng Việt là **gợi ý nghĩa** của từ cần điền. Mỗi đề có **2 chỗ trống**, cả bài **6 chỗ trống**.",
    },

    { t: "h", text: "Đề 1" },
    {
      t: "p",
      text: "**Đề:** Some people think that cooking should be a compulsory subject at secondary school. Do you agree or disagree? — **Một số người cho rằng nấu ăn nên là môn học bắt buộc ở trường trung học. Bạn đồng ý hay không đồng ý?**",
    },
    {
      t: "table",
      head: ["Bước", "Ví dụ minh hoạ"],
      rows: [
        ["1. Paraphrase đề bài", "Some individuals believe that **(1) ______** should be required for all secondary school students. — *Một số cá nhân tin rằng **các giờ học nấu ăn** nên là bắt buộc với mọi học sinh trung học.*"],
        ["2. Viết thesis statement", "I agree with this opinion because cooking is an essential **(2) ______** and it helps teenagers eat more healthily. — *Tôi đồng ý với ý kiến này vì nấu ăn là một **kỹ năng sống** thiết yếu và nó giúp thanh thiếu niên ăn uống lành mạnh hơn.*"],
        ["3. Ghép mở bài", "(Ghép câu 1 và câu 2 sau khi điền — xem đáp án bên dưới.)"],
      ],
    },
    {
      t: "quiz",
      id: "d6-de-1",
      title: "Đề 1 — điền 2 chỗ trống (tối đa 2 từ mỗi chỗ)",
      kind: "fill",
      items: [
        { q: "(1) Some individuals believe that ___ should be required for all secondary school students.", answers: ["cooking lessons", "cooking classes"], hint: "các giờ học nấu ăn — cụm danh từ 2 từ, đứng làm chủ ngữ sau “that”" },
        { q: "(2) I agree with this opinion because cooking is an essential ___ and it helps teenagers eat more healthily.", answers: ["life skill"], hint: "kỹ năng sống — sau “an essential” cần danh từ số ít" },
      ],
    },

    { t: "h", text: "Đề 2" },
    {
      t: "p",
      text: "**Đề:** Many people believe that reading books is the best way to improve your vocabulary. To what extent do you agree or disagree? — **Nhiều người tin rằng đọc sách là cách tốt nhất để cải thiện vốn từ. Bạn đồng ý hay không đồng ý đến mức độ nào?**",
    },
    {
      t: "table",
      head: ["Bước", "Ví dụ minh hoạ"],
      rows: [
        ["1. Paraphrase đề bài", "Many individuals think that reading is the most effective way to **(3) ______** one's range of words. — *Nhiều cá nhân cho rằng đọc là cách hiệu quả nhất để **mở rộng** vốn từ của một người.*"],
        ["2. Viết thesis statement", "I partly agree because while reading is **(4) ______**, watching films and talking with others can also teach many new words. — *Tôi đồng ý một phần vì dù đọc sách rất **hữu ích**, xem phim và trò chuyện với người khác cũng có thể dạy nhiều từ mới.*"],
        ["3. Ghép mở bài", "(Ghép câu 1 và câu 2 sau khi điền — xem đáp án bên dưới.)"],
      ],
    },
    {
      t: "quiz",
      id: "d6-de-2",
      title: "Đề 2 — điền 2 chỗ trống (1 từ mỗi chỗ)",
      kind: "fill",
      items: [
        { q: "(3) Many individuals think that reading is the most effective way to ___ one's range of words.", answers: ["expand", "widen", "broaden"], hint: "mở rộng — sau “way to” cần động từ nguyên mẫu" },
        { q: "(4) I partly agree because while reading is ___, watching films and talking with others can also teach many new words.", answers: ["useful", "helpful"], hint: "hữu ích — sau “is” cần tính từ" },
      ],
    },

    { t: "h", text: "Đề 3" },
    {
      t: "p",
      text: "**Đề:** Some people believe that cities should build more parks instead of shopping centres. Do you agree or disagree? — **Một số người cho rằng các thành phố nên xây thêm công viên thay vì trung tâm mua sắm. Bạn đồng ý hay không đồng ý?**",
    },
    {
      t: "table",
      head: ["Bước", "Ví dụ minh hoạ"],
      rows: [
        ["1. Paraphrase đề bài", "Some individuals argue that local authorities need to **(5) ______** more green spaces rather than new malls. — *Một số cá nhân lập luận rằng chính quyền địa phương cần **tạo ra** thêm không gian xanh thay vì các trung tâm thương mại mới.*"],
        ["2. Viết thesis statement", "I agree because parks improve **(6) ______** and give people a free place to relax. — *Tôi đồng ý vì công viên cải thiện **chất lượng không khí** và cho mọi người một nơi thư giãn miễn phí.*"],
        ["3. Ghép mở bài", "(Ghép câu 1 và câu 2 sau khi điền — xem đáp án bên dưới.)"],
      ],
    },
    {
      t: "quiz",
      id: "d6-de-3",
      title: "Đề 3 — điền 2 chỗ trống (tối đa 2 từ mỗi chỗ)",
      kind: "fill",
      items: [
        { q: "(5) Some individuals argue that local authorities need to ___ more green spaces rather than new malls.", answers: ["create", "build", "provide"], hint: "tạo ra — sau “need to” cần động từ nguyên mẫu" },
        { q: "(6) I agree because parks improve ___ and give people a free place to relax.", answers: ["air quality", "the air quality"], hint: "chất lượng không khí — cụm danh từ 2 từ" },
      ],
    },
    {
      t: "note",
      title: "Bước 3 — mở bài hoàn chỉnh (xem sau khi làm)",
      items: [
        "**Đề 1:** Some individuals believe that cooking lessons should be required for all secondary school students. I agree with this opinion because cooking is an essential life skill and it helps teenagers eat more healthily.",
        "**Đề 2:** Many individuals think that reading is the most effective way to expand one's range of words. I partly agree because while reading is useful, watching films and talking with others can also teach many new words.",
        "**Đề 3:** Some individuals argue that local authorities need to create more green spaces rather than new malls. I agree because parks improve air quality and give people a free place to relax.",
      ],
    },
    {
      t: "note",
      title: "Mẹo: đoán từ loại trước khi điền",
      items: [
        "Sau **to** (way to, need to) → **động từ nguyên mẫu**: expand, create.",
        "Sau **is / are** và không có danh từ theo sau → **tính từ**: useful.",
        "Sau **an essential / improve** → **danh từ** (hoặc cụm danh từ): life skill, air quality.",
        "Để ý cách từng mở bài **paraphrase** đề: cooking → **cooking lessons**, compulsory → **required**, improve your vocabulary → **expand one's range of words**, cities → **local authorities**, parks → **green spaces**, shopping centres → **malls**.",
      ],
    },

    { t: "h", text: "Bài thêm: ghép câu thesis statement (phần sách chưa có)" },
    {
      t: "p",
      text: "Bấm các mảnh theo đúng thứ tự để dựng câu thesis. Mỗi câu có **1–2 mảnh gây nhiễu** chứa lỗi người Việt hay mắc (am agree, because of + mệnh đề…). Đừng chọn chúng.",
    },
    {
      t: "build",
      id: "d6-ghep-thesis",
      title: "Ghép câu thesis statement (4 câu)",
      items: [
        {
          vi: "Tôi hoàn toàn đồng ý vì nấu ăn là một kỹ năng sống thiết yếu.",
          chips: ["I ", "completely agree ", "am completely agree ", "because ", "cooking is ", "an essential life skill."],
          answer: ["I ", "completely agree ", "because ", "cooking is ", "an essential life skill."],
        },
        {
          vi: "Tôi tin rằng học trực tuyến có lợi hơn vì nó tiết kiệm thời gian đi lại.",
          chips: ["I believe that ", "online study ", "is more beneficial ", "because ", "because of ", "it saves travel time."],
          answer: ["I believe that ", "online study ", "is more beneficial ", "because ", "it saves travel time."],
        },
        {
          vi: "Tôi hoàn toàn không đồng ý với quan điểm này vì bài tập về nhà giúp học sinh nhớ bài.",
          chips: ["I ", "completely disagree ", "with this view ", "because ", "homework helps ", "homework help ", "students remember lessons."],
          answer: ["I ", "completely disagree ", "with this view ", "because ", "homework helps ", "students remember lessons."],
        },
        {
          vi: "Tôi đồng ý một phần vì dù đọc sách hữu ích, xem phim cũng có thể dạy từ mới.",
          chips: ["I partly agree ", "because ", "while reading ", "is useful, ", "watching films ", "can also teach ", "can also teaches ", "new words."],
          answer: ["I partly agree ", "because ", "while reading ", "is useful, ", "watching films ", "can also teach ", "new words."],
        },
      ],
    },
  ],
};

/* ═══════════════ Bài kiểm tra chặng 1 (Ngày 1–6) — đứng cuối Ngày 6 ═══════════════ */
/**
 * Bài kiểm tra chặng 1 — ôn trọn Ngày 1–6, làm sau khi học xong Ngày 6.
 *
 * Chỉ kiểm những gì 6 ngày đầu đã dạy: câu đơn & hiện tại đơn (N1), đại từ
 * (N3), danh từ đếm được / không đếm được (N5), từ vựng Mạng xã hội · Giáo dục ·
 * Làm việc từ xa, cụm động từ, đánh vần tên & số điện thoại (N1), Sentence
 * Completion (N4), Flow-chart Completion (N6), mở bài Opinion (N6), Overview
 * Task 1 (N4), Speaking Yes/No (N4) + Wh- (N6), nguyên âm đơn (N4), nhị trùng
 * âm (N6), đuôi -s/-es (N1), /ð/ (N3).
 *
 * Mọi câu tiếng Anh (bài nghe, bài đọc, câu hỏi) đều VIẾT MỚI cho bài này —
 * không lấy từ sách hay từ các bài của khoá (xem ../SOAN-BAI.md).
 * id mọi bài tập bắt đầu bằng `kt1-` (tiến độ & điểm lưu theo id — đừng đổi).
 */

export const KIEM_TRA_1: Lesson = {
  id: 'd6-kiem-tra',
  kind: 'review',
  title: 'Bài kiểm tra chặng 1 (Ngày 1–6)',
  goal: 'Tự đo xem đã nắm chắc ngữ pháp, từ vựng và 4 kỹ năng của Ngày 1–6 chưa, biết chính xác phần nào cần ôn lại trước khi sang Ngày 7.',
  minutes: 75,
  blocks: [
    /* ───────────── 0. Cách làm bài & cách tính điểm ───────────── */
    {
      t: 'p',
      text: 'Đây là **bài kiểm tra chặng 1** (checkpoint test — bài kiểm tra ở một "trạm dừng" giữa khoá). Nó gom lại mọi thứ bạn đã học trong **Ngày 1 đến Ngày 6** thành **8 phần**: Ngữ pháp, Từ vựng, Dịch, Nghe, Đọc, Viết, Nói, Phát âm. Không có kiến thức mới — chỉ có những gì bạn đã gặp.',
    },
    {
      t: 'note',
      title: 'Cách làm bài',
      items: [
        '**Gập sách, gập vở**: không mở lại bài học, không tra từ điển, không hỏi Gia sư AI trong lúc làm. Mục đích là biết bạn **thật sự nhớ** được bao nhiêu.',
        'Làm **một mạch** trong khoảng **75 phút** — đặt đồng hồ. Gợi ý: Ngữ pháp 10′ · Từ vựng 10′ · Dịch 10′ · Nghe 8′ · Đọc 15′ · Viết 12′ · Nói 6′ · Phát âm 4′.',
        'Ở phần **Dịch**, cố **không bấm 💡 Gợi ý**. Bấm thì vẫn được, nhưng hãy tự trừ câu đó khi tính điểm.',
        'Phần **Nghe**: chỉ nghe **tối đa 2 lần**, chưa mở lời thoại cho tới khi điền xong cả 6 chỗ trống.',
        'Làm xong một phần thì **ghi điểm ra giấy** rồi mới sang phần sau. Cuối bài đối chiếu với bảng dưới đây.',
      ],
    },
    {
      t: 'table',
      caption: 'Cách tính điểm — mỗi phần tự hiện điểm của nó; ĐẠT = từ 70% trở lên ở TỪNG phần',
      head: ['Phần', 'Số câu', 'Đạt khi', 'Chưa đạt thì ôn lại'],
      rows: [
        ['1. Ngữ pháp', '16', '≥ 12 câu đúng', 'Ngày 1 · Câu đơn & thì hiện tại đơn — Ngày 3 · Đại từ — Ngày 5 · Danh từ đếm được & không đếm được (mục 5–6)'],
        ['2. Từ vựng', '10 + 6', '≥ 7/10 và ≥ 5/6', 'Ngày 1 · Từ vựng Mạng xã hội — Ngày 3 · Từ vựng Giáo dục & Xã hội — Ngày 5 · Từ vựng Làm việc từ xa (cả mục Cụm động từ)'],
        ['3. Dịch Việt → Anh', '6', '≥ 5 câu đúng', 'Các bài dịch "Luyện nhanh / Dịch nhanh" trong bài ngữ pháp Ngày 1, 3, 5 và Bài tập Ngày 1 (phần I)'],
        ['4. Nghe', '6', '≥ 5 câu đúng', 'Ngày 1 · Nghe: bảng chữ cái & đánh vần — Ngày 3 & 5 · Nghe chép chính tả'],
        ['5. Đọc', '4 + 3', '≥ 5/7 câu đúng (cộng hai khối)', 'Ngày 4 · Đọc: Sentence Completion 1 — Ngày 6 · Đọc: Flow-chart Completion 1 — Ngày 2 · Từ khoá'],
        ['6. Viết', '2 đoạn ngắn', 'AI chấm ≥ band 4.0 và mở bài có ĐỦ paraphrase + thesis', 'Ngày 6 · Viết: Opinion Essay 1 (mục 2, 5) — Ngày 4 · Viết Task 1 (mục 3, Overview)'],
        ['7. Nói', '5 câu hỏi', 'AI chấm ≥ band 4.0, mỗi câu trả lời 2–3 câu', 'Ngày 4 · Nói: Yes/No — Ngày 6 · Nói: Wh-'],
        ['8. Phát âm', '6 dòng', '≥ 70 điểm ở ít nhất 5/6 dòng', 'Ngày 4 mục 6 (nguyên âm đơn) — Ngày 6 mục 6 (nhị trùng âm) — Ngày 1 (đuôi -s/-es) — Ngày 3 (âm /ð/)'],
      ],
    },

    /* ───────────── 1. Ngữ pháp ───────────── */
    { t: 'h', text: 'Phần 1 — Ngữ pháp' },
    {
      t: 'p',
      text: 'Chọn đáp án đúng cho chỗ trống. Kiến thức: **thì hiện tại đơn** (thêm -s/-es, câu phủ định, câu hỏi), **đại từ** (chủ ngữ / tân ngữ / sở hữu / phản thân), **danh từ đếm được – không đếm được** (much, many, a few, a little, some, any).',
    },
    {
      t: 'mcq',
      id: 'kt1-ngu-phap',
      title: 'Phần 1 — Ngữ pháp (16 câu)',
      items: [
        { q: 'My aunt ___ in a small bakery near the market.', options: ['work', 'works', 'working'], correct: 1, why: 'Chủ ngữ **my aunt** = she (số ít) → động từ thêm **-s**: works.' },
        { q: 'Tom ___ his homework after dinner every day.', options: ['do', 'dos', 'does'], correct: 2, why: 'Động từ tận cùng bằng **-o** thì thêm **-es**: do → **does** (như go → goes).' },
        { q: 'The baby ___ when she is hungry.', options: ['cries', 'crys', 'cry'], correct: 0, why: '**cry** tận cùng là phụ âm + **y** → bỏ y, thêm **-ies**: cries. Chủ ngữ the baby = she.' },
        { q: 'My grandparents ___ the news on TV every evening.', options: ['watches', 'watch', 'watching'], correct: 1, why: 'Chủ ngữ **số nhiều** (my grandparents = they) → động từ **nguyên mẫu**, không thêm -es.' },
        { q: 'Linh ___ tea. She only drinks water.', options: ["don't like", "doesn't likes", "doesn't like"], correct: 2, why: 'Chủ ngữ she → **doesn\'t**; sau doesn\'t động từ **về nguyên mẫu**: doesn\'t **like** (không phải likes).' },
        { q: '___ your brother live in Hanoi?', options: ['Do', 'Does', 'Is'], correct: 1, why: 'Câu hỏi Yes/No, chủ ngữ **your brother** (số ít) → **Does** + S + V nguyên mẫu. Không dùng Is vì đã có động từ thường live.' },
        { q: 'Where ___ your parents work?', options: ['do', 'does', 'are'], correct: 0, why: 'Câu hỏi Wh-: Wh- + **do** + S (số nhiều: your parents) + V nguyên mẫu.' },
        { q: 'Nam and ___ are in the same English class.', options: ['me', 'I', 'my'], correct: 1, why: 'Chỗ trống nằm trong **chủ ngữ** (đứng trước động từ are) → dùng đại từ chủ ngữ **I**. ~~Nam and me are~~ là lỗi hay gặp.' },
        { q: 'Our teacher always helps ___ with difficult words.', options: ['we', 'our', 'us'], correct: 2, why: 'Đứng **sau động từ** helps → cần đại từ **tân ngữ**: us.' },
        { q: 'This phone isn\'t ___. It belongs to my sister.', options: ['mine', 'my', 'me'], correct: 0, why: 'Sau is và **không có danh từ đi theo** → dùng **đại từ sở hữu** mine (= my phone). "my" phải có danh từ phía sau.' },
        { q: 'Every Friday, the students clean the classroom ___. Nobody helps them.', options: ['theirselves', 'themselves', 'them'], correct: 1, why: '"Tự họ làm, không ai giúp" → đại từ **phản thân** của they là **themselves**. ~~theirselves~~ không tồn tại.' },
        { q: 'How ___ money do you spend on apps each month?', options: ['many', 'much', 'a few'], correct: 1, why: '**money** là danh từ **không đếm được** → How **much**. (How many + danh từ số nhiều.)' },
        { q: 'I have ___ questions about the homework. Can I ask you now?', options: ['a few', 'a little', 'much'], correct: 0, why: '**questions** đếm được, số nhiều → **a few** (vài, đủ để hỏi). a little và much đi với danh từ không đếm được.' },
        { q: 'We don\'t have ___ homework this weekend, so we can relax.', options: ['some', 'many', 'any'], correct: 2, why: 'Câu **phủ định** → **any**. homework **không đếm được** nên cũng không dùng many.' },
        { q: 'Could I have ___ water, please?', options: ['a', 'some', 'any'], correct: 1, why: 'Câu **xin / mời** (mong người kia đồng ý) → dùng **some**, kể cả khi là câu hỏi. water không đếm được nên không dùng a.' },
        { q: 'The information on this website ___ very useful.', options: ['are', 'is', 'be'], correct: 1, why: '**information** không đếm được → luôn đi với động từ **số ít**: is. Không có dạng ~~informations~~.' },
      ],
    },

    /* ───────────── 2. Từ vựng ───────────── */
    { t: 'h', text: 'Phần 2 — Từ vựng' },
    {
      t: 'p',
      text: 'Điền **một từ tiếng Anh** vào chỗ trống. Nghĩa tiếng Việt của từ cần điền nằm trong ngoặc. Từ lấy từ ba chủ đề đã học: **Mạng xã hội** (Ngày 1), **Giáo dục** (Ngày 3), **Làm việc từ xa** (Ngày 5). Viết đúng chính tả — sai một chữ cái là sai.',
    },
    {
      t: 'quiz',
      id: 'kt1-tu-vung',
      title: 'Phần 2a — Từ vựng chủ đề (10 câu)',
      kind: 'fill',
      items: [
        { q: 'Her cooking video went ___ and got two million views in one day. (lan truyền rất nhanh)', answers: ['viral'], hint: 'Ngày 1 · Mạng xã hội' },
        { q: 'Change your ___ settings so strangers cannot see your photos. (quyền riêng tư)', answers: ['privacy'], hint: 'Ngày 1 · Mạng xã hội' },
        { q: 'My phone shows a ___ every time someone comments on my post. (thông báo)', answers: ['notification'], hint: 'Ngày 1 · Mạng xã hội' },
        { q: 'Good teachers ___ shy students to ask questions. (khuyến khích)', answers: ['encourage'], hint: 'Ngày 3 · Giáo dục' },
        { q: 'Free online lessons give children in poor areas ___ to good teachers. (sự tiếp cận)', answers: ['access'], hint: 'Ngày 3 · Giáo dục' },
        { q: 'Many students lose ___ when the lessons are boring. (động lực)', answers: ['motivation'], hint: 'Ngày 3 · Giáo dục' },
        { q: 'Reading English news every day can ___ your vocabulary. (cải thiện)', answers: ['improve'], hint: 'Ngày 3 · Giáo dục' },
        { q: 'My ___ and I have a short video meeting every Monday. (đồng nghiệp)', answers: ['colleague'], hint: 'Ngày 5 · Làm việc từ xa' },
        { q: 'A ___ works for many different clients and has no single boss. (người làm việc tự do)', answers: ['freelancer'], hint: 'Ngày 5 · Làm việc từ xa' },
        { q: 'My working hours are very ___: I can start at 7 or at 10. (linh hoạt)', answers: ['flexible'], hint: 'Ngày 5 · Làm việc từ xa' },
      ],
    },
    {
      t: 'mcq',
      id: 'kt1-cum-dong-tu',
      title: 'Phần 2b — Cụm động từ (6 câu)',
      items: [
        { q: 'I was ill for a week, so now I need to ___ with the lessons I missed.', options: ['catch up', 'drop out', 'log out'], correct: 0, why: '**catch up** = bắt kịp, học bù phần bị lỡ (Ngày 3, Ngày 5).' },
        { q: 'He ___ of university in his second year because he had no money.', options: ['handed in', 'dropped out', 'set up'], correct: 1, why: '**drop out (of)** = bỏ học giữa chừng (Ngày 3). handed in = nộp bài; set up = thiết lập.' },
        { q: 'Please ___ your essays before Friday.', options: ['pick up', 'put off', 'hand in'], correct: 2, why: '**hand in** = nộp (bài) (Ngày 3). put off = trì hoãn — ngược nghĩa với yêu cầu "trước thứ Sáu".' },
        { q: "Don't ___ your report until the last minute. Start it today.", options: ['put off', 'work on', 'check in'], correct: 0, why: '**put off** = hoãn lại, trì hoãn (Ngày 5). Câu sau "Start it today" cho thấy lời khuyên là đừng trì hoãn.' },
        { q: 'She ___ her feed for an hour every night before bed.', options: ['signs up', 'scrolls through', 'hands in'], correct: 1, why: '**scroll through** = lướt (màn hình, bảng tin) (Ngày 1). feed = bảng tin.' },
        { q: 'Before the exam, I always ___ my notes one more time.', options: ['go over', 'turn on', 'log in'], correct: 0, why: '**go over** = xem lại, rà soát kỹ (Ngày 3). Chủ ngữ I → động từ nguyên mẫu go.' },
      ],
    },

    /* ───────────── 3. Dịch ───────────── */
    { t: 'h', text: 'Phần 3 — Dịch Việt → Anh' },
    {
      t: 'p',
      text: 'Dịch mỗi câu sang tiếng Anh, viết **cả câu**, có dấu chấm hoặc dấu hỏi ở cuối. Mỗi câu gộp **hai điểm ngữ pháp** đã học. Máy chấp nhận nhiều cách viết đúng; nếu bạn chắc câu mình đúng mà máy báo sai, hãy so với đáp án mẫu — có thể bạn dùng một từ khác nghĩa.',
    },
    {
      t: 'quiz',
      id: 'kt1-dich',
      title: 'Phần 3 — Dịch Việt → Anh (6 câu)',
      kind: 'translate',
      grammar: "S + V(s/es) · S + don't/doesn't + V · Do/Does + S + V? · đại từ chủ ngữ / tân ngữ / sở hữu (mine, hers) / phản thân (themselves) · a few + N-s · much + N không đếm được",
      items: [
        {
          q: 'Em gái tôi không dùng Facebook.',
          hint: "my younger sister, doesn't use",
          answers: [
            "My younger sister doesn't use Facebook.",
            'My younger sister does not use Facebook.',
            "My little sister doesn't use Facebook.",
            'My little sister does not use Facebook.',
            "My sister doesn't use Facebook.",
            'My sister does not use Facebook.',
          ],
        },
        {
          q: 'Bố bạn có làm việc ở nhà không?',
          hint: 'Does, your father, work, at home / from home',
          answers: [
            'Does your father work at home?',
            'Does your father work from home?',
            'Does your dad work at home?',
            'Does your dad work from home?',
          ],
        },
        {
          q: 'Họ tự làm bài tập về nhà.',
          hint: 'do, their homework, themselves',
          answers: [
            'They do their homework themselves.',
            'They do their homework by themselves.',
            'They do the homework themselves.',
            'They do the homework by themselves.',
            'They themselves do their homework.',
          ],
        },
        {
          q: 'Tôi có vài câu hỏi về khoá học này.',
          hint: 'have, a few questions, about this course',
          answers: [
            'I have a few questions about this course.',
            "I've got a few questions about this course.",
            'I have got a few questions about this course.',
            'I have some questions about this course.',
          ],
        },
        {
          q: 'Chúng tôi không có nhiều thời gian rảnh vào buổi sáng.',
          hint: "don't have, much free time, in the morning",
          answers: [
            "We don't have much free time in the morning.",
            'We do not have much free time in the morning.',
            "We don't have much free time in the mornings.",
            'We do not have much free time in the mornings.',
            "We don't have a lot of free time in the morning.",
            "We don't have a lot of free time in the mornings.",
            "We don't have much spare time in the morning.",
            "We don't have much spare time in the mornings.",
          ],
        },
        {
          q: 'Chiếc máy tính này là của cô ấy, không phải của tôi.',
          hint: 'this computer / laptop, is hers, not mine',
          answers: [
            'This computer is hers, not mine.',
            'This laptop is hers, not mine.',
            "This computer is hers, it's not mine.",
            "This laptop is hers, it's not mine.",
            'This computer is hers, not my computer.',
            'This computer is hers and not mine.',
          ],
        },
      ],
    },

    /* ───────────── 4. Nghe ───────────── */
    { t: 'h', text: 'Phần 4 — Nghe' },
    {
      t: 'p',
      text: 'Bạn sẽ nghe một cuộc gọi điện tới một trung tâm tiếng Anh. Đây là dạng **Form Completion** (điền phiếu) của IELTS Listening Part 1: người nghe phải ghi lại tên được **đánh vần từng chữ cái** và một **số điện thoại**. Đọc phiếu bên dưới **trước khi nghe** để biết mình cần chờ thông tin gì.',
    },
    {
      t: 'table',
      caption: 'Sunrise Language Centre — Enrolment form (Phiếu đăng ký học)',
      head: ['Mục', 'Thông tin'],
      rows: [
        ['Course', '(1) ______ course for beginners'],
        ['Class day', '(2) ______ evening'],
        ['First name', 'Khoa'],
        ['Family name', '(3) ______'],
        ['Phone number', '(4) ______'],
        ['Job', '(5) ______'],
        ['Heard about the centre from', "a friend's (6) ______ on Facebook"],
      ],
    },
    {
      t: 'listen',
      id: 'kt1-nghe-bai',
      title: 'Enrolling in an English course',
      dan: { so: 'Checkpoint Test 1, Listening', boiCanh: 'a conversation between a receptionist at a language centre and a student who wants to join an English course.', cau: [1, 6] },
      note: 'Giọng Anh-Anh, khoảng 1 phút rưỡi. Nghe tối đa 2 lần. Chưa mở lời thoại cho tới khi điền xong 6 chỗ trống.',
      lines: [
        { who: 'Receptionist', voice: 'uk-nu', text: 'Good morning, Sunrise Language Centre. How can I help you?', vi: 'Chào buổi sáng, Trung tâm Ngoại ngữ Sunrise xin nghe. Tôi giúp gì được cho bạn?' },
        { who: 'Khoa', voice: 'uk-nam', text: "Hi. I'd like to sign up for an English course, please.", vi: 'Chào chị. Tôi muốn đăng ký một khoá tiếng Anh.' },
        { who: 'Receptionist', voice: 'uk-nu', text: 'Of course. We have a writing course and a speaking course for beginners. Which one would you like?', vi: 'Vâng. Chúng tôi có khoá viết và khoá nói cho người mới bắt đầu. Bạn muốn khoá nào?' },
        { who: 'Khoa', voice: 'uk-nam', text: 'The speaking course, please. I can read quite well, but I find it hard to talk.', vi: 'Khoá nói ạ. Tôi đọc khá ổn nhưng nói thì thấy khó.' },
        { who: 'Receptionist', voice: 'uk-nu', text: 'No problem. Is there a day that suits you?', vi: 'Không sao. Bạn hợp với ngày nào?' },
        { who: 'Khoa', voice: 'uk-nam', text: 'Is there a class on Monday evening?', vi: 'Có lớp tối thứ Hai không chị?' },
        { who: 'Receptionist', voice: 'uk-nu', text: "I'm afraid the Monday class is full now. But we still have places on Thursday evening.", vi: 'Rất tiếc lớp tối thứ Hai đã đủ người. Nhưng lớp tối thứ Năm vẫn còn chỗ.' },
        { who: 'Khoa', voice: 'uk-nam', text: "Thursday is fine. I don't work late on Thursdays.", vi: 'Thứ Năm được ạ. Thứ Năm tôi không làm muộn.' },
        { who: 'Receptionist', voice: 'uk-nu', text: "Great. Can I take your name? I've got your first name as Khoa. What's your family name?", vi: 'Tốt quá. Cho tôi xin tên bạn. Tôi đã ghi tên là Khoa. Họ của bạn là gì?' },
        { who: 'Khoa', voice: 'uk-nam', text: "It's Truong. That's T, R, U, O, N, G.", vi: 'Là Trương. Đánh vần T, R, U, O, N, G.' },
        { who: 'Receptionist', voice: 'uk-nu', text: 'T, R, U, O, N, G. Thank you. And what is the best phone number for you?', vi: 'T, R, U, O, N, G. Cảm ơn bạn. Số điện thoại nào gọi cho bạn tiện nhất?' },
        { who: 'Khoa', voice: 'uk-nam', text: "It's oh nine one two, eight oh six, four seven three. Oh, sorry, no. The end is four three seven.", vi: 'Là 0912, 806, 473. À, xin lỗi, không phải. Ba số cuối là 437.' },
        { who: 'Receptionist', voice: 'uk-nu', text: 'So that is oh nine one two, eight oh six, four three seven.', vi: 'Vậy là 0912, 806, 437.' },
        { who: 'Khoa', voice: 'uk-nam', text: "That's right.", vi: 'Đúng rồi ạ.' },
        { who: 'Receptionist', voice: 'uk-nu', text: 'And what do you do, Khoa?', vi: 'Còn bạn làm nghề gì, Khoa?' },
        { who: 'Khoa', voice: 'uk-nam', text: "I'm a nurse. I work in a hospital, and some of my patients don't speak Vietnamese.", vi: 'Tôi là y tá. Tôi làm ở bệnh viện, và một vài bệnh nhân của tôi không nói tiếng Việt.' },
        { who: 'Receptionist', voice: 'uk-nu', text: 'I see. One last question. How did you hear about us?', vi: 'Tôi hiểu rồi. Câu hỏi cuối. Bạn biết đến trung tâm bằng cách nào?' },
        { who: 'Khoa', voice: 'uk-nam', text: 'A friend of mine shared a post about your centre on Facebook.', vi: 'Một người bạn của tôi chia sẻ một bài đăng về trung tâm trên Facebook.' },
        { who: 'Receptionist', voice: 'uk-nu', text: 'Lovely. Thank you, Khoa. See you on Thursday.', vi: 'Tuyệt. Cảm ơn Khoa. Hẹn gặp bạn thứ Năm nhé.' },
      ],
    },
    {
      t: 'quiz',
      id: 'kt1-nghe-dien',
      title: 'Phần 4 — Nghe và điền phiếu (6 câu)',
      kind: 'fill',
      items: [
        { q: '(1) Course: ___ course for beginners', answers: ['speaking'] },
        { q: '(2) Class day: ___ evening', answers: ['Thursday', 'Thursdays', 'Thurs', 'Thu'] },
        { q: '(3) Family name: ___', answers: ['Truong'] },
        { q: '(4) Phone number: ___', answers: ['0912 806 437', '0912806437', '0912 806437', '0912-806-437'] },
        { q: '(5) Job: ___', answers: ['nurse', 'a nurse'] },
        { q: "(6) Heard about the centre from: a friend's ___ on Facebook", answers: ['post'] },
      ],
    },
    {
      t: 'note',
      title: 'Giải thích đáp án — cẩn thận với bẫy',
      items: [
        '**(1) speaking** — lễ tân nêu **hai** khoá (writing và speaking); Khoa chọn "The speaking course".',
        '**(2) Thursday** — bẫy: Khoa hỏi **Monday** trước, nhưng lớp thứ Hai đã đầy (full). Đáp án là ngày **còn chỗ**: Thursday. Viết hoa chữ cái đầu hay không đều được chấm đúng.',
        '**(3) Truong** — nghe đánh vần **T-R-U-O-N-G**. Không viết dấu tiếng Việt (Trương) vì phiếu tiếng Anh. Nhầm hay gặp: **U** /juː/ với **W**; **G** /dʒiː/ với **J** /dʒeɪ/.',
        '**(4) 0912 806 437** — bẫy **sửa lời**: Khoa đọc "four seven three" rồi sửa thành "four three seven". Luôn lấy thông tin **cuối cùng**. "oh" = số 0.',
        '**(5) nurse** — "I\'m a nurse." Câu sau (làm ở bệnh viện) xác nhận lại.',
        '**(6) post** — "shared a **post** about your centre on Facebook". post = bài đăng (từ vựng Ngày 1).',
      ],
    },

    /* ───────────── 5. Đọc ───────────── */
    { t: 'h', text: 'Phần 5 — Đọc' },
    {
      t: 'p',
      text: 'Đọc **câu hỏi trước**, gạch chân từ khoá, rồi mới đọc bài để tìm vị trí. Bài có 4 đoạn A–D. Hai dạng câu hỏi: **Sentence Completion** (hoàn thành câu — Ngày 4) và **Flow-chart Completion** (hoàn thành sơ đồ quy trình — Ngày 6). Đáp án là từ **lấy nguyên văn trong bài**.',
    },
    {
      t: 'passage',
      title: 'The Repair Café',
      intro: 'Bài đọc viết riêng cho bài kiểm tra này — khoảng 250 từ, 4 đoạn A–D.',
      paras: [
        {
          label: 'A',
          text: 'In many towns, people meet once a month at a "repair café". Visitors bring broken things from home, such as lamps, toasters, bicycles and clothes, and volunteers try to fix them for free. In the small town of Elmwood, the café takes place in a community hall or a library, and it usually lasts about four hours on a Saturday afternoon.',
        },
        {
          label: 'B',
          text: 'The volunteers are ordinary people with useful skills. Some are retired engineers, and others are students who enjoy working with electronics. They do not get any money for their work. Instead, many of them say that the best reward is the smile on a visitor\'s face when an old radio or a favourite lamp works again.',
        },
        {
          label: 'C',
          text: 'A visit follows a simple process. First, every visitor writes their name and the problem on a form at the reception desk. Next, a volunteer looks at the item carefully and decides whether it can be repaired. If it can, the owner sits next to the volunteer and watches every step, so that he or she can do the job alone next time. At the end, visitors are invited to have a cup of tea and leave a small donation in a box by the door.',
        },
        {
          label: 'D',
          text: 'Supporters believe that repair cafés reduce waste, because fewer things end up in the rubbish bin. The Elmwood organisers say that their volunteers can fix about two thirds of the items. However, some modern products are difficult to open, and spare parts can be expensive. For this reason, many volunteers would like companies to make goods that are easier to repair.',
        },
      ],
    },
    {
      t: 'p',
      text: '**Questions 1–4.** Complete the sentences below. Choose **NO MORE THAN TWO WORDS** from the passage for each answer. — *Hoàn thành các câu dưới đây. Chọn **KHÔNG QUÁ HAI TỪ** trong bài đọc cho mỗi câu trả lời.*',
    },
    {
      t: 'quiz',
      id: 'kt1-doc-cau',
      title: 'Phần 5a — Sentence Completion (4 câu) — NO MORE THAN TWO WORDS',
      kind: 'fill',
      items: [
        { q: '(1) In Elmwood, the repair café is held in a community hall or a ___.', answers: ['library'] },
        { q: '(2) Some of the volunteers are students who like working with ___.', answers: ['electronics'] },
        { q: "(3) For many volunteers, the best reward is seeing a visitor's ___ when something works again.", answers: ['smile'] },
        { q: '(4) Some modern products are hard to open, and ___ can cost a lot of money.', answers: ['spare parts'] },
      ],
    },
    {
      t: 'p',
      text: '**Questions 5–7.** Complete the flow-chart below. Choose **ONE WORD ONLY** from the passage for each answer. — *Hoàn thành sơ đồ. Chọn **MỘT TỪ DUY NHẤT** trong bài đọc cho mỗi câu trả lời.*',
    },
    {
      t: 'table',
      caption: 'A visit to the repair café — Một lần đến quán sửa đồ',
      head: ['', 'Bước (đọc từ trên xuống)'],
      rows: [
        ['1', 'The visitor writes down his or her name and the problem on a **(5) ______** — **Khách ghi tên và vấn đề của món đồ vào một (5) ______**'],
        ['↓', ''],
        ['2', 'A volunteer checks the item and decides if it can be **(6) ______** — **Tình nguyện viên xem món đồ và quyết định nó có thể được (6) ______ hay không**'],
        ['↓', ''],
        ['3', 'The owner watches the work, then has tea and gives a small **(7) ______** — **Chủ đồ xem sửa, rồi uống trà và để lại một khoản (7) ______ nhỏ**'],
      ],
    },
    {
      t: 'quiz',
      id: 'kt1-doc-so-do',
      title: 'Phần 5b — Flow-chart Completion (3 câu) — ONE WORD ONLY',
      kind: 'fill',
      items: [
        { q: '(5) The visitor writes down his or her name and the problem on a ___', answers: ['form'] },
        { q: '(6) A volunteer checks the item and decides if it can be ___', answers: ['repaired'] },
        { q: '(7) The owner watches the work, then has tea and gives a small ___', answers: ['donation'] },
      ],
    },
    {
      t: 'note',
      title: 'Giải thích đáp án — Phần 5 (vị trí trong bài)',
      items: [
        '**(1) library** — đoạn **A**, câu 3: "the café takes place in a community hall or a **library**". Paraphrase: takes place in = **is held in**.',
        '**(2) electronics** — đoạn **B**, câu 2: "students who enjoy working with **electronics**". enjoy = **like**. Bẫy: ~~engineers~~ là nhóm khác (retired engineers), không phải thứ học sinh làm cùng.',
        '**(3) smile** — đoạn **B**, câu cuối: "the best reward is the **smile** on a visitor\'s face". Chỉ một từ "smile" là đủ; ~~face~~ sai nghĩa.',
        '**(4) spare parts** — đoạn **D**, câu 3: "**spare parts** can be expensive". expensive = **cost a lot of money**; difficult to open = **hard to open**. Đúng 2 từ — vừa giới hạn.',
        '**(5) form** — đoạn **C**, câu 2: "writes their name and the problem on a **form** at the reception desk". Sau "on a" cần **danh từ**.',
        '**(6) repaired** — đoạn **C**, câu 3: "decides whether it **can be repaired**". whether = **if**; looks at = **checks**. Sau "can be" cần động từ dạng **V3** → repaired (không viết repair).',
        '**(7) donation** — đoạn **C**, câu cuối: "leave a small **donation** in a box by the door". leave = **gives**. Bẫy: ~~box~~ là chỗ bỏ tiền, không phải thứ được cho. Sơ đồ đi **theo thứ tự** bài: (5) → (6) → (7) đều nằm trong đoạn C, từ trên xuống.',
      ],
    },

    /* ───────────── 6. Viết ───────────── */
    { t: 'h', text: 'Phần 6 — Viết' },
    {
      t: 'p',
      text: 'Hai bài viết ngắn. Bài 6a chỉ cần **mở bài** Task 2 dạng Opinion (đúng kỹ năng Ngày 6). Bài 6b chỉ cần **đoạn Overview** của Task 1 (Ngày 4). Viết xong thì bấm cho AI chấm; nhớ rằng đây là đoạn ngắn nên AI có thể trừ điểm vì "chưa đủ bài" — hãy đọc nhận xét về **nội dung, từ vựng và ngữ pháp** của đoạn bạn viết.',
    },
    {
      t: 'essay',
      id: 'kt1-viet-mo-bai',
      task: 'Task 2',
      prompt: 'Some people think that children under 16 should not be allowed to use social media. To what extent do you agree or disagree? — CHỈ VIẾT MỞ BÀI (introduction), 40–60 từ: một câu paraphrase đề + một câu thesis statement nêu rõ quan điểm và 1–2 lý do.',
      minWords: 40,
      tips: [
        'Làm theo 5 bước Ngày 6: đọc đề (chủ đề: social media · đối tượng: children under 16 · ý kiến: should not be allowed) → paraphrase → thesis → ghép → rà soát.',
        'Paraphrase gợi ý: children under 16 → **young people below the age of sixteen / teenagers**; should not be allowed to use → **should be banned from using**; social media → **social networking sites / platforms such as Facebook and TikTok**.',
        'Mở câu paraphrase bằng **It is often argued that…** hoặc **Many people believe that…**. Không chép nguyên câu đề.',
        'Thesis: **I completely agree / I partly agree / I disagree with this view because…** + 1–2 lý do ngắn (vd. privacy, time for study, keeping up with friends).',
        'Dùng thì **hiện tại đơn**; chủ ngữ số nhiều (children, teenagers) → động từ **không thêm -s**. Soát lại trước khi nộp.',
      ],
    },
    {
      t: 'essay',
      id: 'kt1-viet-overview',
      task: 'Task 1',
      prompt: 'The table shows the average number of hours per week that employees in three departments of one company worked from home in 2020, 2022 and 2024. Sales: 4 hours, 10 hours, 12 hours · IT: 8 hours, 20 hours, 24 hours · Customer service: 2 hours, 6 hours, 5 hours. — CHỈ VIẾT ĐOẠN OVERVIEW (tổng quan), 1–2 câu, khoảng 25–40 từ. Không đưa số liệu chi tiết.',
      minWords: 20,
      tips: [
        'Mở đầu bằng **Overall,** hoặc **In general,**.',
        'Nêu **2 đặc điểm nổi bật nhất**: (1) xu hướng chung — giờ làm ở nhà tăng hay giảm? (2) bộ phận nào **cao nhất** suốt cả giai đoạn?',
        'Khung câu Ngày 4: **Overall, + N1 + V-ed (rose / increased…), while + N2 + V-ed.**',
        'Số liệu trong quá khứ (2020–2024) → dùng **quá khứ đơn** (rose, increased, was). **Không** viết con số như 24 hours trong overview.',
      ],
    },

    /* ───────────── 7. Nói ───────────── */
    { t: 'h', text: 'Phần 7 — Nói (Speaking Part 1)' },
    {
      t: 'p',
      text: 'Năm câu hỏi Part 1 trộn **Yes/No** (Ngày 4) và **Wh-** (Ngày 6). Với câu Yes/No: **trả lời thẳng – lý do – ví dụ**. Với câu Wh-: **trả lời thẳng + chi tiết + lợi ích/cảm xúc**. Nói 2–3 câu cho mỗi câu hỏi, không học thuộc lòng.',
    },
    {
      t: 'speak',
      id: 'kt1-noi',
      part: '1',
      questions: [
        'Do you use social media every day?',
        'What do you usually do in the evening?',
        'Do you enjoy learning English?',
        'Who do you live with?',
        'How do you usually get to school or work?',
      ],
    },

    /* ───────────── 8. Phát âm ───────────── */
    { t: 'h', text: 'Phần 8 — Phát âm' },
    {
      t: 'phatam',
      id: 'kt1-phat-am',
      title: 'Phần 8 — Phát âm (6 dòng)',
      note: 'Bấm “Nghe mẫu” một lần, rồi “Đọc & chấm”. Ghi lại điểm tổng của từng dòng — đạt khi ít nhất 5/6 dòng từ 70 điểm. Để ý: âm dài có ː phải kéo dài; nhị trùng âm phải trượt; đuôi -s/-es đọc đúng /s/, /z/ hay /ɪz/; /ð/ đưa đầu lưỡi ra giữa hai hàm răng.',
      items: [
        { text: 'sit, seat, full, fool', ipa: 'sɪt siːt fʊl fuːl', vi: 'nguyên âm ngắn – dài: /ɪ/ /iː/ · /ʊ/ /uː/' },
        { text: 'late, home, now', ipa: 'leɪt həʊm naʊ', vi: 'nhị trùng âm /eɪ/ /əʊ/ /aʊ/' },
        { text: 'She watches videos and likes posts.', ipa: 'ʃi wɒtʃɪz vɪdiəʊz ənd laɪks pəʊsts', vi: 'watches /ɪz/ · videos /z/ · likes /s/ · posts /s/' },
        { text: 'They do their homework together.', ipa: 'ðeɪ duː ðeə həʊmwɜːk təɡeðə', vi: '/ð/ trong they, their, together' },
        { text: 'My boss checks his emails at nine.', ipa: 'maɪ bɒs tʃeks hɪz iːmeɪlz ət naɪn', vi: '/ɒ/ ngắn · checks /s/ · emails /z/ · /aɪ/' },
        { text: 'I know these words are hard.', ipa: 'aɪ nəʊ ðiːz wɜːdz ə hɑːd', vi: '/əʊ/ · /ð/ · /ɜː/ · /ɑː/ dài' },
      ],
    },

    /* ───────────── 9. Tổng kết ───────────── */
    {
      t: 'recap',
      title: 'Xong bài kiểm tra — bước tiếp theo',
      items: [
        '**Đạt cả 8 phần** (mỗi phần ≥ 70%) → sang **Ngày 7**. Chúc mừng, nền của bạn đã chắc!',
        'Chưa đạt **Ngữ pháp** hoặc **Dịch** → ôn lại bài ngữ pháp **Ngày 1** (hiện tại đơn), **Ngày 3** (đại từ), **Ngày 5** (danh từ, mục 5–6) và làm lại các bài "Dịch nhanh" trong đó.',
        'Chưa đạt **Từ vựng** → mở lại bài từ vựng **Ngày 1, 3, 5**, dùng nút "Che nghĩa / Che từ" để tự kiểm đến khi thuộc, nhất là mục **Cụm động từ**.',
        'Chưa đạt **Nghe** → ôn **Ngày 1** (bảng chữ cái, đánh vần) và làm lại bài nghe chép **Ngày 3, Ngày 5**. Chưa đạt **Đọc** → làm lại bài đọc **Ngày 4** (Sentence Completion) và **Ngày 6** (Flow-chart).',
        'Chưa đạt **Viết / Nói / Phát âm** → ôn **Ngày 6** (mở bài Opinion, câu Wh-, nhị trùng âm) và **Ngày 4** (Overview Task 1, câu Yes/No, nguyên âm đơn). Ôn xong thì **làm lại đúng phần đó** của bài kiểm tra này.',
      ],
    },
  ],
};

// Bài kiểm tra chặng 1 nằm ngay trên — viết trong tệp ngày (script mục lục chạy bằng
// node strip-types, không nạp được import tương đối không đuôi .ts).
export const NGAY_6: Lesson[] = [D6_READING, D6_WRITING, D6_SPEAKING, D6_HOMEWORK, KIEM_TRA_1];
