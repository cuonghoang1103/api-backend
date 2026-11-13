/**
 * Tập 2 · Ngày 7 — Ngữ pháp: bốn cách nói tương lai (will / be going to / hiện tại tiếp diễn /
 * hiện tại đơn lịch trình) [G13] · Nghe: Listening Part 2 — Map labelling + ngôn ngữ vị trí, giọng Mỹ
 * [L04 L11 L13 L17] · Nói: Part 2 Describe a place [S05] 🔊 Anh – Mỹ: /r/ cuối từ, /t/ "flap" · Bài tập.
 *
 * Soạn 12/11/2026 theo docs/ielts-lo-trinh-0-8.md mục 3.2 (hàng N7). Tập 1 Ngày 9 mục 10 đã NHẬP
 * will / be going to (mức A2) — bài ngữ pháp này là vòng 2: thêm hiện tại tiếp diễn (kế hoạch đã hẹn),
 * hiện tại đơn (lịch trình), mệnh đề thời gian, ngôn ngữ dự đoán cho Task 1 / Part 3. Tập 1 Ngày 9 cũng
 * đã có một bài bản đồ (giọng Anh) — bài nghe hôm nay khó hơn: mặt bằng toà nhà có hành lang vòng quanh
 * sân trong, trái / phải đổi theo hướng đi, bẫy "used to be… but now", toàn giọng Mỹ.
 * Mọi kịch bản nghe, bản đồ, bài mẫu là tự viết; số liệu tự đặt.
 */
import type { Lesson } from '../data';

/* ─────────────────────────── Ngữ pháp ─────────────────────────── */

const T2D7_NGU_PHAP: Lesson = {
  id: "t2d7-ngu-phap",
  kind: "grammar",
  title: "Ngữ pháp: Tương lai — will / be going to / hiện tại tiếp diễn / hiện tại đơn lịch trình",
  goal: "Chọn đúng một trong bốn cách nói tương lai theo câu hỏi “quyết định từ lúc nào, đã hẹn chưa, có lịch cố định không”, dùng đúng mệnh đề thời gian (when / as soon as + hiện tại), và nói / viết dự đoán có mức độ cho Speaking Part 1–3 và Task 1 có năm tương lai — đẩy tiêu chí Ngữ pháp (GRA) lên band 5.",
  minutes: 60,
  blocks: [
    {
      t: "recap",
      title: "Bài này học gì · đẩy band nào",
      items: [
        "Tiếng Việt chỉ có một chữ **“sẽ”**; tiếng Anh có **4 cách** nói tương lai hay dùng: ==will + V== · ==be going to + V== · ==am / is / are + V-ing== · ==hiện tại đơn (lịch trình)==.",
        "Chọn bằng **4 câu hỏi**: Có **lịch / thời gian biểu cố định**? → hiện tại đơn. **Đã hẹn / đã đặt** với người khác? → hiện tại tiếp diễn. **Đã định từ trước** hoặc có **bằng chứng**? → going to. **Vừa quyết định / ý kiến / hứa / đề nghị**? → will.",
        "Sau **when / after / before / until / as soon as** nói về tương lai → dùng **hiện tại đơn**, KHÔNG dùng will: ~~When I will finish~~ → When I **finish**.",
        "Áp vào bài thi: **Part 1** (What are you doing this weekend?), **Part 2** (a place you'd like to visit), **Part 3** & **Task 1** (dự đoán: will probably · is likely to · is expected to).",
        "Đẩy **GRA (Grammatical Range and Accuracy)** band 5: dùng đúng dạng cơ bản và thử câu phức có mệnh đề thời gian. Nói “sẽ” = will cho mọi trường hợp là dấu hiệu band 4.",
      ],
    },
    {
      t: "p",
      text: "Ở **Tập 1 · Ngày 9 (mục 10)** bạn đã gặp **will** và **be going to**. Hôm nay ta ôn nhanh hai cách đó ở mức sâu hơn, rồi thêm **hai cách nữa** mà người bản xứ dùng mỗi ngày: **hiện tại tiếp diễn** cho kế hoạch đã hẹn (I'm meeting Lan tonight) và **hiện tại đơn** cho lịch trình (The train leaves at 6). Cả bốn đều dịch ra là “sẽ”, nhưng **không thay nhau được tuỳ ý** — chọn sai thì câu vẫn hiểu được nhưng nghe lạ, và giám khảo ghi nhận là lỗi ngữ pháp.",
    },
    {
      t: "sodo",
      kind: "timeline",
      title: "Bốn cách nói tương lai trên một trục thời gian",
      caption: "Ba đoạn ①②③ bắt đầu TỪ QUÁ KHỨ (đã có lịch, đã hẹn, đã định) rồi kéo sang tương lai. Chỉ ④ bắt đầu đúng ở BÂY GIỜ — quyết định vừa nảy ra, hoặc chỉ là ý kiến lúc nói.",
      marks: [
        { from: -9, to: 6, kieu: "lap", label: "① **Lịch cố định** — The train **leaves** at 6.15 every morning.", mau: 1 },
        { from: -4, to: 4, kieu: "doan", label: "② **Đã hẹn / đã đặt** — I**'m meeting** my tutor tomorrow.", mau: 2 },
        { from: -6, to: 7, kieu: "doan", label: "③ **Đã định** — I**'m going to** apply for a scholarship next year.", mau: 3 },
        { from: 0, to: 3, kieu: "doan", label: "④ **Vừa quyết định** — “It's raining.” — “I**'ll** take a taxi.”", mau: 1 },
      ],
    },

    { t: "h", text: "1. will + V — quyết định ngay, dự đoán theo ý kiến, hứa, đề nghị" },
    {
      t: "patterns",
      rows: [
        {
          formula: "S + will + V",
          vi: "**will** là động từ khuyết thiếu: **giống nhau cho mọi ngôi**, sau nó là **V nguyên mẫu không to**. Viết tắt khi nói: I'll · you'll · he'll · she'll · it'll · we'll · they'll.",
          examples: [
            { en: "I think online shopping will become even more popular.", vi: "Tôi nghĩ mua sắm trực tuyến sẽ còn phổ biến hơn nữa." },
            { en: "Don't worry, I'll send you the file tonight.", vi: "Đừng lo, tối nay tôi sẽ gửi bạn tệp đó." },
          ],
        },
        {
          formula: "S + will not (won't) + V",
          vi: "Phủ định. **won't** /wəʊnt/ = will not — đừng đọc lẫn với **want** /wɒnt/ (muốn).",
          examples: [{ en: "The bus won't wait if you are late.", vi: "Xe buýt sẽ không đợi nếu bạn đến muộn." }],
        },
        {
          formula: "Will + S + V? · Wh- + will + S + V?",
          vi: "Câu hỏi. Trả lời ngắn: Yes, I will. / No, I won't.",
          examples: [{ en: "Do you think you will live in a big city one day?", vi: "Bạn có nghĩ một ngày nào đó mình sẽ sống ở thành phố lớn không?" }],
        },
        {
          formula: "Shall I + V? · Shall we + V?",
          vi: "Chỉ dùng với **I / we** để **đề nghị giúp** hoặc **rủ** (giọng Anh, hơi trang trọng). Người Mỹ hay nói Should I…? / Do you want me to…?",
          examples: [
            { en: "Shall I open the window?", vi: "Tôi mở cửa sổ nhé?" },
            { en: "Shall we meet at the station?", vi: "Mình gặp nhau ở ga nhé?" },
          ],
        },
      ],
    },
    {
      t: "table",
      caption: "Năm việc của will",
      head: ["Dùng khi", "Ví dụ", "Dấu hiệu hay đi kèm"],
      rows: [
        ["**Quyết định ngay lúc nói**", "“We've run out of milk.” — “I**'ll** buy some on the way home.”", "câu trả lời phản ứng với tình huống vừa xảy ra"],
        ["**Dự đoán theo ý kiến / niềm tin**", "I think prices **will** go up next year.", "**I think · I'm sure · I expect · probably · perhaps · I doubt**"],
        ["**Hứa · đe doạ**", "I promise I **won't** tell anyone.", "promise, I swear"],
        ["**Đề nghị giúp · nhờ vả · đồng ý**", "I**'ll** carry that for you. · **Will** you help me? · OK, I**'ll** do it.", "offer, request"],
        ["**Sự việc tương lai chắc chắn (không phải kế hoạch của mình)**", "I**'ll** be twenty next March. · The sun **will** rise at 5.40 tomorrow.", "tuổi, ngày lễ, sự thật"],
      ],
    },
    {
      t: "note",
      title: "Cẩn thận vị trí của probably / definitely",
      items: [
        "Khẳng định: **will + probably / definitely + V** → It **will probably** rain. · She **will definitely** pass.",
        "Phủ định: **probably / definitely + won't + V** → It **probably won't** rain. (KHÔNG nói ~~It won't probably rain~~.)",
        "**I don't think + will** (phủ định ở think) tự nhiên hơn **I think + won't**: **I don't think** cars **will** disappear. (Ngày 12 Tập 1 đã học quy tắc này cho câu quan điểm.)",
      ],
    },
    {
      t: "rule",
      formula: "S + will + V · S + won't + V · Will + S + V? · Shall I / we + V?",
      vi: "will = quyết định NGAY lúc nói, dự đoán theo ý kiến (I think…), hứa, đề nghị giúp, sự việc chắc chắn xảy ra.",
    },
    {
      t: "quiz",
      id: "t2d7-will-dich",
      title: "Dịch sang tiếng Anh — will (4 câu)",
      kind: "translate",
      grammar: "S + will + V · I think + S + will + V · S + will probably + V · Shall I + V?",
      items: [
        { q: "“Điện thoại đang reo.” — “Để tôi nghe.”", hint: "I'll, answer it / get it", answers: ["I'll answer it.", "I will answer it.", "I'll get it.", "I will get it.", "I'll answer the phone.", "I will answer the phone."] },
        { q: "Tôi nghĩ thành phố sẽ xây thêm nhiều làn xe đạp.", hint: "I think, the city, will build, more cycle lanes / bike lanes", answers: ["I think the city will build more cycle lanes.", "I think the city will build more bike lanes.", "I think the city will build more bicycle lanes.", "I think that the city will build more cycle lanes.", "I think the city will build more cycle paths.", "I think the city will build more bike paths."] },
        { q: "Có lẽ ngày mai trời sẽ không mưa.", hint: "It, probably won't, rain tomorrow", answers: ["It probably won't rain tomorrow.", "It probably will not rain tomorrow.", "Tomorrow it probably won't rain.", "It will probably not rain tomorrow.", "Maybe it won't rain tomorrow.", "Perhaps it won't rain tomorrow."] },
        { q: "Tôi xách cái túi đó giúp bạn nhé?", hint: "Shall I, carry that bag for you", answers: ["Shall I carry that bag for you?", "Shall I carry the bag for you?", "Should I carry that bag for you?", "Do you want me to carry that bag for you?", "Shall I carry that bag?"] },
      ],
    },

    { t: "h", text: "2. be going to + V — dự định đã có, dự đoán có bằng chứng" },
    {
      t: "patterns",
      rows: [
        {
          formula: "S + am / is / are + going to + V",
          vi: "**Dự định** đã nghĩ từ trước (chưa chắc đã đặt chỗ, hẹn ai). Câu hỏi: Are you going to + V? · Phủ định: am / is / are + not + going to + V.",
          examples: [
            { en: "I'm going to take the IELTS test in June.", vi: "Tôi định thi IELTS vào tháng Sáu." },
            { en: "We aren't going to buy a car — we're going to use public transport.", vi: "Chúng tôi không định mua ô tô — chúng tôi định đi phương tiện công cộng." },
          ],
        },
        {
          formula: "It / S + am / is / are + going to + V (có bằng chứng)",
          vi: "**Dự đoán dựa vào thứ đang thấy** ngay trước mắt.",
          examples: [
            { en: "Look at the traffic! We're going to be late.", vi: "Nhìn tắc đường kìa! Mình sắp muộn mất rồi." },
            { en: "The sky is so dark. It's going to rain.", vi: "Trời tối quá. Sắp mưa rồi." },
          ],
        },
      ],
    },
    {
      t: "table",
      caption: "will hay going to? — đặt cạnh nhau",
      head: ["Tình huống", "will", "be going to"],
      rows: [
        ["Kế hoạch", "Quyết định **bây giờ**: “Oh, there's a sale! I**'ll** buy a new jacket.”", "Quyết định **từ trước**: “I**'m going to** buy a new jacket this weekend.” (đã nghĩ từ tuần trước)"],
        ["Dự đoán", "**Ý kiến**: I think Vietnam **will** win.", "**Bằng chứng**: Vietnam is 3–0 up. They**'re going to** win."],
      ],
    },
    {
      t: "note",
      title: "Mấy điều hay nhầm với going to",
      items: [
        "**gonna** /ˈɡɒnə/ (Mỹ: /ˈɡɑːnə/, đọc nhanh /ɡənə/) chỉ là cách **nghe thấy** trong lời nói nhanh (rất hay gặp trong Listening giọng Mỹ). **Không viết** “gonna” trong bài Writing; khi nói Speaking cũng nên nói rõ **going to**.",
        "**I'm going to go to Hue** đúng (be going to + **go**). Nói gọn **I'm going to Hue next week** cũng đúng — lúc đó là **hiện tại tiếp diễn** của động từ go (mục 3).",
        "Thiếu **be**: ~~I going to study~~ → I **am** going to study. Thiếu **to**: ~~I'm going study~~ → I'm going **to** study.",
      ],
    },
    {
      t: "rule",
      formula: "S + am / is / are + going to + V",
      vi: "going to = dự định ĐÃ CÓ TỪ TRƯỚC, hoặc dự đoán có BẰNG CHỨNG trước mắt.",
    },
    {
      t: "quiz",
      id: "t2d7-going-to-dich",
      title: "Dịch sang tiếng Anh — be going to (4 câu)",
      kind: "translate",
      grammar: "S + am / is / are + going to + V · S + am / is / are + not + going to + V · Are you going to + V?",
      items: [
        { q: "Năm sau tôi định học một khoá tiếng Nhật.", hint: "I'm going to, take / do, a Japanese course, next year", answers: ["I'm going to take a Japanese course next year.", "I am going to take a Japanese course next year.", "I'm going to do a Japanese course next year.", "I am going to do a Japanese course next year.", "Next year I'm going to take a Japanese course.", "Next year, I'm going to take a Japanese course.", "I'm going to study Japanese next year.", "I'm going to learn Japanese next year."] },
        { q: "Bạn có định chuyển nhà không?", hint: "Are you going to, move house", answers: ["Are you going to move house?", "Are you going to move?", "Are you going to move to a new house?", "Are you going to move home?"] },
        { q: "Nhìn mấy đám mây kìa! Sắp mưa rồi.", hint: "Look at those clouds, It's going to rain", answers: ["Look at those clouds! It's going to rain.", "Look at those clouds! It is going to rain.", "Look at those clouds. It's going to rain.", "Look at the clouds! It's going to rain.", "Look at those clouds, it's going to rain."] },
        { q: "Họ không định bán căn nhà cũ.", hint: "They aren't going to, sell, their old house", answers: ["They aren't going to sell their old house.", "They are not going to sell their old house.", "They're not going to sell their old house.", "They aren't going to sell the old house.", "They're not going to sell the old house."] },
      ],
    },

    { t: "h", text: "3. Hiện tại tiếp diễn — kế hoạch ĐÃ HẸN, ĐÃ ĐẶT" },
    {
      t: "p",
      text: "Bạn đã biết **am / is / are + V-ing** dùng cho việc **đang diễn ra** (Tập 1 · Ngày 9). Cùng dạng đó, kèm **mốc thời gian tương lai**, nói về kế hoạch **đã sắp xếp xong**: đã hẹn giờ với ai, đã mua vé, đã đặt chỗ — kiểu việc bạn **đã ghi vào lịch**. Người bản xứ dùng cách này **nhiều hơn going to** khi kể chuyện cuối tuần, cuộc hẹn, chuyến đi.",
    },
    {
      t: "patterns",
      rows: [
        {
          formula: "S + am / is / are + V-ing + mốc tương lai",
          vi: "Kế hoạch **đã hẹn / đã đặt**. Cần có **mốc thời gian** (tonight, tomorrow, on Friday, next week) hoặc ngữ cảnh đã rõ là tương lai — không có thì người nghe hiểu là “đang làm bây giờ”.",
          examples: [
            { en: "I'm meeting my tutor at 3 o'clock tomorrow.", vi: "Ba giờ chiều mai tôi gặp giáo viên hướng dẫn (đã hẹn)." },
            { en: "We're flying to Da Nang on Friday — I've already booked the tickets.", vi: "Thứ Sáu chúng tôi bay ra Đà Nẵng — tôi đặt vé rồi." },
            { en: "What are you doing this weekend?", vi: "Cuối tuần này bạn làm gì? (câu Part 1 rất hay gặp)" },
          ],
        },
      ],
    },
    {
      t: "sodo",
      kind: "compare",
      title: "going to (dự định) và hiện tại tiếp diễn (đã hẹn)",
      cols: [
        { title: "be going to — trong đầu", anh: "thought-balloon", items: ["Mới là **ý định** của mình", "I'm going to visit my grandparents some time this month.", "Chưa gọi điện, chưa định ngày"] },
        { title: "am / is / are + V-ing — trong lịch", anh: "spiral-calendar", items: ["Đã **sắp xếp** với người khác, đã đặt", "I'm visiting my grandparents on Sunday.", "Đã báo ông bà, đã có ngày giờ"] },
      ],
      caption: "Nhiều câu dùng được cả hai mà nghĩa gần như nhau. Khác biệt rõ nhất: có NGƯỜI KHÁC / VÉ / LỊCH HẸN → tiếp diễn tự nhiên hơn.",
    },
    {
      t: "note",
      title: "Hiện tại tiếp diễn KHÔNG dùng cho",
      items: [
        "**Dự đoán** và việc ngoài tầm tay mình: ~~It's raining tomorrow~~ → It**'s going to** rain / It **will** rain tomorrow.",
        "**Quyết định ngay lúc nói**: ~~“The door is open.” — “I'm closing it.”~~ → “**I'll** close it.”",
        "Động từ trạng thái (know, like, want, believe…) — như ở Tập 1: ~~I'm knowing the answer tomorrow~~ → I**'ll** know the answer tomorrow.",
      ],
    },
    {
      t: "rule",
      formula: "S + am / is / are + V-ing + tomorrow / on Friday / next week",
      vi: "Hiện tại tiếp diễn = kế hoạch ĐÃ HẸN, ĐÃ ĐẶT (có người khác, có vé, có giờ). Kèm mốc tương lai (hoặc ngữ cảnh đã rõ là tương lai).",
    },
    {
      t: "quiz",
      id: "t2d7-tiep-dien-dich",
      title: "Dịch sang tiếng Anh — kế hoạch đã hẹn (4 câu)",
      kind: "translate",
      grammar: "S + am / is / are + V-ing + mốc tương lai · What are you + V-ing + mốc?",
      items: [
        { q: "Tối nay tôi ăn tối với mấy người bạn cũ (đã hẹn).", hint: "I'm having dinner, with some old friends, tonight", answers: ["I'm having dinner with some old friends tonight.", "I am having dinner with some old friends tonight.", "Tonight I'm having dinner with some old friends.", "Tonight, I'm having dinner with some old friends.", "I'm having dinner with some old friends this evening.", "I'm having dinner with a few old friends tonight.", "I'm having dinner with old friends tonight."] },
        { q: "Thứ Bảy này bạn làm gì?", hint: "What are you doing, this Saturday / on Saturday", answers: ["What are you doing this Saturday?", "What are you doing on Saturday?", "What are you doing this Saturday", "What're you doing this Saturday?"] },
        { q: "Sáng mai chúng tôi đi thăm bảo tàng — tôi đặt chỗ rồi.", hint: "We're visiting, the museum, tomorrow morning, I've already booked", answers: ["We're visiting the museum tomorrow morning. I've already booked.", "We are visiting the museum tomorrow morning. I have already booked.", "We're visiting the museum tomorrow morning, I've already booked.", "We're visiting the museum tomorrow morning. I've already booked it.", "We're visiting the museum tomorrow morning — I've already booked.", "We're visiting the museum tomorrow morning; I've already booked."] },
        { q: "Tuần sau chị tôi chuyển đến Đà Lạt.", hint: "My sister, is moving to, Da Lat, next week", answers: ["My sister is moving to Da Lat next week.", "My sister's moving to Da Lat next week.", "Next week my sister is moving to Da Lat.", "Next week, my sister is moving to Da Lat.", "My older sister is moving to Da Lat next week.", "My elder sister is moving to Da Lat next week."] },
      ],
    },

    { t: "h", text: "4. Hiện tại đơn — lịch trình, thời gian biểu cố định" },
    {
      t: "p",
      text: "Với những việc theo **lịch công khai, không do mình quyết** — tàu xe chạy, chuyến bay, giờ mở cửa, lịch học, lịch thi, phim chiếu — tiếng Anh dùng **hiện tại đơn** dù việc đó ở tương lai. Đây chính là cách nói của **thông báo** trong Listening Part 1–2 (“The tour **starts** at 9.30”), nên nghe quen là bắt đáp án nhanh hơn.",
    },
    {
      t: "patterns",
      rows: [
        {
          formula: "S + V(s/es) + giờ / ngày (lịch cố định)",
          vi: "Hay đi với **leave · arrive · start · begin · finish · open · close · depart · take off**.",
          examples: [
            { en: "The last bus leaves at 10.45 tonight.", vi: "Chuyến xe buýt cuối rời bến lúc 10 giờ 45 tối nay." },
            { en: "Our English course starts on 3 March and finishes in May.", vi: "Khoá tiếng Anh của chúng tôi bắt đầu ngày 3/3 và kết thúc vào tháng Năm." },
            { en: "What time does the museum open tomorrow?", vi: "Ngày mai bảo tàng mở cửa lúc mấy giờ?" },
          ],
        },
      ],
    },
    {
      t: "note",
      title: "Đừng dùng hiện tại đơn cho kế hoạch riêng",
      items: [
        "~~I go to Da Lat next week~~ (kế hoạch riêng) → I**'m going** to Da Lat next week / I**'m going to go** to Da Lat next week.",
        "Nhưng: **My flight to Da Lat leaves at 7 a.m.** — đúng, vì giờ bay là **lịch của hãng**.",
        "Câu hỏi về lịch: **What time does** the train **arrive**? — nhớ **does / do** như mọi câu hiện tại đơn.",
      ],
    },
    {
      t: "rule",
      formula: "S + V(s/es) + giờ / ngày (tàu xe, chuyến bay, giờ mở cửa, lịch học, lịch thi)",
      vi: "Hiện tại đơn = lịch trình CÔNG KHAI, cố định, không do người nói quyết.",
    },
    {
      t: "quiz",
      id: "t2d7-lich-trinh-dich",
      title: "Dịch sang tiếng Anh — lịch trình (4 câu)",
      kind: "translate",
      grammar: "S + V(s/es) + giờ / ngày · What time does + S + V?",
      items: [
        { q: "Tàu khởi hành lúc 6 giờ 15 sáng mai.", hint: "The train, leaves / departs, at 6.15, tomorrow morning", answers: ["The train leaves at 6.15 tomorrow morning.", "The train leaves at 6:15 tomorrow morning.", "The train departs at 6.15 tomorrow morning.", "The train departs at 6:15 tomorrow morning.", "The train leaves at 6.15 a.m. tomorrow.", "The train leaves at 6:15 a.m. tomorrow.", "Tomorrow morning the train leaves at 6.15.", "The train leaves at a quarter past six tomorrow morning."] },
        { q: "Kỳ thi bắt đầu lúc 8 giờ thứ Hai tuần sau.", hint: "The exam, starts / begins, at 8, next Monday", answers: ["The exam starts at 8 next Monday.", "The exam starts at 8 o'clock next Monday.", "The exam begins at 8 next Monday.", "The exam begins at 8 o'clock next Monday.", "The exam starts at 8 a.m. next Monday.", "The exam begins at 8 a.m. next Monday.", "The test starts at 8 next Monday.", "The exam starts at eight next Monday.", "The exam starts next Monday at 8.", "The exam starts at 8 on Monday next week.", "The exam starts next Monday at 8 o'clock."] },
        { q: "Ngày mai thư viện mở cửa lúc mấy giờ?", hint: "What time, does the library open, tomorrow", answers: ["What time does the library open tomorrow?", "When does the library open tomorrow?", "What time does the library open tomorrow"] },
        { q: "Phim bắt đầu lúc 7 giờ 30, nên mình gặp nhau lúc 7 giờ nhé.", hint: "The film starts at 7.30, so, let's meet at 7", answers: ["The film starts at 7.30, so let's meet at 7.", "The film starts at 7:30, so let's meet at 7.", "The film starts at 7.30 so let's meet at 7.", "The movie starts at 7.30, so let's meet at 7.", "The movie starts at 7:30, so let's meet at 7.", "The film begins at 7.30, so let's meet at 7.", "The film starts at 7.30, so shall we meet at 7?", "The film starts at 7.30, so let's meet at 7 o'clock."] },
      ],
    },

    { t: "h", text: "5. Chọn đúng trong 4 cách — bản đồ quyết định" },
    {
      t: "sodo",
      kind: "flow",
      title: "Hỏi lần lượt, gặp “có” thì dừng",
      steps: [
        { label: "Lịch công khai, cố định?", sub: "tàu xe, phim, lịch học, giờ mở cửa → **hiện tại đơn**: The bus **leaves** at 8." },
        { label: "Đã hẹn / đã đặt với người khác?", sub: "có giờ, có vé, có người hẹn → **am / is / are + V-ing**: I**'m seeing** the doctor at 4." },
        { label: "Đã định từ trước, hoặc có bằng chứng?", sub: "→ **be going to**: I**'m going to** save money. · It**'s going to** fall!" },
        { label: "Vừa quyết định, ý kiến, hứa, đề nghị?", sub: "→ **will**: I**'ll** help you. · I think it **will** be cheaper." },
      ],
      caption: "Trong Speaking, nếu phân vân giữa ② và ③ thì cả hai thường chấp nhận được. Lỗi THẬT SỰ bị trừ điểm là dùng will cho mọi thứ, hoặc dùng hiện tại đơn cho kế hoạch riêng.",
    },
    {
      t: "sodo",
      kind: "compare",
      title: "Bốn cách — một bảng nhìn",
      cols: [
        { title: "Hiện tại đơn", anh: "bullet-train", items: ["**Lịch trình** cố định", "The train **leaves** at 6.", "leave · start · open · arrive"] },
        { title: "Hiện tại tiếp diễn", anh: "spiral-calendar", items: ["**Đã hẹn / đã đặt**", "I**'m meeting** Lan at 6.", "luôn kèm mốc tương lai"] },
        { title: "be going to", anh: "thought-balloon", items: ["**Đã định** · **bằng chứng**", "I**'m going to** move.", "Look! It's going to…"] },
        { title: "will", anh: "light-bulb", items: ["**Vừa nghĩ ra** · ý kiến · hứa", "I**'ll** call you.", "I think… will…"] },
      ],
    },
    {
      t: "mcq",
      id: "t2d7-chon-thi",
      title: "Luyện chọn — cách nói tương lai nào? (10 câu)",
      items: [
        { q: "(1) “I can't open this jar.” — “Give it to me. I ___ try.”", options: ["'m going to", "'ll", "'m trying"], correct: 1, why: "Quyết định **ngay lúc nói**, phản ứng với tình huống vừa xảy ra → **will**." },
        { q: "(2) The film ___ at 8.15, so we have time for dinner.", options: ["starts", "starting", "will be start"], correct: 0, why: "Giờ chiếu phim = **lịch cố định** → hiện tại đơn **starts**. “will be start” sai dạng." },
        { q: "(3) I ___ my cousin at the airport at 6 tomorrow — she sent me her flight number.", options: ["meeting", "meet", "'m meeting"], correct: 2, why: "Đã **hẹn** (có giờ, có người, có số chuyến bay) → hiện tại tiếp diễn. “meet” (hiện tại đơn) chỉ dùng cho lịch công khai." },
        { q: "(4) Look at that driver! He's driving too fast. He ___ crash.", options: ["is going to", "going to", "crashes"], correct: 0, why: "Dự đoán dựa vào **bằng chứng trước mắt** (đang chạy quá nhanh) → **going to**." },
        { q: "(5) I think robots ___ many jobs in the next 20 years.", options: ["are doing", "will do", "do"], correct: 1, why: "Dự đoán theo **ý kiến** (I think) về tương lai xa → **will**." },
        { q: "(6) “Why are you buying paint?” — “I ___ my bedroom this weekend.”", options: ["'ll paint", "paint", "'m going to paint"], correct: 2, why: "Mua sơn rồi ⇒ ý định có **từ trước** → **going to**. “'ll paint” sai vì không phải quyết định ngay lúc nói." },
        { q: "(7) What time ___ the shop ___ on Sundays?", options: ["will / opening", "does / open", "is / open"], correct: 1, why: "Giờ mở cửa = lịch cố định → câu hỏi hiện tại đơn **What time does… open?**" },
        { q: "(8) Câu nào ĐÚNG?", options: ["It probably won't be crowded.", "It won't probably be crowded.", "It will not probably crowded."], correct: 0, why: "Phủ định: **probably** đứng **trước won't**. Câu 3 còn thiếu **be**." },
        { q: "(9) “I'm so thirsty.” — “Wait here. I ___ you some water.”", options: ["'m getting", "get", "'ll get"], correct: 2, why: "Đề nghị giúp, nghĩ ra **ngay** → **I'll get**." },
        { q: "(10) Câu nào tự nhiên nhất khi trả lời “Have you got any plans for tonight?”", options: ["Yes, I'm going to the cinema with Minh — we've already got tickets.", "Yes, I go to the cinema with Minh.", "Yes, I will go to the cinema with Minh, we've already got tickets."], correct: 0, why: "Đã có vé, có người hẹn → **hiện tại tiếp diễn** (I'm going…). Câu 2 dùng hiện tại đơn cho kế hoạch riêng (sai); câu 3 dùng will cho việc đã sắp xếp (nghe như mới quyết định)." },
      ],
    },

    { t: "h", text: "6. Mệnh đề thời gian: when / after / before / until / as soon as + HIỆN TẠI" },
    {
      t: "p",
      text: "Câu có hai vế — một vế chính và một vế bắt đầu bằng **when, after, before, until, as soon as** — dù cả câu nói về tương lai, **vế thời gian dùng hiện tại đơn**, chỉ **vế chính** dùng will / going to / mệnh lệnh. Tiếng Việt nói “khi tôi **sẽ** tốt nghiệp” không sai, nên người Việt rất hay viết ~~when I will graduate~~. Mục này chỉ là bước nhập — **Ngày 13** sẽ học kỹ cùng câu điều kiện loại 1.",
    },
    {
      t: "patterns",
      rows: [
        {
          formula: "When / After / Before / As soon as + S + V(s/es), S + will + V",
          vi: "Vế thời gian đứng **trước** → có **dấu phẩy**. Đứng **sau** → không cần dấu phẩy.",
          examples: [
            { en: "When I finish university, I'll look for a job in Hanoi.", vi: "Khi tôi học xong đại học, tôi sẽ tìm việc ở Hà Nội." },
            { en: "I'll call you as soon as I arrive.", vi: "Tôi sẽ gọi cho bạn ngay khi tôi đến nơi." },
            { en: "We're going to wait until the rain stops.", vi: "Chúng tôi sẽ đợi cho tới khi mưa tạnh." },
          ],
        },
      ],
    },
    {
      t: "rule",
      formula: "when / after / before / until / as soon as + S + V(s/es) — vế chính: will / going to",
      vi: "Vế thời gian KHÔNG dùng will dù nói về tương lai: ~~when I will arrive~~ → when I arrive.",
    },
    {
      t: "quiz",
      id: "t2d7-menh-de-dich",
      title: "Dịch sang tiếng Anh — mệnh đề thời gian (3 câu)",
      kind: "translate",
      grammar: "When / As soon as / Before + S + V(s/es), S + will + V",
      items: [
        { q: "Khi tôi tốt nghiệp, tôi sẽ đi du lịch Nhật Bản.", hint: "When I graduate, I'll travel to Japan", answers: ["When I graduate, I'll travel to Japan.", "When I graduate, I will travel to Japan.", "When I graduate I'll travel to Japan.", "I'll travel to Japan when I graduate.", "I will travel to Japan when I graduate.", "When I graduate, I'm going to travel to Japan.", "When I graduate, I'll visit Japan.", "When I graduate, I'm going to visit Japan."] },
        { q: "Tôi sẽ nhắn tin cho bạn ngay khi xe buýt đến.", hint: "I'll text you, as soon as, the bus arrives / comes", answers: ["I'll text you as soon as the bus arrives.", "I will text you as soon as the bus arrives.", "I'll text you as soon as the bus comes.", "I'll message you as soon as the bus arrives.", "As soon as the bus arrives, I'll text you.", "As soon as the bus comes, I'll text you.", "I'll send you a message as soon as the bus arrives."] },
        { q: "Trước khi bạn rời đi, nhớ tắt đèn nhé.", hint: "Before you leave, remember to / please, turn off the lights", answers: ["Before you leave, remember to turn off the lights.", "Before you leave, please turn off the lights.", "Remember to turn off the lights before you leave.", "Please turn off the lights before you leave.", "Before you leave, remember to switch off the lights.", "Before you leave, don't forget to turn off the lights.", "Before you leave, remember to turn off the light.", "Before you leave, remember to turn the lights off.", "Remember to turn off the light before you leave.", "Before you leave, please turn off the light.", "Before you go, remember to turn off the lights."] },
      ],
    },

    { t: "h", text: "7. Tương lai trong bài thi IELTS" },
    {
      t: "table",
      head: ["Phần thi", "Câu hỏi / tình huống", "Cách nói tương lai hợp nhất"],
      rows: [
        ["**Speaking Part 1**", "What are you doing this weekend? · Do you think you'll stay in your hometown?", "**I'm + V-ing** (đã hẹn) · **I'm going to** (dự định) · **I think I'll probably…** (ý kiến)"],
        ["**Speaking Part 2**", "Describe a place **you would like to visit**", "I'd like to · I'm hoping to · I'm going to · When I get there, I'll…"],
        ["**Speaking Part 3**", "How will cities change in the future?", "**will probably** · **is likely to** · **I don't think… will**"],
        ["**Writing Task 1**", "Biểu đồ có **năm tương lai** (dự báo 2030, 2050)", "**is expected / predicted / projected to + V** · **will + V**"],
        ["**Writing Task 2**", "Nêu hệ quả, giải pháp", "This **will** lead to… · Governments **should**… (Ngày 14)"],
        ["**Listening Part 1–2**", "Thông báo, lịch trình", "Nghe **hiện tại đơn**: The tour **leaves** at… · The office **closes** at…"],
      ],
    },
    {
      t: "patterns",
      rows: [
        {
          formula: "S + is / are + expected / predicted / projected + to + V",
          vi: "Ngôn ngữ **dự báo** của Task 1 (số liệu tương lai là **dự đoán** của người khác, không phải của bạn). Ba từ gần nghĩa: được dự kiến / dự đoán / dự phóng.",
          examples: [
            { en: "The number of electric cars is expected to reach 2 million by 2030.", vi: "Số ô tô điện được dự kiến đạt 2 triệu chiếc vào năm 2030." },
            { en: "Bus use is predicted to fall slightly over the next decade.", vi: "Lượng người đi xe buýt được dự đoán sẽ giảm nhẹ trong thập kỷ tới." },
          ],
        },
        {
          formula: "S + is / are + likely / unlikely + to + V",
          vi: "**Có khả năng / không có khả năng** — dự đoán có mức độ, rất hợp Part 3 và Task 2.",
          examples: [{ en: "More people are likely to work from home in the future.", vi: "Trong tương lai có lẽ nhiều người sẽ làm việc ở nhà hơn." }],
        },
      ],
    },
    {
      t: "sodo",
      kind: "flow",
      title: "Thang độ chắc chắn khi dự đoán (Part 3, Task 2)",
      steps: [
        { label: "will definitely", sub: "chắc chắn sẽ" },
        { label: "will probably · is likely to", sub: "có lẽ sẽ" },
        { label: "may / might", sub: "có thể sẽ (Tập 1 Ngày 13)" },
        { label: "probably won't · is unlikely to", sub: "có lẽ sẽ không" },
        { label: "definitely won't", sub: "chắc chắn không" },
      ],
      caption: "Band 5+ không nói chắc nịch mọi thứ. Một câu “will probably” đúng chỗ cho giám khảo thấy bạn kiểm soát được mức độ.",
    },
    {
      t: "rule",
      formula: "S + is / are + expected / likely + to + V · S + will probably + V",
      vi: "Dự báo trong Task 1 (expected / predicted / projected to) và dự đoán có mức độ trong Part 3 (likely to, will probably).",
    },
    {
      t: "quiz",
      id: "t2d7-du-bao-dich",
      title: "Dịch sang tiếng Anh — dự báo, dự đoán (3 câu)",
      kind: "translate",
      grammar: "S + is expected / predicted to + V + by + năm · S + is / are likely to + V · S + will probably + V",
      items: [
        { q: "Dân số thành phố được dự kiến đạt 10 triệu người vào năm 2040.", hint: "The city's population, is expected to reach, 10 million, by 2040", answers: ["The city's population is expected to reach 10 million by 2040.", "The population of the city is expected to reach 10 million by 2040.", "The city's population is predicted to reach 10 million by 2040.", "The city's population is projected to reach 10 million by 2040.", "The population of the city is predicted to reach 10 million by 2040.", "The population of the city is projected to reach 10 million by 2040.", "The city's population is expected to reach 10 million people by 2040.", "The population of the city is expected to reach 10 million people by 2040."] },
        { q: "Giới trẻ có khả năng sẽ đọc báo giấy ít hơn.", hint: "Young people, are likely to, read, fewer printed newspapers / print newspapers less", answers: ["Young people are likely to read fewer printed newspapers.", "Young people are likely to read printed newspapers less.", "Young people are likely to read print newspapers less.", "Young people are likely to read fewer paper newspapers.", "Young people are likely to read newspapers less.", "Young people are likely to read fewer newspapers.", "Young people will probably read fewer printed newspapers."] },
        { q: "Tôi không nghĩ ô tô sẽ biến mất.", hint: "I don't think, cars will disappear", answers: ["I don't think cars will disappear.", "I do not think cars will disappear.", "I don't think that cars will disappear.", "I don't think cars are going to disappear."] },
      ],
    },

    { t: "h", text: "8. Lỗi người Việt hay mắc" },
    {
      t: "note",
      title: "Người Việt hay sai khi nói tương lai",
      items: [
        "~~I will going to the cinema~~ → I **will go** / I**'m going** to the cinema. Sau will là **V nguyên mẫu**.",
        "~~I will to call you~~ → I **will call** you. will không có **to** theo sau.",
        "~~When I will finish my degree, I will…~~ → **When I finish** my degree, I will… (mục 6).",
        "~~I go to Da Lat next week~~ (kế hoạch riêng) → I**'m going** to Da Lat next week.",
        "~~Tomorrow I am go to school~~ → Tomorrow I **am going** to school / I**'m going to go**… Thiếu **-ing** hoặc thiếu **to**.",
        "Dùng **will** cho mọi “sẽ”: “What are you doing tonight?” — ~~I will watch a film with my sister~~ (nghe như vừa nghĩ ra) → I**'m watching** / I**'m going to watch** a film with my sister.",
        "~~It won't probably…~~ → It **probably won't**… (mục 1).",
        "Task 1: tả số liệu **dự báo** bằng **is expected to / is predicted to** hoặc will — đừng dùng quá khứ cho năm tương lai: ~~In 2040, the figure rose~~ → In 2040, the figure **is expected to rise**.",
      ],
    },
    {
      t: "mcq",
      id: "t2d7-tim-loi",
      title: "Tìm câu đúng (5 câu)",
      items: [
        { q: "(1)", options: ["When I will get my results, I'll tell you.", "When I get my results, I'll tell you.", "When I get my results, I told you."], correct: 1, why: "Vế **when** dùng hiện tại đơn, vế chính dùng **will**. Câu 3 lẫn hiện tại với quá khứ." },
        { q: "(2)", options: ["The number of tourists is expected to double by 2035.", "The number of tourists expects to double by 2035.", "The number of tourists is expected double by 2035."], correct: 0, why: "Cấu trúc bị động **is expected + to + V**. Câu 2 sai nghĩa (số du khách tự “mong đợi”); câu 3 thiếu **to**." },
        { q: "(3)", options: ["I'm going study abroad next year.", "I going to study abroad next year.", "I'm going to study abroad next year."], correct: 2, why: "Đủ ba phần: **am + going to + V**." },
        { q: "(4)", options: ["Shall I help you with your bags?", "Shall you help me with my bags?", "Will I help you with your bags?"], correct: 0, why: "**Shall I…?** = đề nghị giúp. “Shall you” không dùng; “Will I help you?” nghe như hỏi về tương lai của chính mình." },
        { q: "(5)", options: ["Our flight leave at 6.40 and land at 8.", "Our flight leaves at 6.40 and lands at 8.", "Our flight will leaving at 6.40 and lands at 8."], correct: 1, why: "Giờ bay = lịch của hãng → **hiện tại đơn**, chủ ngữ số ít nên **leaves… lands** có -s. Câu 1 thiếu -s; câu 3 sai “will leaving”." },
      ],
    },
  ],
};

/* ─────────────────────────── Nghe ─────────────────────────── */

const T2D7_NGHE: Lesson = {
  id: "t2d7-nghe",
  kind: "listening",
  title: "Nghe: Listening Part 2 — Map labelling, ngôn ngữ vị trí (giọng Mỹ)",
  goal: "Làm trọn một bài Listening Part 2 (5 câu trắc nghiệm + 5 câu ghi chữ cái lên mặt bằng toà nhà) bằng giọng Mỹ: đổi trái / phải theo hướng đi, hiểu 15 cụm vị trí (diagonally opposite, at the far end, halfway along…), nhận ra từ Mỹ (parking lot, restroom, first floor) — đích 7/10 câu đúng, mức Part 2 của band 5.",
  minutes: 65,
  blocks: [
    {
      t: "recap",
      title: "Bài này học gì · đẩy band nào",
      items: [
        "**Part 2** = câu **11–20**: thường **một người nói** về một nơi / sự kiện (hướng dẫn tham quan, giới thiệu cơ sở). Hay gặp: **trắc nghiệm** + **ghi nhãn bản đồ / mặt bằng** (Map / Plan labelling).",
        "Tập 1 Ngày 9 đã làm bản đồ ngoài trời. Hôm nay khó hơn: **mặt bằng trong nhà** có **hành lang vòng quanh sân trong** — rẽ một góc là **trái / phải đổi theo**.",
        "15 cụm **vị trí** mức band 5: ==diagonally opposite · at the far end · halfway along · adjacent to · beyond · clockwise / counterclockwise==…",
        "**Giọng Mỹ** lần đầu (lộ trình L17): /r/ đọc rõ ở cuối từ (car, corner), /t/ giữa hai nguyên âm thành âm “đờ” nhẹ (water, theater), và **từ Mỹ** (parking lot = car park, first floor = ground floor).",
        "Đích: **≥ 7/10** câu ở bài Part 2 trọn vẹn — mốc Listening band 5 (Part 1+2 ≥ 14/20).",
        "Thêm (mục 6): **Diagram labelling** — ghi tên bộ phận trên sơ đồ một thiết bị (bàn xoay làm gốm), 5 câu ONE WORD ONLY.",
      ],
    },

    { t: "h", text: "1. Part 2 và dạng Map / Plan labelling" },
    {
      t: "table",
      head: ["Đặc điểm", "Part 2 (câu 11–20)"],
      rows: [
        ["Người nói", "Thường **1 người** (hướng dẫn viên, quản lý, người dẫn chương trình radio); đôi khi có người thứ hai hỏi 1–2 câu"],
        ["Chủ đề", "Đời sống: tham quan toà nhà / công viên / bảo tàng, giới thiệu câu lạc bộ, sự kiện cộng đồng"],
        ["Dạng câu hỏi", "**Multiple choice** (chọn A, B hoặc C) · **Map / Plan labelling** (ghi chữ cái A–I) · Matching · Note completion"],
        ["Thời gian đọc", "Trước mỗi nhóm câu có khoảng **30 giây** đọc đề — dùng để tìm **điểm xuất phát** và **hướng** trên hình"],
        ["Bẫy hay gặp", "Nhắc **đủ cả ba** lựa chọn A / B / C; “**used to be… but now**”; ô bản đồ **thừa** được nhắc tới nhưng không hỏi"],
      ],
    },
    {
      t: "sodo",
      kind: "flow",
      title: "Cách làm Map / Plan labelling",
      steps: [
        { label: "30 giây đọc hình", sub: "Tìm **You are here / Entrance**, hướng **Bắc**, lối đi chính, các ô **đã có tên** (mốc)" },
        { label: "Đọc danh sách địa điểm", sub: "Câu hỏi **đi theo thứ tự** lời nói — câu 17 nói sau câu 16" },
        { label: "Đặt ngón tay ở lối vào", sub: "Nghe câu chuyển: “Now, if you look at the plan…”" },
        { label: "Di ngón tay theo lời", sub: "Mỗi lần **rẽ**: xoay đầu theo hướng đi — trái / phải đổi theo" },
        { label: "Chốt khi nghe đủ câu", sub: "Chờ hết “**…but it's now** the storage room” rồi mới ghi" },
      ],
      caption: "Trái / phải luôn tính theo người ĐANG ĐI, không theo tờ giấy. Đi xuống phía Nam của tờ giấy thì bên trái của người đi là bên PHẢI của tờ giấy.",
    },

    { t: "h", text: "2. Ngôn ngữ vị trí và chỉ đường (vòng 2)" },
    {
      t: "p",
      text: "Tập 1 đã dạy **next to, opposite, between, behind, turn left / right, go straight on**. Part 2 band 5 dùng thêm những cụm **chính xác hơn** dưới đây — người nói thường dùng **hai cụm liền nhau** để khoá vị trí: “It's **at the far end** of the corridor, **on your left**.”",
    },
    {
      t: "table",
      caption: "Cụm vị trí hay gặp ở Part 2",
      head: ["Cụm", "Nghĩa", "Hình dung"],
      rows: [
        ["**diagonally opposite** X", "chéo đối diện X (góc bên kia)", "X ở góc dưới trái → nó ở góc trên phải"],
        ["**directly opposite** X", "đối diện thẳng X", "hai bên một lối đi, nhìn thẳng sang nhau"],
        ["**at the far end** (of the corridor)", "ở tận cuối (hành lang)", "điểm xa nhất tính từ chỗ bạn đứng"],
        ["**halfway along** (the path)", "ở giữa (lối đi)", "đi được một nửa"],
        ["**adjacent to** X = **next to** X", "sát cạnh X", "chung một bức tường"],
        ["**beyond** X / **just past** X", "đi quá X một chút", "X trước, nó ngay sau"],
        ["**in the north-east corner**", "ở góc đông bắc", "góc trên – phải của bản đồ (Bắc ở trên)"],
        ["**just inside** the entrance", "ngay phía trong lối vào", "vừa bước qua cửa"],
        ["**alongside** X", "chạy dọc theo X", "song song với lối đi / bức tường"],
        ["**clockwise** / **counterclockwise** (Mỹ) · **anticlockwise** (Anh)", "theo / ngược chiều kim đồng hồ", "đi vòng quanh sân, hồ, quảng trường"],
        ["**the second room on your left**", "phòng thứ hai bên trái bạn", "đếm theo hướng đang đi"],
        ["**follow the corridor round**", "đi theo hành lang vòng qua góc", "hành lang rẽ thì bạn rẽ theo"],
      ],
    },
    {
      t: "vocab",
      items: [
        { w: "diagonally opposite", pos: "phr", ipa: "/daɪˈæɡənəli ˈɒpəzɪt/", vi: "chéo đối diện", ex: "The restrooms are diagonally opposite the elevator.", exVi: "Nhà vệ sinh ở chéo đối diện thang máy.", more: "**diagonal** (adj) đường chéo. Khác **directly opposite** = đối diện thẳng." },
        { w: "at the far end", pos: "phr", ipa: "/ət ðə ˈfɑːr end/", vi: "ở tận cuối", ex: "The music room is at the far end of the corridor.", exVi: "Phòng nhạc ở tận cuối hành lang.", more: "**at the far end of** + nơi. Đối lập: **at this end / at the near end**." },
        { w: "halfway along", pos: "phr", ipa: "/ˌhɑːfˈweɪ əˈlɒŋ/", vi: "ở khoảng giữa (lối đi, con đường)", ex: "There's a bench halfway along the path.", exVi: "Có một chiếc ghế dài ở khoảng giữa lối đi.", more: "**halfway up / down** the stairs · **halfway between** A and B." },
        { w: "adjacent to", pos: "adj + prep", ipa: "/əˈdʒeɪsnt tə/", vi: "sát cạnh, liền kề", ex: "The ticket office is adjacent to the main entrance.", exVi: "Phòng bán vé nằm sát lối vào chính.", more: "Trang trọng hơn **next to**. Hay gặp trong Writing Task 1 bản đồ." },
        { w: "beyond", pos: "prep", ipa: "/bɪˈjɒnd/", vi: "ở phía bên kia, đi quá", ex: "The playground is beyond the pond.", exVi: "Sân chơi ở phía bên kia hồ.", more: "≈ **just past** (ngay sau khi đi qua)." },
        { w: "clockwise", pos: "adv", ipa: "/ˈklɒkwaɪz/", vi: "theo chiều kim đồng hồ", ex: "Walk clockwise around the lake.", exVi: "Đi vòng quanh hồ theo chiều kim đồng hồ.", more: "Ngược lại: **anticlockwise** (Anh) = **counterclockwise** (Mỹ).", anh: "clockwise-vertical-arrows" },
        { w: "corridor", pos: "n", ipa: "/ˈkɒrɪdɔː(r)/", vi: "hành lang", ex: "Follow the corridor round to the left.", exVi: "Đi theo hành lang vòng sang trái.", more: "Mỹ hay nói **hallway** /ˈhɔːlweɪ/." },
        { w: "courtyard", pos: "n", ipa: "/ˈkɔːtjɑːd/", vi: "sân trong (được toà nhà bao quanh)", ex: "The café looks out onto the courtyard.", exVi: "Quán cà phê nhìn ra sân trong." },
        { w: "parking lot", pos: "n (Mỹ)", ipa: "/ˈpɑːkɪŋ lɒt/ · Mỹ /ˈpɑːrkɪŋ lɑːt/", vi: "bãi đỗ xe (Anh: car park)", ex: "The parking lot is behind the library.", exVi: "Bãi đỗ xe ở phía sau thư viện.", more: "Mỹ: parking lot · Anh: **car park**.", anh: "p-button" },
        { w: "restroom", pos: "n (Mỹ)", ipa: "/ˈrestruːm/", vi: "nhà vệ sinh công cộng (Anh: toilets)", ex: "The restrooms are next to the elevator.", exVi: "Nhà vệ sinh ở cạnh thang máy.", more: "Anh: **the toilets / the ladies' / the gents'**.", anh: "restroom" },
        { w: "elevator", pos: "n (Mỹ)", ipa: "/ˈelɪveɪtə(r)/", vi: "thang máy (Anh: lift)", ex: "Take the elevator to the third floor.", exVi: "Đi thang máy lên tầng ba.", anh: "elevator" },
        { w: "renovation", pos: "n", ipa: "/ˌrenəˈveɪʃn/", vi: "sự cải tạo, sửa sang", ex: "The building was closed for renovation.", exVi: "Toà nhà đóng cửa để cải tạo.", more: "Động từ **renovate** /ˈrenəveɪt/. Cụm: **closed for renovation**." },
      ],
    },
    {
      t: "canh",
      anh: ["woman-office-worker", "man-office-worker", "round-pushpin"],
      caption: "Practice 1 — sáu câu ngắn, giọng Mỹ. Mỗi câu nói vị trí của MỘT nơi. Chọn mô tả đúng.",
    },
    {
      t: "listen",
      id: "t2d7-nghe-vi-tri",
      title: "Where is it?",
      dan: { so: "Day 7, Practice 1", boiCanh: "six short statements about where places are.", cau: [1, 6] },
      note: "Khoảng 1 phút, hai giọng Mỹ. Nghe mỗi câu một lần rồi chọn.",
      lines: [
        { who: "Narrator", voice: "dan", text: "Number one." },
        { who: "Guide", voice: "us-nu", text: "The restrooms are diagonally opposite the elevator.", vi: "Nhà vệ sinh ở chéo đối diện thang máy." },
        { who: "Narrator", voice: "dan", text: "Number two." },
        { who: "Guide", voice: "us-nam", text: "You'll find the lockers about halfway along the hallway, on your left.", vi: "Tủ đồ ở khoảng giữa hành lang, bên trái bạn." },
        { who: "Narrator", voice: "dan", text: "Number three." },
        { who: "Guide", voice: "us-nu", text: "Walk past the library, and the study room is just beyond it.", vi: "Đi qua thư viện, phòng tự học ở ngay phía sau." },
        { who: "Narrator", voice: "dan", text: "Number four." },
        { who: "Guide", voice: "us-nam", text: "The ticket office is adjacent to the main entrance, so you can't miss it.", vi: "Phòng bán vé nằm sát lối vào chính nên bạn không thể không thấy." },
        { who: "Narrator", voice: "dan", text: "Number five." },
        { who: "Guide", voice: "us-nu", text: "The playground is at the far end of the park, beyond the pond.", vi: "Sân chơi ở tận cuối công viên, phía bên kia hồ." },
        { who: "Narrator", voice: "dan", text: "Number six." },
        { who: "Guide", voice: "us-nam", text: "Walk around the lake counterclockwise, so keep the water on your left, and the boathouse is the second building you come to.", vi: "Đi vòng quanh hồ ngược chiều kim đồng hồ, tức là giữ mặt nước bên tay trái, và nhà thuyền là toà nhà thứ hai bạn gặp." },
      ],
    },
    {
      t: "mcq",
      id: "t2d7-nghe-vi-tri-chon",
      title: "Practice 1 — chọn mô tả đúng (6 câu)",
      items: [
        { q: "(1) Nhà vệ sinh (restrooms) ở đâu so với thang máy?", options: ["Ngay sát cạnh thang máy", "Ở góc chéo bên kia so với thang máy", "Ngay đối diện thẳng thang máy"], correct: 1, why: "**diagonally opposite** = chéo đối diện, không phải đối diện thẳng (**directly opposite**)." },
        { q: "(2) Tủ đồ (lockers) ở đâu?", options: ["Ở khoảng giữa hành lang, bên trái", "Ở đầu hành lang, bên phải", "Ở cuối hành lang, bên trái"], correct: 0, why: "**halfway along** the hallway = khoảng giữa hành lang; **on your left** = bên trái." },
        { q: "(3) Phòng tự học (study room) ở đâu?", options: ["Ngay sau thư viện khi bạn đi qua nó", "Ngay trước thư viện", "Bên trong thư viện"], correct: 0, why: "“Walk **past** the library… just **beyond** it” = đi qua thư viện, phòng tự học ở ngay sau." },
        { q: "(4) Phòng bán vé (ticket office) ở đâu?", options: ["Ở cuối toà nhà", "Đối diện lối vào chính", "Sát cạnh lối vào chính"], correct: 2, why: "**adjacent to** = sát cạnh. “you can't miss it” = dễ thấy." },
        { q: "(5) Sân chơi (playground) ở đâu?", options: ["Ngay cổng công viên", "Ở giữa công viên, trước hồ", "Ở tận cuối công viên, phía bên kia hồ"], correct: 2, why: "**at the far end** = tận cuối; **beyond the pond** = phía bên kia hồ." },
        { q: "(6) Đi đến nhà thuyền (boathouse) thế nào?", options: ["Đi vòng theo chiều kim đồng hồ, toà nhà đầu tiên", "Đi vòng ngược chiều kim đồng hồ, toà nhà thứ hai", "Đi thẳng qua hồ"], correct: 1, why: "**counterclockwise** (Mỹ) = anticlockwise (Anh) = ngược chiều kim đồng hồ; **the second building** = toà thứ hai." },
      ],
    },

    { t: "h", text: "3. Giọng Mỹ — nghe khác giọng Anh ở đâu?" },
    {
      t: "p",
      text: "Đề IELTS thật **trộn nhiều giọng**: Anh, Mỹ, Úc, Canada… Từ nay mỗi bài nghe của Tập 2 có ít nhất **hai giọng**. Giọng Mỹ không khó hơn giọng Anh — chỉ **khác ở vài chỗ cố định**. Biết trước 4 chỗ dưới đây là đỡ được phần lớn bất ngờ.",
    },
    {
      t: "table",
      caption: "Bốn khác biệt phát âm hay gặp nhất",
      head: ["Điểm khác", "Giọng Anh (UK)", "Giọng Mỹ (US)", "Ví dụ"],
      rows: [
        ["**/r/ sau nguyên âm**", "**Không đọc** r: car /kɑː/, corner /ˈkɔːnə/", "**Đọc rõ** r: car /kɑːr/, corner /ˈkɔːrnər/", "park · first · floor · center · water"],
        ["**/t/ giữa hai nguyên âm (hoặc sau /r/), trước âm tiết KHÔNG nhấn**", "/t/ rõ: water /ˈwɔːtə/", "thành âm “đờ” nhẹ (flap): water ≈ “woa-đờ”, better ≈ “be-đờ”", "city · party · thirty · forty · meeting (nhưng ho**TEL**, thir**TEEN**: âm tiết sau có nhấn → vẫn /t/ rõ)"],
        ["**a trong can't, path, ask, half**", "/ɑː/ dài: can't /kɑːnt/, path /pɑːθ/", "/æ/: can't /kænt/, path /pæθ/", "dễ nghe nhầm **can't** thành **can** ⇒ nghe cả câu"],
        ["**o trong hot, stop, lot**", "/ɒ/ tròn môi: hot /hɒt/", "/ɑː/ mở miệng: hot /hɑːt/, lot /lɑːt/", "parking **lot** · **stop** · **job** · **got**"],
      ],
    },
    {
      t: "table",
      caption: "Từ Mỹ và từ Anh — hay gặp ở Part 1–2",
      head: ["Mỹ (US)", "Anh (UK)", "Nghĩa"],
      rows: [
        ["parking lot", "car park", "bãi đỗ xe"],
        ["restroom", "toilet(s)", "nhà vệ sinh"],
        ["elevator", "lift", "thang máy"],
        ["**first floor**", "**ground floor**", "tầng trệt (tầng sát mặt đất) — ⚠️ “second floor” của Mỹ = “first floor” của Anh"],
        ["line", "queue", "hàng (người xếp hàng)"],
        ["sidewalk", "pavement", "vỉa hè"],
        ["schedule /ˈskedʒuːl/", "timetable · schedule /ˈʃedjuːl/", "thời gian biểu, lịch"],
        ["downtown", "city centre", "trung tâm thành phố"],
        ["center · theater · color", "centre · theatre · colour", "cách VIẾT khác — trong bài thi viết kiểu nào cũng được, miễn **thống nhất** một kiểu"],
      ],
    },
    {
      t: "note",
      title: "Cẩn thận với giọng Mỹ ở bài thi",
      items: [
        "**can / can't**: giọng Mỹ đọc can't /kænt/ rất gần **can** — /t/ cuối gần như mất. Mẹo: **can** trong câu khẳng định thường đọc **yếu** /kən/; **can't** luôn **mạnh, dài**.",
        "**thirty / thirteen**: flap làm thirty nghe như “thơ-đi”; trọng âm vẫn là chỗ phân biệt: **THIR**ty (nhấn đầu) · thir**TEEN** (nhấn cuối).",
        "**first floor**: Đề nói “on the **first floor**” bằng giọng Mỹ = tầng **trệt**. Nếu bản đồ ghi “Ground floor / First floor” kiểu Anh, nghe cả câu để biết người nói đang ở hệ nào.",
        "Chính tả đáp án: viết **center** hay **centre** đều được chấm đúng; nhưng **chép sai chữ** (cener) là sai.",
      ],
    },
    {
      t: "listen",
      id: "t2d7-nghe-giong-my",
      title: "American English — six sentences",
      dan: { so: "Day 7, Practice 2", boiCanh: "six sentences spoken with American accents.", cau: [1, 6] },
      note: "Khoảng 1 phút. Mỗi câu thiếu MỘT từ trong câu hỏi bên dưới — nghe và điền.",
      lines: [
        { who: "Narrator", voice: "dan", text: "One." },
        { who: "Speaker", voice: "us-nam", text: "You can get a free bottle of water at the front desk.", vi: "Bạn có thể lấy một chai nước miễn phí ở quầy lễ tân." },
        { who: "Narrator", voice: "dan", text: "Two." },
        { who: "Speaker", voice: "us-nu", text: "The theater is on the second floor, right above the café.", vi: "Nhà hát ở tầng hai (kiểu Mỹ), ngay phía trên quán cà phê." },
        { who: "Narrator", voice: "dan", text: "Three." },
        { who: "Speaker", voice: "us-nam", text: "Let's meet at the fountain in the center of the park.", vi: "Mình gặp nhau ở đài phun nước giữa công viên nhé." },
        { who: "Narrator", voice: "dan", text: "Four." },
        { who: "Speaker", voice: "us-nu", text: "If the line is too long, you can pay at the machine instead.", vi: "Nếu hàng quá dài, bạn có thể trả tiền ở máy." },
        { who: "Narrator", voice: "dan", text: "Five." },
        { who: "Speaker", voice: "us-nam", text: "The bus schedule changed last month, so please check the website.", vi: "Lịch xe buýt đã thay đổi tháng trước, nên hãy kiểm tra trang web." },
        { who: "Narrator", voice: "dan", text: "Six." },
        { who: "Speaker", voice: "us-nu", text: "Sorry, you can't park here. The parking lot is across the street.", vi: "Xin lỗi, bạn không được đỗ ở đây. Bãi đỗ xe ở bên kia đường." },
      ],
    },
    {
      t: "quiz",
      id: "t2d7-nghe-giong-my-dien",
      title: "Practice 2 — điền MỘT từ (6 câu)",
      kind: "fill",
      items: [
        { q: "(1) You can get a free bottle of ___ at the front desk.", answers: ["water"] },
        { q: "(2) The ___ is on the second floor, right above the café.", answers: ["theater", "theatre"] },
        { q: "(3) Let's meet at the fountain in the ___ of the park.", answers: ["center", "centre"] },
        { q: "(4) If the ___ is too long, you can pay at the machine instead.", answers: ["line", "queue"] },
        { q: "(5) The bus ___ changed last month.", answers: ["schedule", "timetable"] },
        { q: "(6) Sorry, you ___ park here. (một từ, dạng rút gọn)", answers: ["can't", "cannot"] },
      ],
    },
    {
      t: "note",
      title: "Giải thích Practice 2",
      items: [
        "**(1) water** — giọng Mỹ: /t/ giữa hai nguyên âm thành âm “đờ” nhẹ, /r/ cuối đọc rõ ⇒ nghe như “woa-đờr”.",
        "**(2) theater** — cách viết Mỹ; **theatre** (Anh) cũng đúng. Chú ý **second floor** kiểu Mỹ = **first floor** kiểu Anh (tầng trên tầng trệt một tầng).",
        "**(3) center / centre** — hai cách viết đều đúng. /r/ cuối đọc rõ.",
        "**(4) line** — từ Mỹ cho **queue**. Viết queue vẫn được chấm đúng ở bài luyện này vì cùng nghĩa, nhưng ở bài thi thật hãy **chép đúng từ đã nghe**.",
        "**(5) schedule** — Mỹ đọc /ˈskedʒuːl/ (có /k/), Anh hay đọc /ˈʃedjuːl/. Nghe /sk/ đầu từ đừng nghĩ là từ khác. Viết **timetable** (từ Anh, cùng nghĩa) vẫn được chấm đúng ở bài luyện này, nhưng ở bài thi thật chỉ nhận **đúng từ đã nghe**: schedule.",
        "**(6) can't** — /kænt/ kiểu Mỹ, /t/ cuối rất nhẹ. Dựa vào **nghĩa cả câu**: “Sorry… The parking lot is across the street” ⇒ ở đây **không được** đỗ.",
      ],
    },

    { t: "h", text: "4. Bài Part 2 trọn vẹn — câu 11–20" },
    {
      t: "canh",
      anh: ["woman-office-worker", "man-raising-hand", "house-with-garden"],
      caption: "**Karen Walsh**, quản lý **Alder Creek Community Center** (một trung tâm cộng đồng ở Mỹ), nói chuyện với nhóm thành viên mới sau khi trung tâm cải tạo xong. Một thành viên, **Mike**, hỏi một câu giữa chừng.",
    },
    {
      t: "p",
      text: "**Questions 11–15.** Choose the correct letter, **A, B or C**. — **Questions 16–20.** Label the plan below. Write the correct letter, **A–H**, next to Questions 16–20. Đọc trước **cả hai nhóm câu** và **mặt bằng** (khoảng 1 phút), tìm lối vào chính, rồi mới bấm Nghe.",
    },
    {
      t: "table",
      caption: "Questions 11–15 (đọc trước)",
      head: ["Câu", "Câu hỏi", "A", "B", "C"],
      rows: [
        ["11", "The center reopened after the renovation in", "January", "March", "May"],
        ["12", "What is new in the building?", "an elevator", "a second gym", "a larger parking lot"],
        ["13", "How much does a family membership cost now?", "$55", "$80", "$70"],
        ["14", "People who want to use the pottery studio", "must complete a safety class first", "must reserve a place online", "must bring their own clay"],
        ["15", "What does Karen say about the café?", "It only accepts card payments.", "It closes earlier on weekends.", "It is run by volunteers."],
      ],
    },
    {
      t: "figure",
      fig: {
        kind: "map",
        title: "Alder Creek Community Center — ghi chữ cái A–H cho câu 16–20",
        note: "Mặt bằng tự vẽ cho bài luyện. Phía trên là hướng Bắc. Hành lang (corridor) chạy vòng quanh sân trong (courtyard).",
        map: {
          cols: 12,
          rows: 9,
          paths: [
            { x: 2.4, y: 1.8, w: 7.2, h: 0.8, label: "corridor" },
            { x: 2.4, y: 6.4, w: 7.2, h: 0.8 },
            { x: 2.4, y: 2.6, w: 0.8, h: 3.8 },
            { x: 8.8, y: 2.6, w: 0.8, h: 3.8 },
          ],
          boxes: [
            { x: 3.4, y: 0.1, w: 5.2, h: 1.5, label: "Auditorium" },
            { x: 3.4, y: 2.8, w: 5.2, h: 3.4, label: "Courtyard" },
            { x: 5.2, y: 7.4, w: 1.6, h: 1.4, label: "Main entrance" },
            { x: 0.2, y: 7.4, w: 2.6, h: 1.4, blank: "A" },
            { x: 3.0, y: 7.4, w: 2.0, h: 1.4, blank: "B" },
            { x: 7.0, y: 7.4, w: 2.0, h: 1.4, blank: "C" },
            { x: 9.2, y: 7.4, w: 2.6, h: 1.4, blank: "D" },
            { x: 0.2, y: 1.8, w: 2.0, h: 2.0, blank: "E" },
            { x: 0.2, y: 4.4, w: 2.0, h: 2.0, blank: "F" },
            { x: 9.8, y: 1.8, w: 2.0, h: 2.0, blank: "G" },
            { x: 9.8, y: 4.4, w: 2.0, h: 2.0, blank: "H" },
          ],
          pins: [{ x: 6.0, y: 7.0, label: "You are here" }],
        },
      },
    },
    {
      t: "table",
      caption: "Questions 16–20 (đọc trước)",
      head: ["Câu", "Địa điểm", "Chữ cái"],
      rows: [
        ["16", "Gift shop", "___"],
        ["17", "Café", "___"],
        ["18", "Pottery studio", "___"],
        ["19", "Meeting room", "___"],
        ["20", "Computer lab", "___"],
      ],
    },
    {
      t: "listen",
      id: "t2d7-nghe-bai",
      title: "Welcome back to Alder Creek Community Center",
      dan: { so: "Day 7, Recording 1 (Listening Part 2)", boiCanh: "a talk by the manager of a community center to a group of new members.", cau: [11, 20] },
      note: "Khoảng 3 phút, giọng Mỹ: Karen (nữ), Mike (nam). Nghe tối đa 2 lần; chưa mở lời thoại cho tới khi làm xong 10 câu.",
      lines: [
        { who: "Karen", voice: "us-nu", text: "Good morning, everyone, and welcome to Alder Creek Community Center. My name's Karen Walsh, and I'm the manager here. As you probably know, the building has been closed for almost a year for renovation.", vi: "Chào buổi sáng mọi người, chào mừng đến Trung tâm Cộng đồng Alder Creek. Tôi là Karen Walsh, quản lý ở đây. Chắc các bạn đã biết, toà nhà đóng cửa gần một năm để cải tạo." },
        { who: "Karen", voice: "us-nu", text: "We were supposed to reopen in January, but there were some delays with the new roof, so we actually opened our doors again in March. The swimming pool is still closed, and that won't be ready until May.", vi: "Lẽ ra chúng tôi mở lại vào tháng Một, nhưng mái mới bị chậm, nên thực tế chúng tôi mở cửa lại vào tháng Ba. Bể bơi vẫn đóng, và phải đến tháng Năm mới xong." },
        { who: "Karen", voice: "us-nu", text: "So what's different? Well, the biggest change is that we finally have an elevator, so every part of the building is now accessible for wheelchair users and parents with strollers. A lot of you asked for a bigger parking lot, but I'm afraid there just wasn't room for that. And the gym is the same size as before, although all the equipment is brand new.", vi: "Vậy có gì khác? Thay đổi lớn nhất là cuối cùng chúng tôi đã có thang máy, nên mọi khu vực trong toà nhà giờ đều đi được bằng xe lăn và xe đẩy em bé. Nhiều bạn xin bãi đỗ xe lớn hơn, nhưng tiếc là không có chỗ. Còn phòng gym vẫn rộng như cũ, dù toàn bộ thiết bị đều mới tinh." },
        { who: "Karen", voice: "us-nu", text: "Now, membership. Adults pay fifty-five dollars a year, and seniors pay forty. Family membership used to be eighty dollars, but we've lowered that to seventy, because we really want more families to join.", vi: "Giờ đến phí thành viên. Người lớn đóng năm mươi lăm đô một năm, người cao tuổi bốn mươi. Thẻ gia đình trước đây tám mươi đô, nhưng chúng tôi đã giảm còn bảy mươi, vì thật sự muốn nhiều gia đình tham gia hơn." },
        { who: "Mike", voice: "us-nam", text: "Excuse me, Karen. Is the pottery studio open to everyone? Do we need to take a class first?", vi: "Xin lỗi chị Karen. Xưởng gốm có mở cho mọi người không? Bọn tôi có phải học một lớp trước không?" },
        { who: "Karen", voice: "us-nu", text: "Good question, Mike. We used to run a safety class for beginners, but it's no longer required. You don't need to bring anything either, because clay and tools are provided. What you do need to do is reserve a spot, and please do that on our website, not by phone, because the front desk gets very busy.", vi: "Câu hỏi hay đấy Mike. Trước đây chúng tôi có lớp an toàn cho người mới, nhưng giờ không bắt buộc nữa. Bạn cũng không cần mang gì, vì có sẵn đất sét và dụng cụ. Việc bạn phải làm là đặt chỗ, và hãy đặt trên trang web, đừng gọi điện, vì quầy lễ tân rất bận." },
        { who: "Karen", voice: "us-nu", text: "And finally, the café. It's run entirely by volunteers from the neighborhood, which is why the prices are so low. It takes both cash and cards, and it's open until six on weekdays and until eight on weekends.", vi: "Và cuối cùng là quán cà phê. Nó hoàn toàn do tình nguyện viên trong khu phố điều hành, vì vậy giá rất rẻ. Quán nhận cả tiền mặt lẫn thẻ, mở đến sáu giờ các ngày trong tuần và đến tám giờ cuối tuần." },
        { who: "Karen", voice: "us-nu", text: "OK, now if you look at the plan, I'll show you where everything is. When you come in through the main entrance, you're standing in the corridor that goes all the way around the courtyard. The courtyard is straight ahead of you.", vi: "Được rồi, giờ nếu các bạn nhìn mặt bằng, tôi sẽ chỉ chỗ từng nơi. Khi bước vào qua lối chính, các bạn đứng trong hành lang chạy vòng quanh sân trong. Sân trong ở ngay trước mặt." },
        { who: "Karen", voice: "us-nu", text: "The room immediately on your left, right next to the entrance, is the gift shop. On the other side of the entrance, on your right, is the first-aid room.", vi: "Căn phòng ngay bên trái, sát lối vào, là cửa hàng quà tặng. Phía bên kia lối vào, bên phải các bạn, là phòng sơ cứu." },
        { who: "Karen", voice: "us-nu", text: "If you turn right and walk to the far end of this corridor, the room in the south-east corner is the café.", vi: "Nếu rẽ phải và đi đến tận cuối hành lang này, căn phòng ở góc đông nam là quán cà phê." },
        { who: "Karen", voice: "us-nu", text: "From the café, follow the corridor round to the left, so you're heading north along the east side of the building. The first room on your right is the pottery studio. Just beyond it, in the north-east corner, is the dance studio. And the whole north side of the building is the auditorium.", vi: "Từ quán cà phê, đi theo hành lang vòng sang trái, tức là các bạn đi về phía bắc dọc phía đông toà nhà. Phòng đầu tiên bên phải là xưởng gốm. Ngay sau nó, ở góc đông bắc, là phòng tập nhảy. Còn toàn bộ phía bắc toà nhà là khán phòng." },
        { who: "Karen", voice: "us-nu", text: "Now, the west side. Go back to the entrance and turn left this time. In the south-west corner, at the end of the corridor, is the room that used to be the computer lab, but it's a storage room now.", vi: "Giờ đến phía tây. Quay lại lối vào và lần này rẽ trái. Ở góc tây nam, cuối hành lang, là căn phòng trước đây là phòng máy tính, nhưng giờ là kho." },
        { who: "Karen", voice: "us-nu", text: "Turn right at that corner and walk north along the west side. The first room on your left is the meeting room, and you can book it for free. The computer lab is the room after that, in the north-west corner, so it's directly opposite the dance studio, on the other side of the courtyard.", vi: "Rẽ phải ở góc đó và đi về phía bắc dọc phía tây. Phòng đầu tiên bên trái là phòng họp, và các bạn có thể đặt miễn phí. Phòng máy tính là phòng tiếp theo, ở góc tây bắc, tức là đối diện thẳng phòng tập nhảy, ở phía bên kia sân trong." },
        { who: "Karen", voice: "us-nu", text: "OK, any questions before we start the tour?", vi: "Được rồi, có câu hỏi nào trước khi chúng ta bắt đầu đi tham quan không?" },
      ],
    },
    {
      t: "mcq",
      id: "t2d7-nghe-chon",
      title: "Questions 11–15 — Multiple choice",
      items: [
        { q: "(11) The center reopened after the renovation in", options: ["A January", "B March", "C May"], correct: 1, why: "“We were supposed to reopen in **January**, but… we **actually** opened our doors again in **March**.” **supposed to** = lẽ ra (không xảy ra). **May** là lúc **bể bơi** mở." },
        { q: "(12) What is new in the building?", options: ["A an elevator", "B a second gym", "C a larger parking lot"], correct: 0, why: "“the biggest change is that we finally have **an elevator**.” Parking lot: “there just **wasn't room**”. Gym: “**the same size** as before” — chỉ thiết bị mới." },
        { q: "(13) How much does a family membership cost now?", options: ["A $55", "B $80", "C $70"], correct: 2, why: "“Family membership **used to be** eighty dollars, but we've **lowered that to seventy**.” $55 là thẻ người lớn; $80 là giá **cũ**." },
        { q: "(14) People who want to use the pottery studio", options: ["A must complete a safety class first.", "B must reserve a place online.", "C must bring their own clay."], correct: 1, why: "“What you **do need** to do is **reserve a spot**… on our **website**” = reserve a place **online**. Lớp an toàn: “**no longer required**”; đất sét: “**provided**”." },
        { q: "(15) What does Karen say about the café?", options: ["A It only accepts card payments.", "B It closes earlier on weekends.", "C It is run by volunteers."], correct: 2, why: "“It's **run entirely by volunteers**”. A sai: nhận **both cash and cards**. B sai: cuối tuần mở đến **8**, **muộn hơn** (ngày thường đến 6)." },
      ],
    },
    {
      t: "quiz",
      id: "t2d7-nghe-ban-do",
      title: "Questions 16–20 — ghi MỘT chữ cái (A–H)",
      kind: "fill",
      items: [
        { q: "16. Gift shop ___", answers: ["B"] },
        { q: "17. Café ___", answers: ["D"] },
        { q: "18. Pottery studio ___", answers: ["H"] },
        { q: "19. Meeting room ___", answers: ["F"] },
        { q: "20. Computer lab ___", answers: ["E"] },
      ],
    },
    {
      t: "note",
      title: "Giải thích đáp án 16–20 (di ngón tay theo lời Karen)",
      items: [
        "Bước vào từ lối chính, bạn **quay mặt về phía Bắc** (sân trong ở ngay trước mặt) ⇒ **trái = Tây, phải = Đông**.",
        "**16 — B.** “The room **immediately on your left, right next to the entrance**, is the gift shop.” Bên trái lối vào, sát cửa → **B**. (C — bên phải lối vào — là **phòng sơ cứu**, ô thừa.)",
        "**17 — D.** “turn right and walk to **the far end** of this corridor, the room in the **south-east corner** is the café.” Góc dưới – phải → **D**.",
        "**18 — H.** “follow the corridor round to the left, so you're **heading north** along the **east** side… The **first room on your right** is the pottery studio.” Đang đi lên phía Bắc ⇒ bên phải là phía Đông; phòng đầu tiên gặp là ô phía dưới → **H**. Bẫy: “Just **beyond** it, in the **north-east corner**, is the **dance studio**” → G là phòng nhảy.",
        "**19 — F.** Quay lại lối vào, rẽ **trái** (đi về phía Tây); góc tây nam (**A**) “**used to be** the computer lab, **but** it's a storage room now” → A là **kho**. Rồi “walk **north** along the **west** side. The **first room on your left** is the meeting room” — đi lên phía Bắc thì bên trái là phía Tây; phòng đầu tiên là ô phía dưới → **F**.",
        "**20 — E.** “The computer lab is **the room after that**, in the **north-west corner**… directly opposite the dance studio” → **E** (đối diện G qua sân trong). Bẫy lớn nhất của bài: nghe chữ “computer lab” lần đầu ở ô **A** rồi ghi ngay — phải chờ hết “**but it's a storage room now**”.",
        "Ba ô thừa: **A** (kho, từng là phòng máy tính), **C** (phòng sơ cứu), **G** (phòng nhảy) — bài thật luôn có ô thừa được nhắc tới.",
      ],
    },
    {
      t: "table",
      caption: "Tự chấm bài 11–20",
      head: ["Số câu đúng", "Mức tương đương ở Part 2", "Việc nên làm"],
      rows: [
        ["9–10", "Vững ở mức band 5.5–6", "Sang bài Nói; ngày mai nghe lại một lần không nhìn hình, tự vẽ mặt bằng"],
        ["7–8", "Đạt mục tiêu band 5", "Mở lời thoại, gạch các câu chứa đáp án và câu bẫy"],
        ["≤ 6", "Chưa đạt", "Ôn lại mục 2 (cụm vị trí), nghe Practice 1 thêm hai lần, rồi làm lại bài này sau 1 ngày"],
      ],
    },

    { t: "h", text: "5. Lỗi hay gặp ở Map labelling và cách sửa" },
    {
      t: "note",
      title: "Người Việt hay sai ở Map / Plan labelling",
      items: [
        "**Quên xoay trái / phải** sau khi rẽ góc. Cách sửa: mỗi lần nghe “turn / follow the corridor round / heading north…”, **xoay tờ giấy** (hoặc xoay đầu) theo hướng đi.",
        "**Ghi đáp án ở lần nhắc đầu tiên** (computer lab ở ô A). Cách sửa: chỉ ghi khi người nói **chuyển sang nơi khác**; gạch dưới các chữ **used to, but now, actually, not any more** khi soát lời thoại.",
        "**Lỡ một câu rồi mất dấu cả bài.** Câu hỏi đi theo thứ tự: lỡ 18 thì nghe ngay mốc của 19 (**go back to the entrance… turn left**).",
        "**Hiểu “first / second floor” theo kiểu Anh** khi người nói giọng Mỹ. Mỹ: first floor = tầng trệt, second floor = tầng ngay trên tầng trệt.",
      ],
    },
    {
      t: "note",
      title: "Mẹo luyện thêm",
      items: [
        "Nghe lại Recording 1 **không nhìn hình**, vẽ mặt bằng ra giấy theo lời Karen — vẽ đúng là bạn đã hiểu thật.",
        "Tự chỉ đường bằng tiếng Anh từ cổng trường / công ty đến chỗ bạn ngồi, dùng ít nhất 5 cụm ở mục 2.",
        "Mỗi ngày nghe 5 phút một kênh tin tức hoặc podcast giọng Mỹ, chép lại 2 câu có từ chứa **/r/** cuối hoặc **/t/** giữa hai nguyên âm.",
      ],
    },

    { t: "h", text: "6. Diagram labelling — sơ đồ MỘT vật / thiết bị" },
    {
      t: "p",
      text: "Cùng nhóm với Map / Plan (lộ trình gọi chung là **Plan · Map · Diagram**) nhưng ít người luyện: đề cho **hình một vật** — một cái máy, một dụng cụ, một bộ phận toà nhà — và bạn **ghi tên các bộ phận**. Hay gặp ở **Part 2** (người hướng dẫn giới thiệu thiết bị) và **Part 4** (bài giảng về một phát minh). Phần lớn đề bắt **viết chữ** (ONE WORD / NO MORE THAN TWO WORDS), không chọn chữ cái — nên **chính tả** và **giới hạn từ** quay lại quan trọng như Part 1.",
    },
    {
      t: "table",
      caption: "Map / Plan (mục 1–5) và Diagram — giống và khác",
      head: ["", "Map / Plan", "Diagram (sơ đồ vật)"],
      rows: [
        ["Hình", "Mặt bằng nhìn từ trên xuống, nhiều nơi", "**Một vật**, thường nhìn ngang (mặt cắt), nhiều **bộ phận**"],
        ["Ghi gì", "Thường là **chữ cái** A–H", "Thường là **từ nghe được** (đúng chính tả, đúng số từ)"],
        ["Mốc để bám", "Lối vào, “You are here”", "**Bộ phận đã có tên** trên hình (wheel head, body…)"],
        ["Ngôn ngữ vị trí", "trái / phải theo hướng đi, góc đông nam…", "**at the very top · underneath · level with · on the left-hand side · attached to · inside · the first / second button**"],
        ["Thứ tự", "Theo đường đi của người nói", "Thường **trên → dưới** hoặc **ngoài → trong**, hoặc theo cách vật **vận hành**"],
      ],
    },
    {
      t: "table",
      caption: "Từ bộ phận hay gặp — đoán trước theo LOẠI thiết bị",
      head: ["Loại thiết bị", "Từ bộ phận thường nghe"],
      rows: [
        ["Máy có điện (máy pha, máy xay, quạt)", "switch · button · dial · lid · handle · plug · cable · motor · base · tray · light"],
        ["Dụng cụ nước (bể, máy lọc, vòi)", "tank · pipe · tap · valve · filter · pump · container · bucket · drain"],
        ["Xe, máy kéo (xe đạp, xe đẩy)", "wheel · pedal · chain · brake · frame · seat · handlebar · basket"],
        ["Công trình (mái, tháp, cầu)", "roof · beam · panel · column · vent · gutter · base · cable"],
      ],
    },
    {
      t: "sodo",
      kind: "flow",
      title: "Làm Diagram labelling trong 30 giây đọc đề",
      steps: [
        { label: "Xem hình là vật gì", sub: "đọc tiêu đề; đoán nhóm từ bộ phận (bảng trên)" },
        { label: "Đánh dấu các bộ phận ĐÃ có tên", sub: "chúng là mốc: người nói sẽ đi qua chúng theo thứ tự" },
        { label: "Đoán thứ tự các ô số", sub: "trên → dưới? trái → phải? câu hỏi đi theo thứ tự lời nói" },
        { label: "Khoanh giới hạn từ", sub: "ONE WORD ONLY ⇒ wide plastic tray chỉ ghi **tray**" },
        { label: "Nghe từ vị trí + tên bộ phận", sub: "“On the left-hand side, level with the tray, there's…” → ghi chữ đứng sau there's / is called" },
      ],
    },
    {
      t: "canh",
      anh: ["woman-artist", "amphora", "droplet"],
      caption: "Ở **xưởng gốm** của Alder Creek Community Center (bài Part 2 ở mục 4), người hướng dẫn **Dana** giới thiệu chiếc **bàn xoay làm gốm** (pottery wheel) mới cho một nhóm thành viên.",
    },
    {
      t: "figure",
      fig: {
        kind: "map",
        title: "A pottery wheel — ghi nhãn 1–5 (ONE WORD ONLY)",
        note: "Sơ đồ tự vẽ cho bài luyện, nhìn ngang từ phía trước. Các ô có tên là mốc; các ô số cần ghi tên bộ phận.",
        map: {
          cols: 12,
          rows: 9,
          paths: [{ x: 0, y: 8.0, w: 12, h: 0.4, label: "floor" }],
          boxes: [
            { x: 3.6, y: 0.4, w: 4.8, h: 0.8, label: "wheel head" },
            { x: 2.2, y: 1.3, w: 7.6, h: 1.0, blank: "1" },
            { x: 0.3, y: 2.0, w: 1.8, h: 0.7, blank: "2" },
            { x: 3.4, y: 2.4, w: 5.2, h: 3.4, label: "body (motor inside)" },
            { x: 8.7, y: 2.6, w: 1.4, h: 1.0, blank: "3" },
            { x: 0.3, y: 5.8, w: 2.6, h: 1.2, label: "stool" },
            { x: 4.8, y: 6.3, w: 2.4, h: 1.5, blank: "4" },
            { x: 8.8, y: 7.0, w: 2.8, h: 0.9, blank: "5" },
          ],
          pins: [{ x: 6.0, y: 6.0, label: "pipe ↓" }],
        },
      },
    },
    {
      t: "listen",
      id: "t2d7-nghe-so-do-bai",
      title: "Getting to know the pottery wheel",
      dan: { so: "Day 7, Recording 2 (Listening Part 2)", boiCanh: "an instructor explaining the parts of a pottery wheel to new members.", cau: [1, 5] },
      note: "Khoảng 1 phút 30 giây, giọng Mỹ (Dana, nữ). Nghe tối đa 2 lần. Nhớ: ONE WORD ONLY.",
      lines: [
        { who: "Dana", voice: "us-nu", text: "OK, before you start, let's look at the wheel itself. You've each got a diagram. The round metal plate at the very top is called the wheel head. That's where you put your clay, and that's the part that spins.", vi: "Được rồi, trước khi bắt đầu, ta xem chính chiếc bàn xoay. Mỗi người có một sơ đồ. Cái đĩa kim loại tròn trên cùng gọi là mặt bàn xoay. Đó là chỗ đặt đất sét, và là phần quay." },
        { who: "Dana", voice: "us-nu", text: "All the way around the wheel head there's a wide plastic tray. It catches the water and the bits of clay that fly off, so please empty it after every session.", vi: "Bao quanh mặt bàn xoay là một cái khay nhựa rộng. Nó hứng nước và các mẩu đất sét văng ra, nên hãy đổ nó sau mỗi buổi." },
        { who: "Dana", voice: "us-nu", text: "On the left-hand side, level with the tray, there's a narrow shelf. That's where you keep your tools and your sponge, so everything's within reach.", vi: "Bên tay trái, ngang với cái khay, có một cái kệ hẹp. Đó là chỗ để dụng cụ và miếng bọt biển, cho mọi thứ trong tầm tay." },
        { who: "Dana", voice: "us-nu", text: "Now, the main body underneath holds the motor. On the right side of the body, near the top, you'll see a switch. That turns the power on and off, and it's the first thing to check if the wheel won't start. The old wheels had a dial there to control the speed, but these new ones don't.", vi: "Giờ, phần thân bên dưới chứa động cơ. Phía bên phải thân, gần trên cùng, các bạn sẽ thấy một công tắc. Nó bật tắt nguồn, và là thứ đầu tiên cần kiểm nếu bàn không chạy. Bàn xoay cũ có một núm vặn ở đó để chỉnh tốc độ, nhưng loại mới thì không." },
        { who: "Dana", voice: "us-nu", text: "Directly underneath the wheel, there's a bucket. The dirty water from the tray runs down a small pipe into it. Never pour that water into the sink, because the clay blocks the drains.", vi: "Ngay bên dưới bàn xoay có một cái xô. Nước bẩn từ khay chảy theo một ống nhỏ xuống đó. Đừng bao giờ đổ nước đó vào bồn rửa, vì đất sét làm tắc cống." },
        { who: "Dana", voice: "us-nu", text: "And the speed? You control it with your foot. The pedal sits on the floor on the right, so most people use their right foot. Press down gently to go faster. Oh, and the thing on the left is just the stool you sit on.", vi: "Còn tốc độ? Bạn điều khiển bằng chân. Bàn đạp nằm trên sàn bên phải, nên đa số dùng chân phải. Nhấn nhẹ xuống để quay nhanh hơn. À, cái bên trái chỉ là ghế đẩu để ngồi thôi." },
      ],
    },
    {
      t: "quiz",
      id: "t2d7-nghe-so-do",
      title: "Questions 1–5 — Label the diagram. Write ONE WORD ONLY.",
      kind: "fill",
      items: [
        { q: "1. (vòng quanh wheel head) ___", answers: ["tray"] },
        { q: "2. (bên trái, ngang với ô 1) ___", answers: ["shelf"] },
        { q: "3. (bên phải thân máy, gần trên cùng) ___", answers: ["switch"] },
        { q: "4. (ngay dưới bàn xoay) ___", answers: ["bucket"] },
        { q: "5. (trên sàn, bên phải) ___", answers: ["pedal"] },
      ],
    },
    {
      t: "note",
      title: "Giải thích 1–5 — mốc vị trí + bẫy",
      items: [
        "**1 tray** — “**All the way around** the wheel head there's a **wide plastic tray**.” ONE WORD ⇒ chỉ ghi **tray** (wide, plastic là tính từ mô tả).",
        "**2 shelf** — “On the **left-hand side**, **level with the tray**, there's a **narrow shelf**.” Bẫy: **tools**, **sponge** là thứ **để trên** kệ, không phải tên bộ phận.",
        "**3 switch** — “On the **right side of the body, near the top**… a **switch**.” Bẫy **dial**: “The **old** wheels **had** a dial there… but these new ones **don't**” (nhóm “từng có ↔ đang có”).",
        "**4 bucket** — “**Directly underneath** the wheel, there's a **bucket**.” Bẫy: **pipe** đã có sẵn trên hình (mốc), **sink** là nơi **không được** đổ nước.",
        "**5 pedal** — “The **pedal** sits **on the floor on the right**.” Bẫy **foot** (bộ phận cơ thể, không phải bộ phận máy). Ô bên trái dưới là **stool** — đã có tên, chỉ là mốc.",
        "Câu hỏi đi **theo thứ tự lời nói** (tray → shelf → switch → bucket → pedal), nhưng trên hình các số **không** xếp gọn trên → dưới hay trái → phải (ô 2 ở bên trái, ô 3 ở bên phải). Nếu bị lạc, bám **mốc đã có tên** (wheel head → body → stool → floor) thay vì dò số trên hình.",
      ],
    },
    {
      t: "note",
      title: "Cẩn thận: lỗi hay gặp ở Diagram labelling",
      items: [
        "**Ghi cả cụm mô tả**: ~~wide plastic tray~~ khi đề ONE WORD ONLY. Tên bộ phận là **danh từ cuối** cụm.",
        "**Ghi thứ được đặt lên / chảy qua bộ phận** thay vì chính bộ phận (tools ≠ shelf, water ≠ bucket). Tự hỏi: ô trên hình là **cái gì**, không phải **chứa gì**.",
        "**Sai số ít / số nhiều**: hình chỉ một cái ⇒ số ít (pedal, không ~~pedals~~).",
        "Không quen **level with** (ngang hàng với), **directly underneath** (ngay bên dưới), **attached to** (gắn vào) — ba cụm này xuất hiện ở hầu hết đề Diagram. Tập 3 Ngày 12 luyện lại Plan / Map / Diagram ở mức khó hơn.",
      ],
    },
  ],
};

/* ─────────────────────────── Nói ─────────────────────────── */

const T2D7_NOI: Lesson = {
  id: "t2d7-noi",
  kind: "speaking",
  title: "Nói: Part 2 — Describe a place",
  goal: "Nói liền mạch 1,5–2 phút về một địa điểm (nơi đã đến, nơi hay đến, nơi muốn đến) theo dàn 4 phần, chọn đúng thì theo thẻ đề (quá khứ / hiện tại / tương lai) và chọn góc nội dung theo động từ của thẻ, dùng 9 khung câu tả nơi chốn — đẩy Fluency & Coherence và Lexical Resource lên band 5; nhận ra và đọc ổn định /r/ cuối từ và /t/ kiểu Anh khi so với giọng Mỹ.",
  minutes: 70,
  blocks: [
    {
      t: "recap",
      title: "Bài này học gì · đẩy band nào",
      items: [
        "**Part 2** (ôn Ngày 3): thẻ đề → **1 phút** ghi chú → nói **tới 2 phút** → 1–2 câu hỏi kết. Hôm nay là loại đề **địa điểm** (place) — một trong những loại đề hay gặp nhất, cùng với đề người.",
        "**Chọn thì theo thẻ**: a place you **visited** → quá khứ · a place you **often go to** → hiện tại đơn · a place you **would like to visit** → would like to / going to / will (bài ngữ pháp hôm nay).",
        "Dàn **4 phần**: Giới thiệu (10″) → Vị trí & trông thế nào (30″) → Làm gì ở đó / chuyện đáng nhớ (50″) → **Cảm xúc + vì sao** (30″).",
        "9 khung câu tả nơi chốn: ==It's located…== · ==It's surrounded by…== · ==It's famous for…== · ==What I like most about it is…== · ==It's the kind of place where…==",
        "Đẩy **FC** (nói đủ dài, có trình tự) và **LR** (từ tả nơi chốn chính xác hơn “beautiful, good, nice”). Phát âm: **/r/ cuối từ** và **/t/** — giọng Anh và giọng Mỹ.",
        "**Đọc động từ của thẻ** (visit / live / work / changed you) để chọn góc nội dung; nơi là **công trình** hay **vùng đất** quyết định phần dài nhất tả gì; mẹo kéo dài theo từng ô (mục 4b).",
      ],
    },

    { t: "h", text: "1. Đề “place” trông như thế nào?" },
    {
      t: "table",
      caption: "Sáu kiểu đề địa điểm hay gặp — và thì cần dùng",
      head: ["Thẻ đề", "Thì chính", "Câu mở đầu gợi ý"],
      rows: [
        ["Describe a place you **visited** that you liked", "**Quá khứ đơn**", "I'd like to talk about a trip I **took** to… last summer."],
        ["Describe a place you **often go to** to relax", "**Hiện tại đơn**", "The place I **go** to whenever I need a break **is**…"],
        ["Describe a place you **would like to visit** in the future", "**would like to · going to · will**", "One place I'**d really love to visit** is…"],
        ["Describe a **city** you know well", "Hiện tại đơn (+ quá khứ nếu từng sống)", "The city I know best **is** Hue, because I **lived** there for…"],
        ["Describe a **quiet / noisy / crowded** place", "Hiện tại đơn", "There's a small café near my house that **is** always…"],
        ["Describe a **building** you find interesting", "Hiện tại đơn (+ quá khứ cho lịch sử)", "The building I find most interesting **is**… It **was built** in…"],
      ],
    },
    {
      t: "sodo",
      kind: "flow",
      title: "Dàn bài 4 phần cho đề địa điểm (~2 phút)",
      steps: [
        { label: "① Giới thiệu (10″)", sub: "Tên nơi + một câu vì sao chọn: I'd like to talk about… because…" },
        { label: "② Ở đâu, trông thế nào (30″)", sub: "located in · surrounded by · there is / are · famous for" },
        { label: "③ Làm gì / chuyện đáng nhớ (50″)", sub: "kể theo trình tự: First… Then… The best part was…" },
        { label: "④ Cảm xúc + vì sao (30″)", sub: "What I like most about it is… · It makes me feel… · That's why…" },
      ],
      caption: "Phần ③ dài nhất — một chi tiết cụ thể (một món ăn, một người bạn gặp, một chuyện bất ngờ) làm bài nói sống động và kéo dài tự nhiên.",
    },

    { t: "h", text: "2. Khung câu và từ vựng tả nơi chốn" },
    {
      t: "patterns",
      rows: [
        { formula: "It's located in / on / near + nơi", vi: "Nằm ở đâu. in + thành phố / tỉnh · on + con đường / bờ biển / đảo · near + mốc.", examples: [{ en: "It's located on the coast, about two hours from Hanoi.", vi: "Nó nằm trên bờ biển, cách Hà Nội khoảng hai tiếng." }] },
        { formula: "It's surrounded by + N", vi: "Được bao quanh bởi…", examples: [{ en: "The village is surrounded by rice fields and low hills.", vi: "Ngôi làng được bao quanh bởi ruộng lúa và đồi thấp." }] },
        { formula: "It's (well-)known / famous for + N / V-ing", vi: "Nổi tiếng vì… (sau for là **danh từ** hoặc **V-ing**).", examples: [{ en: "Hoi An is famous for its old houses and lanterns.", vi: "Hội An nổi tiếng với nhà cổ và đèn lồng." }] },
        { formula: "There is / There are + N + nơi", vi: "Có gì ở đó (Tập 1 Ngày 11).", examples: [{ en: "There are dozens of small stalls selling local food.", vi: "Có hàng chục quầy nhỏ bán đồ ăn địa phương." }] },
        { formula: "It's the kind of place where + S + V", vi: "Kiểu nơi mà… — câu phức đơn giản, ăn điểm GRA.", examples: [{ en: "It's the kind of place where you can forget about work.", vi: "Đó là kiểu nơi mà bạn có thể quên đi công việc." }] },
        { formula: "What I like most about it is + N / (that) + S + V", vi: "Điều tôi thích nhất ở nó là… — câu mở phần cảm xúc.", examples: [{ en: "What I like most about it is the peaceful atmosphere.", vi: "Điều tôi thích nhất ở đó là bầu không khí yên bình." }] },
        { formula: "It reminds me of + N / V-ing", vi: "Nó làm tôi nhớ đến…", examples: [{ en: "The smell of the market reminds me of my childhood.", vi: "Mùi khu chợ làm tôi nhớ tuổi thơ." }] },
        { formula: "I'd (really) love to + V · I'm hoping to + V", vi: "Mong muốn (đề nơi **muốn đến**).", examples: [{ en: "I'd really love to see the autumn leaves there.", vi: "Tôi rất muốn ngắm lá mùa thu ở đó." }] },
      ],
    },
    {
      t: "rule",
      formula: "It's located… · It's surrounded by… · It's famous for + N / V-ing · It's the kind of place where + S + V · What I like most about it is…",
      vi: "Năm khung câu cốt lõi của đề địa điểm — mỗi bài nói dùng ít nhất 3.",
    },
    {
      t: "vocab",
      items: [
        { w: "located", pos: "adj", ipa: "/ləʊˈkeɪtɪd/", vi: "nằm ở, toạ lạc ở", ex: "The museum is located in the old town.", exVi: "Bảo tàng nằm trong phố cổ.", more: "**be located in / on / near**. Danh từ: **location** (vị trí)." },
        { w: "surrounded by", pos: "phr", ipa: "/səˈraʊndɪd baɪ/", vi: "được bao quanh bởi", ex: "The lake is surrounded by pine trees.", exVi: "Hồ được bao quanh bởi rừng thông.", more: "Danh từ **surroundings** (môi trường xung quanh)." },
        { w: "picturesque", pos: "adj", ipa: "/ˌpɪktʃəˈresk/", vi: "đẹp như tranh", ex: "We stayed in a picturesque village in the mountains.", exVi: "Chúng tôi ở một ngôi làng đẹp như tranh trên núi.", more: "Thay cho “very beautiful” khi tả **phong cảnh**. Trọng âm ở cuối: pic-tu-**RESQUE**." },
        { w: "bustling", pos: "adj", ipa: "/ˈbʌslɪŋ/", vi: "nhộn nhịp, tấp nập", ex: "Ben Thanh is a bustling market in the city centre.", exVi: "Bến Thành là một khu chợ nhộn nhịp ở trung tâm thành phố.", more: "Chữ **t câm**: /ˈbʌslɪŋ/. **a bustling city / street / market**." },
        { w: "peaceful", pos: "adj", ipa: "/ˈpiːsfl/", vi: "yên bình", ex: "Early in the morning, the beach is very peaceful.", exVi: "Sáng sớm, bãi biển rất yên bình.", more: "Danh từ **peace**. Gần nghĩa: **quiet, calm, tranquil** (trang trọng hơn)." },
        { w: "landmark", pos: "n", ipa: "/ˈlændmɑːk/", vi: "công trình / địa điểm mang tính biểu tượng", ex: "The cathedral is the most famous landmark in the city.", exVi: "Nhà thờ lớn là công trình biểu tượng nổi tiếng nhất thành phố." },
        { w: "scenery", pos: "n (U)", ipa: "/ˈsiːnəri/", vi: "phong cảnh", ex: "The scenery along the coast road is amazing.", exVi: "Phong cảnh dọc con đường ven biển thật tuyệt.", more: "**Không đếm được**: ~~sceneries~~ · ~~a scenery~~." },
        { w: "atmosphere", pos: "n", ipa: "/ˈætməsfɪə(r)/", vi: "bầu không khí (của một nơi)", ex: "I love the relaxed atmosphere of small cafés.", exVi: "Tôi thích bầu không khí thư thái của những quán cà phê nhỏ.", more: "**a lively / relaxed / friendly atmosphere**." },
        { w: "tourist attraction", pos: "n", ipa: "/ˈtʊərɪst əˈtrækʃn/", vi: "điểm thu hút du khách", ex: "Ha Long Bay is a major tourist attraction.", exVi: "Vịnh Hạ Long là một điểm thu hút du khách lớn." },
        { w: "off the beaten track", pos: "idiom", ipa: "/ɒf ðə ˈbiːtn træk/", vi: "ít người biết, xa các tuyến du lịch quen", ex: "We found a small beach that was completely off the beaten track.", exVi: "Chúng tôi tìm được một bãi biển nhỏ hoàn toàn vắng khách du lịch.", more: "Dùng **một lần** trong bài nói là đủ — dùng nhiều nghe như học thuộc." },
        { w: "temple", pos: "n", ipa: "/ˈtempl/", vi: "đền, chùa", ex: "Kyoto has hundreds of old temples.", exVi: "Kyoto có hàng trăm ngôi chùa cổ.", anh: "hindu-temple" },
        { w: "breathtaking", pos: "adj", ipa: "/ˈbreθteɪkɪŋ/", vi: "đẹp ngoạn mục", ex: "The view from the top was breathtaking.", exVi: "Cảnh nhìn từ trên đỉnh đẹp ngoạn mục.", more: "Mạnh hơn beautiful — **không** dùng với very: ~~very breathtaking~~ → **absolutely** breathtaking." },
      ],
    },

    { t: "h", text: "3. Một phút ghi chú: sơ đồ ý" },
    {
      t: "p",
      text: "Thẻ đề hôm nay: **Describe a place you would like to visit in the future.** You should say: **where** it is · **how** you know about it · **what** you would like to do there · **and explain why** you want to go there. Một phút chuẩn bị chỉ đủ ghi **từ khoá** — xem ví dụ sơ đồ ý bên dưới (mỗi nhánh = một dòng thẻ đề + 2–3 từ “đắt”).",
    },
    {
      t: "sodo",
      kind: "mindmap",
      title: "Ghi chú 1 phút — “a place I'd like to visit”",
      center: "**Kyoto, Japan**",
      branches: [
        { label: "Where", items: ["central Japan", "old capital", "2–3 h by train from Tokyo"], anh: "world-map" },
        { label: "How I know", items: ["documentary on YouTube", "friend studied there"], anh: "television" },
        { label: "What I'd do", items: ["temples · red gates", "autumn leaves", "try tea ceremony"], anh: "hindu-temple" },
        { label: "Why", items: ["peaceful · history", "learning Japanese", "save money → next year"], anh: "red-heart" },
      ],
      caption: "Chỉ từ khoá, không câu. Nhìn sơ đồ khi nói, mỗi nhánh nói 25–35 giây là đủ 2 phút.",
    },

    { t: "h", text: "4. Bài nói mẫu: yếu (band 4) và tốt (band 5.5–6)" },
    {
      t: "dialogue",
      title: "Bài yếu — khoảng 35 giây (band 4)",
      lines: [
        { who: "Candidate", role: "candidate", text: "I want to go to Japan. Japan is very beautiful. I will go to Kyoto. Kyoto is very beautiful and have many temple. I see it on YouTube. I will go next year because I like Japan. Japan is very good. That's all.", vi: "Tôi muốn đi Nhật. Nhật rất đẹp. Tôi sẽ đi Kyoto. Kyoto rất đẹp và có nhiều chùa. Tôi xem trên YouTube. Tôi sẽ đi năm sau vì tôi thích Nhật. Nhật rất tốt. Hết." },
      ],
    },
    {
      t: "note",
      title: "Vì sao bài trên chỉ band 4",
      items: [
        "**FC**: 35 giây rồi dừng; câu ngắn rời rạc, lặp “Japan” 4 lần; không có dàn ý.",
        "**LR**: “very beautiful / very good” lặp lại; không có từ tả nơi chốn.",
        "**GRA**: lỗi cơ bản (~~Kyoto have many temple~~ → Kyoto **has** many **temples**; ~~I see it on YouTube~~ → I **saw** it); dùng **will** cho mọi ý tương lai.",
        "Không trả lời dòng **how you know about it** cho đầy đủ, và dòng **explain why** chỉ có “because I like Japan”.",
      ],
    },
    {
      t: "dialogue",
      title: "Bài tốt — khoảng 2 phút (band 5.5–6)",
      lines: [
        { who: "Examiner", role: "examiner", text: "Now I'd like you to describe a place you would like to visit in the future. You have one minute to prepare. … All right? Remember, you have one to two minutes for this. Please start speaking now." },
        { who: "Candidate", role: "candidate", text: "OK. The place I'd really love to visit one day is Kyoto, in Japan. It's located in the centre of the country, and it was the capital of Japan for more than a thousand years, so it's full of history.", vi: "Vâng. Nơi tôi thật sự muốn đến một ngày nào đó là Kyoto, Nhật Bản. Nó nằm ở miền trung đất nước, và từng là kinh đô của Nhật hơn một nghìn năm, nên rất giàu lịch sử." },
        { who: "Candidate", role: "candidate", text: "I first found out about it from a documentary on YouTube about Japanese gardens. Then, last year, a close friend of mine went there on an exchange programme, and every week she sent me photos of quiet temples surrounded by trees. That's when I decided I had to see it for myself.", vi: "Lần đầu tôi biết đến nó qua một phim tài liệu trên YouTube về vườn Nhật. Rồi năm ngoái, một người bạn thân của tôi sang đó theo chương trình trao đổi, và tuần nào cô ấy cũng gửi tôi ảnh những ngôi chùa yên tĩnh giữa cây cối. Lúc đó tôi quyết định phải tự mình đến xem." },
        { who: "Candidate", role: "candidate", text: "If I go, I'm going to go in autumn, because that's when the leaves turn red and orange, and apparently the scenery is absolutely breathtaking. First, I'd like to walk through the famous red gates on a hill in the south of the city. After that, I'm hoping to try a traditional tea ceremony, because I've read that it's very calm and every movement has a meaning. And of course, I'll eat as much local food as I can.", vi: "Nếu đi, tôi định đi vào mùa thu, vì lúc đó lá chuyển đỏ và cam, và nghe nói phong cảnh đẹp ngoạn mục. Đầu tiên, tôi muốn đi bộ qua những cổng đỏ nổi tiếng trên một ngọn đồi ở phía nam thành phố. Sau đó, tôi mong được thử trà đạo truyền thống, vì tôi đọc thấy nó rất tĩnh lặng và mỗi động tác đều có ý nghĩa. Và tất nhiên, tôi sẽ ăn đồ ăn địa phương nhiều nhất có thể." },
        { who: "Candidate", role: "candidate", text: "As for why I want to go, there are two main reasons. Firstly, I'm learning Japanese at the moment, so it'll be a great chance to practise with real people. Secondly, I live in a very busy city, and Kyoto seems like the kind of place where you can slow down and just enjoy the moment. What I like most about it is that it mixes the old and the new. I'm saving money now, and when I have enough, hopefully next year, I'll book the tickets.", vi: "Còn vì sao tôi muốn đi thì có hai lý do chính. Thứ nhất, hiện tôi đang học tiếng Nhật, nên đó sẽ là cơ hội tuyệt vời để luyện với người thật. Thứ hai, tôi sống ở một thành phố rất bận rộn, và Kyoto có vẻ là kiểu nơi mà bạn có thể sống chậm lại và tận hưởng khoảnh khắc. Điều tôi thích nhất ở đó là sự pha trộn giữa cũ và mới. Bây giờ tôi đang để dành tiền, và khi đủ — hy vọng là năm sau — tôi sẽ đặt vé." },
        { who: "Examiner", role: "examiner", text: "Thank you. Do you think you will really go there next year?" },
        { who: "Candidate", role: "candidate", text: "I hope so. It depends on my savings, but I'm fairly confident I'll make it within two years.", vi: "Tôi hy vọng vậy. Còn tuỳ tiền để dành, nhưng tôi khá tự tin là trong vòng hai năm sẽ đi được." },
      ],
    },
    {
      t: "table",
      caption: "Vì sao bài này đạt band 5.5–6",
      head: ["Tiêu chí", "Điểm mạnh trong bài", "Còn có thể nâng"],
      rows: [
        ["**FC** — trôi chảy, mạch lạc", "Đủ 4 phần theo thẻ; từ nối trình tự **First · After that · As for · Firstly · Secondly**", "Bớt “Firstly / Secondly” — trong nói, **One reason is… Another thing is…** tự nhiên hơn"],
        ["**LR** — từ vựng", "**located · surrounded by · scenery · breathtaking · tea ceremony · slow down · the kind of place where**", "Thêm một collocation như **soak up the atmosphere**"],
        ["**GRA** — ngữ pháp", "Nhiều cách nói dự định / tương lai: **I'd love to · I'm going to · I'm hoping to · I'll · when I have enough, I'll…** (mệnh đề thời gian đúng)", "Câu điều kiện “If I go, I'm going to…” đúng nhưng hơi lạ — **When I go…** tự nhiên hơn"],
        ["**P** — phát âm", "(cần nghe giọng thật) — chú ý **Kyoto** /kiˈəʊtəʊ/, **scenery** /ˈsiːnəri/, **breathtaking** /ˈbreθteɪkɪŋ/", "Đọc rõ âm cuối **-s** (leaves, temples) và **-ed** (decided)"],
      ],
    },
    {
      t: "note",
      title: "Bổ sung: bài “nơi hay đến” dùng hiện tại đơn",
      items: [
        "Thẻ: **Describe a quiet place you like to go to.** Mở: “The place I go to whenever I need some peace **is** a small lake about ten minutes from my house.”",
        "Vị trí: “It's **located** behind a primary school, and it's **surrounded by** tall trees, so you can't hear the traffic at all.”",
        "Làm gì: “I usually **go** there early on Sunday mornings. I **take** a book, **sit** on the same bench and **read** for an hour. Sometimes old people **do** tai chi near the water.”",
        "Cảm xúc: “**What I like most about it is** that nobody **is** in a hurry. It's **the kind of place where** you can hear birds instead of motorbikes. Every time I **leave**, I **feel** calmer.”",
        "Đổi đề là đổi **thì**: cùng một nơi, nhưng thẻ “a place you **visited**” thì toàn bộ câu chuyện sang **quá khứ đơn**.",
      ],
    },

    { t: "h", text: "4b. Đọc ĐỘNG TỪ của thẻ · công trình hay vùng đất · kéo dài theo từng ô" },
    {
      t: "note",
      title: "Mẹo — gạch chân động từ của thẻ trước khi ghi chú",
      items: [
        "Động từ cho biết **thì** (visited → quá khứ) **và** cho biết **nên nói về khía cạnh nào**. Cùng là “Đà Lạt” nhưng mỗi động từ đòi một góc khác.",
        "**visit / travel to** ⇒ góc **du lịch**: cảnh, món ăn, hoạt động, chuyện đáng nhớ trong chuyến đi.",
        "**live in / grow up in** ⇒ góc **đời sống**: hàng xóm, nhịp sống, tiện ích, điều bất tiện.",
        "**work / study in** ⇒ góc **môi trường làm việc / học tập**: cơ hội, đồng nghiệp, cơ sở vật chất.",
        "**relax / go to often** ⇒ góc **thói quen + cảm xúc**: bạn hay làm gì ở đó, nó giúp bạn thế nào.",
        "**changed you / taught you something** ⇒ dòng explain phải nói **điều bạn học được và bạn khác đi thế nào bây giờ**.",
        "Có sẵn một nơi đã chuẩn bị? Giữ **nơi** đó, nhưng **đổi góc** theo động từ — đừng kể nguyên bài du lịch cho thẻ “a place where you would like to **work**”.",
      ],
    },
    {
      t: "sodo",
      kind: "compare",
      title: "Phần ② dài nhất nói gì — tuỳ nơi là CÔNG TRÌNH hay VÙNG ĐẤT",
      cols: [
        {
          title: "🏛️ Công trình (café, bảo tàng, thư viện, trung tâm thương mại, chùa…)",
          items: [
            "Bên ngoài: It’s a three-storey building **made of** red brick.",
            "Bên trong: The walls are **decorated with** old photos of Hanoi.",
            "Vị trí trong toà: **There is** a small garden **behind** the main hall.",
            "Sức chứa: It **can hold** about fifty people.",
            "Sản phẩm – giá – nhân viên: The drinks are **reasonably priced**, and the staff are really friendly.",
          ],
        },
        {
          title: "🏞️ Vùng đất (thành phố, làng, đảo, vùng núi…)",
          items: [
            "Cảnh: It’s surrounded by terraced rice fields and pine forests.",
            "Thành thị / nông thôn: Life there is much slower than in Hanoi.",
            "Ẩm thực: It’s famous for grilled fish, which you can buy at the night market.",
            "Thời tiết theo **mùa**: In winter it gets quite cold, but in spring it’s cool and sunny.",
            "Lễ hội: The best time to go is during the flower festival in December.",
          ],
        },
      ],
      caption: "Chọn đúng cột ⇒ không bao giờ bí phần ②. Mỗi dòng là một câu 5–10 giây.",
    },
    {
      t: "table",
      caption: "Kéo dài theo từng ô (đề nơi chốn)",
      head: ["Ô trên thẻ", "Thêm gì", "Câu mẫu"],
      rows: [
        ["**Where it is**", "khoảng cách + cách đi · tên dài thì nói nghĩa", "It’s about twenty minutes from my house by motorbike. Its full name is quite long, but locals just call it “the green café”."],
        ["**What it is like**", "so với nơi khác cùng loại", "**Unlike other** cafés in the area, **this one** has no music, so it’s perfect for reading."],
        ["**What you do / did there**", "món / hoạt động chưa thử", "I didn’t try the egg coffee last time, but **next time I’ll definitely give it a try**."],
        ["**Explain why**", "đã giới thiệu cho người khác · họ thấy sao", "I’ve recommended it to a few friends, and **they all loved it** as much as I do."],
      ],
    },
    {
      t: "rule",
      formula: "Gạch chân động từ thẻ → chọn thì + chọn góc · Công trình: made of / decorated with / can hold / staff · Vùng đất: scenery / food / seasons / festivals · Unlike other…, this one…",
      vi: "Động từ quyết định nói gì; loại nơi quyết định phần dài nhất có những chi tiết nào.",
    },
    {
      t: "mcq",
      id: "t2d7-noi-dong-tu",
      title: "Đọc động từ của thẻ — chọn góc nội dung (3 câu)",
      items: [
        { q: "Thẻ: “Describe a city where you would like to **work** in the future.” Ý nào nên chiếm phần lớn bài nói?", options: ["Các món đặc sản và điểm chụp ảnh đẹp", "Cơ hội việc làm trong ngành của bạn, môi trường làm việc, chi phí sống", "Lịch sử thành lập thành phố"], correct: 1, why: "Động từ **work** ⇒ góc **công việc**: cơ hội, môi trường, chi phí. Món ăn, điểm chụp ảnh là góc **visit**." },
        { q: "Thẻ: “Describe a café you **often go to**.” Phần ② nên tả gì?", options: ["Trang trí bên trong, đồ uống – giá, nhân viên, chỗ bạn hay ngồi", "Thời tiết theo mùa và lễ hội của thành phố", "Dân số và diện tích của quận"], correct: 0, why: "Café là **công trình** ⇒ cột trái: thiết kế, decorated with, sản phẩm – giá – nhân viên. Mùa, lễ hội là của **vùng đất**." },
        { q: "Thẻ: “Describe a place that **changed** you.” Dòng explain nên nói gì?", options: ["Nơi đó đẹp thế nào", "Bạn đã học được gì ở đó và bây giờ bạn khác trước ra sao", "Giá vé vào cửa"], correct: 1, why: "Động từ **changed** ⇒ explain phải nói **thay đổi của bạn**: điều học được + bạn bây giờ." },
      ],
    },

    { t: "h", text: "5. Câu hỏi kết (rounding-off) và lỗi hay gặp" },
    {
      t: "table",
      head: ["Câu hỏi kết hay gặp", "Trả lời ngắn mẫu"],
      rows: [
        ["Would you like to live there?", "Maybe for a few months, but not forever — I'd miss Vietnamese food too much."],
        ["Do many people visit this place?", "Yes, quite a lot, especially in spring and autumn, so it can get crowded."],
        ["Would you recommend it to a friend?", "Definitely, especially to anyone who's interested in history."],
      ],
    },
    {
      t: "note",
      title: "Người Việt hay sai ở đề địa điểm",
      items: [
        "Liệt kê như sách hướng dẫn du lịch (dân số, diện tích, năm thành lập) — giám khảo không chấm kiến thức; hãy nói **trải nghiệm và cảm xúc của bạn**.",
        "Dùng sai thì: thẻ “a place you **visited**” mà kể “I **go** there and I **see**…” ⇒ lỗi GRA lặp lại suốt 2 phút.",
        "~~It is famous with~~ → It is famous **for**. ~~very breathtaking~~ → **absolutely** breathtaking. ~~sceneries~~ → **scenery**.",
        "Dừng ở 40–60 giây. Nếu cạn ý, quay lại dòng cuối thẻ (**explain why**) — thêm **một lý do nữa** hoặc **một ví dụ**.",
        "Học thuộc nguyên bài mẫu: giám khảo nhận ra giọng “đọc bài” và có thể hạ điểm. Học **khung câu + từ**, rồi tự nói về **nơi của bạn**.",
      ],
    },
    {
      t: "mcq",
      id: "t2d7-noi-chon",
      title: "Chọn cách nói tốt hơn (5 câu)",
      items: [
        { q: "(1) Thẻ: “Describe a place you visited last year.” Câu mở nào đúng?", options: ["I want to talk about Da Nang, I go there with my family.", "I'd like to talk about a trip I took to Da Nang with my family last summer.", "I will talk about Da Nang which I am visiting last year."], correct: 1, why: "Thẻ **visited** → **quá khứ đơn** (took). Câu 1 dùng hiện tại; câu 3 trộn thì sai." },
        { q: "(2) Câu nào đúng?", options: ["Hoi An is famous for its lanterns.", "Hoi An is famous with its lanterns.", "Hoi An is famous about its lanterns."], correct: 0, why: "**famous for** + N." },
        { q: "(3) Câu nào nghe tự nhiên và ăn điểm hơn?", options: ["The place is very very beautiful.", "The scenery is absolutely breathtaking.", "The scenery is very breathtaking."], correct: 1, why: "**breathtaking** là tính từ mạnh → đi với **absolutely**, không với very." },
        { q: "(4) Thẻ: “a place you would like to visit”. Câu nào đúng?", options: ["When I will get there, I visit the old town.", "When I get there, I will visiting the old town.", "When I get there, I'm going to explore the old town."], correct: 2, why: "Mệnh đề **when + hiện tại đơn**, vế chính **going to + V** (hoặc will + V)." },
        { q: "(5) Còn 40 giây nhưng bạn cạn ý. Nên làm gì?", options: ["Thêm một lý do nữa ở dòng “explain why” kèm ví dụ", "Nói “That's all” và dừng", "Nhắc lại câu mở đầu"], correct: 0, why: "Dòng **explain why** luôn mở rộng được: thêm lý do + ví dụ giữ cho bạn nói đủ 2 phút mà không lặp." },
      ],
    },

    { t: "h", text: "6. Phát âm: /r/ cuối từ và /t/ — giọng Anh và giọng Mỹ" },
    {
      t: "p",
      text: "Bài nghe hôm nay toàn giọng Mỹ. Khi **nói**, bạn **chọn một giọng và giữ nhất quán** — giám khảo không chấm giọng Anh hay Mỹ, chỉ chấm **dễ hiểu** và **ổn định**. Khoá này dùng phiên âm **Anh-Anh** (máy chấm theo phiên âm bên dưới), nên khi đọc các dòng luyện: **không cuốn lưỡi /r/** ở cuối từ và **đọc /t/ rõ**. Mục đích kép: đọc chuẩn một giọng, và **nhận ra** giọng kia khi nghe.",
    },
    {
      t: "table",
      head: ["Từ", "Anh (UK) — bạn luyện", "Mỹ (US) — bạn nghe thấy", "Mẹo"],
      rows: [
        ["car · park · corner", "/kɑː/ · /pɑːk/ · /ˈkɔːnə/ — **không** /r/", "/kɑːr/ · /pɑːrk/ · /ˈkɔːrnər/ — lưỡi cong", "UK: kéo dài nguyên âm thay cho /r/"],
        ["water · better · city", "/ˈwɔːtə/ · /ˈbetə/ · /ˈsɪti/ — /t/ rõ", "≈ “woa-đờr” · “be-đờr” · “xi-đi”", "US: /t/ thành “đờ” nhẹ giữa hai nguyên âm"],
        ["here · there · near", "/hɪə/ · /ðeə/ · /nɪə/", "/hɪr/ · /ðer/ · /nɪr/", "UK: nguyên âm đôi (Tập 1 Ngày 6)"],
        ["first · third · work", "/fɜːst/ · /θɜːd/ · /wɜːk/", "/fɝːst/ · /θɝːd/ · /wɝːk/", "UK /ɜː/ không cong lưỡi; US cong lưỡi suốt"],
      ],
    },
    {
      t: "phatam",
      id: "t2d7-phat-am",
      title: "Luyện phát âm — /r/ cuối từ (không đọc) và /t/ rõ kiểu Anh",
      note: "Bấm “Nghe mẫu”, rồi “Đọc & chấm”. Ở cuối từ như car, corner, here: KHÔNG cong lưỡi, kéo dài nguyên âm. /t/ giữa hai nguyên âm (water, city, better): chạm đầu lưỡi lên lợi, bật /t/ rõ. Khi nghe đề, nhớ giọng Mỹ sẽ làm ngược lại.",
      items: [
        { text: "car, park, corner", ipa: "kɑː pɑːk kɔːnə", vi: "/r/ không đọc — nguyên âm dài" },
        { text: "here, there, near", ipa: "hɪə ðeə nɪə", vi: "kết thúc bằng /ə/, không /r/" },
        { text: "first, third, work", ipa: "fɜːst θɜːd wɜːk", vi: "/ɜː/ kiểu Anh — không cong lưỡi" },
        { text: "water, better, city", ipa: "wɔːtə betə sɪti", vi: "/t/ rõ giữa hai nguyên âm" },
        { text: "The car park is near the corner.", ipa: "ðə kɑː pɑːk ɪz nɪə ðə kɔːnə", vi: "bốn chỗ /r/ không đọc" },
        { text: "The theatre is on the first floor.", ipa: "ðə θɪətər ɪz ɒn ðə fɜːst flɔː", vi: "theatre · first · floor" },
        { text: "It's better to get there a little earlier.", ipa: "ɪts betə tə ɡet ðeər ə lɪtl ɜːliə", vi: "there + a → /r/ nối được đọc khi từ sau bắt đầu bằng nguyên âm" },
        { text: "I'd love to visit a quieter city.", ipa: "aɪd lʌv tə vɪzɪt ə kwaɪətə sɪti", vi: "/t/ rõ trong visit, quieter, city" },
      ],
    },

    { t: "h", text: "7. Luyện nói" },
    {
      t: "p",
      text: "Mỗi thẻ: bấm giờ **1 phút** ghi sơ đồ ý (4 nhánh theo thẻ), rồi nói **đến khi đủ 2 phút**. Dùng ít nhất **3 khung câu** ở mục 2 và **đúng thì** của thẻ. Cuối cùng trả lời nhanh 4 câu Part 1 về kế hoạch (ôn bài ngữ pháp hôm nay).",
    },
    {
      t: "speak",
      id: "t2d7-noi-p2",
      part: "2",
      questions: [
        "Describe a place you would like to visit in the future. You should say: where it is; how you know about it; what you would like to do there; and explain why you want to go there.",
        "Describe a quiet place you like to go to. You should say: where it is; how often you go there; what you do there; and explain why you like it.",
        "Describe a city you visited that you found interesting. You should say: when you went there; who you went with; what you did there; and explain why you found it interesting.",
      ],
    },
    {
      t: "speak",
      id: "t2d7-noi-p1",
      part: "1",
      questions: [
        "What are you doing this weekend?",
        "Are you going to travel anywhere this year?",
        "Do you think you will live in the same city in ten years?",
        "Is there a place in your hometown that you would recommend to visitors?",
      ],
    },
  ],
};

/* ─────────────────────────── Bài tập ─────────────────────────── */

const T2D7_BAI_TAP: Lesson = {
  id: "t2d7-bai-tap",
  kind: "homework",
  title: "Bài tập Ngày 7",
  goal: "Tự kiểm tra Ngày 7: 10 câu chọn cách nói tương lai, 8 câu chia động từ, 6 câu dịch, 6 câu vị trí / giọng Mỹ, 4 câu Part 2 — 34 câu có đáp án và lời giải.",
  minutes: 40,
  blocks: [
    {
      t: "recap",
      title: "Bài tập hôm nay",
      items: [
        "**Phần I** (10 câu): chọn will / going to / hiện tại tiếp diễn / hiện tại đơn.",
        "**Phần II** (8 câu): chia động từ trong ngoặc — có lời giải ngay sau.",
        "**Phần III** (6 câu): dịch Việt → Anh (tương lai + vị trí).",
        "**Phần IV** (6 câu): ngôn ngữ vị trí, từ Mỹ – Anh · **Phần V** (4 câu): đề Part 2 địa điểm.",
      ],
    },
    {
      t: "sodo",
      kind: "mindmap",
      title: "Ngày 7 trong một hình",
      center: "**Ngày 7**",
      branches: [
        { label: "Ngữ pháp: tương lai", items: ["lịch trình → hiện tại đơn", "đã hẹn → am / is / are + V-ing", "đã định / bằng chứng → going to", "vừa quyết định / ý kiến → will", "when / as soon as + hiện tại"] },
        { label: "Nghe: Part 2 bản đồ", items: ["trái / phải theo hướng đi", "diagonally opposite · at the far end", "used to be… but now", "giọng Mỹ: /r/, flap t, first floor"] },
        { label: "Nói: Part 2 địa điểm", items: ["chọn thì theo thẻ", "located · surrounded by · famous for", "the kind of place where", "4 phần · ~2 phút"] },
      ],
    },

    { t: "h", text: "Phần I — Chọn cách nói tương lai (10 câu)" },
    {
      t: "mcq",
      id: "t2d7-bt-chon",
      title: "Phần I — Chọn đáp án đúng (10 câu)",
      items: [
        { q: "(1) The library ___ at 9 p.m. on weekdays.", options: ["is closing", "closes", "will be close"], correct: 1, why: "Giờ đóng cửa = lịch cố định → hiện tại đơn **closes**." },
        { q: "(2) “I've lost my pen.” — “Don't worry, I ___ you mine.”", options: ["'ll lend", "'m lending", "lend"], correct: 0, why: "Đề nghị giúp, quyết định ngay → **will**." },
        { q: "(3) We ___ a meeting with the new manager at 10 tomorrow. It's in my calendar.", options: ["having", "had", "'re having"], correct: 2, why: "Đã sắp xếp, có trong lịch → **hiện tại tiếp diễn**." },
        { q: "(4) She has saved enough money. She ___ a new laptop.", options: ["is going to buy", "buys", "will buying"], correct: 0, why: "Ý định đã có (đã để dành tiền) → **going to**. “will buying” sai dạng." },
        { q: "(5) I'm sure you ___ the test. You've studied so hard.", options: ["are passing", "will pass", "pass"], correct: 1, why: "Dự đoán theo niềm tin (**I'm sure**) → **will**." },
        { q: "(6) As soon as I ___ home, I'll call you.", options: ["will get", "am getting", "get"], correct: 2, why: "Mệnh đề **as soon as** + hiện tại đơn." },
        { q: "(7) The number of visitors ___ to rise to 3 million by 2030.", options: ["is expected", "expects", "is expecting"], correct: 0, why: "Dự báo Task 1: **is expected to + V**." },
        { q: "(8) Watch out! That glass ___ fall off the table!", options: ["going to", "is going to", "falls"], correct: 1, why: "Bằng chứng trước mắt (cái cốc sát mép bàn) → **going to**." },
        { q: "(9) “Shall we go to the beach?” — “Good idea. I ___ my swimsuit.”", options: ["got", "get", "'ll get"], correct: 2, why: "Quyết định ngay lúc nói → **I'll get**." },
        { q: "(10) Câu nào đúng?", options: ["Prices probably won't go down.", "Prices won't probably go down.", "Prices will not probably going down."], correct: 0, why: "Phủ định: **probably won't + V**." },
      ],
    },

    { t: "h", text: "Phần II — Chia động từ trong ngoặc (8 câu)" },
    {
      t: "quiz",
      id: "t2d7-bt-chia",
      title: "Phần II — Viết dạng đúng (có thể là 2–3 từ)",
      kind: "fill",
      items: [
        { q: "(1) Hurry up! The bus ___ (leave) in five minutes.", answers: ["leaves", "is leaving", "'s leaving"] },
        { q: "(2) I ___ (see) the dentist at 4 o'clock this afternoon — I booked it last week.", answers: ["am seeing", "'m seeing", "I'm seeing", "am going to see", "'m going to see"] },
        { q: "(3) “The printer isn't working.” — “OK, I ___ (call) the technician.”", answers: ["will call", "'ll call", "I'll call"] },
        { q: "(4) When you ___ (arrive) at the station, text me.", answers: ["arrive"] },
        { q: "(5) My brother ___ (study) medicine — he decided last year. (dự định)", answers: ["is going to study", "'s going to study"] },
        { q: "(6) I think the new shopping centre ___ (be) very popular. (ý kiến)", answers: ["will be", "'ll be", "is going to be", "'s going to be"] },
        { q: "(7) What time ___ the concert ___ (start)? (viết hai từ, cách nhau dấu cách)", answers: ["does start", "does / start", "does, start"] },
        { q: "(8) We ___ (not / wait) until the rain stops — we've got an umbrella. (dự định)", answers: ["aren't going to wait", "are not going to wait", "'re not going to wait", "won't wait", "will not wait"] },
      ],
    },
    {
      t: "note",
      title: "Lời giải Phần II",
      items: [
        "**(1) leaves** — lịch xe buýt (cố định) → hiện tại đơn, chủ ngữ số ít thêm **-s**. **is leaving** cũng tự nhiên trong lời nói (xe sắp chạy) nên cũng được chấm đúng.",
        "**(2) am seeing** — đã đặt lịch (I booked it) → hiện tại tiếp diễn là lựa chọn tốt nhất. **am going to see** cũng chấp nhận được.",
        "**(3) will call** — quyết định ngay sau khi nghe tin.",
        "**(4) arrive** — mệnh đề **when** + hiện tại đơn (chủ ngữ **you** → không -s).",
        "**(5) is going to study** — quyết định từ năm ngoái = dự định.",
        "**(6) will be** — ý kiến (I think). **is going to be** cũng chấp nhận được.",
        "**(7) does … start** — câu hỏi về lịch: What time **does** the concert **start**?",
        "**(8) aren't going to wait** — dự định (đã có ô). **won't wait** cũng chấp nhận được ở đây (quyết định không đợi).",
      ],
    },

    { t: "h", text: "Phần III — Dịch Việt → Anh (6 câu)" },
    {
      t: "quiz",
      id: "t2d7-bt-dich",
      title: "Phần III — Dịch sang tiếng Anh (6 câu)",
      kind: "translate",
      grammar: "will / be going to / am-is-are + V-ing / hiện tại đơn (lịch) · when + hiện tại · diagonally opposite · at the far end of",
      items: [
        { q: "Chuyến bay của chúng tôi cất cánh lúc 7 giờ sáng.", hint: "Our flight, takes off / leaves / departs, at 7 a.m.", answers: ["Our flight takes off at 7 a.m.", "Our flight leaves at 7 a.m.", "Our flight departs at 7 a.m.", "Our flight takes off at 7 am.", "Our flight leaves at 7 am.", "Our flight takes off at 7 in the morning.", "Our flight leaves at 7 in the morning.", "Our flight takes off at seven a.m.", "Our flight takes off at 7am.", "Our flight leaves at 7am.", "Our flight takes off at 7:00 a.m.", "Our flight departs at 7 in the morning."] },
        { q: "Chủ nhật này tôi chơi cầu lông với anh trai (đã hẹn).", hint: "I'm playing badminton, with my brother, this Sunday", answers: ["I'm playing badminton with my brother this Sunday.", "I am playing badminton with my brother this Sunday.", "This Sunday I'm playing badminton with my brother.", "This Sunday, I'm playing badminton with my brother.", "I'm playing badminton with my older brother this Sunday.", "I'm playing badminton with my brother on Sunday.", "I'm playing badminton with my elder brother this Sunday."] },
        { q: "Tôi nghĩ giá vé xe buýt có lẽ sẽ tăng.", hint: "I think, bus fares, will probably, go up / rise / increase", answers: ["I think bus fares will probably go up.", "I think bus fares will probably rise.", "I think bus fares will probably increase.", "I think bus fares are likely to go up.", "I think bus fares are likely to rise.", "I think bus fares are likely to increase.", "I think the bus fare will probably go up.", "I think the bus fare will probably increase.", "I think bus ticket prices will probably go up.", "I think bus ticket prices will probably increase.", "I think bus ticket prices will probably rise.", "I think the bus ticket price will probably increase.", "I think the bus fare will probably rise."] },
        { q: "Khi tôi có đủ tiền, tôi sẽ mua một chiếc xe máy điện.", hint: "When I have enough money, I'll buy, an electric motorbike / scooter", answers: ["When I have enough money, I'll buy an electric motorbike.", "When I have enough money, I will buy an electric motorbike.", "When I have enough money, I'll buy an electric scooter.", "When I have enough money, I will buy an electric scooter.", "I'll buy an electric motorbike when I have enough money.", "I will buy an electric motorbike when I have enough money.", "When I have enough money, I'm going to buy an electric motorbike.", "When I've got enough money, I'll buy an electric motorbike."] },
        { q: "Quán cà phê ở chéo đối diện ngân hàng.", hint: "The café is, diagonally opposite, the bank", answers: ["The café is diagonally opposite the bank.", "The cafe is diagonally opposite the bank.", "The coffee shop is diagonally opposite the bank."] },
        { q: "Phòng họp ở tận cuối hành lang, bên trái bạn.", hint: "The meeting room is, at the far end of the corridor, on your left", answers: ["The meeting room is at the far end of the corridor, on your left.", "The meeting room is at the far end of the corridor on your left.", "The meeting room is at the far end of the hallway, on your left.", "The meeting room is at the far end of the hallway on your left.", "The meeting room is at the end of the corridor, on your left.", "The meeting room is on your left at the far end of the corridor."] },
      ],
    },

    { t: "h", text: "Phần IV — Vị trí và giọng Mỹ (6 câu)" },
    {
      t: "mcq",
      id: "t2d7-bt-vi-tri",
      title: "Phần IV — Chọn đáp án đúng (6 câu)",
      items: [
        { q: "(1) Bạn đang đi về phía **Nam** (xuống dưới tờ bản đồ). Người nói bảo “It's on your right.” Trên tờ giấy (Bắc ở trên), nơi đó ở phía nào?", options: ["Phía Tây (bên trái tờ giấy)", "Phía Đông (bên phải tờ giấy)", "Phía Bắc"], correct: 0, why: "Đi xuống phía Nam thì **bên phải người đi = phía Tây** = bên **trái** tờ giấy." },
        { q: "(2) “The lift” (Anh) trong giọng Mỹ là…", options: ["the stairs", "the escalator", "the elevator"], correct: 2, why: "lift (UK) = **elevator** (US)." },
        { q: "(3) Một người Mỹ nói “The gym is on the first floor.” Phòng gym ở…", options: ["tầng trên tầng trệt một tầng", "tầng trệt (sát mặt đất)", "tầng hầm"], correct: 1, why: "Mỹ: **first floor** = tầng trệt (Anh: ground floor)." },
        { q: "(4) “The bank is just beyond the post office.” nghĩa là…", options: ["Ngân hàng ở trước bưu điện", "Đi qua bưu điện một chút là tới ngân hàng", "Ngân hàng ở trong bưu điện"], correct: 1, why: "**beyond** = ở phía bên kia, đi quá một chút." },
        { q: "(5) Trong đề nghe, đáp án điền được chấm thế nào nếu bạn viết “centre” còn người nói giọng Mỹ?", options: ["Đúng — cả hai cách viết đều được chấp nhận", "Sai — phải viết center", "Đúng nhưng bị trừ nửa điểm"], correct: 0, why: "Cách viết Anh và Mỹ **đều được chấp nhận**; chỉ chép **sai chữ** mới mất điểm." },
        { q: "(6) “The office used to be on the second floor, but it's now next to the reception.” Văn phòng hiện ở đâu?", options: ["Tầng hai", "Hai nơi đều đúng", "Cạnh quầy lễ tân"], correct: 2, why: "Bẫy **used to be… but it's now** — đáp án là vị trí **hiện tại**: next to the reception." },
      ],
    },

    { t: "h", text: "Phần V — Part 2 địa điểm (4 câu)" },
    {
      t: "mcq",
      id: "t2d7-bt-noi",
      title: "Phần V — Chọn đáp án đúng (4 câu)",
      items: [
        { q: "(1) Thẻ “Describe a place you **often go to** with friends.” Thì chính là…", options: ["Quá khứ đơn", "Tương lai will", "Hiện tại đơn"], correct: 2, why: "**often go to** = thói quen hiện tại → **hiện tại đơn**." },
        { q: "(2) Dòng nào trên thẻ đề thường đáng nói nhiều nhất về cảm xúc / lý do?", options: ["and explain why…", "where it is", "when you went there"], correct: 0, why: "Dòng **and explain…** là chỗ thể hiện ý kiến, cảm xúc — kéo dài và nâng điểm." },
        { q: "(3) Câu nào đúng?", options: ["It's the kind of place where you can relax.", "It's the kind of place which you can relax.", "It's the kind of place you can relax at it."], correct: 0, why: "**the kind of place where + S + V** (where thay cho nơi chốn)." },
        { q: "(4) Trong 1 phút chuẩn bị, nên…", options: ["viết câu hoàn chỉnh cho phần mở đầu", "ghi từ khoá theo 4 nhánh của thẻ", "không ghi gì để tập trung nghĩ"], correct: 1, why: "Chỉ đủ thời gian ghi **từ khoá**; sơ đồ 4 nhánh giúp nói đủ mọi dòng của thẻ." },
      ],
    },
  ],
};

export const NGAY_7: Lesson[] = [T2D7_NGU_PHAP, T2D7_NGHE, T2D7_NOI, T2D7_BAI_TAP];
