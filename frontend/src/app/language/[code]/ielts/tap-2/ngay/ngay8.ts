/**
 * Tập 2 · Ngày 8 — Từ vựng: Giao thông & đời sống đô thị [VC11] · Đọc: Short-answer questions + nhận
 * paraphrase 3 cách (đồng nghĩa · đổi loại từ · đổi cấu trúc) [R09 R18 VD4] · Viết: Task 1 bar chart +
 * ngôn ngữ so sánh [W09 W17] · Bài tập. 🔊 (đề cương không ghi âm cho N8) — chọn /æ/ · /ʌ/ · /ɑː/ trong
 * từ giao thông (tram · bus · car), nhóm nguyên âm người Việt hay đọc lẫn.
 *
 * Soạn 12/11/2026 theo docs/ielts-lo-trinh-0-8.md mục 3.2 (hàng N8). Tập 1 Ngày 12 đã dạy một ít từ giao
 * thông (commuter, pedestrian, exhaust fumes, residential…) — bài này KHÔNG dạy lại, chỉ nhắc khi cần.
 * Bài đọc về BRT: mốc Curitiba (thập niên 1970, làn riêng, trạm hình ống) là hiểu biết phổ biến; thành phố ở
 * đoạn D và mọi con số là TỰ ĐẶT — viết thành "a typical case" (thì hiện tại, không khẳng định là nơi có thật). Số liệu biểu đồ tự đặt, đã đối chiếu
 * từng con số với bài mẫu.
 */
import type { Lesson } from '../data';

/* ─────────────────────────── Từ vựng ─────────────────────────── */

const T2D8_TU_VUNG: Lesson = {
  id: "t2d8-tu-vung",
  kind: "vocab",
  title: "Từ vựng: Giao thông & đời sống đô thị",
  goal: "Dùng đúng 20 từ + 10 cụm từ / cụm động từ về giao thông và thành phố, 6 họ từ (congest → congestion → congested…), 4 câu mẫu cho Task 2 và Speaking — đẩy Lexical Resource lên band 5 ở chủ đề rất hay gặp này; đọc rõ /æ/ · /ʌ/ · /ɑː/.",
  minutes: 50,
  blocks: [
    {
      t: "recap",
      title: "Bài này học gì · đẩy band nào",
      items: [
        "Chủ đề **Transport & urban life** — có mặt ở cả 3 phần: Speaking Part 1 (How do you get to work?), Part 3, Task 2 (traffic, public transport, city life) và bài đọc / nghe.",
        "**20 từ** (congestion, infrastructure, fare, suburb, reliable…) + **10 cụm** (ease congestion, get stuck in traffic, run on electricity…).",
        "**6 họ từ**: congest → congestion → congested · rely → reliable → reliability · afford → affordable … — đổi loại từ chính là một cách **paraphrase** (bài Đọc hôm nay).",
        "**4 câu mẫu** ăn điểm LR cho Task 2 — học khung, thay từ theo đề.",
        "Phát âm: ba nguyên âm **/æ/ (tram) · /ʌ/ (bus) · /ɑː/ (car)** — đọc lẫn thì “bus” nghe như “boss”.",
      ],
    },
    {
      t: "hinh",
      title: "Nhìn hình — nói tên phương tiện, nơi chốn",
      items: [
        { anh: "tram", w: "tram", ro: "/træm/", vi: "tàu điện mặt đất (Mỹ: streetcar)" },
        { anh: "metro", w: "metro / underground", ro: "/ˈmetrəʊ/ · /ˈʌndəɡraʊnd/", vi: "tàu điện ngầm (Mỹ: subway)" },
        { anh: "light-rail", w: "light rail", ro: "/ˈlaɪt reɪl/", vi: "đường sắt nhẹ (tàu điện trên cao / mặt đất)" },
        { anh: "oncoming-bus", w: "bus", ro: "/bʌs/", vi: "xe buýt" },
        { anh: "taxi", w: "taxi / cab", ro: "/ˈtæksi/ · /kæb/", vi: "taxi" },
        { anh: "ferry", w: "ferry", ro: "/ˈferi/", vi: "phà" },
        { anh: "motorway", w: "motorway", ro: "/ˈməʊtəweɪ/", vi: "đường cao tốc (Mỹ: highway / freeway)" },
        { anh: "bus-stop", w: "bus stop", ro: "/ˈbʌs stɒp/", vi: "trạm xe buýt" },
        { anh: "cityscape", w: "skyline", ro: "/ˈskaɪlaɪn/", vi: "đường chân trời của thành phố (hàng nhà cao tầng)" },
        { anh: "houses", w: "suburb", ro: "/ˈsʌbɜːb/", vi: "vùng ngoại ô (khu dân cư ven thành phố)" },
      ],
    },
    {
      t: "sodo",
      kind: "mindmap",
      title: "Giao thông & thành phố — bốn ngăn ý",
      center: "**Transport & urban life**",
      branches: [
        { label: "Vấn đề", anh: "construction", items: ["congestion · gridlock", "emissions · noise pollution", "overcrowded · urban sprawl"] },
        { label: "Giải pháp", anh: "light-bulb", items: ["invest in public transport", "cycle lanes · pedestrianise", "congestion charge"] },
        { label: "Chất lượng dịch vụ", anh: "oncoming-bus", items: ["reliable · frequent", "affordable fares", "convenient routes"] },
        { label: "Đời sống đô thị", anh: "cityscape", items: ["high-rise · densely populated", "amenities · liveable", "suburb ↔ city centre"] },
      ],
      caption: "Bốn ngăn này cũng là bốn hướng ý cho Task 2 về giao thông: nêu vấn đề → nguyên nhân → giải pháp → tác động lên đời sống.",
    },

    { t: "h", text: "1. Hai mươi từ cốt lõi" },
    {
      t: "vocab",
      items: [
        { w: "congestion", pos: "n (U)", ipa: "/kənˈdʒestʃən/", vi: "sự tắc nghẽn (giao thông)", ex: "Traffic congestion costs the city millions of hours every year.", exVi: "Tắc nghẽn giao thông làm thành phố mất hàng triệu giờ mỗi năm.", more: "Họ từ: **congested** (adj) — congested roads. Cụm: **ease / reduce / relieve congestion**." },
        { w: "gridlock", pos: "n (U)", ipa: "/ˈɡrɪdlɒk/", vi: "tắc cứng (không xe nào nhúc nhích)", ex: "An accident on the bridge caused gridlock for two hours.", exVi: "Một vụ tai nạn trên cầu gây tắc cứng hai tiếng.", more: "Mạnh hơn **traffic jam**. Tính từ: **gridlocked** streets." },
        { w: "infrastructure", pos: "n (U)", ipa: "/ˈɪnfrəstrʌktʃə(r)/", vi: "cơ sở hạ tầng (đường, cầu, đường sắt…)", ex: "The government plans to spend more on transport infrastructure.", exVi: "Chính phủ dự định chi nhiều hơn cho hạ tầng giao thông.", more: "**Không đếm được**: ~~infrastructures~~. Trọng âm âm tiết đầu: **IN**-fra-struc-ture." },
        { w: "public transport", pos: "n (U)", ipa: "/ˌpʌblɪk ˈtrænspɔːt/", vi: "phương tiện giao thông công cộng", ex: "Most students in Hanoi rely on public transport or motorbikes.", exVi: "Đa số sinh viên ở Hà Nội đi lại bằng phương tiện công cộng hoặc xe máy.", more: "Mỹ: **public transportation / public transit**. Cụm: **use / take public transport** · **by public transport**." },
        { w: "emissions", pos: "n (pl)", ipa: "/ɪˈmɪʃnz/", vi: "khí thải", ex: "Electric buses help to cut carbon emissions.", exVi: "Xe buýt điện giúp cắt giảm khí thải carbon.", more: "Động từ **emit** /ɪˈmɪt/. Cụm: **cut / reduce emissions** · **carbon / vehicle emissions**." },
        { w: "fare", pos: "n", ipa: "/feə(r)/", vi: "giá vé (xe buýt, tàu, taxi)", ex: "Bus fares in my city are very low for students.", exVi: "Giá vé xe buýt ở thành phố tôi rất rẻ cho sinh viên.", more: "Đọc giống **fair** (công bằng). **fare** cho phương tiện; **fee** cho dịch vụ / học phí; **ticket** là tấm vé." },
        { w: "route", pos: "n", ipa: "/ruːt/", vi: "tuyến đường, lộ trình", ex: "This bus route connects the airport with the city centre.", exVi: "Tuyến xe buýt này nối sân bay với trung tâm thành phố.", more: "Mỹ có thể đọc /raʊt/. Cụm: **a bus route** · **the fastest route to…**" },
        { w: "suburb", pos: "n", ipa: "/ˈsʌbɜːb/", vi: "vùng ngoại ô", ex: "Many families move to the suburbs to find bigger houses.", exVi: "Nhiều gia đình chuyển ra ngoại ô để có nhà rộng hơn.", more: "**the suburbs** · tính từ **suburban** /səˈbɜːbən/." },
        { w: "urban sprawl", pos: "n (U)", ipa: "/ˌɜːbən ˈsprɔːl/", vi: "sự đô thị hoá lan tràn (thành phố loang rộng ra vùng quê)", ex: "Urban sprawl has replaced farmland with housing estates.", exVi: "Đô thị lan tràn đã thay đất nông nghiệp bằng các khu nhà ở.", more: "Hệ quả hay nêu ở Task 2: **longer commutes, more car use**." },
        { w: "high-rise", pos: "adj, n", ipa: "/ˈhaɪ raɪz/", vi: "(toà nhà) cao tầng", ex: "Most people in the centre live in high-rise apartments.", exVi: "Đa số người ở trung tâm sống trong căn hộ cao tầng.", more: "**a high-rise building / block** · đối lập **low-rise**." },
        { w: "overcrowded", pos: "adj", ipa: "/ˌəʊvəˈkraʊdɪd/", vi: "quá đông, chật chội", ex: "Trains are overcrowded during the rush hour.", exVi: "Tàu quá đông vào giờ cao điểm.", more: "Danh từ **overcrowding**. Khác **crowded** (đông) — over- = **quá mức**." },
        { w: "reliable", pos: "adj", ipa: "/rɪˈlaɪəbl/", vi: "đáng tin cậy (đúng giờ, không hỏng)", ex: "People will leave their cars at home only if buses are reliable.", exVi: "Người ta chỉ để xe ở nhà nếu xe buýt đáng tin cậy.", more: "Họ từ: **rely on** (v) · **reliability** (n) · **unreliable** (adj)." },
        { w: "affordable", pos: "adj", ipa: "/əˈfɔːdəbl/", vi: "giá phải chăng, đủ khả năng chi trả", ex: "The city needs more affordable housing near the metro lines.", exVi: "Thành phố cần thêm nhà ở giá phải chăng gần các tuyến metro.", more: "Họ từ: **afford** (v: can afford to + V) · **affordability** (n)." },
        { w: "car ownership", pos: "n (U)", ipa: "/ˈkɑːr ˌəʊnəʃɪp/", vi: "việc sở hữu ô tô", ex: "Car ownership has risen sharply in Vietnam over the last decade.", exVi: "Tỉ lệ sở hữu ô tô ở Việt Nam tăng mạnh trong thập kỷ qua.", more: "Cụm Task 1 rất hay gặp: **levels / rates of car ownership**." },
        { w: "cycle lane", pos: "n", ipa: "/ˈsaɪkl leɪn/", vi: "làn đường dành cho xe đạp", ex: "Copenhagen has wide cycle lanes on almost every main road.", exVi: "Copenhagen có làn xe đạp rộng trên gần như mọi tuyến đường chính.", more: "Mỹ: **bike lane**. Cụm: **build / separate cycle lanes**." },
        { w: "pedestrianise", pos: "v", ipa: "/pəˈdestriənaɪz/", vi: "biến thành phố đi bộ (cấm xe)", ex: "The council pedestrianised the old town at weekends.", exVi: "Chính quyền biến phố cổ thành phố đi bộ vào cuối tuần.", more: "Mỹ viết **pedestrianize**. Danh từ: **pedestrian zone / area**." },
        { w: "amenities", pos: "n (pl)", ipa: "/əˈmiːnətiz/", vi: "tiện ích (công viên, trường, chợ, bệnh viện…)", ex: "New suburbs often lack basic amenities such as schools and clinics.", exVi: "Các khu ngoại ô mới thường thiếu tiện ích cơ bản như trường học và phòng khám.", more: "Hay dùng số nhiều. Cụm: **local amenities** · **public amenities**." },
        { w: "liveable", pos: "adj", ipa: "/ˈlɪvəbl/", vi: "đáng sống", ex: "Fewer cars would make our cities much more liveable.", exVi: "Ít ô tô hơn sẽ làm thành phố đáng sống hơn nhiều.", more: "Mỹ viết **livable**. Cụm: **the most liveable city** (bảng xếp hạng thành phố đáng sống)." },
        { w: "densely populated", pos: "adj", ipa: "/ˌdensli ˈpɒpjuleɪtɪd/", vi: "dân cư đông đúc", ex: "The centre of Ho Chi Minh City is very densely populated.", exVi: "Khu trung tâm TP.HCM có mật độ dân cư rất cao.", more: "Danh từ **population density** (mật độ dân số). Đối lập: **sparsely populated**." },
        { w: "noise pollution", pos: "n (U)", ipa: "/ˈnɔɪz pəˌluːʃn/", vi: "ô nhiễm tiếng ồn", ex: "Noise pollution from motorbikes makes it hard to sleep.", exVi: "Ô nhiễm tiếng ồn từ xe máy làm khó ngủ.", more: "Cũng nói: **air / water / light pollution**." },
      ],
    },

    { t: "h", text: "2. Mười cụm từ và cụm động từ" },
    {
      t: "vocab",
      items: [
        { w: "ease congestion", pos: "phr", ipa: "/iːz kənˈdʒestʃən/", vi: "giảm bớt tắc nghẽn", ex: "A new ring road should ease congestion in the centre.", exVi: "Một đường vành đai mới hẳn sẽ giảm tắc nghẽn ở trung tâm.", more: "Đồng nghĩa: **relieve / reduce / tackle** congestion." },
        { w: "get stuck in traffic", pos: "phr", ipa: "/ɡet stʌk ɪn ˈtræfɪk/", vi: "bị kẹt xe", ex: "I got stuck in traffic for an hour this morning.", exVi: "Sáng nay tôi bị kẹt xe một tiếng.", more: "Quá khứ: **got stuck**. Gần nghĩa: **be caught in traffic**." },
        { w: "be held up", pos: "phr v", ipa: "/biː held ʌp/", vi: "bị chậm, bị giữ lại (vì tắc, vì sự cố)", ex: "Sorry I'm late — I was held up at the bridge.", exVi: "Xin lỗi tôi đến muộn — tôi bị kẹt ở cây cầu.", more: "Danh từ **a hold-up** (sự chậm trễ). Đừng nhầm với **hold up a bank** (cướp ngân hàng)." },
        { w: "invest (heavily) in", pos: "phr", ipa: "/ɪnˈvest ˈhevɪli ɪn/", vi: "đầu tư (mạnh) vào", ex: "The government should invest heavily in public transport.", exVi: "Chính phủ nên đầu tư mạnh vào giao thông công cộng.", more: "Danh từ: **investment in** sth. Câu Task 2 kinh điển." },
        { w: "cut emissions", pos: "phr", ipa: "/kʌt ɪˈmɪʃnz/", vi: "cắt giảm khí thải", ex: "Cities must cut emissions from private cars.", exVi: "Các thành phố phải cắt giảm khí thải từ ô tô cá nhân." },
        { w: "run on", pos: "phr v", ipa: "/rʌn ɒn/", vi: "chạy bằng (nhiên liệu, năng lượng)", ex: "Half of the city's buses now run on electricity.", exVi: "Một nửa số xe buýt của thành phố giờ chạy bằng điện.", more: "**run on petrol / diesel / electricity / solar power**." },
        { w: "get around", pos: "phr v", ipa: "/ɡet əˈraʊnd/", vi: "đi lại (trong một nơi)", ex: "The easiest way to get around Hanoi is by motorbike.", exVi: "Cách dễ nhất để đi lại ở Hà Nội là bằng xe máy.", more: "Câu Part 1: **How do you usually get around your city?**" },
        { w: "pick up / drop off", pos: "phr v", ipa: "/pɪk ʌp/ · /drɒp ɒf/", vi: "đón (ai) / thả (ai) xuống", ex: "My dad drops me off at school and picks me up at five.", exVi: "Bố thả tôi ở trường và đón tôi lúc năm giờ.", more: "Tân ngữ là đại từ thì đứng giữa: drop **me** off · pick **her** up." },
        { w: "set off", pos: "phr v", ipa: "/set ɒf/", vi: "khởi hành, lên đường", ex: "We set off at six to avoid the rush hour.", exVi: "Chúng tôi khởi hành lúc sáu giờ để tránh giờ cao điểm." },
        { w: "catch / miss the bus", pos: "phr", ipa: "/kætʃ/ · /mɪs ðə bʌs/", vi: "bắt kịp / lỡ chuyến xe buýt", ex: "If I miss the 7.15 bus, I have to wait twenty minutes.", exVi: "Nếu lỡ chuyến 7 giờ 15, tôi phải đợi hai mươi phút.", more: "Cũng dùng: **catch a train / a flight**." },
      ],
    },
    {
      t: "table",
      caption: "Sáu họ từ — đổi loại từ để paraphrase",
      head: ["Động từ", "Danh từ", "Tính từ", "Câu ví dụ"],
      rows: [
        ["congest", "**congestion**", "**congested**", "The roads are **congested**. = There is heavy **congestion** on the roads."],
        ["pollute", "**pollution** · pollutant (chất gây ô nhiễm)", "**polluted**", "Cars **pollute** the air. → Cars cause air **pollution**."],
        ["rely (on)", "**reliability**", "**reliable** / unreliable", "People **rely on** buses, so their **reliability** matters."],
        ["afford", "**affordability**", "**affordable**", "Many people **can't afford** a car. → Cars are not **affordable** for many people."],
        ["urbanise", "**urbanisation**", "**urban**", "Rapid **urbanisation** has put pressure on roads."],
        ["access", "**access** · accessibility", "**accessible**", "The station is **accessible** to wheelchair users."],
      ],
    },
    {
      t: "note",
      title: "Người Việt hay sai với từ giao thông",
      items: [
        "~~go to work by the bus~~ → go to work **by bus** (by + phương tiện, **không mạo từ**) — nhưng **on the bus / in the car** khi nói vị trí.",
        "~~The traffic is very crowded~~ → The traffic is very **heavy** / The roads are very **congested** / The **bus** is crowded. **traffic** đi với **heavy / light**.",
        "~~infrastructures, transports~~ → **infrastructure, transport** (không đếm được).",
        "~~The fee of the bus~~ → the **bus fare**. Học phí là **tuition fees**, vé xe là **fare**.",
        "~~The public transport in my city is not convenience~~ → … is not **convenient** (tính từ).",
      ],
    },
    {
      t: "rule",
      formula: "traffic: heavy / light · roads: congested · public transport: reliable / affordable / frequent · by bus / by car (không mạo từ)",
      vi: "Bộ ghép từ hay sai nhất của chủ đề giao thông.",
    },

    { t: "h", text: "3. Bốn câu mẫu ăn điểm (Task 2 · Part 3)" },
    {
      t: "examples",
      items: [
        { en: "Investing heavily in reliable and affordable public transport is the most effective way to ease congestion in densely populated cities.", vi: "Đầu tư mạnh vào giao thông công cộng đáng tin cậy và giá phải chăng là cách hiệu quả nhất để giảm tắc nghẽn ở các thành phố đông dân." },
        { en: "As car ownership rises, cities face not only gridlock but also higher emissions and noise pollution.", vi: "Khi tỉ lệ sở hữu ô tô tăng, các thành phố không chỉ đối mặt với tắc cứng mà còn với khí thải và ô nhiễm tiếng ồn cao hơn." },
        { en: "Urban sprawl forces people who live in the suburbs to spend more time commuting and less time with their families.", vi: "Đô thị lan tràn buộc người sống ở ngoại ô mất nhiều thời gian đi lại hơn và ít thời gian bên gia đình hơn." },
        { en: "Pedestrianising city centres and building separate cycle lanes would make our cities safer and far more liveable.", vi: "Biến trung tâm thành phố thành khu đi bộ và xây làn xe đạp riêng sẽ làm thành phố an toàn hơn và đáng sống hơn nhiều." },
      ],
    },
    {
      t: "note",
      title: "Mẹo dùng câu mẫu",
      items: [
        "Đừng chép nguyên câu vào bài: giám khảo nhận ra câu học thuộc. Giữ **khung** (Investing in… is the most effective way to…), **thay từ** theo đề.",
        "Mỗi câu trên có **ít nhất 2 collocation** (invest heavily in · ease congestion · densely populated…) — đó là thứ đẩy LR từ 4 lên 5.",
      ],
    },

    { t: "h", text: "4. Phát âm: /æ/ – /ʌ/ – /ɑː/ trong từ giao thông" },
    {
      t: "table",
      head: ["Âm", "Cách đặt miệng", "Từ trong bài", "Hay đọc nhầm thành"],
      rows: [
        ["**/æ/** tram", "Miệng mở **rộng sang hai bên**, lưỡi thấp, giữa “a” và “e” tiếng Việt", "tram · traffic · cab · jam · taxi", "/e/ → “trem”, “tréc-phích”"],
        ["**/ʌ/** bus", "Miệng mở **vừa**, ngắn, gần “ă” tiếng Việt", "bus · rush · subway · suburb · public", "/ɒ/ → “boss”, “rốt”"],
        ["**/ɑː/** car", "Miệng mở **to, lùi sâu**, kéo **dài**", "car · park · fast · far · pass", "/a/ ngắn → “ca”, “pác”"],
      ],
    },
    {
      t: "phatam",
      id: "t2d8-phat-am",
      title: "Luyện phát âm — /æ/ · /ʌ/ · /ɑː/",
      note: "Bấm “Nghe mẫu”, rồi “Đọc & chấm”. /æ/ miệng bè sang hai bên; /ʌ/ ngắn, mở vừa; /ɑː/ mở to và kéo dài. Đừng đọc bus thành “boss” hay tram thành “trem”.",
      items: [
        { text: "tram, traffic, jam, cab", ipa: "træm træfɪk dʒæm kæb", vi: "/æ/" },
        { text: "bus, rush, subway, public", ipa: "bʌs rʌʃ sʌbweɪ pʌblɪk", vi: "/ʌ/" },
        { text: "car, park, fast, far", ipa: "kɑː pɑːk fɑːst fɑː", vi: "/ɑː/ dài" },
        { text: "cat, cut, cart", ipa: "kæt kʌt kɑːt", vi: "ba âm cạnh nhau" },
        { text: "The traffic jam lasted an hour.", ipa: "ðə træfɪk dʒæm lɑːstɪd ən aʊə", vi: "/æ/ · /ɑː/" },
        { text: "I catch the bus in the rush hour.", ipa: "aɪ kætʃ ðə bʌs ɪn ðə rʌʃ aʊə", vi: "catch /æ/ · bus, rush /ʌ/" },
        { text: "The car park is far from the subway.", ipa: "ðə kɑː pɑːk ɪz fɑː frəm ðə sʌbweɪ", vi: "/ɑː/ · /ʌ/" },
        { text: "Public transport is fast and affordable.", ipa: "pʌblɪk trænspɔːt ɪz fɑːst ənd əfɔːdəbl", vi: "/ʌ/ · /æ/ · /ɑː/" },
      ],
    },

    { t: "h", text: "5. Luyện tập" },
    {
      t: "quiz",
      id: "t2d8-tv-dien",
      title: "Điền MỘT từ để hoàn thành cụm (8 câu)",
      kind: "fill",
      items: [
        { q: "(1) The new metro line should ___ congestion in the city centre. (giảm bớt)", answers: ["ease", "relieve", "reduce"] },
        { q: "(2) I got ___ in traffic for forty minutes.", answers: ["stuck", "caught"] },
        { q: "(3) Most of the new buses run ___ electricity.", answers: ["on"] },
        { q: "(4) The traffic is very ___ at 8 a.m. (đông — đi với traffic)", answers: ["heavy", "bad", "busy"] },
        { q: "(5) Bus ___ have gone up by 10% this year. (giá vé)", answers: ["fares"] },
        { q: "(6) Sorry I'm late. I was held ___ by an accident on the bridge.", answers: ["up"] },
        { q: "(7) Young people in big cities often can't ___ to buy a car. (đủ tiền)", answers: ["afford"] },
        { q: "(8) Many families have moved out to the ___ to find cheaper houses. (ngoại ô, số nhiều)", answers: ["suburbs", "outskirts"] },
      ],
    },
    {
      t: "mcq",
      id: "t2d8-tv-ho-tu",
      title: "Chọn đúng loại từ (6 câu)",
      items: [
        { q: "(1) The roads into the city are badly ___ every morning.", options: ["congested", "congestion", "congest"], correct: 0, why: "Sau **be + trạng từ (badly)** cần **tính từ**: congested." },
        { q: "(2) The ___ of the metro is the main reason people use it.", options: ["reliable", "reliability", "rely"], correct: 1, why: "Sau **The … of** cần **danh từ**: reliability." },
        { q: "(3) Rapid ___ has created huge pressure on transport.", options: ["urban", "urbanise", "urbanisation"], correct: 2, why: "Sau tính từ **Rapid** cần **danh từ**: urbanisation." },
        { q: "(4) The station is fully ___ to people in wheelchairs.", options: ["access", "accessible", "accessibility"], correct: 1, why: "Sau **is fully** cần **tính từ**: accessible." },
        { q: "(5) Factories ___ the river with chemicals.", options: ["pollute", "pollution", "polluting"], correct: 0, why: "Chủ ngữ Factories + **động từ** chia thì: pollute. “polluting” đứng một mình (không có are) không làm động từ chính được." },
        { q: "(6) Housing near the city centre is no longer ___ for young workers.", options: ["afford", "affordability", "affordable"], correct: 2, why: "Sau **is no longer** cần **tính từ**: affordable." },
      ],
    },
    {
      t: "quiz",
      id: "t2d8-tv-dich",
      title: "Dịch sang tiếng Anh (5 câu)",
      kind: "translate",
      grammar: "invest heavily in · ease congestion · by bus · get around · run on",
      items: [
        { q: "Chính phủ nên đầu tư mạnh vào giao thông công cộng.", hint: "The government should, invest heavily in, public transport", answers: ["The government should invest heavily in public transport.", "The government should invest heavily in public transportation.", "Governments should invest heavily in public transport.", "The government should invest a lot in public transport.", "The government should invest more in public transport."] },
        { q: "Tôi thường đi làm bằng xe buýt.", hint: "I usually, go to work, by bus", answers: ["I usually go to work by bus.", "I usually travel to work by bus.", "I usually get to work by bus.", "I usually take the bus to work.", "I usually go to work on the bus.", "I often go to work by bus.", "I normally go to work by bus.", "I usually go to work by bus", "I often take the bus to work."] },
        { q: "Cách dễ nhất để đi lại trong thành phố này là bằng tàu điện ngầm.", hint: "The easiest way, to get around, this city, is by metro / underground / subway", answers: ["The easiest way to get around this city is by metro.", "The easiest way to get around this city is by underground.", "The easiest way to get around this city is by subway.", "The easiest way to get around this city is by the metro.", "The easiest way to get around this city is on the metro.", "The easiest way to get around the city is by metro."] },
        { q: "Làn xe đạp riêng sẽ làm đường phố an toàn hơn.", hint: "Separate cycle lanes, would make, the streets, safer", answers: ["Separate cycle lanes would make the streets safer.", "Separate bike lanes would make the streets safer.", "Separate cycle lanes would make streets safer.", "Separate cycle lanes will make the streets safer.", "Separate bike lanes would make streets safer.", "Separate cycle lanes would make roads safer.", "Separate cycle lanes will make streets safer.", "Separate bike lanes will make the streets safer.", "Separate bike lanes will make streets safer.", "Separate cycle lanes will make the roads safer."] },
        { q: "Ngày càng nhiều xe buýt chạy bằng điện.", hint: "More and more buses, run on, electricity", answers: ["More and more buses run on electricity.", "More and more buses are running on electricity.", "An increasing number of buses run on electricity.", "A growing number of buses run on electricity.", "More and more buses now run on electricity."] },
      ],
    },
  ],
};

/* ─────────────────────────── Đọc ─────────────────────────── */

const T2D8_DOC: Lesson = {
  id: "t2d8-doc",
  kind: "reading",
  title: "Đọc: Short-answer questions + paraphrase 3 cách khi đọc",
  goal: "Trả lời đúng câu hỏi ngắn (Short-answer questions) với giới hạn NO MORE THAN THREE WORDS AND/OR A NUMBER, chép đúng từ trong bài, và nhận ra câu hỏi đã paraphrase bài đọc theo 3 cách (đồng nghĩa · đổi loại từ · đổi cấu trúc) — đích ≥ 10/14 câu, mức Passage 1–2 của band 5.",
  minutes: 55,
  blocks: [
    {
      t: "recap",
      title: "Bài này học gì · đẩy band nào",
      items: [
        "**Short-answer questions**: câu hỏi Wh- (What, Where, When, How many…), trả lời bằng **từ chép trong bài**, **đúng giới hạn từ** (vd. NO MORE THAN THREE WORDS AND/OR A NUMBER), câu hỏi **đi theo thứ tự** bài.",
        "Đề **không bao giờ** dùng nguyên lời bài — câu hỏi được **paraphrase**. Ba cách cơ bản: ==đồng nghĩa== (rush hour → peak time) · ==đổi loại từ== (congested → congestion) · ==đổi cấu trúc== (chủ động ↔ bị động, mệnh đề → cụm danh từ).",
        "Từ để hỏi cho biết **loại đáp án**: When → thời gian · How many → số · Who → người / tổ chức · What → danh từ.",
        "Luyện: 6 câu nhận paraphrase, một bài đọc ~520 từ về **xe buýt nhanh (BRT)** với **10 câu hỏi ngắn** + 4 câu soi paraphrase.",
        "Đẩy **Reading band 5**: làm chắc dạng câu “tìm – chép” ở Passage 1–2 (mục tiêu cuối Tập 2: Passage 1+2 ≥ 15/27).",
      ],
    },

    { t: "h", text: "1. Short-answer questions trông như thế nào?" },
    {
      t: "p",
      text: "Đề cho một loạt **câu hỏi trực tiếp** (thường bắt đầu bằng **What / Which / When / Where / Who / How many / How long**) và dòng hướng dẫn kiểu: **Answer the questions below. Choose NO MORE THAN THREE WORDS AND/OR A NUMBER from the passage for each answer.** Bạn **không cần viết thành câu** — chỉ ghi cụm từ trả lời, **chép đúng chính tả từ bài**.",
    },
    {
      t: "table",
      caption: "Đọc từ để hỏi → đoán loại đáp án trước khi tìm",
      head: ["Câu hỏi bắt đầu bằng", "Đáp án là", "Ví dụ đáp án"],
      rows: [
        ["When / In which year / decade", "mốc thời gian", "1974 · the 1970s · in spring"],
        ["How many / How much / How long", "**số** + đơn vị", "180,000 · 35 minutes · $2"],
        ["Where / In which country", "nơi chốn", "Brazil · the city centre"],
        ["Who / Which organisation", "người, nhóm, tổ chức", "shop owners · the local government"],
        ["What / Which + danh từ", "**danh từ / cụm danh từ**", "a timetable · exhaust fumes"],
      ],
    },
    {
      t: "table",
      caption: "Giới hạn từ — đọc thật kỹ dòng chữ in HOA",
      head: ["Dòng hướng dẫn", "Được viết", "Không được viết"],
      rows: [
        ["ONE WORD ONLY", "timetable", "a timetable (2 từ)"],
        ["NO MORE THAN TWO WORDS", "exhaust fumes", "the exhaust fumes (3 từ)"],
        ["NO MORE THAN THREE WORDS AND/OR A NUMBER", "parents with pushchairs · 35 minutes · around 180,000", "parents with heavy pushchairs (4 từ)"],
      ],
    },
    {
      t: "note",
      title: "Quy ước đếm từ và số",
      items: [
        "**Số** viết bằng chữ số tính là **một số**, không tính là từ: “35 minutes” = một số + một từ — hợp lệ với “ONE WORD AND/OR A NUMBER”.",
        "Từ có gạch nối (**well-known**, **high-rise**) tính là **một từ**.",
        "Mạo từ **a / an / the** vẫn là **một từ** — nếu vượt giới hạn, bỏ mạo từ (đáp án thường không cần nó).",
        "Viết **quá số từ** = **sai cả câu**, dù đã có ý đúng bên trong.",
      ],
    },
    {
      t: "sodo",
      kind: "flow",
      title: "Năm bước làm Short-answer",
      steps: [
        { label: "Đọc giới hạn từ", sub: "khoanh **THREE WORDS AND/OR A NUMBER**" },
        { label: "Gạch từ khoá câu hỏi", sub: "tên riêng, số, năm (không đổi) + từ nội dung (sẽ bị paraphrase)" },
        { label: "Đoán loại đáp án", sub: "When → năm · How many → số · Who → người" },
        { label: "Tìm vị trí theo thứ tự", sub: "dò tên / số trước; rồi dò từ đồng nghĩa" },
        { label: "Chép đúng, đếm từ", sub: "chép **nguyên chữ** trong bài, kiểm số ít / số nhiều, chính tả" },
      ],
      caption: "Đáp án luôn là CHỮ TRONG BÀI. Không tự đổi sang từ của mình, kể cả khi từ của bạn “đúng nghĩa”.",
    },

    { t: "h", text: "2. Paraphrase — ba cách đề “nói lại” bài đọc" },
    {
      t: "p",
      text: "Paraphrase (diễn đạt lại) là **lõi của mọi dạng câu hỏi** Reading và Listening. Ở band 4, người học chỉ tìm được đáp án khi câu hỏi **trùng từ** với bài. Ở band 5, bạn phải nhận ra **cùng một ý viết bằng lời khác**. Tập 2 học **3 cách cơ bản** dưới đây; Tập 3 sẽ thêm cách thứ 4 (ý ẩn, suy luận).",
    },
    {
      t: "sodo",
      kind: "compare",
      title: "Ba cách paraphrase cơ bản",
      cols: [
        { title: "① Đồng nghĩa", anh: "left-right-arrow", items: ["Thay **một từ / cụm** bằng từ cùng nghĩa", "rush hour → **peak time**", "costs far less → **is much cheaper**", "the elderly → **older people**"] },
        { title: "② Đổi loại từ", anh: "counterclockwise-arrows-button", items: ["Cùng gốc, đổi **động từ ↔ danh từ ↔ tính từ**", "roads are **congested** → **congestion** on roads", "buses are **reliable** → the **reliability** of buses", "**grow** quickly → **rapid growth**"] },
        { title: "③ Đổi cấu trúc", anh: "shuffle-tracks-button", items: ["Đổi **cách xây câu**, giữ nghĩa", "Planners **built** it → It **was built** by planners", "**because prices rose** → **due to the price rise**", "**not** expensive → **cheap**"] },
      ],
      caption: "Một câu hỏi thường dùng 2 cách cùng lúc. Ví dụ bài: “Such a line may cost roughly one-fifteenth of the price of a metro.” → Câu hỏi: “A BRT line can be far cheaper to build than an underground railway.” (đồng nghĩa + đổi cấu trúc).",
    },
    {
      t: "table",
      caption: "Ví dụ: bài đọc → câu hỏi",
      head: ["Trong bài", "Trong câu hỏi", "Cách"],
      rows: [
        ["Buses **run in dedicated lanes**.", "Buses have **their own lanes**.", "① đồng nghĩa"],
        ["The city could **not afford** a metro.", "A metro was **too expensive** for the city.", "① + ③"],
        ["**Journey times fell** sharply.", "There was a sharp **fall in journey times**.", "② động từ → danh từ"],
        ["Shop owners **worry** that…", "Shop owners **are worried** that… / Shop owners' **concern**", "② đổi loại từ"],
        ["Passengers **buy tickets** at the station.", "Tickets **are bought** at the station.", "③ chủ động → bị động"],
        ["Electric buses **produce no** exhaust fumes.", "Electric buses are **fume-free**. / do **not** produce exhaust", "③ phủ định đổi cách nói"],
      ],
    },
    {
      t: "rule",
      formula: "Paraphrase = ① đồng nghĩa · ② đổi loại từ (V ↔ N ↔ adj) · ③ đổi cấu trúc (chủ động ↔ bị động, mệnh đề ↔ cụm danh từ)",
      vi: "Tìm vị trí bằng tên riêng / số (không đổi) trước, rồi nhận ra ý bằng 3 cách này.",
    },
    {
      t: "mcq",
      id: "t2d8-doc-paraphrase",
      title: "Câu nào cùng nghĩa với câu trong bài? (6 câu)",
      items: [
        { q: "(1) Bài: “Car ownership has doubled since 2010.”", options: ["People have owned cars since 2010.", "Twice as many people own cars as in 2010.", "Car prices have doubled since 2010."], correct: 1, why: "**doubled** = **twice as many** (① + ③). Câu 3 đổi “sở hữu” thành “giá” — sai ý." },
        { q: "(2) Bài: “The city decided to pedestrianise the old quarter.”", options: ["Cars are no longer allowed in the old quarter.", "The old quarter became more crowded with cars.", "The city built a car park in the old quarter."], correct: 0, why: "**pedestrianise** = biến thành khu đi bộ = **cars are no longer allowed** (③)." },
        { q: "(3) Bài: “Bus services became far more reliable.”", options: ["Buses became cheaper.", "There were more buses.", "The reliability of buses improved a lot."], correct: 2, why: "**reliable** (adj) → **reliability** (n) (②). “cheaper”, “more buses” là ý khác." },
        { q: "(4) Bài: “Few drivers were willing to leave their cars at home.”", options: ["Drivers left their cars at home.", "Many drivers stopped using their cars.", "Most drivers did not want to stop using their cars."], correct: 2, why: "**Few … were willing** = phần lớn **không muốn** (③ đổi cách nói phủ định). Câu 1 và 2 ngược ý." },
        { q: "(5) Bài: “Congestion was reduced by 20%.”", options: ["Congestion increased by 20%.", "Traffic jams fell by a fifth.", "20% of drivers were congested."], correct: 1, why: "congestion ≈ **traffic jams** (①), reduced → **fell** (①), 20% = **a fifth** (①)." },
        { q: "(6) Bài: “The bridge was opened in 2015 by the mayor.”", options: ["The mayor opened the bridge in 2015.", "The bridge was designed by the mayor.", "The mayor closed the bridge in 2015."], correct: 0, why: "Bị động → chủ động (③). Nghĩa giữ nguyên: người mở cầu là **thị trưởng**, năm **2015**." },
      ],
    },

    { t: "h", text: "3. Bài đọc luyện tập — Questions 1–14" },
    {
      t: "p",
      text: "Bài đọc soạn riêng cho khoá, **6 đoạn A–F** (khoảng 520 từ) về **Bus Rapid Transit** — hệ thống xe buýt chạy như tàu điện ngầm trên mặt đất. Làm trong **20 phút**: đọc lướt 2 phút để nắm ý từng đoạn, rồi làm câu 1–10 theo 5 bước, cuối cùng câu 11–14.",
    },
    {
      t: "passage",
      title: "Bus Rapid Transit: a subway above ground",
      intro: "Bài đọc 6 đoạn (A–F). Questions 1–14 ở ngay bên dưới.",
      paras: [
        { label: "A", text: "In many growing cities, traffic congestion is one of the biggest problems faced by local governments. The traditional solution has been to build an underground railway, or metro. A metro can carry huge numbers of passengers quickly, but it is extremely expensive and can take more than a decade to plan and construct. For cities with limited budgets, there is an alternative that costs far less: Bus Rapid Transit, usually known as BRT." },
        { label: "B", text: "The idea was developed in Curitiba, a city in southern Brazil, in the 1970s. Planners there could not afford a metro, so they decided to make buses behave like trains. They gave buses their own lanes in the middle of the main roads, so that they no longer had to wait in traffic with cars. Later, the city added raised stations shaped like glass tubes, where passengers paid before boarding. Because the floor of each station was at the same height as the floor of the bus, people could walk straight on, and buses spent much less time at every stop." },
        { label: "C", text: "Today, a full BRT system is usually described as having several key features. Four of the most important are the following. First, buses run in dedicated lanes that other vehicles are not allowed to use. Second, passengers buy tickets at the station rather than from the driver. Third, boarding is level, which helps not only wheelchair users but also parents with pushchairs and travellers with heavy luggage. Finally, services are frequent: in busy periods, a bus may arrive every two or three minutes, so passengers do not need to check a timetable." },
        { label: "D", text: "The results can be impressive. Transport planners often describe a typical case like this one. A mid-sized city opens a 25-kilometre BRT line, and the average journey time from the suburbs to the city centre falls from 55 minutes to 35 minutes. Within five years, the line is carrying around 180,000 passengers a day, and about one in ten of them previously travelled by car. Such a line may cost roughly one-fifteenth of the price of a metro of the same length." },
        { label: "E", text: "However, BRT is not without its critics. Because the dedicated lanes take space away from cars, drivers often complain that their own journeys have become slower. Shop owners along the route sometimes worry that customers will no longer be able to park outside. In addition, some cities have built what transport planners call “BRT lite”: buses with a new name and a new colour but without separate lanes. These systems are cheaper still, but they rarely deliver the same improvement in speed, and they can damage public trust in the whole idea." },
        { label: "F", text: "Looking ahead, many BRT systems are replacing their diesel buses with electric ones. Electric buses produce no exhaust fumes on the street and are much quieter, which matters in densely populated areas. Their batteries are expensive, but running costs are lower, partly because electric motors need less maintenance than diesel engines. For many planners, the combination of dedicated lanes and clean vehicles makes BRT one of the most practical ways to make city transport both faster and greener." },
      ],
    },
    {
      t: "p",
      text: "**Questions 1–10.** Answer the questions below. Choose **NO MORE THAN THREE WORDS AND/OR A NUMBER** from the passage for each answer.",
    },
    {
      t: "quiz",
      id: "t2d8-doc-cau-ngan",
      title: "Questions 1–10 — Short-answer (≤ 3 từ và/hoặc một số)",
      kind: "fill",
      items: [
        { q: "1. What have cities traditionally built to deal with traffic congestion?", answers: ["underground railway", "an underground railway", "a metro", "metro"] },
        { q: "2. In which decade was BRT developed in Curitiba?", answers: ["1970s", "the 1970s", "1970's", "the 1970's", "in the 1970s"] },
        { q: "3. What did the raised stations in Curitiba look like?", answers: ["glass tubes", "like glass tubes", "shaped like glass tubes"] },
        { q: "4. Apart from wheelchair users and travellers with heavy luggage, who benefits from level boarding?", answers: ["parents with pushchairs"] },
        { q: "5. Because buses are so frequent, what do passengers not need to look at?", answers: ["timetable", "a timetable", "the timetable"] },
        { q: "6. In the typical case in paragraph D, how long does the average journey to the city centre take after the BRT line opens?", answers: ["35 minutes", "thirty-five minutes", "35 mins"] },
        { q: "7. In the same case, how many passengers a day is the line carrying within five years?", answers: ["180,000", "around 180,000", "180000", "180 000", "180,000 passengers", "around 180,000 passengers"] },
        { q: "8. Which group complains that BRT makes their own journeys slower?", answers: ["drivers"] },
        { q: "9. What do planners call bus systems that have no separate lanes?", answers: ["BRT lite", "“BRT lite”", "BRT-lite"] },
        { q: "10. What do electric buses NOT produce on the street?", answers: ["exhaust fumes", "fumes"] },
      ],
    },
    {
      t: "note",
      title: "Giải thích đáp án 1–10 (kèm cách paraphrase)",
      items: [
        "**1 — underground railway / metro** (đoạn A). “The **traditional solution** has been to build an underground railway, or metro.” ← câu hỏi “**traditionally built**” (② tính từ → trạng từ). Hai cách gọi đều có trong bài, đều đúng.",
        "**2 — (the) 1970s** (đoạn B). “developed in Curitiba… **in the 1970s**”. Hỏi **decade** (thập kỷ) → đáp án là “1970s”, không phải một năm cụ thể.",
        "**3 — glass tubes** (đoạn B). “raised stations **shaped like** glass tubes” ← “What did… **look like**?” (③). “like glass tubes” hay “shaped like glass tubes” cũng trong giới hạn 3 từ.",
        "**4 — parents with pushchairs** (đoạn C). “helps not only wheelchair users but also **parents with pushchairs** and travellers with heavy luggage” ← “**benefits from**” = **helps** (①). Đúng 3 từ.",
        "**5 — (a) timetable** (đoạn C). “passengers **do not need to check** a timetable” ← “not need to **look at**” (①).",
        "**6 — 35 minutes** (đoạn D). “falls **from 55 minutes to 35 minutes**” — bẫy: 55 là con số **trước khi** có BRT. Câu hỏi nói “**after** the BRT line opens”. Nhớ ghi cả đơn vị: **35 minutes**.",
        "**7 — (around) 180,000** (đoạn D). “**Within five years**, the line is carrying around 180,000 passengers a day”. Chỉ cần viết số; thêm “passengers” (vẫn trong giới hạn từ) cũng đúng.",
        "**8 — drivers** (đoạn E). “**drivers** often **complain** that their own journeys have become slower”. Bẫy: **shop owners** cũng than phiền nhưng về **chỗ đỗ xe**, không về tốc độ.",
        "**9 — BRT lite** (đoạn E). “what transport planners **call** ‘BRT lite’: buses… **without separate lanes**” ← “**no** separate lanes” (③ đổi cách phủ định).",
        "**10 — exhaust fumes** (đoạn F). “Electric buses **produce no** exhaust fumes on the street” ← “do **NOT** produce” (③). **Không** viết “no exhaust fumes”: câu hỏi đã có **NOT**, thêm “no” thành phủ định hai lần và bị chấm sai.",
      ],
    },
    {
      t: "p",
      text: "**Questions 11–14.** Mỗi câu dưới đây là một **paraphrase** của một ý trong bài. Chọn **câu gốc trong bài** mà nó diễn đạt lại — luyện kỹ năng “soi” paraphrase.",
    },
    {
      t: "mcq",
      id: "t2d8-doc-soi",
      title: "Questions 11–14 — tìm câu gốc trong bài",
      items: [
        { q: "(11) “Building a metro is a long process.”", options: ["A metro can carry huge numbers of passengers quickly.", "It can take more than a decade to plan and construct.", "The traditional solution has been to build an underground railway."], correct: 1, why: "**a long process** ≈ **take more than a decade** (①). Phương án 1 nói về **sức chở**, không về thời gian xây." },
        { q: "(12) “A BRT line can be far cheaper to build than an underground railway of the same length.”", options: ["These systems are cheaper still.", "Their batteries are expensive, but running costs are lower.", "Such a line may cost roughly one-fifteenth of the price of a metro of the same length."], correct: 2, why: "**one-fifteenth of the price** = rẻ hơn rất nhiều (③); metro = **underground railway** (①). Phương án 1 nói về **BRT lite**." },
        { q: "(13) “Some business people fear losing customers who drive.”", options: ["Shop owners along the route sometimes worry that customers will no longer be able to park outside.", "Drivers often complain that their own journeys have become slower.", "They can damage public trust in the whole idea."], correct: 0, why: "**business people** ≈ **shop owners** (①); **fear** ≈ **worry** (①); khách **lái xe** = khách cần **đỗ xe** (suy ra trực tiếp)." },
        { q: "(14) “Electric motors are easier to look after.”", options: ["Electric buses are much quieter.", "Electric motors need less maintenance than diesel engines.", "Many BRT systems are replacing their diesel buses with electric ones."], correct: 1, why: "**easier to look after** ≈ **need less maintenance** (① + ③)." },
      ],
    },
    {
      t: "table",
      caption: "Tự chấm bài đọc (14 câu)",
      head: ["Số câu đúng", "Mức", "Việc nên làm"],
      rows: [
        ["12–14", "Vững mức Passage 1 band 5.5+", "Sang bài Viết"],
        ["10–11", "Đạt mục tiêu band 5", "Xem lại câu sai: lỗi **giới hạn từ** hay lỗi **không nhận ra paraphrase**?"],
        ["≤ 9", "Chưa đạt", "Ôn mục 2 (3 cách paraphrase), làm lại 6 câu mục 2, đọc lại bài sau 1 ngày"],
      ],
    },
    {
      t: "note",
      title: "Người Việt hay sai ở Short-answer",
      items: [
        "**Viết quá số từ**: “the average journey time” (4 từ) khi giới hạn 3 từ. Bỏ mạo từ, bỏ từ thừa.",
        "**Tự đổi từ** cho “gọn” hoặc “đúng nghĩa hơn”: bài viết “pushchairs”, bạn ghi “baby cars” → sai. **Chép nguyên chữ** trong bài.",
        "**Lấy nhầm con số** khi đoạn văn có hai số (55 và 35 phút). Đọc kỹ từ thời gian trong câu hỏi: **before / after / within / by**.",
        "**Sai số ít / số nhiều**: bài có “glass tubes”, ghi “glass tube” → nhiều đề chấm sai. Chép đúng đuôi -s.",
        "**Bỏ trống**: Short-answer không trừ điểm câu sai — luôn ghi một đáp án hợp lý.",
      ],
    },

    { t: "h", text: "4. Ba thói quen của người band 5+: đoán trước từ thay thế · đánh số bên lề · sổ paraphrase" },
    {
      t: "p",
      text: "Mục 2 dạy bạn **nhận ra** paraphrase khi đã thấy nó. Người band 5+ đi trước một bước: **đoán trước** bài sẽ viết lại thế nào, rồi mới dò. Cách làm: gạch từ khoá câu hỏi và chia hai nhóm — ==giữ nguyên== (tên riêng, năm, con số in sẵn, thuật ngữ như BRT, metro) và ==sẽ bị đổi== (động từ, tính từ, danh từ thường). Với mỗi từ nhóm hai, viết nhanh **2–3 từ dự đoán** bên cạnh. Mắt bạn sẽ “bắt” được câu đúng ngay cả khi không có từ nào trùng.",
    },
    {
      t: "table",
      caption: "Số liệu hay bị viết thành chữ — đoán trước để không lướt qua",
      head: ["Câu hỏi viết", "Bài đọc có thể viết", "Ghi chú"],
      rows: [
        ["ten years", "**a decade** · over the past decade", "100 years = **a century** · 1,000 years = a millennium"],
        ["1990–1999", "**the 1990s** · the nineties", "Hỏi decade (thập kỷ) → đáp án dạng **1990s**"],
        ["50%", "**half** · one in two", "about 50% = **roughly half**"],
        ["25% · 75%", "**a quarter** · **three quarters**", "20% = **a fifth** · 10% = **one in ten** / a tenth"],
        ["about 30% · about 33%", "**almost / nearly a third**", "about 66% = **two thirds** · two in three"],
        ["more than 50%", "**the majority** · most · over half", "less than 50% = a minority · fewer than half"],
        ["doubled", "**twice as many / much** · rose by 100%", "tripled = **three times** as many · halved = fell by 50%"],
        ["very few", "**a handful of** · only a small number", "almost all = **the vast majority** · nearly every"],
      ],
    },
    {
      t: "quiz",
      id: "t2d8-doc-so-lieu",
      title: "Paraphrase số liệu — điền MỘT từ (6 câu)",
      kind: "fill",
      items: [
        { q: "Câu hỏi: “over a period of ten years” → Bài: “over a ___”", answers: ["decade"], hint: "một thập kỷ" },
        { q: "Câu hỏi: “about 30% of residents” → Bài: “almost a ___ of residents”", answers: ["third"], hint: "một phần ba" },
        { q: "Câu hỏi: “the number of cyclists doubled” → Bài: “there were ___ as many cyclists”", answers: ["twice"], hint: "gấp hai" },
        { q: "Câu hỏi: “between 1980 and 1989” → Bài: “in the ___”", answers: ["1980s", "1980's", "eighties"], hint: "thập niên — số + s" },
        { q: "Câu hỏi: “10% of passengers” → Bài: “one in ___ passengers”", answers: ["ten", "10"], hint: "một trên …" },
        { q: "Câu hỏi: “more than half of the voters” → Bài: “the ___ of the voters”", answers: ["majority"], hint: "đa số" },
      ],
    },
    {
      t: "table",
      caption: "Cặp paraphrase thuộc loại nào? — 5 nhãn để ghi sổ",
      head: ["Nhãn", "Câu hỏi", "Bài đọc", "Dùng để"],
      rows: [
        ["① Đồng nghĩa", "look at a timetable", "check a timetable", "nhận ra đáp án đúng"],
        ["② Đổi loại từ", "traditionally built", "the traditional solution", "nhận ra đáp án đúng"],
        ["③ Chủ động ↔ bị động · đổi trật tự", "Electric buses replaced diesel buses.", "Diesel buses were replaced by electric ones.", "giữ ý — nhưng kiểm **ai làm gì cho ai**"],
        ["④ Phủ định đổi cách nói", "do **not** produce exhaust fumes", "produce **no** exhaust fumes", "nhận ra đáp án đúng"],
        ["⑤ Trái nghĩa", "journey times **rose**", "journey times **fell**", "dấu hiệu **FALSE / NO** (Ngày 12, 20) — cùng chủ đề, ngược nghĩa"],
      ],
    },
    {
      t: "note",
      title: "Đánh số câu bên lề — đừng đọc lại từ đầu bài",
      items: [
        "Short-answer đi **theo thứ tự bài**. Tìm được đáp án câu 1 ở dòng nào, **ghi số “1” bên lề** dòng đó (thi máy: tô sáng). Câu 2 chỉ dò **từ đó trở xuống**.",
        "Không thấy câu 6? Làm **câu 7** trước — đáp án câu 6 nằm **giữa số “5” và số “7”**. Vùng cần đọc lại chỉ còn vài dòng.",
        "Mẹo dùng cho mọi dạng **theo thứ tự**: Short-answer, Sentence completion, TFNG / YNNG, Sentence endings, Note completion. Không dùng cho Matching (headings, information, features).",
      ],
    },
    {
      t: "sodo",
      kind: "flow",
      title: "Sổ paraphrase — 5 phút sau mỗi bài đọc",
      steps: [
        { label: "Chấm xong", sub: "đánh dấu câu đúng / sai" },
        { label: "Với MỖI câu", sub: "tìm lại **câu chứa đáp án** trong bài (kể cả câu làm đúng)" },
        { label: "Ghi một dòng", sub: "Câu hỏi | Trong bài | Nhãn ①–⑤" },
        { label: "Chỉ ghi từ ở hai chỗ đó", sub: "không tra mọi từ lạ trong bài — tốn giờ, ít dùng lại" },
        { label: "Ôn trước bài đọc sau", sub: "đọc lướt sổ 2 phút; cặp nào gặp lần 2 thì tô đậm" },
      ],
      caption: "Một đề Reading cho khoảng 20–30 cặp. Sau 10 đề, bạn có vài trăm cặp — đúng loại từ đề hay dùng, không phải danh sách học thuộc.",
    },
    {
      t: "table",
      caption: "Sổ mẫu — rút từ bài Bus Rapid Transit ở trên",
      head: ["Câu", "Câu hỏi", "Trong bài", "Nhãn"],
      rows: [
        ["1", "traditionally built", "The traditional solution has been to build", "②"],
        ["4", "benefits from", "helps", "① + ③"],
        ["5", "not need to look at", "do not need to check", "①"],
        ["10", "do NOT produce", "produce no", "④"],
        ["11", "a long process", "take more than a decade to plan and construct", "① + số liệu"],
        ["14", "easier to look after", "need less maintenance", "① + ③"],
      ],
    },
    {
      t: "quiz",
      id: "t2d8-doc-so-paraphrase",
      title: "Tự lập sổ — điền cụm TRONG BÀI ứng với cụm câu hỏi (4 câu)",
      kind: "fill",
      items: [
        { q: "Câu hỏi: “A metro was too expensive for the planners.” → Bài (đoạn B): “Planners there could not ___ a metro.”", answers: ["afford"], hint: "không đủ tiền mua / xây" },
        { q: "Câu hỏi: “A BRT line is far cheaper than a metro.” → Bài (đoạn D): “roughly ___ of the price of a metro”", answers: ["one-fifteenth", "one fifteenth"], hint: "một phần mười lăm" },
        { q: "Câu hỏi: “10% of the passengers used to drive.” → Bài (đoạn D): “about one in ten of them ___ travelled by car”", answers: ["previously"], hint: "trước đây" },
        { q: "Câu hỏi: “Electric buses make less noise.” → Bài (đoạn F): “Electric buses… are much ___”", answers: ["quieter"], hint: "yên tĩnh hơn" },
      ],
    },
    {
      t: "rule",
      formula: "Trước khi dò: giữ nguyên (tên, năm, số) + đoán 2–3 từ thay thế · Khi dò: ghi số câu bên lề · Sau khi chấm: sổ Câu hỏi | Trong bài | Nhãn",
      vi: "Ba thói quen biến “may mắn tìm thấy” thành tìm thấy có hệ thống. Sổ chỉ ghi từ ở câu hỏi và câu chứa đáp án.",
    },
    {
      t: "vocab",
      items: [
        { w: "alternative", pos: "n, adj", ipa: "/ɔːlˈtɜːnətɪv/", vi: "lựa chọn thay thế", ex: "BRT is a cheaper alternative to a metro.", exVi: "BRT là một lựa chọn thay thế rẻ hơn metro.", more: "**an alternative to** sth. Trạng từ **alternatively**." },
        { w: "dedicated", pos: "adj", ipa: "/ˈdedɪkeɪtɪd/", vi: "dành riêng (cho một việc)", ex: "Buses run in dedicated lanes.", exVi: "Xe buýt chạy trong làn dành riêng.", more: "Nghĩa khác: tận tâm (a **dedicated** teacher)." },
        { w: "boarding", pos: "n", ipa: "/ˈbɔːdɪŋ/", vi: "việc lên (tàu, xe, máy bay)", ex: "Level boarding saves time at every stop.", exVi: "Lên xe ngang sàn tiết kiệm thời gian ở mỗi trạm.", more: "Động từ **board** a bus / plane. **boarding pass** = thẻ lên máy bay." },
        { w: "pushchair", pos: "n", ipa: "/ˈpʊʃtʃeə(r)/", vi: "xe đẩy em bé (Anh); Mỹ: stroller", ex: "It is hard to get a pushchair onto an old bus.", exVi: "Đưa xe đẩy em bé lên xe buýt cũ rất khó." },
        { w: "luggage", pos: "n (U)", ipa: "/ˈlʌɡɪdʒ/", vi: "hành lý", ex: "Travellers with heavy luggage prefer level boarding.", exVi: "Người đi có hành lý nặng thích lên xe ngang sàn.", more: "**Không đếm được**: ~~luggages~~ → **pieces of luggage**." },
        { w: "critic", pos: "n", ipa: "/ˈkrɪtɪk/", vi: "người chỉ trích, phản biện", ex: "BRT is not without its critics.", exVi: "BRT không phải không có người chỉ trích.", more: "Họ từ: **criticise** (v) · **criticism** (n) · **critical** (adj)." },
        { w: "maintenance", pos: "n (U)", ipa: "/ˈmeɪntənəns/", vi: "sự bảo dưỡng", ex: "Electric motors need less maintenance.", exVi: "Động cơ điện cần ít bảo dưỡng hơn.", more: "Động từ **maintain** /meɪnˈteɪn/ — chú ý chính tả danh từ: main**te**nance." },
        { w: "practical", pos: "adj", ipa: "/ˈpræktɪkl/", vi: "thiết thực, khả thi", ex: "BRT is one of the most practical ways to improve transport.", exVi: "BRT là một trong những cách thiết thực nhất để cải thiện giao thông." },
      ],
    },
  ],
};

/* ─────────────────────────── Viết ─────────────────────────── */

const T2D8_VIET: Lesson = {
  id: "t2d8-viet",
  kind: "writing",
  title: "Viết: Task 1 bar chart + ngôn ngữ so sánh",
  goal: "Viết trọn một bài Task 1 biểu đồ cột KHÔNG có trục thời gian (so sánh nhóm) ≥ 150 từ: mở bài paraphrase, overview nêu 2 điểm nổi bật, 2 thân bài gom nhóm hợp lý, so sánh bằng 9 cấu trúc (higher than, the highest, twice as high as, whereas, compared with…) và số liệu đúng hình — đạt Task Achievement + GRA band 5–6.",
  minutes: 65,
  blocks: [
    {
      t: "recap",
      title: "Bài này học gì · đẩy band nào",
      items: [
        "Tập 1 Ngày 12 đã viết biểu đồ **có năm** (tả xu hướng: rose, fell…). Hôm nay là biểu đồ cột **không có năm**: so sánh **các nhóm** với nhau ⇒ ngôn ngữ chính là **so sánh**, không phải tăng / giảm.",
        "Bố cục 4 đoạn: **Intro** (paraphrase đề) · **Overview** (2 điểm nổi bật, không số) · **Body 1 + Body 2** (số liệu, so sánh).",
        "Gom nhóm thân bài theo **điểm chung** (theo thành phố / theo phương tiện) — không đi lần lượt từng cột.",
        "9 cấu trúc so sánh: ==higher / lower than== · ==the highest== · ==far / slightly + higher== · ==twice as high as== · ==whereas / while== · ==compared with== · ==the figure for X==…",
        "Đẩy **TA** (overview rõ, chọn số nổi bật) và **GRA** (câu so sánh đúng, có mệnh đề whereas) lên band 5–6. Bài mẫu band 6.5–7 + một bài band 4.5 để đối chiếu.",
        "Mục 3: gọi lại nhóm bằng **counterparts / the latter**, bội số **fourfold · N times more … than · a fifth of that for**, và cách làm đề có **hai biểu đồ cột**.",
      ],
    },

    { t: "h", text: "1. Hai loại biểu đồ cột" },
    {
      t: "sodo",
      kind: "compare",
      title: "Có trục thời gian và không có trục thời gian",
      cols: [
        { title: "Có năm (Tập 1 Ngày 12)", anh: "chart-increasing", items: ["Trục ngang: 2000, 2010, 2020…", "Hỏi: thay đổi **thế nào**?", "rose · fell · peaked · remained stable", "Thì **quá khứ** (hoặc dự báo)"] },
        { title: "Không năm (hôm nay)", anh: "bar-chart", items: ["Trục ngang: thành phố, nhóm tuổi, phương tiện…", "Hỏi: nhóm nào **hơn / kém / bằng**?", "higher than · the highest · twice as · whereas", "Thì theo năm của đề (một năm đã qua → **quá khứ**)"] },
      ],
      caption: "Biểu đồ một năm cụ thể trong quá khứ (2024) → viết quá khứ đơn: “52% of commuters in Ashford drove…”. Không ghi năm → hiện tại đơn.",
    },
    {
      t: "sodo",
      kind: "flow",
      title: "Viết Task 1 bar chart (20 phút)",
      steps: [
        { label: "2 phút đọc hình", sub: "đơn vị (% hay số), năm, các nhóm; tìm cột **cao nhất / thấp nhất**, điểm **khác thường**" },
        { label: "Intro (1–2 câu)", sub: "paraphrase đề: shows → compares; percentage → proportion" },
        { label: "Overview (2 câu)", sub: "2 điểm nổi bật nhất, **không số**: Overall, … whereas …" },
        { label: "Body 1 + Body 2", sub: "gom nhóm, mỗi đoạn 3–4 câu có số + **so sánh**" },
        { label: "2 phút soát", sub: "đối chiếu **từng con số** với hình; đếm ≥ 150 từ" },
      ],
    },

    { t: "h", text: "2. Ngôn ngữ so sánh cho Task 1" },
    {
      t: "patterns",
      rows: [
        { formula: "A + was / were + higher / lower than + B", vi: "So sánh hơn (học kỹ ở Ngày 9).", examples: [{ en: "The proportion of car users in Ashford was higher than in Bexley.", vi: "Tỉ lệ người đi ô tô ở Ashford cao hơn ở Bexley." }] },
        { formula: "A + had the highest / lowest + N", vi: "So sánh nhất.", examples: [{ en: "Carlton had the highest proportion of metro users.", vi: "Carlton có tỉ lệ người đi metro cao nhất." }] },
        { formula: "far / much / considerably / slightly + higher / lower", vi: "Mức độ chênh: **far / much** = nhiều; **slightly** = một chút.", examples: [{ en: "The proportion of cyclists was slightly higher in Carlton than in Ashford.", vi: "Tỉ lệ người đạp xe ở Carlton cao hơn Ashford một chút." }] },
        { formula: "A + was twice / three times as high as + B · almost / more than twice", vi: "Gấp bao nhiêu lần (nhập — Tập 3 học kỹ). Kiểm phép nhân trước khi viết!", examples: [{ en: "The figure for Ashford (52%) was almost twice as high as that for Bexley (28%).", vi: "Số liệu của Ashford (52%) cao gần gấp đôi của Bexley (28%)." }] },
        { formula: "S + V, whereas / while + S + V", vi: "Đối lập **trong một câu** (có dấu phẩy trước whereas).", examples: [{ en: "Just over half of commuters in Ashford drove to work, whereas the metro was the main choice in Carlton.", vi: "Hơn một nửa một chút số người đi làm ở Ashford lái xe, trong khi metro là lựa chọn chính ở Carlton." }] },
        { formula: "By contrast, / In contrast, + S + V", vi: "Đối lập **sang câu mới**.", examples: [{ en: "By contrast, only 8% of Ashford commuters used the train.", vi: "Ngược lại, chỉ 8% người đi làm ở Ashford dùng tàu." }] },
        { formula: "…, compared with + số / nhóm", vi: "So với… (đặt cuối câu, gọn).", examples: [{ en: "The bus was used by 35% of commuters in Bexley, compared with 20% in Ashford.", vi: "35% người đi làm ở Bexley dùng xe buýt, so với 20% ở Ashford." }] },
        { formula: "the figure / the proportion for + nhóm · that for + nhóm", vi: "Thay cho việc lặp lại cả cụm dài. **that** = the figure (tránh lặp).", examples: [{ en: "The figure for Carlton was 40%, nearly double that for Bexley.", vi: "Số liệu của Carlton là 40%, gần gấp đôi số liệu của Bexley." }] },
        { formula: "just over / just under / nearly / around + số", vi: "Làm tròn số cho tự nhiên: just over half (52%), nearly a quarter (24%).", examples: [{ en: "Just over half of commuters in Ashford drove to work.", vi: "Hơn một nửa một chút số người đi làm ở Ashford lái xe." }] },
      ],
    },
    {
      t: "table",
      caption: "Phân số thay cho phần trăm (paraphrase số liệu)",
      head: ["Phần trăm", "Cách nói", "Phần trăm", "Cách nói"],
      rows: [
        ["10%", "one in ten / a tenth", "50%", "half"],
        ["20%", "a fifth / one in five", "52%", "just over half"],
        ["25%", "a quarter", "65–67%", "about two-thirds"],
        ["33%", "a third", "75%", "three quarters"],
        ["40%", "two-fifths / four in ten", "90%", "the vast majority / nine in ten"],
      ],
    },
    {
      t: "note",
      title: "Người Việt hay sai khi so sánh trong Task 1",
      items: [
        "~~more higher~~, ~~the most highest~~ → **higher**, **the highest** (đã có -er / -est thì không thêm more / most).",
        "~~The percentage of car was 52%~~ → The percentage **of commuters who drove / of car users** was 52%. Phần trăm là của **người**, không phải của “xe”.",
        "~~Ashford is higher than Bexley~~ (thành phố không “cao hơn”) → The **figure for** Ashford was higher than **that for** Bexley.",
        "~~compare to~~ khi so sánh số liệu → **compared with** (Anh-Anh hay dùng with cho so sánh hai thứ ngang hàng; compared to cũng được chấp nhận — quan trọng là có **-ed**: ~~compare with~~).",
        "Viết “twice” khi số **không gấp đôi**: 35% vs 20% **không** phải twice → dùng **considerably higher**. Luôn **nhân thử** trước khi viết.",
        "Liệt kê đủ **12 con số** theo thứ tự cột mà không so sánh → TA chỉ band 4–5. Mỗi câu thân bài nên có **một phép so sánh**.",
      ],
    },
    {
      t: "rule",
      formula: "The figure for A was higher / the highest · far / slightly + higher · twice as high as · S + V, whereas + S + V · compared with + số",
      vi: "Biểu đồ không có năm = viết bằng so sánh; mỗi câu thân bài một phép so sánh.",
    },
    {
      t: "quiz",
      id: "t2d8-viet-dich",
      title: "Dịch sang tiếng Anh — câu so sánh Task 1 (5 câu)",
      kind: "translate",
      grammar: "The figure for A was higher than that for B · A had the highest + N · S + V, whereas + S + V · compared with · just over / nearly",
      items: [
        { q: "Carlton có tỉ lệ người đi metro cao nhất.", hint: "Carlton, had the highest proportion / percentage, of metro users", answers: ["Carlton had the highest proportion of metro users.", "Carlton had the highest percentage of metro users.", "Carlton had the highest proportion of people using the metro.", "Carlton had the highest percentage of people using the metro.", "Carlton had the highest proportion of commuters using the metro."] },
        { q: "Số liệu của Ashford cao hơn nhiều so với của Carlton.", hint: "The figure for Ashford, was much / far higher than, that for Carlton", answers: ["The figure for Ashford was much higher than that for Carlton.", "The figure for Ashford was far higher than that for Carlton.", "The figure for Ashford was considerably higher than that for Carlton.", "The figure for Ashford was much higher than the figure for Carlton.", "The figure for Ashford was far higher than the figure for Carlton.", "The figure for Ashford was a lot higher than that for Carlton.", "The figure for Ashford was significantly higher than that for Carlton.", "The figure for Ashford was considerably higher than the figure for Carlton."] },
        { q: "Hơn một nửa số người đi làm lái xe, trong khi chỉ 8% đi tàu.", hint: "Just over half of commuters, drove, whereas, only 8%, took the train", answers: ["Just over half of commuters drove, whereas only 8% took the train.", "Just over half of commuters drove, while only 8% took the train.", "Just over half of commuters drove to work, whereas only 8% took the train.", "Just over half of commuters drove to work, while only 8% took the train.", "Just over half of commuters drove, whereas only 8% used the train.", "Just over half of commuters drove to work, whereas only 8% went by train.", "More than half of commuters drove, whereas only 8% took the train.", "More than half of commuters drove, while only 8% took the train.", "Over half of commuters drove, whereas only 8% took the train.", "Over half of commuters drove, while only 8% took the train.", "More than half of commuters drove to work, whereas only 8% took the train.", "More than half of commuters drove to work, while only 8% took the train."] },
        { q: "35% người đi làm ở Bexley đi xe buýt, so với 20% ở Ashford.", hint: "35% of commuters in Bexley, took the bus / used the bus, compared with 20% in Ashford", answers: ["35% of commuters in Bexley took the bus, compared with 20% in Ashford.", "35% of commuters in Bexley used the bus, compared with 20% in Ashford.", "35% of commuters in Bexley went by bus, compared with 20% in Ashford.", "35% of commuters in Bexley took the bus, compared to 20% in Ashford.", "35% of commuters in Bexley used the bus, compared to 20% in Ashford.", "In Bexley, 35% of commuters took the bus, compared with 20% in Ashford.", "35% of commuters in Bexley travelled by bus, compared with 20% in Ashford.", "35% of commuters in Bexley travelled by bus, compared to 20% in Ashford.", "35% of commuters in Bexley went by bus, compared to 20% in Ashford."] },
        { q: "Tỉ lệ đạp xe gần như giống nhau ở cả ba thành phố.", hint: "The proportion of cyclists, was almost the same / similar, in all three cities", answers: ["The proportion of cyclists was almost the same in all three cities.", "The proportion of cyclists was similar in all three cities.", "The percentage of cyclists was almost the same in all three cities.", "The percentage of cyclists was similar in all three cities.", "The proportion of people who cycled was almost the same in all three cities.", "The proportion of cyclists was very similar in all three cities."] },
      ],
    },

    { t: "h", text: "3. Gọi tên nhóm không lặp · bội số · đề có hai biểu đồ cột" },
    {
      t: "table",
      caption: "Gọi lại một nhóm mà không lặp nguyên cụm",
      head: ["Cách", "Ví dụ"],
      rows: [
        ["**counterparts** = nhóm ở **vị trí tương ứng** bên kia (nam ↔ nữ, nước này ↔ nước kia)", "Men exercised for five hours a week, compared with three hours for their **female counterparts**."],
        ["**their + nơi / nhóm + counterparts**", "Commuters in Ashford drove far more than **their Carlton counterparts**."],
        ["Đổi tên nhóm tuổi", "people aged 18–24 → **the youngest group** · **younger adults** · **those in their early twenties**"],
        ["**the former / the latter** (cái trước / cái sau)", "Bexley and Carlton relied more on public transport, **the latter** especially on the metro."],
      ],
    },
    {
      t: "note",
      title: "Cẩn thận với counterpart",
      items: [
        "Chỉ dùng khi hai nhóm **cùng vai**: nam ↔ nữ, học sinh Anh ↔ học sinh Mỹ. ~~Cars and their bus counterparts~~ — xe và xe buýt không phải “người tương ứng” của nhau → nói **buses**.",
        "Nói về **nhóm người** → số nhiều **counterparts**; một người / một vật → **counterpart** (Japan's figure was lower than its **Korean counterpart**).",
      ],
    },
    {
      t: "table",
      caption: "Bội số và phân số — ngoài twice / three times",
      head: ["Khung", "Nghĩa", "Ví dụ"],
      rows: [
        ["rise / increase **fourfold** · **a fourfold increase**", "tăng **gấp 4**", "Sales of electric cars rose **fourfold**, from 5,000 to 20,000."],
        ["**N times as many / much + N + as**", "nhiều gấp N lần (an toàn nhất)", "Carlton had **twice as many** metro users **as** Bexley."],
        ["A had **N times more** + N **than** B", "nhiều hơn N lần (hay gặp trong bài mẫu)", "Men spent **three times more** time on sport **than** women."],
        ["**a fifth / a quarter / half of** + that for… / the figure for…", "bằng 1/5, 1/4, 1/2 của…", "Ashford's metro figure (8%) was **a fifth of that for** Carlton (40%)."],
      ],
    },
    {
      t: "quiz",
      id: "t2d8-viet-boi-so",
      title: "Dịch — bội số, phân số, counterparts (3 câu)",
      kind: "translate",
      grammar: "rose fourfold · N times more + N + than · a fifth of that for + nhóm · their female / male counterparts. Nhân thử trước khi viết!",
      items: [
        { q: "Doanh số xe điện tăng gấp bốn, từ 5.000 lên 20.000 chiếc.", hint: "Sales of electric cars, rose / increased fourfold, from 5,000 to 20,000", answers: ["Sales of electric cars rose fourfold, from 5,000 to 20,000.", "Sales of electric cars increased fourfold, from 5,000 to 20,000.", "Electric car sales rose fourfold, from 5,000 to 20,000.", "Electric car sales increased fourfold, from 5,000 to 20,000.", "Sales of electric cars rose fourfold from 5,000 to 20,000.", "There was a fourfold increase in sales of electric cars, from 5,000 to 20,000."] },
        { q: "Tỉ lệ đi metro ở Ashford (8%) chỉ bằng một phần năm con số của Carlton (40%).", hint: "The proportion of metro users in Ashford (8%), was only a fifth of, that for Carlton (40%)", answers: ["The proportion of metro users in Ashford (8%) was only a fifth of that for Carlton (40%).", "The proportion of metro users in Ashford (8%) was only one fifth of that for Carlton (40%).", "The figure for metro users in Ashford (8%) was only a fifth of that for Carlton (40%).", "The proportion of metro users in Ashford (8%) was just a fifth of that for Carlton (40%).", "The percentage of metro users in Ashford (8%) was only a fifth of that for Carlton (40%).", "The proportion of metro users in Ashford (8%) was only a fifth of the figure for Carlton (40%)."] },
        { q: "Nam giới dành thời gian chơi thể thao nhiều gấp ba lần nữ giới (dùng counterparts).", hint: "Men, spent three times more time on sport, than their female counterparts", answers: ["Men spent three times more time on sport than their female counterparts.", "Men spent three times as much time on sport as their female counterparts.", "Men spent three times more time playing sport than their female counterparts.", "Men spent three times as much time playing sport as their female counterparts.", "Men spent three times more time on sports than their female counterparts.", "Men spent three times as much time on sports as their female counterparts."] },
      ],
    },
    {
      t: "note",
      title: "Mẹo khi đề có HAI biểu đồ cột",
      items: [
        "**Đọc quan hệ giữa hai hình**: cùng nhóm nhưng đo hai thứ khác nhau (hình 1 = số người đi làm, hình 2 = thời gian đi) **hay** cùng thứ nhưng hai năm / hai nơi?",
        "**Mở bài một câu gọi cả hai**: The first bar chart shows…, **while the second** compares…",
        "**Overview: mỗi biểu đồ một ý** (2 câu). Không cần cố nối hai hình bằng nguyên nhân — Task 1 chỉ mô tả.",
        "**Chia thân bài**: đo hai thứ khác nhau → **mỗi khổ một biểu đồ** (dễ nhất). Cùng thứ, hai năm / hai nơi → chia theo **nhóm tăng / nhóm giảm** như bảng ở Ngày 4.",
        "Có cột **Total** → nói **tổng trước**, rồi mới vào từng nhóm. Một nhóm **không có số liệu** ở một hình → nói rõ một lần (no data is given for…), đừng bịa.",
      ],
    },

    { t: "h", text: "4. Bài mẫu band 6.5–7 — đối chiếu từng con số" },
    {
      t: "p",
      text: "**Đề:** The bar chart below shows the percentage of commuters in three cities who travelled to work by car, bus, metro or train, and bicycle in 2024. Summarise the information by selecting and reporting the main features, and make comparisons where relevant. **Write at least 150 words.**",
    },
    {
      t: "figure",
      fig: {
        kind: "bar",
        title: "Percentage of commuters using four modes of transport in three cities, 2024",
        note: "Số liệu tự đặt cho bài luyện. Các cách đi khác (đi bộ, taxi…) không thể hiện nên mỗi thành phố cộng không đủ 100%.",
        unit: "%",
        categories: ["Car", "Bus", "Metro / train", "Bicycle"],
        series: [
          { name: "Ashford", values: [52, 20, 8, 12] },
          { name: "Bexley", values: [28, 35, 22, 10] },
          { name: "Carlton", values: [15, 25, 40, 15] },
        ],
      },
    },
    {
      t: "sodo",
      kind: "mindmap",
      title: "Đọc hình trong 2 phút — tìm gì?",
      center: "**3 thành phố × 4 phương tiện**",
      branches: [
        { label: "Cao nhất cả hình", items: ["Car · Ashford 52%"] },
        { label: "Thấp nhất cả hình", items: ["Metro · Ashford 8%"] },
        { label: "Mỗi thành phố chuộng gì?", items: ["Ashford → car", "Bexley → bus (35%)", "Carlton → metro (40%)"] },
        { label: "Điểm giống nhau", items: ["Bicycle: 10–15% ở cả ba"] },
      ],
      caption: "Overview lấy từ nhánh 3 + nhánh 4. Hai thân bài: Body 1 = ô tô (và Ashford), Body 2 = phương tiện công cộng + xe đạp.",
    },
    {
      t: "examples",
      items: [
        { en: "[Introduction] The bar chart compares the proportion of commuters in three cities, Ashford, Bexley and Carlton, who travelled to work by car, bus, metro or train, and bicycle in 2024.", vi: "[Mở bài] Biểu đồ cột so sánh tỉ lệ người đi làm ở ba thành phố Ashford, Bexley và Carlton dùng ô tô, xe buýt, metro hoặc tàu, và xe đạp để đi làm năm 2024." },
        { en: "[Overview] Overall, the car was by far the most common way to get to work in Ashford, whereas public transport was more popular in the other two cities, especially the metro in Carlton. Cycling showed the least variation, with similar, low figures in all three places.", vi: "[Tổng quan] Nhìn chung, ô tô là cách đi làm phổ biến nhất rõ rệt ở Ashford, trong khi giao thông công cộng được chuộng hơn ở hai thành phố còn lại, đặc biệt là metro ở Carlton. Xe đạp ít chênh lệch nhất, với số liệu thấp và gần nhau ở cả ba nơi." },
        { en: "[Body 1] In Ashford, just over half of commuters (52%) drove to work, which was almost twice as high as the figure for Bexley (28%) and more than three times that for Carlton (15%). By contrast, only 8% of people in Ashford used the metro or train, the lowest figure in the chart.", vi: "[Thân bài 1] Ở Ashford, hơn một nửa số người đi làm (52%) lái ô tô, cao gần gấp đôi Bexley (28%) và hơn gấp ba Carlton (15%). Ngược lại, chỉ 8% người ở Ashford đi metro hoặc tàu, con số thấp nhất trong biểu đồ." },
        { en: "[Body 2] Public transport played a much bigger role in Bexley and Carlton. The bus was the most popular choice in Bexley, at 35%, compared with 25% in Carlton and 20% in Ashford. Carlton, however, had the highest proportion of metro and train users, at 40%, nearly double the Bexley figure of 22%. As for cycling, between 10% and 15% of commuters rode a bicycle in each city, with Carlton slightly ahead of Ashford and Bexley.", vi: "[Thân bài 2] Giao thông công cộng đóng vai trò lớn hơn nhiều ở Bexley và Carlton. Xe buýt là lựa chọn phổ biến nhất ở Bexley, 35%, so với 25% ở Carlton và 20% ở Ashford. Tuy nhiên, Carlton có tỉ lệ người đi metro và tàu cao nhất, 40%, gần gấp đôi con số 22% của Bexley. Về xe đạp, mỗi thành phố có từ 10% đến 15% người đi làm đạp xe, Carlton nhỉnh hơn Ashford và Bexley một chút." },
      ],
    },
    {
      t: "table",
      caption: "Đối chiếu số liệu bài mẫu với hình (199 từ)",
      head: ["Câu trong bài", "Số trên hình", "Đúng?"],
      rows: [
        ["just over half (52%) drove — Ashford", "Car · Ashford 52", "✓ 52 > 50"],
        ["almost twice as high as Bexley (28%)", "28 × 2 = 56 ≈ 52", "✓ “almost” (gần, chưa tới)"],
        ["more than three times Carlton (15%)", "15 × 3 = 45 < 52", "✓"],
        ["only 8% … the lowest figure in the chart", "nhỏ nhất trong 12 số là 8", "✓"],
        ["bus most popular in Bexley, 35% · 25% Carlton · 20% Ashford", "35 · 25 · 20; ở Bexley 35 > 28 > 22 > 10", "✓"],
        ["Carlton metro 40%, nearly double Bexley 22%", "22 × 2 = 44 ≈ 40", "✓ “nearly”"],
        ["cycling 10–15%, Carlton slightly ahead", "12 · 10 · 15", "✓"],
      ],
    },
    {
      t: "table",
      caption: "Vì sao bài mẫu đạt band 6.5–7",
      head: ["Tiêu chí", "Điểm mạnh", "Ghi chú"],
      rows: [
        ["**TA** — hoàn thành yêu cầu", "Overview rõ (2 ý, không số); chọn số **nổi bật** (cao nhất, thấp nhất, mỗi thành phố một xu hướng) thay vì kể hết", "Không nêu ý kiến, không giải thích nguyên nhân — đúng yêu cầu Task 1"],
        ["**CC** — mạch lạc", "Gom nhóm theo **ô tô** / **công cộng + xe đạp**; từ nối đúng vai: Overall · By contrast · however · As for", "Mỗi đoạn một ý trung tâm"],
        ["**LR** — từ vựng", "proportion · commuters · by far the most common · variation · played a bigger role", "Paraphrase: shows → **compares**; percentage → **proportion**"],
        ["**GRA** — ngữ pháp", "So sánh hơn / nhất / twice as… as / nearly double; mệnh đề **which** và **whereas**; quá khứ đơn nhất quán", "Câu dài có kiểm soát, gần như không lỗi"],
      ],
    },
    {
      t: "dialogue",
      title: "Đối chiếu: một bài band 4.5 (trích đoạn)",
      lines: [
        { who: "Bài yếu", role: "candidate", text: "The chart show the percentage of transport in three city. In Ashford car is 52%, bus is 20%, metro is 8% and bicycle is 12%. In Bexley car is 28%, bus is 35%, metro is 22% and bicycle is 10%. In Carlton car is 15%, bus is 25%, metro is 40% and bicycle is 15%. Carlton metro is more higher than Ashford. In conclusion I think Carlton is the best city because people use metro.", vi: "Biểu đồ cho thấy phần trăm phương tiện ở ba thành phố…" },
      ],
    },
    {
      t: "note",
      title: "Bài band 4.5 mất điểm ở đâu",
      items: [
        "**TA**: **không có overview**; kể đủ 12 số theo thứ tự mà không chọn lọc; kết bài nêu **ý kiến cá nhân** (Task 1 không được).",
        "**CC**: ba câu cùng một khuôn “In X car is…”; không từ nối so sánh.",
        "**LR**: “percentage of transport” sai nghĩa (phần trăm **người đi làm** dùng phương tiện); lặp “is”.",
        "**GRA**: ~~The chart show~~ (thiếu -s) · ~~three city~~ (thiếu số nhiều) · ~~more higher~~ · dùng hiện tại cho năm 2024 đã qua.",
        "Chỉ khoảng **80 từ** — dưới 150 từ bị trừ điểm TA.",
      ],
    },

    { t: "h", text: "5. Tự viết một bài (AI chấm)" },
    {
      t: "figure",
      fig: {
        kind: "bar",
        title: "Average one-way journey time to work (minutes) by four modes of transport in two cities, 2023",
        note: "Số liệu tự đặt cho bài luyện.",
        unit: "minutes",
        categories: ["Car", "Bus", "Metro", "Bicycle"],
        series: [
          { name: "Lindon", values: [35, 48, 30, 22] },
          { name: "Marston", values: [50, 42, 25, 18] },
        ],
      },
    },
    {
      t: "essay",
      id: "t2d8-viet-bai",
      task: "Task 1",
      prompt: "The bar chart above shows the average time, in minutes, that commuters in two cities, Lindon and Marston, spent travelling to work by car, bus, metro and bicycle in 2023. Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words. (Data — Lindon: car 35, bus 48, metro 30, bicycle 22 · Marston: car 50, bus 42, metro 25, bicycle 18.)",
      minWords: 150,
      tips: [
        "Mở bài: shows → **compares**; the average time → **how long, on average,**; commuters → **people travelling to work**.",
        "Overview gợi ý: **xe đạp nhanh nhất** ở cả hai thành phố; chậm nhất **khác nhau** — xe buýt ở Lindon, ô tô ở Marston.",
        "Body 1: **ô tô và xe buýt** (hai phương tiện chậm, đổi vị trí giữa hai thành phố: car Marston 50 vs Lindon 35). Body 2: **metro và xe đạp** (nhanh hơn, Marston nhanh hơn Lindon một chút).",
        "So sánh có số: 50 ≈ **nearly 1.5 times** 35? (52,5) — an toàn hơn: **15 minutes longer**. 48 vs 42 → **6 minutes longer**. Nói **chênh bao nhiêu phút** dễ đúng hơn “gấp mấy lần”.",
        "Quá khứ đơn (2023). Soát lại cả 8 con số trước khi nộp.",
      ],
    },
  ],
};

/* ─────────────────────────── Bài tập ─────────────────────────── */

const T2D8_BAI_TAP: Lesson = {
  id: "t2d8-bai-tap",
  kind: "homework",
  title: "Bài tập Ngày 8",
  goal: "Tự kiểm tra Ngày 8: 8 câu từ vựng giao thông, 6 câu họ từ, 6 câu Short-answer trên đoạn đọc mới, 5 câu paraphrase, 6 câu dịch so sánh Task 1, 2 câu chọn số chính xác / xấp xỉ — 33 câu có đáp án và lời giải.",
  minutes: 40,
  blocks: [
    {
      t: "recap",
      title: "Bài tập hôm nay",
      items: [
        "**Phần I** (8 câu): điền từ / cụm giao thông · **Phần II** (6 câu): chọn loại từ.",
        "**Phần III** (6 câu): Short-answer trên đoạn đọc ~140 từ — đúng giới hạn từ.",
        "**Phần IV** (5 câu): nhận paraphrase · **Phần V** (6 câu): dịch câu so sánh Task 1.",
        "**Phần VI** (2 câu): khi nào ghi đúng số, khi nào dùng about / just under.",
      ],
    },
    {
      t: "sodo",
      kind: "mindmap",
      title: "Ngày 8 trong một hình",
      center: "**Ngày 8**",
      branches: [
        { label: "Từ vựng: giao thông & thành phố", items: ["congestion · fare · suburb · reliable", "ease congestion · run on · get around", "họ từ: congest → congestion → congested", "by bus (không mạo từ) · heavy traffic"] },
        { label: "Đọc: Short-answer", items: ["chép đúng chữ, đúng số từ", "Wh- → loại đáp án", "paraphrase: đồng nghĩa · loại từ · cấu trúc"] },
        { label: "Viết: bar chart", items: ["overview 2 ý, không số", "gom nhóm thân bài", "higher than · the highest · whereas · compared with", "nhân thử trước khi viết twice"] },
      ],
    },

    { t: "h", text: "Phần I — Từ vựng giao thông (8 câu)" },
    {
      t: "quiz",
      id: "t2d8-bt-tu",
      title: "Phần I — Điền MỘT từ (8 câu)",
      kind: "fill",
      items: [
        { q: "(1) Electric buses help to cut carbon ___. (khí thải)", answers: ["emissions"] },
        { q: "(2) The ___ from my house to the airport costs about 200,000 dong by taxi. (giá vé / cước)", answers: ["fare"] },
        { q: "(3) This bus ___ goes past the university and the main hospital. (tuyến)", answers: ["route"] },
        { q: "(4) The government plans to spend billions on new transport ___. (hạ tầng)", answers: ["infrastructure"] },
        { q: "(5) We set ___ at 5 a.m. to avoid the traffic.", answers: ["off"] },
        { q: "(6) My mum drops me ___ at school every morning.", answers: ["off"] },
        { q: "(7) I usually go to work ___ bus. (giới từ)", answers: ["by"] },
        { q: "(8) Trains are badly ___ during the rush hour — there are too many passengers. (quá đông)", answers: ["overcrowded", "crowded"] },
      ],
    },

    { t: "h", text: "Phần II — Họ từ (6 câu)" },
    {
      t: "mcq",
      id: "t2d8-bt-ho-tu",
      title: "Phần II — Chọn dạng đúng (6 câu)",
      items: [
        { q: "(1) Air ___ is a serious problem in many Asian cities.", options: ["pollute", "polluted", "pollution"], correct: 2, why: "**Air** là danh từ đứng trước bổ nghĩa cho danh từ chính; chỗ trống là **danh từ** làm chủ ngữ của **is**: air pollution." },
        { q: "(2) Old buses are often ___, so people prefer motorbikes.", options: ["reliability", "unreliable", "rely"], correct: 1, why: "Sau **are often** cần **tính từ**: unreliable (không đáng tin cậy)." },
        { q: "(3) The ___ of housing is a major concern for young families.", options: ["affordability", "affordable", "afford"], correct: 0, why: "Sau **The … of** cần **danh từ**: affordability." },
        { q: "(4) There is serious ___ on the main roads at 8 a.m.", options: ["congestion", "congest", "congested"], correct: 0, why: "Sau **serious** (tính từ) cần **danh từ**: congestion." },
        { q: "(5) Ho Chi Minh City is very densely ___.", options: ["popular", "population", "populated"], correct: 2, why: "Cụm cố định **densely populated** (đông dân)." },
        { q: "(6) The new stations are ___ to wheelchair users.", options: ["access", "accessible", "accessibility"], correct: 1, why: "Sau **are** cần **tính từ**: accessible." },
      ],
    },

    { t: "h", text: "Phần III — Short-answer (6 câu)" },
    {
      t: "passage",
      title: "A city that pays people to cycle",
      paras: [
        { label: "A", text: "In 2019, the small city of Westvale introduced an unusual scheme to reduce traffic in its centre. Instead of charging drivers, the council decided to reward cyclists. Every resident who cycled to work received a payment of 25 pence for each kilometre, up to a maximum of 30 pounds a month. To prove their journeys, cyclists used a free smartphone app that recorded their routes." },
        { label: "B", text: "In the first year, about 4,000 people joined the scheme. A study by the local university found that most of them had previously travelled by car, while the rest had used buses. Shop owners, who had first been worried, later reported that cyclists visited their shops more often than drivers, although they spent less on each visit. The council now plans to build a new bridge for bicycles over the river, which is due to open in 2027." },
      ],
    },
    {
      t: "quiz",
      id: "t2d8-bt-cau-ngan",
      title: "Phần III — Answer with NO MORE THAN THREE WORDS AND/OR A NUMBER (6 câu)",
      kind: "fill",
      items: [
        { q: "(1) How much did cyclists receive for every kilometre?", answers: ["25 pence", "twenty-five pence", "25p"] },
        { q: "(2) What was the highest amount a cyclist could get each month?", answers: ["30 pounds", "thirty pounds", "£30"] },
        { q: "(3) What did cyclists use to record their routes?", answers: ["smartphone app", "a smartphone app", "free smartphone app", "an app", "app"] },
        { q: "(4) Who carried out a study of the scheme?", answers: ["local university", "the local university"] },
        { q: "(5) Which group visited shops more often?", answers: ["cyclists", "the cyclists"] },
        { q: "(6) When is the new bridge for bicycles expected to open?", answers: ["2027", "in 2027"] },
      ],
    },
    {
      t: "note",
      title: "Lời giải Phần III",
      items: [
        "**(1) 25 pence** — “a payment of **25 pence for each kilometre**” ← “for **every** kilometre” (①).",
        "**(2) 30 pounds** — “**up to a maximum of** 30 pounds a month” ← “the **highest amount**” (①). Bẫy: không lấy 25.",
        "**(3) (a free) smartphone app** — “used a free smartphone app that **recorded** their routes”. “a free smartphone app” = 4 từ ⇒ **vượt** nếu tính cả “a”; an toàn nhất: **smartphone app**.",
        "**(4) (the) local university** — “**A study by** the local university” ← “Who **carried out a study**” (③ cụm danh từ → động từ).",
        "**(5) cyclists** — “cyclists visited their shops **more often** than drivers”. Bẫy: drivers **chi nhiều hơn** mỗi lần, nhưng **ít đến hơn**.",
        "**(6) 2027** — “**is due to open** in 2027” ← “**expected to open**” (①). 2019 là năm bắt đầu chương trình.",
      ],
    },

    { t: "h", text: "Phần IV — Paraphrase (5 câu)" },
    {
      t: "mcq",
      id: "t2d8-bt-paraphrase",
      title: "Phần IV — Câu nào cùng nghĩa? (5 câu)",
      items: [
        { q: "(1) “The council decided to reward cyclists.”", options: ["Cyclists were given money by the council.", "Cyclists had to pay the council.", "The council stopped people cycling."], correct: 0, why: "**reward** = trao thưởng → **were given money** (③ chủ động → bị động)." },
        { q: "(2) “Most of them had previously travelled by car.”", options: ["Most of them still drive.", "The majority used to drive.", "Few of them had cars."], correct: 1, why: "**Most** = **the majority**; **had previously travelled by car** = **used to drive** (①)." },
        { q: "(3) “Shop owners had first been worried.”", options: ["Shop owners were never concerned.", "Shop owners are worried now.", "Shop owners were concerned at the beginning."], correct: 2, why: "**worried** ≈ **concerned**; **first** = **at the beginning** (①)." },
        { q: "(4) “Cyclists spent less on each visit.”", options: ["Each visit by a cyclist was less expensive for them.", "Cyclists spent more money.", "Cyclists visited less often."], correct: 0, why: "Chi **ít hơn mỗi lần** = mỗi lần đến **tốn ít tiền hơn** (③). Câu C nói về **số lần**, sai ý." },
        { q: "(5) “The bridge is due to open in 2027.”", options: ["The bridge opened in 2027.", "The opening of the bridge is planned for 2027.", "The bridge will close in 2027."], correct: 1, why: "**is due to open** = **opening is planned** (② động từ → danh từ + ①)." },
      ],
    },

    { t: "h", text: "Phần V — Dịch câu so sánh Task 1 (6 câu)" },
    {
      t: "quiz",
      id: "t2d8-bt-dich",
      title: "Phần V — Dịch sang tiếng Anh (6 câu)",
      kind: "translate",
      grammar: "The figure for A was higher than that for B · the highest / the lowest · twice as high as · whereas · compared with · just over / nearly",
      items: [
        { q: "Biểu đồ cột so sánh tỉ lệ người đi làm bằng xe buýt ở bốn thành phố.", hint: "The bar chart compares, the proportion of commuters, who travelled by bus / who took the bus, in four cities", answers: ["The bar chart compares the proportion of commuters who travelled by bus in four cities.", "The bar chart compares the proportion of commuters who took the bus in four cities.", "The bar chart compares the percentage of commuters who travelled by bus in four cities.", "The bar chart compares the proportion of people who went to work by bus in four cities.", "The bar chart compares the proportion of commuters travelling by bus in four cities.", "The bar chart compares the percentage of people who took the bus to work in four cities."] },
        { q: "Ô tô là phương tiện phổ biến nhất ở Ashford.", hint: "The car, was the most popular, mode of transport / form of transport, in Ashford", answers: ["The car was the most popular mode of transport in Ashford.", "The car was the most popular form of transport in Ashford.", "The car was the most popular means of transport in Ashford.", "Cars were the most popular mode of transport in Ashford.", "The car was the most popular way to travel in Ashford.", "The car was the most popular way of getting to work in Ashford."] },
        { q: "Số liệu của Carlton gần gấp đôi của Bexley.", hint: "The figure for Carlton, was nearly twice as high as / nearly double, that for Bexley", answers: ["The figure for Carlton was nearly twice as high as that for Bexley.", "The figure for Carlton was nearly double that for Bexley.", "The figure for Carlton was almost twice as high as that for Bexley.", "The figure for Carlton was almost double that for Bexley.", "The figure for Carlton was nearly twice that for Bexley.", "The figure for Carlton was almost twice that for Bexley."] },
        { q: "Ngược lại, chỉ 10% người dân đạp xe.", hint: "By contrast, only 10% of people / residents, cycled", answers: ["By contrast, only 10% of people cycled.", "In contrast, only 10% of people cycled.", "By contrast, only 10% of residents cycled.", "By contrast, only 10% of people rode a bicycle.", "By contrast, only 10% of the population cycled.", "In contrast, only 10% of residents cycled."] },
        { q: "Xe buýt được 35% người đi làm sử dụng, so với 20% ở Ashford.", hint: "The bus was used by 35% of commuters, compared with 20% in Ashford", answers: ["The bus was used by 35% of commuters, compared with 20% in Ashford.", "The bus was used by 35% of commuters, compared to 20% in Ashford.", "Buses were used by 35% of commuters, compared with 20% in Ashford.", "35% of commuters used the bus, compared with 20% in Ashford.", "The bus was used by 35% of commuters compared with 20% in Ashford."] },
        { q: "Hơn một nửa số người đi làm lái ô tô.", hint: "Just over half of commuters, drove (to work)", answers: ["Just over half of commuters drove.", "Just over half of commuters drove to work.", "Just over half of all commuters drove to work.", "Slightly more than half of commuters drove to work.", "Just over half of the commuters drove to work.", "More than half of commuters drove to work.", "More than half of commuters drove.", "Over half of commuters drove.", "Over half of commuters drove to work."] },
      ],
    },

    { t: "h", text: "Phần VI — Số chính xác hay số xấp xỉ? (2 câu)" },
    {
      t: "mcq",
      id: "t2d8-bt-so-xap-xi",
      title: "Phần VI — Chọn câu viết số đúng cách (2 câu)",
      items: [
        {
          q: "Biểu đồ cột KHÔNG in số trên cột; cột của Bexley nằm hơi dưới vạch 30 trên trục (%). Câu nào tốt nhất?",
          options: [
            "Exactly 29.3% of commuters in Bexley drove to work.",
            "Just under 30% of commuters in Bexley drove to work.",
            "30% of commuters in Bexley drove to work.",
          ],
          correct: 1,
          why: "Số phải **đọc theo vạch** → dùng **just under / about / around / nearly**. A bịa độ chính xác không có trên hình; C nói chắc chắn một con số bạn không đọc được.",
        },
        {
          q: "Biểu đồ tròn / bảng IN SẴN số: Ashford — car 52%. Câu nào tốt nhất?",
          options: [
            "Around 52% of commuters in Ashford drove to work.",
            "About half or maybe more of commuters in Ashford drove.",
            "52% of commuters in Ashford drove to work, just over half.",
          ],
          correct: 2,
          why: "Số đã in sẵn → **ghi đúng số**, không thêm around / about (thêm vào nghe như bạn không đọc kỹ). Được **thêm** cách nói phân số (just over half) bên cạnh để paraphrase.",
        },
      ],
    },
  ],
};

export const NGAY_8: Lesson[] = [T2D8_TU_VUNG, T2D8_DOC, T2D8_VIET, T2D8_BAI_TAP];
