/**
 * IELTS Tập 2 — Ngày 21 (chặng 4) — tự soạn 12/11/2026, không chép sách / đề thật.
 *   Bài 1 (grammar)   — used to / would; quá khứ tiếp diễn + when / while; ôn quá khứ đơn [G20 · G06 vòng 2]
 *   Bài 2 (listening) — Đề nhỏ Part 3 + Part 4 (20 câu, đúng giờ, tự chấm) [L05 L06 L11 L12 L07]
 *   Bài 3 (speaking)  — Part 3: so sánh quá khứ – hiện tại [S06] · 🔊 -ed ba cách đọc
 *   Bài tập           — 40 câu.
 */
import type { Lesson } from '../data';

/* ─────────────────────────── Bài 1 · Ngữ pháp ─────────────────────────── */

const T2D21_GRAMMAR: Lesson = {
  id: "t2d21-ngu-phap",
  kind: "grammar",
  title: "used to / would; quá khứ tiếp diễn + when / while",
  goal: "Kể về thói quen đã bỏ bằng used to / would, đặt bối cảnh câu chuyện bằng quá khứ tiếp diễn và nối hai hành động bằng when / while — để kể chuyện Part 2 và so sánh xưa – nay ở Part 3 đúng thì (GRA band 5).",
  minutes: 75,
  blocks: [
    {
      t: "recap",
      title: "Bài này học gì — đẩy band nào",
      items: [
        "**used to + V**: thói quen / trạng thái **ngày xưa có, bây giờ không còn**: I **used to** live in Hue. (Giờ không sống ở Huế nữa.)",
        "**would + V**: hành động **lặp lại** ngày xưa (kể chuyện hoài niệm) — **không** dùng cho trạng thái: ~~I would have long hair~~ → I **used to** have long hair.",
        "**Quá khứ tiếp diễn** was / were + V-ing: việc **đang diễn ra** tại một thời điểm trong quá khứ — làm **bối cảnh** cho câu chuyện.",
        "**when / while**: việc dài (quá khứ tiếp diễn) **bị cắt ngang** bởi việc ngắn (quá khứ đơn): I **was walking** home **when** it **started** to rain.",
        "Đẩy **GRA** Speaking: Part 3 hay hỏi “How has … changed?” — câu trả lời band 5 phải có **used to** cho quá khứ và **hiện tại đơn / HTHT** cho bây giờ; Part 2 kể chuyện cần quá khứ tiếp diễn làm nền.",
      ],
    },

    /* ── 1 ── */
    { t: "h", text: "1. Ôn nhanh quá khứ đơn — nền của mọi thì quá khứ" },
    {
      t: "p",
      text: "Mọi cấu trúc hôm nay đứng trên **quá khứ đơn** (Tập 1 Ngày 9): việc **đã xong** ở một thời điểm xác định trong quá khứ. Trước khi học cái mới, kiểm tra lại ba dạng và những động từ bất quy tắc hay dùng khi kể chuyện.",
    },
    {
      t: "table",
      caption: "Quá khứ đơn — ba dạng câu",
      head: ["Dạng", "Công thức", "Ví dụ"],
      rows: [
        ["Khẳng định", "S + V-ed / V2 (bất quy tắc)", "We **moved** to Da Nang in 2015. · I **met** her at university."],
        ["Phủ định", "S + did not (didn't) + V", "They **didn't have** a TV until 1995."],
        ["Câu hỏi", "Did + S + V …?", "**Did** your grandparents **have** a car?"],
      ],
    },
    {
      t: "table",
      caption: "15 động từ bất quy tắc hay gặp nhất khi kể chuyện quá khứ",
      head: ["V", "V2 (quá khứ)", "V", "V2", "V", "V2"],
      rows: [
        ["go", "went", "see", "saw", "take", "took"],
        ["get", "got", "come", "came", "give", "gave"],
        ["make", "made", "find", "found", "think", "thought"],
        ["buy", "bought", "teach", "taught", "feel", "felt"],
        ["leave", "left", "spend", "spent", "begin", "began"],
      ],
    },
    {
      t: "note",
      title: "Cẩn thận: ba lỗi quá khứ đơn còn sót đến band 5",
      items: [
        "**Quên đuôi -ed khi nói** (I visit my grandma last week) — giám khảo nghe ra lỗi ngữ pháp. Xem mục 🔊 cuối bài Nói hôm nay.",
        "**didn't + V2**: ~~I didn't went~~ → I didn't **go** (did đã gánh thì quá khứ).",
        "**Bị động quá khứ quên was/were** (Tập 1 Ngày 15): ~~The bridge built in 1990~~ → The bridge **was built** in 1990.",
      ],
    },
    {
      t: "rule",
      formula: "S + V-ed / V2 · S + didn't + V · Did + S + V? · (bị động) S + was / were + V3",
      vi: "Quá khứ đơn: việc đã xong ở thời điểm xác định; dùng làm nền cho used to, would và quá khứ tiếp diễn.",
    },
    {
      t: "quiz",
      id: "t2d21-qkd-dich",
      title: "Dịch sang tiếng Anh — ôn quá khứ đơn (3 câu)",
      kind: "translate",
      grammar: "S + V-ed / V2 · S + didn't + V · Did + S + V? · S + was/were + V3.",
      items: [
        { q: "Gia đình tôi chuyển đến Hà Nội năm 2010.", hint: "My family, moved to, Hanoi, in 2010", answers: ["My family moved to Hanoi in 2010.", "My family moved to Ha Noi in 2010.", "In 2010 my family moved to Hanoi.", "In 2010, my family moved to Hanoi."] },
        { q: "Ông bà tôi không có điện thoại cho tới những năm 1990.", hint: "My grandparents, didn't have, a phone, until the 1990s", answers: ["My grandparents didn't have a phone until the 1990s.", "My grandparents did not have a phone until the 1990s.", "My grandparents didn't have a telephone until the 1990s.", "My grandparents did not have a telephone until the 1990s."] },
        { q: "Ngôi trường được xây năm 1985.", hint: "The school, was built, in 1985", answers: ["The school was built in 1985.", "The school was constructed in 1985."] },
      ],
    },

    /* ── 2 ── */
    { t: "h", text: "2. used to + V — “ngày xưa thì có, giờ thì không”" },
    {
      t: "p",
      text: "**used to + V nguyên mẫu** nói về **thói quen** hoặc **trạng thái** kéo dài trong quá khứ mà **bây giờ đã chấm dứt**. Tiếng Việt hay dùng “**hồi trước / ngày xưa … hay …**”. Điểm khác quá khứ đơn: used to nhấn mạnh **sự đối lập với hiện tại** — người nghe hiểu ngay “giờ không còn như thế”.",
    },
    {
      t: "sodo",
      kind: "timeline",
      title: "used to: lặp lại / kéo dài trong quá khứ — rồi DỪNG trước bây giờ",
      caption: "Đoạn màu kết thúc trước mốc “bây giờ”: đó là ý nghĩa của used to. Nếu việc vẫn còn tiếp diễn đến hôm nay → dùng hiện tại đơn hoặc hiện tại hoàn thành (Tập 2 Ngày 5).",
      marks: [
        { from: -9, to: -3, label: "I **used to play** football every afternoon. (thói quen — giờ không đá nữa)", kieu: "lap", mau: 1 },
        { from: -9, to: -4, label: "We **used to live** in a small village. (trạng thái — giờ sống ở thành phố)", kieu: "doan", mau: 2 },
        { from: -1, to: 2, label: "Now I **play** badminton. (hiện tại đơn)", kieu: "lap", mau: 3 },
      ],
    },
    {
      t: "patterns",
      rows: [
        {
          formula: "S + used to + V",
          vi: "Khẳng định — mọi chủ ngữ dùng chung used to (không thêm -s).",
          examples: [
            { en: "My mother used to walk to school every day.", vi: "Mẹ tôi ngày xưa ngày nào cũng đi bộ đến trường." },
            { en: "There used to be a cinema on this street.", vi: "Trên con phố này từng có một rạp chiếu phim." },
          ],
        },
        {
          formula: "S + didn't use to + V · S + never used to + V",
          vi: "Phủ định — sau didn't là use (không có -d). never used to cũng rất hay dùng.",
          examples: [
            { en: "I didn't use to like vegetables, but now I eat them every day.", vi: "Hồi trước tôi không thích rau, nhưng giờ ngày nào tôi cũng ăn." },
            { en: "People never used to work from home.", vi: "Ngày xưa người ta chẳng bao giờ làm việc ở nhà." },
          ],
        },
        {
          formula: "Did + S + use to + V …?",
          vi: "Câu hỏi — cũng bỏ -d sau Did.",
          examples: [
            { en: "Did you use to play outside when you were a child?", vi: "Hồi nhỏ bạn có hay chơi ngoài trời không?" },
            { en: "What did people use to do in the evenings before television?", vi: "Trước khi có tivi, buổi tối người ta thường làm gì?" },
          ],
        },
      ],
    },
    {
      t: "sodo",
      kind: "compare",
      title: "Ba cấu trúc trông giống nhau — nghĩa khác hẳn",
      caption: "Chỉ used to + V nói về quá khứ. be used to và get used to nói về chuyện QUEN (dùng được ở mọi thì) và theo sau là V-ing / danh từ.",
      cols: [
        { title: "**used to + V**", anh: "hourglass-done", items: ["= ngày xưa hay / từng", "I **used to get up** at 5. (giờ không nữa)", "chỉ ở quá khứ"] },
        { title: "**be used to + V-ing / N**", anh: "relieved-face", items: ["= ĐÃ QUEN với", "I **am used to getting up** at 5. (dậy sớm không thấy khó)", "am / is / are / was / were"] },
        { title: "**get used to + V-ing / N**", anh: "seedling", items: ["= DẦN QUEN với", "I'm **getting used to** the cold weather.", "quá trình đang thích nghi"] },
      ],
    },
    {
      t: "note",
      title: "Cẩn thận: năm lỗi với used to",
      items: [
        "**Dùng cho hiện tại**: ~~I use to drink coffee every morning.~~ → thói quen HIỆN TẠI dùng **hiện tại đơn**: I **usually drink** coffee every morning.",
        "**didn't used to**: ~~I didn't used to~~ → I didn't **use** to (sau did là nguyên mẫu). (Một số người bản ngữ viết “didn't used to”, nhưng trong bài thi hãy viết **didn't use to**.)",
        "**used to + V-ing**: ~~I used to going~~ → I used to **go**. (V-ing chỉ đi sau **be / get used to**.)",
        "**Có số lần cụ thể / mốc thời gian một lần**: ~~I used to visit Hue three times in 2019.~~ → I **visited** Hue three times in 2019 (đã đếm được → quá khứ đơn).",
        "**Phát âm**: used to đọc **/ˈjuːst tə/** — âm /s/ chứ không phải /z/, và hai chữ dính liền (“yút-tơ”).",
      ],
    },
    {
      t: "rule",
      formula: "S + used to + V · S + didn't use to + V · Did + S + use to + V? (≠ be / get used to + V-ing)",
      vi: "used to: thói quen hoặc trạng thái trong quá khứ, nay đã thôi — chỉ có ở quá khứ.",
    },
    {
      t: "quiz",
      id: "t2d21-used-to-dich",
      title: "Dịch sang tiếng Anh — used to (5 câu)",
      kind: "translate",
      grammar: "S + used to + V · didn't use to + V · Did + S + use to + V? · There used to be + N.",
      items: [
        { q: "Hồi nhỏ tôi hay câu cá với ông.", hint: "I used to go fishing, with my grandfather, when I was a child / when I was little", answers: ["I used to go fishing with my grandfather when I was a child.", "When I was a child, I used to go fishing with my grandfather.", "I used to go fishing with my grandfather when I was little.", "When I was little, I used to go fishing with my grandfather.", "When I was a child I used to go fishing with my grandfather.", "I used to go fishing with my grandpa when I was a child.", "When I was a kid, I used to go fishing with my grandfather."] },
        { q: "Ở đây từng có một cái chợ lớn.", hint: "There used to be, a big market, here", answers: ["There used to be a big market here.", "There used to be a large market here."] },
        { q: "Ngày xưa bố tôi không thích thể thao.", hint: "My father, didn't use to like, sport(s)", answers: ["My father didn't use to like sport.", "My father didn't use to like sports.", "My dad didn't use to like sport.", "My dad didn't use to like sports.", "My father never used to like sport.", "My father never used to like sports.", "My father did not use to like sport.", "My father did not use to like sports."] },
        { q: "Hồi đi học bạn có hay mặc đồng phục không?", hint: "Did you use to wear a uniform, at school / when you were at school", answers: ["Did you use to wear a uniform at school?", "Did you use to wear a uniform when you were at school?", "Did you use to wear a school uniform?", "When you were at school, did you use to wear a uniform?"] },
        { q: "Tôi đã quen với việc dậy sớm.", hint: "be used to + V-ing: I am used to getting up early", answers: ["I am used to getting up early.", "I'm used to getting up early.", "I have got used to getting up early.", "I've got used to getting up early.", "I am used to waking up early.", "I'm used to waking up early."] },
      ],
    },

    /* ── 3 ── */
    { t: "h", text: "3. would + V — kể lại những việc lặp đi lặp lại ngày xưa" },
    {
      t: "p",
      text: "Khi **kể chuyện hoài niệm**, sau khi đã dựng bối cảnh bằng **used to** hoặc **quá khứ đơn**, người bản ngữ hay chuyển sang **would + V** để kể tiếp các việc **lặp lại** cho đỡ lặp “used to… used to… used to”. Nghĩa của **would** ở đây là “**thường hay**” — không phải “sẽ”.",
    },
    {
      t: "examples",
      items: [
        { en: "When I was a child, we used to spend every summer at my grandmother's house. Every morning, she would wake us up at six, and we would help her feed the chickens. In the afternoon, we would swim in the river until it got dark.", vi: "Hồi nhỏ, mùa hè nào chúng tôi cũng ở nhà bà. Sáng nào bà cũng gọi chúng tôi dậy lúc sáu giờ, và chúng tôi thường phụ bà cho gà ăn. Buổi chiều chúng tôi hay bơi ở sông cho tới khi trời tối. (used to dựng bối cảnh → would kể tiếp)" },
      ],
    },
    {
      t: "table",
      caption: "used to · would · quá khứ đơn — khi nào dùng được cái nào?",
      head: ["Loại ý", "used to", "would", "quá khứ đơn", "Ví dụ"],
      rows: [
        ["Hành động **lặp lại** (thói quen)", "✓", "✓", "✓", "We **used to play / would play / played** in the street after school."],
        ["**Trạng thái** (be, have, live, like, know…)", "✓", "✗", "✓", "I **used to have** long hair. ~~I would have long hair.~~"],
        ["Việc **một lần**", "✗", "✗", "✓", "I **broke** my arm in 2015."],
        ["Có **số lần / khoảng thời gian cụ thể**", "✗", "✗", "✓", "I **lived** there **for ten years**. · I **went** there **five times**."],
      ],
    },
    {
      t: "note",
      title: "Cẩn thận: would dễ bị hiểu thành “sẽ”",
      items: [
        "Đừng **mở đầu** câu chuyện bằng would — người nghe chưa biết bạn đang nói quá khứ. Mở bằng **used to / When I was…** trước, rồi mới would.",
        "**would** không dùng cho trạng thái: ~~We would live in a small flat.~~ → We **used to live** in a small flat.",
        "Trong Speaking, would rút gọn **'d**: we'd, she'd — nghe cũng như “we had / she had”. Nhìn động từ sau: we'd **play** (would) · we'd **played** (had).",
      ],
    },
    {
      t: "rule",
      formula: "(bối cảnh) When I was …, S + used to + V … → S + would ('d) + V … (hành động lặp lại, không dùng cho trạng thái)",
      vi: "would kể tiếp thói quen hành động ngày xưa sau khi đã có bối cảnh quá khứ.",
    },
    {
      t: "quiz",
      id: "t2d21-would-dich",
      title: "Dịch sang tiếng Anh — would kể chuyện xưa (3 câu)",
      kind: "translate",
      grammar: "Bối cảnh: When I was …, … used to … → kể tiếp: S + would + V (hành động lặp lại).",
      items: [
        { q: "Mỗi Tết, bà tôi thường gói bánh chưng.", hint: "Every Tet, my grandmother, would make banh chung", answers: ["Every Tet, my grandmother would make banh chung.", "Every Tet my grandmother would make banh chung.", "Every Tet, my grandma would make banh chung.", "Every Tet, my grandmother used to make banh chung.", "Every Tet my grandmother used to make banh chung."] },
        { q: "Sau giờ học, chúng tôi thường đá bóng ngoài đường.", hint: "After school, we would play football, in the street", answers: ["After school, we would play football in the street.", "After school we would play football in the street.", "After school, we used to play football in the street.", "After school we used to play football in the street.", "We would play football in the street after school.", "We used to play football in the street after school."] },
        { q: "Hồi trước tôi có mái tóc dài. (trạng thái — không dùng would)", hint: "I used to have, long hair", answers: ["I used to have long hair.", "I had long hair.", "I used to have long hair before."] },
      ],
    },

    /* ── 4 ── */
    { t: "h", text: "4. Quá khứ tiếp diễn — “lúc đó đang…”" },
    {
      t: "p",
      text: "**Past continuous** (quá khứ tiếp diễn) = **was / were + V-ing**: một việc **đang diễn ra dở dang** tại một thời điểm trong quá khứ. Tiếng Việt: “**lúc đó đang** …”. Nó hiếm khi đứng một mình — thường đi với **một mốc giờ** (at 8 p.m. last night) hoặc **một việc khác xen vào**.",
    },
    {
      t: "table",
      caption: "Quá khứ tiếp diễn — ba dạng",
      head: ["Dạng", "Công thức", "Ví dụ"],
      rows: [
        ["Khẳng định", "S + was / were + V-ing", "At 8 p.m. yesterday, I **was watching** the match."],
        ["Phủ định", "S + wasn't / weren't + V-ing", "We **weren't listening** to the teacher."],
        ["Câu hỏi", "Was / Were + S + V-ing …?", "What **were** you **doing** when I called?"],
      ],
    },
    {
      t: "table",
      caption: "Ba cách dùng chính",
      head: ["Cách dùng", "Ví dụ"],
      rows: [
        ["1. Đang làm gì **tại một thời điểm** quá khứ", "**This time last year**, I **was studying** for my final exams."],
        ["2. **Bối cảnh** mở đầu câu chuyện (Part 2)", "It **was raining** heavily, and everyone **was hurrying** home. Suddenly, …"],
        ["3. Hai việc **cùng diễn ra** song song", "**While** my mother **was cooking**, my father **was reading** the newspaper."],
      ],
    },
    {
      t: "note",
      title: "Cẩn thận: động từ trạng thái không chia tiếp diễn",
      items: [
        "Động từ chỉ **trạng thái, cảm xúc, sở hữu, suy nghĩ**: know, like, love, want, need, believe, understand, own, belong, seem → dùng **quá khứ đơn**: ~~I was knowing the answer.~~ → I **knew** the answer.",
        "**was / were** theo chủ ngữ: I / he / she / it **was**; you / we / they **were**. ~~They was playing~~ là lỗi rất dễ nghe ra khi nói nhanh.",
      ],
    },

    /* ── 5 ── */
    { t: "h", text: "5. when / while — việc dài bị việc ngắn cắt ngang" },
    {
      t: "sodo",
      kind: "timeline",
      title: "“I was walking home when it started to rain.”",
      caption: "Việc dài (đang đi bộ — quá khứ tiếp diễn) là một đoạn; việc ngắn (bắt đầu mưa — quá khứ đơn) là một điểm rơi vào giữa đoạn đó.",
      marks: [
        { from: -7, to: -2, label: "**was walking** home (việc dài — quá khứ tiếp diễn)", kieu: "doan", mau: 1 },
        { from: -4, label: "it **started** to rain (việc ngắn — quá khứ đơn)", kieu: "diem", mau: 2 },
      ],
    },
    {
      t: "patterns",
      rows: [
        {
          formula: "S + was / were + V-ing + when + S + V-ed / V2.",
          vi: "when đứng trước việc NGẮN (quá khứ đơn) cắt ngang.",
          examples: [
            { en: "I was having dinner when the lights went out.", vi: "Tôi đang ăn tối thì mất điện." },
            { en: "She was living in Hue when she met her husband.", vi: "Cô ấy đang sống ở Huế thì gặp chồng." },
          ],
        },
        {
          formula: "While + S + was / were + V-ing, S + V-ed / V2.",
          vi: "while đứng trước việc DÀI (quá khứ tiếp diễn). Mệnh đề when/while đứng đầu câu → có dấu phẩy.",
          examples: [
            { en: "While we were playing football, it started to rain.", vi: "Trong lúc chúng tôi đang đá bóng thì trời bắt đầu mưa." },
            { en: "While I was waiting for the bus, I saw an old friend.", vi: "Trong lúc chờ xe buýt, tôi gặp một người bạn cũ." },
          ],
        },
        {
          formula: "While + S + was / were + V-ing, S + was / were + V-ing.",
          vi: "Hai việc dài song song — cả hai đều tiếp diễn.",
          examples: [
            { en: "While I was studying, my brother was playing video games.", vi: "Trong lúc tôi học thì em tôi chơi game." },
          ],
        },
        {
          formula: "When + S + V-ed / V2, S + V-ed / V2.",
          vi: "Hai việc ngắn NỐI TIẾP nhau (việc này xong mới đến việc kia) — cả hai quá khứ đơn.",
          examples: [
            { en: "When the bell rang, everyone left the room.", vi: "Khi chuông reo, mọi người rời khỏi phòng. (chuông reo trước, rồi mới ra)" },
          ],
        },
      ],
    },
    {
      t: "note",
      title: "Cẩn thận: when + tiếp diễn hay when + đơn — nghĩa khác nhau",
      items: [
        "When I arrived, they **were having** dinner. → Lúc tôi đến, họ **đang ăn dở**.",
        "When I arrived, they **had** dinner. → Tôi đến **rồi** họ mới ăn (nối tiếp).",
        "**while + quá khứ đơn ngắn** là sai: ~~While the phone rang, …~~ → **When** the phone rang, … (việc ngắn đi với when).",
        "**when** cũng đứng được trước việc dài: **When / While** I was walking home, it started to rain. Chiều ngược lại thì không: **while** không đứng trước việc ngắn.",
      ],
    },
    {
      t: "rule",
      formula: "S + was / were + V-ing + when + S + V2 · While + S + was / were + V-ing, S + V2 · When + S + V2, S + V2 (nối tiếp)",
      vi: "Việc dài dùng quá khứ tiếp diễn (đi với while), việc ngắn cắt ngang dùng quá khứ đơn (đi với when).",
    },
    {
      t: "quiz",
      id: "t2d21-when-while-dich",
      title: "Dịch sang tiếng Anh — quá khứ tiếp diễn + when / while (5 câu)",
      kind: "translate",
      grammar: "S + was/were + V-ing + when + S + V2 · While + S + was/were + V-ing, S + V2 · At + giờ + mốc quá khứ, S + was/were + V-ing.",
      items: [
        { q: "Lúc 9 giờ tối qua tôi đang xem phim.", hint: "At 9 p.m. last night / yesterday, I was watching a film / movie", answers: ["At 9 p.m. last night, I was watching a film.", "At 9 p.m. last night I was watching a film.", "At 9 p.m. last night, I was watching a movie.", "At 9 p.m. last night I was watching a movie.", "I was watching a film at 9 p.m. last night.", "I was watching a movie at 9 p.m. last night.", "At 9 pm last night, I was watching a film.", "At 9 pm last night, I was watching a movie.", "At nine o'clock last night, I was watching a film.", "At 9 o'clock last night, I was watching a film."] },
        { q: "Tôi đang đạp xe đến trường thì gặp tai nạn.", hint: "I was cycling to school, when, I had an accident", answers: ["I was cycling to school when I had an accident.", "I was riding my bike to school when I had an accident.", "I was riding my bicycle to school when I had an accident.", "I was cycling to school when I was in an accident."] },
        { q: "Trong lúc chúng tôi đang ăn tối thì điện thoại reo.", hint: "While we were having dinner, the phone rang", answers: ["While we were having dinner, the phone rang.", "While we were eating dinner, the phone rang.", "The phone rang while we were having dinner.", "The phone rang while we were eating dinner.", "While we were having dinner the phone rang."] },
        { q: "Trong lúc mẹ tôi nấu ăn thì bố tôi đang dọn nhà.", hint: "While my mother was cooking, my father was cleaning the house", answers: ["While my mother was cooking, my father was cleaning the house.", "While my mom was cooking, my dad was cleaning the house.", "While my mum was cooking, my dad was cleaning the house.", "My father was cleaning the house while my mother was cooking.", "While my mother was cooking, my father was tidying the house.", "While my mother was cooking my father was cleaning the house."] },
        { q: "Khi trận đấu kết thúc, chúng tôi đi về nhà.", hint: "When the match ended / finished, we went home", answers: ["When the match ended, we went home.", "When the match finished, we went home.", "When the game ended, we went home.", "When the game finished, we went home.", "We went home when the match ended.", "We went home when the match finished.", "When the match was over, we went home."] },
      ],
    },

    /* ── 6 ── */
    { t: "h", text: "6. Luyện tổng hợp" },
    {
      t: "mcq",
      id: "t2d21-np-chon",
      title: "Chọn đáp án đúng (12 câu)",
      items: [
        { q: "When I was a child, I ___ afraid of the dark.", options: ["used to be", "would be", "was being", "use to be"], correct: 0, why: "**be afraid** là trạng thái → **used to** (would không dùng cho trạng thái)." },
        { q: "Every evening, my grandfather ___ us stories about the war.", options: ["was telling", "would tell", "used to telling", "is telling"], correct: 1, why: "Hành động **lặp lại** ngày xưa (Every evening) → **would tell** (cũng có thể used to tell). ~~used to telling~~ sai dạng." },
        { q: "I ___ TV when you called me last night.", options: ["watched", "used to watch", "was watching", "would watch"], correct: 2, why: "Việc **đang diễn ra** thì bị cuộc gọi cắt ngang → **was watching**." },
        { q: "While she ___ to work, she saw an accident.", options: ["is driving", "drives", "has driven", "was driving"], correct: 3, why: "**While** + việc dài → quá khứ tiếp diễn **was driving**." },
        { q: "Did you ___ live near the sea?", options: ["used to", "use to", "using to", "uses to"], correct: 1, why: "Sau **Did** dùng nguyên mẫu → **use to**." },
        { q: "My father has worked nights for years, so he ___ sleeping during the day.", options: ["is used to", "used to", "use to", "was used"], correct: 0, why: "Nghĩa “**đã quen với**” + V-ing → **is used to** sleeping. ~~used to sleeping~~ sai dạng." },
        { q: "We were playing cards ___ the lights suddenly went out.", options: ["while", "during", "when", "as soon"], correct: 2, why: "Việc ngắn cắt ngang (went out) đi với **when**." },
        { q: "I ___ my keys three times last month.", options: ["used to lose", "would lose", "was losing", "lost"], correct: 3, why: "Có **số lần cụ thể** (three times) → **quá khứ đơn** lost." },
        { q: "There ___ a big tree in front of our house, but it was cut down.", options: ["used to be", "would be", "was being", "used to being"], correct: 0, why: "**There used to be** + N — trạng thái ngày xưa, nay không còn." },
        { q: "A: What ___ at 10 o'clock yesterday morning? — B: I was having a meeting.", options: ["did you do", "were you doing", "you were doing", "would you do"], correct: 1, why: "Đang làm gì **tại một thời điểm** quá khứ → **were you doing** (câu hỏi đảo were)." },
        { q: "She ___ the answer, so she raised her hand.", options: ["was knowing", "would know", "knew", "used to knowing"], correct: 2, why: "**know** là động từ trạng thái → không chia tiếp diễn → **knew**." },
        { q: "I ___ to like coffee, but now I drink it every day.", options: ["wasn't used", "didn't used", "wouldn't", "didn't use"], correct: 3, why: "Phủ định của used to: **didn't use to** + V." },
      ],
    },
  ],
};

/* ─────────────────────────── Bài 2 · Nghe ─────────────────────────── */

const T2D21_LISTENING: Lesson = {
  id: "t2d21-nghe",
  kind: "listening",
  title: "Đề nhỏ Part 3 + Part 4 (20 câu, đúng giờ)",
  goal: "Làm liền một nửa bài Listening khó (Part 3: ba người thảo luận đồ án — trắc nghiệm + nối; Part 4: bài giảng — điền ghi chú) đúng giờ, chỉ nghe một lần, tự chấm, ước band và ghi lỗi vào sổ (Listening band 5: P3+P4 ≥ 5/20).",
  minutes: 60,
  blocks: [
    {
      t: "recap",
      title: "Bài này học gì — đẩy band nào",
      items: [
        "Hôm nay là **đề nhỏ**: Part 3 (câu 21–30) + Part 4 (câu 31–40) — **nửa khó** của bài Listening, làm **liền**, **nghe một lần**, không dừng băng.",
        "**Part 3**: 2 sinh viên + 1 giảng viên bàn đồ án; dạng **trắc nghiệm A/B/C** (21–25) và **nối người – ý** (26–30). Đáp án ẩn sau **paraphrase** và **đổi ý**.",
        "**Part 4**: bài giảng lịch sử xe đạp; **Note completion** (31–40), ONE WORD AND/OR A NUMBER.",
        "Cuối bài: **tự chấm**, đổi điểm /20 ra mức ước tính, ghi câu sai vào **sổ lỗi** theo loại (paraphrase · bẫy đổi ý · chính tả · số ít/nhiều).",
        "Band 5 toàn bài cần **16/40**; phần lớn đến từ Part 1–2. Mục tiêu nửa khó: **≥ 5/20** — vượt 8/20 là bạn đang ở mức band 5.5.",
      ],
    },

    /* ── 1 ── */
    { t: "h", text: "1. Trước khi bấm nghe — luật chơi của đề nhỏ" },
    {
      t: "note",
      title: "Làm như phòng thi",
      items: [
        "Mở sẵn **giấy nháp**, tắt thông báo điện thoại. **Không** mở lời thoại, **không** tua lại.",
        "Mỗi bài nghe có thời gian **đọc câu hỏi** trước (lời dẫn sẽ đếm giây) — dùng nó để **gạch từ khoá** và đoán loại từ.",
        "Part 3 có **ba giọng**: một sinh viên nữ, một sinh viên nam, một giảng viên. Ghi chữ cái đầu tên cạnh ý nào của ai.",
        "Lỡ một câu → **bỏ, nhảy câu sau**. Làm xong mới được bấm “Xem lời thoại”.",
      ],
    },
    {
      t: "sodo",
      kind: "compare",
      title: "Part 3 trắc nghiệm vs Part 3 nối (matching)",
      cols: [
        {
          title: "**MCQ A/B/C** (21–25)",
          anh: "check-box-with-check",
          items: [
            "Đọc câu hỏi (phần thân) trước, gạch từ khoá; **đáp án đúng gần như luôn được paraphrase**.",
            "Cả ba phương án thường **đều được nhắc tới** — hai cái bị gạt đi (not really · actually · in the end we didn't).",
            "Nghe **ai quyết định / ai đồng ý cuối cùng**.",
          ],
        },
        {
          title: "**Matching** (26–30)",
          anh: "link",
          items: [
            "Danh sách người / mục đi **theo thứ tự** băng; danh sách phương án (A–G) **không theo thứ tự**.",
            "Có **2 phương án thừa** — một số còn được nhắc tới để gây nhiễu.",
            "Mỗi người: nghe xong mới chốt, vì người nói hay **sửa lại**.",
          ],
        },
      ],
    },

    /* ── 2 ── */
    { t: "h", text: "2. PART 3 — Questions 21–30: A local history project" },
    {
      t: "canh",
      anh: ["woman-student", "man-student", "teacher", "old-woman", "old-man"],
      caption: "Holly và Ben, hai sinh viên năm hai ngành Xã hội học, gặp giảng viên hướng dẫn — Dr Carter — để báo cáo đồ án: phỏng vấn người cao tuổi trong thị trấn về cách họ giải trí ngày xưa.",
    },
    {
      t: "p",
      text: "**Questions 21–25.** Choose the correct letter, **A**, **B** or **C**.",
    },
    {
      t: "table",
      caption: "Questions 21–25",
      head: ["Câu", "Câu hỏi", "A", "B", "C"],
      rows: [
        ["21", "Why did the students choose this topic?", "Their tutor suggested it.", "They read about a closure in the local news.", "One of them works at a leisure centre."],
        ["22", "How did they find people to interview?", "through the town library", "through a social media group", "at a centre for older people"],
        ["23", "What problem did they have with the interviews?", "Some people talked for too long.", "Some recordings were of poor quality.", "Many people cancelled."],
        ["24", "What does Dr Carter suggest they add?", "figures from the town council", "interviews with teenagers", "old photographs"],
        ["25", "What do the students agree was the biggest change?", "People spend less time with their neighbours.", "Leisure has become more expensive.", "People do more sport than before."],
      ],
    },
    {
      t: "p",
      text: "**Questions 26–30.** What does each person remember most about their free time in the past? Choose **FIVE** answers from the box and write the correct letter, **A–G**, next to questions 26–30.",
    },
    {
      t: "table",
      caption: "Box — Free time in the past",
      head: ["", "Person used to / would…"],
      rows: [
        ["A", "go dancing every week"],
        ["B", "spend most evenings listening to the radio"],
        ["C", "have no free time on weekdays"],
        ["D", "play football in the street"],
        ["E", "go to the cinema every Saturday"],
        ["F", "read newspapers aloud to the family"],
        ["G", "go fishing with a parent"],
      ],
    },
    {
      t: "table",
      caption: "People",
      head: ["Câu", "Người được phỏng vấn"],
      rows: [
        ["26", "Mr Patel"],
        ["27", "Mrs Green"],
        ["28", "Mr Okafor"],
        ["29", "Mrs Lee"],
        ["30", "Mr Brown"],
      ],
    },
    {
      t: "listen",
      id: "t2d21-nghe-p3",
      title: "A local history project",
      dan: { so: "Day 21, Part 3", boiCanh: "two students, Holly and Ben, discussing their project with their tutor, Dr Carter.", cau: [21, 30] },
      note: "Khoảng 5 phút, ba người nói. Nghe một lần.",
      lines: [
        { who: "Dr Carter", voice: "uk-nam", text: "Come in, Holly, Ben. So, how's the local history project going? Remind me why you chose leisure as your topic.", vi: "Mời vào, Holly, Ben. Đồ án lịch sử địa phương thế nào rồi? Nhắc lại cho tôi vì sao các em chọn chủ đề giải trí." },
        { who: "Holly", voice: "uk-nu", text: "Well, at first we were thinking about transport, because you'd mentioned it in class. But then we saw a story in the town newspaper about the old Regal cinema closing down after eighty years, and we thought, how did people spend their free time before everyone had a phone?", vi: "Dạ, lúc đầu bọn em định làm về giao thông vì thầy có nhắc trên lớp. Nhưng rồi bọn em đọc một bài trên báo thị trấn về rạp Regal cũ đóng cửa sau tám mươi năm, và bọn em nghĩ: trước khi ai cũng có điện thoại thì người ta dùng thời gian rảnh thế nào?" },
        { who: "Ben", voice: "us-nam", text: "Yeah, and I do work part-time at the sports centre, but that's not really why we picked it.", vi: "Vâng, và em có làm bán thời gian ở trung tâm thể thao thật, nhưng đó không hẳn là lý do bọn em chọn." },
        { who: "Dr Carter", voice: "uk-nam", text: "Good. And how did you find your interviewees?", vi: "Tốt. Các em tìm người phỏng vấn bằng cách nào?" },
        { who: "Ben", voice: "us-nam", text: "We tried putting a message on the town's social media page, but only two people replied, and they were both quite young. The librarian offered to put up a poster, but in the end we didn't need it, because Holly's aunt volunteers at the day centre for older people on Hill Street. We went there on two Tuesday mornings and talked to everyone who was willing.", vi: "Bọn em thử đăng tin trên trang mạng xã hội của thị trấn, nhưng chỉ có hai người trả lời, mà cả hai đều khá trẻ. Cô thủ thư đề nghị dán áp phích, nhưng cuối cùng không cần, vì dì của Holly làm tình nguyện ở trung tâm ban ngày cho người cao tuổi trên phố Hill. Bọn em đến đó hai sáng thứ Ba và nói chuyện với tất cả những ai sẵn lòng." },
        { who: "Dr Carter", voice: "uk-nam", text: "Did the interviews go smoothly?", vi: "Các buổi phỏng vấn có suôn sẻ không?" },
        { who: "Holly", voice: "uk-nu", text: "Mostly. We were worried about the sound quality, but the recorder you lent us was excellent. And nobody cancelled. The real difficulty was time. Some of them were so happy to have someone listening that a ten-minute interview became forty minutes, and we couldn't really stop them.", vi: "Phần lớn là suôn sẻ. Bọn em lo về chất lượng âm thanh, nhưng máy ghi âm thầy cho mượn rất tốt. Và không ai huỷ cả. Khó khăn thật sự là thời gian. Có người vui vì có ai đó lắng nghe đến mức buổi phỏng vấn mười phút thành bốn mươi phút, và bọn em không biết làm sao dừng họ lại." },
        { who: "Dr Carter", voice: "uk-nam", text: "That's a common problem, and a nice one to have. Now, you've got a lot of material about the past. You could add statistics from the council, but I'm not sure that would tell you much. What would really make the project stronger is a comparison. Why don't you talk to a few teenagers in the town and ask them the same questions?", vi: "Đó là vấn đề phổ biến, và là một vấn đề dễ chịu. Giờ các em có rất nhiều tư liệu về quá khứ. Các em có thể thêm số liệu của hội đồng thị trấn, nhưng tôi không chắc nó cho biết nhiều điều. Điều thật sự làm đồ án mạnh hơn là một phép so sánh. Sao các em không nói chuyện với vài thiếu niên trong thị trấn và hỏi họ đúng những câu đó?" },
        { who: "Ben", voice: "us-nam", text: "That's a great idea. Several people also offered us old photos, so we'll include a few of those anyway.", vi: "Ý hay quá ạ. Mấy người cũng đưa bọn em ảnh cũ, nên dù sao bọn em cũng sẽ đưa vài tấm vào." },
        { who: "Dr Carter", voice: "uk-nam", text: "And what, overall, was the biggest change you noticed?", vi: "Nhìn chung, thay đổi lớn nhất các em nhận thấy là gì?" },
        { who: "Holly", voice: "uk-nu", text: "I expected it to be money — that everything costs more now — but actually most of them said leisure was never free in the past either.", vi: "Em tưởng sẽ là tiền — rằng giờ thứ gì cũng đắt hơn — nhưng thật ra phần lớn họ nói ngày xưa giải trí cũng chẳng miễn phí." },
        { who: "Ben", voice: "us-nam", text: "Right. What almost all of them talked about was the street. People used to sit outside in the evenings and chat with the people next door. Now, everyone stays inside.", vi: "Đúng vậy. Điều gần như ai cũng nói là chuyện đường phố. Ngày xưa buổi tối người ta hay ngồi ngoài và tán gẫu với hàng xóm. Giờ ai cũng ở trong nhà." },
        { who: "Holly", voice: "uk-nu", text: "Yes, I agree — that was definitely the biggest change.", vi: "Vâng, em đồng ý — đó chắc chắn là thay đổi lớn nhất." },
        { who: "Dr Carter", voice: "uk-nam", text: "Let's go through the individual interviews quickly. Who did you start with?", vi: "Ta lướt qua từng cuộc phỏng vấn nhé. Các em bắt đầu với ai?" },
        { who: "Ben", voice: "us-nam", text: "Mr Patel. He's ninety-one. He talked a lot about the Regal cinema, but he said he could only afford to go a couple of times a year. What he really loved was the river. Every Sunday, his father would take him fishing, and they'd sit there all day without saying a word.", vi: "Ông Patel. Ông chín mươi mốt tuổi. Ông kể nhiều về rạp Regal, nhưng nói một năm chỉ đủ tiền đi vài lần. Thứ ông thật sự yêu là con sông. Chủ nhật nào bố ông cũng dẫn ông đi câu cá, và hai cha con ngồi đó cả ngày chẳng nói câu nào." },
        { who: "Holly", voice: "uk-nu", text: "Then Mrs Green. She worked in a factory from the age of fourteen, six days a week, and she said that from Monday to Friday she had no time for anything except work and sleep. Saturday night was different, though — that's when she went to the cinema with her sister. Every single week, she said.", vi: "Rồi bà Green. Bà làm ở nhà máy từ năm mười bốn tuổi, sáu ngày một tuần, và bà nói từ thứ Hai đến thứ Sáu bà chẳng có thời gian cho gì ngoài làm và ngủ. Nhưng tối thứ Bảy thì khác — đó là lúc bà đi xem phim với chị gái. Tuần nào cũng đi, bà nói thế." },
        { who: "Dr Carter", voice: "uk-nam", text: "So would you put her down for the cinema or for having no free time?", vi: "Vậy các em xếp bà vào chuyện rạp phim hay chuyện không có thời gian rảnh?" },
        { who: "Holly", voice: "uk-nu", text: "The cinema, I think. She spoke about it much more than the factory, and it's what she remembers most.", vi: "Rạp phim ạ. Bà nói về nó nhiều hơn hẳn nhà máy, và đó là điều bà nhớ nhất." },
        { who: "Ben", voice: "us-nam", text: "Then Mr Okafor. He grew up in a big family, and they didn't have a television until he was nearly twenty. So after dinner, the whole family would sit around the radio — music, comedy shows, football commentary — almost every night.", vi: "Rồi ông Okafor. Ông lớn lên trong một gia đình đông con, và nhà ông không có tivi cho tới khi ông gần hai mươi tuổi. Nên sau bữa tối, cả nhà ngồi quanh chiếc radio — nhạc, hài, tường thuật bóng đá — gần như tối nào cũng vậy." },
        { who: "Holly", voice: "uk-nu", text: "Mrs Lee was lovely. I expected her to talk about reading, because her father owned a newspaper shop, but she said she was never very interested in the papers. She and her friends used to go to the dance hall in Market Street every Friday — she met her husband there.", vi: "Bà Lee rất dễ mến. Em tưởng bà sẽ nói về đọc sách báo, vì bố bà có một cửa hàng báo, nhưng bà nói bà chưa bao giờ thích báo lắm. Bà và bạn bè hay đến vũ trường trên phố Market vào mỗi thứ Sáu — bà gặp chồng ở đó." },
        { who: "Ben", voice: "us-nam", text: "And finally Mr Brown. He said there were hardly any cars in his street when he was a boy, so the road was basically a football pitch. He and his friends would play there until it got dark, using their jackets as goalposts.", vi: "Và cuối cùng là ông Brown. Ông nói hồi ông còn bé, phố ông gần như không có ô tô, nên lòng đường về cơ bản là sân bóng. Ông và bạn bè chơi ở đó tới tối mịt, lấy áo khoác làm cột gôn." },
        { who: "Dr Carter", voice: "uk-nam", text: "Wonderful. These are exactly the kind of details that bring a project to life.", vi: "Tuyệt vời. Đó chính là những chi tiết làm đồ án trở nên sống động." },
      ],
    },
    {
      t: "mcq",
      id: "t2d21-p3-chon",
      title: "Questions 21–25",
      items: [
        { q: "(21) Why did the students choose this topic?", options: ["Their tutor suggested it.", "They read about a closure in the local news.", "One of them works at a leisure centre."], correct: 1, why: "“we saw a story in the **town newspaper** about the old Regal cinema **closing down**” = read about a closure in the local news. Bẫy A: tutor nhắc **transport**, không phải leisure. Bẫy C: Ben **có** làm ở sports centre “but that's **not really why** we picked it”." },
        { q: "(22) How did they find people to interview?", options: ["through the town library", "through a social media group", "at a centre for older people"], correct: 2, why: "Social media chỉ được **hai người trẻ** trả lời; librarian đề nghị “but in the end **we didn't need it**”; họ phỏng vấn ở “the **day centre for older people**”." },
        { q: "(23) What problem did they have with the interviews?", options: ["Some people talked for too long.", "Some recordings were of poor quality.", "Many people cancelled."], correct: 0, why: "“The real difficulty was **time**… a ten-minute interview became forty minutes”. Bẫy B: “We were **worried** about the sound quality, **but** the recorder… was excellent”; C: “**nobody cancelled**”." },
        { q: "(24) What does Dr Carter suggest they add?", options: ["figures from the town council", "interviews with teenagers", "old photographs"], correct: 1, why: "“Why don't you **talk to a few teenagers**… and ask them the same questions?” Bẫy A: “You **could** add statistics… **but I'm not sure** that would tell you much”; C: ảnh cũ là Ben tự nói, **không phải** gợi ý của Dr Carter." },
        { q: "(25) What do the students agree was the biggest change?", options: ["People spend less time with their neighbours.", "Leisure has become more expensive.", "People do more sport than before."], correct: 0, why: "“People used to sit outside… and **chat with the people next door**. Now, everyone stays inside.” — Holly: “**definitely the biggest change**”. Bẫy B: “I **expected** it to be money… **but actually**…”." },
      ],
    },
    {
      t: "quiz",
      id: "t2d21-p3-noi",
      title: "Questions 26–30 — viết chữ cái A–G",
      kind: "fill",
      items: [
        { q: "(26) Mr Patel", answers: ["G"], hint: "nghe tới việc ông thật sự yêu thích" },
        { q: "(27) Mrs Green", answers: ["E"], hint: "nghe tới chỗ Holly chốt lại" },
        { q: "(28) Mr Okafor", answers: ["B"], hint: "sau bữa tối, cả nhà…" },
        { q: "(29) Mrs Lee", answers: ["A"], hint: "mỗi thứ Sáu" },
        { q: "(30) Mr Brown", answers: ["D"], hint: "con đường" },
      ],
    },
    {
      t: "note",
      title: "Giải thích 26–30 (và hai phương án thừa C, F)",
      items: [
        "**(26) G** — Bẫy **E**: ông nhắc rạp Regal “but he said he could **only** afford to go **a couple of times a year**” → không phải mỗi thứ Bảy. “his **father** would take him **fishing**” = go fishing with a parent.",
        "**(27) E** — Bẫy **C**: “from Monday to Friday she had **no time** for anything except work” — nghe rất khớp C! Nhưng Dr Carter hỏi lại và Holly **chốt**: “**The cinema**, I think… it's what she remembers most” + “Saturday night… went to the cinema… **Every single week**”.",
        "**(28) B** — “the whole family would **sit around the radio**… **almost every night**” = spend most evenings listening to the radio. (Có “football commentary” — đừng nhảy sang D.)",
        "**(29) A** — Bẫy **F**: bố bà có cửa hàng báo, **nhưng** “she was **never very interested** in the papers”. “used to go to the **dance hall**… every Friday” = go dancing every week.",
        "**(30) D** — “the road was basically a **football pitch**… would play there until it got dark” = play football in the street.",
        "**C** và **F** là hai phương án thừa — **cả hai đều được nhắc tới** để gây nhiễu. Đây là kiểu bẫy chuẩn của Matching Part 3.",
      ],
    },

    /* ── 3 ── */
    { t: "h", text: "3. PART 4 — Questions 31–40: The bicycle and how it changed society" },
    {
      t: "canh",
      anh: ["bicycle", "woman-biking", "classical-building", "teacher"],
      caption: "Một bài giảng trong môn Lịch sử công nghệ: từ chiếc “máy chạy” bằng gỗ năm 1817 đến chiếc xe đạp an toàn — và vì sao xe đạp thay đổi cuộc sống của phụ nữ.",
    },
    {
      t: "table",
      caption: "Questions 31–40 — Complete the notes below. Write ONE WORD AND/OR A NUMBER for each answer.",
      head: ["Phần", "Ghi chú"],
      rows: [
        ["The first machine (1817)", "• invented in Germany; had no **(31) ______** — riders pushed the ground with their feet · • frame made of **(32) ______**"],
        ["The 1860s", "• nicknamed the 'boneshaker' because of its iron **(33) ______** and rough roads"],
        ["The penny-farthing (1870s)", "• very large front wheel gave more **(34) ______** · • main problem: frequent **(35) ______**"],
        ["The safety bicycle", "• introduced in **(36) ______** · • wheels of similar size; a **(37) ______** connected the pedals to the back wheel · • air-filled tyre: first made by a vet for his **(38) ______**"],
        ["Social effects", "• gave women a new kind of **(39) ______** · • led to changes in women's **(40) ______**"],
      ],
    },
    {
      t: "listen",
      id: "t2d21-nghe-p4",
      title: "The bicycle and how it changed society",
      dan: { so: "Day 21, Part 4", boiCanh: "part of a lecture on the history of technology.", cau: [31, 40] },
      note: "Khoảng 5 phút, giọng Mỹ, không nghỉ giữa.",
      lines: [
        { who: "Lecturer", voice: "us-nu", text: "Good afternoon. Today we're going to look at a machine that most of us take for granted: the bicycle. I'll describe how its design developed during the nineteenth century, and then I'll talk about the surprising effect it had on society, particularly on the lives of women.", vi: "Chào buổi chiều. Hôm nay ta sẽ tìm hiểu một cỗ máy mà hầu hết chúng ta coi là đương nhiên: chiếc xe đạp. Tôi sẽ mô tả thiết kế của nó phát triển thế nào trong thế kỷ mười chín, rồi nói về ảnh hưởng đáng ngạc nhiên của nó đối với xã hội, đặc biệt là với cuộc sống của phụ nữ." },
        { who: "Lecturer", voice: "us-nu", text: "The story begins in Germany in 1817, when an inventor called Karl Drais built what he called a 'running machine'. It had two wheels and a seat, and you could steer it, but there were no pedals at all. Riders sat on it and pushed the ground with their feet, a bit like the balance bikes that small children use today. The whole frame was made of wood, so it was heavy, but on a good road it was faster than walking.", vi: "Câu chuyện bắt đầu ở Đức năm 1817, khi nhà phát minh Karl Drais chế tạo thứ ông gọi là “máy chạy”. Nó có hai bánh và một yên, lái được, nhưng hoàn toàn không có bàn đạp. Người đi ngồi lên và đẩy đất bằng chân, hơi giống xe thăng bằng mà trẻ nhỏ dùng ngày nay. Toàn bộ khung làm bằng gỗ nên nặng, nhưng trên đường tốt thì nó nhanh hơn đi bộ." },
        { who: "Lecturer", voice: "us-nu", text: "In the 1860s, French makers finally attached pedals to the front wheel. These machines became very fashionable, but riding them was not comfortable. The wheels had iron tyres, and the roads of the time were rough, so every stone shook the rider's whole body. That's why the English gave them the nickname 'boneshakers'.", vi: "Vào những năm 1860, các nhà chế tạo Pháp cuối cùng đã gắn bàn đạp vào bánh trước. Những chiếc xe này trở thành mốt, nhưng đi không hề êm. Bánh xe có vành lốp bằng sắt, mà đường thời đó lại gồ ghề, nên mỗi hòn đá làm người đi rung cả người. Vì thế người Anh đặt cho chúng biệt danh “máy rung xương”." },
        { who: "Lecturer", voice: "us-nu", text: "The next step was the penny-farthing, which appeared in the 1870s. Because the pedals were fixed directly to the front wheel, a bigger wheel meant that each turn of the pedals carried you further. So makers built front wheels up to one and a half metres high, and this gave the rider much more speed. Unfortunately, it also made the machine very dangerous. The rider sat high above the ground, and if the front wheel hit something, he was thrown forward over the handlebars. Accidents were frequent, and some of them were serious.", vi: "Bước tiếp theo là xe penny-farthing, xuất hiện vào những năm 1870. Vì bàn đạp gắn thẳng vào bánh trước, bánh càng to thì mỗi vòng đạp đưa bạn đi càng xa. Nên người ta làm bánh trước cao tới một mét rưỡi, và điều này cho người đi tốc độ cao hơn nhiều. Đáng tiếc là nó cũng làm chiếc xe rất nguy hiểm. Người đi ngồi cao so với mặt đất, và nếu bánh trước va vào thứ gì, người đó bị hất văng qua tay lái. Tai nạn xảy ra thường xuyên, và có những vụ nghiêm trọng." },
        { who: "Lecturer", voice: "us-nu", text: "The answer was the so-called safety bicycle, which was introduced in 1885. Its two wheels were almost the same size, and the rider sat much lower. The key invention was the chain, which connected the pedals to the back wheel, so the front wheel no longer needed to be enormous. A few years later, in 1888, a Scottish vet called John Dunlop produced the first practical air-filled tyre. Interestingly, he didn't make it for an adult rider. He made it for his son, who complained that his tricycle was too uncomfortable on the stones of the street. With a chain and air-filled tyres, the bicycle looked almost exactly like the ones we ride today.", vi: "Lời giải là chiếc gọi là xe đạp an toàn, ra đời năm 1885. Hai bánh bằng nhau, và người đi ngồi thấp hơn nhiều. Phát minh then chốt là dây xích, nối bàn đạp với bánh sau, nên bánh trước không cần khổng lồ nữa. Vài năm sau, năm 1888, một bác sĩ thú y người Scotland tên John Dunlop làm ra chiếc lốp bơm hơi thực dụng đầu tiên. Thú vị là ông không làm nó cho người lớn. Ông làm cho con trai mình, cậu bé phàn nàn chiếc xe ba bánh quá xóc trên đá lát đường. Có xích và lốp bơm hơi, chiếc xe đạp trông gần như y hệt chiếc ta đi ngày nay." },
        { who: "Lecturer", voice: "us-nu", text: "Now, let's turn to the social effects, and here the most striking change was for women. Before the bicycle, a middle-class woman usually could not travel far without a man or a horse and carriage. A bicycle was cheap, it needed no one to look after it, and it allowed her to go wherever she wanted. One famous American campaigner said in 1896 that the bicycle had done more to free women than anything else in the world. Above all, it gave women a new kind of independence.", vi: "Giờ ta chuyển sang tác động xã hội, và ở đây thay đổi nổi bật nhất là với phụ nữ. Trước khi có xe đạp, một phụ nữ trung lưu thường không thể đi xa nếu không có đàn ông hoặc xe ngựa. Xe đạp thì rẻ, không cần ai chăm sóc, và cho phép cô đi bất cứ đâu cô muốn. Một nhà vận động nổi tiếng người Mỹ đã nói năm 1896 rằng xe đạp đã làm cho sự tự do của phụ nữ nhiều hơn bất cứ thứ gì khác trên đời. Trên hết, nó cho phụ nữ một kiểu độc lập mới." },
        { who: "Lecturer", voice: "us-nu", text: "It also changed what they wore. You simply cannot ride a bicycle in a long, heavy skirt and a tight corset, so women's clothing gradually became lighter and more practical, and some women even began to wear loose trousers for cycling. Next week, we'll see how the bicycle also helped to create the first car factories.", vi: "Nó còn thay đổi cả trang phục. Bạn đơn giản là không thể đạp xe trong chiếc váy dài, nặng và áo nịt bó chặt, nên quần áo của phụ nữ dần nhẹ và tiện hơn, và một số phụ nữ thậm chí bắt đầu mặc quần rộng để đạp xe. Tuần sau, ta sẽ xem xe đạp cũng góp phần tạo ra những nhà máy ô tô đầu tiên thế nào." },
      ],
    },
    {
      t: "quiz",
      id: "t2d21-p4-dien",
      title: "Questions 31–40 — ONE WORD AND/OR A NUMBER",
      kind: "fill",
      items: [
        { q: "(31) had no ___ — riders pushed the ground with their feet", answers: ["pedals"], hint: "danh từ số nhiều (no + N)" },
        { q: "(32) frame made of ___", answers: ["wood"], hint: "chất liệu" },
        { q: "(33) nicknamed the 'boneshaker' because of its iron ___", answers: ["tyres", "tires"], hint: "danh từ số nhiều — bộ phận bánh xe" },
        { q: "(34) very large front wheel gave more ___", answers: ["speed"], hint: "more + danh từ không đếm được" },
        { q: "(35) main problem: frequent ___", answers: ["accidents"], hint: "frequent + danh từ số nhiều" },
        { q: "(36) introduced in ___", answers: ["1885"], hint: "năm" },
        { q: "(37) a ___ connected the pedals to the back wheel", answers: ["chain"], hint: "a + danh từ" },
        { q: "(38) air-filled tyre: first made by a vet for his ___", answers: ["son"], hint: "his + người" },
        { q: "(39) gave women a new kind of ___", answers: ["independence"], hint: "a kind of + danh từ không đếm được" },
        { q: "(40) led to changes in women's ___", answers: ["clothing"], hint: "women's + danh từ" },
      ],
    },
    {
      t: "note",
      title: "Giải thích 31–40",
      items: [
        "**(31) pedals** — “there were **no pedals** at all”. Số nhiều theo bài. **(32) wood** — “The whole frame was made of **wood**” (không viết ~~wooden~~ vì sau **made of** cần danh từ).",
        "**(33) tyres** (Mỹ: tires) — “The wheels had **iron tyres**, and the roads… were rough” — phiếu viết lại thành “because of its iron ___ and rough roads”.",
        "**(34) speed** — “this gave the rider **much more speed**”. Bẫy: “further” (xa hơn) nghe trước, nhưng phiếu cần **danh từ** sau more.",
        "**(35) accidents** — “**Accidents were frequent**” → phiếu đổi thành tính từ đứng trước: frequent **accidents** (paraphrase đổi cấu trúc).",
        "**(36) 1885** — Bẫy **1888** (năm có lốp bơm hơi). Phiếu hỏi năm ra đời **safety bicycle**.",
        "**(37) chain** — “The key invention was **the chain**, which connected the pedals to the back wheel”.",
        "**(38) son** — Bẫy “adult rider”: “he **didn't** make it for an adult rider. He made it for **his son**”. vet = bác sĩ thú y.",
        "**(39) independence** — “Above all, it gave women **a new kind of independence**.” Bẫy: “to **free** women” nghe trước — free là động từ, không hợp chỗ trống.",
        "**(40) clothing** — “**women's clothing** gradually became lighter and more practical”. Viết đúng từ bạn NGHE (clothing), đừng đổi sang từ đồng nghĩa (clothes, dress) — đáp án Listening lấy nguyên văn từ băng. Bẫy: **trousers** — chỉ là một ví dụ của sự thay đổi.",
      ],
    },

    /* ── 4 ── */
    { t: "h", text: "4. Tự chấm, ước band và ghi sổ lỗi" },
    {
      t: "table",
      caption: "Điểm Part 3 + Part 4 (/20) → bạn đang ở đâu (ước tính — nửa khó của bài thi)",
      head: ["Điểm /20", "Mức ước tính", "Việc nên làm"],
      rows: [
        ["0–4", "Dưới band 5 ở phần khó", "Ôn Tập 2 Ngày 13 (Part 3) và Ngày 19 (Part 4); luyện lại bài này sau 3 ngày."],
        ["5–8", "Đúng mức band 5", "Giữ nhịp; phân loại câu sai bên dưới để biết sửa gì trước."],
        ["9–12", "Band 5.5–6 ở phần khó", "Tập trung chính tả và giới hạn từ — những câu mất oan."],
        ["13–20", "Band 6.5+ ở phần khó", "Sẵn sàng cho đề 40 câu (Ngày 23)."],
      ],
    },
    {
      t: "table",
      caption: "Sổ lỗi — mỗi câu sai ghi vào MỘT loại (để ôn đúng chỗ)",
      head: ["Loại lỗi", "Dấu hiệu", "Câu hôm nay hay rơi vào"],
      rows: [
        ["Không nhận ra paraphrase", "Đáp án đúng nằm trong lời thoại nhưng bằng từ khác", "21 (closure ↔ closing down), 25 (neighbours ↔ people next door)"],
        ["Bẫy đổi ý / bẫy “but”", "Chọn cái được nhắc tới trước rồi bị gạt đi", "23, 24, 26, 27, 36, 38"],
        ["Chính tả", "Nghe đúng, viết sai", "33 (tyres), 39 (independence)"],
        ["Số ít / số nhiều", "Thiếu hoặc thừa -s", "31 (pedals), 35 (accidents)"],
        ["Mất tập trung / lạc chỗ", "Bỏ trống nhiều câu liên tiếp", "Luyện nghe trọn 5 phút không dừng"],
      ],
    },
    {
      t: "note",
      title: "Mẹo: câu sai không ghi lại = câu sẽ sai lần nữa",
      items: [
        "Câu sai trong **Online Test** tự vào **Sổ lỗi**; câu sai trong bài học này thì **tự chép** vào sổ: số câu · loại lỗi · câu đúng trong lời thoại.",
        "Sau khi chấm, **nghe lại có lời** một lần và gạch dưới **từ báo hiệu** đứng trước mỗi đáp án (but, actually, in the end, above all, the key…).",
      ],
    },
  ],
};

/* ─────────────────────────── Bài 3 · Nói ─────────────────────────── */

const T2D21_SPEAKING: Lesson = {
  id: "t2d21-noi",
  kind: "speaking",
  title: "Part 3: so sánh quá khứ – hiện tại",
  goal: "Trả lời câu hỏi Part 3 dạng “How has … changed?” bằng khung Ngày xưa → Bây giờ → Vì sao → Ví dụ → Đánh giá, dùng used to / would cho quá khứ và hiện tại đơn / HTHT cho hiện tại; đọc rõ đuôi -ed (FC · GRA · P band 5).",
  minutes: 60,
  blocks: [
    {
      t: "recap",
      title: "Bài này học gì — đẩy band nào",
      items: [
        "Part 3 (4–5 phút) hỏi **chung, xã hội**; một dạng rất hay gặp là **so sánh quá khứ – hiện tại**: How has … changed? Did people use to …? Is … more popular now than in the past?",
        "Khung 5 bước: **Then** (used to / would) → **Now** (hiện tại đơn / HTHT) → **Why** (lý do) → **Example** (gia đình, quê bạn) → **Evaluate** (tốt hay xấu?).",
        "Ngôn ngữ ăn điểm: **Back in my grandparents' day…** · **These days…** · **There has been a shift towards…** · **whereas** · **On the whole, I'd say it's a positive change**.",
        "🔊 **-ed ba cách đọc**: /t/ (worked) · /d/ (played) · /ɪd/ (wanted) — câu quá khứ nói mất đuôi là lỗi ngữ pháp trong tai giám khảo.",
        "Band 5 Part 3: trả lời **3–5 câu**, có lý do + ví dụ; band 6: thêm **đối lập** (whereas) và **đánh giá**.",
      ],
    },

    /* ── 1 ── */
    { t: "h", text: "1. Các kiểu câu hỏi “xưa – nay” của Part 3" },
    {
      t: "table",
      caption: "Nhận dạng câu hỏi → chọn thì cho đúng",
      head: ["Câu hỏi giám khảo", "Đang hỏi gì", "Thì chính trong câu trả lời"],
      rows: [
        ["How has family life **changed** in recent years?", "thay đổi đến nay", "HTHT (has become…) + used to"],
        ["Did people **use to** spend more time outdoors?", "quá khứ có / không", "used to / would + bây giờ hiện tại đơn"],
        ["Is shopping **more popular now than** in the past?", "so sánh", "so sánh hơn + used to"],
        ["What did children do in their free time **when your parents were young**?", "chỉ quá khứ", "used to / would / quá khứ đơn"],
        ["**Why** do you think people read fewer books **nowadays**?", "lý do của thay đổi", "hiện tại đơn + because / This is mainly because…"],
      ],
    },

    /* ── 2 ── */
    { t: "h", text: "2. Khung trả lời 5 bước" },
    {
      t: "sodo",
      kind: "flow",
      title: "Then → Now → Why → Example → Evaluate",
      caption: "Không cần đủ cả 5 bước ở mọi câu. Band 5 cần ít nhất Then + Now + Why; thêm Example hoặc Evaluate là lên band 6.",
      steps: [
        { label: "1 · Then (ngày xưa)", sub: "A few decades ago, people **used to** … / they **would** …" },
        { label: "2 · Now (bây giờ)", sub: "These days, most people **…** / It **has become** much more common to …" },
        { label: "3 · Why (vì sao đổi)", sub: "This is mainly because of … / The main reason is that …" },
        { label: "4 · Example (ví dụ thật)", sub: "My grandparents, for instance, **used to** … whereas my parents …" },
        { label: "5 · Evaluate (đánh giá)", sub: "On the whole, I'd say it's a positive / negative change, because …" },
      ],
    },
    {
      t: "table",
      caption: "Ngân hàng câu cho từng bước",
      head: ["Bước", "Câu mẫu"],
      rows: [
        ["Then", "**Back in my grandparents' day**, … · **When my parents were growing up**, … · **In the past**, people **used to** …"],
        ["Now", "**These days / Nowadays**, … · … **has become** far more popular · **There has been a big shift towards** + N / V-ing"],
        ["Đối lập", "…, **whereas** now … · **Compared with** twenty years ago, … · … **while** young people today …"],
        ["Why", "**This is mainly because** … · **One reason is that** … · **Thanks to** + N, …"],
        ["Example", "**Take my own family, for example.** · **In my hometown, for instance,** …"],
        ["Evaluate", "**On the whole, I think it's a good thing, because** … · **The downside is that** …"],
      ],
    },
    {
      t: "rule",
      formula: "In the past, people used to + V …, whereas these days they + V(s) / have + V3 … This is mainly because … For example, … On the whole, I'd say …",
      vi: "Khung trả lời Part 3 xưa – nay: đối lập hai thời + lý do + ví dụ + đánh giá.",
    },

    /* ── 3 ── */
    { t: "h", text: "3. Bài nói mẫu — bốn câu Part 3" },
    {
      t: "canh",
      anh: ["old-woman", "radio", "mobile-phone", "houses"],
      caption: "Part 3 tiếp theo đề Part 2 về một hoạt động giải trí: giám khảo hỏi về giải trí, gia đình và liên lạc — ngày xưa và bây giờ.",
    },
    {
      t: "dialogue",
      title: "Part 3 — Leisure and family life, then and now",
      lines: [
        { who: "Examiner", role: "examiner", text: "How have the ways people spend their free time changed in your country?" },
        { who: "Candidate", role: "candidate", text: "I'd say they've changed a lot. Back in my grandparents' day, people used to spend their evenings outside, chatting with neighbours or playing chess on the pavement. These days, most people stay indoors and look at their phones. This is mainly because almost everyone has a smartphone now, and cities have become much more crowded and noisy. In my own street, for example, nobody sits outside any more, whereas my grandmother says her whole neighbourhood would meet every evening.", vi: "Tôi nghĩ đã thay đổi nhiều. Thời ông bà tôi, người ta hay dành buổi tối ở ngoài, tán gẫu với hàng xóm hoặc chơi cờ trên vỉa hè. Bây giờ phần lớn người ta ở trong nhà và xem điện thoại. Chủ yếu là vì giờ gần như ai cũng có điện thoại thông minh, và thành phố đông đúc, ồn ào hơn nhiều. Ví dụ trên phố tôi, chẳng còn ai ngồi ngoài nữa, trong khi bà tôi kể cả xóm của bà tối nào cũng tụ tập." },
        { who: "Examiner", role: "examiner", text: "Did children use to have more freedom than they do now?" },
        { who: "Candidate", role: "candidate", text: "Yes, I think they did. When my parents were growing up, children would play outside all afternoon without any adults watching them. Nowadays, parents are much more worried about traffic and safety, so they usually keep their children at home or send them to extra classes. On the whole, I think that's a bit sad, because children learn a lot by playing freely with friends.", vi: "Có, tôi nghĩ vậy. Hồi bố mẹ tôi còn nhỏ, trẻ con chơi ngoài trời cả buổi chiều mà không có người lớn trông. Bây giờ phụ huynh lo nhiều hơn về xe cộ và an toàn, nên họ thường giữ con ở nhà hoặc cho đi học thêm. Nhìn chung tôi thấy hơi buồn, vì trẻ học được rất nhiều qua việc chơi tự do với bạn bè." },
        { who: "Examiner", role: "examiner", text: "How has the way families communicate changed?" },
        { who: "Candidate", role: "candidate", text: "Well, it has become much easier to stay in touch. My grandfather used to write letters to his brother in the south, and each letter took about two weeks to arrive. Now my family has a group chat, and we send photos to each other every day. The downside is that people sometimes message each other even when they're sitting in the same room, so I'm not sure we really talk more than before.", vi: "Dạ, giữ liên lạc đã dễ hơn nhiều. Ông tôi ngày xưa hay viết thư cho em trai ở miền Nam, mỗi lá thư mất khoảng hai tuần mới tới. Giờ nhà tôi có một nhóm chat và gửi ảnh cho nhau mỗi ngày. Mặt trái là đôi khi người ta nhắn tin cho nhau ngay cả khi ngồi cùng phòng, nên tôi không chắc là mình thật sự nói chuyện nhiều hơn trước." },
        { who: "Examiner", role: "examiner", text: "Do you think these changes are mostly positive or negative?" },
        { who: "Candidate", role: "candidate", text: "I'd say it's a mix. Technology has made our lives more convenient, and we can learn and work from anywhere. However, I think we've lost some of the close contact that people used to have with their neighbours. So, on the whole, I'd call it a positive change, but only if we make an effort to spend real time with each other.", vi: "Tôi nghĩ là pha trộn. Công nghệ làm cuộc sống tiện hơn, và ta có thể học, làm việc ở bất cứ đâu. Tuy vậy, tôi nghĩ ta đã mất một phần sự gắn bó mà người ta từng có với hàng xóm. Nên nhìn chung, tôi cho là thay đổi tích cực, nhưng chỉ khi ta cố gắng dành thời gian thật cho nhau." },
      ],
    },
    {
      t: "table",
      caption: "Vì sao các câu trả lời mẫu đạt band 5.5–6",
      head: ["Tiêu chí", "Bằng chứng trong bài"],
      rows: [
        ["**Fluency & Coherence**", "Mỗi câu 4–5 câu, đi đúng khung Then → Now → Why → Example → Evaluate; từ nối chức năng: **This is mainly because · for example · whereas · On the whole · The downside is that · However**."],
        ["**Lexical Resource**", "Cụm tự nhiên: chatting with neighbours, on the pavement, stay indoors, extra classes, stay in touch, group chat, close contact, make an effort."],
        ["**Grammatical Range & Accuracy**", "**used to / would** (quá khứ) ↔ **hiện tại đơn** + **HTHT** (have changed, has become, we've lost); **When my parents were growing up** (quá khứ tiếp diễn); câu phức với **because / so / whereas / even when / only if**."],
        ["**Pronunciation**", "Đuôi -ed và /s/ cuối: changed /d/, used to /juːst/, worried /d/, cities /z/, sitting… — xem mục 5."],
      ],
    },

    /* ── 4 ── */
    { t: "h", text: "4. Lỗi hay gặp khi so sánh xưa – nay" },
    {
      t: "note",
      title: "Cẩn thận: sáu lỗi kéo Part 3 xuống band 4",
      items: [
        "~~In the past, people use to …~~ → **used to** (quá khứ). Và **hiện tại** thì không có used to: ~~Nowadays people used to use phones~~ → Nowadays people **use** phones.",
        "~~Nowadays people are used to play games~~ → muốn nói thói quen hiện tại: people **often play** games. (be used to + V-ing nghĩa là “quen với”.)",
        "**Lặp “In the past… In the past…”** — đổi: Back then · A few decades ago · When my parents were young.",
        "**Chỉ nói một vế** (chỉ kể ngày xưa hoặc chỉ nói bây giờ) — câu hỏi “changed” cần **cả hai** và **sự đối lập**.",
        "**Trả lời 1 câu**: “Yes, it changed a lot.” → giám khảo phải hỏi thêm, FC bị hạ. Luôn đi tới bước **Why**.",
        "**Quên HTHT** khi nói kết quả đến nay: ~~It became more popular~~ (nếu vẫn đang phổ biến) → It **has become** more popular.",
      ],
    },
    {
      t: "mcq",
      id: "t2d21-noi-chon",
      title: "Chọn câu trả lời Part 3 tốt hơn (5 câu)",
      items: [
        { q: "“How has shopping changed in your country?” — mở đầu tốt nhất:", options: ["Shopping is good.", "In the past people use to go to markets.", "A few decades ago, people used to buy almost everything at local markets, whereas these days many of us shop online.", "I don't know about shopping."], correct: 2, why: "Có **Then (used to) + Now (these days) + đối lập (whereas)** ngay câu đầu. Câu B sai **use to**." },
        { q: "Câu nào dùng would ĐÚNG?", options: ["My grandfather would be a teacher.", "My grandfather would cycle to work every morning.", "My grandfather would have a big house.", "My grandfather would know everyone."], correct: 1, why: "would chỉ dùng cho **hành động lặp lại** (cycle every morning). be a teacher / have a house / know là **trạng thái** → used to." },
        { q: "Câu nào nói đúng một thay đổi kéo dài tới nay?", options: ["Online learning became much more common.", "Online learning used to become more common.", "Online learning is becoming common in the past.", "Online learning has become much more common."], correct: 3, why: "Thay đổi **đến bây giờ** vẫn còn → **has become** (HTHT)." },
        { q: "Bước “Why” tốt nhất cho: “Young people read fewer books than before.”", options: ["This is mainly because they spend so much time on short videos and social media.", "Books are books.", "In the past they used to read.", "Yes, fewer."], correct: 0, why: "Có **This is mainly because** + lý do cụ thể. Các câu khác không phải lý do." },
        { q: "Câu kết đánh giá (Evaluate) tự nhiên nhất:", options: ["Finish.", "That is my answer.", "On the whole, I'd say it's a positive change, although we've lost something too.", "So it changed."], correct: 2, why: "**On the whole, I'd say…** + nhượng bộ **although** = đánh giá có mức độ — đặc trưng band 6." },
      ],
    },

    /* ── 5 ── */
    { t: "h", text: "5. Thêm: đuôi -ed — ba cách đọc" },
    {
      t: "table",
      caption: "Quy tắc theo ÂM CUỐI của động từ gốc (không theo chữ cái)",
      head: ["Âm cuối động từ gốc", "-ed đọc là", "Ví dụ"],
      rows: [
        ["/t/ hoặc /d/", "**/ɪd/** (thêm một âm tiết)", "wanted, needed, decided, visited, started, ended"],
        ["Âm **vô thanh**: /p k f s ʃ tʃ θ/", "**/t/**", "stopped, worked, laughed, missed, washed, watched"],
        ["Âm **hữu thanh** còn lại + mọi nguyên âm", "**/d/**", "changed, played, lived, moved, used (= đã dùng), stayed"],
      ],
    },
    {
      t: "note",
      title: "Cẩn thận: used to và hai chữ “used”",
      items: [
        "**used to** (từng) đọc **/ˈjuːst tə/** — âm /s/ + /t/, dính liền.",
        "**used** (đã dùng, quá khứ của use) đọc **/juːzd/**: I **used** a dictionary. → /z/ + /d/.",
        "**changed** /tʃeɪndʒd/ một âm tiết — không đọc ~~chên-giơ-đờ~~. **watched** /wɒtʃt/, **laughed** /lɑːft/: chữ viết không cho biết âm — nghe và nhớ.",
      ],
    },
    {
      t: "phatam",
      id: "t2d21-phat-am",
      title: "Luyện phát âm — -ed: /t/ · /d/ · /ɪd/ trong câu so sánh xưa – nay",
      note: "Bấm “Nghe mẫu”, rồi “Đọc & chấm”. Ba dòng đầu theo từng nhóm; các dòng sau là câu Part 3 thật — giữ âm cuối nghe rõ, đừng nuốt.",
      items: [
        { text: "worked, stopped, watched", ipa: "wɜːkt stɒpt wɒtʃt", vi: "-ed = /t/" },
        { text: "changed, lived, stayed", ipa: "tʃeɪndʒd lɪvd steɪd", vi: "-ed = /d/" },
        { text: "wanted, needed, visited", ipa: "wɒntɪd niːdɪd vɪzɪtɪd", vi: "-ed = /ɪd/" },
        { text: "Life has changed a lot.", ipa: "laɪf həz tʃeɪndʒd ə lɒt", vi: "changed /d/ nối vào a" },
        { text: "My grandfather used to walk to work.", ipa: "maɪ ɡrænfɑːðə juːst tə wɔːk tə wɜːk", vi: "used to /juːst tə/" },
        { text: "We played outside until it got dark.", ipa: "wi pleɪd aʊtsaɪd əntɪl ɪt ɡɒt dɑːk", vi: "played /d/" },
        { text: "People visited their neighbours every evening.", ipa: "piːpl vɪzɪtɪd ðeə neɪbəz evri iːvnɪŋ", vi: "visited /ɪd/" },
        { text: "She laughed and watched the old photos.", ipa: "ʃi lɑːft ən wɒtʃt ði əʊld fəʊtəʊz", vi: "laughed /t/ · watched /t/" },
      ],
    },

    /* ── 6 ── */
    { t: "h", text: "6. Luyện nói" },
    {
      t: "p",
      text: "Ghi âm từng câu. Mỗi câu **ít nhất 4 câu nói**: Then → Now → Why → Example (hoặc Evaluate). Nghe lại và tự đánh dấu: có **used to** cho quá khứ không? Có **thì hiện tại** cho bây giờ không? Có **because / whereas** không? Đuôi **-ed** có nghe rõ không?",
    },
    {
      t: "speak",
      id: "t2d21-noi-p3",
      part: "3",
      questions: [
        "How have the ways people spend their free time changed in your country?",
        "Did children use to have more freedom than they do now?",
        "How has the way families communicate changed in recent years?",
        "Is shopping more enjoyable now than it was in the past?",
        "Why do you think fewer people read newspapers these days?",
        "Do you think these changes are mostly positive or negative?",
      ],
    },
  ],
};

/* ─────────────────────────── Bài tập ─────────────────────────── */

const T2D21_HOMEWORK: Lesson = {
  id: "t2d21-bai-tap",
  kind: "homework",
  title: "Bài tập Ngày 21",
  goal: "Ôn trọn Ngày 21: used to / would / be used to, quá khứ tiếp diễn với when / while, khung so sánh xưa – nay, và phân biệt ba cách đọc -ed.",
  minutes: 45,
  blocks: [
    {
      t: "recap",
      title: "Bài tập hôm nay (40 câu)",
      items: [
        "**I. Dịch Việt → Anh** (10 câu, có 💡).",
        "**II. Trắc nghiệm** (10 câu): chọn thì / cấu trúc.",
        "**III. Chia động từ trong ngoặc** (8 câu).",
        "**IV. Sửa lỗi — viết lại cả câu** (6 câu).",
        "**V. -ed đọc là gì?** (6 câu).",
      ],
    },
    {
      t: "sodo",
      kind: "mindmap",
      title: "Ôn nhanh Ngày 21",
      center: "**Ngày 21**",
      branches: [
        { label: "used to / would", items: ["used to + V: xưa có, nay không", "would: hành động lặp lại (không trạng thái)", "be used to + V-ing = quen với"], anh: "hourglass-done" },
        { label: "Quá khứ tiếp diễn", items: ["was / were + V-ing", "while + việc dài", "when + việc ngắn cắt ngang"], anh: "cloud-with-rain" },
        { label: "Part 3 xưa – nay", items: ["Then → Now → Why → Example → Evaluate", "whereas · has become · On the whole"], anh: "speech-balloon" },
        { label: "-ed", items: ["/ɪd/ sau t, d", "/t/ sau âm vô thanh", "/d/ còn lại"], anh: "speaker-high-volume" },
      ],
    },

    { t: "h", text: "I. Dịch sang tiếng Anh (10 câu)" },
    {
      t: "quiz",
      id: "t2d21-bt-dich",
      title: "I. Dịch sang tiếng Anh (10 câu)",
      kind: "translate",
      grammar: "used to + V · didn't use to · would + V (lặp lại) · be used to + V-ing · was/were + V-ing · when / while · HTHT cho thay đổi đến nay.",
      items: [
        { q: "Hồi nhỏ tôi hay đi học bằng xe đạp.", hint: "I used to go to school by bike / cycle to school, when I was a child / young", answers: ["I used to go to school by bike when I was a child.", "When I was a child, I used to go to school by bike.", "I used to cycle to school when I was a child.", "When I was a child, I used to cycle to school.", "I used to go to school by bicycle when I was a child.", "I used to ride my bike to school when I was a child.", "When I was young, I used to go to school by bike.", "I used to go to school by bike when I was young.", "When I was little, I used to cycle to school."] },
        { q: "Ở góc phố này từng có một hiệu sách.", hint: "There used to be, a bookshop, on this corner", answers: ["There used to be a bookshop on this corner.", "There used to be a bookstore on this corner.", "There used to be a bookshop on the corner of this street.", "There used to be a bookshop at this corner."] },
        { q: "Ngày xưa mẹ tôi không hay xem tivi.", hint: "My mother, didn't use to watch, TV / television", answers: ["My mother didn't use to watch TV.", "My mother didn't use to watch television.", "My mum didn't use to watch TV.", "My mom didn't use to watch TV.", "My mother never used to watch TV.", "My mother did not use to watch TV."] },
        { q: "Mỗi tối chủ nhật, cả nhà tôi thường ăn tối ở nhà ông bà.", hint: "Every Sunday evening, my family would have dinner, at my grandparents' house", answers: ["Every Sunday evening, my family would have dinner at my grandparents' house.", "Every Sunday evening my family would have dinner at my grandparents' house.", "Every Sunday evening, my family used to have dinner at my grandparents' house.", "Every Sunday evening, my family would eat dinner at my grandparents' house.", "Every Sunday evening, my family would have dinner at my grandparents'.", "Every Sunday evening, my whole family would have dinner at my grandparents' house."] },
        { q: "Tôi đã quen với việc sống một mình.", hint: "I am used to living alone / on my own", answers: ["I am used to living alone.", "I'm used to living alone.", "I am used to living on my own.", "I'm used to living on my own.", "I have got used to living alone.", "I've got used to living alone."] },
        { q: "Lúc 7 giờ sáng nay tôi đang chạy bộ trong công viên.", hint: "At 7 a.m. this morning, I was jogging / running, in the park", answers: ["At 7 a.m. this morning, I was jogging in the park.", "At 7 a.m. this morning I was jogging in the park.", "At 7 a.m. this morning, I was running in the park.", "I was jogging in the park at 7 a.m. this morning.", "At 7 am this morning, I was jogging in the park.", "At seven o'clock this morning, I was jogging in the park.", "At 7 o'clock this morning, I was jogging in the park."] },
        { q: "Cô ấy đang nấu ăn thì khách đến.", hint: "She was cooking, when, the guests arrived", answers: ["She was cooking when the guests arrived.", "She was cooking when the visitors arrived.", "She was cooking when her guests arrived.", "She was cooking when the guests came.", "She was cooking when the guests came over."] },
        { q: "Trong lúc tôi đang đợi xe buýt thì trời bắt đầu mưa.", hint: "While I was waiting for the bus, it started / began to rain", answers: ["While I was waiting for the bus, it started to rain.", "While I was waiting for the bus, it began to rain.", "While I was waiting for the bus, it started raining.", "While I was waiting for the bus, it began raining.", "It started to rain while I was waiting for the bus.", "It began to rain while I was waiting for the bus."] },
        { q: "Mua sắm trực tuyến đã trở nên phổ biến hơn nhiều.", hint: "Online shopping, has become, much more popular / common", answers: ["Online shopping has become much more popular.", "Online shopping has become much more common.", "Online shopping has become far more popular.", "Shopping online has become much more popular.", "Online shopping has become a lot more popular.", "Online shopping has become a lot more common.", "Online shopping has become far more common."] },
        { q: "Ngày xưa người ta hay viết thư, còn bây giờ họ nhắn tin.", hint: "In the past, people used to write letters, whereas now / these days they send messages", answers: ["In the past, people used to write letters, whereas now they send messages.", "In the past people used to write letters, whereas now they send messages.", "In the past, people used to write letters, whereas these days they send messages.", "In the past, people used to write letters, but now they send messages.", "In the past, people used to write letters, while now they send messages.", "In the past, people used to write letters, whereas nowadays they send messages.", "In the past, people used to write letters, whereas now they text."] },
      ],
    },

    { t: "h", text: "II. Trắc nghiệm (10 câu)" },
    {
      t: "mcq",
      id: "t2d21-bt-chon",
      title: "II. Chọn đáp án đúng (10 câu)",
      items: [
        { q: "My uncle ___ in a factory before he opened his own shop.", options: ["is used to work", "would working", "used to work", "was used to work"], correct: 2, why: "Việc làm ngày xưa, nay không còn → **used to work**." },
        { q: "We ___ a dog when I was small.", options: ["used to have", "would have", "were having", "are used to having"], correct: 0, why: "**have** (sở hữu) là trạng thái → **used to have**, không dùng would." },
        { q: "It's hard for her to drive on the left — she ___ driving on the right.", options: ["used to", "uses to", "would", "is used to"], correct: 3, why: "Nghĩa “**đã quen với**” + V-ing → **is used to** driving." },
        { q: "A: What ___ when the earthquake happened? — B: I was sleeping.", options: ["did you do", "were you doing", "do you do", "you were doing"], correct: 1, why: "Đang làm gì **lúc** động đất (việc ngắn) xảy ra → **were you doing**." },
        { q: "___ I was cleaning my room, I found an old photo.", options: ["Then", "While", "During", "Until"], correct: 1, why: "Trước việc **dài** (was cleaning) → **While** (When cũng dùng được, nhưng không có trong phương án). During + danh từ, không + mệnh đề." },
        { q: "The phone rang ___ I was in the shower.", options: ["during", "since", "for", "while"], correct: 3, why: "**while** + mệnh đề (I was in the shower)." },
        { q: "She ___ her leg when she was skiing.", options: ["broke", "used to break", "was breaking", "would break"], correct: 0, why: "Việc **ngắn, một lần** (gãy chân) → quá khứ đơn **broke**; skiing là việc dài nền." },
        { q: "Life in my village ___ a lot since I was a child.", options: ["changed", "used to change", "has changed", "was changing"], correct: 2, why: "**since** + thay đổi tới nay → **has changed** (HTHT)." },
        { q: "-ed của “decided” đọc là:", options: ["/t/", "/d/", "/ɪd/", "không đọc"], correct: 2, why: "decide tận cùng âm **/d/** → -ed đọc **/ɪd/**." },
        { q: "Part 3: câu nào đúng?", options: ["In the past, people used to live in bigger families.", "In the past, people would live in big families.", "Nowadays people used to shop online.", "In the past, people are used to living in big families."], correct: 0, why: "Trạng thái quá khứ → **used to live**. would không dùng cho trạng thái (live in big families); “Nowadays… used to” mâu thuẫn thời gian." },
      ],
    },

    { t: "h", text: "III. Chia động từ trong ngoặc (8 câu)" },
    {
      t: "quiz",
      id: "t2d21-bt-chia",
      title: "III. Chia động từ (quá khứ đơn / quá khứ tiếp diễn / used to) — 8 câu",
      kind: "fill",
      grammar: "Việc dài đang diễn ra → was/were + V-ing; việc ngắn → V2; thói quen xưa đã bỏ → used to + V.",
      items: [
        { q: "The train ___ (leave) a minute after I arrived at the station.", answers: ["left"], hint: "việc ngắn, một lần → quá khứ đơn" },
        { q: "They ___ (play) tennis when it started to rain.", answers: ["were playing"], hint: "việc dài bị cắt ngang" },
        { q: "I ___ (not / like) spicy food, but now I love it.", answers: ["didn't use to like", "did not use to like", "never used to like", "didn't like", "did not like"], hint: "trước không thích, giờ thích" },
        { q: "While she ___ (sleep), someone knocked on the door.", answers: ["was sleeping"], hint: "while + việc dài" },
        { q: "My grandparents ___ (live) in the countryside until 1990.", answers: ["lived", "used to live"], hint: "trạng thái quá khứ (until 1990 có mốc kết thúc)" },
        { q: "What ___ (you / do) at 8 p.m. yesterday?", answers: ["were you doing"], hint: "đang làm gì tại một thời điểm quá khứ — câu hỏi đảo" },
        { q: "I ___ (see) an accident while I was walking to school.", answers: ["saw"], hint: "việc ngắn" },
        { q: "___ (you / use to / wear) glasses when you were a child?", answers: ["Did you use to wear"], hint: "câu hỏi used to: Did + S + use to + V" },
      ],
    },

    { t: "h", text: "IV. Sửa lỗi — viết lại cả câu cho đúng (6 câu)" },
    {
      t: "quiz",
      id: "t2d21-bt-sua",
      title: "IV. Mỗi câu có MỘT lỗi — viết lại cả câu (6 câu)",
      kind: "fill",
      items: [
        { q: "I use to play the piano when I was young.", answers: ["I used to play the piano when I was young."], hint: "quá khứ → used" },
        { q: "My father would have a moustache when he was at university.", answers: ["My father used to have a moustache when he was at university.", "My father had a moustache when he was at university."], hint: "have = trạng thái" },
        { q: "She didn't used to eat meat.", answers: ["She didn't use to eat meat.", "She did not use to eat meat.", "She never used to eat meat."], hint: "sau didn't" },
        { q: "I am used to get up at 6 a.m.", answers: ["I am used to getting up at 6 a.m.", "I'm used to getting up at 6 a.m.", "I am used to getting up at 6 am.", "I'm used to getting up at 6 am."], hint: "be used to + V-ing" },
        { q: "While the bell rang, we were having lunch.", answers: ["When the bell rang, we were having lunch.", "We were having lunch when the bell rang.", "While we were having lunch, the bell rang.", "The bell rang while we were having lunch."], hint: "việc ngắn đi với when" },
        { q: "I was knowing all the answers in the test.", answers: ["I knew all the answers in the test.", "I knew all the answers on the test."], hint: "know không chia tiếp diễn" },
      ],
    },

    { t: "h", text: "V. -ed đọc là gì? (6 câu)" },
    {
      t: "mcq",
      id: "t2d21-bt-ed",
      title: "V. Chọn cách đọc đuôi -ed (6 câu)",
      items: [
        { q: "needed", options: ["/t/", "/d/", "/ɪd/"], correct: 2, why: "need tận cùng **/d/** → /ɪd/." },
        { q: "washed", options: ["/t/", "/d/", "/ɪd/"], correct: 0, why: "wash tận cùng **/ʃ/** (vô thanh) → /t/." },
        { q: "moved", options: ["/t/", "/d/", "/ɪd/"], correct: 1, why: "move tận cùng **/v/** (hữu thanh) → /d/." },
        { q: "visited", options: ["/t/", "/d/", "/ɪd/"], correct: 2, why: "visit tận cùng **/t/** → /ɪd/." },
        { q: "laughed", options: ["/t/", "/d/", "/ɪd/"], correct: 0, why: "laugh đọc **/lɑːf/** — tận cùng âm /f/ vô thanh (chữ gh) → /t/." },
        { q: "stayed", options: ["/t/", "/d/", "/ɪd/"], correct: 1, why: "stay tận cùng **nguyên âm đôi /eɪ/** → /d/." },
      ],
    },
  ],
};

export const NGAY_21: Lesson[] = [T2D21_GRAMMAR, T2D21_LISTENING, T2D21_SPEAKING, T2D21_HOMEWORK];
