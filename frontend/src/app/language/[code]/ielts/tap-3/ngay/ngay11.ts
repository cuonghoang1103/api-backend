/**
 * IELTS Tập 3 — Ngày 11 (band 5.0 → 6.0)
 *   Bài 1 (grammar)  So sánh nâng cao cho Task 1: mức độ (by far, considerably) · bội số (twice as…as, fourfold) ·
 *                    phân số (a fifth of that amount) · so sánh kép (the more…, the more…) · that of / those of   [G33 VC05, ôn G14]
 *                    — nối Tập 2 Ngày 9 (so sánh nền), Ngày 8 và 10 (bội số, counterpart nhập môn)
 *   Bài 2 (reading)  Multiple choice 2 — loại ba đáp án sai: sáu kiểu phương án sai; bài “Bread from the Air” (phân đạm tổng hợp Haber–Bosch)   [R10]
 *                    — nối Tập 2 Ngày 10 (bốn loại câu hỏi, từ khoá phân biệt)
 *   Bài 3 (speaking) Ngữ pháp nói: 30 chunks, rút gọn, câu hỏi đuôi, từ làm mềm; quên từ / không biết thì nói gì   [G44 S09]
 *                    — nối Tập 2 Ngày 9 · 13 · 🔊 chunking nhập môn [S15]
 *   Bài tập Ngày 11  40 câu có đáp án + 1 lượt nói
 * Mọi bài đọc, số liệu, hội thoại, câu ví dụ đều TỰ SOẠN. Mọi id bắt đầu `t3d11-`.
 */
import type { Lesson } from '../data';

export const NGAY_11: Lesson[] = [
  /* ═══════════════════════════ BÀI 1 — NGỮ PHÁP ═══════════════════════════ */
  {
    id: "t3d11-ngu-phap",
    kind: "grammar",
    title: "Ngữ pháp: So sánh nâng cao cho Task 1 — by far · twice as…as · fourfold · a fifth of · the more…, the more…",
    goal: "Viết đúng câu so sánh có MỨC ĐỘ (considerably higher, by far the largest), có BỘI SỐ và PHÂN SỐ (twice as many as, a fourfold increase, a fifth of that amount), so sánh kép (the more…, the more…) và so sánh không lệch vế (that of / those of) — để mỗi con số trong Task 1 được đặt cạnh một con số khác, đúng yêu cầu “so sánh đúng chỗ” của Task Achievement band 6.",
    minutes: 90,
    blocks: [
      {
        t: "recap",
        title: "Bài này học gì · đẩy tiêu chí nào",
        items: [
          "Tập 2 Ngày 9 bạn đã tạo được dạng so sánh (higher, the highest, as high as). Tập 2 Ngày 8 và 10 có nhập môn bội số (fourfold, a fifth of). Hôm nay học ==trọn== phần so sánh mà Task 1 band 6 cần.",
          "Band 5 liệt kê số: “A was 40%. B was 10%.” Band 6 ==nối hai số bằng một quan hệ==: “A was four times as high as B.” Đó là điều giám khảo gọi là “make comparisons where relevant”.",
          "Sáu điểm: ① mức độ khác biệt (slightly / considerably / by far) · ② bội số (twice as…as, fourfold) · ③ phân số (a fifth of that amount, half as many) · ④ so sánh kép (the more…, the more…) · ⑤ không so lệch vế (that of / those of) · ⑥ từ nối so sánh (whereas, compared with, respectively).",
          "Ba lỗi người Việt hay mắc: ~~more higher~~ · ~~twice higher than~~ (nên: twice as high as) · ~~The price of A is higher than B~~ (so giá với… một món đồ).",
          "Luôn ==tính nhẩm trước khi viết==: 12 → 48 là gấp 4, không phải “tăng 4 lần” mơ hồ. Sai số là mất điểm Task Achievement, không phải điểm ngữ pháp.",
          "Bài này cũng dùng được khi nói: Part 3 dạng so sánh (“Is life in cities better than in the countryside?”) cần đúng những khung này.",
        ],
      },

      { t: "h", text: "1. Ôn nhanh từ Tập 2 Ngày 9: ba dạng so sánh nền" },
      {
        t: "p",
        text: "**So sánh** (comparison) là đặt hai hay nhiều thứ cạnh nhau để nói thứ nào hơn, kém, hay bằng. Tiếng Anh có ba dạng nền. Nếu bảng dưới còn lạ, hãy mở lại Tập 2 Ngày 9 trước khi học tiếp.",
      },
      {
        t: "table",
        caption: "Ba dạng nền (ôn từ Tập 2 Ngày 9). adj = tính từ, adv = trạng từ.",
        head: ["Dạng", "Công thức", "Ví dụ Task 1"],
        rows: [
          ["So sánh hơn", "adj-er / more + adj + **than**", "Rents were **higher** in the capital **than** in other cities."],
          ["So sánh nhất", "**the** + adj-est / most + adj (+ in / of)", "Tourism was **the largest** sector **in** the economy."],
          ["So sánh bằng", "**as** + adj / adv + **as**", "Sales of tea were **as high as** sales of coffee."],
          ["Với danh từ", "more / fewer (đếm được) · more / less (không đếm được) + N + than", "Women bought **more books** but spent **less money** than men."],
          ["Bất quy tắc", "good → better → the best · bad → worse → the worst · far → further → the furthest · little → less → the least", "The **least** popular option was cycling."],
        ],
      },
      {
        t: "quiz",
        id: "t3d11-on-so-sanh",
        title: "Kiểm tra đầu bài — viết dạng đúng của từ trong ngoặc (8 câu)",
        kind: "fill",
        items: [
          { q: "1. Flats in the centre are ___ (expensive) than houses in the suburbs.", answers: ["more expensive"] },
          { q: "2. Cycling was the ___ (little) popular way of travelling to work.", answers: ["least"] },
          { q: "3. The figure for 2020 was ___ (high) than the figure for 2010.", answers: ["higher"] },
          { q: "4. Of the five countries, Japan had the ___ (old) population.", answers: ["oldest"] },
          { q: "5. Men spent ___ (little) time on housework than women.", answers: ["less"] },
          { q: "6. There were ___ (few) visitors in winter than in summer.", answers: ["fewer"] },
          { q: "7. Sales fell ___ (far) in the second half of the year.", answers: ["further", "farther"] },
          { q: "8. Health was the second ___ (large) area of spending.", answers: ["largest"] },
        ],
      },
      {
        t: "note",
        title: "Ba lỗi nền cần hết hẳn trước khi sang band 6",
        items: [
          "~~more higher~~ / ~~more bigger~~ → **higher**, **bigger**. Đã có -er thì không thêm more.",
          "~~the most highest~~ → **the highest**. ~~most highest figure~~ thiếu **the** → **the highest figure**.",
          "~~less people~~ trong văn viết → **fewer people** (people đếm được). **less** đi với danh từ không đếm được: less money, less time, less energy.",
        ],
      },
      { t: "rule", formula: "adj-er / more + adj + than · the + adj-est / most + adj · as + adj + as", vi: "Ba dạng nền. Mọi cấu trúc hôm nay chỉ là thêm một từ chỉ mức độ, bội số hoặc phân số vào trước ba dạng này." },

      { t: "h", text: "2. Mức độ khác biệt: hơn nhiều hay hơn một chút?" },
      {
        t: "p",
        text: "“A was higher than B” chưa cho người đọc biết hơn **bao nhiêu**. Ở band 6 bạn thêm một từ chỉ mức độ ngay **trước** dạng so sánh. Từ này phải khớp với số liệu: chênh 2 điểm phần trăm là **slightly**, chênh 30 điểm là **far** hoặc **considerably**.",
      },
      {
        t: "table",
        caption: "Từ chỉ mức độ đứng trước so sánh hơn. Xếp từ chênh ít tới chênh nhiều.",
        head: ["Mức chênh", "Từ dùng", "Ví dụ (số liệu trong ngoặc)"],
        rows: [
          ["Rất ít", "**slightly · marginally · a little · fractionally**", "Exports were **slightly higher** than imports (52% so với 50%)."],
          ["Vừa", "**somewhat · rather · noticeably**", "Rents were **noticeably higher** in the north (£900 so với £750)."],
          ["Nhiều", "**much · far · considerably · significantly · substantially · a great deal**", "Car use was **far more common** than cycling (64% so với 9%)."],
          ["Có số", "**số + đơn vị** + comparative", "The figure was **15% higher** / **two million lower** than in 2010."],
          ["Tăng dần", "**even · still** + comparative", "The 2020 figure was **even higher**, at 71%."],
        ],
      },
      {
        t: "patterns",
        rows: [
          {
            formula: "S + be + much / far / considerably / slightly + adj-er / more + adj + than + N",
            vi: "hơn nhiều / hơn một chút",
            examples: [
              { en: "Spending on housing was considerably higher than spending on food.", vi: "Chi cho nhà ở cao hơn đáng kể so với chi cho thực phẩm." },
              { en: "The number of female students was marginally lower than that of male students.", vi: "Số sinh viên nữ thấp hơn một chút so với số sinh viên nam." },
            ],
          },
          {
            formula: "S + be + by far + the + adj-est / most + adj + N",
            vi: "cái lớn nhất, và bỏ rất xa các cái còn lại",
            examples: [
              { en: "Cars were by far the most popular means of transport, at 64%.", vi: "Ô tô là phương tiện phổ biến nhất, bỏ xa các loại khác, ở mức 64%." },
              { en: "The USA was by far the largest producer.", vi: "Mỹ là nước sản xuất lớn nhất, hơn hẳn các nước khác." },
            ],
          },
          {
            formula: "S + be + the second / third + adj-est + N",
            vi: "lớn thứ hai / thứ ba",
            examples: [
              { en: "Education was the second largest area of expenditure.", vi: "Giáo dục là khoản chi lớn thứ hai." },
            ],
          },
          {
            formula: "S + be + not nearly / nowhere near + as + adj + as + N",
            vi: "kém xa (văn nói và văn viết bán trang trọng)",
            examples: [
              { en: "Rail travel was not nearly as popular as road travel.", vi: "Đi tàu kém phổ biến hơn nhiều so với đi đường bộ." },
            ],
          },
          {
            formula: "S + be + almost / nearly / just / roughly + as + adj + as + N",
            vi: "gần bằng / đúng bằng / xấp xỉ bằng",
            examples: [
              { en: "The figure for France was almost as high as that for Germany.", vi: "Con số của Pháp gần cao bằng con số của Đức." },
            ],
          },
        ],
      },
      {
        t: "note",
        title: "⚠️ Lỗi hay sai với từ chỉ mức độ",
        items: [
          "~~very higher~~ / ~~very more popular~~ → **much higher**, **far more popular**. **very** không đứng trước so sánh hơn.",
          "~~far the highest~~ → **by far the highest**. Trước so sánh **nhất** phải có **by**. (Trước so sánh **hơn** thì không: far higher.)",
          "~~the most highest by far~~ vẫn sai vì thừa most. Đúng: **by far the highest** hoặc **the highest by far**.",
          "**significantly** trong văn học thuật nghĩa là “đáng kể”. Chỉ dùng khi chênh rõ. Chênh 1–2 điểm mà viết significantly là sai Task Achievement.",
          "~~more and more higher~~ → **higher and higher** hoặc **increasingly high**.",
        ],
      },
      { t: "rule", formula: "much / far / considerably / slightly + adj-er than · by far + the + adj-est", vi: "Trước so sánh hơn: thêm từ mức độ. Trước so sánh nhất: thêm by far. Từ mức độ phải khớp độ chênh của số liệu." },
      {
        t: "quiz",
        id: "t3d11-muc-do-dich",
        title: "Dịch Việt → Anh — mức độ khác biệt (5 câu)",
        kind: "translate",
        grammar: "much / far / considerably / slightly + so sánh hơn + than · by far + the + so sánh nhất · the second + so sánh nhất · almost as + adj + as",
        items: [
          { q: "Giá thuê ở thủ đô cao hơn nhiều so với ở các thành phố khác.", answers: ["Rents in the capital were far higher than in other cities.", "Rents in the capital were much higher than in other cities.", "Rents in the capital were considerably higher than in other cities.", "Rents in the capital are far higher than in other cities.", "Rents in the capital are much higher than in other cities."], hint: "rents · the capital · far / much higher than" },
          { q: "Ô tô là phương tiện phổ biến nhất, bỏ xa các loại khác.", answers: ["Cars were by far the most popular means of transport.", "The car was by far the most popular means of transport.", "Cars were by far the most popular form of transport."], hint: "by far the most popular · means of transport" },
          { q: "Con số năm 2020 thấp hơn một chút so với năm 2010.", answers: ["The figure for 2020 was slightly lower than in 2010.", "The figure for 2020 was slightly lower than that for 2010.", "The figure for 2020 was marginally lower than that for 2010.", "The 2020 figure was slightly lower than the 2010 figure."], hint: "the figure for 2020 · slightly lower than" },
          { q: "Y tế là khoản chi lớn thứ hai.", answers: ["Health was the second largest area of spending.", "Health care was the second largest area of spending.", "Health was the second largest area of expenditure.", "Healthcare was the second largest area of spending."], hint: "the second largest · area of spending" },
          { q: "Con số của Pháp gần cao bằng con số của Đức.", answers: ["The figure for France was almost as high as that for Germany.", "The figure for France was nearly as high as that for Germany.", "The figure for France was almost as high as the figure for Germany."], hint: "almost as high as · that for Germany" },
        ],
      },
      {
        t: "mcq",
        id: "t3d11-muc-do-luyen",
        title: "Chọn từ mức độ khớp với số liệu (6 câu)",
        items: [
          { q: "1. Bus use: 31% · Train use: 29%. → Bus use was ___ higher than train use.", options: ["A far", "B slightly", "C considerably", "D by far"], correct: 1, why: "Chênh 2 điểm phần trăm = rất ít → slightly / marginally. far và considerably dành cho chênh lớn; by far chỉ đi với so sánh nhất." },
          { q: "2. Coal: 62% · Gas: 14% · Wind: 12% · Solar: 12%. → Coal was ___ the most important source of energy.", options: ["A so", "B very", "C by far", "D far"], correct: 2, why: "Trước so sánh nhất (the most important) dùng by far. far (không có by) đứng trước so sánh hơn; so và very không đứng trước so sánh nhất." },
          { q: "3. Chọn câu ĐÚNG.", options: ["A The figure was very higher than expected.", "B The figure was more higher than expected.", "C The figure was much more high than expected.", "D The figure was much higher than expected."], correct: 3, why: "much + higher. A: very không đứng trước so sánh hơn. B: thừa more. C: high là tính từ ngắn → higher, không more high." },
          { q: "4. Japan: 78 · Italy: 77 (tuổi thọ). → Life expectancy in Italy was ___ as high as in Japan.", options: ["A almost", "B twice", "C not nearly", "D far"], correct: 0, why: "77 so với 78 = gần bằng → almost / nearly as high as. not nearly as = kém xa (ngược nghĩa)." },
          { q: "5. Rent £1,400 (London) · £650 (Leeds). → Rents in Leeds were ___ as high as in London.", options: ["A just", "B almost", "C not nearly", "D slightly"], correct: 2, why: "650 chưa bằng nửa 1.400 → kém xa → not nearly as high as. slightly không đứng trong cấu trúc as…as." },
          { q: "6. Chọn câu ĐÚNG.", options: ["A Health was the second largest area of spending.", "B Health was second the largest area of spending.", "C Health was the second larger area of spending.", "D Health was the most second large area of spending."], correct: 0, why: "the + second / third + so sánh nhất + N. Thứ tự: the → số thứ tự → largest." },
        ],
      },

      { t: "h", text: "3. Bội số: gấp đôi, gấp ba, gấp bốn" },
      {
        t: "p",
        text: "**Bội số** (multiple) là “gấp mấy lần”. Tập 2 Ngày 8 và Ngày 10 đã cho bạn gặp double, fourfold. Hôm nay gom đủ **bốn cách** nói bội số và luật chọn cách. Dữ liệu dùng suốt mục 3–4 là bảng dưới đây (số tự đặt).",
      },
      {
        t: "table",
        caption: "Bảng số liệu dùng cho mục 3 và 4 — lượt khách mỗi năm của bốn bảo tàng ở một thành phố (nghìn lượt).",
        head: ["Bảo tàng", "2010", "2020"],
        rows: [
          ["City Museum", "200", "800"],
          ["Castle Museum", "400", "400"],
          ["Maritime Museum", "300", "150"],
          ["Toy Museum", "60", "50"],
        ],
      },
      {
        t: "table",
        caption: "Bốn cách nói bội số. N = danh từ, V = động từ.",
        head: ["Cách", "Công thức", "Ví dụ theo bảng"],
        rows: [
          ["① as…as", "**twice / three times / four times + as + adj / many / much + (N) + as**", "In 2020 the City Museum had **twice as many visitors as** the Castle Museum."],
          ["② so sánh hơn", "**three times / four times + adj-er / more + (N) + than** (không dùng với twice)", "The City Museum attracted **four times more visitors than** in 2010."],
          ["③ danh từ bội số", "**double / twice / three times + the number / figure / amount (+ of N / for N)**", "The figure for the City Museum was **double that for** the Castle Museum."],
          ["④ động từ", "**double · triple · quadruple** (nội động và ngoại động) · **halve**", "Visits to the City Museum **quadrupled** between 2010 and 2020."],
          ["⑤ -fold", "**increase / rise + twofold / threefold / fourfold** · **a fourfold increase in + N**", "There was **a fourfold increase in** visits to the City Museum."],
        ],
      },
      {
        t: "patterns",
        rows: [
          {
            formula: "S + V + twice / three times + as + many / much + N + as + N",
            vi: "nhiều gấp đôi / gấp ba (many + N đếm được, much + N không đếm được)",
            examples: [
              { en: "Germany produced three times as much energy as Portugal.", vi: "Đức sản xuất lượng năng lượng nhiều gấp ba Bồ Đào Nha." },
              { en: "Women bought twice as many books as men.", vi: "Phụ nữ mua nhiều sách gấp đôi nam giới." },
            ],
          },
          {
            formula: "S + be + twice / three times + as + adj + as + N",
            vi: "cao / lớn / đắt gấp đôi, gấp ba",
            examples: [
              { en: "The unemployment rate in the south was twice as high as in the north.", vi: "Tỉ lệ thất nghiệp ở miền nam cao gấp đôi ở miền bắc." },
            ],
          },
          {
            formula: "N + doubled / tripled / quadrupled / halved + (from A to B)",
            vi: "tăng gấp đôi / gấp ba / gấp bốn / giảm một nửa",
            examples: [
              { en: "Visits to the Maritime Museum halved, from 300,000 to 150,000.", vi: "Lượt khách tới Bảo tàng Hàng hải giảm một nửa, từ 300.000 xuống 150.000." },
              { en: "The number of users more than doubled over the decade.", vi: "Số người dùng tăng hơn gấp đôi trong thập kỷ đó." },
            ],
          },
          {
            formula: "There was + a twofold / threefold / fourfold + increase / rise + in + N",
            vi: "có mức tăng gấp N lần (danh từ hoá — rất hợp câu overview)",
            examples: [
              { en: "There was a threefold rise in online sales.", vi: "Doanh số trực tuyến tăng gấp ba." },
              { en: "Online sales rose threefold, from 5% to 15%.", vi: "Doanh số trực tuyến tăng gấp ba, từ 5% lên 15%." },
            ],
          },
        ],
      },
      {
        t: "sodo",
        kind: "compare",
        title: "“Tăng gấp 4” khác “tăng thêm 4 lần” — tính nhẩm trước khi viết",
        cols: [
          { title: "200 → 800", items: ["800 ÷ 200 = **4**", "quadrupled · rose **fourfold**", "four times **as many as** in 2010", "tăng **thêm** 600 = tăng 300%"] },
          { title: "400 → 400", items: ["không đổi", "remained **unchanged / stable** at 400", "exactly **the same as** in 2010"] },
          { title: "300 → 150", items: ["150 ÷ 300 = **½**", "**halved** · fell **by half**", "**half as many as** in 2010", "giảm 50%"] },
        ],
        caption: "Chia số sau cho số trước: ra 2 = double, 3 = triple / threefold, 4 = quadruple / fourfold, 0,5 = halve.",
      },
      {
        t: "note",
        title: "⚠️ Lỗi hay sai với bội số",
        items: [
          "~~twice higher than~~ / ~~twice more than~~ → **twice as high as**, **twice as many as**. **twice** chỉ đi với as…as hoặc với danh từ (twice the number). Từ three times trở lên mới dùng được cả hai (three times higher than / three times as high as).",
          "**two times as high as** không sai ngữ pháp, nhưng người bản ngữ gần như luôn viết **twice** — dùng twice cho tự nhiên.",
          "~~increased four times~~ dễ bị hiểu là “tăng bốn lần khác nhau”. Viết **quadrupled**, **rose fourfold** hoặc **was four times as high as**.",
          "~~as twice many as~~ → **twice as many as**. Bội số đứng **trước** chữ as đầu tiên.",
          "~~doubled twice~~ / ~~doubled two times~~ là thừa. **doubled** đã có nghĩa gấp đôi.",
          "~~a fourfolds increase~~ / ~~four-folds~~ → **fourfold** không bao giờ thêm s.",
          "**double** đứng ngay trước the (giống half, twice): **double the figure** (không ~~the double figure~~, không ~~double of the figure~~).",
        ],
      },
      { t: "rule", formula: "twice / three times + as + adj / many / much (N) + as · N + doubled / tripled · a fourfold increase in + N", vi: "Số sau ÷ số trước = bội số. twice chỉ đi với as…as; không viết twice higher than." },
      {
        t: "quiz",
        id: "t3d11-boi-so-dich",
        title: "Dịch Việt → Anh — bội số (5 câu, theo bảng bảo tàng)",
        kind: "translate",
        grammar: "twice / four times + as many + N + as · doubled / quadrupled / halved · a fourfold increase in + N · double the figure for + N",
        items: [
          { q: "Năm 2020, City Museum có lượng khách nhiều gấp đôi Castle Museum.", answers: ["In 2020, the City Museum had twice as many visitors as the Castle Museum.", "In 2020 the City Museum had twice as many visitors as the Castle Museum.", "In 2020, the City Museum received twice as many visitors as the Castle Museum.", "In 2020, the City Museum attracted twice as many visitors as the Castle Museum."], hint: "twice as many visitors as" },
          { q: "Lượt khách tới City Museum tăng gấp bốn trong giai đoạn 2010–2020.", answers: ["Visits to the City Museum quadrupled between 2010 and 2020.", "Visits to the City Museum rose fourfold between 2010 and 2020.", "Visits to the City Museum increased fourfold between 2010 and 2020.", "The number of visits to the City Museum quadrupled between 2010 and 2020."], hint: "visits to · quadrupled / rose fourfold · between 2010 and 2020" },
          { q: "Lượt khách tới Maritime Museum giảm một nửa.", answers: ["Visits to the Maritime Museum halved.", "Visits to the Maritime Museum fell by half.", "The number of visits to the Maritime Museum halved.", "The number of visitors to the Maritime Museum halved."], hint: "halved / fell by half" },
          { q: "Có mức tăng gấp bốn về lượt khách tới City Museum.", answers: ["There was a fourfold increase in visits to the City Museum.", "There was a fourfold rise in visits to the City Museum.", "There was a fourfold increase in the number of visits to the City Museum."], hint: "There was a fourfold increase in" },
          { q: "Năm 2010, con số của Castle Museum gấp đôi con số của City Museum.", answers: ["In 2010, the figure for the Castle Museum was double that for the City Museum.", "In 2010, the figure for the Castle Museum was twice that for the City Museum.", "In 2010 the figure for the Castle Museum was double that for the City Museum.", "In 2010, the figure for the Castle Museum was twice as high as that for the City Museum."], hint: "the figure for · double / twice that for" },
        ],
      },
      {
        t: "quiz",
        id: "t3d11-boi-so-luyen",
        title: "Tính rồi điền MỘT từ (6 câu, theo bảng bảo tàng)",
        kind: "fill",
        items: [
          { q: "1. In 2010 the Castle Museum (400) had ___ as many visitors as the City Museum (200).", answers: ["twice"] },
          { q: "2. Between 2010 and 2020, visits to the City Museum rose ___ (200 → 800).", answers: ["fourfold"] },
          { q: "3. In 2020 the Castle Museum (400) had eight ___ as many visitors as the Toy Museum (50).", answers: ["times"] },
          { q: "4. Visits to the Maritime Museum ___ over the period (300 → 150). (một động từ, quá khứ)", answers: ["halved"] },
          { q: "5. In 2010 the Maritime Museum (300) received five times as ___ visitors as the Toy Museum (60).", answers: ["many"] },
          { q: "6. In 2020 the figure for the City Museum (800) was ___ that for the Castle Museum (400). (double / twice)", answers: ["double", "twice"] },
        ],
      },

      { t: "h", text: "4. Phân số và “bằng một phần của…”" },
      {
        t: "p",
        text: "Khi số thứ hai **nhỏ hơn** số thứ nhất, bạn nói ngược lại: “bằng một nửa”, “bằng một phần năm”. Phân số (fraction) cũng là cách đổi phần trăm sang chữ để bài không toàn con số: 25% = a quarter, 33% ≈ a third, 20% = a fifth.",
      },
      {
        t: "table",
        caption: "Đổi phần trăm sang phân số. Số lẻ thì thêm just over / just under / almost / roughly.",
        head: ["Phần trăm", "Phân số", "Số lẻ gần đó"],
        rows: [
          ["10%", "a tenth · one in ten", "9% = **just under** a tenth"],
          ["20%", "a fifth · one in five", "22% = **just over** a fifth"],
          ["25%", "a quarter", "24% = **almost** a quarter"],
          ["33%", "a third · one in three", "35% = **just over** a third"],
          ["50%", "half", "48% = **nearly** half · 52% = **just over** half"],
          ["66%", "two-thirds", "65% = **roughly** two-thirds"],
          ["75%", "three-quarters", "77% = **over** three-quarters"],
          ["90%", "nine-tenths · the vast majority", "92% = **the vast majority**"],
        ],
      },
      {
        t: "patterns",
        rows: [
          {
            formula: "S + be + half / a third / a quarter / a fifth + of + that amount / that figure / the figure for + N",
            vi: "bằng một nửa / một phần ba… của con số vừa nêu",
            examples: [
              { en: "The City Museum received 800,000 visitors, while the Castle Museum attracted half of that figure.", vi: "City Museum đón 800.000 lượt khách, còn Castle Museum thu hút một nửa con số đó." },
              { en: "Spending on transport stood at $500, and spending on clothing was a fifth of that amount.", vi: "Chi cho đi lại ở mức 500 đô, và chi cho quần áo bằng một phần năm số tiền đó." },
            ],
          },
          {
            formula: "S + V + half / a third + as + many / much + N + as + N",
            vi: "chỉ bằng một nửa / một phần ba (cùng khuôn as…as với bội số)",
            examples: [
              { en: "In 2020 the Maritime Museum had half as many visitors as in 2010.", vi: "Năm 2020 Bảo tàng Hàng hải có lượng khách chỉ bằng một nửa năm 2010." },
            ],
          },
          {
            formula: "A quarter / Two-thirds + of + N (số nhiều) + V (số nhiều) · One in five + N (số nhiều) + V",
            vi: "một phần tư số… / cứ năm người thì một người",
            examples: [
              { en: "Two-thirds of the students live at home.", vi: "Hai phần ba số sinh viên sống ở nhà." },
              { en: "One in five adults visits a museum every year.", vi: "Cứ năm người lớn thì một người đi bảo tàng mỗi năm." },
            ],
          },
          {
            formula: "N + account for / make up / represent + a quarter / the majority + of + N",
            vi: "chiếm một phần tư / phần lớn",
            examples: [
              { en: "Housing accounted for just over a third of household spending.", vi: "Nhà ở chiếm hơn một phần ba một chút trong chi tiêu hộ gia đình." },
            ],
          },
        ],
      },
      {
        t: "note",
        title: "⚠️ Lỗi hay sai với phân số",
        items: [
          "~~a half of the students~~ → **half (of) the students**. half thường không có a khi theo sau là of + N.",
          "~~two third~~ / ~~three quarter~~ → **two-thirds**, **three-quarters**. Tử số từ 2 trở lên thì mẫu số thêm **s**.",
          "~~a fifth of that amount of people~~ — **amount** chỉ đi với danh từ không đếm được (money, energy, time). Với người / vật đếm được dùng **number / figure**: a fifth of **that number**.",
          "Chia động từ theo danh từ sau of: Two-thirds of **the water is**… · Two-thirds of **the students are**…",
          "**one in five** + danh từ số nhiều: one in five **adults**. Động từ chia số ít (visits) là chuẩn văn viết; số nhiều (visit) cũng gặp trong báo chí — bài thi cứ dùng số ít.",
          "~~the half~~ / ~~the quarter~~ → **half**, **a quarter**. Chỉ dùng the khi nói phần cụ thể: **the first half of** the period.",
          "Đừng đổi sang phân số khi phải bẻ số quá nhiều: 43% không phải “half”, cũng không phải “a third”. Giữ **43%** hoặc viết **just over two-fifths** nếu chắc.",
        ],
      },
      { t: "rule", formula: "S + be + half / a third / a fifth + of + that amount / that figure · half as many + N + as", vi: "Số nhỏ so với số lớn. amount cho thứ không đếm được, number / figure cho thứ đếm được." },
      {
        t: "quiz",
        id: "t3d11-phan-so-dich",
        title: "Dịch Việt → Anh — phân số (4 câu)",
        kind: "translate",
        grammar: "half / a quarter / a fifth of that figure · just over a third of · one in five + N số nhiều · half as many … as",
        items: [
          { q: "Nhà ở chiếm hơn một phần ba một chút trong tổng chi tiêu.", answers: ["Housing accounted for just over a third of total spending.", "Housing made up just over a third of total spending.", "Housing accounted for just over a third of total expenditure.", "Housing accounted for just over one third of total spending."], hint: "accounted for · just over a third of · total spending" },
          { q: "Cứ năm người lớn thì một người đi bảo tàng mỗi năm.", answers: ["One in five adults visits a museum every year.", "One in five adults visits a museum each year.", "One in five adults visit a museum every year.", "One in five adults goes to a museum every year."], hint: "one in five adults" },
          { q: "Chi cho quần áo bằng một phần năm số tiền đó.", answers: ["Spending on clothing was a fifth of that amount.", "Spending on clothes was a fifth of that amount.", "Spending on clothing was one fifth of that amount.", "Expenditure on clothing was a fifth of that amount."], hint: "spending on clothing · a fifth of that amount" },
          { q: "Năm 2020, Maritime Museum có lượng khách chỉ bằng một nửa năm 2010.", answers: ["In 2020, the Maritime Museum had half as many visitors as in 2010.", "In 2020 the Maritime Museum had half as many visitors as in 2010.", "In 2020, the Maritime Museum received half as many visitors as in 2010."], hint: "half as many visitors as" },
        ],
      },
      {
        t: "mcq",
        id: "t3d11-phan-so-luyen",
        title: "Phân số — chọn đáp án đúng (6 câu)",
        items: [
          { q: "1. 24% of households had no car. →", options: ["A Just over a quarter of households had no car.", "B Almost a quarter of households had no car.", "C A fifth of households had no car.", "D Nearly a third of households had no car."], correct: 1, why: "24% thấp hơn 25% một chút → almost / nearly / just under a quarter. just over a quarter = 26–27%." },
          { q: "2. Chọn câu ĐÚNG.", options: ["A Two third of the students live at home.", "B Two-thirds of the students lives at home.", "C Two-thirds of the students live at home.", "D Two-third of students live at home."], correct: 2, why: "Tử số 2 → thirds có s; động từ chia theo the students (số nhiều) → live." },
          { q: "3. Transport: $500 · Clothing: $100. → Spending on clothing was ___ of that amount.", options: ["A a quarter", "B half", "C a third", "D a fifth"], correct: 3, why: "100 ÷ 500 = 1/5 → a fifth." },
          { q: "4. 3,000 students chose French; 600 chose German. → The number choosing German was a fifth of that ___.", options: ["A number", "B amount", "C quantity", "D rate"], correct: 0, why: "students đếm được → number / figure. amount dành cho danh từ không đếm được (money, water)." },
          { q: "5. 52% of respondents → ___ of respondents", options: ["A nearly half", "B a half", "C just over half", "D the half"], correct: 2, why: "52% cao hơn 50% một chút → just over half. nearly half = 48–49%. Không viết a half of / the half." },
          { q: "6. Chọn câu ĐÚNG.", options: ["A One in five adult visits a museum.", "B One in five adults visits a museum.", "C One of five adults visits a museum.", "D One in fifth adults visits a museum."], correct: 1, why: "one in five + danh từ SỐ NHIỀU (adults). Giới từ là in, số đếm là five (không phải fifth)." },
        ],
      },

      { t: "h", text: "5. So sánh kép: the more…, the more… và more and more" },
      {
        t: "p",
        text: "**So sánh kép** (double comparative) nói hai thứ **cùng thay đổi theo nhau**: cái này càng tăng thì cái kia càng tăng (hoặc giảm). Đây là cấu trúc ăn điểm GRA ở cả Task 2 (lập luận nhân – quả), Task 1 (tương quan giữa hai biến) và Speaking Part 3.",
      },
      {
        t: "patterns",
        rows: [
          {
            formula: "The + adj-er / more + adj + S + V, the + adj-er / more + adj + S + V",
            vi: "càng… càng… (hai vế đều bắt đầu bằng the + so sánh hơn, giữa có dấu phẩy)",
            examples: [
              { en: "The higher the level of education, the higher the average salary.", vi: "Trình độ học vấn càng cao thì lương trung bình càng cao." },
              { en: "The more people drive, the worse the air quality becomes.", vi: "Càng nhiều người lái xe thì chất lượng không khí càng tệ đi." },
            ],
          },
          {
            formula: "The more + N + S + V, the less / the fewer + N + S + V",
            vi: "càng nhiều… càng ít…",
            examples: [
              { en: "The more time children spend on screens, the less exercise they get.", vi: "Trẻ càng dành nhiều thời gian trước màn hình thì càng ít vận động." },
              { en: "The older the age group, the fewer people used social media.", vi: "Nhóm tuổi càng cao thì càng ít người dùng mạng xã hội." },
            ],
          },
          {
            formula: "S + be + getting / becoming + adj-er and adj-er / more and more + adj",
            vi: "ngày càng… (một thứ thay đổi liên tục)",
            examples: [
              { en: "Housing is becoming more and more expensive.", vi: "Nhà ở ngày càng đắt đỏ." },
              { en: "The gap grew wider and wider.", vi: "Khoảng cách ngày càng rộng ra." },
            ],
          },
          {
            formula: "S + be + increasingly + adj · an increasing / a growing number of + N",
            vi: "ngày càng… (bản học thuật của more and more — nên dùng trong Writing)",
            examples: [
              { en: "Online shopping is increasingly popular among older people.", vi: "Mua sắm trực tuyến ngày càng phổ biến ở người lớn tuổi." },
              { en: "A growing number of students are choosing to study abroad.", vi: "Ngày càng nhiều sinh viên chọn du học." },
            ],
          },
        ],
      },
      {
        t: "table",
        caption: "Vế “the more…” được rút gọn thế nào — hay gặp trong Task 1.",
        head: ["Dạng", "Ví dụ", "Ghi chú"],
        rows: [
          ["Đủ S + V", "The more you practise, the more fluent you become.", "Văn nói, Task 2."],
          ["Bỏ động từ be", "The higher the income, the greater the spending on travel.", "Hai vế là cụm danh từ — rất gọn, hợp Task 1."],
          ["Một vế ngắn", "The sooner, the better.", "Câu nói sẵn, dùng trong Speaking."],
          ["Tương quan nghịch", "The lower the price, the higher the demand.", "Một vế tăng, một vế giảm."],
        ],
      },
      {
        t: "note",
        title: "⚠️ Lỗi hay sai với so sánh kép",
        items: [
          "~~More people drive, more the air is polluted~~ → **The** more people drive, **the** more polluted the air is. Mỗi vế phải có **the**.",
          "Từ so sánh phải **đứng ngay sau the**, không để cuối vế: ~~The people drive more, the air becomes worse~~ → **The more** people drive, **the worse** the air becomes.",
          "~~The more higher~~ → **The higher**. Luật -er / more vẫn như cũ.",
          "Vế trước **không dùng will**: ~~The more you will practise~~ → The more you **practise**, the better you **will** become. (Giống mệnh đề if — Tập 2 Ngày 13.)",
          "~~more and more higher~~ → **higher and higher**. ~~more and more people is~~ → more and more people **are**.",
          "Trong Writing, đừng viết more and more quá một lần mỗi bài. Đổi sang **increasingly** + adj hoặc **a growing number of** + N.",
        ],
      },
      { t: "rule", formula: "The + adj-er / more… + S + V, the + adj-er / more… + S + V", vi: "Càng… càng…: mỗi vế một chữ the, từ so sánh đứng ngay sau the, vế đầu không có will." },
      {
        t: "quiz",
        id: "t3d11-so-sanh-kep-dich",
        title: "Dịch Việt → Anh — so sánh kép (5 câu)",
        kind: "translate",
        grammar: "The + so sánh hơn + S + V, the + so sánh hơn + S + V · increasingly + adj · a growing number of + N",
        items: [
          { q: "Trình độ học vấn càng cao thì lương trung bình càng cao.", answers: ["The higher the level of education, the higher the average salary.", "The higher the level of education is, the higher the average salary is.", "The higher the level of education, the higher the average salary is."], hint: "The higher the level of education, the higher…" },
          { q: "Càng nhiều người lái xe thì không khí càng ô nhiễm.", answers: ["The more people drive, the more polluted the air becomes.", "The more people drive, the more polluted the air is.", "The more people drive, the more polluted the air gets."], hint: "The more people drive, the more polluted the air…" },
          { q: "Nhóm tuổi càng cao thì càng ít người dùng mạng xã hội.", answers: ["The older the age group, the fewer people used social media.", "The older the age group, the fewer people use social media.", "The older the age group is, the fewer people use social media."], hint: "The older the age group, the fewer people…" },
          { q: "Nhà ở ngày càng đắt đỏ ở các thành phố lớn.", answers: ["Housing is becoming increasingly expensive in big cities.", "Housing is increasingly expensive in big cities.", "Housing is becoming more and more expensive in big cities.", "Housing is becoming increasingly expensive in large cities.", "Housing is getting more and more expensive in big cities."], hint: "housing · increasingly expensive / more and more expensive" },
          { q: "Ngày càng nhiều sinh viên chọn du học.", answers: ["A growing number of students are choosing to study abroad.", "An increasing number of students are choosing to study abroad.", "More and more students are choosing to study abroad.", "A growing number of students choose to study abroad."], hint: "a growing number of students · choose to study abroad" },
        ],
      },
      {
        t: "quiz",
        id: "t3d11-so-sanh-kep-luyen",
        title: "Viết lại bằng “The…, the…” — điền các từ còn thiếu (5 câu)",
        kind: "fill",
        items: [
          { q: "1. If a city is bigger, its housing is more expensive. → The bigger the city, ___ ___ ___ its housing. (3 từ)", answers: ["the more expensive"] },
          { q: "2. When you read more, your vocabulary gets wider. → The more you read, ___ ___ your vocabulary gets. (2 từ)", answers: ["the wider"] },
          { q: "3. If people earn more, they spend more on travel. → ___ ___ people earn, the more they spend on travel. (2 từ)", answers: ["The more"] },
          { q: "4. As the price falls, demand rises. → The lower the price, ___ ___ the demand. (2 từ)", answers: ["the higher", "the greater"] },
          { q: "5. When we act sooner, the result is better. → The sooner we act, ___ ___. (2 từ)", answers: ["the better"] },
        ],
      },

      { t: "h", text: "6. Không so lệch vế: that of / those of — và từ nối so sánh" },
      {
        t: "p",
        text: "Lỗi so sánh tốn điểm nhất của người Việt là **so lệch vế** (so giá với một thành phố, so dân số với một nước). Tiếng Việt nói “giá ở Hà Nội cao hơn Huế” vẫn hiểu; tiếng Anh thì hai vế phải **cùng loại**: giá với giá, dân số với dân số. Từ thay thế cho danh từ đã nêu là **that** (số ít / không đếm được) và **those** (số nhiều).",
      },
      {
        t: "table",
        caption: "So lệch vế và cách sửa.",
        head: ["Câu lệch", "Vì sao lệch", "Câu đúng"],
        rows: [
          ["~~The population of India is larger than Brazil.~~", "dân số ↔ một nước", "The population of India is larger than **that of** Brazil."],
          ["~~Prices in London are higher than Leeds.~~", "giá ↔ một thành phố", "Prices in London are higher than **those in** Leeds. / …than **in** Leeds."],
          ["~~The figure for men was higher than women.~~", "con số ↔ phụ nữ", "The figure for men was higher than **that for** women."],
          ["~~Salaries of doctors are higher than nurses.~~", "lương ↔ y tá", "Salaries of doctors are higher than **those of** nurses."],
          ["~~Japan's exports were bigger than Korea.~~", "xuất khẩu ↔ một nước", "Japan's exports were bigger than **Korea's**."],
        ],
      },
      {
        t: "patterns",
        rows: [
          {
            formula: "N (số ít) + of / for / in + A + be + adj-er + than + that + of / for / in + B",
            vi: "that thay cho danh từ số ít hoặc không đếm được",
            examples: [
              { en: "The unemployment rate in Spain was higher than that in Italy.", vi: "Tỉ lệ thất nghiệp ở Tây Ban Nha cao hơn ở Ý." },
            ],
          },
          {
            formula: "N (số nhiều) + of / for / in + A + be + adj-er + than + those + of / for / in + B",
            vi: "those thay cho danh từ số nhiều",
            examples: [
              { en: "Sales in the north were lower than those in the south.", vi: "Doanh số ở miền bắc thấp hơn ở miền nam." },
            ],
          },
          {
            formula: "S + V, whereas / while + S + V",
            vi: "trong khi đó (nối hai vế đối lập trong MỘT câu)",
            examples: [
              { en: "Men preferred football, whereas women favoured swimming.", vi: "Nam thích bóng đá, trong khi nữ ưa bơi lội." },
            ],
          },
          {
            formula: "Compared with / to + N, S + V · In comparison with + N, S + V · S + V + compared with + N",
            vi: "so với…",
            examples: [
              { en: "Compared with 2010, far fewer people bought newspapers in 2020.", vi: "So với năm 2010, năm 2020 ít người mua báo hơn nhiều." },
              { en: "Only 12% of men cycled, compared with 20% of women.", vi: "Chỉ 12% nam đạp xe, so với 20% nữ." },
            ],
          },
          {
            formula: "A and B + V + X and Y + respectively",
            vi: "lần lượt là (ghép hai số vào một câu, đúng thứ tự)",
            examples: [
              { en: "France and Spain produced 30 and 22 million tonnes respectively.", vi: "Pháp và Tây Ban Nha sản xuất lần lượt 30 và 22 triệu tấn." },
            ],
          },
        ],
      },
      {
        t: "note",
        title: "⚠️ Lỗi hay sai với that / those, whereas, respectively",
        items: [
          "Chọn that / those theo **danh từ được thay**, không theo danh từ đứng sau: The **number** of cars… than **that** of bicycles (number số ít → that, dù bicycles số nhiều).",
          "Giới từ sau that / those **giống** giới từ ở vế đầu: the figure **for** men… that **for** women · the population **of** A… that **of** B.",
          "~~Whereas men preferred football. Women favoured swimming.~~ — whereas / while nối hai vế trong **một** câu, không đứng một mình thành câu. Muốn tách câu thì dùng **In contrast,** / **By contrast,**.",
          "~~compare to 2010~~ / ~~comparing with 2010~~ → **compared with / to** 2010 (dạng V3).",
          "~~The figures were 30 and 22 respectively.~~ khi trước đó chưa nêu hai chủ thể → người đọc không biết số nào của ai. respectively cần **hai chủ thể + hai con số cùng thứ tự**.",
          "**the same as** (không ~~the same with~~, không ~~the same like~~) · **similar to** · **different from** · **in contrast to**.",
        ],
      },
      { t: "rule", formula: "N + of / for A + be + adj-er + than + that / those + of / for B", vi: "So sánh cùng loại: con số với con số. that cho số ít, those cho số nhiều; giới từ lặp lại như vế đầu." },
      {
        t: "quiz",
        id: "t3d11-that-of-dich",
        title: "Dịch Việt → Anh — so sánh không lệch vế (4 câu)",
        kind: "translate",
        grammar: "than that of / that for / those in · whereas · compared with · respectively",
        items: [
          { q: "Dân số Ấn Độ lớn hơn dân số Brazil.", answers: ["The population of India is larger than that of Brazil.", "The population of India is bigger than that of Brazil.", "India's population is larger than Brazil's.", "India's population is larger than that of Brazil."], hint: "the population of India · larger than that of" },
          { q: "Con số của nam cao hơn con số của nữ.", answers: ["The figure for men was higher than that for women.", "The figure for men is higher than that for women.", "The figure for men was higher than the figure for women."], hint: "the figure for men · higher than that for" },
          { q: "Nam thích bóng đá, trong khi nữ ưa bơi lội.", answers: ["Men preferred football, whereas women favoured swimming.", "Men preferred football, while women favoured swimming.", "Men preferred football, whereas women preferred swimming.", "Men preferred football whereas women favoured swimming."], hint: "preferred · whereas · favoured" },
          { q: "Chỉ 12% nam đạp xe, so với 20% nữ.", answers: ["Only 12% of men cycled, compared with 20% of women.", "Only 12% of men cycled, compared to 20% of women.", "Only 12% of men cycled compared with 20% of women."], hint: "only 12% of men cycled · compared with" },
        ],
      },
      {
        t: "quiz",
        id: "t3d11-that-of-luyen",
        title: "Điền that / those / respectively / whereas / compared (6 câu)",
        kind: "fill",
        items: [
          { q: "1. The price of gas was lower than ___ of electricity.", answers: ["that"] },
          { q: "2. Wages in the city were much higher than ___ in rural areas.", answers: ["those"] },
          { q: "3. Tea and coffee made up 40% and 35% of sales ___.", answers: ["respectively"] },
          { q: "4. Young people mostly rented, ___ older people tended to own their homes.", answers: ["whereas", "while"] },
          { q: "5. Only 8% of journeys were made by bike, ___ with 61% by car.", answers: ["compared"] },
          { q: "6. The number of male applicants was almost double ___ of female applicants.", answers: ["that"] },
        ],
      },

      { t: "h", text: "7. Từ vựng: 14 từ so sánh và tỉ lệ cho Task 1 (vòng 3)" },
      {
        t: "p",
        text: "Tập 1 Ngày 11 và Tập 2 Ngày 10 đã dạy từ chỉ xu hướng (rise, fall, peak). Mười bốn từ dưới đây là phần **so sánh và tỉ lệ** — nhóm từ bạn sẽ dùng ngay ở bài Viết Ngày 12 (bar chart nhiều nhóm).",
      },
      {
        t: "vocab",
        items: [
          { w: "proportion", pos: "n", ipa: "/prəˈpɔːʃn/", vi: "tỉ lệ, phần (trong một tổng)", ex: "The proportion of people working from home doubled.", exVi: "Tỉ lệ người làm việc tại nhà tăng gấp đôi.", more: "**a large / small / significant proportion of** + N · khác **percentage** (luôn là con số %) — proportion có thể là phân số." },
          { w: "majority", pos: "n", ipa: "/məˈdʒɒrəti/", vi: "đa số (trên 50%)", ex: "The majority of visitors were aged under 30.", exVi: "Đa số khách tham quan dưới 30 tuổi.", more: "**the vast / overwhelming majority** (≥ 85–90%) · **a slim / narrow majority** (51–55%) · the majority of + N số nhiều + V số nhiều." },
          { w: "minority", pos: "n", ipa: "/maɪˈnɒrəti/", vi: "thiểu số (dưới 50%)", ex: "Only a small minority chose to travel by train.", exVi: "Chỉ một thiểu số nhỏ chọn đi tàu.", more: "**a small / tiny / significant minority** · trái nghĩa: majority." },
          { w: "respectively", pos: "adv", ipa: "/rɪˈspektɪvli/", vi: "lần lượt là (theo đúng thứ tự vừa nêu)", ex: "Men and women spent 4 and 6 hours respectively.", exVi: "Nam và nữ dành lần lượt 4 và 6 giờ.", more: "Đứng **cuối câu**, sau hai con số. Đừng nhầm với **respectfully** (một cách kính trọng)." },
          { w: "counterpart", pos: "n", ipa: "/ˈkaʊntəpɑːt/", vi: "bên tương ứng (nhóm cùng vai ở phía bên kia)", ex: "Male graduates earned more than their female counterparts.", exVi: "Nam sinh viên tốt nghiệp kiếm nhiều hơn các bạn nữ tương ứng.", more: "**their female / urban / European counterparts** · chỉ dùng khi hai nhóm cùng vai (ôn Tập 2 Ngày 8)." },
          { w: "fourfold", pos: "adj / adv", ipa: "/ˈfɔːfəʊld/", vi: "gấp bốn lần", ex: "There was a fourfold increase in online sales.", exVi: "Doanh số trực tuyến tăng gấp bốn.", more: "**twofold · threefold · fivefold · tenfold** · rise **fourfold** (adv) · a **fourfold** rise (adj). Không thêm s." },
          { w: "quadruple", pos: "v", ipa: "/kwɒˈdruːpl/", vi: "tăng gấp bốn", ex: "The number of users quadrupled in five years.", exVi: "Số người dùng tăng gấp bốn trong năm năm.", more: "**double → triple → quadruple** · ngược lại: **halve** (giảm một nửa)." },
          { w: "halve", pos: "v", ipa: "/hɑːv/", vi: "giảm một nửa", ex: "Sales of printed newspapers halved over the decade.", exVi: "Doanh số báo in giảm một nửa trong thập kỷ đó.", more: "Chữ **l câm**. Họ từ: **half** (n) · **halve** (v) · fall **by half**." },
          { w: "marginally", pos: "adv", ipa: "/ˈmɑːdʒɪnəli/", vi: "một chút, không đáng kể", ex: "Prices were marginally higher in the second quarter.", exVi: "Giá cao hơn một chút trong quý hai.", more: "= **slightly**. Họ từ: **marginal** (adj) — a marginal increase." },
          { w: "considerably", pos: "adv", ipa: "/kənˈsɪdərəbli/", vi: "đáng kể, nhiều", ex: "The figure for Canada was considerably lower.", exVi: "Con số của Canada thấp hơn đáng kể.", more: "= **significantly, substantially**. Họ từ: **considerable** (adj) — a considerable difference." },
          { w: "exceed", pos: "v", ipa: "/ɪkˈsiːd/", vi: "vượt quá", ex: "Imports exceeded exports throughout the period.", exVi: "Nhập khẩu vượt xuất khẩu suốt giai đoạn.", more: "exceed + số / + N (không có giới từ): ~~exceed over 50%~~ → exceed 50%. Họ từ: **excess** (n), **excessive** (adj)." },
          { w: "gap", pos: "n", ipa: "/ɡæp/", vi: "khoảng cách, độ chênh", ex: "The gap between the two groups narrowed to five percentage points.", exVi: "Khoảng cách giữa hai nhóm thu hẹp còn năm điểm phần trăm.", more: "**the gap between A and B** · **widen / narrow / close** the gap · a **gender / income** gap." },
          { w: "disparity", pos: "n", ipa: "/dɪˈspærəti/", vi: "sự chênh lệch lớn (thường là bất công)", ex: "There was a clear disparity between urban and rural incomes.", exVi: "Có sự chênh lệch rõ giữa thu nhập thành thị và nông thôn.", more: "**a disparity between A and B / in + N** · trang trọng hơn **difference**; dùng tốt trong Task 2." },
          { w: "comparable", pos: "adj", ipa: "/ˈkɒmpərəbl/", vi: "tương đương, ngang nhau", ex: "The two countries had comparable levels of spending.", exVi: "Hai nước có mức chi tiêu tương đương.", more: "**comparable to / with** + N. Trọng âm ở âm tiết **đầu**: COM-parable. Họ từ: compare (v), comparison (n), comparatively (adv)." },
        ],
      },
      {
        t: "note",
        title: "📌 percentage · proportion · percentage point — ba thứ khác nhau",
        items: [
          "**percentage** = con số phần trăm: The **percentage** of smokers fell **from 30% to 24%**.",
          "**proportion** = phần trong tổng, có thể viết bằng % hoặc phân số: A large **proportion** (two-thirds) of students…",
          "**percentage point** = điểm phần trăm, dùng khi nói **độ chênh** giữa hai số %: 30% → 24% là giảm **6 percentage points** (không phải giảm 6%; giảm 6% của 30 chỉ là 1,8).",
          "**rate** dùng cho tỉ lệ có tên riêng: unemployment rate, birth rate, crime rate. **ratio** = tỉ số A : B (the ratio of teachers to students was 1 to 20).",
        ],
      },

      { t: "h", text: "8. Dùng trong bài thi: band 5 → band 6" },
      {
        t: "table",
        caption: "Cùng một cặp số, viết ở hai mức. Cột phải là câu bạn nên tập viết lại cho thuộc.",
        head: ["Số liệu", "Band 5 — liệt kê", "Band 6 — có quan hệ so sánh"],
        rows: [
          ["Cars 64% · Bikes 16%", "Cars were 64%. Bikes were 16%.", "Cars were by far the most common choice, at 64%, **four times the figure for** bicycles."],
          ["Men 20 hrs · Women 10 hrs", "Men played 20 hours and women played 10 hours.", "Men spent **twice as much time** playing sport **as** women (20 hours compared with 10)."],
          ["A: $900 · B: $880", "A was $900 and B was $880, so A was higher.", "Spending in A was only **marginally higher than that in** B."],
          ["2010: 5% · 2020: 20%", "It increased a lot from 5% to 20%.", "The figure **rose fourfold**, from 5% to 20%."],
          ["18–24: 90% · 65+: 30%", "Young people used it more than old people.", "**The older the age group, the lower** the rate of use: 90% of 18–24-year-olds, but only **a third of that figure** among the over-65s."],
        ],
      },
      {
        t: "note",
        title: "💡 Mẹo chọn cấu trúc trong 5 giây",
        items: [
          "Hai số **gần bằng nhau** → slightly / marginally higher · almost as…as · similar.",
          "Một số **chia hết** cho số kia (2, 3, 4…) → twice / three times as…as · double · fourfold.",
          "Số nhỏ là **1/2, 1/3, 1/4, 1/5** của số lớn → half / a third / a quarter / a fifth of that figure.",
          "Một hạng mục **bỏ xa** tất cả → by far the + so sánh nhất.",
          "Số liệu **tăng / giảm đều theo nhóm** (tuổi, thu nhập) → The + so sánh hơn…, the + so sánh hơn…",
          "Mỗi thân bài Task 1 nên có **2–3 câu so sánh** kiểu này. Nhiều hơn thì bài thành bài toán; ít hơn thì thành liệt kê.",
        ],
      },
      {
        t: "mcq",
        id: "t3d11-np-tong-hop",
        title: "Kiểm tra cuối bài — chọn đáp án đúng (10 câu)",
        items: [
          { q: "1. Chọn câu ĐÚNG.", options: ["A Rents in London were twice higher than in Leeds.", "B Rents in London were twice as high as in Leeds.", "C Rents in London were as twice high as in Leeds.", "D Rents in London were two times more high than in Leeds."], correct: 1, why: "twice + as + adj + as. twice không đi với so sánh hơn; bội số đứng trước chữ as đầu tiên." },
          { q: "2. Oil: 58% · Gas: 15% · Coal: 14% · Others: 13%. → Oil was ___ source of energy.", options: ["A far the largest", "B the by far largest", "C much the larger", "D by far the largest"], correct: 3, why: "by far + the + so sánh nhất." },
          { q: "3. The number of tourists rose from 2 million to 6 million. → It ___.", options: ["A tripled", "B doubled", "C quadrupled", "D halved"], correct: 0, why: "6 ÷ 2 = 3 → tripled / rose threefold." },
          { q: "4. The birth rate in Korea was lower than ___ Japan.", options: ["A those of", "B it of", "C that of", "D the one of"], correct: 2, why: "the birth rate (số ít) → that; giới từ ở đây có thể là of hoặc in — trong bốn phương án chỉ that of đúng." },
          { q: "5. ___ people earn, ___ they tend to spend on leisure.", options: ["A More / more", "B The more / more", "C More / the more", "D The more / the more"], correct: 3, why: "So sánh kép: mỗi vế phải có the." },
          { q: "6. Chọn câu ĐÚNG.", options: ["A A third of the budget were spent on health.", "B A third of the budget was spent on health.", "C The third of the budget was spent on health.", "D One three of the budget was spent on health."], correct: 1, why: "a third of + the budget (không đếm được, số ít) → was. Không dùng the third khi nói phân số." },
          { q: "7. Men and women spent 12 and 9 hours ___ on housework.", options: ["A respectfully", "B comparatively", "C respectively", "D relatively"], correct: 2, why: "respectively = lần lượt là. respectfully = một cách kính trọng." },
          { q: "8. Urban workers earned far more than their rural ___.", options: ["A counterparts", "B competitors", "C partners", "D opposites"], correct: 0, why: "counterparts = nhóm cùng vai ở phía bên kia (lao động nông thôn ↔ lao động thành thị)." },
          { q: "9. The share fell from 40% to 30%. → It fell by ten ___.", options: ["A per cent", "B percentages", "C proportions", "D percentage points"], correct: 3, why: "Độ chênh giữa hai số % tính bằng percentage points. Giảm 10% của 40 chỉ là 4." },
          { q: "10. Chọn câu ĐÚNG.", options: ["A Only 9% cycled, comparing with 64% who drove.", "B Only 9% cycled, compare to 64% who drove.", "C Only 9% cycled, compared with 64% who drove.", "D Only 9% cycled, whereas 64% who drove."], correct: 2, why: "compared with / to (dạng V3). D sai vì sau whereas phải là mệnh đề đủ: whereas 64% drove (bỏ who)." },
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI 2 — ĐỌC ═══════════════════════════ */
  {
    id: "t3d11-doc",
    kind: "reading",
    title: "Đọc: Multiple choice 2 — loại ba đáp án sai",
    goal: "Làm đúng ít nhất 9/13 câu trắc nghiệm một đáp án (A–D) trên một bài đọc ~880 từ trong 20 phút bằng cách gọi tên được sáu kiểu phương án sai (đúng chữ sai ý · đúng một nửa · không nhắc · ngược nghĩa · đúng nhưng lạc câu hỏi · nói quá) và loại từng phương án có lý do — mức Reading band 6.",
    minutes: 65,
    blocks: [
      {
        t: "recap",
        title: "Bài này học gì · đẩy band nào",
        items: [
          "Tập 2 Ngày 10 đã dạy **bốn loại câu hỏi** trắc nghiệm (chi tiết · ý chính · mục đích · suy luận) và cách gạch từ khoá phân biệt. Hôm nay học nửa còn lại: ==ba phương án sai được làm ra thế nào==.",
          "Ở band 6, cả bốn phương án đều “nghe có vẻ đúng” vì đều lấy chữ từ bài. Người band 5 chọn phương án có **nhiều chữ giống bài nhất** — và đó thường là bẫy.",
          "Cách làm của band 6: ==loại ba, giữ một==. Mỗi phương án bị loại phải có một lý do gọi được tên (6 kiểu sai ở mục 2).",
          "Bài luyện: “Bread from the Air” — 8 đoạn, ~880 từ, thể loại lịch sử khoa học (phân đạm tổng hợp đã nuôi sống thế giới thế nào, và cái giá của nó), 13 câu, 20 phút. Đạt: ≥ 9/13.",
          "Bài đọc dùng nhiều cấu trúc so sánh của bài Ngữ pháp hôm nay (by far the largest, two hundred times that of, at a fraction of the cost, the more…, the less…, twice as much… as) — đọc xong sẽ soi lại.",
        ],
      },

      { t: "h", text: "1. Trắc nghiệm ở band 6 khó hơn Tập 2 chỗ nào?" },
      {
        t: "table",
        caption: "So với bài Tập 2 Ngày 10.",
        head: ["", "Tập 2 (band 5)", "Tập 3 (band 6)"],
        rows: [
          ["Độ dài bài", "500–600 từ", "800–900 từ — phải tìm vùng nhanh hơn"],
          ["Phương án đúng", "Đổi từ đồng nghĩa (cheap → inexpensive)", "Đổi cả cấu trúc và loại từ (its deposits were finite → the supply would eventually run out)"],
          ["Phương án sai", "Thường có một cái sai rõ", "Cả ba đều lấy chữ trong bài; sai ở **quan hệ** giữa các chữ"],
          ["Câu hỏi", "Phần lớn hỏi chi tiết", "Thêm câu hỏi **mục đích** (Why does the writer mention…?) và câu **toàn bài**"],
          ["Thứ tự", "Theo thứ tự bài", "Vẫn theo thứ tự bài — câu toàn bài đứng cuối"],
        ],
      },
      {
        t: "note",
        title: "📌 Hai điều không đổi — bám vào đó",
        items: [
          "Câu hỏi trắc nghiệm **đi theo thứ tự bài đọc**. Tìm được vùng của câu 3 thì câu 4 nằm sau đó, không nằm trước.",
          "Mỗi câu chỉ cần đọc kỹ **2–4 câu văn**. Bài 850 từ nhưng phần phải đọc kỹ cho 13 câu chỉ khoảng 350 từ.",
        ],
      },

      { t: "h", text: "2. Sáu kiểu phương án sai — gọi được tên là loại được" },
      {
        t: "p",
        text: "Người ra đề không bịa phương án sai từ hư không. Họ lấy chính câu văn trong bài rồi **bẻ đi một chút**. Có sáu cách bẻ. Thuộc sáu cách này, bạn nhìn một phương án là biết nó đáng ngờ ở đâu.",
      },
      {
        t: "table",
        caption: "Sáu kiểu phương án sai. Ví dụ dựa trên câu gốc: “By the early 2000s, vinyl sales had almost disappeared. Record companies blamed compact discs.”",
        head: ["Kiểu sai", "Nó được làm ra thế nào", "Ví dụ phương án sai"],
        rows: [
          ["① Đúng chữ, sai ý", "Chép nguyên vài chữ của bài nhưng ghép thành ý khác", "Compact discs had almost disappeared by the early 2000s."],
          ["② Đúng một nửa", "Nửa đầu khớp bài, nửa sau thêm / đổi", "Vinyl sales fell because of CDs **and high record prices**."],
          ["③ Không nhắc", "Ý hợp lý, nhưng bài không nói", "Music shops refused to sell records."],
          ["④ Ngược nghĩa", "Đảo quan hệ: nguyên nhân ↔ kết quả, tăng ↔ giảm, trước ↔ sau", "CDs lost buyers to vinyl records."],
          ["⑤ Đúng nhưng lạc câu hỏi", "Có thật trong bài, nhưng trả lời cho câu hỏi khác", "(Hỏi “vì sao doanh số giảm?”) → By the early 2000s, vinyl sales had almost disappeared."],
          ["⑥ Nói quá", "Thêm all, always, never, only, the main, completely", "**No** vinyl records were sold after 2000."],
        ],
      },
      {
        t: "sodo",
        kind: "flow",
        title: "Năm bước làm một câu trắc nghiệm band 6",
        steps: [
          { label: "1. Đọc thân câu hỏi", sub: "Gạch từ hỏi (why / what / how) và từ khoá khó đổi (tên riêng, năm, thuật ngữ). Chưa đọc phương án." },
          { label: "2. Tìm vùng", sub: "Dò từ khoá trong bài, bắt đầu từ sau vùng của câu trước. Khoanh 2–4 câu văn." },
          { label: "3. Tự trả lời", sub: "Đọc kỹ vùng đó, tự nói câu trả lời bằng tiếng Việt trong đầu trước khi nhìn A–D." },
          { label: "4. Loại ba", sub: "So từng phương án với vùng đã khoanh. Ghi ký hiệu ①–⑥ cạnh phương án bị loại." },
          { label: "5. Kiểm phương án còn lại", sub: "Chỉ được ra câu trong bài chứng minh nó. Không chỉ được → xem lại bước 2." },
        ],
        caption: "Bước 3 là bước người band 5 bỏ qua. Đọc phương án trước khi hiểu bài là tự để bốn phương án dắt mình.",
      },
      {
        t: "note",
        title: "⚠️ Ba thói quen làm sai trắc nghiệm",
        items: [
          "**Chọn phương án giống bài nhất.** Phương án đúng thường được viết lại bằng lời khác; phương án chép chữ thường là kiểu ①.",
          "**Chọn theo hiểu biết của mình.** “Công nhân phản đối máy móc” nghe hợp lý, nhưng nếu bài không nói thì là kiểu ③. Chỉ bài đọc mới là bằng chứng.",
          "**Dừng ở phương án đầu tiên thấy ổn.** Đọc hết cả bốn. Phương án ⑤ (đúng nhưng lạc câu hỏi) trông rất ổn vì nó có thật trong bài — chỉ đọc lại thân câu hỏi mới loại được.",
        ],
      },
      { t: "rule", formula: "Thân câu hỏi → vùng 2–4 câu → tự trả lời → loại ba (ghi ①–⑥) → chỉ ra câu chứng minh", vi: "Không chọn phương án đúng. Loại ba phương án sai, cái còn lại là đáp án." },

      { t: "h", text: "3. Khởi động — đoạn ngắn, 4 câu" },
      {
        t: "passage",
        title: "Vinyl's Unlikely Comeback",
        intro: "Đoạn tự soạn, khoảng 135 từ. Làm 4 câu bên dưới trong 5 phút; với mỗi phương án bị loại, thử gọi tên kiểu sai ①–⑥.",
        paras: [
          { text: "Vinyl records were once the main way people bought music, but by the early 2000s their sales had almost disappeared. Record companies blamed compact discs, which were smaller and more convenient, and digital downloads, which could be bought without leaving home. In recent years, however, vinyl has made a surprising comeback. Surveys suggest that buyers are attracted less by the sound, which many listeners cannot tell apart from that of a digital file, than by the pleasure of owning a physical object with large cover artwork, and a growing number say they want to support their favourite artists directly. Even so, many in the industry believe that vinyl will remain a small part of the music market unless more factories are built to press the records." },
        ],
      },
      {
        t: "mcq",
        id: "t3d11-doc-khoi-dong",
        title: "Khởi động — chọn đáp án và gọi tên kiểu sai (4 câu)",
        items: [
          { q: "1. Why had vinyl sales almost disappeared by the early 2000s?", options: ["A Buyers complained that the records broke easily.", "B Record companies refused to make records any more.", "C Records faced competition from more convenient formats.", "D Too many factories had been built to press records."], correct: 2, why: "“Record companies **blamed compact discs, which were smaller and more convenient**, and digital downloads” = cạnh tranh từ định dạng tiện hơn → C. A: kiểu ③ không nhắc. B: kiểu ① — có chữ record companies nhưng bài chỉ nói họ đổ lỗi cho CD, không nói họ thôi làm đĩa. D: kiểu ④ ngược nghĩa — bài nói cần xây THÊM nhà máy." },
          { q: "2. According to surveys, what mainly attracts buyers to vinyl today?", options: ["A Records sound better than digital music.", "B Buyers enjoy owning a physical object.", "C Records are more convenient than CDs.", "D Buying records supports artists directly."], correct: 1, why: "“attracted **less by the sound… than by** the pleasure of owning a physical object” → B. A: kiểu ④ — nhiều người còn không phân biệt được với tệp số (cannot tell apart). C: kiểu ④ — chính CD mới là thứ tiện hơn. D: kiểu ⑤ — có trong bài (a growing number… support their favourite artists) nhưng không phải lý do CHÍNH (mainly)." },
          { q: "3. What do many in the industry believe about the future?", options: ["A Vinyl will stay small unless more factories are built.", "B Vinyl will soon outsell all other formats.", "C Enough record factories have already been built.", "D Record prices are certain to fall."], correct: 0, why: "“vinyl will **remain a small part** of the music market **unless more factories are built**” → A. B: kiểu ⑥ nói quá. C: kiểu ④ — unless more… are built = hiện chưa đủ. D: kiểu ③ không nhắc." },
          { q: "4. Ở câu 2, phương án D (“Buying records supports artists directly”) sai theo kiểu nào?", options: ["A ③ Không nhắc trong bài", "B ④ Ngược nghĩa với bài", "C ⑥ Nói quá", "D ⑤ Có trong bài nhưng không trả lời đúng câu hỏi"], correct: 3, why: "Bài CÓ nói chuyện ủng hộ nghệ sĩ, nên không phải ③. Nhưng câu hỏi có chữ **mainly**: lý do chính là được sở hữu một món đồ thật. Từ phân biệt trong thân câu hỏi (mainly, first, originally) quyết định đáp án." },
        ],
      },

      { t: "h", text: "4. Luyện trọn bài — Questions 1–13 (20 phút)" },
      {
        t: "p",
        text: "Bấm giờ **20 phút**. Hai phút đầu: đọc tiêu đề, câu đầu mỗi đoạn và lướt 13 thân câu hỏi (chưa đọc phương án). Mỗi câu hỏi làm đủ năm bước ở mục 2. Câu 13 hỏi toàn bài — làm sau cùng.",
      },
      {
        t: "passage",
        title: "Bread from the Air",
        intro: "Bài đọc tự soạn cho khoá học, 8 đoạn A–H, khoảng 880 từ (mức Passage 2). Số liệu lịch sử được làm tròn; con số nào còn tranh cãi thì bài ghi “by some estimates”. Questions 1–13 ở ngay bên dưới.",
        paras: [
          { label: "A", text: "In 1898 the British scientist William Crookes gave a speech that alarmed his audience. The world's population was rising fast, he warned, and unless new sources of fertiliser were found, there would soon not be enough wheat to feed it. The problem was nitrogen. Plants need it to grow, and although almost four-fifths of the air is nitrogen gas, crops cannot use it in that form. Crookes called on chemists to find a way of capturing nitrogen from the atmosphere. Within twenty years they had done so, and many historians now regard their solution as one of the turning points of the twentieth century." },
          { label: "B", text: "Until then, farmers had depended on natural sources. They spread animal manure on their fields and grew crops such as beans and clover, whose roots host bacteria that can take nitrogen directly from the air. From the middle of the nineteenth century they also bought imported fertiliser: first guano, the dried droppings of seabirds, dug from islands off the coast of Peru, and later sodium nitrate, mined in the deserts of northern Chile. Chile was by far the largest supplier, but its deposits were finite, and the same nitrate was needed to make explosives. In practice, the more nitrate a country set aside for weapons, the less was left for its farms." },
          { label: "C", text: "The breakthrough came in 1909, in a university laboratory in Karlsruhe, Germany. The chemist Fritz Haber showed that nitrogen from the air could be made to combine with hydrogen to form ammonia, a compound from which fertiliser can be produced. The reaction demanded extreme conditions: a temperature of around 500 degrees Celsius, a pressure roughly two hundred times that of the atmosphere, and a catalyst, a substance that speeds up a chemical reaction without being used up. Haber's apparatus stood on a laboratory bench and produced only about a cupful of liquid ammonia an hour. It showed that the idea could work, but little more than that." },
          { label: "D", text: "Turning this experiment into an industry was the work of Carl Bosch, an engineer at the chemical company BASF. At such high pressures, hydrogen attacked the steel of the reactors and made it brittle, and the first large vessels burst after only a few days. Bosch solved the problem with a reactor that had two walls, so that any hydrogen leaking through the inner lining could escape before it weakened the outer shell. The catalyst was a second obstacle. Haber had used osmium, one of the rarest metals on Earth; Bosch's colleague Alwin Mittasch carried out thousands of tests before finding a mixture based on ordinary iron that worked almost as well at a fraction of the cost. The first factory opened at Oppau in 1913, and its output was soon thousands of times greater than that of Haber's bench-top machine." },
          { label: "E", text: "The timing proved significant. When the First World War broke out in 1914, a British naval blockade cut Germany off from Chilean nitrate. The new plants were quickly adapted to turn ammonia into nitrate for explosives, and many historians believe that without them Germany would have run short of ammunition far sooner than it did. Haber himself went on to direct Germany's chemical weapons programme. Both men later received the Nobel Prize in Chemistry, yet Haber's reputation remains deeply divided: he helped to feed the world, but he also pioneered poison gas." },
          { label: "F", text: "It was after the Second World War, however, that the process transformed the world's food supply. Cheap natural gas provided the hydrogen, factories were built across the world, and global use of nitrogen fertiliser rose roughly tenfold between the early 1960s and the 2010s. New varieties of wheat and rice, bred to respond to heavy feeding, turned that fertiliser into grain: within limits, the more nitrogen farmers applied, the more they harvested. By some estimates, close to half of the people alive today eat food grown with nitrogen that the Haber–Bosch process has taken from the air." },
          { label: "G", text: "Yet the process comes at a price. Making ammonia consumes, by some estimates, around one to two per cent of the world's energy, most of it from fossil fuels. Much of the nitrogen is also wasted. Where fertiliser is cheap, a field may receive twice as much nitrogen as the crop can actually take up, and on average less than half of what is applied is thought to end up in the harvest. Much of the rest washes into rivers and seas, where it feeds algae that use up the oxygen in the water and leave 'dead zones' in which fish cannot survive. Some also escapes into the air as nitrous oxide, a greenhouse gas whose warming effect is roughly three hundred times that of the same amount of carbon dioxide." },
          { label: "H", text: "None of this means that the world can do without synthetic fertiliser. The challenge for this century is a different one: not to produce more nitrogen, but to waste less of it. Some farmers already use satellite images and soil sensors to apply fertiliser only where and when it is needed, and some companies are testing ways of making hydrogen from renewable electricity. Researchers are also trying to breed cereals that, like beans, can work with bacteria to obtain their own nitrogen. If they succeed, part of the job that Haber and Bosch handed to factories could one day return to the soil." },
        ],
      },
      {
        t: "mcq",
        id: "t3d11-doc-cau-1",
        title: "Questions 1–7 — Choose the correct letter, A, B, C or D",
        items: [
          { q: "1. According to paragraph A, what did William Crookes warn about in 1898?", options: ["A Wheat prices would rise sharply.", "B There might soon be too little wheat for the growing population.", "C His speech was a turning point of the twentieth century.", "D Food production was rising faster than the population."], correct: 1, why: "Đoạn A: “unless new sources of fertiliser were found, **there would soon not be enough wheat to feed it**” (it = the world's population) → B. C là kiểu ①: cụm turning point có trong bài, nhưng đó là nhận định của **historians now** về **giải pháp** của các nhà hoá học, không phải về bài phát biểu năm 1898. D: kiểu ④ — dân số mới là thứ tăng nhanh. A: kiểu ③ không nhắc giá." },
          { q: "2. According to paragraph B, why could farmers not rely on Chilean nitrate in the long term?", options: ["A It had to be dug from islands off the coast of Peru.", "B Chile was by far the largest supplier.", "C The deposits would eventually run out.", "D Farmers preferred to grow beans and clover."], correct: 2, why: "Đoạn B: “Chile was by far the largest supplier, **but its deposits were finite**” → C (finite = có hạn = sẽ cạn). B là kiểu ⑤: đúng trong bài, nhưng chữ **but** cho thấy đó không phải điểm yếu. A: kiểu ① — islands off Peru là nơi lấy **guano**, không phải nitrate Chile. D: kiểu ③." },
          { q: "3. The writer mentions that Haber's apparatus produced “only about a cupful of liquid ammonia an hour” in order to show that", options: ["A his discovery was not yet of practical use.", "B he had made errors in his measurements.", "C ammonia was too dangerous to store.", "D the laboratory in Karlsruhe was too small."], correct: 0, why: "Câu hỏi **mục đích**. Ngay sau chi tiết đó: “It showed that the idea could work, **but little more than that**” — sản lượng nhỏ xíu cho thấy phát minh chưa dùng được vào thực tế → A. B, C: kiểu ③. D: kiểu ① — có chữ laboratory, bench nhưng bài không chê phòng thí nghiệm nhỏ." },
          { q: "4. Why did the first large reactors fail?", options: ["A The catalyst was made of a very rare metal.", "B The temperature inside them was too low.", "C Their double walls allowed hydrogen to escape.", "D Hydrogen made their steel walls weak."], correct: 3, why: "Đoạn D: “hydrogen attacked the steel of the reactors and **made it brittle**, and the first large vessels **burst**” → D (brittle → weak). A: kiểu ⑤ — osmium hiếm là một trở ngại thật, nhưng là trở ngại về **chất xúc tác**, không làm lò vỡ. C: kiểu ① — hai lớp vỏ là **cách sửa** của Bosch, không phải nguyên nhân hỏng. B: kiểu ③." },
          { q: "5. What did Alwin Mittasch achieve?", options: ["A He designed the reactor with two walls.", "B He built the first factory at Oppau.", "C He found a much cheaper catalyst that was nearly as effective.", "D He reduced the number of tests needed to find a catalyst."], correct: 2, why: "Đoạn D: Mittasch tìm ra “a mixture based on ordinary iron that **worked almost as well at a fraction of the cost**” → C (almost as well = nearly as effective; a fraction of the cost = much cheaper). A: kiểu ① đổi chủ thể — Bosch thiết kế lò hai lớp. D: kiểu ④ — ông làm **hàng nghìn** phép thử. B: kiểu ③." },
          { q: "6. According to paragraph E, how was Germany able to keep making explosives during the First World War?", options: ["A Its new factories supplied the nitrate it needed.", "B Haber directed its chemical weapons programme.", "C It continued to import nitrate from Chile.", "D The British navy ended its blockade."], correct: 0, why: "Đoạn E: “The new plants were quickly adapted to **turn ammonia into nitrate for explosives**” → A. B: kiểu ⑤ — có thật, nhưng vũ khí hoá học (khí độc) không phải lý do Đức có thuốc nổ. C: kiểu ④ — phong toả đã **cắt** nguồn nitrate Chile. D: kiểu ③." },
          { q: "7. What does the writer say about Haber's reputation?", options: ["A It rests mainly on his Nobel Prize.", "B People still hold sharply different views of him.", "C It improved after he received the Nobel Prize.", "D He was criticised for refusing to work on weapons."], correct: 1, why: "Đoạn E: “Haber's reputation **remains deeply divided**: he helped to feed the world, but he also pioneered poison gas” → B. D: kiểu ④ — ông **chỉ đạo** chương trình vũ khí hoá học. A, C: kiểu ③ — có chữ Nobel Prize nhưng bài không nói danh tiếng dựa vào nó hay tốt lên nhờ nó." },
        ],
      },
      {
        t: "mcq",
        id: "t3d11-doc-cau-2",
        title: "Questions 8–13 — Choose the correct letter, A, B, C or D",
        items: [
          { q: "8. According to paragraph F, what turned the extra fertiliser into larger harvests?", options: ["A cheap natural gas", "B the end of the Second World War", "C factories built across the world", "D new kinds of wheat and rice"], correct: 3, why: "Đoạn F: “**New varieties of wheat and rice**, bred to respond to heavy feeding, **turned that fertiliser into grain**” → D. A và C là kiểu ⑤: có thật trong đoạn F nhưng chúng giúp **làm ra** phân bón, không phải biến phân thành thóc. B: kiểu ① — chữ Second World War chỉ là mốc thời gian, không phải nguyên nhân." },
          { q: "9. What does the writer say about the link between nitrogen and harvests?", options: ["A Using more nitrogen always produced bigger harvests.", "B Harvests grew most when farmers used less nitrogen.", "C Up to a certain point, more nitrogen meant bigger harvests.", "D Bigger harvests made fertiliser cheaper."], correct: 2, why: "Đoạn F: “**within limits, the more nitrogen** farmers applied, **the more** they harvested” → C (within limits = up to a certain point). A: kiểu ⑥ — bỏ giới hạn within limits và thêm always. B: kiểu ④. D: kiểu ③. Chú ý: đây chính là cấu trúc so sánh kép của bài Ngữ pháp." },
          { q: "10. What does the writer say about the energy used to make ammonia?", options: ["A Most of it comes from fossil fuels.", "B It accounts for half of the world's energy.", "C It has fallen steadily since the 1960s.", "D It is greater than that used by any other industry."], correct: 0, why: "Đoạn G: “around one to two per cent of the world's energy, **most of it from fossil fuels**” → A. B: kiểu ① — chữ half có trong đoạn G nhưng nói về phần **nitơ** cây hấp thụ (less than half), không phải năng lượng (chỉ 1–2%). C, D: kiểu ③." },
          { q: "11. According to paragraph G, what happens to nitrogen that crops do not take up?", options: ["A All of it escapes into the air as nitrous oxide.", "B Some pollutes the water and some adds to global warming.", "C It washes into rivers, where it helps fish to survive.", "D It stays in the soil for the following crop."], correct: 1, why: "Đoạn G: “Much of the rest **washes into rivers and seas**… ‘dead zones’… **Some also escapes into the air as nitrous oxide, a greenhouse gas**” → B. A: kiểu ⑥ (Some → All). C: kiểu ② — nửa đầu đúng (washes into rivers), nửa sau sai (fish **cannot** survive). D: kiểu ③." },
          { q: "12. What change are researchers trying to make to cereal crops?", options: ["A They want them to resist insects.", "B They want them to need more fertiliser.", "C They want to grow them using satellite images.", "D They want them to obtain nitrogen with the help of bacteria."], correct: 3, why: "Đoạn H: “breed cereals that, like beans, **can work with bacteria to obtain their own nitrogen**” → D. B: kiểu ④ — mục tiêu là **bớt** phụ thuộc phân bón. C: kiểu ① — ảnh vệ tinh là việc của **nông dân** khi bón phân, không phải của nhà lai tạo giống. A: kiểu ③." },
          { q: "13. Which of the following is the most suitable title for the passage?", options: ["A The Life and Work of Fritz Haber", "B Farming before Chemical Fertilisers", "C How Nitrogen from the Air Changed Farming — and at What Cost", "D The Hidden Dangers of Fertiliser Pollution"], correct: 2, why: "Câu toàn bài: bài đi từ lời cảnh báo 1898 → nguồn phân cũ → phát minh của Haber → Bosch đưa vào công nghiệp → chiến tranh → nuôi nửa nhân loại → cái giá phải trả → hướng đi tương lai. Chỉ C bao được cả lợi ích lẫn cái giá. A, B, D đều là kiểu ② ở mức toàn bài: mỗi cái chỉ đúng với một vài đoạn (C–E, B, G)." },
        ],
      },
      {
        t: "table",
        caption: "Chấm xong, tra bảng này: mỗi câu được viết lại (paraphrase) thế nào.",
        head: ["Câu", "Chữ trong bài", "Chữ trong đáp án", "Kiểu đổi"],
        rows: [
          ["1", "there would soon not be enough wheat to feed it", "too little wheat for the growing population", "đổi cấu trúc"],
          ["2", "its deposits were finite", "The deposits would eventually run out", "tính từ → cụm động từ"],
          ["4", "made it brittle… the vessels burst", "made their steel walls weak", "đồng nghĩa + khái quát"],
          ["5", "worked almost as well at a fraction of the cost", "much cheaper… nearly as effective", "so sánh → so sánh khác"],
          ["7", "his reputation remains deeply divided", "People still hold sharply different views of him", "danh từ → mệnh đề"],
          ["9", "within limits, the more nitrogen…, the more they harvested", "Up to a certain point, more nitrogen meant bigger harvests", "so sánh kép → câu đơn"],
          ["11", "washes into rivers… nitrous oxide, a greenhouse gas", "pollutes the water… adds to global warming", "khái quát"],
          ["12", "work with bacteria to obtain their own nitrogen", "obtain nitrogen with the help of bacteria", "đổi cấu trúc"],
        ],
      },
      {
        t: "note",
        title: "📌 Chấm điểm và ôn",
        items: [
          "**11–13 đúng**: vững mức band 6–6.5 cho dạng này. **9–10**: đạt. **≤ 8**: xem lại bạn sai vì kiểu nào ở bảng mục 2 rồi làm lại bài Tập 2 Ngày 10.",
          "Sai câu **3, 13** (mục đích, toàn bài) → bạn đang đọc từng chi tiết mà quên hỏi “đoạn này để làm gì”. Tập nói một câu tóm ý mỗi đoạn.",
          "Sai câu **2, 4, 6** (kiểu ⑤) → bạn chọn điều **có thật** trong bài nhưng không trả lời câu hỏi. Luôn đọc lại thân câu hỏi sau khi chọn.",
          "Sai câu **1, 10** (kiểu ①) → bạn chọn theo chữ giống. Hỏi thêm: chữ đó trong bài nói về **ai / cái gì / lúc nào**?",
        ],
      },

      { t: "h", text: "5. Soi lại bài: gọi tên kiểu sai" },
      {
        t: "mcq",
        id: "t3d11-doc-kieu-sai",
        title: "Phương án này sai theo kiểu nào? (6 câu — nhìn lại bài “Bread from the Air”)",
        items: [
          { q: "1. Câu 6, phương án C: “It continued to import nitrate from Chile.”", options: ["A ③ Không nhắc", "B ④ Ngược nghĩa", "C ⑥ Nói quá", "D ⑤ Đúng nhưng lạc câu hỏi"], correct: 1, why: "Bài viết “a British naval blockade **cut Germany off** from Chilean nitrate” — bị cắt nguồn; phương án nói ngược lại." },
          { q: "2. Câu 9, phương án A: “Using more nitrogen always produced bigger harvests.”", options: ["A ③ Không nhắc", "B ④ Ngược nghĩa", "C ⑥ Nói quá", "D ① Đúng chữ, sai ý"], correct: 2, why: "Bài: **within limits**, the more…, the more… Bỏ giới hạn rồi thêm **always** là nói quá." },
          { q: "3. Câu 10, phương án B: “It accounts for half of the world's energy.”", options: ["A ① Đúng chữ, sai ý", "B ③ Không nhắc", "C ⑤ Đúng nhưng lạc câu hỏi", "D ② Đúng một nửa"], correct: 0, why: "Chữ half có trong đoạn G, nhưng ở đó nó nói về phần **nitơ** đi vào vụ mùa. Bê chữ của câu này gắn vào chủ đề của câu khác (năng lượng, chỉ 1–2%) = đúng chữ, sai ý." },
          { q: "4. Câu 6, phương án B: “Haber directed its chemical weapons programme.”", options: ["A ④ Ngược nghĩa", "B ⑥ Nói quá", "C ③ Không nhắc", "D ⑤ Đúng nhưng lạc câu hỏi"], correct: 3, why: "Đúng là Haber chỉ đạo chương trình vũ khí hoá học, nhưng câu hỏi là vì sao Đức **vẫn có thuốc nổ**. Điều đúng mà không trả lời câu hỏi." },
          { q: "5. Câu 11, phương án C: “It washes into rivers, where it helps fish to survive.”", options: ["A ③ Không nhắc", "B ② Đúng một nửa", "C ⑥ Nói quá", "D ⑤ Đúng nhưng lạc câu hỏi"], correct: 1, why: "Nửa đầu đúng (trôi ra sông), nửa sau sai (bài nói cá **không** sống nổi ở ‘dead zones’)." },
          { q: "6. Câu 12, phương án A: “They want them to resist insects.”", options: ["A ④ Ngược nghĩa", "B ① Đúng chữ, sai ý", "C ③ Không nhắc", "D ② Đúng một nửa"], correct: 2, why: "Nghe rất hợp lý với chuyện lai giống cây, nhưng đoạn H không có chữ nào về sâu bệnh. Hợp lý ≠ có trong bài." },
        ],
      },

      { t: "h", text: "6. Soi lại bài: cấu trúc so sánh trong văn bản thật" },
      {
        t: "p",
        text: "Bài đọc dùng đúng những cấu trúc bạn học ở bài Ngữ pháp sáng nay. Điền lại **không nhìn bài**, rồi mới dò đoạn ghi trong ngoặc.",
      },
      {
        t: "quiz",
        id: "t3d11-doc-so-sanh",
        title: "Điền MỘT từ — các câu lấy từ bài đọc (7 câu)",
        kind: "fill",
        items: [
          { q: "1. Almost four-___ of the air is nitrogen gas. (đoạn A — phân số)", answers: ["fifths"] },
          { q: "2. Chile was by ___ the largest supplier. (đoạn B)", answers: ["far"] },
          { q: "3. The more nitrate a country set aside for weapons, the ___ was left for its farms. (đoạn B)", answers: ["less"] },
          { q: "4. …a pressure roughly two hundred times ___ of the atmosphere. (đoạn C)", answers: ["that"] },
          { q: "5. …a mixture based on ordinary iron that worked almost as well at a ___ of the cost. (đoạn D)", answers: ["fraction"] },
          { q: "6. Global use of nitrogen fertiliser rose roughly ___ between the early 1960s and the 2010s. (đoạn F — gấp mười)", answers: ["tenfold"] },
          { q: "7. A field may receive twice as much nitrogen ___ the crop can actually take up. (đoạn G)", answers: ["as"] },
        ],
      },

      { t: "h", text: "7. Từ vựng hữu ích từ bài đọc" },
      {
        t: "vocab",
        items: [
          { w: "fertiliser", pos: "n", ipa: "/ˈfɜːtəlaɪzə/", vi: "phân bón", ex: "Farmers apply nitrogen fertiliser in the spring.", exVi: "Nông dân bón phân đạm vào mùa xuân.", more: "**apply / use** fertiliser · **chemical / synthetic / organic** fertiliser · Anh-Mỹ viết **fertilizer**. Họ từ: **fertile** (adj, màu mỡ) · **fertility** (n)." },
          { w: "deposit", pos: "n", ipa: "/dɪˈpɒzɪt/", vi: "mỏ, lớp khoáng chất nằm trong đất", ex: "Large deposits of copper were found in the north.", exVi: "Người ta tìm thấy các mỏ đồng lớn ở phía bắc.", more: "**mineral / oil / coal deposits** · nghĩa khác hay gặp trong Listening: **tiền đặt cọc** (pay a deposit)." },
          { w: "finite", pos: "adj", ipa: "/ˈfaɪnaɪt/", vi: "có hạn, sẽ cạn", ex: "Oil and gas are finite resources.", exVi: "Dầu và khí là tài nguyên có hạn.", more: "**finite resources / supply** · trái nghĩa: **infinite** /ˈɪnfɪnət/ (chú ý đổi cách đọc) · đồng nghĩa: **limited**. Dùng tốt trong Task 2 về môi trường." },
          { w: "breakthrough", pos: "n", ipa: "/ˈbreɪkθruː/", vi: "bước đột phá", ex: "Scientists made a major breakthrough in cancer research.", exVi: "Các nhà khoa học đạt một bước đột phá lớn trong nghiên cứu ung thư.", more: "**make / achieve a breakthrough** · **a breakthrough in** + N (không ~~breakthrough of~~)." },
          { w: "catalyst", pos: "n", ipa: "/ˈkætəlɪst/", vi: "chất xúc tác; (nghĩa bóng) tác nhân thúc đẩy", ex: "The crisis acted as a catalyst for change.", exVi: "Cuộc khủng hoảng là tác nhân thúc đẩy thay đổi.", more: "**a catalyst for** + N (change, reform, growth) — nghĩa bóng rất hợp Task 2." },
          { w: "synthetic", pos: "adj", ipa: "/sɪnˈθetɪk/", vi: "tổng hợp, nhân tạo (do con người làm ra bằng hoá học)", ex: "Most sportswear is made from synthetic fibres.", exVi: "Phần lớn đồ thể thao làm từ sợi tổng hợp.", more: "**synthetic fertiliser / fibres / materials** · trái nghĩa: **natural** · họ từ: **synthesis** (n), **synthesise** (v)." },
          { w: "brittle", pos: "adj", ipa: "/ˈbrɪtl/", vi: "giòn, dễ gãy vỡ", ex: "Old plastic becomes brittle in the sun.", exVi: "Nhựa cũ trở nên giòn khi phơi nắng.", more: "**become / grow brittle** · nghĩa bóng: a brittle peace (hoà bình mong manh)." },
          { w: "transform", pos: "v", ipa: "/trænsˈfɔːm/", vi: "làm thay đổi hoàn toàn", ex: "The internet has transformed the way we study.", exVi: "Internet đã làm thay đổi hoàn toàn cách chúng ta học.", more: "**transform A into B** · **completely / radically transform** · danh từ: **transformation**. Mạnh hơn **change** — dùng tốt trong Task 2 và Part 3." },
        ],
      },
      {
        t: "note",
        title: "💡 Cách học tiếp sau bài này",
        items: [
          "Chép 8 dòng của bảng paraphrase (mục 4) vào **sổ paraphrase** (Tập 2 Ngày 8) — đây là kiểu đổi cấu trúc và loại từ (finite → would run out, the more…, the more… → more… meant…) mà band 6 phải bắt được.",
          "Với mỗi câu bạn làm sai, viết một dòng: “Câu __: tôi chọn __ vì thấy chữ __; nó sai kiểu __.” Ba lần viết như vậy là hết chọn theo chữ giống.",
          "Lần sau gặp trắc nghiệm trong đề thi máy (Online Test), ghi ký hiệu ①–⑥ ra giấy nháp cạnh mỗi phương án bị loại.",
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI 3 — NÓI ═══════════════════════════ */
  {
    id: "t3d11-noi",
    kind: "speaking",
    title: "Nói: Ngữ pháp của văn nói — chunks (I'd say…, the thing is…) + giữ mạch khi quên từ",
    goal: "Nói câu trả lời Part 1 và Part 3 nghe như NÓI chứ không như đọc bài viết: mở – nối – kết bằng 30 cụm nói sẵn (chunks), dùng câu rút gọn và câu hỏi đuôi đúng chỗ, giữ được mạch khi quên từ hoặc không có trải nghiệm, và ngắt hơi theo cụm nghĩa — đẩy Fluency & Coherence và Grammatical Range lên band 6.",
    minutes: 75,
    blocks: [
      {
        t: "recap",
        title: "Bài này học gì · đẩy tiêu chí nào",
        items: [
          "Band 5 nói “giữ được mạch nhưng nhờ lặp, tự sửa, nói chậm”. Band 6 “sẵn lòng nói dài, dùng được từ nối và discourse markers”. Khoảng cách đó phần lớn nằm ở ==chunks== — những cụm 2–5 từ người bản ngữ nói ra như một khối, không phải ghép từng từ.",
          "**Ngữ pháp của văn nói** khác văn viết: câu ngắn hơn, có rút gọn (Not really. Depends.), có câu hỏi đuôi (isn't it?), có từ làm mềm (kind of, I guess). Dùng đúng những thứ này là **cộng** điểm GRA, không phải trừ.",
          "Hôm nay: ① 30 chunks theo 6 chức năng · ② câu rút gọn và câu hỏi đuôi · ③ từ làm mềm và nói ước chừng · ④ quên từ / không biết / không có trải nghiệm thì nói gì (nối Tập 2 Ngày 9 và 13) · ⑤ kéo dài ý và tự sửa đúng cách.",
          "🔊 Phát âm: **chunking** — ngắt hơi theo cụm nghĩa. Một chunk đọc liền một hơi, không ngắt giữa chừng.",
          "Cảnh báo: chunks là ==gia vị==. Mỗi câu trả lời 1–2 cụm. Câu nào cũng “To be honest… you know… like…” thì thành lạm dụng filler — đúng mô tả của band 5.",
        ],
      },

      { t: "h", text: "1. Nói như đọc bài viết — vì sao kẹt ở band 5?" },
      {
        t: "p",
        text: "Nhiều bạn học Writing kỹ rồi mang nguyên văn viết vào phòng thi nói: “Firstly… Moreover… In conclusion…”. Giám khảo nghe thấy một bài **thuộc lòng**, không phải một cuộc trò chuyện. Tiêu chí Fluency & Coherence chấm việc bạn nối ý **tự nhiên**; tiêu chí Lexical Resource có nhắc tới “idiomatic language”, tức là cách nói quen miệng của người bản ngữ.",
      },
      {
        t: "table",
        caption: "Cùng một ý, văn viết và văn nói.",
        head: ["Chức năng", "Văn viết (để dành cho Task 2)", "Văn nói (dùng trong Speaking)"],
        rows: [
          ["Nêu ý kiến", "In my opinion, … / I firmly believe that…", "I'd say… / I think… / I reckon… / Personally, I…"],
          ["Thêm ý", "Moreover, … / Furthermore, …", "And on top of that, … / Plus, … / Another thing is…"],
          ["Đối lập", "However, … / Nevertheless, …", "But then again, … / Mind you, … / Having said that, …"],
          ["Nêu lý do", "This is due to the fact that…", "The thing is, … / It's mainly because…"],
          ["Ví dụ", "For example, … / To illustrate, …", "Like, … / Say, … / Take my brother, for instance."],
          ["Kết", "In conclusion, … / To sum up, …", "So yeah, that's why… / So all in all, …"],
        ],
      },
      {
        t: "note",
        title: "⚠️ Đừng hiểu sai: văn nói không phải nói ẩu",
        items: [
          "Văn nói tự nhiên vẫn phải **đúng ngữ pháp**: I'd say **it depends** (không ~~it depend~~). Chunk chỉ là phần mở; phần sau vẫn là một mệnh đề đủ.",
          "**gonna, wanna, kinda** dùng được khi nói nhanh tự nhiên, nhưng nếu phát âm của bạn chưa chắc thì cứ nói rõ **going to, want to, kind of**.",
          "Tránh tiếng lóng và từ quá suồng sã (stuff like that thì được; ~~dude~~, ~~sucks~~ thì không). Phòng thi là cuộc nói chuyện lịch sự với người lạ.",
          "**Moreover, Furthermore, In conclusion** không sai, nhưng nghe như đọc bài. Mỗi bài nói tối đa một lần.",
        ],
      },

      { t: "h", text: "2. Ba mươi chunks theo sáu chức năng" },
      {
        t: "p",
        text: "**Chunk** (cụm nói sẵn) là một nhóm từ đi cùng nhau thành thói quen: the thing is, to be honest, as far as I know. Bạn học cả cụm, nói cả cụm, không dịch từng từ. Lợi ích kép: vừa có ==thời gian nghĩ== (nói chunk trong lúc não tìm ý), vừa nghe tự nhiên.",
      },
      {
        t: "table",
        caption: "Nhóm 1 — Mở câu trả lời (thay cho “I think” lặp mãi).",
        head: ["Chunk", "Dùng khi", "Ví dụ"],
        rows: [
          ["**I'd say…**", "nêu ý kiến một cách nhẹ nhàng (= I would say)", "I'd say most young people prefer eating out."],
          ["**I guess… / I suppose…**", "chưa chắc lắm, đang nghĩ", "I guess it depends on your budget."],
          ["**To be honest, …**", "sắp nói điều hơi bất ngờ hoặc trái mong đợi", "To be honest, I'm not much of a cook."],
          ["**Personally, I…**", "tách ý mình khỏi ý số đông", "Personally, I find it quite relaxing."],
          ["**As far as I know, …**", "nói điều mình không chắc 100 %", "As far as I know, most schools don't teach it."],
        ],
      },
      {
        t: "table",
        caption: "Nhóm 2 — Nhấn vào ý chính.",
        head: ["Chunk", "Dùng khi", "Ví dụ"],
        rows: [
          ["**The thing is, …**", "sắp nêu lý do thật / vấn đề chính", "The thing is, I get home really late."],
          ["**What I mean is, …**", "nói lại cho rõ hơn", "What I mean is, it takes too much time."],
          ["**The main reason is (that)…**", "nêu lý do quan trọng nhất", "The main reason is that it's cheaper."],
          ["**What I like most about it is…**", "nhấn vào điều thích nhất", "What I like most about it is the smell."],
          ["**The good thing about… is (that)…**", "nêu ưu điểm", "The good thing about cooking is that you know what's in your food."],
        ],
      },
      {
        t: "table",
        caption: "Nhóm 3 — Thêm ý và đổi hướng.",
        head: ["Chunk", "Dùng khi", "Ví dụ"],
        rows: [
          ["**And on top of that, …**", "thêm một ý cùng chiều, mạnh hơn", "It's expensive. And on top of that, it's not very healthy."],
          ["**Plus, … / Another thing is, …**", "thêm ý (ngắn gọn)", "Plus, you have to do the washing-up."],
          ["**But then again, …**", "tự phản biện nhẹ", "But then again, not everyone has the time."],
          ["**Mind you, …**", "thêm một ý làm yếu câu trước (rất Anh)", "I love street food. Mind you, it's not always clean."],
          ["**Having said that, …**", "nhượng bộ (đã học ở Ngày 10)", "Having said that, I do cook at weekends."],
        ],
      },
      {
        t: "table",
        caption: "Nhóm 4 — Nêu ví dụ.",
        head: ["Chunk", "Dùng khi", "Ví dụ"],
        rows: [
          ["**…, for instance / for example.**", "đặt cuối câu nghe tự nhiên hơn đặt đầu", "My mum makes everything herself, bread, for instance."],
          ["**Take…, for example.**", "lấy một trường hợp cụ thể", "Take my flatmate, for example. He orders food every night."],
          ["**…, say, …**", "= ví dụ như (chen giữa câu)", "If you cook, say, three times a week, you save a lot."],
          ["**…like…**", "liệt kê nhanh (đừng lạm dụng)", "I can make simple things like fried rice or noodles."],
          ["**…and things like that / and so on.**", "kết một danh sách", "We talk about work, family and things like that."],
        ],
      },
      {
        t: "table",
        caption: "Nhóm 5 — Mua thời gian (2–3 giây, không im lặng).",
        head: ["Chunk", "Dùng khi", "Ví dụ"],
        rows: [
          ["**That's a good / tricky question.**", "câu hỏi khó, cần nghĩ", "That's a tricky question. I've never really thought about it."],
          ["**Let me think. / Let me see.**", "cần 1–2 giây", "Let me think. I suppose it started when I was at school."],
          ["**How can I put it?**", "đang tìm cách diễn đạt", "It's, how can I put it, a bit old-fashioned."],
          ["**Well, … / Actually, …**", "mở câu nhẹ nhàng (mỗi câu trả lời một lần)", "Well, it depends on the day, really."],
          ["**I've never really thought about it, but…**", "thật sự chưa nghĩ tới — rồi vẫn trả lời", "I've never really thought about it, but I'd say yes."],
        ],
      },
      {
        t: "table",
        caption: "Nhóm 6 — Kết câu trả lời dứt khoát (không treo “…and yeah”).",
        head: ["Chunk", "Dùng khi", "Ví dụ"],
        rows: [
          ["**So yeah, that's why…**", "chốt bằng lý do", "So yeah, that's why I usually eat out."],
          ["**So all in all, …**", "tóm lại", "So all in all, I'd say it's worth the effort."],
          ["**So that's basically it.**", "báo đã nói xong (Part 2)", "…and I still use it today. So that's basically it."],
          ["**…, if that makes sense.**", "vừa giải thích điều hơi khó", "It's relaxing and stressful at the same time, if that makes sense."],
          ["**But overall, …**", "sau khi cân hai mặt", "But overall, I think it's a good thing."],
        ],
      },
      {
        t: "sodo",
        kind: "flow",
        title: "Một câu trả lời Part 1 có khung: Mở → Ý chính → Mở rộng → Kết",
        steps: [
          { label: "Mở (1 chunk)", sub: "To be honest, / I'd say / Well," },
          { label: "Ý chính", sub: "trả lời thẳng câu hỏi" },
          { label: "Mở rộng", sub: "The thing is, … / …, for instance. / Mind you, …" },
          { label: "Kết", sub: "So yeah, that's why… / But overall, …" },
        ],
        caption: "Part 1: 2–3 câu, khoảng 15–20 giây. Hai chunk là đủ: một ở đầu, một ở giữa hoặc cuối.",
      },
      { t: "rule", formula: "Mở (I'd say / To be honest) + ý chính + The thing is / for instance + mở rộng + So yeah, that's why…", vi: "Mỗi câu trả lời 1–2 chunks. Chunk là khối liền: học cả cụm, nói cả cụm." },
      {
        t: "quiz",
        id: "t3d11-noi-chunk-dich",
        title: "Dịch Việt → Anh — dùng chunk gợi ý (6 câu)",
        kind: "translate",
        grammar: "I'd say… · To be honest, … · The thing is, … · As far as I know, … · Take…, for example. · So all in all, …",
        items: [
          { q: "Tôi cho là điều đó tuỳ vào thời tiết.", answers: ["I'd say it depends on the weather.", "I would say it depends on the weather."], hint: "I'd say · it depends on" },
          { q: "Thật lòng thì tôi không giỏi nấu ăn lắm.", answers: ["To be honest, I'm not very good at cooking.", "To be honest, I am not very good at cooking.", "To be honest, I'm not much of a cook.", "To be honest I'm not very good at cooking."], hint: "To be honest · be good at + V-ing" },
          { q: "Vấn đề là tôi về nhà rất muộn.", answers: ["The thing is, I get home really late.", "The thing is, I get home very late.", "The thing is I get home really late.", "The thing is, I come home very late."], hint: "The thing is · get home late" },
          { q: "Theo tôi biết thì hầu hết các trường không dạy môn đó.", answers: ["As far as I know, most schools don't teach it.", "As far as I know, most schools do not teach it.", "As far as I know most schools don't teach it.", "As far as I know, most schools don't teach that subject."], hint: "As far as I know · most schools" },
          { q: "Lấy bạn cùng phòng của tôi làm ví dụ.", answers: ["Take my flatmate, for example.", "Take my roommate, for example.", "Take my flatmate, for instance.", "Take my roommate, for instance.", "Take my flatmate for example."], hint: "Take + N, for example" },
          { q: "Nên nhìn chung, tôi cho là nó đáng công sức.", answers: ["So all in all, I'd say it's worth the effort.", "So all in all, I would say it is worth the effort.", "So all in all, I'd say it is worth the effort.", "So all in all I'd say it's worth the effort."], hint: "So all in all · worth the effort" },
        ],
      },
      {
        t: "mcq",
        id: "t3d11-noi-chunk-chon",
        title: "Chọn chunk hợp chức năng (6 câu)",
        items: [
          { q: "1. “Do you like cooking?” — “___, I'm not much of a cook. I can make instant noodles, and that's about it.”", options: ["A On top of that", "B To be honest", "C So all in all", "D For instance"], correct: 1, why: "Sắp nói điều hơi trái mong đợi (không biết nấu) → To be honest. On top of that để thêm ý; So all in all để kết; For instance để nêu ví dụ." },
          { q: "2. “I'd love to cook more. ___, I don't get home until eight, so I'm too tired.”", options: ["A The thing is", "B For instance", "C So yeah", "D And things like that"], correct: 0, why: "Sắp nêu lý do thật / trở ngại chính → The thing is." },
          { q: "3. “Eating out every day is expensive. ___, it's not very healthy.”", options: ["A Let me think", "B Take it for example", "C And on top of that", "D As far as I know"], correct: 2, why: "Thêm một ý cùng chiều, mạnh hơn → And on top of that." },
          { q: "4. “I love street food. ___, it isn't always very clean.”", options: ["A So that's basically it", "B What I mean is", "C For instance", "D Mind you"], correct: 3, why: "Thêm một ý làm yếu câu vừa nói → Mind you (= nói vậy chứ)." },
          { q: "5. Giám khảo hỏi một câu bạn chưa từng nghĩ tới. Mở đầu tốt nhất là:", options: ["A (im lặng 5 giây)", "B I don't know.", "C That's a tricky question. Let me think.", "D Moreover, it is a difficult question."], correct: 2, why: "Mua 2–3 giây bằng chunk, rồi trả lời. Im lặng trừ điểm Fluency; “I don't know” rồi dừng là bỏ câu hỏi; Moreover dùng sai chức năng." },
          { q: "6. Câu kết nào dứt khoát nhất?", options: ["A …and yeah.", "B …so that's why I usually eat at home.", "C …and so on, and so on.", "D …that's all, I think, maybe."], correct: 1, why: "Kết bằng một mệnh đề chốt lại ý chính, giọng đi xuống. “…and yeah” và “that's all” là kết treo — giám khảo không biết bạn xong chưa." },
        ],
      },

      { t: "h", text: "3. Câu rút gọn và câu hỏi đuôi — ngữ pháp riêng của văn nói" },
      {
        t: "p",
        text: "**Rút gọn** (ellipsis) là bỏ những từ mà người nghe tự hiểu được. Trong hội thoại thật, không ai trả lời “Yes, I do like cooking very much” cho mọi câu hỏi. **Câu hỏi đuôi** (question tag) là mẩu hỏi ngắn cuối câu (isn't it? don't they?) để kéo người nghe đồng tình. Hai thứ này cho giám khảo thấy bạn điều khiển được ngữ pháp **trong lúc nói**.",
      },
      {
        t: "table",
        caption: "Câu trả lời rút gọn — luôn nói TIẾP một câu đủ ngay sau.",
        head: ["Câu hỏi", "Mở rút gọn", "Câu đủ nói tiếp ngay"],
        rows: [
          ["Do you cook every day?", "**Not really.**", "I cook maybe twice a week, usually at weekends."],
          ["Is it expensive to eat out in your city?", "**Depends where you go.**", "Street food is really cheap, but restaurants in the centre can be pricey."],
          ["Do you think you'll learn to cook?", "**Hopefully.** / **Probably not.**", "I've signed up for a class next month."],
          ["Did you enjoy it?", "**Loved it.** / **Not much, to be honest.**", "It was the best meal I've had in years."],
          ["Which do you prefer?", "**Hard to say.**", "I like both, but if I had to choose, I'd go for home cooking."],
        ],
      },
      {
        t: "patterns",
        rows: [
          {
            formula: "Câu khẳng định, + trợ động từ + not + đại từ? · Câu phủ định, + trợ động từ + đại từ?",
            vi: "câu hỏi đuôi: vế trước khẳng định thì đuôi phủ định, và ngược lại",
            examples: [
              { en: "It's much cheaper to cook at home, isn't it?", vi: "Nấu ở nhà rẻ hơn nhiều, phải không?" },
              { en: "People don't have much time these days, do they?", vi: "Dạo này người ta không có nhiều thời gian, đúng không?" },
            ],
          },
          {
            formula: "S + V…, + right? / you know? · …, really. · …, though.",
            vi: "các đuôi nói khác: right? (kiểu Mỹ), really (làm mềm), though (= nhưng mà, đặt cuối câu)",
            examples: [
              { en: "It depends on the day, really.", vi: "Thật ra thì tuỳ hôm." },
              { en: "It's a bit expensive. It's worth it, though.", vi: "Hơi đắt. Nhưng mà đáng." },
            ],
          },
          {
            formula: "So do I. / Neither do I. · I do. / I don't. · I think so. / I hope not.",
            vi: "thay cả mệnh đề bằng do / so / not",
            examples: [
              { en: "Will prices go up? I hope not.", vi: "Giá có tăng không? Tôi mong là không." },
              { en: "My parents love cooking, and so do I.", vi: "Bố mẹ tôi thích nấu ăn, và tôi cũng vậy." },
            ],
          },
        ],
      },
      {
        t: "note",
        title: "⚠️ Lỗi hay sai với rút gọn và câu hỏi đuôi",
        items: [
          "Rút gọn rồi **dừng luôn** (“Not really.” — hết) là trả lời cụt. Câu rút gọn chỉ là câu mở; phải có câu đủ theo sau.",
          "Đuôi phải khớp **trợ động từ và thì** của vế trước: She **cooks** well, **doesn't** she? · They **went** out, **didn't** they? · You **can** cook, **can't** you? Không dùng ~~isn't it?~~ cho mọi câu.",
          "**I am…, aren't I?** (không ~~amn't I~~). **Let's…, shall we?**",
          "Trong phòng thi, dùng câu hỏi đuôi **1–2 lần cả bài**, ở Part 3 khi nêu điều ai cũng thấy. Giám khảo không trả lời đâu — cứ nói tiếp.",
          "~~So I do~~ → **So do I** (đảo trợ động từ lên trước chủ ngữ). Câu phủ định: **Neither do I** / **I don't either**.",
        ],
      },
      { t: "rule", formula: "Rút gọn (Not really. / Depends.) + câu đủ ngay sau · S + V (khẳng định), + trợ động từ + n't + đại từ?", vi: "Rút gọn để mở, câu đủ để trả lời. Đuôi ngược dấu với vế trước và cùng trợ động từ." },
      {
        t: "quiz",
        id: "t3d11-noi-duoi",
        title: "Điền câu hỏi đuôi (6 câu)",
        kind: "fill",
        items: [
          { q: "1. It's getting more expensive every year, ___ ___? (2 từ)", answers: ["isn't it"] },
          { q: "2. Young people don't cook much these days, ___ ___? (2 từ)", answers: ["do they"] },
          { q: "3. Your grandmother taught you to cook, ___ ___? (2 từ)", answers: ["didn't she"] },
          { q: "4. You can't learn that from a video, ___ ___? (2 từ)", answers: ["can you"] },
          { q: "5. Fast food has become really popular, ___ ___? (2 từ)", answers: ["hasn't it"] },
          { q: "6. People would cook more if they had time, ___ ___? (2 từ)", answers: ["wouldn't they"] },
        ],
      },

      { t: "h", text: "4. Từ làm mềm và nói ước chừng" },
      {
        t: "p",
        text: "Người bản ngữ ít khi nói tuyệt đối. Họ thêm những từ nhỏ để câu **mềm** hơn và để nói điều mình **không chắc chính xác**. Dùng đúng nhóm từ này là dấu hiệu rõ của band 6 trở lên.",
      },
      {
        t: "table",
        caption: "Từ làm mềm (hedges) và từ ước chừng (vague language).",
        head: ["Từ / cụm", "Nghĩa", "Ví dụ"],
        rows: [
          ["**kind of / sort of** + adj / V", "hơi hơi, kiểu như", "It's kind of relaxing after a long day."],
          ["**a bit / a little** + adj", "hơi (thường với ý tiêu cực)", "The kitchen is a bit small."],
          ["**quite / pretty / fairly** + adj", "khá", "I'm pretty busy during the week."],
          ["**I guess / I suppose / probably**", "chắc là", "I suppose I could try harder."],
          ["**or something / or whatever**", "hay cái gì đó tương tự", "We usually get a pizza or something."],
          ["**and stuff / and things like that**", "và mấy thứ kiểu đó", "I buy vegetables, rice and things like that."],
          ["**about / around / …or so**", "khoảng", "It takes about twenty minutes or so."],
          ["**-ish** (sau số, màu, tính từ)", "tầm, hơi hơi", "I usually have dinner at seven-ish."],
          ["**tend to** + V", "thường có xu hướng", "People tend to eat out more at weekends."],
        ],
      },
      {
        t: "note",
        title: "⚠️ Dùng vừa phải",
        items: [
          "Một câu trả lời có **một** từ làm mềm là tự nhiên. Ba từ trong một câu (“I kind of sort of maybe like it or something”) là mất mạch.",
          "~~kind of + N~~ khác nghĩa: **a kind of soup** = một loại súp (nghĩa đen). **It's kind of spicy** = hơi cay (làm mềm).",
          "**tend to** là từ làm mềm an toàn nhất, dùng được cả trong Writing: Young people **tend to** spend more time online.",
        ],
      },

      { t: "h", text: "5. Quên từ · không biết · không có trải nghiệm — nói gì để giữ mạch?" },
      {
        t: "p",
        text: "Tập 2 Ngày 9 đã dạy: quên từ thì **giải nghĩa bằng mệnh đề**. Tập 2 Ngày 13 dạy cách xin nhắc lại câu hỏi. Hôm nay gom thành bộ đầy đủ cho band 6. Nguyên tắc: giám khảo không chấm kiến thức, chỉ chấm tiếng Anh. ==Không biết từ thì tả; không biết chuyện thì nói vì sao không biết rồi đoán.==",
      },
      {
        t: "table",
        caption: "Bốn tình huống và câu cứu.",
        head: ["Tình huống", "Câu cứu", "Ví dụ trọn"],
        rows: [
          ["Quên một danh từ", "**It's a kind of… / It's the thing you use to… / It's something that…**", "I can't remember the word, but **it's the thing you use to** flip food in a pan. (= spatula)"],
          ["Quên một tính từ / động từ", "**What's the word? … / It's the opposite of… / It's when you…**", "The soup was, what's the word, **the opposite of** spicy. Very mild. · **It's when you** cook food in hot oil. (= fry)"],
          ["Không có trải nghiệm", "**I've never actually…, but I imagine… / I haven't really…, so I can only guess…**", "**I've never actually** grown my own vegetables, **but I imagine** it's very satisfying."],
          ["Không biết về chủ đề (Part 3)", "**I'm no expert, but… / I don't know much about…, but from what I've seen…**", "**I'm no expert, but from what I've seen**, school meals have improved a lot."],
          ["Lỡ nói sai", "**Sorry, I mean… / …or rather, … / Let me rephrase that.**", "He cook, **sorry, I mean** he cooks every day. · It's cheap, **or rather**, it's good value."],
          ["Không nghe rõ câu hỏi", "**Sorry, could you say that again? / Do you mean…?**", "**Do you mean** cooking at home or eating in restaurants?"],
        ],
      },
      {
        t: "patterns",
        rows: [
          {
            formula: "It's + the thing / something + (that) you use to + V · It's a kind of + N + that + V",
            vi: "tả đồ vật bằng công dụng",
            examples: [
              { en: "It's something you use to keep food cold when you go on a picnic.", vi: "Đó là thứ bạn dùng để giữ lạnh đồ ăn khi đi dã ngoại. (= cool box)" },
              { en: "It's a kind of pan that you use for making soup.", vi: "Đó là một loại nồi dùng để nấu súp. (= saucepan)" },
            ],
          },
          {
            formula: "It's when + S + V · It's the person who + V · It's the place where + S + V",
            vi: "tả hành động / người / nơi bằng mệnh đề",
            examples: [
              { en: "It's when you leave meat in sauce for a few hours before cooking.", vi: "Đó là khi bạn ngâm thịt trong nước sốt vài tiếng trước khi nấu. (= marinate)" },
              { en: "It's the person who brings you your food in a restaurant.", vi: "Đó là người mang đồ ăn ra cho bạn ở nhà hàng. (= waiter / server)" },
            ],
          },
          {
            formula: "I've never actually + V3, but I imagine / I'd guess + (that) + S + V",
            vi: "chưa có trải nghiệm → nói thật, rồi đoán",
            examples: [
              { en: "I've never actually worked in a restaurant, but I'd guess it's really stressful.", vi: "Tôi chưa từng làm ở nhà hàng, nhưng tôi đoán là rất căng thẳng." },
            ],
          },
        ],
      },
      {
        t: "note",
        title: "⚠️ Ba điều không làm khi bí",
        items: [
          "**Không im lặng quá 3 giây.** Nói một chunk mua thời gian (Let me think…) trong lúc nghĩ.",
          "**Không nói từ tiếng Việt** rồi cười. Tả nó bằng tiếng Anh — giải nghĩa thành công được tính là paraphrase, một tiêu chí của Lexical Resource band 6.",
          "**Không nói “I don't know” rồi dừng.** “I don't know much about that, but…” rồi đoán — vẫn là một câu trả lời đủ.",
          "Tự sửa **một lần, nhanh, rồi đi tiếp**. Sửa đi sửa lại cùng một chỗ làm mất mạch hơn là để lỗi qua.",
        ],
      },
      { t: "rule", formula: "Quên từ → It's the thing you use to + V / It's when + S + V · Không biết → I've never actually…, but I imagine…", vi: "Không biết từ thì tả. Không có trải nghiệm thì nói thật rồi đoán. Không bao giờ im lặng." },
      {
        t: "mcq",
        id: "t3d11-noi-quen-tu",
        title: "Người nói đang tả từ nào? (5 câu)",
        items: [
          { q: "1. “It's the thing you use to open a bottle of wine.”", options: ["A a corkscrew", "B a kettle", "C a tray", "D a whisk"], correct: 0, why: "Dụng cụ mở chai rượu vang = corkscrew (cái mở nút chai). Không cần biết từ này để nói — tả công dụng là đủ." },
          { q: "2. “It's when you cook food in the oven with dry heat, like bread or cakes.”", options: ["A boiling", "B frying", "C baking", "D steaming"], correct: 2, why: "Nấu trong lò bằng nhiệt khô (bánh mì, bánh ngọt) = baking." },
          { q: "3. “It's the person who writes about restaurants in newspapers and says if they are good or bad.”", options: ["A a waiter", "B a food critic", "C a chef", "D a customer"], correct: 1, why: "Người viết bài nhận xét nhà hàng = food critic (nhà phê bình ẩm thực)." },
          { q: "4. Bạn chưa bao giờ đi nước ngoài. Giám khảo hỏi “What do you think is the hardest part of living abroad?” Mở đầu nào tốt nhất?", options: ["A I don't know. I have never been abroad.", "B Sorry, I can't answer this question.", "C It is very hard. Very, very hard.", "D I've never actually lived abroad, but I imagine the hardest part would be missing your family."], correct: 3, why: "Nói thật là chưa có trải nghiệm, rồi đoán bằng I imagine + would. A và B bỏ câu hỏi; C không có nội dung." },
          { q: "5. Bạn lỡ nói “She don't like spicy food.” Cách sửa tốt nhất là:", options: ["A Dừng lại, xin lỗi, nói lại cả câu hai lần.", "B Bỏ qua, coi như không biết.", "C “She don't, sorry, she doesn't like spicy food.” rồi nói tiếp.", "D Nói “No, no, no, wrong” rồi bắt đầu lại từ đầu câu trả lời."], correct: 2, why: "Tự sửa một lần, nhanh, rồi đi tiếp. Giám khảo ghi nhận bạn biết lỗi; sửa ầm ĩ hoặc bắt đầu lại thì mất điểm Fluency." },
        ],
      },

      { t: "h", text: "6. Kéo dài ý — ba “móc nối” để không cụt sau một câu" },
      {
        t: "table",
        caption: "Sau câu ý chính, móc thêm một trong ba cái này.",
        head: ["Móc nối", "Thêm cái gì", "Ví dụ"],
        rows: [
          ["**…because / since…**", "lý do", "I rarely cook **because** my flat doesn't have a proper kitchen."],
          ["**…, which means (that)…**", "hệ quả", "I finish work at eight, **which means** I don't have the energy to cook."],
          ["**…, for instance / like…**", "ví dụ", "I can make a few simple dishes, fried rice, **for instance**."],
          ["**…, so…**", "kết quả", "Eating out is cheap here, **so** most people don't bother cooking."],
          ["**…, especially / particularly when…**", "thu hẹp trường hợp", "I enjoy cooking, **especially when** I have friends round."],
          ["**…, whereas / but…**", "đối lập", "My mum cooks everything from scratch, **whereas** I just heat things up."],
        ],
      },
      {
        t: "note",
        title: "💡 Luật 1 – 2 – 3 cho Part 1",
        items: [
          "**1** câu trả lời thẳng + **2** móc nối + dừng. Ví dụ: “Not really. I rarely cook **because** I get home late, **so** I usually just grab something on the way.”",
          "Part 3 dài hơn: ý kiến → lý do → ví dụ → nhượng bộ / kết (khung của Ngày 6 và Ngày 10).",
          "Bí ý thì dùng cặp đối lập **whereas**: so mình với bố mẹ, so bây giờ với trước đây, so thành phố với nông thôn. Lúc nào cũng có cái để nói.",
        ],
      },

      { t: "h", text: "7. Nghe và so: band 5 và band 6 cho cùng câu hỏi" },
      {
        t: "p",
        text: "Hai thí sinh có **cùng ý tưởng** và gần như cùng vốn từ. Khác nhau ở cách nối ý và cách xử lý khi quên từ. Nghe từng bài, rồi đọc bảng so sánh.",
      },
      {
        t: "dialogue",
        title: "Band 5 (ước tính) — Part 1: cooking",
        lines: [
          { who: "Examiner", role: "examiner", text: "Do you enjoy cooking?", vi: "Bạn có thích nấu ăn không?" },
          { who: "Candidate", role: "candidate", text: "Yes, I enjoy cooking. Cooking is very interesting. Firstly, I can cook many food. Moreover, it is... it is... healthy. In conclusion, I like cooking.", vi: "Vâng, tôi thích nấu ăn. Nấu ăn rất thú vị. Thứ nhất, tôi nấu được nhiều món. Hơn nữa, nó… nó… tốt cho sức khoẻ. Tóm lại, tôi thích nấu ăn." },
          { who: "Examiner", role: "examiner", text: "What kind of food do you usually cook?", vi: "Bạn thường nấu loại món gì?" },
          { who: "Candidate", role: "candidate", text: "I usually cook... um... I don't know the name in English. It is a Vietnamese food. It has... um... sorry. I cook rice and meat.", vi: "Tôi thường nấu… ừm… tôi không biết tên tiếng Anh. Đó là một món Việt Nam. Nó có… ừm… xin lỗi. Tôi nấu cơm và thịt." },
        ],
      },
      {
        t: "dialogue",
        title: "Band 6 (ước tính) — cùng hai câu hỏi",
        lines: [
          { who: "Examiner", role: "examiner", text: "Do you enjoy cooking?", vi: "Bạn có thích nấu ăn không?" },
          { who: "Candidate", role: "candidate", text: "To be honest, I'm not much of a cook, but I do enjoy it when I have the time. The thing is, I get home quite late during the week, so I only really cook at weekends. It's kind of relaxing after a busy week, actually.", vi: "Thật lòng thì tôi không giỏi nấu ăn lắm, nhưng tôi có thích khi có thời gian. Vấn đề là trong tuần tôi về nhà khá muộn, nên tôi chỉ thật sự nấu vào cuối tuần. Sau một tuần bận rộn thì việc đó cũng thư giãn phết." },
          { who: "Examiner", role: "examiner", text: "What kind of food do you usually cook?", vi: "Bạn thường nấu loại món gì?" },
          { who: "Candidate", role: "candidate", text: "Mostly simple Vietnamese dishes. There's one I make a lot, I can't remember the English name, but it's a kind of sour soup with fish and pineapple. It only takes about twenty minutes or so, which means I can make it even when I'm tired. So yeah, nothing fancy, really.", vi: "Chủ yếu là mấy món Việt đơn giản. Có một món tôi nấu nhiều, tôi không nhớ tên tiếng Anh, nhưng đó là một loại canh chua có cá và dứa. Chỉ mất khoảng hai mươi phút gì đó, nên tôi nấu được cả khi mệt. Nói chung là không có gì cầu kỳ." },
        ],
      },
      {
        t: "table",
        caption: "Vì sao bài thứ hai lên được band 6 — theo bốn tiêu chí.",
        head: ["Tiêu chí", "Band 5", "Band 6"],
        rows: [
          ["FC — trôi chảy, mạch lạc", "Từ nối của văn viết (Firstly, Moreover, In conclusion) cho một câu hỏi đời thường; ngắt “it is… it is…”; bỏ cuộc khi quên từ.", "Nối bằng chunks (To be honest, The thing is, So yeah); móc nối so, which means; không có chỗ im lặng."],
          ["LR — từ vựng", "interesting, healthy, many food; không tả được món ăn.", "not much of a cook, nothing fancy; **giải nghĩa thành công** món canh chua (a kind of sour soup with fish and pineapple)."],
          ["GRA — ngữ pháp", "Toàn câu đơn; lỗi ~~many food~~.", "Trộn câu đơn + phức (when I have the time, which means…, even when I'm tired); nhấn bằng I **do** enjoy."],
          ["P — phát âm", "Ngắt giữa cụm vì tìm từ.", "Ngắt theo cụm nghĩa: To be honest, / I'm not much of a cook, / but I do enjoy it / when I have the time."],
        ],
      },
      {
        t: "dialogue",
        title: "Band 6 (ước tính) — Part 3: “Why do you think fewer young people cook at home nowadays?”",
        lines: [
          { who: "Examiner", role: "examiner", text: "Why do you think fewer young people cook at home nowadays?", vi: "Theo bạn vì sao ngày nay ít người trẻ nấu ăn ở nhà hơn?" },
          { who: "Candidate", role: "candidate", text: "That's an interesting question. I'd say the main reason is time. A lot of young people work long hours, which means they simply don't have the energy to cook when they get home.", vi: "Câu hỏi thú vị đấy. Tôi cho là lý do chính là thời gian. Nhiều người trẻ làm việc nhiều giờ, nên họ đơn giản là không còn sức nấu khi về tới nhà." },
          { who: "Candidate", role: "candidate", text: "And on top of that, ordering food has become so easy, hasn't it? You just open an app and it arrives in twenty minutes. Take my flatmate, for example. I don't think he's used the cooker once this year.", vi: "Thêm vào đó, đặt đồ ăn đã thành quá dễ, phải không? Chỉ cần mở ứng dụng là hai mươi phút sau có đồ ăn. Lấy bạn cùng phòng tôi làm ví dụ. Tôi không nghĩ năm nay cậu ấy dùng bếp lấy một lần." },
          { who: "Candidate", role: "candidate", text: "Mind you, I'm no expert, but from what I've seen, cooking videos are really popular with people my age, so maybe things are starting to change. But overall, I think convenience usually wins.", vi: "Nói vậy chứ, tôi không phải chuyên gia, nhưng theo những gì tôi thấy thì video nấu ăn rất được người cùng tuổi tôi ưa thích, nên có lẽ mọi thứ đang bắt đầu thay đổi. Nhưng nhìn chung, tôi nghĩ sự tiện lợi thường thắng." },
        ],
      },
      {
        t: "note",
        title: "📌 Đếm chunks trong câu trả lời Part 3 ở trên",
        items: [
          "Mua thời gian: **That's an interesting question.** · Ý kiến: **I'd say the main reason is…** · Hệ quả: **which means** · Thêm ý: **And on top of that** · Câu hỏi đuôi: **hasn't it?** · Ví dụ: **Take my flatmate, for example.** · Đổi hướng: **Mind you** · Khiêm tốn: **I'm no expert, but from what I've seen** · Kết: **But overall**.",
          "Chín cụm trong khoảng 45 giây — với Part 3 là vừa. Với một câu Part 1 dài 15 giây, hai cụm là đủ.",
          "Thử che phần chunks đi: nội dung còn lại rất đơn giản (thiếu thời gian, đặt đồ ăn dễ, video nấu ăn). ==Band 6 không cần ý tưởng cao siêu; cần cách nối ý tự nhiên.==",
        ],
      },

      { t: "h", text: "8. Phát âm: chunking — ngắt hơi theo cụm nghĩa" },
      {
        t: "p",
        text: "**Chunking** là chia câu nói thành các **cụm nghĩa** (tiếng Anh gọi là tone units), mỗi cụm đọc liền một hơi, giữa các cụm ngắt rất ngắn. Người band 5 hay ngắt ở chỗ **quên từ** (I usually / um / cook / um / rice). Người band 6 ngắt ở chỗ **hết một cụm nghĩa**. Dấu / dưới đây là chỗ ngắt.",
      },
      {
        t: "table",
        caption: "Ngắt ở đâu? Bốn chỗ ngắt tự nhiên.",
        head: ["Chỗ ngắt", "Ví dụ ( / = ngắt ngắn)", "Đừng ngắt ở"],
        rows: [
          ["Sau chunk mở đầu", "To be honest, / I'm not much of a cook.", "~~To be / honest I'm not~~"],
          ["Trước từ nối (but, so, because, which)", "I get home late, / so I only cook at weekends.", "~~I get home late so / I only cook~~"],
          ["Sau chủ ngữ dài", "A lot of young people in my city / work long hours.", "~~A lot of young / people in my city work~~"],
          ["Trước cụm thời gian / nơi chốn cuối câu", "I usually make it / when I'm tired.", "~~I usually make / it when I'm tired~~"],
        ],
      },
      {
        t: "note",
        title: "💡 Cách tập chunking",
        items: [
          "Bước 1: chép một câu trả lời mẫu, **gạch /** vào chỗ ngắt. Bước 2: đọc từng cụm riêng cho trôi. Bước 3: ghép lại, giữ chỗ ngắt.",
          "Trong một cụm, **không ngắt giữa mạo từ và danh từ** (a / cook ✗), **không ngắt giữa giới từ và danh từ** (at / weekends ✗).",
          "Mỗi cụm có **một từ được nhấn mạnh nhất** (thường là từ nội dung cuối cụm): To be HONest, / I'm not much of a COOK.",
          "Ngắt đúng chỗ còn cho bạn **thời gian thở và nghĩ** mà không cần “um”.",
        ],
      },
      { t: "rule", formula: "Chunk mở đầu / + mệnh đề chính / + từ nối + mệnh đề phụ", vi: "Ngắt sau chunk, trước từ nối, sau chủ ngữ dài. Không ngắt giữa một cụm nghĩa." },
      {
        t: "phatam",
        id: "t3d11-phat-am",
        title: "Luyện phát âm — chunking: đọc liền từng cụm, ngắt ở dấu phẩy",
        note: "Mỗi câu có 2–3 cụm nghĩa. Đọc liền trong cụm, ngắt rất ngắn giữa các cụm, không chêm “um”. Máy chấm từng âm; chỗ ngắt bạn tự nghe lại.",
        items: [
          { text: "I'd say, it depends on the weather.", ipa: "aɪd seɪ ɪt dɪpendz ɒn ðə weðə", vi: "Tôi cho là, tuỳ vào thời tiết. (I'd say / it depends on the weather)" },
          { text: "The thing is, I don't have much free time.", ipa: "ðə θɪŋ ɪz aɪ dəʊnt hæv mʌtʃ friː taɪm", vi: "Vấn đề là, tôi không có nhiều thời gian rảnh. (The thing is / I don't have much free time)" },
          { text: "To be honest, I'm not really a fan of shopping.", ipa: "tə bi ɒnɪst aɪm nɒt rɪəli ə fæn əv ʃɒpɪŋ", vi: "Thật lòng thì, tôi không hẳn là người thích mua sắm. (To be honest / I'm not really a fan of shopping)" },
          { text: "What I mean is, it saves a lot of time.", ipa: "wɒt aɪ miːn ɪz ɪt seɪvz ə lɒt əv taɪm", vi: "Ý tôi là, nó tiết kiệm nhiều thời gian. (What I mean is / it saves a lot of time)" },
          { text: "As far as I know, most people do it online.", ipa: "əz fɑː əz aɪ nəʊ məʊst piːpl duː ɪt ɒnlaɪn", vi: "Theo tôi biết, hầu hết mọi người làm việc đó trên mạng. (As far as I know / most people do it online)" },
          { text: "I can't remember the word, but it's a kind of bag.", ipa: "aɪ kɑːnt rɪmembə ðə wɜːd bət ɪts ə kaɪnd əv bæɡ", vi: "Tôi không nhớ từ đó, nhưng nó là một loại túi. (I can't remember the word / but it's a kind of bag)" },
          { text: "That's a tricky question. Let me think.", ipa: "ðæts ə trɪki kwestʃən let mi θɪŋk", vi: "Câu hỏi khó đấy. Để tôi nghĩ. (hai cụm, mỗi cụm giọng đi xuống)" },
          { text: "So, all in all, I'd say it's worth it.", ipa: "səʊ ɔːl ɪn ɔːl aɪd seɪ ɪts wɜːθ ɪt", vi: "Nên, nhìn chung, tôi cho là nó đáng. (So / all in all / I'd say it's worth it)" },
        ],
      },

      { t: "h", text: "9. Luyện nói — ghi âm, AI chấm" },
      {
        t: "p",
        text: "Trước khi ghi âm, viết ra giấy **hai chunk** bạn sẽ dùng cho mỗi câu (một mở, một nối hoặc kết). Nói xong nghe lại và đếm: có chỗ nào im quá 3 giây không? Có kết câu dứt khoát không? Chép câu trả lời tốt nhất vào **Sổ Speaking** (Ngày 2).",
      },
      {
        t: "speak",
        id: "t3d11-noi-part1",
        part: "1",
        questions: [
          "Do you enjoy cooking?",
          "What kind of food do you usually eat at home?",
          "Who does most of the cooking in your family?",
          "Do you prefer eating at home or eating out?",
          "Is there a dish you would like to learn to make?",
        ],
      },
      {
        t: "speak",
        id: "t3d11-noi-part3",
        part: "3",
        questions: [
          "Why do you think fewer young people cook at home nowadays?",
          "Do you think schools should teach children how to cook?",
          "How have eating habits in your country changed in the last twenty years?",
          "What might happen to traditional dishes in the future?",
        ],
      },
      {
        t: "note",
        title: "📌 Tự chấm sau khi ghi âm",
        items: [
          "☐ Mỗi câu trả lời có 1–2 chunks, không lặp một chunk quá hai lần cả bài.",
          "☐ Không có “Firstly… Moreover… In conclusion” trong Part 1.",
          "☐ Có ít nhất một lần rút gọn + câu đủ (Not really. I…), và một lần dùng từ làm mềm (kind of, tend to, or so).",
          "☐ Có ít nhất một lần **tả một từ không biết** thay vì bỏ qua.",
          "☐ Mọi câu trả lời kết bằng giọng đi xuống, không treo “…and yeah”.",
          "☐ Không chỗ nào im lặng quá 3 giây.",
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI TẬP NGÀY 11 ═══════════════════════════ */
  {
    id: "t3d11-bai-tap",
    kind: "homework",
    title: "Bài tập Ngày 11 — so sánh nâng cao · bội số, phân số · trắc nghiệm đọc · chunks",
    goal: "Tự kiểm cả ngày bằng 40 câu có đáp án và một lượt nói: chọn và viết đúng câu so sánh có mức độ, bội số, phân số; sửa lỗi so lệch vế; loại ba phương án sai trên một đoạn đọc mới; chọn đúng chunk theo chức năng. Đúng từ 28 câu trở lên là đạt.",
    minutes: 55,
    blocks: [
      {
        t: "recap",
        title: "Cách làm bài tập hôm nay",
        items: [
          "Sáu phần, **40 câu** + một lượt nói. Làm một mạch, không mở lại bài học; chấm xong mới tra.",
          "Phần I–IV ôn bài **Ngữ pháp** · Phần V ôn bài **Đọc** · Phần VI–VII ôn bài **Nói**.",
          "Phần II và IV dùng **bảng số liệu** — nhẩm phép chia trước khi điền, đúng như lúc viết Task 1.",
          "Sai câu nào, ghi vào **sổ lỗi** theo mẫu: câu sai → câu đúng → luật một dòng.",
        ],
      },

      { t: "h", text: "Phần I — Chọn đáp án đúng (10 câu)" },
      {
        t: "mcq",
        id: "t3d11-bt-chon",
        title: "I. Mức độ · bội số · phân số · so sánh kép",
        items: [
          { q: "1. Flats: £1,200 · Houses: £1,180. → Flats were ___ more expensive than houses.", options: ["A marginally", "B far", "C considerably", "D by far"], correct: 0, why: "Chênh 20 trên 1.200 = rất ít → marginally / slightly." },
          { q: "2. Wind power was ___ the fastest-growing source of energy.", options: ["A more", "B very", "C so", "D by far"], correct: 3, why: "Trước so sánh nhất dùng by far. more, very, so không đứng trước the + so sánh nhất." },
          { q: "3. Chọn câu ĐÚNG.", options: ["A Women read twice more books than men.", "B Women read twice as many books as men.", "C Women read as twice many books as men.", "D Women read two times books than men."], correct: 1, why: "twice + as many + N + as. twice không đi với more…than." },
          { q: "4. The price rose from $20 to $60. →", options: ["A It doubled.", "B It halved.", "C It rose threefold.", "D It rose fourfold."], correct: 2, why: "60 ÷ 20 = 3 → tripled / rose threefold." },
          { q: "5. 34% of students walked to school. →", options: ["A Just over a third of students walked to school.", "B Almost a quarter of students walked to school.", "C Nearly half of students walked to school.", "D Just under a third of students walked to school."], correct: 0, why: "34% cao hơn 33,3% một chút → just over a third." },
          { q: "6. ___ the city, ___ the cost of living.", options: ["A Bigger / higher", "B The bigger / higher", "C Bigger / the higher", "D The bigger / the higher"], correct: 3, why: "So sánh kép: hai vế đều có the." },
          { q: "7. The population of Tokyo is larger than ___ London.", options: ["A those of", "B it of", "C that of", "D one of"], correct: 2, why: "the population (số ít) → that of." },
          { q: "8. Sales in Asia were higher than ___ in Europe.", options: ["A that", "B those", "C it", "D them"], correct: 1, why: "sales (số nhiều) → those." },
          { q: "9. Chọn câu ĐÚNG.", options: ["A Two-thirds of the land is used for farming.", "B Two-third of the land is used for farming.", "C Two-thirds of the land are used for farming.", "D The two-thirds of land is used for farming."], correct: 0, why: "two-thirds (có s) + of the land (không đếm được) → is." },
          { q: "10. Rail travel was ___ as popular as road travel (6% so với 71%).", options: ["A almost", "B just", "C not nearly", "D twice"], correct: 2, why: "6% kém rất xa 71% → not nearly as popular as." },
        ],
      },

      { t: "h", text: "Phần II — Tính rồi điền (8 câu)" },
      {
        t: "table",
        caption: "Số liệu tự đặt — chi tiêu trung bình mỗi tháng của một sinh viên ở hai thành phố (đô la).",
        head: ["Khoản", "Easton", "Westby"],
        rows: [
          ["Rent", "600", "300"],
          ["Food", "200", "200"],
          ["Transport", "50", "150"],
          ["Books", "40", "42"],
          ["Entertainment", "120", "30"],
        ],
      },
      {
        t: "quiz",
        id: "t3d11-bt-tinh",
        title: "II. Điền MỘT từ vào mỗi chỗ trống",
        kind: "fill",
        items: [
          { q: "1. Students in Easton paid ___ as much rent as students in Westby.", answers: ["twice"] },
          { q: "2. Spending on food in Easton was exactly the ___ as in Westby.", answers: ["same"] },
          { q: "3. Westby students spent three ___ as much on transport as their Easton counterparts.", answers: ["times"] },
          { q: "4. Spending on books in Westby was ___ higher than in Easton. (slightly / far)", answers: ["slightly"] },
          { q: "5. Easton students spent four times as ___ on entertainment as those in Westby.", answers: ["much"] },
          { q: "6. In Easton, spending on transport ($50) was a ___ of spending on food ($200).", answers: ["quarter"] },
          { q: "7. In Westby, the figure for transport ($150) was ___ that for rent ($300). (một từ chỉ phân số)", answers: ["half"] },
          { q: "8. Rent was by ___ the largest item of spending in Easton.", answers: ["far"] },
        ],
      },
      {
        t: "p",
        text: "**Giải nhanh:** 1) 600 ÷ 300 = 2. 3) 150 ÷ 50 = 3. 4) 42 so với 40 — chênh rất ít. 5) 120 ÷ 30 = 4; **much** vì tiền không đếm được. 6) 50 ÷ 200 = ¼. 7) 150 ÷ 300 = ½. 8) 600 so với 200, 120, 50, 40 — bỏ xa.",
      },

      { t: "h", text: "Phần III — Dịch Việt → Anh (6 câu)" },
      {
        t: "quiz",
        id: "t3d11-bt-dich",
        title: "III. Dịch sang tiếng Anh — dùng cụm gợi ý",
        kind: "translate",
        grammar: "twice as much … as · by far the + so sánh nhất · a quarter of that figure · The…, the… · than that of / those in · compared with",
        items: [
          { q: "Sinh viên ở Easton trả tiền thuê nhà nhiều gấp đôi sinh viên ở Westby.", answers: ["Students in Easton paid twice as much rent as students in Westby.", "Students in Easton paid twice as much rent as those in Westby.", "Students in Easton pay twice as much rent as students in Westby.", "Students in Easton pay twice as much rent as those in Westby."], hint: "paid · twice as much rent as" },
          { q: "Tiền thuê nhà là khoản chi lớn nhất, bỏ xa các khoản khác.", answers: ["Rent was by far the largest item of spending.", "Rent was by far the largest area of spending.", "Rent was by far the biggest item of spending.", "Rent is by far the largest item of spending."], hint: "by far the largest · item of spending" },
          { q: "Chi cho giải trí ở Westby bằng một phần tư con số của Easton.", answers: ["Spending on entertainment in Westby was a quarter of the figure for Easton.", "Spending on entertainment in Westby was a quarter of that in Easton.", "Spending on entertainment in Westby was a quarter of the Easton figure.", "Spending on entertainment in Westby was one quarter of the figure for Easton."], hint: "spending on entertainment · a quarter of the figure for" },
          { q: "Thành phố càng lớn thì tiền thuê nhà càng cao.", answers: ["The bigger the city, the higher the rent.", "The larger the city, the higher the rent.", "The bigger the city is, the higher the rent is.", "The bigger the city, the higher the rent is."], hint: "The bigger…, the higher…" },
          { q: "Giá ở thủ đô cao hơn đáng kể so với giá ở vùng nông thôn.", answers: ["Prices in the capital are considerably higher than those in rural areas.", "Prices in the capital were considerably higher than those in rural areas.", "Prices in the capital are considerably higher than in rural areas.", "Prices in the capital are significantly higher than those in rural areas."], hint: "prices in the capital · considerably higher than those in" },
          { q: "Chỉ 6% người dân đi tàu, so với 71% đi ô tô.", answers: ["Only 6% of people travelled by train, compared with 71% by car.", "Only 6% of people travelled by train, compared to 71% by car.", "Only 6% of people travelled by train, compared with 71% who travelled by car.", "Only 6% of people traveled by train, compared with 71% by car."], hint: "only 6% · travelled by train · compared with" },
        ],
      },

      { t: "h", text: "Phần IV — Sửa lỗi (5 câu)" },
      {
        t: "quiz",
        id: "t3d11-bt-sua-loi",
        title: "IV. Mỗi câu có MỘT lỗi ở cụm trong ngoặc vuông. Viết lại cụm đó cho đúng",
        kind: "fill",
        items: [
          { q: "1. Rents in Easton were [twice higher than] in Westby.", answers: ["twice as high as"] },
          { q: "2. The figure for transport was [very lower] in Easton.", answers: ["much lower", "far lower", "considerably lower", "significantly lower", "a lot lower"] },
          { q: "3. The cost of rent in Easton was higher than [Westby].", answers: ["that in Westby", "in Westby"] },
          { q: "4. [More students earn], the more they spend on entertainment.", answers: ["The more students earn"] },
          { q: "5. Rent was [far the largest] item of spending.", answers: ["by far the largest"] },
        ],
      },

      { t: "h", text: "Phần V — Đọc: trắc nghiệm, loại ba đáp án sai (5 câu)" },
      {
        t: "passage",
        title: "Why Supermarkets Play Slow Music",
        intro: "Đoạn đọc tự soạn, khoảng 205 từ. Làm trong 8 phút; ghi ký hiệu ①–⑥ cạnh mỗi phương án bạn loại.",
        paras: [
          { text: "When shoppers walk into a supermarket, few of them notice the music. Retailers, however, choose it with great care. In a well-known study published in the early 1980s, researchers in an American supermarket played slow music on some days and fast music on others. On slow-music days customers moved through the aisles more slowly and, as a result, spent noticeably more money, although when questioned at the exit many could not remember what had been playing. Later studies have produced similar findings in restaurants, where diners stay longer and order more drinks when the tempo is low." },
          { text: "The effect is not always welcome. A busy café that depends on serving as many customers as possible at lunchtime may deliberately choose faster music so that tables become free more quickly. Volume matters too: loud music tends to shorten visits, whatever its speed. Critics argue that such techniques manipulate people without their knowledge. Retailers reply that music is simply part of creating a pleasant atmosphere, no different from lighting or decoration, and point out that nobody is forced to buy anything. What the research cannot yet tell us is whether shoppers who learn about these methods change their behaviour, since very few studies have examined the question." },
        ],
      },
      {
        t: "mcq",
        id: "t3d11-bt-doc",
        title: "V. Choose the correct letter, A, B, C or D",
        items: [
          { q: "1. What did the American supermarket study show?", options: ["A Customers preferred fast music to slow music.", "B Customers left the store sooner on slow-music days.", "C Customers spent more when slow music was played.", "D Customers bought more when the music was loud."], correct: 2, why: "“On slow-music days customers… **spent noticeably more money**” → C. A: ③ không nhắc sở thích. B: ④ ngược (họ đi chậm hơn). D: ① — loud có trong bài nhưng ở đoạn 2 và nói điều ngược lại." },
          { q: "2. When customers were questioned as they left, many of them", options: ["A were unable to recall the music.", "B complained that the music was too slow.", "C said the music had made them stay longer.", "D remembered the music clearly."], correct: 0, why: "“many **could not remember what had been playing**” = unable to recall → A. D: ④ ngược. B, C: ③." },
          { q: "3. Why might a busy café choose fast music at lunchtime?", options: ["A to encourage diners to order more drinks", "B to make the atmosphere more pleasant", "C to cover the noise of the kitchen", "D to make customers leave sooner"], correct: 3, why: "“so that **tables become free more quickly**” = khách rời đi sớm hơn → D. A: ⑤ — gọi thêm đồ uống là tác dụng của nhạc **chậm**. B: ① — pleasant atmosphere là lời của nhà bán lẻ ở câu sau. C: ③." },
          { q: "4. How do retailers respond to criticism of these techniques?", options: ["A They deny that music affects spending.", "B They compare music to other features of a shop.", "C They promise to tell customers about the methods.", "D They say most customers enjoy being influenced."], correct: 1, why: "“music is simply part of creating a pleasant atmosphere, **no different from lighting or decoration**” = so với các yếu tố khác của cửa hàng → B. A: ④. C, D: ③." },
          { q: "5. According to the writer, what is still not known?", options: ["A whether loud music shortens visits", "B whether slow music works in restaurants", "C whether knowing about the methods changes shoppers' behaviour", "D whether critics are right about manipulation"], correct: 2, why: "“What the research **cannot yet tell us** is whether shoppers who learn about these methods change their behaviour” → C. A, B: ④ — hai điều này bài nói là đã biết. D: ③ — bài không phân xử." },
        ],
      },

      { t: "h", text: "Phần VI — Chunks và giữ mạch (6 câu)" },
      {
        t: "mcq",
        id: "t3d11-bt-noi",
        title: "VI. Chọn đáp án đúng",
        items: [
          { q: "1. “Do you often go to the cinema?” — “___ I used to go every week, but these days I just watch films at home.”", options: ["A Moreover.", "B Not really.", "C In conclusion.", "D For instance."], correct: 1, why: "Câu mở rút gọn + câu đủ ngay sau. Ba phương án kia sai chức năng." },
          { q: "2. “I'd love to travel more. ___, flights are so expensive at the moment.”", options: ["A So yeah", "B Take it, for example", "C The thing is", "D And things like that"], correct: 2, why: "Nêu trở ngại / lý do thật → The thing is." },
          { q: "3. Chọn câu hỏi đuôi đúng: “Tickets have got really expensive, ___?”", options: ["A haven't they", "B isn't it", "C don't they", "D aren't they"], correct: 0, why: "Vế trước: Tickets **have got** (hiện tại hoàn thành, khẳng định) → đuôi **haven't they**." },
          { q: "4. Bạn quên từ “umbrella”. Câu nào tốt nhất?", options: ["A I don't know this word. Sorry.", "B It's… um… um… I forget.", "C (nói từ tiếng Việt)", "D It's the thing you use to stay dry when it rains."], correct: 3, why: "Tả bằng công dụng: It's the thing you use to + V." },
          { q: "5. “It's ___ relaxing after a long day.” — từ làm mềm nào hợp?", options: ["A kind of", "B a kind of", "C kinds of", "D kindly"], correct: 0, why: "kind of + adj = hơi hơi (làm mềm). a kind of + N = một loại (nghĩa đen)." },
          { q: "6. Ngắt hơi đúng (/ = chỗ ngắt):", options: ["A To be / honest I'm not much / of a cook.", "B To be honest I'm / not much of a / cook.", "C To be honest, / I'm not much of a cook.", "D To / be honest I'm not / much of a cook."], correct: 2, why: "Ngắt sau chunk mở đầu; không ngắt giữa một cụm nghĩa (much of a cook)." },
        ],
      },

      { t: "h", text: "Phần VII — Nói (ghi âm, AI chấm)" },
      {
        t: "p",
        text: "Trả lời ba câu, mỗi câu 20–40 giây. Yêu cầu: mỗi câu có **hai chunks**, một **móc nối** (because / which means / so), và kết dứt khoát. Câu 3 bắt buộc dùng một lần “I've never actually…, but I imagine…” hoặc “I'm no expert, but…”.",
      },
      {
        t: "speak",
        id: "t3d11-bt-noi-ghi-am",
        part: "1",
        questions: [
          "Do you prefer shopping in stores or online?",
          "How often do you eat out with friends?",
          "What do you think it would be like to run your own restaurant?",
        ],
      },
      {
        t: "note",
        title: "📌 Chấm điểm bài tập",
        items: [
          "**34–40**: vững, sang Ngày 12. **28–33**: đạt, xem lại phần sai. **≤ 27**: học lại mục tương ứng trước khi sang ngày mới.",
          "Sai Phần I–II → Ngữ pháp mục 2–4. Sai Phần III–IV → mục 3, 5, 6. Sai Phần V → bài Đọc mục 2 (sáu kiểu sai). Sai Phần VI → bài Nói mục 2–5.",
          "Ngày mai (Ngày 12) viết bar chart nhiều nhóm — mọi cấu trúc so sánh hôm nay sẽ được dùng ngay, và cuối ngày có **bài kiểm tra chặng Ngày 7–12**.",
        ],
      },
    ],
  },
];
