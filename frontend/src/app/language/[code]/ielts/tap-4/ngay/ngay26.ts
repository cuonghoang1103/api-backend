/**
 * IELTS Tập 4 — Ngày 26 (band 6.0 → 7.0; tự soạn 18/11/2026 — mọi câu ví dụ, bài mẫu, đề, câu bài tập VIẾT MỚI)
 *   Bài 1 (vocab)     Thực phẩm vòng 2 (công nghiệp thực phẩm + an toàn thực phẩm, 22 từ) + Truyền thông vòng 2
 *                     (báo chí + quảng cáo, 20 từ) + cặp dễ nhầm                                            [VC12 VC15]
 *                     — nối Tập 2 Ngày 12 (thực phẩm vòng 1, mục 7 an toàn thực phẩm), Tập 2 Ngày 18 (truyền thông
 *                       vòng 1), Tập 3 Ngày 18 (mạng xã hội vòng 2)
 *   Bài 2 (writing)   Cover letter + email formal nâng cao (đòi nợ lần 2 · phàn nàn · từ chối · xin gia hạn); mẫu
 *                     band 6 vs band 7 đặt cạnh nhau                                                        [W21 E03]
 *                     — nối Tập 2 Ngày 24 (email 5 phần, formal / informal), Tập 3 Ngày 18 (STAR), Ngày 26 (báo cáo ngắn)
 *   Bài 3 (speaking)  Part 2 band 7 đề trừu tượng: a law · a piece of advice — khung NEO → NỀN → CẢNH → CÂN; đề lạ trừu
 *                     tượng; Part 3 nối tiếp                                                                     [S05 S06]
 *                     — nối Tập 2 Ngày 23 (biến ý thành cảnh, kho 5 câu chuyện), Tập 3 Ngày 26 (mượn khung),
 *                       Tập 4 Ngày 6 (câu chuyện 4 nhịp), Ngày 23 (in principle… in practice…) · 🔊 tốc độ tự nhiên
 *   Bài tập Ngày 26   40 câu có đáp án + 1 email ngắn
 * Mọi id bắt đầu `t4d26-`.
 */
import type { Lesson } from '../data';

export const NGAY_26: Lesson[] = [
  /* ═══════════════════════════ BÀI 1 — TỪ VỰNG ═══════════════════════════ */
  {
    id: "t4d26-tu-vung",
    kind: "vocab",
    title: "Từ vựng: Thực phẩm vòng 2 (công nghiệp & an toàn thực phẩm) + Truyền thông vòng 2 (báo chí & quảng cáo)",
    goal: "Dùng đúng 42 từ – cụm về công nghiệp thực phẩm (factory farming, monoculture, ultra-processed, traceability, product recall…) và về báo chí – quảng cáo (impartial, sensationalise, paywall, product placement, pester power…) kèm collocation và sắc thái, phân biệt các cặp hay nhầm (food safety / food security, advertising / advertisement, news không đếm được) — đủ vốn cho Task 2 và Part 3 hai chủ đề này ở band 7 (LR).",
    minutes: 95,
    blocks: [
      {
        t: "recap",
        items: [
          "**Thực phẩm vòng 2.** Tập 2 Ngày 12 dạy từ nền (crop, pesticide, food security) và mục 7 dạy an toàn thực phẩm mức nhập (preservative, food label, expiry date, food poisoning). Hôm nay lên tầng **hệ thống**: thực phẩm được sản xuất **công nghiệp** thế nào (nhóm A) và **ai giám sát** nó an toàn ra sao (nhóm B).",
          "**Truyền thông vòng 2.** Tập 2 Ngày 18 dạy journalist, bias, fake news, clickbait; Tập 3 Ngày 18 dạy algorithm, echo chamber. Hôm nay học từ để **phân tích**: báo chí đáng tin hay giật gân (nhóm C), quảng cáo len vào đâu và nhắm vào ai (nhóm D).",
          "Band 7 LR = “từ ít gặp **có ý thức về collocation và văn phong**”. Mỗi từ có dòng mở rộng ghi ==đi với từ nào, dùng ở đâu==. Học cả cụm.",
          "Mục 5 là **sáu cặp dễ nhầm** — lỗi rất nhỏ nhưng giám khảo thấy ngay (a news, advertisings, food safety ≠ food security).",
          "Mọi từ tự vào **Flashcards** và **Tra từ vựng**. Bấm “Che nghĩa / Che từ” để tự kiểm sau mỗi nhóm.",
        ],
      },

      /* ── 1 ── */
      { t: "h", text: "1. Nhóm A — Công nghiệp thực phẩm: sản xuất lớn, rẻ, và cái giá ẩn (12 từ)" },
      {
        t: "p",
        text: "Đề Task 2 về thực phẩm ở band 7 hiếm khi hỏi “ăn gì cho khoẻ”. Nó hỏi về **hệ thống**: “Food is now cheaper than ever, but some argue the true cost is hidden. Discuss.” Muốn bàn được, bạn cần tên của từng mắt xích: cách nuôi, cách trồng, cách chế biến, và hệ quả.",
      },
      {
        t: "sodo",
        kind: "mindmap",
        title: "Bản đồ từ — thực phẩm công nghiệp",
        center: "industrial food system",
        branches: [
          { label: "Nuôi", items: ["factory farming", "free-range", "animal welfare", "antibiotic resistance"], anh: "cow" },
          { label: "Trồng", items: ["intensive", "monoculture", "cash crop"], anh: "sheaf-of-rice" },
          { label: "Doanh nghiệp", items: ["agribusiness", "economies of scale", "mass-produced"], anh: "factory" },
          { label: "Đĩa ăn", items: ["ultra-processed", "additive"], anh: "canned-food" },
        ],
      },
      {
        t: "vocab",
        items: [
          { w: "factory farming", pos: "n", ipa: "/ˈfæktəri ˌfɑːmɪŋ/", vi: "chăn nuôi công nghiệp (nhốt số lượng lớn trong không gian hẹp)", ex: "Factory farming has made meat cheap, but at a considerable cost to animal welfare.", exVi: "Chăn nuôi công nghiệp làm thịt rẻ đi, nhưng phải trả giá đáng kể về phúc lợi động vật.", more: "factory-farmed chicken / pork · gần nghĩa trung tính hơn: **intensive livestock farming** · trái nghĩa: free-range, pasture-raised" },
          { w: "intensive", pos: "adj", ipa: "/ɪnˈtensɪv/", vi: "thâm canh (tối đa sản lượng trên một diện tích)", ex: "Intensive agriculture doubled yields but exhausted the soil within a generation.", exVi: "Nông nghiệp thâm canh nhân đôi sản lượng nhưng làm đất kiệt trong một thế hệ.", more: "**intensive** farming / agriculture / methods ≠ **extensive** farming (quảng canh) · labour-intensive (cần nhiều lao động) · capital-intensive" },
          { w: "agribusiness", pos: "n", ipa: "/ˈæɡrɪbɪznəs/", vi: "nông nghiệp kinh doanh quy mô lớn; tập đoàn nông nghiệp", ex: "A handful of agribusinesses now control most of the world's seed supply.", exVi: "Vài tập đoàn nông nghiệp hiện kiểm soát phần lớn nguồn hạt giống thế giới.", more: "đếm được khi chỉ công ty: **an agribusiness / agribusinesses** · không đếm được khi chỉ ngành · sắc thái hơi phê phán trong báo chí" },
          { w: "monoculture", pos: "n", ipa: "/ˈmɒnəʊkʌltʃə/", vi: "độc canh (chỉ trồng một loại cây trên diện rộng)", ex: "Vast monocultures of oil palm have replaced rainforest across the region.", exVi: "Những vùng độc canh cọ dầu rộng lớn đã thay thế rừng mưa khắp khu vực.", more: "≠ crop rotation (luân canh) · monocultures are **vulnerable to** pests / disease · nghĩa bóng: a cultural monoculture (văn hoá một màu)" },
          { w: "cash crop", pos: "n", ipa: "/ˈkæʃ krɒp/", vi: "cây trồng để bán (không phải để ăn)", ex: "Farmers switched from rice to coffee, a cash crop whose price can halve in a single season.", exVi: "Nông dân chuyển từ lúa sang cà phê, một cây trồng hàng hoá mà giá có thể giảm một nửa chỉ trong một mùa.", more: "≠ **subsistence** crop (trồng để tự ăn) · grow / export **cash crops** · price volatility (giá lên xuống thất thường)" },
          { w: "economies of scale", pos: "n", ipa: "/ɪˈkɒnəmiz əv ˈskeɪl/", vi: "lợi thế kinh tế nhờ quy mô (càng làm nhiều, giá mỗi đơn vị càng rẻ)", ex: "Large producers benefit from economies of scale that small farms cannot match.", exVi: "Nhà sản xuất lớn hưởng lợi thế quy mô mà trang trại nhỏ không theo kịp.", more: "luôn số nhiều: **economies** of scale · benefit from / achieve / exploit economies of scale · ⚠️ không phải “nền kinh tế quy mô”" },
          { w: "mass-produced", pos: "adj", ipa: "/ˌmæs prəˈdjuːst/", vi: "sản xuất hàng loạt", ex: "Mass-produced bread can stay soft for a week because of the additives it contains.", exVi: "Bánh mì sản xuất hàng loạt có thể mềm cả tuần nhờ các chất phụ gia trong đó.", more: "mass production (n) · mass-market · trái nghĩa: artisanal /ɑːˈtɪzənl/ (thủ công, làm nhỏ), handmade" },
          { w: "free-range", pos: "adj", ipa: "/ˌfriː ˈreɪndʒ/", vi: "thả vườn, chăn thả tự do", ex: "Free-range eggs cost almost twice as much, which many families simply cannot justify.", exVi: "Trứng gà thả vườn đắt gần gấp đôi, điều mà nhiều gia đình đơn giản là không thể biện minh nổi.", more: "free-range eggs / chickens · organic ≠ free-range (hữu cơ nói về hoá chất, thả vườn nói về cách nuôi)" },
          { w: "animal welfare", pos: "n", ipa: "/ˈænɪml ˈwelfeə/", vi: "phúc lợi động vật (điều kiện sống, không bị hành hạ)", ex: "Stricter animal welfare standards would raise prices, at least in the short term.", exVi: "Chuẩn phúc lợi động vật chặt hơn sẽ đẩy giá lên, ít nhất là trước mắt.", more: "animal welfare **standards / concerns / groups** · ≠ animal rights (quyền động vật — lập trường triết học mạnh hơn)" },
          { w: "antibiotic resistance", pos: "n", ipa: "/ˌæntibaɪˈɒtɪk rɪˈzɪstəns/", vi: "kháng kháng sinh", ex: "The routine use of antibiotics in livestock is accelerating antibiotic resistance in humans.", exVi: "Việc dùng kháng sinh thường xuyên trong chăn nuôi đang đẩy nhanh tình trạng kháng kháng sinh ở người.", more: "cũng nói: antimicrobial resistance (AMR) · drug-resistant bacteria · **routine / overuse of** antibiotics" },
          { w: "ultra-processed", pos: "adj", ipa: "/ˌʌltrə ˈprəʊsest/", vi: "chế biến sâu, siêu chế biến", ex: "Ultra-processed foods now make up over half of the calories eaten in some countries.", exVi: "Thực phẩm siêu chế biến hiện chiếm hơn nửa lượng calo được ăn ở một số nước.", more: "processed (đã qua chế biến — Tập 2 Ngày 4) < **ultra-processed** (nhiều thành phần công nghiệp: hương liệu, chất nhũ hoá…) · ultra-processed **food(s)**" },
          { w: "additive", pos: "n", ipa: "/ˈædətɪv/", vi: "chất phụ gia", ex: "Not every additive is harmful; some simply stop oil from separating.", exVi: "Không phải chất phụ gia nào cũng có hại; một số chỉ giữ cho dầu không bị tách lớp.", more: "food additives · **preservative** (chất bảo quản, Tập 2 Ngày 12) là MỘT loại additive · additive-free · ⚠️ trọng âm âm 1: **AD**-di-tive" },
        ],
      },
      {
        t: "quiz",
        id: "t4d26-tv-nhom-a",
        kind: "fill",
        title: "Điền MỘT từ / cụm của nhóm A (8 câu)",
        items: [
          { q: "1. Critics argue that factory ___ treats animals as little more than units of production.", answers: ["farming"], hint: "factory ___ (chăn nuôi công nghiệp)" },
          { q: "2. Because the region relies on a single crop, its ___ is highly vulnerable to one new disease.", answers: ["monoculture"], hint: "độc canh" },
          { q: "3. Supermarkets can sell chicken this cheaply only because of economies of ___.", answers: ["scale"], hint: "economies of ___" },
          { q: "4. Coffee is the country's main cash ___, accounting for a third of its exports.", answers: ["crop"], hint: "cây trồng để bán" },
          { q: "5. ___ foods such as instant noodles and soft drinks are linked to higher rates of obesity.", answers: ["Ultra-processed", "ultra-processed", "Ultra processed"], hint: "siêu chế biến (có gạch nối)" },
          { q: "6. The label says the sauce contains no artificial ___ or preservatives.", answers: ["additives"], hint: "chất phụ gia — số nhiều" },
          { q: "7. Rice in the delta is grown ___, with three harvests a year.", answers: ["intensively"], hint: "trạng từ của intensive" },
          { q: "8. Overuse of antibiotics in pigs contributes to antibiotic ___ in people.", answers: ["resistance"], hint: "kháng kháng sinh" },
        ],
      },

      /* ── 2 ── */
      { t: "h", text: "2. Nhóm B — An toàn thực phẩm vòng 2: truy xuất, thu hồi, giám sát (10 từ)" },
      {
        t: "p",
        text: "Tập 2 Ngày 12 mục 7 dạy bạn đọc **nhãn** (food label, expiry date) và gọi tên **hậu quả** (food poisoning). Vòng 2 dạy từ cho câu hỏi Part 3 / Task 2 kiểu: ==“Who should be responsible for food safety — governments, companies or consumers?”== — tức là từ của **hệ thống giám sát**.",
      },
      {
        t: "vocab",
        items: [
          { w: "foodborne", pos: "adj", ipa: "/ˈfuːdbɔːn/", vi: "lây qua thực phẩm", ex: "Foodborne illnesses are most common in hot months, when bacteria multiply quickly.", exVi: "Bệnh lây qua thực phẩm hay gặp nhất vào tháng nóng, khi vi khuẩn sinh sôi nhanh.", more: "foodborne **illness / disease / pathogen** · cùng kiểu: waterborne, airborne · trang trọng hơn food poisoning" },
          { w: "outbreak", pos: "n", ipa: "/ˈaʊtbreɪk/", vi: "đợt bùng phát (dịch, ngộ độc)", ex: "An outbreak of salmonella was traced to a single batch of eggs.", exVi: "Một đợt bùng phát khuẩn salmonella được truy về đúng một lô trứng.", more: "an outbreak **of** + bệnh · **trace** an outbreak **to** · contain an outbreak · động từ: break out (dịch bùng phát)" },
          { w: "traceability", pos: "n", ipa: "/ˌtreɪsəˈbɪləti/", vi: "khả năng truy xuất nguồn gốc", ex: "QR codes on packaging have improved traceability from farm to fork.", exVi: "Mã QR trên bao bì đã cải thiện khả năng truy xuất nguồn gốc từ trang trại tới bàn ăn.", more: "traceable (adj) · trace sth **back to** · **from farm to fork** (cụm chuẩn của ngành)" },
          { w: "recall", pos: "n / v", ipa: "/ˈriːkɔːl/ (n) · /rɪˈkɔːl/ (v)", vi: "thu hồi sản phẩm (lỗi, nguy hiểm)", ex: "The company recalled 40,000 jars of baby food after traces of glass were found.", exVi: "Công ty thu hồi 40.000 hũ thức ăn trẻ em sau khi phát hiện mảnh thuỷ tinh.", more: "issue / announce **a product recall** · recall sth **from** shops · ⚠️ danh từ nhấn âm 1, động từ nhấn âm 2 (như record)" },
          { w: "adulterate", pos: "v", ipa: "/əˈdʌltəreɪt/", vi: "pha trộn chất kém / độc vào (để trục lợi)", ex: "Some honey sold online had been adulterated with cheap sugar syrup.", exVi: "Một số mật ong bán trên mạng đã bị pha si-rô đường rẻ tiền.", more: "adulterate sth **with** sth · adulterated (adj) · adulteration (n) · trang trọng, dùng nhiều trong báo cáo / Task 2" },
          { w: "food fraud", pos: "n", ipa: "/ˈfuːd frɔːd/", vi: "gian lận thực phẩm (dán nhãn sai, đánh tráo nguyên liệu)", ex: "Selling cheaper fish under a more expensive name is one of the commonest forms of food fraud.", exVi: "Bán cá rẻ dưới tên một loài đắt hơn là một trong những kiểu gian lận thực phẩm phổ biến nhất.", more: "không đếm được · commit / detect / tackle food fraud · mislabelling (dán nhãn sai)" },
          { w: "allergen", pos: "n", ipa: "/ˈælədʒən/", vi: "chất gây dị ứng", ex: "Restaurants in the EU must tell customers which of fourteen major allergens a dish contains.", exVi: "Nhà hàng ở EU phải cho khách biết món ăn chứa chất nào trong mười bốn chất gây dị ứng chính.", more: "allergy (n) **to** · allergic (adj) **to** · ⚠️ đọc /ˈælədʒən/, không đọc “a-lơ-gien”" },
          { w: "labelling", pos: "n", ipa: "/ˈleɪbəlɪŋ/", vi: "việc ghi nhãn", ex: "Clearer labelling would help, but only if shoppers actually read it.", exVi: "Ghi nhãn rõ hơn sẽ có ích, nhưng chỉ khi người mua thật sự đọc nó.", more: "front-of-pack labelling · **labelling requirements / rules** · Anh-Anh hai chữ **l** (labelling), Anh-Mỹ một chữ (labeling)" },
          { w: "watchdog", pos: "n", ipa: "/ˈwɒtʃdɒɡ/", vi: "cơ quan giám sát (thực phẩm, báo chí, cạnh tranh…)", ex: "The food watchdog has warned that cheap imports are being sold without proper checks.", exVi: "Cơ quan giám sát thực phẩm cảnh báo hàng nhập rẻ đang được bán mà không kiểm tra đúng chuẩn.", more: "a **consumer / media / food** watchdog · văn báo chí; Task 2 trang trọng hơn: **regulator**, regulatory body" },
          { w: "stringent", pos: "adj", ipa: "/ˈstrɪndʒənt/", vi: "nghiêm ngặt, chặt chẽ", ex: "Exporters must meet more stringent hygiene standards than producers for the local market.", exVi: "Nhà xuất khẩu phải đạt chuẩn vệ sinh nghiêm ngặt hơn nhà sản xuất cho thị trường trong nước.", more: "stringent **rules / standards / controls / checks** · band 7 thay cho “very strict” · stringently (adv)" },
        ],
      },
      {
        t: "quiz",
        id: "t4d26-tv-nhom-b",
        kind: "fill",
        title: "Điền MỘT từ của nhóm B — có thể phải đổi dạng (8 câu)",
        items: [
          { q: "1. Health officials traced the ___ of food poisoning to a school canteen.", answers: ["outbreak"], hint: "đợt bùng phát" },
          { q: "2. The supermarket has ___ all its frozen berries after a hepatitis warning.", answers: ["recalled"], hint: "has + V3 của recall" },
          { q: "3. Investigators found that the milk had been ___ with water and chalk.", answers: ["adulterated"], hint: "had been + V3" },
          { q: "4. Peanuts are one of the most dangerous food ___ for young children.", answers: ["allergens"], hint: "chất gây dị ứng — số nhiều" },
          { q: "5. Blockchain is being tested to make every carton of eggs ___ to the farm it came from.", answers: ["traceable"], hint: "tính từ của traceability" },
          { q: "6. ___ illnesses cost the country millions in lost working days every year.", answers: ["Foodborne", "foodborne", "Food-borne"], hint: "lây qua thực phẩm" },
          { q: "7. Consumer ___ such as the national food agency publish the results of every inspection.", answers: ["watchdogs"], hint: "cơ quan giám sát — số nhiều" },
          { q: "8. Without more ___ checks at the border, contaminated produce will keep reaching shops.", answers: ["stringent"], hint: "nghiêm ngặt" },
        ],
      },

      /* ── 3 ── */
      { t: "h", text: "3. Nhóm C — Báo chí vòng 2: đáng tin, giật gân, và ai trả tiền (10 từ)" },
      {
        t: "p",
        text: "Câu hỏi Part 3 kinh điển: ==“Do you think the news today is reliable?”==. Band 6 trả lời bằng bias và fake news (Tập 2 Ngày 18). Band 7 **phân biệt**: loại báo nào, lỗi nằm ở đâu (giật tít? thiếu tiền làm điều tra?), và ai giữ cửa thông tin.",
      },
      {
        t: "vocab",
        items: [
          { w: "tabloid", pos: "n / adj", ipa: "/ˈtæblɔɪd/", vi: "báo lá cải; kiểu lá cải", ex: "The tabloids devoted ten pages to the singer's divorce and one paragraph to the election.", exVi: "Báo lá cải dành mười trang cho vụ ly hôn của ca sĩ và một đoạn cho cuộc bầu cử.", more: "the tabloid press · tabloid journalism / headlines · ngược: **broadsheet** / quality press" },
          { w: "broadsheet", pos: "n", ipa: "/ˈbrɔːdʃiːt/", vi: "báo khổ lớn, báo nghiêm túc", ex: "Broadsheets tend to offer more analysis, although their headlines can be just as misleading.", exVi: "Báo nghiêm túc thường phân tích nhiều hơn, dù tít của họ cũng có thể gây hiểu lầm y như vậy.", more: "a broadsheet newspaper · dùng ở Anh; nói chung: the **quality press** / serious newspapers" },
          { w: "editorial", pos: "n / adj", ipa: "/ˌedɪˈtɔːriəl/", vi: "bài xã luận; thuộc về biên tập", ex: "The paper's editorial argued that the sugar tax had been a success.", exVi: "Bài xã luận của tờ báo lập luận rằng thuế đường đã thành công.", more: "**editorial independence / decisions / policy** · an editorial **on** sth · editor (người biên tập)" },
          { w: "impartial", pos: "adj", ipa: "/ɪmˈpɑːʃl/", vi: "vô tư, không thiên vị", ex: "Public broadcasters are legally required to be impartial in their coverage of elections.", exVi: "Đài truyền hình công được luật yêu cầu không thiên vị khi đưa tin bầu cử.", more: "impartiality (n) · impartial **advice / coverage / reporting** · gần nghĩa: unbiased, even-handed; ≠ biased" },
          { w: "sensationalise", pos: "v", ipa: "/senˈseɪʃənəlaɪz/", vi: "giật gân hoá, thổi phồng", ex: "By sensationalising rare attacks, the media make people fear the wrong things.", exVi: "Bằng cách giật gân hoá những vụ tấn công hiếm hoi, truyền thông khiến người ta sợ nhầm thứ.", more: "sensationalism (n) · sensationalist (adj): sensationalist headlines · Anh-Mỹ viết -ize" },
          { w: "investigative journalism", pos: "n", ipa: "/ɪnˈvestɪɡətɪv ˈdʒɜːnəlɪzəm/", vi: "báo chí điều tra", ex: "Investigative journalism is expensive, slow and rarely goes viral — which is why it is disappearing.", exVi: "Báo chí điều tra đắt, chậm và hiếm khi lan truyền rộng — đó là lý do nó đang biến mất.", more: "an investigative reporter · **expose** corruption / wrongdoing (phanh phui) · ⚠️ investigative /ɪnˈvestɪɡətɪv/, không phải ~~investigating journalism~~" },
          { w: "press freedom", pos: "n", ipa: "/ˈpres ˌfriːdəm/", vi: "tự do báo chí", ex: "Press freedom means little if most outlets are owned by the same three companies.", exVi: "Tự do báo chí chẳng mấy ý nghĩa nếu phần lớn cơ quan báo chí thuộc về cùng ba công ty.", more: "cũng nói: **freedom of the press** · media outlet (cơ quan truyền thông) · media ownership" },
          { w: "paywall", pos: "n", ipa: "/ˈpeɪwɔːl/", vi: "tường phí (phải trả tiền mới đọc được)", ex: "Quality reporting increasingly sits behind a paywall, while misinformation remains free.", exVi: "Tin bài chất lượng ngày càng nằm sau tường phí, trong khi tin sai vẫn miễn phí.", more: "**behind a paywall** · put up / introduce a paywall · nối subscription (Tập 2 Ngày 18)" },
          { w: "the 24-hour news cycle", pos: "n", ipa: "/ðə ˌtwenti fɔːr aʊə ˈnjuːz ˌsaɪkl/", vi: "vòng tin tức 24 giờ (tin phải ra liên tục, cả ngày)", ex: "The 24-hour news cycle rewards speed over accuracy.", exVi: "Vòng tin 24 giờ thưởng cho tốc độ hơn là độ chính xác.", more: "rolling news (tin chạy liên tục) · rewards / prioritises **speed over accuracy** (cụm Task 2 hay dùng)" },
          { w: "gatekeeper", pos: "n", ipa: "/ˈɡeɪtkiːpə/", vi: "người giữ cửa (quyết định thông tin nào được đến công chúng)", ex: "Editors used to be the gatekeepers of information; now algorithms play that role.", exVi: "Biên tập viên từng là người giữ cửa thông tin; giờ thuật toán đóng vai đó.", more: "act as a gatekeeper · gatekeeping (n) · nối algorithm (Tập 3 Ngày 18): algorithms **have replaced** editors as gatekeepers" },
        ],
      },
      {
        t: "mcq",
        id: "t4d26-tv-nhom-c",
        title: "Nhóm C — chọn từ đúng nghĩa và đúng collocation (6 câu)",
        items: [
          { q: "1. A newspaper known for celebrity gossip and dramatic headlines is a ___.", options: ["tabloid", "broadsheet", "editorial", "watchdog"], correct: 0, why: "Báo lá cải = tabloid. Broadsheet là báo nghiêm túc; editorial là bài xã luận; watchdog là cơ quan giám sát." },
          { q: "2. The BBC is required to report on elections in an ___ way.", options: ["sensational", "impartial", "investigative", "editorial"], correct: 1, why: "Không thiên vị = impartial. Sensational là giật gân — đúng ngược ý; investigative nói về điều tra, không nói về sự công bằng." },
          { q: "3. Most of the newspaper's best articles are now ___ a paywall.", options: ["under", "inside", "behind", "after"], correct: 2, why: "Collocation cố định: **behind a paywall** (nằm sau tường phí)." },
          { q: "4. Which sentence uses “sensationalise” correctly?", options: ["The report was sensationalise by the press.", "The press sensationalism the report.", "The report was sensational by the press.", "The press sensationalised the report."], correct: 3, why: "Động từ quá khứ: sensationalised. Câu A thiếu -d; câu B dùng danh từ làm động từ; câu C dùng tính từ sau “was … by”." },
          { q: "5. “Algorithms now decide which stories reach us.” Which word best describes the algorithms' role?", options: ["gatekeepers", "tabloids", "allergens", "broadsheets"], correct: 0, why: "Người / thứ quyết định thông tin nào lọt tới công chúng = gatekeeper." },
          { q: "6. “The 24-hour news cycle rewards speed ___ accuracy.”", options: ["than", "over", "to", "from"], correct: 1, why: "**reward / prioritise / value A over B** = coi A hơn B. ~~speed than accuracy~~ sai vì không có so sánh hơn." },
        ],
      },

      /* ── 4 ── */
      { t: "h", text: "4. Nhóm D — Quảng cáo vòng 2: len vào đâu, nhắm vào ai (10 từ)" },
      {
        t: "p",
        text: "Đề Task 2 hay gặp: ==“Advertising aimed at children should be banned. To what extent do you agree?”== — và Part 3: “How has advertising changed in recent years?”. Từ dưới đây gọi tên **thủ thuật** (product placement, sponsored content), **đối tượng** (pester power), và **luật chơi** (the watershed, disclaimer).",
      },
      {
        t: "vocab",
        items: [
          { w: "product placement", pos: "n", ipa: "/ˈprɒdʌkt ˌpleɪsmənt/", vi: "quảng cáo lồng ghép (sản phẩm xuất hiện trong phim, chương trình)", ex: "Viewers barely notice product placement, which is precisely why it works.", exVi: "Người xem hầu như không để ý quảng cáo lồng ghép, và đó chính là lý do nó hiệu quả.", more: "không đếm được · a product placement **deal** · brands **pay for** product placement in films" },
          { w: "pester power", pos: "n", ipa: "/ˈpestə ˌpaʊə/", vi: "“sức mạnh vòi vĩnh” (trẻ nài bố mẹ mua thứ đã thấy trên quảng cáo)", ex: "Toy companies deliberately exploit pester power in the weeks before Christmas.", exVi: "Các công ty đồ chơi cố ý khai thác chuyện trẻ vòi vĩnh trong những tuần trước Giáng sinh.", more: "pester (v): pester sb **to do / for** sth · exploit / harness pester power · cụm rất hợp đề quảng cáo cho trẻ em" },
          { w: "the watershed", pos: "n", ipa: "/ðə ˈwɔːtəʃed/", vi: "giờ ranh giới trên TV (sau giờ đó mới được chiếu nội dung / quảng cáo người lớn)", ex: "In the UK, adverts for junk food cannot be shown before the 9 p.m. watershed.", exVi: "Ở Anh, quảng cáo đồ ăn vặt không lành mạnh không được chiếu trước giờ ranh giới 9 giờ tối.", more: "before / after the watershed · nghĩa khác: **a watershed moment** (bước ngoặt) · junk food = HFSS food (nhiều béo, muối, đường)" },
          { w: "disclaimer", pos: "n", ipa: "/dɪsˈkleɪmə/", vi: "lời miễn trừ, dòng chú thích (“đây là quảng cáo”, “kết quả có thể khác”)", ex: "The disclaimer was printed in letters so small that nobody could read it.", exVi: "Dòng miễn trừ được in chữ nhỏ tới mức không ai đọc nổi.", more: "include / add a disclaimer · **the small print** (phần chữ nhỏ) · disclaim (v — trang trọng)" },
          { w: "sponsored content", pos: "n", ipa: "/ˈspɒnsəd ˈkɒntent/", vi: "nội dung được tài trợ (bài / video trả tiền nhưng trông như nội dung thường)", ex: "Many teenagers cannot tell the difference between a review and sponsored content.", exVi: "Nhiều thiếu niên không phân biệt được một bài đánh giá với nội dung được tài trợ.", more: "không đếm được · a sponsored post · nối influencer, sponsor (Tập 2 Ngày 18) · ⚠️ content /ˈkɒntent/ (n) ≠ content /kənˈtent/ (adj — hài lòng)" },
          { w: "covert", pos: "adj", ipa: "/ˈkʌvət/", vi: "ngầm, giấu giếm", ex: "Paying influencers without saying so is a covert form of advertising.", exVi: "Trả tiền cho người có ảnh hưởng mà không nói ra là một kiểu quảng cáo ngầm.", more: "covert **advertising / marketing / operation** ≠ **overt** (công khai) · cũng đọc /ˈkəʊvɜːt/" },
          { w: "data harvesting", pos: "n", ipa: "/ˈdeɪtə ˌhɑːvɪstɪŋ/", vi: "thu gom dữ liệu người dùng (thường để nhắm quảng cáo)", ex: "Free apps pay for themselves through data harvesting rather than subscriptions.", exVi: "Ứng dụng miễn phí tự nuôi mình bằng việc thu gom dữ liệu chứ không phải thuê bao.", more: "harvest **personal data** · targeted / personalised advertising · nối digital footprint, privacy (Tập 3 Ngày 18)" },
          { w: "ad revenue", pos: "n", ipa: "/ˈæd ˌrevənjuː/", vi: "doanh thu quảng cáo", ex: "As ad revenue moved to social media, local newspapers closed one after another.", exVi: "Khi doanh thu quảng cáo chuyển sang mạng xã hội, báo địa phương đóng cửa lần lượt.", more: "cũng nói: advertising revenue · **depend on / rely on** ad revenue · revenue không đếm được ở nghĩa chung" },
          { w: "aspirational", pos: "adj", ipa: "/ˌæspəˈreɪʃənl/", vi: "khơi khát vọng (gợi lối sống người xem muốn có)", ex: "Aspirational advertising sells a lifestyle rather than a product.", exVi: "Quảng cáo khơi khát vọng bán một lối sống chứ không phải một sản phẩm.", more: "aspiration (n) · aspirational **brands / lifestyle / images** · sắc thái trung tính, đôi khi phê phán" },
          { w: "saturated", pos: "adj", ipa: "/ˈsætʃəreɪtɪd/", vi: "bão hoà, ngập (tràn ngập thứ gì)", ex: "Children today grow up in a media environment saturated with advertising.", exVi: "Trẻ em ngày nay lớn lên trong một môi trường truyền thông ngập quảng cáo.", more: "**saturated with** sth · a saturated market (thị trường bão hoà) · saturate (v) · saturation (n)" },
        ],
      },
      {
        t: "quiz",
        id: "t4d26-tv-nhom-d",
        kind: "fill",
        title: "Điền MỘT từ / cụm của nhóm D (7 câu)",
        items: [
          { q: "1. The hero drinks the same brand of cola in every scene — a clear case of product ___.", answers: ["placement"], hint: "product ___" },
          { q: "2. Advertisers know that a child who nags will often win; this is called pester ___.", answers: ["power"], hint: "pester ___" },
          { q: "3. Programmes containing strong violence may only be shown after the 9 p.m. ___.", answers: ["watershed"], hint: "giờ ranh giới trên TV" },
          { q: "4. The video looked like an honest review, but it was actually sponsored ___.", answers: ["content"], hint: "sponsored ___" },
          { q: "5. Placing products in a film without telling viewers is a form of ___ advertising.", answers: ["covert"], hint: "ngầm ≠ overt" },
          { q: "6. Our cities are so ___ with advertising that we no longer notice it.", answers: ["saturated"], hint: "be ___ with" },
          { q: "7. A small ___ at the bottom of the advert said “results may vary”.", answers: ["disclaimer"], hint: "dòng miễn trừ" },
        ],
      },

      /* ── 5 ── */
      { t: "h", text: "5. Sáu cặp dễ nhầm — lỗi nhỏ, giám khảo thấy ngay" },
      {
        t: "table",
        head: ["Cặp", "Khác nhau ở đâu", "Câu đúng"],
        rows: [
          ["**food safety** · **food security**", "safety = thức ăn **không gây hại**; security = **đủ** thức ăn, mua được (Tập 2 Ngày 12)", "Drought threatens food **security**; a bacterial outbreak is a food **safety** issue."],
          ["**advertising** · **advertisement / advert / ad**", "advertising = ngành / hoạt động — **không đếm được**; advertisement = một mẩu quảng cáo — đếm được", "~~Advertisings are everywhere.~~ → **Advertising is** everywhere. / **Adverts are** everywhere."],
          ["**news**", "luôn **không đếm được**, động từ số ít", "~~a news~~ → **a piece of news / a news story** · The news **is** depressing."],
          ["**the media**", "có thể đi động từ số nhiều (trang trọng) hoặc số ít (thông dụng) — chọn một và giữ suốt bài", "The media **have / has** a responsibility to… (đừng đổi giữa bài)"],
          ["**processed** · **ultra-processed**", "processed = có qua chế biến (cả sữa tiệt trùng); ultra-processed = nhiều thành phần công nghiệp", "Frozen peas are processed but not **ultra-processed**."],
          ["**biased** · **prejudiced** · **partial**", "biased = nghiêng về một phía (tin, bài); prejudiced = định kiến với một **nhóm người**; partial (trang trọng) = thiên vị — và còn nghĩa “một phần”", "a **biased** report · **prejudiced against** migrants · a **partial** solution (giải pháp một phần)"],
        ],
      },
      {
        t: "note",
        title: "⚠️ Bốn lỗi tinh người Việt hay sai với hai chủ đề này",
        items: [
          "~~The government should control food safety strictly.~~ → **regulate** food safety / **enforce** food safety standards. “Control” nghe như kiểm soát bằng tay; band 7 dùng động từ của **chính sách**.",
          "~~Media affects to children.~~ → The media **affect / influence** children (ngoại động từ, không giới từ) · has **an effect on** / **an influence on** children.",
          "~~Advertising makes children want to buy.~~ (thiếu tân ngữ) → … makes children **want things they do not need** / **pester their parents for** …",
          "~~Factory farming is cruel to animals and also bad.~~ (chung chung) → Factory farming **raises serious animal welfare concerns** and **contributes to antibiotic resistance**. Band 7 = gọi đúng tên từng hệ quả.",
        ],
      },
      {
        t: "mcq",
        id: "t4d26-tv-de-nham",
        title: "Cặp dễ nhầm — chọn câu / từ đúng (6 câu)",
        items: [
          { q: "1. Which sentence is correct?", options: ["There are too many advertisings on television.", "There is too much advertising on television.", "There is too many advertisement on television.", "There are too much adverts on television."], correct: 1, why: "advertising không đếm được ⇒ much + is. Muốn đếm thì: too many adverts / advertisements + are." },
          { q: "2. “Millions of people in the region do not have enough to eat.” This is a problem of food ___.", options: ["safety", "fraud", "labelling", "security"], correct: 3, why: "Thiếu ăn = food **security**. Food safety là thức ăn có gây hại hay không." },
          { q: "3. “I heard ___ about the factory closing.”", options: ["a news", "some news", "many news", "a few news"], correct: 1, why: "news không đếm được: some news / a piece of news. Không có a news, many news, a few news." },
          { q: "4. Which sentence uses “partial” in the sense of “not complete”?", options: ["The referee was accused of being partial.", "She is partial to chocolate.", "The new rule is only a partial solution.", "The judge must not be partial."], correct: 2, why: "a partial solution = giải pháp một phần. A và D là nghĩa thiên vị; B là thành ngữ “thích”." },
          { q: "5. Choose the best band 7 phrasing.", options: ["The government should enforce more stringent food safety standards.", "The government should control food safety more.", "The government should make food safety more strict.", "The government should do food safety better."], correct: 0, why: "enforce + stringent + standards là collocation chuẩn của văn chính sách; ba câu kia chung chung hoặc sai collocation." },
          { q: "6. “The news ___ very depressing these days.”", options: ["were", "are", "have been", "is"], correct: 3, why: "news + động từ số ít: The news **is**…" },
        ],
      },

      /* ── 6 ── */
      { t: "h", text: "6. Dùng ngay: câu Task 2 và Part 3 với từ hôm nay" },
      {
        t: "examples",
        items: [
          { en: "While factory farming has made protein affordable for millions, the savings are partly illusory, since the costs reappear as antibiotic resistance and environmental damage.", vi: "Dù chăn nuôi công nghiệp làm đạm rẻ đi với hàng triệu người, khoản tiết kiệm phần nào là ảo, vì cái giá quay lại dưới dạng kháng kháng sinh và tổn hại môi trường." },
          { en: "Responsibility for food safety cannot rest with consumers alone: no shopper can detect an adulterated product by looking at it.", vi: "Trách nhiệm an toàn thực phẩm không thể chỉ đặt lên người tiêu dùng: không người mua nào phát hiện được sản phẩm bị pha trộn chỉ bằng mắt." },
          { en: "Better traceability would not prevent every outbreak, but it would allow contaminated batches to be recalled within hours rather than weeks.", vi: "Truy xuất tốt hơn không ngăn được mọi đợt bùng phát, nhưng sẽ cho phép thu hồi các lô nhiễm bẩn trong vài giờ thay vì vài tuần." },
          { en: "The problem is not that tabloids sensationalise; it is that the 24-hour news cycle now pressures every outlet to do the same.", vi: "Vấn đề không phải là báo lá cải giật gân; mà là vòng tin 24 giờ giờ đây ép mọi cơ quan báo chí làm y như vậy." },
          { en: "As ad revenue has drained away from newspapers, investigative journalism has become a luxury that few can afford.", vi: "Khi doanh thu quảng cáo chảy khỏi báo in, báo chí điều tra trở thành món xa xỉ mà ít tờ báo kham nổi." },
          { en: "Banning advertising aimed at children would curb pester power, although covert forms such as product placement would be far harder to regulate.", vi: "Cấm quảng cáo nhắm vào trẻ em sẽ kiềm chế được chuyện vòi vĩnh, dù các hình thức ngầm như quảng cáo lồng ghép sẽ khó quản lý hơn nhiều." },
        ],
      },
      {
        t: "quiz",
        id: "t4d26-tv-dich",
        kind: "translate",
        title: "Dịch sang tiếng Anh — dùng từ trong gợi ý (5 câu)",
        grammar: "Câu Task 2 band 7: một mệnh đề nhượng bộ / đối lập + collocation của bài.",
        items: [
          { q: "1. Thực phẩm siêu chế biến rẻ và tiện, nhưng chúng thường chứa nhiều phụ gia hơn người mua nhận ra.", answers: ["Ultra-processed foods are cheap and convenient, but they often contain more additives than shoppers realise.", "Ultra-processed food is cheap and convenient, but it often contains more additives than shoppers realise.", "Ultra-processed foods are cheap and convenient, but they often contain more additives than consumers realise.", "Ultra-processed foods are cheap and convenient, but they often contain more additives than buyers realise."], hint: "ultra-processed · additives · than shoppers realise" },
          { q: "2. Công ty đã thu hồi toàn bộ lô hàng sau một đợt bùng phát ngộ độc thực phẩm.", answers: ["The company recalled the entire batch after an outbreak of food poisoning.", "The company recalled the whole batch after an outbreak of food poisoning.", "The company recalled the entire batch after a food poisoning outbreak.", "The company recalled the whole batch after a food poisoning outbreak."], hint: "recall · batch · an outbreak of food poisoning" },
          { q: "3. Đài truyền hình công phải không thiên vị, kể cả khi đưa tin về chính phủ.", answers: ["Public broadcasters must be impartial, even when reporting on the government.", "Public broadcasters must be impartial, even when they report on the government.", "Public broadcasters have to be impartial, even when reporting on the government.", "A public broadcaster must be impartial, even when reporting on the government."], hint: "public broadcasters · impartial · report on" },
          { q: "4. Nhiều bài báo hay nhất hiện nằm sau tường phí.", answers: ["Many of the best articles are now behind a paywall.", "Many of the best articles now sit behind a paywall.", "Many of the best articles are now behind paywalls.", "Many of the best newspaper articles are now behind a paywall."], hint: "behind a paywall" },
          { q: "5. Trẻ em lớn lên trong một thế giới ngập quảng cáo, phần lớn trong đó là quảng cáo ngầm.", answers: ["Children grow up in a world saturated with advertising, much of which is covert.", "Children are growing up in a world saturated with advertising, much of which is covert.", "Children grow up in a world saturated with advertising, most of which is covert.", "Children are growing up in a world saturated with advertising, most of which is covert."], hint: "saturated with · much of which is covert" },
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI 2 — VIẾT ═══════════════════════════ */
  {
    id: "t4d26-viet",
    kind: "writing",
    title: "Viết ứng dụng: Cover letter + email formal nâng cao (nhắc lần 2 · phàn nàn · từ chối · xin gia hạn)",
    goal: "Viết được một cover letter 250–300 từ khớp từng yêu cầu của tin tuyển dụng bằng bằng chứng có số đo, và một email formal khó (nhắc thanh toán lần 2, phàn nàn, từ chối, xin gia hạn) vừa lịch sự vừa cứng rắn, giữ một văn phong suốt bài — đúng những gì band 7 đòi ở Task Achievement (mục đích rõ, giọng nhất quán), CC (mỗi đoạn một việc) và LR (từ đúng văn phong).",
    minutes: 95,
    blocks: [
      {
        t: "recap",
        items: [
          "**Vì sao học thư ở khoá Academic?** Thi Academic không có thư — thư là **Task 1 của General Training**. Nhưng email và cover letter là thứ bạn viết **thật** khi xin thực tập, và nó luyện đúng hai thứ band 7 chấm ở mọi bài: ==văn phong nhất quán== (LR) và ==mỗi đoạn một việc== (CC).",
          "Ôn từ **Tập 2 Ngày 24**: email 5 phần (Subject · chào · lý do viết · nội dung + đề nghị · kết), formal vs informal. Tập 3 Ngày 26 dùng khung đó cho **báo cáo ngắn**. Hôm nay nâng lên hai thể khó nhất: **cover letter** và **email có xung đột**.",
          "Cover letter band 7 = ==mỗi yêu cầu của tin tuyển dụng một bằng chứng== (việc bạn làm + kết quả có số), không phải danh sách tính từ “hard-working, responsible”. Khung STAR của Tập 3 Ngày 18 mục 4 rút gọn thành **Việc → Làm gì → Kết quả**.",
          "Email khó band 7 = **lịch sự mà không yếu**: một câu ghi nhận phía bên kia (I appreciate that…), một đề nghị có hạn chót, một bước tiếp theo nói rõ — không đe doạ, không năn nỉ.",
          "Hai bài mẫu band 6 và band 7 đặt cạnh nhau cho mỗi thể, chấm theo 4 tiêu chí (TA · CC · LR · GRA). Cuối bài: viết 2 bài cho AI chấm.",
        ],
      },

      /* ── 1 ── */
      { t: "h", text: "1. Band 6 và band 7 khác nhau ở đâu trong một bức thư trang trọng" },
      {
        t: "table",
        head: ["Tiêu chí", "Band 6", "Band 7"],
        rows: [
          ["**TA** — làm đúng việc", "Đủ mọi gạch đầu dòng nhưng có ý chỉ **nêu** (I have good communication skills); giọng đôi chỗ lệch (quá thân hoặc quá gắt)", "Mọi gạch đầu dòng được **mở rộng có bằng chứng**; mục đích rõ từ câu 1; **giọng nhất quán** và hợp người nhận suốt thư"],
          ["**CC** — mạch, liên kết", "Firstly / Secondly / Thirdly; đoạn ghép nhiều việc", "Mỗi đoạn một việc, câu đầu đoạn **nói việc đó** (The role calls for…); tham chiếu (The same project…, this) thay cho từ nối đếm số"],
          ["**LR** — từ", "Tính từ tự khen, cụm thân mật (a lot of, really, big and famous)", "Động từ hành động (led, exposed, replaced, reduced), collocation trang trọng (I would welcome the opportunity to…)"],
          ["**GRA** — ngữ pháp", "Lỗi lặp: look forward to ~~hear~~, nối hai câu bằng dấu phẩy, ~~reply me~~", "Câu phức đa dạng (When…, I…; after which…), đa số câu không lỗi, dấu câu chuẩn"],
        ],
        caption: "Tiêu chí lấy theo bảng chấm công khai của Task 1 General Training (thư). AI chấm bài cuối buổi theo đúng 4 tiêu chí này.",
      },

      /* ── 2 ── */
      { t: "h", text: "2. Cover letter là gì — và khung 5 đoạn" },
      {
        t: "p",
        text: "**Cover letter** (thư xin việc / thư ứng tuyển) đi kèm CV. CV trả lời “bạn đã làm gì”; cover letter trả lời ==“vì sao những việc đó khớp với ĐÚNG công việc này”==. Người tuyển dụng đọc một bức thư khoảng 30 giây — nên mỗi đoạn phải làm đúng một việc, và đoạn nào cũng nói về **họ** nhiều như nói về **bạn**.",
      },
      {
        t: "sodo",
        kind: "flow",
        title: "Cover letter 250–300 từ — 5 đoạn",
        steps: [
          { label: "① Mở (2 câu)", sub: "Vị trí + thấy tin ở đâu · **một câu giá trị**: bạn là ai + điều nổi bật nhất khớp với việc" },
          { label: "② Bằng chứng 1 — kỹ năng chuyên môn", sub: "Câu đầu nhắc yêu cầu của tin (The role calls for…) → một việc cụ thể → kết quả có số" },
          { label: "③ Bằng chứng 2 — kỹ năng mềm / ngôn ngữ", sub: "Cùng cách: yêu cầu → việc → kết quả. Nối với đoạn ② bằng tham chiếu (The same project also…)" },
          { label: "④ Vì sao công ty NÀY", sub: "Một chi tiết riêng của công ty (khách hàng, sản phẩm, chương trình) — không “big and famous”" },
          { label: "⑤ Kết", sub: "Gửi kèm gì · lời mời trao đổi · lịch rảnh · Yours sincerely (đã biết tên)" },
        ],
        caption: "Ôn Tập 2 Ngày 24: Subject + lời chào + câu lý do viết vẫn y như email. Khác ở chỗ: đoạn ② – ③ là bằng chứng, không phải nội dung yêu cầu.",
      },
      {
        t: "table",
        head: ["Bước", "Hỏi gì", "Câu mẫu"],
        rows: [
          ["**Việc** (tình huống)", "Ở đâu, khi nào, vai gì?", "Last semester, I **led** a team of four in developing a booking app for a dental clinic."],
          ["**Làm gì** (hành động của BẠN)", "Bạn — không phải “we” — đã làm gì?", "I **wrote** a set of automated tests that **exposed** a time-zone error."],
          ["**Kết quả** (có số)", "Thay đổi gì, đo bằng gì?", "After the fix, **no** double bookings were recorded during the remaining two months."],
        ],
        caption: "STAR của Tập 3 Ngày 18 (phỏng vấn) rút còn 3 bước cho thư: chữ viết cần gọn hơn lời nói.",
      },
      {
        t: "rule",
        formula: "The role calls for + N. · Last [time], I + V2 (hành động) + …, which / after which + kết quả có số.",
        vi: "Mỗi đoạn bằng chứng: nhắc lại yêu cầu của tin → việc bạn đã làm → kết quả đo được.",
      },

      /* ── 3 ── */
      { t: "h", text: "3. Từ tự khen sang bằng chứng — bảng đổi câu" },
      {
        t: "table",
        head: ["Band 6 (nêu)", "Band 7 (chứng minh)"],
        rows: [
          ["I am a hard-working and responsible person.", "I **delivered** all three modules of the project ahead of schedule while working part-time."],
          ["I have good communication skills.", "I **replaced** a 20-page manual with a one-page visual guide, **after which** support requests **fell from** ten a week **to** two."],
          ["I am good at teamwork.", "I **coordinated** a team of four across two campuses, **running** weekly stand-ups online."],
          ["I have a lot of experience in web development.", "I **have built** three web applications, **one of which** is now used daily by a clinic in Hoi An."],
          ["Your company is big and famous.", "I am **particularly drawn to** Northbridge **because** your software serves clinics — the very type of client I have learned to work with."],
          ["I hope you will consider me.", "I **would welcome the opportunity to** discuss how I could contribute to your team."],
        ],
      },
      {
        t: "note",
        title: "⚠️ Bảy lỗi thư người Việt hay sai",
        items: [
          "~~Dear Ms Rachel Owens,~~ → **Dear Ms Owens,** (danh xưng + **họ**). Không biết tên → **Dear Hiring Manager,** (hiện đại) hoặc Dear Sir or Madam.",
          "Biết tên mà kết ~~Yours faithfully~~ → **Yours sincerely**. Faithfully chỉ đi với Dear Sir or Madam. Kind regards dùng được cho cả hai.",
          "~~I look forward to hear from you.~~ → look forward **to hearing** (to là giới từ ⇒ V-ing).",
          "~~Please kindly reply me.~~ → I would be grateful for a reply. / I look forward to your reply. (reply **to** sb; please và kindly đứng chung là thừa).",
          "~~I am writing this letter to…~~ → **I am writing to…** (ngắn, chuẩn). ~~I write to…~~ sai thì.",
          "~~Hope you are fine.~~ / ~~Hope this email finds you well.~~ trong thư gửi người lạ — bỏ; vào thẳng mục đích.",
          "Một chữ ~~revert~~ (= reply) là tiếng Anh văn phòng Ấn Độ – Đông Nam Á; người đọc bản ngữ hiểu là “quay về trạng thái cũ”. Dùng **reply / get back to me**.",
        ],
      },

      /* ── 4 ── */
      { t: "h", text: "4. Email formal nâng cao — bốn tình huống khó" },
      {
        t: "p",
        text: "Email dễ là email xin thông tin. Email **khó** là khi có **xung đột**: bạn cần tiền, cần người ta sửa sai, cần nói “không”, hay cần xin thêm thời gian. Band 6 thường rơi vào một trong hai cực: ==quá gắt== (You must pay me now.) hoặc ==quá yếu== (Sorry to disturb you, if possible maybe you can…). Band 7 giữ đúng giữa: **ghi nhận → nêu sự việc → đề nghị có hạn → bước tiếp theo**.",
      },
      {
        t: "table",
        head: ["Tình huống", "Mở", "Đề nghị / giữ lập trường", "Kết"],
        rows: [
          ["**Nhắc lần 2** (chasing)", "I am writing to **follow up on** my email of 7 November **regarding** invoice 0417.", "I would be grateful if you could **confirm when** payment will be made **by** 25 November.", "**Should I not hear from you by then**, I will need to refer the matter to…"],
          ["**Phàn nàn** (complaint)", "I wish to **draw your attention to** a problem with…", "**Although I appreciate that** …, I was disappointed to find that … I would therefore ask that you…", "I trust that this can be **resolved promptly**."],
          ["**Từ chối** (decline)", "Thank you for offering me…", "**Having given it careful consideration**, I have decided to decline…, as…", "I hope **our paths cross again** in the future."],
          ["**Xin gia hạn** (extension)", "I am writing to request a short extension to the deadline for…", "**owing to** … I appreciate that this may cause inconvenience, and I **would be happy to** …", "Thank you for considering this request."],
        ],
      },
      {
        t: "patterns",
        rows: [
          { formula: "I appreciate that + S + V. However, I would be grateful if you could + V … by + mốc.", vi: "Ghi nhận khó khăn của người nhận RỒI mới đề nghị — lịch sự mà không lùi.", examples: [{ en: "I appreciate that the start of term is a busy time. However, I would be grateful if you could confirm a payment date by 25 November.", vi: "Tôi hiểu đầu học kỳ là thời điểm bận. Tuy nhiên, tôi rất biết ơn nếu anh có thể xác nhận ngày thanh toán trước 25/11." }] },
          { formula: "Should + S + V (not) …, I will (need to) + V …", vi: "Điều kiện đảo ngữ (= If … ) — nêu bước tiếp theo mà không đe doạ.", examples: [{ en: "Should the problem continue, I will need to contact your customer services manager.", vi: "Nếu vấn đề còn tiếp diễn, tôi sẽ cần liên hệ với quản lý chăm sóc khách hàng của quý công ty." }] },
          { formula: "Having + V3 …, S + V …", vi: "Mệnh đề phân từ hoàn thành — trang trọng, gọn, hợp câu từ chối.", examples: [{ en: "Having given the offer careful consideration, I have decided to accept a position closer to my family.", vi: "Sau khi cân nhắc kỹ lời mời, tôi quyết định nhận một vị trí gần gia đình hơn." }] },
        ],
      },
      {
        t: "sodo",
        kind: "compare",
        title: "Thang giọng điệu — cùng một đề nghị",
        cols: [
          { title: "Quá gắt (band 6 — lệch giọng)", anh: "frowning-face", items: ["You must pay me immediately.", "This is unacceptable and I am very angry.", "If you don't pay, I will take action."] },
          { title: "Đúng mức (band 7)", anh: "handshake", items: ["I would be grateful if you could arrange payment by 25 November.", "I was disappointed to find that…", "Should I not hear from you by then, I will need to…"] },
          { title: "Quá yếu (band 6 — mất mục đích)", anh: "sweat-droplets", items: ["Sorry to disturb you, if possible maybe you can pay…", "I know you are very busy so no problem if not.", "Please kindly consider paying me when convenient."] },
        ],
        caption: "TA band 7 đòi “giọng phù hợp và nhất quán”. Gắt quá hay yếu quá đều là lệch giọng.",
      },
      {
        t: "rule",
        formula: "Ghi nhận (I appreciate that…) → Sự việc (ngày, số, tài liệu) → Đề nghị + hạn (I would be grateful if… by…) → Bước tiếp (Should I not…, I will need to…)",
        vi: "Bốn nhịp của email có xung đột: lịch sự ở nhịp 1, cứng rắn ở nhịp 3 – 4.",
      },
      {
        t: "quiz",
        id: "t4d26-viet-dich",
        kind: "translate",
        title: "Dịch Việt → Anh — câu khung thư trang trọng (5 câu)",
        grammar: "Văn phong formal: không viết tắt, đề nghị gián tiếp, mệnh đề phân từ / đảo ngữ đúng chỗ.",
        items: [
          { q: "1. Tôi viết thư này để ứng tuyển vị trí Lập trình viên mới tốt nghiệp được đăng trên trang tuyển dụng của quý công ty.", answers: ["I am writing to apply for the Graduate Software Developer position advertised on your careers page.", "I am writing to apply for the position of Graduate Software Developer advertised on your careers page.", "I am writing to apply for the Graduate Software Developer position advertised on your company's careers page.", "I am writing to apply for the Graduate Software Developer position advertised on your careers website."], hint: "I am writing to apply for … advertised on …" },
          { q: "2. Tôi viết để hỏi lại về email ngày 7 tháng 11 liên quan đến hoá đơn số 0417.", answers: ["I am writing to follow up on my email of 7 November regarding invoice 0417.", "I am writing to follow up on my email of 7 November regarding invoice number 0417.", "I am writing to follow up on my email of 7 November concerning invoice 0417.", "I am writing to follow up my email of 7 November regarding invoice 0417."], hint: "follow up on · my email of + ngày · regarding" },
          { q: "3. Tôi hiểu đây là thời điểm bận rộn; tuy nhiên, tôi rất biết ơn nếu anh có thể xác nhận ngày thanh toán.", answers: ["I appreciate that this is a busy time; however, I would be grateful if you could confirm the payment date.", "I appreciate that this is a busy time. However, I would be grateful if you could confirm the payment date.", "I appreciate that this is a busy time; however, I would be grateful if you could confirm a payment date.", "I appreciate that this is a busy time. However, I would be grateful if you could confirm a payment date."], hint: "I appreciate that … however, I would be grateful if you could …" },
          { q: "4. Sau khi cân nhắc kỹ, tôi đã quyết định từ chối lời mời làm việc.", answers: ["Having given it careful consideration, I have decided to decline the job offer.", "Having given it careful consideration, I have decided to decline the offer.", "Having considered it carefully, I have decided to decline the job offer.", "After careful consideration, I have decided to decline the job offer."], hint: "Having given it careful consideration, …" },
          { q: "5. Nếu tôi không nhận được phản hồi trước ngày đó, tôi sẽ cần liên hệ trực tiếp với phòng kế toán.", answers: ["Should I not hear from you by then, I will need to contact the accounts department directly.", "Should I not receive a reply by then, I will need to contact the accounts department directly.", "If I do not hear from you by then, I will need to contact the accounts department directly.", "Should I not hear from you by that date, I will need to contact the accounts department directly."], hint: "Should I not hear from you by then, …" },
        ],
      },

      /* ── 5 ── */
      { t: "h", text: "5. Phân tích đề cover letter và dàn ý 6 phút" },
      {
        t: "p",
        text: "**ĐỀ (tự soạn):** You have seen the job advertisement below. Write a cover letter (**250–300 words**) to apply. In your letter: ① say which position you are applying for and where you saw it; ② show how your experience matches **at least three** of the requirements; ③ explain why you want to work for **this** company; ④ say when you are available for an interview.",
      },
      {
        t: "table",
        head: ["NORTHBRIDGE DIGITAL — Graduate Software Developer (Da Nang)", ""],
        rows: [
          ["Về công ty", "We build booking and payment software for private clinics across Southeast Asia. New graduates rotate through our product and client-support teams in their first year."],
          ["Yêu cầu 1", "A final-year student or recent graduate in computing or a related field"],
          ["Yêu cầu 2", "Hands-on experience of building **and testing** web applications"],
          ["Yêu cầu 3", "The ability to explain technical problems clearly to **non-technical clients**"],
          ["Yêu cầu 4", "Confidence working **in English** within an international team"],
          ["Nộp cho", "Ms Rachel Owens, Talent Acquisition Manager · closing date 30 November"],
        ],
        caption: "Tin tuyển dụng tự soạn — công ty, người, số liệu đều hư cấu.",
      },
      {
        t: "table",
        head: ["Đoạn", "Việc", "Ghi chú dàn ý (từ khoá)"],
        rows: [
          ["① Mở", "Vế ① + câu giá trị", "Graduate SD · careers page · final-year SE · 1 năm làm booking system cho khách thật"],
          ["② Bằng chứng 1", "Yêu cầu 1 + 2 (đếm: “and testing” — đừng bỏ)", "dental clinic Hoi An · React + Node · lead team 4 · automated tests → time-zone bug → 0 double bookings / 2 tháng"],
          ["③ Bằng chứng 2", "Yêu cầu 3 + 4", "staff không rành kỹ thuật · manual 20 trang → 1 trang hình · 2 buổi tập huấn · 10 → 2 yêu cầu hỗ trợ/tuần · IELTS 7.0 · thuyết trình tiếng Anh"],
          ["④ Vì sao Northbridge", "Vế ③ — lấy từ dòng “Về công ty”", "khách là phòng khám (đúng loại mình quen) · chương trình xoay vòng product + support"],
          ["⑤ Kết", "Vế ④", "CV + link repo · would welcome the opportunity · rảnh sau 5/12 · Yours sincerely"],
        ],
      },
      {
        t: "note",
        title: "💡 Mẹo: đếm vế đề như Task 2 (ôn Tập 3 Ngày 6)",
        items: [
          "Bốn vế ①–④ + bốn yêu cầu của tin = 8 thứ phải có. Gạch từng thứ trên dàn ý trước khi viết.",
          "Yêu cầu 2 có **hai** việc (building **and** testing). Bài nói “I built many apps” mà không có testing là thiếu một nửa vế.",
          "Vế ③ “why THIS company” là chỗ band 6 hay viết chung chung. Lấy một chi tiết **chỉ công ty này có** từ chính tin tuyển dụng.",
        ],
      },

      /* ── 6 ── */
      { t: "h", text: "6. Bài mẫu band 6 (ước tính) — đủ ý, nhưng chỉ NÊU" },
      {
        t: "examples",
        items: [
          { en: "Dear Ms Rachel Owens,", vi: "[Chào — sai: danh xưng + cả tên lẫn họ]" },
          { en: "I am writing this letter to apply for the Graduate Software Developer position which I saw on your website. I am a final-year student of Software Engineering at a university in Da Nang and I am very interested in this job.", vi: "[Mở] Đủ vế ① nhưng câu 2 không nói điều gì khớp với việc." },
          { en: "Firstly, I have a lot of experience in web development. I have learned HTML, CSS, JavaScript, React, Node.js and SQL at university, and I have done many projects. I am also good at testing. I think my technical skills are really suitable for your company.", vi: "[Thân 1] Liệt kê công nghệ, không có dự án nào cụ thể; “good at testing” không có bằng chứng." },
          { en: "Secondly, I am a hard-working, responsible and friendly person. I have good communication skills and I can work well in a team. My English is also quite good, I got 6.5 IELTS last year, so I can work in an international environment.", vi: "[Thân 2] Tính từ tự khen; bỏ sót “giải thích cho khách không rành kỹ thuật”; nối hai câu bằng dấu phẩy." },
          { en: "Thirdly, I want to work for Northbridge Digital because it is a big and famous company and I can learn a lot of things from experienced developers. This job will help me to develop my career.", vi: "[Thân 3] Lý do dùng được cho mọi công ty; nói về lợi của MÌNH, không về họ." },
          { en: "I am available for an interview at any time. I hope you will consider my application. Thank you for reading my letter and I look forward to hear from you.", vi: "[Kết] look forward to ~~hear~~." },
          { en: "Yours faithfully, Tran Minh Khoa", vi: "[Ký] Đã biết tên người nhận ⇒ phải là Yours sincerely. (≈ 205 từ — dưới 250)" },
        ],
      },
      { t: "h", text: "7. Bài mẫu band 7 (ước tính) — cùng người viết, cùng kinh nghiệm" },
      {
        t: "p",
        text: "Cùng một sinh viên, cùng các dự án. Khác ở chỗ: ==mỗi yêu cầu một bằng chứng==, câu đầu đoạn nói đoạn đó làm gì, và một giọng trang trọng – tự tin suốt thư. Chữ in đậm là những chỗ đáng chép vào sổ.",
      },
      {
        t: "examples",
        items: [
          { en: "Subject: Application for Graduate Software Developer (Da Nang) — Tran Minh Khoa", vi: "[Tiêu đề] Vị trí + tên — người tuyển lọc email bằng dòng này." },
          { en: "Dear Ms Owens,", vi: "[Chào] Danh xưng + họ." },
          { en: "**I am writing to apply for** the Graduate Software Developer position **advertised on** Northbridge Digital's careers page. As a final-year Software Engineering student who has spent the past year building and testing a booking system for a real client, **I believe I could contribute to your team from the first week.**", vi: "[Mở] Tôi viết để ứng tuyển vị trí Lập trình viên mới tốt nghiệp đăng trên trang tuyển dụng của Northbridge Digital. Là sinh viên năm cuối ngành Kỹ thuật phần mềm đã dành một năm qua xây dựng và kiểm thử một hệ thống đặt lịch cho khách hàng thật, tôi tin mình có thể đóng góp cho nhóm ngay từ tuần đầu." },
          { en: "**The role calls for** hands-on experience of building and testing web applications. Last semester, **I led** a team of four in developing an appointment-booking app for a dental clinic in Hoi An, using React and Node.js. **When** the clinic reported that double bookings were still occurring, **I wrote** a set of automated tests that **exposed** a time-zone error in our scheduling logic; **after the fix, no double bookings were recorded** during the remaining two months of the pilot.", vi: "[Bằng chứng 1] Vị trí này cần kinh nghiệm thực tế xây dựng và kiểm thử ứng dụng web. Học kỳ trước, tôi dẫn một nhóm bốn người phát triển ứng dụng đặt lịch cho một phòng khám nha ở Hội An, dùng React và Node.js. Khi phòng khám báo vẫn còn tình trạng trùng lịch, tôi viết một bộ kiểm thử tự động làm lộ ra lỗi múi giờ trong logic xếp lịch; sau khi sửa, không còn ca trùng lịch nào trong hai tháng thử nghiệm còn lại." },
          { en: "**The same project taught me that** a solution is only as good as the client's understanding of it. The clinic staff had no technical background, so **I replaced** our twenty-page manual with a one-page visual guide and ran two short training sessions, **after which** support requests **fell from** around ten a week **to** two. I am comfortable doing this in English: I achieved an overall band of 7.0 in IELTS this year and presented the project, in English, to visiting lecturers from Australia.", vi: "[Bằng chứng 2] Chính dự án đó dạy tôi rằng một giải pháp chỉ tốt bằng mức khách hàng hiểu nó. Nhân viên phòng khám không có nền kỹ thuật, nên tôi thay cuốn hướng dẫn hai mươi trang bằng một trang hướng dẫn bằng hình và tổ chức hai buổi tập huấn ngắn, sau đó số yêu cầu hỗ trợ giảm từ khoảng mười xuống hai mỗi tuần. Tôi làm việc này thoải mái bằng tiếng Anh: năm nay tôi đạt IELTS 7.0 và đã trình bày dự án bằng tiếng Anh trước các giảng viên thỉnh giảng từ Úc." },
          { en: "**I am particularly drawn to** Northbridge **because** your software serves clinics — the very type of client I have learned to work with — and because your graduate programme rotates new developers through both product and client-support teams.", vi: "[Vì sao công ty này] Tôi đặc biệt bị thu hút bởi Northbridge vì phần mềm của quý công ty phục vụ các phòng khám — đúng loại khách hàng tôi đã học cách làm việc cùng — và vì chương trình dành cho người mới tốt nghiệp cho lập trình viên luân chuyển qua cả nhóm sản phẩm lẫn nhóm hỗ trợ khách hàng." },
          { en: "I have attached my CV and a link to the project repository. **I would welcome the opportunity to discuss** my application and am available for an interview at any time after 5 December.", vi: "[Kết] Tôi gửi kèm CV và đường dẫn tới kho mã dự án. Tôi rất mong có cơ hội trao đổi về hồ sơ của mình và có thể phỏng vấn bất kỳ lúc nào sau ngày 5/12." },
          { en: "Yours sincerely, Tran Minh Khoa", vi: "[Ký] ≈ 300 từ (kể cả dòng tiêu đề)." },
        ],
      },
      {
        t: "table",
        head: ["Tiêu chí", "Bài band 6", "Bài band 7"],
        rows: [
          ["**TA**", "Đủ 4 vế nhưng yêu cầu 3 (khách không rành kỹ thuật) bị bỏ; “why this company” chung chung; dưới 250 từ", "Cả 4 yêu cầu có bằng chứng, có số (0 ca trùng · 10 → 2); lý do lấy đúng từ tin tuyển dụng; đủ độ dài"],
          ["**CC**", "Firstly / Secondly / Thirdly; mỗi đoạn ghép nhiều ý", "Câu đầu đoạn nêu việc của đoạn (The role calls for…); tham chiếu nối đoạn (The same project…, after which)"],
          ["**LR**", "a lot of, really, big and famous, good at; tính từ tự khen", "led, exposed, replaced, rotates, particularly drawn to, would welcome the opportunity — đúng văn phong"],
          ["**GRA**", "Nối câu bằng dấu phẩy; look forward to hear; Yours faithfully sai chỗ", "Câu phức đa dạng (When…, I…; a solution is only as good as…; after which…), không lỗi đáng kể"],
        ],
      },

      /* ── 8 ── */
      { t: "h", text: "8. Email nhắc lần 2 — band 6 và band 7 cho cùng một tình huống" },
      {
        t: "p",
        text: "**Tình huống (tự soạn):** Bạn làm tự do (freelance) thiết kế lại website cho **Lotus Language Centre**. Website bàn giao ngày 15/10, hoá đơn số **0417** đến hạn **31/10**. Ngày **7/11** bạn đã gửi email nhắc, chưa ai trả lời. Viết cho giám đốc, **Mr David Hale**: nhắc lại email trước và hoá đơn; nhắc việc đã giao; đề nghị thanh toán hoặc báo ngày; nói bước tiếp theo nếu không có hồi âm.",
      },
      {
        t: "sodo",
        kind: "compare",
        title: "Cùng tình huống, hai bức email",
        cols: [
          {
            title: "Band 6 (ước tính) — ≈ 125 từ",
            anh: "envelope",
            items: [
              "Dear Mr Hale, I am writing to you about my invoice. I sent you an email on 7 November but you did not reply me. The invoice was for the website I made for your centre and you had to pay it before 31 October. Now it is late more than two weeks.",
              "I finished all the work on time and your staff said the website was very good. So I don't understand why you have not paid me yet. Please pay me as soon as possible.",
              "If you don't pay me before 25 November, I will have to take other actions. I hope you understand my situation. Thank you. Best regards, Tran Minh Khoa",
            ],
          },
          {
            title: "Band 7 (ước tính) — ≈ 185 từ",
            anh: "check-mark-button",
            items: [
              "Subject: Invoice 0417 — second reminder (due 31 October) · Dear Mr Hale, **I am writing to follow up on** my email of 7 November **regarding** invoice 0417 for the redesign of the Lotus Language Centre website, which **was due for payment** on 31 October. As I have not yet received a reply, I wanted to check that the invoice reached the right person.",
              "**For ease of reference**, I have attached the invoice again, together with the sign-off email from your office manager confirming that the site was delivered on 15 October.",
              "**I appreciate that** the start of term is a busy time for the centre. **However, I would be grateful if you could** either arrange payment or let me know when it is likely to be made **by 25 November**. If there is a problem with the invoice itself, I would be happy to discuss it by phone.",
              "**Should I not hear from you by then**, I will need to refer the matter to the centre's accounts department directly. Thank you for your attention to this. Kind regards, Tran Minh Khoa",
            ],
          },
        ],
        caption: "Band 6 đủ ý nhưng gắt ở đoạn 2 – 3 (So I don't understand why…, take other actions — đe doạ mơ hồ) rồi lại xin lỗi ở câu cuối: giọng chao đảo. Band 7: cho người nhận một lối ra (có thể hoá đơn gửi nhầm người), đưa bằng chứng, hạn chót rõ, bước tiếp theo cụ thể.",
      },
      {
        t: "table",
        head: ["Tiêu chí", "Band 6", "Band 7"],
        rows: [
          ["**TA**", "Đủ 4 việc; giọng **không nhất quán** (trách → đe doạ → “hope you understand”)", "Đủ 4 việc; giọng lịch sự – cứng rắn từ đầu tới cuối; bước tiếp theo cụ thể"],
          ["**CC**", "Đoạn 1 trộn sự việc và trách móc", "Mỗi đoạn một việc: nhắc lại → bằng chứng → đề nghị → bước tiếp"],
          ["**LR**", "take other actions (mơ hồ, sai số nhiều), very good", "follow up on, due for payment, for ease of reference, refer the matter to"],
          ["**GRA**", "~~reply me~~, ~~it is late more than two weeks~~", "Đảo ngữ Should I not…, mệnh đề quan hệ which was due…, không lỗi"],
        ],
      },

      /* ── 9 ── */
      { t: "h", text: "9. Câu khung dùng lại + bảng tự soát 2 phút" },
      {
        t: "table",
        head: ["Chỗ", "Câu khung"],
        rows: [
          ["Mở cover letter", "I am writing to apply for the [position] advertised on [nơi]. As a [bạn là ai] who has [điểm khớp nhất], I believe I could …"],
          ["Đầu đoạn bằng chứng", "The role calls for [yêu cầu]. · Your advertisement emphasises [yêu cầu]. · [Yêu cầu] is something I have developed through …"],
          ["Kết quả", "…, after which [số liệu] fell / rose from … to … · …, which reduced / cut … by …%."],
          ["Vì sao công ty này", "I am particularly drawn to [công ty] because [chi tiết riêng]."],
          ["Kết cover letter", "I have attached my CV … I would welcome the opportunity to discuss … I am available for an interview …"],
          ["Mở email khó", "I am writing to follow up on … / to draw your attention to … / to request a short extension to …"],
          ["Giữ lập trường", "I appreciate that … However, I would be grateful if you could … by …"],
          ["Bước tiếp theo", "Should I not hear from you by …, I will need to … · I trust that this can be resolved promptly."],
        ],
      },
      {
        t: "rule",
        formula: "Dear + Ms/Mr + họ → I am writing to … → (mỗi đoạn một việc) → I would welcome / be grateful … → Yours sincerely (biết tên) · Yours faithfully (Dear Sir or Madam)",
        vi: "Khung chung cho mọi thư trang trọng — giữ một văn phong từ câu chào tới chữ ký.",
      },
      {
        t: "table",
        head: ["Lượt soát", "Tìm gì"],
        rows: [
          ["1 · Vế đề", "Gạch đủ mọi gạch đầu dòng + mọi yêu cầu của tin chưa?"],
          ["2 · Bằng chứng", "Mỗi lời khen bản thân có việc + số đi kèm chưa? Xoá mọi “hard-working / responsible” đứng một mình."],
          ["3 · Giọng", "Có câu nào gắt (must, unacceptable) hay yếu (sorry to disturb, if possible maybe) không?"],
          ["4 · Chào – ký", "Dear + họ ↔ Yours sincerely; Dear Sir or Madam ↔ Yours faithfully."],
          ["5 · Lỗi cố định", "look forward to + V-ing · reply to sb · I am writing to (không “this letter”) · không viết tắt (don't, I'm)."],
        ],
      },
      {
        t: "mcq",
        id: "t4d26-viet-nhan-dien",
        title: "Nhận diện — câu nào đúng văn phong band 7? (6 câu)",
        items: [
          { q: "1. Best opening for a cover letter:", options: ["I am writing this letter because I want a job in your company.", "Hope you are well! I'm really keen on the developer job.", "I am writing to apply for the Junior Data Analyst post advertised on your website.", "I write to you to apply the Junior Data Analyst position."], correct: 2, why: "C: I am writing to apply for + vị trí + advertised on. A dài và mơ hồ; B thân mật, viết tắt; D sai thì (I write) và thiếu for." },
          { q: "2. Best evidence sentence:", options: ["I reduced the page loading time by 40% by compressing images and caching API responses.", "I am a very good programmer and I always work hard.", "I have many skills such as coding, testing and communicating.", "Everyone in my team said I was the best member."], correct: 0, why: "A có hành động cụ thể + kết quả có số. B, C là tự khen; D là lời người khác, không kiểm được." },
          { q: "3. You know the recipient's name (Mr Hale). Which closing is correct?", options: ["Yours faithfully,", "Yours sincerely,", "Cheers,", "Love,"], correct: 1, why: "Biết tên ⇒ Yours sincerely (hoặc Kind regards). Faithfully chỉ đi với Dear Sir or Madam." },
          { q: "4. Which sentence is firm but polite?", options: ["You must send the refund immediately.", "Sorry to bother you, maybe you could think about refunding me?", "I demand a refund now or I will post bad reviews everywhere.", "I would be grateful if you could process the refund by 30 November."], correct: 3, why: "D: đề nghị gián tiếp + hạn chót rõ. A, C gắt / đe doạ; B yếu, mất mục đích." },
          { q: "5. Which is grammatically correct?", options: ["I look forward to hear from you.", "I look forward to hearing from you.", "I am looking forward to hear from you.", "I look forward hearing from you."], correct: 1, why: "look forward to + V-ing. “to” ở đây là giới từ." },
          { q: "6. Which sentence best explains why you want to work for THIS company?", options: ["Your company is famous and pays well.", "I want to gain experience and develop my career.", "I am particularly drawn to your company because your app is used by over 200 local farmers' cooperatives, the kind of users I worked with in my final-year project.", "Your company is one of the biggest in Vietnam."], correct: 2, why: "C dùng một chi tiết RIÊNG của công ty và nối với kinh nghiệm của mình. A, D dùng được cho mọi công ty; B nói về lợi của mình." },
        ],
      },

      /* ── 10 ── */
      { t: "h", text: "10. Viết bài — AI chấm 4 tiêu chí" },
      {
        t: "note",
        title: "💡 Cách học: viết trước, so mẫu sau",
        items: [
          "Bài 1: 6 phút dàn ý theo bảng mục 5 (đếm đủ vế + yêu cầu), 25 phút viết, 3 phút soát 5 lượt ở mục 9.",
          "Đừng chép bài mẫu: tin tuyển dụng dưới đây khác ngành (dữ liệu) — dùng dự án của chính bạn, số liệu thật của bạn.",
          "Bài 2: 15–20 phút. Kiểm bốn nhịp: ghi nhận → sự việc → đề nghị + hạn → bước tiếp.",
        ],
      },
      {
        t: "essay",
        id: "t4d26-viet-thu-xin-viec",
        task: "Task 1",
        prompt: "Cover letter (250–300 words). You have seen this advertisement: GREENCART (online grocery delivery, Ho Chi Minh City) — Data Analyst Intern, 6 months. We are looking for: (1) a student in computing, statistics or a related field; (2) experience with SQL and Python for data analysis; (3) the ability to turn data into clear charts and recommendations for managers; (4) availability to work at least four days a week. GreenCart delivers fresh food from 300 local farms and is building a system to reduce food waste. Apply to Mr Daniel Kwan, Head of Analytics. Write a cover letter. In your letter: say which position you are applying for and where you saw it; show how your experience matches at least three of the requirements; explain why you want to work for this company; say when you could start.",
        minWords: 250,
        tips: [
          "Dear Mr Kwan, … Yours sincerely.",
          "Mỗi yêu cầu một bằng chứng: việc → hành động của bạn → kết quả có số.",
          "Vì sao GreenCart: dùng chi tiết “300 local farms / reduce food waste” — nối được từ vựng Bài 1 (food waste, traceability).",
          "Không viết tắt, không “hard-working” đứng một mình, không Firstly / Secondly.",
        ],
      },
      {
        t: "essay",
        id: "t4d26-viet-email-gia-han",
        task: "Task 1",
        prompt: "Email (at least 150 words). You are a final-year student. Your team's capstone project report is due on 5 December, but one of the four team members was in hospital for two weeks and the team has lost access to the test server for several days. Write an email to your supervisor, Dr Laura Patel. In your email: explain the situation; request an extension and say how long you need; say what the team will do to make sure the report is completed.",
        minWords: 150,
        tips: [
          "Subject rõ việc. Mở: I am writing to request a short extension to …",
          "owing to / due to + danh từ; I appreciate that this may cause inconvenience …",
          "Nói con số cụ thể (bao nhiêu ngày) và kế hoạch cụ thể (ai làm gì, mốc nào).",
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI 3 — NÓI ═══════════════════════════ */
  {
    id: "t4d26-noi",
    kind: "speaking",
    title: "Nói: Part 2 band 7 — đề trừu tượng (a law · a piece of advice): khung NEO → NỀN → CẢNH → CÂN + Part 3 nối tiếp",
    goal: "Nói trọn 2 phút về một thẻ đề trừu tượng (một luật, một lời khuyên, một quyết định…) mà không trôi về bài giảng chung chung: gọi tên cụ thể ngay câu đầu, dựng một cảnh có câu thoại, và kết bằng một đánh giá có sắc thái (nhượng bộ + phán quyết) — rồi trả lời Part 3 về luật và lời khuyên theo kiểu “tuỳ vào…” — đúng những gì band 7 đòi ở FC (nói dài không gắng sức) và LR (từ ít gặp, đúng văn phong).",
    minutes: 85,
    blocks: [
      {
        t: "recap",
        items: [
          "**Đề trừu tượng** là thẻ không hỏi người / nơi / đồ vật mà hỏi một **ý**: a law, a piece of advice, a decision, a goal, a skill. Ôn **Tập 2 Ngày 23**: nguyên tắc ==biến ý thành cảnh== (đề “a rule you disliked”) và kho 5 câu chuyện.",
          "Band 6 kể đủ 4 gợi ý của thẻ. Band 7 làm thêm hai việc: ==một cảnh cụ thể có câu thoại== (khung 4 nhịp của Tập 4 Ngày 6) và ==một đánh giá hai chiều== ở cuối (On paper… in practice… · That said… · On balance…).",
          "Khung hôm nay: **NEO → NỀN → CẢNH → CÂN**. NEO = gọi tên cụ thể trong 15 giây; NỀN = vì sao có luật / lời khuyên; CẢNH = một lần nó chạm vào đời bạn; CÂN = bạn đánh giá nó thế nào, có giới hạn gì.",
          "12 cụm cho luật và lời khuyên (comply with, a loophole, a slap on the wrist, take sth on board, with hindsight…) — vào Flashcards.",
          "Đề lạ trừu tượng: mượn khung (ôn **Tập 3 Ngày 26**) — mọi thẻ “ý” đều chạy được bằng 4 bước này.",
          "🔊 **Tốc độ tự nhiên**: nói nhanh mà vẫn rõ = nén từ chức năng, giữ đủ từ mang nghĩa — không phải nói mọi từ nhanh hơn.",
        ],
      },

      /* ── 1 ── */
      { t: "h", text: "1. Đề trừu tượng: band 6 và band 7 khác nhau ở đâu" },
      {
        t: "table",
        head: ["", "Band 6", "Band 7"],
        rows: [
          ["Câu mở", "I want to talk about the law about… (gọi chung)", "Gọi **tên cụ thể** + tóm 1 câu: I'd like to talk about what's often called the zero-tolerance drink-driving law. In a nutshell, …"],
          ["Thân", "Đi lần lượt 4 gợi ý như trả lời 4 câu hỏi", "Gợi ý của thẻ thành **bối cảnh**, rồi một **cảnh** có thời điểm, người, câu thoại"],
          ["Từ", "big fine, very dangerous, people are careful", "steep penalties, came into force, enforcement, it shifted what people consider normal"],
          ["Kết", "So I think this law is very important. That's all.", "**Đánh giá hai chiều**: I wouldn't say it's perfect… But on balance… mainly because…"],
          ["Độ dài", "≈ 1 phút 10 giây, hết ý trước khi hết giờ", "≈ 2 phút; giám khảo phải ngắt"],
        ],
        caption: "FC band 7 = “nói dài không gắng sức”. Đề trừu tượng là nơi band 6 hay hết ý nhất — vì ý chung chung chỉ kéo được 40 giây.",
      },

      /* ── 2 ── */
      { t: "h", text: "2. Khung NEO → NỀN → CẢNH → CÂN cho 2 phút" },
      {
        t: "sodo",
        kind: "flow",
        title: "Đề trừu tượng — 4 bước",
        steps: [
          { label: "① NEO — gọi tên cụ thể (≈ 15″)", sub: "Luật / lời khuyên nào, của ai, tóm 1 câu: In a nutshell, … · It was very simple: ‘…’" },
          { label: "② NỀN — vì sao có nó (≈ 25″)", sub: "Trước đó thế nào, ai đưa ra, áp cho ai: To understand why…, you have to know… · For decades, …" },
          { label: "③ CẢNH — một lần nó chạm vào bạn (≈ 45″)", sub: "Khung 4 nhịp (Tập 4 Ngày 6): cảnh → sự việc → **một câu thoại** → ý nghĩa" },
          { label: "④ CÂN — đánh giá hai chiều (≈ 35″)", sub: "I wouldn't say it's perfect… · On paper…, but in practice… · That said, … · On balance, … mainly because …" },
        ],
        caption: "Gợi ý cuối của thẻ (“explain why…”) luôn rơi vào bước ④. Đừng trả lời nó ở câu đầu rồi hết chuyện để nói.",
      },
      {
        t: "table",
        head: ["Bước", "Câu mở dùng ngay"],
        rows: [
          ["① NEO", "I'd like to talk about what's often called… · The piece of advice I want to talk about is something [ai] told me… · It was very simple: ‘…’"],
          ["② NỀN", "To understand why it was such a big deal, you have to know… · Before that, … was just normal. · She said it almost in passing, and to be honest I didn't think much of it."],
          ["③ CẢNH", "What made it real for me was… · I remember one evening when… · …glanced at my screen and said, ‘…’"],
          ["④ CÂN", "Now, I wouldn't say it's perfect. · On paper…, but in practice… · With hindsight, I can see… · That said, … · On balance, I think…, mainly because…"],
        ],
      },
      {
        t: "rule",
        formula: "NEO (tên cụ thể) → NỀN (vì sao có) → CẢNH (một lần, có câu thoại) → CÂN (I wouldn't say… · On paper… in practice… · On balance…, mainly because…)",
        vi: "Ý trừu tượng chỉ nói dài được khi có một cảnh cụ thể ở giữa và một đánh giá hai chiều ở cuối.",
      },

      /* ── 3 ── */
      { t: "h", text: "3. Mười hai cụm cho luật và lời khuyên (vẫn là lời nói tự nhiên)" },
      {
        t: "p",
        text: "Tập 3 Ngày 4 đã có từ tội phạm – pháp luật (legislation, penalty, deterrent) và Tập 3 Ngày 6 có introduce a law; Tập 4 Ngày 23 có in principle… in practice…, a grey area. Mười hai cụm dưới đây là ==lớp “nói về luật như người thường”== và ==lớp lời khuyên== — đúng thứ cần cho Part 2 – 3 hôm nay.",
      },
      {
        t: "vocab",
        items: [
          { w: "comply with", pos: "phr v", ipa: "/kəmˈplaɪ wɪð/", vi: "tuân thủ (quy định, yêu cầu)", ex: "Most restaurants complied with the new rules within a few months.", exVi: "Phần lớn nhà hàng tuân thủ quy định mới trong vài tháng.", more: "compliance (n) · in compliance with · trang trọng hơn follow; ⚠️ ~~comply the rules~~ — phải có **with**" },
          { w: "abide by", pos: "phr v", ipa: "/əˈbaɪd baɪ/", vi: "tuân theo, giữ đúng (luật, quyết định, lời hứa)", ex: "If you join the club, you have to abide by its rules, even the silly ones.", exVi: "Đã vào câu lạc bộ thì phải theo luật của nó, kể cả luật ngớ ngẩn.", more: "abide by a rule / a decision / an agreement · law-abiding (Tập 3 Ngày 4) cùng gốc" },
          { w: "a loophole", pos: "n", ipa: "/ə ˈluːphəʊl/", vi: "kẽ hở (của luật)", ex: "Companies found a loophole that let them avoid the tax entirely.", exVi: "Các công ty tìm ra một kẽ hở cho phép họ tránh thuế hoàn toàn.", more: "**exploit / close / find** a loophole · a legal / tax loophole · ⚠️ đọc /ˈluːphəʊl/ — chữ p và h đọc tách, không đọc “f”" },
          { w: "the spirit of the law", pos: "n", ipa: "/ðə ˈspɪrɪt əv ðə ˈlɔː/", vi: "tinh thần của luật (mục đích, không chỉ câu chữ)", ex: "They followed the letter of the law but completely ignored the spirit of it.", exVi: "Họ làm đúng câu chữ của luật nhưng bỏ qua hoàn toàn tinh thần của nó.", more: "**the letter vs the spirit of the law** — cặp rất hợp đề luật / Part 3 đạo đức" },
          { w: "a slap on the wrist", pos: "idiom", ipa: "/ə ˌslæp ɒn ðə ˈrɪst/", vi: "hình phạt nhẹ hều (không đủ răn đe)", ex: "A fine of a few hundred thousand dong was just a slap on the wrist.", exVi: "Mức phạt vài trăm nghìn đồng chỉ như phạt cho có.", more: "get off with a slap on the wrist · văn nói / Part 2 – 3; Task 2 dùng: **a lenient penalty**" },
          { w: "zero tolerance", pos: "n", ipa: "/ˌzɪərəʊ ˈtɒlərəns/", vi: "không khoan nhượng (không có mức cho phép nào)", ex: "The school takes a zero-tolerance approach to bullying.", exVi: "Trường áp dụng cách không khoan nhượng với bắt nạt.", more: "a **zero-tolerance** policy / approach (có gạch nối khi đứng trước danh từ) · tolerate (Tập 4 Ngày 13) cùng gốc" },
          { w: "heed", pos: "v", ipa: "/hiːd/", vi: "để tâm, nghe theo (lời khuyên, cảnh báo)", ex: "If I had heeded her warning, I would have saved myself two days.", exVi: "Giá tôi nghe lời cảnh báo của chị ấy thì đã tiết kiệm được hai ngày.", more: "**heed** advice / a warning · pay no heed to · hơi trang trọng; văn nói thường: listen to, take notice of" },
          { w: "unsolicited", pos: "adj", ipa: "/ˌʌnsəˈlɪsɪtɪd/", vi: "không ai nhờ, tự dưng đưa ra", ex: "Everyone has unsolicited advice for new parents.", exVi: "Ai cũng có lời khuyên chẳng ai nhờ cho các bậc cha mẹ mới.", more: "**unsolicited advice / emails / calls** · solicit (v — trang trọng): xin, gạ" },
          { w: "take sth on board", pos: "idiom", ipa: "/teɪk ˈsʌmθɪŋ ɒn ˈbɔːd/", vi: "tiếp thu, thực sự nghe vào", ex: "It took me a while to take her advice on board.", exVi: "Tôi mất một thời gian mới thật sự tiếp thu lời khuyên của chị ấy.", more: "take **feedback / criticism / a point** on board · rất tự nhiên trong Part 2 – 3" },
          { w: "learn sth the hard way", pos: "idiom", ipa: "/lɜːn ˈsʌmθɪŋ ðə ˈhɑːd weɪ/", vi: "học được điều gì qua trả giá, qua vấp ngã", ex: "I learned the hard way that backups are not optional.", exVi: "Tôi học được qua vấp ngã rằng sao lưu không phải chuyện tuỳ thích.", more: "learn (sth) the hard way · find out the hard way" },
          { w: "with hindsight", pos: "phrase", ipa: "/wɪð ˈhaɪndsaɪt/", vi: "nhìn lại (khi đã biết kết quả)", ex: "With hindsight, it was the best advice anyone has ever given me.", exVi: "Nhìn lại thì đó là lời khuyên hay nhất mà từng có người cho tôi.", more: "cũng nói: **in hindsight** · **hindsight is twenty-twenty** (nhìn lại thì ai cũng sáng suốt) · đi tốt với should have / would have" },
          { w: "a rule of thumb", pos: "n", ipa: "/ə ˌruːl əv ˈθʌm/", vi: "quy tắc kinh nghiệm (áp gần đúng, không chính xác tuyệt đối)", ex: "As a rule of thumb, ask for help after thirty minutes of being stuck.", exVi: "Theo kinh nghiệm chung, kẹt ba mươi phút thì nên hỏi.", more: "**as a rule of thumb**, … · ⚠️ thumb đọc /θʌm/ — chữ b câm" },
        ],
      },
      {
        t: "quiz",
        id: "t4d26-noi-cum",
        kind: "fill",
        title: "Điền MỘT từ để hoàn chỉnh cụm (8 câu)",
        items: [
          { q: "1. Every new building has to comply ___ the fire safety code.", answers: ["with"], hint: "comply ___" },
          { q: "2. A fine that small is just a slap on the ___.", answers: ["wrist"], hint: "a slap on the ___" },
          { q: "3. They kept to the letter of the law, but not the ___ of it.", answers: ["spirit"], hint: "the letter vs the ___" },
          { q: "4. Lawyers quickly found a ___ that let the company avoid the ban.", answers: ["loophole"], hint: "kẽ hở" },
          { q: "5. It took me months to take his advice on ___.", answers: ["board"], hint: "take sth on ___" },
          { q: "6. I learned the ___ way that you should never deploy on a Friday.", answers: ["hard"], hint: "learn sth the ___ way" },
          { q: "7. With ___, I should have listened to my teacher.", answers: ["hindsight"], hint: "nhìn lại" },
          { q: "8. As a rule of ___, save your work every ten minutes.", answers: ["thumb"], hint: "a rule of ___" },
        ],
      },

      /* ── 4 ── */
      { t: "h", text: "4. Đề 1 — a law: band 6 và band 7" },
      {
        t: "p",
        text: "**Describe a law in your country that you think is important.** You should say: **what** the law is · **when** it was introduced · **how** it affects people · and **explain why** you think it is important.",
      },
      {
        t: "sodo",
        kind: "mindmap",
        title: "Ghi chú 1 phút — chỉ từ khoá, xếp theo 4 bước",
        center: "zero-tolerance drink-driving (2020)",
        branches: [
          { label: "① NEO", items: ["came into force 2020", "any alcohol = in trouble"] },
          { label: "② NỀN", items: ["beer = social life", "pressure to keep up", "steep penalties, licence"] },
          { label: "③ CẢNH", items: ["uncle's wedding", "booked Grab cars", "people cheered", "a year earlier = insult"] },
          { label: "④ CÂN", items: ["on paper / in practice", "cities vs countryside", "on balance: changed what's normal"] },
        ],
      },
      {
        t: "dialogue",
        title: "Bài nói band 6 (ước tính) — khoảng 1 phút 10 giây (≈ 140 từ)",
        lines: [
          { who: "Candidate", role: "candidate", text: "I want to talk about the law about drinking and driving in Vietnam. This law started in 2020. It says that if you drive after drinking alcohol, even only one glass of beer, you will get a very big fine, and maybe the police will take your licence. Before this law, many people drank a lot of beer and then rode their motorbikes home, and it was very dangerous. There were many accidents. Now people are more careful. For example, my father used to drive after parties but now he always takes a taxi. I think this law is very important because it saves many lives. Some people think the fine is too high, but I think it is good because people are afraid of the fine so they don't drink and drive. That's all I want to say about this law.", vi: "Đủ 4 gợi ý, đúng ngữ pháp phần lớn. Dừng ở band 6 vì: gọi chung (the law about…), ví dụ chỉ một câu (my father…), từ thường (very big fine, very dangerous), kết bằng câu đóng (That's all…) khi còn gần một phút." },
        ],
      },
      {
        t: "dialogue",
        title: "Bài nói band 7 (ước tính) — khoảng 2 phút",
        lines: [
          { who: "Candidate", role: "candidate", text: "I'd like to talk about what's often called the zero-tolerance drink-driving law in Vietnam. It came into force at the beginning of 2020, and in a nutshell it means that if you're caught behind the wheel — or on a motorbike — with any alcohol at all in your system, you're in trouble. There's no ‘one beer is fine’ limit any more.", vi: "① NEO — tên cụ thể + tóm 1 câu (in a nutshell)." },
          { who: "Candidate", role: "candidate", text: "To understand why it was such a big deal, you have to know how central drinking is to social life here. Business deals, weddings, even a midweek get-together — they all involve beer, and there's a lot of pressure to keep up. So for decades, riding home after a few drinks was just… normal. The penalties now are pretty steep: a fine of several million dong, and in the worst cases you can lose your licence for up to two years.", vi: "② NỀN — trước đó thế nào, vì sao luật gây chấn động." },
          { who: "Candidate", role: "candidate", text: "What made it real for me was my uncle's wedding, a few months after the law came in. Everyone had parked their bikes outside the restaurant as usual, and then, halfway through the meal, my uncle stood up and said, ‘If you've had a drink, the Grab cars are on me.’ And people actually cheered. A year earlier, that would have been seen as a bit of an insult — as if he didn't trust his guests.", vi: "③ CẢNH — một lần cụ thể, có câu thoại, có đối chiếu “một năm trước”." },
          { who: "Candidate", role: "candidate", text: "Now, I wouldn't say the law is perfect. On paper it applies to everyone equally, but in practice it's enforced far more strictly in big cities than in the countryside, and some small restaurants say it's hurt their business. But on balance, I think it's one of the most important laws we've had, mainly because it didn't just punish people — it changed what people consider normal. And that, to me, is what a good law should do.", vi: "④ CÂN — nhượng bộ (wouldn't say perfect · on paper / in practice) → phán quyết (on balance) → lý do sâu (đổi chuẩn mực)." },
        ],
      },
      {
        t: "table",
        head: ["Tiêu chí", "Bài band 6", "Bài band 7"],
        rows: [
          ["**FC**", "Ý cạn ở giây 70; kết bằng câu đóng", "Đủ 2 phút; discourse markers dẫn đường (in a nutshell · to understand why · what made it real · now, · on balance)"],
          ["**LR**", "very big fine, very dangerous, more careful", "came into force, behind the wheel, steep penalties, enforced, keep up, on me (= tôi trả) — đúng văn nói"],
          ["**GRA**", "Câu đơn – ghép, vài câu phức đơn giản", "If you're caught…, you're…; would have been seen as…; câu chẻ What made it real for me was…; it didn't just…, it…"],
          ["**P**", "Đều đều, mỗi từ một nhịp", "Nhấn từ mang nghĩa (ANY alcohol · CHEERED · NORMAL), nén từ chức năng — xem mục 8"],
        ],
        caption: "Số liệu về luật (năm 2020, mức phạt “vài triệu đồng”, tước bằng tới khoảng hai năm ở mức nặng nhất) là để nói cho tự nhiên; Part 2 không chấm độ chính xác của dữ kiện, nhưng đừng bịa số quá cụ thể khi không chắc.",
      },

      /* ── 5 ── */
      { t: "h", text: "5. Đề 2 — a piece of advice: lời khuyên không nghe lúc đầu" },
      {
        t: "p",
        text: "**Describe a piece of advice you were given that you did not follow at first.** You should say: **who** gave you the advice · **what** it was · **why** you did not follow it at first · and **explain what** made you change your mind. — Tập 2 Ngày 23 có thẻ “good advice” ở mức kể; thẻ này khó hơn vì có **đổi ý**: bước ③ phải là cảnh khiến bạn đổi ý, bước ④ phải cân lời khuyên đó (nó đúng tới đâu).",
      },
      {
        t: "dialogue",
        title: "Bài nói band 7 (ước tính) — khoảng 2 phút",
        lines: [
          { who: "Candidate", role: "candidate", text: "The piece of advice I want to talk about is something a senior developer told me during my internship last summer. It was very simple: ‘If you've been stuck for more than thirty minutes, ask.’ That's it — but it took me a surprisingly long time to take it on board.", vi: "① NEO — ai, khi nào, nguyên văn lời khuyên." },
          { who: "Candidate", role: "candidate", text: "Her name was Linh, and she was in charge of the four interns. She said it on our very first day, almost in passing, and to be honest I didn't think much of it. Partly it was pride — I wanted to look as if I knew what I was doing — and partly, I think, it's cultural. A lot of us grow up feeling that asking questions means you haven't done your homework, and nobody wants to lose face in front of people they admire.", vi: "② NỀN — vì sao không nghe: hai lý do, một cá nhân, một văn hoá (sâu hơn band 6)." },
          { who: "Candidate", role: "candidate", text: "Then, about three weeks in, I was given a bug in the payment module. I spent the whole of Monday on it, then most of Tuesday, getting more and more frustrated. On Tuesday evening Linh walked past, glanced at my screen and said, ‘How long have you been on this?’ When I told her, she just sighed, pointed at one line in a config file, and the problem was solved in about two minutes. Two days — two minutes.", vi: "③ CẢNH — khoảnh khắc đổi ý, có câu thoại, kết bằng đối xứng ngắn gây ấn tượng (Two days — two minutes)." },
          { who: "Candidate", role: "candidate", text: "With hindsight, I can see the advice wasn't really about bugs at all; it was about how much your time costs the team. That said, I don't think it means you should ask the moment anything goes wrong — if you never struggle a bit, you never learn to debug. So the thirty-minute rule is a kind of balance: try first, but don't suffer in silence. It's probably the most useful thing anyone's told me so far.", vi: "④ CÂN — hiểu sâu hơn (with hindsight) → giới hạn (That said…) → tổng hợp thành một rule of thumb." },
        ],
      },
      {
        t: "note",
        title: "📌 Bài band 6 cho thẻ này thường dừng ở đâu",
        items: [
          "Bước ② chỉ có “because I thought I could do it myself” — một lý do, không có chiều sâu (pride / văn hoá “sợ mất mặt”).",
          "Bước ③ kể tóm: “Then I had a difficult bug and I asked her and she helped me.” — không có thời gian, không câu thoại, không có con số đối chiếu (two days / two minutes).",
          "Bước ④ chỉ khen: “Now I always ask, it is very good advice.” — band 7 thêm **giới hạn** của lời khuyên (That said, … you never learn to debug).",
        ],
      },

      /* ── 6 ── */
      { t: "h", text: "6. Đề lạ trừu tượng — mượn khung 4 bước (ôn Tập 3 Ngày 26)" },
      {
        t: "table",
        head: ["Thẻ lạ", "① NEO gọi tên gì", "③ CẢNH lấy ở đâu", "④ CÂN kiểu gì"],
        rows: [
          ["Describe a rule you would like to change", "Một quy định cụ thể: the 80% attendance rule at my university", "Lần suýt bị cấm thi vì ốm 3 buổi", "It would be fairer if… — nhưng thừa nhận lý do của trường"],
          ["Describe an important decision you made", "Chọn ngành IT thay vì ngành bố mẹ muốn", "Bữa cơm tối nói với bố mẹ — một câu thoại của bố", "With hindsight… · I'm not saying it was easy, but…"],
          ["Describe a skill that took you a long time to learn", "Debugging / đọc thông báo lỗi", "**Dùng lại** chuyện “two days — two minutes” ở mục 5", "It's less about intelligence than about patience."],
          ["Describe a goal you want to achieve", "IELTS 7.5 để đi thực tập nước ngoài", "Lần đầu làm Passage 3 được 4/13", "Realistic? — điều kiện: as long as I keep…"],
          ["Describe something you did that was against the rules", "Lần dùng thẻ sinh viên của bạn để vào thư viện", "Cảnh bị bảo vệ hỏi, câu thoại", "the letter vs the spirit of the rule — nhận mình sai ở đâu"],
        ],
        caption: "Kho 5 câu chuyện (Tập 2 Ngày 23): một chuyện thật, kể kỹ một lần, dùng cho nhiều thẻ — chỉ đổi NEO và CÂN.",
      },
      {
        t: "mcq",
        id: "t4d26-noi-de-la",
        title: "Đề trừu tượng — chọn cách làm band 7 (5 câu)",
        items: [
          { q: "1. Card: “Describe a law you think is important.” Best first sentence:", options: ["Laws are very important for every society.", "I'd like to talk about the ban on smoking in indoor public places, which came in a few years ago.", "There are many laws in my country and they are all important.", "I don't know much about laws, but I will try."], correct: 1, why: "B gọi tên cụ thể ngay (NEO). A, C chung chung — kiểu bài giảng; D tự hạ điểm FC." },
          { q: "2. Which part of the talk should contain a short line of dialogue?", options: ["① NEO", "② NỀN", "④ CÂN", "③ CẢNH"], correct: 3, why: "Câu thoại thuộc cảnh cụ thể (nhịp ③ của khung 4 nhịp, Tập 4 Ngày 6)." },
          { q: "3. Which ending is band 7?", options: ["On paper it's fair, but in practice it's applied unevenly. Still, on balance, I'd keep it, mainly because it protects people who can't protect themselves.", "So that's why I think this law is very good.", "That's all I want to say.", "I think this law is important because it is important for safety."], correct: 0, why: "A cân hai chiều (on paper / in practice) rồi phán quyết có lý do. B, C đóng sớm; D lặp ý (circular)." },
          { q: "4. Card: “Describe a skill that took a long time to learn.” You have a strong story about a piece of advice. What should you do?", options: ["Say you have no skill to talk about.", "Talk about skills in general for two minutes.", "Reuse the story, but make the skill the NEO and focus the evaluation on learning.", "Tell the advice story exactly as before without mentioning a skill."], correct: 2, why: "Mượn khung: giữ cảnh, đổi NEO (kỹ năng) và CÂN (học thế nào). D lạc đề vì không nói về kỹ năng." },
          { q: "5. “It took me a while to take her advice ___ board.”", options: ["in", "at", "over", "on"], correct: 3, why: "Thành ngữ cố định: take sth **on board**." },
        ],
      },

      /* ── 7 ── */
      { t: "h", text: "7. Part 3 nối tiếp — luật, hành vi và lời khuyên" },
      {
        t: "table",
        head: ["Câu hỏi Part 3", "Động tác band 7"],
        rows: [
          ["Should governments use laws or education to change people's behaviour?", "**It depends on** + tiêu chí (how urgent the harm is) → chia hai trường hợp → kết gọn"],
          ["Why do people break laws they agree with?", "Phân biệt **ý định vs thói quen**: people agree in principle, but… · chuẩn mực nhóm (everyone else does it)"],
          ["Do young people today listen to advice from older generations?", "Phân biệt **loại** lời khuyên: practical (still valuable) vs about careers / technology (often outdated)"],
          ["Is advice from strangers online useful?", "Nhượng bộ + điều kiện: It can be, **as long as** you check who is giving it and why (sponsored content — Bài 1)"],
        ],
        caption: "Ôn Tập 4 Ngày 18 (Part 3 hỏi về “people”, không về “you”) và Ngày 23 (Part 3 trừu tượng: giá trị, đạo đức).",
      },
      {
        t: "dialogue",
        title: "Cùng một câu hỏi — band 6 rồi band 7",
        lines: [
          { who: "Examiner", role: "examiner", text: "Should governments rely on laws or on education to change people's behaviour?" },
          { who: "Candidate (band 6)", role: "candidate", text: "I think both are important. Laws are good because people are afraid of punishment, so they follow the rules. But education is also good because people understand why. For example, in Vietnam the government uses both laws and campaigns about traffic. So I think the government should use both of them.", vi: "≈ 60 từ: “cả hai” mà không nói khi nào dùng cái nào; ví dụ chung chung." },
          { who: "Candidate (band 7)", role: "candidate", text: "I think it depends on how quickly the behaviour needs to change. Education is the more lasting solution, because people who understand why a rule exists tend to follow it even when no one's watching — but it's slow; it can take a generation. So when lives are at stake, as with drink-driving, I'd argue a law has to come first, and education then catches up and makes the law feel fair. Where I think governments go wrong is using laws for things that are really about personal choice, like what people eat. A sugar tax, say, might cut consumption a little, but without education people simply see it as the state interfering. So, in short: laws for urgent harms, education for everything else — and ideally both pulling in the same direction.", vi: "≈ 140 từ: tiêu chí chia (how quickly) → hai trường hợp có ví dụ → chỗ chính phủ sai → kết gọn. Từ ít gặp dùng tự nhiên: at stake, catch up, interfering, pulling in the same direction." },
        ],
      },
      {
        t: "rule",
        formula: "It depends on + tiêu chí. → When + trường hợp 1, I'd argue… → Where … go wrong is … → So, in short: A for…, B for…",
        vi: "Part 3 band 7 không dừng ở “both are important”: nói rõ KHI NÀO cái nào thắng.",
      },

      /* ── 8 ── */
      { t: "h", text: "8. Phát âm: tốc độ tự nhiên — nén từ chức năng, giữ rõ từ mang nghĩa" },
      {
        t: "p",
        text: "Band 7 FC là “nói dài **không gắng sức**”, không phải “nói nhanh”. Người Việt muốn nghe trôi chảy hay tăng tốc **mọi từ** — kết quả là nuốt mất từ mang nghĩa và giám khảo phải đoán. Tốc độ tự nhiên đến từ chỗ khác: tiếng Anh là ngôn ngữ **dồn nhịp theo trọng âm** — các âm tiết nhấn cách nhau gần đều, nên ==từ chức năng giữa chúng phải co lại== (to /tə/, of /əv/, and /ən/, have /əv/, can /kən/) còn ==từ mang nghĩa giữ đủ dài==. Nối Tập 4 Ngày 9 (tone units), Ngày 25 (âm yếu trong chuỗi trợ động từ).",
      },
      {
        t: "table",
        head: ["", "Chậm – đều (band 5–6)", "Tự nhiên (band 7)"],
        rows: [
          ["Cách đọc", "Mỗi từ một nhịp như nhau: ON – PA – PER – IT – AP – PLIES – TO – EV – ERY – ONE", "on PAper it apPLIES to EVeryone — 3 đỉnh, phần còn lại lướt"],
          ["Từ chức năng", "Đọc dạng mạnh: /tuː/ /ɒv/ /ænd/ /hæv/", "Dạng yếu: /tə/ /əv/ /ən/ /əv/"],
          ["Nối", "Dừng sau mỗi từ: in · a · nutshell", "Nối phụ âm – nguyên âm: in_a_nutshell /ɪnənʌtʃel/ (Tập 2 Ngày 23)"],
          ["Ngắt", "Ngắt giữa cụm vì tìm từ", "Ngắt ở ranh giới ý: On paper | it applies to everyone | but in practice | it doesn't"],
          ["Tốc độ đo được", "< 110 từ / phút", "≈ 130 – 170 từ / phút (trên 190 thường nuốt từ mang nghĩa)"],
        ],
      },
      {
        t: "note",
        title: "💡 Cách luyện — đo được",
        items: [
          "Ghi âm Bài nói band 7 mục 4 (≈ 300 từ). Đọc trong khoảng 1 phút 50 – 2 phút 15 là đúng tốc độ tự nhiên (≈ 135–160 từ / phút); quá 2 phút 30 là chậm.",
          "Gạch chân từ mang nghĩa trong mỗi cụm trước khi đọc (thường 2–3 từ / cụm). Đọc to chỉ những từ đó, rồi “nhét” từ chức năng vào giữa mà không đổi nhịp.",
          "Đừng tăng tốc ở số và tên riêng (2020, Grab, thirty minutes) — chậm lại một chút ở đó còn giúp giám khảo theo kịp.",
          "Máy chấm dưới đây chấm từng âm: dạng yếu đọc thành dạng mạnh không bị trừ nhiều, nhưng nuốt mất phụ âm cuối của từ mang nghĩa thì bị.",
        ],
      },
      {
        t: "rule",
        formula: "Từ mang nghĩa: đủ dài, rõ phụ âm cuối · Từ chức năng: /tə/ /əv/ /ən/ /kən/ /fə/ · Ngắt ở ranh giới ý, không giữa cụm",
        vi: "Nhanh mà rõ = nén phần không mang nghĩa, không nén phần mang nghĩa.",
      },
      {
        t: "phatam",
        id: "t4d26-phat-am",
        title: "Luyện phát âm — tốc độ tự nhiên: nén từ chức năng, giữ rõ từ mang nghĩa",
        note: "Bấm “Nghe mẫu” rồi “Đọc & chấm”. Mỗi dòng đọc liền một hơi (hai dòng có dấu phẩy thì ngắt nhẹ ở dấu phẩy). Từ chức năng đọc dạng yếu như phiên âm; từ mang nghĩa giữ đủ phụ âm cuối.",
        items: [
          { text: "It came into force at the beginning of the year.", ipa: "ɪt keɪm ɪntə fɔːs ət ðə bɪɡɪnɪŋ əv ðə jɪə", vi: "Nó có hiệu lực vào đầu năm." },
          { text: "In a nutshell, you can't drink and drive at all.", ipa: "ɪn ə nʌtʃel jə kɑːnt drɪŋk ən draɪv ət ɔːl", vi: "Nói gọn là không được uống rượu bia rồi lái xe chút nào." },
          { text: "On paper it applies to everyone, but in practice it doesn't.", ipa: "ɒn peɪpə ɪt əplaɪz tu evriwʌn bət ɪn præktɪs ɪt dʌznt", vi: "Trên giấy thì áp cho mọi người, nhưng thực tế thì không." },
          { text: "That would have been seen as a bit of an insult.", ipa: "ðæt wəd əv bɪn siːn əz ə bɪt əv ən ɪnsʌlt", vi: "Điều đó hẳn đã bị coi là hơi xúc phạm." },
          { text: "It took me a while to take it on board.", ipa: "ɪt tʊk mi ə waɪl tə teɪk ɪt ɒn bɔːd", vi: "Tôi mất một lúc mới tiếp thu được." },
          { text: "How long have you been on this?", ipa: "haʊ lɒŋ əv jə bɪn ɒn ðɪs", vi: "Em làm cái này bao lâu rồi?" },
          { text: "With hindsight, I can see it wasn't really about bugs.", ipa: "wɪð haɪndsaɪt aɪ kən siː ɪt wɒznt rɪəli əbaʊt bʌɡz", vi: "Nhìn lại, tôi thấy nó không hẳn là chuyện lỗi phần mềm." },
          { text: "Try first, but don't suffer in silence.", ipa: "traɪ fɜːst bət dəʊnt sʌfər ɪn saɪləns", vi: "Cứ thử trước, nhưng đừng chịu đựng một mình." },
          { text: "Laws for urgent harms, education for everything else.", ipa: "lɔːz fər ɜːdʒənt hɑːmz edʒukeɪʃn fər evriθɪŋ els", vi: "Luật cho những tác hại cấp bách, giáo dục cho mọi thứ còn lại." },
        ],
      },
      {
        t: "mcq",
        id: "t4d26-noi-toc-do",
        title: "Tốc độ tự nhiên — chọn phương án đúng (4 câu)",
        items: [
          { q: "1. In “It took me a while to take it on board”, how is “to” usually pronounced?", options: ["/tuː/", "/tə/", "/tɒ/", "/təʊ/"], correct: 1, why: "Trước phụ âm (take), to đọc dạng yếu /tə/. Trước nguyên âm thì /tu/ (to everyone)." },
          { q: "2. Which words carry the main stress in “On paper it applies to everyone”?", options: ["on · it · to", "it · applies · to", "paper · applies · everyone", "on · paper · it"], correct: 2, why: "Từ mang nghĩa (danh từ, động từ chính, đại từ bất định) nhận nhịp; on / it / to lướt." },
          { q: "3. You recorded your Part 2 answer: 180 words in 2 minutes. What does this suggest?", options: ["Too slow for band 7 — aim for roughly 130–170 words per minute.", "A natural speed for Part 2.", "Too fast — you are probably swallowing content words.", "Nothing: speed does not affect the Speaking score."], correct: 0, why: "180 từ / 2 phút = 90 từ / phút — chậm (dưới 110). Band 7 khoảng 130–170. D sai: tốc độ và độ liền mạch nằm trong tiêu chí FC." },
          { q: "4. Where is the best place to pause in “Where I think governments go wrong is using laws for personal choices”?", options: ["Where I | think governments go wrong", "Where I think governments go wrong | is using laws for personal choices", "Where I think | governments go | wrong is using", "Where | I think governments | go wrong is"], correct: 1, why: "Ngắt ở ranh giới ý: chủ ngữ dài (Where … go wrong) | vị ngữ. Các chỗ ngắt khác cắt giữa cụm." },
        ],
      },

      /* ── 9 ── */
      { t: "h", text: "9. Luyện nói — ghi âm, AI chấm 4 tiêu chí" },
      {
        t: "note",
        title: "💡 Cách luyện: 1 phút ghi chú — 2 phút nói — nghe lại",
        items: [
          "Ghi chú 1 phút theo 4 ô NEO · NỀN · CẢNH · CÂN như sơ đồ mục 4. Ô CẢNH ghi sẵn câu thoại.",
          "Thẻ 1 nên chọn **một luật khác** bài mẫu (đội mũ bảo hiểm, cấm hút thuốc nơi công cộng, luật an ninh mạng…) để không học thuộc mẫu.",
          "Nghe lại, tự hỏi: câu đầu có gọi tên cụ thể không? có câu thoại không? bước ④ có “On paper / That said / On balance” không? tốc độ khoảng 130–170 từ / phút?",
          "Thẻ 2 đổi vai: lời khuyên **bạn đưa** cho người khác — vẫn 4 bước, CÂN là “lời khuyên đó có hợp với mọi người không”.",
        ],
      },
      {
        t: "speak",
        id: "t4d26-noi-luat",
        part: "2",
        questions: [
          "Describe a law in your country that you think is important. You should say: what the law is; when it was introduced; how it affects people; and explain why you think it is important.",
        ],
      },
      {
        t: "speak",
        id: "t4d26-noi-loi-khuyen",
        part: "2",
        questions: [
          "Describe a piece of advice you gave to someone. You should say: who you gave it to; what the advice was; whether they followed it; and explain how you felt about giving this advice.",
        ],
      },
      {
        t: "speak",
        id: "t4d26-noi-part3",
        part: "3",
        questions: [
          "Should governments rely on laws or on education to change people's behaviour?",
          "Why do some people break laws that they actually agree with?",
          "Do young people today still listen to advice from older generations?",
          "How useful is advice that people find online, for example on social media?",
        ],
      },
      {
        t: "note",
        title: "📌 Ghi vào sổ Speaking",
        items: [
          "Chép bản tốt nhất của thẻ 1 và thẻ 2 vào sổ, gạch chân 4 câu mở của 4 bước — đó là “khung” sẽ dùng lại cho mọi thẻ trừu tượng ở Đề 8.",
          "Thêm chuyện “lời khuyên” vào kho 5 câu chuyện: ghi những thẻ nó dùng được (advice · a skill · a mistake · a person who helped you · a time you were stuck).",
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI TẬP ═══════════════════════════ */
  {
    id: "t4d26-bai-tap",
    kind: "homework",
    title: "Bài tập Ngày 26 — thực phẩm & truyền thông vòng 2 · thư trang trọng · luật và lời khuyên",
    goal: "Tự kiểm cả ngày bằng 38 câu có đáp án (từ vựng hai chủ đề, cặp dễ nhầm, dịch, văn phong thư, cụm cho luật – lời khuyên, ghép câu) và một email từ chối ngắn cho AI chấm; đúng từ 27 câu trở lên là đạt.",
    minutes: 60,
    blocks: [
      {
        t: "recap",
        title: "Làm gì · chấm thế nào",
        items: [
          "Bảy phần, mỗi phần ghi rõ ôn mục nào. Làm hết rồi mới bấm xem đáp án.",
          "Đạt: **≥ 27 / 38** (≈ 70 %). Dưới ngưỡng ở phần nào ⇒ đọc lại đúng mục ghi ở tiêu đề phần đó.",
          "Phần I – III: từ vựng (Bài 1). Phần IV: dịch. Phần V: thư (Bài 2). Phần VI – VII: Nói (Bài 3).",
          "Cuối bài: một email từ chối 120–150 từ — AI chấm theo 4 tiêu chí.",
        ],
      },
      { t: "h", text: "Phần I — Thực phẩm vòng 2: điền từ trong hộp (8 câu · ôn Bài 1 mục 1–2)" },
      {
        t: "note",
        title: "Hộp từ (mỗi từ dùng một lần; có thể phải đổi dạng)",
        items: ["monoculture · free-range · traceability · recall · adulterate · stringent · economies of scale · allergen"],
      },
      {
        t: "quiz",
        id: "t4d26-bt-thuc-pham",
        kind: "fill",
        title: "I. Điền từ trong hộp",
        items: [
          { q: "1. Only large firms enjoy the ___ needed to sell chicken at such low prices.", answers: ["economies of scale"], hint: "lợi thế quy mô" },
          { q: "2. The company was forced to ___ 12,000 bags of flour after insects were found.", answers: ["recall"], hint: "thu hồi — động từ nguyên mẫu" },
          { q: "3. Thousands of hectares of a single variety of banana — a classic ___ — were wiped out by one fungus.", answers: ["monoculture"], hint: "độc canh" },
          { q: "4. ___ hens have access to the outdoors for at least part of the day.", answers: ["Free-range", "free-range"], hint: "thả vườn" },
          { q: "5. The spice had been ___ with brick dust to increase its weight.", answers: ["adulterated"], hint: "had been + V3" },
          { q: "6. Menus must now list every major ___ in each dish.", answers: ["allergen"], hint: "chất gây dị ứng" },
          { q: "7. Exporters to Japan face far more ___ inspections than those selling locally.", answers: ["stringent"], hint: "nghiêm ngặt" },
          { q: "8. Thanks to better ___, inspectors identified the farm responsible within a day.", answers: ["traceability"], hint: "khả năng truy xuất" },
        ],
      },
      { t: "h", text: "Phần II — Truyền thông vòng 2 (6 câu · ôn Bài 1 mục 3–4)" },
      {
        t: "mcq",
        id: "t4d26-bt-truyen-thong",
        title: "II. Chọn phương án đúng",
        items: [
          { q: "1. A newspaper that is legally required not to take sides must be ___.", options: ["sensational", "aspirational", "impartial", "covert"], correct: 2, why: "Không thiên vị = impartial." },
          { q: "2. Children nagging their parents to buy advertised toys is known as ___.", options: ["pester power", "product placement", "the watershed", "data harvesting"], correct: 0, why: "Trẻ vòi vĩnh bố mẹ mua đồ thấy trên quảng cáo = pester power." },
          { q: "3. “Editors no longer decide what we read; algorithms do.” Algorithms have become the new ___.", options: ["tabloids", "disclaimers", "watchdogs", "gatekeepers"], correct: 3, why: "Người / thứ quyết định thông tin nào tới công chúng = gatekeeper. Watchdog là cơ quan giám sát." },
          { q: "4. A video that looks like a personal review but was paid for by a brand is ___.", options: ["investigative journalism", "sponsored content", "an editorial", "press freedom"], correct: 1, why: "Nội dung trả tiền trông như nội dung thường = sponsored content." },
          { q: "5. Advertising that sells a dream lifestyle rather than a product is ___.", options: ["aspirational", "impartial", "foodborne", "stringent"], correct: 0, why: "Khơi khát vọng = aspirational." },
          { q: "6. Many local papers have closed because ___ has moved to social media.", options: ["press freedom", "the 24-hour news cycle", "ad revenue", "the watershed"], correct: 2, why: "Doanh thu quảng cáo chuyển sang mạng xã hội ⇒ báo địa phương mất nguồn sống." },
        ],
      },
      { t: "h", text: "Phần III — Cặp dễ nhầm (5 câu · ôn Bài 1 mục 5)" },
      {
        t: "quiz",
        id: "t4d26-bt-de-nham",
        kind: "fill",
        title: "III. Điền MỘT từ hoặc dạng đúng",
        items: [
          { q: "1. The news ___ (be) not as bad as everyone expected.", answers: ["is", "was"], hint: "news + động từ số ít" },
          { q: "2. There is far too much ___ aimed at children. (advertising / advertisements)", answers: ["advertising"], hint: "much + danh từ không đếm được" },
          { q: "3. Climate change threatens food ___, because harvests are becoming less reliable.", answers: ["security"], hint: "đủ ăn ≠ ăn không hại" },
          { q: "4. She told me an interesting piece of ___ about the new law.", answers: ["news"], hint: "a piece of ___" },
          { q: "5. The new rule is only a ___ solution; it helps some families but not others.", answers: ["partial"], hint: "một phần" },
        ],
      },
      { t: "h", text: "Phần IV — Dịch Việt → Anh (5 câu · ôn cả ngày)" },
      {
        t: "quiz",
        id: "t4d26-bt-dich",
        kind: "translate",
        title: "IV. Dịch — dùng từ trong gợi ý",
        grammar: "Câu học thuật / trang trọng: collocation của bài + một mệnh đề đối lập hoặc điều kiện.",
        items: [
          { q: "1. Chăn nuôi công nghiệp làm thịt rẻ hơn, nhưng nó góp phần gây ra kháng kháng sinh.", answers: ["Factory farming makes meat cheaper, but it contributes to antibiotic resistance.", "Factory farming has made meat cheaper, but it contributes to antibiotic resistance.", "Factory farming makes meat cheaper, but it contributes to antimicrobial resistance.", "Factory farming has made meat cheaper, but it has contributed to antibiotic resistance."], hint: "factory farming · contribute to · antibiotic resistance" },
          { q: "2. Vòng tin 24 giờ coi trọng tốc độ hơn độ chính xác.", answers: ["The 24-hour news cycle rewards speed over accuracy.", "The 24-hour news cycle values speed over accuracy.", "The 24-hour news cycle prioritises speed over accuracy.", "The 24-hour news cycle prioritizes speed over accuracy."], hint: "reward / value / prioritise A over B" },
          { q: "3. Tôi rất biết ơn nếu anh có thể xác nhận ngày phỏng vấn trước thứ Sáu.", answers: ["I would be grateful if you could confirm the interview date by Friday.", "I would be grateful if you could confirm the date of the interview by Friday.", "I would be grateful if you could confirm the interview date before Friday.", "I would be very grateful if you could confirm the interview date by Friday."], hint: "I would be grateful if you could … by …" },
          { q: "4. Trên giấy thì luật áp cho mọi người, nhưng trên thực tế nó được thực thi không đồng đều.", answers: ["On paper the law applies to everyone, but in practice it is enforced unevenly.", "On paper, the law applies to everyone, but in practice it is enforced unevenly.", "On paper the law applies to everyone, but in practice it is not enforced evenly.", "On paper, the law applies to everyone, but in practice it is applied unevenly."], hint: "On paper …, but in practice … · enforce unevenly" },
          { q: "5. Nhìn lại, đó là lời khuyên hữu ích nhất mà tôi từng nhận được.", answers: ["With hindsight, it was the most useful advice I have ever received.", "In hindsight, it was the most useful advice I have ever received.", "With hindsight, it was the most useful piece of advice I have ever received.", "In hindsight, it was the most useful piece of advice I have ever received."], hint: "With / In hindsight · the most useful (piece of) advice · have ever received" },
        ],
      },
      { t: "h", text: "Phần V — Thư trang trọng (6 câu · ôn Bài 2 mục 1–4, 9)" },
      {
        t: "mcq",
        id: "t4d26-bt-thu",
        title: "V. Chọn phương án đúng",
        items: [
          { q: "1. The letter begins “Dear Sir or Madam,”. The correct closing is:", options: ["Yours sincerely,", "Best wishes,", "Cheers,", "Yours faithfully,"], correct: 3, why: "Dear Sir or Madam ↔ Yours faithfully." },
          { q: "2. Which is the best evidence for “strong communication skills”?", options: ["I trained 15 new volunteers and wrote the guide they still use.", "I am a very good communicator.", "My friends say I am easy to talk to.", "I have communication skills and teamwork skills."], correct: 0, why: "A: hành động + con số + kết quả còn dùng. B, C, D chỉ nêu." },
          { q: "3. Choose the correct sentence.", options: ["I am writing to follow up my email of 3 May regarding to the refund.", "I am writing to follow up on my email of 3 May regarding the refund.", "I write to follow up on my email in 3 May about refund.", "I am writing this email for following up the refund."], correct: 1, why: "follow up on + my email of + ngày · regarding (không có to)." },
          { q: "4. Which sentence is polite but firm?", options: ["Pay me now or I will tell everyone.", "Sorry, maybe if you are free you could possibly look at it?", "I appreciate that this is a busy period; however, I would be grateful for a reply by 20 May.", "Why have you not replied to me?"], correct: 2, why: "C: ghi nhận + đề nghị có hạn. A đe doạ; B quá yếu; D trách móc." },
          { q: "5. “___ I not receive a reply by 20 May, I will contact your head office.”", options: ["Should", "Would", "Had", "Unless"], correct: 0, why: "Đảo ngữ điều kiện loại 1: Should + S + V = If + S + V. Had chỉ dùng cho loại 3; Unless không đứng với not." },
          { q: "6. Which phrase best replaces “I am a hard-working person” in a cover letter?", options: ["I always work very hard.", "I am extremely hard-working and responsible.", "Everybody knows I work hard.", "I completed the project two weeks ahead of schedule while working part-time."], correct: 3, why: "D chứng minh bằng việc cụ thể. A, B, C vẫn là tự khen." },
        ],
      },
      { t: "h", text: "Phần VI — Luật và lời khuyên (5 câu · ôn Bài 3 mục 3)" },
      {
        t: "quiz",
        id: "t4d26-bt-luat",
        kind: "fill",
        title: "VI. Điền MỘT từ",
        items: [
          { q: "1. All new apps must comply ___ the data protection rules.", answers: ["with"], hint: "comply ___" },
          { q: "2. He got off with a slap on the ___ — a tiny fine and a warning.", answers: ["wrist"], hint: "hình phạt nhẹ hều" },
          { q: "3. The school has a ___-tolerance policy on cheating.", answers: ["zero"], hint: "không khoan nhượng" },
          { q: "4. Nobody asked for his opinion; it was completely ___ advice.", answers: ["unsolicited"], hint: "không ai nhờ" },
          { q: "5. If I had ___ the warning, I would not have lost all my files.", answers: ["heeded"], hint: "had + V3 của heed" },
        ],
      },
      { t: "h", text: "Phần VII — Ghép câu (3 câu · ôn Bài 2 mục 4, Bài 3 mục 2)" },
      {
        t: "build",
        id: "t4d26-bt-ghep",
        title: "VII. Bấm các mảnh theo đúng thứ tự",
        items: [
          { vi: "Sau khi cân nhắc kỹ, tôi đã quyết định từ chối lời mời.", chips: ["Having given it", "careful consideration,", "I have decided", "to decline", "the offer.", "Having give it", "to declining"], answer: ["Having given it", "careful consideration,", "I have decided", "to decline", "the offer."] },
          { vi: "Trên giấy thì công bằng, nhưng trên thực tế thì không.", chips: ["On paper", "it is fair,", "but in practice", "it is not.", "in paper", "on practice"], answer: ["On paper", "it is fair,", "but in practice", "it is not."] },
          { vi: "Điều khiến tôi thật sự hiểu ra là đám cưới của chú tôi.", chips: ["What", "made it real", "for me", "was", "my uncle's wedding.", "It was what", "were"], answer: ["What", "made it real", "for me", "was", "my uncle's wedding."] },
        ],
      },
      { t: "h", text: "Viết thêm — email từ chối (AI chấm)" },
      {
        t: "essay",
        id: "t4d26-bt-email-tu-choi",
        task: "Task 1",
        prompt: "Email (120–150 words). Last week you were offered a part-time position as a junior web developer at a small design agency, but you have since accepted another offer that fits better with your university timetable. Write to the agency manager, Ms Sarah Lim. In your email: thank her for the offer; explain politely why you are declining it; suggest how you might keep in touch or work together in the future.",
        minWords: 120,
        tips: [
          "Dear Ms Lim, … Kind regards / Yours sincerely.",
          "Having given it careful consideration, I have decided to decline…, as…",
          "Kết mở cửa: I hope our paths cross again… / I would be glad to … in the future.",
        ],
      },
      {
        t: "note",
        title: "📌 Việc tiếp theo",
        items: [
          "Dưới 27 / 38: phần I – III sai nhiều ⇒ Bài 1 mục 1–5; phần V ⇒ Bài 2 mục 3–4 và bảng soát mục 9; phần VI – VII ⇒ Bài 3 mục 2–3.",
          "Chép vào sổ Speaking chuyện “lời khuyên” (Bài 3 mục 5) — từ nay nó là một trong 5 chuyện của kho.",
          "Ngày mai (Ngày 27): subjunctive & cấu trúc trang trọng, fronting; Reading 3 passage 60 phút lần 3; Speaking full 14 phút tự thu.",
        ],
      },
    ],
  },
];
