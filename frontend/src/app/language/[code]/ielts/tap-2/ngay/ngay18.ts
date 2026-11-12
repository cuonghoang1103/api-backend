/**
 * IELTS Tập 2 — Ngày 18 (tự soạn 12/11/2026, không chụp sách; mọi câu ví dụ, bài đọc, bài mẫu, câu bài tập đều VIẾT MỚI):
 *   Từ vựng: Truyền thông, tin tức & quảng cáo [VC15] — 20 từ + 10 collocation/cụm động từ + 5 họ từ + 4 câu mẫu
 *            + (thêm) phát âm /juː/ vs /uː/ (news, review, music ↔ true, choose, rumour)
 *   Đọc: Matching sentence endings [R14] — bài đọc ~710 từ về tin giả, 13 câu (6 nối đuôi câu + 4 TFNG + 3 điền câu)
 *   Viết: Two-part question essay [W07] (+ ôn dàn ý 5 phút W18) — bài mẫu trọn band ước tính 5.5–6.0, phân tích 4 tiêu chí
 *   Bài tập về nhà: 38 câu + 1 đoạn viết (từ vựng, họ từ, collocation, dịch 💡, nối đuôi câu, nhận diện đề, ôn N13 · N15 · N17).
 * Bài kiểm tra chặng (Ngày 13–18) `t2d18-kiem-tra` được thêm vào cuối mảng NGAY_18 (người điều phối viết).
 */
import type { Lesson } from '../data';

/* ─────────────────────────── Từ vựng ─────────────────────────── */

const T2D18_TU_VUNG: Lesson = {
  id: "t2d18-tu-vung",
  kind: "vocab",
  title: "Từ vựng: Truyền thông, tin tức & quảng cáo (Media, news & advertising)",
  goal: "Dùng đúng 20 từ + 10 collocation + 5 họ từ về tin tức, mạng xã hội và quảng cáo để nói Part 1–3 và viết Task 2 chủ đề truyền thông (Lexical Resource band 5: đủ từ cho đề, ít lỗi chọn từ), và đọc đúng âm /juː/ – /uː/ trong news, review, music.",
  minutes: 65,
  blocks: [
    {
      t: "recap",
      title: "Bài này học gì",
      items: [
        "**Truyền thông (media)** là một trong những chủ đề Task 2 và Speaking Part 3 hay gặp nhất: tin giả, quảng cáo nhắm vào trẻ em, người có ảnh hưởng, báo in hay báo mạng.",
        "Hai nhóm từ: **tin tức & báo chí** (journalist, coverage, bias, misinformation…) và **quảng cáo & mạng xã hội** (commercial, brand, sponsor, influencer, clickbait…).",
        "**10 cụm đi liền** phải học cả cụm: ==go viral · make the headlines · keep up with · spread misinformation · check the facts · tune in…==",
        "**5 họ từ** dùng nhiều nhất trong bài viết: advertise → **advertising / advertisement**; inform → **informative**; influence → **influential**; persuade → **persuasive**; publish → **publication**. Bẫy trọng âm: **AD**vertise nhưng ad**VER**tisement (Anh-Anh).",
        "Đẩy band nào: **Lexical Resource** Writing/Speaking band 5 — có đủ từ đúng chủ đề, dùng đúng collocation thay vì dịch từng chữ (~~do viral~~, ~~share fake news fastly~~).",
      ],
    },

    /* ── 1 ── */
    { t: "h", text: "1. Bản đồ chủ đề: truyền thông gồm những gì?" },
    {
      t: "p",
      text: "**The media** /ˈmiːdiə/ = các phương tiện truyền thông nói chung: báo in, truyền hình, đài, trang tin, mạng xã hội. Đề IELTS thường hỏi về **ba mảng**: tin tức có đáng tin không, quảng cáo ảnh hưởng ra sao (nhất là với trẻ em), và mạng xã hội thay đổi cách ta đọc tin thế nào. Hôm nay ta học từ cho cả ba mảng.",
    },
    {
      t: "sodo",
      kind: "mindmap",
      title: "Media, news & advertising — ba mảng hay ra đề",
      caption: "Mỗi nhánh là một kiểu câu hỏi Task 2 / Part 3. Từ in đậm là từ của bài hôm nay.",
      center: "**The media**",
      branches: [
        { label: "Tin tức (news)", items: ["**journalist** · **the press**", "**coverage** · **broadcast**", "**breaking news**"], anh: "newspaper" },
        { label: "Tin có đáng tin?", items: ["**reliable** source", "**bias** · **fake news**", "**misinformation** · **check the facts**"], anh: "magnifying-glass-tilted-left" },
        { label: "Quảng cáo (advertising)", items: ["**advertisement** · **commercial**", "**brand** · **slogan** · **campaign**", "**sponsor** · **target audience**"], anh: "megaphone" },
        { label: "Mạng xã hội", items: ["**influencer** · **viewer**", "**go viral** · **clickbait**", "**scroll through** · **subscription**"], anh: "mobile-phone" },
      ],
    },
    {
      t: "hinh",
      title: "Các kênh truyền thông — chạm thẻ để nghe",
      items: [
        { anh: "newspaper", w: "newspaper", ro: "/ˈnjuːzpeɪpə(r)/", vi: "tờ báo (báo in)" },
        { anh: "television", w: "television", ro: "/ˈtelɪvɪʒn/", vi: "truyền hình, ti vi" },
        { anh: "radio", w: "radio", ro: "/ˈreɪdiəʊ/", vi: "đài phát thanh" },
        { anh: "mobile-phone", w: "smartphone", ro: "/ˈsmɑːtfəʊn/", vi: "điện thoại thông minh" },
        { anh: "studio-microphone", w: "podcast", ro: "/ˈpɒdkɑːst/", vi: "chương trình âm thanh tải về nghe" },
        { anh: "megaphone", w: "announcement", ro: "/əˈnaʊnsmənt/", vi: "thông báo (công khai)" },
      ],
    },

    /* ── 2 ── */
    { t: "h", text: "2. Tin tức & báo chí — 10 từ" },
    {
      t: "vocab",
      items: [
        { w: "the media", pos: "n", ipa: "/ðə ˈmiːdiə/", vi: "giới truyền thông, các phương tiện truyền thông (báo, đài, TV, mạng…)", ex: "The media often focus on bad news because it attracts more attention.", exVi: "Truyền thông thường tập trung vào tin xấu vì nó thu hút nhiều sự chú ý hơn.", more: "**media** là số nhiều của **medium**; đi với động từ số nhiều hoặc số ít đều được (The media **is / are**…). **social media** (mạng xã hội) · **mass media** (truyền thông đại chúng) · **in the media** (trên báo đài). Đọc /ˈmiːdiə/, không phải “mê-đi-a”." },
        { w: "journalist", pos: "n", ipa: "/ˈdʒɜːnəlɪst/", vi: "nhà báo", ex: "The journalist spent three months investigating the story.", exVi: "Nhà báo đã mất ba tháng điều tra câu chuyện.", more: "Họ từ: **journalism** (nghề báo) · **journal** (tạp chí chuyên ngành). Gần nghĩa: **reporter** (phóng viên đưa tin). Trọng âm **JOUR**-na-list." },
        { w: "broadcast", pos: "v / n", ipa: "/ˈbrɔːdkɑːst/", vi: "phát sóng (TV, đài); chương trình phát sóng", ex: "The concert was broadcast live on national television.", exVi: "Buổi hoà nhạc được phát trực tiếp trên truyền hình quốc gia.", more: "Bất quy tắc: broadcast – **broadcast** – **broadcast** (không thêm -ed). **broadcast live** (phát trực tiếp) · a **news broadcast** · **broadcaster** (đài, nhà đài)." },
        { w: "coverage", pos: "n", ipa: "/ˈkʌvərɪdʒ/", vi: "việc đưa tin, lượng tin đưa về một sự kiện", ex: "The election received a lot of media coverage.", exVi: "Cuộc bầu cử được truyền thông đưa tin rất nhiều.", more: "Không đếm được: ~~a coverage~~. **media / news / live** coverage · **receive / get** coverage. Động từ gốc: **cover** a story (đưa tin về một chuyện)." },
        { w: "the press", pos: "n", ipa: "/ðə ˈpres/", vi: "báo chí (các tờ báo và nhà báo nói chung)", ex: "The minister refused to speak to the press after the meeting.", exVi: "Bộ trưởng từ chối trả lời báo chí sau cuộc họp.", more: "**freedom of the press** (tự do báo chí) · **press conference** (họp báo) · **press release** (thông cáo báo chí). Luôn có **the**: ~~speak to press~~." },
        { w: "reliable", pos: "adj", ipa: "/rɪˈlaɪəbl/", vi: "đáng tin cậy", ex: "Always get your news from a reliable source.", exVi: "Hãy luôn lấy tin từ một nguồn đáng tin cậy.", more: "**a reliable source** (nguồn tin đáng tin) · ngược nghĩa **unreliable**. Danh từ: **reliability**. Động từ: **rely on** (dựa vào) — ~~rely in~~." },
        { w: "bias", pos: "n", ipa: "/ˈbaɪəs/", vi: "sự thiên vị, thiên lệch (chỉ đưa một phía)", ex: "Some viewers complained about political bias in the programme.", exVi: "Một số khán giả phàn nàn về sự thiên vị chính trị trong chương trình.", more: "Tính từ: **biased** /ˈbaɪəst/ (thiên vị) — a **biased** report. **bias against / in favour of** sb. Ngược nghĩa: **neutral / balanced / impartial** (trung lập)." },
        { w: "fake news", pos: "n", ipa: "/ˌfeɪk ˈnjuːz/", vi: "tin giả (tin bịa ra, giả làm tin thật)", ex: "Fake news about the disease spread quickly on social media.", exVi: "Tin giả về căn bệnh lan nhanh trên mạng xã hội.", more: "**news** không đếm được, động từ **số ít**: The news **is** good. ~~a fake news~~ → **a piece of fake news / a fake news story**." },
        { w: "misinformation", pos: "n", ipa: "/ˌmɪsɪnfəˈmeɪʃn/", vi: "thông tin sai lệch (sai, dù người chia sẻ có thể không cố ý)", ex: "Doctors are worried about misinformation about vaccines.", exVi: "Các bác sĩ lo ngại về thông tin sai lệch liên quan tới vắc-xin.", more: "Không đếm được. **spread** misinformation (lan truyền) · **tackle / fight** misinformation (chống). Tiền tố **mis-** = sai: misunderstand, misuse, mislead (hệ thống tiền tố: Tập 2 Ngày 4)." },
        { w: "viewer", pos: "n", ipa: "/ˈvjuːə(r)/", vi: "người xem (TV, video)", ex: "The final episode attracted more than ten million viewers.", exVi: "Tập cuối thu hút hơn mười triệu người xem.", more: "Phân biệt: **viewer** (xem TV/video) · **listener** (nghe đài, podcast) · **reader** (đọc báo) · **audience** (khán giả nói chung, danh từ tập hợp). Họ: **view** (lượt xem) — the video got a million **views**." },
      ],
    },
    {
      t: "note",
      title: "Người Việt hay sai với từ tin tức",
      items: [
        "~~a news~~, ~~many news~~ → **news** không đếm được: **a piece of news**, **some news**, **a lot of news**. Động từ số ít: The news **was** shocking.",
        "~~The video has many viewers watch~~ → The video **has** a lot of **viewers** / **views**. **views** = lượt xem (con số), **viewers** = người xem.",
        "“Báo chí đưa tin” ≠ ~~press gives news~~ → **The press reported…** / **The story received media coverage.**",
        "**fake news** (cố ý bịa) gần nghĩa nhưng không trùng **misinformation** (thông tin sai, có thể vô tình). Trong bài viết dùng **misinformation** nghe học thuật hơn.",
      ],
    },

    /* ── 3 ── */
    { t: "h", text: "3. Quảng cáo & mạng xã hội — 10 từ" },
    {
      t: "vocab",
      items: [
        { w: "advertisement", pos: "n", ipa: "/ədˈvɜːtɪsmənt/", vi: "mẩu quảng cáo (một cái cụ thể)", ex: "I saw an advertisement for the new phone on the bus.", exVi: "Tôi thấy một mẩu quảng cáo cho chiếc điện thoại mới trên xe buýt.", more: "Đếm được: **an** advertisement. Nói gọn: **advert** /ˈædvɜːt/ (Anh) · **ad** /æd/. Trọng âm Anh-Anh **ad-VER-tise-ment**; Anh-Mỹ /ˌædvərˈtaɪzmənt/ (ad-ver-TISE-ment). Xem họ từ ở mục 5." },
        { w: "commercial", pos: "n", ipa: "/kəˈmɜːʃl/", vi: "quảng cáo trên truyền hình / đài phát thanh", ex: "The programme was interrupted by commercials every ten minutes.", exVi: "Chương trình bị chen quảng cáo mười phút một lần.", more: "**a TV / radio commercial**. Còn là tính từ: **commercial** = thuộc về buôn bán, vì lợi nhuận (commercial television, a commercial success)." },
        { w: "brand", pos: "n", ipa: "/brænd/", vi: "thương hiệu, nhãn hàng", ex: "Teenagers often want to wear the same brands as their friends.", exVi: "Thanh thiếu niên thường muốn mặc cùng thương hiệu với bạn bè.", more: "**a well-known / global brand** · **brand loyalty** (trung thành với thương hiệu) · **brand-new** (mới tinh — nghĩa khác!)." },
        { w: "slogan", pos: "n", ipa: "/ˈsləʊɡən/", vi: "khẩu hiệu (câu ngắn dễ nhớ của quảng cáo)", ex: "A good slogan is short, simple and easy to remember.", exVi: "Một khẩu hiệu tốt thì ngắn, đơn giản và dễ nhớ.", more: "**an advertising slogan** · **come up with** a slogan (nghĩ ra khẩu hiệu). Trọng âm **SLO**-gan." },
        { w: "campaign", pos: "n", ipa: "/kæmˈpeɪn/", vi: "chiến dịch (quảng cáo, vận động)", ex: "The company launched a new advertising campaign aimed at students.", exVi: "Công ty tung ra một chiến dịch quảng cáo mới nhắm vào sinh viên.", more: "**launch / run** a campaign · an **advertising / election / awareness** campaign. Chữ **g** câm: /kæmˈpeɪn/, trọng âm cam-**PAIGN**." },
        { w: "sponsor", pos: "v / n", ipa: "/ˈspɒnsə(r)/", vi: "tài trợ; nhà tài trợ", ex: "The football tournament is sponsored by a phone company.", exVi: "Giải bóng đá được một hãng điện thoại tài trợ.", more: "**sponsorship** (sự tài trợ) · a **sponsored post** (bài đăng được trả tiền để quảng cáo). Hay dùng bị động: **be sponsored by**." },
        { w: "influencer", pos: "n", ipa: "/ˈɪnfluənsə(r)/", vi: "người có ảnh hưởng (trên mạng xã hội)", ex: "Many brands pay influencers to show their products in videos.", exVi: "Nhiều nhãn hàng trả tiền cho người có ảnh hưởng để giới thiệu sản phẩm trong video.", more: "Gốc **influence** /ˈɪnfluəns/ (sự ảnh hưởng; ảnh hưởng tới) — **influence sb / sth** (không có giới từ: ~~influence to~~) · **have an influence on**. Trọng âm **IN**-flu-en-cer." },
        { w: "target audience", pos: "n", ipa: "/ˌtɑːɡɪt ˈɔːdiəns/", vi: "nhóm khán giả / khách hàng mục tiêu", ex: "The target audience for this advert is parents with young children.", exVi: "Nhóm khán giả mục tiêu của quảng cáo này là cha mẹ có con nhỏ.", more: "**target** còn là động từ: adverts **target** children (nhắm vào trẻ em) · **be aimed at** (= nhắm vào). **audience** là danh từ tập hợp: a large audience (~~many audiences~~ khi nói một buổi)." },
        { w: "clickbait", pos: "n", ipa: "/ˈklɪkbeɪt/", vi: "nội dung “câu view”, tiêu đề giật gân để dụ bấm vào", ex: "“You won't believe what happened next!” is a typical piece of clickbait.", exVi: "“Bạn sẽ không tin chuyện gì xảy ra tiếp theo!” là một kiểu câu view điển hình.", more: "Không đếm được (thường): **clickbait headlines** · **a clickbait title**. Ghép từ **click** (bấm) + **bait** (mồi câu)." },
        { w: "subscription", pos: "n", ipa: "/səbˈskrɪpʃn/", vi: "việc đăng ký (trả phí định kỳ) để đọc/xem", ex: "I have a subscription to an online newspaper.", exVi: "Tôi đăng ký đọc một tờ báo điện tử (trả phí).", more: "**a subscription to** sth (~~of~~) · **pay for / cancel** a subscription. Động từ: **subscribe to** a channel (đăng ký kênh) · **subscriber** (người đăng ký)." },
      ],
    },
    {
      t: "sodo",
      kind: "compare",
      title: "advertisement · commercial · advertising — khác nhau chỗ nào?",
      caption: "Hai từ đầu ĐẾM được (một mẩu quảng cáo cụ thể); advertising là ngành / hoạt động nói chung — KHÔNG đếm được.",
      cols: [
        { title: "**an advertisement / advert / ad**", anh: "placard", items: ["một mẩu quảng cáo bất kỳ (báo, áp phích, mạng)", "an advert **for** a new car", "số nhiều: adverts, ads"] },
        { title: "**a commercial**", anh: "television", items: ["quảng cáo trên **TV / đài**", "a 30-second **TV commercial**", "số nhiều: commercials"] },
        { title: "**advertising**", anh: "megaphone", items: ["**ngành / hoạt động** quảng cáo nói chung", "**Advertising** influences children.", "~~an advertising~~, ~~advertisings~~"] },
      ],
    },

    /* ── 4 ── */
    { t: "h", text: "4. 10 collocation & cụm động từ — học cả cụm" },
    {
      t: "p",
      text: "Như đã học ở Tập 1 Ngày 11 và Tập 2 Ngày 16, **collocation** là những từ “hay đi với nhau” — người bản xứ nói **go viral** chứ không nói ~~become viral fastly~~. Giám khảo chấm **Lexical Resource** rất để ý chuyện này: dùng đúng cụm là dấu hiệu bạn đã vượt band 4.",
    },
    {
      t: "vocab",
      items: [
        { w: "go viral", pos: "phrase", ipa: "/ˌɡəʊ ˈvaɪrəl/", vi: "lan truyền chóng mặt trên mạng", ex: "Her video about street food went viral overnight.", exVi: "Video của cô ấy về đồ ăn đường phố lan truyền chóng mặt chỉ sau một đêm.", more: "Quá khứ: **went** viral. ~~do viral~~, ~~viral fastly~~. **viral** (adj): a **viral** video / post." },
        { w: "make the headlines", pos: "phrase", ipa: "/ˌmeɪk ðə ˈhedlaɪnz/", vi: "lên trang nhất, thành tin nổi bật", ex: "The young scientist made the headlines when she won the prize.", exVi: "Nhà khoa học trẻ thành tin nổi bật khi cô giành giải.", more: "Cũng nói **hit the headlines**. (**headline** = tiêu đề báo, đã học Tập 1.) ~~make headline~~ → phải có **the** + số nhiều." },
        { w: "keep up with", pos: "phr v", ipa: "/ˌkiːp ˈʌp wɪð/", vi: "theo kịp, cập nhật (tin tức, xu hướng)", ex: "I keep up with the news by reading a short summary every morning.", exVi: "Tôi cập nhật tin tức bằng cách đọc một bản tóm tắt mỗi sáng.", more: "**keep up with the news / the latest trends / technology**. Sau giới từ **with** là danh từ hoặc V-ing." },
        { w: "breaking news", pos: "n", ipa: "/ˌbreɪkɪŋ ˈnjuːz/", vi: "tin nóng (vừa mới xảy ra)", ex: "The programme stopped for some breaking news about the storm.", exVi: "Chương trình tạm dừng để đưa tin nóng về cơn bão.", more: "Không đếm được (vì **news**). Động từ: a newspaper **breaks a story** (đưa tin đầu tiên)." },
        { w: "spread misinformation", pos: "phrase", ipa: "/ˌspred ˌmɪsɪnfəˈmeɪʃn/", vi: "lan truyền thông tin sai lệch", ex: "Fake accounts are often used to spread misinformation.", exVi: "Tài khoản giả thường bị dùng để lan truyền thông tin sai lệch.", more: "spread – spread – spread (bất quy tắc, giữ nguyên). Cũng: **spread rumours / fake news**. Danh từ: **the spread of** fake news." },
        { w: "check the facts", pos: "phrase", ipa: "/ˌtʃek ðə ˈfækts/", vi: "kiểm chứng sự thật", ex: "Good journalists always check the facts before they publish a story.", exVi: "Nhà báo giỏi luôn kiểm chứng sự thật trước khi đăng bài.", more: "**fact-check** (v) · **fact-checker** (người/tổ chức kiểm chứng). ~~check the truth~~ ít tự nhiên hơn." },
        { w: "run a campaign", pos: "phrase", ipa: "/ˌrʌn ə kæmˈpeɪn/", vi: "thực hiện, chạy một chiến dịch", ex: "The city is running a campaign to stop drink-driving.", exVi: "Thành phố đang chạy một chiến dịch chống lái xe khi say rượu.", more: "Cũng: **run an advert** (cho chạy quảng cáo) · **launch** a campaign (tung ra). ~~do a campaign~~ ít dùng." },
        { w: "target", pos: "v", ipa: "/ˈtɑːɡɪt/", vi: "nhắm vào (một nhóm người)", ex: "Many fast-food adverts target young children.", exVi: "Nhiều quảng cáo đồ ăn nhanh nhắm vào trẻ nhỏ.", more: "**target** + người (không giới từ): ~~target to children~~ · bị động: **be targeted at** / **be aimed at** children. Danh từ ở mục 3: **target audience**." },
        { w: "tune in (to)", pos: "phr v", ipa: "/ˌtjuːn ˈɪn/", vi: "bật kênh để xem / nghe (một chương trình)", ex: "Millions of people tuned in to watch the final.", exVi: "Hàng triệu người bật kênh xem trận chung kết.", more: "**tune in to** a programme / channel. ~~turn in~~ nghĩa khác (nộp bài; đi ngủ)." },
        { w: "scroll through", pos: "phr v", ipa: "/ˈskrəʊl θruː/", vi: "lướt (màn hình, bảng tin)", ex: "Many people scroll through social media before they go to sleep.", exVi: "Nhiều người lướt mạng xã hội trước khi đi ngủ.", more: "**scroll through** your feed / your phone / the news. **endless scrolling** (lướt không dứt)." },
      ],
    },
    {
      t: "note",
      title: "Cẩn thận: những cụm hay bị “dịch từng chữ”",
      items: [
        "“Lan truyền nhanh” ≠ ~~spread fastly~~ (không có fastly) → **spread quickly / rapidly** hoặc **go viral**.",
        "“Nhắm vào trẻ em” ≠ ~~target to children~~ → **target children** / adverts **aimed at** children.",
        "“Cập nhật tin tức” ≠ ~~update news~~ (câu này là của người đưa tin) → người đọc thì **keep up with the news / follow the news**.",
        "“Xem tin tức” → **watch the news** (TV) · **read the news** (báo) · **get my news from** + nguồn (I get my news from podcasts).",
      ],
    },
    {
      t: "rule",
      formula: "go viral · make the headlines · keep up with + N · spread misinformation · check the facts · run a campaign · target + N (không giới từ) · tune in to + N · scroll through + N",
      vi: "Học và ghi vở cả CỤM; khi viết/nói, lấy nguyên cụm ra dùng thay vì ghép từng chữ.",
    },

    /* ── 5 ── */
    { t: "h", text: "5. Năm họ từ dùng nhiều nhất trong bài viết về truyền thông" },
    {
      t: "table",
      caption: "Họ từ (word family) — chọn đúng LOẠI TỪ là điểm GRA + LR. Chữ in hoa = âm tiết mang trọng âm (Anh-Anh).",
      head: ["Động từ", "Danh từ", "Tính từ", "Ví dụ"],
      rows: [
        ["**AD**vertise", "ad**VER**tisement (đếm được) · **AD**vertising (không đếm được) · **AD**vertiser (người/hãng)", "—", "Companies **advertise** online. · **Advertising** influences children."],
        ["in**FORM**", "infor**MA**tion (không đếm được)", "in**FOR**mative (nhiều thông tin bổ ích) · in**FORMED** (hiểu biết)", "The documentary was very **informative**."],
        ["**IN**fluence", "**IN**fluence · **IN**fluencer", "influ**EN**tial (có ảnh hưởng lớn)", "She is a very **influential** journalist."],
        ["per**SUADE**", "per**SUA**sion", "per**SUA**sive (có sức thuyết phục)", "The advert was very **persuasive**."],
        ["**PUB**lish", "publi**CA**tion (sự xuất bản; ấn phẩm) · **PUB**lisher", "—", "The **publication** of the report was delayed."],
      ],
    },
    {
      t: "vocab",
      items: [
        { w: "advertising", pos: "n", ipa: "/ˈædvətaɪzɪŋ/", vi: "ngành / hoạt động quảng cáo (nói chung)", ex: "Advertising aimed at children should be strictly controlled.", exVi: "Quảng cáo nhắm vào trẻ em cần được kiểm soát chặt chẽ.", more: "Không đếm được, động từ số ít. Gốc **advertise** /ˈædvətaɪz/ (trọng âm **AD**). ~~advertisings~~." },
        { w: "informative", pos: "adj", ipa: "/ɪnˈfɔːmətɪv/", vi: "nhiều thông tin bổ ích", ex: "The museum's website is clear and informative.", exVi: "Trang web của bảo tàng rõ ràng và nhiều thông tin bổ ích.", more: "Phân biệt: **informative** (cung cấp nhiều thông tin) ≠ **informed** (người hiểu biết): well-**informed** citizens." },
        { w: "influential", pos: "adj", ipa: "/ˌɪnfluˈenʃl/", vi: "có ảnh hưởng lớn", ex: "Television is still the most influential medium for older people.", exVi: "Truyền hình vẫn là phương tiện có ảnh hưởng nhất với người lớn tuổi.", more: "Trọng âm **dời** sang -**EN**-: **IN**fluence → influ**EN**tial. **highly influential** (collocation trạng từ + tính từ)." },
        { w: "persuasive", pos: "adj", ipa: "/pəˈsweɪsɪv/", vi: "có sức thuyết phục", ex: "Advertisers use persuasive language to make products look necessary.", exVi: "Nhà quảng cáo dùng ngôn ngữ thuyết phục để làm sản phẩm trông như cần thiết.", more: "Gốc **persuade** (thuyết phục — đã gặp Tập 1): persuade **sb to do** sth. Danh từ: **persuasion**." },
        { w: "publication", pos: "n", ipa: "/ˌpʌblɪˈkeɪʃn/", vi: "sự xuất bản / đăng tải; ấn phẩm (sách, báo)", ex: "The magazine stopped publication after fifty years.", exVi: "Tạp chí ngừng xuất bản sau năm mươi năm.", more: "Gốc **publish** /ˈpʌblɪʃ/ (đăng, xuất bản) · **publisher** (nhà xuất bản). Đuôi **-tion** kéo trọng âm về ngay trước nó: publi**CA**tion." },
      ],
    },
    {
      t: "note",
      title: "Cẩn thận: trọng âm “nhảy” trong họ từ",
      items: [
        "**AD**vertise /ˈædvətaɪz/ → ad**VER**tisement /ədˈvɜːtɪsmənt/ (Anh-Anh). Âm đầu của advertisement đọc nhẹ /əd/, KHÔNG phải /æd/. Người Mỹ nói /ˌædvərˈtaɪzmənt/ — nghe được cả hai trong đề.",
        "**IN**fluence → influ**EN**tial; **PUB**lish → publi**CA**tion: đuôi **-ial** và **-tion** luôn kéo trọng âm về âm tiết **ngay trước** nó.",
        "Viết bài: chủ ngữ chung chung dùng **advertising** (không đếm được): ~~Advertisements influences~~ → **Advertising influences** children / **Advertisements influence** children.",
      ],
    },

    /* ── 6 ── */
    { t: "h", text: "6. Bốn câu mẫu “ăn điểm” — dùng ngay cho Task 2 & Part 3" },
    {
      t: "examples",
      items: [
        { en: "Social media allows misinformation to spread much faster than it did in the past.", vi: "Mạng xã hội khiến thông tin sai lệch lan nhanh hơn nhiều so với trước đây. (allow + O + to V · so sánh much faster)" },
        { en: "Many advertisements target children, who cannot always tell the difference between information and persuasion.", vi: "Nhiều quảng cáo nhắm vào trẻ em, những người không phải lúc nào cũng phân biệt được thông tin và sự thuyết phục. (target + N · tell the difference between A and B)" },
        { en: "If a story goes viral, it can make the headlines even when nobody has checked the facts.", vi: "Nếu một câu chuyện lan truyền chóng mặt, nó có thể thành tin nổi bật ngay cả khi chưa ai kiểm chứng sự thật. (câu điều kiện Ngày 13 + 3 collocation)" },
        { en: "Reliable sources such as public broadcasters help people keep up with the news without being misled by clickbait.", vi: "Những nguồn đáng tin như đài truyền hình công giúp mọi người cập nhật tin tức mà không bị tin câu view đánh lừa." },
      ],
    },
    {
      t: "rule",
      formula: "S (social media / advertising) + allows + O + to V · Adverts target + N, who… · If + S + V(s), S + can + V · help + O + V",
      vi: "Bốn khung câu dùng lại được cho mọi đề truyền thông — thay danh từ là có câu mới.",
    },

    /* ── 7 ── */
    { t: "h", text: "7. Thêm: phát âm /juː/ và /uː/ — news, review, music ↔ true, choose, rumour" },
    {
      t: "p",
      text: "Phần này đề cương không ghi, nhưng rất hợp chủ đề: hầu hết từ truyền thông có âm **/juː/** (news, review, viewer, YouTube, music, computer). **/juː/** = âm **/j/** (như “i” lướt rất nhanh, giống “y” trong “yes”) dính liền **/uː/** (u dài). **/uː/** thì không có /j/: true, choose, rumour, food.",
    },
    {
      t: "table",
      head: ["Âm", "Cách đọc", "Từ hay gặp", "Chữ viết thường gặp"],
      rows: [
        ["**/juː/**", "“diu” rất nhanh: lưỡi chạm nhẹ vị trí “i” rồi tròn môi kéo dài “u”", "news /njuːz/ · review /rɪˈvjuː/ · viewer /ˈvjuːə/ · music /ˈmjuːzɪk/ · computer /kəmˈpjuːtə/ · YouTube /ˈjuːtjuːb/", "**ew, iew, u-e, eu, u** đứng sau p, b, m, f, v, k, h (few, view, use, cute, Europe, human)"],
        ["**/uː/**", "tròn môi, kéo dài “u”, KHÔNG có /j/ ở trước", "true /truː/ · choose /tʃuːz/ · rumour /ˈruːmə/ · food /fuːd/ · June /dʒuːn/", "**oo**; **u / ue / ew** đứng sau **r, ch, j, l** (rule, blue, chew, June)"],
        ["Anh-Anh vs Anh-Mỹ", "Sau **t, d, n**: Anh-Anh thường giữ /j/, Anh-Mỹ bỏ", "news UK /njuːz/ – US /nuːz/ · tune UK /tjuːn/ – US /tuːn/ · student UK /ˈstjuːdnt/ – US /ˈstuːdnt/", "Nghe đề có thể gặp cả hai — đều đúng"],
      ],
    },
    {
      t: "note",
      title: "Người Việt hay sai",
      items: [
        "Thêm /j/ vào chỗ không có: true đọc thành ~~“triu”~~, choose thành ~~“chiu-z”~~. Sau **r, ch, j** không bao giờ có /j/.",
        "Bỏ mất /j/ ở chỗ cần có: music đọc thành ~~“mú-zic”~~, computer thành ~~“com-pú-tơ”~~ → phải có “miu”, “piu”.",
        "Nuốt âm cuối **/z/** của **news** /njuːz/ và **views** /vjuːz/: giám khảo nghe thành “new” (mới) — đổi cả nghĩa.",
        "**/uː/** là nguyên âm DÀI: kéo khoảng gấp đôi “u” tiếng Việt; good /ɡʊd/ thì ngắn — đừng kéo.",
      ],
    },
    {
      t: "phatam",
      id: "t2d18-phat-am",
      title: "Luyện phát âm — /juː/ (news, music) và /uː/ (true, choose)",
      note: "Bấm “Nghe mẫu”, rồi “Đọc & chấm”. Ba dòng đầu luyện từng nhóm; năm dòng sau đọc trong câu nói về tin tức. Giữ rõ /j/ ở news, music, review; KHÔNG chèn /j/ vào true, choose, rumour.",
      items: [
        { text: "news, new, review, viewer", ipa: "njuːz njuː rɪvjuː vjuːə", vi: "/juː/ — có /j/; news kết thúc bằng /z/" },
        { text: "music, computer, community", ipa: "mjuːzɪk kəmpjuːtə kəmjuːnəti", vi: "/juː/ sau m, p — MU-sic · com-PU-ter · com-MU-ni-ty" },
        { text: "true, choose, rumour, food", ipa: "truː tʃuːz ruːmə fuːd", vi: "/uː/ — không có /j/ sau r, ch" },
        { text: "I watch the news on YouTube every Tuesday.", ipa: "aɪ wɒtʃ ðə njuːz ɒn juːtjuːb evri tjuːzdeɪ", vi: "giọng Anh-Anh: news /njuːz/, Tuesday /tjuː/" },
        { text: "The review was true, but the rumour was not.", ipa: "ðə rɪvjuː wəz truː bʌt ðə ruːmə wəz nɒt", vi: "/juː/ ↔ /uː/ đứng sát nhau" },
        { text: "New viewers often choose short music videos.", ipa: "njuː vjuːəz ɒfn tʃuːz ʃɔːt mjuːzɪk vɪdiəʊz", vi: "ba /juː/ + một /uː/" },
        { text: "Students should check the news before they share it.", ipa: "stjuːdnts ʃʊd tʃek ðə njuːz bɪfɔː ðeɪ ʃeər ɪt", vi: "student /stjuː/ · should /ʊ/ ngắn" },
        { text: "Few people knew that the story was untrue.", ipa: "fjuː piːpl njuː ðət ðə stɔːri wəz ʌntruː", vi: "few, knew /juː/ · untrue /uː/" },
      ],
    },

    /* ── 8 ── */
    { t: "h", text: "8. Luyện tập" },
    {
      t: "quiz",
      id: "t2d18-tv-dien",
      title: "Điền từ — tin tức & quảng cáo (8 câu)",
      kind: "fill",
      items: [
        { q: "A ___ is a person who writes news stories for a newspaper or a website. (nhà báo)", answers: ["journalist", "reporter"] },
        { q: "The ___ were not allowed into the courtroom, so no photos were taken. (báo chí — 1 từ)", answers: ["press", "media", "journalists", "reporters"] },
        { q: "The final match received huge media ___: it was on every channel. (lượng tin đưa)", answers: ["coverage"] },
        { q: "More than two million ___ watched the last episode of the series. (người xem)", answers: ["viewers"] },
        { q: "Before the holiday season, the shop ran a big advertising ___. (chiến dịch)", answers: ["campaign"] },
        { q: "“Think different” is one of the most famous advertising ___ in history. (khẩu hiệu — số nhiều)", answers: ["slogans"] },
        { q: "I cancelled my ___ to the news website because I rarely read it. (việc đăng ký trả phí)", answers: ["subscription"] },
        { q: "Sharing ___ about medicine online can put people's health at risk. (thông tin sai lệch — 1 từ)", answers: ["misinformation"] },
      ],
    },
    {
      t: "note",
      title: "Giải thích đáp án điền từ",
      items: [
        "(1) **journalist** (reporter cũng đúng nghĩa). (2) **press** (media cũng đúng: the media were…) — “the press” = giới báo chí; động từ **were** số nhiều vì nói về các nhà báo (the press **was / were** đều gặp). (3) **coverage** — không đếm được, đi với **media**.",
        "(4) **viewers** — người xem TV (số nhiều sau two million). (5) **campaign** — **run an advertising campaign**. (6) **slogans** — one of the + danh từ **số nhiều**.",
        "(7) **subscription to** + trang/báo. (8) **misinformation** — không đếm được, không thêm -s.",
      ],
    },
    {
      t: "mcq",
      id: "t2d18-tv-colloc",
      title: "Chọn collocation đúng (6 câu)",
      items: [
        { q: "Her story about the flood ___ the headlines in every newspaper.", options: ["took", "did", "made"], correct: 2, why: "Cụm cố định **make the headlines** (thành tin nổi bật). ~~take / do the headlines~~ không tồn tại." },
        { q: "Only a few minutes after it was posted, the clip ___ viral.", options: ["went", "made", "got"], correct: 0, why: "**go viral** → quá khứ **went viral**. make / get không đi với viral." },
        { q: "Many news websites use shocking headlines to ___ young readers.", options: ["reach at", "target", "aim"], correct: 1, why: "**target + N** (không giới từ). **aim** phải có **at** (aim at young readers) — thiếu at nên sai; **reach at** không tồn tại (reach + N)." },
        { q: "I don't watch TV, but I ___ up with the news through podcasts.", options: ["hold", "keep", "stay"], correct: 1, why: "**keep up with the news** = cập nhật tin tức. hold up = trì hoãn / chặn; stay up = thức khuya." },
        { q: "The government started a campaign to stop people from ___ misinformation online.", options: ["spreading", "saying", "telling"], correct: 0, why: "**spread misinformation** (lan truyền thông tin sai). tell / say không đi với misinformation; sau from dùng **V-ing**." },
        { q: "Thousands of fans ___ in to watch the interview live.", options: ["switched", "turned", "tuned"], correct: 2, why: "**tune in (to)** = bật kênh để xem/nghe. **turn in** = nộp bài / đi ngủ; **switch in** không phải cụm động từ (chỉ có switch on / off)." },
      ],
    },
    {
      t: "quiz",
      id: "t2d18-tv-dich",
      title: "Dịch sang tiếng Anh — từ vựng truyền thông (4 câu)",
      kind: "translate",
      grammar: "Dùng đúng cụm: commercial / advert · influencer with + số followers · keep up with the news · sponsor + N",
      items: [
        { q: "Quảng cáo trên truyền hình thường rất đắt.", hint: "TV commercials, are often, very expensive", answers: ["TV commercials are often very expensive.", "Television commercials are often very expensive.", "TV adverts are often very expensive.", "TV advertisements are often very expensive.", "Advertisements on TV are often very expensive.", "Adverts on TV are often very expensive.", "Commercials on TV are often very expensive.", "TV ads are often very expensive.", "TV advertising is often very expensive.", "Television advertising is often very expensive.", "TV commercials are usually very expensive.", "TV adverts are usually very expensive.", "TV advertisements are usually very expensive.", "TV advertising is usually very expensive."] },
        { q: "Cô ấy là một người có ảnh hưởng với hai triệu người theo dõi.", hint: "an influencer, with two million followers", answers: ["She is an influencer with two million followers.", "She's an influencer with two million followers.", "She is an influencer with 2 million followers.", "She is an influencer who has two million followers.", "She is an influencer that has two million followers."] },
        { q: "Nhiều người trẻ cập nhật tin tức qua mạng xã hội.", hint: "Many young people, keep up with the news, through / on social media", answers: ["Many young people keep up with the news through social media.", "Many young people keep up with the news on social media.", "Many young people keep up with the news via social media.", "A lot of young people keep up with the news through social media.", "A lot of young people keep up with the news on social media.", "Many young people keep up with news through social media.", "Many young people keep up with news on social media."] },
        { q: "Công ty đó tài trợ cho một đội bóng đá địa phương.", hint: "That company, sponsors, a local football team", answers: ["That company sponsors a local football team.", "The company sponsors a local football team.", "That company sponsors a local soccer team.", "That firm sponsors a local football team."] },
      ],
    },
  ],
};

/* ─────────────────────────── Đọc ─────────────────────────── */

const T2D18_DOC: Lesson = {
  id: "t2d18-doc",
  kind: "reading",
  title: "Đọc: Matching sentence endings (nối đầu câu với đuôi câu)",
  goal: "Làm đúng dạng Matching sentence endings — tìm vị trí bằng đầu câu, loại đuôi sai ngữ pháp và đuôi “đúng trong bài nhưng không khớp” — trên một bài đọc ~710 từ cỡ Passage 2, nhắm Reading band 5.0 (≥ 15/40).",
  minutes: 70,
  blocks: [
    {
      t: "recap",
      title: "Bài này học gì",
      items: [
        "**Matching sentence endings** = đề cho **nửa đầu** của câu (1, 2, 3…) và một danh sách **đuôi câu** (A, B, C…). Bạn ghép để câu hoàn chỉnh **đúng ngữ pháp VÀ đúng nội dung bài**.",
        "Hai điều có lợi: **đầu câu đi theo thứ tự bài** (câu 1 ở đầu bài, câu 6 ở cuối) và **số đuôi nhiều hơn số câu** (có 2–3 đuôi thừa).",
        "Quy trình 5 bước: ==gạch từ khoá đầu câu → tìm chỗ trong bài → đọc kỹ 2–3 câu quanh đó → tự nghĩ đuôi → chọn đuôi khớp nghĩa và ngữ pháp==.",
        "Ba loại đuôi nhiễu: **sai ngữ pháp** với đầu câu · **đúng sự thật trong bài nhưng nói về chuyện khác** · **dùng từ trùng bài nhưng đổi ý**.",
        "Đẩy band nào: Reading band 5 — làm được **mọi dạng** câu hỏi ở Passage 1–2; dạng này thường nằm ở **Passage 2**, mỗi câu đúng là một điểm thô dễ lấy nếu đi đúng quy trình.",
      ],
    },

    /* ── 1 ── */
    { t: "h", text: "1. Matching sentence endings trông thế nào?" },
    {
      t: "p",
      text: "Lời dẫn trong đề luôn có dạng: **“Complete each sentence with the correct ending, A–H, below. Write the correct letter, A–H, in boxes 1–6 on your answer sheet.”** — **Hoàn thành mỗi câu bằng đuôi câu đúng, A–H, bên dưới. Viết chữ cái đúng vào ô 1–6 trên phiếu trả lời.** Bạn chỉ viết **chữ cái** (C, E…), không chép cả đuôi câu.",
    },
    {
      t: "table",
      caption: "Những điều chắc chắn về dạng bài này",
      head: ["Đặc điểm", "Nghĩa là", "Tận dụng thế nào"],
      rows: [
        ["Đầu câu **theo thứ tự** bài đọc", "Câu 2 nằm sau câu 1 trong bài", "Tìm được câu 1 và câu 3 thì câu 2 nằm **giữa** hai chỗ đó"],
        ["Số đuôi **nhiều hơn** số câu", "Có 2–3 đuôi không dùng", "Đừng cố ghép đuôi nào cũng phải dùng"],
        ["Mỗi đuôi dùng **một lần**", "Hai câu không chung một đuôi", "Đuôi đã chắc chắn dùng thì gạch đi"],
        ["Đuôi **không** theo thứ tự", "Đuôi A có thể là đáp án câu 5", "Đọc lướt CẢ danh sách đuôi trước khi bắt đầu"],
        ["Đuôi là **paraphrase** của bài", "Ít khi trùng nguyên văn", "Tìm **ý**, không tìm từ giống hệt"],
      ],
    },

    /* ── 2 ── */
    { t: "h", text: "2. Chiến thuật 5 bước" },
    {
      t: "sodo",
      kind: "flow",
      title: "Một câu Matching sentence endings — 5 bước",
      caption: "Bước 4 là bí quyết: tự đoán đuôi TRƯỚC khi nhìn danh sách, bạn sẽ không bị đuôi nhiễu “dắt đi”.",
      steps: [
        { label: "1. Gạch từ khoá đầu câu", sub: "tên riêng, con số, danh từ chính — thứ khó paraphrase" },
        { label: "2. Tìm vị trí trong bài", sub: "đi theo thứ tự: sau chỗ của câu trước" },
        { label: "3. Đọc kỹ 2–3 câu", sub: "câu chứa từ khoá + câu trước, câu sau" },
        { label: "4. Tự đoán đuôi", sub: "bài nói gì tiếp theo? cần loại từ gì?" },
        { label: "5. Chọn đuôi khớp", sub: "đúng NGHĨA bài + đúng NGỮ PHÁP; gạch đuôi đã dùng" },
      ],
    },
    {
      t: "p",
      text: "**Bước 4 — đoán ngữ pháp của đuôi.** Từ cuối của đầu câu cho biết đuôi phải bắt đầu bằng gì. Đây là cách loại nhanh 2–3 đuôi mà **chưa cần đọc bài**.",
    },
    {
      t: "table",
      head: ["Đầu câu kết thúc bằng…", "Đuôi phải là…", "Ví dụ đuôi hợp"],
      rows: [
        ["**by / without / after / before** (giới từ)", "**V-ing** hoặc danh từ", "…by **comparing** the two reports."],
        ["**to** (chỉ mục đích / sau want, help, need…)", "**V nguyên mẫu**", "…in order to **attract** more readers."],
        ["**because / when / although / that**", "một **mệnh đề** đủ S + V", "…because **they do not check** the facts."],
        ["**because of / due to**", "**danh từ / cụm danh từ**", "…because of **the high cost**."],
        ["chủ ngữ số nhiều chưa có động từ (Many websites…)", "**động từ** chia số nhiều", "…**earn** money from adverts."],
      ],
    },
    {
      t: "rule",
      formula: "Đầu câu (từ khoá) → vị trí trong bài (theo thứ tự) → tự đoán đuôi → loại đuôi sai ngữ pháp → chọn đuôi đúng NGHĨA bài",
      vi: "Một đuôi đúng phải qua CẢ hai cửa: khớp ngữ pháp với đầu câu và nói đúng điều bài viết khẳng định.",
    },

    /* ── 3 ── */
    { t: "h", text: "3. Ba loại đuôi nhiễu — nhận mặt để không bị lừa" },
    {
      t: "sodo",
      kind: "compare",
      title: "Đuôi nhiễu (distractors) — ba kiểu",
      caption: "Kiểu 2 nguy hiểm nhất: đuôi đó ĐÚNG sự thật trong bài, nên đọc lên thấy quen và “có vẻ đúng”.",
      cols: [
        { title: "**1. Sai ngữ pháp**", anh: "cross-mark", items: ["Đầu câu: …by", "Đuôi: ~~they check the facts.~~", "→ sau by cần V-ing: **checking** the facts"] },
        { title: "**2. Đúng trong bài, sai đầu câu**", anh: "warning", items: ["Bài có nói ý này", "nhưng về **người / thời điểm / nguyên nhân khác**", "→ hỏi: bài có nối HAI ý này với nhau không?"] },
        { title: "**3. Trùng từ, đổi ý**", anh: "lying-face", items: ["Có từ giống hệt trong bài", "nhưng đảo nghĩa (more ↔ less, before ↔ after)", "hoặc thêm ý bài không nói"] },
      ],
    },
    {
      t: "note",
      title: "Cẩn thận: người Việt hay sai ở dạng này",
      items: [
        "Chọn đuôi vì thấy **từ trùng** với bài — đúng kiểu nhiễu số 3. Luôn đặt câu hỏi: **ghép xong cả câu, bài có nói đúng như vậy không?**",
        "Chỉ đọc đầu câu rồi chọn theo “kiến thức đời sống” (nghe hợp lý là chọn). Đáp án phải dựa trên **bài**, không dựa trên điều bạn tin là đúng ngoài đời.",
        "Quên rằng đầu câu đi theo thứ tự → tìm lại từ đầu bài mỗi câu, mất thời gian. Câu sau luôn bắt đầu tìm **từ chỗ câu trước dừng**.",
        "Viết cả đuôi câu vào phiếu thay vì **chữ cái** → mất thời gian, dễ chép sai.",
      ],
    },

    /* ── 4 ── */
    { t: "h", text: "4. Ví dụ giải mẫu" },
    {
      t: "examples",
      items: [
        { en: "Passage: Radio was once the main source of news in many homes. In the 1930s, families gathered in the evening to listen to news programmes together. Television replaced radio as the most popular source in the 1960s, but radio did not disappear. Instead, stations began to focus on music and local information, which listeners could enjoy while driving or working.", vi: "Bài đọc: Đài từng là nguồn tin chính trong nhiều gia đình. Những năm 1930, các gia đình quây quần buổi tối để cùng nghe chương trình thời sự. Truyền hình thay thế đài làm nguồn phổ biến nhất vào thập niên 1960, nhưng đài không biến mất. Thay vào đó, các đài chuyển sang tập trung vào âm nhạc và thông tin địa phương, thứ người nghe có thể thưởng thức trong lúc lái xe hay làm việc." },
        { en: "1. Television became more popular than radio …   2. Radio stations survived by …", vi: "1. Truyền hình trở nên phổ biến hơn đài …   2. Các đài phát thanh tồn tại được nhờ …" },
        { en: "A in the 1960s.   B because families stopped listening together.   C changing the kind of programmes they offered.   D playing news programmes every evening.", vi: "A vào thập niên 1960.   B vì các gia đình không còn nghe cùng nhau.   C thay đổi loại chương trình họ phát.   D phát chương trình thời sự mỗi tối." },
      ],
    },
    {
      t: "table",
      caption: "Lời giải — làm theo 5 bước",
      head: ["Câu", "Đáp án", "Vì sao", "Đuôi nhiễu bị loại thế nào"],
      rows: [
        ["1", "**A**", "“Television **replaced** radio as the most popular source **in the 1960s**” = trở nên phổ biến hơn đài vào thập niên 1960.", "**B** khớp ngữ pháp (because + mệnh đề) nhưng bài **không** nói lý do là gia đình thôi nghe chung → nhiễu kiểu 2/3 (ý “families… together” có trong bài nhưng nói về thập niên 1930)."],
        ["2", "**C**", "Sau **by** cần V-ing. Bài: “stations **began to focus on music and local information**” = **changing the kind of programmes**.", "**D** cũng là V-ing nhưng “news programmes every evening” là chuyện **thập niên 1930**, không phải cách đài sống sót → nhiễu kiểu 2."],
      ],
    },

    /* ── 5 ── */
    { t: "h", text: "5. Luyện nhanh: chọn đuôi đúng NGỮ PHÁP" },
    {
      t: "p",
      text: "Chưa cần bài đọc — chỉ nhìn **từ cuối** của đầu câu để biết đuôi phải bắt đầu bằng loại từ nào (bảng mục 2).",
    },
    {
      t: "mcq",
      id: "t2d18-doc-ngu-phap",
      title: "Đuôi nào ghép được về ngữ pháp? (4 câu)",
      items: [
        { q: "The new law requires influencers to …", options: ["labelling sponsored posts clearly.", "label sponsored posts clearly.", "sponsored posts are labelled clearly."], correct: 1, why: "**require sb to + V nguyên mẫu** → **label**. A là V-ing (cần sau giới từ); C là một mệnh đề — không đứng sau “to”." },
        { q: "Journalists check their sources in order to …", options: ["avoid spreading false information.", "false information.", "avoiding false information."], correct: 0, why: "**in order to + V nguyên mẫu** → **avoid** (và avoid + V-ing: avoid **spreading**). B thiếu động từ; C là V-ing sau to — sai." },
        { q: "Readers trust a newspaper more when …", options: ["reliable sources.", "to quote reliable sources.", "its articles quote reliable sources."], correct: 2, why: "**when** là liên từ → cần một **mệnh đề** S + V: **its articles quote**… A chỉ là cụm danh từ; B là to V, không đứng sau when." },
        { q: "Clickbait headlines are designed …", options: ["make readers curious.", "making readers curious.", "to make readers curious."], correct: 2, why: "**be designed to + V** (được thiết kế để…). A thiếu to; B là V-ing — sai sau designed khi nói mục đích." },
      ],
    },

    /* ── 6 ── */
    { t: "h", text: "6. Bài luyện cỡ Passage 2 — 13 câu, 20 phút" },
    {
      t: "p",
      text: "Đặt đồng hồ **20 phút** như thi thật. Đọc lướt bài 2–3 phút (mỗi đoạn nói gì), rồi làm lần lượt ba nhóm câu hỏi. Nhóm **1–6** là dạng mới; **7–10** (True / False / Not Given) và **11–13** (điền câu) là dạng đã học — ôn lại luôn.",
    },
    {
      t: "passage",
      title: "Why False Stories Travel Faster",
      intro: "Bài đọc 7 đoạn A–G (~710 từ). Questions 1–13 ở ngay bên dưới. Số liệu và nhân vật nghiên cứu là tự đặt cho bài luyện.",
      paras: [
        { label: "A", text: "Every day, millions of people share news stories online without reading more than the headline. Most of these stories are accurate, but a significant number are not. In 2021, a team of researchers at Westbridge University set out to measure how false stories behave once they are released. They examined around 90,000 stories that had been shared on one large social media platform over a period of five years, and checked each one against the reports of independent fact-checking organisations. They then compared how quickly each story spread and how many people it reached. Their main finding was striking: false stories reached 1,000 people roughly five times faster than true ones, and they were passed on by far more users." },
        { label: "B", text: "Why should this be the case? According to Dr Helen Marsh, who led the study, the answer lies partly in novelty. “False stories are usually more surprising than true ones,” she explains, “because they are not limited by what actually happened.” People enjoy passing on information that seems new, as it makes them look well-informed. The team also analysed the replies that users wrote underneath each story. Replies to false stories more often expressed surprise, fear or anger, while replies to true stories more often expressed sadness or trust. Strong emotions, Marsh argues, encourage people to share before they think." },
        { label: "C", text: "Before the study began, many observers believed that automated accounts, known as bots, were mainly responsible for spreading false information. The researchers tested this idea by removing all suspected bot accounts from their data and running the analysis again. The result hardly changed. Bots shared true and false stories at about the same rate, so the difference had to come from ordinary human users. Bots did help some stories to start moving, but once a story had reached a few hundred real people, it was human sharing that carried it further. “It is comfortable to blame machines,” Marsh says, “but the problem is us.”" },
        { label: "D", text: "False news is not a product of the internet age. In 1835, a New York newspaper, The Sun, published a series of articles claiming that a famous astronomer had observed strange creatures living on the Moon. The stories were invented, yet thousands of readers believed them, and the paper became one of the most widely read in the city. Other newspapers even reprinted the articles without checking them. What has changed since then is speed. A rumour that once took weeks to cross a country can now reach millions of screens in a single afternoon." },
        { label: "E", text: "Money also plays a part. Many websites earn income from advertisers according to the number of people who visit their pages. This gives them a reason to write headlines that make readers curious enough to click, a practice known as clickbait. Some sites even pay their writers according to the number of clicks each article receives rather than its quality. Professor Tom Adeyemi, a media economist, points out that a misleading headline costs almost nothing to produce, whereas a carefully checked report may take a journalist several days. “When attention is the product,” he says, “accuracy becomes an expensive extra.”" },
        { label: "F", text: "Several solutions have been tried. Some platforms now attach warning labels to stories that fact-checkers have rated as false. Research suggests that these labels do reduce sharing, but they usually appear too late: by the time a story has been checked, most of the people who will ever see it have already done so. For this reason, some educators prefer an approach called “prebunking”. Instead of correcting a story after it spreads, prebunking teaches people the common tricks of misinformation in advance, such as fake experts or emotional language. In one experiment, young people who played a short online game based on these tricks became noticeably better at recognising misleading posts, and the effect lasted for several weeks." },
        { label: "G", text: "Individual users can also make a difference. In a recent trial, people who were simply asked to judge whether a single headline was accurate later shared fewer false stories than people who were not asked. Marsh believes the lesson is simple: “Most people do not want to spread lies. They just forget to ask whether something is true. A short pause before pressing ‘share’ may be the most effective tool we have.”" },
      ],
    },
    {
      t: "p",
      text: "**Questions 1–6.** Complete each sentence with the correct ending, **A–I**, below. Write the correct letter, **A–I**. — **Hoàn thành mỗi câu bằng đuôi câu đúng, A–I. Viết chữ cái đúng.**",
    },
    {
      t: "table",
      caption: "Sentence beginnings 1–6 · Endings A–I (có 3 đuôi thừa)",
      head: ["", "Đầu câu (1–6) / Đuôi câu (A–I)"],
      rows: [
        ["**1**", "The Westbridge researchers decided whether each story was true by …"],
        ["**2**", "According to Dr Marsh, false stories tend to be more surprising because …"],
        ["**3**", "When the researchers removed bot accounts from their data, they found that …"],
        ["**4**", "The 1835 articles in The Sun showed that …"],
        ["**5**", "Professor Adeyemi suggests that websites which depend on advertising …"],
        ["**6**", "The young people who played the online game …"],
        ["**A**", "have little financial reason to spend time checking facts."],
        ["**B**", "bots shared false stories much more often than true ones."],
        ["**C**", "comparing it with the work of independent fact-checkers."],
        ["**D**", "improved their ability to recognise misleading posts."],
        ["**E**", "they do not have to match real events."],
        ["**F**", "asking users about the accuracy of every story they shared."],
        ["**G**", "false stories could attract large numbers of readers long before the internet."],
        ["**H**", "warning labels usually appear before a story spreads widely."],
        ["**I**", "the main result stayed almost the same."],
      ],
    },
    {
      t: "quiz",
      id: "t2d18-doc-noi-duoi",
      title: "Questions 1–6 — Matching sentence endings (viết một chữ cái A–I)",
      kind: "fill",
      items: [
        { q: "(1) The Westbridge researchers decided whether each story was true by …", answers: ["C"] },
        { q: "(2) According to Dr Marsh, false stories tend to be more surprising because …", answers: ["E"] },
        { q: "(3) When the researchers removed bot accounts from their data, they found that …", answers: ["I"] },
        { q: "(4) The 1835 articles in The Sun showed that …", answers: ["G"] },
        { q: "(5) Professor Adeyemi suggests that websites which depend on advertising …", answers: ["A"] },
        { q: "(6) The young people who played the online game …", answers: ["D"] },
      ],
    },
    {
      t: "p",
      text: "**Questions 7–10.** Do the following statements agree with the information given in the passage? Choose **TRUE** if the statement agrees with the information, **FALSE** if the statement contradicts the information, **NOT GIVEN** if there is no information on this.",
    },
    {
      t: "mcq",
      id: "t2d18-doc-tfng",
      title: "Questions 7–10 — True / False / Not Given",
      items: [
        { q: "(7) The Westbridge team studied stories from several different social media platforms.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 1, why: "Đoạn **A**: “shared on **one** large social media platform”. one ≠ several → **FALSE**." },
        { q: "(8) Replies to true stories showed trust more often than replies to false stories did.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 0, why: "Đoạn **B**: “replies to **true** stories more often expressed **sadness or trust**” (còn tin giả thì surprise, fear, anger) → **TRUE**." },
        { q: "(9) The Sun was punished after readers discovered that its stories were invented.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 2, why: "Đoạn **D** chỉ nói câu chuyện là bịa và tờ báo trở nên được đọc nhiều — **không** nói gì về việc bị phạt → **NOT GIVEN**. Bẫy: từ invented có trong bài." },
        { q: "(10) The benefit of the prebunking game disappeared after a few days.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 1, why: "Đoạn **F**: “the effect **lasted for several weeks**” — ngược với “disappeared after a few days” → **FALSE**." },
      ],
    },
    {
      t: "p",
      text: "**Questions 11–13.** Complete the sentences below. Choose **ONE WORD ONLY** from the passage for each answer. — **Hoàn thành câu. Chọn CHỈ MỘT TỪ trong bài.**",
    },
    {
      t: "quiz",
      id: "t2d18-doc-dien",
      title: "Questions 11–13 — Sentence completion (ONE WORD ONLY)",
      kind: "fill",
      items: [
        { q: "(11) According to Marsh, users are more likely to share before thinking when a story causes strong ___.", answers: ["emotions"] },
        { q: "(12) A misleading headline costs almost ___ to produce.", answers: ["nothing"] },
        { q: "(13) Marsh says a short ___ before sharing may be the most effective tool available.", answers: ["pause"] },
      ],
    },

    /* ── 7 ── */
    { t: "h", text: "7. Giải thích đáp án và từ hữu ích" },
    {
      t: "note",
      title: "Giải thích đáp án 1–6 (nối đuôi câu)",
      items: [
        "**(1) C** — Đoạn A: “checked each one **against the reports of independent fact-checking organisations**” = **comparing it with the work of independent fact-checkers**. Sau **by** cần V-ing → C hoặc F. **F** (asking users…) đúng ngữ pháp nhưng bài **không** nói nhóm hỏi người dùng → nhiễu kiểu 3 (từ “users” có trong bài).",
        "**(2) E** — Đoạn B: “because they are **not limited by what actually happened**” = **they do not have to match real events**. Sau **because** cần mệnh đề → E, B, G, H, I đều hợp ngữ pháp, nhưng chỉ E nói đúng lý do Marsh đưa ra.",
        "**(3) I** — Đoạn C: “The result **hardly changed**” = **the main result stayed almost the same**. **B** (bots shared false stories much more often) là nhiễu kiểu 3: bài nói ngược lại — bots chia sẻ thật và giả **ngang nhau** (at about the same rate).",
        "**(4) G** — Đoạn D: báo năm 1835 bịa chuyện mà “thousands of readers believed them… became one of the most widely read” + câu đầu “False news is **not a product of the internet age**” = **could attract large numbers of readers long before the internet**.",
        "**(5) A** — Đoạn E: tiêu đề sai “costs almost nothing” còn bài kiểm chứng “may take a journalist several days” → “accuracy becomes an **expensive extra**” = **little financial reason to spend time checking facts**. Đầu câu có chủ ngữ số nhiều “websites…” chưa có động từ → cần đuôi bắt đầu bằng **động từ số nhiều**: chỉ **A** (have) và **D** (improved) hợp; D nói về người chơi game, không phải trang web.",
        "**(6) D** — Đoạn F: “became noticeably **better at recognising misleading posts**” = **improved their ability to recognise misleading posts**. **H** (warning labels appear before a story spreads) vừa **không ghép được ngữ pháp** với đầu câu 6 (đầu câu là chủ ngữ chưa có động từ, H lại là một mệnh đề có chủ ngữ riêng), vừa là nhiễu kiểu 3: bài nói nhãn cảnh báo thường xuất hiện **quá muộn** (too late).",
        "Ba đuôi thừa: **B** (trái đoạn C) · **F** (bài không nói) · **H** (trái đoạn F). Không đuôi thừa nào nói đúng điều bài khẳng định.",
      ],
    },
    {
      t: "note",
      title: "Giải thích 11–13 và nhìn lại thứ tự",
      items: [
        "**(11) emotions** — Đoạn B: “**Strong emotions**… encourage people to share before they think”. Đề viết causes strong ___ → danh từ số nhiều **emotions** (một từ).",
        "**(12) nothing** — Đoạn E: “a misleading headline **costs almost nothing** to produce”. Chỉ một từ; không viết ~~almost nothing~~ (almost đã có sẵn).",
        "**(13) pause** — Đoạn G: “**A short pause** before pressing ‘share’ may be the most effective tool we have”. most effective tool available = paraphrase của the most effective tool we have.",
        "Thứ tự: 1–6 đi A → B → C → D → E → F; 7–10 đi A → B → D → F; 11–13 đi B → E → G. Mỗi nhóm câu hỏi **tự** đi theo thứ tự bài, nhóm sau lại bắt đầu từ đầu bài.",
      ],
    },
    {
      t: "vocab",
      items: [
        { w: "misleading", pos: "adj", ipa: "/ˌmɪsˈliːdɪŋ/", vi: "gây hiểu lầm, đánh lừa", ex: "The headline was misleading: the article said something quite different.", exVi: "Tiêu đề gây hiểu lầm: bài báo nói một điều khá khác.", more: "Động từ **mislead** – misled – misled (đánh lừa). a **misleading** headline / claim / advert." },
        { w: "rumour", pos: "n", ipa: "/ˈruːmə(r)/", vi: "tin đồn", ex: "There is a rumour that the shop will close next month.", exVi: "Có tin đồn rằng cửa hàng sẽ đóng cửa tháng sau.", more: "**spread / hear a rumour** · **a rumour that** + mệnh đề. Mỹ viết **rumor**. Âm /uː/ (không có /j/)." },
        { w: "accuracy", pos: "n", ipa: "/ˈækjərəsi/", vi: "độ chính xác", ex: "Journalists must check the accuracy of every number they report.", exVi: "Nhà báo phải kiểm tra độ chính xác của mọi con số họ đưa tin.", more: "Tính từ **accurate** /ˈækjərət/ (đã gặp trong bài đọc) · ngược nghĩa **inaccurate / inaccuracy**. Trọng âm **AC**-cu-ra-cy." },
        { w: "novelty", pos: "n", ipa: "/ˈnɒvlti/", vi: "sự mới lạ", ex: "The novelty of the app soon wore off, and people stopped using it.", exVi: "Sự mới lạ của ứng dụng nhanh chóng phai đi và người ta thôi dùng nó.", more: "Gốc **novel** (adj: mới lạ; n: tiểu thuyết). **the novelty wears off** (hết mới lạ)." },
      ],
    },
  ],
};

/* ─────────────────────────── Viết ─────────────────────────── */

const T2D18_VIET: Lesson = {
  id: "t2d18-viet",
  kind: "writing",
  title: "Viết: Two-part question essay (đề hai câu hỏi trực tiếp)",
  goal: "Nhận ra đề Two-part question trong 10 giây, lập dàn ý 5 phút với mỗi câu hỏi một thân bài, viết mở bài trả lời ngắn CẢ HAI câu hỏi và hoàn thành bài ≥ 250 từ — giữ Task Response ở band 5+ (không bỏ sót câu hỏi nào).",
  minutes: 75,
  blocks: [
    {
      t: "recap",
      title: "Bài này học gì",
      items: [
        "**Two-part question** (đề hai phần / câu hỏi trực tiếp) = đề kết thúc bằng **hai câu hỏi có dấu ?**, vd: ==Why is this happening? Is this a positive or negative development?==",
        "Luật vàng: **trả lời THẲNG cả hai câu hỏi**. Bỏ sót hoặc trả lời mơ hồ một câu = **Task Response tối đa band 5** (đề trả lời chưa đủ các phần).",
        "Bố cục 4 đoạn: **Mở bài** (paraphrase + trả lời ngắn CẢ HAI) → **Thân 1** = câu hỏi 1 → **Thân 2** = câu hỏi 2 → **Kết bài** (tóm lại cả hai câu trả lời).",
        "Cặp câu hỏi hay gặp: **Why…? + Positive or negative?** · **What are the causes? + What can be done?** · **Why…? + How…?** · **What…? + Do you think…?**",
        "Đẩy band nào: **TR band 5 → 5.5–6** (đủ mọi phần, câu trả lời rõ) và **CC** (mỗi đoạn một câu hỏi, không lạc sang câu kia).",
      ],
    },

    /* ── 1 ── */
    { t: "h", text: "1. Two-part question là gì? Nhận ra trong 10 giây" },
    {
      t: "p",
      text: "Đến hôm nay bạn đã gặp bốn dạng Task 2: **Opinion** (Tập 1, Tập 2 Ngày 2), **Discussion** (Ngày 6), **Advantages / disadvantages** (Ngày 10), **Problem / solution · cause / effect** (Ngày 14). Dạng thứ năm — **two-part question** — dễ nhận nhất: đề **không** có “To what extent…”, “Discuss both views…”, mà kết thúc bằng **hai câu hỏi trực tiếp**. Mẹo: **đếm dấu chấm hỏi** và gạch chân **từ để hỏi** (why, what, how, is, do).",
    },
    {
      t: "sodo",
      kind: "compare",
      title: "Nhìn câu lệnh cuối đề là biết dạng",
      caption: "Hai câu hỏi trực tiếp nhưng có “advantages… outweigh” thì vẫn là dạng Advantages / disadvantages (Ngày 10) — đọc kỹ NỘI DUNG câu hỏi.",
      cols: [
        { title: "**Opinion**", items: ["To what extent do you **agree or disagree**?", "→ một ý kiến xuyên bài"] },
        { title: "**Discussion**", items: ["**Discuss both views** and give your own opinion.", "→ hai phía + ý kiến"] },
        { title: "**Two-part question**", items: ["**Why** is this happening?", "**Is this** a positive or negative development?", "→ trả lời từng câu hỏi"] },
      ],
    },
    {
      t: "examples",
      items: [
        { en: "Many companies now pay social media influencers to promote their products instead of using traditional advertisements. Why is this happening? Is this a positive or negative development?", vi: "Nhiều công ty nay trả tiền cho người có ảnh hưởng trên mạng xã hội để quảng bá sản phẩm thay vì dùng quảng cáo truyền thống. Vì sao điều này xảy ra? Đây là xu hướng tích cực hay tiêu cực? → Câu hỏi 1: **lý do** · Câu hỏi 2: **đánh giá** (ý kiến của bạn)." },
        { en: "These days, many people get their news from social media rather than from newspapers or television. Why is this the case? What problems can this cause?", vi: "Ngày nay nhiều người lấy tin từ mạng xã hội thay vì báo in hay truyền hình. Vì sao như vậy? Điều này có thể gây ra vấn đề gì? → Câu hỏi 1: **lý do** · Câu hỏi 2: **vấn đề** (hậu quả xấu)." },
      ],
    },

    /* ── 2 ── */
    { t: "h", text: "2. Các cặp câu hỏi hay gặp — và mỗi câu cần gì" },
    {
      t: "table",
      head: ["Cặp câu hỏi", "Thân bài 1 trả lời", "Thân bài 2 trả lời", "Lưu ý"],
      rows: [
        ["**Why…?** + **Is this positive or negative?**", "2 lý do (có giải thích + ví dụ)", "**Ý kiến rõ**: chủ yếu tích cực / tiêu cực + 2 lý do", "Có thể nhượng bộ 1 câu (Although some…, …) nhưng **phải chọn phía**"],
        ["**What are the causes?** + **What can be done?**", "2 nguyên nhân", "2 giải pháp gắn đúng nguyên nhân", "Gần dạng Problem / solution Ngày 14 — dùng lại khung should + so that"],
        ["**Why…?** + **How…?**", "lý do", "cách thức (chính phủ / cá nhân làm thế nào)", "Câu hỏi How = **cách làm**, không phải lý do"],
        ["**What…?** + **Do you think…?**", "liệt kê / mô tả (vd. kỹ năng gì cần)", "ý kiến Yes / No + lý do", "Câu “Do you think” luôn cần **ý kiến cá nhân**"],
        ["**What problems…?** + **How can they be solved?**", "2 vấn đề", "2 giải pháp", "Mỗi giải pháp nhắm một vấn đề"],
      ],
    },
    {
      t: "note",
      title: "Người Việt hay sai với đề hai câu hỏi",
      items: [
        "**Trả lời một câu, quên câu kia** (thường viết say sưa về lý do rồi chỉ còn 2 dòng cho câu 2) → TR tụt xuống band 4–5. Chia thời gian và số từ **gần bằng nhau** cho hai thân bài.",
        "Câu 2 hỏi “positive **or** negative?” mà viết ~~“It has both positive and negative sides.”~~ rồi dừng → chưa trả lời. Được nói cả hai mặt, nhưng phải kết lại **mặt nào nặng hơn**.",
        "Câu 1 hỏi **Why** (nguyên nhân) mà lại viết **hậu quả** (effects) → lạc đề một nửa. Gạch chân từ để hỏi trước khi lập dàn ý.",
        "Biến bài thành **Discussion** (“Some people think… Others think…”) — đề không hỏi quan điểm của người khác, đề hỏi **bạn**.",
      ],
    },

    /* ── 3 ── */
    { t: "h", text: "3. Bố cục 4 đoạn — mỗi câu hỏi một thân bài" },
    {
      t: "sodo",
      kind: "flow",
      title: "Two-part question essay — 4 đoạn, ~270 từ",
      caption: "Mở bài và kết bài đều nhắc CẢ HAI câu trả lời. Hai thân bài dài gần bằng nhau (90–110 từ mỗi đoạn).",
      steps: [
        { label: "Mở bài (40–50 từ)", sub: "paraphrase đề + trả lời NGẮN câu 1 + trả lời NGẮN câu 2" },
        { label: "Thân 1 (90–110 từ)", sub: "câu chủ đề = câu hỏi 1 · ý 1 + giải thích · ý 2 + ví dụ" },
        { label: "Thân 2 (90–110 từ)", sub: "câu chủ đề = câu hỏi 2 · lý do + giải thích + ví dụ (+ nhượng bộ 1 câu)" },
        { label: "Kết bài (30–40 từ)", sub: "In conclusion + tóm lại câu trả lời 1 và 2 bằng lời khác, không ý mới" },
      ],
    },
    {
      t: "rule",
      formula: "Mở bài: paraphrase + answer Q1 + answer Q2 → Body 1 = Q1 → Body 2 = Q2 → Kết bài: In conclusion, + answer Q1 + answer Q2",
      vi: "Một đoạn — một câu hỏi. Đọc riêng câu đầu mỗi đoạn thân bài phải thấy ngay nó trả lời câu hỏi nào.",
    },

    /* ── 4 ── */
    { t: "h", text: "4. Mở bài: trả lời ngắn CẢ HAI câu hỏi" },
    {
      t: "p",
      text: "Mở bài dạng này có **hai câu**: câu 1 **paraphrase** tình huống trong đề (đổi từ, đổi cấu trúc — kỹ năng Ngày 8), câu 2 **trả lời gọn cả hai câu hỏi**. Giám khảo đọc xong mở bài phải biết bài viết sẽ đi đâu.",
    },
    {
      t: "examples",
      items: [
        { en: "Band 4.5: Nowadays, companies use influencers more and more. There are many reasons for this situation and I will discuss them in this essay.", vi: "Vấn đề: câu 1 gần như chép đề, rất chung; câu 2 KHÔNG nói lý do là gì và hoàn toàn **bỏ quên câu hỏi 2** (tích cực hay tiêu cực?) → mở bài thiếu một nửa nhiệm vụ." },
        { en: "Band 5.5: Nowadays, many firms spend their marketing money on social media influencers rather than on traditional adverts. In my opinion, this is happening mainly because influencers reach young customers more cheaply and more personally, but I believe it is a negative development overall.", vi: "Câu 1 paraphrase (companies → firms, promote → spend marketing money on, instead of → rather than). Câu 2 trả lời **câu 1** (because…) VÀ **câu 2** (a negative development) — đủ hai phần." },
      ],
    },
    {
      t: "patterns",
      rows: [
        {
          formula: "S + V (paraphrase tình huống) . This is (mainly) because + S + V, and I believe (that) + it is a positive / negative development.",
          vi: "Mở bài cho cặp Why + Positive / negative.",
          examples: [
            { en: "More and more people now read the news on their phones. This is mainly because it is fast and free, and I believe it is a largely positive development.", vi: "Ngày càng nhiều người đọc tin trên điện thoại. Điều này chủ yếu vì nhanh và miễn phí, và tôi tin đó là xu hướng phần lớn tích cực." },
          ],
        },
        {
          formula: "S + V (paraphrase) . There are several reasons for this, and it can lead to + N + and + N.",
          vi: "Mở bài cho cặp Why + What problems.",
          examples: [
            { en: "Many people today get their news from social media instead of newspapers. There are several reasons for this, and it can lead to the spread of misinformation and a loss of trust in journalists.", vi: "Nhiều người ngày nay lấy tin từ mạng xã hội thay vì báo in. Có vài lý do cho điều này, và nó có thể dẫn tới sự lan truyền thông tin sai lệch và mất niềm tin vào nhà báo." },
          ],
        },
      ],
    },
    {
      t: "mcq",
      id: "t2d18-viet-mo-bai",
      title: "Mở bài nào trả lời đủ CẢ HAI câu hỏi? (3 câu)",
      items: [
        {
          q: "Prompt: Many children now spend hours watching online videos. Why is this happening? Is this a positive or negative development?",
          options: [
            "Children today spend a lot of time watching videos online. This is mainly because videos are free and easy to find, and I believe this trend is more negative than positive.",
            "Children today spend a lot of time watching videos online. There are many reasons for this, which I will explain.",
            "Children today spend a lot of time watching videos online. Some people think it is good, while others think it is bad.",
          ],
          correct: 0,
          why: "**A** trả lời câu 1 (because videos are free and easy to find) VÀ câu 2 (more negative than positive). **B** chưa nói lý do nào và bỏ quên câu 2. **C** biến thành bài Discussion, không có ý kiến của người viết.",
        },
        {
          q: "Prompt: Fewer people buy printed newspapers today. Why is this the case? What problems might this cause?",
          options: [
            "Printed newspapers are becoming less popular. In my opinion, this is a negative development.",
            "Sales of printed newspapers are falling. I will discuss the advantages and disadvantages of this.",
            "Sales of printed newspapers are falling, mainly because news is available free online. This may lead to job losses for journalists and less careful reporting.",
          ],
          correct: 2,
          why: "Câu 2 hỏi **problems** (vấn đề), không hỏi tốt/xấu. **C** nêu lý do (free online) và hai vấn đề (job losses, less careful reporting). **A** trả lời “negative” — không phải câu hỏi đề đặt ra, lại thiếu lý do. **B** biến thành dạng Advantages / disadvantages.",
        },
        {
          q: "Prompt: Some advertisements are aimed directly at young children. Why do companies do this? How can parents protect their children?",
          options: [
            "Many adverts target young children because children are easily persuaded. This essay will discuss whether this is good or bad.",
            "Many adverts target young children because children are easily persuaded and can influence what their parents buy. However, parents can protect them by limiting screen time and talking to them about how adverts work.",
            "Many adverts target young children. Parents should be careful, and the government should ban these adverts.",
          ],
          correct: 1,
          why: "**B** trả lời **Why** (easily persuaded, influence parents) và **How** (limiting screen time, talking about adverts). **A** đổi câu 2 thành “good or bad” — sai câu hỏi. **C** không có lý do, và nhắc chính phủ — trong khi câu 2 hỏi **cha mẹ**.",
        },
      ],
    },

    /* ── 5 ── */
    { t: "h", text: "5. Dàn ý 5 phút (ôn Ngày 6)" },
    {
      t: "p",
      text: "Như Ngày 6 (Discussion trọn bài): **40 phút** cho Task 2 = **5 phút dàn ý · 30 phút viết · 5 phút soát**. Với đề hai câu hỏi, dàn ý chỉ là **hai cột**, mỗi cột 2 ý + 1 ví dụ. Viết bằng từ khoá, không viết câu.",
    },
    {
      t: "table",
      caption: "Dàn ý mẫu (5 phút) — đề influencer ở mục 1",
      head: ["", "Q1: Why is this happening?", "Q2: Positive or negative?"],
      rows: [
        ["Câu trả lời ngắn", "cheaper + closer to young people", "**mostly negative**"],
        ["Ý 1", "young people: phones > TV → TV commercials miss them; influencer reaches target audience", "hidden adverts: no label → followers think it is honest advice"],
        ["Ý 2", "followers trust influencers like a friend", "teenagers copy → buy expensive / unsafe things; “perfect life” → unhappy"],
        ["Ví dụ", "small clothes brand: 1 video went viral → famous", "(nhượng bộ) some influencers label posts, but few strict rules"],
      ],
    },
    {
      t: "note",
      title: "Mẹo lập dàn ý nhanh",
      items: [
        "Gạch chân **từ để hỏi** của từng câu (Why / Is it / How / What) và viết nó lên đầu mỗi cột — để không lạc sang câu kia.",
        "Với câu “positive or negative?”, quyết định **phía** trong 30 giây đầu: chọn phía bạn có **nhiều ý và ví dụ hơn**, không cần là điều bạn tin nhất.",
        "Mỗi cột chỉ cần **2 ý**: band 5–6 cần ý được **giải thích**, không cần nhiều ý.",
      ],
    },

    /* ── 6 ── */
    { t: "h", text: "6. Khung câu cho thân bài và kết bài" },
    {
      t: "patterns",
      rows: [
        {
          formula: "There are two main reasons why + S + V. · Firstly, … · Secondly, …",
          vi: "Câu chủ đề Thân 1 (câu hỏi Why) — dùng lại nguyên từ của câu hỏi.",
          examples: [
            { en: "There are two main reasons why companies choose influencers.", vi: "Có hai lý do chính khiến các công ty chọn người có ảnh hưởng." },
          ],
        },
        {
          formula: "However, I believe (that) this trend is more positive / negative than negative / positive. · The main problem / benefit is that + S + V.",
          vi: "Câu chủ đề Thân 2 (câu hỏi positive / negative) — nói rõ phía ngay câu đầu.",
          examples: [
            { en: "However, I believe this trend is more negative than positive. The main problem is that the advertising is often hidden.", vi: "Tuy nhiên, tôi cho rằng xu hướng này tiêu cực nhiều hơn tích cực. Vấn đề chính là quảng cáo thường bị giấu đi." },
          ],
        },
        {
          formula: "Although some + N + V, + S + V (nhượng bộ 1 câu, vẫn giữ phía của mình)",
          vi: "Thừa nhận mặt kia mà không đổi ý kiến (từ nối Ngày 17).",
          examples: [
            { en: "Although some influencers label every sponsored post, there are no strict rules in many countries.", vi: "Dù một số người có ảnh hưởng ghi chú mọi bài được tài trợ, nhiều nước vẫn chưa có quy định chặt chẽ." },
          ],
        },
        {
          formula: "In conclusion, + S + V (câu trả lời 1, lời khác) . Nevertheless / Overall, I believe + câu trả lời 2.",
          vi: "Kết bài: tóm lại cả hai câu trả lời, không thêm ý mới.",
          examples: [
            { en: "In conclusion, companies use influencers because they are cheaper and closer to young customers. Nevertheless, I believe this development is mostly negative.", vi: "Tóm lại, các công ty dùng người có ảnh hưởng vì rẻ hơn và gần khách hàng trẻ hơn. Tuy vậy, tôi cho rằng xu hướng này chủ yếu tiêu cực." },
          ],
        },
      ],
    },
    {
      t: "rule",
      formula: "Body 1: There are two main reasons why + S + V. · Body 2: However, I believe this trend is more + adj + than + adj. · Kết: In conclusion, … Nevertheless, I believe …",
      vi: "Câu đầu mỗi thân bài lặp lại TỪ ĐỂ HỎI của đề (why / positive or negative) — giám khảo thấy ngay bạn trả lời đủ.",
    },
    {
      t: "quiz",
      id: "t2d18-viet-dich",
      title: "Dịch sang tiếng Anh — khung câu two-part (4 câu)",
      kind: "translate",
      grammar: "There are two main reasons why + S + V · I believe (that) + S + V · The first reason is that + S + V · In conclusion, I think + S + V",
      items: [
        { q: "Có hai lý do chính khiến xu hướng này xảy ra.", hint: "There are two main reasons why, this trend, is happening", answers: ["There are two main reasons why this trend is happening.", "There are two main reasons why this trend happens.", "There are two main reasons for this trend.", "This trend is happening for two main reasons.", "There are two main reasons why this trend is occurring."] },
        { q: "Tôi tin rằng đây là một sự phát triển tích cực.", hint: "I believe (that), this is, a positive development", answers: ["I believe that this is a positive development.", "I believe this is a positive development.", "I think that this is a positive development.", "I think this is a positive development."] },
        { q: "Lý do đầu tiên là quảng cáo trên mạng rẻ hơn quảng cáo trên truyền hình.", hint: "The first reason is that, online advertising, is cheaper than, TV advertising", answers: ["The first reason is that online advertising is cheaper than TV advertising.", "The first reason is that online advertising is cheaper than television advertising.", "The first reason is that advertising online is cheaper than advertising on TV.", "The first reason is that online advertising is cheaper than advertising on TV.", "The first reason is that online advertising is cheaper than advertising on television.", "The first reason is that online adverts are cheaper than TV adverts.", "The first reason is that online advertisements are cheaper than TV advertisements.", "The first reason is that online ads are cheaper than TV ads.", "The first reason is that online adverts are cheaper than TV commercials."] },
        { q: "Tóm lại, tôi cho rằng sự thay đổi này tiêu cực nhiều hơn tích cực.", hint: "In conclusion, I think / believe, this change is, more negative than positive", answers: ["In conclusion, I think this change is more negative than positive.", "In conclusion, I think that this change is more negative than positive.", "In conclusion, I believe this change is more negative than positive.", "In conclusion, I believe that this change is more negative than positive.", "In conclusion, I would say this change is more negative than positive."] },
      ],
    },

    /* ── 7 ── */
    { t: "h", text: "7. Bài mẫu trọn (band ước tính 5.5–6.0)" },
    {
      t: "p",
      text: "**Đề:** Many companies now pay social media influencers to promote their products instead of using traditional advertisements. **Why is this happening? Is this a positive or negative development?** Give reasons for your answer and include any relevant examples from your own knowledge or experience. Write at least 250 words. — Bài mẫu dưới đây viết bằng từ và cấu trúc **trong tầm Tập 2**, đúng mức band tuyên bố: rõ ràng, đủ ý, ít lỗi, nhưng từ vựng còn phổ thông và ý chưa phát triển thật sâu.",
    },
    {
      t: "examples",
      items: [
        { en: "[Introduction] Nowadays, many firms spend their marketing money on social media influencers rather than on traditional adverts in newspapers or on television. In my opinion, this is happening mainly because influencers reach young customers more cheaply and more personally, but I believe it is a negative development overall.", vi: "[Mở bài] Ngày nay nhiều công ty chi tiền tiếp thị cho người có ảnh hưởng trên mạng xã hội thay vì quảng cáo truyền thống trên báo hay truyền hình. Theo tôi, điều này xảy ra chủ yếu vì người có ảnh hưởng tiếp cận khách hàng trẻ rẻ hơn và gần gũi hơn, nhưng tôi tin rằng nhìn chung đây là xu hướng tiêu cực." },
        { en: "[Body 1] There are two main reasons why companies choose influencers. Firstly, young people spend far more time on their phones than in front of the television, so a TV commercial often does not reach them. An influencer with a million followers, however, can show a product to exactly the target audience that a brand wants. Secondly, followers usually trust influencers more than they trust advertisers. When a popular blogger says that she uses a certain cream every morning, her followers feel that they are hearing advice from a friend. For example, several small clothing brands in Vietnam became famous after just one video went viral.", vi: "[Thân bài 1] Có hai lý do chính khiến các công ty chọn người có ảnh hưởng. Thứ nhất, người trẻ dành nhiều thời gian cho điện thoại hơn hẳn trước ti vi, nên một quảng cáo truyền hình thường không đến được với họ. Trong khi đó, một người có ảnh hưởng với một triệu người theo dõi có thể giới thiệu sản phẩm cho đúng nhóm khán giả mục tiêu mà nhãn hàng muốn. Thứ hai, người theo dõi thường tin người có ảnh hưởng hơn tin nhà quảng cáo. Khi một blogger nổi tiếng nói cô dùng một loại kem mỗi sáng, người theo dõi cảm thấy như đang nghe lời khuyên từ một người bạn. Ví dụ, vài thương hiệu quần áo nhỏ ở Việt Nam đã nổi tiếng chỉ sau một video lan truyền chóng mặt." },
        { en: "[Body 2] However, I believe this trend is more negative than positive. The main problem is that the advertising is often hidden. Many influencers do not clearly say that a company has paid them, so their followers think the recommendation is honest. This is especially harmful for teenagers, who may buy expensive or even unsafe products because they want to copy someone they admire. In addition, influencers often show a perfect lifestyle, which can make young people unhappy with their own lives. Although some influencers label every sponsored post, there are still no strict rules about this in many countries.", vi: "[Thân bài 2] Tuy nhiên, tôi cho rằng xu hướng này tiêu cực nhiều hơn tích cực. Vấn đề chính là quảng cáo thường bị giấu đi. Nhiều người có ảnh hưởng không nói rõ rằng một công ty đã trả tiền cho họ, nên người theo dõi nghĩ lời giới thiệu là thật lòng. Điều này đặc biệt có hại cho thanh thiếu niên, những người có thể mua đồ đắt tiền, thậm chí không an toàn, vì muốn bắt chước người mình hâm mộ. Ngoài ra, người có ảnh hưởng thường phô ra một lối sống hoàn hảo, điều có thể khiến người trẻ không hài lòng với cuộc sống của chính mình. Dù một số người có ảnh hưởng ghi chú mọi bài được tài trợ, nhiều nước vẫn chưa có quy định chặt chẽ về việc này." },
        { en: "[Conclusion] In conclusion, companies use influencers because they are cheaper and closer to young customers than traditional advertising. Nevertheless, I believe this development is mostly negative, as hidden adverts can mislead followers, especially teenagers.", vi: "[Kết bài] Tóm lại, các công ty dùng người có ảnh hưởng vì họ rẻ hơn và gần khách hàng trẻ hơn so với quảng cáo truyền thống. Tuy vậy, tôi tin rằng xu hướng này chủ yếu tiêu cực, vì quảng cáo trá hình có thể đánh lừa người theo dõi, nhất là thanh thiếu niên." },
      ],
    },

    /* ── 8 ── */
    { t: "h", text: "8. Phân tích bài mẫu theo 4 tiêu chí" },
    {
      t: "table",
      caption: "Vì sao bài mẫu ở khoảng band 5.5–6.0 — và cần gì để lên 6.5",
      head: ["Tiêu chí", "Bài mẫu làm được", "Còn thiếu để lên cao hơn"],
      rows: [
        ["**TR** (trả lời đề)", "Trả lời **đủ hai câu hỏi** ngay ở mở bài; Thân 1 = lý do (2 ý), Thân 2 = đánh giá với phía rõ ràng (more negative than positive); kết bài khớp mở bài.", "Ý ở Thân 2 hơi nhiều mà chưa sâu (ý “perfect lifestyle” chỉ có một câu); ví dụ còn chung (“several small clothing brands”) — band 6.5+ cần ví dụ cụ thể và giải thích đến cùng."],
        ["**CC** (mạch lạc, liên kết)", "Mỗi đoạn một câu hỏi; câu chủ đề lặp lại từ để hỏi (two main reasons why… / more negative than positive); từ nối đúng vai: Firstly, Secondly, For example, However, In addition, Although, Nevertheless; quy chiếu “this trend”, “this development”.", "Từ nối còn đứng đầu câu khá đều đặn (hơi máy móc); chưa dùng nhiều cách nối khác như which means… / As a result,…"],
        ["**LR** (từ vựng)", "Đúng chủ đề hôm nay: target audience, brand, TV commercial, went viral, sponsored post, mislead, followers; paraphrase đề (companies → firms, instead of → rather than).", "Từ vẫn phổ thông, lặp “young people / young customers / teenagers”; chưa có collocation hiếm (e.g. **undisclosed** advertising, **impressionable** teenagers)."],
        ["**GRA** (ngữ pháp)", "Trộn câu đơn và câu phức: mệnh đề quan hệ (who may buy…, which can make…), when-clause, so sánh (far more time… than), although-clause; không có lỗi làm sai nghĩa.", "Phạm vi cấu trúc còn hẹp — hầu như chưa có bị động (chỉ một chỗ: is often hidden) và chưa có câu điều kiện; câu phức phần lớn cùng một kiểu."],
      ],
    },
    {
      t: "note",
      title: "Mẹo: tự soát bài hai câu hỏi trong 2 phút",
      items: [
        "Gạch chân câu cuối mở bài: có **đủ hai câu trả lời** chưa?",
        "Đọc **câu đầu** của Thân 1 và Thân 2: mỗi câu có nhắc đúng **từ để hỏi** của câu hỏi tương ứng không?",
        "Đếm sơ số dòng hai thân bài — chênh nhau quá **một nửa** là một câu hỏi đang bị “bỏ đói”.",
        "Kết bài có ý nào **mới** không? Có thì xoá.",
      ],
    },

    /* ── 9 ── */
    { t: "h", text: "9. Bài mẫu 2: dàn ý + một thân bài (Why + What problems)" },
    {
      t: "p",
      text: "**Đề:** These days, many people get their news from social media rather than from newspapers or television. **Why is this the case? What problems can this cause?** — Câu hỏi 2 hỏi **problems** (chỉ mặt xấu), nên Thân 2 **không** cần bàn tốt hay xấu, chỉ nêu 2 vấn đề và giải thích.",
    },
    {
      t: "table",
      caption: "Dàn ý 5 phút",
      head: ["", "Q1: Why is this the case?", "Q2: What problems can this cause?"],
      rows: [
        ["Ý 1", "fast + free: breaking news on phone in seconds", "misinformation spreads: no journalist checks the facts"],
        ["Ý 2", "personal: news chosen by friends / interests", "“bubble”: only see opinions we already agree with"],
        ["Ví dụ", "my parents read news on Facebook, not paper", "false story about a flood → people panicked"],
      ],
    },
    {
      t: "examples",
      items: [
        { en: "[Body 2] However, getting news from social media can cause serious problems. The first problem is the spread of misinformation. Unlike newspapers, social media sites do not employ journalists to check the facts, so anyone can post a story, true or false. For example, last year a false story about a flood in my city went viral, and many people panicked and left their homes for no reason. Another problem is that social media mainly shows us posts from people who think like us. As a result, users rarely see other opinions and may become less tolerant of people who disagree with them.", vi: "[Thân bài 2] Tuy nhiên, lấy tin từ mạng xã hội có thể gây ra những vấn đề nghiêm trọng. Vấn đề đầu tiên là sự lan truyền thông tin sai lệch. Không như báo in, các trang mạng xã hội không thuê nhà báo kiểm chứng sự thật, nên ai cũng có thể đăng một câu chuyện, thật hay giả. Ví dụ, năm ngoái một tin giả về lũ lụt ở thành phố tôi lan truyền chóng mặt, và nhiều người hoảng sợ, rời nhà mà không có lý do. Một vấn đề khác là mạng xã hội chủ yếu cho ta thấy bài đăng của những người nghĩ giống mình. Kết quả là người dùng hiếm khi thấy ý kiến khác và có thể trở nên kém khoan dung với người không đồng ý với họ." },
      ],
    },

    /* ── 10 ── */
    { t: "h", text: "10. Luyện tập: nhận diện dạng đề + viết trọn bài" },
    {
      t: "mcq",
      id: "t2d18-viet-nhan-dien",
      title: "Đề này thuộc dạng nào? (6 câu)",
      items: [
        { q: "Some people think that printed newspapers will soon disappear. To what extent do you agree or disagree?", options: ["Opinion", "Discussion", "Advantages / disadvantages", "Two-part question"], correct: 0, why: "“**To what extent do you agree or disagree?**” → **Opinion**: một ý kiến xuyên bài." },
        { q: "Many people now get their news from social media. Why is this? What problems can it cause?", options: ["Opinion", "Discussion", "Advantages / disadvantages", "Two-part question"], correct: 3, why: "Hai câu hỏi trực tiếp **Why…? + What problems…?** → **Two-part question**." },
        { q: "Some people believe advertising aimed at children should be banned, while others disagree. Discuss both views and give your own opinion.", options: ["Opinion", "Discussion", "Advantages / disadvantages", "Two-part question"], correct: 1, why: "“**Discuss both views and give your own opinion**” → **Discussion** (Ngày 6)." },
        { q: "More and more young people work as online content creators. What are the advantages and disadvantages of this job?", options: ["Opinion", "Discussion", "Advantages / disadvantages", "Two-part question"], correct: 2, why: "Chỉ một câu hỏi về **advantages and disadvantages** → dạng **Advantages / disadvantages** (Ngày 10)." },
        { q: "Famous people often appear in adverts. Why do companies use celebrities? Do these adverts influence people's choices?", options: ["Opinion", "Discussion", "Advantages / disadvantages", "Two-part question"], correct: 3, why: "**Why…? + Do these adverts…?** — hai câu hỏi trực tiếp → **Two-part question**; câu 2 cần ý kiến Yes / No + lý do." },
        { q: "Reading news online has many benefits. Do the advantages of online news outweigh the disadvantages?", options: ["Opinion", "Discussion", "Advantages / disadvantages", "Two-part question"], correct: 2, why: "Bẫy: có câu hỏi trực tiếp, nhưng nội dung là “**advantages outweigh the disadvantages**” → dạng **Advantages / disadvantages** (biến thể outweigh, Ngày 10): so hai mặt rồi nói mặt nào nặng hơn." },
      ],
    },
    {
      t: "essay",
      id: "t2d18-viet-bai",
      task: "Task 2",
      prompt: "In many countries, news programmes and news websites focus mainly on bad news, such as crimes, accidents and disasters. Why is this the case? Do you think this is a positive or negative development? Give reasons for your answer and include any relevant examples from your own knowledge or experience. Write at least 250 words.",
      minWords: 250,
      tips: [
        "Gạch chân hai câu hỏi: **Why** (lý do) · **positive or negative development** (ý kiến — phải chọn phía). Dàn ý 5 phút: hai cột, mỗi cột 2 ý + 1 ví dụ.",
        "Mở bài 2 câu: paraphrase (focus mainly on bad news → mostly report negative stories such as…) + trả lời ngắn CẢ HAI câu hỏi.",
        "Ý gợi ý Q1: bad news **attracts more viewers / clicks** (clickbait, advertising money) · people need **warnings** (storms, crime). Ý gợi ý Q2: negative — makes people **anxious**, gives a **misleading** picture of the world; hoặc positive — keeps people **informed**, pushes governments to act.",
        "Dùng từ hôm nay: **coverage, viewers, the media, breaking news, misleading, keep up with the news, make the headlines**; từ nối Ngày 17 đúng vai (However, In addition, As a result, Although).",
        "Soát cuối: hai thân bài dài gần bằng nhau? Kết bài có nhắc lại CẢ HAI câu trả lời? Đủ 250 từ?",
      ],
    },
  ],
};

/* ─────────────────────────── Bài tập ─────────────────────────── */

const T2D18_BAI_TAP: Lesson = {
  id: "t2d18-bai-tap",
  kind: "homework",
  title: "Bài tập Ngày 18",
  goal: "Ôn trọn Ngày 18: từ vựng truyền thông, họ từ, collocation, dịch câu, nối đuôi câu trên một đoạn đọc mới, nhận diện và trả lời đề hai câu hỏi; ôn lại câu điều kiện (Ngày 13), mệnh đề quan hệ (Ngày 15) và từ nối (Ngày 17).",
  minutes: 50,
  blocks: [
    {
      t: "recap",
      title: "Bài tập hôm nay (38 câu + 1 đoạn viết)",
      items: [
        "**I. Điền từ vựng** (8) · **II. Họ từ — đúng dạng** (6) · **III. Collocation** (6, trắc nghiệm).",
        "**IV. Dịch Việt → Anh** (5, có 💡) · **V. Matching sentence endings** (4) trên đoạn đọc mới về podcast.",
        "**VI. Đề hai câu hỏi** (4, trắc nghiệm): nhận diện, chọn dàn ý, mở bài, kết bài.",
        "**VII. Ôn xoắn ốc** (5): câu điều kiện 0/1 & unless (N13) · mệnh đề quan hệ (N15) · từ nối (N17).",
        "**VIII. Viết**: mở bài + dàn ý (~70 từ) cho một đề two-part. Đẩy band: **LR + TR** Writing band 5.",
      ],
    },
    {
      t: "sodo",
      kind: "mindmap",
      title: "Ôn nhanh Ngày 18 trước khi làm bài",
      caption: "Ba điều dễ quên nhất của hôm nay.",
      center: "**Ngày 18**",
      branches: [
        { label: "Từ vựng truyền thông", items: ["news không đếm được", "go viral · make the headlines", "AD-vertise / ad-VER-tisement", "target + N (không to)"], anh: "newspaper" },
        { label: "Matching sentence endings", items: ["đầu câu theo thứ tự bài", "đuôi nhiều hơn câu", "khớp ngữ pháp + khớp nghĩa", "cẩn thận đuôi “đúng nhưng sai chỗ”"], anh: "open-book" },
        { label: "Two-part question", items: ["đếm dấu ?", "mở bài trả lời CẢ HAI", "một thân bài = một câu hỏi", "positive / negative → chọn phía"], anh: "memo" },
      ],
    },

    { t: "h", text: "I. Điền từ vựng (8 câu)" },
    {
      t: "quiz",
      id: "t2d18-bt-tu",
      title: "I. Điền một từ (nghĩa tiếng Việt trong ngoặc)",
      kind: "fill",
      items: [
        { q: "A good journalist always checks information with a ___ source. (đáng tin cậy)", answers: ["reliable", "trustworthy"] },
        { q: "The video ___ viral and got ten million views in two days. (lan truyền — quá khứ của go)", answers: ["went"] },
        { q: "Many people get their news by ___ through social media on their phones. (lướt — V-ing)", answers: ["scrolling"] },
        { q: "The newspaper was criticised for political ___ because it only reported one side of the story. (sự thiên vị)", answers: ["bias"] },
        { q: "“You won't believe number 7!” — that headline is pure ___. (tin câu view)", answers: ["clickbait"] },
        { q: "The final was ___ live in more than 100 countries. (phát sóng — dạng V3)", answers: ["broadcast"] },
        { q: "The music festival is ___ by a local bank. (được tài trợ)", answers: ["sponsored"] },
        { q: "Our ___ audience is people aged between 18 and 25. (mục tiêu)", answers: ["target"] },
      ],
    },
    {
      t: "note",
      title: "Giải thích đáp án I",
      items: [
        "(1) **reliable** source (trustworthy cũng đúng). (2) **went** viral (go – went – gone). (3) **scrolling** through — sau **by** dùng V-ing. (4) political **bias** (danh từ; tính từ là biased).",
        "(5) **clickbait** — không đếm được, không cần a. (6) **broadcast** — bất quy tắc, V3 vẫn là broadcast (~~broadcasted~~ ít dùng, tránh trong bài thi). (7) **sponsored** — bị động be + V3. (8) **target** audience.",
      ],
    },

    { t: "h", text: "II. Họ từ — viết đúng dạng của từ in HOA (6 câu)" },
    {
      t: "quiz",
      id: "t2d18-bt-ho-tu",
      title: "II. Word family — đúng dạng từ",
      kind: "fill",
      items: [
        { q: "TV ___ for unhealthy snacks should not be shown during children's programmes. (ADVERTISE — danh từ số nhiều)", answers: ["advertisements", "adverts", "ads"] },
        { q: "The documentary was very ___: I learnt a lot about the ocean. (INFORM — tính từ)", answers: ["informative"] },
        { q: "She is one of the most ___ journalists in the country. (INFLUENCE — tính từ)", answers: ["influential"] },
        { q: "The advert was so ___ that I bought the product the next day. (PERSUADE — tính từ)", answers: ["persuasive"] },
        { q: "The ___ of the report has been delayed until next month. (PUBLISH — danh từ)", answers: ["publication"] },
        { q: "Most social media companies earn their money from ___. (ADVERTISE — danh từ không đếm được)", answers: ["advertising"] },
      ],
    },
    {
      t: "note",
      title: "Giải thích đáp án II",
      items: [
        "(1) Có **TV** đứng trước và động từ **should** — cần danh từ chỉ **những mẩu quảng cáo** → **advertisements / adverts**. (6) “earn money **from** ___” chỉ **ngành / hoạt động** nói chung → **advertising** (không đếm được).",
        "(2) **informative** = nhiều thông tin (khác informed = người hiểu biết). (3) **influential** — trọng âm influ-**EN**-tial. (4) **persuasive** — so + **tính từ** + that. (5) **The … of** → danh từ **publication**.",
      ],
    },

    { t: "h", text: "III. Collocation (6 câu)" },
    {
      t: "mcq",
      id: "t2d18-bt-colloc",
      title: "III. Chọn từ đúng",
      items: [
        { q: "The scandal ___ the headlines for a whole week.", options: ["took", "did", "made"], correct: 2, why: "**make the headlines** — cụm cố định." },
        { q: "I try to keep ___ with the news by reading one article every morning.", options: ["up", "on", "over"], correct: 0, why: "**keep up with** = theo kịp, cập nhật. keep on = tiếp tục; keep over không phải cụm." },
        { q: "Fake accounts are often used to ___ misinformation.", options: ["spread", "make", "tell"], correct: 0, why: "**spread misinformation / rumours / fake news**." },
        { q: "Before sharing a story, you should ___ the facts.", options: ["see", "check", "look"], correct: 1, why: "**check the facts** (kiểm chứng). look phải có at; see the facts không phải collocation." },
        { q: "The company is ___ a new campaign aimed at teenagers.", options: ["driving", "walking", "running"], correct: 2, why: "**run a campaign** (chạy một chiến dịch). drive / walk không đi với campaign." },
        { q: "Many fast-food adverts ___ young children.", options: ["target to", "target", "aim"], correct: 1, why: "**target + N** (không giới từ). ~~target to~~ sai; **aim** phải có **at** (aim at)." },
      ],
    },

    { t: "h", text: "IV. Dịch sang tiếng Anh (5 câu)" },
    {
      t: "quiz",
      id: "t2d18-bt-dich",
      title: "IV. Dịch Việt → Anh — có 💡",
      kind: "translate",
      grammar: "go viral · tell the difference between A and B · target + N · check the facts · a person who + V (mệnh đề quan hệ Ngày 15)",
      items: [
        { q: "Video đó lan truyền chóng mặt chỉ sau một đêm.", hint: "The video, went viral, overnight", answers: ["The video went viral overnight.", "That video went viral overnight.", "The video went viral in just one night.", "That video went viral in just one night.", "The video went viral after just one night.", "That video went viral after just one night.", "The video went viral in one night.", "The video went viral after only one night.", "The video went viral in only one night."] },
        { q: "Nhiều thanh thiếu niên không phân biệt được tin thật và tin giả.", hint: "Many teenagers, cannot tell the difference between, real news and fake news", answers: ["Many teenagers cannot tell the difference between real news and fake news.", "Many teenagers can't tell the difference between real news and fake news.", "Many teenagers cannot tell the difference between real and fake news.", "Many teenagers can't tell the difference between real and fake news.", "Many teenagers cannot tell real news from fake news.", "Many teenagers can't tell real news from fake news.", "Many teenagers cannot distinguish between real news and fake news.", "Many teenagers cannot distinguish real news from fake news.", "Many teenagers cannot tell the difference between true news and fake news."] },
        { q: "Các công ty thường nhắm vào người trẻ bằng quảng cáo trên mạng xã hội.", hint: "Companies, often target, young people, with adverts, on social media", answers: ["Companies often target young people with adverts on social media.", "Companies often target young people with advertisements on social media.", "Companies often target young people with ads on social media.", "Companies often target young people with social media adverts.", "Companies often target young people with social media advertising.", "Companies often target young people through adverts on social media.", "Companies often target young people through advertising on social media."] },
        { q: "Bạn nên kiểm chứng sự thật trước khi chia sẻ một bài báo.", hint: "You should, check the facts, before you share / before sharing, an article", answers: ["You should check the facts before you share an article.", "You should check the facts before sharing an article.", "You should check the facts before you share a news article.", "You should check the facts before sharing a news story.", "You should check the facts before you share a story."] },
        { q: "Người có ảnh hưởng là người được các nhãn hàng trả tiền để giới thiệu sản phẩm.", hint: "An influencer is a person who, is paid by brands, to promote / introduce products", answers: ["An influencer is a person who is paid by brands to promote products.", "An influencer is someone who is paid by brands to promote products.", "An influencer is a person who is paid by brands to promote their products.", "An influencer is a person that is paid by brands to promote products.", "An influencer is a person who is paid by brands to introduce products.", "An influencer is someone who is paid by brands to introduce products.", "An influencer is someone who brands pay to promote products.", "An influencer is a person who brands pay to promote their products.", "An influencer is a person who gets paid by brands to promote products."] },
      ],
    },

    { t: "h", text: "V. Matching sentence endings — đoạn đọc mới (4 câu)" },
    {
      t: "passage",
      title: "The Rise of Podcasts",
      paras: [
        { text: "Podcasts are audio programmes that listeners can download and play whenever they like. The first shows appeared in the early 2000s, but the format grew slowly until smartphones made listening easy. Today, a large number of podcasts are made by individuals rather than media companies, which means the cost of starting one is very low. However, many new podcasts stop after only a few episodes, often because their creators cannot find enough listeners. Advertisers are interested in podcasts because listeners tend to stay until the end of each episode, so they hear the whole advert." },
      ],
    },
    {
      t: "table",
      caption: "Complete each sentence with the correct ending, A–F. (2 đuôi thừa)",
      head: ["", "Đầu câu (1–4) / Đuôi câu (A–F)"],
      rows: [
        ["**1**", "The podcast format grew slowly at first because …"],
        ["**2**", "Since many podcasts are made by individuals, …"],
        ["**3**", "Many new podcasts stop early because …"],
        ["**4**", "Advertisers like podcasts because …"],
        ["**A**", "their creators do not attract enough listeners."],
        ["**B**", "listeners usually hear adverts in full."],
        ["**C**", "media companies refuse to make them."],
        ["**D**", "starting a podcast costs very little."],
        ["**E**", "listening was difficult before smartphones became common."],
        ["**F**", "advertisers pay more for longer episodes."],
      ],
    },
    {
      t: "quiz",
      id: "t2d18-bt-noi-duoi",
      title: "V. Viết một chữ cái A–F",
      kind: "fill",
      items: [
        { q: "(1) The podcast format grew slowly at first because …", answers: ["E"] },
        { q: "(2) Since many podcasts are made by individuals, …", answers: ["D"] },
        { q: "(3) Many new podcasts stop early because …", answers: ["A"] },
        { q: "(4) Advertisers like podcasts because …", answers: ["B"] },
      ],
    },
    {
      t: "note",
      title: "Giải thích đáp án V",
      items: [
        "(1) **E** — “grew slowly **until smartphones made listening easy**” = trước khi có smartphone, nghe khó. (2) **D** — “which means **the cost of starting one is very low**” = starting a podcast costs very little.",
        "(3) **A** — “**because their creators cannot find enough listeners**”. (4) **B** — “listeners tend to stay **until the end of each episode**, so they **hear the whole advert**” = hear adverts in full.",
        "Đuôi thừa: **C** (bài chỉ nói nhiều podcast do cá nhân làm chứ không phải công ty truyền thông — không nói công ty **từ chối** làm) · **F** (bài không nói gì về giá theo độ dài tập). Cả hai hợp ngữ pháp nhưng bài không khẳng định → loại.",
      ],
    },

    { t: "h", text: "VI. Đề hai câu hỏi (4 câu)" },
    {
      t: "mcq",
      id: "t2d18-bt-de",
      title: "VI. Two-part question — nhận diện và bố cục",
      items: [
        {
          q: "Which prompt is a two-part question essay?",
          options: [
            "Some people think TV news is boring. To what extent do you agree or disagree?",
            "Many teenagers want to become influencers. Why is this? Is it a good career choice?",
            "Discuss the advantages and disadvantages of reading news online.",
          ],
          correct: 1,
          why: "**B** kết thúc bằng hai câu hỏi trực tiếp (Why…? + Is it…?). A là Opinion; C là Advantages / disadvantages.",
        },
        {
          q: "Prompt: Why do people trust online reviews? Is this a positive or negative trend? — Which plan is correct?",
          options: [
            "Body 1: advantages of reviews · Body 2: disadvantages of reviews · no opinion",
            "Body 1: my opinion · Body 2: the opposite opinion",
            "Body 1: reasons people trust reviews · Body 2: whether this is mainly positive or negative, with reasons",
          ],
          correct: 2,
          why: "Một thân bài cho mỗi câu hỏi: Thân 1 = **lý do** (Why), Thân 2 = **đánh giá có chọn phía**. A thiếu ý kiến và không trả lời Why; B là kiểu Discussion.",
        },
        {
          q: "Prompt: Fewer young people watch TV news. Why is this happening? What can TV channels do to attract them? — Which introduction is best?",
          options: [
            "Young people are watching less TV news, mainly because they prefer short videos on their phones. To win them back, channels could put shorter news clips on social media.",
            "Young people are watching less TV news. This essay will discuss the reasons and give my opinion.",
            "Young people are watching less TV news, which is a very negative development for society.",
          ],
          correct: 0,
          why: "**A** trả lời **Why** (prefer short videos) và **What can channels do** (shorter clips on social media). B không trả lời gì; C đưa ra đánh giá tốt/xấu — đề không hỏi, và bỏ cả hai câu hỏi.",
        },
        {
          q: "Which conclusion is best for the prompt in question 3?",
          options: [
            "In conclusion, TV news is boring, and the government should make it more interesting.",
            "In conclusion, young people watch less TV news because they prefer short videos, so channels should share brief clips online.",
            "In conclusion, there are many reasons and many solutions, and newspapers also have the same problem.",
          ],
          correct: 1,
          why: "**B** tóm lại đúng hai câu trả lời bằng lời khác. A thêm ý mới (government) và đổi câu hỏi; C chung chung và thêm ý mới (newspapers).",
        },
      ],
    },

    { t: "h", text: "VII. Ôn xoắn ốc — Ngày 13, 15, 17 (5 câu)" },
    {
      t: "mcq",
      id: "t2d18-bt-on",
      title: "VII. Câu điều kiện · mệnh đề quan hệ · từ nối",
      items: [
        { q: "If a story ___ viral, the website ___ more money from adverts.", options: ["will go / earns", "goes / earns", "went / will earn"], correct: 1, why: "Câu điều kiện **loại 0** (sự thật chung — Ngày 13): **If + hiện tại đơn, hiện tại đơn** → goes / earns. Không dùng **will** trong mệnh đề if; went / will earn sai thì." },
        { q: "You may share fake news ___ you check the source.", options: ["unless", "if", "so"], correct: 0, why: "**unless** = **if… not** (Ngày 13): bạn có thể chia sẻ tin giả **nếu không** kiểm tra nguồn. if làm câu ngược nghĩa; so không hợp." },
        { q: "A journalist is a person ___ writes news reports.", options: ["whose", "which", "who"], correct: 2, why: "Mệnh đề quan hệ **xác định** (Ngày 15) thay cho **người** làm chủ ngữ → **who** (hoặc that). which dùng cho vật; whose chỉ sở hữu." },
        { q: "This is the website ___ I first read the story.", options: ["which", "where", "who"], correct: 1, why: "Thay cho **nơi chốn** và sau chỗ trống là mệnh đề đủ S + V + O (I first read the story) → **where** (= on which). which cần thiếu một thành phần; who cho người (Ngày 15)." },
        { q: "Influencers are popular with teenagers. ___, many of their posts are hidden adverts.", options: ["However", "Because", "Although"], correct: 0, why: "Hai câu **riêng** (dấu chấm), ý **đối lập** → trạng từ nối cấp câu **However,** (Ngày 17). Because / Although là liên từ — phải nối hai mệnh đề trong **cùng một câu**." },
      ],
    },

    { t: "h", text: "VIII. Viết: mở bài + dàn ý (~70 từ)" },
    {
      t: "essay",
      id: "t2d18-bt-viet",
      task: "Task 2",
      prompt: "Write ONLY the introduction (2 sentences) and a short outline in note form for this essay question: “More and more people now pay for subscriptions to online news websites. Why is this happening? Is this a positive or negative development?” (about 70 words in total)",
      minWords: 60,
      tips: [
        "Câu 1: paraphrase — pay for subscriptions to online news websites → **pay a monthly fee to read news online / subscribe to digital newspapers**.",
        "Câu 2: trả lời NGẮN cả hai câu hỏi: This is mainly because… , and I believe it is a positive / negative development.",
        "Dàn ý hai cột: Q1 (2 lý do: e.g. tired of **clickbait**, want **reliable sources**, no adverts) · Q2 (phía bạn chọn + 2 lý do: e.g. supports **journalists**, but poorer people **cannot afford** it).",
        "Kiểm: mở bài có đủ CẢ HAI câu trả lời? Dàn ý có đúng một cột cho mỗi câu hỏi?",
      ],
    },
  ],
};

/* ─────────────── Bài kiểm tra chặng 3 (Ngày 13–18) — người điều phối soạn ─────────────── */

const T2D18_KIEM_TRA: Lesson = {
  id: "t2d18-kiem-tra",
  kind: "review",
  title: "Kiểm tra chặng (Ngày 13–18)",
  goal: "Tự đo xem đã nắm chắc ngữ pháp, từ vựng và 4 kỹ năng của Ngày 13–18 chưa (câu điều kiện loại 0 & 1, mệnh đề quan hệ xác định, từ nối; AWL sublist 2 phần 2, du lịch, tiền bạc – mua sắm, truyền thông – quảng cáo, collocation; Listening Part 3 (cả sơ đồ các bước), Part 1 + Part 2 giọng Úc, họp công việc; Reading Sentence completion, Matching information, Matching sentence endings; Writing problem/solution, cause/effect, Task 1 bảng, two-part question; Speaking Part 2 sự kiện, Part 3, trọng âm; gắn kết bằng this / these + danh từ), biết chính xác Ngày và mục nào cần ôn trước khi sang Ngày 19 — mốc giữa đường lên band 5.0.",
  minutes: 150,
  blocks: [
    {
      t: "recap",
      title: "Bài kiểm tra này đo gì",
      items: [
        "**8 phần**, khoảng **150 phút** (chia hai buổi được: phần 1–5 ~85′ · phần 6–8 ~65′): Ngữ pháp · Từ vựng · Dịch · Nghe · Đọc · Viết · Nói · Phát âm — toàn bộ là kiến thức **Ngày 13–18**, không có gì mới.",
        "**Đạt** = từ **70 %** trở lên ở **từng phần**. Đầu mỗi phần ghi sẵn ngưỡng đạt và **Ngày cần ôn** nếu trượt; cuối bài có bảng chỉ đúng **mục** cần mở lại.",
        "Mọi câu đều **mới** so với bài học (cùng kiến thức, khác ngữ liệu) — nhớ đáp án cũ không giúp được, phải thật sự hiểu.",
        "Đây là mốc **band 4.5 → 5.0** của Tập 2: Nghe làm được Part 1 · Part 2 · Part 3 (kể cả sơ đồ các bước), Đọc các dạng của Passage 2; Viết đủ dạng problem/solution, cause/effect, bảng Task 1, two-part question; Nói Part 2 đủ ý + Part 3 có lý do và ví dụ.",
        "Xong phần nào **ghi điểm ra giấy** phần đó rồi mới sang phần sau.",
      ],
    },
    {
      t: "p",
      text: "Đây là **bài kiểm tra chặng 3 của Tập 2** (checkpoint test). Chặng 1 (Ngày 1–6) và chặng 2 (Ngày 7–12) kiểm thì, mạo từ, giới từ, so sánh, động từ nguyên mẫu / V-ing và các dạng bài cơ bản. Chặng này kiểm **câu phức** — câu có **mệnh đề điều kiện**, **mệnh đề quan hệ** và **từ nối** — chính là thứ giám khảo tìm khi chấm **Grammatical Range** band 5 (\"có thử câu phức\"), cùng ba dạng đọc mới, Listening Part 3 và hai dạng Task 2 mới.",
    },
    {
      t: "sodo",
      kind: "mindmap",
      title: "Chặng 3 (Ngày 13–18) — những gì sẽ bị kiểm",
      center: "Ngày 13–18",
      branches: [
        { label: "Ngữ pháp", items: ["N13 điều kiện loại 0 & 1 · unless · as soon as", "N15 mệnh đề quan hệ xác định", "N17 từ nối cấp câu & cấp đoạn · this / these + N"], anh: "memo" },
        { label: "Từ vựng", items: ["N14 AWL sublist 2 (phần 2) + du lịch", "N16 tiền bạc, mua sắm + collocation", "N18 truyền thông, tin tức, quảng cáo"], anh: "books" },
        { label: "Nghe", items: ["N13 Part 3: chọn, chọn HAI, nối người, sơ đồ các bước", "N15 Part 1 + Part 2 độc thoại (người Úc)", "N17 họp công việc"], anh: "headphone" },
        { label: "Đọc", items: ["N14 Sentence completion", "N16 Matching information", "N18 Matching sentence endings"], anh: "open-book" },
        { label: "Viết", items: ["N14 problem / solution · cause / effect", "N16 Task 1 bảng", "N18 two-part question"], anh: "pencil" },
        { label: "Nói · Phát âm", items: ["N13 Part 3 nhập môn", "N15 Part 2 sự kiện", "N17 trọng âm câu, nói trong họp", "âm: trọng âm 3 âm tiết · /ɜː/ · /ə/ · /ʌ ɑː æ/ · trọng âm câu · /juː/"], anh: "microphone" },
      ],
      caption: "Mỗi nhánh là một phần của bài kiểm tra. Nhánh nào trượt thì ôn đúng Ngày ghi trên nhánh đó.",
    },
    {
      t: "note",
      title: "Cách làm bài",
      items: [
        "**Gập sách, gập vở**: không mở lại bài học, không tra từ điển, không hỏi Gia sư AI trong lúc làm. Mục đích là biết bạn **thật sự nhớ** được bao nhiêu.",
        "Thời gian gợi ý (cộng **150′**): Ngữ pháp 17′ · Từ vựng 10′ · Dịch 8′ · Nghe 30′ · Đọc 20′ · Viết 50′ (6a 15′ + 6b 20′ + 6c 5′ + 6d 4′ + 6′ đọc đề, soát bài) · Nói 10′ · Phát âm 5′. Chia **hai buổi** được: buổi 1 phần 1–5 (~85′), buổi 2 phần 6–8 (~65′).",
        "Phần **Dịch**: cố **không bấm 💡 Gợi ý**. Bấm thì vẫn được, nhưng tự trừ câu đó khi tính điểm.",
        "Phần **Nghe**: đọc câu hỏi trước, mỗi bài nghe **tối đa 2 lần**, chưa mở lời thoại cho tới khi trả lời xong cả bài đó.",
        "Phần **Đọc**: làm trong **20 phút** (bài ~570 từ, 13 câu). Hết giờ thì dừng, câu bỏ trống tính sai.",
      ],
    },
    {
      t: "table",
      caption: "Cách tính điểm — ĐẠT = từ 70 % trở lên ở TỪNG phần",
      head: ["Phần", "Số câu", "Đạt khi", "Chưa đạt thì ôn lại"],
      rows: [
        ["1. Ngữ pháp", "14 + 12", "≥ 19/26 câu đúng (cộng hai khối)", "Ngày 13 · Ngữ pháp mục 1–6 — Ngày 15 · Ngữ pháp mục 2–6 — Ngày 17 · Ngữ pháp mục 2–7"],
        ["2. Từ vựng", "12 + 6", "≥ 9/12 và ≥ 5/6", "Ngày 14 · Từ vựng mục 2–4 — Ngày 16 · Từ vựng mục 2–5 (collocation mục 4–5) — Ngày 18 · Từ vựng mục 2–4"],
        ["3. Dịch Việt → Anh", "6", "≥ 5 câu đúng", "Các bài dịch 💡 trong bài ngữ pháp Ngày 13, 15, 17 và phần Dịch của Bài tập Ngày 14, 16, 18"],
        ["4. Nghe", "5 + 9 + 4 + 5", "≥ 17/23 câu đúng (câu 8–9 tính 2 điểm)", "Câu 1–5: Ngày 15 · Nghe mục 2–4 — câu 6–14: Ngày 13 · Nghe mục 3–8 (sơ đồ 12–14: mục 5) — câu 15–18: Ngày 15 · Nghe mục 5 — câu 19–23: Ngày 17 · Nghe mục 2, 5–6"],
        ["5. Đọc", "4 + 4 + 4 + 1", "≥ 10/13 câu đúng", "Câu 1–4: Ngày 16 · Đọc mục 3–4 — câu 5–8: Ngày 14 · Đọc mục 2–4 — câu 9–12: Ngày 18 · Đọc mục 2–3"],
        ["6. Viết", "2 bài + 8 chỗ trống + 6 câu", "AI chấm ≥ band 4.5; thân bài giải pháp gắn đúng nguyên nhân; Task 1 có overview không số và số liệu đúng bảng; bài 6c ≥ 6/8; bài 6d ≥ 5/6", "6a: Ngày 14 · Viết mục 3–5 — 6b: Ngày 16 · Viết mục 2–5 — 6c: Ngày 18 · Viết mục 3–4 + Ngày 17 · Ngữ pháp mục 4–6 — 6d: Ngày 14 · Viết mục 1–2, 4"],
        ["7. Nói", "1 thẻ Part 2 + 5 câu Part 3", "AI chấm ≥ band 4.5; Part 2 nói ≥ 1 phút 30 giây, đủ 4 dòng thẻ; Part 3 mỗi câu có ý kiến + lý do + ví dụ", "Ngày 15 · Nói mục 2–4 — Ngày 13 · Nói mục 3–6 — Ngày 17 · Nói mục 1, 5"],
        ["8. Phát âm", "8 dòng", "≥ 70 điểm ở ít nhất 6/8 dòng", "N13 Nói mục 8 · N14 Từ vựng mục 6 · N15 Nói mục 7 · N16 Từ vựng mục 9 · N17 Nói mục 7 · N18 Từ vựng mục 7"],
      ],
    },

    /** ───────────── 1. Ngữ pháp ───────────── **/
    { t: "h", text: "Phần 1 — Ngữ pháp (14 + 12 câu · đạt ≥ 19/26 · trượt thì ôn Ngày 13, 15, 17)" },
    {
      t: "p",
      text: "Chọn đáp án đúng. **Khối 1a** (14 câu): **câu điều kiện loại 0 & 1**, **unless**, **as soon as / when**, dấu phẩy sau mệnh đề if, và **mệnh đề quan hệ xác định** (who / which / that / whose / where, lược bỏ đại từ quan hệ, đại từ thừa). **Khối 1b** (12 câu): **từ nối** — đúng chức năng, đúng dấu câu, không lạm dụng — và gắn kết bằng **this / these + danh từ**. Điểm phần 1 = cộng hai khối.",
    },
    {
      t: "mcq",
      id: "t2d18-kt-ngu-phap",
      title: "Phần 1a — Điều kiện & mệnh đề quan hệ (14 câu)",
      items: [
        { q: "If the tickets ___ too expensive, we will watch the match at home.", options: ["are", "will be", "were"], correct: 0, why: "Điều kiện **loại 1** (việc có thể xảy ra ở tương lai): **If + hiện tại đơn, S + will + V**. KHÔNG dùng will trong mệnh đề if: ~~If the tickets will be~~ — lỗi số 1 của người Việt. (Ngày 13 · Ngữ pháp)" },
        { q: "If you ___ the last bus, call me and I'll pick you up.", options: ["will miss", "missed", "miss"], correct: 2, why: "Mệnh đề if nói về tương lai vẫn dùng **hiện tại đơn**: If you **miss**… Mệnh đề chính có thể là **câu mệnh lệnh** (call me) — biến thể của loại 1. (Ngày 13 · Ngữ pháp)" },
        { q: "Unless you ___ harder, you will fail the final test.", options: ["don't study", "study", "will study"], correct: 1, why: "**unless = if … not**, nên sau unless dùng động từ **khẳng định**: Unless you **study** = If you **don't study**. ~~Unless you don't study~~ là phủ định kép (sai nghĩa). (Ngày 13 · Ngữ pháp)" },
        { q: "I'll send you the photos as soon as I ___ home.", options: ["will get", "got", "get"], correct: 2, why: "Mệnh đề **thời gian** nói về tương lai (as soon as / when / before / after / until) dùng **hiện tại đơn**, không dùng will: as soon as I **get** home. (Ngày 13 · Ngữ pháp)" },
        { q: "If you mix blue and yellow, you ___ green.", options: ["get", "would get", "getting"], correct: 0, why: "Sự thật / quy luật luôn đúng → **loại 0**: If + hiện tại đơn, **hiện tại đơn**. would get là điều kiện giả định (Tập 3), getting thiếu động từ chia. (Ngày 13 · Ngữ pháp)" },
        { q: "Choose the correctly punctuated sentence.", options: ["If tourists behave badly local people will complain.", "Local people will complain, if tourists behave badly.", "If tourists behave badly, local people will complain."], correct: 2, why: "Mệnh đề **if đứng đầu** → có **dấu phẩy** trước mệnh đề chính. Mệnh đề if đứng **sau** → thường **không** cần phẩy. (Ngày 13 · Ngữ pháp)" },
        { q: "I'm leaving for the airport now. ___ I arrive, I'll send you a message.", options: ["If", "When", "Unless"], correct: 1, why: "Việc **chắc chắn** sẽ xảy ra (đang ra sân bay thì chắc chắn sẽ tới) → **When**. **If** chỉ dùng cho việc **có thể** xảy ra hoặc không. (Ngày 13 · Ngữ pháp)" },
        { q: "You can't enter the museum ___ you have a ticket.", options: ["unless", "if", "as soon as"], correct: 0, why: "Nghĩa: \"không được vào **trừ khi** có vé\" → **unless** (= if you don't have a ticket, you can't enter). if sai nghĩa (có vé thì không được vào?). (Ngày 13 · Ngữ pháp)" },
        { q: "The woman ___ organised the music festival is my aunt.", options: ["whose", "which", "who"], correct: 2, why: "Danh từ chỉ **người** (the woman) làm **chủ ngữ** của mệnh đề → **who** (hoặc that). which chỉ dùng cho vật; whose = \"của người đó\". (Ngày 15 · Ngữ pháp)" },
        { q: "That is the bakery ___ my sister works on Saturdays.", options: ["where", "which", "who"], correct: 0, why: "Nơi chốn + mệnh đề đã có đủ chủ ngữ và động từ (my sister works) → **where** (= in which). Muốn dùng which thì phải có giới từ: the bakery **which** my sister works **in**. (Ngày 15 · Ngữ pháp)" },
        { q: "I met a student ___ father works for a TV channel.", options: ["who", "whose", "that"], correct: 1, why: "\"Sinh viên **mà bố của bạn ấy** làm cho đài truyền hình\" → **sở hữu** → **whose + danh từ** (whose father). (Ngày 15 · Ngữ pháp)" },
        { q: "In which sentence can the relative pronoun be LEFT OUT?", options: ["The man who lives next door is a journalist.", "The film that we watched last night was boring.", "The shop which sells second-hand books has closed."], correct: 1, why: "Chỉ lược bỏ được đại từ quan hệ khi nó làm **TÂN NGỮ** của mệnh đề: we watched **the film** → The film (that) we watched… Ở A và C, who / which là **chủ ngữ** (who lives, which sells) → **không** bỏ được. (Ngày 15 · Ngữ pháp)" },
        { q: "Choose the correct sentence.", options: ["The app I downloaded yesterday it is free.", "The app that I downloaded it yesterday is free.", "The app that I downloaded yesterday is free."], correct: 2, why: "Đại từ quan hệ (that) đã **thay** cho the app → không thêm **it** nữa: ~~downloaded it~~. A thừa **it** làm chủ ngữ lần hai. Lỗi \"đại từ thừa\" rất hay gặp ở người Việt. (Ngày 15 · Ngữ pháp)" },
        { q: "Students ___ live on campus pay less for transport.", options: ["who", "which", "whose"], correct: 0, why: "Người (students) làm chủ ngữ của mệnh đề → **who** (hoặc that). Động từ trong mệnh đề chia theo **students** (số nhiều): who **live**. (Ngày 15 · Ngữ pháp)" },
      ],
    },
    {
      t: "mcq",
      id: "t2d18-kt-ngu-phap-2",
      title: "Phần 1b — Từ nối & this / these + danh từ (12 câu)",
      items: [
        { q: "The hotel was expensive. ___, the service was excellent.", options: ["Because", "So", "However"], correct: 2, why: "Hai câu **đối lập** (đắt ↔ dịch vụ tuyệt) và từ nối đứng **đầu câu, có phẩy** → **However,**. Because / So là liên từ nối hai mệnh đề trong MỘT câu, không đứng một mình đầu câu kiểu này. (Ngày 17 · Ngữ pháp)" },
        { q: "Online shopping is popular ___ it saves time.", options: ["because", "although", "however"], correct: 0, why: "Vế sau là **lý do** → **because** + mệnh đề. although = mặc dù (đối lập); however không nối hai mệnh đề bằng dấu cách như vậy. (Ngày 17 · Ngữ pháp)" },
        { q: "___ the tickets were cheap, very few people came.", options: ["Although", "Because", "However"], correct: 0, why: "Vé rẻ **nhưng** ít người đến → nhượng bộ: **Although** + mệnh đề, + mệnh đề. However không dùng để mở một mệnh đề phụ như vậy. (Ngày 17 · Ngữ pháp)" },
        { q: "Choose the correct sentence.", options: ["Although the advert was funny, but it didn't sell many products.", "Although the advert was funny, it didn't sell many products.", "The advert was funny, however it didn't sell many products."], correct: 1, why: "**Although** và **but** không đi cùng nhau trong một câu (tiếng Việt nói \"tuy… nhưng…\", tiếng Anh chỉ chọn MỘT). C là lỗi **nối câu bằng dấu phẩy**: however phải đứng sau dấu chấm hoặc chấm phẩy (… was funny; however, it…). (Ngày 17 · Ngữ pháp)" },
        { q: "The match was postponed ___ the heavy rain.", options: ["so", "because", "because of"], correct: 2, why: "Sau chỗ trống là **cụm danh từ** (the heavy rain) → **because of** + N. **because** + mệnh đề (because it was raining heavily). (Ngày 17 · Ngữ pháp)" },
        { q: "Many shops now accept only card payments. ___, some older people find shopping difficult.", options: ["For example", "As a result", "In contrast"], correct: 1, why: "Câu sau là **kết quả** của câu trước (chỉ nhận thẻ → người lớn tuổi khó mua sắm) → **As a result,**. For example cần một ví dụ cụ thể của câu trước; In contrast cần hai điều đối lập. (Ngày 17 · Ngữ pháp)" },
        { q: "Advertising can be useful for customers. ___, it tells them about new products and special offers.", options: ["For example", "However", "Therefore"], correct: 0, why: "Câu sau **minh hoạ** \"useful\" bằng việc cụ thể → **For example,**. However (đối lập) và Therefore (kết quả) làm sai logic. (Ngày 17 · Ngữ pháp)" },
        { q: "Which linker best starts a NEW body paragraph that gives a second argument for the SAME opinion?", options: ["In addition,", "On the other hand,", "In conclusion,"], correct: 0, why: "Thêm một lập luận **cùng chiều** → **In addition, / Furthermore, / Secondly,**. On the other hand chỉ dùng khi chuyển sang **mặt ngược lại**; In conclusion dành cho kết bài. (Ngày 17 · Ngữ pháp)" },
        { q: "I wanted to buy the jacket, ___ it was too expensive.", options: ["so", "because", "but"], correct: 2, why: "Muốn mua **nhưng** quá đắt → đối lập → **but**. so (kết quả) và because (lý do) sai logic. (Ngày 17 · Ngữ pháp)" },
        {
          q: "Which paragraph uses linkers WELL (correct and not overused)?",
          options: [
            "Firstly, tourism creates jobs. Moreover, it is good. Furthermore, it is popular. In addition, people like it.",
            "Tourism creates jobs for local people. For example, a new hotel in my town employs 200 staff. As a result, fewer young people move to the city.",
            "Tourism creates jobs. However, it creates many jobs. Therefore, people like jobs.",
          ],
          correct: 1,
          why: "B: mỗi từ nối **đúng chức năng** (For example → ví dụ; As a result → kết quả) và không câu nào thừa. A **lạm dụng**: bốn từ \"thêm ý\" liền nhau cho những ý rỗng — đúng mô tả band 5 \"overuse of cohesive devices\". C dùng However / Therefore **sai logic**. (Ngày 17 · Ngữ pháp)",
        },
        { q: "Many cities now charge tourists a small entry fee. ___ has reduced the crowds in the old town.", options: ["These policy", "It policy", "This policy"], correct: 2, why: "Quay lại ý cả câu trước bằng **This + danh từ số ít** (This policy) — rõ hơn một chữ **This** trơ trọi và tránh lặp lại cả câu. ~~These policy~~ sai số (these + danh từ **số nhiều**); ~~It policy~~ không tồn tại. (Ngày 17 · Ngữ pháp mục 7)" },
        { q: "Some parents limit screen time and turn off phones at dinner. ___ help children sleep and talk more.", options: ["This measure", "These measures", "That measures"], correct: 1, why: "Câu trước nêu **hai** việc → gói lại bằng **These + danh từ số nhiều** (These measures), động từ **help** (số nhiều) cũng khớp. This measure + help sai hoà hợp; ~~That measures~~ sai số. (Ngày 17 · Ngữ pháp mục 7)" },
      ],
    },

    /** ───────────── 2. Từ vựng ───────────── **/
    { t: "h", text: "Phần 2 — Từ vựng (12 + 6 câu · đạt ≥ 9/12 và ≥ 5/6 · trượt thì ôn từ vựng Ngày 14, 16, 18)" },
    {
      t: "p",
      text: "**2a**: điền **một từ** vào chỗ trống; nghĩa tiếng Việt nằm trong ngoặc. Từ lấy từ ba bài từ vựng: **AWL + du lịch** (Ngày 14), **tiền bạc – mua sắm** (Ngày 16), **truyền thông – quảng cáo** (Ngày 18). Viết đúng chính tả và đúng **dạng** (số nhiều, danh từ / động từ). **2b**: chọn từ đúng để tạo **collocation** (cụm kết hợp tự nhiên).",
    },
    {
      t: "quiz",
      id: "t2d18-kt-tu-vung",
      title: "Phần 2a — Từ vựng chủ đề (12 câu)",
      kind: "fill",
      items: [
        { q: "Before the trip, the travel agent emailed us a detailed ___ with every flight, hotel and museum visit. (lịch trình)", answers: ["itinerary"], hint: "Ngày 14 · Du lịch" },
        { q: "Hotels and guesthouses are almost full, so finding ___ in July is very hard. (chỗ ở — danh từ không đếm được)", answers: ["accommodation"], hint: "Ngày 14 · Du lịch" },
        { q: "More than 2,000 students ___ in the online survey about travel habits last month. (tham gia — động từ họ participation, quá khứ)", answers: ["participated"], hint: "Ngày 14 · AWL sublist 2" },
        { q: "All airlines must follow international safety ___. (các quy định — họ từ regulate, số nhiều)", answers: ["regulations"], hint: "Ngày 14 · AWL sublist 2" },
        { q: "The concert was cancelled, so everyone who had bought a ticket got a full ___. (tiền hoàn lại)", answers: ["refund"], hint: "Ngày 16 · Tiền bạc & mua sắm" },
        { q: "I can't return these headphones because I have lost the ___. (hoá đơn, biên lai)", answers: ["receipt"], hint: "Ngày 16 · Tiền bạc & mua sắm" },
        { q: "Many students cannot ___ to rent a flat in the city centre. (có đủ tiền)", answers: ["afford"], hint: "Ngày 16 · Tiền bạc & mua sắm" },
        { q: "You can pay the course fee in three ___ instead of all at once. (các kỳ trả góp — số nhiều)", answers: ["instalments", "installments"], hint: "Ngày 16 · Tiền bạc & mua sắm" },
        { q: "That headline is just ___: the article contains nothing new. (tin giật tít câu lượt bấm)", answers: ["clickbait", "click-bait", "click bait"], hint: "Ngày 18 · Truyền thông" },
        { q: "The election received huge ___ on every TV channel. (lượng tin bài đưa về một sự kiện)", answers: ["coverage"], hint: "Ngày 18 · Truyền thông" },
        { q: "A sports drinks company has agreed to ___ the city marathon. (tài trợ)", answers: ["sponsor"], hint: "Ngày 18 · Quảng cáo" },
        { q: "Social media makes it easy to spread ___ about health and medicine. (thông tin sai lệch)", answers: ["misinformation", "disinformation"], hint: "Ngày 18 · Truyền thông" },
      ],
    },
    {
      t: "mcq",
      id: "t2d18-kt-colloc",
      title: "Phần 2b — Collocation (6 câu)",
      items: [
        { q: "Many young couples have to ___ a loan to buy their first home.", options: ["take out", "borrow", "make"], correct: 0, why: "Collocation **take out a loan** (vay một khoản). ~~borrow a loan~~ là dịch từng chữ \"mượn khoản vay\" — borrow đi với **money** (borrow money **from** a bank). (Ngày 16 · Từ vựng)" },
        { q: "Rents in this part of the city are very ___.", options: ["expensive", "high", "dear"], correct: 1, why: "**rent / price / cost / fee** đi với **high / low**. **expensive / cheap** tả **món đồ hoặc nơi chốn** (an expensive flat), không tả chữ price / rent: ~~expensive rents~~. (Ngày 16 · Từ vựng mục 5)" },
        { q: "Her post about a lost dog ___ viral, and thousands of strangers shared it within hours.", options: ["made", "went", "got"], correct: 1, why: "Cụm cố định **go viral** (lan truyền chóng mặt trên mạng) — quá khứ **went viral**. (Ngày 18 · Từ vựng mục 4)" },
        { q: "To protect the beach, the local council has ___ strict limits on the number of daily visitors.", options: ["imposed", "done", "given"], correct: 0, why: "**impose limits / restrictions on** + N = áp đặt giới hạn lên… (văn trang trọng, rất hợp Task 2 giải pháp). do / give không kết hợp với limits theo nghĩa này. (Ngày 14 · Từ vựng)" },
        { q: "The bank's computer failure ___ the headlines in every national newspaper.", options: ["did", "took", "made"], correct: 2, why: "Cụm **make the headlines** = lên trang nhất, thành tin nóng. (Ngày 18 · Từ vựng mục 4)" },
        { q: "Food prices have risen so much that many families can hardly make ends ___.", options: ["match", "join", "meet"], correct: 2, why: "Thành ngữ **make ends meet** = xoay xở đủ sống (thu đủ chi). Không thay meet bằng từ khác. (Ngày 16 · Từ vựng mục 3)" },
      ],
    },

    /** ───────────── 3. Dịch ───────────── **/
    { t: "h", text: "Phần 3 — Dịch Việt → Anh (6 câu · đạt ≥ 5 · trượt thì ôn bài dịch 💡 Ngày 13, 15, 17)" },
    {
      t: "p",
      text: "Dịch mỗi câu sang tiếng Anh, viết **cả câu**. Mỗi câu gộp **một điểm ngữ pháp** của chặng với **một từ vựng** đã học. Máy chấp nhận nhiều cách viết đúng; nếu chắc câu mình đúng mà máy báo sai, so với đáp án mẫu — có thể bạn dùng một từ khác nghĩa.",
    },
    {
      t: "quiz",
      id: "t2d18-kt-dich",
      title: "Phần 3 — Dịch Việt → Anh (6 câu)",
      kind: "translate",
      grammar: "If + hiện tại đơn, S + will + V · as soon as + hiện tại đơn · N + who / which / that / where + mệnh đề · However, … · Unless + khẳng định",
      items: [
        {
          q: "Nếu chính phủ không giới hạn số lượng khách du lịch, khu phố cổ sẽ bị hư hại.",
          hint: "If, the government, doesn't limit, the number of tourists, the old town, will be damaged",
          answers: [
            "If the government doesn't limit the number of tourists, the old town will be damaged.",
            "If the government does not limit the number of tourists, the old town will be damaged.",
            "If the government doesn't limit the number of tourists, the old quarter will be damaged.",
            "If the government doesn't limit the number of visitors, the old town will be damaged.",
            "If the government doesn't restrict the number of tourists, the old town will be damaged.",
            "The old town will be damaged if the government doesn't limit the number of tourists.",
            "The old town will be damaged if the government does not limit the number of tourists.",
            "Unless the government limits the number of tourists, the old town will be damaged.",
            "Unless the government limits the number of tourists, the old quarter will be damaged.",
            "The old quarter will be damaged if the government doesn't limit the number of tourists.",
            "If the government doesn't limit the number of visitors, the old quarter will be damaged.",
          ],
        },
        {
          q: "Chúng tôi sẽ bắt đầu cuộc họp ngay khi giám đốc đến.",
          hint: "We will start, the meeting, as soon as, the manager / the director, arrives",
          answers: [
            "We will start the meeting as soon as the manager arrives.",
            "We will start the meeting as soon as the director arrives.",
            "We will begin the meeting as soon as the manager arrives.",
            "We will begin the meeting as soon as the director arrives.",
            "We will start the meeting as soon as the boss arrives.",
            "We will start the meeting as soon as the manager comes.",
            "We will start the meeting as soon as the director comes.",
            "We will start the meeting as soon as the manager gets here.",
            "We will start the meeting as soon as the manager has arrived.",
            "We will start the meeting as soon as the director has arrived.",
            "As soon as the manager arrives, we will start the meeting.",
            "As soon as the director arrives, we will start the meeting.",
            "As soon as the manager arrives, we will begin the meeting.",
            "As soon as the director arrives, we will begin the meeting.",
          ],
        },
        {
          q: "Người phụ nữ đã viết bài báo này là một nhà báo nổi tiếng.",
          hint: "The woman who / that, wrote, this article, is, a famous journalist",
          answers: [
            "The woman who wrote this article is a famous journalist.",
            "The woman that wrote this article is a famous journalist.",
            "The woman who wrote this article is a well-known journalist.",
            "The woman that wrote this article is a well-known journalist.",
            "The woman who wrote this news article is a famous journalist.",
            "The woman who wrote this piece is a famous journalist.",
          ],
        },
        {
          q: "Đây là cửa hàng nơi tôi đã mua chiếc điện thoại của mình.",
          hint: "This is, the shop, where, I bought, my phone",
          answers: [
            "This is the shop where I bought my phone.",
            "This is the shop where I bought my mobile phone.",
            "This is the store where I bought my phone.",
            "This is the shop that I bought my phone from.",
            "This is the shop which I bought my phone from.",
            "This is the shop I bought my phone from.",
            "This is the shop where I bought my smartphone.",
            "This is the shop at which I bought my phone.",
          ],
        },
        {
          q: "Quảng cáo trên mạng rất phổ biến. Tuy nhiên, nhiều người không tin chúng.",
          hint: "Online adverts / ads, are very common / popular. However, many people, don't trust them",
          answers: [
            "Online adverts are very common. However, many people don't trust them.",
            "Online adverts are very popular. However, many people don't trust them.",
            "Online ads are very common. However, many people don't trust them.",
            "Online ads are very popular. However, many people don't trust them.",
            "Online advertisements are very common. However, many people don't trust them.",
            "Online advertisements are very popular. However, many people don't trust them.",
            "Online adverts are very common; however, many people don't trust them.",
            "Online adverts are very common. However, a lot of people don't trust them.",
            "Online ads are very common. However, a lot of people don't trust them.",
            "Online adverts are very common. However, many people don't believe them.",
            "Online ads are very common. However, many people don't believe them.",
            "Online advertising is very common. However, many people don't trust it.",
            "Online advertising is very popular. However, many people don't trust it.",
          ],
        },
        {
          q: "Trừ khi bạn lập ngân sách, bạn sẽ tiêu quá nhiều tiền.",
          hint: "Unless, you make / set a budget, you will spend, too much money",
          answers: [
            "Unless you make a budget, you will spend too much money.",
            "Unless you set a budget, you will spend too much money.",
            "Unless you have a budget, you will spend too much money.",
            "Unless you plan a budget, you will spend too much money.",
            "Unless you create a budget, you will spend too much money.",
            "You will spend too much money unless you make a budget.",
            "You will spend too much money unless you set a budget.",
            "If you don't make a budget, you will spend too much money.",
            "If you don't set a budget, you will spend too much money.",
            "Unless you make a budget, you will spend too much.",
          ],
        },
      ],
    },

    /** ───────────── 4. Nghe ───────────── **/
    { t: "h", text: "Phần 4 — Nghe (23 câu · đạt ≥ 17 · trượt thì ôn Ngày 13, 15, 17)" },
    {
      t: "p",
      text: "Bốn bài nghe phủ đủ ba bài Nghe của chặng: **Recording 1** — Part 1 có nhân vật **người Úc** (Ngày 15) · **Recording 2** — Part 3 hội thoại học thuật: trắc nghiệm, chọn HAI, nối người với ý kiến, **sơ đồ các bước** (Ngày 13) · **Recording 3** — Part 2 **độc thoại** của một người Úc (Ngày 15) · **Recording 4** — một cuộc **họp công việc** (Ngày 17). Với mỗi bài: đọc câu hỏi **trước**, gạch từ khoá, đoán loại từ, rồi mới bấm nghe. Mỗi bài nghe **tối đa 2 lần**; luôn lấy thông tin **cuối cùng** khi người nói đổi ý.",
    },
    { t: "h", text: "Recording 1 — Part 1 · Questions 1–5" },
    {
      t: "canh",
      anh: ["telephone-receiver", "woman-office-worker", "man-mountain-biking", "ferry"],
      caption: "Daniel gọi tới cửa hàng cho thuê xe đạp **Riverside Bike Hire** ở Perth (Úc) để đặt xe cho thứ Bảy. Nhân viên (Kylie) là **người Úc** và điền phiếu trong lúc nói chuyện.",
    },
    {
      t: "table",
      caption: "Riverside Bike Hire — Booking form · Complete the form. Write ONE WORD AND/OR A NUMBER for each answer.",
      head: ["Mục", "Thông tin"],
      rows: [
        ["Bikes", "one standard bike and one **(1) ______** bike"],
        ["Start time", "**(2) ______** p.m. (Saturday)"],
        ["Customer's surname", "Daniel **(3) ______**"],
        ["Collect bikes from", "the kiosk next to the ferry **(4) ______**"],
        ["Deposit", "$ **(5) ______**"],
      ],
    },
    {
      t: "listen",
      id: "t2d18-kt-nghe-1",
      title: "Booking bikes in Perth",
      dan: { so: "Checkpoint Test 3, Recording 1", boiCanh: "a telephone conversation between a woman who works at a bike hire shop and a man who wants to hire two bikes.", cau: [1, 5] },
      note: "Khoảng 1 phút rưỡi. Kylie (người Úc) đọc bằng giọng Úc (en-AU, nữ), Daniel giọng Mỹ — nghe giọng Úc: day ≈ \"die\", không cuốn r, cùng cách nói G'day, arvo, no worries, reckon (Ngày 15 · Nghe). Nghe tối đa 2 lần; chưa mở lời thoại cho tới khi điền xong 5 chỗ trống.",
      lines: [
        { who: "Kylie", voice: "au-nu", text: "G'day, Riverside Bike Hire, Kylie speaking.", vi: "Chào anh, Cho thuê xe đạp Riverside, Kylie nghe." },
        { who: "Daniel", voice: "us-nam", text: "Hi. I'd like to hire two bikes for this Saturday, please.", vi: "Chào chị. Tôi muốn thuê hai chiếc xe đạp cho thứ Bảy này." },
        { who: "Kylie", voice: "au-nu", text: "No worries. Our standard bikes are twenty dollars an hour, and the electric ones are thirty-five. Which would you like?", vi: "Không vấn đề gì. Xe thường giá hai mươi đô một giờ, xe điện ba mươi lăm. Anh muốn loại nào?" },
        { who: "Daniel", voice: "us-nam", text: "Two standard bikes, I think. Actually, no. My mum's coming with me, and she'd prefer an electric one. So one standard and one electric.", vi: "Hai xe thường, chắc vậy. À không. Mẹ tôi đi cùng, và bà thích xe điện hơn. Vậy một xe thường và một xe điện." },
        { who: "Kylie", voice: "au-nu", text: "Sure. And do you want them in the morning or the arvo?", vi: "Được ạ. Anh muốn lấy buổi sáng hay buổi \"arvo\"?" },
        { who: "Daniel", voice: "us-nam", text: "Sorry, the what?", vi: "Xin lỗi, buổi gì cơ?" },
        { who: "Kylie", voice: "au-nu", text: "The arvo. The afternoon. Sorry, that's Aussie slang!", vi: "\"Arvo\" ấy. Buổi chiều. Xin lỗi, tiếng lóng Úc đấy!" },
        { who: "Daniel", voice: "us-nam", text: "Ah, the afternoon, then. Could we start at one?", vi: "À, vậy buổi chiều. Bắt đầu lúc một giờ được không?" },
        { who: "Kylie", voice: "au-nu", text: "One o'clock is fully booked, I'm afraid, but there are bikes free from two.", vi: "Một giờ thì kín chỗ rồi, tiếc quá, nhưng từ hai giờ thì có xe trống." },
        { who: "Daniel", voice: "us-nam", text: "Two o'clock is fine.", vi: "Hai giờ cũng được." },
        { who: "Kylie", voice: "au-nu", text: "Lovely. Can I get your surname?", vi: "Tốt quá. Cho tôi xin họ của anh?" },
        { who: "Daniel", voice: "us-nam", text: "It's Whitlock. W, H, I, T, L, O, C, K.", vi: "Là Whitlock. W, H, I, T, L, O, C, K." },
        { who: "Kylie", voice: "au-nu", text: "W, H, I, T, L, O, C, K. Thanks, Daniel. Now, most customers collect their bikes from our main shop on King Street, but on Saturdays we use the kiosk next to the ferry terminal, because it's closer to the river path.", vi: "W, H, I, T, L, O, C, K. Cảm ơn anh Daniel. Phần lớn khách lấy xe ở cửa hàng chính trên phố King, nhưng thứ Bảy chúng tôi dùng ki-ốt cạnh bến phà, vì nó gần đường ven sông hơn." },
        { who: "Daniel", voice: "us-nam", text: "Next to the ferry terminal. Got it. Do I need to pay anything in advance?", vi: "Cạnh bến phà. Tôi hiểu rồi. Tôi có cần trả trước gì không?" },
        { who: "Kylie", voice: "au-nu", text: "Just a deposit. It used to be fifty dollars, but it's sixty now, and you get it back when you return the bikes.", vi: "Chỉ tiền đặt cọc thôi. Trước đây là năm mươi đô, nhưng giờ là sáu mươi, và anh được hoàn lại khi trả xe." },
        { who: "Daniel", voice: "us-nam", text: "Sixty. That's fine. Thanks, Kylie.", vi: "Sáu mươi. Được. Cảm ơn chị Kylie." },
        { who: "Kylie", voice: "au-nu", text: "No worries. See you Saturday!", vi: "Không có gì. Hẹn gặp anh thứ Bảy!" },
      ],
    },
    {
      t: "quiz",
      id: "t2d18-kt-nghe-1-dien",
      title: "Questions 1–5 — ONE WORD AND/OR A NUMBER",
      kind: "fill",
      items: [
        { q: "(1) Bikes: one standard bike and one ___ bike", answers: ["electric"] },
        { q: "(2) Start time: ___ p.m. (Saturday)", answers: ["2", "two", "2.00", "2:00"] },
        { q: "(3) Customer's surname: Daniel ___", answers: ["Whitlock"] },
        { q: "(4) Collect bikes from: the kiosk next to the ferry ___", answers: ["terminal"] },
        { q: "(5) Deposit: $ ___", answers: ["60", "sixty"] },
      ],
    },
    {
      t: "note",
      title: "Giải thích đáp án 1–5",
      items: [
        "**(1) electric** — bẫy **đổi ý**: \"Two standard bikes, I think. **Actually, no**… So one standard and one **electric**.\" Sau **Actually, no** là thông tin thật.",
        "**(2) 2 / two** — Daniel hỏi **one**, Kylie trả lời một giờ đã kín (**fully booked**), \"there are bikes free **from two**\" → Daniel đồng ý \"Two o'clock is fine\". **arvo** = afternoon (tiếng lóng Úc).",
        "**(3) Whitlock** — nghe đánh vần **W-H-I-T-L-O-C-K**; chữ **I** /aɪ/ dễ nhầm với **E** /iː/.",
        "**(4) terminal** — bẫy **địa điểm thường lệ**: \"**most** customers collect… from our main shop on King Street, **but on Saturdays** we use the kiosk next to the ferry **terminal**\". Phiếu đặt cho **thứ Bảy** → terminal. Phiếu đã có sẵn chữ **ferry**, chỉ điền MỘT từ.",
        "**(5) 60 / sixty** — \"It **used to be** fifty dollars, **but it's sixty now**\": used to = trước đây (đã thay đổi). Lấy con số **hiện tại**.",
      ],
    },

    { t: "h", text: "Recording 2 — Part 3 · Questions 6–14" },
    {
      t: "canh",
      anh: ["woman-student", "man-student", "man-teacher", "television"],
      caption: "Hai sinh viên **Emma** và **Josh** gặp giảng viên **Dr Hassan** để bàn đồ án nhóm về **quảng cáo nhắm vào trẻ em** (children and advertising).",
    },
    {
      t: "p",
      text: "**Questions 6–7.** Choose the correct letter, **A, B or C**. — **Questions 8–9.** Choose **TWO** letters, **A–E**. — **Questions 10–11.** Who suggested each idea? Choose **A** Emma, **B** Josh or **C** Dr Hassan. — **Questions 12–14.** Complete the flow-chart. Write **ONE WORD AND/OR A NUMBER** for each answer. Đọc trước cả chín câu (khoảng 1 phút).",
    },
    {
      t: "listen",
      id: "t2d18-kt-nghe-2",
      title: "A project on children and advertising",
      dan: { so: "Checkpoint Test 3, Recording 2", boiCanh: "a conversation between two students, Emma and Josh, and their tutor, Dr Hassan, about a project on advertising aimed at children.", cau: [6, 14] },
      note: "Khoảng 3 phút, ba giọng: Emma (Anh, nữ), Josh (Mỹ, nam), Dr Hassan (Anh, nam). Câu 6–11 ở phần đầu, sơ đồ 12–14 ở cuối bài. Nghe tối đa 2 lần.",
      lines: [
        { who: "Dr Hassan", voice: "uk-nam", text: "So, Emma, Josh, how's the advertising project going?", vi: "Nào, Emma, Josh, đồ án quảng cáo thế nào rồi?" },
        { who: "Emma", voice: "uk-nu", text: "Better than last week. We were going to study TV adverts, but we soon realised that most children we know hardly watch normal TV any more.", vi: "Khá hơn tuần trước ạ. Bọn em định nghiên cứu quảng cáo trên TV, nhưng nhanh chóng nhận ra hầu hết trẻ em bọn em biết gần như không còn xem TV thường nữa." },
        { who: "Josh", voice: "us-nam", text: "Right. So now we're looking at adverts inside mobile games, because that's where kids actually see them.", vi: "Đúng ạ. Nên giờ bọn em xem xét quảng cáo bên trong trò chơi trên điện thoại, vì đó là chỗ trẻ thật sự nhìn thấy chúng." },
        { who: "Dr Hassan", voice: "uk-nam", text: "Sensible. How are you collecting your data?", vi: "Hợp lý. Các em thu thập dữ liệu thế nào?" },
        { who: "Josh", voice: "us-nam", text: "We first planned to interview children, but the school said we'd need permission from every parent, and that would take months.", vi: "Ban đầu bọn em định phỏng vấn trẻ em, nhưng nhà trường nói cần xin phép từng phụ huynh, mà như thế mất hàng tháng." },
        { who: "Emma", voice: "uk-nu", text: "So instead, we're playing twenty popular games ourselves and recording every advert that appears in the first thirty minutes.", vi: "Nên thay vào đó, bọn em tự chơi hai mươi trò phổ biến và ghi lại mọi quảng cáo xuất hiện trong ba mươi phút đầu." },
        { who: "Dr Hassan", voice: "uk-nam", text: "Good. And what have you noticed so far?", vi: "Tốt. Đến giờ các em nhận thấy gì?" },
        { who: "Emma", voice: "uk-nu", text: "Two things worried us. First, a lot of the adverts look exactly like part of the game, so a young child can't tell that it's an advert at all.", vi: "Có hai điều làm bọn em lo. Thứ nhất, rất nhiều quảng cáo trông y hệt một phần của trò chơi, nên trẻ nhỏ không thể nhận ra đó là quảng cáo." },
        { who: "Josh", voice: "us-nam", text: "And second, some games give you extra lives if you watch an advert, so children are actually rewarded for watching them.", vi: "Và thứ hai, một số trò cho thêm mạng nếu xem quảng cáo, nên trẻ em thực ra được thưởng vì xem quảng cáo." },
        { who: "Dr Hassan", voice: "uk-nam", text: "What about the products themselves? Were many of them unhealthy?", vi: "Còn bản thân sản phẩm thì sao? Có nhiều sản phẩm không lành mạnh không?" },
        { who: "Josh", voice: "us-nam", text: "Not really, to be honest. Most of them were adverts for other games. And the adverts weren't especially long, either. Most lasted about fifteen seconds.", vi: "Thật ra là không ạ. Hầu hết là quảng cáo cho trò chơi khác. Và quảng cáo cũng không dài lắm. Đa số khoảng mười lăm giây." },
        { who: "Dr Hassan", voice: "uk-nam", text: "Interesting. Now, for your final report, I'd suggest comparing your results with the rules in two different countries. That would make your conclusions much stronger.", vi: "Thú vị đấy. Giờ, với báo cáo cuối, thầy gợi ý so sánh kết quả với quy định ở hai nước khác nhau. Như vậy kết luận của các em sẽ chắc hơn nhiều." },
        { who: "Emma", voice: "uk-nu", text: "That's a good idea. And I was thinking we could include screenshots of the worst examples, so readers can see what we mean.", vi: "Ý hay ạ. Và em đang nghĩ bọn em có thể đưa ảnh chụp màn hình những ví dụ tệ nhất, để người đọc thấy rõ ý bọn em." },
        { who: "Josh", voice: "us-nam", text: "Good point, but if we use screenshots, we'll need to check the copyright rules first.", vi: "Đúng, nhưng nếu dùng ảnh chụp màn hình thì phải kiểm tra quy định bản quyền trước." },
        { who: "Dr Hassan", voice: "uk-nam", text: "You will. The library can help you with that. Anything else?", vi: "Đúng là phải thế. Thư viện có thể giúp các em việc đó. Còn gì nữa không?" },
        { who: "Josh", voice: "us-nam", text: "Just one thing. I'd like to add a short survey of parents, maybe ten questions, to find out what they know about these adverts.", vi: "Một việc nữa ạ. Em muốn thêm một khảo sát ngắn cho phụ huynh, khoảng mười câu, để biết họ hiểu gì về những quảng cáo này." },
        { who: "Dr Hassan", voice: "uk-nam", text: "Fine, as long as it's short. Parents are busy people. Now, let's go through your plan for the next few weeks.", vi: "Được, miễn là ngắn thôi. Phụ huynh bận lắm. Giờ ta xem kế hoạch mấy tuần tới của các em." },
        { who: "Emma", voice: "uk-nu", text: "First, we'll finish recording the adverts. That should take one more week. Then we were going to sort all the adverts into categories, depending on what they're selling.", vi: "Trước hết bọn em ghi nốt quảng cáo. Mất thêm một tuần nữa. Sau đó bọn em định xếp tất cả quảng cáo vào các nhóm, tuỳ theo chúng bán gì." },
        { who: "Josh", voice: "us-nam", text: "Actually, I think the parent survey should come before that. Parents often take a while to reply, so we need to send it out early. We can put the link in the school newsletter.", vi: "Thật ra em nghĩ khảo sát phụ huynh nên làm trước việc đó. Phụ huynh thường trả lời chậm, nên phải gửi sớm. Bọn em có thể đưa đường link vào bản tin của trường." },
        { who: "Emma", voice: "uk-nu", text: "Good point. So the survey goes out straight after the recording, and then we do the categories.", vi: "Đúng. Vậy khảo sát gửi đi ngay sau khi ghi xong, rồi mới xếp nhóm." },
        { who: "Dr Hassan", voice: "uk-nam", text: "That makes sense. And the report itself?", vi: "Hợp lý. Còn bản báo cáo thì sao?" },
        { who: "Josh", voice: "us-nam", text: "We'll write it in the last two weeks. Is there a word limit?", vi: "Bọn em sẽ viết trong hai tuần cuối. Có giới hạn số từ không ạ?" },
        { who: "Dr Hassan", voice: "uk-nam", text: "Yes. Keep it under three thousand words. The markers won't read anything longer.", vi: "Có. Dưới ba nghìn từ. Người chấm sẽ không đọc bài dài hơn." },
      ],
    },
    {
      t: "mcq",
      id: "t2d18-kt-nghe-2-chon",
      title: "Questions 6–7 — Multiple choice (A, B or C)",
      items: [
        {
          q: "(6) Why did the students change the focus of their project?",
          options: ["A Children rarely watch ordinary TV now.", "B TV adverts were too difficult to record.", "C Their tutor asked them to study games."],
          correct: 0,
          why: "Emma: \"most children we know **hardly watch normal TV any more**\" → hardly = rarely, normal = ordinary → **A**. Không ai nói ghi hình TV khó (B); ý chuyển sang game là của nhóm, thầy chỉ khen \"Sensible\" (C).",
        },
        {
          q: "(7) How are the students collecting their data now?",
          options: ["A by interviewing children at a school", "B by playing games and noting the adverts", "C by asking parents to record adverts"],
          correct: 1,
          why: "Emma: \"**instead**, we're **playing twenty popular games** ourselves and **recording every advert**\" → **B**. A là kế hoạch **ban đầu** đã bỏ (cần phép từng phụ huynh); C sai — khảo sát phụ huynh là ý **thêm** ở cuối và không phải để ghi quảng cáo.",
        },
      ],
    },
    {
      t: "p",
      text: "**Questions 8–9.** Which **TWO** problems with the adverts worried the students? — **A** the adverts were very long · **B** the adverts were hard to recognise as adverts · **C** most products were unhealthy · **D** children were rewarded for watching adverts · **E** the adverts appeared too often. Viết **hai chữ cái** vào một ô (thứ tự nào cũng được, vd **AC**). Mỗi chữ cái đúng = 1 điểm (2 điểm cho cả câu).",
    },
    {
      t: "quiz",
      id: "t2d18-kt-nghe-2-hai",
      title: "Questions 8–9 — Choose TWO letters, A–E",
      kind: "fill",
      items: [
        { q: "(8–9) Two problems that worried the students (write two letters): ___", answers: ["BD", "DB", "B D", "D B", "B and D", "D and B", "B, D", "D, B"] },
      ],
    },
    {
      t: "p",
      text: "**Questions 10–11.** Who suggested each of the following? Choose **A** Emma, **B** Josh or **C** Dr Hassan.",
    },
    {
      t: "mcq",
      id: "t2d18-kt-nghe-2-ai",
      title: "Questions 10–11 — Matching (A Emma · B Josh · C Dr Hassan)",
      items: [
        {
          q: "(10) comparing the results with the rules in two countries",
          options: ["A Emma", "B Josh", "C Dr Hassan"],
          correct: 2,
          why: "Dr Hassan: \"**I'd suggest comparing** your results with the rules in two different countries.\" Emma chỉ đáp \"That's a good idea\" (đồng ý ≠ đề xuất).",
        },
        {
          q: "(11) adding a short survey of parents",
          options: ["A Emma", "B Josh", "C Dr Hassan"],
          correct: 1,
          why: "Josh: \"**I'd like to add a short survey of parents**\". Dr Hassan chỉ đồng ý có điều kiện (\"Fine, as long as it's short\"). Ý **ảnh chụp màn hình** là của Emma nhưng không có trong câu hỏi.",
        },
      ],
    },
    {
      t: "note",
      title: "Giải thích đáp án 6–11",
      items: [
        "**(8–9) B và D** — Emma: \"a lot of the adverts look exactly like part of the game, so a young child **can't tell that it's an advert**\" = **B** (hard to recognise). Josh: \"some games give you extra lives if you watch an advert, so children are actually **rewarded for watching** them\" = **D**.",
        "Ba phương án nhiễu đều được **nhắc tới rồi bị phủ định**: sản phẩm không lành mạnh → \"**Not really**\" (C sai); quảng cáo dài → \"weren't especially long… about fifteen seconds\" (A sai); quảng cáo xuất hiện quá dày (E) — không ai nói.",
        "Dạng **chọn HAI** (Ngày 13 · Nghe): hai chữ cái là **hai câu riêng**, thứ tự nào cũng đúng; người nói thường nêu hai ý bằng **First… / And second…** — tín hiệu rất rõ.",
        "Dạng **nối người – ý kiến**: nghe **ai NÓI RA** ý (I'd suggest… / I'd like to add… / I was thinking we could…), không phải ai **đồng ý** (That's a good idea / Fine / Good point).",
      ],
    },

    {
      t: "sodo",
      kind: "flow",
      title: "Questions 12–14 — Project plan (Complete the flow-chart · ONE WORD AND/OR A NUMBER)",
      steps: [
        { label: "Finish recording the adverts", sub: "one more week" },
        { label: "Send the parent survey", sub: "link in the school **(12) ______**" },
        { label: "Sort the adverts into **(13) ______**", sub: "by what they are selling" },
        { label: "Write the report", sub: "no more than **(14) ______** words" },
      ],
      caption: "Điền vào ô bên dưới theo đúng thứ tự các bước của KẾ HOẠCH CUỐI CÙNG.",
    },
    {
      t: "quiz",
      id: "t2d18-kt-nghe-2-so-do",
      title: "Questions 12–14 — Flow-chart (ONE WORD AND/OR A NUMBER)",
      kind: "fill",
      items: [
        { q: "(12) Send the parent survey: link in the school ___", answers: ["newsletter"] },
        { q: "(13) Sort the adverts into ___", answers: ["categories"] },
        { q: "(14) Write the report: no more than ___ words", answers: ["3000", "3,000", "three thousand", "3 000"] },
      ],
    },
    {
      t: "note",
      title: "Giải thích đáp án 12–14",
      items: [
        "Bẫy **đổi thứ tự**: Emma định xếp nhóm ngay sau khi ghi xong, nhưng Josh \"**Actually**, I think the parent survey should come **before** that\" → Emma chốt \"the survey goes out straight after the recording, **and then** we do the categories\". Sơ đồ đi theo **kế hoạch cuối cùng** (Ngày 13 · Nghe mục 5).",
        "**(12) newsletter** — \"We can put the link in the school **newsletter**\". Sơ đồ đã có sẵn **school**, chỉ điền một từ. **(13) categories** — \"sort all the adverts into **categories**\", nhớ **-ies** số nhiều.",
        "**(14) 3000** — \"Keep it under **three thousand** words\". Viết số (3000 / 3,000) gọn hơn viết chữ; **two weeks** là thời gian viết, không phải số từ.",
      ],
    },

    /* Recording 3 — Part 2 độc thoại (Ngày 15) */
    { t: "h", text: "Recording 3 — Part 2 · Questions 15–18" },
    {
      t: "canh",
      anh: ["man-raising-hand", "red-paper-lantern", "fireworks", "sailboat"],
      caption: "Jack, tình nguyện viên **người Úc**, nói với khách trước buổi tối của **Harbour Lights Festival** (lễ hội đèn bên cảng): lễ hội về gì, đoàn rước đèn đi từ đâu, mấy giờ, xem pháo hoa ở đâu.",
    },
    {
      t: "p",
      text: "**Questions 15–16.** Choose the correct letter, **A, B or C**. — **Questions 17–18.** Complete the notes. Write **ONE WORD AND/OR A NUMBER** for each answer.",
    },
    {
      t: "listen",
      id: "t2d18-kt-nghe-4",
      title: "Welcome to the Harbour Lights Festival",
      dan: { so: "Checkpoint Test 3, Recording 3", boiCanh: "a volunteer giving information to visitors at a harbour festival.", cau: [15, 18] },
      note: "Khoảng 1 phút rưỡi. Jack (người Úc, giọng Úc, nam) nói một mình, như bài Part 2 của Ngày 15. Nghe giọng Úc: day ≈ \"die\", không cuốn r, t giữa từ nhẹ như d; cùng cách nói G'day, arvo, reckon, heaps, no worries. Nghe tối đa 2 lần.",
      lines: [
        { who: "Jack", voice: "au-nam", text: "G'day, everyone, and welcome to the Harbour Lights Festival. My name's Jack, and I'm one of the volunteers looking after you this arvo.", vi: "Chào mọi người, chào mừng đến Lễ hội Đèn bên cảng. Tôi là Jack, một trong các tình nguyện viên lo cho các bạn chiều nay." },
        { who: "Jack", voice: "au-nam", text: "The festival started years ago as a small market for local fishermen, but these days it's mainly about music and food. The fish market has actually moved to Sunday mornings now.", vi: "Lễ hội bắt đầu từ nhiều năm trước như một phiên chợ nhỏ của ngư dân địa phương, nhưng giờ chủ yếu là âm nhạc và ẩm thực. Chợ cá thật ra đã chuyển sang sáng Chủ nhật rồi." },
        { who: "Jack", voice: "au-nam", text: "Right, the lantern parade. A lot of people think it starts at the lighthouse, but this year it starts at the old boat sheds and finishes at the lighthouse, so don't wait at the wrong end!", vi: "Nào, đoàn rước đèn. Nhiều người nghĩ nó bắt đầu ở ngọn hải đăng, nhưng năm nay nó xuất phát từ dãy nhà thuyền cũ và kết thúc ở hải đăng, nên đừng đứng đợi nhầm đầu nhé!" },
        { who: "Jack", voice: "au-nam", text: "It kicks off at seven thirty, not seven, like it says on some of the older posters.", vi: "Đoàn bắt đầu lúc bảy rưỡi, không phải bảy giờ như trên mấy tấm áp phích cũ." },
        { who: "Jack", voice: "au-nam", text: "Now, I reckon the best spot to watch the fireworks is the grass area behind the surf club. There's heaps of room there, and you'll be away from the crowds on the pier.", vi: "Giờ thì, tôi nghĩ chỗ xem pháo hoa đẹp nhất là bãi cỏ phía sau câu lạc bộ lướt sóng. Ở đó rộng lắm, và bạn tránh được đám đông trên cầu tàu." },
        { who: "Jack", voice: "au-nam", text: "And one last thing: there are no bins on the beach tonight, so please take your rubbish home with you. No worries? Enjoy the night!", vi: "Và một điều cuối: tối nay không có thùng rác trên bãi biển, nên vui lòng mang rác về nhà. Không vấn đề gì chứ? Chúc mọi người buổi tối vui vẻ!" },
      ],
    },
    {
      t: "mcq",
      id: "t2d18-kt-nghe-4-chon",
      title: "Questions 15–16 — Multiple choice (A, B or C)",
      items: [
        {
          q: "(15) What is the festival mainly about today?",
          options: ["A fishing", "B music and food", "C local history"],
          correct: 1,
          why: "\"these days it's **mainly about music and food**\" → **B**. A là **quá khứ** của lễ hội (a small market for local fishermen) và chợ cá nay đã chuyển sang sáng Chủ nhật — bẫy \"trước đây ↔ bây giờ\". C không được nhắc tới.",
        },
        {
          q: "(16) Where does the lantern parade start this year?",
          options: ["A at the old boat sheds", "B at the lighthouse", "C on the pier"],
          correct: 0,
          why: "\"A lot of people think it starts at the lighthouse, **but this year it starts at the old boat sheds**\" → **A**. Lighthouse là điểm **kết thúc** (bẫy \"nhiều người nghĩ…, nhưng…\"); pier là chỗ đông người khi xem pháo hoa.",
        },
      ],
    },
    {
      t: "quiz",
      id: "t2d18-kt-nghe-4-dien",
      title: "Questions 17–18 — ONE WORD AND/OR A NUMBER",
      kind: "fill",
      items: [
        { q: "(17) Lantern parade starts at: ___ p.m.", answers: ["7.30", "7:30", "seven thirty"] },
        { q: "(18) Best place for the fireworks: the grass area behind the ___ club", answers: ["surf"] },
      ],
    },
    {
      t: "note",
      title: "Giải thích đáp án 15–18",
      items: [
        "**(17) 7.30** — bẫy **hai mốc giờ**: \"at **seven thirty**, **not seven**, like it says on some of the older posters\". Áp phích cũ ghi sai; lấy giờ người nói khẳng định.",
        "**(18) surf** — \"the grass area behind the **surf** club\". Ghi chú đã in sẵn **club** → chỉ điền một từ. Không chọn **pier**: đó là chỗ đông người mà Jack khuyên **tránh**.",
        "Dấu hiệu người Úc (Ngày 15 · Nghe mục 2–3): **G'day** (xin chào), **arvo** (buổi chiều), **reckon** (nghĩ là), **heaps of** (rất nhiều), **No worries?** — không làm đổi đáp án nhưng phải hiểu để khỏi hoảng khi nghe.",
      ],
    },

    { t: "h", text: "Recording 4 — Cuộc họp công việc · Questions 19–23" },
    {
      t: "canh",
      anh: ["woman-office-worker", "man-office-worker", "spiral-calendar", "laptop"],
      caption: "Ba đồng nghiệp — **Grace** (trưởng nhóm), **Ben** và **Mai** — họp ngắn để chuẩn bị **ngày hội tuyển dụng** (careers fair) của công ty.",
    },
    {
      t: "p",
      text: "**Questions 19–21.** Complete the notes. Write **ONE WORD AND/OR A NUMBER** for each answer. — **Questions 22–23.** Who will do each task? Choose **A** Grace, **B** Ben or **C** Mai.",
    },
    {
      t: "listen",
      id: "t2d18-kt-nghe-3",
      title: "Planning a careers fair",
      dan: { so: "Checkpoint Test 3, Recording 4", boiCanh: "a short meeting between three colleagues who are planning a careers fair.", cau: [19, 23] },
      note: "Khoảng 2 phút, ba giọng: Grace (Mỹ, nữ), Ben (Anh, nam), Mai (Anh, nữ). Nghe tối đa 2 lần. Để ý ngôn ngữ họp: nêu ý kiến, phản đối lịch sự, chốt việc (Ngày 17).",
      lines: [
        { who: "Grace", voice: "us-nu", text: "Okay, let's get started. The careers fair is on the twelfth of March, so we've got three weeks. First, the venue. Ben, you looked into this?", vi: "Được rồi, ta bắt đầu nhé. Ngày hội tuyển dụng là ngày 12 tháng Ba, nên còn ba tuần. Trước hết là địa điểm. Ben, anh đã tìm hiểu rồi phải không?" },
        { who: "Ben", voice: "uk-nam", text: "Yes. The main hall is free, but it only holds about two hundred people. I'd suggest the sports centre instead. It's bigger, and there's more parking.", vi: "Vâng. Hội trường chính còn trống, nhưng chỉ chứa khoảng hai trăm người. Tôi đề xuất dùng nhà thi đấu. Nó rộng hơn và nhiều chỗ đỗ xe hơn." },
        { who: "Mai", voice: "uk-nu", text: "I see your point, but the sports centre is a long walk from the station. A lot of students don't drive.", vi: "Tôi hiểu ý anh, nhưng nhà thi đấu đi bộ từ ga khá xa. Nhiều sinh viên không lái xe." },
        { who: "Grace", voice: "us-nu", text: "That's true. What if we book the sports centre and run a free bus from the station?", vi: "Đúng vậy. Nếu ta đặt nhà thi đấu và chạy xe buýt miễn phí từ ga thì sao?" },
        { who: "Ben", voice: "uk-nam", text: "That works for me. I can book the sports centre this afternoon.", vi: "Tôi thấy được. Chiều nay tôi có thể đặt nhà thi đấu." },
        { who: "Grace", voice: "us-nu", text: "Great. And Mai, could you organise the bus?", vi: "Tuyệt. Còn Mai, chị lo xe buýt được không?" },
        { who: "Mai", voice: "uk-nu", text: "Sure. I'll call the bus company tomorrow.", vi: "Được. Mai tôi sẽ gọi cho công ty xe buýt." },
        { who: "Grace", voice: "us-nu", text: "Next, the companies. So far, eighteen have agreed to come. I'd like to get at least twenty-five.", vi: "Tiếp theo, các công ty. Đến giờ đã có mười tám công ty nhận lời. Tôi muốn có ít nhất hai mươi lăm." },
        { who: "Mai", voice: "uk-nu", text: "In my view, we should ask local start-ups. Students are really interested in small companies these days.", vi: "Theo tôi, ta nên mời các công ty khởi nghiệp trong vùng. Dạo này sinh viên rất quan tâm tới công ty nhỏ." },
        { who: "Grace", voice: "us-nu", text: "Good idea. I'll write to the start-ups myself, because I know a few of the founders.", vi: "Ý hay. Tôi sẽ tự viết thư cho các công ty khởi nghiệp, vì tôi quen vài nhà sáng lập." },
        { who: "Ben", voice: "uk-nam", text: "And what about the posters? Shall I design them?", vi: "Còn áp phích thì sao? Tôi thiết kế nhé?" },
        { who: "Grace", voice: "us-nu", text: "Actually, Mai's better at design. Ben, you've already got the venue. Mai, would you mind doing the posters as well?", vi: "Thật ra Mai giỏi thiết kế hơn. Ben, anh đã nhận phần địa điểm rồi. Mai, chị có phiền làm luôn áp phích không?" },
        { who: "Mai", voice: "uk-nu", text: "Not at all. I'll have a draft ready by Friday.", vi: "Không phiền đâu. Thứ Sáu tôi sẽ có bản nháp." },
        { who: "Grace", voice: "us-nu", text: "Perfect. So, to sum up: Ben books the venue, Mai does the bus and the posters, and I contact the start-ups. Let's meet again next Tuesday.", vi: "Tuyệt. Vậy tóm lại: Ben đặt địa điểm, Mai lo xe buýt và áp phích, còn tôi liên hệ các công ty khởi nghiệp. Thứ Ba tuần sau ta họp lại." },
      ],
    },
    {
      t: "quiz",
      id: "t2d18-kt-nghe-3-dien",
      title: "Questions 19–21 — ONE WORD AND/OR A NUMBER",
      kind: "fill",
      items: [
        { q: "(19) Venue: the ___ centre", answers: ["sports"] },
        { q: "(20) Transport: a free ___ from the station", answers: ["bus"] },
        { q: "(21) Target: at least ___ companies", answers: ["25", "twenty-five", "twenty five"] },
      ],
    },
    {
      t: "mcq",
      id: "t2d18-kt-nghe-3-ai",
      title: "Questions 22–23 — Who will do each task? (A Grace · B Ben · C Mai)",
      items: [
        {
          q: "(22) contact local start-ups",
          options: ["A Grace", "B Ben", "C Mai"],
          correct: 0,
          why: "Bẫy: **Mai** là người **đề xuất** mời start-up, nhưng **Grace** nhận việc: \"**I'll write to the start-ups myself**\". Câu hỏi là AI LÀM, không phải ai đề xuất.",
        },
        {
          q: "(23) design the posters",
          options: ["A Grace", "B Ben", "C Mai"],
          correct: 2,
          why: "Bẫy đổi người: Ben **xin** làm (\"Shall I design them?\") nhưng Grace chuyển cho **Mai** (\"Mai, would you mind doing the posters as well?\" — \"Not at all\" = đồng ý).",
        },
      ],
    },
    {
      t: "note",
      title: "Giải thích đáp án 19–23",
      items: [
        "**(19) sports** — bẫy **phương án bị thay**: hội trường chính (main hall) còn trống nhưng chỉ chứa khoảng 200 người → Ben: \"I'd suggest the **sports centre** instead\"; Grace và Ben chốt \"book the sports centre\". Ghi chú đã in sẵn **centre**, chỉ điền một từ.",
        "**(20) bus** — Grace: \"What if we book the sports centre and run a **free bus** from the station?\" Ghi chú đã có sẵn **free**, chỉ điền một từ.",
        "**(21) 25** — bẫy **hai con số**: **eighteen** là số công ty **đã nhận lời**; **at least twenty-five** là **mục tiêu**.",
        "Câu hỏi đi **đúng thứ tự bài nghe**: địa điểm → xe buýt → số công ty → ai liên hệ start-up → ai làm áp phích. Ben (B) không phải đáp án của câu 22–23: việc của Ben là **đặt địa điểm** — trong đề thật, một phương án có thể không được dùng.",
        "Ngôn ngữ họp (Ngày 17): **I'd suggest… instead** (đề xuất) · **I see your point, but…** (phản đối lịch sự) · **What if we…?** (gợi ý dung hoà) · **That works for me** (đồng ý) · **So, to sum up…** (tóm tắt — câu này thường lặp lại ĐÁP ÁN, nghe lần hai để kiểm).",
      ],
    },

    /** ───────────── 5. Đọc ───────────── **/
    { t: "h", text: "Phần 5 — Đọc (13 câu · đạt ≥ 10 · trượt thì ôn Ngày 14, 16, 18)" },
    {
      t: "p",
      text: "**20 phút**, như một bài Passage 2. Ba dạng câu hỏi của chặng: **Matching information** (Ngày 16) · **Sentence completion** (Ngày 14) · **Matching sentence endings** (Ngày 18). Gợi ý thứ tự: làm **Sentence completion** và **Matching sentence endings** trước (đi theo thứ tự bài), làm **Matching information** sau cùng (không theo thứ tự).",
    },
    {
      t: "passage",
      title: "The Repair Café: Fixing Things, Not Throwing Them Away",
      intro: "Bài đọc 6 đoạn A–F (khoảng 570 từ). Questions 1–13 ở bên dưới. Phong trào Repair Café có thật; các con số, khảo sát và lời trích trong bài đã đơn giản hoá / tự đặt cho bài luyện — đừng dùng làm dữ kiện thật.",
      paras: [
        {
          label: "A",
          text: "In October 2009, a former journalist named Martine Postma organised a small event in a theatre café in Amsterdam. She invited people to bring broken household items, from toasters to torn jackets, and asked a few volunteers with practical skills to help mend them. Postma had expected perhaps a dozen visitors. Several times that number came. The idea, which she called the Repair Café, was simple: instead of buying something new, people could sit beside an expert and learn how to fix the old one. Today there are thousands of Repair Cafés in many countries.",
        },
        {
          label: "B",
          text: "The events follow a similar pattern everywhere. They are usually held once a month in a public building such as a library, a school hall or a community centre. Visitors do not pay for the repair, although most cafés ask for a small donation to cover tools and spare parts. Each visitor is asked to stay at the table while their item is being repaired. This rule is important to the organisers, because the aim is not only to fix the object but also to show its owner how it works, so that they can deal with the problem themselves next time.",
        },
        {
          label: "C",
          text: "The items that people bring reveal a great deal about modern products. According to records kept by volunteers at one group of cafés, the most common objects are small electrical appliances, especially coffee machines and vacuum cleaners, followed by clothes and bicycles. A large share of the items leave the café in working order. The most frequent reason for failure is not that a repair is too difficult, but that the manufacturer does not sell the spare part that is needed. Some products are also glued together rather than screwed, which means they cannot be opened without being damaged.",
        },
        {
          label: "D",
          text: "Supporters argue that Repair Cafés bring real environmental benefits. One small study estimated that a single café can prevent several hundred kilograms of waste from going to landfill each year. Economists point out a second advantage: families save money, which matters most to people on low incomes. However, critics note that these figures are small when compared with the total amount of rubbish a city produces. In their view, the cafés may make volunteers feel good without changing the way products are designed and sold.",
        },
        {
          label: "E",
          text: "For many visitors, the social side of the café is just as valuable as the repair. In one survey of regular visitors, more than half said that they came partly to meet people. Older volunteers, many of them retired engineers and tailors, said that the cafés gave them a chance to pass on skills that would otherwise disappear. Younger visitors, in turn, often said that they had never seen anyone repair anything before. One student described the experience as 'a lesson that school never gave me'.",
        },
        {
          label: "F",
          text: "The movement has also begun to influence the law. In recent years, several governments have introduced 'right to repair' rules, which require manufacturers to sell spare parts for a number of years and to make repair information available to the public. Postma welcomes these changes but warns that rules alone will not be enough. Unless people regain the habit of repairing, she says, they will continue to replace things simply because it feels easier. If that is true, the most important thing a Repair Café produces may not be a working toaster, but a different attitude towards the things we own.",
        },
      ],
    },
    {
      t: "p",
      text: "**Questions 1–4.** Which paragraph contains the following information? Write the correct letter, **A–F**. **NB** You may use any letter more than once. — **Đoạn nào chứa thông tin sau? Một chữ cái có thể dùng nhiều lần.**",
    },
    {
      t: "mcq",
      id: "t2d18-kt-doc-doan",
      title: "Phần 5a — Matching information (4 câu, A–F)",
      items: [
        {
          q: "(1) a reason why some items cannot be fixed",
          options: ["A", "B", "C", "D", "E", "F"],
          correct: 2,
          why: "Đoạn **C**: \"The most frequent **reason for failure** is… that the manufacturer does not sell the **spare part**\" + đồ dán keo không mở được. reason why… cannot be fixed = reason for failure.",
        },
        {
          q: "(2) a comparison between the number of people expected and the number who came",
          options: ["A", "B", "C", "D", "E", "F"],
          correct: 0,
          why: "Đoạn **A**: \"Postma had **expected** perhaps a dozen visitors. **Several times that number came**.\" Đoạn E cũng nói về khách (one survey) nhưng không so sánh số dự kiến với số thực tế.",
        },
        {
          q: "(3) a criticism of the idea that Repair Cafés help the environment",
          options: ["A", "B", "C", "D", "E", "F"],
          correct: 3,
          why: "Đoạn **D**: \"**critics** note that these figures are **small** compared with the total amount of rubbish…\" — phản bác lợi ích môi trường vừa nêu. Đoạn F có \"warns\" nhưng là cảnh báo luật chưa đủ, không phải chê lợi ích môi trường.",
        },
        {
          q: "(4) a description of what visitors are expected to do during a repair",
          options: ["A", "B", "C", "D", "E", "F"],
          correct: 1,
          why: "Đoạn **B**: \"Each visitor is asked to **stay at the table** while their item is being repaired\" + mục đích để họ học cách tự sửa. are expected to = are asked to.",
        },
      ],
    },
    {
      t: "p",
      text: "**Questions 5–8.** Complete the sentences below. Choose **NO MORE THAN TWO WORDS** from the passage for each answer. — **Hoàn thành câu. Chọn KHÔNG QUÁ HAI TỪ trong bài.**",
    },
    {
      t: "quiz",
      id: "t2d18-kt-doc-cau",
      title: "Phần 5b — Sentence completion (4 câu) — NO MORE THAN TWO WORDS",
      kind: "fill",
      items: [
        { q: "(5) Although repairs are free, visitors are usually asked to give a small ___.", answers: ["donation"] },
        { q: "(6) After small electrical appliances, the items brought most often are clothes and ___.", answers: ["bicycles"] },
        { q: "(7) According to one study, a single café can stop several hundred kilograms of waste from reaching ___ every year.", answers: ["landfill"] },
        { q: "(8) Many of the older volunteers used to work as engineers or ___.", answers: ["tailors"] },
      ],
    },
    {
      t: "p",
      text: "**Questions 9–12.** Complete each sentence with the correct ending, **A–G**, below. — **Ghép mỗi đầu câu với đuôi câu đúng A–G** (có 3 đuôi thừa).",
    },
    {
      t: "table",
      caption: "List of endings",
      head: ["", "Ending"],
      rows: [
        ["**A**", "because they had never watched anyone mend an object."],
        ["**B**", "so that owners can solve the same problem on their own later."],
        ["**C**", "unless people start repairing things again."],
        ["**D**", "because spare parts are too expensive to buy."],
        ["**E**", "even though it gives them a chance to save money."],
        ["**F**", "to sell spare parts and share repair information."],
        ["**G**", "because more than half of them are retired."],
      ],
    },
    {
      t: "mcq",
      id: "t2d18-kt-doc-duoi",
      title: "Phần 5c — Matching sentence endings (4 câu, A–G)",
      items: [
        {
          q: "(9) Visitors stay beside the volunteer during a repair",
          options: ["A", "B", "C", "D", "E", "F", "G"],
          correct: 1,
          why: "Đoạn **B**: mục đích là chỉ cho chủ đồ cách nó hoạt động \"**so that they can deal with the problem themselves next time**\" = **B** (on their own later). Các đuôi \"because…\" khác không phải lý do được nêu cho quy tắc này.",
        },
        {
          q: "(10) The café was a new experience for many younger visitors",
          options: ["A", "B", "C", "D", "E", "F", "G"],
          correct: 0,
          why: "Đoạn **E**: \"Younger visitors… often said that they had **never seen anyone repair anything** before\" = **A**. G sai: \"retired\" nói về **người tình nguyện lớn tuổi**, không phải người trẻ.",
        },
        {
          q: "(11) New 'right to repair' rules require manufacturers",
          options: ["A", "B", "C", "D", "E", "F", "G"],
          correct: 5,
          why: "Đoạn **F**: rules \"require manufacturers **to sell spare parts**… and **to make repair information available**\" = **F**. Về ngữ pháp, **require + O + to V** → chỉ đuôi bắt đầu bằng **to** mới khớp.",
        },
        {
          q: "(12) According to Postma, people will keep replacing their belongings",
          options: ["A", "B", "C", "D", "E", "F", "G"],
          correct: 2,
          why: "Đoạn **F**: \"**Unless** people regain the habit of repairing… they will continue to replace things\" = **C** (unless = nếu không — câu điều kiện loại 1, Ngày 13). D sai: bài nói hãng **không bán** linh kiện, chưa bao giờ nói linh kiện **quá đắt**.",
        },
      ],
    },
    {
      t: "p",
      text: "**Question 13.** Choose the correct letter, **A, B, C or D**.",
    },
    {
      t: "mcq",
      id: "t2d18-kt-doc-y-chinh",
      title: "Phần 5d — Câu hỏi ý chính (1 câu)",
      items: [
        {
          q: "(13) What is the writer's main point in the last sentence of the passage?",
          options: [
            "A Repair Cafés should start producing their own toasters.",
            "B The biggest result of Repair Cafés may be a change in how people think about their possessions.",
            "C Laws about repair are more important than Repair Cafés.",
            "D Most people find repairing things easier than replacing them.",
          ],
          correct: 1,
          why: "\"the most important thing a Repair Café produces may not be a working toaster, but **a different attitude towards the things we own**\" = **B** (attitude = how people think; things we own = possessions). C ngược ý Postma (rules alone will not be enough); D ngược bài (thay mới \"feels easier\").",
        },
      ],
    },
    {
      t: "note",
      title: "Nhìn lại phần Đọc — thứ tự và bẫy",
      items: [
        "**Matching information** (1–4) KHÔNG theo thứ tự (C → A → D → B) và có hai đoạn không dùng (E, F) — đúng tính chất dạng này (Ngày 16). Gạch **loại thông tin**: a reason · a comparison · a criticism · a description.",
        "**Sentence completion** (5–8) theo thứ tự bài (B → C → D → E). Chép **đúng từ trong bài**, đúng số ít/số nhiều: **bicycles**, **tailors** (danh sách nghề → số nhiều).",
        "**Matching sentence endings** (9–12) theo thứ tự bài (B → E → F → F). Lọc theo **ngữ pháp** trước (require + **to V** → F) rồi theo **nghĩa**; đuôi nhiễu thường **đúng sự thật ở chỗ khác trong bài** nhưng không khớp đầu câu (G nói về người lớn tuổi, E nói về tiết kiệm tiền).",
      ],
    },

    /** ───────────── 6. Viết ───────────── **/
    { t: "h", text: "Phần 6 — Viết (2 bài + 8 chỗ trống + 6 câu · đạt khi AI chấm ≥ band 4.5, đủ cấu trúc, bài 6c ≥ 6/8 và bài 6d ≥ 5/6 · trượt thì ôn Ngày 14, 16, 18)" },
    {
      t: "p",
      text: "**Bài 6a** (15 phút): đề **cause / solution** đã có sẵn mở bài và thân bài 1 (nguyên nhân) — bạn viết **thân bài 2 (giải pháp)** và **kết bài**, khoảng 120–150 từ. Mỗi giải pháp phải **gắn đúng** một nguyên nhân đã nêu (Ngày 14). **Bài 6b** (20 phút): viết **trọn** bài Task 1 cho bảng bên dưới (Ngày 16). **Bài 6c** (5 phút): điền 8 chỗ trống trong một bài mẫu **two-part question** (Ngày 18) — kiểm cả từ nối (Ngày 17), mệnh đề quan hệ (Ngày 15) và câu điều kiện (Ngày 13). **Bài 6d** (4 phút): 6 câu trắc nghiệm về dạng **cause / effect** (Ngày 14).",
    },
    {
      t: "essay",
      id: "t2d18-kt-viet-giai-phap",
      task: "Task 2",
      prompt: "Many young adults today are in debt. What are the causes of this problem, and what solutions can you suggest? — PHẦN CHO SẴN (không viết lại): [Introduction] \"These days, a large number of young people owe money to banks, shops or online lenders. This essay will discuss the main causes of this problem and suggest some practical solutions.\" [Body 1] \"There are two main causes. Firstly, borrowing has become extremely easy. Many shopping apps offer 'buy now, pay later' services, so a young person can buy an expensive phone with one click and without any checks. Secondly, most schools do not teach students how to manage money. As a result, many young adults leave home without knowing how to make a budget or how interest works.\" — HÃY VIẾT: Body 2 (giải pháp cho ĐÚNG hai nguyên nhân trên) + Conclusion.",
      minWords: 120,
      tips: [
        "Câu chủ đề thân bài 2: **There are several ways to tackle this problem.** — rồi **một giải pháp cho mỗi nguyên nhân**, theo đúng thứ tự Body 1 (dễ đọc, CC tốt).",
        "Giải pháp = **ai + should + làm gì + để làm gì / kết quả**: Governments should… so that… · If schools teach…, young people will… (điều kiện loại 1, Ngày 13).",
        "Từ nối đúng vai, không lạm dụng (Ngày 17): **Firstly, / Secondly, / For example, / As a result,** — mỗi đoạn 2–3 từ nối là đủ.",
        "Từ vựng tiền bạc (Ngày 16) và collocation: **make a budget · get into debt · pay off a loan · a credit check · manage money · impulse buying**.",
        "Kết bài 2 câu: nhắc lại **hai nguyên nhân + hai giải pháp** bằng lời khác — không thêm ý mới.",
      ],
    },
    {
      t: "figure",
      fig: {
        kind: "table",
        title: "Average monthly spending by university students in one city (US$), 2005–2025",
        note: "Số liệu tự đặt cho bài kiểm tra.",
        categories: ["2005", "2015", "2025"],
        series: [
          { name: "Rent", values: [250, 300, 450] },
          { name: "Food", values: [150, 180, 210] },
          { name: "Transport", values: [70, 60, 45] },
          { name: "Entertainment", values: [50, 80, 140] },
        ],
      },
    },
    {
      t: "essay",
      id: "t2d18-kt-viet-bang",
      task: "Task 1",
      prompt: "The table above shows the average amount of money that university students in one city spent each month on four categories in 2005, 2015 and 2025. Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words. (Data, US$ per month — Rent: 2005 250, 2015 300, 2025 450 · Food: 150, 180, 210 · Transport: 70, 60, 45 · Entertainment: 50, 80, 140.)",
      minWords: 150,
      tips: [
        "Mở bài: shows → **illustrates / compares**; the average amount of money… spent → **how much students typically spent**; in 2005, 2015 and 2025 → **over a twenty-year period**.",
        "Overview (KHÔNG số, Ngày 16): **rent luôn là khoản lớn nhất**; ba khoản tăng, **chỉ transport giảm**; entertainment tăng mạnh nhất về tỉ lệ (gần gấp ba).",
        "Chọn số nổi bật, đừng kể hết 12 ô: Body 1 = **rent + food** (250 → 450 = tăng 200; 150 → 210). Body 2 = **entertainment vs transport** (50 → 140, vượt transport từ 2015; 70 → 45).",
        "Ngôn ngữ số liệu: **rose from … to … · increased by … · almost tripled · fell steadily to … · overtook · the largest / the smallest**; bảng có năm → **quá khứ đơn** (dự đoán 2025 nếu bạn coi là tương lai: was expected to…; ở đây coi như số đã có).",
        "Soát số: mọi con số khớp bảng. Nhắm 160–190 từ.",
      ],
    },
    { t: "h", text: "Bài 6c — Two-part question: điền bài mẫu (8 chỗ trống · đạt ≥ 6)" },
    {
      t: "p",
      text: "**Đề:** \"Nowadays, many people get their news from social media rather than from newspapers. Why is this happening? Is this a positive or negative development?\" — Đọc **cả bài** trước (chỗ trống (2) phải đọc tới thân bài 2 mới biết), rồi điền **một từ** vào mỗi chỗ trống (riêng (4) có thể là một cụm 2 từ).",
    },
    {
      t: "examples",
      items: [
        { en: "[Introduction] These days, a growing number of people read the news on social media (1) ___ of in printed newspapers. This essay will explain why this trend is happening and argue that it is mainly a (2) ___ development.", vi: "[Mở bài] Ngày nay, ngày càng nhiều người đọc tin trên mạng xã hội (1) ___ trên báo in. Bài viết sẽ giải thích vì sao xu hướng này xảy ra và lập luận rằng nhìn chung đây là một sự thay đổi (2) ___." },
        { en: "[Body 1] The main reason is convenience. People (3) ___ own a smartphone can check the latest news anywhere, and usually for free. (4) ___, social media shows each person the stories that they are most likely to click on, so reading the news feels quick and easy.", vi: "[Thân bài 1] Lý do chính là sự tiện lợi. Những người (3) ___ có điện thoại thông minh có thể xem tin mới nhất ở bất cứ đâu, thường là miễn phí. (4) ___, mạng xã hội cho mỗi người xem những tin mà họ dễ bấm vào nhất, nên đọc tin thấy nhanh và dễ." },
        { en: "[Body 2] However, I believe this change has more disadvantages than advantages. Firstly, false stories spread very quickly online. If a post (5) ___ shocking, thousands of people share it before anyone checks the facts. (6) ___, users mainly see opinions (7) ___ match their own views, (8) ___ they rarely learn about other perspectives.", vi: "[Thân bài 2] Tuy nhiên, tôi cho rằng thay đổi này có nhiều mặt hại hơn mặt lợi. Thứ nhất, tin sai lan rất nhanh trên mạng. Nếu một bài đăng (5) ___ gây sốc, hàng nghìn người chia sẻ nó trước khi có ai kiểm tra sự thật. (6) ___, người dùng chủ yếu thấy những ý kiến (7) ___ khớp với quan điểm của họ, (8) ___ họ hiếm khi biết đến góc nhìn khác." },
        { en: "[Conclusion] In conclusion, people turn to social media for news because it is fast, free and personalised, but this trend is largely harmful because it spreads false information and limits the range of views that people see.", vi: "[Kết bài] Tóm lại, người ta chuyển sang mạng xã hội để đọc tin vì nó nhanh, miễn phí và hợp sở thích từng người, nhưng xu hướng này phần lớn có hại vì nó lan truyền tin sai và thu hẹp các quan điểm mà người ta được thấy." },
      ],
    },
    {
      t: "quiz",
      id: "t2d18-kt-viet-hai-cau",
      title: "Bài 6c — Điền bài mẫu two-part question (8 chỗ trống)",
      kind: "fill",
      items: [
        { q: "(1) …read the news on social media ___ of in printed newspapers. (thay vì)", answers: ["instead"] },
        { q: "(2) …argue that it is mainly a ___ development. (đọc thân bài 2 + kết bài)", answers: ["negative", "harmful", "bad"] },
        { q: "(3) People ___ own a smartphone can check the latest news… (đại từ quan hệ)", answers: ["who", "that"] },
        { q: "(4) ___, social media shows each person the stories… (thêm ý, đầu câu)", answers: ["In addition", "Moreover", "Furthermore", "Also", "Additionally", "Besides"] },
        { q: "(5) If a post ___ shocking, thousands of people share it… (động từ, điều kiện loại 0)", answers: ["is", "looks", "seems", "sounds", "appears"] },
        { q: "(6) ___, users mainly see opinions… (ý hại thứ hai)", answers: ["Secondly", "Second", "In addition", "Moreover", "Furthermore", "Also"] },
        { q: "(7) …opinions ___ match their own views… (đại từ quan hệ, chỉ vật)", answers: ["that", "which"] },
        { q: "(8) …match their own views, ___ they rarely learn about other perspectives. (kết quả, liên từ)", answers: ["so", "and so"] },
      ],
    },
    {
      t: "note",
      title: "Giải thích bài 6c",
      items: [
        "**(1) instead** — **instead of** + V-ing / N = thay vì. **(2) negative** — thân bài 2 \"more disadvantages than advantages\" và kết bài \"largely harmful\" → mở bài phải nói **negative** ngay: two-part question cần **trả lời thẳng câu hỏi 2 ngay ở mở bài** (Ngày 18 · Viết).",
        "**(3) who / that** — người (people) làm chủ ngữ của mệnh đề (who own…). **(7) that / which** — vật (opinions) làm chủ ngữ (that match…). Không bỏ được đại từ ở cả hai chỗ vì nó là **chủ ngữ** (Ngày 15).",
        "**(4) In addition / Moreover…** — thêm một lý do **cùng chiều** cho câu hỏi 1. **(6) Secondly** — đã có **Firstly** ở trên → ý thứ hai. **(8) so** — liên từ chỉ **kết quả** nối hai mệnh đề trong một câu (sau dấu phẩy); As a result phải bắt đầu câu mới (Ngày 17).",
        "**(5) is / looks / seems** — điều kiện **loại 0** (điều luôn xảy ra): If + **hiện tại đơn**, hiện tại đơn (share). ~~will be~~ sai vì không dùng will trong mệnh đề if (Ngày 13).",
        "Cấu trúc two-part: **Body 1 = câu hỏi 1 (Why?)** · **Body 2 = câu hỏi 2 (positive / negative?)** · kết bài trả lời lại **cả hai**. Thiếu một câu hỏi → Task Response khó vượt band 5.",
      ],
    },

    { t: "h", text: "Bài 6d — Cause / effect: ngôn ngữ nguyên nhân – kết quả và kiểu đề (6 câu · đạt ≥ 5)" },
    {
      t: "p",
      text: "**4 phút.** Dạng **cause / effect** của Ngày 14: nhận ra đề hỏi nguyên nhân + kết quả, và dùng đúng **because / because of · lead to · As a result** (Ngày 14 · Viết mục 4).",
    },
    {
      t: "mcq",
      id: "t2d18-kt-viet-nguyen-nhan",
      title: "Bài 6d — Cause / effect (6 câu)",
      items: [
        { q: "Rents in the old town have risen ___ the large number of holiday flats.", options: ["so", "because", "because of"], correct: 2, why: "Sau chỗ trống là **cụm danh từ** (the large number of holiday flats) → **because of** + N. because cần một mệnh đề (because there are many holiday flats); so chỉ kết quả, sai logic. (Ngày 14 · Viết mục 4)" },
        { q: "Working very long hours can ___ health problems such as stress and poor sleep.", options: ["lead to", "result from", "because of"], correct: 0, why: "Long hours là **nguyên nhân**, health problems là **kết quả** → nguyên nhân + **lead to** + kết quả. **result from** đảo chiều (kết quả + result from + nguyên nhân); because of không đứng sau can. (Ngày 14 · Viết mục 4)" },
        { q: "Cheap flights have made travel much easier. ___, many popular cities are now overcrowded.", options: ["As a result", "Although", "Because"], correct: 0, why: "Câu sau là **kết quả** của câu trước, đứng đầu câu mới có phẩy → **As a result,**. Because / Although không mở một câu độc lập như vậy (và Although là đối lập). (Ngày 14 · Viết mục 4; Ngày 17 · Ngữ pháp mục 4)" },
        { q: "Which question asks for a CAUSES + EFFECTS essay?", options: ["What problems does this cause, and how can they be solved?", "Why is this happening, and what effects does it have on society?", "What can governments do to reduce this?"], correct: 1, why: "**Why is this happening?** = nguyên nhân; **what effects…?** = kết quả → kiểu **causes + effects**: Body 1 nguyên nhân, Body 2 kết quả, KHÔNG cần giải pháp. A là problems + solutions; C chỉ hỏi biện pháp. (Ngày 14 · Viết mục 1)" },
        { q: "Choose the correct sentence.", options: ["Overtourism results to higher house prices.", "Overtourism leads to increase house prices.", "Overtourism leads to higher house prices."], correct: 2, why: "**lead to / result in + danh từ** (higher house prices). ~~results to~~ sai giới từ (result **in**); ~~leads to increase~~ sai vì sau to ở đây là **danh từ**, không phải động từ nguyên mẫu. (Ngày 14 · Viết mục 4)" },
        { q: "In a causes + effects essay, Body 2 should mainly…", options: ["suggest a solution for each cause", "explain the effects, with an example", "repeat the causes in different words"], correct: 1, why: "Mỗi câu hỏi một thân bài: Body 1 = **nguyên nhân**, Body 2 = **kết quả** (kèm ví dụ). Thêm giải pháp khi đề không hỏi là lạc đề một phần; lặp nguyên nhân là không trả lời câu hỏi 2. (Ngày 14 · Viết mục 2)" },
      ],
    },

    /** ───────────── 7. Nói ───────────── **/
    { t: "h", text: "Phần 7 — Nói (1 thẻ Part 2 + 5 câu Part 3 · đạt khi AI chấm ≥ band 4.5 · trượt thì ôn Ngày 13, 15, 17)" },
    {
      t: "p",
      text: "**Part 2** (Ngày 15): đọc thẻ đề, bấm giờ **1 phút** ghi từ khoá theo sơ đồ ý, rồi nói **1–2 phút** — kể bằng quá khứ, dùng 2–3 **mệnh đề quan hệ** để thêm chi tiết (the friend who…, the place where…), kết bằng cảm xúc. **Part 3** (Ngày 13): mỗi câu **ý kiến → lý do → ví dụ** (3–5 câu), nói về **people / society**, không chỉ về bản thân; được phép xin nhắc lại câu hỏi. Giữ **trọng âm câu** (Ngày 17): nhấn từ nội dung, đọc lướt từ chức năng.",
    },
    {
      t: "speak",
      id: "t2d18-kt-noi-p2",
      part: "2",
      questions: [
        "Describe an event you attended that was organised by a school, a company or a local community. You should say: what the event was; when and where it took place; who organised it; and explain why you remember it.",
      ],
    },
    {
      t: "speak",
      id: "t2d18-kt-noi-p3",
      part: "3",
      questions: [
        "Why do you think many people prefer to shop online nowadays?",
        "Should companies be allowed to advertise to young children?",
        "What will happen if people keep buying things they do not really need?",
        "How do people in your country usually find out about local events?",
        "In a work meeting, is it better to speak a lot or to listen carefully?",
      ],
    },

    /** ───────────── 8. Phát âm ───────────── **/
    { t: "h", text: "Phần 8 — Phát âm (8 dòng · đạt ≥ 70 điểm ở 6/8 dòng · trượt thì ôn mục phát âm Ngày 13–18)" },
    {
      t: "phatam",
      id: "t2d18-kt-phat-am",
      title: "Phần 8 — Phát âm (8 dòng)",
      note: "Bấm “Nghe mẫu” một lần, rồi “Đọc & chấm”. Ghi điểm từng dòng — đạt khi ít nhất 6/8 dòng từ 70 điểm. Mỗi dòng nhắm một âm của chặng: trọng âm từ 3 âm tiết (N13) · /ɜː/ (N14) · âm yếu /ə/ (N15) · /ʌ/ – /ɑː/ – /æ/ (N16) · trọng âm câu (N17) · /juː/ (N18).",
      items: [
        { text: "family, government, decision, important", ipa: "fæməli ɡʌvənmənt dɪsɪʒn ɪmpɔːtnt", vi: "N13 · FA-mi-ly · GO-vern-ment · de-CI-sion · im-POR-tant" },
        { text: "My first journey abroad was a work trip.", ipa: "maɪ fɜːst dʒɜːni əbrɔːd wəz ə wɜːk trɪp", vi: "N14 · /ɜː/ trong first, journey, work — miệng mở vừa, không tròn môi" },
        { text: "I went to the festival with a group of friends.", ipa: "aɪ went tə ðə festɪvl wɪð ə ɡruːp əv frendz", vi: "N15 · to /tə/ · a /ə/ · of /əv/ đọc yếu, lướt nhanh" },
        { text: "We waited for an hour and then we danced.", ipa: "wi weɪtɪd fər ən aʊər ən ðen wi dɑːnst", vi: "N15 · for /fə/ · an /ən/ · and /ən/ — nối for_an, hour_and" },
        { text: "I paid cash for a bargain at the market.", ipa: "aɪ peɪd kæʃ fər ə bɑːɡɪn ət ðə mɑːkɪt", vi: "N16 · /æ/ cash · /ɑː/ bargain, market" },
        { text: "My money ran out, so I cut back on luxuries.", ipa: "maɪ mʌni ræn aʊt səʊ aɪ kʌt bæk ɒn lʌkʃəriz", vi: "N16 · /ʌ/ money, cut, luxuries · /æ/ ran, back" },
        { text: "I see your point, but I'm not sure it will work.", ipa: "aɪ siː jə pɔɪnt bət aɪm nɒt ʃʊə ɪt wɪl wɜːk", vi: "N17 · nhấn SEE · POINT · NOT · SURE · WORK; your /jə/, but /bət/ đọc yếu" },
        { text: "The news about the new music festival went viral.", ipa: "ðə njuːz əbaʊt ðə njuː mjuːzɪk festɪvl went vaɪrəl", vi: "N18 · /juː/ trong news, new, music (giọng Anh); news kết thúc bằng /z/" },
      ],
    },

    /** ───────────── 9. Tổng kết ───────────── **/
    {
      t: "recap",
      title: "Xong bài kiểm tra — bước tiếp theo",
      items: [
        "**Đạt cả 8 phần** (mỗi phần ≥ 70 %) → sang **Ngày 19** (câu hỏi gián tiếp, Listening Part 4). Bạn đã đi được ba phần tư Tập 2 — chặng cuối (Ngày 19–24) kết thúc bằng **Đề 3** đủ 4 kỹ năng.",
        "Chưa đạt **Ngữ pháp** hoặc **Dịch** → **Ngày 13 · Ngữ pháp** mục 1–6 (dấu phẩy, loại 0, loại 1, unless, when / as soon as + hiện tại đơn); **Ngày 15 · Ngữ pháp** mục 2–6 (who / which / that, **lược bỏ đại từ tân ngữ** mục 3, whose mục 4, where mục 5, chia động từ & dấu phẩy mục 6); **Ngày 17 · Ngữ pháp** mục 2–7 (liên từ, trạng từ liên kết + dấu câu mục 4, **lạm dụng từ nối** mục 6, **this / these + danh từ** mục 7). Làm lại các bài dịch 💡 của đúng mục đó.",
        "Chưa đạt **Từ vựng** → mở lại bài từ vựng **Ngày 14** (mục 2–4: AWL nhóm 2a–2e, 20 từ du lịch, cụm từ), **Ngày 16** (mục 2–5: 20 từ, cụm động từ, **collocation 5 kiểu**, lỗi dịch từng chữ), **Ngày 18** (mục 2–4); dùng nút \"Che nghĩa / Che từ\" đến khi thuộc, rồi ôn bằng **Flashcards** bộ \"Từ của khoá — Tập 2\".",
        "Chưa đạt **Nghe** → câu 1–5 sai: **Ngày 15 · Nghe** mục 2–4 (đặc điểm & từ kiểu Úc, Part 1); câu 6–14 sai: **Ngày 13 · Nghe** mục 3–8 (MCQ, chọn TWO, flow-chart mục 5, ai nói ý nào, tín hiệu); câu 15–18 sai: **Ngày 15 · Nghe** mục 5 (Part 2 độc thoại); câu 19–23 sai: **Ngày 17 · Nghe** mục 2, 5–6 (ngôn ngữ họp, ba bẫy, bài 21–30). Chưa đạt **Đọc** → **Ngày 16 · Đọc** mục 3–4 (loại thông tin, chiến thuật), **Ngày 14 · Đọc** mục 2–4 (giới hạn từ, quy trình 6 bước, 5 bẫy), **Ngày 18 · Đọc** mục 2–3 (5 bước, ba loại đuôi nhiễu).",
        "Chưa đạt **Viết** → **Ngày 14 · Viết** mục 3–5 (giải pháp khớp vấn đề, ngôn ngữ nguyên nhân – giải pháp), **Ngày 16 · Viết** mục 2–5 (chọn số nổi bật, overview không số, gom nhóm), **Ngày 18 · Viết** mục 3–4 (bố cục, mở bài trả lời cả hai câu); sai bài 6d → **Ngày 14 · Viết** mục 1–2, 4 (kiểu đề, khung 4 đoạn, ngôn ngữ nguyên nhân – kết quả). Chưa đạt **Nói** → **Ngày 15 · Nói** mục 2–4 (ghi chú 1 phút, dàn 4 phần, thêm chi tiết bằng mệnh đề quan hệ), **Ngày 13 · Nói** mục 3–6 (khung 4 bước, nói về people, xin nhắc lại), **Ngày 17 · Nói** mục 1, 5 (trọng âm câu, nêu ý kiến trong họp). Chưa đạt **Phát âm** → Ngày 13 Nói mục 8 · Ngày 14 Từ vựng mục 6 · Ngày 15 Nói mục 7 · Ngày 16 Từ vựng mục 9 · Ngày 17 Nói mục 7 · Ngày 18 Từ vựng mục 7. Ôn xong thì **làm lại đúng phần đó** của bài kiểm tra này.",
      ],
    },
  ],
};

export const NGAY_18: Lesson[] = [T2D18_TU_VUNG, T2D18_DOC, T2D18_VIET, T2D18_BAI_TAP, T2D18_KIEM_TRA];
