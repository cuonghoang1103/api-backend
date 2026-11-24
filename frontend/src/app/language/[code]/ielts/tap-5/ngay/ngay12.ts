/**
 * IELTS Tập 5 — Ngày 12 (band 7.0 → 8.0; tự soạn 24/11/2026 — mọi câu ví dụ, kịch bản nghe, bài mẫu, câu bài tập VIẾT MỚI)
 *   Bài 1 (vocab)     Từ vựng Part 4 học thuật: sinh học · địa chất · tâm lý · kinh tế — 48 từ CHƯA dạy ở Tập 3–5 + số nhiều gốc
 *                     Latin / Hy Lạp + cách giảng viên định nghĩa thuật ngữ · 🔊 đọc thuật ngữ và đuôi số nhiều -i / -ae / -es
 *                     — nối Tập 3 Ngày 22 (động vật) · Tập 4 Ngày 2 (môi trường) · Tập 4 Ngày 4 (tâm lý) · Tập 3 Ngày 16 (kinh tế).
 *   Bài 2 (writing)   Task 1 process band 8 — quy trình HAI giai đoạn (làm pho mát cứng) + "describe how something works"
 *                     (khinh khí cầu: cấu tạo → vận hành; overview nêu công dụng + nguyên lý) [W13, mục 3.6 Tập 5 N12]
 *                     — nối Tập 2 Ngày 20 · Tập 3 Ngày 28 (process) · Tập 5 Ngày 7 (bị động / rút gọn / Phrasebank).
 *                     Bài viết của người học: trồng nấm (hai giai đoạn) + bơm tay (how it works). Sơ đồ tự dựng, giản lược.
 *   Bài 3 (listening) Part 4 Summary completion band 8 + Part 3 có bẫy [L06 L10 L05] — Part 3 "Planning an experiment on
 *                     background noise and working memory" (3 người: Canada · Anh · Úc, ~640 từ, 10 câu) + Part 4 "The man who
 *                     moved the continents" (Wegener và thuyết trôi dạt lục địa, giọng New Zealand, ~920 từ, 10 câu tóm tắt)
 *                     — nối Tập 3 Ngày 24 · Tập 4 Ngày 13 (Summary) · Tập 4 Ngày 12 · Tập 5 Ngày 4 · 9 (bẫy Part 3).
 *                     Dữ kiện thật: Wegener 1912 / 1915 · Mesosaurus · Pangaea · hội nghị New York 1926 · mất ở Greenland 1930 ·
 *                     Holmes (đối lưu trong manti) · Tharp và Heezen · Hess · Vine và Matthews 1963.
 *   Bài tập Ngày 12   39 câu có đáp án
 *   Kiểm tra chặng    t5d12-kiem-tra — gom Ngày 7–12, 8 phần, ngưỡng ≥ 70 % từng phần (mọi câu MỚI)
 * Mọi id bắt đầu `t5d12-`.
 */
import type { Lesson } from '../data';

export const NGAY_12: Lesson[] = [
  /* ═══════════════════════════ BÀI 1 — TỪ VỰNG ═══════════════════════════ */
  {
    id: "t5d12-tu-vung",
    kind: "vocab",
    title: "Từ vựng Part 4 học thuật: sinh học · địa chất · tâm lý · kinh tế (48 từ) + số nhiều gốc Latin",
    goal: "Nghe ra, viết đúng chính tả và dùng được 48 thuật ngữ của bốn ngành hay gặp nhất ở Listening Part 4 và Reading Passage 3 (larvae, dormant, strata, aquifer, placebo, longitudinal, opportunity cost, per capita…), viết đúng số ít / số nhiều gốc Latin – Hy Lạp, và nhận ra lúc giảng viên định nghĩa một thuật ngữ ngay trong bài giảng.",
    minutes: 95,
    blocks: [
      {
        t: "recap", title: "Bài này học gì · đẩy tiêu chí nào",
        items: [
          "Giữ **Listening Part 4 ở 9–10/10** và Reading Passage 3 ở 12+/13: mười câu cuối của bài nghe là **một bài giảng đại học**, và đáp án (ONE WORD ONLY) thường chính là một danh từ của ngành đó.",
          "Bốn ngành ra nhiều nhất: **sinh học, địa chất, tâm lý, kinh tế**. Mỗi ngành 12 từ = 48 từ. Tất cả đều chưa có ở Tập 3 Ngày 22, Tập 4 Ngày 2 · 4 và Tập 3 Ngày 16 — hôm nay là tầng trên của các bài đó.",
          "Không cần hiểu như dân chuyên ngành. Cần ba thứ: **nghe ra** (trọng âm đặt đâu) · **viết đúng** (chính tả, số ít / số nhiều) · **biết nó thuộc loại gì** (sinh vật, đá, quá trình, đại lượng) để đoán chỗ trống.",
          "Thêm bảng **số nhiều bất quy tắc** (larva → larvae · stratum → strata · hypothesis → hypotheses): viết sai dạng là mất điểm dù nghe đúng.",
          "Bài 3 hôm nay (Part 4 về địa chất, Part 3 về một thí nghiệm tâm lý) dùng lại khoảng 15 từ của bài này. Học bài này trước.",
        ],
      },

      { t: "h", text: "1. Part 4 hỏi loại từ nào — và vì sao band 7 mất điểm ở đây" },
      {
        t: "table", head: ["Chỗ trống hỏi", "Ví dụ đáp án", "Lỗi band 7"],
        rows: [
          ["Tên một **vật / sinh vật / chất**", "fungi · limestone · silt · a placebo", "Nghe ra nhưng viết sai: ~~fungis~~ · ~~lime stone~~"],
          ["Tên một **quá trình**", "weathering · habituation · depreciation", "Viết động từ thay danh từ: ~~weather~~ · ~~habituate~~"],
          ["Một **tính chất**", "dormant · nocturnal · longitudinal", "Không biết từ nên bỏ trống"],
          ["Một **đại lượng / khái niệm**", "elasticity · a surplus · correlation", "Nhầm với từ gần âm: ~~collation~~"],
          ["Số nhiều hay số ít", "larvae · strata · hypotheses", "Viết dạng số ít khi câu cần số nhiều"],
        ],
      },
      {
        t: "note", title: "💡 Cách học 48 từ trong 90 phút",
        items: [
          "Mỗi nhóm: đọc to từng từ **hai lần** theo phiên âm (trọng âm là thứ bạn cần nhất khi nghe), rồi mới đọc nghĩa.",
          "Bấm **Che từ**, nhìn nghĩa tiếng Việt và **viết** từ ra giấy. Part 4 chấm chính tả, nên học bằng tay, không học bằng mắt.",
          "Làm bài luyện của nhóm ngay sau đó. Từ nào sai thì khoanh — tối nay vào **Flashcards**, lọc Tập 5 · Ngày 12 và ôn riêng những từ đã khoanh.",
        ],
      },

      { t: "h", text: "2. Sinh học — 12 từ: đời sống của một sinh vật" },
      { t: "p", text: "Tập 3 Ngày 22 đã có species, habitat, predator, prey, breed, extinct, ecosystem. Mười hai từ dưới đây tả **việc sinh vật làm để sống qua một năm**: ăn, lớn, trốn, ngủ, chết. Bài giảng Part 4 về một loài cụ thể gần như chắc chắn dùng 4–5 từ trong nhóm này." },
      {
        t: "vocab", items: [
          { w: "metabolism", pos: "n", ipa: "/məˈtæbəlɪzəm/", vi: "sự trao đổi chất", ex: "Hummingbirds have such a fast metabolism that they must feed many times an hour.", exVi: "Chim ruồi trao đổi chất nhanh tới mức phải ăn nhiều lần mỗi giờ.", more: "a fast / slow metabolism · adj: metabolic (**metabolic rate**) · trọng âm ở **-tab-**" },
          { w: "offspring", pos: "n", ipa: "/ˈɒfsprɪŋ/", vi: "con non, con cái (của động vật, cây)", ex: "The female guards her offspring for the first six weeks.", exVi: "Con cái canh giữ con non trong sáu tuần đầu.", more: "Số ít = số nhiều: one offspring, many **offspring**. Không: ~~offsprings~~" },
          { w: "larva", pos: "n", ipa: "/ˈlɑːvə/", vi: "ấu trùng", ex: "The larva feeds on rotting wood for up to three years.", exVi: "Ấu trùng ăn gỗ mục tới ba năm.", more: "Số nhiều: **larvae** /ˈlɑːviː/ · adj: larval (the larval stage)" },
          { w: "symbiosis", pos: "n", ipa: "/ˌsɪmbaɪˈəʊsɪs/", vi: "sự cộng sinh", ex: "Coral and the algae inside it live in symbiosis.", exVi: "San hô và tảo sống bên trong nó cộng sinh với nhau.", more: "live in symbiosis **with** · adj: symbiotic (a symbiotic relationship)" },
          { w: "nocturnal", pos: "adj", ipa: "/nɒkˈtɜːnl/", vi: "hoạt động về đêm", ex: "Most desert mammals are nocturnal, emerging only after sunset.", exVi: "Đa số thú sa mạc hoạt động về đêm, chỉ ra ngoài sau khi mặt trời lặn.", more: "trái nghĩa: **diurnal** (hoạt động ban ngày) · nocturnal habits / animals" },
          { w: "dormant", pos: "adj", ipa: "/ˈdɔːmənt/", vi: "ngủ, tạm ngừng hoạt động", ex: "The seeds can lie dormant in the soil for decades.", exVi: "Hạt có thể nằm ngủ trong đất hàng chục năm.", more: "lie / remain dormant · n: dormancy · cũng dùng cho núi lửa: a dormant volcano" },
          { w: "hibernate", pos: "v", ipa: "/ˈhaɪbəneɪt/", vi: "ngủ đông", ex: "Hedgehogs hibernate from late autumn until the first warm days of spring.", exVi: "Nhím ngủ đông từ cuối thu tới những ngày ấm đầu xuân.", more: "n: hibernation · go into / come out of hibernation" },
          { w: "camouflage", pos: "n, v", ipa: "/ˈkæməflɑːʒ/", vi: "(sự) nguỵ trang", ex: "The moth's wings provide perfect camouflage against tree bark.", exVi: "Cánh của con ngài nguỵ trang hoàn hảo trên vỏ cây.", more: "Chính tả: cam**ou**flage · provide camouflage · be camouflaged against / among" },
          { w: "forage", pos: "v", ipa: "/ˈfɒrɪdʒ/", vi: "đi kiếm ăn", ex: "The birds forage along the shoreline at low tide.", exVi: "Bầy chim kiếm ăn dọc bờ biển khi triều xuống.", more: "forage **for** food / insects · n: foraging · forager" },
          { w: "moult", pos: "v, n", ipa: "/məʊlt/", vi: "thay lông, lột xác", ex: "Penguins stay on land while they moult.", exVi: "Chim cánh cụt ở trên cạn trong lúc thay lông.", more: "Anh-Mỹ viết **molt**. Cả hai đều chấm đúng trong bài thi." },
          { w: "decompose", pos: "v", ipa: "/ˌdiːkəmˈpəʊz/", vi: "phân huỷ", ex: "In warm, damp conditions fallen leaves decompose within a year.", exVi: "Trong điều kiện ấm ẩm, lá rụng phân huỷ trong vòng một năm.", more: "n: decomposition · decomposer (sinh vật phân huỷ) · tự xảy ra ⇒ chủ động" },
          { w: "fungus", pos: "n", ipa: "/ˈfʌŋɡəs/", vi: "nấm (sinh vật)", ex: "The fungus spreads through the soil as a network of fine threads.", exVi: "Nấm lan trong đất thành một mạng sợi mảnh.", more: "Số nhiều: **fungi** /ˈfʌŋɡaɪ/ · adj: fungal · mushroom chỉ là phần nhìn thấy" },
        ],
      },
      {
        t: "quiz", id: "t5d12-sinh-hoc", title: "Sinh học — điền MỘT từ, chữ cái đầu cho sẵn (8 câu)", kind: "fill",
        items: [
          { q: "1. Owls are n___ hunters, relying on hearing more than sight.", answers: ["nocturnal"] },
          { q: "2. A caterpillar is the l___ of a butterfly or moth.", answers: ["larva"] },
          { q: "3. Snakes m___ several times a year as they grow. (Anh-Anh hoặc Anh-Mỹ)", answers: ["moult", "molt"] },
          { q: "4. Many bulbs lie d___ underground throughout the dry season.", answers: ["dormant"] },
          { q: "5. Small birds lose heat quickly, so they need a very fast m___ .", answers: ["metabolism"] },
          { q: "6. The relationship between bees and flowering plants is a classic case of s___ .", answers: ["symbiosis"] },
          { q: "7. Dead wood is slowly broken down by bacteria and f___ . (số nhiều)", answers: ["fungi"] },
          { q: "8. Arctic hares turn white in winter, which gives them c___ against the snow.", answers: ["camouflage"] },
        ],
      },

      { t: "h", text: "3. Địa chất — 12 từ: từ lòng đất lên mặt đất" },
      { t: "p", text: "Tập 4 Ngày 2 đã có erosion, groundwater; Tập 3 Ngày 24 có fossil; Tập 5 Ngày 5 có sediment. Nhóm này đi **từ dưới lên trên**: lớp vỏ và các mảng → đá nóng chảy → đá gốc và các tầng → nước và băng làm mòn. Bài nghe Part 4 hôm nay là một bài địa chất." },
      {
        t: "vocab", items: [
          { w: "crust", pos: "n", ipa: "/krʌst/", vi: "lớp vỏ (Trái Đất)", ex: "The crust beneath the oceans is thinner than the crust beneath the continents.", exVi: "Lớp vỏ dưới đại dương mỏng hơn lớp vỏ dưới lục địa.", more: "the Earth's crust · oceanic / continental crust · dưới crust là mantle (Tập 4 Ngày 1)" },
          { w: "tectonic plate", pos: "n", ipa: "/tekˌtɒnɪk ˈpleɪt/", vi: "mảng kiến tạo", ex: "The Himalayas rose where two tectonic plates collided.", exVi: "Dãy Himalaya nhô lên ở nơi hai mảng kiến tạo va vào nhau.", more: "plate tectonics (thuyết kiến tạo mảng) · plates collide / drift apart / slide past each other" },
          { w: "magma", pos: "n", ipa: "/ˈmæɡmə/", vi: "đá nóng chảy DƯỚI mặt đất", ex: "Magma collects in a chamber several kilometres below the volcano.", exVi: "Magma tụ lại trong một khoang cách núi lửa vài kilômét về phía dưới.", more: "Lên tới mặt đất thì gọi là **lava** — hai từ hay được dùng làm nhiễu cho nhau" },
          { w: "eruption", pos: "n", ipa: "/ɪˈrʌpʃn/", vi: "sự phun trào", ex: "Ash from the eruption closed airports across the region.", exVi: "Tro từ vụ phun trào làm đóng cửa các sân bay trong vùng.", more: "v: erupt · a volcanic eruption · tự xảy ra ⇒ The volcano erupted (không bị động)" },
          { w: "tremor", pos: "n", ipa: "/ˈtremə/", vi: "rung chấn nhẹ", ex: "A series of small tremors was recorded before the main earthquake.", exVi: "Một loạt rung chấn nhỏ được ghi nhận trước trận động đất chính.", more: "an earth tremor · v: tremble · Anh-Mỹ cũng viết tremor" },
          { w: "strata", pos: "n (pl)", ipa: "/ˈstrɑːtə/", vi: "các tầng đá, các địa tầng", ex: "Each of the strata in the cliff took thousands of years to form.", exVi: "Mỗi tầng đá trên vách núi mất hàng nghìn năm để hình thành.", more: "Số ít: **stratum** /ˈstrɑːtəm/. Không: ~~stratas~~ · nghĩa bóng: social strata" },
          { w: "bedrock", pos: "n", ipa: "/ˈbedrɒk/", vi: "đá gốc, nền đá", ex: "The foundations had to reach the bedrock, twenty metres down.", exVi: "Móng phải chạm tới nền đá ở độ sâu hai mươi mét.", more: "Viết liền một từ · nghĩa bóng: the bedrock **of** the economy" },
          { w: "limestone", pos: "n", ipa: "/ˈlaɪmstəʊn/", vi: "đá vôi", ex: "Rainwater slowly dissolves limestone, creating caves.", exVi: "Nước mưa hoà tan dần đá vôi, tạo ra hang động.", more: "Viết liền · cùng kiểu: sandstone (sa thạch) · không đếm được" },
          { w: "weathering", pos: "n", ipa: "/ˈweðərɪŋ/", vi: "sự phong hoá", ex: "Weathering breaks rock down where it stands; erosion carries the pieces away.", exVi: "Phong hoá làm vỡ đá tại chỗ; xói mòn mang các mảnh đi nơi khác.", more: "Cặp hay bị lẫn: weathering (vỡ tại chỗ) ≠ erosion (bị mang đi) · adj: weathered" },
          { w: "silt", pos: "n", ipa: "/sɪlt/", vi: "phù sa, bùn mịn", ex: "Each flood left a layer of fertile silt on the fields.", exVi: "Mỗi trận lụt để lại một lớp phù sa màu mỡ trên đồng.", more: "v: silt **up** (bị bồi lấp): The harbour has silted up." },
          { w: "glacier", pos: "n", ipa: "/ˈɡlæsiə/", vi: "sông băng", ex: "The glacier has retreated by two kilometres in a century.", exVi: "Sông băng đã lùi hai kilômét trong một thế kỷ.", more: "Anh-Mỹ đọc /ˈɡleɪʃər/ — hai cách đọc khác hẳn nhau · adj: glacial · a glacier advances / retreats" },
          { w: "aquifer", pos: "n", ipa: "/ˈækwɪfə/", vi: "tầng ngậm nước", ex: "The city draws most of its drinking water from an aquifer beneath the desert.", exVi: "Thành phố lấy phần lớn nước uống từ một tầng ngậm nước dưới sa mạc.", more: "Chính tả: a**qui**fer · an aquifer is depleted / recharged" },
        ],
      },
      {
        t: "mcq", id: "t5d12-dia-chat", title: "Địa chất — chọn phương án đúng (8 câu)",
        items: [
          { q: "1. Molten rock that is still beneath the surface is called", options: ["lava.", "magma.", "silt."], correct: 1, why: "Dưới mặt đất: magma. Trào lên mặt đất: lava." },
          { q: "2. The breaking down of rock in place by frost, rain and plant roots is", options: ["weathering.", "erosion.", "eruption."], correct: 0, why: "weathering = vỡ tại chỗ; erosion = vật liệu bị nước, gió, băng mang đi." },
          { q: "3. An underground layer of rock that holds water is", options: ["a glacier.", "a stratum.", "an aquifer."], correct: 2, why: "aquifer = tầng ngậm nước. stratum là một tầng đá bất kỳ." },
          { q: "4. The cliff shows clearly defined ___ of sandstone and clay.", options: ["stratum", "stratas", "strata"], correct: 2, why: "Số nhiều của stratum là strata; không có “stratas”." },
          { q: "5. Fine material carried by a river and dropped where the current slows is", options: ["silt.", "bedrock.", "crust."], correct: 0, why: "silt = phù sa mịn." },
          { q: "6. A slight shaking of the ground is", options: ["an eruption.", "a tremor.", "a plate."], correct: 1, why: "tremor = rung chấn nhẹ; eruption = phun trào." },
          { q: "7. The solid rock lying beneath the soil and loose stones is the", options: ["limestone.", "silt.", "bedrock."], correct: 2, why: "bedrock = đá gốc. limestone là một LOẠI đá." },
          { q: "8. Caves most often form in ___ , because it dissolves in slightly acidic rainwater.", options: ["limestone", "magma", "silt"], correct: 0, why: "Đá vôi tan dần trong nước mưa có tính axit nhẹ." },
        ],
      },

      { t: "h", text: "4. Tâm lý học — 12 từ: thí nghiệm và trí nhớ" },
      { t: "p", text: "Tập 4 Ngày 4 đã có perception, stimulus, bias, trait, attention span, self-esteem. Nhóm hôm nay là từ của **cách làm nghiên cứu** (placebo, control group, correlation, longitudinal) và của **học – nhớ – thói quen**. Part 3 của Bài 3 hôm nay là hai sinh viên thiết kế một thí nghiệm, dùng đúng các từ này." },
      {
        t: "vocab", items: [
          { w: "conditioning", pos: "n", ipa: "/kənˈdɪʃnɪŋ/", vi: "sự điều kiện hoá (học qua liên hệ lặp lại)", ex: "Through conditioning, the animals learnt to expect food whenever the light came on.", exVi: "Qua điều kiện hoá, các con vật học được cách chờ thức ăn mỗi khi đèn bật.", more: "classical / social conditioning · be conditioned **to** V" },
          { w: "reinforcement", pos: "n", ipa: "/ˌriːɪnˈfɔːsmənt/", vi: "sự củng cố (thưởng / phạt để lặp lại hành vi)", ex: "Praise works as positive reinforcement only if it follows the behaviour quickly.", exVi: "Lời khen chỉ là củng cố tích cực khi nó đến ngay sau hành vi.", more: "positive / negative reinforcement · v: reinforce a habit" },
          { w: "habituation", pos: "n", ipa: "/həˌbɪtʃuˈeɪʃn/", vi: "sự quen dần (phản ứng giảm vì lặp lại)", ex: "Through habituation, people living near the railway stop noticing the trains.", exVi: "Nhờ quen dần, người sống gần đường tàu không còn để ý tiếng tàu.", more: "v: habituate / become habituated **to** · khác habit (thói quen)" },
          { w: "working memory", pos: "n", ipa: "/ˌwɜːkɪŋ ˈmeməri/", vi: "trí nhớ làm việc", ex: "Working memory can hold only a handful of items at a time.", exVi: "Trí nhớ làm việc chỉ giữ được vài mục cùng lúc.", more: "đối với long-term memory · working memory capacity / load" },
          { w: "retrieval", pos: "n", ipa: "/rɪˈtriːvl/", vi: "sự truy xuất, lấy lại (thông tin đã nhớ)", ex: "Testing yourself strengthens retrieval far more than rereading does.", exVi: "Tự kiểm tra làm việc truy xuất mạnh lên nhiều hơn hẳn đọc lại.", more: "v: retrieve · retrieval practice · chính tả: retr**ie**val" },
          { w: "placebo", pos: "n", ipa: "/pləˈsiːbəʊ/", vi: "giả dược", ex: "Half the volunteers received a placebo instead of the real drug.", exVi: "Một nửa tình nguyện viên nhận giả dược thay cho thuốc thật.", more: "the placebo effect · số nhiều: placebos · trọng âm ở **-ce-**" },
          { w: "control group", pos: "n", ipa: "/kənˈtrəʊl ɡruːp/", vi: "nhóm đối chứng", ex: "The control group did the same task in silence.", exVi: "Nhóm đối chứng làm cùng bài tập trong im lặng.", more: "đối với the experimental group · control **for** age (loại trừ ảnh hưởng của tuổi)" },
          { w: "correlation", pos: "n", ipa: "/ˌkɒrəˈleɪʃn/", vi: "sự tương quan", ex: "There is a strong correlation between sleep and exam results.", exVi: "Có tương quan mạnh giữa giấc ngủ và kết quả thi.", more: "a correlation **between** A **and** B · v: correlate **with** · correlation ≠ causation" },
          { w: "longitudinal", pos: "adj", ipa: "/ˌlɒŋɡɪˈtjuːdɪnl/", vi: "(nghiên cứu) theo dõi cùng một nhóm trong thời gian dài", ex: "A longitudinal study followed the same children for thirty years.", exVi: "Một nghiên cứu dài hạn đã theo dõi cùng một nhóm trẻ suốt ba mươi năm.", more: "a longitudinal study · đối với a cross-sectional study (cắt ngang, một thời điểm)" },
          { w: "inhibition", pos: "n", ipa: "/ˌɪnhɪˈbɪʃn/", vi: "sự kìm nén, ức chế", ex: "Tiredness weakens inhibition, so people say things they later regret.", exVi: "Mệt mỏi làm yếu sự kìm nén, nên người ta nói những điều sau đó phải hối.", more: "v: inhibit · lose your inhibitions (bớt ngại ngùng) · chữ h có đọc" },
          { w: "coping mechanism", pos: "n", ipa: "/ˈkəʊpɪŋ ˌmekənɪzəm/", vi: "cơ chế đối phó (với căng thẳng)", ex: "For many students, humour is a coping mechanism during exams.", exVi: "Với nhiều sinh viên, hài hước là cách đối phó trong mùa thi.", more: "cope **with** stress · a healthy / unhealthy coping mechanism" },
          { w: "attachment", pos: "n", ipa: "/əˈtætʃmənt/", vi: "sự gắn bó (với người chăm sóc)", ex: "A child's early attachment to a caregiver shapes later relationships.", exVi: "Sự gắn bó sớm của trẻ với người chăm sóc định hình các mối quan hệ về sau.", more: "attachment **to** · form an attachment · nghĩa khác: tệp đính kèm" },
        ],
      },
      {
        t: "quiz", id: "t5d12-tam-ly", title: "Tâm lý học — điền từ / cụm của mục 4 (8 câu)", kind: "fill",
        items: [
          { q: "1. To rule out other explanations, the patients were compared with a c___ g___ who received no treatment. (hai từ)", answers: ["control group"] },
          { q: "2. Volunteers who were given a p___ reported almost as much pain relief as those given the drug.", answers: ["placebo"] },
          { q: "3. A l___ study tracks the same people over many years.", answers: ["longitudinal"] },
          { q: "4. The c___ between income and happiness becomes weaker above a certain level.", answers: ["correlation"] },
          { q: "5. People living under a flight path stop noticing the planes through h___ .", answers: ["habituation"] },
          { q: "6. A small reward given at once is stronger r___ than a large one promised for next month.", answers: ["reinforcement"] },
          { q: "7. W___ m___ is what you use to hold a phone number in your head while you dial it. (hai từ)", answers: ["Working memory", "working memory"] },
          { q: "8. His problem was not storage but r___ : the name was in there somewhere, but he couldn't get it back.", answers: ["retrieval"] },
        ],
      },

      { t: "h", text: "5. Kinh tế học — 12 từ: đại lượng và cơ chế" },
      { t: "p", text: "Tập 3 Ngày 16 và Tập 4 Ngày 14 đã có supply and demand, inflation, recession, interest rate, purchasing power; Tập 5 Ngày 8 có economies of scale, monopoly. Nhóm này là **từ của giáo trình kinh tế nhập môn** — đúng những thứ một bài giảng Part 4 về lịch sử tiền tệ hay thương mại sẽ nhắc. Bài đọc Ngày 11 (bệnh chi phí Baumol; nghịch lý nước – kim cương) đã cho bạn nghe quen giọng văn này." },
      {
        t: "vocab", items: [
          { w: "surplus", pos: "n, adj", ipa: "/ˈsɜːpləs/", vi: "thặng dư, phần dôi ra", ex: "A good harvest produced a surplus that could be traded.", exVi: "Một vụ mùa tốt tạo ra phần dôi có thể đem trao đổi.", more: "a trade / budget surplus · trái nghĩa: deficit, shortage · số nhiều: surpluses" },
          { w: "barter", pos: "v, n", ipa: "/ˈbɑːtə/", vi: "đổi hàng lấy hàng", ex: "Before coins existed, villagers bartered grain for tools.", exVi: "Trước khi có tiền xu, dân làng đổi thóc lấy công cụ.", more: "barter A **for** B · a barter economy / system" },
          { w: "dividend", pos: "n", ipa: "/ˈdɪvɪdend/", vi: "cổ tức", ex: "The company has paid no dividend for three years.", exVi: "Công ty đã không trả cổ tức ba năm nay.", more: "pay a dividend · nghĩa bóng: pay dividends (đem lại lợi ích về sau)" },
          { w: "elasticity", pos: "n", ipa: "/ˌiːlæˈstɪsəti/", vi: "độ co giãn (của cầu / cung theo giá)", ex: "The elasticity of demand for petrol is low: people buy it whatever the price.", exVi: "Độ co giãn của cầu xăng thấp: giá nào người ta cũng mua.", more: "price elasticity **of** demand · adj: elastic / inelastic demand" },
          { w: "market failure", pos: "n", ipa: "/ˌmɑːkɪt ˈfeɪljə/", vi: "thất bại thị trường", ex: "Pollution is a textbook case of market failure.", exVi: "Ô nhiễm là ví dụ kinh điển của thất bại thị trường.", more: "correct a market failure · thường đi với externality" },
          { w: "opportunity cost", pos: "n", ipa: "/ˌɒpəˈtjuːnəti kɒst/", vi: "chi phí cơ hội", ex: "The opportunity cost of a degree includes three years of lost wages.", exVi: "Chi phí cơ hội của một tấm bằng gồm cả ba năm lương không kiếm được.", more: "the opportunity cost **of** + N / V-ing" },
          { w: "diminishing returns", pos: "n (pl)", ipa: "/dɪˌmɪnɪʃɪŋ rɪˈtɜːnz/", vi: "lợi ích giảm dần", ex: "After the sixth hour of revision you hit diminishing returns.", exVi: "Sau giờ ôn thứ sáu, lợi ích thêm được bắt đầu giảm dần.", more: "the law of diminishing returns · luôn số nhiều" },
          { w: "externality", pos: "n", ipa: "/ˌekstɜːˈnæləti/", vi: "ngoại ứng (tác động lên người ngoài cuộc)", ex: "Traffic noise is a negative externality of road transport.", exVi: "Tiếng ồn giao thông là một ngoại ứng tiêu cực của vận tải đường bộ.", more: "a positive / negative externality · số nhiều: externalities" },
          { w: "liquidity", pos: "n", ipa: "/lɪˈkwɪdəti/", vi: "tính thanh khoản", ex: "Property offers little liquidity: a house cannot be sold overnight.", exVi: "Bất động sản kém thanh khoản: không thể bán nhà qua đêm.", more: "adj: liquid assets · a liquidity crisis" },
          { w: "collateral", pos: "n", ipa: "/kəˈlætərəl/", vi: "tài sản thế chấp", ex: "The bank accepted the workshop as collateral for the loan.", exVi: "Ngân hàng nhận xưởng làm tài sản thế chấp cho khoản vay.", more: "put up sth **as** collateral · không đếm được · chính tả: co**ll**a**t**eral" },
          { w: "depreciation", pos: "n", ipa: "/dɪˌpriːʃiˈeɪʃn/", vi: "sự mất giá, khấu hao", ex: "Depreciation wipes about a fifth off the value of a new car in its first year.", exVi: "Khấu hao lấy đi khoảng một phần năm giá trị xe mới trong năm đầu.", more: "v: depreciate · trái nghĩa: appreciation (tăng giá)" },
          { w: "per capita", pos: "adj, adv", ipa: "/pə ˈkæpɪtə/", vi: "tính theo đầu người", ex: "Income per capita has doubled since 2000.", exVi: "Thu nhập bình quân đầu người đã tăng gấp đôi từ năm 2000.", more: "per capita income / spending · đứng trước hoặc sau danh từ" },
        ],
      },
      {
        t: "mcq", id: "t5d12-kinh-te", title: "Kinh tế học — chọn phương án đúng (8 câu)",
        items: [
          { q: "1. The wages you give up by studying full-time instead of working are", options: ["an externality.", "an opportunity cost.", "a dividend."], correct: 1, why: "opportunity cost = giá trị của lựa chọn bị bỏ." },
          { q: "2. Smoke from a factory that damages the health of people living nearby is a negative", options: ["externality.", "elasticity.", "surplus."], correct: 0, why: "externality = tác động lên người không tham gia giao dịch." },
          { q: "3. Each extra hour of revision adds less to your mark than the hour before. This is a case of", options: ["depreciation.", "liquidity.", "diminishing returns."], correct: 2, why: "diminishing returns = thêm đầu vào, phần lợi thêm giảm dần." },
          { q: "4. The bank would only lend the money if the family offered their house as", options: ["collateral.", "barter.", "dividend."], correct: 0, why: "collateral = tài sản thế chấp." },
          { q: "5. Demand that hardly changes when the price rises has low", options: ["liquidity.", "elasticity.", "surplus."], correct: 1, why: "elasticity = độ co giãn theo giá." },
          { q: "6. The country's GDP ___ is higher than its neighbour's, although its total GDP is smaller.", options: ["per capita", "in capital", "by head"], correct: 0, why: "per capita = tính theo đầu người." },
          { q: "7. A new laptop loses much of its value in the first two years through", options: ["appreciation.", "depreciation.", "market failure."], correct: 1, why: "depreciation = mất giá; appreciation = tăng giá." },
          { q: "8. Exchanging goods directly for other goods, without money, is", options: ["a surplus.", "an externality.", "barter."], correct: 2, why: "barter = đổi hàng lấy hàng." },
        ],
      },

      { t: "h", text: "6. Số nhiều gốc Latin và Hy Lạp — nghe đúng, viết đúng" },
      { t: "p", text: "Bài giảng học thuật đầy những danh từ có số nhiều **không thêm -s**. Trong Note / Summary completion, ngữ pháp của câu cho biết cần số ít hay số nhiều; viết sai dạng là sai. Học theo **đuôi**, đừng học từng từ." },
      {
        t: "table", head: ["Đuôi số ít → số nhiều", "Ví dụ", "Đọc đuôi số nhiều"],
        rows: [
          ["-a → -ae", "larva → larvae · alga → algae · formula → formulae (cũng: formulas)", "/iː/: /ˈlɑːviː/ · /ˈældʒiː/"],
          ["-us → -i", "fungus → fungi · stimulus → stimuli · nucleus → nuclei", "/aɪ/: /ˈfʌŋɡaɪ/ · /ˈstɪmjəlaɪ/"],
          ["-um → -a", "stratum → strata · bacterium → bacteria · datum → data · medium → media", "/ə/: /ˈstrɑːtə/ · /bækˈtɪəriə/"],
          ["-is → -es", "hypothesis → hypotheses · analysis → analyses · crisis → crises · basis → bases", "/iːz/: /haɪˈpɒθəsiːz/"],
          ["-on → -a", "phenomenon → phenomena · criterion → criteria", "/ə/: /fəˈnɒmɪnə/ · /kraɪˈtɪəriə/"],
          ["-ix / -ex → -ices", "index → indices · matrix → matrices · appendix → appendices", "/ɪsiːz/"],
          ["Không đổi", "species → species · series → series · offspring → offspring", "Động từ cho biết số: this species **is** / these species **are**"],
        ],
      },
      {
        t: "note", title: "⚠️ Bốn lỗi người Việt hay mắc",
        items: [
          "**Thêm -s vào dạng đã là số nhiều:** ~~criterias~~ · ~~phenomenas~~ · ~~bacterias~~ · ~~stratas~~.",
          "**Dùng dạng số nhiều như số ít:** ~~a criteria~~ · ~~this phenomena~~ · ~~a bacteria~~ → a criterion · this phenomenon · a bacterium.",
          "**Nghe /iːz/ nhưng viết -is:** “two hypotheses” nghe có /siːz/ ở cuối. Câu có two / several / these thì viết **-es**.",
          "**data:** trong văn học thuật hiện nay cả “the data are” lẫn “the data is” đều được chấp nhận; chọn một cách và giữ nhất quán trong một bài.",
        ],
      },
      { t: "rule", formula: "-a → -ae  ·  -us → -i  ·  -um → -a  ·  -is → -es  ·  -on → -a  ·  species / series / offspring: không đổi", vi: "Nhìn mạo từ và động từ quanh chỗ trống để biết cần số ít hay số nhiều." },
      {
        t: "quiz", id: "t5d12-so-nhieu", title: "Viết dạng đúng — số ít hoặc số nhiều (8 câu)", kind: "fill",
        items: [
          { q: "1. one hypothesis → several ___", answers: ["hypotheses"] },
          { q: "2. one fungus → many ___", answers: ["fungi"] },
          { q: "3. these strata → a single ___", answers: ["stratum"] },
          { q: "4. one larva → hundreds of ___", answers: ["larvae"] },
          { q: "5. these phenomena → this ___", answers: ["phenomenon"] },
          { q: "6. one criterion → three ___", answers: ["criteria"] },
          { q: "7. one species → two ___", answers: ["species"] },
          { q: "8. these bacteria → a single ___", answers: ["bacterium"] },
        ],
      },
      { t: "p", text: "🔊 **Đọc thuật ngữ.** Từ học thuật dài chỉ có MỘT đỉnh; đặt sai đỉnh thì khi nghe bạn sẽ không nhận ra chính từ mình đã học. Tám câu dưới đây dồn các đuôi số nhiều và các từ có trọng âm dễ đặt sai: me**TA**bolism · symbi**O**sis · hy**PO**theses · phe**NO**mena · elas**TI**city · **A**quifer." },
      {
        t: "phatam", id: "t5d12-phat-am", title: "Luyện phát âm — thuật ngữ Part 4: một đỉnh mỗi từ, đuôi số nhiều -ae / -i / -es / -a",
        note: "Đọc mỗi câu hai lần. Lần 1 chậm, gõ tay vào âm tiết mang trọng âm của từ dài. Lần 2 ở tốc độ bài giảng. Chú ý đuôi: larvae /iː/ · fungi /aɪ/ · hypotheses /iːz/ · strata, phenomena /ə/.",
        items: [
          { text: "The larvae feed on fungi.", ipa: "ðə lɑːviː fiːd ɒn fʌŋɡaɪ", vi: "larvae kết thúc bằng /iː/, fungi bằng /aɪ/." },
          { text: "Two hypotheses were tested.", ipa: "tuː haɪpɒθəsiːz wə testɪd", vi: "hy-PO-the-ses; đuôi /siːz/, không phải /sɪs/." },
          { text: "The strata contain limestone.", ipa: "ðə strɑːtə kənteɪn laɪmstəʊn", vi: "strata số nhiều ⇒ contain (không s)." },
          { text: "Its metabolism slows in winter.", ipa: "ɪts mətæbəlɪzəm sləʊz ɪn wɪntə", vi: "me-TA-bo-lism: đỉnh ở âm tiết thứ hai." },
          { text: "Symbiosis benefits both species.", ipa: "sɪmbaɪəʊsɪs benɪfɪts bəʊθ spiːʃiːz", vi: "sym-bi-O-sis; species /ˈspiːʃiːz/." },
          { text: "Such phenomena are rarely observed.", ipa: "sʌtʃ fənɒmɪnə ə reəli əbzɜːvd", vi: "phe-NO-me-na + are (số nhiều)." },
          { text: "The aquifer lies beneath the bedrock.", ipa: "ði ækwɪfə laɪz bɪniːθ ðə bedrɒk", vi: "A-qui-fer: đỉnh ở âm tiết đầu." },
          { text: "Elasticity measures the response to price.", ipa: "iːlæstɪsəti meʒəz ðə rɪspɒns tə praɪs", vi: "e-las-TI-ci-ty: đỉnh ngay trước -ity." },
        ],
      },

      { t: "h", text: "7. Giảng viên định nghĩa thuật ngữ thế nào — và đề lấy đáp án ở đâu" },
      { t: "p", text: "Giống bài đọc Ngày 11: bài giảng **luôn tự giải thích** thuật ngữ. Khác ở chỗ bạn chỉ nghe một lần. Nghe ra khuôn định nghĩa giúp bạn biết **từ nào là thuật ngữ, từ nào là lời giải thích** — đề có thể lấy bên nào làm đáp án." },
      {
        t: "table", head: ["Khuôn", "Ví dụ trong bài giảng", "Đề thường làm gì"],
        rows: [
          ["mô tả + , what we call / known as + THUẬT NGỮ", "the rock breaks down where it stands, **what geologists call** weathering", "Phiếu ghi phần mô tả, chỗ trống là thuật ngữ"],
          ["THUẬT NGỮ + — that is, / in other words, + mô tả", "they're nocturnal — **that is**, active at night", "Phiếu ghi thuật ngữ, chỗ trống là từ thường (night)"],
          ["THUẬT NGỮ, or + từ thường", "the larvae, **or** grubs, live underground", "Hai từ đều đúng nghĩa; chép từ hợp giới hạn và ngữ pháp"],
          ["a kind / type of + N + called + THUẬT NGỮ", "**a kind of** fine mud **called** silt", "Chỗ trống sau “called” ⇒ danh từ, hay bị hỏi chính tả"],
          ["Đối lập hai thuật ngữ", "not magma **but** lava · weathering **rather than** erosion", "Từ bị bác đứng ngay cạnh đáp án — bẫy mức band 8"],
        ],
      },
      {
        t: "note", title: "💡 Mẹo cho chỗ trống là thuật ngữ",
        items: [
          "Giảng viên nói thuật ngữ **chậm hơn và rõ hơn** phần còn lại, thường có một quãng ngừng ngắn trước nó. Đó là lúc cầm bút.",
          "Từ rất lạ (tên riêng, tên loài bằng tiếng Latin) sẽ được **đánh vần**, hoặc không bao giờ là đáp án. Đáp án ONE WORD ở Part 4 là từ một người có học phổ thông biết viết.",
          "Không kịp nghĩ số ít hay số nhiều lúc nghe? Ghi nguyên âm nghe được, rồi dùng 2 phút kiểm cuối để đối chiếu với mạo từ và động từ trên phiếu.",
        ],
      },

      { t: "h", text: "8. Dùng ngay — sáu câu với từ hôm nay" },
      {
        t: "quiz", id: "t5d12-tv-dich", title: "Dịch sang tiếng Anh — dùng từ trong gợi ý (6 câu)", kind: "translate",
        grammar: "Thì hiện tại đơn cho sự thật khoa học; hiện tại hoàn thành cho thay đổi tới nay",
        items: [
          { q: "1. Hạt giống có thể nằm ngủ trong đất hàng chục năm.", answers: ["The seeds can lie dormant in the soil for decades.", "Seeds can lie dormant in the soil for decades.", "The seeds can remain dormant in the soil for decades.", "Seeds can remain dormant in the soil for decades."], hint: "lie dormant · for decades" },
          { q: "2. Thành phố lấy nước uống từ một tầng ngậm nước.", answers: ["The city gets its drinking water from an aquifer.", "The city draws its drinking water from an aquifer.", "The city takes its drinking water from an aquifer."], hint: "drinking water · aquifer" },
          { q: "3. Tương quan không phải là quan hệ nhân quả.", answers: ["Correlation is not causation.", "Correlation does not imply causation.", "Correlation is not the same as causation.", "Correlation isn't causation."], hint: "correlation · causation" },
          { q: "4. Một nửa số tình nguyện viên nhận giả dược.", answers: ["Half of the volunteers received a placebo.", "Half the volunteers received a placebo.", "Half of the volunteers were given a placebo.", "Half the volunteers were given a placebo."], hint: "Half (of) the volunteers · a placebo" },
          { q: "5. Chi phí cơ hội của việc học đại học là bốn năm tiền lương.", answers: ["The opportunity cost of going to university is four years of wages.", "The opportunity cost of going to university is four years' wages.", "The opportunity cost of a university education is four years of wages.", "The opportunity cost of studying at university is four years of wages."], hint: "The opportunity cost of · four years of wages" },
          { q: "6. Thu nhập bình quân đầu người đã tăng gấp đôi kể từ năm 2000.", answers: ["Income per capita has doubled since 2000.", "Per capita income has doubled since 2000."], hint: "per capita · has doubled since" },
        ],
      },
      {
        t: "note", title: "📌 Mang gì sang các bài sau",
        items: [
          "**Bài 3 hôm nay:** Part 4 dùng crust · tectonic plate · strata · glacier; Part 3 dùng control group · working memory · habituation · correlation. Nghe ra chúng là đã có nửa đáp án.",
          "**Bài 2 hôm nay:** động từ tự xảy ra (decompose, erupt, dissolve) không chia bị động trong bài process — ôn Ngày 7 mục 2.",
          "**Ngày 20 và 22:** Science vòng 2 và từ cho đề Task 2 lạ (genetics, space) xây tiếp trên nhóm sinh học và địa chất của hôm nay.",
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI 2 — VIẾT ═══════════════════════════ */
  {
    id: "t5d12-viet",
    kind: "writing",
    title: "Viết Task 1 process band 8: quy trình HAI giai đoạn + “describe how something works”",
    goal: "Viết trong 20 phút một bài Task 1 process band 8 cho hai biến thể khó: (1) quy trình hai giai đoạn — overview so được hai giai đoạn, mỗi giai đoạn một khổ, có câu bản lề nối hai giai đoạn; (2) đề “how something works” — overview nêu công dụng và nguyên lý, thân 1 tả cấu tạo (vị trí + chức năng), thân 2 tả vận hành bằng quan hệ nhân quả ở thì hiện tại đơn.",
    minutes: 100,
    blocks: [
      {
        t: "recap", title: "Bài này học gì · đẩy tiêu chí nào",
        items: [
          "Đẩy **Task Achievement + Coherence của Task 1 từ 7 lên 8** ở dạng process. Ngày 7 đã lo phần câu (bị động / chủ động, rút gọn, Phrasebank). Hôm nay lo phần **bố cục** của hai biến thể mà band 7 hay viết thành một danh sách bước.",
          "**Biến thể 1 — hai giai đoạn** (hai sơ đồ, hoặc một sơ đồ có vạch chia). Bẫy: viết 14 bước liền nhau, overview chỉ đếm bước. Band 8: overview **so hai giai đoạn** (dùng gì, mất bao lâu, biến cái gì thành cái gì).",
          "**Biến thể 2 — how something works** (một thiết bị). Đây KHÔNG phải quy trình sản xuất: không có nguyên liệu và thành phẩm. Khung: ==cấu tạo → vận hành==, overview nêu **công dụng + nguyên lý**.",
          "Mỗi biến thể có một bài mẫu band 8 đủ dài, một đoạn band 7 để so, bảng 4 tiêu chí, rồi bạn viết một bài của mình (AI chấm).",
          "Nối lại: Tập 2 Ngày 20 và Tập 3 Ngày 28 (process, nêu mục đích bước, từ ngoài hình), Tập 5 Ngày 7 (ba quyết định cho mỗi bước).",
        ],
      },

      { t: "h", text: "1. Process ở band 7 và band 8 — khác nhau ở bố cục" },
      {
        t: "table", head: ["", "Band 7", "Band 8"],
        rows: [
          ["Overview", "There are 14 steps, from milk to cheese.", "Đếm bước + **so hai giai đoạn** hoặc nêu **nguyên lý** của thiết bị"],
          ["Chia khổ", "Chia đều theo số bước, hoặc một khổ dài", "Theo **ranh giới thật** của sơ đồ: giai đoạn 1 / giai đoạn 2 · cấu tạo / vận hành"],
          ["Chuyển khổ", "In the second stage, firstly…", "Câu bản lề nhắc sản phẩm trung gian: The second stage begins with the salting of **this curd**."],
          ["Mục đích bước", "Không nêu", "so that… · to be used as… · , allowing… (lấy từ ghi chú trên hình, không bịa)"],
          ["Bước tự xảy ra", "~~the milk is set~~ · ~~the air is become~~", "the milk **sets** · the air **becomes** less dense"],
          ["Độ dài", "150–170 từ, sát mức tối thiểu", "190–230 từ: đủ mọi bước và mọi con số, không thừa"],
        ],
      },
      {
        t: "note", title: "⚠️ Ba lỗi bố cục giữ bài process ở band 6.5–7",
        items: [
          "**Overview chỉ có số bước.** “Overall, there are fourteen steps.” là đếm, chưa phải nhận định. Giám khảo cần thấy bạn **nhìn ra hình dạng** của quy trình: thẳng hay vòng, mấy giai đoạn, cái gì vào – cái gì ra, có sản phẩm phụ không.",
          "**Thiếu số liệu trên hình.** Mọi nhiệt độ, thời gian, kích thước ghi trên sơ đồ đều là “key feature”. Bỏ 72°C hay “3 to 18 months” là mất Task Achievement.",
          "**Coi “how it works” như quy trình sản xuất** và viết First… Then… Finally từ đầu tới cuối, không có khổ nào tả các bộ phận. Thiết bị phải được tả **trước khi** nó chạy.",
        ],
      },

      { t: "h", text: "2. Biến thể 1 — quy trình hai giai đoạn" },
      { t: "p", text: "**Đề (tự soạn):** The diagrams below show the two stages in the production of hard cheese. Summarise the information by selecting and reporting the main features, and make comparisons where relevant. — Trước khi đọc bài mẫu, tự trả lời bốn câu hỏi của sơ đồ dưới đây." },
      {
        t: "sodo", kind: "flow", title: "Bốn câu hỏi trước khi viết một quy trình hai giai đoạn (2 phút)",
        steps: [
          { label: "① Vào gì – ra gì?", sub: "raw milk → packed cheese" },
          { label: "② Sản phẩm trung gian là gì?", sub: "curd — thứ kết thúc giai đoạn 1 và mở giai đoạn 2" },
          { label: "③ Hai giai đoạn khác nhau ở đâu?", sub: "giờ / tháng · nhiệt + chất thêm vào / lực ép + thời gian" },
          { label: "④ Có sản phẩm phụ không?", sub: "whey → animal feed" },
        ],
        caption: "Bốn câu trả lời này chính là overview và câu bản lề giữa hai khổ.",
      },
      {
        t: "figure",
        fig: {
          kind: "process",
          title: "Stage 1 — making the curd (at the dairy)",
          note: "Sơ đồ tự dựng cho bài luyện, giản lược từ cách làm pho mát cứng; nhiệt độ và thời gian là số minh hoạ.",
          steps: [
            { label: "Raw milk delivered", note: "quality tested on arrival" },
            { label: "Pasteurised", note: "72°C for 15 seconds · then cooled to 30°C" },
            { label: "Starter culture + rennet added", note: "stirred in · large vat" },
            { label: "Milk sets", note: "about 40 minutes · soft solid = curd" },
            { label: "Curd cut into small cubes", note: "wire knives" },
            { label: "Heated and stirred", note: "38°C · curd becomes firmer" },
            { label: "Whey drained off", note: "liquid · used as animal feed" },
          ],
        },
      },
      {
        t: "figure",
        fig: {
          kind: "process",
          title: "Stage 2 — pressing and maturing",
          note: "Sơ đồ tự dựng cho bài luyện; 10°C và 3–18 tháng là số minh hoạ.",
          steps: [
            { label: "Curd salted", note: "salt mixed in" },
            { label: "Packed into moulds", note: "moulds lined with cloth" },
            { label: "Pressed", note: "overnight · remaining whey squeezed out" },
            { label: "Removed and wrapped", note: "cloth, or coated in wax" },
            { label: "Matured in store", note: "10°C · 3 to 18 months · turned weekly" },
            { label: "Graded", note: "sample from each batch · flavour and texture" },
            { label: "Cut and packed", note: "sent to shops" },
          ],
        },
      },
      {
        t: "passage", title: "Bài mẫu band 7 (ước tính) — 170 từ",
        paras: [
          { text: "The diagrams show how hard cheese is produced. There are two stages in the process." },
          { text: "Overall, there are fourteen steps in total. The process starts with milk and finishes with cheese which is sent to shops." },
          { text: "In the first stage, firstly, the milk is delivered and tested. Then it is pasteurised at 72°C for 15 seconds and it is cooled to 30°C. Next, a starter culture and rennet are added. After that, the milk is set for about 40 minutes. Then the curd is cut into small cubes and it is heated to 38°C and stirred. Finally, the whey is drained off and it is used as animal feed." },
          { text: "In the second stage, firstly, the curd is salted. Then it is packed into moulds and it is pressed overnight. Next, it is removed and wrapped. After that, the cheese is matured at 10°C for 3 to 18 months and it is turned every week. Then it is graded. Finally, it is cut and packed and it is sent to shops." },
        ],
      },
      {
        t: "passage", title: "Bài mẫu band 8 (ước tính) — 232 từ",
        paras: [
          { text: "The diagrams illustrate how hard cheese is made in two stages: the formation of the curd, followed by its pressing and maturing." },
          { text: "Overall, the process comprises fourteen steps, beginning with the delivery of raw milk and ending with packed cheese ready for sale. The first stage is completed within hours and relies on heat and added ingredients, whereas the second is largely a matter of pressure and time, lasting anything up to eighteen months." },
          { text: "In the first stage, the milk is tested on arrival and pasteurised at 72°C for 15 seconds before being cooled to 30°C. A starter culture and rennet are then stirred in, and the milk is left for about 40 minutes, during which it sets into a soft solid known as curd. Once cut into small cubes, the curd is heated to 38°C and stirred until it firms up, at which point the liquid whey is drained off to be used as animal feed." },
          { text: "The second stage begins with the salting of this curd, which is then packed into cloth-lined moulds and pressed overnight so that any remaining whey is squeezed out. Having been wrapped in cloth or coated in wax, the cheeses are stored at 10°C for between three and eighteen months and turned weekly. Finally, a sample from each batch is graded for flavour and texture, after which the cheese is cut and packed for the shops." },
        ],
      },
      {
        t: "table", head: ["Tiêu chí", "Bài band 7", "Bài band 8", "Bài học"],
        rows: [
          ["Task Achievement", "Đủ gần hết bước; overview chỉ đếm bước và nêu đầu – cuối; thiếu “soft solid = curd”, “remaining whey”", "Overview **so hai giai đoạn** (within hours / up to eighteen months · heat and added ingredients / pressure and time); đủ mọi con số; có sản phẩm phụ", "Overview process band 8 = hình dạng + một phép so sánh"],
          ["Coherence & Cohesion", "firstly · Then · Next · After that · Finally ×2 vòng; “it” lặp 9 lần", "before being · during which · Once cut · at which point · Having been · after which; câu bản lề “the salting of **this curd**”", "Bản lề nhắc sản phẩm trung gian bằng this + N"],
          ["Lexical Resource", "produced · starts · finishes · is used", "comprises · relies on · is largely a matter of · sets into · firms up · cloth-lined · batch", "Động từ chính xác cho từng thay đổi của vật liệu"],
          ["Grammar", "Câu đơn nối and; một lỗi: ~~the milk is set~~ (bước tự xảy ra)", "Bị động + chủ động đúng chỗ (sets · firms up); rút gọn 3 kiểu; so that; to be used as", "Ngày 7 mục 2–5 áp vào đây"],
        ],
      },
      {
        t: "table", head: ["Việc", "Cụm", "Ví dụ"],
        rows: [
          ["Nêu hai giai đoạn ở mở bài", "in two stages: A, followed by B · falls into two distinct stages", "…is made in two stages: the formation of the curd, followed by its pressing and maturing."],
          ["So hai giai đoạn ở overview", "The first… , whereas the second… · is largely a matter of", "The first stage is completed within hours, whereas the second lasts up to eighteen months."],
          ["Mở giai đoạn 1", "In the first stage, · The process begins when / with", "In the first stage, the milk is tested on arrival…"],
          ["Bản lề sang giai đoạn 2", "The second stage begins with + the V-ing of + this N", "The second stage begins with the salting of this curd."],
          ["Gọi sản phẩm trung gian", "known as · the resulting N · this N", "…a soft solid known as curd. · The resulting liquid…"],
          ["Sản phẩm phụ", "to be used as · , which is used for · a by-product", "…the whey is drained off to be used as animal feed."],
          ["Thời lượng", "is left for · during which · lasting (anything) up to · for between X and Y", "…stored for between three and eighteen months."],
        ],
      },
      { t: "rule", formula: "Mở bài: in two stages: A, followed by B  →  Overview: N steps + The first…, whereas the second…  →  Thân 1 = stage 1  →  The second stage begins with… this N  →  Thân 2 = stage 2", vi: "Ranh giới khổ trùng với ranh giới giai đoạn. Câu bản lề nhắc sản phẩm trung gian." },
      {
        t: "quiz", id: "t5d12-viet-hai-giai-doan", title: "Ngôn ngữ quy trình hai giai đoạn — điền MỘT từ (8 câu)", kind: "fill",
        items: [
          { q: "1. The process falls ___ two distinct stages.", answers: ["into"] },
          { q: "2. The first stage ___ of seven steps. (động từ, hiện tại)", answers: ["consists"] },
          { q: "3. The milk is left for about 40 minutes, ___ which it sets into curd.", answers: ["during"] },
          { q: "4. The whey is drained off ___ be used as animal feed.", answers: ["to"] },
          { q: "5. The curd is pressed overnight so ___ any remaining whey is squeezed out.", answers: ["that"] },
          { q: "6. ___ been wrapped in cloth, the cheeses are stored at 10°C.", answers: ["Having", "having"] },
          { q: "7. A sample is graded, after ___ the cheese is cut and packed.", answers: ["which"] },
          { q: "8. The first stage is completed within hours, ___ the second can last eighteen months. (một từ nối chỉ sự đối lập)", answers: ["whereas", "while", "whilst"] },
        ],
      },

      { t: "h", text: "3. Nêu mục đích của bước và dùng từ ngoài hình — ở mức band 8" },
      { t: "p", text: "Ôn Tập 3 Ngày 28. Sơ đồ chỉ ghi danh từ và con số; **động từ, quan hệ giữa các bước và mục đích** là phần bạn tự viết. Giới hạn: chỉ nêu mục đích khi hình **có cho** (ghi chú “remaining whey squeezed out”, “kills pests”) hoặc khi nó là nghĩa của chính từ trên hình. Không thêm kiến thức riêng." },
      {
        t: "table", head: ["Trên hình", "Viết được", "KHÔNG viết"],
        rows: [
          ["Pressed · overnight · remaining whey squeezed out", "…pressed overnight **so that** any remaining whey is squeezed out", "~~to make the cheese more delicious~~ (hình không nói)"],
          ["Whey drained off · used as animal feed", "…drained off **to be used as** animal feed", "~~and sold to farmers at a low price~~"],
          ["Matured · 10°C · 3 to 18 months", "…stored at 10°C **for between** three and eighteen months", "~~because longer maturing gives a stronger flavour~~ (đúng ngoài đời, nhưng không có trên hình)"],
          ["Wire knives", "…cut into small cubes **with** wire knives", "~~by wire knives~~ (by + người / máy làm; with + dụng cụ)"],
          ["Soft solid = curd", "…a soft solid **known as** curd", "bỏ qua định nghĩa trên hình"],
        ],
      },
      {
        t: "note", title: "💡 Mẹo: từ ngoài hình được phép",
        items: [
          "**Động từ danh hoá** từ nhãn: Curd salted → the salting of the curd; Milk delivered → the delivery of raw milk. Cho phép dùng begins with / is followed by (Ngày 7 mục 6).",
          "**Từ chỉ loại:** ingredients (cho starter culture + rennet), liquid (cho whey), container (cho vat / mould), storage (cho store). Dùng một lần để tránh lặp nhãn.",
          "**Từ chỉ hình dạng quy trình:** linear, cyclical, by-product, intermediate product, batch. Đây là chỗ Lexical Resource của bài process ăn điểm.",
        ],
      },

      { t: "h", text: "4. Biến thể 2 — “describe how something works”" },
      { t: "p", text: "Đề loại này cho **một thiết bị** với các bộ phận có nhãn, đôi khi kèm vài mũi tên chỉ chuyển động. Không có nguyên liệu, không có thành phẩm, nhiều khi không có thứ tự bước rõ ràng. Người viết theo khung First – Then – Finally sẽ bí ngay ở câu thứ hai." },
      {
        t: "table", head: ["", "Quy trình sản xuất", "How something works"],
        rows: [
          ["Hình cho", "Chuỗi bước có mũi tên", "Một vật có nhãn bộ phận (+ mũi tên chuyển động)"],
          ["Overview", "Số bước, vào – ra, mấy giai đoạn", "**Công dụng** + **nguyên lý** (works on the principle that… · by using… to…)"],
          ["Thân 1", "Nửa đầu các bước", "**Cấu tạo**: bộ phận nào ở đâu, làm bằng gì, để làm gì"],
          ["Thân 2", "Nửa sau các bước", "**Vận hành**: việc gì gây ra việc gì"],
          ["Thì và thể", "Hiện tại đơn, đa số bị động", "Hiện tại đơn; cấu tạo: bị động trạng thái (is mounted, is attached); vận hành: **nhiều chủ động** (the air becomes · the balloon rises)"],
          ["Từ nối chính", "Thời gian: once, after which", "Nhân quả: when / as · causes N to V · , allowing N to V · which in turn"],
        ],
      },
      { t: "p", text: "**Đề (tự soạn):** The diagrams below show the structure of a hot-air balloon and how it works. Summarise the information by selecting and reporting the main features, and make comparisons where relevant." },
      {
        t: "table", head: ["Bộ phận (nhãn trên hình)", "Vị trí", "Ghi chú trên hình"],
        rows: [
          ["Envelope", "phần lớn nhất, phía trên", "nylon bag · open at the base · holds the heated air"],
          ["Parachute vent", "đỉnh của envelope", "circular panel · closed in flight · opened by a cord"],
          ["Skirt", "quanh miệng dưới của envelope", "fire-resistant fabric · protects the envelope from the flame"],
          ["Burner", "ngay trên giỏ, dưới miệng envelope", "burns propane"],
          ["Fuel cylinders", "trong giỏ", "propane"],
          ["Basket", "treo dưới envelope", "wicker · carries pilot and passengers"],
        ],
        caption: "Hình 1 (tả bằng bảng): cấu tạo của khinh khí cầu. Sơ đồ tự dựng cho bài luyện.",
      },
      {
        t: "figure",
        fig: {
          kind: "process",
          title: "How a hot-air balloon works",
          note: "Sơ đồ tự dựng cho bài luyện (giản lược); 100°C là số minh hoạ.",
          steps: [
            { label: "Envelope laid out on ground", note: "partly filled with cold air by a fan" },
            { label: "Burner lit", note: "air inside heated to about 100°C" },
            { label: "Hot air less dense than air outside", note: "envelope stands upright" },
            { label: "Balloon leaves the ground", note: "when lift exceeds total weight" },
            { label: "To climb", note: "burner fired in short bursts" },
            { label: "To descend", note: "air allowed to cool, or cord pulled — hot air escapes through vent" },
            { label: "No steering", note: "drifts with the wind · pilot changes height to find wind from another direction" },
            { label: "To land", note: "vent opened fully · envelope deflates" },
          ],
        },
      },
      {
        t: "passage", title: "Thân 1 (cấu tạo) — band 7 (ước tính), 52 từ",
        paras: [
          { text: "The balloon has six parts. There is an envelope, which is a nylon bag. There is a parachute vent at the top and there is a skirt at the bottom. There is also a burner, which burns propane. There are fuel cylinders and there is a basket, which carries the pilot and passengers." },
        ],
      },
      {
        t: "passage", title: "Bài mẫu band 8 (ước tính) — 249 từ (trong phòng thi nhắm 190–220)",
        paras: [
          { text: "The diagrams show the main components of a hot-air balloon and explain how it is made to rise, descend and land." },
          { text: "Overall, the balloon is a simple device with no engine and no means of steering. It works on the principle that heated air is lighter than the cooler air around it, and the pilot controls height alone, by regulating the temperature of the air inside." },
          { text: "The largest part is the envelope, a nylon bag open at the base, where a ring of fire-resistant fabric known as the skirt protects it from the flame. A circular vent at the top is kept closed in flight and can be opened by means of a cord. Beneath the envelope hangs a wicker basket, which carries the passengers and the propane cylinders, with the burner mounted directly above it." },
          { text: "Before take-off, the envelope is laid out and partly filled with cold air by a fan. The burner is then lit, heating the air to around 100°C; as this air becomes less dense, the envelope stands upright and, once the lift exceeds the total weight, the balloon leaves the ground. Firing the burner in short bursts makes it climb, whereas letting the air cool or pulling the cord to release hot air causes it to sink. Since the balloon simply drifts with the wind, the pilot can change direction only by moving to a height at which the wind blows differently. To land, the vent is opened fully, allowing the envelope to deflate." },
        ],
      },
      {
        t: "table", head: ["Tiêu chí", "Đoạn band 7", "Bài band 8", "Bài học"],
        rows: [
          ["Task Achievement", "Liệt kê đủ sáu bộ phận nhưng không nói chúng **liên quan** nhau thế nào", "Overview có công dụng + nguyên lý + điểm lạ (no engine, no steering); mọi bộ phận có vị trí và chức năng; đủ 100°C", "Overview của “how it works” trả lời: nó để làm gì, dựa vào cái gì"],
          ["Coherence & Cohesion", "There is… There is… There are…", "Đi theo **đường mắt**: trên xuống dưới (envelope → skirt → vent → basket → burner); thân 2 đi theo chuyến bay", "Chọn một trật tự không gian rồi giữ nó"],
          ["Lexical Resource", "has · part · top · bottom", "components · device · by means of · mounted · regulating · drifts · deflate", "Từ vị trí + từ điều khiển"],
          ["Grammar", "Câu tồn tại lặp; mệnh đề quan hệ đơn giản", "Đồng vị (a nylon bag open at the base) · đảo vị trí (Beneath the envelope hangs…) · V-ing làm chủ ngữ (Firing the burner makes…) · with + N + V3", "Chủ ngữ là hành động: V-ing + makes / causes"],
        ],
      },
      {
        t: "patterns", rows: [
          { formula: "N + consists of / is made up of + N   ·   N, + cụm danh từ (đồng vị), + V", vi: "Giới thiệu bộ phận kèm bản chất của nó trong cùng một câu.", examples: [
            { en: "The envelope, a nylon bag open at the base, holds the heated air.", vi: "Túi khí, một túi nylon hở ở đáy, giữ không khí nóng." },
          ] },
          { formula: "N + is + mounted above / attached to / located at / suspended beneath + N   ·   Beneath / Above + N + hangs / sits + N", vi: "Vị trí bộ phận: bị động trạng thái, hoặc đảo cụm vị trí lên đầu (dùng một lần).", examples: [
            { en: "The burner is mounted directly above the basket.", vi: "Bộ đốt được gắn ngay phía trên giỏ." },
            { en: "Beneath the envelope hangs a wicker basket.", vi: "Dưới túi khí treo một chiếc giỏ mây." },
          ] },
          { formula: "When / As + S + V(s/es), S + V(s/es)   ·   Once + S + V(s/es), S + V(s/es)", vi: "Vận hành = nhân quả ở hiện tại đơn. Bước tự xảy ra để chủ động.", examples: [
            { en: "As the air inside becomes less dense, the envelope stands upright.", vi: "Khi không khí bên trong loãng đi, túi khí dựng đứng lên." },
          ] },
          { formula: "V-ing + O + makes + N + V   ·   V-ing + O + causes / allows / enables + N + to V", vi: "Hành động điều khiển làm chủ ngữ. make + V trần; cause / allow / enable + to V.", examples: [
            { en: "Firing the burner makes the balloon climb.", vi: "Đốt lửa làm khí cầu bay lên." },
            { en: "Pulling the cord causes the balloon to sink.", vi: "Kéo dây làm khí cầu hạ xuống." },
          ] },
          { formula: "S + V, allowing / causing + N + to V   ·   by means of + N   ·   by + V-ing", vi: "Hệ quả ở cuối câu; phương tiện điều khiển.", examples: [
            { en: "The vent is opened fully, allowing the envelope to deflate.", vi: "Van được mở hết, cho phép túi khí xẹp xuống." },
            { en: "The pilot controls height by regulating the temperature of the air.", vi: "Phi công điều khiển độ cao bằng cách điều chỉnh nhiệt độ không khí." },
          ] },
        ],
      },
      {
        t: "note", title: "⚠️ Người Việt hay sai ở đề “how it works”",
        items: [
          "**make + to V:** ~~makes the balloon to climb~~ → makes the balloon **climb**. Nhưng: causes / allows / enables the balloon **to** climb.",
          "**Bị động cho việc tự xảy ra:** ~~the air is become less dense~~ · ~~the balloon is risen~~ → becomes · rises. rise (tự lên) ≠ raise (nâng cái gì lên).",
          "**Dùng thì tương lai hoặc quá khứ:** ~~the balloon will rise~~ · ~~the burner was lit~~. Cách một thiết bị hoạt động là sự thật chung ⇒ hiện tại đơn.",
          "**Bịa thông số:** độ cao bay được, tốc độ, số hành khách — nếu hình không ghi thì không viết. “a wicker basket, which carries the passengers” viết được vì hình có ghi.",
        ],
      },
      { t: "rule", formula: "Overview: It is used to + V / works on the principle that + S + V  →  Thân 1: N + is mounted above / attached to + N  →  Thân 2: V-ing + O + causes + N + to V · , allowing + N + to V", vi: "Công dụng + nguyên lý → cấu tạo theo trật tự không gian → vận hành theo nhân quả, thì hiện tại đơn." },
      {
        t: "mcq", id: "t5d12-viet-chon", title: "Chọn phương án tốt nhất (6 câu)",
        items: [
          { q: "1. Overview nào tốt nhất cho đề khinh khí cầu?", options: ["Overall, the balloon has six parts, which are the envelope, the vent, the skirt, the burner, the cylinders and the basket.", "Overall, the balloon rises because heated air is lighter than the surrounding air, and its height is controlled by warming or releasing that air.", "Overall, first the envelope is laid out on the ground and filled with cold air."], correct: 1, why: "Overview của “how it works” = nguyên lý + cách điều khiển. A chỉ liệt kê; C là bước đầu tiên, không phải tổng quan." },
          { q: "2. The burner ___ directly above the basket.", options: ["mounts", "is mounted", "is mounting"], correct: 1, why: "Vị trí bộ phận: bị động trạng thái is mounted." },
          { q: "3. Pulling the cord causes the balloon ___.", options: ["sink", "sinking", "to sink"], correct: 2, why: "cause + N + to V. (make + N + V trần.)" },
          { q: "4. As the air inside ___ less dense, the envelope stands upright.", options: ["becomes", "is become", "will become"], correct: 0, why: "Việc tự xảy ra, sự thật chung ⇒ hiện tại đơn, chủ động." },
          { q: "5. Câu nào đưa vào thông tin KHÔNG có trên hình?", options: ["Beneath the envelope hangs a wicker basket, which carries the passengers.", "The balloon can stay in the air for several hours and reach a height of 3,000 metres.", "The skirt, a ring of fire-resistant fabric, protects the envelope from the flame."], correct: 1, why: "Thời gian bay và độ cao không có trên sơ đồ. Hai câu kia chỉ viết lại ghi chú của hình." },
          { q: "6. Overview nào tốt nhất cho đề pho mát hai giai đoạn?", options: ["Overall, there are two stages and fourteen steps in the process.", "Overall, firstly the milk is delivered and finally the cheese is sent to shops.", "Overall, milk is first turned into curd within hours by means of heat and added ingredients, and this curd then becomes mature cheese through pressure and a storage period of up to eighteen months."], correct: 2, why: "C so được hai giai đoạn: thời gian và phương tiện. A chỉ đếm; B liệt kê bước đầu – cuối với từ nối của thân bài." },
        ],
      },
      {
        t: "quiz", id: "t5d12-viet-dich", title: "Dịch sang tiếng Anh — câu cho hai biến thể (5 câu)", kind: "translate",
        grammar: "consists of · during which · works on the principle that · V-ing + makes + N + V · , allowing + N + to V",
        items: [
          { q: "1. Quy trình gồm hai giai đoạn riêng biệt.", answers: ["The process consists of two distinct stages.", "The process is made up of two distinct stages.", "The process comprises two distinct stages.", "The process falls into two distinct stages.", "The process consists of two separate stages."], hint: "consists of · two distinct stages" },
          { q: "2. Sữa được để yên khoảng 40 phút, trong thời gian đó nó đông lại.", answers: ["The milk is left for about 40 minutes, during which it sets.", "The milk is left for about 40 minutes, during which time it sets.", "The milk is left for around 40 minutes, during which it sets.", "The milk is left for approximately 40 minutes, during which it sets."], hint: "is left for · during which it sets" },
          { q: "3. Khinh khí cầu hoạt động theo nguyên lý không khí nóng nhẹ hơn không khí lạnh.", answers: ["A hot-air balloon works on the principle that hot air is lighter than cold air.", "The hot-air balloon works on the principle that hot air is lighter than cold air.", "A hot air balloon works on the principle that hot air is lighter than cold air.", "Hot-air balloons work on the principle that hot air is lighter than cold air."], hint: "works on the principle that · lighter than" },
          { q: "4. Đốt lửa làm khí cầu bay lên.", answers: ["Firing the burner makes the balloon rise.", "Firing the burner causes the balloon to rise.", "Firing the burner makes the balloon climb.", "Firing the burner causes the balloon to climb."], hint: "Firing the burner · makes + N + V" },
          { q: "5. Van được mở hoàn toàn, cho phép túi khí xẹp xuống.", answers: ["The vent is opened fully, allowing the envelope to deflate.", "The vent is opened completely, allowing the envelope to deflate.", "The vent is fully opened, allowing the envelope to deflate."], hint: "is opened fully · allowing the envelope to deflate" },
        ],
      },

      { t: "h", text: "5. Hai mươi phút cho một bài process band 8" },
      {
        t: "table", head: ["Phút", "Việc", "Kiểm"],
        rows: [
          ["0–3", "Đọc hình. Trả lời 4 câu hỏi của mục 2 (hai giai đoạn) hoặc ghi **công dụng + nguyên lý** (how it works). Đánh dấu bước tự xảy ra bằng chữ A (active).", "Đã biết ranh giới hai khổ thân bài chưa?"],
          ["3–5", "Mở bài (paraphrase đề, nêu hai giai đoạn / hai hình) + overview 2 câu.", "Overview có một nhận định ngoài số bước không?"],
          ["5–11", "Thân 1: giai đoạn 1 / cấu tạo.", "Đủ mọi con số trên hình?"],
          ["11–17", "Câu bản lề + thân 2: giai đoạn 2 / vận hành.", "Bước tự xảy ra đang ở chủ động?"],
          ["17–20", "Soát 3 lượt: (1) is / are + V3 (2) mạo từ trước danh từ đếm được số ít (3) đếm số bước đã viết so với hình.", "Đủ 150 từ; không có số liệu bịa"],
        ],
      },

      { t: "h", text: "6. Đến lượt bạn — hai bài, mỗi bài 20 phút" },
      { t: "p", text: "**Bài A — quy trình hai giai đoạn.** Hai sơ đồ dưới đây cho biết nấm ăn được trồng thế nào. Chú ý: có bốn bước **tự xảy ra** (heap heats up · white threads spread · pins appear · mushrooms double in size) — đừng chia bị động." },
      {
        t: "figure",
        fig: {
          kind: "process",
          title: "Stage 1 — preparing the compost",
          note: "Sơ đồ tự dựng cho bài luyện, giản lược từ cách trồng nấm mỡ; các con số là số minh hoạ.",
          steps: [
            { label: "Straw and manure mixed", note: "piled in long heaps outdoors" },
            { label: "Watered and turned", note: "every 2–3 days · for 2 weeks" },
            { label: "Heap heats up", note: "naturally · reaches about 70°C" },
            { label: "Moved indoors and pasteurised", note: "60°C for 8 hours · kills pests" },
            { label: "Cooled to 25°C", note: "compost ready for planting" },
          ],
        },
      },
      {
        t: "figure",
        fig: {
          kind: "process",
          title: "Stage 2 — growing and harvesting",
          note: "Sơ đồ tự dựng cho bài luyện; các con số là số minh hoạ.",
          steps: [
            { label: "Spawn mixed into compost", note: "spawn = grain carrying the fungus" },
            { label: "Trays kept in the dark", note: "25°C · 2 weeks · white threads spread through compost" },
            { label: "Layer of soil added on top", note: "5 cm · kept moist" },
            { label: "Temperature lowered to 17°C", note: "fresh air let in" },
            { label: "Tiny “pins” appear", note: "after about 10 days" },
            { label: "Mushrooms double in size daily", note: "picked by hand after 5–7 days" },
            { label: "Graded and packed", note: "chilled to 2°C · sent to shops" },
          ],
        },
      },
      {
        t: "essay", id: "t5d12-viet-nam", task: "Task 1", minWords: 150,
        prompt: "The diagrams show the two stages in the commercial growing of mushrooms. Stage 1 — preparing the compost: straw and manure mixed and piled in long heaps outdoors → watered and turned every 2–3 days for 2 weeks → heap heats up naturally to about 70°C → moved indoors and pasteurised (60°C for 8 hours, kills pests) → cooled to 25°C, ready for planting. Stage 2 — growing and harvesting: spawn (grain carrying the fungus) mixed into compost → trays kept in the dark at 25°C for 2 weeks, white threads spread through compost → 5 cm layer of soil added on top, kept moist → temperature lowered to 17°C, fresh air let in → tiny “pins” appear after about 10 days → mushrooms double in size daily, picked by hand after 5–7 days → graded, packed, chilled to 2°C, sent to shops. Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.",
        tips: [
          "Overview: 12 bước, hai giai đoạn — so chúng (ngoài trời rồi trong nhà / chuẩn bị môi trường rồi nuôi nấm; nhiệt độ giảm dần 70 → 60 → 25 → 17 → 2°C là một nét đáng nêu).",
          "Câu bản lề: The second stage begins when spawn… is mixed into this compost.",
          "Chủ động cho bước tự xảy ra: the heap heats up · white threads spread · pins appear · the mushrooms double in size.",
          "Nêu mục đích chỉ khi hình có: pasteurised… in order to kill pests.",
        ],
      },
      { t: "p", text: "**Bài B — how something works.** Bảng dưới đây thay cho hình cấu tạo; sơ đồ cho biết cách vận hành của một chiếc bơm nước bằng tay." },
      {
        t: "table", head: ["Bộ phận", "Vị trí", "Ghi chú trên hình"],
        rows: [
          ["Handle", "phía trên, nối với cần piston", "long lever · moved up and down by hand"],
          ["Cylinder", "thân bơm, thẳng đứng", "metal tube"],
          ["Piston", "trong cylinder", "moves up and down · has a valve that opens upwards"],
          ["Lower valve", "đáy cylinder", "opens upwards only"],
          ["Pipe", "từ đáy cylinder xuống đất", "reaches the water underground"],
          ["Spout", "bên hông, gần đỉnh cylinder", "water flows out here"],
        ],
        caption: "Hình 1 (tả bằng bảng): cấu tạo của bơm tay. Sơ đồ tự dựng cho bài luyện.",
      },
      {
        t: "figure",
        fig: {
          kind: "process",
          title: "How a hand pump lifts water",
          note: "Sơ đồ tự dựng cho bài luyện (bơm hút đơn giản).",
          steps: [
            { label: "Handle pushed down", note: "piston rises inside cylinder" },
            { label: "Pressure below piston falls", note: "lower valve opens · water drawn up the pipe into cylinder" },
            { label: "Handle lifted", note: "piston moves down · lower valve closes, water cannot flow back" },
            { label: "Piston valve opens", note: "water passes to the space above the piston" },
            { label: "Handle pushed down again", note: "piston rises, lifting the water above it" },
            { label: "Water flows out of spout", note: "meanwhile more water is drawn in below" },
          ],
        },
      },
      {
        t: "essay", id: "t5d12-viet-bom", task: "Task 1", minWords: 150,
        prompt: "The diagrams show the structure of a hand-operated water pump and how it works. Structure: a handle (long lever, moved up and down by hand) connected to a piston; a vertical metal cylinder; the piston moves up and down inside the cylinder and has a valve that opens upwards; a lower valve at the base of the cylinder, opening upwards only; a pipe from the base of the cylinder down to the water underground; a spout near the top of the cylinder. Operation: handle pushed down → piston rises inside cylinder → pressure below piston falls, lower valve opens, water is drawn up the pipe into the cylinder → handle lifted, piston moves down, lower valve closes so water cannot flow back → piston valve opens, water passes to the space above the piston → handle pushed down again, piston rises, lifting the water above it → water flows out of the spout while more water is drawn in below. Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.",
        tips: [
          "Overview: công dụng (raises water from underground) + nguyên lý (two one-way valves and a moving piston; mỗi lần đẩy cần vừa hút nước vào vừa đẩy nước ra).",
          "Thân 1 — cấu tạo, đi từ trên xuống: handle → piston → cylinder → lower valve → pipe; spout ở bên.",
          "Thân 2 — vận hành theo nhân quả: When the handle is pushed down, the piston rises, causing the pressure beneath it to fall…",
          "Hiện tại đơn; bước tự xảy ra để chủ động: the pressure falls · the valve opens · water flows out.",
        ],
      },
      {
        t: "note", title: "📌 Sau khi AI chấm — năm câu hỏi tự soát",
        items: [
          "Overview của tôi có **một nhận định** ngoài số bước / số bộ phận không?",
          "Ranh giới hai khổ thân bài có trùng với ranh giới thật của hình không?",
          "Mọi con số trên hình đã có trong bài chưa? Có con số nào tôi tự thêm không?",
          "Các bước tự xảy ra (heats up, spread, appear, falls, opens, flows) có đang ở chủ động không?",
          "Tôi dùng mấy từ nối thời gian kiểu Then / Next / After that? (Band 8: không quá hai.)",
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI 3 — NGHE ═══════════════════════════ */
  {
    id: "t5d12-nghe",
    kind: "listening",
    title: "Nghe: Part 4 Summary completion band 8 + Part 3 có bẫy (giọng Canada · Anh · Úc · New Zealand)",
    goal: "Làm đúng 17–20/20 câu của một Part 3 ba người nói có bẫy “nêu rồi bác” và một Part 4 dạng Summary completion ở tốc độ thật (~170–175 từ/phút): đọc bản tóm tắt như một câu chuyện trước khi nghe, đoán loại từ từ ngữ pháp của câu, và chỉ viết từ đứng SAU thông tin bị bác.",
    minutes: 80,
    blocks: [
      {
        t: "recap", title: "Bài này học gì · đẩy tiêu chí nào",
        items: [
          "Đẩy **Listening lên 35+/40**: Part 3 và Part 4 là 20 câu cuối. Hôm nay làm cả hai liền nhau, **nghe một lần**, không nghỉ giữa hai phần — đúng như nửa sau của đề thật.",
          "**Summary completion** (ôn Tập 3 Ngày 24, Tập 4 Ngày 13) là dạng khó nhất của Part 4: phiếu không phải ghi chú gạch đầu dòng mà là **một đoạn văn viết lại** bài giảng, gần như không lặp chữ nào của người nói.",
          "**Bẫy Part 3 band 8** (ôn Tập 4 Ngày 12, Tập 5 Ngày 4 · 9): đề xuất được nêu rồi bị bác; phương án sai được nói bằng đúng chữ trên đề; đáp án đến trong câu của người THỨ BA.",
          "Hai băng dùng lại từ của Bài 1: control group · working memory · habituation · crust · strata · bedrock · glaciers · magma. Nếu chưa học Bài 1, học trước.",
          "Giọng: tiến sĩ Leclerc (Canada, nữ) · Tom (Anh, nam) · Kirra (Úc, nữ) · giảng viên Part 4 (New Zealand, nam).",
        ],
      },

      { t: "h", text: "1. Summary completion khác Note completion ở đâu" },
      {
        t: "table", head: ["", "Note completion (Ngày 5)", "Summary completion (hôm nay)"],
        rows: [
          ["Hình thức phiếu", "Gạch đầu dòng, có tiêu đề phụ", "Một đoạn văn liền, 100–150 từ"],
          ["Chữ trên phiếu", "Danh từ chính thường lặp lại lời người nói", "**Paraphrase gần hết**: weather man → whose professional field was…"],
          ["Mốc để dò", "Tiêu đề phụ, con số, tên riêng", "Tên riêng + **từ nối của đoạn văn** (chiefly because · also · later · Today)"],
          ["Ràng buộc ngữ pháp", "Lỏng: cụm danh từ rời", "**Chặt**: chỗ trống nằm trong một câu đủ — mạo từ, giới từ, số ít / nhiều đều phải khớp"],
          ["Bỏ thông tin", "Hầu như mỗi ý của bài đều có trên phiếu", "Tóm tắt **bỏ hẳn** vài đoạn của bài giảng ⇒ có lúc nghe 40 giây không có câu nào"],
          ["Bẫy", "Một từ nhiễu đứng cạnh", "Từ nhiễu **hợp ngữ pháp** với chỗ trống; chỉ nghĩa của cả câu loại được nó"],
        ],
      },
      {
        t: "note", title: "⚠️ Ba cách mất điểm ở Summary",
        items: [
          "**Đọc phiếu như đọc từng câu rời.** Bản tóm tắt là một câu chuyện có đầu có đuôi. Không nắm mạch chuyện thì khi bài giảng đi qua một đoạn không có câu hỏi, bạn tưởng mình lạc và hoảng.",
          "**Viết từ nghe thấy đầu tiên thuộc đúng loại.** Ở band 8, từ đó thường là thứ bị bác: “His doctorate was in astronomy, though… His career was in meteorology.”",
          "**Quên rằng tóm tắt đã đổi cấu trúc.** Bài giảng: “What he couldn't supply was a mechanism.” Phiếu: “he could offer no convincing ………… for the movement”. Cùng nghĩa, không chung chữ nào ngoài đáp án.",
        ],
      },

      { t: "h", text: "2. Bốn mươi lăm giây đọc trước — ba việc" },
      {
        t: "sodo", kind: "flow", title: "Đọc trước một bản Summary",
        steps: [
          { label: "① Đọc cả đoạn một lượt (15 giây)", sub: "Ai? Chủ trương gì? Bị gì? Về sau ra sao? — chưa nhìn chỗ trống" },
          { label: "② Mỗi chỗ trống: loại từ + số (20 giây)", sub: "a small ___ ⇒ danh từ đếm được số ít · made by ___ ⇒ danh từ số nhiều / không đếm được" },
          { label: "③ Khoanh 4–5 “cọc”", sub: "tên riêng, năm, từ nối: chiefly because · He died in · Support came later · Today" },
        ],
        caption: "Cọc là thứ bạn sẽ NGHE thấy gần như nguyên văn; chỗ trống nằm giữa hai cọc.",
      },
      {
        t: "table", head: ["Quanh chỗ trống", "Suy ra", "Ví dụ"],
        rows: [
          ["a / an + adj + ___", "danh từ đếm được số ít", "a small **reptile** · a deep **valley**"],
          ["made by / caused by ___ (không mạo từ)", "danh từ số nhiều hoặc không đếm được", "made by **glaciers**"],
          ["land ___ had once linked…", "danh từ số nhiều (động từ had linked + nghĩa nhiều nơi)", "land **bridges**"],
          ["no convincing ___ for", "danh từ số ít trừu tượng", "no convincing **mechanism** for"],
          ["the ___ of + N", "danh từ chỉ đại lượng", "the **speed** of drift"],
          ["as fast as ___ grow", "danh từ số nhiều (grow không s)", "as fast as **fingernails** grow"],
        ],
      },
      { t: "rule", formula: "Đọc cả đoạn → loại từ + số ít / nhiều cho từng chỗ trống → khoanh cọc (tên, năm, từ nối) → nghe: viết từ đứng SAU thông tin bị bác", vi: "Chỗ trống của Summary nằm trong câu đủ: đáp án phải khớp cả nghĩa lẫn ngữ pháp." },

      { t: "h", text: "3. Bẫy Part 3 ở band 8 — năm kiểu, một nguyên tắc" },
      { t: "p", text: "Ngày 4 và Ngày 9 đã dạy nguyên tắc: ==đáp án là lời cuối không bị ai bác==. Hôm nay hệ thống lại năm hình dạng của cái bẫy đó. Trong băng Part 3 bên dưới có đủ cả năm." },
      {
        t: "table", head: ["Kiểu bẫy", "Nghe như", "Trong băng hôm nay"],
        rows: [
          ["① Phủ định rồi mới nói thật", "It's not that A… My worry is B.", "It's not that it's too broad… 'noise' could mean almost anything."],
          ["② Đề xuất → lý do bác → đề xuất khác", "I'd thought X. — X drags in… — Then how about Y?", "traffic → music → speech"],
          ["③ Nhận xét mỉa thay cho lời từ chối", "Which half the department can now recite in their sleep.", "Bác danh sách từ mà không nói “no”"],
          ["④ Tự nêu rồi tự gạt", "That doubles the session… though twenty minutes is hardly a lot.", "Thời gian KHÔNG phải mối lo"],
          ["⑤ Người thứ ba chốt", "A đề xuất, B phản đối, C (thường là giảng viên) quyết", "Get two or three friends through it this week."],
        ],
      },
      {
        t: "note", title: "💡 Mẹo cho dạng Matching “họ quyết định gì”",
        items: [
          "Mỗi mục (volume, study habits…) được bàn trong **3–4 lượt lời**. Đừng viết ở lượt đầu. Ghi một chữ nháp, chờ tới khi họ chuyển sang mục kế rồi mới chốt.",
          "Lời đồng ý ngắn là tín hiệu chốt: Agreed. · Fair enough. · Sensible. · Point taken. · We'll do that. Nghe thấy chúng ⇒ đề xuất NGAY TRƯỚC đó là đáp án.",
          "Phương án thừa trong hộp luôn là thứ **đã được nói ra** rồi bị bác (let each participant decide · borrow from the department). Không có phương án nào “từ trên trời rơi xuống”.",
        ],
      },

      { t: "h", text: "4. Part 3 — Questions 21–30 (ba người nói)" },
      { t: "p", text: "Đọc câu 21–30 trong **40 giây**, rồi nghe một lần. **Questions 21–26:** Choose the correct letter, A, B or C. **Questions 27–30:** What do the speakers decide about each of the following? Choose the correct letter, A–F." },
      {
        t: "listen", id: "t5d12-nghe-part3", title: "Part 3 — Planning an experiment on background noise and working memory",
        dan: { so: "Day 12, Part 3", boiCanh: "two psychology students, Tom and Kirra, discussing the design of an experiment with their tutor, Dr Leclerc.", cau: [21, 30] },
        note: "Khoảng 3 phút 45 giây, ~170 từ/phút. Dr Leclerc: giọng Canada (nữ). Tom: giọng Anh (nam). Kirra: giọng Úc (nữ).",
        lines: [
          { who: "Dr Leclerc", voice: "ca-nu", text: "Come in, both of you. So, the working memory project. Remind me how you ended up with noise as your topic.", vi: "Vào đi cả hai. Nào, đề tài trí nhớ làm việc. Nhắc lại xem vì sao các em chọn tiếng ồn." },
          { who: "Tom", voice: "uk-nam", text: "I'd assumed it was that paper you mentioned in week two, to be honest.", vi: "Thật ra em cứ tưởng là do bài báo cô nhắc ở tuần hai." },
          { who: "Kirra", voice: "au-nu", text: "That came later, actually. It was the building work outside the library last term. I couldn't hold a single line of code in my head, and I wondered whether that was just me or whether it happens to everyone.", vi: "Cái đó là về sau. Là do công trình xây dựng ngoài thư viện kỳ trước. Em không giữ nổi một dòng code trong đầu, và em tự hỏi chỉ mình em bị hay ai cũng thế." },
          { who: "Dr Leclerc", voice: "ca-nu", text: "A good place to start. Now, your question as written is 'Does background noise affect working memory?' It's not that it's too broad – plenty of projects are broader. My worry is that 'noise' could mean almost anything. Speech? Traffic? Music? They don't behave the same way.", vi: "Khởi đầu tốt. Câu hỏi các em viết là “Tiếng ồn nền có ảnh hưởng tới trí nhớ làm việc không?” Không phải là nó quá rộng — nhiều đề tài còn rộng hơn. Cô lo là “tiếng ồn” có thể là bất cứ thứ gì. Tiếng nói? Xe cộ? Nhạc? Chúng tác động không giống nhau." },
          { who: "Kirra", voice: "au-nu", text: "Well, given where the idea came from, I'd thought traffic, or drilling.", vi: "Xét theo nguồn gốc ý tưởng thì em đã nghĩ tới tiếng xe, hoặc tiếng khoan." },
          { who: "Tom", voice: "uk-nam", text: "Wouldn't music be more relevant, though? Half our year revise with headphones on.", vi: "Nhưng nhạc chẳng phải sát thực tế hơn sao? Nửa khoá mình đeo tai nghe khi ôn bài." },
          { who: "Dr Leclerc", voice: "ca-nu", text: "Music's tempting, but it drags in preference. Someone who loves the track and someone who can't stand it aren't having the same experience.", vi: "Nhạc thì hấp dẫn, nhưng nó kéo theo yếu tố sở thích. Người mê bài đó và người không chịu nổi nó không trải qua cùng một thứ." },
          { who: "Kirra", voice: "au-nu", text: "Then how about speech? A recording of people chatting in the café. That's what the library really sounds like at four o'clock.", vi: "Vậy tiếng nói thì sao? Một bản ghi người ta trò chuyện trong quán cà phê. Thư viện lúc bốn giờ nghe đúng như thế." },
          { who: "Tom", voice: "uk-nam", text: "And from what I've read, speech is supposed to be the most disruptive, so we'd stand a chance of finding something. Fine – conversation it is.", vi: "Và theo những gì em đọc, tiếng nói được cho là gây nhiễu nhất, nên mình có cơ hội tìm ra điều gì đó. Được — chọn hội thoại." },
          { who: "Dr Leclerc", voice: "ca-nu", text: "Good. And how will you measure memory?", vi: "Tốt. Còn đo trí nhớ bằng cách nào?" },
          { who: "Tom", voice: "uk-nam", text: "I thought we'd borrow the word list from your week-three lecture.", vi: "Em định mượn danh sách từ trong bài giảng tuần ba của cô." },
          { who: "Dr Leclerc", voice: "ca-nu", text: "Which half the department can now recite in their sleep.", vi: "Cái mà nửa khoa giờ đọc thuộc lòng cả trong lúc ngủ." },
          { who: "Kirra", voice: "au-nu", text: "What about digits? They hear a string of numbers and say them back in reverse. I did one as a volunteer last year.", vi: "Thế chữ số thì sao? Họ nghe một dãy số rồi đọc ngược lại. Năm ngoái em từng làm tình nguyện viên cho một bài như vậy." },
          { who: "Dr Leclerc", voice: "ca-nu", text: "Backward digit span. That's the standard task, and you can make it longer until people fail. Use that. Now, design.", vi: "Nhớ dãy số ngược. Đó là bài chuẩn, và các em có thể kéo dài dãy tới khi người ta sai. Dùng cái đó. Giờ tới thiết kế." },
          { who: "Tom", voice: "uk-nam", text: "Two groups of fifteen. One does the task in silence – that's our control group – and the other with the recording playing.", vi: "Hai nhóm mười lăm người. Một nhóm làm trong im lặng — đó là nhóm đối chứng — nhóm kia làm khi bản ghi đang phát." },
          { who: "Dr Leclerc", voice: "ca-nu", text: "Fifteen is perfectly respectable at this level. What bothers me is how you'd know the two groups were equally good to begin with. If the three maths students all land in the silent group, you'll find a difference that has nothing to do with noise.", vi: "Mười lăm là hoàn toàn ổn ở cấp độ này. Điều cô băn khoăn là làm sao biết hai nhóm giỏi ngang nhau từ đầu. Nếu ba sinh viên toán rơi hết vào nhóm im lặng, các em sẽ thấy một khác biệt chẳng liên quan gì tới tiếng ồn." },
          { who: "Kirra", voice: "au-nu", text: "So everybody does both? Once in silence, once with the recording?", vi: "Vậy ai cũng làm cả hai? Một lần im lặng, một lần có bản ghi?" },
          { who: "Tom", voice: "uk-nam", text: "That doubles the session… though twenty minutes is hardly a lot to ask.", vi: "Thế là buổi làm dài gấp đôi… dù hai mươi phút thì cũng chẳng nhiều nhặn gì." },
          { who: "Kirra", voice: "au-nu", text: "It's not the time I'm worried about. Whoever does the second round has already had a practice go. They'd improve anyway.", vi: "Em không lo chuyện thời gian. Ai làm lượt hai cũng đã được tập một lần rồi. Kiểu gì họ cũng khá lên." },
          { who: "Tom", voice: "uk-nam", text: "Unless half of them start in silence and half start with the noise. Then it evens out.", vi: "Trừ khi một nửa bắt đầu bằng im lặng và một nửa bắt đầu bằng tiếng ồn. Thế thì cân bằng." },
          { who: "Dr Leclerc", voice: "ca-nu", text: "Exactly. Now, a few details. How loud is the recording?", vi: "Chính xác. Giờ vài chi tiết. Bản ghi to cỡ nào?" },
          { who: "Tom", voice: "uk-nam", text: "We could let people set it wherever feels natural.", vi: "Mình có thể để mỗi người tự chỉnh tới mức thấy tự nhiên." },
          { who: "Kirra", voice: "au-nu", text: "Then it's a different experiment for each person. I'd fix it – one level, through headphones, identical for all thirty.", vi: "Thế thì mỗi người một thí nghiệm khác nhau. Em sẽ cố định — một mức, qua tai nghe, giống hệt nhau cho cả ba mươi người." },
          { who: "Tom", voice: "uk-nam", text: "Fair enough. Should we borrow a sound meter from the department to check?", vi: "Hợp lý. Mình có nên mượn máy đo âm lượng của khoa để kiểm không?" },
          { who: "Kirra", voice: "au-nu", text: "There's an app for that. The point is that nobody touches the dial.", vi: "Có ứng dụng làm việc đó. Cốt là không ai được đụng vào nút chỉnh." },
          { who: "Dr Leclerc", voice: "ca-nu", text: "Agreed. What about people who always study with noise around them? You might expect habituation – they've simply stopped noticing.", vi: "Đồng ý. Còn những người lúc nào cũng học giữa tiếng ồn thì sao? Có thể có hiện tượng quen dần — họ đơn giản là không còn để ý." },
          { who: "Tom", voice: "uk-nam", text: "We could screen for that when they sign up.", vi: "Mình có thể sàng lọc chuyện đó lúc họ đăng ký." },
          { who: "Kirra", voice: "au-nu", text: "If we ask beforehand, we give away what the study's about. I'd put two or three questions on a sheet they fill in once they've finished.", vi: "Hỏi trước là lộ mục đích nghiên cứu. Em sẽ đặt hai ba câu hỏi vào một tờ phiếu họ điền sau khi làm xong." },
          { who: "Dr Leclerc", voice: "ca-nu", text: "Sensible. Have you tried any of this on a real person?", vi: "Hợp lý. Các em đã thử những thứ này trên người thật chưa?" },
          { who: "Tom", voice: "uk-nam", text: "Not yet. I suppose we could just see how the first few sessions go.", vi: "Chưa ạ. Em nghĩ mình cứ xem mấy buổi đầu diễn ra thế nào." },
          { who: "Dr Leclerc", voice: "ca-nu", text: "And discover in session one that your digit strings are too easy? No. Get two or three friends through it this week, before you recruit anybody.", vi: "Để rồi ngay buổi một mới phát hiện dãy số quá dễ à? Không. Tuần này cho hai ba người bạn làm thử, trước khi tuyển bất kỳ ai." },
          { who: "Kirra", voice: "au-nu", text: "We'll do that on Thursday.", vi: "Bọn em sẽ làm vào thứ Năm." },
          { who: "Tom", voice: "uk-nam", text: "One last thing. I'd love to bring everyone back a week later and see what they still remember.", vi: "Một điều cuối. Em rất muốn gọi mọi người quay lại sau một tuần để xem họ còn nhớ gì." },
          { who: "Dr Leclerc", voice: "ca-nu", text: "That's long-term retention, Tom, which is a different question and a different project. You've got four weeks.", vi: "Đó là ghi nhớ dài hạn, Tom ạ — một câu hỏi khác và một đề tài khác. Các em có bốn tuần thôi." },
          { who: "Tom", voice: "uk-nam", text: "Point taken. We'll drop it.", vi: "Em hiểu rồi. Bọn em bỏ phần đó." },
        ],
      },
      {
        t: "mcq", id: "t5d12-nghe-p3-chon", title: "Questions 21–26 — Choose the correct letter, A, B or C",
        items: [
          { q: "21. Where did the idea for the project originally come from?", options: ["a research paper discussed in a lecture", "one student's own difficulty in concentrating", "a suggestion made by Dr Leclerc"], correct: 1, why: "Kirra: “That came later, actually. It was the building work outside the library… I couldn't hold a single line of code in my head.” Bài báo (A) có được nhắc nhưng “came later”. Bẫy ②." },
          { q: "22. What is Dr Leclerc's objection to the research question?", options: ["It covers too wide an area.", "It has already been answered by other researchers.", "It does not say what kind of sound is meant."], correct: 2, why: "“It's not that it's too broad… My worry is that 'noise' could mean almost anything.” A bị phủ định thẳng — bẫy ①. B không được nói." },
          { q: "23. Which sound do they finally agree to use?", options: ["a recorded conversation", "instrumental music", "traffic"], correct: 0, why: "traffic (Kirra) → music (Tom; bị bác vì “drags in preference”) → speech: “Fine – conversation it is.” Đáp án là đề xuất thứ ba." },
          { q: "24. How will the participants' memory be tested?", options: ["by recalling a list of words", "by doing mental arithmetic", "by repeating numbers in reverse order"], correct: 2, why: "Danh sách từ bị bác bằng một câu mỉa (“recite in their sleep” — bẫy ③). “say them back in reverse… Use that.” B không có trong băng: digits ≠ arithmetic." },
          { q: "25. What weakness does Dr Leclerc see in using two separate groups?", options: ["The groups would be too small.", "The groups might differ in ability from the start.", "Participants might work out the purpose of the study."], correct: 1, why: "“Fifteen is perfectly respectable… What bothers me is how you'd know the two groups were equally good to begin with.” A bị phủ định; C thuộc chuyện khác (câu 28)." },
          { q: "26. What concerns Kirra about asking every participant to do the task twice?", options: ["The session would take too long.", "Participants would lose interest.", "Scores would go up the second time whatever the conditions."], correct: 2, why: "“It's not the time I'm worried about… has already had a practice go. They'd improve anyway.” A là mối lo Tom tự nêu rồi tự gạt — bẫy ④." },
        ],
      },
      {
        t: "table", head: ["", "Decisions"],
        rows: [
          ["A", "borrow it from the department"],
          ["B", "let each participant decide"],
          ["C", "leave it out of the project"],
          ["D", "do it before the main study begins"],
          ["E", "ask participants about it once the task is over"],
          ["F", "keep it the same for everyone"],
        ],
      },
      {
        t: "quiz", id: "t5d12-nghe-p3-ghep", title: "Questions 27–30 — gõ MỘT chữ cái A–F", kind: "fill",
        items: [
          { q: "27. the volume of the recording", answers: ["F"], hint: "“I'd fix it – one level… identical for all thirty.” — “Fair enough.” B là đề xuất của Tom (let people set it) bị bác; A (sound meter) bị gạt bằng “There's an app for that”." },
          { q: "28. participants' usual study habits", answers: ["E"], hint: "“two or three questions on a sheet they fill in once they've finished” — “Sensible.” Hỏi lúc đăng ký bị bác vì lộ mục đích." },
          { q: "29. a trial run", answers: ["D"], hint: "“Get two or three friends through it this week, before you recruit anybody.” Người thứ ba chốt — bẫy ⑤." },
          { q: "30. a test of what people remember a week later", answers: ["C"], hint: "“a different question and a different project” — “Point taken. We'll drop it.”" },
        ],
      },
      {
        t: "table", head: ["Câu", "Phương án bị bác", "Ai bác", "Chữ báo hiệu"],
        rows: [
          ["21", "bài báo tuần hai", "Kirra", "That came later, actually."],
          ["22", "quá rộng", "Dr Leclerc tự phủ định", "It's not that… My worry is…"],
          ["23", "traffic → music", "Tom, rồi Dr Leclerc", "though? · but it drags in… · Then how about…"],
          ["24", "word list", "Dr Leclerc (câu mỉa)", "Which half the department can now recite…"],
          ["25", "nhóm quá nhỏ", "Dr Leclerc", "perfectly respectable… What bothers me is…"],
          ["26", "tốn thời gian", "Tom tự gạt, Kirra xác nhận", "though… hardly a lot · It's not the time…"],
          ["27", "tự chỉnh âm lượng · mượn máy đo", "Kirra", "Then it's a different experiment… · There's an app"],
          ["28", "hỏi khi đăng ký", "Kirra", "If we ask beforehand, we give away…"],
        ],
      },

      { t: "h", text: "5. Part 4 — Questions 31–40 (Summary completion, giọng New Zealand)" },
      { t: "p", text: "Dùng **45 giây** làm ba việc của mục 2 trên bản tóm tắt dưới đây. Rồi nghe **một lần**. Complete the summary below. Write **ONE WORD ONLY** for each answer." },
      { t: "p", text: "**Wegener and continental drift.** Alfred Wegener, whose professional field was **31** ………… rather than geology, proposed in 1912 that the continents had once formed a single landmass. His evidence included the fossils of a small **32** ………… found on both sides of the Atlantic, an animal that could not have crossed an ocean, and scratches made by **33** ………… in regions that are now hot. Geologists of the time preferred to explain such finds by supposing that land **34** ………… had once linked the continents and later sunk." },
      { t: "p", text: "Wegener's theory was rejected chiefly because he could offer no convincing **35** ………… for the movement; a leading physicist showed that the forces he suggested were far too weak. His estimate of the **36** ………… of the drift, based on faulty measurements in Greenland, also damaged his case. He died in 1930." },
      { t: "p", text: "Support came later from the ocean floor. A researcher mapping the Atlantic noticed a deep **37** ………… running along the middle of its central ridge, a finding her colleague at first refused to accept. It was then proposed that new crust forms there and spreads outwards, and this was confirmed by a pattern of magnetic **38** ………… in the rocks on either side. Today the plates are known to move about as fast as **39** ………… grow. The lecturer concludes that the theory failed at first not for lack of **40** ………… but for lack of an explanation." },
      {
        t: "listen", id: "t5d12-nghe-part4", title: "Part 4 — Lecture: the man who moved the continents",
        dan: { so: "Day 12, Part 4", boiCanh: "part of a geology lecture about the history of the theory of continental drift.", cau: [31, 40] },
        note: "Khoảng 5 phút 20 giây, ~172 từ/phút. Giảng viên: giọng New Zealand (nam). Không có quãng nghỉ giữa bài.",
        lines: [
          { voice: "nz-nam", text: "Good morning. Last week we looked at what the Earth's crust is made of. Today I want to tell you how we found out that it moves – and why the man who worked it out spent the rest of his life being told he was wrong.", vi: "Chào buổi sáng. Tuần trước ta xem lớp vỏ Trái Đất làm bằng gì. Hôm nay tôi muốn kể chúng ta phát hiện ra nó chuyển động như thế nào — và vì sao người tìm ra điều đó phải nghe bảo mình sai suốt phần đời còn lại." },
          { voice: "nz-nam", text: "His name was Alfred Wegener, and the first thing to say about him is that he wasn't a geologist. His doctorate was in astronomy, though he never worked as an astronomer. His career was in meteorology: he flew balloons, he studied the upper atmosphere, he wrote a textbook on it. So when, in 1912, he stood up in front of a room of geologists and told them the continents had once been joined together, he was, as far as they were concerned, a weather man who'd wandered into the wrong lecture.", vi: "Tên ông là Alfred Wegener, và điều đầu tiên cần nói là ông không phải nhà địa chất. Bằng tiến sĩ của ông là thiên văn học, dù ông chưa từng làm nghề thiên văn. Sự nghiệp của ông là khí tượng học: ông thả khí cầu, nghiên cứu tầng cao khí quyển, viết một giáo trình về nó. Nên năm 1912, khi ông đứng trước một phòng toàn nhà địa chất và bảo rằng các lục địa từng dính liền nhau, thì với họ ông là một anh dự báo thời tiết đi lạc vào nhầm giảng đường." },
          { voice: "nz-nam", text: "Now, Wegener wasn't the first person to look at a map and notice that South America would fit rather neatly against Africa. People had been remarking on that for three hundred years. What he did was go looking for evidence that the fit was more than a coincidence. And he found a good deal.", vi: "Wegener không phải người đầu tiên nhìn bản đồ và thấy Nam Mỹ khớp khá khít với châu Phi. Người ta đã nhận xét điều đó suốt ba trăm năm. Việc ông làm là đi tìm bằng chứng rằng sự khớp ấy không phải trùng hợp. Và ông tìm được khá nhiều." },
          { voice: "nz-nam", text: "Take fossils. There's a fern called Glossopteris that turns up right across the southern continents, and its seeds are far too heavy to have blown across an ocean. But his favourite example was an animal: Mesosaurus, a reptile about a metre long that lived in fresh water. Its remains are found in Brazil and in southern Africa and nowhere else. A freshwater creature that size doesn't swim the Atlantic.", vi: "Lấy hoá thạch làm ví dụ. Có một loài dương xỉ tên Glossopteris xuất hiện khắp các lục địa phía nam, và hạt của nó quá nặng để gió thổi qua đại dương. Nhưng ví dụ ông thích nhất là một con vật: Mesosaurus, một loài bò sát dài chừng một mét, sống ở nước ngọt. Di cốt của nó được tìm thấy ở Brazil và miền nam châu Phi, không nơi nào khác. Một sinh vật nước ngọt cỡ đó không bơi qua Đại Tây Dương." },
          { voice: "nz-nam", text: "Then there were the rocks. Mountain ranges on one side of the ocean seemed to carry on, in the same strata, on the other. And in India and southern Africa – places that are hot today – he pointed to bedrock covered in long parallel scratches, the kind that are left only by glaciers. You might put that down to a colder climate in the past, but the scratches pointed outwards from a centre that made sense only if those lands had once been bunched together near the South Pole. Put it all back together and you get a single enormous continent, which came to be called Pangaea.", vi: "Rồi tới đá. Các dãy núi ở bờ này đại dương dường như nối tiếp, với cùng các tầng đá, ở bờ kia. Và ở Ấn Độ và miền nam châu Phi — những nơi ngày nay nóng — ông chỉ ra nền đá phủ đầy những vết xước dài song song, loại vết chỉ sông băng mới để lại. Bạn có thể cho rằng đó là do khí hậu xưa lạnh hơn, nhưng các vết xước toả ra từ một tâm điểm chỉ hợp lý nếu những vùng đất ấy từng dồn lại với nhau gần Nam Cực. Ghép tất cả lại, ta có một lục địa khổng lồ duy nhất, về sau được gọi là Pangaea." },
          { voice: "nz-nam", text: "So how did geologists explain the same facts? They had an answer ready. Animals and plants had walked across on land bridges – long strips of land that had since sunk beneath the sea. Nobody had ever found one, but they were considered a good deal more respectable than moving continents.", vi: "Vậy các nhà địa chất giải thích cùng những sự kiện đó thế nào? Họ có sẵn câu trả lời. Động vật và thực vật đã đi qua trên những cầu đất — những dải đất dài về sau chìm xuống biển. Chưa ai tìm thấy cái nào, nhưng chúng được coi là đàng hoàng hơn hẳn chuyện lục địa di chuyển." },
          { voice: "nz-nam", text: "And here we come to Wegener's real difficulty. It wasn't evidence. What he couldn't supply was a mechanism. If continents move, something has to push them, and when he was pressed he suggested the spin of the Earth and the pull of the tides. A British physicist, Harold Jeffreys, did the sums and showed that those forces were hopelessly weak – and that solid rock couldn't plough through the ocean floor in any case.", vi: "Và đây là khó khăn thật sự của Wegener. Không phải bằng chứng. Thứ ông không đưa ra được là một cơ chế. Nếu lục địa di chuyển thì phải có cái gì đẩy chúng, và khi bị hỏi dồn, ông nêu chuyển động quay của Trái Đất và lực hút của thuỷ triều. Một nhà vật lý người Anh, Harold Jeffreys, đã tính toán và cho thấy các lực đó yếu một cách vô vọng — và đằng nào thì đá rắn cũng không thể cày xuyên qua đáy đại dương." },
          { voice: "nz-nam", text: "Wegener made matters worse with numbers of his own. Relying on some unreliable measurements of longitude in Greenland, he put the speed of the drift at tens of metres a year. That's something like a thousand times too fast, and his critics seized on it. At a conference in New York in 1926, speaker after speaker lined up to dismiss the whole idea. Four years later Wegener died on an expedition to Greenland, a few days after his fiftieth birthday, with his theory more or less buried.", vi: "Wegener còn làm tình hình tệ hơn bằng chính con số của mình. Dựa vào vài phép đo kinh độ không đáng tin ở Greenland, ông cho rằng tốc độ trôi là hàng chục mét mỗi năm. Con số đó nhanh gấp cỡ một nghìn lần thực tế, và những người phê bình chộp ngay lấy nó. Tại một hội nghị ở New York năm 1926, hết diễn giả này tới diễn giả khác đứng lên bác toàn bộ ý tưởng. Bốn năm sau, Wegener mất trong một chuyến thám hiểm Greenland, vài ngày sau sinh nhật thứ năm mươi, khi học thuyết của ông gần như đã bị chôn vùi." },
          { voice: "nz-nam", text: "It didn't stay buried, and the reason lies under the sea. Interestingly, part of the answer had been offered in Wegener's own lifetime: a geologist named Arthur Holmes suggested that heat makes the rock of the mantle circulate, very slowly, and that this could carry the crust along. Hardly anyone took any notice.", vi: "Nó không bị chôn mãi, và lý do nằm dưới đáy biển. Điều thú vị là một phần lời giải đã được đưa ra ngay lúc Wegener còn sống: nhà địa chất Arthur Holmes gợi ý rằng nhiệt làm đá của lớp manti lưu chuyển, rất chậm, và điều đó có thể mang lớp vỏ đi theo. Hầu như không ai để ý." },
          { voice: "nz-nam", text: "What changed minds was a map. In the early 1950s an American researcher, Marie Tharp, was drawing the floor of the Atlantic from thousands of depth readings. Women weren't allowed on the research ships, so she worked from other people's numbers. And she saw that the great ridge down the middle of the ocean wasn't a simple mountain chain: running along its crest was a deep valley, exactly what you'd expect if the sea bed were being pulled apart. Her colleague Bruce Heezen wouldn't have it. It took him the best part of a year to accept that she was right.", vi: "Thứ làm người ta đổi ý là một tấm bản đồ. Đầu thập niên 1950, một nhà nghiên cứu người Mỹ, Marie Tharp, vẽ đáy Đại Tây Dương từ hàng nghìn số đo độ sâu. Phụ nữ không được lên tàu nghiên cứu, nên bà làm việc từ số liệu của người khác. Và bà thấy rằng dãy sống núi lớn giữa đại dương không phải một dãy núi đơn thuần: chạy dọc đỉnh của nó là một thung lũng sâu, đúng thứ ta chờ đợi nếu đáy biển đang bị kéo tách ra. Đồng nghiệp của bà, Bruce Heezen, không chịu tin. Ông mất gần một năm mới chấp nhận là bà đúng." },
          { voice: "nz-nam", text: "Around 1960 Harry Hess put the pieces together. Magma rises at the ridge, cools into new crust, and moves away on both sides, like two conveyor belts. And in 1963 came the proof. Two Cambridge scientists, Vine and Matthews, showed that the rocks on either side of the ridge carry a pattern of magnetic stripes, and that the pattern on one side is the mirror image of the other. Within a few years plate tectonics was in every textbook.", vi: "Khoảng năm 1960, Harry Hess ghép các mảnh lại. Magma trào lên ở sống núi, nguội thành lớp vỏ mới, và dịch ra hai phía, như hai băng chuyền. Và năm 1963 thì có bằng chứng. Hai nhà khoa học ở Cambridge, Vine và Matthews, cho thấy đá ở hai bên sống núi mang một mẫu hình các dải từ tính, và mẫu hình bên này là ảnh gương của bên kia. Chỉ vài năm sau, kiến tạo mảng có mặt trong mọi giáo trình." },
          { voice: "nz-nam", text: "We can now measure the movement directly, by satellite. The plates travel a few centimetres a year – about as fast as your fingernails grow. Not tens of metres. But they do move.", vi: "Giờ ta đo được chuyển động ấy trực tiếp bằng vệ tinh. Các mảng đi vài xăng-ti-mét mỗi năm — nhanh cỡ móng tay bạn mọc. Không phải hàng chục mét. Nhưng chúng có chuyển động." },
          { voice: "nz-nam", text: "So what should we take from the story? It's tempting to say the geologists were simply stubborn. I don't think that's quite fair. Wegener didn't lose the argument for want of evidence – he had plenty. He lost because he couldn't say how. A theory that tells you what happened, but not what made it happen, is asking a great deal of its audience. Next week: what happens where two plates meet.", vi: "Vậy ta rút ra gì từ câu chuyện? Dễ nói rằng các nhà địa chất chỉ đơn giản là cứng đầu. Tôi nghĩ nói vậy không hẳn công bằng. Wegener không thua cuộc tranh luận vì thiếu bằng chứng — ông có thừa. Ông thua vì không nói được bằng cách nào. Một học thuyết cho bạn biết điều gì đã xảy ra, nhưng không cho biết cái gì khiến nó xảy ra, là đòi hỏi rất nhiều ở người nghe. Tuần sau: chuyện gì xảy ra ở nơi hai mảng gặp nhau." },
        ],
      },
      {
        t: "quiz", id: "t5d12-nghe-tom-tat", title: "Questions 31–40 — ONE WORD ONLY", kind: "fill",
        items: [
          { q: "31.", answers: ["meteorology"], hint: "“His doctorate was in astronomy, though he never worked as an astronomer. His career was in meteorology.” professional field ↔ career. astronomy là thứ bị bác." },
          { q: "32.", answers: ["reptile"], hint: "“his favourite example was an animal: Mesosaurus, a reptile about a metre long”. fern đứng trước nhưng phiếu ghi “an animal”." },
          { q: "33.", answers: ["glaciers"], hint: "“scratches, the kind that are left only by glaciers”. Số nhiều: nghe /z/ cuối." },
          { q: "34.", answers: ["bridges"], hint: "“walked across on land bridges – long strips of land that had since sunk”." },
          { q: "35.", answers: ["mechanism"], hint: "“It wasn't evidence. What he couldn't supply was a mechanism.” evidence bị phủ định ngay câu trước." },
          { q: "36.", answers: ["speed", "rate"], hint: "“he put the speed of the drift at tens of metres a year”." },
          { q: "37.", answers: ["valley"], hint: "“wasn't a simple mountain chain: running along its crest was a deep valley”. ridge và chain là nhiễu; a deep ___ cần danh từ số ít." },
          { q: "38.", answers: ["stripes"], hint: "“a pattern of magnetic stripes”." },
          { q: "39.", answers: ["fingernails", "nails"], hint: "“about as fast as your fingernails grow”. Số nhiều vì động từ grow." },
          { q: "40.", answers: ["evidence"], hint: "“didn't lose the argument for want of evidence… He lost because he couldn't say how.” for want of ↔ for lack of." },
        ],
      },

      { t: "h", text: "6. Sau khi nghe — bản tóm tắt đã đổi bài giảng thế nào" },
      {
        t: "table", head: ["Câu", "Bài giảng nói", "Tóm tắt viết", "Kiểu bẫy / kiểu đổi"],
        rows: [
          ["31", "His career was in meteorology", "whose professional field was…", "Từ bị bác (astronomy) đứng trước; đổi career → professional field"],
          ["32", "an animal: Mesosaurus, a reptile about a metre long", "a small … , an animal that could not have crossed", "Hai hoá thạch; phiếu chỉ giữ con vật"],
          ["33", "left only by glaciers… places that are hot today", "made by … in regions that are now hot", "Đảo trật tự: bài nói nơi chốn trước, phiếu nói sau"],
          ["34", "walked across on land bridges… had since sunk", "land … had once linked the continents and later sunk", "Đổi động từ: walked across → linked"],
          ["35", "What he couldn't supply was a mechanism", "could offer no convincing … for the movement", "Câu chẻ (Ngày 9 mục 6); evidence bị phủ định ngay trước"],
          ["36", "he put the speed of the drift at…", "His estimate of the … of the drift", "Danh hoá: put… at → estimate"],
          ["37", "running along its crest was a deep valley", "a deep … running along the middle of its central ridge", "Hai danh từ nhiễu (ridge, chain) hợp ngữ pháp"],
          ["38", "carry a pattern of magnetic stripes", "confirmed by a pattern of magnetic …", "Gần nguyên văn — câu “cho điểm” nếu bạn còn theo kịp"],
          ["39", "about as fast as your fingernails grow", "about as fast as … grow", "Con số nhiễu: a few centimetres · tens of metres"],
          ["40", "for want of evidence… couldn't say how", "not for lack of … but for lack of an explanation", "Đáp án đã xuất hiện ở câu 35 như một từ BỊ BÁC — giờ nó là đáp án"],
        ],
      },
      {
        t: "table", head: ["Đúng / 20", "Mức ước tính", "Việc cần làm"],
        rows: [
          ["18–20", "Band 8+ cho Part 3 + 4", "Giữ nhịp này tới Đề 10 (Ngày 16). Nghe lại một lần chỉ để nói theo đoạn Tharp – Hess."],
          ["15–17", "Band 7–7.5", "Xem câu sai thuộc kiểu bẫy nào trong hai bảng. Sai ở 31, 35, 37 ⇒ bạn viết từ đầu tiên đúng loại; ôn mục 1 ⚠️."],
          ["≤ 14", "Dưới band 7", "Mở lời thoại, nghe lại Part 4 và tự viết bản tóm tắt 5 câu bằng lời mình. Ôn Tập 5 Ngày 5 (biển báo bài giảng) và Ngày 9 (câu tín hiệu)."],
        ],
      },
      {
        t: "note", title: "💡 Ba điều rút ra",
        items: [
          "Bài giảng có đoạn **không có câu hỏi** (Holmes; ba trăm năm người ta nhìn bản đồ). Bản tóm tắt bỏ chúng. Đọc phiếu như một câu chuyện giúp bạn biết đó là đoạn được phép nghỉ, không phải đoạn mình bị lạc.",
          "Từ **evidence** xuất hiện ba lần trong bài, hai lần ở dạng bị phủ định. Một từ có thể là nhiễu ở câu này và là đáp án ở câu khác; chỉ nghĩa của câu trên phiếu quyết định.",
          "Câu 40 nằm ở phần **kết luận** của bài giảng (So what should we take from the story?). Mười giây cuối không phải lúc đặt bút xuống.",
        ],
      },

      { t: "h", text: "7. Từ vựng hữu ích từ hai bài nghe" },
      {
        t: "vocab", items: [
          { w: "drag in", pos: "v", ipa: "/dræɡ ˈɪn/", vi: "kéo theo (một yếu tố không mong muốn)", ex: "Using music drags in the question of personal taste.", exVi: "Dùng nhạc sẽ kéo theo vấn đề gu cá nhân.", more: "drag sth **into** a discussion" },
          { w: "even out", pos: "v", ipa: "/ˌiːvn ˈaʊt/", vi: "cân bằng lại, san đều", ex: "Over thirty participants, the practice effect evens out.", exVi: "Với ba mươi người tham gia, hiệu ứng luyện tập sẽ được san đều.", more: "Prices have evened out. · even sth out" },
          { w: "give sth away", pos: "v", ipa: "/ɡɪv əˈweɪ/", vi: "để lộ (bí mật, mục đích)", ex: "The title of the questionnaire gave away the purpose of the study.", exVi: "Tiêu đề bảng hỏi đã làm lộ mục đích nghiên cứu.", more: "give the game away (lộ hết) · nghĩa khác: cho không" },
          { w: "put sth down to", pos: "v", ipa: "/pʊt daʊn tuː/", vi: "cho là do", ex: "She put her low score down to a lack of sleep.", exVi: "Cô ấy cho rằng điểm thấp là do thiếu ngủ.", more: "= attribute sth to · put it down to experience" },
          { w: "do the sums", pos: "phr", ipa: "/duː ðə ˈsʌmz/", vi: "tính toán cho ra con số", ex: "Once we did the sums, the cheaper flat turned out to cost more.", exVi: "Tính ra thì căn hộ rẻ hơn hoá ra lại tốn hơn.", more: "Anh-Anh · The sums don't add up." },
          { w: "seize on", pos: "v", ipa: "/ˈsiːz ɒn/", vi: "chộp lấy (để công kích hoặc tận dụng)", ex: "Critics seized on a single error in the report.", exVi: "Giới phê bình chộp lấy một lỗi duy nhất trong báo cáo.", more: "seize on / upon a mistake, an idea · chính tả: s**ei**ze" },
          { w: "for want of", pos: "prep", ipa: "/fə ˈwɒnt əv/", vi: "vì thiếu", ex: "The project failed for want of funding.", exVi: "Dự án thất bại vì thiếu kinh phí.", more: "= for lack of · for want of a better word (Ngày 11)" },
          { w: "wouldn't have it", pos: "phr", ipa: "/ˈwʊdnt hæv ɪt/", vi: "nhất định không chịu (tin / chấp nhận)", ex: "I offered to pay, but she wouldn't have it.", exVi: "Tôi đề nghị trả tiền nhưng cô ấy nhất định không chịu.", more: "khi nói; trang trọng hơn: refused to accept it" },
        ],
      },
      {
        t: "note", title: "📌 Sau bài này",
        items: [
          "Ghi vào sổ lỗi từng câu sai kèm **kiểu bẫy** (①–⑤ cho Part 3; cột cuối của bảng mục 6 cho Part 4).",
          "Nghe lại Part 4 lần hai KHÔNG nhìn phiếu, và tự nói thành tiếng một bản tóm tắt 60 giây. Đây cũng là bài tập cho Speaking: kể lại một lập luận.",
          "**Ngày 16:** Listening Đề 10 (band 7.5). Hai kỹ năng của hôm nay — đọc phiếu như một câu chuyện, chờ lời chốt — là thứ bạn mang vào đó.",
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI TẬP ═══════════════════════════ */
  {
    id: "t5d12-bai-tap",
    kind: "homework",
    title: "Bài tập Ngày 12 — thuật ngữ bốn ngành · số nhiều gốc Latin · quy trình hai giai đoạn · how it works · nghe tóm tắt",
    goal: "Tự kiểm cả ngày: nhớ nghĩa và chính tả 48 thuật ngữ, viết đúng số ít / số nhiều bất quy tắc, dùng đúng ngôn ngữ của quy trình hai giai đoạn và của đề “how something works”, và điền một bản tóm tắt sau khi nghe một lần.",
    minutes: 50,
    blocks: [
      {
        t: "recap", title: "Cách làm",
        items: [
          "**I–III (22 câu)** — từ vựng Bài 1: sinh học + địa chất, tâm lý + kinh tế, số nhiều.",
          "**IV–V (11 câu)** — Bài 2: ngôn ngữ quy trình hai giai đoạn; đọc một bảng cấu tạo và chọn câu band 8.",
          "**VI (6 câu)** — Bài 3: nghe một đoạn bài giảng, điền bản tóm tắt.",
          "39 câu, khoảng 40 phút. Mục tiêu band 8: **≥ 35/39**. Xong bài này thì nghỉ ít nhất 30 phút rồi mới làm **Kiểm tra chặng**.",
        ],
      },

      { t: "h", text: "I. Sinh học và địa chất — viết từ theo định nghĩa (8 câu) — ôn Bài 1 mục 2 · 3" },
      {
        t: "quiz", id: "t5d12-bt-sinh-dia", title: "I. Điền MỘT từ (chữ cái đầu cho sẵn)", kind: "fill",
        items: [
          { q: "1. to spend the winter in a deep sleep: h___", answers: ["hibernate"] },
          { q: "2. to search an area for food: f___", answers: ["forage"] },
          { q: "3. the young of an animal (same form in the plural): o___", answers: ["offspring"] },
          { q: "4. (of dead plants and animals) to be slowly broken down: d___", answers: ["decompose"] },
          { q: "5. the outer layer of the Earth: c___", answers: ["crust"] },
          { q: "6. a slow-moving mass of ice: g___", answers: ["glacier"] },
          { q: "7. the sudden release of ash and lava from a volcano: e___", answers: ["eruption"] },
          { q: "8. a soft rock that dissolves slowly in rainwater: l___", answers: ["limestone"] },
        ],
      },

      { t: "h", text: "II. Tâm lý học và kinh tế học — chọn phương án đúng (8 câu) — ôn Bài 1 mục 4 · 5" },
      {
        t: "mcq", id: "t5d12-bt-tam-kinh", title: "II. Chọn phương án đúng",
        items: [
          { q: "1. Children praised immediately after tidying up are more likely to do it again. The praise acts as", options: ["inhibition.", "reinforcement.", "retrieval."], correct: 1, why: "reinforcement = củng cố hành vi." },
          { q: "2. A study that follows the same two thousand people from childhood into old age is", options: ["longitudinal.", "cross-sectional.", "a placebo."], correct: 0, why: "longitudinal = theo dõi cùng một nhóm qua thời gian dài; cross-sectional = đo một lần, nhiều nhóm." },
          { q: "3. Ice-cream sales and sunburn rise together, but neither causes the other. This is", options: ["conditioning.", "a placebo.", "a correlation."], correct: 2, why: "Tương quan không phải nhân quả." },
          { q: "4. A child who cries when a parent leaves the room is showing", options: ["attachment.", "habituation.", "elasticity."], correct: 0, why: "attachment = sự gắn bó với người chăm sóc." },
          { q: "5. Farmers produced more grain than the village could eat. The extra was", options: ["a deficit.", "a surplus.", "collateral."], correct: 1, why: "surplus = phần dôi." },
          { q: "6. Shares in the firm are popular because it pays a generous ___ every year.", options: ["dividend", "externality", "depreciation"], correct: 0, why: "dividend = cổ tức." },
          { q: "7. Cash is the asset with the greatest", options: ["collateral.", "elasticity.", "liquidity."], correct: 2, why: "liquidity = tính thanh khoản; tiền mặt dùng được ngay." },
          { q: "8. Nobody pays for the damage done by traffic fumes. Economists call this situation", options: ["a market failure.", "an opportunity cost.", "diminishing returns."], correct: 0, why: "Thị trường không tính chi phí gây cho người ngoài ⇒ market failure." },
        ],
      },

      { t: "h", text: "III. Số nhiều và chính tả (6 câu) — ôn Bài 1 mục 6" },
      {
        t: "quiz", id: "t5d12-bt-so-nhieu", title: "III. Viết dạng đúng của từ trong ngoặc", kind: "fill",
        items: [
          { q: "1. The (LARVA) ___ hatch after ten days.", answers: ["larvae"] },
          { q: "2. Each (STRATUM) ___ contains different fossils.", answers: ["stratum"] },
          { q: "3. Two competing (HYPOTHESIS) ___ were put forward.", answers: ["hypotheses"] },
          { q: "4. These (FUNGUS) ___ grow only on dead wood.", answers: ["fungi"] },
          { q: "5. This (PHENOMENON) ___ has been observed only twice.", answers: ["phenomenon"] },
          { q: "6. Three (SPECIES) ___ of bat live in the cave.", answers: ["species"] },
        ],
      },

      { t: "h", text: "IV. Quy trình hai giai đoạn — điền MỘT từ (6 câu) — ôn Bài 2 mục 2 · 3" },
      { t: "p", text: "Sáu câu tả việc làm **giấy thủ công từ vỏ cây** (quy trình tự đặt): giai đoạn 1 nấu vỏ thành bột, giai đoạn 2 xeo và phơi giấy." },
      {
        t: "quiz", id: "t5d12-bt-quy-trinh", title: "IV. Điền MỘT từ", kind: "fill",
        items: [
          { q: "1. Handmade paper is produced in two stages: the preparation of the pulp, ___ by the forming and drying of the sheets.", answers: ["followed"] },
          { q: "2. The bark is boiled for three hours, ___ which it softens and breaks apart.", answers: ["during"] },
          { q: "3. ___ rinsed, the fibres are beaten into a smooth pulp. (một từ nối)", answers: ["Once", "once", "When", "when"] },
          { q: "4. The second stage begins ___ the mixing of this pulp with water in a large tank.", answers: ["with"] },
          { q: "5. A screen is dipped into the tank and lifted out, ___ a thin layer of fibres on its surface. (động từ leave, đúng dạng)", answers: ["leaving"] },
          { q: "6. The sheets are pressed so ___ most of the water is squeezed out.", answers: ["that"] },
        ],
      },

      { t: "h", text: "V. How something works — một chiếc bình giữ nhiệt (5 câu) — ôn Bài 2 mục 4" },
      {
        t: "table", head: ["Bộ phận", "Ghi chú trên hình"],
        rows: [
          ["Outer case", "plastic or steel · protects the bottle"],
          ["Inner bottle", "glass · double wall"],
          ["Gap between the two walls", "vacuum — no air"],
          ["Surfaces of the walls", "silver coating · reflects heat"],
          ["Stopper", "plastic · tight fit · stops heat escaping through the top"],
        ],
        caption: "Sơ đồ tự dựng cho bài luyện: cấu tạo một bình giữ nhiệt (vacuum flask).",
      },
      {
        t: "mcq", id: "t5d12-bt-binh", title: "V. Chọn câu tốt nhất",
        items: [
          { q: "1. Overview nào tốt nhất?", options: ["Overall, the flask has five parts.", "Overall, the flask keeps a drink hot or cold by using a vacuum, a reflective coating and a tight stopper to limit the movement of heat.", "Overall, first the drink is poured into the bottle."], correct: 1, why: "Công dụng + nguyên lý. A chỉ đếm; C là thao tác sử dụng, không có trên hình." },
          { q: "2. The inner bottle ___ a double wall of glass.", options: ["consists of", "is consisted of", "consists in"], correct: 0, why: "consist of — không bao giờ bị động." },
          { q: "3. The walls are coated with silver, ___ heat back towards the liquid.", options: ["which reflects", "which reflect", "reflects"], correct: 0, why: "which thay cho silver (số ít) ⇒ reflects. Cũng có thể viết: …, reflecting heat back." },
          { q: "4. Because the gap contains no air, heat ___ pass easily from one wall to the other.", options: ["is not", "cannot", "cannot be"], correct: 1, why: "pass tự xảy ra ⇒ chủ động: heat cannot pass." },
          { q: "5. Câu nào đưa vào thông tin KHÔNG có trên hình?", options: ["A tightly fitting stopper stops heat escaping through the top.", "The inner bottle is protected by an outer case of plastic or steel.", "A good flask keeps tea hot for up to twelve hours."], correct: 2, why: "“twelve hours” không có trên sơ đồ." },
        ],
      },

      { t: "h", text: "VI. Nghe — một đoạn bài giảng, điền bản tóm tắt (6 câu) — ôn Bài 3 mục 1 · 2" },
      { t: "p", text: "Đọc bản tóm tắt 30 giây, nghe **một lần**. **ONE WORD ONLY** cho mỗi chỗ trống." },
      { t: "p", text: "People who move in beside a railway soon sleep through the noise. In this process, known as habituation, the brain reduces its response to a signal that brings no **1** ………… . It is not the same as **2** ………… : if the sound is altered even slightly, for example in its timing or its **3** ………… , the full response returns at once. The lesson for designers is that an **4** ………… heard every day will eventually be ignored, as staff in **5** ………… have discovered. The usual solution is to make such signals **6** ………… rather than louder." },
      {
        t: "listen", id: "t5d12-bt-nghe", title: "A lecture extract — why you stop hearing the trains",
        dan: { so: "Day 12, Homework", boiCanh: "the end of a psychology lecture about how the brain responds to repeated sounds.", cau: [1, 6] },
        note: "Khoảng 1 phút 10 giây, ~170 từ/phút. Giảng viên: giọng Mỹ (nữ).",
        lines: [
          { voice: "us-nu", text: "Let me finish today with a puzzle. If you move into a flat beside a railway line, the first night is dreadful. Within a fortnight, most people sleep straight through. The trains haven't got any quieter. What has changed is you, and psychologists call the change habituation: the brain learns that a repeated signal carries no news, and it turns the response down.", vi: "Tôi kết thúc hôm nay bằng một câu đố. Nếu bạn dọn tới một căn hộ cạnh đường tàu, đêm đầu thật kinh khủng. Trong vòng hai tuần, đa số ngủ một mạch. Tàu không hề êm hơn. Thứ thay đổi là bạn, và các nhà tâm lý gọi thay đổi đó là sự quen dần: não học được rằng một tín hiệu lặp lại không mang tin gì mới, và nó vặn nhỏ phản ứng xuống." },
          { voice: "us-nu", text: "It's tempting to think that your ears have simply got tired, but that's fatigue, which is something else, and there's a neat way of telling the two apart. Change the signal slightly – make the train a little later, or a little higher in pitch – and the full response comes back at once. Tired ears couldn't do that. A brain that had been ignoring the sound on purpose can.", vi: "Dễ nghĩ rằng tai bạn chỉ đơn giản là mệt, nhưng đó là sự mỏi, một chuyện khác, và có một cách gọn để phân biệt hai thứ. Đổi tín hiệu đi một chút — cho tàu tới muộn hơn tí, hoặc cao độ cao hơn tí — và phản ứng đầy đủ quay lại ngay. Tai mỏi thì không làm được thế. Một bộ não vốn cố ý lờ âm thanh đi thì làm được." },
          { voice: "us-nu", text: "The practical point for anyone designing a warning system is rather awkward. An alarm that sounds every day will, sooner or later, stop being heard. Hospitals have found this to their cost: nurses surrounded by beeping monitors begin to miss the beeps that matter. The usual remedy is not a louder alarm but a rarer one.", vi: "Điểm thực tiễn cho ai thiết kế hệ thống cảnh báo thì khá khó xử. Một chuông báo động kêu mỗi ngày sớm muộn gì cũng thôi được nghe thấy. Các bệnh viện đã trả giá để biết điều này: y tá bị vây quanh bởi các máy kêu bíp bắt đầu bỏ sót những tiếng bíp quan trọng. Cách chữa thường dùng không phải chuông to hơn mà là chuông hiếm hơn." },
        ],
      },
      {
        t: "quiz", id: "t5d12-bt-nghe-dien", title: "VI. Questions 1–6 — ONE WORD ONLY", kind: "fill",
        items: [
          { q: "1.", answers: ["news"], hint: "“a repeated signal carries no news”" },
          { q: "2.", answers: ["fatigue"], hint: "“that's fatigue, which is something else”" },
          { q: "3.", answers: ["pitch"], hint: "“a little later, or a little higher in pitch”" },
          { q: "4.", answers: ["alarm"], hint: "“An alarm that sounds every day will… stop being heard” — an + nguyên âm" },
          { q: "5.", answers: ["hospitals"], hint: "“Hospitals have found this to their cost”" },
          { q: "6.", answers: ["rarer"], hint: "“not a louder alarm but a rarer one”" },
        ],
      },
      {
        t: "note", title: "📌 Sai nhiều ở đâu thì ôn ở đó",
        items: [
          "**I–II sai ≥ 4:** Bài 1 mục 2–5; che từ, viết lại bằng tay cả nhóm sai.",
          "**III sai ≥ 2:** Bài 1 mục 6 — học theo đuôi, đọc lại khối phát âm.",
          "**IV–V sai ≥ 3:** Bài 2 mục 2–4; chép lại hai bài mẫu band 8, gạch dưới mọi từ nối.",
          "**VI sai ≥ 2:** Bài 3 mục 1–2; nghe lại băng với lời thoại, khoanh từ bị bác đứng trước mỗi đáp án.",
        ],
      },
    ],
  },

  /* ═══════════════════════════ KIỂM TRA CHẶNG (NGÀY 7–12) ═══════════════════════════ */
  {
    id: "t5d12-kiem-tra",
    kind: "review",
    title: "Kiểm tra chặng (Ngày 7–12)",
    goal: "Đo lại cả chặng 2 của Tập 5 theo 8 phần — ngữ pháp, từ vựng, dịch, nghe, đọc, viết, nói, phát âm — với ngưỡng đạt ≥ 70 % từng phần, và biết chính xác phải ôn lại Ngày nào trước khi sang chặng 3 (Ngày 13–18).",
    minutes: 180,
    blocks: [
      {
        t: "recap", title: "Cách làm bài kiểm tra này",
        items: [
          "**8 phần**, khoảng 3 giờ. Làm một mạch được thì tốt; không thì chia hai buổi: Phần 1–5 (95 phút) và Phần 6–8 (85 phút).",
          "Không tra từ, không mở lại bài. Nghe **một lần**. Đọc **đúng giờ** (16 phút).",
          "Ngưỡng đạt: ==≥ 70 % từng phần== — không lấy phần này bù phần kia. Viết / Nói: AI ước tính ≥ band 7.5.",
          "Mọi câu ở đây là câu MỚI; không câu nào lặp lại bài tập của Ngày 7–12. Nếu thấy quen, đó là vì kỹ năng giống, không phải vì câu giống.",
          "Trước khi làm: mở **Sổ lỗi**, đọc lướt 2 phút những lỗi ghi từ Đề 9 (Ngày 8–10). Sau khi làm: điền bảng cuối bài.",
        ],
      },

      { t: "h", text: "Phần 1 — Ngữ pháp (12 + 6 câu · đạt ≥ 13/18 · trượt thì ôn Ngày 7, 9, 11)" },
      {
        t: "mcq", id: "t5d12-kt-ngu-phap-chon", title: "1a. Chọn đáp án đúng (12 câu)",
        items: [
          { q: "1. Once ___ , the beans are spread out in the sun to dry.", options: ["washing", "washed", "they washed"], correct: 1, why: "Rút gọn bị động: Once (they have been) washed. — Ngày 7 mục 5." },
          { q: "2. As the mixture cools, it gradually ___ .", options: ["is thickened", "thickens", "is thickening by itself"], correct: 1, why: "Bước tự xảy ra ⇒ chủ động. — Ngày 7 mục 2." },
          { q: "3. The clay is shaped by hand ___ being fired in a kiln.", options: ["before", "prior", "then"], correct: 0, why: "before + being + V3. “prior” cần to: prior to being fired. — Ngày 7 mục 3." },
          { q: "4. The liquid is passed through a cloth, ___ a clear syrup.", options: ["leaves", "left", "leaving"], correct: 2, why: "V-ing chỉ kết quả ở cuối câu. — Ngày 7 mục 5." },
          { q: "5. The scheme not only reduced costs but also ___ .", options: ["improving staff morale", "improved staff morale", "it improved staff morale"], correct: 1, why: "not only + V-ed… but also + V-ed: hai nửa cùng dạng. — Ngày 9 mục 3." },
          { q: "6. Câu nào KHÔNG có chủ ngữ treo?", options: ["Walking into the lab, the smell was overpowering.", "Walking into the lab, I noticed an overpowering smell.", "Having walked into the lab, an overpowering smell hit."], correct: 1, why: "Người “walking” phải là chủ ngữ của mệnh đề chính (I). — Ngày 9 mục 6." },
          { q: "7. Salaries in the capital are considerably higher than ___ .", options: ["the provinces", "that in provinces", "those in the provinces"], correct: 2, why: "So lương với lương: those (= salaries) in the provinces. — Ngày 9 mục 4." },
          { q: "8. Câu nào nói đúng ý “ngoài trang đầu ra, quản lý không ký trang nào khác”?", options: ["Only the manager signed the first page.", "The manager signed only the first page.", "The only manager signed the first page."], correct: 1, why: "only đứng ngay trước phần nó giới hạn (the first page). Câu A nghĩa là không ai khác ký. — Ngày 9 mục 7." },
          { q: "9. I didn't keep a diary as a teenager, and now I rather wish I ___ .", options: ["did", "had", "have"], correct: 1, why: "Việc quá khứ: wish I had (kept one) — lược sau trợ động từ hoàn thành. — Ngày 11 mục 3." },
          { q: "10. She's someone ___ .", options: ["I've always looked up to", "to who I've always looked up", "which I've always looked up to"], correct: 0, why: "Mệnh đề quan hệ kiểu nói: bỏ đại từ, giới từ ở cuối. — Ngày 11 mục 5." },
          { q: "11. You'd think a five-star hotel ___ decent Wi-Fi, but apparently not.", options: ["will have", "has had", "would have"], correct: 2, why: "You'd think + S + would + V, but… — Ngày 11 mục 6." },
          { q: "12. The meeting went on for two hours ___ — I didn't time it.", options: ["or such", "or so", "and so"], correct: 1, why: "số + or so = khoảng chừng. — Ngày 11 mục 4." },
        ],
      },
      {
        t: "quiz", id: "t5d12-kt-ngu-phap-dien", title: "1b. Điền MỘT từ (6 câu)", kind: "fill",
        items: [
          { q: "1. The beans are left ___ ferment for five days under banana leaves.", answers: ["to"] },
          { q: "2. The process culminates ___ the bottling and labelling of the oil.", answers: ["in"] },
          { q: "3. The course teaches students to analyse data, to write reports and ___ present their findings.", answers: ["to"] },
          { q: "4. The population of Tokyo is larger than ___ of any other city in Japan.", answers: ["that"] },
          { q: "5. Somebody must have told her about the vacancy, though I've no idea ___ .", answers: ["who"] },
          { q: "6. It's a mixture of work and play — or ___ , work that feels like play.", answers: ["rather"] },
        ],
      },

      { t: "h", text: "Phần 2 — Từ vựng (10 + 6 câu · đạt ≥ 12/16 · trượt thì ôn Ngày 8, 10, 12)" },
      {
        t: "mcq", id: "t5d12-kt-tu-vung-chon", title: "2a. Chọn từ đúng (10 câu)",
        items: [
          { q: "1. A high rate of ___ suggests that prison is failing to change offenders' behaviour.", options: ["retribution", "recidivism", "parole"], correct: 1, why: "recidivism = tái phạm. — Ngày 8." },
          { q: "2. The café closed because its ___ — rent, electricity, insurance — were higher than its takings.", options: ["overheads", "dividends", "margins"], correct: 0, why: "overheads = chi phí cố định để duy trì kinh doanh. — Ngày 8." },
          { q: "3. People in their forties who support both their children and their elderly parents are called the ___ generation.", options: ["silver", "sandwich", "replacement"], correct: 1, why: "the sandwich generation. — Ngày 8." },
          { q: "4. Riders for food-delivery apps are a familiar part of the ___ economy.", options: ["gig", "barter", "niche"], correct: 0, why: "the gig economy = kinh tế việc làm tự do theo cuốc. — Ngày 8." },
          { q: "5. The argument ___ two different things: being busy and being productive.", options: ["compounds", "mitigates", "conflates"], correct: 2, why: "conflate A with B / two things = đánh đồng. — Ngày 10." },
          { q: "6. The shortage of housing ___ largely from decades of under-building.", options: ["stems", "turns", "holds"], correct: 0, why: "stem from = bắt nguồn từ. — Ngày 10." },
          { q: "7. Higher fuel prices had a ___ effect on the cost of food.", options: ["knock-off", "knock-out", "knock-on"], correct: 2, why: "a knock-on effect = tác động dây chuyền. — Ngày 10." },
          { q: "8. Many desert reptiles are ___ , hunting only after dark.", options: ["dormant", "nocturnal", "longitudinal"], correct: 1, why: "nocturnal = hoạt động về đêm. — Ngày 12." },
          { q: "9. The village's wells draw on an ___ that took thousands of years to fill.", options: ["aquifer", "eruption", "externality"], correct: 0, why: "aquifer = tầng ngậm nước. — Ngày 12." },
          { q: "10. Neither the doctors nor the patients knew who had been given the real drug and who the ___ .", options: ["collateral", "surplus", "placebo"], correct: 2, why: "placebo = giả dược. — Ngày 12." },
        ],
      },
      {
        t: "quiz", id: "t5d12-kt-tu-vung-dien", title: "2b. Điền MỘT từ, hoặc viết dạng đúng của từ in HOA (6 câu)", kind: "fill",
        items: [
          { q: "1. Prisoners released early on p___ must report to an officer every week.", answers: ["parole"] },
          { q: "2. Large supermarket chains benefit from e___ of scale.", answers: ["economies"] },
          { q: "3. This view o___ the cost to rural communities. (bỏ sót)", answers: ["overlooks"] },
          { q: "4. The whole dispute t___ on what is meant by “fair”.", answers: ["turns"] },
          { q: "5. A l___ study followed five hundred children from birth to the age of thirty.", answers: ["longitudinal"] },
          { q: "6. Several different (HYPOTHESIS) ___ were tested.", answers: ["hypotheses"] },
        ],
      },

      { t: "h", text: "Phần 3 — Dịch Việt → Anh (6 câu · đạt ≥ 5/6)" },
      {
        t: "quiz", id: "t5d12-kt-dich", title: "3. Dịch sang tiếng Anh", kind: "translate",
        grammar: "Once + V3 · not only… but also · stem from · I'd have thought · V-ing + makes + N + V · do little to + V",
        items: [
          { q: "1. Sau khi được lọc, nước được bơm vào một bể chứa.", answers: ["Once filtered, the water is pumped into a storage tank.", "After being filtered, the water is pumped into a storage tank.", "Once it has been filtered, the water is pumped into a storage tank.", "Having been filtered, the water is pumped into a storage tank."], hint: "Once filtered · is pumped into · a storage tank" },
          { q: "2. Chương trình không chỉ giảm chi phí mà còn cải thiện chất lượng.", answers: ["The programme not only reduces costs but also improves quality.", "The program not only reduces costs but also improves quality.", "The scheme not only reduces costs but also improves quality.", "The programme not only cuts costs but also improves quality."], hint: "not only reduces · but also improves" },
          { q: "3. Vấn đề bắt nguồn từ việc thiếu đầu tư.", answers: ["The problem stems from a lack of investment.", "The problem stems from the lack of investment.", "The problem stems from underinvestment."], hint: "stems from · a lack of investment" },
          { q: "4. Tôi cứ nghĩ là vé sẽ rẻ hơn chứ.", answers: ["I'd have thought the tickets would be cheaper.", "I would have thought the tickets would be cheaper.", "I'd have thought tickets would be cheaper.", "I'd have thought the ticket would be cheaper."], hint: "I'd have thought · would be cheaper" },
          { q: "5. Đẩy cần xuống làm piston đi lên.", answers: ["Pushing the handle down makes the piston rise.", "Pushing the handle down causes the piston to rise.", "Pushing down the handle makes the piston rise.", "Pushing the handle down makes the piston go up."], hint: "Pushing the handle down · makes the piston rise" },
          { q: "6. Án tù ngắn hầu như không giúp giảm tái phạm.", answers: ["Short prison sentences do little to reduce reoffending.", "Short custodial sentences do little to reduce recidivism.", "Short prison sentences do little to reduce recidivism.", "Short custodial sentences do little to reduce reoffending."], hint: "Short custodial sentences · do little to reduce · recidivism" },
        ],
      },

      { t: "h", text: "Phần 4 — Nghe (5 + 5 câu · đạt ≥ 7/10 · trượt thì ôn Ngày 8, 9, 12)" },
      { t: "p", text: "Hai đoạn, mỗi đoạn nghe **một lần**. Đọc câu hỏi 20 giây trước mỗi đoạn." },
      {
        t: "listen", id: "t5d12-kt-nghe-hoi-truong", title: "Booking a hall for a table-tennis tournament",
        dan: { so: "Test (Days 7–12), Recording 1", boiCanh: "a man telephoning a community hall to make a booking.", cau: [1, 5] },
        note: "Khoảng 1 phút, ~170 từ/phút. Aoife: giọng Ireland (nữ). Marcus: giọng Mỹ (nam).",
        lines: [
          { who: "Aoife", voice: "ie-nu", text: "St Brendan's Hall, Aoife speaking.", vi: "Hội trường St Brendan, Aoife xin nghe." },
          { who: "Marcus", voice: "us-nam", text: "Hi, I'd like to book a room for a table-tennis tournament. It's for the Riverside club.", vi: "Chào chị, tôi muốn đặt một phòng cho giải bóng bàn. Của câu lạc bộ Riverside." },
          { who: "Aoife", voice: "ie-nu", text: "No problem. Which date were you thinking of?", vi: "Được ạ. Anh định ngày nào?" },
          { who: "Marcus", voice: "us-nam", text: "Saturday the fourteenth of March – no, sorry, that's the weekend of the regional final. Make it the twenty-first.", vi: "Thứ Bảy ngày mười bốn tháng Ba — à không, xin lỗi, đó là cuối tuần có trận chung kết khu vực. Cho tôi ngày hai mươi mốt." },
          { who: "Aoife", voice: "ie-nu", text: "The twenty-first is free. And how many players?", vi: "Ngày hai mươi mốt còn trống. Bao nhiêu người chơi ạ?" },
          { who: "Marcus", voice: "us-nam", text: "We had forty last year, and I've had sixty enquiries already, but we've only got twelve tables, so forty-eight is our limit.", vi: "Năm ngoái chúng tôi có bốn mươi người, và tôi đã nhận sáu mươi lượt hỏi, nhưng chỉ có mười hai bàn, nên giới hạn là bốn mươi tám." },
          { who: "Aoife", voice: "ie-nu", text: "Forty-eight. The main hall would be far too big, then. I'd suggest the Garden Room – no, wait, that's being painted in March. The Library Room takes fifty.", vi: "Bốn mươi tám. Vậy hội trường chính thì quá rộng. Tôi gợi ý phòng Garden — à khoan, phòng đó tháng Ba đang sơn lại. Phòng Library chứa được năm mươi." },
          { who: "Marcus", voice: "us-nam", text: "That'll do. What's the charge?", vi: "Thế là được. Phí bao nhiêu?" },
          { who: "Aoife", voice: "ie-nu", text: "It's normally a hundred and eighty euro for the day, but registered clubs get it for a hundred and thirty-five.", vi: "Thường là một trăm tám mươi euro một ngày, nhưng câu lạc bộ có đăng ký thì được giá một trăm ba mươi lăm." },
          { who: "Marcus", voice: "us-nam", text: "We're registered, so that's good news. And how do we get in?", vi: "Chúng tôi có đăng ký, vậy tốt quá. Còn vào bằng cách nào?" },
          { who: "Aoife", voice: "ie-nu", text: "The caretaker used to hand the key over on the morning, but these days you collect it from the pharmacy next door, the evening before.", vi: "Trước đây bác bảo vệ giao chìa khoá vào buổi sáng hôm đó, nhưng giờ anh nhận ở hiệu thuốc bên cạnh, vào tối hôm trước." },
        ],
      },
      {
        t: "quiz", id: "t5d12-kt-nghe-hoi-truong-cau", title: "Questions 1–5 — ONE WORD OR A NUMBER", kind: "fill",
        items: [
          { q: "1. Date of tournament: ___ March", answers: ["21", "21st", "twenty-first"], hint: "Ngày 14 bị sửa: “no, sorry… Make it the twenty-first.”" },
          { q: "2. Maximum number of players: ___", answers: ["48", "forty-eight"], hint: "40 (năm ngoái) · 60 (lượt hỏi) · 12 (bàn) đều là nhiễu." },
          { q: "3. Room booked: the ___ Room", answers: ["Library", "library"], hint: "Garden Room bị rút lại vì đang sơn." },
          { q: "4. Cost for the day: €___", answers: ["135"], hint: "180 là giá thường; câu lạc bộ có đăng ký trả 135." },
          { q: "5. Key to be collected from the ___ next door", answers: ["pharmacy"], hint: "Caretaker là cách cũ (“used to”)." },
        ],
      },
      { t: "p", text: "**Questions 6–10.** Complete the summary. Write **ONE WORD ONLY** for each answer. — The cleaner wrasse feeds on **6** ………… taken from the skin of other fish, which wait in turn at its station. It would in fact prefer to eat the fish's **7** ………… , which has greater food value. Fish that live permanently nearby respond to being bitten: they **8** ………… the cleaner. Those from further away simply go to a different **9** ………… . Cleaners cheat less often when other clients are **10** ………… ." },
      {
        t: "listen", id: "t5d12-kt-nghe-ca", title: "A lecture extract — the fish that cleans other fish",
        dan: { so: "Test (Days 7–12), Recording 2", boiCanh: "part of a biology lecture about cooperation between species on coral reefs.", cau: [6, 10] },
        note: "Khoảng 1 phút 10 giây, ~172 từ/phút. Giảng viên: giọng Úc (nam).",
        lines: [
          { voice: "au-nam", text: "Today's example of symbiosis comes from coral reefs. There's a small fish there, the cleaner wrasse, that makes its living by removing parasites from the skin of larger fish. It works from a fixed spot on the reef – biologists call it a cleaning station – and its customers, which we refer to as clients, actually wait their turn. A single cleaner may deal with two thousand of them in a day.", vi: "Ví dụ hôm nay về cộng sinh đến từ rạn san hô. Ở đó có một loài cá nhỏ, cá bàng chài dọn vệ sinh, kiếm sống bằng cách gỡ ký sinh trùng khỏi da các loài cá lớn hơn. Nó làm việc ở một chỗ cố định trên rạn — các nhà sinh học gọi là trạm vệ sinh — và khách của nó, mà ta gọi là thân chủ, thật sự xếp hàng chờ lượt. Một con cá dọn có thể tiếp hai nghìn thân chủ mỗi ngày." },
          { voice: "au-nam", text: "On the face of it everyone gains. The client loses its parasites; the cleaner gets a meal. But there's a complication. Parasites aren't what the cleaner likes best. Given the choice, it would rather eat the mucus that coats the client's skin, which is more nutritious – and that amounts to taking a bite out of the customer.", vi: "Thoạt nhìn thì ai cũng được lợi. Thân chủ hết ký sinh trùng; cá dọn có bữa ăn. Nhưng có một chỗ rắc rối. Ký sinh trùng không phải món cá dọn thích nhất. Nếu được chọn, nó thích ăn lớp chất nhầy phủ trên da thân chủ hơn, vì bổ hơn — và thế chẳng khác nào cắn khách một miếng." },
          { voice: "au-nam", text: "So why don't cleaners cheat all the time? Because clients have ways of answering back. A resident fish, one that can't go elsewhere, will chase a cleaner that bites it. A visitor with a large territory simply swims off to a rival station. And here's the detail I find most remarkable: cleaners behave noticeably better when other clients are watching. Reputation, it turns out, isn't a purely human concern.", vi: "Vậy sao cá dọn không gian lận suốt? Vì thân chủ có cách đáp trả. Một con cá thường trú, loại không đi đâu khác được, sẽ rượt con cá dọn nào cắn nó. Một vị khách có lãnh thổ rộng thì chỉ việc bơi sang trạm đối thủ. Và đây là chi tiết tôi thấy đáng chú ý nhất: cá dọn cư xử tốt hơn hẳn khi có thân chủ khác đang nhìn. Hoá ra danh tiếng không phải mối bận tâm của riêng loài người." },
        ],
      },
      {
        t: "quiz", id: "t5d12-kt-nghe-ca-cau", title: "Questions 6–10 — ONE WORD ONLY", kind: "fill",
        items: [
          { q: "6.", answers: ["parasites"], hint: "“removing parasites from the skin of larger fish”" },
          { q: "7.", answers: ["mucus"], hint: "“it would rather eat the mucus… which is more nutritious”" },
          { q: "8.", answers: ["chase"], hint: "“A resident fish… will chase a cleaner that bites it.” — sau they cần động từ nguyên mẫu" },
          { q: "9.", answers: ["station"], hint: "“swims off to a rival station”" },
          { q: "10.", answers: ["watching"], hint: "“when other clients are watching”" },
        ],
      },

      { t: "h", text: "Phần 5 — Đọc (4 + 5 + 3 câu · đạt ≥ 9/12 · 16 phút · trượt thì ôn Ngày 7, 9, 11)" },
      {
        t: "passage", title: "The Lawyer Who Could Type",
        intro: "Bài tự soạn cho khoá (~440 từ). Ricardo, năm 1817 và ví dụ rượu vang – vải là có thật; lời văn tự viết.",
        paras: [
          { label: "A", text: "It seems obvious that a country should make for itself whatever it can make more cheaply than its neighbours, and buy the rest. That idea, known as absolute advantage, is sound as far as it goes. Its weakness is what it implies about a country that is worse than its neighbours at everything: such a country, it would seem, has nothing to sell and nothing to gain from trade." },
          { label: "B", text: "In 1817 the English economist David Ricardo showed that this conclusion is false. His illustration involved two countries and two goods. Suppose that Portugal can produce both wine and cloth with less labour than England. It does not follow that Portugal should produce both. What matters is not whether Portugal is better at making cloth, but how much wine it must forgo in order to make it. If Portuguese workers are far better at wine and only slightly better at cloth, every hour they spend weaving is an hour taken from the activity in which their lead is greatest. Portugal does best by concentrating on wine and importing cloth from England – even though English cloth takes more labour to make." },
          { label: "C", text: "The principle is easier to accept on a small scale. Consider a lawyer who happens to type twice as fast as her assistant. Nobody would advise her to do her own typing, since each hour at the keyboard costs her an hour of legal work, which pays many times more. The assistant, for his part, is worse at both tasks, yet he is in no danger of being idle: his disadvantage is smallest in typing, and that is where he is employed. Each party specialises not in what it does best in absolute terms but in what it gives up least to do." },
          { label: "D", text: "Ricardo's result has been called one of the few propositions in the social sciences that is both true and not trivial, and its implication – that even the least efficient producer benefits from exchange – remains the standard argument for free trade. It is, however, an argument about nations as wholes. It says that the total to be shared grows; it is silent on how that total is divided. The English weaver in Ricardo's story prospers, but the English wine-grower, undersold by imports, does not, and the theory offers him only the assurance that his loss is smaller than his compatriots' gain. Whether those who gain in fact compensate those who lose is a matter for politics, and a model of two countries and two goods was never designed to settle it." },
        ],
      },
      { t: "p", text: "**Questions 1–4** — Complete the sentences. Choose **ONE WORD ONLY** from the passage for each answer." },
      {
        t: "quiz", id: "t5d12-kt-doc-hoan-thanh", title: "Questions 1–4 — Sentence completion (ONE WORD ONLY)", kind: "fill",
        items: [
          { q: "1. The view that a country should produce only what it can make more cheaply than others is called ___ advantage.", answers: ["absolute"], hint: "A: “That idea, known as absolute advantage”" },
          { q: "2. The two products in Ricardo's example were cloth and ___ .", answers: ["wine"], hint: "B: “both wine and cloth”" },
          { q: "3. Although the assistant is slower at every task, there is no risk that he will be left ___ .", answers: ["idle"], hint: "C: “he is in no danger of being idle”. in no danger of → no risk that" },
          { q: "4. Ricardo's theory does not tell us how the gains from trade are ___ .", answers: ["divided"], hint: "D: “it is silent on how that total is divided”. is silent on → does not tell us" },
        ],
      },
      { t: "p", text: "**Questions 5–9** — Do the following statements agree with the claims of the writer? Choose **YES**, **NO** or **NOT GIVEN**." },
      {
        t: "mcq", id: "t5d12-kt-doc-ynng", title: "Questions 5–9 — YES / NO / NOT GIVEN",
        items: [
          { q: "5. The principle of absolute advantage is entirely mistaken.", options: ["YES", "NO", "NOT GIVEN"], correct: 1, why: "A: “is sound as far as it goes” — đúng trong phạm vi của nó. entirely mistaken là nói quá ⇒ NO." },
          { q: "6. In Ricardo's illustration, England was the less efficient producer of both goods.", options: ["YES", "NO", "NOT GIVEN"], correct: 0, why: "B: “Portugal can produce both wine and cloth with less labour than England”." },
          { q: "7. Other economists of the time were quick to accept Ricardo's argument.", options: ["YES", "NO", "NOT GIVEN"], correct: 2, why: "Bài không nói gì về phản ứng của người đương thời." },
          { q: "8. The example of the lawyer makes the principle easier to grasp.", options: ["YES", "NO", "NOT GIVEN"], correct: 0, why: "C: “The principle is easier to accept on a small scale.”" },
          { q: "9. The theory shows that every individual in a country gains from free trade.", options: ["YES", "NO", "NOT GIVEN"], correct: 1, why: "D: “the English wine-grower… does not [prosper]”; lý thuyết nói về quốc gia như một tổng thể." },
        ],
      },
      {
        t: "mcq", id: "t5d12-kt-doc-mcq", title: "Questions 10–12 — Choose the correct letter",
        items: [
          { q: "10. According to paragraph B, Portugal should import cloth because", options: ["English cloth is of better quality.", "Portuguese weavers are less skilled than English ones.", "cloth is cheaper to transport than wine.", "making cloth itself would mean sacrificing too much wine."], correct: 3, why: "“how much wine it must forgo in order to make it… every hour they spend weaving is an hour taken from the activity in which their lead is greatest”. B trái bài: Bồ Đào Nha giỏi hơn ở cả hai." },
          { q: "11. The lawyer should not do her own typing because", options: ["her assistant makes fewer mistakes.", "she finds the work dull.", "her time earns far more when spent on legal work.", "the assistant would otherwise lose his job."], correct: 2, why: "“each hour at the keyboard costs her an hour of legal work, which pays many times more”." },
          { q: "12. What point does the writer make in the final paragraph?", options: ["The theory accounts for the overall gain but not for who receives it.", "Ricardo's theory has since been disproved.", "Politicians have generally misunderstood Ricardo.", "The theory works only when two goods are involved."], correct: 0, why: "“It says that the total to be shared grows; it is silent on how that total is divided.”" },
        ],
      },

      { t: "h", text: "Phần 6 — Viết (6 câu + Task 1 + Task 2 · trượt thì ôn Ngày 8, 10, 12)" },
      {
        t: "mcq", id: "t5d12-kt-viet-chon", title: "6a. Kiến thức viết band 8 (6 câu · đạt ≥ 5/6)",
        items: [
          { q: "1. Overview của một quy trình HAI giai đoạn ở band 8 cần có gì ngoài số bước?", options: ["Tên của mọi bước", "Một phép so sánh giữa hai giai đoạn", "Ý kiến của người viết về quy trình"], correct: 1, why: "Ví dụ: giai đoạn 1 xong trong vài giờ, giai đoạn 2 kéo dài nhiều tháng. — Ngày 12 mục 2." },
          { q: "2. Với đề “how something works”, thân bài 1 nên tả", options: ["bước vận hành đầu tiên.", "ưu và nhược điểm của thiết bị.", "cấu tạo: bộ phận nào ở đâu, để làm gì."], correct: 2, why: "Cấu tạo → vận hành. — Ngày 12 mục 4." },
          { q: "3. The heap ___ to about 70°C without any outside heat.", options: ["rises", "is risen", "is raised by itself"], correct: 0, why: "Bước tự xảy ra ⇒ chủ động. rise (tự lên) ≠ raise. — Ngày 7 mục 2 · Ngày 12." },
          { q: "4. Câu nào là “lập trường tinh” cho một bài Discussion?", options: ["In conclusion, both views have advantages and disadvantages, and I partly agree with each.", "If the question is what motivates a pupil today, competition is the answer; if it is what makes a useful colleague later, cooperation is.", "I strongly believe that the first view is completely wrong."], correct: 1, why: "Khuôn “If the question is…, A is the answer; if it is…, B is.” chỉ rõ mỗi quan điểm đúng ở đâu. — Ngày 10 mục B4." },
          { q: "5. The old warehouse has been converted ___ flats.", options: ["to be", "into", "for"], correct: 1, why: "be converted into. — Ngày 8 mục 3." },
          { q: "6. Câu giải pháp nào có CÂN cái giá phải trả (band 8)?", options: ["The government should build more bus lanes, and this will solve the problem.", "A congestion charge would raise costs for commuters, but the revenue could pay for the bus services they need.", "There are many solutions to this problem."], correct: 1, why: "Such + N would…, but… — nêu cái giá rồi cân. — Ngày 8 mục 4." },
        ],
      },
      { t: "p", text: "**6b. Task 1 (20 phút, ≥ 150 từ).** Bảng và sơ đồ dưới đây cho biết cấu tạo của một chiếc radio quay tay và cách nó hoạt động. Viết theo khung của Ngày 12 mục 4." },
      {
        t: "table", head: ["Bộ phận", "Vị trí", "Ghi chú trên hình"],
        rows: [
          ["Handle", "bên hông vỏ máy, gập ra được", "turned by hand"],
          ["Spring", "bên trong, nối với handle", "steel · stores energy"],
          ["Gears", "giữa spring và generator", "set of toothed wheels · increase speed"],
          ["Generator", "nối với gears", "produces electricity when it spins"],
          ["Radio circuit + speaker", "mặt trước", "powered by the generator"],
        ],
        caption: "Hình 1 (tả bằng bảng): cấu tạo của radio quay tay. Sơ đồ tự dựng cho bài kiểm tra.",
      },
      {
        t: "figure",
        fig: {
          kind: "process",
          title: "How a wind-up radio works",
          note: "Sơ đồ tự dựng cho bài kiểm tra; các con số là số minh hoạ.",
          steps: [
            { label: "Handle turned", note: "about 60 turns · 30 seconds" },
            { label: "Spring wound tight", note: "energy stored" },
            { label: "Spring unwinds slowly", note: "takes about 30 minutes" },
            { label: "Gears turn", note: "speed increased about 100 times" },
            { label: "Generator spins", note: "electricity produced" },
            { label: "Radio plays", note: "sound from speaker" },
            { label: "Spring fully unwound", note: "radio stops · handle must be turned again" },
          ],
        },
      },
      {
        t: "essay", id: "t5d12-kt-viet-task1", task: "Task 1", minWords: 150,
        prompt: "The diagrams show the structure of a wind-up radio and how it works. Structure: a fold-out handle on the side of the case, turned by hand; a steel spring inside, connected to the handle, which stores energy; a set of gears (toothed wheels) between the spring and the generator, which increase speed; a generator, which produces electricity when it spins; the radio circuit and speaker at the front, powered by the generator. Operation: handle turned about 60 times (30 seconds) → spring wound tight, energy stored → spring unwinds slowly over about 30 minutes → gears turn, increasing the speed about 100 times → generator spins, producing electricity → radio plays, sound comes from the speaker → spring fully unwound, radio stops, handle must be turned again. Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.",
        tips: [
          "Overview: công dụng + nguyên lý (không cần pin hay điện lưới; năng lượng của bàn tay được trữ trong lò xo rồi nhả ra chậm) + một so sánh đáng nêu: 30 giây quay ↔ khoảng 30 phút nghe.",
          "Thân 1 = cấu tạo theo đường đi của năng lượng: handle → spring → gears → generator → circuit.",
          "Thân 2 = vận hành theo nhân quả; bước tự xảy ra để chủ động (the spring unwinds · the generator spins · the radio stops).",
        ],
      },
      {
        t: "essay", id: "t5d12-kt-viet-task2", task: "Task 2", minWords: 250,
        prompt: "Some people think that the news media should report only the facts, without comment. Others believe that journalists have a duty to explain and interpret events for their audience. Discuss both these views and give your own opinion. Give reasons for your answer and include any relevant examples from your own knowledge or experience. Write at least 250 words.",
        tips: [
          "Ba động tác của Ngày 10: thuật mỗi quan điểm ở dạng mạnh nhất → tìm bản lề (hai bên khác nhau ở đâu: sự thật có “tự nói” được không?) → lập trường tinh.",
          "Dùng 2–3 khung của Ngày 10 (The disagreement turns on… · It does not follow that… · at least where… is concerned).",
          "Soát song song và chủ ngữ treo (Ngày 9) trước khi nộp.",
        ],
      },

      { t: "h", text: "Phần 7 — Nói (4 câu Part 1 + Part 2 + 4 câu Part 3 · AI ≥ band 7.5 ước tính · trượt thì ôn Ngày 7, 10, 11)" },
      {
        t: "speak", id: "t5d12-kt-noi-p1", part: "1",
        questions: [
          "Do you usually carry keys with you when you go out?",
          "Have you ever lost a key or been locked out?",
          "Do you think people will still use metal keys in twenty years' time?",
          "Would you give a copy of your house key to a neighbour?",
        ],
      },
      {
        t: "speak", id: "t5d12-kt-noi-p2", part: "2",
        questions: [
          "Describe a small shop or stall that you used to visit regularly. You should say: where it was; what it sold; who ran it; and explain what you remember most clearly about it.",
          "Is it still there today?",
        ],
      },
      {
        t: "speak", id: "t5d12-kt-noi-p3", part: "3",
        questions: [
          "Why do some small local shops survive while others close down?",
          "Do you think the way people shop tells us anything about their character?",
          "Is it better for a neighbourhood to have many small businesses or a few large ones?",
          "How might the places where people shop change over the next twenty years?",
        ],
      },
      {
        t: "note", title: "Tự chấm phần Nói — nghe lại bản ghi và trả lời có / không",
        items: [
          "**Part 1:** câu mở của tôi có dùng dạng lược hoặc paraphrase câu hỏi không, hay lặp nguyên chữ của giám khảo? (Ngày 11)",
          "**Part 2:** có ít nhất bốn chi tiết nghe – nhìn – ngửi – chạm, và một chuyện nhỏ, không? Có chậm lại ở chi tiết không? (Ngày 7)",
          "**Part 3:** mỗi câu trả lời có một cơ chế (vì sao) chứ không chỉ một nhận định? Có 2–3 cấu trúc của Ngày 11 (not that · I'd have thought · from what I've seen)? (Ngày 10 · 11)",
          "**Từ vựng:** cả lượt nói có 2–3 idiom / từ ít gặp đúng dạng, và có câu trả lời KHÔNG có idiom nào không? (Ngày 11)",
        ],
      },

      { t: "h", text: "Phần 8 — Phát âm (8 câu · đạt ≥ 6/8 · rồi đọc lại các khối có máy chấm của Ngày 7–12)" },
      {
        t: "mcq", id: "t5d12-kt-phat-am", title: "8. Chọn đáp án đúng (8 câu)",
        items: [
          { q: "1. Khi kể một chi tiết cảm quan trong Part 2 (“…smelled of rubber glue and hot dust”), nên", options: ["nói nhanh hơn để kịp giờ.", "chậm lại và ngừng rất ngắn trước từ đắt.", "lên giọng ở cuối câu."], correct: 1, why: "Giọng kể: chậm ở chi tiết, ngừng trước từ đắt. — Ngày 7." },
          { q: "2. Trong “We should have been told”, từ “have” ở tốc độ tự nhiên đọc là", options: ["/hæv/", "/heɪv/", "/əv/"], correct: 2, why: "Âm yếu trong chuỗi trợ động từ: should’ve /ʃʊdəv/. — Ngày 8." },
          { q: "3. “It's not the fourteenth, it's the twenty-first.” Khi sửa thông tin, đỉnh giọng chính rơi vào", options: ["not", "first", "it's"], correct: 1, why: "Trọng âm tương phản: đẩy phần ĐÚNG và khác (first). — Ngày 9." },
          { q: "4. Trong “I do think it matters”, từ “do” được", options: ["đọc yếu /də/.", "lược hẳn.", "nhấn mạnh /duː/."], correct: 2, why: "do nhấn mạnh luôn mang trọng âm. — Ngày 10." },
          { q: "5. “I'd take that with a pinch of salt.” Đỉnh giọng của cụm rơi vào", options: ["pinch", "salt", "take"], correct: 1, why: "Từ nội dung cuối của cụm cố định. — Ngày 11." },
          { q: "6. “I couldn't get my head round it.” Từ nào KHÔNG mang trọng âm?", options: ["head", "couldn't", "it"], correct: 2, why: "Đại từ cuối câu đọc nhẹ; đỉnh ở head. — Ngày 11." },
          { q: "7. Đuôi của “hypotheses” đọc là", options: ["/sɪs/", "/siːz/", "/sɪz/"], correct: 1, why: "-is → -es đọc /iːz/. — Ngày 12." },
          { q: "8. Trọng âm chính của “metabolism” rơi vào âm tiết", options: ["thứ nhất: ME-tabolism", "thứ hai: me-TA-bolism", "thứ ba: meta-BO-lism"], correct: 1, why: "/məˈtæbəlɪzəm/. — Ngày 12." },
        ],
      },

      { t: "h", text: "Xong bài kiểm tra — bước tiếp theo" },
      {
        t: "table", head: ["Phần", "Ngưỡng đạt", "Trượt thì ôn", "Điểm của bạn"],
        rows: [
          ["1. Ngữ pháp", "≥ 13/18", "Ngày 7 (câu 1–4, 1b.1–2) · Ngày 9 (câu 5–8, 1b.3–4) · Ngày 11 (câu 9–12, 1b.5–6)", "…… /18"],
          ["2. Từ vựng", "≥ 12/16", "Ngày 8 (câu 1–4, 2b.1–2) · Ngày 10 (câu 5–7, 2b.3–4) · Ngày 12 (câu 8–10, 2b.5–6)", "…… /16"],
          ["3. Dịch", "≥ 5/6", "Câu 1 → Ngày 7 · 2 → Ngày 9 · 3 → Ngày 10 · 4 → Ngày 11 · 5 → Ngày 12 · 6 → Ngày 8", "…… /6"],
          ["4. Nghe", "≥ 7/10", "Câu 1–5 (sửa lời, con số) → Ngày 8 · 9 · Câu 6–10 (Summary) → Ngày 12", "…… /10"],
          ["5. Đọc", "≥ 9/12", "Câu 1–4 → Ngày 7 · Câu 5–9 → Ngày 9 · Câu 10–12 (thể loại kinh tế) → Ngày 11", "…… /12"],
          ["6. Viết", "6a ≥ 5/6 · AI ≥ 7.5", "Task 1 → Ngày 12 (và Ngày 7) · Task 2 → Ngày 10 · câu 5–6 → Ngày 8", "…… /6 · T1 …… · T2 ……"],
          ["7. Nói", "AI ≥ 7.5", "Part 1 → Ngày 11 · Part 2 → Ngày 7 · Part 3 → Ngày 10 · 11", "P1 …… · P2 …… · P3 ……"],
          ["8. Phát âm", "≥ 6/8", "Câu 1 → Ngày 7 · 2 → Ngày 8 · 3 → Ngày 9 · 4 → Ngày 10 · 5–6 → Ngày 11 · 7–8 → Ngày 12", "…… /8"],
        ],
      },
      {
        t: "note", title: "📌 Sang chặng 3 (Ngày 13–18)",
        items: [
          "**Đạt cả 8 phần:** sang Ngày 13 (cleft / inversion / concession trong Task 2; Reading đủ 3 passage 55 phút).",
          "**Trượt 1–2 phần:** ôn đúng Ngày ghi trong bảng (chỉ mục liên quan), làm lại riêng phần đó sau 48 giờ. Vẫn được học tiếp Ngày 13 song song.",
          "**Trượt từ 3 phần:** dừng 2 ngày để ôn. Chặng 3 có **Đề 10** (Ngày 16, band 7.5); vào đề khi nền chặng 2 còn hổng thì kết quả không phản ánh đúng sức.",
          "Ghi mọi câu sai của bài này vào **Sổ lỗi** theo ba cột: sai gì → vì sao → câu đúng. So với trang sổ lỗi Đề 9: lỗi nào **lặp lại** là lỗi dai dẳng, mang sang Ngày 17 (chuỗi lỗi 7 → 8).",
        ],
      },
    ],
  },
];
