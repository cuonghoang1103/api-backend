/**
 * IELTS Tập 4 — Ngày 10 (band 6.0 → 7.0; tự soạn 18/11/2026 — mọi câu ví dụ, bài mẫu, đề, câu bài tập VIẾT MỚI)
 *   Bài 1 (vocab)     Art, music & creativity — 51 từ (mỹ thuật · phê bình · sáng tạo · nghệ thuật & xã hội · âm nhạc vòng 2) +
 *                     14 cụm cho Task 2 / Part 3 + sắc thái từ đồng nghĩa (khen / trung tính / chê, mức mạnh, văn phong) +
 *                     14 cặp từ dễ nhầm vòng 2                                                             [VC28 VD5 VD8]
 *                     — nối Tập 2 Ngày 20 (giải trí: nhóm từ âm nhạc – biểu diễn), Tập 3 Ngày 28 (16 cặp dễ nhầm vòng 1)
 *   Bài 2 (writing)   Discussion band 7 — thesis có điều kiện + thuật hai góc công bằng + ĐÁNH GIÁ từng góc; band 6 vs band 7 [W04]
 *                     — nối Tập 2 Ngày 6 (đề có / không “give your opinion”), Tập 3 Ngày 10 (ba biến thể, balanced opinion)
 *   Bài 3 (speaking)  Part 2: đồ vật / hoạt động band 7 — từ ít gặp, idiom tự nhiên; band 6 vs band 7           [S05 VD7]
 *                     — nối Tập 3 Ngày 26 (đồ vật / hoạt động vòng 2), Ngày 30 (30 idiom) · 🔊 /tʃ/ /dʒ/ /tr/ /dr/
 *   Bài tập Ngày 10   45 câu có đáp án + 1 đoạn viết + 1 lượt nói
 * Mọi id bắt đầu `t4d10-`.
 */
import type { Lesson } from '../data';

export const NGAY_10: Lesson[] = [
  /* ═══════════════════════════ BÀI 1 — TỪ VỰNG ═══════════════════════════ */
  {
    id: "t4d10-tu-vung",
    kind: "vocab",
    title: "Từ vựng: Nghệ thuật, âm nhạc & sáng tạo + sắc thái từ đồng nghĩa, từ dễ nhầm",
    goal: "Dùng chủ động 51 từ và 14 cụm về mỹ thuật, phê bình, sáng tạo và vai trò của nghệ thuật trong xã hội; chọn đúng từ theo SẮC THÁI (renowned ≠ notorious, childlike ≠ childish, understated ≠ plain) và không còn nhầm 14 cặp kiểu imaginary / imaginative, imply / infer, complement / compliment — đẩy LR band 7 (từ ít gặp dùng có ý thức về văn phong và collocation, lỗi hiếm) cho Task 2, Part 2 và Part 3.",
    minutes: 95,
    blocks: [
      {
        t: "recap",
        title: "Bài này học gì · đẩy tiêu chí nào",
        items: [
          "Chủ đề **Art, music & creativity** hay ra ở Task 2 (tài trợ nghệ thuật, môn nghệ thuật ở trường, tự do sáng tác) và Speaking Part 2–3 (một tác phẩm, một hoạt động sáng tạo). **Tập 2 Ngày 20** (Sport, leisure & entertainment) đã có nhóm từ âm nhạc – biểu diễn; hôm nay trọng tâm là ==mỹ thuật và ngôn ngữ phê bình==, cộng 5 từ âm nhạc vòng 2.",
          "**51 từ** chia 5 nhóm, mỗi từ có collocation / họ từ / lỗi hay sai. **14 cụm** dùng thẳng trong Task 2 và Part 3.",
          "**Sắc thái** (connotation): hai từ cùng nghĩa từ điển nhưng một từ khen, một từ chê. Band 7 LR ghi rõ “ý thức về văn phong và collocation” — sai sắc thái là lỗi **chọn từ**, máy soát chính tả không bắt.",
          "**Từ dễ nhầm vòng 2**: 14 cặp mới, khó hơn 16 cặp của Tập 3 Ngày 28 (affect / effect, rise / raise… — không học lại).",
          "Tiêu chí được đẩy: **LR** Writing + Speaking. Bài Viết và bài Nói hôm nay dùng lại đúng những từ này.",
        ],
      },

      /* ── 1 ── */
      { t: "h", text: "1. Mỹ thuật — 11 từ gọi tên tác phẩm và thể loại" },
      {
        t: "sodo",
        kind: "mindmap",
        title: "Một tác phẩm mỹ thuật — gọi tên cho đúng",
        center: "a work of art",
        branches: [
          { label: "Vẽ (2 chiều)", items: ["painting · **canvas**", "**portrait** · **landscape** · **still life**", "**sketch** · **mural**"] },
          { label: "Khối (3 chiều)", items: ["**sculpture** · statue", "**installation**", "ceramics · carving"] },
          { label: "Trưng bày", items: ["**exhibition** · exhibit", "**retrospective**", "gallery · collection"] },
          { label: "Đánh giá", items: ["**masterpiece**", "a major / minor work", "a forgery (tranh giả)"] },
        ],
      },
      {
        t: "vocab",
        items: [
          { w: "masterpiece", pos: "n", ipa: "/ˈmɑːstəpiːs/", vi: "kiệt tác", ex: "The museum's most famous masterpiece attracts two million visitors a year.", exVi: "Kiệt tác nổi tiếng nhất của bảo tàng thu hút hai triệu khách mỗi năm.", more: "a **literary / architectural** masterpiece · be regarded as a masterpiece · nói vui: a masterpiece of understatement" },
          { w: "canvas", pos: "n", ipa: "/ˈkænvəs/", vi: "vải vẽ; bức tranh sơn dầu trên vải", ex: "The artist covered the entire canvas with a single shade of blue.", exVi: "Hoạ sĩ phủ toàn bộ tấm vải bằng một sắc xanh duy nhất.", more: "oil **on canvas** · a blank canvas (nghĩa bóng: khởi đầu trống trơn) · ≠ **canvass** (v, đi vận động phiếu)" },
          { w: "sculpture", pos: "n", ipa: "/ˈskʌlptʃə/", vi: "điêu khắc; tác phẩm điêu khắc", ex: "A bronze sculpture stands at the entrance to the park.", exVi: "Một tác phẩm điêu khắc bằng đồng đứng ở lối vào công viên.", more: "**sculptor** (n, nhà điêu khắc) · **sculpt** (v) · a marble / bronze sculpture · đếm được (a sculpture) và không đếm được (study sculpture)" },
          { w: "portrait", pos: "n", ipa: "/ˈpɔːtreɪt/", vi: "tranh / ảnh chân dung", ex: "She was commissioned to paint a portrait of the former president.", exVi: "Bà được đặt vẽ chân dung cựu tổng thống.", more: "a **self-portrait** · **portray** (v) sb **as** · **portrayal** (n, cách khắc hoạ) · paint / sit for a portrait" },
          { w: "landscape", pos: "n", ipa: "/ˈlændskeɪp/", vi: "tranh phong cảnh; phong cảnh; (bóng) bối cảnh", ex: "He is best known for his landscapes of the northern mountains.", exVi: "Ông nổi tiếng nhất với các bức phong cảnh vùng núi phía bắc.", more: "a landscape **painter** · the political / cultural landscape (bối cảnh) · ≠ **scenery** (không đếm được, cảnh đẹp thiên nhiên)" },
          { w: "still life", pos: "n", ipa: "/ˌstɪl ˈlaɪf/", vi: "tranh tĩnh vật", ex: "The room contains a still life of fruit and silverware.", exVi: "Căn phòng có một bức tĩnh vật vẽ hoa quả và đồ bạc.", more: "số nhiều **still lifes** (không phải ~~still lives~~) · a still-life painter" },
          { w: "installation", pos: "n", ipa: "/ˌɪnstəˈleɪʃn/", vi: "tác phẩm sắp đặt", ex: "The installation filled an entire warehouse with recorded voices.", exVi: "Tác phẩm sắp đặt lấp đầy cả một nhà kho bằng những giọng nói ghi âm.", more: "a video / sound / light installation · installation **art** · nghĩa thường: sự lắp đặt (the installation of solar panels)" },
          { w: "mural", pos: "n", ipa: "/ˈmjʊərəl/", vi: "tranh tường (cỡ lớn)", ex: "Local teenagers painted a mural on the side of the library.", exVi: "Thanh thiếu niên địa phương vẽ một bức tranh tường bên hông thư viện.", more: "a street / community mural · ≠ **graffiti** (không đếm được, thường mang nghĩa vẽ bậy)" },
          { w: "sketch", pos: "n, v", ipa: "/sketʃ/", vi: "bản phác thảo; phác hoạ", ex: "Her notebooks are full of quick sketches of strangers on trains.", exVi: "Sổ tay của cô đầy những phác thảo nhanh về người lạ trên tàu.", more: "a rough / preliminary sketch · **sketch out** a plan (phác ra kế hoạch) · **sketchy** (adj, sơ sài — nghĩa chê)" },
          { w: "exhibition", pos: "n", ipa: "/ˌeksɪˈbɪʃn/", vi: "cuộc triển lãm", ex: "The exhibition brings together sixty works from private collections.", exVi: "Triển lãm quy tụ sáu mươi tác phẩm từ các bộ sưu tập tư nhân.", more: "**hold / stage / mount** an exhibition · be **on** exhibition · **exhibit** (v/n — hiện vật) · AWL (exhibit)" },
          { w: "retrospective", pos: "n, adj", ipa: "/ˌretrəˈspektɪv/", vi: "triển lãm nhìn lại sự nghiệp; có tính nhìn lại", ex: "A major retrospective of her work opens next spring.", exVi: "Một triển lãm lớn nhìn lại sự nghiệp của bà sẽ mở vào mùa xuân tới.", more: "a retrospective **of** sb's work · **in retrospect** (nhìn lại thì) — cụm rất hay cho Part 2" },
        ],
      },
      {
        t: "quiz",
        id: "t4d10-tv-nhom1",
        kind: "fill",
        title: "Điền từ nhóm 1 (6 câu)",
        items: [
          { q: "1. A painting of a bowl of lemons and a wine glass is called a ___ ___. (2 từ)", answers: ["still life"] },
          { q: "2. The gallery is holding a ___ of the photographer's fifty-year career.", answers: ["retrospective"] },
          { q: "3. Before starting the painting, he made a rough ___ in pencil.", answers: ["sketch"] },
          { q: "4. The huge ___ on the factory wall shows the history of the town.", answers: ["mural"] },
          { q: "5. Critics agree that this novel is the writer's ___ . (tác phẩm xuất sắc nhất)", answers: ["masterpiece"] },
          { q: "6. In ___, I should have chosen a simpler design. (nhìn lại thì)", answers: ["retrospect"] },
        ],
      },

      /* ── 2 ── */
      { t: "h", text: "2. Ngôn ngữ phê bình — 12 từ để khen, chê và diễn giải" },
      {
        t: "p",
        text: "Người Việt tả tác phẩm bằng ba từ: beautiful, meaningful, interesting. Giám khảo band 7 cần thấy bạn nói được tác phẩm **làm gì với người xem**: gợi lên (evoke), khắc hoạ (depict), truyền tải (convey) — và đánh giá nó có sắc thái hơn “đẹp”.",
      },
      {
        t: "vocab",
        items: [
          { w: "aesthetic", pos: "adj, n", ipa: "/iːsˈθetɪk/", vi: "(thuộc) thẩm mỹ; quan niệm thẩm mỹ", ex: "The building was designed for practical rather than aesthetic reasons.", exVi: "Toà nhà được thiết kế vì lý do thực dụng chứ không phải thẩm mỹ.", more: "aesthetic **value / appeal / judgement** · **aesthetically** pleasing · a minimalist aesthetic · **aesthetics** (n, mỹ học)" },
          { w: "critique", pos: "n, v", ipa: "/krɪˈtiːk/", vi: "bài phê bình (phân tích kỹ); phê bình", ex: "The film offers a sharp critique of consumer culture.", exVi: "Bộ phim đưa ra một phê bình sắc sảo về văn hoá tiêu dùng.", more: "a critique **of** sth · ≠ **critic** (người phê bình) · ≠ **criticism** (sự chỉ trích; không đếm được) — xem mục 6" },
          { w: "acclaimed", pos: "adj", ipa: "/əˈkleɪmd/", vi: "được ca ngợi rộng rãi", ex: "Her second album was even more widely acclaimed than her first.", exVi: "Album thứ hai của cô còn được ca ngợi rộng rãi hơn album đầu.", more: "**critically** / **internationally** / **widely** acclaimed · **acclaim** (n): win critical acclaim" },
          { w: "controversial", pos: "adj", ipa: "/ˌkɒntrəˈvɜːʃl/", vi: "gây tranh cãi", ex: "The statue proved so controversial that it was moved indoors.", exVi: "Bức tượng gây tranh cãi tới mức bị chuyển vào trong nhà.", more: "**controversy** (n) /ˈkɒntrəvɜːsi/ · a highly controversial **decision / figure** · **spark / cause** controversy · AWL" },
          { w: "provocative", pos: "adj", ipa: "/prəˈvɒkətɪv/", vi: "khiêu khích, cố ý gây phản ứng", ex: "The exhibition is deliberately provocative, forcing visitors to question their assumptions.", exVi: "Triển lãm cố ý khiêu khích, buộc người xem tự vấn những điều mình mặc định.", more: "**provoke** (v) a reaction / debate · **provocation** (n) · gần: challenging (nhẹ hơn), offensive (xúc phạm — chê hẳn)" },
          { w: "evoke", pos: "v", ipa: "/ɪˈvəʊk/", vi: "gợi lên (cảm xúc, ký ức)", ex: "The smell of oil paint evokes memories of my grandfather's studio.", exVi: "Mùi sơn dầu gợi lại ký ức về xưởng vẽ của ông tôi.", more: "evoke **memories / a sense of / sympathy** · **evocative** (adj) of · ≠ **invoke** (viện dẫn luật, quyền)" },
          { w: "depict", pos: "v", ipa: "/dɪˈpɪkt/", vi: "miêu tả, khắc hoạ (bằng hình ảnh / chữ)", ex: "The mural depicts farmers bringing in the rice harvest.", exVi: "Bức tranh tường khắc hoạ cảnh nông dân thu hoạch lúa.", more: "depict sb **as** · **depiction** (n) of · gần: **portray** (thiên về cách nhìn), illustrate" },
          { w: "convey", pos: "v", ipa: "/kənˈveɪ/", vi: "truyền tải (ý, cảm xúc)", ex: "A single photograph can convey more than a page of statistics.", exVi: "Một bức ảnh có thể truyền tải nhiều hơn cả trang số liệu.", more: "convey **a message / an impression / emotion** · convey sth **to** sb · không dùng ~~convey about~~" },
          { w: "interpretation", pos: "n", ipa: "/ɪnˌtɜːprɪˈteɪʃn/", vi: "cách diễn giải; cách thể hiện (một tác phẩm)", ex: "Abstract art is open to more than one interpretation.", exVi: "Nghệ thuật trừu tượng có thể được diễn giải theo nhiều cách.", more: "**interpret** (v) sth **as** · be **open to** interpretation · **misinterpret** · AWL" },
          { w: "subjective", pos: "adj", ipa: "/səbˈdʒektɪv/", vi: "chủ quan", ex: "Taste in art is highly subjective, which makes funding decisions difficult.", exVi: "Gu nghệ thuật rất chủ quan, điều này khiến việc quyết định tài trợ trở nên khó.", more: "≠ **objective** (khách quan) · a subjective **judgement / experience** · **subjectivity** (n)" },
          { w: "thought-provoking", pos: "adj", ipa: "/ˈθɔːt prəvəʊkɪŋ/", vi: "gợi suy nghĩ", ex: "It was a thought-provoking documentary about the price of fame.", exVi: "Đó là một phim tài liệu gợi suy nghĩ về cái giá của danh tiếng.", more: "Thay cho interesting / meaningful khi khen phim, sách, triển lãm · gần: stimulating, challenging" },
          { w: "striking", pos: "adj", ipa: "/ˈstraɪkɪŋ/", vi: "nổi bật, gây ấn tượng mạnh (ngay khi nhìn)", ex: "The most striking feature of the painting is its use of light.", exVi: "Điểm nổi bật nhất của bức tranh là cách dùng ánh sáng.", more: "a striking **contrast / resemblance / feature** · **strikingly** different · cũng dùng tốt trong Task 1 (the most striking feature of the chart)" },
        ],
      },
      {
        t: "note",
        title: "⚠️ Lỗi người Việt hay sai với nhóm phê bình",
        items: [
          "~~The painting **describes** a battle~~ → tranh, ảnh, phim thì **depicts / shows / portrays**; describe là tả bằng **lời**.",
          "~~It **makes me remember** my childhood~~ không sai nhưng yếu → It **evokes** memories of / It **reminds me of** my childhood. (~~It reminds me my childhood~~ thiếu of.)",
          "~~a **meaningful** painting~~ dùng quá nhiều → nói rõ nghĩa gì: a **thought-provoking** / **moving** / **politically charged** painting.",
          "~~The artist wants to **express about** loneliness~~ → **convey a sense of** loneliness / **express** loneliness (không about).",
          "~~Art is very **subject**~~ → **subjective** (adj). subject là danh từ (đề tài, môn học).",
        ],
      },
      {
        t: "mcq",
        id: "t4d10-tv-nhom2",
        title: "Chọn từ đúng nhất (6 câu)",
        items: [
          { q: "1. The photograph ___ a street market in the 1950s.", options: ["describes", "depicts", "conveys", "evokes"], correct: 1, why: "Ảnh / tranh “khắc hoạ” một cảnh ⇒ depicts. describes dùng cho lời; conveys + thông điệp; evokes + cảm xúc." },
          { q: "2. The music ___ a strong sense of nostalgia.", options: ["depicts", "interprets", "evokes", "critiques"], correct: 2, why: "evoke a sense of / memories — gợi cảm xúc." },
          { q: "3. Her debut novel was critically ___ but sold very few copies.", options: ["acclaimed", "provocative", "subjective", "striking"], correct: 0, why: "critically acclaimed = được giới phê bình ca ngợi (collocation cố định)." },
          { q: "4. Whether a work of art is ‘good’ is a largely ___ judgement.", options: ["objective", "aesthetic value", "controversy", "subjective"], correct: 3, why: "largely subjective judgement — phần lớn là chủ quan. objective ngược nghĩa; hai phương án còn lại sai loại từ." },
          { q: "5. The poem is open to several ___ .", options: ["interpreters", "interpretations", "interprets", "interpretive"], correct: 1, why: "open to + danh từ số nhiều: interpretations (cách diễn giải). interpreter = phiên dịch viên." },
          { q: "6. The architect cared more about ___ appeal than about cost.", options: ["critique", "controversial", "aesthetic", "thought-provoking"], correct: 2, why: "aesthetic appeal = sức hấp dẫn thẩm mỹ." },
        ],
      },

      /* ── 3 ── */
      { t: "h", text: "3. Sáng tạo — 12 từ về tài năng và quá trình sáng tác" },
      {
        t: "vocab",
        items: [
          { w: "inspiration", pos: "n", ipa: "/ˌɪnspəˈreɪʃn/", vi: "cảm hứng; nguồn cảm hứng", ex: "She draws inspiration from the patterns of traditional textiles.", exVi: "Cô lấy cảm hứng từ hoa văn của vải dệt truyền thống.", more: "**draw / take / find** inspiration **from** · a **source of** inspiration · **inspire** (v) · **inspiring** ≠ **inspired** (xuất thần)" },
          { w: "imaginative", pos: "adj", ipa: "/ɪˈmædʒɪnətɪv/", vi: "giàu trí tưởng tượng, sáng tạo", ex: "The school was praised for its imaginative use of outdoor space.", exVi: "Trường được khen vì cách dùng không gian ngoài trời đầy sáng tạo.", more: "an imaginative **solution / child / design** · ≠ **imaginary** (không có thật) — xem mục 6 · **imagination** (n)" },
          { w: "originality", pos: "n", ipa: "/əˌrɪdʒəˈnæləti/", vi: "tính độc đáo, nguyên bản", ex: "The judges were looking for originality rather than technical perfection.", exVi: "Ban giám khảo tìm sự độc đáo hơn là sự hoàn hảo về kỹ thuật.", more: "**original** (adj): an original idea · lack originality · gần: **novelty** (cái mới lạ, đôi khi hàm ý chóng chán)" },
          { w: "innovative", pos: "adj", ipa: "/ˈɪnəveɪtɪv/", vi: "đổi mới, có tính cách tân", ex: "The studio is known for its innovative approach to animation.", exVi: "Xưởng phim nổi tiếng với cách tiếp cận cách tân trong hoạt hình.", more: "**innovate** (v) · **innovation** (n) · an innovative **approach / design / company** · AWL" },
          { w: "gifted", pos: "adj", ipa: "/ˈɡɪftɪd/", vi: "có năng khiếu bẩm sinh", ex: "Even the most gifted musicians practise for several hours a day.", exVi: "Ngay cả nhạc công năng khiếu nhất cũng tập vài giờ mỗi ngày.", more: "a gifted **child / pianist** · be gifted **at / in** · have a **gift for** languages · mạnh hơn **talented**; **skilled** = giỏi nhờ rèn luyện" },
          { w: "improvise", pos: "v", ipa: "/ˈɪmprəvaɪz/", vi: "ứng tác, ứng biến", ex: "Jazz musicians are trained to improvise around a simple melody.", exVi: "Nhạc công jazz được luyện để ứng tác quanh một giai điệu đơn giản.", more: "**improvisation** (n) · improvise a speech / a meal · dùng tốt ngoài nghệ thuật: We had no projector, so I had to improvise." },
          { w: "spontaneous", pos: "adj", ipa: "/spɒnˈteɪniəs/", vi: "tự phát, không sắp đặt trước", ex: "The best photographs are often spontaneous rather than posed.", exVi: "Những bức ảnh đẹp nhất thường tự nhiên chứ không tạo dáng.", more: "**spontaneity** (n) /ˌspɒntəˈneɪəti/ · spontaneous **applause / decision** · **spontaneously** (adv)" },
          { w: "self-expression", pos: "n", ipa: "/ˌself ɪkˈspreʃn/", vi: "sự thể hiện bản thân", ex: "For many teenagers, music is the main form of self-expression.", exVi: "Với nhiều thanh thiếu niên, âm nhạc là hình thức thể hiện bản thân chính.", more: "a **form / means of** self-expression · **freedom of expression** (tự do biểu đạt — Task 2)" },
          { w: "ingenuity", pos: "n", ipa: "/ˌɪndʒəˈnjuːəti/", vi: "sự tài tình, óc sáng chế", ex: "With a little ingenuity, old pallets can be turned into furniture.", exVi: "Chỉ cần một chút tài tình, pa-lét cũ có thể biến thành đồ nội thất.", more: "**ingenious** (adj) /ɪnˈdʒiːniəs/: an ingenious solution · ≠ **ingenuous** (ngây thơ) · human ingenuity" },
          { w: "prolific", pos: "adj", ipa: "/prəˈlɪfɪk/", vi: "sáng tác nhiều, sung sức", ex: "He was a prolific painter who produced over two thousand works.", exVi: "Ông là hoạ sĩ sáng tác sung sức, để lại hơn hai nghìn tác phẩm.", more: "a prolific **writer / composer / goal scorer** · chỉ dùng cho người (hoặc thời kỳ), không dùng cho vật" },
          { w: "nurture", pos: "v", ipa: "/ˈnɜːtʃə/", vi: "nuôi dưỡng, vun đắp", ex: "Good teachers nurture creativity instead of rewarding only correct answers.", exVi: "Giáo viên giỏi nuôi dưỡng sự sáng tạo thay vì chỉ thưởng cho đáp án đúng.", more: "nurture **talent / creativity / a relationship** · **nature versus nurture** (bẩm sinh hay nuôi dưỡng) — đúng tên một đề Task 2 kinh điển" },
          { w: "stifle", pos: "v", ipa: "/ˈstaɪfl/", vi: "bóp nghẹt, kìm hãm", ex: "Too many rules can stifle creativity in young children.", exVi: "Quá nhiều quy tắc có thể bóp nghẹt sự sáng tạo ở trẻ nhỏ.", more: "stifle **creativity / innovation / debate** · **stifling** (adj): a stifling atmosphere · ≠ nurture, foster, encourage" },
        ],
      },
      {
        t: "table",
        head: ["Danh từ", "Động từ", "Tính từ", "Người"],
        rows: [
          ["creation · creativity", "create", "creative", "creator"],
          ["imagination", "imagine", "imaginative · imaginary", "—"],
          ["innovation", "innovate", "innovative", "innovator"],
          ["inspiration", "inspire", "inspiring · inspired · inspirational", "—"],
          ["originality · origin", "originate", "original", "originator"],
          ["sculpture", "sculpt", "sculptural", "sculptor"],
          ["exhibition · exhibit", "exhibit", "—", "exhibitor"],
          ["interpretation", "interpret", "interpretive", "interpreter"],
          ["criticism · critique", "criticise · critique", "critical", "critic"],
          ["appreciation", "appreciate", "appreciative", "—"],
        ],
        caption: "Họ từ — phần Summary completion và câu Writing hay đòi đổi loại từ.",
      },
      {
        t: "quiz",
        id: "t4d10-tv-ho-tu",
        kind: "fill",
        title: "Đổi dạng từ trong ngoặc (8 câu)",
        items: [
          { q: "1. Children need time for free, ___ (imagine) play.", answers: ["imaginative"] },
          { q: "2. The design was praised for its ___ (original).", answers: ["originality"] },
          { q: "3. The prize rewards ___ (innovate) in digital art.", answers: ["innovation"] },
          { q: "4. Her speech was truly ___ (inspire); half the audience signed up to volunteer.", answers: ["inspiring", "inspirational"] },
          { q: "5. He is a ___ (sculpture) who works mainly in recycled metal.", answers: ["sculptor"] },
          { q: "6. The film received harsh ___ (critic) for its historical errors.", answers: ["criticism"] },
          { q: "7. What struck me was the ___ (spontaneous) of the performance.", answers: ["spontaneity"] },
          { q: "8. It was an ___ (ingenuity) way of saving space.", answers: ["ingenious"] },
        ],
      },

      /* ── 4 ── */
      { t: "h", text: "4. Nghệ thuật trong xã hội — 11 từ cho Task 2 + 5 từ âm nhạc vòng 2" },
      {
        t: "vocab",
        items: [
          { w: "patron", pos: "n", ipa: "/ˈpeɪtrən/", vi: "người bảo trợ (nghệ thuật); khách quen", ex: "For centuries, wealthy patrons decided which artists could afford to work.", exVi: "Suốt nhiều thế kỷ, các nhà bảo trợ giàu có quyết định nghệ sĩ nào đủ điều kiện làm nghề.", more: "a patron **of the arts** · **patronage** (n) /ˈpætrənɪdʒ/ · ≠ **patronise** (ra vẻ kẻ cả — nghĩa chê)" },
          { w: "subsidise", pos: "v", ipa: "/ˈsʌbsɪdaɪz/", vi: "trợ cấp, bao cấp một phần", ex: "Many governments subsidise orchestras that could not survive on ticket sales alone.", exVi: "Nhiều chính phủ trợ cấp cho các dàn nhạc không thể sống chỉ bằng tiền vé.", more: "**heavily** subsidised · **subsidy** (n; đã học Tập 3 Ngày 6) · state-subsidised theatre · AWL" },
          { w: "legacy", pos: "n", ipa: "/ˈleɡəsi/", vi: "di sản để lại (của một người, một thời)", ex: "The architect's legacy can be seen in almost every public building in the city.", exVi: "Di sản của vị kiến trúc sư hiện diện ở gần như mọi công trình công cộng trong thành phố.", more: "**leave** a lasting legacy · a cultural / colonial legacy · ≠ **heritage** (di sản chung của cộng đồng, truyền qua nhiều đời)" },
          { w: "elitist", pos: "adj", ipa: "/iˈliːtɪst/", vi: "chỉ dành cho giới tinh hoa (nghĩa chê)", ex: "Opera is often dismissed as elitist because of the price of tickets.", exVi: "Opera thường bị gạt đi là thứ chỉ dành cho giới tinh hoa vì giá vé.", more: "**elite** (n/adj — trung tính: an elite athlete) · **elitism** (n) · be seen / dismissed as elitist" },
          { w: "outreach", pos: "n", ipa: "/ˈaʊtriːtʃ/", vi: "hoạt động đưa dịch vụ tới cộng đồng", ex: "The museum runs an outreach programme for schools in rural areas.", exVi: "Bảo tàng có chương trình đưa hoạt động tới các trường ở nông thôn.", more: "an outreach **programme / worker / project** · community outreach · thường đứng trước danh từ" },
          { w: "appreciation", pos: "n", ipa: "/əˌpriːʃiˈeɪʃn/", vi: "sự cảm thụ, trân trọng", ex: "Art classes give children a lifelong appreciation of beauty.", exVi: "Giờ mỹ thuật cho trẻ khả năng cảm thụ cái đẹp suốt đời.", more: "an appreciation **of / for** · **develop / deepen** an appreciation · **appreciate** (v) · AWL" },
          { w: "mainstream", pos: "adj, n", ipa: "/ˈmeɪnstriːm/", vi: "chính thống, đại chúng; dòng chính", ex: "Street art has moved from the margins into the mainstream.", exVi: "Nghệ thuật đường phố đã đi từ bên lề vào dòng chính.", more: "mainstream **culture / media / education** · enter the mainstream · ≠ niche, alternative, underground" },
          { w: "commodify", pos: "v", ipa: "/kəˈmɒdɪfaɪ/", vi: "biến thành hàng hoá (nghĩa chê)", ex: "Critics argue that tourism commodifies local traditions.", exVi: "Giới phê bình cho rằng du lịch biến truyền thống địa phương thành hàng hoá.", more: "**commodity** (n, hàng hoá — AWL) · **commodification** (n) · nặng hơn **commercialise** (thương mại hoá; đã học Tập 3 Ngày 26)" },
          { w: "censorship", pos: "n", ipa: "/ˈsensəʃɪp/", vi: "sự kiểm duyệt", ex: "The debate over censorship of films is as old as cinema itself.", exVi: "Cuộc tranh luận về kiểm duyệt phim lâu đời như chính điện ảnh.", more: "**censor** (v/n) · impose / relax censorship · **self-censorship** · ≠ **censure** (khiển trách)" },
          { w: "philanthropy", pos: "n", ipa: "/fɪˈlænθrəpi/", vi: "hoạt động từ thiện quy mô lớn (của người giàu, quỹ)", ex: "Many concert halls depend on private philanthropy rather than public money.", exVi: "Nhiều nhà hát hoà nhạc dựa vào từ thiện tư nhân hơn là tiền công.", more: "**philanthropist** (n) · **philanthropic** (adj) · gần: charity (rộng hơn), sponsorship (tài trợ có quảng cáo)" },
          { w: "enrich", pos: "v", ipa: "/ɪnˈrɪtʃ/", vi: "làm phong phú thêm", ex: "Exposure to the arts enriches children's lives in ways that tests cannot measure.", exVi: "Tiếp xúc với nghệ thuật làm phong phú đời sống của trẻ theo cách bài thi không đo được.", more: "enrich **sb's life / the curriculum / the experience** · **enrichment** (n) · culturally enriching" },
          { w: "composer", pos: "n", ipa: "/kəmˈpəʊzə/", vi: "nhà soạn nhạc", ex: "The composer wrote the piece in a single week.", exVi: "Nhà soạn nhạc viết bản nhạc chỉ trong một tuần.", more: "**compose** (v) · **composition** (n — bản nhạc; bố cục của bức tranh) · ≠ songwriter (viết ca khúc đại chúng)" },
          { w: "repertoire", pos: "n", ipa: "/ˈrepətwɑː/", vi: "vốn tiết mục; (bóng) vốn kỹ năng", ex: "The choir has more than two hundred songs in its repertoire.", exVi: "Dàn hợp xướng có hơn hai trăm bài trong vốn tiết mục.", more: "the classical repertoire · a **wide repertoire of** teaching techniques (nghĩa bóng — dùng được trong Writing)" },
          { w: "virtuoso", pos: "n, adj", ipa: "/ˌvɜːtʃuˈəʊsəʊ/", vi: "bậc thầy biểu diễn; điêu luyện", ex: "She gave a virtuoso performance on a borrowed violin.", exVi: "Cô có một màn trình diễn điêu luyện trên cây vĩ cầm đi mượn.", more: "a piano virtuoso · **virtuosity** (n) · số nhiều virtuosos" },
          { w: "rendition", pos: "n", ipa: "/renˈdɪʃn/", vi: "cách trình bày, phiên bản thể hiện (một bài hát, vở diễn)", ex: "The band closed with a slow rendition of a well-known folk song.", exVi: "Ban nhạc kết bằng một bản thể hiện chậm rãi của một bài dân ca quen thuộc.", more: "a moving / faithful rendition **of** · gần: version, interpretation, cover (không trang trọng)" },
          { w: "acoustic", pos: "adj", ipa: "/əˈkuːstɪk/", vi: "(nhạc cụ) mộc, không điện; thuộc âm học", ex: "He prefers the warm sound of an acoustic guitar.", exVi: "Anh thích âm thanh ấm của đàn ghi-ta mộc.", more: "an acoustic **set / version** · **acoustics** (n, số nhiều): The hall has excellent acoustics." },
        ],
      },
      {
        t: "quiz",
        id: "t4d10-tv-nhom4",
        kind: "fill",
        title: "Điền từ nhóm 4 (6 câu — chia đúng dạng)",
        items: [
          { q: "1. Without public money, ticket prices would double; the theatre is heavily ___ . (được trợ cấp)", answers: ["subsidised", "subsidized"] },
          { q: "2. Some people regard classical music as ___ , something only the rich can enjoy.", answers: ["elitist"] },
          { q: "3. The gallery's ___ programme takes paintings into hospitals and prisons.", answers: ["outreach"] },
          { q: "4. The concert hall is famous for its ___ : you can hear a whisper from the back row.", answers: ["acoustics"] },
          { q: "5. Selling traditional masks as cheap souvenirs ___ a sacred custom. (biến thành hàng hoá)", answers: ["commodifies"] },
          { q: "6. The director left a lasting ___ : three generations of film-makers copied his style.", answers: ["legacy"] },
        ],
      },

      /* ── 5 ── */
      { t: "h", text: "5. Mười bốn cụm ăn điểm cho Task 2 và Part 3" },
      {
        t: "table",
        head: ["Cụm", "Nghĩa", "Câu mẫu"],
        rows: [
          ["**public funding for the arts**", "ngân sách công cho nghệ thuật", "Public funding for the arts is usually the first budget to be cut."],
          ["**fund / subsidise the arts**", "tài trợ / trợ cấp cho nghệ thuật", "Should taxpayers be expected to subsidise the arts?"],
          ["**foster / nurture creativity**", "nuôi dưỡng sự sáng tạo", "Schools should foster creativity as well as discipline."],
          ["**stifle creativity**", "bóp nghẹt sáng tạo", "An exam-driven curriculum tends to stifle creativity."],
          ["**a creative outlet**", "lối thoát / chỗ xả cho sự sáng tạo", "Painting gives office workers a creative outlet."],
          ["**artistic merit**", "giá trị nghệ thuật", "The film was a commercial success but had little artistic merit."],
          ["**win critical acclaim**", "được giới phê bình ca ngợi", "The novel won critical acclaim without ever becoming a bestseller."],
          ["**be open to interpretation**", "có thể hiểu nhiều cách", "Like most modern poetry, the lyrics are open to interpretation."],
          ["**appeal to a wide / niche audience**", "hấp dẫn khán giả rộng / hẹp", "Experimental theatre appeals only to a niche audience."],
          ["**preserve cultural heritage**", "gìn giữ di sản văn hoá", "Museums exist partly to preserve cultural heritage for future generations."],
          ["**broaden sb's horizons**", "mở rộng tầm nhìn", "Exposure to foreign cinema broadens young people's horizons."],
          ["**hone one's skills / craft**", "mài giũa tay nghề", "She spent a decade honing her craft before her first exhibition."],
          ["**a sense of identity / belonging**", "ý thức bản sắc / thuộc về", "Folk music gives communities a shared sense of identity."],
          ["**a luxury rather than a necessity**", "thứ xa xỉ chứ không thiết yếu", "Opponents regard the arts as a luxury rather than a necessity."],
        ],
        caption: "Chép 5 cụm bạn thích nhất vào sổ; bài Viết hôm nay (tài trợ nghệ thuật) dùng được ít nhất 6 cụm.",
      },
      {
        t: "quiz",
        id: "t4d10-tv-cum-dich",
        kind: "translate",
        title: "Dịch Việt → Anh — dùng cụm ở bảng trên (5 câu)",
        grammar: "fund / subsidise the arts · stifle / foster creativity · a creative outlet · open to interpretation · a luxury rather than a necessity",
        items: [
          { q: "Một chương trình học nặng thi cử có xu hướng bóp nghẹt sự sáng tạo.", answers: ["An exam-driven curriculum tends to stifle creativity.", "An exam-oriented curriculum tends to stifle creativity.", "A curriculum driven by exams tends to stifle creativity."], hint: "exam-driven curriculum · tend to · stifle creativity" },
          { q: "Nhiều người coi nghệ thuật là thứ xa xỉ chứ không phải thứ thiết yếu.", answers: ["Many people regard the arts as a luxury rather than a necessity.", "Many people see the arts as a luxury rather than a necessity.", "Many people consider the arts a luxury rather than a necessity."], hint: "regard … as · a luxury rather than a necessity" },
          { q: "Âm nhạc cho thanh thiếu niên một lối thoát sáng tạo.", answers: ["Music gives teenagers a creative outlet.", "Music provides teenagers with a creative outlet.", "Music offers teenagers a creative outlet."], hint: "give sb · a creative outlet" },
          { q: "Bức tranh này có thể được hiểu theo nhiều cách.", answers: ["This painting is open to interpretation.", "This painting is open to several interpretations.", "The painting is open to interpretation."], hint: "be open to interpretation" },
          { q: "Chính phủ nên trợ cấp cho nghệ thuật để gìn giữ di sản văn hoá.", answers: ["Governments should subsidise the arts to preserve cultural heritage.", "The government should subsidise the arts to preserve cultural heritage.", "Governments should subsidise the arts in order to preserve cultural heritage.", "Governments should subsidize the arts to preserve cultural heritage."], hint: "subsidise the arts · preserve cultural heritage" },
        ],
      },

      /* ── 6 ── */
      { t: "h", text: "6. Sắc thái từ đồng nghĩa: khen, trung tính hay chê?" },
      {
        t: "p",
        text: "Từ điển Anh–Việt cho famous, renowned, notorious cùng một nghĩa: “nổi tiếng”. Nhưng **renowned** là nổi tiếng vì tài, **notorious** là nổi tiếng vì xấu. Phần nghĩa “kèm theo” đó gọi là ==sắc thái== (connotation). Ở band 6 bạn thay từ để khỏi lặp; ở band 7 bạn phải thay **đúng sắc thái**, nếu không câu văn nói ngược ý bạn.",
      },
      {
        t: "table",
        head: ["Ý chung", "Khen ( + )", "Trung tính", "Chê ( − )"],
        rows: [
          ["nổi tiếng", "**renowned** · **celebrated** · acclaimed", "famous · well-known", "**notorious** · **infamous**"],
          ["khác thường", "**unique** · **distinctive** · original", "unusual · uncommon", "**odd** · **eccentric** · bizarre"],
          ["như trẻ con", "**childlike** (hồn nhiên)", "youthful", "**childish** (ấu trĩ)"],
          ["đơn giản", "**understated** · minimalist · clean", "simple", "**plain** · **simplistic** (đơn giản hoá quá mức)"],
          ["nhiều chi tiết", "**intricate** · elaborate", "detailed", "**fussy** · cluttered"],
          ["màu mạnh", "**vivid** · bold · vibrant", "bright", "**garish** · gaudy (loè loẹt)"],
          ["theo truyền thống", "**time-honoured** · classic", "traditional", "**old-fashioned** · outdated"],
          ["chịu ảnh hưởng", "**inspired by** · in the tradition of", "influenced by", "**derivative** · imitative (bắt chước)"],
          ["tham vọng", "**ambitious** · daring", "large-scale", "**pretentious** (làm màu) · overblown"],
          ["dễ tiếp cận", "**accessible** · popular", "mainstream", "**commercial** · lowbrow (tầm thường)"],
          ["rẻ", "**affordable** · reasonably priced", "inexpensive · low-cost", "**cheap** (rẻ tiền, kém chất)"],
          ["quyết đoán", "**assertive** · confident", "direct", "**aggressive** · arrogant"],
        ],
        caption: "12 hàng × 3 cột. Trước khi dùng một từ “sang”, hỏi: nó khen hay chê?",
      },
      {
        t: "examples",
        items: [
          { en: "The city is renowned for its street art.  ↔  The district is notorious for its traffic.", vi: "Thành phố lừng danh về nghệ thuật đường phố. ↔ Quận đó khét tiếng kẹt xe. (~~notorious for its street art~~ = bạn đang chê.)" },
          { en: "Her paintings have a childlike simplicity.  ↔  His reaction to criticism was childish.", vi: "Tranh cô ấy có sự giản dị hồn nhiên. ↔ Phản ứng của anh ta trước lời chê thật ấu trĩ." },
          { en: "The design is elegant and understated.  ↔  The argument is simplistic: it ignores the cost.", vi: "Thiết kế thanh lịch và tiết chế. ↔ Lập luận đó giản đơn quá mức: nó bỏ qua chi phí. (simplistic luôn là chê — đừng dùng thay simple.)" },
          { en: "an ambitious installation  ↔  a pretentious installation", vi: "một tác phẩm sắp đặt đầy tham vọng ↔ một tác phẩm sắp đặt làm màu, tự cho là sâu sắc." },
        ],
      },
      {
        t: "p",
        text: "Ngoài khen / chê, từ đồng nghĩa còn khác nhau ở **độ mạnh** và ở **cách thức**. Hai bảng nhỏ dưới đây hay dùng nhất khi tả một tác phẩm hoặc một trải nghiệm (Part 2).",
      },
      {
        t: "table",
        head: ["Thang độ mạnh (yếu → mạnh)", "Ghi chú"],
        rows: [
          ["like → **be fond of** → **admire** → **be captivated by** → **be mesmerised by**", "captivated / mesmerised: bị hút hồn — chỉ dùng cho thứ thật sự đặc biệt"],
          ["good → **fine** → **impressive** → **outstanding** → **exceptional**", "Không dùng very với outstanding / exceptional (đã là mức cao nhất) → **truly** exceptional"],
          ["bad → **mediocre** (xoàng) → **poor** → **dreadful** / **appalling**", "mediocre /ˌmiːdiˈəʊkə/: không dở hẳn, nhưng nhạt — từ ăn điểm khi phê bình"],
          ["surprised → **struck** → **astonished** → **stunned** / **blown away** (nói)", "blown away là văn nói; Writing dùng astonished"],
          ["change → **modify** (chỉnh nhẹ) → **alter** → **transform** (đổi hẳn)", "Task 1 map / Task 2: đừng dùng transform cho thay đổi nhỏ"],
        ],
      },
      {
        t: "table",
        head: ["Động từ “nhìn”", "Sắc thái", "Ví dụ"],
        rows: [
          ["**glance** (at)", "liếc nhanh", "Most visitors only glance at each painting for a few seconds."],
          ["**glimpse** / catch a glimpse of", "thoáng thấy (không chủ ý)", "I caught a glimpse of the famous portrait over people's heads."],
          ["**gaze** (at)", "ngắm lâu, say mê", "She stood gazing at the ceiling for ten minutes."],
          ["**stare** (at)", "nhìn chằm chằm (có thể bất lịch sự)", "It is rude to stare at strangers."],
          ["**peer** (at / into)", "nhìn cố, vì khó thấy", "He peered at the tiny signature in the corner."],
          ["**scrutinise**", "soi xét kỹ từng chi tiết", "Experts scrutinised the brushwork for signs of forgery."],
        ],
        caption: "Sáu động từ thay cho look at — mỗi từ kể một câu chuyện khác.",
      },
      {
        t: "note",
        title: "⚠️ Văn phong (register): nói thì được, viết thì đổi",
        items: [
          "**Speaking**: blown away · stunning · pretty good · a bit odd · loads of · kids · I'm really into… — tự nhiên, đúng chỗ.",
          "**Writing Task 2**: astonished · striking · fairly good · somewhat unusual · a great many · children · I have a keen interest in…",
          "Chiều ngược lại cũng là lỗi: nói “I was utterly **mesmerised by the aesthetic merit** of the installation” ở Part 1 nghe như đọc bài viết. Part 1–2 chọn từ **ít gặp nhưng vẫn là từ nói**: striking, intricate, it grew on me.",
          "Sẽ học hệ thống hơn ở Tập 4 Ngày 18 (idiom & register). Hôm nay chỉ cần nhớ: ==mỗi từ mới, ghi kèm một chữ S (speaking), W (writing) hoặc S+W==.",
        ],
      },
      { t: "rule", formula: "Chọn từ đồng nghĩa = đúng NGHĨA + đúng SẮC THÁI ( + / 0 / − ) + đúng ĐỘ MẠNH + đúng VĂN PHONG (S / W)", vi: "Bốn phép thử trước khi thay một từ quen bằng một từ “sang”." },
      {
        t: "mcq",
        id: "t4d10-tv-sac-thai",
        title: "Chọn từ đúng sắc thái (8 câu)",
        items: [
          { q: "1. The architect is internationally ___ for her elegant bridges.", options: ["notorious", "infamous", "renowned", "eccentric"], correct: 2, why: "Khen tài ⇒ renowned. notorious / infamous = khét tiếng (chê)." },
          { q: "2. The reviewer disliked the film, calling its plot ___ — a weak copy of earlier thrillers.", options: ["derivative", "inspired", "original", "distinctive"], correct: 0, why: "“a weak copy” ⇒ derivative (bắt chước, thiếu mới) — chê. Ba từ còn lại là khen." },
          { q: "3. I admire the ___ quality of his drawings: they have the freshness of a five-year-old's.", options: ["childish", "immature", "simplistic", "childlike"], correct: 3, why: "“admire… freshness” ⇒ khen ⇒ childlike. childish / immature / simplistic đều chê." },
          { q: "4. The essay's argument is ___ : it assumes that money alone can solve the problem.", options: ["understated", "simplistic", "minimalist", "clean"], correct: 1, why: "Đơn giản hoá quá mức ⇒ simplistic (chê). understated / minimalist / clean là khen về phong cách." },
          { q: "5. The hotel lobby was decorated in ___ colours that made my eyes hurt.", options: ["vivid", "vibrant", "garish", "bold"], correct: 2, why: "“made my eyes hurt” ⇒ chê ⇒ garish (loè loẹt)." },
          { q: "6. Visitors spend an average of eight seconds per work; most merely ___ at the paintings.", options: ["glance", "gaze", "scrutinise", "peer"], correct: 0, why: "Tám giây, merely ⇒ liếc qua ⇒ glance. gaze = ngắm lâu; scrutinise = soi kỹ." },
          { q: "7. (Task 2) Critics argue that the exhibition was ___ , claiming a depth it did not possess.", options: ["ambitious", "daring", "large-scale", "pretentious"], correct: 3, why: "“claiming a depth it did not possess” = làm màu ⇒ pretentious (chê)." },
          { q: "8. (Speaking Part 2) When I finally saw the real painting, I was completely ___ .", options: ["somewhat astonished by its aesthetic merit", "blown away", "in receipt of a strong impression", "subject to considerable surprise"], correct: 1, why: "Văn nói tự nhiên ⇒ blown away. Ba phương án còn lại là văn viết cứng, không ai nói vậy." },
        ],
      },

      /* ── 7 ── */
      { t: "h", text: "7. Mười bốn cặp từ dễ nhầm — vòng 2 (nối Tập 3 Ngày 28)" },
      {
        t: "p",
        text: "Tập 3 Ngày 28 đã xử 16 cặp nền (affect / effect, rise / raise, economic / economical, historic / historical…). Mười bốn cặp dưới đây tinh hơn: người viết band 6.5 vẫn nhầm, và mỗi lần nhầm là một lỗi **LR** giám khảo nhìn thấy ngay.",
      },
      {
        t: "table",
        caption: "A. Cùng gốc, khác nghĩa",
        head: ["Cặp", "Khác nhau", "Ví dụ đúng", "Phép thử"],
        rows: [
          ["**imaginary** · **imaginative**", "không có thật · giàu tưởng tượng", "an **imaginary** friend · an **imaginative** design", "Thay bằng “creative” được ⇒ imaginative"],
          ["**continual** · **continuous**", "lặp đi lặp lại (có ngắt) · liên tục không ngắt", "**continual** interruptions · a **continuous** line / **continuous** assessment", "Có khoảng nghỉ ở giữa ⇒ continual"],
          ["**alternate** · **alternative**", "luân phiên, cách một · (lựa chọn) khác, thay thế", "on **alternate** days · an **alternative** route", "Thay bằng “another possible” được ⇒ alternative"],
          ["**disinterested** · **uninterested**", "vô tư, không vụ lợi · không quan tâm", "a **disinterested** judge · **uninterested** in politics", "Chán, không thích ⇒ uninterested"],
          ["**critic** · **critique** · **criticism** · **critical**", "nhà phê bình · bài phân tích phê bình · sự chỉ trích · (adj) quan trọng sống còn / hay chê / có phân tích", "a film **critic** · a **critique** of capitalism · face **criticism** · **critical** thinking", "Người ⇒ critic; “a … of” ⇒ critique; không đếm được ⇒ criticism"],
          ["**worthless** · **priceless** · **invaluable**", "vô giá trị · vô giá (không định giá nổi) · cực kỳ hữu ích", "a **worthless** copy · a **priceless** vase · **invaluable** advice", "price**less** KHÔNG phải “không có giá”; in**valuable** KHÔNG phải “không quý”"],
          ["**especially** · **specially**", "nhất là, đặc biệt là · riêng cho một mục đích", "I love jazz, **especially** live. · a hall **specially** designed for concerts", "Đứng trước tính từ / V3 chỉ mục đích ⇒ specially"],
        ],
      },
      {
        t: "table",
        caption: "B. Gần âm hoặc gần nghĩa, khác hẳn cách dùng",
        head: ["Cặp", "Khác nhau", "Ví dụ đúng", "Phép thử"],
        rows: [
          ["**imply** · **infer**", "(người nói / bài viết) ngụ ý · (người nghe / người đọc) suy ra", "The writer **implies** that… · Readers can **infer** that…", "Ai là chủ ngữ? Tác giả ⇒ imply; người đọc ⇒ infer"],
          ["**complement** · **compliment**", "bổ sung cho nhau, làm hoàn chỉnh · (lời) khen", "The frame **complements** the painting. · She paid me a **compliment**.", "compl**e**ment ~ compl**e**te"],
          ["**principal** · **principle**", "chính, chủ yếu; hiệu trưởng · nguyên tắc", "the **principal** reason · a matter of **principle**", "Là tính từ ⇒ luôn là principal"],
          ["**adopt** · **adapt**", "áp dụng, nhận dùng; nhận nuôi · điều chỉnh cho hợp, thích nghi", "**adopt** a new policy · **adapt** a novel for film · **adapt to** change", "Có to / for phía sau ⇒ adapt"],
          ["**precede** · **proceed**", "đi trước, xảy ra trước · tiếp tục, tiến hành", "the years **preceding** the war · **proceed** with the plan", "**pre**- = trước"],
          ["**comprise** · **consist of** · **be composed of**", "gồm (không of) · gồm (có of, không bị động) · được cấu thành từ", "The collection **comprises** 300 works. · It **consists of** 300 works. · It **is composed of** 300 works.", "~~is consisted of~~ sai; is comprised of rất phổ biến nhưng nhiều sách văn phong coi là sai ⇒ nên tránh trong bài thi"],
          ["**ensure** · **assure** · **insure**", "bảo đảm (việc gì xảy ra) · cam đoan với ai · mua bảo hiểm", "**ensure** that the work is safe · **assure** visitors that… · **insure** the painting", "Sau nó là NGƯỜI ⇒ assure; là that ⇒ ensure"],
        ],
      },
      {
        t: "note",
        title: "⚠️ Bốn câu sai “kinh điển” của bài band 6.5",
        items: [
          "~~The writer **infers** that museums are unreliable~~ → The writer **implies**… (Bài Đọc hôm qua hỏi “What does the writer **imply**?” — bạn là người **infer**.)",
          "~~The **principle** aim of art education~~ → the **principal** aim.",
          "~~Art lessons are **invaluable**, so they should be cut~~ → invaluable = vô cùng quý ⇒ câu tự mâu thuẫn. Muốn nói “không có giá trị” ⇒ **of little value** / worthless.",
          "~~Young artists must **adopt to** the digital market~~ → **adapt to**. (adopt + tân ngữ trực tiếp: adopt new techniques.)",
        ],
      },
      {
        t: "mcq",
        id: "t4d10-tv-de-nham",
        title: "Từ dễ nhầm — chọn từ đúng (8 câu)",
        items: [
          { q: "1. The article does not say so directly, but it clearly ___ that the gallery wasted public money.", options: ["infers", "implies", "insures", "adopts"], correct: 1, why: "Chủ ngữ là bài viết ⇒ imply (ngụ ý). Người đọc mới infer." },
          { q: "2. Competitions should be judged by a ___ panel with no financial stake in the result.", options: ["uninterested", "disinteresting", "disinterested", "uninteresting"], correct: 2, why: "Vô tư, không vụ lợi ⇒ disinterested. uninterested = không quan tâm." },
          { q: "3. The museum's collection ___ more than four thousand objects.", options: ["comprises", "consists", "is consisted of", "composes of"], correct: 0, why: "comprise + tân ngữ trực tiếp. consist cần of; is consisted of / composes of sai." },
          { q: "4. The soft lighting ___ the warm colours of the paintings perfectly.", options: ["compliments", "complies", "completes with", "complements"], correct: 3, why: "Bổ sung, làm tôn lên ⇒ complements. compliment = khen." },
          { q: "5. The ___ reason for the decline in audiences is the cost of tickets.", options: ["principle", "principal", "principled", "principally"], correct: 1, why: "Tính từ “chính” ⇒ principal." },
          { q: "6. The original manuscript, written in the composer's own hand, is ___ .", options: ["worthless", "valueless", "priceless", "invaluable advice"], correct: 2, why: "Quý tới mức không định giá nổi ⇒ priceless. worthless / valueless = vô giá trị." },
          { q: "7. The novel was ___ for the stage by a young playwright.", options: ["adapted", "adopted", "adept", "adapted to"], correct: 0, why: "Chuyển thể ⇒ adapt sth for. adopt = nhận dùng / nhận nuôi." },
          { q: "8. The building work caused ___ noise: it stopped and started all day.", options: ["continuous", "continued", "continuing", "continual"], correct: 3, why: "Lặp lại, có ngắt quãng (stopped and started) ⇒ continual. continuous = không ngắt." },
        ],
      },
      { t: "rule", formula: "imply (tác giả) ↔ infer (người đọc)  ·  principal (adj: chính) ↔ principle (n: nguyên tắc)  ·  adapt to / for ↔ adopt + N  ·  comprise + N = consist of + N", vi: "Bốn cặp sai nhiều nhất trong bài viết band 6.5 — thuộc bốn cặp này trước." },
      {
        t: "note",
        title: "💡 Cách học 51 từ hôm nay trong 7 ngày",
        items: [
          "Hôm nay: bấm **Che nghĩa** ở từng khối, tự nói nghĩa + một collocation. Từ nào ngập ngừng ⇒ đánh dấu.",
          "Từ tự vào bộ thẻ **“Từ của khoá — Tập 4”** (Flashcards). Ôn theo lịch ngắt quãng: ngày 1 · 2 · 4 · 7.",
          "Mỗi ngày chọn **5 từ** viết thành một đoạn 60 từ về một tác phẩm bạn thích; đọc to đoạn đó — một công đôi việc cho Part 2.",
          "Mục tiêu: 7 ngày sau che nghĩa vẫn nhớ ≥ 40 / 51.",
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI 2 — VIẾT ═══════════════════════════ */
  {
    id: "t4d10-viet",
    kind: "writing",
    title: "Viết: Discussion band 7 — thesis có điều kiện + hai góc + đánh giá từng góc",
    goal: "Viết một bài “Discuss both views and give your own opinion” 290–340 từ đạt mức band 7: luận điểm có điều kiện ngay ở mở bài, mỗi quan điểm được thuật công bằng rồi được ĐÁNH GIÁ (đúng tới đâu, sai từ đâu), ý kiến của bạn hiện rõ suốt bài chứ không chỉ ở kết luận — đẩy TR (ý kiến rõ suốt bài, ý được mở rộng và chống đỡ) và CC (tiến triển rõ) từ 6 lên 7.",
    minutes: 100,
    blocks: [
      {
        t: "recap",
        title: "Bài này học gì · đẩy tiêu chí nào",
        items: [
          "**Ôn rồi nâng**: Tập 2 Ngày 6 (đề có / không có “give your opinion”), Tập 3 Ngày 10 (ba biến thể, hai thân bài cân đối, balanced opinion). Những thứ đó đưa bạn tới band 6. Hôm nay thêm **một động tác** để lên 7: ==đánh giá== (evaluation).",
          "Bài band 6 **kể** hai quan điểm rồi **cộng** ý kiến ở kết bài. Bài band 7 **cân** từng quan điểm: nó đúng trong trường hợp nào, dựa trên giả định gì, yếu ở đâu — và ý kiến của người viết **lộ ra ngay trong lúc cân**.",
          "**Thesis band 7** không phải “I agree with the second view” mà là câu có **điều kiện / phạm vi**: X đúng với loại A, nhưng với loại B thì cần Y.",
          "Thuật quan điểm **công bằng** (bản mạnh nhất của nó), không dựng “người rơm” để đánh. Giám khảo coi đó là dấu hiệu của tư duy band 7+.",
          "Đề hôm nay dùng từ vựng bài 1: public funding for the arts · subsidise · a luxury · heritage · outreach · appreciation.",
          "Tiêu chí được đẩy: **TR** và **CC**; kèm **GRA** (câu nhượng bộ, mệnh đề quan hệ whose, provided that) và **LR** (collocation chủ đề nghệ thuật).",
        ],
      },

      /* ── 1 ── */
      { t: "h", text: "1. Discussion: band 6 và band 7 khác nhau ở đâu" },
      {
        t: "table",
        head: ["Tiêu chí", "Band 6 (Tập 3 Ngày 10)", "Band 7 (hôm nay)"],
        rows: [
          ["**TR** — ý kiến", "Có ý kiến, rõ ở mở bài và kết bài; thân bài chủ yếu **thuật**", "Ý kiến **rõ suốt bài**: mỗi thân bài kết thúc bằng nhận định của người viết về quan điểm vừa thuật"],
          ["**TR** — phát triển ý", "Mỗi quan điểm 2–3 lý do, mỗi lý do một câu giải thích; đôi chỗ khái quát", "Mỗi quan điểm **2 lý do đào sâu**: lý do → vì sao → ví dụ cụ thể / hệ quả → **giới hạn** của lý do đó"],
          ["**CC**", "Hai thân bài cân đối; từ nối đủ loại nhưng máy móc (On the one hand… Firstly… Moreover…)", "Tiến triển: thuật → đánh giá → nối sang góc kia bằng **ý** (Supporters of state funding argue precisely that…), không chỉ bằng từ nối"],
          ["**LR**", "Từ đúng chủ đề, còn chung chung (important, good for, a lot of money)", "Collocation chủ đề + động từ thuật có **thái độ** (contend, concede, overlook) + ngôn ngữ đánh giá (holds for, less convincing when applied to)"],
          ["**GRA**", "Trộn đơn + phức; có lỗi nhỏ", "Câu nhượng bộ (While I accept that…, Granted,…), whose, provided that, cụm phân từ; **đa số câu không lỗi**"],
        ],
        caption: "Tóm một dòng: band 6 = hai bản tường thuật + một ý kiến; band 7 = hai bản tường thuật CÓ CHẤM ĐIỂM + một phán quyết.",
      },
      {
        t: "sodo",
        kind: "compare",
        title: "Cùng một thân bài — hai cách viết",
        cols: [
          { title: "Band 6: kể", items: ["Some people think artists should fund themselves.", "Lý do 1. Lý do 2. Lý do 3.", "(sang đoạn khác)", "Người đọc không biết BẠN nghĩ gì về ba lý do đó"] },
          { title: "Band 7: kể rồi cân", items: ["Those who favour self-funding make two serious points.", "Lý do 1 (đào sâu). Lý do 2 (đào sâu).", "**This reasoning holds for…, but is less convincing when applied to…**", "Người đọc thấy lập trường của bạn hình thành ngay trong đoạn"] },
        ],
      },

      /* ── 2 ── */
      { t: "h", text: "2. Ôn 60 giây: đếm vế đề và ba biến thể" },
      {
        t: "table",
        head: ["Câu lệnh của đề", "Số việc phải làm", "Thiếu thì sao"],
        rows: [
          ["Discuss both views **and give your own opinion**.", "**3**: thuật A · thuật B · nêu ý kiến", "Thiếu ý kiến ⇒ TR tối đa 5"],
          ["Discuss both views.", "**2**: thuật A · thuật B (ý kiến có thể rất nhẹ ở kết)", "Nghiêng hẳn một bên, bỏ bên kia ⇒ TR tụt"],
          ["Discuss both views and give your opinion — hai quan điểm **không loại trừ nhau**", "**3**, và ý kiến thường là **kết hợp có điều kiện**", "Chọn hẳn một bên vẫn được, nhưng phải giải thích vì sao bên kia không đủ"],
        ],
        caption: "Chi tiết: Tập 2 Ngày 6 · Tập 3 Ngày 10 mục 2. Đề hôm nay thuộc dòng 3.",
      },
      {
        t: "note",
        title: "💡 Mẹo nhận ra hai quan điểm có loại trừ nhau không",
        items: [
          "Thử ghép hai quan điểm bằng **and**: “The arts should receive government money **and** earn money from tickets.” Câu ghép vẫn có nghĩa ⇒ **không loại trừ** ⇒ thesis band 7 gần như luôn là “cả hai, nhưng mỗi thứ cho một phần”.",
          "Câu ghép vô nghĩa (“Children should start school at four **and** at seven”) ⇒ loại trừ ⇒ bạn phải chọn, và nhượng bộ bên kia.",
          "Đề thật khoảng hai phần ba là loại không loại trừ. Người viết band 6 vẫn ép mình chọn một bên, rồi thân bài tự mâu thuẫn.",
        ],
      },

      /* ── 3 ── */
      { t: "h", text: "3. Thesis band 7: câu luận điểm có điều kiện hoặc phạm vi" },
      {
        t: "p",
        text: "**Thesis** (câu luận điểm) là câu cuối mở bài, nói bạn đứng ở đâu. Thesis band 6: “I believe the government should support the arts.” — rõ, nhưng **phẳng**: nó không cho thấy bạn đã cân bên kia. Thesis band 7 mang sẵn kết quả của việc cân. Có ba khuôn.",
      },
      {
        t: "patterns",
        rows: [
          {
            formula: "While I accept that + [điểm đúng của A], I would argue that + [lập trường B]",
            vi: "Khuôn NHƯỢNG BỘ: nhận phần đúng của bên mình không chọn, rồi nêu lập trường.",
            examples: [
              { en: "While I accept that popular forms of art can pay their own way, I would argue that public money remains essential for work that is valuable but unprofitable.", vi: "Dù tôi thừa nhận các loại hình nghệ thuật đại chúng có thể tự nuôi mình, tôi cho rằng tiền công vẫn thiết yếu cho những tác phẩm có giá trị nhưng không sinh lời." },
            ],
          },
          {
            formula: "In my view, A + V, provided that / as long as + [điều kiện]",
            vi: "Khuôn ĐIỀU KIỆN: ủng hộ một bên, kèm điều kiện để nó đúng.",
            examples: [
              { en: "In my view, governments should fund the arts, provided that the money reaches audiences who would otherwise be excluded.", vi: "Theo tôi, chính phủ nên tài trợ nghệ thuật, miễn là số tiền đó tới được những khán giả lẽ ra bị gạt ra ngoài." },
            ],
          },
          {
            formula: "I believe that A is appropriate for + [nhóm 1], whereas B is needed for + [nhóm 2]",
            vi: "Khuôn CHIA PHẠM VI: mỗi quan điểm đúng cho một phần của vấn đề.",
            examples: [
              { en: "I believe that the market is an adequate source of income for commercial entertainment, whereas state support is needed for heritage and experimental work.", vi: "Tôi tin rằng thị trường là nguồn thu đủ cho giải trí thương mại, còn sự hỗ trợ của nhà nước cần cho di sản và tác phẩm thể nghiệm." },
            ],
          },
        ],
      },
      {
        t: "note",
        title: "⚠️ Thesis hay hỏng thế nào ở band 6.5",
        items: [
          "~~This essay will discuss both views and give my opinion.~~ — đây là **lời hứa**, không phải luận điểm. Người đọc vẫn chưa biết bạn nghĩ gì. Band 7 nói luôn.",
          "~~Both views have advantages and disadvantages.~~ — đúng với mọi đề trên đời ⇒ vô nghĩa.",
          "~~In my opinion, I think that…~~ — lặp (In my opinion = I think). Chọn một.",
          "~~I partly agree with both sides.~~ — “partly” mà không nói **phần nào** thì là né. Khuôn chia phạm vi buộc bạn nói rõ phần nào.",
          "Thesis dài quá 45 từ ⇒ dễ sai ngữ pháp. Một câu, hai vế, 30–40 từ.",
        ],
      },
      { t: "rule", formula: "While I accept that + A (phần đúng), I would argue that + B (lập trường) + [cho trường hợp nào]", vi: "Thesis band 7 = nhượng bộ + lập trường + phạm vi. Viết câu này TRƯỚC khi viết bất cứ gì khác." },
      {
        t: "quiz",
        id: "t4d10-viet-thesis-dich",
        kind: "translate",
        title: "Dịch Việt → Anh — thesis band 7 (3 câu)",
        grammar: "While I accept that…, I would argue that… · In my view, …, provided that… · … is appropriate for…, whereas … is needed for…",
        items: [
          { q: "Dù tôi thừa nhận rằng y tế phải được ưu tiên, tôi cho rằng nghệ thuật vẫn xứng đáng được hỗ trợ từ ngân sách công.", answers: ["While I accept that healthcare must come first, I would argue that the arts still deserve public support.", "While I accept that healthcare must take priority, I would argue that the arts still deserve public support.", "While I accept that health care must come first, I would argue that the arts still deserve public support."], hint: "While I accept that · come first · I would argue that · deserve public support" },
          { q: "Theo tôi, chính phủ nên tài trợ cho các bảo tàng, miễn là chúng mở cửa miễn phí cho trẻ em.", answers: ["In my view, governments should fund museums, provided that they are free for children.", "In my view, the government should fund museums, provided that they are free for children.", "In my view, governments should fund museums, provided that they are free to children."], hint: "In my view · fund · provided that · free for children" },
          { q: "Tôi tin rằng bán vé là phù hợp với nhạc pop, còn trợ cấp là cần cho nhạc truyền thống.", answers: ["I believe that ticket sales are appropriate for pop music, whereas subsidies are needed for traditional music.", "I believe that ticket sales are appropriate for pop music, whereas subsidy is needed for traditional music.", "I believe ticket sales are appropriate for pop music, whereas subsidies are needed for traditional music."], hint: "ticket sales · appropriate for · whereas · subsidies are needed for" },
        ],
      },

      /* ── 4 ── */
      { t: "h", text: "4. Thuật một quan điểm cho công bằng: động từ thuật có thái độ" },
      {
        t: "p",
        text: "“Some people think… Other people think… They also think…” — ba lần think trong một bài là dấu hiệu band 6. Tiếng Anh học thuật có cả một dải **động từ thuật** (reporting verbs), và mỗi động từ cho biết **bạn** đứng ở đâu so với ý được thuật. Đây cũng là chỗ nối với bài Đọc hôm qua: bạn đã học cách **nghe** thái độ của tác giả; giờ bạn **tự đặt** thái độ vào câu.",
      },
      {
        t: "table",
        head: ["Động từ / cụm", "Thái độ của người viết", "Ví dụ"],
        rows: [
          ["**argue · maintain · contend · hold that**", "Trung tính — thuật một lập luận nghiêm túc", "Opponents of subsidy **contend that** the market is a fair test of value."],
          ["**point out · note · observe**", "Hàm ý: điều này **đúng là sự thật**", "They **point out that** pop concerts thrive without public money."],
          ["**claim · allege · assume**", "Giữ khoảng cách — chưa chắc đúng", "It is often **claimed that** good art will always find an audience."],
          ["**concede · acknowledge · admit**", "Bên này **nhận** một điểm của bên kia", "Even supporters of funding **concede that** committees can be conservative."],
          ["**overlook · ignore · fail to consider**", "Người viết **chê** lập luận thiếu sót", "This view **overlooks** the audiences who cannot afford market prices."],
          ["**those who favour X · advocates / supporters / opponents of X · critics of X**", "Gọi tên nhóm — thay cho some people", "**Advocates of** state funding · **those who favour** self-funding"],
        ],
        caption: "Một bài 300 từ: 2 cách gọi nhóm + 4–5 động từ thuật khác nhau là đủ.",
      },
      {
        t: "note",
        title: "⚠️ Đừng dựng “người rơm” (straw man)",
        items: [
          "Người rơm = thuật bản **yếu nhất** của quan điểm đối phương để dễ bác: ~~Some people think art is useless and artists are lazy.~~ Không ai nghiêm túc nói vậy; giám khảo thấy ngay bạn chưa hiểu bên kia.",
          "Band 7: thuật bản **mạnh nhất**: “every pound given to an opera house is a pound not spent on hospital beds”. Bác được bản mạnh thì ý kiến của bạn mới có sức nặng.",
          "Phép thử: người giữ quan điểm đó đọc đoạn của bạn có gật đầu “đúng, tôi nghĩ vậy” không?",
        ],
      },

      /* ── 5 ── */
      { t: "h", text: "5. ĐÁNH GIÁ — động tác đưa bài từ 6 lên 7" },
      {
        t: "p",
        text: "**Đánh giá** (evaluation) = sau khi thuật xong một quan điểm, viết 1–2 câu trả lời: ==lập luận này đúng tới đâu?== Không phải “tôi đồng ý / không đồng ý”, mà là chỉ ra **ranh giới** của nó. Có năm phép đánh giá; mỗi thân bài dùng **một**.",
      },
      {
        t: "table",
        head: ["Phép đánh giá", "Câu hỏi bạn tự đặt", "Khung câu"],
        rows: [
          ["① **Giới hạn phạm vi**", "Đúng cho trường hợp nào, sai cho trường hợp nào?", "This reasoning **holds for** A. It is **less convincing**, however, **when applied to** B."],
          ["② **Chỉ ra giả định**", "Lập luận này ngầm coi điều gì là đúng?", "This argument **rests on the assumption that**… , which is **not always the case**."],
          ["③ **Cân nặng nhẹ**", "Lợi và hại, bên nào lớn hơn, với ai?", "These benefits, **while real**, are **outweighed by**… · … **carries more weight** in countries where…"],
          ["④ **Nhượng bộ rồi giữ ý**", "Bên kia chê điểm gì — chê đó dẫn tới đâu?", "**Granted**, … . **Yet** this is an argument for + V-ing, **not for** + V-ing."],
          ["⑤ **Đẩy tới cùng**", "Nếu làm đúng theo quan điểm này 100 % thì sao?", "**Left entirely to** the market, … **would** either… or… · **Taken to its logical conclusion**, this view would mean…"],
        ],
      },
      {
        t: "patterns",
        rows: [
          {
            formula: "This reasoning holds for + N. It is less convincing, however, when applied to + N, whose + N + V",
            vi: "Phép ①. Mệnh đề whose cho lý do vì sao trường hợp thứ hai khác.",
            examples: [
              { en: "This reasoning holds for commercial cinema or pop concerts. It is less convincing, however, when applied to classical music, whose costs are high and whose audiences are small.", vi: "Lý lẽ này đúng với điện ảnh thương mại hay hoà nhạc pop. Tuy nhiên nó kém thuyết phục khi áp vào nhạc cổ điển, loại hình có chi phí cao và khán giả ít." },
            ],
          },
          {
            formula: "Granted, + S + V (điểm yếu của bên mình). Yet this is an argument for + V-ing, not for + V-ing",
            vi: "Phép ④ — nối Tập 4 Ngày 2 (“nêu rồi bác”). Granted đứng đầu câu, có dấu phẩy.",
            examples: [
              { en: "Granted, public funding carries risks of its own: committees may reward safe, familiar work. Yet this is an argument for funding the arts transparently, not for withdrawing support altogether.", vi: "Đành rằng tài trợ công có rủi ro riêng: các hội đồng có thể ưu ái tác phẩm an toàn, quen thuộc. Nhưng đó là lý do để tài trợ minh bạch, chứ không phải để rút hẳn hỗ trợ." },
            ],
          },
          {
            formula: "Left (entirely) to + N, S + would + V  ·  Without + N, S + would + V",
            vi: "Phép ⑤ — cụm phân từ quá khứ thay cho If + S + were left to…",
            examples: [
              { en: "Left to ticket sales and sponsors, traditional theatre would either disappear or become a luxury reserved for the wealthy.", vi: "Nếu phó mặc cho tiền vé và nhà tài trợ, sân khấu truyền thống hoặc sẽ biến mất, hoặc thành thứ xa xỉ dành riêng cho người giàu." },
            ],
          },
          {
            formula: "This argument rests on the assumption that + S + V, which + V",
            vi: "Phép ② — nêu giả định ngầm, rồi nhận xét giả định đó.",
            examples: [
              { en: "This argument rests on the assumption that what sells is what has value, which confuses popularity with quality.", vi: "Lập luận này dựa trên giả định rằng thứ bán chạy là thứ có giá trị — điều đó lẫn lộn sự ưa chuộng với chất lượng." },
            ],
          },
        ],
      },
      {
        t: "note",
        title: "⚠️ Đánh giá KHÔNG phải là…",
        items: [
          "…lặp lại ý kiến: ~~I do not agree with this view.~~ ⇒ chưa nói **vì sao** và **tới đâu**.",
          "…thêm một lý do mới cho bên kia. Đánh giá nói về **lập luận vừa thuật**, không mở mặt trận mới.",
          "…một câu chung chung: ~~However, this view is not completely right.~~ ⇒ phải nói **không đúng ở chỗ nào**.",
          "…chê cả hai bên như nhau rồi kết “both have merits”. Cân xong phải có **bên nặng hơn** (hoặc mỗi bên thắng ở một phạm vi rõ ràng).",
        ],
      },
      { t: "rule", formula: "Thân bài band 7 = Thuật (ai + động từ thuật) → Lý do 1 đào sâu → Lý do 2 đào sâu → ĐÁNH GIÁ (holds for… / Granted… Yet… / Left to…, would…)", vi: "Câu đánh giá là câu cuối của mỗi thân bài — nơi ý kiến của bạn hiện ra giữa bài." },
      {
        t: "quiz",
        id: "t4d10-viet-danh-gia-dich",
        kind: "translate",
        title: "Dịch Việt → Anh — câu đánh giá (4 câu)",
        grammar: "This reasoning holds for… · less convincing when applied to… · Granted, … · rests on the assumption that… · Left to…, … would…",
        items: [
          { q: "Lý lẽ này đúng với các thành phố lớn.", answers: ["This reasoning holds for large cities.", "This reasoning holds for big cities.", "This reasoning holds true for large cities."], hint: "This reasoning holds for" },
          { q: "Tuy nhiên, nó kém thuyết phục khi áp dụng cho vùng nông thôn.", answers: ["It is less convincing, however, when applied to rural areas.", "However, it is less convincing when applied to rural areas.", "It is, however, less convincing when applied to rural areas."], hint: "less convincing · however · when applied to" },
          { q: "Lập luận này dựa trên giả định rằng mọi người đều mua nổi vé.", answers: ["This argument rests on the assumption that everyone can afford a ticket.", "This argument rests on the assumption that everyone can afford tickets.", "This argument rests on the assumption that everybody can afford a ticket."], hint: "rests on the assumption that · can afford" },
          { q: "Nếu phó mặc cho thị trường, nhiều nhà hát nhỏ sẽ đóng cửa.", answers: ["Left to the market, many small theatres would close.", "Left entirely to the market, many small theatres would close.", "Left to the market, many small theatres would close down."], hint: "Left to the market · would close" },
        ],
      },

      /* ── 6 ── */
      { t: "h", text: "6. Bố cục 4 đoạn có đánh giá — và khi nào dùng 5 đoạn" },
      {
        t: "sodo",
        kind: "flow",
        title: "Discussion band 7 — 4 đoạn, 290–340 từ",
        steps: [
          { label: "Mở bài (45–60 từ)", sub: "1 câu nêu cuộc tranh luận (paraphrase, không chép đề) + **thesis có điều kiện**" },
          { label: "Thân 1 (100–120 từ) — quan điểm bạn ÍT đồng ý hơn", sub: "thuật công bằng → 2 lý do đào sâu → **đánh giá: đúng tới đâu, hết đúng từ đâu**" },
          { label: "Thân 2 (100–120 từ) — quan điểm bạn nghiêng về", sub: "thuật → 2 lý do đào sâu → **Granted… Yet…** (tự nêu điểm yếu rồi giữ ý)" },
          { label: "Kết bài (40–50 từ)", sub: "phán quyết: mỗi bên đúng ở phạm vi nào + điều kiện; KHÔNG thêm ý mới" },
        ],
        caption: "Đặt quan điểm mình nghiêng về ở thân 2 để bài “đi lên”: người đọc kết thúc ở chỗ bạn đứng.",
      },
      {
        t: "note",
        title: "💡 Có nên viết thân bài thứ ba “My opinion”?",
        items: [
          "Được, nếu ý kiến của bạn là **một ý thứ ba thật sự** (không trùng A, không trùng B) và bạn viết nhanh: 5 đoạn ≈ 330–350 từ trong 40 phút.",
          "Rủi ro: thân 3 thường chỉ **lặp** những gì đã nói ⇒ CC giảm, lại dễ thiếu giờ soát bài. Với đa số người học, **4 đoạn có đánh giá lồng trong thân bài** an toàn hơn và đủ band 7.",
          "Dù chọn bố cục nào: **không** để ý kiến lần đầu xuất hiện ở kết bài.",
        ],
      },

      /* ── 7 ── */
      { t: "h", text: "7. Phân tích đề và dàn ý 6 phút" },
      {
        t: "p",
        text: "==ĐỀ:== **Some people believe that the arts, such as music, theatre and painting, should be supported by government money. Others think that artists and arts organisations should fund themselves through ticket sales and private sponsors. Discuss both these views and give your own opinion.**",
      },
      {
        t: "table",
        head: ["Bước", "Tự hỏi", "Ghi ra nháp"],
        rows: [
          ["1. Đếm vế", "Mấy việc?", "3: thuật A (nhà nước) · thuật B (tự nuôi) · ý kiến"],
          ["2. Loại trừ?", "Ghép bằng and có nghĩa không?", "Có ⇒ không loại trừ ⇒ thesis chia phạm vi"],
          ["3. Thesis", "Mỗi bên đúng cho phần nào?", "Thị trường đủ cho nghệ thuật đại chúng; nhà nước cần cho di sản + loại hình ít khán giả"],
          ["4. Thân 1 (B — tự nuôi)", "2 lý do mạnh nhất của họ?", "(a) ưu tiên ngân sách: bệnh viện trước · (b) thị trường là phép thử công bằng"],
          ["4b. Đánh giá B", "Đúng tới đâu?", "Đúng với phim thương mại, pop; sai với sân khấu truyền thống, nhạc cổ điển — phó mặc ⇒ biến mất hoặc thành xa xỉ"],
          ["5. Thân 2 (A — nhà nước)", "2 lý do mạnh nhất?", "(a) nghệ thuật là hàng hoá công: giữ di sản cho thế hệ chưa sinh · (b) giá trợ cấp + outreach cho trẻ nhà nghèo"],
          ["5b. Đánh giá A", "Điểm yếu của chính bên mình?", "Hội đồng chọn tác phẩm an toàn; có nơi dùng trợ cấp để kiểm soát ⇒ lý do để minh bạch, không phải để cắt"],
          ["6. Kết", "Phán quyết một câu?", "Tự bán được thì để tự bán; bảo vệ thứ thị trường sẽ để mất — với điều kiện tiền chia công khai"],
        ],
        caption: "6 phút lập dàn ý tiết kiệm 10 phút sửa giữa chừng. Dàn ý chỉ ghi từ khoá.",
      },

      /* ── 8 ── */
      { t: "h", text: "8. Bài mẫu band 6 (ước tính) — đọc và tìm xem dừng ở đâu" },
      {
        t: "p",
        text: "Bài dưới đây (250 từ) trả lời đủ ba vế, có ý kiến, chia đoạn rõ, gần như không lỗi ngữ pháp — một bài **band 6 – 6.5 điển hình**. Đọc xong, tự trả lời: trong hai thân bài, câu nào cho biết **người viết** nghĩ gì về các lý do vừa nêu?",
      },
      {
        t: "examples",
        items: [
          { en: "[Introduction] Nowadays, the arts play an important role in society. Some people think that the government should give money to the arts, while others think that artists should find money by themselves from tickets and sponsors. This essay will discuss both views, and I believe that the government should support the arts.", vi: "[Mở bài] Câu đầu sáo (Nowadays… important role). Thuật đề gần nguyên văn. “This essay will discuss” là lời hứa; luận điểm có nhưng phẳng — chưa cho thấy đã cân bên kia." },
          { en: "[Body 1] On the one hand, there are several reasons why the government should pay for the arts. Firstly, the arts are important for the culture of a country. If there is no money from the government, many theatres and museums will have to close and people will lose their culture. Secondly, the arts are good for people's mental health because they can relax after work. Moreover, tickets will be cheaper, so everyone can enjoy the arts, not only rich people.", vi: "[Thân 1 — 79 từ] Ba lý do, mỗi lý do một câu. “lose their culture”, “good for mental health” là khái quát, không ví dụ. Không có câu nào đánh giá." },
          { en: "[Body 2] On the other hand, some people believe that artists should fund themselves. The main reason is that the government has many more important things to spend money on, such as hospitals and schools. In addition, if artists are good, people will buy tickets to see them, so they do not need help. For example, many famous singers earn a lot of money from concerts. Furthermore, private companies can sponsor artists, and this is also good for their advertising.", vi: "[Thân 2 — 78 từ] Thuật đúng, cân đối với thân 1. Nhưng người viết KHÔNG nói gì về các lý do này: ca sĩ nổi tiếng tự sống được — vậy thì sao? Điều đó có bác luận điểm của bài không?" },
          { en: "[Conclusion] In conclusion, both views have their own reasons. In my opinion, I think the government should support the arts because culture is very important for a country, but artists should also try to earn money by themselves as much as they can.", vi: "[Kết bài] “both views have their own reasons” vô nghĩa. “In my opinion, I think” lặp. Ý kiến quay lại sau 160 từ vắng mặt; vế “but artists should also try…” là ý mới chưa hề được chứng minh." },
        ],
      },

      /* ── 9 ── */
      { t: "h", text: "9. Bài mẫu band 7 (ước tính) — cùng đề, cùng các lý do" },
      {
        t: "p",
        text: "Bài này (337 từ) dùng **đúng các lý do** của bài band 6 (bệnh viện, ca sĩ tự sống được, giữ văn hoá, vé rẻ cho mọi người). Khác biệt: thesis chia phạm vi, mỗi thân bài chỉ hai lý do nhưng đào sâu, và **câu cuối mỗi thân bài là một câu đánh giá**.",
      },
      {
        t: "examples",
        items: [
          { en: "[Introduction] Whether orchestras, theatres and galleries should depend on the taxpayer or on the market is a question that returns whenever public budgets are tight. While I accept that popular forms of art can and should pay their own way, I would argue that public money remains essential for work that is culturally valuable but unlikely ever to be profitable.", vi: "[Mở bài — 59 từ] Câu 1 đặt cuộc tranh luận vào bối cảnh thật (ngân sách eo hẹp), không chép đề. Câu 2 = thesis khuôn nhượng bộ + phạm vi: đại chúng tự nuôi · có giá trị mà không sinh lời thì cần tiền công." },
          { en: "[Body 1] Those who favour self-funding make two serious points. The first is one of priorities: every pound given to an opera house is a pound not spent on hospital beds, and it is hard to justify that choice to someone waiting for an operation. The second is that the market is a fair test of value: work that people genuinely want will find a paying audience. This reasoning holds for commercial cinema or pop concerts, which thrive without any subsidy. It is less convincing, however, when applied to forms such as traditional theatre or classical music, whose costs are high and whose audiences are small; left to ticket sales and sponsors, these would either disappear or become a luxury reserved for the wealthy.", vi: "[Thân 1 — 122 từ] Thuật bản MẠNH nhất của bên kia (make two serious points). Lý do 1 có hình ảnh cụ thể (giường bệnh, người chờ mổ). Hai câu cuối = đánh giá phép ① + ⑤: đúng với phim, pop; sai với sân khấu truyền thống — phó mặc thì biến mất." },
          { en: "[Body 2] Supporters of state funding argue precisely that some art is a public good rather than a product. A national museum preserves a country's heritage for generations who have not yet been born and therefore cannot buy a ticket, while subsidised prices and outreach programmes give children from poorer families an appreciation of culture that the market would never offer them. Granted, public funding carries risks of its own: committees may reward safe, familiar work, and in some countries subsidy has become a means of control. Yet these are arguments for funding the arts transparently and at arm's length, not for withdrawing support altogether.", vi: "[Thân 2 — 103 từ] “argue precisely that” nối thẳng từ câu đánh giá của thân 1. Hai lý do: thế hệ chưa sinh không thể mua vé · trẻ nhà nghèo. Rồi tự nêu điểm yếu của bên mình (Granted…) và giữ ý (Yet… not for…) = phép ④." },
          { en: "[Conclusion] In conclusion, the two views are less opposed than they first appear. Art that can attract a paying audience should be left to do so, but governments ought to protect the forms that a market alone would allow to vanish, provided that the money is distributed openly and reaches the widest possible public.", vi: "[Kết bài — 53 từ] Phán quyết: hai quan điểm không đối nghịch như tưởng; mỗi bên một phạm vi; kèm điều kiện (provided that). Không ý mới, không lặp nguyên câu thesis." },
        ],
      },
      {
        t: "table",
        caption: "So hai bài theo 4 tiêu chí — band ghi là ƯỚC TÍNH để học, không phải điểm thi thật.",
        head: ["Tiêu chí", "Bài band 6", "Bài band 7", "Bạn làm gì để chuyển"],
        rows: [
          ["**TR**", "Ý kiến ở mở bài + kết bài; hai thân bài chỉ thuật. Lý do khái quát (important for culture, good for mental health). Kết bài thêm ý chưa chứng minh.", "Ý kiến hiện ở **cả bốn đoạn**. Mỗi quan điểm 2 lý do có hình ảnh cụ thể. Mỗi thân bài kết bằng đánh giá. Kết bài là phán quyết có điều kiện.", "Viết câu đánh giá cho từng thân bài **ngay trong dàn ý** (bước 4b, 5b)"],
          ["**CC**", "On the one hand · Firstly · Secondly · Moreover · On the other hand · In addition · For example · Furthermore — 8 từ nối đầu câu; đoạn này không dẫn sang đoạn kia.", "The first… The second… · This reasoning · It… however · these · Granted… Yet these — nối bằng **quy chiếu**; thân 2 mở bằng “argue **precisely** that”, đáp lại thân 1.", "Bỏ Firstly / Moreover; dùng This reasoning, these, such + N để móc câu sau vào câu trước"],
          ["**LR**", "give money · pay for · important ×3 · good for ×2 · a lot of money · rich people", "depend on the taxpayer · pay their own way · a fair test of value · thrive without subsidy · a public good · outreach programmes · at arm's length", "Lấy 6 cụm từ mục 5 bài Từ vựng; thay think bằng 4 động từ thuật"],
          ["**GRA**", "Câu điều kiện loại 1, because, so — đúng nhưng ít loại. Gần như không lỗi.", "Whether… is a question that… · While I accept that… · since · which · whose… whose… · left to…, these would… · Granted… · provided that… — đa dạng, không lỗi.", "Mỗi đoạn một cấu trúc “đắt”: mở bài While…, thân 1 whose / left to…, thân 2 Granted… Yet…, kết provided that"],
        ],
      },
      {
        t: "note",
        title: "💡 Bài band 7 không có ý nào “thông minh” hơn",
        items: [
          "Cả hai bài cùng nói: bệnh viện quan trọng hơn · nghệ sĩ giỏi tự bán được vé · nhà nước giữ văn hoá · vé rẻ cho người không giàu.",
          "Bài band 6 có **6 lý do**, mỗi lý do 1 câu. Bài band 7 có **4 lý do**, mỗi lý do 1–2 câu **cộng** 4 câu đánh giá. Số từ dành cho “kể” giảm, số từ dành cho “cân” tăng.",
          "Vì vậy: muốn lên 7 ở TR, đừng tìm ý hay hơn — ==bớt một lý do, thêm một câu đánh giá==.",
        ],
      },

      /* ── 10 ── */
      { t: "h", text: "10. Câu khung dùng lại cho mọi đề Discussion band 7" },
      {
        t: "table",
        head: ["Vị trí", "Khung câu"],
        rows: [
          ["Mở bài — đặt cuộc tranh luận", "Whether X should… or… is a question that returns whenever… · The question of who should pay for / be responsible for X divides opinion."],
          ["Mở bài — thesis", "While I accept that A…, I would argue that B… · In my view, A…, provided that… · A is appropriate for…, whereas B is needed for…"],
          ["Thân — mở lời thuật", "Those who favour X make two serious points. · Advocates of X contend that… · The case for X rests mainly on…"],
          ["Thân — tách hai lý do", "The first is one of + N: … · The second is that…"],
          ["Thân — đánh giá ①", "This reasoning holds for…. It is less convincing, however, when applied to…, whose…"],
          ["Thân — đánh giá ②", "This argument rests on the assumption that…, which…"],
          ["Thân — đánh giá ③", "These benefits, while real, are outweighed by… · … carries more weight where…"],
          ["Thân — đánh giá ④", "Granted, …. Yet this is an argument for + V-ing, not for + V-ing."],
          ["Thân — đánh giá ⑤", "Left (entirely) to…, … would either… or…"],
          ["Nối thân 1 → thân 2", "Supporters of Y argue precisely that… · It is exactly this gap that advocates of Y point to."],
          ["Kết bài", "In conclusion, the two views are less opposed than they first appear. A should…, but B ought to…, provided that…"],
        ],
        caption: "Đừng thuộc cả 11 khung. Chọn 1 khung mỗi hàng, viết lại bằng nội dung của 3 đề khác nhau cho tới khi không cần nhìn.",
      },

      /* ── 11 ── */
      { t: "h", text: "11. Tám lỗi giữ bài Discussion ở band 6.5 — bảng tự soát" },
      {
        t: "table",
        head: ["Lỗi", "Vì sao mất điểm", "Sửa"],
        rows: [
          ["Ý kiến chỉ ở mở bài và kết bài", "TR 7 đòi “rõ **suốt** bài”", "Câu cuối mỗi thân bài = câu đánh giá"],
          ["Thuật bên mình không thích bằng 40 từ, bên mình thích 120 từ", "Không “discuss both”", "Hai thân bài chênh nhau ≤ 20 từ"],
          ["Người rơm", "Lập luận yếu, giám khảo không tin phần bác bỏ", "Thuật 2 lý do mạnh nhất của họ"],
          ["Mỗi thân bài 3–4 lý do, mỗi lý do một câu", "“ý chưa được mở rộng, chống đỡ” = band 6", "2 lý do × (vì sao + ví dụ / hệ quả)"],
          ["Ví dụ chung chung (For example, many countries…)", "Band 7 cho phép “đôi chỗ khái quát” — không phải chỗ nào cũng khái quát", "Một hình ảnh cụ thể mỗi thân bài (giường bệnh; trẻ nhà nghèo)"],
          ["8 từ nối đầu câu", "CC: “lạm dụng / máy móc”", "≤ 4 từ nối; còn lại dùng this, these, such, the first / the second"],
          ["Kết bài thêm ý mới hoặc đổi lập trường", "Mâu thuẫn với thesis ⇒ TR tụt", "Kết = phán quyết đã có trong thesis, nói lại bằng lời khác"],
          ["Từ “sang” sai sắc thái (notorious artists, simplistic design)", "LR: lỗi chọn từ", "Soát bằng 4 phép thử ở bài Từ vựng mục 6"],
        ],
      },
      {
        t: "mcq",
        id: "t4d10-viet-nhan-dien",
        title: "Nhận diện — 6 câu",
        items: [
          { q: "1. Câu nào là thesis band 7 cho đề: “Some think children should learn art at school; others say school time should go to academic subjects. Discuss both views and give your opinion.”", options: ["This essay will discuss both views and give my opinion.", "Both views have advantages and disadvantages.", "While I accept that core subjects need the most time, I would argue that art deserves a regular place in the timetable, at least in primary school.", "In my opinion, I think art is very important."], correct: 2, why: "Nhượng bộ (While I accept that…) + lập trường + phạm vi (at least in primary school). A là lời hứa; B vô nghĩa; D lặp và phẳng." },
          { q: "2. Câu nào là câu ĐÁNH GIÁ (không phải câu thuật, không phải lý do mới)?", options: ["This reasoning holds for well-funded city schools, but is far less convincing when applied to rural schools with no specialist teachers.", "Supporters of art lessons argue that drawing develops creativity.", "Moreover, music improves memory.", "Some people think art is a waste of time."], correct: 0, why: "A chỉ ra lập luận đúng tới đâu (phép ①). B, D là thuật; C là lý do mới." },
          { q: "3. Câu nào dựng “người rơm”?", options: ["Opponents point out that timetables are already crowded.", "Critics contend that exam results depend on core subjects.", "Those who favour academic subjects argue that literacy underpins all later learning.", "People who oppose art lessons simply do not care about children's happiness."], correct: 3, why: "D gán cho đối phương một động cơ xấu mà họ không hề nói ⇒ người rơm. A, B, C thuật lý do thật của họ." },
          { q: "4. Động từ thuật nào cho thấy người viết GIỮ KHOẢNG CÁCH với ý được thuật?", options: ["point out", "claim", "note", "observe"], correct: 1, why: "claim = “họ nói vậy, chưa chắc đúng”. point out / note / observe hàm ý điều đó là sự thật." },
          { q: "5. Chọn câu hoàn chỉnh đúng ngữ pháp: “Granted, art lessons are expensive. ___”", options: ["Yet this is an argument for share resources between schools, not for abolish the subject.", "Yet this is an argument to sharing resources between schools, not abolishing the subject.", "Yet this is an argument for sharing resources between schools, not for abolishing the subject.", "But yet this argues sharing resources, not for abolish."], correct: 2, why: "an argument for + V-ing, not for + V-ing. A thiếu -ing; B sai giới từ (to); D lỗi chồng." },
          { q: "6. Kết bài nào hợp với thesis ở câu 1?", options: ["In conclusion, academic subjects are the only thing that matters at school.", "In conclusion, although literacy and numeracy must remain the priority, a modest, regular art lesson costs little and gives young children something those subjects cannot.", "In conclusion, both sides have good points, and it depends on each person.", "In conclusion, governments should also build more museums."], correct: 1, why: "B nói lại phán quyết của thesis bằng lời khác (ưu tiên môn chính + giữ chỗ cho mỹ thuật ở tuổi nhỏ). A đổi lập trường; C né; D thêm ý mới." },
        ],
      },

      /* ── 12 ── */
      { t: "h", text: "12. Viết bài — AI chấm 4 tiêu chí (40 phút)" },
      {
        t: "note",
        title: "📌 Quy trình 40 phút",
        items: [
          "**6 phút** — dàn ý theo bảng mục 7 (viết sẵn thesis và hai câu đánh giá).",
          "**28 phút** — viết: mở 4 · thân 1 10 · thân 2 10 · kết 4.",
          "**6 phút** — soát: (1) ý kiến có ở cả bốn đoạn? (2) hai thân bài chênh ≤ 20 từ? (3) ≤ 4 từ nối đầu câu? (4) mạo từ, số nhiều, chia động từ; (5) từ “sang” đúng sắc thái?",
          "Đề 1 là đề đã phân tích — **đừng nhìn bài mẫu khi viết**; viết bằng ví dụ của riêng bạn (một nhà hát, một lễ hội, một bảo tàng bạn biết).",
        ],
      },
      {
        t: "essay",
        id: "t4d10-viet-bai-1",
        task: "Task 2",
        prompt: "Some people believe that the arts, such as music, theatre and painting, should be supported by government money. Others think that artists and arts organisations should fund themselves through ticket sales and private sponsors. Discuss both these views and give your own opinion. Give reasons for your answer and include any relevant examples from your own knowledge or experience. Write at least 250 words.",
        minWords: 250,
        tips: [
          "Thesis có điều kiện / phạm vi ở cuối mở bài — không viết “This essay will discuss…”.",
          "Mỗi thân bài: thuật → 2 lý do đào sâu → 1–2 câu đánh giá.",
          "Dùng ít nhất 4 động từ thuật khác nhau; tối đa 4 từ nối đầu câu.",
          "Dùng 5–6 cụm của bài Từ vựng: subsidise the arts, a public good, a luxury rather than a necessity, outreach, heritage, appeal to a niche audience.",
        ],
      },
      {
        t: "essay",
        id: "t4d10-viet-bai-2",
        task: "Task 2",
        prompt: "(Luyện thêm — đề mới, tự lập dàn ý) Some people think that artistic ability is something a person is born with. Others believe that anyone can become a good artist or musician with enough teaching and practice. Discuss both these views and give your own opinion. Give reasons for your answer and include any relevant examples from your own knowledge or experience. Write at least 250 words.",
        minWords: 250,
        tips: [
          "Hai quan điểm có loại trừ nhau không? Thử ghép bằng and (nature AND nurture).",
          "Từ dùng được: gifted, nurture, hone one's craft, prolific, virtuoso, stifle / foster creativity.",
          "Gợi ý phép đánh giá: “holds for the very top level… less convincing when applied to ordinary competence”.",
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI 3 — NÓI ═══════════════════════════ */
  {
    id: "t4d10-noi",
    kind: "speaking",
    title: "Nói: Part 2 — tả đồ vật / hoạt động ở band 7: từ ít gặp, idiom tự nhiên",
    goal: "Nói trọn 2 phút về một đồ vật (một tác phẩm, một món đồ có ý nghĩa) hoặc một hoạt động sáng tạo mà không gắng sức: có chi tiết giác quan, một câu chuyện nhỏ, 2–3 idiom đúng nguyên dạng và từ ít gặp đúng văn nói; phát âm rõ bốn âm /tʃ/ /dʒ/ /tr/ /dr/ — đẩy LR và FC của Speaking lên band 7.",
    minutes: 80,
    blocks: [
      {
        t: "recap",
        title: "Bài này học gì · đẩy tiêu chí nào",
        items: [
          "**Ôn từ Tập 3 Ngày 26** (đồ vật / hoạt động vòng 2: ghi chú 1 phút, 4 nhánh, kết bằng câu chốt) và **Ngày 30** (30 idiom + 5 luật dùng idiom). Hôm nay giữ nguyên khung đó, nâng **chất liệu ngôn ngữ**.",
          "Band 7 LR: “có từ ít gặp và thành ngữ, ý thức về văn phong”. Nghĩa là: ==từ ít gặp nhưng vẫn là từ NÓI== (intricate, it's grown on me) — không phải từ bài luận (aesthetic merit).",
          "Bốn nâng cấp: **chi tiết giác quan** (nhìn – sờ – nghe) · **một câu chuyện nhỏ** · **2–3 idiom** đúng dạng · **năm động tác kể** để nói dài mà không cạn.",
          "Hai thẻ đề: một **tác phẩm / món đồ** nhớ mãi và một **hoạt động sáng tạo**. Mỗi thẻ có bài nói band 6 và band 7 để so.",
          "🔊 **/tʃ/ /dʒ/ /tr/ /dr/**: picture, cheap, joy, bridge, treasure, drew — bốn âm người Việt hay đọc lẫn thành “ch / tr / gi” tiếng Việt và hay nuốt ở cuối từ.",
          "Tiêu chí được đẩy: **LR**, **FC**, kèm **P**.",
        ],
      },

      /* ── 1 ── */
      { t: "h", text: "1. Từ band 6 lên band 7 ở Part 2: bốn nâng cấp" },
      {
        t: "table",
        head: ["Tiêu chí", "Band 6", "Band 7", "Nâng cấp hôm nay"],
        rows: [
          ["**FC**", "Nói đủ dài nhưng có lúc mất mạch, lặp, ngắt để tìm cấu trúc", "Nói dài **không gắng sức**; ngắt chỉ để tìm ý / từ; từ dẫn linh hoạt", "Năm động tác kể (mục 6) — hết ý nhánh này thì có sẵn động tác chuyển"],
          ["**LR**", "Đủ từ cho chủ đề; paraphrase được; ít từ ít gặp", "Có **từ ít gặp + idiom**, đúng văn phong, collocation tự nhiên", "10 từ tả (mục 2) + 12 idiom (mục 3), mỗi bài nói dùng 2–3 idiom"],
          ["**GRA**", "Trộn đơn + phức; lỗi ở câu phức", "Nhiều cấu trúc phức **thường không lỗi**", "It was only… that · If it were ever… I'd… · What makes it… is that…"],
          ["**P**", "Dễ hiểu; kiểm soát lẫn lộn", "Đủ đặc trưng band 6 + một số của band 8", "Bốn âm tắc–xát; giữ âm cuối /tʃ/ /dʒ/"],
        ],
      },
      {
        t: "note",
        title: "⚠️ Ba cách “cố lên band 7” phản tác dụng",
        items: [
          "**Nhồi idiom**: sáu idiom trong hai phút nghe như đọc danh sách. Giám khảo chấm sự **tự nhiên**, không đếm số lượng. 2–3 là vừa.",
          "**Dùng từ bài luận**: “The aesthetic merit of this artefact is considerable.” — đúng ngữ pháp, sai văn phong. Người thật nói: “It's a really striking piece.”",
          "**Học thuộc cả bài**: giám khảo nhận ra ngay (nhịp đều, không ngập ngừng tự nhiên, lạc đề khi thẻ đổi một chữ) và được phép hạ điểm. Học **khối** (chunk) và **động tác**, không học bài.",
        ],
      },

      /* ── 2 ── */
      { t: "h", text: "2. Mười từ ít gặp để tả đồ vật và hoạt động (vẫn là từ nói)" },
      {
        t: "vocab",
        items: [
          { w: "intricate", pos: "adj", ipa: "/ˈɪntrɪkət/", vi: "tinh xảo, nhiều chi tiết nhỏ đan nhau", ex: "The lid is covered in an intricate pattern of leaves.", exVi: "Cái nắp phủ một hoa văn lá tinh xảo.", more: "intricate **carving / pattern / detail** · sắc thái khen; chê thì dùng fussy" },
          { w: "weathered", pos: "adj", ipa: "/ˈweðəd/", vi: "sờn, bạc màu vì thời gian, mưa nắng", ex: "It's an old, weathered wooden box that used to belong to my uncle.", exVi: "Đó là một cái hộp gỗ cũ, bạc màu, từng là của chú tôi.", more: "a weathered **face / door / sign** · gần: worn, faded, battered (móp méo — thân mật)" },
          { w: "texture", pos: "n", ipa: "/ˈtekstʃə/", vi: "bề mặt, cảm giác khi chạm", ex: "What I love is the rough texture of the handmade paper.", exVi: "Điều tôi thích là bề mặt ram ráp của giấy làm tay.", more: "a smooth / rough / coarse / silky texture · dùng cả cho món ăn, âm nhạc" },
          { w: "sentimental", pos: "adj", ipa: "/ˌsentɪˈmentl/", vi: "thuộc về tình cảm, kỷ niệm", ex: "The watch isn't expensive, but it has great sentimental value.", exVi: "Cái đồng hồ không đắt, nhưng có giá trị tình cảm lớn.", more: "**sentimental value** (cụm cố định) · for sentimental reasons · chê: overly sentimental (uỷ mị)" },
          { w: "heirloom", pos: "n", ipa: "/ˈeəluːm/", vi: "vật gia truyền", ex: "The ring is a family heirloom that has been passed down for four generations.", exVi: "Chiếc nhẫn là vật gia truyền đã truyền qua bốn đời.", more: "a **family** heirloom · be **passed down / handed down** · chữ h câm" },
          { w: "craftsmanship", pos: "n", ipa: "/ˈkrɑːftsmənʃɪp/", vi: "tay nghề thủ công; độ tinh xảo", ex: "You can see the craftsmanship in the way the joints fit together.", exVi: "Bạn thấy được tay nghề qua cách các mối ghép khít vào nhau.", more: "fine / superb craftsmanship · **craftsman / craftsperson** · **handcrafted** (adj)" },
          { w: "absorbing", pos: "adj", ipa: "/əbˈzɔːbɪŋ/", vi: "cuốn hút, làm mình chìm vào", ex: "I find pottery completely absorbing; an hour feels like ten minutes.", exVi: "Tôi thấy làm gốm cực kỳ cuốn; một tiếng mà như mười phút.", more: "an absorbing **hobby / book / task** · be **absorbed in** sth · mạnh hơn interesting" },
          { w: "therapeutic", pos: "adj", ipa: "/ˌθerəˈpjuːtɪk/", vi: "có tác dụng chữa lành, làm dịu tinh thần", ex: "There's something therapeutic about kneading dough by hand.", exVi: "Nhào bột bằng tay có gì đó rất chữa lành.", more: "There's something therapeutic **about** + V-ing · **therapy** (n) · gần: calming, soothing" },
          { w: "painstaking", pos: "adj", ipa: "/ˈpeɪnzteɪkɪŋ/", vi: "tỉ mỉ, công phu", ex: "Restoring the bike was painstaking work, but I enjoyed every minute.", exVi: "Phục hồi cái xe đạp là việc công phu, nhưng tôi thích từng phút.", more: "painstaking **work / research / detail** · **painstakingly** (adv) · = take pains (bỏ công), không liên quan tới “đau”" },
          { w: "rewarding", pos: "adj", ipa: "/rɪˈwɔːdɪŋ/", vi: "đáng công, mang lại sự thoả mãn", ex: "Developing the film myself is the most rewarding part.", exVi: "Tự tráng phim là phần đáng công nhất.", more: "a rewarding **experience / job** · **financially** rewarding · ≠ **awarding** (trao giải)" },
        ],
      },
      {
        t: "table",
        head: ["Thay vì (band 6)", "Nói (band 7)", "Vì sao hay hơn"],
        rows: [
          ["It is very old.", "It's **seen better days**. / It's pretty **weathered**.", "Có hình ảnh; nghe ra tình cảm với món đồ"],
          ["It has many small details.", "The carving is really **intricate**.", "Một từ chính xác thay cho cả mệnh đề"],
          ["It is important to me.", "It's got huge **sentimental value**. / It's a bit of a family **heirloom**.", "Nói rõ quan trọng KIỂU GÌ"],
          ["It is relaxing.", "There's something quite **therapeutic** about it.", "Cấu trúc There's something… about… rất tự nhiên"],
          ["It is interesting and I forget the time.", "It's so **absorbing** that I completely lose track of time.", "so… that + idiom đã học"],
          ["It is difficult but I like it.", "It's **painstaking**, but incredibly **rewarding**.", "Hai tính từ đối nhau, nhịp đẹp"],
        ],
      },

      /* ── 3 ── */
      { t: "h", text: "3. Mười hai idiom tự nhiên cho đồ vật và hoạt động" },
      {
        t: "p",
        text: "Tập 3 Ngày 30 đã có 30 idiom (trong đó **from scratch · get the hang of · lose track of time · learn the ropes** — hôm nay dùng lại). Mười hai idiom dưới đây chọn riêng cho hai loại đề hôm nay. Tất cả đều là thứ người bản ngữ **thật sự nói hằng ngày** — không có tục ngữ, không có “it's raining cats and dogs”.",
      },
      {
        t: "vocab",
        items: [
          { w: "catch someone's eye", pos: "idiom", ipa: "/kætʃ ˈsʌmwʌnz aɪ/", vi: "lọt vào mắt, thu hút sự chú ý", ex: "A small blue vase at the back of the stall caught my eye.", exVi: "Một cái bình xanh nhỏ ở cuối sạp lọt vào mắt tôi.", more: "Luôn **eye** số ít: ~~caught my eyes~~ sai · eye-catching (adj)" },
          { w: "grow on someone", pos: "idiom", ipa: "/ɡrəʊ ɒn ˈsʌmwʌn/", vi: "càng ngày càng thấy thích (lúc đầu không)", ex: "I didn't like the painting at first, but it's grown on me.", exVi: "Lúc đầu tôi không thích bức tranh, nhưng càng ngày càng thấy ưng.", more: "Chủ ngữ là **vật**, không phải người: ~~I grew on it~~ sai · hay đi với at first… but" },
          { w: "a labour of love", pos: "idiom", ipa: "/ə ˈleɪbər əv lʌv/", vi: "việc làm vì yêu thích, không vì tiền", ex: "Restoring my grandfather's radio was a real labour of love.", exVi: "Phục hồi cái đài của ông tôi đúng là việc làm vì tình yêu.", more: "It's been a labour of love. · thường đi với real / true" },
          { w: "have a soft spot for", pos: "idiom", ipa: "/hæv ə sɒft spɒt fɔː/", vi: "có cảm tình đặc biệt với", ex: "I've always had a soft spot for old film cameras.", exVi: "Tôi luôn có cảm tình đặc biệt với máy ảnh phim cũ.", more: "have a soft spot **for** + N · dùng cho cả người, đồ vật, nơi chốn" },
          { w: "have seen better days", pos: "idiom", ipa: "/hæv siːn ˈbetə deɪz/", vi: "đã cũ kỹ, xuống cấp (nói nhẹ, có chút hài)", ex: "The print has seen better days, but I'd never throw it away.", exVi: "Bức tranh in đã tàn tạ rồi, nhưng tôi sẽ không bao giờ vứt nó.", more: "Luôn ở hiện tại hoàn thành: **has / have seen** better days" },
          { w: "stand the test of time", pos: "idiom", ipa: "/stænd ðə test əv taɪm/", vi: "bền vững qua thời gian", ex: "It's a simple design that has stood the test of time.", exVi: "Đó là một thiết kế giản dị đã đứng vững qua thời gian.", more: "Dùng được cả trong Writing (không quá thân mật) · quá khứ: stood" },
          { w: "on a whim", pos: "idiom", ipa: "/ɒn ə wɪm/", vi: "bốc đồng, nổi hứng", ex: "I signed up for the pottery class on a whim.", exVi: "Tôi đăng ký lớp gốm trong một lúc nổi hứng.", more: "buy sth / decide / book a trip **on a whim** · ≠ on purpose" },
          { w: "a steep learning curve", pos: "idiom", ipa: "/ə stiːp ˈlɜːnɪŋ kɜːv/", vi: "giai đoạn đầu phải học rất nhiều, rất nhanh", ex: "There was a steep learning curve, because the camera has no automatic settings.", exVi: "Giai đoạn đầu phải học rất nhiều, vì máy không có chế độ tự động.", more: "**There was / It was** a steep learning curve · be on a steep learning curve" },
          { w: "trial and error", pos: "idiom", ipa: "/ˈtraɪəl ənd ˈerə/", vi: "thử – sai – sửa", ex: "I learned to develop film mostly by trial and error.", exVi: "Tôi học tráng phim chủ yếu bằng cách thử sai.", more: "**by / through** trial and error · a case of trial and error · không đổi thứ tự (~~error and trial~~)" },
          { w: "take your mind off", pos: "idiom", ipa: "/teɪk jɔː maɪnd ɒf/", vi: "giúp tạm quên (chuyện căng thẳng)", ex: "Painting takes my mind off work for a couple of hours.", exVi: "Vẽ giúp tôi tạm quên công việc vài tiếng.", more: "take sb's mind **off** sth · chủ ngữ là hoạt động" },
          { w: "second nature", pos: "idiom", ipa: "/ˌsekənd ˈneɪtʃə/", vi: "thành phản xạ, làm không cần nghĩ", ex: "After a few months, setting the exposure became second nature.", exVi: "Sau vài tháng, chỉnh phơi sáng thành phản xạ.", more: "**become / be** second nature **(to sb)** · không có a: ~~a second nature~~" },
          { w: "in your element", pos: "idiom", ipa: "/ɪn jɔːr ˈelɪmənt/", vi: "như cá gặp nước, đúng sở trường", ex: "Give me a camera and an empty street and I'm in my element.", exVi: "Cho tôi một cái máy ảnh và một con phố vắng là tôi như cá gặp nước.", more: "be **in my / his / her** element · ngược: out of my element / out of my depth" },
        ],
      },
      {
        t: "note",
        title: "⚠️ Idiom: sai một chữ là thành lỗi, không thành điểm",
        items: [
          "Idiom là **khối cố định**. ~~caught my eyes~~ · ~~it grew up on me~~ · ~~a hard work of love~~ · ~~by try and error~~ · ~~a second nature~~ ⇒ giám khảo ghi lỗi LR.",
          "Chỉ đổi được **thì** và **đại từ**: it **caught** / **catches** **my** / **her** eye.",
          "Chưa chắc 100 % nguyên dạng ⇒ **đừng dùng**; nói thẳng nghĩa đen (I noticed it straight away) vẫn tốt hơn một idiom gãy.",
          "Liều lượng: **2–3 idiom / 2 phút**, rải ở ba chỗ khác nhau. Không bắt đầu bài bằng idiom.",
          "Writing Task 2: trong 12 idiom trên, chỉ **stand the test of time**, **trial and error**, **a steep learning curve** đủ trung tính để viết. Còn lại để nói (chi tiết: Tập 4 Ngày 18).",
        ],
      },
      {
        t: "quiz",
        id: "t4d10-noi-idiom",
        kind: "fill",
        title: "Điền MỘT từ để hoàn chỉnh idiom (8 câu)",
        items: [
          { q: "1. I wasn't keen on the colour at first, but it's ___ on me.", answers: ["grown"] },
          { q: "2. A tiny wooden horse in the shop window caught my ___ .", answers: ["eye"] },
          { q: "3. I bought the guitar on a ___ , without really thinking.", answers: ["whim"] },
          { q: "4. My old laptop has seen ___ days, but it still works.", answers: ["better"] },
          { q: "5. I taught myself to bake mostly by trial and ___ .", answers: ["error"] },
          { q: "6. After a year, reading music became second ___ .", answers: ["nature"] },
          { q: "7. Building the model took six months — it was a real ___ of love.", answers: ["labour", "labor"] },
          { q: "8. Gardening really takes my ___ off my exams.", answers: ["mind"] },
        ],
      },
      { t: "rule", formula: "2–3 idiom / 2 phút · đúng NGUYÊN DẠNG (chỉ đổi thì + đại từ) · chưa chắc thì không dùng", vi: "Luật idiom band 7 — tự nhiên quan trọng hơn số lượng." },

      /* ── 4 ── */
      { t: "h", text: "4. Đề đồ vật — một tác phẩm bạn nhớ mãi" },
      {
        t: "table",
        head: ["Thẻ đề"],
        rows: [
          ["**Describe a work of art (for example a painting, a print or a handmade object) that you remember well.**"],
          ["You should say:"],
          ["• what it is and what it looks like"],
          ["• where you saw it or how you came to know it"],
          ["• what it shows or means"],
          ["and explain why you remember it so well."],
        ],
      },
      {
        t: "sodo",
        kind: "mindmap",
        title: "Ghi chú 1 phút — từ khoá + đánh dấu chỗ đặt idiom (★)",
        caption: "Chọn tác phẩm ĐƠN GIẢN có chuyện, không chọn kiệt tác thế giới mà bạn thiếu từ để tả.",
        center: "Dong Ho print — The Rat's Wedding",
        branches: [
          { label: "① What", items: ["woodblock print · Bac Ninh", "grandparents' living room"] },
          { label: "② Shows / means", items: ["rats · sedan chair", "fish + bird → smug cat = bribe", "child: cartoon → later: satire"] },
          { label: "③ Looks / feels", items: ["handmade paper · seashell shimmer", "colours muted", "★ seen better days · nibbled corner"] },
          { label: "④ Why", items: ["★ bought on a whim · year Mum born", "sentimental value · heirloom", "If damaged → upset · ★ test of time"] },
        ],
      },
      {
        t: "dialogue",
        title: "Bài nói band 6 (ước tính) — khoảng 1 phút 10 giây",
        lines: [
          { who: "Candidate", role: "candidate", text: "I want to talk about a picture in my grandparents' house. It is a Dong Ho picture. Dong Ho is a traditional village in Bac Ninh and it is famous for folk pictures. The picture is about a wedding of mice. There are many mice and a big cat, and the mice give a fish and a bird to the cat. The colours are red, yellow and green, and I think it is very beautiful and meaningful. I saw it many times when I was a child because it is on the wall in the living room. My grandfather bought it a long time ago. I like it because it reminds me about my childhood and my grandfather. It also shows Vietnamese culture. Now young people don't know much about this kind of picture, so I think we should protect it. That's all.", vi: "Tôi muốn nói về một bức tranh ở nhà ông bà. Đó là tranh Đông Hồ… (đủ bốn gợi ý, dễ hiểu; nhưng câu đơn nối nhau, từ chung chung: beautiful, meaningful, a long time ago; không có chi tiết giác quan, không có chuyện; reminds me about → of; dừng ở 1 phút 10 giây.)" },
        ],
      },
      {
        t: "dialogue",
        title: "Bài nói band 7 (ước tính) — khoảng 2 phút",
        lines: [
          { who: "Candidate", role: "candidate", text: "I'd like to describe a folk print that's hung in my grandparents' living room for as long as I can remember. It's what we call a Dong Ho print — they're woodblock prints made in a small village in Bac Ninh province, not far from Hanoi.", vi: "Tôi muốn tả một bức tranh dân gian treo ở phòng khách nhà ông bà từ khi tôi có ký ức. Người ta gọi là tranh Đông Hồ — tranh khắc gỗ làm ở một làng nhỏ thuộc Bắc Ninh, không xa Hà Nội." },
          { who: "Candidate", role: "candidate", text: "This particular one is known as ‘The Rat's Wedding’. It shows a procession of rats in formal dress, carrying the bride in a little sedan chair — and at the front, a few nervous-looking rats are offering a fish and a bird to a big, rather smug cat, basically as a bribe so he'll let the wedding go ahead.", vi: "Bức này tên là “Đám cưới chuột”. Nó vẽ một đoàn chuột mặc lễ phục, khiêng cô dâu trên một cái kiệu nhỏ — và ở phía trước, vài con chuột trông lo lắng đang dâng cá và chim cho một con mèo to, vẻ khá tự mãn, về cơ bản là hối lộ để nó cho đám cưới đi qua." },
          { who: "Candidate", role: "candidate", text: "As a child I just thought it was a funny cartoon. It was only years later, when my grandfather explained it, that I realised it was poking fun at corrupt officials — which, for a picture you hang up at Tet, is surprisingly sharp.", vi: "Hồi nhỏ tôi chỉ nghĩ đó là tranh hài. Phải nhiều năm sau, khi ông giải thích, tôi mới nhận ra nó đang châm biếm quan tham — mà với một bức tranh treo ngày Tết thì như vậy là sắc sảo bất ngờ." },
          { who: "Candidate", role: "candidate", text: "What I love about it visually is the texture. The paper's handmade and coated with crushed seashell, so it has this faint shimmer when the light catches it, and the colours all come from natural things — burnt bamboo leaves for the black, that sort of thing. They're quite muted now. To be honest, the print has seen better days, and one corner's been nibbled — by actual mice, my grandmother insists.", vi: "Về mặt thị giác, điều tôi thích là bề mặt. Giấy làm tay, phủ vỏ sò nghiền, nên có ánh lấp lánh nhè nhẹ khi bắt sáng, và màu đều lấy từ tự nhiên — lá tre đốt cho màu đen, kiểu vậy. Giờ màu đã khá trầm. Thật lòng thì bức tranh đã tàn tạ rồi, một góc còn bị gặm — bà tôi quả quyết là do chuột thật." },
          { who: "Candidate", role: "candidate", text: "It isn't worth much, I suppose — you can pick one up for next to nothing — but it has enormous sentimental value. My grandfather bought it on a whim at a market the year my mother was born, so it's become a sort of family heirloom.", vi: "Chắc nó chẳng đáng bao nhiêu tiền — mua một bức gần như không tốn gì — nhưng có giá trị tình cảm rất lớn. Ông tôi nổi hứng mua nó ở chợ vào năm mẹ tôi ra đời, nên nó thành một kiểu vật gia truyền." },
          { who: "Candidate", role: "candidate", text: "If it were ever damaged beyond repair, I'd be genuinely upset, because for me it's stood the test of time in a way that most of the things I own never will.", vi: "Nếu có ngày nó hỏng không sửa được, tôi sẽ buồn thật sự, vì với tôi nó đã đứng vững qua thời gian theo cách mà phần lớn đồ tôi sở hữu sẽ không bao giờ làm được." },
        ],
      },
      {
        t: "table",
        head: ["Tiêu chí", "Bài band 6", "Bài band 7"],
        rows: [
          ["**FC**", "Dừng ở 1'10''; câu ngắn nối nhau bằng and / because; kết “That's all.”", "Đủ 2 phút; đi đúng 4 gợi ý; chuyển ý tự nhiên: This particular one… · As a child… · What I love about it visually… · To be honest… · câu chốt"],
          ["**LR**", "beautiful · meaningful · famous · a long time ago · shows Vietnamese culture", "procession · sedan chair · smug · bribe · poking fun at · shimmer · muted · nibbled · sentimental value · heirloom + **3 idiom**: seen better days · on a whim · stood the test of time"],
          ["**GRA**", "Hiện tại đơn / quá khứ đơn; reminds me **about** (sai giới từ)", "that's hung… for as long as I can remember · **It was only… that** I realised · **What I love… is** · **If it were ever…, I'd** · mệnh đề quan hệ which, …"],
          ["**P**", "Dễ nuốt âm cuối: pic**ture**, cul**ture**, brid**ge**", "Phải rõ /tʃ/ trong picture, texture, catches; /dʒ/ trong village, damaged, genuinely; /tr/ trong treasure (xem mục 8)"],
        ],
      },
      {
        t: "note",
        title: "💡 Cái làm nên band 7 ở bài này KHÔNG phải kiến thức về tranh",
        items: [
          "Bạn không cần biết giấy dó hay điệp. Cái cần là **một chi tiết nhìn thấy được** (ánh lấp lánh), **một chi tiết hỏng hóc** (góc bị gặm), **một mẩu chuyện** (ông mua năm mẹ sinh), **một thay đổi trong cách hiểu** (hồi nhỏ – sau này).",
          "Món đồ nào cũng có bốn thứ đó: cái ấm, cái đồng hồ, tấm ảnh, cái đàn. Thay nội dung, giữ bốn chi tiết.",
          "Câu đùa nhỏ (“by actual mice, my grandmother insists”) cho thấy bạn **thoải mái** với ngôn ngữ — đúng nghĩa “không gắng sức”.",
        ],
      },

      /* ── 5 ── */
      { t: "h", text: "5. Đề hoạt động — một hoạt động sáng tạo bạn thích" },
      {
        t: "table",
        head: ["Thẻ đề"],
        rows: [
          ["**Describe a creative activity that you enjoy doing in your free time.**"],
          ["You should say:"],
          ["• what the activity is"],
          ["• how you started doing it"],
          ["• when and where you usually do it"],
          ["and explain why you enjoy it."],
        ],
      },
      {
        t: "dialogue",
        title: "Bài nói band 7 (ước tính) — khoảng 2 phút: chụp ảnh phim",
        lines: [
          { who: "Candidate", role: "candidate", text: "The activity I'd like to talk about is film photography — shooting on an old manual camera rather than on my phone. I took it up about two years ago, more or less by accident, when my dad was clearing out a cupboard and came across the camera he'd used as a student.", vi: "Hoạt động tôi muốn nói là chụp ảnh phim — chụp bằng một máy cơ cũ thay vì điện thoại. Tôi bắt đầu khoảng hai năm trước, gần như tình cờ, khi bố tôi dọn tủ và thấy lại chiếc máy ông dùng thời sinh viên." },
          { who: "Candidate", role: "candidate", text: "I'll be honest, there was a steep learning curve. There's no screen, no autofocus, nothing — you set everything by hand and you don't see the result for a week. My first roll was a disaster: out of thirty-six frames, I think four were usable. So it was very much a case of trial and error, and I kept a little notebook of the settings for every shot so I could work out what I'd done wrong.", vi: "Nói thật, giai đoạn đầu phải học rất nhiều. Không màn hình, không lấy nét tự động, không gì cả — bạn chỉnh tay mọi thứ và một tuần sau mới thấy kết quả. Cuộn đầu tiên là thảm hoạ: trong ba mươi sáu kiểu, tôi nghĩ dùng được bốn. Nên đúng là thử sai mà học, và tôi giữ một cuốn sổ nhỏ ghi thông số từng kiểu để tìm ra mình sai ở đâu." },
          { who: "Candidate", role: "candidate", text: "These days I usually go out on Sunday mornings, when the light's soft and the streets around the Old Quarter are still fairly quiet. I mostly photograph ordinary things — a barber setting up on the pavement, someone's washing on a balcony.", vi: "Dạo này tôi thường đi vào sáng Chủ nhật, khi ánh sáng dịu và phố quanh khu Phố Cổ còn khá vắng. Tôi chủ yếu chụp những thứ bình thường — một bác thợ cắt tóc dọn hàng trên vỉa hè, đồ phơi của ai đó trên ban công." },
          { who: "Candidate", role: "candidate", text: "What makes it so absorbing is that every frame costs money, so you can't just fire off fifty shots and pick the best. You have to slow down and actually look. I spend all week staring at code, so it really takes my mind off work — I completely lose track of time.", vi: "Điều làm nó cuốn là mỗi kiểu ảnh đều tốn tiền, nên bạn không thể bấm năm mươi phát rồi chọn cái đẹp nhất. Bạn phải chậm lại và thật sự nhìn. Cả tuần tôi dán mắt vào mã nguồn, nên nó giúp tôi quên hẳn công việc — tôi hoàn toàn quên thời gian." },
          { who: "Candidate", role: "candidate", text: "Developing the film is the part I find most rewarding. I do it myself in the bathroom, which drives my flatmates mad, and there's a genuinely magical moment when you pull the strip out and hold it up to the light.", vi: "Tráng phim là phần tôi thấy đáng công nhất. Tôi tự làm trong phòng tắm, khiến bạn cùng nhà phát điên, và có một khoảnh khắc thật sự kỳ diệu khi bạn kéo dải phim ra và giơ lên ánh sáng." },
          { who: "Candidate", role: "candidate", text: "I'm under no illusion that I'm any good — but it's become a labour of love, and I'd much rather have ten prints I'm proud of than ten thousand pictures sitting on a phone.", vi: "Tôi không ảo tưởng là mình giỏi — nhưng nó đã thành việc làm vì yêu thích, và tôi thà có mười tấm ảnh in mình tự hào còn hơn mười nghìn tấm nằm trong điện thoại." },
        ],
      },
      {
        t: "table",
        head: ["Ý", "Câu band 6", "Câu band 7 (trong bài trên)", "Nâng cấp"],
        rows: [
          ["Bắt đầu", "I started it two years ago. My father gave me his old camera.", "I **took it up** about two years ago, **more or less by accident**, when my dad **was clearing out** a cupboard and **came across** the camera he**'d used** as a student.", "phrasal verbs + quá khứ tiếp diễn làm nền + quá khứ hoàn thành"],
          ["Khó lúc đầu", "At first it was very difficult. My photos were bad.", "**There was a steep learning curve**… **out of** thirty-six frames, I think four were usable.", "idiom + con số cụ thể"],
          ["Cách học", "I tried many times and I learned.", "It was **very much a case of trial and error**, and I kept a little notebook… **so I could work out what I'd done wrong**.", "idiom + chi tiết (cuốn sổ) + mệnh đề mục đích"],
          ["Vì sao thích", "It is interesting and relaxing.", "**What makes it so absorbing is that** every frame costs money… **it really takes my mind off work**.", "câu chẻ What… is that + lý do bất ngờ + idiom"],
          ["Kết", "I think it is a good hobby. That's all.", "**I'm under no illusion that** I'm any good — **but** it's become **a labour of love**, and **I'd much rather** have… **than**…", "khiêm tốn + idiom + so sánh I'd rather… than"],
        ],
        caption: "Bốn idiom trong 2 phút (steep learning curve · trial and error · takes my mind off · labour of love) + một idiom cũ (lose track of time) — đây là mức TỐI ĐA; bớt một cái vẫn band 7.",
      },

      /* ── 6 ── */
      { t: "h", text: "6. Năm động tác kể — để nói dài mà không gắng sức" },
      {
        t: "p",
        text: "Người band 6 cạn ý ở giây 70 vì chỉ có một động tác: **tả**. Người band 7 có sẵn năm động tác; hết ý ở nhánh nào thì chuyển sang động tác khác **ngay trong nhánh đó**. Cả hai bài mẫu trên đều dùng đủ năm.",
      },
      {
        t: "table",
        head: ["Động tác", "Khung câu", "Ví dụ trong hai bài mẫu"],
        rows: [
          ["① **Phóng to một chi tiết**", "What I love / What strikes me about it is… · If you look closely, …", "What I love about it visually is the texture… this faint shimmer when the light catches it"],
          ["② **Lùi về quá khứ**", "I must have been about… when… · It was only (years) later that… · I took it up when…", "It was only years later, when my grandfather explained it, that I realised…"],
          ["③ **Trước – sau**", "At first I… , but it's grown on me / but these days… · As a child I…", "As a child I just thought it was a funny cartoon. · My first roll was a disaster… These days…"],
          ["④ **Giả định**", "If it were ever lost / damaged, I'd… · If I had more time, I'd… · I'd much rather… than…", "If it were ever damaged beyond repair, I'd be genuinely upset"],
          ["⑤ **Tự nhận xét**", "To be honest, … · I suppose… · I'm under no illusion that… · Looking back, …", "It isn't worth much, I suppose · I'm under no illusion that I'm any good"],
        ],
      },
      {
        t: "patterns",
        rows: [
          {
            formula: "It was only + (thời điểm) + that + S + V2",
            vi: "Nhấn “mãi tới lúc đó mới…” — câu chẻ (Tập 4 Ngày 7), rất hợp khi kể mình hiểu ra điều gì.",
            examples: [
              { en: "It was only when I tried to make one myself that I understood how much skill it takes.", vi: "Chỉ tới khi tự tay thử làm một cái, tôi mới hiểu nó đòi hỏi tay nghề tới mức nào." },
            ],
          },
          {
            formula: "What + S + V (love / find / makes it…) + is + (that) …",
            vi: "Đưa điều quan trọng nhất ra cuối câu; cho bạn nửa giây để nghĩ.",
            examples: [
              { en: "What I find most rewarding is seeing the finished print.", vi: "Điều tôi thấy đáng công nhất là nhìn thấy tấm ảnh in hoàn thiện." },
            ],
          },
          {
            formula: "If + S + were ever + V3 / adj, S + would + V",
            vi: "Giả định để nói vì sao món đồ quý — thay cho “It is important to me”.",
            examples: [
              { en: "If it were ever stolen, I honestly don't think I could replace it.", vi: "Nếu có ngày nó bị trộm, thật lòng tôi không nghĩ mình thay thế được." },
            ],
          },
        ],
      },
      { t: "rule", formula: "Phóng to → Lùi về quá khứ → Trước – sau → Giả định → Tự nhận xét", vi: "Năm động tác kể. Mỗi nhánh ghi chú dùng 1–2 động tác là đủ 30 giây." },

      /* ── 7 ── */
      { t: "h", text: "7. Part 3 đi kèm — đồ thủ công, sáng tạo, nghệ thuật" },
      {
        t: "table",
        head: ["Câu hỏi hay gặp sau hai thẻ đề trên", "Hướng trả lời band 7"],
        rows: [
          ["Why do some people prefer handmade objects to mass-produced ones?", "nêu 2 lý do (độc nhất · câu chuyện người làm) → nhượng bộ (đắt, không tiện) → nhận định"],
          ["Do you think children today have enough opportunities to be creative?", "so sánh hai thời (màn hình ↔ chơi tự do) → phân nhóm (thành thị ↔ nông thôn) → dự đoán"],
          ["Should schools teach traditional crafts?", "có điều kiện: ở tiểu học / như môn tự chọn; dùng nurture, stifle, a creative outlet"],
          ["Is it important for a country to preserve its traditional art?", "heritage · a sense of identity · stand the test of time ↔ commodify for tourists"],
        ],
      },
      {
        t: "dialogue",
        title: "Mẫu band 7 — Part 3 (khoảng 40 giây)",
        lines: [
          { who: "Examiner", role: "examiner", text: "Why do some people prefer handmade objects to mass-produced ones?", vi: "Vì sao một số người thích đồ làm tay hơn đồ sản xuất hàng loạt?" },
          { who: "Candidate", role: "candidate", text: "I think it mostly comes down to character. A factory-made mug is identical to a million others, whereas a handmade one has tiny flaws that make it unique, and people find that appealing precisely because everything else in their lives is so standardised.", vi: "Tôi nghĩ chủ yếu là vì “cá tính” của món đồ. Cái cốc sản xuất ở nhà máy giống hệt một triệu cái khác, còn cái làm tay có những khiếm khuyết nhỏ khiến nó độc nhất, và người ta thấy điều đó hấp dẫn chính vì mọi thứ khác trong đời họ quá đồng loạt." },
          { who: "Candidate", role: "candidate", text: "There's also the sense that someone has put real craftsmanship into it. Having said that, I wouldn't romanticise it — handmade things tend to cost a fortune, so for most people they're an occasional treat rather than an everyday choice.", vi: "Còn có cảm giác là ai đó đã dồn tay nghề thật sự vào nó. Dù vậy, tôi không muốn tô hồng — đồ làm tay thường rất đắt, nên với đa số người chúng là thứ thỉnh thoảng tự thưởng chứ không phải lựa chọn hằng ngày." },
        ],
      },

      /* ── 8 ── */
      { t: "h", text: "8. Phát âm: /tʃ/ · /dʒ/ · /tr/ · /dr/" },
      {
        t: "p",
        text: "Bốn âm này đều bắt đầu bằng việc **chặn hơi** rồi **xả ra có tiếng xát**. Tiếng Việt có “ch”, “tr”, “gi” nghe gần giống nhưng **vị trí lưỡi khác** và **không bật hơi**, nên người Việt hay: (1) đọc **/tr/ thành “tr” / “ch” tiếng Việt** (tree nghe như “chi”); (2) đọc **/dʒ/ thành “gi” /z/** hoặc thành /tʃ/ (job → “chóp”); (3) **nuốt âm cuối** (bridge → “brít”, picture → “píc-chờ” mất /tʃ/).",
      },
      {
        t: "table",
        head: ["Âm", "Cách làm", "Từ hôm nay", "Lỗi người Việt"],
        rows: [
          ["**/tʃ/** (vô thanh)", "Đầu lưỡi chặn sau lợi trên như /t/, môi **chu tròn**, xả hơi mạnh thành “sh”", "**ch**eap · pic**t**ure · tex**t**ure · ca**tch** · mu**ch**", "Không chu môi, không bật hơi ⇒ nghe như “ch” Việt, yếu; cuối từ bị nuốt"],
          ["**/dʒ/** (hữu thanh)", "Y như /tʃ/ nhưng **rung dây thanh**; đặt tay lên cổ thấy rung", "**j**oy · **g**enuinely · villa**ge** · brid**ge** · dama**g**ed", "Đọc thành /z/ (“gi”) hoặc /tʃ/; cuối từ mất hẳn (village → “vi-lịt”)"],
          ["**/tr/**", "/t/ + /r/ dính liền: lưỡi ở vị trí /r/ **ngay từ đầu**, môi tròn; nghe gần “chr”", "**tr**easure · **tr**ial · **tr**adition · s**tr**eet", "Đọc “tr” Việt (lưỡi quặt, không có /r/) hoặc “ch”: tree = chi"],
          ["**/dr/**", "/d/ + /r/ dính liền; nghe gần “jr”", "**dr**ew · **dr**agon · **dr**eam · hun**dr**ed", "Tách thành “đờ-r” hai âm; hoặc đọc /d/ rồi bỏ /r/: draw → “đo”"],
        ],
      },
      {
        t: "table",
        head: ["/tʃ/", "/dʒ/", "/tr/", "/dr/"],
        rows: [
          ["chain", "Jane", "train", "drain"],
          ["chip", "gym", "trip", "drip"],
          ["chunk", "junk", "trunk", "drunk"],
          ["rich (cuối từ)", "ridge (cuối từ)", "—", "—"],
          ["batch (cuối từ)", "badge (cuối từ)", "—", "—"],
        ],
        caption: "Đọc theo hàng ngang: bốn từ chỉ khác âm đầu. Hai hàng cuối: giữ âm cuối, nguyên âm trước /dʒ/ dài hơn trước /tʃ/ (ridge dài hơn rich).",
      },
      {
        t: "phatam",
        id: "t4d10-phat-am",
        title: "Luyện phát âm — /tʃ/ · /dʒ/ · /tr/ · /dr/ trong câu của bài nói",
        note: "Chu môi khi đọc cả bốn âm. Giữ âm cuối /tʃ/ /dʒ/ (catch, bridge, village). Máy chấm từng âm.",
        items: [
          { text: "The picture caught my eye by chance.", ipa: "ðə pɪktʃə kɔːt maɪ aɪ baɪ tʃɑːns", vi: "Bức tranh tình cờ lọt vào mắt tôi. (/tʃ/: picture, chance)" },
          { text: "It's a cheap print, but I treasure it.", ipa: "ɪts ə tʃiːp prɪnt bət aɪ treʒə ɪt", vi: "Đó là một bức tranh in rẻ tiền, nhưng tôi trân quý nó. (/tʃ/ cheap ↔ /tr/ treasure)" },
          { text: "My grandfather drew a dragon on the jar.", ipa: "maɪ ɡrænfɑːðə druː ə dræɡən ɒn ðə dʒɑː", vi: "Ông tôi vẽ một con rồng lên cái hũ. (/dr/ drew, dragon ↔ /dʒ/ jar)" },
          { text: "I learned by trial and error, just for the joy of it.", ipa: "aɪ lɜːnd baɪ traɪəl ənd erə dʒʌst fə ðə dʒɔɪ əv ɪt", vi: "Tôi học bằng cách thử sai, chỉ vì niềm vui. (/tr/ trial ↔ /dʒ/ just, joy)" },
          { text: "The bridge in the village is drawn in orange chalk.", ipa: "ðə brɪdʒ ɪn ðə vɪlɪdʒ ɪz drɔːn ɪn ɒrɪndʒ tʃɔːk", vi: "Cây cầu trong làng được vẽ bằng phấn cam. (/dʒ/ cuối từ: bridge, village, orange · /dr/ drawn · /tʃ/ chalk)" },
          { text: "Which train did Jane choose?", ipa: "wɪtʃ treɪn dɪd dʒeɪn tʃuːz", vi: "Jane đã chọn chuyến tàu nào? (cả bốn loại âm trong năm từ)" },
          { text: "The strange texture drew me in.", ipa: "ðə streɪndʒ tekstʃə druː mi ɪn", vi: "Bề mặt lạ lùng đó cuốn tôi vào. (/tr/ trong str-, /dʒ/ cuối strange, /tʃ/ texture, /dr/ drew)" },
          { text: "It's a real challenge to judge a sculpture.", ipa: "ɪts ə rɪəl tʃælɪndʒ tə dʒʌdʒ ə skʌlptʃə", vi: "Đánh giá một tác phẩm điêu khắc là thử thách thật sự. (/tʃ/ đầu + /dʒ/ cuối trong challenge; judge có /dʒ/ hai đầu)" },
          { text: "I dream of travelling with a truly dreadful old camera.", ipa: "aɪ driːm əv trævəlɪŋ wɪð ə truːli dredfl əʊld kæmrə", vi: "Tôi mơ được đi du lịch với một cái máy ảnh cũ tệ hại. (/dr/ dream, dreadful ↔ /tr/ travelling, truly)" },
        ],
      },

      /* ── 9 ── */
      { t: "h", text: "9. Luyện nói — ghi âm, AI chấm 4 tiêu chí" },
      {
        t: "note",
        title: "📌 Cách luyện (mỗi thẻ 2 lượt)",
        items: [
          "**Lượt 1**: 1 phút ghi chú theo 4 nhánh, đánh dấu ★ ở 2–3 chỗ sẽ đặt idiom. Nói đủ 2 phút, không dừng.",
          "Nghe lại: (1) có đủ 2 phút không? (2) idiom có đúng nguyên dạng? (3) có ít nhất 3 trong 5 động tác kể? (4) âm cuối /tʃ/ /dʒ/ có còn?",
          "**Lượt 2**: cùng thẻ, **đổi món đồ / hoạt động** (không nói lại bài cũ) — để chắc bạn đang dùng khối và động tác, không thuộc lòng.",
          "Chép 5 câu hay nhất của mình vào sổ Speaking (cách làm ở Tập 3 Ngày 2).",
        ],
      },
      {
        t: "speak",
        id: "t4d10-noi-do-vat",
        part: "2",
        questions: [
          "Describe a work of art (for example a painting, a print or a handmade object) that you remember well. You should say: what it is and what it looks like, where you saw it or how you came to know it, what it shows or means, and explain why you remember it so well.",
        ],
      },
      {
        t: "speak",
        id: "t4d10-noi-hoat-dong",
        part: "2",
        questions: [
          "Describe a creative activity that you enjoy doing in your free time. You should say: what the activity is, how you started doing it, when and where you usually do it, and explain why you enjoy it.",
        ],
      },
      {
        t: "speak",
        id: "t4d10-noi-part3",
        part: "3",
        questions: [
          "Why do some people prefer handmade objects to mass-produced ones?",
          "Do you think children today have enough opportunities to be creative?",
          "Is it important for a country to preserve its traditional arts and crafts? Why?",
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI TẬP NGÀY 10 ═══════════════════════════ */
  {
    id: "t4d10-bai-tap",
    kind: "homework",
    title: "Bài tập Ngày 10 — từ vựng nghệ thuật · sắc thái & từ dễ nhầm · câu đánh giá · idiom",
    goal: "Làm 45 câu có đáp án trộn cả ba bài hôm nay (chọn từ theo ngữ cảnh và sắc thái, đổi dạng từ, từ dễ nhầm, dịch, chọn câu đánh giá, idiom, ghép câu) rồi viết một thân bài có đánh giá và nói một thẻ Part 2 mới — đạt ≥ 80 % trước khi sang Ngày 11.",
    minutes: 80,
    blocks: [
      {
        t: "recap",
        title: "Làm gì · chấm thế nào",
        items: [
          "**Phần I–III** (26 câu): 51 từ + 14 cụm + sắc thái + 14 cặp dễ nhầm của bài Từ vựng.",
          "**Phần IV** (6 câu dịch): cụm chủ đề + thesis + câu đánh giá.",
          "**Phần V** (5 câu): đọc một thân bài band 6, chọn cách nâng lên band 7.",
          "**Phần VI–VII** (8 câu): idiom và ghép câu của bài Nói.",
          "**Phần VIII–IX**: viết một thân bài có đánh giá (AI chấm) + nói một thẻ Part 2 mới (AI chấm).",
          "Đạt **≥ 36/45**. Sai nhiều ở Phần III ⇒ ôn bài Từ vựng mục 6–7; Phần V ⇒ bài Viết mục 5; Phần VI ⇒ bài Nói mục 3.",
        ],
      },

      { t: "h", text: "Phần I — Chọn từ đúng theo ngữ cảnh (10 câu)" },
      {
        t: "mcq",
        id: "t4d10-bt-chon",
        title: "Từ vựng chủ đề — chọn phương án đúng nhất",
        items: [
          { q: "1. The gallery is staging a major ___ covering forty years of the painter's career.", options: ["installation", "retrospective", "sketch", "mural"], correct: 1, why: "Triển lãm nhìn lại cả sự nghiệp ⇒ retrospective." },
          { q: "2. Small orchestras are heavily ___ by the state; ticket sales cover only a third of their costs.", options: ["commodified", "stifled", "subsidised", "depicted"], correct: 2, why: "Được nhà nước trợ cấp ⇒ subsidised." },
          { q: "3. The poem ___ a powerful sense of loss without ever mentioning death.", options: ["conveys", "depicts", "exhibits", "critiques"], correct: 0, why: "convey a sense of (truyền tải cảm giác). depict dùng cho hình ảnh cụ thể." },
          { q: "4. She was an astonishingly ___ composer, writing over six hundred works before the age of forty.", options: ["spontaneous", "elitist", "acoustic", "prolific"], correct: 3, why: "Sáng tác rất nhiều ⇒ prolific." },
          { q: "5. Rigid timetables and constant testing can ___ children's natural curiosity.", options: ["nurture", "stifle", "enrich", "evoke"], correct: 1, why: "Kìm hãm, bóp nghẹt ⇒ stifle (ngược với nurture)." },
          { q: "6. The museum's ___ team visits care homes with objects that residents can handle.", options: ["patron", "legacy", "outreach", "censorship"], correct: 2, why: "an outreach team / programme — đưa hoạt động tới cộng đồng." },
          { q: "7. The trio played a slow, almost unrecognisable ___ of a famous pop song.", options: ["rendition", "repertoire", "virtuoso", "canvas"], correct: 0, why: "a rendition of a song = một cách thể hiện bài hát. repertoire = cả vốn tiết mục." },
          { q: "8. Opponents dismiss ballet as ___ , arguing that only the wealthy ever see it.", options: ["mainstream", "innovative", "subjective", "elitist"], correct: 3, why: "Chỉ dành cho giới tinh hoa (chê) ⇒ elitist." },
          { q: "9. With remarkable ___ , the villagers built a working irrigation system from scrap metal.", options: ["censorship", "ingenuity", "appreciation", "philanthropy"], correct: 1, why: "Óc sáng chế, sự tài tình ⇒ ingenuity." },
          { q: "10. The documentary was genuinely ___ ; we argued about it all the way home.", options: ["thought-provoking", "self-evident", "acclaim", "interpretation"], correct: 0, why: "Gợi suy nghĩ (tranh luận suốt đường về) ⇒ thought-provoking. Hai phương án cuối sai loại từ." },
        ],
      },

      { t: "h", text: "Phần II — Đổi dạng từ (8 câu)" },
      {
        t: "quiz",
        id: "t4d10-bt-ho-tu",
        kind: "fill",
        title: "Viết dạng đúng của từ trong ngoặc",
        items: [
          { q: "1. Art is open to many different ___ (interpret).", answers: ["interpretations"] },
          { q: "2. The show caused considerable ___ (controversial) when it opened.", answers: ["controversy"] },
          { q: "3. She has a deep ___ (appreciate) of traditional music.", answers: ["appreciation"] },
          { q: "4. The jazz trio is famous for its long ___ (improvise).", answers: ["improvisations", "improvisation"] },
          { q: "5. The building is ___ (aesthetic) pleasing but impractical.", answers: ["aesthetically"] },
          { q: "6. Private ___ (philanthropy) have funded most of the new wing.", answers: ["philanthropists"] },
          { q: "7. The film's ___ (depict) of village life was criticised as unrealistic.", answers: ["depiction"] },
          { q: "8. The piece is highly ___ (evoke) of the composer's childhood by the sea.", answers: ["evocative"] },
        ],
      },

      { t: "h", text: "Phần III — Sắc thái và từ dễ nhầm (8 câu)" },
      {
        t: "mcq",
        id: "t4d10-bt-sac-thai",
        title: "Chọn từ đúng nghĩa VÀ đúng sắc thái",
        items: [
          { q: "1. The town is ___ for its pickpockets, so keep your bag closed.", options: ["renowned", "celebrated", "notorious", "acclaimed"], correct: 2, why: "Nổi tiếng vì điều xấu ⇒ notorious." },
          { q: "2. I like the room: the decoration is elegant and ___ , with nothing unnecessary.", options: ["simplistic", "plain and dull", "fussy", "understated"], correct: 3, why: "Khen sự tiết chế ⇒ understated. simplistic / fussy / dull là chê." },
          { q: "3. From what the minister said, journalists ___ that the festival would lose its funding.", options: ["inferred", "implied", "insured", "adapted"], correct: 0, why: "Chủ ngữ là người nghe (journalists) ⇒ infer (suy ra)." },
          { q: "4. The new wing ___ the original building rather than competing with it.", options: ["compliments", "complements", "comprises of", "adopts"], correct: 1, why: "Bổ sung, làm hoàn chỉnh ⇒ complements." },
          { q: "5. The gallery decided to ___ a pay-what-you-can policy on Sundays.", options: ["adapt to", "adept", "adopt", "adapt for"], correct: 2, why: "Áp dụng một chính sách ⇒ adopt + tân ngữ trực tiếp." },
          { q: "6. Her advice on preparing a portfolio was ___ ; I could not have got the place without it.", options: ["worthless", "priceless joke", "valueless", "invaluable"], correct: 3, why: "Cực kỳ hữu ích ⇒ invaluable (không phải “không có giá trị”)." },
          { q: "7. A referee must be ___ : he should have no reason to prefer either team.", options: ["disinterested", "uninterested", "uninteresting", "disinteresting"], correct: 0, why: "Vô tư, không thiên vị ⇒ disinterested." },
          { q: "8. The stage was ___ designed so that wheelchair users could perform on it.", options: ["especially", "specially", "special", "especial"], correct: 1, why: "Thiết kế riêng cho một mục đích ⇒ specially + V3." },
        ],
      },

      { t: "h", text: "Phần IV — Dịch Việt → Anh (6 câu)" },
      {
        t: "quiz",
        id: "t4d10-bt-dich",
        kind: "translate",
        title: "Dịch — dùng từ và khung câu trong gợi ý",
        grammar: "evoke memories of · win critical acclaim · While I accept that…, I would argue that… · This reasoning holds for… · Granted, … · provided that…",
        items: [
          { q: "Bài hát này gợi lại ký ức về tuổi thơ của tôi.", answers: ["This song evokes memories of my childhood.", "The song evokes memories of my childhood."], hint: "evoke memories of" },
          { q: "Bộ phim được giới phê bình ca ngợi nhưng không thu hút được khán giả rộng rãi.", answers: ["The film won critical acclaim but did not appeal to a wide audience.", "The film was critically acclaimed but did not appeal to a wide audience.", "The film won critical acclaim but failed to appeal to a wide audience."], hint: "win critical acclaim · appeal to a wide audience" },
          { q: "Dù tôi thừa nhận rằng nghệ thuật tốn kém, tôi cho rằng nó làm phong phú đời sống của mọi người.", answers: ["While I accept that the arts are expensive, I would argue that they enrich everyone's lives.", "While I accept that the arts are costly, I would argue that they enrich everyone's lives.", "While I accept that the arts are expensive, I would argue that they enrich people's lives."], hint: "While I accept that · the arts · I would argue that · enrich" },
          { q: "Lý lẽ này đúng với các nước giàu.", answers: ["This reasoning holds for wealthy countries.", "This reasoning holds for rich countries.", "This reasoning holds true for wealthy countries."], hint: "This reasoning holds for" },
          { q: "Đành rằng vé rất đắt. Nhưng đó là lý do để trợ cấp cho chúng, chứ không phải để đóng cửa nhà hát.", answers: ["Granted, tickets are very expensive. Yet this is an argument for subsidising them, not for closing the theatre.", "Granted, tickets are very expensive. Yet this is an argument for subsidising them, not for closing theatres.", "Granted, the tickets are very expensive. Yet this is an argument for subsidising them, not for closing the theatre."], hint: "Granted, · Yet this is an argument for + V-ing, not for + V-ing" },
          { q: "Trường học nên dạy mỹ thuật, miễn là nó không thay thế các môn chính.", answers: ["Schools should teach art, provided that it does not replace core subjects.", "Schools should teach art, provided that it does not replace the core subjects.", "Schools should teach art provided that it does not replace core subjects."], hint: "provided that · replace core subjects" },
        ],
      },

      { t: "h", text: "Phần V — Từ band 6 lên band 7: chọn câu đánh giá (5 câu)" },
      {
        t: "passage",
        title: "Thân bài band 6 (để phân tích)",
        intro: "Đề: Some people think that cities should spend public money on public art, such as sculptures and murals. Others believe that this money should be spent on more practical services. Discuss both views and give your own opinion.",
        paras: [
          { text: "On the one hand, some people think cities should spend money on public art. Firstly, sculptures and murals make cities more beautiful. Secondly, public art can attract tourists. Moreover, artists need jobs." },
        ],
      },
      {
        t: "mcq",
        id: "t4d10-bt-danh-gia",
        title: "Nâng thân bài trên lên band 7",
        items: [
          { q: "1. Câu mở nào thuật quan điểm này công bằng và tự nhiên hơn “On the one hand, some people think…”?", options: ["Some people foolishly want to waste taxpayers' money on statues.", "On the one hand, some people think cities should pay for public art, and I disagree.", "Art is very important nowadays.", "Those who favour spending on public art make two serious points."], correct: 3, why: "Gọi tên nhóm (Those who favour…) + báo trước hai lý lẽ nghiêm túc. A là người rơm (gán cho họ sự ngu ngốc); B chưa thuật đã bác; C lạc đề." },
          { q: "2. Lý do nào nên BỎ để dành chỗ đào sâu hai lý do còn lại?", options: ["Sculptures and murals make cities more beautiful.", "Artists need jobs.", "Public art can attract tourists.", "Không bỏ lý do nào — càng nhiều càng tốt."], correct: 1, why: "“Artists need jobs” là lý do yếu nhất: nghề nào cũng cần việc làm, nên nó không giải thích vì sao TIỀN CÔNG phải chi cho nghệ thuật. Band 7: 2 lý do đào sâu > 3 lý do lướt." },
          { q: "3. Câu nào ĐÀO SÂU lý do “public art can attract tourists” tốt nhất?", options: ["A single striking sculpture can become the image on a city's postcards, drawing visitors who then spend money in local cafés and hotels.", "Tourism is very important for cities in modern society.", "Tourists like many things in cities.", "Furthermore, tourists also like art."], correct: 0, why: "Có hình ảnh cụ thể (tấm bưu thiếp) + hệ quả (tiền chi ở quán, khách sạn). Ba câu còn lại chỉ lặp ý bằng từ chung chung." },
          { q: "4. Câu ĐÁNH GIÁ nào hợp để kết thân bài này (người viết nghiêng về dịch vụ thiết thực)?", options: ["However, I do not agree with this view.", "Moreover, murals can also cover ugly walls.", "This reasoning holds for a few landmark works in city centres, which visitors actually come to see. It is less convincing, however, when applied to the many small pieces in residential districts, where people would rather see their roads repaired.", "In conclusion, both views have advantages."], correct: 2, why: "Phép ① giới hạn phạm vi: đúng với vài công trình biểu tượng ở trung tâm, kém thuyết phục với tác phẩm nhỏ ở khu dân cư. A chỉ lặp ý kiến; B là lý do mới; D là câu kết bài vô nghĩa." },
          { q: "5. Thesis nào khớp với câu đánh giá ở câu 4?", options: ["This essay will discuss both views.", "I believe that a modest budget for landmark public art is justified, whereas most of the money should go to practical services such as roads and libraries.", "I totally agree that cities must never spend anything on art.", "Public art and public services are both important."], correct: 1, why: "Khuôn chia phạm vi, khớp đúng đường ranh mà câu đánh giá vạch ra (công trình biểu tượng ↔ phần lớn ngân sách cho dịch vụ). C cực đoan, mâu thuẫn với phần nhượng bộ." },
        ],
      },

      { t: "h", text: "Phần VI — Idiom của bài Nói (5 câu)" },
      {
        t: "quiz",
        id: "t4d10-bt-idiom",
        kind: "fill",
        title: "Điền MỘT từ",
        items: [
          { q: "1. There was a steep learning ___ when I first picked up the violin.", answers: ["curve"] },
          { q: "2. The design is over a century old, yet it has stood the ___ of time.", answers: ["test"] },
          { q: "3. I've always had a soft ___ for hand-painted signs.", answers: ["spot"] },
          { q: "4. Put me in a workshop full of tools and I'm in my ___ .", answers: ["element"] },
          { q: "5. It isn't valuable, but it has great sentimental ___ .", answers: ["value"] },
        ],
      },

      { t: "h", text: "Phần VII — Ghép câu (3 câu)" },
      {
        t: "build",
        id: "t4d10-bt-ghep",
        title: "Bấm các mảnh theo đúng thứ tự",
        items: [
          { vi: "Phải nhiều năm sau tôi mới nhận ra nó có ý nghĩa gì.", chips: ["It was only", "years later", "that", "I realised", "what it meant.", "when", "did I realise"], answer: ["It was only", "years later", "that", "I realised", "what it meant."] },
          { vi: "Điều làm nó cuốn hút là bạn không thể vội.", chips: ["What makes it", "so absorbing", "is that", "you can't", "rush.", "which", "absorbed"], answer: ["What makes it", "so absorbing", "is that", "you can't", "rush."] },
          { vi: "Nếu phó mặc cho thị trường, nhạc truyền thống sẽ biến mất.", chips: ["Left to", "the market,", "traditional music", "would", "disappear.", "Leaving to", "will"], answer: ["Left to", "the market,", "traditional music", "would", "disappear."] },
        ],
      },

      { t: "h", text: "Phần VIII — Viết một thân bài có đánh giá (15 phút)" },
      {
        t: "essay",
        id: "t4d10-bt-viet",
        task: "Task 2",
        prompt: "Viết MỘT thân bài (100–130 từ) cho đề sau, thuật quan điểm THỨ NHẤT rồi đánh giá nó. ĐỀ: Some people think that cities should spend public money on public art, such as sculptures and murals. Others believe that this money should be spent on more practical services. Discuss both views and give your own opinion. — Khung: (1) Those who favour… + động từ thuật; (2) lý do 1 đào sâu (một hình ảnh cụ thể); (3) lý do 2 đào sâu; (4) 1–2 câu đánh giá: This reasoning holds for… It is less convincing, however, when applied to… HOẶC Granted,… Yet…",
        minWords: 100,
        tips: [
          "Không dùng On the one hand / Firstly / Secondly / Moreover.",
          "Chỉ 2 lý do; mỗi lý do có “vì sao” hoặc một ví dụ cụ thể.",
          "Câu cuối phải cho người đọc biết BẠN nghĩ lập luận này đúng tới đâu.",
          "Dùng 2–3 từ của bài Từ vựng: mural, sculpture, striking, enrich, a sense of identity, a luxury rather than a necessity.",
        ],
      },

      { t: "h", text: "Phần IX — Nói: thẻ Part 2 mới" },
      {
        t: "note",
        title: "📌 Trước khi bấm ghi âm",
        items: [
          "1 phút ghi chú 4 nhánh; đánh dấu ★ hai chỗ đặt idiom (gợi ý: have seen better days · sentimental value · I've a soft spot for · it's grown on me).",
          "Dùng ít nhất 3 động tác kể: phóng to một chi tiết · lùi về quá khứ · giả định (If it were ever lost…).",
          "Nghe lại: âm cuối /dʒ/ /tʃ/ trong age, bridge, much, watch có còn không?",
        ],
      },
      {
        t: "speak",
        id: "t4d10-bt-noi",
        part: "2",
        questions: [
          "Describe something you own that you have kept for a long time. You should say: what it is, how you got it, what condition it is in now, and explain why you have kept it for so long.",
        ],
      },
    ],
  },
];
