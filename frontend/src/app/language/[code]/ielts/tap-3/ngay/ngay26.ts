/**
 * IELTS Tập 3 — Ngày 26 (band 5.0 → 6.0; tự soạn 18/11/2026 — mọi câu ví dụ, bài mẫu, đề, câu bài tập VIẾT MỚI)
 *   Bài 1 (vocab)    Travel & culture vòng 2: tác động của du lịch · văn hoá – phong tục · trải nghiệm chuyến đi
 *                    (45 từ) + 12 collocation Task 2 / Part 3 + travel · trip · journey · tour            [VC13]
 *                    — nối Tập 2 Ngày 14 (vòng 1)
 *   Bài 2 (writing)  Báo cáo ngắn / tóm tắt số liệu trong công việc (5 phần, có đề xuất) + ôn 7 dạng Task 1;
 *                    bài mẫu band 5 vs band 6 rồi chuyển thành báo cáo                                  [W21 E09]
 *                    — nối Tập 2 Ngày 24 (email công việc), Tập 3 Ngày 4 · 8 · 12 · 16 · 20 · 24, Tập 2 Ngày 20 · 22
 *   Bài 3 (speaking) Part 2: Describe an object / an activity vòng 2 + đề lạ (mượn khung) + Part 3 đi kèm [S05]
 *                    — nối Tập 2 Ngày 11 · 19 · 23 · 🔊 /l/ cuối (dark L)
 *   Bài tập Ngày 26  40 câu có đáp án + 1 báo cáo ngắn + 1 lượt nói
 * Mọi id bắt đầu `t3d26-`.
 */
import type { Lesson } from '../data';

export const NGAY_26: Lesson[] = [
  /* ═══════════════════════════ BÀI 1 — TỪ VỰNG ═══════════════════════════ */
  {
    id: "t3d26-tu-vung",
    kind: "vocab",
    title: "Từ vựng: Travel & culture vòng 2 — tác động của du lịch, văn hoá – phong tục, trải nghiệm chuyến đi",
    goal: "Dùng đúng 45 từ và 12 collocation về du lịch và văn hoá ở mức band 6 (mass tourism, heritage site, livelihood, etiquette, immerse yourself in, unspoilt, long-haul…) để viết Task 2 về lợi – hại của du lịch và trả lời Part 2 – Part 3 về chuyến đi, phong tục, đồ lưu niệm.",
    minutes: 80,
    blocks: [
      {
        t: "recap",
        title: "Bài này học gì · đẩy tiêu chí nào",
        items: [
          "**Ôn từ Tập 2 Ngày 14** (vòng 1): destination, itinerary, accommodation, landmark, overtourism, ecotourism, culture shock, off the beaten track, broaden one's horizons… — đủ để KỂ một chuyến đi. Hôm nay là **vòng 2**: từ để ==BÀN LUẬN== về du lịch và văn hoá.",
          "Nhóm A — **du lịch như một ngành kinh tế** và tác động của nó (15 từ): mass tourism, revenue, livelihood, heritage site, preserve, commercialise…",
          "Nhóm B — **văn hoá và phong tục** (15 từ): custom, etiquette, taboo, indigenous, stereotype, immerse, adapt, homesick…",
          "Nhóm C — **trải nghiệm chuyến đi** (15 từ): scenic, unspoilt, remote, bustling, long-haul, stopover, homestay, venture…",
          "**12 collocation** dùng thẳng cho Task 2 / Part 3 và bảng **4 từ dễ nhầm**: travel · trip · journey · tour.",
          "Đẩy **LR** band 6: “đủ rộng để bàn mọi chủ đề, dám dùng từ ít gặp”. Chiều nay bài Nói dùng lại nhóm B và C.",
        ],
      },

      { t: "h", text: "1. Nhóm A — Du lịch là một ngành kinh tế: lợi và hại (15 từ)" },
      {
        t: "p",
        text: "Đề Task 2 về du lịch gần như luôn xoay quanh một câu hỏi: du lịch đem **tiền và việc làm**, nhưng gây hại cho **môi trường và văn hoá địa phương** — bên nào nặng hơn? 15 từ dưới đây chia đúng theo hai phía đó.",
      },
      {
        t: "vocab",
        items: [
          { w: "mass tourism", pos: "n", ipa: "/ˌmæs ˈtʊərɪzəm/", vi: "du lịch đại trà (rất đông người, giá rẻ)", ex: "Mass tourism has transformed quiet fishing villages into busy resorts.", exVi: "Du lịch đại trà đã biến những làng chài yên tĩnh thành khu nghỉ dưỡng đông đúc.", more: "the growth / rise of mass tourism · trái nghĩa: small-scale / sustainable tourism" },
          { w: "sustainable", pos: "adj", ipa: "/səˈsteɪnəbl/", vi: "bền vững", ex: "Sustainable tourism limits visitor numbers to protect the environment.", exVi: "Du lịch bền vững giới hạn lượng khách để bảo vệ môi trường.", more: "sustain (v) → sustainable (adj) → sustainability (n) · sustainable tourism / development" },
          { w: "revenue", pos: "n", ipa: "/ˈrevənjuː/", vi: "doanh thu, nguồn thu", ex: "Tourism revenue pays for the upkeep of the old town.", exVi: "Nguồn thu từ du lịch chi trả cho việc bảo trì khu phố cổ.", more: "generate / bring in revenue · tourism revenue · a source of revenue (AWL)" },
          { w: "livelihood", pos: "n", ipa: "/ˈlaɪvlihʊd/", vi: "kế sinh nhai", ex: "Thousands of families depend on tourism for their livelihood.", exVi: "Hàng nghìn gia đình sống nhờ vào du lịch.", more: "earn a livelihood · lose one's livelihood · threaten local livelihoods" },
          { w: "seasonal", pos: "adj", ipa: "/ˈsiːzənl/", vi: "theo mùa, thời vụ", ex: "Most jobs in the resort are seasonal and poorly paid.", exVi: "Phần lớn việc làm ở khu nghỉ dưỡng là thời vụ và lương thấp.", more: "seasonal work / workers / demand · nối với peak season (Tập 2 Ngày 14)" },
          { w: "heritage site", pos: "n", ipa: "/ˈherɪtɪdʒ saɪt/", vi: "di sản (địa điểm được công nhận)", ex: "The old town was listed as a World Heritage Site in 1999.", exVi: "Khu phố cổ được ghi danh Di sản Thế giới năm 1999.", more: "cultural / natural heritage · a World Heritage Site · protect our heritage" },
          { w: "preserve", pos: "v", ipa: "/prɪˈzɜːv/", vi: "gìn giữ, bảo tồn (giữ nguyên trạng)", ex: "Entrance fees help to preserve ancient temples.", exVi: "Tiền vé giúp bảo tồn các ngôi đền cổ.", more: "preserve → preservation (n) · preserve traditions / buildings / a way of life" },
          { w: "restore", pos: "v", ipa: "/rɪˈstɔː/", vi: "trùng tu, phục hồi", ex: "The palace was carefully restored after the fire.", exVi: "Cung điện được trùng tu cẩn thận sau vụ cháy.", more: "restore → restoration (n) · preserve = giữ cho khỏi hỏng; restore = sửa cho trở lại như cũ" },
          { w: "conservation", pos: "n", ipa: "/ˌkɒnsəˈveɪʃn/", vi: "sự bảo tồn (thiên nhiên, di tích)", ex: "Part of every ticket goes towards wildlife conservation.", exVi: "Một phần tiền mỗi vé được dành cho bảo tồn động vật hoang dã.", more: "conserve (v) · a conservation area / project · nature conservation" },
          { w: "commercialise", pos: "v", ipa: "/kəˈmɜːʃəlaɪz/", vi: "thương mại hoá", ex: "Critics say the festival has become too commercialised.", exVi: "Giới phê bình cho rằng lễ hội đã bị thương mại hoá quá mức.", more: "commercial (adj) → commercialise (v) → commercialisation (n) · thường dùng bị động: be / become commercialised" },
          { w: "exploit", pos: "v", ipa: "/ɪkˈsplɔɪt/", vi: "khai thác; bóc lột", ex: "Some tour companies exploit local workers by paying very low wages.", exVi: "Một số công ty du lịch bóc lột lao động địa phương bằng mức lương rất thấp.", more: "exploit → exploitation (n) · exploit natural resources (khai thác) · exploit workers (bóc lột) — AWL" },
          { w: "overcrowded", pos: "adj", ipa: "/ˌəʊvəˈkraʊdɪd/", vi: "quá đông, quá tải", ex: "In August the beaches are so overcrowded that locals stay away.", exVi: "Tháng Tám bãi biển đông đến mức dân địa phương tránh xa.", more: "overcrowding (n) · overcrowded streets / trains / sites" },
          { w: "tourist trap", pos: "n", ipa: "/ˈtʊərɪst træp/", vi: "điểm “bẫy” du khách (đông, đắt, kém chất lượng)", ex: "The market near the port is a real tourist trap.", exVi: "Cái chợ gần cảng đúng là chỗ chặt chém du khách.", more: "avoid the tourist traps · văn nói; trong Task 2 viết: over-priced tourist areas" },
          { w: "entrance fee", pos: "n", ipa: "/ˈentrəns fiː/", vi: "phí vào cửa", ex: "The city plans to charge day visitors an entrance fee.", exVi: "Thành phố dự định thu phí vào cửa với khách tham quan trong ngày.", more: "charge / pay an entrance fee · = admission fee · a tourist tax (thuế du lịch)" },
          { w: "displace", pos: "v", ipa: "/dɪsˈpleɪs/", vi: "đẩy (người dân) khỏi nơi ở", ex: "Rising rents have displaced many long-term residents from the old quarter.", exVi: "Tiền thuê tăng đã đẩy nhiều cư dân lâu năm khỏi khu phố cổ.", more: "be displaced by + N · displacement (n) — AWL sublist 8, nhưng đề du lịch rất hay cần" },
        ],
      },
      {
        t: "sodo",
        kind: "compare",
        title: "Hai phía của một đề Task 2 về du lịch",
        caption: "Mỗi phía 4 ý — chọn 2 ý cho mỗi thân bài.",
        cols: [
          { title: "Lợi (benefits)", items: ["**generates revenue** for the local economy", "**creates jobs** — dù nhiều việc **seasonal**", "tiền vé giúp **preserve / restore** di tích", "người dân và du khách hiểu nhau hơn"] },
          { title: "Hại (drawbacks)", items: ["sites become **overcrowded**; **mass tourism** damages nature", "traditions are **commercialised**", "rents rise and residents are **displaced**", "workers are **exploited**; lợi nhuận chảy về công ty nước ngoài"] },
        ],
      },

      { t: "h", text: "2. Nhóm B — Văn hoá và phong tục (15 từ)" },
      {
        t: "vocab",
        items: [
          { w: "custom", pos: "n", ipa: "/ˈkʌstəm/", vi: "phong tục", ex: "It is a custom to take off your shoes before entering a home.", exVi: "Cởi giày trước khi vào nhà là một phong tục.", more: "local customs · respect / follow a custom · lưu ý: customs (luôn số nhiều) còn có nghĩa “hải quan” — go through customs" },
          { w: "ritual", pos: "n", ipa: "/ˈrɪtʃuəl/", vi: "nghi lễ, nghi thức", ex: "The tea ceremony is a ritual that takes years to master.", exVi: "Trà đạo là một nghi thức phải mất nhiều năm mới thành thạo.", more: "a religious ritual · perform a ritual · custom = thói quen chung của cộng đồng; ritual = chuỗi hành động có thứ tự cố định" },
          { w: "etiquette", pos: "n", ipa: "/ˈetɪket/", vi: "phép lịch sự, quy tắc ứng xử", ex: "Visitors should learn basic table etiquette before they travel.", exVi: "Du khách nên học phép lịch sự cơ bản trên bàn ăn trước khi đi.", more: "table / business / social etiquette · không đếm được: ~~an etiquette~~" },
          { w: "taboo", pos: "n / adj", ipa: "/təˈbuː/", vi: "điều cấm kỵ", ex: "Talking about money is taboo in some cultures.", exVi: "Nói chuyện tiền bạc là điều cấm kỵ ở một số nền văn hoá.", more: "a cultural taboo · break a taboo · a taboo subject" },
          { w: "indigenous", pos: "adj", ipa: "/ɪnˈdɪdʒənəs/", vi: "bản địa", ex: "The museum displays crafts made by indigenous communities.", exVi: "Bảo tàng trưng bày đồ thủ công của các cộng đồng bản địa.", more: "indigenous people / culture / language · gần nghĩa: native, local" },
          { w: "handicraft", pos: "n", ipa: "/ˈhændikrɑːft/", vi: "đồ thủ công mỹ nghệ", ex: "Selling handicrafts gives village women an independent income.", exVi: "Bán đồ thủ công giúp phụ nữ trong làng có thu nhập riêng.", more: "traditional handicrafts · a handicraft village · handmade (adj)" },
          { w: "diversity", pos: "n", ipa: "/daɪˈvɜːsəti/", vi: "sự đa dạng", ex: "Tourism can help to protect cultural diversity.", exVi: "Du lịch có thể giúp bảo vệ sự đa dạng văn hoá.", more: "diverse (adj) → diversity (n) · cultural / ethnic diversity (AWL sublist 6)" },
          { w: "multicultural", pos: "adj", ipa: "/ˌmʌltiˈkʌltʃərəl/", vi: "đa văn hoá", ex: "London is one of the most multicultural cities in the world.", exVi: "London là một trong những thành phố đa văn hoá nhất thế giới.", more: "a multicultural society / city / team" },
          { w: "stereotype", pos: "n", ipa: "/ˈsteriətaɪp/", vi: "định kiến rập khuôn", ex: "Travel often breaks down the stereotypes we have about other nations.", exVi: "Đi nhiều thường phá vỡ những định kiến ta có về các dân tộc khác.", more: "a national / gender stereotype · break down / reinforce stereotypes" },
          { w: "open-minded", pos: "adj", ipa: "/ˌəʊpən ˈmaɪndɪd/", vi: "cởi mở, sẵn sàng đón nhận cái mới", ex: "Living abroad made me far more open-minded.", exVi: "Sống ở nước ngoài khiến tôi cởi mở hơn nhiều.", more: "trái nghĩa: narrow-minded · open-minded about / towards + N" },
          { w: "respectful", pos: "adj", ipa: "/rɪˈspektfl/", vi: "tôn trọng, lễ độ", ex: "Tourists should be respectful of local traditions.", exVi: "Du khách nên tôn trọng truyền thống địa phương.", more: "respectful **of** + N · dễ nhầm: respectable (đáng kính) · respective (tương ứng)" },
          { w: "immerse", pos: "v", ipa: "/ɪˈmɜːs/", vi: "đắm mình, hoà mình vào", ex: "The best way to learn a language is to immerse yourself in the culture.", exVi: "Cách tốt nhất để học một ngôn ngữ là hoà mình vào văn hoá đó.", more: "immerse yourself **in** + N · immersion (n) · an immersive experience" },
          { w: "adapt", pos: "v", ipa: "/əˈdæpt/", vi: "thích nghi", ex: "It took me months to adapt to the food and the climate.", exVi: "Tôi mất nhiều tháng để thích nghi với đồ ăn và khí hậu.", more: "adapt **to** + N · adaptable (adj) · dễ nhầm: adopt (nhận nuôi; áp dụng)" },
          { w: "homesick", pos: "adj", ipa: "/ˈhəʊmsɪk/", vi: "nhớ nhà", ex: "I felt homesick during my first winter abroad.", exVi: "Tôi thấy nhớ nhà trong mùa đông đầu tiên ở nước ngoài.", more: "feel / get homesick · homesickness (n)" },
          { w: "language barrier", pos: "n", ipa: "/ˈlæŋɡwɪdʒ ˌbæriə/", vi: "rào cản ngôn ngữ", ex: "The language barrier made it hard to ask for directions.", exVi: "Rào cản ngôn ngữ khiến việc hỏi đường rất khó.", more: "overcome / break down the language barrier" },
        ],
      },
      {
        t: "note",
        title: "⚠️ Hay nhầm trong nhóm B",
        items: [
          "**culture** không đếm được khi nói chung (learn about Japanese culture); đếm được khi nói về các nền văn hoá khác nhau (different cultures). ~~learn a new culture~~ → learn **about** a new culture.",
          "**custom** (phong tục) ≠ **costume** /ˈkɒstjuːm/ (trang phục): traditional customs ≠ traditional costumes.",
          "**adapt to** (thích nghi) ≠ **adopt** (tiếp nhận, áp dụng): Immigrants **adapt to** a new culture; they may **adopt** some local customs.",
          "**respectful of** local customs — không phải ~~respectful with~~ hay ~~respectable to~~.",
        ],
      },

      { t: "h", text: "3. Nhóm C — Trải nghiệm chuyến đi (15 từ)" },
      {
        t: "vocab",
        items: [
          { w: "scenic", pos: "adj", ipa: "/ˈsiːnɪk/", vi: "có cảnh đẹp (nói về đường đi, vùng đất)", ex: "We took the scenic route along the coast.", exVi: "Chúng tôi đi con đường ngắm cảnh dọc bờ biển.", more: "scenery (n, không đếm được) → scenic (adj) · a scenic route / view / area" },
          { w: "picturesque", pos: "adj", ipa: "/ˌpɪktʃəˈresk/", vi: "đẹp như tranh (làng, phố cổ)", ex: "We stayed in a picturesque village in the hills.", exVi: "Chúng tôi ở một ngôi làng đẹp như tranh trên đồi.", more: "a picturesque village / harbour / town · thay cho “very beautiful”" },
          { w: "breathtaking", pos: "adj", ipa: "/ˈbreθteɪkɪŋ/", vi: "đẹp đến nghẹt thở", ex: "The view from the top was absolutely breathtaking.", exVi: "Cảnh nhìn từ đỉnh núi đẹp đến nghẹt thở.", more: "tính từ mức mạnh ⇒ đi với absolutely, không đi với very" },
          { w: "unspoilt", pos: "adj", ipa: "/ˌʌnˈspɔɪlt/", vi: "còn nguyên sơ, chưa bị tàn phá", ex: "The island still has miles of unspoilt beaches.", exVi: "Hòn đảo vẫn còn hàng dặm bãi biển nguyên sơ.", more: "unspoilt countryside / beaches · (Mỹ: unspoiled) · trái nghĩa: spoilt by tourism" },
          { w: "remote", pos: "adj", ipa: "/rɪˈməʊt/", vi: "xa xôi, hẻo lánh", ex: "The temple is in a remote mountain area with no public transport.", exVi: "Ngôi đền nằm ở vùng núi hẻo lánh, không có phương tiện công cộng.", more: "a remote village / area / island · remote from + N" },
          { w: "bustling", pos: "adj", ipa: "/ˈbʌslɪŋ/", vi: "nhộn nhịp, tấp nập", ex: "The night market is bustling with tourists and street vendors.", exVi: "Chợ đêm tấp nập du khách và người bán hàng rong.", more: "bustling **with** + N · a bustling market / city — nghĩa tích cực, khác overcrowded" },
          { w: "long-haul", pos: "adj", ipa: "/ˌlɒŋ ˈhɔːl/", vi: "đường dài (chuyến bay)", ex: "Long-haul flights produce a large share of tourism's carbon emissions.", exVi: "Các chuyến bay đường dài tạo ra phần lớn khí thải carbon của ngành du lịch.", more: "a long-haul flight · trái nghĩa: short-haul" },
          { w: "stopover", pos: "n", ipa: "/ˈstɒpəʊvə/", vi: "chặng dừng, quá cảnh (ở lại ngắn)", ex: "We had a two-day stopover in Singapore on the way to Sydney.", exVi: "Chúng tôi dừng hai ngày ở Singapore trên đường đi Sydney.", more: "a stopover in + nơi · gần nghĩa: layover (Mỹ, vài giờ)" },
          { w: "budget airline", pos: "n", ipa: "/ˈbʌdʒɪt ˌeəlaɪn/", vi: "hãng hàng không giá rẻ", ex: "Budget airlines have made weekend trips abroad affordable.", exVi: "Hàng không giá rẻ đã khiến những chuyến đi nước ngoài cuối tuần trở nên vừa túi tiền.", more: "= low-cost airline · a budget hotel / traveller · on a tight budget" },
          { w: "homestay", pos: "n", ipa: "/ˈhəʊmsteɪ/", vi: "ở nhà dân", ex: "A homestay lets you see how local people really live.", exVi: "Ở nhà dân cho bạn thấy người địa phương thật sự sống thế nào.", more: "stay in / book a homestay · host family (gia đình chủ nhà)" },
          { w: "guided tour", pos: "n", ipa: "/ˌɡaɪdɪd ˈtʊə/", vi: "chuyến tham quan có hướng dẫn viên", ex: "We joined a guided tour of the old citadel.", exVi: "Chúng tôi tham gia chuyến tham quan thành cổ có hướng dẫn viên.", more: "go on / join a guided tour **of** + nơi · a self-guided tour · a tour guide" },
          { w: "venture", pos: "v", ipa: "/ˈventʃə/", vi: "mạo hiểm đi (tới nơi lạ)", ex: "Few tourists venture beyond the main square.", exVi: "Ít du khách dám đi xa hơn quảng trường chính.", more: "venture into / beyond / out · thay cho “go” khi muốn nói có chút mạo hiểm" },
          { w: "wander", pos: "v", ipa: "/ˈwɒndə/", vi: "đi lang thang, dạo không mục đích", ex: "I love wandering around the back streets with no map.", exVi: "Tôi thích lang thang quanh các con phố nhỏ mà không cần bản đồ.", more: "wander around / through + nơi · dễ nhầm: wonder /ˈwʌndə/ (tự hỏi)" },
          { w: "memorable", pos: "adj", ipa: "/ˈmemərəbl/", vi: "đáng nhớ", ex: "The most memorable part of the trip was the boat ride at dawn.", exVi: "Phần đáng nhớ nhất của chuyến đi là chuyến thuyền lúc bình minh.", more: "a memorable trip / experience / moment · memory (n) → memorable (adj)" },
          { w: "keepsake", pos: "n", ipa: "/ˈkiːpseɪk/", vi: "vật kỷ niệm (giữ vì tình cảm)", ex: "I kept the train ticket as a keepsake.", exVi: "Tôi giữ tấm vé tàu làm kỷ niệm.", more: "souvenir = mua ở điểm du lịch; keepsake = bất cứ vật gì giữ để nhớ một người / một dịp — dùng cho bài Nói chiều nay" },
        ],
      },

      { t: "h", text: "4. Bốn từ dễ nhầm: travel · trip · journey · tour" },
      {
        t: "table",
        head: ["Từ", "Loại từ · nghĩa", "Đúng", "Sai"],
        rows: [
          ["**travel**", "động từ; danh từ KHÔNG đếm được = việc đi lại nói chung", "Air travel is getting cheaper. · I love travelling.", "~~I had a great travel.~~ · ~~a travel to Japan~~"],
          ["**trip**", "danh từ đếm được = chuyến đi (đi rồi về)", "a business trip · go on a trip **to** Hue", "~~go for a trip~~ (go **on** a trip)"],
          ["**journey**", "danh từ đếm được = quãng đường di chuyển từ A tới B", "The journey took six hours.", "~~a journey to Japan for a week~~ (cả chuyến đi – về ⇒ a trip)"],
          ["**tour**", "chuyến đi qua nhiều điểm theo lịch, thường có hướng dẫn", "a guided tour **of** the palace", "~~a guided tour to the palace~~ (tham quan BÊN TRONG ⇒ of)"],
          ["**voyage**", "chuyến đi dài bằng tàu biển / tàu vũ trụ", "the ship's first voyage", "~~a voyage by bus~~"],
        ],
      },
      { t: "rule", formula: "go on a trip to + nơi · the journey takes + thời gian · a guided tour of + nơi · travel (không a)", vi: "trip = cả chuyến; journey = quãng đường; tour = đi nhiều điểm; travel = việc đi lại nói chung, không đếm được." },

      { t: "h", text: "5. 12 collocation cho Task 2 và Part 3" },
      {
        t: "table",
        head: ["Collocation", "Nghĩa", "Câu dùng được ngay"],
        rows: [
          ["**boost** the local economy", "thúc đẩy kinh tế địa phương", "Tourism boosts the local economy by creating demand for hotels and restaurants."],
          ["**generate** income / revenue", "tạo ra thu nhập / nguồn thu", "Even a small museum can generate income for the whole village."],
          ["**create** employment opportunities", "tạo cơ hội việc làm", "The new airport created employment opportunities for young people."],
          ["**attract** visitors", "thu hút du khách", "The festival attracts visitors from all over the country."],
          ["**preserve** cultural heritage", "gìn giữ di sản văn hoá", "Ticket sales provide the money needed to preserve cultural heritage."],
          ["**respect** local customs", "tôn trọng phong tục địa phương", "Tourists who respect local customs are usually made welcome."],
          ["**gain** a deeper understanding **of**", "hiểu sâu hơn về", "By staying with a host family, I gained a deeper understanding of rural life."],
          ["**experience** a different way of life", "trải nghiệm một lối sống khác", "Travel lets young people experience a different way of life."],
          ["**put a strain on** (resources)", "gây sức ép lên", "Millions of visitors put a strain on water supplies."],
          ["**pose a threat to**", "là mối đe doạ cho", "Unregulated building poses a threat to the coastline."],
          ["**strike a balance between** A **and** B", "tìm điểm cân bằng giữa", "Governments must strike a balance between economic growth and conservation."],
          ["**at the expense of**", "đánh đổi bằng, gây hại cho", "Profits should not be made at the expense of local residents."],
        ],
        caption: "Học cả cụm, không học từng từ. Tập 2 Ngày 14 đã có “put pressure on”; hôm nay thêm “put a strain on”.",
      },
      {
        t: "note",
        title: "Mẹo dùng — nối với ngữ pháp Ngày 25 (cụm danh từ)",
        items: [
          "Đổi collocation động từ thành cụm danh từ để mở câu: tourism **boosts** the economy → **the boost to** the local economy · they **preserve** heritage → **the preservation of** cultural heritage.",
          "Câu Task 2 band 6: “**The growth of mass tourism** has **put a strain on** local resources, and **this pressure** is felt most by long-term residents.”",
          "Part 3: đừng nhồi quá ba collocation trong một câu trả lời. Một cụm đúng chỗ + một ví dụ thật ăn điểm hơn năm cụm đọc thuộc.",
        ],
      },

      { t: "h", text: "6. Luyện tập" },
      {
        t: "quiz",
        id: "t3d26-tv-dien",
        kind: "fill",
        title: "Điền từ đúng (chữ cái đầu cho sẵn) — 10 câu",
        items: [
          { q: "Tourism is the island's main source of r______; without it, the hospitals could not be funded.", answers: ["revenue"] },
          { q: "Fishing is no longer a secure l______ for families on this coast.", answers: ["livelihood"] },
          { q: "The temple was badly damaged in the earthquake and took ten years to r______.", answers: ["restore"] },
          { q: "Many people complain that the New Year festival has been c______ and lost its meaning.", answers: ["commercialised", "commercialized"] },
          { q: "Pointing at people with your finger is t______ in some cultures.", answers: ["taboo"] },
          { q: "She spent a year in Seoul to i______ herself in Korean culture.", answers: ["immerse"] },
          { q: "The village is so r______ that it can only be reached on foot.", answers: ["remote"] },
          { q: "We broke the l______-haul flight with a stopover in Dubai.", answers: ["long"] },
          { q: "The island is famous for its u______ beaches and clear water.", answers: ["unspoilt", "unspoiled"] },
          { q: "It took him a while to a______ to the cold weather in Canada.", answers: ["adapt", "adjust"] },
        ],
      },
      {
        t: "mcq",
        id: "t3d26-tv-chon",
        title: "Chọn từ / cụm đúng — 8 câu",
        items: [
          { q: "The ______ from Hanoi to Sa Pa takes about six hours by coach.", options: ["travel", "journey", "tour", "voyage"], correct: 1, why: "Quãng đường di chuyển A → B kèm thời gian ⇒ journey." },
          { q: "Visitors should be respectful ______ local traditions.", options: ["with", "to", "of", "for"], correct: 2, why: "respectful of + N." },
          { q: "Governments need to ______ a balance between development and conservation.", options: ["strike", "make", "do", "hit"], correct: 0, why: "Collocation cố định: strike a balance between A and B." },
          { q: "Cheap flights have encouraged ______, which damages fragile sites.", options: ["tourism mass", "massive tourist", "mass tourist", "mass tourism"], correct: 3, why: "mass tourism = du lịch đại trà (danh từ ghép)." },
          { q: "Economic growth should not come ______ the environment.", options: ["on the cost of", "at the expense of", "in the price of", "for the expense to"], correct: 1, why: "at the expense of = đánh đổi bằng." },
          { q: "The market was ______ with shoppers buying gifts for the holiday.", options: ["remote", "unspoilt", "bustling", "scenic"], correct: 2, why: "bustling with + N: tấp nập (nghĩa tích cực)." },
          { q: "Millions of visitors put a ______ on the city's water supply.", options: ["strain", "threat", "damage", "burden up"], correct: 0, why: "put a strain on = gây sức ép lên. (pose a threat to; cause damage to)" },
          { q: "I'd love to go ______ a trip to Japan next spring.", options: ["for", "in", "to", "on"], correct: 3, why: "go on a trip / a tour / holiday." },
        ],
      },
      {
        t: "quiz",
        id: "t3d26-tv-dich",
        kind: "translate",
        title: "Dịch sang tiếng Anh — dùng collocation trong ngoặc (5 câu)",
        grammar: "collocation động từ + danh từ",
        items: [
          { q: "Du lịch tạo cơ hội việc làm cho giới trẻ. (create employment opportunities)", answers: ["Tourism creates employment opportunities for young people.", "Tourism creates employment opportunities for the young."], hint: "creates employment opportunities for" },
          { q: "Du khách nên tôn trọng phong tục địa phương. (respect local customs)", answers: ["Tourists should respect local customs.", "Visitors should respect local customs.", "Travellers should respect local customs."], hint: "should respect local customs" },
          { q: "Du lịch đại trà là mối đe doạ cho các bãi biển nguyên sơ. (pose a threat to)", answers: ["Mass tourism poses a threat to unspoilt beaches.", "Mass tourism poses a threat to unspoiled beaches."], hint: "poses a threat to unspoilt beaches" },
          { q: "Ở nhà dân giúp tôi hiểu sâu hơn về văn hoá bản địa. (gain a deeper understanding of)", answers: ["Staying in a homestay helped me gain a deeper understanding of the local culture.", "Staying in a homestay helped me to gain a deeper understanding of the local culture.", "Staying in a homestay helped me gain a deeper understanding of local culture.", "Staying in a homestay helped me gain a deeper understanding of indigenous culture.", "A homestay helped me gain a deeper understanding of the local culture."], hint: "Staying in a homestay helped me gain…" },
          { q: "Tiền vé vào cửa giúp gìn giữ di sản văn hoá. (preserve cultural heritage)", answers: ["Entrance fees help to preserve cultural heritage.", "Entrance fees help preserve cultural heritage.", "Entrance fees help to preserve the cultural heritage.", "Entrance fees help preserve the cultural heritage."], hint: "Entrance fees help (to) preserve" },
        ],
      },
      {
        t: "note",
        title: "Cách học 45 từ này trong 3 ngày",
        items: [
          "Hôm nay: bấm **Che nghĩa** ở từng khối từ, tự nói nghĩa; rồi **Che từ**, tự nói từ. Đánh dấu từ sai vào Flashcards (bộ “Từ của khoá — Tập 3”).",
          "Ngày mai: viết 5 câu Task 2 về du lịch, mỗi câu một collocation ở mục 5.",
          "Ngày kia: nói 2 phút “một chuyến đi đáng nhớ”, cố dùng 6 từ nhóm C. Ghi âm ở bài Nói hôm nay.",
        ],
      },
    ],
  },
  /* ═══════════════════════════ BÀI 2 — VIẾT ═══════════════════════════ */
  {
    id: "t3d26-viet",
    kind: "writing",
    title: "Viết: Báo cáo ngắn / tóm tắt số liệu trong công việc + ôn 7 dạng Task 1",
    goal: "Viết được một báo cáo số liệu ngắn dùng trong công việc (tiêu đề – mục đích – phát hiện chính – chi tiết – đề xuất) từ chính kỹ năng Task 1, và nhìn một đề Task 1 bất kỳ trong 7 dạng là biết ngay overview phải nói gì, dùng thì nào, khung câu nào.",
    minutes: 85,
    blocks: [
      {
        t: "recap",
        title: "Bài này học gì · đẩy tiêu chí nào",
        items: [
          "**Task 1 chính là một bản báo cáo số liệu.** Kỹ năng bạn luyện từ Ngày 4 — chọn điểm nổi bật, nói tổng quan trước, nhóm số liệu — là thứ người đi làm dùng mỗi tuần. Hôm nay mang nó ra **công việc thật** (E09).",
          "**Báo cáo ngắn 5 phần**: tiêu đề (To / From / Date / Subject) → mục đích → ==phát hiện chính (= overview)== → chi tiết → đề xuất. Chỉ phần cuối là KHÁC Task 1.",
          "Ranh giới phải nhớ: báo cáo công việc **có** nguyên nhân + đề xuất; Task 1 **cấm** cả hai. Lẫn lộn là mất điểm TA.",
          "**Ôn 7 dạng Task 1** trên một bảng: line (Ngày 8) · bar (Ngày 12) · pie (Ngày 16) · table (Ngày 20) · mixed (Ngày 24) · process và map (Tập 2 Ngày 20 · 22; nâng band 6 ở Ngày 28).",
          "Một đề, **bài band 5 và band 6 đặt cạnh nhau** + bảng so 4 tiêu chí; rồi biến bài band 6 thành báo cáo gửi sếp.",
          "Đẩy **TA** (overview đúng loại theo từng dạng) và **CC** (thông tin quan trọng nhất đứng trước).",
        ],
      },

      /* ── 1 ── */
      { t: "h", text: "1. Task 1 và báo cáo công việc — giống 80%, khác 20%" },
      {
        t: "p",
        text: "Hãy hình dung bạn làm ở nhóm dữ liệu của một công ty du lịch. Trưởng phòng kinh doanh nhắn: “Em gửi chị tóm tắt số đặt tour theo kênh năm nay nhé.” Chị ấy có **hai phút** để đọc. Chị không cần mọi con số — chị cần biết **chuyện gì đang xảy ra** và **nên làm gì**. Đó đúng là cách giám khảo đọc Task 1, chỉ thêm một bước cuối.",
      },
      {
        t: "table",
        head: ["", "IELTS Task 1", "Báo cáo ngắn trong công việc"],
        rows: [
          ["Người đọc", "giám khảo — chấm xem bạn chọn và so sánh có đúng không", "sếp / đồng nghiệp — cần ra quyết định"],
          ["Mở đầu", "1 câu paraphrase đề", "To / From / Date / Subject + 1 câu mục đích"],
          ["Ý chính đứng đâu", "overview ngay sau mở bài", "Key findings ngay sau mục đích — nói kết luận TRƯỚC"],
          ["Chi tiết", "2 thân bài, chọn số, có so sánh", "như Task 1; được dùng gạch đầu dòng và tiêu đề mục"],
          ["Nguyên nhân", "✗ **không** — hình không cho biết", "✓ được nêu, nhưng phải nói rõ đó là phỏng đoán (may be due to…)"],
          ["Đề xuất", "✗ **không**", "✓ **bắt buộc** — 1 đến 3 đề xuất cụ thể"],
          ["Văn phong", "trang trọng, không I / we", "trang trọng vừa; được dùng we recommend"],
          ["Độ dài", "≥ 150 từ, khoảng 170–190", "150–250 từ; ngắn mà đủ là tốt"],
        ],
      },
      {
        t: "note",
        title: "⚠️ Cẩn thận: đừng mang thói quen báo cáo vào phòng thi",
        items: [
          "Trong Task 1 **không** viết: “This is because people prefer smartphones” · “The company should improve its app” · “In my opinion…”. Giám khảo coi đó là thông tin ngoài hình ⇒ trừ TA.",
          "Trong Task 1 **không** dùng gạch đầu dòng, tiêu đề mục, To / From. Viết thành đoạn văn liền.",
          "Ngược lại, ở công ty mà bạn chỉ tả số rồi dừng thì sếp sẽ hỏi: “Vậy thì sao?”. Báo cáo phải trả lời câu đó.",
        ],
      },

      /* ── 2 ── */
      { t: "h", text: "2. Khung báo cáo ngắn 5 phần và câu khung từng phần" },
      {
        t: "sodo",
        kind: "flow",
        title: "Báo cáo số liệu ngắn — 5 phần",
        caption: "Phần ③ viết sau cùng nhưng đặt gần đầu: người bận chỉ đọc tới đó.",
        steps: [
          { label: "① Tiêu đề", sub: "To · From · Date · Subject" },
          { label: "② Mục đích", sub: "This report summarises…" },
          { label: "③ Phát hiện chính", sub: "= overview: 2 điểm, ít số" },
          { label: "④ Chi tiết", sub: "số liệu chọn lọc, có so sánh" },
          { label: "⑤ Đề xuất", sub: "It is recommended that…" },
        ],
      },
      {
        t: "patterns",
        rows: [
          {
            formula: "This report summarises / presents + N + and + V …",
            vi: "Câu mục đích: báo cáo về cái gì, giai đoạn nào, để làm gì.",
            examples: [
              { en: "This report summarises bookings by sales channel in 2025 and recommends priorities for next year.", vi: "Báo cáo này tóm tắt lượng đặt chỗ theo kênh bán năm 2025 và đề xuất ưu tiên cho năm tới." },
              { en: "The purpose of this report is to compare visitor numbers at our three sites.", vi: "Mục đích của báo cáo là so sánh lượng khách ở ba điểm của chúng ta." },
            ],
          },
          {
            formula: "The main finding is that + S + V … · Overall, + S + V",
            vi: "Phát hiện chính — đúng kiểu overview: xu hướng lớn + thay đổi thứ hạng.",
            examples: [
              { en: "The main finding is that the mobile app has replaced the website as our largest channel.", vi: "Phát hiện chính là ứng dụng di động đã thay trang web làm kênh lớn nhất." },
            ],
          },
          {
            formula: "This may be due to + N · This is likely to reflect + N",
            vi: "Nêu nguyên nhân có mức độ (chỉ trong báo cáo công việc, KHÔNG trong Task 1).",
            examples: [
              { en: "This may be due to the launch of the new app in March.", vi: "Điều này có thể do việc ra mắt ứng dụng mới hồi tháng Ba." },
            ],
          },
          {
            formula: "It is recommended that + S + (should) + V · We recommend + V-ing",
            vi: "Đề xuất: trang trọng, cụ thể, làm được.",
            examples: [
              { en: "It is recommended that the marketing budget should be moved from phone sales to the app.", vi: "Đề xuất chuyển ngân sách tiếp thị từ bán hàng qua điện thoại sang ứng dụng." },
              { en: "We recommend reviewing the figures again after the first quarter.", vi: "Chúng tôi đề xuất xem lại số liệu sau quý một." },
            ],
          },
        ],
      },
      {
        t: "note",
        title: "⚠️ Hay sai ở câu đề xuất",
        items: [
          "~~It is recommended to the company improve the app.~~ → It is recommended **that the company (should) improve** the app.",
          "~~We recommend to move the budget.~~ → We recommend **moving** the budget. (recommend / suggest + V-ing, không + to V)",
          "~~I think you must close the phone line.~~ — quá trực tiếp với cấp trên → **It may be worth considering** closing the phone line.",
          "Đề xuất chung chung (“The company should try harder”) vô dụng. Mỗi đề xuất phải nối với **một con số** trong phần chi tiết.",
        ],
      },
      { t: "rule", formula: "Subject → This report summarises … → The main finding is that … → [số liệu chọn lọc] → It is recommended that + S + (should) + V", vi: "Báo cáo ngắn = Task 1 + tiêu đề + đề xuất; kết luận đứng trước chi tiết." },

      /* ── 3 ── */
      { t: "h", text: "3. Đề mẫu — phân tích và lập dàn ý" },
      {
        t: "p",
        text: "**Đề (dạng Task 1):** The bar chart shows the number of bookings (in thousands) received by a travel company through three channels in each quarter of 2025. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
      },
      {
        t: "chart",
        kind: "bar",
        title: "Bookings received by a travel company, by channel, 2025 (thousands)",
        unit: "thousand bookings",
        labels: ["Q1", "Q2", "Q3", "Q4"],
        series: [
          { name: "Mobile app", values: [12, 18, 27, 31] },
          { name: "Website", values: [30, 28, 26, 22] },
          { name: "Phone / in person", values: [14, 11, 8, 6] },
        ],
      },
      {
        t: "table",
        head: ["Bước", "Hỏi gì", "Trả lời cho đề này"],
        rows: [
          ["① Dạng nào?", "có thời gian hay không?", "Bar chart **có thời gian** (4 quý) ⇒ viết như line graph: xu hướng + quá khứ đơn"],
          ["② Đếm vế đề", "mấy nhóm · mấy mốc · đơn vị", "3 kênh × 4 quý = 12 số; đơn vị: nghìn lượt đặt"],
          ["③ Overview — 4 câu hỏi (Ngày 4)", "chiều chung? ai nhất? đổi ngôi? ngoại lệ?", "app **tăng mạnh**, hai kênh kia **giảm**; app **vượt** website từ Q3"],
          ["④ Tự tính (Ngày 20)", "tổng, bội số", "Tổng: 56 · 57 · 61 · 59 ⇒ gần như **không đổi**; phone giảm hơn một nửa; website gấp 2,5 lần app ở Q1"],
          ["⑤ Chia thân bài", "theo câu chuyện", "Thân 1: app ↔ website (đổi ngôi) · Thân 2: phone + tổng"],
          ["⑥ Chọn số", "đầu – cuối – điểm cắt", "12 → 31 · 30 → 22 · điểm cắt Q3 (27 và 26) · 14 → 6 · tổng xấp xỉ 60"],
        ],
      },

      /* ── 4 ── */
      { t: "h", text: "4. Hai bài mẫu đặt cạnh nhau: band 5 và band 6" },
      {
        t: "sodo",
        kind: "compare",
        title: "Cùng một biểu đồ — hai bài",
        caption: "Band ước tính theo bảng mô tả công khai. Bài band 5 giữ nguyên lỗi để bạn soi.",
        cols: [
          {
            title: "Bài band 5 (ước tính) — 121 từ",
            items: [
              "The chart show the bookings of a travel company in 2025. There are three channel: mobile app, website and phone.",
              "In quarter 1, mobile app is 12 thousand, website is 30 thousand and phone is 14 thousand. In quarter 2, mobile app increase to 18 thousand, website decrease to 28 thousand and phone decrease to 11 thousand. In quarter 3, mobile app is 27, website is 26 and phone is 8. In quarter 4, mobile app increase to 31 thousand, website is 22 thousand and phone is 6 thousand.",
              "In conclusion, mobile app is increase and website and phone is decrease. I think it is because people like to use the smartphone more than computer. The company should make the app better.",
            ],
          },
          {
            title: "Bài band 6 (ước tính) — 187 từ",
            items: [
              "The bar chart compares the number of bookings that a travel company received through three channels — its mobile app, its website and by phone or in person — in each quarter of 2025.",
              "Overall, bookings made on the app rose sharply, whereas those made through the other two channels declined. As a result, the app replaced the website as the company's main source of bookings in the second half of the year.",
              "In the first quarter, the website was by far the most popular channel, with 30,000 bookings, two and a half times the figure for the app (12,000). However, app bookings then climbed steadily, overtaking the website in the third quarter (27,000 against 26,000) and reaching 31,000 by the end of the year. Over the same period, there was a gradual fall in website bookings to 22,000.",
              "Bookings by phone or in person were the lowest throughout. They stood at 14,000 in the first quarter and more than halved to only 6,000 in the fourth. Despite these changes, the total number of bookings remained fairly stable at just under 60,000 in most quarters.",
            ],
          },
        ],
      },
      {
        t: "table",
        head: ["Tiêu chí", "Bài band 5", "Bài band 6"],
        rows: [
          ["**TA** — trả lời đề", "Chép **cả 12 số** theo từng quý (máy móc); không có overview — câu “In conclusion” chỉ nói tăng / giảm, không nói đổi ngôi; **có nguyên nhân + lời khuyên** (ngoài hình); 121 từ — **thiếu từ**", "Overview rõ 2 điểm (hướng đi + đổi ngôi), không số; chọn khoảng 9 số then chốt; có so sánh (two and a half times · more than halved); tự tính tổng; không ý kiến"],
          ["**CC** — mạch lạc", "Chia theo quý ⇒ người đọc phải tự ráp xu hướng; từ nối chỉ có In quarter… / In conclusion", "Chia theo **câu chuyện** (app ↔ website; phone + tổng); However · Over the same period · Despite these changes; “those” thay cho bookings"],
          ["**LR** — từ vựng", "increase / decrease / is lặp 10 lần; “mobile app is 12 thousand” (app không phải con số)", "climbed steadily · overtaking · by far the most popular · stood at · remained fairly stable · main source of"],
          ["**GRA** — ngữ pháp", "Sai thì (hiện tại cho năm đã qua); the chart show · three channel · is increase; toàn câu đơn", "Quá khứ đơn nhất quán; mệnh đề quan hệ, whereas, V-ing (overtaking… and reaching…), danh hoá (a gradual fall in — Ngày 25)"],
        ],
      },
      {
        t: "note",
        title: "Ba chỗ sửa đưa bài band 5 lên band 6 nhanh nhất",
        items: [
          "**Xoá** hai câu cuối (nguyên nhân + lời khuyên), **thêm** một đoạn Overall hai câu ngay sau mở bài.",
          "Đổi trục kể: không đi theo quý, mà đi theo **kênh** — mỗi kênh chỉ cần số đầu, số cuối, và chỗ đổi ngôi.",
          "Sửa chủ ngữ: không phải “mobile app is 12 thousand” mà “**bookings made on** the app **stood at** 12,000”.",
        ],
      },

      /* ── 5 ── */
      { t: "h", text: "5. Từ bài Task 1 thành báo cáo gửi sếp" },
      {
        t: "p",
        text: "Giữ nguyên số liệu và cách chọn số của bài band 6. Thêm tiêu đề, rút mở bài thành câu mục đích, đổi “Overall” thành “Key findings”, và thêm phần đề xuất. Đây là bản bạn có thể gửi thật.",
      },
      {
        t: "table",
        head: ["Phần", "Nội dung báo cáo"],
        rows: [
          ["Tiêu đề", "**To:** Ms Tran Thu Ha, Head of Sales · **From:** Nguyen Minh, Data Team · **Date:** 12 January 2026 · **Subject:** Bookings by sales channel, 2025"],
          ["Purpose", "This report summarises the bookings received through our three sales channels in 2025 and recommends priorities for the coming year."],
          ["Key findings", "The mobile app has replaced the website as our largest channel, while phone and in-person bookings have fallen by more than half. Total bookings, however, have hardly changed."],
          ["Details", "App bookings rose in every quarter, from 12,000 in Q1 to 31,000 in Q4, and overtook the website in Q3. Over the same period, website bookings declined gradually from 30,000 to 22,000, and bookings by phone or in person dropped from 14,000 to 6,000. The quarterly total remained between 56,000 and 61,000, which suggests that customers are changing channel rather than increasing in number. The growth of the app may be due to the redesign launched in March."],
          ["Recommendations", "It is recommended that (1) part of the marketing budget should be moved from the phone team to the app; (2) the website booking page should be reviewed, since it is still our second-largest channel; and (3) these figures should be checked again after Q1 2026."],
        ],
        caption: "178 từ. Chú ý: mỗi đề xuất bám vào một con số ở phần Details.",
      },
      {
        t: "table",
        head: ["Câu trong bài Task 1", "Câu trong báo cáo", "Đổi gì"],
        rows: [
          ["The bar chart compares the number of bookings…", "This report summarises the bookings received through our three sales channels…", "chủ ngữ: chart → report; thêm our"],
          ["Overall, bookings made on the app rose sharply…", "The mobile app **has replaced** the website as our largest channel…", "hiện tại hoàn thành: kết quả còn đúng tới bây giờ"],
          ["the total… remained fairly stable", "…which **suggests that** customers are changing channel rather than increasing in number", "thêm DIỄN GIẢI — Task 1 không được làm"],
          ["(không có)", "It is recommended that… should be moved…", "thêm đề xuất, dùng bị động cho khách quan"],
        ],
      },
      { t: "rule", formula: "S + V2 (số liệu) + , which suggests that + S + V  ·  This may be due to + N  ·  It is recommended that + S + should be + V3", vi: "Ba khung chỉ dùng trong báo cáo công việc: diễn giải, nguyên nhân có mức độ, đề xuất bị động." },

      /* ── 6 ── */
      { t: "h", text: "6. Ôn 7 dạng Task 1 — một bảng để nhìn trước khi thi" },
      {
        t: "p",
        text: "Sai lầm lớn nhất ở band 5 là viết **một kiểu overview cho mọi dạng** (“Overall, the figures increased”). Mỗi dạng có loại thông tin riêng phải nêu trong overview. Bảng dưới gom lại những gì bạn đã học ở Tập 3 và hai dạng còn chờ nâng cấp.",
      },
      {
        t: "table",
        head: ["Dạng", "Học ở", "Overview phải nói", "Thì", "Khung câu chủ lực"],
        rows: [
          ["① **Line graph**", "Ngày 4 · **8**", "hướng đi chung + đường nào cao nhất / đổi ngôi; có Total thì nói Total trước", "quá khứ đơn; năm dự báo: is projected to", "A overtook B in… · started at…, peaked at…, before ending at… · with the most dramatic rise being seen in…"],
          ["② **Bar chart**", "Ngày 4 · **12**", "có thời gian ⇒ như line; không thời gian ⇒ nhóm cao nhất / thấp nhất + khác biệt lớn nhất", "theo năm của đề; không năm ⇒ hiện tại đơn", "… was twice as high as… · its counterpart · by contrast · the figure for…"],
          ["③ **Pie chart**", "**Ngày 16**", "phần lớn nhất + sự dịch chuyển tỉ trọng (ai lên, ai xuống)", "theo năm của đề", "The share of… rose from x% to y% · accounted for · N1 overtook N2 · percentage points"],
          ["④ **Table**", "**Ngày 20**", "Total trước; hàng / cột cao nhất – thấp nhất; không số", "theo năm của đề", "In total,… · accounted for a third of the total · three times as many… as…"],
          ["⑤ **Mixed charts**", "**Ngày 24**", "mỗi hình **một ý** — 2 câu hoặc 1 câu ghép", "mỗi hình chọn thì riêng", "The bar chart shows…, while the pie chart illustrates… · Turning to the second chart,…"],
          ["⑥ **Process**", "Tập 2 Ngày 20 → Ngày 28", "**số bước** + điểm đầu – điểm cuối; tự nhiên hay nhân tạo; có vòng lặp không", "hiện tại đơn, **bị động**", "The process consists of… stages, beginning with… and ending with… · Once… has been…, it is…"],
          ["⑦ **Map**", "Tập 2 Ngày 22 → Ngày 28", "thay đổi lớn nhất về **tính chất** (nông thôn → đô thị; thêm nhà, mất cây)", "quá khứ đơn / hiện tại hoàn thành, bị động", "… was replaced by… · … was built to the north of… · the area became far more developed"],
        ],
      },
      {
        t: "table",
        head: ["Hình trông thế nào", "Câu hỏi đầu tiên", "Nếu CÓ", "Nếu KHÔNG"],
        rows: [
          ["Line · bar · table · pie", "Có **trục thời gian** (≥ 2 mốc) không?", "viết **xu hướng**: rose · fell · overtook; chia thân bài theo nhóm cùng chiều", "viết **so sánh**: higher than · twice as · the largest; chia theo nhóm cao / thấp"],
          ["Hình nào cũng vậy", "Có **Total** không?", "đọc trước, đưa vào overview, không coi là một hạng mục", "tự cộng nhẩm nếu có ích (như đề mẫu hôm nay)"],
          ["Có năm sau năm hiện tại", "Có **dự báo** không?", "is projected / expected / forecast to + V", "quá khứ đơn suốt bài"],
          ["Process · map", "Có **số liệu** không?", "(hiếm) nêu như chi tiết", "không tìm số; tìm **thứ tự** (process) hoặc **vị trí + thay đổi** (map)"],
        ],
      },
      {
        t: "note",
        title: "Cái gì dùng chung cho cả 7 dạng",
        items: [
          "**4 đoạn**: mở bài (paraphrase đề) → overview → thân 1 → thân 2. Overview có thể đặt cuối, nhưng đặt thứ hai an toàn hơn: hết giờ vẫn đã có.",
          "**Overview không số**, không lý do, nói về cả hình. Thiếu overview ⇒ TA khó vượt band 5.",
          "**Không ý kiến, không nguyên nhân, không đề xuất** — khác với báo cáo công việc ở mục 5.",
          "**≥ 150 từ**, viết trong 20 phút: 3 phút đọc hình + dàn ý, 14 phút viết, 3 phút soát.",
        ],
      },
      { t: "rule", formula: "Có thời gian ⇒ overview = hướng đi + đổi ngôi  ·  Không thời gian ⇒ cao nhất – thấp nhất + khác biệt  ·  Process ⇒ số bước, đầu – cuối  ·  Map ⇒ thay đổi lớn nhất  ·  Mixed ⇒ mỗi hình một ý", vi: "Nhìn dạng đề để biết overview cần LOẠI thông tin nào." },

      /* ── 7 ── */
      { t: "h", text: "7. Luyện nhận dạng: ba hình, ba kiểu overview" },
      {
        t: "p",
        text: "Với mỗi hình dưới đây, tự viết overview hai câu ra giấy trong 2 phút rồi mới làm câu trắc nghiệm tương ứng ở khối bên dưới.",
      },
      {
        t: "figure",
        fig: {
          kind: "pie",
          title: "Hình 1 — Reasons for travel among international visitors to Country Z, 2024 (%)",
          note: "Số liệu tự đặt cho bài luyện.",
          slices: [
            { label: "Holiday", value: 52 },
            { label: "Visiting family and friends", value: 21 },
            { label: "Business", value: 15 },
            { label: "Study", value: 8 },
            { label: "Other", value: 4 },
          ],
        },
      },
      {
        t: "figure",
        fig: {
          kind: "table",
          title: "Hình 2 — Visitors to four museums in one city, 2014 and 2024 (thousands)",
          note: "Số liệu tự đặt cho bài luyện.",
          unit: "thousand visitors",
          categories: ["2014", "2024"],
          series: [
            { name: "History Museum", values: [420, 390] },
            { name: "Science Centre", values: [260, 610] },
            { name: "Art Gallery", values: [310, 330] },
            { name: "Maritime Museum", values: [150, 90] },
            { name: "Total", values: [1140, 1420] },
          ],
        },
      },
      {
        t: "figure",
        fig: {
          kind: "process",
          title: "Hình 3 — How ceramic souvenirs are made in a craft village",
          note: "Quy trình giản lược cho bài luyện.",
          steps: [
            { label: "Clay is dug", note: "from the riverbank" },
            { label: "Clay is mixed with water", note: "and left for two days" },
            { label: "Shaped on a wheel", note: "by hand" },
            { label: "Dried in the sun", note: "3–4 days" },
            { label: "Fired in a kiln", note: "1,200°C" },
            { label: "Painted and glazed" },
            { label: "Fired again and packed", note: "ready for sale" },
          ],
        },
      },
      {
        t: "mcq",
        id: "t3d26-viet-overview",
        title: "Chọn overview TỐT NHẤT — 7 câu (3 hình trên + 4 đề tả bằng lời)",
        items: [
          { q: "Hình 1 (một pie, một năm). Overview nào tốt nhất?", options: ["Overall, the number of holiday visitors increased during the period.", "Overall, holidays were by far the most common reason for visiting, accounting for more than all other purposes combined, while study and other reasons made up only a small minority.", "Overall, 52% travelled for a holiday, 21% to visit family, 15% for business, 8% for study and 4% for other reasons.", "Overall, I believe most people visit Country Z because of its beaches."], correct: 1, why: "Một pie một năm ⇒ không có xu hướng (loại A); overview không chép số (loại C); không ý kiến (loại D). B nêu phần lớn nhất + phần nhỏ nhất và một phép so sánh." },
          { q: "Hình 2 (bảng có Total, hai năm). Overview nào tốt nhất?", options: ["Overall, total visitor numbers rose, driven almost entirely by the Science Centre, which went from third to first place, whereas the other museums changed little or lost visitors.", "Overall, the History Museum was the most popular museum in both years.", "Overall, the Total was the highest category in both years.", "Overall, all four museums became more popular over the decade."], correct: 0, why: "Có Total ⇒ nói Total trước + thành phần gây ra (Ngày 20). B sai (2024 Science Centre dẫn đầu); C coi Total là hạng mục; D sai (History và Maritime giảm)." },
          { q: "Hình 3 (process). Overview nào tốt nhất?", options: ["Overall, the clay is dug from the riverbank and then mixed with water.", "Overall, making ceramics is a difficult job that needs skilful workers.", "Overall, the temperature of the kiln is 1,200°C and drying takes three to four days.", "Overall, the process consists of seven stages, beginning with the digging of clay and ending with finished souvenirs being packed for sale, and the items are fired twice."], correct: 3, why: "Process ⇒ số bước + đầu – cuối + đặc điểm đáng chú ý (nung hai lần). A chỉ là bước 1–2; B là ý kiến; C là chi tiết." },
          { q: "Đề: line graph, 3 đường, 2000–2020 thật + 2030 dự báo. Thân bài nên chia thế nào?", options: ["Mỗi đường một đoạn, mỗi đoạn kể đủ từng năm", "Một đoạn cho mọi thứ", "Đoạn 1: phần đã qua (quá khứ đơn) · Đoạn 2: phần dự báo (is projected to…)", "Đoạn 1: số lớn · Đoạn 2: số nhỏ, không cần để ý thì"], correct: 2, why: "Ngày 8: có năm dự báo ⇒ chia quá khứ / tương lai, đổi thì theo mốc." },
          { q: "Đề: bar chart KHÔNG có thời gian — tỉ lệ người dùng 5 loại phương tiện ở 2 thành phố. Động từ chính nên là:", options: ["rose · fell · peaked", "was higher than · was twice as… as · the most common", "is projected to rise", "has been built · was replaced"], correct: 1, why: "Không có thời gian ⇒ ngôn ngữ SO SÁNH, không có ngôn ngữ xu hướng." },
          { q: "Đề: một bar chart (lượng mưa) + một pie (cách dùng nước) — mixed. Overview nên:", options: ["chỉ nói về bar chart vì nó nhiều số hơn", "tìm một xu hướng chung cho cả hai hình", "bỏ overview vì hai hình không liên quan", "mỗi hình một ý, nối bằng while / In addition"], correct: 3, why: "Ngày 24: mixed ⇒ overview mỗi hình một ý; mỗi khổ thân bài một hình." },
          { q: "Đề: hai bản đồ một ngôi làng năm 1995 và hiện nay. Overview nào tốt nhất?", options: ["Overall, the village has become considerably more developed, with farmland giving way to housing and new transport links.", "Overall, a supermarket was built to the north of the river.", "Overall, there are two maps and they are different.", "Overall, the village is better now because people have more shops."], correct: 0, why: "Map ⇒ thay đổi lớn nhất về tính chất. B là một chi tiết; C rỗng; D là ý kiến." },
        ],
      },
      {
        t: "quiz",
        id: "t3d26-viet-khung",
        kind: "fill",
        title: "Điền MỘT từ vào khung câu của từng dạng (8 câu)",
        items: [
          { q: "(line) Bus use fell steadily and was ______ by cycling in 2015.", answers: ["overtaken"], hint: "bị vượt" },
          { q: "(line, dự báo) The figure is ______ to reach 40 million by 2035.", answers: ["projected", "expected", "forecast", "predicted"] },
          { q: "(pie) Housing ______ for a third of total spending.", answers: ["accounted"] },
          { q: "(pie) The ______ of services rose from 40% to 55%.", answers: ["share", "proportion", "percentage"] },
          { q: "(table) In ______, 1.4 million people visited the four museums in 2024.", answers: ["total"] },
          { q: "(process) The process ______ of seven stages, beginning with the digging of clay.", answers: ["consists"] },
          { q: "(map) The farmland was ______ by a housing estate.", answers: ["replaced"] },
          { q: "(mixed) ______ to the pie chart, agriculture used the most water.", answers: ["Turning", "Moving"] },
        ],
      },

      /* ── 8 ── */
      { t: "h", text: "8. Lỗi mất điểm + bảng tự soát 2 phút cho mọi dạng" },
      {
        t: "table",
        head: ["Soát", "Câu hỏi", "Sửa nếu “không”"],
        rows: [
          ["① Overview", "Có đoạn Overall không? Có đúng LOẠI thông tin của dạng này không? Có lỡ ghi số không?", "viết lại theo bảng mục 6"],
          ["② Ngoài hình", "Có câu nào nêu lý do, ý kiến, lời khuyên không?", "xoá (trừ khi đang viết báo cáo công việc)"],
          ["③ Thì", "Năm đã qua = quá khứ? Không năm = hiện tại? Dự báo = is projected to? Process = bị động hiện tại?", "sửa cả đoạn cho nhất quán"],
          ["④ Chủ ngữ", "Chủ ngữ có phải là con số / tỉ trọng không? (the number of… · the share of… · bookings…)", "~~The app was 12,000~~ → App bookings stood at 12,000"],
          ["⑤ Số liệu", "Đơn vị đúng chưa (thousand · % · million không -s)? Có chép sai số nào không?", "đối chiếu từng số với hình"],
          ["⑥ Danh từ chính ↔ động từ", "The number of… **has / was**; The figures… **were**", "sửa -s (Ngày 25)"],
        ],
      },
      {
        t: "note",
        title: "⚠️ Bốn lỗi mất điểm hay gặp khi lẫn dạng",
        items: [
          "Dùng ngôn ngữ xu hướng cho hình **không có thời gian**: ~~Japan increased to 40%~~ (so giữa các nước) → Japan had the highest figure, at 40%.",
          "Tả **từng bước** của process trong overview, hoặc tả **từng toà nhà** của map trong overview.",
          "Mixed charts: cố **so số** của hình này với số của hình kia khi khác đơn vị (Ngày 20 · 24).",
          "Viết kết luận kiểu Task 2 (“In conclusion, I think…”). Task 1 không có kết luận ý kiến.",
        ],
      },

      /* ── 9 ── */
      { t: "h", text: "9. Tự viết — AI chấm 4 tiêu chí" },
      {
        t: "p",
        text: "**Bài A (20 phút)** — Task 1 đúng kiểu thi. **Bài B (15 phút)** — biến chính bài A thành báo cáo gửi cấp trên: thêm tiêu đề, phát hiện chính, hai đề xuất. Viết A trước; đừng mang phần đề xuất của B ngược vào A.",
      },
      {
        t: "chart",
        kind: "bar",
        title: "International visitor arrivals to three regions of a country, 2015, 2020 and 2025 (millions)",
        unit: "million visitors",
        labels: ["2015", "2020", "2025"],
        series: [
          { name: "Coast", values: [4.2, 3.1, 6.0] },
          { name: "Capital city", values: [3.5, 1.8, 3.9] },
          { name: "Mountains", values: [1.1, 1.4, 2.9] },
        ],
      },
      {
        t: "essay",
        id: "t3d26-viet-bai",
        task: "Task 1",
        prompt: "The bar chart shows the number of international visitor arrivals (in millions) to three regions of a country in 2015, 2020 and 2025. Coast: 4.2, 3.1, 6.0. Capital city: 3.5, 1.8, 3.9. Mountains: 1.1, 1.4, 2.9. Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.",
        minWords: 150,
        tips: [
          "Có thời gian ⇒ viết xu hướng. Overview 2 ý: cả ba vùng năm 2025 đều cao hơn 2015; vùng núi là vùng DUY NHẤT tăng liên tục (không giảm năm 2020) dù vẫn thấp nhất.",
          "Thân 1: Coast + Capital (cùng giảm 2020 rồi hồi phục; thủ đô giảm gần một nửa). Thân 2: Mountains (tăng gần gấp ba).",
          "Không nêu lý do (dịch bệnh, chính sách…) — hình không cho biết. Dùng 2 cụm danh hoá: a sharp fall in… · a strong recovery.",
        ],
      },
      {
        t: "essay",
        id: "t3d26-viet-bao-cao",
        task: "Task 1",
        prompt: "You work for the national tourism office. Using the same figures (international arrivals in millions — Coast: 4.2, 3.1, 6.0; Capital city: 3.5, 1.8, 3.9; Mountains: 1.1, 1.4, 2.9 in 2015, 2020 and 2025), write a short report for your manager. Include: a heading (To / From / Date / Subject), the purpose of the report, the key findings, the main details, and two recommendations. Write 150–220 words.",
        minWords: 150,
        tips: [
          "Key findings đặt ngay sau câu mục đích: nói kết luận trước, số liệu sau.",
          "Được nêu nguyên nhân có mức độ: This may be due to… · This is likely to reflect….",
          "Hai đề xuất, mỗi đề xuất bám một con số: It is recommended that + S + should + V. Ví dụ: đầu tư hạ tầng vùng núi vì lượng khách gần gấp ba.",
          "⚠️ Ô chấm dùng **tiêu chí Task 1** (TA · CC · LR · GRA) vì chưa có bộ tiêu chí riêng cho báo cáo công việc. Tiêu đề, nguyên nhân và đề xuất là yêu cầu RIÊNG của báo cáo — nếu AI trừ điểm TA vì “thông tin ngoài hình” thì bỏ qua lời trừ đó; tự soát phần còn lại theo khung 5 phần ở mục 2.",
        ],
      },
    ],
  },
  /* ═══════════════════════════ BÀI 3 — NÓI ═══════════════════════════ */
  {
    id: "t3d26-noi",
    kind: "speaking",
    title: "Nói: Part 2 — Describe an object / an activity vòng 2 + đề lạ (mượn khung)",
    goal: "Nói trọn 2 phút ở mức band 6 về một đồ vật hoặc một hoạt động — có chi tiết, có câu chuyện, có ý nghĩa — và khi gặp thẻ đề lạ thì trong 1 phút ghi chú biết mượn khung của loại đề gần nhất cùng một câu chuyện có sẵn để nói tiếp không ngập ngừng.",
    minutes: 65,
    blocks: [
      {
        t: "recap",
        title: "Bài này học gì · đẩy tiêu chí nào",
        items: [
          "**Ôn từ Tập 2 Ngày 11** (đồ vật): It's made of… · It's about the size of… · I've had it for… · It was given to me by… — và **Tập 2 Ngày 19** (hoạt động): thói quen → lúc bắt đầu → đã bao lâu → vì sao thích.",
          "Band 5 dừng ở **tả**. Band 6 thêm bốn thứ: ==chi tiết cụ thể · câu chuyện có trước – sau · một câu giả định · ý nghĩa==. Mỗi thứ kéo dài bài nói thêm 20–30 giây.",
          "**Đề lạ** (ôn từ Tập 2 Ngày 23): không có đề nào thật sự mới — đọc **động từ và danh từ chính** của thẻ, xếp nó vào một trong 6 loại đã học, mượn khung loại đó và một chuyện trong **kho câu chuyện gốc** (mỗi loại một chuyện — Tập 2 Ngày 23).",
          "Dùng lại từ sáng nay: keepsake, handicraft, homestay, memorable, picturesque, immerse yourself in, wander, language barrier.",
          "Đẩy **FC** (nói dài sẵn lòng, không cạn ý ở giây 60) và **LR** (từ cụ thể thay cho nice / good / beautiful).",
          "🔊 **/l/ cuối — dark L**: people, local, travel, beautiful. Người Việt hay nuốt mất hoặc đọc thành /n/, /w/.",
        ],
      },

      /* ── 1 ── */
      { t: "h", text: "1. Từ band 5 lên band 6: bốn nâng cấp cho đề đồ vật và hoạt động" },
      {
        t: "table",
        head: ["Nâng cấp", "Band 5 nói", "Band 6 nói", "Ngữ pháp / từ dùng"],
        rows: [
          ["① Chi tiết cụ thể", "It is small and brown. It is very beautiful.", "It's a small clay teapot, about the size of my fist, with a tiny crack near the handle.", "cụm danh từ (Ngày 25); tính từ cụ thể"],
          ["② Câu chuyện trước – sau", "I bought it in Hoi An.", "I'd been wandering around the old town for hours when I came across a tiny workshop.", "quá khứ hoàn thành (tiếp diễn) + when"],
          ["③ Một câu giả định", "(không có)", "If I lost it, I'd be really upset, because it couldn't be replaced.", "điều kiện loại 2 (Ngày 15)"],
          ["④ Ý nghĩa", "I like it very much.", "What makes it special is that it reminds me of the first trip I ever paid for myself.", "What… is (that)… · remind me of"],
        ],
      },
      {
        t: "patterns",
        rows: [
          {
            formula: "It's a + adj + chất liệu + N, about the size of + N, with + chi tiết",
            vi: "Một câu tả gói: là gì, to cỡ nào, có gì đáng chú ý.",
            examples: [
              { en: "It's a hand-woven cotton scarf, about a metre long, with a red pattern along the edges.", vi: "Đó là một chiếc khăn cotton dệt tay, dài khoảng một mét, có hoa văn đỏ dọc viền." },
            ],
          },
          {
            formula: "I'd been + V-ing + (for…) + when + S + V2",
            vi: "Mở chuyện: đang làm gì thì gặp / thấy / được tặng.",
            examples: [
              { en: "I'd been looking for a gift for my mum when the owner showed me this one.", vi: "Tôi đang tìm quà cho mẹ thì chủ tiệm cho tôi xem cái này." },
            ],
          },
          {
            formula: "What I like most about it is (that) + S + V · What makes it special is + N",
            vi: "Câu nhấn để vào phần “explain why” — ăn điểm GRA mà dễ nói.",
            examples: [
              { en: "What I like most about it is that no two pieces are exactly the same.", vi: "Điều tôi thích nhất là không có hai món nào giống hệt nhau." },
            ],
          },
          {
            formula: "If I + V2 …, I'd + V · I wouldn't + V + it for anything",
            vi: "Một câu giả định trước khi kết — cho thấy món đồ / hoạt động quan trọng thế nào.",
            examples: [
              { en: "I wouldn't sell it for anything, even if someone offered me ten times the price.", vi: "Tôi sẽ không bán nó với bất cứ giá nào, kể cả có người trả gấp mười." },
            ],
          },
        ],
      },
      { t: "rule", formula: "Là gì + tả 1 câu gói → I'd been V-ing when… (chuyện) → dùng nó thế nào / bây giờ ở đâu → What makes it special is… → If I lost it, I'd…", vi: "Khung band 6 cho đề đồ vật: tả – chuyện – hiện tại – ý nghĩa – giả định." },

      /* ── 2 ── */
      { t: "h", text: "2. Đề đồ vật vòng 2 — ghi chú 1 phút và hai bài nói" },
      {
        t: "table",
        head: ["Thẻ đề"],
        rows: [
          ["**Describe something you bought or were given on a trip that is important to you.**"],
          ["You should say:"],
          ["• what it is and what it looks like"],
          ["• where and how you got it"],
          ["• what you do with it now"],
          ["and explain why it is important to you."],
        ],
      },
      {
        t: "sodo",
        kind: "mindmap",
        title: "Ghi chú 1 phút — chỉ ghi TỪ KHOÁ, không viết câu",
        caption: "Mỗi nhánh nói 25–30 giây. Nhánh nào cạn ý thì nhảy sang nhánh sau, đừng im.",
        center: "clay teapot — Bat Trang",
        branches: [
          { label: "① Looks", items: ["small · brown clay", "size of fist", "crack near handle"] },
          { label: "② How I got it", items: ["2 yrs ago · day trip", "wandering → workshop", "old potter · made in front of me"] },
          { label: "③ Now", items: ["desk · green tea", "while coding"] },
          { label: "④ Why", items: ["first trip I paid for", "handmade ≠ factory", "If lost → can't replace"] },
        ],
      },
      {
        t: "dialogue",
        title: "Bài nói band 5 (ước tính) — khoảng 50 giây",
        lines: [
          { who: "Candidate", role: "candidate", text: "I want to talk about a teapot. I bought it in Bat Trang. It is a village near Hanoi. It is small and brown and it is very beautiful. I go there with my friends two years ago. We see many shop and I buy this teapot. It is cheap. Now I use it to drink tea every day. I like it very much because it is beautiful and it is a souvenir. And… I think it is important to me. Yes. That's all.", vi: "Tôi muốn nói về một cái ấm trà. Tôi mua nó ở Bát Tràng… (bài ngắn, lặp “beautiful”, sai thì, hết ý sau 50 giây)." },
        ],
      },
      {
        t: "dialogue",
        title: "Bài nói band 6 (ước tính) — khoảng 2 phút",
        lines: [
          { who: "Candidate", role: "candidate", text: "I'd like to talk about a small teapot that I bought about two years ago in Bat Trang, which is a pottery village just outside Hanoi.", vi: "Tôi muốn nói về một chiếc ấm trà nhỏ tôi mua khoảng hai năm trước ở Bát Tràng, một làng gốm ngay ngoại thành Hà Nội." },
          { who: "Candidate", role: "candidate", text: "It's a plain brown clay teapot, about the size of my fist, with no decoration at all. To be honest, it isn't perfect — there's a tiny crack near the handle — but that's part of the reason I like it.", vi: "Đó là một chiếc ấm đất nâu trơn, to cỡ nắm tay tôi, không trang trí gì. Thật ra nó không hoàn hảo — có một vết nứt nhỏ gần quai — nhưng đó là một phần lý do tôi thích nó." },
          { who: "Candidate", role: "candidate", text: "As for how I got it, I'd gone there on a day trip with two classmates. We'd been wandering around the main market for a couple of hours, and frankly it felt like a bit of a tourist trap. Then we came across a tiny workshop in a back street, where an old potter was shaping teapots by hand. He let me watch him finish this one, and I bought it on the spot.", vi: "Về chuyện tôi có nó thế nào: tôi đi chơi trong ngày với hai bạn cùng lớp. Bọn tôi lang thang ở chợ chính vài tiếng, và thật lòng thì thấy hơi giống chỗ bẫy du khách. Rồi bọn tôi tình cờ gặp một xưởng nhỏ trong ngõ, nơi một ông thợ gốm già đang nặn ấm bằng tay. Ông cho tôi xem ông làm xong chiếc này, và tôi mua luôn tại chỗ." },
          { who: "Candidate", role: "candidate", text: "These days it sits on my desk, and I make green tea in it most evenings while I'm coding. It only holds enough for two small cups, which is actually perfect, because it forces me to take a break.", vi: "Giờ nó nằm trên bàn tôi, và hầu như tối nào tôi cũng pha trà xanh bằng nó khi đang viết code. Nó chỉ đủ hai chén nhỏ, mà thế lại hay, vì buộc tôi phải nghỉ giải lao." },
          { who: "Candidate", role: "candidate", text: "What makes it special, though, is that it was the first trip I'd ever paid for with my own money, so it's more of a keepsake than a souvenir. It also reminds me that handmade things have a character that factory products don't. If I broke it, I'd be really upset, because I could buy another teapot but I couldn't replace that memory.", vi: "Nhưng điều khiến nó đặc biệt là đó là chuyến đi đầu tiên tôi tự trả bằng tiền của mình, nên nó là vật kỷ niệm hơn là đồ lưu niệm. Nó cũng nhắc tôi rằng đồ làm tay có cái hồn mà hàng nhà máy không có. Nếu làm vỡ nó tôi sẽ buồn lắm, vì tôi mua được ấm khác nhưng không thay được ký ức ấy." },
        ],
      },
      {
        t: "table",
        head: ["Tiêu chí", "Bài band 5", "Bài band 6"],
        rows: [
          ["**FC** — trôi chảy, mạch lạc", "Cạn ý ở giây 50; “And… Yes. That's all.”; ý xếp lộn (mua → làng → tả → đi với ai)", "Đủ 2 phút; đi đúng 4 gợi ý của thẻ; từ dẫn tự nhiên: As for how I got it · These days · What makes it special, though"],
          ["**LR** — từ vựng", "beautiful ×2, like, cheap, souvenir — từ chung chung", "plain · the size of my fist · came across · on the spot · a tourist trap · keepsake · character · handmade"],
          ["**GRA** — ngữ pháp", "Sai thì (I go there two years ago · We see); toàn câu đơn; many shop", "Quá khứ hoàn thành (I'd gone · We'd been wandering) · mệnh đề quan hệ (which is · where) · điều kiện loại 2 · What… is that…; lỗi nếu có không làm sai nghĩa"],
          ["**P** — phát âm", "Dễ nuốt /l/ cuối: small, beautiful, people; nhấn đều", "Cần giữ /l/ cuối ở small · handle · special · felt; nhấn từ nội dung (xem mục 6)"],
        ],
      },
      {
        t: "note",
        title: "⚠️ Ba lỗi làm bài đồ vật tụt điểm",
        items: [
          "**Tả quá lâu**: 60 giây chỉ nói màu, cỡ, chất liệu. Thẻ đề luôn có “explain why” — phần đó mới cho điểm. Tả tối đa 25 giây.",
          "**Chọn đồ quá đắt, quá lạ** (đồng hồ thông minh với 12 tính năng) rồi thiếu từ để tả. Chọn đồ **đơn giản có câu chuyện**: cái ấm, cái khăn, tấm vé.",
          "**Kết treo**: “…and yeah.” → luôn có một câu chốt: “So, although it's just a cheap teapot, it's one of the few things I'd never throw away.”",
        ],
      },

      /* ── 3 ── */
      { t: "h", text: "3. Đề hoạt động vòng 2 — một hoạt động thử LẦN ĐẦU" },
      {
        t: "p",
        text: "Tập 2 Ngày 19 dạy hoạt động **thường xuyên** (hiện tại đơn + hiện tại hoàn thành). Vòng 2 là hoạt động **một lần / lần đầu** — gần như một câu chuyện, nên phải dùng **các thì quá khứ** và nói được **cảm xúc đổi thế nào**: trước khi làm → trong lúc làm → sau khi làm.",
      },
      {
        t: "table",
        head: ["Thẻ đề"],
        rows: [
          ["**Describe an activity you tried for the first time while travelling.**"],
          ["You should say:"],
          ["• what the activity was"],
          ["• where and with whom you did it"],
          ["• how you felt before and during it"],
          ["and explain whether you would do it again."],
        ],
      },
      {
        t: "patterns",
        rows: [
          {
            formula: "I'd never + V3 + before, so + S + V2",
            vi: "Mở: nhấn đây là LẦN ĐẦU.",
            examples: [{ en: "I'd never cooked anything more complicated than instant noodles before, so I was a bit nervous.", vi: "Trước đó tôi chưa từng nấu gì phức tạp hơn mì gói, nên hơi lo." }],
          },
          {
            formula: "At first + S + V2 …, but once + S + V2 …, + S + V2",
            vi: "Cảm xúc đổi theo chặng.",
            examples: [{ en: "At first I felt completely lost, but once the host showed me how to roll the rice paper, I started to enjoy it.", vi: "Lúc đầu tôi hoàn toàn lúng túng, nhưng khi chủ nhà chỉ cách cuốn bánh tráng, tôi bắt đầu thấy thích." }],
          },
          {
            formula: "It turned out to be + adj / N · What struck me most was + N / that…",
            vi: "Kết quả khác dự đoán + điều ấn tượng nhất.",
            examples: [{ en: "It turned out to be the most memorable part of the whole trip.", vi: "Hoá ra đó là phần đáng nhớ nhất của cả chuyến đi." }],
          },
          {
            formula: "I'd definitely do it again, + if / provided that… · I'm not sure I would, because…",
            vi: "Trả lời câu “would you do it again” — có điều kiện.",
            examples: [{ en: "I'd definitely do it again, especially if I could stay with a local family rather than in a hotel.", vi: "Chắc chắn tôi sẽ làm lại, nhất là nếu được ở với một gia đình địa phương thay vì khách sạn." }],
          },
        ],
      },
      {
        t: "dialogue",
        title: "Bài nói band 6 (ước tính) — khoảng 1 phút 50 giây",
        lines: [
          { who: "Candidate", role: "candidate", text: "I'm going to describe a cooking class I took last summer, when I was staying at a homestay in Hoi An with my older sister.", vi: "Tôi sẽ kể về một lớp nấu ăn tôi tham gia hè năm ngoái, khi tôi ở homestay tại Hội An với chị gái." },
          { who: "Candidate", role: "candidate", text: "The host family ran a small class for their guests every morning. First we went to the local market to buy herbs and fresh shrimp, and then we cooked three dishes in their kitchen, which opened onto a little garden.", vi: "Gia đình chủ nhà mở một lớp nhỏ cho khách mỗi sáng. Đầu tiên bọn tôi ra chợ mua rau thơm và tôm tươi, rồi nấu ba món trong bếp nhà họ, căn bếp mở ra một khu vườn nhỏ." },
          { who: "Candidate", role: "candidate", text: "I'd never cooked anything more complicated than instant noodles before, so I was quite nervous. At first I felt a bit useless, because my spring rolls kept falling apart. But once the grandmother showed me how to roll them tightly, I got the hang of it, and by the end I was actually enjoying myself.", vi: "Trước đó tôi chưa từng nấu gì phức tạp hơn mì gói nên khá lo. Lúc đầu tôi thấy mình hơi vô dụng vì nem cứ bung ra. Nhưng khi bà chủ nhà chỉ cách cuốn chặt tay, tôi quen dần, và đến cuối thì thật sự thấy vui." },
          { who: "Candidate", role: "candidate", text: "What struck me most was how much you can learn about a place through its food. The family explained why each herb is used, and I felt I'd gained a deeper understanding of the local way of life than I would have on a guided tour.", vi: "Điều ấn tượng nhất với tôi là ta học được bao nhiêu về một vùng đất qua đồ ăn. Gia đình giải thích vì sao dùng từng loại rau thơm, và tôi thấy mình hiểu lối sống địa phương sâu hơn so với đi tour có hướng dẫn viên." },
          { who: "Candidate", role: "candidate", text: "Would I do it again? Definitely. In fact, it turned out to be the most memorable part of the trip, and I've made those spring rolls for my friends twice since then — with mixed results, I have to admit.", vi: "Tôi có làm lại không? Chắc chắn. Thật ra đó hoá ra là phần đáng nhớ nhất của chuyến đi, và từ đó tôi đã làm món nem ấy cho bạn bè hai lần — kết quả lúc được lúc không, phải thú thật." },
        ],
      },
      { t: "rule", formula: "I'd never V3 before → At first…, but once… → What struck me most was… → It turned out to be… → I'd definitely do it again, if…", vi: "Khung band 6 cho hoạt động lần đầu: chưa từng – cảm xúc đổi – ấn tượng – kết quả – có làm lại không." },

      /* ── 4 ── */
      { t: "h", text: "4. Đề lạ: mượn khung trong 3 bước" },
      {
        t: "p",
        text: "Mỗi kỳ thi có vài thẻ nghe rất lạ. Đừng hoảng: giám khảo không chấm **ý tưởng**, chỉ chấm **tiếng Anh**. Thẻ lạ nào cũng quy được về một trong 6 loại bạn đã học ở Tập 2 (người · nơi · đồ vật · sự kiện · hoạt động · trừu tượng / tình huống). Việc của bạn trong 1 phút ghi chú là ba bước sau.",
      },
      {
        t: "sodo",
        kind: "flow",
        title: "Ba bước xử lý đề lạ trong 1 phút — rồi một câu bắc cầu khi bắt đầu nói",
        caption: "Bước ② quan trọng nhất: chọn xong loại là có ngay khung câu.",
        steps: [
          { label: "① Đọc danh từ chính + động từ", sub: "Describe **something** you **want to replace** → đồ vật + tương lai" },
          { label: "② Xếp vào loại gần nhất", sub: "đồ vật? hoạt động? a time when?" },
          { label: "③ Lấy một chuyện có sẵn", sub: "kho câu chuyện gốc — mỗi loại một chuyện (Tập 2 Ngày 23)" },
          { label: "④ Một câu bắc cầu", sub: "nói rõ bạn chọn góc nào rồi nói tiếp" },
        ],
      },
      {
        t: "table",
        head: ["Thẻ đề lạ", "Thật ra là loại", "Mượn khung của", "Thì cần đổi"],
        rows: [
          ["a traditional product from your country you would recommend to a visitor", "đồ vật", "đồ vật (mục 1) + “I'd recommend it because…”", "hiện tại + would"],
          ["something you own that you want to replace", "đồ vật", "đồ vật: tả → chuyện → **vấn đề hiện nay** → sẽ thay bằng gì", "hiện tại hoàn thành + be going to"],
          ["something you would take with you if you moved abroad", "đồ vật (giả định)", "đồ vật + điều kiện loại 2", "would suốt phần “why”"],
          ["a skill that takes a long time to learn", "hoạt động", "hoạt động (Tập 2 Ngày 19): bắt đầu → đã bao lâu → khó ở đâu", "hiện tại hoàn thành"],
          ["an activity you do to stay healthy / to relax", "hoạt động", "hoạt động thường xuyên", "hiện tại đơn"],
          ["a time you got lost / a journey that didn't go as planned", "tình huống “a time when”", "đầu – sự cố – kết quả – bài học (Tập 2 Ngày 23)", "các thì quá khứ"],
          ["a tradition in your country that you enjoy", "sự kiện + hoạt động", "sự kiện (Ngày 22): khi nào – ai – làm gì – vì sao", "hiện tại đơn (hằng năm)"],
          ["an invention that changed the way people travel", "đồ vật (không phải của mình)", "đồ vật: là gì → trước đây thế nào → nay thế nào → vì sao quan trọng", "used to + hiện tại"],
        ],
      },
      {
        t: "patterns",
        rows: [
          {
            formula: "That's not something I've thought about before, but the first thing that comes to mind is + N",
            vi: "Câu mở khi thẻ lạ — mua 5 giây, nghe tự nhiên, KHÔNG bị trừ điểm.",
            examples: [{ en: "That's not something I've thought about before, but the first thing that comes to mind is my grandmother's rice bowl.", vi: "Chuyện này tôi chưa nghĩ tới bao giờ, nhưng thứ đầu tiên hiện ra trong đầu là cái bát ăn cơm của bà tôi." }],
          },
          {
            formula: "I'm going to interpret this as + N / V-ing",
            vi: "Nói rõ bạn hiểu đề theo góc nào — hợp lệ, miễn vẫn đúng chủ đề thẻ.",
            examples: [{ en: "I don't own anything very valuable, so I'm going to talk about something that's valuable to me personally.", vi: "Tôi không có món gì giá trị lắm, nên tôi sẽ nói về một thứ có giá trị với riêng tôi." }],
          },
          {
            formula: "I haven't actually + V3, but if I did / had to, I'd + V",
            vi: "Thẻ hỏi trải nghiệm bạn không có ⇒ chuyển sang giả định (nối Ngày 11: khi không biết nói gì).",
            examples: [{ en: "I haven't actually lived abroad, but if I had to move, the one thing I'd take is a small photo album.", vi: "Thật ra tôi chưa sống ở nước ngoài, nhưng nếu phải chuyển đi, thứ duy nhất tôi mang theo là một cuốn album ảnh nhỏ." }],
          },
        ],
      },
      {
        t: "dialogue",
        title: "Đề lạ — “Describe something you would take with you if you moved to another country” · band 6 (ước tính)",
        lines: [
          { who: "Candidate", role: "candidate", text: "I haven't actually lived abroad yet, although I'm hoping to study overseas, so I'll talk about the one thing I'd definitely pack: a small bamboo flute that belonged to my grandfather.", vi: "Thật ra tôi chưa sống ở nước ngoài, dù tôi đang mong được đi du học, nên tôi sẽ nói về thứ chắc chắn tôi sẽ mang theo: một cây sáo trúc nhỏ từng là của ông tôi." },
          { who: "Candidate", role: "candidate", text: "It's a simple bamboo flute, a bit longer than my forearm, and the wood has gone dark and smooth where his fingers used to rest. He'd played it at village festivals since he was a teenager, and he gave it to me when I left home for university.", vi: "Đó là một cây sáo trúc giản dị, dài hơn cẳng tay tôi một chút, gỗ đã sẫm màu và nhẵn bóng ở chỗ ngón tay ông hay đặt. Ông thổi nó ở hội làng từ thời niên thiếu, và ông cho tôi khi tôi rời nhà đi học đại học." },
          { who: "Candidate", role: "candidate", text: "I can't play it well — I only know two or three tunes — but that isn't really the point. If I were living thousands of kilometres away, I think I'd get homesick quite easily, and having something that sounds like home would help me cope.", vi: "Tôi thổi không hay — chỉ biết hai ba bài — nhưng đó không phải điều chính. Nếu sống cách nhà hàng nghìn cây số, tôi nghĩ mình sẽ dễ nhớ nhà, và có một thứ mang âm thanh quê nhà sẽ giúp tôi vượt qua." },
          { who: "Candidate", role: "candidate", text: "It would also be a good way to share a bit of my culture. I imagine that if my flatmates asked about it, I could tell them about the festivals in my village, which would be much more interesting than showing them photos on my phone. So, of all the things I own, that's the one I wouldn't leave behind.", vi: "Nó cũng là cách hay để chia sẻ một chút văn hoá của tôi. Tôi hình dung nếu bạn cùng phòng hỏi, tôi có thể kể về lễ hội ở làng mình, thú vị hơn nhiều so với cho họ xem ảnh trên điện thoại. Vậy nên, trong mọi thứ tôi có, đó là thứ tôi sẽ không bỏ lại." },
        ],
      },
      {
        t: "note",
        title: "Soi bài mẫu đề lạ — mượn những gì",
        items: [
          "**Câu bắc cầu**: “I haven't actually lived abroad yet… so I'll talk about the one thing I'd definitely pack” — thừa nhận + chọn góc, mất 6 giây.",
          "**Khung đồ vật** dùng nguyên: tả một câu gói (a simple bamboo flute, a bit longer than my forearm) → chuyện (He'd played it… he gave it to me when…) → ý nghĩa.",
          "**Đổi thì theo đề**: phần “why” toàn điều kiện loại 2 (If I were living… I'd get homesick… would help).",
          "**Kho chuyện**: chuyện “ông tặng cây sáo” dùng được cho ít nhất 5 thẻ: a gift · something old in your family · a person who influenced you · a traditional product · something you would never sell.",
        ],
      },
      { t: "rule", formula: "Đề lạ → danh từ chính + động từ → loại gần nhất → khung của loại đó + một chuyện có sẵn → câu bắc cầu: I haven't actually…, but… / I'm going to talk about…", vi: "Không có đề mới, chỉ có đề cũ mặc áo khác; thừa nhận thật rồi chuyển hướng là hợp lệ." },

      /* ── 5 ── */
      { t: "h", text: "5. Part 3 đi kèm — đồ lưu niệm, nghề thủ công, đồ đạc" },
      {
        t: "dialogue",
        title: "Band 5 (ước tính)",
        lines: [
          { who: "Examiner", role: "examiner", text: "Why do people like to buy souvenirs when they travel?", vi: "Vì sao người ta thích mua đồ lưu niệm khi đi du lịch?" },
          { who: "Candidate", role: "candidate", text: "Because they want to remember the trip. And they give to friends and family. Souvenirs are cheap and beautiful. I think everybody like souvenirs.", vi: "Vì họ muốn nhớ chuyến đi. Và họ tặng bạn bè, gia đình. Đồ lưu niệm rẻ và đẹp. Tôi nghĩ ai cũng thích." },
        ],
      },
      {
        t: "dialogue",
        title: "Band 6 (ước tính) — cùng câu hỏi",
        lines: [
          { who: "Examiner", role: "examiner", text: "Why do people like to buy souvenirs when they travel?", vi: "Vì sao người ta thích mua đồ lưu niệm khi đi du lịch?" },
          { who: "Candidate", role: "candidate", text: "I think there are two main reasons. The obvious one is memory — a souvenir is something physical that brings the trip back whenever you look at it. The other reason is social: in Vietnam, at least, it's almost a custom to bring something back for your family and colleagues, so people would feel a bit guilty if they came home empty-handed. Having said that, a lot of souvenirs are mass-produced and have very little to do with the place, so I'd say the habit matters more than the object itself.", vi: "Tôi nghĩ có hai lý do chính. Lý do dễ thấy là ký ức — đồ lưu niệm là thứ cầm nắm được, gợi lại chuyến đi mỗi khi nhìn. Lý do kia mang tính xã hội: ít nhất ở Việt Nam, mang quà về cho gia đình và đồng nghiệp gần như là phong tục, nên người ta sẽ thấy hơi áy náy nếu về tay không. Dù vậy, nhiều đồ lưu niệm sản xuất hàng loạt và chẳng liên quan mấy tới nơi đó, nên tôi cho rằng thói quen quan trọng hơn bản thân món đồ." },
        ],
      },
      {
        t: "table",
        head: ["Khác ở đâu", "Band 5", "Band 6"],
        rows: [
          ["Cấu trúc câu trả lời", "3 ý rời, không phát triển", "two main reasons → lý do 1 + giải thích → lý do 2 + ví dụ Việt Nam → nhượng bộ (Having said that)"],
          ["Từ vựng", "cheap · beautiful · like", "something physical · custom · empty-handed · mass-produced"],
          ["Ngữ pháp", "everybody like; câu đơn", "mệnh đề quan hệ · điều kiện loại 2 (would feel… if they came) · so sánh"],
          ["Mức độ", "everybody (tuyệt đối)", "at least · almost · a lot of · I'd say (có mức độ)"],
        ],
      },
      {
        t: "note",
        title: "Bốn câu Part 3 hay đi sau thẻ đồ vật / hoạt động — và góc trả lời",
        items: [
          "**Do you think traditional handicrafts will disappear?** → dự đoán có điều kiện: thợ trẻ ít dần (lương thấp) ↔ du lịch và bán hàng online tạo thị trường mới.",
          "**Are people today too attached to their possessions?** → so sánh hai nhóm (trẻ – già) hoặc hai loại đồ (đồ dùng ↔ đồ kỷ niệm).",
          "**Is it better to spend money on things or on experiences?** → It depends + tách trường hợp (Ngày 6).",
          "**How has tourism changed traditional activities in your country?** → hai phía: giữ cho nghề sống ↔ bị commercialised (dùng từ sáng nay).",
        ],
      },

      /* ── 6 ── */
      { t: "h", text: "6. Phát âm: /l/ cuối — dark L" },
      {
        t: "p",
        text: "Tiếng Anh có hai kiểu /l/. **Clear L** đứng trước nguyên âm (**l**ocal, **l**ight, fee**l**ing): đầu lưỡi chạm lợi trên, âm sáng — giống “l” tiếng Việt. **Dark L** đứng **cuối từ hoặc trước phụ âm** (loca**l**, peop**l**e, he**l**p, trave**l**): đầu lưỡi vẫn chạm lợi, nhưng **cuống lưỡi nâng lên** phía sau, âm tối, nghe gần như có “ồ” ngắn phía trước. Tiếng Việt không có /l/ cuối, nên người Việt hay mắc ba lỗi: **bỏ mất** (people → “pi-pồ”), đổi thành **/n/** (hotel → “hô-ten”), hoặc đổi thành **/w/, /u/** (feel → “fiu”).",
      },
      {
        t: "table",
        head: ["Vị trí", "Loại", "Ví dụ", "Cách làm"],
        rows: [
          ["trước nguyên âm", "clear L", "**l**ocal · **l**ike · popu**l**ar", "đầu lưỡi chạm lợi, bật nhẹ"],
          ["cuối từ", "dark L", "loca**l** · trave**l** · hote**l** · smal**l** · festiva**l**", "đầu lưỡi chạm lợi và GIỮ; cuống lưỡi nâng"],
          ["trước phụ âm", "dark L", "he**l**p · chi**l**d · wor**l**d · cu**l**ture · bui**l**t", "chạm lợi rồi mới sang phụ âm sau"],
          ["âm tiết riêng (-le, -al)", "dark L thành âm tiết", "peop**le** · litt**le** · hand**le** · tradition**al**", "không chen nguyên âm rõ: /piːpl/, không “pi-pồ”"],
          ["cuối từ + nguyên âm ở từ sau", "nối âm ⇒ thành clear L", "trave**l** a lot · al**l** over", "nối: /trævə lə lɒt/"],
        ],
      },
      {
        t: "phatam",
        id: "t3d26-phat-am",
        title: "Luyện phát âm — /l/ cuối (dark L)",
        note: "Mỗi câu có 3–4 từ kết thúc bằng /l/. Giữ đầu lưỡi chạm lợi trên cho tới hết từ — đừng thả ra sớm, đừng tròn môi thành /u/. Câu 7–8 có cả clear L đầu từ để so sánh.",
        items: [
          { text: "The local people were really helpful.", ipa: "ðə ləʊkl piːpl wə rɪəli helpfl", vi: "Người dân địa phương thật sự rất hay giúp đỡ." },
          { text: "We stayed in a small hotel near the old wall.", ipa: "wi steɪd ɪn ə smɔːl həʊtel nɪə ði əʊld wɔːl", vi: "Chúng tôi ở một khách sạn nhỏ gần bức tường cổ." },
          { text: "It's a traditional festival held every April.", ipa: "ɪts ə trədɪʃənl festɪvl held evri eɪprəl", vi: "Đó là một lễ hội truyền thống tổ chức mỗi tháng Tư." },
          { text: "I still feel a little homesick when I travel.", ipa: "aɪ stɪl fiːl ə lɪtl həʊmsɪk wen aɪ trævl", vi: "Tôi vẫn thấy hơi nhớ nhà khi đi xa." },
          { text: "The handle of the bowl is full of small details.", ipa: "ðə hændl əv ðə bəʊl ɪz fʊl əv smɔːl diːteɪlz", vi: "Quai của cái bát đầy những chi tiết nhỏ." },
          { text: "Travel helps people understand the world.", ipa: "trævl helps piːpl ʌndəstænd ðə wɜːld", vi: "Du lịch giúp con người hiểu thế giới." },
          { text: "A lot of local culture is still alive in the hills.", ipa: "ə lɒt əv ləʊkl kʌltʃə ɪz stɪl əlaɪv ɪn ðə hɪlz", vi: "Rất nhiều nét văn hoá địa phương vẫn còn sống ở vùng đồi." },
          { text: "I'll tell you all about the beautiful old school.", ipa: "aɪl tel ju ɔːl əbaʊt ðə bjuːtɪfl əʊld skuːl", vi: "Tôi sẽ kể bạn nghe mọi thứ về ngôi trường cổ đẹp đẽ ấy." },
        ],
      },
      {
        t: "note",
        title: "Mẹo luyện /l/ cuối",
        items: [
          "Nói “all” rồi **dừng hình**: đầu lưỡi phải đang chạm lợi trên, miệng hơi mở, môi KHÔNG chụm. Nếu môi chụm tròn là bạn đang nói /ɔːu/.",
          "Tập theo cặp: fee — fee**l** · go — goa**l** · tie — ti**l**e · so — sou**l** · bow — bow**l**. Hai từ phải nghe khác nhau.",
          "Ghi âm bài nói Part 2 của bạn, đếm số từ có /l/ cuối bị rơi. Mục tiêu tuần này: giữ được ≥ 80%.",
        ],
      },

      /* ── 7 ── */
      { t: "h", text: "7. Luyện nói — ghi âm, AI chấm 4 tiêu chí" },
      {
        t: "p",
        text: "Mỗi thẻ: **1 phút ghi chú** (từ khoá theo 4 nhánh) rồi nói **đủ 2 phút**. Thẻ thứ ba là đề lạ — làm đúng ba bước ở mục 4 trước khi nói. Nghe lại bản ghi và tự tick: có câu gói tả? có quá khứ hoàn thành? có một câu giả định? có câu chốt?",
      },
      {
        t: "speak",
        id: "t3d26-noi-p2-do-vat",
        part: "2",
        questions: [
          "Describe something you bought or were given on a trip that is important to you. You should say: what it is and what it looks like, where and how you got it, what you do with it now, and explain why it is important to you.",
        ],
      },
      {
        t: "speak",
        id: "t3d26-noi-p2-hoat-dong",
        part: "2",
        questions: [
          "Describe an activity you tried for the first time while travelling. You should say: what the activity was, where and with whom you did it, how you felt before and during it, and explain whether you would do it again.",
        ],
      },
      {
        t: "speak",
        id: "t3d26-noi-p2-de-la",
        part: "2",
        questions: [
          "Describe a traditional product from your country that you would recommend to a foreign visitor. You should say: what it is, how it is made or where it comes from, when people use or buy it, and explain why you would recommend it.",
        ],
      },
      {
        t: "speak",
        id: "t3d26-noi-p3",
        part: "3",
        questions: [
          "Why do people like to buy souvenirs when they travel?",
          "Do you think traditional handicrafts will disappear in the future?",
          "Is it better to spend money on possessions or on experiences such as travel?",
          "How has tourism changed traditional activities in your country?",
        ],
      },
      {
        t: "note",
        title: "Bảng tự chấm sau khi nghe lại",
        items: [
          "**FC**: nói đủ 2 phút không? Có quãng im > 3 giây không? Có câu chốt không?",
          "**LR**: dùng được mấy từ của bài sáng nay? Còn mấy lần nói “beautiful / nice / good”?",
          "**GRA**: có ít nhất một quá khứ hoàn thành, một mệnh đề quan hệ, một câu điều kiện loại 2?",
          "**P**: /l/ cuối ở people · local · travel · special có còn không?",
        ],
      },
    ],
  },
  /* ═══════════════════════════ BÀI TẬP ═══════════════════════════ */
  {
    id: "t3d26-bai-tap",
    kind: "homework",
    title: "Bài tập Ngày 26",
    goal: "Củng cố 45 từ Travel & culture và 12 collocation, khung báo cáo ngắn, cách chọn overview – thì – khung câu cho 7 dạng Task 1, và cách xếp đề Part 2 lạ vào loại đã học.",
    minutes: 50,
    blocks: [
      {
        t: "recap",
        title: "Trước khi làm",
        items: [
          "40 câu có đáp án, chia 6 phần + một đoạn viết báo cáo + một lượt nói.",
          "Phần I–III: từ vựng bài 1. Phần IV–V: bài Viết. Phần VI: đề lạ của bài Nói.",
          "Sai từ nào thì thêm vào Flashcards; sai phần IV thì đọc lại bảng 7 dạng ở mục 6 bài Viết.",
        ],
      },
      { t: "h", text: "Phần I — Điền từ (8 câu)" },
      { t: "p", text: "Chọn trong khung và đổi dạng nếu cần: **heritage · seasonal · displace · etiquette · stereotype · homesick · picturesque · stopover**" },
      {
        t: "quiz",
        id: "t3d26-bt-dien",
        kind: "fill",
        title: "I. Điền từ trong khung — đúng dạng",
        items: [
          { q: "Most hotel work on the island is ______, so many staff are unemployed in winter.", answers: ["seasonal"] },
          { q: "Hundreds of families were ______ when the old quarter was turned into holiday flats.", answers: ["displaced"] },
          { q: "Before your business trip to Japan, read a little about dining ______.", answers: ["etiquette"] },
          { q: "The idea that all tourists are noisy is just a ______.", answers: ["stereotype"] },
          { q: "She felt ______ for the first few weeks of her exchange year.", answers: ["homesick"] },
          { q: "Our flight to London included a six-hour ______ in Doha.", answers: ["stopover"] },
          { q: "The citadel is the country's best-known World ______ Site.", answers: ["Heritage", "heritage"] },
          { q: "We had lunch in a ______ fishing village with brightly painted boats.", answers: ["picturesque"] },
        ],
      },
      { t: "h", text: "Phần II — Chọn đáp án (8 câu)" },
      {
        t: "mcq",
        id: "t3d26-bt-chon",
        title: "II. Chọn từ / cụm đúng",
        items: [
          { q: "Tourism ______ a great deal of revenue for the region.", options: ["does", "generates", "makes up", "boosts up"], correct: 1, why: "generate revenue / income." },
          { q: "The new resort poses a serious threat ______ the coral reef.", options: ["for", "on", "to", "with"], correct: 2, why: "pose a threat to + N." },
          { q: "It took us a week to ______ to the heat.", options: ["adapt", "adopt", "adept", "admit"], correct: 0, why: "adapt to = thích nghi; adopt = tiếp nhận, áp dụng." },
          { q: "Air ______ has become much cheaper over the last twenty years.", options: ["trip", "journey", "tour", "travel"], correct: 3, why: "travel (không đếm được) = việc đi lại nói chung: air travel." },
          { q: "The old town was beautifully ______ after years of neglect.", options: ["preserved", "restored", "conserved", "exploited"], correct: 1, why: "Sau thời gian bị bỏ bê ⇒ sửa lại như cũ = restore. preserve = giữ cho khỏi hỏng." },
          { q: "We joined a guided tour ______ the royal palace.", options: ["of", "to", "at", "in"], correct: 0, why: "a tour of + nơi." },
          { q: "Many critics argue that the festival has become too ______.", options: ["commerce", "commercially", "commercialised", "commercialise"], correct: 2, why: "become + tính từ / V3: commercialised." },
          { q: "Living with a host family let me ______ myself in the language.", options: ["wander", "venture", "preserve", "immerse"], correct: 3, why: "immerse yourself in + N." },
        ],
      },
      { t: "h", text: "Phần III — Dịch Việt → Anh (6 câu)" },
      {
        t: "quiz",
        id: "t3d26-bt-dich",
        kind: "translate",
        title: "III. Dịch sang tiếng Anh — dùng cụm trong ngoặc",
        grammar: "collocation chủ đề Travel & culture",
        items: [
          { q: "Hàng triệu du khách gây sức ép lên nguồn nước của hòn đảo. (put a strain on)", answers: ["Millions of visitors put a strain on the island's water supply.", "Millions of tourists put a strain on the island's water supply.", "Millions of visitors put a strain on the island's water supplies.", "Millions of tourists put a strain on the island's water supplies.", "Millions of tourists put a strain on the water supply of the island.", "Millions of visitors put a strain on the water supply of the island."], hint: "put a strain on the island's water supply" },
          { q: "Chính phủ phải cân bằng giữa tăng trưởng kinh tế và bảo tồn. (strike a balance between)", answers: ["The government must strike a balance between economic growth and conservation.", "Governments must strike a balance between economic growth and conservation.", "The government has to strike a balance between economic growth and conservation."], hint: "must strike a balance between … and …" },
          { q: "Lợi nhuận không nên có được bằng cách gây hại cho người dân địa phương. (at the expense of)", answers: ["Profits should not be made at the expense of local residents.", "Profits should not be made at the expense of local people.", "Profits should not come at the expense of local residents.", "Profits should not come at the expense of local people.", "Profit should not be made at the expense of local people.", "Profit should not be made at the expense of local residents."], hint: "should not be made at the expense of" },
          { q: "Lễ hội thu hút du khách từ khắp cả nước. (attract visitors)", answers: ["The festival attracts visitors from all over the country.", "The festival attracts visitors from across the country.", "The festival attracts visitors from all around the country."], hint: "attracts visitors from all over" },
          { q: "Du lịch giúp giới trẻ trải nghiệm một lối sống khác. (experience a different way of life)", answers: ["Travel helps young people experience a different way of life.", "Travel helps young people to experience a different way of life.", "Travelling helps young people experience a different way of life.", "Travelling helps young people to experience a different way of life.", "Travel lets young people experience a different way of life."], hint: "Travel helps young people (to) experience" },
          { q: "Chuyến đi từ Huế tới Hội An mất khoảng ba tiếng. (journey)", answers: ["The journey from Hue to Hoi An takes about three hours.", "The journey from Hue to Hoi An takes around three hours.", "The journey from Hue to Hoi An took about three hours.", "The journey from Huế to Hội An takes about three hours."], hint: "The journey from … to … takes" },
        ],
      },
      { t: "h", text: "Phần IV — Nhận dạng 7 dạng Task 1 (7 câu)" },
      {
        t: "mcq",
        id: "t3d26-bt-dang",
        title: "IV. Mỗi đề cần gì?",
        items: [
          { q: "Đề: quy trình sản xuất nước mắm (sơ đồ 8 bước). Thì và thể chủ lực là:", options: ["quá khứ đơn, chủ động", "hiện tại hoàn thành", "tương lai với will", "hiện tại đơn, bị động"], correct: 3, why: "Process ⇒ hiện tại đơn bị động: The fish are salted and left for…" },
          { q: "Đề: bảng có hàng Total. Câu đầu thân bài nên nói về:", options: ["hàng Total", "hàng nhỏ nhất", "hàng đầu tiên trong bảng", "cột bên phải nhất"], correct: 0, why: "Ngày 20: Total đọc trước, viết trước." },
          { q: "Đề: hai pie chart cùng một nước, năm 2000 và 2020. Chủ ngữ đúng là:", options: ["Agriculture fell to 20%.", "The share of agriculture fell to 20%.", "The pie of agriculture fell to 20%.", "Agriculture was fallen to 20%."], correct: 1, why: "Ngày 16: pie cho biết TỈ TRỌNG ⇒ the share / proportion of…" },
          { q: "Đề: line graph có một đường Total và ba đường thành phần. Overview nên:", options: ["bỏ qua đường Total", "chỉ tả đường thấp nhất", "nói xu hướng của Total rồi chỉ ra thành phần gây ra", "liệt kê số đầu và số cuối của cả bốn đường"], correct: 2, why: "Ngày 8: …, with the most dramatic rise being seen in…" },
          { q: "Đề: bar chart so 6 nước trong MỘT năm. Câu nào dùng được?", options: ["Spain rose to 30%.", "Spain peaked at 30%.", "Spain increased steadily.", "Spain had the highest figure, at 30%."], correct: 3, why: "Không có thời gian ⇒ không dùng rose / peaked / increased." },
          { q: "Đề: mixed — line graph (2000–2020) + pie (năm 2020). Thì dùng thế nào?", options: ["cả hai hình đều hiện tại đơn", "mỗi hình chọn thì riêng theo mốc thời gian của nó", "line: tương lai · pie: quá khứ hoàn thành", "không quan trọng"], correct: 1, why: "Ngày 24: mỗi hình một thì. Ở đây cả hai đều là quá khứ đơn vì đều có năm đã qua; hình không năm mới dùng hiện tại." },
          { q: "Trong Task 1, câu nào KHÔNG được viết?", options: ["Overall, sales rose over the period.", "Sales peaked at 40,000 in June.", "This rise was probably caused by a new advertising campaign.", "By contrast, costs remained stable."], correct: 2, why: "Nguyên nhân ngoài hình ⇒ chỉ viết trong báo cáo công việc, không viết trong Task 1." },
        ],
      },
      { t: "h", text: "Phần V — Khung câu báo cáo (6 câu)" },
      {
        t: "quiz",
        id: "t3d26-bt-bao-cao",
        kind: "fill",
        title: "V. Điền MỘT từ vào câu báo cáo",
        items: [
          { q: "This report ______ visitor numbers at our three sites in 2025.", answers: ["summarises", "summarizes", "presents", "compares", "reviews"], hint: "động từ câu mục đích" },
          { q: "The main ______ is that weekend visits have doubled.", answers: ["finding"] },
          { q: "This may be ______ to the new late-opening hours.", answers: ["due"] },
          { q: "It is recommended ______ the café should stay open until 8 p.m.", answers: ["that"] },
          { q: "We recommend ______ (hire) two more guides for the summer.", answers: ["hiring"], hint: "recommend + V-ing" },
          { q: "Total sales were unchanged, which ______ that customers are simply switching products.", answers: ["suggests", "indicates", "shows", "means"] },
        ],
      },
      { t: "h", text: "Phần VI — Đề lạ: mượn khung nào? (5 câu)" },
      {
        t: "mcq",
        id: "t3d26-bt-de-la",
        title: "VI. Xếp thẻ đề vào loại gần nhất",
        items: [
          { q: "“Describe something you own that you would like to replace.”", options: ["đồ vật + vấn đề hiện nay + tương lai", "người", "sự kiện", "nơi chốn"], correct: 0, why: "Danh từ chính something you own ⇒ đồ vật; want to replace ⇒ thêm phần vấn đề + sẽ thay bằng gì." },
          { q: "“Describe a time when you got lost in an unfamiliar place.”", options: ["đồ vật", "hoạt động thường xuyên", "tình huống: đầu – sự cố – kết quả – bài học", "trừu tượng (một quy định)"], correct: 2, why: "a time when ⇒ khung tình huống của Tập 2 Ngày 23, kể bằng các thì quá khứ." },
          { q: "“Describe a skill that takes a long time to learn.”", options: ["nơi chốn", "hoạt động: bắt đầu → đã bao lâu → khó ở đâu", "người", "đồ vật"], correct: 1, why: "skill = việc mình LÀM ⇒ khung hoạt động, thì hiện tại hoàn thành." },
          { q: "Thẻ hỏi về trải nghiệm bạn CHƯA từng có. Mở bài tốt nhất là:", options: ["Sorry, I can't answer this question.", "(im lặng 10 giây để nghĩ)", "Đọc thuộc một bài về chủ đề khác", "I haven't actually done that, but if I had the chance, I'd…"], correct: 3, why: "Thừa nhận thật + chuyển sang giả định là hợp lệ và vẫn cho thấy ngữ pháp (điều kiện loại 2)." },
          { q: "Chuyện “ông tặng cây sáo” KHÔNG hợp với thẻ nào?", options: ["a gift you received", "something old in your family", "a website you often use", "something you would never sell"], correct: 2, why: "Kho chuyện dùng được cho nhiều thẻ cùng loại (đồ vật / người thân), không ép vào thẻ khác hẳn chủ đề." },
        ],
      },
      { t: "h", text: "Viết thêm — báo cáo ngắn (AI chấm)" },
      {
        t: "chart",
        kind: "line",
        title: "Weekly visitors to a craft village, by type of visit, January–June (hundreds)",
        unit: "hundred visitors per week",
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        series: [
          { name: "Guided tours", values: [18, 20, 19, 17, 14, 12] },
          { name: "Independent visitors", values: [9, 11, 14, 18, 23, 27] },
        ],
      },
      {
        t: "essay",
        id: "t3d26-bt-viet",
        task: "Task 1",
        prompt: "You work for the visitor centre of a craft village. The line graph shows the average number of weekly visitors (in hundreds) from January to June, by type of visit. Guided tours: 18, 20, 19, 17, 14, 12. Independent visitors: 9, 11, 14, 18, 23, 27. Write a short report for the village committee. Include a heading (To / From / Date / Subject), the purpose, the key findings, the main details and two recommendations. Write 150–220 words.",
        minWords: 150,
        tips: [
          "Key findings: khách tự đi tăng gấp ba và vượt khách theo tour từ tháng Tư; tổng lượng khách tăng (27 → 39).",
          "Chi tiết: số đầu – số cuối – điểm cắt nhau (Apr: 17 và 18). Một câu diễn giải: which suggests that…",
          "Hai đề xuất bám số liệu: biển chỉ dẫn / bản đồ tự tham quan cho khách tự đi; xem lại giá và lịch tour. It is recommended that… should….",
          "⚠️ AI chấm theo **tiêu chí Task 1** (TA · CC · LR · GRA). Phần tiêu đề, diễn giải và đề xuất là yêu cầu riêng của báo cáo — nếu bị trừ TA vì “ngoài hình” thì bỏ qua lời trừ đó và tự soát theo khung 5 phần (bài Viết mục 2).",
        ],
      },
      { t: "h", text: "Nói thêm — một thẻ đề lạ (ghi âm, AI chấm)" },
      {
        t: "speak",
        id: "t3d26-bt-noi",
        part: "2",
        questions: [
          "Describe something you own that you would like to replace. You should say: what it is, how long you have had it, why you want to replace it, and explain what you would like to have instead.",
        ],
      },
    ],
  },
];
