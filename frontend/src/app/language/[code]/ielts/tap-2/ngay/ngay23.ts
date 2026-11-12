/**
 * IELTS Tập 2 — Ngày 23 (chặng 4) — tự soạn 12/11/2026, không chép sách / đề thật.
 *   Bài 1 (grammar)   — too / enough · so / such · quite / rather / fairly [G21] + ÔN TỔNG ngữ pháp Tập 2 (bảng 12 điểm
 *                       + nền Tập 1: câu đơn, hiện tại đơn, danh từ đếm được [G01 G02 G04])
 *   Bài 2 (listening) — Đề Listening đủ 40 câu (Part 1–4, luyện — lần đầu làm như thi) [L03 L04 L05 L06 L11 L12 L13]
 *   Bài 3 (speaking)  — Part 2 đề trừu tượng (a rule you dislike) + GIÁM KHẢO AI lần đầu 11 phút [S05 S17] · 🔊 nối âm [S14]
 *   Bài tập           — 36 câu.
 * Phòng nói giám khảo AI chưa có khối nhúng trong bài học ⇒ bài 3 dẫn link sang /language/en/ielts/thi-may/noi (PhongNoi).
 */
import type { Lesson } from '../data';

/* ─────────────────────────── Bài 1 · Ngữ pháp + Ôn tổng ─────────────────────────── */

const T2D23_GRAMMAR: Lesson = {
  id: "t2d23-ngu-phap",
  kind: "grammar",
  title: "too / enough / so / such + ôn tổng ngữ pháp Tập 2",
  goal: "Nói mức độ đúng bằng too / enough / so / such / quite / rather / fairly (không còn nói “too delicious”), rồi ôn lại cả 12 điểm ngữ pháp của Tập 2 và 3 điểm nền Tập 1 bằng một bảng và 30 câu kiểm tra — sẵn sàng cho Đề 3 (GRA band 5).",
  minutes: 90,
  blocks: [
    {
      t: "recap",
      title: "Bài này học gì — đẩy band nào",
      items: [
        "**too + adj + to V** = QUÁ … (nên KHÔNG thể): too hot **to** swim. Mang nghĩa **tiêu cực** — ~~The food is too delicious~~ là lỗi người Việt dịch từ “quá ngon”.",
        "**adj + enough + to V** = ĐỦ … để: old **enough** to drive · **enough + N**: enough money. Vị trí: tính từ **trước** enough, danh từ **sau** enough.",
        "**so + adj / adv** · **such (a / an) + adj + N** (+ that…): so hot that… / such a hot day that…",
        "**quite / rather / fairly / pretty**: “khá” — nói có mức độ, nghe tự nhiên hơn “very” ở mọi câu (cộng LR + GRA Speaking).",
        "**Ôn tổng Tập 2**: bảng 12 điểm (mạo từ → too/enough) + 3 điểm nền Tập 1, mỗi điểm một công thức, một lỗi hay sai, ngày cần ôn — làm **30 câu**, sai câu nào ôn đúng ngày đó trước Đề 3.",
      ],
    },

    /* ── 1 ── */
    { t: "h", text: "1. too — “quá … (đến mức không thể)”" },
    {
      t: "p",
      text: "**too** đứng trước tính từ / trạng từ, nghĩa là **nhiều hơn mức chấp nhận được** — luôn kéo theo một **hệ quả xấu** (không làm được, gây khó chịu). Tiếng Việt “quá” vừa dùng để chê (quá nóng) vừa dùng để khen (quá đẹp, quá ngon) — tiếng Anh **too chỉ dùng để chê**. Muốn khen thì dùng **so / really / extremely**.",
    },
    {
      t: "patterns",
      rows: [
        {
          formula: "S + be + too + adj (+ for sb) + to V",
          vi: "Quá … (đối với ai) nên không thể làm gì.",
          examples: [
            { en: "The water was too cold to swim in.", vi: "Nước lạnh quá nên không bơi được." },
            { en: "This book is too difficult for beginners to understand.", vi: "Cuốn sách này quá khó để người mới học hiểu được." },
          ],
        },
        {
          formula: "S + V + too + adv (+ to V)",
          vi: "Làm gì đó quá (nhanh / chậm…).",
          examples: [
            { en: "He speaks too quickly for me to follow.", vi: "Anh ấy nói nhanh quá, tôi không theo kịp." },
          ],
        },
        {
          formula: "too much + N (không đếm được) · too many + N (số nhiều)",
          vi: "Quá nhiều — chọn much / many theo danh từ (Tập 1 Ngày 5).",
          examples: [
            { en: "Teenagers spend too much time on their phones.", vi: "Thanh thiếu niên dành quá nhiều thời gian cho điện thoại." },
            { en: "There are too many cars in the city centre.", vi: "Có quá nhiều ô tô ở trung tâm thành phố." },
          ],
        },
      ],
    },
    {
      t: "note",
      title: "Cẩn thận: bốn lỗi với too",
      items: [
        "**Khen bằng too**: ~~The view is too beautiful!~~ (nghe như “đẹp quá mức chịu nổi”) → The view is **so** beautiful / **really** beautiful.",
        "**too + very**: ~~too very hot~~ → **far too** hot / **much too** hot (khi muốn nhấn mạnh hơn).",
        "**too + to V mà vẫn thêm it**: ~~The box is too heavy for me to carry it.~~ → … too heavy for me to carry. (chủ ngữ = tân ngữ của carry thì bỏ it).",
        "**too ≠ too (cũng)**: I like tea, **too** (cũng) — đứng cuối câu, không đi với tính từ. Đừng nhầm hai nghĩa.",
      ],
    },

    /* ── 2 ── */
    { t: "h", text: "2. enough — “đủ … để”" },
    {
      t: "sodo",
      kind: "compare",
      title: "enough đứng SAU tính từ nhưng TRƯỚC danh từ",
      caption: "Mẹo: enough “bám đuôi” tính từ / trạng từ, nhưng “dẫn đầu” danh từ.",
      cols: [
        { title: "**adj / adv + enough**", anh: "check-mark-button", items: ["old **enough** to vote", "fast **enough** to win", "not warm **enough** to swim (= too cold to swim)"] },
        { title: "**enough + N**", anh: "money-bag", items: ["**enough** money to buy a house", "**enough** time to finish", "not **enough** seats for everyone"] },
      ],
    },
    {
      t: "patterns",
      rows: [
        {
          formula: "S + be + (not) + adj + enough (+ for sb) + to V",
          vi: "(Không) đủ … để làm gì. “not … enough” là cách nói nhẹ nhàng thay cho too.",
          examples: [
            { en: "My brother isn't old enough to drive.", vi: "Em trai tôi chưa đủ tuổi lái xe." },
            { en: "The room is big enough for twenty people.", vi: "Căn phòng đủ rộng cho hai mươi người." },
          ],
        },
        {
          formula: "S + have / has + (not) + enough + N + to V",
          vi: "(Không) có đủ … để làm gì.",
          examples: [
            { en: "Many students don't have enough time to sleep properly.", vi: "Nhiều sinh viên không có đủ thời gian để ngủ đúng mức." },
          ],
        },
      ],
    },
    {
      t: "note",
      title: "Cẩn thận: vị trí của enough",
      items: [
        "~~enough old~~ → **old enough** · ~~enough quickly~~ → **quickly enough**.",
        "~~money enough~~ (kiểu cũ, văn chương) → **enough money**.",
        "Viết Task 2 lịch sự hơn: “The government does **not** do **enough** to …” mềm hơn “The government does too little …”.",
      ],
    },
    {
      t: "rule",
      formula: "too + adj / adv (+ for sb) + to V · too much / many + N · adj / adv + enough (+ for sb) + to V · enough + N + to V",
      vi: "too = quá mức (hệ quả xấu); enough = đủ mức — đứng sau tính từ, trước danh từ.",
    },
    {
      t: "quiz",
      id: "t2d23-too-enough-dich",
      title: "Dịch sang tiếng Anh — too / enough (5 câu)",
      kind: "translate",
      grammar: "too + adj + to V · adj + enough + to V · enough + N · too much / too many + N.",
      items: [
        { q: "Trời quá nóng để chạy bộ.", hint: "It is too hot, to go jogging / to run", answers: ["It is too hot to go jogging.", "It's too hot to go jogging.", "It is too hot to run.", "It's too hot to run.", "It is too hot to jog.", "It's too hot to jog.", "It was too hot to go jogging.", "It was too hot to run."] },
        { q: "Cô ấy chưa đủ tuổi để bầu cử.", hint: "She isn't old enough, to vote", answers: ["She isn't old enough to vote.", "She is not old enough to vote.", "She's not old enough to vote."] },
        { q: "Chúng tôi không có đủ tiền để mua nhà.", hint: "We don't have enough money, to buy a house", answers: ["We don't have enough money to buy a house.", "We do not have enough money to buy a house.", "We haven't got enough money to buy a house.", "We don't have enough money to buy a home."] },
        { q: "Có quá nhiều người trong phòng.", hint: "There are too many people, in the room", answers: ["There are too many people in the room.", "There were too many people in the room."] },
        { q: "Cái hộp này quá nặng, tôi không mang được.", hint: "This box is too heavy, for me to carry", answers: ["This box is too heavy for me to carry.", "This box is too heavy to carry.", "This box is too heavy for me to lift.", "This box is too heavy to lift."] },
      ],
    },

    /* ── 3 ── */
    { t: "h", text: "3. so / such — “… đến nỗi …”" },
    {
      t: "table",
      caption: "so đi với tính từ / trạng từ ĐỨNG MỘT MÌNH; such đi với CỤM DANH TỪ",
      head: ["Cấu trúc", "Ví dụ", "Ghi chú"],
      rows: [
        ["**so** + adj / adv", "The film was **so** boring (that) I fell asleep.", "không có danh từ sau tính từ"],
        ["**such a / an** + adj + N số ít", "It was **such a** boring film (that) I fell asleep.", "có a / an"],
        ["**such** + adj + N số nhiều / không đếm", "They are **such** friendly people. · It was **such** awful weather.", "không có a / an"],
        ["**so many / few** + N số nhiều", "There were **so many** people that we couldn't move.", "không dùng ~~such many~~"],
        ["**so much / little** + N không đếm", "I had **so much** homework that I stayed up all night.", ""],
        ["**such a lot of** + N", "There was **such a lot of** traffic that we were late. (= so much traffic)", "không dùng ~~so a lot of~~"],
      ],
    },
    {
      t: "patterns",
      rows: [
        {
          formula: "S + V + so + adj / adv + (that) + S + V",
          vi: "Quá … đến nỗi … (that có thể lược khi nói).",
          examples: [
            { en: "The exam was so hard that half the class failed.", vi: "Bài thi khó đến nỗi một nửa lớp trượt." },
          ],
        },
        {
          formula: "S + V + such (a / an) + adj + N + (that) + S + V",
          vi: "Thật là một … đến nỗi …",
          examples: [
            { en: "It was such a long journey that we were exhausted.", vi: "Chuyến đi dài đến nỗi chúng tôi kiệt sức." },
            { en: "She gave such good advice that I still remember it.", vi: "Cô ấy cho lời khuyên hay đến mức tôi vẫn còn nhớ." },
          ],
        },
      ],
    },
    {
      t: "note",
      title: "Cẩn thận: so hay such?",
      items: [
        "~~such beautiful~~ (không có danh từ) → **so** beautiful. ~~so a beautiful day~~ → **such a** beautiful day.",
        "~~such an interesting books~~ → **such interesting books** (số nhiều bỏ an).",
        "~~It was too hot that we stayed in.~~ / ~~It was very hot that we stayed in.~~ → It was **so** hot **that** we stayed in. (too đi với **to V**; very không kéo theo that.)",
        "**so** dùng một mình để **khen** cũng rất tự nhiên khi nói: The food here is **so** good! — đây chính là thứ người Việt muốn nói khi dịch “quá ngon”.",
      ],
    },
    {
      t: "rule",
      formula: "so + adj / adv (+ that …) · such (a / an) + adj + N (+ that …) · so many / much + N (+ that …)",
      vi: "so đi với tính từ đứng một mình; such đi với cụm danh từ. Cả hai có thể kéo theo that + kết quả.",
    },
    {
      t: "quiz",
      id: "t2d23-so-such-dich",
      title: "Dịch sang tiếng Anh — so / such (4 câu)",
      kind: "translate",
      grammar: "so + adj (+ that) · such a/an + adj + N (+ that) · so many / so much + N.",
      items: [
        { q: "Món phở ở đây ngon quá! (khen)", hint: "The pho here is so delicious / so good", answers: ["The pho here is so delicious!", "The pho here is so good!", "The pho here is really delicious!", "The pho here is really good!", "The pho here is so delicious.", "The pho here is so good."] },
        { q: "Đó là một ngày nóng đến nỗi chúng tôi ở trong nhà.", hint: "It was such a hot day, that we stayed indoors / at home", answers: ["It was such a hot day that we stayed indoors.", "It was such a hot day that we stayed inside.", "It was such a hot day that we stayed at home.", "It was such a hot day we stayed indoors.", "It was such a hot day that we stayed in."] },
        { q: "Bài giảng chán đến nỗi tôi ngủ gật.", hint: "The lecture was so boring, that I fell asleep", answers: ["The lecture was so boring that I fell asleep.", "The lecture was so boring I fell asleep.", "The lecture was so boring that I nodded off."] },
        { q: "Có nhiều người đến mức chúng tôi không tìm được chỗ ngồi.", hint: "There were so many people, that we couldn't find a seat", answers: ["There were so many people that we couldn't find a seat.", "There were so many people that we could not find a seat.", "There were so many people that we couldn't find seats.", "There were so many people we couldn't find a seat."] },
      ],
    },

    /* ── 4 ── */
    { t: "h", text: "4. quite / rather / fairly / pretty — nói “khá” cho có mức độ" },
    {
      t: "sodo",
      kind: "flow",
      title: "Thang mức độ — từ yếu đến mạnh",
      caption: "Người học band 4 chỉ dùng “very”. Band 5–6 chọn đúng nấc trên thang: câu trả lời nghe chân thật và chính xác hơn.",
      steps: [
        { label: "not … at all", sub: "It's **not** expensive **at all**." },
        { label: "a bit / a little", sub: "It's **a bit** noisy. (thường dùng cho ý tiêu cực)" },
        { label: "fairly", sub: "My English is **fairly** good. (khá — mức vừa phải, hơi khiêm tốn)" },
        { label: "quite", sub: "The test was **quite** easy. (khá — giọng Anh-Anh)" },
        { label: "rather / pretty", sub: "It's **rather** cold today. (khá, hơi bất ngờ / không mong muốn) · **pretty** good (thân mật)" },
        { label: "very / really", sub: "**very** tired · **really** interesting" },
        { label: "extremely / incredibly", sub: "**extremely** important (rất, cực kỳ)" },
      ],
    },
    {
      t: "note",
      title: "Cẩn thận: vị trí của quite với danh từ",
      items: [
        "**quite a / an + adj + N**: It was **quite a good** film. (quite đứng TRƯỚC a). ~~a quite good film~~ ít dùng.",
        "**fairly / very** đứng sau a: a **fairly** small town · a **very** big city. **rather** đứng được cả hai chỗ: **a rather** long film = **rather a** long film.",
        "**quite + tính từ tuyệt đối** (right, sure, impossible, different) = HOÀN TOÀN, không phải “khá”: You're **quite right**. · It's **quite impossible**.",
        "**rather** hay mang sắc thái “hơi … (không như ý)”: The hotel was **rather** expensive. Dùng với ý tích cực thì là “ngạc nhiên vì tốt”: The food was **rather** good!",
        "Speaking Part 1: “Is your hometown big?” → “It's **fairly** small, actually — only about fifty thousand people.” (tốt hơn hẳn “It's very small.” lặp đi lặp lại).",
      ],
    },
    {
      t: "rule",
      formula: "not … at all < a bit < fairly < quite < rather / pretty < very / really < extremely + adj · quite a / an + adj + N",
      vi: "Chọn đúng nấc mức độ thay vì luôn dùng very; quite đứng trước a/an.",
    },
    {
      t: "quiz",
      id: "t2d23-quite-dich",
      title: "Dịch sang tiếng Anh — quite / rather / fairly (3 câu)",
      kind: "translate",
      grammar: "quite / fairly / rather + adj · quite a / an + adj + N · quite + tính từ tuyệt đối = hoàn toàn.",
      items: [
        { q: "Bài kiểm tra khá dễ.", hint: "The test was quite / fairly easy", answers: ["The test was quite easy.", "The test was fairly easy.", "The test was pretty easy.", "The test was rather easy.", "The test is quite easy.", "The test is fairly easy.", "The exam was quite easy.", "The exam was fairly easy."] },
        { q: "Đó là một khách sạn khá đắt.", hint: "It was quite an expensive hotel / a rather expensive hotel", answers: ["It was quite an expensive hotel.", "It was a rather expensive hotel.", "It was rather an expensive hotel.", "It was a fairly expensive hotel.", "It was a pretty expensive hotel.", "It is quite an expensive hotel.", "It is a rather expensive hotel.", "It is a fairly expensive hotel.", "That was quite an expensive hotel.", "That is quite an expensive hotel."] },
        { q: "Bạn hoàn toàn đúng.", hint: "You are quite right", answers: ["You are quite right.", "You're quite right.", "You are absolutely right.", "You are completely right."] },
      ],
    },

    /* ── 5 ── */
    { t: "h", text: "5. Ôn tổng ngữ pháp Tập 2 — bảng 12 điểm (+ 3 điểm nền Tập 1)" },
    {
      t: "p",
      text: "Đề 3 (thi cuối Tập 2) chấm **GRA** ở Writing và Speaking, và cần ngữ pháp để **hiểu** bài Nghe – Đọc. Bảng dưới gom **mọi điểm ngữ pháp của Tập 2** theo thứ tự ngày học: một công thức, một lỗi hay sai nhất. Đọc lướt 10 phút, đánh dấu điểm nào bạn **chưa chắc**, rồi làm 30 câu ở mục 6 — mỗi câu ghi ngày cần ôn trong lời giải.",
    },
    {
      t: "table",
      caption: "Nền Tập 1 — ba điểm Tập 2 vẫn hay sai (Tập 1 Ngày 1 · Ngày 5)",
      head: ["Điểm", "Công thức", "Lỗi hay sai nhất"],
      rows: [
        ["Câu đơn S-V-O; to be (Tập 1 N1)", "S + V + O · S + am / is / are + C", "~~My hometown very beautiful.~~ → My hometown **is** very beautiful. (thiếu động từ)"],
        ["Hiện tại đơn (Tập 1 N1)", "he / she / it + V-s / es · does not + V", "~~She work in a bank.~~ → She work**s** … · ~~He doesn't works~~ → doesn't **work**"],
        ["Danh từ đếm được / không đếm (Tập 1 N5)", "a / an / many / few + N đếm · much / little + N không đếm", "~~many informations / advices~~ → **much information / advice** (không có -s)"],
      ],
    },
    {
      t: "table",
      caption: "12 điểm ngữ pháp Tập 2 — công thức 1 dòng + lỗi số 1",
      head: ["#", "Điểm (Ngày)", "Công thức chốt", "Lỗi số 1"],
      rows: [
        ["1", "Mạo từ a / an / the / Ø (N1)", "a / an: lần đầu, một cái bất kỳ · the: lần hai, duy nhất, xác định · Ø: số nhiều / không đếm nói chung", "~~The education is important.~~ → **Education** is important. (nói chung → Ø)"],
        ["2", "Giới từ thời gian, nơi chốn, chuyển động (N3)", "at + giờ · on + ngày · in + tháng / năm · into / through / across (chuyển động) · depend **on**", "~~in Monday~~ → **on** Monday · ~~discuss about~~ → discuss (không giới từ)"],
        ["3", "HTHT vs quá khứ đơn (N5)", "has / have + V3 (for / since / yet / ever) · V2 + thời điểm đã xong (yesterday, in 2019)", "~~I have visited Hue last year.~~ → I **visited** Hue last year."],
        ["4", "Tương lai (N7)", "will (quyết định lúc nói, dự đoán) · be going to (kế hoạch, dấu hiệu) · hiện tại tiếp diễn (đã hẹn)", "Việc đã hẹn mà dùng will: I'll meet my friend tonight — we booked a table. → tự nhiên hơn: I**'m meeting** …"],
        ["5", "So sánh (N9)", "adj-er / more adj + than · the adj-est / the most adj · as adj as · much / far + so sánh hơn", "~~more cheaper~~ → cheaper · ~~very cheaper~~ → **much** cheaper"],
        ["6", "Gerund & infinitive (N11)", "enjoy / avoid / finish / mind + V-ing · want / decide / hope / plan + to V · giới từ + V-ing", "~~I enjoy to read.~~ → I enjoy **reading**. · ~~interested in learn~~ → in **learning**"],
        ["7", "Câu điều kiện loại 0 & 1 (N13)", "If + hiện tại, hiện tại (luôn đúng) · If + hiện tại, will + V (có thể xảy ra) · unless = if … not", "~~If it will rain, we will stay home.~~ → If it **rains**, …"],
        ["8", "Mệnh đề quan hệ xác định (N15)", "N (người) + who / that · N (vật) + which / that · whose + N · where + S + V", "~~The man which lives next door~~ → the man **who** lives … · ~~the city where I was born in~~ → bỏ in"],
        ["9", "Từ nối cấp câu & đoạn (N17)", "S + V, but / so + S + V · Although + S + V, S + V · However / Therefore / In addition, + câu mới", "~~Although it rained, but we went out.~~ → bỏ but (Although và but không đi cùng)"],
        ["10", "Câu hỏi & câu hỏi đuôi (N19)", "Aux + S + V? · Wh- + aux + S + V? · Could you tell me + wh- + S + V? · đuôi đúng aux, đổi +/−", "~~Could you tell me where is the bank?~~ → where **the bank is**"],
        ["11", "used to / would; quá khứ tiếp diễn (N21)", "used to + V (xưa có, nay không) · would + V (hành động lặp lại) · was / were + V-ing when + V2", "~~I use to play~~ → **used** to · ~~While the phone rang~~ → **When** the phone rang"],
        ["12", "too / enough / so / such (N23)", "too + adj + to V · adj + enough + to V · so + adj · such a + adj + N", "~~too delicious~~ (khen) → **so** delicious · ~~enough old~~ → old enough"],
      ],
    },
    {
      t: "sodo",
      kind: "mindmap",
      title: "12 điểm Tập 2 gom thành 4 nhóm — để nhớ",
      center: "**Ngữ pháp Tập 2**",
      branches: [
        { label: "Danh từ, tính từ & giới từ", items: ["① mạo từ", "② giới từ", "⑤ so sánh"], anh: "books" },
        { label: "Thời gian của động từ", items: ["③ HTHT vs QKĐ", "④ tương lai", "⑪ used to · would · QK tiếp diễn"], anh: "hourglass-done" },
        { label: "Nối ý thành câu phức", items: ["⑦ điều kiện 0 & 1", "⑧ mệnh đề quan hệ", "⑨ từ nối"], anh: "link" },
        { label: "Dạng động từ & câu đặc biệt", items: ["⑥ V-ing / to V", "⑩ câu hỏi · đuôi", "⑫ too · enough · so · such"], anh: "gear" },
      ],
    },

    /* ── 6 ── */
    { t: "h", text: "6. Kiểm tra ôn tổng — 30 câu (đạt ≥ 21/30)" },
    {
      t: "p",
      text: "Làm **không mở lại bài cũ**. Mỗi câu ghi điểm ngữ pháp và **Ngày** cần ôn trong lời giải — sai câu nào, ghi số ngày đó ra giấy. Sai **2 câu cùng một điểm** = phải ôn lại ngày đó trước khi thi Đề 3.",
    },
    {
      t: "mcq",
      id: "t2d23-on-tong",
      title: "Ôn tổng ngữ pháp Tập 2 (27 câu trắc nghiệm)",
      items: [
        { q: "My father ___ in a hospital in the city centre.", options: ["work", "works", "is work", "working"], correct: 1, why: "Hiện tại đơn, chủ ngữ ngôi 3 số ít → **works**. (Nền Tập 1 Ngày 1)" },
        { q: "Can you give me some ___ about the course?", options: ["informations", "many information", "an information", "information"], correct: 3, why: "**information** không đếm được → không -s, không a / many. (Nền Tập 1 Ngày 5)" },
        { q: "The weather in Da Lat ___ cool all year round.", options: ["is", "are", "very", "be"], correct: 0, why: "Câu cần động từ **is** (S + be + C). ~~The weather very cool~~ thiếu động từ. (Nền Tập 1 Ngày 1)" },
        { q: "___ is the key to a good job.", options: ["The education", "An education", "Education", "Educations"], correct: 2, why: "Nói **chung** về giáo dục (danh từ không đếm) → **Ø**. (① Mạo từ — Tập 2 Ngày 1)" },
        { q: "I saw a dog in the park. ___ dog was chasing a ball.", options: ["A", "The", "An", "Ø"], correct: 1, why: "Nhắc **lần hai** → **the**. (① Mạo từ — Ngày 1)" },
        { q: "The meeting is ___ Monday ___ 9 a.m.", options: ["in / at", "on / in", "at / on", "on / at"], correct: 3, why: "**on** + thứ, **at** + giờ. (② Giới từ — Ngày 3)" },
        { q: "The price of rice depends ___ the weather.", options: ["on", "in", "of", "from"], correct: 0, why: "**depend on**. (② Giới từ phụ thuộc — Ngày 3)" },
        { q: "I ___ to Hue three times, and I'm going again next month.", options: ["went", "have been", "was", "had gone"], correct: 1, why: "Trải nghiệm tính **đến nay** (chưa có thời điểm cụ thể) → **have been**. (③ HTHT vs QKĐ — Ngày 5)" },
        { q: "We ___ the museum yesterday afternoon.", options: ["have visited", "visit", "visited", "have been visiting"], correct: 2, why: "**yesterday** (đã xong, xác định) → quá khứ đơn **visited**. (③ — Ngày 5)" },
        { q: "Look at those dark clouds! It ___ rain.", options: ["is going to", "will", "is raining", "rains"], correct: 0, why: "Dự đoán có **dấu hiệu** trước mắt → **be going to**. (④ Tương lai — Ngày 7)" },
        { q: "I ___ my cousin at the airport at 6 tonight — I've already told her.", options: ["am meet", "meet", "am meeting", "met"], correct: 2, why: "Việc **đã hẹn / sắp xếp** → hiện tại tiếp diễn **am meeting**. (④ — Ngày 7)" },
        { q: "Living in a city is ___ than living in the countryside.", options: ["more expensive", "expensiver", "more expensiver", "most expensive"], correct: 0, why: "Tính từ dài → **more expensive than**. (⑤ So sánh — Ngày 9)" },
        { q: "This phone is ___ cheaper than that one.", options: ["very", "so", "more", "much"], correct: 3, why: "Nhấn mạnh so sánh hơn → **much / far** cheaper. ~~very cheaper~~ sai. (⑤ — Ngày 9)" },
        { q: "I don't mind ___ late if it helps the team.", options: ["to work", "work", "worked", "working"], correct: 3, why: "**mind + V-ing**. (⑥ Gerund — Ngày 11)" },
        { q: "She decided ___ abroad after graduating.", options: ["studying", "to study", "study", "studied"], correct: 1, why: "**decide + to V**. (⑥ — Ngày 11)" },
        { q: "If you heat ice, it ___.", options: ["will melt", "melted", "melts", "would melt"], correct: 2, why: "Sự thật luôn đúng → **điều kiện loại 0**: hiện tại + hiện tại → **melts**. (⑦ — Ngày 13)" },
        { q: "___ you hurry, you will miss the bus.", options: ["If", "Unless", "When", "Because"], correct: 1, why: "**Unless** = if … not: Nếu bạn **không** nhanh lên, bạn sẽ lỡ xe. (⑦ — Ngày 13)" },
        { q: "The woman ___ son won the competition is my teacher.", options: ["whose", "which", "who", "where"], correct: 0, why: "Sở hữu (con trai **của** bà ấy) → **whose** + N. (⑧ Mệnh đề quan hệ — Ngày 15)" },
        { q: "This is the village ___ my mother grew up.", options: ["which", "where", "who", "whose"], correct: 1, why: "Nơi chốn + mệnh đề đủ S + V (my mother grew up) → **where**. (⑧ — Ngày 15)" },
        { q: "___ it was raining, we went for a walk.", options: ["Although", "However", "But", "Despite"], correct: 0, why: "Nối hai mệnh đề trong một câu, nghĩa nhượng bộ → **Although** + S + V. However đứng đầu câu mới + dấu phẩy; Despite + N / V-ing. (⑨ Từ nối — Ngày 17)" },
        { q: "The tickets were expensive. ___, we enjoyed the show.", options: ["Although", "Because", "However", "So that"], correct: 2, why: "Câu mới, nghĩa đối lập → **However,**. (⑨ — Ngày 17)" },
        { q: "Do you know what time ___?", options: ["does the film start", "the film does start", "starts the film", "the film starts"], correct: 3, why: "Câu hỏi gián tiếp → thứ tự câu kể **the film starts**. (⑩ — Ngày 19)" },
        { q: "You've finished your essay, ___?", options: ["didn't you", "haven't you", "don't you", "isn't it"], correct: 1, why: "Trợ động từ **have** → đuôi **haven't you?** (⑩ — Ngày 19)" },
        { q: "When I was young, I ___ swim in the river every summer.", options: ["would", "use to", "was used to", "am used to"], correct: 0, why: "Hành động **lặp lại** ngày xưa → **would** (cũng được: used to). ~~use to~~ thiếu -d. (⑪ — Ngày 21)" },
        { q: "I ___ dinner when the power went out.", options: ["had", "have had", "was having", "used to have"], correct: 2, why: "Việc dài **đang diễn ra** bị cắt ngang → **was having**. (⑪ — Ngày 21)" },
        { q: "The tea is ___ hot to drink right now.", options: ["so", "very", "enough", "too"], correct: 3, why: "Quá nóng nên **không** uống được → **too** + adj + to V. (⑫ — Ngày 23)" },
        { q: "It was ___ that we stayed at home.", options: ["so a cold day", "such cold day", "such a cold day", "a such cold day"], correct: 2, why: "Cụm danh từ số ít → **such a** + adj + N. (⑫ — Ngày 23)" },
      ],
    },
    {
      t: "quiz",
      id: "t2d23-on-tong-dich",
      title: "Ôn tổng — dịch sang tiếng Anh (3 câu, trộn điểm)",
      kind: "translate",
      grammar: "Mỗi câu trộn 2 điểm: xem 💡.",
      items: [
        { q: "Tôi đã sống ở Đà Nẵng được năm năm, nhưng tôi vẫn chưa quen với cái nóng.", hint: "HTHT (have lived … for) + be used to + N (the heat)", answers: ["I have lived in Da Nang for five years, but I am still not used to the heat.", "I've lived in Da Nang for five years, but I'm still not used to the heat.", "I have lived in Da Nang for five years, but I still am not used to the heat.", "I've been living in Da Nang for five years, but I'm still not used to the heat.", "I have lived in Da Nang for five years but I am still not used to the heat.", "I've lived in Da Nang for five years, but I'm still not used to the hot weather."] },
        { q: "Nếu bạn không đủ tuổi, bạn sẽ không được vào.", hint: "If + hiện tại (aren't old enough), will + not be allowed in", answers: ["If you aren't old enough, you won't be allowed in.", "If you are not old enough, you will not be allowed in.", "If you're not old enough, you won't be allowed in.", "If you aren't old enough, you will not be allowed in.", "If you are not old enough, you won't be allowed in.", "If you aren't old enough, you won't be allowed to enter.", "If you are not old enough, you will not be allowed to enter."] },
        { q: "Người phụ nữ sống cạnh nhà tôi là một bác sĩ.", hint: "The woman who / that lives next door (to me) is a doctor", answers: ["The woman who lives next door is a doctor.", "The woman that lives next door is a doctor.", "The woman who lives next door to me is a doctor.", "The woman that lives next door to me is a doctor.", "The woman who lives next to my house is a doctor."] },
      ],
    },
    {
      t: "table",
      caption: "Tự chấm 30 câu — và ôn gì",
      head: ["Điểm", "Mức", "Việc nên làm trước Đề 3"],
      rows: [
        ["27–30", "Vững", "Chỉ xem lại câu sai; dành thời gian cho Viết và Nói."],
        ["21–26", "Đạt (≥ 70 %)", "Ôn đúng các ngày ghi trong lời giải câu sai."],
        ["< 21", "Chưa đạt", "Ôn lại theo nhóm trên sơ đồ 4 nhánh; làm lại bài này sau 2 ngày rồi mới thi Đề 3."],
      ],
    },
  ],
};

/* ─────────────────────────── Bài 2 · Nghe — đề 40 câu ─────────────────────────── */

const T2D23_LISTENING: Lesson = {
  id: "t2d23-nghe",
  kind: "listening",
  title: "Đề Listening đủ 40 câu (Part 1–4)",
  goal: "Làm trọn một đề Listening 40 câu theo đúng trình tự IELTS — Part 1 Form · Part 2 MCQ + Map · Part 3 Choose TWO + MCQ + Matching · Part 4 Note completion — tự chấm và đổi ra band (mục tiêu band 5 = 16/40), biết Part nào đang kéo điểm xuống.",
  minutes: 75,
  blocks: [
    {
      t: "recap",
      title: "Bài này học gì — đẩy band nào",
      items: [
        "Lần đầu tiên trong Tập 2 bạn làm **đủ 4 Part, 40 câu** liền nhau — đúng nhịp phòng thi (khoảng 30 phút nghe).",
        "Bài này là **luyện**: được nghe lại sau khi chấm. Nhưng **lần làm đầu** hãy làm như thi thật: **mỗi Part nghe một lần**, không mở lời thoại, không dừng giữa Part.",
        "Độ khó tăng dần như đề thật: **Part 1** (đăng ký phòng tập) → **Part 2** (hướng dẫn công viên, bản đồ) → **Part 3** (hai sinh viên bàn bài thuyết trình) → **Part 4** (bài giảng về tre).",
        "Đổi điểm: **16–17/40 = band 5.0** (mục tiêu cuối Tập 2) · 13–15 = 4.5 · 18–22 = 5.5. Đề 3 (thi cuối Tập 2) ở phòng thi máy cùng mức này.",
        "Sau khi chấm: điền bảng **Part nào mất bao nhiêu câu** — đó là bản đồ ôn tập cho Ngày 24 và trước Đề 3.",
      ],
    },
    { t: "h", text: "Trước khi bắt đầu" },
    {
      t: "note",
      title: "Làm như phòng thi máy",
      items: [
        "Chuẩn bị **45 phút** không bị làm phiền, tai nghe, giấy nháp. Tắt thông báo.",
        "Thi máy: gõ đáp án **ngay khi nghe**; cuối bài chỉ có **2 phút** kiểm tra. Ở đây: điền vào ô sau mỗi Part, cuối cùng dành 2 phút soát chính tả.",
        "Đọc lời dẫn giới hạn từ **trước mỗi phần** — Part 1 và Part 4 hôm nay **khác nhau**.",
        "Lỡ câu → **bỏ, nhảy câu sau**. Không bỏ trống ô nào khi nộp.",
      ],
    },

    /* ── PART 1 ── */
    { t: "h", text: "PART 1 — Questions 1–10: New member form" },
    {
      t: "canh",
      anh: ["telephone-receiver", "woman-lifting-weights", "clipboard"],
      caption: "Sophie vừa chuyển đến khu Westfield, gọi điện cho trung tâm thể thao Riverside để đăng ký làm hội viên.",
    },
    {
      t: "table",
      caption: "Questions 1–10 — Complete the form below. Write ONE WORD AND/OR A NUMBER for each answer.",
      head: ["Riverside Sports Centre — New Member Form", ""],
      rows: [
        ["Name", "Sophie **(1) ______**"],
        ["Date of birth", "14th **(2) ______** 2001"],
        ["Address", "27 **(3) ______** Road, Westfield"],
        ["Mobile number", "**(4) ______**"],
        ["Type of membership", "**(5) ______**"],
        ["Monthly fee", "£ **(6) ______**"],
        ["Class she wants to join", "**(7) ______** (at 11 a.m.)"],
        ["Day of class", "**(8) ______**"],
        ["Heard about the centre from", "a **(9) ______**"],
        ["Must bring on first visit", "a **(10) ______**"],
      ],
    },
    {
      t: "listen",
      id: "t2d23-nghe-p1",
      title: "New member form",
      dan: { so: "Day 23, Part 1", boiCanh: "a conversation between a receptionist at a sports centre and a woman who wants to join.", cau: [1, 10] },
      note: "Khoảng 4 phút. Nghe một lần.",
      lines: [
        { who: "Receptionist", voice: "uk-nam", text: "Good morning, Riverside Sports Centre, Daniel speaking. How can I help?", vi: "Chào buổi sáng, trung tâm thể thao Riverside, Daniel nghe đây. Tôi giúp gì được ạ?" },
        { who: "Sophie", voice: "uk-nu", text: "Hi. I'd like to become a member, please. I've just moved to the area.", vi: "Chào anh. Tôi muốn đăng ký hội viên. Tôi vừa chuyển đến khu này." },
        { who: "Receptionist", voice: "uk-nam", text: "Great. I can take your details over the phone and set everything up. Can I have your name first?", vi: "Tốt quá. Tôi có thể ghi thông tin qua điện thoại và làm thủ tục luôn. Cho tôi xin tên trước nhé?" },
        { who: "Sophie", voice: "uk-nu", text: "Yes, it's Sophie Harrington.", vi: "Vâng, tôi là Sophie Harrington." },
        { who: "Receptionist", voice: "uk-nam", text: "Could you spell your surname for me?", vi: "Chị đánh vần họ giúp tôi được không?" },
        { who: "Sophie", voice: "uk-nu", text: "Sure. H-A-R-R-I-N-G-T-O-N.", vi: "Được. H-A-R-R-I-N-G-T-O-N." },
        { who: "Receptionist", voice: "uk-nam", text: "Double R in the middle?", vi: "Hai chữ R ở giữa phải không?" },
        { who: "Sophie", voice: "uk-nu", text: "That's right.", vi: "Đúng rồi." },
        { who: "Receptionist", voice: "uk-nam", text: "Thank you. And your date of birth?", vi: "Cảm ơn chị. Còn ngày sinh?" },
        { who: "Sophie", voice: "uk-nu", text: "It's the fourteenth of March — oh, sorry, no, that's my sister's birthday. I always mix them up! Mine is the fourteenth of May, two thousand and one.", vi: "Ngày mười bốn tháng Ba — ôi, xin lỗi, không, đó là sinh nhật em gái tôi. Tôi lúc nào cũng lẫn! Của tôi là mười bốn tháng Năm, năm hai nghìn lẻ một." },
        { who: "Receptionist", voice: "uk-nam", text: "Fourteenth of May, 2001. And your address?", vi: "Mười bốn tháng Năm, 2001. Còn địa chỉ?" },
        { who: "Sophie", voice: "uk-nu", text: "It's 27 Thornbury Road. That's T-H-O-R-N-B-U-R-Y.", vi: "Số 27 đường Thornbury. Đánh vần T-H-O-R-N-B-U-R-Y." },
        { who: "Receptionist", voice: "uk-nam", text: "And that's here in Westfield?", vi: "Và ở ngay Westfield này?" },
        { who: "Sophie", voice: "uk-nu", text: "Yes, just behind the station.", vi: "Vâng, ngay sau nhà ga." },
        { who: "Receptionist", voice: "uk-nam", text: "And a contact number?", vi: "Cho tôi xin số liên lạc?" },
        { who: "Sophie", voice: "uk-nu", text: "My mobile is oh seven eight three nine, five six two, four one oh.", vi: "Di động của tôi là 07839 562 410." },
        { who: "Receptionist", voice: "uk-nam", text: "Oh seven eight three nine, five six two, four one oh. Lovely. Now, we have three types of membership. Standard membership lets you use everything at any time, and that's thirty-nine pounds a month. Then there's student membership at nineteen pounds. Are you a student at all?", vi: "07839 562 410. Tốt. Giờ thì chúng tôi có ba loại thẻ hội viên. Thẻ tiêu chuẩn cho dùng mọi thứ vào mọi lúc, giá ba mươi chín bảng một tháng. Rồi có thẻ sinh viên giá mười chín bảng. Chị có phải sinh viên không?" },
        { who: "Sophie", voice: "uk-nu", text: "I'm afraid not. I finished university two years ago.", vi: "Tiếc là không. Tôi tốt nghiệp đại học hai năm rồi." },
        { who: "Receptionist", voice: "uk-nam", text: "OK. The third option is off-peak. That's for people who come between nine in the morning and four in the afternoon on weekdays, and any time at weekends.", vi: "Vâng. Lựa chọn thứ ba là thẻ giờ thấp điểm. Dành cho người đến từ chín giờ sáng tới bốn giờ chiều các ngày trong tuần, và bất cứ lúc nào vào cuối tuần." },
        { who: "Sophie", voice: "uk-nu", text: "Actually, that would suit me. I work from home, so I can come during the day. How much is that one?", vi: "Thật ra cái đó hợp với tôi. Tôi làm việc ở nhà nên có thể đến ban ngày. Loại đó giá bao nhiêu?" },
        { who: "Receptionist", voice: "uk-nam", text: "Off-peak is twenty-four pounds a month.", vi: "Thẻ thấp điểm là hai mươi bốn bảng một tháng." },
        { who: "Sophie", voice: "uk-nu", text: "Perfect. I'll take off-peak, then.", vi: "Tuyệt. Vậy tôi lấy thẻ thấp điểm." },
        { who: "Receptionist", voice: "uk-nam", text: "Are you interested in any of our classes? They're included in all memberships.", vi: "Chị có quan tâm lớp nào không? Mọi loại thẻ đều được học miễn phí." },
        { who: "Sophie", voice: "uk-nu", text: "I was thinking about yoga, but a friend recommended Pilates, so I'd like to try that first.", vi: "Tôi đã nghĩ tới yoga, nhưng một người bạn giới thiệu Pilates, nên tôi muốn thử cái đó trước." },
        { who: "Receptionist", voice: "uk-nam", text: "Pilates. We have classes on Tuesdays and Thursdays, both at eleven.", vi: "Pilates. Chúng tôi có lớp vào thứ Ba và thứ Năm, đều lúc mười một giờ." },
        { who: "Sophie", voice: "uk-nu", text: "Tuesday would be best for me.", vi: "Thứ Ba là tiện nhất với tôi." },
        { who: "Receptionist", voice: "uk-nam", text: "I'm sorry, the Tuesday class is full at the moment. There's still space on Thursday, though.", vi: "Xin lỗi, lớp thứ Ba hiện đã kín. Nhưng thứ Năm vẫn còn chỗ." },
        { who: "Sophie", voice: "uk-nu", text: "Thursday's fine, then.", vi: "Vậy thứ Năm cũng được." },
        { who: "Receptionist", voice: "uk-nam", text: "Great. Can I ask how you heard about us? We like to know whether our advertising works.", vi: "Tốt. Tôi hỏi chị biết đến chúng tôi qua đâu được không? Chúng tôi muốn biết quảng cáo có hiệu quả không." },
        { who: "Sophie", voice: "uk-nu", text: "I didn't see any adverts, actually, and I haven't even looked at your website yet. My neighbour comes here every morning, and she told me about it.", vi: "Thật ra tôi chẳng thấy quảng cáo nào, và tôi còn chưa xem website của các anh. Bà hàng xóm của tôi sáng nào cũng đến đây, bà ấy kể cho tôi." },
        { who: "Receptionist", voice: "uk-nam", text: "That's nice to hear. Right, one last thing. When you come in for the first time, please bring a photo for your membership card. You don't need any ID, because we've already got your details.", vi: "Nghe vui quá. Rồi, việc cuối cùng. Lần đầu chị đến, nhớ mang một tấm ảnh để làm thẻ hội viên. Chị không cần giấy tờ tuỳ thân vì chúng tôi đã có thông tin của chị rồi." },
        { who: "Sophie", voice: "uk-nu", text: "A photo. No problem. Thanks very much.", vi: "Một tấm ảnh. Không vấn đề gì. Cảm ơn anh nhiều." },
      ],
    },
    {
      t: "quiz",
      id: "t2d23-de-p1",
      title: "Questions 1–10 — ONE WORD AND/OR A NUMBER",
      kind: "fill",
      items: [
        { q: "(1) Name: Sophie ___", answers: ["Harrington"], hint: "họ — có đánh vần" },
        { q: "(2) Date of birth: 14th ___ 2001", answers: ["May"], hint: "tháng" },
        { q: "(3) Address: 27 ___ Road", answers: ["Thornbury"], hint: "tên đường — có đánh vần" },
        { q: "(4) Mobile number", answers: ["07839 562 410", "07839562410", "07839 562410", "0783 9562 410"], hint: "dãy số" },
        { q: "(5) Type of membership", answers: ["off-peak", "offpeak", "off peak"], hint: "một từ (có gạch nối)" },
        { q: "(6) Monthly fee: £ ___", answers: ["24", "twenty-four", "twenty four", "£24", "24 pounds"], hint: "số tiền" },
        { q: "(7) Class she wants to join", answers: ["Pilates"], hint: "tên môn" },
        { q: "(8) Day of class", answers: ["Thursday"], hint: "thứ trong tuần" },
        { q: "(9) Heard about the centre from a ___", answers: ["neighbour", "neighbor"], hint: "a + người" },
        { q: "(10) Must bring on first visit: a ___", answers: ["photo", "photograph"], hint: "a + vật" },
      ],
    },
    {
      t: "note",
      title: "Giải thích Part 1 — sáu bẫy kinh điển",
      items: [
        "**(2) May** — bẫy **sửa lời**: “the fourteenth of **March** — oh, sorry, **no**, that's my sister's birthday… Mine is the fourteenth of **May**”.",
        "**(5) off-peak** — bẫy **liệt kê lựa chọn**: standard (39) → student (19, không phải SV) → **off-peak** (chốt: “I'll take off-peak”). Từ có gạch nối tính là **một** từ.",
        "**(6) 24** — ba con số 39 · 19 · 24 đều được đọc; đáp án là giá của loại **đã chọn**.",
        "**(7) Pilates** — bẫy **yoga** (“I was thinking about yoga, **but**…”). **(8) Thursday** — bẫy **Tuesday** (“full at the moment”).",
        "**(9) neighbour** — bẫy **adverts / website** (“I didn't see any adverts… haven't even looked at your website”).",
        "**(10) photo** — bẫy **ID** (“You **don't** need any ID”).",
      ],
    },

    /* ── PART 2 ── */
    { t: "h", text: "PART 2 — Questions 11–20: Greenfield Community Park" },
    {
      t: "canh",
      anh: ["national-park", "deciduous-tree", "dog", "bicycle"],
      caption: "Một kiểm lâm viên dẫn nhóm khách mới tham quan công viên cộng đồng Greenfield: lịch sử, quy định, việc tình nguyện và chỉ đường trên bản đồ.",
    },
    {
      t: "table",
      caption: "Questions 11–14 — Choose the correct letter, A, B or C.",
      head: ["Câu", "Câu hỏi", "A", "B", "C"],
      rows: [
        ["11", "Before it became a park, the land was", "farmland.", "a factory site.", "a royal garden."],
        ["12", "What has been added to the park recently?", "an outdoor gym", "a second lake", "a concert stage"],
        ["13", "What is the rule for dogs?", "They are not allowed in the park.", "They must be on a lead near the lake.", "They may only come in the morning."],
        ["14", "Volunteers are needed to help with", "cleaning the lake.", "leading guided tours.", "planting trees."],
      ],
    },
    {
      t: "figure",
      fig: {
        kind: "map",
        title: "Greenfield Community Park",
        note: "Bản đồ tự vẽ cho bài luyện. Phía Bắc ở trên cùng. Questions 15–20: chọn chữ cái A–H.",
        map: {
          cols: 12,
          rows: 10,
          paths: [
            { x: 5.6, y: 6.2, w: 0.8, h: 3.6, label: "Main path" },
            { x: 2.4, y: 2.4, w: 7.2, h: 0.5 },
          ],
          boxes: [
            { x: 0.4, y: 0.3, w: 3, h: 1.9, label: "A" },
            { x: 4.5, y: 0.3, w: 3, h: 1.9, label: "B" },
            { x: 8.6, y: 0.3, w: 3, h: 1.9, label: "C" },
            { x: 0.4, y: 3.2, w: 2.4, h: 2.6, label: "D" },
            { x: 3.2, y: 3.2, w: 5.6, h: 2.8, label: "Lake" },
            { x: 9.2, y: 3.2, w: 2.4, h: 2.6, label: "E" },
            { x: 0.4, y: 7.0, w: 2.8, h: 2.6, label: "Car park" },
            { x: 3.6, y: 6.8, w: 1.8, h: 1.6, label: "F" },
            { x: 6.6, y: 6.8, w: 1.8, h: 1.6, label: "G" },
            { x: 9.6, y: 7.6, w: 2, h: 2, label: "H" },
          ],
          pins: [{ x: 6, y: 9.6, label: "Main gate (you are here)" }],
        },
      },
    },
    {
      t: "table",
      caption: "Questions 15–20 — Label the map. Write the correct letter, A–H.",
      head: ["Câu", "Địa điểm"],
      rows: [
        ["15", "Information centre"],
        ["16", "Bike hire"],
        ["17", "Café"],
        ["18", "Rose garden"],
        ["19", "Children's playground"],
        ["20", "Toilets"],
      ],
    },
    {
      t: "listen",
      id: "t2d23-nghe-p2",
      title: "Greenfield Community Park",
      dan: { so: "Day 23, Part 2", boiCanh: "a park ranger talking to a group of visitors.", cau: [11, 20] },
      note: "Khoảng 5 phút, giọng Mỹ, một người nói.",
      lines: [
        { who: "Ranger", voice: "us-nam", text: "Good morning, everyone, and welcome to Greenfield Community Park. My name's Marcus, and I'm one of the park rangers. Before we start our walk, let me tell you a little about the park's history. Many visitors assume this land was always farmland, and some people even believe it was once part of a royal garden, but in fact, until 1985, it was the site of a brick factory. When the factory closed, local people campaigned for the land to become a park, and it finally opened in 1992.", vi: "Chào buổi sáng mọi người, chào mừng đến công viên cộng đồng Greenfield. Tôi là Marcus, một trong các kiểm lâm viên của công viên. Trước khi đi dạo, tôi kể đôi chút về lịch sử công viên. Nhiều du khách nghĩ khu đất này vốn luôn là đất nông nghiệp, có người còn tin nó từng là một phần vườn hoàng gia, nhưng thật ra, cho tới năm 1985, nơi đây là một nhà máy gạch. Khi nhà máy đóng cửa, người dân địa phương vận động biến khu đất thành công viên, và cuối cùng công viên mở cửa năm 1992." },
        { who: "Ranger", voice: "us-nam", text: "We've made a few changes over the past year. Lots of people asked us for a second lake, but unfortunately that would cost far too much. We've also discussed building a stage for summer concerts — maybe in the future. What we did add, this spring, is an outdoor gym with free exercise machines, and it's already very popular, especially early in the morning.", vi: "Trong năm qua chúng tôi đã thay đổi vài thứ. Nhiều người đề nghị làm hồ thứ hai, nhưng tiếc là việc đó quá tốn kém. Chúng tôi cũng bàn chuyện xây sân khấu cho các buổi hoà nhạc mùa hè — có lẽ là trong tương lai. Thứ chúng tôi đã thêm vào mùa xuân này là một phòng tập ngoài trời với máy tập miễn phí, và nó đã rất được ưa chuộng, nhất là sáng sớm." },
        { who: "Ranger", voice: "us-nam", text: "Now, a few rules. Dogs are very welcome here at any time of day, and in most areas you don't need to keep them on a lead. However, around the lake, they must be on a lead, because of the ducks and the birds that nest there.", vi: "Giờ là vài quy định. Chó được chào đón ở đây vào mọi giờ trong ngày, và ở hầu hết các khu vực bạn không cần xích chúng. Tuy nhiên, quanh hồ thì chó phải được xích, vì có vịt và các loài chim làm tổ ở đó." },
        { who: "Ranger", voice: "us-nam", text: "We're always looking for volunteers. The lake is cleaned by a professional company, and the guided tours are run by rangers like me. But in November, we're planting five hundred young trees along the northern edge of the park, and we need as many helpers as possible for that.", vi: "Chúng tôi luôn cần tình nguyện viên. Hồ được một công ty chuyên nghiệp làm sạch, còn các tour có hướng dẫn do kiểm lâm như tôi phụ trách. Nhưng vào tháng Mười Một, chúng tôi sẽ trồng năm trăm cây non dọc rìa phía bắc công viên, và chúng tôi cần càng nhiều người giúp càng tốt." },
        { who: "Ranger", voice: "us-nam", text: "OK, could you all look at the map? We're standing at the main gate, at the bottom of the map. As soon as you come through the gate, you'll see the information centre immediately on your right. That's the place to ask questions or pick up a free leaflet. Directly opposite it, on the left-hand side of the main path, is the bike hire, where you can rent a bike for two pounds an hour. Behind the bike hire, further to the west, is the car park.", vi: "Rồi, mọi người nhìn bản đồ nhé. Chúng ta đang đứng ở cổng chính, ở cuối bản đồ. Ngay khi bước qua cổng, các bạn sẽ thấy trung tâm thông tin ngay bên phải. Đó là nơi để hỏi hoặc lấy tờ rơi miễn phí. Đối diện ngay đó, ở phía bên trái lối đi chính, là chỗ thuê xe đạp, giá hai bảng một giờ. Phía sau chỗ thuê xe, xa hơn về phía tây, là bãi đỗ xe." },
        { who: "Ranger", voice: "us-nam", text: "If you walk straight up the main path, you come to the lake. The café is on the western side of the lake, so when you reach the water, turn left and you'll see it straight away. It has a lovely terrace looking across the lake. On the opposite side of the lake, to the east, is the picnic area, with plenty of tables.", vi: "Nếu đi thẳng theo lối chính, bạn sẽ tới hồ. Quán cà phê nằm ở phía tây của hồ, nên khi tới mép nước, rẽ trái là thấy ngay. Quán có một sân hiên rất đẹp nhìn ra hồ. Bên kia hồ, về phía đông, là khu dã ngoại với nhiều bàn." },
        { who: "Ranger", voice: "us-nam", text: "If you go past the lake to the far side of the park, right in the middle of the northern edge, you'll find the rose garden. It's at its best in June. The children's playground is in the north-east corner, so if you've got young children, just keep walking to the right from the rose garden. In the north-west corner there's an old greenhouse, but I'm afraid it's closed for repairs at the moment.", vi: "Nếu đi qua hồ tới phía xa của công viên, ngay chính giữa rìa phía bắc, bạn sẽ thấy vườn hồng. Vườn đẹp nhất vào tháng Sáu. Sân chơi trẻ em ở góc đông bắc, nên nếu có con nhỏ, cứ đi tiếp về bên phải từ vườn hồng. Ở góc tây bắc có một nhà kính cũ, nhưng tiếc là hiện đang đóng cửa để sửa chữa." },
        { who: "Ranger", voice: "us-nam", text: "And finally, the question everyone asks: the toilets. They're not near the café, I'm afraid. They're in the far south-east corner of the park, on the same side as the information centre, but right over by the fence.", vi: "Và cuối cùng, câu ai cũng hỏi: nhà vệ sinh. Tiếc là chúng không ở gần quán cà phê. Chúng ở tận góc đông nam công viên, cùng phía với trung tâm thông tin, nhưng sát ra phía hàng rào." },
      ],
    },
    {
      t: "mcq",
      id: "t2d23-de-p2-chon",
      title: "Questions 11–14",
      items: [
        { q: "(11) Before it became a park, the land was", options: ["farmland.", "a factory site.", "a royal garden."], correct: 1, why: "“Many visitors **assume**… farmland… some people even **believe**… royal garden, **but in fact**, until 1985, it was the site of **a brick factory**.”" },
        { q: "(12) What has been added to the park recently?", options: ["an outdoor gym", "a second lake", "a concert stage"], correct: 0, why: "Hồ thứ hai: “would cost far too much”; sân khấu: “**maybe in the future**”; “What we **did add**, this spring, is **an outdoor gym**”." },
        { q: "(13) What is the rule for dogs?", options: ["They are not allowed in the park.", "They must be on a lead near the lake.", "They may only come in the morning."], correct: 1, why: "“welcome here **at any time of day**… **However, around the lake, they must be on a lead**”." },
        { q: "(14) Volunteers are needed to help with", options: ["cleaning the lake.", "leading guided tours.", "planting trees."], correct: 2, why: "Hồ do **công ty chuyên nghiệp** làm sạch; tour do **kiểm lâm** dẫn; “**we're planting five hundred young trees**… we need as many helpers as possible”." },
      ],
    },
    {
      t: "quiz",
      id: "t2d23-de-p2-ban-do",
      title: "Questions 15–20 — viết chữ cái A–H",
      kind: "fill",
      items: [
        { q: "(15) Information centre", answers: ["G"], hint: "qua cổng → ngay bên phải" },
        { q: "(16) Bike hire", answers: ["F"], hint: "đối diện (15), bên trái lối chính" },
        { q: "(17) Café", answers: ["D"], hint: "phía tây của hồ" },
        { q: "(18) Rose garden", answers: ["B"], hint: "giữa rìa phía bắc" },
        { q: "(19) Children's playground", answers: ["C"], hint: "góc đông bắc" },
        { q: "(20) Toilets", answers: ["H"], hint: "góc đông nam, sát hàng rào" },
      ],
    },
    {
      t: "note",
      title: "Giải thích bản đồ 15–20",
      items: [
        "Đứng ở **Main gate** (dưới cùng), nhìn lên: bên phải = phía **đông**, bên trái = phía **tây**.",
        "**(15) G** — “immediately **on your right**” khi vừa qua cổng. **(16) F** — “**Directly opposite** it, on the **left-hand side** of the main path”.",
        "**(17) D** — “the café is on the **western side** of the lake… turn left”. Bẫy **E** = picnic area (phía đông hồ).",
        "**(18) B** — “right **in the middle of the northern edge**”. **(19) C** — “the **north-east corner**”. Bẫy **A** = greenhouse (tây bắc, đang đóng).",
        "**(20) H** — “**not near the café**… in the far **south-east corner**… right over by the fence”.",
      ],
    },

    /* ── PART 3 ── */
    { t: "h", text: "PART 3 — Questions 21–30: A presentation on students' sleep" },
    {
      t: "canh",
      anh: ["woman-student", "man-student", "sleeping-face", "bar-chart"],
      caption: "Mia và Tom chuẩn bị bài thuyết trình nhóm về giấc ngủ của sinh viên năm nhất — họ xem lại kết quả khảo sát và quyết định sửa từng phần bài nói.",
    },
    {
      t: "table",
      caption: "Questions 21–22 — Choose TWO letters, A–E. Which TWO problems did the students have with their survey?",
      head: ["", "Problem"],
      rows: [
        ["A", "Too few students answered it."],
        ["B", "One question was understood in different ways."],
        ["C", "It took too long to complete."],
        ["D", "The online form stopped working."],
        ["E", "Some answers were clearly not serious."],
      ],
    },
    {
      t: "table",
      caption: "Questions 23–25 — Choose the correct letter, A, B or C.",
      head: ["Câu", "Câu hỏi", "A", "B", "C"],
      rows: [
        ["23", "Why did they choose sleep as their topic?", "Their tutor said it was popular.", "They both slept badly in their first term.", "There is a lot of research on first-year students."],
        ["24", "What surprised them most in the results?", "the average number of hours slept", "how many students used phones in bed", "how students with part-time jobs slept"],
        ["25", "What will Tom do next?", "contact the students' union", "redesign the slides", "look for more research"],
      ],
    },
    {
      t: "table",
      caption: "Questions 26–30 — What do the students decide to do with each part of the presentation? Choose FIVE answers from the box (A–F).",
      head: ["", "Decision"],
      rows: [
        ["A", "make it shorter"],
        ["B", "add a chart"],
        ["C", "move it to the end"],
        ["D", "keep it as it is"],
        ["E", "remove it"],
        ["F", "ask another student to present it"],
      ],
    },
    {
      t: "table",
      caption: "Parts of the presentation",
      head: ["Câu", "Phần"],
      rows: [
        ["26", "Introduction"],
        ["27", "How the survey was designed"],
        ["28", "Survey results"],
        ["29", "Quotes from interviews"],
        ["30", "Recommendations"],
      ],
    },
    {
      t: "listen",
      id: "t2d23-nghe-p3",
      title: "A presentation on students' sleep",
      dan: { so: "Day 23, Part 3", boiCanh: "two students, Mia and Tom, preparing a presentation.", cau: [21, 30] },
      note: "Khoảng 5 phút 30 giây, hai người nói.",
      lines: [
        { who: "Mia", voice: "uk-nu", text: "OK, Tom, let's go through the survey results before we finalise the slides. We got a hundred and twenty responses in the end.", vi: "Rồi Tom, mình xem kết quả khảo sát trước khi chốt slide nhé. Cuối cùng mình nhận được một trăm hai mươi câu trả lời." },
        { who: "Tom", voice: "us-nam", text: "Which is more than enough for a first-year project. And the online form worked perfectly — I was worried it might crash, but it didn't.", vi: "Thế là quá đủ cho một đồ án năm nhất. Và biểu mẫu trực tuyến chạy hoàn hảo — mình đã lo nó sập, nhưng không." },
        { who: "Mia", voice: "uk-nu", text: "And it was quick. Most people finished it in about five minutes. The real issue was question six, the one about screen time. Some people counted watching TV, and some only counted their phones, so the numbers don't really mean the same thing.", vi: "Mà lại nhanh nữa. Phần lớn làm xong trong khoảng năm phút. Vấn đề thật sự là câu sáu, câu về thời gian dùng màn hình. Có người tính cả xem tivi, có người chỉ tính điện thoại, nên các con số không thật sự cùng nghĩa." },
        { who: "Tom", voice: "us-nam", text: "True. And we had a few silly answers. Someone said they sleep twenty hours a night, and another person said they'd never slept at all!", vi: "Đúng. Và có vài câu trả lời đùa cợt. Có người bảo mỗi đêm ngủ hai mươi tiếng, người khác thì nói chưa từng ngủ bao giờ!" },
        { who: "Mia", voice: "uk-nu", text: "We'll mention both of those problems in the limitations. Now, remind me how we'll explain why we chose the topic.", vi: "Mình sẽ nêu cả hai vấn đề đó ở phần hạn chế. Giờ nhắc mình cách giải thích vì sao chọn đề tài nhé." },
        { who: "Tom", voice: "us-nam", text: "Well, Dr Lewis did say sleep is a popular topic, but that's not the real reason. The honest answer is that we both had terrible sleep in our first term — remember how you were falling asleep in lectures?", vi: "Thì thầy Lewis có nói giấc ngủ là đề tài phổ biến, nhưng đó không phải lý do thật. Câu trả lời thành thật là cả hai đứa đều ngủ tệ kinh khủng trong học kỳ đầu — nhớ hồi cậu ngủ gật trong giờ giảng không?" },
        { who: "Mia", voice: "uk-nu", text: "Don't remind me! And there isn't actually much research on first-year students specifically, so that's a good point to make too.", vi: "Đừng nhắc nữa! Mà thật ra cũng không có nhiều nghiên cứu riêng về sinh viên năm nhất, nên đó cũng là ý hay để nói." },
        { who: "Tom", voice: "us-nam", text: "What about the results? The average was six point two hours a night.", vi: "Còn kết quả thì sao? Trung bình là sáu phẩy hai tiếng mỗi đêm." },
        { who: "Mia", voice: "uk-nu", text: "Which is about what we expected. And everybody knows students use their phones in bed — nearly ninety per cent did. For me, the real surprise was the students with part-time jobs. I assumed they'd sleep less, but they actually slept more than the others, probably because they had to organise their time.", vi: "Đúng như mình dự đoán. Và ai cũng biết sinh viên dùng điện thoại trên giường — gần chín mươi phần trăm. Với mình, điều thật sự bất ngờ là những bạn làm thêm. Mình cứ tưởng họ ngủ ít hơn, nhưng thật ra họ ngủ nhiều hơn những người khác, có lẽ vì họ buộc phải sắp xếp thời gian." },
        { who: "Tom", voice: "us-nam", text: "Same for me. That's definitely the most interesting finding.", vi: "Mình cũng vậy. Đó chắc chắn là phát hiện thú vị nhất." },
        { who: "Mia", voice: "uk-nu", text: "So what should we do next? I can redesign the slides tonight.", vi: "Vậy tiếp theo làm gì? Tối nay mình có thể làm lại slide." },
        { who: "Tom", voice: "us-nam", text: "Great. I'll get in touch with the students' union. They ran a wellbeing survey last year, and if they share their figures, we can compare. I don't think we need any more research articles — we've got plenty.", vi: "Tuyệt. Mình sẽ liên hệ hội sinh viên. Năm ngoái họ làm một khảo sát về sức khoẻ tinh thần, nếu họ chia sẻ số liệu thì mình có thể so sánh. Mình nghĩ không cần thêm bài nghiên cứu nào nữa — mình có nhiều rồi." },
        { who: "Mia", voice: "uk-nu", text: "OK. Now, let's go through the presentation section by section. The introduction is nearly three minutes at the moment.", vi: "Được. Giờ mình đi qua bài thuyết trình từng phần nhé. Phần mở đầu hiện dài gần ba phút." },
        { who: "Tom", voice: "us-nam", text: "That's far too long. We only have ten minutes in total. Let's keep the main idea but cut it to one minute.", vi: "Thế là quá dài. Tổng cộng mình chỉ có mười phút. Giữ ý chính nhưng cắt còn một phút thôi." },
        { who: "Mia", voice: "uk-nu", text: "Agreed. Then there's the part about how we designed the survey — how we chose the questions, the software, and so on.", vi: "Đồng ý. Rồi đến phần mình thiết kế khảo sát thế nào — chọn câu hỏi ra sao, phần mềm gì, vân vân." },
        { who: "Tom", voice: "us-nam", text: "Honestly, I don't think the audience needs that at all. If anyone asks, we can explain at the end. Let's drop it completely.", vi: "Thật lòng mình nghĩ khán giả không cần phần đó. Nếu ai hỏi, cuối buổi mình giải thích. Bỏ hẳn đi." },
        { who: "Mia", voice: "uk-nu", text: "Fine by me. The results section is just a list of numbers, though. It's quite hard to follow.", vi: "Mình đồng ý. Nhưng phần kết quả chỉ là một danh sách con số. Khá khó theo dõi." },
        { who: "Tom", voice: "us-nam", text: "We don't need to cut anything there — we just need to show it visually. A simple bar chart comparing the groups would make it much clearer.", vi: "Phần đó không cần cắt gì — chỉ cần trình bày bằng hình. Một biểu đồ cột đơn giản so sánh các nhóm sẽ rõ hơn nhiều." },
        { who: "Mia", voice: "uk-nu", text: "Good idea. And the interview quotes? Right now they're in the middle.", vi: "Ý hay. Còn các câu trích từ phỏng vấn? Hiện chúng đang ở giữa bài." },
        { who: "Tom", voice: "us-nam", text: "They're the most memorable part. What if we finish with them instead? Ending with a real student's words would be really powerful.", vi: "Đó là phần đáng nhớ nhất. Hay là mình kết thúc bằng chúng? Kết bằng lời của một sinh viên thật sẽ rất ấn tượng." },
        { who: "Mia", voice: "uk-nu", text: "Yes, let's put them at the end. And finally, the recommendations. Should we ask Lily to present those? She's very confident.", vi: "Ừ, đưa xuống cuối. Và cuối cùng là phần khuyến nghị. Có nên nhờ Lily trình bày phần đó không? Bạn ấy rất tự tin." },
        { who: "Tom", voice: "us-nam", text: "She's not in our group, though, and I think the section works well. It's clear and it's the right length. Let's not change anything there.", vi: "Nhưng bạn ấy không ở nhóm mình, và mình thấy phần đó ổn rồi. Rõ ràng và độ dài vừa phải. Đừng thay đổi gì ở đó." },
        { who: "Mia", voice: "uk-nu", text: "OK, so the recommendations stay exactly as they are. Great — I think we're nearly ready.", vi: "Được, vậy phần khuyến nghị giữ nguyên như cũ. Tuyệt — mình nghĩ sắp xong rồi." },
      ],
    },
    {
      t: "quiz",
      id: "t2d23-de-p3-hai",
      title: "Questions 21–22 — Choose TWO letters, A–E (gõ HAI chữ cái vào một ô, thứ tự nào cũng được — vd AC)",
      kind: "fill",
      items: [
        { q: "(21–22) Two problems with the survey (write two letters): ___", answers: ["BE", "EB", "B E", "E B", "B, E", "E, B", "B,E", "E,B", "B and E", "E and B", "B & E", "E & B", "B - E", "E - B", "B/E", "E/B"], hint: "hai chữ cái KHÁC nhau · ô này tính 2 điểm" },
      ],
    },
    {
      t: "mcq",
      id: "t2d23-de-p3-chon",
      title: "Questions 23–25",
      items: [
        { q: "(23) Why did they choose sleep as their topic?", options: ["Their tutor said it was popular.", "They both slept badly in their first term.", "There is a lot of research on first-year students."], correct: 1, why: "“Dr Lewis did say sleep is a popular topic, **but that's not the real reason**… we both had **terrible sleep in our first term**”. C ngược: “there **isn't** actually much research on first-year students”." },
        { q: "(24) What surprised them most in the results?", options: ["the average number of hours slept", "how many students used phones in bed", "how students with part-time jobs slept"], correct: 2, why: "6.2 giờ = “**about what we expected**”; điện thoại = “**everybody knows**”; “the **real surprise** was the students with **part-time jobs**… they actually slept more”." },
        { q: "(25) What will Tom do next?", options: ["contact the students' union", "redesign the slides", "look for more research"], correct: 0, why: "“**I'll get in touch with the students' union**.” Slide là việc của **Mia**; “I don't think we need **any more research** articles”." },
      ],
    },
    {
      t: "quiz",
      id: "t2d23-de-p3-noi",
      title: "Questions 26–30 — viết chữ cái A–F",
      kind: "fill",
      items: [
        { q: "(26) Introduction", answers: ["A"], hint: "ba phút → một phút" },
        { q: "(27) How the survey was designed", answers: ["E"], hint: "drop it completely" },
        { q: "(28) Survey results", answers: ["B"], hint: "show it visually" },
        { q: "(29) Quotes from interviews", answers: ["C"], hint: "finish with them" },
        { q: "(30) Recommendations", answers: ["D"], hint: "let's not change anything" },
      ],
    },
    {
      t: "note",
      title: "Giải thích Part 3",
      items: [
        "**(21–22) B, E** — B: câu sáu về screen time “some people counted watching TV, and some only counted their phones” = understood in different ways. E: “a few **silly answers**… twenty hours a night”. Ba phương án còn lại đều bị **phủ nhận**: A “more than enough”, C “quick… five minutes”, D “worked perfectly… didn't crash”.",
        "**(26) A** — “keep the main idea but **cut it to one minute**” = make it shorter (không phải bỏ). **(27) E** — “**drop it completely**” = remove it.",
        "**(28) B** — “We **don't need to cut anything**… **A simple bar chart**”. **(29) C** — “What if we **finish with them**… put them **at the end**”.",
        "**(30) D** — Bẫy **F** (nhờ Lily): “She's **not in our group**… **Let's not change anything** there” = keep it as it is.",
      ],
    },

    /* ── PART 4 ── */
    { t: "h", text: "PART 4 — Questions 31–40: Bamboo as a building material" },
    {
      t: "canh",
      anh: ["tanabata-tree", "building-construction", "bug", "office-building"],
      caption: "Bài giảng trong môn Vật liệu xây dựng: cây tre — loài cỏ mọc nhanh nhất thế giới — có thể thành vật liệu xây dựng của tương lai không?",
    },
    {
      t: "table",
      caption: "Questions 31–40 — Complete the notes below. Write ONE WORD ONLY for each answer.",
      head: ["Phần", "Ghi chú"],
      rows: [
        ["Biology", "• bamboo is actually a type of **(31) ______** · • some species grow almost one **(32) ______** in a day · • ready to harvest after three to five **(33) ______**"],
        ["Strength", "• when pulled, as strong as some types of **(34) ______** · • light and flexible, so useful in areas with earthquakes"],
        ["Problems", "• contains sugar, so easily attacked by **(35) ______** · • traditional treatment: poles soaked in a **(36) ______** for several weeks · • every pole has a slightly different **(37) ______**, which makes design difficult"],
        ["Uses today", "• Hong Kong: used for **(38) ______**, even on skyscrapers · • 2000: a large bamboo **(39) ______** built for an international exhibition"],
        ["The future", "• engineered bamboo: thin strips glued together into **(40) ______**"],
      ],
    },
    {
      t: "listen",
      id: "t2d23-nghe-p4",
      title: "Bamboo as a building material",
      dan: { so: "Day 23, Part 4", boiCanh: "part of a lecture about building materials.", cau: [31, 40] },
      note: "Khoảng 5 phút, giọng Anh-Anh, không nghỉ giữa.",
      lines: [
        { who: "Lecturer", voice: "uk-nu", text: "Good morning. In this series, we've been looking at materials that could make construction more sustainable, and today it's the turn of bamboo. In many parts of Asia, people have built with bamboo for thousands of years, but in Europe and North America it's still seen as a cheap or temporary material. I'd like to show you why that view may be changing.", vi: "Chào buổi sáng. Trong loạt bài này, ta đã tìm hiểu những vật liệu có thể làm ngành xây dựng bền vững hơn, và hôm nay đến lượt cây tre. Ở nhiều nơi tại châu Á, người ta xây bằng tre hàng nghìn năm, nhưng ở châu Âu và Bắc Mỹ nó vẫn bị coi là vật liệu rẻ tiền hoặc tạm bợ. Tôi muốn cho các bạn thấy vì sao quan niệm đó có thể đang thay đổi." },
        { who: "Lecturer", voice: "uk-nu", text: "Let's start with the biology. Although it looks like a tree, bamboo is actually a grass, and it's the fastest-growing plant in the world. Some species can grow almost one metre in a single day. That means it can be harvested very quickly: a bamboo plant is ready after three to five years, compared with twenty to fifty years for most trees used for timber. And when you cut it, it doesn't die — new stems grow from the same roots.", vi: "Hãy bắt đầu với sinh học. Dù trông như cây gỗ, tre thật ra là một loài cỏ, và là loài cây mọc nhanh nhất thế giới. Một số loài có thể mọc gần một mét chỉ trong một ngày. Nghĩa là có thể thu hoạch rất nhanh: một cây tre sẵn sàng sau ba đến năm năm, so với hai mươi đến năm mươi năm của hầu hết các loại cây lấy gỗ. Và khi chặt, nó không chết — thân mới mọc lên từ chính bộ rễ đó." },
        { who: "Lecturer", voice: "uk-nu", text: "What about strength? When engineers test bamboo by pulling it, which is called tension, some types turn out to be as strong as certain kinds of steel. It's also light and flexible, so instead of breaking, it bends. This is why bamboo houses often survive earthquakes that destroy concrete buildings nearby.", vi: "Còn độ bền thì sao? Khi kỹ sư thử tre bằng cách kéo, gọi là chịu kéo, một số loại hoá ra bền ngang một số loại thép. Nó còn nhẹ và dẻo, nên thay vì gãy, nó uốn cong. Đó là lý do nhà tre thường trụ được qua những trận động đất phá huỷ các toà nhà bê tông gần đó." },
        { who: "Lecturer", voice: "uk-nu", text: "So why isn't everyone using it? There are three main problems. The first is that bamboo contains a lot of sugar, which makes it very attractive to insects. Fungi can also cause damage in wet climates, but insects are by far the bigger problem. Today, poles are usually treated with chemicals, but the traditional method was much simpler: the poles were soaked in a river for several weeks, which washed the sugar out.", vi: "Vậy sao không phải ai cũng dùng? Có ba vấn đề chính. Thứ nhất là tre chứa nhiều đường, khiến nó rất hấp dẫn côn trùng. Nấm cũng có thể gây hại ở vùng khí hậu ẩm, nhưng côn trùng là vấn đề lớn hơn nhiều. Ngày nay cây tre thường được xử lý bằng hoá chất, nhưng cách truyền thống đơn giản hơn nhiều: cây được ngâm dưới sông vài tuần, để rửa trôi đường đi." },
        { who: "Lecturer", voice: "uk-nu", text: "The second problem is for engineers. A steel beam can be made exactly the same every time, but bamboo is natural, so every pole has a slightly different diameter. That makes it very difficult to calculate how much weight a structure can safely carry, and so many countries still have no official building rules for bamboo.", vi: "Vấn đề thứ hai là với kỹ sư. Một dầm thép có thể làm y hệt nhau mọi lần, nhưng tre là vật liệu tự nhiên, nên mỗi cây có đường kính hơi khác nhau. Điều đó khiến rất khó tính một công trình chịu được bao nhiêu tải trọng an toàn, nên nhiều nước vẫn chưa có quy chuẩn xây dựng chính thức cho tre." },
        { who: "Lecturer", voice: "uk-nu", text: "Even so, bamboo is already doing some remarkable jobs. In Hong Kong, it has been used for generations for scaffolding — the temporary frames that workers stand on — even on very tall skyscrapers. And in 2000, a Colombian architect built a huge pavilion made almost entirely of bamboo for an international exhibition in Germany, which showed that it could be used for large, permanent-looking structures.", vi: "Dù vậy, tre đã và đang làm những việc đáng nể. Ở Hồng Kông, qua nhiều thế hệ tre được dùng làm giàn giáo — những khung tạm để công nhân đứng — kể cả trên những toà nhà chọc trời rất cao. Và năm 2000, một kiến trúc sư người Colombia đã dựng một gian triển lãm khổng lồ gần như hoàn toàn bằng tre cho một hội chợ quốc tế ở Đức, cho thấy tre có thể dùng cho những công trình lớn, trông như vĩnh cửu." },
        { who: "Lecturer", voice: "uk-nu", text: "Finally, the future. The most promising development is what's called engineered bamboo. The poles are cut into thin strips, which are then glued and pressed together into flat panels. Because they're made in a factory, these panels are all the same size and strength, which solves the problem I mentioned earlier. In the next lecture, we'll look at how they're tested.", vi: "Cuối cùng là tương lai. Bước phát triển hứa hẹn nhất là cái gọi là tre kỹ thuật. Cây tre được xẻ thành những thanh mỏng, rồi dán và ép lại thành các tấm phẳng. Vì được làm trong nhà máy, các tấm này đều cùng kích thước và độ bền, giải quyết đúng vấn đề tôi nói lúc nãy. Bài giảng tới, ta sẽ xem chúng được thử nghiệm thế nào." },
      ],
    },
    {
      t: "quiz",
      id: "t2d23-de-p4",
      title: "Questions 31–40 — ONE WORD ONLY",
      kind: "fill",
      items: [
        { q: "(31) bamboo is actually a type of ___", answers: ["grass"], hint: "a type of + danh từ" },
        { q: "(32) some species grow almost one ___ in a day", answers: ["metre", "meter"], hint: "đơn vị đo" },
        { q: "(33) ready to harvest after three to five ___", answers: ["years"], hint: "số nhiều — thời gian" },
        { q: "(34) when pulled, as strong as some types of ___", answers: ["steel"], hint: "một vật liệu" },
        { q: "(35) contains sugar, so easily attacked by ___", answers: ["insects"], hint: "số nhiều" },
        { q: "(36) traditional treatment: poles soaked in a ___ for several weeks", answers: ["river"], hint: "a + nơi có nước" },
        { q: "(37) every pole has a slightly different ___", answers: ["diameter"], hint: "một kích thước" },
        { q: "(38) Hong Kong: used for ___, even on skyscrapers", answers: ["scaffolding"], hint: "danh từ không đếm" },
        { q: "(39) a large bamboo ___ built for an international exhibition", answers: ["pavilion"], hint: "a + công trình" },
        { q: "(40) thin strips glued together into ___", answers: ["panels"], hint: "số nhiều" },
      ],
    },
    {
      t: "note",
      title: "Giải thích Part 4",
      items: [
        "**(31) grass** — “Although it **looks like a tree**, bamboo is actually **a grass**” — bẫy **tree**.",
        "**(32) metre** — “almost **one metre** in a single day”. **(33) years** — “ready **after three to five years**” (20–50 years là của cây gỗ).",
        "**(34) steel** — “as strong as certain kinds of **steel**” (some types = certain kinds). Bẫy **concrete** ở câu sau.",
        "**(35) insects** — Bẫy **fungi**: “Fungi can also cause damage… **but insects are by far the bigger problem**”.",
        "**(36) river** — Bẫy **chemicals** (cách **ngày nay**): ghi chú hỏi cách **truyền thống** → “soaked in **a river**”.",
        "**(37) diameter** — “every pole has a slightly different **diameter**” — chính tả: di-**am**-e-ter. **(38) scaffolding** — có giải thích ngay sau (the temporary frames…).",
        "**(39) pavilion** — chính tả: pa-**vil**-ion. **(40) panels** — “glued and pressed together into flat **panels**” (số nhiều).",
      ],
    },

    /* ── Chấm ── */
    { t: "h", text: "Chấm điểm và đổi ra band" },
    {
      t: "note",
      title: "Cách cộng điểm /40 — nhớ câu 21–22",
      items: [
        "Mỗi câu đúng = **1 điểm**, tổng **40**. Trên trang này có **39 ô**: riêng **câu 21–22 (Choose TWO)** gộp thành **một ô nhận hai chữ cái** nhưng vẫn là **2 điểm** như đề thật.",
        "Ô 21–22 báo đúng (**B** và **E**) → cộng **2 điểm**. Ô báo sai nhưng bạn có **một** trong hai chữ B / E → tự cộng **1 điểm**. Gõ một chữ hai lần (BB, EE) không được điểm thứ hai.",
        "Điểm /40 = số ô đúng + 1 (nếu ô 21–22 đúng). Điểm Part 3 /10 cũng tính theo cách này.",
      ],
    },
    {
      t: "table",
      caption: "Điểm thô /40 → band Listening (bảng quy đổi phổ biến — cùng bảng với Online Test)",
      head: ["Điểm /40", "Band", "Ghi chú"],
      rows: [
        ["10–12", "4.0", "mức cuối Tập 1"],
        ["13–15", "4.5", "giữa Tập 2"],
        ["16–17", "**5.0**", "**đích cuối Tập 2**"],
        ["18–22", "5.5", "vượt đích"],
        ["23–25", "6.0", "đích cuối Tập 3"],
        ["26–29", "6.5", ""],
        ["30–31", "7.0", ""],
      ],
    },
    {
      t: "table",
      caption: "Phân tích theo Part — tự điền số câu đúng",
      head: ["Part", "Dạng", "Đúng / 10", "Nếu < 6 thì ôn"],
      rows: [
        ["1", "Form completion", "…", "Tập 2 Ngày 1 (Form), Ngày 3 (số, ngày, địa chỉ) · chú ý bẫy sửa lời"],
        ["2", "MCQ + Map", "…", "Tập 2 Ngày 7 (Map, ngôn ngữ vị trí), Ngày 11 (từ báo hiệu)"],
        ["3", "Choose TWO + MCQ + Matching", "…", "Tập 2 Ngày 13 (Part 3), Ngày 21 (đề nhỏ Part 3+4)"],
        ["4", "Note completion", "…", "Tập 2 Ngày 19 (Part 4), Ngày 21"],
      ],
    },
    {
      t: "note",
      title: "Sau khi chấm — luyện lại cho đáng",
      items: [
        "Mở lời thoại, nghe lại **từng Part** và gạch chân câu chứa đáp án — đáp án nào bạn sai vì **paraphrase**, vì **bẫy đổi ý**, hay vì **chính tả**? Ghi vào sổ lỗi theo loại (Ngày 21, mục 4).",
        "Làm lại **chỉ Part kém nhất** sau 2 ngày (không nhìn đáp án). Mục tiêu trước Đề 3: Part 1 ≥ 7 · Part 2 ≥ 5 · Part 3 + 4 ≥ 5.",
        "Đề 3 trên phòng thi máy **không cho tua** và tính giờ thật — đó là lần đo chính thức của Tập 2.",
      ],
    },
  ],
};

/* ─────────────────────────── Bài 3 · Nói ─────────────────────────── */

const T2D23_SPEAKING: Lesson = {
  id: "t2d23-noi",
  kind: "speaking",
  title: "Part 2 đề trừu tượng + giám khảo AI 11 phút",
  goal: "Nói đủ 2 phút một đề Part 2 trừu tượng (một quy định, một lời khuyên, một quyết định…) bằng cách biến ý trừu tượng thành một cảnh cụ thể; rồi làm bài thi nói đủ 3 Part (~11 phút) với giám khảo AI lần đầu và đọc phản hồi theo 4 tiêu chí (Speaking band 5).",
  minutes: 70,
  blocks: [
    {
      t: "recap",
      title: "Bài này học gì — đẩy band nào",
      items: [
        "Part 2 có **6 loại đề**: người (Ngày 3) · nơi (7) · đồ vật (11) · sự kiện (15) · hoạt động (19) · **trừu tượng** (hôm nay) — đủ cả 6 loại là đủ hành trang cho Đề 3.",
        "Đề **trừu tượng** khó vì không có gì để “tả”: a rule, a piece of advice, a decision, a change, a goal… Cách giải: **gắn ý trừu tượng vào MỘT cảnh cụ thể** (ai, ở đâu, lúc nào, chuyện gì xảy ra).",
        "Ngữ pháp đề quy định: **have to / mustn't / be (not) allowed to** cho luật, **quá khứ** cho câu chuyện, **should / I think it would be better if** cho đề xuất.",
        "**Giám khảo AI lần đầu**: thi đủ Part 1 → Part 2 → Part 3 (~11 phút) trong phòng thi nói, AI chấm **FC · LR · GRA · P** và chỉ ra câu sửa.",
        "🔊 **Nối âm phụ âm – nguyên âm**: turn it off → /tɜː nɪ tɒf/ — nói liền mạch, nghe trôi chảy hơn (FC + P).",
      ],
    },

    /* ── 1 ── */
    { t: "h", text: "1. Sáu loại đề Part 2 — nhìn lại cả Tập 2" },
    {
      t: "table",
      caption: "Bạn đã luyện 6 loại — chuẩn bị sẵn một câu chuyện “gốc” cho mỗi loại",
      head: ["Loại đề", "Ngày học", "Ví dụ thẻ đề", "Thì chính"],
      rows: [
        ["Người", "Ngày 3", "Describe a person who has influenced you", "hiện tại + quá khứ"],
        ["Nơi chốn", "Ngày 7", "Describe a place you would like to visit", "hiện tại / tương lai"],
        ["Đồ vật", "Ngày 11", "Describe an object that is important to you", "hiện tại + quá khứ (lúc có nó)"],
        ["Sự kiện", "Ngày 15", "Describe a celebration you attended", "quá khứ"],
        ["Hoạt động", "Ngày 19", "Describe an activity you enjoy", "hiện tại + HTHT"],
        ["**Trừu tượng**", "**Ngày 23**", "**Describe a rule you disliked / a piece of advice / an important decision**", "**hiện tại (luật) + quá khứ (chuyện)**"],
      ],
    },

    /* ── 2 ── */
    { t: "h", text: "2. Đề trừu tượng — biến ý thành cảnh" },
    {
      t: "sodo",
      kind: "compare",
      title: "Cách nói band 4 và band 5–6 cho cùng một thẻ đề “a rule”",
      caption: "Part 2 hỏi về TRẢI NGHIỆM CỦA BẠN. Nói chung chung về xã hội là việc của Part 3.",
      cols: [
        {
          title: "Band 4 — nói về “rules” nói chung",
          anh: "thinking-face",
          items: [
            "“Rules are very important in society. Without rules, people do bad things…”",
            "Không có người, không có nơi, không có chuyện → hết ý sau 40 giây.",
            "Giám khảo nghe như bài học thuộc.",
          ],
        },
        {
          title: "Band 5–6 — một luật cụ thể, một cảnh cụ thể",
          anh: "mobile-phone-off",
          items: [
            "“At my high school, we had to hand in our phones at the gate every morning.”",
            "Có nơi (cổng trường), người (cô chủ nhiệm), chuyện (hôm mẹ ốm).",
            "Lý do + đề xuất → đủ 2 phút tự nhiên.",
          ],
        },
      ],
    },
    {
      t: "sodo",
      kind: "flow",
      title: "Khung 4 phần cho đề “a rule you dislike(d)”",
      steps: [
        { label: "1 · Luật là gì (20″)", sub: "At my school / workplace, we **had to** … / we **weren't allowed to** …" },
        { label: "2 · Áp dụng ở đâu, với ai, vì sao có luật (30″)", sub: "The rule was introduced because … / It applied to …" },
        { label: "3 · MỘT lần luật đó ảnh hưởng tới bạn (40″)", sub: "I still remember one day when … — câu chuyện quá khứ." },
        { label: "4 · Vì sao không thích + nên sửa thế nào (30″)", sub: "I disliked it because … · I think it would be fairer if … / They **should** …" },
      ],
    },
    {
      t: "table",
      caption: "Ngôn ngữ cho đề quy định",
      head: ["Muốn nói", "Câu mẫu"],
      rows: [
        ["Bắt buộc", "We **had to** hand in our phones. / Everyone **was required to** wear a uniform."],
        ["Cấm", "We **weren't allowed to** use our phones. / Students **mustn't** leave early. (hiện tại)"],
        ["Mục đích của luật", "The rule was introduced **to** stop students from … / **so that** teachers could …"],
        ["Không thích", "What I disliked most was that … / It seemed **rather unfair**, because …"],
        ["Đề xuất", "In my opinion, the school **should** … / It would be **fairer if** students **could** keep their phones in their bags."],
        ["Kết", "Looking back, I understand why … but I still think …"],
      ],
    },
    {
      t: "rule",
      formula: "At …, we had to / weren't allowed to + V. · The rule was introduced to + V. · I still remember one day when … · I disliked it because … · They should + V / It would be fairer if …",
      vi: "Khung câu đề quy định: luật (quá khứ) → mục đích → một lần cụ thể → lý do không thích → đề xuất.",
    },

    /* ── 3 ── */
    { t: "h", text: "3. Ghi chú 1 phút và bài nói mẫu" },
    {
      t: "p",
      text: "**Describe a rule at school or at work that you disliked.** You should say: **what** the rule was · **who** made the rule · **how** it affected you · and **explain why** you disliked it.",
    },
    {
      t: "sodo",
      kind: "mindmap",
      title: "Ghi chú mẫu — nộp điện thoại ở cổng trường",
      center: "**Phone rule — high school**",
      branches: [
        { label: "What", items: ["hand in phones at gate", "7 a.m. → 5 p.m.", "box with class number"], anh: "mobile-phone-off" },
        { label: "Who made it", items: ["head teacher, Grade 11", "after cheating in exam"], anh: "teacher" },
        { label: "How it affected me", items: ["mum ill — couldn't call", "found out at 5 p.m."], anh: "telephone-receiver" },
        { label: "Why disliked", items: ["emergencies", "learning apps", "treated like children"], anh: "frowning-face" },
        { label: "Better", items: ["phones in bags, switched off", "teacher decides"], anh: "light-bulb" },
      ],
    },
    {
      t: "canh",
      anh: ["school", "mobile-phone-off", "woman-teacher", "pensive-face"],
      caption: "Năm lớp 11, mỗi sáng học sinh phải bỏ điện thoại vào một chiếc hộp ở cổng trường — cho tới một ngày mẹ của Lan bị ốm.",
    },
    {
      t: "dialogue",
      title: "Part 2 — Describe a rule you disliked (≈ 2 phút)",
      lines: [
        { who: "Examiner", role: "examiner", text: "Here's your topic: describe a rule at school or at work that you disliked. You have one minute to prepare." },
        { who: "Candidate", role: "candidate", text: "I'd like to talk about a rule at my high school that I really didn't like. When I was in Grade 11, all students had to hand in their mobile phones at the school gate every morning. There was a big plastic box for each class, and we weren't allowed to take our phones back until five in the afternoon.", vi: "Tôi muốn kể về một quy định ở trường cấp ba mà tôi thật sự không thích. Năm lớp 11, mọi học sinh phải nộp điện thoại ở cổng trường mỗi sáng. Mỗi lớp có một hộp nhựa lớn, và chúng tôi không được lấy lại điện thoại cho tới năm giờ chiều." },
        { who: "Candidate", role: "candidate", text: "The rule was made by our head teacher. A few months earlier, some students had used their phones to cheat in an exam, so she introduced the rule to stop that from happening again. I could understand her reasons, at least at the beginning.", vi: "Quy định do cô hiệu trưởng đặt ra. Vài tháng trước đó, một số học sinh đã dùng điện thoại để gian lận trong kỳ thi, nên cô đưa ra quy định để ngăn chuyện đó lặp lại. Ít nhất là lúc đầu, tôi hiểu lý do của cô." },
        { who: "Candidate", role: "candidate", text: "But I still remember one day when it really affected me. My mother was ill at home, and she tried to call me at lunchtime because she needed me to buy some medicine on the way home. Of course, my phone was locked in the box, so I didn't find out until five o'clock. By then, the pharmacy near our house was already closed, and I felt terrible.", vi: "Nhưng tôi vẫn nhớ một ngày nó thật sự ảnh hưởng đến tôi. Mẹ tôi ốm ở nhà, và mẹ gọi cho tôi lúc trưa vì cần tôi mua thuốc trên đường về. Dĩ nhiên điện thoại của tôi bị khoá trong hộp, nên tới năm giờ tôi mới biết. Lúc đó hiệu thuốc gần nhà đã đóng cửa, và tôi thấy rất tệ." },
        { who: "Candidate", role: "candidate", text: "I disliked the rule for two reasons. Firstly, it was rather unfair, because it punished everyone for something that only a few students had done. Secondly, it made emergencies like mine much harder to deal with. In my opinion, it would have been fairer if we had been allowed to keep our phones in our bags, switched off, and teachers had decided when we could use them — for example, for learning apps. Looking back, I understand why the school was worried, but I still think there was a better solution.", vi: "Tôi không thích quy định vì hai lý do. Thứ nhất, nó khá bất công, vì nó phạt tất cả mọi người vì việc chỉ vài học sinh làm. Thứ hai, nó khiến những tình huống khẩn cấp như của tôi khó xử lý hơn nhiều. Theo tôi, sẽ công bằng hơn nếu chúng tôi được để điện thoại trong cặp, tắt nguồn, và giáo viên quyết định khi nào được dùng — ví dụ cho ứng dụng học tập. Nhìn lại, tôi hiểu vì sao nhà trường lo lắng, nhưng tôi vẫn nghĩ đã có cách tốt hơn." },
      ],
    },
    {
      t: "table",
      caption: "Vì sao bài mẫu đạt band 5.5–6",
      head: ["Tiêu chí", "Bài mẫu làm gì"],
      rows: [
        ["**FC**", "Đủ 4 phần theo thẻ; chuyển ý rõ: **But I still remember one day when… · I disliked the rule for two reasons. Firstly… Secondly… · Looking back…**"],
        ["**LR**", "hand in, weren't allowed to, introduced the rule, cheat in an exam, locked in the box, pharmacy, punished everyone, emergencies, deal with, switched off."],
        ["**GRA**", "Bắt buộc / cấm ở quá khứ (**had to, weren't allowed to**); quá khứ hoàn thành **had used / had done** (nhận ra là đủ); **didn't find out until**; câu phức **because / so / By then**; **it would have been fairer if…** dùng như một cụm cố định."],
        ["**P**", "Nối âm: hand‿in, found‿out‿at, locked‿in; nhấn từ mang nghĩa (really, terrible, unfair); xuống giọng cuối câu kể."],
        ["**Trả lời đủ thẻ**", "what ✓ · who made it ✓ (head teacher) · how it affected you ✓ (ngày mẹ ốm) · why disliked ✓ (unfair + emergencies) + đề xuất."],
      ],
    },
    {
      t: "note",
      title: "Cẩn thận: ba lỗi riêng của đề trừu tượng",
      items: [
        "**Nói như Part 3** (rules in society, rules are necessary…) → lạc đề Part 2. Luôn có **“I / my / at my school”** ở câu đầu.",
        "**Quên phần “how it affected you”** — đó chính là câu chuyện, phần dễ kéo dài nhất.",
        "**Chọn luật quá nhỏ** (“no running in the corridor”) → không có gì để kể. Chọn luật **có hệ quả thật** với bạn.",
      ],
    },
    {
      t: "table",
      caption: "Các thẻ đề trừu tượng khác — dùng cùng kỹ thuật “một cảnh cụ thể”",
      head: ["Thẻ đề", "Cảnh cụ thể gợi ý"],
      rows: [
        ["Describe a piece of good advice you received", "Lời khuyên của ai, lúc bạn đang gặp chuyện gì, bạn đã làm theo và kết quả ra sao"],
        ["Describe an important decision you made", "Chọn ngành / chọn trường / chuyển nhà — lúc đó phân vân thế nào, ai giúp"],
        ["Describe a change you would like to make in your town", "Một con phố cụ thể, một vấn đề bạn gặp hằng ngày, đề xuất would / should"],
        ["Describe a goal you want to achieve", "IELTS 6.5 để du học — vì sao, kế hoạch (be going to), khó khăn"],
      ],
    },

    /* ── 4 ── */
    { t: "h", text: "4. Thêm: nối âm phụ âm – nguyên âm" },
    {
      t: "p",
      text: "**Linking** (nối âm): khi một từ **kết thúc bằng phụ âm** và từ sau **bắt đầu bằng nguyên âm**, người bản ngữ **kéo phụ âm sang** từ sau, nói liền không ngắt: **turn it off** → /tɜː nɪ tɒf/ · **an apple** → /ə næpl/ · **pick it up** → /pɪ kɪ tʌp/. Người Việt quen tách rời từng chữ (vì tiếng Việt mỗi chữ một âm tiết) → nghe cứng và chậm. Nối âm không làm bạn “nói nhanh” hơn — nó làm bạn nói **liền** hơn, và giúp **nghe** Listening dễ hơn.",
    },
    {
      t: "examples",
      items: [
        { en: "We had to hand in our phones.", vi: "hand‿in‿our → /hæn dɪ naʊə/" },
        { en: "It was an awful rule.", vi: "was‿an‿awful → /wə zə nɔːfl/" },
        { en: "I still remember it clearly.", vi: "remember‿it → âm /r/ nối (giọng Anh) /rɪmembə rɪt/ — gặp lại ở Tập 3" },
      ],
    },
    {
      t: "phatam",
      id: "t2d23-phat-am",
      title: "Luyện phát âm — nối phụ âm cuối với nguyên âm đầu",
      note: "Bấm “Nghe mẫu”, rồi “Đọc & chấm”. Đừng ngắt giữa các từ có dấu ‿ trong đầu bạn: phụ âm cuối “trượt” sang nguyên âm của từ sau.",
      items: [
        { text: "an apple", ipa: "ən æpl", vi: "a‿napple" },
        { text: "turn it off", ipa: "tɜːn ɪt ɒf", vi: "tur‿ni‿toff" },
        { text: "pick it up", ipa: "pɪk ɪt ʌp", vi: "pi‿ki‿tup" },
        { text: "Not at all.", ipa: "nɒt ət ɔːl", vi: "no‿ta‿tall" },
        { text: "Can I ask a question?", ipa: "kən aɪ ɑːsk ə kwestʃən", vi: "ca‿nI‿as‿ka" },
        { text: "We had to hand in our phones.", ipa: "wi hæd tə hænd ɪn aʊə fəʊnz", vi: "han‿din‿our" },
        { text: "It was an awful rule.", ipa: "ɪt wəz ən ɔːfl ruːl", vi: "wa‿za‿nawful" },
        { text: "I found out at five o'clock.", ipa: "aɪ faʊnd aʊt ət faɪv əklɒk", vi: "foun‿dout‿at · five‿o'clock" },
      ],
    },

    /* ── 5 ── */
    { t: "h", text: "5. Luyện đề trừu tượng (ghi âm trong bài)" },
    {
      t: "speak",
      id: "t2d23-noi-p2",
      part: "2",
      questions: [
        "Describe a rule at school or at work that you disliked. You should say: what the rule was; who made the rule; how it affected you; and explain why you disliked it.",
        "Describe a piece of good advice that someone gave you. You should say: who gave you the advice; what the advice was; what you did after receiving it; and explain why it was good advice.",
        "Describe a change you would like to make in your local area. You should say: what the change is; where it would happen; how it would help people; and explain why you think it is important.",
      ],
    },
    {
      t: "speak",
      id: "t2d23-noi-p3",
      part: "3",
      questions: [
        "Why do schools have so many rules?",
        "Should students be allowed to help make school rules?",
        "Are people today more likely to break rules than in the past?",
        "What rules should parents set for teenagers at home?",
      ],
    },

    /* ── 6 ── */
    { t: "h", text: "6. Giám khảo AI — bài thi nói đủ 11 phút lần đầu" },
    {
      t: "p",
      text: "Đến lúc ghép ba Part lại thành **một bài thi nói thật**. Khoá có **Phòng thi Speaking** với **giám khảo AI**: giám khảo (giọng Anh) chào, hỏi tên, hỏi **Part 1** theo chủ đề, đưa **thẻ đề Part 2** (1 phút chuẩn bị có ô ghi chú, nói tối đa 2 phút, hết giờ thì dừng lịch sự), hỏi 1–2 câu chốt, rồi **Part 3**. Xong cả bài, AI chấm **FC · LR · GRA · P**, cho bạn nghe lại từng câu, xem chữ, lỗi + câu sửa và cách nói band +1.",
    },
    {
      t: "table",
      caption: "Một bài thi nói 11–14 phút gồm gì",
      head: ["Phần", "Thời lượng", "Giám khảo làm gì", "Bạn cần"],
      rows: [
        ["Giới thiệu", "~30″", "Chào, hỏi tên", "Trả lời ngắn, tự nhiên"],
        ["**Part 1**", "4–5 phút", "2–3 chủ đề quen thuộc, mỗi chủ đề 3–4 câu", "Trả lời + lý do + ví dụ (2–4 câu mỗi câu hỏi)"],
        ["**Part 2**", "3–4 phút", "Đưa thẻ đề; 1 phút chuẩn bị; nghe bạn nói 1–2 phút; 1–2 câu chốt", "Nói đủ 2 phút theo khung 4 phần"],
        ["**Part 3**", "4–5 phút", "Câu hỏi chung, trừu tượng liên quan đề Part 2", "Ý kiến → lý do → ví dụ; so sánh xưa – nay (Ngày 21)"],
      ],
    },
    {
      t: "sodo",
      kind: "flow",
      title: "Các bước làm bài với giám khảo AI",
      caption: "Mở phòng thi nói: `/language/en/ielts/thi-may/noi?de=noi-de1&che=luyen` (chế độ LUYỆN) — sau đó thi lại ở chế độ THI: `/language/en/ielts/thi-may/noi?de=noi-de1`. Cũng vào được từ trang khoá → 🖥️ Online Test → Speaking.",
      steps: [
        { label: "1 · Kiểm micro", sub: "Phòng thi thu thử 3 giây rồi phát lại, đo âm lượng. Ngồi chỗ yên tĩnh, đeo tai nghe có mic nếu được." },
        { label: "2 · Chế độ LUYỆN trước", sub: "Sau mỗi câu, phòng dừng lại: nghe lại, xem chữ, xem câu mẫu, nói lại. Làm quen với nhịp hỏi – đáp." },
        { label: "3 · Chế độ THI sau", sub: "Chạy liền 11–14 phút, không quay lại — micro tự bật khi giám khảo hỏi xong, tự tắt khi bạn im. Im 20 giây → giám khảo nhắc rồi chuyển câu." },
        { label: "4 · Đọc phản hồi", sub: "Band 4 tiêu chí + nhận xét; nghe lại từng câu; chép 3 lỗi + câu sửa vào sổ." },
        { label: "5 · Ghi kết quả", sub: "Ghi band ước tính + tiêu chí thấp nhất. Ngày 24 làm lại phần yếu nhất trước Đề 3." },
      ],
    },
    {
      t: "note",
      title: "Mẹo cho lần đầu gặp giám khảo AI",
      items: [
        "Đề mở sẵn là **Đề 1** (`noi-de1`, mức band 3.5–4.5) — vừa sức cho lần đầu. Speaking của **Đề 3** (thi cuối Tập 2) nằm trong bộ đề thi máy khi bạn làm Đề 3.",
        "Không nghe rõ? Nói **“Sorry, could you repeat the question, please?”** — giám khảo AI xử lý được, và thi thật cũng được phép (Ngày 19).",
        "Đừng **đọc thuộc** bài mẫu: AI (và giám khảo thật) nhận ra câu học thuộc — bị hạ điểm. Dùng **khung**, không dùng **văn mẫu**.",
        "Part 2: tận dụng **đủ 1 phút ghi chú** theo sơ đồ 5 nhánh; khi nói, **đừng dừng trước 1 phút 30**.",
        "Phản hồi của AI là **ước tính** để luyện, không phải điểm chính thức. Hãy nhìn **tiêu chí thấp nhất** — đó là thứ kéo band tổng xuống.",
      ],
    },
    {
      t: "p",
      text: "**Không mở được phòng thi** (mất mạng, máy không có micro)? Làm bản thay thế ngay dưới đây: ghi âm **liên tục** ba khối theo đúng thứ tự, bấm giờ tổng ~11 phút — Part 1 (8 câu) → Part 2 (thẻ “a rule”, 1 phút chuẩn bị + 2 phút) → Part 3 (khối mục 5).",
    },
    {
      t: "speak",
      id: "t2d23-noi-p1",
      part: "1",
      questions: [
        "Let's talk about your hometown. Where is your hometown?",
        "What do you like most about it?",
        "Has your hometown changed much in recent years?",
        "Would you like to live there in the future?",
        "Now let's talk about free time. What do you usually do at weekends?",
        "Do you prefer spending free time alone or with other people?",
        "Did you have more free time when you were a child?",
        "Is there a new hobby you would like to start?",
      ],
    },
  ],
};

/* ─────────────────────────── Bài tập ─────────────────────────── */

const T2D23_HOMEWORK: Lesson = {
  id: "t2d23-bai-tap",
  kind: "homework",
  title: "Bài tập Ngày 23",
  goal: "Chốt too / enough / so / such / quite và ôn lại 12 điểm ngữ pháp Tập 2 bằng dịch, trắc nghiệm, điền và nối câu — và hoàn thành ít nhất một lượt thi nói với giám khảo AI.",
  minutes: 50,
  blocks: [
    {
      t: "recap",
      title: "Bài tập hôm nay (36 câu + 1 lượt thi nói)",
      items: [
        "**I. Dịch Việt → Anh** (10 câu, có 💡).",
        "**II. Trắc nghiệm ôn tổng** (12 câu) — mỗi câu một điểm ngữ pháp Tập 2.",
        "**III. Điền too / enough / so / such** (8 câu).",
        "**IV. Nối hai câu thành một** (6 câu) bằng too … to / enough … to / so … that / such … that.",
        "**V. Giám khảo AI**: hoàn thành ít nhất một lượt (luyện hoặc thi) — ghi band và tiêu chí thấp nhất.",
      ],
    },

    { t: "h", text: "I. Dịch sang tiếng Anh (10 câu)" },
    {
      t: "quiz",
      id: "t2d23-bt-dich",
      title: "I. Dịch sang tiếng Anh (10 câu)",
      kind: "translate",
      grammar: "too + adj + to V · adj + enough + to V · so + adj (+ that) · such a + adj + N · quite / fairly · ôn: HTHT, điều kiện loại 1, mệnh đề quan hệ, used to.",
      items: [
        { q: "Phòng này quá nhỏ để tổ chức tiệc.", hint: "This room is too small, to have / hold a party", answers: ["This room is too small to have a party.", "This room is too small to hold a party.", "This room is too small for a party.", "This room is too small to have a party in.", "This room is too small to hold a party in."] },
        { q: "Bạn có đủ thời gian để làm xong bài không?", hint: "Do you have enough time, to finish the exercise / test", answers: ["Do you have enough time to finish the exercise?", "Do you have enough time to finish the test?", "Have you got enough time to finish the exercise?", "Do you have enough time to finish the task?", "Do you have enough time to finish your work?", "Do you have enough time to finish the assignment?"] },
        { q: "Bộ phim hay đến nỗi tôi xem hai lần.", hint: "The film was so good, that I watched it twice", answers: ["The film was so good that I watched it twice.", "The film was so good I watched it twice.", "The movie was so good that I watched it twice.", "The film was so good that I saw it twice.", "The movie was so good I watched it twice."] },
        { q: "Đó là một cuốn sách thú vị đến mức tôi đọc xong trong một ngày.", hint: "It was such an interesting book, that I finished it in one day", answers: ["It was such an interesting book that I finished it in one day.", "It was such an interesting book that I finished it in a day.", "It was such an interesting book I finished it in one day.", "It was such an interesting book that I read it in one day."] },
        { q: "Quê tôi khá nhỏ.", hint: "My hometown is fairly / quite small", answers: ["My hometown is fairly small.", "My hometown is quite small.", "My hometown is rather small.", "My hometown is pretty small."] },
        { q: "Đây là một bộ phim khá hay. (quite đứng trước a)", hint: "It's quite a good film", answers: ["It's quite a good film.", "It is quite a good film.", "This is quite a good film.", "It's quite a good movie.", "This is quite a good movie.", "It is quite a good movie."] },
        { q: "Tôi đã học tiếng Anh được ba năm.", hint: "I have studied / learned English, for three years", answers: ["I have studied English for three years.", "I've studied English for three years.", "I have learned English for three years.", "I've learned English for three years.", "I have been learning English for three years.", "I've been learning English for three years.", "I have learnt English for three years.", "I've been studying English for three years."] },
        { q: "Nếu ngày mai trời mưa, chúng tôi sẽ ở nhà.", hint: "If it rains tomorrow, we will stay at home", answers: ["If it rains tomorrow, we will stay at home.", "If it rains tomorrow, we'll stay at home.", "If it rains tomorrow, we will stay home.", "If it rains tomorrow, we'll stay home.", "We will stay at home if it rains tomorrow.", "We'll stay at home if it rains tomorrow.", "If it rains tomorrow we will stay at home."] },
        { q: "Cô giáo dạy tôi tiếng Anh sống ở Hà Nội.", hint: "The teacher who / that taught me English, lives in Hanoi", answers: ["The teacher who taught me English lives in Hanoi.", "The teacher that taught me English lives in Hanoi.", "The teacher who taught me English lives in Ha Noi.", "The teacher who teaches me English lives in Hanoi.", "The teacher that teaches me English lives in Hanoi."] },
        { q: "Hồi nhỏ tôi hay sợ chó.", hint: "I used to be afraid of dogs, when I was a child / little", answers: ["I used to be afraid of dogs when I was a child.", "When I was a child, I used to be afraid of dogs.", "I used to be afraid of dogs when I was little.", "When I was little, I used to be afraid of dogs.", "I used to be scared of dogs when I was a child.", "When I was a child, I used to be scared of dogs.", "I used to be afraid of dogs when I was young."] },
      ],
    },

    { t: "h", text: "II. Trắc nghiệm ôn tổng (12 câu)" },
    {
      t: "mcq",
      id: "t2d23-bt-chon",
      title: "II. Chọn đáp án đúng — mỗi câu một điểm ngữ pháp Tập 2 (12 câu)",
      items: [
        { q: "She plays ___ piano beautifully.", options: ["a", "these", "the", "an"], correct: 2, why: "Nhạc cụ → **the** piano. (① Mạo từ — Ngày 1)" },
        { q: "We arrived ___ the airport two hours early.", options: ["at", "to", "in", "on"], correct: 0, why: "**arrive at** + điểm cụ thể (sân bay); arrive **in** + thành phố / nước. ~~arrive to~~ sai. (② — Ngày 3)" },
        { q: "___ you ever ___ snow?", options: ["Did / see", "Have / seen", "Do / see", "Were / seeing"], correct: 1, why: "**ever** + trải nghiệm đến nay → **Have you ever seen**. (③ — Ngày 5)" },
        { q: "“The phone's ringing.” — “I ___ it.”", options: ["am going to answer", "answer", "answered", "'ll answer"], correct: 3, why: "Quyết định **ngay lúc nói** → **will ('ll)**. (④ — Ngày 7)" },
        { q: "This is ___ restaurant in town.", options: ["the best", "the better", "best", "the most good"], correct: 0, why: "So sánh nhất của good → **the best**. (⑤ — Ngày 9)" },
        { q: "He's interested in ___ a new language.", options: ["learn", "to learn", "learning", "learned"], correct: 2, why: "Giới từ **in** + **V-ing**. (⑥ — Ngày 11)" },
        { q: "If you ___ hard, you will pass.", options: ["will study", "study", "studied", "studying"], correct: 1, why: "Điều kiện loại 1: **If + hiện tại**, will + V. (⑦ — Ngày 13)" },
        { q: "The phone ___ I bought last week is already broken.", options: ["who", "where", "whose", "which"], correct: 3, why: "Vật → **which / that**. (⑧ — Ngày 15)" },
        { q: "The bus was late. ___, I missed the first lesson.", options: ["As a result", "Although", "Because", "Unless"], correct: 0, why: "Kết quả, đứng đầu câu mới + dấu phẩy → **As a result,**. (⑨ — Ngày 17)" },
        { q: "Let's start the meeting, ___?", options: ["will we", "shall we", "don't we", "do we"], correct: 1, why: "Let's … → **shall we?** (⑩ — Ngày 19)" },
        { q: "My grandfather ___ a farmer before he moved to the city.", options: ["would be", "was being", "used to be", "is used to being"], correct: 2, why: "Trạng thái quá khứ đã chấm dứt → **used to be** (would không dùng cho trạng thái). (⑪ — Ngày 21)" },
        { q: "He isn't tall ___ to play basketball professionally.", options: ["too", "so", "such", "enough"], correct: 3, why: "not + adj + **enough** + to V. (⑫ — Ngày 23)" },
      ],
    },

    { t: "h", text: "III. Điền too / enough / so / such (8 câu)" },
    {
      t: "quiz",
      id: "t2d23-bt-dien",
      title: "III. Điền too, enough, so hoặc such (có thể kèm a / an) — 8 câu",
      kind: "fill",
      items: [
        { q: "The coffee is ___ hot to drink.", answers: ["too"], hint: "quá … nên không thể" },
        { q: "Is he old ___ to watch this film?", answers: ["enough"], hint: "đủ … để" },
        { q: "It was ___ beautiful day that we went to the beach.", answers: ["such a"], hint: "+ a + adj + N" },
        { q: "She speaks ___ quickly that I can't understand her.", answers: ["so"], hint: "+ trạng từ đứng một mình" },
        { q: "There isn't ___ food for everyone.", answers: ["enough"], hint: "+ danh từ" },
        { q: "They are ___ kind people.", answers: ["such"], hint: "+ adj + N số nhiều (không a)" },
        { q: "I have ___ much work that I can't go out tonight.", answers: ["so"], hint: "___ much + N" },
        { q: "The bag was ___ heavy for her to lift.", answers: ["too"], hint: "for her to lift" },
      ],
    },

    { t: "h", text: "IV. Nối hai câu thành một (6 câu)" },
    {
      t: "quiz",
      id: "t2d23-bt-noi",
      title: "IV. Viết lại thành một câu với từ trong ngoặc (6 câu)",
      kind: "fill",
      grammar: "too + adj + (for sb) + to V · adj + enough + to V · so + adj + that · such (a) + adj + N + that",
      items: [
        { q: "The water was very cold. We couldn't swim. (TOO)", answers: ["The water was too cold for us to swim in.", "The water was too cold to swim in.", "The water was too cold for us to swim.", "The water was too cold to swim."], hint: "too cold (for us) to swim (in)" },
        { q: "My sister is 18. She can vote. (ENOUGH)", answers: ["My sister is old enough to vote."], hint: "old enough to vote" },
        { q: "The test was very difficult. Many students failed. (SO … THAT)", answers: ["The test was so difficult that many students failed.", "The test was so difficult many students failed."], hint: "so difficult that" },
        { q: "It was a very funny film. We laughed all the time. (SUCH … THAT)", answers: ["It was such a funny film that we laughed all the time.", "It was such a funny film we laughed all the time."], hint: "such a funny film that" },
        { q: "The room isn't big. It can't hold 50 people. (ENOUGH)", answers: ["The room isn't big enough to hold 50 people.", "The room is not big enough to hold 50 people.", "The room isn't big enough for 50 people.", "The room is not big enough for 50 people.", "The room isn't big enough to hold fifty people."], hint: "isn't big enough to/for" },
        { q: "He was very tired. He couldn't walk any further. (TOO)", answers: ["He was too tired to walk any further.", "He was too tired to walk any farther.", "He was too tired to walk further."], hint: "too tired to walk" },
      ],
    },

    { t: "h", text: "V. Giám khảo AI" },
    {
      t: "note",
      title: "Việc cuối của hôm nay — không bỏ qua",
      items: [
        "Mở phòng thi nói: `/language/en/ielts/thi-may/noi?de=noi-de1&che=luyen` (luyện) hoặc `/language/en/ielts/thi-may/noi?de=noi-de1` (thi).",
        "Hoàn thành **ít nhất một lượt đủ 3 Part**. Ghi ra giấy: **band ước tính** · **tiêu chí thấp nhất** (FC / LR / GRA / P) · **3 câu sửa** AI gợi ý.",
        "Tiêu chí thấp nhất là **FC** → luyện lại khung Part 2 (Ngày 19, 23). **LR** → ôn từ vựng chủ đề (Ngày 24). **GRA** → làm lại mục 6 bài Ngữ pháp hôm nay. **P** → các khối 🔊 Ngày 19–23.",
      ],
    },
  ],
};

export const NGAY_23: Lesson[] = [T2D23_GRAMMAR, T2D23_LISTENING, T2D23_SPEAKING, T2D23_HOMEWORK];
