/**
 * IELTS Tập 4 — Ngày 30 — NGÀY CUỐI TẬP (band 6.0 → 7.0; tự soạn 18/11/2026 — mọi câu ví dụ, bài mẫu, câu hỏi, kịch bản VIẾT MỚI)
 *   Bài 1 (vocab)     Ôn 30 chủ đề Part 1 + 20 chủ đề "lạ" + 40 từ / idiom tự nhiên band 7; cách ôn bộ đề quý (chỉ ghi ý + từ,
 *                     không viết bài; Part 3 tối đa 2 phút / câu)                                            [S07 VD7]
 *                     — nối Tập 3 Ngày 30 (30 idiom, 30 bộ thẻ) · Tập 4 Ngày 2 · 6 · 8 · 10 · 14 · 18 · 23 (idiom đã học)
 *   Bài 2 (writing)   Viết lại 3 bài theo sổ lỗi — mục tiêu ≤ 3 lỗi / bài; mã lỗi = 6 lượt soát của Ngày 21      [W19]
 *                     — nối Tập 3 Ngày 30 (2 bài, band 5 → 6) · Tập 4 Ngày 2 (viết lại bài Đề 6)
 *   Bài 3 (speaking)  Giám khảo AI 14 phút — luyện bằng Đề 7 chế độ luyện (`noi-de7&che=luyen`); kho 5 câu chuyện;
 *                     X05 (không học thuộc, xin nhắc lại câu hỏi); 🔊 ngữ điệu câu mua giờ          [S17 X05]
 *                     — nối Tập 2 Ngày 23 (giám khảo AI lần đầu) · Tập 3 Ngày 30 (lần 2) · Tập 4 Ngày 27 (tự thu)
 *   Bài tập Ngày 30   32 câu có đáp án + 1 câu ghi âm
 *   Kiểm tra chặng    Ngày 25–30 (8 phần, ≥ 70 % từng phần) — xong thì làm Đề 8 = thi cuối Tập 4 (ở Online Test)
 * Mọi id bắt đầu `t4d30-`.
 */
import type { Lesson } from '../data';

export const NGAY_30: Lesson[] = [
  /* ══════════════════════════════ BÀI 1 — TỪ VỰNG ══════════════════════════════ */
  {
    id: "t4d30-tu-vung",
    kind: "vocab",
    title: "Từ vựng: Ôn 30 chủ đề Part 1 + 20 chủ đề lạ + idiom tự nhiên — và cách ôn bộ đề quý",
    goal: "Trả lời được bất kỳ câu Part 1 nào trong 30 chủ đề quen và 20 chủ đề “lạ” bằng 2–3 câu có một chi tiết cụ thể và một từ ít gặp dùng đúng collocation (LR band 7), biết lúc nào một idiom làm câu tự nhiên hơn và lúc nào nó làm câu sáo, và tự ôn một bộ đề quý mới bằng cách chỉ ghi ý + từ, không viết bài.",
    minutes: 95,
    blocks: [
      {
        t: "recap",
        items: [
          "Bài này đẩy **LR band 7** ở Speaking: “dùng được ==từ ít gặp== và ==idiom==, biết văn phong và collocation”. Band 6 chỉ cần “đủ từ để bàn rộng”.",
          "Part 1 không chấm ý hay. Nó chấm ==câu trả lời có chi tiết thật== + ==một từ đắt== đặt đúng chỗ. 2–3 câu là đủ, không kể chuyện dài.",
          "30 chủ đề quen bạn đã có từ Tập 1–3. Hôm nay thêm **20 chủ đề lạ** (mirrors, robots, chocolate…) và **hai lối thoát** khi bí ý.",
          "Idiom: **tối đa một cái mỗi câu trả lời**, đúng nguyên dạng, không dùng câu sáo (raining cats and dogs). Viết Task 2 thì **không** dùng.",
          "Ôn bộ đề quý: ==chỉ ghi ý + từ==, nói thành tiếng, **không viết bài để học thuộc** — giám khảo nhận ra ngay và FC tụt.",
        ],
      },

      { t: "h", text: "1. Part 1 band 7 khác band 6 ở đâu — bốn luật" },
      {
        t: "table",
        caption: "Cùng một câu hỏi: “Do you like rainy days?”",
        head: ["", "Câu trả lời", "Vì sao"],
        rows: [
          ["**Band 6**", "Yes, I like rainy days because the weather is cool and I can relax at home. Rainy days are very nice.", "Đúng, trôi chảy — nhưng từ chung chung (nice, relax), câu cuối lặp ý, không có chi tiết riêng."],
          ["**Band 7**", "Honestly, it depends on the kind of rain. A light **drizzle** in the evening I quite enjoy — it's a good excuse to **unwind** with a book. But in Ho Chi Minh City we get **torrential** downpours in the rainy season, and getting home on a motorbike through flooded streets is **not my cup of tea** at all.", "Có mức độ (it depends), **chi tiết thật** (xe máy, đường ngập), ba từ ít gặp đúng collocation, **một** idiom, tương phản rõ."],
        ],
      },
      {
        t: "note",
        title: "📌 Bốn luật của câu trả lời Part 1 band 7",
        items: [
          "**Luật 1 — trả lời thẳng rồi mở một tầng.** Câu 1 trả lời câu hỏi; câu 2 cho lý do hoặc ví dụ cụ thể; câu 3 (nếu có) cho tương phản hay thói quen. Dừng ở đó.",
          "**Luật 2 — một chi tiết chỉ bạn mới có.** Tên quán, giờ giấc, món đồ, người thật. Chi tiết làm câu nghe như **nói**, không như **đọc thuộc**.",
          "**Luật 3 — một từ đắt, đúng collocation.** torrential **rain** (không torrential sun), a **vivid** dream, **illegible** handwriting. Từ ít gặp dùng sai collocation còn tệ hơn từ thường.",
          "**Luật 4 — idiom là gia vị.** 0–1 cái mỗi câu. Sai một chữ trong idiom (~~not my tea cup~~) bị tính là **lỗi từ vựng**.",
        ],
      },
      { t: "rule", formula: "Trả lời thẳng + 1 chi tiết thật + 1 từ ít gặp đúng collocation (+ tối đa 1 idiom)", vi: "Khuôn Part 1 band 7 — 2 đến 3 câu, khoảng 20–30 giây." },

      { t: "h", text: "2. Ôn 30 chủ đề quen — mỗi chủ đề một cụm “đắt” dùng được ngay" },
      { t: "p", text: "Ba mươi chủ đề dưới đây bạn đã gặp ở Tập 1 – 3 (bộ thẻ chủ đề Tập 3 Ngày 30). Lần này **không ôn lại từ cơ bản** — mỗi chủ đề chỉ thêm **một cụm band 7**. Đọc to từng cụm trong một câu của chính bạn." },
      {
        t: "table",
        caption: "30 chủ đề Part 1 — 6 nhóm × 5 chủ đề",
        head: ["Nhóm", "Chủ đề → một cụm band 7"],
        rows: [
          ["**Bản thân**", "work / study → **juggle** work and study · hometown → it **has changed beyond recognition** · home → a **cramped** but cosy flat · family → we're a **close-knit** family · friends → we **go back a long way**"],
          ["**Một ngày**", "daily routine → I'm a **creature of habit** · sleep → I'm a **night owl** · time management → **keep on top of** deadlines · weekends → a **lie-in** on Sundays · noise → the **constant hum** of traffic"],
          ["**Sở thích**", "hobbies → it **takes my mind off** work · sport → I **play casually**, not competitively · music → it **grows on** me · films → a **gripping** plot · books → I **can't put it down**"],
          ["**Ăn · mặc · mua**", "food → I have **a sweet tooth** · shopping → an **impulse buy** · clothes → comfort **over** style · colours → **muted** colours · celebrations → Tết is **in full swing**"],
          ["**Đi lại · thời tiết**", "travel → **off the beaten track** · transport → **stuck in gridlock** · weather → **muggy** afternoons · plants / animals → I don't have **green fingers** · photography → I take **candid** shots"],
          ["**Công nghệ · xã hội**", "technology → it's **second nature** now · social media → **mindless scrolling** · art → I **can't make head nor tail of** abstract art · numbers → I have **a head for figures** · neighbours → we're **on nodding terms**"],
        ],
      },

      { t: "h", text: "3. Hai mươi chủ đề “lạ” — và hai lối thoát khi bí ý" },
      { t: "p", text: "Bộ đề Part 1 hay chen những chủ đề tưởng như vô nghĩa (gương, đồng hồ, kẹo sô-cô-la…). Giám khảo **không** muốn kiến thức về gương — họ muốn nghe bạn nói **tự nhiên về một thứ nhỏ**. Bí thì dùng một trong hai lối thoát (ôn từ Tập 2 Ngày 9 · 12)." },
      {
        t: "sodo",
        kind: "compare",
        title: "Hai lối thoát khi gặp chủ đề lạ / không hứng thú",
        cols: [
          { title: "**Lối 1 — nói rộng sang chủ đề liền kề**", items: ["Birds → “I don't know much about birds, but I do notice them in the early morning because…”", "Gắn vào thứ bạn có thật: nhà, đường đi học, tuổi thơ", "Giữ câu trả lời **đúng câu hỏi** — chỉ mượn góc nhìn"] },
          { title: "**Lối 2 — lịch sự nói thật rồi chuyển**", items: ["“To be honest, it's not something I've given much thought to, but if I had to choose…”", "Không bao giờ chỉ nói “I don't know” rồi im", "Sau câu thú nhận phải có **ít nhất một câu nội dung**"] },
          { title: "**Thêm: thứ đặc thù Việt Nam**", items: ["Giữ tên Việt + mệnh đề giải thích", "“bánh chưng, which is a square rice cake we make for Tết”", "Không dịch gượng tên món / lễ ra tiếng Anh"] },
        ],
      },
      {
        t: "table",
        caption: "20 chủ đề lạ — câu hỏi hay gặp và hướng trả lời band 7 (tự soạn)",
        head: ["Chủ đề", "Câu hỏi hay gặp", "Hướng trả lời + cụm"],
        rows: [
          ["Mirrors", "Do you often look in the mirror?", "chỉ trước khi ra khỏi nhà · không vì **vanity** mà để kiểm tra mình trông **presentable**"],
          ["Robots", "Would you like a robot to help at home?", "robot hút bụi đã có · **take the drudgery out of** housework · nhưng không giao việc nấu ăn"],
          ["Chocolate", "Did you eat much chocolate as a child?", "chỉ dịp lễ, là **a treat** · giờ **indulge in** dark chocolate khi ôn thi"],
          ["Watches", "Do you wear a watch?", "đồng hồ thông minh để đếm bước · hồi trước bố tặng một chiếc — giờ là **a keepsake**"],
          ["Bags", "What do you usually carry in your bag?", "laptop, sạc, bình nước · hay phải **rummage through** cả túi để tìm tai nghe"],
          ["Shoes", "Do you prefer comfortable or fashionable shoes?", "comfort **over** style · đôi giày chạy đã **worn out** nhưng không nỡ bỏ"],
          ["Flowers", "Do people in your country give flowers as gifts?", "20/10 và 8/3 · hoa mai dịp Tết · **fragrant** hoa sữa mùa thu ở Hà Nội"],
          ["Birds", "Are there many birds where you live?", "lối 1: sáng sớm nghe chim **chirping** trên cây trước nhà · thành phố ồn nên hiếm"],
          ["Rain", "Do you like rainy days?", "it depends · **drizzle** thì thích · mưa **torrential** + đường ngập thì **not my cup of tea**"],
          ["Sunshine", "Do you spend much time in the sun?", "nắng **scorching** giữa trưa thì tránh · nắng sớm **lifts my spirits**"],
          ["Handwriting", "Is your handwriting easy to read?", "ghi chép nhanh thành **a scrawl**, có khi **illegible** cả với chính mình · gõ máy nhiều hơn viết tay"],
          ["Patience", "Are you a patient person?", "với code thì kiên nhẫn · khi kẹt xe thì **have a short fuse**"],
          ["Visitors", "Do you often have visitors at home?", "dịp Tết họ hàng đến chơi · người Việt rất **hospitable** · từng **put up** một người bạn một tuần"],
          ["Swimming", "Can you swim well?", "bơi được kiểu ếch nhưng ở biển sâu thì **out of my depth** (nghĩa đen!)"],
          ["Dreams", "Do you often remember your dreams?", "hiếm khi · có một giấc mơ **recurring** về việc trễ giờ thi · mơ rất **vivid** trước hạn nộp bài"],
          ["History", "Did you like history at school?", "không — học thuộc năm tháng · sau này xem phim tài liệu mới thấy nó **brought to life**"],
          ["Fruit", "What fruit do you eat most?", "xoài, khi đang **in season** · chọn quả **ripe** bằng cách ngửi"],
          ["Toys", "What toys did you play with as a child?", "đồ chơi **hand-me-down** của anh họ · một bộ lắp ráp chơi suốt mấy năm"],
          ["Housework", "Which household chore do you dislike most?", "phơi đồ là **tedious** · cố **keep on top of** việc nhà để phòng không **cluttered**"],
          ["Dancing", "Do you like dancing?", "lối 2: thú thật **I have two left feet** · nhưng thích xem người khác nhảy ở đám cưới"],
        ],
      },
      {
        t: "note",
        title: "⚠️ Cẩn thận: ba lỗi hay gặp với chủ đề lạ",
        items: [
          "~~I don't know.~~ rồi im lặng — FC tụt ngay. Luôn có **ít nhất một câu nội dung** sau câu thú nhận.",
          "Kéo về chủ đề đã học thuộc (hỏi Mirrors mà nói sang “my hometown”) — giám khảo nhận ra câu trả lời **lạc đề** và **học thuộc**.",
          "Dịch từng chữ thứ đặc thù: ~~chung cake~~ → **bánh chưng, a square rice cake we make for Tết**.",
        ],
      },

      { t: "h", text: "4. 40 từ và idiom ít gặp cho Part 1 (mỗi chủ đề lạ ít nhất một từ)" },
      {
        t: "vocab",
        items: [
          { w: "unwind", pos: "v", ipa: "/ʌnˈwaɪnd/", vi: "thư giãn (sau căng thẳng)", ex: "After a long coding session, I unwind by cooking.", exVi: "Sau một buổi code dài, tôi thư giãn bằng cách nấu ăn.", more: "unwind **after / with** sth · gần relax nhưng nhấn “xả căng thẳng” · quá khứ: unwound /ʌnˈwaʊnd/" },
          { w: "a night owl", pos: "n phr", ipa: "/ə ˈnaɪt aʊl/", vi: "cú đêm, người hay thức khuya", ex: "I'm a night owl, so I do my best work after ten.", exVi: "Tôi là cú đêm nên làm việc tốt nhất sau mười giờ tối.", more: "trái nghĩa: **an early bird** · dùng với be, không “a night owl person”" },
          { w: "cluttered", pos: "adj", ipa: "/ˈklʌtəd/", vi: "bừa bộn, chất đầy đồ", ex: "My desk gets cluttered with cables and old notes.", exVi: "Bàn tôi hay bừa bộn dây cáp và giấy ghi chú cũ.", more: "a cluttered **room / desk** · get cluttered **with** · danh từ: clutter (không đếm được)" },
          { w: "keep on top of", pos: "phr v", ipa: "/kiːp ɒn ˈtɒp əv/", vi: "theo kịp, không để dồn việc", ex: "I try to keep on top of the washing so it doesn't pile up.", exVi: "Tôi cố giặt giũ kịp để quần áo không dồn đống.", more: "keep on top of **work / emails / deadlines** · trái: fall behind with" },
          { w: "tedious", pos: "adj", ipa: "/ˈtiːdiəs/", vi: "tẻ nhạt, chán (vì lặp lại)", ex: "Ironing is the most tedious chore for me.", exVi: "Là quần áo là việc nhà chán nhất với tôi.", more: "a tedious **task / process** · mạnh và trang trọng hơn boring" },
          { w: "spotless", pos: "adj", ipa: "/ˈspɒtləs/", vi: "sạch bong", ex: "My mother keeps the kitchen spotless.", exVi: "Mẹ tôi giữ bếp sạch bong.", more: "**keep sth** spotless · spotlessly clean" },
          { w: "muggy", pos: "adj", ipa: "/ˈmʌɡi/", vi: "oi bức, nóng ẩm", ex: "Saigon afternoons are muggy before the rain arrives.", exVi: "Chiều Sài Gòn oi bức trước khi mưa tới.", more: "muggy **weather / afternoon** · gần humid, nhưng muggy là văn nói" },
          { w: "drizzle", pos: "n / v", ipa: "/ˈdrɪzl/", vi: "mưa phùn; mưa lất phất", ex: "Hanoi gets a cold drizzle in February.", exVi: "Hà Nội có mưa phùn lạnh vào tháng Hai.", more: "a light drizzle · It's drizzling. · khác shower (mưa rào ngắn)" },
          { w: "torrential", pos: "adj", ipa: "/təˈrenʃl/", vi: "như trút nước", ex: "Torrential rain flooded the street outside my dorm.", exVi: "Mưa như trút làm ngập con đường trước ký túc xá.", more: "chỉ đi với **rain / downpour** · ~~torrential wind~~" },
          { w: "scorching", pos: "adj", ipa: "/ˈskɔːtʃɪŋ/", vi: "nóng như thiêu", ex: "I avoid going out in the scorching midday sun.", exVi: "Tôi tránh ra ngoài lúc nắng trưa nóng như thiêu.", more: "a scorching **day / summer** · scorching hot · mạnh hơn very hot" },
          { w: "lift someone's spirits", pos: "idiom", ipa: "/lɪft ˈsʌmwʌnz ˈspɪrɪts/", vi: "làm ai vui lên", ex: "A sunny morning always lifts my spirits.", exVi: "Một buổi sáng nắng luôn làm tôi vui lên.", more: "lift **my / your** spirits · luôn **spirits** số nhiều" },
          { w: "keepsake", pos: "n", ipa: "/ˈkiːpseɪk/", vi: "vật kỷ niệm", ex: "My grandfather's old watch is a keepsake now.", exVi: "Chiếc đồng hồ cũ của ông giờ là vật kỷ niệm.", more: "**keep sth as** a keepsake · gần souvenir nhưng souvenir là quà du lịch" },
          { w: "hand-me-down", pos: "n / adj", ipa: "/ˈhænd miː daʊn/", vi: "đồ người khác dùng rồi để lại", ex: "Most of my toys were hand-me-downs from my cousin.", exVi: "Hầu hết đồ chơi của tôi là đồ anh họ để lại.", more: "hand-me-down **clothes / toys** · động từ: hand sth down **to** sb" },
          { w: "worn out", pos: "adj", ipa: "/ˌwɔːn ˈaʊt/", vi: "sờn, mòn (đồ); kiệt sức (người)", ex: "My running shoes are worn out, but I can't throw them away.", exVi: "Giày chạy của tôi đã mòn, nhưng tôi không nỡ vứt.", more: "đứng trước danh từ có gạch nối: **worn-out** shoes · I'm worn out = kiệt sức" },
          { w: "rummage through", pos: "phr v", ipa: "/ˈrʌmɪdʒ θruː/", vi: "lục lọi", ex: "I always have to rummage through my bag for my earphones.", exVi: "Lúc nào tôi cũng phải lục cả túi tìm tai nghe.", more: "rummage through **a bag / drawer** · rummage **for** sth" },
          { w: "fit like a glove", pos: "idiom", ipa: "/fɪt laɪk ə ɡlʌv/", vi: "vừa như in", ex: "The jacket fitted like a glove, so I bought it on the spot.", exVi: "Cái áo khoác vừa như in nên tôi mua ngay.", more: "Anh-Anh: quá khứ **fitted** · chỉ nói về quần áo / giày / vị trí công việc" },
          { w: "vanity", pos: "n", ipa: "/ˈvænəti/", vi: "tính hay làm dáng, phù phiếm", ex: "I check the mirror out of habit, not vanity.", exVi: "Tôi soi gương vì thói quen, không phải vì làm dáng.", more: "**out of** vanity · tính từ: vain · không đếm được" },
          { w: "presentable", pos: "adj", ipa: "/prɪˈzentəbl/", vi: "trông tươm tất", ex: "I just want to look presentable before a video call.", exVi: "Tôi chỉ muốn trông tươm tất trước cuộc gọi video.", more: "look / make yourself presentable" },
          { w: "punctual", pos: "adj", ipa: "/ˈpʌŋktʃuəl/", vi: "đúng giờ", ex: "Wearing a watch helps me stay punctual.", exVi: "Đeo đồng hồ giúp tôi giữ đúng giờ.", more: "be punctual **for** sth · danh từ: punctuality · trang trọng hơn on time" },
          { w: "a sweet tooth", pos: "idiom", ipa: "/ə swiːt tuːθ/", vi: "người hảo ngọt", ex: "I have a sweet tooth, so chocolate is my weakness.", exVi: "Tôi hảo ngọt nên sô-cô-la là điểm yếu của tôi.", more: "luôn **have a sweet tooth** · ~~I am sweet tooth~~" },
          { w: "indulge in", pos: "v", ipa: "/ɪnˈdʌldʒ ɪn/", vi: "tự thưởng, chiều theo ý thích", ex: "During exams I indulge in a bar of dark chocolate every night.", exVi: "Mùa thi tôi tự thưởng một thanh sô-cô-la đen mỗi tối.", more: "indulge **in** sth · indulge yourself · tính từ: indulgent" },
          { w: "in season", pos: "phr", ipa: "/ɪn ˈsiːzn/", vi: "đang mùa (trái cây)", ex: "Mangoes are cheapest when they're in season.", exVi: "Xoài rẻ nhất khi đang mùa.", more: "trái: **out of season** · seasonal fruit" },
          { w: "ripe", pos: "adj", ipa: "/raɪp/", vi: "chín", ex: "My grandmother can tell a ripe durian by its smell.", exVi: "Bà tôi ngửi là biết quả sầu riêng đã chín.", more: "trái: **unripe** · overripe = chín nẫu · động từ: ripen" },
          { w: "fragrant", pos: "adj", ipa: "/ˈfreɪɡrənt/", vi: "thơm (hoa, thảo mộc)", ex: "In autumn, Hanoi's streets are fragrant with milk flowers.", exVi: "Mùa thu, phố Hà Nội thơm mùi hoa sữa.", more: "be fragrant **with** · danh từ: fragrance · trang trọng hơn smell nice" },
          { w: "wilt", pos: "v", ipa: "/wɪlt/", vi: "héo rũ", ex: "Cut flowers wilt within days in this heat.", exVi: "Hoa cắt cành héo rũ sau vài ngày trong cái nóng này.", more: "nghĩa bóng: I wilt in the heat = mệt rũ vì nóng" },
          { w: "green fingers", pos: "idiom", ipa: "/ɡriːn ˈfɪŋɡəz/", vi: "khéo trồng cây", ex: "I don't have green fingers — even my cactus died.", exVi: "Tôi không có tay trồng cây — đến cây xương rồng cũng chết.", more: "Anh-Anh: **have green fingers**; Anh-Mỹ: have a green thumb" },
          { w: "chirp", pos: "v", ipa: "/tʃɜːp/", vi: "(chim) ríu rít", ex: "I wake up to birds chirping outside my window.", exVi: "Tôi thức dậy nghe chim ríu rít ngoài cửa sổ.", more: "birds chirp / sing · tweet là tiếng chim nhỏ" },
          { w: "have two left feet", pos: "idiom", ipa: "/hæv tuː left fiːt/", vi: "nhảy rất vụng", ex: "I'd love to dance, but I have two left feet.", exVi: "Tôi rất muốn nhảy, nhưng tôi vụng lắm.", more: "nguyên dạng: **two left feet** — ~~two left legs~~" },
          { w: "out of my depth", pos: "idiom", ipa: "/aʊt əv maɪ depθ/", vi: "quá sức mình (cả nghĩa đen: chỗ nước sâu)", ex: "I can swim, but in deep sea water I'm out of my depth.", exVi: "Tôi biết bơi, nhưng ở biển sâu thì quá sức tôi.", more: "nghĩa bóng: I felt out of my depth in the advanced class" },
          { w: "illegible", pos: "adj", ipa: "/ɪˈledʒəbl/", vi: "không đọc được (chữ)", ex: "My lecture notes are often illegible, even to me.", exVi: "Vở ghi bài giảng của tôi thường không đọc nổi, kể cả với tôi.", more: "trái: **legible** · illegible **handwriting / signature** · khác unreadable (khó đọc vì nội dung)" },
          { w: "scrawl", pos: "n / v", ipa: "/skrɔːl/", vi: "chữ nguệch ngoạc; viết vội", ex: "When I take notes quickly, my writing turns into a scrawl.", exVi: "Khi ghi chép nhanh, chữ tôi thành nguệch ngoạc.", more: "scrawl **a note / a message** · gần scribble" },
          { w: "vivid", pos: "adj", ipa: "/ˈvɪvɪd/", vi: "rõ nét, sống động", ex: "I have vivid dreams the night before a deadline.", exVi: "Tôi mơ rất rõ vào đêm trước hạn nộp bài.", more: "a vivid **dream / memory / description** · vividly remember" },
          { w: "recurring", pos: "adj", ipa: "/rɪˈkɜːrɪŋ/", vi: "lặp đi lặp lại", ex: "I have a recurring dream about missing an exam.", exVi: "Tôi có một giấc mơ lặp lại về việc lỡ một kỳ thi.", more: "a recurring **dream / problem / theme** · động từ: recur" },
          { w: "bring sth to life", pos: "idiom", ipa: "/brɪŋ tə laɪf/", vi: "làm cho sống động", ex: "A good documentary brings history to life.", exVi: "Một phim tài liệu hay làm lịch sử sống động.", more: "bị động: history **was brought to life** · come to life = trở nên sôi động" },
          { w: "drudgery", pos: "n", ipa: "/ˈdrʌdʒəri/", vi: "việc nặng nhọc, nhàm chán", ex: "A robot vacuum takes some of the drudgery out of housework.", exVi: "Robot hút bụi bớt phần nhọc nhằn của việc nhà.", more: "**take the drudgery out of** sth · không đếm được" },
          { w: "hospitable", pos: "adj", ipa: "/hɒˈspɪtəbl/", vi: "hiếu khách", ex: "Vietnamese families are very hospitable to visitors at Tết.", exVi: "Gia đình Việt rất hiếu khách với khách dịp Tết.", more: "hospitable **to / towards** · danh từ: hospitality" },
          { w: "put sb up", pos: "phr v", ipa: "/pʊt ʌp/", vi: "cho ai ở nhờ", ex: "We put a friend up for a week while she found a flat.", exVi: "Chúng tôi cho một người bạn ở nhờ một tuần trong lúc cô ấy tìm nhà.", more: "khác **put up with** (chịu đựng) · tách được: put **her** up" },
          { w: "have a short fuse", pos: "idiom", ipa: "/hæv ə ʃɔːt fjuːz/", vi: "dễ nổi nóng", ex: "I'm patient with bugs, but I have a short fuse in traffic jams.", exVi: "Tôi kiên nhẫn với lỗi code, nhưng dễ nổi nóng khi kẹt xe.", more: "gần **short-tempered** (Tập 4 Ngày 8) · trái: have the patience of a saint" },
          { w: "be at a loose end", pos: "idiom", ipa: "/ət ə luːs end/", vi: "rảnh, không biết làm gì", ex: "When I'm at a loose end on Sundays, I visit my grandparents.", exVi: "Chủ nhật rảnh rỗi, tôi về thăm ông bà.", more: "Anh-Anh: at a **loose end** · ~~at loose ends~~ là Anh-Mỹ" },
          { w: "not my cup of tea", pos: "idiom", ipa: "/nɒt maɪ kʌp əv tiː/", vi: "không phải gu của tôi", ex: "Horror films are not my cup of tea.", exVi: "Phim kinh dị không phải gu của tôi.", more: "dùng ở dạng **phủ định**; ~~my cup of coffee~~" },
          { w: "can't get enough of", pos: "phr", ipa: "/kɑːnt ɡet ɪˈnʌf əv/", vi: "mê, không thấy chán", ex: "I can't get enough of street-side bánh mì.", exVi: "Tôi mê bánh mì vỉa hè, ăn mãi không chán.", more: "+ danh từ / V-ing · mạnh hơn I like… very much" },
        ],
      },

      { t: "h", text: "5. Ôn idiom của Tập 4 — dùng ở Part nào, và không bao giờ dùng ở đâu" },
      {
        t: "table",
        caption: "Idiom đã học ở Tập 4, xếp theo chỗ dùng (nối Ngày 6 · 8 · 10 · 14 · 18 · 23)",
        head: ["Chỗ dùng", "Idiom (ngày học)", "Câu thử"],
        rows: [
          ["**Part 1 — chuyện của mình**", "a creature of habit · set in your ways (N8) · second nature · in your element · take your mind off (N10) · grow on someone (N10)", "Cooking **takes my mind off** exams."],
          ["**Part 2 — kể chuyện**", "out of the blue (N18) · go off without a hitch · behind the scenes · pull together (N14) · go the extra mile (N6) · get on like a house on fire (N8)", "The trip **went off without a hitch**, which surprised everyone."],
          ["**Part 3 — bàn luận**", "a double-edged sword · the tip of the iceberg · sit on the fence (N18) · a grey area · a fine line between · a slippery slope · turn a blind eye to (N23)", "Facial recognition is **a double-edged sword**."],
          ["**Task 2 — KHÔNG dùng**", "Đổi sang cách trang trọng: a double-edged sword → **has both benefits and drawbacks** · the tip of the iceberg → **only a small part of a larger problem**", "Viết idiom vào Task 2 = lỗi register (Ngày 18, Ngày 21)."],
        ],
      },
      {
        t: "note",
        title: "⚠️ Cẩn thận: bốn cách dùng idiom làm tụt điểm",
        items: [
          "**Sai nguyên dạng:** ~~a piece of the cake~~ · ~~make the extra mile~~ · ~~on the fence~~ (thiếu sit). Một chữ sai là lỗi từ vựng.",
          "**Câu sáo:** ~~It's raining cats and dogs~~ · ~~as busy as a bee~~ — giám khảo nghe hàng nghìn lần, chấm như học thuộc.",
          "**Dồn nhiều:** ba idiom trong một câu trả lời nghe như diễn kịch. 0–1 mỗi câu, 4–6 cả bài thi là nhiều.",
          "**Sai sắc thái:** ~~My grandmother passed away out of the blue~~ (idiom vui dùng cho chuyện buồn). Chuyện nghiêm túc dùng từ thường: **suddenly, unexpectedly**.",
        ],
      },

      { t: "h", text: "6. Cách ôn một bộ đề quý mới — chỉ ghi ý + từ, không viết bài" },
      { t: "p", text: "Bộ đề Speaking đổi theo **quý** (khoảng 3 – 4 tháng một lần thay phần lớn chủ đề). Khi có danh sách đề mới, đừng viết câu trả lời ra rồi học thuộc: giám khảo được dạy để nhận ra câu trả lời thuộc lòng (nhịp đều, không ngập ngừng tự nhiên, từ quá “đẹp” so với phần còn lại) và **FC bị chấm thấp**. Ôn theo quy trình dưới đây." },
      {
        t: "sodo",
        kind: "flow",
        title: "Ôn bộ đề quý — 5 bước cho mỗi chủ đề",
        caption: "Mỗi chủ đề Part 1 mất khoảng 6 phút; cả bộ ~ 30 chủ đề ôn trong hai tuần, mỗi ngày 2–3 chủ đề.",
        steps: [
          { label: "**1. Ghi ý (2')**", sub: "Mỗi câu hỏi: 2–3 gạch đầu dòng tiếng Anh, KHÔNG câu hoàn chỉnh" },
          { label: "**2. Ghi từ (1')**", sub: "5 từ / cụm đắt cho cả chủ đề (bảng mục 2–4), kèm collocation" },
          { label: "**3. Nói + thu (2')**", sub: "Nói to từng câu, không nhìn ghi chú lần hai" },
          { label: "**4. Nghe lại (1')**", sub: "Ghi một lỗi hay một từ muốn thay vào sổ Speaking" },
          { label: "**5. Xoay vòng**", sub: "Ba ngày sau nói lại chủ đề đó mà không xem ghi chú" },
        ],
      },
      {
        t: "table",
        caption: "Part 2 và Part 3 trong bộ đề quý",
        head: ["Phần", "Ôn thế nào", "Không làm"],
        rows: [
          ["**Part 2**", "Ghép mỗi cue card vào một câu chuyện trong **kho 5 câu chuyện** (Bài 3 mục 2); ghi 5 từ khoá cho phần đặc thù của đề", "Viết bài nói 2 phút rồi học thuộc"],
          ["**Part 3**", "Mỗi câu hỏi tối đa **2 phút**: 30 giây nghĩ góc nhìn (cá nhân / xã hội, xưa / nay), 45–60 giây nói một lượt có thu âm, phần còn lại nghe lại và ghi **một** cấu trúc muốn thêm", "Soạn sẵn câu trả lời; tra thêm kiến thức chuyên môn"],
        ],
      },
      { t: "rule", formula: "Bộ đề quý: ghi Ý + TỪ → nói thành tiếng → nghe lại → nói lại sau 3 ngày", vi: "Thuộc ý và từ, không thuộc câu — câu phải sinh ra lúc nói." },

      { t: "h", text: "7. Luyện" },
      {
        t: "mcq",
        id: "t4d30-tv-chon",
        title: "7a. Chọn câu trả lời / từ hay nhất (10 câu)",
        items: [
          { q: "“Do you like dancing?” — câu nào tự nhiên và đúng idiom nhất?", options: ["To be honest, I have two left feet, but I love watching people dance at weddings.", "To be honest, I have two left legs, but I love watching people dance.", "Dancing is raining cats and dogs in my family.", "I don't know."], correct: 0, why: "Nguyên dạng **two left feet**; có câu nội dung sau lời thú nhận (lối 2). C là ghép idiom sáo vô nghĩa; D bỏ lửng." },
          { q: "Chọn collocation đúng: “We often get ___ rain in September.”", options: ["scorching", "torrential", "muggy", "vivid"], correct: 1, why: "**torrential** chỉ đi với rain / downpour. scorching đi với sun / day; muggy là trời oi; vivid đi với dream / memory." },
          { q: "“Is your handwriting easy to read?” — câu nào band 7?", options: ["My handwriting is very bad and very ugly.", "My handwriting is illegible writing.", "Not really. When I take notes in lectures it turns into a scrawl, and sometimes even I can't read it.", "Yes, it's easy to read handwriting."], correct: 2, why: "C trả lời thẳng (Not really), có chi tiết (ghi bài giảng), từ ít gặp đúng (a scrawl). B lặp writing và dùng sai cấu trúc; A, D chung chung." },
          { q: "Câu nào dùng idiom ĐÚNG sắc thái?", options: ["My best friend moved abroad out of the blue, which was the last straw for my happiness.", "My grandfather passed away out of the blue.", "The exam was a piece of the cake.", "My cousin called me out of the blue and invited me to her wedding."], correct: 3, why: "out of the blue = bất ngờ, hợp chuyện vui / trung tính (D). B: chuyện buồn ⇒ suddenly. C sai nguyên dạng (a piece **of cake**). A dồn hai idiom, dùng sai the last straw." },
          { q: "Bạn không có ý gì về chủ đề Birds. Lối thoát nào tốt nhất?", options: ["“Birds are animals that can fly.”", "“I'm not really into birds, but I do notice them early in the morning — there's a tree outside my flat and they're always chirping before my alarm goes off.”", "“Next question, please.”", "“Let me tell you about my hometown instead.”"], correct: 1, why: "Lối 1 + 2: thú nhận ngắn, rồi gắn vào trải nghiệm thật với một từ ít gặp (chirping). D lạc đề; A là định nghĩa sách giáo khoa." },
          { q: "Câu nào đúng văn phong Task 2?", options: ["Social media has both clear benefits and serious drawbacks for teenagers.", "Social media is a double-edged sword for teenagers.", "Social media is not teenagers' cup of tea.", "Social media is the tip of the iceberg, you know."], correct: 0, why: "Task 2 dùng diễn đạt trang trọng. B, C, D đều là idiom / văn nói ⇒ lỗi register (Ngày 18 · 21)." },
          { q: "“Do you often have visitors?” — chọn cụm đúng: “Last year we ___ a friend from Da Nang ___ for a week.”", options: ["put … up with", "took … up", "set … up", "put … up"], correct: 3, why: "**put sb up** = cho ở nhờ. put up with = chịu đựng; take up = bắt đầu (sở thích); set up = thành lập." },
          { q: "Chọn câu đúng ngữ pháp với idiom:", options: ["I'm a sweet tooth.", "I have sweet tooth.", "I have a sweet tooth.", "I have sweet teeth."], correct: 2, why: "Nguyên dạng: **have a sweet tooth** (số ít, có a)." },
          { q: "Khi ôn bộ đề quý cho Part 3, việc nào ĐÚNG?", options: ["Viết sẵn câu trả lời 150 từ cho mỗi câu và học thuộc.", "Tra thật nhiều số liệu chuyên ngành để dẫn.", "Bỏ qua Part 3 vì không đoán được câu hỏi.", "Mỗi câu tối đa 2 phút: nghĩ góc nhìn, nói một lượt có thu âm, nghe lại và ghi một cấu trúc muốn thêm."], correct: 3, why: "Ôn ý + nói thành tiếng, không học thuộc. Giám khảo không chấm kiến thức chuyên môn." },
          { q: "“Do you wear a watch?” — câu nào có chi tiết thật + từ ít gặp đúng?", options: ["Yes, I wear a watch because watches are useful for knowing the time.", "Not every day. I mostly check my phone, but I keep my father's old watch as a keepsake and wear it to important events.", "Watches is my favourite keepsake things.", "I am punctual watch person."], correct: 1, why: "B có mức độ (Not every day), chi tiết (đồng hồ của bố), **keep sth as a keepsake** đúng collocation. C, D sai ngữ pháp; A lặp từ, không chi tiết." },
        ],
      },
      {
        t: "quiz",
        id: "t4d30-tv-dien",
        title: "7b. Điền MỘT từ còn thiếu (10 câu)",
        kind: "fill",
        items: [
          { q: "1. I'm a night ___, so I rarely go to bed before one.", answers: ["owl"] },
          { q: "2. I don't have green ___ — even my cactus died.", answers: ["fingers"] },
          { q: "3. Ironing is so ___ that I put it off for weeks.", answers: ["tedious"] },
          { q: "4. A robot vacuum takes the ___ out of housework.", answers: ["drudgery"] },
          { q: "5. I can swim, but in the open sea I'm out of my ___.", answers: ["depth"] },
          { q: "6. I have a ___ dream about being late for an exam.", answers: ["recurring"] },
          { q: "7. Mangoes are cheapest when they're in ___.", answers: ["season"] },
          { q: "8. I'm patient at work, but I have a short ___ in traffic.", answers: ["fuse"] },
          { q: "9. When I'm at a loose ___ on Sundays, I visit my grandparents.", answers: ["end"] },
          { q: "10. A sunny morning always lifts my ___.", answers: ["spirits"] },
        ],
      },
      {
        t: "quiz",
        id: "t4d30-tv-dich",
        title: "7c. Dịch sang tiếng Anh — câu trả lời Part 1 (4 câu)",
        kind: "translate",
        grammar: "Trả lời thẳng + chi tiết + một từ / idiom của bài.",
        items: [
          { q: "Thật ra là tuỳ. Mưa phùn thì tôi thích, nhưng mưa như trút thì không phải gu của tôi.", answers: ["Actually, it depends. I like drizzle, but torrential rain is not my cup of tea.", "Actually, it depends. I quite like a light drizzle, but torrential rain is not my cup of tea.", "Well, it depends. I enjoy drizzle, but torrential rain isn't my cup of tea."], hint: "it depends · drizzle · torrential · not my cup of tea" },
          { q: "Tôi hảo ngọt, nên mùa thi tôi tự thưởng một thanh sô-cô-la mỗi tối.", answers: ["I have a sweet tooth, so during exams I indulge in a bar of chocolate every night.", "I have a sweet tooth, so in the exam season I indulge in a bar of chocolate every evening.", "I've got a sweet tooth, so during exams I indulge in a chocolate bar every night."], hint: "have a sweet tooth · indulge in" },
          { q: "Hầu hết đồ chơi của tôi là đồ anh họ để lại, nhưng tôi không bận tâm.", answers: ["Most of my toys were hand-me-downs from my cousin, but I didn't mind.", "Most of my toys were hand-me-downs from my cousin, but I didn't mind at all."], hint: "hand-me-downs (số nhiều) · thì quá khứ" },
          { q: "Người Việt rất hiếu khách; dịp Tết nhà tôi lúc nào cũng có khách.", answers: ["Vietnamese people are very hospitable; at Tết our house is always full of visitors.", "Vietnamese people are very hospitable; during Tết we always have visitors at home.", "Vietnamese people are really hospitable, and at Tết our home is always full of visitors."], hint: "hospitable · Tết (giữ tên Việt)" },
        ],
      },
      { t: "p", text: "**Nói thử (AI chấm).** Bốn câu dưới đây thuộc bốn chủ đề lạ. Mỗi câu 20–30 giây: trả lời thẳng, một chi tiết thật, một từ của bài." },
      {
        t: "speak",
        id: "t4d30-tv-noi",
        part: "1",
        questions: [
          "Do you often look in the mirror?",
          "Would you like to have a robot to help you at home?",
          "Do you remember your dreams?",
          "What kind of fruit do you eat most often?",
        ],
      },
    ],
  },

  /* ══════════════════════════════ BÀI 2 — VIẾT ══════════════════════════════ */
  {
    id: "t4d30-viet",
    kind: "writing",
    title: "Viết: Viết lại 3 bài theo sổ lỗi — mục tiêu ≤ 3 lỗi mỗi bài (band 6 → band 7)",
    goal: "Đếm sổ lỗi của cả Tập 4 theo 6 mã (V · N · C · P · L · T — đúng 6 lượt soát của Ngày 21) để biết hai mã nặng nhất của mình, rồi viết lại ba bài cũ (hai Task 2 khác dạng + một Task 1) theo quy trình sửa ý trước – sửa câu sau, cho tới khi mỗi bài còn ≤ 3 lỗi ngữ pháp / từ vựng — mức “phần lớn câu không lỗi” của GRA band 7.",
    minutes: 120,
    blocks: [
      {
        t: "recap",
        items: [
          "Bài này đẩy **GRA + LR band 7**: “==frequent error-free sentences==” — phần lớn câu không lỗi. Band 6 chỉ cần “lỗi có nhưng ít khi làm khó hiểu”.",
          "Mục tiêu đo được: ==≤ 3 lỗi mỗi bài==. Một bài Task 2 ~ 280 từ có khoảng 14–16 câu ⇒ ≤ 3 lỗi nghĩa là ít nhất **12 câu sạch**.",
          "Mã lỗi = **6 lượt soát** của Ngày 21: **V** động từ · **N** danh từ · **C** ranh giới câu · **P** song song / từ loại / collocation · **L** liên kết / register · **T** đề & chính tả.",
          "Viết lại **không** phải chép lại cho sạch: sửa **ý** trước (TR / CC), sửa **câu** sau (GRA / LR), rồi **đếm**. Đếm không giảm là chưa xong.",
          "Ba bài: **hai Task 2 khác dạng** + **một Task 1**. Lấy bài có nhiều lỗi nhất thuộc hai mã nặng nhất của bạn.",
        ],
      },

      { t: "h", text: "1. Ở band 7, “một lỗi” là gì — và đếm thế nào" },
      {
        t: "table",
        caption: "Sáu mã lỗi — mỗi mã là một lượt soát của Ngày 21",
        head: ["Mã", "Lỗi điển hình còn sót ở band 6.5", "Ôn ở"],
        rows: [
          ["**V** — động từ", "the number of… ~~are~~ · ~~has risen in 2010~~ · bị động thiếu be · thì nhảy không lý do", "Tập 4 Ngày 1 · 3 · 25"],
          ["**N** — danh từ", "~~an evidence~~ · ~~staffs~~ · ~~experiences~~ (kinh nghiệm) · thiếu the trước “N + of…” · ~~old people health~~", "Ngày 1 · 21"],
          ["**C** — ranh giới câu", "dấu phẩy nối hai câu đủ (comma splice) · câu lê thê · câu cụt bắt đầu bằng Because / Which", "Ngày 21 mục 5"],
          ["**P** — song song · từ loại · collocation", "~~feel boring~~ · ~~make a research~~ · ~~spend money for~~ · chủ ngữ treo sau phân từ", "Ngày 5 · 6 · 24"],
          ["**L** — liên kết · register", "Firstly… Moreover… Furthermore… mỗi câu · this không rõ chỉ gì · kids / a lot of / you · nhận định tuyệt đối không rào", "Ngày 12 · 13 · 15 · 18"],
          ["**T** — đề · chính tả", "thiếu một vế đề · lập trường đổi giữa bài · ví dụ chung chung · ~~goverment~~ · ~~enviroment~~", "Ngày 2 · 4 · 28"],
        ],
      },
      {
        t: "note",
        title: "📌 Luật đếm lỗi dùng trong bài này",
        items: [
          "**Đếm vào “≤ 3 lỗi”:** mọi chỗ người chấm gạch được bằng bút đỏ thuộc mã **V · N · C · P**, chính tả (T) và từ dùng sai register (L). Mỗi chỗ một lỗi, kể cả hai lỗi trong cùng một câu.",
          "**Ghi riêng, không đếm vào 3 lỗi nhưng PHẢI sửa:** lỗi ý — lập trường mờ, ví dụ chung chung, đoạn hai ý, từ nối dày đặc. Đây là chỗ TR / CC; bản viết lại không sửa được chúng thì dù 0 lỗi câu vẫn kẹt band 6.",
          "Tự đếm thường **thiếu 30–50 %** lỗi. Đếm xong thì nộp AI chấm (ô viết ở mục 6) và so số AI tìm được với số bạn tìm được.",
        ],
      },
      { t: "rule", formula: "Lỗi câu (V N C P + chính tả + register) ≤ 3 · lỗi ý (TR / CC) = 0", vi: "Hai số phải đạt cùng lúc mới gọi là bản band 7." },

      { t: "h", text: "2. Bước 0 — đếm sổ lỗi, chọn đúng 3 bài" },
      {
        t: "table",
        caption: "Đếm sổ lỗi Tập 4 (15 phút) — chép bảng vào sổ, điền số của bạn",
        head: ["Mã", "Số lỗi trong sổ (Ngày 2 → 28)", "Xếp hạng"],
        rows: [
          ["V", "…", "…"], ["N", "…", "…"], ["C", "…", "…"], ["P", "…", "…"], ["L", "…", "…"], ["T", "…", "…"],
        ],
      },
      {
        t: "note",
        title: "📌 Chọn ba bài theo ba luật",
        items: [
          "**Luật 1 — khác dạng.** Hai Task 2 phải khác dạng (vd Opinion Ngày 4 + Advantages / disadvantages Ngày 14 hoặc Problem / solution Ngày 22) và một Task 1 (line · bar · table · pie · mixed — chọn dạng bạn yếu nhất).",
          "**Luật 2 — nhiều lỗi của hai mã nặng nhất.** Viết lại bài sạch sẵn thì không học được gì.",
          "**Luật 3 — bài đã có phản hồi.** Ưu tiên bài AI hoặc thầy cô đã chấm, để so band trước – sau. Bài Writing của Đề 6 / Đề 7 (Online Test) là lựa chọn tốt.",
        ],
      },

      { t: "h", text: "3. Quy trình viết lại một bài — 45 phút" },
      {
        t: "sodo",
        kind: "flow",
        title: "Bốn phiên bản của một bài",
        caption: "Sửa ý TRƯỚC sửa câu: viết lại một câu rồi mới xoá cả đoạn chứa nó là phí 10 phút.",
        steps: [
          { label: "**Bản 1 — đọc + đánh mã (10')**", sub: "Đọc lại đề, đếm vế đề. Gạch dưới mọi lỗi, ghi mã V N C P L T bên lề" },
          { label: "**Bản 2 — sửa ý (10')**", sub: "Lập trường một câu · mỗi đoạn một ý · ví dụ cụ thể (tên, số, nơi chốn) · bỏ từ nối thừa" },
          { label: "**Bản 3 — sửa câu (15')**", sub: "Viết lại từng câu có mã; thêm 4–6 cấu trúc của bảng 20 điểm (Ngày 29), mỗi cái một ý" },
          { label: "**Bản 4 — soát 6 lượt + đếm (10')**", sub: "Mỗi lượt một mã. Còn > 3 lỗi ⇒ quay lại Bản 3 đúng mã đó" },
        ],
      },
      {
        t: "note",
        title: "⚠️ Cẩn thận: ba kiểu “viết lại” không lên band",
        items: [
          "**Chép lại cho sạch:** giữ y nguyên ý, chỉ sửa chính tả. GRA có thể lên nửa band, TR / CC đứng yên.",
          "**Nhồi cấu trúc:** thêm ba đảo ngữ, hai câu chẻ vào một bài. Câu dài hơn ⇒ lỗi mới (thường là mã C và V).",
          "**Viết thành bài khác:** đổi cả lập trường và ý. Không còn so được trước – sau, và bạn không biết mình đã sửa được gì.",
        ],
      },
      { t: "rule", formula: "Bản 1 đánh mã → Bản 2 sửa ý → Bản 3 sửa câu → Bản 4 soát 6 lượt + đếm", vi: "Mỗi bản giữ lại trong sổ — so Bản 1 với Bản 4 mới thấy mình tiến ở mã nào." },

      { t: "h", text: "4. Mẫu Task 2 — bài gốc band 6 và bản viết lại band 7" },
      { t: "p", text: "**Đề:** In many countries, more and more people are continuing to work after the official retirement age. Is this a positive or a negative development?" },
      {
        t: "passage",
        title: "Bản 1 — bài gốc (khoảng band 6) — 11 lỗi câu đã đánh số",
        paras: [
          { label: "1", text: "Nowadays, the number of elderly people who keep working after the retirement age are increasing [1] in many countries. In my opinion, this trend has both positive and negative sides, but I think it is mostly positive." },
          { label: "2", text: "Firstly, working longer is good for old people health [2]. When people retire, they often feel boring [3] and lonely because they do not have anything to do. Moreover, if they continue to work, they can keep active and meet colleagues every day. For example, my uncle is 68 and he still works as a engineer [4], he says that work keeps him young [5]." },
          { label: "3", text: "Secondly, the economy can benefit from older workers. They have a lot of experiences [6] and they can teach young staffs [7]. Furthermore, the government do not need [8] to pay so much pension, so they can spend more money for [9] education and healthcare." },
          { label: "4", text: "However, there are some disadvantages. Older people may take jobs of young people, which makes unemployment [10]. Also, some old people are forced to work because they are poor, it is not fair [11]." },
          { label: "5", text: "In conclusion, although there are some drawbacks, I believe that people working after retirement age is a positive development because it is good for their health and the economy." },
        ],
      },
      {
        t: "table",
        caption: "Bản 1 — 11 lỗi câu và cách sửa",
        head: ["#", "Gốc", "Mã", "Sửa"],
        rows: [
          ["1", "the number of… **are** increasing", "V", "the number of… **is** increasing (động từ chia theo the number)"],
          ["2", "good for **old people health**", "N", "good for **the health of older people** / older people's health"],
          ["3", "they often feel **boring**", "P", "feel **bored** (cảm xúc của người ⇒ -ed)"],
          ["4", "works as **a** engineer", "N", "**an** engineer"],
          ["5", "…an engineer**,** he says that…", "C", "comma splice ⇒ **; he says** hoặc **, and he says**"],
          ["6", "a lot of **experiences**", "N", "**experience** (kinh nghiệm = không đếm được)"],
          ["7", "young **staffs**", "N", "young **staff** / younger employees"],
          ["8", "the government **do** not need", "V", "the government **does** not need"],
          ["9", "spend more money **for** education", "P", "spend money **on** education"],
          ["10", "which **makes unemployment**", "P", "which **leads to higher unemployment** (collocation)"],
          ["11", "…they are poor**,** it is not fair", "C", "comma splice ⇒ **, which is unfair** / **. This is unfair.**"],
        ],
      },
      {
        t: "note",
        title: "Lỗi ý của Bản 1 (không nằm trong 11 lỗi câu, nhưng giữ bài ở band 6)",
        items: [
          "**TR — lập trường:** “both positive and negative sides, but I think it is mostly positive” ở mở bài rồi kết bài chỉ lặp lại; không nói **dưới điều kiện nào** thì tích cực.",
          "**TR — ý chưa chống đỡ:** đoạn 4 nêu “take jobs of young people” mà không đánh giá — người đọc không biết bạn chấp nhận hay bác ý này.",
          "**CC — từ nối dày:** Firstly · Moreover · For example · Secondly · Furthermore · However · Also · In conclusion — 8 từ nối đầu câu trong 13 câu (Ngày 15: ≤ 4 trong cả hai thân bài).",
          "**L — register:** old people (3 lần) ⇒ **older people / retirees**; “a lot of” ⇒ **considerable**.",
        ],
      },
      {
        t: "passage",
        title: "Bản 4 — viết lại (khoảng band 7 – 7.5) — 0 lỗi câu",
        paras: [
          { label: "1", text: "In a growing number of countries, people are choosing, or being required, to stay in work beyond the official retirement age. While this trend raises legitimate concerns about fairness, I believe that, on balance, it is a positive development for both individuals and society." },
          { label: "2", text: "The most immediate benefit is to the health of older people themselves. Retirement can remove at a stroke the routine, purpose and social contact that a job provides, and many retirees report feeling bored and isolated within months. Remaining in work, even part-time, tends to keep people physically and mentally active. My uncle, a 68-year-old civil engineer, is a case in point: he now works three days a week and insists that solving problems with younger colleagues is what keeps him sharp." },
          { label: "3", text: "Society also gains. Experienced employees carry knowledge that is rarely written down, and when they mentor new staff, this expertise is passed on rather than lost. At the same time, every extra year of work is a year in which someone pays tax instead of drawing a pension, which eases the pressure on public finances in ageing societies such as Japan or South Korea." },
          { label: "4", text: "Admittedly, the picture is less positive when people work late in life not by choice but because their pensions are too small to live on. This, however, is an argument for better pensions rather than against older workers. Nor is there convincing evidence that older employees simply take jobs from the young, since the two groups often fill quite different roles." },
          { label: "5", text: "In conclusion, provided that staying in work remains a genuine choice, the trend towards later retirement benefits older people's well-being and strengthens the economy, so it should be welcomed." },
        ],
      },
      {
        t: "table",
        caption: "Bản 1 và Bản 4 — khác nhau theo 4 tiêu chí",
        head: ["Tiêu chí", "Bản 1 (band 6)", "Bản 4 (band 7)"],
        rows: [
          ["**TR**", "Lập trường “mostly positive” không điều kiện; ý phản đối nêu rồi bỏ đó", "Lập trường có điều kiện ngay mở bài (on balance) và chốt lại bằng **provided that…**; ý phản đối được **nêu rồi bác** (Admittedly… This, however, is an argument for…)"],
          ["**CC**", "8 từ nối đầu câu; this / they chỉ lẫn lộn", "Chỉ 3 trạng từ nối đầu câu trong thân bài (At the same time · Admittedly · Nor); **this expertise**, **This** (= việc phải làm vì lương hưu thấp) chỉ rõ; mỗi đoạn một ý với câu chủ đề ngắn (Society also gains.)"],
          ["**LR**", "old people ×3 · a lot of · makes unemployment", "retirees · at a stroke · a case in point · draw a pension · ease the pressure on · fill different roles — collocation chính xác, không idiom văn nói"],
          ["**GRA**", "11 lỗi trong 13 câu ⇒ chỉ 5 câu sạch", "0 lỗi; cấu trúc của bảng 20: bị động tiếp diễn (being required), rào (tends to), câu chẻ (what keeps him sharp), đảo ngữ (Nor is there), điều kiện (provided that)"],
        ],
      },

      { t: "h", text: "5. Mẫu Task 1 — một đoạn thân bài viết lại" },
      { t: "p", text: "**Đề:** The bar chart shows the percentage of commuters who cycled to work in four cities in 2015 and 2023. (Số liệu tự đặt.)" },
      {
        t: "chart",
        kind: "bar",
        title: "Commuters cycling to work (%)",
        unit: "%",
        labels: ["Arden", "Belmont", "Corvale", "Dunmore"],
        series: [
          { name: "2015", values: [12, 25, 8, 31] },
          { name: "2023", values: [19, 24, 15, 44] },
        ],
      },
      {
        t: "table",
        caption: "Đoạn thân bài — trước và sau",
        head: ["Bản 1 (6 lỗi, đánh số)", "Bản 4 (0 lỗi)"],
        rows: [
          [
            "Dunmore was the highest, it rose from 31% to 44% [1][2]. Corvale increased nearly double [3], from 8% to 15%. The number of commuters cycling in Arden was 19% in 2023 [4], an increase of 7 percents [5]. Belmont was stable [6] at about 25%.",
            "Dunmore had the highest proportion of cycling commuters in both years, and its figure climbed from 31% to 44%. Corvale saw the most dramatic relative change, with its share almost doubling from 8% to 15%, while Arden's rose by 7 percentage points to 19%. Belmont was the only exception to the upward trend, its figure remaining virtually unchanged at around a quarter.",
          ],
        ],
      },
      {
        t: "note",
        title: "Sáu lỗi của Bản 1",
        items: [
          "**[1] N/L** — Dunmore (thành phố) không “highest”; **Dunmore's figure / the proportion in Dunmore** mới cao nhất.",
          "**[2] C** — comma splice ⇒ dùng **and** hoặc mệnh đề phân từ.",
          "**[3] P** — ~~increased nearly double~~ ⇒ **almost doubled** / with its share almost doubling.",
          "**[4] N** — ~~The number~~ … was 19% ⇒ **The proportion / percentage** (số liệu là phần trăm).",
          "**[5] N** — ~~7 percents~~ ⇒ **7 percentage points** (12% → 19% là tăng 7 điểm phần trăm, không phải 7 %).",
          "**[6] N/L** — Belmont ⇒ **Belmont's figure**. Thêm: Bản 4 gọi Belmont là **ngoại lệ** — nhóm số liệu, đúng kiểu Task 1 band 7 (Ngày 12).",
        ],
      },
      { t: "rule", formula: "Chủ ngữ Task 1 = con số (the figure / the proportion / X's share), không phải tên nơi chốn", vi: "Lỗi N/L hay gặp nhất của bài Task 1 band 6.5 — soát riêng một lượt cho nó." },

      { t: "h", text: "6. Luyện trước khi viết lại bài của bạn" },
      {
        t: "mcq",
        id: "t4d30-viet-ma",
        title: "6a. Lỗi in đậm thuộc mã nào? (8 câu)",
        items: [
          { q: "“Many governments **has introduced** sugar taxes.”", options: ["N", "C", "V", "T"], correct: 2, why: "S–V hoà hợp: governments (số nhiều) ⇒ **have** introduced. Lượt 1 · ĐỘNG TỪ." },
          { q: "“Students should be given more **informations** about careers.”", options: ["N", "V", "P", "L"], correct: 0, why: "information không đếm được ⇒ không -s. Lượt 2 · DANH TỪ." },
          { q: "“Prices rose sharply**, many families** cut back on meat.”", options: ["L", "C", "V", "P"], correct: 1, why: "Hai câu đủ nối bằng dấu phẩy (comma splice) ⇒ **; many families** hoặc **, so many families**. Lượt 3." },
          { q: "“Having been closed for repairs, **visitors** could not enter the museum.”", options: ["T", "N", "V", "P"], correct: 3, why: "Chủ ngữ treo: visitors không bị đóng cửa ⇒ **the museum** phải là chủ ngữ. Lượt 4 · dangling modifier (Ngày 5)." },
          { q: "“**Kids** these days spend **a lot of** time online.” (Task 2)", options: ["V", "N", "L", "C"], correct: 2, why: "Register văn nói ⇒ **Children / Young people** · **a considerable amount of**. Lượt 5." },
          { q: "Đề hỏi “Why is this happening and what can be done?” — bài chỉ có đoạn giải pháp.", options: ["T", "L", "P", "V"], correct: 0, why: "Thiếu một vế đề ⇒ TR tối đa band 5–6. Lượt 6 · ĐỀ (đếm vế đề — Ngày 2, Ngày 28)." },
          { q: "“Cars **make** serious damage to city air.”", options: ["V", "P", "N", "C"], correct: 1, why: "Collocation: **cause / do** damage (Ngày 6), không make. Lượt 4." },
          { q: "“Online learning is cheaper. **Moreover**, it is flexible. **Furthermore**, it saves time. **In addition**, it suits shy students.”", options: ["C", "V", "N", "L"], correct: 3, why: "Từ nối dày đặc, mỗi câu một cái — CC band 6 (Ngày 15). Lượt 5 · LIÊN KẾT. Gộp ý: “Online learning is cheaper and more flexible, and it saves time — advantages that matter most to…”" },
        ],
      },
      {
        t: "quiz",
        id: "t4d30-viet-sua",
        title: "6b. Viết lại câu cho hết lỗi (6 câu — gõ cả câu)",
        kind: "fill",
        items: [
          { q: "1. The number of students who study abroad have doubled since 2010.", answers: ["The number of students who study abroad has doubled since 2010.", "The number of students who study abroad has doubled since 2010"], hint: "V — chia theo the number" },
          { q: "2. Young people feel boring when they have no hobbies.", answers: ["Young people feel bored when they have no hobbies.", "Young people feel bored when they have no hobbies"], hint: "P — cảm xúc của người: -ed" },
          { q: "3. Governments should spend more money for public transport.", answers: ["Governments should spend more money on public transport.", "Governments should spend more money on public transport"], hint: "P — spend money on" },
          { q: "4. Tourism brings jobs, it also damages the environment.", answers: ["Tourism brings jobs, but it also damages the environment.", "Tourism brings jobs; it also damages the environment.", "Tourism brings jobs, but it also damages the environment", "Although tourism brings jobs, it also damages the environment."], hint: "C — comma splice ⇒ , but / ; / Although…" },
          { q: "5. Arden increased by 7 percents.", answers: ["Arden's figure increased by 7 percentage points.", "The figure for Arden increased by 7 percentage points.", "Arden's figure rose by 7 percentage points.", "The proportion in Arden increased by 7 percentage points."], hint: "N — chủ ngữ là con số · percentage points" },
          { q: "6. Older workers have a lot of experiences to teach young staffs.", answers: ["Older workers have a great deal of experience to pass on to young staff.", "Older workers have a lot of experience to teach young staff.", "Older workers have considerable experience to pass on to younger staff.", "Older workers have a great deal of experience to pass on to younger staff."], hint: "N — experience, staff không đếm được · L — a great deal of / considerable" },
        ],
      },

      { t: "h", text: "7. Đến lượt bạn — viết lại 3 bài (AI chấm)" },
      { t: "p", text: "Mỗi ô: **dòng đầu chép lại đề gốc**, dòng thứ hai ghi “Bản 1: … lỗi (mã nặng nhất: …)”, rồi dán **Bản 4**. AI chấm 4 tiêu chí — so band với lần chấm cũ. Còn > 3 lỗi thì sửa tiếp đúng mã AI chỉ ra rồi nộp lại." },
      {
        t: "essay",
        id: "t4d30-viet-lai-1",
        task: "Task 2",
        prompt: "REWRITE 1 (Task 2). On the FIRST line, copy the question of one of your old Task 2 essays from Tập 4 (for example the Opinion essay of Day 4, or the Writing Task 2 of Test 6 / Test 7). On the second line, write how many sentence errors Version 1 had. Then write your final rewritten version (Version 4), aiming for no more than 3 errors.",
        minWords: 250,
        tips: [
          "Sửa ý trước: lập trường một câu, mỗi đoạn một ý, ví dụ có tên / số / nơi chốn.",
          "Sửa câu theo hai mã nặng nhất của bạn trước, rồi mới tới các mã còn lại.",
          "Không thêm quá 6 cấu trúc mới — câu dài hơn là chỗ sinh lỗi mới.",
        ],
      },
      {
        t: "essay",
        id: "t4d30-viet-lai-2",
        task: "Task 2",
        prompt: "REWRITE 2 (Task 2, a DIFFERENT type from Rewrite 1 — for example Advantages / disadvantages from Day 14, Problem / solution from Day 22, or Two-part from Day 28). On the FIRST line, copy the original question. On the second line, write the number of errors in Version 1. Then write Version 4, aiming for no more than 3 errors.",
        minWords: 250,
        tips: [
          "Đếm vế đề lại từ đầu — bài cũ thiếu vế là lỗi T, phải sửa trước mọi thứ.",
          "Đoạn phản biện: nêu rồi bác (Admittedly… / Granted…, but…) thay vì nêu rồi bỏ đó.",
          "Từ nối đầu câu: ≤ 4 trong cả hai thân bài.",
        ],
      },
      {
        t: "essay",
        id: "t4d30-viet-lai-3",
        task: "Task 1",
        prompt: "REWRITE 3 (Task 1). On the FIRST line, copy the question of one of your old Task 1 reports from Tập 4 (line, bar, table, pie or mixed — choose the type you find hardest). On the second line, write the number of errors in Version 1. Then write Version 4, aiming for no more than 3 errors.",
        minWords: 150,
        tips: [
          "Chủ ngữ là con số (the figure / the proportion / X's share), không phải tên nước hay thành phố.",
          "Overview nêu hai đặc điểm lớn, không có số liệu.",
          "percentage vs percentage points · the number of + đếm được · the amount of + không đếm được.",
        ],
      },
      {
        t: "table",
        caption: "Bảng theo dõi — chép vào sổ sau khi AI chấm",
        head: ["Bài", "Lỗi Bản 1", "Lỗi Bản 4", "Band cũ → mới", "Mã còn sót"],
        rows: [
          ["Viết lại 1 (Task 2)", "…", "≤ 3?", "… → …", "…"],
          ["Viết lại 2 (Task 2)", "…", "≤ 3?", "… → …", "…"],
          ["Viết lại 3 (Task 1)", "…", "≤ 3?", "… → …", "…"],
        ],
      },
      {
        t: "note",
        title: "📌 Trước Đề 8",
        items: [
          "Hai mã còn sót nhiều nhất sau ba bài = hai lượt soát bạn làm **đầu tiên** trong 5 phút cuối của Đề 8.",
          "Viết hai mã đó lên đầu tờ nháp khi thi (ví dụ: “V · C”) — nhắc mắt tìm đúng loại lỗi của mình.",
        ],
      },
    ],
  },

  /* ══════════════════════════════ BÀI 3 — NÓI ══════════════════════════════ */
  {
    id: "t4d30-noi",
    kind: "speaking",
    title: "Nói: Giám khảo AI 14 phút — luyện trọn 3 Part bằng Đề 7 (chế độ luyện), kho 5 câu chuyện, xin nhắc lại câu hỏi đúng cách",
    goal: "Dựng kho 5 câu chuyện phủ được phần lớn đề Part 2, biết xin nhắc lại / giải thích câu hỏi đúng luật từng Part mà không mất điểm, rồi luyện một buổi đủ 3 Part (11–14 phút) với giám khảo AI bằng Đề 7 ở chế độ luyện — nói một mạch, sau đó dùng chỗ dừng sau mỗi câu để so với câu mẫu band 7 và nói lại — và chọn đúng hai việc cần sửa trước khi thi Đề 8.",
    minutes: 85,
    blocks: [
      {
        t: "recap",
        items: [
          "Bài này đo **Speaking band 7** cả 4 tiêu chí: **FC** nói dài không gắng sức · **LR** từ ít gặp, idiom đúng chỗ · **GRA** câu phức đa dạng, đa số không lỗi · **P** trọng âm, ngữ điệu, nối âm tự nhiên.",
          "Hôm nay **luyện**, chưa thi: dùng **Đề 7** ở ==chế độ luyện== (`noi-de7&che=luyen`). **Đề 8** là thi cuối Tập 4 — làm SAU Ngày 30, chế độ thi thật; ==đừng mở đề nói của Đề 8 trước==.",
          "**Kho 5 câu chuyện**: 5 chuyện thật của bạn, mỗi chuyện bẻ được sang 5–8 đề Part 2 (nối Tập 2 Ngày 23).",
          "**X05** — không học thuộc; biết câu nào **được** hỏi lại ở Part nào; ngập ngừng tự nhiên bằng câu mua giờ, không im lặng.",
          "🔊 Phát âm: ngữ điệu của câu mua giờ và câu xin nhắc lại — đọc liền hơi, không ngắt từng chữ.",
        ],
      },

      { t: "h", text: "1. Mười bốn phút — giám khảo làm gì, band 7 trông thế nào" },
      {
        t: "table",
        caption: "Cấu trúc bài thi nói",
        head: ["Part", "Thời gian", "Giám khảo làm gì", "Band 7 ở Part này"],
        rows: [
          ["**1**", "4–5 phút", "Hỏi 2–3 chủ đề quen, mỗi chủ đề 3–4 câu; đọc câu hỏi theo kịch bản", "2–3 câu / câu hỏi, một chi tiết thật, một từ đắt (Bài 1)"],
          ["**2**", "1 phút chuẩn bị + 1–2 phút nói", "Đưa thẻ đề; nói “Please start now” rồi im; 2 phút thì ngắt; có thể hỏi 1 câu chốt", "Nói đủ 2 phút một mạch, có câu chuyện nhỏ và một đoạn nhìn lại (Ngày 6, 14)"],
          ["**3**", "4–5 phút", "Hỏi câu trừu tượng nối chủ đề Part 2; được diễn đạt lại câu hỏi, được hỏi vặn", "Ý kiến có mức độ + lý do + ví dụ xã hội; so sánh xưa – nay; dự đoán có rào (Ngày 3, 7, 11, 15, 19, 23)"],
        ],
      },
      {
        t: "table",
        caption: "X05 — được hỏi lại gì, ở Part nào",
        head: ["Part", "Giám khảo được phép", "Câu bạn dùng"],
        rows: [
          ["**1**", "Chỉ **nhắc lại** câu hỏi một lần; không giải thích từ", "**Sorry, could you say that again, please?**"],
          ["**2**", "Không giải thích thẻ đề; bạn có giấy bút để ghi trong 1 phút", "Không hỏi gì — đọc kỹ cả 4 dòng của thẻ"],
          ["**3**", "Được **diễn đạt lại** hoặc giải thích câu hỏi", "**Do you mean… or…?** · **Could you rephrase that?** · **Sorry, I'm not sure what you mean by “…”.**"],
        ],
      },
      {
        t: "note",
        title: "⚠️ Cẩn thận: bốn thói quen làm FC tụt mà không do tiếng Anh",
        items: [
          "**Học thuộc câu trả lời.** Nhịp đều như đọc, từ quá đẹp so với phần còn lại — giám khảo chuyển sang câu hỏi khác và chấm FC theo phần nói tự nhiên.",
          "**Im lặng khi nghĩ.** 4–5 giây im lặng nhiều lần = “hesitation” ⇒ band 6. Dùng câu mua giờ (mục 7) để nghĩ **trong lúc nói**.",
          "**Hỏi nghĩa từ ở Part 1.** Giám khảo không được giải thích ⇒ bạn mất 10 giây. Đoán theo ngữ cảnh rồi trả lời.",
          "**Nhìn giấy ở Part 1 / Part 3.** Giấy chỉ dùng trong 1 phút chuẩn bị Part 2. Thi máy: nhìn camera như nhìn mắt người.",
        ],
      },

      { t: "h", text: "2. Kho 5 câu chuyện — một chuyện, nhiều đề Part 2 (nối Tập 2 Ngày 23)" },
      { t: "p", text: "Đề Part 2 nhiều vô kể nhưng chỉ xoay quanh vài **loại**: người · nơi · đồ vật · sự kiện / “a time when…” · quyết định / thành tựu. Chuẩn bị **5 câu chuyện thật** — mỗi chuyện có chi tiết (tên, nơi, thời gian), một khoảnh khắc chính và một câu nhìn lại — rồi bẻ chúng sang đề. Bảng dưới là kho mẫu của một sinh viên IT; **thay bằng chuyện của bạn**." },
      {
        t: "table",
        caption: "Kho 5 câu chuyện mẫu — và các đề mỗi chuyện phủ được",
        head: ["Câu chuyện", "Bẻ được sang các đề", "5 từ band 7 gắn sẵn"],
        rows: [
          ["**① Người** — bà ngoại, 70 tuổi, tự học dùng điện thoại thông minh để gọi video cho cháu ở xa", "a person you admire · an older person · someone who learned something new · a family member · someone who is good with technology", "determined · patient · pick up a skill · bridge the generation gap · a heart of gold"],
          ["**② Nơi** — một quán cà phê nhỏ trong hẻm gần trường, nơi bạn ôn thi suốt năm hai", "a place you like to study · a quiet place · a place you'd recommend · a café / restaurant · a place you often visit", "tucked away · a home from home · unwind · laid-back · off the beaten track"],
          ["**③ Đồ vật** — chiếc laptop cũ mua lại bằng tiền làm thêm, đã tự thay ổ cứng", "something you saved up for · a piece of technology · something you use every day · something you'd replace · something you repaired", "second-hand · save up for · worth every penny · upgrade · have seen better days"],
          ["**④ Sự kiện** — hackathon 48 giờ: ứng dụng sập ngay lúc trình bày, nhóm phải sửa trước mặt ban giám khảo", "a time you solved a problem · a team project · an event that did not go as planned · a time you were nervous · a time you learned from a mistake", "pull together · think on our feet · out of the blue · a steep learning curve · in hindsight"],
          ["**⑤ Quyết định** — chuyển từ ngành kinh tế sang công nghệ thông tin sau năm nhất", "an important decision · a time you changed your mind · a piece of advice you followed · a goal you set · an achievement you are proud of", "weigh up · a turning point · take the plunge · have no regrets · in two minds"],
        ],
      },
      {
        t: "note",
        title: "💡 Mẹo: bẻ một câu chuyện sang đề mới trong 1 phút chuẩn bị",
        items: [
          "**Đọc dòng cuối của thẻ trước** (… and explain why / how you felt) — đó là chỗ quyết định bạn kể chuyện theo góc nào.",
          "Ghi 4 dòng: **ai / ở đâu / khi nào** · **khoảnh khắc chính** · **3 từ đắt** · **nhìn lại** (in hindsight…).",
          "Đổi **góc**, không đổi chuyện: hackathon kể theo “a time you were nervous” thì nhấn cảm giác; theo “a team project” thì nhấn cách chia việc.",
          "Đừng ép: đề không bẻ được (Describe a river…) thì nghĩ chuyện mới — 5 chuyện phủ khoảng 70–80 % đề, không phải 100 %.",
        ],
      },
      { t: "rule", formula: "Thẻ đề → chọn chuyện trong kho → đổi GÓC theo dòng cuối của thẻ → ghi 4 dòng", vi: "Thuộc chuyện của mình, không thuộc bài nói — câu vẫn sinh ra lúc nói." },

      { t: "h", text: "3. Band 6 và band 7 đặt cạnh nhau — Part 1 và Part 3" },
      {
        t: "dialogue",
        title: "Part 1 — Noise",
        lines: [
          { who: "Examiner", role: "examiner", text: "Does noise ever bother you?" },
          { who: "Band 6", role: "a", text: "Yes, sometimes. My street is very noisy because there are many motorbikes. It makes me feel stressed when I study. So I use headphones.", vi: "Đúng, có lúc. Đường nhà tôi rất ồn vì nhiều xe máy. Nó làm tôi căng thẳng khi học. Nên tôi dùng tai nghe." },
          { who: "Band 7", role: "b", text: "It depends on the kind of noise, really. The constant hum of motorbikes outside my flat I've more or less tuned out, but what drives me up the wall is when a neighbour starts drilling at seven in the morning. On days like that I just put on noise-cancelling headphones and get on with it.", vi: "Thật ra tuỳ loại tiếng ồn. Tiếng xe máy rì rầm liên tục ngoài nhà thì tôi gần như quen rồi, nhưng điều làm tôi phát điên là khi hàng xóm khoan tường lúc bảy giờ sáng. Những hôm như thế tôi đeo tai nghe chống ồn rồi cứ thế làm việc." },
        ],
      },
      {
        t: "dialogue",
        title: "Part 3 — Changing opinions",
        lines: [
          { who: "Examiner", role: "examiner", text: "Why do some people find it so hard to change their minds?" },
          { who: "Band 6", role: "a", text: "I think people don't like to change their minds because they are proud. If they change, other people will think they were wrong. Also, they only read news that they agree with on social media. So it is hard for them to change.", vi: "Tôi nghĩ người ta không thích đổi ý vì tự ái. Nếu đổi, người khác sẽ nghĩ họ sai. Ngoài ra họ chỉ đọc tin họ đồng ý trên mạng xã hội. Nên khó mà đổi." },
          { who: "Band 7", role: "b", text: "I'd say there are two things going on. One is pride: admitting you were wrong can feel like losing face, especially in front of people you respect. The other, which is probably more powerful, is that people tend to look for information that confirms what they already believe — and social media makes that incredibly easy, because the feed learns what you like and keeps serving it. So it isn't necessarily that people are stubborn; it's that they rarely come across a strong argument against their own view in the first place.", vi: "Tôi cho là có hai chuyện. Một là sĩ diện: nhận mình sai có cảm giác như mất mặt, nhất là trước người mình nể. Chuyện thứ hai, có lẽ mạnh hơn, là người ta có xu hướng tìm thông tin khẳng định điều họ đã tin — và mạng xã hội làm việc đó cực dễ, vì bảng tin học được bạn thích gì và cứ thế đưa tiếp. Nên không hẳn là người ta cố chấp; mà là ngay từ đầu họ hiếm khi gặp một lập luận mạnh ngược với quan điểm của mình." },
        ],
      },
      {
        t: "table",
        caption: "Khác nhau ở đâu",
        head: ["Tiêu chí", "Band 6", "Band 7"],
        rows: [
          ["**FC**", "Câu ngắn nối bằng So / Also; ý dừng ở bề mặt", "Báo trước cấu trúc (two things going on · One is… The other…), câu chốt đảo góc nhìn (it isn't necessarily that…; it's that…)"],
          ["**LR**", "very noisy · stressed · proud", "the constant hum · tune out · drive me up the wall · lose face · keep serving it — idiom đúng chỗ, mỗi câu trả lời một cái"],
          ["**GRA**", "Câu đơn và câu ghép, một cấu trúc if", "Câu chẻ (what drives me up the wall is…), mệnh đề quan hệ chen (which is probably more powerful), rào (tend to · probably · not necessarily), mệnh đề danh ngữ (what they already believe)"],
          ["**P**", "Đọc đều từng chữ", "Nhấn từ mang ý tương phản (**two** things · **more** powerful · **stubborn**), hạ giọng ở mệnh đề chen"],
        ],
      },

      { t: "h", text: "4. Mười hai dấu hiệu band 7 — phiếu tự chấm của Ngày 27, hôm nay đặt cạnh điểm AI" },
      { t: "p", text: "Ở Ngày 27 bạn tự thu 14 phút và chấm bằng **phiếu 12 dấu hiệu**. Hôm nay dùng lại đúng phiếu đó, gom theo tiêu chí, để so **bạn tự chấm** với **AI chấm**. Dấu hiệu nào bạn ghi “Có” mà AI chê ⇒ đó là chỗ bạn đang tự đánh giá cao hơn thực tế." },
      {
        t: "table",
        caption: "Phiếu 12 dấu hiệu (Ngày 27) — gom theo tiêu chí",
        head: ["Tiêu chí", "Dấu hiệu đếm được", "Ôn ở"],
        rows: [
          ["**FC**", "① Part 2 nói ≥ 1 phút 45 giây không cần nhắc · ② cả bài ≤ 5 lần im > 2 giây để tìm từ · ③ ≥ 6 từ nối khác and / but / so / because · ④ mỗi câu Part 3 ít nhất hai tầng", "Ngày 6 · 14 · 15 · 27"],
          ["**LR**", "⑤ ≥ 8 từ / cụm ít gặp dùng đúng · ⑥ bí từ thì nói vòng, không im · ⑦ không lặp một tính từ dễ quá 3 lần", "Ngày 2 · 10 · 18 · 30"],
          ["**GRA**", "⑧ ≥ 5 kiểu câu phức khác nhau · ⑨ hơn nửa số câu không lỗi · ⑩ thì đúng mốc khi kể Part 2", "Ngày 3 · 7 · 19 · 23 · 29"],
          ["**P**", "⑪ người lạ nghe hiểu hết không cần cố · ⑫ nhấn từ khoá, lên xuống giọng, âm cuối không rụng", "Ngày 2 · 13 · 26 · 27"],
        ],
      },

      { t: "h", text: "5. Khởi động 10 phút — nói thử từng Part (AI chấm từng câu)" },
      { t: "p", text: "Chủ đề khởi động khác Đề 7 để không “nói trước” câu trả lời. Part 2: chọn một chuyện trong kho, ghi 4 dòng trong 1 phút, nói đủ 2 phút." },
      {
        t: "speak",
        id: "t4d30-noi-p1",
        part: "1",
        questions: [
          "Does noise ever bother you?",
          "Is your neighbourhood quieter or noisier than it was a few years ago?",
          "Do you prefer studying in silence or with some background noise?",
          "Have you ever complained about noise?",
        ],
      },
      {
        t: "speak",
        id: "t4d30-noi-p2",
        part: "2",
        questions: [
          "Describe a time when you changed your mind about something important. You should say: what you changed your mind about, what you thought before, what made you change your mind, and explain how you feel about the change now.",
        ],
      },
      {
        t: "speak",
        id: "t4d30-noi-p3",
        part: "3",
        questions: [
          "Why do some people find it hard to change their minds?",
          "Are young people more willing to change their opinions than older people?",
          "To what extent can advertising change what people believe?",
          "Do you think it will become easier or harder to change people's views in the future?",
        ],
      },

      { t: "h", text: "6. Vào phòng nói — giám khảo AI, Đề 7, chế độ luyện" },
      { t: "p", text: "Phòng Speaking có **giám khảo AI**: chào, hỏi Part 1, đưa thẻ đề Part 2 (1 phút chuẩn bị, nói tối đa 2 phút), hỏi câu chốt, rồi Part 3; xong bài chấm **FC · LR · GRA · P**, cho nghe lại từng câu, hiện chữ bạn đã nói, lỗi + câu sửa. Hôm nay mở **Speaking — Đề 7** ở **chế độ luyện**: `/language/en/ielts/thi-may/noi?de=noi-de7&che=luyen` (Online Test → Speaking → Đề 7 → Luyện). Chế độ luyện **dừng sau mỗi câu**: nghe lại, xem chữ, xem câu mẫu band 7, nói lại. Bạn đã thi Đề 7 sau Ngày 15 — hôm nay đo xem 15 ngày qua bạn tiến bao nhiêu trên **cùng** một đề." },
      {
        t: "sodo",
        kind: "flow",
        title: "Buổi luyện hôm nay — khoảng 40 phút",
        caption: "Lượt 1 giữ nhịp thi thật; chỉ lượt 2 mới dùng chỗ dừng của chế độ luyện.",
        steps: [
          { label: "**Chuẩn bị (2')**", sub: "Phòng yên, tai nghe có micro, giấy bút cho Part 2, tắt thông báo" },
          { label: "**Lượt 1 — một mạch (11–14')**", sub: "Gặp chỗ dừng thì bấm tiếp ngay, không nghe lại, không làm lại câu" },
          { label: "**Đọc phản hồi (10')**", sub: "Ghi band 4 tiêu chí; so với lần thi Đề 7 sau Ngày 15" },
          { label: "**Lượt 2 — từng câu (15')**", sub: "Mỗi câu: nghe lại mình → xem câu mẫu band 7 → nói lại, thêm đúng MỘT thứ (một từ, một cấu trúc)" },
        ],
      },
      {
        t: "note",
        title: "📌 Đề 8 — thi cuối Tập 4",
        items: [
          "Sau bài kiểm tra chặng của hôm nay, thi **Đề 8** (Online Test) đủ 4 kỹ năng ở **chế độ thi thật** — phần Speaking không dừng, không làm lại.",
          "**Đừng** mở trước đề nói của Đề 8 để “xem thử”: lộ đề thì kết quả không còn đo đúng trình, và bạn sẽ vô thức học thuộc.",
          "Muốn luyện thêm trước Đề 8: làm lại Đề 7 chế độ luyện, hoặc khối nói thử ở mục 5.",
        ],
      },

      { t: "h", text: "7. Đọc phản hồi — biến điểm thành việc làm" },
      {
        t: "table",
        caption: "Tiêu chí thấp nhất ⇒ việc trong 3 ngày tới",
        head: ["Thấp nhất", "Dấu hiệu trong bản ghi", "Việc làm"],
        rows: [
          ["**FC**", "Câu Part 3 dưới 25 giây; Part 2 dừng trước 1:30; im lặng dài", "Mỗi ngày 3 câu Part 3, bấm giờ ≥ 40 giây; kể lại 2 chuyện trong kho, đủ 2 phút"],
          ["**LR**", "Lặp good / bad / very; không có collocation nào", "Chọn 10 từ của Bài 1 + 5 idiom của Tập 4, mỗi ngày nói 5 câu với chúng"],
          ["**GRA**", "Toàn câu ghép and / so / but; lỗi thì khi so xưa – nay", "Ôn bảng 20 điểm (Ngày 29) nhóm B và E; mỗi câu Part 3 chủ động dùng một câu phức"],
          ["**P**", "Đều đều, rơi âm cuối, nhấn sai từ dài", "Đọc lại khối phát âm Ngày 13, 23, 27 và khối ngay dưới đây — ghi âm, so với mẫu"],
        ],
      },
      { t: "rule", formula: "Một buổi luyện ⇒ đúng HAI việc sửa (tiêu chí thấp nhất + lỗi lặp nhiều nhất)", vi: "Sửa nhiều thứ cùng lúc thì không thứ nào thành thói quen trước Đề 8." },

      { t: "h", text: "8. Phát âm: câu mua giờ và câu xin nhắc lại — đọc liền một hơi" },
      { t: "p", text: "Câu mua giờ chỉ “mua” được thời gian nếu nghe **tự nhiên**: đọc liền, âm yếu ở từ chức năng (to, for, of, that → /tə/ /fə/ /əv/ /ðət/), nhấn vào **một** từ mang nghĩa, giọng đi xuống ở cuối câu trần thuật và đi lên ở câu hỏi Yes / No." },
      {
        t: "phatam",
        id: "t4d30-phat-am",
        title: "Luyện phát âm — câu mua giờ và câu xin nhắc lại",
        note: "Đọc cả câu một hơi. Nghe mẫu rồi đọc theo; chú ý âm yếu /tə/ /fə/ /əv/ /ðət/ và ngữ điệu cuối câu.",
        items: [
          { text: "That's an interesting question, I haven't really thought about it before.", ipa: "ðæts ən ɪntrəstɪŋ kwestʃən aɪ hævnt rɪəli θɔːt əbaʊt ɪt bɪfɔː", vi: "Câu hỏi hay đấy — trước giờ tôi chưa thật sự nghĩ về nó." },
          { text: "Sorry, could you say that again, please?", ipa: "sɒri kʊd juː seɪ ðæt əɡen pliːz", vi: "Xin lỗi, bạn nhắc lại được không?" },
          { text: "Do you mean in my country or in general?", ipa: "duː juː miːn ɪn maɪ kʌntri ɔːr ɪn dʒenrəl", vi: "Ý bạn là ở nước tôi hay nói chung?" },
          { text: "Let me think about that for a second.", ipa: "let miː θɪŋk əbaʊt ðæt fər ə sekənd", vi: "Để tôi nghĩ một chút." },
          { text: "Off the top of my head, I'd say it depends on the person.", ipa: "ɒf ðə tɒp əv maɪ hed aɪd seɪ ɪt dɪpendz ɒn ðə pɜːsn", vi: "Nghĩ nhanh thì tôi cho là tuỳ người." },
          { text: "What I mean is that it's not as simple as it sounds.", ipa: "wɒt aɪ miːn ɪz ðət ɪts nɒt əz sɪmpl əz ɪt saʊndz", vi: "Ý tôi là chuyện đó không đơn giản như nghe." },
          { text: "To put it another way, people tend to trust what they already believe.", ipa: "tə pʊt ɪt ənʌðə weɪ piːpl tend tə trʌst wɒt ðeɪ ɔːlredi bɪliːv", vi: "Nói cách khác, người ta có xu hướng tin điều họ đã tin sẵn." },
          { text: "I'd never really considered it, but now that you mention it, yes.", ipa: "aɪd nevə rɪəli kənsɪdəd ɪt bət naʊ ðət juː menʃn ɪt jes", vi: "Tôi chưa từng nghĩ tới, nhưng giờ bạn nhắc thì đúng vậy." },
        ],
      },
      { t: "rule", formula: "Câu mua giờ = đọc liền + âm yếu từ chức năng + nhấn MỘT từ + ngữ điệu đúng loại câu", vi: "Câu mua giờ đọc rời từng chữ nghe như đang bí — đúng thứ bạn muốn che." },
    ],
  },

  /* ══════════════════════════════ BÀI TẬP NGÀY 30 ══════════════════════════════ */
  {
    id: "t4d30-bai-tap",
    kind: "homework",
    title: "Bài tập Ngày 30 — chủ đề lạ & idiom · mã lỗi & viết lại câu · chiến thuật thi nói",
    goal: "Tự kiểm cả ngày bằng 32 câu có đáp án (trả lời Part 1 chủ đề lạ, idiom và collocation, gán mã lỗi, viết lại câu cho hết lỗi, luật hỏi lại câu hỏi và kho câu chuyện, ghép câu) và một lượt nói Part 1; đúng từ 24 câu trở lên là đạt — rồi làm bài kiểm tra chặng.",
    minutes: 45,
    blocks: [
      {
        t: "recap",
        title: "Làm gì · chấm thế nào",
        items: [
          "**Phần A** (8 câu) — chọn câu trả lời Part 1 tốt nhất cho chủ đề lạ (Bài 1 mục 1–3).",
          "**Phần B** (8 câu) — điền idiom / collocation (Bài 1 mục 4–5).",
          "**Phần C** (6 câu) — lỗi thuộc mã nào, sửa thế nào (Bài 2 mục 1, 6).",
          "**Phần D** (4 câu) — viết lại câu cho hết lỗi (Bài 2 mục 4–5).",
          "**Phần E** (4 câu) + **Phần F** (2 câu) — luật thi nói, kho câu chuyện, ghép câu (Bài 3). Tổng 32; **≥ 24** là đạt.",
        ],
      },

      { t: "h", text: "Phần A — Câu trả lời Part 1 nào tốt nhất? (8 câu · Bài 1 mục 1–3)" },
      {
        t: "mcq",
        id: "t4d30-bt-part1",
        title: "A. Chọn câu trả lời band 7",
        items: [
          { q: "“Do you like chocolate?”", options: ["Yes, I like chocolate very much because it is sweet and delicious.", "Chocolate is a food made from cocoa beans.", "I'd say so — I have a sweet tooth, so during exam season I indulge in a square of dark chocolate every evening as a little reward.", "Yes. Chocolate is my cup of tea."], correct: 2, why: "Trả lời thẳng + chi tiết thật (mùa thi, mỗi tối) + hai cụm đúng (a sweet tooth, indulge in). D dùng idiom ở dạng khẳng định — not my cup of tea thường đi phủ định, và nghe gượng." },
          { q: "“Do you often have visitors?”", options: ["Mostly at Tết. Relatives drop by all week, and last year we even put up my cousin from Huế for a few days.", "Yes, I often have visitors, visitors come to my house.", "Visitors are people who visit.", "I don't know, next question."], correct: 0, why: "Có thời điểm (Tết), chi tiết (người anh họ ở Huế), cụm **put sb up** đúng. B lặp từ, C định nghĩa, D bỏ lửng." },
          { q: "“Do you like swimming?”", options: ["Swimming is very good for health and everybody should swim.", "I enjoy it in a pool, but I'm a bit out of my depth in the sea — the currents near my hometown are quite strong.", "Yes, swimming is good.", "I like swimming because swimming is a sport."], correct: 1, why: "Có tương phản (pool / sea) và lý do thật; **out of my depth** dùng cả nghĩa đen — tự nhiên. A nói chung về “everybody” — Part 1 hỏi về BẠN." },
          { q: "“Did you have many toys as a child?”", options: ["I had many toys, for example a car, a ball and a doll.", "Toys are very expensive nowadays.", "Yes, I had a lot of toys when I was a child, and I played with toys.", "Not really. Most of them were hand-me-downs from my cousin, but there was one Lego set I played with for years."], correct: 3, why: "D: mức độ (Not really), từ ít gặp (hand-me-downs), chi tiết riêng. B lạc sang hiện tại; A liệt kê không có gì riêng." },
          { q: "“Do you think robots will do housework in the future?”", options: ["Robots will do everything in the future.", "To some extent they already do — my robot vacuum takes the drudgery out of cleaning — but I doubt they'll be folding laundry any time soon.", "Yes, robot will do housework.", "I'm not interested in robots."], correct: 1, why: "Rào mức độ (To some extent · I doubt), ví dụ thật, cụm **take the drudgery out of**. A khẳng định tuyệt đối; D dừng ở câu thú nhận." },
          { q: "Bạn hoàn toàn không có ý về “History”. Câu nào xử lý tốt nhất?", options: ["History is boring.", "To be honest, it was never my favourite subject — too many dates to memorise — but documentaries have brought it to life for me recently.", "I don't like history, sorry.", "Can you ask me about my hometown instead?"], correct: 1, why: "Lối 2: thú thật + lý do + một câu nội dung có cụm **bring sth to life**. D xin đổi chủ đề — giám khảo không được đổi." },
          { q: "“Is your handwriting neat?”", options: ["Far from it. When I'm taking notes in lectures it turns into a scrawl that's sometimes illegible even to me.", "My handwriting is not neat, it is messy.", "Neat handwriting is important for students.", "No."], correct: 0, why: "Far from it = trả lời thẳng theo kiểu nhấn mạnh; **a scrawl**, **illegible** đúng collocation. B comma splice; D một chữ ⇒ FC thấp." },
          { q: "“Do you like flowers?”", options: ["Flowers are beautiful.", "I like flowers because flowers are beautiful and smell good.", "Yes, flowers is nice and I like it.", "I'm not a big flower person, but I do love the fragrant milk flowers that fill Hanoi's streets every autumn."], correct: 3, why: "Tương phản + chi tiết địa phương (hoa sữa Hà Nội) + **fragrant**. C sai hoà hợp chủ – vị." },
        ],
      },

      { t: "h", text: "Phần B — Điền idiom / collocation (8 câu · Bài 1 mục 4–5)" },
      {
        t: "quiz",
        id: "t4d30-bt-dien",
        title: "B. Điền MỘT từ",
        kind: "fill",
        items: [
          { q: "1. I'd love to join the dance class, but I have two left ___.", answers: ["feet"] },
          { q: "2. We get ___ rain in the rainy season — the streets flood within minutes.", answers: ["torrential"] },
          { q: "3. My desk gets ___ with cables and empty coffee cups.", answers: ["cluttered"] },
          { q: "4. Wearing a watch helps me stay ___ for early lectures.", answers: ["punctual"] },
          { q: "5. My grandfather's old watch is now a ___ I keep in a drawer.", answers: ["keepsake"] },
          { q: "6. Cut flowers ___ quickly in this heat.", answers: ["wilt"] },
          { q: "7. Horror films are not my cup of ___.", answers: ["tea"] },
          { q: "8. I can't get ___ of street-side bánh mì.", answers: ["enough"] },
        ],
      },

      { t: "h", text: "Phần C — Lỗi thuộc mã nào? (6 câu · Bài 2 mục 1, 6)" },
      {
        t: "mcq",
        id: "t4d30-bt-ma-loi",
        title: "C. Chọn mã đúng (V · N · C · P · L · T)",
        items: [
          { q: "“The amount of plastic waste **have** risen sharply.”", options: ["V", "N", "P", "L"], correct: 0, why: "Chủ ngữ là the amount (số ít) ⇒ **has**. Lượt 1 · ĐỘNG TỪ." },
          { q: "“Governments should invest more **researches** into clean energy.”", options: ["C", "P", "N", "T"], correct: 2, why: "research không đếm được ⇒ **more research**. Lượt 2 · DANH TỪ." },
          { q: "“Online classes are flexible**,** students can study anywhere.”", options: ["L", "C", "V", "N"], correct: 1, why: "Comma splice ⇒ **, so students** / **; students**. Lượt 3." },
          { q: "“Many young adults are **interesting** in starting a business.”", options: ["N", "V", "T", "P"], correct: 3, why: "Từ loại: cảm xúc của người ⇒ **interested in**. Lượt 4." },
          { q: "“**Basically**, kids **gotta** learn to manage money.” (Task 2)", options: ["L", "C", "N", "V"], correct: 0, why: "Register văn nói ⇒ **Children need to learn to manage money.** Lượt 5." },
          { q: "Đề: “Discuss both views and give your opinion.” Bài chỉ bàn một quan điểm.", options: ["P", "L", "V", "T"], correct: 3, why: "Thiếu một vế đề ⇒ TR bị giới hạn. Lượt 6 · ĐỀ." },
        ],
      },

      { t: "h", text: "Phần D — Viết lại câu cho hết lỗi (4 câu · Bài 2 mục 4–5)" },
      {
        t: "quiz",
        id: "t4d30-bt-sua",
        title: "D. Gõ lại cả câu đúng",
        kind: "fill",
        items: [
          { q: "1. The government do not need to pay so much pension.", answers: ["The government does not need to pay so much in pensions.", "The government does not need to pay so much pension.", "The government doesn't need to pay so much in pensions.", "The government does not need to spend so much on pensions."], hint: "V — the government + does" },
          { q: "2. Belmont was stable at about 25%.", answers: ["Belmont's figure was stable at about 25%.", "The figure for Belmont was stable at about 25%.", "Belmont's figure remained stable at about 25%.", "The figure for Belmont remained stable at about 25%."], hint: "N/L — chủ ngữ là con số" },
          { q: "3. Older people may take jobs of young people, which makes unemployment.", answers: ["Older people may take jobs from young people, which leads to higher unemployment.", "Older people may take jobs from younger people, which leads to higher unemployment.", "Older people may take jobs from young people, which could lead to higher unemployment."], hint: "P — take jobs from · lead to higher unemployment" },
          { q: "4. Some people are forced to work because they are poor, it is not fair.", answers: ["Some people are forced to work because they are poor, which is unfair.", "Some people are forced to work because they are poor, which is not fair.", "Some people are forced to work because they are poor. This is unfair.", "Some people are forced to work because they are poor, and this is unfair."], hint: "C — comma splice ⇒ , which… / . This…" },
        ],
      },

      { t: "h", text: "Phần E — Luật thi nói và kho câu chuyện (4 câu · Bài 3 mục 1–2)" },
      {
        t: "mcq",
        id: "t4d30-bt-noi",
        title: "E. Chọn cách xử lý đúng",
        items: [
          { q: "Part 1, bạn không nghe rõ câu hỏi. Nói gì?", options: ["“What does that word mean?”", "“Sorry, could you say that again, please?”", "Im lặng chờ giám khảo hỏi câu khác.", "Trả lời bừa một câu dài."], correct: 1, why: "Ở Part 1 giám khảo chỉ được **nhắc lại**, không giải thích ⇒ xin nhắc lại là đúng luật." },
          { q: "Part 3: “How has the role of the media changed?” — bạn không chắc “the media” gồm những gì.", options: ["Bỏ qua, nói về điện thoại.", "“I don't know.”", "Hỏi giám khảo nghĩa của media bằng tiếng Việt.", "“Do you mean news organisations, or social media as well?”"], correct: 3, why: "Part 3 được **làm rõ câu hỏi**. Câu Do you mean… or…? vừa đúng luật vừa cho thấy bạn hiểu chủ đề." },
          { q: "Thẻ Part 2: “Describe a time you were nervous.” Kho câu chuyện của bạn có chuyện hackathon (app sập lúc trình bày). Làm gì trong 1 phút?", options: ["Ghi 4 dòng: ai / ở đâu / khi nào · khoảnh khắc app sập · 3 từ đắt · nhìn lại — nhấn vào CẢM GIÁC", "Nghĩ một chuyện hoàn toàn mới cho đúng đề", "Viết sẵn cả bài nói ra giấy", "Kể hackathon theo góc chia việc trong nhóm"], correct: 0, why: "Giữ chuyện, đổi **góc** theo dòng cuối của thẻ (nervous ⇒ cảm giác). D đúng chuyện nhưng sai góc; C tốn giờ và đọc lại sẽ nghe như học thuộc." },
          { q: "Vì sao không nên học thuộc câu trả lời từ bộ đề quý?", options: ["Vì bộ đề không bao giờ lặp lại.", "Vì AI không chấm được câu thuộc lòng.", "Vì giám khảo nhận ra nhịp đọc thuộc và chấm FC theo phần nói tự nhiên; câu thuộc lại hay lệch đúng câu hỏi.", "Vì học thuộc tốn ít thời gian quá."], correct: 2, why: "X05: không học thuộc. Ôn **ý + từ**, nói thành tiếng, nghe lại — câu phải sinh ra lúc nói." },
        ],
      },

      { t: "h", text: "Phần F — Ghép câu (2 câu)" },
      {
        t: "build",
        id: "t4d30-bt-ghep",
        title: "F. Bấm các mảnh theo đúng thứ tự",
        items: [
          { vi: "Điều làm tôi phát điên là khi hàng xóm khoan tường lúc bảy giờ sáng.", chips: ["What drives me", "up the wall", "is when", "a neighbour starts drilling", "at seven in the morning.", "It drives me", "are when"], answer: ["What drives me", "up the wall", "is when", "a neighbour starts drilling", "at seven in the morning."] },
          { vi: "Không hẳn là người ta cố chấp; mà là họ hiếm khi gặp một lập luận mạnh ngược lại.", chips: ["It isn't necessarily", "that people are stubborn;", "it's that", "they rarely come across", "a strong counter-argument.", "they come across rarely", "because"], answer: ["It isn't necessarily", "that people are stubborn;", "it's that", "they rarely come across", "a strong counter-argument."] },
        ],
      },
      { t: "p", text: "**Nói thử (AI chấm).** Hai câu Part 1 chủ đề lạ — trả lời thẳng, một chi tiết thật, một từ của Bài 1." },
      {
        t: "speak",
        id: "t4d30-bt-noi-thu",
        part: "1",
        questions: [
          "Do you prefer sunny days or rainy days?",
          "What do you usually carry in your bag?",
        ],
      },
    ],
  },

  /* ══════════════════════════════ KIỂM TRA CHẶNG (NGÀY 25–30) ══════════════════════════════ */
  {
    id: "t4d30-kiem-tra",
    kind: "review",
    title: "Kiểm tra chặng (Ngày 25–30) — chặng cuối Tập 4",
    goal: "Đo lại chặng cuối của Tập 4 theo 8 phần — ngữ pháp, từ vựng, dịch, nghe, đọc, viết, nói, phát âm — với ngưỡng đạt ≥ 70 % từng phần, biết phần nào hụt thì ôn lại Ngày nào, rồi mới vào Đề 8 (thi cuối Tập 4, band 7.0).",
    minutes: 150,
    blocks: [
      {
        t: "recap",
        title: "Cách làm bài kiểm tra chặng",
        items: [
          "Gom **Ngày 25 – 30**: gỡ câu phức Passage 3 · giả định cách & fronting · bảng 20 điểm · Food & Media vòng 2 · AWL 7–10 · idiom Part 1 · Summary · ba lần đọc 60 phút · thứ tự passage · đề Listening 40 câu · email trang trọng · two-part · viết lại theo sổ lỗi · thi nói 14 phút.",
          "Làm **một lượt, không xem lại bài học**. Nghe: mỗi bài nghe một lần. Đọc: 15 phút.",
          "Ngưỡng đạt **≥ 70 % từng phần** (ghi ở đầu mỗi phần). Trượt phần nào ⇒ ôn đúng Ngày ghi bên cạnh, rồi làm lại riêng phần đó.",
          "Đạt cả 8 phần ⇒ vào **Đề 8** ở Online Test (thi thật, đủ 4 kỹ năng).",
        ],
      },

      { t: "h", text: "Phần 1 — Ngữ pháp (10 + 5 câu · đạt ≥ 11/15 · trượt thì ôn Ngày 25, 27, 29)" },
      {
        t: "mcq",
        id: "t4d30-kt-ngu-phap-chon",
        title: "1a. Chọn đáp án đúng (10 câu)",
        items: [
          { q: "“The bridge was to have been finished by 2020.” Câu này cho biết gì?", options: ["Cây cầu xong năm 2020.", "Cây cầu không xong đúng kế hoạch năm 2020.", "Cây cầu sẽ xong sau năm 2020.", "Không ai lập kế hoạch cho cây cầu."], correct: 1, why: "was to have + V3 = kế hoạch **không thành** (Ngày 25 mục 4). Câu không nói sau đó có xong hay không (loại C)." },
          { q: "“By the time the report was published, the policy had already been abandoned.” Việc nào xảy ra TRƯỚC?", options: ["Chính sách bị bỏ", "Báo cáo được công bố", "Hai việc cùng lúc", "Không xác định được"], correct: 0, why: "had been + V3 kéo sự việc về trước mốc kể (Ngày 25 mục 3)." },
          { q: "It is essential that every applicant ___ an interview.", options: ["attends", "will attend", "attend", "attended"], correct: 2, why: "Giả định cách sau It is essential that: **V nguyên mẫu** cho mọi ngôi (Ngày 27 mục 2)." },
          { q: "It's high time the council ___ the parking problem.", options: ["tackles", "tackle", "has tackled", "tackled"], correct: 3, why: "It's high time + S + **V2** (quá khứ không thật — nghĩa hiện tại: lẽ ra phải làm rồi) (Ngày 27 mục 3)." },
          { q: "Equally important ___ the cost of maintaining the new system.", options: ["is", "are", "it is", "being"], correct: 0, why: "Fronting + đảo: Equally important **is** + chủ ngữ (the cost — số ít) (Ngày 27 mục 5)." },
          { q: "Japan has an ageing population, as ___ Italy and Germany.", options: ["has", "is", "do", "does"], correct: 2, why: "has ở đây là động từ thường ⇒ trợ động từ **do**; chủ ngữ Italy and Germany số nhiều ⇒ do (Ngày 27 mục 4)." },
          { q: "Chọn câu đúng:", options: ["The figure rose steadily, with exports were accounting for most of the growth.", "The figure rose steadily, with exports accounting for most of the growth.", "The figure rose steadily, with exports accounted for most of the growth.", "The figure rose steadily, with accounting exports for most of the growth."], correct: 1, why: "with + N + **V-ing** (absolute clause) — điểm 6 của bảng 20 (Ngày 5, Ngày 29)." },
          { q: "If I had chosen engineering, I ___ in a factory now.", options: ["would have worked", "will be working", "would work had", "would be working"], correct: 3, why: "Hỗn hợp: quá khứ khác đi (had chosen) ⇒ **hiện tại** khác đi (would be working now) — điểm 18 (Ngày 19, Ngày 29)." },
          { q: "“The manuscripts are thought to have been copied by monks.” Nghĩa là:", options: ["Chắc chắn các sư đã chép bản thảo.", "Người ta cho rằng bản thảo đã được các sư chép từ trước.", "Các sư đang chép bản thảo.", "Các sư nghĩ về bản thảo."], correct: 1, why: "are thought (ý kiến, hiện tại) + to have been copied (việc chép: quá khứ, bị động) + by monks (người làm) — Ngày 25 mục 5–6." },
          { q: "Chọn câu đúng (điểm 7, bảng 20):", options: ["It is the cost of rent that worry students most.", "What students need are cheaper rent.", "It is the cost of rent that worries students most.", "The reason is because rent is high."], correct: 2, why: "It is X **that** + động từ chia theo X (the cost ⇒ worries). What… need **is**; The reason is **that**." },
        ],
      },
      {
        t: "quiz",
        id: "t4d30-kt-ngu-phap-dien",
        title: "1b. Viết dạng đúng của từ trong ngoặc (5 câu — có thể cần 2–4 từ)",
        kind: "fill",
        items: [
          { q: "1. The tunnel, which ___ (expect) to take five years, eventually took twelve.", answers: ["had been expected", "was expected"], hint: "Bị động; kế hoạch trước việc kể" },
          { q: "2. The committee recommended that the plan ___ (delay) until spring.", answers: ["be delayed", "should be delayed"], hint: "recommend that + S + be + V3" },
          { q: "3. Not until the 1990s ___ (scientists / understand) the cause of the disease.", answers: ["did scientists understand"], hint: "Not until… + trợ động từ + S + V" },
          { q: "4. Had the warnings been heeded, the damage ___ (be) far less severe.", answers: ["would have been"], hint: "Had + S + V3 (quá khứ) ⇒ would have + V3" },
          { q: "5. The data appear ___ (collect) carelessly.", answers: ["to have been collected"], hint: "appear + to have been + V3 (bị động, trước)" },
        ],
      },

      { t: "h", text: "Phần 2 — Từ vựng (10 + 4 câu · đạt ≥ 10/14 · trượt thì ôn Ngày 26, 28, 30)" },
      {
        t: "mcq",
        id: "t4d30-kt-tu-vung-chon",
        title: "2a. Chọn từ đúng (10 câu)",
        items: [
          { q: "Processed foods often contain ___ that extend their shelf life.", options: ["additives", "additions", "addicts", "admissions"], correct: 0, why: "**food additives** = chất phụ gia. additions = phần thêm vào (chung)." },
          { q: "If every batch can be followed from farm to shop, this ___ helps stop outbreaks of food poisoning quickly.", options: ["visibility", "hospitality", "traceability", "flexibility"], correct: 2, why: "**traceability** = khả năng truy xuất nguồn gốc — từ khoá của chủ đề an toàn thực phẩm." },
          { q: "Many news websites now make readers pay before they can read full articles, using a ___.", options: ["paywall", "watchdog", "broadsheet", "disclaimer"], correct: 0, why: "**paywall** = tường phí (Ngày 26). watchdog = cơ quan giám sát; broadsheet = báo khổ lớn, nghiêm túc; disclaimer = lời miễn trừ." },
          { q: "Some tabloids ___ ordinary events to sell more copies.", options: ["impartial", "sensationalise", "adulterate", "comply with"], correct: 1, why: "**sensationalise** = giật gân hoá (Ngày 26). impartial là tính từ (khách quan); adulterate = pha trộn (thực phẩm); comply with = tuân thủ." },
          { q: "The new results ___ what earlier studies had suggested. (AWL 7)", options: ["conformed", "confined", "converted", "confirmed"], correct: 3, why: "**confirm** = xác nhận. conform = tuân theo; confine = giới hạn; convert = chuyển đổi." },
          { q: "Fuel prices ___ wildly during the crisis, rising one week and falling the next. (AWL 8)", options: ["fluctuated", "deviated", "displaced", "terminated"], correct: 0, why: "**fluctuate** = dao động lên xuống." },
          { q: "The old software is not ___ with the new operating system. (AWL 9)", options: ["coherent", "concurrent", "compatible", "complementary"], correct: 2, why: "**compatible with** = tương thích với." },
          { q: "The project faced several setbacks; ___, it was finished on time. (AWL 10)", options: ["whereby", "nonetheless", "likewise", "albeit"], correct: 1, why: "**nonetheless** = tuy vậy, đứng sau dấu chấm phẩy. albeit đi với cụm ngắn (albeit slowly); whereby = nhờ đó; likewise = tương tự." },
          { q: "Part 1: “I'm ___ — I do my best work after midnight.”", options: ["an early bird", "a night owl", "a couch potato", "a creature of comfort"], correct: 1, why: "**a night owl** = cú đêm (Ngày 30)." },
          { q: "Câu nào đúng văn phong Task 2?", options: ["Tourism is a double-edged sword.", "Tourism is not everyone's cup of tea.", "Tourism brings a lot of stuff to local people.", "Tourism brings both considerable benefits and serious drawbacks to local communities."], correct: 3, why: "Task 2 dùng diễn đạt trang trọng; idiom và “a lot of stuff” là văn nói (Ngày 18, Ngày 30)." },
        ],
      },
      {
        t: "quiz",
        id: "t4d30-kt-tu-vung-dien",
        title: "2b. Điền MỘT từ (4 câu)",
        kind: "fill",
        items: [
          { q: "1. Undercooked chicken is a common cause of ___ illness.", answers: ["foodborne", "food-borne"] },
          { q: "2. The heavy use of antibiotics in ___ farming may contribute to drug resistance.", answers: ["intensive", "factory"] },
          { q: "3. The government plans to ___ a tax on sugary drinks. (AWL 10)", answers: ["levy", "impose"] },
          { q: "4. I'm at a loose ___ this weekend, so I'll visit my grandparents.", answers: ["end"] },
        ],
      },

      { t: "h", text: "Phần 3 — Dịch Việt → Anh (5 câu · đạt ≥ 4/5)" },
      {
        t: "quiz",
        id: "t4d30-kt-dich",
        title: "3. Dịch sang tiếng Anh",
        kind: "translate",
        grammar: "Mỗi câu dùng một cấu trúc của chặng — xem gợi ý.",
        items: [
          { q: "Điều cốt yếu là mọi nhà sản xuất thực phẩm phải ghi rõ chất phụ gia trên nhãn.", answers: ["It is essential that every food manufacturer list additives clearly on the label.", "It is essential that every food producer state additives clearly on the label.", "It is essential that every food manufacturer should list additives clearly on the label."], hint: "It is essential that + S + V nguyên mẫu (Ngày 27) · additives (Ngày 26)" },
          { q: "Dự án vốn được kỳ vọng hoàn thành trong hai năm, nhưng mãi đến năm 2024 mới xong.", answers: ["The project had been expected to be completed in two years, but it was not finished until 2024.", "The project was expected to be completed within two years, but it was not finished until 2024.", "The project had been expected to finish in two years, but it was not completed until 2024."], hint: "had been expected to · not… until (Ngày 25)" },
          { q: "Không chỉ báo lá cải giật gân hoá tin tức, mà chúng còn làm giảm lòng tin vào báo chí.", answers: ["Not only do tabloids sensationalise the news, but they also reduce trust in the press.", "Not only do tabloids sensationalise news, but they also undermine trust in the press.", "Not only do tabloids sensationalize the news, but they also reduce trust in the media.", "Not only do tabloids sensationalise the news, but they also reduce trust in the media."], hint: "Not only do + S + V… but they also… (Ngày 29 điểm 8) · tabloid, sensationalise (Ngày 26)" },
          { q: "Đã đến lúc các trường dạy học sinh cách kiểm chứng thông tin trên mạng.", answers: ["It is high time schools taught students how to check information online.", "It's high time schools taught students how to verify information online.", "It is high time that schools taught students how to fact-check information online."], hint: "It is high time + S + V2 (Ngày 27)" },
          { q: "Tôi không có tay trồng cây — đến cây xương rồng của tôi cũng chết.", answers: ["I don't have green fingers — even my cactus died.", "I don't have green fingers; even my cactus died.", "I haven't got green fingers — even my cactus died."], hint: "have green fingers (Ngày 30)" },
        ],
      },

      { t: "h", text: "Phần 4 — Nghe (6 + 4 câu · đạt ≥ 7/10 · trượt thì ôn Ngày 25, 28, 29)" },
      { t: "p", text: "**Questions 1–6.** Complete the notes below. Write **ONE WORD ONLY** for each answer." },
      {
        t: "table",
        caption: "WHY SOME TYPEFACES ARE EASIER TO READ",
        head: ["Mục", "Ghi chú"],
        rows: [
          ["Legibility", "how easily we can tell individual **(1) ___** apart"],
          ["Most confused characters", "capital I, lower-case l and the number one — dangerous on medicine **(2) ___**"],
          ["Readability", "depends more on **(3) ___** than on the letters"],
          ["Line gap", "recommended: about 1.5 × the letter **(4) ___**"],
          ["Serif vs sans serif", "evidence weak; small differences probably caused by **(5) ___**"],
          ["Dyslexia", "most helpful: larger letters and wider gaps between **(6) ___**"],
        ],
      },
      {
        t: "listen",
        id: "t4d30-kt-nghe-chu",
        title: "Part 4 extract — Why some typefaces are easier to read",
        note: "Nghe MỘT lần. Giọng Ireland.",
        dan: { so: "Day 30, Stage test, Recording 1", boiCanh: "part of a lecture in a design course about typefaces and reading.", cau: [1, 6] },
        lines: [
          { who: "Lecturer", voice: "ie-nam", text: "Today I want to look at a question that sounds trivial but has real consequences: why some typefaces are easier to read than others. Designers make a distinction here between legibility and readability. Legibility is about individual letters — how easily you can tell one from another. Readability is about long passages — whether you can read for an hour without getting tired." },
          { who: "Lecturer", voice: "ie-nam", text: "Take legibility first. The characters most often confused are a capital I, a lower-case l and the number one. In many modern typefaces they're almost identical. That matters very little in a novel, but a great deal on a medicine label, where a misread dose can be dangerous. That's why typefaces designed for hospitals give each of those characters a distinct shape." },
          { who: "Lecturer", voice: "ie-nam", text: "Readability, on the other hand, depends far more on spacing than on the letters themselves. When the gap between lines is too narrow, the eye tends to slip back to the line it has just read. Most designers recommend a gap of around one and a half times the size of the letters." },
          { who: "Lecturer", voice: "ie-nam", text: "You may have heard that serif typefaces, the ones with small strokes at the ends of the letters, are easier to read on paper. The evidence for that is surprisingly weak. Studies comparing the two styles found differences so small that they were probably caused by familiarity: people read fastest in whatever they're used to." },
          { who: "Lecturer", voice: "ie-nam", text: "Finally, there's one group for whom the choice really does make a measurable difference, and that's readers with dyslexia. What helps them most is not a special typeface, as is often claimed, but larger letters and wider spacing between words." },
        ],
      },
      {
        t: "quiz",
        id: "t4d30-kt-nghe-chu-cau",
        title: "Questions 1–6 — ONE WORD ONLY",
        kind: "fill",
        items: [
          { q: "1. tell individual ___ apart", answers: ["letters"] },
          { q: "2. dangerous on medicine ___", answers: ["labels", "label"] },
          { q: "3. readability depends more on ___", answers: ["spacing"] },
          { q: "4. about 1.5 × the letter ___", answers: ["size"] },
          { q: "5. differences probably caused by ___", answers: ["familiarity"] },
          { q: "6. wider gaps between ___", answers: ["words"] },
        ],
      },
      {
        t: "listen",
        id: "t4d30-kt-nghe-sach",
        title: "Part 3 — Planning a textbook swap shop",
        note: "Nghe MỘT lần. Hai sinh viên: giọng Úc (Ella) và giọng Mỹ (Marcus).",
        dan: { so: "Day 30, Stage test, Recording 2", boiCanh: "two students planning a textbook swap shop on their campus.", cau: [7, 10] },
        lines: [
          { who: "Ella", voice: "au-nu", text: "So, Marcus, we need to decide how the swap shop will actually work. I was thinking people bring a book and take a book — a straight exchange." },
          { who: "Marcus", voice: "us-nam", text: "That's simple, but I'm worried it'll fall apart in the first week. Most first-years don't have any books to bring yet, and they're the ones who need them most." },
          { who: "Ella", voice: "au-nu", text: "Fair point. So what if we use credits instead? You drop off a book, you get a credit, and new students get two free credits when they sign up." },
          { who: "Marcus", voice: "us-nam", text: "I like that. It means people with nothing to swap can still take part." },
          { who: "Ella", voice: "au-nu", text: "Where should we run it? The students' union has offered us the main hall." },
          { who: "Marcus", voice: "us-nam", text: "The hall's big, but it's only free on Fridays, and by then most people have already bought what they need. The library foyer is smaller, but it's open every day and everyone walks through it." },
          { who: "Ella", voice: "au-nu", text: "Let's ask for the foyer, then. Now, publicity. I'd assumed posters would be enough." },
          { who: "Marcus", voice: "us-nam", text: "Last year's book fair relied on posters and hardly anyone came. What actually worked for the film society was getting lecturers to mention it at the start of the first class." },
          { who: "Ella", voice: "au-nu", text: "And that costs nothing. OK. The last thing is what we do with books nobody takes." },
          { who: "Marcus", voice: "us-nam", text: "I'd rather not just throw them out. The charity shop on Mill Road said they'd take anything in good condition, and the rest we can recycle." },
        ],
      },
      {
        t: "mcq",
        id: "t4d30-kt-nghe-sach-cau",
        title: "Questions 7–10 — Choose the correct letter",
        items: [
          { q: "7. What problem does Marcus see with a straight exchange?", options: ["It is too complicated to organise.", "New students will have nothing to exchange.", "People will bring damaged books.", "It will take too long to set up."], correct: 1, why: "“Most first-years don't have any books to bring yet”. A ngược ý (Marcus nói nó simple)." },
          { q: "8. Why do they choose the library foyer?", options: ["It is larger than the main hall.", "The students' union recommended it.", "It is available every day and many people pass through it.", "It is free of charge."], correct: 2, why: "“open every day and everyone walks through it”. Bẫy A: hội trường mới là chỗ lớn; bẫy B: hội SV đề nghị hội trường." },
          { q: "9. Which publicity method do they decide to use?", options: ["Lecturers mentioning it in class", "Posters around campus", "Emails to all students", "A stall at the book fair"], correct: 0, why: "“What actually worked… was getting lecturers to mention it” + Ella: “that costs nothing”. Posters là ý Ella bị bác." },
          { q: "10. What will happen to books that nobody takes?", options: ["They will be sold online.", "They will be returned to their owners.", "They will be thrown away.", "Those in good condition will go to a charity shop."], correct: 3, why: "“The charity shop… said they'd take anything in good condition, and the rest we can recycle.” C bị bác: “I'd rather not just throw them out”." },
        ],
      },

      { t: "h", text: "Phần 5 — Đọc (4 + 3 + 3 câu · 15 phút · đạt ≥ 7/10 · trượt thì ôn Ngày 25, 27, 29)" },
      {
        t: "passage",
        title: "Tipping: An Old Custom Under New Pressure",
        intro: "You should spend about 15 minutes on Questions 1–10, which are based on the reading passage below.",
        paras: [
          { label: "A", text: "Few customs are as widely practised, or as poorly understood, as tipping. In the United States, a diner who leaves less than fifteen per cent of the bill may be followed to the door by an indignant waiter; in Japan, leaving money on the table can cause genuine embarrassment. Economists have long found the habit puzzling. A tip is paid after the service has been delivered, usually to someone the customer will never see again, so a purely self-interested customer would never leave one." },
          { label: "B", text: "The usual explanation is that tipping rewards good service and so motivates staff to provide it. The evidence for this is, at best, thin. When researchers compared the size of tips with customers' own ratings of the service they had received, the connection turned out to be remarkably weak: a meal rated excellent earned only slightly more than one rated average. Far better predictors of a generous tip were the size of the bill, whether the customer was a regular and, less comfortably, the server's appearance." },
          { label: "C", text: "This last finding points to a deeper problem. Because tips depend so heavily on the customer's impressions, they leave room for prejudice. Several studies have found that servers from minority groups receive smaller tips for identical service. In effect, a system that claims to reward effort may partly reward looks." },
          { label: "D", text: "Defenders of tipping argue that it allows restaurants to keep menu prices low, since part of the wage bill is paid directly by customers. This is true only in a narrow sense. The customer still pays; the cost is simply moved from the price on the menu to a decision at the end of the meal. What changes is not the total but who bears the risk: on a quiet evening, it is the waiter rather than the owner whose income falls." },
          { label: "E", text: "Some restaurants have tried to abolish tips altogether, raising prices and paying staff a higher fixed wage. The results have been mixed. Employees generally welcomed a predictable income, but several well-publicised experiments were abandoned within two years, partly because customers, comparing menus, assumed that the no-tipping restaurant was simply more expensive." },
          { label: "F", text: "None of this means that tipping is about to disappear. Customs that combine generosity, social pressure and a sense of fairness are remarkably durable. But the case for tipping as an efficient way of rewarding good work is much weaker than its supporters suppose, and a more honest description of it might be a tax on embarrassment." },
        ],
      },
      {
        t: "table",
        caption: "Questions 1–4 — Complete the summary using the list of words A–H.",
        head: ["Summary"],
        rows: [
          ["Research suggests that the size of a tip has only a weak link to the **(1) ___** of the service. Tips are better predicted by factors such as the cost of the meal and the server's **(2) ___**, which means that tipping can allow **(3) ___** to affect a worker's income. Supporters say tipping keeps prices low, but in reality it mainly changes who carries the **(4) ___**."],
          ["**A** quality · **B** appearance · **C** risk · **D** prejudice · **E** cost · **F** speed · **G** loyalty · **H** effort"],
        ],
      },
      {
        t: "quiz",
        id: "t4d30-kt-doc-tom-tat",
        title: "Questions 1–4 — ghi MỘT chữ cái (A–H)",
        kind: "fill",
        items: [
          { q: "1. weak link to the ___ of the service", answers: ["A"] },
          { q: "2. the server's ___", answers: ["B"] },
          { q: "3. tipping can allow ___ to affect income", answers: ["D"] },
          { q: "4. changes who carries the ___", answers: ["C"] },
        ],
      },
      {
        t: "mcq",
        id: "t4d30-kt-doc-ynng",
        title: "Questions 5–7 — Do the statements agree with the claims of the writer? (Yes / No / Not Given)",
        items: [
          { q: "5. A customer who acted only in their own financial interest would not leave a tip.", options: ["Yes", "No", "Not Given"], correct: 0, why: "Đoạn A: “a purely self-interested customer would never leave one”." },
          { q: "6. Restaurant staff in the United States earn more than those in Japan.", options: ["Yes", "No", "Not Given"], correct: 2, why: "Bài chỉ so phong tục tip ở hai nước, không nói gì về mức lương." },
          { q: "7. Restaurants that abolished tipping have generally succeeded.", options: ["Yes", "No", "Not Given"], correct: 1, why: "Đoạn E: “The results have been mixed… several… experiments were abandoned” ⇒ trái với “generally succeeded”." },
        ],
      },
      {
        t: "mcq",
        id: "t4d30-kt-doc-mcq",
        title: "Questions 8–10 — Choose the correct letter",
        items: [
          { q: "8. In paragraph D, the writer suggests that tipping", options: ["reduces the total amount customers pay.", "moves financial risk from owners to staff.", "makes menus easier to understand.", "increases owners' profits on quiet evenings."], correct: 1, why: "“What changes is not the total but who bears the risk: … it is the waiter rather than the owner whose income falls.” A bị bác trực tiếp (not the total)." },
          { q: "9. One reason some no-tipping experiments ended was that", options: ["staff disliked receiving a fixed wage.", "owners could not afford higher wages.", "customers thought the restaurants were more expensive.", "the law did not allow higher menu prices."], correct: 2, why: "“customers, comparing menus, assumed that the no-tipping restaurant was simply more expensive”. A ngược ý (staff welcomed a predictable income)." },
          { q: "10. What is the writer's overall view of tipping?", options: ["It is a fair way to reward hard work.", "It will soon disappear.", "It is mainly a problem in Japan.", "It is likely to last but is poorly justified as a reward for good service."], correct: 3, why: "Đoạn F: “None of this means that tipping is about to disappear” (loại B) + “the case for tipping as an efficient way of rewarding good work is much weaker than its supporters suppose”." },
        ],
      },

      { t: "h", text: "Phần 6 — Viết (5 câu + một bài Task 2 · trượt thì ôn Ngày 26, 28, 30)" },
      {
        t: "mcq",
        id: "t4d30-kt-viet-chon",
        title: "6a. Kiến thức viết band 7 (5 câu · đạt ≥ 4/5)",
        items: [
          { q: "Đề: “Why is this happening? Is it a positive or negative development?” Bài band 7 cần:", options: ["Trả lời một câu hỏi thật kỹ, câu kia nhắc qua ở kết bài", "Chỉ nêu ý kiến cá nhân", "Trả lời CẢ HAI câu hỏi, mỗi câu một thân bài, lập trường cho câu 2 rõ từ mở bài", "Liệt kê càng nhiều nguyên nhân càng tốt"], correct: 2, why: "Đề two-part: hai câu hỏi = hai vế bắt buộc (Ngày 28). Thiếu hoặc lướt một vế ⇒ TR bị giới hạn." },
          { q: "Chia 60 phút Writing thế nào là an toàn nhất?", options: ["Task 1 khoảng 18 phút (3 đọc hình · 12 viết · 3 soát), Task 2 khoảng 40 phút (5 dàn ý · 30 viết · 5 soát), 2 phút dự phòng", "Task 1 30 phút, Task 2 30 phút", "Viết Task 2 trước rồi dùng hết giờ còn lại cho Task 1", "Không cần dàn ý, viết ngay cho đủ giờ"], correct: 0, why: "Bảng 60 phút của Ngày 28 (X04). Task 2 nặng gấp đôi Task 1 — không bao giờ để Task 2 thiếu giờ; 5 phút soát Task 2 dành cho hai mã lỗi nặng nhất của bạn." },
          { q: "Câu mở đầu nào hợp một email trang trọng xin việc?", options: ["Hi! I want the job you posted.", "I am writing to apply for the position of junior web developer advertised on your website.", "Hey, saw your ad, I'm interested.", "I'm gonna apply for your job."], correct: 1, why: "Email trang trọng (Ngày 26): nêu mục đích ngay câu đầu, không viết tắt, không văn nói." },
          { q: "Khi viết lại một bài theo sổ lỗi, thứ tự đúng là:", options: ["Sửa chính tả → sửa ý → đếm lỗi", "Viết bài mới hoàn toàn", "Chỉ thêm cấu trúc khó", "Đánh mã lỗi → sửa ý (TR / CC) → sửa câu theo mã → soát 6 lượt và đếm"], correct: 3, why: "Sửa ý trước sửa câu (Ngày 30 Bài 2 mục 3)." },
          { q: "Câu Task 1 nào đúng?", options: ["Belmont's figure remained virtually unchanged at around a quarter.", "Belmont was stable at 25 percents.", "The number of cyclists in Belmont was 25%.", "Belmont remained stable, it was 25%."], correct: 0, why: "Chủ ngữ là con số (Belmont's figure); B sai percents; C number ≠ percentage; D comma splice." },
        ],
      },
      { t: "p", text: "**Task 2** (40 phút · AI chấm · đạt khi ước tính ≥ band 6.5, mục tiêu 7.0). Soát theo hai mã lỗi nặng nhất của bạn trước khi nộp." },
      {
        t: "essay",
        id: "t4d30-kt-viet-task2",
        task: "Task 2",
        prompt: "In many cities, small independent shops are being replaced by large chain stores. Why is this happening? Is this a positive or negative development? Give reasons for your answer and include any relevant examples from your own knowledge or experience. Write at least 250 words.",
        minWords: 250,
        tips: [
          "Hai câu hỏi ⇒ hai thân bài; lập trường cho câu 2 nêu ngay ở mở bài.",
          "Nguyên nhân: chuỗi nhân quả (Ngày 15) — đừng liệt kê năm nguyên nhân rời rạc.",
          "Đoạn đánh giá: nêu rồi bác (Admittedly… This, however,…) — Ngày 2, Ngày 30.",
        ],
      },

      { t: "h", text: "Phần 7 — Nói (Part 2 + 4 câu Part 3 · AI ≥ band 6.5 · trượt thì ôn Ngày 26, 27, 30)" },
      {
        t: "speak",
        id: "t4d30-kt-noi-p2",
        part: "2",
        questions: [
          "Describe a promise that you made to someone. You should say: who you made the promise to, what you promised, whether you were able to keep it, and explain how you felt about this promise.",
        ],
      },
      {
        t: "speak",
        id: "t4d30-kt-noi-p3",
        part: "3",
        questions: [
          "Why do people sometimes break their promises?",
          "Are promises made in business different from promises made between friends?",
          "To what extent should politicians be held responsible for the promises they make?",
          "Do you think written contracts will eventually replace personal trust?",
        ],
      },

      { t: "h", text: "Phần 8 — Phát âm (6 câu · đạt ≥ 5/6 · rồi đọc lại khối phát âm của ngày bị sai)" },
      {
        t: "mcq",
        id: "t4d30-kt-phat-am",
        title: "8. Chọn đáp án đúng (6 câu)",
        items: [
          { q: "Nói nhanh tự nhiên, “should have been” thường nghe như:", options: ["/ʃʊd hæv biːn/", "/ʃʊdəv bɪn/", "/ʃuːld hæv bɪn/", "/ʃʊd hæf biːn/"], correct: 1, why: "have yếu thành /əv/, been yếu thành /bɪn/ (Ngày 8, Ngày 26 — tốc độ tự nhiên)." },
          { q: "Cặp nào trọng âm DỊCH CHUYỂN khi đổi từ loại? (Ngày 28)", options: ["agree → agreement", "happy → happiness", "teach → teacher", "hierarchy → hierarchical"], correct: 3, why: "**HI**erarchy → hier**AR**chical: đuôi -ical kéo trọng âm về âm tiết ngay trước nó. Ba cặp còn lại giữ nguyên trọng âm." },
          { q: "Cặp nào CHỈ khác nhau ở độ dài nguyên âm /ɪ/ – /iː/? (Ngày 27, tự chẩn 44 âm)", options: ["live – leave", "lift – left", "bit – bat", "ship – shop"], correct: 0, why: "live /lɪv/ – leave /liːv/. Các cặp khác đổi hẳn sang nguyên âm khác." },
          { q: "“turn it off” đọc nối tự nhiên là:", options: ["/tɜːn/ — /ɪt/ — /ɒf/ (ngắt từng từ)", "/tɜːnɪt ɒf/ (chỉ nối hai từ đầu)", "/tɜːnɪtɒf/ (phụ âm cuối nối vào nguyên âm đầu từ sau)", "/tɜːn ɪt ɒfə/"], correct: 2, why: "Nối phụ âm – nguyên âm: n + it, t + off (Ngày 29 Bài 3, đọc liền hơi câu C1)." },
          { q: "“Do you mean in my country, or in general?” — ngữ điệu đúng:", options: ["Lên ở country, xuống ở general", "Xuống ở cả hai", "Lên ở cả hai", "Đều đều, không lên xuống"], correct: 0, why: "Câu hỏi lựa chọn: lên ở phương án đầu, xuống ở phương án cuối (Ngày 30 Bài 3)." },
          { q: "Trong câu mua giờ “Let me think about that for a second”, từ “for” đọc là:", options: ["/fɔː/ nhấn mạnh", "/fə/ âm yếu", "/fʊr/", "/fɒr/"], correct: 1, why: "Từ chức năng trong câu nói tự nhiên đọc yếu: for → /fə/ (Ngày 30 mục 8)." },
        ],
      },

      { t: "h", text: "Xong bài kiểm tra — bước tiếp theo" },
      {
        t: "table",
        caption: "Đọc kết quả từng phần",
        head: ["Phần trượt", "Ôn lại", "Làm lại"],
        rows: [
          ["1 · Ngữ pháp", "Ngày 25 (chuỗi thì & bị động) · Ngày 27 (giả định cách, fronting) · Ngày 29 (bảng 20 điểm)", "Phần 1 + bài dịch của nhóm sai"],
          ["2 · Từ vựng", "Ngày 26 (thực phẩm & truyền thông vòng 2) · Ngày 28 (AWL 7–10, 12 chủ đề) · Ngày 30 Bài 1", "Phần 2 + thẻ từ Tập 4"],
          ["3 · Dịch", "Ngày của cấu trúc ghi trong gợi ý câu sai", "Phần 3"],
          ["4 · Nghe", "Ngày 25 và 29 (đề 40 câu, bảng soát 2 phút) · Ngày 28 (bẫy Part 3 + 4)", "Nghe lại hai bài, mở lời thoại, shadowing"],
          ["5 · Đọc", "Ngày 25 (Summary hai kiểu) · Ngày 27 (60 phút lần 3) · Ngày 29 (thứ tự passage, luật 90 giây)", "Phần 5 trong 13 phút"],
          ["6 · Viết", "Ngày 26 (email trang trọng) · Ngày 28 (two-part, 60 phút) · Ngày 30 Bài 2", "Viết lại bài Task 2 theo quy trình 4 bản"],
          ["7 · Nói", "Ngày 26 (Part 2 trừu tượng) · Ngày 27 (tự thu 14 phút) · Ngày 30 Bài 3", "Đề 7 chế độ luyện"],
          ["8 · Phát âm", "Khối phát âm Ngày 26 · 27 · 28 · 29 · 30", "Phần 8"],
        ],
      },
      {
        t: "note",
        title: "📌 Đạt cả 8 phần ⇒ vào Đề 8",
        items: [
          "Mở **Online Test → Đề 8** (thi cuối Tập 4, band 7.0): Listening → Reading → Writing → Speaking, **chế độ thi thật**, một buổi như ngày thi.",
          "Mục tiêu của tập: Listening ≥ 30/40 · Reading ≥ 30/40 (Passage 3 ≥ 9/13) · Writing 7.0 · Speaking 7.0.",
          "Xong Đề 8, chép điểm từng kỹ năng cạnh điểm **Đề 6** (đầu tập) và **Đề 7** (giữa tập) — đó là bằng chứng bạn đã đi từ 6.0 lên 7.0.",
        ],
      },
    ],
  },
];
