/**
 * Ngày 11 — Grammar: kết hợp danh từ – động từ – tính từ (collocation, trật tự từ,
 * cụm danh từ) · Vocabulary: biểu đồ theo thời gian 1 (tăng / giảm / dao động / ổn
 * định — động từ, danh từ, trạng từ mức độ) · Listening Part 3 (hội thoại học thuật
 * 3 người, gọi tên nhau) · Homework.
 *
 * Tự soạn (xem ../SOAN-BAI.md và bản giao việc 12/11/2026): câu ví dụ, số liệu biểu
 * đồ (tự đặt), kịch bản nghe đều VIẾT MỚI. Bài nghe Part 3 nói về một khảo sát giấc
 * ngủ — nối với từ vựng xu hướng của bài từ vựng (fell sharply, recovered gradually…)
 * và với dạng Matching Features của Ngày 10 (ai đề xuất điều gì).
 */
import type { Lesson } from '../data';

/* ─────────────────────────── Ngữ pháp ─────────────────────────── */

const D11_GRAMMAR: Lesson = {
  id: "d11-ngu-phap",
  kind: "grammar",
  title: "Kết hợp danh từ – động từ – tính từ (Collocation, trật tự từ & cụm danh từ)",
  goal: "Dùng đúng các cặp từ “hay đi với nhau” (make a decision, heavy rain, rise sharply, impact on…), xếp từ đúng trật tự S–V–O–cách thức–nơi chốn–thời gian, và dựng được cụm danh từ dài, chính xác cho Writing.",
  minutes: 60,
  blocks: [
    {
      t: "recap",
      title: "Bài này học gì",
      items: [
        "**Collocation** (kết hợp từ) = những từ **người bản xứ hay dùng cùng nhau**: ==heavy rain== (không ~~strong rain~~), ==make a mistake== (không ~~do a mistake~~). Dịch từng chữ từ tiếng Việt là nguồn lỗi số 1.",
        "**Trật tự từ**: ==S + V + O + cách thức + nơi chốn + thời gian==. Không chen trạng từ vào giữa động từ và tân ngữ: ~~I like very much football~~.",
        "**Cụm danh từ**: từ hạn định + số lượng + tính từ + danh từ bổ nghĩa + ==DANH TỪ CHÍNH== + phần bổ nghĩa phía sau. Tính từ tiếng Anh **đứng trước** danh từ — thứ tự gần như **ngược** tiếng Việt.",
        "6 kiểu kết hợp: **động từ + danh từ · tính từ + danh từ · danh từ + danh từ · trạng từ + tính từ · động từ + trạng từ · từ + giới từ**.",
        "Vì sao quan trọng: tiêu chí **Lexical Resource** (vốn từ) chấm cả độ **tự nhiên** của cách kết hợp từ — band 6 trở lên phải có “awareness of collocation”.",
      ],
    },

    { t: "h", text: "1. Collocation là gì?" },
    {
      t: "p",
      text: "**Collocation** (kết hợp từ, “cụm từ hay đi với nhau”) là những cặp từ mà người bản xứ **quen dùng cùng nhau**. Về logic, “strong rain” cũng có nghĩa, nhưng người Anh **không nói vậy** — họ nói **heavy rain**. Không có quy tắc nào giải thích vì sao; chỉ có cách **học cả cụm** như học một từ. Người Việt hay sai vì **dịch từng chữ**: “mưa **to**” → ~~big rain~~, “**làm** bài tập” → ~~make homework~~.",
    },
    {
      t: "table",
      caption: "Dịch từng chữ (sai) và collocation đúng",
      head: ["Tiếng Việt", "Dịch từng chữ ❌", "Collocation đúng ✅"],
      rows: [
        ["mưa to", "~~big rain~~ / ~~strong rain~~", "**heavy** rain"],
        ["giá cao", "~~expensive price~~", "a **high** price (cái **giá** cao; còn **món đồ** thì expensive)"],
        ["làm bài tập về nhà", "~~make homework~~", "**do** homework"],
        ["mắc lỗi", "~~do a mistake~~", "**make** a mistake"],
        ["đưa ra quyết định", "~~give a decision~~", "**make** / **take** a decision"],
        ["đường đông xe", "~~big traffic~~ / ~~many traffic~~", "**heavy** traffic"],
        ["nghỉ giải lao", "~~rest a break~~", "**take** / **have** a break"],
        ["cà phê đặc", "~~thick coffee~~", "**strong** coffee"],
        ["tích luỹ kinh nghiệm", "~~collect experience~~", "**gain** experience"],
        ["nâng cao nhận thức", "~~rise awareness~~ / ~~make awareness~~", "**raise** awareness"],
        ["đóng vai trò quan trọng", "~~take an important role~~", "**play** an important role"],
        ["rất đồng ý", "~~very agree~~", "**strongly** / **completely** agree"],
      ],
    },
    {
      t: "sodo",
      kind: "mindmap",
      title: "6 kiểu collocation",
      center: "**Collocation**",
      branches: [
        { label: "Động từ + danh từ", items: ["**make** a decision", "**do** research", "**take** a break"] },
        { label: "Tính từ + danh từ", items: ["**heavy** rain", "**high** price", "**strong** coffee"] },
        { label: "Danh từ + danh từ", items: ["traffic **jam**", "bus **stop**", "job **satisfaction**"] },
        { label: "Trạng từ + tính từ", items: ["**highly** effective", "**fully** aware", "**widely** used"] },
        { label: "Động từ + trạng từ", items: ["rise **sharply**", "**strongly** agree", "depend **heavily** on"] },
        { label: "Từ + giới từ", items: ["impact **on**", "reason **for**", "interested **in**"] },
      ],
    },
    {
      t: "note",
      title: "Mẹo: học collocation thế nào cho nhớ",
      items: [
        "Học **cả cụm**, không học từ đơn lẻ: ghi vào sổ “**make** a decision” chứ không ghi “decision = quyết định”.",
        "Mỗi từ mới, tra **từ điển collocation** (ví dụ Oxford Collocations Dictionary) hoặc xem câu ví dụ trong từ điển: động từ nào, tính từ nào hay đi cùng nó?",
        "Khi đọc bài IELTS, **gạch chân cặp từ** chứ không chỉ một từ: “a **sharp rise in** prices”, “**play a role in**”.",
        "Không chắc thì chọn cách **đơn giản mà đúng** (a big problem) hơn là cách “sang” mà sai (~~a heavy problem~~).",
      ],
    },
    {
      t: "rule",
      formula: "Học từ theo CỤM: động từ + danh từ · tính từ + danh từ · trạng từ + tính từ / động từ · từ + giới từ",
      vi: "Đừng dịch từng chữ từ tiếng Việt: “mưa to” = heavy rain, “làm lỗi” = make a mistake.",
    },
    {
      t: "quiz",
      id: "d11-colloc-dich",
      title: "Dịch nhanh — collocation cơ bản (4 câu)",
      kind: "translate",
      grammar: "heavy rain / heavy traffic · make a mistake / make a decision · do homework · strong coffee · take a break.",
      items: [
        { q: "Hôm qua trời mưa to.", hint: "There was / We had, heavy rain, yesterday", answers: ["There was heavy rain yesterday.", "We had heavy rain yesterday.", "It rained heavily yesterday.", "Yesterday there was heavy rain.", "There was a lot of heavy rain yesterday."] },
        { q: "Ai cũng mắc lỗi.", hint: "Everyone (số ít → makes), mistakes", answers: ["Everyone makes mistakes.", "Everybody makes mistakes."] },
        { q: "Tôi uống cà phê đặc mỗi sáng.", hint: "I drink, strong coffee, every morning", answers: ["I drink strong coffee every morning.", "I have strong coffee every morning.", "Every morning, I drink strong coffee.", "Every morning I drink strong coffee."] },
        { q: "Chúng ta nghỉ giải lao mười phút nhé.", hint: "Let's take / have, a ten-minute break", answers: ["Let's take a ten-minute break.", "Let's have a ten-minute break.", "Let's take a break for ten minutes.", "Let's have a break for ten minutes.", "Let us take a ten-minute break."] },
      ],
    },

    { t: "h", text: "2. Trật tự từ trong câu: S – V – O – cách thức – nơi chốn – thời gian" },
    {
      t: "p",
      text: "Tiếng Việt khá thoải mái về vị trí trạng ngữ, còn tiếng Anh có một **thứ tự mặc định** cho câu trần thuật. Thuộc khung này là tránh được rất nhiều câu “nghe là biết người Việt viết”.",
    },
    {
      t: "sodo",
      kind: "flow",
      title: "Thứ tự mặc định của câu tiếng Anh",
      steps: [
        { label: "S", sub: "Chủ ngữ — ai / cái gì" },
        { label: "V", sub: "Động từ" },
        { label: "O", sub: "Tân ngữ — ngay sau V, không chen gì vào" },
        { label: "Cách thức", sub: "how: carefully, by bus, well" },
        { label: "Nơi chốn", sub: "where: at the library, in Hanoi" },
        { label: "Thời gian", sub: "when: every evening, yesterday" },
      ],
      caption: "Mẹo nhớ: “làm GÌ → thế NÀO → ở ĐÂU → lúc NÀO”. Thời gian có thể đưa lên ĐẦU câu để nhấn mạnh (Every evening, I…).",
    },
    {
      t: "table",
      head: ["S", "V", "O", "Cách thức", "Nơi chốn", "Thời gian"],
      rows: [
        ["I", "review", "my notes", "carefully", "at the library", "every evening."],
        ["She", "speaks", "English", "very well", "—", "—"],
        ["We", "met", "our tutor", "—", "in her office", "yesterday."],
        ["My father", "goes", "—", "by motorbike", "to work", "every day."],
      ],
    },
    {
      t: "note",
      title: "Người Việt hay sai trật tự từ",
      items: [
        "Chen trạng từ vào giữa **V và O**: ~~I like very much football.~~ → **I like football very much.** / **I really like football.** · ~~She speaks very well English.~~ → **She speaks English very well.**",
        "Thời gian đứng trước nơi chốn: ~~I went yesterday to Hanoi.~~ → **I went to Hanoi yesterday.**",
        "Đảo trạng từ tần suất ra sau động từ (đã học Ngày 10): ~~I go usually…~~ → **I usually go…**",
        "Câu hỏi quên đảo trợ động từ: ~~Where you live?~~ → **Where do you live?** · ~~What time the class starts?~~ → **What time does the class start?**",
        "Tính từ đứng sau danh từ như tiếng Việt: ~~a bag black~~ → **a black bag** (xem mục 3).",
      ],
    },
    {
      t: "rule",
      formula: "S + V + O + cách thức + nơi chốn + thời gian  ·  (Thời gian), S + V + O…",
      vi: "Không bao giờ chen trạng từ giữa động từ và tân ngữ.",
    },
    {
      t: "quiz",
      id: "d11-trat-tu-dich",
      title: "Dịch nhanh — đúng trật tự từ (4 câu)",
      kind: "translate",
      grammar: "S + V + O + cách thức + nơi chốn + thời gian. Trạng từ (very much, very well) đứng SAU tân ngữ.",
      items: [
        { q: "Tôi rất thích bóng đá.", hint: "I like football very much / I really like football", answers: ["I like football very much.", "I really like football.", "I love football very much.", "I like football a lot.", "I really love football."] },
        { q: "Cô ấy nói tiếng Anh rất giỏi.", hint: "She speaks English very well (very well sau English)", answers: ["She speaks English very well.", "She speaks English really well.", "She speaks very good English."] },
        { q: "Chúng tôi gặp giáo viên hướng dẫn ở văn phòng của cô ấy hôm qua.", hint: "We met, our tutor, in her office, yesterday (nơi chốn → thời gian)", answers: ["We met our tutor in her office yesterday.", "Yesterday, we met our tutor in her office.", "Yesterday we met our tutor in her office.", "We met our supervisor in her office yesterday."] },
        { q: "Bố tôi đi làm bằng xe máy mỗi ngày.", hint: "My father, goes to work, by motorbike, every day", answers: ["My father goes to work by motorbike every day.", "My dad goes to work by motorbike every day.", "My father rides his motorbike to work every day.", "Every day, my father goes to work by motorbike.", "My father goes to work by motorcycle every day.", "My dad rides his motorbike to work every day."] },
      ],
    },

    { t: "h", text: "3. Cụm danh từ (noun phrase): xếp từ quanh danh từ chính" },
    {
      t: "p",
      text: "**Cụm danh từ** (noun phrase) là một danh từ chính (**head noun**) cùng mọi từ đi kèm nó. Viết được cụm danh từ dài mà đúng là kỹ năng then chốt của Writing: “**many young university students in Hanoi**” chứa nhiều thông tin hơn hẳn “students”. Hãy xem cụm danh từ lớn dần từng bước:",
    },
    {
      t: "sodo",
      kind: "flow",
      title: "Cụm danh từ lớn dần quanh “students”",
      steps: [
        { label: "students", sub: "danh từ chính (head)" },
        { label: "**university** students", sub: "+ danh từ bổ nghĩa (đứng ngay trước)" },
        { label: "**young** university students", sub: "+ tính từ" },
        { label: "**many** young university students", sub: "+ từ chỉ số lượng / hạn định" },
        { label: "…students **in Hanoi**", sub: "+ cụm giới từ phía sau" },
        { label: "…students in Hanoi **who live far from campus**", sub: "+ mệnh đề quan hệ phía sau" },
      ],
    },
    {
      t: "table",
      caption: "Khung cụm danh từ",
      head: ["Vị trí", "Loại từ", "Ví dụ"],
      rows: [
        ["1. Hạn định (determiner)", "a / an / the / my / this / these / some", "**the**…"],
        ["2. Số lượng", "two / many / a few / several / most", "the **two**…"],
        ["3. Tính từ", "theo thứ tự: ý kiến → kích cỡ → tuổi → màu → nguồn gốc → chất liệu", "the two **busy modern**…"],
        ["4. Danh từ bổ nghĩa", "danh từ dùng như tính từ, **số ít**", "the two busy modern **bus**…"],
        ["5. DANH TỪ CHÍNH", "head noun", "the two busy modern bus **stations**"],
        ["6. Phía sau", "cụm giới từ / mệnh đề quan hệ / V-ing / V3", "…stations **in the city centre** / **that opened last year**"],
      ],
    },
    {
      t: "table",
      caption: "Thứ tự tính từ — OSASCOMP (nhiều tính từ trước một danh từ; bảng bỏ cột Hình dạng – Shape – cho gọn)",
      head: ["Ý kiến", "Kích cỡ", "Tuổi", "Màu", "Nguồn gốc", "Chất liệu", "Mục đích / loại", "Danh từ"],
      rows: [
        ["lovely", "small", "old", "—", "—", "—", "—", "house"],
        ["—", "small", "—", "black", "—", "leather", "—", "bag"],
        ["delicious", "—", "—", "—", "Vietnamese", "—", "street", "food"],
        ["—", "large", "modern", "—", "—", "—", "sports", "centre"],
      ],
    },
    {
      t: "note",
      title: "Mẹo: tính từ tiếng Anh gần như NGƯỢC tiếng Việt",
      items: [
        "Tiếng Việt: “chiếc **túi**(1) **da**(2) **đen**(3) **nhỏ**(4)”. Tiếng Anh đọc **ngược**: “a **small**(4) **black**(3) **leather**(2) **bag**(1)”. Thử với “ngôi nhà cổ xinh xắn” → “a **lovely old** house”.",
        "OSASCOMP = **O**pinion (ý kiến) – **S**ize (cỡ) – **A**ge (tuổi) – **S**hape (hình) – **C**olour (màu) – **O**rigin (nguồn gốc) – **M**aterial (chất liệu) – **P**urpose (mục đích). Thực tế hiếm khi quá **2–3 tính từ** một lúc.",
        "Hai tính từ **cùng loại** thì có dấu phẩy hoặc **and**: a **cheap, reliable** phone; a **black and white** photo.",
      ],
    },
    {
      t: "patterns",
      rows: [
        {
          formula: "N1 (số ít) + N2  — danh từ đứng trước làm “tính từ”",
          vi: "Danh từ đứng trước KHÔNG thêm -s, kể cả khi nghĩa là số nhiều.",
          examples: [
            { en: "a shoe shop (không ~~shoes shop~~) · car parks · a bus station", vi: "cửa hàng giày · bãi đỗ xe · bến xe buýt" },
            { en: "It's a ten-minute walk from here. (không ~~ten-minutes~~)", vi: "Từ đây đi bộ mười phút." },
            { en: "She has a three-year-old son.", vi: "Cô ấy có một cậu con trai ba tuổi." },
          ],
        },
        {
          formula: "the + N + of + N  =  N + N",
          vi: "Hai cách viết cùng một ý — đổi qua lại để paraphrase trong Writing.",
          examples: [
            { en: "the price of houses = house prices", vi: "giá nhà" },
            { en: "the number of tourists = tourist numbers", vi: "số lượng du khách" },
          ],
        },
        {
          formula: "N + cụm giới từ / mệnh đề quan hệ / V-ing / V3",
          vi: "Thông tin dài đặt SAU danh từ chính.",
          examples: [
            { en: "students living in dormitories", vi: "sinh viên sống trong ký túc xá" },
            { en: "the money spent on advertising", vi: "số tiền chi cho quảng cáo" },
            { en: "people who work from home", vi: "những người làm việc tại nhà" },
          ],
        },
      ],
    },
    {
      t: "note",
      title: "Cẩn thận: vài ngoại lệ hay gặp",
      items: [
        "Một số cụm **giữ -s** vì đã cố định: **sports** centre, **clothes** shop, **sales** department, **arts** students, **savings** account.",
        "Số + danh từ + gạch nối làm tính từ thì **không -s**: a **five-year** plan, a **two-hour** exam. Nhưng khi đứng một mình thì có -s: The exam lasts **two hours**.",
        "**the number of + N số nhiều** đi với động từ **số ít** (The number of cars **is** rising) — khác **a number of + N số nhiều** (= nhiều) đi với động từ **số nhiều** (A number of cars **are** parked outside).",
      ],
    },
    {
      t: "rule",
      formula: "(the / my) + (số lượng) + (tính từ: ý kiến → cỡ → tuổi → màu → nguồn gốc → chất liệu) + (N bổ nghĩa, số ít) + N CHÍNH + (in… / who… / V-ing / V3)",
      vi: "Tính từ và danh từ bổ nghĩa đứng TRƯỚC; thông tin dài đứng SAU danh từ chính.",
    },
    {
      t: "quiz",
      id: "d11-cum-dt-dich",
      title: "Dịch nhanh — cụm danh từ (5 câu)",
      kind: "translate",
      grammar: "Tính từ trước danh từ (thứ tự ngược tiếng Việt) · N + N (N trước số ít) · số-N gạch nối không -s · N + who / V-ing / in… phía sau.",
      items: [
        { q: "Cô ấy mua một chiếc túi da đen nhỏ.", hint: "She bought, a small black leather bag (đọc ngược tiếng Việt)", answers: ["She bought a small black leather bag."] },
        { q: "Trường tôi cách nhà mười phút đi bộ.", hint: "My school is, a ten-minute walk (không -s), from my house / from home", answers: ["My school is a ten-minute walk from my house.", "My school is a ten-minute walk from home.", "My school is a ten-minute walk from my home."] },
        { q: "Giá nhà ở Hà Nội đang tăng.", hint: "House prices (N + N) in Hanoi, are rising", answers: ["House prices in Hanoi are rising.", "House prices in Hanoi are increasing.", "The price of houses in Hanoi is rising.", "The prices of houses in Hanoi are rising.", "House prices in Hanoi are going up.", "The price of houses in Hanoi is increasing."] },
        { q: "Nhiều sinh viên sống trong ký túc xá nấu ăn cùng nhau.", hint: "Many students, living in dormitories (V-ing sau danh từ), cook together", answers: ["Many students living in dormitories cook together.", "Many students who live in dormitories cook together.", "Many students living in dorms cook together.", "Many students who live in dorms cook together.", "Many students who live in the dormitories cook together.", "Many students living in the dormitories cook together."] },
        { q: "Có một trung tâm thể thao hiện đại lớn gần nhà tôi.", hint: "There is, a large modern sports centre (sports giữ -s), near my house", answers: ["There is a large modern sports centre near my house.", "There's a large modern sports centre near my house.", "There is a large modern sports center near my house.", "There's a large modern sports center near my house.", "There is a big modern sports centre near my house.", "There is a large modern sports centre near my home."] },
      ],
    },

    { t: "h", text: "4. Động từ + danh từ" },
    {
      t: "sodo",
      kind: "compare",
      title: "make hay do?",
      cols: [
        {
          title: "MAKE — tạo ra, quyết định, lời nói",
          anh: "hammer-and-wrench",
          items: [
            "a **decision** · a **choice** · a **plan**",
            "a **mistake** · an **effort** · **progress**",
            "**money** · a **profit** · **friends**",
            "a **complaint** · a **suggestion** · a **phone call** · **noise**",
          ],
        },
        {
          title: "DO — làm việc, nhiệm vụ, hoạt động",
          anh: "check-mark-button",
          items: [
            "**homework** · **housework** · the **shopping**",
            "**research** · **exercise** · a **course**",
            "**business** · a **job** · **your best**",
            "**damage** · **harm** · **good** (do more harm than good)",
          ],
        },
      ],
      caption: "Mẹo chung: MAKE = làm RA một thứ mới (quyết định, tiền, tiếng ồn); DO = thực hiện một VIỆC / hoạt động. Nhưng nhiều cụm chỉ có thể học thuộc.",
    },
    {
      t: "table",
      caption: "Các động từ “nhẹ” khác — collocation hay dùng trong IELTS",
      head: ["Động từ", "Đi với", "Ví dụ"],
      rows: [
        ["**take**", "a break · part in · action · responsibility for · a risk · notes · an exam", "The government should **take action** to reduce traffic."],
        ["**have**", "an impact / an effect on · a chance · a look · a rest · fun", "Social media **has a huge impact on** teenagers."],
        ["**pay**", "attention to · a visit · the bill · a compliment", "Students should **pay attention to** spelling."],
        ["**give**", "advice · a presentation · an example · permission", "Our tutor **gave** us some useful **advice**."],
        ["**keep**", "a promise · a diary · in touch · fit", "I **keep in touch** with my old classmates online."],
        ["**raise**", "awareness · money · a question · children", "The campaign **raised awareness** of plastic waste."],
        ["**reach**", "a conclusion · an agreement · a peak · a target", "Sales **reached a peak** in December."],
        ["**gain**", "experience · knowledge · popularity · weight", "Part-time jobs help students **gain experience**."],
        ["**meet**", "a need · a deadline · a target · a demand", "The new hospital will **meet the needs** of the area."],
        ["**play**", "a role in · a part in", "Parents **play a key role in** children's education."],
        ["**solve / tackle / address**", "a problem · an issue", "Cities must **tackle the problem** of air pollution."],
        ["**spend / save / waste**", "time · money · energy", "Online shopping **saves time**."],
      ],
    },
    {
      t: "note",
      title: "Người Việt hay sai với động từ + danh từ",
      items: [
        "~~do a mistake~~, ~~make homework~~, ~~make research~~ → **make** a mistake, **do** homework, **do** research.",
        "~~give a decision~~ → **make / take** a decision. “**give** a decision” chỉ dùng cho toà án, trọng tài.",
        "~~join part in~~ → **take part in** / **join** (không có “part”): **take part in** a competition = **join** a competition.",
        "~~pay attention on~~ → pay attention **to**. ~~have an impact to~~ → have an impact **on**.",
        "~~learn knowledge~~ → **gain / acquire** knowledge. ~~make a discussion~~ → **have / hold** a discussion.",
      ],
    },
    {
      t: "rule",
      formula: "make + decision / mistake / effort / progress / money · do + homework / research / exercise / damage · take + a break / part in / action · have + an impact on · pay + attention to",
      vi: "Học động từ CÙNG danh từ của nó — đây là nhóm collocation dùng nhiều nhất trong Task 2.",
    },
    {
      t: "quiz",
      id: "d11-dong-tu-dich",
      title: "Dịch nhanh — động từ + danh từ (5 câu)",
      kind: "translate",
      grammar: "make a decision / mistake / progress · do homework / research / exercise · take part in · have an impact on · gain experience.",
      items: [
        { q: "Bạn nên tự đưa ra quyết định.", hint: "You should, make (không give) your own decisions", answers: ["You should make your own decisions.", "You should make your own decision.", "You should make decisions yourself.", "You should make the decision yourself.", "You should take your own decisions."] },
        { q: "Em trai tôi làm bài tập về nhà sau bữa tối.", hint: "My younger brother, does (không makes) his homework, after dinner", answers: ["My younger brother does his homework after dinner.", "My little brother does his homework after dinner.", "My brother does his homework after dinner.", "My younger brother does homework after dinner.", "After dinner, my younger brother does his homework."] },
        { q: "Hơn 200 sinh viên đã tham gia cuộc thi.", hint: "More than 200 students, took part in, the competition", answers: ["More than 200 students took part in the competition.", "Over 200 students took part in the competition.", "More than 200 students joined the competition.", "Over 200 students joined the competition.", "More than two hundred students took part in the competition."] },
        { q: "Mạng xã hội có ảnh hưởng lớn đến giới trẻ.", hint: "Social media, has a big / huge impact on, young people", answers: ["Social media has a big impact on young people.", "Social media has a huge impact on young people.", "Social media has a great impact on young people.", "Social media has a big effect on young people.", "Social media has a strong impact on young people.", "Social media has a significant impact on young people.", "Social media has a major impact on young people.", "Social media has a large impact on young people."] },
        { q: "Công việc bán thời gian giúp sinh viên tích luỹ kinh nghiệm.", hint: "Part-time jobs, help students, gain experience", answers: ["Part-time jobs help students gain experience.", "Part-time jobs help students to gain experience.", "Part-time jobs help students gain work experience.", "A part-time job helps students gain experience.", "Part-time jobs help students get experience."] },
      ],
    },

    { t: "h", text: "5. Tính từ + danh từ" },
    {
      t: "table",
      head: ["Tính từ", "Đi với danh từ", "Lưu ý / không nói"],
      rows: [
        ["**heavy**", "rain · traffic · smoker · workload · snow", "~~strong rain~~, ~~big traffic~~"],
        ["**strong**", "wind · coffee · tea · accent · opinion · support", "~~heavy wind~~, ~~thick coffee~~"],
        ["**high / low**", "price · cost · level · rate · standard · income · salary · quality", "~~expensive price~~, ~~cheap salary~~"],
        ["**large / small**", "**number** of (đếm được) · **amount** of (không đếm được) · proportion · percentage", "~~a big amount of people~~ → a large **number** of people"],
        ["**major / minor**", "role · problem · change · reason", "trang trọng hơn big / small"],
        ["**serious**", "problem · illness · injury · damage · crime", "~~heavy problem~~"],
        ["**rapid / steady**", "growth · increase · decline · progress", "Task 1 & Task 2 đều dùng"],
        ["**sharp / significant / slight**", "rise · fall · increase · drop · difference", "dùng cho số liệu (xem bài Từ vựng)"],
        ["**fast / quick**", "**fast** food · a **fast** car · a **quick** meal · a **quick** shower", "~~quick food~~"],
      ],
    },
    {
      t: "sodo",
      kind: "compare",
      title: "Món đồ “đắt” hay cái giá “cao”?",
      cols: [
        {
          title: "Nói về MÓN ĐỒ / DỊCH VỤ",
          anh: "shopping-bags",
          items: [
            "an **expensive** phone",
            "a **cheap** flight",
            "Taxis in Hanoi are **expensive**.",
          ],
        },
        {
          title: "Nói về GIÁ / PHÍ / MỨC",
          anh: "money-bag",
          items: [
            "a **high** price (~~expensive price~~)",
            "a **low** cost / fee",
            "The **cost of living** is **high**.",
          ],
        },
      ],
      caption: "Price, cost, fee, salary, income, rate, level… đi với HIGH / LOW. Món đồ thì EXPENSIVE / CHEAP.",
    },
    {
      t: "rule",
      formula: "heavy + rain / traffic · strong + wind / coffee · high / low + price / level / rate · a large number of + N (đếm được) · a large amount of + N (không đếm được)",
      vi: "Giá, mức, tỉ lệ → high / low; số lượng → large / small number / amount (không dùng ~~big amount of people~~).",
    },
    {
      t: "quiz",
      id: "d11-tinh-tu-dich",
      title: "Dịch nhanh — tính từ + danh từ (4 câu)",
      kind: "translate",
      grammar: "heavy traffic · high price / high cost · a large number of + N số nhiều · a large amount of + N không đếm được · serious problem.",
      items: [
        { q: "Giờ cao điểm đường rất đông xe.", hint: "There is heavy traffic, at rush hour", answers: ["There is heavy traffic at rush hour.", "There's heavy traffic at rush hour.", "The traffic is heavy at rush hour.", "There is heavy traffic during rush hour.", "There is very heavy traffic at rush hour.", "Traffic is heavy at rush hour.", "At rush hour, there is heavy traffic."] },
        { q: "Giá nhà ở thành phố này rất cao.", hint: "House prices / The price of houses, in this city, are / is very high", answers: ["House prices in this city are very high.", "The price of houses in this city is very high.", "Housing prices in this city are very high.", "The prices of houses in this city are very high.", "House prices in this city are really high."] },
        { q: "Một số lượng lớn du khách đến Hội An mỗi năm.", hint: "A large number of tourists, visit / come to, Hoi An, every year", answers: ["A large number of tourists visit Hoi An every year.", "A large number of tourists come to Hoi An every year.", "A great number of tourists visit Hoi An every year.", "Every year, a large number of tourists visit Hoi An.", "A large number of tourists visit Hoi An each year.", "A large number of visitors come to Hoi An every year."] },
        { q: "Ô nhiễm không khí là một vấn đề nghiêm trọng.", hint: "Air pollution, is, a serious problem", answers: ["Air pollution is a serious problem.", "Air pollution is a serious issue.", "Air pollution is a major problem.", "Air pollution is a very serious problem."] },
      ],
    },

    { t: "h", text: "6. Trạng từ + tính từ · Động từ + trạng từ" },
    {
      t: "table",
      head: ["Trạng từ", "Đi với", "Ví dụ"],
      rows: [
        ["**highly**", "effective · successful · likely / unlikely · recommended", "This method is **highly effective**."],
        ["**deeply**", "worried · concerned · disappointed · moved", "Parents are **deeply concerned** about online safety."],
        ["**fully**", "aware · understand · recover", "Most people are **fully aware** of the risks of smoking."],
        ["**widely**", "used · available · believed · accepted", "English is **widely used** in business."],
        ["**completely / totally**", "different · wrong · agree · disagree", "City life is **completely different** from village life."],
        ["**strongly**", "agree · believe · recommend · oppose", "I **strongly believe** that education should be free."],
        ["(động từ) + **sharply / dramatically**", "rise · fall · increase · drop", "Prices **rose sharply** last year."],
        ["(động từ) + **heavily**", "depend on · rely on · rain", "Many families **depend heavily on** tourism."],
      ],
    },
    {
      t: "note",
      title: "Người Việt hay sai",
      items: [
        "~~I very agree.~~ → **I strongly agree.** / **I completely agree.** (very không đứng trước động từ).",
        "~~She works hardly.~~ → **She works hard.** — **hardly** nghĩa là **hầu như không** (She hardly works = cô ấy hầu như không làm gì!).",
        "~~highly cold~~, ~~deeply happy~~ → **extremely cold / bitterly cold**, **really happy / extremely happy**. highly và deeply chỉ đi với một số tính từ nhất định.",
        "~~rise very sharply~~ nghe thừa: **sharply** đã là “mạnh”. Muốn mạnh hơn dùng **dramatically**.",
      ],
    },
    {
      t: "rule",
      formula: "highly + effective / likely · fully + aware · widely + used · strongly + agree / believe · V + sharply / heavily",
      vi: "Trạng từ “nhấn mạnh” cũng có bạn đồng hành riêng — very không thay được tất cả.",
    },
    {
      t: "quiz",
      id: "d11-trang-tu-dich",
      title: "Dịch nhanh — trạng từ + tính từ / động từ (4 câu)",
      kind: "translate",
      grammar: "strongly agree / believe · widely used · highly effective · fully aware of.",
      items: [
        { q: "Tôi hoàn toàn đồng ý với ý kiến này.", hint: "I strongly / completely agree, with this opinion / view", answers: ["I strongly agree with this opinion.", "I completely agree with this opinion.", "I strongly agree with this view.", "I completely agree with this view.", "I totally agree with this opinion.", "I totally agree with this view.", "I fully agree with this opinion."] },
        { q: "Tiếng Anh được dùng rộng rãi trên thế giới.", hint: "English is widely used, around the world / in the world", answers: ["English is widely used around the world.", "English is widely used in the world.", "English is widely used all over the world.", "English is widely used throughout the world.", "English is widely spoken around the world.", "English is widely used worldwide."] },
        { q: "Phương pháp này rất hiệu quả.", hint: "This method, is highly effective", answers: ["This method is highly effective.", "This method is very effective.", "This method is extremely effective.", "This approach is highly effective."] },
        { q: "Hầu hết mọi người đều nhận thức rõ những rủi ro của việc hút thuốc.", hint: "Most people, are fully aware of, the risks of smoking", answers: ["Most people are fully aware of the risks of smoking.", "Most people are well aware of the risks of smoking.", "Most people are fully aware of the dangers of smoking.", "Most people are well aware of the dangers of smoking."] },
      ],
    },

    { t: "h", text: "7. Danh từ / tính từ + giới từ" },
    {
      t: "table",
      head: ["Cụm", "Nghĩa", "Ví dụ"],
      rows: [
        ["an increase / a rise / a fall **in** + N", "sự tăng / giảm **về** cái gì", "a rise **in** house prices"],
        ["an effect / an impact / an influence **on**", "ảnh hưởng **lên**", "the impact of phones **on** sleep"],
        ["a reason **for** · a demand **for** · a need **for**", "lý do / nhu cầu **cho**", "the main reason **for** this change"],
        ["a solution **to** · access **to** · an answer **to**", "giải pháp / sự tiếp cận / câu trả lời **cho**", "access **to** clean water"],
        ["an attitude **to / towards**", "thái độ **với**", "young people's attitude **towards** work"],
        ["interested **in** · good **at** · keen **on**", "thích / giỏi / say mê", "She is good **at** maths."],
        ["responsible **for** · famous **for** · aware **of** · afraid **of**", "chịu trách nhiệm / nổi tiếng / nhận thức / sợ", "Parents are responsible **for** their children's safety."],
        ["different **from** · similar **to** · related **to**", "khác / giống / liên quan", "Hanoi is different **from** Saigon."],
      ],
    },
    {
      t: "note",
      title: "Người Việt hay sai giới từ",
      items: [
        "~~effect to~~, ~~impact to~~ → effect **on**, impact **on**. Động từ **affect** thì **không** có giới từ: Phones **affect** sleep (~~affect to sleep~~).",
        "~~solution for~~ → solution **to** (a solution **to** the problem). ~~reason of~~ → reason **for**.",
        "~~increase of prices~~ → an increase **in** prices. Nhưng **an increase of 10%** (of + con số).",
        "~~good in English~~ → good **at** English. ~~interested about~~ → interested **in**.",
      ],
    },
    {
      t: "rule",
      formula: "a rise / fall / increase IN + N · an increase OF + số · impact / effect ON · reason / demand FOR · solution / access TO · good AT · interested IN · responsible FOR",
      vi: "Giới từ đi theo danh từ / tính từ — học cả cụm.",
    },
    {
      t: "quiz",
      id: "d11-gioi-tu-dich",
      title: "Dịch nhanh — đúng giới từ (4 câu)",
      kind: "translate",
      grammar: "a rise in + N · the impact of A on B · the main reason for + N · access to + N · good at + N / V-ing.",
      items: [
        { q: "Đã có một sự tăng giá nhà.", hint: "There has been / There was, a rise / an increase in, house prices", answers: ["There has been a rise in house prices.", "There has been an increase in house prices.", "There was a rise in house prices.", "There was an increase in house prices.", "There has been a rise in the price of houses."] },
        { q: "Điện thoại có ảnh hưởng đến giấc ngủ của chúng ta.", hint: "Phones have an effect / impact on, our sleep", answers: ["Phones have an effect on our sleep.", "Phones have an impact on our sleep.", "Mobile phones have an effect on our sleep.", "Mobile phones have an impact on our sleep.", "Phones affect our sleep.", "Smartphones have an effect on our sleep.", "Smartphones have an impact on our sleep."] },
        { q: "Lý do chính của sự thay đổi này là công nghệ.", hint: "The main reason for, this change, is technology", answers: ["The main reason for this change is technology.", "The main reason for the change is technology.", "Technology is the main reason for this change."] },
        { q: "Nhiều trẻ em ở nông thôn không được tiếp cận internet.", hint: "Many children, in rural areas / in the countryside, do not have access to, the internet", answers: ["Many children in rural areas do not have access to the internet.", "Many children in rural areas don't have access to the internet.", "Many children in the countryside do not have access to the internet.", "Many children in the countryside don't have access to the internet.", "Many children in rural areas have no access to the internet.", "Many children in the countryside have no access to the internet.", "Many children in rural areas do not have access to the Internet.", "Many children in rural areas don't have internet access."] },
      ],
    },

    { t: "h", text: "8. Ứng dụng: sửa một đoạn Task 2" },
    {
      t: "p",
      text: "Đoạn dưới đây có **5 lỗi collocation và trật tự từ** — loại lỗi khiến bài dừng ở band 5 dù ý không tệ. So sánh bản trước và sau khi sửa.",
    },
    {
      t: "examples",
      items: [
        { en: "~~Nowadays, many students do a lot of mistakes when they make their homework late at night, and this has a big effect to their results. They also learn very fast new words but forget them quickly.~~", vi: "Bản gốc (band 5): do mistakes · make homework · effect to · big effect · learn very fast new words." },
        { en: "Nowadays, many students make a lot of mistakes when they do their homework late at night, and this has a significant effect on their results. They also learn new words very quickly but forget them just as quickly.", vi: "Bản sửa: **make** mistakes · **do** homework · a **significant** effect **on** · learn **new words very quickly** (trạng từ sau tân ngữ)." },
      ],
    },
    {
      t: "mcq",
      id: "d11-nhanh",
      title: "Kiểm tra nhanh — collocation & trật tự từ (10 câu)",
      items: [
        { q: "Last night there was ___ rain in Hue.", options: ["heavy", "strong", "big"], correct: 0, why: "Mưa to = **heavy** rain. strong đi với **wind**, không đi với rain." },
        { q: "Everyone ___ mistakes when learning a language.", options: ["does", "takes", "makes"], correct: 2, why: "**make** a mistake — cụm cố định." },
        { q: "I usually ___ my homework before dinner.", options: ["make", "do", "have"], correct: 1, why: "**do** homework / housework / research." },
        { q: "The price of petrol is very ___.", options: ["high", "expensive", "big"], correct: 0, why: "Cái **giá** thì **high / low**; món đồ mới **expensive / cheap**." },
        { q: "Câu nào đúng trật tự?", options: ["I like very much reading.", "I like reading very much.", "I very like reading."], correct: 1, why: "Không chen trạng từ giữa động từ (like) và tân ngữ (reading): **I like reading very much.**" },
        { q: "Câu nào đúng?", options: ["We went yesterday to the museum.", "We yesterday went to the museum.", "We went to the museum yesterday."], correct: 2, why: "Nơi chốn (to the museum) đứng **trước** thời gian (yesterday)." },
        { q: "She bought a ___ dress.", options: ["beautiful red silk", "red beautiful silk", "silk beautiful red"], correct: 0, why: "Thứ tự tính từ: **ý kiến** (beautiful) → **màu** (red) → **chất liệu** (silk) → danh từ." },
        { q: "It is a ___ drive from the airport.", options: ["two-hours", "two-hour", "two hours'"], correct: 1, why: "Số + danh từ + gạch nối làm tính từ thì **không -s**: a **two-hour** drive. (two hours' drive cũng có người dùng nhưng không có \"a\" phía trước.)" },
        { q: "Technology has a huge impact ___ our daily lives.", options: ["to", "for", "on"], correct: 2, why: "impact / effect / influence **on**." },
        { q: "There was a sharp rise ___ the number of tourists.", options: ["in", "of", "on"], correct: 0, why: "a rise / increase / fall **in** + cái gì. (**of** chỉ đi với con số: a rise **of** 10%.)" },
      ],
    },
  ],
};

/* ─────────────────────────── Từ vựng ─────────────────────────── */

const D11_VOCAB: Lesson = {
  id: "d11-tu-vung",
  kind: "vocab",
  title: "Từ vựng: Biểu đồ theo thời gian 1 — tăng, giảm, dao động, ổn định",
  goal: "Nắm bộ từ tả xu hướng cho Writing Task 1 (biểu đồ đường, biểu đồ cột theo năm): động từ và danh từ chỉ tăng / giảm / dao động / ổn định / đỉnh / đáy, trạng từ – tính từ chỉ mức độ, giới từ by / to / from / of, và ba khung câu tả số liệu.",
  minutes: 55,
  blocks: [
    {
      t: "recap",
      title: "Bài này học gì",
      items: [
        "**4 nhóm xu hướng**: tăng (rise, increase, grow, climb, soar…) · giảm (fall, decrease, decline, drop, plummet…) · ổn định (remain stable, level off…) · dao động (fluctuate). Thêm: **đỉnh** (peak) và **đáy** (hit a low), **hồi phục** (recover), **vượt** (overtake).",
        "Động từ bất quy tắc phải thuộc: ==rise – rose – risen · fall – fell – fallen · grow – grew – grown==.",
        "Mức độ: **dramatically > sharply > significantly > moderately > gradually / steadily > slightly**.",
        "Giới từ: rise **by** 10 (lượng thay đổi) · rise **to** 60 (điểm đến) · **from** 40 **to** 83 · a rise **of** 10 · a rise **in** sales.",
        "3 khung câu: ==S + V + adv== · ==There was a + adj + N + in + S== · ==S + saw a + adj + N==.",
        "Có **2 biểu đồ** số liệu tự đặt để mọi ví dụ đều khớp từng con số; cuối bài luyện **phát âm trọng âm** các từ dài.",
      ],
    },
    {
      t: "p",
      text: "Ở **Ngày 4** bạn đã biết Writing Task 1 có 6 dạng, và hai dạng **theo thời gian** (line graph — biểu đồ đường, bar chart có trục năm — biểu đồ cột theo năm) chiếm phần lớn đề thi. Hôm nay là **bộ từ tả xu hướng** dùng chung cho cả hai. Ngày 12 bạn sẽ dùng bộ từ này để viết trọn một bài Task 1.",
    },
    {
      t: "figure",
      fig: {
        kind: "line",
        title: "Number of visitors to four attractions in one city, 2014–2024 (thousands)",
        note: "Số liệu tự đặt cho bài luyện.",
        unit: "thousands",
        categories: ["2014", "2016", "2018", "2020", "2022", "2024"],
        series: [
          { name: "Zoo", values: [40, 48, 57, 66, 74, 83] },
          { name: "Art museum", values: [80, 72, 61, 50, 42, 35] },
          { name: "Water park", values: [30, 52, 28, 50, 26, 47] },
          { name: "Botanic garden", values: [25, 26, 25, 25, 26, 25] },
        ],
      },
    },
    {
      t: "sodo",
      kind: "compare",
      title: "Bốn xu hướng trong biểu đồ trên",
      cols: [
        { title: "TĂNG — Zoo", anh: "chart-increasing", items: ["rose **steadily**", "40 → 83 (nghìn)", "**more than doubled**"] },
        { title: "GIẢM — Art museum", anh: "chart-decreasing", items: ["fell **steadily**", "80 → 35", "**more than halved**"] },
        { title: "DAO ĐỘNG — Water park", anh: "wavy-dash", items: ["**fluctuated**", "between 26 and 52", "lên – xuống liên tục"] },
        { title: "ỔN ĐỊNH — Botanic garden", anh: "left-right-arrow", items: ["**remained stable**", "at about 25", "gần như không đổi"] },
      ],
      caption: "Nhìn biểu đồ: đường đi lên → nhóm TĂNG; đi xuống → GIẢM; răng cưa → DAO ĐỘNG; gần như nằm ngang → ỔN ĐỊNH.",
    },

    { t: "h", text: "1. Động từ chỉ xu hướng" },
    {
      t: "p",
      text: "Bấm 🔊 để nghe. Mỗi ví dụ đều **đọc từ biểu đồ ở trên** (hoặc biểu đồ sân bay ở mục 2) — hãy dò lại con số trên hình. Để ý dòng **“Hay đi với”**: dạng quá khứ, giới từ, trạng từ thường đi kèm.",
    },
    {
      t: "vocab",
      items: [
        { w: "rise", pos: "v, n", ipa: "/raɪz/", vi: "tăng, đi lên; sự tăng", ex: "Visitor numbers at the zoo rose steadily from 40,000 in 2014 to 83,000 in 2024.", exVi: "Lượng khách đến sở thú tăng đều từ 40.000 năm 2014 lên 83.000 năm 2024.", more: "Bất quy tắc: **rise – rose – risen**. **rise** không có tân ngữ (~~rise the price~~ → **raise** the price). Danh từ: **a rise in** + N.", anh: "chart-increasing" },
        { w: "increase", pos: "v, n", ipa: "/ɪnˈkriːs/ (v) · /ˈɪnkriːs/ (n)", vi: "tăng; sự tăng", ex: "The number of visitors to the zoo increased by 43,000 over the period.", exVi: "Số khách đến sở thú tăng thêm 43.000 trong cả giai đoạn.", more: "Động từ nhấn âm **sau** (in-CREASE), danh từ nhấn âm **đầu** (IN-crease). **increase by** (thêm) / **increase to** (lên tới)." },
        { w: "grow", pos: "v", ipa: "/ɡrəʊ/", vi: "tăng trưởng, lớn lên", ex: "The zoo's visitor numbers grew every two years without exception.", exVi: "Lượng khách của sở thú tăng sau mỗi hai năm, không có ngoại lệ.", more: "Bất quy tắc: **grow – grew – grown**. Danh từ **growth** (không đếm được): **steady growth**." },
        { w: "climb", pos: "v", ipa: "/klaɪm/", vi: "tăng dần (như leo lên)", ex: "Passenger numbers climbed to 24 million in 2019.", exVi: "Số hành khách tăng dần lên 24 triệu vào năm 2019.", more: "Chữ **b** câm: /klaɪm/. Quá khứ **climbed** /klaɪmd/." },
        { w: "soar", pos: "v", ipa: "/sɔː(r)/", vi: "tăng vọt (rất mạnh, rất nhanh)", ex: "Ticket prices soared during the holiday season.", exVi: "Giá vé tăng vọt vào mùa lễ.", more: "Đồng nghĩa mạnh: **rocket, shoot up**. Không cần thêm trạng từ: ~~soared dramatically~~ (thừa)." },
        { w: "rocket", pos: "v", ipa: "/ˈrɒkɪt/", vi: "tăng vọt (như tên lửa)", ex: "Online sales rocketed in the first year of the app.", exVi: "Doanh số trực tuyến tăng vọt trong năm đầu của ứng dụng.", more: "Quá khứ **rocketed** (không gấp đôi t vì nhấn âm đầu). Hơi báo chí; trong Task 1 dùng 1 lần là đủ.", anh: "rocket" },
        { w: "double", pos: "v", ipa: "/ˈdʌbl/", vi: "tăng gấp đôi", ex: "Visitor numbers at the zoo more than doubled between 2014 and 2024.", exVi: "Lượng khách ở sở thú tăng hơn gấp đôi từ 2014 đến 2024.", more: "**triple** (gấp ba) · **quadruple** (gấp bốn) · **more than doubled** (hơn gấp đôi: 40 → 83)." },
        { w: "fall", pos: "v, n", ipa: "/fɔːl/", vi: "giảm, rơi; sự giảm", ex: "The number of visitors to the art museum fell from 80,000 to 35,000.", exVi: "Số khách đến bảo tàng mỹ thuật giảm từ 80.000 xuống 35.000.", more: "Bất quy tắc: **fall – fell – fallen**. Danh từ: **a fall in** + N.", anh: "chart-decreasing" },
        { w: "decrease", pos: "v, n", ipa: "/dɪˈkriːs/ (v) · /ˈdiːkriːs/ (n)", vi: "giảm; sự giảm", ex: "Visitor numbers at the art museum decreased by 45,000.", exVi: "Số khách ở bảo tàng mỹ thuật giảm 45.000.", more: "Giống increase: động từ nhấn **sau**, danh từ nhấn **đầu**." },
        { w: "decline", pos: "v, n", ipa: "/dɪˈklaɪn/", vi: "giảm dần, suy giảm; sự suy giảm", ex: "The museum saw a steady decline in visitors throughout the period.", exVi: "Bảo tàng chứng kiến lượng khách giảm đều suốt giai đoạn.", more: "Hay đi với: **a steady / gradual / sharp decline in**. Trang trọng hơn fall một chút." },
        { w: "drop", pos: "v, n", ipa: "/drɒp/", vi: "giảm (thường đột ngột); sự sụt giảm", ex: "Water park visitors dropped from 52,000 to 28,000 between 2016 and 2018.", exVi: "Khách công viên nước giảm từ 52.000 xuống 28.000 trong giai đoạn 2016–2018.", more: "Quá khứ **dropped** (gấp đôi p). Danh từ: **a sharp drop in** + N." },
        { w: "plummet", pos: "v", ipa: "/ˈplʌmɪt/", vi: "giảm mạnh, lao dốc", ex: "Passenger numbers plummeted from 24 million to just 5 million in 2020.", exVi: "Số hành khách lao dốc từ 24 triệu xuống chỉ còn 5 triệu năm 2020.", more: "Quá khứ **plummeted** (một t). Đồng nghĩa: **plunge, collapse**. Không thêm ~~dramatically~~ (đã đủ mạnh)." },
        { w: "halve", pos: "v", ipa: "/hɑːv/", vi: "giảm một nửa", ex: "The number of museum visitors more than halved over the ten years.", exVi: "Số khách bảo tàng giảm hơn một nửa trong mười năm.", more: "Chữ **l** câm. Danh từ **half** (một nửa). 80 → 35 là **more than halved** (giảm hơn một nửa)." },
        { w: "dip", pos: "v, n", ipa: "/dɪp/", vi: "giảm nhẹ, chững lại một chút; sự giảm nhẹ", ex: "Visitor numbers at the botanic garden dipped slightly from 26,000 to 25,000 in 2018.", exVi: "Lượng khách ở vườn bách thảo giảm nhẹ từ 26.000 xuống 25.000 vào năm 2018.", more: "Quá khứ **dipped**. Dùng cho giảm **nhỏ và ngắn**, sau đó thường tăng lại." },
        { w: "remain stable", pos: "phr", ipa: "/rɪˈmeɪn ˈsteɪbl/", vi: "giữ ổn định", ex: "Visitor numbers at the botanic garden remained stable at about 25,000.", exVi: "Lượng khách ở vườn bách thảo giữ ổn định ở khoảng 25.000.", more: "Đồng nghĩa: **remain steady / unchanged · stay the same · stay constant**. Đi với **at** + con số.", anh: "left-right-arrow" },
        { w: "level off", pos: "phr v", ipa: "/ˈlevl ˈɒf/", vi: "chững lại, đi ngang (sau một giai đoạn tăng/giảm)", ex: "Passenger numbers recovered to 22 million in 2023 and then levelled off.", exVi: "Số hành khách hồi phục lên 22 triệu năm 2023 rồi đi ngang.", more: "Anh viết **levelled**, Mỹ **leveled**. Gần nghĩa: **plateau** /ˈplætəʊ/, **stabilise**." },
        { w: "stabilise", pos: "v", ipa: "/ˈsteɪbəlaɪz/", vi: "ổn định lại", ex: "After the fall, prices stabilised at around $3.", exVi: "Sau đợt giảm, giá ổn định lại quanh mức 3 đô la.", more: "Mỹ viết **stabilize**. Tính từ **stable**, danh từ **stability**." },
        { w: "fluctuate", pos: "v", ipa: "/ˈflʌktʃueɪt/", vi: "dao động, lên xuống thất thường", ex: "Water park visitor numbers fluctuated between 26,000 and 52,000.", exVi: "Lượng khách công viên nước dao động trong khoảng 26.000 đến 52.000.", more: "**fluctuate between A and B** · **fluctuate around** + số · danh từ **fluctuation(s)**. Đừng nhầm với ~~fluctuate from A to B~~.", anh: "wavy-dash" },
        { w: "peak", pos: "v, n", ipa: "/piːk/", vi: "đạt đỉnh; đỉnh, điểm cao nhất", ex: "Passenger numbers peaked at 24 million in 2019.", exVi: "Số hành khách đạt đỉnh 24 triệu năm 2019.", more: "**peak at** + số · **reach a peak of** + số · **hit a high of** + số. Trái nghĩa: **hit a low of** / **reach a low of** (chạm đáy).", anh: "snow-capped-mountain" },
        { w: "hit a low", pos: "phr", ipa: "/hɪt ə ləʊ/", vi: "chạm đáy, xuống mức thấp nhất", ex: "The water park hit a low of 26,000 visitors in 2022.", exVi: "Công viên nước chạm đáy 26.000 khách vào năm 2022.", more: "Quá khứ **hit** (không đổi). Đồng nghĩa: **reach a low of · bottom out at · fall to a low of**." },
        { w: "recover", pos: "v", ipa: "/rɪˈkʌvə(r)/", vi: "hồi phục (tăng trở lại sau khi giảm)", ex: "Passenger numbers recovered gradually after 2020.", exVi: "Số hành khách hồi phục dần sau năm 2020.", more: "Danh từ **recovery**: **a gradual / strong recovery**. Đồng nghĩa: **rebound, pick up**." },
        { w: "overtake", pos: "v", ipa: "/ˌəʊvəˈteɪk/", vi: "vượt qua (đường này cắt lên trên đường kia)", ex: "By 2020, the zoo had overtaken the art museum as the most popular attraction.", exVi: "Đến năm 2020, sở thú đã vượt bảo tàng mỹ thuật để trở thành điểm tham quan đông khách nhất.", more: "Bất quy tắc: **overtake – overtook – overtaken**. Đồng nghĩa: **surpass, exceed**." },
      ],
    },
    {
      t: "hinh",
      title: "Từ xu hướng bằng hình — chạm để nghe",
      items: [
        { anh: "chart-increasing", w: "rise / increase", ro: "/raɪz/ · /ɪnˈkriːs/", vi: "tăng" },
        { anh: "chart-decreasing", w: "fall / decrease", ro: "/fɔːl/ · /dɪˈkriːs/", vi: "giảm" },
        { anh: "rocket", w: "rocket / soar", ro: "/ˈrɒkɪt/ · /sɔː/", vi: "tăng vọt" },
        { anh: "wavy-dash", w: "fluctuate", ro: "/ˈflʌktʃueɪt/", vi: "dao động" },
        { anh: "left-right-arrow", w: "remain stable", ro: "/rɪˈmeɪn ˈsteɪbl/", vi: "giữ ổn định" },
        { anh: "snow-capped-mountain", w: "peak", ro: "/piːk/", vi: "đạt đỉnh, đỉnh" },
        { anh: "bar-chart", w: "bar chart", ro: "/bɑː tʃɑːt/", vi: "biểu đồ cột" },
      ],
    },
    {
      t: "note",
      title: "Người Việt hay sai với động từ xu hướng",
      items: [
        "Sai dạng quá khứ: ~~rised~~, ~~falled~~, ~~growed~~ → **rose, fell, grew**. Số liệu quá khứ (năm 2014–2024) **phải** dùng quá khứ đơn.",
        "Nhầm **rise** (tự tăng, không tân ngữ) với **raise** (nâng cái gì lên, có tân ngữ): ~~The price raised.~~ → **The price rose.** · **The shop raised its prices.**",
        "Lặp **increase** năm lần trong một bài → mất điểm Lexical Resource. Xoay vòng: **rose → grew → climbed → saw an increase**.",
        "Gấp đôi phụ âm: **drop → dropped**, **dip → dipped** (một âm tiết). Nhưng **plummet → plummeted**, **rocket → rocketed** (trọng âm đầu, không gấp đôi).",
        "~~The number of visitors was increased.~~ → **The number of visitors increased.** Động từ xu hướng **không dùng bị động**.",
      ],
    },

    { t: "h", text: "2. Danh từ chỉ xu hướng — và giới từ đi kèm" },
    {
      t: "figure",
      fig: {
        kind: "line",
        title: "Passengers using one regional airport, 2016–2024 (millions)",
        note: "Số liệu tự đặt cho bài luyện.",
        unit: "millions",
        categories: ["2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024"],
        series: [{ name: "Passengers", values: [15, 18, 21, 24, 5, 8, 16, 22, 22] }],
      },
    },
    {
      t: "table",
      caption: "Động từ ↔ danh từ (tả cùng một thay đổi bằng hai cách)",
      head: ["Động từ", "Danh từ", "Ví dụ với danh từ (biểu đồ sân bay)"],
      rows: [
        ["rise / increase / grow", "a rise · an increase · growth (U)", "There was **a steady rise in** passenger numbers between 2016 and 2019."],
        ["fall / decrease / decline / drop", "a fall · a decrease · a decline · a drop", "2020 saw **a dramatic drop of** 19 million passengers."],
        ["peak", "a peak", "Passenger numbers **reached a peak of** 24 million in 2019."],
        ["recover", "a recovery", "There was **a strong recovery** between 2021 and 2023."],
        ["fluctuate", "a fluctuation", "The water park figures showed **considerable fluctuation**."],
        ["remain stable / level off", "stability (U)", "The final year showed **stability** at 22 million."],
      ],
    },
    {
      t: "sodo",
      kind: "compare",
      title: "by · to · from…to · of · at — năm giới từ quyết định con số",
      cols: [
        { title: "rise BY + lượng thay đổi", items: ["rose **by** 3 million a year", "(15 → 18 → 21 → 24)", "= tăng THÊM bao nhiêu"] },
        { title: "rise TO + điểm đến", items: ["recovered **to** 22 million", "= tăng LÊN TỚI mức nào"] },
        { title: "FROM… TO…", items: ["fell **from** 24 million **to** 5 million", "= từ mức này đến mức kia"] },
        { title: "a rise OF · peak AT · stand AT", items: ["a drop **of** 19 million (danh từ + of + số)", "peaked **at** 24 million", "stood **at** 15 million in 2016 (= ở mức)"] },
      ],
      caption: "Sai giới từ là sai SỐ LIỆU: “rose by 22 million” (tăng thêm 22 triệu) khác hẳn “rose to 22 million” (tăng lên mức 22 triệu).",
    },
    {
      t: "patterns",
      rows: [
        {
          formula: "S + V (rose / fell / fluctuated) + adv + (from X to Y / by Z)",
          vi: "Khung 1 — chủ ngữ là thứ thay đổi, động từ + trạng từ. Dễ nhất, dùng nhiều nhất.",
          examples: [
            { en: "Passenger numbers rose steadily from 15 million in 2016 to 24 million in 2019.", vi: "Số hành khách tăng đều từ 15 triệu năm 2016 lên 24 triệu năm 2019." },
          ],
        },
        {
          formula: "There + was + a / an + adj + N (rise / fall…) + in + S + (from X to Y)",
          vi: "Khung 2 — biến động thành danh từ, tính từ đứng trước danh từ.",
          examples: [
            { en: "There was a dramatic fall in the number of passengers in 2020.", vi: "Năm 2020 có một sự sụt giảm mạnh về số hành khách." },
          ],
        },
        {
          formula: "S (năm / nơi) + saw / experienced + a / an + adj + N + (of + số)",
          vi: "Khung 3 — chủ ngữ là năm hoặc địa điểm “chứng kiến” sự thay đổi.",
          examples: [
            { en: "2020 saw a sharp drop of 19 million passengers.", vi: "Năm 2020 chứng kiến số hành khách giảm mạnh 19 triệu." },
            { en: "The art museum experienced a steady decline in visitors.", vi: "Bảo tàng mỹ thuật có lượng khách giảm đều." },
          ],
        },
      ],
    },
    {
      t: "rule",
      formula: "S + rose / fell + adv + from X to Y · There was a + adj + rise / fall + in + S · S (năm) + saw a + adj + rise / drop + of + số",
      vi: "Ba khung câu xoay vòng để không lặp — động từ đi với TRẠNG từ, danh từ đi với TÍNH từ.",
    },
    {
      t: "quiz",
      id: "d11-tu-cau-dich",
      title: "Dịch sang tiếng Anh — tả số liệu theo 3 khung (5 câu)",
      kind: "translate",
      grammar: "Khung 1: S + rose / fell + adv + from X to Y · Khung 2: There was a + adj + N + in + S · Khung 3: S (năm) + saw a + adj + N + of + số · peak at + số · remain stable at + số.",
      items: [
        { q: "Số hành khách tăng đều từ 15 triệu lên 24 triệu.", hint: "Passenger numbers / The number of passengers, rose steadily, from 15 million to 24 million", answers: ["Passenger numbers rose steadily from 15 million to 24 million.", "The number of passengers rose steadily from 15 million to 24 million.", "Passenger numbers increased steadily from 15 million to 24 million.", "The number of passengers increased steadily from 15 million to 24 million.", "Passenger numbers grew steadily from 15 million to 24 million.", "The number of passengers grew steadily from 15 million to 24 million.", "Passenger numbers climbed steadily from 15 million to 24 million."] },
        { q: "Số hành khách đạt đỉnh 24 triệu vào năm 2019.", hint: "Passenger numbers, peaked at, 24 million, in 2019", answers: ["Passenger numbers peaked at 24 million in 2019.", "The number of passengers peaked at 24 million in 2019.", "Passenger numbers reached a peak of 24 million in 2019.", "The number of passengers reached a peak of 24 million in 2019.", "In 2019, passenger numbers peaked at 24 million.", "In 2019, the number of passengers peaked at 24 million."] },
        { q: "Năm 2020 có một sự sụt giảm mạnh về số hành khách.", hint: "There was, a dramatic / sharp fall / drop in, the number of passengers, in 2020", answers: ["There was a dramatic fall in the number of passengers in 2020.", "There was a sharp fall in the number of passengers in 2020.", "There was a dramatic drop in the number of passengers in 2020.", "There was a sharp drop in the number of passengers in 2020.", "In 2020, there was a dramatic fall in the number of passengers.", "In 2020, there was a sharp drop in the number of passengers.", "There was a dramatic decrease in the number of passengers in 2020.", "There was a sharp decrease in the number of passengers in 2020.", "In 2020, there was a dramatic drop in the number of passengers.", "In 2020, there was a sharp fall in the number of passengers."] },
        { q: "Năm 2020 chứng kiến mức giảm 19 triệu hành khách.", hint: "2020 saw, a drop / fall of, 19 million passengers", answers: ["2020 saw a drop of 19 million passengers.", "2020 saw a fall of 19 million passengers.", "2020 saw a decrease of 19 million passengers.", "2020 saw a sharp drop of 19 million passengers.", "2020 saw a dramatic drop of 19 million passengers.", "2020 saw a decline of 19 million passengers."] },
        { q: "Lượng khách ở vườn bách thảo giữ ổn định ở khoảng 25.000.", hint: "Visitor numbers at the botanic garden, remained stable, at about 25,000", answers: ["Visitor numbers at the botanic garden remained stable at about 25,000.", "Visitor numbers at the botanic garden remained stable at around 25,000.", "The number of visitors to the botanic garden remained stable at about 25,000.", "The number of visitors to the botanic garden remained stable at around 25,000.", "Visitor numbers at the botanic garden remained steady at about 25,000.", "Visitor numbers at the botanic garden stayed stable at about 25,000.", "The number of visitors at the botanic garden remained stable at about 25,000."] },
      ],
    },

    { t: "h", text: "3. Mức độ và tốc độ: trạng từ ↔ tính từ" },
    {
      t: "table",
      caption: "Từ mạnh nhất đến nhẹ nhất (trạng từ đi với động từ, tính từ đi với danh từ)",
      head: ["Trạng từ (+ V)", "Tính từ (+ N)", "Mức độ", "Ví dụ khớp biểu đồ"],
      rows: [
        ["dramatically", "dramatic", "rất lớn, gây sốc", "fell **dramatically** (24 → 5 triệu)"],
        ["sharply · steeply", "sharp · steep", "mạnh và nhanh (đường dốc)", "a **sharp** rise between 2021 and 2022 (8 → 16)"],
        ["significantly · considerably · substantially", "significant · considerable · substantial", "đáng kể", "The zoo grew **significantly** (40 → 83)"],
        ["moderately", "moderate", "vừa phải", "a **moderate** increase"],
        ["steadily", "steady", "đều đặn (mỗi kỳ một ít)", "rose **steadily** by 3 million a year"],
        ["gradually", "gradual", "từ từ, chậm", "a **gradual** decline"],
        ["slightly · marginally", "slight · marginal", "nhẹ, rất ít", "**slightly** (25 → 26)"],
        ["rapidly · quickly", "rapid · quick", "**tốc độ** nhanh", "**rapid** growth"],
      ],
    },
    {
      t: "sodo",
      kind: "mindmap",
      title: "Chọn từ theo độ dốc của đường",
      center: "Đường đi **dốc cỡ nào**?",
      branches: [
        { label: "Rất dốc", anh: "rocket", items: ["dramatically / dramatic", "sharply / sharp", "steeply / steep", "(động từ: soar, plummet)"] },
        { label: "Rõ rệt", anh: "chart-increasing", items: ["significantly / significant", "considerably / considerable", "substantially / substantial"] },
        { label: "Đều, thoai thoải", anh: "footprints", items: ["steadily / steady", "gradually / gradual", "moderately / moderate"] },
        { label: "Rất nhẹ", anh: "pinching-hand", items: ["slightly / slight", "marginally / marginal", "(động từ: dip, edge up)"] },
      ],
    },
    {
      t: "note",
      title: "Cẩn thận: chính tả và cách dùng",
      items: [
        "Chính tả trạng từ: dramatic → **dramatically** (~~dramaticly~~) · steady → **steadily** (y → i) · gradual → **gradually** (hai l) · significant → **significantly**.",
        "**Động từ + TRẠNG từ** (rose sharply) — **tính từ + DANH từ** (a sharp rise). ~~a sharply rise~~, ~~rose sharp~~ đều sai.",
        "Đừng chồng mức độ: ~~rose very dramatically~~, ~~soared sharply~~, ~~plummeted significantly~~ — động từ mạnh không cần trạng từ mạnh.",
        "**dramatic** trong Task 1 = **rất lớn**, không phải “kịch tính”. Chỉ dùng cho thay đổi thật sự lớn (như 24 → 5), đừng dùng cho 25 → 26.",
      ],
    },

    { t: "h", text: "4. Thời gian và số xấp xỉ" },
    {
      t: "table",
      head: ["Cụm", "Nghĩa", "Ví dụ"],
      rows: [
        ["from 2016 to 2024 · between 2016 and 2024", "từ… đến…", "**Between** 2016 **and** 2019, numbers rose steadily."],
        ["over the period · over the nine-year period · throughout the period", "trong cả giai đoạn", "The zoo grew **throughout the period**."],
        ["in the following year · over the next two years", "năm sau đó · hai năm tiếp theo", "Numbers plummeted in 2020 but recovered **over the next three years**."],
        ["by 2023", "**đến** năm 2023 (thì đã…)", "**By 2023**, the figure had recovered to 22 million."],
        ["thereafter · after that · afterwards", "sau đó", "It peaked in 2019 and fell sharply **thereafter**."],
        ["at the beginning / end of the period", "đầu / cuối giai đoạn", "**At the end of the period**, the zoo had 83,000 visitors."],
        ["about · around · approximately · roughly", "khoảng", "**around** 25,000"],
        ["just over · just under · nearly · almost", "hơi hơn · hơi dưới · gần", "**just over** 80,000 (83,000) · **nearly** 25 million (24 million)"],
      ],
    },
    {
      t: "rule",
      formula: "Between X and Y, S + V-ed + adv · S + V-ed + to + số + by + năm · S + peaked in + năm and fell + adv + thereafter",
      vi: "Cụm thời gian đầu câu hoặc cuối câu; số xấp xỉ: about / around / just over / nearly + số.",
    },
    {
      t: "mcq",
      id: "d11-tu-chon",
      title: "Đọc biểu đồ — chọn câu ĐÚNG số liệu (6 câu)",
      items: [
        { q: "Biểu đồ khách tham quan: câu nào đúng về **Zoo**?", options: ["Visitor numbers rose by 83,000.", "Visitor numbers rose of 83,000.", "Visitor numbers rose to 83,000."], correct: 2, why: "Zoo đi từ 40 lên **83** (nghìn) → tăng **lên tới** 83.000 = **rose to**. Tăng **thêm** chỉ 43.000 (rose by 43,000)." },
        { q: "Câu nào tả đúng **Water park**?", options: ["It fluctuated between 26,000 and 52,000.", "It remained stable at around 30,000.", "It rose steadily to 47,000."], correct: 0, why: "Đường răng cưa 30 → 52 → 28 → 50 → 26 → 47: **dao động** trong khoảng 26.000 – 52.000." },
        { q: "Năm nào Zoo **vượt** Art museum?", options: ["Between 2016 and 2018", "Between 2018 and 2020", "Between 2022 and 2024"], correct: 1, why: "2018: Zoo 57 < Museum 61. 2020: Zoo 66 > Museum 50. Vậy Zoo **overtook** Museum **giữa 2018 và 2020**." },
        { q: "Biểu đồ sân bay: câu nào đúng?", options: ["Passenger numbers peaked at 24 million in 2019.", "Passenger numbers peaked at 22 million in 2024.", "Passenger numbers hit a low of 8 million in 2021."], correct: 0, why: "Điểm cao nhất là **24** (2019). Điểm thấp nhất là **5** (2020), không phải 8." },
        { q: "Từ 2023 đến 2024, số hành khách…", options: ["rose slightly", "levelled off at 22 million", "plummeted"], correct: 1, why: "2023 = 22, 2024 = 22 → **không đổi** sau khi hồi phục = **levelled off** (đi ngang)." },
        { q: "Chọn câu đúng ngữ pháp:", options: ["There was a sharply rise in passengers.", "Passengers rose sharp in 2022.", "There was a sharp rise in passenger numbers in 2022."], correct: 2, why: "**Tính từ + danh từ** (a sharp rise) hoặc **động từ + trạng từ** (rose sharply). Hai câu kia trộn sai." },
      ],
    },
    {
      t: "quiz",
      id: "d11-tu-dien",
      title: "Điền một từ — tả biểu đồ sân bay (8 câu)",
      kind: "fill",
      items: [
        { q: "(1) In 2016, the airport handled 15 million passengers. Over the next three years, this figure ___ (tăng, quá khứ) steadily.", answers: ["rose", "increased", "grew", "climbed"] },
        { q: "(2) Passenger numbers rose ___ 3 million every year between 2016 and 2019.", answers: ["by"] },
        { q: "(3) The figure peaked ___ 24 million in 2019.", answers: ["at"] },
        { q: "(4) In 2020, the number of passengers ___ (lao dốc) to just 5 million.", answers: ["plummeted", "plunged", "fell", "dropped", "collapsed"] },
        { q: "(5) There was a dramatic fall ___ passenger numbers in 2020.", answers: ["in"] },
        { q: "(6) After 2020, the airport made a strong ___ (sự hồi phục).", answers: ["recovery"] },
        { q: "(7) By 2023, the figure had recovered ___ 22 million.", answers: ["to"] },
        { q: "(8) In the final year, passenger numbers remained ___ at 22 million.", answers: ["stable", "steady", "unchanged", "constant"] },
      ],
    },

    { t: "h", text: "Thêm: Luyện phát âm — trọng âm từ tả xu hướng" },
    {
      t: "p",
      text: "Từ tả xu hướng hầu hết **dài 3–5 âm tiết**, và người Việt hay đọc **đều đều mọi âm** (“đờ-ra-ma-tích-cơ-li”). Tiếng Anh thì **một âm tiết được nhấn mạnh** (to, dài, cao hơn), các âm khác đọc lướt, nhiều âm chỉ còn /ə/. Cột gợi ý viết HOA âm tiết được nhấn.",
    },
    {
      t: "phatam",
      id: "d11-phat-am",
      title: "Luyện phát âm — trọng âm & dạng quá khứ",
      note: "Bấm “Nghe mẫu”, rồi “Đọc & chấm”. Nhấn mạnh đúng âm tiết viết HOA ở dòng gợi ý; các âm còn lại đọc lướt, nhẹ. Dạng quá khứ: rose /rəʊz/ (không đọc “rốt”), grew /ɡruː/.",
      items: [
        { text: "dramatically, significantly, considerably", ipa: "drəmætɪkli sɪɡnɪfɪkəntli kənsɪdərəbli", vi: "dra-MA-ti-cally · sig-NI-fi-cant-ly · con-SI-de-ra-bly" },
        { text: "gradually, steadily, slightly", ipa: "ɡrædʒuəli stedɪli slaɪtli", vi: "GRA-du-al-ly · STEA-di-ly · SLIGHT-ly" },
        { text: "fluctuate, stabilise, approximately", ipa: "flʌktʃueɪt steɪbəlaɪz əprɒksɪmətli", vi: "FLUC-tu-ate · STA-bi-lise · ap-PROX-i-mate-ly" },
        { text: "rose, fell, grew, peaked", ipa: "rəʊz fel ɡruː piːkt", vi: "quá khứ: /z/ trong rose · /t/ trong peaked" },
        { text: "Passenger numbers rose steadily.", ipa: "pæsɪndʒə nʌmbəz rəʊz stedɪli", vi: "PAS-sen-ger · NUM-bers" },
        { text: "There was a significant drop in sales.", ipa: "ðeə wəz ə sɪɡnɪfɪkənt drɒp ɪn seɪlz", vi: "was, a đọc yếu /wəz ə/" },
        { text: "The figure peaked at twenty-four million.", ipa: "ðə fɪɡə piːkt ət twentifɔː mɪljən", vi: "peaked at nối âm: /piːk tət/" },
      ],
    },
  ],
};

/* ─────────────────────────── Nghe ─────────────────────────── */

const D11_LISTENING: Lesson = {
  id: "d11-nghe",
  kind: "listening",
  title: "Nghe: Listening Part 3 — hội thoại học thuật",
  goal: "Hiểu dạng Part 3 (2–3 người thảo luận việc học), nghe ra tín hiệu đồng ý / phản đối / đổi ý, và làm đủ 3 dạng câu hỏi hay gặp: trắc nghiệm, nối người với ý kiến, điền ghi chú.",
  minutes: 50,
  blocks: [
    {
      t: "recap",
      title: "Bài này học gì",
      items: [
        "**Part 3** = câu **21–30**: **2–4 người** (thường 2 sinh viên + 1 giảng viên) bàn về **bài tập, dự án, thuyết trình, khảo sát**.",
        "Khó nhất ở Part 3: người nói **nêu ý → bị phản bác → đổi ý**. Đáp án là ý ==được chốt cuối cùng==, không phải ý nghe thấy đầu tiên.",
        "Nghe **tín hiệu**: đồng ý (That's a good point · Exactly) · phản đối (I'm not sure about that · Actually…) · đổi ý (On second thoughts…).",
        "Nhân vật **gọi tên nhau** (Lucy, Tom, Dr Patel) — dùng tên để biết **ai nói ý nào** (giống Matching Features của Ngày 10).",
        "Luyện: **Practice 1** (5 đoạn ngắn — đồng ý hay phản đối?) và **Practice 2** (một bài Part 3 trọn vẹn, câu 21–30).",
      ],
    },
    { t: "h", text: "1. Part 3 trông như thế nào?" },
    {
      t: "table",
      head: ["Phần", "Số người", "Bối cảnh", "Độ khó"],
      rows: [
        ["Part 1 (câu 1–10)", "2", "Đời sống: đặt phòng, đăng ký khoá học", "Dễ nhất — điền thông tin"],
        ["Part 2 (câu 11–20)", "1", "Đời sống: giới thiệu một nơi, một sự kiện", "Vừa"],
        ["**Part 3 (câu 21–30)**", "**2–4**", "**Học thuật**: sinh viên bàn bài tập với nhau hoặc với giảng viên", "**Khó** — nhiều người, nhiều ý kiến, hay đổi ý"],
        ["Part 4 (câu 31–40)", "1", "Học thuật: một bài giảng", "Khó nhất — từ vựng chuyên ngành"],
      ],
    },
    {
      t: "table",
      caption: "Các dạng câu hỏi hay gặp ở Part 3",
      head: ["Dạng", "Trông thế nào", "Mẹo"],
      rows: [
        ["**Multiple choice** (trắc nghiệm)", "Câu hỏi + 3 lựa chọn A, B, C", "Cả 3 lựa chọn thường **đều được nhắc tới**; chỉ một cái **đúng với câu hỏi**."],
        ["**Matching** (nối)", "Nối mỗi ý / đề xuất với **người nói** hoặc với một ý kiến", "Ghi tắt tên nhân vật (L / T / P) bên cạnh mỗi ý khi nghe."],
        ["**Note / sentence completion** (điền)", "Điền 1–2 từ vào ghi chú", "Như Part 1, nhưng từ **học thuật** hơn: limitation, results, method."],
        ["Flow-chart / diagram", "Các bước của một dự án", "Đi theo **thứ tự** lời nói (như Ngày 6)."],
      ],
    },
    {
      t: "sodo",
      kind: "flow",
      title: "Cách nghe Part 3",
      steps: [
        { label: "Đọc câu hỏi trong thời gian cho phép", sub: "Gạch từ khoá; ghi chú tên người nói" },
        { label: "Nghe lời dẫn", sub: "Ai nói chuyện với ai, về việc gì?" },
        { label: "Bám theo tên", sub: "“Tom, what do you think?” → câu sau là ý của Tom" },
        { label: "Nghe tín hiệu", sub: "đồng ý · phản đối · đổi ý — đáp án hay nằm SAU tín hiệu" },
        { label: "Chốt ý cuối cùng", sub: "Ý bị bác bỏ ≠ đáp án" },
      ],
    },
    {
      t: "table",
      caption: "Cụm tín hiệu trong thảo luận",
      head: ["Chức năng", "Cụm hay nghe", "Nghĩa"],
      rows: [
        ["**Đồng ý**", "Exactly. · That's a good point. · Fair point. · I agree with Tom there. · That makes sense.", "Ý vừa nói được **chấp nhận**."],
        ["**Đồng ý một phần**", "That's true to some extent, but… · Yes, but… · Not exactly.", "Chấp nhận **một phần**, rồi bổ sung / sửa."],
        ["**Phản đối (lịch sự)**", "I'm not sure about that. · Actually, … · I'm afraid I disagree. · Hmm, …", "Ý vừa nói **bị bác** — chuẩn bị nghe ý mới."],
        ["**Đổi ý**", "On second thoughts, … · At first I thought…, but… · Actually, you're right.", "Người nói **bỏ ý cũ** — đáp án là ý **mới**."],
        ["**Đề xuất**", "Why don't we…? · I was thinking of… · I'd suggest + V-ing… · What about + V-ing…?", "Một **ý tưởng** được đưa ra — hay ra câu Matching “Who suggested…?”"],
      ],
    },
    {
      t: "note",
      title: "Người Việt hay sai ở Part 3",
      items: [
        "Chọn ngay lựa chọn **nghe thấy đầu tiên**. Ở Part 3, ý đầu tiên thường **bị phản bác**: “I was thinking of a pie chart.” — “Hmm, a pie chart shows proportions…” → **không phải** pie chart.",
        "Không theo kịp **ai đang nói**: ba giọng khác nhau, nhưng nếu không bám **tên** thì rất dễ gán ý của Tom cho Lucy.",
        "Bỏ qua **Actually** — đây là từ báo hiệu **sửa lại / phản bác** quan trọng nhất của tiếng Anh nói, không phải “thật ra là” đơn thuần.",
        "Nghe “**I agree with Tom**” mà quên rằng người nói đang đồng ý với **ý của Tom ở câu trước**, không phải với người vừa nói.",
      ],
    },
    {
      t: "rule",
      formula: "Tín hiệu → ý sau đó mới tính: Exactly / Fair point (giữ) · Actually / I'm not sure about that (bỏ) · On second thoughts (đổi) · Why don't we / I'd suggest (đề xuất)",
      vi: "Ở Part 3 luôn chờ ý được CHỐT CUỐI CÙNG rồi mới ghi đáp án.",
    },
    {
      t: "quiz",
      id: "d11-nghe-dich",
      title: "Dịch sang tiếng Anh — cụm thảo luận (4 câu)",
      kind: "translate",
      grammar: "That's a good point. · I'm not sure about that. · Why don't we + V? · I agree with + người + there. · On second thoughts, + S + V.",
      items: [
        { q: "Ý hay đấy, nhưng chúng ta không có đủ thời gian.", hint: "That's a good point / idea, but, we don't have enough time", answers: ["That's a good point, but we don't have enough time.", "That's a good idea, but we don't have enough time.", "That's a good point but we don't have enough time.", "That is a good point, but we do not have enough time.", "That's a good idea but we don't have enough time.", "Good point, but we don't have enough time."] },
        { q: "Sao chúng ta không dùng biểu đồ đường?", hint: "Why don't we, use, a line graph", answers: ["Why don't we use a line graph?", "Why do not we use a line graph?", "Why don't we use a line chart?"] },
        { q: "Tôi đồng ý với Tom ở điểm đó.", hint: "I agree with Tom there / on that", answers: ["I agree with Tom there.", "I agree with Tom on that.", "I agree with Tom on that point.", "I agree with Tom about that."] },
        { q: "Nghĩ lại thì tôi nghĩ bạn đúng.", hint: "On second thoughts, I think, you're right", answers: ["On second thoughts, I think you're right.", "On second thoughts, I think you are right.", "On second thought, I think you're right.", "On second thought, I think you are right.", "On second thoughts I think you're right."] },
      ],
    },

    { t: "h", text: "2. Practice 1 — đồng ý, phản đối hay đồng ý một phần?" },
    {
      t: "canh",
      anh: ["woman-student", "man-student", "speech-balloon"],
      caption: "Hai sinh viên đang chuẩn bị bài thuyết trình nhóm. Mỗi đoạn ngắn: người thứ nhất **đưa ý**, người thứ hai **phản hồi**. Bạn đoán người thứ hai **đồng ý, phản đối hay đồng ý một phần**.",
    },
    {
      t: "listen",
      id: "d11-nghe-tin-hieu",
      title: "Agree, disagree or partly agree?",
      dan: { so: "Day 11, Practice 1", boiCanh: "five short conversations between students who are preparing a group presentation.", cau: [1, 5] },
      note: "Khoảng 1 phút. Mỗi đoạn có số thứ tự. Nghe kỹ câu của NGƯỜI THỨ HAI.",
      lines: [
        { who: "Narrator", voice: "dan", text: "Number one." },
        { who: "Anna", voice: "us-nu", text: "Ben, I think we should start with a short video to get everyone's attention.", vi: "Ben, mình nghĩ nên mở đầu bằng một video ngắn để thu hút sự chú ý của mọi người." },
        { who: "Ben", voice: "us-nam", text: "Yes, that makes sense, Anna. Let's look for one tonight.", vi: "Ừ, hợp lý đấy Anna. Tối nay mình tìm một cái nhé." },
        { who: "Narrator", voice: "dan", text: "Number two." },
        { who: "Ben", voice: "us-nam", text: "Let's put all the numbers in one big table.", vi: "Mình cho hết số liệu vào một bảng lớn đi." },
        { who: "Anna", voice: "us-nu", text: "I'm not sure about that, Ben. Nobody will be able to read it from the back of the room.", vi: "Mình không chắc đâu Ben. Ngồi cuối phòng chẳng ai đọc được." },
        { who: "Narrator", voice: "dan", text: "Number three." },
        { who: "Sophie", voice: "uk-nu", text: "Our survey was too short, Jack.", vi: "Khảo sát của tụi mình ngắn quá, Jack." },
        { who: "Jack", voice: "uk-nam", text: "That's true to some extent, Sophie, but because it was short, more people finished it.", vi: "Đúng phần nào đó Sophie à, nhưng vì nó ngắn nên nhiều người làm hết hơn." },
        { who: "Narrator", voice: "dan", text: "Number four." },
        { who: "Jack", voice: "uk-nam", text: "Sophie, we should interview a couple of teachers as well.", vi: "Sophie, tụi mình nên phỏng vấn thêm vài thầy cô nữa." },
        { who: "Sophie", voice: "uk-nu", text: "Hmm, at first I thought that was unnecessary. But actually, you're right. They'd give us a completely different point of view.", vi: "Hừm, lúc đầu mình nghĩ không cần. Nhưng thật ra cậu nói đúng. Họ sẽ cho tụi mình một góc nhìn hoàn toàn khác." },
        { who: "Narrator", voice: "dan", text: "Number five." },
        { who: "Anna", voice: "us-nu", text: "Why don't we put a photo on every slide, Ben?", vi: "Sao tụi mình không để một tấm ảnh trên mỗi slide hả Ben?" },
        { who: "Ben", voice: "us-nam", text: "It's a nice idea in theory, Anna, but we simply don't have time to find them all. Let's keep the slides simple.", vi: "Về lý thuyết thì ý hay đấy Anna, nhưng tụi mình đơn giản là không đủ thời gian tìm hết. Cứ để slide đơn giản thôi." },
      ],
    },
    {
      t: "mcq",
      id: "d11-nghe-tin-hieu-chon",
      title: "Practice 1 — người thứ hai đồng ý hay không? (5 câu)",
      items: [
        { q: "(1) Ben's response to Anna's idea of a short video:", options: ["agrees", "disagrees", "partly agrees"], correct: 0, why: "“Yes, **that makes sense**… Let's look for one tonight.” — đồng ý và còn hành động ngay." },
        { q: "(2) Anna's response to Ben's idea of one big table:", options: ["agrees", "disagrees", "partly agrees"], correct: 1, why: "“**I'm not sure about that**” là cách **phản đối lịch sự**, kèm lý do (không ai đọc được)." },
        { q: "(3) Jack's response to Sophie's comment that the survey was too short:", options: ["agrees", "disagrees", "partly agrees"], correct: 2, why: "“That's **true to some extent**, **but**…” = đồng ý **một phần**, rồi chỉ ra mặt tốt." },
        { q: "(4) Sophie's final opinion about interviewing teachers:", options: ["agrees", "disagrees", "partly agrees"], correct: 0, why: "Bẫy **đổi ý**: “at first I thought that was unnecessary. **But actually, you're right**.” Ý chốt cuối cùng là **đồng ý**." },
        { q: "(5) Ben's response to Anna's idea of a photo on every slide:", options: ["agrees", "disagrees", "partly agrees"], correct: 1, why: "“a nice idea **in theory**, **but**… we simply don't have time… Let's keep the slides simple.” Khen xã giao nhưng **bác bỏ** — cuối cùng không làm. “in theory” (về lý thuyết) gần như luôn báo hiệu **không đồng ý trên thực tế**." },
      ],
    },

    { t: "h", text: "3. Practice 2 — một bài Part 3 trọn vẹn (câu 21–30)" },
    {
      t: "canh",
      anh: ["woman-student", "man-student", "man-teacher", "person-in-bed"],
      caption: "Hai sinh viên năm nhất, **Lucy** và **Tom**, gặp giảng viên hướng dẫn **Dr Patel** để báo cáo một **khảo sát về giấc ngủ của sinh viên** trong mùa thi. Họ bàn kết quả (dùng từ vựng xu hướng hôm nay: stable, fell sharply, recovered…) và cách trình bày bằng biểu đồ.",
    },
    {
      t: "p",
      text: "Đọc trước **cả 10 câu hỏi** ở ba khối bên dưới (khoảng 1 phút), gạch từ khoá, rồi mới bấm Nghe. Câu 25–27 là dạng **nối người với đề xuất** — ghi tắt **L / T / P** khi nghe.",
    },
    {
      t: "listen",
      id: "d11-nghe-bai",
      title: "A survey on students' sleep",
      dan: { so: "Day 11, Practice 2 (Listening Part 3)", boiCanh: "a conversation between two students, Lucy and Tom, and their tutor, Dr Patel, about a survey on students' sleep.", cau: [21, 30] },
      note: "Khoảng 3 phút, ba giọng: Lucy (Anh, nữ), Tom (Anh, nam), Dr Patel (Mỹ, nam). Nghe tối đa 2 lần; chưa mở lời thoại cho tới khi làm xong cả 10 câu.",
      lines: [
        { who: "Dr Patel", voice: "us-nam", text: "Come in, Lucy, Tom. Have a seat. So, how is the sleep survey going?", vi: "Mời vào, Lucy, Tom. Ngồi đi. Khảo sát giấc ngủ đến đâu rồi?" },
        { who: "Lucy", voice: "uk-nu", text: "Quite well, thanks, Dr Patel. We sent the questionnaire to all the first-year students, and we got two hundred and fourteen replies, which is more than we expected.", vi: "Khá ổn ạ, cảm ơn thầy Patel. Bọn em gửi bảng hỏi cho toàn bộ sinh viên năm nhất và nhận được 214 phản hồi, nhiều hơn bọn em nghĩ." },
        { who: "Tom", voice: "uk-nam", text: "Although, to be honest, most of them came from students in the science departments. We didn't get many from the arts students.", vi: "Có điều, thật lòng mà nói, phần lớn là từ sinh viên các khoa tự nhiên. Bọn em nhận được ít phản hồi từ sinh viên khối nghệ thuật." },
        { who: "Dr Patel", voice: "us-nam", text: "That's quite common. Did you think about why, Tom?", vi: "Chuyện đó khá thường gặp. Em có nghĩ vì sao không, Tom?" },
        { who: "Tom", voice: "uk-nam", text: "I think it's because we put the link in the chemistry newsletter first. By the time it reached the other departments, the exam period had already started.", vi: "Em nghĩ là vì bọn em đưa đường link lên bản tin khoa Hoá trước. Đến khi nó tới các khoa khác thì mùa thi đã bắt đầu rồi." },
        { who: "Dr Patel", voice: "us-nam", text: "Right. Make sure you mention that in your presentation as a limitation. Now, what did you actually find?", vi: "Đúng rồi. Nhớ nêu điều đó trong bài thuyết trình như một hạn chế nhé. Giờ thì, các em thực sự phát hiện ra điều gì?" },
        { who: "Lucy", voice: "uk-nu", text: "Well, the main question was how many hours students slept on a normal night, and we asked them to record it every week for six weeks. In the first two weeks, the average stayed fairly stable at around seven and a half hours.", vi: "Dạ, câu hỏi chính là sinh viên ngủ bao nhiêu tiếng vào một đêm bình thường, và bọn em nhờ các bạn ghi lại mỗi tuần trong sáu tuần. Hai tuần đầu, con số trung bình khá ổn định quanh bảy tiếng rưỡi." },
        { who: "Tom", voice: "uk-nam", text: "Then, in week three, when the exams began, it fell sharply to just under six hours.", vi: "Rồi tới tuần thứ ba, khi bắt đầu thi, nó giảm mạnh xuống còn chưa tới sáu tiếng." },
        { who: "Dr Patel", voice: "us-nam", text: "And after that?", vi: "Còn sau đó?" },
        { who: "Lucy", voice: "uk-nu", text: "It stayed low for the exam weeks, and then it recovered quite quickly. By week six it was back to about seven hours.", vi: "Nó ở mức thấp suốt những tuần thi, rồi hồi phục khá nhanh. Đến tuần sáu thì quay lại khoảng bảy tiếng." },
        { who: "Dr Patel", voice: "us-nam", text: "Interesting. Tom, you look like you disagree.", vi: "Thú vị đấy. Tom, trông em có vẻ không đồng ý." },
        { who: "Tom", voice: "uk-nam", text: "Not exactly. I just think 'quickly' is a bit strong, Lucy. It took two whole weeks to go up again, and it never reached the starting level.", vi: "Không hẳn ạ. Tớ chỉ nghĩ chữ “nhanh” hơi quá, Lucy à. Mất trọn hai tuần nó mới tăng lại, mà cũng chưa bao giờ về được mức ban đầu." },
        { who: "Lucy", voice: "uk-nu", text: "Fair point. Maybe 'gradually' is better.", vi: "Có lý. Có lẽ dùng chữ “dần dần” thì hơn." },
        { who: "Dr Patel", voice: "us-nam", text: "I agree with Tom there. Choose your words carefully, because the examiners will check your graph against your description. What about the reasons students gave?", vi: "Thầy đồng ý với Tom ở điểm này. Chọn từ cẩn thận, vì giám khảo sẽ đối chiếu biểu đồ với phần mô tả của các em. Thế còn các lý do mà sinh viên đưa ra?" },
        { who: "Lucy", voice: "uk-nu", text: "The most common reason was stress, of course. But what surprised me was how many students blamed their phones. Nearly half said they used their phone in bed for more than an hour.", vi: "Lý do phổ biến nhất dĩ nhiên là căng thẳng. Nhưng điều làm em bất ngờ là có rất nhiều bạn đổ lỗi cho điện thoại. Gần một nửa nói rằng họ dùng điện thoại trên giường hơn một tiếng." },
        { who: "Tom", voice: "uk-nam", text: "Actually, I'm not sure we can say 'blamed'. The question only asked whether they used their phone, and for how long. It didn't ask whether they thought it affected their sleep.", vi: "Thật ra em không chắc mình nói “đổ lỗi” được đâu. Câu hỏi chỉ hỏi các bạn có dùng điện thoại không, và dùng bao lâu. Nó không hỏi các bạn có nghĩ điện thoại ảnh hưởng đến giấc ngủ hay không." },
        { who: "Dr Patel", voice: "us-nam", text: "That's an important difference, Tom. You can report what they did, but not what they believed. Now, for the presentation, how do you want to show the results?", vi: "Đó là một khác biệt quan trọng, Tom. Các em có thể báo cáo việc sinh viên đã làm, nhưng không thể báo cáo điều họ tin. Giờ, với bài thuyết trình, các em muốn trình bày kết quả thế nào?" },
        { who: "Tom", voice: "uk-nam", text: "I was thinking of a pie chart.", vi: "Em đang tính dùng biểu đồ tròn." },
        { who: "Dr Patel", voice: "us-nam", text: "Hmm. A pie chart shows proportions at one moment. You're showing change over six weeks.", vi: "Hừm. Biểu đồ tròn cho thấy tỉ lệ tại một thời điểm. Các em đang trình bày sự thay đổi qua sáu tuần." },
        { who: "Lucy", voice: "uk-nu", text: "So a line graph would make more sense.", vi: "Vậy dùng biểu đồ đường sẽ hợp lý hơn." },
        { who: "Dr Patel", voice: "us-nam", text: "Exactly. And I'd suggest adding a second line for the number of hours spent studying, if you have that data.", vi: "Chính xác. Và thầy gợi ý thêm một đường thứ hai cho số giờ dành cho việc học, nếu các em có số liệu đó." },
        { who: "Lucy", voice: "uk-nu", text: "We do. That's a great idea, because you'd see study hours going up while sleep goes down.", vi: "Bọn em có ạ. Ý hay quá, vì người xem sẽ thấy giờ học tăng lên trong khi giờ ngủ giảm xuống." },
        { who: "Tom", voice: "uk-nam", text: "And what about including some quotes from the students? A few of them wrote really honest comments.", vi: "Còn việc đưa vào vài câu trích lời sinh viên thì sao ạ? Có mấy bạn viết nhận xét rất thật lòng." },
        { who: "Dr Patel", voice: "us-nam", text: "Yes, but keep it to two or three. One last thing: the presentation is on the fourteenth, and it should last ten minutes, with five minutes for questions.", vi: "Được, nhưng chỉ hai ba câu thôi. Một điều cuối: buổi thuyết trình vào ngày mười bốn, kéo dài mười phút, cộng năm phút hỏi đáp." },
        { who: "Lucy", voice: "uk-nu", text: "Ten minutes. Okay. Should we both speak?", vi: "Mười phút. Vâng ạ. Cả hai bọn em đều nói ạ?" },
        { who: "Dr Patel", voice: "us-nam", text: "Yes, please divide it equally. Lucy, why don't you present the method, and Tom can explain the results?", vi: "Ừ, chia đều nhé. Lucy, sao em không trình bày phương pháp, còn Tom giải thích kết quả?" },
        { who: "Tom", voice: "uk-nam", text: "Sounds good. And we'll send you our slides by Friday.", vi: "Được ạ. Và bọn em sẽ gửi slide cho thầy trước thứ Sáu." },
        { who: "Dr Patel", voice: "us-nam", text: "Perfect. Good luck, both of you.", vi: "Tuyệt. Chúc cả hai may mắn." },
      ],
    },
    {
      t: "p",
      text: "**Questions 21–24.** Choose the correct letter, **A, B or C**.",
    },
    {
      t: "mcq",
      id: "d11-nghe-chon",
      title: "Questions 21–24 — Multiple choice",
      items: [
        {
          q: "(21) Why did most of the replies come from science students?",
          options: ["A The arts students did not want to take part.", "B The link was shared in a science newsletter first.", "C The questionnaire was only sent to science students."],
          correct: 1,
          why: "Tom: “we put the link in the **chemistry newsletter first**. By the time it reached the other departments, the exam period had already started.” chemistry newsletter = **a science newsletter**. C sai vì Lucy nói đã gửi cho **all the first-year students**; A không được nhắc tới.",
        },
        {
          q: "(22) During the first two weeks, students' average sleep",
          options: ["A rose slightly.", "B remained fairly stable.", "C fell sharply."],
          correct: 1,
          why: "Lucy: “In the first two weeks, the average **stayed fairly stable** at around seven and a half hours.” stayed = **remained**. **fell sharply** là tuần thứ **ba** (bẫy thời gian).",
        },
        {
          q: "(23) What does Tom say about Lucy's description of the recovery?",
          options: ["A It makes the recovery sound faster than it was.", "B It should include the exact number of hours.", "C It is based on the wrong weeks."],
          correct: 0,
          why: "Tom: “I just think **'quickly' is a bit strong**… It took **two whole weeks** to go up again.” = từ “quickly” làm sự hồi phục **nghe nhanh hơn thực tế**. Lucy đổi thành **gradually** — bài học từ vựng xu hướng hôm nay!",
        },
        {
          q: "(24) According to Tom, the questionnaire did not ask students",
          options: ["A how long they used their phones in bed.", "B whether they thought phones affected their sleep.", "C what time they usually went to bed."],
          correct: 1,
          why: "Tom: “The question only asked **whether they used their phone, and for how long**. It **didn't ask whether they thought it affected their sleep**.” A sai: bảng hỏi **có** hỏi thời gian dùng điện thoại (and for how long; Lucy: more than an hour). C không được nhắc tới.",
        },
      ],
    },
    {
      t: "p",
      text: "**Questions 25–27.** Who suggested each of the following? Choose **A** Lucy, **B** Tom or **C** Dr Patel. — **Ai đề xuất mỗi ý sau?**",
    },
    {
      t: "mcq",
      id: "d11-nghe-noi",
      title: "Questions 25–27 — Matching (A Lucy · B Tom · C Dr Patel)",
      items: [
        {
          q: "(25) using a pie chart",
          options: ["A Lucy", "B Tom", "C Dr Patel"],
          correct: 1,
          why: "Tom: “**I was thinking of a pie chart**.” Dr Patel nhắc tới pie chart ngay sau đó nhưng để **phản bác** (Hmm. A pie chart shows proportions…). Ý **đề xuất** là của Tom.",
        },
        {
          q: "(26) using a line graph",
          options: ["A Lucy", "B Tom", "C Dr Patel"],
          correct: 0,
          why: "Lucy: “So **a line graph would make more sense**.” Dr Patel chỉ đáp “**Exactly**” (đồng ý) — người **nói ra** ý là Lucy. Bẫy: nghe “Exactly” của giảng viên rồi chọn C.",
        },
        {
          q: "(27) showing the number of hours spent studying",
          options: ["A Lucy", "B Tom", "C Dr Patel"],
          correct: 2,
          why: "Dr Patel: “**I'd suggest adding a second line for the number of hours spent studying**.” Lucy khen “That's a great idea” — tín hiệu **đồng ý**, không phải đề xuất. (Ý **trích lời sinh viên** là của Tom, nhưng không có trong câu hỏi.)",
        },
      ],
    },
    {
      t: "p",
      text: "**Questions 28–30.** Complete the notes below. Write **ONE WORD AND/OR A NUMBER** for each answer.",
    },
    {
      t: "table",
      caption: "Notes for the presentation",
      head: ["", "Note"],
      rows: [
        ["28", "Mention the low number of arts students as a **(28) ______**"],
        ["29", "Length: **(29) ______** minutes, plus five minutes for questions"],
        ["30", "Lucy: present the method · Tom: explain the **(30) ______**"],
      ],
    },
    {
      t: "quiz",
      id: "d11-nghe-dien",
      title: "Questions 28–30 — ONE WORD AND/OR A NUMBER",
      kind: "fill",
      items: [
        { q: "(28) Mention the low number of arts students as a ___", answers: ["limitation"] },
        { q: "(29) Length: ___ minutes, plus five minutes for questions", answers: ["10", "ten"] },
        { q: "(30) Lucy: present the method · Tom: explain the ___", answers: ["results"] },
      ],
    },
    {
      t: "note",
      title: "Giải thích đáp án 28–30",
      items: [
        "**(28) limitation** (hạn chế, điểm yếu của nghiên cứu) — Dr Patel: “Make sure you mention that in your presentation as a **limitation**.” Từ học thuật rất hay gặp ở Part 3 và Part 4; nhớ đánh vần đúng **-tion**.",
        "**(29) 10 / ten** — “it should last **ten minutes**, with **five** minutes for questions”. Bẫy: có ba con số gần nhau (fourteenth, ten, five). **fourteenth** là **ngày**, five là phần hỏi đáp.",
        "**(30) results** — “Lucy, why don't you present the **method**, and Tom can explain the **results**?” Nghe số nhiều **-s** (/rɪˈzʌlts/). Bẫy: ~~method~~ đã có sẵn trong ghi chú cho Lucy.",
      ],
    },
    {
      t: "note",
      title: "Cách học sau khi làm xong",
      items: [
        "Mở lời thoại, nghe lại và **đánh dấu mọi cụm tín hiệu**: Not exactly · Fair point · I agree with Tom there · Actually, I'm not sure… · Hmm. · Exactly · That's a great idea.",
        "Để ý cách Lucy và Tom dùng **từ vựng xu hướng**: stayed fairly stable · fell sharply to just under six hours · recovered · back to about seven hours · gradually. Đây chính là ngôn ngữ của Task 1!",
        "Đọc nhại (shadowing) **ba câu của Dr Patel** có dạng đề xuất: “Make sure you…”, “I'd suggest adding…”, “Why don't you…?” — dùng được ngay khi làm việc nhóm bằng tiếng Anh.",
      ],
    },
  ],
};

/* ─────────────────────────── Bài tập ─────────────────────────── */

const D11_HOMEWORK: Lesson = {
  id: "d11-bai-tap",
  kind: "homework",
  title: "Bài tập Ngày 11",
  goal: "Tự kiểm tra Ngày 11: 10 câu điền collocation, 10 câu trắc nghiệm (collocation, trật tự từ, cụm danh từ), 8 câu dịch tả xu hướng, và 6 câu điền mô tả một biểu đồ cột — 34 câu có đáp án.",
  minutes: 40,
  blocks: [
    {
      t: "recap",
      title: "Bài tập hôm nay",
      items: [
        "**Phần I — Điền collocation** (10 câu): make / do / take / pay / heavy / high…",
        "**Phần II — Trắc nghiệm** (10 câu): collocation, giới từ, trật tự từ, thứ tự tính từ.",
        "**Phần III — Dịch tả xu hướng** (8 câu) — có 💡 gợi ý.",
        "**Phần IV — Biểu đồ cột** (6 câu): đọc số liệu, điền từ / giới từ cho khớp.",
      ],
    },
    {
      t: "sodo",
      kind: "mindmap",
      title: "Ngày 11 trong một hình",
      center: "**Ngày 11**",
      branches: [
        { label: "Collocation", items: ["make a mistake · do homework", "heavy rain · high price", "strongly agree · rise sharply", "impact on · a rise in"] },
        { label: "Trật tự & cụm danh từ", items: ["S–V–O–how–where–when", "a small black leather bag", "a ten-minute walk (không -s)"] },
        { label: "Xu hướng", items: ["rose / fell / fluctuated / remained stable", "peaked at · hit a low of", "by (thêm) ≠ to (lên tới)", "rose sharply = a sharp rise"] },
        { label: "Part 3", items: ["Ý cuối cùng mới là đáp án", "Actually / I'm not sure → bác bỏ", "Bám tên: Lucy · Tom · Dr Patel"] },
      ],
    },

    { t: "h", text: "Phần I — Điền collocation (10 câu)" },
    {
      t: "quiz",
      id: "d11-bt-dien",
      title: "Phần I — Điền MỘT từ (10 câu)",
      kind: "fill",
      items: [
        { q: "(1) It's hard to ___ a decision when you are tired.", answers: ["make", "take"] },
        { q: "(2) Scientists ___ research to find new medicines.", answers: ["do", "conduct"] },
        { q: "(3) Let's ___ a short break before the next lesson.", answers: ["take", "have"] },
        { q: "(4) Please ___ attention to the instructions.", answers: ["pay"] },
        { q: "(5) There is always ___ traffic in the city centre at 6 p.m.", answers: ["heavy"] },
        { q: "(6) The cost of living in big cities is very ___.", answers: ["high"] },
        { q: "(7) Parents play an important ___ in their children's education.", answers: ["role", "part"] },
        { q: "(8) Volunteering helps young people ___ experience.", answers: ["gain", "get"] },
        { q: "(9) The campaign aims to ___ awareness of climate change.", answers: ["raise"] },
        { q: "(10) A large ___ of students live in dormitories.", answers: ["number", "proportion", "percentage"] },
      ],
    },

    { t: "h", text: "Phần II — Trắc nghiệm (10 câu)" },
    {
      t: "mcq",
      id: "d11-bt-chon",
      title: "Phần II — Chọn đáp án đúng (10 câu)",
      items: [
        { q: "(1) I ___ a lot of mistakes in my first essay.", options: ["did", "took", "made"], correct: 2, why: "**make** a mistake → quá khứ **made**." },
        { q: "(2) My sister ___ the housework at weekends.", options: ["does", "makes", "takes"], correct: 0, why: "**do** the housework / homework." },
        { q: "(3) There was a ___ wind during the storm.", options: ["heavy", "strong", "high"], correct: 1, why: "**strong** wind (gió mạnh). heavy đi với **rain**, high đi với **price / level**." },
        { q: "(4) Smartphones have a negative effect ___ children's eyesight.", options: ["to", "for", "on"], correct: 2, why: "effect / impact **on**." },
        { q: "(5) What is the best solution ___ traffic jams?", options: ["to", "of", "for"], correct: 0, why: "a solution **to** + vấn đề." },
        { q: "(6) Câu nào đúng?", options: ["She plays very well the piano.", "She very well plays the piano.", "She plays the piano very well."], correct: 2, why: "Trạng từ cách thức (very well) đứng **sau tân ngữ** (the piano)." },
        { q: "(7) Câu nào đúng?", options: ["I met my friends in a café last night.", "I met last night my friends in a café.", "I met my friends last night in a café."], correct: 0, why: "S – V – O – **nơi chốn** – **thời gian**: …in a café **last night**. (Câu 3 không hẳn sai trong văn nói, nhưng thứ tự chuẩn là nơi chốn trước thời gian.)" },
        { q: "(8) He lives in a ___ house.", options: ["wooden old lovely", "lovely old wooden", "old lovely wooden"], correct: 1, why: "Ý kiến (lovely) → tuổi (old) → chất liệu (wooden) → danh từ." },
        { q: "(9) We stayed in a ___ hotel.", options: ["five-star", "five-stars", "five stars"], correct: 0, why: "Số + danh từ gạch nối làm tính từ: **không -s** → a **five-star** hotel." },
        { q: "(10) I ___ agree with the writer.", options: ["very", "highly", "strongly"], correct: 2, why: "**strongly / completely** agree. ~~very agree~~ sai; **highly** đi với effective, likely, recommended." },
      ],
    },

    { t: "h", text: "Phần III — Dịch tả xu hướng (8 câu)" },
    {
      t: "quiz",
      id: "d11-bt-dich",
      title: "Phần III — Dịch sang tiếng Anh (8 câu)",
      kind: "translate",
      grammar: "S + rose / fell / grew + adv + from X to Y · S + peaked at + số · S + fluctuated between A and B · There was a + adj + N + in + S · S + remained stable at + số · S + more than doubled.",
      items: [
        { q: "Doanh số tăng mạnh từ 2 triệu lên 5 triệu.", hint: "Sales, rose / increased sharply, from 2 million to 5 million", answers: ["Sales rose sharply from 2 million to 5 million.", "Sales increased sharply from 2 million to 5 million.", "Sales rose dramatically from 2 million to 5 million.", "Sales increased dramatically from 2 million to 5 million.", "Sales grew sharply from 2 million to 5 million.", "Sales rose significantly from 2 million to 5 million.", "Sales increased significantly from 2 million to 5 million."] },
        { q: "Số học sinh giảm nhẹ vào năm 2020.", hint: "The number of students, fell / decreased slightly, in 2020", answers: ["The number of students fell slightly in 2020.", "The number of students decreased slightly in 2020.", "The number of students dropped slightly in 2020.", "The number of students declined slightly in 2020.", "In 2020, the number of students fell slightly.", "Student numbers fell slightly in 2020.", "The number of students dipped slightly in 2020."] },
        { q: "Giá xăng dao động trong khoảng từ 1 đến 1,5 đô la.", hint: "The price of petrol, fluctuated between, $1 and $1.50", answers: ["The price of petrol fluctuated between $1 and $1.50.", "The price of petrol fluctuated between 1 and 1.5 dollars.", "Petrol prices fluctuated between $1 and $1.50.", "The price of petrol fluctuated between $1 and $1.5.", "The price of gas fluctuated between $1 and $1.50.", "Petrol prices fluctuated between 1 and 1.5 dollars.", "The price of petrol fluctuated between one and one and a half dollars."] },
        { q: "Con số đạt đỉnh 90% vào năm 2015.", hint: "The figure, peaked at, 90%, in 2015", answers: ["The figure peaked at 90% in 2015.", "The figure peaked at 90 percent in 2015.", "The figure reached a peak of 90% in 2015.", "In 2015, the figure peaked at 90%.", "The figure peaked at 90 per cent in 2015.", "The figure reached a peak of 90 percent in 2015."] },
        { q: "Số khách du lịch tăng hơn gấp đôi trong giai đoạn này.", hint: "The number of tourists, more than doubled, over the period", answers: ["The number of tourists more than doubled over the period.", "The number of tourists more than doubled during the period.", "Tourist numbers more than doubled over the period.", "The number of tourists more than doubled during this period.", "The number of tourists more than doubled over this period.", "Tourist numbers more than doubled during the period."] },
        { q: "Có một sự tăng đều về số người dùng internet.", hint: "There was, a steady rise / increase in, the number of internet users", answers: ["There was a steady rise in the number of internet users.", "There was a steady increase in the number of internet users.", "There was a steady growth in the number of internet users.", "There has been a steady rise in the number of internet users.", "There has been a steady increase in the number of internet users.", "There was a steady rise in the number of Internet users."] },
        { q: "Tỉ lệ thất nghiệp giữ ổn định ở mức 5%.", hint: "The unemployment rate, remained stable, at 5%", answers: ["The unemployment rate remained stable at 5%.", "The unemployment rate remained steady at 5%.", "The unemployment rate stayed stable at 5%.", "The rate of unemployment remained stable at 5%.", "The unemployment rate remained stable at 5 percent.", "The unemployment rate remained unchanged at 5%.", "The unemployment rate remained stable at 5 per cent."] },
        { q: "Năm 2021 chứng kiến một sự sụt giảm mạnh về lượng khách.", hint: "2021 saw, a sharp / dramatic drop / fall in, visitor numbers / the number of visitors", answers: ["2021 saw a sharp drop in visitor numbers.", "2021 saw a sharp fall in visitor numbers.", "2021 saw a dramatic drop in visitor numbers.", "2021 saw a dramatic fall in visitor numbers.", "2021 saw a sharp drop in the number of visitors.", "2021 saw a sharp fall in the number of visitors.", "2021 saw a dramatic drop in the number of visitors.", "2021 saw a dramatic fall in the number of visitors.", "2021 saw a sharp decrease in the number of visitors.", "2021 saw a sharp decline in the number of visitors."] },
      ],
    },

    { t: "h", text: "Phần IV — Đọc biểu đồ cột và điền (6 câu)" },
    {
      t: "figure",
      fig: {
        kind: "bar",
        title: "Books borrowed from one city library, 2019–2024 (thousands)",
        note: "Số liệu tự đặt cho bài luyện.",
        unit: "thousands",
        categories: ["2019", "2020", "2021", "2022", "2023", "2024"],
        series: [
          { name: "Printed books", values: [120, 112, 95, 90, 84, 80] },
          { name: "E-books", values: [10, 25, 38, 52, 61, 70] },
        ],
      },
    },
    {
      t: "quiz",
      id: "d11-bt-bieu-do",
      title: "Phần IV — Điền MỘT từ hoặc MỘT số cho khớp biểu đồ (6 câu)",
      kind: "fill",
      items: [
        { q: "(1) The number of printed books borrowed ___ (giảm, quá khứ) steadily from 120,000 to 80,000.", answers: ["fell", "decreased", "declined", "dropped"] },
        { q: "(2) Over the six years, printed book loans fell ___ 40,000. (giới từ)", answers: ["by"] },
        { q: "(3) E-book loans rose ___ 70,000 in 2024. (giới từ: lên tới)", answers: ["to"] },
        { q: "(4) E-book loans rose every year, but they never ___ (vượt qua, quá khứ) printed book loans.", answers: ["overtook", "exceeded", "surpassed"] },
        { q: "(5) There was a sharp rise ___ e-book loans between 2019 and 2020. (giới từ)", answers: ["in"] },
        { q: "(6) In 2024, ___ thousand printed books were borrowed. (một số)", answers: ["80", "eighty"] },
      ],
    },
    {
      t: "note",
      title: "Giải thích Phần IV",
      items: [
        "(1) Sách in: 120 → 112 → 95 → 90 → 84 → 80 — **giảm** đều mỗi năm → **fell / decreased / declined / dropped** (quá khứ vì số liệu 2019–2024).",
        "(2) 120 − 80 = **40** (nghìn) → giảm **thêm / đi** 40.000 = fell **by** 40,000.",
        "(3) Điểm đến năm 2024 là 70 → rose **to** 70,000.",
        "(4) Năm 2024 sách điện tử (70) vẫn **thấp hơn** sách in (80) → chưa năm nào vượt → never **overtook** (overtake – overtook – overtaken). Để ý: hai cột đang **tiến sát nhau** — đây là điểm đáng đưa vào overview.",
        "(5) a rise **in** + thứ tăng. (6) Cột sách in năm 2024 = **80**.",
      ],
    },
  ],
};

export const NGAY_11: Lesson[] = [D11_GRAMMAR, D11_VOCAB, D11_LISTENING, D11_HOMEWORK];
