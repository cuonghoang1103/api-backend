/**
 * IELTS Tập 3 — Ngày 28 (band 5.0 → 6.0; tự soạn 18/11/2026 — mọi câu ví dụ, sơ đồ, bản đồ, bài mẫu, kịch bản nghe VIẾT MỚI)
 *   Bài 1 (vocab)     Language, culture & identity (22 từ) + Books, reading & literature (22 từ) + 12 cụm ăn điểm
 *                     + 16 cặp từ dễ nhầm (affect / effect, rise / raise, economic / economical…)        [VC26 VC31 VD5]
 *                     — nối Tập 2 Ngày 9 (cụm về sách, nhập môn) · 🔊 cặp từ dễ nhầm khác nhau ở MỘT âm
 *   Bài 2 (writing)   Task 1 process + map band 6: mục đích của bước, từ ngoài hình mà không bịa bước, by / with;
 *                     map BA MỐC (quá khứ – hiện tại – kế hoạch); map CHỌN ĐỊA ĐIỂM S1 / S2 trọn bài     [W13 W14]
 *                     — nối Tập 2 Ngày 20 (process) · Ngày 22 (map, hộp nhập S1/S2) · Tập 3 Ngày 13 (bị động) · Ngày 17
 *   Bài 3 (listening) Part 2 + Part 4 giọng trộn (AU · UK): Short answer + Plan labelling + Note completion [L04 L06 L14]
 *                     — nối Tập 2 Ngày 19 · Tập 3 Ngày 4 · 12 (map) · Ngày 13 · 24 (Part 4) · Ngày 20 (sentence completion)
 *   Bài tập Ngày 28   38 câu có đáp án
 * Mọi id bắt đầu `t3d28-`.
 */
import type { Lesson } from '../data';

export const NGAY_28: Lesson[] = [
  /* ═══════════════════════════ BÀI 1 — TỪ VỰNG ═══════════════════════════ */
  {
    id: "t3d28-tu-vung",
    kind: "vocab",
    title: "Từ vựng: Language, culture & identity + Books, reading & literature + 16 cặp từ dễ nhầm",
    goal: "Dùng đúng 22 từ về ngôn ngữ – văn hoá – bản sắc và 22 từ về sách – việc đọc cùng 12 cụm ăn điểm để viết Task 2 (ngôn ngữ biến mất, toàn cầu hoá văn hoá, sách giấy và e-book) và nói Part 1–3 về Reading, Languages; đồng thời không còn viết nhầm 16 cặp từ như affect / effect, rise / raise, economic / economical — đẩy LR band 6 (dám dùng từ ít gặp, lỗi chọn từ không cản hiểu).",
    minutes: 80,
    blocks: [
      {
        t: "recap",
        title: "Bài này học gì · đẩy tiêu chí nào",
        items: [
          "**Chủ đề 1 — Language, culture & identity** (22 từ): mother tongue, bilingual, lingua franca, die out, heritage, assimilate, a sense of belonging…",
          "**Chủ đề 2 — Books, reading & literature** (22 từ): genre, plot, page-turner, literacy, read up on, read between the lines… — nối 8–10 cụm đã nhập ở Tập 2 Ngày 9.",
          "**12 cụm ăn điểm** cho Task 2 và Part 3 của hai chủ đề.",
          "**16 cặp từ dễ nhầm** (VD5): mỗi cặp một phép thử 5 giây. Đây chính là **lượt 6** của bảng tự soát hôm qua.",
          "🔊 Phát âm: các cặp dễ nhầm chỉ khác nhau **một âm** — advice /s/ – advise /z/, loose /s/ – lose /z/, quite – quiet.",
          "Bài nghe Part 4 hôm nay nói về ngôn ngữ sắp biến mất, Part 2 về thư viện — học từ ở đây trước sẽ nghe dễ hơn hẳn.",
        ],
      },

      /* ── 1 ── */
      { t: "h", text: "1. Language, culture & identity — 11 từ về ngôn ngữ" },
      {
        t: "p",
        text: "Đề Task 2 hay gặp: “Một số ngôn ngữ đang biến mất — điều đó có đáng lo không?”, “Mọi người nên học một ngôn ngữ chung?”, “Người nhập cư nên giữ văn hoá của mình hay hoà nhập?”. Part 3 hay hỏi: học ngoại ngữ, tiếng địa phương, tiếng Anh toàn cầu. Nhóm đầu là từ để nói về **ngôn ngữ**.",
      },
      {
        t: "vocab",
        items: [
          { w: "mother tongue", pos: "n", ipa: "/ˌmʌðə ˈtʌŋ/", vi: "tiếng mẹ đẻ", ex: "Children learn best when they are first taught in their mother tongue.", exVi: "Trẻ học tốt nhất khi ban đầu được dạy bằng tiếng mẹ đẻ.", more: "= first language / native language · a **native speaker of** Vietnamese · ⚠️ không nói ~~mother language~~" },
          { w: "bilingual", pos: "adj, n", ipa: "/ˌbaɪˈlɪŋɡwəl/", vi: "song ngữ; người nói hai thứ tiếng", ex: "Bilingual children often switch between languages without effort.", exVi: "Trẻ song ngữ thường chuyển qua lại giữa hai ngôn ngữ mà không tốn sức.", more: "**bilingual** education / school / dictionary · be bilingual **in** English and French · monolingual (một thứ tiếng)" },
          { w: "multilingual", pos: "adj", ipa: "/ˌmʌltiˈlɪŋɡwəl/", vi: "đa ngôn ngữ", ex: "Singapore is a multilingual society with four official languages.", exVi: "Singapore là một xã hội đa ngôn ngữ với bốn ngôn ngữ chính thức.", more: "a **multilingual** society / workforce · official language (ngôn ngữ chính thức)" },
          { w: "fluent", pos: "adj", ipa: "/ˈfluːənt/", vi: "trôi chảy, thành thạo", ex: "After five years in Berlin, she is fluent in German.", exVi: "Sau năm năm ở Berlin, cô ấy thành thạo tiếng Đức.", more: "**fluent in** + ngôn ngữ · speak **fluent** English / speak English **fluently** · fluency (n) · ⚠️ ~~fluent with~~" },
          { w: "dialect", pos: "n", ipa: "/ˈdaɪəlekt/", vi: "phương ngữ, tiếng địa phương", ex: "My grandparents still speak the local dialect at home.", exVi: "Ông bà tôi vẫn nói tiếng địa phương ở nhà.", more: "a local / regional **dialect** · dialect khác cả từ vựng lẫn ngữ pháp; accent chỉ khác cách phát âm" },
          { w: "accent", pos: "n", ipa: "/ˈæksent/", vi: "giọng (vùng miền, nước ngoài)", ex: "He speaks English with a strong Vietnamese accent.", exVi: "Anh ấy nói tiếng Anh với giọng Việt rất đặc.", more: "a strong / slight / regional **accent** · **with** an accent · IELTS không trừ điểm vì accent, chỉ trừ khi khó hiểu" },
          { w: "lingua franca", pos: "n", ipa: "/ˌlɪŋɡwə ˈfræŋkə/", vi: "ngôn ngữ chung (giữa những người khác tiếng mẹ đẻ)", ex: "English has become the lingua franca of science and business.", exVi: "Tiếng Anh đã trở thành ngôn ngữ chung của khoa học và kinh doanh.", more: "a global / common **lingua franca** · gần nghĩa: a common language, an international language" },
          { w: "minority language", pos: "n", ipa: "/maɪˈnɒrəti ˌlæŋɡwɪdʒ/", vi: "ngôn ngữ thiểu số", ex: "Many minority languages are spoken by only a few thousand people.", exVi: "Nhiều ngôn ngữ thiểu số chỉ còn vài nghìn người nói.", more: "an ethnic **minority** (dân tộc thiểu số) · ≠ the dominant / majority language" },
          { w: "endangered", pos: "adj", ipa: "/ɪnˈdeɪndʒəd/", vi: "có nguy cơ biến mất", ex: "Linguists are recording endangered languages before the last speakers die.", exVi: "Các nhà ngôn ngữ học đang ghi lại những ngôn ngữ sắp biến mất trước khi người nói cuối cùng qua đời.", more: "**endangered** languages / species (Ngày 22) · endanger (v) · be under threat" },
          { w: "die out", pos: "phr v", ipa: "/ˌdaɪ ˈaʊt/", vi: "biến mất hẳn, tuyệt chủng", ex: "If children stop using a language, it can die out within two generations.", exVi: "Nếu trẻ em ngừng dùng một ngôn ngữ, nó có thể biến mất trong vòng hai thế hệ.", more: "= become **extinct** / disappear · ⚠️ nội động từ, không bị động: ~~was died out~~ · revive a language (hồi sinh)" },
          { w: "language barrier", pos: "n", ipa: "/ˈlæŋɡwɪdʒ ˌbæriə/", vi: "rào cản ngôn ngữ", ex: "The language barrier makes it hard for new migrants to find work.", exVi: "Rào cản ngôn ngữ khiến người mới nhập cư khó tìm việc.", more: "**overcome / break down** the language barrier · a barrier **to** communication" },
        ],
      },
      {
        t: "quiz",
        id: "t3d28-ngon-ngu-dien",
        title: "Luyện nhóm 1 — điền từ trong hộp (8 câu): accent · bilingual · dialect · die out · endangered · fluent · lingua franca · mother tongue",
        kind: "fill",
        items: [
          { q: "1. Although she has lived in London for years, Mai still dreams in her ___.", answers: ["mother tongue"] },
          { q: "2. Without young speakers, the language will ___ before the end of the century.", answers: ["die out"] },
          { q: "3. In much of East Africa, Swahili serves as a ___ between different ethnic groups.", answers: ["lingua franca"] },
          { q: "4. You can tell from his ___ that he grew up in Scotland.", answers: ["accent"] },
          { q: "5. Children who attend a ___ school study half of their subjects in a second language.", answers: ["bilingual"] },
          { q: "6. The local ___ has many words that do not exist in the standard language.", answers: ["dialect"] },
          { q: "7. He became ___ in Japanese after working in Osaka for six years.", answers: ["fluent"] },
          { q: "8. UNESCO lists more than 2,000 languages as ___.", answers: ["endangered"] },
        ],
      },

      /* ── 2 ── */
      { t: "h", text: "2. Language, culture & identity — 11 từ về văn hoá và bản sắc" },
      {
        t: "vocab",
        items: [
          { w: "heritage", pos: "n", ipa: "/ˈherɪtɪdʒ/", vi: "di sản", ex: "Traditional songs are an important part of our cultural heritage.", exVi: "Dân ca là một phần quan trọng trong di sản văn hoá của chúng ta.", more: "cultural / national / linguistic **heritage** · a World **Heritage** Site · ⚠️ thường không đếm được: ~~heritages~~ (nối Ngày 12)" },
          { w: "identity", pos: "n", ipa: "/aɪˈdentəti/", vi: "bản sắc, danh tính", ex: "For many people, language is at the heart of their cultural identity.", exVi: "Với nhiều người, ngôn ngữ là cốt lõi của bản sắc văn hoá.", more: "cultural / national **identity** · a **sense of identity** · **lose / preserve** one's identity · identify with (thấy mình thuộc về)" },
          { w: "custom", pos: "n", ipa: "/ˈkʌstəm/", vi: "phong tục, tập quán", ex: "Visitors should respect local customs, such as removing their shoes indoors.", exVi: "Du khách nên tôn trọng phong tục địa phương, ví dụ cởi giày khi vào nhà.", more: "local / ancient **customs** · **customs and traditions** · ⚠️ customs (số nhiều) còn là hải quan; customer = khách hàng" },
          { w: "cultural diversity", pos: "n", ipa: "/ˌkʌltʃərəl daɪˈvɜːsəti/", vi: "sự đa dạng văn hoá", ex: "Large cities benefit from the cultural diversity that migrants bring.", exVi: "Các thành phố lớn được lợi từ sự đa dạng văn hoá mà người nhập cư mang tới.", more: "**promote / celebrate** cultural diversity · diverse (adj) · a multicultural society" },
          { w: "assimilate", pos: "v", ipa: "/əˈsɪməleɪt/", vi: "đồng hoá, hoà tan (vào văn hoá khác)", ex: "Second-generation migrants often assimilate quickly and lose their parents' language.", exVi: "Thế hệ nhập cư thứ hai thường hoà tan nhanh và mất tiếng của cha mẹ.", more: "**assimilate into** a society · assimilation (n) · sắc thái: assimilate = bỏ cái cũ; integrate = giữ cái cũ và tham gia cái mới" },
          { w: "integrate", pos: "v", ipa: "/ˈɪntɪɡreɪt/", vi: "hoà nhập", ex: "Language classes help newcomers to integrate into the local community.", exVi: "Lớp học tiếng giúp người mới đến hoà nhập vào cộng đồng địa phương.", more: "**integrate into** · integration (n) · well-integrated (adj)" },
          { w: "preserve", pos: "v", ipa: "/prɪˈzɜːv/", vi: "gìn giữ, bảo tồn", ex: "Governments should fund schools that preserve minority languages.", exVi: "Chính phủ nên tài trợ cho các trường giúp bảo tồn ngôn ngữ thiểu số.", more: "**preserve** a language / tradition / building · preservation (n) · gần nghĩa: protect, maintain, keep alive" },
          { w: "pass down", pos: "phr v", ipa: "/ˌpɑːs ˈdaʊn/", vi: "truyền lại (cho đời sau)", ex: "These stories have been passed down from generation to generation.", exVi: "Những câu chuyện này được truyền từ đời này sang đời khác.", more: "pass sth down **to** sb · **from generation to generation** · = hand down" },
          { w: "sense of belonging", pos: "n", ipa: "/ˌsens əv bɪˈlɒŋɪŋ/", vi: "cảm giác thuộc về (một nơi, một cộng đồng)", ex: "Speaking the local dialect gives people a strong sense of belonging.", exVi: "Nói tiếng địa phương cho người ta cảm giác gắn bó mạnh mẽ với cộng đồng.", more: "**a sense of** belonging / identity / community · belong **to** a group" },
          { w: "indigenous", pos: "adj", ipa: "/ɪnˈdɪdʒənəs/", vi: "bản địa", ex: "Australia has lost more than half of its indigenous languages.", exVi: "Úc đã mất hơn một nửa số ngôn ngữ bản địa.", more: "**indigenous** people / languages / culture · gần nghĩa: native · indigenous **to** a region" },
          { w: "stereotype", pos: "n, v", ipa: "/ˈsteriətaɪp/", vi: "định kiến rập khuôn; rập khuôn", ex: "Films often repeat stereotypes about other cultures.", exVi: "Phim ảnh thường lặp lại định kiến rập khuôn về các nền văn hoá khác.", more: "a cultural / gender **stereotype** · **challenge / reinforce** a stereotype · stereotypical (adj)" },
        ],
      },
      {
        t: "sodo",
        kind: "mindmap",
        title: "Language, culture & identity — 3 nhánh để nói và viết",
        center: "Language & identity",
        branches: [
          { label: "Ngôn ngữ của một người", items: ["mother tongue", "bilingual / multilingual", "fluent in", "accent · dialect"] },
          { label: "Ngôn ngữ của thế giới", items: ["lingua franca", "minority language", "endangered → die out", "language barrier"] },
          { label: "Văn hoá & bản sắc", items: ["heritage · customs", "preserve · pass down", "assimilate ≠ integrate", "a sense of belonging"] },
        ],
      },
      {
        t: "mcq",
        id: "t3d28-van-hoa-chon",
        title: "Luyện nhóm 2 — chọn từ đúng (8 câu)",
        items: [
          { q: "1. Festivals help communities to ___ traditions that might otherwise be forgotten.", options: ["assimilate", "preserve", "integrate", "stereotype"], correct: 1, why: "preserve traditions = gìn giữ truyền thống." },
          { q: "2. Recipes in my family are ___ from mother to daughter.", options: ["passed out", "passed away", "passed down", "passed by"], correct: 2, why: "pass down = truyền lại. pass away = qua đời; pass out = ngất." },
          { q: "3. The idea that all teenagers are lazy is just a ___.", options: ["stereotype", "custom", "heritage", "dialect"], correct: 0, why: "Một nhận định rập khuôn về cả một nhóm người = stereotype." },
          { q: "4. Migrants who learn the local language find it easier to ___ into society.", options: ["preserve", "belong", "identify", "integrate"], correct: 3, why: "integrate into society = hoà nhập vào xã hội." },
          { q: "5. The Maori are the ___ people of New Zealand.", options: ["endangered", "indigenous", "fluent", "bilingual"], correct: 1, why: "indigenous people = người bản địa." },
          { q: "6. Shaking hands is a common ___ in many Western countries.", options: ["custom", "customs", "customer", "costume"], correct: 0, why: "custom = phong tục (đếm được, số ít). customs = hải quan / các phong tục; costume = trang phục." },
          { q: "7. Singing in a choir gave her a real sense of ___.", options: ["heritage", "identify", "belonging", "diversity"], correct: 2, why: "a sense of belonging = cảm giác thuộc về." },
          { q: "8. Old buildings are part of a city's architectural ___.", options: ["identity card", "barrier", "accent", "heritage"], correct: 3, why: "architectural heritage = di sản kiến trúc." },
        ],
      },

      /* ── 3 ── */
      { t: "h", text: "3. Books, reading & literature — 11 từ về sách" },
      {
        t: "p",
        text: "Tập 2 Ngày 9 bạn đã nhập 9 cụm (genre, fiction / non-fiction, bookworm, page-turner, paperback / e-book, read up on, read between the lines, can’t put it down, avid reader). Hôm nay ôn lại chúng trong nhóm đầy đủ và học trọn chủ đề: **loại sách**, **thành phần một cuốn truyện**, **thói quen đọc**. Dùng ở Part 1 (Reading), Part 2 (Describe a book you enjoyed) và Task 2 (trẻ em đọc ít đi; sách giấy có biến mất?).",
      },
      {
        t: "vocab",
        items: [
          { w: "fiction", pos: "n", ipa: "/ˈfɪkʃn/", vi: "truyện hư cấu", ex: "I mostly read fiction, especially crime novels.", exVi: "Tôi chủ yếu đọc truyện hư cấu, nhất là tiểu thuyết trinh thám.", more: "science / historical / crime **fiction** · fictional (adj): a fictional character · ⚠️ không đếm được" },
          { w: "non-fiction", pos: "n", ipa: "/ˌnɒn ˈfɪkʃn/", vi: "sách phi hư cấu (sách về sự thật)", ex: "Non-fiction, such as history and popular science, sells well among adults.", exVi: "Sách phi hư cấu như lịch sử và khoa học thường thức bán chạy ở người lớn.", more: "gồm biography, self-help, history, travel writing · a work of **non-fiction**" },
          { w: "novel", pos: "n", ipa: "/ˈnɒvl/", vi: "tiểu thuyết", ex: "Her first novel was translated into thirty languages.", exVi: "Cuốn tiểu thuyết đầu tay của bà được dịch sang ba mươi thứ tiếng.", more: "a historical / romantic / graphic **novel** · novelist (n) · ⚠️ novel (adj) = mới lạ: a novel idea" },
          { w: "genre", pos: "n", ipa: "/ˈʒɒnrə/", vi: "thể loại", ex: "Fantasy is by far the most popular genre among teenagers.", exVi: "Giả tưởng là thể loại được ưa chuộng nhất ở tuổi thiếu niên, bỏ xa các thể loại khác.", more: "a literary / film / music **genre** · âm đầu là /ʒ/ (Ngày 13)" },
          { w: "plot", pos: "n", ipa: "/plɒt/", vi: "cốt truyện", ex: "The plot is simple, but the characters are unforgettable.", exVi: "Cốt truyện đơn giản nhưng các nhân vật thì khó quên.", more: "a gripping / complicated **plot** · a **plot twist** (cú bẻ lái) · the plot **revolves around**…" },
          { w: "character", pos: "n", ipa: "/ˈkærəktə/", vi: "nhân vật; tính cách", ex: "The main character is a detective who has lost his memory.", exVi: "Nhân vật chính là một thám tử bị mất trí nhớ.", more: "the main / central **character** · a well-developed character · ⚠️ chữ viết tiếng Trung cũng là Chinese characters" },
          { w: "author", pos: "n", ipa: "/ˈɔːθə/", vi: "tác giả", ex: "My favourite author publishes a new book every two years.", exVi: "Tác giả tôi thích nhất cứ hai năm ra một cuốn sách mới.", more: "a best-selling **author** · the **author of** · writer rộng hơn (cả báo, kịch bản)" },
          { w: "biography", pos: "n", ipa: "/baɪˈɒɡrəfi/", vi: "tiểu sử (do người khác viết)", ex: "I have just finished a biography of Marie Curie.", exVi: "Tôi vừa đọc xong một cuốn tiểu sử về Marie Curie.", more: "a **biography of** sb · autobiography (tự truyện) · memoir (hồi ký)" },
          { w: "bestseller", pos: "n", ipa: "/ˌbestˈselə/", vi: "sách bán chạy", ex: "The book became an international bestseller within months.", exVi: "Cuốn sách trở thành sách bán chạy quốc tế chỉ trong vài tháng.", more: "a best-selling (adj) novel · top the **bestseller list**" },
          { w: "classic", pos: "n, adj", ipa: "/ˈklæsɪk/", vi: "tác phẩm kinh điển; kinh điển", ex: "Schools still teach the classics, although many pupils find them hard.", exVi: "Trường học vẫn dạy các tác phẩm kinh điển dù nhiều học sinh thấy khó.", more: "a modern **classic** · ⚠️ classic (kinh điển, tiêu biểu) ≠ classical (cổ điển: classical music) — xem mục 6" },
          { w: "publish", pos: "v", ipa: "/ˈpʌblɪʃ/", vi: "xuất bản", ex: "The novel was first published in 1960.", exVi: "Cuốn tiểu thuyết được xuất bản lần đầu năm 1960.", more: "be **published** in + năm · publisher (nhà xuất bản) · publication (n) · self-publish" },
        ],
      },

      /* ── 4 ── */
      { t: "h", text: "4. Books, reading & literature — 11 từ về thói quen đọc" },
      {
        t: "vocab",
        items: [
          { w: "page-turner", pos: "n", ipa: "/ˈpeɪdʒ ˌtɜːnə/", vi: "cuốn sách cuốn hút (đọc không dừng được)", ex: "It's a real page-turner — I finished it in two days.", exVi: "Đó đúng là cuốn sách không dứt ra được — tôi đọc xong trong hai ngày.", more: "văn nói, hợp Part 1–2 · **I couldn't put it down** (Tập 2 Ngày 9) · gripping (adj)" },
          { w: "paperback", pos: "n", ipa: "/ˈpeɪpəbæk/", vi: "sách bìa mềm", ex: "I prefer paperbacks because they are light enough to carry around.", exVi: "Tôi thích sách bìa mềm vì đủ nhẹ để mang theo.", more: "≠ hardback (bìa cứng) · **in paperback**: The novel came out in paperback last year." },
          { w: "e-book", pos: "n", ipa: "/ˈiː bʊk/", vi: "sách điện tử", ex: "E-books are cheaper, but many readers still like the feel of paper.", exVi: "Sách điện tử rẻ hơn nhưng nhiều người đọc vẫn thích cảm giác cầm giấy.", more: "an **e-reader** (máy đọc sách) · printed / physical books ≠ digital books · download an e-book" },
          { w: "audiobook", pos: "n", ipa: "/ˈɔːdiəʊbʊk/", vi: "sách nói", ex: "I listen to audiobooks on the bus to make use of the journey.", exVi: "Tôi nghe sách nói trên xe buýt để tận dụng thời gian đi đường.", more: "**listen to** an audiobook · a narrator (người đọc)" },
          { w: "literature", pos: "n", ipa: "/ˈlɪtrətʃə/", vi: "văn học; tài liệu nghiên cứu", ex: "Studying literature teaches students to understand other points of view.", exVi: "Học văn dạy học sinh hiểu những góc nhìn khác.", more: "English / classical / children's **literature** · literary (adj) · học thuật: the literature on a topic · ⚠️ không đếm được" },
          { w: "literacy", pos: "n", ipa: "/ˈlɪtərəsi/", vi: "khả năng đọc viết", ex: "Adult literacy rates have risen sharply over the past fifty years.", exVi: "Tỉ lệ người lớn biết đọc biết viết đã tăng mạnh trong năm mươi năm qua.", more: "the **literacy rate** (Task 1) · literate ≠ illiterate (adj) · digital / financial **literacy**" },
          { w: "bookworm", pos: "n", ipa: "/ˈbʊkwɜːm/", vi: "mọt sách", ex: "My sister is a real bookworm — she reads at least a book a week.", exVi: "Chị tôi đúng là mọt sách — mỗi tuần đọc ít nhất một cuốn.", more: "văn nói, hợp Part 1 · gần nghĩa trang trọng hơn: an avid reader" },
          { w: "avid reader", pos: "n", ipa: "/ˌævɪd ˈriːdə/", vi: "người ham đọc", ex: "He has been an avid reader since childhood.", exVi: "Anh ấy ham đọc sách từ thời thơ ấu.", more: "an **avid** reader / fan / collector · **read for pleasure** (đọc để giải trí) · a reading habit" },
          { w: "read up on", pos: "phr v", ipa: "/ˌriːd ˈʌp ɒn/", vi: "đọc kỹ để tìm hiểu về (một đề tài)", ex: "Before the interview, I read up on the company's history.", exVi: "Trước buổi phỏng vấn, tôi đọc kỹ về lịch sử công ty.", more: "read up **on** a subject · khác read about (đọc qua về)" },
          { w: "read between the lines", pos: "idiom", ipa: "/ˌriːd bɪˌtwiːn ðə ˈlaɪnz/", vi: "hiểu ý ẩn sau câu chữ", ex: "Good readers learn to read between the lines and question the writer's purpose.", exVi: "Người đọc giỏi học cách hiểu ý ẩn sau câu chữ và đặt câu hỏi về mục đích của tác giả.", more: "đúng là kỹ năng của dạng Yes / No / Not Given (Ngày 23)" },
          { w: "flick through", pos: "phr v", ipa: "/ˌflɪk ˈθruː/", vi: "lật xem lướt", ex: "I usually flick through a book in the shop before I buy it.", exVi: "Tôi thường lật xem lướt một cuốn sách ở hiệu trước khi mua.", more: "= flip through, skim through · khác read from cover to cover (đọc từ đầu tới cuối)" },
        ],
      },
      {
        t: "quiz",
        id: "t3d28-sach-dien",
        title: "Luyện từ về sách — điền từ trong hộp (8 câu): author · biography · flick through · genre · literacy · plot · published · read up on",
        kind: "fill",
        items: [
          { q: "1. The ___ of the film is so complicated that I had to watch it twice.", answers: ["plot"] },
          { q: "2. Science fiction is my favourite ___.", answers: ["genre"] },
          { q: "3. The country's ___ rate rose from 60% to 95% in forty years.", answers: ["literacy"] },
          { q: "4. I always ___ a destination before I travel there.", answers: ["read up on"] },
          { q: "5. The dictionary was first ___ in 1884.", answers: ["published"] },
          { q: "6. She is writing a ___ of the first woman to fly across the Atlantic.", answers: ["biography"] },
          { q: "7. I didn't read the magazine properly; I just had time to ___ it.", answers: ["flick through"] },
          { q: "8. The ___ of the novel won a major prize last year.", answers: ["author"] },
        ],
      },

      /* ── 5 ── */
      { t: "h", text: "5. Mười hai cụm ăn điểm cho Task 2 và Part 3" },
      {
        t: "table",
        caption: "Collocation của hai chủ đề — chép vào sổ, mỗi cụm tự đặt một câu",
        head: ["Cụm", "Nghĩa", "Câu mẫu"],
        rows: [
          ["**be on the verge of extinction**", "sắp biến mất", "Hundreds of languages are on the verge of extinction."],
          ["**keep a language alive**", "giữ cho một ngôn ngữ sống", "Radio programmes help to keep the language alive."],
          ["**a means of communication**", "phương tiện giao tiếp", "A language is more than a means of communication; it carries a culture."],
          ["**lose touch with one's roots**", "mất liên hệ với cội nguồn", "Young people who move abroad may lose touch with their roots."],
          ["**broaden one's horizons**", "mở rộng tầm nhìn", "Learning a foreign language broadens your horizons."],
          ["**cultural exchange**", "giao lưu văn hoá", "Student programmes encourage cultural exchange."],
          ["**the dominance of English**", "sự thống trị của tiếng Anh", "The dominance of English threatens smaller languages."],
          ["**read for pleasure**", "đọc để giải trí", "Fewer teenagers read for pleasure than a decade ago."],
          ["**develop a reading habit**", "hình thành thói quen đọc", "Parents can help children to develop a reading habit early."],
          ["**be absorbed in a book**", "mải mê đọc sách", "She was so absorbed in the book that she missed her stop."],
          ["**stimulate the imagination**", "kích thích trí tưởng tượng", "Unlike films, novels stimulate the imagination."],
          ["**have a short attention span**", "khả năng tập trung ngắn", "Critics say that social media gives readers a short attention span."],
        ],
      },
      {
        t: "examples",
        items: [
          { en: "When a language dies out, a unique way of seeing the world is lost with it.", vi: "Khi một ngôn ngữ biến mất, một cách nhìn thế giới độc nhất cũng mất theo. (Task 2 — câu chủ đề)" },
          { en: "Although a global lingua franca makes trade easier, it should not replace people's mother tongues.", vi: "Dù một ngôn ngữ chung toàn cầu giúp buôn bán dễ hơn, nó không nên thay thế tiếng mẹ đẻ của mọi người. (Task 2 — nhượng bộ)" },
          { en: "I'm not exactly a bookworm, but I do read for pleasure before bed — mostly crime fiction.", vi: "Tôi không hẳn là mọt sách, nhưng tôi có đọc giải trí trước khi ngủ — chủ yếu là truyện trinh thám. (Part 1)" },
          { en: "I think printed books will survive, because many readers still prefer paperbacks to e-books.", vi: "Tôi nghĩ sách in sẽ tồn tại, vì nhiều người đọc vẫn thích sách bìa mềm hơn sách điện tử. (Part 3)" },
        ],
      },
      {
        t: "quiz",
        id: "t3d28-tu-vung-dich",
        title: "Dịch Việt → Anh (5 câu)",
        kind: "translate",
        grammar: "die out · keep … alive · be fluent in · read for pleasure · pass down · broaden one's horizons",
        items: [
          { q: "Nhiều ngôn ngữ thiểu số sẽ biến mất nếu trẻ em không học chúng.", hint: "minority languages · die out · if children do not learn them", answers: ["Many minority languages will die out if children do not learn them.", "Many minority languages will die out if children don't learn them.", "A lot of minority languages will die out if children do not learn them."] },
          { q: "Cô ấy thành thạo ba thứ tiếng.", hint: "be fluent in", answers: ["She is fluent in three languages."] },
          { q: "Ngày nay ít thanh thiếu niên đọc sách để giải trí hơn.", hint: "Fewer teenagers · read for pleasure · nowadays", answers: ["Fewer teenagers read for pleasure nowadays.", "Nowadays, fewer teenagers read for pleasure.", "Nowadays fewer teenagers read for pleasure.", "Fewer teenagers read for pleasure these days.", "Fewer teenagers read for pleasure today."] },
          { q: "Những phong tục này được truyền từ đời này sang đời khác.", hint: "These customs · are passed down · from generation to generation", answers: ["These customs are passed down from generation to generation.", "These customs have been passed down from generation to generation.", "These customs are handed down from generation to generation."] },
          { q: "Học một ngoại ngữ mở rộng tầm nhìn của bạn.", hint: "Learning a foreign language · broaden your horizons", answers: ["Learning a foreign language broadens your horizons.", "Learning a foreign language can broaden your horizons.", "Learning a foreign language will broaden your horizons."] },
        ],
      },

      /* ── 6 ── */
      { t: "h", text: "6. Mười sáu cặp từ dễ nhầm (confusing words)" },
      {
        t: "p",
        text: "Lỗi “chọn nhầm từ” khác lỗi chính tả: máy soát chính tả **không bắt được** vì cả hai từ đều có thật. Giám khảo tính nó vào LR. Mỗi cặp dưới đây có một **phép thử** để quyết định trong 5 giây. Tám cặp đầu là **khác loại từ**; tám cặp sau là **cùng loại từ nhưng khác nghĩa**.",
      },
      {
        t: "table",
        caption: "A. Khác loại từ — hỏi “chỗ này cần động từ, danh từ hay tính từ?”",
        head: ["Cặp", "Khác nhau", "Ví dụ đúng", "Phép thử"],
        rows: [
          ["**affect** (v) · **effect** (n)", "ảnh hưởng tới · sự ảnh hưởng", "Noise **affects** sleep. · Noise **has an effect on** sleep.", "Có a / an / the / an adj đứng trước ⇒ **effect**"],
          ["**advise** (v) /z/ · **advice** (n) /s/", "khuyên · lời khuyên", "Doctors **advise** us to walk. · a piece of **advice**", "advice không đếm được: ~~an advice, advices~~"],
          ["**practise** (v) · **practice** (n)", "luyện tập · sự luyện tập (Anh-Anh)", "You need to **practise**. · It takes **practice**.", "Anh-Mỹ viết practice cho cả hai — chọn một kiểu"],
          ["**lose** (v) /luːz/ · **loose** (adj) /luːs/", "mất, thua · lỏng", "Many languages **lose** speakers. · a **loose** shirt", "Thêm chữ o là thành “lỏng”"],
          ["**choose** (v) · **choice** (n)", "chọn · sự lựa chọn", "Students **choose** a subject. · make a **choice**", "Quá khứ: chose /tʃəʊz/ — một chữ o"],
          ["**breathe** (v) /briːð/ · **breath** (n) /breθ/", "thở · hơi thở", "**breathe** clean air · take a deep **breath**", "Có -e cuối là động từ"],
          ["**believe** (v) · **belief** (n)", "tin · niềm tin", "Many people **believe** that… · a common **belief**", "f → danh từ (cũng: prove – proof, relieve – relief)"],
          ["**succeed** (v) · **success** (n) · **successful** (adj)", "thành công", "**succeed in** doing · a great **success** · a **successful** plan", "~~It was success~~ ✗ → a success / successful"],
        ],
      },
      {
        t: "table",
        caption: "B. Cùng loại từ, khác nghĩa — hỏi “có tân ngữ không?” hoặc “nghĩa nào?”",
        head: ["Cặp", "Khác nhau", "Ví dụ đúng", "Phép thử"],
        rows: [
          ["**rise** (rose – risen) · **raise** (raised)", "tự tăng (không tân ngữ) · nâng cái gì lên (có tân ngữ)", "Prices **rose**. · The shop **raised** its prices.", "Sau động từ có danh từ ⇒ **raise**. Task 1 hầu như chỉ dùng rise"],
          ["**economic** · **economical**", "thuộc về kinh tế · tiết kiệm", "**economic** growth / crisis · an **economical** car", "Nói về nền kinh tế ⇒ economic"],
          ["**historic** · **historical**", "có ý nghĩa lịch sử · thuộc về lịch sử, quá khứ", "a **historic** victory · **historical** records / novels", "“Đáng ghi vào sử” ⇒ historic"],
          ["**classic** · **classical**", "kinh điển, tiêu biểu · cổ điển", "a **classic** novel / example · **classical** music", "Nhạc, Hy Lạp – La Mã ⇒ classical"],
          ["**sensible** · **sensitive**", "hợp lý, khôn ngoan · nhạy cảm", "a **sensible** decision · **sensitive** skin / a sensitive issue", "“Có lý” ⇒ sensible"],
          ["**number** · **amount**", "+ N đếm được · + N không đếm được", "the **number** of cars · the **amount** of traffic", "Đếm 1, 2, 3 được ⇒ number (cũng: fewer / less, many / much)"],
          ["**say** · **tell**", "say + lời nói · tell + người", "He **said** (that) he was tired. · He **told me** (that)…", "Ngay sau có người nghe ⇒ tell. ~~said me~~ ✗"],
          ["**remember** · **remind**", "tự nhớ · làm ai nhớ", "I **remember** that day. · This song **reminds me of** school.", "remind + người + of / to"],
        ],
      },
      {
        t: "note",
        title: "⚠️ Thêm tám cặp hay viết nhầm (chính tả hoặc nghĩa gần nhau)",
        items: [
          "**quite** /kwaɪt/ (khá) · **quiet** /ˈkwaɪət/ (yên tĩnh): The library is **quite quiet**.",
          "**then** (rồi, sau đó) · **than** (hơn — so sánh): higher **than**; **then** it fell.",
          "**their** (của họ) · **there** (ở đó; There is) · **they're** (they are — không dùng trong bài viết).",
          "**principal** (chính; hiệu trưởng) · **principle** (nguyên tắc): the **principal** reason · in **principle**.",
          "**desert** /ˈdezət/ (sa mạc) · **dessert** /dɪˈzɜːt/ (món tráng miệng).",
          "**accept** (chấp nhận) · **except** (ngoại trừ): everyone **except** me **accepted**.",
          "**lie** (lay – lain: nằm, không tân ngữ) · **lay** (laid – laid: đặt cái gì): The village **lies** north of the river. · Workers **laid** the pipes. (dùng nhiều trong map / process — bài Viết hôm nay)",
          "**borrow** (mượn vào) · **lend** (cho mượn ra): **borrow** a book **from** the library · the library **lends** books.",
        ],
      },
      { t: "rule", formula: "affect (v) → have an effect (n) on · prices rise (không tân ngữ) → raise prices (có tân ngữ) · the number of + N đếm được → the amount of + N không đếm được", vi: "Ba cặp bị sai nhiều nhất trong bài viết IELTS. Soát ở lượt 6 của bảng 6 lượt (Ngày 27)." },
      {
        t: "mcq",
        id: "t3d28-de-nham-chon",
        title: "Chọn từ đúng (10 câu)",
        items: [
          { q: "1. Social media has a negative ___ on teenagers' reading habits.", options: ["affect", "effect", "affection", "effective"], correct: 1, why: "Sau a negative cần danh từ → effect; have an effect on." },
          { q: "2. The government plans to ___ taxes on tobacco.", options: ["rise", "arise", "raise", "risen"], correct: 2, why: "Có tân ngữ (taxes) → raise." },
          { q: "3. The country is going through an ___ crisis.", options: ["economic", "economical", "economy", "economics"], correct: 0, why: "Khủng hoảng thuộc về kinh tế → economic. economical = tiết kiệm." },
          { q: "4. My teacher gave me some useful ___ about the exam.", options: ["advise", "advices", "an advice", "advice"], correct: 3, why: "advice là danh từ không đếm được: some advice." },
          { q: "5. The ___ of people who speak the language has fallen.", options: ["amount", "number", "deal", "quantity of"], correct: 1, why: "people đếm được → the number of." },
          { q: "6. Small languages ___ speakers every year.", options: ["loose", "loss", "lose", "lost"], correct: 2, why: "Cần động từ hiện tại: lose. loose = lỏng (tính từ); loss = danh từ." },
          { q: "7. It was a ___ decision to save some money each month.", options: ["sensible", "sensitive", "sensational", "sense"], correct: 0, why: "Quyết định hợp lý → sensible. sensitive = nhạy cảm." },
          { q: "8. This photograph ___ me of my childhood.", options: ["remembers", "memorises", "recalls to", "reminds"], correct: 3, why: "remind + người + of. remember không có người làm tân ngữ kiểu này." },
          { q: "9. In 1990 the figure ___ to 50%.", options: ["raised", "rose", "was risen", "was raising"], correct: 1, why: "Con số tự tăng, không tân ngữ → rise – rose. Không có bị động." },
          { q: "10. She ___ that she preferred paperbacks.", options: ["told", "said me", "said", "told to me"], correct: 2, why: "Không có người nghe ngay sau → say. told cần tân ngữ người: told me." },
        ],
      },
      {
        t: "quiz",
        id: "t3d28-de-nham-dien",
        title: "Viết dạng đúng của từ trong ngoặc — có thể phải đổi sang từ trong cặp (6 câu)",
        kind: "fill",
        items: [
          { q: "1. Losing a language can (effect) ___ a community's sense of identity.", answers: ["affect"] },
          { q: "2. There is a common (believe) ___ that printed books will disappear.", answers: ["belief"] },
          { q: "3. Parents should let children (choice) ___ their own books.", answers: ["choose"] },
          { q: "4. The project was a great (succeed) ___.", answers: ["success"] },
          { q: "5. The number of bilingual schools has (raise) ___ steadily since 2010.", answers: ["risen"] },
          { q: "6. You need regular (practise) ___ to become fluent.", answers: ["practice"] },
        ],
      },

      /* ── 7 ── */
      { t: "h", text: "7. Phát âm: cặp từ dễ nhầm chỉ khác nhau một âm" },
      {
        t: "p",
        text: "Nhiều cặp ở mục 6 không chỉ **viết** gần giống mà **đọc** cũng chỉ khác một âm — và người Việt hay đọc hai từ như nhau. Ba kiểu khác biệt: ==/s/ – /z/ ở cuối== (advice – advise, loose – lose, use danh từ – use động từ, close tính từ – close động từ); ==/θ/ – /ð/== (breath – breathe); và ==số âm tiết== (quite 1 – quiet 2). Đọc sai là người nghe hiểu thành từ kia.",
      },
      {
        t: "table",
        caption: "Khác nhau ở đâu",
        head: ["Danh từ / tính từ", "Động từ", "Mẹo"],
        rows: [
          ["advice /ədˈvaɪs/", "advise /ədˈvaɪz/", "Động từ kết thúc bằng /z/ — rung cổ họng, nguyên âm dài hơn"],
          ["loose /luːs/ (adj)", "lose /luːz/", "Hai chữ o mà đọc /s/; một chữ o mà đọc /z/"],
          ["use /juːs/ (n)", "use /juːz/ (v)", "the **use** of phones /s/ · **use** a phone /z/"],
          ["close /kləʊs/ (adj: gần)", "close /kləʊz/ (v: đóng)", "a **close** friend /s/ · **close** the door /z/"],
          ["breath /breθ/", "breathe /briːð/", "Động từ: nguyên âm dài /iː/ + /ð/ rung"],
          ["belief /bɪˈliːf/", "believe /bɪˈliːv/", "/f/ không rung · /v/ rung"],
          ["quite /kwaɪt/ (1 âm tiết)", "quiet /ˈkwaɪət/ (2 âm tiết)", "quiet có thêm /ət/"],
          ["desert /ˈdezət/ (sa mạc)", "dessert /dɪˈzɜːt/ (tráng miệng)", "Khác chỗ nhấn"],
        ],
      },
      {
        t: "phatam",
        id: "t3d28-phat-am",
        title: "Luyện phát âm — cặp từ dễ nhầm khác nhau một âm",
        note: "Đọc từng cặp chậm, cố ý làm hai từ nghe KHÁC nhau: đặt tay lên cổ — /z/, /v/, /ð/ phải rung, /s/, /f/, /θ/ thì không. Bốn dòng cuối đưa các cặp vào câu.",
        items: [
          { text: "advice, advise", ipa: "ədvaɪs ədvaɪz", vi: "/s/ – /z/ cuối từ: lời khuyên – khuyên" },
          { text: "loose, lose", ipa: "luːs luːz", vi: "/s/ – /z/: lỏng – mất" },
          { text: "breath, breathe", ipa: "breθ briːð", vi: "/e/ + /θ/ – /iː/ + /ð/: hơi thở – thở" },
          { text: "belief, believe", ipa: "bɪliːf bɪliːv", vi: "/f/ – /v/: niềm tin – tin" },
          { text: "quite, quiet", ipa: "kwaɪt kwaɪət", vi: "một âm tiết – hai âm tiết: khá – yên tĩnh" },
          { text: "desert, dessert", ipa: "dezət dɪzɜːt", vi: "nhấn âm đầu – nhấn âm sau: sa mạc – tráng miệng" },
          { text: "I advise you to take my advice.", ipa: "aɪ ədvaɪz juː tə teɪk maɪ ədvaɪs", vi: "Tôi khuyên bạn nghe lời khuyên của tôi." },
          { text: "If the rope is loose, you will lose the boat.", ipa: "ɪf ðə rəʊp ɪz luːs juː wɪl luːz ðə bəʊt", vi: "Nếu dây lỏng, bạn sẽ mất con thuyền." },
          { text: "The library is quite quiet in the evening.", ipa: "ðə laɪbrəri ɪz kwaɪt kwaɪət ɪn ðiː iːvnɪŋ", vi: "Thư viện khá yên tĩnh vào buổi tối." },
          { text: "Many people believe in the use of books, so they use them daily.", ipa: "meni piːpl bɪliːv ɪn ðə juːs əv bʊks səʊ ðeɪ juːz ðəm deɪli", vi: "use danh từ /s/ – use động từ /z/" },
        ],
      },
      {
        t: "note",
        title: "💡 Cách học sau bài",
        items: [
          "Chép 16 cặp vào **một trang** sổ lỗi, mỗi cặp một câu tự đặt về chính bạn. Trang này là danh sách kiểm cho **lượt 6** mỗi lần soát bài.",
          "44 từ chủ đề đã tự vào Flashcards “Từ của khoá — Tập 3”. Ôn theo lịch nhắc; ưu tiên tự nói một câu Part 1 với từng từ.",
          "Chủ đề Language và Books sẽ quay lại ở Tập 5 Ngày 26 ở mức band 8 — vòng này chỉ cần dùng ĐÚNG, chưa cần dùng “kêu”.",
        ],
      },
    ],
  },
  /* ═══════════════════════════ BÀI 2 — VIẾT ═══════════════════════════ */
  {
    id: "t3d28-viet",
    kind: "writing",
    title: "Viết Task 1: process + map band 6 — mục đích của bước, map ba mốc, map chọn địa điểm S1 / S2",
    goal: "Viết trọn bài Task 1 band 6 (160–190 từ, 20 phút) cho ba kiểu đề không có số liệu: sơ đồ quy trình (overview nêu loại quy trình + đầu – cuối, nêu mục đích của bước, gộp bước bằng After being… / before being…), bản đồ ba mốc quá khứ – hiện tại – kế hoạch (mỗi mốc một thì) và bản đồ chọn địa điểm S1 / S2 (hiện tại đơn + would / could, mỗi vị trí một khổ).",
    minutes: 90,
    blocks: [
      {
        t: "recap",
        title: "Bài này học gì · đẩy tiêu chí nào",
        items: [
          "**Nối Tập 2 Ngày 20 · 22**: bạn đã viết được process và map hai mốc ở band 5 (đủ bước, bị động đúng). Hôm nay lên band 6: ==overview rõ + câu có mục đích + gộp bước==.",
          "**Process band 6**: nêu **mục đích** của bước (in order to, so that, to allow…), dùng **từ ngoài hình** nhưng **không bịa bước**, phân biệt **by** (người / máy làm) và **with / by means of** (dụng cụ, cách thức).",
          "**Map ba mốc**: quá khứ đơn bị động → hiện tại hoàn thành bị động → **is going to be / will be / is planned** + V3. Mỗi mốc một thì — đúng luật “nhất quán thì” hôm qua.",
          "**Map chọn địa điểm S1 / S2** viết TRỌN bài: không có gì đã xảy ra ⇒ hiện tại đơn cho vị trí, **would / could** cho hệ quả; KHÔNG đưa ý kiến chọn chỗ nào.",
          "Mỗi kiểu có **bài band 5 và band 6 đặt cạnh nhau** + bảng 4 tiêu chí (TA · CC · LR · GRA).",
          "Cuối bài: 2 đề tự viết, AI chấm.",
        ],
      },

      /* ── 1 ── */
      { t: "h", text: "1. Process và map ở band 5 và band 6 khác nhau ở đâu?" },
      {
        t: "p",
        text: "Hai dạng này không có con số, nên giám khảo không chấm “so sánh số liệu”. Thay vào đó, Task Achievement hỏi: bạn có **tổng quan rõ** không, có **đủ mọi giai đoạn / mọi thay đổi** không, và có **thêm thứ không có trong hình** không. Còn GRA thì hai dạng này là nơi kiểm tra **bị động** và **mệnh đề rút gọn** kỹ nhất trong cả bài thi.",
      },
      {
        t: "table",
        caption: "Cùng dạng — hai mức band",
        head: ["Tiêu chí", "Band 5", "Band 6"],
        rows: [
          ["**TA**", "Kể đủ bước nhưng không có overview, hoặc overview chỉ là “There are 8 steps”; thêm ý kiến (“this is good for the environment”)", "Overview nêu **loại quy trình + số giai đoạn + điểm đầu – điểm cuối** (process) / **xu hướng thay đổi chung** (map); đủ mọi bước; không ý kiến"],
          ["**CC**", "Then… Then… Next… Then…; mỗi bước một câu; chia đoạn tuỳ tiện", "Chia hai thân bài ở **chỗ đổi pha**; từ trình tự 3 tầng (Tập 2 Ngày 20); gộp 2 bước một câu; this pulp / it / there"],
          ["**LR**", "Chép nguyên nhãn trong hình; động từ lặp (is put, is made)", "Đổi nhãn thành câu; động từ chính xác (is sorted, is filtered out, was converted into); từ ngoài hình đúng nghĩa (residential, industrial, leisure)"],
          ["**GRA**", "Bị động thiếu be (“the paper sorted”); sai thì giữa các bản đồ", "Bị động đúng; có **After being + V3**, **before being + V3**, **where**, **so that**, **Once**; thì đúng theo từng mốc"],
        ],
      },
      {
        t: "note",
        title: "📌 Một phép thử band 5 hay 6",
        items: [
          "Che phần thân bài, chỉ đọc **overview**. Người chưa nhìn hình có hình dung được “đây là quy trình gì, đi từ đâu tới đâu” / “khu này đổi từ kiểu gì sang kiểu gì” không? Có ⇒ band 6 trở lên về TA.",
          "Đếm số câu **mỗi câu một bước**. Quá nửa bài là kiểu đó ⇒ CC và GRA đang ở band 5.",
        ],
      },

      /* ── 2 ── */
      { t: "h", text: "2. Process band 6 — overview ba thành phần" },
      {
        t: "p",
        text: "Ôn Tập 2 Ngày 20: bốn câu tự hỏi trước khi viết (bắt đầu ở đâu? kết thúc ở đâu? mấy bước? tự nhiên hay nhân tạo?). Ở band 6, bốn câu trả lời đó **chính là overview**. Thêm một câu hỏi: quy trình **thẳng** (linear — có đầu, có cuối) hay **vòng** (cyclical — bước cuối quay về bước đầu)?",
      },
      {
        t: "patterns",
        rows: [
          {
            formula: "Overall, this is a linear / cyclical (man-made / natural) process consisting of + số + stages, which begins with + N / V-ing and ends with + N / V-ing.",
            vi: "Khung overview cho mọi sơ đồ quy trình: LOẠI + SỐ GIAI ĐOẠN + ĐẦU – CUỐI.",
            examples: [
              { en: "Overall, this is a linear process consisting of eight stages, which begins with the collection of used paper and ends with rolls of recycled paper ready for printing.", vi: "Nhìn chung, đây là một quy trình thẳng gồm tám giai đoạn, bắt đầu bằng việc thu gom giấy đã dùng và kết thúc bằng những cuộn giấy tái chế sẵn sàng đem in." },
              { en: "Overall, the life cycle of the frog is a natural, cyclical process with five main stages, from egg to adult.", vi: "Nhìn chung, vòng đời của ếch là một quá trình tự nhiên, tuần hoàn gồm năm giai đoạn chính, từ trứng tới ếch trưởng thành." },
            ],
          },
          {
            formula: "Overall, the process can be divided into + số + main phases: A, B and C.",
            vi: "Khi sơ đồ có trên 8 bước: gom thành 2–3 PHA — vừa là overview, vừa là cách chia thân bài.",
            examples: [
              { en: "Overall, the process can be divided into three main phases: preparing the raw material, cleaning the pulp and forming the new paper.", vi: "Nhìn chung, quy trình có thể chia thành ba pha chính: chuẩn bị nguyên liệu, làm sạch bột giấy và tạo thành giấy mới." },
            ],
          },
        ],
      },
      {
        t: "note",
        title: "⚠️ Ba lỗi overview của bài process",
        items: [
          "Chỉ đếm bước: ~~Overall, there are eight steps in the process.~~ — chưa nói đi từ đâu tới đâu.",
          "Kể luôn chi tiết: ~~Overall, first the paper is collected, then it is sorted…~~ — đó là thân bài.",
          "Đưa ý kiến / kết luận: ~~Overall, recycling paper is very good for the environment.~~ — hình không nói điều đó.",
        ],
      },
      { t: "rule", formula: "Overall, this is a linear / cyclical process consisting of + số + stages, which begins with … and ends with …", vi: "Overview của process = loại quy trình + số giai đoạn + điểm đầu + điểm cuối." },

      /* ── 3 ── */
      { t: "h", text: "3. Nêu MỤC ĐÍCH của bước — và dùng từ ngoài hình mà không bịa bước" },
      {
        t: "p",
        text: "Sơ đồ thường ghi kèm chú thích nhỏ (“water drains away”, “glue removed”). Bài band 5 bỏ qua hoặc chép lại. Bài band 6 biến chú thích đó thành **mệnh đề mục đích / kết quả** — một câu vừa đủ chi tiết (TA), vừa là câu phức (GRA). Tập 2 Ngày 20 đã giới thiệu to ensure that / so that / by means of; hôm nay dùng trọn bộ.",
      },
      {
        t: "table",
        caption: "Sáu cách nói mục đích / cách thức — đều dùng được trong mọi bài process",
        head: ["Cấu trúc", "Dùng khi", "Ví dụ"],
        rows: [
          ["**to / in order to** + V", "Mục đích, cùng chủ ngữ", "The paper is mixed with water **in order to break** it down into pulp."],
          ["**so that** + S + can / will + V", "Mục đích, chủ ngữ khác", "The pulp is passed through screens **so that** glue **can be** filtered out."],
          ["**to allow / enable** + N + **to** V", "“để cho cái gì đó xảy ra”", "It is sprayed onto a mesh **to allow** the water **to drain** away."],
          ["**to ensure that** + S + V", "“để bảo đảm rằng”", "The sheets are checked **to ensure that** they are the same thickness."],
          ["**by + V-ing** / **by means of** + N", "CÁCH thực hiện", "Ink is removed **by means of** air bubbles. · …**by blowing** air through the pulp."],
          ["**, which** + V / **, resulting in** + N", "KẾT QUẢ của bước", "Air is blown through the tank**, which carries** the ink to the surface."],
        ],
      },
      {
        t: "table",
        caption: "by hay with? (ôn Ngày 13 mục 6)",
        head: ["Giới từ", "Đi với", "Ví dụ"],
        rows: [
          ["**by**", "Người / máy / lực **làm** hành động", "sorted **by** workers · dried **by** heated rollers · carried **by** the wind"],
          ["**with**", "**Dụng cụ / vật liệu** dùng để làm", "mixed **with** water · covered **with** plastic · cut **with** a blade"],
          ["**by hand / by machine / by lorry**", "Cụm cố định chỉ cách thức — không mạo từ", "picked **by hand** · delivered **by lorry**"],
          ["**in / into / onto / through**", "Nơi chốn, hướng chuyển động", "stored **in** tanks · poured **into** moulds · sprayed **onto** a mesh · passed **through** screens"],
        ],
      },
      {
        t: "sodo",
        kind: "compare",
        title: "Từ ngoài hình: thêm TỪ thì được — thêm BƯỚC thì không",
        cols: [
          { title: "✓ Được thêm", items: ["Từ **gọi tên** thứ có trong hình: raw material, the mixture, the finished product, impurities", "Từ **phân loại**: a linear process, an industrial process", "Động từ **chính xác hơn** nhãn: “to shops” → is delivered / distributed to shops", "Mục đích **hiển nhiên từ chú thích**: screens… glue removed → so that glue can be filtered out"] },
          { title: "✗ Không được thêm", items: ["Bước **không có** trong hình: ~~the paper is then bleached~~", "Con số, thời gian **không ghi**: ~~for two hours~~, ~~at 100°C~~", "Mục đích **tự suy diễn**: ~~to make the paper cheaper~~", "Ý kiến: ~~this important step~~, ~~good for the environment~~"] },
        ],
      },
      {
        t: "note",
        title: "⚠️ Người Việt hay sai khi nêu mục đích",
        items: [
          "~~for break it down~~ / ~~for to break~~ → **to break** / **in order to break** / **for breaking** (for + V-ing chỉ công dụng của dụng cụ).",
          "~~so that glue is can be removed~~ → so that glue **can be removed**.",
          "~~to allow the water drains away~~ → to allow the water **to drain** away.",
          "~~dried with heated rollers~~ không sai hẳn, nhưng máy **làm** việc sấy → **by** heated rollers tự nhiên hơn; ~~mixed by water~~ thì sai → mixed **with** water.",
          "Lạm dụng: câu nào cũng “in order to” thì máy móc. Trong một bài 8 bước, nêu mục đích ở **3–4 bước** là đủ.",
        ],
      },
      { t: "rule", formula: "S + is / are + V3 + in order to V / so that S can V / to allow N to V / by means of N", vi: "Mỗi thân bài có ít nhất một bước kèm mục đích hoặc cách thức — lấy từ chú thích nhỏ trong hình." },
      {
        t: "quiz",
        id: "t3d28-muc-dich-dich",
        title: "Dịch sang tiếng Anh — bước + mục đích (5 câu)",
        kind: "translate",
        grammar: "is / are + V3 + in order to V · so that S can be V3 · to allow N to V · by means of N · by + agent / with + vật liệu",
        items: [
          { q: "Giấy được trộn với nước để phân rã nó thành bột giấy.", hint: "is mixed with water · in order to break it down into pulp", answers: ["The paper is mixed with water in order to break it down into pulp.", "The paper is mixed with water to break it down into pulp.", "Paper is mixed with water in order to break it down into pulp.", "The paper is mixed with water so that it breaks down into pulp."] },
          { q: "Bột giấy được cho qua các tấm sàng để keo có thể được lọc ra.", hint: "is passed through screens · so that glue can be filtered out", answers: ["The pulp is passed through screens so that glue can be filtered out.", "The pulp is passed through screens so that the glue can be filtered out.", "The pulp is passed through screens so that glue can be removed."] },
          { q: "Nó được phun lên một tấm lưới để nước thoát đi.", hint: "is sprayed onto a mesh · to allow the water to drain away", answers: ["It is sprayed onto a mesh to allow the water to drain away.", "It is sprayed onto a mesh so that the water can drain away.", "It is sprayed onto a mesh to allow water to drain away."] },
          { q: "Mực được loại bỏ bằng bong bóng khí.", hint: "is removed · by means of air bubbles", answers: ["Ink is removed by means of air bubbles.", "The ink is removed by means of air bubbles.", "Ink is removed using air bubbles.", "The ink is removed using air bubbles."] },
          { q: "Tấm giấy ướt được ép và sấy khô bởi các trục lăn nóng.", hint: "The wet sheet · is pressed and dried · by heated rollers", answers: ["The wet sheet is pressed and dried by heated rollers.", "The wet sheet is pressed and then dried by heated rollers."] },
        ],
      },

      /* ── 4 ── */
      { t: "h", text: "4. Gộp bước — bốn khuôn câu band 6" },
      {
        t: "p",
        text: "Tập 2 Ngày 20 dạy ba cách gộp (and then · where · Once…). Ngày 17 của Tập 3 dạy rút gọn V-ing / V3. Ghép lại, bạn có bốn khuôn dưới đây. Nhớ luật **dangling** hôm qua: chủ ngữ ngầm của cụm đầu câu phải là chủ ngữ của mệnh đề chính.",
      },
      {
        t: "patterns",
        rows: [
          {
            formula: "After being + V3, S + is + V3 …",
            vi: "Bước trước xong (bị động) → bước sau. Cùng một chủ ngữ.",
            examples: [{ en: "After being cleaned, the pulp is pumped into a second tank.", vi: "Sau khi được làm sạch, bột giấy được bơm sang bồn thứ hai." }],
          },
          {
            formula: "S + is + V3 … before being + V3 …",
            vi: "Bước trước → bước sau, đặt ở cuối câu.",
            examples: [{ en: "The wet sheet is pressed and dried before being wound onto large rolls.", vi: "Tấm giấy ướt được ép và sấy khô trước khi được cuộn vào các cuộn lớn." }],
          },
          {
            formula: "Once / When + S + has been + V3, it + is + V3 …",
            vi: "Nhấn mạnh bước trước PHẢI xong hẳn.",
            examples: [{ en: "Once the ink has been removed, the pulp is sprayed onto a moving mesh.", vi: "Khi mực đã được loại bỏ, bột giấy được phun lên một tấm lưới chuyển động." }],
          },
          {
            formula: "S + is taken to + nơi, where it + is + V3 …",
            vi: "Chuyển địa điểm + việc xảy ra ở đó.",
            examples: [{ en: "The paper is taken to a recycling plant, where it is sorted by grade.", vi: "Giấy được đưa tới nhà máy tái chế, nơi nó được phân loại theo hạng." }],
          },
        ],
      },
      { t: "rule", formula: "After being V3, S is V3 · S is V3 before being V3 · Once S has been V3, it is V3 · …, where it is V3", vi: "Mỗi thân bài dùng 1–2 khuôn gộp; các bước còn lại nối bằng từ trình tự." },
      {
        t: "quiz",
        id: "t3d28-gop-buoc",
        title: "Điền dạng đúng của động từ trong ngoặc (6 câu)",
        kind: "fill",
        items: [
          { q: "1. After ___ (wash), the leaves are spread out on trays.", answers: ["being washed"] },
          { q: "2. The bottles are filled before ___ (label).", answers: ["being labelled", "being labeled"] },
          { q: "3. Once the clay ___ (shape), it is left to dry for two days.", answers: ["has been shaped", "is shaped"] },
          { q: "4. The beans are taken to a factory, where they ___ (roast).", answers: ["are roasted"] },
          { q: "5. The mixture is heated in order ___ (remove) any remaining water.", answers: ["to remove"] },
          { q: "6. The fruit is sorted ___ hand and then packed in boxes. (giới từ)", answers: ["by"] },
        ],
      },

      /* ── 5 ── */
      { t: "h", text: "5. Bài mẫu process — band 5 và band 6 đặt cạnh nhau" },
      {
        t: "p",
        text: "**Đề:** The diagram below shows how recycled paper is made. Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.",
      },
      {
        t: "figure",
        fig: {
          kind: "process",
          title: "How recycled paper is made",
          note: "Quy trình tự đặt cho bài luyện (giản lược từ quy trình thật).",
          steps: [
            { label: "Waste paper collected", note: "recycling bins · homes and offices" },
            { label: "Sorted by grade", note: "recycling plant · staples and plastic removed by hand" },
            { label: "Mixed with water and chemicals", note: "large tank · paper breaks down into pulp" },
            { label: "Pulp passed through screens", note: "glue and small objects filtered out" },
            { label: "Ink removed", note: "second tank · air bubbles carry ink to surface" },
            { label: "Pulp sprayed onto moving mesh", note: "water drains away" },
            { label: "Pressed and dried", note: "heated rollers" },
            { label: "Wound onto large rolls", note: "ready for printers" },
          ],
        },
      },
      {
        t: "table",
        caption: "Phân tích đề — 2 phút",
        head: ["Câu hỏi", "Trả lời", "Dùng ở đâu"],
        rows: [
          ["Loại quy trình?", "Nhân tạo, **thẳng** (có đầu – cuối)", "Overview"],
          ["Mấy giai đoạn?", "8", "Overview"],
          ["Đầu – cuối?", "Thu gom giấy đã dùng → cuộn giấy sẵn sàng cho nhà in", "Overview"],
          ["Chỗ đổi pha?", "Sau bước 3: giấy đã thành bột → từ đây là làm sạch và tạo giấy", "Chia thân 1 (bước 1–3) · thân 2 (bước 4–8)"],
          ["Chú thích nào thành mục đích?", "breaks down into pulp · filtered out · carry ink to surface · water drains away", "3–4 mệnh đề mục đích / cách thức"],
        ],
      },
      {
        t: "sodo",
        kind: "compare",
        title: "Cùng một đề — hai bài viết",
        cols: [
          {
            title: "Bài band 5 (129 từ — thiếu từ)",
            items: [
              "The diagram shows how recycled paper is made. There are eight steps in the picture.",
              "First, people collect waste paper from homes and offices. Then the paper sorted by grade and staples and plastic removed. Then it mix with water in a large tank and it become pulp. Then the pulp cleaned by screens. Next, ink removed from the pulp. I think this step is very important because the paper will be white.",
              "After that, the pulp sprayed onto a moving mesh and water drains away. Then it is pressed and dried by heated rollers. Finally, it wound onto large rolls and the factory sells it to many countries to make books and newspapers.",
              "In conclusion, recycled paper is made by eight steps and it is good for environment.",
            ],
          },
          {
            title: "Bài band 6 (191 từ)",
            items: [
              "The diagram illustrates the stages involved in turning waste paper into new paper.",
              "Overall, this is a linear process consisting of eight steps, which begins with the collection of used paper and ends with large rolls of recycled paper that are ready to be sent to printers.",
              "In the first stage, waste paper is collected from recycling bins at homes and offices and taken to a recycling plant. There it is sorted by grade, and unwanted materials such as staples and plastic are removed by hand. The sorted paper is then mixed with water and chemicals in a large tank in order to break it down into a soft pulp.",
              "Next, the pulp is passed through screens so that glue and other small objects can be filtered out. After being cleaned, it is pumped into a second tank, where ink is removed by means of air bubbles, which carry it to the surface. Once the ink has been removed, the pulp is sprayed onto a moving mesh to allow the water to drain away. Finally, the wet sheet is pressed and dried by heated rollers before being wound onto large rolls.",
            ],
          },
        ],
        caption: "Band ước tính. Đừng học thuộc bài band 6 — học KHUNG: overview 3 thành phần · chia thân bài ở chỗ đổi pha · 4 mệnh đề mục đích · 3 khuôn gộp bước.",
      },
      {
        t: "table",
        caption: "Vì sao hai bài khác band — theo 4 tiêu chí",
        head: ["Tiêu chí", "Bài band 5", "Bài band 6"],
        rows: [
          ["**TA**", "Không có overview (“There are eight steps” chưa phải); **thêm ý kiến** (I think this step is very important); **bịa bước** (sells it to many countries); kết luận “good for environment”; **dưới 150 từ**", "Overview: linear · eight steps · begins with… ends with…; đủ 8 bước; giữ chi tiết của hình (by hand, second tank, heated rollers); không ý kiến"],
          ["**CC**", "Then × 4; mỗi bước một câu; chia đoạn không theo pha", "Thân 1 = chuẩn bị (1–3), thân 2 = làm sạch và tạo giấy (4–8); In the first stage · There · then · Next · After being · Once · Finally; **it / the sorted paper / the wet sheet** tránh lặp"],
          ["**LR**", "Chép nhãn; made / removed lặp", "illustrates · the stages involved in · unwanted materials · filtered out · pumped · a soft pulp (từ ngoài hình, đúng nghĩa)"],
          ["**GRA**", "Bị động thiếu be: ~~the paper sorted~~, ~~ink removed~~, ~~it wound~~; ~~it mix~~, ~~it become~~; ~~made by eight steps~~", "Bị động đúng suốt bài; in order to · so that… can be · where · which · Once… has been · before being wound"],
        ],
      },
      {
        t: "note",
        title: "💡 Bài band 6 vẫn chưa phải band 7 — vì sao?",
        items: [
          "Overview đủ nhưng chưa **gom pha** (preparing – cleaning – forming). Band 7 thường nêu được “hình dạng” của quy trình, không chỉ đầu – cuối.",
          "Từ nối còn **theo khuôn** (In the first stage… Next… Finally) — đúng nhưng dễ đoán.",
          "Bài band 6 **không** có câu kết luận — đó là đúng. Task 1 không cần kết bài; overview đã làm việc đó.",
        ],
      },

      /* ── 6 ── */
      { t: "h", text: "6. Map ba mốc: quá khứ – hiện tại – kế hoạch tương lai" },
      {
        t: "p",
        text: "Tập 2 Ngày 22 dạy map **hai mốc** (2000 và 2020 → quá khứ đơn bị động; 2000 và “today” → hiện tại hoàn thành bị động). Đề band 6–7 có thể cho **ba** bản đồ: một năm quá khứ, hiện nay, và một năm tương lai (“planned development”, “proposed changes”). Cái khó duy nhất là **thì**: mỗi mốc một thì, và phải có từ báo hiệu khi chuyển mốc.",
      },
      {
        t: "sodo",
        kind: "timeline",
        title: "Ba mốc — ba nhóm thì",
        marks: [
          { from: -8, label: "**1980**: was used for · there was / were → quá khứ đơn", kieu: "diem", mau: 1 },
          { from: -8, to: 0, label: "**1980 → nay**: has been converted · have been replaced → HTHT bị động", kieu: "doan", mau: 2 },
          { from: 0, to: 8, label: "**nay → 2040**: is going to be turned into · will be replaced · is planned → tương lai bị động", kieu: "doan", mau: 3 },
        ],
        caption: "Từ báo hiệu chuyển mốc: In 1980, … · Since then, … / Today, … · By 2040, … / According to the plan, … / In the future, …",
      },
      {
        t: "table",
        caption: "Ngôn ngữ cho từng mốc",
        head: ["Mốc", "Thì", "Cụm dùng được"],
        rows: [
          ["Năm quá khứ (tả trạng thái lúc đó)", "Quá khứ đơn", "In 1980, the area **was used for** trade. · There **were** warehouses along the river. · The site **was occupied by** a factory."],
          ["Quá khứ → hiện nay (thay đổi đã xong, kết quả còn thấy)", "Hiện tại hoàn thành bị động", "Since then, the market **has been converted into** a museum. · The docks **have become** a marina. · The houses **have remained** unchanged."],
          ["Thay đổi có **mốc năm quá khứ rõ** hoặc kể chi tiết", "Quá khứ đơn bị động", "The factory **was demolished to make way for** a shopping centre."],
          ["Kế hoạch tương lai", "be going to be V3 · will be V3 · is planned / is due to be V3", "The car park **is going to be turned into** a park. · The railway **will be replaced by** a tram line. · A footbridge **is planned** across the river."],
          ["Thứ **không đổi** qua cả ba mốc", "Hiện tại hoàn thành → tương lai", "The houses **have remained** unchanged and **will not be affected** by the plans."],
        ],
      },
      {
        t: "note",
        title: "⚠️ Bốn lỗi của bài ba mốc",
        items: [
          "**Một thì cho cả bài**: ~~In 2040 the car park was turned into a park.~~ → **will be / is going to be** turned into.",
          "**Chắc chắn quá về tương lai**: đề ghi “planned / proposed” ⇒ dùng **is planned / is going to be / will be**; đừng viết như đã xảy ra. (Cách nói dự báo mềm hơn — is expected to, is likely to — bạn đã gặp ở Ngày 5; dùng được khi đề ghi “proposed”.)",
          "**Chia thân bài theo từng bản đồ** rồi tả từng bản đồ từ đầu → lặp ba lần. Chia theo **hai quãng**: quá khứ → nay · nay → tương lai.",
          "**remain / become / happen bị động** (Ngày 13): ~~has been remained~~, ~~was become~~ → has remained, became.",
        ],
      },
      {
        t: "patterns",
        rows: [
          {
            formula: "Overall, the + nơi + has been transformed from + N cũ + into + N mới, and the future plans will make it + adj-er.",
            vi: "Overview cho map ba mốc: MỘT ý cho quãng đã qua + MỘT ý cho kế hoạch.",
            examples: [{ en: "Overall, the town has been transformed from an industrial port into a residential and leisure area, and the future plans will make it greener and easier to get around without a car.", vi: "Nhìn chung, thị trấn đã chuyển từ một cảng công nghiệp thành khu dân cư và giải trí, và các kế hoạch tương lai sẽ khiến nó xanh hơn và dễ đi lại hơn khi không dùng ô tô." }],
          },
          {
            formula: "S + was demolished / knocked down + to make way for + N.",
            vi: "Gói “phá cái cũ + xây cái mới” vào một câu (cùng họ với replacing…, with + N + V3 ở Tập 2 Ngày 22).",
            examples: [{ en: "The factory was demolished to make way for a shopping centre and a car park.", vi: "Nhà máy bị phá bỏ để nhường chỗ cho một trung tâm mua sắm và một bãi đỗ xe." }],
          },
        ],
      },
      { t: "rule", formula: "In + năm quá khứ, S was … · Since then, S has been + V3 · By + năm tương lai, S is going to be / will be + V3", vi: "Ba mốc — ba thì; mỗi lần đổi mốc phải có cụm thời gian báo hiệu." },
      {
        t: "p",
        text: "**Đề:** The maps below show the port town of Saltby in 1980 and today, and the planned development of the town by 2040. Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.",
      },
      {
        t: "figure",
        fig: {
          kind: "map",
          title: "Saltby — 1980",
          note: "Bản đồ tự đặt cho bài luyện. Phía Bắc ở trên cùng; sông chảy ở phía nam.",
          map: {
            cols: 12,
            rows: 10,
            paths: [
              { x: 0.2, y: 0.2, w: 0.7, h: 8.2, label: "Railway" },
              { x: 1.1, y: 4.4, w: 10.7, h: 1.1, label: "Main road" },
              { x: 0.2, y: 8.7, w: 11.6, h: 1.1, label: "River" },
            ],
            boxes: [
              { x: 1.3, y: 0.4, w: 4.9, h: 3.6, label: "Terraced houses" },
              { x: 6.6, y: 0.4, w: 5.0, h: 3.6, label: "Factory" },
              { x: 1.3, y: 5.9, w: 2.8, h: 2.4, label: "Fish market" },
              { x: 4.5, y: 5.9, w: 3.5, h: 2.4, label: "Warehouses" },
              { x: 8.4, y: 5.9, w: 3.2, h: 2.4, label: "Docks" },
            ],
          },
        },
      },
      {
        t: "figure",
        fig: {
          kind: "map",
          title: "Saltby — today",
          note: "Bản đồ tự đặt cho bài luyện. Phía Bắc ở trên cùng.",
          map: {
            cols: 12,
            rows: 10,
            paths: [
              { x: 0.2, y: 0.2, w: 0.7, h: 8.2, label: "Railway" },
              { x: 1.1, y: 4.4, w: 10.7, h: 1.1, label: "Main road" },
              { x: 0.2, y: 8.7, w: 11.6, h: 1.1, label: "River" },
            ],
            boxes: [
              { x: 1.3, y: 0.4, w: 4.9, h: 3.6, label: "Terraced houses" },
              { x: 6.6, y: 0.4, w: 3.0, h: 3.6, label: "Shopping centre" },
              { x: 9.8, y: 0.4, w: 1.8, h: 3.6, label: "Car park" },
              { x: 1.3, y: 5.9, w: 2.8, h: 2.4, label: "Maritime museum" },
              { x: 4.5, y: 5.9, w: 3.5, h: 2.4, label: "Apartments" },
              { x: 8.4, y: 5.9, w: 3.2, h: 2.4, label: "Marina" },
            ],
          },
        },
      },
      {
        t: "figure",
        fig: {
          kind: "map",
          title: "Saltby — planned development by 2040",
          note: "Bản đồ tự đặt cho bài luyện. Phía Bắc ở trên cùng.",
          map: {
            cols: 12,
            rows: 10,
            paths: [
              { x: 0.2, y: 0.2, w: 0.7, h: 8.2, label: "Tram line" },
              { x: 1.1, y: 4.4, w: 10.7, h: 1.1, label: "Main road" },
              { x: 0.2, y: 8.7, w: 11.6, h: 1.1, label: "River" },
            ],
            boxes: [
              { x: 1.3, y: 0.4, w: 4.9, h: 3.6, label: "Terraced houses" },
              { x: 6.6, y: 0.4, w: 3.0, h: 3.6, label: "Shopping centre" },
              { x: 9.8, y: 0.4, w: 1.8, h: 3.6, label: "Public park" },
              { x: 1.3, y: 5.9, w: 2.8, h: 2.4, label: "Maritime museum" },
              { x: 4.5, y: 5.9, w: 3.5, h: 2.4, label: "Apartments" },
              { x: 8.4, y: 5.9, w: 3.2, h: 2.4, label: "Marina" },
            ],
            pins: [{ x: 8.2, y: 9.2, label: "Footbridge (new)" }],
          },
        },
      },
      {
        t: "table",
        caption: "Bảng thay đổi — lập trong 2 phút trước khi viết (ôn Tập 2 Ngày 22)",
        head: ["Vị trí", "1980", "Nay", "2040 (kế hoạch)"],
        rows: [
          ["Bắc đường — tây", "Terraced houses", "= (không đổi)", "= (không đổi)"],
          ["Bắc đường — đông", "Factory", "Shopping centre + car park", "Car park → public park"],
          ["Nam đường — tây", "Fish market", "Maritime museum", "="],
          ["Nam đường — giữa", "Warehouses", "Apartments", "="],
          ["Nam đường — đông", "Docks", "Marina", "= + footbridge qua sông, cạnh marina"],
          ["Rìa tây", "Railway", "=", "→ Tram line"],
          ["**Xu hướng chung**", "cảng công nghiệp", "khu ở + giải trí", "xanh hơn, ít phụ thuộc ô tô"],
        ],
      },
      {
        t: "examples",
        items: [
          { en: "The three maps show how the port town of Saltby changed between 1980 and the present day, and how it is planned to develop by 2040.", vi: "[Mở bài] Ba bản đồ cho thấy thị trấn cảng Saltby đã thay đổi thế nào từ 1980 tới nay, và được quy hoạch phát triển ra sao đến năm 2040." },
          { en: "Overall, the town has been transformed from an industrial port into a residential and leisure area, and the future plans will make it greener and easier to get around without a car.", vi: "[Tổng quan — một ý cho quãng đã qua, một ý cho kế hoạch] Nhìn chung, thị trấn đã chuyển từ cảng công nghiệp thành khu dân cư và giải trí, và kế hoạch tương lai sẽ khiến nó xanh hơn, dễ đi lại hơn khi không có ô tô." },
          { en: "In 1980, the area south of the main road was used for trade, with a fish market, warehouses and docks along the river. Since then, all three have been redeveloped: the market has been converted into a maritime museum, the warehouses have been replaced by apartments, and the docks have become a marina. North of the road, the factory was demolished to make way for a shopping centre and a car park, whereas the terraced houses have remained unchanged.", vi: "[Thân 1 — 1980 → nay] Năm 1980, khu phía nam đường chính dùng cho buôn bán, với chợ cá, nhà kho và bến tàu dọc sông. Từ đó tới nay, cả ba đã được xây lại: chợ thành bảo tàng hàng hải, nhà kho được thay bằng chung cư, bến tàu thành bến du thuyền. Phía bắc đường, nhà máy bị phá để nhường chỗ cho trung tâm mua sắm và bãi đỗ xe, còn dãy nhà liền kề vẫn giữ nguyên." },
          { en: "By 2040, the car park is going to be turned into a public park, and the railway line on the western edge of the town will be replaced by a tram line. In addition, a footbridge is planned across the river, next to the marina.", vi: "[Thân 2 — nay → 2040] Đến năm 2040, bãi đỗ xe sẽ được chuyển thành công viên công cộng, và tuyến đường sắt ở rìa tây thị trấn sẽ được thay bằng tuyến tàu điện. Ngoài ra, một cây cầu đi bộ được quy hoạch bắc qua sông, cạnh bến du thuyền." },
        ],
      },
      {
        t: "table",
        caption: "Bài mẫu ba mốc: 182 từ — ước tính band 6–6.5. Cùng ý, viết kiểu band 5 thì thế nào?",
        head: ["Chỗ", "Band 5", "Band 6 (bài mẫu)"],
        rows: [
          ["Overview", "Overall, there are many changes in the three maps.", "…transformed **from** an industrial port **into** a residential and leisure area, **and the future plans will**…"],
          ["Thì quá khứ → nay", "~~The market converted to a museum.~~ · ~~The houses has been remained.~~", "The market **has been converted into** a museum. · The houses **have remained** unchanged."],
          ["Gói hai thay đổi", "The factory was demolished. A shopping centre was built.", "The factory **was demolished to make way for** a shopping centre and a car park."],
          ["Thì tương lai", "~~In 2040 the car park was a public park.~~", "By 2040, the car park **is going to be turned into** a public park."],
          ["Vị trí", "~~in the left~~ · ~~in the down of the map~~", "**south of** the main road · **on the western edge of** the town · **next to** the marina"],
          ["Tổ chức", "Đoạn 1 tả hết bản đồ 1, đoạn 2 tả hết bản đồ 2, đoạn 3 tả hết bản đồ 3", "Thân 1: 1980 → nay (theo vùng nam / bắc) · Thân 2: nay → 2040"],
        ],
      },

      /* ── 7 ── */
      { t: "h", text: "7. Map chọn địa điểm S1 / S2 — viết trọn bài" },
      {
        t: "p",
        text: "Tập 2 Ngày 22 (mục 3c) đã cho bạn một hộp nhập: một bản đồ, hai vị trí đề xuất, hiện tại đơn + would / could, mỗi vị trí một khổ. Hôm nay viết **trọn** bài band 6. Điểm phải nhớ: đây vẫn là **Task 1** — bạn **tả và so sánh**, không **khuyên** chọn chỗ nào. Ưu – nhược chỉ được suy từ thứ **nhìn thấy trên bản đồ** (gần gì, rộng hẹp, có đường nào).",
      },
      {
        t: "p",
        text: "**Đề:** The map below shows two possible sites, S1 and S2, for a new sports centre in the town of Halden. Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.",
      },
      {
        t: "figure",
        fig: {
          kind: "map",
          title: "Two possible sites (S1 and S2) for a new sports centre in Halden",
          note: "Bản đồ tự đặt cho bài luyện. Phía Bắc ở trên cùng.",
          map: {
            cols: 14,
            rows: 10,
            paths: [
              { x: 0.2, y: 4.4, w: 10.2, h: 1.1, label: "High Street" },
              { x: 10.6, y: 0.2, w: 0.8, h: 9.6, label: "Ring road" },
            ],
            boxes: [
              { x: 0.4, y: 0.4, w: 3.6, h: 3.6, label: "Housing" },
              { x: 4.3, y: 0.4, w: 3.2, h: 3.6, label: "Town centre" },
              { x: 7.8, y: 0.4, w: 2.5, h: 3.6, label: "School" },
              { x: 0.4, y: 5.9, w: 2.6, h: 3.7, label: "Park" },
              { x: 3.3, y: 5.9, w: 2.0, h: 2.0, label: "S1" },
              { x: 3.3, y: 8.2, w: 2.0, h: 1.4, label: "Car park" },
              { x: 5.6, y: 5.9, w: 2.4, h: 3.7, label: "Housing" },
              { x: 8.3, y: 5.9, w: 2.0, h: 3.7, label: "Industrial estate" },
              { x: 11.7, y: 0.4, w: 2.1, h: 4.4, label: "Farmland" },
              { x: 11.7, y: 5.2, w: 2.1, h: 4.4, label: "S2" },
            ],
            pins: [{ x: 4.4, y: 4.95, label: "Bus station" }],
          },
        },
      },
      {
        t: "table",
        caption: "Bảng so sánh hai vị trí — lập trước khi viết",
        head: ["Tiêu chí", "S1", "S2"],
        rows: [
          ["Vị trí", "Giữa thị trấn, nam High Street, đối diện town centre", "Rìa đông, bên ngoài ring road"],
          ["Xung quanh", "Park (tây) · housing (đông) · car park nhỏ (nam) · bus station gần", "Farmland (bắc) · industrial estate bên kia ring road"],
          ["Diện tích", "Nhỏ", "Lớn khoảng gấp đôi"],
          ["Đi lại", "Đi bộ được, có xe buýt", "Chủ yếu bằng ô tô (ring road)"],
          ["Hệ quả (would / could)", "Tiện cho cư dân; ít chỗ cho sân ngoài trời / đỗ xe", "Đủ chỗ cho sân ngoài trời; xa nhà ở và trường"],
          ["**Khác biệt chính** (→ overview)", "nhỏ – trung tâm – gần dân", "rộng – ngoại vi – tiện ô tô"],
        ],
      },
      {
        t: "patterns",
        rows: [
          {
            formula: "Overall, the main difference is that S1 is + …, whereas S2 is + …",
            vi: "Overview: khác biệt CHÍNH giữa hai vị trí — không nói chỗ nào tốt hơn.",
            examples: [{ en: "Overall, the main difference is that S1 is a small site in the middle of the town, whereas S2 is a much larger site on the eastern outskirts.", vi: "Nhìn chung, khác biệt chính là S1 là khu đất nhỏ giữa thị trấn, còn S2 là khu đất rộng hơn nhiều ở ngoại vi phía đông." }],
          },
          {
            formula: "A + công trình + here would + V … / Because it is + adj-er, it could + V …",
            vi: "Hệ quả NẾU xây ở đó: would (gần như chắc), could (có thể). Không dùng will — chưa ai quyết định.",
            examples: [
              { en: "A sports centre here would be within walking distance for most residents.", vi: "Một trung tâm thể thao ở đây sẽ nằm trong khoảng đi bộ được với phần lớn cư dân." },
              { en: "Because it is roughly twice the size of S1, it could accommodate outdoor facilities.", vi: "Vì rộng khoảng gấp đôi S1, nó có thể chứa được các công trình ngoài trời." },
            ],
          },
          {
            formula: "However, / On the other hand, S + is + …, so + S + would + V …",
            vi: "Chuyển từ ưu sang nhược trong cùng một khổ.",
            examples: [{ en: "On the other hand, it is some distance from the nearest housing, so few people would be able to walk there.", vi: "Mặt khác, nó cách khu nhà ở gần nhất khá xa, nên ít người có thể đi bộ tới đó." }],
          },
        ],
      },
      {
        t: "sodo",
        kind: "compare",
        title: "Cùng một đề — hai bài viết",
        cols: [
          {
            title: "Bài band 5 (137 từ — thiếu từ)",
            items: [
              "The map shows two sites for a new sports centre in Halden town. They are S1 and S2.",
              "S1 was built in the south of the High Street. It is near the town centre and the park and the housing and the bus station. It is small. S2 was built in the east of the town. It is near the ring road and the farmland and the industrial estate. It is big.",
              "I think S1 is better than S2 because many people live near S1 and they can walk to there. S2 is far, people must go by car, it is not good for environment. But S2 is bigger so it has more space for the sports.",
              "In conclusion, the town should choose S1 for the new sports centre because it is more convenient for the people.",
            ],
          },
          {
            title: "Bài band 6 (206 từ)",
            items: [
              "The map shows two possible locations, S1 and S2, for a new sports centre in the town of Halden.",
              "Overall, the main difference is that S1 is a small site in the middle of the town, close to housing and public transport, whereas S2 is a much larger site on the eastern outskirts, beyond the ring road.",
              "S1 is situated on the south side of the High Street, directly opposite the town centre, with a park to its west and a residential area to its east. A sports centre here would be within walking distance for most residents, and the bus station is only a short distance away. However, the site is relatively small and the only parking is a small car park to the south, so there would be little room for outdoor pitches.",
              "S2, by contrast, lies to the east of the ring road, next to farmland and across the road from an industrial estate. Because it is roughly twice the size of S1, it could accommodate both a large building and outdoor facilities, and drivers could reach it easily. On the other hand, it is some distance from the nearest housing and the school, so few people would be able to walk there.",
            ],
          },
        ],
        caption: "Band ước tính. Bài band 6 nêu ưu – nhược của CẢ HAI vị trí bằng would / could và dừng ở đó — không có câu “the town should choose…”.",
      },
      {
        t: "table",
        caption: "Vì sao hai bài khác band — theo 4 tiêu chí",
        head: ["Tiêu chí", "Bài band 5", "Bài band 6"],
        rows: [
          ["**TA**", "Không overview; **đưa ý kiến và lời khuyên** (I think S1 is better… the town should choose S1) — đề không hỏi; suy diễn ngoài bản đồ (not good for environment); dưới 150 từ", "Overview = khác biệt chính; mỗi vị trí đủ: ở đâu, cạnh gì, rộng hẹp, đi lại; ưu – nhược chỉ từ thứ có trên bản đồ; không chọn bên"],
          ["**CC**", "S1 và S2 dồn một đoạn; and… and… and; It is… It is…", "Thân 1 = S1, thân 2 = S2; whereas · However · by contrast · Because · On the other hand · so"],
          ["**LR**", "near × 2, big / small, far", "is situated · directly opposite · a residential area · within walking distance · on the eastern outskirts · beyond · accommodate · outdoor pitches"],
          ["**GRA**", "~~S1 was built~~ (chưa có gì được xây); comma splice (S2 is far, people must go by car, it is…); ~~walk to there~~", "Hiện tại đơn cho vị trí; would / could cho hệ quả; with + N (with a park to its west); câu phức Because…, so…"],
        ],
      },
      {
        t: "note",
        title: "⚠️ Cẩn thận ba chỗ ở bài chọn địa điểm",
        items: [
          "**Không quá khứ, không will**: S1 **is located**… A centre here **would**… — vì chưa có gì được xây và chưa ai quyết.",
          "**Không khuyên**: mọi câu có should / I think / the best choice là lạc khỏi Task 1. (Đề Academic Task 1 chỉ yêu cầu tả và so sánh; một bài tập bắt bạn CHỌN thì không phải Task 1.)",
          "**Phương hướng**: to the north **of** · **in** the north **of** (nằm trong) · **on** the outskirts / the edge · **across** the road **from** · **between** A **and** B. Tránh left / right / top / bottom.",
        ],
      },
      { t: "rule", formula: "S1 is situated / lies + vị trí · A … here would + V · Because it is …, it could + V · Overall, the main difference is that S1 …, whereas S2 …", vi: "Map chọn địa điểm: hiện tại đơn + would / could; thân 1 = S1, thân 2 = S2; không ý kiến." },
      {
        t: "quiz",
        id: "t3d28-map-dich",
        title: "Dịch sang tiếng Anh — câu bản đồ ba mốc và chọn địa điểm (6 câu)",
        kind: "translate",
        grammar: "has been converted into · was demolished to make way for · is going to be turned into · will be replaced by · is situated … opposite · would be within walking distance",
        items: [
          { q: "Từ đó đến nay, chợ cá đã được chuyển thành một bảo tàng.", hint: "Since then · the fish market · has been converted into", answers: ["Since then, the fish market has been converted into a museum.", "Since then the fish market has been converted into a museum.", "Since then, the fish market has been turned into a museum."] },
          { q: "Nhà máy đã bị phá để nhường chỗ cho một trung tâm mua sắm.", hint: "was demolished · to make way for", answers: ["The factory was demolished to make way for a shopping centre.", "The factory was knocked down to make way for a shopping centre.", "The factory was demolished to make way for a shopping center."] },
          { q: "Đến năm 2040, bãi đỗ xe sẽ được chuyển thành một công viên.", hint: "By 2040 · is going to be turned into", answers: ["By 2040, the car park is going to be turned into a park.", "By 2040, the car park will be turned into a park.", "By 2040 the car park is going to be turned into a park.", "By 2040, the car park is going to be converted into a park.", "By 2040, the car park will be converted into a park."] },
          { q: "Tuyến đường sắt sẽ được thay bằng một tuyến tàu điện.", hint: "The railway line · will be replaced by · a tram line", answers: ["The railway line will be replaced by a tram line.", "The railway will be replaced by a tram line.", "The railway line is going to be replaced by a tram line."] },
          { q: "S1 nằm đối diện trung tâm thị trấn.", hint: "is situated · opposite the town centre", answers: ["S1 is situated opposite the town centre.", "S1 is located opposite the town centre.", "S1 lies opposite the town centre.", "S1 is situated directly opposite the town centre.", "S1 is situated opposite the town center."] },
          { q: "Một trung tâm thể thao ở đây sẽ nằm trong khoảng đi bộ được với phần lớn cư dân.", hint: "A sports centre here · would be within walking distance for · most residents", answers: ["A sports centre here would be within walking distance for most residents.", "A sports centre here would be within walking distance of most residents.", "A sports center here would be within walking distance for most residents."] },
        ],
      },

      /* ── 8 ── */
      { t: "h", text: "8. Lỗi mất điểm + bảng tự soát 2 phút" },
      {
        t: "table",
        caption: "Bảng tự soát riêng cho process / map (dùng cùng bảng 6 lượt của Ngày 27)",
        head: ["Kiểm", "Process", "Map ba mốc", "Map S1 / S2"],
        rows: [
          ["Overview", "loại + số bước + đầu – cuối", "xu hướng đã qua + hướng kế hoạch", "khác biệt chính, có whereas"],
          ["Đủ nội dung", "đủ MỌI bước, không bịa bước", "mọi ô thay đổi + thứ không đổi", "mỗi vị trí: ở đâu · cạnh gì · rộng hẹp · đi lại"],
          ["Thì", "hiện tại đơn bị động", "quá khứ → HTHT → tương lai, có cụm thời gian", "hiện tại đơn + would / could"],
          ["Lượt 1 — động từ", "đủ **be** trước V3?", "remain / become không bị động", "không was built, không will"],
          ["Không được có", "ý kiến, kết luận, số tự bịa", "lý do thay đổi tự suy (“because tourism grew”)", "lời khuyên chọn chỗ nào"],
          ["Độ dài", "160–190 từ", "160–190 từ", "160–190 từ"],
        ],
      },
      {
        t: "mcq",
        id: "t3d28-viet-chon",
        title: "Chọn câu tốt nhất (8 câu)",
        items: [
          { q: "1. Overview tốt nhất cho một sơ đồ làm gạch gồm 7 bước:", options: ["Overall, there are seven steps in the diagram.", "Overall, bricks are very useful for building houses.", "Overall, this is a linear process consisting of seven stages, which begins with digging clay and ends with the delivery of the finished bricks.", "Overall, first the clay is dug and then it is mixed."], correct: 2, why: "Đủ ba thành phần: loại quy trình + số giai đoạn + đầu – cuối. A chỉ đếm; B là ý kiến; D là chi tiết thân bài." },
          { q: "2. Câu nào nêu mục đích ĐÚNG ngữ pháp?", options: ["The clay is heated for remove the water.", "The clay is heated in order to remove the water.", "The clay is heated so that remove the water.", "The clay is heated to allow the water removes."], correct: 1, why: "in order to + V. so that cần S + V; to allow + N + to V." },
          { q: "3. Sơ đồ ghi “cut — wire cutter”. Câu nào đúng?", options: ["The clay is cut by a wire cutter into bricks, which takes two hours.", "The clay cut with a wire cutter.", "A wire cutter is cut the clay.", "The clay is cut into bricks with a wire cutter."], correct: 3, why: "Dụng cụ → with. A bịa “two hours”; B thiếu be; C sai bị động." },
          { q: "4. Câu gộp bước nào KHÔNG bị dangling?", options: ["After being dried, the bricks are fired in a kiln.", "After being dried, workers fire the bricks in a kiln.", "After drying, a kiln fires the bricks.", "After being dried, the kiln is used."], correct: 0, why: "Thứ được làm khô là the bricks = chủ ngữ mệnh đề chính." },
          { q: "5. Map ba mốc — câu nào đúng cho kế hoạch 2040?", options: ["The car park was turned into a park in 2040.", "The car park has been turned into a park by 2040.", "The car park is going to be turned into a park by 2040.", "The car park turns into a park in 2040."], correct: 2, why: "Kế hoạch tương lai → is going to be / will be + V3." },
          { q: "6. Câu nào đúng cho thay đổi từ 1980 đến NAY?", options: ["The docks have been become a marina.", "The docks have become a marina.", "The docks was become a marina.", "The docks will become a marina."], correct: 1, why: "become không có bị động; quá khứ → nay dùng hiện tại hoàn thành: have become." },
          { q: "7. Map chọn địa điểm — câu nào đúng?", options: ["S2 lies to the east of the ring road, next to farmland.", "S2 was built to the east of the ring road.", "S2 will lie in the east of the ring road and it is the best.", "S2 is laying in the east of ring road."], correct: 0, why: "Hiện tại đơn; lie (nằm) – lies; to the east of. B: chưa xây; C: will + ý kiến; D: lay ≠ lie." },
          { q: "8. Câu nào KHÔNG nên có trong bài chọn địa điểm?", options: ["A centre here would be easy to reach by bus.", "However, there would be little room for parking.", "S2 is roughly twice the size of S1.", "Therefore, the council should build the centre at S1."], correct: 3, why: "Lời khuyên chọn chỗ là ý kiến — Task 1 chỉ tả và so sánh." },
        ],
      },

      /* ── 9 ── */
      { t: "h", text: "9. Tự viết — AI chấm 4 tiêu chí" },
      {
        t: "p",
        text: "Hai đề, mỗi đề **20 phút**, 160–190 từ. Làm đúng thứ tự: 2 phút phân tích (bảng câu hỏi ở mục 5 / bảng so sánh ở mục 7) → 15 phút viết → 3 phút soát (lượt 1 động từ + lượt 3 ranh giới câu + bảng ở mục 8). **Đề 1 — process.**",
      },
      {
        t: "figure",
        fig: {
          kind: "process",
          title: "How black tea is produced",
          note: "Quy trình tự đặt cho bài luyện (giản lược từ quy trình thật).",
          steps: [
            { label: "Leaves picked", note: "by hand · top two leaves and bud only" },
            { label: "Spread on racks (withering)", note: "12–18 hours · warm air · leaves lose moisture and soften" },
            { label: "Rolled", note: "by machine · cell walls broken, juices released" },
            { label: "Left in cool, damp room (oxidation)", note: "2–3 hours · leaves turn from green to dark brown" },
            { label: "Dried", note: "hot-air oven · stops oxidation" },
            { label: "Sorted by size", note: "sieves · whole leaves separated from broken pieces" },
            { label: "Packed", note: "foil-lined chests · keeps out moisture" },
            { label: "Shipped to tea companies", note: "blended and sold" },
          ],
        },
      },
      {
        t: "note",
        title: "💡 Gợi ý đọc sơ đồ trà (đừng xem nếu muốn tự làm)",
        items: [
          "Loại: **linear**, 8 giai đoạn; đầu = hái lá; cuối = gửi tới các công ty trà.",
          "Chỗ đổi pha: sau bước 4 (lá đã đổi màu) → thân 1 = bước 1–4 (xử lý lá tươi), thân 2 = bước 5–8 (sấy, phân loại, đóng gói).",
          "Chú thích thành mục đích: **so that** they lose moisture and soften · **in order to** break the cell walls · **to stop** oxidation · **to keep out** moisture.",
          "Số liệu có trong hình thì được dùng: for 12 to 18 hours · for two to three hours. by hand / by machine; **in** a hot-air oven; **by means of** sieves.",
        ],
      },
      {
        t: "essay",
        id: "t3d28-viet-bai-process",
        task: "Task 1",
        prompt: "The diagram shows how black tea is produced. Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.",
        minWords: 150,
        tips: [
          "Overview: loại quy trình + số giai đoạn + bắt đầu bằng… + kết thúc bằng…",
          "Chia hai thân bài ở chỗ đổi pha (sau bước 4).",
          "Nêu mục đích / cách thức ở 3–4 bước: in order to · so that · to stop · by means of.",
          "Dùng ít nhất hai khuôn gộp: After being + V3 · before being + V3 · Once … has been + V3 · where.",
          "Không ý kiến, không kết luận, không thêm bước ngoài hình.",
        ],
      },
      { t: "p", text: "**Đề 2 — map chọn địa điểm.** Lập bảng so sánh (vị trí · xung quanh · diện tích · đi lại · hệ quả) trước khi viết." },
      {
        t: "figure",
        fig: {
          kind: "map",
          title: "Two possible sites (A and B) for a new secondary school in the village of Marton",
          note: "Bản đồ tự đặt cho bài luyện. Phía Bắc ở trên cùng.",
          map: {
            cols: 12,
            rows: 10,
            paths: [
              { x: 5.6, y: 0.2, w: 0.9, h: 9.6, label: "Main road" },
              { x: 0.2, y: 8.6, w: 5.2, h: 1.1, label: "River" },
            ],
            boxes: [
              { x: 0.4, y: 0.4, w: 2.2, h: 3.2, label: "Site A" },
              { x: 2.9, y: 0.4, w: 2.4, h: 3.2, label: "Housing" },
              { x: 0.4, y: 4.0, w: 2.2, h: 2.0, label: "Primary school" },
              { x: 2.9, y: 4.0, w: 2.4, h: 2.0, label: "Village shops" },
              { x: 0.4, y: 6.4, w: 4.9, h: 1.9, label: "Playing fields" },
              { x: 6.8, y: 0.4, w: 4.8, h: 3.2, label: "Woodland" },
              { x: 6.8, y: 4.0, w: 2.2, h: 2.6, label: "Housing" },
              { x: 9.3, y: 4.0, w: 2.3, h: 5.6, label: "Site B" },
              { x: 6.8, y: 7.0, w: 2.2, h: 2.6, label: "Factory" },
            ],
            pins: [{ x: 6.05, y: 5.0, label: "Bus stop" }],
          },
        },
      },
      {
        t: "essay",
        id: "t3d28-viet-bai-map",
        task: "Task 1",
        prompt: "The map shows two possible sites, A and B, for a new secondary school in the village of Marton. Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.",
        minWords: 150,
        tips: [
          "Mở bài paraphrase đề: two possible sites → two proposed locations.",
          "Overview: Overall, the main difference is that Site A is…, whereas Site B is…",
          "Thân 1 = Site A, thân 2 = Site B: ở đâu · cạnh gì · rộng hẹp · đi lại.",
          "Hiện tại đơn cho vị trí (is situated, lies, is bordered by); would / could cho hệ quả.",
          "Không viết should / I think / the best site.",
        ],
      },
      {
        t: "note",
        title: "📌 Sau khi AI chấm",
        items: [
          "Đối chiếu bài của bạn với bảng ở mục 8. Thiếu overview hoặc có ý kiến ⇒ viết lại riêng đoạn đó, không viết lại cả bài.",
          "Ghi vào sổ lỗi: số câu bị động **thiếu be** và số chỗ **sai thì** — hai lỗi đặc trưng của dạng này.",
          "Map ba mốc chưa có đề tự viết hôm nay: tự luyện bằng cách che bài mẫu Saltby, nhìn ba bản đồ và viết lại trong 20 phút, rồi so cụm nối (luyện **tái tạo bài mẫu** — Ngày 2).",
        ],
      },
    ],
  },
  /* ═══════════════════════════ BÀI 3 — NGHE ═══════════════════════════ */
  {
    id: "t3d28-nghe",
    kind: "listening",
    title: "Nghe Part 2 + Part 4 giọng trộn (Úc · Anh): Short answer + Plan labelling + Note completion",
    goal: "Nghe liền một Part 2 (giọng Úc) và một Part 4 (giọng Anh) ở tốc độ tự nhiên và làm đúng ít nhất 14/20 câu: trả lời Short answer đúng giới hạn từ bằng chính chữ trong băng, dò sơ đồ mặt bằng theo hướng người nói, điền ghi chú bài giảng — không viết con số / địa điểm vừa được nhắc rồi bị sửa.",
    minutes: 65,
    blocks: [
      {
        t: "recap",
        title: "Bài này học gì · đẩy band nào",
        items: [
          "**Short answer questions** (ôn Tập 2 Ngày 19): câu hỏi Wh- → viết đáp án **đúng giới hạn từ**, bằng **chữ nghe được**, không viết cả câu.",
          "**Part 2 giọng Úc**: 5 câu Short answer + 5 câu **Plan labelling** (ôn Ngày 4 · 12) — một cô thủ thư giới thiệu thư viện vừa mở lại.",
          "**Part 4 giọng Anh**: 6 câu **Note completion** (ôn Ngày 13 · 24) + 4 câu Short answer — bài giảng về ngôn ngữ sắp biến mất.",
          "Hai phần phát **liền nhau, không tua** — giống nửa bài thi thật. Đích: **≥ 14/20** (mức band 6).",
          "Từ vựng của hai băng trùng với bài Từ vựng hôm nay (borrow, biography, endangered, passed on, dominant language) — học từ trước, nghe sau.",
        ],
      },

      /* ── 1 ── */
      { t: "h", text: "1. Short answer khi nghe — 4 luật" },
      {
        t: "p",
        text: "Dạng này trông dễ vì không có chỗ trống giữa câu — bạn chỉ trả lời một câu hỏi. Nhưng chính vì thế bạn dễ **viết thừa** hoặc **tự diễn đạt lại**. Máy chấm (và người chấm) chỉ nhận đáp án **nằm trong giới hạn từ** và **đúng chữ trong băng**.",
      },
      {
        t: "table",
        caption: "Từ hỏi → loại đáp án phải chờ",
        head: ["Câu hỏi mở bằng", "Chờ nghe", "Ví dụ đáp án"],
        rows: [
          ["**How many / How much / How long**", "Con số (+ đơn vị nếu đề chưa in)", "14 · three weeks · £25"],
          ["**What time / When / On which day**", "Giờ, ngày, thứ", "7.30 · Thursday · 12 May"],
          ["**What / Which + danh từ**", "Một danh từ / cụm danh từ", "telescope · language nests"],
          ["**What kind / type of**", "Tính từ + danh từ", "historical novel"],
          ["**Who / Which group**", "Người, nhóm người, chức danh", "young people · volunteers"],
          ["**Where**", "Nơi chốn (thường kèm giới từ trong băng — không cần chép giới từ)", "information desk"],
          ["**Why**", "Một cụm danh từ hoặc V-ing ngắn (hiếm gặp)", "building work"],
        ],
      },
      {
        t: "sodo",
        kind: "flow",
        title: "4 bước — làm trong 30 giây đọc đề",
        steps: [
          { label: "① Khoanh giới hạn từ", sub: "NO MORE THAN TWO WORDS AND/OR A NUMBER ⇒ tối đa 2 từ + 1 số" },
          { label: "② Gạch từ hỏi", sub: "How many → số; What kind of → loại gì" },
          { label: "③ Gạch từ khoá còn lại", sub: "tên riêng, năm, danh từ chính — băng sẽ nói lại bằng từ KHÁC" },
          { label: "④ Nghe: chép chữ trong băng", sub: "không đổi dạng từ; nghe bị sửa thì lấy thông tin SAU" },
        ],
      },
      {
        t: "note",
        title: "⚠️ Người Việt hay sai ở Short answer",
        items: [
          "**Viết cả câu**: “The library closes at eight” cho câu “What time…?” → vượt giới hạn, mất điểm dù đúng ý. Chỉ viết **8** / **eight**.",
          "**a / the cũng là một từ**: giới hạn TWO WORDS mà viết “the language nests” là ba từ → sai. Bỏ mạo từ.",
          "**Tự dịch ý**: băng nói “proof of address”, bạn viết “address paper” → sai. Chép chữ nghe được.",
          "**Viết con số bị gạt đi**: “the plan was nine months, but in the end it took **fourteen**” → đáp án là 14 (ôn Ngày 9: bẫy đổi ý).",
          "**Số ít / số nhiều**: nghe “language nests” mà viết “language nest” là sai. Âm /s/ cuối rất nhỏ — nghe kỹ, và kiểm bằng ngữ pháp câu hỏi (What name was given to the **pre-schools**? → số nhiều).",
        ],
      },
      { t: "rule", formula: "Từ hỏi → loại đáp án · đếm từ (a / the cũng tính) · chép CHỮ TRONG BĂNG · thông tin bị sửa ⇒ lấy cái nói SAU", vi: "Số có thể viết bằng chữ số (14) — nhanh hơn và không lo chính tả." },

      /* ── 2 ── */
      { t: "h", text: "2. Khởi động — tin nhắn câu lạc bộ sách (4 câu, giọng Mỹ)" },
      {
        t: "p",
        text: "Đọc 4 câu hỏi trong 20 giây, gạch từ hỏi, rồi nghe **một lần**. Giới hạn: **NO MORE THAN TWO WORDS AND/OR A NUMBER**.",
      },
      {
        t: "table",
        caption: "Questions 1–4 (đọc trước)",
        head: ["Câu", "Question"],
        rows: [
          ["1", "On which day will the next meeting be held?"],
          ["2", "What time will the meeting begin?"],
          ["3", "What kind of book is The Salt Road?"],
          ["4", "What should each member bring for the author?"],
        ],
      },
      {
        t: "listen",
        id: "t3d28-nghe-khoi-dong",
        title: "Riverside Book Club — a voicemail message",
        dan: { so: "Day 28, Warm-up", boiCanh: "a recorded message for members of a book club.", cau: [1, 4] },
        note: "Khoảng 45 giây, giọng Mỹ (nữ). Có hai thông tin bị đổi — lấy thông tin sau.",
        lines: [
          { who: "Organiser", voice: "us-nu", text: "Hi, this is a message for members of the Riverside Book Club. Our next meeting has been moved from Tuesday to Thursday the fourteenth, because the community hall is being painted.", vi: "Chào mọi người, đây là tin nhắn cho thành viên Câu lạc bộ Sách Riverside. Buổi họp tới đã dời từ thứ Ba sang thứ Năm ngày 14, vì hội trường cộng đồng đang được sơn lại." },
          { who: "Organiser", voice: "us-nu", text: "We'll start at seven thirty, not seven as usual. This month's book is The Salt Road. It's a historical novel, about four hundred pages long, so do start early.", vi: "Chúng ta sẽ bắt đầu lúc bảy rưỡi, không phải bảy giờ như thường lệ. Sách tháng này là The Salt Road. Đó là một tiểu thuyết lịch sử, dài khoảng bốn trăm trang, nên hãy đọc sớm." },
          { who: "Organiser", voice: "us-nu", text: "The author herself is joining us by video for the last half hour, so please bring at least one question for her. Oh, and the library has six copies if you'd rather not buy it. See you there!", vi: "Chính tác giả sẽ tham gia qua video trong nửa giờ cuối, nên xin mỗi người mang ít nhất một câu hỏi cho cô ấy. À, thư viện có sáu bản nếu bạn không muốn mua. Hẹn gặp nhé!" },
        ],
      },
      {
        t: "quiz",
        id: "t3d28-nghe-kd-cau",
        title: "Questions 1–4 — NO MORE THAN TWO WORDS AND/OR A NUMBER",
        kind: "fill",
        items: [
          { q: "1. On which day will the next meeting be held?", answers: ["Thursday", "Thursday 14", "Thursday 14th", "Thursday the 14th"] },
          { q: "2. What time will the meeting begin?", answers: ["7.30", "7:30", "seven thirty", "7.30 pm", "7:30 pm", "7.30pm", "7:30pm"] },
          { q: "3. What kind of book is The Salt Road?", answers: ["historical novel"] },
          { q: "4. What should each member bring for the author?", answers: ["question", "a question", "one question", "1 question"] },
        ],
      },
      {
        t: "note",
        title: "Giải thích phần khởi động",
        items: [
          "**1 Thursday** — “moved **from Tuesday to Thursday** the fourteenth”. Tuesday là ngày CŨ.",
          "**2 7.30** — “We'll start at **seven thirty, not seven** as usual”. Số bị phủ nhận đứng SAU số đúng — vẫn là bẫy.",
          "**3 historical novel** — câu hỏi What kind of ⇒ tính từ + danh từ. Viết “novel” thôi là thiếu; viết “a historical novel” là 3 từ ⇒ vượt giới hạn, bị chấm sai.",
          "**4 question / one question** — “bring **at least one question** for her”. “six copies” là của thư viện, không phải thứ thành viên mang.",
        ],
      },

      /* ── 3 ── */
      { t: "h", text: "3. Ôn nhanh Plan labelling (Ngày 4 · 12) — trước khi nghe Part 2" },
      {
        t: "table",
        caption: "Ba việc trong 30 giây đọc sơ đồ",
        head: ["Việc", "Làm thế nào"],
        rows: [
          ["① Tìm **điểm đứng** và **hướng nhìn**", "“You're standing in the entrance hall, facing north” ⇒ trái của bạn = phía tây của sơ đồ. Dùng bút chỉ vào chỗ đó."],
          ["② Đọc các **mốc đã có tên**", "Main doors, Information desk, Stairs — người nói sẽ đi từ mốc này sang mốc kia."],
          ["③ Nhẩm trước **từ chỉ vị trí**", "in the corner · the first room on your left · go past · at the far end · side by side · directly beyond · opposite"],
        ],
      },
      {
        t: "note",
        title: "💡 Mẹo: người nói đi theo một đường — đừng nhảy cóc",
        items: [
          "Các câu 16–20 **không** theo thứ tự chữ cái A–G nhưng theo **thứ tự người nói đi**. Lỡ một phòng thì bỏ, bám vào mốc kế tiếp.",
          "Phòng “**used to be** here / **we planned** to put it upstairs” là vị trí CŨ hoặc dự định — không phải đáp án.",
          "Giọng Úc: nguyên âm trong **day, eight, later** nghe gần “dai, ait”; **r** cuối từ không đọc (corner → /ˈkɔːnə/). Số **eight** dễ nghe thành “ite”.",
        ],
      },

      /* ── 4 ── */
      { t: "h", text: "4. Bài chính — Part 2, Questions 11–20 (giọng Úc)" },
      {
        t: "p",
        text: "Bạn có **30 giây** đọc câu 11–15 và **30 giây** xem sơ đồ cho câu 16–20. Băng phát **một lần**. Câu 11–15: **NO MORE THAN THREE WORDS AND/OR A NUMBER**.",
      },
      {
        t: "table",
        caption: "Questions 11–15 — Answer the questions (đọc trước)",
        head: ["Câu", "Question"],
        rows: [
          ["11", "For how many months was the library closed?"],
          ["12", "What time does the library now close on Wednesdays?"],
          ["13", "What must people bring in order to get a library card?"],
          ["14", "What is the maximum number of items a member can borrow?"],
          ["15", "Which object in the “Library of Things” has been borrowed most?"],
        ],
      },
      {
        t: "figure",
        fig: {
          kind: "map",
          title: "Harbour Street Library, ground floor — ghi chữ cái A–G cho câu 16–20",
          note: "Sơ đồ tự vẽ cho bài luyện. Phía trên là hướng Bắc. Bạn đứng ở sảnh, ngay trong cửa chính (phía Nam), mặt quay về hướng Bắc.",
          map: {
            cols: 12,
            rows: 9,
            paths: [{ x: 4.4, y: 2.6, w: 3.2, h: 5.2, label: "Entrance hall" }],
            boxes: [
              { x: 4.8, y: 7.9, w: 2.4, h: 0.9, label: "Main doors" },
              { x: 0.3, y: 5.8, w: 3.8, h: 2.9, blank: "A" },
              { x: 0.3, y: 3.2, w: 3.8, h: 2.3, blank: "B" },
              { x: 0.3, y: 0.3, w: 3.8, h: 2.6, blank: "C" },
              { x: 4.4, y: 0.3, w: 1.5, h: 2.0, blank: "D" },
              { x: 6.1, y: 0.3, w: 1.5, h: 2.0, blank: "E" },
              { x: 7.9, y: 0.3, w: 3.8, h: 2.0, label: "Stairs" },
              { x: 7.9, y: 2.6, w: 3.8, h: 2.9, blank: "F" },
              { x: 7.9, y: 5.8, w: 3.8, h: 2.9, blank: "G" },
            ],
            pins: [
              { x: 6.0, y: 5.0, label: "Information desk" },
              { x: 6.0, y: 7.4, label: "You are here" },
            ],
          },
        },
      },
      {
        t: "table",
        caption: "Questions 16–20 — Label the plan. Write the correct letter, A–G (đọc trước)",
        head: ["Câu", "Địa điểm", "Chữ cái"],
        rows: [
          ["16", "Children's library", "___"],
          ["17", "Café", "___"],
          ["18", "Computer suite", "___"],
          ["19", "Quiet study room", "___"],
          ["20", "Library of Things", "___"],
        ],
      },
      {
        t: "listen",
        id: "t3d28-nghe-p2",
        title: "Welcome to Harbour Street Library",
        dan: { so: "Day 28, Recording 1 (Listening Part 2)", boiCanh: "a librarian talking to a group of new members about a library that has recently reopened.", cau: [11, 20] },
        note: "Khoảng 4 phút, giọng Úc (nữ). Giữa bài có một quãng ngắn để bạn chuyển sang sơ đồ.",
        lines: [
          { who: "Librarian", voice: "au-nu", text: "Good morning, everyone, and welcome to Harbour Street Library. My name's Priya, and I'm one of the librarians here. As you probably know, we reopened last month after the building work. The plan was to close for nine months, but in the end it took fourteen, so thank you all for your patience.", vi: "Chào buổi sáng mọi người, chào mừng tới Thư viện Harbour Street. Tôi là Priya, một trong các thủ thư ở đây. Như mọi người biết, chúng tôi mở lại tháng trước sau đợt xây sửa. Kế hoạch là đóng cửa chín tháng, nhưng cuối cùng mất tới mười bốn tháng, nên xin cảm ơn sự kiên nhẫn của mọi người." },
          { who: "Librarian", voice: "au-nu", text: "Let me start with a few practical things. Our opening hours have changed. We used to close at six every day. Now we stay open until eight in the evening from Monday to Thursday. On Fridays and Saturdays we still close at six, and I'm afraid we're closed all day on Sundays.", vi: "Tôi bắt đầu bằng vài việc thực tế. Giờ mở cửa đã thay đổi. Trước đây ngày nào chúng tôi cũng đóng cửa lúc sáu giờ. Bây giờ từ thứ Hai tới thứ Năm chúng tôi mở tới tám giờ tối. Thứ Sáu và thứ Bảy vẫn đóng lúc sáu giờ, và rất tiếc Chủ nhật đóng cả ngày." },
          { who: "Librarian", voice: "au-nu", text: "Joining is free. To get a library card, you only need to bring one thing with you, and that's proof of address: a recent electricity bill, for example. You don't need photo ID any more, although a lot of people still turn up with their passport.", vi: "Đăng ký miễn phí. Để làm thẻ thư viện, bạn chỉ cần mang một thứ, đó là giấy tờ chứng minh địa chỉ: hoá đơn tiền điện gần đây chẳng hạn. Không cần giấy tờ có ảnh nữa, dù nhiều người vẫn mang hộ chiếu tới." },
          { who: "Librarian", voice: "au-nu", text: "With your card you can borrow up to twelve items at a time. It used to be eight, so that's a big improvement. And you can keep them for three weeks.", vi: "Với thẻ, bạn mượn được tối đa mười hai món một lần. Trước đây là tám, nên đó là cải thiện lớn. Và bạn được giữ ba tuần." },
          { who: "Librarian", voice: "au-nu", text: "Something completely new is what we call the Library of Things. The idea is that you can borrow objects, not just books. At the moment we lend out sewing machines and garden tools, and musical instruments are coming next year. The most popular item so far, by a long way, has been the telescope. There's already a waiting list for it.", vi: "Một thứ hoàn toàn mới là “Thư viện Đồ vật”. Ý tưởng là bạn mượn được đồ vật chứ không chỉ sách. Hiện chúng tôi cho mượn máy khâu và dụng cụ làm vườn, năm sau sẽ có nhạc cụ. Món được mượn nhiều nhất tới giờ, bỏ xa các món khác, là kính thiên văn. Đã có danh sách chờ rồi." },
          { who: "Librarian", voice: "au-nu", text: "We also run more events than before. For adults, the book club meets on the first Wednesday of every month. The next book is a biography, by the way. And from next month there'll be a weekly conversation group for people who are learning English, run by volunteers.", vi: "Chúng tôi cũng tổ chức nhiều sự kiện hơn trước. Với người lớn, câu lạc bộ sách họp vào thứ Tư đầu tiên mỗi tháng. Nhân tiện, cuốn tới là một cuốn tiểu sử. Và từ tháng sau sẽ có nhóm trò chuyện hằng tuần cho người đang học tiếng Anh, do tình nguyện viên phụ trách." },
          { who: "Librarian", voice: "au-nu", text: "Now, let me explain where everything is, because the layout has changed completely. You're standing in the entrance hall, just inside the main doors, facing north. The information desk is right in front of you, in the middle of the hall.", vi: "Giờ tôi giải thích mọi thứ nằm ở đâu, vì cách bố trí đã thay đổi hoàn toàn. Mọi người đang đứng ở sảnh, ngay trong cửa chính, mặt quay về hướng bắc. Quầy thông tin ở ngay trước mặt, giữa sảnh." },
          { who: "Librarian", voice: "au-nu", text: "Let's start on your left. The room in the corner beside the main doors, with the big windows onto the street, is the newspaper lounge. That's where the children's library used to be. Go past the lounge, and past the toilets in the middle of that side, and you come to the children's library. It's now the large room in the far left-hand corner, as far as possible from the quiet areas.", vi: "Bắt đầu từ bên trái. Căn phòng ở góc cạnh cửa chính, có cửa sổ lớn nhìn ra phố, là phòng đọc báo. Trước đây thư viện thiếu nhi nằm ở đó. Đi qua phòng đọc báo, qua nhà vệ sinh ở giữa phía đó, là tới thư viện thiếu nhi. Giờ nó là căn phòng lớn ở góc xa bên trái, xa các khu yên tĩnh nhất có thể." },
          { who: "Librarian", voice: "au-nu", text: "Now the other side. On your right as you come in, the room in the corner next to the main doors is the café. That's new, and it's open all day. Directly beyond the café, still on the right-hand side, is the computer suite. We originally planned to put the computers upstairs, but the cabling made that impossible.", vi: "Giờ tới phía bên kia. Bên phải khi bạn bước vào, căn phòng ở góc cạnh cửa chính là quán cà phê. Đó là phòng mới, mở cả ngày. Ngay phía sau quán cà phê, vẫn ở bên phải, là phòng máy tính. Ban đầu chúng tôi định đặt máy tính trên lầu, nhưng việc đi dây khiến điều đó bất khả thi." },
          { who: "Librarian", voice: "au-nu", text: "At the far end of the hall, straight ahead past the information desk, there are two small rooms side by side on the back wall. The one on the left is the quiet study room. No phones in there, please. The one on the right, next to the stairs, is the Library of Things that I mentioned earlier.", vi: "Ở cuối sảnh, đi thẳng qua quầy thông tin, có hai phòng nhỏ cạnh nhau ở tường sau. Phòng bên trái là phòng học yên tĩnh. Xin đừng dùng điện thoại trong đó. Phòng bên phải, cạnh cầu thang, là Thư viện Đồ vật tôi vừa nhắc." },
          { who: "Librarian", voice: "au-nu", text: "The stairs themselves are in the far right-hand corner, and they take you up to fiction and local history. Right, if there are no questions, I'll show you how the new self-service machines work.", vi: "Cầu thang nằm ở góc xa bên phải, dẫn lên khu truyện hư cấu và lịch sử địa phương. Rồi, nếu không ai hỏi gì, tôi sẽ chỉ cách dùng máy tự phục vụ mới." },
        ],
      },
      {
        t: "quiz",
        id: "t3d28-nghe-p2-ngan",
        title: "Questions 11–15 — NO MORE THAN THREE WORDS AND/OR A NUMBER",
        kind: "fill",
        items: [
          { q: "11. For how many months was the library closed?", answers: ["14", "fourteen", "14 months", "fourteen months"] },
          { q: "12. What time does the library now close on Wednesdays?", answers: ["8", "eight", "8 pm", "8pm", "8 p.m.", "8.00", "8:00", "eight o'clock", "8 o'clock"] },
          { q: "13. What must people bring in order to get a library card?", answers: ["proof of address"] },
          { q: "14. What is the maximum number of items a member can borrow?", answers: ["12", "twelve", "12 items", "twelve items"] },
          { q: "15. Which object in the “Library of Things” has been borrowed most?", answers: ["telescope", "the telescope", "a telescope"] },
        ],
      },
      {
        t: "quiz",
        id: "t3d28-nghe-p2-so-do",
        title: "Questions 16–20 — viết chữ cái A–G",
        kind: "fill",
        items: [
          { q: "16. Children's library", answers: ["C"] },
          { q: "17. Café", answers: ["G"] },
          { q: "18. Computer suite", answers: ["F"] },
          { q: "19. Quiet study room", answers: ["D"] },
          { q: "20. Library of Things", answers: ["E"] },
        ],
      },
      {
        t: "note",
        title: "Giải thích 11–15 — câu trong băng và bẫy",
        items: [
          "**11 — 14**: “The plan was to close for **nine** months, but **in the end it took fourteen**”. Bẫy đổi ý kinh điển: số dự định → số thật.",
          "**12 — 8 (pm)**: “We **used to** close at six… **Now** we stay open until **eight**… from Monday to Thursday”. Wednesday nằm trong Monday–Thursday (đề không lặp chữ của băng). six là giờ cũ, cũng là giờ thứ Sáu – thứ Bảy.",
          "**13 — proof of address**: “you only need to bring one thing… that's **proof of address**”. bill là VÍ DỤ; passport là thứ **không cần** nữa. Ba từ — vừa đúng giới hạn.",
          "**14 — 12**: “borrow **up to twelve** items… **It used to be eight**”. maximum = up to. three (weeks) là thời hạn, không phải số món.",
          "**15 — telescope**: “**The most popular item so far**… has been the **telescope**”. sewing machines, garden tools có cho mượn nhưng không phải nhiều nhất; musical instruments chưa có.",
        ],
      },
      {
        t: "note",
        title: "Giải thích 16–20 — đi theo đường người nói",
        items: [
          "Điểm đứng: sảnh, mặt quay **bắc** ⇒ **trái = tây** (A, B, C) · **phải = đông** (G, F) · **cuối sảnh = bắc** (D, E).",
          "**16 — C**: bên trái: góc cạnh cửa (A) = newspaper lounge — “that's where the children's library **used to be**” (bẫy vị trí cũ); đi qua toilets ở giữa (B); “the large room in **the far left-hand corner**” = C.",
          "**17 — G**: “**On your right** as you come in, the room **in the corner next to the main doors** is the café”.",
          "**18 — F**: “**Directly beyond the café**, still on the right-hand side” = F. “planned to put the computers **upstairs**” là dự định bị bỏ.",
          "**19 — D**: “two small rooms **side by side on the back wall**. The one **on the left** is the quiet study room”.",
          "**20 — E**: “The one **on the right, next to the stairs**” = E. A và B là hai chữ cái thừa (lounge, toilets).",
        ],
      },

      /* ── 5 ── */
      { t: "h", text: "5. Bài chính — Part 4, Questions 31–40 (giọng Anh)" },
      {
        t: "p",
        text: "Không nghỉ: làm tiếp ngay như trong phòng thi. Bạn có **45 giây** đọc trang ghi chú và 4 câu hỏi. Câu 31–36: **ONE WORD ONLY**. Câu 37–40: **NO MORE THAN TWO WORDS AND/OR A NUMBER**. Dùng tiêu đề con của ghi chú làm bản đồ (Ngày 13): Scale → Causes → Why it matters → (câu hỏi ngắn về) Saving languages.",
      },
      {
        t: "note",
        title: "LANGUAGE LOSS — lecture notes (Questions 31–36) · ONE WORD ONLY",
        items: [
          "**Scale of the problem**",
          "• about 7,000 languages in the world; half of the world's people speak one of only 23",
          "• at least 40% of languages are endangered",
          "**Causes**",
          "• usual cause: “language shift” — a community changes to a more powerful language",
          "• in the past: children were punished for using their home language at **31 ______**",
          "• today: the pressure is mostly **32 ______** (parents want children to get good jobs)",
          "• key measure of danger: whether the language is still passed on to **33 ______**",
          "**Why it matters**",
          "• identity: losing a language can reduce young people's **34 ______**",
          "• knowledge: e.g. names for hundreds of plants that are used as **35 ______**",
          "• science: some languages use compass **36 ______** instead of “left” and “right”",
        ],
      },
      {
        t: "table",
        caption: "Questions 37–40 — Answer the questions (đọc trước)",
        head: ["Câu", "Question"],
        rows: [
          ["37", "What name was given to the Māori pre-schools set up in the 1980s?"],
          ["38", "In the 1980s, fewer than how many children could speak Hawaiian?"],
          ["39", "What was launched in Wales in 1982?"],
          ["40", "Which group does the lecturer say is most important for keeping a language alive?"],
        ],
      },
      {
        t: "listen",
        id: "t3d28-nghe-p4",
        title: "When languages fall silent — a lecture",
        dan: { so: "Day 28, Recording 2 (Listening Part 4)", boiCanh: "part of a lecture on language loss, given to first-year linguistics students.", cau: [31, 40] },
        note: "Khoảng 5 phút, giọng Anh (nam), không có quãng nghỉ giữa bài.",
        lines: [
          { who: "Lecturer", voice: "uk-nam", text: "Good afternoon. In today's lecture I want to look at language loss: why languages disappear, why it matters, and what, if anything, can be done about it.", vi: "Chào buổi chiều. Trong bài giảng hôm nay tôi muốn xem xét việc ngôn ngữ mất đi: vì sao ngôn ngữ biến mất, vì sao điều đó quan trọng, và có thể làm gì, nếu có." },
          { who: "Lecturer", voice: "uk-nam", text: "Let's begin with the scale of the problem. There are roughly seven thousand languages spoken in the world today. That sounds like a lot, but they are very unevenly distributed. About half of the world's population speaks one of just twenty-three languages, while thousands of others have only a handful of speakers. At least forty per cent of all languages are now classed as endangered, and some linguists predict that half of them may have gone by the end of this century.", vi: "Hãy bắt đầu với quy mô của vấn đề. Ngày nay thế giới có khoảng bảy nghìn ngôn ngữ. Nghe thì nhiều, nhưng chúng phân bố rất không đều. Khoảng một nửa dân số thế giới nói một trong chỉ hai mươi ba ngôn ngữ, trong khi hàng nghìn ngôn ngữ khác chỉ còn một nhúm người nói. Ít nhất bốn mươi phần trăm ngôn ngữ hiện bị xếp là có nguy cơ biến mất, và một số nhà ngôn ngữ học dự đoán một nửa có thể mất đi trước cuối thế kỷ này." },
          { who: "Lecturer", voice: "uk-nam", text: "So why do languages die? It's rarely because the speakers themselves die. The usual cause is what we call language shift. A community gradually stops using its own language and adopts a more powerful one.", vi: "Vậy vì sao ngôn ngữ chết? Hiếm khi là vì chính người nói qua đời. Nguyên nhân thường gặp là hiện tượng ta gọi là chuyển đổi ngôn ngữ. Một cộng đồng dần ngừng dùng ngôn ngữ của mình và chuyển sang một ngôn ngữ mạnh hơn." },
          { who: "Lecturer", voice: "uk-nam", text: "Sometimes this was forced. In the nineteenth and twentieth centuries, many governments wanted a single national language, and children were punished if they were heard speaking their home language at school. Not at home, notice. At home, parents could do as they liked. It was the classroom that did the damage.", vi: "Đôi khi việc này bị ép buộc. Ở thế kỷ mười chín và hai mươi, nhiều chính phủ muốn một ngôn ngữ quốc gia duy nhất, và trẻ em bị phạt nếu bị nghe thấy nói tiếng ở nhà khi đang ở trường. Lưu ý là không phải ở nhà. Ở nhà cha mẹ muốn làm gì thì làm. Chính lớp học mới gây ra tổn hại." },
          { who: "Lecturer", voice: "uk-nam", text: "Today, though, the pressure is not really political. It's mostly economic. Parents want their children to get good jobs, and those jobs require the dominant language. So parents, with the best of intentions, stop using the old language with their sons and daughters.", vi: "Tuy nhiên ngày nay sức ép không thật sự là chính trị. Nó chủ yếu là kinh tế. Cha mẹ muốn con có việc làm tốt, mà những việc đó đòi hỏi ngôn ngữ thống trị. Thế là cha mẹ, với ý định tốt nhất, ngừng dùng ngôn ngữ cũ với con trai con gái mình." },
          { who: "Lecturer", voice: "uk-nam", text: "And that is the crucial point. You might think that the best measure of a language's health is the number of speakers, or perhaps the number of elderly speakers who remember it well. In fact, the key measure is neither of those. It is whether the language is still being passed on to children. A language with fifty thousand speakers, all over sixty, is in far more danger than one with five thousand speakers of all ages.", vi: "Và đó là điểm then chốt. Bạn có thể nghĩ thước đo tốt nhất cho sức khoẻ của một ngôn ngữ là số người nói, hoặc số người già còn nhớ rõ nó. Thật ra thước đo then chốt không phải cái nào trong hai cái đó. Đó là ngôn ngữ có còn được truyền cho trẻ em hay không. Một ngôn ngữ có năm mươi nghìn người nói, tất cả trên sáu mươi tuổi, nguy hiểm hơn nhiều so với một ngôn ngữ có năm nghìn người nói ở mọi lứa tuổi." },
          { who: "Lecturer", voice: "uk-nam", text: "Why does any of this matter? I'll give you three reasons. The first is identity. A language carries a community's songs, jokes and prayers, and groups that lose their language often report a loss of confidence, particularly among young people, who feel that they belong fully to neither culture.", vi: "Vì sao những điều này quan trọng? Tôi nêu ba lý do. Thứ nhất là bản sắc. Một ngôn ngữ mang theo bài hát, chuyện cười và lời cầu nguyện của cộng đồng, và những nhóm mất ngôn ngữ thường cho biết họ mất sự tự tin, đặc biệt là giới trẻ, những người cảm thấy mình không thuộc trọn về nền văn hoá nào." },
          { who: "Lecturer", voice: "uk-nam", text: "The second reason is knowledge. Small languages often have a very detailed vocabulary for local animals, weather and plants. In parts of the Amazon, for example, speakers have names for hundreds of plants that are used not as food but as medicine, and most of this knowledge has never been written down.", vi: "Lý do thứ hai là tri thức. Ngôn ngữ nhỏ thường có vốn từ rất chi tiết về động vật, thời tiết và cây cỏ địa phương. Chẳng hạn ở một số vùng Amazon, người nói có tên cho hàng trăm loài cây được dùng không phải làm thức ăn mà làm thuốc, và phần lớn tri thức này chưa từng được ghi chép lại." },
          { who: "Lecturer", voice: "uk-nam", text: "The third reason is scientific. Every language shows us something about what the human mind can do. Some languages, for instance, have no words for left and right. Their speakers use compass directions instead, north, south and so on, and as a result they always know exactly which way they are facing.", vi: "Lý do thứ ba thuộc về khoa học. Mỗi ngôn ngữ cho ta thấy điều gì đó về khả năng của trí óc con người. Ví dụ một số ngôn ngữ không có từ chỉ trái và phải. Người nói dùng hướng la bàn thay vào đó, bắc, nam vân vân, và nhờ vậy họ luôn biết chính xác mình đang quay mặt về hướng nào." },
          { who: "Lecturer", voice: "uk-nam", text: "Now, can a dying language be saved? The most successful method so far comes from New Zealand. In the early nineteen eighties, Māori communities set up what they called language nests. These were pre-schools where very young children spent the whole day with elderly speakers, hearing nothing but Māori.", vi: "Vậy một ngôn ngữ đang chết có cứu được không? Phương pháp thành công nhất tới nay đến từ New Zealand. Đầu thập niên 1980, các cộng đồng Māori lập ra thứ họ gọi là “tổ ngôn ngữ”. Đó là những trường mầm non nơi trẻ rất nhỏ ở cả ngày với người già biết tiếng, chỉ nghe toàn tiếng Māori." },
          { who: "Lecturer", voice: "uk-nam", text: "The idea has since been copied elsewhere, most famously in Hawaii. In the nineteen eighties, fewer than fifty children could speak Hawaiian. Today the figure is several thousand. And then there is Welsh, here in Britain, where many people see the turning point as nineteen eighty-two, the year a Welsh-language television channel was launched. It gave the language a place in modern life, not only in the past.", vi: "Ý tưởng này sau đó được sao chép ở nơi khác, nổi tiếng nhất là Hawaii. Thập niên 1980, chưa tới năm mươi trẻ em nói được tiếng Hawaii. Ngày nay con số là vài nghìn. Rồi còn tiếng Wales, ngay tại nước Anh, nơi nhiều người coi bước ngoặt là năm 1982, năm một kênh truyền hình tiếng Wales ra đời. Nó cho ngôn ngữ này một chỗ đứng trong đời sống hiện đại chứ không chỉ trong quá khứ." },
          { who: "Lecturer", voice: "uk-nam", text: "Technology helps too. Recordings can be stored cheaply, and learners can use apps. But I should add a warning. A recording preserves a language in the way a museum preserves an object. It doesn't keep it alive. For that you need more than teachers, and more than government money. Above all, you need young people who think the language is worth using with their friends. Next week we'll look at one such case in detail.", vi: "Công nghệ cũng giúp ích. Bản ghi âm lưu trữ được với giá rẻ, người học dùng được ứng dụng. Nhưng tôi phải thêm một lời cảnh báo. Bản ghi âm bảo tồn một ngôn ngữ theo cách bảo tàng bảo tồn một hiện vật. Nó không giữ cho ngôn ngữ sống. Để làm điều đó, bạn cần hơn cả giáo viên, hơn cả tiền của chính phủ. Trên hết, bạn cần những người trẻ nghĩ rằng ngôn ngữ ấy đáng dùng với bạn bè. Tuần sau chúng ta sẽ xem kỹ một trường hợp như vậy." },
        ],
      },
      {
        t: "quiz",
        id: "t3d28-nghe-p4-ghi-chu",
        title: "Questions 31–36 — ONE WORD ONLY",
        kind: "fill",
        items: [
          { q: "31.", answers: ["school"] },
          { q: "32.", answers: ["economic"] },
          { q: "33.", answers: ["children"] },
          { q: "34.", answers: ["confidence"] },
          { q: "35.", answers: ["medicine"] },
          { q: "36.", answers: ["directions"] },
        ],
      },
      {
        t: "quiz",
        id: "t3d28-nghe-p4-ngan",
        title: "Questions 37–40 — NO MORE THAN TWO WORDS AND/OR A NUMBER",
        kind: "fill",
        items: [
          { q: "37. What name was given to the Māori pre-schools set up in the 1980s?", answers: ["language nests"] },
          { q: "38. In the 1980s, fewer than how many children could speak Hawaiian?", answers: ["50", "fifty"] },
          { q: "39. What was launched in Wales in 1982?", answers: ["television channel", "TV channel"] },
          { q: "40. Which group does the lecturer say is most important for keeping a language alive?", answers: ["young people"] },
        ],
      },
      {
        t: "note",
        title: "Giải thích 31–36 — câu trong băng và bẫy",
        items: [
          "**31 school** — “punished if they were heard speaking their home language **at school**. **Not at home**, notice.” home bị phủ nhận ngay sau đó; classroom cũng đúng ý nhưng ghi chú cần từ đứng sau “at” mà băng nói là school.",
          "**32 economic** — “the pressure is **not really political**. It's mostly **economic**.” Bẫy: political được nhắc trước rồi bị gạt.",
          "**33 children** — “the key measure is **neither of those**. It is whether the language is still being **passed on to children**.” speakers / elderly speakers là hai phương án bị bác.",
          "**34 confidence** — “report a **loss of confidence**, particularly among young people”. reduce = loss of (đổi loại từ).",
          "**35 medicine** — “plants that are used **not as food but as medicine**”. food bị phủ nhận.",
          "**36 directions** — “use **compass directions** instead”. Số nhiều: nghe /z/ cuối và ví dụ north, south đi kèm.",
        ],
      },
      {
        t: "note",
        title: "Giải thích 37–40",
        items: [
          "**37 language nests** — “set up what they **called language nests**”. What name was given = what they called. Hai từ, số nhiều.",
          "**38 50** — “**fewer than fifty** children could speak Hawaiian. Today the figure is **several thousand**.” several thousand là con số HIỆN NAY.",
          "**39 television channel** — “nineteen eighty-two, the year **a Welsh-language television channel was launched**”. Giới hạn hai từ ⇒ bỏ a và Welsh-language.",
          "**40 young people** — “you need **more than teachers**, and more than government money. **Above all**, you need **young people**…” teachers và government là hai thứ bị xếp sau. Above all = most important.",
        ],
      },

      /* ── 6 ── */
      { t: "h", text: "6. Chấm điểm và học lại" },
      {
        t: "table",
        caption: "20 câu — bạn ở đâu?",
        head: ["Đúng / 20", "Tương đương cả bài", "Việc làm tiếp"],
        rows: [
          ["17–20", "≈ band 7 trở lên", "Nghe lại không nhìn lời, chép chính tả 3 câu có bẫy đổi ý."],
          ["**14–16**", "**≈ band 6 – 6.5**", "Đạt đích. Xem câu sai thuộc loại nào ở bảng dưới."],
          ["10–13", "≈ band 5 – 5.5", "Nghe lại từng Part, lần này nhìn lời thoại; gạch mọi cụm “used to / not… but / in fact”."],
          ["≤ 9", "< band 5", "Ôn Ngày 9 (bẫy đổi ý) và Ngày 4 (map) rồi làm lại sau 2 ngày."],
        ],
      },
      {
        t: "table",
        caption: "Sai vì đâu — ôn ở đâu",
        head: ["Kiểu sai", "Câu hay dính", "Ôn"],
        rows: [
          ["Viết thông tin bị sửa / bị phủ nhận", "11 · 12 · 14 · 31 · 32 · 35", "Tập 3 Ngày 9"],
          ["Vượt giới hạn từ, thừa a / the", "13 · 37 · 39", "Mục 1 hôm nay"],
          ["Lạc trên sơ đồ", "16–20", "Tập 3 Ngày 4 · 12"],
          ["Thiếu -s số nhiều", "36 · 37", "Tập 2 Ngày 19; kiểm bằng ngữ pháp câu hỏi"],
          ["Lạc giữa bài giảng", "33–36", "Tập 3 Ngày 13 (từ chỉ đường: The first… The second… Now, …)"],
          ["Không quen giọng", "Part 2 (Úc)", "Tập 3 Ngày 1 (ba giọng) — nghe lại câu có eight / later / day"],
        ],
      },
      {
        t: "note",
        title: "💡 Cách học sau bài",
        items: [
          "Mở lời thoại Part 4, tìm **sáu cặp “thứ bị gạt → thứ đúng”** (not at home → at school; not political → economic…). Đây là kiểu câu giảng viên dùng nhiều nhất và là nơi đề đặt chỗ trống.",
          "Tập **shadowing** đoạn chỉ đường của Part 2 (nói đuổi theo băng) — vừa quen giọng Úc, vừa thuộc từ chỉ vị trí cho bài Viết map hôm nay.",
          "Ngày 29 là đề Listening đủ 40 câu lần 2 — hôm nay là buổi tập dượt nửa đề.",
        ],
      },
    ],
  },
  /* ═══════════════════════════ BÀI TẬP ═══════════════════════════ */
  {
    id: "t3d28-bai-tap",
    kind: "homework",
    title: "Bài tập Ngày 28 — language & identity · books · từ dễ nhầm · process / map · nghe Short answer",
    goal: "Tự kiểm cả ngày bằng 38 câu có đáp án: dùng đúng từ về ngôn ngữ – văn hoá và sách, chọn đúng từ trong 16 cặp dễ nhầm, viết câu quy trình có mục đích và câu bản đồ đúng thì, và trả lời Short answer cho một đoạn nghe mới — đúng từ 27 câu trở lên là đạt.",
    minutes: 50,
    blocks: [
      {
        t: "recap",
        title: "Cách làm (38 câu)",
        items: [
          "**I** Language, culture & identity — điền từ (8 câu) · **II** Books & reading — chọn từ (6 câu) · **III** Từ dễ nhầm (8 câu).",
          "**IV** Dịch câu process / map (6 câu) · **V** Chọn câu đúng cho sơ đồ và bản đồ (5 câu).",
          "**VI** Nghe — Short answer (5 câu), giọng Canada.",
          "Đích: **≥ 27/38**. Làm một mạch, không tra lại bài; sai phần nào xem lại mục ghi ở tiêu đề phần đó.",
        ],
      },

      { t: "h", text: "I. Language, culture & identity — điền từ (8 câu) — ôn Từ vựng mục 1 · 2 · 5" },
      {
        t: "p",
        text: "Hộp từ (mỗi từ dùng một lần): **assimilate · barrier · belonging · heritage · indigenous · minority · pass · tongue**",
      },
      {
        t: "quiz",
        id: "t3d28-bt-ngon-ngu",
        title: "I. Điền một từ trong hộp",
        kind: "fill",
        items: [
          { q: "1. Most children learn their mother ___ without any formal teaching.", answers: ["tongue"] },
          { q: "2. The language ___ was the hardest part of moving abroad.", answers: ["barrier"] },
          { q: "3. Elderly speakers are the only people who can ___ the language down to the next generation.", answers: ["pass"] },
          { q: "4. Wearing the team's colours gives fans a sense of ___.", answers: ["belonging"] },
          { q: "5. The old town is part of the country's cultural ___.", answers: ["heritage"] },
          { q: "6. Welsh is a ___ language in Britain, spoken by under a million people.", answers: ["minority"] },
          { q: "7. Some migrants ___ completely and stop using their first language.", answers: ["assimilate"] },
          { q: "8. The museum displays tools made by the ___ people of the region.", answers: ["indigenous"] },
        ],
      },

      { t: "h", text: "II. Books & reading — chọn từ đúng (6 câu) — ôn Từ vựng mục 3 · 4 · 5" },
      {
        t: "mcq",
        id: "t3d28-bt-sach",
        title: "II. Chọn từ đúng",
        items: [
          { q: "1. I couldn't stop reading it — it was a real ___.", options: ["bookworm", "page-turner", "paperback", "publisher"], correct: 1, why: "page-turner = cuốn sách cuốn hút. bookworm là NGƯỜI mê sách." },
          { q: "2. A book about a real person's life, written by someone else, is a ___.", options: ["novel", "genre", "biography", "plot"], correct: 2, why: "biography = tiểu sử do người khác viết (tự viết: autobiography)." },
          { q: "3. Reading novels can ___ a child's imagination.", options: ["stimulate", "publish", "flick", "absorb"], correct: 0, why: "stimulate the imagination = kích thích trí tưởng tượng." },
          { q: "4. The adult ___ rate in the region is only 60%.", options: ["literature", "literary", "literate", "literacy"], correct: 3, why: "the literacy rate = tỉ lệ biết đọc viết. literature = văn học." },
          { q: "5. Before buying a laptop, I always ___ the different models.", options: ["read between", "read up on", "read out", "read for"], correct: 1, why: "read up on = đọc kỹ để tìm hiểu." },
          { q: "6. He didn't say he was unhappy, but you could read ___.", options: ["for pleasure", "from cover to cover", "between the lines", "up on it"], correct: 2, why: "read between the lines = hiểu ý ẩn sau câu chữ." },
        ],
      },

      { t: "h", text: "III. Từ dễ nhầm (8 câu) — ôn Từ vựng mục 6" },
      {
        t: "mcq",
        id: "t3d28-bt-de-nham",
        title: "III. Chọn từ đúng",
        items: [
          { q: "1. Television has had a great ___ on the way people speak.", options: ["affect", "effect", "effective", "affected"], correct: 1, why: "have an effect on (danh từ)." },
          { q: "2. The number of e-book readers ___ sharply between 2010 and 2015.", options: ["raised", "was risen", "rose", "has raised"], correct: 2, why: "Con số tự tăng → rise – rose; mốc quá khứ → quá khứ đơn." },
          { q: "3. A smaller car is more ___ because it uses less fuel.", options: ["economical", "economic", "economics", "economy"], correct: 0, why: "economical = tiết kiệm. economic = thuộc về kinh tế." },
          { q: "4. The signing of the agreement was a ___ moment for the country.", options: ["historical", "history", "historian", "historic"], correct: 3, why: "historic = có ý nghĩa lịch sử, đáng ghi vào sử. historical = thuộc về quá khứ." },
          { q: "5. The ___ of information available online is enormous.", options: ["number", "amount", "numbers", "many"], correct: 1, why: "information không đếm được → the amount of." },
          { q: "6. Teachers ___ parents to read to their children every night.", options: ["advice", "advices", "advise", "advising"], correct: 2, why: "Cần động từ: advise + người + to V." },
          { q: "7. The village ___ on the north bank of the river.", options: ["lies", "lays", "is lain", "is laying"], correct: 0, why: "lie (nằm, không tân ngữ) → lies. lay cần tân ngữ." },
          { q: "8. Could you ___ me your dictionary until tomorrow?", options: ["borrow", "loan from", "rent", "lend"], correct: 3, why: "lend + người + vật = cho mượn. borrow = mượn vào." },
        ],
      },

      { t: "h", text: "IV. Dịch câu process / map (6 câu) — ôn Viết mục 3 · 4 · 6 · 7" },
      {
        t: "quiz",
        id: "t3d28-bt-dich",
        title: "IV. Dịch sang tiếng Anh",
        kind: "translate",
        grammar: "After being V3, S is V3 · S is V3 in order to V · S is V3 before being V3 · has been replaced by · will be built · S1 is located …, whereas S2 lies …",
        items: [
          { q: "Sau khi được hái, lá trà được trải trên các giá.", hint: "After being picked · the tea leaves · are spread on racks", answers: ["After being picked, the tea leaves are spread on racks.", "After being picked, the tea leaves are spread out on racks.", "After being picked, tea leaves are spread on racks."] },
          { q: "Lá được cuộn bằng máy để phá vỡ thành tế bào.", hint: "are rolled by machine · in order to break the cell walls", answers: ["The leaves are rolled by machine in order to break the cell walls.", "The leaves are rolled by machine to break the cell walls.", "The leaves are rolled by machine in order to break their cell walls."] },
          { q: "Trà được phân loại theo kích cỡ trước khi được đóng gói.", hint: "is sorted by size · before being packed", answers: ["The tea is sorted by size before being packed.", "Tea is sorted by size before being packed.", "The tea is sorted by size before it is packed."] },
          { q: "Các nhà kho đã được thay bằng chung cư.", hint: "The warehouses · have been replaced by · apartments", answers: ["The warehouses have been replaced by apartments.", "The warehouses have been replaced with apartments.", "The warehouses have been replaced by flats."] },
          { q: "Một cây cầu đi bộ sẽ được xây bắc qua sông.", hint: "A footbridge · will be built · across the river", answers: ["A footbridge will be built across the river.", "A footbridge is going to be built across the river.", "A footbridge will be built over the river."] },
          { q: "S1 nằm ở giữa thị trấn, trong khi S2 nằm ở ngoại vi.", hint: "is located in the middle of · whereas · lies on the outskirts", answers: ["S1 is located in the middle of the town, whereas S2 lies on the outskirts.", "S1 is located in the middle of the town, whereas S2 is on the outskirts.", "S1 is situated in the middle of the town, whereas S2 lies on the outskirts.", "S1 is located in the centre of the town, whereas S2 lies on the outskirts.", "S1 is located in the middle of the town, while S2 lies on the outskirts.", "S1 is in the middle of the town, whereas S2 is on the outskirts.", "S1 is located in the middle of the town, whereas S2 is located on the outskirts."] },
        ],
      },

      { t: "h", text: "V. Chọn câu đúng cho sơ đồ và bản đồ (5 câu) — ôn Viết mục 2 · 6 · 7 · 8" },
      {
        t: "mcq",
        id: "t3d28-bt-viet",
        title: "V. Chọn câu viết ĐÚNG và hợp Task 1",
        items: [
          { q: "1. Overview cho sơ đồ vòng đời của bướm (4 giai đoạn, quay vòng):", options: ["Overall, the butterfly is a beautiful insect with four steps.", "Overall, the life cycle of the butterfly is a natural, cyclical process with four stages, from egg to adult.", "Overall, there are four pictures.", "Overall, first the egg is laid and then it hatches."], correct: 1, why: "Loại (natural, cyclical) + số giai đoạn + đầu – cuối. A có ý kiến; C không nói gì; D là chi tiết." },
          { q: "2. Sơ đồ ghi “stored — steel tanks — 6 months”. Câu nào đúng?", options: ["The wine stored in steel tanks during 6 months.", "The wine is stored by steel tanks for six months.", "The wine is stored in steel tanks for six months.", "The wine is stored in steel tanks for six months, which makes it delicious."], correct: 2, why: "Bị động đủ be; in + nơi chứa; for + khoảng thời gian. D thêm ý kiến ngoài hình." },
          { q: "3. Bản đồ 1990 và “today”: trường học vẫn ở chỗ cũ.", options: ["The school has remained in the same place.", "The school has been remained in the same place.", "The school was remained in the same place.", "The school will be remained in the same place."], correct: 0, why: "remain không có bị động; 1990 → nay dùng hiện tại hoàn thành." },
          { q: "4. Bản đồ kế hoạch 2035: bãi đất trống → khu nhà ở.", options: ["The wasteland was developed into housing in 2035.", "The wasteland develops into housing.", "The wasteland has been developed into housing by 2035.", "The wasteland is going to be developed into housing by 2035."], correct: 3, why: "Kế hoạch tương lai → is going to be / will be + V3." },
          { q: "5. Bài chọn địa điểm — câu nào nên có?", options: ["In my opinion, Site A is the better choice.", "Site B was built near the factory.", "A school at Site B would be further from most homes.", "The council will choose Site A."], correct: 2, why: "Hệ quả bằng would, không ý kiến, không quá khứ, không will." },
        ],
      },

      { t: "h", text: "VI. Nghe — Short answer (5 câu, giọng Canada) — ôn bài Nghe mục 1" },
      {
        t: "p",
        text: "Đọc 5 câu hỏi trong 25 giây, nghe **một lần**. **NO MORE THAN TWO WORDS AND/OR A NUMBER** cho mỗi đáp án.",
      },
      {
        t: "table",
        caption: "Questions 1–5 (đọc trước)",
        head: ["Câu", "Question"],
        rows: [
          ["1", "In which month will the festival take place?"],
          ["2", "How many languages will be represented at the festival?"],
          ["3", "What will visitors be able to learn at the workshops on Saturday morning?"],
          ["4", "Where will the storytelling evening be held?"],
          ["5", "How much does a weekend ticket cost for a student?"],
        ],
      },
      {
        t: "listen",
        id: "t3d28-bt-nghe",
        title: "Many Voices Festival — a radio announcement",
        dan: { so: "Day 28, Homework recording", boiCanh: "a radio announcement about a local language festival.", cau: [1, 5] },
        note: "Khoảng 1 phút, giọng Canada (nam). Có ba thông tin bị sửa hoặc dễ nhầm.",
        lines: [
          { who: "Announcer", voice: "ca-nam", text: "And now some news for anyone interested in languages. The Many Voices Festival is coming back to the city. It's usually held in September, but this year the organizers have moved it to October, so that more students can take part.", vi: "Và bây giờ là tin cho ai quan tâm tới ngôn ngữ. Lễ hội Many Voices sắp trở lại thành phố. Thường nó được tổ chức vào tháng Chín, nhưng năm nay ban tổ chức đã dời sang tháng Mười để nhiều sinh viên tham gia được hơn." },
          { who: "Announcer", voice: "ca-nam", text: "Last year, fifteen languages were represented. This time there will be twenty-two, including four indigenous languages from our own region.", vi: "Năm ngoái có mười lăm ngôn ngữ góp mặt. Lần này sẽ có hai mươi hai, gồm bốn ngôn ngữ bản địa của chính vùng chúng ta." },
          { who: "Announcer", voice: "ca-nam", text: "On Saturday morning there are free workshops where you can learn traditional songs from elderly speakers. Cooking classes were planned as well, but those have been cancelled.", vi: "Sáng thứ Bảy có các buổi workshop miễn phí, nơi bạn học được các bài hát truyền thống từ những người lớn tuổi biết tiếng. Lớp nấu ăn cũng đã được lên kế hoạch nhưng đã bị huỷ." },
          { who: "Announcer", voice: "ca-nam", text: "The highlight is the storytelling evening on Saturday. It won't be in the main hall this year. Instead, it's moving to the city library, which has room for three hundred people.", vi: "Điểm nhấn là đêm kể chuyện tối thứ Bảy. Năm nay nó không diễn ra ở hội trường chính. Thay vào đó, nó chuyển về thư viện thành phố, nơi chứa được ba trăm người." },
          { who: "Announcer", voice: "ca-nam", text: "A weekend ticket is eighteen dollars for adults and twelve dollars for students, and children under ten get in free. Tickets are on sale now.", vi: "Vé cả cuối tuần giá mười tám đô cho người lớn và mười hai đô cho sinh viên, trẻ dưới mười tuổi được vào miễn phí. Vé hiện đang được bán." },
        ],
      },
      {
        t: "quiz",
        id: "t3d28-bt-nghe-cau",
        title: "VI. Questions 1–5 — NO MORE THAN TWO WORDS AND/OR A NUMBER",
        kind: "fill",
        items: [
          { q: "1. In which month will the festival take place?", answers: ["October"] },
          { q: "2. How many languages will be represented at the festival?", answers: ["22", "twenty-two", "twenty two"] },
          { q: "3. What will visitors be able to learn at the workshops on Saturday morning?", answers: ["traditional songs", "songs"] },
          { q: "4. Where will the storytelling evening be held?", answers: ["city library", "the city library", "library", "the library"] },
          { q: "5. How much does a weekend ticket cost for a student?", answers: ["$12", "12", "12 dollars", "twelve dollars", "twelve"] },
        ],
      },
      {
        t: "note",
        title: "Giải thích đáp án VI",
        items: [
          "**1 October** — “usually held in September, **but this year**… moved it to **October**”.",
          "**2 22** — “**Last year**, fifteen… **This time** there will be **twenty-two**”. four chỉ là số ngôn ngữ bản địa trong đó.",
          "**3 traditional songs** — “learn **traditional songs** from elderly speakers”. Cooking classes đã bị huỷ.",
          "**4 city library** — “It **won't be in the main hall**… **Instead**, it's moving to the **city library**”. three hundred là sức chứa.",
          "**5 $12** — “eighteen dollars for adults and **twelve dollars for students**”. Câu hỏi hỏi sinh viên, không phải người lớn.",
        ],
      },
      {
        t: "note",
        title: "📌 Chấm điểm và việc làm tiếp",
        items: [
          "**≥ 27/38**: đạt. Phần III dưới 6/8 ⇒ chép lại trang 16 cặp từ dễ nhầm và tự đặt câu.",
          "Việc bắt buộc: nộp **hai bài viết** ở bài Viết mục 9 (process trà + map Marton) nếu chưa làm; soát bằng bảng 6 lượt của Ngày 27.",
          "Nói 1 phút (ghi âm) cho câu Part 1: “Do you prefer paper books or e-books?” — dùng ít nhất 3 từ của mục 3–4 và kết bằng một câu chốt.",
        ],
      },
    ],
  },
];
