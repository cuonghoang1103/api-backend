/**
 * Ngày 8 — Reading: Table Completion · Writing: Opinion Essay 2 (thân bài:
 * câu chủ đề · giải thích · ví dụ) · Speaking: câu hỏi về sở thích & thời gian
 * rảnh (Part 1, 7 kiểu câu hỏi, âm /ŋ/ trong đuôi -ing) · Bài tập.
 *
 * Nội dung TỰ SOẠN (12/11/2026, không theo ảnh sách): bài đọc, bài mẫu, câu
 * trả lời mẫu và mọi câu bài tập đều viết mới. Nối tiếp Ngày 4 (Sentence
 * Completion, câu Yes/No về sở thích) và Ngày 6 (Flow-chart, mở bài Opinion,
 * câu Wh-). Bài đọc dài hơn Ngày 6 (6 đoạn A–F); số từ đếm bằng script.
 * Mỗi bài có sơ đồ (`sodo`); bài Nói có thẻ hình (`hinh`) và cảnh (`canh`).
 */
import type { Lesson } from '../data';

/* ─────────────────────────── Reading ─────────────────────────── */

const D8_READING: Lesson = {
  id: "d8-doc",
  kind: "reading",
  title: "Đọc: Table Completion (hoàn thành bảng)",
  goal: "Làm được dạng Table Completion: đọc tiêu đề hàng/cột để biết mỗi ô hỏi gì, đoán loại từ theo cả cột, dò đúng vị trí trong bài dù bảng không theo thứ tự bài, và chép đúng từ, đúng giới hạn số từ.",
  minutes: 50,
  blocks: [
    {
      t: "recap",
      title: "Bài này học gì",
      items: [
        "**Table Completion** = điền vào **bảng** (có hàng và cột). Mỗi ô trống lấy **đúng từ trong bài đọc**, không quá số từ đề cho.",
        "Chìa khoá của dạng này: mỗi ô nằm ở giao điểm **một hàng × một cột** → tiêu đề hàng cho biết **tìm ở đoạn nào**, tiêu đề cột cho biết **cần loại thông tin gì**.",
        "Các ô **cùng cột** có cùng loại thông tin → nhìn ô đã điền sẵn trong cột để ==đoán loại từ== (số, tên thành phố, danh từ…).",
        "Khác Flow-chart (Ngày 6): bảng **không phải lúc nào cũng theo thứ tự bài**. Đọc theo **hàng** thì thường đúng thứ tự, đọc theo **cột** thì nhảy qua lại.",
        "Luyện: bài đọc **6 đoạn A–F** (dài hơn Ngày 6) · Questions 1–7 Table Completion · Questions 8–10 ôn Sentence Completion · 24 từ vựng.",
      ],
    },
    {
      t: "p",
      text: "**Table** (bảng) trong đề Reading thường **tóm tắt** một phần bài đọc: mỗi hàng là một **đối tượng** (một phương pháp, một quốc gia, một loài vật, một giai đoạn lịch sử…) và mỗi cột là một **khía cạnh** của đối tượng đó (ở đâu, như thế nào, ưu điểm, nhược điểm, con số…). Một vài ô bị bỏ trống. Bạn tìm thông tin trong bài và **chép đúng từ của bài** vào ô.",
    },
    {
      t: "note",
      title: "Ghi nhớ về dạng bài",
      items: [
        "Đề thường ghi **NO MORE THAN TWO WORDS AND/OR A NUMBER** (không quá hai từ và/hoặc một con số): được viết **tối đa 2 từ**, hoặc **1 số**, hoặc **2 từ + 1 số** (ví dụ **40 per cent** là 1 số + 2 từ — vẫn trong giới hạn; nhưng nếu bảng đã in sẵn “per cent” thì chỉ điền **40**).",
        "Ô trong bảng viết **rất gọn**, giống ghi chú: hay bỏ mạo từ, bỏ động từ to be. Chỗ trống thường cần **danh từ**, **con số** hoặc **tên riêng**; thỉnh thoảng là **động từ** hay **tính từ** — nhìn chữ đứng trước/sau ô để biết.",
        "Từ điền vào phải **có trong bài**, đúng **chính tả** và đúng **dạng** (số ít/số nhiều) như trong bài. Tự đổi dạng là mất điểm dù hiểu đúng ý.",
        "Phần nâng cao: có đề cho sẵn **khung đáp án A–H** để chọn chữ cái. Cách đọc bảng vẫn y như vậy, chỉ khác bước cuối.",
      ],
    },
    {
      t: "sodo",
      kind: "compare",
      title: "Ba dạng “điền từ” bạn đã gặp — giống và khác nhau",
      caption: "Cả ba dạng đều chép **đúng từ trong bài** và giữ **giới hạn số từ**. Khác nhau ở **hình thức** và **thứ tự**.",
      cols: [
        { title: "Sentence Completion (Ngày 4)", items: ["Hoàn thành **một câu** có chỗ trống", "Câu hỏi **theo thứ tự** bài", "Đọc cả câu để đoán loại từ theo **ngữ pháp**", "Từ khoá: chủ ngữ + động từ của câu"] },
        { title: "Flow-chart (Ngày 6)", items: ["Các **ô nối bằng mũi tên ↓** — một quy trình", "**Luôn theo thứ tự** thời gian của bài", "Ô hay dùng **danh từ** (Collection of…, Testing of…)", "Từ khoá: từ chỉ bước (then, after, finally)"] },
        { title: "Table Completion (hôm nay)", items: ["**Bảng** có hàng × cột", "Theo hàng thì thường đúng thứ tự; theo cột thì **nhảy** qua lại", "Đoán loại từ nhờ **các ô cùng cột**", "Từ khoá: **tên hàng** (tên riêng, tên phương pháp) + **tên cột**"] },
      ],
    },

    { t: "h", text: "1. Cách làm: 6 bước" },
    {
      t: "sodo",
      kind: "flow",
      title: "Table Completion — làm theo đúng thứ tự này",
      steps: [
        { label: "Đọc tiêu đề bảng + tiêu đề hàng/cột", sub: "Bảng nói về gì? Mấy đối tượng (hàng)? Mấy khía cạnh (cột)?" },
        { label: "Xác định ô trống thuộc hàng nào, cột nào", sub: "Ô (3) = hàng “Green roofs” × cột “How it cools”" },
        { label: "Đoán loại từ theo cả cột", sub: "Cột toàn số → điền số. Cột toàn tên thành phố → tên riêng" },
        { label: "Dò (scan) từ khoá của hàng trong bài", sub: "Tên riêng, con số, tên phương pháp — dễ thấy nhất" },
        { label: "Đọc kỹ câu chứa thông tin, nhận ra paraphrase", sub: "people walking ↔ pedestrians · take heat from ↔ cool" },
        { label: "Chép đúng từ, đúng số từ, rồi đọc lại cả hàng", sub: "Không đổi dạng từ, không thêm mạo từ, khớp ngữ pháp với ô bên cạnh" },
      ],
    },
    {
      t: "table",
      head: ["Bước", "Làm gì", "Giải thích thêm"],
      rows: [
        ["1. Đọc tiêu đề", "Đọc **tên bảng**, **tên các hàng** và **tên các cột** trước khi đọc bài.", "Tên bảng thường trùng với **tiêu đề bài** hoặc một phần bài. Tên hàng thường là **tên riêng** (Melbourne, Singapore…) hoặc **tên phương pháp** → rất dễ dò."],
        ["2. Ô thuộc hàng nào, cột nào", "Với mỗi ô trống, nói thành lời: “ô này hỏi **[cột]** của **[hàng]**”.", "Ví dụ: “ô (6) hỏi **hạn chế chính** của **mặt đường phản quang**”. Nói được câu này là biết chính xác phải tìm gì."],
        ["3. Đoán loại từ", "Nhìn **các ô đã điền sẵn trong cùng cột** và chữ đứng **trước/sau** chỗ trống.", "Cột “Example” toàn tên thành phố → ô trống trong cột đó cũng là **tên thành phố**. Sau “up to ___ °C” → **con số**. Sau “the extra ___” → **danh từ**."],
        ["4. Dò từ khoá của hàng", "**Scan** (lướt tìm) tên hàng trong bài để biết đoạn nào nói về đối tượng đó.", "Thường **mỗi hàng ứng với một đoạn**. Tìm được đoạn rồi thì chỉ đọc kỹ đoạn đó, không đọc lại cả bài."],
        ["5. Đọc kỹ câu chứa đáp án", "So từ trong ô với câu trong bài: từ của bảng thường **đã bị đổi** (paraphrase).", "Như Ngày 4 và Ngày 6: **people walking past** → **pedestrians**; **take heat from the air** → **cool the air**. Cẩn thận **hai con số** hoặc **hai danh từ** đứng gần nhau."],
        ["6. Chép và soát", "Chép **nguyên văn** từ trong bài, đếm số từ, đọc lại **cả hàng** xem có hợp lý không.", "Bài viết **pedestrians** (số nhiều) thì không chép ~~pedestrian~~. Bảng đã in sẵn **per cent / °C / years** thì **không** viết lại đơn vị."],
      ],
    },
    {
      t: "note",
      title: "Người Việt hay sai ở dạng bài này",
      items: [
        "Đọc bảng **theo cột từ trên xuống** rồi đi tìm đáp án theo thứ tự (1) → (2) → (3)… như Flow-chart. Bảng có thể đánh số **theo hàng**, nên (2) có thể nằm ở đoạn **sau** (3). Hãy tìm theo **hàng** (đoạn), không theo số câu.",
        "Chép **con số đầu tiên** thấy trong đoạn. Đoạn văn về số liệu hay có **2–3 con số** (hiện nay 22%, mục tiêu 40%, năm 2040). Đọc kỹ ô hỏi **số nào**: hiện tại hay mục tiêu? bề mặt hay trong nhà?",
        "Viết lại **đơn vị đã in sẵn**: bảng ghi “___ per cent” mà điền ~~40 per cent~~ là thừa từ; với giới hạn chặt, thừa từ = **sai**.",
        "Điền **từ đúng ý nhưng không có trong bài** (tự nghĩ ra từ đồng nghĩa). Đề yêu cầu **from the passage** — phải là từ của bài.",
        "Sai chính tả tên riêng hoặc từ dài (**Los Angeles**, **evaporate**). Chép xong, nhìn lại bài so từng chữ cái.",
      ],
    },
    {
      t: "rule",
      formula: "Ô (n) = [cột] của [hàng] → đoán loại từ theo cả cột → scan tên hàng → đọc kỹ câu, nhận paraphrase → chép đúng từ trong bài, đúng số từ",
      vi: "Tìm theo HÀNG (đoạn văn), không theo số câu; không viết lại đơn vị bảng đã in sẵn.",
    },

    { t: "h", text: "2. Ví dụ ngắn: áp dụng 6 bước" },
    {
      t: "examples",
      items: [
        { en: "Table: Coffee in two countries — Country | Main type grown | Harvest season — Vietnam | robusta | November–January — Ethiopia | ______ | October–December", vi: "Bảng: Cà phê ở hai nước — Nước | Loại trồng chủ yếu | Mùa thu hoạch — Việt Nam | robusta | tháng 11–1 — Ethiopia | ______ | tháng 10–12" },
        { en: "Passage: Vietnam grows mostly robusta beans, which are picked from November to January. Ethiopia, by contrast, is famous for arabica, and its farmers harvest between October and December. Some Ethiopian families also grow tea.", vi: "Bài đọc: Việt Nam chủ yếu trồng hạt robusta, được hái từ tháng 11 đến tháng 1. Trái lại, Ethiopia nổi tiếng với arabica, và nông dân ở đó thu hoạch từ tháng 10 đến tháng 12. Một số gia đình Ethiopia còn trồng chè." },
      ],
    },
    {
      t: "table",
      head: ["Bước", "Áp dụng vào ví dụ (ONE WORD ONLY)"],
      rows: [
        ["1. Tiêu đề", "Bảng so sánh cà phê ở **2 nước** (2 hàng) theo **2 khía cạnh**: loại cà phê, mùa thu hoạch."],
        ["2. Hàng × cột", "Ô trống = **loại cà phê chính** (cột 2) của **Ethiopia** (hàng 2)."],
        ["3. Loại từ", "Ô cùng cột đã có **robusta** → cần **tên một loại cà phê**, một từ."],
        ["4. Dò hàng", "Scan chữ **Ethiopia** → câu thứ hai của bài."],
        ["5. Đọc kỹ", "“Ethiopia… is **famous for** arabica” ↔ **main type grown**. Bẫy: **tea** ở câu sau — nhưng chè không phải loại **cà phê**."],
        ["6. Chép & soát", "**arabica** — một từ, đúng chính tả. Đọc lại cả hàng: Ethiopia | arabica | October–December ✓"],
      ],
    },

    { t: "h", text: "3. Bài đọc luyện tập" },
    {
      t: "p",
      text: "Bài đọc dưới đây được soạn riêng cho khoá học, chủ đề **đô thị và khí hậu** — rất hay gặp ở Reading và cả Writing Task 2. Bài dài **6 đoạn A–F**. Làm đúng thứ tự: đọc bảng Questions 1–7 **trước** (bước 1–3), rồi mới đọc bài để dò (bước 4–6).",
    },
    {
      t: "canh",
      anh: ["cityscape", "sun", "deciduous-tree", "droplet"],
      caption: "Thành phố mùa hè nóng hơn vùng quê xung quanh. Bài đọc nói về bốn cách làm mát đường phố: **cây xanh**, **mái xanh**, **mặt đường phản quang** và **phun sương**.",
    },
    {
      t: "passage",
      title: "Keeping Cities Cool: Four Ways to Beat the Urban Heat",
      intro: "Bài đọc 6 đoạn A–F. Questions 1–7 (Table Completion) và 8–10 (Sentence Completion) ở ngay bên dưới.",
      paras: [
        {
          label: "A",
          text: "On a summer afternoon, the centre of a large city can be up to 7°C hotter than the countryside around it. Scientists call this the urban heat island effect. Roads, roofs and car parks are made of dark materials such as asphalt and concrete, which absorb sunlight during the day and release it slowly at night. At the same time, millions of air conditioners pump hot air out into the streets, so the problem feeds itself: the hotter the city becomes, the more people switch on their machines. As heatwaves become longer and more frequent, city governments around the world are testing different ways to keep their streets cool. Four of the most common approaches are described below.",
        },
        {
          label: "B",
          text: "The oldest and simplest solution is to plant more trees. Melbourne in Australia is often held up as a model. At present, trees cover about 22 per cent of the city, and its Urban Forest Strategy aims to increase this figure to 40 per cent by 2040. Trees cool a street in two ways. First, their leaves block sunlight, and a pavement in deep shade can be as much as 20°C cooler than one in full sun. Second, trees release water vapour through tiny holes in their leaves, a process that takes heat out of the surrounding air. The main weakness of this method is time. A young tree needs around 15 years to provide useful shade, and during its first three years it must be watered regularly by city workers. Tree roots can also crack pavements and damage underground pipes if the wrong species is chosen.",
        },
        {
          label: "C",
          text: "A second option is to turn the tops of buildings into gardens. In Singapore, where land is expensive, the government offers grants that cover up to half the cost of installing a green roof on office buildings and shopping centres. A layer of soil and low plants protects the roof from direct sunlight. Measurements show that the surface of a green roof can stay 30°C cooler than a dark roof nearby, and that the floor directly beneath it can be up to 4°C cooler, which means less electricity is spent on air conditioning. Green roofs also soak up rainwater, lowering the risk of flooding in the streets below. However, not every building is suitable. Wet soil is surprisingly heavy, so engineers must first check that the structure can support the extra weight. Plants on a roof also need regular maintenance, especially during dry months.",
        },
        {
          label: "D",
          text: "Instead of adding something green, some cities have changed the colour of the ground itself. Los Angeles has covered hundreds of kilometres of its roads with a light-grey coating that reflects sunlight instead of absorbing it. Tests carried out on the treated streets found that their surface was, on average, 6°C cooler on hot afternoons. The coating is cheaper than planting trees and works from the first day, but it is not perfect. The main concern is glare: sunlight that bounces off a bright road can hit people walking past, so pedestrians may actually feel hotter, even though the road itself is cooler. In addition, the coating gradually wears away under heavy traffic and has to be renewed after about seven years.",
        },
        {
          label: "E",
          text: "The fourth approach is designed for places where people gather and wait. At bus stops, outdoor markets and railway stations in cities such as Tokyo, small pipes spray a fine mist of water into the air. The drops are so tiny that they evaporate almost immediately, before they can make anyone wet, and as they do so they take heat from the air. A misting system can lower the temperature by two or three degrees in a small area, and visitors often say they feel the difference at once. Yet the effect disappears a few metres away, and the systems use both water and electricity. They also work poorly in humid weather, because the air is already so full of moisture that the drops cannot evaporate quickly.",
        },
        {
          label: "F",
          text: "Each of these methods has its own strengths and limitations, and none of them can solve the problem alone. Trees are cheap to plant but slow to grow; cool pavements act quickly but can make walking uncomfortable; green roofs and misting systems only help in particular places. For this reason, many urban planners now argue that the best results come from combining several methods, for example by planting trees along roads that have been given a reflective coating. In tropical cities such as Ho Chi Minh City, where temperatures are high for most of the year, such a mixed strategy may soon become a necessity rather than a choice.",
        },
      ],
    },

    { t: "h", text: "Questions 1–7" },
    {
      t: "p",
      text: "Complete the table below. Choose **NO MORE THAN TWO WORDS AND/OR A NUMBER** from the passage for each answer. — **Hoàn thành bảng dưới đây. Chọn KHÔNG QUÁ HAI TỪ VÀ/HOẶC MỘT CON SỐ trong bài đọc cho mỗi câu trả lời.**",
    },
    {
      t: "table",
      caption: "Four ways to cool city streets — Bốn cách làm mát đường phố",
      head: ["Method", "Example", "How it cools", "Main limitation"],
      rows: [
        ["**Street trees**", "Melbourne: aims to reach **(1) ______** per cent tree cover", "gives shade; releases **(2) ______** through leaves", "needs about 15 years to give useful shade"],
        ["**Green roofs**", "office buildings and shopping centres in Singapore", "keeps the floor below up to **(3) ______** °C cooler", "building must be able to support the extra **(4) ______**"],
        ["**Cool pavements**", "**(5) ______**, where hundreds of kilometres of roads were treated", "light-grey coating reflects sunlight", "**(6) ______** can make pedestrians feel hotter"],
        ["**Misting systems**", "bus stops, markets and stations in Tokyo", "tiny drops of water **(7) ______** and take heat from the air", "work poorly in humid weather"],
      ],
    },
    {
      t: "quiz",
      id: "d8-doc-bang",
      title: "Questions 1–7 — NO MORE THAN TWO WORDS AND/OR A NUMBER",
      kind: "fill",
      items: [
        { q: "(1) Street trees — Melbourne: aims to reach ___ per cent tree cover", answers: ["40", "forty"] },
        { q: "(2) Street trees — gives shade; releases ___ through leaves", answers: ["water vapour", "water vapor"] },
        { q: "(3) Green roofs — keeps the floor below up to ___ °C cooler", answers: ["4", "four"] },
        { q: "(4) Green roofs — building must be able to support the extra ___", answers: ["weight"] },
        { q: "(5) Cool pavements — ___, where hundreds of kilometres of roads were treated", answers: ["Los Angeles"] },
        { q: "(6) Cool pavements — ___ can make pedestrians feel hotter", answers: ["glare"] },
        { q: "(7) Misting systems — tiny drops of water ___ and take heat from the air", answers: ["evaporate"] },
      ],
    },

    { t: "h", text: "Questions 8–10 (ôn Sentence Completion — Ngày 4)" },
    {
      t: "p",
      text: "Complete the sentences below. Choose **NO MORE THAN TWO WORDS** from the passage for each answer. — **Hoàn thành các câu dưới đây. Chọn KHÔNG QUÁ HAI TỪ trong bài đọc cho mỗi câu trả lời.**",
    },
    {
      t: "quiz",
      id: "d8-doc-on",
      title: "Questions 8–10 — NO MORE THAN TWO WORDS",
      kind: "fill",
      items: [
        { q: "(8) One reason why cities stay hot is the hot air produced by ___ .", answers: ["air conditioners"] },
        { q: "(9) Green roofs can reduce the danger of ___ after heavy rain.", answers: ["flooding"] },
        { q: "(10) Many urban planners believe that ___ several methods gives the best results.", answers: ["combining"] },
      ],
    },

    { t: "h", text: "4. Giải thích đáp án" },
    {
      t: "note",
      title: "Giải thích đáp án câu 1: 40",
      items: [
        "**Vị trí:** đoạn B, câu 3. Ô (1) = **mục tiêu** (cột Example) của **Street trees** (hàng 1). Scan **Melbourne** → đoạn B.",
        "Bài viết: “At present, trees cover about 22 per cent of the city, and its Urban Forest Strategy **aims to increase** this figure **to 40 per cent** by 2040.” — **Hiện nay cây xanh phủ khoảng 22% thành phố, và Chiến lược Rừng đô thị đặt mục tiêu nâng con số này lên 40% vào năm 2040.**",
        "Paraphrase: **aims to increase… to** ↔ **aims to reach**; **trees cover** ↔ **tree cover**.",
        "Bẫy **ba con số liền nhau**: **22** là con số **hiện nay** (at present), **2040** là **năm** — chỉ **40** là mục tiêu. Bảng đã in sẵn “per cent” nên chỉ điền **40**.",
      ],
    },
    {
      t: "note",
      title: "Giải thích đáp án câu 2: water vapour",
      items: [
        "**Vị trí:** đoạn B, câu 6. Cột **How it cools** của hàng **Street trees**.",
        "Bài viết: “Second, trees **release water vapour through tiny holes in their leaves**, a process that takes heat out of the surrounding air.” — **Thứ hai, cây thải hơi nước qua những lỗ rất nhỏ trên lá, một quá trình lấy nhiệt ra khỏi không khí xung quanh.**",
        "Ô viết gần như nguyên văn: **releases ___ through leaves**. Sau **releases** cần **danh từ** → **water vapour** (2 từ, đúng giới hạn).",
        "Chép **water vapour** (chính tả Anh như trong bài). Viết **vapor** kiểu Mỹ thường vẫn được chấp nhận, nhưng an toàn nhất là chép **đúng như bài**. Đừng viết ~~vapour~~ một mình (thiếu nghĩa) hay ~~water vapours~~ (bài không có -s).",
      ],
    },
    {
      t: "note",
      title: "Giải thích đáp án câu 3: 4",
      items: [
        "**Vị trí:** đoạn C, câu 4. Cột **How it cools** của hàng **Green roofs**.",
        "Bài viết: “…the surface of a green roof can stay 30°C cooler than a dark roof nearby, and that **the floor directly beneath it** can be **up to 4°C cooler**…” — **…bề mặt mái xanh có thể mát hơn 30°C so với mái tối màu gần đó, và tầng ngay bên dưới có thể mát hơn tới 4°C…**",
        "Paraphrase: **the floor directly beneath it** ↔ **the floor below**. Bảng đã in sẵn **°C** → chỉ điền **4**.",
        "Bẫy **hai con số**: **30** là nhiệt độ **bề mặt mái**, không phải **tầng bên dưới**. Đây là kiểu bẫy rất hay gặp: đọc đúng **cái gì** mát hơn, không chỉ nhìn con số.",
      ],
    },
    {
      t: "note",
      title: "Giải thích đáp án câu 4: weight",
      items: [
        "**Vị trí:** đoạn C, câu 7. Cột **Main limitation** của hàng **Green roofs**.",
        "Bài viết: “Wet soil is surprisingly heavy, so engineers must first check that **the structure can support the extra weight**.” — **Đất ướt nặng một cách bất ngờ, nên kỹ sư phải kiểm tra trước xem kết cấu toà nhà có đỡ được phần trọng lượng thêm hay không.**",
        "Paraphrase: **the structure** ↔ **building**; **can support** ↔ **must be able to support**. Sau **the extra** cần **danh từ** → **weight**.",
        "Bẫy: câu cuối đoạn nói **regular maintenance** (bảo dưỡng) — cũng là một hạn chế, nhưng ô (4) đi với **support the extra…** nên chỉ **weight** khớp. Ở đoạn C còn có **cost** (chi phí) — nhưng đó là phần **chính phủ hỗ trợ**, không phải thứ toà nhà phải “đỡ”.",
      ],
    },
    {
      t: "note",
      title: "Giải thích đáp án câu 5: Los Angeles",
      items: [
        "**Vị trí:** đoạn D, câu 2. Cột **Example** của hàng **Cool pavements**.",
        "Bài viết: “**Los Angeles** has covered **hundreds of kilometres of its roads** with a light-grey coating…” — **Los Angeles đã phủ hàng trăm ki-lô-mét đường bằng một lớp sơn màu xám nhạt…**",
        "Bước 3 giúp đoán trước: cột Example có **Melbourne**, **Singapore**, **Tokyo** → ô (5) gần như chắc chắn là **tên thành phố**. **covered** ↔ **treated** (được xử lý).",
        "Tên riêng gồm **2 từ** — vừa đúng giới hạn. Nhớ chép đúng chính tả **Los Angeles** (viết hoa hay không thường không bị trừ, nhưng sai một chữ cái là sai).",
      ],
    },
    {
      t: "note",
      title: "Giải thích đáp án câu 6: glare",
      items: [
        "**Vị trí:** đoạn D, câu 5. Cột **Main limitation** của hàng **Cool pavements**.",
        "Bài viết: “**The main concern is glare**: sunlight that bounces off a bright road can hit **people walking past**, so **pedestrians may actually feel hotter**…” — **Mối lo chính là ánh chói: ánh nắng dội lại từ mặt đường sáng màu có thể chiếu vào người đi ngang qua, nên người đi bộ thậm chí có thể thấy nóng hơn…**",
        "Paraphrase: **the main concern** ↔ **Main limitation**; **may actually feel hotter** ↔ **can make… feel hotter**.",
        "Bẫy: câu cuối đoạn nói lớp sơn **wears away** (mòn dần) — cũng là hạn chế, nhưng ô (6) là thứ **làm người đi bộ thấy nóng** → **glare**. Một từ, danh từ **không đếm được**: không viết ~~glares~~, không thêm ~~the~~.",
      ],
    },
    {
      t: "note",
      title: "Giải thích đáp án câu 7: evaporate",
      items: [
        "**Vị trí:** đoạn E, câu 3. Cột **How it cools** của hàng **Misting systems**.",
        "Bài viết: “The drops are so tiny that they **evaporate** almost immediately… and as they do so **they take heat from the air**.” — **Những giọt nước nhỏ đến mức bay hơi gần như ngay lập tức… và khi bay hơi chúng lấy nhiệt từ không khí.**",
        "Ô có dạng **tiny drops of water ___ and take heat** → chỗ trống đứng song song với động từ **take** qua chữ **and** → cần **động từ** ở dạng nguyên mẫu (chủ ngữ số nhiều “drops”) → **evaporate**.",
        "Bẫy: **spray** ở câu 2 (ống phun sương) — nhưng **spray** là việc **ống nước** làm, không phải giọt nước. Chép đúng **evaporate**, không đổi thành danh từ ~~evaporation~~.",
      ],
    },
    {
      t: "note",
      title: "Giải thích đáp án câu 8–10 (Sentence Completion)",
      items: [
        "**(8) air conditioners** — đoạn A: “millions of **air conditioners** pump hot air out into the streets”. Paraphrase: **pump hot air** ↔ **hot air produced by**. Hai từ, số nhiều như trong bài.",
        "**(9) flooding** — đoạn C: “Green roofs also soak up rainwater, **lowering the risk of flooding**”. Paraphrase: **lowering the risk** ↔ **reduce the danger**; **rainwater** ↔ **heavy rain**. Bẫy: ~~rainwater~~ — mái xanh **hấp thụ** nước mưa chứ không **giảm nguy cơ** nước mưa.",
        "**(10) combining** — đoạn F: “many urban planners now argue that **the best results come from combining several methods**”. Paraphrase: **argue** ↔ **believe**; **come from** ↔ **gives**. Ô đứng làm **chủ ngữ** trước “several methods gives…” → cần **V-ing** → **combining** (không viết ~~combine~~).",
      ],
    },

    { t: "h", text: "5. Từ vựng hữu ích (24 từ)" },
    {
      t: "p",
      text: "Tất cả 24 từ đều có trong bài đọc (có khi ở dạng khác: absorbing, installing, renewed…). Bấm 🔊 để nghe, tìm lại từ trong bài, rồi tự đặt một câu về thành phố bạn sống. Chủ đề **đô thị – khí hậu** quay lại rất nhiều ở Writing Task 2.",
    },
    {
      t: "vocab",
      items: [
        { w: "absorb", pos: "v", ipa: "/əbˈzɔːb/", vi: "hấp thụ, thấm, hút vào", ex: "Dark clothes absorb more heat than white ones.", exVi: "Quần áo tối màu hấp thụ nhiều nhiệt hơn quần áo trắng.", more: "Trái nghĩa: **reflect** (phản chiếu). Danh từ: **absorption**. Cụm: **be absorbed in** a book = mải mê đọc sách." },
        { w: "release", pos: "v, n", ipa: "/rɪˈliːs/", vi: "thải ra, giải phóng; phát hành", ex: "Factories release a lot of smoke into the air.", exVi: "Các nhà máy thải nhiều khói vào không khí.", more: "Hay đi với: **release** heat / gas / water vapour · **release** a film / an album (phát hành)." },
        { w: "heatwave", pos: "n", ipa: "/ˈhiːtweɪv/", vi: "đợt nắng nóng (kéo dài nhiều ngày)", ex: "During the heatwave, schools in the city closed early.", exVi: "Trong đợt nắng nóng, các trường trong thành phố cho nghỉ sớm.", more: "Viết liền **heatwave** hoặc rời **heat wave** đều đúng. Cụm: **a severe / long heatwave**.", anh: "thermometer" },
        { w: "frequent", pos: "adj", ipa: "/ˈfriːkwənt/", vi: "thường xuyên, hay xảy ra", ex: "Power cuts are frequent in summer here.", exVi: "Ở đây mùa hè hay bị cắt điện.", more: "Trạng từ **frequently**; danh từ **frequency** (tần suất). **more frequent** = xảy ra thường xuyên hơn." },
        { w: "approach", pos: "n", ipa: "/əˈprəʊtʃ/", vi: "cách tiếp cận, phương pháp", ex: "Our teacher uses a very practical approach to grammar.", exVi: "Cô giáo dùng một cách dạy ngữ pháp rất thực tế.", more: "**an approach to** + N/V-ing (~~approach for~~). Trong Writing là từ đồng nghĩa tốt của **way / method**." },
        { w: "shade", pos: "n", ipa: "/ʃeɪd/", vi: "bóng râm", ex: "Let's sit in the shade of that big tree.", exVi: "Mình ngồi dưới bóng râm của cái cây to kia đi.", more: "**shade** = chỗ râm mát (không đếm được); **shadow** = cái bóng có hình dạng của vật. **in the shade** ≠ ~~under the shade~~ (ít dùng)." },
        { w: "pavement", pos: "n", ipa: "/ˈpeɪvmənt/", vi: "vỉa hè (Anh-Anh); mặt đường lát (Mỹ)", ex: "Motorbikes are often parked on the pavement in Hanoi.", exVi: "Ở Hà Nội xe máy hay đỗ trên vỉa hè.", more: "Anh-Anh **pavement** = vỉa hè (Mỹ: **sidewalk**). Trong bài, **cool pavements** = mặt đường/vỉa hè được làm mát." },
        { w: "water vapour", pos: "n", ipa: "/ˈwɔːtə ˌveɪpə(r)/", vi: "hơi nước", ex: "Clouds form when water vapour cools down.", exVi: "Mây hình thành khi hơi nước nguội đi.", more: "Không đếm được. Mỹ viết **vapor**. **steam** = hơi nước nóng bốc lên từ nước sôi.", anh: "droplet" },
        { w: "species", pos: "n", ipa: "/ˈspiːʃiːz/", vi: "loài (động/thực vật)", ex: "This park has more than fifty species of birds.", exVi: "Công viên này có hơn năm mươi loài chim.", more: "Số ít = số nhiều: **one species, many species** (ôn Ngày 5). ~~specie~~ là sai." },
        { w: "grant", pos: "n", ipa: "/ɡrɑːnt/", vi: "khoản trợ cấp, tiền tài trợ (không phải hoàn lại)", ex: "She received a government grant to study abroad.", exVi: "Cô ấy nhận được khoản trợ cấp của chính phủ để đi du học.", more: "**offer / receive / apply for** a grant. Khác **loan** (khoản vay — phải trả lại)." },
        { w: "install", pos: "v", ipa: "/ɪnˈstɔːl/", vi: "lắp đặt, cài đặt", ex: "We installed solar panels on our roof last year.", exVi: "Năm ngoái nhà tôi lắp tấm pin mặt trời trên mái.", more: "Danh từ **installation** (sự lắp đặt). Cài phần mềm cũng dùng **install** an app." },
        { w: "surface", pos: "n", ipa: "/ˈsɜːfɪs/", vi: "bề mặt", ex: "The surface of the road was too hot to touch.", exVi: "Mặt đường nóng đến mức không chạm tay vào được.", more: "Hay đi với: **on the surface**, **a smooth / rough surface**, **surface temperature**." },
        { w: "flooding", pos: "n", ipa: "/ˈflʌdɪŋ/", vi: "tình trạng ngập lụt", ex: "Heavy rain caused flooding in many streets of the city.", exVi: "Mưa lớn gây ngập ở nhiều tuyến phố trong thành phố.", more: "**flooding** không đếm được (tình trạng ngập); **a flood / floods** đếm được (một trận lũ). **the risk of flooding**.", anh: "water-wave" },
        { w: "suitable", pos: "adj", ipa: "/ˈsuːtəbl/", vi: "phù hợp, thích hợp", ex: "This flat is not suitable for a family with three children.", exVi: "Căn hộ này không phù hợp cho một gia đình có ba con.", more: "**suitable for** + người/việc (~~suitable with~~). Trái nghĩa: **unsuitable**. Gần nghĩa: **appropriate** (Ngày 6)." },
        { w: "maintenance", pos: "n", ipa: "/ˈmeɪntənəns/", vi: "sự bảo dưỡng, bảo trì", ex: "Old buses need a lot of maintenance.", exVi: "Xe buýt cũ cần bảo dưỡng nhiều.", more: "Không đếm được. Động từ **maintain** /meɪnˈteɪn/ — chú ý chính tả danh từ là **-tenance**, không phải ~~maintainance~~." },
        { w: "coating", pos: "n", ipa: "/ˈkəʊtɪŋ/", vi: "lớp phủ, lớp sơn phủ", ex: "The pan has a special coating, so food does not stick.", exVi: "Chiếc chảo có lớp phủ đặc biệt nên thức ăn không bị dính.", more: "Từ **coat** (áo khoác; lớp sơn): **a coat of paint** = một lớp sơn." },
        { w: "reflect", pos: "v", ipa: "/rɪˈflekt/", vi: "phản chiếu, phản xạ (ánh sáng, nhiệt)", ex: "White walls reflect sunlight and keep the house cool.", exVi: "Tường trắng phản chiếu ánh nắng và giữ nhà mát.", more: "Tính từ **reflective** (có tính phản quang): **a reflective coating / jacket**. Nghĩa khác: **reflect on** = suy ngẫm." },
        { w: "glare", pos: "n", ipa: "/ɡleə(r)/", vi: "ánh sáng chói (gây khó chịu)", ex: "I wear sunglasses to protect my eyes from the glare.", exVi: "Tôi đeo kính râm để bảo vệ mắt khỏi ánh chói.", more: "Không đếm được. Động từ **glare at sb** = trừng mắt nhìn ai." },
        { w: "pedestrian", pos: "n", ipa: "/pəˈdestriən/", vi: "người đi bộ", ex: "This street is only for pedestrians at the weekend.", exVi: "Cuối tuần con phố này chỉ dành cho người đi bộ.", more: "**a pedestrian street / zone** (phố đi bộ) · **pedestrian crossing** (vạch qua đường).", anh: "person-walking" },
        { w: "wear away", pos: "phr v", ipa: "/weər əˈweɪ/", vi: "mòn dần, bào mòn", ex: "The words on the old sign have worn away.", exVi: "Chữ trên tấm biển cũ đã mòn hết.", more: "Bất quy tắc: **wear – wore – worn**. Gần nghĩa: **wear out** (dùng đến hỏng)." },
        { w: "renew", pos: "v", ipa: "/rɪˈnjuː/", vi: "làm mới, gia hạn", ex: "I need to renew my passport before the trip.", exVi: "Tôi cần gia hạn hộ chiếu trước chuyến đi.", more: "**renew** a passport / a contract / a membership. Tính từ **renewable** — **renewable energy** (năng lượng tái tạo)." },
        { w: "evaporate", pos: "v", ipa: "/ɪˈvæpəreɪt/", vi: "bay hơi", ex: "In the dry season, small ponds evaporate quickly.", exVi: "Vào mùa khô, các ao nhỏ bay hơi rất nhanh.", more: "Danh từ **evaporation**. Cùng gốc với **vapour** (hơi nước) — nhớ một từ là đoán được từ kia." },
        { w: "humid", pos: "adj", ipa: "/ˈhjuːmɪd/", vi: "ẩm ướt, nồm (không khí nhiều hơi nước)", ex: "Hanoi is very humid in early spring.", exVi: "Hà Nội rất nồm ẩm vào đầu xuân.", more: "Danh từ **humidity** (độ ẩm); gần nghĩa **moisture** (hơi ẩm — có trong đoạn E). Trái nghĩa: **dry**.", anh: "sweat-droplets" },
        { w: "necessity", pos: "n", ipa: "/nəˈsesəti/", vi: "sự cần thiết; thứ thiết yếu", ex: "For many families, a motorbike is a necessity, not a luxury.", exVi: "Với nhiều gia đình, xe máy là thứ thiết yếu chứ không phải xa xỉ.", more: "**a necessity rather than a choice / luxury** — cụm hay dùng trong Task 2. Tính từ **necessary**." },
      ],
    },
    {
      t: "note",
      title: "Cẩn thận: những từ dễ dùng sai",
      items: [
        "**shade ≠ shadow**: ngồi ở chỗ râm là **in the shade**; cái bóng in trên tường là **a shadow**.",
        "**pavement**: Anh-Anh là **vỉa hè**; Mỹ dùng **sidewalk** cho vỉa hè. Trong IELTS dùng kiểu nào cũng được, miễn hiểu đúng khi đọc.",
        "**flooding** (không đếm được, “tình trạng ngập”) khác **a flood** (một trận lũ). Viết **the risk of flooding**, không viết ~~the risk of floodings~~.",
        "**suitable for** (không phải ~~suitable with~~) · **an approach to** (không phải ~~approach for~~).",
        "**species** số ít và số nhiều giống nhau — một lỗi rất hay gặp trong Writing về môi trường: ~~many specie~~ / ~~many specieses~~.",
      ],
    },
    {
      t: "rule",
      formula: "S + absorb / reflect / release + N · be suitable for + N · the risk of + N/V-ing · an approach to + N/V-ing",
      vi: "Bốn khung câu lấy từ bài đọc, dùng lại được ngay khi viết về đô thị và môi trường.",
    },
    {
      t: "quiz",
      id: "d8-doc-dich",
      title: "Dịch nhanh — dùng từ trong bài đọc (4 câu)",
      kind: "translate",
      grammar: "Hiện tại đơn cho sự thật: S + V(s/es). Hiện tại tiếp diễn cho xu hướng đang diễn ra: S + am/is/are + V-ing (Ngày 9 học kỹ). be suitable for + N. may / can + V nguyên mẫu.",
      items: [
        { q: "Cây xanh cho bóng mát và thải hơi nước.", hint: "trees, provide / give, shade, release, water vapour", answers: ["Trees provide shade and release water vapour.", "Trees give shade and release water vapour.", "Trees provide shade and release water vapor.", "Trees give shade and release water vapor.", "Trees provide shade and they release water vapour."] },
        { q: "Các đợt nắng nóng đang ngày càng dài hơn và thường xuyên hơn.", hint: "heatwaves, are becoming / are getting, longer, more frequent", answers: ["Heatwaves are becoming longer and more frequent.", "Heatwaves are getting longer and more frequent.", "Heat waves are becoming longer and more frequent.", "Heat waves are getting longer and more frequent.", "The heatwaves are becoming longer and more frequent.", "Heatwaves are becoming longer and more common."] },
        { q: "Mái nhà này không phù hợp để làm một khu vườn.", hint: "this roof, is not suitable for, a garden", answers: ["This roof is not suitable for a garden.", "This roof isn't suitable for a garden.", "This roof is unsuitable for a garden.", "This roof is not suitable for a roof garden.", "This roof isn't suitable for a roof garden."] },
        { q: "Người đi bộ có thể cảm thấy nóng hơn vì ánh chói.", hint: "pedestrians, may / can, feel hotter, because of, the glare", answers: ["Pedestrians may feel hotter because of the glare.", "Pedestrians can feel hotter because of the glare.", "Pedestrians might feel hotter because of the glare.", "Pedestrians may feel hotter because of glare.", "Pedestrians can feel hotter because of glare.", "Pedestrians might feel hotter because of glare.", "Pedestrians may feel hotter due to the glare."] },
      ],
    },
  ],
};

/* ─────────────────────────── Writing ─────────────────────────── */

const D8_WRITING: Lesson = {
  id: "d8-viet",
  kind: "writing",
  title: "Viết: Opinion Essay 2 — thân bài (câu chủ đề · giải thích · ví dụ)",
  goal: "Viết được một đoạn thân bài Task 2 khoảng 90–110 từ gồm câu chủ đề bám thesis, 1–2 câu giải thích và một ví dụ cụ thể, nối với nhau bằng từ nối đúng — và ghép thành một bài Opinion trọn vẹn.",
  minutes: 60,
  blocks: [
    {
      t: "recap",
      title: "Bài này học gì",
      items: [
        "Ngày 6: mở bài = **paraphrase + thesis có 2 lý do**. Hôm nay: **mỗi lý do thành một đoạn thân bài**.",
        "Một đoạn thân bài có 3 phần: ==Topic sentence== (câu chủ đề) → ==Explanation== (giải thích vì sao / như thế nào) → ==Example== (ví dụ cụ thể). Có thể thêm một câu **kết đoạn** nối về quan điểm.",
        "Câu chủ đề nói **một ý duy nhất**, khớp đúng một lý do trong thesis: **Firstly, + lý do 1.** · **Secondly, + lý do 2.**",
        "Từ nối giải thích: **This is because… · This means that… · As a result,… · In other words,…**. Từ nối ví dụ: **For example, · For instance, · such as · A good example of this is…**",
        "Bài mẫu 306 từ cho đề **làm việc tại nhà**, phân tích từng câu + so sánh đoạn band 4 và đoạn band 6.",
      ],
    },

    { t: "h", text: "1. Nhắc lại: mở bài quyết định thân bài" },
    {
      t: "p",
      text: "Ở Ngày 6 bạn đã viết mở bài 2 câu: câu 1 **viết lại đề** (paraphrase), câu 2 là **thesis statement** — câu luận điểm nêu quan điểm và **hai lý do**. Hai lý do đó chính là **bản đồ** của cả bài: lý do 1 → **thân bài 1**, lý do 2 → **thân bài 2**. Giám khảo đọc mở bài xong là **chờ** đúng hai đoạn đó. Viết thân bài nói chuyện khác là mất điểm **Coherence and Cohesion** (tính mạch lạc và liên kết) và **Task Response** (trả lời đúng yêu cầu đề).",
    },
    {
      t: "table",
      caption: "Bài Opinion 4 đoạn — ôn lại và đi sâu vào phần giữa",
      head: ["Đoạn", "Số câu", "Số từ gợi ý", "Nội dung"],
      rows: [
        ["Mở bài (Introduction)", "2", "40–50", "Paraphrase đề + thesis (quan điểm + **lý do 1** + **lý do 2**) — Ngày 6"],
        ["**Thân bài 1 (Body 1)**", "4–6", "**90–110**", "Câu chủ đề = **lý do 1** → giải thích → ví dụ (→ kết đoạn)"],
        ["**Thân bài 2 (Body 2)**", "4–6", "**90–110**", "Câu chủ đề = **lý do 2** → giải thích → ví dụ (→ kết đoạn)"],
        ["Kết bài (Conclusion)", "2", "40–60", "Nhắc lại quan điểm + 2 lý do bằng từ khác, **không đưa ý mới**"],
      ],
    },
    {
      t: "note",
      title: "Ghi nhớ",
      items: [
        "Thân bài chiếm **khoảng 2/3 bài** (200/280 từ). Đây là nơi giám khảo thấy bạn **phát triển ý** — tiêu chí Task Response band 6 yêu cầu ý chính được **mở rộng và có ví dụ hỗ trợ**, không chỉ liệt kê.",
        "Mỗi đoạn **một ý chính**. Hai ý trong một đoạn = cả hai đều nông. Muốn thêm ý thứ ba thì gộp nó làm **ví dụ / giải thích** cho một trong hai ý, đừng nhét thêm đoạn.",
        "Viết đoạn văn liền, **xuống dòng giữa các đoạn** (bỏ trống một dòng). Không gạch đầu dòng, không đánh số 1, 2, 3 trong bài thi.",
      ],
    },

    { t: "h", text: "2. Cấu trúc một đoạn thân bài" },
    {
      t: "sodo",
      kind: "flow",
      title: "Đoạn thân bài 4 bước (~100 từ)",
      caption: "Ba bước đầu là **bắt buộc**; bước 4 dùng khi còn thời gian. Mỗi bước trả lời một câu hỏi của người đọc.",
      steps: [
        { label: "**Topic sentence** — câu chủ đề", sub: "Ý chính là gì? (1 câu, nhắc đúng lý do trong thesis)" },
        { label: "**Explanation** — giải thích", sub: "Vì sao / như thế nào / dẫn tới gì? (1–2 câu)" },
        { label: "**Example** — ví dụ", sub: "Cụ thể ra sao? Ai, ở đâu, bao nhiêu? (1–2 câu)" },
        { label: "**Link** — kết đoạn (tuỳ chọn)", sub: "Vậy nên… → nối về quan điểm (1 câu)" },
      ],
    },
    {
      t: "table",
      head: ["Phần", "Làm gì", "Khung câu hay dùng"],
      rows: [
        ["**Topic sentence**", "Nêu **một** lý do — đúng lý do đã hứa trong thesis, nhưng viết bằng từ **khác** một chút.", "Firstly, … · The first reason why… is that… · One major advantage of… is that… · Secondly, … · Another reason is that…"],
        ["**Explanation**", "Trả lời câu hỏi **“Tại sao lại thế?”** hoặc **“Điều đó dẫn tới gì?”**", "This is because… · This means that… · As a result, … · In other words, … · Without…, …"],
        ["**Example**", "Đưa **một trường hợp cụ thể**: người thật (bạn, người thân), nơi thật (thành phố, trường), tình huống giả định (If…).", "For example, … · For instance, … · …, such as… · A good example of this is… · If…, …"],
        ["**Link** (tuỳ chọn)", "Nói gọn hệ quả của ví dụ, **nối về quan điểm** của bạn.", "Therefore, … · As a result, … · This shows that… · That is why I believe…"],
      ],
    },
    {
      t: "rule",
      formula: "Đoạn thân bài = Firstly / Secondly, + S + V (ý chính). → This is because / This means that + S + V. → For example, + S + V (cụ thể). → (As a result, + S + V.)",
      vi: "Topic → Explain → Example → (Link). Mỗi đoạn MỘT ý, khoảng 90–110 từ.",
    },

    { t: "h", text: "3. Câu chủ đề (topic sentence)" },
    {
      t: "p",
      text: "**Topic sentence** là câu **đầu tiên** của đoạn, cho người đọc biết cả đoạn sẽ chứng minh điều gì. Một câu chủ đề tốt có 3 đặc điểm: (1) mở bằng **từ nối thứ tự** (Firstly / Secondly…), (2) nói **đúng một ý**, (3) ý đó **khớp** với một lý do trong thesis nhưng **viết lại bằng từ khác** chứ không chép y nguyên.",
    },
    {
      t: "patterns",
      rows: [
        {
          formula: "Firstly, / Secondly, + S + V + (ý chính).",
          vi: "Đơn giản, an toàn nhất cho band 4.5–5.5.",
          examples: [
            { en: "Firstly, working from home saves employees a considerable amount of time.", vi: "Thứ nhất, làm việc tại nhà giúp nhân viên tiết kiệm một lượng thời gian đáng kể." },
          ],
        },
        {
          formula: "The first / main reason why + S + V + is that + S + V.",
          vi: "Dài hơn, có mệnh đề — nâng điểm ngữ pháp.",
          examples: [
            { en: "The main reason why I support this view is that hobbies help students reduce stress.", vi: "Lý do chính khiến tôi ủng hộ quan điểm này là sở thích giúp học sinh giảm căng thẳng." },
          ],
        },
        {
          formula: "One major advantage / disadvantage of + N / V-ing + is that + S + V.",
          vi: "Hợp với đề nói về lợi ích – bất lợi.",
          examples: [
            { en: "One major advantage of online learning is that students can learn at their own pace.", vi: "Một lợi ích lớn của học trực tuyến là sinh viên có thể học theo tốc độ của riêng mình." },
          ],
        },
        {
          formula: "Another reason is that + S + V. · In addition, + S + V.",
          vi: "Mở đoạn thân bài 2 (thay cho Secondly).",
          examples: [
            { en: "Another reason is that many people find it easier to concentrate at home.", vi: "Một lý do khác là nhiều người thấy tập trung ở nhà dễ hơn." },
          ],
        },
      ],
    },
    {
      t: "table",
      caption: "Thesis: “I largely agree because working from home saves commuting time and allows people to concentrate better.”",
      head: ["Câu chủ đề cho Body 1", "Đánh giá", "Vì sao"],
      rows: [
        ["~~Working from home has many advantages.~~", "❌ Quá chung", "Không nói **lợi ích nào** — đoạn này rồi sẽ liệt kê lung tung."],
        ["~~Firstly, working from home saves time and money and it is good for the environment.~~", "❌ Ba ý một câu", "Thời gian, tiền, môi trường = **ba đoạn**. Thesis chỉ hứa **thời gian**."],
        ["~~Firstly, working from home helps people sleep more.~~", "❌ Không khớp thesis", "Thesis nói **commuting time**; ngủ nhiều hơn chỉ có thể là **ví dụ** của lợi ích đó, không phải ý chính mới."],
        ["**Firstly, working from home saves employees a considerable amount of time.**", "✅ Tốt", "Một ý, khớp lý do 1, đổi từ: **saves commuting time** → **saves… a considerable amount of time**."],
      ],
    },
    {
      t: "note",
      title: "Người Việt hay sai ở câu chủ đề",
      items: [
        "Viết câu chủ đề **chung chung** (“There are many benefits.”) rồi mới tới ý thật ở câu 3–4. Giám khảo đọc câu đầu đoạn để **tìm ý chính** — hãy đặt ý chính **ngay câu đầu**.",
        "Dùng ~~First of all, firstly…~~ hoặc ~~Firstly, first,…~~ — chỉ cần **một** từ: **Firstly,** hoặc **First of all,** hoặc **To begin with,**.",
        "Viết ~~Firstly, because working from home saves time.~~ — **because** đứng đầu câu thì vế đó **chưa thành câu** (câu què). Bỏ because: **Firstly, working from home saves time.**",
        "**Secondly** → không dùng ~~Second of all~~ trong bài viết học thuật (văn nói Mỹ). Dùng **Secondly, / Another reason is that…**.",
      ],
    },
    {
      t: "rule",
      formula: "Firstly / Secondly, + S + V (MỘT ý = một lý do của thesis, viết lại bằng từ khác).",
      vi: "Câu đầu đoạn phải chứa ý chính; không “because” đứng một mình, không gộp nhiều ý.",
    },
    {
      t: "quiz",
      id: "d8-chu-de-dich",
      title: "Dịch sang tiếng Anh — câu chủ đề (4 câu)",
      kind: "translate",
      grammar: "Firstly, / Secondly, + S + V. · The first reason why + S + V + is that + S + V. · One major advantage of + N/V-ing + is that + S + V. Chủ ngữ là V-ing (working from home) hoặc danh từ số ít → động từ thêm -s.",
      items: [
        { q: "Thứ nhất, làm việc tại nhà giúp nhân viên tiết kiệm rất nhiều thời gian.", hint: "Firstly, working from home, saves employees, a lot of time", answers: ["Firstly, working from home saves employees a lot of time.", "Firstly, working from home saves employees a great deal of time.", "Firstly, working from home saves employees lots of time.", "Firstly, working from home helps employees save a lot of time.", "Firstly, working from home helps employees to save a lot of time.", "First, working from home saves employees a lot of time.", "Firstly working from home saves employees a lot of time.", "Firstly, working at home saves employees a lot of time.", "Firstly, working from home saves employees a considerable amount of time."] },
        { q: "Lý do đầu tiên khiến tôi ủng hộ quan điểm này là sở thích giúp học sinh giảm căng thẳng.", hint: "The first reason why I support this view, is that, hobbies help students, reduce stress", answers: ["The first reason why I support this view is that hobbies help students reduce stress.", "The first reason why I support this view is that hobbies help students to reduce stress.", "The first reason I support this view is that hobbies help students reduce stress.", "The first reason I support this view is that hobbies help students to reduce stress.", "The first reason why I support this opinion is that hobbies help students reduce stress.", "The first reason why I support this idea is that hobbies help students reduce stress.", "The first reason why I support this view is that hobbies help students reduce their stress."] },
        { q: "Một lợi ích lớn của học trực tuyến là sinh viên có thể học theo tốc độ của riêng mình.", hint: "One major advantage of, online learning, is that, students can learn, at their own pace", answers: ["One major advantage of online learning is that students can learn at their own pace.", "One major advantage of online learning is that students can study at their own pace.", "One big advantage of online learning is that students can learn at their own pace.", "A major advantage of online learning is that students can learn at their own pace.", "One major benefit of online learning is that students can learn at their own pace.", "One major advantage of studying online is that students can learn at their own pace.", "One major advantage of online learning is that students can learn at their own speed."] },
        { q: "Thứ hai, công viên cho mọi người một nơi miễn phí để tập thể dục.", hint: "Secondly, parks, give / provide, people, a free place, to exercise", answers: ["Secondly, parks give people a free place to exercise.", "Secondly, parks provide people with a free place to exercise.", "Secondly, parks provide a free place for people to exercise.", "Secondly, parks give people a free place to do exercise.", "Secondly parks give people a free place to exercise.", "Secondly, parks offer people a free place to exercise.", "Second, parks give people a free place to exercise."] },
      ],
    },

    { t: "h", text: "4. Câu giải thích (explanation)" },
    {
      t: "p",
      text: "Câu chủ đề mới chỉ là **lời khẳng định**. Câu giải thích cho người đọc biết **vì sao** điều đó đúng hoặc **nó dẫn tới gì**. Mẹo đơn giản nhất: sau câu chủ đề, tự hỏi **“Tại sao?”** — câu trả lời là câu giải thích 1. Hỏi tiếp **“Thì sao?”** (so what?) — câu trả lời là câu giải thích 2 hoặc câu kết đoạn.",
    },
    {
      t: "table",
      caption: "Kỹ thuật “hỏi 2 lần” — từ một ý thành 3 câu",
      head: ["Câu", "Câu hỏi tự đặt", "Câu viết ra"],
      rows: [
        ["Topic", "—", "Firstly, working from home saves employees a considerable amount of time."],
        ["Giải thích 1", "**Tại sao** tiết kiệm thời gian?", "**This is because** they no longer have to travel to and from the workplace every day."],
        ["Giải thích 2", "**Thì sao?** Tiết kiệm được bao nhiêu?", "In large cities, a single journey can take over an hour during rush hour, **so** office workers may lose ten hours or more every week on the road."],
      ],
    },
    {
      t: "table",
      head: ["Từ nối", "Nghĩa", "Dùng khi", "Ví dụ"],
      rows: [
        ["**This is because** + S + V", "Điều này là vì", "Giải thích **nguyên nhân** của câu trước", "This is because they do not have to commute."],
        ["**This means that** + S + V", "Điều này có nghĩa là", "Nói **hệ quả / ý nghĩa** của câu trước", "This means that they have more time for their families."],
        ["**As a result,** + S + V", "Kết quả là", "Nói **kết quả** (thường đứng sau một câu nêu nguyên nhân)", "As a result, they feel less tired."],
        ["**In other words,** + S + V", "Nói cách khác", "Nói lại ý khó **bằng lời dễ hiểu hơn**", "In other words, hobbies help us recharge."],
        ["**so** + S + V (giữa câu)", "nên", "Nối nguyên nhân → kết quả **trong cùng một câu**", "The roads are crowded, so the journey takes longer."],
      ],
    },
    {
      t: "note",
      title: "Người Việt hay sai với từ nối giải thích",
      items: [
        "~~Because they don't have to commute.~~ đứng một mình là **câu què** (fragment). Viết **This is because they don't have to commute.** hoặc nối vào câu trước bằng dấu phẩy: “…time, because they…”.",
        "~~This is because of they don't have to commute.~~ → **because of + danh từ** (because of the traffic), **because + S + V** (because they don't have to commute).",
        "~~As a result of, they feel less tired.~~ → **As a result,** + câu. (**as a result of + danh từ**: as a result of the long journey).",
        "Dùng **so** ở đầu câu (~~So, they are happy.~~) nghe như văn nói. Trong bài viết đặt **so** giữa câu hoặc thay bằng **As a result, / Therefore,**.",
        "Giải thích **lặp lại** câu chủ đề bằng từ khác (“Working from home saves time. In other words, people save time.”) là không thêm gì. Giải thích phải trả lời **tại sao / dẫn tới gì**.",
      ],
    },
    {
      t: "rule",
      formula: "This is because + S + V. · This means that + S + V. · As a result, + S + V. · In other words, + S + V.",
      vi: "because + mệnh đề / because of + danh từ. Tự hỏi “Tại sao?” rồi “Thì sao?” để có 2 câu giải thích.",
    },
    {
      t: "quiz",
      id: "d8-giai-thich-dich",
      title: "Dịch sang tiếng Anh — câu giải thích (4 câu)",
      kind: "translate",
      grammar: "This is because + S + V. · This means that + S + V. · As a result, + S + V. · In other words, + S + V. Phủ định hiện tại đơn: S + do not / don't + have to + V.",
      items: [
        { q: "Điều này là vì họ không phải đi lại mỗi ngày.", hint: "This is because, they, do not have to, commute / travel to work, every day", answers: ["This is because they do not have to commute every day.", "This is because they don't have to commute every day.", "This is because they do not have to travel to work every day.", "This is because they don't have to travel to work every day.", "This is because they do not need to commute every day.", "This is because they don't need to commute every day.", "This is because they no longer have to commute every day."] },
        { q: "Điều này có nghĩa là họ có nhiều thời gian hơn cho gia đình.", hint: "This means that, they have, more time, for their families", answers: ["This means that they have more time for their families.", "This means they have more time for their families.", "This means that they have more time for their family.", "This means they have more time for their family.", "This means that they can spend more time with their families.", "This means that they can spend more time with their family."] },
        { q: "Kết quả là, họ cảm thấy ít mệt mỏi hơn.", hint: "As a result, they feel, less tired", answers: ["As a result, they feel less tired.", "As a result they feel less tired.", "As a result, they feel less exhausted.", "As a result, they are less tired."] },
        { q: "Nói cách khác, sở thích giúp chúng ta nạp lại năng lượng.", hint: "In other words, hobbies help us, recharge", answers: ["In other words, hobbies help us recharge.", "In other words, hobbies help us to recharge.", "In other words hobbies help us recharge.", "In other words, hobbies help us recharge our batteries.", "In other words, hobbies help us recharge our energy.", "In other words, hobbies help us get our energy back."] },
      ],
    },

    { t: "h", text: "5. Ví dụ (example)" },
    {
      t: "p",
      text: "Ví dụ là phần biến một ý **trừu tượng** thành thứ người đọc **nhìn thấy được**. Bạn không cần số liệu nghiên cứu: giám khảo không chấm “đúng sự thật”, mà chấm ví dụ có **cụ thể** và **liên quan** tới ý chính không. Có 3 loại ví dụ dễ viết:",
    },
    {
      t: "table",
      head: ["Loại ví dụ", "Lấy từ đâu", "Câu mẫu"],
      rows: [
        ["**Cá nhân** (personal)", "Bạn, người thân, bạn học, đồng nghiệp — có tên, có nơi chốn.", "**For example,** my cousin, who works for a bank in Ho Chi Minh City, now spends the ninety minutes he once lost in traffic exercising."],
        ["**Chung / xã hội** (general)", "Một nhóm người, một nghề, một thành phố, một quốc gia ai cũng biết.", "**A good example of this is** software developers, who need long periods of deep focus to write and test code."],
        ["**Giả định** (hypothetical)", "Một tình huống “nếu… thì…” hợp lý.", "**If** they are interrupted every few minutes, a task that should take two hours can easily take a whole day."],
      ],
    },
    {
      t: "patterns",
      rows: [
        {
          formula: "For example, / For instance, + S + V.",
          vi: "Ví dụ là cả một câu — đứng đầu câu, có dấu phẩy.",
          examples: [
            { en: "For example, my cousin cycles to work every day.", vi: "Ví dụ, anh họ tôi đạp xe đi làm mỗi ngày." },
          ],
        },
        {
          formula: "N (số nhiều / chung), such as + N1, N2 and N3, + V…",
          vi: "Ví dụ là vài danh từ chen trong câu (KHÔNG có dấu phẩy sau such as).",
          examples: [
            { en: "Team sports such as football and basketball teach children how to cooperate.", vi: "Các môn thể thao đồng đội như bóng đá và bóng rổ dạy trẻ cách hợp tác." },
          ],
        },
        {
          formula: "A good example of this is + N (, where / who + S + V).",
          vi: "Giới thiệu một trường hợp tiêu biểu (thành phố, nghề, công ty…).",
          examples: [
            { en: "A good example of this is Singapore, where many buildings have green roofs.", vi: "Một ví dụ điển hình là Singapore, nơi nhiều toà nhà có mái xanh." },
          ],
        },
        {
          formula: "If + S + V (hiện tại), S + will / can + V.",
          vi: "Ví dụ giả định — câu điều kiện loại 1 (sẽ học kỹ sau).",
          examples: [
            { en: "If students have no time to rest, they will quickly become exhausted.", vi: "Nếu học sinh không có thời gian nghỉ ngơi, các em sẽ nhanh chóng kiệt sức." },
          ],
        },
      ],
    },
    {
      t: "note",
      title: "Cẩn thận khi đưa ví dụ",
      items: [
        "**Không bịa số liệu nghiên cứu**: ~~A study from Harvard shows that 90% of workers are happier at home.~~ Giám khảo nhận ra ngay; câu bịa không thêm điểm mà còn làm bài kém tin cậy. Dùng ví dụ **đời thường, thật** (người thân, thành phố bạn sống) hoặc **giả định** (If…).",
        "**Ví dụ phải chứng minh đúng câu chủ đề**: đoạn nói về **tiết kiệm thời gian** thì ví dụ phải cho thấy **thời gian được tiết kiệm và dùng vào việc khác**, không kể chuyện sếp hiền hay lương cao.",
        "**Ví dụ không quá dài**: 1–2 câu là đủ. Kể cả một câu chuyện 5 câu sẽ lấy chỗ của phần giải thích và làm đoạn mất cân bằng.",
        "~~For example: …~~ (dấu hai chấm) → **For example, …** (dấu phẩy). ~~such as, football~~ → **such as football** (không phẩy sau such as). ~~For example like…~~ → chọn **một**: For example **hoặc** like.",
        "**e.g.** chỉ dùng trong ghi chú, ngoặc đơn. Trong câu văn IELTS viết đầy đủ **for example**.",
      ],
    },
    {
      t: "rule",
      formula: "For example, / For instance, + S + V. · N such as N1 and N2 · A good example of this is + N. · If + S + V, S + will + V.",
      vi: "Ví dụ: cụ thể (ai, ở đâu, bao nhiêu), thật hoặc giả định, 1–2 câu, chứng minh đúng câu chủ đề.",
    },
    {
      t: "quiz",
      id: "d8-vi-du-dich",
      title: "Dịch sang tiếng Anh — câu ví dụ (4 câu)",
      kind: "translate",
      grammar: "For example, + S + V. · N such as N1 and N2 + V. · A good example of this is + N, where + S + V. · If + S + V (hiện tại đơn), S + will + V.",
      items: [
        { q: "Ví dụ, anh họ tôi đạp xe đi làm mỗi ngày.", hint: "For example, my cousin, cycles to work / rides his bike to work, every day", answers: ["For example, my cousin cycles to work every day.", "For instance, my cousin cycles to work every day.", "For example my cousin cycles to work every day.", "For example, my cousin rides his bike to work every day.", "For example, my cousin rides a bike to work every day.", "For example, my cousin goes to work by bike every day.", "For example, my cousin goes to work by bicycle every day.", "For instance, my cousin rides his bike to work every day."] },
        { q: "Các môn thể thao đồng đội như bóng đá và bóng rổ dạy trẻ em cách hợp tác.", hint: "team sports, such as, football and basketball, teach children, how to cooperate", answers: ["Team sports such as football and basketball teach children how to cooperate.", "Team sports such as football and basketball teach children to cooperate.", "Team sports such as football and basketball teach children how to work together.", "Team sports such as football and basketball teach children to work together.", "Team sports like football and basketball teach children how to cooperate.", "Team sports like football and basketball teach children to cooperate.", "Team sports such as soccer and basketball teach children how to cooperate."] },
        { q: "Một ví dụ điển hình là Singapore, nơi nhiều toà nhà có mái xanh.", hint: "A good example of this is, Singapore, where, many buildings have green roofs", answers: ["A good example of this is Singapore, where many buildings have green roofs.", "A good example is Singapore, where many buildings have green roofs.", "A typical example of this is Singapore, where many buildings have green roofs.", "A good example of this is Singapore, where a lot of buildings have green roofs.", "A clear example of this is Singapore, where many buildings have green roofs."] },
        { q: "Nếu học sinh không có thời gian nghỉ ngơi, các em sẽ nhanh chóng kiệt sức.", hint: "If students have no time to rest / do not have time to rest, they will, quickly become exhausted / burn out", answers: ["If students have no time to rest, they will quickly become exhausted.", "If students do not have time to rest, they will quickly become exhausted.", "If students don't have time to rest, they will quickly become exhausted.", "If students have no time to rest, they will soon become exhausted.", "If students have no time to rest, they will quickly burn out.", "If students don't have time to rest, they will quickly burn out.", "If students do not have time to rest, they will quickly burn out.", "If students have no time to rest, they will become exhausted quickly.", "If students have no time to rest they will quickly become exhausted."] },
      ],
    },

    { t: "h", text: "6. Bài mẫu trọn vẹn và phân tích" },
    {
      t: "p",
      text: "**Đề:** Some people think that working from home is better for employees than working in an office. To what extent do you agree or disagree? — **Một số người cho rằng làm việc tại nhà tốt cho nhân viên hơn làm việc ở văn phòng. Bạn đồng ý hay không đồng ý đến mức độ nào?** (Đề dùng lại từ vựng Ngày 5 và Ngày 7 về làm việc từ xa.)",
    },
    {
      t: "sodo",
      kind: "mindmap",
      title: "Bước lên ý (2–3 phút trước khi viết)",
      caption: "Viết nhanh mọi ý của **cả hai phía**, rồi chọn **hai nhánh** bạn có ví dụ rõ nhất làm hai thân bài. Ý của phía kia dùng làm **câu nhượng bộ** ở kết bài (although…).",
      center: "Làm việc tại nhà tốt hơn cho nhân viên?",
      branches: [
        { label: "✔ Thời gian", items: ["không phải đi lại (commute)", "tắc đường giờ cao điểm", "**ví dụ:** anh họ ở TP.HCM"], anh: "alarm-clock" },
        { label: "✔ Tập trung", items: ["văn phòng mở ồn ào", "tắt thông báo, góc yên tĩnh", "**ví dụ:** lập trình viên"], anh: "laptop" },
        { label: "✔ Tiền bạc", items: ["tiết kiệm xăng, ăn trưa", "(ít ví dụ hơn → không chọn)"] },
        { label: "✘ Cô đơn", items: ["ít gặp đồng nghiệp", "→ dùng cho câu nhượng bộ"] },
        { label: "✘ Khó làm nhóm", items: ["họp trực tiếp hiệu quả hơn", "→ although… ở kết bài"] },
      ],
    },
    {
      t: "examples",
      items: [
        { en: "[Introduction] Some people argue that employees benefit more from doing their jobs at home than from going to an office every day. I largely agree with this view because working from home saves a great deal of commuting time and allows people to concentrate better on their tasks.", vi: "[Mở bài] Một số người lập luận rằng nhân viên được lợi nhiều hơn khi làm việc ở nhà so với đến văn phòng mỗi ngày. Tôi phần lớn đồng ý với quan điểm này vì làm việc tại nhà tiết kiệm rất nhiều thời gian đi lại và giúp mọi người tập trung vào công việc tốt hơn." },
        { en: "[Body 1] Firstly, working from home saves employees a considerable amount of time. This is because they no longer have to travel to and from the workplace every day. In large cities, a single journey can take over an hour during rush hour, so office workers may lose ten hours or more every week on the road. For example, my cousin, who works for a bank in Ho Chi Minh City, now spends the ninety minutes he once lost in traffic exercising and having breakfast with his children. As a result, he starts work feeling relaxed and full of energy.", vi: "[Thân bài 1] Thứ nhất, làm việc tại nhà giúp nhân viên tiết kiệm một lượng thời gian đáng kể. Điều này là vì họ không còn phải đi lại giữa nhà và nơi làm việc mỗi ngày. Ở các thành phố lớn, một lượt đi có thể mất hơn một tiếng vào giờ cao điểm, nên nhân viên văn phòng có thể mất từ mười tiếng trở lên mỗi tuần trên đường. Ví dụ, anh họ tôi, làm cho một ngân hàng ở TP. Hồ Chí Minh, giờ dùng chín mươi phút trước kia mất vào kẹt xe để tập thể dục và ăn sáng cùng các con. Nhờ vậy, anh ấy bắt đầu làm việc với tâm trạng thoải mái và tràn đầy năng lượng." },
        { en: "[Body 2] Secondly, many people find it easier to concentrate at home. In an open-plan office, there are constant interruptions, such as phone calls, loud conversations and colleagues who stop by to chat. At home, by contrast, employees can choose a quiet corner and turn off notifications while they deal with difficult tasks. This means that they often complete their work faster and make fewer mistakes. A good example of this is software developers, who need long periods of deep focus to write and test code. If they are interrupted every few minutes, a task that should take two hours can easily take a whole day.", vi: "[Thân bài 2] Thứ hai, nhiều người thấy tập trung ở nhà dễ hơn. Ở văn phòng không vách ngăn, sự gián đoạn diễn ra liên tục, chẳng hạn điện thoại, những cuộc nói chuyện ồn ào và đồng nghiệp ghé qua tán gẫu. Trái lại, ở nhà nhân viên có thể chọn một góc yên tĩnh và tắt thông báo khi xử lý việc khó. Điều này có nghĩa là họ thường hoàn thành công việc nhanh hơn và ít mắc lỗi hơn. Một ví dụ điển hình là lập trình viên — những người cần những khoảng thời gian tập trung sâu dài để viết và kiểm thử mã. Nếu cứ vài phút họ lại bị ngắt quãng, một việc lẽ ra mất hai tiếng có thể dễ dàng kéo dài cả ngày." },
        { en: "[Conclusion] In conclusion, although working in an office has some advantages, such as face-to-face teamwork, I believe that working from home is generally better for employees. It gives them back valuable time and provides a calmer environment in which to work, so more companies should allow their staff to work remotely for at least part of the week.", vi: "[Kết bài] Tóm lại, dù làm việc ở văn phòng có một số lợi thế như làm việc nhóm trực tiếp, tôi tin rằng làm việc tại nhà nhìn chung tốt hơn cho nhân viên. Nó trả lại cho họ thời gian quý báu và mang đến một môi trường yên tĩnh hơn để làm việc, vì vậy nhiều công ty nên cho nhân viên làm việc từ xa ít nhất một phần trong tuần." },
      ],
    },
    {
      t: "note",
      title: "Số từ (đã đếm)",
      items: [
        "Mở bài **47** từ · Thân bài 1 **98** từ · Thân bài 2 **104** từ · Kết bài **57** từ → cả bài **306 từ** (đề yêu cầu ≥ 250). Hai thân bài chiếm **202/306** — đúng khoảng 2/3 bài.",
        "**I largely agree** = tôi phần lớn đồng ý (đồng ý nhưng thừa nhận phía kia có vài điểm đúng) — hợp với đề **To what extent**, và kết bài đã giữ đúng lời hứa đó bằng câu nhượng bộ **although working in an office has some advantages**.",
      ],
    },
    {
      t: "table",
      caption: "Phân tích Thân bài 1 — mỗi câu làm một việc",
      head: ["Câu", "Vai trò", "Điểm đáng học"],
      rows: [
        ["Firstly, working from home saves employees a considerable amount of time.", "**Topic sentence**", "Một ý, khớp lý do 1 của thesis; đổi **a great deal of commuting time** → **a considerable amount of time** (không lặp từ)."],
        ["This is because they no longer have to travel to and from the workplace every day.", "**Explanation 1** (tại sao?)", "**This is because + S + V**; **no longer** = không còn nữa; **to and from** = đi và về."],
        ["In large cities, a single journey can take over an hour during rush hour, so office workers may lose ten hours or more every week on the road.", "**Explanation 2** (thì sao? bao nhiêu?)", "Câu ghép bằng **so**; số liệu **hợp lý, tự suy ra** (1 tiếng × 2 lượt × 5 ngày), không bịa “nghiên cứu cho thấy”."],
        ["For example, my cousin, who works for a bank in Ho Chi Minh City, now spends the ninety minutes he once lost in traffic exercising and having breakfast with his children.", "**Example** (cá nhân)", "Cụ thể: **ai** (anh họ), **ở đâu** (ngân hàng, TP.HCM), **bao nhiêu** (90 phút), **làm gì** với thời gian đó. Mệnh đề quan hệ **who** (Ngày 3) + **spend time V-ing**."],
        ["As a result, he starts work feeling relaxed and full of energy.", "**Link** (kết đoạn)", "Nói hệ quả → nối về ý “tốt cho nhân viên” của đề."],
      ],
    },
    {
      t: "sodo",
      kind: "compare",
      title: "Cùng một ý — đoạn band 4 và đoạn band 6",
      caption: "Ý giống hệt nhau (tiết kiệm thời gian đi lại). Điểm khác nằm ở **câu chủ đề rõ**, **giải thích có nguyên nhân – kết quả**, **ví dụ cụ thể** và **câu đúng ngữ pháp**.",
      cols: [
        {
          title: "Band 4 (≈ 40 từ)",
          items: [
            "~~Firstly, working at home is very good.~~ — câu chủ đề **chung chung**, không nói tốt ở điểm nào",
            "~~Because people not need go to the office.~~ — **câu què** + sai ngữ pháp (thiếu do not)",
            "~~The traffic is very bad and many people hate it.~~ — có ý nhưng **không nối** về thời gian",
            "~~So working at home is good for them and they very happy. Everyone know that.~~ — **không ví dụ**, thiếu động từ (are), sai chia (knows), câu “ai cũng biết” vô nghĩa",
          ],
        },
        {
          title: "Band 6 (98 từ — Thân bài 1 ở trên)",
          items: [
            "Câu chủ đề nêu **đúng một lợi ích**: **saves… a considerable amount of time**",
            "**This is because…** giải thích nguyên nhân; câu **so…** nói hệ quả bằng con số hợp lý",
            "**For example,** + người cụ thể, nơi cụ thể, số phút cụ thể",
            "**As a result,** kết đoạn; câu đơn, câu ghép, mệnh đề **who** — đa dạng và ít lỗi",
          ],
        },
      ],
    },
    {
      t: "table",
      caption: "Vì sao bài mẫu đạt khoảng band 6 — theo 4 tiêu chí chấm",
      head: ["Tiêu chí", "Bài mẫu làm được gì", "Muốn lên 6.5–7 thì thêm"],
      rows: [
        ["**Task Response** (trả lời đề)", "Quan điểm rõ ngay mở bài (**largely agree**), giữ nguyên tới kết bài; mỗi lý do được **giải thích + ví dụ**.", "Ý sâu hơn: thêm một câu thừa nhận và **phản bác** phía kia ngay trong thân bài (Although some… , …)."],
        ["**Coherence & Cohesion** (mạch lạc, liên kết)", "Mỗi đoạn **một ý**; từ nối đúng chỗ (**Firstly, This is because, For example, As a result, Secondly, by contrast, This means that**).", "Dùng đại từ và từ thay thế để nối ý thay vì từ nối ở đầu mọi câu."],
        ["**Lexical Resource** (từ vựng)", "Từ đúng chủ đề: **commuting, rush hour, open-plan office, interruptions, notifications, work remotely**; tránh lặp “working from home” bằng cách đổi cách nói.", "Thêm collocation ít gặp hơn: **a significant drain on time**, **uninterrupted focus**…"],
        ["**Grammatical Range & Accuracy** (ngữ pháp)", "Câu đơn + câu ghép (**so**) + mệnh đề quan hệ (**who**) + câu điều kiện (**If…**) + nhượng bộ (**although**); gần như không lỗi.", "Thêm câu bị động, mệnh đề rút gọn — sẽ học ở các ngày sau."],
      ],
    },

    { t: "h", text: "7. Luyện tập" },
    {
      t: "mcq",
      id: "d8-viet-chon",
      title: "Chọn đáp án đúng — đoạn thân bài (5 câu)",
      items: [
        {
          q: "Thesis: “I agree because hobbies help students reduce stress and teach them useful skills.” Câu nào là **câu chủ đề tốt nhất** cho Body 1?",
          options: [
            "Hobbies are very important in our life.",
            "Firstly, hobbies help students to relax after long hours of study.",
            "Firstly, hobbies help students relax, make friends and earn money.",
          ],
          correct: 1,
          why: "Câu B nói **đúng một ý** — giảm căng thẳng (relax ↔ reduce stress) — khớp lý do 1 và đổi từ. Câu A quá chung, không nêu lý do nào. Câu C nhồi **ba ý** (relax, make friends, earn money), trong đó hai ý không có trong thesis.",
        },
        {
          q: "Câu nào là câu **giải thích** đúng ngữ pháp sau câu chủ đề “Firstly, public transport reduces traffic jams.”?",
          options: [
            "Because one bus can carry fifty people.",
            "This is because of one bus can carry fifty people.",
            "This is because one bus can carry the same number of people as fifty motorbikes.",
          ],
          correct: 2,
          why: "**This is because + S + V** là câu hoàn chỉnh. Câu A là **câu què** (because đứng một mình). Câu B sai: **because of** chỉ đi với **danh từ**, không đi với mệnh đề “one bus can carry…”.",
        },
        {
          q: "Đoạn nói “Online learning lets students study at their own pace.” Ví dụ nào **phù hợp nhất**?",
          options: [
            "For example, a student who finds maths difficult can replay a recorded lecture three times until she understands it.",
            "For example, a study shows that 95% of students prefer online classes.",
            "For example, online classes are cheaper than traditional ones.",
          ],
          correct: 0,
          why: "Câu A **cụ thể** và chứng minh **đúng ý** “học theo tốc độ riêng” (xem lại nhiều lần). Câu B là **số liệu bịa** không có nguồn. Câu C nói về **chi phí** — một ý khác, không chứng minh câu chủ đề.",
        },
        {
          q: "Chọn câu viết đúng dấu câu:",
          options: [
            "Many hobbies such as, painting and gardening, are cheap.",
            "For example: my brother plays chess every evening.",
            "Many hobbies, such as painting and gardening, are cheap.",
          ],
          correct: 2,
          why: "**such as** không có dấu phẩy ngay sau nó; cả cụm ví dụ “such as painting and gardening” có thể được kẹp giữa hai dấu phẩy. Câu B sai vì **For example** đi với **dấu phẩy**, không dùng dấu hai chấm.",
        },
        {
          q: "Một đoạn thân bài có các phần sau. Thứ tự nào đúng? (1) For example, my aunt grows vegetables on her balcony. (2) Secondly, gardening is a healthy hobby. (3) As a result, her family eats fresh food every day. (4) This is because it keeps people active and gives them fresh food.",
          options: ["2 – 4 – 1 – 3", "2 – 1 – 4 – 3", "4 – 2 – 1 – 3"],
          correct: 0,
          why: "Topic (**Secondly…**, câu 2) → Explanation (**This is because…**, câu 4) → Example (**For example…**, câu 1) → Link (**As a result…**, câu 3). Đáp án B đưa ví dụ trước giải thích; đáp án C mở đoạn bằng **This is because** — không có gì phía trước để “this” chỉ tới.",
        },
      ],
    },
    {
      t: "p",
      text: "**Ghép đoạn văn:** bấm các câu theo đúng thứ tự **Topic → Explanation → Example → Link**. Mỗi đoạn có **một câu gây nhiễu** (lạc đề hoặc sai ngữ pháp) — đừng chọn nó.",
    },
    {
      t: "build",
      id: "d8-viet-ghep",
      title: "Ghép thứ tự câu trong đoạn thân bài (3 đoạn)",
      items: [
        {
          vi: "Thứ nhất, sở thích giúp học sinh giảm căng thẳng. Điều này là vì các em có thể quên kỳ thi trong một lúc và tập trung vào việc mình thích. Ví dụ, bạn cùng lớp tôi tên Minh chơi guitar ba mươi phút mỗi tối. Nhờ vậy, bạn ấy ngủ ngon hơn và bình tĩnh hơn trước các bài kiểm tra.",
          chips: ["For example, my classmate Minh plays the guitar for thirty minutes every evening. ", "As a result, he sleeps better and feels calmer before tests.", "Firstly, hobbies help students reduce stress. ", "Hobbies is a waste of money. ", "This is because they can forget about exams for a while and focus on something they enjoy. "],
          answer: ["Firstly, hobbies help students reduce stress. ", "This is because they can forget about exams for a while and focus on something they enjoy. ", "For example, my classmate Minh plays the guitar for thirty minutes every evening. ", "As a result, he sleeps better and feels calmer before tests."],
        },
        {
          vi: "Thứ hai, giao thông công cộng giúp thành phố sạch hơn. Điều này có nghĩa là ít xe máy hơn trên đường và ít khói thải hơn. Ví dụ, từ khi tuyến metro đầu tiên mở ở TP.HCM, nhiều sinh viên đã để xe máy ở nhà.",
          chips: ["This means that there are fewer motorbikes on the roads and less exhaust smoke. ", "Secondly, public transport makes cities cleaner. ", "Because buses is cheap. ", "For example, since the first metro line opened in Ho Chi Minh City, many students have left their motorbikes at home."],
          answer: ["Secondly, public transport makes cities cleaner. ", "This means that there are fewer motorbikes on the roads and less exhaust smoke. ", "For example, since the first metro line opened in Ho Chi Minh City, many students have left their motorbikes at home."],
        },
        {
          vi: "Một lợi ích lớn của việc đọc sách là nó mở rộng vốn từ. Nói cách khác, người đọc học từ mới mà không cần ngồi học thuộc danh sách từ. Ví dụ, một học sinh đọc truyện tiếng Anh mỗi tuần sẽ dần nhận ra các cụm từ như “make a decision”. Vì vậy, bài viết của em ấy tự nhiên hơn.",
          chips: ["In other words, readers learn new words without memorising word lists. ", "Therefore, her writing becomes more natural.", "One major advantage of reading is that it expands vocabulary. ", "For example, a student who reads English stories every week gradually notices phrases such as “make a decision”. ", "For example: reading is boring. "],
          answer: ["One major advantage of reading is that it expands vocabulary. ", "In other words, readers learn new words without memorising word lists. ", "For example, a student who reads English stories every week gradually notices phrases such as “make a decision”. ", "Therefore, her writing becomes more natural."],
        },
      ],
    },
    {
      t: "quiz",
      id: "d8-viet-noi",
      title: "Điền từ nối vào đoạn thân bài (8 chỗ trống)",
      kind: "fill",
      items: [
        { q: "___, cycling to school is good for students' health. (Thứ nhất)", answers: ["Firstly", "First", "First of all", "To begin with"], hint: "mở thân bài 1" },
        { q: "This is ___ it gives them about thirty minutes of exercise every day. (vì — trước một mệnh đề S + V)", answers: ["because"] },
        { q: "___ example, my younger brother rides his bike four kilometres to school. (Ví dụ)", answers: ["For"] },
        { q: "As a ___, he rarely gets ill and he sleeps well at night. (Kết quả là)", answers: ["result"] },
        { q: "___, cycling saves families money. (Thứ hai)", answers: ["Secondly", "Second"], hint: "mở thân bài 2" },
        { q: "This ___ that parents do not have to pay for petrol or bus tickets. (Điều này có nghĩa là)", answers: ["means"] },
        { q: "In other ___, a bicycle is a cheap way to travel. (Nói cách khác)", answers: ["words"] },
        { q: "Cheap activities ___ as walking and cycling are popular with students. (như — đưa ví dụ là danh từ)", answers: ["such"] },
      ],
    },
    {
      t: "note",
      title: "Soát đáp án bài điền từ nối",
      items: [
        "(1) **Firstly** (hoặc First / First of all / To begin with) + dấu phẩy. (5) **Secondly** — không dùng ~~Second of all~~ trong bài viết học thuật.",
        "(2) **because** + S + V (it gives…) — không phải ~~because of~~ vì phía sau là mệnh đề.",
        "(3) **For example,** · (4) **As a result,** · (6) **This means that** · (7) **In other words,** — bốn cụm cố định, học thuộc nguyên cụm.",
        "(8) **such as** + danh từ / V-ing (walking, cycling), không có dấu phẩy ngay sau **such as**.",
      ],
    },

    { t: "h", text: "8. Tự viết" },
    {
      t: "essay",
      id: "d8-viet-bai",
      task: "Task 2",
      prompt: "Some people think that students should spend all of their free time studying because hobbies are a waste of time. To what extent do you agree or disagree? Give reasons for your answer and include any relevant examples from your own knowledge or experience. Write at least 250 words.",
      minWords: 250,
      tips: [
        "Lên ý 2–3 phút theo kiểu sơ đồ tư duy ở mục 6: viết ý cho **cả hai phía**, chọn **hai lý do** có ví dụ rõ nhất.",
        "Mở bài (Ngày 6): paraphrase — spend all of their free time studying → **devote every spare moment to their studies**; a waste of time → **pointless / unproductive** — rồi thesis có **2 lý do**.",
        "Mỗi thân bài 90–110 từ: **Firstly / Secondly,** + một ý → **This is because / This means that** → **For example,** (người thật hoặc If…) → **As a result,** (tuỳ chọn).",
        "Gợi ý ý phản đối đề: sở thích **giảm căng thẳng** (reduce stress, recharge) · sở thích **dạy kỹ năng** (teamwork khi chơi thể thao, kiên nhẫn khi vẽ, lập trình…).",
        "Kết bài **In conclusion,** + nhắc lại quan điểm và hai lý do bằng từ khác; có thể thêm một câu nhượng bộ **although…**. Không đưa ý mới.",
      ],
    },
  ],
};

/* ─────────────────────────── Speaking ─────────────────────────── */

const D8_SPEAKING: Lesson = {
  id: "d8-noi",
  kind: "speaking",
  title: "Nói: Câu hỏi về sở thích & thời gian rảnh (Part 1 · Hobbies / Free time)",
  goal: "Nhận ra 7 kiểu câu hỏi của chủ đề Hobbies / Free time ở Speaking Part 1, trả lời mỗi kiểu bằng 2–4 câu theo khung riêng với cụm từ tự nhiên (be into, be keen on, unwind, take up…), dùng đúng play / do / go và đọc rõ âm /ŋ/ cuối -ing.",
  minutes: 55,
  blocks: [
    {
      t: "recap",
      title: "Bài này học gì",
      items: [
        "Ngày 4: câu **Yes/No** (Answer → Reason → Example). Ngày 6: câu **Wh-** (trả lời thẳng → chi tiết → lợi ích). Hôm nay: **7 kiểu câu hỏi** của riêng chủ đề **Hobbies / Free time** — chủ đề Part 1 gặp nhiều nhất.",
        "Mỗi kiểu một **khung trả lời**: hoạt động · tần suất · lý do · **so sánh – chọn** (prefer A to B) · **hồi nhỏ** (When I was a child, I…) · **mong muốn** (I'd love to take up…) · **người khác / đất nước** (…is very popular among…).",
        "Cụm diễn đạt sở thích tự nhiên: ==be into · be keen on · be a big fan of · can't get enough of · unwind · take up==.",
        "**play / do / go**: ==play== + môn có bóng/đối thủ · ==do== + môn tập một mình, võ, yoga · ==go== + môn đuôi **-ing** (go swimming).",
        "Phát âm: âm mũi **/ŋ/** cuối **-ing** — không đọc thành “in” hay “inh”.",
      ],
    },

    { t: "h", text: "1. Chủ đề Hobbies / Free time ở Part 1" },
    {
      t: "p",
      text: "Ở **Speaking Part 1** (4–5 phút, câu hỏi về bản thân), giám khảo thường chọn 2–3 chủ đề quen thuộc. **Hobbies** (sở thích) và **Free time** (thời gian rảnh) gần như đề thi nào cũng có, dưới nhiều tên: Leisure time, Weekends, Relaxation, Sports, Music, Reading, Photography… Câu hỏi không khó, nhưng **mỗi kiểu câu hỏi cần một cách trả lời khác nhau**. Trả lời câu nào cũng “I like… because it is fun” là giám khảo thấy ngay vốn diễn đạt hẹp.",
    },
    {
      t: "table",
      caption: "7 kiểu câu hỏi hay gặp của chủ đề",
      head: ["Kiểu", "Câu hỏi mẫu", "Giám khảo muốn nghe"],
      rows: [
        ["(a) **Hoạt động**", "What do you usually do in your free time?", "**Một–hai hoạt động** cụ thể + chi tiết"],
        ["(b) **Tần suất**", "How often do you play sports? / How much free time do you have?", "**Mức độ thường xuyên** (twice a week…) + khi nào"],
        ["(c) **Lý do**", "Why do you enjoy reading?", "**Một lý do chính** được giải thích, không chỉ “it's fun”"],
        ["(d) **Lựa chọn**", "Do you prefer indoor or outdoor activities?", "**Chọn một bên** + vì sao (có thể nhắc bên kia)"],
        ["(e) **Quá khứ**", "Did you have any hobbies when you were a child?", "Kể bằng **quá khứ đơn** (Ngày 9 học kỹ) + so với bây giờ"],
        ["(f) **Tương lai / mong muốn**", "Is there a new hobby you would like to try?", "**Muốn thử gì** + vì sao (I'd love to…)"],
        ["(g) **Người khác / đất nước**", "What hobbies are popular in your country?", "**Nói chung về người khác** (people / young people…) + lý do"],
      ],
    },
    {
      t: "note",
      title: "Ghi nhớ",
      items: [
        "**free time** = **spare time** = **leisure time**: thời gian rảnh. Không đếm được → **in my free time** (không có ~~a~~), **I don't have much free time** (much, không phải ~~many~~ — ôn Ngày 5).",
        "Đổi **thì** theo câu hỏi: câu hỏi **do you…** → trả lời hiện tại đơn; **did you…** → quá khứ đơn; **would you like…** → **I'd like / I'd love to + V**. Nghe sai thì → trả lời sai thì là lỗi rất dễ thấy.",
        "Độ dài: **2–4 câu, khoảng 15–25 giây** mỗi câu hỏi. Part 1 không cần dài hơn — giám khảo còn nhiều câu phải hỏi.",
      ],
    },

    { t: "h", text: "2. Gọi tên các hoạt động" },
    {
      t: "p",
      text: "Bấm vào từng thẻ để nghe. Để ý: tên hoạt động trong tiếng Anh thường là **V-ing** (reading, cooking) hoặc **động từ + danh từ** (playing chess, going fishing). Bấm “Che nghĩa” rồi nhìn hình tự nói tên hoạt động.",
    },
    {
      t: "hinh",
      title: "Nhìn hình — nói tên sở thích",
      items: [
        { anh: "guitar", w: "playing the guitar", ro: "/ˈpleɪɪŋ ðə ɡɪˈtɑː(r)/", vi: "chơi đàn guitar" },
        { anh: "artist-palette", w: "painting", ro: "/ˈpeɪntɪŋ/", vi: "vẽ tranh (tô màu)" },
        { anh: "chess-pawn", w: "playing chess", ro: "/ˈpleɪɪŋ tʃes/", vi: "chơi cờ vua" },
        { anh: "camera", w: "photography", ro: "/fəˈtɒɡrəfi/", vi: "nhiếp ảnh, chụp ảnh" },
        { anh: "books", w: "reading", ro: "/ˈriːdɪŋ/", vi: "đọc sách" },
        { anh: "badminton", w: "playing badminton", ro: "/ˈpleɪɪŋ ˈbædmɪntən/", vi: "chơi cầu lông" },
        { anh: "cooking", w: "cooking", ro: "/ˈkʊkɪŋ/", vi: "nấu ăn" },
        { anh: "video-game", w: "playing video games", ro: "/ˈpleɪɪŋ ˈvɪdiəʊ ɡeɪmz/", vi: "chơi điện tử" },
        { anh: "fishing-pole", w: "going fishing", ro: "/ˈɡəʊɪŋ ˈfɪʃɪŋ/", vi: "đi câu cá" },
        { anh: "hiking-boot", w: "going hiking", ro: "/ˈɡəʊɪŋ ˈhaɪkɪŋ/", vi: "đi bộ đường dài, leo núi" },
        { anh: "yarn", w: "knitting", ro: "/ˈnɪtɪŋ/", vi: "đan len" },
        { anh: "potted-plant", w: "gardening", ro: "/ˈɡɑːdnɪŋ/", vi: "làm vườn, trồng cây" },
      ],
    },
    {
      t: "sodo",
      kind: "compare",
      title: "play · do · go + môn thể thao / hoạt động",
      caption: "Mẹo nhanh: có **bóng hoặc đối thủ** → **play**; môn **đuôi -ing** di chuyển → **go**; còn lại (tập một mình, võ, yoga, bài tập) → **do**.",
      cols: [
        { title: "**play** + môn có bóng / đối thủ / trò chơi", anh: "soccer-ball", items: ["play **football**, **badminton**, **basketball**", "play **chess**, **cards**, **video games**", "play **the guitar / the piano** (nhạc cụ có **the**)"] },
        { title: "**do** + tập luyện, võ, môn không bóng", anh: "person-in-lotus-position", items: ["do **yoga**, **karate**, **tai chi**", "do **exercise**, **aerobics**, **gymnastics**", "do **puzzles**, do **some gardening**"] },
        { title: "**go** + hoạt động đuôi **-ing**", anh: "person-swimming", items: ["go **swimming**, **jogging**, **cycling**", "go **fishing**, **hiking**, **camping**", "go **shopping**, **dancing** (không có ~~to~~)"] },
      ],
    },
    {
      t: "sodo",
      kind: "mindmap",
      title: "Kho ý tưởng khi bị hỏi “What do you do in your free time?”",
      caption: "Chọn trước **2 sở thích thật** của bạn và học kỹ từ vựng cho chúng — đỡ bị “đứng hình” khi vào phòng thi.",
      center: "Free time",
      branches: [
        { label: "Thể thao", items: ["play badminton / football", "go jogging / swimming", "do yoga"], anh: "badminton" },
        { label: "Nghệ thuật", items: ["painting, drawing", "playing the guitar", "singing karaoke"], anh: "artist-palette" },
        { label: "Ở nhà", items: ["reading novels", "cooking new dishes", "watching series"], anh: "house" },
        { label: "Ngoài trời", items: ["going hiking", "going camping", "gardening"], anh: "hiking-boot" },
        { label: "Công nghệ", items: ["playing video games", "editing videos", "learning to code"], anh: "laptop" },
        { label: "Sưu tầm", items: ["collecting stamps / coins", "collecting stickers", "keeping a photo album"], anh: "coin" },
      ],
    },

    { t: "h", text: "3. Cụm từ diễn đạt sở thích" },
    {
      t: "p",
      text: "Thay vì lặp “I like… I like… I like…”, dùng những cụm dưới đây. Chúng rất tự nhiên trong văn nói và được tính vào điểm **Lexical Resource** (vốn từ). Mỗi cụm có cấu trúc đi kèm riêng — để ý cột ví dụ.",
    },
    {
      t: "vocab",
      items: [
        { w: "free time", pos: "n", ipa: "/ˌfriː ˈtaɪm/", vi: "thời gian rảnh", ex: "In my free time, I usually go cycling around West Lake.", exVi: "Lúc rảnh, tôi thường đạp xe quanh Hồ Tây.", more: "Không đếm được: **in my free time** (~~in a free time~~). Đồng nghĩa: **spare time**, **leisure time**." },
        { w: "leisure", pos: "n", ipa: "/ˈleʒə(r)/", vi: "sự nhàn rỗi, giải trí", ex: "Most people spend their leisure time on their phones.", exVi: "Đa số mọi người dành thời gian giải trí cho điện thoại.", more: "Anh-Anh /ˈleʒə/, Mỹ /ˈliːʒər/. **leisure activities** (hoạt động giải trí) — cụm hay dùng trong Writing." },
        { w: "pastime", pos: "n", ipa: "/ˈpɑːstaɪm/", vi: "trò tiêu khiển, thú vui", ex: "Fishing is a popular pastime among older men in my village.", exVi: "Câu cá là thú vui phổ biến của các ông lớn tuổi trong làng tôi.", more: "Đếm được: **a pastime / pastimes**. Viết **một chữ s**: ~~passtime~~." },
        { w: "be into", pos: "phr", ipa: "/bi ˈɪntə/", vi: "mê, thích (văn nói)", ex: "I'm really into Korean cooking at the moment.", exVi: "Dạo này tôi rất mê nấu món Hàn.", more: "**be into + N / V-ing**. Thân mật, rất hợp Speaking; trong Writing dùng **be interested in**." },
        { w: "be keen on", pos: "phr", ipa: "/bi ˈkiːn ɒn/", vi: "thích, hăng hái với (Anh-Anh)", ex: "My sister is keen on photography.", exVi: "Em gái tôi thích nhiếp ảnh.", more: "**be keen on + N / V-ing** (~~keen on to play~~). Phủ định nhẹ nhàng: **I'm not very keen on…** (tôi không thích lắm)." },
        { w: "be a big fan of", pos: "phr", ipa: "/bi ə bɪɡ ˈfæn əv/", vi: "là fan, rất thích", ex: "I'm a big fan of detective novels.", exVi: "Tôi rất mê tiểu thuyết trinh thám.", more: "**be a (huge / big) fan of + N**. Dùng được cả với người: **a big fan of Son Tung**." },
        { w: "can't get enough of", pos: "phr", ipa: "/kɑːnt ɡet ɪˈnʌf əv/", vi: "mê không dứt ra được, thích mãi không chán", ex: "I can't get enough of this game — I play it every night.", exVi: "Tôi mê trò này không dứt ra được — tối nào cũng chơi.", more: "Sắc thái **rất mạnh**, vui vẻ. Dùng một lần trong cả bài nói là đủ, đừng lạm dụng." },
        { w: "unwind", pos: "v", ipa: "/ˌʌnˈwaɪnd/", vi: "thư giãn, xả stress", ex: "Listening to music helps me unwind after a long day.", exVi: "Nghe nhạc giúp tôi thư giãn sau một ngày dài.", more: "Bất quy tắc: **unwind – unwound – unwound** /ʌnˈwaʊnd/. Đồng nghĩa: **relax**, **chill out** (thân mật)." },
        { w: "kill time", pos: "phr", ipa: "/ˌkɪl ˈtaɪm/", vi: "giết thời gian", ex: "I play word games on my phone to kill time on the bus.", exVi: "Tôi chơi trò ghép chữ trên điện thoại để giết thời gian trên xe buýt.", more: "Không có mạo từ: ~~kill the time~~. Sắc thái: làm cho **đỡ chán khi phải chờ**, không phải sở thích thật sự." },
        { w: "take up", pos: "phr v", ipa: "/ˌteɪk ˈʌp/", vi: "bắt đầu (một sở thích, môn mới)", ex: "I took up swimming last summer.", exVi: "Tôi bắt đầu học bơi từ mùa hè năm ngoái.", more: "**take up + N / V-ing**. Trái nghĩa: **give up** (bỏ). Quá khứ: **took up** (Ngày 9)." },
        { w: "get into", pos: "phr v", ipa: "/ˌɡet ˈɪntə/", vi: "bắt đầu thấy thích, “nhập môn”", ex: "I got into chess when my grandfather taught me the rules.", exVi: "Tôi bắt đầu mê cờ vua khi ông dạy tôi luật chơi.", more: "**get into** = quá trình **bắt đầu** thích; **be into** = **đang** thích. Câu hỏi hay gặp: **How did you get into it?**" },
        { w: "hang out", pos: "phr v", ipa: "/ˌhæŋ ˈaʊt/", vi: "đi chơi, tụ tập (với bạn bè)", ex: "At weekends I usually hang out with my friends at a café.", exVi: "Cuối tuần tôi hay đi chơi với bạn ở quán cà phê.", more: "**hang out with + người** · **hang out at + nơi chốn**. Văn nói, rất tự nhiên ở Part 1." },
        { w: "recharge", pos: "v", ipa: "/ˌriːˈtʃɑːdʒ/", vi: "nạp lại năng lượng (nghĩa bóng); sạc pin", ex: "A quiet weekend in the countryside helps me recharge.", exVi: "Một cuối tuần yên tĩnh ở quê giúp tôi nạp lại năng lượng.", more: "Thành ngữ: **recharge my batteries** (lấy lại sức). Dùng được cả trong Writing Task 2 về work-life balance." },
      ],
    },
    {
      t: "note",
      title: "Cẩn thận với các cụm này",
      items: [
        "**be into / be keen on / be a fan of** phải có **be**: ~~I into cooking.~~ → **I'm into cooking.** · ~~I keen on music.~~ → **I'm keen on music.**",
        "Sau **into, on, of** (giới từ) là **danh từ hoặc V-ing**: **keen on playing** (~~keen on play~~), **into reading**.",
        "**take up** (bắt đầu) ≠ **give up** (bỏ cuộc, bỏ thói quen) — hai cụm ngược nghĩa, hay dùng cùng nhau: **I took up the piano at ten but gave it up at fifteen.** (Tôi bắt đầu học piano năm mười tuổi nhưng bỏ năm mười lăm tuổi.)",
      ],
    },

    { t: "h", text: "4. Khung trả lời cho từng kiểu câu hỏi" },
    {
      t: "table",
      head: ["Kiểu câu hỏi", "Khung trả lời (2–4 câu)", "Câu mẫu ngắn"],
      rows: [
        ["(a) What do you do in your free time?", "In my free time, I usually + V… / I'm really into + V-ing. → chi tiết (ở đâu, với ai) → It helps me + V.", "In my free time, I'm really into cooking. I usually try a new recipe on Sunday. It helps me unwind."],
        ["(b) How often…?", "I + V + tần suất (every day / twice a week / once a month), usually + thời điểm. → (But when…, I…)", "I play badminton twice a week, usually on Tuesday and Friday evenings. But during exams, I hardly play at all."],
        ["(c) Why do you enjoy…?", "I enjoy it because + S + V. → (The main reason is that…) → ví dụ nhỏ.", "I enjoy reading because it takes me to other worlds. Last month I read a novel about Japan and felt like I was there."],
        ["(d) Do you prefer A or B?", "I prefer A to B / I'd rather + V than + V, because… → (But I sometimes…)", "I prefer outdoor activities to indoor ones because I sit at a desk all day. But on rainy days I'm happy to stay in."],
        ["(e) Did you have a hobby as a child?", "Yes, when I was a child, I + V-ed / used to + V… → (I gave it up / I still… now).", "Yes, when I was a child, I collected stickers from snack packets. I gave it up at secondary school."],
        ["(f) Is there a hobby you'd like to try?", "I'd love to take up + N / V-ing, because… → (I'm planning to…)", "I'd love to take up rock climbing, because it looks exciting. I'm planning to try a class next month."],
        ["(g) What hobbies are popular in your country?", "I think + N / V-ing + is/are very popular among + nhóm người, especially… because…", "I think badminton is very popular among young people in Vietnam, especially in big cities, because it's cheap and easy to play in a park."],
      ],
    },
    {
      t: "patterns",
      rows: [
        {
          formula: "S + prefer + N/V-ing + to + N/V-ing · S + would rather + V + than + V",
          vi: "Kiểu (d) — so sánh, chọn một bên. prefer… TO (không phải than); would rather + V nguyên mẫu.",
          examples: [
            { en: "I prefer reading books to watching films.", vi: "Tôi thích đọc sách hơn xem phim." },
            { en: "I'd rather stay at home than go to a crowded party.", vi: "Tôi thà ở nhà còn hơn đến một bữa tiệc đông người." },
          ],
        },
        {
          formula: "When I was a child, I + V-ed / used to + V.",
          vi: "Kiểu (e) — hồi nhỏ. Động từ chia quá khứ đơn (Ngày 9 học kỹ).",
          examples: [
            { en: "When I was a child, I used to fly kites with my father.", vi: "Hồi nhỏ, tôi hay thả diều với bố." },
          ],
        },
        {
          formula: "I'd love to / I'd like to + take up + N/V-ing",
          vi: "Kiểu (f) — mong muốn tương lai. I'd = I would.",
          examples: [
            { en: "I'd love to take up painting one day.", vi: "Một ngày nào đó tôi rất muốn bắt đầu học vẽ." },
          ],
        },
        {
          formula: "N / V-ing + is / are + very popular among + nhóm người",
          vi: "Kiểu (g) — nói về người khác. Chủ ngữ V-ing (Playing badminton) → is.",
          examples: [
            { en: "Playing badminton is very popular among office workers in Vietnam.", vi: "Chơi cầu lông rất phổ biến với dân văn phòng ở Việt Nam." },
          ],
        },
      ],
    },
    {
      t: "rule",
      formula: "Trả lời = [câu trả lời thẳng, đúng thì của câu hỏi] + [chi tiết: khi nào / với ai / ở đâu] + [lý do hoặc cảm xúc: It helps me unwind.]",
      vi: "do you → hiện tại đơn · did you → quá khứ đơn · would you like → I'd love to + V · prefer A TO B.",
    },
    {
      t: "quiz",
      id: "d8-noi-dich",
      title: "Dịch sang tiếng Anh — trả lời câu hỏi về sở thích (5 câu)",
      kind: "translate",
      grammar: "In my free time, I usually + V. · I'm really into + N / V-ing. · I prefer + N/V-ing + to + N/V-ing. · I'd like to / I'd love to + take up + N/V-ing. · V-ing (chủ ngữ) + helps me + V nguyên mẫu.",
      items: [
        { q: "Lúc rảnh, tôi thường chơi cầu lông với bạn bè.", hint: "In my free time, I usually, play badminton, with my friends", answers: ["In my free time, I usually play badminton with my friends.", "In my free time I usually play badminton with my friends.", "In my spare time, I usually play badminton with my friends.", "In my free time, I often play badminton with my friends.", "I usually play badminton with my friends in my free time.", "In my free time, I usually play badminton with friends."] },
        { q: "Tôi rất mê chụp ảnh.", hint: "I'm really into, photography / taking photos", answers: ["I'm really into photography.", "I am really into photography.", "I'm really into taking photos.", "I am really into taking photos.", "I'm really into taking pictures.", "I am really into taking pictures.", "I'm really keen on photography.", "I'm a big fan of photography."] },
        { q: "Tôi thích đọc sách hơn xem phim.", hint: "I prefer, reading books, to, watching films", answers: ["I prefer reading books to watching films.", "I prefer reading books to watching movies.", "I prefer reading to watching films.", "I prefer reading to watching movies.", "I'd rather read books than watch films.", "I'd rather read books than watch movies.", "I would rather read books than watch films."] },
        { q: "Tôi muốn bắt đầu học vẽ.", hint: "I'd like to / I'd love to, take up, drawing / painting", answers: ["I'd like to take up drawing.", "I would like to take up drawing.", "I'd love to take up drawing.", "I would love to take up drawing.", "I'd like to take up painting.", "I would like to take up painting.", "I'd love to take up painting.", "I would love to take up painting."] },
        { q: "Chơi đàn guitar giúp tôi thư giãn sau giờ học.", hint: "playing the guitar, helps me, unwind / relax, after school / after class", answers: ["Playing the guitar helps me unwind after school.", "Playing the guitar helps me relax after school.", "Playing the guitar helps me unwind after class.", "Playing the guitar helps me relax after class.", "Playing the guitar helps me to unwind after school.", "Playing the guitar helps me to relax after school.", "Playing guitar helps me unwind after school.", "Playing guitar helps me relax after school.", "Playing the guitar helps me unwind after classes.", "Playing the guitar helps me relax after classes."] },
      ],
    },

    { t: "h", text: "5. Câu trả lời mẫu" },
    {
      t: "canh",
      anh: ["woman-student", "guitar", "badminton", "books"],
      caption: "Thí sinh là **Mai**, sinh viên năm hai. Lúc rảnh Mai chơi guitar, cuối tuần chơi cầu lông và thích đọc sách. Nghe 7 câu hỏi của giám khảo — mỗi câu một **kiểu** khác nhau.",
    },
    {
      t: "dialogue",
      title: "Hobbies / Free time — câu trả lời mẫu band 4.5",
      lines: [
        { who: "Examiner", role: "examiner", text: "What do you usually do in your free time?" },
        { who: "Mai", role: "candidate", text: "In my free time, I usually play the guitar. I learn new songs on YouTube in my bedroom. It helps me relax after class.", vi: "Lúc rảnh, tôi thường chơi guitar. Tôi học bài mới trên YouTube trong phòng ngủ. Việc đó giúp tôi thư giãn sau giờ học." },
        { who: "Examiner", role: "examiner", text: "How often do you play sports?" },
        { who: "Mai", role: "candidate", text: "I play badminton twice a week, on Saturday and Sunday mornings. But when I have exams, I don't play at all.", vi: "Tôi chơi cầu lông hai lần một tuần, vào sáng thứ Bảy và Chủ nhật. Nhưng khi có kỳ thi thì tôi không chơi chút nào." },
        { who: "Examiner", role: "examiner", text: "Why do you enjoy reading?" },
        { who: "Mai", role: "candidate", text: "I enjoy reading because I can learn many new things. For example, last month I read a book about the history of Hue.", vi: "Tôi thích đọc vì tôi có thể học được nhiều điều mới. Ví dụ, tháng trước tôi đọc một cuốn sách về lịch sử Huế." },
        { who: "Examiner", role: "examiner", text: "Do you prefer indoor or outdoor activities?" },
        { who: "Mai", role: "candidate", text: "I prefer outdoor activities to indoor activities, because I sit in class all day. I like fresh air and sunshine.", vi: "Tôi thích hoạt động ngoài trời hơn trong nhà, vì tôi ngồi trong lớp cả ngày. Tôi thích không khí trong lành và nắng." },
        { who: "Examiner", role: "examiner", text: "Did you have any hobbies when you were a child?" },
        { who: "Mai", role: "candidate", text: "Yes, I did. When I was a child, I collected stickers. I kept them in a small box, but I stopped when I was twelve.", vi: "Có ạ. Hồi nhỏ tôi sưu tầm hình dán. Tôi cất chúng trong một chiếc hộp nhỏ, nhưng đến năm mười hai tuổi thì thôi." },
        { who: "Examiner", role: "examiner", text: "Is there a new hobby you would like to try in the future?" },
        { who: "Mai", role: "candidate", text: "I would like to try swimming, because I can't swim. I think it is useful and good for my health.", vi: "Tôi muốn thử học bơi, vì tôi chưa biết bơi. Tôi nghĩ nó hữu ích và tốt cho sức khoẻ." },
        { who: "Examiner", role: "examiner", text: "What hobbies are popular among young people in your country?" },
        { who: "Mai", role: "candidate", text: "I think playing video games is very popular among young people in Vietnam. Many students play games on their phones every day.", vi: "Tôi nghĩ chơi điện tử rất phổ biến với giới trẻ Việt Nam. Nhiều học sinh chơi game trên điện thoại hằng ngày." },
      ],
    },
    {
      t: "note",
      title: "Vì sao những câu trên đạt khoảng band 4.5",
      items: [
        "**Trả lời đúng kiểu câu hỏi và đúng thì**: How often → **twice a week**; prefer → **prefer… to…**; Did you → **collected, kept, stopped** (quá khứ); would like → **I would like to try**.",
        "Có **chi tiết** (YouTube, Saturday and Sunday mornings, a book about Hue) và **lý do** (because I sit in class all day).",
        "Còn hạn chế: từ vựng đơn giản lặp lại (**I like, I enjoy, relax**), câu ngắn ít nối, chưa có cụm từ tự nhiên. Xem bản nâng cấp ngay dưới.",
      ],
    },
    {
      t: "dialogue",
      title: "Bốn câu trả lời nâng cấp band 6",
      lines: [
        { who: "Examiner", role: "examiner", text: "What do you usually do in your free time?" },
        { who: "Mai", role: "candidate", text: "Well, I'm really into playing the guitar at the moment. I got into it about a year ago, and now I spend most evenings learning songs from online tutorials. It's a great way to unwind after a long day of lectures.", vi: "À, dạo này tôi rất mê chơi guitar. Tôi bắt đầu thích nó khoảng một năm trước, và giờ hầu như tối nào tôi cũng học bài từ các video hướng dẫn trên mạng. Đó là cách tuyệt vời để thư giãn sau một ngày dài nghe giảng." },
        { who: "Examiner", role: "examiner", text: "Do you prefer indoor or outdoor activities?" },
        { who: "Mai", role: "candidate", text: "Definitely outdoor ones. Since I'm stuck in a classroom all week, I'd much rather be out in the fresh air at the weekend, so I usually play badminton in the park near my flat. That said, when it's pouring with rain, I'm quite happy to curl up with a book.", vi: "Chắc chắn là ngoài trời. Vì cả tuần bị “nhốt” trong lớp, cuối tuần tôi thà ra ngoài hít thở không khí trong lành, nên tôi hay chơi cầu lông ở công viên gần nhà. Dù vậy, khi trời mưa như trút, tôi cũng rất vui khi cuộn mình đọc sách." },
        { who: "Examiner", role: "examiner", text: "Did you have any hobbies when you were a child?" },
        { who: "Mai", role: "candidate", text: "Oh yes, I was a big fan of collecting stickers. I used to swap them with my classmates at break time, and I kept the best ones in an old biscuit tin. I gave it up when I started secondary school, but I still have the tin somewhere.", vi: "Có chứ, hồi đó tôi mê sưu tầm hình dán lắm. Tôi hay đổi với bạn cùng lớp vào giờ ra chơi, và cất những tấm đẹp nhất trong một hộp bánh quy cũ. Lên cấp hai thì tôi bỏ, nhưng cái hộp vẫn còn đâu đó." },
        { who: "Examiner", role: "examiner", text: "Is there a new hobby you would like to try in the future?" },
        { who: "Mai", role: "candidate", text: "I'd love to take up swimming. To be honest, it's a bit embarrassing that I still can't swim, and I think it's an important life skill. I'm planning to sign up for a beginners' class this summer.", vi: "Tôi rất muốn bắt đầu học bơi. Nói thật thì hơi ngại vì tôi vẫn chưa biết bơi, và tôi nghĩ đó là một kỹ năng sống quan trọng. Tôi định đăng ký một lớp cho người mới vào hè này." },
      ],
    },
    {
      t: "note",
      title: "Ghi nhớ: vì sao bản nâng cấp lên được band 6",
      items: [
        "**Cụm từ tự nhiên** thay cho “I like”: **I'm really into · I got into it · a great way to unwind · I'd much rather · a big fan of · take up**.",
        "**Mở đầu tự nhiên** (Well, … / Definitely… / Oh yes, …) và **nối ý** (since, so, That said, but) — nghe như nói chuyện, không như đọc thuộc lòng.",
        "**Chi tiết sống động** nhưng vẫn ngắn: **an old biscuit tin**, **the park near my flat**, **a beginners' class this summer**.",
        "Vẫn chỉ **3 câu, 15–25 giây** mỗi câu hỏi. Band cao không có nghĩa là nói dài; mà là nói **đúng, đa dạng, tự nhiên**.",
      ],
    },

    { t: "h", text: "6. Lỗi người Việt hay mắc ở chủ đề này" },
    {
      t: "table",
      head: ["Sai", "Đúng", "Vì sao"],
      rows: [
        ["~~I like reading book.~~", "I like **reading books**.", "**book** đếm được → nói chung chung dùng **số nhiều** (ôn Ngày 5)."],
        ["~~I enjoy to play chess.~~", "I enjoy **playing** chess.", "**enjoy + V-ing** (không bao giờ enjoy to V). Cùng nhóm: **finish, avoid, mind + V-ing**."],
        ["~~I'm interesting in music.~~", "I'm **interested in** music.", "**interested** (cảm thấy thích — người) ≠ **interesting** (gây hứng thú — vật) — quy tắc -ed / -ing đã học ở Ngày 7."],
        ["~~I prefer coffee than tea.~~", "I prefer coffee **to** tea.", "**prefer A to B**. **than** chỉ dùng với **would rather** (I'd rather drink coffee **than** tea)."],
        ["~~My hobby is play badminton.~~", "My hobby is **playing** badminton. / I **play** badminton.", "Sau **is** cần danh từ hoặc **V-ing**. Tốt hơn nữa: tránh mở đầu bằng “My hobby is…” — nói thẳng **I'm into…**"],
        ["~~I play swimming.~~ / ~~I go to swimming.~~", "I **go swimming**.", "Môn đuôi -ing đi với **go** và **không có to**."],
        ["~~In a free time, I…~~", "**In my free time**, I…", "**free time** không đếm được, không có **a**."],
        ["~~I don't have many free time.~~", "I don't have **much** free time.", "**time** không đếm được → **much** (ôn Ngày 5)."],
        ["~~When I was a child, I collect stamps.~~", "When I was a child, I **collected** stamps.", "Câu hỏi **Did you…?** / chuyện **hồi nhỏ** → **quá khứ đơn** (Ngày 9)."],
      ],
    },
    {
      t: "mcq",
      id: "d8-noi-chon",
      title: "Chọn câu trả lời đúng (6 câu)",
      items: [
        { q: "Examiner: “How often do you go swimming?”", options: ["I go swimming about three times a week, usually early in the morning.", "I go swimming at the sports centre.", "Because swimming is good for my health."], correct: 0, why: "**How often** hỏi **tần suất** → **three times a week**. Câu B trả lời **ở đâu** (where); câu C trả lời **vì sao** (why)." },
        { q: "Chọn câu đúng ngữ pháp:", options: ["I prefer playing chess than playing video games.", "I prefer playing chess to playing video games.", "I prefer play chess to play video games."], correct: 1, why: "**prefer + V-ing + to + V-ing**. Câu A sai vì dùng **than**; câu C sai vì sau **prefer… to** dùng V-ing, không dùng V nguyên mẫu." },
        { q: "My father ___ tai chi in the park every morning.", options: ["plays", "goes", "does"], correct: 2, why: "Võ, yoga, tai chi → **do**. **play** dành cho môn có bóng/đối thủ; **go** cho hoạt động đuôi -ing (go jogging)." },
        { q: "Examiner: “Did you have any hobbies as a child?”", options: ["Yes. I play hide and seek with my cousins.", "Yes. I am playing hide and seek with my cousins.", "Yes. I used to play hide and seek with my cousins."], correct: 2, why: "Câu hỏi **Did you…** về **hồi nhỏ** → quá khứ: **used to play** (hoặc **played**). Câu A dùng hiện tại đơn, câu B dùng hiện tại tiếp diễn — sai thì." },
        { q: "Chọn câu tự nhiên và đúng nhất:", options: ["I'm keen on take photos.", "I'm keen on taking photos.", "I keen on taking photos."], correct: 1, why: "**be keen on + V-ing**: cần **be** (I'm) và sau giới từ **on** là **V-ing**. Câu A sai dạng động từ; câu C thiếu **be**." },
        { q: "Examiner: “Is there a hobby you'd like to try?” Câu nào trả lời đúng kiểu câu hỏi?", options: ["I'd love to take up rock climbing because it looks exciting.", "I took up rock climbing last year.", "Rock climbing is popular in my country."], correct: 0, why: "Câu hỏi về **mong muốn tương lai** → **I'd love to + V**. Câu B kể chuyện **đã làm**; câu C nói về **người khác**, không nói về bạn." },
      ],
    },

    { t: "h", text: "7. Phát âm: âm /ŋ/ trong đuôi -ing" },
    {
      t: "p",
      text: "Gần như mọi tên sở thích đều có đuôi **-ing** (reading, swimming, cooking…). Âm cuối của nó là **/ŋ/** — âm **mũi**: cuống lưỡi nâng lên chạm vòm mềm phía sau, hơi đi ra **đằng mũi**, giống âm cuối của tiếng Việt “**ng**” trong “**sáng**”, “**cứng**”. Âm /ɪ/ trước nó **ngắn**, gần “i” ngắn.",
    },
    {
      t: "note",
      title: "Lỗi người Việt hay mắc với /ŋ/",
      items: [
        "Đọc **-ing** thành “**inh**” (reading → ~~“ri-đinh”~~): tiếng Việt “inh” kéo lưỡi ra trước. Muốn đúng, hãy nghĩ tới “**-ing**” như “**i**” ngắn + “**ng**” trong “sáng”, giữ lưỡi **phía sau**.",
        "**Nuốt mất** âm cuối (reading → ~~“ri-đi”~~) hoặc đọc thành **/n/** (~~“ri-đin”~~). Khi đó **sing** /sɪŋ/ nghe như **sin** /sɪn/, **thing** nghe như **thin**.",
        "**Không** thêm âm /ɡ/ phía sau trong giọng chuẩn: **singing** là /ˈsɪŋɪŋ/, không phải ~~“sing-ghing”~~. (Riêng **finger, longer, English** thì có /ɡ/: /ˈfɪŋɡə/, /ˈɪŋɡlɪʃ/.)",
        "Đuôi **-ing** đứng trước từ bắt đầu bằng nguyên âm thì **nối âm**: **going out** → /ˈɡəʊɪŋ aʊt/ đọc liền “gâu-i-ngao”.",
      ],
    },
    {
      t: "examples",
      items: [
        { en: "sin — sing", vi: "/sɪn/ · /sɪŋ/ — lưỡi trước (n) và lưỡi sau (ng)" },
        { en: "thin — thing", vi: "/θɪn/ · /θɪŋ/" },
        { en: "ran — rang", vi: "/ræn/ · /ræŋ/" },
        { en: "reading, swimming, painting", vi: "/ˈriːdɪŋ/ · /ˈswɪmɪŋ/ · /ˈpeɪntɪŋ/" },
      ],
    },
    {
      t: "phatam",
      id: "d8-phat-am",
      title: "Luyện phát âm — âm /ŋ/ trong đuôi -ing",
      note: "Bấm “Nghe mẫu”, rồi “Đọc & chấm” và đọc to đúng dòng đó. Giữ âm /ŋ/ ở cuối mỗi từ -ing: lưỡi lùi về sau, hơi ra đằng mũi. Đọc thành “inh” hoặc bỏ âm cuối là máy chấm vàng/đỏ.",
      items: [
        { text: "reading, swimming, painting", ipa: "riːdɪŋ swɪmɪŋ peɪntɪŋ", vi: "/ŋ/ cuối — không đọc “inh”" },
        { text: "singing, cooking, fishing", ipa: "sɪŋɪŋ kʊkɪŋ fɪʃɪŋ", vi: "singing: hai lần /ŋ/, không có /ɡ/" },
        { text: "sin, sing, thin, thing", ipa: "sɪn sɪŋ θɪn θɪŋ", vi: "/n/ ↔ /ŋ/" },
        { text: "I enjoy cooking at the weekend.", ipa: "aɪ ɪndʒɔɪ kʊkɪŋ ət ðə wiːkend", vi: "/ŋ/ trong cooking" },
        { text: "I'm really into playing the guitar.", ipa: "aɪm rɪəli ɪntə pleɪɪŋ ðə ɡɪtɑː", vi: "playing: /eɪ/ + /ɪŋ/" },
        { text: "Going hiking is a good way to unwind.", ipa: "ɡəʊɪŋ haɪkɪŋ ɪz ə ɡʊd weɪ tə ʌnwaɪnd", vi: "hai từ -ing liền nhau" },
        { text: "Drawing helps me forget about everything.", ipa: "drɔːɪŋ helps miː fəɡet əbaʊt evriθɪŋ", vi: "everything: /θɪŋ/ cuối" },
        { text: "I go swimming in the morning.", ipa: "aɪ ɡəʊ swɪmɪŋ ɪn ðə mɔːnɪŋ", vi: "swimming, morning" },
      ],
    },

    { t: "h", text: "8. Luyện nói" },
    {
      t: "p",
      text: "Nghe từng câu hỏi, nhận ra **kiểu** câu hỏi (a–g) rồi trả lời theo khung ở mục 4: **2–4 câu**, đúng thì, có chi tiết và lý do. Thử dùng ít nhất **ba cụm** ở mục 3 (be into, unwind, take up…) và đọc rõ âm **/ŋ/**.",
    },
    {
      t: "speak",
      id: "d8-noi-luyen",
      part: "1",
      questions: [
        "What do you usually do in your free time?",
        "How much free time do you have during the week?",
        "Why do you enjoy your favourite hobby?",
        "Do you prefer spending your free time alone or with other people?",
        "Did you have any hobbies when you were a child?",
        "Is there a new hobby you would like to take up in the future?",
        "What hobbies are popular among young people in your country?",
        "Do you think hobbies are important for students? Why?",
      ],
    },
  ],
};

/* ─────────────────────────── Homework ─────────────────────────── */

const D8_HOMEWORK: Lesson = {
  id: "d8-bai-tap",
  kind: "homework",
  title: "Bài tập Ngày 8",
  goal: "Tự kiểm tra Ngày 8: một bài Table Completion ngắn, trắc nghiệm về đoạn thân bài và câu trả lời Part 1, điền từ nối và play/do/go, 10 câu dịch có gợi ý, và viết một đoạn thân bài hoàn chỉnh.",
  minutes: 45,
  blocks: [
    {
      t: "recap",
      title: "Bài tập hôm nay",
      items: [
        "**Bài I (6 ô):** Table Completion — đọc tiêu đề hàng/cột trước, tìm theo **hàng** (đoạn văn).",
        "**Bài II (8 câu):** trắc nghiệm — câu chủ đề, ví dụ, từ nối, cách trả lời Speaking.",
        "**Bài III (6 câu):** từ nối trong đoạn thân bài. **Bài IV (9 câu):** play / do / go + V-ing và cụm sở thích.",
        "**Bài V (10 câu):** dịch Việt → Anh có 💡. **Bài VI:** viết **một đoạn thân bài** ~90–110 từ.",
      ],
    },
    {
      t: "sodo",
      kind: "flow",
      title: "Nhắc nhanh trước khi làm",
      steps: [
        { label: "Đọc bảng: hàng × cột", sub: "ô (n) hỏi [cột] của [hàng]" },
        { label: "Thân bài: Topic", sub: "Firstly / Secondly, + một ý" },
        { label: "Explanation", sub: "This is because / This means that" },
        { label: "Example", sub: "For example, / such as / If…" },
        { label: "Speaking: đúng kiểu, đúng thì", sub: "prefer A to B · I'd love to take up…" },
      ],
    },

    { t: "h", text: "Bài I — Table Completion" },
    {
      t: "p",
      text: "Đọc bảng **trước**, rồi đọc ba đoạn văn và điền bảng. Choose **NO MORE THAN TWO WORDS AND/OR A NUMBER** from the passage for each answer.",
    },
    {
      t: "passage",
      title: "Weekend Clubs at Riverside Community Centre",
      paras: [
        { label: "A", text: "The Photography Club meets every Saturday morning in Room 4 on the second floor. Membership costs £3 per session, which includes a cup of tea. Members do not need an expensive camera; most of them simply use their mobile phones. Each month the club chooses a theme, and the best photos are shown in the centre's café." },
        { label: "B", text: "Fans of board games gather on Friday evenings in the main hall. The club is free to join, although donations are welcome. Players are asked to bring a snack to share, and new members can borrow games from the club's collection of more than 200 titles." },
        { label: "C", text: "The Walking Group sets off at 8.30 every Sunday from the car park behind the centre. Each walk lasts about two hours and costs nothing. Walkers should wear comfortable boots and carry a bottle of water, because some routes climb steep hills." },
      ],
    },
    {
      t: "table",
      caption: "Riverside Community Centre — weekend clubs",
      head: ["Club", "Day", "Meeting place", "Cost", "Members should…"],
      rows: [
        ["Photography Club", "Saturday", "**(1) ______** on the second floor", "£**(2) ______** per session", "use a camera or their **(3) ______**"],
        ["Board games club", "**(4) ______**", "main hall", "free", "bring a **(5) ______** to share"],
        ["Walking Group", "Sunday", "the **(6) ______** behind the centre", "nothing", "wear comfortable boots"],
      ],
    },
    {
      t: "quiz",
      id: "d8-bt-bang",
      title: "I. Table Completion (6 câu)",
      kind: "fill",
      items: [
        { q: "(1) Photography Club — meeting place: ___ on the second floor", answers: ["Room 4", "room four"] },
        { q: "(2) Photography Club — cost: £___ per session", answers: ["3", "three"] },
        { q: "(3) Photography Club — members can use a camera or their ___", answers: ["mobile phones", "phones"] },
        { q: "(4) Board games club — day: ___", answers: ["Friday", "Fridays", "Friday evenings", "Friday evening"] },
        { q: "(5) Board games club — bring a ___ to share", answers: ["snack"] },
        { q: "(6) Walking Group — meeting place: the ___ behind the centre", answers: ["car park"] },
      ],
    },
    {
      t: "note",
      title: "Giải thích đáp án Bài I",
      items: [
        "(1) **Room 4** — đoạn A: “meets… **in Room 4** on the second floor”. Cột Meeting place → cần **nơi chốn**; “on the second floor” đã in sẵn nên không chép lại.",
        "(2) **3** — “Membership costs **£3** per session”. Bảng đã in sẵn **£** và **per session** → chỉ điền số. Bẫy: **4** (số phòng) và **200** (số trò chơi ở đoạn B) — đúng cột **Cost** thì chỉ có £3.",
        "(3) **mobile phones** — “most of them simply use their **mobile phones**”. Hai từ, **số nhiều** như bài (their… phones).",
        "(4) **Friday** — đoạn B: “gather **on Friday evenings**”. Cột **Day** có Saturday, Sunday → cần **tên thứ**. Viết **Friday** là đủ; **Friday evening(s)** vẫn trong giới hạn hai từ.",
        "(5) **snack** — “Players are asked to bring **a snack to share**”. Paraphrase: **are asked to** ↔ **should**. Bẫy: **donations** (tiền ủng hộ) — không phải thứ “mang tới để chia nhau”.",
        "(6) **car park** — đoạn C: “sets off… from **the car park behind the centre**”. Paraphrase: **sets off from** ↔ **meeting place**.",
      ],
    },

    { t: "h", text: "Bài II — Trắc nghiệm" },
    {
      t: "mcq",
      id: "d8-bt-chon",
      title: "II. Chọn đáp án đúng (8 câu)",
      items: [
        { q: "Thesis: “I disagree because hobbies reduce stress and teach students practical skills.” Câu chủ đề tốt nhất cho Body 2 là:", options: ["Secondly, hobbies can teach students skills that are useful in real life.", "Secondly, hobbies are fun.", "Secondly, students should study harder."], correct: 0, why: "Body 2 phải nói **lý do 2** của thesis — **practical skills** ↔ **skills that are useful in real life**. Câu B quá chung và không khớp; câu C đi ngược quan điểm của thesis." },
        { q: "Câu nào là câu **giải thích** (explanation), không phải ví dụ?", options: ["For example, my brother learnt to cook by watching videos.", "This is because cooking requires planning, patience and careful timing.", "Many hobbies, such as cooking and sewing, are practical."], correct: 1, why: "**This is because…** giải thích **vì sao**. Câu A (**For example**) và câu C (**such as**) đưa **ví dụ**." },
        { q: "Ví dụ nào **nên tránh** trong bài IELTS?", options: ["For instance, my aunt started painting after she retired and now sells her pictures online.", "If students have a hobby, they can make friends with similar interests.", "According to a recent study, 87% of students who have hobbies get higher marks."], correct: 2, why: "Câu C là **số liệu nghiên cứu bịa**, không nguồn — giám khảo nhận ra và không cho điểm. Câu A (ví dụ cá nhân cụ thể) và câu B (ví dụ giả định) đều dùng tốt." },
        { q: "Chọn câu đúng:", options: ["This is because the city is crowded.", "Because the city is crowded.", "This is because of the city is crowded."], correct: 0, why: "**This is because + S + V** là câu hoàn chỉnh. Câu B là câu què; câu C sai vì **because of** chỉ đi với danh từ." },
        { q: "Ở Table Completion, ô trống nằm trong cột “Year”. Bạn nên đoán đáp án là:", options: ["một danh từ chỉ người", "một con số", "một động từ"], correct: 1, why: "Các ô **cùng cột** có **cùng loại thông tin**: cột **Year** → **năm (con số)**. Đoán trước loại từ giúp dò bài nhanh và loại phương án sai." },
        { q: "Examiner: “Do you prefer reading books or watching films?”", options: ["I prefer watching films than reading books.", "I'd rather watching films than reading books.", "I'd rather watch films than read books, because I can relax with my family."], correct: 2, why: "**would rather + V nguyên mẫu + than + V nguyên mẫu** — câu C đúng và có lý do. Câu A sai: **prefer… to**, không phải **than**. Câu B sai: sau **would rather** là **watch**, không phải **watching**." },
        { q: "Examiner: “What do you do in your free time?”", options: ["I'm really into football. I usually play with my neighbours on Sunday afternoons.", "My hobby is play football.", "In a free time, I play football."], correct: 0, why: "Câu A đúng ngữ pháp, tự nhiên, có chi tiết (ai, khi nào). Câu B sai: sau **is** phải là **playing**; câu C sai: **in my free time**, không có ~~a~~." },
        { q: "Từ nối nào hợp để nói **kết quả** ở cuối đoạn?", options: ["For instance,", "As a result,", "In other words,"], correct: 1, why: "**As a result,** = kết quả là. **For instance** đưa ví dụ; **In other words** nói lại ý cũ bằng lời khác." },
      ],
    },

    { t: "h", text: "Bài III — Từ nối trong đoạn thân bài" },
    {
      t: "p",
      text: "Điền **một từ** còn thiếu của cụm từ nối. Đoạn văn: Secondly, team sports teach children how to cooperate…",
    },
    {
      t: "quiz",
      id: "d8-bt-noi",
      title: "III. Điền một từ (6 câu)",
      kind: "fill",
      items: [
        { q: "___, team sports teach children how to cooperate. (mở thân bài 2)", answers: ["Secondly", "Second"] },
        { q: "This ___ because players must share the ball and support each other to win.", answers: ["is"] },
        { q: "This means ___ children learn to listen to others and accept different ideas.", answers: ["that"] },
        { q: "For ___, my younger cousin was very shy before he joined a football club.", answers: ["example", "instance"] },
        { q: "As a ___, he now talks confidently to his classmates.", answers: ["result"] },
        { q: "Team sports such ___ basketball and volleyball are also cheap to play at school.", answers: ["as"] },
      ],
    },

    { t: "h", text: "Bài IV — play / do / go và cụm sở thích" },
    {
      t: "quiz",
      id: "d8-bt-hoat-dong",
      title: "IV. Điền một từ (9 câu)",
      kind: "fill",
      items: [
        { q: "I ___ jogging every morning before class. (play / do / go)", answers: ["go"] },
        { q: "My brother ___ karate twice a week. (play / do / go — chia động từ)", answers: ["does"] },
        { q: "We usually ___ chess after dinner. (play / do / go)", answers: ["play"] },
        { q: "She ___ camping with her family every summer. (play / do / go — chia động từ)", answers: ["goes"] },
        { q: "My grandparents ___ tai chi in the park. (play / do / go)", answers: ["do"] },
        { q: "I really enjoy ___ new dishes at the weekend. (cook)", answers: ["cooking"] },
        { q: "My sister is keen on ___ photos of street food. (take)", answers: ["taking"] },
        { q: "I'd love to take ___ the piano one day. (bắt đầu học)", answers: ["up"] },
        { q: "I prefer swimming ___ running because it's easier on my knees.", answers: ["to"] },
      ],
    },
    {
      t: "note",
      title: "Giải thích đáp án Bài III – IV",
      items: [
        "Bài III: **Secondly, · This is because · This means that · For example / For instance, · As a result, · such as** — sáu cụm cố định của đoạn thân bài.",
        "Bài IV (1)–(5): **go jogging, go camping** (đuôi -ing) · **do karate, do tai chi** (võ, tập luyện) · **play chess** (trò chơi có đối thủ). Chủ ngữ **My brother / She** → chia **does / goes**.",
        "(6) **enjoy + V-ing** → cooking · (7) **keen on + V-ing** → taking · (8) **take up** = bắt đầu một sở thích · (9) **prefer A to B** → to.",
      ],
    },

    { t: "h", text: "Bài V — Dịch Việt → Anh" },
    {
      t: "quiz",
      id: "d8-bt-dich",
      title: "V. Dịch sang tiếng Anh (10 câu)",
      kind: "translate",
      grammar: "Hiện tại đơn cho thói quen: S + V(s/es) + tần suất. go + V-ing · do + yoga/karate · play + môn bóng/trò chơi. prefer + V-ing + to + V-ing. I'd like to / I'd love to + V. Quá khứ đơn cho chuyện hồi nhỏ: When I was a child, I + V-ed. Thân bài: Firstly, … · This is because + S + V. · For example, + S + V.",
      items: [
        { q: "Tôi thường đi bơi hai lần một tuần.", hint: "usually, go swimming, twice a week", answers: ["I usually go swimming twice a week.", "I often go swimming twice a week.", "I go swimming twice a week.", "I usually go swimming two times a week."] },
        { q: "Em gái tôi tập yoga mỗi sáng.", hint: "my younger sister, does yoga, every morning", answers: ["My younger sister does yoga every morning.", "My little sister does yoga every morning.", "My sister does yoga every morning.", "My younger sister practises yoga every morning.", "My younger sister practices yoga every morning."] },
        { q: "Bạn có thích chơi cờ vua không?", hint: "Do you like / Do you enjoy, playing chess", answers: ["Do you like playing chess?", "Do you enjoy playing chess?", "Do you like to play chess?", "Do you like chess?"] },
        { q: "Cuối tuần tôi thích ở nhà hơn là đi ra ngoài.", hint: "I prefer, staying at home, to going out, at the weekend", answers: ["I prefer staying at home to going out at the weekend.", "I prefer staying at home to going out at weekends.", "At the weekend, I prefer staying at home to going out.", "At weekends, I prefer staying at home to going out.", "I prefer staying home to going out at the weekend.", "I prefer staying at home to going out on the weekend.", "I'd rather stay at home than go out at the weekend.", "At the weekend I prefer staying at home to going out."] },
        { q: "Hồi nhỏ, tôi sưu tầm tem.", hint: "When I was a child, collected stamps (quá khứ đơn — Ngày 9)", answers: ["When I was a child, I collected stamps.", "When I was a child I collected stamps.", "When I was a kid, I collected stamps.", "When I was young, I collected stamps.", "When I was a child, I used to collect stamps.", "As a child, I collected stamps."] },
        { q: "Năm sau tôi muốn bắt đầu học đàn piano.", hint: "I'd like to / I'd love to, take up the piano, next year", answers: ["I'd like to take up the piano next year.", "I would like to take up the piano next year.", "I'd love to take up the piano next year.", "I would love to take up the piano next year.", "Next year, I'd like to take up the piano.", "Next year, I would like to take up the piano.", "I'd like to take up playing the piano next year."] },
        { q: "Đọc sách là một cách tuyệt vời để thư giãn.", hint: "reading, is a great way, to unwind / to relax", answers: ["Reading is a great way to unwind.", "Reading is a great way to relax.", "Reading books is a great way to unwind.", "Reading books is a great way to relax.", "Reading is a wonderful way to relax.", "Reading is an excellent way to relax."] },
        { q: "Thứ nhất, sở thích giúp học sinh giảm căng thẳng.", hint: "Firstly, hobbies help students, reduce stress", answers: ["Firstly, hobbies help students reduce stress.", "Firstly, hobbies help students to reduce stress.", "First, hobbies help students reduce stress.", "Firstly hobbies help students reduce stress.", "Firstly, hobbies help students reduce their stress.", "First of all, hobbies help students reduce stress."] },
        { q: "Điều này là vì các em có thể quên bài vở trong một lúc.", hint: "This is because, they can forget about, their studies / schoolwork, for a while", answers: ["This is because they can forget about their studies for a while.", "This is because they can forget about schoolwork for a while.", "This is because they can forget about their schoolwork for a while.", "This is because they can forget about their homework for a while.", "This is because they can forget their studies for a while.", "This is because they can forget about studying for a while."] },
        { q: "Ví dụ, bạn tôi chơi bóng rổ mỗi chiều sau giờ học.", hint: "For example, my friend, plays basketball, every afternoon, after school", answers: ["For example, my friend plays basketball every afternoon after school.", "For instance, my friend plays basketball every afternoon after school.", "For example my friend plays basketball every afternoon after school.", "For example, my friend plays basketball after school every afternoon.", "For example, my friend plays basketball every afternoon after class."] },
      ],
    },
    {
      t: "note",
      title: "Soát lỗi Bài V",
      items: [
        "(1) **go swimming** — không có ~~go to swimming~~. (2) **does yoga** — chủ ngữ số ít → **does**.",
        "(4) **prefer staying… to going…** — hai vế cùng dạng **V-ing**, nối bằng **to**. Hoặc **I'd rather stay… than go…** (V nguyên mẫu, nối bằng than).",
        "(5) Chuyện **hồi nhỏ** → quá khứ đơn **collected** (Ngày 9 học kỹ cách thêm -ed).",
        "(8) **help + O + V nguyên mẫu** (help students **reduce**) — ~~help students reducing~~ là sai. (9) **This is because + S + V**, không ~~because of~~.",
      ],
    },

    { t: "h", text: "Bài VI — Viết một đoạn thân bài" },
    {
      t: "essay",
      id: "d8-bt-viet",
      task: "Task 2",
      prompt: "Write ONE body paragraph (about 90–110 words) for this essay. Question: Some people think that students should spend all of their free time studying because hobbies are a waste of time. To what extent do you agree or disagree? Thesis statement (already written): I completely disagree because hobbies help students reduce stress and teach them useful skills. Write the paragraph for the FIRST reason: hobbies help students reduce stress.",
      minWords: 90,
      tips: [
        "Câu 1 — **Topic sentence**: Firstly, + lý do 1 viết bằng từ khác (reduce stress → relax / recharge / feel less pressure).",
        "Câu 2–3 — **Explanation**: This is because… (vì sao sở thích giảm căng thẳng?) · This means that… (thì sao? ngủ ngon hơn, tập trung hơn).",
        "Câu 4 — **Example**: For example, + một người thật (bạn cùng lớp, anh chị) với hoạt động cụ thể, thời gian cụ thể. Không bịa số liệu nghiên cứu.",
        "Câu 5 (tuỳ chọn) — **Link**: As a result, + nối về ý “sở thích không phải là lãng phí thời gian”.",
        "Soát: because + S + V · help + O + V · enjoy + V-ing · chủ ngữ số ít → động từ thêm -s.",
      ],
    },
  ],
};

export const NGAY_8: Lesson[] = [D8_READING, D8_WRITING, D8_SPEAKING, D8_HOMEWORK];
