/**
 * Tập 2 · Ngày 9 — Ngữ pháp: so sánh hơn / nhất / bằng; much / far + so sánh; more / fewer / less + N [G14] ·
 * Nghe: đề nhỏ Part 1 + Part 2 (20 câu, nghe một lần, tự chấm, ghi sổ lỗi) [L03 L04] · Nói: paraphrase câu
 * hỏi giám khảo + 12 chủ đề Part 1 nhanh [S10 S04 S07] 🔊 cụm phụ âm -sts / -ths / -ngths [S11] · Bài tập.
 *
 * Soạn 12/11/2026 theo docs/ielts-lo-trinh-0-8.md mục 3.2 (hàng N9). Tập 1 Ngày 7 (mục bổ sung) đã nhập
 * so sánh hơn / nhất cơ bản — bài ngữ pháp này là vòng 2: quy tắc chính tả đầy đủ, mức độ (much / slightly),
 * so sánh bằng, the same as / similar to / different from, so sánh với danh từ (fewer / less), áp vào
 * Task 1 và Part 1–3. Đề nhỏ Part 1 nối tiếp bài đọc "Westvale" ở Bài tập Ngày 8 (cùng thành phố tự đặt).
 * Mọi kịch bản, số liệu là tự viết.
 */
import type { Lesson } from '../data';

/* ─────────────────────────── Ngữ pháp ─────────────────────────── */

const T2D9_NGU_PHAP: Lesson = {
  id: "t2d9-ngu-phap",
  kind: "grammar",
  title: "Ngữ pháp: So sánh hơn / nhất / bằng",
  goal: "Tạo đúng dạng so sánh của mọi tính từ / trạng từ (kể cả bất quy tắc), thêm mức độ (much, far, slightly), dùng so sánh bằng (as… as, the same as, similar to, different from) và so sánh với danh từ (more / fewer / less) — viết câu so sánh không lỗi cho Task 1 và nói so sánh trôi chảy ở Part 1–3, đẩy GRA band 5.",
  minutes: 60,
  blocks: [
    {
      t: "recap",
      title: "Bài này học gì · đẩy band nào",
      items: [
        "**So sánh hơn**: ==adj-er / more + adj + than== · **so sánh nhất**: ==the + adj-est / the most + adj== · **so sánh bằng**: ==as + adj + as==.",
        "Thêm **mức độ** trước so sánh hơn: ==much / far / a lot / considerably== (nhiều) · ==slightly / a little / a bit== (ít). KHÔNG dùng ~~very~~ + so sánh hơn.",
        "So sánh **danh từ**: more + N · **fewer** + N đếm được · **less** + N không đếm được (~~less people~~ → fewer people).",
        "Giống / khác: ==the same as · similar to · different from== — ba giới từ người Việt hay chọn sai.",
        "Dùng ngay ở **Task 1** (bar chart Ngày 8, pie chart Ngày 12), **Part 1** (Do you prefer…?) và **Part 3** (so với ngày xưa). Đẩy **GRA**: câu so sánh đúng, có mức độ là dấu hiệu band 5+.",
      ],
    },
    {
      t: "p",
      text: "Ở **Tập 1 · Ngày 7** bạn đã gặp bigger, the biggest, more expensive. Hôm nay đi hết các trường hợp: chính tả (bigger, busier), từ hai âm tiết, bất quy tắc, mức độ, so sánh bằng và so sánh với danh từ. Đây là ngữ pháp **dùng nhiều nhất trong Writing Task 1** — một bài biểu đồ cột có thể có 6–8 câu so sánh.",
    },
    {
      t: "sodo",
      kind: "compare",
      title: "Ba bậc so sánh — ba thành phố",
      cols: [
        { title: "Bằng", anh: "heavy-equals-sign", items: ["Hue is **as quiet as** Hoi An.", "as + adj + as", "not as + adj + as = kém hơn"] },
        { title: "Hơn", anh: "up-arrow", items: ["Hanoi is **busier than** Hue.", "adj-er / more adj + than", "much / far / slightly + hơn"] },
        { title: "Nhất", anh: "1st-place-medal", items: ["HCMC is **the busiest** city in Vietnam.", "the + adj-est / the most adj", "+ in + nơi · of + nhóm"] },
      ],
    },

    { t: "h", text: "1. Tạo dạng so sánh: -er / -est hay more / most?" },
    {
      t: "table",
      caption: "Quy tắc theo số âm tiết",
      head: ["Tính từ", "Hơn", "Nhất", "Ghi chú"],
      rows: [
        ["**1 âm tiết**: cheap, tall, fast", "cheap**er**", "the cheap**est**", "thêm -er / -est"],
        ["1 âm tiết tận cùng **e**: large, safe", "large**r**", "the large**st**", "chỉ thêm -r / -st"],
        ["1 âm tiết **phụ âm–nguyên âm–phụ âm**: big, hot, thin, wet", "bi**gg**er", "the bi**gg**est", "**gấp đôi** phụ âm cuối"],
        ["**2 âm tiết tận cùng -y**: busy, easy, noisy, happy", "bus**ier**", "the bus**iest**", "y → **i** + er / est"],
        ["**2 âm tiết trở lên** (còn lại): modern, crowded, expensive, polluted", "**more** modern", "**the most** modern", "thêm more / most phía trước"],
        ["Một số từ 2 âm tiết dùng **cả hai**: quiet, simple, narrow, clever", "quiet**er** / more quiet", "the quiet**est**", "-er tự nhiên hơn"],
        ["**Trạng từ -ly**: quickly, carefully", "**more** quickly", "**the most** quickly", "~~quicklier~~ sai"],
        ["Trạng từ trùng dạng tính từ: fast, hard, late, early", "fast**er**, hard**er**, earl**ier**", "the fast**est**", "như tính từ (early → earlier theo quy tắc -y)"],
      ],
    },
    {
      t: "table",
      caption: "Bất quy tắc — phải thuộc",
      head: ["Gốc", "Hơn", "Nhất"],
      rows: [
        ["good / well", "**better**", "the **best**"],
        ["bad / badly", "**worse**", "the **worst**"],
        ["far", "**further** / farther", "the **furthest** / farthest"],
        ["many / much", "**more**", "the **most**"],
        ["little (lượng)", "**less**", "the **least**"],
      ],
    },
    {
      t: "note",
      title: "Người Việt hay sai khi tạo dạng",
      items: [
        "~~more better~~, ~~more cheaper~~ → **better**, **cheaper** — đã có -er thì **không** thêm more.",
        "~~the most biggest~~ → **the biggest**.",
        "~~badder~~, ~~gooder~~ → **worse**, **better**.",
        "~~expensiver~~, ~~moderner~~ → **more expensive**, **more modern**.",
        "Chính tả: ~~biger~~ → **bigger** · ~~busyer~~ → **busier** · ~~larger~~ đúng, ~~largeer~~ sai.",
        "Ngoại lệ 1 âm tiết: tính từ đuôi **-ed** và **fun** dùng **more**: ~~tireder~~ → **more tired** · **more bored** · ~~funner~~ → **more fun**.",
      ],
    },
    {
      t: "rule",
      formula: "1 âm tiết → adj-er / the adj-est · -y → -ier / -iest · 2+ âm tiết → more / the most + adj · good → better → the best · bad → worse → the worst",
      vi: "Một từ chỉ có MỘT dấu so sánh: hoặc -er, hoặc more — không bao giờ cả hai.",
    },
    {
      t: "quiz",
      id: "t2d9-dang-dich",
      title: "Dịch sang tiếng Anh — dạng so sánh (4 câu)",
      kind: "translate",
      grammar: "adj-er + than · more + adj + than · better / worse + than",
      items: [
        { q: "Hà Nội đông đúc hơn Huế.", hint: "Hanoi is, busier / more crowded, than Hue", answers: ["Hanoi is busier than Hue.", "Hanoi is more crowded than Hue.", "Ha Noi is busier than Hue.", "Ha Noi is more crowded than Hue.", "Hanoi is more crowded than Hue is.", "Hanoi is busier than Hue is."] },
        { q: "Căn hộ ở trung tâm đắt hơn căn hộ ở ngoại ô.", hint: "Flats / Apartments in the centre, are more expensive than, those in the suburbs", answers: ["Flats in the centre are more expensive than those in the suburbs.", "Apartments in the centre are more expensive than those in the suburbs.", "Flats in the city centre are more expensive than flats in the suburbs.", "Apartments in the city centre are more expensive than apartments in the suburbs.", "Flats in the centre are more expensive than flats in the suburbs.", "Apartments in the center are more expensive than those in the suburbs.", "Apartments in the city centre are more expensive than those in the suburbs."] },
        { q: "Tiếng Anh của cô ấy tốt hơn của tôi.", hint: "Her English, is better than, mine", answers: ["Her English is better than mine.", "Her English is better than my English.", "She speaks English better than me.", "She speaks English better than I do."] },
        { q: "Ô nhiễm không khí năm nay tệ hơn năm ngoái.", hint: "Air pollution, is worse, this year, than last year", answers: ["Air pollution is worse this year than last year.", "Air pollution this year is worse than last year.", "Air pollution is worse this year than it was last year.", "This year air pollution is worse than last year.", "This year, air pollution is worse than last year.", "Air pollution this year is worse than it was last year."] },
      ],
    },

    { t: "h", text: "2. So sánh hơn + mức độ" },
    {
      t: "patterns",
      rows: [
        {
          formula: "A + V + adj-er / more + adj + than + B",
          vi: "Sau **than** có thể là danh từ, đại từ tân ngữ (than **me** — văn nói), hoặc mệnh đề (than **I am** — trang trọng hơn).",
          examples: [
            { en: "The metro is faster than the bus.", vi: "Metro nhanh hơn xe buýt." },
            { en: "My brother is taller than me. / … than I am.", vi: "Anh tôi cao hơn tôi." },
          ],
        },
        {
          formula: "much / far / a lot / considerably + adj-er / more + adj",
          vi: "Chênh **nhiều**. **far / considerably** hợp văn viết (Task 1); **a lot** hợp văn nói.",
          examples: [
            { en: "Living in the city is much more expensive than living in the countryside.", vi: "Sống ở thành phố đắt hơn nhiều so với sống ở nông thôn." },
            { en: "Car use was considerably higher in Ashford.", vi: "Lượng dùng ô tô ở Ashford cao hơn đáng kể." },
          ],
        },
        {
          formula: "slightly / a little / a bit + adj-er / more + adj",
          vi: "Chênh **ít**. **slightly** hợp Task 1; **a bit** chỉ dùng khi nói.",
          examples: [{ en: "The figure for women was slightly lower than that for men.", vi: "Số liệu của nữ thấp hơn của nam một chút." }],
        },
        {
          formula: "less + adj (2+ âm tiết) + than",
          vi: "Kém hơn — thay cho “not as… as”. Hay dùng với tính từ dài: less expensive, less crowded.",
          examples: [{ en: "Trains are less comfortable than planes, but they are less stressful.", vi: "Tàu kém thoải mái hơn máy bay, nhưng ít căng thẳng hơn." }],
        },
      ],
    },
    {
      t: "note",
      title: "Cẩn thận",
      items: [
        "~~very cheaper~~ → **much** cheaper. very chỉ đi với tính từ **thường** (very cheap), không đi với so sánh hơn.",
        "~~more far~~ → **further / farther**.",
        "So sánh **hai thứ cùng loại**: ~~The price of a flat in Hanoi is higher than Hue~~ → … higher than **that in** Hue / higher than **in** Hue. (that = the price — đã gặp ở Ngày 8.)",
      ],
    },
    {
      t: "rule",
      formula: "much / far / slightly + adj-er / more + adj + than · less + adj + than",
      vi: "Mức độ đứng TRƯỚC so sánh hơn; không dùng very.",
    },
    {
      t: "quiz",
      id: "t2d9-hon-dich",
      title: "Dịch sang tiếng Anh — so sánh hơn có mức độ (4 câu)",
      kind: "translate",
      grammar: "much / far / slightly + adj-er + than · less + adj + than",
      items: [
        { q: "Đi tàu điện ngầm nhanh hơn nhiều so với đi xe buýt.", hint: "Travelling by metro / Taking the metro, is much / far faster than, travelling by bus / taking the bus", answers: ["Travelling by metro is much faster than travelling by bus.", "Taking the metro is much faster than taking the bus.", "Travelling by metro is far faster than travelling by bus.", "The metro is much faster than the bus.", "The metro is far faster than the bus.", "Going by metro is much faster than going by bus.", "Traveling by metro is much faster than traveling by bus.", "Taking the metro is far faster than taking the bus."] },
        { q: "Năm nay vé máy bay rẻ hơn một chút.", hint: "Plane tickets / Flights, are slightly / a little cheaper, this year", answers: ["Plane tickets are slightly cheaper this year.", "Flights are slightly cheaper this year.", "Plane tickets are a little cheaper this year.", "Flights are a little cheaper this year.", "Air tickets are slightly cheaper this year.", "This year plane tickets are slightly cheaper.", "Plane tickets are a bit cheaper this year.", "Flights are a bit cheaper this year."] },
        { q: "Khu này ít ồn ào hơn trung tâm thành phố.", hint: "This area, is less noisy than / is quieter than, the city centre", answers: ["This area is less noisy than the city centre.", "This area is quieter than the city centre.", "This area is less noisy than the city center.", "This area is quieter than the city center.", "This neighbourhood is quieter than the city centre.", "This area is not as noisy as the city centre.", "This area isn't as noisy as the city centre."] },
        { q: "Con số cho nữ cao hơn đáng kể so với cho nam.", hint: "The figure for women, was considerably higher than, that for men", answers: ["The figure for women was considerably higher than that for men.", "The figure for women is considerably higher than that for men.", "The figure for women was considerably higher than the figure for men.", "The figure for women was significantly higher than that for men.", "The figure for women was much higher than that for men.", "The figure for women was far higher than that for men."] },
      ],
    },

    { t: "h", text: "3. So sánh nhất" },
    {
      t: "patterns",
      rows: [
        {
          formula: "the + adj-est / the most + adj (+ in + nơi / nhóm · + of + số / khoảng thời gian)",
          vi: "**in** + nơi chốn, tập thể (in Vietnam, in my class) · **of** + số lượng, thời gian (of the three cities, of the year).",
          examples: [
            { en: "Ho Chi Minh City is the largest city in Vietnam.", vi: "TP.HCM là thành phố lớn nhất Việt Nam." },
            { en: "Carlton had the highest figure of the three cities.", vi: "Carlton có số liệu cao nhất trong ba thành phố." },
          ],
        },
        {
          formula: "one of the + adj-est / most + adj + N số nhiều",
          vi: "**Một trong những** — danh từ phải **số nhiều**.",
          examples: [{ en: "Hoi An is one of the most beautiful towns in Asia.", vi: "Hội An là một trong những thị trấn đẹp nhất châu Á." }],
        },
        {
          formula: "the second / third + adj-est",
          vi: "Lớn **thứ hai**, **thứ ba** — rất hay dùng trong Task 1.",
          examples: [{ en: "The bus was the second most popular mode of transport.", vi: "Xe buýt là phương tiện phổ biến thứ hai." }],
        },
        {
          formula: "the + adj-est + N + (that) + S + have / has ever + V3",
          vi: "Nhất từ trước tới nay — câu Part 1–2 rất tự nhiên (hiện tại hoàn thành, Ngày 5).",
          examples: [{ en: "It was the best meal I've ever had.", vi: "Đó là bữa ăn ngon nhất tôi từng ăn." }],
        },
        {
          formula: "the least + adj",
          vi: "**Ít … nhất** (ngược của the most).",
          examples: [{ en: "Cycling was the least popular option in Bexley.", vi: "Xe đạp là lựa chọn ít phổ biến nhất ở Bexley." }],
        },
      ],
    },
    {
      t: "note",
      title: "Cẩn thận",
      items: [
        "Thiếu **the**: ~~It is biggest city~~ → It is **the** biggest city.",
        "~~one of the best city~~ → one of the best **cities** (số nhiều).",
        "~~the most popular of Vietnam~~ → **in** Vietnam (nơi chốn dùng in).",
        "Task 1: ~~the most highest~~ → **the highest**; viết “**by far** the highest” khi cột đó vượt xa các cột khác.",
      ],
    },
    {
      t: "rule",
      formula: "the + adj-est / the most + adj + in (nơi) / of (nhóm) · one of the + adj-est + N(s) · the second + adj-est",
      vi: "So sánh nhất luôn có THE; “một trong những” đi với danh từ số nhiều.",
    },
    {
      t: "quiz",
      id: "t2d9-nhat-dich",
      title: "Dịch sang tiếng Anh — so sánh nhất (4 câu)",
      kind: "translate",
      grammar: "the + adj-est / the most + adj + in / of · one of the + adj-est + N(s) · the second + adj-est",
      items: [
        { q: "Đây là thành phố sạch nhất mà tôi từng đến.", hint: "This is, the cleanest city, I've ever visited / been to", answers: ["This is the cleanest city I've ever visited.", "This is the cleanest city I have ever visited.", "This is the cleanest city I've ever been to.", "This is the cleanest city I have ever been to.", "This is the cleanest city that I've ever visited.", "This is the cleanest city that I have ever been to."] },
        { q: "Phở là một trong những món ăn nổi tiếng nhất của Việt Nam.", hint: "Pho is, one of the most famous dishes, in Vietnam / Vietnamese", answers: ["Pho is one of the most famous dishes in Vietnam.", "Pho is one of the most famous Vietnamese dishes.", "Pho is one of the most famous dishes of Vietnam.", "Pho is one of Vietnam's most famous dishes.", "Pho is one of the best-known dishes in Vietnam.", "Pho is one of the best-known Vietnamese dishes."] },
        { q: "Xe buýt là phương tiện phổ biến thứ hai.", hint: "The bus, was the second most popular, mode of transport / form of transport", answers: ["The bus was the second most popular mode of transport.", "The bus is the second most popular mode of transport.", "The bus was the second most popular form of transport.", "The bus is the second most popular form of transport.", "The bus was the second most popular means of transport.", "Buses were the second most popular mode of transport."] },
        { q: "Tháng Bảy là tháng nóng nhất trong năm.", hint: "July is, the hottest month, of the year", answers: ["July is the hottest month of the year.", "July is the hottest month in the year.", "July is the hottest month of the year", "July is usually the hottest month of the year."] },
      ],
    },

    { t: "h", text: "4. So sánh bằng, giống và khác" },
    {
      t: "patterns",
      rows: [
        {
          formula: "A + V + as + adj / adv + as + B",
          vi: "Bằng nhau. Phủ định **not as / not so + adj + as** = **kém hơn** (cách nói mềm, rất hay dùng).",
          examples: [
            { en: "Da Lat is as cool as Sa Pa in summer.", vi: "Đà Lạt mát ngang Sa Pa vào mùa hè." },
            { en: "The bus isn't as fast as the metro.", vi: "Xe buýt không nhanh bằng metro." },
          ],
        },
        {
          formula: "as many + N đếm được + as · as much + N không đếm được + as",
          vi: "Bằng nhau về **số lượng**.",
          examples: [{ en: "I don't have as much free time as I used to.", vi: "Tôi không còn nhiều thời gian rảnh như trước." }],
        },
        {
          formula: "the same as + N · the same + N + as",
          vi: "Giống hệt. ~~the same with~~ là sai.",
          examples: [
            { en: "My phone is the same as yours.", vi: "Điện thoại của tôi giống hệt của bạn." },
            { en: "Carlton had the same proportion of cyclists as car users.", vi: "Carlton có tỉ lệ người đạp xe bằng tỉ lệ người đi ô tô." },
          ],
        },
        {
          formula: "similar to + N · different from + N",
          vi: "Giống (gần giống) · khác. ~~similar with~~, ~~different with~~ là sai. (Anh còn nói different **to**, Mỹ different **than**; bài viết cứ dùng **from**.)",
          examples: [{ en: "Life in Hue is very different from life in Ho Chi Minh City.", vi: "Cuộc sống ở Huế rất khác cuộc sống ở TP.HCM." }],
        },
        {
          formula: "twice / three times + as + adj + as (nhập)",
          vi: "Gấp hai, gấp ba — rất hay dùng trong Task 1 (Ngày 8). **Tập 3** học kỹ cùng “the more…, the more…”.",
          examples: [{ en: "Rents in the centre are twice as high as in the suburbs.", vi: "Tiền thuê nhà ở trung tâm cao gấp đôi ở ngoại ô." }],
        },
      ],
    },
    {
      t: "rule",
      formula: "as + adj + as · not as + adj + as · the same (+ N) as · similar to · different from",
      vi: "Giới từ cố định: same AS · similar TO · different FROM.",
    },
    {
      t: "quiz",
      id: "t2d9-bang-dich",
      title: "Dịch sang tiếng Anh — so sánh bằng, giống, khác (4 câu)",
      kind: "translate",
      grammar: "as + adj + as · not as + adj + as · the same as · similar to · different from",
      items: [
        { q: "Mùa hè ở Đà Lạt không nóng bằng ở Sài Gòn.", hint: "Summer in Da Lat, isn't as hot as, in Saigon", answers: ["Summer in Da Lat isn't as hot as in Saigon.", "Summer in Da Lat is not as hot as in Saigon.", "Summer in Da Lat isn't as hot as summer in Saigon.", "Summer in Da Lat is not as hot as summer in Saigon.", "Summer in Da Lat isn't as hot as in Ho Chi Minh City.", "Summer in Da Lat isn't as hot as it is in Saigon.", "Da Lat isn't as hot as Saigon in summer."] },
        { q: "Kết quả của tôi giống hệt kết quả của bạn.", hint: "My result / My results, is / are the same as, yours", answers: ["My result is the same as yours.", "My results are the same as yours.", "My result is exactly the same as yours.", "My results are exactly the same as yours.", "My score is the same as yours."] },
        { q: "Món ăn miền Bắc khá khác món ăn miền Nam.", hint: "Northern food / Food in the north, is quite different from, southern food / food in the south", answers: ["Northern food is quite different from southern food.", "Food in the north is quite different from food in the south.", "Northern food is quite different from food in the south.", "Northern food is rather different from southern food.", "Northern food is quite different to southern food.", "Northern food is quite different than southern food.", "Northern Vietnamese food is quite different from southern Vietnamese food."] },
        { q: "Tôi không có nhiều thời gian rảnh như em gái tôi.", hint: "I don't have, as much free time as, my sister", answers: ["I don't have as much free time as my sister.", "I do not have as much free time as my sister.", "I don't have as much free time as my sister does.", "I don't have as much free time as my younger sister.", "I don't have as much free time as my little sister."] },
      ],
    },

    { t: "h", text: "5. So sánh với danh từ: more / fewer / less" },
    {
      t: "table",
      head: ["", "Danh từ ĐẾM ĐƯỢC (cars, people, jobs)", "Danh từ KHÔNG ĐẾM ĐƯỢC (traffic, money, time)"],
      rows: [
        ["Nhiều hơn", "**more** cars than", "**more** traffic than"],
        ["Ít hơn", "**fewer** cars than", "**less** traffic than"],
        ["Nhiều nhất", "**the most** cars", "**the most** traffic"],
        ["Ít nhất", "**the fewest** cars", "**the least** traffic"],
      ],
    },
    {
      t: "note",
      title: "fewer hay less?",
      items: [
        "Văn nói tiếng Anh hằng ngày hay nghe **less people** — nhưng trong **bài thi viết**, giám khảo coi là lỗi. Dùng **fewer** + danh từ số nhiều.",
        "Task 1: **fewer** students · **fewer** cars · **less** money · **less** time · **less** energy.",
        "Danh từ đếm được / không đếm được: ôn **Tập 1 · Ngày 5**.",
      ],
    },
    {
      t: "rule",
      formula: "more + N · fewer + N(s) đếm được · less + N không đếm được · the most / the fewest / the least + N",
      vi: "fewer đi với danh từ đếm được số nhiều; less đi với danh từ không đếm được.",
    },
    {
      t: "quiz",
      id: "t2d9-danh-tu-dich",
      title: "Dịch sang tiếng Anh — so sánh với danh từ (3 câu)",
      kind: "translate",
      grammar: "more / fewer / less + N + than · the fewest / the least + N",
      items: [
        { q: "Ngày nay có ít người đọc báo giấy hơn.", hint: "Fewer people, read printed newspapers / paper newspapers, nowadays / today", answers: ["Fewer people read printed newspapers nowadays.", "Fewer people read printed newspapers today.", "Nowadays fewer people read printed newspapers.", "Nowadays, fewer people read printed newspapers.", "Fewer people read paper newspapers nowadays.", "Fewer people read newspapers nowadays.", "These days fewer people read printed newspapers."] },
        { q: "Ở nông thôn có ít ô nhiễm hơn ở thành phố.", hint: "There is less pollution, in the countryside, than in the city / in cities", answers: ["There is less pollution in the countryside than in the city.", "There is less pollution in the countryside than in cities.", "There's less pollution in the countryside than in the city.", "The countryside has less pollution than the city.", "There is less pollution in rural areas than in cities.", "There is less pollution in the countryside than in the cities."] },
        { q: "Ashford có ít người đi metro nhất.", hint: "Ashford had, the fewest metro users", answers: ["Ashford had the fewest metro users.", "Ashford has the fewest metro users.", "Ashford had the fewest people using the metro.", "Ashford had the fewest metro passengers.", "Ashford had the lowest number of metro users."] },
      ],
    },

    { t: "h", text: "6. So sánh trong bài thi" },
    {
      t: "table",
      head: ["Phần thi", "Tình huống", "Câu mẫu"],
      rows: [
        ["**Speaking Part 1**", "Do you prefer…? · Which is better…?", "I prefer the countryside **because** it's **much quieter** and the air is **cleaner**."],
        ["**Speaking Part 2**", "Describe the **best** / **most interesting**…", "It was **the most delicious** meal **I've ever had**."],
        ["**Speaking Part 3**", "Is life better now than in the past?", "In some ways, yes. Life is **far more convenient** than it **used to be**, but people seem **less relaxed**."],
        ["**Writing Task 1**", "Biểu đồ cột / tròn / bảng", "The figure for X was **considerably higher than that for** Y. · X had **the lowest** proportion."],
        ["**Writing Task 2**", "So sánh hai lựa chọn", "Public transport is **far less** harmful to the environment **than** private cars."],
      ],
    },
    {
      t: "note",
      title: "Mẹo — bí ý Task 2 / Part 3? Dùng so sánh để làm sâu một ý",
      items: [
        "Một ý thường chỉ được 1–2 câu rồi cạn. Thêm **một phép so sánh** là có ngay 2 câu nữa, lại khoe được ngữ pháp hôm nay. Ba hướng so sánh dễ nhất:",
        "**Xưa – nay**: Twenty years ago…, whereas today… / … is far more… than it used to be.",
        "**Nơi này – nơi khác**: In big cities…, while in rural areas… / Compared with…, Vietnam…",
        "**Nhóm này – nhóm khác**: Young people…, but older people… / … is much harder for low-income families than for…",
      ],
    },
    {
      t: "examples",
      items: [
        { en: "[Ý gốc — 2 câu, cạn ý] Smartphones help students learn. They can find information quickly.", vi: "Điện thoại thông minh giúp học sinh học. Các em tìm thông tin nhanh." },
        { en: "[Thêm so sánh xưa – nay] Twenty years ago, a student who wanted to check a fact had to go to a library, which could take a whole afternoon. Today the same information is available in a few seconds, so learners can spend far more time understanding ideas than searching for them.", vi: "Hai mươi năm trước, học sinh muốn kiểm tra một thông tin phải đến thư viện, có khi mất cả buổi chiều. Ngày nay cùng thông tin đó có trong vài giây, nên người học dành được nhiều thời gian để hiểu ý hơn là đi tìm." },
        { en: "[Thêm so sánh nơi này – nơi khác] This benefit is even greater in rural areas, where libraries are much smaller and less well-stocked than those in cities.", vi: "Lợi ích này còn lớn hơn ở vùng nông thôn, nơi thư viện nhỏ hơn và ít sách hơn nhiều so với ở thành phố." },
      ],
    },

    { t: "h", text: "7. Lỗi người Việt hay mắc + luyện chọn" },
    {
      t: "note",
      title: "Người Việt hay sai khi so sánh",
      items: [
        "Hai dấu so sánh: ~~more cheaper~~ · ~~most biggest~~.",
        "Thiếu **than**: ~~Hanoi is bigger Hue~~ → bigger **than** Hue. Thiếu **the**: ~~It is cheapest~~ → **the** cheapest.",
        "Sai giới từ: ~~same with~~ · ~~similar with~~ · ~~different with~~ · ~~the best of Vietnam~~.",
        "~~very taller~~ → **much** taller.",
        "~~less people~~ → **fewer** people (văn viết).",
        "So sánh khập khiễng: ~~The weather in Hanoi is colder than Hue~~ → … colder than **in** Hue / than **that in** Hue.",
      ],
    },
    {
      t: "mcq",
      id: "t2d9-chon",
      title: "Luyện chọn — so sánh (10 câu)",
      items: [
        { q: "(1) This year's exam was ___ than last year's.", options: ["more easier", "easier", "easyer"], correct: 1, why: "easy (2 âm tiết, -y) → **easier**. Không thêm more." },
        { q: "(2) Tokyo is one of ___ cities in the world.", options: ["most expensive", "the more expensive", "the most expensive"], correct: 2, why: "**one of the + most + adj + N số nhiều**." },
        { q: "(3) The metro is ___ faster than the bus.", options: ["much", "more", "very"], correct: 0, why: "Mức độ + so sánh hơn: **much** faster. ~~very faster~~ sai." },
        { q: "(4) My opinion is similar ___ yours.", options: ["to", "with", "as"], correct: 0, why: "**similar to**." },
        { q: "(5) There were ___ accidents this year than last year.", options: ["little", "less", "fewer"], correct: 2, why: "**accidents** đếm được số nhiều → **fewer**." },
        { q: "(6) Hue is not ___ busy ___ Hanoi.", options: ["so / than", "as / as", "more / than"], correct: 1, why: "**not as + adj + as**." },
        { q: "(7) That was ___ film I've ever seen.", options: ["the worst", "the worse", "the baddest"], correct: 0, why: "bad → worse → **the worst**." },
        { q: "(8) Her job is the same ___ mine.", options: ["like", "as", "with"], correct: 1, why: "**the same as**." },
        { q: "(9) The figure for 2020 was ___ higher than that for 2019 (chỉ chênh 1%).", options: ["far", "considerably", "slightly"], correct: 2, why: "Chênh **ít** (1%) → **slightly**." },
        { q: "(10) Câu nào ĐÚNG?", options: ["The price of houses in Hanoi is higher than Da Nang.", "The price of houses in Hanoi is higher than in Da Nang.", "The price of houses in Hanoi is more high than in Da Nang."], correct: 1, why: "So sánh **cùng loại** (giá nhà ở HN với giá nhà **ở** ĐN) → thêm **in**. Câu 3 sai dạng (more high)." },
      ],
    },
  ],
};

/* ─────────────────────────── Nghe ─────────────────────────── */

const T2D9_NGHE: Lesson = {
  id: "t2d9-nghe",
  kind: "listening",
  title: "Nghe: Đề nhỏ Part 1 + Part 2 (20 câu, đúng giờ) — tự chấm, ghi sổ lỗi",
  goal: "Làm một đề nhỏ 20 câu (Part 1 điền phiếu + Part 2 trắc nghiệm và nối) đúng điều kiện thi thật — đọc trước, nghe MỘT lần, không dừng — rồi tự chấm, xếp lỗi vào 6 loại và ghi sổ lỗi; đích ≥ 14/20 (mốc Listening band 5 của Tập 2).",
  minutes: 75,
  blocks: [
    {
      t: "recap",
      title: "Bài này học gì · đẩy band nào",
      items: [
        "Lần đầu làm **đề nhỏ đúng giờ**: Part 1 (câu 1–10, điền phiếu) + Part 2 (câu 11–20, trắc nghiệm + nối). Như thi thật: **đọc trước – nghe một lần – không dừng**.",
        "Ôn mọi bẫy đã học: **đánh vần**, số, **đổi ý** (no, sorry…), **used to… but now**, **giới hạn từ**.",
        "Sau khi chấm: xếp mỗi câu sai vào **6 loại lỗi** (chính tả · số ít / nhiều · bẫy đổi ý · không nhận paraphrase · lỡ nhịp · quá số từ) và ghi vào sổ.",
        "Mục tiêu Tập 2: **Part 1 + Part 2 ≥ 14/20** — tương đương đường tới **Listening band 5** (16/40) khi cộng Part 3–4.",
        "Mục 5: **chữa đề đúng cách** bằng lời thoại — 5 bước (tự tìm lại → chấm → đọc lời thoại → sổ paraphrase → chép chính tả 2–3 đoạn khó), dùng cho mọi đề từ nay.",
      ],
    },

    { t: "h", text: "1. Làm đề như thi thật" },
    {
      t: "table",
      head: ["Quy tắc", "Thi thật (máy tính)", "Hôm nay"],
      rows: [
        ["Đọc trước", "Có thời gian đọc trước mỗi nhóm câu (khoảng 30 giây)", "Đọc **cả phiếu và câu hỏi** trong 1 phút trước khi bấm Nghe"],
        ["Số lần nghe", "**Một lần duy nhất**", "**Một lần** — không tua, không dừng, chưa mở lời thoại"],
        ["Ghi đáp án", "Gõ ngay khi nghe", "Ghi ra giấy khi nghe, chép vào ô sau khi băng hết"],
        ["Kiểm tra", "2 phút kiểm cuối phần (bản máy) · 10 phút chép đáp án (bản giấy)", "**2 phút** soát chính tả, số nhiều, giới hạn từ"],
      ],
    },
    {
      t: "sodo",
      kind: "flow",
      title: "Một lượt đề nhỏ",
      steps: [
        { label: "1 phút đọc", sub: "gạch từ khoá; đoán loại từ mỗi ô (tên? số? tháng?)" },
        { label: "Nghe Part 1 (câu 1–10)", sub: "điền theo thứ tự; lỡ câu thì bỏ, bám câu sau" },
        { label: "Nghe Part 2 (câu 11–20)", sub: "trắc nghiệm: gạch phương án bị loại; nối: ghi chữ ngay" },
        { label: "2 phút soát", sub: "chính tả · số ít / nhiều · ≤ số từ cho phép" },
        { label: "Chấm + ghi sổ lỗi", sub: "mỗi câu sai một dòng: loại lỗi + câu đúng trong lời thoại" },
      ],
    },

    { t: "h", text: "2. Part 1 — Questions 1–10" },
    {
      t: "canh",
      anh: ["bicycle", "telephone-receiver", "woman-office-worker"],
      caption: "**Daniel** gọi điện cho **Westvale City Bikes** — dịch vụ xe đạp công cộng của thành phố Westvale (Bài tập Ngày 8) — để đăng ký làm thành viên. Nhân viên **Rachel** ghi phiếu.",
    },
    {
      t: "p",
      text: "**Questions 1–10.** Complete the form below. Write **ONE WORD AND/OR A NUMBER** for each answer.",
    },
    {
      t: "table",
      caption: "Westvale City Bikes — New member form",
      head: ["Mục", "Thông tin"],
      rows: [
        ["First name", "Daniel"],
        ["Surname", "(1) ______"],
        ["Address", "14 (2) ______ Road, Westvale"],
        ["Postcode", "(3) ______"],
        ["Date of birth", "3rd (4) ______ 2001"],
        ["Type of membership", "(5) ______"],
        ["Cost", "£ (6) ______"],
        ["Preferred docking station", "near the (7) ______"],
        ["Helmet", "can (8) ______ one free at the main office"],
        ["First ride free for", "(9) ______ minutes"],
        ["Membership card sent by", "(10) ______"],
      ],
    },
    {
      t: "listen",
      id: "t2d9-nghe-p1",
      title: "Joining Westvale City Bikes",
      dan: { so: "Day 9, Test — Part 1", boiCanh: "a telephone conversation between a man who wants to join a bike-share scheme and an employee.", cau: [1, 10] },
      note: "Khoảng 3 phút. Rachel (giọng Anh, nữ), Daniel (giọng Mỹ, nam). Nghe MỘT lần.",
      lines: [
        { who: "Rachel", voice: "uk-nu", text: "Good morning, Westvale City Bikes. Rachel speaking. How can I help?", vi: "Chào buổi sáng, Westvale City Bikes, Rachel nghe. Tôi giúp gì được ạ?" },
        { who: "Daniel", voice: "us-nam", text: "Hi. I'd like to become a member, please. I've just moved to Westvale for work.", vi: "Chào chị. Tôi muốn đăng ký thành viên. Tôi vừa chuyển đến Westvale để làm việc." },
        { who: "Rachel", voice: "uk-nu", text: "Lovely. I can do that over the phone. Can I have your name first?", vi: "Tốt quá. Tôi có thể làm qua điện thoại. Cho tôi xin tên trước nhé?" },
        { who: "Daniel", voice: "us-nam", text: "Sure. It's Daniel Hartley. That's H-A-R-T-L-E-Y.", vi: "Vâng. Daniel Hartley. Đánh vần H-A-R-T-L-E-Y." },
        { who: "Rachel", voice: "uk-nu", text: "Thank you. And your address?", vi: "Cảm ơn anh. Còn địa chỉ?" },
        { who: "Daniel", voice: "us-nam", text: "It's 14 Orchard Road. Orchard, like a field of fruit trees.", vi: "Số 14 đường Orchard. Orchard, như vườn cây ăn quả." },
        { who: "Rachel", voice: "uk-nu", text: "Got it. And the postcode?", vi: "Rồi ạ. Còn mã bưu chính?" },
        { who: "Daniel", voice: "us-nam", text: "Let me check… it's W-V-3, 8-P-T.", vi: "Để tôi xem… W-V-3, 8-P-T." },
        { who: "Rachel", voice: "uk-nu", text: "WV3 8PT. Lovely. And could I have your date of birth?", vi: "WV3 8PT. Được rồi. Cho tôi xin ngày sinh?" },
        { who: "Daniel", voice: "us-nam", text: "The third of August, two thousand and one. Oh, sorry, no — that's my brother's birthday. Mine's the third of October.", vi: "Ngày ba tháng Tám năm 2001. Ồ, xin lỗi, không — đó là sinh nhật em trai tôi. Của tôi là ngày ba tháng Mười." },
        { who: "Rachel", voice: "uk-nu", text: "Third of October, two thousand and one. Now, which type of membership would you like? We have pay-as-you-go, monthly or annual.", vi: "Ngày 3 tháng 10 năm 2001. Giờ anh muốn loại thành viên nào? Chúng tôi có trả theo lượt, theo tháng hoặc theo năm." },
        { who: "Daniel", voice: "us-nam", text: "I was thinking monthly. How much is that?", vi: "Tôi đang nghĩ đến gói tháng. Bao nhiêu tiền ạ?" },
        { who: "Rachel", voice: "uk-nu", text: "Monthly is twelve pounds. But if you're going to cycle to work every day, the annual membership is much better value. It's ninety pounds for the whole year.", vi: "Gói tháng là mười hai bảng. Nhưng nếu anh định đạp xe đi làm mỗi ngày, gói năm lợi hơn nhiều. Chín mươi bảng cả năm." },
        { who: "Daniel", voice: "us-nam", text: "Ninety for twelve months? That's a lot cheaper. Is there a student price? I finished my master's degree in June.", vi: "Chín mươi cho mười hai tháng? Rẻ hơn nhiều đấy. Có giá sinh viên không? Tôi vừa học xong thạc sĩ hồi tháng Sáu." },
        { who: "Rachel", voice: "uk-nu", text: "The student price is sixty pounds, but I'm afraid you need a current student card.", vi: "Giá sinh viên là sáu mươi bảng, nhưng tiếc là anh cần thẻ sinh viên còn hiệu lực." },
        { who: "Daniel", voice: "us-nam", text: "Ah, I don't have one any more. OK, I'll go for the annual one at the normal price, then.", vi: "À, tôi không còn thẻ nữa. Vậy tôi chọn gói năm giá thường." },
        { who: "Rachel", voice: "uk-nu", text: "Great. We also ask members to choose a preferred docking station, so we can tell you if it's closed. Where would suit you?", vi: "Tuyệt. Chúng tôi cũng nhờ thành viên chọn một trạm đỗ ưa thích, để báo cho anh nếu trạm đóng. Chỗ nào tiện cho anh?" },
        { who: "Daniel", voice: "us-nam", text: "Probably the one at the train station.", vi: "Chắc là trạm ở ga tàu." },
        { who: "Rachel", voice: "uk-nu", text: "That one's always full in the morning, to be honest. A lot of people from your area use the one near the library instead. It's only two minutes further.", vi: "Thật lòng mà nói trạm đó sáng nào cũng đầy. Nhiều người khu anh dùng trạm gần thư viện hơn. Chỉ xa thêm hai phút." },
        { who: "Daniel", voice: "us-nam", text: "OK, let's put the library, then.", vi: "Vậy ghi trạm thư viện nhé." },
        { who: "Rachel", voice: "uk-nu", text: "Done. Do you have a helmet? We don't sell them, but you can borrow one free of charge at our main office on Bridge Street.", vi: "Xong. Anh có mũ bảo hiểm chưa? Chúng tôi không bán, nhưng anh có thể mượn miễn phí ở văn phòng chính trên phố Bridge." },
        { who: "Daniel", voice: "us-nam", text: "Great, I'll pick one up on Monday.", vi: "Tuyệt, thứ Hai tôi sẽ qua lấy." },
        { who: "Rachel", voice: "uk-nu", text: "And there's one more thing. Your first ride is free. Normally it's for thirty minutes, but this month we're offering forty-five minutes to all new members.", vi: "Còn một điều nữa. Lượt đi đầu tiên miễn phí. Bình thường là ba mươi phút, nhưng tháng này chúng tôi tặng bốn mươi lăm phút cho mọi thành viên mới." },
        { who: "Daniel", voice: "us-nam", text: "Nice. And will you email me my membership card?", vi: "Hay quá. Chị sẽ gửi thẻ thành viên qua email cho tôi chứ?" },
        { who: "Rachel", voice: "uk-nu", text: "We used to do that, but now everyone gets a plastic card, so it'll come by post. It should arrive within five days.", vi: "Trước đây chúng tôi làm vậy, nhưng giờ ai cũng nhận thẻ nhựa, nên thẻ sẽ gửi qua đường bưu điện. Trong vòng năm ngày sẽ tới." },
        { who: "Daniel", voice: "us-nam", text: "Perfect. Thanks very much, Rachel.", vi: "Tuyệt. Cảm ơn chị Rachel nhiều." },
      ],
    },
    {
      t: "quiz",
      id: "t2d9-nghe-p1-dien",
      title: "Questions 1–10 — ONE WORD AND/OR A NUMBER",
      kind: "fill",
      items: [
        { q: "1. Surname: ___", answers: ["Hartley"] },
        { q: "2. Address: 14 ___ Road, Westvale", answers: ["Orchard"] },
        { q: "3. Postcode: ___", answers: ["WV3 8PT", "WV38PT"] },
        { q: "4. Date of birth: 3rd ___ 2001", answers: ["October", "Oct"] },
        { q: "5. Type of membership: ___", answers: ["annual"] },
        { q: "6. Cost: £ ___", answers: ["90", "ninety"] },
        { q: "7. Preferred docking station: near the ___", answers: ["library"] },
        { q: "8. Helmet: can ___ one free at the main office", answers: ["borrow"] },
        { q: "9. First ride free for ___ minutes", answers: ["45", "forty-five", "forty five"] },
        { q: "10. Membership card sent by ___", answers: ["post"] },
      ],
    },

    { t: "h", text: "3. Part 2 — Questions 11–20" },
    {
      t: "canh",
      anh: ["radio", "man-walking", "deciduous-tree"],
      caption: "Một chương trình radio địa phương. Người dẫn **Megan** giới thiệu khách mời **Tom Price**, người phụ trách **Riverside Walk** — con đường đi bộ mới dọc sông ở Westvale.",
    },
    {
      t: "p",
      text: "**Questions 11–15.** Choose the correct letter, **A, B or C**. — **Questions 16–20.** What can visitors do at each place on the Riverside Walk? Choose **FIVE** answers from the box and write the correct letter, **A–G**, next to Questions 16–20. Đọc trước cả hai nhóm câu.",
    },
    {
      t: "table",
      caption: "Questions 11–15 (đọc trước)",
      head: ["Câu", "Câu hỏi", "A", "B", "C"],
      rows: [
        ["11", "How long is the full Riverside Walk?", "5 km", "7 km", "9 km"],
        ["12", "Why was the opening delayed?", "bad weather", "a shortage of money", "a problem with a bridge"],
        ["13", "What does Tom say about dogs?", "They are not allowed on the island.", "They must be on a lead everywhere.", "They can swim in the river."],
        ["14", "Visitors who park at the north entrance at weekends pay", "nothing.", "£2 an hour.", "£3 for the day."],
        ["15", "Tom recommends visiting", "early in the morning.", "at lunchtime.", "in the evening."],
      ],
    },
    {
      t: "table",
      caption: "Questions 16–20 — Activities (A–G)",
      head: ["Chữ", "Hoạt động", "Câu", "Địa điểm"],
      rows: [
        ["A", "hire a boat", "16", "the old mill"],
        ["B", "see an exhibition", "17", "the boathouse"],
        ["C", "have a picnic", "18", "the island"],
        ["D", "buy local food", "19", "the market square"],
        ["E", "watch birds", "20", "the viewing tower"],
        ["F", "take photos of the whole city", "", ""],
        ["G", "join a guided walk", "", ""],
      ],
    },
    {
      t: "listen",
      id: "t2d9-nghe-p2",
      title: "The new Riverside Walk",
      dan: { so: "Day 9, Test — Part 2", boiCanh: "part of a local radio programme about a new walking route along a river.", cau: [11, 20] },
      note: "Khoảng 3 phút. Megan (giọng Mỹ, nữ) dẫn; Tom (giọng Anh, nam) nói phần chính. Nghe MỘT lần.",
      lines: [
        { who: "Megan", voice: "us-nu", text: "And now, with the weather finally getting warmer, we've got Tom Price in the studio. Tom manages the new Riverside Walk. Welcome, Tom.", vi: "Và bây giờ, khi trời cuối cùng cũng ấm lên, chúng ta có Tom Price trong phòng thu. Tom quản lý Riverside Walk mới. Chào mừng anh, Tom." },
        { who: "Tom", voice: "uk-nam", text: "Thanks, Megan. Well, the Riverside Walk follows the river from the north entrance near the motorway all the way down to the old harbour. The full walk is seven kilometres, although most people do the shorter five-kilometre loop. The original plan was for nine kilometres, but we couldn't get permission to go through the farmland at the southern end.", vi: "Cảm ơn Megan. Riverside Walk chạy dọc sông từ lối vào phía bắc gần đường cao tốc xuống tận bến cảng cũ. Toàn tuyến dài bảy cây số, dù đa số người đi vòng ngắn năm cây số. Kế hoạch ban đầu là chín cây số, nhưng chúng tôi không xin được phép đi qua đất nông nghiệp ở đầu phía nam." },
        { who: "Megan", voice: "us-nu", text: "It opened a bit later than planned, didn't it?", vi: "Nó mở cửa muộn hơn dự kiến một chút, phải không?" },
        { who: "Tom", voice: "uk-nam", text: "About four months later, yes. A lot of people assumed we'd run out of money, but in fact the funding was never a problem, and the winter was quite mild. What happened was that engineers found a fault in the steel of the new footbridge, so it had to be replaced before anyone could walk on it.", vi: "Muộn khoảng bốn tháng, đúng vậy. Nhiều người tưởng chúng tôi hết tiền, nhưng thực ra kinh phí chưa bao giờ là vấn đề, và mùa đông cũng khá ấm. Chuyện là các kỹ sư phát hiện lỗi trong thép của cây cầu đi bộ mới, nên phải thay trước khi cho người đi." },
        { who: "Tom", voice: "uk-nam", text: "Dog owners often ask me about the rules. Dogs are welcome on most of the walk, and they don't need to be on a lead except in the market square. But they aren't allowed on the island at all, because birds nest there. And please don't let them into the river — the current is stronger than it looks.", vi: "Người nuôi chó hay hỏi tôi về quy định. Chó được chào đón trên phần lớn tuyến đi, và không cần dắt dây trừ ở quảng trường chợ. Nhưng chúng hoàn toàn không được lên hòn đảo, vì chim làm tổ ở đó. Và xin đừng để chó xuống sông — dòng nước mạnh hơn vẻ ngoài." },
        { who: "Tom", voice: "uk-nam", text: "As for parking, the car park at the north entrance is free on weekdays, but at weekends there's a charge of three pounds for the whole day. There's no hourly rate.", vi: "Về đỗ xe, bãi đỗ ở lối vào phía bắc miễn phí các ngày trong tuần, nhưng cuối tuần thu ba bảng cả ngày. Không có giá theo giờ." },
        { who: "Megan", voice: "us-nu", text: "And when's the best time to go?", vi: "Còn khi nào là lúc đi đẹp nhất?" },
        { who: "Tom", voice: "uk-nam", text: "A lot of office workers come at lunchtime, and it gets very crowded then. The evenings are popular too. But if you ask me, the best time is early in the morning, when the river is completely calm and you can see herons fishing.", vi: "Nhiều nhân viên văn phòng đến vào giờ trưa, và lúc đó rất đông. Buổi tối cũng đông. Nhưng nếu hỏi tôi, lúc đẹp nhất là sáng sớm, khi mặt sông hoàn toàn phẳng lặng và bạn có thể thấy diệc bắt cá." },
        { who: "Tom", voice: "uk-nam", text: "Now let me tell you about the places along the way. Your first stop will probably be the old mill. It stopped making flour in the 1950s, and now it holds an exhibition about the history of the river and the people who worked on it.", vi: "Giờ tôi kể về các điểm dọc đường. Điểm dừng đầu tiên có lẽ là cối xay cũ. Nó ngừng xay bột từ thập niên 1950, và giờ trưng bày một triển lãm về lịch sử con sông và những người làm việc trên đó." },
        { who: "Tom", voice: "uk-nam", text: "A little further on is the boathouse. People always expect to hire boats there, and you could, years ago, but the insurance became too expensive. These days, it's where our guided walks start, every Saturday and Sunday at ten.", vi: "Đi thêm một chút là nhà thuyền. Người ta luôn nghĩ có thể thuê thuyền ở đó, và nhiều năm trước thì được, nhưng tiền bảo hiểm trở nên quá đắt. Ngày nay, đó là nơi bắt đầu các chuyến đi bộ có hướng dẫn, mỗi thứ Bảy và Chủ nhật lúc mười giờ." },
        { who: "Tom", voice: "uk-nam", text: "Then there's the island, which you reach by the new footbridge. Please don't plan a picnic there — it isn't allowed. But it's the best place on the whole walk to watch birds. We've counted more than forty different species.", vi: "Rồi đến hòn đảo, đi qua bằng cầu đi bộ mới. Xin đừng định picnic ở đó — không được phép. Nhưng đó là nơi ngắm chim đẹp nhất cả tuyến. Chúng tôi đã đếm được hơn bốn mươi loài." },
        { who: "Tom", voice: "uk-nam", text: "Next comes the market square. There's no grass there, so it isn't really a place to sit down, but on Saturdays there's a farmers' market, where you can buy bread, cheese and vegetables from local farms. If you want a picnic, keep walking to the old harbour at the very end — there are tables by the water.", vi: "Tiếp theo là quảng trường chợ. Ở đó không có cỏ nên không hẳn là chỗ ngồi nghỉ, nhưng thứ Bảy có chợ nông sản, nơi bạn mua được bánh mì, phô mai và rau từ các trang trại địa phương. Nếu muốn picnic, hãy đi tiếp tới bến cảng cũ ở tận cuối — có bàn ngay bên bờ nước." },
        { who: "Tom", voice: "uk-nam", text: "And finally, at the southern end, there's the viewing tower. It's sixty steps to the top, but from there you can see right across Westvale, so bring your camera.", vi: "Và cuối cùng, ở đầu phía nam là tháp ngắm cảnh. Lên đỉnh phải leo sáu mươi bậc, nhưng từ đó bạn nhìn bao quát cả Westvale, nên nhớ mang máy ảnh." },
        { who: "Megan", voice: "us-nu", text: "Sounds wonderful. Tom Price, thank you.", vi: "Nghe tuyệt quá. Tom Price, cảm ơn anh." },
      ],
    },
    {
      t: "mcq",
      id: "t2d9-nghe-p2-chon",
      title: "Questions 11–15 — Multiple choice",
      items: [
        { q: "(11) How long is the full Riverside Walk?", options: ["A 5 km", "B 7 km", "C 9 km"], correct: 1, why: "“The **full** walk is **seven** kilometres”. 5 km là **vòng ngắn**; 9 km là **kế hoạch ban đầu**." },
        { q: "(12) Why was the opening delayed?", options: ["A bad weather", "B a shortage of money", "C a problem with a bridge"], correct: 2, why: "“engineers found **a fault in the steel of the new footbridge**”. Tiền: “**never a problem**”; thời tiết: “**quite mild**”." },
        { q: "(13) What does Tom say about dogs?", options: ["A They are not allowed on the island.", "B They must be on a lead everywhere.", "C They can swim in the river."], correct: 0, why: "“they **aren't allowed on the island** at all”. B sai: chỉ phải dắt dây **ở quảng trường chợ**; C sai: “please **don't** let them into the river”." },
        { q: "(14) Visitors who park at the north entrance at weekends pay", options: ["A nothing.", "B £2 an hour.", "C £3 for the day."], correct: 2, why: "“at weekends there's a charge of **three pounds for the whole day**. There's **no hourly rate**.” Miễn phí là **ngày thường**." },
        { q: "(15) Tom recommends visiting", options: ["A early in the morning.", "B at lunchtime.", "C in the evening."], correct: 0, why: "“**if you ask me**, the best time is **early in the morning**”. Giờ trưa “very crowded”; buổi tối chỉ “popular too” — không phải lời khuyên." },
      ],
    },
    {
      t: "quiz",
      id: "t2d9-nghe-p2-noi",
      title: "Questions 16–20 — ghi MỘT chữ cái (A–G)",
      kind: "fill",
      items: [
        { q: "16. the old mill ___", answers: ["B"] },
        { q: "17. the boathouse ___", answers: ["G"] },
        { q: "18. the island ___", answers: ["E"] },
        { q: "19. the market square ___", answers: ["D"] },
        { q: "20. the viewing tower ___", answers: ["F"] },
      ],
    },

    { t: "h", text: "4. Đáp án, lời giải và cách tự chấm" },
    {
      t: "note",
      title: "Lời giải Part 1 (câu 1–10)",
      items: [
        "**1 Hartley** — đánh vần H-A-R-T-L-E-Y. Viết hoa chữ đầu không bắt buộc, nhưng **sai một chữ = sai câu**.",
        "**2 Orchard** — người nói còn giải thích “like a field of fruit trees” để bạn chắc chính tả.",
        "**3 WV3 8PT** — mã bưu chính Anh: chữ + số, đọc từng ký tự. Một mã tính là một “số”.",
        "**4 October** — bẫy **đổi ý**: “the third of August… **Oh, sorry, no** — that's my brother's birthday. Mine's the third of **October**.”",
        "**5 annual** — bẫy: Daniel định chọn **monthly**, rồi đổi sang “the **annual** one”. (“yearly” đúng nghĩa nhưng **không** được chấm: đề nhỏ chấm như thi thật — chỉ nhận **đúng từ đã nghe**.)",
        "**6 90** — bẫy ba con số: monthly **12**, student **60** (cần thẻ sinh viên — Daniel **không còn**), annual normal price **90**.",
        "**7 library** — bẫy: Daniel nói “train station”, nhưng Rachel khuyên trạm gần **library** và anh ấy đồng ý: “let's put the library”.",
        "**8 borrow** — “you can **borrow** one free of charge at our main office”. Đừng ghi “buy” — họ **không bán**.",
        "**9 45** — “Normally it's for thirty minutes, **but this month** we're offering **forty-five**”.",
        "**10 post** — “We **used to** do that (email), **but now**… it'll come **by post**.” (“mail” không được chấm — từ nghe được là **post**.)",
      ],
    },
    {
      t: "note",
      title: "Lời giải Part 2 (câu 16–20)",
      items: [
        "**16 B** (see an exhibition) — cối xay cũ “now it **holds an exhibition** about the history of the river”.",
        "**17 G** (join a guided walk) — bẫy **A**: “People always expect to **hire boats** there, and you could, **years ago**, but… These days, it's where our **guided walks start**.”",
        "**18 E** (watch birds) — bẫy **C**: “Please **don't** plan a **picnic** there — it isn't allowed. But it's the best place… to **watch birds**.”",
        "**19 D** (buy local food) — “a farmers' market, where you can **buy** bread, cheese and vegetables **from local farms**”. Bẫy **C**: picnic được nhắc ngay sau, nhưng ở **bến cảng cũ** (old harbour — không có trong câu hỏi), còn quảng trường “**isn't really a place to sit down**”.",
        "**20 F** (take photos of the whole city) — “you can **see right across Westvale**, so **bring your camera**” = chụp ảnh toàn thành phố (paraphrase).",
        "Hai phương án thừa: **A** (thuê thuyền — không còn) và **C** (picnic — **cấm** ở đảo, chỉ được ở bến cảng cũ ngoài danh sách).",
      ],
    },
    {
      t: "table",
      caption: "Bảng quy đổi gợi ý cho đề nhỏ 20 câu (Part 1 + Part 2)",
      head: ["Số câu đúng / 20", "Mức hiện tại", "Đường tới band cả bài (40 câu)"],
      rows: [
        ["17–20", "Vững Part 1–2", "Đủ nền cho band 5.5–6 nếu Part 3–4 đạt ≥ 6/20"],
        ["14–16", "**Đạt mục tiêu Tập 2**", "Band 5 (16/40) trong tầm tay khi Part 3–4 đạt 2–4 câu"],
        ["10–13", "Band 4–4.5", "Ôn bẫy đổi ý (lời giải ở mục 4; học kỹ ở Ngày 11 mục 3), luyện thêm Part 1 Tập 1 Ngày 7, 15"],
        ["≤ 9", "Chưa vững", "Làm lại đề này sau 2 ngày, lần này được nghe 2 lần, rồi mới làm đề mới"],
      ],
    },
    {
      t: "table",
      caption: "Sổ lỗi — xếp mỗi câu sai vào MỘT loại",
      head: ["Loại lỗi", "Ví dụ", "Cách sửa"],
      rows: [
        ["① Chính tả", "Hartly · Orcherd", "Luyện đánh vần tên (Tập 1 Ngày 1); viết chữ cái ra giấy khi nghe đánh vần"],
        ["② Số ít / nhiều, đơn vị", "minute / 45 minutes thừa từ", "Đọc kỹ chữ đứng **trước và sau** ô trống trên phiếu"],
        ["③ Bẫy đổi ý", "August (đáp án October) · monthly", "Nghe hết câu sau **no, sorry · actually · but now** (Ngày 11 học kỹ)"],
        ["④ Không nhận paraphrase", "câu 20 (bring your camera = take photos)", "Ôn 3 cách paraphrase (Ngày 8)"],
        ["⑤ Lỡ nhịp", "bỏ trống câu 7–8 vì còn nghĩ câu 6", "Lỡ thì bỏ; mắt luôn ở **câu kế tiếp**"],
        ["⑥ Quá số từ", "“the library station” (ONE WORD)", "Khoanh giới hạn từ trước khi nghe"],
      ],
    },
    {
      t: "note",
      title: "Sau khi chấm",
      items: [
        "Mở lời thoại, **tô vàng** câu chứa đáp án và **gạch đỏ** câu bẫy ngay trước nó — bạn sẽ thấy bẫy hầu như luôn đứng **trước** đáp án.",
        "Ghi các câu sai vào **Sổ lỗi** (trang Sổ lỗi tự động, hoặc vở): loại lỗi + câu đúng trong lời thoại. Trước bài kiểm tra chặng Ngày 12, đọc lại sổ.",
        "Nghe lại cả bài **một lần nữa có lời thoại** để luyện tai — nhưng điểm tính theo lần nghe đầu.",
      ],
    },

    { t: "h", text: "5. Chữa đề đúng cách — 5 bước với lời thoại (transcript)" },
    {
      t: "p",
      text: "Làm một đề rồi chỉ xem đáp án là **phí đề**. Bạn mới biết mình **sai câu nào**, chưa biết **vì sao sai**. Người lên band nhanh dùng **mỗi đề 2–3 lượt**: lượt 1 làm như thi thật, lượt 2–3 **chữa** bằng lời thoại (transcript — bản chép lời bài nghe). Trên trang này lời thoại nằm sau nút **“Hiện lời thoại (transcript)”** dưới mỗi khối nghe. Chữa một đề nhỏ mất khoảng **25–30 phút** — bằng thời gian làm đề.",
    },
    {
      t: "sodo",
      kind: "flow",
      title: "Chữa một đề Listening — làm đúng thứ tự",
      caption: "Bước 1 làm TRƯỚC khi xem đáp án — đây là bước hay bị bỏ nhất. Bước 2–5 chỉ làm với câu sai và câu đoán mò.",
      steps: [
        { label: "① Tự tìm lại", sub: "**Chưa xem đáp án.** Nghe lại đoạn có câu mình không chắc (tối đa 2 lần), sửa bằng **bút khác màu**." },
        { label: "② Chấm, nghe lại chỗ sai", sub: "Chấm cả hai màu. Mỗi câu sai: nghe lại **chỉ đoạn đó** 3–5 lần — tai nghe ra chữ gì?" },
        { label: "③ Đọc lời thoại như bài đọc", sub: "Tìm **câu chứa đáp án** → tô vàng. Câu bẫy ngay trước nó → gạch đỏ." },
        { label: "④ Ghi cặp paraphrase", sub: "Đề viết gì ↔ người nói nói gì. Mỗi cặp một dòng trong **sổ chữa đề**." },
        { label: "⑤ Chép chính tả 2–3 đoạn khó", sub: "Nghe một câu → dừng → viết → so lời thoại → ghi chữ / âm mình nghe sai." },
      ],
    },
    {
      t: "table",
      caption: "Chữa sâu đến đâu — tuỳ trình độ",
      head: ["Bạn đang ở", "Bước 3–4 làm với", "Bước 5"],
      rows: [
        ["Band 4–5 (Tập 2)", "**Chỉ đoạn chứa đáp án** của câu sai + câu bẫy ngay trước nó", "1–2 đoạn ngắn (2–3 câu)"],
        ["Band 5.5–6", "Cả đoạn quanh mọi câu sai **và** câu đúng nhờ đoán", "2–3 đoạn, mỗi đoạn 4–5 câu"],
        ["Band 6.5+", "Cả lời thoại: ghi mọi cặp paraphrase, kể cả câu đã đúng", "3 đoạn + đọc nhại (shadowing) cả Part"],
      ],
    },
    {
      t: "note",
      title: "Cẩn thận: ba cách chữa đề vô ích",
      items: [
        "**Xem đáp án trước, nghe lại sau** — lúc đó tai đã biết chữ cần nghe nên bạn “nghe ra” hết, và không biết mình thật sự kém ở đâu. Luôn làm **bước ① trước**.",
        "**Đọc lời thoại từ đầu đến cuối như đọc truyện** — mất 15 phút mà không ghi được gì. Đọc **có mục đích**: tìm câu chứa đáp án, tô, ghi cặp.",
        "**Chép chính tả cả bài** — quá dài, chán, bỏ giữa chừng. Chọn **2–3 đoạn khó nhất** (đoạn có câu sai) là đủ.",
      ],
    },
    {
      t: "table",
      caption: "Sổ chữa đề — mẫu, điền từ đề hôm nay",
      head: ["Câu", "Đề viết", "Người nói nói", "Vì sao mình sai"],
      rows: [
        ["12", "a problem with **a bridge**", "engineers found **a fault in the steel** of the new **footbridge**", "Không nhận ra paraphrase (problem = fault); nghe “money” trước nên chọn B"],
        ["17", "join **a guided walk**", "it's where our **guided walks start**", "Bẫy “used to”: nghe “hire boats” trước rồi ghi luôn A"],
        ["20", "**take photos** of the whole city", "you can **see right across** Westvale, so **bring your camera**", "Không nhận paraphrase: không có chữ “photo” nào"],
      ],
    },
    {
      t: "quiz",
      id: "t2d9-nghe-chua-de",
      title: "Bước ④ — tìm cụm của người nói ứng với chữ trên đề (6 câu, mở lời thoại Part 2 để làm)",
      kind: "fill",
      items: [
        { q: "(12) Đề: “a **problem** with a bridge” ↔ Tom: “engineers found a ___ in the steel of the new footbridge”", answers: ["fault"], hint: "một từ nghĩa là “lỗi, chỗ hỏng”" },
        { q: "(14) Đề: “£3 **for the day**” ↔ Tom: “a charge of three pounds for the ___ day”", answers: ["whole"], hint: "cả (ngày)" },
        { q: "(15) Đề: “Tom **recommends**…” ↔ Tom: “if you ___ me, the best time is early in the morning”", answers: ["ask"], hint: "“nếu bạn hỏi tôi” = ý kiến riêng của người nói" },
        { q: "(16) Đề: “**see** an exhibition” ↔ Tom: “now it ___ an exhibition about the history of the river”", answers: ["holds"], hint: "động từ “tổ chức, trưng bày” (thêm -s)" },
        { q: "(17) Đề: “**join** a guided walk” ↔ Tom: “it's where our guided walks ___”", answers: ["start"], hint: "bắt đầu (nơi xuất phát)" },
        { q: "(19) Đề: “buy **local food**” ↔ Tom: “bread, cheese and vegetables from local ___”", answers: ["farms"], hint: "trang trại (số nhiều)" },
      ],
    },
    {
      t: "note",
      title: "Lời giải — và cặp paraphrase nên chép vào sổ",
      items: [
        "**fault** — problem ↔ **fault** (đồng nghĩa). Câu bẫy đứng ngay trước: “people assumed we'd **run out of money**, but in fact the funding was **never a problem**”.",
        "**whole** — for the day ↔ **for the whole day**; bẫy: “There's **no hourly rate**” (loại B £2 an hour).",
        "**ask** — recommends ↔ **if you ask me, the best time is…** (nêu ý kiến riêng = khuyên). Buổi trưa và buổi tối bị nhắc nhưng chỉ để **chê đông**.",
        "**holds** — see an exhibition ↔ **it holds an exhibition** (đổi góc nhìn: nơi trưng bày ↔ người xem).",
        "**start** — join a guided walk ↔ **where our guided walks start**. Câu bẫy trước nó: “you could [hire boats], **years ago**, but…”.",
        "**farms** — local food ↔ **bread, cheese and vegetables from local farms** (chung ↔ cụ thể: “food” được kể thành từng món).",
      ],
    },
    {
      t: "listen",
      id: "t2d9-nghe-chep",
      title: "Bước ⑤ — hai đoạn khó để chép chính tả",
      note: "Hai câu trích từ Part 2 (Tom, giọng Anh nam). Nghe từng câu, bấm dừng, viết ra giấy cả câu; rồi làm 6 ô bên dưới để kiểm những chỗ hay nghe sai. Chưa mở lời thoại khi chưa viết xong.",
      lines: [
        { who: "Tom", voice: "uk-nam", text: "People always expect to hire boats there, and you could, years ago, but the insurance became too expensive.", vi: "Người ta luôn nghĩ có thể thuê thuyền ở đó, và nhiều năm trước thì được, nhưng tiền bảo hiểm trở nên quá đắt." },
        { who: "Tom", voice: "uk-nam", text: "There's no grass there, so it isn't really a place to sit down, but on Saturdays there's a farmers' market.", vi: "Ở đó không có cỏ nên không hẳn là chỗ ngồi nghỉ, nhưng thứ Bảy có chợ nông sản." },
      ],
    },
    {
      t: "quiz",
      id: "t2d9-nghe-chep-dien",
      title: "Kiểm bài chép — điền chữ bạn nghe được (6 ô)",
      kind: "fill",
      items: [
        { q: "People always ___ to hire boats there", answers: ["expect"], hint: "/ɪkˈspekt/ — âm /t/ cuối rất nhẹ, dễ nghe thành “expec”" },
        { q: "and you ___, years ago", answers: ["could"], hint: "/kʊd/ — /d/ cuối gần như nuốt" },
        { q: "but the ___ became too expensive", answers: ["insurance"], hint: "in-SURE-ance, trọng âm âm tiết 2" },
        { q: "There's no ___ there", answers: ["grass"], hint: "giọng Anh /ɡrɑːs/ — nguyên âm dài" },
        { q: "so it ___ really a place to sit down", answers: ["isn't", "is not"], hint: "dạng rút gọn, /t/ cuối nhẹ" },
        { q: "but on Saturdays there's a ___ market", answers: ["farmers'", "farmers", "farmer's"], hint: "chợ của nông dân — /ˈfɑːməz/" },
      ],
    },
    {
      t: "note",
      title: "Sau bước ⑤ — ghi gì vào sổ?",
      items: [
        "Ghi **chữ bạn nghe sai và vì sao**: “could” nghe thành “cool” (nuốt /d/) · “isn't really” nghe thành “is really” (mất /nt/ — **đảo nghĩa câu!**).",
        "Chữ **isn't / aren't / wasn't** là chỗ người mới hay mất nhất: nghe thiếu “n't” là hiểu ngược hoàn toàn. Mỗi lần chép chính tả, soát riêng các chữ phủ định.",
        "Hôm sau, **nghe lại đúng đề này một lần** (không nhìn lời) trước khi làm đề mới. Lần này bạn nên đúng ≥ 18/20 — nếu chưa, các cặp paraphrase trong sổ chưa “vào tai”, đọc lại sổ.",
        "Quy trình 5 bước này dùng cho **mọi đề** từ nay: đề nhỏ Ngày 21, đề 40 câu Ngày 23, các đề Online Test.",
      ],
    },
    {
      t: "rule",
      formula: "Tự tìm lại → chấm → đọc lời thoại tìm câu chứa đáp án → ghi cặp paraphrase → chép 2–3 đoạn khó",
      vi: "Đề làm xong mới dùng được một nửa; nửa còn lại là chữa. Người band 4–5 chỉ cần chữa đoạn chứa đáp án của câu sai.",
    },
  ],
};

/* ─────────────────────────── Nói ─────────────────────────── */

const T2D9_NOI: Lesson = {
  id: "t2d9-noi",
  kind: "speaking",
  title: "Nói: Paraphrase câu hỏi giám khảo + 12 chủ đề Part 1 nhanh",
  goal: "Mở mỗi câu trả lời Part 1 bằng cách nói lại câu hỏi theo lời mình (không lặp từ giám khảo), trả lời 2–4 câu cho 12 chủ đề Part 1 hay gặp với từ vựng riêng của từng chủ đề — đẩy Lexical Resource (paraphrase) và Fluency lên band 5; xử lý được chủ đề lạ và lúc quên từ mà không im lặng; đọc trọn cụm phụ âm cuối -sts / -ths / -ngths.",
  minutes: 75,
  blocks: [
    {
      t: "recap",
      title: "Bài này học gì · đẩy band nào",
      items: [
        "Giám khảo hỏi “Do you **like** **reading books**?” — người band 4 đáp “Yes, I **like reading books** because…” (lặp nguyên từ). Người band 5+ đáp “Yes, I'm **a big reader**, especially **novels**…”.",
        "Ba cách paraphrase khi nói (giống bài Đọc Ngày 8): ==đồng nghĩa== · ==đổi loại từ== · ==đổi cấu trúc== — và thêm cách thứ tư rất hợp Part 1: ==chung → cụ thể== (books → crime novels).",
        "**12 chủ đề Part 1** hay gặp: thời tiết · âm nhạc · phim · đọc · mua sắm · giao thông công cộng · điện thoại · cuối tuần · giấc ngủ · tiếng ồn · hàng xóm · sinh nhật.",
        "Khung trả lời 2–4 câu (15–25 giây): **Trả lời (đã paraphrase) → Lý do → Ví dụ / chi tiết**.",
        "Đẩy **LR** (band 5 = “paraphrase lúc được lúc không” → hôm nay biến thành thói quen) và **FC**. Phát âm: cụm phụ âm cuối **texts · months · lengths**.",
        "**Gặp chủ đề lạ** → nói rộng sang chủ đề liền kề hoặc lịch sự nói không hứng thú rồi chuyển hướng; **quên từ** → giải nghĩa bằng mệnh đề (a thing which…, people who…); bộ từ **Reading / sách** (mục 2–2c).",
      ],
    },

    { t: "h", text: "1. Vì sao không lặp lại câu hỏi?" },
    {
      t: "p",
      text: "Tiêu chí **Lexical Resource** band 5–6 đòi hỏi bạn **paraphrase được** (diễn đạt lại bằng từ khác). Cách dễ nhất để giám khảo thấy điều đó là **câu đầu tiên** của mỗi câu trả lời: thay vì nhắc lại nguyên câu hỏi, bạn nói **cùng ý bằng từ của mình**. Không cần từ khó — chỉ cần **khác**.",
    },
    {
      t: "table",
      caption: "Bốn cách mở câu trả lời không lặp từ",
      head: ["Cách", "Câu hỏi", "Mở câu trả lời"],
      rows: [
        ["① Đồng nghĩa", "Do you **like** music?", "Yes, I'm **really into** music / I'm **a huge fan of** music."],
        ["② Đổi loại từ", "Do you **enjoy shopping**?", "Not really. I'm not much of a **shopper**."],
        ["③ Đổi cấu trúc", "**Does it rain** a lot in your hometown?", "**We get** a lot of rain / **There's** heavy rain almost every afternoon…"],
        ["④ Chung → cụ thể", "Do you **watch films**?", "Yes, **mostly science fiction and animated films**…"],
      ],
    },
    {
      t: "table",
      caption: "Kho từ thay thế hay dùng ở Part 1",
      head: ["Từ giám khảo hay dùng", "Bạn nói", "Ví dụ"],
      rows: [
        ["like / enjoy", "be into · be keen on · be a big fan of · love + V-ing", "I'm **keen on** cooking."],
        ["don't like", "not a big fan of · can't stand · not my cup of tea", "Shopping malls **aren't really my cup of tea**."],
        ["often", "regularly · on a regular basis · most days · whenever I can", "I go running **most days**."],
        ["sometimes", "from time to time · now and then · once in a while", "I read comics **from time to time**."],
        ["important", "essential · matters a lot · plays a big role", "Sleep **plays a big role** in my mood."],
        ["good / nice", "pleasant · enjoyable · relaxing · convenient", "The bus is **convenient**."],
        ["a lot of", "plenty of · loads of (nói) · a wide range of", "There are **plenty of** cafés."],
        ["always / usually / half the time", "24/7 · nine times out of ten · 50-50 · a hundred percent", "My phone is on **24/7**. · **Nine times out of ten** I take the bus. · It's **50-50** whether I cook or eat out."],
      ],
    },
    {
      t: "rule",
      formula: "Câu hỏi → mở bằng từ KHÁC (đồng nghĩa · đổi loại từ · đổi cấu trúc · chung → cụ thể) → lý do → ví dụ",
      vi: "Câu đầu tiên của mỗi câu trả lời là chỗ dễ nhất để chứng minh paraphrase.",
    },
    {
      t: "mcq",
      id: "t2d9-noi-mo-cau",
      title: "Chọn câu mở paraphrase tốt nhất (5 câu)",
      items: [
        { q: "(1) “Do you like listening to music?”", options: ["Yes, I like listening to music.", "Yes, I'm a big fan of music, especially Vietnamese indie bands.", "Yes, music is music."], correct: 1, why: "Đồng nghĩa (**a big fan of**) + cụ thể hoá (**Vietnamese indie bands**). Câu 1 lặp nguyên từ; câu 3 không nói gì." },
        { q: "(2) “Do you often go shopping?”", options: ["Not really. I'm not much of a shopper — I buy most things online.", "No, I don't often go shopping.", "Shopping? Often? No."], correct: 0, why: "Đổi loại từ: shopping → **shopper**; thêm lý do (buy online). Câu 2 lặp lại câu hỏi." },
        { q: "(3) “Is it important to get enough sleep?”", options: ["Yes, it is important to get enough sleep.", "Sleep important, yes.", "Absolutely. A good night's sleep plays a huge role in how I feel the next day."], correct: 2, why: "**A good night's sleep** (cách nói khác của enough sleep) + **plays a huge role** (thay important)." },
        { q: "(4) “Do you like your neighbours?”", options: ["Yes, I like my neighbours very much.", "On the whole, I get on well with the people next door.", "Neighbours is good."], correct: 1, why: "**get on well with** (= like) + **the people next door** (= neighbours) — hai lần paraphrase. Câu 3 sai ngữ pháp (Neighbours **are**)." },
        { q: "(5) Cách nào KHÔNG nên dùng để paraphrase?", options: ["Dùng từ đồng nghĩa đơn giản mà mình chắc nghĩa", "Đổi từ chung sang ví dụ cụ thể", "Dùng một từ rất khó mà mình không chắc nghĩa"], correct: 2, why: "Từ khó dùng sai làm **giảm** LR. Paraphrase đơn giản mà đúng tốt hơn từ “đắt” mà sai." },
      ],
    },

    { t: "h", text: "2. Mười hai chủ đề Part 1 nhanh" },
    {
      t: "p",
      text: "Mỗi chủ đề dưới đây có **câu hỏi hay gặp**, **một câu mở đã paraphrase** và **từ “đắt”** của riêng chủ đề đó. Không học thuộc câu trả lời — học **từ và cách mở**, rồi tự nói về **bản thân bạn**.",
    },
    {
      t: "table",
      caption: "12 chủ đề — câu hỏi, câu mở, từ nên dùng",
      head: ["Chủ đề", "Câu hỏi hay gặp", "Mở câu trả lời (paraphrase)", "Từ nên dùng"],
      rows: [
        ["**Weather**", "What's the weather like where you live?", "It's **hot and humid** for most of the year…", "humid · mild · rainy season · heatwave"],
        ["**Music**", "What kind of music do you like?", "I'm **mostly into** pop and acoustic songs…", "lyrics · catchy · live concert · playlist"],
        ["**Films**", "How often do you watch films?", "**Probably once or twice a week**, usually at home…", "streaming · plot · animated · subtitles"],
        ["**Reading**", "Do you like reading?", "I'm **not a big reader**, but I enjoy comics…", "novel · non-fiction · page-turner · e-book"],
        ["**Shopping**", "Do you prefer shopping online or in shops?", "**These days I buy almost everything online**…", "bargain · delivery · try on · impulse buy"],
        ["**Public transport**", "Do you often use public transport?", "**Not as much as I'd like**, because…", "reliable · route · crowded · fare"],
        ["**Mobile phones**", "How often do you use your phone?", "**Far more than I should**, to be honest…", "screen time · notifications · apps · addicted"],
        ["**Weekends**", "What do you usually do at weekends?", "**Saturdays are for catching up on sleep**…", "lie in · hang out · recharge · chores"],
        ["**Sleep**", "How many hours do you usually sleep?", "**Around six hours on weeknights**, which isn't enough…", "stay up late · nap · a good night's sleep"],
        ["**Noise**", "Is your home noisy?", "**It can get quite loud**, especially…", "traffic noise · peace and quiet · earplugs"],
        ["**Neighbours**", "Do you know your neighbours?", "**I get on well with the people next door**…", "friendly · keep to themselves · borrow"],
        ["**Birthdays**", "How do you usually celebrate your birthday?", "**Nothing big** — just dinner with my family…", "celebrate · throw a party · surprise · gift"],
      ],
    },
    {
      t: "dialogue",
      title: "Mẫu — 4 chủ đề, mỗi câu 2–4 câu (band 5.5–6)",
      lines: [
        { who: "Examiner", role: "examiner", text: "What's the weather like where you live?" },
        { who: "Candidate", role: "candidate", text: "I live in Ho Chi Minh City, so it's hot and humid for most of the year. We only really have two seasons, a dry season and a rainy season. During the rainy season, there's usually a heavy shower every afternoon, which can flood some streets.", vi: "Tôi sống ở TP.HCM nên quanh năm nóng ẩm. Thực ra chỉ có hai mùa, mùa khô và mùa mưa. Mùa mưa chiều nào cũng thường có một trận mưa lớn, có thể làm ngập vài con đường." },
        { who: "Examiner", role: "examiner", text: "Do you like reading?" },
        { who: "Candidate", role: "candidate", text: "I'm not a big reader, to be honest, but I do enjoy comics and short stories. I find long novels hard to finish because I'm always busy. I usually read on my phone on the bus.", vi: "Thật ra tôi không mê đọc lắm, nhưng tôi thích truyện tranh và truyện ngắn. Tôi thấy tiểu thuyết dài khó đọc hết vì lúc nào cũng bận. Tôi thường đọc trên điện thoại khi ngồi xe buýt." },
        { who: "Examiner", role: "examiner", text: "Do you often use public transport?" },
        { who: "Candidate", role: "candidate", text: "Not as much as I'd like. The buses near my house aren't very reliable, so I usually ride my motorbike. But since the first metro line opened, I've been taking the train whenever I go downtown, because it's much faster than sitting in traffic.", vi: "Không nhiều như tôi muốn. Xe buýt gần nhà tôi không đúng giờ lắm nên tôi hay đi xe máy. Nhưng từ khi tuyến metro đầu tiên mở, mỗi lần vào trung tâm tôi đều đi tàu, vì nhanh hơn nhiều so với kẹt xe." },
        { who: "Examiner", role: "examiner", text: "How do you usually celebrate your birthday?" },
        { who: "Candidate", role: "candidate", text: "Nothing big, really. My mum usually cooks my favourite dishes, and we have dinner together at home. Last year my friends threw a surprise party for me, which was the best birthday I've ever had.", vi: "Thật ra không có gì lớn. Mẹ tôi thường nấu những món tôi thích, và cả nhà ăn tối ở nhà. Năm ngoái bạn bè tổ chức tiệc bất ngờ cho tôi — đó là sinh nhật vui nhất tôi từng có." },
      ],
    },
    {
      t: "note",
      title: "Vì sao các câu trên ăn điểm",
      items: [
        "**Không câu nào lặp nguyên câu hỏi**: like reading → **a big reader**; often use → **not as much as I'd like**; celebrate → **nothing big**.",
        "Mỗi câu có **lý do** hoặc **ví dụ** cụ thể (mưa chiều làm ngập đường; xe buýt không đúng giờ; tiệc bất ngờ).",
        "Ngữ pháp của hôm nay và tuần này lồng tự nhiên: **much faster than** (so sánh), **the best birthday I've ever had** (so sánh nhất + hiện tại hoàn thành), **since the first metro line opened** (Ngày 5).",
        "Độ dài vừa: **2–4 câu**, 15–25 giây. Part 1 không cần dài như Part 2.",
      ],
    },
    {
      t: "note",
      title: "Người Việt hay sai ở Part 1",
      items: [
        "Lặp **nguyên câu hỏi** ở mọi câu trả lời — giám khảo coi là thiếu từ vựng.",
        "Trả lời **một chữ** (“Yes.” / “Sometimes.”) rồi im lặng — mất điểm FC.",
        "Trả lời **quá dài** như Part 2 (1 phút cho một câu Part 1) — giám khảo sẽ ngắt, và bạn mất thời gian cho câu sau.",
        "Paraphrase bằng **từ học thuộc mà sai nghĩa** (“I'm addicted to weather”) — dùng từ bạn chắc.",
        "Quên đổi **thì** theo câu hỏi: “**Did** you like reading **when you were a child**?” → trả lời bằng **quá khứ**.",
      ],
    },
    {
      t: "note",
      title: "Mẹo — gặp chủ đề lạ hoặc chẳng hứng thú thì sao?",
      items: [
        "Đề thật có cả chủ đề “lạ”: chim, cây cảnh, nhặt đồ cũ, mặc đồ màu sắc… Bạn **không cần** yêu thích hay biết nhiều — giám khảo chấm **ngôn ngữ**, không chấm kiến thức. Có hai lối thoát:",
        "**① Nói rộng ra chủ đề liền kề** mà bạn có từ: Birds? → “I don't know much about birds, but I love being **in nature**, and there are always birds singing in the park near my house in the morning…” (birds → thiên nhiên → công viên).",
        "**② Nói thật, lịch sự, rồi chuyển sang thứ mình thích**: “To be honest, **it's not something I take a keen interest in**. **I'm more of a** music **person** — I'd rather spend my free time playing the guitar.”",
        "Đừng trả lời “I don't know.” rồi im — đó mới là lỗi. Thừa nhận + vẫn nói 2 câu là đủ.",
        "Gặp thứ **đặc thù Việt Nam** (phở, Tết, áo dài…): **giữ tên tiếng Việt** rồi giải thích bằng từ quen: “I love **bánh xèo**, **which is basically a crispy pancake filled with** shrimp and bean sprouts.”",
      ],
    },
    {
      t: "rule",
      formula: "Chủ đề lạ: I don't know much about X, but… (chủ đề liền kề) · It's not something I take a keen interest in. I'm more of a … person.",
      vi: "Không biết thì thừa nhận ngắn, rồi lái sang thứ mình nói được — vẫn đủ 2–3 câu.",
    },

    { t: "h", text: "2b. Quên từ giữa câu thì làm gì?" },
    {
      t: "p",
      text: "Ai cũng có lúc quên một từ (“cái nồi cơm điện tiếng Anh là gì nhỉ?”). Im lặng hoặc chen tiếng Việt mới mất điểm. **Giải nghĩa từ đó bằng một mệnh đề** thì giám khảo coi là kỹ năng tốt — tiêu chí LR band 5–6 ghi rõ “**paraphrase** được (dù có lúc chưa thành công)”.",
    },
    {
      t: "table",
      head: ["Khung cứu hộ", "Dùng cho", "Ví dụ (từ bị quên)"],
      rows: [
        ["**a thing which / that** + V…", "đồ vật", "I bought **a thing which** cooks rice automatically. (rice cooker)"],
        ["**people who** + V…", "người, nghề", "I'd like to be one of those **people who** design buildings. (architect)"],
        ["**a place where** + S + V…", "nơi chốn", "We went to **a place where** you can see lots of fish in big tanks. (aquarium)"],
        ["**It's a kind of…** / **It's like a…, but…**", "so với thứ quen", "**It's a kind of** small motorbike, but it runs on electricity. (e-scooter)"],
        ["**the opposite of…**", "tính chất", "He's **the opposite of** shy — he talks to everyone. (outgoing)"],
        ["**What I mean is…** / **I'm not sure of the word, but…**", "báo trước + sửa", "**I'm not sure of the word, but** it's the feeling you get before an exam. (nervous / anxious)"],
      ],
    },
    {
      t: "note",
      title: "Cẩn thận",
      items: [
        "**Không** chen tiếng Việt (“…the nồi cơm điện…”) và **không** hỏi giám khảo “How do you say…?” — giám khảo không được giúp bạn.",
        "Xin nhắc lại **câu hỏi** thì được: Part 1 giám khảo chỉ **đọc lại**; Part 3 giám khảo được **diễn đạt lại** (xem Ngày 5).",
        "Câu cứu hộ không cần hoàn hảo — giữ mạch nói quan trọng hơn tìm đúng từ.",
      ],
    },
    {
      t: "quiz",
      id: "t2d9-noi-quen-tu",
      title: "Giải nghĩa từ bị quên bằng mệnh đề (5 câu)",
      kind: "translate",
      grammar: "a thing which + V · people who + V · a place where + S + V · It's a kind of… · the opposite of…",
      items: [
        { q: "Bạn quên từ “máy giặt”. Nói: một thứ giặt quần áo cho bạn.", hint: "a thing which / that washes your clothes", answers: ["It's a thing which washes your clothes.", "It's a thing that washes your clothes.", "A thing which washes your clothes.", "A thing that washes your clothes.", "It's a machine which washes your clothes.", "It's a machine that washes your clothes."] },
        { q: "Bạn quên từ “thủ thư”. Nói: những người làm việc trong thư viện.", hint: "people who work in a library", answers: ["People who work in a library.", "They are people who work in a library.", "It's people who work in a library.", "The people who work in a library.", "Someone who works in a library.", "A person who works in a library."] },
        { q: "Bạn quên từ “tiệm bánh”. Nói: một nơi bạn có thể mua bánh mì và bánh ngọt.", hint: "a place where you can buy bread and cakes", answers: ["It's a place where you can buy bread and cakes.", "A place where you can buy bread and cakes.", "It is a place where you can buy bread and cakes.", "It's a shop where you can buy bread and cakes."] },
        { q: "Bạn quên từ “lười”. Nói: ngược lại với chăm chỉ.", hint: "the opposite of hard-working", answers: ["The opposite of hard-working.", "It's the opposite of hard-working.", "He's the opposite of hard-working.", "She's the opposite of hard-working.", "It is the opposite of hard-working."] },
        { q: "Bạn quên từ “xe khách giường nằm”. Nói: đó là một loại xe buýt, nhưng bạn có thể nằm ngủ trên đó.", hint: "It's a kind of bus, but you can sleep / lie down on it", answers: ["It's a kind of bus, but you can sleep on it.", "It's a kind of bus, but you can lie down on it.", "It is a kind of bus, but you can sleep on it.", "It's a kind of bus, but you can lie down and sleep on it.", "It's a type of bus, but you can sleep on it."] },
      ],
    },

    { t: "h", text: "2c. Chủ đề Reading — từ để nói về sách" },
    {
      t: "p",
      text: "“Do you like reading?”, “What kind of books do you read?”, “Do you prefer paper books or e-books?” xuất hiện rất thường ở Part 1 (và Part 3 hỏi tiếp “Will paper books disappear?”). Dưới đây là bộ từ tối thiểu để không phải lặp “book, book, book”.",
    },
    {
      t: "vocab",
      items: [
        { w: "genre", pos: "n", ipa: "/ˈʒɒnrə/", vi: "thể loại (sách, phim, nhạc)", ex: "Crime fiction is my favourite genre.", exVi: "Truyện trinh thám là thể loại tôi thích nhất.", more: "Đọc /ˈʒɒnrə/ — âm đầu /ʒ/ như trong **usually**. Thể loại hay gặp: **crime, fantasy, romance, biography, self-help**." },
        { w: "fiction / non-fiction", pos: "n (U)", ipa: "/ˈfɪkʃn/ · /ˌnɒn ˈfɪkʃn/", vi: "sách hư cấu (truyện) / sách phi hư cấu (sách thật, kiến thức)", ex: "I mostly read non-fiction, like history and science books.", exVi: "Tôi chủ yếu đọc sách phi hư cấu, như sách lịch sử và khoa học.", more: '**a work of fiction** · ~~a fiction~~ (không đếm được).' },
        { w: "a bookworm", pos: "n", ipa: "/ə ˈbʊkwɜːm/", vi: "mọt sách (người rất mê đọc)", ex: "My sister is a real bookworm — she reads three books a week.", exVi: "Chị tôi đúng là mọt sách — một tuần đọc ba cuốn.", more: "Ngược lại: **I'm not a big reader.**", anh: "books" },
        { w: "a page-turner", pos: "n", ipa: "/ə ˈpeɪdʒ tɜːnə(r)/", vi: "cuốn sách hấp dẫn, đọc không dứt ra được", ex: "The novel was a real page-turner; I finished it in one night.", exVi: "Cuốn tiểu thuyết cuốn đến mức tôi đọc hết trong một đêm." },
        { w: "paperback / e-book", pos: "n", ipa: "/ˈpeɪpəbæk/ · /ˈiː bʊk/", vi: "sách bìa mềm / sách điện tử", ex: "I prefer paperbacks because I can write notes in them.", exVi: "Tôi thích sách bìa mềm hơn vì có thể ghi chú lên đó.", more: "Sách bìa cứng: **hardback**. Đọc trên máy: **read on an e-reader / on my phone**." },
        { w: "read up on", pos: "phr v", ipa: "/riːd ˈʌp ɒn/", vi: "đọc tìm hiểu kỹ về (một chủ đề)", ex: "Before the trip, I read up on the history of Hue.", exVi: "Trước chuyến đi, tôi đọc tìm hiểu kỹ về lịch sử Huế." },
        { w: "read between the lines", pos: "idiom", ipa: "/riːd bɪˈtwiːn ðə laɪnz/", vi: "hiểu ý ngầm, đọc được ẩn ý", ex: "In his poems, you have to read between the lines.", exVi: "Trong thơ của ông ấy, bạn phải đọc được ẩn ý.", more: "Thành ngữ — dùng **một lần** là đủ." },
        { w: "can't put it down", pos: "phr", ipa: "/kɑːnt pʊt ɪt daʊn/", vi: "không thể bỏ xuống (vì quá hay)", ex: "Once I started the book, I couldn't put it down.", exVi: "Bắt đầu đọc là tôi không thể bỏ xuống được." },
        { w: "an avid reader", pos: "n phr", ipa: "/ən ˈævɪd ˈriːdə(r)/", vi: "người đọc nhiều, ham đọc", ex: "I wasn't an avid reader as a child, but I am now.", exVi: "Hồi nhỏ tôi không ham đọc, nhưng giờ thì có." },
      ],
    },

    { t: "h", text: "3. Phát âm: cụm phụ âm cuối -sts · -ths · -ngths" },
    {
      t: "p",
      text: "Tiếng Việt không có từ nào kết thúc bằng 2–3 phụ âm, nên người Việt hay **bỏ bớt** (texts → “tex”, months → “mon”) hoặc **chèn nguyên âm** (tests → “tét-xờ”). Ở Part 1 các từ này xuất hiện liên tục: **tests, costs, months, tourists**. Bỏ âm cuối làm sai **số nhiều** và **chia động từ** — giám khảo nghe như lỗi ngữ pháp.",
    },
    {
      t: "table",
      head: ["Cụm", "Cách đọc", "Từ hay gặp"],
      rows: [
        ["**-sts** /sts/", "/s/ → chạm /t/ thật nhẹ → /s/ lần nữa; **không** chèn “ơ”", "tests · costs · lists · texts · tourists · scientists"],
        ["**-ths** /θs/", "lưỡi giữa răng (/θ/) → rút lưỡi về /s/", "months · fifths · sixths · depths · births"],
        ["**-ngths** /ŋθs/", "giữ /ŋ/ ở cuống lưỡi → /θ/ → /s/", "lengths · strengths"],
        ["**-xts / -sks**", "/ksts/ · /sks/", "texts · tasks · desks · asks"],
      ],
    },
    {
      t: "phatam",
      id: "t2d9-phat-am",
      title: "Luyện phát âm — cụm phụ âm cuối",
      note: "Bấm “Nghe mẫu”, rồi “Đọc & chấm”. Đọc CHẬM lần đầu, đủ từng phụ âm, không chèn nguyên âm “ơ” giữa các phụ âm. /θ/: lưỡi giữa răng rồi mới rút về /s/.",
      items: [
        { text: "tests, costs, lists", ipa: "tests kɒsts lɪsts", vi: "-sts" },
        { text: "texts, tasks, desks", ipa: "teksts tɑːsks desks", vi: "-ksts · -sks" },
        { text: "months, fifths, sixths", ipa: "mʌnθs fɪfθs sɪksθs", vi: "-ths" },
        { text: "lengths, strengths, depths", ipa: "leŋθs streŋθs depθs", vi: "-ngths · -pths" },
        { text: "She lists the costs of the tests.", ipa: "ʃi lɪsts ðə kɒsts əv ðə tests", vi: "ba cụm -sts" },
        { text: "The tourists asked for the texts.", ipa: "ðə tʊərɪsts ɑːskt fə ðə teksts", vi: "tourists · asked · texts" },
        { text: "It took six months to discover my strengths.", ipa: "ɪt tʊk sɪks mʌnθs tə dɪskʌvə maɪ streŋθs", vi: "months · strengths" },
        { text: "Scientists measured the lengths and depths.", ipa: "saɪəntɪsts meʒəd ðə leŋθs ənd depθs", vi: "scientists · lengths · depths" },
      ],
    },

    { t: "h", text: "4. Luyện nói" },
    {
      t: "p",
      text: "Trả lời mỗi câu **2–4 câu** (15–25 giây). Câu đầu tiên **không được** lặp từ của câu hỏi. Ghi âm, nghe lại và tự hỏi: “Mình đã đổi từ nào?”.",
    },
    {
      t: "speak",
      id: "t2d9-noi-p1-a",
      part: "1",
      questions: [
        "What's the weather like where you live?",
        "What kind of music do you like?",
        "How often do you watch films?",
        "Do you like reading?",
        "Do you prefer shopping online or in shops?",
        "Do you often use public transport?",
      ],
    },
    {
      t: "speak",
      id: "t2d9-noi-p1-b",
      part: "1",
      questions: [
        "How often do you use your mobile phone?",
        "What do you usually do at weekends?",
        "How many hours do you usually sleep?",
        "Is the area where you live noisy?",
        "Do you know your neighbours well?",
        "How do you usually celebrate your birthday?",
      ],
    },
    {
      t: "p",
      text: "Bộ thứ ba: **chủ đề lạ** + **Reading** (mục 2–2c). Không biết thì thừa nhận ngắn rồi lái sang chủ đề liền kề; quên từ thì giải nghĩa bằng mệnh đề — đừng im.",
    },
    {
      t: "speak",
      id: "t2d9-noi-p1-la",
      part: "1",
      questions: [
        "Do you like watching birds?",
        "Have you ever collected anything, such as stamps or coins?",
        "What kind of books do you like reading?",
        "Do you prefer paper books or e-books?",
        "Is there a traditional food from your country that you would recommend to visitors?",
      ],
    },
  ],
};

/* ─────────────────────────── Bài tập ─────────────────────────── */

const T2D9_BAI_TAP: Lesson = {
  id: "t2d9-bai-tap",
  kind: "homework",
  title: "Bài tập Ngày 9",
  goal: "Tự kiểm tra Ngày 9: 10 câu chọn dạng so sánh, 8 câu viết dạng đúng, 6 câu dịch so sánh, 4 câu paraphrase câu hỏi Part 1, 3 câu về cách làm đề nghe — 31 câu có đáp án và lời giải.",
  minutes: 40,
  blocks: [
    {
      t: "recap",
      title: "Bài tập hôm nay",
      items: [
        "**Phần I** (10 câu): chọn dạng so sánh · **Phần II** (8 câu): viết dạng đúng (có lời giải).",
        "**Phần III** (6 câu): dịch câu so sánh — đời sống và Task 1.",
        "**Phần IV** (4 câu): chọn câu mở Part 1 đã paraphrase · **Phần V** (3 câu): cách làm đề nghe & sổ lỗi.",
      ],
    },
    {
      t: "sodo",
      kind: "mindmap",
      title: "Ngày 9 trong một hình",
      center: "**Ngày 9**",
      branches: [
        { label: "Ngữ pháp: so sánh", items: ["-er / more · -est / most (một dấu thôi)", "much / far / slightly + hơn", "as…as · the same as · similar to · different from", "fewer + N đếm được · less + N không đếm được"] },
        { label: "Nghe: đề nhỏ 20 câu", items: ["đọc trước · nghe một lần", "bẫy: no, sorry · used to… but now", "đích ≥ 14/20", "sổ lỗi 6 loại"] },
        { label: "Nói: Part 1", items: ["mở câu không lặp từ giám khảo", "đồng nghĩa · loại từ · cấu trúc · cụ thể", "12 chủ đề · 2–4 câu", "-sts · -ths · -ngths"] },
      ],
    },

    { t: "h", text: "Phần I — Chọn đáp án đúng (10 câu)" },
    {
      t: "mcq",
      id: "t2d9-bt-chon",
      title: "Phần I — So sánh (10 câu)",
      items: [
        { q: "(1) My new flat is ___ than my old one.", options: ["more bigger", "bigger", "biger"], correct: 1, why: "big (CVC) → **bigger**: gấp đôi g, không thêm more." },
        { q: "(2) This is ___ restaurant in town.", options: ["the noisiest", "the most noisy", "the noisyest"], correct: 0, why: "noisy (2 âm tiết, -y) → **the noisiest**." },
        { q: "(3) Prices here are ___ higher than in my hometown.", options: ["very", "a lot of", "far"], correct: 2, why: "Mức độ + so sánh hơn: **far** higher." },
        { q: "(4) I spend ___ money on clothes than my sister.", options: ["fewer", "less", "little"], correct: 1, why: "money không đếm được → **less**." },
        { q: "(5) Her accent is very different ___ mine.", options: ["with", "of", "from"], correct: 2, why: "**different from**." },
        { q: "(6) The second exam was ___ the first one.", options: ["as difficult as", "as difficult than", "so difficult like"], correct: 0, why: "**as + adj + as**." },
        { q: "(7) It was ___ day of my life.", options: ["the most happy", "the happiest", "the happier"], correct: 1, why: "happy → **the happiest**." },
        { q: "(8) She drives ___ than her husband.", options: ["more carefully", "carefullier", "more careful"], correct: 0, why: "Trạng từ -ly bổ nghĩa cho drives → **more carefully**." },
        { q: "(9) Bexley had ___ cyclists of the three cities.", options: ["the least", "less", "the fewest"], correct: 2, why: "cyclists đếm được + so sánh nhất → **the fewest**." },
        { q: "(10) Hoi An is one of the most popular ___ in Vietnam.", options: ["destination", "destinations", "destination's"], correct: 1, why: "**one of the + most + adj + N số nhiều** → destinations." },
      ],
    },

    { t: "h", text: "Phần II — Viết dạng đúng (8 câu)" },
    {
      t: "quiz",
      id: "t2d9-bt-dang",
      title: "Phần II — Viết dạng so sánh đúng của từ trong ngoặc",
      kind: "fill",
      items: [
        { q: "(1) Today is ___ (hot) than yesterday.", answers: ["hotter"] },
        { q: "(2) The metro is ___ (convenient) than the bus.", answers: ["more convenient"] },
        { q: "(3) This is the ___ (bad) traffic jam I've ever seen.", answers: ["worst"] },
        { q: "(4) The weather in the north is ___ (good) in autumn than in summer.", answers: ["better"] },
        { q: "(5) Who lives ___ (far) from the school — you or Minh?", answers: ["further", "farther"] },
        { q: "(6) The rainy season was much ___ (wet) this year.", answers: ["wetter"] },
        { q: "(7) Life in the countryside is ___ (easy) than in the city in some ways.", answers: ["easier"] },
        { q: "(8) Carlton had the ___ (high) figure for metro users.", answers: ["highest"] },
      ],
    },
    {
      t: "note",
      title: "Lời giải Phần II",
      items: [
        "**(1) hotter** — hot (CVC): gấp đôi **t**. **(6) wetter** — tương tự.",
        "**(2) more convenient** — 4 âm tiết → more.",
        "**(3) worst** — bad → worse → **the worst** (đã có the trong câu).",
        "**(4) better** — good → **better**.",
        "**(5) further / farther** — cả hai đúng khi nói khoảng cách.",
        "**(7) easier** — easy → y thành i + er.",
        "**(8) highest** — the + high**est**.",
      ],
    },

    { t: "h", text: "Phần III — Dịch Việt → Anh (6 câu)" },
    {
      t: "quiz",
      id: "t2d9-bt-dich",
      title: "Phần III — Dịch sang tiếng Anh (6 câu)",
      kind: "translate",
      grammar: "adj-er / more adj + than · much / slightly · the + adj-est · as…as · the same as · fewer / less",
      items: [
        { q: "Mùa đông năm nay lạnh hơn nhiều so với năm ngoái.", hint: "This winter, is much colder than, last winter / last year", answers: ["This winter is much colder than last winter.", "This winter is much colder than last year.", "This winter is far colder than last winter.", "This winter is a lot colder than last winter.", "This winter is much colder than last year's.", "This winter has been much colder than last winter.", "Winter this year is much colder than last year.", "This year's winter is much colder than last year's.", "This winter is a lot colder than last year."] },
        { q: "Đây là cuốn sách thú vị nhất tôi từng đọc.", hint: "This is, the most interesting book, I've ever read", answers: ["This is the most interesting book I've ever read.", "This is the most interesting book I have ever read.", "This is the most interesting book that I've ever read.", "This is the most interesting book that I have ever read."] },
        { q: "Em trai tôi cao bằng tôi.", hint: "My younger brother, is as tall as, me / I am", answers: ["My younger brother is as tall as me.", "My younger brother is as tall as I am.", "My little brother is as tall as me.", "My brother is as tall as me.", "My brother is as tall as I am.", "My little brother is as tall as I am."] },
        { q: "Ngày nay có ít trẻ em chơi ngoài trời hơn.", hint: "Fewer children, play outside / outdoors, nowadays / today", answers: ["Fewer children play outside nowadays.", "Fewer children play outdoors nowadays.", "Nowadays fewer children play outside.", "Nowadays, fewer children play outside.", "Fewer children play outside today.", "Fewer children play outdoors today.", "These days fewer children play outside."] },
        { q: "Năm 2020, số liệu của nam cao hơn của nữ một chút.", hint: "In 2020, the figure for men, was slightly higher than, that for women", answers: ["In 2020, the figure for men was slightly higher than that for women.", "In 2020 the figure for men was slightly higher than that for women.", "In 2020, the figure for men was slightly higher than the figure for women.", "In 2020, the figure for men was a little higher than that for women.", "The figure for men was slightly higher than that for women in 2020."] },
        { q: "Quan điểm của tôi giống quan điểm của bạn.", hint: "My opinion / view, is similar to / the same as, yours", answers: ["My opinion is similar to yours.", "My opinion is the same as yours.", "My view is similar to yours.", "My view is the same as yours.", "My opinion is very similar to yours.", "My views are similar to yours."] },
      ],
    },

    { t: "h", text: "Phần IV — Paraphrase câu hỏi Part 1 (4 câu)" },
    {
      t: "mcq",
      id: "t2d9-bt-paraphrase",
      title: "Phần IV — Câu mở nào paraphrase tốt nhất? (4 câu)",
      items: [
        { q: "(1) “Do you like watching films?”", options: ["Yes, I'm really into films, especially Korean thrillers.", "Yes, I like watching films.", "I like watching films very much because I like films."], correct: 0, why: "**really into** thay like; **Korean thrillers** cụ thể hoá. Hai câu còn lại lặp nguyên từ." },
        { q: "(2) “Is your hometown noisy?”", options: ["Yes, my hometown is noisy.", "It can get pretty loud, especially in the evenings when the night market opens.", "Noisy, yes, noisy."], correct: 1, why: "**pretty loud** (đồng nghĩa) + thời điểm và lý do cụ thể." },
        { q: "(3) “Do you often go to bed late?”", options: ["Yes, I often go to bed late.", "Late? Yes.", "I tend to stay up past midnight on weekdays, which isn't great."], correct: 2, why: "**stay up past midnight** = go to bed late; **tend to** = often (đổi cấu trúc)." },
        { q: "(4) “Do you get on well with your neighbours?”", options: ["Yes, I get on well with my neighbours.", "Pretty well. The family next door is really friendly.", "Neighbours good."], correct: 1, why: "**the family next door** thay neighbours, **really friendly** cho lý do." },
      ],
    },

    { t: "h", text: "Phần V — Cách làm đề nghe & sổ lỗi (3 câu)" },
    {
      t: "mcq",
      id: "t2d9-bt-de-nghe",
      title: "Phần V — Chọn đáp án đúng (3 câu)",
      items: [
        { q: "(1) Bạn lỡ câu 6 khi đang nghe Part 1. Nên làm gì?", options: ["Bỏ câu 6, tập trung nghe câu 7", "Cố nhớ lại câu 6 rồi mới nghe tiếp", "Dừng băng và nghe lại"], correct: 0, why: "Thi thật chỉ nghe **một lần**; cố nhớ câu cũ sẽ lỡ thêm câu 7, 8. Đoán câu 6 lúc soát cuối." },
        { q: "(2) Nghe: “It's ninety pounds — oh no, sorry, it's ninety-five now.” Đáp án là…", options: ["90", "95", "90 hoặc 95 đều được"], correct: 1, why: "Bẫy **đổi ý**: thông tin **sau “no, sorry”** mới là đáp án." },
        { q: "(3) Bạn viết “the library station” cho ô “ONE WORD AND/OR A NUMBER”. Loại lỗi nào trong sổ?", options: ["① Chính tả", "⑥ Quá số từ", "③ Bẫy đổi ý"], correct: 1, why: "Ba từ cho ô **một từ** → lỗi **quá số từ** (⑥), sai cả câu dù có chữ library." },
      ],
    },
  ],
};

export const NGAY_9: Lesson[] = [T2D9_NGU_PHAP, T2D9_NGHE, T2D9_NOI, T2D9_BAI_TAP];
