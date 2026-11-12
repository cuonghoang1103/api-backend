/**
 * Tập 2 · Ngày 12 — Từ vựng: Thực phẩm & nông nghiệp [VC12] · Đọc: Matching headings [R12] · Viết: Task 1
 * pie chart (một biểu đồ tròn và hai biểu đồ tròn) [W10] · Bài tập · ✅ Kiểm tra chặng 2 của Tập 2 (Ngày 7–12).
 * 🔊 (đề cương không ghi âm cho N12) — chọn từ bị “nuốt” âm tiết (vegetable, chocolate, comfortable…), rất
 * hay gặp trong chủ đề ăn uống.
 *
 * Soạn 12/11/2026 theo docs/ielts-lo-trinh-0-8.md mục 3.2 (hàng N12). Đề 2 (🖥️ thi-may, band 4.5) do phiên
 * khác soạn — bài này chỉ trỏ tới. Bài đọc về cây lúa dùng hiểu biết phổ biến (lúa là lương thực chính của hơn
 * nửa dân số thế giới, phần lớn trồng ở châu Á; ruộng ngập nước khống chế cỏ dại; “Cách mạng xanh” thập niên
 * 1960 với giống IR8; ruộng ngập sinh khí mê-tan; kỹ thuật tưới ướt – khô xen kẽ; xâm nhập mặn ở đồng bằng)
 * và tránh số liệu không chắc. Mọi số liệu biểu đồ tự đặt, bài mẫu đã đối chiếu từng con số.
 * Bài kiểm tra chặng viết mới hoàn toàn (ngữ liệu khác bài học), id `t2d12-kt-…`.
 */
import type { Lesson } from '../data';

/* ─────────────────────────── Từ vựng ─────────────────────────── */

const T2D12_TU_VUNG: Lesson = {
  id: "t2d12-tu-vung",
  kind: "vocab",
  title: "Từ vựng: Thực phẩm & nông nghiệp",
  goal: "Dùng đúng 20 từ + 10 cụm từ về sản xuất thực phẩm và nông nghiệp (crop, livestock, pesticide, food security, locally grown, go off…), 5 họ từ (produce → product → production…) và 4 câu mẫu cho Task 2 — đẩy Lexical Resource band 5 ở chủ đề Food & agriculture; thêm 13 từ ăn uống đời thường (dish, recipe, takeaway, portion…) để trả lời Part 1; đọc đúng số âm tiết của vegetable, chocolate, comfortable.",
  minutes: 60,
  blocks: [
    {
      t: "recap",
      title: "Bài này học gì · đẩy band nào",
      items: [
        "Chủ đề **Food & agriculture** — Task 2 hay hỏi: thực phẩm nhập khẩu vs địa phương, thực phẩm hữu cơ, lãng phí thức ăn, nông dân rời làng lên phố; Part 1 hỏi món ăn, nấu nướng.",
        "**20 từ**: crop · livestock · fertiliser · pesticide · organic · staple food · food security · drought · perishable… và **10 cụm**: grow crops · raise livestock · locally grown · go off · go to waste…",
        "**5 họ từ**: produce (v) → **produce** (n: nông sản) → product → production → productive · agriculture → agricultural…",
        "Phát âm: những từ **viết dài, đọc ngắn** — vegetable /ˈvedʒtəbl/ (3 âm tiết, không phải 4), chocolate, comfortable, interesting.",
        "Bài đọc hôm nay (cây lúa) và bài viết (chi tiêu cho thực phẩm) dùng lại phần lớn từ này.",
        "**Mục 6 (thêm)**: 13 từ ăn uống đời thường cho **Speaking Part 1** — dish · ingredient · cuisine · recipe · takeaway · portion · eat out…",
      ],
    },
    {
      t: "hinh",
      title: "Nhìn hình — nói tên",
      items: [
        { anh: "sheaf-of-rice", w: "rice crop", ro: "/raɪs krɒp/", vi: "vụ lúa, cây lúa" },
        { anh: "tractor", w: "tractor", ro: "/ˈtræktə(r)/", vi: "máy kéo" },
        { anh: "farmer", w: "farmer", ro: "/ˈfɑːmə(r)/", vi: "nông dân" },
        { anh: "cow", w: "cattle", ro: "/ˈkætl/", vi: "gia súc (bò) — luôn số nhiều" },
        { anh: "ear-of-corn", w: "maize / corn", ro: "/meɪz/ · /kɔːn/", vi: "ngô" },
        { anh: "seedling", w: "seedling", ro: "/ˈsiːdlɪŋ/", vi: "cây con, mạ" },
        { anh: "droplet", w: "irrigation", ro: "/ˌɪrɪˈɡeɪʃn/", vi: "tưới tiêu" },
        { anh: "leafy-green", w: "greens", ro: "/ɡriːnz/", vi: "rau lá xanh" },
        { anh: "canned-food", w: "processed food", ro: "/ˌprəʊsest ˈfuːd/", vi: "thực phẩm chế biến sẵn" },
        { anh: "shopping-cart", w: "groceries", ro: "/ˈɡrəʊsəriz/", vi: "thực phẩm, hàng tạp hoá mua về" },
      ],
    },
    {
      t: "sodo",
      kind: "flow",
      title: "Từ ruộng đến bàn ăn — nơi các từ hôm nay xuất hiện",
      steps: [
        { label: "Trồng trọt · chăn nuôi", sub: "grow **crops** · raise **livestock** · **fertiliser** · **pesticide** · **irrigation**" },
        { label: "Rủi ro", sub: "**drought** · flood · poor soil · pests" },
        { label: "Chế biến · vận chuyển", sub: "**processed** food · **imported** · **food miles** · **perishable**" },
        { label: "Mua · ăn", sub: "**locally grown** · **organic** · **seasonal** · **staple food**" },
        { label: "Sau bữa ăn", sub: "**food waste** · **go off** · **go to waste**" },
      ],
    },

    { t: "h", text: "1. Hai mươi từ cốt lõi" },
    {
      t: "vocab",
      items: [
        { w: "crop", pos: "n", ipa: "/krɒp/", vi: "cây trồng; vụ mùa", ex: "Rice is the main crop in the Mekong Delta.", exVi: "Lúa là cây trồng chính ở Đồng bằng sông Cửu Long.", more: "Cụm: **grow crops** · **a good / poor crop** (vụ được / mất mùa) · **crop failure**." },
        { w: "livestock", pos: "n (U, pl)", ipa: "/ˈlaɪvstɒk/", vi: "gia súc, gia cầm (vật nuôi ở trang trại)", ex: "Many families in the hills raise livestock such as pigs and chickens.", exVi: "Nhiều gia đình vùng đồi chăn nuôi gia súc gia cầm như lợn và gà.", more: "Không thêm -s. Cụm: **raise / keep livestock**." },
        { w: "fertiliser", pos: "n", ipa: "/ˈfɜːtəlaɪzə(r)/", vi: "phân bón", ex: "Too much chemical fertiliser can damage the soil.", exVi: "Quá nhiều phân bón hoá học có thể làm hại đất.", more: "Mỹ viết **fertilizer**. Họ: **fertile** (adj: màu mỡ) · **fertility**." },
        { w: "pesticide", pos: "n", ipa: "/ˈpestɪsaɪd/", vi: "thuốc trừ sâu", ex: "Organic farmers do not use chemical pesticides.", exVi: "Nông dân hữu cơ không dùng thuốc trừ sâu hoá học.", more: "Gốc **pest** (sâu bệnh, loài gây hại)." },
        { w: "organic", pos: "adj", ipa: "/ɔːˈɡænɪk/", vi: "hữu cơ (không hoá chất tổng hợp)", ex: "Organic vegetables are usually more expensive.", exVi: "Rau hữu cơ thường đắt hơn.", more: "Cụm: **organic food / farming / produce**." },
        { w: "staple food", pos: "n", ipa: "/ˈsteɪpl fuːd/", vi: "lương thực chính", ex: "Rice is the staple food of most Asian countries.", exVi: "Gạo là lương thực chính của hầu hết các nước châu Á.", more: "Cũng nói **a staple** (n) · **staple crops**." },
        { w: "food security", pos: "n (U)", ipa: "/ˈfuːd sɪˌkjʊərəti/", vi: "an ninh lương thực (đủ lương thực cho mọi người)", ex: "Climate change is a major threat to food security.", exVi: "Biến đổi khí hậu là mối đe doạ lớn với an ninh lương thực.", more: "Khác **food safety** (an toàn thực phẩm — không ngộ độc)." },
        { w: "food waste", pos: "n (U)", ipa: "/ˈfuːd weɪst/", vi: "thức ăn bị lãng phí, bỏ đi", ex: "Supermarkets are trying to reduce food waste.", exVi: "Các siêu thị đang cố giảm lãng phí thức ăn.", more: "Tính từ **wasteful** (lãng phí). Cụm: **cut / reduce food waste**." },
        { w: "irrigation", pos: "n (U)", ipa: "/ˌɪrɪˈɡeɪʃn/", vi: "sự tưới tiêu", ex: "Without irrigation, farmers depend completely on the rain.", exVi: "Không có tưới tiêu, nông dân phụ thuộc hoàn toàn vào mưa.", more: "Động từ **irrigate** /ˈɪrɪɡeɪt/." },
        { w: "drought", pos: "n", ipa: "/draʊt/", vi: "hạn hán", ex: "The drought destroyed half of the coffee crop.", exVi: "Hạn hán phá huỷ một nửa vụ cà phê.", more: "Đọc /draʊt/ — vần với **out**; đừng đọc thành “đờ-rốt”." },
        { w: "soil", pos: "n (U)", ipa: "/sɔɪl/", vi: "đất (trồng trọt)", ex: "The soil here is rich and fertile.", exVi: "Đất ở đây giàu dinh dưỡng và màu mỡ.", more: "Khác **land** (đất đai, mảnh đất) và **ground** (mặt đất)." },
        { w: "agricultural", pos: "adj", ipa: "/ˌæɡrɪˈkʌltʃərəl/", vi: "thuộc nông nghiệp", ex: "Vietnam is a major exporter of agricultural products.", exVi: "Việt Nam là nước xuất khẩu nông sản lớn.", more: "Danh từ **agriculture** /ˈæɡrɪkʌltʃə(r)/ — trọng âm **đổi chỗ**: **AG**riculture → agri**CUL**tural." },
        { w: "genetically modified (GM)", pos: "adj", ipa: "/dʒəˌnetɪkli ˈmɒdɪfaɪd/", vi: "biến đổi gen", ex: "Some people refuse to eat genetically modified food.", exVi: "Một số người không chịu ăn thực phẩm biến đổi gen.", more: "Viết tắt **GM food / GMOs**." },
        { w: "self-sufficient", pos: "adj", ipa: "/ˌself səˈfɪʃnt/", vi: "tự cung tự cấp", ex: "The country is self-sufficient in rice.", exVi: "Đất nước tự túc được gạo.", more: "**self-sufficient in** sth · danh từ **self-sufficiency**." },
        { w: "imported", pos: "adj", ipa: "/ɪmˈpɔːtɪd/", vi: "nhập khẩu", ex: "Imported fruit is often more expensive than local fruit.", exVi: "Trái cây nhập khẩu thường đắt hơn trái cây địa phương.", more: "**import** (n) /ˈɪmpɔːt/ · (v) /ɪmˈpɔːt/ — đổi trọng âm như Ngày 11. Đối lập **exported**." },
        { w: "perishable", pos: "adj", ipa: "/ˈperɪʃəbl/", vi: "dễ hỏng, mau ôi (thực phẩm)", ex: "Fish and milk are perishable, so they must be kept cold.", exVi: "Cá và sữa dễ hỏng nên phải giữ lạnh.", more: "Đối lập **non-perishable** (gạo, đồ hộp)." },
        { w: "shelf life", pos: "n", ipa: "/ˈʃelf laɪf/", vi: "hạn sử dụng (thời gian để được)", ex: "Processed food usually has a long shelf life.", exVi: "Thực phẩm chế biến thường để được lâu." },
        { w: "seasonal", pos: "adj", ipa: "/ˈsiːzənl/", vi: "theo mùa", ex: "Seasonal fruit is cheaper and tastes better.", exVi: "Trái cây theo mùa rẻ hơn và ngon hơn." },
        { w: "paddy field", pos: "n", ipa: "/ˈpædi fiːld/", vi: "ruộng lúa (ngập nước)", ex: "The road runs between green paddy fields.", exVi: "Con đường chạy giữa những ruộng lúa xanh.", more: "Cũng nói **rice paddy**." },
        { w: "smallholder", pos: "n", ipa: "/ˈsmɔːlhəʊldə(r)/", vi: "nông hộ nhỏ", ex: "Most coffee in the region is grown by smallholders.", exVi: "Phần lớn cà phê trong vùng do các nông hộ nhỏ trồng.", more: "Cụm Task 2 hay gặp: **smallholder farmers**." },
      ],
    },

    { t: "h", text: "2. Mười cụm từ và năm họ từ" },
    {
      t: "vocab",
      items: [
        { w: "grow crops", pos: "phr", ipa: "/ɡrəʊ krɒps/", vi: "trồng cây (nông nghiệp)", ex: "Farmers here grow crops such as rice and maize.", exVi: "Nông dân ở đây trồng lúa và ngô." },
        { w: "raise livestock", pos: "phr", ipa: "/reɪz ˈlaɪvstɒk/", vi: "chăn nuôi", ex: "It takes a lot of land and water to raise livestock.", exVi: "Chăn nuôi cần rất nhiều đất và nước." },
        { w: "feed a growing population", pos: "phr", ipa: "/fiːd ə ˈɡrəʊɪŋ ˌpɒpjuˈleɪʃn/", vi: "nuôi sống dân số ngày càng tăng", ex: "The world must produce more food to feed a growing population.", exVi: "Thế giới phải sản xuất nhiều lương thực hơn để nuôi dân số ngày càng tăng.", more: "Cụm “đắt” cho Task 2 về nông nghiệp, GM food." },
        { w: "locally grown", pos: "adj", ipa: "/ˈləʊkəli ɡrəʊn/", vi: "trồng tại địa phương", ex: "The restaurant only uses locally grown vegetables.", exVi: "Nhà hàng chỉ dùng rau trồng tại địa phương.", more: "Danh từ: **local produce** /ˈprɒdjuːs/ (nông sản địa phương)." },
        { w: "food miles", pos: "n (pl)", ipa: "/ˈfuːd maɪlz/", vi: "quãng đường thực phẩm đi từ nơi sản xuất đến người ăn", ex: "Buying local food reduces food miles.", exVi: "Mua thực phẩm địa phương giảm quãng đường vận chuyển." },
        { w: "go off", pos: "phr v", ipa: "/ɡəʊ ˈɒf/", vi: "(thức ăn) bị hỏng, ôi", ex: "Milk goes off quickly in hot weather.", exVi: "Sữa hỏng nhanh khi trời nóng.", more: "Nghĩa khác: chuông báo thức **goes off** (reo)." },
        { w: "go to waste", pos: "phr", ipa: "/ɡəʊ tə ˈweɪst/", vi: "bị bỏ phí", ex: "A lot of the food we buy goes to waste.", exVi: "Rất nhiều thức ăn chúng ta mua bị bỏ phí." },
        { w: "stock up on", pos: "phr v", ipa: "/stɒk ˈʌp ɒn/", vi: "tích trữ, mua nhiều để dành", ex: "People stock up on rice before a storm.", exVi: "Người ta tích trữ gạo trước bão." },
        { w: "live on", pos: "phr v", ipa: "/ˈlɪv ɒn/", vi: "sống chủ yếu nhờ (ăn gì / thu nhập gì)", ex: "Students often live on instant noodles before exams.", exVi: "Sinh viên thường sống nhờ mì gói trước kỳ thi." },
        { w: "rely on imports", pos: "phr", ipa: "/rɪˈlaɪ ɒn ˈɪmpɔːts/", vi: "phụ thuộc vào hàng nhập khẩu", ex: "Small island nations rely on imports for most of their food.", exVi: "Các đảo quốc nhỏ phụ thuộc vào nhập khẩu cho phần lớn lương thực." },
      ],
    },
    {
      t: "table",
      caption: "Năm họ từ",
      head: ["Động từ", "Danh từ", "Tính từ", "Ví dụ"],
      rows: [
        ["**produce** /prəˈdjuːs/", "**produce** /ˈprɒdjuːs/ (nông sản) · **product** · **production** · producer", "**productive**", "Vietnam **produces** a lot of coffee. · fresh **produce** · rice **production**"],
        ["—", "**agriculture**", "**agricultural**", "**Agriculture** employs millions. · **agricultural** land"],
        ["nourish", "**nutrition** · **nutrient**", "**nutritious**", "Vegetables are rich in **nutrients**. · a **nutritious** meal"],
        ["**process**", "**processing**", "**processed**", "**processed** food · food **processing** plants"],
        ["**waste**", "**waste**", "**wasteful**", "Don't **waste** food. · **food waste** · **wasteful** habits"],
      ],
    },
    {
      t: "note",
      title: "Người Việt hay sai với từ thực phẩm",
      items: [
        "~~foods~~ cho nghĩa chung → **food** (không đếm được). Chỉ dùng **foods** khi nói **các loại** thực phẩm: “fermented **foods** such as kimchi”.",
        "~~livestocks~~, ~~cattles~~ → **livestock**, **cattle** (đã là số nhiều).",
        "~~The milk is broken~~ → The milk **has gone off**.",
        "~~nutrition food~~ → **nutritious** food (tính từ). ~~healthy for body~~ → **good for your health**.",
        "~~agriculture products~~ → **agricultural** products.",
      ],
    },
    {
      t: "rule",
      formula: "grow crops · raise livestock · locally grown produce · food security · go off · go to waste · rely on imports",
      vi: "Bảy cụm dùng được ngay cho Task 2 về thực phẩm và nông nghiệp.",
    },

    { t: "h", text: "3. Bốn câu mẫu ăn điểm (Task 2 · Part 3)" },
    {
      t: "examples",
      items: [
        { en: "Buying locally grown produce not only supports smallholder farmers but also reduces food miles and emissions.", vi: "Mua nông sản trồng tại địa phương không chỉ hỗ trợ nông hộ nhỏ mà còn giảm quãng đường vận chuyển và khí thải." },
        { en: "Although genetically modified crops could help to feed a growing population, many consumers still have doubts about their safety.", vi: "Dù cây trồng biến đổi gen có thể giúp nuôi dân số ngày càng tăng, nhiều người tiêu dùng vẫn nghi ngại về độ an toàn." },
        { en: "Countries that rely heavily on imports are more vulnerable when droughts or wars affect global food supplies.", vi: "Những nước phụ thuộc nhiều vào nhập khẩu dễ tổn thương hơn khi hạn hán hay chiến tranh ảnh hưởng đến nguồn cung lương thực toàn cầu." },
        { en: "Large amounts of perishable food go to waste every day because supermarkets throw away anything that looks imperfect.", vi: "Lượng lớn thực phẩm dễ hỏng bị bỏ phí mỗi ngày vì siêu thị vứt bỏ bất cứ thứ gì trông không hoàn hảo." },
      ],
    },

    { t: "h", text: "4. Phát âm: từ viết dài, đọc ngắn" },
    {
      t: "p",
      text: "Một số từ hay gặp có **âm tiết bị nuốt** trong cách đọc chuẩn: **vegetable** viết 4 âm tiết nhưng đọc **3** /ˈvedʒtəbl/; **chocolate** đọc **2** /ˈtʃɒklət/. Người Việt hay đọc **đủ từng chữ** (“ve-giơ-tê-bồ”) nên nghe rất lạ, và khi **nghe** đề thì không nhận ra từ quen. Đây không phải nói tắt — đây là **cách đọc trong từ điển**.",
    },
    {
      t: "table",
      head: ["Từ", "Đọc", "Số âm tiết", "Đừng đọc"],
      rows: [
        ["vegetable", "/ˈvedʒtəbl/", "3", "“ve-giơ-tê-bồ” (4)"],
        ["chocolate", "/ˈtʃɒklət/", "2", "“sô-cô-lát” (3)"],
        ["comfortable", "/ˈkʌmftəbl/", "3", "“com-pho-tê-bồ” (4)"],
        ["interesting", "/ˈɪntrəstɪŋ/", "3", "“in-tơ-rét-ting” (4)"],
        ["different", "/ˈdɪfrənt/", "2", "“đi-phơ-rừn” (3)"],
        ["restaurant", "/ˈrestrɒnt/", "2", "“rét-tô-răng” (3)"],
        ["every", "/ˈevri/", "2", "“e-vơ-ri” (3)"],
        ["temperature", "/ˈtemprətʃə(r)/", "3", "“tem-pơ-ra-chơ” (4)"],
      ],
    },
    {
      t: "phatam",
      id: "t2d12-phat-am",
      title: "Luyện phát âm — từ bị nuốt âm tiết",
      note: "Bấm “Nghe mẫu”, rồi “Đọc & chấm”. Không đọc phần chữ bị nuốt: veg(e)table, choc(o)late, comf(or)table, int(e)resting, diff(e)rent. Máy chấm theo phiên âm — đọc thừa âm tiết sẽ bị trừ.",
      items: [
        { text: "vegetable, chocolate, comfortable", ipa: "vedʒtəbl tʃɒklət kʌmftəbl", vi: "3 · 2 · 3 âm tiết" },
        { text: "interesting, different, every", ipa: "ɪntrəstɪŋ dɪfrənt evri", vi: "3 · 2 · 2 âm tiết" },
        { text: "restaurant, temperature, favourite", ipa: "restrɒnt temprətʃə feɪvrɪt", vi: "2 · 3 · 2 âm tiết" },
        { text: "Fresh vegetables are different every season.", ipa: "freʃ vedʒtəblz ə dɪfrənt evri siːzn", vi: "vegetables · different · every" },
        { text: "This restaurant is very comfortable.", ipa: "ðɪs restrɒnt ɪz veri kʌmftəbl", vi: "restaurant · comfortable" },
        { text: "Chocolate is my favourite dessert.", ipa: "tʃɒklət ɪz maɪ feɪvrɪt dɪzɜːt", vi: "chocolate · favourite" },
        { text: "The temperature affects the rice crop.", ipa: "ðə temprətʃər əfekts ðə raɪs krɒp", vi: "temperature · affects · crop" },
        { text: "It's interesting to grow your own vegetables.", ipa: "ɪts ɪntrəstɪŋ tə ɡrəʊ jər əʊn vedʒtəblz", vi: "interesting · vegetables" },
      ],
    },

    { t: "h", text: "5. Luyện tập" },
    {
      t: "quiz",
      id: "t2d12-tv-dien",
      title: "Điền MỘT từ (8 câu)",
      kind: "fill",
      items: [
        { q: "(1) Rice is the ___ food of Vietnam. (lương thực chính)", answers: ["staple"] },
        { q: "(2) The farmers lost most of their crops because of a long ___. (hạn hán)", answers: ["drought"] },
        { q: "(3) Put the fish in the fridge, or it will go ___.", answers: ["off", "bad"] },
        { q: "(4) Organic farmers do not spray their fields with chemical ___. (thuốc trừ sâu)", answers: ["pesticides", "pesticide"] },
        { q: "(5) Many families in the countryside raise ___ such as pigs and ducks.", answers: ["livestock"] },
        { q: "(6) Fresh milk and fish are ___, so they must be kept cold. (dễ hỏng)", answers: ["perishable"] },
        { q: "(7) Japan relies ___ imports for most of its wheat.", answers: ["on"] },
        { q: "(8) Too much good food goes to ___ in rich countries.", answers: ["waste"] },
      ],
    },
    {
      t: "mcq",
      id: "t2d12-tv-ho-tu",
      title: "Chọn dạng từ đúng (6 câu)",
      items: [
        { q: "(1) Coffee ___ has increased sharply in the Central Highlands.", options: ["produce", "production", "productive"], correct: 1, why: "Sau **Coffee** cần danh từ chỉ **việc sản xuất**: production." },
        { q: "(2) A ___ breakfast gives you energy for the morning.", options: ["nutritious", "nutrition", "nutrient"], correct: 0, why: "Trước danh từ **breakfast** cần **tính từ**: nutritious." },
        { q: "(3) Over 60% of the land in this province is used for ___ purposes.", options: ["agriculture", "agriculturally", "agricultural"], correct: 2, why: "Trước **purposes** cần **tính từ**: agricultural." },
        { q: "(4) The market sells fresh local ___ every morning.", options: ["productive", "producer", "produce"], correct: 2, why: "**produce** /ˈprɒdjuːs/ (danh từ không đếm được) = nông sản." },
        { q: "(5) ___ food often contains a lot of salt and sugar.", options: ["Processed", "Process", "Processing"], correct: 0, why: "**processed food** = thực phẩm đã chế biến." },
        { q: "(6) Throwing away half the meal is very ___.", options: ["waste", "wasteful", "wasted"], correct: 1, why: "Sau **very** cần tính từ chỉ tính chất: wasteful (lãng phí)." },
      ],
    },
    {
      t: "quiz",
      id: "t2d12-tv-dich",
      title: "Dịch sang tiếng Anh (5 câu)",
      kind: "translate",
      grammar: "locally grown · rely on imports · go to waste · feed a growing population · staple food",
      items: [
        { q: "Tôi thích mua rau trồng tại địa phương.", hint: "I prefer / I like, buying, locally grown vegetables", answers: ["I prefer buying locally grown vegetables.", "I like buying locally grown vegetables.", "I prefer to buy locally grown vegetables.", "I like to buy locally grown vegetables.", "I prefer buying vegetables that are grown locally.", "I like to buy vegetables that are grown locally.", "I like buying vegetables that are grown locally.", "I prefer to buy vegetables that are grown locally.", "I prefer buying locally-grown vegetables.", "I like buying locally-grown vegetables.", "I like to buy locally-grown vegetables.", "I prefer to buy locally-grown vegetables."] },
        { q: "Nhiều nước phụ thuộc vào nhập khẩu lúa mì.", hint: "Many countries, rely on, imports of wheat / wheat imports", answers: ["Many countries rely on wheat imports.", "Many countries rely on imports of wheat.", "Many countries rely on imported wheat.", "Many countries depend on wheat imports.", "Many countries depend on imports of wheat."] },
        { q: "Mỗi ngày có rất nhiều thức ăn bị bỏ phí.", hint: "A lot of food, goes to waste, every day", answers: ["A lot of food goes to waste every day.", "Lots of food goes to waste every day.", "Every day a lot of food goes to waste.", "Every day, a lot of food goes to waste.", "A large amount of food goes to waste every day.", "A great deal of food goes to waste every day.", "A lot of food is wasted every day.", "Lots of food is wasted every day.", "Every day, a lot of food is wasted.", "A large amount of food is wasted every day."] },
        { q: "Chúng ta cần sản xuất nhiều lương thực hơn để nuôi dân số ngày càng tăng.", hint: "We need to produce more food, to feed a growing population", answers: ["We need to produce more food to feed a growing population.", "We need to produce more food to feed the growing population.", "We need to produce more food in order to feed a growing population.", "We need to grow more food to feed a growing population."] },
        { q: "Gạo là lương thực chính của hơn một nửa dân số thế giới.", hint: "Rice is the staple food of, more than half of the world's population", answers: ["Rice is the staple food of more than half of the world's population.", "Rice is the staple food of more than half the world's population.", "Rice is the staple food for more than half of the world's population.", "Rice is the staple food of over half of the world's population.", "Rice is the staple food of over half the world's population.", "Rice is a staple food for more than half of the world's population."] },
      ],
    },

    { t: "h", text: "6. Thêm: từ ăn uống cho Speaking Part 1" },
    {
      t: "p",
      text: "Phần này đề cương không ghi, nhưng **Part 1** rất hay hỏi về ăn uống: “What's your favourite food?”, “Do you like cooking?”, “Do you often eat out?”. Từ nông nghiệp ở trên hợp Task 2; còn khi nói về **bữa ăn của bạn**, bạn cần nhóm từ đời thường dưới đây.",
    },
    {
      t: "vocab",
      items: [
        { w: "dish", pos: "n", ipa: "/dɪʃ/", vi: "món ăn", ex: "My favourite dish is my mum's sour fish soup.", exVi: "Món tôi thích nhất là canh chua cá mẹ nấu.", more: "Nghĩa khác: cái đĩa. **a traditional / local dish** · **wash the dishes** (rửa bát).", anh: "shallow-pan-of-food" },
        { w: "ingredient", pos: "n", ipa: "/ɪnˈɡriːdiənt/", vi: "nguyên liệu (nấu ăn)", ex: "Fresh herbs are the most important ingredient in Vietnamese cooking.", exVi: "Rau thơm tươi là nguyên liệu quan trọng nhất trong món Việt.", more: "**the main ingredients** · **local ingredients**." },
        { w: "cuisine", pos: "n", ipa: "/kwɪˈziːn/", vi: "ẩm thực (cách nấu của một vùng)", ex: "Hue cuisine is famous for being spicy.", exVi: "Ẩm thực Huế nổi tiếng là cay.", more: "Trang trọng hơn **food**: **Vietnamese / Italian cuisine**. Nhấn âm sau: cui**SINE**." },
        { w: "recipe", pos: "n", ipa: "/ˈresəpi/", vi: "công thức nấu ăn", ex: "I usually follow a recipe I find on YouTube.", exVi: "Tôi thường làm theo công thức tìm trên YouTube.", more: "Đọc 3 âm tiết **RE-ci-pe**, không đọc “ri-xíp”. Cụm: **follow a recipe**." },
        { w: "home-cooked", pos: "adj", ipa: "/ˌhəʊm ˈkʊkt/", vi: "nấu ở nhà", ex: "Nothing beats a home-cooked meal after a long day.", exVi: "Sau một ngày dài, không gì bằng bữa cơm nhà nấu.", anh: "pot-of-food" },
        { w: "takeaway", pos: "n", ipa: "/ˈteɪkəweɪ/", vi: "đồ ăn mua mang về", ex: "We often get a takeaway on Friday nights.", exVi: "Tối thứ Sáu chúng tôi hay mua đồ ăn mang về.", more: "Mỹ: **takeout**. Gần nghĩa: **order food online / food delivery**.", anh: "takeout-box" },
        { w: "eat out", pos: "phr v", ipa: "/ˌiːt ˈaʊt/", vi: "ăn ngoài (nhà hàng, quán)", ex: "Young people in big cities eat out several times a week.", exVi: "Người trẻ ở thành phố lớn ăn ngoài vài lần một tuần.", more: "Danh từ dùng trong biểu đồ: **eating out** (bài Viết hôm nay)." },
        { w: "portion", pos: "n", ipa: "/ˈpɔːʃn/", vi: "suất, khẩu phần", ex: "The portions at that restaurant are huge.", exVi: "Suất ăn ở nhà hàng đó rất to.", more: "**a large / small portion** · **portion size**.", anh: "fork-and-knife-with-plate" },
        { w: "flavour", pos: "n", ipa: "/ˈfleɪvə(r)/", vi: "hương vị", ex: "I love the strong flavour of fish sauce.", exVi: "Tôi thích vị đậm của nước mắm.", more: "Mỹ viết **flavor**. Tính từ: **flavourful**; cụm: **full of flavour**." },
        { w: "spicy", pos: "adj", ipa: "/ˈspaɪsi/", vi: "cay", ex: "I can't eat very spicy food.", exVi: "Tôi không ăn được đồ quá cay.", more: "Khác **hot** (vừa “nóng” vừa “cay” — dễ hiểu nhầm). Đối lập: **mild** (không cay).", anh: "hot-pepper" },
        { w: "street food", pos: "n (U)", ipa: "/ˈstriːt fuːd/", vi: "đồ ăn đường phố", ex: "Hanoi is famous for its cheap and tasty street food.", exVi: "Hà Nội nổi tiếng với đồ ăn đường phố rẻ và ngon.", anh: "steaming-bowl" },
        { w: "vegetarian", pos: "adj, n", ipa: "/ˌvedʒəˈteəriən/", vi: "(người) ăn chay", ex: "My sister became a vegetarian last year.", exVi: "Chị tôi ăn chay từ năm ngoái.", more: "**a vegetarian restaurant / dish**. Ăn chay hoàn toàn (không sữa, trứng): **vegan** /ˈviːɡən/.", anh: "green-salad" },
        { w: "snack", pos: "n, v", ipa: "/snæk/", vi: "đồ ăn vặt; ăn vặt", ex: "I try not to snack between meals.", exVi: "Tôi cố không ăn vặt giữa các bữa.", more: "**a healthy snack** · **snack on** sth.", anh: "cookie" },
      ],
    },
    {
      t: "dialogue",
      title: "Part 1 — chủ đề Food (band 5.5)",
      lines: [
        { who: "Examiner", role: "examiner", text: "Do you like cooking?" },
        { who: "Candidate", role: "candidate", text: "I'm not a great cook, but I enjoy making simple dishes at weekends. I usually follow a recipe on YouTube, and my favourite thing to make is fried rice, because the ingredients are cheap and it's hard to get wrong.", vi: "Tôi nấu không giỏi, nhưng thích làm vài món đơn giản cuối tuần. Tôi hay làm theo công thức trên YouTube, và món tôi thích làm nhất là cơm rang, vì nguyên liệu rẻ mà khó làm hỏng." },
        { who: "Examiner", role: "examiner", text: "Do you often eat out?" },
        { who: "Candidate", role: "candidate", text: "Probably two or three times a week. On weekdays I grab some street food near my office, but I still prefer a home-cooked meal, because the portions in restaurants are often too big and the food can be quite oily.", vi: "Chắc khoảng hai ba lần một tuần. Ngày thường tôi ăn đồ ăn đường phố gần cơ quan, nhưng tôi vẫn thích bữa cơm nhà hơn, vì suất ở nhà hàng thường quá to và đồ ăn khá nhiều dầu mỡ." },
      ],
    },
    {
      t: "quiz",
      id: "t2d12-tv-an-uong",
      title: "Điền MỘT từ — từ ăn uống (6 câu)",
      kind: "fill",
      items: [
        { q: "(1) Fish sauce is the key ___ in this dipping sauce. (nguyên liệu)", answers: ["ingredient"] },
        { q: "(2) I don't eat meat — I'm a ___.", answers: ["vegetarian", "vegan"] },
        { q: "(3) Can you send me the ___ for this soup? I'd like to make it at home. (công thức)", answers: ["recipe"] },
        { q: "(4) I'm too tired to cook tonight. Let's order a ___. (đồ mang về)", answers: ["takeaway", "takeout"] },
        { q: "(5) Thai ___ is famous for its balance of sweet, sour and spicy flavours. (ẩm thực)", answers: ["cuisine", "food"] },
        { q: "(6) My family eats ___ only on special occasions, like birthdays. (ăn ngoài — một từ)", answers: ["out"] },
      ],
    },
    {
      t: "speak",
      id: "t2d12-noi-an-uong",
      part: "1",
      questions: [
        "What's your favourite dish?",
        "Do you like cooking?",
        "How often do you eat out?",
        "Is there any food you don't like?",
      ],
    },
  ],
};

/* ─────────────────────────── Đọc ─────────────────────────── */

const T2D12_DOC: Lesson = {
  id: "t2d12-doc",
  kind: "reading",
  title: "Đọc: Matching headings",
  goal: "Ghép đúng tiêu đề cho từng đoạn (Matching headings) bằng cách tìm ý chính của cả đoạn — câu chủ đề, hướng đi của đoạn — thay vì bắt một từ trùng, loại tiêu đề chỉ đúng một chi tiết, và làm dạng này TRƯỚC các dạng khác của cùng bài đọc — đích ≥ 5/6 tiêu đề + ≥ 3/4 câu chi tiết.",
  minutes: 55,
  blocks: [
    {
      t: "recap",
      title: "Bài này học gì · đẩy band nào",
      items: [
        "**Matching headings**: đề cho **danh sách tiêu đề** (i, ii, iii… — luôn **nhiều hơn** số đoạn) và yêu cầu ghép mỗi **đoạn** (A, B, C…) với **một** tiêu đề.",
        "Tiêu đề = **ý chính của cả đoạn**, không phải một chi tiết. Câu hỏi bạn phải trả lời: “Đoạn này **nói về điều gì** — và **để làm gì**?”",
        "Manh mối mạnh nhất: **câu đầu** (câu chủ đề) và **câu cuối**; nhưng có đoạn câu đầu chỉ dẫn dắt — đọc tiếp tới **However / But**.",
        "Bẫy lớn nhất: tiêu đề có **từ trùng** với một chi tiết trong đoạn. Trùng chữ ≠ đúng ý chính.",
        "Thường làm Matching headings **trước** các dạng khác của cùng bài — đọc xong là đã có “bản đồ” ý từng đoạn. Đẩy **Reading band 5** ở dạng nhiều người bỏ trống nhất.",
      ],
    },

    { t: "h", text: "1. Làm Matching headings thế nào?" },
    {
      t: "sodo",
      kind: "flow",
      title: "Sáu bước",
      steps: [
        { label: "Đọc danh sách tiêu đề", sub: "gạch từ khoá; nhóm các tiêu đề **gần giống nhau** (dễ nhầm)" },
        { label: "Gạch tiêu đề của ví dụ (nếu có)", sub: "tiêu đề đã dùng cho ví dụ **không** dùng lại" },
        { label: "Đọc từng đoạn: câu đầu + câu cuối", sub: "rồi lướt phần giữa tìm **However / But / In fact**" },
        { label: "Tự tóm tắt đoạn bằng 3–5 từ", sub: "“lúa cần nhiều nước” · “giống mới thập niên 60”" },
        { label: "So bản tóm tắt với danh sách", sub: "chọn tiêu đề **bao trùm cả đoạn**" },
        { label: "Đoạn khó để cuối", sub: "khi danh sách đã ngắn lại, đoạn khó dễ hơn" },
      ],
      caption: "Mỗi tiêu đề chỉ dùng MỘT lần (trừ khi đề nói khác). Thường có vài tiêu đề thừa (hay gặp 2–3).",
    },
    {
      t: "sodo",
      kind: "compare",
      title: "Tiêu đề ĐÚNG và tiêu đề BẪY — đoạn ví dụ",
      cols: [
        { title: "Đoạn văn", anh: "page-facing-up", items: ["Coffee arrived in Vietnam with French missionaries in the 19th century.", "**For decades, however, production stayed small.**", "Only after reforms in the late 1980s did farmers plant it on a large scale,", "and within twenty years Vietnam became one of the world's top exporters."] },
        { title: "✓ Tiêu đề đúng", anh: "check-mark-button", items: ["**From a slow start to rapid growth**", "bao trùm **cả đoạn**: đến sớm → nhỏ lẻ lâu → bùng nổ"] },
        { title: "✗ Tiêu đề bẫy", anh: "cross-mark", items: ["**The role of French missionaries**", "chỉ đúng **câu đầu** — một chi tiết", "**Why coffee prices fell**", "có từ “coffee”, không có trong đoạn"] },
      ],
    },
    {
      t: "note",
      title: "Người Việt hay sai ở Matching headings",
      items: [
        "Ghép theo **từ trùng**: đoạn có chữ “water” → chọn ngay tiêu đề có “water”. Tiêu đề đúng thường dùng **từ khác** (paraphrase): water → **irrigation**, thirsty.",
        "Chọn tiêu đề chỉ đúng **câu đầu** — khi câu đầu chỉ là dẫn dắt và ý chính nằm sau **However**.",
        "Đọc **cả đoạn từng chữ** để tìm tiêu đề — mất 3–4 phút mỗi đoạn. Câu đầu + câu cuối + từ đối lập là đủ cho phần lớn đoạn.",
        "Dùng một tiêu đề **hai lần** — nếu thấy hai đoạn hợp cùng một tiêu đề, một trong hai đang sai.",
        "Viết số La Mã sai (iiii, vv). Học: **i ii iii iv v vi vii viii ix x**.",
      ],
    },
    {
      t: "rule",
      formula: "Tiêu đề = ý chính CẢ đoạn · câu đầu + câu cuối + sau However · trùng chữ ≠ đúng · mỗi tiêu đề dùng một lần",
      vi: "Tự tóm tắt đoạn bằng 3–5 từ TRƯỚC khi nhìn danh sách tiêu đề.",
    },

    { t: "h", text: "2. Bài đọc luyện tập — Questions 1–10" },
    {
      t: "p",
      text: "Bài đọc soạn riêng cho khoá, **6 đoạn A–F**, chủ đề **nông nghiệp – môi trường**: cây lúa. Làm trong **18 phút**: Questions 1–6 (Matching headings) trước, rồi Questions 7–10.",
    },
    {
      t: "table",
      caption: "List of Headings",
      head: ["Số", "Heading"],
      rows: [
        ["i", "A crop that needs plenty of water"],
        ["ii", "How the fields themselves add to global warming"],
        ["iii", "A grain at the centre of daily life"],
        ["iv", "New seeds that changed farming"],
        ["v", "Why rice costs more than wheat"],
        ["vi", "Growing the same amount with less water"],
        ["vii", "Salt, heat and the search for tougher plants"],
        ["viii", "The first farmers to grow rice"],
      ],
    },
    {
      t: "passage",
      title: "Rice: the grain that feeds half the world",
      intro: "Bài đọc 6 đoạn (A–F). Questions 1–10 ở ngay bên dưới.",
      paras: [
        { label: "A", text: "For more than half of the world's population, rice is not just one food among many; it is the basis of almost every meal. The great majority of it is grown and eaten in Asia, where it has shaped customs, festivals and even language. In Vietnamese, for example, the everyday word for cooked rice is also used to mean a meal, so asking someone whether they have eaten rice is a common way of asking whether they have eaten at all. Few other foods are so closely tied to the rhythm of ordinary life." },
        { label: "B", text: "Unlike wheat or maize, most rice is grown in fields that are deliberately flooded for much of the season. Rice plants can survive in standing water, while many of the weeds that compete with them cannot, so flooding is an effective and cheap way of controlling weeds. The disadvantage is that rice is an extremely thirsty crop. Producing a kilogram of rice generally requires far more water than producing a kilogram of wheat, which is why rice farming has always depended on rivers, rain and carefully built irrigation systems." },
        { label: "C", text: "In the 1960s, many experts feared that Asia would not be able to feed its rapidly growing population. Part of the answer came from plant breeders, who developed new varieties of rice with shorter, stronger stems. One of the best known, IR8, was released in 1966 by an international research institute in the Philippines. Because the new plants did not fall over when their heads were heavy with grain, they could produce much larger harvests. However, they also needed more fertiliser and reliable irrigation, which not every smallholder could afford." },
        { label: "D", text: "Flooded rice fields have an environmental cost that is easy to overlook. When soil is covered by water, oxygen cannot reach it, and certain bacteria that live without oxygen break down plant material and release methane. Methane is a greenhouse gas that traps far more heat than carbon dioxide over the short term, and rice fields are among the significant human-made sources of it. Heavy use of chemical fertiliser adds to the problem, because it leads to the release of another greenhouse gas, and some of it is also washed into rivers and lakes." },
        { label: "E", text: "Fortunately, there are ways to reduce both the water used and the gas produced. In a method known as alternate wetting and drying, farmers allow the water in their fields to drain away for several days before flooding them again. Trials in several Asian countries, including Vietnam, have shown that this can cut water use considerably and reduce methane emissions, often without any loss in yield. The method requires careful timing, however, and farmers need training and sometimes new equipment to use it well." },
        { label: "F", text: "The greatest challenge for the future may be climate change itself. In low-lying river deltas such as the Mekong, rising sea levels and droughts allow salt water to move further inland, damaging crops that were once safe. Higher temperatures during flowering can also reduce the number of grains each plant produces. Scientists are therefore breeding varieties that can survive in salty water or extreme heat, in the hope that rice will continue to feed billions of people in a warmer world." },
      ],
    },
    {
      t: "p",
      text: "**Questions 1–6.** The reading passage has six paragraphs, **A–F**. Choose the correct heading for each paragraph from the list of headings above. Write the correct number, **i–viii**.",
    },
    {
      t: "quiz",
      id: "t2d12-doc-tieu-de",
      title: "Questions 1–6 — ghi số La Mã (i–viii)",
      kind: "fill",
      items: [
        { q: "1. Paragraph A ___", answers: ["iii"] },
        { q: "2. Paragraph B ___", answers: ["i"] },
        { q: "3. Paragraph C ___", answers: ["iv"] },
        { q: "4. Paragraph D ___", answers: ["ii"] },
        { q: "5. Paragraph E ___", answers: ["vi"] },
        { q: "6. Paragraph F ___", answers: ["vii"] },
      ],
    },
    {
      t: "note",
      title: "Giải thích 1–6",
      items: [
        "**A — iii** (A grain at the centre of daily life). Câu đầu: lúa là “**the basis of almost every meal**”; câu cuối: “**closely tied to the rhythm of ordinary life**”. Ví dụ “cơm” = bữa ăn chỉ minh hoạ. Bẫy **viii** (first farmers): đoạn không nói ai trồng lúa đầu tiên.",
        "**B — i** (A crop that needs plenty of water). Ý chính sau “The disadvantage is that…”: “rice is an **extremely thirsty crop**” (thirsty = cần nhiều nước — paraphrase). Bẫy **v**: có so sánh với **wheat** nhưng về **nước**, không về **giá**.",
        "**C — iv** (New seeds that changed farming). Cả đoạn: giống mới (**new varieties**, IR8) → thu hoạch lớn hơn. new varieties ↔ **new seeds**.",
        "**D — ii** (How the fields themselves add to global warming). Câu đầu: “an **environmental cost**”; nội dung: ruộng ngập → vi khuẩn → **methane**, “a **greenhouse gas** that traps heat” = góp phần làm ấm lên toàn cầu.",
        "**E — vi** (Growing the same amount with less water). Tưới ướt – khô xen kẽ “cut water use considerably… **without any loss in yield**” = cùng sản lượng, ít nước hơn. Bẫy **i**: đoạn cũng nói về **nước**, nhưng ý chính là **cách giảm** nước. (Giảm mê-tan là lợi ích đi kèm của cùng phương pháp — không có tiêu đề nào khác nói về nó.)",
        "**F — vii** (Salt, heat and the search for tougher plants). Mặn (**salt water**), nóng (**higher temperatures**), lai tạo giống chịu được (**varieties that can survive**) = tougher plants.",
        "Hai tiêu đề thừa: **v** và **viii**.",
      ],
    },
    {
      t: "p",
      text: "**Questions 7–10.** Choose the correct letter, **A, B, C or D**.",
    },
    {
      t: "mcq",
      id: "t2d12-doc-chon",
      title: "Questions 7–10 — Multiple choice",
      items: [
        { q: "7. According to paragraph B, farmers flood rice fields mainly in order to", options: ["A keep the soil warm.", "B stop weeds from growing.", "C attract fish into the fields.", "D save money on seeds."], correct: 1, why: "“many of the **weeds**… cannot [survive], so flooding is an effective and cheap way of **controlling weeds**”." },
        { q: "8. What was the main advantage of the new varieties described in paragraph C?", options: ["A They needed less fertiliser.", "B They could be grown without irrigation.", "C They tasted better.", "D They did not fall over, so they gave bigger harvests."], correct: 3, why: "“did **not fall over** when their heads were heavy with grain, they could produce **much larger harvests**”. A, B ngược: chúng cần **nhiều** phân bón và tưới tiêu **ổn định** hơn." },
        { q: "9. Methane is produced in flooded fields because", options: ["A bacteria break down plants where there is no oxygen.", "B farmers burn the plants after the harvest.", "C fertiliser is washed into rivers.", "D the water becomes too warm."], correct: 0, why: "“oxygen cannot reach it, and certain **bacteria that live without oxygen break down plant material and release methane**”. C là vấn đề **khác** (phân bón chảy ra sông) — bẫy “đúng nhưng không trả lời câu hỏi”." },
        { q: "10. What does the writer say about alternate wetting and drying?", options: ["A It always reduces the size of the harvest.", "B It has only been tested in the Philippines.", "C It is effective but needs skill and preparation.", "D It increases methane emissions."], correct: 2, why: "“often **without any loss** in yield… requires **careful timing**, however, and farmers need **training** and sometimes new equipment” = hiệu quả nhưng cần kỹ năng và chuẩn bị. A quá tuyệt đối và ngược; B sai (several Asian countries, including Vietnam); D ngược." },
      ],
    },
    {
      t: "table",
      caption: "Tự chấm (10 câu)",
      head: ["Kết quả", "Mức", "Việc nên làm"],
      rows: [
        ["Headings 6/6 · chi tiết 4/4", "Vững band 5.5+", "Sang bài Viết"],
        ["Headings 5/6 · chi tiết ≥ 3/4", "Đạt mục tiêu band 5", "Xem đoạn sai: bạn đã bị tiêu đề **trùng chữ** lừa chưa?"],
        ["Headings ≤ 4/6", "Chưa đạt", "Tự tóm tắt mỗi đoạn bằng 3–5 từ tiếng Việt rồi ghép lại; làm lại sau 1 ngày"],
      ],
    },
    {
      t: "vocab",
      items: [
        { w: "deliberately", pos: "adv", ipa: "/dɪˈlɪbərətli/", vi: "cố ý, có chủ đích", ex: "The fields are deliberately flooded.", exVi: "Ruộng được cố ý cho ngập nước." },
        { w: "weed", pos: "n", ipa: "/wiːd/", vi: "cỏ dại", ex: "Flooding stops weeds from growing.", exVi: "Cho ngập nước ngăn cỏ dại mọc.", more: "Động từ **weed** = nhổ cỏ." },
        { w: "variety", pos: "n", ipa: "/vəˈraɪəti/", vi: "giống (cây trồng); sự đa dạng", ex: "Scientists developed a new variety of rice.", exVi: "Các nhà khoa học tạo ra một giống lúa mới.", more: "**a wide variety of** = rất nhiều loại." },
        { w: "yield", pos: "n, v", ipa: "/jiːld/", vi: "sản lượng; cho (sản lượng)", ex: "The new method did not reduce the yield.", exVi: "Phương pháp mới không làm giảm sản lượng." },
        { w: "greenhouse gas", pos: "n", ipa: "/ˈɡriːnhaʊs ɡæs/", vi: "khí nhà kính", ex: "Methane is a powerful greenhouse gas.", exVi: "Mê-tan là một loại khí nhà kính mạnh." },
        { w: "overlook", pos: "v", ipa: "/ˌəʊvəˈlʊk/", vi: "bỏ qua, không để ý", ex: "This cost is easy to overlook.", exVi: "Cái giá này dễ bị bỏ qua.", more: "Nghĩa khác: nhìn ra (a room overlooking the sea)." },
        { w: "low-lying", pos: "adj", ipa: "/ˌləʊ ˈlaɪɪŋ/", vi: "trũng, thấp (so với mực nước biển)", ex: "Low-lying deltas are at risk from rising sea levels.", exVi: "Các vùng đồng bằng trũng có nguy cơ vì nước biển dâng." },
        { w: "breed", pos: "v", ipa: "/briːd/", vi: "lai tạo (giống cây, con)", ex: "They are breeding rice that can survive in salty water.", exVi: "Họ đang lai tạo giống lúa sống được trong nước mặn.", more: "Quá khứ **bred**. Danh từ **plant breeder** (nhà lai tạo giống)." },
      ],
    },
  ],
};

/* ─────────────────────────── Viết ─────────────────────────── */

const T2D12_VIET: Lesson = {
  id: "t2d12-viet",
  kind: "writing",
  title: "Viết: Task 1 pie chart (một và hai biểu đồ tròn)",
  goal: "Viết trọn bài Task 1 biểu đồ tròn ≥ 150 từ — một pie (so sánh các phần) và hai pie (so sánh hai thời điểm): dùng ngôn ngữ tỉ lệ (account for, make up, the largest share, a quarter, nearly a third), gom các phần nhỏ, overview nêu phần lớn nhất và thay đổi lớn nhất, số liệu khớp hình — đạt TA và LR band 5–6.",
  minutes: 80,
  blocks: [
    {
      t: "recap",
      title: "Bài này học gì · đẩy band nào",
      items: [
        "Biểu đồ tròn (pie chart) chia **một tổng 100 %** thành nhiều phần. Câu hỏi chính: phần nào **lớn nhất / nhỏ nhất**, và (nếu có hai pie) phần nào **thay đổi nhiều nhất**.",
        "Ngôn ngữ tỉ lệ: ==account for · make up · represent== · ==the largest / smallest share== · ==a quarter · nearly a third · just over half== · ==the remaining 8%==",
        "**Một pie** → so sánh các phần (như bar chart Ngày 8). **Hai pie hai năm** → so sánh thay đổi (dùng rose / fell / tripled của Ngày 10).",
        "Thân bài: gom **phần lớn** một đoạn, **phần nhỏ** một đoạn — hoặc **phần tăng** / **phần giảm**.",
        "Hai bài mẫu: **hai pie hai năm** (mục 3, ngân sách thực phẩm) và **một pie** (mục 4, nguồn đạm) — mỗi bài có đề tự viết cho AI chấm.",
        "Đẩy **TA** (overview nêu phần lớn nhất + thay đổi lớn nhất) và **LR** (không lặp “percent” — đổi sang phân số, share, proportion).",
      ],
    },

    { t: "h", text: "1. Một pie và hai pie" },
    {
      t: "sodo",
      kind: "compare",
      title: "Hai kiểu đề pie chart",
      cols: [
        { title: "Một pie (một thời điểm)", anh: "pie", items: ["So sánh **các phần** với nhau", "the largest share · followed by · the smallest", "Không có thay đổi theo thời gian → **không** dùng rose / fell", "Gom: phần lớn ↔ phần nhỏ"] },
        { title: "Hai pie (hai năm / hai nơi)", anh: "chart-increasing", items: ["So sánh **thay đổi** giữa hai pie", "rose from X% to Y% · nearly tripled · halved", "Overview: phần **tăng mạnh nhất** + phần **lớn nhất**", "Gom: phần tăng ↔ phần giảm"] },
      ],
      caption: "Hai pie của hai NƠI (cùng năm) thì giống bar chart Ngày 8: so sánh, không dùng tăng / giảm.",
    },
    {
      t: "sodo",
      kind: "flow",
      title: "Viết Task 1 pie chart (20 phút)",
      steps: [
        { label: "2 phút đọc hình", sub: "tổng là gì? (ngân sách, đất, người…) · phần lớn nhất mỗi pie · phần đổi nhiều nhất" },
        { label: "Intro", sub: "The pie chart(s) illustrate(s) / compare(s) how… was divided / the proportion of…" },
        { label: "Overview (2 câu)", sub: "Overall, + phần lớn nhất / thay đổi lớn nhất (không số)" },
        { label: "Body 1 + Body 2", sub: "gom nhóm; mỗi câu có số + một phép so sánh" },
        { label: "Soát", sub: "tổng các số mỗi pie = 100? mọi số đúng hình? ≥ 150 từ" },
      ],
    },

    { t: "h", text: "2. Ngôn ngữ tỉ lệ" },
    {
      t: "patterns",
      rows: [
        { formula: "X + accounted for / made up / represented + số % + of + tổng", vi: "Chiếm bao nhiêu. **account for** (chiếm) hay dùng nhất. Quá khứ: accounted for / made up.", examples: [{ en: "Eating out accounted for 28% of the food budget in 2020.", vi: "Ăn ngoài chiếm 28% ngân sách thực phẩm năm 2020." }] },
        { formula: "X + was the largest / second largest / smallest + category / share", vi: "Xếp hạng phần.", examples: [{ en: "Fresh fruit and vegetables were the largest category in 2000.", vi: "Rau quả tươi là hạng mục lớn nhất năm 2000." }] },
        { formula: "The proportion / share of + N + spent on / used for + X + rose / fell from … to …", vi: "Thay đổi giữa hai pie.", examples: [{ en: "The share of the budget spent on meat and fish fell from 28% to 20%.", vi: "Phần ngân sách chi cho thịt cá giảm từ 28% xuống 20%." }] },
        { formula: "a quarter · a third · a fifth · just over half · nearly two-thirds + of + N", vi: "Đổi phần trăm sang phân số để **không lặp** “%”. (Bảng phân số: Ngày 8.)", examples: [{ en: "Meat and fish made up a fifth of spending in 2020.", vi: "Thịt cá chiếm một phần năm chi tiêu năm 2020." }] },
        { formula: "…, followed by X (số %) and Y (số %)", vi: "Nối các phần theo thứ tự lớn → nhỏ trong một câu.", examples: [{ en: "The bus was the most common choice (35%), followed by cycling (25%) and walking (20%).", vi: "Xe buýt phổ biến nhất (35%), tiếp theo là xe đạp (25%) và đi bộ (20%)." }] },
        { formula: "the remaining + số % · the remainder", vi: "Phần còn lại (từ Ngày 10).", examples: [{ en: "The remaining 8% went on other items.", vi: "8% còn lại chi cho các khoản khác." }] },
      ],
    },
    {
      t: "note",
      title: "Người Việt hay sai khi viết pie chart",
      items: [
        "~~Eating out accounted 28%~~ → accounted **for** 28%. ~~took 28%~~ nghe như văn nói — dùng **accounted for / made up**.",
        "~~The percentage of meat is 28%~~ → The **share of spending on** meat **was** 28% / Meat **accounted for** 28% **of spending**.",
        "Dùng **rose / fell** cho **một pie** (không có thời gian) — sai TA.",
        "Kể **hết** 6 phần × 2 năm = 12 câu cùng khuôn. Gom các phần **nhỏ và ít thay đổi** vào một câu: “…decreased only slightly, from 15% to 12% and from 12% to 10% **respectively**”.",
        "**respectively** (lần lượt) dùng khi hai số đi theo đúng thứ tự hai danh từ đã nêu.",
      ],
    },
    {
      t: "rule",
      formula: "X accounted for / made up + số % · the largest / smallest share · rose / fell from … to … · followed by · the remaining … · respectively",
      vi: "Pie chart = ngôn ngữ TỈ LỆ; hai pie hai năm thì thêm ngôn ngữ THAY ĐỔI.",
    },
    {
      t: "quiz",
      id: "t2d12-viet-dich",
      title: "Dịch sang tiếng Anh — câu pie chart (5 câu)",
      kind: "translate",
      grammar: "X + accounted for + % + of + N · the largest share · rose / fell from … to … · followed by · the remaining",
      items: [
        { q: "Ăn ngoài chiếm 28% ngân sách thực phẩm.", hint: "Eating out, accounted for, 28% of the food budget", answers: ["Eating out accounted for 28% of the food budget.", "Eating out made up 28% of the food budget.", "Eating out represented 28% of the food budget.", "Eating out accounts for 28% of the food budget.", "Eating out accounted for 28 percent of the food budget.", "Eating out makes up 28% of the food budget.", "Eating out represents 28% of the food budget."] },
        { q: "Rau quả tươi là hạng mục lớn nhất năm 2000.", hint: "Fresh fruit and vegetables, were the largest category, in 2000", answers: ["Fresh fruit and vegetables were the largest category in 2000.", "In 2000, fresh fruit and vegetables were the largest category.", "Fresh fruit and vegetables made up the largest category in 2000.", "Fresh fruit and vegetables were the biggest category in 2000.", "Fresh fruit and vegetables accounted for the largest share in 2000."] },
        { q: "Phần chi cho thịt cá giảm từ 28% xuống 20%.", hint: "The share of spending on meat and fish, fell from 28% to 20%", answers: ["The share of spending on meat and fish fell from 28% to 20%.", "The proportion of spending on meat and fish fell from 28% to 20%.", "The share of spending on meat and fish dropped from 28% to 20%.", "The share of spending on meat and fish decreased from 28% to 20%.", "Spending on meat and fish fell from 28% to 20%.", "The proportion spent on meat and fish fell from 28% to 20%.", "The share of spending on meat and fish declined from 28% to 20%.", "The proportion of spending on meat and fish dropped from 28% to 20%.", "The proportion of spending on meat and fish decreased from 28% to 20%.", "The proportion of spending on meat and fish declined from 28% to 20%."] },
        { q: "Xe buýt phổ biến nhất, tiếp theo là xe đạp.", hint: "The bus was the most popular, followed by, the bicycle / cycling", answers: ["The bus was the most popular, followed by the bicycle.", "The bus was the most popular, followed by cycling.", "The bus was the most popular option, followed by cycling.", "The bus was the most popular choice, followed by the bicycle.", "Buses were the most popular, followed by bicycles.", "The bus was the most popular mode of transport, followed by the bicycle.", "The bus was the most common choice, followed by cycling.", "The bus was the most common choice, followed by the bicycle.", "The bus was the most common, followed by cycling.", "The bus was the most common, followed by the bicycle.", "The bus was the most popular choice, followed by cycling.", "The bus was the most popular option, followed by the bicycle."] },
        { q: "8% còn lại chi cho các khoản khác.", hint: "The remaining 8%, was spent on / went on, other items", answers: ["The remaining 8% was spent on other items.", "The remaining 8% went on other items.", "The remaining 8% was spent on other things.", "The remaining 8% went on other things.", "The remaining eight percent was spent on other items."] },
      ],
    },

    { t: "h", text: "3. Bài mẫu band 6.5–7 — hai pie hai năm" },
    {
      t: "p",
      text: "**Đề:** The pie charts below show how the average household in one country spent its weekly food budget in 2000 and 2020. Summarise the information by selecting and reporting the main features, and make comparisons where relevant. **Write at least 150 words.**",
    },
    {
      t: "figure",
      fig: {
        kind: "pie",
        title: "Average household food budget in one country, 2000",
        note: "Số liệu tự đặt cho bài luyện. Tổng = 100%.",
        unit: "%",
        slices: [
          { label: "Fresh fruit & vegetables", value: 30 },
          { label: "Meat & fish", value: 28 },
          { label: "Bread & cereals", value: 15 },
          { label: "Dairy", value: 12 },
          { label: "Eating out", value: 10 },
          { label: "Other", value: 5 },
        ],
      },
    },
    {
      t: "figure",
      fig: {
        kind: "pie",
        title: "Average household food budget in one country, 2020",
        note: "Số liệu tự đặt cho bài luyện. Tổng = 100%.",
        unit: "%",
        slices: [
          { label: "Fresh fruit & vegetables", value: 22 },
          { label: "Meat & fish", value: 20 },
          { label: "Bread & cereals", value: 12 },
          { label: "Dairy", value: 10 },
          { label: "Eating out", value: 28 },
          { label: "Other", value: 8 },
        ],
      },
    },
    {
      t: "examples",
      items: [
        { en: "[Introduction] The two pie charts compare how the average household in one country divided its weekly food budget between six categories in 2000 and 2020.", vi: "[Mở bài] Hai biểu đồ tròn so sánh cách hộ gia đình trung bình ở một nước chia ngân sách thực phẩm hằng tuần cho sáu hạng mục vào năm 2000 và 2020." },
        { en: "[Overview] Overall, the most striking change was the dramatic increase in the proportion spent on eating out, which had become the largest category by 2020. In contrast, the shares spent on all four types of food bought for the home declined.", vi: "[Tổng quan] Nhìn chung, thay đổi nổi bật nhất là tỉ lệ chi cho ăn ngoài tăng mạnh, trở thành hạng mục lớn nhất vào năm 2020. Ngược lại, phần chi cho cả bốn loại thực phẩm mua về nhà đều giảm." },
        { en: "[Body 1] In 2000, eating out accounted for only 10% of food spending, the second smallest share after other items (5%). Over the next twenty years, this figure nearly tripled to 28%, overtaking fresh fruit and vegetables to become the biggest category. Spending on other items also rose slightly, from 5% to 8%.", vi: "[Thân bài 1] Năm 2000, ăn ngoài chỉ chiếm 10% chi tiêu thực phẩm, phần nhỏ thứ hai sau các khoản khác (5%). Trong hai mươi năm tiếp theo, con số này tăng gần gấp ba lên 28%, vượt rau quả tươi để thành hạng mục lớn nhất. Chi cho các khoản khác cũng tăng nhẹ, từ 5% lên 8%." },
        { en: "[Body 2] Fresh fruit and vegetables made up the largest proportion of the budget in 2000, at 30%, but this fell to 22% in 2020. Meat and fish followed a similar pattern, dropping from 28% to a fifth of the total. The shares for bread and cereals and for dairy products were smaller and decreased only slightly, from 15% to 12% and from 12% to 10% respectively.", vi: "[Thân bài 2] Rau quả tươi chiếm tỉ lệ lớn nhất ngân sách năm 2000, 30%, nhưng giảm còn 22% năm 2020. Thịt cá cũng theo xu hướng tương tự, giảm từ 28% xuống một phần năm tổng số. Phần chi cho bánh mì – ngũ cốc và cho sản phẩm từ sữa nhỏ hơn và chỉ giảm nhẹ, lần lượt từ 15% xuống 12% và từ 12% xuống 10%." },
      ],
    },
    {
      t: "table",
      caption: "Đối chiếu số liệu (bài mẫu 180 từ)",
      head: ["Câu trong bài", "Trên hình", "Đúng?"],
      rows: [
        ["eating out the largest category by 2020", "2020: 28 > 22 > 20 > 12 > 10 > 8", "✓"],
        ["all four types of food bought for the home declined", "30→22 · 28→20 · 15→12 · 12→10", "✓ cả bốn giảm"],
        ["eating out 10%, second smallest after other items (5%)", "2000: nhỏ nhất 5, rồi 10", "✓"],
        ["nearly tripled to 28%", "10 × 3 = 30 ≈ 28", "✓ “nearly”"],
        ["other items 5% → 8%", "5 → 8", "✓"],
        ["fresh 30% → 22% · meat & fish 28% → a fifth", "30 → 22 · 28 → 20 (= 1/5)", "✓"],
        ["bread 15→12, dairy 12→10 respectively", "đúng thứ tự hai danh từ", "✓"],
      ],
    },
    {
      t: "table",
      caption: "Vì sao bài mẫu đạt band 6.5–7",
      head: ["Tiêu chí", "Điểm mạnh"],
      rows: [
        ["**TA**", "Overview nêu **thay đổi lớn nhất** (ăn ngoài) + **xu hướng chung** của bốn loại thực phẩm; số chọn lọc, không kể máy móc"],
        ["**CC**", "Gom: Body 1 = hai phần **tăng**; Body 2 = bốn phần **giảm**; từ nối In contrast · also · followed a similar pattern · respectively"],
        ["**LR**", "accounted for · share · proportion · made up · a fifth · nearly tripled · overtaking · the most striking change"],
        ["**GRA**", "Mệnh đề **which had become**, cụm V-ing **overtaking…**, **dropping…**; quá khứ đơn + quá khứ hoàn thành (by 2020) dùng đúng"],
      ],
    },
    { t: "h", text: "4. Bài mẫu một pie — so sánh các phần" },
    {
      t: "p",
      text: "Đề **một pie** không có thời gian để so sánh, nên **không** có rose / fell. Việc của bạn là **xếp hạng** các phần, **gom** các phần cùng loại và **so sánh** chúng bằng ngôn ngữ Ngày 8–9. **Đề:** The pie chart below shows the main sources of protein in the diet of adults in one country in 2023. Summarise the information by selecting and reporting the main features, and make comparisons where relevant. **Write at least 150 words.**",
    },
    {
      t: "figure",
      fig: {
        kind: "pie",
        title: "Main sources of protein in adults' diet in one country, 2023",
        note: "Số liệu tự đặt cho bài luyện. Tổng = 100%.",
        unit: "%",
        slices: [
          { label: "Meat", value: 34 },
          { label: "Fish & seafood", value: 22 },
          { label: "Eggs & dairy", value: 18 },
          { label: "Beans & tofu", value: 15 },
          { label: "Other foods", value: 11 },
        ],
      },
    },
    {
      t: "sodo",
      kind: "flow",
      title: "Dàn ý một pie",
      steps: [
        { label: "Intro", sub: "paraphrase: shows → illustrates · main sources of protein · five categories" },
        { label: "Overview", sub: "**nhóm** nổi bật nhất (đồ ăn từ động vật) + phần lớn nhất (thịt) — không số" },
        { label: "Body 1", sub: "ba phần lớn, xếp hạng bằng **followed by**, gom: **taken together**" },
        { label: "Body 2", sub: "hai phần nhỏ, so sánh với phần lớn: **less than half the figure for…** · **the remaining**" },
      ],
    },
    {
      t: "examples",
      items: [
        { en: "[Introduction] The pie chart illustrates the main sources of protein in the diet of adults in one country in 2023, divided into five categories.", vi: "[Mở bài] Biểu đồ tròn cho thấy các nguồn đạm chính trong chế độ ăn của người trưởng thành ở một nước năm 2023, chia thành năm hạng mục." },
        { en: "[Overview] Overall, animal products clearly dominated, with meat being the largest single source, whereas plant foods such as beans and tofu played a much smaller role.", vi: "[Tổng quan] Nhìn chung, thực phẩm từ động vật chiếm ưu thế rõ rệt, trong đó thịt là nguồn đơn lẻ lớn nhất, còn thực phẩm thực vật như đậu và đậu phụ đóng vai trò nhỏ hơn nhiều." },
        { en: "[Body 1] Meat accounted for just over a third of all protein (34%), making it the largest category. It was followed by fish and seafood, at 22%, and by eggs and dairy products, which made up nearly a fifth of the total (18%). Taken together, these three animal sources supplied almost three quarters of the protein that adults consumed.", vi: "[Thân bài 1] Thịt chiếm hơn một phần ba lượng đạm một chút (34%), là hạng mục lớn nhất. Tiếp theo là cá và hải sản, 22%, rồi trứng và sữa, chiếm gần một phần năm tổng số (18%). Gộp lại, ba nguồn động vật này cung cấp gần ba phần tư lượng đạm người trưởng thành tiêu thụ." },
        { en: "[Body 2] By contrast, beans and tofu represented only 15% of protein intake, which was less than half the figure for meat and slightly lower than the share for eggs and dairy. The remaining 11% came from all other foods combined, the smallest category in the chart. In other words, plant foods and other sources together provided only around a quarter of the protein in adults' diets.", vi: "[Thân bài 2] Ngược lại, đậu và đậu phụ chỉ chiếm 15% lượng đạm, chưa bằng một nửa con số của thịt và thấp hơn một chút so với trứng và sữa. 11% còn lại đến từ mọi thực phẩm khác cộng lại, hạng mục nhỏ nhất trong biểu đồ. Nói cách khác, thực phẩm thực vật và các nguồn khác cộng lại chỉ cung cấp khoảng một phần tư lượng đạm trong khẩu phần người trưởng thành." },
      ],
    },
    {
      t: "table",
      caption: "Đối chiếu số liệu bài mẫu một pie (170 từ)",
      head: ["Câu trong bài", "Trên hình", "Đúng?"],
      rows: [
        ["meat … just over a third (34%) · the largest category", "34 > 33,3 · lớn nhất trong 5 phần", "✓"],
        ["followed by fish and seafood, 22% · eggs and dairy nearly a fifth (18%)", "22 · 18 ≈ 20", "✓ “nearly”"],
        ["three animal sources … almost three quarters", "34 + 22 + 18 = 74 ≈ 75", "✓ “almost”"],
        ["beans and tofu 15% … less than half the figure for meat", "34 ÷ 2 = 17 > 15", "✓"],
        ["slightly lower than the share for eggs and dairy", "15 < 18", "✓"],
        ["the remaining 11% … the smallest category", "11 nhỏ nhất · tổng 100", "✓"],
        ["plant foods and other sources … around a quarter", "15 + 11 = 26 ≈ 25", "✓ “around”"],
      ],
    },
    {
      t: "table",
      caption: "Vì sao bài một pie đạt band 6–6.5",
      head: ["Tiêu chí", "Điểm mạnh"],
      rows: [
        ["**TA**", "Overview **gom nhóm** (động vật ↔ thực vật) thay vì chỉ nêu một phần; không có rose / fell; không thêm thông tin ngoài hình (không bịa “other foods” là gì)"],
        ["**CC**", "Body 1 = phần lớn, Body 2 = phần nhỏ; Taken together · By contrast · The remaining dẫn dắt mạch"],
        ["**LR**", "dominated · single source · accounted for · made up · represented · nearly a fifth · almost three quarters · protein intake"],
        ["**GRA**", "Cụm V-ing **making it…**, mệnh đề **which made up… / which was less than…**, so sánh **less than half the figure for**"],
      ],
    },
    {
      t: "note",
      title: "Lỗi hay gặp ở đề một pie",
      items: [
        "Viết “Meat **increased** to 34%” — một pie **không có thay đổi**. Dùng **accounted for / made up / represented**.",
        "Kể lần lượt 5 phần, mỗi phần một câu “X is …%”. Gom: **followed by** (nối phần), **taken together / combined** (cộng phần), **less than half the figure for** (so sánh).",
        "Đoán thêm nội dung không có trên hình (“other foods such as nuts and rice”) — Task 1 chỉ báo cáo **số trên hình**.",
      ],
    },
    {
      t: "figure",
      fig: {
        kind: "pie",
        title: "How households in one city disposed of their food waste, 2024",
        note: "Số liệu tự đặt cho bài luyện. Tổng = 100%.",
        unit: "%",
        slices: [
          { label: "Thrown away with general rubbish", value: 45 },
          { label: "Composted at home", value: 20 },
          { label: "Fed to animals", value: 15 },
          { label: "Collected for recycling", value: 12 },
          { label: "Other", value: 8 },
        ],
      },
    },
    {
      t: "essay",
      id: "t2d12-viet-mot-pie",
      task: "Task 1",
      prompt: "The pie chart above shows how households in one city disposed of their food waste in 2024. Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words. (Data — thrown away with general rubbish 45%, composted at home 20%, fed to animals 15%, collected for recycling 12%, other 8%.)",
      minWords: 150,
      tips: [
        "Overview: gần một nửa rác thực phẩm bị **vứt chung với rác thường**; các cách **tái sử dụng** (ủ phân, cho vật nuôi, tái chế) cộng lại (20 + 15 + 12 = 47%) **gần bằng** con số đó.",
        "Body 1: phần lớn nhất — 45% = **just under half** · so với phần thứ hai (20%): **more than twice as high as**.",
        "Body 2: ba cách tái sử dụng — **followed by** · **taken together** · **the remaining 8%**.",
        "KHÔNG dùng rose / fell. Ít nhất 4 cụm tỉ lệ: **accounted for · made up · just under half · a fifth · the remaining**.",
      ],
    },

    { t: "h", text: "5. Tự viết bài hai pie (AI chấm)" },
    {
      t: "figure",
      fig: {
        kind: "pie",
        title: "Land use in one region, 1990",
        note: "Số liệu tự đặt cho bài luyện.",
        unit: "%",
        slices: [
          { label: "Farmland", value: 55 },
          { label: "Forest", value: 25 },
          { label: "Towns & cities", value: 10 },
          { label: "Other", value: 10 },
        ],
      },
    },
    {
      t: "figure",
      fig: {
        kind: "pie",
        title: "Land use in one region, 2020",
        note: "Số liệu tự đặt cho bài luyện.",
        unit: "%",
        slices: [
          { label: "Farmland", value: 40 },
          { label: "Forest", value: 20 },
          { label: "Towns & cities", value: 25 },
          { label: "Other", value: 15 },
        ],
      },
    },
    {
      t: "essay",
      id: "t2d12-viet-bai",
      task: "Task 1",
      prompt: "The pie charts above show how land was used in one region in 1990 and 2020. Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words. (Data — 1990: farmland 55%, forest 25%, towns & cities 10%, other 10% · 2020: farmland 40%, forest 20%, towns & cities 25%, other 15%.)",
      minWords: 150,
      tips: [
        "Mở bài: show → **compare**; how land was used → **the proportion of land used for four purposes**.",
        "Overview: đất nông nghiệp **vẫn lớn nhất** nhưng **giảm**; đô thị **tăng mạnh nhất** (10 → 25: **more than doubled**, 2,5 lần).",
        "Body 1: phần **giảm** — farmland 55 → 40 (từ **hơn một nửa** xuống **hai phần năm**), forest 25 → 20 (từ **một phần tư** xuống **một phần năm**).",
        "Body 2: phần **tăng** — towns & cities 10 → 25 (**overtook** forest), other 10 → 15.",
        "Dùng ít nhất 3 cụm: **accounted for · made up · the largest share · more than doubled · the remaining**. Soát: mỗi năm cộng = 100.",
      ],
    },
  ],
};

/* ─────────────────────────── Bài tập ─────────────────────────── */

const T2D12_BAI_TAP: Lesson = {
  id: "t2d12-bai-tap",
  kind: "homework",
  title: "Bài tập Ngày 12",
  goal: "Tự kiểm tra Ngày 12: 8 câu từ vựng thực phẩm – nông nghiệp, 6 câu họ từ, 4 câu Matching headings trên đoạn mới, 7 câu điền bài mẫu pie chart, 6 câu dịch — 31 câu có đáp án và lời giải.",
  minutes: 40,
  blocks: [
    {
      t: "recap",
      title: "Bài tập hôm nay",
      items: [
        "**Phần I** (8 câu): điền từ / cụm · **Phần II** (6 câu): họ từ.",
        "**Phần III** (4 câu): Matching headings — 4 đoạn ngắn, 6 tiêu đề.",
        "**Phần IV** (7 câu): điền bài mẫu một pie chart · **Phần V** (6 câu): dịch.",
      ],
    },
    {
      t: "sodo",
      kind: "mindmap",
      title: "Ngày 12 trong một hình",
      center: "**Ngày 12**",
      branches: [
        { label: "Từ vựng: thực phẩm & nông nghiệp", items: ["crop · livestock · pesticide · drought", "staple food · food security · perishable", "locally grown · go off · go to waste · rely on imports", "vegetable /ˈvedʒtəbl/ — 3 âm tiết"] },
        { label: "Đọc: Matching headings", items: ["ý chính CẢ đoạn", "câu đầu + câu cuối + sau However", "trùng chữ ≠ đúng", "làm trước các dạng khác"] },
        { label: "Viết: pie chart", items: ["accounted for · made up · share", "a quarter · a fifth · nearly a third", "hai pie: rose / fell / tripled", "respectively · the remaining"] },
      ],
    },

    { t: "h", text: "Phần I — Từ vựng (8 câu)" },
    {
      t: "quiz",
      id: "t2d12-bt-tu",
      title: "Phần I — Điền MỘT từ (8 câu)",
      kind: "fill",
      items: [
        { q: "(1) Most farmers in the region grow ___ such as rice, maize and cassava.", answers: ["crops"] },
        { q: "(2) Without ___, the fields would be dry for half the year. (tưới tiêu)", answers: ["irrigation"] },
        { q: "(3) This yoghurt has gone ___ — don't eat it.", answers: ["off", "bad"] },
        { q: "(4) The country is self-___ in rice and even exports it.", answers: ["sufficient"] },
        { q: "(5) ___ fruit is cheaper and tastes better because it is picked at the right time of year. (theo mùa)", answers: ["Seasonal", "seasonal"] },
        { q: "(6) The ___ here is very fertile, so plants grow quickly. (đất)", answers: ["soil", "land"] },
        { q: "(7) Canned food has a long shelf ___.", answers: ["life"] },
        { q: "(8) People often stock ___ on water and noodles before a typhoon.", answers: ["up"] },
      ],
    },

    { t: "h", text: "Phần II — Họ từ (6 câu)" },
    {
      t: "mcq",
      id: "t2d12-bt-ho-tu",
      title: "Phần II — Chọn dạng đúng (6 câu)",
      items: [
        { q: "(1) Brown rice is more ___ than white rice.", options: ["nutrient", "nutrition", "nutritious"], correct: 2, why: "So sánh **tính chất** → tính từ: nutritious." },
        { q: "(2) Food ___ is one of the region's main industries.", options: ["processed", "processing", "process"], correct: 1, why: "**food processing** (ngành chế biến thực phẩm) — danh từ." },
        { q: "(3) Most of the country's ___ land is in the south.", options: ["agricultural", "agriculturally", "agriculture"], correct: 0, why: "Trước danh từ **land** → tính từ." },
        { q: "(4) Vietnam is a major ___ of coffee.", options: ["producer", "produce", "productive"], correct: 0, why: "**a major producer of** = nước sản xuất lớn." },
        { q: "(5) Buying more than you need is ___.", options: ["waste", "wasting", "wasteful"], correct: 2, why: "Sau **is** cần tính từ chỉ tính chất: wasteful." },
        { q: "(6) Long droughts threaten food ___ in many poor countries.", options: ["secure", "security", "securely"], correct: 1, why: "**food security** (an ninh lương thực) — danh từ." },
      ],
    },

    { t: "h", text: "Phần III — Matching headings (4 câu)" },
    {
      t: "table",
      caption: "List of Headings",
      head: ["Số", "Heading"],
      rows: [
        ["i", "Customers who want perfect-looking food"],
        ["ii", "A problem that begins on the farm"],
        ["iii", "Restaurants that cook too much"],
        ["iv", "Simple changes at home"],
        ["v", "How food waste harms the climate"],
        ["vi", "The high price of organic food"],
      ],
    },
    {
      t: "passage",
      title: "Why so much food goes to waste",
      paras: [
        { label: "A", text: "Many people imagine that food waste happens mainly in kitchens. In fact, a large amount is lost before it ever reaches a shop. Crops are left in the fields when prices are too low to pay for the harvest, and fruit is damaged during storage because farmers lack cold rooms." },
        { label: "B", text: "Supermarkets reject vegetables that are the wrong shape or size, even though they taste exactly the same. They do this because shoppers tend to choose the most attractive items on the shelf and leave the rest." },
        { label: "C", text: "When food rots in a rubbish tip, it releases methane, a powerful greenhouse gas. Some experts believe that if food waste were a country, it would be one of the largest producers of greenhouse gases in the world." },
        { label: "D", text: "Households can make a real difference without spending money. Writing a shopping list, checking the fridge before going out and freezing leftovers are easy habits that save both food and money." },
      ],
    },
    {
      t: "quiz",
      id: "t2d12-bt-tieu-de",
      title: "Phần III — ghi số La Mã (i–vi)",
      kind: "fill",
      items: [
        { q: "(1) Paragraph A ___", answers: ["ii"] },
        { q: "(2) Paragraph B ___", answers: ["i"] },
        { q: "(3) Paragraph C ___", answers: ["v"] },
        { q: "(4) Paragraph D ___", answers: ["iv"] },
      ],
    },
    {
      t: "note",
      title: "Lời giải Phần III",
      items: [
        "**A — ii**: “a large amount is lost **before it ever reaches a shop**” — ruộng, kho → bắt đầu **từ nông trại**.",
        "**B — i**: siêu thị loại rau xấu **vì** “shoppers tend to choose the **most attractive** items” = khách muốn đồ trông hoàn hảo. Bẫy: đoạn mở bằng **Supermarkets**, nhưng ý chính là **lý do** — người mua.",
        "**C — v**: rác thực phẩm → **methane**, **greenhouse gas** = hại khí hậu.",
        "**D — iv**: shopping list, check the fridge, freezing leftovers = thay đổi đơn giản **ở nhà**. Tiêu đề thừa: **iii** (nhà hàng) và **vi** (giá thực phẩm hữu cơ) — không đoạn nào nói.",
      ],
    },

    { t: "h", text: "Phần IV — Điền bài mẫu pie chart (7 câu)" },
    {
      t: "figure",
      fig: {
        kind: "pie",
        title: "How students at one university travelled to campus, 2024",
        note: "Số liệu tự đặt cho bài luyện.",
        unit: "%",
        slices: [
          { label: "Bus", value: 35 },
          { label: "Bicycle", value: 25 },
          { label: "Walking", value: 20 },
          { label: "Car", value: 12 },
          { label: "Motorbike", value: 8 },
        ],
      },
    },
    {
      t: "examples",
      items: [
        { en: "The pie chart illustrates how students at one university travelled to campus in 2024. Overall, the bus was the most popular choice, (1) ___ motorbikes were the least common. The bus (2) ___ for just over a third of all journeys. Cycling was the second most popular option, at 25%, (3) ___ by walking, at a (4) ___. Only 12% of students drove, and the (5) ___ 8% came by motorbike. The proportion of cyclists was more than twice (6) ___ high as that of drivers, and together the bus and the bicycle made up (7) ___ than half of all trips.", vi: "Biểu đồ tròn cho thấy cách sinh viên một trường đại học đến trường năm 2024…" },
      ],
    },
    {
      t: "quiz",
      id: "t2d12-bt-pie",
      title: "Phần IV — Điền MỘT từ (7 câu)",
      kind: "fill",
      items: [
        { q: "(1) …the most popular choice, ___ motorbikes were the least common. (trong khi)", answers: ["whereas", "while"] },
        { q: "(2) The bus ___ for just over a third of all journeys.", answers: ["accounted"] },
        { q: "(3) …at 25%, ___ by walking… (tiếp theo là)", answers: ["followed"] },
        { q: "(4) …walking, at a ___. (20% = một phần…)", answers: ["fifth"] },
        { q: "(5) …and the ___ 8% came by motorbike. (còn lại)", answers: ["remaining", "other"] },
        { q: "(6) …more than twice ___ high as that of drivers.", answers: ["as"] },
        { q: "(7) …the bus and the bicycle made up ___ than half of all trips.", answers: ["more"] },
      ],
    },
    {
      t: "note",
      title: "Lời giải Phần IV — đối chiếu hình",
      items: [
        "**(1) whereas / while** — đối lập lớn nhất (bus 35) và nhỏ nhất (motorbike 8).",
        "**(2) accounted** for — 35% = **just over a third** (33,3%) ✓.",
        "**(3) followed** by walking. **(4) fifth** — 20% = một phần năm ✓.",
        "**(5) remaining** 8% — phần cuối cùng. **(6) as** — twice **as** high **as**: 25 > 2 × 12 = 24 ✓ “more than twice”.",
        "**(7) more** — 35 + 25 = 60% > 50% ✓.",
      ],
    },

    { t: "h", text: "Phần V — Dịch Việt → Anh (6 câu)" },
    {
      t: "quiz",
      id: "t2d12-bt-dich",
      title: "Phần V — Dịch sang tiếng Anh (6 câu)",
      kind: "translate",
      grammar: "accounted for · made up · the largest share · rose / fell from … to … · locally grown · go to waste",
      items: [
        { q: "Đất nông nghiệp chiếm hơn một nửa diện tích năm 1990.", hint: "Farmland, accounted for / made up, more than half of the land, in 1990", answers: ["Farmland accounted for more than half of the land in 1990.", "Farmland made up more than half of the land in 1990.", "In 1990, farmland accounted for more than half of the land.", "In 1990, farmland made up more than half of the land.", "Farmland accounted for over half of the land in 1990.", "Farmland made up over half of the land in 1990.", "Farmland accounted for more than half of the area in 1990.", "Farmland made up more than half of the area in 1990.", "Farmland accounted for more than half the land in 1990.", "Farmland made up more than half the land in 1990.", "In 1990, farmland accounted for more than half of the area.", "Farmland accounted for over half of the area in 1990."] },
        { q: "Tỉ lệ đất đô thị tăng hơn gấp đôi.", hint: "The proportion of urban land / land used for towns and cities, more than doubled", answers: ["The proportion of urban land more than doubled.", "The proportion of land used for towns and cities more than doubled.", "The share of urban land more than doubled.", "The percentage of urban land more than doubled.", "The proportion of urban land more than doubled over the period."] },
        { q: "Rừng giảm từ một phần tư xuống một phần năm.", hint: "Forest, fell / decreased, from a quarter to a fifth", answers: ["Forest fell from a quarter to a fifth.", "Forest decreased from a quarter to a fifth.", "Forest dropped from a quarter to a fifth.", "Forest land fell from a quarter to a fifth.", "The proportion of forest fell from a quarter to a fifth.", "Forest declined from a quarter to a fifth."] },
        { q: "Năm 2020, đất nông nghiệp vẫn chiếm phần lớn nhất.", hint: "In 2020, farmland, still accounted for / made up, the largest share", answers: ["In 2020, farmland still accounted for the largest share.", "In 2020, farmland still made up the largest share.", "In 2020 farmland still accounted for the largest share.", "Farmland still accounted for the largest share in 2020.", "In 2020, farmland still had the largest share.", "In 2020, farmland was still the largest category."] },
        { q: "Tôi luôn mua trái cây trồng tại địa phương.", hint: "I always buy, locally grown fruit", answers: ["I always buy locally grown fruit.", "I always buy fruit that is grown locally.", "I always buy local fruit.", "I always buy locally-grown fruit."] },
        { q: "Một phần ba lượng thức ăn bị bỏ phí.", hint: "A third of the food, goes to waste / is wasted", answers: ["A third of the food goes to waste.", "A third of the food is wasted.", "One third of the food goes to waste.", "One third of the food is wasted.", "A third of food goes to waste.", "A third of all food goes to waste."] },
      ],
    },
  ],
};

/* ─────────────────────────── Kiểm tra chặng (Ngày 7–12) ─────────────────────────── */
/**
 * Bài kiểm tra chặng 2 của Tập 2 — gom Ngày 7–12 thành 8 phần theo mẫu `d12-kiem-tra` (Tập 1) và quy tắc
 * SOAN-BAI "Soạn Tập 2". Mọi câu hỏi, kịch bản nghe, bản đồ, bài đọc, biểu đồ đều VIẾT MỚI (cùng kiến thức,
 * khác ngữ liệu). id `t2d12-kt-…` (tiến độ & điểm lưu theo id — đừng đổi). Viết thẳng trong tệp ngày vì script
 * mục lục chạy node strip-types, không nạp được import tương đối.
 */
const T2D12_KIEM_TRA: Lesson = {
  id: "t2d12-kiem-tra",
  kind: "review",
  title: "Kiểm tra chặng (Ngày 7–12)",
  goal: "Tự đo đã nắm chắc Ngày 7–12 chưa — tương lai (kể cả ngôn ngữ dự báo is expected / likely to), so sánh, V-ing / to V; từ vựng giao thông, AWL sublist 2 (phần 1), xu hướng, thực phẩm – nông nghiệp; Listening Part 1–2 kể cả bản đồ giọng Mỹ và bẫy sửa lời; Reading Short-answer · Multiple choice · Matching headings · paraphrase; Task 1 bar & pie (đọc số tỉ lệ); Task 2 lợi – hại; Part 2 địa điểm / đồ vật — và biết chính xác Ngày, mục nào cần ôn trước khi sang Ngày 13.",
  minutes: 165,
  blocks: [
    {
      t: "recap",
      title: "Bài kiểm tra này đo gì",
      items: [
        "**8 phần**, khoảng **165 phút** (nên chia hai buổi: phần 1–5 ~85′ · phần 6–8 ~80′): Ngữ pháp · Từ vựng · Dịch · Nghe · Đọc · Viết · Nói · Phát âm — toàn bộ là kiến thức **Ngày 7–12**.",
        "**Đạt** = từ **70 %** trở lên ở **từng phần**. Bảng điểm ngay dưới đây ghi ngưỡng đạt và **Ngày / mục cần ôn** nếu trượt.",
        "Câu hỏi, bài nghe, bài đọc đều **viết mới** — cùng kiến thức, khác ngữ liệu. Nhớ đáp án cũ không giúp được.",
        "Nghe: 3 bài — **bản đồ công viên giọng Mỹ**, **phiếu đặt tour** nhiều bẫy sửa lời, **thông báo** có từ báo hiệu; mỗi bài nghe **tối đa 2 lần**, cộng một bài **nối** (quầy ăn — đặc điểm) của Part 2. Đọc: một bài ~330 từ, 4 dạng câu hỏi (thêm 3 câu **paraphrase**). Viết: Task 1 bar chart + Task 2 **trọn bài 250 từ** + đọc biểu đồ tròn.",
        "Mức Tập 2 giữa chặng: Viết và Nói đạt khi AI chấm **≥ band 4.5** (đích cuối tập là 5.0). Cuối bài có **bảng ghi điểm**; Ngày / mục cần ôn xem ở bảng điểm đầu bài.",
      ],
    },
    {
      t: "p",
      text: "Đây là **bài kiểm tra chặng 2 của Tập 2**. Chặng 1 (Ngày 1–6) kiểm mạo từ, giới từ, hiện tại hoàn thành và Opinion / Discussion essay. Chặng này kiểm **ba điểm ngữ pháp B1 dùng nhiều nhất** (tương lai, so sánh, V-ing / to V), **lần đầu nghe giọng Mỹ**, **ba dạng Reading mới** và **ba dạng viết mới** (bar chart, pie chart, lợi – hại). Làm xong, nếu còn sức, thử **Đề 2** trên Online Test (đề band 4.5, đủ 4 kỹ năng).",
    },
    {
      t: "sodo",
      kind: "mindmap",
      title: "Chặng 2 (Ngày 7–12) — những gì sẽ bị kiểm",
      center: "Ngày 7–12",
      branches: [
        { label: "Ngữ pháp", anh: "memo", items: ["N7 will / going to / tiếp diễn / lịch trình · when + hiện tại", "N9 so sánh hơn / nhất / bằng · fewer / less", "N11 V-ing / to V · giới từ + V-ing"] },
        { label: "Từ vựng", anh: "books", items: ["N8 giao thông & đô thị", "N10 AWL sublist 2 · xu hướng vòng 2", "N12 thực phẩm & nông nghiệp"] },
        { label: "Nghe", anh: "headphone", items: ["N7 Part 2 bản đồ · giọng Mỹ", "N9 đề nhỏ Part 1+2", "N11 đoán loại từ · báo hiệu · bẫy sửa lời"] },
        { label: "Đọc", anh: "notebook", items: ["N8 Short-answer + paraphrase", "N10 Multiple choice", "N12 Matching headings"] },
        { label: "Viết", anh: "pencil", items: ["N8 bar chart (so sánh)", "N10 lợi – hại (outweigh)", "N12 pie chart"] },
        { label: "Nói · Phát âm", anh: "microphone", items: ["N7 Part 2 nơi chốn · N11 đồ vật · N9 Part 1 paraphrase", "/r/ & /t/ Anh – Mỹ · /æ ʌ ɑː/ · cụm phụ âm · /ɜː ɔː/ · trọng âm · âm tiết nuốt"] },
      ],
      caption: "Mỗi nhánh là một phần của bài kiểm tra. Nhánh nào trượt thì ôn đúng Ngày ghi trên nhánh đó.",
    },
    {
      t: "note",
      title: "Cách làm bài",
      items: [
        "**Gập sách**: không mở lại bài học, không tra từ điển, không hỏi Gia sư AI trong lúc làm.",
        "Thời gian gợi ý (**165′**): Ngữ pháp 17′ · Từ vựng 10′ · Dịch 8′ · Nghe 27′ · Đọc 23′ · Viết 70′ (6a + 6d 7′ · Task 1 20′ · Task 2 40′ · soát 3′) · Nói 6′ · Phát âm 4′.",
        "Phần **Dịch**: cố không bấm 💡 Gợi ý — bấm thì tự trừ câu đó.",
        "Phần **Nghe**: đọc câu hỏi và hình trước, mỗi bài nghe **tối đa 2 lần**, chưa mở lời thoại cho tới khi làm xong bài đó.",
        "Phần **Đọc**: **23 phút** cho 14 câu; làm Matching headings trước. Hết giờ thì dừng.",
        "Xong một phần thì **ghi điểm ra giấy**. Cuối bài đối chiếu với bảng dưới đây.",
      ],
    },
    {
      t: "table",
      caption: "Cách tính điểm — ĐẠT = từ 70 % trở lên ở TỪNG phần",
      head: ["Phần", "Số câu", "Đạt khi", "Chưa đạt thì ôn lại"],
      rows: [
        ["1. Ngữ pháp", "16 + 11", "≥ 19/27", "Ngày 7 · Ngữ pháp (mục 1–7) — Ngày 9 · Ngữ pháp (mục 1–5) — Ngày 11 · Ngữ pháp (mục 1–6)"],
        ["2. Từ vựng", "12 + 6", "≥ 13/18", "Ngày 8 · Từ vựng (mục 1–2) — Ngày 10 · Từ vựng (mục 1–2) — Ngày 12 · Từ vựng (mục 1–2)"],
        ["3. Dịch Việt → Anh", "6", "≥ 5/6", "Các bài dịch 💡 trong bài ngữ pháp Ngày 7, 9, 11 · Phần dịch Bài tập Ngày 8, 10, 12"],
        ["4. Nghe", "5 + 6 + 4 + 4", "≥ 14/19", "Ngày 7 · Nghe (mục 2–4: vị trí, giọng Mỹ, bản đồ) — Ngày 9 · Nghe (mục 2–4, gồm dạng nối mục 3) — Ngày 11 · Nghe (mục 1–3)"],
        ["5. Đọc", "4 + 4 + 3 + 3", "≥ 10/14", "Ngày 12 · Đọc (mục 1: Matching headings) — Ngày 8 · Đọc (mục 1–2: Short-answer, paraphrase) — Ngày 10 · Đọc (mục 1: trắc nghiệm)"],
        ["6. Viết", "12 câu + 2 bài", "6a + 6d ≥ 9/12; Task 1 AI ≥ band 4.5, có overview không số, số đúng hình; Task 2 trọn bài ≥ 250 từ, AI ≥ band 4.5, thesis trả lời đúng câu “outweigh”", "Ngày 12 · Viết (mục 2–3) — Ngày 8 · Viết (mục 2–3) — Ngày 10 · Viết (mục 1–3) — Ngày 10 · Từ vựng (mục 2)"],
        ["7. Nói", "1 thẻ Part 2 + 5 câu Part 1", "AI chấm ≥ band 4.5; Part 2 nói ≥ 1,5 phút; Part 1 câu đầu không lặp từ giám khảo", "Ngày 7 · Nói (mục 1–4) — Ngày 11 · Nói (mục 1–3) — Ngày 9 · Nói (mục 1–2)"],
        ["8. Phát âm", "8 dòng", "≥ 70 điểm ở ít nhất 6/8 dòng", "Ngày 7 · Nói mục 6 (/r/, /t/) — Ngày 8 · Từ vựng mục 4 (/æ ʌ ɑː/) — Ngày 9 · Nói mục 3 (cụm phụ âm) — Ngày 10 · Từ vựng mục 3 (/ɜː ɔː/) — Ngày 11 · Nói mục 4 (trọng âm) — Ngày 12 · Từ vựng mục 4 (âm tiết nuốt)"],
      ],
    },

    /* ───────────── 1. Ngữ pháp ───────────── */
    { t: "h", text: "Phần 1 — Ngữ pháp (16 + 11 câu · đạt ≥ 19/27 · trượt thì ôn Ngày 7, 9, 11)" },
    {
      t: "mcq",
      id: "t2d12-kt-ngu-phap",
      title: "Phần 1a — Chọn đáp án đúng (16 câu)",
      items: [
        { q: "(1) Be careful! That ladder isn't safe. You ___ fall.", options: ["will to", "falls", "are going to"], correct: 2, why: "Dự đoán có **bằng chứng trước mắt** (thang không chắc) → going to. (Ngày 7, mục 2)" },
        { q: "(2) “I'm freezing.” — “I ___ close the window.”", options: ["'ll", "am closing", "close"], correct: 0, why: "Quyết định **ngay lúc nói** → will. (Ngày 7, mục 1)" },
        { q: "(3) Our train ___ at 6.40 tomorrow morning.", options: ["will leaving", "leaves", "is leave"], correct: 1, why: "Lịch tàu cố định → hiện tại đơn. (Ngày 7, mục 4)" },
        { q: "(4) I ___ my grandparents on Sunday — they're expecting us for lunch.", options: ["visit", "'m visiting", "will to visit"], correct: 1, why: "Kế hoạch **đã hẹn** → hiện tại tiếp diễn. (Ngày 7, mục 3)" },
        { q: "(5) When I ___ my degree, I'll look for a job abroad.", options: ["finish", "will finish", "am going to finish"], correct: 0, why: "Mệnh đề **when** + hiện tại đơn. (Ngày 7, mục 6)" },
        { q: "(6) This street is ___ than it was ten years ago.", options: ["more noisier", "noisyer", "noisier"], correct: 2, why: "noisy → noisier (y → i + er), không thêm more. (Ngày 9, mục 1)" },
        { q: "(7) This is ___ hotel I've ever stayed in.", options: ["the baddest", "the worst", "the most bad"], correct: 1, why: "bad → worse → **the worst**. (Ngày 9, mục 1, 3)" },
        { q: "(8) Flying is ___ more expensive than taking the coach.", options: ["much", "very", "more"], correct: 0, why: "Mức độ + so sánh hơn: **much** more expensive (không dùng very). (Ngày 9, mục 2)" },
        { q: "(9) There are ___ cars in the countryside than in the city.", options: ["less", "little", "fewer"], correct: 2, why: "cars đếm được → **fewer**. (Ngày 9, mục 5)" },
        { q: "(10) My timetable this term is similar ___ last term's.", options: ["to", "with", "as"], correct: 0, why: "**similar to**. (Ngày 9, mục 4)" },
        { q: "(11) He's thinking of ___ his job next year.", options: ["change", "changing", "to change"], correct: 1, why: "Sau giới từ **of** → V-ing. (Ngày 11, mục 1)" },
        { q: "(12) She refused ___ the question.", options: ["answering", "answer", "to answer"], correct: 2, why: "**refuse + to V**. (Ngày 11, mục 3)" },
        { q: "(13) Do you mind ___ the door?", options: ["to close", "close", "closing"], correct: 2, why: "**mind + V-ing**. (Ngày 11, mục 2)" },
        { q: "(14) The teacher let us ___ early on Friday.", options: ["leave", "to leave", "leaving"], correct: 0, why: "**let + O + V** (không to). (Ngày 11, mục 4)" },
        { q: "(15) I'll never forget ___ to my first concert — it was amazing.", options: ["to go", "going", "go"], correct: 1, why: "Kỷ niệm đã qua → **forget + V-ing**. (Ngày 11, mục 5)" },
        { q: "(16) On the way home, we stopped ___ some fruit at the market.", options: ["to buy", "buying", "buy"], correct: 0, why: "Dừng lại **để** mua → **stop + to V**. (Ngày 11, mục 5)" },
      ],
    },
    {
      t: "quiz",
      id: "t2d12-kt-ngu-phap-dien",
      title: "Phần 1b — Viết dạng đúng / điền từ (11 câu)",
      kind: "fill",
      items: [
        { q: "(1) The concert ___ (start) at 8 p.m. tonight. (lịch)", answers: ["starts"] },
        { q: "(2) I think more people ___ (work) from home in ten years' time. (ý kiến — 2 từ)", answers: ["will work"] },
        { q: "(3) This exam was ___ (easy) than the last one.", answers: ["easier"] },
        { q: "(4) House prices in the suburbs were ___ (slight) lower than those in the centre.", answers: ["slightly"] },
        { q: "(5) We are looking forward to ___ (hear) from you soon.", answers: ["hearing"] },
        { q: "(6) The doctor advised me ___ (rest) for a week. (2 từ)", answers: ["to rest"] },
        { q: "(7) She improved her pronunciation by ___ (listen) to podcasts every day.", answers: ["listening"] },
        { q: "(8) It is the ___ (good) film I've seen this year.", answers: ["best"] },
        { q: "(9) By 2035, the number of electric buses in the city is ___ (expect) to reach 2,000. (dự báo Task 1)", answers: ["expected"] },
        { q: "(10) According to the forecast, rice exports ___ predicted to fall slightly over the next decade. (một từ)", answers: ["are"] },
        { q: "(11) Young people are ___ to spend even more time online in the future. (có khả năng — một từ)", answers: ["likely"] },
      ],
    },
    {
      t: "note",
      title: "Lời giải Phần 1b",
      items: [
        "**(1) starts** — lịch cố định (Ngày 7 mục 4). **(2) will work** — ý kiến I think (Ngày 7 mục 1).",
        "**(3) easier** — y → ier (Ngày 9 mục 1). **(4) slightly** — trạng từ mức độ trước so sánh hơn (Ngày 9 mục 2).",
        "**(5) hearing** — look forward to + V-ing (Ngày 11 mục 1). **(6) to rest** — advise + O + to V (Ngày 11 mục 4).",
        "**(7) listening** — by + V-ing (Ngày 11 mục 1). **(8) best** — good → better → the best (Ngày 9 mục 1, 3).",
        "**(9) expected** — dự báo: **is expected to + V** (bị động, V3). ~~is expecting~~ sai nghĩa (Ngày 7 mục 7).",
        "**(10) are** — chủ ngữ số nhiều **rice exports** → **are** predicted to (Ngày 7 mục 7).",
        "**(11) likely** — **be likely to + V** = có khả năng (Ngày 7 mục 7). (unlikely trái nghĩa với câu.)",
      ],
    },

    /* ───────────── 2. Từ vựng ───────────── */
    { t: "h", text: "Phần 2 — Từ vựng (12 + 6 câu · đạt ≥ 13/18 · trượt thì ôn Ngày 8, 10, 12)" },
    {
      t: "quiz",
      id: "t2d12-kt-tu-vung",
      title: "Phần 2a — Điền MỘT từ (12 câu)",
      kind: "fill",
      items: [
        { q: "(1) Traffic ___ is the city's biggest problem in the morning. (tắc nghẽn)", answers: ["congestion"] },
        { q: "(2) Train ___ are usually cheaper if you book early. (giá vé)", answers: ["fares"] },
        { q: "(3) House prices are lower in the ___ than in the city centre. (ngoại ô — số nhiều)", answers: ["suburbs", "outskirts"] },
        { q: "(4) More and more delivery vans in the city run ___ electricity.", answers: ["on"] },
        { q: "(5) The survey was ___ by a local university. (tiến hành)", answers: ["conducted"] },
        { q: "(6) The new airport will have a major ___ on the local economy. (tác động)", answers: ["impact", "effect", "influence"] },
        { q: "(7) The figure rose only ___, from 40% to 41%. (rất ít — trạng từ)", answers: ["marginally", "slightly"] },
        { q: "(8) The number of users ___ from 2 million to 6 million. (gấp ba — quá khứ)", answers: ["tripled", "trebled"] },
        { q: "(9) Bread is a ___ food in many European countries. (lương thực chính)", answers: ["staple"] },
        { q: "(10) Farmers spray ___ to protect their crops from insects. (thuốc trừ sâu)", answers: ["pesticides", "pesticide"] },
        { q: "(11) Fish ___ off very quickly if you leave it out of the fridge.", answers: ["goes"] },
        { q: "(12) The region suffered a severe ___ last summer — it didn't rain for months. (hạn hán)", answers: ["drought"] },
      ],
    },
    {
      t: "mcq",
      id: "t2d12-kt-tu-vung-chon",
      title: "Phần 2b — Họ từ & collocation (6 câu)",
      items: [
        { q: "(1) Meat ___ has fallen among young people in recent years.", options: ["consume", "consumer", "consumption"], correct: 2, why: "Danh từ chỉ **sự tiêu thụ**: consumption. (Ngày 10)" },
        { q: "(2) ___ produce is fresher because it travels a shorter distance.", options: ["Locally", "Local", "Location"], correct: 1, why: "Trước danh từ **produce** → tính từ **Local**. (Ngày 12)" },
        { q: "(3) The city has invested heavily ___ new cycle lanes.", options: ["in", "on", "to"], correct: 0, why: "**invest in**. (Ngày 8)" },
        { q: "(4) Lack of sleep can ___ your memory.", options: ["effect", "effective", "affect"], correct: 2, why: "Động từ **affect**; effect là danh từ. (Ngày 10)" },
        { q: "(5) Brown rice is richer in ___ than white rice.", options: ["nutritious", "nutrients", "nourish"], correct: 1, why: "**rich in** + danh từ: nutrients (chất dinh dưỡng). (Ngày 12)" },
        { q: "(6) The buses are badly ___ on Monday mornings.", options: ["overcrowd", "overcrowded", "overcrowding"], correct: 1, why: "Sau **are badly** → tính từ: overcrowded. (Ngày 8)" },
      ],
    },

    /* ───────────── 3. Dịch ───────────── */
    { t: "h", text: "Phần 3 — Dịch Việt → Anh (6 câu · đạt ≥ 5/6)" },
    {
      t: "quiz",
      id: "t2d12-kt-dich",
      title: "Phần 3 — Dịch sang tiếng Anh (6 câu)",
      kind: "translate",
      grammar: "am / is / are + V-ing (đã hẹn) · much + adj-er + than · encourage + O + to V · S + rose sharply · One major advantage of + N is that… · accounted for",
      items: [
        { q: "Sáng thứ Hai tuần sau tôi có buổi phỏng vấn xin việc (đã hẹn).", hint: "I'm having, a job interview, next Monday morning", answers: ["I'm having a job interview next Monday morning.", "I'm having a job interview on Monday morning next week.", "Next Monday morning, I'm having a job interview.", "I'm having an interview for a job next Monday morning.", "I'm going to a job interview next Monday morning.", "I'm attending a job interview next Monday morning.", "I have a job interview next Monday morning.", "I've got a job interview next Monday morning.", "I'm having a job interview on Monday morning.", "I'm having a job interview next Monday in the morning."] },
        { q: "Sống ở nông thôn rẻ hơn nhiều so với sống ở thành phố.", hint: "Living in the countryside, is much cheaper than, living in the city", answers: ["Living in the countryside is much cheaper than living in the city.", "Living in the countryside is far cheaper than living in the city.", "Living in the countryside is a lot cheaper than living in the city.", "Life in the countryside is much cheaper than life in the city.", "Living in the countryside is much cheaper than in the city.", "Living in the countryside is much cheaper than living in a city.", "It is much cheaper to live in the countryside than in the city.", "Living in the country is much cheaper than living in the city."] },
        { q: "Chính phủ nên khuyến khích người dân trồng nhiều cây hơn.", hint: "The government should encourage, people, to plant more trees", answers: ["The government should encourage people to plant more trees.", "Governments should encourage people to plant more trees.", "The government should encourage citizens to plant more trees.", "The government should encourage people to grow more trees."] },
        { q: "Nhìn chung, chi tiêu cho việc ăn ngoài tăng mạnh.", hint: "Overall, spending on eating out, rose sharply / dramatically", answers: ["Overall, spending on eating out rose sharply.", "Overall, spending on eating out rose dramatically.", "Overall, spending on eating out increased sharply.", "Overall, spending on eating out increased dramatically.", "Overall, there was a sharp rise in spending on eating out.", "Overall spending on eating out rose sharply.", "Overall, spending on eating out rose significantly.", "Overall, spending on eating out increased significantly.", "Overall, spending on eating out went up sharply."] },
        { q: "Một lợi ích lớn của thực phẩm địa phương là nó tươi hơn.", hint: "One major advantage of, local food, is that it is fresher", answers: ["One major advantage of local food is that it is fresher.", "One major advantage of local food is that it's fresher.", "One major benefit of local food is that it is fresher.", "One major advantage of locally grown food is that it is fresher.", "One major advantage of local food is its freshness.", "One major advantage of local produce is that it is fresher.", "A major advantage of local food is that it is fresher.", "One major advantage of local food is that it is fresher"] },
        { q: "Ô tô chiếm 52% số chuyến đi.", hint: "Cars, accounted for / made up, 52% of journeys / trips", answers: ["Cars accounted for 52% of journeys.", "Cars made up 52% of journeys.", "Cars accounted for 52% of trips.", "Cars made up 52% of trips.", "Cars accounted for 52% of all journeys.", "Cars accounted for 52 percent of journeys.", "Cars account for 52% of journeys.", "Cars make up 52% of journeys.", "Cars account for 52% of trips.", "Cars make up 52% of trips.", "Cars account for 52% of all journeys."] },
      ],
    },

    /* ───────────── 4. Nghe ───────────── */
    { t: "h", text: "Phần 4 — Nghe (5 + 6 + 4 + 4 câu · đạt ≥ 14/19 · trượt thì ôn Ngày 7, 9, 11)" },
    {
      t: "p",
      text: "**Bài 4a — Questions 1–5.** Label the map below. Write the correct letter, **A–H**. Một kiểm lâm (ranger) giọng Mỹ hướng dẫn khách đi vòng quanh hồ trong **Lakeside Park**. Bạn bắt đầu ở **West gate**. Đọc bản đồ 30 giây trước khi nghe.",
    },
    {
      t: "figure",
      fig: {
        kind: "map",
        title: "Lakeside Park — ghi chữ cái A–H cho câu 1–5",
        note: "Bản đồ tự vẽ cho bài kiểm tra. Phía trên là hướng Bắc. Lối đi chạy vòng quanh hồ.",
        map: {
          cols: 12,
          rows: 9,
          paths: [
            { x: 3.2, y: 2.2, w: 5.6, h: 0.7, label: "lake path" },
            { x: 3.2, y: 6.1, w: 5.6, h: 0.7 },
            { x: 3.2, y: 2.9, w: 0.7, h: 3.2 },
            { x: 8.1, y: 2.9, w: 0.7, h: 3.2 },
            { x: 1.8, y: 4.2, w: 1.4, h: 0.6 },
          ],
          boxes: [
            { x: 4.1, y: 3.1, w: 3.8, h: 2.8, label: "Lake" },
            { x: 0.2, y: 4.0, w: 1.6, h: 1.0, label: "West gate" },
            { x: 3.2, y: 0.4, w: 2.6, h: 1.5, blank: "A" },
            { x: 6.2, y: 0.4, w: 2.6, h: 1.5, blank: "B" },
            { x: 9.1, y: 2.2, w: 2.6, h: 1.7, blank: "C" },
            { x: 9.1, y: 4.6, w: 2.6, h: 1.7, blank: "D" },
            { x: 6.2, y: 7.1, w: 2.6, h: 1.5, blank: "E" },
            { x: 3.2, y: 7.1, w: 2.6, h: 1.5, blank: "F" },
            { x: 0.2, y: 1.4, w: 2.6, h: 2.2, blank: "G" },
            { x: 0.2, y: 5.4, w: 2.6, h: 2.2, blank: "H" },
          ],
          pins: [{ x: 1.0, y: 3.8, label: "You are here" }],
        },
      },
    },
    {
      t: "table",
      head: ["Câu", "Địa điểm", "Chữ cái"],
      rows: [
        ["1", "Visitor center", "___"],
        ["2", "Café", "___"],
        ["3", "Bike rental", "___"],
        ["4", "Boat hire", "___"],
        ["5", "Children's play area", "___"],
      ],
    },
    {
      t: "listen",
      id: "t2d12-kt-nghe-ban-do",
      title: "A walk around Lakeside Park",
      dan: { so: "Checkpoint Test, Recording 1", boiCanh: "a park ranger giving directions to a group of visitors.", cau: [1, 5] },
      note: "Khoảng 2 phút, giọng Mỹ: ranger (nam), một khách (nữ). Nghe tối đa 2 lần.",
      lines: [
        { who: "Ranger", voice: "us-nam", text: "Welcome to Lakeside Park, folks. You're standing at the West gate. Right next to the gate, on the north side of the path, is the visitor center — that's where you can pick up a free map. The building just south of the gate path is the restrooms.", vi: "Chào mừng mọi người đến công viên Lakeside. Các bạn đang đứng ở cổng Tây. Ngay cạnh cổng, phía bắc lối đi, là trung tâm du khách — nơi lấy bản đồ miễn phí. Toà nhà ngay phía nam lối vào cổng là nhà vệ sinh." },
        { who: "Ranger", voice: "us-nam", text: "Walk along this path until you reach the lake, then turn left and follow the lake path clockwise. When the path turns east, along the north side of the lake, the first building on your left is the café.", vi: "Đi theo lối này đến hồ, rồi rẽ trái và đi theo lối quanh hồ theo chiều kim đồng hồ. Khi lối đi rẽ sang hướng đông, dọc bờ bắc của hồ, toà nhà đầu tiên bên trái là quán cà phê." },
        { who: "Visitor", voice: "us-nu", text: "Is that where we rent the boats?", vi: "Đó có phải chỗ thuê thuyền không ạ?" },
        { who: "Ranger", voice: "us-nam", text: "Not any more. The next building along used to be the boat hire office, but it's now the bike rental shop. Boats are rented from the east side now. When the path turns south, the first building on your left is the boat hire office. Just past that is the first-aid post.", vi: "Không còn nữa. Toà nhà tiếp theo trước đây là văn phòng thuê thuyền, nhưng giờ là cửa hàng cho thuê xe đạp. Giờ thuê thuyền ở phía đông. Khi lối đi rẽ xuống hướng nam, toà nhà đầu tiên bên trái là văn phòng thuê thuyền. Ngay sau đó là trạm sơ cứu." },
        { who: "Ranger", voice: "us-nam", text: "Then the path turns west, along the south side. On your left, at the east end, you'll find the children's play area — it's diagonally opposite the café, on the other side of the lake. And at the west end of the south side is the rose garden.", vi: "Rồi lối đi rẽ sang hướng tây, dọc bờ nam. Bên trái, ở đầu phía đông, là khu vui chơi trẻ em — nó nằm chéo đối diện quán cà phê, ở phía bên kia hồ. Còn ở đầu phía tây của bờ nam là vườn hồng." },
        { who: "Visitor", voice: "us-nu", text: "Great, thank you!", vi: "Tuyệt, cảm ơn anh!" },
      ],
    },
    {
      t: "quiz",
      id: "t2d12-kt-nghe-ban-do-dien",
      title: "Bài 4a — Questions 1–5 (ghi MỘT chữ cái A–H)",
      kind: "fill",
      items: [
        { q: "1. Visitor center ___", answers: ["G"] },
        { q: "2. Café ___", answers: ["A"] },
        { q: "3. Bike rental ___", answers: ["B"] },
        { q: "4. Boat hire ___", answers: ["C"] },
        { q: "5. Children's play area ___", answers: ["E"] },
      ],
    },
    {
      t: "note",
      title: "Giải thích 4a",
      items: [
        "**1 — G**: “Right next to the gate, on the **north side** of the path” — ô phía trên lối vào cổng. (H — phía nam — là nhà vệ sinh.)",
        "**2 — A**: rẽ trái ở hồ (đi lên phía Bắc), rồi lối đi rẽ **đông** dọc bờ bắc; đang đi về phía Đông thì **bên trái = phía Bắc** → ô đầu tiên phía trên lối là **A**.",
        "**3 — B**: bẫy **used to be… but it's now**: “The next building along **used to be** the boat hire office, **but it's now** the bike rental shop.”",
        "**4 — C**: “When the path turns **south**, the **first** building on your left” — đi xuống phía Nam thì bên trái = phía **Đông** → ô trên của phía đông là **C**. (D — ngay sau — là trạm sơ cứu.)",
        "**5 — E**: bờ nam, đi về phía Tây, bên trái = phía **Nam**; “at the **east end**… **diagonally opposite** the café” → **E** (chéo với A qua hồ). F là vườn hồng.",
      ],
    },
    {
      t: "p",
      text: "**Bài 4b — Questions 6–11.** Complete the form below. Write **ONE WORD AND/OR A NUMBER** for each answer.",
    },
    {
      t: "table",
      caption: "City Tours — booking form",
      head: ["Mục", "Thông tin"],
      rows: [
        ["Name", "Sophie (6) ______"],
        ["Type of tour", "(7) ______ tour"],
        ["Number of people", "(8) ______"],
        ["Meeting point", "outside the (9) ______"],
        ["Price per person", "$ (10) ______"],
        ["Bring", "a (11) ______"],
      ],
    },
    {
      t: "listen",
      id: "t2d12-kt-nghe-phieu",
      title: "Booking a city tour",
      dan: { so: "Checkpoint Test, Recording 2", boiCanh: "a telephone conversation between a woman and a tour company employee.", cau: [6, 11] },
      note: "Khoảng 2 phút. Nhân viên (giọng Anh, nam), Sophie (giọng Mỹ, nữ). Nghe tối đa 2 lần.",
      lines: [
        { who: "Employee", voice: "uk-nam", text: "City Tours, good afternoon. How can I help?", vi: "City Tours xin nghe. Tôi giúp gì được ạ?" },
        { who: "Sophie", voice: "us-nu", text: "Hi, I'd like to book a tour for this Saturday. My name's Sophie Brennan — B-R-E-N-N-A-N.", vi: "Chào anh, tôi muốn đặt một tour cho thứ Bảy này. Tôi là Sophie Brennan — B-R-E-N-N-A-N." },
        { who: "Employee", voice: "uk-nam", text: "Thank you, Ms Brennan. Which tour are you interested in?", vi: "Cảm ơn chị Brennan. Chị quan tâm tour nào?" },
        { who: "Sophie", voice: "us-nu", text: "I was hoping to do the walking tour.", vi: "Tôi định tham gia tour đi bộ." },
        { who: "Employee", voice: "uk-nam", text: "I'm afraid the walking tour is fully booked this Saturday. But we still have places on the cycling tour — it covers the same sights, and the bikes are included.", vi: "Tiếc là tour đi bộ thứ Bảy này đã kín chỗ. Nhưng tour xe đạp vẫn còn chỗ — đi qua đúng những điểm đó, và đã gồm xe đạp." },
        { who: "Sophie", voice: "us-nu", text: "Oh, cycling sounds fun. Let's do that.", vi: "Ồ, đạp xe nghe vui đấy. Vậy chọn tour đó." },
        { who: "Employee", voice: "uk-nam", text: "How many people will there be?", vi: "Sẽ có bao nhiêu người ạ?" },
        { who: "Sophie", voice: "us-nu", text: "Four of us. Oh, wait — my brother just texted to say he's coming too, so five.", vi: "Bốn người. À khoan — em trai tôi vừa nhắn là cũng đi, vậy năm." },
        { who: "Employee", voice: "uk-nam", text: "Five, lovely. Now, the meeting point. We used to meet outside the museum, but there are road works there at the moment, so all tours now start outside the cathedral.", vi: "Năm người, tốt quá. Giờ đến điểm hẹn. Trước đây chúng tôi gặp trước bảo tàng, nhưng hiện ở đó đang sửa đường, nên mọi tour giờ xuất phát trước nhà thờ lớn." },
        { who: "Sophie", voice: "us-nu", text: "The cathedral. Got it. And how much is it per person?", vi: "Nhà thờ lớn. Rồi ạ. Mỗi người bao nhiêu tiền?" },
        { who: "Employee", voice: "uk-nam", text: "It's normally forty dollars. There's a twenty percent discount if you book on our website, which would make it thirty-two, but for phone bookings it's the full price, I'm afraid.", vi: "Bình thường là bốn mươi đô. Đặt trên trang web được giảm hai mươi phần trăm, tức là ba mươi hai, nhưng đặt qua điện thoại thì tiếc là phải trả giá đầy đủ." },
        { who: "Sophie", voice: "us-nu", text: "That's fine, I'll book now. Do we need to bring anything? Water?", vi: "Không sao, tôi đặt luôn. Chúng tôi có cần mang gì không? Nước chẳng hạn?" },
        { who: "Employee", voice: "uk-nam", text: "No need — we provide water. But it can be cold by the river, so everyone should bring a jacket.", vi: "Không cần — chúng tôi có nước. Nhưng ven sông có thể lạnh, nên ai cũng nên mang một chiếc áo khoác." },
      ],
    },
    {
      t: "quiz",
      id: "t2d12-kt-nghe-phieu-dien",
      title: "Bài 4b — Questions 6–11 (ONE WORD AND/OR A NUMBER)",
      kind: "fill",
      items: [
        { q: "6. Name: Sophie ___", answers: ["Brennan"] },
        { q: "7. Type of tour: ___ tour", answers: ["cycling"] },
        { q: "8. Number of people: ___", answers: ["5", "five"] },
        { q: "9. Meeting point: outside the ___", answers: ["cathedral"] },
        { q: "10. Price per person: $ ___", answers: ["40", "forty"] },
        { q: "11. Bring a ___", answers: ["jacket"] },
      ],
    },
    {
      t: "note",
      title: "Giải thích 4b — bẫy nào ở câu nào?",
      items: [
        "**6 Brennan** — đánh vần; hai chữ **N** liền nhau.",
        "**7 cycling** — ý bị bác: walking tour “**fully booked**”, “**But** we still have places on the **cycling** tour”. Bài kiểm tra chấm như thi thật: chỉ nhận **đúng từ nghe được** (bike / bicycle không được chấm).",
        "**8 5** — sửa lời: “Four of us. **Oh, wait**… **so five**.”",
        "**9 cathedral** — quá khứ vs hiện tại: “We **used to** meet outside the museum, **but**… **now** start outside the cathedral”.",
        "**10 40** — ba con số: 40 (giá thường), 20% (giảm giá), 32 (giá web). Sophie đặt **qua điện thoại** → **full price** = 40.",
        "**11 jacket** — water bị loại (“**No need** — we provide water”); đoán loại từ: **a + danh từ số ít**.",
      ],
    },
    {
      t: "listen",
      id: "t2d12-kt-nghe-thong-bao",
      title: "Announcement at a sports centre",
      dan: { so: "Checkpoint Test, Recording 3", boiCanh: "an announcement at a sports centre about changes to its timetable.", cau: [12, 15] },
      note: "Khoảng 1 phút. Quản lý (giọng Anh, nữ) + lễ tân (giọng Mỹ, nam). Nghe tối đa 2 lần. Chú ý từ báo hiệu.",
      lines: [
        { who: "Receptionist", voice: "us-nam", text: "Attention please, everyone. Our manager, Helen, would like to say a few words before the evening classes begin.", vi: "Xin mọi người chú ý. Quản lý của chúng ta, chị Helen, muốn nói vài lời trước khi các lớp buổi tối bắt đầu." },
        { who: "Helen", voice: "uk-nu", text: "Thanks, Josh. I've got four quick pieces of news. First of all, the swimming pool. It will close for cleaning next Monday, but it'll reopen on Tuesday morning as usual.", vi: "Cảm ơn Josh. Tôi có bốn tin nhanh. Trước hết là bể bơi. Thứ Hai tới bể sẽ đóng để vệ sinh, nhưng sáng thứ Ba mở lại như thường." },
        { who: "Helen", voice: "uk-nu", text: "Moving on to the yoga classes. We were planning to move them to the large hall, but it's too noisy, so they'll stay in Studio 2.", vi: "Chuyển sang các lớp yoga. Chúng tôi định chuyển chúng sang hội trường lớn, nhưng ở đó ồn quá, nên các lớp vẫn ở Phòng tập 2." },
        { who: "Helen", voice: "uk-nu", text: "The most important thing, though, is the car park. From the first of next month, members will need to show their membership card to park for free. And finally, the café now closes at nine instead of eight. Enjoy your evening.", vi: "Tuy nhiên, điều quan trọng nhất là bãi đỗ xe. Từ ngày mùng một tháng sau, thành viên cần xuất trình thẻ thành viên để được đỗ xe miễn phí. Và cuối cùng, quán cà phê giờ đóng cửa lúc chín giờ thay vì tám giờ. Chúc mọi người buổi tối vui vẻ." },
      ],
    },
    {
      t: "mcq",
      id: "t2d12-kt-nghe-thong-bao-chon",
      title: "Bài 4c — Questions 12–15 (chọn A, B hoặc C)",
      items: [
        { q: "12. What is the FIRST piece of news about?", options: ["A the swimming pool", "B the yoga classes", "C the café"], correct: 0, why: "“**First of all**, the swimming pool.”" },
        { q: "13. Where will the yoga classes take place?", options: ["A in the large hall", "B in Studio 2", "C in the swimming pool area"], correct: 1, why: "Kế hoạch đổi: “We **were planning to** move them to the large hall, **but** it's too noisy, so they'll **stay in Studio 2**.”" },
        { q: "14. What does Helen say is the MOST important news?", options: ["A the café's new closing time", "B the pool cleaning", "C a new rule for parking"], correct: 2, why: "“**The most important thing**, though, is the car park… show their membership card to park for free.”" },
        { q: "15. The café now closes at", options: ["A 9 p.m.", "B 8 p.m.", "C 10 p.m."], correct: 0, why: "“the café now closes at **nine instead of eight**.” 8 là giờ **cũ**." },
      ],
    },
    {
      t: "p",
      text: "**Bài 4d — Questions 16–19.** What can visitors find at each stall at the Riverside Food Festival? Choose **FOUR** answers from the box and write the correct letter, **A–F**, next to Questions 16–19. (Dạng **nối** của Part 2 — Ngày 9 mục 3.)",
    },
    {
      t: "table",
      caption: "Questions 16–19 (đọc trước)",
      head: ["Chữ", "What visitors can find", "Câu", "Stall"],
      rows: [
        ["A", "a cooking demonstration", "16", "The Green Pot"],
        ["B", "dishes from other countries", "17", "Mama Lan's Kitchen"],
        ["C", "a discount for students", "18", "The Bakery Van"],
        ["D", "vegetarian dishes only", "19", "Spice Road"],
        ["E", "free samples", "", ""],
        ["F", "food made from local farm produce", "", ""],
      ],
    },
    {
      t: "listen",
      id: "t2d12-kt-nghe-noi",
      title: "A guide to the Riverside Food Festival",
      dan: { so: "Checkpoint Test, Recording 4", boiCanh: "a festival organiser talking about some of the food stalls.", cau: [16, 19] },
      note: "Khoảng 1 phút 30. Người tổ chức (giọng Anh, nam), một khách (giọng Mỹ, nữ). Nghe tối đa 2 lần.",
      lines: [
        { who: "Organiser", voice: "uk-nam", text: "Welcome to the Riverside Food Festival. Let me tell you about four stalls you shouldn't miss. First, The Green Pot. A lot of people assume it serves chicken and fish as well, but in fact everything on the menu there is vegetarian — there's no meat or fish at all.", vi: "Chào mừng đến Lễ hội Ẩm thực Riverside. Tôi giới thiệu bốn quầy không nên bỏ qua. Đầu tiên, The Green Pot. Nhiều người tưởng quầy này có cả gà và cá, nhưng thật ra mọi món ở đó đều chay — hoàn toàn không có thịt hay cá." },
        { who: "Organiser", voice: "uk-nam", text: "Next, Mama Lan's Kitchen. Lan used to hand out free samples of her spring rolls, but the queues got far too long. So this year, instead, she's running a cooking demonstration every hour, and you can watch her make them from start to finish.", vi: "Tiếp theo, Mama Lan's Kitchen. Trước đây chị Lan phát miễn phí chả giò để nếm thử, nhưng hàng người xếp dài quá. Nên năm nay, thay vào đó, chị trình diễn nấu ăn mỗi giờ một lần, và bạn có thể xem chị làm từ đầu đến cuối." },
        { who: "Visitor", voice: "us-nu", text: "What about the Bakery Van? Do they give a discount to students?", vi: "Còn Bakery Van thì sao? Họ có giảm giá cho sinh viên không?" },
        { who: "Organiser", voice: "uk-nam", text: "Not this year, I'm afraid — only the coffee cart does that. But what's special about the Bakery Van is that all the flour, butter and eggs come from farms less than twenty miles from here.", vi: "Năm nay thì không, tiếc quá — chỉ có xe cà phê giảm giá thôi. Nhưng điều đặc biệt ở Bakery Van là toàn bộ bột, bơ và trứng đều từ các trang trại cách đây chưa tới hai mươi dặm." },
        { who: "Organiser", voice: "uk-nam", text: "And finally, Spice Road. The chef there has travelled all over the world, and the menu changes every day, with dishes from Thailand, India and Mexico.", vi: "Và cuối cùng, Spice Road. Đầu bếp ở đó đã đi khắp thế giới, thực đơn đổi mỗi ngày, với các món từ Thái Lan, Ấn Độ và Mexico." },
      ],
    },
    {
      t: "quiz",
      id: "t2d12-kt-nghe-noi-dien",
      title: "Bài 4d — Questions 16–19 (ghi MỘT chữ cái A–F)",
      kind: "fill",
      items: [
        { q: "16. The Green Pot ___", answers: ["D"] },
        { q: "17. Mama Lan's Kitchen ___", answers: ["A"] },
        { q: "18. The Bakery Van ___", answers: ["F"] },
        { q: "19. Spice Road ___", answers: ["B"] },
      ],
    },
    {
      t: "note",
      title: "Giải thích 4d",
      items: [
        "**16 — D**: “A lot of people **assume**… **but in fact** everything… is **vegetarian** — no meat or fish **at all**” = vegetarian dishes **only**.",
        "**17 — A**: bẫy **E**: Lan “**used to** hand out **free samples**… So this year, **instead**, she's running a **cooking demonstration**”.",
        "**18 — F**: bẫy **C**: “Not this year… **only the coffee cart** does that” (xe cà phê không có trong câu hỏi). Đáp án: nguyên liệu “**come from farms less than twenty miles from here**” = food made from **local farm produce**.",
        "**19 — B**: “dishes from **Thailand, India and Mexico**” = dishes from **other countries** (paraphrase).",
        "Hai phương án thừa: **E** (không còn phát mẫu thử) và **C** (chỉ xe cà phê giảm giá).",
      ],
    },

    /* ───────────── 5. Đọc ───────────── */
    { t: "h", text: "Phần 5 — Đọc (4 + 4 + 3 + 3 câu · đạt ≥ 10/14 · 23 phút · trượt thì ôn Ngày 8, 10, 12)" },
    {
      t: "table",
      caption: "List of Headings (Questions 1–4)",
      head: ["Số", "Heading"],
      rows: [
        ["i", "Passengers who want to fly less"],
        ["ii", "Why sleeper trains almost disappeared"],
        ["iii", "The cost of a good night's sleep"],
        ["iv", "Faster trains between capital cities"],
        ["v", "What governments could do next"],
        ["vi", "The problem of noisy carriages"],
      ],
    },
    {
      t: "passage",
      title: "The return of the night train",
      intro: "Bài đọc 4 đoạn (A–D), khoảng 330 từ.",
      paras: [
        { label: "A", text: "For much of the twentieth century, travelling overnight by train was a normal way to cross Europe. Passengers boarded in the evening, slept in a bed or a reclining seat, and woke up in another country. By the 2010s, however, many of these services had been cancelled. Budget airlines could carry people between major cities in an hour or two, often for less than the price of a train ticket, and new high-speed lines meant that daytime trains could cover long distances quickly. Old sleeper carriages were expensive to maintain, and operators saw little reason to replace them." },
        { label: "B", text: "In the last decade, however, a number of routes have been brought back. The main reason is a change in what travellers want. A growing number of people are worried about the environmental impact of flying, since a train journey of the same distance usually produces far lower carbon emissions per passenger. For these travellers, a night train offers a way to make a long international journey without getting on a plane, while still arriving early in the morning." },
        { label: "C", text: "Comfort comes at a price. Modern sleeper trains offer private cabins with proper beds, and some even provide small individual pods for single travellers. But tickets are rarely cheap. On one popular route, a private cabin for two people costs roughly twice as much as two budget flights. Operators say that this is because they must pay staff to work through the night and pay high charges to use the railway lines in each country the train passes through." },
        { label: "D", text: "Supporters argue that the price comparison is unfair, because a night train also saves the cost of a hotel room and delivers passengers to the centre of a city rather than to an airport an hour away. Several governments are now considering whether to reduce track charges or offer direct support to night services. If they do, prices could fall, and the night train may become an everyday choice once again rather than a special treat." },
      ],
    },
    {
      t: "quiz",
      id: "t2d12-kt-doc-tieu-de",
      title: "Questions 1–4 — Matching headings (ghi i–vi)",
      kind: "fill",
      items: [
        { q: "1. Paragraph A ___", answers: ["ii"] },
        { q: "2. Paragraph B ___", answers: ["i"] },
        { q: "3. Paragraph C ___", answers: ["iii"] },
        { q: "4. Paragraph D ___", answers: ["v"] },
      ],
    },
    {
      t: "quiz",
      id: "t2d12-kt-doc-cau-ngan",
      title: "Questions 5–8 — Answer with NO MORE THAN THREE WORDS AND/OR A NUMBER",
      kind: "fill",
      items: [
        { q: "5. What did passengers on overnight trains sleep in, apart from a bed?", answers: ["reclining seat", "a reclining seat"] },
        { q: "6. What kind of airlines carried people between major cities cheaply?", answers: ["budget airlines", "budget"] },
        { q: "7. What do some modern trains provide for people travelling alone?", answers: ["individual pods", "small individual pods", "pods"] },
        { q: "8. What, besides staff wages, makes night train tickets expensive?", answers: ["track charges", "high charges", "charges"] },
      ],
    },
    {
      t: "mcq",
      id: "t2d12-kt-doc-chon",
      title: "Questions 9–11 — Choose the correct letter, A, B, C or D",
      items: [
        { q: "9. According to paragraph B, many travellers now choose night trains because", options: ["A they are cheaper than flying.", "B they are faster than daytime trains.", "C they produce less carbon than planes.", "D airports are too crowded."], correct: 2, why: "“worried about the **environmental impact of flying**… a train journey… produces **far lower carbon emissions**”. A ngược (đoạn C: thường **đắt hơn**)." },
        { q: "10. On one popular route, a cabin for two costs", options: ["A about the same as two budget flights.", "B less than a daytime train ticket.", "C half the price of a hotel room.", "D around double the price of two budget flights."], correct: 3, why: "“costs **roughly twice as much as** two budget flights” = **around double** (paraphrase Ngày 8, so sánh Ngày 9)." },
        { q: "11. What is the writer's main point in paragraph D?", options: ["A Night trains could become cheaper with government help.", "B Hotels in city centres are too expensive.", "C Night trains will soon replace all flights.", "D Airports are usually located in city centres."], correct: 0, why: "Hai ý: so sánh giá **chưa công bằng** + chính phủ **giảm phí / hỗ trợ** → giá có thể giảm. C quá tuyệt đối; D ngược (sân bay **cách xa** trung tâm)." },
      ],
    },
    {
      t: "mcq",
      id: "t2d12-kt-doc-paraphrase",
      title: "Questions 12–14 — Câu nào cùng nghĩa với câu trong bài? (paraphrase — Ngày 8)",
      items: [
        { q: "12. Bài (đoạn A): “Old sleeper carriages were expensive to maintain.”", options: ["A Keeping old sleeper carriages in good condition cost a lot.", "B Old sleeper carriages were cheap to repair.", "C Nobody wanted to travel in old carriages."], correct: 0, why: "**expensive** → **cost a lot** (①); **maintain** → **keeping… in good condition** (③). B ngược ý; C không có trong bài." },
        { q: "13. Bài (đoạn B): “A growing number of people are worried about the environmental impact of flying.”", options: ["A Fewer people care about the environment.", "B Concern about how flying affects the environment is increasing.", "C Flying has become more harmful to the environment."], correct: 1, why: "**A growing number of people are worried** → **Concern… is increasing** (② tính từ worried → danh từ concern + ③); **impact of** → **how… affects** (②). C nói một ý khác (mức độ gây hại tăng) mà bài không nói." },
        { q: "14. Bài (đoạn D): “A night train also saves the cost of a hotel room.”", options: ["A Night train tickets include a free hotel room.", "B Hotels near railway stations are cheap.", "C Travellers on a night train do not need to pay for a hotel."], correct: 2, why: "**saves the cost of** → **do not need to pay for** (③ đổi cấu trúc). A sai: vé **không gồm** phòng khách sạn — chỉ là **không cần** khách sạn." },
      ],
    },
    {
      t: "note",
      title: "Giải thích Phần 5",
      items: [
        "**1 — ii**: đoạn A kể vì sao tàu đêm **gần như biến mất** (máy bay giá rẻ, tàu cao tốc, toa cũ tốn kém). Bẫy **iv**: có nhắc high-speed lines nhưng chỉ là **một lý do**.",
        "**2 — i**: lý do chính quay lại = khách **lo tác động môi trường của máy bay** → muốn **bay ít hơn**.",
        "**3 — iii**: “**Comfort comes at a price**… tickets are rarely cheap” = cái giá của một giấc ngủ ngon. Bẫy **vi**: không đoạn nào nói tiếng ồn.",
        "**4 — v**: chính phủ **considering** giảm phí / hỗ trợ.",
        "**5 reclining seat** — “slept in a bed **or** a reclining seat”. **6 budget (airlines)** — “Budget airlines could carry people… for less”.",
        "**7 (small) individual pods** — “**for single travellers**” ↔ “people travelling **alone**”. 3 từ: small individual pods ✓.",
        "**8 track charges / high charges** — “pay high charges to use the railway lines”; đoạn D gọi là **track charges**. Cả hai đều chép từ bài, đều ≤ 3 từ.",
        "**12 A · 13 B · 14 C** — ba cách paraphrase của Ngày 8: ① đồng nghĩa · ② đổi loại từ · ③ đổi cấu trúc (giải thích chi tiết ở từng câu).",
      ],
    },

    /* ───────────── 6. Viết ───────────── */
    { t: "h", text: "Phần 6 — Viết (12 câu + Task 1 + Task 2 trọn bài · trượt thì ôn Ngày 8, 10, 12)" },
    {
      t: "p",
      text: "**Bài 6a + 6d** (~7 phút, 12 câu, đạt ≥ 9/12): điền MỘT từ vào bài mẫu biểu đồ tròn + chọn câu đúng với một biểu đồ tròn mới. **Bài 6b** (~20 phút): Task 1 biểu đồ cột không có năm, ≥ 150 từ. **Bài 6c** (~40 phút): Task 2 lợi – hại **trọn bài 4 đoạn, ≥ 250 từ** — đúng điều kiện thi thật.",
    },
    {
      t: "figure",
      fig: {
        kind: "pie",
        title: "Main reasons why people in one city chose to cycle to work, 2024",
        note: "Số liệu tự đặt cho bài kiểm tra.",
        unit: "%",
        slices: [
          { label: "Saving money", value: 40 },
          { label: "Health & fitness", value: 30 },
          { label: "Avoiding traffic", value: 20 },
          { label: "Environment", value: 10 },
        ],
      },
    },
    {
      t: "examples",
      items: [
        { en: "The pie chart illustrates the main reasons why people in one city cycled to work in 2024. (1) ___, financial reasons were the most common, while concern for the environment was the least important factor. Saving money was the (2) ___ category, at two-fifths of responses. Health and fitness made (3) ___ 30%, and avoiding traffic was mentioned by a (4) ___ of cyclists. Only one in ten people said they cycled to protect the environment, which was the smallest (5) ___ of the four. In other words, the proportion of people who cycled to save money was four times as (6) ___ as the figure for the environment. The two most popular reasons together (7) ___ for 70% of the total, (8) ___ the other two made up less than a third.", vi: "Biểu đồ tròn cho thấy các lý do chính khiến người dân một thành phố đạp xe đi làm năm 2024…" },
      ],
    },
    {
      t: "quiz",
      id: "t2d12-kt-viet-dien",
      title: "Bài 6a — Điền MỘT từ (8 câu)",
      kind: "fill",
      items: [
        { q: "(1) ___, financial reasons were the most common… (nhìn chung — một từ)", answers: ["Overall"] },
        { q: "(2) Saving money was the ___ category, at two-fifths of responses.", answers: ["largest", "biggest"] },
        { q: "(3) Health and fitness made ___ 30%.", answers: ["up"] },
        { q: "(4) …avoiding traffic was mentioned by a ___ of cyclists. (20%)", answers: ["fifth"] },
        { q: "(5) …which was the smallest ___ of the four. (phần / tỉ lệ)", answers: ["share", "proportion", "percentage", "category"] },
        { q: "(6) …four times as ___ as the figure for the environment.", answers: ["high", "large", "great"] },
        { q: "(7) The two most popular reasons together ___ for 70% of the total.", answers: ["accounted"] },
        { q: "(8) …, ___ the other two made up less than a third. (trong khi)", answers: ["whereas", "while"] },
      ],
    },
    {
      t: "p",
      text: "**Bài 6d — 4 câu (tính chung với 6a, đạt ≥ 9/12).** Đọc biểu đồ tròn mới dưới đây và chọn câu mô tả **ĐÚNG với hình** — kiểm ngôn ngữ tỉ lệ và đọc số của Ngày 12.",
    },
    {
      t: "figure",
      fig: {
        kind: "pie",
        title: "Sources of electricity in one country, 2024",
        note: "Số liệu tự đặt cho bài kiểm tra. Tổng = 100%.",
        unit: "%",
        slices: [
          { label: "Coal", value: 38 },
          { label: "Hydropower", value: 27 },
          { label: "Gas", value: 15 },
          { label: "Solar", value: 12 },
          { label: "Wind", value: 8 },
        ],
      },
    },
    {
      t: "mcq",
      id: "t2d12-kt-viet-pie-chon",
      title: "Bài 6d — Câu nào ĐÚNG với hình? (4 câu)",
      items: [
        { q: "(1)", options: ["Coal accounted for nearly two-fifths of the country's electricity.", "Coal made up just over half of the country's electricity.", "Coal was the second largest source."], correct: 0, why: "38% ≈ 40% = **two-fifths** → “nearly” ✓. Một nửa = 50% (sai); coal là nguồn **lớn nhất**." },
        { q: "(2)", options: ["Hydropower made up the smallest share.", "Hydropower represented just over a quarter of the total.", "Coal and hydropower together accounted for less than half."], correct: 1, why: "27% > 25% → **just over a quarter** ✓. Nhỏ nhất là wind (8%); coal + hydro = 65% (> một nửa)." },
        { q: "(3)", options: ["Gas and solar provided exactly the same share.", "Wind was the largest renewable source.", "Gas generated roughly twice as much electricity as wind."], correct: 2, why: "15 ≈ 2 × 8 = 16 → **roughly twice** ✓. Gas 15 ≠ solar 12; nguồn tái tạo lớn nhất là **hydropower** (27)." },
        { q: "(4)", options: ["Solar accounted for a larger share than gas.", "Solar and wind together made up a fifth of the total.", "The remaining 12% came from wind."], correct: 1, why: "12 + 8 = 20% = **a fifth** ✓. Solar (12) < gas (15); phần nhỏ nhất là wind **8%**, không phải 12%." },
      ],
    },
    {
      t: "figure",
      fig: {
        kind: "bar",
        title: "Percentage of food wasted at four stages in two countries, 2023",
        note: "Số liệu tự đặt cho bài kiểm tra. Mỗi cột là % của toàn bộ thực phẩm sản xuất ra bị bỏ phí ở khâu đó — cộng bốn khâu: nước A 36%, nước B 34%.",
        unit: "% of food produced",
        categories: ["On farms", "In transport", "In shops", "In homes"],
        series: [
          { name: "Country A", values: [12, 6, 4, 14] },
          { name: "Country B", values: [6, 3, 7, 18] },
        ],
      },
    },
    {
      t: "essay",
      id: "t2d12-kt-viet-task1",
      task: "Task 1",
      prompt: "The bar chart above shows the percentage of food that was wasted at four stages, from farms to homes, in two countries in 2023. Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words. (Data — Country A: on farms 12%, in transport 6%, in shops 4%, in homes 14% · Country B: on farms 6%, in transport 3%, in shops 7%, in homes 18%. In total, Country A wasted 36% of its food and Country B 34%.)",
      minWords: 150,
      tips: [
        "Overview (không số): ở **cả hai nước**, khâu **gia đình** lãng phí nhiều nhất; nước A lãng phí nhiều hơn ở **đầu chuỗi** (nông trại, vận chuyển), nước B ở **cuối chuỗi** (cửa hàng, gia đình); tổng lượng bỏ phí của hai nước **gần bằng nhau** (36% và 34%).",
        "Body 1: **đầu chuỗi** — farms 12 vs 6 và transport 6 vs 3: nước A **twice as high as** nước B ✓ (nhân thử: 6 × 2 = 12, 3 × 2 = 6). Body 2: **cuối chuỗi** — shops 7 vs 4 (**almost twice**: 4 × 2 = 8 > 7) và homes 18 vs 14 (**higher**, KHÔNG phải twice).",
        "Quá khứ đơn (2023). Ít nhất 4 cấu trúc so sánh của Ngày 8–9.",
      ],
    },
    {
      t: "essay",
      id: "t2d12-kt-viet-task2",
      task: "Task 2",
      prompt: "In many countries, supermarkets now sell food that has been imported from all over the world, so people can buy almost any fruit or vegetable at any time of year. Do the advantages of this outweigh the disadvantages? Give reasons for your answer and include any relevant examples from your own knowledge or experience. Write at least 250 words.",
      minWords: 250,
      tips: [
        "Thesis bắt buộc nói bên nào nặng hơn: “**Although…, I believe the advantages / disadvantages clearly outweigh…**” (Ngày 10, mục 1–2).",
        "Thân bài: **One major advantage / drawback of… is that…** → **This means that…** → **For example, …**. Từ Ngày 12: **imported, seasonal, locally grown, food miles, perishable, smallholder farmers**.",
        "Kết bài: **On balance, …** + tóm lý do — không thêm ý mới.",
        "Bài trọn 4 đoạn như thi thật, **40 phút**, ≥ 250 từ (dưới 250 từ là bị trừ điểm TR). Dàn ý 5 phút trước khi viết (Ngày 10, mục 3).",
      ],
    },

    /* ───────────── 7. Nói ───────────── */
    { t: "h", text: "Phần 7 — Nói (1 thẻ Part 2 + 5 câu Part 1 · AI ≥ band 4.5 · trượt thì ôn Ngày 7, 9, 11)" },
    {
      t: "p",
      text: "**Part 2**: chọn **MỘT** trong hai thẻ, 1 phút ghi chú, nói **1,5–2 phút**. **Part 1**: mỗi câu 2–4 câu, câu đầu **không lặp từ** của giám khảo (Ngày 9).",
    },
    {
      t: "speak",
      id: "t2d12-kt-noi-p2",
      part: "2",
      questions: [
        "Describe a place in your town or city where people like to spend time. You should say: where it is; what it looks like; what people do there; and explain why it is popular.",
        "Describe an object that you use every day. You should say: what it is; when you got it; how you use it; and explain why it is important to you.",
      ],
    },
    {
      t: "speak",
      id: "t2d12-kt-noi-p1",
      part: "1",
      questions: [
        "What are you doing this weekend?",
        "How do you usually get around your city?",
        "Is food in your hometown different from food in other parts of your country?",
        "Do you enjoy cooking?",
        "Which do you prefer, the countryside or the city?",
      ],
    },

    /* ───────────── 8. Phát âm ───────────── */
    { t: "h", text: "Phần 8 — Phát âm (8 dòng · đạt ≥ 70 điểm ở 6/8 dòng)" },
    {
      t: "phatam",
      id: "t2d12-kt-phat-am",
      title: "Phần 8 — Phát âm (8 dòng)",
      note: "Đọc mỗi dòng MỘT lần (không đọc lại để lấy điểm cao hơn). Mỗi dòng kiểm một âm của chặng: /r/ & /t/ kiểu Anh · /æ ʌ ɑː/ · cụm phụ âm · /ɜː ɔː/ · trọng âm · âm tiết nuốt.",
      items: [
        { text: "Our tour starts at four near the harbour.", ipa: "aʊə tʊə stɑːts ət fɔː nɪə ðə hɑːbə", vi: "Ngày 7 — /r/ không đọc (kiểu Anh)" },
        { text: "Better water for the city.", ipa: "betə wɔːtə fə ðə sɪti", vi: "Ngày 7 — /t/ rõ giữa hai nguyên âm" },
        { text: "The tram and the bus are fast.", ipa: "ðə træm ənd ðə bʌs ə fɑːst", vi: "Ngày 8 — /æ/ · /ʌ/ · /ɑː/" },
        { text: "The tests took six months.", ipa: "ðə tests tʊk sɪks mʌnθs", vi: "Ngày 9 — cụm phụ âm -sts · -ths" },
        { text: "The survey found four sources.", ipa: "ðə sɜːveɪ faʊnd fɔː sɔːsɪz", vi: "Ngày 10 — /ɜː/ · /ɔː/" },
        { text: "They export rice, and exports increase every year.", ipa: "ðeɪ ɪkspɔːt raɪs ənd ekspɔːts ɪnkriːs evri jɪə", vi: "Ngày 11 — exPORT / inCREASE (động từ) · EXports (danh từ)" },
        { text: "We need to record the record.", ipa: "wi niːd tə rɪkɔːd ðə rekɔːd", vi: "Ngày 11 — reCORD · REcord" },
        { text: "These vegetables are different every day.", ipa: "ðiːz vedʒtəblz ə dɪfrənt evri deɪ", vi: "Ngày 12 — âm tiết bị nuốt" },
      ],
    },

    /* ───────────── Kết ───────────── */
    { t: "h", text: "Xong bài kiểm tra — bước tiếp theo" },
    {
      t: "table",
      caption: "Ghi điểm của bạn",
      head: ["Phần", "Điểm của bạn", "Ngưỡng đạt", "Đạt?"],
      rows: [
        ["1. Ngữ pháp", "___ / 27", "19", ""],
        ["2. Từ vựng", "___ / 18", "13", ""],
        ["3. Dịch", "___ / 6", "5", ""],
        ["4. Nghe", "___ / 19", "14", ""],
        ["5. Đọc", "___ / 14", "10", ""],
        ["6. Viết", "6a + 6d ___ / 12 · 6b band ___ · 6c band ___", "9 · 4.5 · 4.5", ""],
        ["7. Nói", "band ___", "4.5", ""],
        ["8. Phát âm", "___ / 8 dòng ≥ 70", "6", ""],
      ],
    },
    {
      t: "note",
      title: "Làm gì với kết quả",
      items: [
        "**Đạt cả 8 phần**: sang **Ngày 13**. Nếu muốn thử sức đủ 4 kỹ năng đúng dạng thi máy, làm **Đề 2** ở Online Test (band 4.5).",
        "**Trượt 1–2 phần**: ôn đúng **Ngày / mục** ở bảng điểm đầu bài (mỗi phần ~30–45 phút), rồi làm lại **chỉ phần đó** sau 2 ngày. Vẫn học tiếp Ngày 13 song song.",
        "**Trượt ≥ 3 phần**: dừng 2 ngày để ôn — mỗi ngày làm lại **Bài tập** của 3 ngày trong chặng, đọc lại **Sổ lỗi**, rồi làm lại cả bài kiểm tra.",
        "Câu sai ở Nghe / Đọc: ghi vào **Sổ lỗi** theo 6 loại (Ngày 9, mục 4) — lỗi lặp lại hai lần là điểm cần ôn nhất.",
        "Nghe lại 4 bài nghe **có lời thoại**, tô các cụm **used to… but now · oh, wait · we were planning to… but · the most important thing** — chúng sẽ còn xuất hiện ở mọi đề.",
      ],
    },
  ],
};

export const NGAY_12: Lesson[] = [T2D12_TU_VUNG, T2D12_DOC, T2D12_VIET, T2D12_BAI_TAP, T2D12_KIEM_TRA];
