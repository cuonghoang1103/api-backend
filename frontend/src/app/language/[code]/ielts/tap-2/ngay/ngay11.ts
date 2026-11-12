/**
 * Tập 2 · Ngày 11 — Ngữ pháp: Gerund & infinitive — hơn 40 động từ theo 5 nhóm, V-ing sau giới từ [G15] ·
 * Nghe: kỹ năng — đọc trước & đoán loại từ, từ báo hiệu (signposting), bẫy sửa lời “actually, no…”,
 * paraphrase khi nghe [L15] · Nói: Part 2 Describe an object [S05] 🔊 trọng âm từ 2 âm tiết (REcord /
 * reCORD) [S12] · Bài tập.
 *
 * Soạn 12/11/2026 theo docs/ielts-lo-trinh-0-8.md mục 3.2 (hàng N11). Tập 1 Ngày 10 đã có used to / be used
 * to + V-ing — ở đây chỉ nhắc lại trong nhóm “to là giới từ”. Mục 5 bài Nghe dùng lại đúng phiếu của
 * Practice 1 (đoán loại từ trước, rồi nghe điền) để người học thấy việc đoán trước giúp gì. Mọi kịch bản,
 * bài mẫu là tự viết.
 */
import type { Lesson } from '../data';

/* ─────────────────────────── Ngữ pháp ─────────────────────────── */

const T2D11_NGU_PHAP: Lesson = {
  id: "t2d11-ngu-phap",
  kind: "grammar",
  title: "Ngữ pháp: Gerund & infinitive — hơn 40 động từ; V-ing sau giới từ",
  goal: "Chọn đúng V-ing hay to V sau hơn 40 động từ hay gặp (enjoy doing, decide to do, ask sb to do, remember doing / to do…), luôn dùng V-ing sau giới từ (interested in, by, instead of, look forward to), và dùng các mẫu này trong Speaking (I enjoy…, I'm looking forward to…) và Writing (By + V-ing, encourage people to…) — đẩy GRA band 5.",
  minutes: 65,
  blocks: [
    {
      t: "recap",
      title: "Bài này học gì · đẩy band nào",
      items: [
        "Khi hai động từ đứng liền nhau, động từ thứ hai phải là ==V-ing== (gerund) hoặc ==to V== (infinitive) — **do động từ thứ nhất quyết định**, không phải do nghĩa.",
        "Năm nhóm: **+ V-ing** (enjoy, avoid, finish…) · **+ to V** (want, decide, hope…) · **+ O + to V** (ask, tell, allow…) · **cả hai, nghĩa như nhau** (like, start…) · **cả hai, nghĩa khác** (remember, stop, try, forget, regret).",
        "**Sau giới từ luôn là V-ing**: interested **in learning** · **by using** · **instead of driving** · look forward **to seeing** (to ở đây là giới từ!).",
        "V-ing làm **chủ ngữ**: ==Cycling is good for you.== · to V chỉ **mục đích**: ==I came here to study.==",
        "Đẩy **GRA**: band 4 hay viết ~~I enjoy to read~~, ~~I look forward to see you~~ — hai lỗi giám khảo bắt ngay. Dùng đúng thì câu của bạn tự nhiên và dài hơn.",
      ],
    },
    {
      t: "sodo",
      kind: "compare",
      title: "V-ing và to V — hai “hình dạng” của động từ thứ hai",
      cols: [
        { title: "V-ing (gerund)", anh: "person-swimming", items: ["Động từ **làm danh từ**", "**Swimming** keeps me fit. (chủ ngữ)", "I enjoy **swimming**. (sau enjoy)", "I'm good at **swimming**. (sau giới từ)"] },
        { title: "to + V (infinitive)", anh: "bullseye", items: ["Hay mang ý **hướng tới**, **mục đích**, **tương lai**", "I want **to swim** better.", "I went to the pool **to swim**. (mục đích)", "It's easy **to learn**. (sau tính từ)"] },
      ],
      caption: "Mẹo nhớ thô: to V hay đi với động từ “hướng tới tương lai” (want, hope, plan, decide); V-ing hay đi với động từ về việc “đã / đang có” (enjoy, finish, avoid, mind). Mẹo này đúng phần lớn, không phải luôn — vẫn phải thuộc danh sách.",
    },

    { t: "h", text: "1. V-ing làm chủ ngữ và sau giới từ" },
    {
      t: "patterns",
      rows: [
        { formula: "V-ing + V(s/es) …", vi: "V-ing làm **chủ ngữ** → động từ chia **số ít**.", examples: [{ en: "Learning a language takes time.", vi: "Học một ngôn ngữ cần thời gian." }, { en: "Living in a big city is expensive.", vi: "Sống ở thành phố lớn thì đắt đỏ." }] },
        { formula: "giới từ (in, at, of, about, for, by, without, instead of, before, after) + V-ing", vi: "Sau **mọi giới từ** là V-ing (hoặc danh từ).", examples: [{ en: "I'm interested in learning photography.", vi: "Tôi thích học nhiếp ảnh." }, { en: "You can save money by cooking at home.", vi: "Bạn có thể tiết kiệm tiền bằng cách nấu ăn ở nhà." }, { en: "Instead of driving, I take the bus.", vi: "Thay vì lái xe, tôi đi xe buýt." }] },
        { formula: "look forward to / be used to / get used to + V-ing", vi: "**to** ở đây là **giới từ**, không phải dấu hiệu to V → theo sau là **V-ing**. (be used to: Tập 1 Ngày 10.)", examples: [{ en: "I'm looking forward to meeting you.", vi: "Tôi mong được gặp bạn." }, { en: "I'm not used to getting up so early.", vi: "Tôi chưa quen dậy sớm như vậy." }] },
      ],
    },
    {
      t: "table",
      caption: "Tính từ / động từ + giới từ hay gặp — đều + V-ing",
      head: ["Cụm", "Nghĩa", "Ví dụ"],
      rows: [
        ["interested **in**", "quan tâm, thích", "interested in **studying** abroad"],
        ["good / bad **at**", "giỏi / kém", "good at **solving** problems"],
        ["keen **on**", "thích, ham", "keen on **taking** photos"],
        ["afraid **of**", "sợ", "afraid of **speaking** in public"],
        ["tired **of**", "chán", "tired of **waiting**"],
        ["think **about** / **of**", "nghĩ đến việc", "thinking of **moving** to Da Nang"],
        ["succeed **in**", "thành công trong", "succeeded in **getting** a scholarship"],
        ["apologise **for**", "xin lỗi vì", "apologised for **being** late"],
        ["**by** / **without** / **instead of**", "bằng cách / mà không / thay vì", "by **reading**, without **asking**, instead of **complaining**"],
        ["**before** / **after**", "trước / sau khi", "before **going** to bed"],
      ],
    },
    {
      t: "rule",
      formula: "V-ing + V(s) · giới từ + V-ing · look forward to / be used to + V-ing",
      vi: "Thấy giới từ (kể cả “to” trong look forward to) → động từ sau nó là V-ing.",
    },
    {
      t: "quiz",
      id: "t2d11-gioi-tu-dich",
      title: "Dịch sang tiếng Anh — V-ing làm chủ ngữ, sau giới từ (4 câu)",
      kind: "translate",
      grammar: "V-ing + V(s) · interested in / good at / by / instead of + V-ing · look forward to + V-ing",
      items: [
        { q: "Đọc sách trước khi ngủ giúp tôi thư giãn.", hint: "Reading (books), before going to bed / before sleeping, helps me relax", answers: ["Reading before going to bed helps me relax.", "Reading books before going to bed helps me relax.", "Reading before bed helps me relax.", "Reading before sleeping helps me relax.", "Reading books before bed helps me relax.", "Reading books before sleeping helps me relax.", "Reading before going to sleep helps me relax.", "Reading before going to bed helps me to relax.", "Reading books before going to bed helps me to relax.", "Reading before bed helps me to relax."] },
        { q: "Tôi rất mong được gặp bạn vào tuần sau.", hint: "I'm really looking forward to, seeing / meeting you, next week", answers: ["I'm really looking forward to seeing you next week.", "I'm really looking forward to meeting you next week.", "I am really looking forward to seeing you next week.", "I am really looking forward to meeting you next week.", "I'm looking forward to seeing you next week.", "I'm looking forward to meeting you next week."] },
        { q: "Bạn có thể cải thiện tiếng Anh bằng cách xem phim có phụ đề.", hint: "You can improve your English, by watching films / movies, with subtitles", answers: ["You can improve your English by watching films with subtitles.", "You can improve your English by watching movies with subtitles.", "You can improve your English by watching films with English subtitles.", "You can improve English by watching films with subtitles.", "You can improve your English by watching subtitled films."] },
        { q: "Thay vì phàn nàn, hãy tìm giải pháp.", hint: "Instead of complaining, (let's / try to) find a solution", answers: ["Instead of complaining, find a solution.", "Instead of complaining, let's find a solution.", "Instead of complaining, try to find a solution.", "Instead of complaining, look for a solution.", "Instead of complaining, we should find a solution.", "Instead of complaining, find solutions."] },
      ],
    },

    { t: "h", text: "2. Động từ + V-ing" },
    {
      t: "table",
      caption: "16 động từ / cụm đi với V-ing",
      head: ["Động từ", "Nghĩa", "Ví dụ"],
      rows: [
        ["**enjoy**", "thích (thưởng thức)", "I enjoy **cooking** for my family."],
        ["**avoid**", "tránh", "Try to avoid **using** your phone in bed."],
        ["**finish**", "làm xong", "Have you finished **writing** your essay?"],
        ["**mind**", "phiền (câu hỏi / phủ định)", "Do you mind **opening** the window?"],
        ["**suggest**", "đề xuất", "She suggested **taking** a taxi."],
        ["**consider**", "cân nhắc", "I'm considering **studying** abroad."],
        ["**keep**", "cứ tiếp tục, lặp lại", "He keeps **interrupting** me."],
        ["**practise**", "luyện", "Practise **speaking** every day."],
        ["**imagine**", "tưởng tượng", "Can you imagine **living** without the internet?"],
        ["**deny**", "chối", "He denied **taking** the money."],
        ["**admit**", "thừa nhận", "She admitted **making** a mistake."],
        ["**miss**", "nhớ (tiếc thiếu)", "I miss **eating** my mum's cooking."],
        ["**risk**", "liều, có nguy cơ", "You risk **losing** your job."],
        ["**can't stand**", "không chịu nổi", "I can't stand **waiting** in queues. (đôi khi gặp can't stand **to V**; V-ing phổ biến hơn)"],
        ["**give up**", "từ bỏ", "My dad gave up **smoking** last year."],
        ["**put off**", "trì hoãn", "Don't put off **doing** your homework."],
      ],
    },
    {
      t: "note",
      title: "Cẩn thận với suggest",
      items: [
        "~~She suggested to take a taxi~~ → She suggested **taking** a taxi. (Hoặc: She suggested **that we take** a taxi.)",
        "~~suggest sb to do~~ là lỗi rất phổ biến — suggest **không** đi với “sb + to V”.",
      ],
    },
    {
      t: "rule",
      formula: "enjoy · avoid · finish · mind · suggest · consider · keep · practise · imagine · deny · admit · miss · risk · can't stand · give up · put off + V-ing",
      vi: "Học theo nhóm câu: “I enjoy… but I can't stand… so I avoid…”.",
    },
    {
      t: "quiz",
      id: "t2d11-ving-dich",
      title: "Dịch sang tiếng Anh — động từ + V-ing (4 câu)",
      kind: "translate",
      grammar: "S + enjoy / avoid / suggest / consider / give up + V-ing",
      items: [
        { q: "Tôi thích đi bộ đường dài vào cuối tuần.", hint: "I enjoy, hiking / going hiking, at weekends", answers: ["I enjoy hiking at weekends.", "I enjoy going hiking at weekends.", "I enjoy hiking on weekends.", "I enjoy going hiking on weekends.", "I enjoy hiking at the weekend.", "I enjoy going hiking at the weekend."] },
        { q: "Bạn nên tránh uống cà phê vào buổi tối.", hint: "You should avoid, drinking coffee, in the evening", answers: ["You should avoid drinking coffee in the evening.", "You should avoid drinking coffee in the evenings.", "You should avoid drinking coffee at night.", "You should avoid drinking coffee in the evening"] },
        { q: "Cô ấy đề xuất đi bằng tàu.", hint: "She suggested, going / travelling, by train", answers: ["She suggested going by train.", "She suggested travelling by train.", "She suggested taking the train.", "She suggested traveling by train.", "She suggested that we go by train.", "She suggested that we should go by train."] },
        { q: "Bố tôi đã bỏ hút thuốc năm năm trước.", hint: "My father / dad, gave up smoking, five years ago", answers: ["My father gave up smoking five years ago.", "My dad gave up smoking five years ago.", "My father quit smoking five years ago.", "My dad quit smoking five years ago.", "My father stopped smoking five years ago.", "My dad stopped smoking five years ago."] },
      ],
    },

    { t: "h", text: "3. Động từ + to V" },
    {
      t: "table",
      caption: "20 động từ / cụm đi với to V",
      head: ["Động từ", "Ví dụ", "Động từ", "Ví dụ"],
      rows: [
        ["**want**", "I want **to travel**.", "**manage**", "I managed **to finish** on time. (xoay xở được)"],
        ["**would like**", "I'd like **to try** it.", "**afford**", "I can't afford **to buy** a car."],
        ["**decide**", "We decided **to stay**.", "**learn**", "She's learning **to drive**."],
        ["**hope**", "I hope **to see** you soon.", "**expect**", "I expect **to pass**."],
        ["**plan**", "They plan **to open** a shop.", "**need**", "You need **to rest**."],
        ["**agree**", "He agreed **to help**.", "**seem**", "She seems **to be** tired."],
        ["**refuse**", "He refused **to answer**.", "**tend**", "Prices tend **to rise** in summer."],
        ["**promise**", "I promise **to call**.", "**fail**", "He failed **to arrive** on time."],
        ["**offer**", "She offered **to drive** me.", "**choose**", "Many choose **to work** from home."],
        ["**arrange**", "We arranged **to meet** at 6.", "**aim**", "The course aims **to help** beginners."],
      ],
    },
    {
      t: "note",
      title: "Mẹo",
      items: [
        "**tend to + V** rất hợp Speaking / Writing để **nói chung có mức độ**: Young people **tend to** spend more time online.",
        "**manage to** = **xoay xở được** (đã làm được dù khó) — khác **can**.",
        "**would like to + V** (muốn — lịch sự) khác **like + V-ing** (thích nói chung): I'd like **to go** there. · I like **going** there.",
        "**need + to V** = (ai đó) cần làm: You need **to rest**. Nhưng **đồ vật + need + V-ing** mang nghĩa **bị động** (cần được…): The car needs **washing**. = The car needs **to be washed**.",
      ],
    },
    {
      t: "rule",
      formula: "want · would like · decide · hope · plan · agree · refuse · promise · offer · arrange · manage · afford · learn · expect · need · seem · tend · fail · choose · aim + to V",
      vi: "Phần lớn là động từ “hướng tới” một việc chưa làm.",
    },
    {
      t: "quiz",
      id: "t2d11-to-v-dich",
      title: "Dịch sang tiếng Anh — động từ + to V (4 câu)",
      kind: "translate",
      grammar: "S + decide / hope / can't afford / tend / manage + to V",
      items: [
        { q: "Năm ngoái tôi quyết định học tiếng Hàn.", hint: "Last year, I decided, to learn / to study, Korean", answers: ["Last year, I decided to learn Korean.", "Last year I decided to learn Korean.", "Last year, I decided to study Korean.", "Last year I decided to study Korean.", "I decided to learn Korean last year.", "I decided to study Korean last year."] },
        { q: "Nhiều sinh viên không đủ tiền thuê căn hộ riêng.", hint: "Many students, can't afford, to rent, their own flat / apartment", answers: ["Many students can't afford to rent their own flat.", "Many students can't afford to rent their own apartment.", "Many students cannot afford to rent their own flat.", "Many students cannot afford to rent their own apartment.", "A lot of students can't afford to rent their own flat.", "Many students can't afford to rent a flat of their own."] },
        { q: "Người trẻ có xu hướng thay đổi công việc thường xuyên hơn.", hint: "Young people, tend to change, jobs, more often", answers: ["Young people tend to change jobs more often.", "Young people tend to change jobs more frequently.", "Young people tend to change their jobs more often.", "Younger people tend to change jobs more often.", "Young people tend to change jobs more often than older people."] },
        { q: "Cuối cùng tôi cũng xoay xở tìm được một chỗ đỗ xe.", hint: "I finally managed, to find, a parking space / place to park", answers: ["I finally managed to find a parking space.", "I finally managed to find a place to park.", "Finally, I managed to find a parking space.", "In the end, I managed to find a parking space.", "I eventually managed to find a parking space.", "I finally managed to find a parking spot."] },
      ],
    },

    { t: "h", text: "4. Động từ + tân ngữ + to V; make / let + tân ngữ + V" },
    {
      t: "patterns",
      rows: [
        { formula: "S + ask / tell / allow / encourage / advise / remind / persuade / want / expect + O + to V", vi: "Có **người** ở giữa (tân ngữ), rồi mới đến to V.", examples: [{ en: "My teacher encouraged me to take the IELTS test.", vi: "Thầy tôi khuyến khích tôi thi IELTS." }, { en: "The company doesn't allow staff to work from home.", vi: "Công ty không cho phép nhân viên làm việc ở nhà." }] },
        { formula: "S + make / let + O + V (KHÔNG to)", vi: "**make** = bắt buộc · **let** = cho phép. Sau tân ngữ là **V nguyên mẫu không to**.", examples: [{ en: "My parents let me choose my own university.", vi: "Bố mẹ cho tôi tự chọn trường đại học." }, { en: "The film made me cry.", vi: "Bộ phim làm tôi khóc." }] },
      ],
    },
    {
      t: "note",
      title: "Cẩn thận",
      items: [
        "~~let me to go~~ → let me **go** · ~~made him to stay~~ → made him **stay**.",
        "~~The government should encourage people using public transport~~ → encourage people **to use** public transport — câu Task 2 rất hay gặp.",
        "**allow** + O + to V, nhưng **let** + O + V: They **allowed** us **to leave** = They **let** us **leave**.",
      ],
    },
    {
      t: "rule",
      formula: "ask / tell / allow / encourage / advise / remind / persuade + O + to V · make / let + O + V",
      vi: "Câu Task 2 khuyến nghị: “Governments should encourage people to + V”.",
    },
    {
      t: "quiz",
      id: "t2d11-tan-ngu-dich",
      title: "Dịch sang tiếng Anh — có tân ngữ (4 câu)",
      kind: "translate",
      grammar: "encourage / allow / advise / remind + O + to V · make / let + O + V",
      items: [
        { q: "Chính phủ nên khuyến khích người dân đi phương tiện công cộng.", hint: "The government should encourage, people, to use public transport", answers: ["The government should encourage people to use public transport.", "Governments should encourage people to use public transport.", "The government should encourage people to take public transport.", "The government should encourage citizens to use public transport.", "The government should encourage people to use public transportation."] },
        { q: "Bác sĩ khuyên tôi nên ngủ nhiều hơn.", hint: "The doctor, advised me, to sleep more / to get more sleep", answers: ["The doctor advised me to sleep more.", "The doctor advised me to get more sleep.", "My doctor advised me to sleep more.", "My doctor advised me to get more sleep.", "The doctor advised me to have more sleep."] },
        { q: "Bố mẹ tôi không cho tôi về nhà muộn.", hint: "My parents, don't let me, come home late", answers: ["My parents don't let me come home late.", "My parents do not let me come home late.", "My parents don't let me come back home late.", "My parents don't allow me to come home late.", "My parents do not allow me to come home late.", "My parents don't let me get home late."] },
        { q: "Nhắc tôi gọi cho mẹ tối nay nhé.", hint: "Remind me, to call / to phone, my mum, tonight", answers: ["Remind me to call my mum tonight.", "Please remind me to call my mum tonight.", "Remind me to phone my mum tonight.", "Remind me to call my mom tonight.", "Please remind me to call my mother tonight.", "Remind me to call my mother tonight."] },
      ],
    },

    { t: "h", text: "5. Cả hai được — nghĩa giống nhau và nghĩa khác nhau" },
    {
      t: "table",
      caption: "Nghĩa (gần như) không đổi",
      head: ["Động từ", "Ví dụ", "Ghi chú"],
      rows: [
        ["like · love · hate · prefer", "I like **swimming** / **to swim**.", "Anh-Anh thiên V-ing cho sở thích; **would like / would love / would prefer** luôn + **to V**"],
        ["start · begin · continue", "It started **raining** / **to rain**.", "Đã ở dạng -ing thì tránh hai -ing liền: ~~It's starting raining~~ → It's starting **to rain**"],
      ],
    },
    {
      t: "table",
      caption: "Nghĩa KHÁC hẳn — phải hiểu, không đoán",
      head: ["Động từ", "+ V-ing (việc đã xảy ra / bản thân việc đó)", "+ to V (việc cần làm / mục đích)"],
      rows: [
        ["**remember**", "I remember **meeting** her in 2019. = nhớ **đã** gặp", "Remember **to lock** the door. = nhớ **phải** khoá"],
        ["**forget**", "I'll never forget **seeing** the sea for the first time. = quên **việc đã** làm", "I forgot **to bring** my ID. = quên **làm** (nên không làm)"],
        ["**stop**", "I stopped **drinking** coffee. = **thôi, bỏ** việc đó", "I stopped **to drink** some water. = dừng lại **để** uống nước"],
        ["**try**", "Try **turning** it off and on again. = **thử** làm xem có hiệu quả", "I tried **to lift** the box, but it was too heavy. = **cố gắng** làm"],
        ["**regret**", "I regret **saying** that. = hối hận **vì đã** nói", "We regret **to inform** you… = lấy làm tiếc **phải** thông báo (văn trang trọng)"],
      ],
    },
    {
      t: "sodo",
      kind: "timeline",
      title: "remember / forget / stop: V-ing nhìn LẠI, to V nhìn TỚI",
      caption: "V-ing: hành động nằm ở QUÁ KHỨ so với lúc nhớ / quên / dừng. to V: hành động nằm SAU, là việc cần làm.",
      marks: [
        { from: -7, kieu: "diem", label: "I remember **meeting** her (đã gặp từ trước)", mau: 1 },
        { from: 0, kieu: "diem", label: "lúc nhớ / lúc quên / lúc dừng", mau: 2 },
        { from: 3, kieu: "diem", label: "Remember **to lock** the door (việc phải làm sau)", mau: 3 },
      ],
    },
    {
      t: "rule",
      formula: "remember / forget + V-ing (việc đã làm) · + to V (việc phải làm) · stop + V-ing (bỏ) · stop + to V (dừng để) · try + V-ing (thử) · try + to V (cố) · regret + V-ing (hối hận đã) · regret + to V (tiếc phải báo)",
      vi: "Năm động từ đổi nghĩa — đề trắc nghiệm rất thích hỏi.",
    },
    {
      t: "quiz",
      id: "t2d11-doi-nghia-dich",
      title: "Dịch sang tiếng Anh — remember / stop / try (4 câu)",
      kind: "translate",
      grammar: "remember / forget + to V · remember + V-ing · stop + V-ing / to V · try + V-ing",
      items: [
        { q: "Nhớ mang theo hộ chiếu nhé.", hint: "Remember, to bring / to take, your passport", answers: ["Remember to bring your passport.", "Remember to take your passport.", "Please remember to bring your passport.", "Don't forget to bring your passport.", "Don't forget to take your passport.", "Remember to bring your passport with you."] },
        { q: "Tôi vẫn nhớ đã đi học trong ngày đầu tiên.", hint: "I still remember, going to school / starting school, on the first day", answers: ["I still remember going to school on the first day.", "I still remember going to school on my first day.", "I still remember my first day at school.", "I still remember starting school.", "I still remember going to school for the first time."] },
        { q: "Chúng tôi dừng lại để mua đồ ăn.", hint: "We stopped, to buy, some food", answers: ["We stopped to buy some food.", "We stopped to buy food.", "We stopped to get some food.", "We stopped to buy something to eat.", "We stopped to get food."] },
        { q: "Hãy thử uống trà gừng — nó có thể giúp bạn.", hint: "Try drinking, ginger tea, it might / may help (you)", answers: ["Try drinking ginger tea — it might help you.", "Try drinking ginger tea. It might help you.", "Try drinking ginger tea, it might help you.", "Try drinking ginger tea; it might help.", "Try drinking ginger tea. It may help.", "Try drinking ginger tea. It might help.", "Try drinking ginger tea — it may help you."] },
      ],
    },

    { t: "h", text: "6. to V chỉ mục đích · tính từ + to V" },
    {
      t: "patterns",
      rows: [
        { formula: "S + V + (in order) to V", vi: "**Để** làm gì. ~~for to study~~, ~~for study~~ đều sai.", examples: [{ en: "Many students work part-time to pay their fees.", vi: "Nhiều sinh viên làm thêm để trả học phí." }] },
        { formula: "It is + adj + (for sb) + to V", vi: "**It's easy / difficult / important / necessary to + V** — mẫu câu học thuật đơn giản mà ăn điểm.", examples: [{ en: "It is important for children to learn how to swim.", vi: "Trẻ em học bơi là điều quan trọng." }] },
      ],
    },
    {
      t: "rule",
      formula: "S + V + (in order) to V · It is + adj + (for sb) + to V",
      vi: "Mục đích = to V (không “for + V”); “Việc… là…” = It is + adj + to V.",
    },
    {
      t: "quiz",
      id: "t2d11-muc-dich-dich",
      title: "Dịch sang tiếng Anh — mục đích, It is + adj + to V (3 câu)",
      kind: "translate",
      grammar: "S + V + to V (mục đích) · It is + adj + for sb + to V",
      items: [
        { q: "Tôi dậy sớm để tập thể dục.", hint: "I get up early, to exercise / to do exercise", answers: ["I get up early to exercise.", "I get up early to do exercise.", "I get up early in order to exercise.", "I wake up early to exercise.", "I get up early to work out.", "I get up early to do some exercise."] },
        { q: "Người già học dùng điện thoại thông minh là điều khó.", hint: "It is difficult, for older people / the elderly, to learn to use, smartphones", answers: ["It is difficult for older people to learn to use smartphones.", "It's difficult for older people to learn to use smartphones.", "It is difficult for the elderly to learn to use smartphones.", "It is hard for older people to learn to use smartphones.", "It is difficult for older people to learn how to use smartphones.", "It's hard for older people to learn how to use smartphones.", "It is difficult for elderly people to learn to use smartphones."] },
        { q: "Học sinh cần ngủ đủ giấc là điều cần thiết.", hint: "It is necessary / essential, for students, to get enough sleep", answers: ["It is necessary for students to get enough sleep.", "It is essential for students to get enough sleep.", "It's necessary for students to get enough sleep.", "It's essential for students to get enough sleep.", "It is important for students to get enough sleep.", "It is necessary for students to sleep enough."] },
      ],
    },

    { t: "h", text: "7. Dùng trong bài thi + lỗi hay gặp" },
    {
      t: "table",
      head: ["Phần thi", "Mẫu ăn điểm"],
      rows: [
        ["**Speaking Part 1**", "I **enjoy** + V-ing · I'm **keen on** + V-ing · I **can't stand** + V-ing · I'**d like to** + V · I'm **thinking of** + V-ing"],
        ["**Speaking Part 2**", "I **decided to**… · I **managed to**… · I'll never **forget** + V-ing · I'm **looking forward to** + V-ing"],
        ["**Writing Task 2**", "**By** + V-ing, governments can… · **Instead of** + V-ing… · Governments should **encourage** people **to** + V · **It is essential to** + V"],
        ["**Writing Task 1** (quy trình, Ngày 20)", "**After** + V-ing, … · **Before** + V-ing, …"],
      ],
    },
    {
      t: "note",
      title: "Người Việt hay sai",
      items: [
        "~~I enjoy to read~~ → I enjoy **reading**. ~~I want going~~ → I want **to go**.",
        "~~I look forward to see you~~ → I look forward to **seeing** you.",
        "~~She suggested me to apply~~ → She suggested **that I apply** / She **advised me to** apply.",
        "~~Let me to explain~~ → Let me **explain**.",
        "~~I go to the library for study~~ → … **to study**.",
        "~~Learn English is difficult~~ → **Learning** English is difficult / **It is** difficult **to learn** English.",
      ],
    },
    {
      t: "mcq",
      id: "t2d11-chon",
      title: "Luyện chọn — V-ing hay to V? (10 câu)",
      items: [
        { q: "(1) I'm thinking of ___ a new laptop.", options: ["buying", "buy", "to buy"], correct: 0, why: "Sau giới từ **of** → V-ing." },
        { q: "(2) She promised ___ me with my homework.", options: ["help", "helping", "to help"], correct: 2, why: "**promise + to V**." },
        { q: "(3) Would you mind ___ a little quieter?", options: ["to speak", "speaking", "speak"], correct: 1, why: "**mind + V-ing**." },
        { q: "(4) Our teacher made us ___ the essay again.", options: ["to write", "write", "writing"], correct: 1, why: "**make + O + V** (không to)." },
        { q: "(5) I'll never forget ___ the Golden Bridge for the first time.", options: ["see", "to see", "seeing"], correct: 2, why: "Kỷ niệm **đã xảy ra** → **forget + V-ing**." },
        { q: "(6) I was cycling along the beach, and I stopped ___ a photo of the sunset.", options: ["to take", "taking", "take"], correct: 0, why: "Đang đạp xe thì dừng lại **để** chụp ảnh → **stop + to V**. (stopped taking = thôi không chụp nữa — không hợp ngữ cảnh đang đạp xe.)" },
        { q: "(7) ___ a second language opens many doors.", options: ["Speak", "To speaking", "Speaking"], correct: 2, why: "V-ing làm **chủ ngữ**." },
        { q: "(8) The company allows employees ___ from home on Fridays.", options: ["to work", "working", "work"], correct: 0, why: "**allow + O + to V**." },
        { q: "(9) He's used to ___ in a noisy city.", options: ["live", "living", "to live"], correct: 1, why: "**be used to** (quen với) — to là giới từ → V-ing." },
        { q: "(10) We can't afford ___ a holiday this year.", options: ["to take", "taking", "take"], correct: 0, why: "**afford + to V**." },
      ],
    },
  ],
};

/* ─────────────────────────── Nghe ─────────────────────────── */

const T2D11_NGHE: Lesson = {
  id: "t2d11-nghe",
  kind: "listening",
  title: "Nghe: Kỹ năng — từ báo hiệu, bẫy “actually, no…”, đoán loại từ",
  goal: "Dùng 30 giây đọc trước để đoán loại từ cho từng ô, bám bài nghe nhờ từ báo hiệu (first of all, moving on to, finally), không rơi vào bẫy sửa lời (no, sorry · actually · we were going to… but) và nhận ra paraphrase khi nghe — đích ≥ 7/8 ở bài Part 1 cuối bài, nâng Part 1–2 lên mức band 5–5.5.",
  minutes: 55,
  blocks: [
    {
      t: "recap",
      title: "Bài này học gì · đẩy band nào",
      items: [
        "Nghe kém thường **không phải do tai** mà do **không biết mình đang nghe gì**. Hôm nay học 4 kỹ năng làm chủ bài nghe.",
        "① **Đọc trước, đoán loại từ**: ô sau “a” → danh từ số ít; sau “£” → số; sau “Ms” → họ (sẽ đánh vần).",
        "② **Từ báo hiệu** (signposting): ==First of all · Moving on to · Another thing · Finally== cho biết bạn đang ở **câu nào**.",
        "③ **Bẫy sửa lời**: ==no, sorry · actually · I mean · we were going to…, but== — đáp án luôn ở **sau** chữ sửa.",
        "④ **Paraphrase khi nghe**: câu hỏi nói “cost”, người nói nói “you'll pay”; câu hỏi “a notebook”, người nói “something to write in”.",
        "Đích: **≥ 7/8** ở bài Part 1 cuối (mục 5) — chính là phiếu bạn đoán loại từ ở mục 1.",
      ],
    },

    { t: "h", text: "1. Đọc trước và đoán loại từ" },
    {
      t: "p",
      text: "Trong 30 giây đọc đề, với **mỗi ô trống** hãy tự hỏi hai câu: (1) **Loại từ gì?** — danh từ (số ít / số nhiều), số, tên, ngày, tính từ? (2) **Nội dung gì?** — một môn học, một ngày trong tuần, một con số tiền? Đoán đúng loại từ là bạn đã loại được 80 % thứ nghe thấy mà không phải đáp án.",
    },
    {
      t: "table",
      caption: "Manh mối quanh ô trống",
      head: ["Thấy gì quanh ô", "Đoán", "Ví dụ"],
      rows: [
        ["**a / an** + ___", "danh từ **số ít** đếm được", "bring a ___ → notebook, towel"],
        ["**some / any** + ___ · không có a", "danh từ **số nhiều** hoặc **không đếm được**", "buy some ___ → batteries, paper"],
        ["**£ / $ / €** · **per hour** · **minutes**", "**số**", "£ ___ → 150"],
        ["**Mr / Ms / Dr** + ___", "**họ** — thường sẽ được **đánh vần**", "Ms ___ → Pearce"],
        ["**on** + ___ (ngày)", "**ngày trong tuần / ngày tháng**", "on ___ → Thursday"],
        ["**Room / Gate / Platform** + ___", "chữ + số", "Room ___ → C14"],
        ["___ + **photography / course**", "tính từ / danh từ bổ nghĩa", "___ photography → portrait"],
      ],
    },
    {
      t: "table",
      caption: "Phiếu bạn sẽ nghe ở mục 5 — Westvale Community College, evening course",
      head: ["Mục", "Thông tin"],
      rows: [
        ["Course", "(1) ______ photography"],
        ["Day", "(2) ______ evenings, 7–9 p.m."],
        ["Cost", "£ (3) ______"],
        ["Students should bring", "a (4) ______"],
        ["Teacher", "Ms (5) ______"],
        ["Room", "(6) ______"],
        ["Maximum class size", "(7) ______ students"],
        ["Students will need to buy", "some spare (8) ______"],
      ],
    },
    {
      t: "mcq",
      id: "t2d11-doan-loai-tu",
      title: "Practice 1 — đoán loại từ cho từng ô (8 câu)",
      items: [
        { q: "Ô (1) ___ photography", options: ["một số", "một từ chỉ loại / kiểu (tính từ hoặc danh từ)", "một ngày"], correct: 1, why: "Đứng **trước** “photography” → từ bổ nghĩa chỉ **kiểu** nhiếp ảnh (portrait, landscape, digital…)." },
        { q: "Ô (2) ___ evenings", options: ["một ngày trong tuần", "một con số", "một tên người"], correct: 0, why: "“___ evenings, 7–9 p.m.” → **ngày trong tuần** (Monday… Sunday)." },
        { q: "Ô (3) £ ___", options: ["một danh từ", "một tên", "một số (tiền)"], correct: 2, why: "Có **£** → **số**. Cẩn thận sẽ có **nhiều số** được nhắc." },
        { q: "Ô (4) a ___", options: ["danh từ số ít đếm được", "danh từ số nhiều", "động từ"], correct: 0, why: "Sau **a** → danh từ **số ít** (không thêm -s khi viết)." },
        { q: "Ô (5) Ms ___", options: ["một nghề nghiệp", "một họ — có thể được đánh vần", "một con số"], correct: 1, why: "Sau **Ms** → **họ**; tên lạ thường được **đánh vần** — chuẩn bị ghi từng chữ cái." },
        { q: "Ô (6) Room ___", options: ["một tính từ", "một ngày", "chữ và / hoặc số"], correct: 2, why: "Số phòng: **B12, C14, 204**…" },
        { q: "Ô (7) ___ students", options: ["một số", "một tên", "một tính từ"], correct: 0, why: "“___ students” + “Maximum class size” → **số**." },
        { q: "Ô (8) some spare ___", options: ["danh từ số ít", "danh từ số nhiều hoặc không đếm được", "một số"], correct: 1, why: "Sau **some** và không có a → danh từ **số nhiều** (hoặc không đếm được). Nhớ ghi đuôi **-s** nếu nghe thấy." },
      ],
    },

    { t: "h", text: "2. Từ báo hiệu — biết mình đang ở đâu" },
    {
      t: "table",
      caption: "Từ báo hiệu hay gặp (Part 2 và Part 4 dùng nhiều nhất)",
      head: ["Chức năng", "Cụm", "Bạn làm gì"],
      rows: [
        ["**Mở danh sách**", "I'm going to talk about three things. · First of all, … · To begin with, …", "Chuẩn bị: sắp có câu hỏi **đầu tiên**"],
        ["**Chuyển ý**", "Moving on to… · Now, let's turn to… · The second thing is… · Next, …", "Chuyển mắt sang **câu kế tiếp**"],
        ["**Ví dụ**", "For example, … · For instance, … · such as…", "Ví dụ thường **không** phải đáp án — trừ khi câu hỏi hỏi ví dụ"],
        ["**Nhấn mạnh**", "The most important thing is… · What you really need to remember is…", "Đáp án **rất hay** nằm ngay sau"],
        ["**Đối lập**", "But · However · Although · On the other hand", "Thông tin sau thường **thay** thông tin trước"],
        ["**Kết thúc**", "Finally, … · Lastly, … · To sum up, …", "Câu hỏi **cuối** của nhóm"],
      ],
    },
    {
      t: "canh",
      anh: ["woman-office-worker", "books", "loudspeaker"],
      caption: "Practice 2 — quản lý thư viện thành phố thông báo ba thay đổi. Nghe các từ báo hiệu để biết THỨ TỰ các ý.",
    },
    {
      t: "listen",
      id: "t2d11-nghe-bao-hieu",
      title: "Changes at the city library",
      dan: { so: "Day 11, Practice 2", boiCanh: "a short announcement about changes at a city library.", cau: [1, 4] },
      note: "Khoảng 1 phút: người dẫn (giọng Anh, nam) + quản lý thư viện (giọng Mỹ, nữ). Nghe một lần, chú ý các cụm báo hiệu.",
      lines: [
        { who: "Host", voice: "uk-nam", text: "Before we start this evening's book club, our library manager, Karen, has a short announcement.", vi: "Trước khi bắt đầu câu lạc bộ sách tối nay, quản lý thư viện của chúng ta, chị Karen, có một thông báo ngắn." },
        { who: "Manager", voice: "us-nu", text: "Good evening, everyone. I'd like to tell you about three changes at the library this year. First of all, opening hours. From next month, we'll be open until nine p.m. on weekdays instead of seven.", vi: "Chào buổi tối mọi người. Tôi muốn báo ba thay đổi ở thư viện năm nay. Trước hết là giờ mở cửa. Từ tháng sau, chúng tôi mở đến chín giờ tối các ngày trong tuần thay vì bảy giờ." },
        { who: "Manager", voice: "us-nu", text: "Moving on to the second change, which is the study rooms. You can now book them online, for up to three hours at a time.", vi: "Chuyển sang thay đổi thứ hai, là các phòng học nhóm. Giờ các bạn có thể đặt trực tuyến, tối đa ba tiếng mỗi lần." },
        { who: "Manager", voice: "us-nu", text: "The most important thing to remember, though, is that you'll need your new membership card to enter the building after six p.m.", vi: "Tuy nhiên, điều quan trọng nhất cần nhớ là các bạn sẽ cần thẻ thành viên mới để vào toà nhà sau sáu giờ tối." },
        { who: "Manager", voice: "us-nu", text: "And finally, the café on the ground floor is closing for two weeks in July for repairs. Thanks for listening.", vi: "Và cuối cùng, quán cà phê ở tầng trệt sẽ đóng cửa hai tuần vào tháng Bảy để sửa chữa. Cảm ơn đã lắng nghe." },
      ],
    },
    {
      t: "mcq",
      id: "t2d11-nghe-bao-hieu-chon",
      title: "Practice 2 — từ báo hiệu (4 câu)",
      items: [
        { q: "(1) Which change does the manager talk about FIRST?", options: ["the café", "study rooms", "opening hours"], correct: 2, why: "“**First of all**, opening hours.”" },
        { q: "(2) Which phrase introduces the SECOND change?", options: ["Moving on to…", "Finally…", "First of all…"], correct: 0, why: "“**Moving on to** the second change…”" },
        { q: "(3) What does the manager say is MOST important?", options: ["booking study rooms online", "bringing the new membership card after 6 p.m.", "the café closing in July"], correct: 1, why: "“**The most important thing to remember**… is that you'll need your new membership card…” — cụm nhấn mạnh báo đáp án." },
        { q: "(4) What does the manager say about the café?", options: ["It will be closed for two weeks.", "It will be closed for two months.", "It will move to another floor."], correct: 0, why: "“**And finally**, the café… is closing **for two weeks** in July for repairs.” — **finally** báo ý cuối cùng." },
      ],
    },

    { t: "h", text: "3. Bẫy sửa lời — “actually, no…”" },
    {
      t: "table",
      caption: "Năm kiểu bẫy — đáp án luôn ở SAU chữ báo",
      head: ["Kiểu bẫy", "Câu báo hiệu", "Ví dụ → đáp án"],
      rows: [
        ["**Nói nhầm rồi sửa**", "no, sorry · I mean · sorry, I tell a lie", "“It's on the 14th — **no, sorry**, the 15th.” → **15th**"],
        ["**Kế hoạch thay đổi**", "we were going to… but · originally… now", "“We **were going to** meet at the café, **but** it's closed, so let's meet at the library.” → **library**"],
        ["**Quá khứ vs hiện tại**", "used to… but now · it was… it's now", "“It **used to** cost £10, **but now** it's £12.” → **£12**"],
        ["**Ý bị bác bỏ**", "I thought about… but · Actually, …", "“I thought about Tuesday, but **actually** Wednesday suits me better.” → **Wednesday**"],
        ["**Người thứ hai sửa**", "Are you sure? · I think you'll find… · Actually, it's…", "“It's room 12.” — “**Actually**, they moved us to 14.” → **14**"],
      ],
    },
    {
      t: "listen",
      id: "t2d11-nghe-sua-loi",
      title: "Six corrections",
      dan: { so: "Day 11, Practice 3", boiCanh: "six short extracts in which a speaker changes or corrects information.", cau: [1, 6] },
      note: "Khoảng 1 phút 30, bốn giọng Anh – Mỹ. Ghi đáp án CUỐI CÙNG.",
      lines: [
        { who: "Narrator", voice: "dan", text: "One." },
        { who: "Woman", voice: "uk-nu", text: "The meeting is on Tuesday the fourteenth — oh, no, sorry, it's been moved to Wednesday the fifteenth.", vi: "Cuộc họp vào thứ Ba ngày mười bốn — ồ không, xin lỗi, đã dời sang thứ Tư ngày mười lăm." },
        { who: "Narrator", voice: "dan", text: "Two." },
        { who: "Man", voice: "us-nam", text: "We were going to take the coach to the airport, but it leaves too early, so we've booked a taxi instead.", vi: "Chúng tôi định đi xe khách ra sân bay, nhưng nó chạy sớm quá, nên chúng tôi đã đặt taxi." },
        { who: "Narrator", voice: "dan", text: "Three." },
        { who: "Woman", voice: "us-nu", text: "Entry used to be free for students, but now there's a charge of four dollars.", vi: "Trước đây sinh viên được vào miễn phí, nhưng giờ thu bốn đô." },
        { who: "Narrator", voice: "dan", text: "Four." },
        { who: "Man", voice: "uk-nam", text: "Your seat is in row G. I mean, row J — G is nearer the front.", vi: "Ghế của bạn ở hàng G. Ý tôi là hàng J — G ở gần phía trước hơn." },
        { who: "Narrator", voice: "dan", text: "Five." },
        { who: "Woman", voice: "uk-nu", text: "Could you bring the projector to room twenty?", vi: "Anh mang máy chiếu đến phòng hai mươi được không?" },
        { who: "Man", voice: "us-nam", text: "Actually, I think you'll find the class is in room twenty-two today. Twenty is being painted.", vi: "Thật ra tôi nghĩ hôm nay lớp học ở phòng hai mươi hai. Phòng hai mươi đang được sơn." },
        { who: "Narrator", voice: "dan", text: "Six." },
        { who: "Man", voice: "uk-nam", text: "I'll need about thirty chairs. Hang on — with the teachers, that's thirty-five.", vi: "Tôi sẽ cần khoảng ba mươi cái ghế. Khoan — tính cả giáo viên thì ba mươi lăm." },
      ],
    },
    {
      t: "quiz",
      id: "t2d11-nghe-sua-loi-dien",
      title: "Practice 3 — ghi đáp án cuối cùng (ONE WORD AND/OR A NUMBER)",
      kind: "fill",
      items: [
        { q: "(1) The meeting is on Wednesday the ___.", answers: ["15th", "15", "fifteenth"] },
        { q: "(2) They will go to the airport by ___.", answers: ["taxi"] },
        { q: "(3) Students now pay $ ___.", answers: ["4", "four"] },
        { q: "(4) The seat is in row ___.", answers: ["J"] },
        { q: "(5) Today the class is in room ___.", answers: ["22", "twenty-two"] },
        { q: "(6) Number of chairs needed: ___", answers: ["35", "thirty-five"] },
      ],
    },
    {
      t: "note",
      title: "Giải thích Practice 3",
      items: [
        "**(1) 15th** — “**no, sorry**, it's been moved to Wednesday the fifteenth”. Câu hỏi đã có chữ Wednesday → ghi số.",
        "**(2) taxi** — “We **were going to** take the coach… **but**… so we've booked a taxi **instead**.” coach là bẫy.",
        "**(3) 4** — “**used to** be free… **but now** there's a charge of four dollars.”",
        "**(4) J** — “**I mean**, row J”. G là chữ nói trước rồi sửa.",
        "**(5) 22** — người thứ hai sửa: “**Actually**, I think you'll find… room twenty-two”.",
        "**(6) 35** — “**Hang on** — with the teachers, that's thirty-five.” Hang on = khoan đã (báo hiệu sửa).",
      ],
    },

    { t: "h", text: "4. Paraphrase khi nghe" },
    {
      t: "p",
      text: "Như bài Đọc Ngày 8, câu hỏi nghe **hiếm khi dùng đúng chữ** người nói. Phiếu ghi “Cost”, người nói nói “**you'll pay**” hoặc “**the fee is**”; câu trắc nghiệm ghi “**not suitable for beginners**”, người nói nói “**you'll need some experience**”. Khi luyện, sau mỗi bài hãy tô các cặp paraphrase giữa câu hỏi và lời thoại.",
    },
    {
      t: "table",
      caption: "Cặp paraphrase hay gặp ở Part 1–2",
      head: ["Trên đề", "Người nói có thể nói"],
      rows: [
        ["cost / price / fee", "you'll pay · it comes to · it's £… · that'll be…"],
        ["bring", "you'll need · don't forget · make sure you have"],
        ["not allowed", "you can't · it's forbidden · please don't · it isn't permitted"],
        ["free", "there's no charge · you don't pay anything · it's included"],
        ["beginners", "people with no experience · people who've never done it before"],
        ["the most popular", "what most people choose · the one people love best"],
      ],
    },

    { t: "h", text: "5. Ghép tất cả — Part 1, câu 1–8" },
    {
      t: "canh",
      anh: ["camera-with-flash", "telephone-receiver", "man-office-worker"],
      caption: "**Lily** gọi điện đến **Westvale Community College** hỏi về một khoá học buổi tối. Nhân viên **Mark** trả lời. Đây chính là phiếu bạn đã đoán loại từ ở mục 1 — kéo lên xem lại trước khi nghe.",
    },
    {
      t: "listen",
      id: "t2d11-nghe-bai",
      title: "An evening course enquiry",
      dan: { so: "Day 11, Recording 1", boiCanh: "a telephone conversation between a woman and an employee at a community college.", cau: [1, 8] },
      note: "Khoảng 2 phút 30. Mark (giọng Anh, nam), Lily (giọng Mỹ, nữ). Nghe tối đa 2 lần. Write ONE WORD AND/OR A NUMBER.",
      lines: [
        { who: "Mark", voice: "uk-nam", text: "Westvale Community College, Mark speaking.", vi: "Westvale Community College, Mark nghe." },
        { who: "Lily", voice: "us-nu", text: "Hi, I'm calling about the evening photography courses. I saw an ad for landscape photography.", vi: "Chào anh, tôi gọi hỏi về các khoá nhiếp ảnh buổi tối. Tôi thấy quảng cáo khoá nhiếp ảnh phong cảnh." },
        { who: "Mark", voice: "uk-nam", text: "Ah, I'm afraid the landscape course is already full. But there are still a few places on the portrait photography course, which is also for beginners.", vi: "À, tiếc là khoá phong cảnh đã đủ người. Nhưng khoá nhiếp ảnh chân dung vẫn còn vài chỗ, khoá đó cũng dành cho người mới." },
        { who: "Lily", voice: "us-nu", text: "Portraits? OK, that sounds interesting. Which evening is it on?", vi: "Chân dung à? Được, nghe hay đấy. Học vào tối nào ạ?" },
        { who: "Mark", voice: "uk-nam", text: "It used to be on Tuesdays, but this term we've moved it to Thursdays, from seven till nine.", vi: "Trước đây học tối thứ Ba, nhưng kỳ này chúng tôi chuyển sang thứ Năm, từ bảy đến chín giờ." },
        { who: "Lily", voice: "us-nu", text: "Thursdays are fine. And how much does it cost?", vi: "Thứ Năm thì được. Học phí bao nhiêu ạ?" },
        { who: "Mark", voice: "uk-nam", text: "The full price is a hundred and fifty pounds. There was an early-booking price of a hundred and twenty, but I'm afraid that ended last Friday.", vi: "Giá đầy đủ là một trăm năm mươi bảng. Có giá đặt sớm một trăm hai mươi, nhưng tiếc là đã hết hạn thứ Sáu tuần trước." },
        { who: "Lily", voice: "us-nu", text: "Oh well. Do I need my own camera?", vi: "Thôi được. Tôi có cần máy ảnh riêng không?" },
        { who: "Mark", voice: "uk-nam", text: "No, we lend cameras to all students. The only thing you need to bring is a notebook, because the teacher gives a lot of tips you'll want to write down.", vi: "Không, chúng tôi cho tất cả học viên mượn máy ảnh. Thứ duy nhất chị cần mang là một cuốn sổ, vì giáo viên chia sẻ rất nhiều mẹo chị sẽ muốn ghi lại." },
        { who: "Lily", voice: "us-nu", text: "Great. Who's the teacher?", vi: "Tuyệt. Giáo viên là ai ạ?" },
        { who: "Mark", voice: "uk-nam", text: "Ms Pearce. That's P-E-A-R-C-E. She's a professional photographer.", vi: "Cô Pearce. Đánh vần P-E-A-R-C-E. Cô ấy là nhiếp ảnh gia chuyên nghiệp." },
        { who: "Lily", voice: "us-nu", text: "And where is the class?", vi: "Lớp học ở đâu ạ?" },
        { who: "Mark", voice: "uk-nam", text: "It says Room B12 on the website, but actually they've moved it to C14, because it has better lights. I'll ask someone to update the website.", vi: "Trên trang web ghi phòng B12, nhưng thật ra họ đã chuyển sang C14, vì phòng đó đèn tốt hơn. Tôi sẽ nhờ người cập nhật trang web." },
        { who: "Lily", voice: "us-nu", text: "C14. How big are the classes?", vi: "C14. Lớp đông không ạ?" },
        { who: "Mark", voice: "uk-nam", text: "Last year we had fifteen, which was too many, so now the maximum is twelve.", vi: "Năm ngoái có mười lăm người, đông quá, nên giờ tối đa là mười hai." },
        { who: "Lily", voice: "us-nu", text: "That's good. Is there anything else I'll need to pay for?", vi: "Tốt quá. Còn khoản nào tôi phải trả thêm không?" },
        { who: "Mark", voice: "uk-nam", text: "You don't need to buy a camera bag or anything like that, but the cameras use a lot of power, so you'll need to buy some spare batteries.", vi: "Chị không cần mua túi máy ảnh hay thứ gì tương tự, nhưng máy ảnh tốn pin lắm, nên chị sẽ cần mua thêm pin dự phòng." },
        { who: "Lily", voice: "us-nu", text: "No problem. Thanks for your help.", vi: "Không sao. Cảm ơn anh đã giúp." },
      ],
    },
    {
      t: "quiz",
      id: "t2d11-nghe-bai-dien",
      title: "Questions 1–8 — ONE WORD AND/OR A NUMBER",
      kind: "fill",
      items: [
        { q: "1. Course: ___ photography", answers: ["portrait"] },
        { q: "2. Day: ___ evenings, 7–9 p.m.", answers: ["Thursday", "Thursdays"] },
        { q: "3. Cost: £ ___", answers: ["150", "one hundred and fifty", "a hundred and fifty"] },
        { q: "4. Students should bring a ___", answers: ["notebook"] },
        { q: "5. Teacher: Ms ___", answers: ["Pearce"] },
        { q: "6. Room: ___", answers: ["C14"] },
        { q: "7. Maximum class size: ___ students", answers: ["12", "twelve"] },
        { q: "8. Students will need to buy some spare ___", answers: ["batteries"] },
      ],
    },
    {
      t: "note",
      title: "Giải thích 1–8 — kỹ năng nào đã cứu bạn?",
      items: [
        "**1 portrait** — bẫy **ý bị bác bỏ**: landscape “is **already full**. **But** there are still a few places on the **portrait** photography course”.",
        "**2 Thursday(s)** — bẫy **quá khứ vs hiện tại**: “**used to** be on Tuesdays, **but this term**… Thursdays”.",
        "**3 150** — đoán loại từ: **số**; bẫy hai con số: 120 là giá đặt sớm **đã hết hạn**.",
        "**4 notebook** — đoán loại từ: **a + danh từ số ít**. Bẫy: camera (được **cho mượn**). Cụm nhấn mạnh “**The only thing** you need to bring is…” báo đáp án đứng ngay sau.",
        "**5 Pearce** — đoán: **họ, sẽ đánh vần** → ghi P-E-A-R-C-E. Viết “Pierce” là sai.",
        "**6 C14** — bẫy **thông tin cũ vs mới**: “It says Room B12 on the website, **but actually** they've moved it to C14”.",
        "**7 12** — bẫy **quá khứ vs hiện tại**: “Last year we had fifteen… **so now** the maximum is twelve”.",
        "**8 batteries** — đoán: **some + danh từ số nhiều** → nhớ **-ies**. Bẫy: camera bag (“You **don't** need to buy”).",
        "Tự chấm: **7–8** = kỹ năng đã thành thói quen · **5–6** = xem lại câu sai thuộc bẫy nào (mục 3) · **≤ 4** = làm lại Practice 1 và 3 rồi nghe lại bài này sau 1 ngày.",
      ],
    },
    {
      t: "note",
      title: "Người Việt hay sai — và cách sửa",
      items: [
        "Ghi **ngay** từ đầu tiên nghe thấy khớp loại từ (landscape, Tuesday, B12). Sửa: chờ hết câu, nghe xem có **but / actually / no, sorry / used to** không.",
        "Bỏ phí 30 giây đọc đề để… nghe lại câu cũ. Sửa: dùng nó để **đoán loại từ** cho cả nhóm câu tiếp theo.",
        "Không nghe từ báo hiệu nên **lạc câu**. Sửa: khoanh tròn các chữ trong câu hỏi giống tiêu đề ý (opening hours, study rooms) — người nói sẽ **nói tên ý** khi chuyển.",
        "Viết sai đuôi **-s** (battery) hoặc số ít / số nhiều không khớp phiếu. Sửa: đọc lại chữ **a / some** trước ô.",
      ],
    },
  ],
};

/* ─────────────────────────── Nói ─────────────────────────── */

const T2D11_NOI: Lesson = {
  id: "t2d11-noi",
  kind: "speaking",
  title: "Nói: Part 2 — Describe an object",
  goal: "Nói 1,5–2 phút về một đồ vật (quà tặng, đồ hữu ích, đồ muốn mua, đồ cũ trong gia đình) theo dàn 4 phần, tả đúng hình dáng – chất liệu – công dụng (It's made of…, It's used for + V-ing / to + V…) và kể câu chuyện quanh nó — đẩy LR và FC band 5; đặt đúng trọng âm từ 2 âm tiết (danh từ nhấn đầu, động từ nhấn sau).",
  minutes: 60,
  blocks: [
    {
      t: "recap",
      title: "Bài này học gì · đẩy band nào",
      items: [
        "Part 2 loại **đồ vật** (object): something you **bought** / **were given** / find **useful** / would like to **buy** / an **old** object in your family.",
        "Dàn 4 phần như Ngày 7 nhưng **trọng tâm khác**: ① Là gì → ② **Trông thế nào, làm bằng gì** → ③ **Câu chuyện**: có từ khi nào, ai cho, dùng làm gì → ④ **Ý nghĩa với bạn**.",
        "Khung tả đồ vật: ==It's made of…== · ==It's about the size of…== · ==It's used for + V-ing / to + V== · ==I've had it for…== · ==It was given to me by…==",
        "Ngữ pháp hôm nay vào thẳng bài nói: **used for + V-ing**, **I decided to buy**, **I'll never forget opening it**.",
        "Phát âm: **trọng âm từ 2 âm tiết** — danh từ / tính từ thường nhấn **đầu** (**PRE**sent, **LAP**top), động từ thường nhấn **sau** (pre**SENT**, re**CORD**).",
      ],
    },

    { t: "h", text: "1. Đề đồ vật và cách chọn đồ để nói" },
    {
      t: "table",
      caption: "Các thẻ đồ vật hay gặp",
      head: ["Thẻ đề", "Thì chính", "Mẹo chọn đồ"],
      rows: [
        ["Describe a **gift** you received that was special", "quá khứ (nhận) + hiện tại (giờ thế nào)", "Chọn đồ có **câu chuyện**: ai tặng, dịp gì, bất ngờ ra sao"],
        ["Describe something **useful** you own", "hiện tại đơn + hiện tại hoàn thành (I've had it for…)", "Đồ dùng mỗi ngày: xe đạp, bình nước, ứng dụng, cuốn từ điển"],
        ["Describe something you **bought recently**", "quá khứ đơn", "Kể **vì sao** mua, so sánh với đồ cũ (ôn Ngày 9)"],
        ["Describe something you would **like to buy**", "would like to · going to · will (Ngày 7)", "Đồ có lý do rõ: máy ảnh, laptop, xe máy điện"],
        ["Describe an **old object** your family has kept", "quá khứ + hiện tại hoàn thành", "Đồ của ông bà: đồng hồ, radio, chiếc xe đạp cũ"],
      ],
    },
    {
      t: "note",
      title: "Mẹo: một đồ vật — dùng cho nhiều đề",
      items: [
        "Chuẩn bị **2–3 đồ vật** có câu chuyện tốt. Ví dụ **chiếc máy ảnh cũ của bố**: dùng được cho “a gift”, “an old object”, “something useful”, thậm chí “a hobby” (Ngày 19).",
        "Không cần đồ đắt tiền — giám khảo chấm **ngôn ngữ**, không chấm món đồ.",
      ],
    },

    { t: "h", text: "2. Khung câu tả đồ vật" },
    {
      t: "patterns",
      rows: [
        { formula: "It's made of / from + chất liệu", vi: "**made of**: vẫn thấy chất liệu (wood, metal, leather) · **made from**: chất liệu đã biến đổi (paper from wood).", examples: [{ en: "It's made of dark brown leather.", vi: "Nó làm bằng da màu nâu sẫm." }] },
        { formula: "It's about the size of + N · It's quite small / light / heavy", vi: "Kích thước, trọng lượng.", examples: [{ en: "It's about the size of a paperback book, but quite heavy.", vi: "Nó cỡ một cuốn sách bìa mềm, nhưng khá nặng." }] },
        { formula: "It's used for + V-ing · I use it to + V", vi: "Công dụng (ngữ pháp hôm nay!).", examples: [{ en: "It's used for recording sound, but I mainly use it to listen to podcasts.", vi: "Nó dùng để ghi âm, nhưng tôi chủ yếu dùng để nghe podcast." }] },
        { formula: "I've had it for + khoảng thời gian / since + mốc", vi: "Sở hữu từ bao giờ (hiện tại hoàn thành — Ngày 5).", examples: [{ en: "I've had it since I was fifteen.", vi: "Tôi có nó từ năm mười lăm tuổi." }] },
        { formula: "It was given to me by + người · I got it as a present for + dịp", vi: "Ai tặng (bị động quá khứ — Tập 1 Ngày 15).", examples: [{ en: "It was given to me by my grandfather when I passed my exams.", vi: "Ông tặng tôi khi tôi thi đỗ." }] },
        { formula: "It means a lot to me because + S + V", vi: "Ý nghĩa — câu mở phần cảm xúc.", examples: [{ en: "It means a lot to me because it reminds me of him.", vi: "Nó rất có ý nghĩa với tôi vì nó làm tôi nhớ đến ông." }] },
      ],
    },
    {
      t: "table",
      caption: "Tính từ tả đồ vật — và thứ tự khi đứng trước danh từ (ôn Tập 1 Ngày 7)",
      head: ["Ý kiến", "Kích thước", "Tuổi", "Hình dáng", "Màu", "Nguồn gốc", "Chất liệu", "Danh từ"],
      rows: [
        ["a beautiful", "small", "old", "round", "silver", "Swiss", "metal", "watch"],
        ["a useful", "", "", "", "black", "", "plastic", "case"],
      ],
    },
    {
      t: "vocab",
      items: [
        { w: "second-hand", pos: "adj", ipa: "/ˌsekənd ˈhænd/", vi: "đồ cũ (đã qua tay người khác)", ex: "I bought a second-hand camera online.", exVi: "Tôi mua một chiếc máy ảnh cũ trên mạng.", more: "Đối lập **brand-new** (mới tinh)." },
        { w: "durable", pos: "adj", ipa: "/ˈdjʊərəbl/", vi: "bền", ex: "This bag is cheap but very durable.", exVi: "Cái túi này rẻ mà rất bền." },
        { w: "portable", pos: "adj", ipa: "/ˈpɔːtəbl/", vi: "xách tay, mang theo được", ex: "A portable speaker is great for picnics.", exVi: "Loa di động rất hợp cho đi dã ngoại." },
        { w: "handy", pos: "adj", ipa: "/ˈhændi/", vi: "tiện, hữu dụng", ex: "This small torch is really handy during power cuts.", exVi: "Cây đèn pin nhỏ này rất tiện khi mất điện.", more: "Văn nói; trang trọng hơn: **useful, practical**." },
        { w: "sentimental value", pos: "n", ipa: "/ˌsentɪˈmentl ˈvæljuː/", vi: "giá trị tinh thần, kỷ niệm", ex: "The watch isn't expensive, but it has great sentimental value.", exVi: "Chiếc đồng hồ không đắt nhưng có giá trị kỷ niệm lớn.", more: "Cụm “đắt” cho đề **gift / old object**." },
        { w: "keepsake", pos: "n", ipa: "/ˈkiːpseɪk/", vi: "vật kỷ niệm", ex: "My grandmother kept the letter as a keepsake.", exVi: "Bà tôi giữ lá thư làm kỷ niệm." },
        { w: "worn out", pos: "adj", ipa: "/ˌwɔːn ˈaʊt/", vi: "sờn, cũ mòn (vì dùng nhiều)", ex: "My old trainers were completely worn out.", exVi: "Đôi giày thể thao cũ của tôi đã mòn hết." },
        { w: "come in handy", pos: "idiom", ipa: "/kʌm ɪn ˈhændi/", vi: "có lúc dùng đến, hữu ích", ex: "Keep the box — it might come in handy.", exVi: "Giữ cái hộp lại — có khi dùng đến." },
      ],
    },
    {
      t: "rule",
      formula: "It's made of… · It's about the size of… · It's used for + V-ing / I use it to + V · I've had it for / since… · It was given to me by… · It means a lot to me because…",
      vi: "Sáu khung câu đủ để nói 2 phút về bất kỳ đồ vật nào.",
    },

    { t: "h", text: "3. Ghi chú 1 phút và bài mẫu" },
    {
      t: "p",
      text: "Thẻ đề: **Describe a gift you received that was special to you.** You should say: **what** the gift was · **who** gave it to you · **when** you received it · **and explain why** it was special.",
    },
    {
      t: "sodo",
      kind: "mindmap",
      title: "Ghi chú 1 phút",
      center: "**Dad's old film camera**",
      branches: [
        { label: "What", anh: "camera", items: ["film camera 1990s", "black metal · heavy · size of a small brick"] },
        { label: "Who", anh: "man", items: ["dad · used it 20 years", "photos of family trips"] },
        { label: "When", anh: "graduation-cap", items: ["18th birthday", "wrapped in old newspaper"] },
        { label: "Why special", anh: "red-heart", items: ["sentimental value", "started my hobby", "learned to be patient"] },
      ],
    },
    {
      t: "dialogue",
      title: "Bài mẫu — khoảng 2 phút (band 5.5–6)",
      lines: [
        { who: "Examiner", role: "examiner", text: "Now I'd like you to describe a gift you received that was special to you. You have one minute to prepare… Please start speaking now." },
        { who: "Candidate", role: "candidate", text: "OK. The gift I'd like to talk about is an old film camera that my dad gave me on my eighteenth birthday.", vi: "Vâng. Món quà tôi muốn kể là chiếc máy ảnh phim cũ mà bố tặng tôi vào sinh nhật mười tám tuổi." },
        { who: "Candidate", role: "candidate", text: "It's a black camera from the nineteen-nineties, and it's made of metal, so it's much heavier than a phone — it's about the size of a small brick. There's a scratch on the top and the leather strap is a bit worn out, but it still works perfectly.", vi: "Đó là một chiếc máy ảnh màu đen từ thập niên 1990, làm bằng kim loại, nên nặng hơn điện thoại nhiều — cỡ một viên gạch nhỏ. Trên nóc có một vết xước và dây da hơi sờn, nhưng nó vẫn chạy hoàn hảo." },
        { who: "Candidate", role: "candidate", text: "My dad used it for about twenty years. Almost every photo of our family trips was taken with it. When I was a child, I always wanted to touch it, but he never let me play with it, because film was expensive. So on my birthday, when I opened the box and saw it, I was really surprised. I'll never forget seeing it wrapped in an old newspaper — that's so typical of my dad.", vi: "Bố tôi dùng nó khoảng hai mươi năm. Gần như mọi tấm ảnh trong các chuyến đi của gia đình đều chụp bằng nó. Hồi nhỏ, tôi lúc nào cũng muốn chạm vào nó, nhưng bố không bao giờ cho tôi nghịch, vì phim đắt. Nên vào sinh nhật, khi mở hộp và thấy nó, tôi thật sự bất ngờ. Tôi sẽ không bao giờ quên cảnh thấy nó được bọc trong tờ báo cũ — đúng kiểu của bố tôi." },
        { who: "Candidate", role: "candidate", text: "There are two reasons why it's so special. First, it has great sentimental value: whenever I hold it, I think of all the trips we took together. Second, it started my hobby. I decided to learn photography properly, and because a roll of film only has thirty-six photos, it taught me to be patient and to think carefully before pressing the button. Now I use it to take portraits of my friends, and I've had it for three years. I'd never sell it, not even for a lot of money.", vi: "Có hai lý do khiến nó đặc biệt. Thứ nhất, nó có giá trị kỷ niệm lớn: mỗi lần cầm nó, tôi nhớ lại những chuyến đi cả nhà. Thứ hai, nó khởi đầu sở thích của tôi. Tôi quyết định học nhiếp ảnh bài bản, và vì một cuộn phim chỉ có ba mươi sáu kiểu, nó dạy tôi kiên nhẫn và suy nghĩ kỹ trước khi bấm máy. Giờ tôi dùng nó để chụp chân dung bạn bè, và tôi đã có nó ba năm. Tôi sẽ không bao giờ bán nó, dù được trả bao nhiêu tiền." },
        { who: "Examiner", role: "examiner", text: "Thank you. Do you often give gifts to other people?" },
        { who: "Candidate", role: "candidate", text: "Not very often — mainly on birthdays. I prefer giving small, personal things rather than expensive ones.", vi: "Không thường lắm — chủ yếu vào sinh nhật. Tôi thích tặng những thứ nhỏ mà mang dấu ấn cá nhân hơn là đồ đắt tiền." },
      ],
    },
    {
      t: "table",
      caption: "Vì sao bài này đạt band 5.5–6",
      head: ["Tiêu chí", "Điểm mạnh", "Còn có thể nâng"],
      rows: [
        ["**FC**", "Đủ 4 dòng thẻ, có trình tự; câu chuyện có chi tiết bất ngờ (bọc báo cũ) làm bài sống động", "Thay “First… Second…” bằng “One reason is… On top of that…”"],
        ["**LR**", "film camera · scratch · leather strap · worn out · sentimental value · roll of film · portraits", "Thêm cụm “**I treasure it**” (trân quý)"],
        ["**GRA**", "Ngữ pháp Ngày 11: **he never let me play** · **I'll never forget seeing** · **decided to learn** · **taught me to be** · **use it to take**; so sánh **much heavier than**; **I've had it for three years**", "Một câu điều kiện ở cuối (Ngày 13)"],
        ["**P**", "(nghe giọng thật) — chú ý trọng âm **CAm**era, **BIRTH**day, **PA**tient, **POR**traits", "Đọc rõ -ed: wrapped /t/, decided /ɪd/"],
      ],
    },
    {
      t: "note",
      title: "Người Việt hay sai ở đề đồ vật",
      items: [
        "Tả **thông số kỹ thuật** như quảng cáo (pin 5.000 mAh, camera 48 MP) — giám khảo không cần; hãy kể **câu chuyện và cảm xúc**.",
        "~~It is made by wood~~ → made **of** wood. ~~It used for cooking~~ → It **is** used for cooking.",
        "~~I use it for listen to music~~ → I use it **to listen** / It's used **for listening**.",
        "Hết ý ở 1 phút. Mở rộng bằng: **so sánh** với đồ cũ (Ngày 9), **một lần** đồ vật giúp bạn, **dự định** với nó (Ngày 7).",
      ],
    },
    {
      t: "mcq",
      id: "t2d11-noi-chon",
      title: "Chọn câu đúng / tốt hơn (5 câu)",
      items: [
        { q: "(1)", options: ["It's made of leather.", "It's made by leather.", "It's make of leather."], correct: 0, why: "**be made of** + chất liệu." },
        { q: "(2)", options: ["I use it for check my email.", "I use it to check my email.", "I use it checking my email."], correct: 1, why: "**use sth to + V** (mục đích). Hoặc: It's used **for checking**." },
        { q: "(3)", options: ["I have it since 2020.", "I had it since 2020.", "I've had it since 2020."], correct: 2, why: "Từ quá khứ đến nay → **hiện tại hoàn thành** + since." },
        { q: "(4) Câu nào hợp phần “explain why it was special” nhất?", options: ["It has 128 GB of memory.", "It means a lot to me because my grandmother saved for months to buy it.", "It is black."], correct: 1, why: "Phần cuối cần **cảm xúc / lý do**, không phải thông số." },
        { q: "(5)", options: ["My parents let me to keep it.", "My parents let me keeping it.", "My parents let me keep it."], correct: 2, why: "**let + O + V** (không to)." },
      ],
    },

    { t: "h", text: "4. Phát âm: trọng âm từ hai âm tiết" },
    {
      t: "p",
      text: "Trọng âm (word stress) là âm tiết đọc **to hơn, dài hơn, cao hơn**. Âm tiết **không** nhấn thường bị đọc nhẹ thành /ə/ hoặc /ɪ/. Đặt sai trọng âm, người nghe phải đoán từ — và ở band 5, giám khảo bắt đầu chấm điều này. Quy tắc chung cho từ **hai âm tiết**: **danh từ, tính từ → thường nhấn âm đầu**; **động từ → thường nhấn âm sau** (có ngoại lệ — xem bảng dưới). Có một nhóm từ **cùng chữ viết** mà đổi trọng âm khi đổi loại từ.",
    },
    {
      t: "table",
      head: ["Từ", "Danh từ / tính từ (nhấn đầu)", "Động từ (nhấn sau)"],
      rows: [
        ["record", "a **RE**cord /ˈrekɔːd/ — kỷ lục, bản ghi", "to re**CORD** /rɪˈkɔːd/ — ghi lại"],
        ["present", "a **PRE**sent /ˈpreznt/ — món quà; hiện tại", "to pre**SENT** /prɪˈzent/ — trình bày, trao"],
        ["object", "an **OB**ject /ˈɒbdʒɪkt/ — đồ vật", "to ob**JECT** /əbˈdʒekt/ — phản đối"],
        ["increase", "an **IN**crease /ˈɪnkriːs/ — sự tăng", "to in**CREASE** /ɪnˈkriːs/ — tăng"],
        ["project", "a **PRO**ject /ˈprɒdʒekt/ — dự án", "to pro**JECT** /prəˈdʒekt/ — dự báo, chiếu"],
        ["export", "an **EX**port /ˈekspɔːt/ — hàng xuất khẩu", "to ex**PORT** /ɪkˈspɔːt/ — xuất khẩu"],
      ],
    },
    {
      t: "table",
      caption: "Quy tắc chung (đúng với phần lớn từ, không phải tất cả)",
      head: ["Loại", "Nhấn", "Ví dụ"],
      rows: [
        ["Danh từ 2 âm tiết", "**đầu**", "**LAP**top · **WAL**let · **SO**fa · **PIC**ture · **CA**mera (3 âm tiết, cũng nhấn đầu)"],
        ["Tính từ 2 âm tiết", "**đầu**", "**USE**ful · **HAN**dy · **POR**table (3) · **MO**dern"],
        ["Động từ 2 âm tiết", "**sau**", "be**GIN** · de**CIDE** · en**JOY** · pre**FER** · re**LAX**"],
        ["Ngoại lệ hay gặp", "—", "ho**TEL** (n) · **VI**sit (v) · **AN**swer (v) · **HAP**pen (v)"],
      ],
    },
    {
      t: "phatam",
      id: "t2d11-phat-am",
      title: "Luyện phát âm — trọng âm từ 2 âm tiết",
      note: "Bấm “Nghe mẫu”, rồi “Đọc & chấm”. Âm tiết KHÔNG nhấn đọc nhẹ, ngắn: re-CORD /rɪ/, pre-SENT /prɪ/, ob-JECT /əb/. Âm tiết nhấn: to, dài, cao giọng. Máy chấm từng âm — đọc đúng nguyên âm yếu /ɪ/ /ə/ là chấm được trọng âm.",
      items: [
        { text: "a record, to record", ipa: "ə rekɔːd tə rɪkɔːd", vi: "REcord · reCORD" },
        { text: "a present, to present", ipa: "ə preznt tə prɪzent", vi: "PREsent · preSENT" },
        { text: "an object, to object", ipa: "ən ɒbdʒɪkt tu əbdʒekt", vi: "OBject · obJECT" },
        { text: "a project, to project", ipa: "ə prɒdʒekt tə prədʒekt", vi: "PROject · proJECT" },
        { text: "laptop, wallet, useful, handy", ipa: "læptɒp wɒlɪt juːsfl hændi", vi: "danh từ / tính từ — nhấn đầu" },
        { text: "begin, decide, enjoy, prefer", ipa: "bɪɡɪn dɪsaɪd ɪndʒɔɪ prɪfɜː", vi: "động từ — nhấn sau" },
        { text: "She bought a record and decided to record a song.", ipa: "ʃi bɔːt ə rekɔːd ənd dɪsaɪdɪd tə rɪkɔːd ə sɒŋ", vi: "REcord · reCORD trong một câu" },
        { text: "I'd like to present my project.", ipa: "aɪd laɪk tə prɪzent maɪ prɒdʒekt", vi: "preSENT · PROject" },
      ],
    },

    { t: "h", text: "5. Luyện nói" },
    {
      t: "p",
      text: "Mỗi thẻ: **1 phút** ghi sơ đồ 4 nhánh, nói **đến 2 phút**. Dùng ít nhất **3 khung câu** ở mục 2 và **2 mẫu V-ing / to V** của bài ngữ pháp hôm nay. Chú ý trọng âm **PREsent, CAmera, USEful**.",
    },
    {
      t: "speak",
      id: "t2d11-noi-p2",
      part: "2",
      questions: [
        "Describe a gift you received that was special to you. You should say: what the gift was; who gave it to you; when you received it; and explain why it was special.",
        "Describe something useful that you own. You should say: what it is; how long you have had it; how often you use it; and explain why it is useful to you.",
        "Describe something you would like to buy in the future. You should say: what it is; how you know about it; how much it costs; and explain why you want to buy it.",
      ],
    },
    {
      t: "speak",
      id: "t2d11-noi-p1",
      part: "1",
      questions: [
        "Do you enjoy buying gifts for other people?",
        "What's the most useful thing you carry with you every day?",
        "Have you ever kept something for a very long time?",
        "Do you prefer buying new things or second-hand things?",
      ],
    },
  ],
};

/* ─────────────────────────── Bài tập ─────────────────────────── */

const T2D11_BAI_TAP: Lesson = {
  id: "t2d11-bai-tap",
  kind: "homework",
  title: "Bài tập Ngày 11",
  goal: "Tự kiểm tra Ngày 11: 10 câu chọn V-ing / to V, 8 câu viết dạng đúng, 6 câu dịch, 4 câu kỹ năng nghe, 3 câu trọng âm — 31 câu có đáp án và lời giải.",
  minutes: 40,
  blocks: [
    {
      t: "recap",
      title: "Bài tập hôm nay",
      items: [
        "**Phần I** (10 câu): chọn V-ing hay to V · **Phần II** (8 câu): viết dạng đúng (có lời giải).",
        "**Phần III** (6 câu): dịch câu dùng gerund / infinitive cho Speaking và Writing.",
        "**Phần IV** (4 câu): kỹ năng nghe — đoán loại từ, bẫy sửa lời · **Phần V** (3 câu): trọng âm.",
      ],
    },
    {
      t: "sodo",
      kind: "mindmap",
      title: "Ngày 11 trong một hình",
      center: "**Ngày 11**",
      branches: [
        { label: "Ngữ pháp: V-ing / to V", items: ["enjoy · avoid · suggest + V-ing", "want · decide · afford + to V", "ask · allow · encourage + O + to V · let / make + O + V", "remember / stop / try: đổi nghĩa", "giới từ + V-ing (look forward to + V-ing)"] },
        { label: "Nghe: kỹ năng", items: ["đoán loại từ: a + N · £ + số · Ms + họ", "từ báo hiệu: First of all · Moving on · Finally", "bẫy: no, sorry · used to… but now · actually"] },
        { label: "Nói: đồ vật", items: ["made of · used for + V-ing · I've had it for", "sentimental value · second-hand", "REcord / reCORD"] },
      ],
    },

    { t: "h", text: "Phần I — V-ing hay to V? (10 câu)" },
    {
      t: "mcq",
      id: "t2d11-bt-chon",
      title: "Phần I — Chọn đáp án đúng (10 câu)",
      items: [
        { q: "(1) I can't imagine ___ without my phone.", options: ["to live", "living", "live"], correct: 1, why: "**imagine + V-ing**." },
        { q: "(2) They agreed ___ the meeting until Friday.", options: ["to postpone", "postponing", "postpone"], correct: 0, why: "**agree + to V**." },
        { q: "(3) He apologised for ___ late.", options: ["be", "to be", "being"], correct: 2, why: "Sau giới từ **for** → V-ing." },
        { q: "(4) My manager asked me ___ the report by Monday.", options: ["finishing", "to finish", "finish"], correct: 1, why: "**ask + O + to V**." },
        { q: "(5) Do you remember ___ the door before we left?", options: ["locking", "to lock", "lock"], correct: 0, why: "Hỏi về việc **đã làm** (trước khi đi) → **remember + V-ing**." },
        { q: "(6) She's considering ___ her job.", options: ["to change", "change", "changing"], correct: 2, why: "**consider + V-ing**." },
        { q: "(7) I came to Hanoi ___ at university.", options: ["to study", "for study", "studying"], correct: 0, why: "Mục đích → **to V**." },
        { q: "(8) Please let me ___ for the meal.", options: ["to pay", "pay", "paying"], correct: 1, why: "**let + O + V**." },
        { q: "(9) ___ too much sugar is bad for your teeth.", options: ["Eat", "To eating", "Eating"], correct: 2, why: "V-ing làm **chủ ngữ**." },
        { q: "(10) We're looking forward to ___ our new flat.", options: ["moving into", "move into", "moved into"], correct: 0, why: "**look forward to + V-ing**." },
      ],
    },

    { t: "h", text: "Phần II — Viết dạng đúng (8 câu)" },
    {
      t: "quiz",
      id: "t2d11-bt-dang",
      title: "Phần II — Viết dạng đúng của động từ trong ngoặc",
      kind: "fill",
      items: [
        { q: "(1) I tend ___ (eat) too much when I'm stressed.", answers: ["to eat"] },
        { q: "(2) Would you mind ___ (wait) outside for a moment?", answers: ["waiting"] },
        { q: "(3) The teacher encouraged us ___ (ask) questions.", answers: ["to ask"] },
        { q: "(4) I'm not very good at ___ (remember) names.", answers: ["remembering"] },
        { q: "(5) I forgot ___ (buy) milk, so we can't make tea. (quên làm)", answers: ["to buy"] },
        { q: "(6) He stopped ___ (smoke) when his son was born. (bỏ hẳn)", answers: ["smoking"] },
        { q: "(7) They managed ___ (get) tickets for the concert.", answers: ["to get"] },
        { q: "(8) You can save energy by ___ (turn) off the lights.", answers: ["turning"] },
      ],
    },
    {
      t: "note",
      title: "Lời giải Phần II",
      items: [
        "**(1) to eat** — tend + to V. **(2) waiting** — mind + V-ing. **(3) to ask** — encourage + O + to V.",
        "**(4) remembering** — sau giới từ **at**. **(5) to buy** — forget + to V = quên **làm** (nên không có sữa).",
        "**(6) smoking** — stop + V-ing = **bỏ** (stop to smoke = dừng lại **để** hút). **(7) to get** — manage + to V. **(8) turning** — sau giới từ **by**.",
      ],
    },

    { t: "h", text: "Phần III — Dịch Việt → Anh (6 câu)" },
    {
      t: "quiz",
      id: "t2d11-bt-dich",
      title: "Phần III — Dịch sang tiếng Anh (6 câu)",
      kind: "translate",
      grammar: "enjoy / can't stand / avoid + V-ing · decide / hope + to V · encourage + O + to V · by / instead of + V-ing · It is + adj + to V",
      items: [
        { q: "Tôi không chịu nổi việc xếp hàng chờ.", hint: "I can't stand, waiting in line / queuing", answers: ["I can't stand waiting in line.", "I can't stand queuing.", "I can't stand waiting in queues.", "I cannot stand waiting in line.", "I can't stand queueing.", "I can't stand standing in line.", "I can't stand waiting in a queue.", "I can't stand queuing up.", "I can't stand waiting in a line."] },
        { q: "Tôi hy vọng được học thạc sĩ ở nước ngoài.", hint: "I hope, to do / to study for, a master's degree, abroad", answers: ["I hope to do a master's degree abroad.", "I hope to study for a master's degree abroad.", "I hope to get a master's degree abroad.", "I hope to do a master's abroad.", "I hope to study abroad for a master's degree.", "I hope to take a master's degree abroad.", "I hope to study for a master's abroad.", "I hope to do a master's degree overseas.", "I hope to study for a master's degree overseas."] },
        { q: "Trường học nên khuyến khích học sinh đọc nhiều hơn.", hint: "Schools should encourage, students, to read more", answers: ["Schools should encourage students to read more.", "Schools should encourage pupils to read more.", "Schools should encourage children to read more.", "Schools should encourage students to read more books."] },
        { q: "Thay vì mua sách mới, tôi mượn ở thư viện.", hint: "Instead of buying new books, I borrow them from the library", answers: ["Instead of buying new books, I borrow them from the library.", "Instead of buying new books, I borrow books from the library.", "Instead of buying new books, I borrow them from a library.", "Instead of buying new books I borrow them from the library.", "Instead of buying new books, I borrow from the library."] },
        { q: "Học một kỹ năng mới không bao giờ là quá muộn.", hint: "It is never too late, to learn, a new skill", answers: ["It is never too late to learn a new skill.", "It's never too late to learn a new skill.", "It is never too late to learn new skills.", "It's never too late to learn new skills.", "Learning a new skill is never too late.", "It is never too late to learn something new.", "It's never too late to learn something new."] },
        { q: "Chúng tôi dừng lại để hỏi đường.", hint: "We stopped, to ask for directions / to ask the way", answers: ["We stopped to ask for directions.", "We stopped to ask the way.", "We stopped to ask someone for directions.", "We stopped to ask directions."] },
      ],
    },

    { t: "h", text: "Phần IV — Kỹ năng nghe (4 câu)" },
    {
      t: "mcq",
      id: "t2d11-bt-nghe",
      title: "Phần IV — Chọn đáp án đúng (4 câu)",
      items: [
        { q: "(1) Phiếu ghi: “Please bring some ___”. Đáp án nhiều khả năng là…", options: ["một danh từ số nhiều hoặc không đếm được", "một con số", "một danh từ số ít đếm được"], correct: 0, why: "Sau **some**, không có a → danh từ **số nhiều** (towels) hoặc **không đếm được** (water)." },
        { q: "(2) Nghe: “The trip costs eighty dollars — oh, I tell a lie, it's ninety now.” Đáp án là…", options: ["80", "90", "170"], correct: 1, why: "**I tell a lie** = tôi nói sai rồi (báo hiệu sửa). Đáp án sau chữ sửa: **90**." },
        { q: "(3) Cụm nào báo hiệu người nói sắp chuyển sang ý TIẾP THEO?", options: ["For instance,", "The most important thing is", "Moving on to"], correct: 2, why: "**Moving on to…** = chuyển ý. For instance = ví dụ; The most important thing = nhấn mạnh." },
        { q: "(4) Câu hỏi: “What is free for children?” Người nói: “Under-twelves don't pay anything for the boat trip.” Đáp án là…", options: ["the boat trip", "under-twelves", "anything"], correct: 0, why: "Paraphrase: **free** ↔ **don't pay anything**; **children** ↔ **under-twelves**. Thứ miễn phí là **the boat trip**." },
      ],
    },

    { t: "h", text: "Phần V — Trọng âm (3 câu)" },
    {
      t: "mcq",
      id: "t2d11-bt-trong-am",
      title: "Phần V — Chọn cách nhấn đúng (3 câu)",
      items: [
        { q: "(1) “They plan to **record** a new album.” — record ở đây đọc là…", options: ["REcord /ˈrekɔːd/", "reCORD /rɪˈkɔːd/", "cả hai đều được"], correct: 1, why: "Sau **to** → **động từ** → nhấn âm sau: re**CORD**." },
        { q: "(2) “There was an **increase** in sales.” — increase ở đây đọc là…", options: ["inCREASE", "cả hai đều được", "INcrease"], correct: 2, why: "Sau **an** → **danh từ** → nhấn âm đầu: **IN**crease." },
        { q: "(3) Từ nào nhấn âm SAU?", options: ["laptop", "decide", "wallet"], correct: 1, why: "**decide** là động từ 2 âm tiết → de**CIDE**. laptop, wallet là danh từ → nhấn đầu." },
      ],
    },
  ],
};

export const NGAY_11: Lesson[] = [T2D11_NGU_PHAP, T2D11_NGHE, T2D11_NOI, T2D11_BAI_TAP];
